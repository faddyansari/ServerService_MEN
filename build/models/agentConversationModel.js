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
exports.AgentConversations = void 0;
var mongodb_1 = require("mongodb");
var bson_1 = require("bson");
var constants_1 = require("../globals/config/constants");
var AgentConversationStatus_1 = require("./AgentConversationStatus");
var AgentsDB_1 = require("../globals/config/databses/AgentsDB");
var AgentConversations = /** @class */ (function () {
    function AgentConversations() {
    }
    AgentConversations.Initialize = function () {
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
                        return [4 /*yield*/, this.db.createCollection('agentConversations')];
                    case 2:
                        _b.collection = _c.sent();
                        AgentConversations.initialized = true;
                        console.log(this.collection.collectionName);
                        return [2 /*return*/, AgentConversations.initialized];
                    case 3:
                        error_1 = _c.sent();
                        console.log('error in Initializing Agent Conversations Model');
                        throw new Error(error_1);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    AgentConversations.createConversation = function (data, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.insertOne(JSON.parse(JSON.stringify(data)))];
                    case 1: 
                    // let conversation: AgentConversationSchema = {
                    //     to: data.toAgent,
                    //     from: data.fromAgent,
                    //     createdOn: new Date().toISOString(),
                    //     LastUpdated: new Date().toISOString(),
                    //     nsp: nsp,
                    //     messages: [],
                    //     LastSeen: [
                    //         { id: data.toAgent, messageReadCount: 0, DateTime: '' },
                    //         { id: data.fromAgent, messageReadCount: 0, DateTime: new Date().toISOString() }
                    //     ]
                    // };
                    //console.log(data);
                    return [2 /*return*/, _a.sent()];
                    case 2:
                        error_2 = _a.sent();
                        console.log('Error in Create Agent Conversation');
                        console.log(error_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AgentConversations.getMessagesByTime = function (cid, date) {
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
    AgentConversations.getMessagesByCid = function (cid) {
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
    AgentConversations.getConversation = function (members, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var conversation;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.collection.findOne({
                            nsp: nsp,
                            type: 'single',
                            $or: [
                                {
                                    'members.email': { $all: [members[0], members[1]] }
                                },
                                {
                                    'members.email': { $all: [members[1], members[0]] }
                                }
                            ]
                        })];
                    case 1:
                        conversation = _a.sent();
                        // console.log(conversation);
                        return [2 /*return*/, conversation];
                }
            });
        });
    };
    AgentConversations.getConversationByCid = function (cid) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.collection.find({ _id: new bson_1.ObjectId(cid) }).limit(1).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AgentConversations.getAllConversations = function (email, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var conversationIds, conversations;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        conversationIds = [];
                        return [4 /*yield*/, AgentConversationStatus_1.AgentConversationStatus.getConversationIDs(email)];
                    case 1:
                        conversationIds = _a.sent();
                        return [4 /*yield*/, this.collection.find({ nsp: nsp, _id: { $in: conversationIds } }).toArray()];
                    case 2:
                        conversations = _a.sent();
                        return [4 /*yield*/, this.collection.aggregate([
                                {
                                    '$match': {
                                        nsp: nsp,
                                        _id: { $in: conversationIds }
                                    }
                                },
                                {
                                    '$sort': {
                                        LastUpdated: -1
                                    }
                                }
                            ])];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, conversations];
                }
            });
        });
    };
    AgentConversations.updateMessageReadCount = function (cid, userId, seen) {
        if (seen === void 0) { seen = false; }
        return __awaiter(this, void 0, void 0, function () {
            var error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ _id: new mongodb_1.ObjectID(cid), 'LastSeen.email': userId }, { $set: { 'LastSeen.$.messageReadCount': 0, 'LastSeen.$.DateTime': new Date().toISOString() } }, { returnOriginal: false, upsert: false })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_5 = _a.sent();
                        console.log('Error in Update Message By Count');
                        console.log(error_5);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AgentConversations.getMessages = function (cid) {
        return this.db.collection('messages').find({ cid: new bson_1.ObjectId(cid.toString()) }).toArray();
    };
    AgentConversations.getMessagesAsync = function (cid, visibleTo, chunk) {
        if (chunk === void 0) { chunk = '0'; }
        return __awaiter(this, void 0, void 0, function () {
            var error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        if (!(chunk == "0")) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.db.collection('messages').aggregate([
                                { "$match": { "cid": new mongodb_1.ObjectID(cid), visibleTo: { "$in": [visibleTo] } } },
                                { "$sort": { "date": -1 } },
                                { "$limit": 20 },
                                { "$sort": { "date": 1 } }
                            ]).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [4 /*yield*/, this.db.collection('messages').aggregate([
                            { "$match": { "cid": new mongodb_1.ObjectID(cid), visibleTo: { "$in": [visibleTo] }, "_id": { "$lt": new mongodb_1.ObjectID(chunk) } } },
                            { "$sort": { "date": -1 } },
                            { "$limit": 20 }
                        ]).toArray()];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_6 = _a.sent();
                        console.log(error_6);
                        console.log('error in Get Archives');
                        return [2 /*return*/, []];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    AgentConversations.insertMessage = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.collection('messages').insertOne(message)];
                    case 1: 
                    // this.collection.findOneAndUpdate({ _id: new ObjectID(message.cid), 'LastSeen.email': {$in: message.to} }, { $inc: { 'LastSeen.$[].messageReadCount': 1 } }, { returnOriginal: false, upsert: false });
                    // this.collection.findOneAndUpdate({ _id: new ObjectID(message.cid), 'LastSeen.email': message.from }, { $set: {'LastSeen.$.DateTime' : new Date().toISOString(),'LastSeen.$.messageReadCount' : 0,'LastUpdated' : new Date().toISOString()} }, { returnOriginal: false, upsert: false });
                    return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AgentConversations.insertLastMessage = function (cid, lastMessage) {
        return __awaiter(this, void 0, void 0, function () {
            var conversation, activeParticipants;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.collection.find({ _id: new mongodb_1.ObjectID(lastMessage.cid) }).limit(1).toArray()];
                    case 1:
                        conversation = _a.sent();
                        return [4 /*yield*/, AgentConversationStatus_1.AgentConversationStatus.getActiveParticipants(lastMessage.cid)];
                    case 2:
                        activeParticipants = _a.sent();
                        if (conversation && conversation.length) {
                            conversation[0].messages = [
                                lastMessage
                            ];
                            conversation[0].LastSeen.forEach(function (element) {
                                if (element.email != lastMessage.from) {
                                    if (activeParticipants.includes(element.email)) {
                                        element.messageReadCount += 1;
                                    }
                                }
                                else {
                                    element.messageReadCount = 0;
                                    element.DateTime = new Date().toISOString();
                                }
                            });
                            conversation[0].LastUpdated = new Date().toISOString();
                        }
                        return [4 /*yield*/, this.collection.save(conversation[0])];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, conversation[0]];
                }
            });
        });
    };
    AgentConversations.getLastMessage = function (cid) {
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
    AgentConversations.AddMember = function (cid, email) {
        return __awaiter(this, void 0, void 0, function () {
            var randomColor, member, LastSeen, status, check, addNew, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        randomColor = constants_1.rand[Math.floor(Math.random() * constants_1.rand.length)];
                        member = {
                            email: email,
                            isAdmin: false,
                            viewColor: randomColor
                        };
                        LastSeen = {
                            email: email,
                            messageReadCount: 0,
                            DateTime: new Date().toISOString()
                        };
                        status = {
                            email: email,
                            added: false
                        };
                        return [4 /*yield*/, this.collection.find({ _id: new mongodb_1.ObjectID(cid), 'members.email': email }).limit(1).toArray()];
                    case 1:
                        check = _a.sent();
                        if (!(check && check.length)) return [3 /*break*/, 2];
                        status.added = false;
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.collection.findOneAndUpdate({ _id: new mongodb_1.ObjectID(cid) }, { $push: { members: member, LastSeen: LastSeen } }, { upsert: false, returnOriginal: false })];
                    case 3:
                        addNew = _a.sent();
                        if (addNew && addNew.value) {
                            status.added = true;
                        }
                        _a.label = 4;
                    case 4: return [2 /*return*/, status];
                    case 5:
                        err_1 = _a.sent();
                        console.log(err_1);
                        console.log('Error in add member');
                        return [2 /*return*/, undefined];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    AgentConversations.RemoveMember = function (cid, email) {
        return __awaiter(this, void 0, void 0, function () {
            var err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        console.log(cid, email);
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ _id: new mongodb_1.ObjectID(cid) }, { $pull: { members: { email: email }, LastSeen: { email: email } } })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_2 = _a.sent();
                        console.log(err_2);
                        console.log('Error in remove member');
                        return [2 /*return*/, undefined];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AgentConversations.toggleAdmin = function (cid, email, value) {
        return __awaiter(this, void 0, void 0, function () {
            var err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        console.log(cid, email);
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ _id: new mongodb_1.ObjectID(cid), 'members.email': email }, { $set: { 'members.$.isAdmin': value } })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_3 = _a.sent();
                        console.log(err_3);
                        console.log('Error in remove member');
                        return [2 /*return*/, undefined];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AgentConversations.InsertEventMessage = function (cid, members, msg) {
        return __awaiter(this, void 0, void 0, function () {
            var message;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        message = {
                            _id: new mongodb_1.ObjectID(),
                            from: 'System',
                            to: members,
                            body: msg,
                            viewColor: '',
                            cid: new bson_1.ObjectId(cid),
                            date: new Date().toISOString(),
                            type: 'Event',
                            attachment: false,
                            visibleTo: members
                            // filename: (data.message.attachment) ? data.message.filename : undefined
                        };
                        return [4 /*yield*/, this.db.collection('messages').insertOne(message)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AgentConversations.initialized = true;
    return AgentConversations;
}());
exports.AgentConversations = AgentConversations;
//# sourceMappingURL=agentConversationModel.js.map