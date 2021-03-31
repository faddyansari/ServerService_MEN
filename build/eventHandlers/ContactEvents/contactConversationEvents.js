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
var contactConversationModel_1 = require("../../models/contactConversationModel");
var PushNotificationFirebase_1 = require("../../actions/agentActions/PushNotificationFirebase");
var bson_1 = require("bson");
var contactSessionsManager_1 = require("../../globals/server/contactSessionsManager");
var ContactConversationsEvents = /** @class */ (function () {
    function ContactConversationsEvents() {
    }
    ContactConversationsEvents.BindConversationEvents = function (socket, origin) {
        ContactConversationsEvents.ConversationSeen(socket, origin);
        ContactConversationsEvents.createContactConversation(socket, origin);
        ContactConversationsEvents.InsertContactMessage(socket, origin);
        ContactConversationsEvents.GetAllConversations(socket, origin);
        ContactConversationsEvents.getThreadList(socket, origin);
        ContactConversationsEvents.getThread(socket, origin);
        ContactConversationsEvents.getThreadByCid(socket, origin);
        ContactConversationsEvents.getMoreMessages(socket, origin);
        ContactConversationsEvents.TypingEvents(socket, origin);
    };
    ContactConversationsEvents.createContactConversation = function (socket, origin) {
        var _this = this;
        socket.on('createContactConversation', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var conversation, result, conversation_1, temp, reciever, temp, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 14, , 15]);
                        if (!data.conBody) return [3 /*break*/, 12];
                        return [4 /*yield*/, contactConversationModel_1.ContactConversations.getConversation(data.conBody.toContact, data.conBody.fromContact, socket.handshake.session.nsp)];
                    case 1:
                        conversation = _a.sent();
                        if (!!conversation) return [3 /*break*/, 9];
                        return [4 /*yield*/, contactConversationModel_1.ContactConversations.createConversation(data.conBody, socket.handshake.session.nsp)];
                    case 2:
                        result = _a.sent();
                        if (!result) return [3 /*break*/, 7];
                        return [4 /*yield*/, contactConversationModel_1.ContactConversations.getConversationByCid(result.ops[0]._id)];
                    case 3:
                        conversation_1 = _a.sent();
                        if (!conversation_1.length) return [3 /*break*/, 5];
                        return [4 /*yield*/, contactConversationModel_1.ContactConversations.getMessagesAsync(conversation_1[0]._id)];
                    case 4:
                        temp = _a.sent();
                        conversation_1[0].messages = (temp && temp.length) ? temp : [];
                        _a.label = 5;
                    case 5:
                        callback({ status: 'ok', conversation: conversation_1[0] });
                        return [4 /*yield*/, contactSessionsManager_1.ContactSessionManager.GetSessionByEmailFromDatabase(data.conBody.toContact, socket.handshake.session.nsp)];
                    case 6:
                        reciever = _a.sent();
                        if (reciever) {
                            origin.to((reciever.id || reciever._id)).emit('gotNewContactConversation', { status: 'ok', conversation: conversation_1[0] });
                        }
                        return [3 /*break*/, 8];
                    case 7:
                        callback({ status: 'error', msg: 'Error in creating conversation' });
                        _a.label = 8;
                    case 8: return [3 /*break*/, 11];
                    case 9: return [4 /*yield*/, contactConversationModel_1.ContactConversations.getMessagesAsync(conversation._id)];
                    case 10:
                        temp = _a.sent();
                        conversation.messages = (temp && temp.length) ? temp : [];
                        callback({ status: 'ok', conversation: conversation });
                        _a.label = 11;
                    case 11: return [3 /*break*/, 13];
                    case 12:
                        callback({ status: 'error', msg: 'Invalid Parameters' });
                        _a.label = 13;
                    case 13: return [3 /*break*/, 15];
                    case 14:
                        error_1 = _a.sent();
                        console.log(error_1);
                        console.log('Error in Create Contact Conversation');
                        callback({ status: 'error' });
                        return [3 /*break*/, 15];
                    case 15: return [2 /*return*/];
                }
            });
        }); });
    };
    ContactConversationsEvents.InsertContactMessage = function (socket, origin) {
        var _this = this;
        socket.on('insertContactMessage', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var temp, message, currentConversation, insertedMessage, reciever, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 8, , 9]);
                        if (!data.message) return [3 /*break*/, 6];
                        temp = {
                            _id: new bson_1.ObjectID(),
                            from: data.message.from,
                            to: data.message.to,
                            body: data.message.body,
                            cid: new bson_1.ObjectId(data.message.cid),
                            date: new Date().toISOString(),
                            type: data.message.type,
                            attachment: (data.message.attachment) ? true : false,
                            filename: (data.message.attachment) ? data.message.filename : undefined
                        };
                        message = contactConversationModel_1.ContactConversations.insertMessage(temp);
                        return [4 /*yield*/, contactConversationModel_1.ContactConversations.insertLastMessage(data.message.cid, temp)];
                    case 1:
                        currentConversation = _a.sent();
                        return [4 /*yield*/, message];
                    case 2:
                        insertedMessage = _a.sent();
                        if (!(insertedMessage && insertedMessage.ops[0] && currentConversation && currentConversation.value)) return [3 /*break*/, 4];
                        callback({ status: 'ok', currentConversation: currentConversation.value, message: insertedMessage.ops[0] });
                        return [4 /*yield*/, contactSessionsManager_1.ContactSessionManager.GetSessionByEmailFromDatabase(data.message.to, socket.handshake.session.nsp)];
                    case 3:
                        reciever = _a.sent();
                        if (origin['settings']['api']['firebase']['key']) {
                            if (reciever && reciever.isMobile && reciever.email) {
                                //console.log(reciever.email.split('@')[0]);
                                PushNotificationFirebase_1.SendNotification(origin['settings']['api']['firebase']['key'], reciever.email, (currentConversation.value.from == insertedMessage.ops[0].from) ? currentConversation.value.from_name : currentConversation.value.to_name, (insertedMessage.ops[0].attachment) ? 'Media Attachment' : insertedMessage.ops[0].body, {
                                    currentConversation: currentConversation.value
                                }, true);
                            }
                        }
                        //console.log('New Message Reciever!');
                        //console.log(reciever);
                        if (reciever) {
                            origin.to((reciever.id || reciever._id)).emit('gotNewContactMessage', { currentConversation: currentConversation.value, message: insertedMessage.ops[0] });
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        callback({ status: 'error', msg: 'Unable to insert message' });
                        _a.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        callback({ status: 'error', msg: 'Invalid Parameters' });
                        _a.label = 7;
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        err_1 = _a.sent();
                        console.log(err_1);
                        console.log('Error in InsertContactMessage');
                        callback({ status: 'error' });
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/];
                }
            });
        }); });
    };
    ContactConversationsEvents.GetAllConversations = function (socket, origin) {
        var _this = this;
        socket.on('getAllContactConversations', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var conversations;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, contactConversationModel_1.ContactConversations.getAllConversations(socket.handshake.session.nsp)];
                    case 1:
                        conversations = _a.sent();
                        callback({ status: 'ok', conversations: conversations });
                        return [2 /*return*/];
                }
            });
        }); });
    };
    ContactConversationsEvents.ConversationSeen = function (socket, origin) {
        var _this = this;
        socket.on('seenContactConversation', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var conversation, messages, reciever, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        //console.log('seen');
                        return [4 /*yield*/, contactConversationModel_1.ContactConversations.updateMessageReadCount(data.cid, data.userId)];
                    case 1:
                        //console.log('seen');
                        _a.sent();
                        return [4 /*yield*/, contactConversationModel_1.ContactConversations.getConversationByCid(data.cid)];
                    case 2:
                        conversation = _a.sent();
                        if (!(conversation && conversation.length)) return [3 /*break*/, 4];
                        return [4 /*yield*/, contactConversationModel_1.ContactConversations.getLastMessage(conversation[0]._id)];
                    case 3:
                        messages = _a.sent();
                        if (messages) {
                            conversation[0].messages = messages;
                        }
                        _a.label = 4;
                    case 4:
                        callback({ status: 'ok', currentConversation: conversation[0] });
                        return [4 /*yield*/, contactSessionsManager_1.ContactSessionManager.GetSessionByEmailFromDatabase(data.to, socket.handshake.session.nsp)];
                    case 5:
                        reciever = _a.sent();
                        //console.log('Seen Reciver');
                        //console.log(reciever);
                        if (reciever) {
                            origin.to((reciever.id || reciever._id)).emit('contactConversationSeen', { LastSeen: conversation[0].LastSeen, currentConversation: conversation[0] });
                        }
                        return [3 /*break*/, 7];
                    case 6:
                        error_2 = _a.sent();
                        console.log('Error in ContactSeenConversation');
                        console.log(error_2);
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        }); });
    };
    //Mobile Events
    ContactConversationsEvents.getThreadList = function (socket, origin) {
        var _this = this;
        socket.on('getThreadList', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var conversations, i, messages;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, contactConversationModel_1.ContactConversations.getThreadList(data.email, socket.handshake.session.nsp)];
                    case 1:
                        conversations = _a.sent();
                        if (!(conversations && conversations.length)) return [3 /*break*/, 5];
                        i = 0;
                        _a.label = 2;
                    case 2:
                        if (!(i < conversations.length)) return [3 /*break*/, 5];
                        return [4 /*yield*/, contactConversationModel_1.ContactConversations.getLastMessage(conversations[i]._id)];
                    case 3:
                        messages = _a.sent();
                        if (messages) {
                            conversations[i].messages = messages;
                        }
                        _a.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 2];
                    case 5:
                        callback({ status: 'ok', conversations: conversations });
                        return [2 /*return*/];
                }
            });
        }); });
    };
    ContactConversationsEvents.getThreadByCid = function (socket, origin) {
        var _this = this;
        socket.on('getThreadByCid', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var conversation, temp;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, contactConversationModel_1.ContactConversations.getConversationByCid(data.cid)];
                    case 1:
                        conversation = _a.sent();
                        if (!(conversation && conversation.length)) return [3 /*break*/, 3];
                        return [4 /*yield*/, contactConversationModel_1.ContactConversations.getMessagesAsync(conversation[0]._id, data.chunk)];
                    case 2:
                        temp = _a.sent();
                        conversation[0].messages = (temp && temp.length) ? temp : [];
                        callback({ status: 'ok', conversation: conversation });
                        return [3 /*break*/, 4];
                    case 3:
                        callback({ status: 'error', msg: 'Conevrsation not found!' });
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        }); });
    };
    ContactConversationsEvents.getThread = function (socket, origin) {
        var _this = this;
        socket.on('getThread', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var conversation, temp;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, contactConversationModel_1.ContactConversations.getConversation(data.to, data.from, socket.handshake.session.nsp)];
                    case 1:
                        conversation = _a.sent();
                        if (!conversation) return [3 /*break*/, 3];
                        return [4 /*yield*/, contactConversationModel_1.ContactConversations.getMessagesAsync(conversation._id, data.chunk)];
                    case 2:
                        temp = _a.sent();
                        conversation.messages = (temp && temp.length) ? temp : [];
                        _a.label = 3;
                    case 3:
                        callback({ status: 'ok', conversation: conversation });
                        return [2 /*return*/];
                }
            });
        }); });
    };
    ContactConversationsEvents.getMoreMessages = function (socket, origin) {
        var _this = this;
        socket.on('getMoreMessages', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var messages;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(data.cid && data.chunk)) return [3 /*break*/, 2];
                        return [4 /*yield*/, contactConversationModel_1.ContactConversations.getMessagesAsync(data.cid, data.chunk)];
                    case 1:
                        messages = _a.sent();
                        callback({ status: 'ok', messages: messages, ended: (messages && messages.length < 20) ? true : false });
                        return [3 /*break*/, 3];
                    case 2:
                        callback({ status: 'error', messages: [] });
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    ContactConversationsEvents.TypingEvents = function (socket, origin) {
    };
    return ContactConversationsEvents;
}());
exports.ContactConversationsEvents = ContactConversationsEvents;
//# sourceMappingURL=contactConversationEvents.js.map