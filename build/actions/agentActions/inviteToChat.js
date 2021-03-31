"use strict";
//Created By Saad Ismail Shaikh 
// 07-08-2018
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
exports.InviteToChat = void 0;
var sessionsManager_1 = require("../../globals/server/sessionsManager");
var conversationModel_1 = require("../../models/conversationModel");
var bson_1 = require("bson");
//See Schemas For Reference
//Visitor = VisitorSession
//Agents = AgentSession
function InviteToChat(visitor, agent, greetingMessage) {
    if (greetingMessage === void 0) { greetingMessage = 'Hello.. How may i Help You ?'; }
    return __awaiter(this, void 0, void 0, function () {
        var cid, message, UpdatedSessions, conversation, insertedMessage, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 9, , 10]);
                    // visitor.state = 4
                    visitor.agent = { id: agent.id, name: agent.nickname };
                    if (!visitor.username)
                        visitor.username = 'Guest' + new Date().toLocaleTimeString().split(':').join('').split(' ')[0];
                    if (!visitor.email)
                        visitor.email = 'UnRegistered';
                    cid = new bson_1.ObjectID();
                    message = void 0;
                    return [4 /*yield*/, sessionsManager_1.SessionManager.AssignAgent(visitor, (agent._id || agent.id), cid, 4)];
                case 1:
                    UpdatedSessions = _a.sent();
                    if (!(UpdatedSessions && UpdatedSessions.agent)) return [3 /*break*/, 8];
                    return [4 /*yield*/, conversationModel_1.Conversations.createConversation(cid, visitor.email, visitor.id, agent.nsp, visitor.viewColor, agent.email, visitor.username, 2, visitor.deviceID)];
                case 2:
                    conversation = _a.sent();
                    if (greetingMessage) {
                        message = {
                            from: agent.nickname,
                            to: visitor.username,
                            body: greetingMessage,
                            cid: (conversation) ? conversation.insertedId : undefined,
                            date: new Date().toISOString(),
                            type: "Agents",
                            attachment: false,
                            filename: undefined
                        };
                    }
                    if (!(conversation && conversation.insertedCount > 0)) return [3 /*break*/, 7];
                    if (!(visitor.url && visitor.url.length)) return [3 /*break*/, 4];
                    return [4 /*yield*/, sessionsManager_1.SessionManager.UpdateChatInitiatedDetails(visitor._id || visitor.id, visitor.url[visitor.url.length - 1], 'Agent', ((UpdatedSessions.visitor.state == 4) || (UpdatedSessions.visitor.state == 5)) ? true : false)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    visitor.conversationID = conversation.insertedId;
                    if (!message) return [3 /*break*/, 7];
                    return [4 /*yield*/, conversationModel_1.Conversations.insertMessage(message)];
                case 5:
                    insertedMessage = _a.sent();
                    return [4 /*yield*/, conversationModel_1.Conversations.UpdateLastMessage((conversation.insertedId), message)];
                case 6:
                    _a.sent();
                    if (insertedMessage && insertedMessage.ops.length > 0) {
                        conversation.ops[0].messages.push(message);
                    }
                    _a.label = 7;
                case 7: return [2 /*return*/, Promise.resolve({ visitor: UpdatedSessions.visitor, agent: UpdatedSessions.agent, conversation: (conversation) ? conversation.ops[0] : undefined })];
                case 8: return [2 /*return*/, Promise.resolve(undefined)];
                case 9:
                    error_1 = _a.sent();
                    console.log(error_1);
                    console.log('Error in InviteToChat');
                    return [2 /*return*/, Promise.resolve(undefined)];
                case 10: return [2 /*return*/];
            }
        });
    });
}
exports.InviteToChat = InviteToChat;
//# sourceMappingURL=inviteToChat.js.map