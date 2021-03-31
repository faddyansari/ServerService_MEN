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
var conversationModel_1 = require("../../models/conversationModel");
var agentModel_1 = require("../../models/agentModel");
var visitorModel_1 = require("../../models/visitorModel");
var bson_1 = require("bson");
var Utils_1 = require("../../actions/agentActions/Utils");
var CheckActive_1 = require("../../actions/GlobalActions/CheckActive");
var aws_sqs_1 = require("../../actions/aws/aws-sqs");
var enums_1 = require("../../globals/config/enums");
var EngagementEvents = /** @class */ (function () {
    function EngagementEvents() {
    }
    EngagementEvents.BindEngagementEvents = function (socket, origin) {
        //Updated After Agent Multiple Location
        EngagementEvents.StartChat(socket, origin);
        //Updated After Agent Multiple Location
        EngagementEvents.UpdateUserInfo(socket, origin);
        //Updated After Agent Multiple Location
        EngagementEvents.ChangeState(socket, origin);
        //Updated After Agent Multiple Location
        EngagementEvents.UpdateAdditionalInfo(socket, origin);
        EngagementEvents.UpdateCredentials(socket, origin);
        EngagementEvents.UpdateRequestedCarInfo(socket, origin);
        EngagementEvents.getBotGreetingMessage(socket, origin);
    };
    EngagementEvents.UpdateUserInfo = function (socket, origin) {
        var _this = this;
        socket.on('updateUserInfo', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var session, payload, loggedEvent, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        console.log('updateUserInfo');
                        console.log(data);
                        return [4 /*yield*/, CheckActive_1.MakeActive({ id: socket.handshake.session.id, _id: socket.handshake.session._id })];
                    case 1:
                        session = _a.sent();
                        if (!(session && (session.state == 4 || session.state == 3 || session.state == 2))) return [3 /*break*/, 6];
                        if (!(data.username && data.email)) return [3 /*break*/, 6];
                        if (session.state == 4)
                            data.state = 3;
                        else
                            data.state = session.state;
                        return [4 /*yield*/, sessionsManager_1.SessionManager.UpdateUserInformation(session, data)];
                    case 2:
                        session = (_a.sent());
                        return [4 /*yield*/, visitorModel_1.Visitor.UpdateVisitorInfoByDeviceID(session.deviceID, { username: session.username, email: session.email, phone: (data.phone) ? data.phone : '' })];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, conversationModel_1.Conversations.UpdateVisitorInfo(session.conversationID, session.username, session.email)];
                    case 4:
                        _a.sent();
                        // console.log(socket.handshake.session);
                        callback({ status: 'userUpdated', state: data.state, username: session.username, email: session.email, phone: session.phone ? session.phone : '', message: session.message ? session.message : '' });
                        payload = { id: session.id, session: session };
                        socket.to(socket.handshake.session.id || socket.handshake.session._id).emit('userUpdated', { state: 3, username: session.username, email: session.email, phone: session.phone ? session.phone : '', message: session.message ? session.message : '' });
                        origin.in(agentModel_1.Agents.NotifyAll()).emit('updateUser', payload);
                        origin.to(agentModel_1.Agents.NotifyOne(session)).emit('updateUserInfo', { cid: session.conversationID, username: session.username, email: session.email, phone: session.phone ? session.phone : '', message: session.message ? session.message : '' });
                        return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendEventLog(enums_1.EventLogMessages.USER_UPDATED_INFORMATION, (session._id) ? session._id : session.id)];
                    case 5:
                        loggedEvent = _a.sent();
                        if (loggedEvent)
                            origin.to(agentModel_1.Agents.NotifyAll()).emit('visitorEventLog', loggedEvent);
                        _a.label = 6;
                    case 6:
                        callback({ status: 'error' });
                        return [3 /*break*/, 8];
                    case 7:
                        error_1 = _a.sent();
                        console.log(error_1);
                        console.log('error is Updating User Info');
                        callback({ status: 'error' });
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        }); });
    };
    EngagementEvents.UpdateAdditionalInfo = function (socket, origin) {
        var _this = this;
        socket.on('updateAdditionalDataInfo', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var session, payload, loggedEvent, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, sessionsManager_1.SessionManager.GetVisitorByID(socket.handshake.session.id)];
                    case 1:
                        session = _a.sent();
                        if (!data) return [3 /*break*/, 4];
                        return [4 /*yield*/, sessionsManager_1.SessionManager.SetAdditionalData(data, session.id || session._id)];
                    case 2:
                        _a.sent();
                        callback({ status: 'AdditionalDataUpdated', state: session.state });
                        payload = { id: session.id, session: session };
                        origin.in(agentModel_1.Agents.NotifyAll()).emit('updateUser', payload);
                        return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendEventLog(enums_1.EventLogMessages.GOT_ADDITIONAL_DATA, (session._id) ? session._id : session.id)];
                    case 3:
                        loggedEvent = _a.sent();
                        if (loggedEvent)
                            origin.to(agentModel_1.Agents.NotifyAll()).emit('visitorEventLog', loggedEvent);
                        return [3 /*break*/, 5];
                    case 4:
                        callback({ status: 'error' });
                        _a.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_2 = _a.sent();
                        console.log(error_2);
                        console.log('error is Updating Additional Data Info');
                        callback({ status: 'error' });
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        }); });
    };
    EngagementEvents.UpdateRequestedCarInfo = function (socket, origin) {
        var _this = this;
        socket.on('updateRequestedCarInfo', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var session, loggedEvent, payload, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, sessionsManager_1.SessionManager.GetVisitorByID(socket.handshake.session.id)];
                    case 1:
                        session = _a.sent();
                        if (!data) return [3 /*break*/, 4];
                        return [4 /*yield*/, sessionsManager_1.SessionManager.SetRequestedCarData(data, session.id || session._id)];
                    case 2:
                        _a.sent();
                        callback({ status: 'CarRequestedDataUpdated', state: session.state });
                        return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendEventLog(enums_1.EventLogMessages.GOT_REQUEST_CAR_DATA, (session._id) ? session._id : session.id)];
                    case 3:
                        loggedEvent = _a.sent();
                        if (loggedEvent)
                            origin.to(agentModel_1.Agents.NotifyAll()).emit('visitorEventLog', loggedEvent);
                        payload = { id: session.id, session: session };
                        origin.in(agentModel_1.Agents.NotifyAll()).emit('updateUser', payload);
                        return [3 /*break*/, 5];
                    case 4:
                        callback({ status: 'error' });
                        _a.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_3 = _a.sent();
                        console.log(error_3);
                        console.log('error is Updating Requested Car Data Info');
                        callback({ status: 'error' });
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        }); });
    };
    EngagementEvents.ChangeState = function (socket, origin) {
        var _this = this;
        socket.on('changeState', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var session, prevState, UpdatedSessions, allocatedAgent, cid, greetingMessage, conversation, lastMessage, messageinsertedID, payload, newSession, logEvent, payload, event, loggedEvent, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 22, , 23]);
                        console.log('changeState');
                        return [4 /*yield*/, CheckActive_1.MakeActive(socket.handshake.session)];
                    case 1:
                        session = _a.sent();
                        if (!session) return [3 /*break*/, 21];
                        prevState = session.state;
                        if (!(session.state == 3 || session.state == 4 || session.state == 5)) return [3 /*break*/, 20];
                        if (!(((session.state == 4) || (session.state == 5)) && data.state == 3)) return [3 /*break*/, 3];
                        session.inviteAccepted = true;
                        return [4 /*yield*/, sessionsManager_1.SessionManager.UpdateSession(session._id, session)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        UpdatedSessions = void 0;
                        allocatedAgent = void 0;
                        cid = new bson_1.ObjectID();
                        greetingMessage = origin['settings']['chatSettings']['greetingMessage'];
                        if (!(!session.conversationID && (session.state == 5))) return [3 /*break*/, 16];
                        if (!origin['settings']['chatSettings']['assignments'].priorityAgent.trim()) return [3 /*break*/, 5];
                        return [4 /*yield*/, sessionsManager_1.SessionManager.AllocateAgentPriority(session, origin['settings']['chatSettings']['assignments'].priorityAgent.trim(), cid)];
                    case 4:
                        UpdatedSessions = _a.sent();
                        return [3 /*break*/, 7];
                    case 5: return [4 /*yield*/, sessionsManager_1.SessionManager.AllocateAgent(session, cid)];
                    case 6:
                        UpdatedSessions = _a.sent();
                        _a.label = 7;
                    case 7:
                        if (!UpdatedSessions) return [3 /*break*/, 15];
                        allocatedAgent = (UpdatedSessions.agent) ? UpdatedSessions.agent : '';
                        session = (UpdatedSessions.visitor) ? UpdatedSessions.visitor : session;
                        if (!session) return [3 /*break*/, 15];
                        return [4 /*yield*/, conversationModel_1.Conversations.createConversation(cid, session.email, session.id, session.nsp, session.viewColor, (allocatedAgent) ? allocatedAgent.email : '', session.username, (allocatedAgent) ? 2 : 1, session.deviceID)];
                    case 8:
                        conversation = _a.sent();
                        if (allocatedAgent && allocatedAgent.greetingMessage)
                            greetingMessage = allocatedAgent.greetingMessage;
                        lastMessage = void 0;
                        if (!greetingMessage) return [3 /*break*/, 13];
                        lastMessage = {
                            from: session.nsp.substr(1),
                            to: session.username,
                            body: greetingMessage,
                            cid: (conversation && conversation.insertedId) ? conversation.insertedId.toHexString() : '',
                            date: (new Date()).toISOString(),
                            type: 'Agents',
                            attachment: false
                        };
                        if (!(conversation && conversation.insertedCount)) return [3 /*break*/, 13];
                        if (!(session.url && session.url.length)) return [3 /*break*/, 10];
                        return [4 /*yield*/, sessionsManager_1.SessionManager.UpdateChatInitiatedDetails(session._id || session.id, session.url[session.url.length - 1], 'Visitor', ((session.state == 4) || (session.state == 5)) ? true : false)];
                    case 9:
                        _a.sent();
                        _a.label = 10;
                    case 10: return [4 /*yield*/, conversationModel_1.Conversations.insertMessage(lastMessage)];
                    case 11:
                        messageinsertedID = _a.sent();
                        conversation.ops[0].messages.push(messageinsertedID.ops[0]);
                        return [4 /*yield*/, conversationModel_1.Conversations.UpdateLastMessage(conversation.insertedId.toHexString(), lastMessage)];
                    case 12:
                        _a.sent();
                        _a.label = 13;
                    case 13:
                        if (allocatedAgent && conversation) {
                            origin.to(allocatedAgent.id).emit('newConversation', conversation.ops[0]);
                        }
                        payload = { id: session._id, session: session };
                        origin.in(agentModel_1.Agents.NotifyAll()).emit('updateUser', payload);
                        newSession = {
                            clientID: (conversation.ops[0].clientID) ? conversation.ops[0].clientID : '',
                            agent: (allocatedAgent) ? session.agent : undefined,
                            cid: session.conversationID,
                            state: session.state,
                            username: session.username,
                            email: session.email,
                            phone: (session.phone ? session.phone : ''),
                            message: (session.message) ? session.message : ''
                        };
                        callback({
                            status: 'ok',
                            session: newSession
                        });
                        delete newSession.greetingMessage;
                        // console.log("greeting message")
                        if (conversation)
                            socket.to(visitorModel_1.Visitor.NotifyOne(session)).emit('gotAgent', newSession);
                        return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendEventLog(enums_1.EventLogMessages.CHAT_INITIATED, (session._id) ? session._id : session.id)];
                    case 14:
                        logEvent = _a.sent();
                        if (logEvent)
                            origin.to(agentModel_1.Agents.NotifyAll()).emit('visitorEventLog', logEvent);
                        _a.label = 15;
                    case 15: return [3 /*break*/, 19];
                    case 16: return [4 /*yield*/, sessionsManager_1.SessionManager.UpdateState(socket.handshake.session, parseInt(data.state))];
                    case 17:
                        session = (_a.sent());
                        socket.handshake.session = session;
                        if (!session) return [3 /*break*/, 19];
                        payload = { id: session._id, session: session };
                        origin.in(agentModel_1.Agents.NotifyAll()).emit('updateUser', payload);
                        socket.to(socket.handshake.session.id || socket.handshake.session._id).emit('userUpdated', session);
                        event = enums_1.ComposedENUM(enums_1.DynamicEventLogs.VISITOR_STATE_CHANGED, { newEmail: '', oldEmail: '', oldstate: Utils_1.Utils.GetStateKey(prevState), newstate: Utils_1.Utils.GetStateKey(data.state) });
                        callback({ status: 'ok', session: session });
                        return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendEventLog(event, (session._id) ? session._id : session.id)];
                    case 18:
                        loggedEvent = _a.sent();
                        if (loggedEvent)
                            origin.to(agentModel_1.Agents.NotifyAll()).emit('visitorEventLog', loggedEvent);
                        return [2 /*return*/];
                    case 19:
                        callback({ status: 'error' });
                        return [2 /*return*/];
                    case 20:
                        callback({ status: 'error' });
                        return [2 /*return*/];
                    case 21:
                        callback({ status: 'error' });
                        return [2 /*return*/];
                    case 22:
                        error_4 = _a.sent();
                        console.log(error_4);
                        console.log('Error in Change State');
                        callback({ status: 'error' });
                        return [3 /*break*/, 23];
                    case 23: return [2 /*return*/];
                }
            });
        }); });
    };
    EngagementEvents.UpdateCredentials = function (socket, origin) {
        var _this = this;
        socket.on('updateCredentials', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var session, payload, loggedEvent, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 9, , 10]);
                        return [4 /*yield*/, CheckActive_1.MakeActive(socket.handshake.session)];
                    case 1:
                        session = _a.sent();
                        if (!session) return [3 /*break*/, 7];
                        if (!(data.username && data.email)) return [3 /*break*/, 5];
                        return [4 /*yield*/, sessionsManager_1.SessionManager.UpdateUserInformation(session, data)];
                    case 2:
                        session = (_a.sent());
                        return [4 /*yield*/, conversationModel_1.Conversations.UpdateVisitorInfo(session.conversationID, data.username, data.email)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, visitorModel_1.Visitor.UpdateVisitorInfoByDeviceID(session.deviceID, { username: data.username, email: data.email, phone: (data.phone) ? data.phone : '' })];
                    case 4:
                        _a.sent();
                        callback({
                            status: 'ok',
                            username: data.username,
                            email: data.email,
                            phone: (data.phone) ? data.phone : '',
                            message: (data.message) ? data.message : ''
                        });
                        _a.label = 5;
                    case 5:
                        payload = { id: session.id, session: session };
                        socket.to(socket.handshake.session.id || socket.handshake.session._id).emit('userUpdated', {
                            status: 'credentialsUpdated',
                            username: data.username,
                            email: data.email,
                            phone: data.phone,
                            message: data.message
                        });
                        origin.in(agentModel_1.Agents.NotifyAll()).emit('updateUser', payload);
                        origin.to(agentModel_1.Agents.NotifyOne(session)).emit('updateUserInfo', { cid: session.conversationID, username: session.username, email: session.email, phone: session.phone ? session.phone : '', message: session.message ? session.message : '' });
                        return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendEventLog(enums_1.EventLogMessages.VISITOR_CREDENTIALS_UPDATED, (session._id) ? session._id : session.id)];
                    case 6:
                        loggedEvent = _a.sent();
                        if (loggedEvent)
                            origin.to(agentModel_1.Agents.NotifyAll()).emit('visitorEventLog', loggedEvent);
                        return [3 /*break*/, 8];
                    case 7:
                        callback({ status: 'error' });
                        _a.label = 8;
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        error_5 = _a.sent();
                        console.log(error_5);
                        console.log('error is Updating User Info');
                        callback({ status: 'error' });
                        return [3 /*break*/, 10];
                    case 10: return [2 /*return*/];
                }
            });
        }); });
    };
    EngagementEvents.StartChat = function (socket, origin) {
        var _this = this;
        socket.on('userinformation', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var session, greetingMessage, allAgents, allocatedAgent, cid, UpdatedSessions, _a, conversation, payload, temp_1, credentials, messageinserted, lastMessage, messageinsertedID, logEvent, UpdatedSessions, _b, conversation, payload, temp_2, credentials, messageinserted, lastMessage, messageinsertedID, logEvent, error_6, session;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 45, , 47]);
                        session = void 0;
                        greetingMessage = origin['settings']['chatSettings']['greetingMessage'];
                        return [4 /*yield*/, CheckActive_1.MakeActive(socket.handshake.session, data)];
                    case 1:
                        session = _c.sent();
                        if (!session) return [3 /*break*/, 43];
                        return [4 /*yield*/, sessionsManager_1.SessionManager.GetAllActiveAgentsChatting(session)];
                    case 2:
                        allAgents = _c.sent();
                        if (!!allAgents) return [3 /*break*/, 3];
                        callback({ status: 'noAgent' });
                        return [2 /*return*/];
                    case 3:
                        //Allocating Agent From BestFit Method || Manual Assignment If State == 4
                        if (session.state == 4 || session.state == 2 || session.state == 3) {
                            callback({ status: 'invalidRequest' });
                            return [2 /*return*/];
                        }
                        allocatedAgent = void 0;
                        cid = new bson_1.ObjectID();
                        if (!origin['settings']['chatSettings']['assignments'].priorityAgent.trim()) return [3 /*break*/, 24];
                        if (!(session.selectedAgent)) return [3 /*break*/, 5];
                        return [4 /*yield*/, sessionsManager_1.SessionManager.AllocateAgentPriority(session, session.selectedAgent, cid)];
                    case 4:
                        _a = _c.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        _a = undefined;
                        _c.label = 6;
                    case 6:
                        UpdatedSessions = _a;
                        if (!!UpdatedSessions) return [3 /*break*/, 8];
                        return [4 /*yield*/, sessionsManager_1.SessionManager.AllocateAgentPriority(session, origin['settings']['chatSettings']['assignments'].priorityAgent.trim(), cid)];
                    case 7:
                        UpdatedSessions = _c.sent();
                        _c.label = 8;
                    case 8:
                        if (!(UpdatedSessions && UpdatedSessions.agent)) return [3 /*break*/, 22];
                        session = UpdatedSessions.visitor;
                        allocatedAgent = UpdatedSessions.agent;
                        if (!allocatedAgent) return [3 /*break*/, 20];
                        return [4 /*yield*/, conversationModel_1.Conversations.createConversation(cid, session.email, session.id, session.nsp, session.viewColor, allocatedAgent.email, session.username, 2, session.deviceID)];
                    case 9:
                        conversation = _c.sent();
                        if (!(conversation && conversation.insertedCount > 0)) return [3 /*break*/, 19];
                        if (!(session.url && session.url.length)) return [3 /*break*/, 11];
                        return [4 /*yield*/, sessionsManager_1.SessionManager.UpdateChatInitiatedDetails(session._id || session.id, session.url[session.url.length - 1], 'Visitor', ((session.state == 4) || (session.state == 5)) ? true : false)
                            //Visitor State Data to Update
                        ];
                    case 10:
                        _c.sent();
                        _c.label = 11;
                    case 11:
                        payload = { id: session.id, session: session };
                        temp_1 = '<h5 class="clearfix m-b-10"> Credentials Update </h5>';
                        Object.keys(data).map(function (key) {
                            temp_1 += key + ' : ' + data[key] + '<br>';
                        });
                        temp_1 += 'country : ' + socket.handshake.session.fullCountryName.toString() + '<br>';
                        credentials = {
                            from: socket.handshake.session.nsp,
                            to: session.username,
                            body: temp_1,
                            cid: conversation.insertedId.toHexString(),
                            date: (new Date()).toISOString(),
                            type: 'Visitors',
                            attachment: false,
                            chatFormData: 'Credentials Updated',
                            delivered: true
                        };
                        return [4 /*yield*/, conversationModel_1.Conversations.insertMessage(credentials)];
                    case 12:
                        messageinserted = _c.sent();
                        if (!messageinserted) return [3 /*break*/, 17];
                        conversation.ops[0].messages.push(messageinserted.ops[0]);
                        if (!!allocatedAgent.greetingMessage) return [3 /*break*/, 14];
                        return [4 /*yield*/, conversationModel_1.Conversations.UpdateLastMessage(conversation.insertedId.toHexString(), credentials)];
                    case 13:
                        _c.sent();
                        return [3 /*break*/, 17];
                    case 14:
                        greetingMessage = allocatedAgent.greetingMessage;
                        if (!(conversation && greetingMessage)) return [3 /*break*/, 17];
                        if (!greetingMessage) return [3 /*break*/, 17];
                        lastMessage = {
                            from: socket.handshake.session.nsp,
                            to: session.username,
                            body: greetingMessage,
                            cid: conversation.insertedId.toHexString(),
                            date: (new Date()).toISOString(),
                            type: 'Agents',
                            attachment: false,
                            delivered: true
                        };
                        return [4 /*yield*/, conversationModel_1.Conversations.insertMessage(lastMessage)];
                    case 15:
                        messageinsertedID = _c.sent();
                        conversation.ops[0].messages.push(messageinsertedID.ops[1]);
                        return [4 /*yield*/, conversationModel_1.Conversations.UpdateLastMessage(conversation.insertedId.toHexString(), lastMessage)];
                    case 16:
                        _c.sent();
                        _c.label = 17;
                    case 17:
                        //Notify Allocated Agent That A New Conversation has been autoAssigned. 
                        //Check if Allocated Agent is Still Active. Just a precautionary Case. 
                        if (allocatedAgent) {
                            origin.to(allocatedAgent.id).emit('newConversation', conversation.ops[0]);
                        }
                        //Broadcast To All Agents That User Information and State Has Been Updated.
                        origin.in(agentModel_1.Agents.NotifyAll()).emit('updateUser', payload);
                        //Update User Status Back to Visitor Window
                        callback({
                            clientID: (conversation.ops[0].clientID) ? conversation.ops[0].clientID : '',
                            agent: session.agent,
                            cid: session.conversationID,
                            state: session.state,
                            credentials: (conversation) ? conversation.ops[0].messages[0] : '',
                            greetingMessage: (conversation) ? conversation.ops[0].messages[1] : '',
                            username: session.username,
                            email: session.email,
                            phone: (session.phone ? session.phone : ''),
                            message: (session.message) ? session.message : ''
                        });
                        socket.to(visitorModel_1.Visitor.NotifyOne(session)).emit('gotAgent', {
                            clientID: (conversation.ops[0].clientID) ? conversation.ops[0].clientID : '',
                            agent: (allocatedAgent) ? session.agent : undefined,
                            cid: session.conversationID,
                            state: session.state,
                            username: session.username,
                            email: session.email,
                            credentials: (conversation) ? conversation.ops[0].messages[0] : '',
                            greetingMessage: (conversation) ? conversation.ops[0].messages[1] : '',
                            phone: (session.phone ? session.phone : ''),
                            message: (session.message) ? session.message : ''
                        });
                        return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendEventLog(enums_1.EventLogMessages.CHAT_INITIATED, (session._id) ? session._id : session.id)];
                    case 18:
                        logEvent = _c.sent();
                        if (logEvent)
                            origin.to(agentModel_1.Agents.NotifyAll()).emit('visitorEventLog', logEvent);
                        _c.label = 19;
                    case 19: return [3 /*break*/, 21];
                    case 20:
                        console.log('No Agent');
                        callback({ status: 'noAgent' });
                        _c.label = 21;
                    case 21: return [3 /*break*/, 23];
                    case 22:
                        //console.log('No Agent')
                        callback({ status: 'noAgent' });
                        _c.label = 23;
                    case 23: return [2 /*return*/];
                    case 24:
                        if (!(session.selectedAgent)) return [3 /*break*/, 26];
                        return [4 /*yield*/, sessionsManager_1.SessionManager.AllocateAgentPriority(session, session.selectedAgent, cid)];
                    case 25:
                        _b = _c.sent();
                        return [3 /*break*/, 27];
                    case 26:
                        _b = undefined;
                        _c.label = 27;
                    case 27:
                        UpdatedSessions = _b;
                        if (!!UpdatedSessions) return [3 /*break*/, 29];
                        return [4 /*yield*/, sessionsManager_1.SessionManager.AllocateAgent(session, cid)];
                    case 28:
                        UpdatedSessions = _c.sent();
                        _c.label = 29;
                    case 29:
                        if (!UpdatedSessions) return [3 /*break*/, 42];
                        allocatedAgent = UpdatedSessions.agent;
                        session = UpdatedSessions.visitor;
                        return [4 /*yield*/, conversationModel_1.Conversations.createConversation(cid, session.email, session.id, session.nsp, session.viewColor, (allocatedAgent) ? allocatedAgent.email : '', session.username, (allocatedAgent) ? 2 : 1, session.deviceID)];
                    case 30:
                        conversation = _c.sent();
                        payload = { id: session.id, session: session };
                        temp_2 = '<h5 class="clearfix m-b-10"> Credentials Update </h5>';
                        Object.keys(data).map(function (key) {
                            temp_2 += key + ' : ' + data[key] + '<br>';
                        });
                        temp_2 += 'country : ' + socket.handshake.session.fullCountryName.toString() + '<br>';
                        credentials = {
                            from: socket.handshake.session.nsp,
                            to: session.username,
                            body: temp_2,
                            cid: conversation.insertedId.toHexString(),
                            date: (new Date()).toISOString(),
                            type: 'Visitors',
                            attachment: false,
                            chatFormData: 'Credentials Updated',
                            delivered: true
                        };
                        return [4 /*yield*/, conversationModel_1.Conversations.insertMessage(credentials)];
                    case 31:
                        messageinserted = _c.sent();
                        if (!messageinserted) return [3 /*break*/, 41];
                        conversation.ops[0].messages.push(messageinserted.ops[0]);
                        if (!(allocatedAgent && !allocatedAgent.greetingMessage)) return [3 /*break*/, 33];
                        return [4 /*yield*/, conversationModel_1.Conversations.UpdateLastMessage(conversation.insertedId.toHexString(), credentials)];
                    case 32:
                        _c.sent();
                        return [3 /*break*/, 34];
                    case 33:
                        if (allocatedAgent && allocatedAgent.greetingMessage)
                            greetingMessage = allocatedAgent.greetingMessage;
                        _c.label = 34;
                    case 34:
                        if (!(conversation && greetingMessage)) return [3 /*break*/, 41];
                        if (!(session.url && session.url.length)) return [3 /*break*/, 36];
                        return [4 /*yield*/, sessionsManager_1.SessionManager.UpdateChatInitiatedDetails(session._id || session.id, session.url[session.url.length - 1], 'Visitor', ((session.state == 4) || (session.state == 5)) ? true : false)];
                    case 35:
                        _c.sent();
                        _c.label = 36;
                    case 36:
                        if (!greetingMessage) return [3 /*break*/, 39];
                        lastMessage = {
                            from: socket.handshake.session.nsp,
                            to: session.username,
                            body: greetingMessage,
                            cid: conversation.insertedId.toHexString(),
                            date: (new Date()).toISOString(),
                            type: 'Agents',
                            attachment: false,
                            delivered: true
                        };
                        return [4 /*yield*/, conversationModel_1.Conversations.insertMessage(lastMessage)];
                    case 37:
                        messageinsertedID = _c.sent();
                        conversation.ops[0].messages.push(messageinsertedID.ops[0]);
                        return [4 /*yield*/, conversationModel_1.Conversations.UpdateLastMessage(conversation.insertedId.toHexString(), lastMessage)];
                    case 38:
                        _c.sent();
                        _c.label = 39;
                    case 39: return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendEventLog(enums_1.EventLogMessages.CHAT_INITIATED, (session._id) ? session._id : session.id)];
                    case 40:
                        logEvent = _c.sent();
                        if (logEvent)
                            origin.to(agentModel_1.Agents.NotifyAll()).emit('visitorEventLog', logEvent);
                        _c.label = 41;
                    case 41:
                        //Update User Status Back to Visitor Window
                        //Check if Allocated Agent is Still Active. Just a precautionary Case. 
                        if (allocatedAgent && conversation) {
                            origin.to(allocatedAgent.id).emit('newConversation', conversation.ops[0]);
                        }
                        //Broadcast To All Agents That User Information and State Has Been Updated.
                        origin.in(agentModel_1.Agents.NotifyAll()).emit('updateUser', payload);
                        if (allocatedAgent)
                            callback({
                                clientID: (conversation.ops[0].clientID) ? conversation.ops[0].clientID : '',
                                agent: session.agent,
                                cid: session.conversationID,
                                state: session.state,
                                credentials: (conversation) ? conversation.ops[0].messages[0] : '',
                                greetingMessage: (greetingMessage && conversation) ? conversation.ops[0].messages[1] : '',
                                username: session.username,
                                email: session.email,
                                phone: (session.phone ? session.phone : ''),
                                message: (session.message) ? session.message : ''
                            });
                        else
                            callback({
                                clientID: (conversation.ops[0].clientID) ? conversation.ops[0].clientID : '',
                                agent: session.agent,
                                cid: session.conversationID,
                                state: session.state,
                                credentials: (conversation) ? conversation.ops[0].messages[0] : '',
                                greetingMessage: (greetingMessage && conversation) ? conversation.ops[0].messages[1] : '',
                                username: session.username,
                                email: session.email,
                                phone: (session.phone ? session.phone : ''),
                                message: (session.message) ? session.message : ''
                            });
                        // console.log("greeting message")
                        if (conversation)
                            socket.to(visitorModel_1.Visitor.NotifyOne(session)).emit('gotAgent', {
                                clientID: (conversation.ops[0].clientID) ? conversation.ops[0].clientID : '',
                                agent: (allocatedAgent) ? session.agent : undefined,
                                cid: session.conversationID,
                                state: session.state,
                                username: session.username,
                                email: session.email,
                                credentials: (conversation) ? conversation.ops[0].messages[0] : '',
                                greetingMessage: (greetingMessage && conversation) ? conversation.ops[0].messages[1] : '',
                                phone: (session.phone ? session.phone : ''),
                                message: (session.message) ? session.message : ''
                            });
                        return [3 /*break*/, 42];
                    case 42: return [3 /*break*/, 44];
                    case 43:
                        callback({ error: 'There is Some Error When Saving User Information' });
                        _c.label = 44;
                    case 44: return [3 /*break*/, 47];
                    case 45:
                        error_6 = _c.sent();
                        return [4 /*yield*/, sessionsManager_1.SessionManager.getVisitor(socket.handshake.session)];
                    case 46:
                        session = _c.sent();
                        session.state = 1;
                        sessionsManager_1.SessionManager.UpdateSession(session.id, session);
                        console.log('Error in Creating Conversation  While Agent Is Assigned');
                        console.log(error_6);
                        callback({ error: 'There is Some Error When Saving User Information' });
                        return [3 /*break*/, 47];
                    case 47: return [2 /*return*/];
                }
            });
        }); });
    };
    EngagementEvents.getBotGreetingMessage = function (socket, origin) {
        var _this = this;
        socket.on('getBotGreetingMessage', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var session, message, updatedSession, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, sessionsManager_1.SessionManager.GetVisitorByID(socket.handshake.session.id)];
                    case 1:
                        session = _a.sent();
                        if (!(data && data.state == 1 || data.state == 8)) return [3 /*break*/, 3];
                        message = void 0;
                        if (origin['settings'].chatSettings.botGreetingMessage) {
                            message = [{
                                    from: 'Assistant',
                                    to: (session.username) ? session.username : '',
                                    body: origin['settings'].chatSettings.botGreetingMessage,
                                    date: new Date().toISOString(),
                                    type: 'ChatBot',
                                    attachment: false
                                }];
                        }
                        session.state = 8;
                        return [4 /*yield*/, sessionsManager_1.SessionManager.UpdateSession(session.id || session._id, session)];
                    case 2:
                        updatedSession = _a.sent();
                        callback({ botGreetingMessage: message, session: session });
                        return [3 /*break*/, 4];
                    case 3:
                        callback({ botGreetingMessage: [], session: session });
                        _a.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_7 = _a.sent();
                        console.log(error_7);
                        console.log('error is getting bot Greeting Message');
                        callback({ status: 'error' });
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        }); });
    };
    return EngagementEvents;
}());
exports.EngagementEvents = EngagementEvents;
//# sourceMappingURL=engagementEvents.js.map