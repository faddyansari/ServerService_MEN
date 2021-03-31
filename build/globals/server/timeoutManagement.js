"use strict";
// import { SessionManager } from "./sessionsManager";
// import { Conversations } from "../../models/conversationModel";
// import { Tickets } from "../../models/ticketsModel";
// import { Agents } from "../../models/agentModel";
// import { VisitorSessionSchema } from "../../schemas/VisitorSessionSchema";
// import { ObjectID } from "mongodb";
// import { Visitor } from "../../models/visitorModel";
// import { AutomaticEngagement } from "../../actions/agentActions/AutomaticEngagement";
// import { Tokens } from "../../models/tokensModel";
// import { CreateLogMessage } from "../../actions/GlobalActions/CreateMessage";
// import { AutoAssignFromQueueAuto, TransferAgentDisconnect } from "../../actions/ChatActions/AssignChat";
// import { __biZZC_SQS } from "../../actions/aws/aws-sqs";
// import { EmailService } from "../../services/emailService";
// import { TicketLogSchema } from "../../schemas/ticketLogSchema";
// import { ARCHIVINGQUEUE } from "../config/constants";
// import { Company } from "../../models/companyModel";
// import { RuleSetDescriptor } from "../../actions/TicketAbstractions/RuleSetExecutor";
// import { EventLogMessages, ComposedENUM, DynamicEventLogs } from "../config/enums";
// import { __BIZZ_REST_REDIS_PUB, __BIZZC_REDIS } from "../__biZZCMiddleWare";
// import { SQSPacket } from "../../schemas/sqsPacketSchema";
// import { ChatToTicket } from "../../actions/TicketAbstractions/missedChatToTicket";
// export class TimeoutManager {
//     static ConnDisconnIntervalForVisitors: NodeJS.Timer;
//     static ConnDisconnIntervalForAgents: NodeJS.Timer;
//     static TokenIntervalFunction: NodeJS.Timer;
//     static BanningTimoutForVisitors: NodeJS.Timer;
//     static RuleSetSchedulerForCompanies: NodeJS.Timer;
//     // static TranasferChatInactivityTimer: NodeJS.Timer;
//     // static MakeChatInacteTimer: NodeJS.Timer;
//     // static EndInactiveChatTimer: NodeJS.Timer;
//     static SnoozingTimer: NodeJS.Timer;
//     static OriginIntervals: NodeJS.Timer[];
//     static SnoozingInterval: NodeJS.Timer
//     // public static Start(socket, origin, session) {
//     // 	console.log('Starting Automatic Assignment Interval!');
//     //     this.	setInterval(() => this.AutomaticAssignment(socket, origin, session), 20000);
//     // 	// this.AutomaticAssignment(socket,origin,session);
//     // }
// 	/**
// 	**@Note
// 	   Improve Operation Locking TO Prevent Initiate and Transfer At Sime Time While JOB is DELETING SESSIONS
// 	**@EndNote
// 	*/
// 	/**
// 	 * @FunctionsSequence
// 	 * 1. Interval Function Visitors
// 	 * 2. Automatic Assignment Check
// 	 * 3. Interval Function Agents
// 	 * 4. End Inactive Chats
// 	 * 5. Make Chats Inactive
// 	 * 6. Transfer Chats
// 	 */
//     public static StartGlobalTimeout() {
//         console.log('Global Timeout Started');
//         //Interval 60 secs
//         this.ConnDisconnIntervalForVisitors = this.CheckInactiveVisitorsNonChatting();
//         this.TokenIntervalFunction = this.TokenTimouetManager();
//         this.BanningTimoutForVisitors = this.CheckBannedVisitor();
//         this.RuleSetScheduler(60000);
//         // this.RuleSetSchedulerForCompanies = this.RuleSetScheduler();
//     }
//     public static IgnoreNameSpace(nsp: string) {
//         switch (nsp.toLowerCase()) {
//             case '/':
//             case '/emailservice':
//                 return true;
//             default:
//                 if (nsp.indexOf('.') != -1) return false;
//                 else return false;
//         }
//     }
//     public static GlobalTimeoutStop() {
//         clearInterval(this.ConnDisconnIntervalForVisitors);
//     }
//     public static TokenTimouetManager() {
//         return setInterval(async () => {
//             try {
//                 let result = await Tokens.DeleteExpiredTokens();
//                 if (result) console.log('Deleted : ' + result.deletedCount + ' Tokens');
//             } catch (error) {
//                 console.log('Error in Token Timouts');
//                 console.log(error);
//             }
//         }, 3600000)
//     }
//     public static CheckInactiveVisitorsNonChatting(): NodeJS.Timer {
//         return setInterval(async () => {
//             console.log('CheckInactiveVisitorsNonChatting');
//             //let SocketServer: SocketIO.Server = SocketListener.getSocketServer();
//             let companies = await Company.GetCompanies()
//             if (companies) {
//                 let nspPromises = companies.map(async company => {
//                     if (this.IgnoreNameSpace(company.name)) return;
//                     //await SessionManager.resetAgentChatCounts(company.name, 'Agents');
//                     let InactiveSessions: any[] = (await SessionManager.GetAllInactiveVisitors(company.name, company['settings']['chatSettings']['inactivityTimeouts']['inactiveTimeout'], false) as Array<any>);
//                     let promises = (InactiveSessions as Array<any>).map(async session => {
//                         let logEvent: any = undefined;
//                         let event: string = '';
//                         let chatEvent: string = '';
//                         let updateSession: any = undefined
//                         let date = new Date();
//                         date.setMinutes(date.getMinutes() + company['settings']['chatSettings']['inactivityTimeouts']['endSessionTimeout']);
//                         let promises: any;
//                         switch (session.state) {
//                             case 1:
//                             case 5:
//                             case 8:
//                                 session.inactive = true;
//                                 session.expiry = date.toISOString();
//                                 chatEvent = 'Marked Inactive from Browsing state';
//                                 //chatEvent = 'Marked Inactive from' + ((session.state == 5) ? 'Invited' : 'Browsing') + 'state';
//                                 promises = await Promise.all([
//                                     __biZZC_SQS.SendEventLog(EventLogMessages.VISITOR_MARKED_INACTIVE_FROM_BROWSING, session._id || session.id),
//                                     //__biZZC_SQS.SendEventLog(((session.state == 5) ? chatEvent : EventLogMessages.VISITOR_MARKED_INACTIVE_FROM_BROWSING), session._id || session.id),
//                                     SessionManager.UpdateSession(session._id || session.id, session)
//                                 ])
//                                 logEvent = promises[0];
//                                 updateSession = promises[1];
//                                 //if (logEvent) SocketServer.of(nsp).to(Agents.NotifyAll()).emit('visitorEventLog', logEvent);
//                                 // SocketServer.of(nsp).to(Agents.NotifyAll()).emit('updateUser', { id: session.id || session._id, session: session });
//                                 await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: session.nsp, roomName: [Agents.NotifyAll()], data: { id: session.id || session._id, session: session } });
//                                 break;
//                             case 4:
//                                 session.inactive = true;
//                                 session.expiry = date.toISOString();
//                                 event = ComposedENUM(DynamicEventLogs.VISITOR_INVITED_INACTIVE, { newEmail: '', oldEmail: '', name: session.agent.name });
//                                 chatEvent = 'Marked Inactive in Invited State'
//                                 promises = await Promise.all([
//                                     __biZZC_SQS.SendEventLog(event, session._id || session.id),
//                                     SessionManager.UpdateSession(session._id || session.id, session),
//                                     Conversations.UpdateConversationState(session.conversationID, 2, true)
//                                 ])
//                                 logEvent = promises[0];
//                                 updateSession = promises[1];
//                                 let updatedconversation = promises[2]
//                                 //if (logEvent) SocketServer.of(nsp).to(Agents.NotifyAll()).emit('visitorEventLog', logEvent);
//                                 if (updateSession) {
//                                     // console.log(updateSession);
//                                     // SocketServer.of(nsp).to(Visitor.NotifyOne(session)).emit('inactiveVisitorState', { state: session.state, inactive: true, event: chatEvent })
//                                     let insertedMessage = await CreateLogMessage({
//                                         from: session.agent.name,
//                                         to: (session.username) ? session.agent.name || session.agent.nickname : '',
//                                         body: event,
//                                         type: 'Events',
//                                         cid: (session.conversationID) ? session.conversationID : '',
//                                         attachment: false,
//                                         date: new Date().toISOString(),
//                                         delivered: true,
//                                         sent: true
//                                     })
//                                     // if (insertedMessage) SocketServer.of(nsp).to(Visitor.NotifyOne(session)).emit('privateMessage', insertedMessage)
//                                     // SocketServer.of(nsp).to(Agents.NotifyAll()).emit('updateUser', { id: session.id || session._id, session: session });
//                                     if (insertedMessage) await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'V', broadcast: false, eventName: 'privateMessage', nsp: session.nsp, roomName: [Visitor.NotifyOne(session)], data: insertedMessage });
//                                     await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: session.nsp, roomName: [Agents.NotifyAll()], data: { id: session.id || session._id, session: session } });
//                                 }
//                                 if (updatedconversation) await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'removeConversation', nsp: session.nsp, roomName: [Agents.NotifyOne(session)], data: { conversation: updatedconversation.value } });
//                                 //TODO
//                                 //#region Assign Agent From Queue
//                                 promises = await Promise.all([
//                                     SessionManager.GetAgentByID(session.agent.id),
//                                     SessionManager.GetQueuedSession(session.nsp),
//                                     SessionManager.UnsetChatFromAgent(session)
//                                 ]);
//                                 let Agent = promises[0];
//                                 let QueuedSession = promises[1];
//                                 //await SessionManager.resetAgentChatCounts(session.nsp, 'Agents');
//                                 if (Agent && QueuedSession) {
//                                     let UpdatedSessions = await SessionManager.AssignAgent(QueuedSession, (Agent.id || Agent._id as string), QueuedSession.conversationID);
//                                     QueuedSession = UpdatedSessions.visitor;
//                                     Agent = UpdatedSessions.agent;
//                                     // SocketServer.of(nsp).to(Agents.NotifyAll()).emit('updateUser', { id: QueuedSession.id, session: QueuedSession });
//                                     await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: session.nsp, roomName: [Agents.NotifyAll()], data: { id: QueuedSession.id, session: QueuedSession } });
//                                     if (QueuedSession && Agent) {
//                                         console.log(Agent);
//                                         let conversation = await Conversations.UpdateConversation(QueuedSession.conversationID, false, { email: Agent.email, state: 2 });
//                                         if (conversation) {
//                                             if (conversation.value && conversation.value.messageReadCount) {
//                                                 let conversationevent = ComposedENUM(DynamicEventLogs.VISITOR_AUTO_ASSIGNED_FROM_QUEUE, { newEmail: Agent.email, oldEmail: '' });
//                                                 conversation.value.messages = await Conversations.getMessages1(QueuedSession.conversationID);
//                                                 // SocketServer.of(nsp).to(Agents.NotifyOne(QueuedSession)).emit('newConversation', conversation.value)
//                                                 await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'newConversation', nsp: session.nsp, roomName: [Agents.NotifyOne(QueuedSession)], data: conversation.value });
//                                                 // SocketServer.of(nsp).to(Visitor.NotifyOne(QueuedSession)).emit('gotAgent', {
//                                                 //     agent: QueuedSession.agent,
//                                                 //     cid: QueuedSession.conversationID,
//                                                 //     state: QueuedSession.state,
//                                                 //     username: QueuedSession.username,
//                                                 //     email: QueuedSession.email
//                                                 // });
//                                                 await __BIZZ_REST_REDIS_PUB.SendMessage({
//                                                     action: 'emit', to: 'V', broadcast: false, eventName: 'gotAgent', nsp: session.nsp, roomName: [Visitor.NotifyOne(QueuedSession)], data: {
//                                                         agent: QueuedSession.agent,
//                                                         cid: QueuedSession.conversationID,
//                                                         state: QueuedSession.state,
//                                                         username: QueuedSession.username,
//                                                         email: QueuedSession.email
//                                                     }
//                                                 });
//                                                 let logEvent = await __biZZC_SQS.SendEventLog(conversationevent, (QueuedSession._id) ? QueuedSession._id : QueuedSession.id);
//                                                 //if (logEvent) SocketServer.of(nsp).to(Agents.NotifyAll()).emit('visitorEventLog', logEvent);
//                                             }
//                                         }
//                                     }
//                                 }
//                                 //#endregion
//                                 break;
//                         }
//                         return;
//                     });
//                     try {
//                         await Promise.all(promises);
//                     } catch (error) {
//                         console.log('error in Timout Function Visitors');
//                         console.log(error);
//                         throw new error({ msg: 'error in Timout Function Visitors', error: error });
//                     }
//                 });
//                 try {
//                     await Promise.all(nspPromises);
//                 } catch (error) {
//                     console.log('error in Interval Function Visitor Non Chatting');
//                     console.log(error);
//                 } finally {
//                     this.CheckInactiveVisitorsChatting();
//                     //this.IntervalFunctionAgents();
//                 }
//             }
//         }, 60000)
//     }
//     public static CheckInactiveVisitorsChatting(): NodeJS.Timer {
//         return setTimeout(async () => {
//             console.log('CheckInactiveVisitorsChatting');
//             // let SocketServer: SocketIO.Server = SocketListener.getSocketServer();
//             let companies = await Company.GetCompanies()
//             if (companies) {
//                 let nspPromises = companies.map(async company => {
//                     if (this.IgnoreNameSpace(company.name)) return;
//                     await SessionManager.resetAgentChatCounts(company.name, 'Agents');
//                     // console.log(nsp);
//                     // console.log( SocketServer.of(nsp));
//                     let InactiveSessions: any[] = (await SessionManager.GetAllInactiveVisitors(company.name, company['settings']['chatSettings']['inactivityTimeouts']['inactiveTimeout'], true) as Array<any>);
//                     let promises = (InactiveSessions as Array<any>).map(async session => {
//                         // console.log(session);
//                         let logEvent: any = undefined;
//                         let event: string = '';
//                         let chatEvent: string = '';
//                         let inactivityDate = new Date();
//                         inactivityDate.setMinutes(inactivityDate.getMinutes() - company['settings']['chatSettings']['inactivityTimeouts']['inactiveTimeout']);
//                         let updateSession: any = undefined
//                         let date = new Date();
//                         date.setMinutes(date.getMinutes() + company['settings']['chatSettings']['inactivityTimeouts']['endSessionTimeout']);
//                         let conversation = await Conversations.getInactiveChat(session.conversationID, company['settings']['chatSettings']['inactivityTimeouts']['inactiveTimeout'], true);
//                         //console.log('Converstaion : ', conversation);
//                         let promises: any;
//                         if (conversation.length && conversation[0].lastMessage) {
//                             switch (session.state) {
//                                 case 2:
//                                     /**
//                                          * @Note : 
//                                          * Inactive Propositions
//                                          * 1. IF Last Touched time + N(mins) < Current Time And No Conversation Message
//                                          * 2. IF Last Touched Time + N(mins) < Current Time  And Lastmessage timestamp + N(mins) < Current Time
//                                          * @Action Move To Inactive
//                                     */
//                                     if (conversation[0].createdOn > inactivityDate.toISOString() && session.lastTouchedTime > inactivityDate.toISOString()) {
//                                         break;
//                                     } else if (conversation[0].lastMessage.date < inactivityDate.toISOString()) {
//                                         session.inactive = true;
//                                         session.expiry = date.toISOString();
//                                         chatEvent = 'Marked Inactive in Unassigned State'
//                                         promises = await Promise.all([
//                                             __biZZC_SQS.SendEventLog(EventLogMessages.VISITOR_INACTIVE_FROM_QUEUE, session._id || session.id),
//                                             SessionManager.UpdateSession(session._id || session.id, session),
//                                             Conversations.MakeInactive(session.conversationID)
//                                         ]);
//                                         logEvent = promises[0];
//                                         updateSession = promises[1];
//                                         //if (logEvent) SocketServer.of(nsp).to(Agents.NotifyAll()).emit('visitorEventLog', logEvent);
//                                         if (updateSession) {
//                                             let insertedMessage = await CreateLogMessage({
//                                                 from: session.agent.name,
//                                                 to: (session.username) ? session.agent.name || session.agent.nickname : '',
//                                                 body: chatEvent,
//                                                 type: 'Events',
//                                                 cid: (session.conversationID) ? session.conversationID : '',
//                                                 attachment: false,
//                                                 date: new Date().toISOString(),
//                                                 delivered: true,
//                                                 sent: true
//                                             })
//                                             // if (insertedMessage) SocketServer.of(nsp).to(Visitor.NotifyOne(session)).emit('privateMessage', insertedMessage)
//                                             if (insertedMessage) await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'V', broadcast: false, eventName: 'privateMessage', nsp: session.nsp, roomName: [Visitor.NotifyOne(session)], data: insertedMessage });
//                                             // SocketServer.of(nsp).to(Visitor.NotifyOne(session)).emit('visitorInactive', { session: session })
//                                             // SocketServer.of(nsp).to(Agents.NotifyAll()).emit('updateUser', { id: session.id || session._id, session: session });
//                                             await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: session.nsp, roomName: [Agents.NotifyAll()], data: { id: session.id || session._id, session: session } });
//                                         }
//                                     }
//                                     break;
//                                 case 3:
//                                     /**
//                                      * @Note : 
//                                      * Inactive Propositions
//                                      * 1. IF Last Touched time + N(mins) < Current Time And No Conversation Message
//                                      * 2. IF Last Touched Time + N(mins) < Current Time And Last Mesage Sent By Agent  And Lastmessage timestamp + N(mins) < Current Time
//                                      * @Action Move To Inactive
//                                      */
//                                     if (((conversation[0].lastMessage.type == 'Agents' && conversation[0].lastMessage.date < inactivityDate.toISOString()))
//                                         || ((conversation[0].lastMessage.type == 'Visitors' && conversation[0].lastMessage.date < inactivityDate.toISOString()) && conversation[0].createdOn < inactivityDate.toISOString())) {// console.log('Conversation Length : ', conversation.length);
//                                         // console.log('Last Message == Agents : ', conversation[0].lastMessage.type == 'Agents');
//                                         // console.log('Conversation LAst Message Date : ', conversation[0].lastMessage.date)
//                                         // console.log('Conversation Inactive Time : ', inactivityDate.toISOString())
//                                         // console.log('Conversation Criterea : ', conversation[0].lastMessage.date < inactivityDate.toISOString())
//                                         session.inactive = true;
//                                         session.expiry = date.toISOString();
//                                         event = ComposedENUM(DynamicEventLogs.VISITOR_CHATTING_INACTIVE, { newEmail: '', oldEmail: '', name: session.agent.name });
//                                         chatEvent = 'Marked inactive while chatting to ' + session.agent.name
//                                         promises = await Promise.all([
//                                             __biZZC_SQS.SendEventLog(event, session._id || session.id),
//                                             SessionManager.UpdateSession(session._id || session.id, session),
//                                             Conversations.UpdateConversationState(session.conversationID, 2, true),
//                                             SessionManager.UnsetChatFromAgent(session)
//                                         ]);
//                                         logEvent = promises[0];
//                                         updateSession = promises[1];
//                                         //await SessionManager.resetAgentChatCounts(session.nsp, 'Agents');
//                                         let updatedconversation = promises[2];
//                                         //if (logEvent) SocketServer.of(nsp).to(Agents.NotifyAll()).emit('visitorEventLog', logEvent);
//                                         let insertedMessage;
//                                         if (updateSession) {
//                                             /**
//                                              * Move Logic To server-side
//                                              */
//                                             // socket.to(Visitor.NotifyOne(sender)).emit('privateMessage', messageinsertedID.ops[0]);
//                                             insertedMessage = await CreateLogMessage({
//                                                 from: session.agent.name,
//                                                 to: (session.username) ? session.agent.name || session.agent.nickname : '',
//                                                 body: event,
//                                                 type: 'Events',
//                                                 cid: (session.conversationID) ? session.conversationID : '',
//                                                 attachment: false,
//                                                 date: new Date().toISOString(),
//                                                 delivered: true,
//                                                 sent: true
//                                             })
//                                             // if (insertedMessage) SocketServer.of(nsp).to(Visitor.NotifyOne(session)).emit('privateMessage', insertedMessage)
//                                             // SocketServer.of(nsp).to(Agents.NotifyAll()).emit('updateUser', { id: session.id || session._id, session: session });
//                                             if (insertedMessage) await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'V', broadcast: false, eventName: 'privateMessage', nsp: session.nsp, roomName: [Visitor.NotifyOne(session)], data: insertedMessage });
//                                             await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: session.nsp, roomName: [Agents.NotifyAll()], data: { id: session.id || session._id, session: session } });
//                                         }
//                                         if (updatedconversation) await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'makeConversationInactive', nsp: session.nsp, roomName: [Agents.NotifyOne(session)], data: { conversation: updatedconversation.value, status: (insertedMessage) ? insertedMessage : '' } });
//                                         if (company['settings']['chatSettings']['assignments'].aEng) {
//                                             await AutoAssignFromQueueAuto(session);
//                                             //#region Non-Abstract Code
//                                             // promises = await Promise.all([
//                                             // 	SessionManager.GetAgentByID(session.agent.id),
//                                             // 	SessionManager.GetQueuedSession(session.nsp),
//                                             // 	SessionManager.UnsetChatFromAgent(session)
//                                             // ]);
//                                             // let Agent = promises[0];
//                                             // let QueuedSession = promises[1];
//                                             // if (Agent && Agent.chatCount < Agent.concurrentChatLimit && QueuedSession) {
//                                             // 	console.log('dequeuing');
//                                             // 	let UpdatedSessions = await SessionManager.AssignAgent(QueuedSession, (Agent.id || Agent._id as string), QueuedSession.conversationID);
//                                             // 	QueuedSession = UpdatedSessions.visitor;
//                                             // 	Agent = UpdatedSessions.agent;
//                                             // 	SocketServer.of(nsp).to(Agents.NotifyAll()).emit('updateUser', { id: QueuedSession.id, session: QueuedSession });
//                                             // 	if (QueuedSession && Agent) {
//                                             // 		let Queuedconversation = await Conversations.UpdateConverSationEmail(QueuedSession.conversationID, QueuedSession.email);
//                                             // 		if (Queuedconversation) {
//                                             // 			if (Queuedconversation.value && Queuedconversation.value.messageReadCount) {
//                                             // 				let conversationevent = 'Visitor Requested from Queued state';
//                                             // 				let logEvent = await SessionManager.CreateEventLog(conversationevent, (QueuedSession._id) ? QueuedSession._id : QueuedSession.id);
//                                             // 				if (logEvent) SocketServer.of(nsp).to(Agents.NotifyAll()).emit('visitorEventLog', logEvent);
//                                             // 				Queuedconversation.value.messages = await Conversations.getMessages1(QueuedSession.conversationID);
//                                             // 				SocketServer.of(nsp).to(Agents.NotifyOne(QueuedSession)).emit('newConversation', Queuedconversation.value)
//                                             // 				SocketServer.of(nsp).to(Visitor.NotifyOne(QueuedSession)).emit('gotAgent', {
//                                             // 					agent: QueuedSession.agent,
//                                             // 					cid: QueuedSession.conversationID,
//                                             // 					state: QueuedSession.state,
//                                             // 					username: QueuedSession.username,
//                                             // 					email: QueuedSession.email
//                                             // 				});
//                                             // 			}
//                                             // 		}
//                                             // 	}
//                                             // }
//                                             //#endregion
//                                         }
//                                     }
//                                     break;
//                             }
//                         } else {
//                             if (conversation.length && conversation[0].createdOn < inactivityDate.toISOString()) {
//                                 switch (session.state) {
//                                     case 2:
//                                         /**
//                                              * @Note : 
//                                              * Inactive Propositions
//                                              * 1. IF Last Touched time + N(mins) < Current Time And No Conversation Message
//                                              * 2. IF Last Touched Time + N(mins) < Current Time  And Lastmessage timestamp + N(mins) < Current Time
//                                              * @Action Move To Inactive
//                                         */
//                                         session.inactive = true;
//                                         session.expiry = date.toISOString();
//                                         event = 'Visitor Went Inactive from Unassigned chat.';
//                                         chatEvent = 'Marked Inactive in Unassigned State'
//                                         promises = await Promise.all([
//                                             __biZZC_SQS.SendEventLog(EventLogMessages.VISITOR_INACTIVE_FROM_QUEUE, session._id || session.id),
//                                             SessionManager.UpdateSession(session._id || session.id, session),
//                                             Conversations.MakeInactive(session.conversationID)
//                                         ]);
//                                         logEvent = promises[0];
//                                         updateSession = promises[1];
//                                         //if (logEvent) SocketServer.of(nsp).to(Agents.NotifyAll()).emit('visitorEventLog', logEvent);
//                                         if (updateSession) {
//                                             let insertedMessage = await CreateLogMessage({
//                                                 from: session.agent.name,
//                                                 to: (session.username) ? session.agent.name || session.agent.nickname : '',
//                                                 body: event,
//                                                 type: 'Events',
//                                                 cid: (session.conversationID) ? session.conversationID : '',
//                                                 attachment: false,
//                                                 date: new Date().toISOString(),
//                                                 delivered: true,
//                                                 sent: true
//                                             })
//                                             // SocketServer.of(nsp).to(Visitor.NotifyOne(session)).emit('visitorInactive', { session: session })
//                                             // SocketServer.of(nsp).to(Visitor.NotifyOne(session)).emit('inactiveVisitorState', { state: session.state, inactive: true, event: chatEvent })
//                                             // if (insertedMessage) SocketServer.of(nsp).to(Visitor.NotifyOne(session)).emit('privateMessage', insertedMessage)
//                                             // SocketServer.of(nsp).to(Agents.NotifyAll()).emit('updateUser', { id: session.id || session._id, session: session });
//                                             if (insertedMessage) await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'V', broadcast: false, eventName: 'privateMessage', nsp: session.nsp, roomName: [Visitor.NotifyOne(session)], data: insertedMessage });
//                                             await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: session.nsp, roomName: [Agents.NotifyAll()], data: { id: session.id || session._id, session: session } });
//                                         }
//                                         break;
//                                     case 3:
//                                         /**
//                                          * @Note : 
//                                          * Inactive Propositions
//                                          * 1. IF Last Touched time + N(mins) < Current Time And No Conversation Message
//                                          * 2. IF Last Touched Time + N(mins) < Current Time And Last Mesage Sent By Agent  And Lastmessage timestamp + N(mins) < Current Time
//                                          * @Action Move To Inactive
//                                          */
//                                         session.inactive = true;
//                                         session.expiry = date.toISOString();
//                                         event = ComposedENUM(DynamicEventLogs.VISITOR_CHATTING_INACTIVE, { oldEmail: '', newEmail: '', name: session.agent.name });
//                                         chatEvent = 'Marked inactive while chatting to ' + session.agent.name
//                                         promises = await Promise.all([
//                                             __biZZC_SQS.SendEventLog(event, session._id || session.id),
//                                             SessionManager.UpdateSession(session._id || session.id, session),
//                                             Conversations.UpdateConversationState(session.conversationID, 2, true),
//                                             SessionManager.UnsetChatFromAgent(session)
//                                         ]);
//                                         logEvent = promises[0];
//                                         updateSession = promises[1];
//                                         //await SessionManager.resetAgentChatCounts(session.nsp, 'Agents');
//                                         let updatedconversation = promises[2];
//                                         //if (logEvent) SocketServer.of(nsp).to(Agents.NotifyAll()).emit('visitorEventLog', logEvent);
//                                         let insertedMessage
//                                         if (updateSession) {
//                                             /**
//                                              * Move Logic To server-side
//                                              */
//                                             // socket.to(Visitor.NotifyOne(sender)).emit('privateMessage', messageinsertedID.ops[0]);
//                                             insertedMessage = await CreateLogMessage({
//                                                 from: session.agent.name,
//                                                 to: (session.username) ? session.agent.name || session.agent.nickname : '',
//                                                 body: event,
//                                                 type: 'Events',
//                                                 cid: (session.conversationID) ? session.conversationID : '',
//                                                 attachment: false,
//                                                 date: new Date().toISOString(),
//                                                 delivered: true,
//                                                 sent: true
//                                             })
//                                             // if (insertedMessage) SocketServer.of(nsp).to(Visitor.NotifyOne(session)).emit('privateMessage', insertedMessage);
//                                             // SocketServer.of(nsp).to(Agents.NotifyAll()).emit('updateUser', { id: session.id || session._id, session: session });
//                                             if (insertedMessage) await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'V', broadcast: false, eventName: 'privateMessage', nsp: session.nsp, roomName: [Visitor.NotifyOne(session)], data: insertedMessage });
//                                             await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: session.nsp, roomName: [Agents.NotifyAll()], data: { id: session.id || session._id, session: session } });
//                                         }
//                                         if (updatedconversation) await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'makeConversationInactive', nsp: session.nsp, roomName: [Agents.NotifyOne(session)], data: { conversation: updatedconversation.value, status: (insertedMessage) ? insertedMessage : '' } });
//                                         if (company['settings']['chatSettings']['assignments'].aEng) {
//                                             await AutoAssignFromQueueAuto(session);
//                                             //#region Non-Abstract Code
//                                             // promises = await Promise.all([
//                                             // 	SessionManager.GetAgentByID(session.agent.id),
//                                             // 	SessionManager.GetQueuedSession(session.nsp),
//                                             // 	SessionManager.UnsetChatFromAgent(session)
//                                             // ]);
//                                             // let Agent = promises[0];
//                                             // let QueuedSession = promises[1];
//                                             // if (Agent && Agent.chatCount < Agent.concurrentChatLimit && QueuedSession) {
//                                             // 	let UpdatedSessions = await SessionManager.AssignAgent(QueuedSession, (Agent.id || Agent._id as string), QueuedSession.conversationID);
//                                             // 	QueuedSession = UpdatedSessions.visitor;
//                                             // 	Agent = UpdatedSessions.agent;
//                                             // 	SocketServer.of(nsp).to(Agents.NotifyAll()).emit('updateUser', { id: QueuedSession.id, session: QueuedSession });
//                                             // 	if (QueuedSession && Agent) {
//                                             // 		let Queuedconversation = await Conversations.UpdateConverSationEmail(QueuedSession.conversationID, QueuedSession.email);
//                                             // 		if (Queuedconversation) {
//                                             // 			if (Queuedconversation.value && Queuedconversation.value.messageReadCount) {
//                                             // 				let conversationevent = 'Visitor Requested from Queued state';
//                                             // 				let logEvent = await SessionManager.CreateEventLog(conversationevent, (QueuedSession._id) ? QueuedSession._id : QueuedSession.id);
//                                             // 				if (logEvent) SocketServer.of(nsp).to(Agents.NotifyAll()).emit('visitorEventLog', logEvent);
//                                             // 				Queuedconversation.value.messages = await Conversations.getMessages1(QueuedSession.conversationID);
//                                             // 				SocketServer.of(nsp).to(Agents.NotifyOne(QueuedSession)).emit('newConversation', Queuedconversation.value)
//                                             // 				SocketServer.of(nsp).to(Visitor.NotifyOne(QueuedSession)).emit('gotAgent', {
//                                             // 					agent: QueuedSession.agent,
//                                             // 					cid: QueuedSession.conversationID,
//                                             // 					state: QueuedSession.state,
//                                             // 					username: QueuedSession.username,
//                                             // 					email: QueuedSession.email
//                                             // 				});
//                                             // 			}
//                                             // 		}
//                                             // 	}
//                                             // }
//                                             //#endregion
//                                         }
//                                         break;
//                                 }
//                             }
//                         }
//                         return;
//                     });
//                     try {
//                         await Promise.all(promises);
//                     } catch (error) {
//                         console.log('error in Timeout Function Visitors');
//                         console.log(error);
//                         throw new error({ msg: 'error in Timout Function Chatting', error: error });
//                     }
//                 });
//                 try {
//                     await Promise.all(nspPromises);
//                 } catch (error) {
//                     console.log('error in Interval Function Visitor Chatting');
//                     console.log(error);
//                 } finally {
//                     this.DeleteInactiveVisitors();
//                     //this.IntervalFunctionAgents();
//                 }
//             }
//         }, 5000)
//     }
//     public static SLAPolicyPolling(data, ticket): NodeJS.Timer {
//         return setTimeout(async () => {
//             console.log('CheckingSLAPolicy');
//             if (data.violationResponse && data.violationResponse.length && data.violationResolution && data.violationResolution.length && ticket.slaPolicyEnabled) {
//                 //Check tid in ticketmessage according to _id of ticket
//                 console.log("vioRes", data.slaTarget);
//                 let responseCheck = await Tickets.CheckMessageEntry(ticket);
//                 console.log("checking polling", responseCheck);
//                 if (responseCheck && responseCheck.length && responseCheck[0].datetime) {
//                     console.log("view result", responseCheck[0].datetime);
//                     let messageDatetime = new Date(responseCheck[0].datetime).getMinutes();
//                     let ticketDatetime = new Date(ticket.datetime).getMinutes();
//                     let currentDatetime = new Date().getMinutes();
//                     let diff: number = (messageDatetime - ticketDatetime);
//                     if (diff && diff < data.slaTarget.timeResponse) { //base case
//                         console.log("need to send email after data.violationResponse[0].time, which is in minutes!");
//                         if (messageDatetime + data.violationResponse[0].time > currentDatetime) {
//                             let obj = {
//                                 action: 'sendNoReplyEmail',
//                                 to: this.SendEmailTo(data.violationResponse.notifyTo, ticket),
//                                 subject: 'Escalation Email for Ticket :  ' + ticket._id + ' having priority ' + ticket.priority,
//                                 message: `Hello Agent,  
// 									  \n
// 									  Just wanted to let you know that your new time to response for ticket $(ticket._id) is escalated. 
// 									  \n
// 									  Ticket Subject : ${ticket.subject} 
// 									  \n
// 									  You can check the activity on https://app.beelinks.solutions/tickets
// 									  \n
// 									  Regards,
// 									  Beelinks Team`,
//                                 html: `Hello Agent, 
// 									  <br>
// 									  Just wanted to let you know that your new time to response for ticket $(ticket._id) is escalated. 
// 									  <br>
// 									  Ticket Subject : ${ticket.subject} 
// 									  <br>
// 									  You can check the activity on <a href="https://app.beelinks.solutions/tickets/ticket-view/${ticket._id}">Beelinks Ticket</a>
// 									  <br>
// 									  Regards,
// 									  Beelinks Team
// 									  `
//                             }
//                             let response = await EmailService.SendNoReplyEmail(obj, false);
//                             if (response) {
//                                 let ticketLog: TicketLogSchema = {
//                                     time_stamp: new Date().toISOString(),
//                                     status: `violation of response`,
//                                     title: `Escalation email sent as per policy`,
//                                     updated_by: 'Beelinks',
//                                     user_type: 'Beelinks Scheduler'
//                                 }
//                                 let result = await Tickets.UnsetBooleanOrPushLog(ticket._id, ticket.nsp, ticketLog);
//                                 if (result && (!result.ok || !result.value)) {
//                                     console.log('escalation email Deletion Failed ' + ticket._id);
//                                 }
//                             } else {
//                                 console.log('Email Delivery Failed For escalation');
//                             }
//                             return;
//                         }
//                         else {
//                             console.log("email sending time not occur");
//                         }
//                     }
//                     else {
//                         console.log("not to send email, responded");
//                         ticket = await Tickets.UnsetBooleanOrPushLog(ticket._id, ticket.nsp);
//                     }
//                 }
//                 else {
//                     console.log("no result from CheckIfSLAVioRespTimeReached");
//                 }
//             }
//         }, 50000)
//     }
//     public static DeleteInactiveVisitors(): NodeJS.Timer {
//         return setTimeout(async () => {
//             // let SocketServer: SocketIO.Server = SocketListener.getSocketServer();
//             let companies = await Company.GetCompanies();
//             if (companies) {
//                 // console.log('disconnecting Interval Function Visitors at : ' + new Date().toISOString());
//                 let nspPromises = companies.map(async company => {
//                     if (this.IgnoreNameSpace(company.name)) return;
//                     //await SessionManager.resetAgentChatCounts(company.name, 'Agents');
//                     let ExpirtedSession: any[] = (await SessionManager.GetALLExpiredSessions(company.name, 'Visitors') as Array<any>);
//                     let promises = (ExpirtedSession as Array<any>).map(async session => {
//                         let endedConversation: any = undefined;
//                         switch (session.state) {
//                             case 1:
//                             case 5:
//                                 await SessionManager.RemoveSession(session, false);
//                                 // SocketServer.of(nsp).to(Agents.NotifyAll()).emit('removeUser', session.id);
//                                 await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'removeUser', nsp: session.nsp, roomName: [Agents.NotifyAll()], data: session.id });
//                                 break;
//                             case 2:
//                             case 3:
//                             case 4:
//                                 __BIZZC_REDIS.SetID(session._id || session.id, 5);
//                                 // SocketServer.of(nsp).to(Visitor.NotifyOne(session)).emit('endChatDisconnection');
//                                 await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'V', broadcast: false, eventName: 'endChatDisconnection', nsp: session.nsp, roomName: [Visitor.NotifyOne(session)], data: '' });
//                                 await SessionManager.RemoveSession(session, false);
//                                 // SocketServer.of(nsp).to(Agents.NotifyAll()).emit('removeUser', session.id);
//                                 await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'removeUser', nsp: session.nsp, roomName: [Agents.NotifyAll()], data: session.id });
//                                 let data = await SessionManager.GetSessionForChat((session._id || session.id) as string)
//                                 endedConversation = (session.state == 2) ? await Conversations.EndChatMissed(session.conversationID, (data) ? data : '') : await Conversations.EndChat(session.conversationID, true, (data) ? data : '');
//                                 let packet: SQSPacket = {
//                                     action: 'endConversation',
//                                     cid: session.conversationID
//                                 }
//                                 await __biZZC_SQS.SendMessage({ action: 'startConversation', conversation: endedConversation.value }, ARCHIVINGQUEUE);
//                                 await __biZZC_SQS.SendMessage(packet, ARCHIVINGQUEUE);
//                                 let unAssignedTicket;
//                                 if ((!session.agent.id && (session.state == 2)) && (session.email && (session.email as string).toLowerCase() != 'unregistered')) unAssignedTicket = await ChatToTicket(endedConversation.value)
//                                 /**
//                                  * @Note
//                                  * Incomplete Process. Implement it properly when working on Admin Roles, Unnassigned Conversations, Chat Supervision 
//                                  */
//                                 if (endedConversation && endedConversation.value) {
//                                     let insertedMessage = await CreateLogMessage({
//                                         from: session.agent.name,
//                                         to: (session.username) ? session.agent.name || session.agent.nickname : '',
//                                         body: 'Chat ended due to inactivity',
//                                         type: 'Events',
//                                         cid: (session.conversationID) ? session.conversationID : '',
//                                         attachment: false,
//                                         date: new Date().toISOString(),
//                                         delivered: true,
//                                         sent: true
//                                     })
//                                     // SocketServer.of(nsp).to(Agents.NotifyOne(session)).emit('stopConversation', { conversation: endedConversation.value });
//                                     await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'stopConversation', nsp: session.nsp, roomName: [Agents.NotifyOne(session)], data: { conversation: endedConversation.value } });
//                                     if (endedConversation && endedConversation.value && endedConversation.value.superviserAgents && endedConversation.value.superviserAgents.length) {
//                                         endedConversation.value.superviserAgents.forEach(async agentID => {
//                                             await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'removeConversation', nsp: session.nsp, roomName: [agentID.toHexString()], data: { conversation: (endedConversation && endedConversation.value) ? endedConversation.value : '' } });
//                                         });
//                                     }
//                                     if (insertedMessage) await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'privateMessage', nsp: session.nsp, roomName: [Agents.NotifyOne(session)], data: insertedMessage });
//                                     await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'Admin', broadcast: false, eventName: 'removeUnassignedConvo', nsp: session.nsp, roomName: [], data: { conversation: endedConversation.value } });
//                                 }
//                                 break;
//                             default:
//                                 await SessionManager.RemoveSession(session, false);
//                                 await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'removeUser', nsp: session.nsp, roomName: [Agents.NotifyAll()], data: session.id });
//                                 break;
//                         }
//                         await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'disconnect', data: session })
//                         return;
//                     });
//                     try {
//                         await Promise.all(promises);
//                     } catch (error) {
//                         console.log('error in Timout Function Visitors');
//                         console.log(error);
//                         throw new error({ msg: 'error in Timout Function Visitors', error: error });
//                     }
//                 });
//                 try {
//                     await Promise.all(nspPromises);
//                 } catch (error) {
//                     console.log('error in Interval Function Visitor Deleting Inactive Visitors');
//                     console.log(error);
//                 } finally {
//                     this.DeleteInactiveAgents();
//                     //this.IntervalFunctionAgents();
//                 }
//             }
//         }, 3000);
//     }
//     public static SendEmailTo(to, ticket) {
//         console.log("assigned agent", ticket.assigned_to);
//         let arr: any = [];
//         to.map(email => {
//             if (email == 'Assigned Agent') {
//                 arr.push(ticket.assigned_to)
//             }
//             else {
//                 arr.push(email)
//             }
//         })
//         console.log("emails arr", arr);
//         return arr;
//     }
//     public static DeleteInactiveAgents(): NodeJS.Timer {
//         return setTimeout(async () => {
//             // let SocketServer: SocketIO.Server = SocketListener.getSocketServer();
//             let companies = await Company.GetCompanies()
//             if (companies) {
//                 // console.log('disconnecting Interval Function Agents at : ' + new Date().toISOString());
//                 let nspPromises = companies.map(async company => {
//                     if (this.IgnoreNameSpace(company.name)) return;
//                     //await SessionManager.resetAgentChatCounts(company.name, 'Agents');
//                     let ExpiredSession: any[] = (await SessionManager.GetALLExpiredSessions(company.name, 'Agents') as Array<any>);
//                     let promises = (ExpiredSession as Array<any>).map(async agent => {
//                         try {
//                             console.log('Deleting ' + agent.type + ' ' + agent.id);
//                             await SessionManager.RemoveSession(agent, false);
//                             // await SocketListener.DisconnectSession(nsp, agent.id || agent._id);
//                             await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'disconnect', data: agent })
//                             // SocketServer.of(nsp).to(Agents.NotifyAll()).emit('agentUnavailable', { email: agent.email, session: agent });
//                             await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'agentUnavailable', nsp: agent.nsp, roomName: [Agents.NotifyAll()], data: { email: agent.email, session: agent } });
//                             // if (agent.permissions.chats.canChat) SocketServer.of(nsp).to(Visitor.BraodcastToVisitors()).emit('agentUnavailable', { id: agent.id || agent._id });
//                             if (agent.permissions.chats.canChat) await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'V', broadcast: true, eventName: 'agentUnavailable', nsp: agent.nsp, roomName: [Visitor.BraodcastToVisitors()], data: { id: agent.id || agent._id } });
//                             let ConnectedVisitors = Object.keys(agent.rooms);
//                             switch (ConnectedVisitors.length) {
//                                 case 0:
//                                     return;
//                                 default:
//                                     let allAgents = await SessionManager.GetAllActiveAgentsChatting(agent);
//                                     let ConnectedVisiorsPromise = ConnectedVisitors.map(async visitorID => {
//                                         if (!allAgents) {
//                                             let pendingVisitor = await SessionManager.UnseAgentFromVisitor(visitorID);
//                                             if (pendingVisitor) {
//                                                 let queEvent = ComposedENUM(DynamicEventLogs.VISITOR_UNASSIGNED, { newEmail: '', oldEmail: agent.email })
//                                                 // SocketServer.of(nsp).to(visitorID).emit('noAgent', { state: 2, agent: pendingVisitor.agent });
//                                                 // SocketServer.of(nsp).to(Agents.NotifyAll()).emit('updateUser', { id: pendingVisitor.id, session: pendingVisitor });
//                                                 await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'V', broadcast: false, eventName: 'noAgent', nsp: company.name, roomName: [visitorID], data: { state: 2, agent: pendingVisitor.agent } });
//                                                 await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: agent.nsp, roomName: [Agents.NotifyAll()], data: { id: pendingVisitor.id, session: pendingVisitor } });
//                                                 let conversation = await Conversations.UpdateConversationState(pendingVisitor.conversationID, 1, false);
//                                                 if (conversation && conversation.value)
//                                                     await Conversations.AddPenaltyTime(pendingVisitor.conversationID, conversation.value.agentEmail, (conversation.value.lastMessage) ? conversation.value.lastMessage.date : conversation.value.createdOn);
//                                                 let logEvent = await __biZZC_SQS.SendEventLog(queEvent, (pendingVisitor._id) ? pendingVisitor._id : pendingVisitor.id);
//                                                 //if (logEvent) SocketServer.of(nsp).to(Agents.NotifyAll()).emit('visitorEventLog', logEvent);
//                                             }
//                                             return;
//                                         } else {
//                                             let pendingVisitor = await SessionManager.GetVisitorByID(visitorID);
//                                             if (!pendingVisitor) return;
//                                             await TransferAgentDisconnect(pendingVisitor, visitorID, agent, (agent.id || agent._id));
//                                             //#region old Non-Abstract Code
//                                             let UpdatedSessions = (await SessionManager.AllocateAgent(pendingVisitor, new ObjectID(pendingVisitor.conversationID), [(agent.id || agent._id)]));
//                                             let newAgent = UpdatedSessions.agent;
//                                             pendingVisitor = UpdatedSessions.visitor;
//                                             if (UpdatedSessions && newAgent) {
//                                                 let conversation = (newAgent.email) ? await Conversations.TransferChat((pendingVisitor as VisitorSessionSchema).conversationID, newAgent.email, false) : undefined;
//                                                 if (conversation && conversation.value) {
//                                                     if (conversation && conversation.value)
//                                                         await Conversations.AddPenaltyTime((pendingVisitor as VisitorSessionSchema).conversationID, agent.email, (conversation.value.lastMessage) ? conversation.value.lastMessage.date : conversation.value.createdOn);
//                                                     (conversation.value.messageReadCount)
//                                                         ? conversation.value.messages = await Conversations.getMessages1((pendingVisitor as VisitorSessionSchema).conversationID)
//                                                         : [];
//                                                     let payload = { id: (pendingVisitor as VisitorSessionSchema)._id || (pendingVisitor as VisitorSessionSchema).id, session: pendingVisitor }
//                                                     // let event = 'Chat auto transferred to ' + newAgent.email + ' from ' + agent.email;
//                                                     let event = ComposedENUM(DynamicEventLogs.CHAT_AUTO_TRANSFERED, { newEmail: newAgent.email, oldEmail: (agent && agent.email) ? agent.email : '' })
//                                                     let chatEvent = 'Chat auto transferred to ' + (newAgent.name || newAgent.username || newAgent.nickname) + ((agent && agent.email) ? ' from ' + (agent.name || agent.username || agent.nickname) : '');
//                                                     // SocketServer.of(nsp).to(Agents.NotifyAll()).emit('updateUser', payload);
//                                                     // SocketServer.of(nsp).to(Agents.NotifyOne(pendingVisitor)).emit('newConversation', conversation.value);
//                                                     // SocketServer.of(nsp).to(Visitor.NotifyOne(pendingVisitor as VisitorSessionSchema)).emit('transferChat', { agent: (pendingVisitor as VisitorSessionSchema).agent, event: chatEvent });
//                                                     await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: agent.nsp, roomName: [Agents.NotifyAll()], data: payload });
//                                                     await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'newConversation', nsp: (pendingVisitor as VisitorSessionSchema).nsp, roomName: [Agents.NotifyOne((pendingVisitor as VisitorSessionSchema))], data: conversation.value });
//                                                     await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'V', broadcast: false, eventName: 'transferChat', nsp: company.name, roomName: [Visitor.NotifyOne(pendingVisitor as VisitorSessionSchema)], data: { agent: (pendingVisitor as VisitorSessionSchema).agent, event: chatEvent } });
//                                                     let loggedEvent = await __biZZC_SQS.SendEventLog(event, ((pendingVisitor as VisitorSessionSchema)._id) ? (pendingVisitor as VisitorSessionSchema)._id : (pendingVisitor as VisitorSessionSchema).id);
//                                                     //if (loggedEvent) SocketServer.of(nsp).to(Agents.NotifyAll()).emit('visitorEventLog', loggedEvent);
//                                                 }
//                                             } else {
//                                                 let pendingVisitor = await SessionManager.UnseAgentFromVisitor(visitorID);
//                                                 if (pendingVisitor) {
//                                                     let queEvent = ComposedENUM(DynamicEventLogs.VISITOR_UNASSIGNED, { newEmail: '', oldEmail: agent.email })
//                                                     // SocketServer.of(nsp).to(visitorID).emit('noAgent', { state: 2, agent: pendingVisitor.agent });
//                                                     // SocketServer.of(nsp).to(Agents.NotifyAll()).emit('updateUser', { id: pendingVisitor.id, session: pendingVisitor });
//                                                     await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'V', broadcast: false, eventName: 'noAgent', nsp: company.name, roomName: [visitorID], data: { state: 2, agent: pendingVisitor.agent } });
//                                                     await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: agent.nsp, roomName: [Agents.NotifyAll()], data: { id: pendingVisitor.id, session: pendingVisitor } });
//                                                     let conversation = await Conversations.UpdateConversationState(pendingVisitor.conversationID, 1, false);
//                                                     if (conversation && conversation.value)
//                                                         await Conversations.AddPenaltyTime(pendingVisitor.conversationID, conversation.value.agentEmail, (conversation.value.lastMessage) ? conversation.value.lastMessage.date : conversation.value.createdOn);
//                                                     let logEvent = await __biZZC_SQS.SendEventLog(queEvent, (pendingVisitor._id) ? pendingVisitor._id : pendingVisitor.id);
//                                                     //if (logEvent) SocketServer.of(nsp).to(Agents.NotifyAll()).emit('visitorEventLog', logEvent);
//                                                 }
//                                             }
//                                             //#endregion
//                                         }
//                                         return;
//                                     });
//                                     try { await Promise.all(ConnectedVisiorsPromise); }
//                                     catch (error) { console.log('Error in Agent Interval function When Deleting Agent'); }
//                             }
//                         } catch (error) {
//                             console.log(error);
//                             console.log('Error in Agent Interval function');
//                         }
//                     });
//                     try { await Promise.all(promises); }
//                     catch (error) { console.log('Error in Agent Interval Functions In Expired Sessions Promises'); }
//                 });
//                 try { await Promise.all(nspPromises); }
//                 catch (error) { console.log(error); console.log('Error in Agent Interval function Outer Promise'); }
//                 finally {
//                     this.IntervalAutomaticAssignment();
//                 }
//             }
//         }, 20000);
//     }
//     public static async IntervalAutomaticAssignment() {
//         // console.log('Interval Automatic Assignment!');
//         //get all visitors which fall into the current nsp
//         //check for each rule if the activity time rule exists
//         //check each visitors time if it matches the rule
//         //start engagement for that visitor
//         return setTimeout(async () => {
//             // let SocketServer: SocketIO.Server = SocketListener.getSocketServer();
//             let companies = await Company.GetCompanies()
//             if (companies) {
//                 // console.log('Interval Function Automatic Assignment at : ' + new Date().toISOString());
//                 let nspPromises = companies.map(async company => {
//                     if (this.IgnoreNameSpace(company.name)) return;
//                     await SessionManager.resetAgentChatCounts(company.name, 'Agents');
//                     if (!company['settings']) return;
//                     else if (!company['settings']['chatSettings']['assignments'].aEng) return;
//                     else {
//                         // console.log('running else');
//                         // console.log(nsp);
//                         let ruleSets = company['settings']['chatSettings']['assignments'].ruleSets || [];
//                         // let TimeoutRuleFound = ruleSets.map(rule => { if (rule.id == 'r_activity_time') { return rule; } });
//                         let TimeoutRuleFound = ruleSets.filter(r => r.id == 'r_activity_time');
//                         // console.log(TimeoutRuleFound);
//                         if (TimeoutRuleFound && TimeoutRuleFound.length) {
//                             // console.log('Timeout Rule Found');
//                             // console.log(TimeoutRuleFound);
//                             let AllVisitors: any[] = (await SessionManager.GetVisitorsForInvitation(company.name, TimeoutRuleFound[0].activityTime) as Array<any>);
//                             // console.log(AllVisitors);
//                             let promises = (AllVisitors as Array<any>).map(async visitor => {
//                                 // let creationDate = Date.parse(new Date(visitor.creationDate).toISOString()) + 1000 * 60 * TimeoutRuleFound[0].activityTime - Date.parse(new Date().toISOString());
//                                 // if (creationDate <= 0) return AutomaticEngagement(visitor, 4);
//                                 //else return;
//                                 return AutomaticEngagement(visitor, (company['settings']['chatSettings']['permissions']['invitationChatInitiations']) ? 4 : 5);
//                             });
//                             try {
//                                 await Promise.all(promises);
//                             } catch (error) {
//                                 console.log('error in TimeInterval Automatic Assignment While Inviting');
//                                 console.log(error);
//                                 return
//                                 //throw new error({ msg: 'error in TimeInterval Automatic Assignment While Inviting', error: error });
//                             }
//                         }
//                     }
//                 });
//                 try {
//                     await Promise.all(nspPromises);
//                 } catch (error) {
//                     console.log('error in TimeInterval Automatic Assignment Function');
//                     console.log(error);
//                 } finally {
//                     this.AutomaticTransfer();
//                 }
//             }
//         }, 5000);
//     }
//     public static async AutomaticTransfer() {
//         console.log('Interval Automatic Transfer!');
//         //get all visitors which fall into the current nsp
//         //check for each rule if the activity time rule exists
//         //check each visitors time if it matches the rule
//         //start engagement for that visitor
//         return setTimeout(async () => {
//             // let SocketServer: SocketIO.Server = SocketListener.getSocketServer();
//             let companies = await Company.GetCompanies()
//             if (companies) {
//                 let nspPromises = companies.map(async company => {
//                     if (this.IgnoreNameSpace(company.name)) return;
//                     //await SessionManager.resetAgentChatCounts(company.name, 'Agents');
//                     let InactiveSessions: any[] = (await SessionManager.GetAllWaitingVisitors(company.name) as Array<any>);
//                     let promises = (InactiveSessions as Array<any>).map(async session => {
//                         switch (session.state) {
//                             case 3:
//                                 let logEvent: any = undefined;
//                                 let event: string = '';
//                                 let oldSession = JSON.parse(JSON.stringify(session))
//                                 let updateSession: any = undefined
//                                 let conversation = await Conversations.getInactiveChat(session.conversationID, company['settings']['chatSettings']['inactivityTimeouts']['transferIn'], false);
//                                 let Conversationreference = conversation;
//                                 let promises: any;
//                                 let date: string = '';
//                                 if (conversation.length) date = ((conversation[0] as Object).hasOwnProperty('lastPickedTime')) ? conversation[0].lastPickedTime : conversation[0].lastMessage.date
//                                 let transferIn = new Date();
//                                 let date1: any;
//                                 if (date) {
//                                     date1 = new Date(date);
//                                     // if (conversation[0]) console.log(date1);
//                                     date1.setMinutes(date1.getMinutes() + company['settings']['chatSettings']['inactivityTimeouts']['transferIn']);
//                                 }
//                                 // console.log(date1);
//                                 //transferIn.setMinutes(transferIn.getMinutes() + SocketServer.of(nsp)['settings']['chatSettings']['inactivityTimeouts']['transferIn']);
//                                 /**
//                                      * @Note : 
//                                      * Auto Transfer Propositions
//                                      * 1. IF Last Touched Time + N(mins) < Current Time And Last Mesage Sent By Visitor  And Lastmessage timestamp + N(mins) < Current Time
//                                      * @Action Move To Inactive
//                                 */
//                                 if ((conversation.length && (conversation[0].lastMessage && (conversation[0].lastMessage.type == 'Visitors') && conversation[0].entertained && (date1.toISOString() < transferIn.toISOString())))) {
//                                     //console.log('autotransfer');
//                                     let allAgents = await SessionManager.GetAllActiveAgentsChatting(session, [(session.agent.id || session.agent._id)]);
//                                     if (!allAgents) {
//                                         //#region Unassign User due to no-response
//                                         // let unset = SessionManager.UnsetChatFromAgent(session)
//                                         // let pendingVisitor = await SessionManager.UnseAgentFromVisitor(session.id || session._id);
//                                         // await unset;
//                                         // if (pendingVisitor) {
//                                         //     let queEvent = ComposedENUM(DynamicEventLogs.VISITOR_ASSIGNED_UNASSIGNED_NO_RESPONSE, {
//                                         //         newEmail: '', oldEmail: '',
//                                         //         mins: company['settings']['chatSettings']['inactivityTimeouts']['transferIn'],
//                                         //         name: session.agent.name
//                                         //     })
//                                         //     promises = await Promise.all([
//                                         //         await __biZZC_SQS.SendEventLog(queEvent, (pendingVisitor._id) ? pendingVisitor._id : pendingVisitor.id),
//                                         //         await Conversations.UpdateConversationState(pendingVisitor.conversationID, 1, false),
//                                         //         await Conversations.AddPenaltyTime(pendingVisitor.conversationID, conversation[0].agentEmail, conversation[0].lastMessage.date)
//                                         //     ]);
//                                         //     let logEvent = promises[0];
//                                         //     //if (logEvent) SocketServer.of(nsp).to(Agents.NotifyAll()).emit('visitorEventLog', logEvent);
//                                         //     let insertedMessage = await CreateLogMessage({
//                                         //         from: session.agent.name,
//                                         //         to: (session.username) ? session.agent.name || session.agent.nickname : '',
//                                         //         body: queEvent,
//                                         //         type: 'Events',
//                                         //         cid: (session.conversationID) ? session.conversationID : '',
//                                         //         attachment: false,
//                                         //         date: new Date().toISOString(),
//                                         //         delivered: true,
//                                         //         sent: true
//                                         //     })
//                                         //     if (insertedMessage) {
//                                         //         await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'privateMessage', nsp: pendingVisitor.nsp, roomName: [Agents.NotifyOne(pendingVisitor)], data: insertedMessage });
//                                         //         await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'V', broadcast: false, eventName: 'privateMessage', nsp: company.name, roomName: [Visitor.NotifyOne(session)], data: insertedMessage });
//                                         //     }
//                                         //     await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'V', broadcast: false, eventName: 'noAgent', nsp: company.name, roomName: [session.id || session._id], data: { state: 2, agent: pendingVisitor.agent } });
//                                         //     await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: company.name, roomName: [Agents.NotifyAll()], data: { id: pendingVisitor.id, session: pendingVisitor } });
//                                         //     await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'removeConversation', nsp: company.name, roomName: [Agents.NotifyOne(oldSession)], data: { conversation: promises[1].value } });
//                                         // }
//                                         //#endregion
//                                         return;
//                                     } else {
//                                         promises = await Promise.all([
//                                             SessionManager.UnsetChatFromAgent(session),
//                                             SessionManager.GetVisitorByID(session.id || session._id),
//                                         ]);
//                                         let unsetAgent = promises[0];
//                                         let pendingVisitor = promises[1];
//                                         await SessionManager.resetAgentChatCounts(session.nsp, 'Agents');
//                                         if (!pendingVisitor) return;
//                                         let UpdatedSessions = (await SessionManager.AllocateAgent(pendingVisitor, new ObjectID(pendingVisitor.conversationID), [(session.agent.id || session.agent._id)]));
//                                         let newAgent = UpdatedSessions.agent;
//                                         pendingVisitor = UpdatedSessions.visitor;
//                                         if (UpdatedSessions && newAgent) {
//                                             (Conversationreference && Conversationreference.length && Conversationreference[0].agentEmail) ?
//                                                 await Conversations.AddPenaltyTime(pendingVisitor.conversationID, Conversationreference[0].agentEmail, (Conversationreference[0].lastMessage) ? Conversationreference[0].lastMessage.date : Conversationreference[0].createdOn) : undefined;
//                                             let conversation = (newAgent.email) ? await Conversations.TransferChat((pendingVisitor as VisitorSessionSchema).conversationID, newAgent.email, false, transferIn.toISOString()) : undefined;
//                                             if (conversation && conversation.value) {
//                                                 //let lastTransfered = await Conversations.UpdateLastTransferred((pendingVisitor as VisitorSessionSchema).conversationID, transferIn)
//                                                 (conversation.value.messageReadCount)
//                                                     ? conversation.value.messages = await Conversations.getMessages1((pendingVisitor as VisitorSessionSchema).conversationID)
//                                                     : [];
//                                                 let payload = { id: (pendingVisitor as VisitorSessionSchema)._id || (pendingVisitor as VisitorSessionSchema).id, session: pendingVisitor }
//                                                 let queEvent = ComposedENUM(DynamicEventLogs.VISITOR_TRANSFERED_NO_RESPONSE, {
//                                                     newEmail: newAgent.email, oldEmail: session.agent.name,
//                                                     mins: company['settings']['chatSettings']['inactivityTimeouts']['transferIn'],
//                                                     name: session.agent.name
//                                                 })
//                                                 let chatEvent = 'Chat auto transferred to ' + (newAgent.name || newAgent.username || newAgent.nickname) + ' from ' + session.agent.name + ' due to no reply in ' + company['settings']['chatSettings']['inactivityTimeouts']['transferIn'] + 'minutes.';
//                                                 let insertedMessage = await CreateLogMessage({
//                                                     from: session.agent.name,
//                                                     to: (session.username) ? session.agent.name || session.agent.nickname : '',
//                                                     body: chatEvent,
//                                                     type: 'Events',
//                                                     cid: (session.conversationID) ? session.conversationID : '',
//                                                     attachment: false,
//                                                     date: new Date().toISOString(),
//                                                     delivered: true,
//                                                     sent: true
//                                                 })
//                                                 if (insertedMessage) {
//                                                     conversation.value.messages.push(insertedMessage)
//                                                     // SocketServer.of(nsp).to(Agents.NotifyOne(pendingVisitor)).emit('privateMessage', insertedMessage);
//                                                     await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'privateMessage', nsp: company.name, roomName: [Agents.NotifyOne(pendingVisitor)], data: insertedMessage });
//                                                 }
//                                                 //if (insertedMessage) SocketServer.of(nsp).to(Visitor.NotifyOne(session)).emit('privateMessage', insertedMessage)
//                                                 // SocketServer.of(nsp).to(Agents.NotifyAll()).emit('updateUser', { id: session.id || session._id, session: session });
//                                                 await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: company.name, roomName: [Agents.NotifyAll()], data: payload });
//                                                 await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'newConversation', nsp: company.name, roomName: [Agents.NotifyOne(pendingVisitor)], data: conversation.value });
//                                                 await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'V', broadcast: false, eventName: 'transferChat', nsp: company.name, roomName: [Visitor.NotifyOne(pendingVisitor as VisitorSessionSchema)], data: { agent: (pendingVisitor as VisitorSessionSchema).agent, event: chatEvent } });
//                                                 await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'removeConversation', nsp: company.name, roomName: [Agents.NotifyOne(oldSession)], data: { conversation: conversation.value } });
//                                                 let loggedEvent = await __biZZC_SQS.SendEventLog(event, ((pendingVisitor as VisitorSessionSchema)._id) ? (pendingVisitor as VisitorSessionSchema)._id : (pendingVisitor as VisitorSessionSchema).id);
//                                                 //if (loggedEvent) SocketServer.of(nsp).to(Agents.NotifyAll()).emit('visitorEventLog', loggedEvent);
//                                             }
//                                         } else {
//                                             //#region Un-Assign Due To No Agent Old Logic Remove 
//                                             // let pendingVisitor = await SessionManager.UnseAgentFromVisitor(session.id || session._id);
//                                             // if (pendingVisitor) {
//                                             //     let queEvent = ComposedENUM(DynamicEventLogs.VISITOR_ASSIGNED_UNASSIGNED_NO_RESPONSE, {
//                                             //         newEmail: '', oldEmail: '',
//                                             //         mins: company['settings']['chatSettings']['inactivityTimeouts']['transferIn'],
//                                             //         name: session.agent.name
//                                             //     })
//                                             //     promises = await Promise.all([
//                                             //         await __biZZC_SQS.SendEventLog(queEvent, (pendingVisitor._id) ? pendingVisitor._id : pendingVisitor.id),
//                                             //         await Conversations.UpdateConversationState(pendingVisitor.conversationID, 1, false),
//                                             //         await Conversations.AddPenaltyTime(pendingVisitor.conversationID, conversation[0].agentEmail, conversation[0].lastMessage.date)
//                                             //     ]);
//                                             //     let logEvent = promises[0];
//                                             //     //if (logEvent) SocketServer.of(nsp).to(Agents.NotifyAll()).emit('visitorEventLog', logEvent);
//                                             //     let insertedMessage = await CreateLogMessage({
//                                             //         from: session.agent.name,
//                                             //         to: (session.username) ? session.agent.name || session.agent.nickname : '',
//                                             //         body: queEvent,
//                                             //         type: 'Events',
//                                             //         cid: (session.conversationID) ? session.conversationID : '',
//                                             //         attachment: false,
//                                             //         date: new Date().toISOString(),
//                                             //         delivered: true,
//                                             //         sent: true
//                                             //     })
//                                             //     if (insertedMessage) {
//                                             //         // SocketServer.of(nsp).to(Agents.NotifyOne(pendingVisitor)).emit('privateMessage', insertedMessage);
//                                             //         // SocketServer.of(nsp).to(Visitor.NotifyOne(session)).emit('privateMessage', insertedMessage)
//                                             //         await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'privateMessage', nsp: pendingVisitor.nsp, roomName: [Agents.NotifyOne(pendingVisitor)], data: insertedMessage });
//                                             //         await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'V', broadcast: false, eventName: 'privateMessage', nsp: company.name, roomName: [Visitor.NotifyOne(session)], data: insertedMessage });
//                                             //     }
//                                             //     //if (insertedMessage) SocketServer.of(nsp).to(Visitor.NotifyOne(session)).emit('privateMessage', insertedMessage)
//                                             //     // SocketServer.of(nsp).to(Agents.NotifyAll()).emit('updateUser', { id: session.id || session._id, session: session });
//                                             //     //TODO Create Event That Agent You were connectect is no more active.
//                                             //     //Event name AgentInactive
//                                             //     // SocketServer.of(nsp).to(session.id || session._id).emit('noAgent', { state: 2, agent: pendingVisitor.agent });
//                                             //     // SocketServer.of(nsp).to(Agents.NotifyAll()).emit('updateUser', { id: pendingVisitor.id, session: pendingVisitor });
//                                             //     await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'V', broadcast: false, eventName: 'noAgent', nsp: company.name, roomName: [session.id || session._id], data: { state: 2, agent: pendingVisitor.agent } });
//                                             //     await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: company.name, roomName: [Agents.NotifyAll()], data: { id: pendingVisitor.id, session: pendingVisitor } });
//                                             //     await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'removeConversation', nsp: company.name, roomName: [Agents.NotifyOne(oldSession)], data: { conversation: promises[1].value } });
//                                             // }
//                                             //#endregion
//                                         }
//                                     }
//                                 }
//                                 break;
//                             default:
//                                 break;
//                         }
//                         return;
//                     });
//                 });
//                 try {
//                     await Promise.all(nspPromises);
//                 } catch (error) {
//                     console.log('error in TimeInterval Automatic Assignment Function');
//                     console.log(error);
//                 } finally {
//                     // End Of Cycle
//                     // console.log('End Of Cycle');
//                 }
//             }
//         }, 1000);
//     }
//     public static CheckBannedVisitor(): NodeJS.Timer {
//         // console.log('Check For Banned Visitors!');
//         //console.log('Checking Banned Banned Visitors!');
//         return setInterval(async () => {
//             let companies = await Company.GetCompanies()
//             if (companies) {
//                 let nspPromises = companies.map(async company => {
//                     if (this.IgnoreNameSpace(company.name)) return;
//                     let BannedVisitors: any[] = (await Visitor.getAllVisitors(company.name) as Array<any>);
//                     let promises = (BannedVisitors as Array<any>).map(async visitor => {
//                         let innerPromise: any;
//                         let updatedVisitor: any;
//                         if (!visitor.banned || visitor.banSpan < 0) return
//                         let logEvent: any = undefined;
//                         let event: string = '';
//                         let currentDate = Date.parse(new Date().toISOString());
//                         let expired = new Date(visitor.bannedOn);
//                         //for minutes(testing)
//                         let expiryDate = expired.setMinutes(expired.getMinutes() + visitor.banSpan);
//                         //for days
//                         // let expiryDate = expired.setDate(expired.getDate() + visitor.banSpan);
//                         if (expiryDate < currentDate) {
//                             //innerPromise = await Promise.all([
//                             updatedVisitor = await Visitor.UnbanVisitor(visitor.deviceID, visitor.nsp);
//                             // SocketServer.of(visitor.nsp).to(Agents.NotifyAll()).emit('removeBannedVisitor', updatedVisitor.value);
//                             await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'removeBannedVisitor', nsp: company.name, roomName: [Agents.NotifyAll()], data: updatedVisitor.value });
//                             //]);
//                         }
//                         return;
//                     });
//                     try {
//                         await Promise.all(promises);
//                     }
//                     catch (error) {
//                         console.log('error in TimeInterval Banning Visitor Function');
//                         console.log(error);
//                     }
//                 });
//                 try {
//                     await Promise.all(nspPromises);
//                 } catch (error) {
//                     console.log('error in TimeInterval Banning Visitor Function');
//                     console.log(error);
//                 } finally {
//                 }
//             }
//             //}, 86400000); // for days
//             //}, 60000); // for minutes
//         }, 3600000); // for hours
//     }
//     public static async RuleSetScheduler(interval) {
//         try {
//             console.log('Ruleset Scheduler!');
//             let companies = await Company.getCompaniesWithScheduler();
//             companies.forEach(async company => {
//                 // console.log('Comapny: '+ company.name);
//                 // let SocketServer = SocketListener.getSocketServer().of(company.name);
//                 let scheduler = company.settings.ruleSetScheduler;
//                 let curr_datetime = new Date();
//                 let tocheck_datetime = new Date(scheduler.scheduled_at);
//                 // console.log('Current: ' + curr_datetime.toISOString());
//                 // console.log('Scheduled: ' + tocheck_datetime.toISOString());
//                 if (curr_datetime >= tocheck_datetime) {
//                     // console.log('Ruleset Execution!');
//                     let ticketIDs = await Tickets.getUnassignedTickets(company.name);
//                     // console.log('Total Tickets: ' + ticketIDs?.length);
//                     //Perform Execution of ruleset
//                     if (ticketIDs && ticketIDs.length) {
//                         ticketIDs.forEach(async ticketID => {
//                             let ticket = await Tickets.getTicketssByIDsAndProcess(ticketID._id);
//                             if (ticket && ticket.ok) {
//                                 // console.log(ticket.value.processing);
//                                 ticket.value = await RuleSetDescriptor(ticket.value);
//                                 if (ticket.value.assigned_to) {
//                                     // await Tickets.UpdateTicketObj(ticket.value);
//                                     // SocketServer.to(ticket.value.assigned_to).emit('newTicket', { ticket: ticket.value });
//                                     await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'newTicket', nsp: company.name, roomName: [ticket.value.assigned_to], data: { ticket: ticket.value } });
//                                 }
//                                 delete ticket.value.processing;
//                                 await Tickets.UpdateTicketObj(ticket.value);
//                             }
//                         });
//                     }
//                     //
//                     console.log('Execution Completed!');
//                     switch (scheduler.type) {
//                         case 'everyday':
//                             await Company.updateScheduler(company.name, this.AddDays(tocheck_datetime, 1));
//                             break;
//                         case 'after':
//                             await Company.updateScheduler(company.name, this.AddDays(tocheck_datetime, scheduler.days));
//                             break;
//                     }
//                 }
//                 // 		break;
//                 // 	case 'after':
//                 // 		break;
//                 // }
//             })
//         } catch (err) {
//             console.log('Error in RulesetScheduler');
//             console.log(err);
//         } finally {
//             setTimeout(async () => {
//                 await this.RuleSetScheduler(60000);
//             }, interval);
//         }
//     }
//     public static AddDays(date, days) {
//         var result = new Date(date);
//         result.setDate(result.getDate() + days);
//         return result;
//     }
//     // public static SnoozingWork(): NodeJS.Timer {
//     // 	return setTimeout(async () => {
//     // 		let SocketServer: SocketIO.Server = SocketListener.getSocketServer();
//     // 		let nspPromises = Object.keys(SocketServer.nsps).map(async nsp => {
//     // 			if (!(SocketServer.of(nsp)['settings'])) return;
//     // 			else if (!SocketServer.of(nsp)['settings']['chatSettings']['assignments'].aEng) return;
//     // 			else {
//     // 			}
//     // 		})
//     // 	},60000);
//     // }
// }
//# sourceMappingURL=TimeoutManagement.js.map