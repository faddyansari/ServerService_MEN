import { VisitorSessionSchema } from "../../schemas/VisitorSessionSchema";
import { SessionManager } from "../../globals/server/sessionsManager";
import { AgentSessionSchema } from "../../schemas/agentSessionSchema";
import { ObjectID } from "mongodb";
import { Conversations } from "../../models/conversationModel";
import { Agents } from "../../models/agentModel";
import { Visitor } from "../../models/visitorModel";
import { EventLogMessages } from "../../globals/config/enums";
import { __biZZC_SQS } from "../aws/aws-sqs";
import { Company } from "../../models/companyModel";
import { __BIZZ_REST_REDIS_PUB } from "../../globals/__biZZCMiddleWare";








export async function AutomaticEngagement(visitorSession: VisitorSessionSchema, state?: number) {
    try {

        let session = (await SessionManager.GetVisitorByID(visitorSession.id || visitorSession._id)) as VisitorSessionSchema;
        session.username = session.username || 'Guest' + new Date().toLocaleTimeString().split(':').join('').split(' ')[0];
        session.email = session.email || 'UnRegistered';
        if (!session) return;

        let origin = await Company.getSettings(session.nsp);
        let greetingMessage: string = origin[0]['settings']['chatSettings']['greetingMessage'];

        let chatOnInvitation: boolean = origin[0]['settings']['chatSettings']['permissions']['invitationChatInitiations'];
        // let allAgents = await SessionManager.GetAllActiveAgentsChatting(session);
        let allAgents = (chatOnInvitation) ? await SessionManager.GetAllActiveAgentsChatting(session) : await SessionManager.GetChattingAgentsForInvite(session);
        if (!session.username) session.username = 'Guest' + new Date().toLocaleTimeString().split(':').join('').split(' ')[0];
        if (!session.email) session.email = session.email || 'Unregistered';

        if (!allAgents) {
            return;
        } else {
            //Allocating Agent From BestFit Method || Manual Assignment If State == 4
            let allocatedAgent: AgentSessionSchema | undefined;
            // let cid: ObjectID = (chatOnInvitation) ? new ObjectID() : '';
            let cid: ObjectID = new ObjectID();
            // console.log(origin['settings']['chatSettings']['assignments']);
            if (origin[0]['settings']['chatSettings']['assignments'].priorityAgent.trim() && chatOnInvitation) {
                //#region Code To Allow Automatic Engagement When Priority Agent Is Active

                let UpdatedSessions;

                if (chatOnInvitation) UpdatedSessions = await SessionManager.AllocateAgentPriority(session, origin[0]['settings']['chatSettings']['assignments'].priorityAgent.trim(), cid, (state) ? state : undefined);
                else {
                    // session.state = 5;
                    UpdatedSessions = await SessionManager.UpdateSession((session._id) ? session._id : session.id, session,(chatOnInvitation) ? 4 : 5,session.state );
                }

                if (UpdatedSessions && (UpdatedSessions.agent || !chatOnInvitation)) {
                    allocatedAgent = (UpdatedSessions.agent) ? UpdatedSessions.agent : '';
                    session = (UpdatedSessions.visitor) ? UpdatedSessions.visitor : session;
                    if (allocatedAgent) {

                        //Creating Conversation in Database
                        //Conversation States:
                        // 1. Conversation Created But No Agent Assignend
                        // 2. Conversation Created and Got agent
                        // 3. Conversation Ended

                        let conversation;
                        if (!chatOnInvitation) conversation = await Conversations.createConversation(cid, (session.email as string), (session.id as string), session.nsp, session.viewColor, allocatedAgent.email, session.username, 2, session.deviceID);


                        if (conversation) {
                            let logEvent = await __biZZC_SQS.SendEventLog(EventLogMessages.CHAT_INITIATED, (session._id) ? session._id : session.id);
                            if (session.url && session.url.length) await SessionManager.UpdateChatInitiatedDetails(session._id || session.id, session.url[session.url.length - 1], 'Agent',((session.state == 4) || (session.state == 5)) ? true : false)
                            // if (logEvent) origin.to(Agents.NotifyAll()).emit('visitorEventLog', logEvent);
                        }
                        //Visitor State Data to Update
                        let payload = { id: session.id, session: session };

                        if (allocatedAgent.greetingMessage) greetingMessage = allocatedAgent.greetingMessage;
                        let lastMessage;
                        if (greetingMessage) {

                            lastMessage = {
                                from: session.nsp.substr(1),
                                to: session.username,
                                body: greetingMessage,
                                cid: (conversation && conversation.insertedId) ? conversation.insertedId.toHexString() : '',
                                date: (new Date()).toISOString(),
                                type: 'Agents',
                                attachment: false
                            }
                            if (conversation && conversation.insertedCount) {
                                let messageinsertedID = await Conversations.insertMessage(lastMessage);
                                conversation.ops[0].messages.push(messageinsertedID.ops[0]);
                                await Conversations.UpdateLastMessage(conversation.insertedId.toHexString(), lastMessage);
                            }
                            //console.log(conversation.ops[0])
                        }

                        //Notify Allocated Agent That A New Conversation has been autoAssigned. 
                        //Check if Allocated Agent is Still Active. Just a precautionary Case. 

                        if (conversation && conversation.insertedCount) {
                            if (allocatedAgent)
                                await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'newConversation', nsp: session.nsp, roomName: [(allocatedAgent.id as string)], data: conversation.ops[0] })

                            // origin.to((allocatedAgent.id as string)).emit('newConversation', conversation.ops[0]);
                        }
                        //Broadcast To All Agents That User Information and State Has Been Updated.
                        await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: session.nsp, roomName: [Agents.NotifyAll()], data: payload })

                        let loggedEvent = await await __biZZC_SQS.SendEventLog(EventLogMessages.VISITOR_INVITED, (session._id) ? session._id : session.id);
                        // if (loggedEvent) origin.to(Agents.NotifyAll()).emit('visitorEventLog', loggedEvent);

                        let newEngagement: any = {
                            clientID: (conversation && conversation.ops[0] && conversation.ops[0].clientID) ? conversation.ops[0].clientID : '',
                            state: (chatOnInvitation) ? 4 : 5,
                            username: session.username,
                            email: session.email,
                            agent: session.agent,
                            greetingMessage: (conversation && conversation.ops[0].messages.length) ? conversation.ops[0].messages[0] : (lastMessage) ? lastMessage : '',
                            cid: (session.conversationID) ? session.conversationID : ''
                        }
                        await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'newEngagement', nsp: session.nsp, roomName: [Visitor.NotifyOne(session)], data: newEngagement })




                    } else {
                        //TODO SHOW TICKET FORM IF THERE IS A REQUIREMENT.
                    }

                } else {
                    //console.log('No Agent')
                    return;
                }

                //#endregion
            } else {

                let UpdatedSessions;

                if (chatOnInvitation) UpdatedSessions = await SessionManager.AllocateAgent(session, cid, [], (chatOnInvitation) ? 4 : 5);
                else {
                    session.state = 5;
                    UpdatedSessions = await SessionManager.UpdateSession((session._id) ? session._id : session.id, session,(chatOnInvitation) ? 4 : 5,session.state );
                }

                if (UpdatedSessions && (UpdatedSessions.agent || !chatOnInvitation)) {
                    allocatedAgent = (UpdatedSessions.agent) ? UpdatedSessions.agent : '';
                    session = (UpdatedSessions.visitor) ? UpdatedSessions.visitor : session;
                    //Creating Conversation in Database
                    //Conversation States:
                    // 1. Conversation Created But No Agent Assignend
                    // 2. Conversation Created and Got agent
                    // 3. Conversation Ended

                    let conversation;
                    if (chatOnInvitation) conversation = await Conversations.createConversation(cid, (session.email as string), (session.id as string), session.nsp, session.viewColor, (allocatedAgent) ? allocatedAgent.email : '', (session.username as string), (allocatedAgent) ? 2 : 1, session.deviceID);

                    // if Conversation is Successfully Inserted then MongoDb Returns InsertedWriteResult
                    //InsertedWriteResult Object Contains insertedCount Property which Denotes the Count of Documents Inserted
                    //If Document is inserted successfully the its InsertedCount Porperty Must Be Greater than Zero. 


                    //if (conversation && conversation.insertedCount) {
                    let payload = { id: session.id, session: session }

                    if (conversation) {
                        let logEvent = await __biZZC_SQS.SendEventLog(EventLogMessages.CHAT_INITIATED, (session._id) ? session._id : session.id);
                        if (session.url && session.url.length) await SessionManager.UpdateChatInitiatedDetails(session._id || session.id, session.url[session.url.length - 1], 'Agent',((session.state == 4) || (session.state == 5)) ? true : false)
                        // if (logEvent) origin.to(Agents.NotifyAll()).emit('visitorEventLog', logEvent);
                    }

                    if (allocatedAgent && allocatedAgent.greetingMessage) greetingMessage = allocatedAgent.greetingMessage;

                    let lastMessage;

                    if (greetingMessage) {
                        lastMessage = {
                            from: session.nsp.substr(1),
                            to: session.username,
                            body: greetingMessage,
                            cid: (conversation && conversation.insertedId) ? conversation.insertedId.toHexString() : '',
                            date: (new Date()).toISOString(),
                            type: 'Agents',
                            attachment: false
                        }
                        if (conversation && conversation.insertedCount) {
                            let messageinsertedID = await Conversations.insertMessage(lastMessage);
                            conversation.ops[0].messages.push(messageinsertedID.ops[0]);
                            await Conversations.UpdateLastMessage(conversation.insertedId.toHexString(), lastMessage);
                        }
                    }

                    //Update User Status Back to Visitor Window
                    //Check if Allocated Agent is Still Active. Just a precautionary Case. 
                    if (allocatedAgent && conversation) {
                        await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'newConversation', nsp: session.nsp, roomName: [(allocatedAgent.id as string)], data: conversation.ops[0] })

                    }
                    //Broadcast To All Agents That User Information and State Has Been Updated.
                    await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: session.nsp, roomName: [Agents.NotifyAll()], data: payload })


                    let loggedEvent = await __biZZC_SQS.SendEventLog(EventLogMessages.VISITOR_INVITED, (session._id) ? session._id : session.id);
                    // if (loggedEvent) origin.to(Agents.NotifyAll()).emit('visitorEventLog', loggedEvent);


                    let newEngagement: any = {
                        clientID: (conversation && conversation.ops[0] && conversation.ops[0].clientID) ? conversation.ops[0].clientID : '',
                        state: (chatOnInvitation) ? 4 : 5,
                        username: session.username,
                        email: session.email,
                        agent: session.agent,
                        greetingMessage: (conversation && conversation.ops[0].messages.length) ? conversation.ops[0].messages[0] : (lastMessage) ? lastMessage : '',
                        cid: (session.conversationID) ? session.conversationID : ''
                    }

                    await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'newEngagement', nsp: session.nsp, roomName: [Visitor.NotifyOne(session)], data: newEngagement })

                }
                return;

            }

        }

    }
    catch (error) {
        let session = (await SessionManager.GetVisitorByID(visitorSession)) as VisitorSessionSchema;
        await SessionManager.UpdateSession(session.id || session._id, session);
        console.log(error);
        console.log('Error in Automatic Engagement');

    }

}



