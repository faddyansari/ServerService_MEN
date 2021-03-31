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
exports.AutomaticEngagement = void 0;
var sessionsManager_1 = require("../../globals/server/sessionsManager");
var mongodb_1 = require("mongodb");
var conversationModel_1 = require("../../models/conversationModel");
var agentModel_1 = require("../../models/agentModel");
var visitorModel_1 = require("../../models/visitorModel");
var enums_1 = require("../../globals/config/enums");
var aws_sqs_1 = require("../aws/aws-sqs");
var companyModel_1 = require("../../models/companyModel");
var __biZZCMiddleWare_1 = require("../../globals/__biZZCMiddleWare");
function AutomaticEngagement(visitorSession, state) {
    return __awaiter(this, void 0, void 0, function () {
        var session, origin, greetingMessage, chatOnInvitation, allAgents, _a, allocatedAgent, cid, UpdatedSessions, conversation, logEvent, payload, lastMessage, messageinsertedID, loggedEvent, newEngagement, UpdatedSessions, conversation, payload, logEvent, lastMessage, messageinsertedID, loggedEvent, newEngagement, error_1, session;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 49, , 52]);
                    return [4 /*yield*/, sessionsManager_1.SessionManager.GetVisitorByID(visitorSession.id || visitorSession._id)];
                case 1:
                    session = (_b.sent());
                    session.username = session.username || 'Guest' + new Date().toLocaleTimeString().split(':').join('').split(' ')[0];
                    session.email = session.email || 'UnRegistered';
                    if (!session)
                        return [2 /*return*/];
                    return [4 /*yield*/, companyModel_1.Company.getSettings(session.nsp)];
                case 2:
                    origin = _b.sent();
                    greetingMessage = origin[0]['settings']['chatSettings']['greetingMessage'];
                    chatOnInvitation = origin[0]['settings']['chatSettings']['permissions']['invitationChatInitiations'];
                    if (!(chatOnInvitation)) return [3 /*break*/, 4];
                    return [4 /*yield*/, sessionsManager_1.SessionManager.GetAllActiveAgentsChatting(session)];
                case 3:
                    _a = _b.sent();
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, sessionsManager_1.SessionManager.GetChattingAgentsForInvite(session)];
                case 5:
                    _a = _b.sent();
                    _b.label = 6;
                case 6:
                    allAgents = _a;
                    if (!session.username)
                        session.username = 'Guest' + new Date().toLocaleTimeString().split(':').join('').split(' ')[0];
                    if (!session.email)
                        session.email = session.email || 'Unregistered';
                    if (!!allAgents) return [3 /*break*/, 7];
                    return [2 /*return*/];
                case 7:
                    allocatedAgent = void 0;
                    cid = new mongodb_1.ObjectID();
                    if (!(origin[0]['settings']['chatSettings']['assignments'].priorityAgent.trim() && chatOnInvitation)) return [3 /*break*/, 29];
                    UpdatedSessions = void 0;
                    if (!chatOnInvitation) return [3 /*break*/, 9];
                    return [4 /*yield*/, sessionsManager_1.SessionManager.AllocateAgentPriority(session, origin[0]['settings']['chatSettings']['assignments'].priorityAgent.trim(), cid, (state) ? state : undefined)];
                case 8:
                    UpdatedSessions = _b.sent();
                    return [3 /*break*/, 11];
                case 9: return [4 /*yield*/, sessionsManager_1.SessionManager.UpdateSession((session._id) ? session._id : session.id, session, (chatOnInvitation) ? 4 : 5, session.state)];
                case 10:
                    // session.state = 5;
                    UpdatedSessions = _b.sent();
                    _b.label = 11;
                case 11:
                    if (!(UpdatedSessions && (UpdatedSessions.agent || !chatOnInvitation))) return [3 /*break*/, 27];
                    allocatedAgent = (UpdatedSessions.agent) ? UpdatedSessions.agent : '';
                    session = (UpdatedSessions.visitor) ? UpdatedSessions.visitor : session;
                    if (!allocatedAgent) return [3 /*break*/, 26];
                    conversation = void 0;
                    if (!!chatOnInvitation) return [3 /*break*/, 13];
                    return [4 /*yield*/, conversationModel_1.Conversations.createConversation(cid, session.email, session.id, session.nsp, session.viewColor, allocatedAgent.email, session.username, 2, session.deviceID)];
                case 12:
                    conversation = _b.sent();
                    _b.label = 13;
                case 13:
                    if (!conversation) return [3 /*break*/, 16];
                    return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendEventLog(enums_1.EventLogMessages.CHAT_INITIATED, (session._id) ? session._id : session.id)];
                case 14:
                    logEvent = _b.sent();
                    if (!(session.url && session.url.length)) return [3 /*break*/, 16];
                    return [4 /*yield*/, sessionsManager_1.SessionManager.UpdateChatInitiatedDetails(session._id || session.id, session.url[session.url.length - 1], 'Agent', ((session.state == 4) || (session.state == 5)) ? true : false)
                        // if (logEvent) origin.to(Agents.NotifyAll()).emit('visitorEventLog', logEvent);
                    ];
                case 15:
                    _b.sent();
                    _b.label = 16;
                case 16:
                    payload = { id: session.id, session: session };
                    if (allocatedAgent.greetingMessage)
                        greetingMessage = allocatedAgent.greetingMessage;
                    lastMessage = void 0;
                    if (!greetingMessage) return [3 /*break*/, 19];
                    lastMessage = {
                        from: session.nsp.substr(1),
                        to: session.username,
                        body: greetingMessage,
                        cid: (conversation && conversation.insertedId) ? conversation.insertedId.toHexString() : '',
                        date: (new Date()).toISOString(),
                        type: 'Agents',
                        attachment: false
                    };
                    if (!(conversation && conversation.insertedCount)) return [3 /*break*/, 19];
                    return [4 /*yield*/, conversationModel_1.Conversations.insertMessage(lastMessage)];
                case 17:
                    messageinsertedID = _b.sent();
                    conversation.ops[0].messages.push(messageinsertedID.ops[0]);
                    return [4 /*yield*/, conversationModel_1.Conversations.UpdateLastMessage(conversation.insertedId.toHexString(), lastMessage)];
                case 18:
                    _b.sent();
                    _b.label = 19;
                case 19:
                    if (!(conversation && conversation.insertedCount)) return [3 /*break*/, 21];
                    if (!allocatedAgent) return [3 /*break*/, 21];
                    return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'newConversation', nsp: session.nsp, roomName: [allocatedAgent.id], data: conversation.ops[0] })
                        // origin.to((allocatedAgent.id as string)).emit('newConversation', conversation.ops[0]);
                    ];
                case 20:
                    _b.sent();
                    _b.label = 21;
                case 21: 
                //Broadcast To All Agents That User Information and State Has Been Updated.
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: session.nsp, roomName: [agentModel_1.Agents.NotifyAll()], data: payload })];
                case 22:
                    //Broadcast To All Agents That User Information and State Has Been Updated.
                    _b.sent();
                    return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendEventLog(enums_1.EventLogMessages.VISITOR_INVITED, (session._id) ? session._id : session.id)];
                case 23: return [4 /*yield*/, _b.sent()];
                case 24:
                    loggedEvent = _b.sent();
                    newEngagement = {
                        clientID: (conversation && conversation.ops[0] && conversation.ops[0].clientID) ? conversation.ops[0].clientID : '',
                        state: (chatOnInvitation) ? 4 : 5,
                        username: session.username,
                        email: session.email,
                        agent: session.agent,
                        greetingMessage: (conversation && conversation.ops[0].messages.length) ? conversation.ops[0].messages[0] : (lastMessage) ? lastMessage : '',
                        cid: (session.conversationID) ? session.conversationID : ''
                    };
                    return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'newEngagement', nsp: session.nsp, roomName: [visitorModel_1.Visitor.NotifyOne(session)], data: newEngagement })];
                case 25:
                    _b.sent();
                    return [3 /*break*/, 26];
                case 26: return [3 /*break*/, 28];
                case 27: 
                //console.log('No Agent')
                return [2 /*return*/];
                case 28: return [3 /*break*/, 48];
                case 29:
                    UpdatedSessions = void 0;
                    if (!chatOnInvitation) return [3 /*break*/, 31];
                    return [4 /*yield*/, sessionsManager_1.SessionManager.AllocateAgent(session, cid, [], (chatOnInvitation) ? 4 : 5)];
                case 30:
                    UpdatedSessions = _b.sent();
                    return [3 /*break*/, 33];
                case 31:
                    session.state = 5;
                    return [4 /*yield*/, sessionsManager_1.SessionManager.UpdateSession((session._id) ? session._id : session.id, session, (chatOnInvitation) ? 4 : 5, session.state)];
                case 32:
                    UpdatedSessions = _b.sent();
                    _b.label = 33;
                case 33:
                    if (!(UpdatedSessions && (UpdatedSessions.agent || !chatOnInvitation))) return [3 /*break*/, 47];
                    allocatedAgent = (UpdatedSessions.agent) ? UpdatedSessions.agent : '';
                    session = (UpdatedSessions.visitor) ? UpdatedSessions.visitor : session;
                    conversation = void 0;
                    if (!chatOnInvitation) return [3 /*break*/, 35];
                    return [4 /*yield*/, conversationModel_1.Conversations.createConversation(cid, session.email, session.id, session.nsp, session.viewColor, (allocatedAgent) ? allocatedAgent.email : '', session.username, (allocatedAgent) ? 2 : 1, session.deviceID)];
                case 34:
                    conversation = _b.sent();
                    _b.label = 35;
                case 35:
                    payload = { id: session.id, session: session };
                    if (!conversation) return [3 /*break*/, 38];
                    return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendEventLog(enums_1.EventLogMessages.CHAT_INITIATED, (session._id) ? session._id : session.id)];
                case 36:
                    logEvent = _b.sent();
                    if (!(session.url && session.url.length)) return [3 /*break*/, 38];
                    return [4 /*yield*/, sessionsManager_1.SessionManager.UpdateChatInitiatedDetails(session._id || session.id, session.url[session.url.length - 1], 'Agent', ((session.state == 4) || (session.state == 5)) ? true : false)
                        // if (logEvent) origin.to(Agents.NotifyAll()).emit('visitorEventLog', logEvent);
                    ];
                case 37:
                    _b.sent();
                    _b.label = 38;
                case 38:
                    if (allocatedAgent && allocatedAgent.greetingMessage)
                        greetingMessage = allocatedAgent.greetingMessage;
                    lastMessage = void 0;
                    if (!greetingMessage) return [3 /*break*/, 41];
                    lastMessage = {
                        from: session.nsp.substr(1),
                        to: session.username,
                        body: greetingMessage,
                        cid: (conversation && conversation.insertedId) ? conversation.insertedId.toHexString() : '',
                        date: (new Date()).toISOString(),
                        type: 'Agents',
                        attachment: false
                    };
                    if (!(conversation && conversation.insertedCount)) return [3 /*break*/, 41];
                    return [4 /*yield*/, conversationModel_1.Conversations.insertMessage(lastMessage)];
                case 39:
                    messageinsertedID = _b.sent();
                    conversation.ops[0].messages.push(messageinsertedID.ops[0]);
                    return [4 /*yield*/, conversationModel_1.Conversations.UpdateLastMessage(conversation.insertedId.toHexString(), lastMessage)];
                case 40:
                    _b.sent();
                    _b.label = 41;
                case 41:
                    if (!(allocatedAgent && conversation)) return [3 /*break*/, 43];
                    return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'newConversation', nsp: session.nsp, roomName: [allocatedAgent.id], data: conversation.ops[0] })];
                case 42:
                    _b.sent();
                    _b.label = 43;
                case 43: 
                //Broadcast To All Agents That User Information and State Has Been Updated.
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: session.nsp, roomName: [agentModel_1.Agents.NotifyAll()], data: payload })];
                case 44:
                    //Broadcast To All Agents That User Information and State Has Been Updated.
                    _b.sent();
                    return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendEventLog(enums_1.EventLogMessages.VISITOR_INVITED, (session._id) ? session._id : session.id)];
                case 45:
                    loggedEvent = _b.sent();
                    newEngagement = {
                        clientID: (conversation && conversation.ops[0] && conversation.ops[0].clientID) ? conversation.ops[0].clientID : '',
                        state: (chatOnInvitation) ? 4 : 5,
                        username: session.username,
                        email: session.email,
                        agent: session.agent,
                        greetingMessage: (conversation && conversation.ops[0].messages.length) ? conversation.ops[0].messages[0] : (lastMessage) ? lastMessage : '',
                        cid: (session.conversationID) ? session.conversationID : ''
                    };
                    return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'newEngagement', nsp: session.nsp, roomName: [visitorModel_1.Visitor.NotifyOne(session)], data: newEngagement })];
                case 46:
                    _b.sent();
                    _b.label = 47;
                case 47: return [2 /*return*/];
                case 48: return [3 /*break*/, 52];
                case 49:
                    error_1 = _b.sent();
                    return [4 /*yield*/, sessionsManager_1.SessionManager.GetVisitorByID(visitorSession)];
                case 50:
                    session = (_b.sent());
                    return [4 /*yield*/, sessionsManager_1.SessionManager.UpdateSession(session.id || session._id, session)];
                case 51:
                    _b.sent();
                    console.log(error_1);
                    console.log('Error in Automatic Engagement');
                    return [3 /*break*/, 52];
                case 52: return [2 /*return*/];
            }
        });
    });
}
exports.AutomaticEngagement = AutomaticEngagement;
//# sourceMappingURL=AutomaticEngagement.js.map