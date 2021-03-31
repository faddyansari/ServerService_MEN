"use strict";
// import { CannedForm } from './../../schemas/FormDesignerSchema';
// import { EmailRecipientsSchema } from './../../schemas/emailRecepientsSchema';
// //Created By Saad Ismail Shaikh 
// // 01-08-2018
// //Native Modules
// import { ObjectID, Logger, ObjectId } from "mongodb"
// //SocketServer Object if Ticket is Recieved From Email
// //Models
// import { Tickets } from "../../models/ticketsModel"
// import { TicketMessageSchema } from "../../schemas/ticketMessageSchema";
// import { TicketSchema } from "../../schemas/ticketSchema";
// import { rand, ticketEmail } from "../../globals/config/constants";
// import { TicketLogSchema } from "../../schemas/ticketLogSchema";
// import { EmailService } from "../../services/emailService";
// import { TokenSchema } from "../../schemas/tokenSchema";
// import { Tokens } from "../../models/tokensModel";
// import { SessionManager } from "../../globals/server/sessionsManager";
// import { RuleSetDescriptor } from "../../actions/TicketAbstractions/RuleSetExecutor";
// import { TicketGroupsModel } from "../../models/TicketgroupModel";
// import { __BizzC_S3 } from "../../actions/aws/aws-s3";
// import { S3, SQS, AWSError } from "aws-sdk";
// import { TeamsModel } from "../../models/teamsModel";
// import { EmailActivations } from "../../models/emailActivations";
// import { FeedBackSurveyModel } from "../../models/FeedBackSurveyModel";
// import { SLAPolicyExecutor } from "../../actions/TicketAbstractions/SLAPolicyExecutor";
// import { SLAPolicyModel } from "../../models/SLAPolicyModel";
// import { Conversations } from "../../models/conversationModel";
// import { Utils } from "../../actions/agentActions/Utils";
// import { Company } from "../../models/companyModel";
// import { performance } from "perf_hooks";
// export class TicketEvents {
//     public static BindTicketEvents(socket, origin: SocketIO.Namespace) {
//         // console.log("bind events");
//         TicketEvents.GetTickets(socket, origin);
//         TicketEvents.GetTicketCount(socket, origin);
//         TicketEvents.TicketMessages(socket, origin);
//         TicketEvents.ReplyTicket(socket, origin);
//         TicketEvents.GetMoreTickets(socket);
//         TicketEvents.ChangeTicketState(socket, origin);
//         TicketEvents.getContactsForCompaign(socket, origin);
//         TicketEvents.UpdateViewState(socket, origin);
//         TicketEvents.CreateNewTicket(socket, origin);
//         TicketEvents.addTags(socket, origin);
//         TicketEvents.deleteTagTicket(socket, origin);
//         TicketEvents.addTask(socket, origin);
//         TicketEvents.GetTicketsByGroup(socket, origin);
//         TicketEvents.deleteTask(socket, origin);
//         TicketEvents.getTask(socket, origin);
//         TicketEvents.updateTask(socket, origin);
//         TicketEvents.checkedTask(socket, origin);
//         TicketEvents.AssignAgentForTicket(socket, origin);
//         TicketEvents.EditTicketNote(socket, origin);
//         TicketEvents.MergeTicket(socket, origin);
//         TicketEvents.DeMergeTicket(socket, origin);
//         TicketEvents.GetTags(socket, origin);
//         TicketEvents.GetMergedMessages(socket, origin);
//         TicketEvents.AddSignature(socket, origin);
//         TicketEvents.UpdateSignature(socket, origin);
//         TicketEvents.GetSign(socket, origin);
//         TicketEvents.ToggleSign(socket, origin);
//         TicketEvents.DeleteSign(socket, origin);
//         TicketEvents.GetGroupedDetails(socket, origin);
//         TicketEvents.UpdateTicketPriority(socket, origin);
//         // TicketEvents.UpdateTicketAgent(socket, origin);
//         TicketEvents.UpdateTicketGroup(socket, origin);
//         TicketEvents.TestTicketReply(socket, origin);
//         TicketEvents.GetTicketById(socket, origin);
//         TicketEvents.getcount(socket, origin);
//         TicketEvents.autoforward(socket, origin);
//         TicketEvents.getIncomingEmailsByNSP(socket, origin);
//         TicketEvents.getIncomingEmails(socket, origin);
//         TicketEvents.exportdays(socket, origin);
//         TicketEvents.Snooze(socket, origin);
//         TicketEvents.sendActivation(socket, origin);
//         TicketEvents.deleteIncomingId(socket, origin);
//         TicketEvents.deleteNote(socket, origin);
//         TicketEvents.updateIncomingId(socket, origin);
//         TicketEvents.SetPrimaryEmail(socket, origin);
//         TicketEvents.ChatToTicket(socket, origin);
//         TicketEvents.ForwardMessageAsTicket(socket, origin);
//         TicketEvents.GetAgentsAgainstGroup(socket, origin);
//         TicketEvents.getAgentAgainstWatchers(socket, origin);
//         TicketEvents.GetAgentsAgainstGroupObj(socket, origin);
//         TicketEvents.GetAllAgentsAgainstAdmin(socket, origin);
//         // TicketEvents.CannedFormInTicket(socket, origin);
//         TicketEvents.UpdateDynamicProperty(socket, origin);
//         TicketEvents.ToggleExternalRuleset(socket, origin);
//         TicketEvents.SendIdentityVerificationEmail(socket, origin);
//         TicketEvents.ToggleUseOriginalEmail(socket, origin);
//         TicketEvents.getSurveyResult(socket, origin);
//         TicketEvents.addWatchers(socket, origin);
//         TicketEvents.deleteWatcher(socket, origin);
//         TicketEvents.ExecuteScenario(socket, origin);
//     }
//     private static ExecuteScenario(socket, origin: SocketIO.Namespace) {
//         socket.on('executeScenario', async (data, callback) => {
//             try {
//                 let $update = {};
//                 let $setObj = {};
//                 let actions = Array();
//                 let newAgent: any;
//                 //reference of previous tickets...
//                 let previousState = data.tickets;
//                 data.scenario.actions.map(act => {
//                     actions.push({ name: act.scenarioName.toUpperCase(), value: act.scenarioValue })
//                 });
//                 let $pushObj = {
//                     ticketlog: {
//                         title: "Scenario Executed " + data.scenario.scenarioTitle + " consists of ",
//                         status: actions,
//                         updated_by: socket.handshake.session.email,
//                         user_type: 'Agent',
//                         time_stamp: new Date().toISOString()
//                     }
//                 };
//                 let $renameObj = {};
//                 data.scenario.actions.map(async (action, index) => {
//                     switch (action.scenarioName) {
//                         case 'agentAssign':
//                             if ($setObj && $setObj['state'] == 'CLOSED') {
//                                 $pushObj['ticketlog'].status.map(st => {
//                                     if (st.name == 'AGENTASSIGN') {
//                                         st.task = 'Failed to perform operation : Agent assignment';
//                                         st.reason = 'State is closed, Cannot assign agent to closed ticket';
//                                     }
//                                 })
//                             }
//                             else if (!socket.handshake.session.permissions.tickets.canAssignAgent) {
//                                 $pushObj['ticketlog'].status.map(st => {
//                                     if (st.name == 'AGENTASSIGN') {
//                                         st.task = 'Failed to perform operation : Agent assignment';
//                                         st.reason = 'Not have permission to assign agent';
//                                     }
//                                 })
//                             }
//                             else {
//                                 $setObj['assigned_to'] = action.scenarioValue;
//                                 Object.assign($renameObj, { 'assigned_to': "previousAgent" });
//                                 newAgent = await SessionManager.getAgentByEmail(socket.handshake.session.nsp, action.scenarioValue);
//                             }
//                             break;
//                         case 'groupAssign':
//                             if (!socket.handshake.session.permissions.tickets.canAssignGroup) {
//                                 $pushObj['ticketlog'].status.map(st => {
//                                     if (st.name == 'GROUPASSIGN') {
//                                         st.task = 'Failed to perform operation : Group assignment';
//                                         st.reason = 'Not have permission to assign group';
//                                     }
//                                 })
//                             }
//                             else {
//                                 $setObj['group'] = action.scenarioValue;
//                                 Object.assign($renameObj, { 'group': "previousGroup" });
//                             }
//                             break;
//                         case 'viewStateAssign':
//                             $setObj['viewState'] = action.scenarioValue;
//                             break;
//                         case 'priorityAssign':
//                             if (!socket.handshake.session.permissions.tickets.canSetPriority) {
//                                 $pushObj['ticketlog'].status.map(st => {
//                                     if (st.name == 'STATEPASSIGN') {
//                                         st.task = 'Failed to perform operation : State assignment';
//                                         st.reason = 'Not have permission to change state';
//                                     }
//                                 })
//                             } else {
//                                 $setObj['priority'] = action.scenarioValue;
//                             }
//                             break;
//                         case 'stateAssign':
//                             if (!socket.handshake.session.permissions.tickets.canChangeState) {
//                                 $pushObj['ticketlog'].status.map(st => {
//                                     if (st.name == 'STATEPASSIGN') {
//                                         st.task = 'Failed to perform operation : State assignment';
//                                         st.reason = 'Not have permission to change state';
//                                     }
//                                 })
//                             }
//                             else {
//                                 $setObj['state'] = action.scenarioValue;
//                             }
//                             break;
//                         case 'noteAssign':
//                             if (!socket.handshake.session.permissions.tickets.canAddNote) {
//                                 $pushObj['ticketlog'].status.map(st => {
//                                     if (st.name == 'NOTEASSIGN') {
//                                         st.task = 'Failed to perform operation : Note addition';
//                                         st.reason = 'Not have permission to add Note';
//                                     }
//                                 })
//                             }
//                             else {
//                                 $pushObj['ticketNotes'] = { ticketNote: action.scenarioValue, added_by: socket.handshake.session.email, added_at: new Date().toISOString(), id: new ObjectID() }
//                             }
//                             break;
//                         case 'tagAssign':
//                             if (!socket.handshake.session.permissions.tickets.canAddTag) {
//                                 $pushObj['ticketlog'].status.map(st => {
//                                     if (st.name == 'TAGASSIGN') {
//                                         st.task = 'Failed to perform operation : Tag Addition';
//                                         st.reason = 'Not have permission to add Note';
//                                     }
//                                 })
//                             }
//                             data.tickets.map(ticket => {
//                                 if (ticket.tags && ticket.tags.length) {
//                                     ticket.tags.map(tag => {
//                                         if (tag.includes(action.scenarioValue)) {
//                                             action.scenarioValue = action.scenarioValue.filter(data => { return data != tag })
//                                             $pushObj['tags'] = action.scenarioValue
//                                         }
//                                         else {
//                                             $pushObj['tags'] = action.scenarioValue
//                                         }
//                                     })
//                                 } else {
//                                     $pushObj['tags'] = action.scenarioValue;
//                                 }
//                             })
//                             break;
//                         case 'taskAssign':
//                             if (!socket.handshake.session.permissions.tickets.canAddTask) {
//                                 $pushObj['ticketlog'].status.map(st => {
//                                     if (st.name == 'TASKASSIGN') {
//                                         st.task = 'Failed to perform operation : Task Addition';
//                                         st.reason = 'Not have permission to add task';
//                                     }
//                                 })
//                             }
//                             else {
//                                 $pushObj['todo'] = { todo: action.scenarioValue, agent: socket.handshake.session.email, completed: false, datetime: new Date().toISOString(), id: new ObjectID() }
//                             }
//                             break;
//                         case 'watcherAssign':
//                             data.tickets.map(ticket => {
//                                 if (ticket.watchers && ticket.watchers.length) {
//                                     ticket.watchers.map(watcher => {
//                                         action.scenarioValue = action.scenarioValue.filter(data => { return data != watcher })
//                                         action.scenarioValue = action.scenarioValue.filter(data => { return data != ticket.assigned_to })
//                                     })
//                                     $pushObj['watchers'] = action.scenarioValue;
//                                 }
//                                 if (action.scenarioValue && action.scenarioValue.length) {
//                                     let msg = 'Hello, Agent '
//                                         + '<span>You have been added as a watcher by:  ' + socket.handshake.session.email + '<br>'
//                                         + '<span><b>Ticket Link: </b> https://app.beelinks.solutions/tickets/ticket-view/' + ticket._id + '<br>';
//                                     let obj = {
//                                         action: 'sendNoReplyEmail',
//                                         to: action.scenarioValue,
//                                         subject: 'Added as watcher to Ticket #' + ticket._id,
//                                         message: msg,
//                                         html: msg,
//                                         type: 'newTicket'
//                                     }
//                                     let response = EmailService.SendNoReplyEmail(obj, false);
//                                     data.agents.map(result => {
//                                         socket.to(result._id).emit('newTicket', { ticket: ticket, ignoreAdmin: false });
//                                     })
//                                     $pushObj['watchers'] = action.scenarioValue;
//                                 }
//                             })
//                             break;
//                     }
//                 });
//                 if (Object.keys($setObj).length) Object.assign($update, { $set: $setObj });
//                 if (Object.keys($pushObj).length) Object.assign($update, { $push: $pushObj });
//                 if (Object.keys($renameObj).length) Object.assign($update, { $rename: $renameObj });
//                 let results = await Tickets.ExecuteScenarios(data.ids, socket.handshake.session.nsp, $update);
//                 //notifications && emits:
//                 if (results && results.length) {
//                     results.map(async result => {
//                         if (result.previousAgent) {
//                             let previousAgent = await SessionManager.getAgentByEmail(socket.handshake.session.nsp, result.previousAgent);
//                             // console.log(previousAgent.email);
//                             if (previousAgent) {
//                                 switch (previousAgent.permissions.tickets.canView) {
//                                     case 'assignedOnly':
//                                         origin.to(previousAgent._id).emit('removeTicket', { tid: result._id, ticket: result });
//                                         break;
//                                     case 'group':
//                                         //check if group admin
//                                         //If no them emit 
//                                         if ((result.group && !previousAgent.groups.includes(result.group)) || !result.group) {
//                                             origin.to(previousAgent._id).emit('removeTicket', { tid: result._id, ticket: result });
//                                         }
//                                         break;
//                                     default:
//                                         break;
//                                 }
//                             }
//                             //Emit to Teams for remove ticket
//                             let teamsOfPreviousAgent = await TeamsModel.getTeamsAgainstAgent(result.nsp, result.previousAgent);
//                             teamsOfPreviousAgent.forEach(team => {
//                                 socket.to(team).emit('removeTicket', { tid: result._id, ticket: result });
//                             })
//                         }
//                         //notify to previous group
//                         if (result.previousGroup) {
//                             origin.to(result.previousGroup).emit('removeTicket', { tid: result._id, ticket: result, email: result.assigned_to });
//                             origin.to(result.group).emit('newTicket', { ticket: result, ignoreAdmin: false });
//                         }
//                         if (result.state == 'SOLVED' && !result.SubmittedSurveyData) {
//                             //solved time && send survey email && sla policy work
//                             let message = 'This is to inform you that Ticket is SOLVED sucessfully, if you find some ambiguity in SOLVED ticket, reply back to this thread. Kindly took out some moment to fill survey form following';
//                             let survey = await FeedBackSurveyModel.getActivatedSurvey();
//                             if (survey && survey.length && survey[0].sendWhen == 'solved') {
//                                 let getMessageById = await Tickets.getMessagesByTicketId(data.tids);
//                                 if (getMessageById && getMessageById.length) {
//                                     getMessageById.map(data => {
//                                         EmailService.SendEmail({
//                                             action: 'StateChangedFeedbackSurvey',
//                                             survey: survey && survey.length ? survey[0] : undefined,
//                                             ticket: result,
//                                             reply: data.to[0],
//                                             message: message
//                                         }, 5, true);
//                                     })
//                                 }
//                             }
//                             await this.ApplyPolicy(result);
//                         }
//                         if (result.state == 'CLOSED' && !result.SubmittedSurveyData) {
//                             //send survey email
//                             let message = 'This is to inform you that Ticket is CLOSED sucessfully, if you find some ambiguity in CLOSED ticket, reply back to this thread. Kindly took out some moment to fill survey form following';
//                             let survey = await FeedBackSurveyModel.getActivatedSurvey();
//                             if (survey && survey.length && survey[0].sendWhen == 'closed') {
//                                 let getMessageById = await Tickets.getMessagesByTicketId(data.tids);
//                                 if (getMessageById && getMessageById.length) {
//                                     getMessageById.map(data => {
//                                         EmailService.SendEmail({
//                                             action: 'StateChangedFeedbackSurvey',
//                                             survey: survey && survey.length ? survey[0] : undefined,
//                                             ticket: result,
//                                             reply: data.to[0],
//                                             message: message
//                                         }, 5, true);
//                                     })
//                                 }
//                             }
//                         }
//                         //emit to ticket admin
//                         socket.to('ticketAdmin').emit('updateTicket', { tid: result._id, ticket: result, ticketlog: data.ticketlog });
//                         //emit to group of ticket
//                         socket.to(result.group).emit('updateTicket', { tid: result._id, ticket: result, ticketlog: data.ticketlog });
//                         if (result.watchers && result.watchers.length) {
//                             let watchers = await SessionManager.getOnlineWatchers(socket.handshake.session.nsp, result.watchers);
//                             if (watchers && watchers.length) {
//                                 if (result.assigned_to) watchers = watchers.filter(data => { return data != result.assigned_to })
//                                 watchers.map(single => {
//                                     socket.to(single._id).emit('updateTicket', { tid: result._id, ticket: result, ticketlog: data.ticketlog });
//                                 })
//                             }
//                         }
//                         //emit to new agent 
//                         if (newAgent) {
//                             console.log('Assigned Agent: ' + newAgent.email);
//                             if (newAgent.permissions.tickets.canView == 'assignedOnly') {
//                                 socket.to(newAgent._id).emit('newTicket', { ticket: result, ignoreAdmin: false });
//                             }
//                         }
//                         //Emit to Teams for new ticket
//                         let recipients = Array();
//                         let EmailRecipients = Array();
//                         if (result && result.assigned_to) {
//                             let res = await Tickets.getWatchers(result._id, socket.handshake.session.nsp);
//                             if (res && res.length) {
//                                 EmailRecipients = EmailRecipients.concat(res[0].watchers);
//                             }
//                             EmailRecipients.push(result.assigned_to);
//                             recipients = EmailRecipients.filter((item, pos) => {
//                                 return EmailRecipients.indexOf(item) == pos;
//                             })
//                             let teams = await TeamsModel.getTeamsAgainstAgent(result.nsp, result.assigned_to);
//                             teams.forEach(team => {
//                                 console.log('New Ticket: ' + team);
//                                 socket.to(team).emit('newTicket', { ticket: result ? result : undefined, ignoreAdmin: false });
//                             });
//                         }
//                         //email to assigned agent..
//                         if (origin['settings']['emailNotifications']['tickets'].assignToAgent) {
//                             let msg = '<span><b>ID: </b>' + result._id + '<br>'
//                                 + '<span><b>Assigned by: </b>' + socket.handshake.session.email + '<br>'
//                                 + '<span><b>Link: </b> https://app.beelinks.solutions/tickets/ticket-view/' + result._id + '<br>';
//                             let response = await EmailService.NotifyAgentForTicket({
//                                 ticket: result,
//                                 subject: result.subject,
//                                 nsp: socket.handshake.session.nsp.substring(1),
//                                 to: recipients,
//                                 msg: msg
//                             });
//                             if (response && response.MessageId) {
//                                 console.log('Email Sending TO Agent When Assigning Failed');
//                             }
//                         }
//                         //email to assigned group..
//                         if (origin['settings']['emailNotifications']['tickets'].assignToGroup) {
//                             let groupAdmins = await TicketGroupsModel.GetGroupAdmins(socket.handshake.session.nsp, result.group);
//                             if (groupAdmins) {
//                                 if (result.watchers && result.watchers.length) {
//                                     let watchers = await SessionManager.getOnlineWatchers(socket.handshake.session.nsp, result.watchers);
//                                     if (watchers && watchers.length) {
//                                         groupAdmins = groupAdmins.concat(watchers[0].watchers);
//                                         recipients = groupAdmins.filter((item, pos) => {
//                                             if (groupAdmins && groupAdmins.length) return groupAdmins.indexOf(item) == pos;
//                                         })
//                                     }
//                                 }
//                                 else {
//                                     recipients = groupAdmins;
//                                 }
//                                 recipients.forEach(async admin => {
//                                     if (result) {
//                                         socket.to(admin._id).emit('updateTicketProperty', { tid: result._id, ticket: result, ticketlog: data.ticketlog });
//                                         let msg = '<span><b>ID: </b>' + result._id + '<br>'
//                                             + '<span><b>Group: </b> ' + result.group + '<br>'
//                                             + '<span><b>Assigned by: </b> ' + socket.handshake.session.email + '<br>'
//                                             + '<span><b>Link: </b> https://app.beelinks.solutions/tickets/ticket-view/' + result._id + '<br>';
//                                         let obj = {
//                                             action: 'sendNoReplyEmail',
//                                             to: admin,
//                                             subject: 'Group assigned to Ticket #' + result._id,
//                                             message: msg,
//                                             html: msg,
//                                             type: 'newTicket'
//                                         }
//                                         let response = EmailService.SendNoReplyEmail(obj, false);
//                                     }
//                                 });
//                             }
//                         }
//                         //note notify
//                         if (origin['settings']['emailNotifications']['tickets'].noteAddTick) {
//                             //ticket.assigned_to + watchers:
//                             let recipients: Array<any> = [];
//                             if (result.assigned_to) recipients.push(result.assigned_to);
//                             if (result.watchers && result.watchers.length) {
//                                 recipients = recipients.concat(result.watchers);
//                                 recipients = recipients.filter((item, pos) => {
//                                     if (recipients && recipients.length) return recipients.indexOf(item) == pos;
//                                 })
//                             }
//                             //console.log('recipients',recipients);
//                             let msg = '<span><b>ID: </b>' + result._id + '<br>'
//                                 + '<span><b>Note: </b> ' + data.properties.ticketNote + '<br>'
//                                 + '<span><b>Added by: </b> ' + socket.handshake.session.email + '<br>'
//                                 + '<span><b>Link: </b> https://app.beelinks.solutions/tickets/ticket-view/' + result._id + '<br>';
//                             let obj = {
//                                 action: 'sendNoReplyEmail',
//                                 to: recipients,
//                                 subject: 'New Note added to Ticket #' + result._id,
//                                 message: msg,
//                                 html: msg,
//                                 type: 'newNote'
//                             }
//                             let response;
//                             if (recipients && recipients.length) response = await EmailService.SendNoReplyEmail(obj, false);
//                         }
//                     })
//                 }
//                 callback({ status: 'ok', updatedProperties: $update });
//             } catch (error) {
//                 console.log(error);
//                 console.log('Error in get executing scenario');
//             }
//         })
//     }
//     private static GetTicketById(socket, origin: SocketIO.Namespace) {
//         socket.on('getTicketByID', async (data, callback) => {
//             try {
//                 if (!Array.isArray(data.tid)) data.tid = [data.tid]
//                 let ticket = await Tickets.getTicketByID(socket.handshake.session.nsp, data.tid);
//                 if (ticket && ticket.length) {
//                     switch (socket.handshake.session.permissions.tickets.canView) {
//                         case 'all':
//                             callback({ status: 'ok', thread: ticket[0] });
//                             break;
//                         case 'group':
//                             if ((ticket[0].group && socket.handshake.session.groups.includes(ticket[0].group))) {
//                                 callback({ status: 'ok', thread: ticket[0] });
//                             } else {
//                                 callback({ status: 'unauthorized', code: 500, msg: 'You are unauthorized to view this ticket!' });
//                             }
//                             break;
//                         case 'assignedOnly':
//                             if (ticket[0].assigned_to && (ticket[0].assigned_to == socket.handshake.session.email)) {
//                                 callback({ status: 'ok', thread: ticket[0] });
//                             } else {
//                                 callback({ status: 'unauthorized', code: 500, msg: 'You are unauthorized to view this ticket!' });
//                             }
//                             break;
//                         case 'team':
//                             let agents = await TeamsModel.getTeamMembersAgainstAgent(socket.handshake.session.nsp, socket.handshake.session.email);
//                             if (ticket[0].assigned_to && agents.includes(ticket[0].assigned_to)) {
//                                 callback({ status: 'ok', thread: ticket[0] });
//                             } else {
//                                 callback({ status: 'unauthorized', code: 500, msg: 'You are unauthorized to view this ticket!' });
//                             }
//                             break;
//                     }
//                     // if (socket.handshake.session.permissions.tickets.canView != 'all') {
//                     //     if ((ticket[0].assigned_to && ticket[0].assigned_to == socket.handshake.session.email) || (ticket[0].group && socket.handshake.session.groups.includes(ticket[0].group))) {
//                     //         callback({ status: 'ok', thread: ticket[0] });
//                     //     } else {
//                     //         callback({ status: 'unauthorized', code: 500, msg: 'You are unauthorized to view this ticket!' });
//                     //     }
//                     // } else {
//                     //     callback({ status: 'ok', thread: ticket[0] });
//                     // }
//                 } else {
//                     callback({ status: 'error', code: 500, msg: 'Internal Server Error' });
//                 }
//             } catch (error) {
//                 console.log(error);
//                 console.log('error in Getting particular Tickets')
//             }
//         });
//     }
//     private static TestTicketReply(socket, origin: SocketIO.Namespace) {
//         socket.on('testTicketMessage', async (data, callback) => {
//             let ticketLog: TicketLogSchema = {
//                 status: 'OPEN',
//                 updated_by: socket.handshake.session.email,
//                 user_type: 'Visitor',
//                 time_stamp: new Date().toISOString()
//             };
//             let ticketId = new ObjectID("5d7b9e5a5e764b373867e201");
//             //console.log([ticketId]);
//             let message: TicketMessageSchema = {
//                 "senderType": "Visitor",
//                 "nsp": '/localhost',
//                 "message": "New Message",
//                 "from": "saadku64@gmail.com",
//                 "to": "w@s.msd",
//                 "tid": [ticketId],
//                 "datetime": "2019-10-13T13:06:52.548Z",
//                 "viewColor": '#45BBFF',
//                 "attachment": [],
//                 replytoAddress: "saadku64@gmail.com"
//             }
//             await Tickets.UpdateViewState(['5d7b9e5a5e764b373867e201'], '/localhost.com', 'UNREAD');
//             await Tickets.UpdateTicketFromSNS(new ObjectID('5d7b9e5a5e764b373867e201'), '/localhost.com', new Date().toISOString(), ticketLog, 'OPEN');
//             let insertedMessage = await Tickets.InsertMessage(JSON.parse(JSON.stringify(message)));
//             origin.to(socket.handshake.session._id).emit('gotNewTicketMessage', {
//                 ticket: insertedMessage.ops[0],
//                 viewState: 'UNREAD'
//             });
//             callback({ status: 'ok', ticket: insertedMessage.ops[0] });
//         });
//     }
//     private static getContactsForCompaign(socket, origin: SocketIO.Namespace) {
//         socket.on('getContactsForCompaign', async (data, callback) => {
//             try {
//                 let result = await Visitor.GetContactsForCompaign(socket.handshake.session.nsp, data.fullCountryName);
//                 callback({ status: 'ok', email_data: (result && result.length) ? result : [] });
//             } catch (error) {
//                 console.log(error);
//                 console.log('Error in get compaign data');
//             }
//         })
//     }
//     /**
//      * 
//      * @Permissions
//      * all : View All Tickets
//      * group : To Be Included
//      * assignedOnly : View Tickets only assigned to the given user
//      */
//     private static GetTickets(socket, origin: SocketIO.Namespace) {
//         socket.on('getTickets', async (data, callback) => {
//             try {
//                 // console.log(data);
//                 let ticketPermissions = socket.handshake.session.permissions.tickets;
//                 let company = await Company.getCompany(socket.handshake.session.nsp);
//                 if (company && company.length) {
//                     var t0 = performance.now();
//                     let tickets = await Tickets.getTickets(socket.handshake.session.nsp, socket.handshake.session.email, ticketPermissions.canView, data.filters, data.clause, data.query, data.sortBy, data.assignType, data.groupAssignType, data.mergeType, data.limit, company[0].settings.solrSearch);
//                     var t1 = performance.now();
//                     console.log(socket.handshake.session.email + " call to Get Tickets took " + (t1 - t0) + " milliseconds.");
//                     callback({ status: 'ok', tickets: (tickets && tickets[0].length) ? tickets[0] : [], ended: (tickets && tickets[0].length >= 50) ? false : true, count: (tickets && tickets[1].length) ? tickets[1] : [{ state: 'OPEN', count: 0 }, { state: 'PENDING', count: 0 }, { state: 'CLOSED', count: 0 }] });
//                 }
//                 // if(company.settings.solrSearch){
//                 //     socket.to(socket.handshake.session._id).emit('updateTicketsCount', {count: (tickets) ? [{state: '', count: tickets[1].length}] : []});
//                 // }
//             } catch (error) {
//                 console.log(error);
//                 console.log('error in Getting Tickets')
//             }
//         });
//         socket.on('getTicketsFromSolr', async (data, callback) => {
//             try {
//                 // console.log(data);
//                 let ticketPermissions = socket.handshake.session.permissions.tickets;
//                 let tickets = await Tickets.getTickets(socket.handshake.session.nsp, socket.handshake.session.email, ticketPermissions.canView, data.filters, data.clause, data.query, data.sortBy, data.assignType, data.groupAssignType, data.mergeType, data.limit);
//                 // console.log(ticketsFromDB?.length);
//                 // let tickets = await Tickets.getTickets(socket.handshake.session.nsp, socket.handshake.session.email, ticketPermissions.canView, data.filters, data.clause, data.query, data.sortBy, data.assignType, data.mergeType, data.limit);
//                 // let tickets = await Tickets.getTicketsFromSolr(socket.handshake.session.nsp, data.query);
//                 // console.log(tickets?.length);
//                 callback({ status: 'ok', tickets: tickets, ended: (tickets && tickets.length >= 50) ? false : true });
//             } catch (error) {
//                 console.log(error);
//                 console.log('error in Getting Tickets')
//             }
//         });
//         // socket.on('getTicketsByQuery', async (data, callback) => {
//         //     try {
//         //         console.log(data);
//         //         let ticketPermissions = socket.handshake.session.permissions.tickets;
//         //         let tickets = await Tickets.getTickets(socket.handshake.session.nsp, socket.handshake.session.email, ticketPermissions.canView, data.filters, data.clause, data.query, data.chunk, 5);
//         //         callback({ status: 'ok', tickets: tickets, ended: (tickets && tickets.length >= 50) ? false : true });
//         //     } catch (error) {
//         //         console.log(error);
//         //         console.log('error in Getting Tickets')
//         //     }
//         // });
//     }
//     private static AddSignature(socket, origin: SocketIO.Namespace) {
//         socket.on('saveSignature', async (data, callback) => {
//             try {
//                 let savedSignature = await Tickets.EmailSignature(data.header, data.footer, socket.handshake.session.email);
//                 if (savedSignature) {
//                     callback({ status: 'ok', savedSignature: savedSignature.ops[0] });
//                 } else {
//                     callback({ status: 'error' });
//                 }
//             }
//             catch (error) {
//                 console.log(error);
//                 console.log('error in saving Signature Properties');
//                 callback({ status: 'error' })
//             }
//         });
//     }
//     // private static addWatchers(socket, origin: SocketIO.Namespace) {
//     //     socket.on('addWatchers', async (data, callback) => {
//     //         try {
//     //             console.log("data", data);
//     //             let watchers = await Tickets.addWatchers(data.tids, data.agents, data.ticketlog, socket.handshake.session.nsp);
//     //             if (watchers && watchers.length) {
//     //                 console.log("watchers",watchers);
//     //                 callback({ status: 'ok', watchers: watchers });
//     //                 watchers.map(async watcher => {
//     //                     socket.to('ticketAdmin').emit('updateTicketProperty', { tid: watcher._id, ticket: watcher });
//     //                     socket.to(watcher.group).emit('updateTicketProperty', { tid: watcher._id, ticket: watcher });
//     //                     if (watcher.assigned_to) {
//     //                         let assigendTo = await SessionManager.getAgentByEmail(socket.handshake.session.nsp, watcher.assigned_to);
//     //                         if (assigendTo && assigendTo.value) socket.to(assigendTo.value._id).emit('updateTicketProperty', { tid: watcher._id, ticket: watcher });
//     //                     }
//     //                 })
//     //             }
//     //         }
//     //         catch (error) {
//     //             console.log(error);
//     //             console.log('error in adding watchers');
//     //             callback({ status: 'error' })
//     //         }
//     //     });
//     // }
//     // private static deleteWatcher(socket, origin: SocketIO.Namespace) {
//     //     socket.on('deleteWatcher', async (data, callback) => {
//     //         try {
//     //             console.log("data", data);
//     //             let watchers = await Tickets.deleteWatcher(data.id, data.agent);
//     //             if (watchers && watchers.value) {
//     //                 callback({ status: 'ok', msg: "Watcher deleted successfully!" });
//     //             }
//     //             else {
//     //                 callback({ status: 'ok', msg: "Error in deleting watcher!" });
//     //             }
//     //         }
//     //         catch (error) {
//     //             console.log(error);
//     //             console.log('error in adding watchers');
//     //             callback({ status: 'error' })
//     //         }
//     //     });
//     // }
//     private static UpdateSignature(socket, origin: SocketIO.Namespace) {
//         socket.on('updateSignature', async (data, callback) => {
//             try {
//                 let updatedSignature = await Tickets.UpdateSignature(data.header, data.footer, data.id, socket.handshake.session.email);
//                 if (updatedSignature && updatedSignature.value) {
//                     callback({ status: 'ok', updatedSignature: updatedSignature.value });
//                 } else {
//                     callback({ status: 'error' });
//                 }
//             }
//             catch (error) {
//                 console.log(error);
//                 console.log('error in updating Signature');
//                 callback({ status: 'error' })
//             }
//         });
//     }
//     //change in watchers
//     private static checkedTask(socket, origin: SocketIO.Namespace) {
//         socket.on('checkedTask', async (data, callback) => {
//             try {
//                 let result = await Tickets.checkedTask(data.tid, data.ids);
//                 // checkedTask.todo
//                 if (result && result.value) {
//                     //console.log("see result", result.value.todo);
//                     callback({ status: 'ok', tasks: result.value });
//                     socket.to('ticketAdmin').emit('updateTicketProperty', { tid: data.tid, ticket: result.value });
//                     socket.to(result.value.group).emit('updateTicketProperty', { tid: data.tid, ticket: result.value });
//                     if (result.value.assigned_to) {
//                         let assigendTo = await SessionManager.getAgentByEmail(socket.handshake.session.nsp, result.value.assigned_to);
//                         if (assigendTo) socket.to(assigendTo._id).emit('updateTicketProperty', { tid: result.value._id, ticket: result.value });
//                     }
//                     if (result.value.watchers) {
//                         let res = result.value;
//                         let watchers = await SessionManager.getOnlineWatchers(socket.handshake.session.nsp, result.value.watchers);
//                         if (watchers && watchers.length) {
//                             if (res.assigned_to) watchers = watchers.filter(data => { return data != res.assigned_to })
//                             watchers.map(watcher => {
//                                 socket.to(watcher._id).emit('updateTicketProperty', { tid: res.id, ticket: res });
//                             })
//                         }
//                     }
//                 }
//             } catch (error) {
//                 console.log(error);
//                 console.log("error in updating checked tasks");
//             }
//         })
//     }
//     //change in watchers
//     private static updateTask(socket, origin: SocketIO.Namespace) {
//         socket.on('updateTask', async (data, callback) => {
//             try {
//                 // console.log("event", data.id);
//                 // , data.properties, socket.handshake.session.nsp
//                 let result = await Tickets.updateTask(data.tid, data.id, data.properties);
//                 if (result && result.value) {
//                     callback({ status: 'ok', tasks: result.value });
//                     socket.to('ticketAdmin').emit('updateTicketProperty', { tid: data.tid, ticket: result.value });
//                     socket.to(result.value.group).emit('updateTicketProperty', { tid: data.tid, ticket: result.value });
//                     if (result.value.assigned_to) {
//                         let assigendTo = await SessionManager.getAgentByEmail(socket.handshake.session.nsp, result.value.assigned_to);
//                         if (assigendTo) socket.to(assigendTo._id).emit('updateTicketProperty', { tid: result.value._id, ticket: result.value });
//                     }
//                     if (result.value.watchers) {
//                         let res = result.value;
//                         let watchers = await SessionManager.getOnlineWatchers(socket.handshake.session.nsp, result.value.watchers);
//                         if (watchers && watchers.length) {
//                             if (res.assigned_to) watchers = watchers.filter(data => { return data != res.assigned_to })
//                             watchers.map(watcher => {
//                                 socket.to(watcher._id).emit('updateTicketProperty', { tid: result ? result.value._id : undefined, ticket: result ? result.value : undefined });
//                             })
//                         }
//                     }
//                 } else {
//                     callback({ status: 'error', msg: 'Cannot update tasks' });
//                 }
//             } catch (error) {
//                 console.log(error);
//                 console.log("error in updating tasks");
//             }
//         })
//     }
//     private static getTask(socket, origin: SocketIO.Namespace) {
//         socket.on('getTask', async (data, callback) => {
//             try {
//                 // console.log(data.id);
//                 let tasks = await Tickets.getTask(socket.handshake.session.nsp);
//                 if (tasks && tasks.length && tasks[0].todo) {
//                     tasks[0].todo.sort((a, b) => {
//                         //sorts in most recent chat.
//                         if (new Date(a.datetime) < new Date(b.datetime)) return 1;
//                         else if (new Date(a.datetime) > new Date(b.datetime)) return -1;
//                         else return 0;
//                     });
//                     callback({ status: 'ok', tasks: tasks[0].todo });
//                 } else {
//                     callback({ status: 'error', msg: 'Cannot get tasks' });
//                 }
//             } catch (error) {
//                 console.log(error);
//                 console.log("error in getting tasks");
//             }
//         });
//     }
//     private static GetSign(socket, origin: SocketIO.Namespace) {
//         socket.on('getSign', async (data, callback) => {
//             try {
//                 let signs = await Tickets.getSign(socket.handshake.session.email);
//                 // console.log("signs" , signs);
//                 //this signs contains signatures that should be appended or pre-pended with email templates.
//                 //signatures contain header and footer of particular agent.
//                 if (signs && signs.length) {
//                     callback({ status: 'ok', signs: signs });
//                 } else {
//                     callback({ status: 'error', msg: 'Cannot get signs' });
//                 }
//             } catch (error) {
//                 console.log(error);
//                 console.log("error in getting signatures");
//             }
//         });
//     }
//     private static ToggleSign(socket, origin: SocketIO.Namespace) {
//         socket.on('toggleSign', async (data, callback) => {
//             try {
//                 let signs = await Tickets.toggleSign(socket.handshake.session.email, data.signId, data.check);
//                 if (signs && signs.value) {
//                     callback({ status: 'ok', signs: signs.value });
//                 } else {
//                     callback({ status: 'error', msg: 'Cannot toggle signatures' });
//                 }
//             } catch (error) {
//                 console.log(error);
//                 console.log("error in toggling signatures");
//             }
//         });
//     }
//     private static SetPrimaryEmail(socket, origin: SocketIO.Namespace) {
//         socket.on('setPrimaryEmail', async (data, callback) => {
//             try {
//                 let emailData = await Tickets.setPrimaryEmail(socket.handshake.session.nsp, data.id, data.flag);
//                 if (emailData && emailData.value) {
//                     // console.log(emailData.value);
//                     callback({ status: 'ok', emailData: emailData.value });
//                 } else {
//                     callback({ status: 'error', msg: 'Cannot set email primary' });
//                 }
//             } catch (error) {
//                 console.log(error);
//                 console.log("error in setting primary email");
//             }
//         });
//     }
//     private static DeleteSign(socket, origin: SocketIO.Namespace) {
//         socket.on('deleteSign', async (data, callback) => {
//             try {
//                 let signs = await Tickets.deleteSign(data.signId, socket.handshake.session.email);
//                 if (signs) {
//                     callback({ status: 'ok' });
//                 } else {
//                     callback({ status: 'error', msg: 'could not delete signatures' });
//                 }
//             } catch (error) {
//                 console.log(error);
//                 console.log("error in deleting signatures");
//             }
//         });
//     }
//     /**
//      * 
//      * @Data
//      * 1. Properties : { ticketNote : string }
//      * 2. tids : Array<string>
//      */
//     //change in watchers
//     private static EditTicketNote(socket, origin: SocketIO.Namespace) {
//         socket.on('editTicketNote', async (data, callback) => {
//             try {
//                 data.properties.id = new ObjectID();
//                 let result = await Tickets.UpdateTicketNote(data.tids, data.properties, socket.handshake.session.nsp, data.ticketlog);
//                 if (result && result.length) {
//                     // console.log("updated note", result);
//                     //console.log(data.properties);
//                     callback({ status: 'ok', note: result });
//                     result.map(async ticket => {
//                         socket.to('ticketAdmin').emit('updateTicketProperty', { tid: ticket._id, ticket: ticket, ticketlog: data.ticketlog });
//                         socket.to(ticket.group).emit('updateTicketProperty', { tid: ticket._id, ticket: ticket, ticketlog: data.ticketlog });
//                         if (ticket.assigned_to) {
//                             let assigendTo = await SessionManager.getAgentByEmail(socket.handshake.session.nsp, ticket.assigned_to);
//                             if (assigendTo) socket.to(assigendTo._id).emit('updateTicketProperty', { tid: ticket._id, ticket: ticket, ticketlog: data.ticketlog });
//                         }
//                         if (ticket.watchers) {
//                             let watchers = await SessionManager.getOnlineWatchers(socket.handshake.session.nsp, ticket.watchers);
//                             if (watchers && watchers.length) {
//                                 if (ticket.assigned_to) watchers = watchers.filter(data => { return data != ticket.assigned_to })
//                                 watchers.map(watcher => {
//                                     socket.to(watcher._id).emit('updateTicketProperty', { tid: ticket._id, ticket: ticket, ticketlog: data.ticketlog });
//                                 })
//                             }
//                         }
//                         if (origin['settings']['emailNotifications']['tickets'].noteAddTick) {
//                             //ticket.assigned_to + watchers:
//                             let recipients: Array<any> = [];
//                             if (ticket.assigned_to) recipients.push(ticket.assigned_to);
//                             if (ticket.watchers && ticket.watchers.length) {
//                                 //console.log('ticket wat',ticket.watchers);
//                                 recipients = recipients.concat(ticket.watchers);
//                                 //console.log(recipients);
//                                 recipients = recipients.filter((item, pos) => {
//                                     if (recipients && recipients.length) return recipients.indexOf(item) == pos;
//                                 })
//                             }
//                             //console.log('recipients',recipients);
//                             let msg = '<span><b>ID: </b>' + ticket._id + '<br>'
//                                 + '<span><b>Note: </b> ' + data.properties.ticketNote + '<br>'
//                                 + '<span><b>Added by: </b> ' + socket.handshake.session.email + '<br>'
//                                 + '<span><b>Link: </b> https://app.beelinks.solutions/tickets/ticket-view/' + ticket._id + '<br>';
//                             let obj = {
//                                 action: 'sendNoReplyEmail',
//                                 to: recipients,
//                                 subject: 'New Note added to Ticket #' + ticket._id,
//                                 message: msg,
//                                 html: msg,
//                                 type: 'newNote'
//                             }
//                             let response;
//                             if (recipients && recipients.length) response = await EmailService.SendNoReplyEmail(obj, false);
//                         }
//                     });
//                 } else {
//                     callback({ status: 'error' });
//                 }
//             } catch (error) {
//                 console.log(error);
//                 console.log('error in Editing ticket Properties');
//                 callback({ status: 'error' })
//             }
//         });
//     }
//     /**
//      * @Data
//      * 1. filter Object<{ key : [value]}>
//      * 2. clause : <string>
//      */
//     private static GetMoreTickets(socket) {
//         socket.on('getMoreTickets', async (data, callback) => {
//             try {
//                 console.log('Get more tickets');
//                 let ticketPermissions = socket.handshake.session.permissions.tickets;
//                 let company = await Company.getCompany(socket.handshake.session.nsp);
//                 if (company && company.length) {
//                     let tick = await Tickets.getTicketsForLazyLoading(socket.handshake.session.nsp, socket.handshake.session.email, ticketPermissions.canView, data.filters, data.clause, data.query, data.chunk, data.sortBy, data.assignType, data.groupAssignType, data.mergeType, company[0].settings.solrSearch);
//                     callback({ status: 'ok', tick: tick, ended: (tick && tick.length < 50) ? true : false });
//                 }
//             } catch (error) {
//                 console.log(error);
//                 console.log('error in Get More Tickets');
//                 callback({ status: 'error' });
//             }
//         });
//     }
//     //returns array with state and id in it.
//     /**
//      * 
//      * @Data
//      * 1. filter : Object<{ key : [values] }>
//      * 2. clause <string>
//      */
//     private static GetTicketCount(socket, origin: SocketIO.Namespace) {
//         socket.on('getTicketsCount', async (data, callback) => {
//             try {
//                 let ticketPermissions = socket.handshake.session.permissions.tickets;
//                 let count = await Tickets.getTicketsCount(socket.handshake.session.nsp, socket.handshake.session.email, ticketPermissions.canView, data.filters, data.query, data.clause, data.assignType, data.groupAssignType, data.mergeType);
//                 // console.log(ticketsCount);
//                 callback({ status: 'ok', count: (count && count.length) ? count : [{ state: 'OPEN', count: 0 }, { state: 'PENDING', count: 0 }, { state: 'CLOSED', count: 0 }] });
//             } catch (error) {
//                 console.log(error);
//                 console.log('error in getting Ticket Count');
//                 callback({ status: 'error', msg: 'Unknown Error' });
//             }
//         });
//     }
//     //This Event is Raised When Selected Ticket is loaded for the First Time in Agent Panel
//     private static TicketMessages(socket, origin: SocketIO.Namespace) {
//         socket.on('ticketmessages', async (data, callback) => {
//             try {
//                 let messages = await Tickets.getMesages(data.tid);
//                 // console.log(messages);
//                 callback(messages);
//             } catch (error) {
//                 console.log(error);
//                 console.log('error in Ticket Messages');
//                 callback([]);
//             }
//         });
//     }
//     private static GetMergedMessages(socket, origin: SocketIO.Namespace) {
//         socket.on('mergedmessages', async (data, callback) => {
//             try {
//                 let MergedMessages = await Tickets.getMessages(data.tid);
//                 // console.log(data);
//                 //console.log(MergedMessages);
//                 callback(MergedMessages);
//             } catch (error) {
//                 console.log(error);
//                 console.log('error in Merged Messages');
//                 callback([]);
//             }
//         });
//     }
//     /**
//      * 
//      * @Data
//      * 1. primaryTicketID : TID<string>
//      * 2. mergeGroup :  Array<string>
//      * 3. secondaryTicketDetails : Array<Object<TicketSchema>>
//      * 4. ticketlog : Object<{ primaryTicketLog : Object<TicketlogSchema> , secondaryTicketLog : Object<TicketLogSchema> }>
//      * 5. secondaryTicketIDs : Array<string> Secondary TIDS
//      */
//     //to store merge id and merged boolean proerty with the ticket merging.
//     //change in watchers
//     private static MergeTicket(socket, origin: SocketIO.Namespace) {
//         socket.on('mergeTicket', async (data, callback) => {
//             //console.log(data);
//             try {
//                 /**
//                  * @return Object<{ { primaryTicket: Object<TicketSchema>, secondaryTicket: Array<TicketSchema> } }>
//                  */
//                 let mergedTickets = await Tickets.MergeTickets(socket.handshake.session.nsp, data.mergeGroup, data.ticketlog, data.secondaryTicketDetails, data.primaryTicketID, data.mergedTicketsDetails);
//                 if (mergedTickets && mergedTickets.primaryTicket && mergedTickets.secondaryTicket && mergedTickets.secondaryTicket.length) {
//                     socket.to('ticketAdmin').emit('updateTicket', { tid: mergedTickets.primaryTicket._id, ticket: mergedTickets.primaryTicket });
//                     socket.to(mergedTickets.primaryTicket.group).emit('updateTicket', { tid: mergedTickets.primaryTicket._id, ticket: mergedTickets.primaryTicket });
//                     if (mergedTickets.primaryTicket.assigned_to) {
//                         let assigendTo = await SessionManager.getAgentByEmail(socket.handshake.session.nsp, mergedTickets.primaryTicket.assigned_to);
//                         if (assigendTo) socket.to(assigendTo._id).emit('updateTicket', { tid: mergedTickets.primaryTicket._id, ticket: mergedTickets.primaryTicket, ignoreAdmin: true });
//                     }
//                     if (mergedTickets.primaryTicket.watchers) {
//                         let watchers = await SessionManager.getOnlineWatchers(socket.handshake.session.nsp, mergedTickets.primaryTicket.watchers);
//                         if (watchers && watchers.length) {
//                             if (mergedTickets.primaryTicket.assigned_to) watchers = watchers.filter(data => { return data != mergedTickets.primaryTicket.assigned_to })
//                             watchers.map(watcher => {
//                                 socket.to(watcher._id).emit('updateTicket', { tid: mergedTickets.primaryTicket._id, ticket: mergedTickets.primaryTicket, ignoreAdmin: true });
//                             })
//                         }
//                     }
//                     mergedTickets.secondaryTicket.map(async ticket => {
//                         socket.to('ticketAdmin').emit('updateTicketProperty', { tid: ticket._id, ticket: ticket, ticketlog: mergedTickets.secondaryTicket });
//                         socket.to(ticket.group).emit('updateTicketProperty', { tid: ticket._id, ticket: ticket, ticketlog: mergedTickets.secondaryTicket });
//                         if (ticket.assigned_to) {
//                             let assigendTo = await SessionManager.getAgentByEmail(socket.handshake.session.nsp, ticket.assigned_to);
//                             if (assigendTo) socket.to(assigendTo._id).emit('updateTicketProperty', { tid: ticket._id, ticket: ticket, ticketlog: mergedTickets.secondaryTicket });
//                         }
//                         if (ticket.watchers) {
//                             let watchers = await SessionManager.getAgentByEmail(socket.handshake.session.nsp, ticket.watchers);
//                             if (watchers && watchers.length) {
//                                 if (ticket.assigned_to) watchers = watchers.filter(data => { return data != ticket.assigned_to })
//                                 watchers.map(watcher => {
//                                     socket.to(watcher._id).emit('updateTicketProperty', { tid: ticket._id, ticket: ticket, ticketlog: mergedTickets.secondaryTicket });
//                                 })
//                             }
//                         }
//                     });
//                     callback({ status: 'ok', primayTicket: mergedTickets.primaryTicket, secondaryTicket: mergedTickets.secondaryTicket });
//                 } else {
//                     callback({ status: 'error' });
//                 }
//             } catch (error) {
//                 console.log(error);
//                 console.log('error in merging ticket');
//                 callback({ status: 'error' })
//             }
//         });
//     }
//     /**
//      * 
//      * @Data
//      * 1. primaryReference: <string>
//      * 2. SecondaryReference: <string>
//      * 3. ticketlog : Object<{ primaryTicketLog : Object<TicketlogSchema> , secondaryTicketLog : Object<TicketLogSchema> }>
//      */
//     //change in watchers
//     private static DeMergeTicket(socket, origin: SocketIO.Namespace) {
//         socket.on('demergeTicket', async (data, callback) => {
//             try {
//                 /**
//                  * @return Object<{ { primaryTicket: Object<TicketSchema>, secondaryTicket: Array<TicketSchema> } }>
//                  */
//                 let demergedTickets = await Tickets.DeMergeTickets(socket.handshake.session.nsp, data.primaryReference, data.SecondaryReference, data.ticketlog);
//                 if (demergedTickets && demergedTickets.primaryTicket && demergedTickets.secondaryTicket && demergedTickets.secondaryTicket) {
//                     socket.to('ticketAdmin').emit('updateTicketProperty', { tid: demergedTickets.primaryTicket._id, ticket: demergedTickets.primaryTicket });
//                     socket.to('ticketAdmin').emit('updateTicketProperty', { tid: demergedTickets.secondaryTicket._id, ticket: demergedTickets.secondaryTicket, ticketlog: demergedTickets.secondaryTicket });
//                     socket.to(demergedTickets.primaryTicket.group).emit('updateTicketProperty', { tid: demergedTickets.primaryTicket._id, ticket: demergedTickets.primaryTicket });
//                     socket.to(demergedTickets.secondaryTicket.group).emit('updateTicketProperty', { tid: demergedTickets.secondaryTicket._id, ticket: demergedTickets.secondaryTicket, ticketlog: demergedTickets.secondaryTicket });
//                     if (demergedTickets.primaryTicket.assigned_to) {
//                         let assigendTo = await SessionManager.getAgentByEmail(socket.handshake.session.nsp, demergedTickets.primaryTicket.assigned_to);
//                         if (assigendTo) socket.to(assigendTo._id).emit('updateTicketProperty', { tid: demergedTickets.primaryTicket._id, ticket: demergedTickets.primaryTicket, ignoreAdmin: true });
//                     }
//                     if (demergedTickets.secondaryTicket.assigned_to) {
//                         let assigendTo = await SessionManager.getAgentByEmail(socket.handshake.session.nsp, demergedTickets.secondaryTicket.assigned_to);
//                         if (assigendTo) socket.to(assigendTo._id).emit('updateTicketProperty', { tid: demergedTickets.secondaryTicket._id, ticket: demergedTickets.secondaryTicket, ticketlog: demergedTickets.secondaryTicket.ticketlog });
//                     }
//                     if (demergedTickets.secondaryTicket.watchers) {
//                         let watchers = await SessionManager.getOnlineWatchers(socket.handshake.session.nsp, demergedTickets.secondaryTicket.watchers);
//                         if (watchers && watchers.length) {
//                             if (demergedTickets.secondaryTicket.assigned_to) watchers = watchers.filter(data => { return data != demergedTickets.secondaryTicket.assigned_to })
//                             watchers.map(watcher => {
//                                 socket.to(watcher._id).emit('updateTicketProperty', { tid: demergedTickets.secondaryTicket._id, ticket: demergedTickets.secondaryTicket, ticketlog: demergedTickets.secondaryTicket.ticketlog });
//                             })
//                         }
//                     }
//                     if (demergedTickets.primaryTicket.watchers) {
//                         let watchers = await SessionManager.getOnlineWatchers(socket.handshake.session.nsp, demergedTickets.primaryTicket.watchers);
//                         if (watchers && watchers.length) {
//                             if (demergedTickets.primaryTicket.assigned_to) watchers = watchers.filter(data => { return data != demergedTickets.primaryTicket.assigned_to })
//                             watchers.map(watcher => {
//                                 socket.to(watcher._id).emit('updateTicketProperty', { tid: demergedTickets.secondaryTicket._id, ticket: demergedTickets.secondaryTicket, ticketlog: demergedTickets.secondaryTicket.ticketlog });
//                             })
//                         }
//                     }
//                     callback({ status: 'ok', primayTicket: demergedTickets.primaryTicket, secondaryTicket: demergedTickets.secondaryTicket });
//                 } else {
//                     callback({ status: 'error' });
//                 }
//             } catch (error) {
//                 console.log(error);
//                 console.log('error in Demerging ticket');
//                 callback({ status: 'error' })
//             }
//         });
//     }
//     private static exportdays(socket, origin: SocketIO.Namespace) {
//         socket.on('exportdays', async (data, callback) => {
//             let ticketPermissions = socket.handshake.session.permissions.tickets;
//             let dataToSend = {
//                 from: data.datafrom,
//                 to: data.datato,
//                 nsp: socket.handshake.session.nsp,
//                 email: socket.handshake.session.email,
//                 receivers: data.emails,
//                 canView: ticketPermissions.canView,
//                 filters: data.filters,
//                 keys: data.keys
//             }
//             //Send to Email Service
//             EmailService.SendEmail({
//                 action: 'ExportTickets',
//                 data: dataToSend,
//             }, 5, true);
//             // let exportdata = await Tickets.getExportData(data.datafrom, data.datato, socket.handshake.session.nsp,socket.handshake.session.email, ticketPermissions.canView, data.filters, data.clause, data.query, data.sortBy, data.assignType, data.mergeType);
//             // console.log("fahad",ticketsData);
//             // if (exportdata) console.log("exportdata", exportdata);
//             callback({ status: 'ok', details: [] });
//         });
//     }
//     /**
//      * @Data
//      * 	senderType: string
// 		message: string
// 		from: string
// 		to: string
// 		tid: id | Array<id>
// 		subject: string
// 		attachment: boolean
// 		filename: string
// 		link: string
//      */
//     private static GetGroupedDetails(socket, origin: SocketIO.Namespace) {
//         socket.on('getGroupeddata', async (data, callback) => {
//             let ticketsData = await Tickets.getTicketsData(data.mergedTicketIds);
//             callback({ status: 'ok', details: ticketsData });
//         });
//     }
//     private static GetTags(socket, origin: SocketIO.Namespace) {
//         socket.on('getTags', async (data, callback) => {
//             try {
//                 let result = await Tickets.getTags(data.id, socket.handshake.session.nsp);
//                 if (result && result.length) {
//                     callback({ status: 'ok', tags: result[0].tags });
//                 }
//             } catch (error) {
//                 console.log(error);
//                 console.log('error in get tags');
//                 callback({ status: 'error' });
//             }
//         });
//     }
//     private static GetTicketsByGroup(socket, origin: SocketIO.Namespace) {
//         socket.on('getTicketsByGroup', async (data, callback) => {
//             //console.log("getTicketsByGroup", data);
//             let tags = await Tickets.getTicketsByGroup(data.group_name, socket.handshake.session.nsp);
//             callback({ status: 'ok', tags: tags });
//         });
//     }
//     //reply when there is no merge scene, reply to single message id.
//     //change in watchers
//     private static ReplyTicket(socket, origin: SocketIO.Namespace) {
//         socket.on('replyTicket', async (data, callback) => {
//             try {
//                 // console.log("see ticket content", data);
//                 let sign = await Tickets.getActiveSignature(socket.handshake.session.email);
//                 if (sign && sign.length) {
//                     data.ticket.message = sign[0].header + '<br>' + data.ticket.message + '<br>' + sign[0].footer
//                 }
//                 if (data.mergedTicketIds && data.mergedTicketIds.length) {
//                     data.ticket.datetime = new Date().toISOString();
//                     let subjectForMerged = data.ticket.subject.toString();
//                     delete data.ticket.subject;
//                     data.ticket._id = new ObjectID();
//                     let ticketsData = await Tickets.getTicketsData(data.mergedTicketIds);
//                     if (ticketsData && ticketsData.length) {
//                         let messageId = await Tickets.GetMessageIdByTID(data.mergedTicketIds);
//                         let response: S3.DeleteObjectOutput | SQS.SendMessageResult | AWSError | undefined;
//                         data.ticket.nsp = socket.handshake.session.nsp;
//                         let insertMessageForMerge = await Tickets.InsertMessage(data.ticket);
//                         //console.log("merge insert", insertMessageForMerge.ops[0], insertMessageForMerge.insertedCount);
//                         let updatedTicket = await Tickets.UpdateTicketTouchedTime(data.mergedTicketIds[0], socket.handshake.session.nsp);
//                         let policy = await SLAPolicyModel.getActivatedPolicies();
//                         //if policy is not violated
//                         if (policy && policy.length && insertMessageForMerge.ops[0]) {
//                             let messageDatetime = ((new Date(insertMessageForMerge.ops[0].datetime).getTime()) * 60000);
//                             let ticketDatetime = ((new Date(data.ticket.datetime).getTime()) * 60000);
//                             let diff: number = (messageDatetime - ticketDatetime);
//                             policy.map(async pol => {
//                                 let requiredPriorityObj = pol.policyTarget.filter(obj => { return obj.priority == data.ticket.priority });
//                                 if (diff < requiredPriorityObj[0].timeResponse) {
//                                     data.ticket.slaPolicy.reminderResponse = true;
//                                     data.ticket.slaPolicy.violationResponse = true;
//                                     await Tickets.UnsetBooleanOrPushLog(data.ticket._id, data.ticket.nsp);
//                                 }
//                             })
//                         }
//                         if (insertMessageForMerge.insertedCount && updatedTicket && updatedTicket.length) {
//                             //Status SEnding
//                             callback({ status: 'ok', ticket: data.ticket });
//                             socket.to('ticketAdmin').emit('gotNewTicketMessage', {
//                                 ticket: insertMessageForMerge.ops[0],
//                                 viewState: 'READ'
//                             });
//                             updatedTicket.map(ticket => {
//                                 socket.to(ticket.group).emit('gotNewTicketMessage', {
//                                     ticket: insertMessageForMerge.ops[0],
//                                     viewState: 'READ'
//                                 });
//                             })
//                             //notification sending to assigned agent
//                             if (updatedTicket && updatedTicket.length && updatedTicket[0].assigned_to) {
//                                 let assigendTo = await SessionManager.getAgentByEmail(socket.handshake.session.nsp, updatedTicket[0].assigned_to);
//                                 if (assigendTo) {
//                                     socket.to(assigendTo._id).emit('gotNewTicketMessage', {
//                                         ticket: insertMessageForMerge.ops[0],
//                                         viewState: 'READ'
//                                     });
//                                 }
//                             }
//                             if (updatedTicket && updatedTicket.length && updatedTicket[0].watchers) {
//                                 let res = updatedTicket[0];
//                                 let watchers = await SessionManager.getOnlineWatchers(socket.handshake.session.nsp, updatedTicket[0].watchers);
//                                 if (watchers && watchers.length) {
//                                     if (res.assigned_to) watchers = watchers.filter(data => { return data != res.assigned_to })
//                                     watchers.map(watcher => {
//                                         socket.to(watcher._id).emit('gotNewTicketMessage', {
//                                             ticket: insertMessageForMerge.ops[0],
//                                             viewState: 'READ'
//                                         });
//                                     })
//                                 }
//                             }
//                             if (insertMessageForMerge && insertMessageForMerge.insertedCount) {
//                                 data.ticket.subject = subjectForMerged;
//                                 if (data.ticket.from != ticketEmail) {
//                                     //Status SENT                       
//                                     let activatedSurvey = await FeedBackSurveyModel.getActivatedSurvey();
//                                     console.log("survey", activatedSurvey);
//                                     if (activatedSurvey && activatedSurvey.length && activatedSurvey[0].sendWhen == "replies") {
//                                         console.log("templated");
//                                         response = await EmailService.SendEmail({
//                                             action: 'SendFeedbackSurveyEmail',
//                                             reply: data.ticket,
//                                             survey: activatedSurvey[0],
//                                             ticketsData: ticketsData,
//                                             nsp: socket.handshake.session.nsp.substring(1),
//                                             inReplyTo: (messageId && messageId.length) ? messageId : undefined
//                                         }, 5, true);
//                                         //   response = await EmailService.SendEmail({
//                                         //         action: 'sendEmail',
//                                         //         reply: data.ticket,
//                                         //         ticketsData: ticketsData,
//                                         //         nsp: socket.handshake.session.nsp.substring(1),
//                                         //         inReplyTo: (messageId && messageId.length) ? messageId : undefined
//                                         //     }, 5, true);
//                                     } else {
//                                         console.log("simple");
//                                         response = await EmailService.SendEmail({
//                                             action: 'sendEmail',
//                                             reply: data.ticket,
//                                             ticketsData: ticketsData,
//                                             nsp: socket.handshake.session.nsp.substring(1),
//                                             inReplyTo: (messageId && messageId.length) ? messageId : undefined
//                                         }, 5, true);
//                                     }
//                                 }
//                                 else {
//                                     // console.log("email equals");
//                                     // console.log(data.ticket.from);
//                                     // console.log(ticketEmail);
//                                     //Status SENT
//                                     response = await EmailService.SendSupportEmail({
//                                         action: 'sendSupportEmail',
//                                         reply: data.ticket,
//                                         ticketsData: ticketsData,
//                                         nsp: socket.handshake.session.nsp.substring(1),
//                                         inReplyTo: (messageId && messageId.length) ? messageId : undefined
//                                     }, 5, true);
//                                 }
//                             }
//                             else {
//                                 //Status Failed
//                                 callback({ status: 'error', ticket: data.ticket });
//                             }
//                         }
//                     } else {
//                         //Status failed
//                         callback({ status: 'error', ticket: data.ticket });
//                     }
//                 }
//                 //check if reply is within violation time, false slaenvaled flag.
//                 else {
//                     //Status failed
//                     callback({ status: 'error', ticket: data.ticket });
//                 }
//             } catch (error) {
//                 console.log(error);
//                 console.log('error in Reply Ticket');
//                 callback({ status: 'error', ticket: data.ticket });
//                 //Status Failed
//             }
//         });
//     }
//     //change in watchers
//     private static Snooze(socket, origin: SocketIO.Namespace) {
//         socket.on('snooze', async (data, callback) => {
//             console.log();
//             let result = await Tickets.Snooze(data.time, socket.handshake.session.email, data.selectedThread, socket.handshake.session.nsp, data.ticketlog);
//             if (result && result.value) {
//                 callback({ status: 'ok', snooze: result.value });
//                 socket.to('ticketAdmin').emit('updateTicketProperty', { tid: data.tid, ticket: result.value, ticketlog: data.ticketLog });
//                 socket.to(result.value.group).emit('updateTicketProperty', { tid: data.tid, ticket: result.value, ticketlog: data.ticketLog });
//                 if (result.value.assigned_to) {
//                     let assigendTo = await SessionManager.getAgentByEmail(socket.handshake.session.nsp, result.value.assigned_to);
//                     if (assigendTo) socket.to(assigendTo._id).emit('updateTicketProperty', { ticket: result.value, ticketlog: data.ticketLog });
//                 }
//                 if (result.value.watchers) {
//                     let watchers = await SessionManager.getOnlineWatchers(socket.handshake.session.nsp, result.value.watchers);
//                     if (watchers && watchers.length) {
//                         let res = result.value;
//                         if (res.assigned_to) watchers = watchers.filter(data => { return data != res.assigned_to })
//                         watchers.map(watcher => {
//                             socket.to(watcher._id).emit('updateTicketProperty', { ticket: res, ticketlog: data.ticketLog });
//                         })
//                     }
//                 }
//             }
//             else {
//                 callback({ status: 'error', msg: "No snoozeData" });
//             }
//         });
//     }
//     //change in watchers
//     private static UpdateTicketPriority(socket, origin: SocketIO.Namespace) {
//         socket.on('changeTicketPriority', async (data, callback) => {
//             try {
//                 let results = await Tickets.UpdateTicketPriority(data.ids, socket.handshake.session.nsp, data.priority, data.ticketlog);
//                 if (results && results.length) {
//                     results.map(async result => {
//                         socket.to('ticketAdmin').emit('updateTicketProperty', { tid: result._id, ticket: result, ticketlog: data.ticketlog });
//                         socket.to(result.group).emit('updateTicketProperty', { tid: result._id, ticket: result, ticketlog: data.ticketlog });
//                         if (result.assigned_to) {
//                             let assigendTo = await SessionManager.getAgentByEmail(socket.handshake.session.nsp, result.assigned_to);
//                             if (assigendTo) socket.to(assigendTo._id).emit('updateTicketProperty', { tid: result._id, ticket: result, ticketlog: data.ticketlog });
//                         }
//                         if (result.watchers && result.watchers.length) {
//                             let watchers = await SessionManager.getOnlineWatchers(socket.handshake.session.nsp, result.watchers);
//                             if (watchers && watchers.length) {
//                                 if (result.assigned_to) watchers = watchers.filter(data => { return data != result.assigned_to })
//                                 watchers.map(watcher => {
//                                     socket.to(watcher._id).emit('updateTicketProperty', { tid: data.id, ticket: result, ticketlog: data.ticketlog });
//                                 })
//                             }
//                         }
//                     })
//                     callback({ status: 'ok', msg: 'Priority Updated!', result: results });
//                 }
//                 else {
//                     callback({ status: 'error', msg: 'Unable To update priority' });
//                 }
//                 //OLD:
//                 // let result = await Tickets.UpdateTicketPriority(new ObjectID(data.id), socket.handshake.session.nsp, data.priority, data.ticketlog);
//                 //    if (result && result.value) {
//                 //                 callback({ status: 'ok', msg: 'Priority Updated!', result: result.value });
//                 //                 socket.to('ticketAdmin').emit('updateTicketProperty', { tid: data.id, ticket: result.value, ticketlog: data.ticketlog });
//                 //                 socket.to(result.value.group).emit('updateTicketProperty', { tid: data.id, ticket: result.value, ticketlog: data.ticketlog });
//                 //                 if (result.value.assigned_to) {
//                 //                     let assigendTo = await SessionManager.getAgentByEmail(socket.handshake.session.nsp, result.value.assigned_to);
//                 //                     if (assigendTo) socket.to(assigendTo._id).emit('updateTicketProperty', { tid: data.id, ticket: result.value, ticketlog: data.ticketlog });
//                 //                 }
//                 //                 if (result && result.value.watchers) {
//                 //                     let watchers = await SessionManager.getOnlineWatchers(socket.handshake.session.nsp, result.value.watchers);
//                 //                     if (watchers && watchers.length) {
//                 //                         let res = result.value;
//                 //                         if (res.assigned_to) watchers = watchers.filter(data => { return data != res.assigned_to })
//                 //                         watchers.map(watcher => {
//                 //                             socket.to(watcher._id).emit('updateTicketProperty', { tid: data.id, ticket: res, ticketlog: data.ticketlog });
//                 //                         });
//                 //                     }
//                 //                 }
//                 // }
//             }
//             catch (error) {
//                 console.log(error);
//                 console.log('Error in Changing Ticket priority');
//             }
//         });
//     }
//     private static UpdateTicketGroup(socket, origin: SocketIO.Namespace) {
//         socket.on('changeGroup', async (data, callback) => {
//             try {
//                 let results = await Tickets.UpdateTicketGroup(data.ids, socket.handshake.session.nsp, data.group, data.ticketlog);
//                 if (results && results.length) {
//                     results.map(async ticket => {
//                         callback({ status: 'ok', result: ticket });
//                         if (origin['settings']['emailNotifications']['tickets'].assignToGroup) {
//                             let groupAdmins = await TicketGroupsModel.GetGroupAdmins(socket.handshake.session.nsp, ticket.group);
//                             if (ticket.watchers && ticket.watchers.length) {
//                                 if (groupAdmins && groupAdmins.length) groupAdmins = groupAdmins.concat(ticket.watchers);
//                                 else groupAdmins = ticket.watchers
//                                 if (groupAdmins && groupAdmins.length) {
//                                     groupAdmins = groupAdmins.filter((item, pos) => {
//                                         if (groupAdmins && groupAdmins.length) return groupAdmins.indexOf(item) == pos;
//                                     })
//                                 }
//                             }
//                             if (groupAdmins && groupAdmins.length) {
//                                 let msg = '<span><b>ID: </b>' + ticket._id + '<br>'
//                                     + '<span><b>Group: </b> ' + ticket.group + '<br>'
//                                     + '<span><b>Assigned by: </b> ' + socket.handshake.session.email + '<br>'
//                                     + '<span><b>Link: </b> https://app.beelinks.solutions/tickets/ticket-view/' + ticket._id + '<br>';
//                                 let obj = {
//                                     action: 'sendNoReplyEmail',
//                                     to: groupAdmins,
//                                     subject: 'Group assigned to Ticket #' + ticket._id,
//                                     message: msg,
//                                     html: msg,
//                                     type: 'newTicket'
//                                 }
//                                 let response = EmailService.SendNoReplyEmail(obj, false);
//                             }
//                         }
//                         origin.to('ticketAdmin').emit('updateTicket', { tid: ticket._id, ticket: ticket, email: ticket.assigned_to });
//                         if (ticket.assigned_to) {
//                             let agent = await SessionManager.getAgentByEmail(socket.handshake.session.nsp, ticket.assigned_to);
//                             if (agent) {
//                                 origin.to(agent._id).emit('updateTicket', { tid: ticket._id, ticket: ticket, email: ticket.assigned_to });
//                             }
//                         }
//                         if (ticket.watchers) {
//                             let watchers = await SessionManager.getOnlineWatchers(socket.handshake.session.nsp, ticket.watchers);
//                             if (watchers && watchers.length) {
//                                 watchers = watchers.filter(data => { return data != ticket.assigned_to })
//                                 if (watchers && watchers.length) {
//                                     watchers = watchers.filter(data => { return data != ticket.assigned_to })
//                                     watchers.map(watcher => {
//                                         origin.to(watcher._id).emit('updateTicket', { tid: ticket._id, ticket: ticket, email: ticket.assigned_to });
//                                     });
//                                 }
//                             }
//                             origin.to(data.previousGroup).emit('removeTicket', { tid: ticket._id, ticket: ticket, email: ticket.assigned_to });
//                             origin.to(ticket.group).emit('newTicket', { ticket: ticket, ignoreAdmin: false });
//                         }
//                         else {
//                             callback({ status: 'error', msg: 'Unable To update group' });
//                         }
//                     })
//                 }
//             } catch (error) {
//                 console.log(error);
//                 console.log('Error in Changing Ticket group');
//             }
//         });
//     }
//     private static async autoforward(socket, origin: SocketIO.Namespace) {
//         socket.on('autoforward', async (data, callback) => {
//             try {
//                 console.log("autoforward data", data);
//                 let result = await Tickets.AutoForward(data.domainEmail, data.incomingEmail, data.group, data.name, socket.handshake.session.nsp);
//                 //console.log(result);
//                 if (result && result.insertedCount) {
//                     //console.log(result);
//                     callback({ status: 'ok', msg: 'Incoming Email of Agent Added!' });
//                 }
//                 else {
//                     callback({ status: 'error', msg: 'Unable To add external agents' });
//                 }
//             }
//             catch (error) {
//                 console.log(error);
//                 console.log('Error in adding external agents');
//             }
//         });
//     }
//     private static async ToggleExternalRuleset(socket, origin: SocketIO.Namespace) {
//         socket.on('toggleExternalRuleset', async (data, callback) => {
//             try {
//                 let result = await Tickets.ToggleExternalRuleset(data.id, data.value);
//                 //console.log(result);
//                 if (result && result.value) {
//                     //console.log(result);
//                     callback({ status: 'ok', msg: 'External ruleset toggled ' + ((data.value) ? 'on' : 'off') + ' for ' + result.value.domainEmail + '!' });
//                 }
//                 else {
//                     callback({ status: 'error', msg: 'Unable To add external agents' });
//                 }
//             }
//             catch (error) {
//                 console.log(error);
//                 console.log('Error in adding external agents');
//             }
//         });
//     }
//     private static async ToggleUseOriginalEmail(socket, origin: SocketIO.Namespace) {
//         socket.on('toggleUseOriginalEmail', async (data, callback) => {
//             try {
//                 let result = await Tickets.ToggleUseOriginalEmail(data.id, data.value);
//                 //console.log(result);
//                 if (result && result.value) {
//                     //console.log(result);
//                     callback({ status: 'ok', msg: ((data.value) ? 'Enabled' : 'Disabled') + ' sending from original email!' });
//                 }
//                 else {
//                     callback({ status: 'error', msg: 'Unable to toggle the use of original email!' });
//                 }
//             }
//             catch (error) {
//                 console.log(error);
//                 console.log('Error in adding external agents');
//             }
//         });
//     }
//     private static updateIncomingId(socket, origin: SocketIO.Namespace) {
//         socket.on('updateIncomingId', async (data, callback) => {
//             try {
//                 //console.log(data.emailId);
//                 let updatedemail_data = await Tickets.UpdateIncomingEmailId(data.emailId, data.domainEmail, data.incomingEmail, data.name, data.group, socket.handshake.session.nsp);
//                 if (updatedemail_data && updatedemail_data.value) {
//                     //console.log(updatedemail_data.value);
//                     callback({ status: 'ok', Updateddata: updatedemail_data.value });
//                 } else {
//                     callback({ status: 'error', msg: 'No incoming emails deleted!' });
//                 }
//             } catch (error) {
//                 console.log(error);
//             }
//         });
//     }
//     private static deleteIncomingId(socket, origin: SocketIO.Namespace) {
//         socket.on('deleteIncomingId', async (data, callback) => {
//             try {
//                 //console.log(data.emailId);
//                 let deletedemail_data = await Tickets.DeleteIncomingEmailId(data.emailId, socket.handshake.session.nsp);
//                 if (deletedemail_data) {
//                     // console.log(deletedemail_data);
//                     let packet = {
//                         action: 'RemoveIdentity',
//                         email: data.email
//                     }
//                     EmailService.SendNoReplyEmail(packet, true);
//                     callback({ status: 'ok', msg: "Incoming Email Deleted" });
//                 } else {
//                     callback({ status: 'error', msg: 'No incoming emails deleted!' });
//                 }
//             } catch (error) {
//                 console.log(error);
//             }
//         });
//     }
//     private static sendActivation(socket, origin: SocketIO.Namespace) {
//         socket.on('sendActivation', async (data, callback) => {
//             try {
//                 let id = new ObjectID();
//                 id.toString()
//                 let token: TokenSchema = {
//                     email: data.emailId,
//                     expiryDate: new Date(new Date().getTime() + 60 * 60 * 24 * 1000).toISOString(),
//                     id: id.toHexString(),
//                     type: 'emailActivation'
//                 }
//                 Tokens.inserToken(token);
//                 if (origin['settings']['emailNotifications']['tickets'].userActEmail) {
//                     await EmailService.SendActivationEmail({ to: data.emailId, subject: 'Activation Email', message: 'https://app.beelinks.solutions/agent/activation/' + token.id });
//                     callback({ status: 'ok', msg: "Activation Email Sent" });
//                 }
//                 callback({ status: 'ok', msg: "Activation Email Notification Disabled" });
//             } catch (error) {
//                 console.log(error);
//             }
//         });
//     }
//     private static SendIdentityVerificationEmail(socket, origin: SocketIO.Namespace) {
//         socket.on('sendIdentityVerificationEmail', async (data, callback) => {
//             try {
//                 if (data.email) {
//                     let exists = await EmailActivations.checkEmailIfAlreadySent(data.email);
//                     if (exists && exists.length) {
//                         callback({ status: 'error', msg: "Identitity Verification has been sent already please verify!" });
//                     } else {
//                         let packet = {
//                             action: 'IdentityVerification',
//                             email: data.email
//                         }
//                         await EmailService.SendNoReplyEmail(packet, true);
//                         callback({ status: 'ok', msg: "Identitity Verification Email Sent!" });
//                     }
//                 }
//             } catch (error) {
//                 console.log(error);
//             }
//         });
//     }
//     private static getIncomingEmails(socket, origin: SocketIO.Namespace) {
//         socket.on('getIncomingEmails', async (data, callback) => {
//             try {
//                 let email_data = await Tickets.GetIncomingEmails(data.email);
//                 if (email_data && email_data.length) {
//                     console.log(email_data);
//                     callback({ status: 'ok', email_data: email_data });
//                 } else {
//                     callback({ status: 'error', msg: 'No incoming emails found!' });
//                 }
//             } catch (error) {
//                 console.log(error);
//             }
//         });
//     }
//     private static getIncomingEmailsByNSP(socket, origin: SocketIO.Namespace) {
//         socket.on('getIncomingEmailsByNSP', async (data, callback) => {
//             try {
//                 let email_data = await Tickets.GetIncomingEmailsByNSP(socket.handshake.session.nsp);
//                 if (email_data) {
//                     // console.log(email_data);
//                     callback({ status: 'ok', email_data: email_data });
//                 } else {
//                     callback({ status: 'error', msg: 'No incoming emails by nsp found!' });
//                 }
//             } catch (error) {
//                 console.log(error);
//             }
//         });
//     }
//     /**
//      * 
//      * @Data :
//      * 1. tids : Array<string>
//      * 2. state : string
//      * 3. ticketLog : Object
//      */
//     //Change in watchers:
//     private static ChangeTicketState(socket, origin: SocketIO.Namespace) {
//         socket.on('changeTicketState', async (data, callback) => {
//             try {
//                 console.log('Changing State');
//                 // let datetime = new Date().toISOString();
//                 let results = await Tickets.UpdateTicket(data.tids, socket.handshake.session.nsp, data.ticketlog, data.state);
//                 let lasttouchedTime = new Date().toISOString();
//                 // if (results) console.log(results == data.tids.length);
//                 if (results && results.length) {
//                     let survey = await FeedBackSurveyModel.getActivatedSurvey();
//                     let getMessageById = await Tickets.getMessagesByTicketId(data.tids);
//                     //survey form work-->keeping it separate because not important that sendwhen is solved all the time.
//                     if (data.state == 'SOLVED' && survey && survey.length && survey[0].sendWhen == 'solved' && getMessageById && getMessageById.length) {
//                         let message = 'This is to inform you that Ticket is SOLVED sucessfully, if you find some ambiguity in SOLVED ticket, reply back to this thread. Kindly took out some moment to fill survey form following';
//                         getMessageById.map(data => {
//                             EmailService.SendEmail({
//                                 action: 'StateChangedFeedbackSurvey',
//                                 survey: survey && survey.length ? survey[0] : [],
//                                 ticket: results,
//                                 reply: data.to[0],
//                                 message: message
//                             }, 5, true);
//                         })
//                     }
//                     if (data.state == 'CLOSED' && survey && survey.length && survey[0].sendWhen == 'closed' && getMessageById && getMessageById.length) {
//                         let message = 'This is to inform you that Ticket is CLOSED sucessfully, if you find some ambiguity in CLOSED ticket, reply back to this thread. Kindly took out some moment to fill survey form following';
//                         getMessageById.map(data => {
//                             EmailService.SendEmail({
//                                 action: 'StateChangedFeedbackSurvey',
//                                 survey: survey && survey.length ? survey[0] : [],
//                                 ticket: results,
//                                 reply: data.to[0],
//                                 message: message
//                             }, 5, true);
//                         })
//                     }
//                     //Checking SLA Policy over changing state.
//                     if (data.state == 'SOLVED') {
//                         let ticketSolved = await Tickets.TicketSolved(data.tids, lasttouchedTime, socket.handshake.session.email);
//                         //bulk solved possible so map through policy and solved ticket, match priorities, check its set resolution time and then 
//                         //compare with it and send email email after 'n' minutes given in policy.
//                         await this.ApplyPolicy(ticketSolved);
//                         // else {
//                         //     console.log("ticket not solved yet,solved date not found");
//                         //     // return;
//                         // }
//                     }
//                     results.map(async result => {
//                         socket.to('ticketAdmin').emit('updateTicketProperty', { tid: result._id, ticket: result, ticketlog: data.ticketlog });
//                         socket.to(result.group).emit('updateTicketProperty', { tid: result._id, ticket: result, ticketlog: data.ticketlog });
//                         if (result.assigned_to) {
//                             let assigendTo = await SessionManager.getAgentByEmail(socket.handshake.session.nsp, result.assigned_to);
//                             if (assigendTo) socket.to(assigendTo._id).emit('updateTicketProperty', { tid: result.id, ticket: result, ticketlog: data.ticketlog });
//                             // if (result.state == 'SOLVED') TagsModel.UpdateAgentTicketCount(result.assigned_to, result.tag, socket.handshake.session.nsp, false);
//                         }
//                         if (result.watchers) {
//                             let watchers = await SessionManager.getOnlineWatchers(socket.handshake.session.nsp, result.watchers);
//                             if (watchers && watchers.length) {
//                                 if (result.assigned_to) watchers = watchers.filter(data => { return data != result.assigned_to })
//                                 watchers.map(watcher => {
//                                     socket.to(watcher._id).emit('updateTicketProperty', { tid: result._id, ticket: result, ticketlog: data.ticketlog });
//                                 })
//                             }
//                         }
//                     })
//                     callback({ status: 'ok', ticketlog: data.ticketlog });
//                 } else {
//                     callback({ status: 'error' });
//                 }
//             } catch (error) {
//                 console.log(error);
//                 console.log('Error in Change Ticket State');
//             }
//         });
//     }
//     /**
//      * 
//      * @param Data
//      * 1. tid : <string>
//      * 2. name : <string>
//      * 3. value : <string> 
//      */
//     public static UpdateDynamicProperty(socket, origin: SocketIO.Namespace) {
//         socket.on('updateDynamicProperty', async (data, callback) => {
//             try {
//                 // console.log(data);
//                 let ticketlog : TicketLogSchema = {
//                     title: "Dynamic field '"+ data.name + "' updated to",
//                     status: data.value,
//                     updated_by: socket.handshake.session.email,
//                     user_type: 'Agent',
//                     time_stamp: new Date().toISOString()
//                 }
//                 let result = await Tickets.UpdateDynamicProperty(data.tid, data.name, data.value, ticketlog);
//                 if (result) callback({ status: 'ok', result: result.value })
//                 else callback({ status: 'error' });
//             } catch (error) {
//                 console.log(error);
//                 console.log('error in Updating Dynamic Property');
//                 callback({ status: 'error' });
//             }
//         })
//     }
//     private static async ApplyPolicy(ticketSolved) {
//         console.log(ticketSolved)
//         let policies = await SLAPolicyModel.getActivatedPolicies();
//         let currentDatetime = ((new Date().getTime()) * 60000);
//         if (ticketSolved && ticketSolved.length) {
//             ticketSolved.map(solve => {
//                 let solvedDatetime = ((new Date(solve.solved_date).getTime()) * 60000);
//                 let ticketDatetime = ((new Date(solve.datetime).getTime()) * 60000);
//                 let diffForSolved = solvedDatetime - ticketDatetime;
//                 if (policies && policies.length) {
//                     policies.map(async active => {
//                         let requiredPriorityObj = active.policyTarget.filter(obj => { return obj.priority == solve.priority });
//                         console.log("requiredPriorityObj", requiredPriorityObj);
//                         //VIOLATION OF RESOLUTION
//                         if (!solve.slaPolicy.violationResolution && active.violationResolution && active.violationResolution.length && active.violationResponse[0].time && diffForSolved && (diffForSolved > requiredPriorityObj[0].timeResolved)) { //base case..
//                             if ((solvedDatetime + active.violationResolution[0].time) > currentDatetime) {
//                                 console.log("send email because violated resolution time");
//                                 console.log(active.violationResolution);
//                                 active.violationResolution.map(async (violate, ind) => {
//                                     //send email after n minutes:
//                                     if (currentDatetime - (solvedDatetime + violate.time) > 0) {
//                                         let ticketLog: TicketLogSchema = {
//                                             time_stamp: new Date().toISOString(),
//                                             status: `violation of resolution step #` + ind + 1,
//                                             title: `Escalation email for resolution sent as per policy`,
//                                             updated_by: 'Beelinks',
//                                             user_type: 'Beelinks Scheduler'
//                                         }
//                                         solve.slaPolicy.violationResolution = true;
//                                         let result = await Tickets.SetViolationTime(solve._id, solve.nsp, ticketLog);
//                                         if (result && (!result.ok || !result.value)) {
//                                             console.log('unsetting and pushing log failed of ' + solve._id);
//                                         }
//                                         if (requiredPriorityObj[0].emailActivationEscalation) {
//                                             //sending emails heirarchy..
//                                             let obj = {
//                                                 action: 'sendNoReplyEmail',
//                                                 to: this.SendEmailTo(violate.notifyTo, solve),
//                                                 subject: 'Escalation Email for Resolution of Ticket :  ' + solve._id + ' having priority ' + solve.priority,
//                                                 message: `Hello Agent,  
//                                                     \n
//                                                     Just wanted to let you know that your time to resolve the ticket ${solve._id} is escalated. 
//                                                     \n
//                                                     Ticket Subject : ${solve.subject} 
//                                                     \n
//                                                     You can check the activity on https://app.beelinks.solutions/tickets
//                                                     \n
//                                                     Regards,
//                                                     Beelinks Team`,
//                                                 html: `Hello Agent, 
//                                                     <br>
//                                                     Just wanted to let you know that your time to resolve the ticket ${solve._id} is escalated. 
//                                                     <br>
//                                                     Ticket Subject : ${solve.subject} 
//                                                     <br>
//                                                     You can check the activity on <a href="https://app.beelinks.solutions/tickets/ticket-view/${solve._id}">Beelinks Ticket</a>
//                                                     <br>
//                                                     Regards,
//                                                     <br>
//                                                     Beelinks Team
//                                                     `
//                                             }
//                                             let response = EmailService.SendNoReplyEmail(obj, false);
//                                             if (response) {
//                                                 console.log("violation resolution email sent");
//                                             } else {
//                                                 console.log('Email Delivery Failed For escalation');
//                                             }
//                                         }
//                                     }
//                                     // else {
//                                     //     console.log("condition not matched!");
//                                     //     return;
//                                     // }
//                                 })
//                             }
//                         }
//                         else {
//                             console.log("not send email, resolution not violated.");
//                             return;
//                         }
//                     })
//                 }
//                 else {
//                     console.log("no activated policies!");
//                     return;
//                 }
//             });
//         }
//     }
//     private static SendEmailTo(to, ticket) {
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
//         return arr;
//     }
//     private static deleteNote(socket, origin: SocketIO.Namespace) {
//         socket.on('deleteNote', async (data, callback) => {
//             try {
//                 //console.log("note", data.id, data.note);
//                 let ticketLog: TicketLogSchema = {
//                     time_stamp: new Date().toISOString(),
//                     status: `note`,
//                     title: `note deleted `,
//                     updated_by: socket.handshake.session.email,
//                     user_type: 'Agent'
//                 }
//                 let result = await Tickets.deleteNote(data.id, data.noteId, ticketLog);
//                 if (result && result.value) {
//                     // console.log("deleted", deletedresult);
//                     callback({ status: 'ok', deletedresult: result.value.ticketNotes });
//                     socket.to('ticketAdmin').emit('updateTicketProperty', { tid: data.tid, ticket: result.value, ticketlog: ticketLog });
//                     socket.to(result.value.group).emit('updateTicketProperty', { tid: data.tid, ticket: result.value, ticketlog: ticketLog });
//                     if (result.value.assigned_to) {
//                         let assigendTo = await SessionManager.getAgentByEmail(socket.handshake.session.nsp, result.value.assigned_to);
//                         if (assigendTo) socket.to(assigendTo._id).emit('updateTicketProperty', { tid: data.id, ticket: result.value, ticketlog: ticketLog });
//                     }
//                     if (result.value.watchers) {
//                         let res = result.value;
//                         let watchers = await SessionManager.getOnlineWatchers(socket.handshake.session.nsp, result.value.watchers);
//                         if (watchers && watchers.length) {
//                             if (res.assigned_to) watchers = watchers.filter(data => { return data != res.assigned_to })
//                             watchers.map(watcher => {
//                                 socket.to(watcher._id).emit('updateTicketProperty', { tid: data.id, ticket: res, ticketlog: ticketLog });
//                             })
//                         }
//                     }
//                 } else {
//                     callback({ status: 'error', msg: 'could not delete note' });
//                 }
//             } catch (error) {
//                 console.log(error);
//                 console.log('Error in deleting note');
//             }
//         });
//     }
//     //Change in watchers
//     private static deleteTask(socket, origin: SocketIO.Namespace) {
//         socket.on('deleteTask', async (data, callback) => {
//             try {
//                 let result = await Tickets.deleteTask(data.tid, data.id);
//                 if (result && result.value) {
//                     callback({ status: 'ok', deletedresult: result.value });
//                     socket.to('ticketAdmin').emit('updateTicketProperty', { tid: data.tid, ticket: result.value });
//                     socket.to(result.value.group).emit('updateTicketProperty', { tid: data.tid, ticket: result.value });
//                     if (result.value.assigned_to) {
//                         let assigendTo = await SessionManager.getAgentByEmail(socket.handshake.session.nsp, result.value.assigned_to);
//                         if (assigendTo) socket.to(assigendTo._id).emit('updateTicketProperty', { tid: data.tid, ticket: result.value });
//                     }
//                     if (result.value.watchers) {
//                         let res = result.value;
//                         let watchers = await SessionManager.getOnlineWatchers(socket.handshake.session.nsp, result.value.watchers);
//                         if (watchers && watchers.length) {
//                             if (res.assigned_to) watchers = watchers.filter(data => { return data != res.assigned_to })
//                             watchers.map(watcher => {
//                                 socket.to(watcher._id).emit('updateTicketProperty', { tid: data.tid, ticket: res });
//                             })
//                         }
//                     }
//                 } else {
//                     callback({ status: 'error', msg: 'could not delete tasks' });
//                 }
//             } catch (error) {
//                 console.log(error);
//                 console.log('Error in deleting Tasks');
//             }
//         });
//     }
//     //change in watchers
//     private static addTask(socket, origin: SocketIO.Namespace) {
//         socket.on('addTask', async (data, callback) => {
//             try {
//                 data.task.id = new ObjectID();
//                 data.task.datetime = new Date();
//                 console.log("todo", data.task)
//                 let results = await Tickets.addTask(data.tid, socket.handshake.session.nsp, data.task, data.ticketlog);
//                 //NEW
//                 if (results && results.length) {
//                     results.map(async result => {
//                         callback({ status: 'ok', result: result });
//                         socket.to('ticketAdmin').emit('updateTicketProperty', { tid: data.tid, ticket: result.value, ticketlog: data.ticketlog });
//                         socket.to(result.group).emit('updateTicketProperty', { tid: data.tid, ticket: result, ticketlog: data.ticketlog });
//                         if (result.assigned_to) {
//                             let assigendTo = await SessionManager.getAgentByEmail(socket.handshake.session.nsp, result.assigned_to);
//                             if (assigendTo) socket.to(assigendTo._id).emit('updateTicketProperty', { tid: data.tid, ticket: result, ticketlog: data.ticketlog });
//                         }
//                         if (result.watchers) {
//                             let watchers = await SessionManager.getOnlineWatchers(socket.handshake.session.nsp, result.watchers);
//                             if (watchers && watchers.length) {
//                                 if (result.assigned_to) watchers = watchers.filter(data => { return data != result.assigned_to })
//                                 watchers.map(watcher => {
//                                     socket.to(watcher._id).emit('updateTicketProperty', { tid: data.tid, ticket: result, ticketlog: data.ticketlog });
//                                 })
//                             }
//                         }
//                     })
//                 }
//                 //OLD
//                 // if (result && result.value) {
//                 //     console.log(result.value);
//                 //     callback({ status: 'ok', task: result.value.todo, ticketlog: result.value.ticketlog });
//                 //     socket.to('ticketAdmin').emit('updateTicketProperty', { tid: data.tid, ticket: result.value, ticketlog: data.ticketlog });
//                 //     socket.to(result.value.group).emit('updateTicketProperty', { tid: data.tid, ticket: result.value, ticketlog: data.ticketlog });
//                 //     if (result.value.assigned_to) {
//                 //         let assigendTo = await SessionManager.getAgentByEmail(socket.handshake.session.nsp, result.value.assigned_to);
//                 //         if (assigendTo) socket.to(assigendTo._id).emit('updateTicketProperty', { tid: data.tid, ticket: result.value, ticketlog: data.ticketlog });
//                 //     }
//                 //     if (result.value.watchers) {
//                 //         let res = result.value;
//                 //         let watchers = await SessionManager.getOnlineWatchers(socket.handshake.session.nsp, result.value.watchers);
//                 //         if (watchers && watchers.length) {
//                 //             if (res.assigned_to) watchers = watchers.filter(data => { return data != res.assigned_to })
//                 //             watchers.map(watcher => {
//                 //                 socket.to(watcher._id).emit('updateTicketProperty', { tid: data.tid, ticket: res, ticketlog: data.ticketlog });
//                 //             })
//                 //         }
//                 //     }
//                 // }
//             } catch (error) {
//                 console.log(error);
//                 console.log('Error in Adding Tasks');
//             }
//         });
//     }
//     /**
//      * 
//      * @Date
//      * 1. tids : Array<string>
//      * 2. tags : Array<string>
//      * 3. ticketlog : Object<TicketLogSchema>
//      */
//     //change in watchers
//     private static addTags(socket, origin: SocketIO.Namespace) {
//         socket.on('addTags', async (data, callback) => {
//             try {
//                 let result = await Tickets.addTag(data.tids, socket.handshake.session.nsp, data.tag, data.ticketlog);
//                 if (result && result.length) {
//                     callback({ status: 'ok' });
//                     result.map(async ticket => {
//                         socket.to('ticketAdmin').emit('updateTicketProperty', { tid: ticket._id, ticket: ticket, ticketlog: data.ticketlog });
//                         socket.to(ticket.group).emit('updateTicketProperty', { tid: ticket._id, ticket: ticket, ticketlog: data.ticketlog });
//                         if (ticket.assigned_to) {
//                             let assigendTo = await SessionManager.getAgentByEmail(socket.handshake.session.nsp, ticket.assigned_to);
//                             if (assigendTo) socket.to(assigendTo._id).emit('updateTicketProperty', { tid: ticket._id, ticket: ticket, ticketlog: data.ticketlog });
//                         }
//                         if (ticket.watchers) {
//                             let watchers = await SessionManager.getOnlineWatchers(socket.handshake.session.nsp, ticket.watchers);
//                             if (watchers && watchers.length) {
//                                 if (ticket.assigned_to) watchers = watchers.filter(data => { return data != ticket.assigned_to })
//                                 watchers.map(watcher => {
//                                     socket.to(watcher._id).emit('updateTicketProperty', { tid: ticket._id, ticket: ticket, ticketlog: data.ticketlog });
//                                 })
//                             }
//                         }
//                     });
//                 } else {
//                     callback({ status: 'error' });
//                 }
//             } catch (error) {
//                 console.log(error);
//                 console.log('Error in Adding Tags');
//             }
//         });
//     }
//     //change in watchers
//     private static deleteTagTicket(socket, origin: SocketIO.Namespace) {
//         socket.on('deleteTagTicket', async (data, callback) => {
//             try {
//                 let result = await Tickets.deleteTag(data.tid, socket.handshake.session.nsp, data.tag);
//                 if (result && result.value) {
//                     callback({ status: 'ok', deletedresult: result.value });
//                     socket.to('ticketAdmin').emit('updateTicketProperty', { tid: data.tid, ticket: result.value });
//                     socket.to(result.value.group).emit('updateTicketProperty', { tid: data.tid, ticket: result.value });
//                     if (result.value.assigned_to) {
//                         let assigendTo = await SessionManager.getAgentByEmail(socket.handshake.session.nsp, result.value.assigned_to);
//                         if (assigendTo) socket.to(assigendTo._id).emit('updateTicketProperty', { tid: data.tid, ticket: result.value });
//                     }
//                     if (result.value.watchers) {
//                         let res = result.value;
//                         let watchers = await SessionManager.getOnlineWatchers(socket.handshake.session.nsp, result.value.watchers);
//                         if (watchers && watchers.length) {
//                             if (res.assigned_to) watchers = watchers.filter(data => { return data != res.assigned_to })
//                             watchers.map(watcher => {
//                                 socket.to(watcher._id).emit('updateTicketProperty', { tid: data.tid, ticket: res });
//                             })
//                         }
//                     }
//                 } else {
//                     callback({ status: 'error', msg: 'could not delete tag' });
//                 }
//             } catch (error) {
//                 console.log(error);
//                 console.log('Error in Adding Tags');
//             }
//         });
//     }
//     private static getcount(socket, origin: SocketIO.Namespace) {
//         socket.on('getcount', async (data, callback) => {
//             //console.log(data.agents);
//             try {
//                 let res = await Tickets.getcount(data.agents);
//                 if (res) {
//                     // console.log(res);
//                     callback({ status: 'ok', res: res })
//                 }
//             } catch (error) {
//                 console.log(error);
//                 console.log('Error in Assigning agent');
//             }
//         });
//     }
//     // private static bulkTagAssign(socket, origin: SocketIO.Namespace) {
//     //     socket.on('bulkTagAssign', async (data, callback) => {
//     //         try {
//     //             //console.log("in event", data.TagToAssign);
//     //             let assignedTag = await Tickets.BulkTagAssign(data.Bulkids, data.TagToAssign, data.ticketlog);
//     //             if (assignedTag && assignedTag.length) {
//     //                 //console.log(assignedTag);
//     //                 callback({ status: 'ok', ticket_data: assignedTag });
//     //             }
//     //             else {
//     //                 callback({ status: 'error' });
//     //             }
//     //         } catch (error) {
//     //             console.log(error);
//     //             console.log('Error in bulk Assigning tag');
//     //         }
//     //     })
//     // }
//     /**
//      * 
//      * @Data
//      * 1. tids Array<string>
//      * 2. agent_email : string
//      * 3. previousAgentEmail : string
//      * 4. ticketlog : Object<TicklogSchema>
//      */
//     //change in watchers
//     private static AssignAgentForTicket(socket, origin: SocketIO.Namespace) {
//         socket.on('assignAgentForTicket', async (data, callback) => {
//             // console.log(data);
//             try {
//                 let datetime = new Date().toISOString();
//                 let promises: any;
//                 //console.log(data);
//                 promises = await Promise.all([
//                     SessionManager.getAgentByEmail(socket.handshake.session.nsp, data.agent_email),
//                     Tickets.AssignAgent(data.tids, socket.handshake.session.nsp, data.agent_email, data.ticketlog),
//                 ]);
//                 let assign_Agent = promises[0];
//                 let result = promises[1];
//                 //console.log(result);
//                 if (!result.length) callback({ status: 'error' });
//                 else {
//                     /**
//                      * @Callback_Data
//                      * 1. Array<TicketsSchema>
//                      * 2. dateTime : ISOSTRING
//                      */
//                     result.map(async ticket => {
//                         callback({ status: 'ok', ticket_data: ticket });
//                         if (ticket.previousAgent) {
//                             let previousAgent = await SessionManager.getAgentByEmail(socket.handshake.session.nsp, ticket.previousAgent);
//                             // console.log(previousAgent.email);
//                             if (previousAgent) {
//                                 switch (previousAgent.permissions.tickets.canView) {
//                                     case 'assignedOnly':
//                                         origin.to(previousAgent._id).emit('removeTicket', { tid: ticket._id, ticket: ticket });
//                                         break;
//                                     case 'group':
//                                         //check if group admin
//                                         //If no them emit 
//                                         if ((ticket.group && !previousAgent.groups.includes(ticket.group)) || !ticket.group) {
//                                             origin.to(previousAgent._id).emit('removeTicket', { tid: ticket._id, ticket: ticket });
//                                         }
//                                         break;
//                                     // case 'team':
//                                     //     let agents = await TeamsModel.getTeamMembersAgainstAgent(socket.handshake.session.nsp, previousAgent.email);
//                                     //     if(agents && assign_Agent && !agents.includes(data.agent_email)){
//                                     //         agents.teams.forEach(team => {
//                                     //             socket.to(team).emit('removeTicket', { tid: ticket._id, ticket: ticket });
//                                     //         });
//                                     //     }
//                                     // let teams = socket.handshake.session.teams;
//                                     // if(teams && teams.length){
//                                     //     teams.forEach(team => {
//                                     //         origin.to
//                                     //     });
//                                     // }
//                                     // break;
//                                     default:
//                                         break;
//                                 }
//                                 // let agents = await TeamsModel.getTeamMembersAgainstAgent(socket.handshake.session.nsp, previousAgent.email);
//                                 // console.log(agents);
//                                 // if(agents && assign_Agent && !agents.includes(data.agent_email)){
//                                 //     console.log('Remove Ticket!');
//                                 //     agents.teams.forEach(team => {
//                                 //         socket.to(team).emit('removeTicket', { tid: ticket._id, ticket: ticket });
//                                 //     });
//                                 // }                            
//                             }
//                             //Emit to Teams for remove ticket
//                             let teamsOfPreviousAgent = await TeamsModel.getTeamsAgainstAgent(ticket.nsp, ticket.previousAgent);
//                             teamsOfPreviousAgent.forEach(team => {
//                                 console.log('Remove Ticket: ' + team);
//                                 socket.to(team).emit('removeTicket', { tid: ticket._id, ticket: ticket });
//                             })
//                         }
//                         socket.to('ticketAdmin').emit('updateTicketProperty', { tid: ticket._id, ticket: ticket, ticketlog: data.ticketlog });
//                         socket.to(ticket.group).emit('updateTicketProperty', { tid: ticket._id, ticket: ticket, ticketlog: data.ticketlog });
//                         if (assign_Agent) {
//                             // console.log('Assigned Agent: ' + assign_Agent.email);
//                             if (assign_Agent.permissions.tickets.canView == 'assignedOnly') {
//                                 socket.to(assign_Agent._id).emit('newTicket', { ticket: ticket, ignoreAdmin: false });
//                             }
//                         }
//                         if (ticket.watchers) {
//                             let watchers = await SessionManager.getOnlineWatchers(socket.handshake.session.nsp, ticket.watchers);
//                             if (watchers && watchers.length) {
//                                 if (ticket.assigned_to) watchers = watchers.filter(data => { return data != ticket.assigned_to })
//                                 watchers.map(watcher => {
//                                     socket.to(watcher._id).emit('updateTicketProperty', { tid: ticket._id, ticket: ticket, ticketlog: data.ticketlog });
//                                 })
//                             }
//                         }
//                         //Emit to Teams for new ticket
//                         let recipients = Array();
//                         if (ticket.assigned_to) {
//                             let EmailRecipients = Array();
//                             let res = await Tickets.getWatchers(ticket._id, socket.handshake.session.nsp);
//                             if (res && res.length) {
//                                 EmailRecipients = EmailRecipients.concat(res[0].watchers);
//                             }
//                             EmailRecipients.push(ticket.assigned_to);
//                             recipients = EmailRecipients.filter((item, pos) => {
//                                 return EmailRecipients.indexOf(item) == pos;
//                             })
//                             let teams = await TeamsModel.getTeamsAgainstAgent(ticket.nsp, ticket.assigned_to);
//                             teams.forEach(team => {
//                                 // console.log('New Ticket: ' + team);
//                                 socket.to(team).emit('newTicket', { ticket: ticket, ignoreAdmin: false });
//                             });
//                         }
//                         if (origin['settings']['emailNotifications']['tickets'].assignToAgent) {
//                             let recipients = Array();
//                             recipients.push(ticket.assigned_to);
//                             if (ticket.watchers && ticket.watchers.length) {
//                                 recipients = recipients.concat(ticket.watchers);
//                                 recipients = recipients.filter((item, pos) => {
//                                     if (recipients && recipients.length) return recipients.indexOf(item) == pos;
//                                 })
//                             }
//                             // console.log('recipients',recipients);
//                             let msg = '<span><b>ID: </b>' + ticket._id + '<br>'
//                                 + '<span><b>Assigned by: </b>' + socket.handshake.session.email + '<br>'
//                                 + '<span><b>Link: </b> https://app.beelinks.solutions/tickets/ticket-view/' + ticket._id + '<br>';
//                             if (recipients && recipients.length) {
//                                 let response = await EmailService.NotifyAgentForTicket({
//                                     ticket: ticket,
//                                     subject: ticket.subject,
//                                     nsp: socket.handshake.session.nsp.substring(1),
//                                     to: recipients,
//                                     msg: msg
//                                 });
//                                 if (response && !response.MessageId) {
//                                     console.log('Email SEnding TO Agent When Assigning Failed');
//                                 }
//                             }
//                         }
//                     })
//                 }
//             } catch (error) {
//                 console.log(error);
//                 console.log('Error in Assigning agent');
//             }
//         });
//     }
//     //change in watchers
//     private static UpdateViewState(socket, origin: SocketIO.Namespace) {
//         socket.on('updateViewState', async (data, callback) => {
//             //console.log('updating ViewState');
//             try {
//                 let results = await Tickets.UpdateViewState(data.tids, socket.handshake.session.nsp, data.viewState);
//                 if (results && results.length == data.tids.length) {
//                     callback({ status: 'ok' });
//                     //Emit to Other Agents
//                     results.map(async result => {
//                         socket.to('ticketAdmin').emit('updateTicketProperty', { tid: result._id, ticket: result });
//                         socket.to(result.group).emit('updateTicketProperty', { tid: result._id, ticket: result });
//                         if (result.assigned_to) {
//                             let assigendTo = await SessionManager.getAgentByEmail(socket.handshake.session.nsp, result.assigned_to);
//                             if (assigendTo) socket.to(assigendTo._id).emit('updateTicketProperty', { tid: result._id, ticket: result });
//                         }
//                         if (result.watchers) {
//                             let watchers = await SessionManager.getOnlineWatchers(socket.handshake.session.nsp, result.watchers);
//                             if (watchers && watchers.length) {
//                                 if (result.assigned_to) watchers = watchers.filter(data => { return data != result.assigned_to })
//                                 watchers.map(watcher => {
//                                     socket.to(watcher._id).emit('updateTicketProperty', { tid: result._id, ticket: result });
//                                 })
//                             }
//                         }
//                     })
//                 }
//                 else {
//                     callback({ status: 'error' });
//                 }
//             } catch (error) {
//                 console.log(error);
//                 console.log('error in updating Ticket View State');
//             }
//         });
//     }
//     private static CreateNewTicket(socket, origin: SocketIO.Namespace) {
//         socket.on('insertNewTicket', async (data, callback) => {
//             try {
//                 if (!data.thread || !data.message) throw new Error('Invalid Request');
//                 let randomColor = rand[Math.floor(Math.random() * rand.length)];
//                 let primaryEmail = await Tickets.GetPrimaryEmail(socket.handshake.session.nsp);
//                 let ticketPermissions = socket.handshake.session.permissions.tickets;
//                 if (data.thread.cannedForm) {
//                     data.thread.cannedForm.id = new ObjectID(data.thread.cannedForm.id);
//                 }
//                 if (primaryEmail.length) {
//                     //console.log("prim length");
//                     let ticket: TicketSchema;
//                     ticket = {
//                         type: 'email',
//                         subject: data.thread.subject,
//                         nsp: socket.handshake.session.nsp,
//                         priority: data.thread.priority,
//                         state: data.thread.state,
//                         datetime: new Date().toISOString(),
//                         from: data.thread.visitor.email,
//                         visitor: {
//                             name: data.thread.visitor.name,
//                             email: data.thread.visitor.email
//                         },
//                         lasttouchedTime: new Date().toISOString(),
//                         viewState: 'UNREAD',
//                         createdBy: 'Agent',
//                         agentName: socket.handshake.session.email,
//                         ticketlog: [],
//                         mergedTicketIds: [],
//                         viewColor: randomColor,
//                         group: data.thread.group ? data.thread.group : 'Test Group',
//                         assigned_to: data.thread.assigned_to ? data.thread.assigned_to : '',
//                         tags: data.thread.tags ? data.thread.tags : [],
//                         watchers: data.thread.watchers ? data.thread.watchers : [],
//                         cannedForm: data.thread.cannedForm ? data.thread.cannedForm : undefined,
//                         slaPolicy: {
//                             reminderResolution: false,
//                             reminderResponse: false,
//                             violationResponse: false,
//                             violationResolution: false
//                         }
//                     };
//                     //Ticket Automation Work
//                     ticket = await RuleSetDescriptor(ticket);
//                     //Ticket Policy Work
//                     // ticket = await SLAPolicyExecutor(ticket);
//                     //Check if assigned_to has Agent
//                     let insertedTicket = await Tickets.CreateTicket(ticket);
//                     let ticketId: ObjectID | undefined;
//                     if (insertedTicket && insertedTicket.insertedCount) {
//                         ticketId = insertedTicket.insertedId as ObjectID
//                     }
//                     if (ticketId) {
//                         let arr: any = [];
//                         arr.push(ticketId);
//                         let message: TicketMessageSchema = {
//                             datetime: new Date().toISOString(),
//                             nsp: socket.handshake.session.nsp,
//                             senderType: 'Visitor',
//                             message: data.message.body,
//                             from: data.thread.visitor.email,
//                             to: ticketEmail,
//                             replytoAddress: data.thread.visitor.email,
//                             tid: [ticketId],
//                             attachment: [],
//                             viewColor: '',
//                             form: (data.form) ? data.form : '',
//                             submittedForm: (data.submittedForm) ? data.submittedForm : ''
//                         };
//                         let insertedMessage = await Tickets.InsertMessage(JSON.parse(JSON.stringify(message)));
//                         if (insertedMessage && insertedMessage.insertedCount && insertedTicket && insertedTicket.insertedCount) {
//                             // if(insertedTicket.ops[0].nsp == '/sbtjapan.com'){
//                             //     (insertedTicket as any).ops[0] = await CustomDispatcher(insertedTicket.ops[0], message.message);
//                             //     await Tickets.UpdateTicketObj(insertedTicket.ops[0]);
//                             // }
//                             //for watchers..
//                             console.log("inserted", insertedTicket.ops[0]);
//                             socket.to('ticketAdmin').emit('newTicket', { ticket: insertedTicket.ops[0] });
//                             socket.to(ticket.group).emit('newTicket', { ticket: insertedTicket.ops[0] });
//                             callback({ status: 'ok', ticket: insertedTicket.ops[0] });
//                             if (insertedTicket.ops[0].watchers) {
//                                 let watchers = await SessionManager.getOnlineWatchers(socket.handshake.session.nsp, insertedTicket.ops[0].watchers);
//                                 if (watchers && watchers.length) {
//                                     watchers.map(single => {
//                                         socket.to(single._id).emit('newTicket', { ticket: insertedTicket ? insertedTicket.ops[0] : undefined });
//                                     })
//                                 }
//                             }
//                             if (insertedTicket.ops[0].assigned_to) {
//                                 let EmailRecipients = Array();
//                                 let res = await Tickets.getWatchers(insertedTicket.ops[0]._id, socket.handshake.session.nsp);
//                                 if (res && res.length) {
//                                     EmailRecipients = EmailRecipients.concat(res[0].watchers);
//                                 }
//                                 EmailRecipients.push(insertedTicket.ops[0].assigned_to);
//                                 let recipients = EmailRecipients.filter((item, pos) => {
//                                     return EmailRecipients.indexOf(item) == pos;
//                                 })
//                                 let onlineAgent = await SessionManager.getAgentByEmail(socket.handshake.session.nsp, insertedTicket.ops[0].assigned_to);
//                                 if (onlineAgent && !onlineAgent.groups.includes(ticket.group)) socket.to(onlineAgent._id).emit('newTicket', { ticket: insertedTicket.ops[0] });
//                                 if (origin['settings']['emailNotifications']['tickets'].assignToAgent) {
//                                     let msg = '<span><b>ID: </b>' + ticketId + '<br>'
//                                         + '<span><b>Assigned by: </b> Automatic Assignment <br>'
//                                         + '<span><b>Link: </b> https://app.beelinks.solutions/tickets/ticket-view/' + ticketId + '<br>';
//                                     let obj = {
//                                         action: 'sendNoReplyEmail',
//                                         to: recipients,
//                                         subject: 'You have been assigned a new ticket #' + ticketId,
//                                         message: msg,
//                                         html: msg,
//                                         type: 'agentAssigned'
//                                     }
//                                     let response = EmailService.SendNoReplyEmail(obj, false);
//                                 }
//                                 // TODO email sending                          
//                             }
//                             if (insertedTicket.ops[0].group) {
//                                 if (origin['settings']['emailNotifications']['tickets'].assignToGroup) {
//                                     let groupAdmins = await TicketGroupsModel.GetGroupAdmins(socket.handshake.session.nsp, ticket.group);
//                                     if (groupAdmins) {
//                                         let res = await Tickets.getWatchers(insertedTicket.ops[0]._id, socket.handshake.session.nsp);
//                                         if (res && res.length) {
//                                             groupAdmins = groupAdmins.concat(res[0].watchers);
//                                         }
//                                         let recipients = groupAdmins.filter((item, pos) => {
//                                             if (groupAdmins && groupAdmins.length) return groupAdmins.indexOf(item) == pos;
//                                         })
//                                         recipients.forEach(async admin => {
//                                             let msg = '<span><b>ID: </b>' + ticketId + '<br>'
//                                                 + '<span><b>Group: </b> ' + ticket.group + '<br>'
//                                                 + '<span><b>Assigned by: </b> Automatic Assignment <br>'
//                                                 + '<span><b>Link: </b> https://app.beelinks.solutions/tickets/ticket-view/' + ticketId + '<br>';
//                                             let obj = {
//                                                 action: 'sendNoReplyEmail',
//                                                 to: admin,
//                                                 subject: 'Group assigned to Ticket #' + ticketId,
//                                                 message: msg,
//                                                 html: msg,
//                                                 type: 'newTicket'
//                                             }
//                                             let response = EmailService.SendNoReplyEmail(obj, false);
//                                         });
//                                     }
//                                 }
//                             }
//                         }
//                         callback({ status: 'ok' });
//                         return;
//                     } else {
//                         callback({ status: 'error', msg: 'Unable To Create Ticket' });
//                     }
//                     return;
//                 } else {
//                     callback({ status: 'error', msg: 'Unable To Create Ticket' });
//                 }
//             } catch (error) {
//                 console.log(error);
//                 console.log('error in Creating New Ticket');
//                 callback({ status: 'error', msg: error })
//             }
//         });
//     }
//     private static ChatToTicket(socket, origin: SocketIO.Namespace) {
//         socket.on('convertChatToTicket', async (data, callback) => {
//             try {
//                 // console.log(data);
//                 // if (socket.handshake.session.role != 'admin') throw new Error('Invalid Request');
//                 if (!data.thread || !data.cid) throw new Error('Invalid Request');
//                 let auto_assign = origin['settings']['groupsAutomation'].auto_assign;
//                 let randomColor = rand[Math.floor(Math.random() * rand.length)];
//                 let primaryEmail = await Tickets.GetPrimaryEmail(socket.handshake.session.nsp);
//                 let convos = await Conversations.getMessagesByCid(data.cid);
//                 if (!convos || !convos.length) { callback({ status: 'error', msg: 'Unable To Create Ticket - No Meesage Found' }); return; }
//                 if (primaryEmail.length) {
//                     let ticket: TicketSchema;
//                     ticket = {
//                         type: 'email',
//                         subject: data.thread.subject,
//                         nsp: socket.handshake.session.nsp,
//                         priority: data.thread.priority,
//                         state: data.thread.state,
//                         datetime: new Date().toISOString(),
//                         from: data.thread.visitor.email,
//                         visitor: {
//                             name: data.thread.visitor.name,
//                             email: data.thread.visitor.email
//                         },
//                         lasttouchedTime: new Date().toISOString(),
//                         viewState: 'UNREAD',
//                         createdBy: 'Agent',
//                         agentName: socket.handshake.session.email,
//                         ticketlog: [],
//                         mergedTicketIds: [],
//                         viewColor: randomColor,
//                         group: "",
//                         source: 'panel',
//                         slaPolicy: {
//                             reminderResolution: false,
//                             reminderResponse: false,
//                             violationResponse: false,
//                             violationResolution: false
//                         }
//                     }
//                     ticket = await RuleSetDescriptor(ticket);
//                     let insertedTicket = await Tickets.CreateTicket(JSON.parse(JSON.stringify(ticket)));
//                     let ticketId: ObjectID | undefined;
//                     if (insertedTicket && insertedTicket.insertedCount) {
//                         ticketId = insertedTicket.insertedId as ObjectID
//                     }
//                     if (ticketId) {
//                         let arr: any = [];
//                         arr.push(ticketId);
//                         let insertedMessages: any;
//                         if (convos && convos.length) {
//                             let msgBody = Utils.GenerateTicketTemplate(convos, data.thread.visitor.name, data.thread.visitor.email, data.thread.clientID, data.thread.viewColor)
//                             // let updatedList = convos.map((msg, index) => {
//                             let message: TicketMessageSchema = {
//                                 datetime: new Date().toISOString(),
//                                 nsp: socket.handshake.session.nsp,
//                                 senderType: 'Visitor',
//                                 message: msgBody,
//                                 from: data.thread.visitor.email,
//                                 to: ticketEmail,
//                                 replytoAddress: data.thread.visitor.email,
//                                 tid: [new ObjectID(ticketId)],
//                                 attachment: [],
//                                 form: '',
//                                 viewColor: (insertedTicket && insertedTicket.insertedCount) ? insertedTicket.ops[0].viewColor : '',
//                             };
//                             insertedMessages = await Tickets.InsertMessage(JSON.parse(JSON.stringify(message)));
//                             if (insertedMessages && insertedMessages.result.ok && insertedMessages.insertedCount &&
//                                 insertedTicket && insertedTicket.insertedCount) {
//                                 /**
//                                  * id , 
//                                  * subject , 
//                                  * createdby , 
//                                  * createdDate , 
//                                  * clientID
//                                  */
//                                 let details = await Conversations.InsertTicketDetails(data.cid, {
//                                     id: insertedTicket.ops[0]._id,
//                                     subject: insertedTicket.ops[0].subject,
//                                     clientID: insertedTicket.ops[0].clientID,
//                                     createdDate: insertedTicket.ops[0].datetime,
//                                     createdby: socket.handshake.session.email
//                                 })
//                                 callback({
//                                     status: 'ok',
//                                     cid: data.cid,
//                                     ticket: {
//                                         id: insertedTicket.ops[0]._id,
//                                         subject: insertedTicket.ops[0].subject,
//                                         clientID: insertedTicket.ops[0].clientID,
//                                         createdDate: insertedTicket.ops[0].datetime,
//                                         createdby: socket.handshake.session.email
//                                     }
//                                 });
//                                 socket.to(socket.handshake.session._id).emit('gotChatTicketDetails', {
//                                     status: 'ok',
//                                     cid: data.cid,
//                                     ticket: {
//                                         id: insertedTicket.ops[0]._id,
//                                         subject: insertedTicket.ops[0].subject,
//                                         clientID: insertedTicket.ops[0].clientID,
//                                         createdDate: insertedTicket.ops[0].datetime,
//                                         createdby: socket.handshake.session.email
//                                     }
//                                 });
//                                 // if(insertedTicket.ops[0].nsp == '/sbtjapan.com'){
//                                 //     (insertedTicket as any).ops[0] = await CustomDispatcher(insertedTicket.ops[0], insertedMessage[0].ops[0].message);
//                                 //     await Tickets.UpdateTicketObj(insertedTicket.ops[0]);
//                                 // }
//                                 origin.to('ticketAdmin').emit('newTicket', { ticket: insertedTicket.ops[0] });
//                                 origin.to(ticket.group).emit('newTicket', { ticket: insertedTicket.ops[0] });
//                                 if (insertedTicket.ops[0].assigned_to) {
//                                     let onlineAgent = await SessionManager.getAgentByEmail(socket.handshake.session.nsp, insertedTicket.ops[0].assigned_to);
//                                     if (onlineAgent && !onlineAgent.groups.includes(ticket.group)) origin.to(onlineAgent._id).emit('newTicket', { ticket: insertedTicket.ops[0] });
//                                     if (origin['settings']['emailNotifications']['tickets'].assignToAgent) {
//                                         //Old Chat Conversion
//                                         // let response = await EmailService.SendTicketConversionEmail({
//                                         //     ticket: insertedTicket.ops[0],
//                                         //     messages: messages,
//                                         //     subject: data.thread.subject,
//                                         //     nsp: socket.handshake.session.nsp.substring(1),
//                                         //     to: insertedTicket.ops[0].assigned_to
//                                         // });
//                                         // if (response) {
//                                         // }
//                                         let msg = '<span><b>ID: </b>' + ticketId + '<br>'
//                                             + '<span><b>Assigned by: </b> Automatic Assignment <br>'
//                                             + '<span><b>Link: </b> https://app.beelinks.solutions/tickets/ticket-view/' + ticketId + '<br>';
//                                         let obj = {
//                                             action: 'sendNoReplyEmail',
//                                             to: insertedTicket.ops[0].assigned_to,
//                                             subject: 'You have been assigned a new ticket #' + ticketId,
//                                             message: msg,
//                                             html: msg,
//                                             type: 'agentAssigned'
//                                         }
//                                         let response = EmailService.SendNoReplyEmail(obj, false);
//                                     }
//                                 }
//                                 if (insertedTicket.ops[0].group) {
//                                     if (origin['settings']['emailNotifications']['tickets'].assignToGroup) {
//                                         let groupAdmins = await TicketGroupsModel.GetGroupAdmins(socket.handshake.session.nsp, ticket.group);
//                                         if (groupAdmins) {
//                                             groupAdmins.forEach(async admin => {
//                                                 let msg = '<span><b>ID: </b>' + ticketId + '<br>'
//                                                     + '<span><b>Group: </b> ' + ticket.group + '<br>'
//                                                     + '<span><b>Assigned by: </b> Automatic Assignment <br>'
//                                                     + '<span><b>Link: </b> https://app.beelinks.solutions/tickets/ticket-view/' + ticketId + '<br>';
//                                                 let obj = {
//                                                     action: 'sendNoReplyEmail',
//                                                     to: admin,
//                                                     subject: 'Group assigned to Ticket #' + ticketId,
//                                                     message: msg,
//                                                     html: msg,
//                                                     type: 'newTicket'
//                                                 }
//                                                 let response = EmailService.SendNoReplyEmail(obj, false);
//                                             });
//                                         }
//                                     }
//                                 }
//                             } else callback({ status: 'error', msg: 'Unable to Insert Message' });
//                             return;
//                         }
//                     }
//                     else {
//                         callback({ status: 'error', msg: 'Unable To Create Ticket' });
//                     }
//                 }
//                 else callback({ status: 'error', msg: 'Unable To Create Ticket' });
//             } catch (error) {
//                 console.log(error);
//                 console.log('error in Creating New Ticket');
//                 callback({ status: 'error', msg: error })
//             }
//         });
//     }
//     private static GetAgentsAgainstGroup(socket, origin: SocketIO.Namespace) {
//         socket.on('getAgentsAgainstGroup', async (data, callback) => {
//             try {
//                 if (data.groupList) {
//                     let agents = await TicketGroupsModel.getAgentsAgainstGroup(socket.handshake.session.nsp, data.groups);
//                     callback({ status: 'ok', agents: agents })
//                 } else {
//                     callback({ status: 'error', msg: 'Group list not defined!' })
//                 }
//             } catch (error) {
//                 console.log(error);
//                 console.log('Error in bulk Assigning tag');
//             }
//         })
//     }
//     private static GetAgentsAgainstGroupObj(socket, origin: SocketIO.Namespace) {
//         socket.on('getAgentsAgainstGroupObj', async (data, callback) => {
//             try {
//                 if (data.groupList) {
//                     let agents = await TicketGroupsModel.getAgentsAgainstGroupObj(socket.handshake.session.nsp, data.groupList);
//                     callback({ status: 'ok', agents: agents })
//                 } else {
//                     callback({ status: 'error', msg: 'Group list not defined!' })
//                 }
//             } catch (error) {
//                 console.log(error);
//                 console.log('Error in bulk Assigning tag');
//             }
//         })
//     }
//     private static GetAllAgentsAgainstAdmin(socket, origin: SocketIO.Namespace) {
//         socket.on('getAllAgentsAgainstAdmin', async (data, callback) => {
//             try {
//                 //console.log('Getting agents against admin');
//                 let agents = await TicketGroupsModel.getAllAgentsAgainstAdmin(socket.handshake.session.nsp, socket.handshake.session.email);
//                 callback({ status: 'ok', agents: agents })
//             } catch (error) {
//                 console.log(error);
//                 console.log('Error in bulk Assigning tag');
//             }
//         })
//     }
//     // private static CannedFormInTicket(socket, origin: SocketIO.Namespace) {
//     //     socket.on('sendCannedForm', async (data, callback) => {
//     //         try {
//     //             if (data.CannedForm) {
//     //                 let response = await EmailService.SendCannedForm({
//     //                     ticket: data.ticket,
//     //                     subject: data.ticket.subject,
//     //                     forwardEmail: data.ticket.from,
//     //                     nsp: socket.handshake.session.nsp.substring(1),
//     //                     to: data.email,
//     //                     message: data.message,
//     //                     form: data.CannedForm
//     //                 });
//     //                 if (response) callback({ status: 'ok' });
//     //                 else callback({ status: 'error' });
//     //             }
//     //         } catch (error) {
//     //             console.log(error);
//     //             console.log('Error in sending canned Form');
//     //         }
//     //     })
//     // }
//     private static ForwardMessageAsTicket(socket, origin: SocketIO.Namespace) {
//         socket.on('forwardMessageAsTicket', async (data, callback) => {
//             try {
//                 // let ticket = await Tickets.getTicketByID(socket.handshake.session.nsp, data.message.tid);
//                 // console.log(ticket);
//                 if (data.ticket) {
//                     // for forwarding ticket to assigned agent
//                     let response = await EmailService.ForwardMessageAsTicketEmail({
//                         ticket: data.ticket,
//                         subject: data.ticket.subject,
//                         to: data.email, // to be decided where to reply the ticket 
//                         nsp: (socket.handshake.session.nsp as string).substring(1),
//                         message: data.message
//                     });
//                     if (response) callback({ status: 'ok' });
//                     else callback({ status: 'error' });
//                 }
//             } catch (error) {
//                 console.log(error);
//                 console.log('Error in bulk Assigning tag');
//             }
//         })
//     }
//     //#region Watchers
//     private static addWatchers(socket, origin: SocketIO.Namespace) {
//         socket.on('addWatchers', async (data, callback) => {
//             try {
//                 let watchers = await Tickets.addWatchers(data.tids, data.agents, data.ticketlog, socket.handshake.session.nsp);
//                 if (watchers && watchers.length) {
//                     callback({ status: 'ok', watchers: watchers[0] });
//                     watchers.map(async watcher => {
//                         socket.to('ticketAdmin').emit('updateTicketProperty', { tid: watcher._id, ticket: watcher });
//                         socket.to(watcher.group).emit('updateTicketProperty', { tid: watcher._id, ticket: watcher });
//                         if (watcher.assigned_to) {
//                             let assigendTo = await SessionManager.getAgentByEmail(socket.handshake.session.nsp, watcher.assigned_to);
//                             if (assigendTo) socket.to(assigendTo._id).emit('updateTicketProperty', { tid: watcher._id, ticket: watcher });
//                         }
//                         if (watcher.watchers) {
//                             let watchers = await SessionManager.getOnlineWatchers(socket.handshake.session.nsp, watcher.watchers);
//                             if (watcher.assigned_to) watchers = watchers.filter(data => { return data != watcher.assigned_to })
//                             watchers.map(result => {
//                                 socket.to(result._id).emit('updateTicketProperty', { tid: watcher._id, ticket: watcher });
//                             })
//                         }
//                         //new added agents
//                         if (data.agents) {
//                             let msg = 'Hello, Agent '
//                                 + '<span>You have been added as a watcher by:  ' + socket.handshake.session.email + '<br>'
//                                 + '<span><b>Ticket Link: </b> https://app.beelinks.solutions/tickets/ticket-view/' + watcher._id + '<br>';
//                             let obj = {
//                                 action: 'sendNoReplyEmail',
//                                 to: data.agents,
//                                 subject: 'Added as watcher to Ticket #' + watcher._id,
//                                 message: msg,
//                                 html: msg,
//                                 type: 'newTicket'
//                             }
//                             let response = EmailService.SendNoReplyEmail(obj, false);
//                             data.agents.map(result => {
//                                 socket.to(result._id).emit('newTicket', { ticket: watcher, ignoreAdmin: false });
//                             })
//                         }
//                     })
//                 }
//             }
//             catch (error) {
//                 console.log(error);
//                 console.log('error in adding watchers');
//                 callback({ status: 'error' })
//             }
//         });
//     }
//     private static deleteWatcher(socket, origin: SocketIO.Namespace) {
//         socket.on('deleteWatcher', async (data, callback) => {
//             try {
//                 console.log("data", data);
//                 let result = await Tickets.deleteWatcher(data.id, data.agent);
//                 if (result && result.value) {
//                     // console.log("deleted", watchers.value);
//                     socket.to('ticketAdmin').emit('updateTicketProperty', { tid: result.value._id, ticket: result.value });
//                     socket.to(result.value.group).emit('updateTicketProperty', { tid: result.value._id, ticket: result.value });
//                     if (result.value.assigned_to) {
//                         let assigendTo = await SessionManager.getAgentByEmail(socket.handshake.session.nsp, result.value.assigned_to);
//                         if (assigendTo) socket.to(assigendTo._id).emit('updateTicketProperty', { tid: result.value._id, ticket: result.value });
//                     }
//                     if (result.value.watchers) {
//                         let watchers = await SessionManager.getOnlineWatchers(socket.handshake.session.nsp, result.value.watchers);
//                         if (watchers && watchers.length) {
//                             let res = result.value;
//                             if (res.assigned_to) watchers = watchers.filter(data => { return data != res.assigned_to })
//                             watchers.map(watcher => {
//                                 socket.to(watcher._id).emit('updateTicketProperty', { tid: res._id, ticket: res });
//                             })
//                         }
//                     }
//                     callback({ status: 'ok', msg: "Watcher deleted successfully!" });
//                 }
//                 else {
//                     callback({ status: 'ok', msg: "Error in deleting watcher!" });
//                 }
//             }
//             catch (error) {
//                 console.log(error);
//                 console.log('error in adding watchers');
//                 callback({ status: 'error' })
//             }
//         });
//     }
//     private static getAgentAgainstWatchers(socket, origin: SocketIO.Namespace) {
//         socket.on('getAgentAgainstWatchers', async (data, callback) => {
//             try {
//                 let agents = await Tickets.getAgentAgainstWatchers(socket.handshake.session.nsp, data.watcherList);
//                 if (agents && agents.length) {
//                     callback({ status: 'ok', agents: agents })
//                 }
//                 else {
//                     callback({ status: 'error', msg: 'Agent list not found!' })
//                 }
//             } catch (error) {
//                 console.log(error);
//                 console.log('Error in bulk Assigning tag');
//             }
//         })
//     }
//     //#endregion
//     private static getSurveyResult(socket, origin: SocketIO.Namespace) {
//         socket.on('getSurveyResult', async (data, callback) => {
//             try {
//                 let res = await Tickets.getSurveyResults(socket.handshake.session.nsp, data.id);
//                 if (res) {
//                     callback({ status: 'ok', result: res[0] })
//                 }
//             } catch (error) {
//                 console.log(error);
//                 console.log('Error in Assigning agent');
//             }
//         });
//     }
// }
//# sourceMappingURL=ticketEvents.js.map