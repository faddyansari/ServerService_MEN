"use strict";
//Created By Saad Ismail Shaikh 
// 01-08-2018
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
//Updated By Saad Ismail shaikh
//Date :  12-12-2018 After Multple Agent Locations
var sessionsManager_1 = require("../../globals/server/sessionsManager");
var visitorModel_1 = require("../../models/visitorModel");
var agentModel_1 = require("../../models/agentModel");
var conversationModel_1 = require("../../models/conversationModel");
var inviteToChat_1 = require("../../actions/agentActions/inviteToChat");
var CreateMessage_1 = require("../../actions/GlobalActions/CreateMessage");
var aws_sqs_1 = require("../../actions/aws/aws-sqs");
var enums_1 = require("../../globals/config/enums");
var ManualAssignmentEvents = /** @class */ (function () {
    function ManualAssignmentEvents() {
    }
    ManualAssignmentEvents.BindManualAssignmentEvents = function (socket, origin) {
        //Updated To Multiple Agents
        ManualAssignmentEvents.InitiateChat(socket, origin);
        //Updated To Multiple Agents
        ManualAssignmentEvents.TransferChat(socket, origin);
        //Updated To Multiple Agents
        ManualAssignmentEvents.RequestQueue(socket, origin);
    };
    //Outputs of This Function
    //1. updateUser Message Event to Agents
    //2. initiateChat Message Event to Agents JSON Contains ({ state , agentInfo , autoMessage })
    //3. Callback JSON Contains Status and Conversation Object
    ManualAssignmentEvents.InitiateChat = function (socket, origin) {
        var _this = this;
        socket.on('initiateChat', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var visitor, agent, UpdatedSessions, reciever, payload, loggedEvent, logEvent, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 11, , 12]);
                        return [4 /*yield*/, sessionsManager_1.SessionManager.GetVisitorByID(data.sid)];
                    case 1:
                        visitor = _a.sent();
                        return [4 /*yield*/, sessionsManager_1.SessionManager.GetAgentByID(socket.handshake.session.id || socket.handshake.session._id)];
                    case 2:
                        agent = _a.sent();
                        //If Allowed By Admin
                        if (!origin['settings']['chatSettings']['assignments'].mEng) {
                            callback({ status: 'notAllowed' });
                            return [2 /*return*/];
                        }
                        //Visitor Not Disconnected Du To Timeout
                        if (!visitor || !agent) {
                            callback({ status: 'disconnected' });
                            return [2 /*return*/];
                        }
                        // Less Than Simaltaneous Chats Limit
                        if (agent.chatCount >= agent.concurrentChatLimit) {
                            callback({ status: 'slotsFull' });
                            return [2 /*return*/];
                        }
                        // Less Than Simaltaneous Chats Limit
                        if (visitor.state == 4) {
                            callback({ status: 'engaged' });
                            return [2 /*return*/];
                        }
                        if (!(visitor.state == 1 || visitor.state == 8)) return [3 /*break*/, 9];
                        return [4 /*yield*/, inviteToChat_1.InviteToChat(visitor, agent, origin['settings']['chatSettings']['greetingMessage'])];
                    case 3:
                        UpdatedSessions = _a.sent();
                        if (!(UpdatedSessions && UpdatedSessions.agent)) return [3 /*break*/, 7];
                        visitor = UpdatedSessions.visitor;
                        agent = UpdatedSessions.agent;
                        reciever = visitorModel_1.Visitor.NotifyOne(UpdatedSessions.visitor);
                        payload = { id: UpdatedSessions.visitor.id, session: UpdatedSessions.visitor };
                        //Update All Agents.
                        origin.to(agentModel_1.Agents.NotifyAll()).emit('updateUser', payload);
                        return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendEventLog(enums_1.EventLogMessages.VISITOR_INVITED, (visitor._id) ? visitor._id : visitor.id)];
                    case 4:
                        loggedEvent = _a.sent();
                        if (loggedEvent)
                            origin.to(agentModel_1.Agents.NotifyAll()).emit('visitorEventLog', loggedEvent);
                        if (!visitor.conversationID) return [3 /*break*/, 6];
                        return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendEventLog(enums_1.EventLogMessages.CHAT_INITIATED, (visitor._id) ? visitor._id : visitor.id)];
                    case 5:
                        logEvent = _a.sent();
                        if (logEvent)
                            origin.to(agentModel_1.Agents.NotifyAll()).emit('visitorEventLog', logEvent);
                        _a.label = 6;
                    case 6:
                        //Update Visitor Need To BE Updated.
                        origin.to(reciever).emit('newEngagement', {
                            clientID: (UpdatedSessions.conversation.clientID) ? UpdatedSessions.conversation.clientID : '',
                            state: 4,
                            username: UpdatedSessions.visitor.username,
                            email: UpdatedSessions.visitor.email,
                            agent: UpdatedSessions.visitor.agent,
                            greetingMessage: (UpdatedSessions.conversation.messages && UpdatedSessions.conversation.messages.length) ?
                                UpdatedSessions.conversation.messages[0] : undefined,
                            cid: UpdatedSessions.visitor.conversationID
                        });
                        callback({ status: 'ok', conversation: (UpdatedSessions.conversation) ? UpdatedSessions.conversation : undefined });
                        return [3 /*break*/, 8];
                    case 7:
                        callback({ status: 'error' });
                        _a.label = 8;
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        callback({ status: 'engaged' });
                        _a.label = 10;
                    case 10: return [3 /*break*/, 12];
                    case 11:
                        error_1 = _a.sent();
                        console.log(error_1);
                        console.log('error in Initiate Chat');
                        callback({ status: 'error' });
                        return [3 /*break*/, 12];
                    case 12: return [2 /*return*/];
                }
            });
        }); });
    };
    ManualAssignmentEvents.TransferChat = function (socket, origin) {
        var _this = this;
        socket.on('transferChat', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var agent, visitor, TransferredAgent, unset, UpdatedSessions, conversation, _a, _b, _c, loggedEvent, chatEvent, insertedMessage, error_2;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 19, , 20]);
                        return [4 /*yield*/, sessionsManager_1.SessionManager.GetAgentByID(socket.handshake.session.id || socket.handshake.session._id)];
                    case 1:
                        agent = _d.sent();
                        return [4 /*yield*/, sessionsManager_1.SessionManager.GetVisitorByID(data.visitor.toString())];
                    case 2:
                        visitor = _d.sent();
                        if (visitor && visitor.inactive) {
                            callback({ transfer: 'error-inactive', msg: "Can't Transfer Inactive Visitor" });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, sessionsManager_1.SessionManager.GetAgentByID(data.to.id)];
                    case 3:
                        TransferredAgent = _d.sent();
                        if (!visitor) return [3 /*break*/, 17];
                        unset = sessionsManager_1.SessionManager.UnsetChatFromAgent(visitor);
                        return [4 /*yield*/, sessionsManager_1.SessionManager.AssignAgent(visitor, (TransferredAgent._id || TransferredAgent.id), visitor.conversationID)];
                    case 4:
                        UpdatedSessions = _d.sent();
                        TransferredAgent = UpdatedSessions.agent;
                        visitor = UpdatedSessions.visitor;
                        return [4 /*yield*/, unset];
                    case 5:
                        agent = _d.sent();
                        if (!(TransferredAgent.email)) return [3 /*break*/, 7];
                        return [4 /*yield*/, conversationModel_1.Conversations.TransferChatUnmodified(visitor.conversationID, TransferredAgent.email)];
                    case 6:
                        _a = _d.sent();
                        return [3 /*break*/, 8];
                    case 7:
                        _a = undefined;
                        _d.label = 8;
                    case 8:
                        conversation = _a;
                        if (!(conversation && conversation.value)) return [3 /*break*/, 15];
                        if (!(conversation.value.messageReadCount)) return [3 /*break*/, 10];
                        _c = conversation.value;
                        return [4 /*yield*/, conversationModel_1.Conversations.getMessages1(visitor.conversationID)];
                    case 9:
                        _b = _c.messages = _d.sent();
                        return [3 /*break*/, 11];
                    case 10:
                        _b = [];
                        _d.label = 11;
                    case 11:
                        _b;
                        return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendEventLog(enums_1.EventLogMessages.CHAT_TRANSFERED, (visitor._id) ? visitor._id : visitor.id)];
                    case 12:
                        loggedEvent = _d.sent();
                        if (loggedEvent)
                            origin.to(agentModel_1.Agents.NotifyAll()).emit('visitorEventLog', loggedEvent);
                        chatEvent = 'Chat Transferred from ' + agent.value.nickname + ' to ' + TransferredAgent.nickname;
                        origin.to(agentModel_1.Agents.NotifyAll()).emit('updateUser', { id: visitor.id, session: visitor });
                        insertedMessage = void 0;
                        if (!visitor) return [3 /*break*/, 14];
                        return [4 /*yield*/, CreateMessage_1.CreateLogMessage({
                                from: visitor.agent.name,
                                to: (visitor.username) ? visitor.agent.name || visitor.agent.nickname : '',
                                body: chatEvent,
                                type: 'Events',
                                cid: (visitor.conversationID) ? visitor.conversationID : '',
                                attachment: false,
                                date: new Date().toISOString(),
                                delivered: true,
                                sent: true
                            })];
                    case 13:
                        insertedMessage = _d.sent();
                        origin.to(visitorModel_1.Visitor.NotifyOne(visitor)).emit('transferChat', { agent: visitor.agent, event: chatEvent });
                        _d.label = 14;
                    case 14:
                        if (TransferredAgent) {
                            if (insertedMessage)
                                conversation.value.messages.push(insertedMessage);
                            origin.to(agentModel_1.Agents.NotifyOne(visitor)).emit('newConversation', conversation.value);
                            socket.to(agentModel_1.Agents.NotifyOne(agent)).emit('removeConversation', { conversation: conversation.value });
                        }
                        callback({ transfer: 'ok' });
                        return [3 /*break*/, 16];
                    case 15:
                        callback({ transfer: 'error' });
                        _d.label = 16;
                    case 16: return [3 /*break*/, 18];
                    case 17:
                        callback({ transfer: 'error' });
                        _d.label = 18;
                    case 18: return [3 /*break*/, 20];
                    case 19:
                        error_2 = _d.sent();
                        //console.log(error);
                        console.log('Error in TransferChat');
                        callback({ transfer: 'error' });
                        return [3 /*break*/, 20];
                    case 20: return [2 /*return*/];
                }
            });
        }); });
    };
    ManualAssignmentEvents.RequestQueue = function (socket, origin) {
        var _this = this;
        socket.on('requestQueue', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var session, UpdatedSessions, _a, QueuedSession, conversation, _b, queuedEvent, logEvent, _c, error_3;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 14, , 15]);
                        return [4 /*yield*/, sessionsManager_1.SessionManager.getAgentByEmail(socket.handshake.session.nsp, socket.handshake.session.email)];
                    case 1:
                        session = _d.sent();
                        if (!session) {
                            callback({ status: 'error' });
                            return [2 /*return*/];
                        }
                        UpdatedSessions = void 0;
                        if (!!session.permissions.chats.canChat) return [3 /*break*/, 2];
                        callback({ status: 'notAllowed' });
                        return [3 /*break*/, 13];
                    case 2:
                        if (!(session.permissions.chats.canChat)) return [3 /*break*/, 4];
                        return [4 /*yield*/, sessionsManager_1.SessionManager.AssignQueuedVisitor(session, data.sid)];
                    case 3:
                        _a = _d.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        _a = undefined;
                        _d.label = 5;
                    case 5:
                        UpdatedSessions = _a;
                        if (!(UpdatedSessions && UpdatedSessions.agent)) return [3 /*break*/, 12];
                        session = UpdatedSessions.agent;
                        QueuedSession = UpdatedSessions.visitor;
                        if (!(session.email)) return [3 /*break*/, 7];
                        return [4 /*yield*/, conversationModel_1.Conversations.TransferChatUnmodified(QueuedSession.conversationID, session.email)];
                    case 6:
                        _b = _d.sent();
                        return [3 /*break*/, 8];
                    case 7:
                        _b = undefined;
                        _d.label = 8;
                    case 8:
                        conversation = _b;
                        if (!(conversation && conversation.value)) return [3 /*break*/, 11];
                        queuedEvent = {
                            nsp: socket.handshake.session.nsp,
                            agentSessionID: socket.handshake.session._id,
                            agentEmail: socket.handshake.session.email,
                            queuedOn: new Date().toISOString(),
                        };
                        return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendEventLog(enums_1.EventLogMessages.REQUEST_FROM_QUEUE, (QueuedSession._id) ? QueuedSession._id : QueuedSession.id)];
                    case 9:
                        logEvent = _d.sent();
                        if (logEvent)
                            origin.to(agentModel_1.Agents.NotifyAll()).emit('visitorEventLog', logEvent);
                        _c = conversation.value;
                        return [4 /*yield*/, conversationModel_1.Conversations.getMessages1(QueuedSession.conversationID)];
                    case 10:
                        _c.messages = _d.sent();
                        //console.log(conversation.value.messages);
                        //Sending Notificiation to All Agent.
                        origin.to(agentModel_1.Agents.NotifyAll()).emit('updateUser', { id: QueuedSession.id, session: QueuedSession });
                        //UPDATE QUEUED SESSION VIA PUSH MESSAGE
                        origin.to(visitorModel_1.Visitor.NotifyOne(QueuedSession)).emit('gotAgent', { agent: QueuedSession.agent, state: 3 });
                        //UPDATE ASSIGNED AGENT CONVERSATIIONS 
                        origin.to(agentModel_1.Agents.NotifyOne(QueuedSession)).emit('newConversation', conversation.value);
                        callback({ status: 'ok' });
                        _d.label = 11;
                    case 11: return [3 /*break*/, 13];
                    case 12:
                        callback({ status: 'error' });
                        _d.label = 13;
                    case 13: return [3 /*break*/, 15];
                    case 14:
                        error_3 = _d.sent();
                        console.log(error_3);
                        console.log('Error in Request Queue');
                        callback({ status: 'error' });
                        return [3 /*break*/, 15];
                    case 15: return [2 /*return*/];
                }
            });
        }); });
    };
    return ManualAssignmentEvents;
}());
exports.ManualAssignmentEvents = ManualAssignmentEvents;
//# sourceMappingURL=manualAssignmentEvents.js.map