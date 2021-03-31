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
var sessionsManager_1 = require("../../globals/server/sessionsManager");
var agentModel_1 = require("../../models/agentModel");
var visitorModel_1 = require("../../models/visitorModel");
var ApplicationStateEvents = /** @class */ (function () {
    function ApplicationStateEvents() {
    }
    ApplicationStateEvents.BindApplicationStateEvents = function (socket, origin) {
        ApplicationStateEvents.ToggleChatMode(socket, origin);
    };
    ApplicationStateEvents.ToggleChatMode = function (socket, origin) {
        var _this = this;
        socket.on('toogleChatMode', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var promises, updatedSession, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, Promise.all([
                                sessionsManager_1.SessionManager.ToogleChatMode(socket.handshake.session, (!data.acceptingChats) ? 'IDLE' : 'ACTIVE'),
                                agentModel_1.Agents.ToogleChatMode(socket.handshake.session, (!data.acceptingChats) ? 'IDLE' : 'ACTIVE')
                            ])];
                    case 1:
                        promises = _a.sent();
                        updatedSession = promises[0];
                        if (updatedSession && updatedSession.value) {
                            socket.handshake.session = updatedSession.value;
                            !(data.acceptingChats)
                                ? origin.to(agentModel_1.Agents.NotifyAll()).emit('idleOn', { email: socket.handshake.session.email, startTime: updatedSession.startTime })
                                : origin.to(agentModel_1.Agents.NotifyAll()).emit('idleOff', { email: socket.handshake.session.email, endTime: updatedSession.endTime });
                            socket.to(agentModel_1.Agents.NotifyOne(socket.handshake.session)).emit('toggleChatMode', { state: (data.acceptingChats) ? 'on' : 'off' });
                            // console.log(updatedSession.value.permissions);
                            if (updatedSession.value.permissions.chats.canChat)
                                socket.to(visitorModel_1.Visitor.BraodcastToVisitors()).emit((data.acceptingChats) ? 'agentOnline' : 'agentOffline', { agent: { _id: socket.handshake.session.id || socket.handshake.session._id, image: (socket.handshake.session.image) ? socket.handshake.session.image : '', nickname: socket.handshake.session.nickname, } });
                            callback({ status: 'ok' });
                        }
                        else {
                            callback({ status: 'error' });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.log(error_1);
                        console.log('error in Toogle Chat Mode');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    return ApplicationStateEvents;
}());
exports.ApplicationStateEvents = ApplicationStateEvents;
//# sourceMappingURL=applicationStateEvents.js.map