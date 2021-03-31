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
//Created By Saad Ismail Shaikh 
// 02-20-2019
var sessionsManager_1 = require("../../globals/server/sessionsManager");
var iceServersModel_1 = require("../../models/iceServersModel");
var CallingEvents = /** @class */ (function () {
    function CallingEvents() {
    }
    CallingEvents.BindCallingEvents = function (socket, origin) {
        CallingEvents.CreateOffer(socket, origin);
        CallingEvents.AcceptCall(socket, origin);
        CallingEvents.RejectCall(socket, origin);
        CallingEvents.SelfEnd(socket, origin);
        CallingEvents.Candidate(socket, origin);
        CallingEvents.AlreadyOnCall(socket, origin);
        CallingEvents.getICEServers(socket, origin);
        // CallingEvents.sendDummyCallNotification(socket, origin);
    };
    /*
       @DATA
       sender: string (Email),
       target: string (Email),
       type: (Email),
       sdp: sdp Session
       */
    CallingEvents.CreateOffer = function (socket, origin) {
        var _this = this;
        socket.on('createOffer', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var session, self, reciever, sender, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 16, , 17]);
                        if (!data.sender || !data.reciever || !data.type || !data.sdp)
                            throw new Error('Invalid Request');
                        return [4 /*yield*/, sessionsManager_1.SessionManager.GetVisitorByID(socket.handshake.session.id || socket.handshake.session._id)];
                    case 1:
                        session = _a.sent();
                        if (!(session && session.type == 'Visitors' && session.inactive)) return [3 /*break*/, 3];
                        return [4 /*yield*/, sessionsManager_1.SessionManager.GetVisitorByID(socket.handshake.session.id || socket.handshake.session._id)];
                    case 2:
                        session = _a.sent();
                        if (session && session.state != 3)
                            callback({ senderstatus: false, recieverStatus: false, callStatus: false });
                        else
                            callback({ senderstatus: false, recieverStatus: false, callStatus: false });
                        return [2 /*return*/];
                    case 3: return [4 /*yield*/, sessionsManager_1.SessionManager.UserAvailableForCalling(socket.handshake.session.nsp, data.sender, { socketid: '', state: true, agent: '' })];
                    case 4:
                        self = _a.sent();
                        if (!(self && self.value)) return [3 /*break*/, 14];
                        return [4 /*yield*/, sessionsManager_1.SessionManager.getSessionsForCall(socket.handshake.session.nsp, data.reciever)];
                    case 5:
                        reciever = _a.sent();
                        if (!(reciever && !reciever.expiry)) return [3 /*break*/, 11];
                        if (!!reciever.callingState.state) return [3 /*break*/, 9];
                        //console.log(data.reciever + ' is not busy');
                        return [4 /*yield*/, sessionsManager_1.SessionManager.UpdateCallingState(data.sender, { socketid: socket.id, state: true, agent: data.reciever })];
                    case 6:
                        //console.log(data.reciever + ' is not busy');
                        _a.sent();
                        return [4 /*yield*/, sessionsManager_1.SessionManager.UpdateCallingState(data.reciever, { socketid: '', state: false, agent: data.sender })];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, sessionsManager_1.SessionManager.getSessionsForCall(socket.handshake.session.nsp, data.sender)];
                    case 8:
                        sender = _a.sent();
                        if (sender) {
                            origin.to((sender.id || sender._id)).emit('updateCallingState', { state: true });
                        }
                        origin.to((reciever.id || reciever._id)).emit('answerOffer', { sender: data.sender, sdp: data.sdp, type: data.type, name: (data.name) ? data.name : '' });
                        //console.log('Call offer to '+ reciever.email + ' has been sent.');                       
                        callback({ senderstatus: true, recieverStatus: true, callStatus: false });
                        return [3 /*break*/, 10];
                    case 9:
                        /**
                         * @Note
                         * Reciever is Busy
                         */
                        socket.to((reciever.id || reciever._id)).emit('missedCall', { sender: data.sender });
                        //console.log(reciever.email + ' is busy.');  
                        callback({ senderstatus: true, recieverStatus: true, callStatus: reciever.callingState.state });
                        _a.label = 10;
                    case 10: return [3 /*break*/, 13];
                    case 11: 
                    //console.log(data.reciever + ' is not available');                       
                    /**
                     * @Note
                     * User Not Avaialabe
                     */
                    return [4 /*yield*/, sessionsManager_1.SessionManager.UpdateCallingState(data.sender, { socketid: '', state: false, agent: '' })];
                    case 12:
                        //console.log(data.reciever + ' is not available');                       
                        /**
                         * @Note
                         * User Not Avaialabe
                         */
                        _a.sent();
                        callback({ senderstatus: true, recieverStatus: false, callStatus: false });
                        _a.label = 13;
                    case 13: return [3 /*break*/, 15];
                    case 14:
                        /**
                         * @Note
                         * Not Found
                         * User Self Busy. Reponse You'cant make a call right now you are already connected on call
                         */
                        callback({ senderstatus: false, recieverStatus: false, callStatus: false });
                        _a.label = 15;
                    case 15: return [3 /*break*/, 17];
                    case 16:
                        error_1 = _a.sent();
                        console.log(error_1);
                        console.log('Error in Creating Offer');
                        return [3 /*break*/, 17];
                    case 17: return [2 /*return*/];
                }
            });
        }); });
    };
    CallingEvents.AcceptCall = function (socket, origin) {
        var _this = this;
        socket.on('acceptCall', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var sender, reciever, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!data.sender || !data.target || !data.type || !data.sdp)
                            throw new Error('Invalid Request');
                        return [4 /*yield*/, sessionsManager_1.SessionManager.getSessionsForCall(socket.handshake.session.nsp, data.sender)];
                    case 1:
                        sender = _a.sent();
                        return [4 /*yield*/, sessionsManager_1.SessionManager.UpdateCallingState(data.sender, { socketid: socket.id, state: true, agent: data.target })];
                    case 2:
                        _a.sent();
                        //console.log(data.sender + ' has accepted the call from ' + data.target);
                        if (sender) {
                            origin.to((sender.id || sender._id)).emit('updateCallingState', { state: true });
                            socket.to((sender.id || sender._id)).emit('closeAllDialogs');
                        }
                        return [4 /*yield*/, sessionsManager_1.SessionManager.getSessionsForCall(socket.handshake.session.nsp, data.target)];
                    case 3:
                        reciever = _a.sent();
                        if (reciever) {
                            if (reciever.callingState.state) {
                                origin.to((reciever.id || reciever._id)).emit('acceptCall', { sender: data.sender, sdp: data.sdp, type: data.type });
                                //console.log('Call has successfully started between '+ data.sender + ' and ' + data.target);
                                callback({ status: true });
                            }
                            else {
                                callback({ status: false });
                            }
                        }
                        else {
                            callback({ status: false });
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        error_2 = _a.sent();
                        console.log(error_2);
                        console.log('Error in Accept Call');
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        }); });
    };
    CallingEvents.Candidate = function (socket, origin) {
        var _this = this;
        socket.on('candidate', function (data) { return __awaiter(_this, void 0, void 0, function () {
            var reciever, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (!data.label.toString() || !data.candidate.toString())
                            throw new Error('Invalid Request');
                        return [4 /*yield*/, sessionsManager_1.SessionManager.getSessionsForCall(socket.handshake.session.nsp, data.target)];
                    case 1:
                        reciever = _a.sent();
                        if (reciever)
                            origin.to((reciever.id || reciever._id)).emit('candidate', data);
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        console.log(error_3);
                        console.log('Error in Sending Candidate');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    CallingEvents.RejectCall = function (socket, origin) {
        var _this = this;
        socket.on('rejectCall', function (data) { return __awaiter(_this, void 0, void 0, function () {
            var sender, reciever, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!data.sender || !data.target)
                            throw new Error('Invalid Request');
                        return [4 /*yield*/, sessionsManager_1.SessionManager.getSessionsForCall(socket.handshake.session.nsp, data.sender)];
                    case 1:
                        sender = _a.sent();
                        if (sender) {
                            socket.to((sender.id || sender._id)).emit('closeAllDialogs');
                        }
                        return [4 /*yield*/, sessionsManager_1.SessionManager.UpdateCallingState(data.target, { socketid: '', state: false, agent: '' })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, sessionsManager_1.SessionManager.getSessionsForCall(socket.handshake.session.nsp, data.target)];
                    case 3:
                        reciever = _a.sent();
                        if (reciever) {
                            origin.to((reciever.id || reciever._id)).emit('rejectCall');
                            origin.to((reciever.id || reciever._id)).emit('updateCallingState', { state: false });
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        error_4 = _a.sent();
                        console.log(error_4);
                        console.log('Error in Rejecting Call');
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        }); });
    };
    CallingEvents.SelfEnd = function (socket, origin) {
        var _this = this;
        socket.on('selfEnd', function (data) { return __awaiter(_this, void 0, void 0, function () {
            var sender, reciever, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        if (!data.sender || !data.target)
                            throw new Error('Invalid Request');
                        return [4 /*yield*/, sessionsManager_1.SessionManager.UpdateCallingState(data.sender, { socketid: '', state: false, agent: '' })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, sessionsManager_1.SessionManager.getSessionsForCall(socket.handshake.session.nsp, data.sender)];
                    case 2:
                        sender = _a.sent();
                        if (sender) {
                            origin.to((sender.id || sender._id)).emit('updateCallingState', { state: false });
                        }
                        return [4 /*yield*/, sessionsManager_1.SessionManager.UpdateCallingState(data.target, { socketid: '', state: false, agent: '' })];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, sessionsManager_1.SessionManager.getSessionsForCall(socket.handshake.session.nsp, data.target)];
                    case 4:
                        reciever = _a.sent();
                        if (reciever) {
                            origin.to((reciever.id || reciever._id)).emit('selfEnd');
                            origin.to((reciever.id || reciever._id)).emit('updateCallingState', { state: false });
                        }
                        return [3 /*break*/, 6];
                    case 5:
                        error_5 = _a.sent();
                        console.log(error_5);
                        console.log('Error in Rejecting Call');
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        }); });
    };
    CallingEvents.AlreadyOnCall = function (socket, origin) {
        var _this = this;
        socket.on('alreadyOnCall', function (data) { return __awaiter(_this, void 0, void 0, function () {
            var reciever, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (!data.to)
                            throw new Error('Invalid Request');
                        return [4 /*yield*/, sessionsManager_1.SessionManager.getSessionsForCall(socket.handshake.session.nsp, data.to)];
                    case 1:
                        reciever = _a.sent();
                        if (reciever)
                            origin.to((reciever.id || reciever._id)).emit('alreadyOnCall');
                        return [3 /*break*/, 3];
                    case 2:
                        error_6 = _a.sent();
                        console.log(error_6);
                        console.log('Error in Already on Call');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    CallingEvents.getICEServers = function (socket, origin) {
        var _this = this;
        socket.on('getICEServers', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var servers, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, iceServersModel_1.iceServersModel.getICEServers()];
                    case 1:
                        servers = _a.sent();
                        if (servers && servers.length) {
                            //console.log(servers[0]);
                            callback({ servers: servers[0] });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_7 = _a.sent();
                        console.log(error_7);
                        console.log('Error in Already on Call');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    return CallingEvents;
}());
exports.CallingEvents = CallingEvents;
//# sourceMappingURL=CallingEvents.js.map