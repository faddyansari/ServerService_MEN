import { VisitorSessionSchema } from "../../schemas/VisitorSessionSchema";
import { SessionManager } from "../../globals/server/sessionsManager";
import { ObjectID } from "bson";
import { Conversations } from "../../models/conversationModel";
import { Agents } from "../../models/agentModel";
import { Visitor } from "../../models/visitorModel";
import { AgentSessionSchema } from "../../schemas/agentSessionSchema";
import { CreateLogMessage } from "../GlobalActions/CreateMessage";
import { ComposedENUM, EventLogMessages, DynamicEventLogs } from "../../globals/config/enums";
import { __biZZC_SQS } from "../aws/aws-sqs";
import { __BIZZ_REST_REDIS_PUB } from "../../globals/__biZZCMiddleWare";

export async function AssignChatToVisitorAuto(visitor: VisitorSessionSchema, email?: string): Promise<boolean> {

    try {

        let UpdatedSessions = await SessionManager.AllocateAgent(visitor, new ObjectID(visitor.conversationID));
        let newAgent = UpdatedSessions.agent;
        visitor = UpdatedSessions.visitor;


        if (UpdatedSessions && newAgent) {
            let conversation = (newAgent.email) ? await Conversations.TransferChat(visitor.conversationID, newAgent.email, false) : undefined;
            if (conversation && conversation.value) {

                (conversation.value.messageReadCount)
                    ? conversation.value.messages = await Conversations.getMessages1((visitor as VisitorSessionSchema).conversationID)
                    : [];

                let payload = { id: (visitor as VisitorSessionSchema)._id || (visitor as VisitorSessionSchema).id, session: visitor }
                // let event = 'Chat auto Assigned to ' + newAgent.email + ' from ' + newAgent.email;
                let event = ComposedENUM(DynamicEventLogs.CHAT_AUTO_ASSIGNED_TO, { newEmail: newAgent.email, oldEmail: '' })
                let loggedEvent = await __biZZC_SQS.SendEventLog(event, ((visitor as VisitorSessionSchema)._id) ? (visitor as VisitorSessionSchema)._id : (visitor as VisitorSessionSchema).id);
                // if (loggedEvent) SocketServer.of(visitor.nsp).to(Agents.NotifyAll()).emit('visitorEventLog', loggedEvent);

                let chatEvent = 'Chat auto Assigned to ' + (newAgent.username || newAgent.name || newAgent.nickname);
                let insertedMessage = await CreateLogMessage({
                    from: visitor.agent.name,
                    to: (visitor.username) ? visitor.agent.name || (visitor.agent as any).nickname : '',
                    body: chatEvent,
                    type: 'Events',
                    cid: (visitor.conversationID) ? visitor.conversationID : '',
                    attachment: false,
                    date: new Date().toISOString(),
                    delivered: true,
                    sent: true
                })
                console.log('AssignChatToVisitorAuto');
                //console.log(conversation);
                let promises = await Promise.all([
                    await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: visitor.nsp, roomName: [Agents.NotifyAll()], data: payload }),
                    await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'newConversation', nsp: visitor.nsp, roomName: [Agents.NotifyOne(visitor)], data: conversation.value }),
                    await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'V', broadcast: false, eventName: 'transferChat', nsp: visitor.nsp, roomName: [Visitor.NotifyOne(visitor as VisitorSessionSchema)], data: { agent: (visitor as VisitorSessionSchema).agent, event: chatEvent } }),
                ])

            }
        }
        return true;

    } catch (error) {
        console.log(error);
        console.log('Error in AssignChatToVisitor Abstraction');
        return false;
    }


}


export async function TransferAgentDisconnect(pendingVisitor: VisitorSessionSchema, visitorID: string, agent: AgentSessionSchema, id: string | ObjectID) {

    try {


        let UpdatedSessions = (await SessionManager.AllocateAgent(pendingVisitor, new ObjectID(pendingVisitor.conversationID), [id]));
        // let UpdatedSessions = (await SessionManager.AllocateAgent(pendingVisitor, new ObjectID(pendingVisitor.conversationID), [(agent.id || agent._id)]));
        let newAgent = UpdatedSessions.agent;
        pendingVisitor = UpdatedSessions.visitor;

        if (UpdatedSessions && newAgent) {
            let conversation = (newAgent.email) ? await Conversations.TransferChatUnmodified((pendingVisitor as VisitorSessionSchema).conversationID, newAgent.email, false) : undefined;
            if (conversation && conversation.value) {

                (conversation.value.messageReadCount)
                    ? conversation.value.messages = await Conversations.getMessages1((pendingVisitor as VisitorSessionSchema).conversationID)
                    : [];

                let payload = { id: (pendingVisitor as VisitorSessionSchema)._id || (pendingVisitor as VisitorSessionSchema).id, session: pendingVisitor }
                // let event = 'Chat auto transferred to ' + newAgent.email + ' from ' + agent.email;
                //                let event = 'Chat auto transferred to ' + newAgent.email + ((agent && agent.email) ? ' from ' + agent.email : '');
                let event = ComposedENUM(DynamicEventLogs.CHAT_AUTO_TRANSFERED, { newEmail: newAgent.email, oldEmail: (agent && agent.email) ? agent.email : '' })
                let loggedEvent = await __biZZC_SQS.SendEventLog(event, ((pendingVisitor as VisitorSessionSchema)._id) ? (pendingVisitor as VisitorSessionSchema)._id : (pendingVisitor as VisitorSessionSchema).id);
                // if (loggedEvent) SocketServer.of(agent.nsp).to(Agents.NotifyAll()).emit('visitorEventLog', loggedEvent);
                let chatEvent = 'Chat auto transferred to ' + (newAgent.name || newAgent.username || newAgent.nickname) + ((agent && agent.email) ? ' from ' + ((agent as any).name || (agent as any).username || agent.nickname) : '');

                let promises = await Promise.all([
                    await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: agent.nsp, roomName: [Agents.NotifyAll()], data: payload }),
                    await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'newConversation', nsp: agent.nsp, roomName: [Agents.NotifyOne(pendingVisitor)], data: conversation.value }),
                    await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'V', broadcast: false, eventName: 'transferChat', nsp: agent.nsp, roomName: [Visitor.NotifyOne(pendingVisitor as VisitorSessionSchema)], data: { agent: (pendingVisitor as VisitorSessionSchema).agent, event: chatEvent }, event: chatEvent }),
                ])

            }
        } else {
            let pendingVisitor = await SessionManager.UnseAgentFromVisitor(visitorID);
            if (pendingVisitor) {

                let queEvent = ComposedENUM(DynamicEventLogs.VISITOR_UNASSIGNED, { newEmail: '', oldEmail: agent.email })
                let logEvent = await __biZZC_SQS.SendEventLog(queEvent, ((pendingVisitor as VisitorSessionSchema)._id) ? (pendingVisitor as VisitorSessionSchema)._id : (pendingVisitor as VisitorSessionSchema).id);

                let promises = await Promise.all([
                    await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'noAgent', nsp: agent.nsp, roomName: [visitorID], data: { state: 2, agent: pendingVisitor.agent } }),
                    await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: agent.nsp, roomName: [Agents.NotifyAll()], data: { id: pendingVisitor.id, session: pendingVisitor } })
                ]);
                // if (logEvent) SocketServer.of(agent.nsp).to(Agents.NotifyAll()).emit('visitorEventLog', logEvent);
                await Conversations.UpdateConversationState(pendingVisitor.conversationID, 1, false);


            }
        }

    } catch (error) {
        console.log(error);
        console.log('error in Transfer Agent Disconnect');
    }

}


export async function AutoAssignFromQueueAuto(session: VisitorSessionSchema | AgentSessionSchema, agent = false) {

    try {

        let promises = await Promise.all([
            SessionManager.GetAgentByID((!agent) ? (session as VisitorSessionSchema).agent.id : ((session as AgentSessionSchema)._id as string)),
            SessionManager.GetQueuedSession(session.nsp),
        ]);
        let Agent = promises[0];
        let QueuedSession = promises[1];    
        if (Agent && Agent.chatCount < Agent.concurrentChatLimit && QueuedSession) {
            console.log('dequeuing');
            let UpdatedSessions = await SessionManager.AssignAgent(QueuedSession, (Agent.id || Agent._id as string), QueuedSession.conversationID);
            QueuedSession = UpdatedSessions.visitor;
            Agent = UpdatedSessions.agent;
            await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: session.nsp, roomName: [Agents.NotifyAll()], data: { id: QueuedSession.id, session: QueuedSession } })

            if (QueuedSession && Agent) {

                let Queuedconversation = await Conversations.TransferChatUnmodified(QueuedSession.conversationID, Agent.email);
                if (Queuedconversation) {
                    if (Queuedconversation.value) {

                        let logEvent = await __biZZC_SQS.SendEventLog(EventLogMessages.REQUEST_FROM_QUEUE, (QueuedSession._id) ? QueuedSession._id : QueuedSession.id);
                        // if (logEvent) SocketServer.of(session.nsp).to(Agents.NotifyAll()).emit('visitorEventLog', logEvent);

                        Queuedconversation.value.messages = await Conversations.getMessages1(QueuedSession.conversationID);
                        let promises = await Promise.all([
                            await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'newConversation', nsp: session.nsp, roomName: [Agents.NotifyOne(QueuedSession)], data: Queuedconversation.value }),
                            await __BIZZ_REST_REDIS_PUB.SendMessage({
                                action: 'emit', to: 'V', broadcast: true, eventName: 'gotAgent', nsp: session.nsp, roomName: [Visitor.NotifyOne(QueuedSession)], data: {
                                    agent: QueuedSession.agent,
                                    cid: QueuedSession.conversationID,
                                    state: QueuedSession.state,
                                    username: QueuedSession.username,
                                    email: QueuedSession.email
                                }
                            })
                        ]);
                        return true;
                    }
                }
                return true;
            } else return false;
        } else return false;

    } catch (error) {
        console.log(error);
        console.log('error in Assigning From Queue');
        return false;
    }


}



export async function AssignQueuedChatToManual(session: AgentSessionSchema, sid: string): Promise<boolean> {
    try {
        console.log('AssignQueuedChatToManual');
        // let origin = SocketServer.of(session.nsp);

        let UpdatedSessions = await SessionManager.AssignQueuedVisitor(session, sid);
        if (UpdatedSessions && UpdatedSessions.agent) {
            session = UpdatedSessions.agent;
            let QueuedSession = UpdatedSessions.visitor;
            //Updating COnversation to Database.
            let conversation = (session.email) ? await Conversations.TransferChat(QueuedSession.conversationID, session.email, false) : undefined;
            if (conversation && conversation.value) {

                let logEvent = await __biZZC_SQS.SendEventLog(EventLogMessages.REQUEST_FROM_QUEUE, (QueuedSession._id) ? QueuedSession._id : QueuedSession.id);
                // if (logEvent) SocketServer.to(Agents.NotifyAll()).emit('visitorEventLog', logEvent);


                conversation.value.messages = await Conversations.getMessages1(QueuedSession.conversationID);

                let promises = await Promise.all([
                    await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: session.nsp, roomName: [Agents.NotifyAll()], data: { id: QueuedSession.id, session: QueuedSession } }),
                    //UPDATE QUEUED SESSION VIA PUSH MESSAGE
                    await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'V', broadcast: false, eventName: 'gotAgent', nsp: session.nsp, roomName: [Visitor.NotifyOne(QueuedSession)], data: { agent: QueuedSession.agent, state: 3 } }),
                    //UPDATE ASSIGNED AGENT CONVERSATIIONS 
                    await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'newConversation', nsp: session.nsp, roomName: [Agents.NotifyOne(QueuedSession)], data: conversation.value })

                ]);





            }
        }

        return true;

    } catch (error) {
        console.log(error);
        console.log('Error in AssignChatToVisitor Abstraction');
        return false;
    }


}


export async function AssignChatFromInactive(session: VisitorSessionSchema, AgentEmail?: string, state?: number) {


    try {

        console.log('AssignChatFromInactive');

        let convo = await Conversations.GetConversationById(session.conversationID)

        if (!convo.length) return false;

        let oldagent;
        oldagent = await SessionManager.getAgentByEmail(session.nsp, convo[0].agentEmail)
        // if (oldagent) console.log(oldagent);

        let UpdatedSessions;
        if (AgentEmail) {
            UpdatedSessions = await SessionManager.AllocateAgentPriority(session, AgentEmail, session.conversationID, (state) ? state : undefined);

        } else {

            UpdatedSessions = await SessionManager.AllocateAgent(session, new ObjectID(session.conversationID), [], (state) ? state : undefined);
        }


        if (UpdatedSessions && UpdatedSessions.agent) {
            let newAgent = UpdatedSessions.agent;

            let visitor = UpdatedSessions.visitor;
            let conversation = (newAgent.email) ? await Conversations.TransferChat(visitor.conversationID, newAgent.email, false) : undefined;
            if (conversation && conversation.value) {

                (conversation.value.messageReadCount)
                    ? conversation.value.messages = await Conversations.getMessages1((visitor as VisitorSessionSchema).conversationID)
                    : [];

                let payload = { id: (visitor as VisitorSessionSchema)._id || (visitor as VisitorSessionSchema).id, session: visitor }
                let event = '';
                if (newAgent.email != AgentEmail) event = ComposedENUM(DynamicEventLogs.CHAT_AUTO_ASS_INACTIVE_DIFF_AGENT, { newEmail: newAgent.email, oldEmail: (AgentEmail) ? AgentEmail : '' })
                else event = ComposedENUM(DynamicEventLogs.CHAT_RE_ASSIGNED, { newEmail: newAgent.email, oldEmail: '' })

                let loggedEvent = await __biZZC_SQS.SendEventLog(event, ((visitor as VisitorSessionSchema)._id) ? (visitor as VisitorSessionSchema)._id : (visitor as VisitorSessionSchema).id);
                // if (loggedEvent) SocketServer.of(visitor.nsp).to(Agents.NotifyAll()).emit('visitorEventLog', loggedEvent);
                let chatEvent = '';
                (newAgent.email != AgentEmail) ? chatEvent = 'Chat auto Assigned to ' + (newAgent.username || newAgent.name || newAgent.nickname) : chatEvent = 'Chat Re-assigned to ' + (newAgent.username || newAgent.name || newAgent.nickname);
                let insertedMessage = await CreateLogMessage({
                    from: visitor.agent.name,
                    to: (visitor.username) ? visitor.agent.name || (visitor.agent as any).nickname : '',
                    body: chatEvent,
                    type: 'Events',
                    cid: (visitor.conversationID) ? visitor.conversationID : '',
                    attachment: false,
                    date: new Date().toISOString(),
                    delivered: true,
                    sent: true
                });


                if (insertedMessage) conversation.value.messages.push(insertedMessage)

                await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: session.nsp, roomName: [Agents.NotifyAll()], data: payload })


                if (oldagent && (oldagent.nickname != newAgent.nickname) && (oldagent.email != newAgent.email)) {
                    await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'newConversation', nsp: visitor.nsp, roomName: [Agents.NotifyOne(visitor)], data: conversation.value })

                    if (conversation && conversation.value)
                        await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'removeConversation', nsp: visitor.nsp, roomName: [Agents.NotifyOne(session)], data: { conversation: conversation.value } })

                }
                else await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'makeConversationActive', nsp: visitor.nsp, roomName: [Agents.NotifyOne(session)], data: { conversation: conversation.value } })

                await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'V', broadcast: false, eventName: 'transferChat', nsp: visitor.nsp, roomName: [Visitor.NotifyOne(visitor as VisitorSessionSchema)], data: { agent: (visitor as VisitorSessionSchema).agent, event: chatEvent } })



            }
            return true;
        }
        return false;


    } catch (error) {
        console.log(error);
        console.log('error in Assign Chat To Priority Abstraction');
    }

}