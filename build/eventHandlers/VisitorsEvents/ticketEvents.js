"use strict";
// //Created By Saad Ismail Shaikh 
// // 01-08-2018
// //Native Modules
// import { ObjectID } from "mongodb"
// //Models
// import { Tickets } from "../../models/ticketsModel"
// //Schemas For Typesafety
// import { TicketSchema } from "../../schemas/ticketSchema"
// import { TicketMessageSchema } from "../../schemas/ticketMessageSchema"
// import { SessionManager } from "../../globals/server/sessionsManager";
// import { Agents } from "../../models/agentModel";
// import { Visitor } from "../../models/visitorModel";
// import { rand, ticketEmail } from "../../globals/config/constants";
// import { MakeActive } from "../../actions/GlobalActions/CheckActive";
// import { VisitorSessionSchema } from "../../schemas/VisitorSessionSchema";
// import { RuleSetDescriptor } from "../../actions/TicketAbstractions/RuleSetExecutor";
// import { AgentSessionSchema } from "../../schemas/agentSessionSchema";
// import { Conversations } from "../../models/conversationModel";
// import { __biZZC_SQS } from "../../actions/aws/aws-sqs";
// import { EventLogMessages } from "../../globals/config/enums";
// export class TicketEvents {
//     public static BindTicketEvents(socket, origin: SocketIO.Namespace) {
//         TicketEvents.SubmitTicket(socket, origin);
//         TicketEvents.ChatToTicket(socket, origin);
//     }
//     private static SubmitTicket(socket, origin: SocketIO.Namespace) {
//         socket.on('submitTicket', async (data, callback) => {
//             try {
//                 //TODO : Re-Active if Session was Inactive 
//                 let session = await SessionManager.GetVisitorByID(socket.handshake.session.id || socket.handshake.session._id);
//                 let greetingMessage: string = origin['settings']['chatSettings']['greetingMessage'];
//                 if (session && session.inactive) {
//                     await MakeActive(session as VisitorSessionSchema);
//                 }
//                 let promises = await Promise.all([
//                     await SessionManager.GetAllActiveAgentsChatting(session),
//                     await SessionManager.GetVisitorByID(socket.handshake.session.id || socket.handshake.session._id)
//                 ])
//                 let allAgents = promises[0];
//                 session = promises[1];
//                 if (session) {
//                     if (!allAgents || session.state != 1) {
//                         let primaryEmail = await Tickets.GetPrimaryEmail(socket.handshake.session.nsp);
//                         // console.log("submitTicket");
//                         // console.log(data);
//                         if (primaryEmail) {
//                             let randomColor = rand[Math.floor(Math.random() * rand.length)];
//                             let ticket: TicketSchema = {
//                                 type: 'email',
//                                 subject: data.subject,
//                                 nsp: socket.handshake.session.nsp,
//                                 state: 'OPEN',
//                                 datetime: new Date().toISOString(),
//                                 priority: data.priority,
//                                 // from: primaryEmail[0].domainEmail,
//                                 from: ticketEmail,
//                                 visitor: {
//                                     name: data.name,
//                                     email: data.email,
//                                     phone: data.phone,
//                                     location: socket.handshake.session.country,
//                                     ip: socket.handshake.session.ip,
//                                     fullCountryName: socket.handshake.session.fullCountryName.toString(),
//                                     url: socket.handshake.session.url,
//                                     country: socket.handshake.session.country
//                                 },
//                                 lasttouchedTime: new Date().toISOString(),
//                                 viewState: 'UNREAD',
//                                 ticketlog: [],
//                                 mergedTicketIds: [],
//                                 viewColor: randomColor,
//                                 group: "",
//                                 source: 'livechat',
//                                 slaPolicy: {
//                                     reminderResolution: false,
//                                     reminderResponse: false,
//                                     violationResponse: false,
//                                     violationResolution: false
//                                 }
//                             };
//                             if (data.phone && data.email) {
//                                 let UpdatedVisitor = await Visitor.UpdateVisitorInfoByDeviceID(socket.handshake.session.deviceID, { username: (data.username as string), email: (data.email as string), phone: data.phone ? data.phone : '' });
//                             }
//                             ticket = await RuleSetDescriptor(ticket);
//                             let insertedTicket = await Tickets.CreateTicket(JSON.parse(JSON.stringify(ticket)));
//                             // console.log(insertedTicket);
//                             let ticketId: ObjectID | undefined;
//                             (insertedTicket) ?
//                                 (insertedTicket.insertedCount) ? ticketId = insertedTicket.insertedId as ObjectID
//                                     : callback({ status: 'error' }) : undefined;
//                             if (ticketId) {
//                                 let message: TicketMessageSchema = {
//                                     datetime: new Date().toISOString(),
//                                     nsp: socket.handshake.session.nsp,
//                                     senderType: 'Visitor',
//                                     message: data.message,
//                                     from: data.email,
//                                     to: ticketEmail,
//                                     replytoAddress: data.email,
//                                     tid: [ticketId],
//                                     attachment: [],
//                                     viewColor: (insertedTicket && insertedTicket.insertedCount) ? insertedTicket.ops[0].viewColor : ''
//                                 };
//                                 let insertedMessage = await Tickets.InsertMessage(JSON.parse(JSON.stringify(message)));
//                                 if (insertedMessage && insertedMessage.insertedCount &&
//                                     insertedTicket && insertedTicket.insertedCount) {
//                                     // if(insertedTicket.ops[0].nsp == '/sbtjapan.com'){
//                                     //     (insertedTicket as any).ops[0] = await CustomDispatcher(insertedTicket.ops[0], message.message);
//                                     //     await Tickets.UpdateTicketObj(insertedTicket.ops[0]);
//                                     // }
//                                     let event = 'Ticket Submitted';
//                                     let loggedEvent = await __biZZC_SQS.SendEventLog(EventLogMessages.TICKET_SUBMITTED, (socket.handshake.session._id) ? socket.handshake.session._id : socket.handshake.session.id);
//                                     // console.log("logged in submit TIcket");
//                                     // console.log(loggedEvent);
//                                     origin.to('ticketAdmin').emit('newTicket', { ticket: insertedTicket.ops[0] });
//                                     origin.to(ticket.group).emit('newTicket', { ticket: insertedTicket.ops[0] });
//                                     //setTimeout(() => { if (loggedEvent) origin.to(Agents.NotifyAll()).emit('visitorEventLog', loggedEvent); }, 0);
//                                     if (loggedEvent) origin.to(Agents.NotifyAll()).emit('visitorEventLog', loggedEvent);
//                                     callback({ status: 'ok' });
//                                 } else {
//                                     callback({ status: 'error' });
//                                 }
//                             } else {
//                                 callback({ status: 'error' });
//                             }
//                         } else callback({ status: 'error' });
//                     } else {
//                         let allocatedAgent: AgentSessionSchema | undefined;
//                         let cid: ObjectID = new ObjectID();
//                         // console.log(origin['settings']['chatSettings']['assignments']);
//                         if (origin['settings']['chatSettings']['assignments'].priorityAgent.trim()) {
//                             console.log('priority');
//                             let UpdatedSessions = (session.selectedAgent) ? await SessionManager.AllocateAgentPriority(session, session.selectedAgent, cid) : undefined;
//                             if (!UpdatedSessions) UpdatedSessions = await SessionManager.AllocateAgentPriority(session, origin['settings']['chatSettings']['assignments'].priorityAgent.trim(), cid);
//                             if (UpdatedSessions && UpdatedSessions.agent) {
//                                 session = UpdatedSessions.visitor;
//                                 allocatedAgent = UpdatedSessions.agent;
//                                 if (allocatedAgent && session) {
//                                     //Creating Conversation in Database
//                                     //Conversation States:
//                                     // 1. Conversation Created But No Agent Assignend
//                                     // 2. Conversation Created and Got agent
//                                     // 3. Conversation Ended
//                                     let conversation = await Conversations.createConversation(cid, (session.email as string), (session.id as string), session.nsp, session.viewColor, allocatedAgent.email, session.username, 2, session.deviceID);
//                                     //if Conversation is Successfully Inserted then MongoDb Returns InsertedWriteResult
//                                     //InsertedWriteResult Object Contains insertedCount Property which Denotes the Count of Documents Inserted
//                                     //If Document is inserted successfully the its InsertedCount Porperty Must Be Greater than Zero. 
//                                     if (conversation && conversation.insertedCount > 0) {
//                                         let logEvent = await __biZZC_SQS.SendEventLog(EventLogMessages.CHAT_INITIATED, (session._id) ? session._id : session.id);
//                                         if (logEvent) origin.to(Agents.NotifyAll()).emit('visitorEventLog', logEvent);
//                                         //Visitor State Data to Update
//                                         let payload = { id: session.id, session: session };
//                                         if (conversation) {
//                                             let temp = '<h5 class="clearfix m-b-10"> Credentials Update </h5>';
//                                             Object.keys(data).map(key => {
//                                                 temp += key + ' : ' + data[key] + '<br>';
//                                             })
//                                             temp += 'country : ' + socket.handshake.session.fullCountryName.toString() + '<br>';
//                                             //temp += 'URI : ' + socket.handshake.session.url[0] + '<br>';
//                                             //temp += 'IP : ' + socket.handshake.session.ip + '<br>';
//                                             let lastMessage = {
//                                                 from: socket.handshake.session.nsp,
//                                                 to: session.username,
//                                                 body: temp,
//                                                 cid: conversation.insertedId.toHexString(),
//                                                 date: (new Date()).toISOString(),
//                                                 type: 'Visitors',
//                                                 attachment: false,
//                                                 chatFormData: 'Credentials Updated'
//                                             }
//                                             let messageinsertedID = await Conversations.insertMessage(lastMessage);
//                                             if (messageinsertedID) {
//                                                 conversation.ops[0].messages.push(messageinsertedID.ops[0]);
//                                                 let credentials;
//                                                 if (!allocatedAgent.greetingMessage) credentials = await Conversations.UpdateLastMessage(conversation.insertedId.toHexString(), lastMessage);
//                                                 else {
//                                                     greetingMessage = allocatedAgent.greetingMessage;
//                                                     if (greetingMessage) {
//                                                         let greeting = {
//                                                             from: socket.handshake.session.nsp,
//                                                             to: session.username,
//                                                             body: greetingMessage,
//                                                             cid: conversation.insertedId.toHexString(),
//                                                             date: (new Date()).toISOString(),
//                                                             type: 'Agents',
//                                                             attachment: false
//                                                         }
//                                                         let messageinserted = await Conversations.insertMessage(greeting);
//                                                         conversation.ops[0].messages.push(messageinserted.ops[0]);
//                                                         await Conversations.UpdateLastMessage(conversation.insertedId.toHexString(), greeting);
//                                                     }
//                                                 }
//                                             }
//                                         }
//                                         console.log(allocatedAgent.greetingMessage);
//                                         //Notify Allocated Agent That A New Conversation has been autoAssigned. 
//                                         //Check if Allocated Agent is Still Active. Just a precautionary Case. 
//                                         if (allocatedAgent) {
//                                             origin.to((allocatedAgent.id as string)).emit('newConversation', conversation.ops[0]);
//                                         }
//                                         //Broadcast To All Agents That User Information and State Has Been Updated.
//                                         origin.in(Agents.NotifyAll()).emit('updateUser', payload);
//                                         //Update User Status Back to Visitor Window
//                                         callback({
//                                             status: 'chat',
//                                             session: {
//                                                 clientID: (conversation.ops[0].clientID) ? conversation.ops[0].clientID : '',
//                                                 agent: session.agent,
//                                                 cid: session.conversationID,
//                                                 state: session.state,
//                                                 credentials: (conversation) ? conversation.ops[0].messages[0] : '',
//                                                 greetingMessage: (conversation) ? conversation.ops[0].messages[1] : '',
//                                                 username: session.username,
//                                                 email: session.email,
//                                                 phone: (session.phone ? session.phone : ''),
//                                                 message: (session.message) ? session.message : ''
//                                             }
//                                         });
//                                         socket.to(Visitor.NotifyOne(session)).emit('gotAgent',
//                                             {
//                                                 clientID: (conversation.ops[0].clientID) ? conversation.ops[0].clientID : '',
//                                                 agent: (allocatedAgent) ? session.agent : undefined,
//                                                 cid: session.conversationID,
//                                                 state: session.state,
//                                                 username: session.username,
//                                                 email: session.email,
//                                                 credentials: (conversation) ? conversation.ops[0].messages[0] : '',
//                                                 greetingMessage: (conversation) ? conversation.ops[0].messages[1] : '',
//                                                 phone: (session.phone ? session.phone : ''),
//                                                 message: (session.message) ? session.message : ''
//                                             });
//                                     }
//                                 } else {
//                                     console.log('No Agent')
//                                     callback({ status: 'error' });
//                                 }
//                             } else {
//                                 //console.log('No Agent')
//                                 callback({ status: 'error' });
//                             }
//                             return;
//                         } else {
//                             console.log('not priority');
//                             let UpdatedSessions = (session.selectedAgent) ? await SessionManager.AllocateAgentPriority(session, session.selectedAgent, cid) : undefined;
//                             if (!UpdatedSessions) UpdatedSessions = await SessionManager.AllocateAgent(session, cid);
//                             if (UpdatedSessions) {
//                                 allocatedAgent = UpdatedSessions.agent;
//                                 session = UpdatedSessions.visitor as VisitorSessionSchema;
//                                 //Creating Conversation in Database
//                                 //Conversation States:
//                                 // 1. Conversation Created But No Agent Assignend
//                                 // 2. Conversation Created and Got agent
//                                 // 3. Conversation Ended
//                                 if (session) {
//                                     let conversation = await Conversations.createConversation(cid, (session.email as string), (session.id as string), (session.nsp as string), session.viewColor, (allocatedAgent) ? allocatedAgent.email : '', (session.username as string), (allocatedAgent) ? 2 : 1, session.deviceID);
//                                     // if Conversation is Successfully Inserted then MongoDb Returns InsertedWriteResult
//                                     //InsertedWriteResult Object Contains insertedCount Property which Denotes the Count of Documents Inserted
//                                     //If Document is inserted successfully the its InsertedCount Porperty Must Be Greater than Zero. 
//                                     //Visitor State Data to Update
//                                     let payload = { id: session.id, session: session }
//                                     if (allocatedAgent && allocatedAgent.greetingMessage) greetingMessage = allocatedAgent.greetingMessage;
//                                     if (conversation) {
//                                         let logEvent = await __biZZC_SQS.SendEventLog(EventLogMessages.CHAT_INITIATED, (session._id) ? session._id : session.id);
//                                         if (logEvent) origin.to(Agents.NotifyAll()).emit('visitorEventLog', logEvent);
//                                         let temp = '<h5 class="clearfix m-b-10">Credentials Updated</h5>';
//                                         Object.keys(data).map(key => {
//                                             temp += key + ' : ' + data[key] + '<br>';
//                                         })
//                                         temp += 'country : ' + socket.handshake.session.fullCountryName.toString() + '<br>';
//                                         //temp += 'URI : ' + socket.handshake.session.url[0] + '<br>';
//                                         //temp += 'IP : ' + socket.handshake.session.ip + '<br>';
//                                         let lastMessage = {
//                                             from: socket.handshake.session.nsp,
//                                             to: session.username,
//                                             body: temp,
//                                             cid: conversation.insertedId.toHexString(),
//                                             date: (new Date()).toISOString(),
//                                             type: 'Visitors',
//                                             attachment: false,
//                                             chatFormData: 'Credentials Updated'
//                                         }
//                                         let messageinsertedID = await Conversations.insertMessage(lastMessage);
//                                         if (messageinsertedID) {
//                                             conversation.ops[0].messages.push(messageinsertedID.ops[0]);
//                                             let credentials;
//                                             if (!greetingMessage) credentials = await Conversations.UpdateLastMessage(conversation.insertedId.toHexString(), lastMessage);
//                                             else {
//                                                 let greeting = {
//                                                     from: socket.handshake.session.nsp,
//                                                     to: session.username,
//                                                     body: greetingMessage,
//                                                     cid: conversation.insertedId.toHexString(),
//                                                     date: (new Date()).toISOString(),
//                                                     type: 'Agents',
//                                                     attachment: false
//                                                 }
//                                                 let messageinserted = await Conversations.insertMessage(greeting);
//                                                 conversation.ops[0].messages.push(messageinserted.ops[0]);
//                                                 await Conversations.UpdateLastMessage(conversation.insertedId.toHexString(), greeting);
//                                             }
//                                         }
//                                     }
//                                     //Update User Status Back to Visitor Window
//                                     //Check if Allocated Agent is Still Active. Just a precautionary Case. 
//                                     if (allocatedAgent && conversation) {
//                                         origin.to((allocatedAgent.id as string)).emit('newConversation', conversation.ops[0]);
//                                     }
//                                     //Broadcast To All Agents That User Information and State Has Been Updated.
//                                     origin.in(Agents.NotifyAll()).emit('updateUser', payload);
//                                     if (allocatedAgent) callback({
//                                         status: 'chat',
//                                         session: {
//                                             clientID: (conversation.ops[0].clientID) ? conversation.ops[0].clientID : '',
//                                             agent: session.agent,
//                                             cid: session.conversationID,
//                                             state: session.state,
//                                             credentials: (conversation) ? conversation.ops[0].messages[0] : '',
//                                             greetingMessage: (conversation) ? conversation.ops[0].messages[1] : '',
//                                             username: session.username,
//                                             email: session.email,
//                                             phone: (session.phone ? session.phone : ''),
//                                             message: (session.message) ? session.message : ''
//                                         }
//                                     });
//                                     else callback({
//                                         status: 'chat',
//                                         session: {
//                                             clientID: (conversation.ops[0].clientID) ? conversation.ops[0].clientID : '',
//                                             agent: session.agent,
//                                             cid: session.conversationID,
//                                             state: session.state,
//                                             credentials: (conversation) ? conversation.ops[0].messages[0] : '',
//                                             greetingMessage: (conversation) ? conversation.ops[0].messages[1] : '',
//                                             username: session.username,
//                                             email: session.email,
//                                             phone: (session.phone ? session.phone : ''),
//                                             message: (session.message) ? session.message : ''
//                                         }
//                                     });
//                                     // console.log("greeting message")
//                                     if (conversation) socket.to(Visitor.NotifyOne(session)).emit('gotAgent', {
//                                         clientID: (conversation.ops[0].clientID) ? conversation.ops[0].clientID : '',
//                                         agent: (allocatedAgent) ? session.agent : undefined,
//                                         cid: session.conversationID,
//                                         state: session.state,
//                                         username: session.username,
//                                         email: session.email,
//                                         credentials: (conversation) ? conversation.ops[0].messages[0] : '',
//                                         greetingMessage: (conversation) ? conversation.ops[0].messages[1] : '',
//                                         phone: (session.phone ? session.phone : ''),
//                                         message: (session.message) ? session.message : ''
//                                     });
//                                 } else callback({ status: 'error' });
//                             } else {
//                                 //console.log(UpdatedSessions);
//                                 //console.log("Can't Assign Agent");
//                                 callback({ status: 'error' });
//                             }
//                         }
//                     }
//                 }
//             } catch (error) {
//                 console.log(error);
//                 console.log('error in Submitting Ticket');
//                 callback({ status: 'error' });
//             }
//         });
//     }
//     private static ChatToTicket(socket, origin: SocketIO.Namespace) {
//         socket.on('convertChatToTicket', async (data, callback) => {
//             try {
//                 let session = await SessionManager.GetVisitorByID(socket.handshake.session.id || socket.handshake.session._id);
//                 if (session && session.inactive) {
//                     await MakeActive(session as VisitorSessionSchema);
//                 }
//                 session = await SessionManager.GetVisitorByID(socket.handshake.session.id || socket.handshake.session._id);
//                 let convos = JSON.parse(data.conversation)
//                 let randomColor = rand[Math.floor(Math.random() * rand.length)];
//                 let ticket: TicketSchema = {
//                     type: 'email',
//                     subject: data.subject,
//                     nsp: socket.handshake.session.nsp,
//                     state: 'OPEN',
//                     datetime: new Date().toISOString(),
//                     priority: data.priority,
//                     from: ticketEmail,
//                     visitor: {
//                         name: data.name,
//                         email: data.email,
//                         phone: data.phone,
//                         location: socket.handshake.session.country,
//                         ip: socket.handshake.session.ip,
//                         fullCountryName: socket.handshake.session.fullCountryName.toString(),
//                         url: socket.handshake.session.url,
//                         country: socket.handshake.session.country
//                     },
//                     lasttouchedTime: new Date().toISOString(),
//                     viewState: 'UNREAD',
//                     ticketlog: [],
//                     mergedTicketIds: [],
//                     viewColor: randomColor,
//                     group: "",
//                     source: 'livechat',
//                     slaPolicy: {
//                         reminderResolution: false,
//                         reminderResponse: false,
//                         violationResponse: false,
//                         violationResolution: false
//                     }
//                 };
//                 if (data.phone && data.email) {
//                     let UpdatedVisitor = await Visitor.UpdateVisitorInfoByDeviceID(socket.handshake.session.deviceID, { username: (data.username as string), email: (data.email as string), phone: data.phone ? data.phone : '' });
//                 }
//                 ticket = await RuleSetDescriptor(ticket);
//                 let insertedTicket = await Tickets.CreateTicket(JSON.parse(JSON.stringify(ticket)));
//                 let ticketId: ObjectID | undefined;
//                 (insertedTicket) ?
//                     (insertedTicket.insertedCount) ? ticketId = insertedTicket.insertedId as ObjectID
//                         : callback({ status: 'error' }) : undefined;
//                 if (ticketId) {
//                     let insertedMessages: any;
//                     if (convos && convos.length) {
//                         let updatedList = convos.map((msg, index) => {
//                             let message: TicketMessageSchema = {
//                                 datetime: new Date().toISOString(),
//                                 nsp: socket.handshake.session.nsp,
//                                 senderType: 'Visitor',
//                                 message: msg,
//                                 from: data.email,
//                                 to: ticketEmail,
//                                 replytoAddress: data.email,
//                                 tid: [new ObjectID(ticketId)],
//                                 viewColor: (insertedTicket && insertedTicket.insertedCount) ? insertedTicket.ops[0].viewColor : ''
//                             };
//                             return message;
//                         })
//                         insertedMessages = await Tickets.InsertMessages(updatedList);
//                         if (insertedMessages && insertedMessages.result.ok && insertedMessages.insertedCount &&
//                             insertedTicket && insertedTicket.insertedCount) {
//                             // if(insertedTicket.ops[0].nsp == '/sbtjapan.com'){
//                             //     (insertedTicket as any).ops[0] = await CustomDispatcher(insertedTicket.ops[0], insertedMessage[0].ops[0].message);
//                             //     await Tickets.UpdateTicketObj(insertedTicket.ops[0]);
//                             // }
//                             let event = 'Chat Converted To Ticket';
//                             let loggedEvent = await __biZZC_SQS.SendEventLog(EventLogMessages.CHAT_CONVERTED_TO_TICKET, (socket.handshake.session._id) ? socket.handshake.session._id : socket.handshake.session.id);
//                             origin.to('ticketAdmin').emit('newTicket', { ticket: insertedTicket.ops[0] });
//                             //setTimeout(() => { if (loggedEvent) origin.to(Agents.NotifyAll()).emit('visitorEventLog', loggedEvent); }, 0);
//                             if (loggedEvent) origin.to(Agents.NotifyAll()).emit('visitorEventLog', loggedEvent);
//                             callback({ status: 'ok' });
//                         } else {
//                             callback({ status: 'error' });
//                         }
//                     }
//                 } else {
//                     callback({ status: 'error' });
//                 }
//             } catch (error) {
//                 console.log(error);
//                 console.log('error in Submitting Ticket');
//                 callback({ status: 'error' });
//             }
//         });
//     }
// }
//# sourceMappingURL=ticketEvents.js.map