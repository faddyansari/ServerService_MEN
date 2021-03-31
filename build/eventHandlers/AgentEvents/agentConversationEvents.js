"use strict";
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
var agentConversationModel_1 = require("../../models/agentConversationModel");
var sessionsManager_1 = require("../../globals/server/sessionsManager");
var PushNotificationFirebase_1 = require("../../actions/agentActions/PushNotificationFirebase");
var bson_1 = require("bson");
var AgentConversationStatus_1 = require("../../models/AgentConversationStatus");
var AgentConversationsEvents = /** @class */ (function () {
    function AgentConversationsEvents() {
    }
    AgentConversationsEvents.BindConversationEvents = function (socket, origin) {
        AgentConversationsEvents.ConversationSeen(socket, origin);
        AgentConversationsEvents.GetMoreAgentMessages(socket, origin);
        AgentConversationsEvents.createAgentConversation(socket, origin);
        AgentConversationsEvents.getAgentConversation(socket, origin);
        AgentConversationsEvents.InsertAgentMessage(socket, origin);
        AgentConversationsEvents.GetAllConversations(socket, origin);
        AgentConversationsEvents.TypingEvents(socket, origin);
        AgentConversationsEvents.GroupChatEvents(socket, origin);
    };
    AgentConversationsEvents.createAgentConversation = function (socket, origin) {
        var _this = this;
        socket.on('createAgentConversation', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var _a, conversation, result_1, cid_1, agentConvStatus, messages, recievers, messages, result_2, cid_2, messages, recievers, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 19, , 20]);
                        _a = data.conversation.type;
                        switch (_a) {
                            case 'single': return [3 /*break*/, 1];
                            case 'group': return [3 /*break*/, 12];
                        }
                        return [3 /*break*/, 17];
                    case 1: return [4 /*yield*/, agentConversationModel_1.AgentConversations.getConversation(data.conversation.members.map(function (a) { return a.email; }), socket.handshake.session.nsp)];
                    case 2:
                        conversation = _b.sent();
                        if (!!conversation) return [3 /*break*/, 9];
                        return [4 /*yield*/, agentConversationModel_1.AgentConversations.createConversation(data.conversation, socket.handshake.session.nsp)];
                    case 3:
                        result_1 = _b.sent();
                        if (!result_1) return [3 /*break*/, 8];
                        cid_1 = result_1.ops[0]._id;
                        result_1.ops[0].members.forEach(function (member) {
                            AgentConversationStatus_1.AgentConversationStatus.createConversation(cid_1, member.email);
                        });
                        return [4 /*yield*/, AgentConversationStatus_1.AgentConversationStatus.getConversationStatus(result_1.ops[0]._id, socket.handshake.session.email)];
                    case 4:
                        agentConvStatus = _b.sent();
                        messages = [];
                        if (!(agentConvStatus && agentConvStatus.length)) return [3 /*break*/, 6];
                        return [4 /*yield*/, agentConversationModel_1.AgentConversations.getMessagesAsync(result_1.ops[0]._id, agentConvStatus[0].MessageIds)];
                    case 5:
                        messages = _b.sent();
                        _b.label = 6;
                    case 6:
                        result_1.ops[0].messages = (messages && messages.length) ? messages : [];
                        // console.log(result.ops[0]);
                        callback({ status: 'ok', conversation: result_1.ops[0] });
                        return [4 /*yield*/, sessionsManager_1.SessionManager.GetSessionByEmailsFromDatabase(data.conversation.members.filter(function (a) { return a.email != socket.handshake.session.email; }).map(function (a) { return a.email; }), socket.handshake.session.nsp)];
                    case 7:
                        recievers = _b.sent();
                        if (recievers && recievers.length) {
                            recievers.map(function (reciever) {
                                origin.to((reciever.id || reciever._id)).emit('gotNewAgentConversation', { status: 'ok', conversation: (result_1) ? result_1.ops[0] : [] });
                            });
                        }
                        _b.label = 8;
                    case 8: return [3 /*break*/, 11];
                    case 9: return [4 /*yield*/, agentConversationModel_1.AgentConversations.getMessagesAsync(conversation._id, socket.handshake.session.email)];
                    case 10:
                        messages = _b.sent();
                        // let temp = await AgentConversations.getMessagesAsync(conversation._id);
                        conversation.messages = (messages && messages.length) ? messages : [];
                        callback({ status: 'ok', conversation: conversation });
                        _b.label = 11;
                    case 11: return [3 /*break*/, 18];
                    case 12: return [4 /*yield*/, agentConversationModel_1.AgentConversations.createConversation(data.conversation, socket.handshake.session.nsp)];
                    case 13:
                        result_2 = _b.sent();
                        if (!(result_2 && result_2.ops)) return [3 /*break*/, 16];
                        cid_2 = result_2.ops[0]._id;
                        result_2.ops[0].members.forEach(function (member) {
                            AgentConversationStatus_1.AgentConversationStatus.createConversation(cid_2, member.email);
                        });
                        return [4 /*yield*/, agentConversationModel_1.AgentConversations.getMessagesAsync(cid_2, socket.handshake.session.email)];
                    case 14:
                        messages = _b.sent();
                        result_2.ops[0].messages = (messages && messages.length) ? messages : [];
                        callback({ status: 'ok', conversation: result_2.ops[0] });
                        return [4 /*yield*/, sessionsManager_1.SessionManager.GetSessionByEmailsFromDatabase(data.conversation.members.filter(function (a) { return a.email != socket.handshake.session.email; }).map(function (a) { return a.email; }), socket.handshake.session.nsp)];
                    case 15:
                        recievers = _b.sent();
                        if (recievers && recievers.length) {
                            recievers.map(function (reciever) {
                                origin.to((reciever.id || reciever._id)).emit('gotNewAgentConversation', { status: 'ok', conversation: (result_2) ? result_2.ops[0] : [] });
                            });
                        }
                        _b.label = 16;
                    case 16: return [3 /*break*/, 18];
                    case 17: return [3 /*break*/, 18];
                    case 18: return [3 /*break*/, 20];
                    case 19:
                        error_1 = _b.sent();
                        console.log(error_1);
                        console.log('Error in Create Agent Conversation');
                        return [3 /*break*/, 20];
                    case 20: return [2 /*return*/];
                }
            });
        }); });
    };
    AgentConversationsEvents.getAgentConversation = function (socket, origin) {
        var _this = this;
        socket.on('getAgentConversation', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var conversation, messages, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        if (!data.cid) return [3 /*break*/, 4];
                        return [4 /*yield*/, agentConversationModel_1.AgentConversations.getConversationByCid(data.cid)];
                    case 1:
                        conversation = _a.sent();
                        if (!(conversation && conversation.length)) return [3 /*break*/, 3];
                        return [4 /*yield*/, agentConversationModel_1.AgentConversations.getMessagesAsync(conversation[0]._id, socket.handshake.session.email)];
                    case 2:
                        messages = _a.sent();
                        // let temp = await AgentConversations.getMessagesAsync(conversation[0]._id);
                        conversation[0].messages = (messages && messages.length) ? messages : [];
                        callback({ status: 'ok', conversation: conversation[0] });
                        _a.label = 3;
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        callback({ status: 'error', msg: 'Invalid Parameters' });
                        _a.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_2 = _a.sent();
                        console.log(error_2);
                        console.log('Error in Create Agent Conversation');
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        }); });
    };
    AgentConversationsEvents.InsertAgentMessage = function (socket, origin) {
        var _this = this;
        socket.on('insertAgentMessage', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var temp, _a, message, currentConversation_1, insertedMessage_1, recievers, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 7, , 8]);
                        if (!data.message) return [3 /*break*/, 6];
                        _a = {
                            _id: new bson_1.ObjectID(),
                            from: data.message.from,
                            to: data.message.to,
                            body: data.message.body,
                            viewColor: data.message.viewColor,
                            cid: new bson_1.ObjectId(data.message.cid),
                            date: new Date().toISOString(),
                            type: data.message.type,
                            attachment: (data.message.attachment) ? true : false
                        };
                        return [4 /*yield*/, AgentConversationStatus_1.AgentConversationStatus.getActiveParticipants(data.message.cid)
                            // filename: (data.message.attachment) ? data.message.filename : undefined
                        ];
                    case 1:
                        temp = (_a.visibleTo = _b.sent(),
                            _a);
                        message = agentConversationModel_1.AgentConversations.insertMessage(temp);
                        return [4 /*yield*/, agentConversationModel_1.AgentConversations.insertLastMessage(data.message.cid, temp)];
                    case 2:
                        currentConversation_1 = _b.sent();
                        return [4 /*yield*/, message];
                    case 3:
                        insertedMessage_1 = _b.sent();
                        if (!(insertedMessage_1 && insertedMessage_1.ops[0] && currentConversation_1)) return [3 /*break*/, 5];
                        callback({ status: 'ok', currentConversation: currentConversation_1, message: insertedMessage_1.ops[0] });
                        return [4 /*yield*/, sessionsManager_1.SessionManager.GetSessionByEmailsFromDatabase(insertedMessage_1.ops[0].visibleTo.filter(function (m) { return m != socket.handshake.session.email; }), socket.handshake.session.nsp)];
                    case 4:
                        recievers = _b.sent();
                        //console.log('New Message Reciever!');
                        //Firebase work
                        data.message.to.forEach(function (member) {
                            PushNotificationFirebase_1.SendNotification(origin['settings']['api']['firebase']['key'], 'agent-' + member, data.message.from, (insertedMessage_1.ops[0].attachment) ? 'Media Attachment' : insertedMessage_1.ops[0].body, {
                                chatType: 'Agent',
                                currentConversation: currentConversation_1
                            }, true);
                        });
                        //Firebase work end
                        //console.log(reciever);
                        if (recievers && recievers.length) {
                            recievers.map(function (reciever) {
                                origin.to((reciever.id || reciever._id)).emit('gotNewAgentMessage', { currentConversation: currentConversation_1, message: insertedMessage_1.ops[0] });
                            });
                        }
                        return [3 /*break*/, 6];
                    case 5:
                        callback({ status: 'error', msg: 'Unable to insert message' });
                        _b.label = 6;
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        err_1 = _b.sent();
                        callback({ status: 'error' });
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        }); });
    };
    AgentConversationsEvents.GetAllConversations = function (socket, origin) {
        var _this = this;
        socket.on('agentConversationsList', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var conversations;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, agentConversationModel_1.AgentConversations.getAllConversations(socket.handshake.session.email, socket.handshake.session.nsp)];
                    case 1:
                        conversations = _a.sent();
                        callback({ status: 'ok', conversations: conversations });
                        return [2 /*return*/];
                }
            });
        }); });
    };
    AgentConversationsEvents.ConversationSeen = function (socket, origin) {
        var _this = this;
        socket.on('seenAgentConversation', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var abc, conversation_1, messages, recievers, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        return [4 /*yield*/, agentConversationModel_1.AgentConversations.updateMessageReadCount(data.cid, data.userId)];
                    case 1:
                        abc = _a.sent();
                        return [4 /*yield*/, agentConversationModel_1.AgentConversations.getConversationByCid(data.cid)];
                    case 2:
                        conversation_1 = _a.sent();
                        if (!(conversation_1 && conversation_1.length)) return [3 /*break*/, 5];
                        return [4 /*yield*/, agentConversationModel_1.AgentConversations.getLastMessage(conversation_1[0]._id)];
                    case 3:
                        messages = _a.sent();
                        if (messages) {
                            conversation_1[0].messages = messages;
                        }
                        callback({ status: 'ok', currentConversation: conversation_1[0] });
                        return [4 /*yield*/, sessionsManager_1.SessionManager.GetSessionByEmailsFromDatabase(data.to, socket.handshake.session.nsp)];
                    case 4:
                        recievers = _a.sent();
                        if (recievers) {
                            recievers.map(function (reciever) {
                                origin.to((reciever.id || reciever._id)).emit('seenAgentConversation', { LastSeen: conversation_1[0].LastSeen, currentConversation: conversation_1[0] });
                            });
                        }
                        return [3 /*break*/, 6];
                    case 5:
                        //console.log('No conversation found!');
                        callback({ status: 'error', msg: 'No conversation found!' });
                        _a.label = 6;
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        error_3 = _a.sent();
                        console.log('Error in AgentSeenConversation');
                        console.log(error_3);
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        }); });
    };
    AgentConversationsEvents.GetMoreAgentMessages = function (socket, origin) {
        var _this = this;
        socket.on('getMoreAgentMessages', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var messages, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!data.cid) return [3 /*break*/, 2];
                        return [4 /*yield*/, agentConversationModel_1.AgentConversations.getMessagesAsync(data.cid, data.visibleTo, data.chunk)];
                    case 1:
                        messages = _a.sent();
                        callback({ status: 'ok', messages: messages, ended: (messages && messages.length < 20) ? true : false });
                        return [3 /*break*/, 3];
                    case 2:
                        callback({ status: 'error', messages: [] });
                        _a.label = 3;
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        error_4 = _a.sent();
                        console.log(error_4);
                        console.log('Error in get MoreAgentMessages');
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        }); });
    };
    AgentConversationsEvents.TypingEvents = function (socket, origin) {
        var _this = this;
        socket.on('typingStarted', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var agent, reciever;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!data.cid || !data.to || !data.from)
                            throw new Error("Invalid Request");
                        return [4 /*yield*/, sessionsManager_1.SessionManager.updateConversationState(socket.handshake.session.nsp, data.from, data.cid, true)];
                    case 1:
                        agent = _a.sent();
                        return [4 /*yield*/, sessionsManager_1.SessionManager.GetSessionByEmailFromDatabase(data.to, socket.handshake.session.nsp)];
                    case 2:
                        reciever = _a.sent();
                        if (reciever) {
                            socket.to((reciever.id || reciever._id)).emit('userTypingStatus', { from: data.from, conversationState: (agent) ? agent.value.conversationState : {} });
                        }
                        return [2 /*return*/];
                }
            });
        }); });
        socket.on('typingPaused', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var agent, reciever;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!data.cid || !data.to || !data.from)
                            throw new Error("Invalid Request");
                        return [4 /*yield*/, sessionsManager_1.SessionManager.updateConversationState(socket.handshake.session.nsp, data.from, data.cid, false)];
                    case 1:
                        agent = _a.sent();
                        return [4 /*yield*/, sessionsManager_1.SessionManager.GetSessionByEmailFromDatabase(data.to, socket.handshake.session.nsp)];
                    case 2:
                        reciever = _a.sent();
                        if (reciever) {
                            socket.to((reciever.id || reciever._id)).emit('userTypingStatus', { from: data.from, conversationState: (agent) ? agent.value.conversationState : {} });
                        }
                        return [2 /*return*/];
                }
            });
        }); });
    };
    AgentConversationsEvents.GroupChatEvents = function (socket, origin) {
        var _this = this;
        socket.on('addMemberToConversation', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var promises_1, status_1, currentConversation_2, emailsAdded, msg, message, insertedMessage_2, recievers, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 8, , 9]);
                        if (!data.cid || !data.emails)
                            throw new Error("Invalid Request");
                        promises_1 = [];
                        status_1 = [];
                        data.emails.forEach(function (email) {
                            promises_1.push(agentConversationModel_1.AgentConversations.AddMember(data.cid, email));
                            promises_1.push(AgentConversationStatus_1.AgentConversationStatus.AddMember(data.cid, email));
                        });
                        return [4 /*yield*/, Promise.all(promises_1).then(function (response) {
                                response.forEach(function (r, index) {
                                    if (index == 0) {
                                        status_1.push(r);
                                    }
                                    else if (index % 2 == 0) {
                                        status_1.push(r);
                                    }
                                });
                            })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, agentConversationModel_1.AgentConversations.getConversationByCid(data.cid)];
                    case 2:
                        currentConversation_2 = _a.sent();
                        if (!(currentConversation_2 && currentConversation_2.length)) return [3 /*break*/, 7];
                        emailsAdded = status_1.filter(function (s) { return s.added; }).map(function (a) { return a.email; });
                        if (!emailsAdded.length) return [3 /*break*/, 6];
                        msg = socket.handshake.session.email + ' added ' + emailsAdded.join(',');
                        message = agentConversationModel_1.AgentConversations.InsertEventMessage(data.cid, currentConversation_2[0].members.map(function (m) { return m.email; }), msg);
                        return [4 /*yield*/, message];
                    case 3:
                        insertedMessage_2 = _a.sent();
                        if (!(insertedMessage_2 && insertedMessage_2.ops[0] && insertedMessage_2.insertedCount > 0)) return [3 /*break*/, 5];
                        callback({ status: 'ok', currentConversation: currentConversation_2[0], message: insertedMessage_2.ops[0] });
                        return [4 /*yield*/, sessionsManager_1.SessionManager.GetSessionByEmailsFromDatabase(insertedMessage_2.ops[0].visibleTo.filter(function (m) { return m != socket.handshake.session.email; }), socket.handshake.session.nsp)];
                    case 4:
                        recievers = _a.sent();
                        //console.log('New Message Reciever!');
                        //console.log(reciever);
                        if (recievers && recievers.length) {
                            recievers.map(function (reciever) {
                                origin.to((reciever.id || reciever._id)).emit('gotNewAgentEventMessage', { currentConversation: currentConversation_2[0], message: insertedMessage_2.ops[0] });
                            });
                        }
                        _a.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        callback({ status: 'error' });
                        _a.label = 7;
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        err_2 = _a.sent();
                        console.log(err_2);
                        console.log('Error in addMemberToConversation');
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/];
                }
            });
        }); });
        socket.on('removeMemberFromConversation', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var currentConversation_3, msg, message, insertedMessage_3, recievers, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        if (!data.cid || !data.email)
                            throw new Error("Invalid Request");
                        return [4 /*yield*/, AgentConversationStatus_1.AgentConversationStatus.RemoveMember(data.cid, data.email)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, agentConversationModel_1.AgentConversations.getConversationByCid(data.cid)];
                    case 2:
                        currentConversation_3 = _a.sent();
                        if (!(currentConversation_3 && currentConversation_3.length)) return [3 /*break*/, 6];
                        msg = socket.handshake.session.email + ' removed ' + data.email;
                        message = agentConversationModel_1.AgentConversations.InsertEventMessage(data.cid, currentConversation_3[0].members.map(function (m) { return m.email; }), msg);
                        return [4 /*yield*/, message];
                    case 3:
                        insertedMessage_3 = _a.sent();
                        if (!(insertedMessage_3 && insertedMessage_3.ops[0] && insertedMessage_3.insertedCount > 0)) return [3 /*break*/, 6];
                        callback({ status: 'ok', currentConversation: currentConversation_3[0], message: insertedMessage_3.ops[0], removedAgent: data.email });
                        return [4 /*yield*/, sessionsManager_1.SessionManager.GetSessionByEmailsFromDatabase(insertedMessage_3.ops[0].visibleTo.filter(function (m) { return m != socket.handshake.session.email; }), socket.handshake.session.nsp)];
                    case 4:
                        recievers = _a.sent();
                        //console.log('New Message Reciever!');
                        //console.log(reciever);
                        if (recievers && recievers.length) {
                            recievers.map(function (reciever) {
                                origin.to((reciever.id || reciever._id)).emit('gotNewAgentEventMessage', { currentConversation: currentConversation_3[0], message: insertedMessage_3.ops[0], removedAgent: data.email });
                            });
                        }
                        return [4 /*yield*/, agentConversationModel_1.AgentConversations.RemoveMember(data.cid, data.email)];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6:
                        callback({ status: 'ok' });
                        return [3 /*break*/, 8];
                    case 7:
                        err_3 = _a.sent();
                        console.log(err_3);
                        console.log('Error in removeMemberFromConversation');
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        }); });
        socket.on('toggleAdminInGroup', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var currentConversation_4, msg, message, insertedMessage_4, recievers, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        if (!data.cid || !data.email)
                            throw new Error("Invalid Request");
                        return [4 /*yield*/, agentConversationModel_1.AgentConversations.toggleAdmin(data.cid, data.email, data.value)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, agentConversationModel_1.AgentConversations.getConversationByCid(data.cid)];
                    case 2:
                        currentConversation_4 = _a.sent();
                        if (!(currentConversation_4 && currentConversation_4.length)) return [3 /*break*/, 5];
                        msg = data.email + ((data.value) ? ' has been made an admin' : ' has been dismissed as an admin');
                        message = agentConversationModel_1.AgentConversations.InsertEventMessage(data.cid, currentConversation_4[0].members.map(function (m) { return m.email; }), msg);
                        return [4 /*yield*/, message];
                    case 3:
                        insertedMessage_4 = _a.sent();
                        if (!(insertedMessage_4 && insertedMessage_4.ops[0] && insertedMessage_4.insertedCount > 0)) return [3 /*break*/, 5];
                        callback({ status: 'ok', currentConversation: currentConversation_4[0], message: insertedMessage_4.ops[0] });
                        return [4 /*yield*/, sessionsManager_1.SessionManager.GetSessionByEmailsFromDatabase(insertedMessage_4.ops[0].visibleTo.filter(function (m) { return m != socket.handshake.session.email; }), socket.handshake.session.nsp)];
                    case 4:
                        recievers = _a.sent();
                        //console.log('New Message Reciever!');
                        //console.log(reciever);
                        if (recievers && recievers.length) {
                            recievers.map(function (reciever) {
                                origin.to((reciever.id || reciever._id)).emit('gotNewAgentEventMessage', { currentConversation: currentConversation_4[0], message: insertedMessage_4.ops[0] });
                            });
                        }
                        _a.label = 5;
                    case 5:
                        callback({ status: 'ok' });
                        return [3 /*break*/, 7];
                    case 6:
                        err_4 = _a.sent();
                        console.log(err_4);
                        console.log('Error in removeMemberFromConversation');
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        }); });
        socket.on('deleteConversation', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    if (!data.cid || !data.email)
                        throw new Error("Invalid Request");
                    callback({ status: 'ok' });
                }
                catch (err) {
                    console.log(err);
                    console.log('Error in deleteConversation');
                }
                return [2 /*return*/];
            });
        }); });
        socket.on('exitConversation', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    callback({ status: 'ok' });
                }
                catch (err) {
                    console.log(err);
                    console.log('Error in exitConversation');
                }
                return [2 /*return*/];
            });
        }); });
    };
    return AgentConversationsEvents;
}());
exports.AgentConversationsEvents = AgentConversationsEvents;
//# sourceMappingURL=agentConversationEvents.js.map