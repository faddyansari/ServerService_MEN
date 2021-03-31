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
exports.AssignChatFromInactive = exports.AssignQueuedChatToManual = exports.AutoAssignFromQueueAuto = exports.TransferAgentDisconnect = exports.AssignChatToVisitorAuto = void 0;
var sessionsManager_1 = require("../../globals/server/sessionsManager");
var bson_1 = require("bson");
var conversationModel_1 = require("../../models/conversationModel");
var agentModel_1 = require("../../models/agentModel");
var visitorModel_1 = require("../../models/visitorModel");
var CreateMessage_1 = require("../GlobalActions/CreateMessage");
var enums_1 = require("../../globals/config/enums");
var aws_sqs_1 = require("../aws/aws-sqs");
var __biZZCMiddleWare_1 = require("../../globals/__biZZCMiddleWare");
function AssignChatToVisitorAuto(visitor, email) {
    return __awaiter(this, void 0, void 0, function () {
        var UpdatedSessions, newAgent, conversation, _a, _b, _c, payload, event, loggedEvent, chatEvent, insertedMessage, promises, _d, _e, _f, error_1;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    _g.trys.push([0, 15, , 16]);
                    return [4 /*yield*/, sessionsManager_1.SessionManager.AllocateAgent(visitor, new bson_1.ObjectID(visitor.conversationID))];
                case 1:
                    UpdatedSessions = _g.sent();
                    newAgent = UpdatedSessions.agent;
                    visitor = UpdatedSessions.visitor;
                    if (!(UpdatedSessions && newAgent)) return [3 /*break*/, 14];
                    if (!(newAgent.email)) return [3 /*break*/, 3];
                    return [4 /*yield*/, conversationModel_1.Conversations.TransferChat(visitor.conversationID, newAgent.email, false)];
                case 2:
                    _a = _g.sent();
                    return [3 /*break*/, 4];
                case 3:
                    _a = undefined;
                    _g.label = 4;
                case 4:
                    conversation = _a;
                    if (!(conversation && conversation.value)) return [3 /*break*/, 14];
                    if (!(conversation.value.messageReadCount)) return [3 /*break*/, 6];
                    _c = conversation.value;
                    return [4 /*yield*/, conversationModel_1.Conversations.getMessages1(visitor.conversationID)];
                case 5:
                    _b = _c.messages = _g.sent();
                    return [3 /*break*/, 7];
                case 6:
                    _b = [];
                    _g.label = 7;
                case 7:
                    _b;
                    payload = { id: visitor._id || visitor.id, session: visitor };
                    event = enums_1.ComposedENUM(enums_1.DynamicEventLogs.CHAT_AUTO_ASSIGNED_TO, { newEmail: newAgent.email, oldEmail: '' });
                    return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendEventLog(event, (visitor._id) ? visitor._id : visitor.id)];
                case 8:
                    loggedEvent = _g.sent();
                    chatEvent = 'Chat auto Assigned to ' + (newAgent.username || newAgent.name || newAgent.nickname);
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
                case 9:
                    insertedMessage = _g.sent();
                    console.log('AssignChatToVisitorAuto');
                    _e = (_d = Promise).all;
                    return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: visitor.nsp, roomName: [agentModel_1.Agents.NotifyAll()], data: payload })];
                case 10:
                    _f = [
                        _g.sent()
                    ];
                    return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'newConversation', nsp: visitor.nsp, roomName: [agentModel_1.Agents.NotifyOne(visitor)], data: conversation.value })];
                case 11:
                    _f = _f.concat([
                        _g.sent()
                    ]);
                    return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'V', broadcast: false, eventName: 'transferChat', nsp: visitor.nsp, roomName: [visitorModel_1.Visitor.NotifyOne(visitor)], data: { agent: visitor.agent, event: chatEvent } })];
                case 12: return [4 /*yield*/, _e.apply(_d, [_f.concat([
                            _g.sent()
                        ])])];
                case 13:
                    promises = _g.sent();
                    _g.label = 14;
                case 14: return [2 /*return*/, true];
                case 15:
                    error_1 = _g.sent();
                    console.log(error_1);
                    console.log('Error in AssignChatToVisitor Abstraction');
                    return [2 /*return*/, false];
                case 16: return [2 /*return*/];
            }
        });
    });
}
exports.AssignChatToVisitorAuto = AssignChatToVisitorAuto;
function TransferAgentDisconnect(pendingVisitor, visitorID, agent, id) {
    return __awaiter(this, void 0, void 0, function () {
        var UpdatedSessions, newAgent, conversation, _a, _b, _c, payload, event, loggedEvent, chatEvent, promises, _d, _e, _f, pendingVisitor_1, queEvent, logEvent, promises, _g, _h, _j, error_2;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0:
                    _k.trys.push([0, 22, , 23]);
                    return [4 /*yield*/, sessionsManager_1.SessionManager.AllocateAgent(pendingVisitor, new bson_1.ObjectID(pendingVisitor.conversationID), [id])];
                case 1:
                    UpdatedSessions = (_k.sent());
                    newAgent = UpdatedSessions.agent;
                    pendingVisitor = UpdatedSessions.visitor;
                    if (!(UpdatedSessions && newAgent)) return [3 /*break*/, 14];
                    if (!(newAgent.email)) return [3 /*break*/, 3];
                    return [4 /*yield*/, conversationModel_1.Conversations.TransferChatUnmodified(pendingVisitor.conversationID, newAgent.email, false)];
                case 2:
                    _a = _k.sent();
                    return [3 /*break*/, 4];
                case 3:
                    _a = undefined;
                    _k.label = 4;
                case 4:
                    conversation = _a;
                    if (!(conversation && conversation.value)) return [3 /*break*/, 13];
                    if (!(conversation.value.messageReadCount)) return [3 /*break*/, 6];
                    _c = conversation.value;
                    return [4 /*yield*/, conversationModel_1.Conversations.getMessages1(pendingVisitor.conversationID)];
                case 5:
                    _b = _c.messages = _k.sent();
                    return [3 /*break*/, 7];
                case 6:
                    _b = [];
                    _k.label = 7;
                case 7:
                    _b;
                    payload = { id: pendingVisitor._id || pendingVisitor.id, session: pendingVisitor };
                    event = enums_1.ComposedENUM(enums_1.DynamicEventLogs.CHAT_AUTO_TRANSFERED, { newEmail: newAgent.email, oldEmail: (agent && agent.email) ? agent.email : '' });
                    return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendEventLog(event, (pendingVisitor._id) ? pendingVisitor._id : pendingVisitor.id)];
                case 8:
                    loggedEvent = _k.sent();
                    chatEvent = 'Chat auto transferred to ' + (newAgent.name || newAgent.username || newAgent.nickname) + ((agent && agent.email) ? ' from ' + (agent.name || agent.username || agent.nickname) : '');
                    _e = (_d = Promise).all;
                    return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: agent.nsp, roomName: [agentModel_1.Agents.NotifyAll()], data: payload })];
                case 9:
                    _f = [
                        _k.sent()
                    ];
                    return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'newConversation', nsp: agent.nsp, roomName: [agentModel_1.Agents.NotifyOne(pendingVisitor)], data: conversation.value })];
                case 10:
                    _f = _f.concat([
                        _k.sent()
                    ]);
                    return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'V', broadcast: false, eventName: 'transferChat', nsp: agent.nsp, roomName: [visitorModel_1.Visitor.NotifyOne(pendingVisitor)], data: { agent: pendingVisitor.agent, event: chatEvent }, event: chatEvent })];
                case 11: return [4 /*yield*/, _e.apply(_d, [_f.concat([
                            _k.sent()
                        ])])];
                case 12:
                    promises = _k.sent();
                    _k.label = 13;
                case 13: return [3 /*break*/, 21];
                case 14: return [4 /*yield*/, sessionsManager_1.SessionManager.UnseAgentFromVisitor(visitorID)];
                case 15:
                    pendingVisitor_1 = _k.sent();
                    if (!pendingVisitor_1) return [3 /*break*/, 21];
                    queEvent = enums_1.ComposedENUM(enums_1.DynamicEventLogs.VISITOR_UNASSIGNED, { newEmail: '', oldEmail: agent.email });
                    return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendEventLog(queEvent, (pendingVisitor_1._id) ? pendingVisitor_1._id : pendingVisitor_1.id)];
                case 16:
                    logEvent = _k.sent();
                    _h = (_g = Promise).all;
                    return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'noAgent', nsp: agent.nsp, roomName: [visitorID], data: { state: 2, agent: pendingVisitor_1.agent } })];
                case 17:
                    _j = [
                        _k.sent()
                    ];
                    return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: agent.nsp, roomName: [agentModel_1.Agents.NotifyAll()], data: { id: pendingVisitor_1.id, session: pendingVisitor_1 } })];
                case 18: return [4 /*yield*/, _h.apply(_g, [_j.concat([
                            _k.sent()
                        ])])];
                case 19:
                    promises = _k.sent();
                    // if (logEvent) SocketServer.of(agent.nsp).to(Agents.NotifyAll()).emit('visitorEventLog', logEvent);
                    return [4 /*yield*/, conversationModel_1.Conversations.UpdateConversationState(pendingVisitor_1.conversationID, 1, false)];
                case 20:
                    // if (logEvent) SocketServer.of(agent.nsp).to(Agents.NotifyAll()).emit('visitorEventLog', logEvent);
                    _k.sent();
                    _k.label = 21;
                case 21: return [3 /*break*/, 23];
                case 22:
                    error_2 = _k.sent();
                    console.log(error_2);
                    console.log('error in Transfer Agent Disconnect');
                    return [3 /*break*/, 23];
                case 23: return [2 /*return*/];
            }
        });
    });
}
exports.TransferAgentDisconnect = TransferAgentDisconnect;
function AutoAssignFromQueueAuto(session, agent) {
    if (agent === void 0) { agent = false; }
    return __awaiter(this, void 0, void 0, function () {
        var promises, Agent, QueuedSession, UpdatedSessions, Queuedconversation, logEvent, _a, promises_1, _b, _c, _d, error_3;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _e.trys.push([0, 15, , 16]);
                    return [4 /*yield*/, Promise.all([
                            sessionsManager_1.SessionManager.GetAgentByID((!agent) ? session.agent.id : session._id),
                            sessionsManager_1.SessionManager.GetQueuedSession(session.nsp),
                        ])];
                case 1:
                    promises = _e.sent();
                    Agent = promises[0];
                    QueuedSession = promises[1];
                    if (!(Agent && Agent.chatCount < Agent.concurrentChatLimit && QueuedSession)) return [3 /*break*/, 13];
                    console.log('dequeuing');
                    return [4 /*yield*/, sessionsManager_1.SessionManager.AssignAgent(QueuedSession, (Agent.id || Agent._id), QueuedSession.conversationID)];
                case 2:
                    UpdatedSessions = _e.sent();
                    QueuedSession = UpdatedSessions.visitor;
                    Agent = UpdatedSessions.agent;
                    return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: session.nsp, roomName: [agentModel_1.Agents.NotifyAll()], data: { id: QueuedSession.id, session: QueuedSession } })];
                case 3:
                    _e.sent();
                    if (!(QueuedSession && Agent)) return [3 /*break*/, 11];
                    return [4 /*yield*/, conversationModel_1.Conversations.TransferChatUnmodified(QueuedSession.conversationID, Agent.email)];
                case 4:
                    Queuedconversation = _e.sent();
                    if (!Queuedconversation) return [3 /*break*/, 10];
                    if (!Queuedconversation.value) return [3 /*break*/, 10];
                    return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendEventLog(enums_1.EventLogMessages.REQUEST_FROM_QUEUE, (QueuedSession._id) ? QueuedSession._id : QueuedSession.id)];
                case 5:
                    logEvent = _e.sent();
                    // if (logEvent) SocketServer.of(session.nsp).to(Agents.NotifyAll()).emit('visitorEventLog', logEvent);
                    _a = Queuedconversation.value;
                    return [4 /*yield*/, conversationModel_1.Conversations.getMessages1(QueuedSession.conversationID)];
                case 6:
                    // if (logEvent) SocketServer.of(session.nsp).to(Agents.NotifyAll()).emit('visitorEventLog', logEvent);
                    _a.messages = _e.sent();
                    _c = (_b = Promise).all;
                    return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'newConversation', nsp: session.nsp, roomName: [agentModel_1.Agents.NotifyOne(QueuedSession)], data: Queuedconversation.value })];
                case 7:
                    _d = [
                        _e.sent()
                    ];
                    return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({
                            action: 'emit', to: 'V', broadcast: true, eventName: 'gotAgent', nsp: session.nsp, roomName: [visitorModel_1.Visitor.NotifyOne(QueuedSession)], data: {
                                agent: QueuedSession.agent,
                                cid: QueuedSession.conversationID,
                                state: QueuedSession.state,
                                username: QueuedSession.username,
                                email: QueuedSession.email
                            }
                        })];
                case 8: return [4 /*yield*/, _c.apply(_b, [_d.concat([
                            _e.sent()
                        ])])];
                case 9:
                    promises_1 = _e.sent();
                    return [2 /*return*/, true];
                case 10: return [2 /*return*/, true];
                case 11: return [2 /*return*/, false];
                case 12: return [3 /*break*/, 14];
                case 13: return [2 /*return*/, false];
                case 14: return [3 /*break*/, 16];
                case 15:
                    error_3 = _e.sent();
                    console.log(error_3);
                    console.log('error in Assigning From Queue');
                    return [2 /*return*/, false];
                case 16: return [2 /*return*/];
            }
        });
    });
}
exports.AutoAssignFromQueueAuto = AutoAssignFromQueueAuto;
function AssignQueuedChatToManual(session, sid) {
    return __awaiter(this, void 0, void 0, function () {
        var UpdatedSessions, QueuedSession, conversation, _a, logEvent, _b, promises, _c, _d, _e, error_4;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    _f.trys.push([0, 12, , 13]);
                    console.log('AssignQueuedChatToManual');
                    return [4 /*yield*/, sessionsManager_1.SessionManager.AssignQueuedVisitor(session, sid)];
                case 1:
                    UpdatedSessions = _f.sent();
                    if (!(UpdatedSessions && UpdatedSessions.agent)) return [3 /*break*/, 11];
                    session = UpdatedSessions.agent;
                    QueuedSession = UpdatedSessions.visitor;
                    if (!(session.email)) return [3 /*break*/, 3];
                    return [4 /*yield*/, conversationModel_1.Conversations.TransferChat(QueuedSession.conversationID, session.email, false)];
                case 2:
                    _a = _f.sent();
                    return [3 /*break*/, 4];
                case 3:
                    _a = undefined;
                    _f.label = 4;
                case 4:
                    conversation = _a;
                    if (!(conversation && conversation.value)) return [3 /*break*/, 11];
                    return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendEventLog(enums_1.EventLogMessages.REQUEST_FROM_QUEUE, (QueuedSession._id) ? QueuedSession._id : QueuedSession.id)];
                case 5:
                    logEvent = _f.sent();
                    // if (logEvent) SocketServer.to(Agents.NotifyAll()).emit('visitorEventLog', logEvent);
                    _b = conversation.value;
                    return [4 /*yield*/, conversationModel_1.Conversations.getMessages1(QueuedSession.conversationID)];
                case 6:
                    // if (logEvent) SocketServer.to(Agents.NotifyAll()).emit('visitorEventLog', logEvent);
                    _b.messages = _f.sent();
                    _d = (_c = Promise).all;
                    return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: session.nsp, roomName: [agentModel_1.Agents.NotifyAll()], data: { id: QueuedSession.id, session: QueuedSession } })];
                case 7:
                    _e = [
                        _f.sent()
                    ];
                    //UPDATE QUEUED SESSION VIA PUSH MESSAGE
                    return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'V', broadcast: false, eventName: 'gotAgent', nsp: session.nsp, roomName: [visitorModel_1.Visitor.NotifyOne(QueuedSession)], data: { agent: QueuedSession.agent, state: 3 } })];
                case 8:
                    _e = _e.concat([
                        //UPDATE QUEUED SESSION VIA PUSH MESSAGE
                        _f.sent()
                    ]);
                    //UPDATE ASSIGNED AGENT CONVERSATIIONS 
                    return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'newConversation', nsp: session.nsp, roomName: [agentModel_1.Agents.NotifyOne(QueuedSession)], data: conversation.value })];
                case 9: return [4 /*yield*/, _d.apply(_c, [_e.concat([
                            //UPDATE ASSIGNED AGENT CONVERSATIIONS 
                            _f.sent()
                        ])])];
                case 10:
                    promises = _f.sent();
                    _f.label = 11;
                case 11: return [2 /*return*/, true];
                case 12:
                    error_4 = _f.sent();
                    console.log(error_4);
                    console.log('Error in AssignChatToVisitor Abstraction');
                    return [2 /*return*/, false];
                case 13: return [2 /*return*/];
            }
        });
    });
}
exports.AssignQueuedChatToManual = AssignQueuedChatToManual;
function AssignChatFromInactive(session, AgentEmail, state) {
    return __awaiter(this, void 0, void 0, function () {
        var convo, oldagent, UpdatedSessions, newAgent, visitor, conversation, _a, _b, _c, payload, event, loggedEvent, chatEvent, insertedMessage, error_5;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 25, , 26]);
                    console.log('AssignChatFromInactive');
                    return [4 /*yield*/, conversationModel_1.Conversations.GetConversationById(session.conversationID)];
                case 1:
                    convo = _d.sent();
                    if (!convo.length)
                        return [2 /*return*/, false];
                    oldagent = void 0;
                    return [4 /*yield*/, sessionsManager_1.SessionManager.getAgentByEmail(session.nsp, convo[0].agentEmail)
                        // if (oldagent) console.log(oldagent);
                    ];
                case 2:
                    oldagent = _d.sent();
                    UpdatedSessions = void 0;
                    if (!AgentEmail) return [3 /*break*/, 4];
                    return [4 /*yield*/, sessionsManager_1.SessionManager.AllocateAgentPriority(session, AgentEmail, session.conversationID, (state) ? state : undefined)];
                case 3:
                    UpdatedSessions = _d.sent();
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, sessionsManager_1.SessionManager.AllocateAgent(session, new bson_1.ObjectID(session.conversationID), [], (state) ? state : undefined)];
                case 5:
                    UpdatedSessions = _d.sent();
                    _d.label = 6;
                case 6:
                    if (!(UpdatedSessions && UpdatedSessions.agent)) return [3 /*break*/, 24];
                    newAgent = UpdatedSessions.agent;
                    visitor = UpdatedSessions.visitor;
                    if (!(newAgent.email)) return [3 /*break*/, 8];
                    return [4 /*yield*/, conversationModel_1.Conversations.TransferChat(visitor.conversationID, newAgent.email, false)];
                case 7:
                    _a = _d.sent();
                    return [3 /*break*/, 9];
                case 8:
                    _a = undefined;
                    _d.label = 9;
                case 9:
                    conversation = _a;
                    if (!(conversation && conversation.value)) return [3 /*break*/, 23];
                    if (!(conversation.value.messageReadCount)) return [3 /*break*/, 11];
                    _c = conversation.value;
                    return [4 /*yield*/, conversationModel_1.Conversations.getMessages1(visitor.conversationID)];
                case 10:
                    _b = _c.messages = _d.sent();
                    return [3 /*break*/, 12];
                case 11:
                    _b = [];
                    _d.label = 12;
                case 12:
                    _b;
                    payload = { id: visitor._id || visitor.id, session: visitor };
                    event = '';
                    if (newAgent.email != AgentEmail)
                        event = enums_1.ComposedENUM(enums_1.DynamicEventLogs.CHAT_AUTO_ASS_INACTIVE_DIFF_AGENT, { newEmail: newAgent.email, oldEmail: (AgentEmail) ? AgentEmail : '' });
                    else
                        event = enums_1.ComposedENUM(enums_1.DynamicEventLogs.CHAT_RE_ASSIGNED, { newEmail: newAgent.email, oldEmail: '' });
                    return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendEventLog(event, (visitor._id) ? visitor._id : visitor.id)];
                case 13:
                    loggedEvent = _d.sent();
                    chatEvent = '';
                    (newAgent.email != AgentEmail) ? chatEvent = 'Chat auto Assigned to ' + (newAgent.username || newAgent.name || newAgent.nickname) : chatEvent = 'Chat Re-assigned to ' + (newAgent.username || newAgent.name || newAgent.nickname);
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
                case 14:
                    insertedMessage = _d.sent();
                    if (insertedMessage)
                        conversation.value.messages.push(insertedMessage);
                    return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: session.nsp, roomName: [agentModel_1.Agents.NotifyAll()], data: payload })];
                case 15:
                    _d.sent();
                    if (!(oldagent && (oldagent.nickname != newAgent.nickname) && (oldagent.email != newAgent.email))) return [3 /*break*/, 19];
                    return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'newConversation', nsp: visitor.nsp, roomName: [agentModel_1.Agents.NotifyOne(visitor)], data: conversation.value })];
                case 16:
                    _d.sent();
                    if (!(conversation && conversation.value)) return [3 /*break*/, 18];
                    return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'removeConversation', nsp: visitor.nsp, roomName: [agentModel_1.Agents.NotifyOne(session)], data: { conversation: conversation.value } })];
                case 17:
                    _d.sent();
                    _d.label = 18;
                case 18: return [3 /*break*/, 21];
                case 19: return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'makeConversationActive', nsp: visitor.nsp, roomName: [agentModel_1.Agents.NotifyOne(session)], data: { conversation: conversation.value } })];
                case 20:
                    _d.sent();
                    _d.label = 21;
                case 21: return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'V', broadcast: false, eventName: 'transferChat', nsp: visitor.nsp, roomName: [visitorModel_1.Visitor.NotifyOne(visitor)], data: { agent: visitor.agent, event: chatEvent } })];
                case 22:
                    _d.sent();
                    _d.label = 23;
                case 23: return [2 /*return*/, true];
                case 24: return [2 /*return*/, false];
                case 25:
                    error_5 = _d.sent();
                    console.log(error_5);
                    console.log('error in Assign Chat To Priority Abstraction');
                    return [3 /*break*/, 26];
                case 26: return [2 /*return*/];
            }
        });
    });
}
exports.AssignChatFromInactive = AssignChatFromInactive;
//# sourceMappingURL=AssignChat.js.map