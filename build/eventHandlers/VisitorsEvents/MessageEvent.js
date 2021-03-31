"use strict";
// //Created By Saad Ismail Shaikh 
// // 03-09-2018
// //Native Modules
// import { ObjectID } from "mongodb"
// //Models
// import { Tickets } from "../../models/ticketsModel"
// const formRegex = '^(##)'
// //Schemas For Typesafety
// import { TicketSchema } from "../../schemas/ticketSchema"
// import { TicketMessageSchema } from "../../schemas/ticketMessageSchema";
// import { rand } from "../../globals/config/constants";
// import { ChatBotService } from "../../services/ChatBotService";
// import { FormDesignerModel } from "../../models/FormDesignerModel"
// export class MessageEvents {
//     public static BindBotEvents(socket, origin: SocketIO.Namespace) {
//         MessageEvents.BotMessages(socket, origin);
//     }
//     private static BotMessages(socket, origin: SocketIO.Namespace) {
//         socket.on('botMessage', async (data, callback) => {
//             //console.log("botMessage");
//             //console.log(data);
//             try {
//                 if (data && data.msg) {
//                     //data.email = ''
//                     //data.nsp = ''
//                     if (!data.email) data.email = socket.handshake.session.email;
//                     let reply = await ChatBotService.SendChatBotMessage(data)
//                     if (reply && reply.text) {
//                         let form;
//                         if (new RegExp(formRegex).test(reply.text)) {
//                             form = await FormDesignerModel.GetFormsByName((reply.text as string).toLowerCase().slice(2))
//                             if (form && form.length) socket.emit('cannedformReceived', { _id: (data.csid) ? data.csid : '', form: form })
//                             else callback({ reply: '' })
//                         }
//                         else callback({ reply: reply })
//                     }
//                     else callback({ error: "Sorry, I'm not sure what you meant!" })
//                 }
//             } catch (error) {
//                 callback({ error: '"We are shortly unavailable. Please try again later!"' })
//             }
//         });
//     }
//     public static async StateResolver(session: any, message: string) {
//         if (!session.stateAnswer || !session.stateAnswer.length || !session.stateMachine) return undefined;
//         switch (session.stateMachine) {
//             case 1:
//                 if (message.toLowerCase().match(/^expletter/)) {
//                     return {
//                         status: 'ok',
//                         msg: {
//                             from: 'Assistant',
//                             to: session.username,
//                             date: new Date().toISOString(),
//                             body:
//                                 `<h3 class="border0 text-white margin0">Please Explain The Purpose Of Your Letter</h3>` +
//                                 `<div class="full-width sel">
//                          <select id="bot-select1" class="capsule">
//                          <option value='travel'>Overseas or Visa Verification</option>
//                          <option value='education'>Required For Educational Institution</option>
//                          <option value='validation'>Validation Purpose</option>
//                          </select>
//                          </div>
//                          <div class="full-width"><input id="submitBotForm1" type="submit" class="capsule" action='-1' value="Submit"></div>`
//                         }
//                     }
//                 } else if (message.toLowerCase().match(/^salslip/)) {
//                     return {
//                         status: 'ok',
//                         pushState: 1,
//                         msg: {
//                             from: 'Assistant',
//                             to: session.username,
//                             date: new Date().toISOString(),
//                             body:
//                                 `<h3 class="border0 text-white margin0">Please Explain The Purpose Of Your Letter</h3>` +
//                                 `<div class="full-width sel">
//                          <select id="bot-select1" class="capsule">
//                          <option value='travel'>Overseas or Visa Verification</option>
//                          <option value='education'>Required For Educational Institution</option>
//                          <option value='validation'>Validation Purpose</option>
//                          </select>
//                          </div>
//                          <div class="full-width"><input id="submitBotForm1" type="submit" class="capsule" action='-1' value="Submit"></div>`
//                         }
//                     }
//                 } else if (message.toLowerCase().match(/^attndleaves/)) {
//                     return {
//                         status: 'ok',
//                         msg: {
//                             from: 'Assistant',
//                             to: session.username,
//                             date: new Date().toISOString(),
//                             body:
//                                 `<h3 class="border0 text-white margin0">Please Explain The Purpose Of Your Letter</h3>` +
//                                 `<div class="full-width sel">
//                          <select id="bot-select" class="capsule">
//                          <option value='travel'>Overseas or Visa Verification</option>
//                          <option value='education'>Required For Educational Institution</option>
//                          <option value='validation'>Validation Purpose</option>
//                          </select>
//                          </div>
//                          <div class="full-width"><input id="submitBotForm" type="submit" class="capsule" action='-1' value="Submit"></div>`
//                         }
//                     }
//                 } else {
//                     return undefined;
//                 }
//             case 2:
//                 if (message.toLowerCase().match(/^travel/)) {
//                     return {
//                         status: 'ok',
//                         msg: {
//                             from: 'Assistant',
//                             to: session.username,
//                             date: new Date().toISOString(),
//                             body:
//                                 `<h3 class="border0 text-white margin0">Please Explain The Purpose Of Your Letter</h3>` +
//                                 `<div class="full-width">
//                  <input type="text" id="bot-select2" class="capsule">
//                  </select>
//                  </div>
//                  <div class="full-width"><input id="submitBotForm2" type="submit" class="capsule" action='-1' value="Submit"></div>`
//                         }
//                     }
//                 }
//                 break;
//             case 3:
//                 //Submit Ticket Now
//                 try {
//                     let content = '';
//                     session.stateAnswer.map((item, index) => {
//                         content += (index + 1) + ' ' + item.answer + '<br>';
//                     });
//                     let randomColor = rand[Math.floor(Math.random() * rand.length)];
//                     let primaryEmail = await Tickets.GetPrimaryEmail(session.nsp);
//                     if (primaryEmail.length) {
//                         let ticket: TicketSchema = {
//                             type: "email",
//                             subject: 'Inquiry From Bot',
//                             nsp: session.nsp,
//                             state: 'OPEN',
//                             datetime: new Date().toISOString(),
//                             visitor: {
//                                 name: session.name,
//                                 email: 'bizzchat.com@gmail.com',
//                                 phone: '',
//                                 location: session.location,
//                                 ip: session.ip,
//                                 fullCountryName: session.fullCountryName.toString(),
//                                 url: session.url,
//                                 country: session.country
//                             },
//                             lasttouchedTime: new Date().toISOString(),
//                             from: primaryEmail[0].domainEmail,
//                             viewState: 'UNREAD',
//                             ticketlog: [],
//                             mergedTicketIds: [],
//                             viewColor: randomColor,
//                             group: "",
//                             slaPolicy:{
//                                 reminderResolution:false,
//                                 reminderResponse:false,
//                                 violationResponse:false,
//                                 violationResolution:false
//                             }
//                             // slaPolicyEnabled: true
//                         };
//                         let insertedTicket = await Tickets.CreateTicket(JSON.parse(JSON.stringify(ticket)));
//                         let ticketId: ObjectID | undefined;
//                         (insertedTicket) ?
//                             (insertedTicket.insertedCount) ? ticketId = insertedTicket.insertedId as ObjectID
//                                 : { status: 'error' } : undefined;
//                         if (ticketId) {
//                             let tmessage: TicketMessageSchema = {
//                                 datetime: new Date().toISOString(),
//                                 nsp: session.nsp,
//                                 senderType: 'Visitor',
//                                 message: content,
//                                 replytoAddress: "bizzchat.com@gmail.com",
//                                 from: 'bizzchat.com@gmail.com',
//                                 to: session.nsp,
//                                 tid: [ticketId],
//                                 attachment: [],
//                                 viewColor: (insertedTicket && insertedTicket.insertedCount) ? insertedTicket.ops[0].viewColor : ''
//                             };
//                             let insertedMessage = await Tickets.InsertMessage(JSON.parse(JSON.stringify(tmessage)));
//                             if (insertedMessage && insertedMessage.insertedCount &&
//                                 insertedTicket && insertedTicket.insertedCount) {
//                                 //origin.to('Admins').emit('newTicket', { ticket: insertedTicket.ops[0] });
//                                 return insertedTicket.ops[0];
//                                 //callback({ status: 'ok' });
//                             } else {
//                                 return { status: 'error' };
//                             }
//                         } else {
//                             return { status: 'error' };
//                         }
//                     } else return { status: 'error' };
//                 } catch (error) {
//                     console.log(error);
//                     console.log('error in Submitting Ticket');
//                     return { status: 'error' };
//                 }
//         }
//     }
// }
//# sourceMappingURL=MessageEvent.js.map