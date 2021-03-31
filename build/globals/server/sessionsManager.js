"use strict";
// Created By Saad Ismail Shaikh
// Date : 01-03-18
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
exports.SessionManager = void 0;
var mongodb_1 = require("mongodb");
var database_1 = require("../config/database");
var visitorSessionmodel_1 = require("../../models/visitorSessionmodel");
var agentSessionModel_1 = require("../../models/agentSessionModel");
var visitorModel_1 = require("../../models/visitorModel");
var conversationModel_1 = require("../../models/conversationModel");
//const session = require("express-session");
var ObjectId = require('mongodb').ObjectId;
var SessionManager = /** @class */ (function () {
    function SessionManager() {
    }
    SessionManager.AssignQueuedChatToManual = function (sender, conversationID) {
        throw new Error("Method not implemented.");
    };
    SessionManager.Initialize = function (reconnect) {
        var _this = this;
        // Database Connection For Session Storage.
        database_1.DataBaseConfig.connect()
            .then(function (db) {
            _this.db = db;
            console.log('Session MAnager Initialized');
            _this.db.createCollection('sessions')
                .then(function (collection) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    console.log(collection.collectionName);
                    this.collection = collection;
                    return [2 /*return*/];
                });
            }); })
                .catch(function (err) {
                console.log(err);
            });
        })
            .catch(function (error) {
            console.log(error);
        });
    };
    SessionManager.Destroy = function () {
        this.db = undefined;
        this.collection = undefined;
    };
    //#region VISITOR SESSIONS FUNCTIONS NEW SESSION MANAGEMENT IN MONGO WILL MOVE TO REDIS AFTER PERSISTENCY
    //#endregion
    //#region Visitor Functions MongoDb
    SessionManager.getVisitor = function (session, sessionID) {
        return __awaiter(this, void 0, void 0, function () {
            var visitor, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!(this.db && this.collection)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.collection.find({
                                _id: new ObjectId((sessionID) ? sessionID : (session.id || session._id))
                            }).limit(1).toArray()];
                    case 1:
                        visitor = _a.sent();
                        if (visitor.length)
                            return [2 /*return*/, visitor[0]];
                        else
                            return [2 /*return*/, undefined];
                        return [3 /*break*/, 3];
                    case 2: return [2 /*return*/, undefined];
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        error_1 = _a.sent();
                        console.log('Error in Get Visitors Old');
                        console.log(error_1);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    SessionManager.GetVisitorByID = function (sessionID) {
        return __awaiter(this, void 0, void 0, function () {
            var visitor, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!(this.db && this.collection)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.collection.find({
                                _id: new ObjectId(sessionID)
                            }).limit(1).toArray()];
                    case 1:
                        visitor = _a.sent();
                        if (visitor.length)
                            return [2 /*return*/, visitor[0]];
                        else
                            return [2 /*return*/, undefined];
                        return [3 /*break*/, 3];
                    case 2: return [2 /*return*/, undefined];
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        error_2 = _a.sent();
                        console.log('Error in Get Visitors');
                        console.log(error_2);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    SessionManager.UpdateDeviceToken = function (sessionID, token) {
        return __awaiter(this, void 0, void 0, function () {
            var visitor, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!(this.db && this.collection)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.collection.findOneAndUpdate({
                                _id: new ObjectId(sessionID)
                            }, {
                                $set: { deviceID: token }
                            }, { returnOriginal: false, upsert: false })];
                    case 1:
                        visitor = _a.sent();
                        if (visitor && visitor.value)
                            return [2 /*return*/, visitor.value];
                        else
                            return [2 /*return*/, undefined];
                        return [3 /*break*/, 3];
                    case 2: return [2 /*return*/, undefined];
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        error_3 = _a.sent();
                        console.log('Error in Get Device Token');
                        console.log(error_3);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    SessionManager.UpdateChatInitiatedDetails = function (sessionID, url, startedBy, invited) {
        return __awaiter(this, void 0, void 0, function () {
            var visitor, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!(this.db && this.collection)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.collection.findOneAndUpdate({
                                _id: new ObjectId(sessionID)
                            }, {
                                $set: { chatFromUrl: url, startedBy: startedBy, invited: invited }
                            }, { returnOriginal: false, upsert: false })];
                    case 1:
                        visitor = _a.sent();
                        if (visitor && visitor.value)
                            return [2 /*return*/, visitor.value];
                        else
                            return [2 /*return*/, undefined];
                        return [3 /*break*/, 3];
                    case 2: return [2 /*return*/, undefined];
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        error_4 = _a.sent();
                        console.log('Error in Get Device Token');
                        console.log(error_4);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    SessionManager.GetSessionForChat = function (_id) {
        return __awaiter(this, void 0, void 0, function () {
            var session, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!(this.db && this.collection)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.collection.find({
                                _id: new ObjectId(_id)
                            }, {
                                fields: {
                                    _id: 0,
                                    chatFromUrl: 1,
                                    fullCountryName: 1,
                                    isMobile: 1,
                                    referrer: 1,
                                    returningVisitor: 1,
                                    phone: 1
                                }
                            }).limit(1).toArray()];
                    case 1:
                        session = _a.sent();
                        if (session && session.length)
                            return [2 /*return*/, session[0]];
                        else
                            return [2 /*return*/, ''];
                        return [3 /*break*/, 3];
                    case 2: return [2 /*return*/, undefined];
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        error_5 = _a.sent();
                        console.log('Error in Getting All Live Agents');
                        console.log(error_5);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    SessionManager.SetAdditionalData = function (data, sessionID) {
        return __awaiter(this, void 0, void 0, function () {
            var visitor, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!(this.db && this.collection)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.collection.findOneAndUpdate({
                                _id: new ObjectId(sessionID),
                                type: 'Visitors'
                            }, {
                                $set: { additionalData: data }
                            })];
                    case 1:
                        visitor = _a.sent();
                        if (visitor && visitor.value)
                            return [2 /*return*/, visitor.value];
                        else
                            return [2 /*return*/, undefined];
                        return [3 /*break*/, 3];
                    case 2: return [2 /*return*/, undefined];
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        error_6 = _a.sent();
                        console.log('Error in Set Additional Data');
                        console.log(error_6);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    SessionManager.SetRequestedCarData = function (data, sessionID) {
        return __awaiter(this, void 0, void 0, function () {
            var visitor, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!(this.db && this.collection)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.collection.findOneAndUpdate({
                                _id: new ObjectId(sessionID),
                                type: 'Visitors'
                            }, {
                                $set: { carRequestData: data }
                            })];
                    case 1:
                        visitor = _a.sent();
                        if (visitor && visitor.value)
                            return [2 /*return*/, visitor.value];
                        else
                            return [2 /*return*/, undefined];
                        return [3 /*break*/, 3];
                    case 2: return [2 /*return*/, undefined];
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        error_7 = _a.sent();
                        console.log('Error in Set Request Car Data');
                        console.log(error_7);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    SessionManager.GetBrowsingVisitors = function (nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var visitors, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!(this.db && this.collection)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.collection.find({
                                nsp: nsp,
                                type: 'Visitors',
                                state: 1
                            }).toArray()];
                    case 1:
                        visitors = _a.sent();
                        if (visitors.length)
                            visitors;
                        else
                            return [2 /*return*/, []];
                        return [3 /*break*/, 3];
                    case 2: return [2 /*return*/, undefined];
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        error_8 = _a.sent();
                        console.log('Error in Get Browsing Visitors');
                        console.log(error_8);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    SessionManager.GetVisitorsForInvitation = function (nsp, timeInMinutes) {
        return __awaiter(this, void 0, void 0, function () {
            var visitors, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!(this.db && this.collection)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.collection.find({
                                nsp: nsp,
                                type: 'Visitors',
                                state: 1,
                                inactive: false,
                                creationDate: { $lte: new Date(new Date().getTime() - 1000 * 60 * timeInMinutes).toISOString() }
                            }).toArray()];
                    case 1:
                        visitors = _a.sent();
                        if (visitors.length)
                            return [2 /*return*/, visitors];
                        else
                            return [2 /*return*/, []];
                        return [3 /*break*/, 3];
                    case 2: return [2 /*return*/, []];
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        error_9 = _a.sent();
                        console.log('Error in Get Browsing Visitors');
                        console.log(error_9);
                        return [2 /*return*/, []];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    SessionManager.UpdateState = function (session, state, checkstate) {
        if (checkstate === void 0) { checkstate = false; }
        return __awaiter(this, void 0, void 0, function () {
            var visitor, error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        visitor = void 0;
                        if (!(this.db && this.collection)) return [3 /*break*/, 5];
                        if (!checkstate) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.collection.findOneAndUpdate({
                                _id: new ObjectId(session.id),
                                state: 4,
                            }, {
                                $set: { state: state }
                            }, { returnOriginal: false, upsert: false })];
                    case 1:
                        visitor = _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.collection.findOneAndUpdate({
                            _id: new ObjectId(session.id),
                        }, {
                            $set: { state: state }
                        }, { returnOriginal: false, upsert: false })];
                    case 3:
                        visitor = _a.sent();
                        _a.label = 4;
                    case 4:
                        if (visitor && visitor.value)
                            return [2 /*return*/, visitor.value];
                        else
                            return [2 /*return*/, undefined];
                        return [3 /*break*/, 6];
                    case 5: return [2 /*return*/, undefined];
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        error_10 = _a.sent();
                        console.log('Error in Update State');
                        console.log(error_10);
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    SessionManager.UnseAgentFromVisitor = function (sessionID) {
        return __awaiter(this, void 0, void 0, function () {
            var session, visitor, error_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 11, , 12]);
                        if (!(this.db && this.collection)) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.GetVisitorByID(sessionID)];
                    case 1:
                        session = _a.sent();
                        if (!session) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.collection.findOneAndUpdate({
                                _id: new ObjectId(sessionID)
                            }, {
                                $set: {
                                    previousState: ((session.inactive) ? '-' : '') + session.state.toString(),
                                    state: 2,
                                    agent: { id: '', nickname: '', image: '' },
                                },
                            }, { returnOriginal: false, upsert: false })];
                    case 2:
                        visitor = _a.sent();
                        if (!(visitor && visitor.value)) return [3 /*break*/, 5];
                        if (!visitor.value.previousState) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.UpdateChatStateHistory(visitor.value)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/, visitor.value];
                    case 5: return [2 /*return*/, undefined];
                    case 6: return [3 /*break*/, 8];
                    case 7: return [2 /*return*/, undefined];
                    case 8: return [3 /*break*/, 10];
                    case 9: return [2 /*return*/, undefined];
                    case 10: return [3 /*break*/, 12];
                    case 11:
                        error_11 = _a.sent();
                        console.log('Error in Unsetting Agent From Visitor');
                        console.log(error_11);
                        return [3 /*break*/, 12];
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    SessionManager.UpdateChatStateHistory = function (session) {
        return __awaiter(this, void 0, void 0, function () {
            var conversation, _a, pullSuperViserAgent, states, visitor, error_12;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 9, , 10]);
                        if (!(this.db && this.collection)) return [3 /*break*/, 7];
                        if (!(session.conversationID)) return [3 /*break*/, 2];
                        return [4 /*yield*/, conversationModel_1.Conversations.GetConversationById(session.conversationID)];
                    case 1:
                        _a = _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        _a = '';
                        _b.label = 3;
                    case 3:
                        conversation = _a;
                        if (!(conversation && conversation.length)) return [3 /*break*/, 5];
                        pullSuperViserAgent = false;
                        // if(conversation[0].superviserAgents.includes(session.agent.id)) await this.EndSuperVisedChat(conversation[0]._id, session.nsp, session.agent.id)
                        if (conversation[0].superviserAgents.includes(session.agent.id))
                            pullSuperViserAgent = true;
                        states = { prevState: session.previousState, nextState: ((((session.inactive) ? '-' : '') + session.state.toString()) + ''), date: new Date().toISOString() };
                        if (session.stateHistory && session.stateHistory.length && (session.stateHistory[session.stateHistory.length - 1].nextState == states.nextState) && (session.stateHistory[session.stateHistory.length - 1].prevState == states.prevState))
                            return [2 /*return*/, session];
                        return [4 /*yield*/, this.collection.findOneAndUpdate({
                                _id: new ObjectId(session._id || session.id)
                            }, {
                                $push: {
                                    stateHistory: states
                                },
                                $pull: {
                                    superviserAgents: (pullSuperViserAgent) ? new mongodb_1.ObjectID(session.agent._id) : ''
                                }
                            }, { returnOriginal: false, upsert: false })];
                    case 4:
                        visitor = _b.sent();
                        if (visitor && visitor.value) {
                            return [2 /*return*/, visitor.value];
                        }
                        else
                            return [2 /*return*/, undefined];
                        return [3 /*break*/, 6];
                    case 5: return [2 /*return*/, undefined];
                    case 6: return [3 /*break*/, 8];
                    case 7: return [2 /*return*/, undefined];
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        error_12 = _b.sent();
                        console.log('Error in Unsetting Agent From Visitor');
                        console.log(error_12);
                        return [3 /*break*/, 10];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    SessionManager.UpdateChatQueHistory = function (session, picketBy) {
        return __awaiter(this, void 0, void 0, function () {
            var obj, visitor, error_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!(this.db && this.collection)) return [3 /*break*/, 2];
                        obj = {
                            pickedBy: picketBy,
                            date: new Date().toISOString(),
                            agentID: (session.agent && session.agent.id) ? session.agent.id : '',
                        };
                        return [4 /*yield*/, this.collection.findOneAndUpdate({
                                _id: new ObjectId(session._id || session.id)
                            }, {
                                $push: {
                                    pickedBy: obj
                                },
                            }, { returnOriginal: false, upsert: false })];
                    case 1:
                        visitor = _a.sent();
                        if (visitor && visitor.value) {
                            return [2 /*return*/, visitor.value];
                        }
                        else
                            return [2 /*return*/, undefined];
                        return [3 /*break*/, 3];
                    case 2: return [2 /*return*/, undefined];
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        error_13 = _a.sent();
                        console.log('Error in setting visitor que history');
                        console.log(error_13);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    SessionManager.UpdateUserInformation = function (session, data) {
        return __awaiter(this, void 0, void 0, function () {
            var visitor, error_14;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        if (!(this.db && this.collection)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.collection.findOneAndUpdate({
                                _id: new ObjectId(session.id || session._id)
                            }, {
                                $set: JSON.parse(JSON.stringify(data))
                            }, { returnOriginal: false, upsert: false })];
                    case 1:
                        visitor = _a.sent();
                        if (!(visitor && visitor.value)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.UpdateChatStateHistory(visitor.value)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, visitor.value];
                    case 3: return [2 /*return*/, undefined];
                    case 4: return [3 /*break*/, 6];
                    case 5: return [2 /*return*/, undefined];
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        error_14 = _a.sent();
                        console.log('Error in Update User Information');
                        console.log(error_14);
                        return [2 /*return*/, undefined];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    //#endregion
    //#region Generic SESSION FUNCTIONS Mongodb
    SessionManager.insertSession = function (session, databse) {
        return __awaiter(this, void 0, void 0, function () {
            var _id, error_15;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!(this.db && this.collection)) return [3 /*break*/, 2];
                        _id = new mongodb_1.ObjectID();
                        session._id = _id;
                        session.id = _id;
                        return [4 /*yield*/, this.collection.insertOne(session)];
                    case 1: 
                    //session.creationDate = new Date(session.creationDate);
                    return [2 /*return*/, _a.sent()];
                    case 2: return [2 /*return*/, undefined];
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        error_15 = _a.sent();
                        console.log('Error in Inserting Session');
                        console.log(error_15);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    SessionManager.UpdateSession = function (sid, session, newState, previousState, checkInactive) {
        return __awaiter(this, void 0, void 0, function () {
            var obj, updatedSession;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.db && this.collection)) return [3 /*break*/, 9];
                        session.state = (newState) ? newState : session.state;
                        if (previousState && (!session.previousState || (session.previousState && (previousState != newState))))
                            session.previousState = previousState;
                        obj = {};
                        Object.assign(obj, session);
                        //console.log("Update Session");
                        // console.log(session);
                        delete obj._id;
                        updatedSession = void 0;
                        if (!checkInactive) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.collection.update({ _id: new ObjectId(sid), inactive: false }, { $set: JSON.parse(JSON.stringify(obj)) }, { upsert: false, multi: false })];
                    case 1:
                        updatedSession = _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.collection.update({ _id: new ObjectId(sid) }, { $set: JSON.parse(JSON.stringify(obj)) }, { upsert: false, multi: false })];
                    case 3:
                        updatedSession = _a.sent();
                        _a.label = 4;
                    case 4:
                        if (!(updatedSession && updatedSession.result)) return [3 /*break*/, 7];
                        if (!obj.previousState) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.UpdateChatStateHistory(obj)];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [2 /*return*/, updatedSession.result];
                    case 7: return [2 /*return*/, undefined];
                    case 8: return [3 /*break*/, 10];
                    case 9: return [2 /*return*/, undefined];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    SessionManager.UpdateSessionPermissions = function (nsp, role, permissions) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.db && this.collection)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.collection.updateMany({ nsp: nsp, role: role }, { $set: { permissions: permissions } })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [2 /*return*/, undefined];
                }
            });
        });
    };
    SessionManager.updateIsMobileBoolean = function (sid, isMobile) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.db && this.collection)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ _id: new ObjectId(sid) }, { $set: { isMobile: isMobile } }, { returnOriginal: false, upsert: false })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [2 /*return*/, undefined];
                }
            });
        });
    };
    SessionManager.DeleteSession = function (sid) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.collection.findOneAndDelete({ _id: new ObjectId(sid) })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SessionManager.RemoveSession = function (session, unset) {
        return __awaiter(this, void 0, void 0, function () {
            var asyncDelete, deletedDocument, _a, _b, error_16;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 20, , 21]);
                        if (!(this.db && this.collection)) return [3 /*break*/, 18];
                        asyncDelete = this.DeleteSession(session._id || session.id);
                        deletedDocument = void 0;
                        _a = session.type;
                        switch (_a) {
                            case 'Agents': return [3 /*break*/, 1];
                        }
                        return [3 /*break*/, 6];
                    case 1: return [4 /*yield*/, asyncDelete];
                    case 2:
                        deletedDocument = _c.sent();
                        if (!deletedDocument) return [3 /*break*/, 4];
                        return [4 /*yield*/, agentSessionModel_1.agentSessions.InserAgentSession(deletedDocument.value)];
                    case 3:
                        _c.sent();
                        return [2 /*return*/, deletedDocument.value];
                    case 4:
                        if (!session) return [3 /*break*/, 6];
                        return [4 /*yield*/, agentSessionModel_1.agentSessions.InserAgentSession(session)];
                    case 5:
                        _c.sent();
                        return [2 /*return*/, session];
                    case 6:
                        _b = session.state.toString();
                        switch (_b) {
                            case '3': return [3 /*break*/, 7];
                            case '4': return [3 /*break*/, 7];
                        }
                        return [3 /*break*/, 12];
                    case 7:
                        if (!unset) return [3 /*break*/, 10];
                        return [4 /*yield*/, this.UnsetChatFromAgent(session)];
                    case 8:
                        _c.sent();
                        return [4 /*yield*/, SessionManager.resetAgentChatCounts(session.nsp, 'Agents')];
                    case 9:
                        _c.sent();
                        _c.label = 10;
                    case 10: return [4 /*yield*/, asyncDelete
                        // if (deletedDocument && deletedDocument.ok) {
                        //     deletedDocument.value['ending_time'] = new Date().toISOString();
                        //     deletedDocument.value['email'] = (SelfAgent && SelfAgent.value) ? SelfAgent.value.email : '';
                        // }
                    ];
                    case 11:
                        deletedDocument = _c.sent();
                        // if (deletedDocument && deletedDocument.ok) {
                        //     deletedDocument.value['ending_time'] = new Date().toISOString();
                        //     deletedDocument.value['email'] = (SelfAgent && SelfAgent.value) ? SelfAgent.value.email : '';
                        // }
                        return [3 /*break*/, 14];
                    case 12: return [4 /*yield*/, asyncDelete
                        //await SessionManager.resetAgentChatCounts(session.nsp, 'Agents');
                        // if (deletedDocument && deletedDocument.ok) {
                        //     deletedDocument.value['ending_time'] = new Date().toISOString();
                        // }
                    ];
                    case 13:
                        // case '1':
                        // case '5':
                        // case '2':
                        deletedDocument = _c.sent();
                        //await SessionManager.resetAgentChatCounts(session.nsp, 'Agents');
                        // if (deletedDocument && deletedDocument.ok) {
                        //     deletedDocument.value['ending_time'] = new Date().toISOString();
                        // }
                        return [3 /*break*/, 14];
                    case 14: return [4 /*yield*/, visitorModel_1.Visitor.UpdateVisitorSessionByDeviceID(session.deviceID, (session._id) ? session._id.toString() : session.id)];
                    case 15:
                        _c.sent();
                        return [4 /*yield*/, visitorSessionmodel_1.visitorSessions.InsertVisitorSession(deletedDocument.value)];
                    case 16: return [2 /*return*/, _c.sent()];
                    case 17: return [3 /*break*/, 19];
                    case 18: return [2 /*return*/, undefined];
                    case 19: return [3 /*break*/, 21];
                    case 20:
                        error_16 = _c.sent();
                        console.log('Error in Remove Session');
                        console.log(error_16);
                        return [3 /*break*/, 21];
                    case 21: return [2 /*return*/];
                }
            });
        });
    };
    SessionManager.RemoveContactSession = function (nsp, email) {
        return __awaiter(this, void 0, void 0, function () {
            var error_17;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!(this.db && this.collection)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.collection.findOneAndDelete({ nsp: nsp, email: email, type: 'Contact' })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [2 /*return*/, undefined];
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        error_17 = _a.sent();
                        console.log('Error in Remove Contact Session');
                        console.log(error_17);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    SessionManager.GetQueuedSession = function (nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var queuedSession, error_18;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!(this.db && this.collection)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.collection.find({
                                nsp: nsp,
                                state: 2,
                                inactive: false
                            }).limit(1).toArray()];
                    case 1:
                        queuedSession = _a.sent();
                        if (!queuedSession.length)
                            return [2 /*return*/, undefined];
                        else
                            return [2 /*return*/, queuedSession[0]];
                        return [3 /*break*/, 3];
                    case 2: return [2 /*return*/, undefined];
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        error_18 = _a.sent();
                        console.log(error_18);
                        console.log('Error in Getting Queued session');
                        return [2 /*return*/, undefined];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    SessionManager.GetAllInactiveVisitors = function (nsp, inactivityTimeout, chattingVisitors) {
        return __awaiter(this, void 0, void 0, function () {
            var inactiveSessions, date, error_19;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        inactiveSessions = [];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        if (!nsp)
                            return [2 /*return*/, []];
                        if (!!isNaN(inactivityTimeout)) return [3 /*break*/, 3];
                        date = new Date();
                        date.setMinutes(date.getMinutes() - inactivityTimeout);
                        if (!(this.db && this.collection)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.collection.find({
                                $and: [
                                    { nsp: nsp },
                                    { inactive: false },
                                    { state: { $in: (chattingVisitors) ? [3, 2] : [1, 4, 5, 8] } },
                                    { lastTouchedTime: { $lte: date.toISOString() } }
                                ]
                            }).toArray()];
                    case 2:
                        inactiveSessions = _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/, inactiveSessions];
                    case 4:
                        error_19 = _a.sent();
                        console.log(error_19);
                        console.log('error in GetAllInactiveNonChattingUsers');
                        return [2 /*return*/, inactiveSessions];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    SessionManager.GetAllWaitingVisitors = function (nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var inactiveSessions, error_20;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        inactiveSessions = [];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        if (!(this.db && this.collection)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.collection.find({
                                $and: [
                                    { nsp: nsp },
                                    { inactive: false },
                                    { state: 3 },
                                ]
                            }).toArray()];
                    case 2:
                        inactiveSessions = _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/, inactiveSessions];
                    case 4:
                        error_20 = _a.sent();
                        console.log(error_20);
                        console.log('error in GetAllInactiveNonChattingUsers');
                        return [2 /*return*/, inactiveSessions];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    SessionManager.GetAllChattingVisitors = function (nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var sessions, error_21;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sessions = [];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        if (!(this.db && this.collection)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.collection.find({
                                nsp: nsp,
                                $or: [
                                    { state: 2 },
                                    { state: 3 },
                                    { state: 4 },
                                ],
                            }).toArray()];
                    case 2:
                        sessions = _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/, sessions];
                    case 4:
                        error_21 = _a.sent();
                        console.log(error_21);
                        console.log('error in GetAllVisitors');
                        return [2 /*return*/, sessions];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    SessionManager.GetAllVisitors = function (nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var sessions, error_22;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sessions = [];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        if (!(this.db && this.collection)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.collection.find({
                                nsp: nsp,
                                type: 'Visitors'
                            }).toArray()];
                    case 2:
                        sessions = _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/, sessions];
                    case 4:
                        error_22 = _a.sent();
                        console.log(error_22);
                        console.log('error in GetAllVisitors');
                        return [2 /*return*/, sessions];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    SessionManager.GetVisitorsCount = function (nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var error_23;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.aggregate([
                                { "$match": { "nsp": nsp, "type": "Visitors" } },
                                { "$group": { "_id": null, "count": { $sum: 1 } } }
                            ]).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_23 = _a.sent();
                        console.log('Error in Getting Visitors Count');
                        console.log(error_23);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SessionManager.GetALLExpiredSessions = function (nsp, type) {
        return __awaiter(this, void 0, void 0, function () {
            var expiredSessions, error_24;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 9, , 10]);
                        expiredSessions = [];
                        if (!(this.db && this.collection)) return [3 /*break*/, 8];
                        if (!(!nsp && !type)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.collection.find({
                                $and: (type == 'Agents') ?
                                    [{ expiry: { $exists: true } }, { expiry: { $lte: new Date().toISOString() } }] :
                                    [{ expiry: { $exists: true } }, { inactive: true }, { expiry: { $lte: new Date().toISOString() } }]
                            }).toArray()];
                    case 1:
                        expiredSessions = _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!(!nsp && type)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.collection.find({
                                $and: (type == 'Agents') ?
                                    [
                                        { nsp: nsp },
                                        { expiry: { $exists: true } }, { expiry: { $lte: new Date().toISOString() } }
                                    ] : [
                                    { nsp: nsp },
                                    { expiry: { $exists: true } }, { inactive: true }, { expiry: { $lte: new Date().toISOString() } }
                                ]
                            }).toArray()];
                    case 3:
                        expiredSessions = _a.sent();
                        _a.label = 4;
                    case 4:
                        if (!(nsp && !type)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.collection.find({
                                $and: (type == 'Agents') ?
                                    [
                                        { type: type },
                                        { expiry: { $exists: true } }, { expiry: { $lte: new Date().toISOString() } }
                                    ] : [
                                    { type: type },
                                    { expiry: { $exists: true } }, { inactive: true }, { expiry: { $lte: new Date().toISOString() } }
                                ]
                            }).toArray()];
                    case 5:
                        expiredSessions = _a.sent();
                        _a.label = 6;
                    case 6:
                        if (!(nsp && type)) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.collection.find({
                                $and: (type == 'Agents') ?
                                    [
                                        { nsp: nsp }, { type: type },
                                        { expiry: { $exists: true } }, { expiry: { $lte: new Date().toISOString() } }
                                    ] : [
                                    { nsp: nsp }, { type: type },
                                    { expiry: { $exists: true } }, { inactive: true }, { expiry: { $lte: new Date().toISOString() } }
                                ]
                            }).toArray()];
                    case 7:
                        expiredSessions = _a.sent();
                        _a.label = 8;
                    case 8: return [2 /*return*/, expiredSessions];
                    case 9:
                        error_24 = _a.sent();
                        console.log(error_24);
                        console.log('Error In Getting Expired Sessions');
                        return [2 /*return*/, []];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    SessionManager.SetExpiry = function (sessionID, timeInMinutes) {
        return __awaiter(this, void 0, void 0, function () {
            var date;
            return __generator(this, function (_a) {
                try {
                    // console.log('setting Expiry : ', sessionID);
                    if (!sessionID || sessionID == 'undefined' || sessionID == 'null')
                        return [2 /*return*/, undefined];
                    date = new Date();
                    date.setMinutes(date.getMinutes() + timeInMinutes);
                    if (this.db && this.collection) {
                        return [2 /*return*/, this.collection.findOneAndUpdate({
                                _id: new mongodb_1.ObjectID(sessionID)
                            }, {
                                $set: { expiry: date.toISOString() }
                            })];
                    }
                    else {
                        return [2 /*return*/, undefined];
                    }
                }
                catch (error) {
                    console.log(error);
                    console.log('Error In SetExpiry');
                }
                return [2 /*return*/];
            });
        });
    };
    SessionManager.UnSetExpiry = function (sessionID) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    if (!sessionID || sessionID == 'undefined' || sessionID == 'null')
                        return [2 /*return*/, undefined];
                    if (this.db && this.collection) {
                        return [2 /*return*/, this.collection.findOneAndUpdate({
                                _id: new mongodb_1.ObjectID(sessionID)
                            }, {
                                $unset: { expiry: 1 },
                                $set: {
                                    lastTouchedTime: new Date().toISOString(),
                                    inactive: false
                                }
                            }, { returnOriginal: false, upsert: false })];
                    }
                    else {
                        return [2 /*return*/, undefined];
                    }
                }
                catch (error) {
                    //console.log(sessionID);
                    console.log(error);
                    console.log('Error In UnSetExpiry');
                }
                return [2 /*return*/];
            });
        });
    };
    SessionManager.MarkReActivate = function (sessionID, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    if (!sessionID || sessionID == 'undefined' || sessionID == 'null')
                        return [2 /*return*/, undefined];
                    if (this.db && this.collection) {
                        if (data && Object.keys(data).length) {
                            data['lastTouchedTime'] = new Date().toISOString();
                            // data['inactive'] = false;
                            data['makeActive'] = true;
                            return [2 /*return*/, this.collection.findOneAndUpdate({
                                    _id: new mongodb_1.ObjectID(sessionID)
                                }, {
                                    $unset: { expiry: 1 },
                                    $set: JSON.parse(JSON.stringify(data)),
                                }, { returnOriginal: false, upsert: false })];
                        }
                        else {
                            return [2 /*return*/, this.collection.findOneAndUpdate({
                                    _id: new mongodb_1.ObjectID(sessionID)
                                }, {
                                    $unset: { expiry: 1 },
                                    $set: { lastTouchedTime: new Date().toISOString(), makeActive: true },
                                }, { returnOriginal: false, upsert: false })];
                        }
                    }
                    else {
                        return [2 /*return*/, undefined];
                    }
                }
                catch (error) {
                    //console.log(sessionID);
                    console.log(error);
                    console.log('Error In UnsetInactive');
                }
                return [2 /*return*/];
            });
        });
    };
    SessionManager.UpdateLastTouchedTime = function (sessionID) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    console.log('Updating Last TOuched Time');
                    if (!sessionID || sessionID == 'undefined' || sessionID == 'null')
                        return [2 /*return*/, undefined];
                    if (this.db && this.collection) {
                        return [2 /*return*/, this.collection.findOneAndUpdate({
                                _id: new mongodb_1.ObjectID(sessionID)
                            }, {
                                $unset: { expiry: 1 },
                                $set: { lastTouchedTime: new Date().toISOString(), inactive: false }
                            }, { returnOriginal: false, upsert: false })];
                    }
                    else {
                        return [2 /*return*/, undefined];
                    }
                }
                catch (error) {
                    //console.log(sessionID);
                    console.log(error);
                    console.log('Error In UnsetInactive');
                }
                return [2 /*return*/];
            });
        });
    };
    SessionManager.SetInactive = function (sessionID) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    if (!sessionID || sessionID == 'undefined' || sessionID == 'null')
                        return [2 /*return*/, undefined];
                    if (this.db && this.collection) {
                        return [2 /*return*/, this.collection.findOneAndUpdate({
                                _id: new mongodb_1.ObjectID(sessionID)
                            }, {
                                $set: { inactive: true }
                            }, { returnOriginal: false, upsert: false })];
                    }
                    else {
                        return [2 /*return*/, undefined];
                    }
                }
                catch (error) {
                    //console.log(sessionID);
                    console.log(error);
                    console.log('Error In Setting Active');
                }
                return [2 /*return*/];
            });
        });
    };
    //#endregion
    //#region NEW AGENT FUNCTIONS OPERATION ON DB
    SessionManager.getAgentByEmail = function (nsp, data) {
        return __awaiter(this, void 0, void 0, function () {
            var agent, error_25;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        if (!(this.db && this.collection)) return [3 /*break*/, 5];
                        agent = void 0;
                        if (!data.includes('@')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.collection.find({
                                nsp: nsp,
                                email: data
                            }).limit(1).toArray()];
                    case 1:
                        agent = _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.collection.find({
                            nsp: nsp,
                            _id: new ObjectId(data)
                        }).limit(1).toArray()];
                    case 3:
                        agent = _a.sent();
                        _a.label = 4;
                    case 4:
                        if (agent.length)
                            return [2 /*return*/, agent[0]];
                        else
                            return [2 /*return*/, undefined];
                        return [3 /*break*/, 6];
                    case 5: return [2 /*return*/, undefined];
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        error_25 = _a.sent();
                        console.log(error_25);
                        console.log('Error in Getting Agent From Email');
                        return [2 /*return*/, undefined];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    SessionManager.getSessionsForCall = function (nsp, data) {
        return __awaiter(this, void 0, void 0, function () {
            var agent, error_26;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        agent = void 0;
                        if (!(this.db && this.collection)) return [3 /*break*/, 4];
                        if (!data.includes('@')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.collection.find({
                                nsp: nsp,
                                email: data
                            }).limit(1).toArray()];
                    case 1:
                        agent = _a.sent();
                        return [3 /*break*/, 4];
                    case 2:
                        if (!(data != '')) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.collection.find({
                                nsp: nsp,
                                _id: new ObjectId(data)
                            }).limit(1).toArray()];
                    case 3:
                        agent = _a.sent();
                        _a.label = 4;
                    case 4:
                        if (agent && agent.length)
                            return [2 /*return*/, agent[0]];
                        else
                            return [2 /*return*/, undefined];
                        return [3 /*break*/, 6];
                    case 5:
                        error_26 = _a.sent();
                        console.log(error_26);
                        console.log('Error in Getting Agent From Email');
                        return [2 /*return*/, undefined];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    SessionManager.GetAllActiveAgents = function (session, exclude) {
        if (exclude === void 0) { exclude = []; }
        return __awaiter(this, void 0, void 0, function () {
            var agent, temp_1, error_27;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        agent = [];
                        temp_1 = exclude.map(function (id) { return new mongodb_1.ObjectID(id); });
                        if (!(this.db && this.collection)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.collection.find({
                                $and: [
                                    { nsp: session.nsp },
                                    { acceptingChats: true },
                                    { type: 'Agents' },
                                    { _id: { $nin: temp_1 } },
                                    (_a = {}, _a['permissions.chats.canChat'] = true, _a),
                                    {
                                        isAdmin: {
                                            $exists: false
                                        }
                                    }
                                ]
                            }).limit(1).toArray()];
                    case 1:
                        agent = _b.sent();
                        _b.label = 2;
                    case 2:
                        if (agent.length)
                            return [2 /*return*/, agent[0]];
                        else
                            return [2 /*return*/, undefined];
                        return [3 /*break*/, 4];
                    case 3:
                        error_27 = _b.sent();
                        console.log('Error in Get Agents');
                        console.log(error_27);
                        return [2 /*return*/, undefined];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SessionManager.GetChattingAgents = function (session, exclude) {
        if (exclude === void 0) { exclude = []; }
        return __awaiter(this, void 0, void 0, function () {
            var agent, temp_2, obj, search, error_28;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        agent = [];
                        temp_2 = exclude.map(function (id) { return new mongodb_1.ObjectID(id); });
                        if (!(this.db && this.collection)) return [3 /*break*/, 2];
                        obj = [(_a = {
                                    nsp: session.nsp,
                                    acceptingChats: true,
                                    type: 'Agents',
                                    _id: { $nin: temp_2 }
                                },
                                _a['permissions.chats.canChat'] = true,
                                _a.isAdmin = { $exists: false },
                                _a)];
                        search = {};
                        search.$and = obj;
                        return [4 /*yield*/, this.collection.find(search).sort({ chatCount: 1, visitorCount: 1 }).limit(1).toArray()];
                    case 1:
                        agent = _b.sent();
                        _b.label = 2;
                    case 2:
                        if (agent.length)
                            return [2 /*return*/, agent[0]];
                        else
                            return [2 /*return*/, undefined];
                        return [3 /*break*/, 4];
                    case 3:
                        error_28 = _b.sent();
                        console.log('Error in Get Agents');
                        console.log(error_28);
                        return [2 /*return*/, undefined];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SessionManager.GetChattingAgentsForInvite = function (session, exclude) {
        if (exclude === void 0) { exclude = []; }
        return __awaiter(this, void 0, void 0, function () {
            var agent, temp_3, obj, search, error_29;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        agent = [];
                        temp_3 = exclude.map(function (id) { return new mongodb_1.ObjectID(id); });
                        if (!(this.db && this.collection)) return [3 /*break*/, 2];
                        obj = [(_a = {
                                    nsp: session.nsp,
                                    type: 'Agents',
                                    _id: { $nin: temp_3 }
                                },
                                _a['permissions.chats.canChat'] = true,
                                _a.isAdmin = { $exists: false },
                                _a)];
                        search = {};
                        search.$and = obj;
                        return [4 /*yield*/, this.collection.find(search).sort({ chatCount: 1, visitorCount: 1 }).limit(1).toArray()];
                    case 1:
                        agent = _b.sent();
                        _b.label = 2;
                    case 2:
                        if (agent.length)
                            return [2 /*return*/, agent[0]];
                        else
                            return [2 /*return*/, undefined];
                        return [3 /*break*/, 4];
                    case 3:
                        error_29 = _b.sent();
                        console.log('Error in Get Agents');
                        console.log(error_29);
                        return [2 /*return*/, undefined];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SessionManager.GetAllActiveAgentsChatting = function (session, exclude) {
        if (exclude === void 0) { exclude = []; }
        return __awaiter(this, void 0, void 0, function () {
            var agent, temp_4, obj, search, error_30;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        agent = [];
                        temp_4 = exclude.map(function (id) { return new mongodb_1.ObjectID(id); });
                        if (!(this.db && this.collection)) return [3 /*break*/, 2];
                        obj = [(_a = {
                                    nsp: session.nsp,
                                    acceptingChats: true,
                                    type: 'Agents',
                                    _id: { $nin: temp_4 }
                                },
                                _a['permissions.chats.canChat'] = true,
                                _a.isAdmin = { $exists: false },
                                _a.$expr = { $lt: ['$chatCount', '$concurrentChatLimit'] },
                                _a)];
                        search = {};
                        search.$and = obj;
                        return [4 /*yield*/, this.collection.find(search).sort({ chatCount: 1, visitorCount: 1 }).limit(1).toArray()];
                    case 1:
                        agent = _b.sent();
                        _b.label = 2;
                    case 2:
                        if (agent.length)
                            return [2 /*return*/, agent[0]];
                        else
                            return [2 /*return*/, undefined];
                        return [3 /*break*/, 4];
                    case 3:
                        error_30 = _b.sent();
                        console.log('Error in Get Agents');
                        console.log(error_30);
                        return [2 /*return*/, undefined];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    //#region Duplicate Functions
    SessionManager.getAllLiveAgents = function (nsp, exclude) {
        if (exclude === void 0) { exclude = []; }
        return __awaiter(this, void 0, void 0, function () {
            var error_31;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
                        exclude = exclude.map(function (id) { return new mongodb_1.ObjectID(id); });
                        if (!(this.db && this.collection)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.collection.find((_a = {
                                    nsp: nsp,
                                    type: 'Agents',
                                    acceptingChats: true
                                },
                                _a['permissions.chats.canChat'] = true,
                                _a._id = { $nin: exclude },
                                _a)).toArray()];
                    case 1: return [2 /*return*/, _b.sent()];
                    case 2: return [2 /*return*/, undefined];
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        error_31 = _b.sent();
                        console.log('Error in Getting All Live Agents');
                        console.log(error_31);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    SessionManager.resetAgentChatCounts = function (nsp, type) {
        return __awaiter(this, void 0, void 0, function () {
            var error_32;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.find({ nsp: nsp, type: type, 'permissions.chats.canChat': true }).toArray()];
                    case 1:
                        (_a.sent()).map(function (session) { return __awaiter(_this, void 0, void 0, function () {
                            var promises;
                            var _this = this;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        promises = Object.keys(session.rooms).map(function (key) { return __awaiter(_this, void 0, void 0, function () {
                                            var visitorSession;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0: return [4 /*yield*/, this.collection.find({ _id: new ObjectId(key) }).limit(1).toArray()];
                                                    case 1:
                                                        visitorSession = _a.sent();
                                                        if (!visitorSession.length || (visitorSession.length && visitorSession[0].inactive))
                                                            delete session.rooms[key];
                                                        return [2 /*return*/];
                                                }
                                            });
                                        }); });
                                        return [4 /*yield*/, Promise.all(promises)];
                                    case 1:
                                        _a.sent();
                                        session.chatCount = Object.keys(session.rooms).length;
                                        this.collection.save(session);
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        return [3 /*break*/, 3];
                    case 2:
                        error_32 = _a.sent();
                        console.log(error_32);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SessionManager.getAllLiveAgentsForCount = function (nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var error_33;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!(this.db && this.collection)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.collection.find({
                                nsp: nsp,
                                type: 'Agents'
                            }).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [2 /*return*/, undefined];
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        error_33 = _a.sent();
                        console.log('Error in get All Live Agents For Count');
                        console.log(error_33);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    SessionManager.getAllLiveAgentsByEmails = function (nsp, emails) {
        return __awaiter(this, void 0, void 0, function () {
            var error_34;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!(this.db && this.collection)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.collection.find({
                                nsp: nsp,
                                type: 'Agents',
                                email: {
                                    $in: emails
                                }
                            }).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [2 /*return*/, undefined];
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        error_34 = _a.sent();
                        console.log('Error in get All Live Agents By Emails');
                        console.log(error_34);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    SessionManager.GetLiveAvailableAgentForVisitors = function (nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var error_35;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
                        if (!(this.db && this.collection)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.collection.find((_a = {
                                    nsp: nsp,
                                    type: 'Agents',
                                    acceptingChats: true
                                },
                                _a['permissions.chats.canChat'] = true,
                                _a.isAdmin = {
                                    $exists: false,
                                },
                                _a), {
                                fields: {
                                    _id: 1,
                                    image: 1,
                                    nickname: 1,
                                }
                            }).toArray()];
                    case 1: return [2 /*return*/, _b.sent()];
                    case 2: return [2 /*return*/, undefined];
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        error_35 = _b.sent();
                        console.log('Error in Get Live Available Agent For Visitors');
                        console.log(error_35);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    SessionManager.GetAllMobileVisitorsDeviceIDs = function (nsp, exclude) {
        if (exclude === void 0) { exclude = []; }
        return __awaiter(this, void 0, void 0, function () {
            var error_36;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        exclude = exclude.map(function (id) { return new mongodb_1.ObjectID(id); });
                        if (!(this.db && this.collection)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.collection.find({
                                nsp: nsp,
                                type: 'Visitors',
                                isMobile: true,
                            }, {
                                fields: {
                                    deviceID: 1,
                                }
                            }).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [2 /*return*/, undefined];
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        error_36 = _a.sent();
                        console.log('Error in Get All Mobile Visitors DeviceIDs');
                        console.log(error_36);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    SessionManager.GetAllAgents = function (session) {
        return __awaiter(this, void 0, void 0, function () {
            var agent, error_37;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        agent = [];
                        if (!(this.db && this.collection)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.collection.find({
                                nsp: session.nsp
                            }).limit(1).toArray()];
                    case 1:
                        agent = _a.sent();
                        _a.label = 2;
                    case 2:
                        if (agent.length)
                            return [2 /*return*/, agent[0]];
                        else
                            undefined;
                        return [3 /*break*/, 4];
                    case 3:
                        error_37 = _a.sent();
                        console.log('Error in Get Agents');
                        console.log(error_37);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SessionManager.GetAllAgentsByNSP = function (nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var agents, error_38;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        agents = [];
                        if (!(this.db && this.collection)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.collection.find({
                                type: 'Agents',
                                nsp: nsp
                            }).toArray()];
                    case 1:
                        agents = _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/, agents];
                    case 3:
                        error_38 = _a.sent();
                        console.log('Error in Get Agents');
                        console.log(error_38);
                        return [2 /*return*/, []];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    //#endregion
    SessionManager.GetBestAgent = function (nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var bestAgent, error_39;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.find((_a = {
                                    nsp: nsp,
                                    acceptingChats: true
                                },
                                _a['permissions.chats.canChat'] = true,
                                // chatCount: { $lt: __biZZC_Core.ConcurrentChatLimit },
                                _a.type = 'Agents',
                                _a.$expr = { $lt: ['$chatCount', '$concurrentChatLimit'] },
                                _a), { sort: { "chatCount": 1 } }).limit(1).toArray()];
                    case 1:
                        bestAgent = _b.sent();
                        if (bestAgent && bestAgent.length)
                            return [2 /*return*/, bestAgent[0]];
                        else
                            return [2 /*return*/, undefined];
                        return [3 /*break*/, 3];
                    case 2:
                        error_39 = _b.sent();
                        console.log('Error in Get Best Agent');
                        console.log(error_39);
                        return [2 /*return*/, undefined];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SessionManager.AllocateAgent = function (VisitorSession, conversationID, exclude, state, ruleSetSearch) {
        if (exclude === void 0) { exclude = []; }
        if (ruleSetSearch === void 0) { ruleSetSearch = ''; }
        return __awaiter(this, void 0, void 0, function () {
            var search, $and, actualRule, bestAgent, updatedVisitorSession, error_40;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 12, , 13]);
                        if (!(this.db && this.collection)) return [3 /*break*/, 10];
                        exclude = exclude.map(function (id) { return new mongodb_1.ObjectID(id); });
                        search = {
                            $or: []
                        };
                        $and = {
                            $and: []
                        };
                        actualRule = (_a = {
                                nsp: VisitorSession.nsp,
                                acceptingChats: true
                            },
                            _a['permissions.chats.canChat'] = true,
                            // chatCount: { $lt: __biZZC_Core.ConcurrentChatLimit },
                            _a.type = 'Agents',
                            _a._id = { $nin: exclude },
                            _a.$expr = { $lt: ['$chatCount', '$concurrentChatLimit'] },
                            _a);
                        bestAgent = {};
                        if (!Object.keys(ruleSetSearch).length) return [3 /*break*/, 2];
                        search.$or.push(JSON.parse(JSON.stringify($and)));
                        search.$or[0]['$and'][0] = JSON.parse(JSON.stringify(actualRule));
                        Object.assign(search.$or[0]['$and'][0], ruleSetSearch);
                        return [4 /*yield*/, this.collection.findOneAndUpdate(search, {
                                $set: (_b = {},
                                    _b["rooms." + (VisitorSession.id || VisitorSession._id).toString()] = (VisitorSession.id || VisitorSession._id).toString(),
                                    _b),
                                $inc: {
                                    chatCount: 1, visitorCount: 1
                                }
                            }, { returnOriginal: false, upsert: false })];
                    case 1:
                        // search.$or[1]['$and'][0] = actualRule
                        bestAgent = _d.sent();
                        _d.label = 2;
                    case 2:
                        if (!(bestAgent && !bestAgent.value)) return [3 /*break*/, 4];
                        search.$or.push(JSON.parse(JSON.stringify($and)));
                        search.$or[0]['$and'][0] = actualRule;
                        return [4 /*yield*/, this.collection.findOneAndUpdate(search, {
                                $set: (_c = {},
                                    _c["rooms." + (VisitorSession.id || VisitorSession._id).toString()] = (VisitorSession.id || VisitorSession._id).toString(),
                                    _c),
                                $inc: {
                                    chatCount: 1, visitorCount: 1
                                }
                            }, { returnOriginal: false, upsert: false, sort: { chatCount: 1, visitorCount: 1 } })];
                    case 3:
                        bestAgent = _d.sent();
                        _d.label = 4;
                    case 4:
                        //for rulset search (if agent not available then visitor should be unassigned)
                        // let obj: any = [
                        //     { nsp: VisitorSession.nsp },
                        //     { acceptingChats: true },
                        //     { ['permissions.chats.canChat']: true },
                        //     // chatCount: { $lt: __biZZC_Core.ConcurrentChatLimit },
                        //     { type: 'Agents' },
                        //     { _id: { $nin: exclude } },
                        //     { $expr: { $lt: ['$chatCount', '$concurrentChatLimit'] } }
                        // ];
                        // let search: any = {};
                        // search.$and = obj
                        // console.log(search);
                        // console.log(search.$or[0]);
                        // console.log(search.$or[1]);
                        // let bestAgent = await this.collection.findOneAndUpdate(
                        //   search,
                        //   {
                        //     $set: {
                        //       [`rooms.${((VisitorSession.id || VisitorSession._id) as any).toString()}`]: ((VisitorSession.id || VisitorSession._id) as any).toString(),
                        //     },
                        //     $inc: {
                        //       chatCount: 1, visitorCount: 1
                        //     }
                        //   }, { returnOriginal: false, upsert: false, sort: { chatCount: 1, visitorCount: 1 } },
                        // )
                        VisitorSession.previousState = (((VisitorSession.inactive) ? '-' : '') + VisitorSession.state.toString());
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ _id: new mongodb_1.ObjectID(VisitorSession.id || VisitorSession._id) }, {
                                $set: {
                                    agent: (bestAgent.value) ? {
                                        id: bestAgent.value._id.toString(),
                                        name: (bestAgent.value.nickname) ? bestAgent.value.nickname : bestAgent.value.name,
                                        image: (bestAgent.value.image) ? bestAgent.value.image : ''
                                    } : { id: '', name: '', image: '' },
                                    state: (state) ? state : (bestAgent.value) ? 3 : 2,
                                    previousState: (VisitorSession.previousState) ? VisitorSession.previousState : '',
                                    conversationID: conversationID,
                                    username: VisitorSession.username,
                                    email: VisitorSession.email
                                }
                            }, { returnOriginal: false, upsert: false })];
                    case 5:
                        updatedVisitorSession = _d.sent();
                        if (!(updatedVisitorSession && updatedVisitorSession.value)) return [3 /*break*/, 8];
                        if (!updatedVisitorSession.value.previousState) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.UpdateChatStateHistory(updatedVisitorSession.value)];
                    case 6:
                        _d.sent();
                        _d.label = 7;
                    case 7: return [2 /*return*/, {
                            agent: bestAgent.value,
                            visitor: updatedVisitorSession.value
                        }];
                    case 8: return [2 /*return*/, undefined];
                    case 9: return [3 /*break*/, 11];
                    case 10: return [2 /*return*/, undefined];
                    case 11: return [3 /*break*/, 13];
                    case 12:
                        error_40 = _d.sent();
                        console.log('Error in Allocating Agent');
                        console.log(error_40);
                        return [2 /*return*/, undefined];
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    SessionManager.ToogleChatMode = function (AgentSession, chatMode) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, error_41;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 8, , 9]);
                        if (!(this.db && this.collection)) return [3 /*break*/, 6];
                        _a = chatMode;
                        switch (_a) {
                            case 'IDLE': return [3 /*break*/, 1];
                            case 'ACTIVE': return [3 /*break*/, 3];
                        }
                        return [3 /*break*/, 5];
                    case 1: return [4 /*yield*/, this.collection.findOneAndUpdate({
                            _id: new mongodb_1.ObjectID(AgentSession.id || AgentSession._id),
                            nsp: AgentSession.nsp,
                        }, {
                            $set: { state: 'IDLE', acceptingChats: false },
                            $push: {
                                idlePeriod: {
                                    $each: [{ startTime: new Date().toISOString(), endTime: undefined }],
                                    $position: 0
                                }
                            }
                        }, { returnOriginal: false, upsert: false })];
                    case 2: return [2 /*return*/, _c.sent()];
                    case 3: return [4 /*yield*/, this.collection.findOneAndUpdate({
                            _id: new mongodb_1.ObjectID(AgentSession.id || AgentSession._id),
                            nsp: AgentSession.nsp
                        }, {
                            $set: (_b = {
                                    state: 'ACTIVE',
                                    acceptingChats: true
                                },
                                _b['idlePeriod.0.endTime'] = new Date().toISOString(),
                                _b),
                        }, { returnOriginal: false, upsert: false })];
                    case 4: return [2 /*return*/, _c.sent()];
                    case 5: return [3 /*break*/, 7];
                    case 6: return [2 /*return*/, undefined];
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        error_41 = _c.sent();
                        console.log('Error in Toggle Chat Mode');
                        console.log(error_41);
                        return [2 /*return*/, undefined];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    SessionManager.SetAgentChatCount = function (Agent, chatCount) {
        return __awaiter(this, void 0, void 0, function () {
            var error_42;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!(this.db && this.collection)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.collection.findOneAndUpdate({
                                email: Agent.email,
                                nsp: Agent.nsp,
                                _id: new mongodb_1.ObjectID(Agent.id),
                            }, {
                                $set: { chatCount: chatCount },
                            }, { returnOriginal: false, upsert: false })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [2 /*return*/, undefined];
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        error_42 = _a.sent();
                        console.log(error_42);
                        console.log('Error in setting Chat Count for Agent');
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    SessionManager.UnsetChatFromAgent = function (session) {
        return __awaiter(this, void 0, void 0, function () {
            var error_43;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 4, , 5]);
                        if (!(this.db && this.collection)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.collection.findOneAndUpdate((_a = {
                                    nsp: session.nsp,
                                    _id: new mongodb_1.ObjectID(session.agent.id)
                                },
                                _a["rooms." + (session._id.toString() || session.id.toString())] = { $exists: true },
                                _a), {
                                $unset: (_b = {}, _b["rooms." + (session._id || session.id).toString()] = 1, _b),
                                $inc: { chatCount: -1 }
                            }, { returnOriginal: false, upsert: false })];
                    case 1: return [2 /*return*/, _c.sent()];
                    case 2: return [2 /*return*/, undefined];
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        error_43 = _c.sent();
                        console.log(error_43);
                        console.log('Error in Unsetting Chat From Agent');
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    SessionManager.getConversationByAgentID = function (nsp, id) {
        return __awaiter(this, void 0, void 0, function () {
            var list, error_44;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        list = void 0;
                        if (!(this.db && this.collection)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.collection.find({
                                type: 'Visitors',
                                "agent.id": id,
                            }).toArray()];
                    case 1:
                        list = _a.sent();
                        _a.label = 2;
                    case 2:
                        if (list && list.length)
                            return [2 /*return*/, list];
                        else
                            return [2 /*return*/, []];
                        return [3 /*break*/, 4];
                    case 3:
                        error_44 = _a.sent();
                        console.log(error_44);
                        console.log('Error in Unsetting Chat From Agent');
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SessionManager.GetLiveAdminSessionFromDatabase = function (email) {
        //{ nsp: '/admin' },
        return this.collection.find({
            $and: [
                { type: "Agents" },
                { isAdmin: { $exists: true } },
                { email: email.toLowerCase() }
            ]
        })
            .limit(1)
            .toArray();
    };
    SessionManager.GetLiveSessionAgentByEmail = function (email) {
        return this.db.collection('sessions').find({
            $and: [
                { type: "Agents" },
                { email: email.toLowerCase() },
                { updated: true },
                { isAdmin: { $exists: false } },
            ]
        })
            .limit(1)
            .toArray();
    };
    SessionManager.GetLiveResellerSessionFromDatabase = function (email) {
        //{ nsp: '/admin' },
        return this.collection.find({
            $and: [
                { type: "Reseller" },
                { isReseller: { $exists: true } },
                { email: email.toLowerCase() }
            ]
        })
            .limit(1)
            .toArray();
    };
    SessionManager.updateSessions = function (emails, team, type) {
        if (type === void 0) { type = '$push'; }
        return __awaiter(this, void 0, void 0, function () {
            var modifiedCount, sessions, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        modifiedCount = 0;
                        console.log(emails);
                        sessions = void 0;
                        if (!(type == '$push')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.collection.updateMany({ email: { '$in': emails } }, { $addToSet: { teams: team } })];
                    case 1:
                        sessions = _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.collection.updateMany({ email: { '$in': emails } }, { $pull: { teams: team } })];
                    case 3:
                        sessions = _a.sent();
                        _a.label = 4;
                    case 4:
                        if (sessions && sessions.modifiedCount > 0) {
                            modifiedCount = sessions.modifiedCount;
                        }
                        return [2 /*return*/, modifiedCount];
                    case 5:
                        err_1 = _a.sent();
                        console.log('Error in updating sessions');
                        console.log(err_1);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    SessionManager.GetAgentByID = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var agent, error_45;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        agent = [];
                        if (!(this.db && this.collection && (id && id != 'undefined'))) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.collection.find({
                                _id: new ObjectId(id)
                            }).limit(1).toArray()];
                    case 1:
                        agent = _a.sent();
                        _a.label = 2;
                    case 2:
                        if (agent.length)
                            return [2 /*return*/, agent[0]];
                        else
                            return [2 /*return*/, undefined];
                        return [3 /*break*/, 4];
                    case 3:
                        error_45 = _a.sent();
                        console.log('Error in Get Agent By Id');
                        console.log(error_45);
                        return [2 /*return*/, undefined];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SessionManager.sendVisitorList = function (session) {
        return __awaiter(this, void 0, void 0, function () {
            var visitorList, error_46;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        visitorList = [];
                        if (!(this.db && this.collection)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.collection.find({ nsp: session.nsp, type: 'Visitors' }).toArray()];
                    case 1:
                        visitorList = _a.sent();
                        _a.label = 2;
                    case 2:
                        if (visitorList.length)
                            return [2 /*return*/, visitorList];
                        else
                            return [2 /*return*/, []];
                        return [3 /*break*/, 4];
                    case 3:
                        error_46 = _a.sent();
                        console.log('Error in Sending Visitors List');
                        console.log(error_46);
                        return [2 /*return*/, []];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    //#endregion
    SessionManager.UpdateSessionGroup = function (sid, location) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.db && this.collection)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ _id: new ObjectId(sid) }, {
                                $set: {
                                    location: location
                                }
                            }, { returnOriginal: false, upsert: false })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    SessionManager.UpdateCallingState = function (data, obj) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.db && this.collection)) return [3 /*break*/, 4];
                        if (!data.includes('@')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ email: data }, {
                                $set: {
                                    callingState: obj
                                }
                            }, { returnOriginal: false, upsert: false })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [4 /*yield*/, this.collection.findOneAndUpdate({ _id: new ObjectId(data) }, {
                            $set: {
                                callingState: obj
                            }
                        }, { returnOriginal: false, upsert: false })];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SessionManager.updateConversationState = function (nsp, email, cid, state) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.db && this.collection)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ email: email, nsp: nsp }, { $set: { conversationState: { cid: cid, state: state } } }, { returnOriginal: false, upsert: false })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    SessionManager.setConversationID = function (sid, cid) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    return [2 /*return*/, this.collection.findOneAndUpdate({ _id: new mongodb_1.ObjectID(sid) }, { $set: { conversationID: new ObjectId(cid) } }, { returnOriginal: false, upsert: false })];
                }
                catch (error) {
                    console.log(error);
                    console.log('error in setting Conversation state');
                }
                return [2 /*return*/];
            });
        });
    };
    SessionManager.UserAvailableForCalling = function (nsp, data, obj) {
        return __awaiter(this, void 0, void 0, function () {
            var error_47;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        if (!(this.db && this.collection)) return [3 /*break*/, 5];
                        if (!data.includes('@')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.collection.findOneAndUpdate({
                                nsp: nsp,
                                email: data,
                                type: 'Agents'
                            }, {
                                $set: {
                                    callingState: obj
                                }
                            }, { returnOriginal: false, upsert: false })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [4 /*yield*/, this.collection.findOneAndUpdate({
                            nsp: nsp,
                            _id: new ObjectId(data),
                            type: 'Visitors'
                        }, {
                            $set: {
                                callingState: obj
                            }
                        }, { returnOriginal: false, upsert: false })];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4: return [3 /*break*/, 6];
                    case 5: return [2 /*return*/, undefined];
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        error_47 = _a.sent();
                        console.log(error_47);
                        console.log('Error in Getting Agent From Email');
                        return [2 /*return*/, undefined];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    SessionManager.UpdateCallingStateAgent = function (email, agent) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.db && this.collection)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ email: email }, {
                                $set: {
                                    'callingState.agent': agent
                                }
                            }, { returnOriginal: false, upsert: false })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [2 /*return*/, undefined];
                }
            });
        });
    };
    SessionManager.Exists = function (sid) {
        try {
            if (!sid)
                return undefined;
            if (this.db && this.collection) {
                return this.collection.find({ _id: new ObjectId(sid), updated: true }).limit(1).toArray();
            }
            else {
                return undefined;
            }
        }
        catch (error) {
            console.log('Error in Session Exists');
            console.log(error);
            return undefined;
        }
    };
    SessionManager.ExistandUpdate = function (sid, href) {
        try {
            if (!sid)
                return undefined;
            if (this.db && this.collection) {
                return this.collection.findOneAndUpdate({ _id: new ObjectId(sid) }, {
                    $push: { "url": { $each: [(href) ? href.trim() : ''], $position: 0, $slice: 6 } },
                    $unset: { expiry: 1 },
                    $set: { newUser: false, typingState: false, lastTouchedTime: new Date().toISOString() }
                }, { returnOriginal: false, upsert: false });
            }
            else {
                return undefined;
            }
        }
        catch (error) {
            console.log('Error in Session Exists');
            console.log(error);
            return undefined;
        }
    };
    SessionManager.Exists_registered = function (email) {
        try {
            // console.log(email);
            if (this.db && this.collection) {
                return this.collection.findOneAndUpdate({
                    isMobile: true,
                    email: email
                }, {
                    $set: { newUser: false }
                }, { returnOriginal: false, upsert: false });
            }
            else {
                return undefined;
            }
        }
        catch (error) {
            console.log('Error in Session Exists');
            console.log(error);
            return undefined;
        }
    };
    SessionManager.Exists_contact = function (email) {
        try {
            if (this.db && this.collection) {
                return this.collection.findOneAndUpdate({
                    type: 'Contact',
                    email: email
                }, {
                    $set: { newUser: false }
                }, { returnOriginal: false, upsert: false });
            }
            else {
                return undefined;
            }
        }
        catch (error) {
            console.log('Error in Session Exists');
            console.log(error);
            return undefined;
        }
    };
    //#region Actions For Main Session Data
    SessionManager.UpdateAgentGroup = function (groupName, Agents) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.db && this.collection) {
                    return [2 /*return*/, this.collection.update({
                            email: { $in: Agents },
                            location: { $nin: [groupName] }
                        }, {
                            $addToSet: { location: groupName }
                        }, { multi: true, upsert: false })];
                }
                else {
                    return [2 /*return*/, undefined];
                }
                return [2 /*return*/];
            });
        });
    };
    SessionManager.UpdateVisitorsGroup = function (nsp, groupName, deactivate) {
        if (deactivate === void 0) { deactivate = false; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.db && this.collection) {
                    return [2 /*return*/, this.collection.update({
                            nsp: nsp,
                            state: { $in: [1, 4, 5] },
                            type: 'Visitors',
                            country: groupName,
                        }, {
                            $set: { location: (!deactivate) ? groupName : 'DF' }
                        }, { multi: true, upsert: false })];
                }
                else {
                    return [2 /*return*/, undefined];
                }
                return [2 /*return*/];
            });
        });
    };
    SessionManager.RemoveAgentSessionFromGroup = function (nsp, location, sid, agentEmail) {
        try {
            var sessionMap = this.sessionList;
            if (sessionMap[nsp][location]['Agents' + location][sid] != undefined) {
                delete sessionMap[nsp][location]['Agents' + location][sid];
            }
            //console.log(sessionMap);
            if (this.db && this.collection) {
                if (agentEmail) {
                    this.collection.findOneAndUpdate({
                        email: agentEmail,
                        location: { $in: [location] }
                    }, {
                        $pull: { location: location }
                    }, { returnOriginal: false, upsert: false, });
                }
            }
        }
        catch (error) {
            console.log('Error in Removing Agent Location SESSION MANAGER');
            console.log(error);
        }
    };
    SessionManager.checkSession = function (sid) {
        try {
            if (this.db && this.collection) {
                return this.collection.find({ _id: sid }).toArray();
            }
            else {
                return undefined;
            }
        }
        catch (error) {
            console.log(error);
            console.log('error in Check Session');
            return undefined;
        }
    };
    // Returns Agents Session
    SessionManager.AssignAgent = function (Visitorsession, AgentSessionID, conversationID, state) {
        return __awaiter(this, void 0, void 0, function () {
            var updatedAgent, previousState, updatedVisitorSession, error_48;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        console.log('Assigning Agent');
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 11, , 12]);
                        if (!(this.db && this.collection)) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.collection.findOneAndUpdate((_a = {
                                    _id: new ObjectId(AgentSessionID)
                                },
                                _a['permissions.chats.canChat'] = true,
                                _a.acceptingChats = true,
                                _a), {
                                $set: (_b = {},
                                    _b["rooms." + Visitorsession.id.toString()] = Visitorsession.id.toString(),
                                    _b),
                                $inc: {
                                    chatCount: 1, visitorCount: 1
                                }
                            }, { returnOriginal: false, upsert: false })];
                    case 2:
                        updatedAgent = _c.sent();
                        if (!(updatedAgent && updatedAgent.value && updatedAgent.ok)) return [3 /*break*/, 8];
                        previousState = (((Visitorsession.inactive) ? '-' : '') + Visitorsession.state.toString()) + '';
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ _id: new mongodb_1.ObjectID(Visitorsession.id || Visitorsession._id) }, {
                                $set: {
                                    agent: {
                                        id: updatedAgent.value._id.toString(),
                                        name: (updatedAgent.value.nickname) ? updatedAgent.value.nickname : updatedAgent.value.name,
                                        image: (updatedAgent.value.image) ? updatedAgent.value.image : ''
                                    },
                                    state: (!state) ? 3 : state,
                                    previousState: previousState,
                                    conversationID: conversationID,
                                    username: Visitorsession.username,
                                    email: Visitorsession.email
                                }
                            }, { returnOriginal: false, upsert: false })];
                    case 3:
                        updatedVisitorSession = _c.sent();
                        if (!(updatedVisitorSession && updatedVisitorSession.value)) return [3 /*break*/, 6];
                        if (!updatedVisitorSession.value.previousState) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.UpdateChatStateHistory(updatedVisitorSession.value)
                            // setTimeout(async () => {
                            //     let convos = await SessionManager.getConversationByAgentID(updatedAgent.value.nsp, updatedAgent.value._id);
                            //     let count = 0;
                            //     if (convos) {
                            //         console.log(convos);
                            //         count = convos.length
                            //         let updatedCount = await SessionManager.SetAgentChatCount(updatedAgent.value, count)
                            //         if (updatedCount) console.log(updatedCount);
                            //     }
                            // }, 0);
                        ];
                    case 4:
                        _c.sent();
                        _c.label = 5;
                    case 5: 
                    // setTimeout(async () => {
                    //     let convos = await SessionManager.getConversationByAgentID(updatedAgent.value.nsp, updatedAgent.value._id);
                    //     let count = 0;
                    //     if (convos) {
                    //         console.log(convos);
                    //         count = convos.length
                    //         let updatedCount = await SessionManager.SetAgentChatCount(updatedAgent.value, count)
                    //         if (updatedCount) console.log(updatedCount);
                    //     }
                    // }, 0);
                    return [2 /*return*/, {
                            agent: updatedAgent.value,
                            visitor: updatedVisitorSession.value
                        }];
                    case 6: return [4 /*yield*/, this.UnsetChatFromAgent(Visitorsession)];
                    case 7:
                        _c.sent();
                        return [2 /*return*/, undefined];
                    case 8: return [2 /*return*/, undefined];
                    case 9: return [2 /*return*/, undefined];
                    case 10: return [3 /*break*/, 12];
                    case 11:
                        error_48 = _c.sent();
                        console.log('Error in Assign Agent');
                        console.log(error_48);
                        return [2 /*return*/, undefined];
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    SessionManager.AssignQueuedVisitor = function (agentSession, sid) {
        return __awaiter(this, void 0, void 0, function () {
            var updatedVisitorSession, updatedAgent, error_49;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log('AssignQueuedVisitor');
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 7, , 8]);
                        if (!(this.db && this.collection)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.collection.findOneAndUpdate({
                                _id: new ObjectId(sid),
                                nsp: agentSession.nsp,
                                state: 2,
                                type: 'Visitors',
                            }, {
                                $set: {
                                    agent: {
                                        id: (agentSession._id || agentSession.id).toString(),
                                        name: agentSession.nickname,
                                        image: (agentSession.image) ? agentSession.image : ''
                                    },
                                    state: 3,
                                    previousState: '2'
                                }
                            }, { returnOriginal: false, upsert: false })];
                    case 2:
                        updatedVisitorSession = _b.sent();
                        if (!(updatedVisitorSession && updatedVisitorSession.value)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.collection.findOneAndUpdate({
                                _id: new ObjectId(agentSession.id)
                            }, {
                                $set: (_a = {},
                                    _a["rooms." + updatedVisitorSession.value.id.toString()] = (updatedVisitorSession.value.id || updatedVisitorSession.value._id).toString(),
                                    _a),
                                $inc: {
                                    chatCount: 1, visitorCount: 1
                                }
                            }, { returnOriginal: false, upsert: false })];
                    case 3:
                        updatedAgent = _b.sent();
                        if (updatedAgent && updatedAgent.value && updatedAgent.ok) {
                            // let convos = await SessionManager.getConversationByAgentID(updatedAgent.value.nsp, updatedAgent.value._id);
                            // let count = 0;
                            // if (convos && convos.length) {
                            //     console.log(convos.length);
                            //     count = convos.length
                            //     await SessionManager.SetAgentChatCount(updatedAgent.value, count)
                            // }
                            return [2 /*return*/, {
                                    agent: updatedAgent.value,
                                    visitor: updatedVisitorSession.value
                                }];
                        }
                        return [2 /*return*/, undefined];
                    case 4: return [2 /*return*/, undefined];
                    case 5: return [2 /*return*/, undefined];
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        error_49 = _b.sent();
                        console.log('Error in Assign Agent');
                        console.log(error_49);
                        return [2 /*return*/, undefined];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    SessionManager.AssignAgentByEmail = function (Visitorsession, email, conversationID, state, ruleSetSearch) {
        if (ruleSetSearch === void 0) { ruleSetSearch = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var search, $and, actualRule, updatedAgent, updatedVisitorSession, error_50;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        console.log('Assigning Agent By Email');
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 10, , 11]);
                        if (!(this.db && this.collection)) return [3 /*break*/, 8];
                        search = {
                            $or: []
                        };
                        $and = {
                            $and: []
                        };
                        search.$or.push(JSON.parse(JSON.stringify($and)));
                        actualRule = (_a = {
                                nsp: Visitorsession.nsp,
                                email: email
                            },
                            _a['permissions.chats.canChat'] = true,
                            _a.acceptingChats = true,
                            _a);
                        search.$or[0]['$and'][0] = actualRule;
                        if (ruleSetSearch) {
                            search.$or.push(JSON.parse(JSON.stringify($and)));
                            search.$or[1]['$and'][0] = (JSON.parse(JSON.stringify(actualRule)));
                            Object.assign(search.$or[1]['$and'][0], ruleSetSearch);
                        }
                        return [4 /*yield*/, this.collection.findOneAndUpdate(search, {
                                $set: (_b = {},
                                    _b["rooms." + (Visitorsession.id || Visitorsession._id).toString()] = (Visitorsession.id || Visitorsession._id).toString(),
                                    _b),
                                $inc: {
                                    chatCount: 1, visitorCount: 1
                                }
                            }, { returnOriginal: false, upsert: false })];
                    case 2:
                        updatedAgent = _c.sent();
                        if (!(updatedAgent && updatedAgent.value && updatedAgent.ok)) return [3 /*break*/, 7];
                        Visitorsession.previousState = (((Visitorsession.inactive) ? '-' : '') + Visitorsession.state.toString()) + '';
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ _id: new mongodb_1.ObjectID(Visitorsession.id || Visitorsession._id) }, {
                                $set: {
                                    agent: {
                                        id: updatedAgent.value._id.toString(),
                                        name: (updatedAgent.value.nickname) ? updatedAgent.value.nickname : updatedAgent.value.name,
                                        image: (updatedAgent.value.image) ? updatedAgent.value.image : ''
                                    },
                                    state: (!state) ? 3 : state,
                                    previousState: (Visitorsession.previousState) ? Visitorsession.previousState : '',
                                    conversationID: conversationID
                                }
                            }, { returnOriginal: false, upsert: false })];
                    case 3:
                        updatedVisitorSession = _c.sent();
                        if (!(updatedVisitorSession && updatedVisitorSession.value)) return [3 /*break*/, 6];
                        if (!updatedVisitorSession.value.previousState) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.UpdateChatStateHistory(updatedVisitorSession.value)
                            // let convos = await SessionManager.getConversationByAgentID(updatedAgent.value.nsp, updatedAgent.value._id);
                            // let count = 0;
                            // if (convos && convos.length) {
                            //     console.log(convos.length);
                            //     count = convos.length
                            //     await SessionManager.SetAgentChatCount(updatedAgent.value, count)
                            // }
                        ];
                    case 4:
                        _c.sent();
                        _c.label = 5;
                    case 5: 
                    // let convos = await SessionManager.getConversationByAgentID(updatedAgent.value.nsp, updatedAgent.value._id);
                    // let count = 0;
                    // if (convos && convos.length) {
                    //     console.log(convos.length);
                    //     count = convos.length
                    //     await SessionManager.SetAgentChatCount(updatedAgent.value, count)
                    // }
                    return [2 /*return*/, {
                            agent: updatedAgent.value,
                            visitor: updatedVisitorSession.value
                        }];
                    case 6: return [2 /*return*/, undefined];
                    case 7: return [2 /*return*/, undefined];
                    case 8: return [2 /*return*/, undefined];
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        error_50 = _c.sent();
                        console.log('Error in Assign Agent');
                        console.log(error_50);
                        return [2 /*return*/, undefined];
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    //#region Allocation Priority Agent
    SessionManager.AllocateAgentPriority = function (session, email, conversationID, state, agentSearch) {
        if (agentSearch === void 0) { agentSearch = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var UpdatedSessions, error_51;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!(this.db && this.collection)) return [3 /*break*/, 2];
                        return [4 /*yield*/, SessionManager.AssignAgentByEmail(session, email, conversationID, (state) ? state : undefined, (agentSearch) ? agentSearch : undefined)];
                    case 1:
                        UpdatedSessions = _a.sent();
                        if (UpdatedSessions)
                            return [2 /*return*/, UpdatedSessions];
                        else
                            return [2 /*return*/, undefined];
                        return [3 /*break*/, 3];
                    case 2: return [2 /*return*/, undefined];
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        error_51 = _a.sent();
                        console.log('Error in Allocating Agent');
                        console.log(error_51);
                        return [2 /*return*/, undefined];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    //#endregion
    //Best Fit Method
    //#region Contact Operations
    SessionManager.GetSessionByEmailFromDatabase = function (email, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var visitor, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        visitor = [];
                        if (!(this.db && this.collection)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.collection.find({
                                email: email,
                                nsp: nsp,
                                type: 'Agents'
                            }).limit(1).toArray()];
                    case 1:
                        visitor = _a.sent();
                        _a.label = 2;
                    case 2:
                        if (visitor.length)
                            return [2 /*return*/, visitor[0]];
                        else
                            return [2 /*return*/, undefined];
                        return [3 /*break*/, 4];
                    case 3:
                        err_2 = _a.sent();
                        console.log(err_2);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SessionManager.GetSessionByEmailsFromDatabase = function (emails, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var users, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        users = [];
                        if (!(this.db && this.collection)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.collection.find({
                                email: { $in: emails },
                                nsp: nsp,
                                type: 'Agents'
                            }).toArray()];
                    case 1:
                        users = _a.sent();
                        _a.label = 2;
                    case 2:
                        if (users.length)
                            return [2 /*return*/, users];
                        else
                            return [2 /*return*/, undefined];
                        return [3 /*break*/, 4];
                    case 3:
                        err_3 = _a.sent();
                        console.log(err_3);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SessionManager.GetAllSessionByEmailFromDatabase = function (email, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var visitors, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        visitors = [];
                        if (!(this.db && this.collection)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.collection.find({
                                email: email,
                                nsp: nsp
                            }).toArray()];
                    case 1:
                        visitors = _a.sent();
                        _a.label = 2;
                    case 2:
                        if (visitors.length)
                            return [2 /*return*/, visitors];
                        else
                            return [2 /*return*/, undefined];
                        return [3 /*break*/, 4];
                    case 3:
                        err_4 = _a.sent();
                        console.log(err_4);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SessionManager.GetIDsOfBotAuthorizedAgents = function (nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var agents, arr, err_5;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        agents = [];
                        if (!(this.db && this.collection)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.collection.find((_a = {
                                    nsp: nsp,
                                    type: 'Agents'
                                },
                                _a['permissions.agents.canAccessBotChats'] = true,
                                _a), {
                                fields: {
                                    _id: 1
                                }
                            }).toArray()];
                    case 1:
                        agents = _b.sent();
                        _b.label = 2;
                    case 2:
                        if (agents.length) {
                            arr = agents.reduce(function (obj, item) {
                                obj[item._id] = item;
                                return obj;
                            }, {});
                            return [2 /*return*/, Object.keys(arr)];
                        }
                        else
                            return [2 /*return*/, undefined];
                        return [3 /*break*/, 4];
                    case 3:
                        err_5 = _b.sent();
                        console.log(err_5);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    //#endregion
    SessionManager.getVisitorByLocation = function (nsp, location, sessionID) {
        return __awaiter(this, void 0, void 0, function () {
            var visitor, error_52;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        visitor = [];
                        if (!(this.db && this.collection)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.collection.find({
                                nsp: nsp,
                                location: location,
                                _id: new mongodb_1.ObjectID(sessionID)
                            }).limit(1).toArray()];
                    case 1:
                        visitor = _a.sent();
                        _a.label = 2;
                    case 2:
                        if (visitor.length)
                            return [2 /*return*/, visitor[0]];
                        else
                            undefined;
                        return [3 /*break*/, 4];
                    case 3:
                        error_52 = _a.sent();
                        console.log('Error in Get Visitors By Location');
                        console.log(error_52);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    //#endregion
    //#region
    SessionManager.getOnlineWatchers = function (nsp, data) {
        return __awaiter(this, void 0, void 0, function () {
            var error_53;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!(this.db && this.collection)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.collection.find({
                                nsp: nsp,
                                type: 'Agents',
                                email: {
                                    $in: data
                                }
                            }).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [2 /*return*/, undefined];
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        error_53 = _a.sent();
                        console.log(error_53);
                        console.log('Error in Getting online watchers');
                        return [2 /*return*/, undefined];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    SessionManager.sessionQueue = {};
    SessionManager.sessionList = {};
    return SessionManager;
}());
exports.SessionManager = SessionManager;
//# sourceMappingURL=sessionsManager.js.map