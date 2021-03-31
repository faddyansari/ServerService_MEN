"use strict";
// //Created By Saad Ismail Shaikh 
// // 01-08-2018
// //Updated By Saad Ismail shaikh
// //Date :  12-12-2018 After Multple Agent Locations
// import { SessionManager } from '../globals/server/sessionsManager';
// import { Agents } from '../models/agentModel';
// import { Conversations } from '../models/conversationModel';
// import { Visitor } from '../models/visitorModel';
// import { VisitorSessionSchema } from '../schemas/VisitorSessionSchema';
// import { WorkFlow } from '../schemas/chatbot/workflows';
// import { __BizzHandshake, __BizzSocket, SocketListener } from '../globals/server/socketlistener';
// import { AgentSessionSchema } from '../schemas/agentSessionSchema';
// import { ObjectID } from 'mongodb';
// import { ContactSessionManager } from '../globals/server/contactSessionsManager';
// import { Contacts } from '../models/contactModel';
// import { CreateLogMessage } from '../actions/GlobalActions/CreateMessage';
// import { ComposedENUM, DynamicEventLogs } from '../globals/config/enums';
// import { __biZZC_SQS } from '../actions/aws/aws-sqs';
// export class ConnectionHandler {
//     public static BindConnectivityEvents(socket, origin: SocketIO.Namespace) {
//         switch (socket.handshake.session.type) {
//             case 'Agents':
//                 //Updated After Multple Agent Locations
//                 ConnectionHandler.AutoDisconnectionEventAgents(socket, origin);
//                 //Updated After Multple Agent Locations
//                 ConnectionHandler.ManualDisconnectionEvent(socket, origin);
//                 break;
//             case 'Visitors':
//                 //Updated After Multple Agent Locations
//                 ConnectionHandler.AutoDisconnectionEventVisitors(socket, origin);
//                 //Updated After Multple Agent Locations
//                 ConnectionHandler.SyncVisitorState(socket, origin);
//                 break;
//             case 'Contact':
//                 //Updated After Multple Agent Locations
//                 ConnectionHandler.AutoDisconnectionEventContact(socket, origin);
//                 ConnectionHandler.ManualDisconnectContactEvent(socket, origin);
//                 break;
//         }
//     }
//     private static AutoDisconnectionEventVisitors(socket: __BizzSocket, origin: SocketIO.Namespace) {
//         socket.on('disconnect', (reason) => {
//             try {
//                 //TODO : Variable Time Which is Configurable From NameSpace Setting
//                 //let manualDisconnect = false;
//                 // console.log(reason);
//                 // console.log(reason);
//                 // console.log('Disconnection : ', Object.keys(origin.in((socket.handshake.session.id || socket.handshake.session._id) as string).sockets));
//                 switch (reason) {
//                     case 'client namespace disconnect':
//                         console.log('client namespace disconnect')
//                         //manualDisconnect = true;
//                         break;
//                     case 'server namespace disconnect':
//                         //Always Remove Session Before Disconnecting From Server Otherwise Session Will Resume On Connection
//                         break;
//                     default:
//                         origin.in((socket.handshake.session.id || socket.handshake.session._id) as string).clients((err, clients) => {
//                             if (err) {
//                                 console.log(err);
//                                 return;
//                             }
//                             // console.log('Connected Clients to Room ' + socket.handshake.session.id + ' : ' + clients.length);
//                             if (clients.length) {
//                                 // console.log('Disconnecting but Not Expiring');
//                                 this.disconnectCalls(socket, origin, 'Visitors');
//                                 return;
//                             }
//                             else {
//                                 // console.log('Disconnecting  Setting TimeStamp');
//                                 //SessionManager.SetExpiry((socket.handshake.session.id || socket.handshake.session._id) as string, 7);
//                                 this.disconnectCalls(socket, origin, 'Visitors');
//                                 // if (session.state.toString() == '3') {
//                                 //     let reciever = Agents.NotifyOne(session);
//                                 //     reciever.map(socket => { origin.to(socket).emit('typingState', { state: false }) });
//                                 // }
//                             }
//                         });
//                         break;
//                 }
//                 socket.leaveAll();
//                 socket.removeAllListeners();
//             } catch (error) {
//                 console.log(error);
//                 console.log('error in Disconnecting Socket');
//                 socket.leaveAll();
//                 socket.removeAllListeners();
//             }
//         });
//     }
//     private static AutoDisconnectionEventContact(socket: __BizzSocket, origin: SocketIO.Namespace) {
//         socket.on('disconnect', (reason) => {
//             try {
//                 //TODO : Variable Time Which is Configurable From NameSpace Setting
//                 //let manualDisconnect = false;
//                 console.log(reason);
//                 switch (reason) {
//                     case 'client namespace disconnect':
//                         console.log('client namespace disconnect')
//                         //manualDisconnect = true;
//                         return;
//                     case 'server namespace disconnect':
//                         //Always Remove Session Before Disconnecting From Server Otherwise Session Will Resume On Connection
//                         return;
//                     default:
//                         //socket.leave((socket.handshake.session.id || socket.handshake.session._id) as string);
//                         origin.in((socket.handshake.session.id || socket.handshake.session._id) as string).clients((err, clients) => {
//                             if (err) {
//                                 console.log(err);
//                                 return;
//                             }
//                             // console.log('Connected Clients to Room ' + socket.handshake.session.id + ' : ' + clients.length);
//                             if (clients.length) {
//                                 console.log('Disconnecting but Not Expiring');
//                                 this.disconnectCalls(socket, origin, 'Contact');
//                                 return;
//                             }
//                             else {
//                                 console.log('Disconnecting  Setting TimeStamp');
//                                 //Changed Disconnections Logic.
//                                 //Based on Timers Only
//                                 // SessionManager.SetExpiry((socket.handshake.session.id || socket.handshake.session._id) as string, 7);
//                                 this.disconnectCalls(socket, origin, 'Contact');
//                                 // if (session.state.toString() == '3') {
//                                 //     let reciever = Agents.NotifyOne(session);
//                                 //     reciever.map(socket => { origin.to(socket).emit('typingState', { state: false }) });
//                                 // }
//                             }
//                         });
//                         return;
//                 }
//             } catch (error) {
//                 console.log(error);
//                 console.log('error in Disconnecting Socket');
//             }
//         });
//     }
//     private static async AutoDisconnectionEventAgents(socket: __BizzSocket, origin: SocketIO.Namespace) {
//         (socket as SocketIO.Socket).on('disconnect', (reason) => {
//             //TODO CASES
//             /*
//              1. Auto Disconnect Single Device Single Socket
//                   * Same As Before (Handled)
//              2. Auto Disconnect Multiple Devices Multiple Sockets 
//                   * Do Nothing Just Remove Current Socket
//             */
//             // console.log(reason);
//             // console.log('Disconnection : ', Object.keys(origin.in((socket.handshake.session.id || socket.handshake.session._id) as string)));
//             switch (reason) {
//                 case 'client namespace disconnect':
//                     break;
//                 case 'server namespace disconnect':
//                     //To Avoid Disconnection From Manual Logout of Multiple
//                     break;
//                 default:
//                     //Case For Auto Disconnect
//                     origin.in((socket.handshake.session.id || socket.handshake.session._id) as string).clients(async (err, clients) => {
//                         if (err) {
//                             console.log(err);
//                             return;
//                         }
//                         socket.to(Visitor.BraodcastToVisitors()).emit('typingState', { state: false })
//                         // console.log('Connected Clients to Room ' + socket.handshake.session.id + ' : ' + clients.length);
//                         if (clients.length) {
//                             // console.log('Disconnecting but Not Expiring');
//                             this.disconnectCalls(socket, origin);
//                             return;
//                         }
//                         else {
//                             // console.log('Disconnecting  Setting TimeStamp');
//                             SessionManager.SetExpiry((socket.handshake.session.id || socket.handshake.session._id) as string, 10);
//                             SessionManager.updateConversationState(socket.handshake.session.nsp, socket.handshake.session.email, '', false);
//                             socket.to(Agents.NotifyAll()).emit('userTypingStatus', { from: socket.handshake.session.email, conversationState: false });
//                             this.disconnectCalls(socket, origin);
//                             // if (session.state.toString() == '3') {
//                             //     let reciever = Agents.NotifyOne(session);
//                             //     reciever.map(socket => { origin.to(socket).emit('typingState', { state: false }) });
//                             // }
//                         }
//                     });
//                     break;
//             }
//             // console.log('Disconnection Before Leaving: ', (origin as any));
//             socket.leaveAll();
//             socket.removeAllListeners();
//             // console.log('Disconnection After Leaving: ', origin);
//         });
//     }
//     private static ManualDisconnectionEvent(socket, origin: SocketIO.Namespace) {
//         //TODO CASES
//         /**
//          * @Cases
//          * 1. Manual Disconnect Single Device Single Socket
//          *  * Same As Before (Handled)
//          *
//          * 2. Manual Disconnect Single Device Multiple Socket ( WorkAround Handle On Client )
//          *  * Remove Session (Handled)
//          *  * Disconnect All Sockets (Handled)
//          *  * On Browser Fire Storage Event To Remove Local Storage Session Data (Browser WorkAround Remaining)
//          *      
//          * 3. Manual Disconnect Multiple Devices
//          *  * Disconnect Single Device Only and Remove Session Object (Handled)
//         **/
//         socket.on('logout', async (data, callback) => {
//             try {
//                 console.log('Manual logout');
//                 //console.log(session);
//                 //console.log('Manual logout');
//                 switch (socket.handshake.session.type) {
//                     case 'Agents':
//                         this.disconnectCalls(socket, origin);
//                         let session = await SessionManager.RemoveSession(socket.handshake.session, true);
//                         callback({ status: 'ok' });
//                         if (session) {
//                             let agent = session;
//                             await SocketListener.DisconnectSession(origin.name, agent.id || agent._id);
//                             origin.to(Agents.NotifyAll()).emit('agentUnavailable', { email: agent.email, session: socket.handshake.session });
//                             if (socket.handshake.session.permissions.chats.canChat) origin.to(Visitor.BraodcastToVisitors()).emit('agentUnavailable', { id: agent.id || agent._id })
//                             let ConnectedVisitors = Object.keys(agent.rooms);
//                             //console.log('After Callback');
//                             //console.log(ConnectedVisitors);
//                             switch (ConnectedVisitors.length) {
//                                 case 0:
//                                     return;
//                                 default:
//                                     let allAgents = await SessionManager.GetAllActiveAgentsChatting(agent);
//                                     //console.log(allAgents);
//                                     let ConnectedVisiorsPromise = ConnectedVisitors.map(async visitorID => {
//                                         //console.log(visitorID);
//                                         if (!allAgents) {
//                                             let pendingVisitor = await SessionManager.UnseAgentFromVisitor(visitorID);
//                                             if (pendingVisitor) {
//                                                 let queEvent = ComposedENUM(DynamicEventLogs.VISITOR_UNASSIGNED, { newEmail: '', oldEmail: agent.email })
//                                                 let logEvent = await __biZZC_SQS.SendEventLog(queEvent, (pendingVisitor._id) ? pendingVisitor._id : pendingVisitor.id);
//                                                 if (logEvent) origin.to(Agents.NotifyAll()).emit('visitorEventLog', logEvent);
//                                                 origin.to(visitorID).emit('noAgent', { state: 2, agent: pendingVisitor.agent });
//                                                 origin.to(Agents.NotifyAll()).emit('updateUser', { id: pendingVisitor.id, session: pendingVisitor });
//                                                 let conversation = await Conversations.UpdateConversationState(pendingVisitor.conversationID, 1, false);
//                                                 if (conversation && conversation.value)
//                                                     await Conversations.AddPenaltyTime(pendingVisitor.conversationID, conversation.value.agentEmail, (conversation.value.lastMessage) ? conversation.value.lastMessage.date : conversation.value.createdOn);
//                                             }
//                                             return;
//                                         } else {
//                                             let pendingVisitor = await SessionManager.GetVisitorByID(visitorID);
//                                             if (!pendingVisitor) return;
//                                             let UpdatedSessions = (await SessionManager.AllocateAgent(pendingVisitor, new ObjectID(pendingVisitor.conversationID), [(agent.id || agent._id)]));
//                                             let newAgent = UpdatedSessions.agent;
//                                             pendingVisitor = UpdatedSessions.visitor;
//                                             if (UpdatedSessions && newAgent) {
//                                                 let conversation = (newAgent.email) ? await Conversations.TransferChatUnmodified((pendingVisitor as VisitorSessionSchema).conversationID, newAgent.email) : undefined;
//                                                 if (conversation && conversation.value) {
//                                                     if (conversation && conversation.value)
//                                                         await Conversations.AddPenaltyTime((pendingVisitor as VisitorSessionSchema).conversationID, conversation.value.agentEmail, (conversation.value.lastMessage) ? conversation.value.lastMessage.date : conversation.value.createdOn);
//                                                     (conversation.value.messageReadCount)
//                                                         ? conversation.value.messages = await Conversations.getMessages1((pendingVisitor as VisitorSessionSchema).conversationID)
//                                                         : [];
//                                                     let payload = { id: (pendingVisitor as VisitorSessionSchema)._id || (pendingVisitor as VisitorSessionSchema).id, session: pendingVisitor }
//                                                     // let event = 'Chat auto transferred to ' + newAgent.email + ' from ' + agent.email;
//                                                     let event = ComposedENUM(DynamicEventLogs.CHAT_AUTO_TRANSFERED, { newEmail: newAgent.email, oldEmail: (agent && agent.email) ? agent.email : '' })
//                                                     let loggedEvent = await __biZZC_SQS.SendEventLog(event, ((pendingVisitor as VisitorSessionSchema)._id) ? (pendingVisitor as VisitorSessionSchema)._id : (pendingVisitor as VisitorSessionSchema).id);
//                                                     if (loggedEvent) origin.to(Agents.NotifyAll()).emit('visitorEventLog', loggedEvent);
//                                                     let chatEvent = 'Chat auto transferred to ' + (newAgent.name || newAgent.username || newAgent.nickname) + ((agent && agent.email) ? ' from ' + (agent.name || agent.username || agent.nickname) : '');
//                                                     if (pendingVisitor) {
//                                                         let insertedMessage = await CreateLogMessage({
//                                                             from: pendingVisitor.agent.name,
//                                                             to: (pendingVisitor.username) ? pendingVisitor.agent.name || (pendingVisitor.agent as any).nickname : '',
//                                                             body: chatEvent,
//                                                             type: 'Events',
//                                                             cid: (pendingVisitor.conversationID) ? pendingVisitor.conversationID : '',
//                                                             attachment: false,
//                                                             date: new Date().toISOString(),
//                                                             delivered: true,
//                                                             sent: true
//                                                         })
//                                                         origin.to(Visitor.NotifyOne(pendingVisitor as VisitorSessionSchema)).emit('transferChat', { agent: (pendingVisitor as VisitorSessionSchema).agent, event: chatEvent });
//                                                         if (insertedMessage) conversation.value.messages.push(insertedMessage)
//                                                     }
//                                                     origin.to(Agents.NotifyAll()).emit('updateUser', payload);
//                                                     origin.to(Agents.NotifyOne(pendingVisitor)).emit('newConversation', conversation.value);
//                                                 }
//                                             } else {
//                                                 let pendingVisitor = await SessionManager.UnseAgentFromVisitor(visitorID);
//                                                 // console.log(pendingVisitor);
//                                                 if (pendingVisitor) {
//                                                     let queEvent = ComposedENUM(DynamicEventLogs.VISITOR_UNASSIGNED, { newEmail: '', oldEmail: agent.email })
//                                                     let logEvent = await __biZZC_SQS.SendEventLog(queEvent, (pendingVisitor._id) ? pendingVisitor._id : pendingVisitor.id);
//                                                     if (logEvent) origin.to(Agents.NotifyAll()).emit('visitorEventLog', logEvent);
//                                                     origin.to(visitorID).emit('noAgent', { state: 2, agent: pendingVisitor.agent });
//                                                     origin.to(Agents.NotifyAll()).emit('updateUser', { id: pendingVisitor.id, session: pendingVisitor });
//                                                     let conversation = await Conversations.UpdateConversationState(pendingVisitor.conversationID, 1, false);
//                                                     if (conversation && conversation.value)
//                                                         await Conversations.AddPenaltyTime(pendingVisitor.conversationID, conversation.value.agentEmail, (conversation.value.lastMessage) ? conversation.value.lastMessage.date : conversation.value.createdOn);
//                                                 }
//                                             }
//                                         }
//                                         return;
//                                     });
//                                     try { await Promise.all(ConnectedVisiorsPromise); }
//                                     catch (error) { console.log('Error in Agent Manual Logout'); }
//                             }
//                         }
//                         break;
//                     default:
//                         callback({ status: 'invalid request' });
//                         break;
//                 }
//             } catch (error) {
//                 console.log('Error in Logout');
//                 console.log(error);
//                 // callback({ status: 'error' });
//             }
//         });
//     }
//     private static ManualDisconnectContactEvent(socket, origin: SocketIO.Namespace) {
//         socket.on('contactLogout', async (data) => {
//             try {
//                 // console.log(data);
//                 if (!data.email) throw new Error('Invalid Request');
//                 this.disconnectCalls(socket, origin, 'Contact');
//                 let session = await ContactSessionManager.RemoveContactSession(socket.handshake.session.nsp, data.email);
//                 if (session && session.ok) {
//                     console.log('Contact Session Removed!');
//                     Contacts.updateStatus(data.email, socket.handshake.session.nsp, false);
//                     socket.to(Contacts.NotifyAll()).emit('contactDisconnected', data.email);
//                     socket.to(Agents.NotifyAll()).emit('contactDisconnected', data.email);
//                 }
//             } catch (err) {
//                 console.log(err);
//             }
//         });
//     }
//     private static SyncVisitorState(socket, origin: SocketIO.Namespace) {
//         socket.on('getState', async (data, callback) => {
//             console.log('getState');
//             let session: VisitorSessionSchema = await SessionManager.GetVisitorByID(socket.handshake.session._id || socket.handshake.session.id) as VisitorSessionSchema;
//             //console.log(await SessionManager.getAllLiveAgents(session.nsp));
//             if (session.state == 1 && !(await SessionManager.getAllLiveAgents(session.nsp) as Array<AgentSessionSchema>).length && (!origin['settings'].chatSettings.assignments.botEnabled)) {
//                 callback({
//                     state: 5,
//                     username: (session.username) ? session.username : undefined,
//                     email: (session.email) ? session.email : 'UnRegistered'
//                 });
//             } else if (session.state == 1 && origin['settings'].chatSettings.assignments.botEnabled) {
//                 //Special Optional State For Bot
//                 if ((origin['workflow'] && Object.keys(origin['workflow']).length)) {
//                     if (!session.greetingMessageSent) {
//                         session.username = 'Guest' + new Date().toLocaleTimeString().split(':').join('').split(' ')[0];
//                         session.email = 'UnRegistered';
//                         session.greetingMessageSent = true;
//                         session.state = 6;
//                         SessionManager.UpdateSession(session._id, session);
//                         let message = {
//                             from: 'Assistant',
//                             to: session.username,
//                             body: (origin['workflow'] as WorkFlow).greetingMessage,
//                             date: new Date().toISOString(),
//                             type: 'Agents',
//                             attachment: false
//                         };
//                         // let workFlowMessage = {
//                         //     from: 'Assistant',
//                         //     to: session.username,
//                         //     body: (origin['workflow'] as WorkFlow).formHTML,
//                         //     date: new Date().toISOString(),
//                         //     type: 'Agents',
//                         //     attachment: false
//                         // }
//                         callback({
//                             state: 6,
//                             msg: [message],
//                             username: (session.username) ? session.username : undefined,
//                             email: (session.email) ? session.email : 'UnRegistered',
//                             workflow: (origin['workflow'] as WorkFlow).formHTML
//                         });
//                     }
//                 } else {
//                     callback({
//                         state: 5,
//                         username: (session.username) ? session.username : undefined,
//                         email: (session.email) ? session.email : 'UnRegistered'
//                     });
//                 }
//                 return;
//             } else if (session.state == 6) {
//                 let message = {
//                     from: 'Assistant',
//                     to: session.username,
//                     body: (Object.keys(origin['workflow']).length) ? (origin['workflow'] as WorkFlow).greetingMessage : 'Hi there, how may I help you today?',
//                     date: new Date().toISOString(),
//                     type: 'Agents',
//                     attachment: false
//                 };
//                 callback({
//                     state: 6,
//                     msg: [message],
//                     username: (session.username) ? session.username : undefined,
//                     email: (session.email) ? session.email : 'UnRegistered',
//                     workflow: (origin['workflow'] as WorkFlow).formHTML
//                 });
//                 return;
//             } else {
//                 (data.ip && data.location)
//                     ? callback({
//                         state: session.state,
//                         agent: (session.agent) ? session.agent : undefined,
//                         cid: (session.conversationID) ? session.conversationID : undefined,
//                         username: (session.username) ? session.username : undefined,
//                         email: (session.email) ? session.email : 'UnRegistered'
//                     }) : callback('Error');
//             }
//         });
//     }
//     public static async disconnectCalls(socket, origin: SocketIO.Namespace, type: string = 'Agents') {
//         let sender: any;
//         let reciever: any;
//         switch (type) {
//             case 'Agents':
//                 sender = await SessionManager.getAgentByEmail(socket.handshake.session.nsp, socket.handshake.session.email);
//                 if (sender) {
//                     if (sender.callingState.agent) {
//                         reciever = await SessionManager.getSessionsForCall(socket.handshake.session.nsp, sender.callingState.agent);
//                         if (reciever) {
//                             origin.in((reciever.id || reciever._id) as string).emit('disconnectCall');
//                             origin.to((reciever.id || reciever._id) as string).emit('updateCallingState', { state: false });
//                             SessionManager.UpdateCallingState(reciever.email, { socketid: '', state: false, agent: '' });
//                         }
//                     }
//                     // origin.in((sender.id || sender._id) as string).emit('disconnectCall');
//                     SessionManager.UpdateCallingState(socket.handshake.session.email, { socketid: '', state: false, agent: '' });
//                 }
//                 // if (sender && sender.callingState.agent) {
//                 //     // let reciever = await SessionManager.getSessionsForCall(socket.handshake.session.nsp, sender.callingState.agent);
//                 //     if (reciever && socket.id == sender.callingState.socketid) {
//                 //         origin.in((reciever.id || reciever._id) as string).emit('disconnectCall');
//                 //         origin.to((reciever.id || reciever._id) as string).emit('updateCallingState', { state: false });
//                 //         SessionManager.UpdateCallingState(reciever.email, { socketid: '', state: false, agent: '' });
//                 //         SessionManager.UpdateCallingState(socket.handshake.session.email, { socketid: '', state: false, agent: '' });
//                 //     } else if (reciever && !sender.callingState.socketid && reciever.callingState.agent == sender.email) {
//                 //         origin.in((reciever.id || reciever._id) as string).emit('disconnectCall');
//                 //         origin.in((sender.id || sender._id) as string).emit('disconnectCall');
//                 //         origin.to((reciever.id || reciever._id) as string).emit('updateCallingState', { state: false });
//                 //         SessionManager.UpdateCallingState(reciever.email, { socketid: '', state: false, agent: '' });
//                 //         SessionManager.UpdateCallingState(socket.handshake.session.email, { socketid: '', state: false, agent: '' });
//                 //     }
//                 // }
//                 break;
//             case 'Visitors':
//                 sender = await SessionManager.GetVisitorByID(socket.handshake.session.id || socket.handshake.session._id);
//                 if (sender) {
//                     if (sender.callingState.agent) {
//                         reciever = await SessionManager.getSessionsForCall(socket.handshake.session.nsp, sender.callingState.agent);
//                         if (reciever) {
//                             origin.in((reciever.id || reciever._id) as string).emit('disconnectCall');
//                             origin.to((reciever.id || reciever._id) as string).emit('updateCallingState', { state: false });
//                             SessionManager.UpdateCallingState(reciever.email, { socketid: '', state: false, agent: '' });
//                         }
//                     }
//                     // origin.in((sender.id || sender._id) as string).emit('disconnectCall');
//                     SessionManager.UpdateCallingState(sender.id, { socketid: '', state: false, agent: '' });
//                 }
//                 // if (sender && sender.callingState.agent) {
//                 //     // let reciever = await SessionManager.getSessionsForCall(socket.handshake.session.nsp, sender.callingState.agent);
//                 //     if (reciever && socket.id == sender.callingState.socketid) {
//                 //         origin.in((reciever.id || reciever._id) as string).emit('disconnectCall');
//                 //         origin.to((reciever.id || reciever._id) as string).emit('updateCallingState', { state: false });
//                 //         SessionManager.UpdateCallingState(reciever.email, { socketid: '', state: false, agent: '' });
//                 //         SessionManager.UpdateCallingState(socket.handshake.session.email, { socketid: '', state: false, agent: '' });
//                 //     } else if (reciever && !sender.callingState.socketid && reciever.callingState.agent == sender.email) {
//                 //         origin.in((reciever.id || reciever._id) as string).emit('disconnectCall');
//                 //         origin.in((sender.id || sender._id) as string).emit('disconnectCall');
//                 //         origin.to((reciever.id || reciever._id) as string).emit('updateCallingState', { state: false });
//                 //         SessionManager.UpdateCallingState(reciever.email, { socketid: '', state: false, agent: '' });
//                 //         SessionManager.UpdateCallingState(socket.handshake.session.email, { socketid: '', state: false, agent: '' });
//                 //     }
//                 // }
//                 break;
//             case 'Contact':
//                 console.log('Contact Disconnected: ' + socket.handshake.session.email);
//                 sender = await ContactSessionManager.GetSessionByEmailFromDatabase(socket.handshake.session.email, socket.handshake.session.nsp);
//                 if (sender) {
//                     if (sender.callingState.agent) {
//                         reciever = await ContactSessionManager.GetSessionByEmailFromDatabase(sender.callingState.agent, sender.nsp);
//                         if (reciever) {
//                             origin.in((reciever.id || reciever._id) as string).emit('disconnectCall');
//                             ContactSessionManager.UpdateCallingState(reciever.email, { socketid: '', state: false, agent: '' });
//                         }
//                     }
//                     origin.in((sender.id || sender._id) as string).emit('disconnectCall');
//                     ContactSessionManager.UpdateCallingState(sender.email, { socketid: '', state: false, agent: '' });
//                 }
//                 break;
//         }
//         // console.log(socket.id, (sender) ? sender.callingState : 'noid');
//     }
// } 
//# sourceMappingURL=connectionHandlers.js.map