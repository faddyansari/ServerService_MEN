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
exports.GetChatBotReplyMessage = exports.CreateLogMessage = void 0;
var conversationModel_1 = require("../../models/conversationModel");
function CreateLogMessage(message) {
    return __awaiter(this, void 0, void 0, function () {
        var sender, date, insertedMessage, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    sender = undefined;
                    date = new Date();
                    insertedMessage = void 0;
                    date = new Date();
                    message.date = date.toISOString();
                    return [4 /*yield*/, conversationModel_1.Conversations.insertMessage(message)];
                case 1:
                    //data.type = socket.handshake.session.type;
                    // data.delivered = true
                    // data.sent = false
                    insertedMessage = _a.sent();
                    // let allconvo = await Conversations.UpdateAllLastMessagenByCID(data.cid);
                    //console.log("messageinsertedID");
                    //console.log(messageinsertedID);
                    // allconvo = await Conversations.getConversationBySid(data.cid);
                    // console.log(allconvo);
                    //await Conversations.abc();
                    return [4 /*yield*/, conversationModel_1.Conversations.updateMessageReadCount(message.cid, true)];
                case 2:
                    // let allconvo = await Conversations.UpdateAllLastMessagenByCID(data.cid);
                    //console.log("messageinsertedID");
                    //console.log(messageinsertedID);
                    // allconvo = await Conversations.getConversationBySid(data.cid);
                    // console.log(allconvo);
                    //await Conversations.abc();
                    _a.sent();
                    if (insertedMessage.insertedCount > 0) {
                        return [2 /*return*/, insertedMessage.ops[0]];
                    }
                    else {
                        console.log('Error in Sending Message Message Not Inserted');
                    }
                    return [2 /*return*/, undefined];
                case 3:
                    error_1 = _a.sent();
                    console.log(error_1);
                    console.log('Error in Creating Message');
                    // console.log(session.state);
                    return [2 /*return*/, undefined];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.CreateLogMessage = CreateLogMessage;
function GetChatBotReplyMessage(body, session, fromVisitor, form) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, ({
                    from: (fromVisitor) ? session.agent.name : "Assistant",
                    to: (fromVisitor) ? session.agent : session.username,
                    body: body,
                    type: (fromVisitor) ? 'Visitors' : "ChatBot",
                    cid: session.conversationID ? session.conversationID : "",
                    attachment: false,
                    date: new Date().toISOString(),
                    form: (form) ? form : []
                })];
        });
    });
}
exports.GetChatBotReplyMessage = GetChatBotReplyMessage;
//# sourceMappingURL=CreateMessage.js.map