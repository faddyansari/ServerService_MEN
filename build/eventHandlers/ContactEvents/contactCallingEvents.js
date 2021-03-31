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
var iceServersModel_1 = require("../../models/iceServersModel");
var PushNotificationFirebase_1 = require("../../actions/agentActions/PushNotificationFirebase");
var contactSessionsManager_1 = require("../../globals/server/contactSessionsManager");
var contactModel_1 = require("../../models/contactModel");
var ContactCallingEvents = /** @class */ (function () {
    function ContactCallingEvents() {
    }
    ContactCallingEvents.BindCallingEvents = function (socket, origin) {
        ContactCallingEvents.CreateOffer(socket, origin);
        ContactCallingEvents.AcceptCall(socket, origin);
        ContactCallingEvents.RejectCall(socket, origin);
        ContactCallingEvents.SelfEnd(socket, origin);
        ContactCallingEvents.Candidate(socket, origin);
        ContactCallingEvents.AlreadyOnCall(socket, origin);
        ContactCallingEvents.checkCall(socket, origin);
        ContactCallingEvents.getICEServers(socket, origin);
        ContactCallingEvents.sendDummyCallNotification(socket, origin);
    };
    /*
       @DATA
       sender: string (Email),
       target: string (Email),
       type: (Email),
       sdp: sdp Session
       */
    ContactCallingEvents.CreateOffer = function (socket, origin) {
        var _this = this;
        socket.on('createOffer', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var sender, reciever, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 9, , 10]);
                        if (!data.sender || !data.reciever || !data.type || !data.sdp)
                            throw new Error('Invalid Request');
                        return [4 /*yield*/, contactSessionsManager_1.ContactSessionManager.UpdateCallingState(data.sender, { socketid: '', state: true, agent: '' })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, contactModel_1.Contacts.retrieveContactsByEmail(socket.handshake.session.nsp, data.sender)];
                    case 2:
                        sender = _a.sent();
                        return [4 /*yield*/, contactSessionsManager_1.ContactSessionManager.GetSessionByEmailFromDatabase(data.reciever, socket.handshake.session.nsp)];
                    case 3:
                        reciever = _a.sent();
                        if (!(reciever && sender)) return [3 /*break*/, 7];
                        if (!!reciever.callingState.state) return [3 /*break*/, 5];
                        return [4 /*yield*/, contactSessionsManager_1.ContactSessionManager.UpdateCallingState(data.sender, { socketid: socket.id, state: true, agent: data.reciever })];
                    case 4:
                        _a.sent();
                        PushNotificationFirebase_1.SendNotification(origin['settings']['api']['firebase']['key'], data.reciever, 'Calling', (sender[0].name) ? sender[0].name : sender[0].email.split('@')[0] + ' is calling you...', { sender: data.sender, sdp: data.sdp, type: data.type, name: (sender[0].name) ? sender[0].name : sender[0].email.split('@')[0], image: (sender[0].image) ? sender[0].image : '', title: 'Calling', message: (sender[0].name) ? sender[0].name : sender[0].email.split('@')[0] + ' is calling you...' }, true, false);
                        // origin.to((reciever.id || reciever._id) as string).emit('answerOffer', { sender: data.sender, sdp: data.sdp, type: data.type, name : (data.name) ? data.name : '' });
                        callback({ recieverStatus: true, callStatus: false });
                        return [3 /*break*/, 6];
                    case 5:
                        callback({ recieverStatus: true, callStatus: reciever.callingState.state });
                        _a.label = 6;
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        if (!reciever && sender) {
                            if (origin['settings']['api']['firebase']['key']) {
                                PushNotificationFirebase_1.SendNotification(origin['settings']['api']['firebase']['key'], data.reciever, 'Calling', (sender[0].name) ? sender[0].name : sender[0].email.split('@')[0] + ' is calling you...', { sender: data.sender, sdp: data.sdp, type: data.type, name: (sender[0].name) ? sender[0].name : sender[0].email.split('@')[0], image: (sender[0].image) ? sender[0].image : '', title: 'Calling', message: (sender[0].name) ? sender[0].name : sender[0].email.split('@')[0] + ' is calling you...' }, true, false);
                            }
                        }
                        _a.label = 8;
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        error_1 = _a.sent();
                        console.log(error_1);
                        console.log('Error in Creating Offer');
                        return [3 /*break*/, 10];
                    case 10: return [2 /*return*/];
                }
            });
        }); });
    };
    ContactCallingEvents.AcceptCall = function (socket, origin) {
        var _this = this;
        socket.on('acceptCall', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var sender, reciever, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!data.sender || !data.target || !data.type || !data.sdp)
                            throw new Error('Invalid Request');
                        return [4 /*yield*/, contactSessionsManager_1.ContactSessionManager.GetSessionByEmailFromDatabase(data.sender, socket.handshake.session.nsp)];
                    case 1:
                        sender = _a.sent();
                        return [4 /*yield*/, contactSessionsManager_1.ContactSessionManager.UpdateCallingState(data.sender, { socketid: socket.id, state: true, agent: data.target })];
                    case 2:
                        _a.sent();
                        if (sender) {
                            origin.to((sender.id || sender._id)).emit('updateCallingState', { state: true });
                            socket.to((sender.id || sender._id)).emit('closeAllDialogs');
                        }
                        return [4 /*yield*/, contactSessionsManager_1.ContactSessionManager.GetSessionByEmailFromDatabase(data.target, socket.handshake.session.nsp)];
                    case 3:
                        reciever = _a.sent();
                        if (reciever) {
                            console.log('Call Accepted: ');
                            console.log(reciever.callingState);
                            if (reciever.callingState.state) {
                                origin.to((reciever.id || reciever._id)).emit('acceptCall', { sender: data.sender, sdp: data.sdp, type: data.type });
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
    ContactCallingEvents.Candidate = function (socket, origin) {
        var _this = this;
        socket.on('candidate', function (data) { return __awaiter(_this, void 0, void 0, function () {
            var reciever, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (!data.label.toString() || !data.candidate.toString())
                            throw new Error('Invalid Request');
                        return [4 /*yield*/, contactSessionsManager_1.ContactSessionManager.GetSessionByEmailFromDatabase(data.target, socket.handshake.session.nsp)];
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
    ContactCallingEvents.RejectCall = function (socket, origin) {
        var _this = this;
        socket.on('rejectCall', function (data) { return __awaiter(_this, void 0, void 0, function () {
            var sender, reciever, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        if (!data.sender || !data.target)
                            throw new Error('Invalid Request');
                        return [4 /*yield*/, contactSessionsManager_1.ContactSessionManager.GetSessionByEmailFromDatabase(data.sender, socket.handshake.session.nsp)];
                    case 1:
                        sender = _a.sent();
                        if (sender) {
                            socket.to((sender.id || sender._id)).emit('closeAllDialogs');
                        }
                        return [4 /*yield*/, contactSessionsManager_1.ContactSessionManager.UpdateCallingState(data.target, { socketid: '', state: false, agent: '' })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, contactSessionsManager_1.ContactSessionManager.UpdateCallingState(data.sender, { socketid: '', state: false, agent: '' })];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, contactSessionsManager_1.ContactSessionManager.GetSessionByEmailFromDatabase(data.target, socket.handshake.session.nsp)];
                    case 4:
                        reciever = _a.sent();
                        if (reciever)
                            origin.to((reciever.id || reciever._id)).emit('rejectCall');
                        return [3 /*break*/, 6];
                    case 5:
                        error_4 = _a.sent();
                        console.log(error_4);
                        console.log('Error in Rejecting Call');
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        }); });
    };
    ContactCallingEvents.SelfEnd = function (socket, origin) {
        var _this = this;
        socket.on('selfEnd', function (data) { return __awaiter(_this, void 0, void 0, function () {
            var reciever, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('Self End Call!');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        if (!data.sender || !data.target)
                            throw new Error('Invalid Request');
                        return [4 /*yield*/, contactSessionsManager_1.ContactSessionManager.UpdateCallingState(data.sender, { socketid: '', state: false, agent: '' })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, contactSessionsManager_1.ContactSessionManager.GetSessionByEmailFromDatabase(data.target, socket.handshake.session.nsp)];
                    case 3:
                        reciever = _a.sent();
                        if (!reciever) return [3 /*break*/, 5];
                        console.log('Reciever Calling State: ');
                        console.log(reciever.callingState);
                        console.log('Sender: ' + data.sender);
                        return [4 /*yield*/, contactSessionsManager_1.ContactSessionManager.UpdateCallingState(data.target, { socketid: '', state: false, agent: '' })];
                    case 4:
                        _a.sent();
                        if (reciever.callingState.state && reciever.callingState.agent == data.sender) {
                            origin.to((reciever.id || reciever._id)).emit('selfEnd');
                        }
                        else {
                            // origin.to((reciever.id || reciever._id) as string).emit('callDrop');   
                        }
                        _a.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_5 = _a.sent();
                        console.log(error_5);
                        console.log('Error in Self End Call');
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        }); });
    };
    ContactCallingEvents.AlreadyOnCall = function (socket, origin) {
        var _this = this;
        socket.on('alreadyOnCall', function (data) { return __awaiter(_this, void 0, void 0, function () {
            var reciever, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (!data.to)
                            throw new Error('Invalid Request');
                        return [4 /*yield*/, contactSessionsManager_1.ContactSessionManager.GetSessionByEmailFromDatabase(data.to, socket.handshake.session.nsp)];
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
    ContactCallingEvents.checkCall = function (socket, origin) {
        var _this = this;
        socket.on('checkCall', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var contact, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, contactSessionsManager_1.ContactSessionManager.GetSessionByEmailFromDatabase(socket.handshake.session.email, socket.handshake.session.nsp)];
                    case 1:
                        contact = _a.sent();
                        if (contact) {
                            callback({ state: contact.callingState.state, email: contact.callingState.agent });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_7 = _a.sent();
                        console.log(error_7);
                        console.log('Error in check call');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    ContactCallingEvents.getICEServers = function (socket, origin) {
        var _this = this;
        socket.on('getICEServers', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var servers, error_8;
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
                        error_8 = _a.sent();
                        console.log(error_8);
                        console.log('Error in Already on Call');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    ContactCallingEvents.sendDummyCallNotification = function (socket, origin) {
        var _this = this;
        socket.on('dummyCallNotif', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                //console.log('getICEServers!');
                try {
                    PushNotificationFirebase_1.SendNotification(origin['settings']['api']['firebase']['key'], 't_user14@engro.com', 'Calling', 'sbt is calling you...', { dummy: 'this is dummy data' }, true, false);
                }
                catch (error) {
                    console.log(error);
                    console.log('Error in Already on Call');
                }
                return [2 /*return*/];
            });
        }); });
    };
    return ContactCallingEvents;
}());
exports.ContactCallingEvents = ContactCallingEvents;
//# sourceMappingURL=contactCallingEvents.js.map