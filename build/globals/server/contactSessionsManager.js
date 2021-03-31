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
exports.ContactSessionManager = void 0;
var mongodb_1 = require("mongodb");
var AgentsDB_1 = require("../config/databses/AgentsDB");
//const session = require("express-session");
var ObjectId = require('mongodb').ObjectId;
var ContactSessionManager = /** @class */ (function () {
    function ContactSessionManager() {
    }
    ContactSessionManager.Initialize = function () {
        var _this = this;
        // Database Connection For Session Storage.
        AgentsDB_1.AgentsDB.connect()
            .then(function (db) {
            _this.db = db;
            console.log('Contact Session MAnager Initialized');
            _this.db.createCollection('contactSessions')
                .then(function (collection) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            console.log(collection.collectionName);
                            this.collection = collection;
                            return [4 /*yield*/, this.collection.updateMany({}, { $set: { callingState: { socketid: '', state: false, agent: '' } } })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
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
    ContactSessionManager.Destroy = function () {
        this.db = undefined;
        this.collection = undefined;
    };
    //#region contact Functions MongoDb
    ContactSessionManager.getContact = function (session, sessionID) {
        return __awaiter(this, void 0, void 0, function () {
            var contact, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.find({
                                _id: new ObjectId((sessionID) ? sessionID : (session.id || session._id))
                            }).limit(1).toArray()];
                    case 1:
                        contact = _a.sent();
                        if (contact.length)
                            return [2 /*return*/, contact[0]];
                        else
                            return [2 /*return*/, undefined];
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.log('Error in Get contacts Old');
                        console.log(error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ContactSessionManager.GetContactByID = function (sessionID) {
        return __awaiter(this, void 0, void 0, function () {
            var contact, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.find({
                                _id: new ObjectId(sessionID)
                            }).limit(1).toArray()];
                    case 1:
                        contact = _a.sent();
                        if (contact.length)
                            return [2 /*return*/, contact[0]];
                        else
                            return [2 /*return*/, undefined];
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        console.log('Error in Get contacts');
                        console.log(error_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ContactSessionManager.UpdateDeviceToken = function (sessionID, token) {
        return __awaiter(this, void 0, void 0, function () {
            var contact, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.findOneAndUpdate({
                                _id: new ObjectId(sessionID)
                            }, {
                                $set: { deviceID: token }
                            }, { returnOriginal: false, upsert: false })];
                    case 1:
                        contact = _a.sent();
                        if (contact && contact.value)
                            return [2 /*return*/, contact.value];
                        else
                            return [2 /*return*/, undefined];
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        console.log('Error in Get Device Token');
                        console.log(error_3);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    //#endregion
    //#region Generic SESSION FUNCTIONS Mongodb
    ContactSessionManager.insertSession = function (session) {
        return __awaiter(this, void 0, void 0, function () {
            var _id, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        _id = new mongodb_1.ObjectID();
                        session._id = _id;
                        session.id = _id;
                        return [4 /*yield*/, this.collection.insertOne(session)];
                    case 1: 
                    //session.creationDate = new Date(session.creationDate);
                    return [2 /*return*/, _a.sent()];
                    case 2:
                        error_4 = _a.sent();
                        console.log('Error in Inserting Session');
                        console.log(error_4);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ContactSessionManager.getSession = function (sessionID) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    if (!sessionID || sessionID == 'undefined' || sessionID == 'null')
                        return [2 /*return*/, undefined];
                    return [2 /*return*/, this.collection.findOneAndUpdate({
                            _id: new mongodb_1.ObjectID(sessionID)
                        }, {
                            $unset: { expiry: 1 },
                        }, { returnOriginal: false, upsert: false })];
                }
                catch (error) {
                    console.log('Error in Inserting Session');
                    console.log(error);
                }
                return [2 /*return*/];
            });
        });
    };
    ContactSessionManager.UpdateSession = function (sid, session) {
        return __awaiter(this, void 0, void 0, function () {
            var obj, updatedSession;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        obj = {};
                        Object.assign(obj, session);
                        // console.log("Update Session");
                        // console.log(session);
                        delete obj._id;
                        return [4 /*yield*/, this.collection.update({ _id: new ObjectId(sid) }, { $set: JSON.parse(JSON.stringify(obj)) }, {
                                upsert: false,
                                multi: false
                            })];
                    case 1:
                        updatedSession = _a.sent();
                        if (updatedSession && updatedSession.result)
                            return [2 /*return*/, updatedSession.result];
                        else
                            return [2 /*return*/, undefined];
                        return [2 /*return*/];
                }
            });
        });
    };
    ContactSessionManager.DeleteSession = function (sid) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.collection.findOneAndDelete({ _id: new ObjectId(sid) })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ContactSessionManager.RemoveContactSession = function (nsp, email) {
        return __awaiter(this, void 0, void 0, function () {
            var error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.findOneAndDelete({ nsp: nsp, email: email, type: 'Contact' })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_5 = _a.sent();
                        console.log('Error in Remove Contact Session');
                        console.log(error_5);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    //#endregion
    //#region NEW AGENT FUNCTIONS OPERATION ON DB
    ContactSessionManager.UpdateCallingState = function (email, obj) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.collection.findOneAndUpdate({ email: email }, {
                            $set: {
                                callingState: obj
                            }
                        }, { returnOriginal: false, upsert: false })];
                    case 1: 
                    //console.log('Sid');
                    //console.log(sid);
                    return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ContactSessionManager.UpdateCallingStateAgent = function (email, agent) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.collection.findOneAndUpdate({ email: email }, {
                            $set: {
                                'callingState.agent': agent
                            }
                        }, { returnOriginal: false, upsert: false })];
                    case 1: 
                    //console.log('Sid');
                    //console.log(sid);
                    return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ContactSessionManager.Exists_contact = function (email) {
        try {
            return this.collection.findOneAndUpdate({
                type: 'Contact',
                email: email
            }, {
                $set: { newUser: false }
            }, { returnOriginal: false, upsert: false });
        }
        catch (error) {
            console.log('Error in Session Exists');
            console.log(error);
            return undefined;
        }
    };
    //#region Contact Operations
    ContactSessionManager.GetSessionByEmailFromDatabase = function (email, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var contact, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.find({
                                email: email,
                                nsp: nsp,
                                type: 'Contact'
                            }).limit(1).toArray()];
                    case 1:
                        contact = _a.sent();
                        if (contact.length)
                            return [2 /*return*/, contact[0]];
                        else
                            return [2 /*return*/, undefined];
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _a.sent();
                        console.log(err_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ContactSessionManager.GetAllSessionByEmailFromDatabase = function (email, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var contacts, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.find({
                                email: email,
                                nsp: nsp
                            }).toArray()];
                    case 1:
                        contacts = _a.sent();
                        if (contacts.length)
                            return [2 /*return*/, contacts];
                        else
                            return [2 /*return*/, undefined];
                        return [3 /*break*/, 3];
                    case 2:
                        err_2 = _a.sent();
                        console.log(err_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return ContactSessionManager;
}());
exports.ContactSessionManager = ContactSessionManager;
//# sourceMappingURL=contactSessionsManager.js.map