import { EmailService } from "../../services/emailService";
import { TicketGroupsModel } from "../../models/TicketgroupModel";
import { SessionManager } from "../../globals/server/sessionsManager";
import { Tickets } from "../../models/ticketsModel";
import SocketIO = require("socket.io");
import { rand, ticketEmail } from "../../globals/config/constants";
import { Conversations } from "../../models/conversationModel";
import { TicketSchema } from "../../schemas/ticketSchema";
import { RuleSetDescriptor } from "./RuleSetExecutor";
import { ObjectID } from "mongodb";
import { Utils } from "../agentActions/Utils";
import { TicketMessageSchema } from "../../schemas/ticketMessageSchema";
import { CustomDispatcherForPanel } from "./TicketDispatcher";
import { Company } from "../../models/companyModel";
import { __BIZZ_REST_REDIS_PUB } from "../../globals/__biZZCMiddleWare";

export async function ChatToTicket(conversation, timeZone) {

    try {
        let data = {
            cid: conversation._id,
            thread: {
                subject: 'Unassigned Chat',
                state: 'OPEN',
                priority: 'HIGH',
                visitor: {
                    name: conversation.visitorName,
                    email: conversation.visitorEmail,
                },
                viewColor: conversation.viewColor,
                clientID: conversation.clientID || conversation._id
            }
        }
        // console.log('convo');
        // console.log(conversation);
        // console.log('data');
        // console.log(data);


        let primaryTicket: any = undefined;
        let primaryEmail = await Tickets.GetPrimaryEmail(conversation.nsp);
        let randomColor = rand[Math.floor(Math.random() * rand.length)];
        let convos = await Conversations.getMessagesByCid(conversation._id);
        if (!convos || !convos.length) { ({ status: 'error', msg: 'Unable To Create Ticket - No Meesage Found' }); return; }
        if (primaryEmail.length) {
            let ticket: TicketSchema;
            ticket = {
                type: 'email',
                subject: data.thread.subject,
                nsp: conversation.nsp,
                priority: data.thread.priority,
                state: data.thread.state,
                datetime: new Date().toISOString(),
                from: data.thread.visitor.email,
                visitor: {
                    name: data.thread.visitor.name,
                    email: data.thread.visitor.email
                },
                lasttouchedTime: new Date().toISOString(),
                viewState: 'UNREAD',
                createdBy: 'System',
                agentName: (conversation.agentEmail) ? conversation.agentEmail : '',
                ticketlog: [],
                mergedTicketIds: [],
                viewColor: randomColor,
                group: "",
                assigned_to: '',
                source: 'livechat',
                slaPolicy: {
                    reminderResolution: false,
                    reminderResponse: false,
                    violationResponse: false,
                    violationResolution: false
                },
                assignmentList: []
            }


            ticket = await RuleSetDescriptor(ticket);

            let insertedTicket = await Tickets.CreateTicket(JSON.parse(JSON.stringify(ticket)));


            let ticketId: ObjectID | undefined;
            if (insertedTicket && insertedTicket.insertedCount) {
                ticketId = insertedTicket.insertedId as ObjectID
            }


            if (ticketId) {
                let arr: any = [];
                arr.push(ticketId);
                let insertedMessages: any;
                if (convos && convos.length) {

                    let msgBody = Utils.GenerateTicketTemplate(convos, data.thread.visitor.name, data.thread.visitor.email, data.thread.clientID, data.thread.viewColor,timeZone)
                    // let updatedList = convos.map((msg, index) => {

                    let message: TicketMessageSchema = {
                        datetime: new Date().toISOString(),
                        nsp: conversation.nsp,
                        senderType: 'Visitor',
                        message: msgBody,
                        from: data.thread.visitor.email,
                        to: ticketEmail,
                        replytoAddress: data.thread.visitor.email,
                        tid: [new ObjectID(ticketId)],
                        attachment: [],
                        form: '',
                        viewColor: (insertedTicket && insertedTicket.insertedCount) ? insertedTicket.ops[0].viewColor : '',
                    };


                    insertedMessages = await Tickets.InsertMessage(JSON.parse(JSON.stringify(message)));

                    if (insertedMessages && insertedMessages.result.ok && insertedMessages.insertedCount &&
                        insertedTicket && insertedTicket.insertedCount) {
                        /**
                         * id ,
                         * subject ,
                         * createdby ,
                         * createdDate ,
                         * clientID
                         */
                        if (insertedTicket.ops[0].nsp == '/sbtjapan.com' || insertedTicket.ops[0].nsp == '/sbtjapaninquiries.com') {
                            console.log('Custom Dispatcher fired!');

                            let result = await CustomDispatcherForPanel(insertedTicket.ops[0]);
                            (insertedTicket as any).ops[0] = result.secondaryTicket;
                            // console.log(insertedTicket.ops[0]);

                            if(insertedTicket.ops[0].assigned_to){
                              insertedTicket.ops[0].assignmentList = [
                                {
                                  assigned_to : insertedTicket.ops[0].assigned_to,
                                  assigned_time: insertedTicket.ops[0].first_assigned_time,
                                  read_date: ''
                                }
                              ]
                            }

                            await Tickets.UpdateTicketObj(insertedTicket.ops[0]);

                            if (result.primaryTicket) primaryTicket = result.primaryTicket;

                        }
                        let details = await Conversations.InsertTicketDetails(data.cid, {
                            id: insertedTicket.ops[0]._id,
                            subject: insertedTicket.ops[0].subject,
                            clientID: insertedTicket.ops[0].clientID,
                            createdDate: insertedTicket.ops[0].datetime,
                            createdby: 'System'
                        })


                        // if(insertedTicket.ops[0].nsp == '/sbtjapan.com'){
                        //     (insertedTicket as any).ops[0] = await CustomDispatcher(insertedTicket.ops[0], insertedMessage[0].ops[0].message);
                        //     await Tickets.UpdateTicketObj(insertedTicket.ops[0]);
                        // }

                        let origin = await Company.getSettings(conversation.nsp);

                        // origin.to('ticketAdmin').emit('newTicket', { ticket: insertedTicket.ops[0] });
                        // origin.to(ticket.group).emit('newTicket', { ticket: insertedTicket.ops[0] });

                        await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'newTicket', nsp: conversation.nsp, roomName: ['ticketAdmin'], data: { ticket: insertedTicket.ops[0] } });
                        await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'newTicket', nsp: conversation.nsp, roomName: [ticket.group], data: { ticket: insertedTicket.ops[0] } });


                        if (primaryTicket) {
                            // origin.to('ticketAdmin').emit('updateTicket', { tid: primaryTicket._id, ticket: primaryTicket });
                            // origin.to(primaryTicket.group).emit('updateTicket', { tid: primaryTicket._id, ticket: primaryTicket });

                            await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateTicket', nsp: conversation.nsp, roomName: ['ticketAdmin'], data: { tid: primaryTicket._id, ticket: primaryTicket } });
                            await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateTicket', nsp: conversation.nsp, roomName: [primaryTicket.group], data: { tid: primaryTicket._id, ticket: primaryTicket } });
                        }

                        if (insertedTicket.ops[0].assigned_to) {
                            let onlineAgent = await SessionManager.getAgentByEmail(conversation.nsp, insertedTicket.ops[0].assigned_to);

                            if (onlineAgent && !onlineAgent.groups.includes(ticket.group)) {

                                // origin.to(onlineAgent._id).emit('newTicket', { ticket: insertedTicket.ops[0] });
                                await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'newTicket', nsp: conversation.nsp, roomName: [onlineAgent._id], data: { ticket: insertedTicket.ops[0] } });

                            }

                            if (origin[0]['settings']['emailNotifications']['tickets'].assignToAgent) {

                                //Old Chat Conversion
                                // let response = await EmailService.SendTicketConversionEmail({
                                //     ticket: insertedTicket.ops[0],
                                //     messages: messages,
                                //     subject: data.thread.subject,
                                //     nsp: socket.handshake.session.nsp.substring(1),
                                //     to: insertedTicket.ops[0].assigned_to

                                // });
                                // if (response) {


                                // }

                                let msg = '<span><b>ID: </b>' + ticketId + '<br>'
                                    + '<span><b>Assigned by: </b> Automatic Assignment <br>'
                                    + '<span><b>Link: </b> https://app.beelinks.solutions/tickets/ticket-view/' + ticketId + '<br>';
                                let obj = {
                                    action: 'sendNoReplyEmail',
                                    to: insertedTicket.ops[0].assigned_to,
                                    subject: 'You have been assigned a new ticket #' + ticketId,
                                    message: msg,
                                    html: msg,
                                    type: 'agentAssigned'
                                }

                                let response = EmailService.SendNoReplyEmail(obj, false);
                            }

                        }
                        if (insertedTicket.ops[0].group) {
                            if (origin['settings'].emailNotifications && origin['settings']['emailNotifications']['tickets'].assignToGroup) {
                                let groupAdmins = await TicketGroupsModel.GetGroupAdmins(conversation.nsp, ticket.group);
                                if (groupAdmins) {
                                    groupAdmins.forEach(async admin => {
                                        let msg = '<span><b>ID: </b>' + ticketId + '<br>'
                                            + '<span><b>Group: </b> ' + ticket.group + '<br>'
                                            + '<span><b>Assigned by: </b> Automatic Assignment <br>'
                                            + '<span><b>Link: </b> https://app.beelinks.solutions/tickets/ticket-view/' + ticketId + '<br>';
                                        let obj = {
                                            action: 'sendNoReplyEmail',
                                            to: admin,
                                            subject: 'Group assigned to Ticket #' + ticketId,
                                            message: msg,
                                            html: msg,
                                            type: 'newTicket'
                                        }

                                        let response = EmailService.SendNoReplyEmail(obj, false);


                                    });

                                }
                            }
                        }
                        return ({
                            status: 'ok',
                            cid: data.cid,
                            ticket: {
                                id: insertedTicket.ops[0]._id,
                                subject: insertedTicket.ops[0].subject,
                                clientID: insertedTicket.ops[0].clientID,
                                createdDate: insertedTicket.ops[0].datetime,
                                createdby: 'System'
                            }
                        });
                    } else return ({ status: 'error', msg: 'Unable to Insert Message' });
                    return;
                }
            }
            else {
                return ({ status: 'error', msg: 'Unable To Create Ticket' });
            }
        }
        else return ({ status: 'error', msg: 'Unable To Create Ticket' });
    } catch (error) {
        console.log(error);
        console.log('error in Creating New Ticket');
        return ({ status: 'error', msg: error })
    }
}
