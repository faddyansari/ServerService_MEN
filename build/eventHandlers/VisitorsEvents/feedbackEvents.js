"use strict";
// //Created By Saad Ismail Shaikh 
// // 01-08-2018
// import { SessionManager } from "../../globals/server/sessionsManager";
// import { Conversations } from "../../models/conversationModel";
// import { Agents } from "../../models/agentModel";
// import { Visitor } from "../../models/visitorModel";
// import { SocketListener } from "../../globals/server/socketlistener";
// import { visitorSessions } from "../../models/visitorSessionmodel";
// import { CreateLogMessage } from "../../actions/GlobalActions/CreateMessage";
// import { AutoAssignFromQueueAuto } from "../../actions/ChatActions/AssignChat";
// import { __biZZC_SQS } from "../../actions/aws/aws-sqs";
// import { ARCHIVINGQUEUE } from "../../globals/config/constants";
// import { EventLogMessages } from "../../globals/config/enums";
// export class FeedbackEvents {
//     public static BindFeedbackEvents(socket, origin: SocketIO.Namespace) {
//         FeedbackEvents.SubmitSurvey(socket, origin);
//     }
//     private static SubmitSurvey(socket, origin) {
//         /**
//          * @Cases 
//          * 1. When Visitor Ends Chat it works normally
//          * 2. When Agent End Chat and Visitor Submits Feedback lately (Updated Case)
//          * 3. When Agent Ended Chat and Visitor Submit Feedback Lately but it's not there in archved Sessions then do Nothing
//          * 4. Add Case To submit feedback to recent chats (Incomplete).
//          */
//         socket.on('submitsurvey', async (data, callback) => {
//             try {
//                 console.log('submitsurvey');
//                 //console.log(data);
//                 /**
//                  * @Case_1
//                  */
//                 let session = (await SessionManager.getVisitor(socket.handshake.session));
//                 if (session) {
//                     if (origin['settings']['chatSettings']['assignments'].aEng && session.agent && session.agent.id) {
//                         let result = await AutoAssignFromQueueAuto(session);
//                     }
//                     await SessionManager.RemoveSession(session, true);
//                     origin.to(Agents.NotifyAll()).emit('removeUser', session.id);
//                     socket.to(Visitor.NotifyOne(session)).emit('endChat');
//                     origin.to(Visitor.NotifyOne(session)).emit('allPopUpWindowsClose', {});
//                     origin.to(Visitor.NotifyOne(session)).emit('allHelpSupportWindowsClose', {});
//                     let updatedConversation = await Conversations.EndChat(session.conversationID, true, data.survey);
//                     let packet: SQSPacket = {
//                         action: 'endConversation',
//                         cid: session.conversationID
//                     }
//                     await __biZZC_SQS.SendMessage(packet, ARCHIVINGQUEUE);
//                     if (updatedConversation && updatedConversation.value) origin.to(Agents.NotifyOne(session)).emit('stopConversation', { conversation: updatedConversation.value });
//                     if (data.feedbackForm) {
//                         let endChatMsg = JSON.parse(JSON.stringify(data.feedbackForm))
//                         // if (data.forceEnded) endChatMsg.body = 'Chat ended by agent ' + data.feedbackForm.to.name
//                         // else endChatMsg.body = 'Chat ended by ' + data.feedbackForm.from
//                         if (!data.forceEnded) endChatMsg.body = 'Chat ended by ' + data.feedbackForm.from
//                         endChatMsg.type = 'Events'
//                         let endChatMessage = await CreateLogMessage(endChatMsg)
//                         if (endChatMessage) {
//                             origin.to(Agents.NotifyOne(session)).emit('privateMessage', endChatMessage);
//                             setTimeout(async () => {
//                                 let insertedMessage = await CreateLogMessage(data.feedbackForm)
//                                 if (insertedMessage) {
//                                     origin.to(Agents.NotifyOne(session)).emit('privateMessage', insertedMessage);
//                                 }
//                             }, 0);
//                         }
//                     }
//                     if (updatedConversation && updatedConversation.value) {
//                         let loggedEvent = await __biZZC_SQS.SendEventLog(EventLogMessages.ENDCHAT, (session._id) ? session._id : session.id);
//                         //if (loggedEvent) origin.to(Agents.NotifyOne(session)).emit('visitorEventLog', loggedEvent);
//                     }
//                     if (session.agent && session.agent.id) await SessionManager.GetAgentByID(session.agent.id);
//                     if (updatedConversation && updatedConversation.value) callback({ status: 'ok' });
//                     else callback({ status: 'ok' });
//                     SocketListener.DisconnectSession(session.nsp, (session._id || session.id) as string);
//                 } else {
//                     /**
//                      * @Case_2_3_4
//                      */
//                     let session = await visitorSessions.getVisitorSession(socket.handshake.session._id || socket.handshake.session.id);
//                     if (session && session.length) {
//                         if (!data || !data.survey) {
//                             callback({ status: 'ok' });
//                             SocketListener.DisconnectSession(session[0].nsp, (session[0]._id || session[0].id) as string);
//                         }
//                         else {
//                             if (data.feedbackForm) {
//                                 // let endChatMsg = JSON.parse(JSON.stringify(data.feedbackForm))
//                                 // // if (data.forceEnded) endChatMsg.body = 'Chat ended by agent ' + data.feedbackForm.to.name
//                                 // // else endChatMsg.body = 'Chat ended by ' + data.feedbackForm.from
//                                 // if (!data.forceEnded) endChatMsg.body = 'Chat ended by ' + data.feedbackForm.from
//                                 // // if (data.forceEnded) endChatMsg.body = 'Chat ended by agent' + data.feedbackForm.to.name
//                                 // // else endChatMsg.body = 'Chat ended by ' + data.feedbackForm.from
//                                 // endChatMsg.type = 'Events'
//                                 // let endChatMessage = await CreateLogMessage(endChatMsg)
//                                 let insertedMessage;
//                                 insertedMessage = await CreateLogMessage(data.feedbackForm)
//                             }
//                             callback({ status: 'ok' });
//                             SocketListener.DisconnectSession(session[0].nsp, (session[0]._id || session[0].id) as string);
//                             let updatedConversation = await Conversations.SubmitSurvey(session[0].conversationID, data.survey);
//                             // if (data.feedbackForm) {
//                             //     let insertedMessage = await CreateLogMessage(data.feedbackForm)
//                             //     if (insertedMessage) {
//                             //         origin.to(Agents.NotifyOne(session)).emit('privateMessage', insertedMessage);
//                             //     }
//                             // }
//                             if (updatedConversation && updatedConversation.value) {
//                                 let loggedEvent = await __biZZC_SQS.SendEventLog(EventLogMessages.ENDCHAT, (session[0]._id) ? session[0]._id : session[0].id);
//                             }
//                             //Send updates via notification
//                         }
//                     } else callback({ status: 'ok' });
//                 }
//             } catch (error) {
//                 console.log(error);
//                 console.log('Error in submit survey');
//                 callback({ error: error });
//             }
//         });
//     }
// }
//# sourceMappingURL=feedbackEvents.js.map