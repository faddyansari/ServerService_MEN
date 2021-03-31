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
var conversationModel_1 = require("../../models/conversationModel");
var ConversationEvents = /** @class */ (function () {
    function ConversationEvents() {
    }
    ConversationEvents.BindConversationEvents = function (socket, origin) {
        ConversationEvents.GetMessages(socket, origin);
        ConversationEvents.GetSelectedMessageListByCid(socket, origin);
        ConversationEvents.GetMoreConversationByCid(socket, origin);
        ConversationEvents.CheckMoreConversationByCid(socket, origin);
        ConversationEvents.GetConversationClientID(socket, origin);
    };
    ConversationEvents.GetMessages = function (socket, origin) {
        // This Approach is only for Visitors Message Retrieving
        // Since For High Availaibility  We Store Visitor Messages in their Local Storage
        // NOTE : "NEED TO APPLY ENCRYPTION SO THAT IT CAN ONLY BE UNLOCKED BY SIGNED KEY"
        socket.on('getMessages', function (data, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var msgs, msgs;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            console.log('Getting Mesages');
                            console.log(data);
                            if (!socket.handshake.session.isMobile) return [3 /*break*/, 2];
                            if (!data.cid) {
                                callback([]);
                                return [2 /*return*/];
                            }
                            return [4 /*yield*/, conversationModel_1.Conversations.getMessagesByCid(data.cid)];
                        case 1:
                            msgs = _a.sent();
                            callback(msgs);
                            return [3 /*break*/, 4];
                        case 2:
                            if (!data.lasttouchedTime || !data.cid) {
                                callback([]);
                                return [2 /*return*/];
                            }
                            return [4 /*yield*/, conversationModel_1.Conversations.getMessagesByTime(data.cid, data.lasttouchedTime, (data._id) ? data._id : '')];
                        case 3:
                            msgs = _a.sent();
                            if (msgs)
                                callback((msgs && msgs.length) ? msgs : []);
                            _a.label = 4;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        });
    };
    ConversationEvents.GetSelectedMessageListByCid = function (socket, origin) {
        var _this = this;
        socket.on('getSelectedChat', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var msgs, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, conversationModel_1.Conversations.getMessagesByCid(data.cid)];
                    case 1:
                        msgs = _a.sent();
                        callback({ status: 'ok', msgList: msgs });
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.log(error_1);
                        callback({ status: error_1 });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    // private static GetMoreConversationByCid(socket, origin: SocketIO.Namespace) {
    //     socket.on('getMoreRecentChats', async (data, callback) => {
    //         try {
    //             //console.log(data);
    //             let chats = await Conversations.getMoreConversationsByDeviceID(data.deviceID,data.id);
    //             callback({ status: 'ok', chats: chats });
    //         } catch (error) {
    //             console.log(error);
    //             callback({ status: error });
    //         }
    //     });
    // }
    ConversationEvents.GetMoreConversationByCid = function (socket, origin) {
        var _this = this;
        socket.on('getMoreRecentChats', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var chats, chatsCheck, noMoreChats, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, conversationModel_1.Conversations.getMoreConversationsByDeviceID(data.deviceID, (data._id) ? data._id : '')];
                    case 1:
                        chats = _a.sent();
                        chatsCheck = void 0;
                        if (!(chats && chats.length > 0)) return [3 /*break*/, 3];
                        return [4 /*yield*/, conversationModel_1.Conversations.getMoreConversationsByDeviceID(data.deviceID, chats[chats.length - 1]._id)];
                    case 2:
                        chatsCheck = _a.sent();
                        _a.label = 3;
                    case 3:
                        noMoreChats = void 0;
                        if (chatsCheck && chatsCheck.length)
                            noMoreChats = false;
                        else
                            noMoreChats = true;
                        callback({ status: 'ok', chats: chats, noMoreChats: noMoreChats });
                        return [3 /*break*/, 5];
                    case 4:
                        error_2 = _a.sent();
                        console.log(error_2);
                        callback({ status: error_2 });
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        }); });
    };
    ConversationEvents.CheckMoreConversationByCid = function (socket, origin) {
        var _this = this;
        socket.on('checkMoreRecentChats', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var chatsCount, noMoreChats, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, conversationModel_1.Conversations.getMoreConversationsByDeviceID(data.deviceID, data.id)];
                    case 1:
                        chatsCount = _a.sent();
                        noMoreChats = void 0;
                        if (chatsCount && chatsCount.length)
                            noMoreChats = false;
                        else
                            noMoreChats = true;
                        callback({ noMoreChats: noMoreChats });
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        console.log(error_3);
                        callback({ status: error_3 });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    ConversationEvents.GetMoreMessages = function (socket, origin) {
        // This Approach is only for Visitors Message Retrieving
        // Since For High Availaibility  We Store Visitor Messages in their Local Storage
        // NOTE : "NEED TO APPLY ENCRYPTION SO THAT IT CAN ONLY BE UNLOCKED BY SIGNED KEY"
        socket.on('getMoreMessages', function (data, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var msgs, msgs;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!socket.handshake.session.isMobile) return [3 /*break*/, 2];
                            if (!data.cid) {
                                callback([]);
                                return [2 /*return*/];
                            }
                            return [4 /*yield*/, conversationModel_1.Conversations.getMessagesByCid(data.cid)];
                        case 1:
                            msgs = _a.sent();
                            callback(msgs);
                            return [3 /*break*/, 4];
                        case 2:
                            if (!data.lasttouchedTime || !data.cid) {
                                callback([]);
                                return [2 /*return*/];
                            }
                            return [4 /*yield*/, conversationModel_1.Conversations.getMessagesByTime(data.cid, data.lasttouchedTime, data._id)];
                        case 3:
                            msgs = _a.sent();
                            callback(msgs);
                            _a.label = 4;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        });
    };
    ConversationEvents.GetConversationClientID = function (socket, origin) {
        var _this = this;
        socket.on('getConversationClientID', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var conversation, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, conversationModel_1.Conversations.GetClientIDByConversationID(data.cid, socket.handshake.session.nsp)];
                    case 1:
                        conversation = _a.sent();
                        if (conversation && conversation.length)
                            callback({ clientID: conversation[0].clientID });
                        else
                            callback({});
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        console.log(error_4);
                        callback({ status: error_4 });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    return ConversationEvents;
}());
exports.ConversationEvents = ConversationEvents;
//# sourceMappingURL=conversationEvents.js.map