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
exports.ContactConversations = void 0;
var mongodb_1 = require("mongodb");
var bson_1 = require("bson");
var AgentsDB_1 = require("../globals/config/databses/AgentsDB");
var ContactConversations = /** @class */ (function () {
    function ContactConversations() {
    }
    ContactConversations.Initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, error_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 3, , 4]);
                        _a = this;
                        return [4 /*yield*/, AgentsDB_1.AgentsDB.connect()];
                    case 1:
                        _a.db = _c.sent();
                        _b = this;
                        return [4 /*yield*/, this.db.createCollection('contactConversations')];
                    case 2:
                        _b.collection = _c.sent();
                        ContactConversations.initialized = true;
                        console.log(this.collection.collectionName);
                        return [2 /*return*/, ContactConversations.initialized];
                    case 3:
                        error_1 = _c.sent();
                        console.log('error in Initializing Contact Conversations Model');
                        throw new Error(error_1);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ContactConversations.createConversation = function (data, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var conversation, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        conversation = {
                            to: data.toContact,
                            to_name: data.toName,
                            from: data.fromContact,
                            from_name: data.fromName,
                            createdOn: new Date().toISOString(),
                            LastUpdated: new Date().toISOString(),
                            nsp: nsp,
                            messages: [],
                            LastSeen: [
                                { id: data.toContact, messageReadCount: 0, DateTime: new Date().toISOString() },
                                { id: data.fromContact, messageReadCount: 0, DateTime: new Date().toISOString() }
                            ]
                        };
                        return [4 /*yield*/, this.collection.insertOne(JSON.parse(JSON.stringify(conversation)))];
                    case 1: 
                    // console.log(conversation);
                    return [2 /*return*/, _a.sent()];
                    case 2:
                        error_2 = _a.sent();
                        console.log('Error in Create Contact Conversation');
                        console.log(error_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ContactConversations.getMessagesByTime = function (cid, date) {
        return __awaiter(this, void 0, void 0, function () {
            var error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.db.collection('messages').find({ cid: new mongodb_1.ObjectID(cid), date: { $gt: new Date(date).toISOString() } }).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_3 = _a.sent();
                        console.log('Error in Get Messag By Time');
                        console.log(error_3);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ContactConversations.getMessagesByCid = function (cid) {
        return __awaiter(this, void 0, void 0, function () {
            var error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.db.collection('messages').find({ cid: new mongodb_1.ObjectID(cid) }).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_4 = _a.sent();
                        console.log('Error in Get Message By Cid');
                        console.log(error_4);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ContactConversations.getConversation = function (email1, email2, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var conversation, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.findOne({ nsp: nsp, $and: [{ $or: [{ to: email1 }, { from: email1 }] }, { $or: [{ to: email2 }, { from: email2 }] }] })];
                    case 1:
                        conversation = _a.sent();
                        // console.log(conversation);
                        return [2 /*return*/, conversation];
                    case 2:
                        error_5 = _a.sent();
                        console.log('Error in getConversation');
                        console.log(error_5);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ContactConversations.removeConversation = function (email1, email2, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.findOneAndDelete({ nsp: nsp, $and: [{ $or: [{ to: email1 }, { from: email1 }] }, { $or: [{ to: email2 }, { from: email2 }] }] })];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_6 = _a.sent();
                        console.log('Error in getConversation');
                        console.log(error_6);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ContactConversations.getThreadList = function (email, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var conversations, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.find({ nsp: nsp, $or: [{ to: email }, { from: email }] }).toArray()];
                    case 1:
                        conversations = _a.sent();
                        // console.log(conversation);
                        return [2 /*return*/, conversations];
                    case 2:
                        error_7 = _a.sent();
                        console.log('Error in getThreadList');
                        console.log(error_7);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ContactConversations.getConversationByCid = function (cid) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.collection.find({ _id: new bson_1.ObjectId(cid) }).limit(1).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ContactConversations.getAllConversations = function (nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var conversations;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.collection.find({ nsp: nsp }).toArray()];
                    case 1:
                        conversations = _a.sent();
                        return [2 /*return*/, conversations];
                }
            });
        });
    };
    ContactConversations.getAllConversationsByNsp = function (nsp, chunk) {
        if (chunk === void 0) { chunk = '0'; }
        return __awaiter(this, void 0, void 0, function () {
            var error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        if (!(chunk == "0")) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.collection.aggregate([
                                { "$match": { "nsp": nsp } },
                                { "$sort": { "LastUpdated": -1 } },
                                { "$limit": 20 },
                                { "$sort": { "LastUpdated": 1 } }
                            ]).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [4 /*yield*/, this.collection.aggregate([
                            { "$match": { "nsp": nsp, "_id": { "$lt": new mongodb_1.ObjectID(chunk) } } },
                            { "$sort": { "LastUpdated": -1 } },
                            { "$limit": 20 },
                            { "$sort": { "LastUpdated": 1 } }
                        ]).toArray()];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_8 = _a.sent();
                        console.log(error_8);
                        console.log('error in Get Conversations');
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    ContactConversations.updateMessageReadCount = function (cid, userId, seen) {
        if (seen === void 0) { seen = false; }
        return __awaiter(this, void 0, void 0, function () {
            var error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ _id: new mongodb_1.ObjectID(cid), 'LastSeen.id': userId }, { $set: { 'LastSeen.$.messageReadCount': 0, 'LastSeen.$.DateTime': new Date().toISOString() } }, { returnOriginal: false, upsert: false })];
                    case 1: 
                    // console.log('Conv details');
                    // console.log(cid, userId,seen);
                    return [2 /*return*/, _a.sent()];
                    case 2:
                        error_9 = _a.sent();
                        console.log('Error in Update Message By Count');
                        console.log(error_9);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ContactConversations.getMessages = function (cid) {
        return this.db.collection('messages').find({ cid: new bson_1.ObjectId(cid.toString()) }).toArray();
    };
    ContactConversations.getMessagesAsync = function (cid, chunk) {
        if (chunk === void 0) { chunk = '0'; }
        return __awaiter(this, void 0, void 0, function () {
            var error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        if (!(chunk == "0")) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.db.collection('messages').aggregate([
                                { "$match": { "cid": new mongodb_1.ObjectID(cid) } },
                                { "$sort": { "date": -1 } },
                                { "$limit": 20 },
                                { "$sort": { "date": 1 } }
                            ]).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [4 /*yield*/, this.db.collection('messages').aggregate([
                            { "$match": { "cid": new mongodb_1.ObjectID(cid), "_id": { "$lt": new mongodb_1.ObjectID(chunk) } } },
                            { "$sort": { "date": -1 } },
                            { "$limit": 20 }
                        ]).toArray()];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_10 = _a.sent();
                        console.log(error_10);
                        console.log('error in Get Messages');
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    ContactConversations.insertLastMessage = function (cid, lastMessage) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.collection.findOneAndUpdate({ _id: new mongodb_1.ObjectID(cid) }, { $set: { 'messages.0': lastMessage } }, { returnOriginal: false, upsert: false })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ContactConversations.getLastMessage = function (cid) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.collection('messages').aggregate([
                            { "$match": { "cid": new mongodb_1.ObjectID(cid) } },
                            { "$sort": { "date": -1 } },
                            { "$limit": 1 },
                            { "$sort": { "date": 1 } }
                        ]).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ContactConversations.insertMessage = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.collection.findOneAndUpdate({ _id: new mongodb_1.ObjectID(message.cid), 'LastSeen.id': message.to }, { $inc: { 'LastSeen.$.messageReadCount': 1 } }, { returnOriginal: false, upsert: false });
                        this.collection.findOneAndUpdate({ _id: new mongodb_1.ObjectID(message.cid), 'LastSeen.id': message.from }, { $set: { 'LastSeen.$.DateTime': new Date().toISOString(), 'LastSeen.$.messageReadCount': 0, 'LastUpdated': new Date().toISOString() } }, { returnOriginal: false, upsert: false });
                        return [4 /*yield*/, this.db.collection('messages').insertOne(message)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ContactConversations.initialized = true;
    return ContactConversations;
}());
exports.ContactConversations = ContactConversations;
//# sourceMappingURL=contactConversationModel.js.map