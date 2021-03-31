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
var TypingStateEvents = /** @class */ (function () {
    function TypingStateEvents() {
    }
    TypingStateEvents.BindTypingStateEvents = function (socket, origin) {
        TypingStateEvents.TypingState(socket, origin);
        TypingStateEvents.AgentTypingState(socket, origin);
        TypingStateEvents.SneakPeak(socket, origin);
    };
    TypingStateEvents.TypingState = function (socket, origin) {
        var _this = this;
        socket.on('visitorTyping', function (data) { return __awaiter(_this, void 0, void 0, function () {
            var session, visitorSession, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!data) return [3 /*break*/, 3];
                        session = socket.handshake.session;
                        return [4 /*yield*/, sessionsManager_1.SessionManager.GetVisitorByID(session._id)];
                    case 1:
                        visitorSession = _a.sent();
                        if (!visitorSession) return [3 /*break*/, 3];
                        visitorSession.typingState = data.state;
                        return [4 /*yield*/, sessionsManager_1.SessionManager.UpdateSession(socket.handshake.session.id, visitorSession)];
                    case 2:
                        _a.sent();
                        origin.to(agentModel_1.Agents.NotifyOne(visitorSession)).emit('typingState', { state: data.state, sid: visitorSession.id });
                        _a.label = 3;
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        error_1 = _a.sent();
                        console.log(error_1);
                        console.log('error in SneakPeak Typing Event');
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        }); });
    };
    TypingStateEvents.SneakPeak = function (socket, origin) {
        var _this = this;
        socket.on('visitorSneakPeak', function (data) { return __awaiter(_this, void 0, void 0, function () {
            var session, visitorSession, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        if (!data) return [3 /*break*/, 2];
                        session = socket.handshake.session;
                        return [4 /*yield*/, sessionsManager_1.SessionManager.GetVisitorByID(session._id)];
                    case 1:
                        visitorSession = _a.sent();
                        if (visitorSession)
                            origin.to(agentModel_1.Agents.NotifyOne(visitorSession)).emit('visitorSneakPeak', { msg: data.msg, sid: visitorSession.id });
                        _a.label = 2;
                    case 2: return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        console.log(error_2);
                        console.log('error in SneakPeak Typing Event');
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
    };
    TypingStateEvents.AgentTypingState = function (socket, origin) {
        var _this = this;
        socket.on('agentTyping', function (data) { return __awaiter(_this, void 0, void 0, function () {
            var visitorSession, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        if (!(data && data.conversation)) return [3 /*break*/, 2];
                        return [4 /*yield*/, sessionsManager_1.SessionManager.GetVisitorByID(data.conversation.sessionid)];
                    case 1:
                        visitorSession = _a.sent();
                        if (visitorSession) {
                            if (visitorSession.state == 3) {
                                //let visitorSession = await SessionManager.GetVisitorByID(data.sessionid)
                                socket.to(visitorModel_1.Visitor.NotifyOne(visitorSession)).emit('typingState', { state: data.state, sid: visitorSession.id });
                                //agentSession.typingState = data.state;
                                //(await SessionManager.UpdateAge(socket.handshake.session.id, agentSession) as VisitorSessionSchema);
                                // if(visitorSession) socket.to(Visitor.NotifyOne(visitorSession)).emit('typingState', { state: data.state, sid: session.id })
                            }
                        }
                        _a.label = 2;
                    case 2: return [3 /*break*/, 4];
                    case 3:
                        error_3 = _a.sent();
                        console.log(error_3);
                        console.log('error in SneakPeak Typing Event');
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
    };
    return TypingStateEvents;
}());
exports.TypingStateEvents = TypingStateEvents;
//# sourceMappingURL=TypingEvents.js.map