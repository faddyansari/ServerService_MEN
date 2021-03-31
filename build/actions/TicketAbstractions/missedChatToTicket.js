"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatToTicket = void 0;
var emailService_1 = require("../../services/emailService");
var TicketgroupModel_1 = require("../../models/TicketgroupModel");
var sessionsManager_1 = require("../../globals/server/sessionsManager");
var ticketsModel_1 = require("../../models/ticketsModel");
var constants_1 = require("../../globals/config/constants");
var conversationModel_1 = require("../../models/conversationModel");
var RuleSetExecutor_1 = require("./RuleSetExecutor");
var mongodb_1 = require("mongodb");
var Utils_1 = require("../agentActions/Utils");
var TicketDispatcher_1 = require("./TicketDispatcher");
var companyModel_1 = require("../../models/companyModel");
var __biZZCMiddleWare_1 = require("../../globals/__biZZCMiddleWare");
function ChatToTicket(conversation, timeZone) {
    return __awaiter(this, void 0, void 0, function () {
        var data, primaryTicket, primaryEmail, randomColor, convos, ticket_1, insertedTicket, ticketId_1, arr, insertedMessages, msgBody, message, result, details, origin, onlineAgent, msg, obj, response, groupAdmins, error_1;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 29, , 30]);
                    data = {
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
                    };
                    primaryTicket = undefined;
                    return [4 /*yield*/, ticketsModel_1.Tickets.GetPrimaryEmail(conversation.nsp)];
                case 1:
                    primaryEmail = _a.sent();
                    randomColor = constants_1.rand[Math.floor(Math.random() * constants_1.rand.length)];
                    return [4 /*yield*/, conversationModel_1.Conversations.getMessagesByCid(conversation._id)];
                case 2:
                    convos = _a.sent();
                    if (!convos || !convos.length) {
                        ({ status: 'error', msg: 'Unable To Create Ticket - No Meesage Found' });
                        return [2 /*return*/];
                    }
                    if (!primaryEmail.length) return [3 /*break*/, 27];
                    ticket_1 = {
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
                    };
                    return [4 /*yield*/, RuleSetExecutor_1.RuleSetDescriptor(ticket_1)];
                case 3:
                    ticket_1 = _a.sent();
                    return [4 /*yield*/, ticketsModel_1.Tickets.CreateTicket(JSON.parse(JSON.stringify(ticket_1)))];
                case 4:
                    insertedTicket = _a.sent();
                    if (insertedTicket && insertedTicket.insertedCount) {
                        ticketId_1 = insertedTicket.insertedId;
                    }
                    if (!ticketId_1) return [3 /*break*/, 25];
                    arr = [];
                    arr.push(ticketId_1);
                    insertedMessages = void 0;
                    if (!(convos && convos.length)) return [3 /*break*/, 24];
                    msgBody = Utils_1.Utils.GenerateTicketTemplate(convos, data.thread.visitor.name, data.thread.visitor.email, data.thread.clientID, data.thread.viewColor, timeZone);
                    message = {
                        datetime: new Date().toISOString(),
                        nsp: conversation.nsp,
                        senderType: 'Visitor',
                        message: msgBody,
                        from: data.thread.visitor.email,
                        to: constants_1.ticketEmail,
                        replytoAddress: data.thread.visitor.email,
                        tid: [new mongodb_1.ObjectID(ticketId_1)],
                        attachment: [],
                        form: '',
                        viewColor: (insertedTicket && insertedTicket.insertedCount) ? insertedTicket.ops[0].viewColor : '',
                    };
                    return [4 /*yield*/, ticketsModel_1.Tickets.InsertMessage(JSON.parse(JSON.stringify(message)))];
                case 5:
                    insertedMessages = _a.sent();
                    if (!(insertedMessages && insertedMessages.result.ok && insertedMessages.insertedCount &&
                        insertedTicket && insertedTicket.insertedCount)) return [3 /*break*/, 22];
                    if (!(insertedTicket.ops[0].nsp == '/sbtjapan.com' || insertedTicket.ops[0].nsp == '/sbtjapaninquiries.com')) return [3 /*break*/, 8];
                    console.log('Custom Dispatcher fired!');
                    return [4 /*yield*/, TicketDispatcher_1.CustomDispatcherForPanel(insertedTicket.ops[0])];
                case 6:
                    result = _a.sent();
                    insertedTicket.ops[0] = result.secondaryTicket;
                    // console.log(insertedTicket.ops[0]);
                    if (insertedTicket.ops[0].assigned_to) {
                        insertedTicket.ops[0].assignmentList = [
                            {
                                assigned_to: insertedTicket.ops[0].assigned_to,
                                assigned_time: insertedTicket.ops[0].first_assigned_time,
                                read_date: ''
                            }
                        ];
                    }
                    return [4 /*yield*/, ticketsModel_1.Tickets.UpdateTicketObj(insertedTicket.ops[0])];
                case 7:
                    _a.sent();
                    if (result.primaryTicket)
                        primaryTicket = result.primaryTicket;
                    _a.label = 8;
                case 8: return [4 /*yield*/, conversationModel_1.Conversations.InsertTicketDetails(data.cid, {
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
                ];
                case 9:
                    details = _a.sent();
                    return [4 /*yield*/, companyModel_1.Company.getSettings(conversation.nsp)];
                case 10:
                    origin = _a.sent();
                    // origin.to('ticketAdmin').emit('newTicket', { ticket: insertedTicket.ops[0] });
                    // origin.to(ticket.group).emit('newTicket', { ticket: insertedTicket.ops[0] });
                    return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'newTicket', nsp: conversation.nsp, roomName: ['ticketAdmin'], data: { ticket: insertedTicket.ops[0] } })];
                case 11:
                    // origin.to('ticketAdmin').emit('newTicket', { ticket: insertedTicket.ops[0] });
                    // origin.to(ticket.group).emit('newTicket', { ticket: insertedTicket.ops[0] });
                    _a.sent();
                    return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'newTicket', nsp: conversation.nsp, roomName: [ticket_1.group], data: { ticket: insertedTicket.ops[0] } })];
                case 12:
                    _a.sent();
                    if (!primaryTicket) return [3 /*break*/, 15];
                    // origin.to('ticketAdmin').emit('updateTicket', { tid: primaryTicket._id, ticket: primaryTicket });
                    // origin.to(primaryTicket.group).emit('updateTicket', { tid: primaryTicket._id, ticket: primaryTicket });
                    return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateTicket', nsp: conversation.nsp, roomName: ['ticketAdmin'], data: { tid: primaryTicket._id, ticket: primaryTicket } })];
                case 13:
                    // origin.to('ticketAdmin').emit('updateTicket', { tid: primaryTicket._id, ticket: primaryTicket });
                    // origin.to(primaryTicket.group).emit('updateTicket', { tid: primaryTicket._id, ticket: primaryTicket });
                    _a.sent();
                    return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateTicket', nsp: conversation.nsp, roomName: [primaryTicket.group], data: { tid: primaryTicket._id, ticket: primaryTicket } })];
                case 14:
                    _a.sent();
                    _a.label = 15;
                case 15:
                    if (!insertedTicket.ops[0].assigned_to) return [3 /*break*/, 19];
                    return [4 /*yield*/, sessionsManager_1.SessionManager.getAgentByEmail(conversation.nsp, insertedTicket.ops[0].assigned_to)];
                case 16:
                    onlineAgent = _a.sent();
                    if (!(onlineAgent && !onlineAgent.groups.includes(ticket_1.group))) return [3 /*break*/, 18];
                    // origin.to(onlineAgent._id).emit('newTicket', { ticket: insertedTicket.ops[0] });
                    return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'newTicket', nsp: conversation.nsp, roomName: [onlineAgent._id], data: { ticket: insertedTicket.ops[0] } })];
                case 17:
                    // origin.to(onlineAgent._id).emit('newTicket', { ticket: insertedTicket.ops[0] });
                    _a.sent();
                    _a.label = 18;
                case 18:
                    if (origin[0]['settings']['emailNotifications']['tickets'].assignToAgent) {
                        msg = '<span><b>ID: </b>' + ticketId_1 + '<br>'
                            + '<span><b>Assigned by: </b> Automatic Assignment <br>'
                            + '<span><b>Link: </b> https://app.beelinks.solutions/tickets/ticket-view/' + ticketId_1 + '<br>';
                        obj = {
                            action: 'sendNoReplyEmail',
                            to: insertedTicket.ops[0].assigned_to,
                            subject: 'You have been assigned a new ticket #' + ticketId_1,
                            message: msg,
                            html: msg,
                            type: 'agentAssigned'
                        };
                        response = emailService_1.EmailService.SendNoReplyEmail(obj, false);
                    }
                    _a.label = 19;
                case 19:
                    if (!insertedTicket.ops[0].group) return [3 /*break*/, 21];
                    if (!(origin['settings'].emailNotifications && origin['settings']['emailNotifications']['tickets'].assignToGroup)) return [3 /*break*/, 21];
                    return [4 /*yield*/, TicketgroupModel_1.TicketGroupsModel.GetGroupAdmins(conversation.nsp, ticket_1.group)];
                case 20:
                    groupAdmins = _a.sent();
                    if (groupAdmins) {
                        groupAdmins.forEach(function (admin) { return __awaiter(_this, void 0, void 0, function () {
                            var msg, obj, response;
                            return __generator(this, function (_a) {
                                msg = '<span><b>ID: </b>' + ticketId_1 + '<br>'
                                    + '<span><b>Group: </b> ' + ticket_1.group + '<br>'
                                    + '<span><b>Assigned by: </b> Automatic Assignment <br>'
                                    + '<span><b>Link: </b> https://app.beelinks.solutions/tickets/ticket-view/' + ticketId_1 + '<br>';
                                obj = {
                                    action: 'sendNoReplyEmail',
                                    to: admin,
                                    subject: 'Group assigned to Ticket #' + ticketId_1,
                                    message: msg,
                                    html: msg,
                                    type: 'newTicket'
                                };
                                response = emailService_1.EmailService.SendNoReplyEmail(obj, false);
                                return [2 /*return*/];
                            });
                        }); });
                    }
                    _a.label = 21;
                case 21: return [2 /*return*/, ({
                        status: 'ok',
                        cid: data.cid,
                        ticket: {
                            id: insertedTicket.ops[0]._id,
                            subject: insertedTicket.ops[0].subject,
                            clientID: insertedTicket.ops[0].clientID,
                            createdDate: insertedTicket.ops[0].datetime,
                            createdby: 'System'
                        }
                    })];
                case 22: return [2 /*return*/, ({ status: 'error', msg: 'Unable to Insert Message' })];
                case 23: return [2 /*return*/];
                case 24: return [3 /*break*/, 26];
                case 25: return [2 /*return*/, ({ status: 'error', msg: 'Unable To Create Ticket' })];
                case 26: return [3 /*break*/, 28];
                case 27: return [2 /*return*/, ({ status: 'error', msg: 'Unable To Create Ticket' })];
                case 28: return [3 /*break*/, 30];
                case 29:
                    error_1 = _a.sent();
                    console.log(error_1);
                    console.log('error in Creating New Ticket');
                    return [2 /*return*/, ({ status: 'error', msg: error_1 })];
                case 30: return [2 /*return*/];
            }
        });
    });
}
exports.ChatToTicket = ChatToTicket;
//# sourceMappingURL=missedChatToTicket.js.map