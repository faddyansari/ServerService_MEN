//Created By Saad Ismail Shaikh 
// 07-08-2018

import { SessionManager } from "../../globals/server/sessionsManager";
import { Conversations } from "../../models/conversationModel";
import { ObjectID } from "bson";



//See Schemas For Reference
//Visitor = VisitorSession
//Agents = AgentSession
export async function InviteToChat(visitor, agent, greetingMessage = 'Hello.. How may i Help You ?'): Promise<any | undefined> {
    try {
        // visitor.state = 4
        visitor.agent = { id: agent.id, name: agent.nickname };
        if (!visitor.username) visitor.username = 'Guest' + new Date().toLocaleTimeString().split(':').join('').split(' ')[0];
        if (!visitor.email) visitor.email = 'UnRegistered';
        let cid = new ObjectID();
        let message: any;
        let UpdatedSessions = await SessionManager.AssignAgent(visitor, (agent._id || agent.id as string), cid, 4);
        if (UpdatedSessions && UpdatedSessions.agent) {
            let conversation = await Conversations.createConversation(cid, visitor.email, visitor.id, agent.nsp, visitor.viewColor, agent.email, visitor.username, 2, visitor.deviceID);
            if (greetingMessage) {
                message = {
                    from: agent.nickname,
                    to: visitor.username,
                    body: greetingMessage,
                    cid: (conversation) ? conversation.insertedId : undefined,
                    date: new Date().toISOString(),
                    type: "Agents",
                    attachment: false,
                    filename: undefined
                }

            }
            // if Conversation is Successfully Inserted then MongoDb Returns InsertedWriteResult
            //InsertedWriteResult Object Contains insertedCount Property which Denotes the Count of Documents Inserted
            //If Document is inserted successfully the its InsertedCount Porperty Must Be Greater than Zero. 
            if (conversation && conversation.insertedCount > 0) {
                if (visitor.url && visitor.url.length) await SessionManager.UpdateChatInitiatedDetails(visitor._id || visitor.id, visitor.url[visitor.url.length - 1], 'Agent', ((UpdatedSessions.visitor.state == 4) || (UpdatedSessions.visitor.state == 5)) ? true : false)
                visitor.conversationID = conversation.insertedId;

                if (message) {
                    let insertedMessage = await Conversations.insertMessage(message);
                    await Conversations.UpdateLastMessage((conversation.insertedId) as any, message);
                    if (insertedMessage && insertedMessage.ops.length > 0) {
                        conversation.ops[0].messages.push(message);
                    }
                }
            }
            return Promise.resolve({ visitor: UpdatedSessions.visitor, agent: UpdatedSessions.agent, conversation: (conversation) ? conversation.ops[0] : undefined });
        }
        return Promise.resolve(undefined);

    } catch (error) {
        console.log(error);
        console.log('Error in InviteToChat');
        return Promise.resolve(undefined);
    }
}
