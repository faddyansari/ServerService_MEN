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
// console.log('Timeout Worker Called at :', new Date());
require('source-map-support').install();
var REDIS = require("redis");
var mongodb_1 = require("mongodb");
var enums_1 = require("./config/enums");
var redis_pub_sub_1 = require("../redis/redis-pub-sub");
var constants_1 = require("./config/constants");
var aws_sqs_1 = require("../actions/aws/aws-sqs");
var ticketEnums_1 = require("./config/ticketEnums");
var VisitorTimeoutWorker = /** @class */ (function () {
    /**ICONN Collections */
    // private SalesPersonCollection!: Collection;
    // private DestinationCollection!: Collection;
    // private PortsCollection!: Collection;
    // private CustomerTypeCollection!: Collection;
    // private PhoneTypeCollection!: Collection;
    // private IconnSyncInfoCollection!: Collection;
    function VisitorTimeoutWorker() {
        /**
         * @Databases
         */
        this.sendNotification = false;
        this.databaseURI = 'mongodb://localhost:27017/';
        // console.log('INitialized WOrker');
    }
    //#region Initializers
    VisitorTimeoutWorker.prototype.ConnectDBS = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        console.log('Connecting DBS');
                        _a = this;
                        return [4 /*yield*/, mongodb_1.MongoClient.connect((process.env.NODE_ENV == 'production') ? (process.env.DB_ADDRESS) ? process.env.DB_ADDRESS : 'mongodb+srv://admin:mufak123.@acms-databases.d703n.mongodb.net/?retryWrites=true&w=majority' : this.databaseURI)];
                    case 1:
                        _a.sessionDB_ref = _g.sent();
                        this.sessionDB = this.sessionDB_ref.db((process.env.NODE_ENV == 'production') ? 'sessionsDB' : "local");
                        _b = this;
                        return [4 /*yield*/, mongodb_1.MongoClient.connect((process.env.NODE_ENV == 'production') ? (process.env.DB_ADDRESS) ? process.env.DB_ADDRESS : 'mongodb+srv://admin:mufak123.@acms-databases.d703n.mongodb.net/?retryWrites=true&w=majority' : this.databaseURI)];
                    case 2:
                        _b.chatsDB_ref = _g.sent();
                        this.chatsDB = this.chatsDB_ref.db((process.env.NODE_ENV == 'production') ? 'chatsDB' : "chatsDB");
                        _c = this;
                        return [4 /*yield*/, mongodb_1.MongoClient.connect((process.env.NODE_ENV == 'production') ? (process.env.DB_ADDRESS) ? process.env.DB_ADDRESS : 'mongodb+srv://admin:mufak123.@acms-databases.d703n.mongodb.net/?retryWrites=true&w=majority' : this.databaseURI)];
                    case 3:
                        _c.companiesDB_ref = _g.sent();
                        this.companiesDB = this.companiesDB_ref.db((process.env.NODE_ENV == 'production') ? 'companiesDB' : "companiesDB");
                        // console.log((process.env.NODE_ENV == 'production') ? (process.env.DB_ADDRESS) ? process.env.DB_ADDRESS : 'mongodb://52.35.253.158:27017/' : undefined);
                        _d = this;
                        return [4 /*yield*/, mongodb_1.MongoClient.connect((process.env.NODE_ENV == 'production') ? (process.env.DB_ADDRESS) ? process.env.DB_ADDRESS : 'mongodb://ticketsdb.beelinks.solutions:27017/' : this.databaseURI)];
                    case 4:
                        // console.log((process.env.NODE_ENV == 'production') ? (process.env.DB_ADDRESS) ? process.env.DB_ADDRESS : 'mongodb://52.35.253.158:27017/' : undefined);
                        _d.ticketsDB_ref = _g.sent();
                        this.ticketsDB = this.ticketsDB_ref.db((process.env.NODE_ENV == 'production') ? 'local' : "ticketsDB");
                        _e = this;
                        return [4 /*yield*/, mongodb_1.MongoClient.connect((process.env.NODE_ENV == 'production') ? (process.env.DB_ADDRESS) ? process.env.DB_ADDRESS : 'mongodb+srv://admin:mufak123.@acms-databases.d703n.mongodb.net/?retryWrites=true&w=majority' : this.databaseURI)];
                    case 5:
                        _e.agentsDB_ref = _g.sent();
                        this.agentsDB = this.ticketsDB_ref.db((process.env.NODE_ENV == 'production') ? 'agentsDB' : "agentsDB");
                        _f = this;
                        return [4 /*yield*/, mongodb_1.MongoClient.connect((process.env.NODE_ENV == 'production') ? (process.env.DB_ADDRESS) ? process.env.DB_ADDRESS : 'mongodb://reportdb.beelinks.solutions:27017/' : this.databaseURI)];
                    case 6:
                        _f.ArchivingDB_ref = _g.sent();
                        this.ArchivingDB = this.ArchivingDB_ref.db((process.env.NODE_ENV == 'production') ? 'local' : "archivingDB");
                        return [2 /*return*/];
                }
            });
        });
    };
    VisitorTimeoutWorker.prototype.GetCollections = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
            return __generator(this, function (_q) {
                switch (_q.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.sessionDB.createCollection('sessions')];
                    case 1:
                        _a.sessionsCollection = _q.sent();
                        // this.testCollection = await this.sessionDB.createCollection('asyncTest');
                        // console.log(this.sessionsCollection.collectionName);
                        // console.log(this.testCollection.collectionName);
                        _b = this;
                        return [4 /*yield*/, this.chatsDB.createCollection('conversations')];
                    case 2:
                        // this.testCollection = await this.sessionDB.createCollection('asyncTest');
                        // console.log(this.sessionsCollection.collectionName);
                        // console.log(this.testCollection.collectionName);
                        _b.chatsCollection = _q.sent();
                        _c = this;
                        return [4 /*yield*/, this.chatsDB.createCollection('messages')];
                    case 3:
                        _c.messagesCollection = _q.sent();
                        _d = this;
                        return [4 /*yield*/, this.ticketsDB.createCollection('tickets')];
                    case 4:
                        _d.ticketsCollection = _q.sent();
                        _e = this;
                        return [4 /*yield*/, this.ticketsDB.createCollection('ticketgroups')];
                    case 5:
                        _e.ticketsGroupCollection = _q.sent();
                        _f = this;
                        return [4 /*yield*/, this.ticketsDB.createCollection('ticketMessages')];
                    case 6:
                        _f.collectionTicketMessages = _q.sent();
                        _g = this;
                        return [4 /*yield*/, this.ticketsDB.createCollection('teams')];
                    case 7:
                        _g.teamCollection = _q.sent();
                        _h = this;
                        return [4 /*yield*/, this.agentsDB.createCollection('agents')];
                    case 8:
                        _h.agentsCollection = _q.sent();
                        _j = this;
                        return [4 /*yield*/, this.companiesDB.createCollection('companies')];
                    case 9:
                        _j.companiesCollection = _q.sent();
                        _k = this;
                        return [4 /*yield*/, this.companiesDB.createCollection('tokens')];
                    case 10:
                        _k.tokensCollection = _q.sent();
                        _l = this;
                        return [4 /*yield*/, this.ArchivingDB.createCollection('visitorSessions')];
                    case 11:
                        _l.ArchivingVisitorsCollection = _q.sent();
                        _m = this;
                        return [4 /*yield*/, this.ArchivingDB.createCollection('agentSessions')];
                    case 12:
                        _m.ArchvingAgentCollection = _q.sent();
                        _o = this;
                        return [4 /*yield*/, this.ArchivingDB.createCollection('leftVisitors')];
                    case 13:
                        _o.LeftVisitorCollection = _q.sent();
                        _p = this;
                        return [4 /*yield*/, this.ArchivingDB.createCollection('visitors')];
                    case 14:
                        _p.VisitorCollection = _q.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    //#endregion
    //#region BroadCasting Functions
    VisitorTimeoutWorker.prototype.NotifyAllAgents = function () {
        return 'Agents';
    };
    VisitorTimeoutWorker.prototype.NotifySingleAgent = function (session) {
        try {
            switch (session.type) {
                case 'Visitors':
                    return session.agent.id;
                case 'Agents':
                    return session.id || session._id;
                default:
                    return '';
            }
        }
        catch (error) {
            console.log('Error in Notifying Single Visitor');
            console.log(error);
            return '';
        }
    };
    VisitorTimeoutWorker.prototype.NotifyVisitorSingle = function (session) {
        try {
            switch (session.type) {
                case 'Visitors':
                    return session._id || session.id;
                default:
                    return '';
            }
        }
        catch (error) {
            console.log('Error in Notify One Visitors Worker');
            // console.log;
            return '';
        }
    };
    VisitorTimeoutWorker.prototype.NotifyAllVisitors = function () {
        return 'Visitors';
    };
    //#endregion
    //#region Conversation Functions
    VisitorTimeoutWorker.prototype.MakeInactive = function (cid) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    return [2 /*return*/, this.chatsCollection.findOneAndUpdate({ _id: new mongodb_1.ObjectID(cid) }, { $set: { inactive: true } }, { returnOriginal: false, upsert: false })];
                }
                catch (error) {
                    console.log('error in Making Conversation Inactive');
                    console.log(error);
                }
                return [2 /*return*/];
            });
        });
    };
    // public async UpdateConversation(conversationID, agentEmail: string, state: number = 2) {
    //     // console.log('UpdateConverSationEmail');
    //     // console.log(agentEmail);
    //     // console.log(conversationID);
    //     let cid: any;
    //     try {
    //         let promises = await Promise.all([
    //             this.chatsCollection.update(
    //                 { _id: new ObjectID(conversationID), ['assigned_to.email']: { $ne: agentEmail } },
    //                 { $push: { assigned_to: { email: agentEmail, assignedDate: new Date(), firstResponseTime: '', avgResponseTime: '' } } },
    //                 { upsert: false }),
    //             this.chatsCollection.findOneAndUpdate(
    //                 { _id: new ObjectID(conversationID) },
    //                 {
    //                     $set: {
    //                         agentEmail: agentEmail, state: state, lastPickedTime: new Date().toISOString()
    //                     }
    //                 },
    //                 { returnOriginal: false, upsert: false })
    //         ])
    //         let result = await promises[1];
    //         return result;
    //     } catch (error) {
    //         console.log('Error in Create Conversation');
    //         console.log(error);
    //     }
    // }
    VisitorTimeoutWorker.prototype.getInactiveChat = function (cid, timeInMinutes, checkCreatedOn) {
        return __awaiter(this, void 0, void 0, function () {
            var date, error_1;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 7, , 8]);
                        date = new Date();
                        date.setMinutes(date.getMinutes() - timeInMinutes);
                        if (!(this.chatsDB && this.chatsCollection)) return [3 /*break*/, 5];
                        if (!!checkCreatedOn) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.chatsCollection.find({
                                _id: new mongodb_1.ObjectID(cid),
                                $and: [
                                    (_a = {
                                            lastMessage: { $exists: true }
                                        },
                                        _a['lastMessage.date'] = { $lte: date.toISOString() },
                                        _a.inactive = false,
                                        _a)
                                ]
                            }).limit(1).toArray()];
                    case 1: return [2 /*return*/, _c.sent()];
                    case 2: return [4 /*yield*/, this.chatsCollection.find({
                            _id: new mongodb_1.ObjectID(cid),
                            $or: [
                                { $and: [(_b = { lastMessage: { $exists: true } }, _b['lastMessage.date'] = { $lte: date.toISOString() }, _b.inactive = false, _b)] },
                                { createdOn: { $lte: date.toISOString() }, inactive: false }
                            ]
                        }).limit(1).toArray()];
                    case 3: return [2 /*return*/, _c.sent()];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        console.log('CHATS DB NOT WORKING IN WORKER');
                        _c.label = 6;
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        error_1 = _c.sent();
                        console.log(error_1);
                        console.log('Error in Updating Conversation');
                        return [2 /*return*/, []];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    VisitorTimeoutWorker.prototype.insertMessage = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var message;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        message = {
                            from: data.from,
                            to: data.to,
                            body: data.body,
                            cid: new mongodb_1.ObjectId(data.cid),
                            date: data.date,
                            type: data.type,
                            attachment: (data.attachment) ? true : false,
                            filename: (data.attachment) ? data.filename : undefined,
                            form: data.form ? data.form : [],
                            delivered: (data.delivered) ? true : false,
                            sent: (data.sent) ? true : false,
                            chatFormData: data.chatFormData ? data.chatFormData : ''
                        };
                        return [4 /*yield*/, this.messagesCollection.insertOne(message)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
    *
    * @param cid
    * @param message
    * @param options : { insertMessageID : boolean, email : string , MessageId : string | ObjectId }
    */
    VisitorTimeoutWorker.prototype.UpdateLastMessage = function (cid, message, options) {
        return __awaiter(this, void 0, void 0, function () {
            var inserMessageID, error_2;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 5, , 6]);
                        inserMessageID = (options && options.insertMessageID && options.email && options.MessageId) ? true : false;
                        if (!inserMessageID) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.chatsCollection.findOneAndUpdate((_a = {
                                    _id: new mongodb_1.ObjectID(cid)
                                },
                                _a['assigned_to.email'] = options.email,
                                _a), {
                                $set: { lastMessage: message, entertained: true },
                                $addToSet: (_b = {}, _b['assigned_to.$.messageIds'] = { id: new mongodb_1.ObjectID(options.MessageId), date: message.date }, _b)
                            }, { returnOriginal: false, upsert: false })];
                    case 1: return [2 /*return*/, _c.sent()];
                    case 2: return [4 /*yield*/, this.chatsCollection.findOneAndUpdate({
                            _id: new mongodb_1.ObjectID(cid),
                        }, {
                            $set: {
                                lastMessage: message, entertained: true
                            },
                        }, { returnOriginal: false, upsert: false })];
                    case 3: return [2 /*return*/, _c.sent()];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_2 = _c.sent();
                        console.log(error_2);
                        console.log('Error in Updating Last Message');
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    VisitorTimeoutWorker.prototype.updateMessageReadCount = function (cid, seen) {
        if (seen === void 0) { seen = false; }
        return __awaiter(this, void 0, void 0, function () {
            var error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        if (!!seen) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.chatsCollection.findOneAndUpdate({ _id: new mongodb_1.ObjectID(cid) }, { $inc: { messageReadCount: 1 } }, { returnOriginal: false, upsert: false })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [4 /*yield*/, this.chatsCollection.findOneAndUpdate({ _id: new mongodb_1.ObjectID(cid) }, { $set: { messageReadCount: 0 } }, { returnOriginal: false, upsert: false })];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_3 = _a.sent();
                        console.log('Error in Update Message By Count');
                        console.log(error_3);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    VisitorTimeoutWorker.prototype.getMessages1 = function (cid) {
        return __awaiter(this, void 0, void 0, function () {
            var error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.messagesCollection.find({ cid: new mongodb_1.ObjectId(cid.toString()) }).toArray()];
                    case 1: 
                    // console.log('getting messages');
                    // console.log(cid);
                    return [2 /*return*/, _a.sent()];
                    case 2:
                        error_4 = _a.sent();
                        console.log('Error in getting MEssages 1 ');
                        console.log(error_4);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    VisitorTimeoutWorker.prototype.CreateLogMessage = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var sender, date, insertedMessage, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        sender = undefined;
                        date = new Date();
                        insertedMessage = void 0;
                        date = new Date();
                        message.date = date.toISOString();
                        return [4 /*yield*/, this.insertMessage(message)];
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
                        return [4 /*yield*/, this.updateMessageReadCount(message.cid, true)];
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
                        error_5 = _a.sent();
                        console.log(error_5);
                        console.log('Error in Creating Message');
                        // console.log(session.state);
                        return [2 /*return*/, undefined];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    VisitorTimeoutWorker.prototype.UpdateConversation = function (cid, makeInactive, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    // console.log('Updating Conversation State : ', cid);
                    // console.log(makeInactive);
                    if (!makeInactive) {
                        data['inactive'] = false;
                        return [2 /*return*/, this.chatsCollection.findOneAndUpdate({ _id: new mongodb_1.ObjectID(cid) }, { $set: JSON.parse(JSON.stringify(data)) }, { returnOriginal: false, upsert: false })];
                    }
                    else {
                        data['inactive'] = true;
                        return [2 /*return*/, this.chatsCollection.findOneAndUpdate({ _id: new mongodb_1.ObjectID(cid) }, { $set: JSON.parse(JSON.stringify(data)) }, { returnOriginal: false, upsert: false })];
                    }
                }
                catch (error) {
                    console.log(error);
                    console.log('Error in Updating Conversation Generic in worker');
                }
                return [2 /*return*/];
            });
        });
    };
    VisitorTimeoutWorker.prototype.MakeConversationActive = function (cid) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    // console.log('Updating Conversation State : ', cid);
                    // console.log(makeInactive);
                    return [2 /*return*/, this.chatsCollection.findOneAndUpdate({ _id: new mongodb_1.ObjectID(cid) }, { $set: { inactive: false } }, { returnOriginal: false, upsert: false })];
                }
                catch (error) {
                    console.log(error);
                    console.log('Error in Updating Conversation Generic in worker');
                }
                return [2 /*return*/];
            });
        });
    };
    VisitorTimeoutWorker.prototype.UpdateConversationState = function (cid, state, makeInactive) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    // console.log('Updating Conversation State : ', cid);
                    // console.log(makeInactive);
                    if (!makeInactive) {
                        return [2 /*return*/, this.chatsCollection.findOneAndUpdate({ _id: new mongodb_1.ObjectID(cid) }, { $set: { state: state, inactive: false } }, { returnOriginal: false, upsert: false })];
                    }
                    else {
                        return [2 /*return*/, this.chatsCollection.findOneAndUpdate({ _id: new mongodb_1.ObjectID(cid) }, { $set: { state: state, inactive: true } }, { returnOriginal: false, upsert: false })];
                    }
                }
                catch (error) {
                    console.log(error);
                    console.log('Error in Updating Conversation');
                }
                return [2 /*return*/];
            });
        });
    };
    VisitorTimeoutWorker.prototype.GetChattingAgentsForInvite = function (session, exclude) {
        if (exclude === void 0) { exclude = []; }
        return __awaiter(this, void 0, void 0, function () {
            var agent, temp_1, obj, error_6;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        agent = [];
                        temp_1 = exclude.map(function (id) { return new mongodb_1.ObjectID(id); });
                        if (!(this.sessionDB && this.sessionsCollection)) return [3 /*break*/, 2];
                        obj = (_a = {
                                nsp: session.nsp,
                                type: 'Agents',
                                _id: { $nin: temp_1 }
                            },
                            _a['permissions.chats.canChat'] = true,
                            _a.isAdmin = { $exists: false },
                            _a.acceptingChats = true,
                            _a);
                        return [4 /*yield*/, this.sessionsCollection.find(obj).sort({ chatCount: 1, visitorCount: 1 }).limit(1).toArray()];
                    case 1:
                        // console.log('Search QUery : ', obj);
                        agent = _b.sent();
                        _b.label = 2;
                    case 2:
                        // console.log('Agent In Getting Chatting Agents for Invite : ', agent);
                        if (agent.length)
                            return [2 /*return*/, agent[0]];
                        else
                            return [2 /*return*/, undefined];
                        return [3 /*break*/, 4];
                    case 3:
                        error_6 = _b.sent();
                        console.log('Error in Get Agents');
                        console.log(error_6);
                        return [2 /*return*/, undefined];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    VisitorTimeoutWorker.prototype.SetState = function (sid, state, previousState) {
        return __awaiter(this, void 0, void 0, function () {
            var updatedVisitorSession, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.sessionsCollection.findOneAndUpdate({ _id: new mongodb_1.ObjectID(sid), state: 1 }, {
                                $set: { state: state, previousState: previousState }
                            }, { returnOriginal: false, upsert: false })];
                    case 1:
                        updatedVisitorSession = _a.sent();
                        // console.log('Set State : ', updatedVisitorSession.value);
                        if (updatedVisitorSession && updatedVisitorSession.value) {
                            if (updatedVisitorSession.value.previousState)
                                this.UpdateChatStateHistory(updatedVisitorSession.value);
                            return [2 /*return*/, updatedVisitorSession.value];
                        }
                        else
                            return [2 /*return*/, undefined];
                        return [3 /*break*/, 3];
                    case 2:
                        error_7 = _a.sent();
                        console.log('error in Setting State Worker');
                        console.log(error_7);
                        return [2 /*return*/, undefined];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    VisitorTimeoutWorker.prototype.getConversationClientID = function (str, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var allConversationHashes, obj, duplicate, randomString, charSet, i, randomPoz;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.chatsCollection.find({ nsp: nsp, clientID: { $exists: true } }, { fields: { clientID: 1 } }).toArray()];
                    case 1:
                        allConversationHashes = _a.sent();
                        obj = {};
                        if (allConversationHashes && allConversationHashes.length)
                            allConversationHashes.map(function (hash) {
                                obj[hash.clientID] = true;
                            });
                        duplicate = false;
                        randomString = '';
                        do {
                            charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                            for (i = 0; i < 10; i++) {
                                randomPoz = Math.floor(Math.random() * charSet.length);
                                randomString += charSet.substring(randomPoz, randomPoz + 1);
                            }
                            if (obj && obj[randomString])
                                duplicate = true;
                        } while (duplicate);
                        return [2 /*return*/, randomString];
                }
            });
        });
    };
    VisitorTimeoutWorker.prototype.createConversation = function (conversationID, visitorEmail, sessionid, nsp, visitorColor, agentEmail, visitorName, state, deviceID, greetingMessage) {
        if (state === void 0) { state = 1; }
        return __awaiter(this, void 0, void 0, function () {
            var conversation, clientID, updatedConversation, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, this.chatsCollection.insertOne({
                                _id: conversationID,
                                deviceID: deviceID,
                                visitorEmail: visitorEmail,
                                visitorName: visitorName,
                                nsp: nsp,
                                agentEmail: (agentEmail) ? agentEmail : '',
                                // agentName: (agent && agent.length) ? (agent[0].nickname || agent[0].username) : '',
                                sessionid: sessionid,
                                createdOn: new Date().toISOString(),
                                state: state,
                                messages: [],
                                lastMessage: (greetingMessage) ? greetingMessage : '',
                                status: 'ACTIVE',
                                messageReadCount: 0,
                                viewColor: visitorColor,
                                entertained: false,
                                assigned_to: (agentEmail) ? [{ email: agentEmail, assignedDate: new Date(), firstResponseTime: '', avgResponseTime: '' }] : [],
                                superviserAgents: [],
                                inactive: false
                            })];
                    case 1:
                        conversation = _a.sent();
                        if (!(conversation && conversation.insertedCount > 0)) return [3 /*break*/, 5];
                        clientID = void 0;
                        if (!conversation.insertedId) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.getConversationClientID(conversation.ops[0]._id.toHexString(), conversation.ops[0]._id.nsp)];
                    case 2:
                        clientID = _a.sent();
                        if (!clientID) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.SetConversationClientID(conversation.ops[0]._id, nsp, clientID.toString())];
                    case 3:
                        updatedConversation = _a.sent();
                        if (updatedConversation && updatedConversation.value) {
                            conversation.ops[0].clientID = updatedConversation.value.clientID;
                        }
                        _a.label = 4;
                    case 4:
                        aws_sqs_1.__biZZC_SQS.SendMessage({ action: 'startConversation', conversation: conversation.ops[0] }, constants_1.ARCHIVINGQUEUE);
                        return [2 /*return*/, conversation];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_8 = _a.sent();
                        console.log('Error in Create Conversation');
                        console.log(error_8);
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    VisitorTimeoutWorker.prototype.SetConversationClientID = function (cid, nsp, clientID) {
        return __awaiter(this, void 0, void 0, function () {
            var error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.chatsCollection.findOneAndUpdate({ _id: new mongodb_1.ObjectId(cid), nsp: nsp }, { $set: { clientID: clientID } }, { returnOriginal: false, upsert: false })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_9 = _a.sent();
                        console.log('Error in getting particular ticket');
                        console.log(error_9);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    VisitorTimeoutWorker.prototype.TransferChat = function (cid, agentEmail, lastPickedTime, makeInactive) {
        return __awaiter(this, void 0, void 0, function () {
            var msgReadCount, promises, _a, _b, _c, result, error_10;
            var _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, this.messagesCollection.count({ cid: new mongodb_1.ObjectId(cid.toString()) })];
                    case 1:
                        msgReadCount = _e.sent();
                        _b = (_a = Promise).all;
                        return [4 /*yield*/, this.chatsCollection.update((_d = { _id: new mongodb_1.ObjectID(cid) }, _d['assigned_to.email'] = { $ne: agentEmail }, _d), { $push: { assigned_to: { email: agentEmail, assignedDate: new Date(), firstResponseTime: '', avgResponseTime: '' } } }, { upsert: false })];
                    case 2:
                        _c = [
                            _e.sent()
                        ];
                        return [4 /*yield*/, this.chatsCollection.findOneAndUpdate({ _id: new mongodb_1.ObjectID(cid) }, {
                                $set: {
                                    agentEmail: agentEmail,
                                    messageReadCount: msgReadCount,
                                    state: 2,
                                    lastPickedTime: (lastPickedTime) ? lastPickedTime : new Date().toISOString(),
                                    inactive: (makeInactive) ? true : false
                                }
                            }, { returnOriginal: false, upsert: false })];
                    case 3: return [4 /*yield*/, _b.apply(_a, [_c.concat([
                                _e.sent()
                            ])])];
                    case 4:
                        promises = _e.sent();
                        result = promises[1];
                        return [2 /*return*/, result];
                    case 5:
                        error_10 = _e.sent();
                        console.log(error_10);
                        console.log('Error in Transfer Chat');
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    VisitorTimeoutWorker.prototype.GetSessionForChat = function (_id) {
        return __awaiter(this, void 0, void 0, function () {
            var session, error_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!this.sessionsCollection) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.sessionsCollection.find({
                                _id: new mongodb_1.ObjectId(_id)
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
                        error_11 = _a.sent();
                        console.log('Error in Getting All Live Agents');
                        console.log(error_11);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    VisitorTimeoutWorker.prototype.GetConversationById = function (cid) {
        return __awaiter(this, void 0, void 0, function () {
            var error_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.chatsCollection.find({ _id: new mongodb_1.ObjectId(cid) }).limit(1).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_12 = _a.sent();
                        console.log(error_12);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    //#endregion
    //#region Companies Functions
    VisitorTimeoutWorker.prototype.GetCompanies = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    return [2 /*return*/, this.companiesCollection.find({}).toArray()];
                }
                catch (error) {
                    console.log('error in Getting Companies From Worker');
                }
                return [2 /*return*/];
            });
        });
    };
    VisitorTimeoutWorker.prototype.getSettings = function (nsp) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.companiesCollection.find({ name: nsp }, {
                        fields: {
                            _id: 0,
                            'settings.chatSettings': 1,
                        }
                    })
                        .limit(1).toArray()];
            });
        });
    };
    VisitorTimeoutWorker.prototype.DeleteExpiredTokens = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    return [2 /*return*/, this.tokensCollection.deleteMany({ expireDate: { $lte: new Date().toISOString() } })];
                }
                catch (error) {
                    console.log(error);
                    console.log('error in Validate Token');
                    return [2 /*return*/, undefined];
                }
                return [2 /*return*/];
            });
        });
    };
    //#endregion
    //#region Session Collection Functions
    VisitorTimeoutWorker.prototype.FixAgentsCount = function (type) {
        if (type === void 0) { type = 'Agents'; }
        return __awaiter(this, void 0, void 0, function () {
            var error_13;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.sessionsCollection.find({ type: type, 'permissions.chats.canChat': true }).toArray()];
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
                                                    case 0: return [4 /*yield*/, this.sessionsCollection.find({ _id: new mongodb_1.ObjectId(key) }).limit(1).toArray()];
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
                                        this.sessionsCollection.save(session);
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        return [3 /*break*/, 3];
                    case 2:
                        error_13 = _a.sent();
                        console.log(error_13);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    VisitorTimeoutWorker.prototype.GetVisitorByID = function (sessionID) {
        return __awaiter(this, void 0, void 0, function () {
            var visitor, error_14;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!(this.sessionDB && this.sessionsCollection)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.sessionsCollection.find({
                                _id: new mongodb_1.ObjectId(sessionID)
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
                        error_14 = _a.sent();
                        console.log('Error in Get Visitors');
                        console.log(error_14);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    VisitorTimeoutWorker.prototype.GetAgentByID = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var agent, error_15;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        agent = [];
                        if (!(this.sessionDB && this.sessionsCollection)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.sessionsCollection.find({
                                _id: new mongodb_1.ObjectId(id)
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
                        error_15 = _a.sent();
                        console.log('Error in Get Agent By Id');
                        console.log(error_15);
                        return [2 /*return*/, undefined];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    VisitorTimeoutWorker.prototype.GetAgentByIDChatting = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var agent, error_16;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        agent = [];
                        if (!(this.sessionDB && this.sessionsCollection)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.sessionsCollection.find((_a = {
                                    _id: new mongodb_1.ObjectId(id),
                                    acceptingChats: true
                                },
                                _a['permissions.chats.canChat'] = true,
                                _a.isAdmin = { $exists: false },
                                _a["rooms." + id.toString()] = { $exists: false },
                                _a.$expr = { $lt: ['$chatCount', '$concurrentChatLimit'] },
                                _a)).limit(1).toArray()];
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
                        error_16 = _b.sent();
                        console.log('Error in Get Agent By Id');
                        console.log(error_16);
                        return [2 /*return*/, undefined];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    VisitorTimeoutWorker.prototype.TransferChatUnmodified = function (cid, agentEmail, lastPickedTime) {
        return __awaiter(this, void 0, void 0, function () {
            var msgReadCount, promises, result, error_17;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.messagesCollection.count({ cid: new mongodb_1.ObjectId(cid.toString()) })];
                    case 1:
                        msgReadCount = _b.sent();
                        return [4 /*yield*/, Promise.all([
                                this.messagesCollection.count({ cid: new mongodb_1.ObjectId(cid.toString()) }),
                                this.chatsCollection.update((_a = { _id: new mongodb_1.ObjectID(cid) }, _a['assigned_to.email'] = { $ne: agentEmail }, _a), { $push: { assigned_to: { email: agentEmail, assignedDate: new Date(), firstResponseTime: '', avgResponseTime: '' } } }, { upsert: false }),
                                this.chatsCollection.findOneAndUpdate({ _id: new mongodb_1.ObjectID(cid) }, {
                                    $set: {
                                        agentEmail: agentEmail,
                                        messageReadCount: msgReadCount,
                                        state: 2,
                                        lastPickedTime: (lastPickedTime) ? lastPickedTime : new Date().toISOString(),
                                        inactive: false
                                    }
                                }, { returnOriginal: false, upsert: false })
                            ])];
                    case 2:
                        promises = _b.sent();
                        result = promises[2];
                        return [2 /*return*/, result];
                    case 3:
                        error_17 = _b.sent();
                        console.log(error_17);
                        console.log('Error in Transfer Chat');
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    VisitorTimeoutWorker.prototype.AssignQueuedVisitor = function (agentSession, sid, lastTouchedTime) {
        return __awaiter(this, void 0, void 0, function () {
            var updatedVisitorSession, updatedAgent, error_18;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 12, , 13]);
                        if (!(this.sessionDB && this.sessionsCollection)) return [3 /*break*/, 10];
                        return [4 /*yield*/, this.sessionsCollection.findOneAndUpdate({
                                _id: new mongodb_1.ObjectId(sid),
                                nsp: agentSession.nsp,
                                state: 2,
                                type: 'Visitors',
                                inactive: false,
                                //[`rooms.${(sid as any).toString()}`]: { $exists: true },
                                lastTouchedTime: new Date(lastTouchedTime).toISOString()
                            }, {
                                $set: {
                                    agent: {
                                        id: agentSession._id || agentSession.id,
                                        name: agentSession.nickname,
                                        image: (agentSession.image) ? agentSession.image : ''
                                    },
                                    state: 3,
                                    previousState: "2",
                                    lastTouchedTime: new Date().toISOString()
                                }
                            }, { returnOriginal: false, upsert: false })];
                    case 1:
                        updatedVisitorSession = _c.sent();
                        if (!(updatedVisitorSession && updatedVisitorSession.value)) return [3 /*break*/, 8];
                        if (!updatedVisitorSession.value.previousState) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.UpdateChatStateHistory(updatedVisitorSession.value)];
                    case 2:
                        _c.sent();
                        _c.label = 3;
                    case 3: return [4 /*yield*/, this.sessionsCollection.findOneAndUpdate({
                            _id: new mongodb_1.ObjectId(agentSession.id)
                        }, {
                            $set: (_a = {},
                                _a["rooms." + updatedVisitorSession.value._id.toString()] = (updatedVisitorSession.value.id || updatedVisitorSession.value._id).toString(),
                                _a),
                            $inc: {
                                chatCount: 1, visitorCount: 1
                            }
                        }, { returnOriginal: false, upsert: false })];
                    case 4:
                        updatedAgent = _c.sent();
                        if (!(updatedAgent && updatedAgent.value && updatedAgent.ok)) return [3 /*break*/, 5];
                        return [2 /*return*/, {
                                agent: updatedAgent.value,
                                visitor: updatedVisitorSession.value
                            }];
                    case 5: return [4 /*yield*/, this.sessionsCollection.findOneAndUpdate((_b = {
                                _id: new mongodb_1.ObjectId(sid)
                            },
                            _b['agent.id'] = agentSession._id.toString() || agentSession.id.toString(),
                            _b.state = 3,
                            _b), {
                            $set: {
                                agent: {
                                    id: '',
                                    name: '',
                                    image: ''
                                },
                                state: 2
                            }
                        }, { returnOriginal: false, upsert: false })];
                    case 6:
                        _c.sent();
                        return [2 /*return*/, undefined];
                    case 7: return [3 /*break*/, 9];
                    case 8: return [2 /*return*/, undefined];
                    case 9: return [3 /*break*/, 11];
                    case 10: return [2 /*return*/, undefined];
                    case 11: return [3 /*break*/, 13];
                    case 12:
                        error_18 = _c.sent();
                        console.log('Error in Assign Agent');
                        console.log(error_18);
                        return [2 /*return*/, undefined];
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    VisitorTimeoutWorker.prototype.AssignAgentByEmail = function (Visitorsession, email, conversationID, state) {
        return __awaiter(this, void 0, void 0, function () {
            var updatedAgent, updatedVisitorSession, error_19;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 10, , 11]);
                        if (!(this.sessionDB && this.sessionsCollection)) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.sessionsCollection.findOneAndUpdate((_a = {
                                    nsp: Visitorsession.nsp,
                                    acceptingChats: true,
                                    email: email
                                },
                                _a['permissions.chats.canChat'] = true,
                                _a.type = 'Agents',
                                _a["rooms." + Visitorsession._id.toString()] = { $exists: false },
                                _a.$expr = { $lt: ['$chatCount', '$concurrentChatLimit'] },
                                _a), {
                                $set: (_b = {},
                                    _b["rooms." + (Visitorsession.id || Visitorsession._id).toString()] = (Visitorsession.id || Visitorsession._id).toString(),
                                    _b),
                                $inc: {
                                    chatCount: 1, visitorCount: 1
                                }
                            }, { returnOriginal: false, upsert: false })];
                    case 1:
                        updatedAgent = _e.sent();
                        if (!(updatedAgent && updatedAgent.value && updatedAgent.ok)) return [3 /*break*/, 7];
                        Visitorsession.previousState = ((Visitorsession.inactive) ? '-' : '') + Visitorsession.state.toString();
                        return [4 /*yield*/, this.sessionsCollection.findOneAndUpdate({ _id: new mongodb_1.ObjectID(Visitorsession.id || Visitorsession._id) }, {
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
                    case 2:
                        updatedVisitorSession = _e.sent();
                        if (!(updatedVisitorSession && updatedVisitorSession.value)) return [3 /*break*/, 5];
                        if (!updatedVisitorSession.value.previousState) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.UpdateChatStateHistory(updatedVisitorSession.value)];
                    case 3:
                        _e.sent();
                        _e.label = 4;
                    case 4: return [2 /*return*/, {
                            agent: updatedAgent.value,
                            visitor: updatedVisitorSession.value
                        }];
                    case 5: return [4 /*yield*/, this.sessionsCollection.findOneAndUpdate((_c = {
                                _id: new mongodb_1.ObjectId(updatedAgent.value._id)
                            },
                            _c["rooms." + Visitorsession._id.toString()] = { $exists: true },
                            _c), {
                            $unset: (_d = {}, _d["rooms." + Visitorsession._id.toString()] = 1, _d),
                            $inc: { chatCount: -1 }
                        }, { returnOriginal: false, upsert: false })];
                    case 6:
                        _e.sent();
                        return [2 /*return*/, undefined];
                    case 7: return [2 /*return*/, undefined];
                    case 8: return [2 /*return*/, undefined];
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        error_19 = _e.sent();
                        console.log('Error in Assign Agent');
                        console.log(error_19);
                        return [2 /*return*/, undefined];
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    VisitorTimeoutWorker.prototype.AssignAgentByEmailCheckBrowsingState = function (Visitorsession, email, conversationID, state) {
        return __awaiter(this, void 0, void 0, function () {
            var updatedAgent, updatedVisitorSession, error_20;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 10, , 11]);
                        if (!(this.sessionDB && this.sessionsCollection)) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.sessionsCollection.findOneAndUpdate((_a = {
                                    nsp: Visitorsession.nsp,
                                    email: email
                                },
                                _a['permissions.chats.canChat'] = true,
                                _a.acceptingChats = true,
                                _a), {
                                $set: (_b = {},
                                    _b["rooms." + (Visitorsession.id || Visitorsession._id).toString()] = (Visitorsession.id || Visitorsession._id).toString(),
                                    _b),
                                $inc: {
                                    chatCount: 1, visitorCount: 1
                                }
                            }, { returnOriginal: false, upsert: false })];
                    case 1:
                        updatedAgent = _e.sent();
                        if (!(updatedAgent && updatedAgent.value && updatedAgent.ok)) return [3 /*break*/, 7];
                        Visitorsession.previousState = ((Visitorsession.inactive) ? '-' : '') + Visitorsession.state.toString();
                        return [4 /*yield*/, this.sessionsCollection.findOneAndUpdate({ _id: new mongodb_1.ObjectID(Visitorsession.id || Visitorsession._id), state: 1 }, {
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
                    case 2:
                        updatedVisitorSession = _e.sent();
                        if (!(updatedVisitorSession && updatedVisitorSession.value)) return [3 /*break*/, 5];
                        if (!updatedVisitorSession.value.previousState) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.UpdateChatStateHistory(updatedVisitorSession.value)];
                    case 3:
                        _e.sent();
                        _e.label = 4;
                    case 4: return [2 /*return*/, {
                            agent: updatedAgent.value,
                            visitor: updatedVisitorSession.value
                        }];
                    case 5: return [4 /*yield*/, this.sessionsCollection.findOneAndUpdate((_c = {
                                _id: new mongodb_1.ObjectId(updatedAgent.value._id)
                            },
                            _c["rooms." + Visitorsession._id.toString()] = { $exists: true },
                            _c), {
                            $unset: (_d = {}, _d["rooms." + Visitorsession._id.toString()] = 1, _d),
                            $inc: { chatCount: -1 }
                        }, { returnOriginal: false, upsert: false })];
                    case 6:
                        _e.sent();
                        return [2 /*return*/, undefined];
                    case 7: return [2 /*return*/, undefined];
                    case 8: return [2 /*return*/, undefined];
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        error_20 = _e.sent();
                        console.log('Error in Assign Agent By Browser State');
                        console.log(error_20);
                        return [2 /*return*/, undefined];
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    VisitorTimeoutWorker.prototype.GetChattingAgents = function (session, exclude) {
        if (exclude === void 0) { exclude = []; }
        return __awaiter(this, void 0, void 0, function () {
            var agent, temp_2, obj, search, error_21;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        agent = [];
                        temp_2 = exclude.map(function (id) { return new mongodb_1.ObjectID(id); });
                        if (!(this.sessionDB && this.sessionsCollection)) return [3 /*break*/, 2];
                        obj = [(_a = {
                                    nsp: session.nsp,
                                    type: 'Agents',
                                    acceptingChats: true,
                                    _id: { $nin: temp_2 }
                                },
                                _a['permissions.chats.canChat'] = true,
                                _a.isAdmin = { $exists: false },
                                _a.$expr = { $lt: ['$chatCount', '$concurrentChatLimit'] },
                                _a)];
                        search = {};
                        search.$and = obj;
                        return [4 /*yield*/, this.sessionsCollection.find(search).sort({ chatCount: 1, visitorCount: 1 }).limit(1).toArray()];
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
                        error_21 = _b.sent();
                        console.log('Error in Get Agents');
                        console.log(error_21);
                        return [2 /*return*/, undefined];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    VisitorTimeoutWorker.prototype.GetQueuedSession = function (nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var queuedSession, error_22;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!(this.sessionDB && this.sessionsCollection)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.sessionsCollection.find({
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
                        error_22 = _a.sent();
                        console.log(error_22);
                        console.log('Error in Getting Queued session');
                        return [2 /*return*/, undefined];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    VisitorTimeoutWorker.prototype.AutoAssignFromQueueAuto = function (session, agent) {
        if (agent === void 0) { agent = false; }
        return __awaiter(this, void 0, void 0, function () {
            var promises, Agent, QueuedSession, UpdatedSessions, Queuedconversation, logEvent, _a, promises_1, _b, _c, _d, error_23;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 16, , 17]);
                        return [4 /*yield*/, Promise.all([
                                this.GetChattingAgents(session),
                                this.GetQueuedSession(session.nsp),
                            ])];
                    case 1:
                        promises = _e.sent();
                        Agent = promises[0];
                        QueuedSession = promises[1];
                        if (!(Agent && Agent.chatCount < Agent.concurrentChatLimit && QueuedSession)) return [3 /*break*/, 14];
                        return [4 /*yield*/, this.AssignQueuedVisitor(Agent, QueuedSession._id, QueuedSession.lastTouchedTime)];
                    case 2:
                        UpdatedSessions = _e.sent();
                        QueuedSession = UpdatedSessions.visitor || undefined;
                        Agent = UpdatedSessions.agent || undefined;
                        if (!(QueuedSession && Agent)) return [3 /*break*/, 12];
                        return [4 /*yield*/, this.UpdateChatQueHistory(QueuedSession, 'System')];
                    case 3:
                        _e.sent();
                        return [4 /*yield*/, __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: session.nsp, roomName: [this.NotifyAllAgents()], data: { id: QueuedSession.id, session: QueuedSession } })];
                    case 4:
                        _e.sent();
                        return [4 /*yield*/, this.TransferChatUnmodified(QueuedSession.conversationID, Agent.email)];
                    case 5:
                        Queuedconversation = _e.sent();
                        if (!Queuedconversation) return [3 /*break*/, 11];
                        if (!Queuedconversation.value) return [3 /*break*/, 11];
                        return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendEventLog(enums_1.EventLogMessages.REQUEST_FROM_QUEUE, (QueuedSession._id) ? QueuedSession._id : QueuedSession.id)];
                    case 6:
                        logEvent = _e.sent();
                        // if (logEvent) SocketServer.of(session.nsp).to(Agents.NotifyAll()).emit('visitorEventLog', logEvent);
                        _a = Queuedconversation.value;
                        return [4 /*yield*/, this.getMessages1(QueuedSession.conversationID)];
                    case 7:
                        // if (logEvent) SocketServer.of(session.nsp).to(Agents.NotifyAll()).emit('visitorEventLog', logEvent);
                        _a.messages = _e.sent();
                        _c = (_b = Promise).all;
                        return [4 /*yield*/, __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'newConversation', nsp: session.nsp, roomName: [this.NotifySingleAgent(QueuedSession)], data: Queuedconversation.value })];
                    case 8:
                        _d = [
                            _e.sent()
                        ];
                        return [4 /*yield*/, __BIZZ_REST_REDIS_PUB.SendMessage({
                                action: 'emit', to: 'V', broadcast: true, eventName: 'gotAgent', nsp: session.nsp, roomName: [this.NotifyVisitorSingle(QueuedSession)], data: {
                                    agent: QueuedSession.agent,
                                    cid: QueuedSession.conversationID,
                                    state: QueuedSession.state,
                                    username: QueuedSession.username,
                                    email: QueuedSession.email
                                }
                            })];
                    case 9: return [4 /*yield*/, _c.apply(_b, [_d.concat([
                                _e.sent()
                            ])])];
                    case 10:
                        promises_1 = _e.sent();
                        return [2 /*return*/, true];
                    case 11: return [2 /*return*/, true];
                    case 12: return [2 /*return*/, true];
                    case 13: return [3 /*break*/, 15];
                    case 14: return [2 /*return*/, false];
                    case 15: return [3 /*break*/, 17];
                    case 16:
                        error_23 = _e.sent();
                        console.log(error_23);
                        console.log('error in Assigning From Queue');
                        return [2 /*return*/, false];
                    case 17: return [2 /*return*/];
                }
            });
        });
    };
    VisitorTimeoutWorker.prototype.GetAllQueuedVisitors = function (nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var QueuedSessions, error_24, error_25;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        QueuedSessions = [];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        if (!nsp)
                            return [2 /*return*/, []];
                        if (!(this.sessionDB && this.sessionsCollection)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.sessionsCollection.find({
                                $and: [
                                    { nsp: nsp },
                                    { state: 2 },
                                    { inactive: false }
                                ]
                            }).limit(100).sort({ lastTouchedTime: 1 }).toArray()];
                    case 2:
                        QueuedSessions = _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/, QueuedSessions];
                    case 4:
                        error_24 = _a.sent();
                        console.log(error_24);
                        console.log('error in GetAllInactiveNonChattingUsers');
                        return [2 /*return*/, QueuedSessions];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_25 = _a.sent();
                        console.log(error_25);
                        console.log('Error in All Queued');
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    VisitorTimeoutWorker.prototype.GetAllInactiveVisitors = function (nsp, inactivityTimeout, chattingVisitors) {
        return __awaiter(this, void 0, void 0, function () {
            var inactiveSessions, date, error_26;
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
                        if (!(this.sessionDB && this.sessionsCollection)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.sessionsCollection.find({
                                $and: [
                                    { nsp: nsp },
                                    { inactive: false },
                                    { state: { $in: (chattingVisitors) ? [3, 2] : [1, 4, 5, 8] } },
                                    { lastTouchedTime: { $lte: date.toISOString() } }
                                ]
                            }).limit(100).toArray()];
                    case 2:
                        inactiveSessions = _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/, inactiveSessions];
                    case 4:
                        error_26 = _a.sent();
                        console.log(error_26);
                        console.log('error in GetAllInactiveNonChattingUsers');
                        return [2 /*return*/, inactiveSessions];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    VisitorTimeoutWorker.prototype.GetALLExpiredSessions = function (nsp, type) {
        return __awaiter(this, void 0, void 0, function () {
            var expiredSessions, error_27;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 9, , 10]);
                        expiredSessions = [];
                        if (!(this.sessionDB && this.sessionsCollection)) return [3 /*break*/, 8];
                        if (!(!nsp && !type)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.sessionsCollection.find({
                                $and: (type == 'Agents') ?
                                    [{ expiry: { $exists: true } }, { expiry: { $lte: new Date().toISOString() } }] :
                                    [{ expiry: { $exists: true } }, { inactive: true }, { expiry: { $lte: new Date().toISOString() } }]
                            }).limit(100).toArray()];
                    case 1:
                        expiredSessions = _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!(!nsp && type)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.sessionsCollection.find({
                                $and: (type == 'Agents') ?
                                    [
                                        { nsp: nsp },
                                        { expiry: { $exists: true } }, { expiry: { $lte: new Date().toISOString() } }
                                    ] : [
                                    { nsp: nsp },
                                    { expiry: { $exists: true } }, { inactive: true }, { expiry: { $lte: new Date().toISOString() } }
                                ]
                            }).limit(100).toArray()];
                    case 3:
                        expiredSessions = _a.sent();
                        _a.label = 4;
                    case 4:
                        if (!(nsp && !type)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.sessionsCollection.find({
                                $and: (type == 'Agents') ?
                                    [
                                        { type: type },
                                        { expiry: { $exists: true } }, { expiry: { $lte: new Date().toISOString() } }
                                    ] : [
                                    { type: type },
                                    { expiry: { $exists: true } }, { inactive: true }, { expiry: { $lte: new Date().toISOString() } }
                                ]
                            }).limit(100).toArray()];
                    case 5:
                        expiredSessions = _a.sent();
                        _a.label = 6;
                    case 6:
                        if (!(nsp && type)) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.sessionsCollection.find({
                                $and: (type == 'Agents') ?
                                    [
                                        { nsp: nsp }, { type: type },
                                        { expiry: { $exists: true } }, { expiry: { $lte: new Date().toISOString() } }
                                    ] : [
                                    { nsp: nsp }, { type: type },
                                    { expiry: { $exists: true } }, { inactive: true }, { expiry: { $lte: new Date().toISOString() } }
                                ]
                            }).limit(100).toArray()];
                    case 7:
                        expiredSessions = _a.sent();
                        _a.label = 8;
                    case 8: return [2 /*return*/, expiredSessions];
                    case 9:
                        error_27 = _a.sent();
                        console.log(error_27);
                        console.log('Error In Getting Expired Sessions');
                        return [2 /*return*/, []];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    VisitorTimeoutWorker.prototype.GetAllActiveAgentsChatting = function (session, exclude) {
        if (exclude === void 0) { exclude = []; }
        return __awaiter(this, void 0, void 0, function () {
            var agent, temp_3, obj, search, error_28;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        agent = [];
                        temp_3 = exclude.map(function (id) { return new mongodb_1.ObjectID(id); });
                        if (!(this.sessionDB && this.sessionsCollection)) return [3 /*break*/, 2];
                        obj = [(_a = {
                                    nsp: session.nsp,
                                    acceptingChats: true,
                                    type: 'Agents',
                                    _id: { $nin: temp_3 }
                                },
                                _a['permissions.chats.canChat'] = true,
                                _a.isAdmin = { $exists: false },
                                _a.$expr = { $lt: ['$chatCount', '$concurrentChatLimit'] },
                                _a)];
                        search = {};
                        search.$and = obj;
                        return [4 /*yield*/, this.sessionsCollection.find(search).sort({ chatCount: 1, visitorCount: 1 }).limit(1).toArray()];
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
    /**
     *
     * @param _id : string
     * @param obj = Object<{ expiry : string , lasttouchedTime}>
     */
    VisitorTimeoutWorker.prototype.SetVisitorsInactvieNonChatting = function (_id, obj) {
        return __awaiter(this, void 0, void 0, function () {
            var inactivesession, error_29;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!(this.sessionDB && this.sessionsCollection)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.sessionsCollection.findOneAndUpdate({
                                $and: [{ _id: new mongodb_1.ObjectId(_id) }, { lastTouchedTime: obj.lastTouchedTime }]
                            }, { $set: { inactive: true, makeActive: false, expiry: obj.expiry } }, { returnOriginal: false, upsert: false })];
                    case 1:
                        inactivesession = _a.sent();
                        return [2 /*return*/, inactivesession];
                    case 2: return [2 /*return*/, undefined];
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        error_29 = _a.sent();
                        console.log(error_29);
                        console.log('error in GetAllInactiveNonChattingUsers');
                        return [2 /*return*/, undefined];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    VisitorTimeoutWorker.prototype.SetVisitorsInactvieChatting = function (_id, obj) {
        return __awaiter(this, void 0, void 0, function () {
            var inactivesession, error_30;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!(this.sessionDB && this.sessionsCollection)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.sessionsCollection.findOneAndUpdate({
                                $and: [{ _id: new mongodb_1.ObjectId(_id) }, { lastTouchedTime: obj.lastTouchedTime }]
                            }, { $set: { inactive: true, makeActive: false, expiry: obj.expiry } }, { returnOriginal: false, upsert: false })];
                    case 1:
                        inactivesession = _a.sent();
                        return [2 /*return*/, inactivesession];
                    case 2: return [2 /*return*/, undefined];
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        error_30 = _a.sent();
                        console.log(error_30);
                        console.log('error in GetAllInactiveNonChattingUsers');
                        return [2 /*return*/, undefined];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    VisitorTimeoutWorker.prototype.getAgentByEmail = function (nsp, data) {
        return __awaiter(this, void 0, void 0, function () {
            var agent, error_31;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        if (!(this.sessionDB && this.sessionsCollection)) return [3 /*break*/, 5];
                        agent = void 0;
                        if (!data.includes('@')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.sessionsCollection.find({
                                nsp: nsp,
                                email: data
                            }).limit(1).toArray()];
                    case 1:
                        agent = _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.sessionsCollection.find({
                            nsp: nsp,
                            _id: new mongodb_1.ObjectId(data)
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
                        error_31 = _a.sent();
                        console.log(error_31);
                        console.log('Error in Getting Agent From Email');
                        return [2 /*return*/, undefined];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    VisitorTimeoutWorker.prototype.UpdateViewState = function (tids, nsp, viewState, ticketlog) {
        return __awaiter(this, void 0, void 0, function () {
            var objectIdArray, temp_4, datetime_1, error_32;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 10, , 11]);
                        objectIdArray = tids.map(function (s) { return new mongodb_1.ObjectId(s); });
                        if (!(viewState == 'READ')) return [3 /*break*/, 4];
                        datetime_1 = new Date().toISOString();
                        return [4 /*yield*/, this.ticketsCollection.updateMany({ _id: { $in: objectIdArray }, nsp: nsp, first_read_date: { $exists: false } }, { $set: { first_read_date: datetime_1 } }, { upsert: false })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.ticketsCollection.updateMany({ _id: { $in: objectIdArray }, nsp: nsp }, { $set: { viewState: viewState, last_read_date: datetime_1 }, $push: { ticketlog: ticketlog } }, { upsert: false })];
                    case 2:
                        temp_4 = _a.sent();
                        return [4 /*yield*/, this.ticketsCollection.find({ _id: { $in: objectIdArray } }).forEach(function (x) {
                                if (x.assignmentList && x.assignmentList.length) {
                                    if (x.assignmentList.filter(function (a) { return a.assigned_to == ticketlog.updated_by; }).length) {
                                        x.assignmentList.filter(function (a) { return a.assigned_to == ticketlog.updated_by; }).sort(function (a, b) { return (Number(new Date(b.assigned_time)) - Number(new Date(a.assigned_time))); })[0].read_date = datetime_1;
                                    }
                                }
                                _this.ticketsCollection.save(x);
                            })];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, this.ticketsCollection.updateMany({ _id: { $in: objectIdArray }, nsp: nsp }, { $set: { viewState: viewState }, $push: { ticketlog: ticketlog } }, { upsert: false })];
                    case 5:
                        temp_4 = _a.sent();
                        _a.label = 6;
                    case 6:
                        if (!(temp_4 && temp_4.modifiedCount)) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.ticketsCollection.find({ _id: { $in: objectIdArray } }).toArray()];
                    case 7: return [2 /*return*/, _a.sent()];
                    case 8: return [2 /*return*/, []];
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        error_32 = _a.sent();
                        console.log('Error in Update View State');
                        console.log(error_32);
                        return [2 /*return*/, []];
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    VisitorTimeoutWorker.prototype.UnseAgentFromVisitor = function (sessionID) {
        return __awaiter(this, void 0, void 0, function () {
            var session, visitor, error_33;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 11, , 12]);
                        if (!(this.sessionDB && this.sessionsCollection)) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.GetVisitorByID(sessionID)];
                    case 1:
                        session = _a.sent();
                        if (!session) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.sessionsCollection.findOneAndUpdate({
                                _id: new mongodb_1.ObjectId(sessionID)
                            }, {
                                $set: {
                                    previousState: ((session.inactive) ? '-' : '') + session.state.toString(),
                                    state: 2,
                                    agent: { id: '', nickname: '', image: '' }
                                }
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
                        error_33 = _a.sent();
                        console.log('Error in Unsetting Agent From Visitor');
                        console.log(error_33);
                        return [3 /*break*/, 12];
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    VisitorTimeoutWorker.prototype.MarkReactivate = function (sessionID) {
        return __awaiter(this, void 0, void 0, function () {
            var visitor, error_34;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!(this.sessionDB && this.sessionsCollection)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.sessionsCollection.findOneAndUpdate({
                                _id: new mongodb_1.ObjectId(sessionID),
                                inactive: true
                            }, {
                                $set: { makeActive: false, inactive: false }
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
                        error_34 = _a.sent();
                        console.log('Error in Mark Re-activating Session in Worker');
                        console.log(error_34);
                        return [2 /*return*/, undefined];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    VisitorTimeoutWorker.prototype.AssignChatFromInactive = function (session, AgentEmail, state) {
        return __awaiter(this, void 0, void 0, function () {
            var convo, oldagent, UpdatedSessions, newAgent, visitor, conversation, _a, _b, _c, payload, event, loggedEvent, chatEvent, insertedMessage, visitor, conversation, error_35;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 27, , 28]);
                        return [4 /*yield*/, this.GetConversationById(session.conversationID)];
                    case 1:
                        convo = _d.sent();
                        if (!convo.length)
                            return [2 /*return*/, false];
                        oldagent = void 0;
                        return [4 /*yield*/, this.getAgentByEmail(session.nsp, convo[0].agentEmail)
                            // if (oldagent) console.log(oldagent);
                        ];
                    case 2:
                        oldagent = _d.sent();
                        UpdatedSessions = void 0;
                        if (!AgentEmail) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.AllocateAgentPriority(session, AgentEmail, session.conversationID, (state) ? state : undefined)];
                    case 3:
                        UpdatedSessions = _d.sent();
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, this.AllocateAgentWorker(session, new mongodb_1.ObjectID(session.conversationID), [], (state) ? state : undefined)];
                    case 5:
                        UpdatedSessions = _d.sent();
                        _d.label = 6;
                    case 6:
                        if (!(UpdatedSessions && UpdatedSessions.agent)) return [3 /*break*/, 24];
                        newAgent = UpdatedSessions.agent;
                        visitor = UpdatedSessions.visitor;
                        if (!(newAgent.email)) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.TransferChat(visitor.conversationID, newAgent.email, false, false)];
                    case 7:
                        _a = _d.sent();
                        return [3 /*break*/, 9];
                    case 8:
                        _a = undefined;
                        _d.label = 9;
                    case 9:
                        conversation = _a;
                        if (!(conversation && conversation.value)) return [3 /*break*/, 23];
                        if (!(conversation.value.messageReadCount)) return [3 /*break*/, 11];
                        _c = conversation.value;
                        return [4 /*yield*/, this.getMessages1(visitor.conversationID)];
                    case 10:
                        _b = _c.messages = _d.sent();
                        return [3 /*break*/, 12];
                    case 11:
                        _b = [];
                        _d.label = 12;
                    case 12:
                        _b;
                        payload = { id: visitor._id || visitor.id, session: visitor };
                        event = '';
                        if (newAgent.email != AgentEmail)
                            event = enums_1.ComposedENUM(enums_1.DynamicEventLogs.CHAT_AUTO_ASS_INACTIVE_DIFF_AGENT, { newEmail: newAgent.email, oldEmail: (AgentEmail) ? AgentEmail : '' });
                        else
                            event = enums_1.ComposedENUM(enums_1.DynamicEventLogs.CHAT_RE_ASSIGNED, { newEmail: newAgent.email, oldEmail: '' });
                        return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendEventLog(event, (visitor._id) ? visitor._id : visitor.id)];
                    case 13:
                        loggedEvent = _d.sent();
                        chatEvent = '';
                        (newAgent.email != AgentEmail) ? chatEvent = 'Chat auto Assigned to ' + (newAgent.username || newAgent.name || newAgent.nickname) : chatEvent = 'Chat Re-assigned to ' + (newAgent.username || newAgent.name || newAgent.nickname);
                        return [4 /*yield*/, this.CreateLogMessage({
                                from: visitor.agent.name,
                                to: (visitor.username) ? visitor.agent.name || visitor.agent.nickname : '',
                                body: chatEvent,
                                type: 'Events',
                                cid: (visitor.conversationID) ? visitor.conversationID : '',
                                attachment: false,
                                date: new Date().toISOString(),
                                delivered: true,
                                sent: true
                            })];
                    case 14:
                        insertedMessage = _d.sent();
                        if (insertedMessage)
                            conversation.value.messages.push(insertedMessage);
                        return [4 /*yield*/, __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: session.nsp, roomName: [this.NotifyAllAgents()], data: payload })];
                    case 15:
                        _d.sent();
                        if (!(oldagent && (oldagent.nickname != newAgent.nickname) && (oldagent.email != newAgent.email))) return [3 /*break*/, 19];
                        return [4 /*yield*/, __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'newConversation', nsp: visitor.nsp, roomName: [this.NotifySingleAgent(visitor)], data: conversation.value })];
                    case 16:
                        _d.sent();
                        if (!(conversation && conversation.value)) return [3 /*break*/, 18];
                        return [4 /*yield*/, __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'removeConversation', nsp: visitor.nsp, roomName: [this.NotifySingleAgent(session)], data: { conversation: conversation.value } })];
                    case 17:
                        _d.sent();
                        _d.label = 18;
                    case 18: return [3 /*break*/, 21];
                    case 19: return [4 /*yield*/, __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'makeConversationActive', nsp: visitor.nsp, roomName: [this.NotifySingleAgent(session)], data: { conversation: conversation.value } })];
                    case 20:
                        _d.sent();
                        _d.label = 21;
                    case 21: return [4 /*yield*/, __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'V', broadcast: false, eventName: 'transferChat', nsp: visitor.nsp, roomName: [this.NotifyVisitorSingle(visitor)], data: { agent: visitor.agent, event: chatEvent } })];
                    case 22:
                        _d.sent();
                        _d.label = 23;
                    case 23: return [2 /*return*/, true];
                    case 24:
                        if (!(UpdatedSessions && !UpdatedSessions.agent)) return [3 /*break*/, 26];
                        visitor = UpdatedSessions.visitor;
                        return [4 /*yield*/, this.UpdateConversationState(visitor.conversationID, 2, false)];
                    case 25:
                        conversation = _d.sent();
                        return [2 /*return*/, true];
                    case 26: return [2 /*return*/, false];
                    case 27:
                        error_35 = _d.sent();
                        console.log(error_35);
                        console.log('error in Assign Chat To Priority Abstraction');
                        return [3 /*break*/, 28];
                    case 28: return [2 /*return*/];
                }
            });
        });
    };
    VisitorTimeoutWorker.prototype.AssignChatToVisitorAuto = function (visitor, email) {
        return __awaiter(this, void 0, void 0, function () {
            var UpdatedSessions, newAgent, conversation, _a, _b, _c, payload, event, loggedEvent, chatEvent, insertedMessage, promises, _d, _e, _f, error_36;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        _g.trys.push([0, 16, , 17]);
                        return [4 /*yield*/, this.AllocateAgentWorker(visitor, new mongodb_1.ObjectID(visitor.conversationID))];
                    case 1:
                        UpdatedSessions = _g.sent();
                        newAgent = UpdatedSessions.agent;
                        visitor = UpdatedSessions.visitor;
                        if (!(UpdatedSessions && newAgent)) return [3 /*break*/, 15];
                        if (!(newAgent.email)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.TransferChat(visitor.conversationID, newAgent.email, false, false)];
                    case 2:
                        _a = _g.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        _a = undefined;
                        _g.label = 4;
                    case 4:
                        conversation = _a;
                        if (!(conversation && conversation.value)) return [3 /*break*/, 15];
                        if (!(conversation.value.messageReadCount)) return [3 /*break*/, 6];
                        _c = conversation.value;
                        return [4 /*yield*/, this.getMessages1(visitor.conversationID)];
                    case 5:
                        _b = _c.messages = _g.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        _b = [];
                        _g.label = 7;
                    case 7:
                        _b;
                        payload = { id: visitor._id || visitor.id, session: visitor };
                        event = enums_1.ComposedENUM(enums_1.DynamicEventLogs.CHAT_AUTO_ASSIGNED_TO, { newEmail: newAgent.email, oldEmail: '' });
                        return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendEventLog(event, (visitor._id) ? visitor._id : visitor.id)];
                    case 8:
                        loggedEvent = _g.sent();
                        // if (loggedEvent) SocketServer.of(visitor.nsp).to(Agents.NotifyAll()).emit('visitorEventLog', loggedEvent);
                        return [4 /*yield*/, this.UpdateChatQueHistory(visitor, 'System')];
                    case 9:
                        // if (loggedEvent) SocketServer.of(visitor.nsp).to(Agents.NotifyAll()).emit('visitorEventLog', loggedEvent);
                        _g.sent();
                        chatEvent = 'Chat auto Assigned to ' + (newAgent.username || newAgent.name || newAgent.nickname);
                        return [4 /*yield*/, this.CreateLogMessage({
                                from: visitor.agent.name,
                                to: (visitor.username) ? visitor.agent.name || visitor.agent.nickname : '',
                                body: chatEvent,
                                type: 'Events',
                                cid: (visitor.conversationID) ? visitor.conversationID : '',
                                attachment: false,
                                date: new Date().toISOString(),
                                delivered: true,
                                sent: true
                            })
                            // console.log('AssignChatToVisitorAuto');
                            //console.log(conversation);
                        ];
                    case 10:
                        insertedMessage = _g.sent();
                        _e = (_d = Promise).all;
                        return [4 /*yield*/, __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: visitor.nsp, roomName: [this.NotifyAllAgents()], data: payload })];
                    case 11:
                        _f = [
                            _g.sent()
                        ];
                        return [4 /*yield*/, __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'newConversation', nsp: visitor.nsp, roomName: [this.NotifySingleAgent(visitor)], data: conversation.value })];
                    case 12:
                        _f = _f.concat([
                            _g.sent()
                        ]);
                        return [4 /*yield*/, __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'V', broadcast: false, eventName: 'transferChat', nsp: visitor.nsp, roomName: [this.NotifyVisitorSingle(visitor)], data: { agent: visitor.agent, event: chatEvent } })];
                    case 13: return [4 /*yield*/, _e.apply(_d, [_f.concat([
                                _g.sent()
                            ])])];
                    case 14:
                        promises = _g.sent();
                        _g.label = 15;
                    case 15: return [2 /*return*/, true];
                    case 16:
                        error_36 = _g.sent();
                        console.log(error_36);
                        console.log('Error in AssignChatToVisitor Abstraction');
                        return [2 /*return*/, false];
                    case 17: return [2 /*return*/];
                }
            });
        });
    };
    VisitorTimeoutWorker.prototype.MakeActive = function (session, company) {
        return __awaiter(this, void 0, void 0, function () {
            var visitor, allAgents, origin, _a, mutex, mutex_1, pendingVisitor, queEvent, logEvent, promises, _b, _c, _d, updatedConversation, agent, assignedAgent, mutex_2, pendingVisitor, queEvent, logEvent, promises, _e, _f, _g, updatedConversation, mutex_3, pendingVisitor, queEvent, logEvent, promises, _h, _j, _k, updatedConversation, agent, assignedAgent, mutex_4, pendingVisitor, queEvent, logEvent, promises, _l, _m, _o, updatedConversation, error_37;
            return __generator(this, function (_p) {
                switch (_p.label) {
                    case 0:
                        _p.trys.push([0, 71, , 72]);
                        visitor = void 0;
                        allAgents = void 0;
                        if (!session) return [3 /*break*/, 70];
                        origin = company;
                        _a = session.state;
                        switch (_a) {
                            case 1: return [3 /*break*/, 1];
                            case 5: return [3 /*break*/, 1];
                            case 2: return [3 /*break*/, 5];
                            case 3: return [3 /*break*/, 11];
                            case 4: return [3 /*break*/, 41];
                        }
                        return [3 /*break*/, 69];
                    case 1: return [4 /*yield*/, __BIZZC_REDIS.GenerateSID(session.nsp, session._id.toString())];
                    case 2:
                        mutex = _p.sent();
                        if (!!mutex) return [3 /*break*/, 4];
                        return [4 /*yield*/, __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: session.nsp, roomName: [this.NotifyAllAgents()], data: { id: session._id.toString(), session: session } })];
                    case 3:
                        _p.sent();
                        _p.label = 4;
                    case 4: return [3 /*break*/, 70];
                    case 5: return [4 /*yield*/, this.GetAllActiveAgentsChatting(session)];
                    case 6:
                        /**
                         * @Procedure :
                         * 1. If Inactive then Change to Active
                         * 2. Check if Agent is Available.
                         * 3. If Agent is available then Connect to Agent
                         * 4. Else Do Nothing
                         */
                        allAgents = _p.sent();
                        if (!allAgents) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.AssignChatToVisitorAuto(session)];
                    case 7:
                        _p.sent();
                        return [3 /*break*/, 10];
                    case 8: return [4 /*yield*/, this.MakeConversationActive(session.conversationID)];
                    case 9:
                        _p.sent();
                        _p.label = 10;
                    case 10: 
                    //Else Send No Agent
                    return [3 /*break*/, 70];
                    case 11: return [4 /*yield*/, this.GetAllActiveAgentsChatting(session)];
                    case 12:
                        /**
                         * @Procedure :
                         * 1. If Inactive then Change to Active
                         * 2. Check if Old Agent is Available.
                         * 3. If Old Agent is available then Connect to Agent
                         * 4. Find Best Agent.
                         * 5. If Best Agent Found then Assign to it.
                         * 6. eles move to Unassigned Chat.
                         */
                        /**
                        * @Cases
                        * 1. If Visitor Previous he/she was talking to not available
                        * 2. If Priority Agent Is set && Available.
                        * 3. If Priority rule Matched Assign to Priority Agent
                        * 4. If No rule Mathed Then Assign to New Random Agent
                        * 5. If No Agent Found Then Move To unAssigned.
                        */
                        // console.log(session);
                        allAgents = _p.sent();
                        if (!!allAgents) return [3 /*break*/, 24];
                        return [4 /*yield*/, __BIZZC_REDIS.GenerateSID(session.nsp, session._id.toString())];
                    case 13:
                        mutex_1 = _p.sent();
                        if (!mutex_1) return [3 /*break*/, 22];
                        return [4 /*yield*/, this.UnseAgentFromVisitor(session.id || session._id)];
                    case 14:
                        pendingVisitor = _p.sent();
                        if (!pendingVisitor) return [3 /*break*/, 21];
                        queEvent = enums_1.ComposedENUM(enums_1.DynamicEventLogs.VISITOR_UNASSIGNED, { newEmail: '', oldEmail: session.agent.name });
                        return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendEventLog(queEvent, (session._id) ? session._id : session.id)];
                    case 15:
                        logEvent = _p.sent();
                        _c = (_b = Promise).all;
                        return [4 /*yield*/, __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'V', broadcast: false, eventName: 'noAgent', nsp: session.nsp, roomName: [(session.id || session._id)], data: { state: 2, agent: pendingVisitor.agent } })];
                    case 16:
                        _d = [
                            _p.sent()
                        ];
                        return [4 /*yield*/, __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: session.nsp, roomName: [this.NotifyAllAgents()], data: { id: pendingVisitor.id, session: pendingVisitor } })];
                    case 17: return [4 /*yield*/, _c.apply(_b, [_d.concat([
                                _p.sent()
                            ])])];
                    case 18:
                        promises = _p.sent();
                        return [4 /*yield*/, this.UpdateConversationState(pendingVisitor.conversationID, 1, false)];
                    case 19:
                        updatedConversation = _p.sent();
                        if (!updatedConversation) return [3 /*break*/, 21];
                        return [4 /*yield*/, __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'removeConversation', nsp: session.nsp, roomName: [this.NotifySingleAgent(session)], data: { conversation: updatedConversation.value } })];
                    case 20:
                        _p.sent();
                        _p.label = 21;
                    case 21: return [3 /*break*/, 23];
                    case 22: return [2 /*return*/];
                    case 23: return [3 /*break*/, 40];
                    case 24: return [4 /*yield*/, this.GetAgentByID(session.agent.id)];
                    case 25:
                        agent = _p.sent();
                        assignedAgent = undefined;
                        return [4 /*yield*/, __BIZZC_REDIS.GenerateSID(session.nsp, session._id.toString())];
                    case 26:
                        mutex_2 = _p.sent();
                        if (!mutex_2) return [3 /*break*/, 40];
                        if (!(agent && agent.acceptingChats && !assignedAgent)) return [3 /*break*/, 28];
                        return [4 /*yield*/, this.AssignChatFromInactive(session, agent.email)];
                    case 27:
                        assignedAgent = _p.sent();
                        return [3 /*break*/, 32];
                    case 28:
                        if (!(origin && origin.length && origin[0]['settings']['chatSettings']['assignments'].priorityAgent.trim() && !assignedAgent)) return [3 /*break*/, 30];
                        return [4 /*yield*/, this.AssignChatFromInactive(session, origin[0]['settings']['chatSettings']['assignments'].priorityAgent.trim())];
                    case 29:
                        assignedAgent = _p.sent();
                        return [3 /*break*/, 32];
                    case 30:
                        if (!!assignedAgent) return [3 /*break*/, 32];
                        return [4 /*yield*/, this.AssignChatFromInactive(session)];
                    case 31:
                        assignedAgent = _p.sent();
                        _p.label = 32;
                    case 32:
                        if (!!assignedAgent) return [3 /*break*/, 40];
                        return [4 /*yield*/, this.UnseAgentFromVisitor(session.id || session._id)];
                    case 33:
                        pendingVisitor = _p.sent();
                        if (!pendingVisitor) return [3 /*break*/, 40];
                        queEvent = enums_1.ComposedENUM(enums_1.DynamicEventLogs.VISITOR_UNASSIGNED, { newEmail: '', oldEmail: session.agent.name });
                        return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendEventLog(queEvent, (session._id) ? session._id : session.id)];
                    case 34:
                        logEvent = _p.sent();
                        _f = (_e = Promise).all;
                        return [4 /*yield*/, __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'noAgent', nsp: session.nsp, roomName: [(session.id || session._id)], data: { state: 2, agent: pendingVisitor.agent } })];
                    case 35:
                        _g = [
                            _p.sent()
                        ];
                        return [4 /*yield*/, __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: session.nsp, roomName: [this.NotifyAllAgents()], data: { id: pendingVisitor.id, session: pendingVisitor } })];
                    case 36: return [4 /*yield*/, _f.apply(_e, [_g.concat([
                                _p.sent()
                            ])])];
                    case 37:
                        promises = _p.sent();
                        return [4 /*yield*/, this.UpdateConversationState(pendingVisitor.conversationID, 1, false)];
                    case 38:
                        updatedConversation = _p.sent();
                        if (!updatedConversation) return [3 /*break*/, 40];
                        return [4 /*yield*/, __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'removeConversation', nsp: session.nsp, roomName: [this.NotifySingleAgent(session)], data: { conversation: updatedConversation.value } })];
                    case 39:
                        _p.sent();
                        _p.label = 40;
                    case 40: return [3 /*break*/, 70];
                    case 41: return [4 /*yield*/, this.GetAllActiveAgentsChatting(session)];
                    case 42:
                        /**
                         * @Cases
                         * 1. If Agent Who Invited is available Resume to Same Agent.
                         * 2. Else Close Conversation and move to Browsing
                         */
                        // console.log('Makeing Active State 4');
                        allAgents = _p.sent();
                        if (!!allAgents) return [3 /*break*/, 52];
                        return [4 /*yield*/, __BIZZC_REDIS.GenerateSID(session.nsp, session._id.toString())];
                    case 43:
                        mutex_3 = _p.sent();
                        if (!mutex_3) return [3 /*break*/, 51];
                        return [4 /*yield*/, this.UnseAgentFromVisitor(session.id || session._id)];
                    case 44:
                        pendingVisitor = _p.sent();
                        if (!pendingVisitor) return [3 /*break*/, 51];
                        queEvent = enums_1.ComposedENUM(enums_1.DynamicEventLogs.VISITOR_UNASSIGNED, { newEmail: '', oldEmail: session.agent.name });
                        return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendEventLog(queEvent, (session._id) ? session._id : session.id)];
                    case 45:
                        logEvent = _p.sent();
                        _j = (_h = Promise).all;
                        return [4 /*yield*/, __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'noAgent', nsp: session.nsp, roomName: [(session.id || session._id)], data: { state: 2, agent: pendingVisitor.agent } })];
                    case 46:
                        _k = [
                            _p.sent()
                        ];
                        return [4 /*yield*/, __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: session.nsp, roomName: [this.NotifyAllAgents()], data: { id: pendingVisitor.id, session: pendingVisitor } })];
                    case 47: return [4 /*yield*/, _j.apply(_h, [_k.concat([
                                _p.sent()
                            ])])];
                    case 48:
                        promises = _p.sent();
                        return [4 /*yield*/, this.UpdateConversationState(pendingVisitor.conversationID, 1, false)];
                    case 49:
                        updatedConversation = _p.sent();
                        if (!updatedConversation) return [3 /*break*/, 51];
                        return [4 /*yield*/, __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'removeConversation', nsp: session.nsp, roomName: [this.NotifySingleAgent(session)], data: { conversation: updatedConversation.value } })];
                    case 50:
                        _p.sent();
                        _p.label = 51;
                    case 51: return [3 /*break*/, 68];
                    case 52: return [4 /*yield*/, this.GetAgentByID(session.agent.id)];
                    case 53:
                        agent = _p.sent();
                        assignedAgent = undefined;
                        return [4 /*yield*/, __BIZZC_REDIS.GenerateSID(session.nsp, session._id.toString())];
                    case 54:
                        mutex_4 = _p.sent();
                        if (!mutex_4) return [3 /*break*/, 68];
                        if (!(agent && agent.acceptingChats && !assignedAgent)) return [3 /*break*/, 56];
                        return [4 /*yield*/, this.AssignChatFromInactive(session, agent.email, session.state)];
                    case 55:
                        assignedAgent = _p.sent();
                        return [3 /*break*/, 60];
                    case 56:
                        if (!(origin && origin.length && origin[0]['settings']['chatSettings']['assignments'].priorityAgent.trim())) return [3 /*break*/, 58];
                        return [4 /*yield*/, this.AssignChatFromInactive(session, origin[0]['settings']['chatSettings']['assignments'].priorityAgent.trim(), session.state)];
                    case 57:
                        assignedAgent = _p.sent();
                        return [3 /*break*/, 60];
                    case 58: return [4 /*yield*/, this.AssignChatFromInactive(session, '', session.state)];
                    case 59:
                        assignedAgent = _p.sent();
                        _p.label = 60;
                    case 60:
                        if (!!assignedAgent) return [3 /*break*/, 68];
                        return [4 /*yield*/, this.UnseAgentFromVisitor(session.id || session._id)];
                    case 61:
                        pendingVisitor = _p.sent();
                        if (!pendingVisitor) return [3 /*break*/, 68];
                        queEvent = enums_1.ComposedENUM(enums_1.DynamicEventLogs.VISITOR_UNASSIGNED, { newEmail: '', oldEmail: session.agent.name });
                        return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendEventLog(queEvent, (session._id) ? session._id : session.id)];
                    case 62:
                        logEvent = _p.sent();
                        _m = (_l = Promise).all;
                        return [4 /*yield*/, __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'noAgent', nsp: session.nsp, roomName: [(session.id || session._id)], data: { state: 2, agent: pendingVisitor.agent } })];
                    case 63:
                        _o = [
                            _p.sent()
                        ];
                        return [4 /*yield*/, __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: session.nsp, roomName: [this.NotifyAllAgents()], data: { id: pendingVisitor.id, session: pendingVisitor } })];
                    case 64: return [4 /*yield*/, _m.apply(_l, [_o.concat([
                                _p.sent()
                            ])])];
                    case 65:
                        promises = _p.sent();
                        return [4 /*yield*/, this.UpdateConversationState(pendingVisitor.conversationID, 1, false)];
                    case 66:
                        updatedConversation = _p.sent();
                        if (!updatedConversation) return [3 /*break*/, 68];
                        return [4 /*yield*/, __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'removeConversation', nsp: session.nsp, roomName: [this.NotifySingleAgent(session)], data: { conversation: updatedConversation.value } })];
                    case 67:
                        _p.sent();
                        _p.label = 68;
                    case 68: return [3 /*break*/, 70];
                    case 69: return [3 /*break*/, 70];
                    case 70: return [3 /*break*/, 72];
                    case 71:
                        error_37 = _p.sent();
                        console.log(error_37);
                        console.log('Error in Check Active');
                        return [3 /*break*/, 72];
                    case 72: return [2 /*return*/];
                }
            });
        });
    };
    VisitorTimeoutWorker.prototype.GetSessionforReActivation = function (nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var visitor, error_38;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!(this.sessionDB && this.sessionsCollection)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.sessionsCollection.find({
                                nsp: nsp,
                                makeActive: true,
                                inactive: true
                            }).limit(100).sort({ lastTouchedTime: 1 }).toArray()];
                    case 1:
                        visitor = _a.sent();
                        return [2 /*return*/, visitor];
                    case 2: return [2 /*return*/, []];
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        error_38 = _a.sent();
                        console.log('Error in Unsetting Agent From Visitor');
                        console.log(error_38);
                        return [2 /*return*/, []];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    VisitorTimeoutWorker.prototype.UnsetChatFromAgent = function (session) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                try {
                    // console.trace();
                    // console.log(this.db);
                    // console.log(this.collection);
                    if (this.sessionDB && this.sessionsCollection) {
                        return [2 /*return*/, this.sessionsCollection.findOneAndUpdate((_a = {
                                    nsp: session.nsp,
                                    _id: new mongodb_1.ObjectID(session.agent.id)
                                },
                                _a["rooms." + (session._id.toString())] = { $exists: true },
                                _a), {
                                $unset: (_b = {}, _b["rooms." + session._id.toString()] = 1, _b),
                                $inc: { chatCount: -1 }
                            }, { returnOriginal: false, upsert: false })];
                    }
                    else {
                        return [2 /*return*/, undefined];
                    }
                }
                catch (error) {
                    console.log(error);
                    console.log('Error in Unsetting Chat From Agent');
                }
                return [2 /*return*/];
            });
        });
    };
    VisitorTimeoutWorker.prototype.TransferAgentAuto = function (visitor, newAgent) {
        return __awaiter(this, void 0, void 0, function () {
            var bestAgent, promises, oldUpdateAgent, updatedVisitor, error_39;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 5, , 6]);
                        if (!(this.sessionDB && this.sessionsCollection)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.sessionsCollection.findOneAndUpdate((_a = {
                                    _id: newAgent._id
                                },
                                _a["rooms." + visitor._id.toString()] = { $exists: false },
                                _a), {
                                $set: (_b = {}, _b["rooms." + (visitor.id || visitor._id).toString()] = (visitor.id || visitor._id).toString(), _b),
                                $inc: { chatCount: 1, visitorCount: 1 }
                            }, { returnOriginal: false, upsert: false, sort: { chatCount: 1, visitorCount: 1 } })];
                    case 1:
                        bestAgent = _c.sent();
                        if (!(bestAgent && bestAgent.value)) return [3 /*break*/, 3];
                        return [4 /*yield*/, Promise.all([
                                this.UnsetChatFromAgent(visitor),
                                this.sessionsCollection.findOneAndUpdate({ _id: new mongodb_1.ObjectID(visitor.id || visitor._id) }, {
                                    $set: {
                                        agent: {
                                            id: bestAgent.value._id,
                                            name: bestAgent.value.nickname,
                                            image: (bestAgent.value.image) ? bestAgent.value.image : ''
                                        },
                                        state: 3,
                                        username: visitor.username,
                                        email: visitor.email
                                    }
                                }, { returnOriginal: false, upsert: false })
                            ])];
                    case 2:
                        promises = _c.sent();
                        oldUpdateAgent = (promises[0]) ? promises[0].value : undefined;
                        updatedVisitor = (promises[1]) ? promises[1].value : undefined;
                        return [2 /*return*/, {
                                oldAgent: oldUpdateAgent,
                                newAgent: bestAgent.value,
                                updatedVisitor: updatedVisitor
                            }];
                    case 3: return [2 /*return*/, undefined];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_39 = _c.sent();
                        console.log(error_39);
                        console.log('error');
                        return [2 /*return*/, undefined];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    VisitorTimeoutWorker.prototype.DeleteSession = function (sid, checkInactive) {
        if (checkInactive === void 0) { checkInactive = false; }
        return __awaiter(this, void 0, void 0, function () {
            var error_40;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        if (!!checkInactive) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.sessionsCollection.findOneAndDelete({ _id: new mongodb_1.ObjectId(sid) })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [4 /*yield*/, this.sessionsCollection.findOneAndDelete({ _id: new mongodb_1.ObjectId(sid), inactive: true, makeActive: false })];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_40 = _a.sent();
                        console.log(error_40);
                        console.log('Error in Deleting Session');
                        return [2 /*return*/, undefined];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    VisitorTimeoutWorker.prototype.RemoveSession = function (session, unset) {
        return __awaiter(this, void 0, void 0, function () {
            var deletedDocument, deleted, _a, _b, error_41;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 17, , 18]);
                        if (!(this.sessionDB && this.sessionsCollection)) return [3 /*break*/, 15];
                        deletedDocument = void 0;
                        deleted = false;
                        _a = session.type;
                        switch (_a) {
                            case 'Agents': return [3 /*break*/, 1];
                        }
                        return [3 /*break*/, 5];
                    case 1: return [4 /*yield*/, this.DeleteSession(session._id || session.id)];
                    case 2:
                        deletedDocument = _c.sent();
                        if (!(deletedDocument && deletedDocument.value)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.ArchiveAgentSession(deletedDocument.value)];
                    case 3:
                        _c.sent();
                        return [2 /*return*/, deletedDocument.value];
                    case 4: return [2 /*return*/, false];
                    case 5: return [4 /*yield*/, this.DeleteSession(session._id || session.id, true)];
                    case 6:
                        deletedDocument = _c.sent();
                        if (!(deletedDocument && deletedDocument.value)) return [3 /*break*/, 13];
                        _b = session.state.toString();
                        switch (_b) {
                            case '3': return [3 /*break*/, 7];
                            case '4': return [3 /*break*/, 7];
                        }
                        return [3 /*break*/, 10];
                    case 7:
                        if (!unset) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.UnsetChatFromAgent(session)];
                    case 8:
                        _c.sent();
                        _c.label = 9;
                    case 9: 
                    // if (deletedDocument && deletedDocument.ok) {
                    //     deletedDocument.value['ending_time'] = new Date().toISOString();
                    //     deletedDocument.value['email'] = (SelfAgent && SelfAgent.value) ? SelfAgent.value.email : '';
                    // }
                    return [3 /*break*/, 11];
                    case 10: 
                    // case '1':
                    // case '5':
                    // case '2':
                    // if (deletedDocument && deletedDocument.ok) {
                    //     deletedDocument.value['ending_time'] = new Date().toISOString();
                    // }
                    return [3 /*break*/, 11];
                    case 11: return [4 /*yield*/, this.ArchiveVisitorSession(deletedDocument.value)];
                    case 12:
                        _c.sent();
                        deleted = true;
                        return [2 /*return*/, deleted];
                    case 13: return [2 /*return*/, deleted];
                    case 14: return [3 /*break*/, 16];
                    case 15: return [2 /*return*/, false];
                    case 16: return [3 /*break*/, 18];
                    case 17:
                        error_41 = _c.sent();
                        console.log('Error in Remove Session Worker');
                        console.log(error_41);
                        return [2 /*return*/, false];
                    case 18: return [2 /*return*/];
                }
            });
        });
    };
    VisitorTimeoutWorker.prototype.EndChat = function (cid, updateState, session, survey) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    // console.log('End Chat : ', cid);
                    // console.log('End Chat : ', updateState);
                    // console.log('ENd Chat : ', session);
                    if (updateState) {
                        return [2 /*return*/, this.chatsCollection.findOneAndUpdate({ _id: new mongodb_1.ObjectID(cid) }, {
                                $set: (!survey) ? { state: 3, endingDate: new Date().toISOString(), session: (session) ? session : '' } : { feedback: survey, state: 3, endingDate: new Date().toISOString(), session: (session) ? session : '' }
                            }, { returnOriginal: false, upsert: false })];
                    }
                    else {
                        return [2 /*return*/, this.chatsCollection.findOneAndUpdate({ _id: new mongodb_1.ObjectID(cid) }, {
                                $set: (!survey) ? { feedback: survey, endingDate: new Date().toISOString(), session: (session) ? session : '' } : { endingDate: new Date().toISOString(), session: (session) ? session : '' }
                            }, { returnOriginal: false, upsert: false })];
                    }
                }
                catch (error) {
                    console.log(error);
                    console.log('Error in End Chat');
                }
                return [2 /*return*/];
            });
        });
    };
    VisitorTimeoutWorker.prototype.EndChatMissed = function (cid, session, survey) {
        return __awaiter(this, void 0, void 0, function () {
            var error_42;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.chatsCollection.findOneAndUpdate({ _id: new mongodb_1.ObjectID(cid) }, {
                                $set: (!survey) ? { feedback: survey, endingDate: new Date().toISOString(), missed: true, state: 3, session: (session) ? session : '' } : { endingDate: new Date().toISOString(), missed: true, state: 3, session: (session) ? session : '' }
                            }, { returnOriginal: false, upsert: false })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_42 = _a.sent();
                        console.log(error_42);
                        console.log('Error in End Chat Missed');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    VisitorTimeoutWorker.prototype.AddPenaltyTime = function (cid, email, lastMessageTime) {
        return __awaiter(this, void 0, void 0, function () {
            var lastTime, currentTime, Difference, error_43;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        lastTime = new Date(lastMessageTime);
                        currentTime = new Date();
                        Difference = ((Date.parse(currentTime.toISOString()) - Date.parse(lastTime.toISOString())) / 1000) / 60;
                        return [4 /*yield*/, this.chatsCollection.findOneAndUpdate((_a = { _id: new mongodb_1.ObjectID(cid) }, _a['assigned_to.email'] = email, _a), { $inc: (_b = {}, _b['assigned_to.$.penaltyTime'] = Difference, _b) }, { returnOriginal: false, upsert: false })];
                    case 1: return [2 /*return*/, _c.sent()];
                    case 2:
                        error_43 = _c.sent();
                        console.log(error_43);
                        console.log('Error in Updating Last Message');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    VisitorTimeoutWorker.prototype.GetAllWaitingVisitors = function (nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var inactiveSessions, error_44;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        inactiveSessions = [];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        if (!(this.sessionDB && this.sessionsCollection)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.sessionsCollection.find({
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
                        error_44 = _a.sent();
                        console.log(error_44);
                        console.log('error in GetAllInactiveNonChattingUsers');
                        return [2 /*return*/, inactiveSessions];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    VisitorTimeoutWorker.prototype.getAllVisitors = function (nsp, exclude) {
        return __awaiter(this, void 0, void 0, function () {
            var visitorList, error_45;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.VisitorCollection.find({ nsp: nsp }).sort({ _id: -1 }).limit(20).toArray()];
                    case 1:
                        visitorList = _a.sent();
                        if (visitorList.length)
                            return [2 /*return*/, visitorList];
                        else
                            return [2 /*return*/, []];
                        return [3 /*break*/, 3];
                    case 2:
                        error_45 = _a.sent();
                        console.log('Error in Sending Visitors List');
                        console.log(error_45);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    VisitorTimeoutWorker.prototype.UnbanVisitor = function (deviceID, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    if (deviceID) {
                        return [2 /*return*/, this.VisitorCollection.findOneAndUpdate({ nsp: nsp, deviceID: deviceID }, {
                                $set: {
                                    banned: false,
                                    banSpan: 0,
                                    bannedOn: ''
                                }
                            }, { returnOriginal: false, upsert: false })];
                    }
                }
                catch (err) {
                    console.log(err);
                }
                return [2 /*return*/];
            });
        });
    };
    VisitorTimeoutWorker.prototype.AllocateAgentWorker = function (VisitorSession, conversationID, exclude, state) {
        if (exclude === void 0) { exclude = []; }
        return __awaiter(this, void 0, void 0, function () {
            var bestAgent, updatedVisitorSession, error_46;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 12, , 13]);
                        if (!(this.sessionDB && this.sessionsCollection)) return [3 /*break*/, 10];
                        exclude = exclude.map(function (id) { return new mongodb_1.ObjectID(id); });
                        return [4 /*yield*/, this.sessionsCollection.findOneAndUpdate((_a = {
                                    nsp: VisitorSession.nsp,
                                    acceptingChats: true
                                },
                                _a['permissions.chats.canChat'] = true,
                                _a.type = 'Agents',
                                _a._id = { $nin: exclude },
                                _a["rooms." + VisitorSession._id.toString()] = { $exists: false },
                                _a.$expr = { $lt: ['$chatCount', '$concurrentChatLimit'] },
                                _a), {
                                $set: (_b = {},
                                    _b["rooms." + (VisitorSession.id || VisitorSession._id).toString()] = (VisitorSession.id || VisitorSession._id).toString(),
                                    _b),
                                $inc: { chatCount: 1, visitorCount: 1 }
                            }, { returnOriginal: false, upsert: false, sort: { chatCount: 1, visitorCount: 1 } })];
                    case 1:
                        bestAgent = _e.sent();
                        if (!(bestAgent && bestAgent.value)) return [3 /*break*/, 8];
                        VisitorSession.previousState = ((VisitorSession.inactive) ? '-' : '') + VisitorSession.state.toString();
                        return [4 /*yield*/, this.sessionsCollection.findOneAndUpdate({ _id: new mongodb_1.ObjectID(VisitorSession.id || VisitorSession._id) }, {
                                $set: {
                                    agent: (bestAgent.value) ? {
                                        id: bestAgent.value._id.toString(),
                                        name: (bestAgent.value.nickname) ? bestAgent.value.nickname : bestAgent.value.name,
                                        image: (bestAgent.value.image) ? bestAgent.value.image : ''
                                    } : { id: '', name: '', image: '' },
                                    state: (state) ? state : (bestAgent.value) ? 3 : 2,
                                    previousState: (VisitorSession.previousState) ? VisitorSession.previousState : '',
                                    conversationID: (conversationID) ? conversationID : '',
                                    username: VisitorSession.username,
                                    email: VisitorSession.email
                                }
                            }, { returnOriginal: false, upsert: false })];
                    case 2:
                        updatedVisitorSession = _e.sent();
                        if (!(updatedVisitorSession && updatedVisitorSession.value)) return [3 /*break*/, 5];
                        if (!updatedVisitorSession.value.previousState) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.UpdateChatStateHistory(updatedVisitorSession.value)];
                    case 3:
                        _e.sent();
                        _e.label = 4;
                    case 4: return [2 /*return*/, {
                            agent: bestAgent.value,
                            visitor: updatedVisitorSession.value
                        }];
                    case 5: return [4 /*yield*/, this.sessionsCollection.findOneAndUpdate((_c = {
                                _id: new mongodb_1.ObjectId(bestAgent.value._id)
                            },
                            _c["rooms." + VisitorSession._id.toString()] = { $exists: true },
                            _c), {
                            $unset: (_d = {}, _d["rooms." + VisitorSession._id.toString()] = 1, _d),
                            $inc: { chatCount: -1 }
                        }, { returnOriginal: false, upsert: false })];
                    case 6:
                        _e.sent();
                        return [2 /*return*/, undefined];
                    case 7: return [3 /*break*/, 9];
                    case 8: return [2 /*return*/, undefined];
                    case 9: return [3 /*break*/, 11];
                    case 10: return [2 /*return*/, undefined];
                    case 11: return [3 /*break*/, 13];
                    case 12:
                        error_46 = _e.sent();
                        console.log('Error in Allocating Agent Worker');
                        console.log(error_46);
                        return [2 /*return*/, undefined];
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    VisitorTimeoutWorker.prototype.AllocateAgentWorkerFromInvitation = function (VisitorSession, conversationID, exclude, state) {
        if (exclude === void 0) { exclude = []; }
        return __awaiter(this, void 0, void 0, function () {
            var bestAgent, updatedVisitorSession, error_47;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 12, , 13]);
                        if (!(this.sessionDB && this.sessionsCollection)) return [3 /*break*/, 10];
                        exclude = exclude.map(function (id) { return new mongodb_1.ObjectID(id); });
                        return [4 /*yield*/, this.sessionsCollection.findOneAndUpdate((_a = {
                                    nsp: VisitorSession.nsp,
                                    acceptingChats: true
                                },
                                _a['permissions.chats.canChat'] = true,
                                _a.type = 'Agents',
                                _a._id = { $nin: exclude },
                                _a["rooms." + VisitorSession._id.toString()] = { $exists: false },
                                _a.$expr = { $lt: ['$chatCount', '$concurrentChatLimit'] },
                                _a), {
                                $set: (_b = {},
                                    _b["rooms." + (VisitorSession.id || VisitorSession._id).toString()] = (VisitorSession.id || VisitorSession._id).toString(),
                                    _b),
                                $inc: { chatCount: 1, visitorCount: 1 }
                            }, { returnOriginal: false, upsert: false, sort: { chatCount: 1, visitorCount: 1 } })];
                    case 1:
                        bestAgent = _e.sent();
                        if (!(bestAgent && bestAgent.value)) return [3 /*break*/, 8];
                        VisitorSession.previousState = ((VisitorSession.inactive) ? '-' : '') + VisitorSession.state.toString();
                        return [4 /*yield*/, this.sessionsCollection.findOneAndUpdate({ _id: new mongodb_1.ObjectID(VisitorSession.id || VisitorSession._id), state: 1 }, {
                                $set: {
                                    agent: (bestAgent.value) ? {
                                        id: bestAgent.value._id.toString(),
                                        name: (bestAgent.value.nickname) ? bestAgent.value.nickname : bestAgent.value.name,
                                        image: (bestAgent.value.image) ? bestAgent.value.image : ''
                                    } : { id: '', name: '', image: '' },
                                    state: (state) ? state : (bestAgent.value) ? 3 : 2,
                                    previousState: (VisitorSession.previousState) ? VisitorSession.previousState : '',
                                    conversationID: (conversationID) ? conversationID : '',
                                    username: VisitorSession.username,
                                    email: VisitorSession.email
                                }
                            }, { returnOriginal: false, upsert: false })];
                    case 2:
                        updatedVisitorSession = _e.sent();
                        if (!(updatedVisitorSession && updatedVisitorSession.value)) return [3 /*break*/, 5];
                        if (!updatedVisitorSession.value.previousState) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.UpdateChatStateHistory(updatedVisitorSession.value)];
                    case 3:
                        _e.sent();
                        _e.label = 4;
                    case 4: return [2 /*return*/, {
                            agent: bestAgent.value,
                            visitor: updatedVisitorSession.value
                        }];
                    case 5: return [4 /*yield*/, this.sessionsCollection.findOneAndUpdate((_c = {
                                _id: new mongodb_1.ObjectId(bestAgent.value._id)
                            },
                            _c["rooms." + VisitorSession._id.toString()] = { $exists: true },
                            _c), {
                            $unset: (_d = {}, _d["rooms." + VisitorSession._id.toString()] = 1, _d),
                            $inc: { chatCount: -1 }
                        }, { returnOriginal: false, upsert: false })];
                    case 6:
                        _e.sent();
                        return [2 /*return*/, undefined];
                    case 7: return [3 /*break*/, 9];
                    case 8: return [2 /*return*/, undefined];
                    case 9: return [3 /*break*/, 11];
                    case 10: return [2 /*return*/, undefined];
                    case 11: return [3 /*break*/, 13];
                    case 12:
                        error_47 = _e.sent();
                        console.log('Error in Allocating Agent Worker With State');
                        console.log(error_47);
                        return [2 /*return*/, undefined];
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    VisitorTimeoutWorker.prototype.AllocateAgentWorkeWhenAgentDissconnect = function (VisitorSession, conversationID, exclude, state) {
        if (exclude === void 0) { exclude = []; }
        return __awaiter(this, void 0, void 0, function () {
            var bestAgent, updatedVisitorSession, updatedVisitorSession, error_48;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 13, , 14]);
                        if (!(this.sessionDB && this.sessionsCollection)) return [3 /*break*/, 11];
                        exclude = exclude.map(function (id) { return new mongodb_1.ObjectID(id); });
                        return [4 /*yield*/, this.sessionsCollection.findOneAndUpdate((_a = {
                                    nsp: VisitorSession.nsp,
                                    acceptingChats: true
                                },
                                _a['permissions.chats.canChat'] = true,
                                _a.type = 'Agents',
                                _a._id = { $nin: exclude },
                                _a["rooms." + VisitorSession._id.toString()] = { $exists: false },
                                _a.$expr = { $lt: ['$chatCount', '$concurrentChatLimit'] },
                                _a), {
                                $set: (_b = {},
                                    _b["rooms." + (VisitorSession.id || VisitorSession._id).toString()] = (VisitorSession.id || VisitorSession._id).toString(),
                                    _b),
                                $inc: { chatCount: 1, visitorCount: 1 }
                            }, { returnOriginal: false, upsert: false, sort: { chatCount: 1, visitorCount: 1 } })];
                    case 1:
                        bestAgent = _e.sent();
                        if (!(bestAgent && bestAgent.value)) return [3 /*break*/, 8];
                        VisitorSession.previousState = ((VisitorSession.inactive) ? '-' : '') + VisitorSession.state.toString();
                        return [4 /*yield*/, this.sessionsCollection.findOneAndUpdate({ _id: new mongodb_1.ObjectID(VisitorSession.id || VisitorSession._id) }, {
                                $set: {
                                    agent: {
                                        id: bestAgent.value._id,
                                        name: (bestAgent.value.nickname) ? bestAgent.value.nickname : '',
                                        image: (bestAgent.value.image) ? bestAgent.value.image : ''
                                    },
                                    state: 3,
                                    previousState: (VisitorSession.previousState) ? VisitorSession.previousState : '',
                                    conversationID: conversationID,
                                    username: VisitorSession.username,
                                    email: VisitorSession.email
                                }
                            }, { returnOriginal: false, upsert: false })];
                    case 2:
                        updatedVisitorSession = _e.sent();
                        if (!(updatedVisitorSession && updatedVisitorSession.value)) return [3 /*break*/, 5];
                        if (!updatedVisitorSession.value.previousState) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.UpdateChatStateHistory(updatedVisitorSession.value)];
                    case 3:
                        _e.sent();
                        _e.label = 4;
                    case 4: return [2 /*return*/, {
                            agent: bestAgent.value,
                            visitor: updatedVisitorSession.value
                        }];
                    case 5: return [4 /*yield*/, this.sessionsCollection.findOneAndUpdate((_c = {
                                _id: new mongodb_1.ObjectId(bestAgent.value._id)
                            },
                            _c["rooms." + VisitorSession._id.toString()] = { $exists: true },
                            _c), {
                            $unset: (_d = {}, _d["rooms." + VisitorSession._id.toString()] = 1, _d),
                            $inc: { chatCount: -1 }
                        }, { returnOriginal: false, upsert: false })];
                    case 6:
                        _e.sent();
                        return [2 /*return*/, undefined];
                    case 7: return [3 /*break*/, 10];
                    case 8: return [4 /*yield*/, this.sessionsCollection.findOneAndUpdate({ _id: new mongodb_1.ObjectID(VisitorSession.id || VisitorSession._id) }, {
                            $set: {
                                agent: { id: '', name: '', image: '' },
                                state: 2,
                                conversationID: conversationID,
                                username: VisitorSession.username,
                                email: VisitorSession.email
                            }
                        }, { returnOriginal: false, upsert: false })];
                    case 9:
                        updatedVisitorSession = _e.sent();
                        if (updatedVisitorSession && updatedVisitorSession.value) {
                            return [2 /*return*/, { agent: undefined, visitor: updatedVisitorSession.value }];
                        }
                        else
                            return [2 /*return*/, undefined];
                        _e.label = 10;
                    case 10: return [3 /*break*/, 12];
                    case 11: return [2 /*return*/, undefined];
                    case 12: return [3 /*break*/, 14];
                    case 13:
                        error_48 = _e.sent();
                        console.log('Error in Allocating Agent Fallback Worker');
                        console.log(error_48);
                        return [2 /*return*/, undefined];
                    case 14: return [2 /*return*/];
                }
            });
        });
    };
    VisitorTimeoutWorker.prototype.AllocateAgentPriorityOnInvitation = function (session, email, conversationID, state) {
        return __awaiter(this, void 0, void 0, function () {
            var UpdatedSessions, error_49;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!(this.sessionDB && this.sessionsCollection)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.AssignAgentByEmailCheckBrowsingState(session, email, conversationID, (state) ? state : undefined)];
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
                        error_49 = _a.sent();
                        console.log('Error in Allocating Agent');
                        console.log(error_49);
                        return [2 /*return*/, undefined];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    VisitorTimeoutWorker.prototype.AllocateAgentPriority = function (session, email, conversationID, state) {
        return __awaiter(this, void 0, void 0, function () {
            var UpdatedSessions, error_50;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!(this.sessionDB && this.sessionsCollection)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.AssignAgentByEmail(session, email, conversationID, (state) ? state : undefined)];
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
                        error_50 = _a.sent();
                        console.log('Error in Allocating Agent');
                        console.log(error_50);
                        return [2 /*return*/, undefined];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    VisitorTimeoutWorker.prototype.TransferChatOnChatDisconnect = function (pendingVisitor, visitorID, agent, id) {
        return __awaiter(this, void 0, void 0, function () {
            var UpdatedSessions, newAgent, conversation, _a, _b, _c, payload, event, loggedEvent, chatEvent, promises, _d, _e, _f, pendingVisitor_1, queEvent, promises, _g, _h, _j, error_51;
            return __generator(this, function (_k) {
                switch (_k.label) {
                    case 0:
                        _k.trys.push([0, 23, , 24]);
                        return [4 /*yield*/, this.AllocateAgentWorker(pendingVisitor, new mongodb_1.ObjectID(pendingVisitor.conversationID), [id])];
                    case 1:
                        UpdatedSessions = (_k.sent());
                        newAgent = UpdatedSessions.agent;
                        pendingVisitor = UpdatedSessions.visitor;
                        if (!(UpdatedSessions && newAgent)) return [3 /*break*/, 14];
                        if (!(newAgent.email)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.TransferChatUnmodified(pendingVisitor.conversationID, newAgent.email, false)];
                    case 2:
                        _a = _k.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        _a = undefined;
                        _k.label = 4;
                    case 4:
                        conversation = _a;
                        if (!(conversation && conversation.value)) return [3 /*break*/, 13];
                        this.AddPenaltyTime(pendingVisitor.conversationID, agent.email, (conversation.value.lastMessage) ? conversation.value.lastMessage.date : conversation.value.createdOn);
                        if (!(conversation.value.messageReadCount)) return [3 /*break*/, 6];
                        _c = conversation.value;
                        return [4 /*yield*/, this.getMessages1(pendingVisitor.conversationID)];
                    case 5:
                        _b = _c.messages = _k.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        _b = [];
                        _k.label = 7;
                    case 7:
                        _b;
                        payload = { id: pendingVisitor._id || pendingVisitor.id, session: pendingVisitor };
                        event = enums_1.ComposedENUM(enums_1.DynamicEventLogs.CHAT_AUTO_TRANSFERED, { newEmail: newAgent.email, oldEmail: (agent && agent.email) ? agent.email : '' });
                        return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendEventLog(event, (pendingVisitor._id) ? pendingVisitor._id : pendingVisitor.id)];
                    case 8:
                        loggedEvent = _k.sent();
                        chatEvent = 'Chat auto transferred to ' + (newAgent.name || newAgent.username || newAgent.nickname) + ((agent && agent.email) ? ' from ' + (agent.name || agent.username || agent.nickname) : '');
                        _e = (_d = Promise).all;
                        return [4 /*yield*/, __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: agent.nsp, roomName: [this.NotifyAllAgents()], data: payload })];
                    case 9:
                        _f = [
                            _k.sent()
                        ];
                        return [4 /*yield*/, __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'newConversation', nsp: agent.nsp, roomName: [this.NotifySingleAgent(pendingVisitor)], data: conversation.value })];
                    case 10:
                        _f = _f.concat([
                            _k.sent()
                        ]);
                        return [4 /*yield*/, __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'V', broadcast: false, eventName: 'transferChat', nsp: agent.nsp, roomName: [this.NotifyVisitorSingle(pendingVisitor)], data: { agent: pendingVisitor.agent, event: chatEvent }, event: chatEvent })];
                    case 11: return [4 /*yield*/, _e.apply(_d, [_f.concat([
                                _k.sent()
                            ])])];
                    case 12:
                        promises = _k.sent();
                        return [2 /*return*/, UpdatedSessions];
                    case 13: return [3 /*break*/, 22];
                    case 14: return [4 /*yield*/, this.UnseAgentFromVisitor(visitorID)];
                    case 15:
                        pendingVisitor_1 = _k.sent();
                        if (!pendingVisitor_1) return [3 /*break*/, 21];
                        queEvent = enums_1.ComposedENUM(enums_1.DynamicEventLogs.VISITOR_UNASSIGNED, { newEmail: '', oldEmail: agent.email });
                        _h = (_g = Promise).all;
                        return [4 /*yield*/, __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'noAgent', nsp: agent.nsp, roomName: [visitorID], data: { state: 2, agent: pendingVisitor_1.agent } })];
                    case 16:
                        _j = [
                            _k.sent()
                        ];
                        return [4 /*yield*/, __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: agent.nsp, roomName: [this.NotifyAllAgents()], data: { id: pendingVisitor_1.id, session: pendingVisitor_1 } })];
                    case 17:
                        _j = _j.concat([
                            _k.sent()
                        ]);
                        return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendEventLog(queEvent, (pendingVisitor_1._id) ? pendingVisitor_1._id : pendingVisitor_1.id)];
                    case 18:
                        _j = _j.concat([
                            _k.sent()
                        ]);
                        return [4 /*yield*/, this.UpdateConversationState(pendingVisitor_1.conversationID, 1, false)];
                    case 19: return [4 /*yield*/, _h.apply(_g, [_j.concat([
                                _k.sent()
                            ])])];
                    case 20:
                        promises = _k.sent();
                        _k.label = 21;
                    case 21: return [2 /*return*/, undefined];
                    case 22: return [3 /*break*/, 24];
                    case 23:
                        error_51 = _k.sent();
                        console.log(error_51);
                        console.log('error in Transfer Agent Disconnect');
                        return [2 /*return*/, undefined];
                    case 24: return [2 /*return*/];
                }
            });
        });
    };
    VisitorTimeoutWorker.prototype.GetVisitorsForInvitationByTimeSpent = function (nsp, timeInMinutes) {
        return __awaiter(this, void 0, void 0, function () {
            var visitors, error_52;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!(this.sessionDB && this.sessionsCollection)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.sessionsCollection.find({
                                nsp: nsp,
                                type: 'Visitors',
                                state: 1,
                                inactive: false,
                                newUser: false,
                                creationDate: { $lte: new Date(new Date().getTime() - 1000 * 60 * timeInMinutes).toISOString() },
                            }).limit(100).toArray()];
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
                        error_52 = _a.sent();
                        console.log('Error in Get Browsing Visitors');
                        console.log(error_52);
                        return [2 /*return*/, []];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    VisitorTimeoutWorker.prototype.GetVisitorsForInvitationByURLVisited = function (nsp, urlLength) {
        return __awaiter(this, void 0, void 0, function () {
            var visitors, error_53;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
                        if (!(this.sessionDB && this.sessionsCollection)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.sessionsCollection.find((_a = {
                                    nsp: nsp,
                                    type: 'Visitors',
                                    state: 1,
                                    inactive: false,
                                    newUser: false
                                },
                                _a["url." + (urlLength - 1)] = { $exists: true },
                                _a)).limit(100).toArray()];
                    case 1:
                        visitors = _b.sent();
                        if (visitors.length)
                            return [2 /*return*/, visitors];
                        else
                            return [2 /*return*/, []];
                        return [3 /*break*/, 3];
                    case 2: return [2 /*return*/, []];
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        error_53 = _b.sent();
                        console.log('Error in Get Browsing Visitors');
                        console.log(error_53);
                        return [2 /*return*/, []];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    VisitorTimeoutWorker.prototype.GetVisitorsForInvitationByCurrentUrl = function (nsp, url) {
        return __awaiter(this, void 0, void 0, function () {
            var visitors, error_54;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
                        if (!(this.sessionDB && this.sessionsCollection)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.sessionsCollection.find((_a = {
                                    nsp: nsp,
                                    type: 'Visitors',
                                    state: 1,
                                    inactive: false,
                                    newUser: false
                                },
                                _a['url.0'] = { $in: url },
                                _a)).limit(100).toArray()];
                    case 1:
                        visitors = _b.sent();
                        if (visitors.length)
                            return [2 /*return*/, visitors];
                        else
                            return [2 /*return*/, []];
                        return [3 /*break*/, 3];
                    case 2: return [2 /*return*/, []];
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        error_54 = _b.sent();
                        console.log('Error in Get Browsing Visitors');
                        console.log(error_54);
                        return [2 /*return*/, []];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    VisitorTimeoutWorker.prototype.AutomaticEngagement = function (visitorSession, state, chatOnInvitation, greetingMessage, priorityAgent) {
        return __awaiter(this, void 0, void 0, function () {
            var allAgents, _a, allocatedAgent, cid, session, UpdatedSessions, _b, locked, _c, conversation, payload, lastMessage, messageinsertedID, newEngagement, mutex, _d, _e, _f, payload, lastMessage, newEngagement, _g, _h, _j, error_55;
            return __generator(this, function (_k) {
                switch (_k.label) {
                    case 0:
                        _k.trys.push([0, 36, , 37]);
                        if (!(chatOnInvitation)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.GetAllActiveAgentsChatting(visitorSession)];
                    case 1:
                        _a = _k.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.GetChattingAgentsForInvite(visitorSession)];
                    case 3:
                        _a = _k.sent();
                        _k.label = 4;
                    case 4:
                        allAgents = _a;
                        if (!!allAgents) return [3 /*break*/, 5];
                        return [2 /*return*/];
                    case 5:
                        allocatedAgent = void 0;
                        cid = new mongodb_1.ObjectID();
                        return [4 /*yield*/, this.GetVisitorByID(visitorSession.id || visitorSession._id)];
                    case 6:
                        session = (_k.sent());
                        session.username = session.username || 'Guest' + new Date().toLocaleTimeString().split(':').join('').split(' ')[0];
                        session.email = session.email || 'UnRegistered';
                        if (!session || (session && (session.state != 1)))
                            return [2 /*return*/];
                        UpdatedSessions = void 0;
                        _b = true;
                        switch (_b) {
                            case chatOnInvitation: return [3 /*break*/, 7];
                        }
                        return [3 /*break*/, 28];
                    case 7: return [4 /*yield*/, __BIZZC_REDIS.GenerateSID(session.nsp, session._id)];
                    case 8:
                        locked = _k.sent();
                        if (!locked)
                            return [2 /*return*/];
                        if (!(priorityAgent.trim())) return [3 /*break*/, 10];
                        return [4 /*yield*/, this.AllocateAgentPriorityOnInvitation(session, priorityAgent, cid, state)];
                    case 9:
                        _c = _k.sent();
                        return [3 /*break*/, 12];
                    case 10: return [4 /*yield*/, this.AllocateAgentWorkerFromInvitation(session, cid, [], state)];
                    case 11:
                        _c = _k.sent();
                        _k.label = 12;
                    case 12:
                        UpdatedSessions = _c;
                        if (!(UpdatedSessions && UpdatedSessions.agent)) return [3 /*break*/, 27];
                        allocatedAgent = (UpdatedSessions.agent) ? UpdatedSessions.agent : '';
                        session = (UpdatedSessions.visitor) ? UpdatedSessions.visitor : session;
                        if (!allocatedAgent) return [3 /*break*/, 27];
                        conversation = void 0;
                        return [4 /*yield*/, this.createConversation(cid, session.email, session.id, session.nsp, session.viewColor, allocatedAgent.email, session.username, 2, session.deviceID)];
                    case 13:
                        /**
                         * @Note TO test atomicity between operation Uncomment Following Code
                         *  console.log('After Seleep Code');
                         */
                        // console.log('Sleeping In HAlf After Creating Conversation');
                        // await this.Sleep(3000);
                        conversation = _k.sent();
                        if (!(conversation && conversation.insertedCount)) return [3 /*break*/, 27];
                        return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendEventLog(enums_1.EventLogMessages.CHAT_INITIATED, (session._id) ? session._id : session.id)];
                    case 14:
                        _k.sent();
                        payload = { id: session.id, session: session };
                        lastMessage = void 0;
                        if (!greetingMessage) return [3 /*break*/, 17];
                        lastMessage = {
                            from: session.nsp.substr(1),
                            to: session.username,
                            body: greetingMessage,
                            cid: (conversation && conversation.insertedId) ? conversation.insertedId.toHexString() : '',
                            date: (new Date()).toISOString(),
                            type: 'Agents',
                            attachment: false
                        };
                        return [4 /*yield*/, this.insertMessage(lastMessage)];
                    case 15:
                        messageinsertedID = _k.sent();
                        conversation.ops[0].messages.push(messageinsertedID.ops[0]);
                        return [4 /*yield*/, this.UpdateLastMessage(conversation.insertedId.toHexString(), lastMessage)];
                    case 16:
                        _k.sent();
                        _k.label = 17;
                    case 17:
                        newEngagement = {
                            clientID: conversation.ops[0].clientID,
                            state: state,
                            username: session.username,
                            email: session.email,
                            agent: session.agent,
                            greetingMessage: (conversation && conversation.ops[0].messages.length) ? conversation.ops[0].messages[0] : (lastMessage) ? lastMessage : '',
                            cid: (session.conversationID) ? session.conversationID : ''
                        };
                        return [4 /*yield*/, __BIZZC_REDIS.GetID("_" + session.nsp + "_" + session._id.toString())];
                    case 18:
                        mutex = _k.sent();
                        if (!(mutex > 1)) return [3 /*break*/, 20];
                        return [4 /*yield*/, this.GetVisitorByID(session._id)];
                    case 19:
                        session = (_k.sent());
                        payload.session = session;
                        newEngagement = {
                            clientID: conversation.ops[0].clientID,
                            state: session.state,
                            username: session.username,
                            email: session.email,
                            agent: session.agent,
                            greetingMessage: (conversation && conversation.ops[0].messages.length) ? conversation.ops[0].messages[0] : (lastMessage) ? lastMessage : '',
                            cid: (session.conversationID) ? session.conversationID : ''
                        };
                        _k.label = 20;
                    case 20:
                        _e = (_d = Promise).all;
                        //Server Push Visitor To Recieve Invitation
                        return [4 /*yield*/, __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'newEngagement', nsp: session.nsp, roomName: [this.NotifyVisitorSingle(session)], data: newEngagement })];
                    case 21:
                        _f = [
                            //Server Push Visitor To Recieve Invitation
                            _k.sent()
                        ];
                        //Server Push New Conversation to Agent.
                        return [4 /*yield*/, __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'newConversation', nsp: session.nsp, roomName: [allocatedAgent.id], data: conversation.ops[0] })];
                    case 22:
                        _f = _f.concat([
                            //Server Push New Conversation to Agent.
                            _k.sent()
                        ]);
                        //Broadcast To All Agents That User Information and State Has Been Updated.
                        return [4 /*yield*/, __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: session.nsp, roomName: [this.NotifyAllAgents()], data: payload })];
                    case 23:
                        _f = _f.concat([
                            //Broadcast To All Agents That User Information and State Has Been Updated.
                            _k.sent()
                        ]);
                        //Inform archiving Database to update SQS LOG
                        return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendEventLog(enums_1.EventLogMessages.VISITOR_INVITED, (session._id) ? session._id : session.id)];
                    case 24:
                        _f = _f.concat([
                            //Inform archiving Database to update SQS LOG
                            _k.sent()
                        ]);
                        //Deleting Mutex
                        return [4 /*yield*/, __BIZZC_REDIS.DeleteID("_" + session.nsp + "_" + session._id.toString())];
                    case 25: return [4 /*yield*/, _e.apply(_d, [_f.concat([
                                //Deleting Mutex
                                _k.sent()
                            ])])];
                    case 26:
                        _k.sent();
                        return [3 /*break*/, 27];
                    case 27: return [3 /*break*/, 35];
                    case 28: return [4 /*yield*/, this.SetState(session._id, 5, session.state.toString())];
                    case 29:
                        /**
                         * @Note For Delay and Atomiticity Testing Use Following Code
                         *  // console.log('Sleeping in state 5');
                         *  // await this.Sleep(5000);
                         */
                        UpdatedSessions = _k.sent();
                        if (!UpdatedSessions) return [3 /*break*/, 34];
                        payload = { id: session.id, session: UpdatedSessions };
                        lastMessage = void 0;
                        if (greetingMessage) {
                            lastMessage = {
                                from: UpdatedSessions.nsp.substr(1),
                                to: UpdatedSessions.username,
                                body: greetingMessage,
                                cid: '',
                                date: (new Date()).toISOString(),
                                type: 'Agents',
                                attachment: false
                            };
                        }
                        newEngagement = {
                            clientID: '',
                            state: state,
                            username: UpdatedSessions.username,
                            email: UpdatedSessions.email,
                            agent: UpdatedSessions.agent,
                            greetingMessage: (lastMessage) ? lastMessage : '',
                            cid: ''
                        };
                        _h = (_g = Promise).all;
                        //Broadcast To All Agents That User Information and State Has Been Updated.
                        return [4 /*yield*/, __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: UpdatedSessions.nsp, roomName: [this.NotifyAllAgents()], data: payload })];
                    case 30:
                        _j = [
                            //Broadcast To All Agents That User Information and State Has Been Updated.
                            _k.sent()
                        ];
                        return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendEventLog(enums_1.EventLogMessages.VISITOR_INVITED, (UpdatedSessions._id) ? UpdatedSessions._id : UpdatedSessions.id)];
                    case 31:
                        _j = _j.concat([
                            _k.sent()
                        ]);
                        return [4 /*yield*/, __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'newEngagement', nsp: UpdatedSessions.nsp, roomName: [this.NotifyVisitorSingle(session)], data: newEngagement })];
                    case 32: return [4 /*yield*/, _h.apply(_g, [_j.concat([
                                _k.sent()
                            ])])];
                    case 33:
                        _k.sent();
                        _k.label = 34;
                    case 34: return [3 /*break*/, 35];
                    case 35: return [3 /*break*/, 37];
                    case 36:
                        error_55 = _k.sent();
                        // let session = (await this.GetVisitorByID(visitorSession)) as VisitorSessionSchema;
                        // await this.UpdateSession(session.id || session._id, session);
                        console.log(error_55);
                        console.log('Error in Automatic Engagement Worker');
                        return [3 /*break*/, 37];
                    case 37: return [2 /*return*/];
                }
            });
        });
    };
    //#endregion
    //#region Archiving Session
    VisitorTimeoutWorker.prototype.ArchiveAgentSession = function (session, id) {
        return __awaiter(this, void 0, void 0, function () {
            var error_56;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (id && !session._id) {
                            session._id = id;
                        }
                        if (!session) return [3 /*break*/, 2];
                        session.endingDate = new Date();
                        //Code to test by murtaza
                        if (session.idlePeriod && session.idlePeriod.length && session.idlePeriod[0].endTime == null) {
                            session.idlePeriod[0].endTime = session.endingDate;
                        }
                        return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendMessage({ action: 'agentSessionEnded', session: session }, constants_1.ARCHIVINGQUEUE)];
                    case 1: 
                    //Code to test end by murtaza
                    return [2 /*return*/, _a.sent()];
                    case 2: return [2 /*return*/, undefined];
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        error_56 = _a.sent();
                        console.log('Error in Inserting Agent Session Worker');
                        console.log(error_56);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    VisitorTimeoutWorker.prototype.ArchiveVisitorSession = function (session, id) {
        return __awaiter(this, void 0, void 0, function () {
            var error_57;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (id && !session._id) {
                            session._id = id;
                        }
                        session.endingDate = new Date();
                        return [4 /*yield*/, this.UpdateVisitorSessionByDeviceID(session.deviceID, (session._id) ? session._id.toString() : session.id)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.InsertLeftVisitor(session.nsp, session)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendMessage({ action: 'visitorSessionEnded', session: session }, constants_1.AnalytcisNewQueue)];
                    case 3: 
                    //return await this.collection.insertOne(session);
                    return [2 /*return*/, _a.sent()];
                    case 4:
                        error_57 = _a.sent();
                        console.log('error in Inserting Visitor Session Worker');
                        console.log(error_57);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    VisitorTimeoutWorker.prototype.UpdateVisitorSessionByDeviceID = function (userDeviceID, sessionid) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    return [2 /*return*/, this.VisitorCollection.findOneAndUpdate({
                            deviceID: userDeviceID,
                        }, {
                            $addToSet: { sessions: sessionid }
                        }, { returnOriginal: false, upsert: false, })];
                }
                catch (error) {
                    console.log('Error in Updating Sessions Worker');
                    console.log(error);
                }
                return [2 /*return*/];
            });
        });
    };
    VisitorTimeoutWorker.prototype.InsertLeftVisitor = function (nsp, session) {
        return __awaiter(this, void 0, void 0, function () {
            var updated, error_58;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.LeftVisitorCollection.findOneAndUpdate({ nsp: nsp }, {
                                $push: { "session": { $each: [session], $slice: -30 } },
                            }, { returnOriginal: false, upsert: true })
                            // let inserted = await this.leftVisitor.insertOne({ nsp: nsp, sessions: [session] });
                        ];
                    case 1:
                        updated = _a.sent();
                        // let inserted = await this.leftVisitor.insertOne({ nsp: nsp, sessions: [session] });
                        return [2 /*return*/, updated];
                    case 2:
                        error_58 = _a.sent();
                        console.log(error_58);
                        console.log('error in inserting LeftVisitor Worker');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    //#endregion
    VisitorTimeoutWorker.prototype.IgnoreNameSpace = function (nsp) {
        switch (nsp.toLowerCase()) {
            case '/':
            case '/emailservice':
                return true;
            default:
                if (nsp.indexOf('.') != -1)
                    return false;
                else
                    return false;
        }
    };
    VisitorTimeoutWorker.prototype.CheckInactiveVisitorsNonChatting = function () {
        return __awaiter(this, void 0, void 0, function () {
            var companies, i, expiryDate, InactiveSessions, promises, event, updateSession, j, _a, updatedconversation, insertedMessage, error_59;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.GetCompanies()];
                    case 1:
                        companies = _b.sent();
                        if (!(companies && companies.length)) return [3 /*break*/, 26];
                        i = 0;
                        _b.label = 2;
                    case 2:
                        if (!(i < companies.length)) return [3 /*break*/, 26];
                        // console.log('Companies : ', companies[i].name);
                        if (this.IgnoreNameSpace(companies[i].name))
                            return [3 /*break*/, 25];
                        expiryDate = new Date();
                        expiryDate.setMinutes(expiryDate.getMinutes() + companies[i]['settings']['chatSettings']['inactivityTimeouts']['endSessionTimeout']);
                        return [4 /*yield*/, this.GetAllInactiveVisitors(companies[i].name, companies[i]['settings']['chatSettings']['inactivityTimeouts']['inactiveTimeout'], false)];
                    case 3:
                        InactiveSessions = _b.sent();
                        promises = void 0;
                        event = '';
                        updateSession = undefined;
                        j = 0;
                        _b.label = 4;
                    case 4:
                        if (!(j < InactiveSessions.length)) return [3 /*break*/, 25];
                        _b.label = 5;
                    case 5:
                        _b.trys.push([5, 23, , 24]);
                        InactiveSessions[j].inactive = true;
                        InactiveSessions[j].expiry = expiryDate.toISOString();
                        _a = InactiveSessions[j].state;
                        switch (_a) {
                            case 1: return [3 /*break*/, 6];
                            case 5: return [3 /*break*/, 6];
                            case 8: return [3 /*break*/, 6];
                            case 4: return [3 /*break*/, 11];
                        }
                        return [3 /*break*/, 21];
                    case 6: return [4 /*yield*/, this.SetVisitorsInactvieNonChatting(InactiveSessions[j]._id || InactiveSessions[j].id, { expiry: expiryDate.toISOString(), lastTouchedTime: InactiveSessions[j].lastTouchedTime })];
                    case 7:
                        //chatEvent = 'Marked Inactive from' + ((session.state == 5) ? 'Invited' : 'Browsing') + 'state';
                        updateSession = _b.sent();
                        if (!(updateSession && updateSession.value)) return [3 /*break*/, 10];
                        return [4 /*yield*/, Promise.all([
                                __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: updateSession.value.nsp, roomName: [this.NotifyAllAgents()], data: { id: updateSession.value._id, session: updateSession.value } }),
                                aws_sqs_1.__biZZC_SQS.SendEventLog(enums_1.EventLogMessages.VISITOR_MARKED_INACTIVE_FROM_BROWSING, updateSession.value._id)
                            ])];
                    case 8:
                        promises = _b.sent();
                        return [4 /*yield*/, promises];
                    case 9:
                        _b.sent();
                        _b.label = 10;
                    case 10: return [3 /*break*/, 22];
                    case 11: return [4 /*yield*/, this.SetVisitorsInactvieNonChatting(InactiveSessions[j]._id || InactiveSessions[j].id, { expiry: expiryDate.toISOString(), lastTouchedTime: InactiveSessions[j].lastTouchedTime })];
                    case 12:
                        updateSession = _b.sent();
                        if (!(updateSession && updateSession.value)) return [3 /*break*/, 20];
                        this.UnsetChatFromAgent(InactiveSessions[j]);
                        event = enums_1.ComposedENUM(enums_1.DynamicEventLogs.VISITOR_INVITED_INACTIVE, { newEmail: '', oldEmail: '', name: InactiveSessions[j].agent.name });
                        return [4 /*yield*/, Promise.all([
                                aws_sqs_1.__biZZC_SQS.SendEventLog(event, InactiveSessions[j]._id),
                                this.MakeInactive(InactiveSessions[j].conversationID)
                            ])];
                    case 13:
                        promises = _b.sent();
                        updatedconversation = promises[1];
                        return [4 /*yield*/, this.CreateLogMessage({
                                from: InactiveSessions[j].agent.name,
                                to: (InactiveSessions[j].username) ? InactiveSessions[j].agent.name || InactiveSessions[j].agent.nickname : '',
                                body: event,
                                type: 'Events',
                                cid: (InactiveSessions[j].conversationID) ? InactiveSessions[j].conversationID : '',
                                attachment: false,
                                date: new Date().toISOString(),
                                delivered: true,
                                sent: true
                            })];
                    case 14:
                        insertedMessage = _b.sent();
                        if (!insertedMessage) return [3 /*break*/, 16];
                        return [4 /*yield*/, __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'V', broadcast: false, eventName: 'privateMessage', nsp: updateSession.value.nsp, roomName: [this.NotifyVisitorSingle(updateSession.value)], data: insertedMessage })];
                    case 15:
                        _b.sent();
                        _b.label = 16;
                    case 16:
                        if (!updatedconversation) return [3 /*break*/, 18];
                        return [4 /*yield*/, __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'removeConversation', nsp: updateSession.value.nsp, roomName: [this.NotifySingleAgent(updateSession.value)], data: { conversation: updatedconversation.value } })];
                    case 17:
                        _b.sent();
                        _b.label = 18;
                    case 18: return [4 /*yield*/, __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: updateSession.value.nsp, roomName: [this.NotifyAllAgents()], data: { id: updateSession.value.id || updateSession.value._id, session: updateSession.value } })];
                    case 19:
                        _b.sent();
                        _b.label = 20;
                    case 20: 
                    //#endregion
                    return [3 /*break*/, 22];
                    case 21: return [3 /*break*/, 22];
                    case 22: return [3 /*break*/, 24];
                    case 23:
                        error_59 = _b.sent();
                        console.log(error_59);
                        console.log('Error in Checking Inactive Visitors');
                        return [3 /*break*/, 24];
                    case 24:
                        j++;
                        return [3 /*break*/, 4];
                    case 25:
                        i++;
                        return [3 /*break*/, 2];
                    case 26: return [2 /*return*/];
                }
            });
        });
    };
    VisitorTimeoutWorker.prototype.CheckInactiveVisitorsChatting = function () {
        return __awaiter(this, void 0, void 0, function () {
            var companies, i, expiryDate, InactiveSessions, promises, event, updateSession, j, conversation, promises_2, logEvent, event_1, chatEvent, inactivityDate, updateSession_1, date, _a, _b, _c, _d, insertedMessage, promises_3, logEvent_1, event_2, chatEvent_1, inactivityDate_1, updateSession_2, date_1, updatedconversation, insertedMessage, _e, insertedMessage, updatedconversation, insertedMessage, error_60, error_61;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _f.trys.push([0, 51, , 52]);
                        return [4 /*yield*/, this.GetCompanies()];
                    case 1:
                        companies = _f.sent();
                        if (!(companies && companies.length)) return [3 /*break*/, 50];
                        i = 0;
                        _f.label = 2;
                    case 2:
                        if (!(i < companies.length)) return [3 /*break*/, 50];
                        if (this.IgnoreNameSpace(companies[i].name))
                            return [3 /*break*/, 49];
                        expiryDate = new Date();
                        expiryDate.setMinutes(expiryDate.getMinutes() + companies[i]['settings']['chatSettings']['inactivityTimeouts']['endSessionTimeout']);
                        return [4 /*yield*/, this.GetAllInactiveVisitors(companies[i].name, companies[i]['settings']['chatSettings']['inactivityTimeouts']['inactiveTimeout'], true)];
                    case 3:
                        InactiveSessions = _f.sent();
                        promises = void 0;
                        event = '';
                        updateSession = undefined;
                        j = 0;
                        _f.label = 4;
                    case 4:
                        if (!(j < InactiveSessions.length)) return [3 /*break*/, 49];
                        _f.label = 5;
                    case 5:
                        _f.trys.push([5, 47, , 48]);
                        return [4 /*yield*/, this.getInactiveChat(InactiveSessions[j].conversationID, companies[i]['settings']['chatSettings']['inactivityTimeouts']['inactiveTimeout'], true)];
                    case 6:
                        conversation = _f.sent();
                        promises_2 = void 0;
                        InactiveSessions[j].inactive = true;
                        InactiveSessions[j].expiry = expiryDate.toISOString();
                        logEvent = undefined;
                        event_1 = '';
                        chatEvent = '';
                        inactivityDate = new Date();
                        inactivityDate.setMinutes(inactivityDate.getMinutes() - companies[i]['settings']['chatSettings']['inactivityTimeouts']['inactiveTimeout']);
                        updateSession_1 = undefined;
                        date = new Date();
                        date.setMinutes(date.getMinutes() + companies[i]['settings']['chatSettings']['inactivityTimeouts']['endSessionTimeout']);
                        if (!(conversation && conversation.length && conversation[0].lastMessage)) return [3 /*break*/, 28];
                        _a = InactiveSessions[j].state;
                        switch (_a) {
                            case 2: return [3 /*break*/, 7];
                            case 3: return [3 /*break*/, 16];
                        }
                        return [3 /*break*/, 27];
                    case 7:
                        if (!(conversation[0].createdOn > inactivityDate.toISOString() && InactiveSessions[j].lastTouchedTime > inactivityDate.toISOString())) return [3 /*break*/, 8];
                        return [3 /*break*/, 48];
                    case 8:
                        if (!(conversation[0].lastMessage.date < inactivityDate.toISOString())) return [3 /*break*/, 15];
                        chatEvent = 'Marked Inactive in Unassigned State';
                        updateSession_1 = this.SetVisitorsInactvieChatting(InactiveSessions[j]._id, { lastTouchedTime: InactiveSessions[j].lastTouchedTime, expiry: expiryDate.toISOString() });
                        if (!(updateSession_1 && updateSession_1.value)) return [3 /*break*/, 15];
                        _c = (_b = Promise).all;
                        _d = [aws_sqs_1.__biZZC_SQS.SendEventLog(enums_1.EventLogMessages.VISITOR_INACTIVE_FROM_QUEUE, InactiveSessions[j]._id)];
                        return [4 /*yield*/, this.MakeInactive(InactiveSessions[j].conversationID)];
                    case 9: return [4 /*yield*/, _c.apply(_b, [_d.concat([
                                _f.sent()
                            ])])];
                    case 10:
                        promises_2 = _f.sent();
                        return [4 /*yield*/, this.CreateLogMessage({
                                from: (InactiveSessions[j].agent.name) ? InactiveSessions[j].agent.name : '',
                                to: (InactiveSessions[j].username) ? InactiveSessions[j].username : '',
                                body: chatEvent,
                                type: 'Events',
                                cid: (InactiveSessions[j].conversationID) ? InactiveSessions[j].conversationID : '',
                                attachment: false,
                                date: new Date().toISOString(),
                                delivered: true,
                                sent: true
                            })];
                    case 11:
                        insertedMessage = _f.sent();
                        console.log('inactive event message');
                        if (!insertedMessage) return [3 /*break*/, 13];
                        return [4 /*yield*/, __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'V', broadcast: false, eventName: 'privateMessage', nsp: InactiveSessions[j].nsp, roomName: [this.NotifyVisitorSingle(updateSession_1.value)], data: insertedMessage })];
                    case 12:
                        _f.sent();
                        _f.label = 13;
                    case 13: return [4 /*yield*/, __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: InactiveSessions[j].nsp, roomName: [this.NotifyAllAgents()], data: { id: InactiveSessions[j]._id, session: updateSession_1.value } })];
                    case 14:
                        _f.sent();
                        _f.label = 15;
                    case 15: return [3 /*break*/, 27];
                    case 16:
                        if (!(((conversation[0].lastMessage.type == 'Agents') && (conversation[0].lastMessage.date < inactivityDate.toISOString()))
                            || ((conversation[0].lastMessage.type == 'Visitors' && conversation[0].lastMessage.date < inactivityDate.toISOString()) && conversation[0].createdOn < inactivityDate.toISOString()))) return [3 /*break*/, 26];
                        promises_3 = void 0;
                        InactiveSessions[j].inactive = true;
                        InactiveSessions[j].expiry = expiryDate.toISOString();
                        logEvent_1 = undefined;
                        event_2 = '';
                        chatEvent_1 = '';
                        inactivityDate_1 = new Date();
                        inactivityDate_1.setMinutes(inactivityDate_1.getMinutes() - companies[i]['settings']['chatSettings']['inactivityTimeouts']['inactiveTimeout']);
                        updateSession_2 = undefined;
                        date_1 = new Date();
                        date_1.setMinutes(date_1.getMinutes() + companies[i]['settings']['chatSettings']['inactivityTimeouts']['endSessionTimeout']);
                        event_2 = enums_1.ComposedENUM(enums_1.DynamicEventLogs.VISITOR_CHATTING_INACTIVE, { newEmail: '', oldEmail: '', name: InactiveSessions[j].agent.name });
                        return [4 /*yield*/, this.SetVisitorsInactvieChatting(InactiveSessions[j]._id, { lastTouchedTime: InactiveSessions[j].lastTouchedTime, expiry: expiryDate.toISOString() })];
                    case 17:
                        updateSession_2 = _f.sent();
                        if (!(updateSession_2 && updateSession_2.value)) return [3 /*break*/, 26];
                        return [4 /*yield*/, Promise.all([
                                aws_sqs_1.__biZZC_SQS.SendEventLog(event_2, InactiveSessions[j]._id),
                                this.MakeInactive(InactiveSessions[j].conversationID),
                                this.UnsetChatFromAgent(InactiveSessions[j])
                            ])];
                    case 18:
                        promises_3 = _f.sent();
                        return [4 /*yield*/, promises_3[0]];
                    case 19:
                        logEvent_1 = _f.sent();
                        return [4 /*yield*/, promises_3[1]];
                    case 20:
                        updatedconversation = _f.sent();
                        insertedMessage = void 0;
                        return [4 /*yield*/, this.CreateLogMessage({
                                from: InactiveSessions[j].agent.name,
                                to: (InactiveSessions[j].username) ? InactiveSessions[j].username : '',
                                body: event_2,
                                type: 'Events',
                                cid: (InactiveSessions[j].conversationID) ? InactiveSessions[j].conversationID : '',
                                attachment: false,
                                date: new Date().toISOString(),
                                delivered: true,
                                sent: true
                            })
                            // if (insertedMessage) SocketServer.of(nsp).to(Visitor.NotifyOne(session)).emit('privateMessage', insertedMessage)
                            // SocketServer.of(nsp).to(Agents.NotifyAll()).emit('updateUser', { id: session.id || session._id, session: session });
                        ];
                    case 21:
                        /**
                         * Move Logic To server-side
                         */
                        // socket.to(Visitor.NotifyOne(sender)).emit('privateMessage', messageinsertedID.ops[0]);
                        insertedMessage = _f.sent();
                        // if (insertedMessage) SocketServer.of(nsp).to(Visitor.NotifyOne(session)).emit('privateMessage', insertedMessage)
                        // SocketServer.of(nsp).to(Agents.NotifyAll()).emit('updateUser', { id: session.id || session._id, session: session });
                        console.log('inactive event message');
                        if (!insertedMessage) return [3 /*break*/, 23];
                        return [4 /*yield*/, __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'V', broadcast: false, eventName: 'privateMessage', nsp: updateSession_2.value.nsp, roomName: [this.NotifyVisitorSingle(updateSession_2.value)], data: insertedMessage })];
                    case 22:
                        _f.sent();
                        _f.label = 23;
                    case 23: return [4 /*yield*/, __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: updateSession_2.value.nsp, roomName: [this.NotifyAllAgents()], data: { id: updateSession_2.value._id, session: updateSession_2.value } })];
                    case 24:
                        _f.sent();
                        if (!(updatedconversation && updatedconversation.value)) return [3 /*break*/, 26];
                        return [4 /*yield*/, __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'makeConversationInactive', nsp: updateSession_2.value.nsp, roomName: [this.NotifySingleAgent(updateSession_2.value)], data: { conversation: updatedconversation.value, status: (insertedMessage) ? insertedMessage : '' } })];
                    case 25:
                        _f.sent();
                        _f.label = 26;
                    case 26: return [3 /*break*/, 27];
                    case 27: return [3 /*break*/, 46];
                    case 28:
                        if (!(conversation && conversation.length && conversation[0].createdOn < inactivityDate.toISOString())) return [3 /*break*/, 46];
                        _e = InactiveSessions[j].state;
                        switch (_e) {
                            case 2: return [3 /*break*/, 29];
                            case 3: return [3 /*break*/, 37];
                        }
                        return [3 /*break*/, 46];
                    case 29:
                        /**
                             * @Note :
                             * Inactive Propositions
                             * 1. IF Last Touched time + N(mins) < Current Time And No Conversation Message
                             * 2. IF Last Touched Time + N(mins) < Current Time  And Lastmessage timestamp + N(mins) < Current Time
                             * @Action Move To Inactive
                        */
                        InactiveSessions[j].inactive = true;
                        InactiveSessions[j].expiry = date.toISOString();
                        event_1 = 'Visitor Went Inactive from Unassigned chat.';
                        chatEvent = 'Marked Inactive in Unassigned State';
                        return [4 /*yield*/, this.SetVisitorsInactvieChatting(InactiveSessions[j]._id, { lastTouchedTime: InactiveSessions[j].lastTouchedTime, expiry: expiryDate.toISOString() })];
                    case 30:
                        updateSession_1 = _f.sent();
                        if (!(updateSession_1 && updateSession_1.value)) return [3 /*break*/, 36];
                        return [4 /*yield*/, Promise.all([
                                aws_sqs_1.__biZZC_SQS.SendEventLog(enums_1.EventLogMessages.VISITOR_INACTIVE_FROM_QUEUE, InactiveSessions[j]._id),
                                this.MakeInactive(InactiveSessions[j].conversationID)
                            ])];
                    case 31:
                        promises_2 = _f.sent();
                        logEvent = promises_2[0];
                        return [4 /*yield*/, this.CreateLogMessage({
                                from: InactiveSessions[j].agent.name,
                                to: InactiveSessions[j].username,
                                body: event_1,
                                type: 'Events',
                                cid: (InactiveSessions[j].conversationID) ? InactiveSessions[j].conversationID : '',
                                attachment: false,
                                date: new Date().toISOString(),
                                delivered: true,
                                sent: true
                            })
                            // SocketServer.of(nsp).to(Visitor.NotifyOne(session)).emit('visitorInactive', { session: session })
                            // SocketServer.of(nsp).to(Visitor.NotifyOne(session)).emit('inactiveVisitorState', { state: session.state, inactive: true, event: chatEvent })
                            // if (insertedMessage) SocketServer.of(nsp).to(Visitor.NotifyOne(session)).emit('privateMessage', insertedMessage)
                            // SocketServer.of(nsp).to(Agents.NotifyAll()).emit('updateUser', { id: session.id || session._id, session: session });
                        ];
                    case 32:
                        insertedMessage = _f.sent();
                        if (!insertedMessage) return [3 /*break*/, 34];
                        return [4 /*yield*/, __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'V', broadcast: false, eventName: 'privateMessage', nsp: updateSession_1.value.nsp, roomName: [this.NotifyVisitorSingle(updateSession_1.value)], data: insertedMessage })];
                    case 33:
                        _f.sent();
                        _f.label = 34;
                    case 34: return [4 /*yield*/, __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: updateSession_1.value.nsp, roomName: [this.NotifyAllAgents()], data: { id: updateSession_1.value.id || updateSession_1.value._id, session: updateSession_1.value } })];
                    case 35:
                        _f.sent();
                        _f.label = 36;
                    case 36: return [3 /*break*/, 46];
                    case 37:
                        /**
                         * @Note :
                         * Inactive Propositions
                         * 1. IF Last Touched time + N(mins) < Current Time And No Conversation Message
                         * 2. IF Last Touched Time + N(mins) < Current Time And Last Mesage Sent By Agent  And Lastmessage timestamp + N(mins) < Current Time
                         * @Action Move To Inactive
                         */
                        InactiveSessions[j].inactive = true;
                        InactiveSessions[j].expiry = date.toISOString();
                        event_1 = enums_1.ComposedENUM(enums_1.DynamicEventLogs.VISITOR_CHATTING_INACTIVE, { oldEmail: '', newEmail: '', name: InactiveSessions[j].agent.name });
                        return [4 /*yield*/, this.SetVisitorsInactvieChatting(InactiveSessions[j]._id, { lastTouchedTime: InactiveSessions[j].lastTouchedTime, expiry: expiryDate.toISOString() })];
                    case 38:
                        updateSession_1 = _f.sent();
                        if (!(updateSession_1 && updateSession_1.value)) return [3 /*break*/, 45];
                        return [4 /*yield*/, Promise.all([
                                aws_sqs_1.__biZZC_SQS.SendEventLog(event_1, InactiveSessions[j]._id || InactiveSessions[j].id),
                                this.MakeInactive(InactiveSessions[j].conversationID),
                                this.UnsetChatFromAgent(InactiveSessions[j])
                            ])];
                    case 39:
                        promises_2 = _f.sent();
                        logEvent = promises_2[0];
                        updatedconversation = promises_2[1];
                        insertedMessage = void 0;
                        return [4 /*yield*/, this.CreateLogMessage({
                                from: InactiveSessions[j].agent.name,
                                to: (InactiveSessions[j].username) ? InactiveSessions[j].username : '',
                                body: event_1,
                                type: 'Events',
                                cid: (InactiveSessions[j].conversationID) ? InactiveSessions[j].conversationID : '',
                                attachment: false,
                                date: new Date().toISOString(),
                                delivered: true,
                                sent: true
                            })
                            // if (insertedMessage) SocketServer.of(nsp).to(Visitor.NotifyOne(session)).emit('privateMessage', insertedMessage);
                            // SocketServer.of(nsp).to(Agents.NotifyAll()).emit('updateUser', { id: session.id || session._id, session: session });
                        ];
                    case 40:
                        /**
                         * Move Logic To server-side
                         */
                        // socket.to(Visitor.NotifyOne(sender)).emit('privateMessage', messageinsertedID.ops[0]);
                        insertedMessage = _f.sent();
                        // if (insertedMessage) SocketServer.of(nsp).to(Visitor.NotifyOne(session)).emit('privateMessage', insertedMessage);
                        // SocketServer.of(nsp).to(Agents.NotifyAll()).emit('updateUser', { id: session.id || session._id, session: session });
                        console.log('inactive event message');
                        if (!insertedMessage) return [3 /*break*/, 42];
                        return [4 /*yield*/, __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'V', broadcast: false, eventName: 'privateMessage', nsp: updateSession_1.value.nsp, roomName: [this.NotifyVisitorSingle(updateSession_1.value)], data: insertedMessage })];
                    case 41:
                        _f.sent();
                        _f.label = 42;
                    case 42: return [4 /*yield*/, __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: updateSession_1.value.nsp, roomName: [this.NotifyAllAgents()], data: { id: updateSession_1.value._id, session: updateSession_1.value } })];
                    case 43:
                        _f.sent();
                        if (!updatedconversation) return [3 /*break*/, 45];
                        return [4 /*yield*/, __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'makeConversationInactive', nsp: updateSession_1.value.nsp, roomName: [this.NotifySingleAgent(updateSession_1.value)], data: { conversation: updatedconversation.value, status: (insertedMessage) ? insertedMessage : '' } })];
                    case 44:
                        _f.sent();
                        _f.label = 45;
                    case 45: return [3 /*break*/, 46];
                    case 46: return [3 /*break*/, 48];
                    case 47:
                        error_60 = _f.sent();
                        console.log(error_60);
                        console.log('Error in Checking Inactive Visitors Worker Loop');
                        return [3 /*break*/, 48];
                    case 48:
                        j++;
                        return [3 /*break*/, 4];
                    case 49:
                        i++;
                        return [3 /*break*/, 2];
                    case 50: return [3 /*break*/, 52];
                    case 51:
                        error_61 = _f.sent();
                        console.log(error_61);
                        console.log('error in Checking Visitors Inactive Worker');
                        return [3 /*break*/, 52];
                    case 52: return [2 /*return*/];
                }
            });
        });
    };
    VisitorTimeoutWorker.prototype.Reactivate = function () {
        return __awaiter(this, void 0, void 0, function () {
            var companies, i, ActiveSessions, j, renewedSession, error_62, error_63;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 13, , 14]);
                        return [4 /*yield*/, this.GetCompanies()];
                    case 1:
                        companies = _a.sent();
                        if (!(companies && companies.length)) return [3 /*break*/, 12];
                        i = 0;
                        _a.label = 2;
                    case 2:
                        if (!(i < companies.length)) return [3 /*break*/, 12];
                        if (this.IgnoreNameSpace(companies[i].name))
                            return [3 /*break*/, 11];
                        return [4 /*yield*/, this.GetSessionforReActivation(companies[i].name)];
                    case 3:
                        ActiveSessions = _a.sent();
                        j = 0;
                        _a.label = 4;
                    case 4:
                        if (!(j < ActiveSessions.length)) return [3 /*break*/, 11];
                        _a.label = 5;
                    case 5:
                        _a.trys.push([5, 9, , 10]);
                        return [4 /*yield*/, this.MarkReactivate(ActiveSessions[j]._id)];
                    case 6:
                        renewedSession = _a.sent();
                        if (!renewedSession) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.MakeActive(renewedSession, companies[i])];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        error_62 = _a.sent();
                        console.log(error_62);
                        console.log('Error in Checking Inactive Visitors Worker Loop');
                        return [3 /*break*/, 10];
                    case 10:
                        j++;
                        return [3 /*break*/, 4];
                    case 11:
                        i++;
                        return [3 /*break*/, 2];
                    case 12: return [3 /*break*/, 14];
                    case 13:
                        error_63 = _a.sent();
                        console.log(error_63);
                        console.log('error in Reactivating in Worker');
                        return [3 /*break*/, 14];
                    case 14: return [2 /*return*/];
                }
            });
        });
    };
    VisitorTimeoutWorker.prototype.DeleteInactiveVisitors = function () {
        return __awaiter(this, void 0, void 0, function () {
            var companies, i, ExpirtedSession, j, endedConversation, deleted, _a, data, _b, insertedMessage, packet, error_64;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 39, , 40]);
                        return [4 /*yield*/, this.GetCompanies()];
                    case 1:
                        companies = _c.sent();
                        if (!companies) return [3 /*break*/, 38];
                        i = 0;
                        _c.label = 2;
                    case 2:
                        if (!(i < companies.length)) return [3 /*break*/, 38];
                        if (this.IgnoreNameSpace(companies[i].name))
                            return [2 /*return*/];
                        return [4 /*yield*/, this.GetALLExpiredSessions(companies[i].name, 'Visitors')];
                    case 3:
                        ExpirtedSession = _c.sent();
                        j = 0;
                        _c.label = 4;
                    case 4:
                        if (!(j < ExpirtedSession.length)) return [3 /*break*/, 37];
                        endedConversation = undefined;
                        deleted = false;
                        _a = ExpirtedSession[j].state;
                        switch (_a) {
                            case 1: return [3 /*break*/, 5];
                            case 5: return [3 /*break*/, 5];
                            case 2: return [3 /*break*/, 9];
                            case 3: return [3 /*break*/, 9];
                            case 4: return [3 /*break*/, 9];
                            case 8: return [3 /*break*/, 9];
                        }
                        return [3 /*break*/, 30];
                    case 5: return [4 /*yield*/, this.RemoveSession(ExpirtedSession[j], false)];
                    case 6:
                        deleted = _c.sent();
                        if (!deleted) return [3 /*break*/, 8];
                        return [4 /*yield*/, __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'removeUser', nsp: ExpirtedSession[j].nsp, roomName: [this.NotifyAllAgents()], data: ExpirtedSession[j]._id })];
                    case 7:
                        _c.sent();
                        _c.label = 8;
                    case 8: return [3 /*break*/, 34];
                    case 9: return [4 /*yield*/, this.GetSessionForChat((ExpirtedSession[j]._id || ExpirtedSession[j].id))];
                    case 10:
                        data = _c.sent();
                        if (!data) return [3 /*break*/, 12];
                        return [4 /*yield*/, this.RemoveSession(ExpirtedSession[j], false)];
                    case 11:
                        deleted = _c.sent();
                        _c.label = 12;
                    case 12:
                        if (!deleted) return [3 /*break*/, 29];
                        if (!(ExpirtedSession[j].state == 2)) return [3 /*break*/, 14];
                        return [4 /*yield*/, this.EndChatMissed(ExpirtedSession[j].conversationID, (data) ? data : '')];
                    case 13:
                        _b = _c.sent();
                        return [3 /*break*/, 16];
                    case 14: return [4 /*yield*/, this.EndChat(ExpirtedSession[j].conversationID, true, (data) ? data : '')];
                    case 15:
                        _b = _c.sent();
                        _c.label = 16;
                    case 16:
                        endedConversation = _b;
                        if (!(endedConversation && endedConversation.value)) return [3 /*break*/, 25];
                        return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendMessage({ action: 'startConversation', conversation: endedConversation.value }, constants_1.ARCHIVINGQUEUE)];
                    case 17:
                        _c.sent();
                        return [4 /*yield*/, this.CreateLogMessage({
                                from: ExpirtedSession[j].agent.name,
                                to: (ExpirtedSession[j].username) ? ExpirtedSession[j].username : '',
                                body: 'Chat ended due to inactivity',
                                type: 'Events',
                                cid: (ExpirtedSession[j].conversationID) ? ExpirtedSession[j].conversationID : '',
                                attachment: false,
                                date: new Date().toISOString(),
                                delivered: true,
                                sent: true
                            })];
                    case 18:
                        insertedMessage = _c.sent();
                        return [4 /*yield*/, __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'stopConversation', nsp: ExpirtedSession[j].nsp, roomName: [this.NotifySingleAgent(ExpirtedSession[j])], data: { conversation: endedConversation.value } })];
                    case 19:
                        _c.sent();
                        if (!(endedConversation && endedConversation.value && endedConversation.value.superviserAgents && endedConversation.value.superviserAgents.length)) return [3 /*break*/, 21];
                        return [4 /*yield*/, __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'removeConversation', nsp: ExpirtedSession[j].nsp, roomName: endedConversation.value.superviserAgents, data: { conversation: (endedConversation && endedConversation.value) ? endedConversation.value : '' } })];
                    case 20:
                        _c.sent();
                        _c.label = 21;
                    case 21:
                        if (!insertedMessage) return [3 /*break*/, 23];
                        return [4 /*yield*/, __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'privateMessage', nsp: ExpirtedSession[j].nsp, roomName: [this.NotifySingleAgent(ExpirtedSession[j])], data: insertedMessage })];
                    case 22:
                        _c.sent();
                        _c.label = 23;
                    case 23: return [4 /*yield*/, __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'Admin', broadcast: false, eventName: 'removeUnassignedConvo', nsp: ExpirtedSession[j].nsp, roomName: [], data: { conversation: endedConversation.value } })];
                    case 24:
                        _c.sent();
                        _c.label = 25;
                    case 25: return [4 /*yield*/, __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'removeUser', nsp: ExpirtedSession[j].nsp, roomName: [this.NotifyAllAgents()], data: ExpirtedSession[j]._id })];
                    case 26:
                        _c.sent();
                        return [4 /*yield*/, __BIZZC_REDIS.SetID(ExpirtedSession[j]._id, 5)];
                    case 27:
                        _c.sent();
                        packet = {
                            action: 'endConversation',
                            cid: ExpirtedSession[j].conversationID
                        };
                        return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendMessage(packet, constants_1.ARCHIVINGQUEUE)];
                    case 28:
                        _c.sent();
                        _c.label = 29;
                    case 29: return [3 /*break*/, 34];
                    case 30: return [4 /*yield*/, this.RemoveSession(ExpirtedSession[j], false)];
                    case 31:
                        deleted = _c.sent();
                        if (!deleted) return [3 /*break*/, 33];
                        return [4 /*yield*/, __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'removeUser', nsp: ExpirtedSession[j].nsp, roomName: [this.NotifyAllAgents()], data: ExpirtedSession[j].id })];
                    case 32:
                        _c.sent();
                        _c.label = 33;
                    case 33: return [3 /*break*/, 34];
                    case 34:
                        if (!deleted) return [3 /*break*/, 36];
                        return [4 /*yield*/, __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'disconnect', data: ExpirtedSession[j] })];
                    case 35:
                        _c.sent();
                        _c.label = 36;
                    case 36:
                        j++;
                        return [3 /*break*/, 4];
                    case 37:
                        i++;
                        return [3 /*break*/, 2];
                    case 38: return [3 /*break*/, 40];
                    case 39:
                        error_64 = _c.sent();
                        console.log(error_64);
                        console.log('Error in Deleting Visitors Worker');
                        return [3 /*break*/, 40];
                    case 40: return [2 /*return*/];
                }
            });
        });
    };
    VisitorTimeoutWorker.prototype.DeleteInactiveAgents = function () {
        return __awaiter(this, void 0, void 0, function () {
            var companies, i, ExpiredSession, j, deleted, ConnectedVisitors, allAgents, k, pendingVisitor, queEvent, conversation, logEvent, pendingVisitor, UpdatedSessions, newAgent, pendingVisitor_2, queEvent, conversation, logEvent, error_65, error_66;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 39, , 40]);
                        return [4 /*yield*/, this.GetCompanies()];
                    case 1:
                        companies = _a.sent();
                        if (!companies) return [3 /*break*/, 38];
                        i = 0;
                        _a.label = 2;
                    case 2:
                        if (!(i < companies.length)) return [3 /*break*/, 38];
                        if (this.IgnoreNameSpace(companies[i].name))
                            return [2 /*return*/];
                        return [4 /*yield*/, this.GetALLExpiredSessions(companies[i].name, 'Agents')];
                    case 3:
                        ExpiredSession = _a.sent();
                        j = 0;
                        _a.label = 4;
                    case 4:
                        if (!(j < ExpiredSession.length)) return [3 /*break*/, 37];
                        _a.label = 5;
                    case 5:
                        _a.trys.push([5, 35, , 36]);
                        deleted = false;
                        return [4 /*yield*/, this.RemoveSession(ExpiredSession[j], false)];
                    case 6:
                        deleted = _a.sent();
                        if (!deleted) return [3 /*break*/, 34];
                        return [4 /*yield*/, __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'disconnect', data: ExpiredSession[j] })
                            // SocketServer.of(nsp).to(Agents.NotifyAll()).emit('agentUnavailable', { email: agent.email, session: agent });
                        ];
                    case 7:
                        _a.sent();
                        // SocketServer.of(nsp).to(Agents.NotifyAll()).emit('agentUnavailable', { email: agent.email, session: agent });
                        return [4 /*yield*/, __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'agentUnavailable', nsp: ExpiredSession[j].nsp, roomName: [this.NotifyAllAgents()], data: { email: ExpiredSession[j].email, session: ExpiredSession[j] } })];
                    case 8:
                        // SocketServer.of(nsp).to(Agents.NotifyAll()).emit('agentUnavailable', { email: agent.email, session: agent });
                        _a.sent();
                        if (!ExpiredSession[j].permissions.chats.canChat) return [3 /*break*/, 10];
                        return [4 /*yield*/, __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'V', broadcast: true, eventName: 'agentUnavailable', nsp: ExpiredSession[j].nsp, roomName: [this.NotifyAllVisitors()], data: { id: ExpiredSession[j]._id } })];
                    case 9:
                        _a.sent();
                        _a.label = 10;
                    case 10:
                        ConnectedVisitors = Object.keys(ExpiredSession[j].rooms);
                        if (!!ConnectedVisitors.length) return [3 /*break*/, 11];
                        return [3 /*break*/, 36];
                    case 11: return [4 /*yield*/, this.GetAllActiveAgentsChatting(ExpiredSession[j])];
                    case 12:
                        allAgents = _a.sent();
                        k = 0;
                        _a.label = 13;
                    case 13:
                        if (!(k < ConnectedVisitors.length)) return [3 /*break*/, 34];
                        if (!!allAgents) return [3 /*break*/, 22];
                        return [4 /*yield*/, this.UnseAgentFromVisitor(ConnectedVisitors[k])];
                    case 14:
                        pendingVisitor = _a.sent();
                        if (!pendingVisitor) return [3 /*break*/, 21];
                        queEvent = enums_1.ComposedENUM(enums_1.DynamicEventLogs.VISITOR_UNASSIGNED, { newEmail: '', oldEmail: ExpiredSession[j].email });
                        // SocketServer.of(nsp).to(visitorID).emit('noAgent', { state: 2, agent: pendingVisitor.agent });
                        // SocketServer.of(nsp).to(Agents.NotifyAll()).emit('updateUser', { id: pendingVisitor.id, session: pendingVisitor });
                        return [4 /*yield*/, __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'V', broadcast: false, eventName: 'noAgent', nsp: ExpiredSession[j].nsp, roomName: [ConnectedVisitors[k]], data: { state: 2, agent: pendingVisitor.agent } })];
                    case 15:
                        // SocketServer.of(nsp).to(visitorID).emit('noAgent', { state: 2, agent: pendingVisitor.agent });
                        // SocketServer.of(nsp).to(Agents.NotifyAll()).emit('updateUser', { id: pendingVisitor.id, session: pendingVisitor });
                        _a.sent();
                        return [4 /*yield*/, __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: ExpiredSession[j].nsp, roomName: [this.NotifyAllAgents()], data: { id: pendingVisitor.id, session: pendingVisitor } })];
                    case 16:
                        _a.sent();
                        return [4 /*yield*/, this.UpdateConversationState(pendingVisitor.conversationID, 1, false)];
                    case 17:
                        conversation = _a.sent();
                        if (!(conversation && conversation.value)) return [3 /*break*/, 19];
                        return [4 /*yield*/, this.AddPenaltyTime(pendingVisitor.conversationID, conversation.value.agentEmail, (conversation.value.lastMessage) ? conversation.value.lastMessage.date : conversation.value.createdOn)];
                    case 18:
                        _a.sent();
                        _a.label = 19;
                    case 19: return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendEventLog(queEvent, (pendingVisitor._id) ? pendingVisitor._id : pendingVisitor.id)];
                    case 20:
                        logEvent = _a.sent();
                        _a.label = 21;
                    case 21: return [2 /*return*/];
                    case 22: return [4 /*yield*/, this.GetVisitorByID(ConnectedVisitors[k])];
                    case 23:
                        pendingVisitor = _a.sent();
                        if (!pendingVisitor)
                            return [3 /*break*/, 33];
                        return [4 /*yield*/, this.TransferChatOnChatDisconnect(pendingVisitor, ConnectedVisitors[k], ExpiredSession[j], ExpiredSession[j]._id)];
                    case 24:
                        UpdatedSessions = _a.sent();
                        newAgent = UpdatedSessions.agent;
                        pendingVisitor = UpdatedSessions.visitor;
                        if (!(UpdatedSessions && newAgent)) return [3 /*break*/, 25];
                        return [3 /*break*/, 33];
                    case 25: return [4 /*yield*/, this.UnseAgentFromVisitor(ConnectedVisitors[k])];
                    case 26:
                        pendingVisitor_2 = _a.sent();
                        if (!pendingVisitor_2) return [3 /*break*/, 33];
                        queEvent = enums_1.ComposedENUM(enums_1.DynamicEventLogs.VISITOR_UNASSIGNED, { newEmail: '', oldEmail: ExpiredSession[j].email });
                        // SocketServer.of(nsp).to(visitorID).emit('noAgent', { state: 2, agent: pendingVisitor.agent });
                        // SocketServer.of(nsp).to(Agents.NotifyAll()).emit('updateUser', { id: pendingVisitor.id, session: pendingVisitor });
                        return [4 /*yield*/, __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'V', broadcast: false, eventName: 'noAgent', nsp: ExpiredSession[j].nsp, roomName: [ConnectedVisitors[k]], data: { state: 2, agent: pendingVisitor_2.agent } })];
                    case 27:
                        // SocketServer.of(nsp).to(visitorID).emit('noAgent', { state: 2, agent: pendingVisitor.agent });
                        // SocketServer.of(nsp).to(Agents.NotifyAll()).emit('updateUser', { id: pendingVisitor.id, session: pendingVisitor });
                        _a.sent();
                        return [4 /*yield*/, __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: ExpiredSession[j].nsp, roomName: [this.NotifyAllAgents()], data: { id: pendingVisitor_2.id, session: pendingVisitor_2 } })];
                    case 28:
                        _a.sent();
                        return [4 /*yield*/, this.UpdateConversationState(pendingVisitor_2.conversationID, 1, false)];
                    case 29:
                        conversation = _a.sent();
                        if (!(conversation && conversation.value)) return [3 /*break*/, 31];
                        return [4 /*yield*/, this.AddPenaltyTime(pendingVisitor_2.conversationID, conversation.value.agentEmail, (conversation.value.lastMessage) ? conversation.value.lastMessage.date : conversation.value.createdOn)];
                    case 30:
                        _a.sent();
                        _a.label = 31;
                    case 31: return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendEventLog(queEvent, (pendingVisitor_2._id) ? pendingVisitor_2._id : pendingVisitor_2.id)];
                    case 32:
                        logEvent = _a.sent();
                        _a.label = 33;
                    case 33:
                        k++;
                        return [3 /*break*/, 13];
                    case 34: return [3 /*break*/, 36];
                    case 35:
                        error_65 = _a.sent();
                        console.log(error_65);
                        console.log('Error in Agent Delete Function Worker');
                        return [3 /*break*/, 36];
                    case 36:
                        j++;
                        return [3 /*break*/, 4];
                    case 37:
                        i++;
                        return [3 /*break*/, 2];
                    case 38: return [3 /*break*/, 40];
                    case 39:
                        error_66 = _a.sent();
                        console.log(error_66);
                        console.log('error in Deleting Inactive Agents Worker');
                        return [3 /*break*/, 40];
                    case 40: return [2 /*return*/];
                }
            });
        });
    };
    VisitorTimeoutWorker.prototype.IntervalAutomaticAssignment = function () {
        return __awaiter(this, void 0, void 0, function () {
            var companies, i, greetingMessage, chatOnInvitation, priorityAgent, Rules, k, AllVisitors, _a, j, j, pages, j, error_67;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 27, , 28]);
                        return [4 /*yield*/, this.GetCompanies()];
                    case 1:
                        companies = _b.sent();
                        if (!(companies && companies.length)) return [3 /*break*/, 26];
                        i = 0;
                        _b.label = 2;
                    case 2:
                        if (!(i < companies.length)) return [3 /*break*/, 26];
                        if (this.IgnoreNameSpace(companies[i].name))
                            return [3 /*break*/, 25];
                        if (!!companies[i]['settings']) return [3 /*break*/, 3];
                        return [3 /*break*/, 25];
                    case 3:
                        if (!!companies[i]['settings']['chatSettings']['assignments'].aEng) return [3 /*break*/, 4];
                        return [3 /*break*/, 25];
                    case 4:
                        greetingMessage = companies[i]['settings']['chatSettings']['greetingMessage'] || '';
                        chatOnInvitation = companies[i]['settings']['chatSettings']['permissions']['invitationChatInitiations'] || false;
                        priorityAgent = companies[i]['settings']['chatSettings']['assignments'].priorityAgent.trim() || '';
                        Rules = companies[i]['settings']['chatSettings']['assignments'].ruleSets || [];
                        if (!(Rules && Rules.length)) return [3 /*break*/, 25];
                        k = 0;
                        _b.label = 5;
                    case 5:
                        if (!(k < Rules.length)) return [3 /*break*/, 25];
                        AllVisitors = [];
                        _a = Rules[k].id;
                        switch (_a) {
                            case 'r_pages_visited': return [3 /*break*/, 6];
                            case 'r_activity_time': return [3 /*break*/, 12];
                            case 'r_particular_page': return [3 /*break*/, 18];
                        }
                        return [3 /*break*/, 24];
                    case 6:
                        if (!!isNaN(Rules[k].pagesVisited)) return [3 /*break*/, 11];
                        return [4 /*yield*/, this.GetVisitorsForInvitationByURLVisited(companies[i].name, Rules[k].pagesVisited)];
                    case 7:
                        AllVisitors = (_b.sent());
                        j = 0;
                        _b.label = 8;
                    case 8:
                        if (!(j < AllVisitors.length)) return [3 /*break*/, 11];
                        return [4 /*yield*/, this.AutomaticEngagement(AllVisitors[j], (companies[i]['settings']['chatSettings']['permissions']['invitationChatInitiations']) ? 4 : 5, chatOnInvitation, greetingMessage, priorityAgent)];
                    case 9:
                        _b.sent();
                        _b.label = 10;
                    case 10:
                        j++;
                        return [3 /*break*/, 8];
                    case 11: return [3 /*break*/, 24];
                    case 12:
                        if (!!isNaN(Rules[k].activityTime)) return [3 /*break*/, 17];
                        return [4 /*yield*/, this.GetVisitorsForInvitationByTimeSpent(companies[i].name, Rules[k].activityTime)];
                    case 13:
                        AllVisitors = (_b.sent());
                        j = 0;
                        _b.label = 14;
                    case 14:
                        if (!(j < AllVisitors.length)) return [3 /*break*/, 17];
                        return [4 /*yield*/, this.AutomaticEngagement(AllVisitors[j], (companies[i]['settings']['chatSettings']['permissions']['invitationChatInitiations']) ? 4 : 5, chatOnInvitation, greetingMessage, priorityAgent)];
                    case 15:
                        _b.sent();
                        _b.label = 16;
                    case 16:
                        j++;
                        return [3 /*break*/, 14];
                    case 17: return [3 /*break*/, 24];
                    case 18:
                        pages = (Rules[k].pageUrl && !Array.isArray(Rules[k].pageUrl)) ? [Rules[k].pageUrl] : Rules[k].pageUrl;
                        return [4 /*yield*/, this.GetVisitorsForInvitationByCurrentUrl(companies[i].name, pages)];
                    case 19:
                        AllVisitors = (_b.sent());
                        j = 0;
                        _b.label = 20;
                    case 20:
                        if (!(j < AllVisitors.length)) return [3 /*break*/, 23];
                        return [4 /*yield*/, this.AutomaticEngagement(AllVisitors[j], (companies[i]['settings']['chatSettings']['permissions']['invitationChatInitiations']) ? 4 : 5, chatOnInvitation, greetingMessage, priorityAgent)];
                    case 21:
                        _b.sent();
                        _b.label = 22;
                    case 22:
                        j++;
                        return [3 /*break*/, 20];
                    case 23: return [3 /*break*/, 24];
                    case 24:
                        k++;
                        return [3 /*break*/, 5];
                    case 25:
                        i++;
                        return [3 /*break*/, 2];
                    case 26: return [3 /*break*/, 28];
                    case 27:
                        error_67 = _b.sent();
                        console.log(error_67);
                        console.log('Error in INterval AutoAssignement Worker');
                        return [3 /*break*/, 28];
                    case 28: return [2 /*return*/];
                }
            });
        });
    };
    VisitorTimeoutWorker.prototype.AutomaticTransfer = function () {
        return __awaiter(this, void 0, void 0, function () {
            var companies, i, InactiveSessions, j, _a, logEvent, event, oldSession, updateSession, conversation, Conversationreference, promises, date, transferIn, date1, bestAgent, transferred, oldAgent, newAgent, updatedVisitor, _b, conversation_1, _c, _d, _e, payload, queEvent, chatEvent, insertedMessage, error_68;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _f.trys.push([0, 32, , 33]);
                        return [4 /*yield*/, this.GetCompanies()];
                    case 1:
                        companies = _f.sent();
                        if (!(companies && companies.length)) return [3 /*break*/, 31];
                        i = 0;
                        _f.label = 2;
                    case 2:
                        if (!(i < companies.length)) return [3 /*break*/, 31];
                        if (this.IgnoreNameSpace(companies[i].name))
                            return [3 /*break*/, 30];
                        return [4 /*yield*/, this.GetAllWaitingVisitors(companies[i].name)];
                    case 3:
                        InactiveSessions = _f.sent();
                        j = 0;
                        _f.label = 4;
                    case 4:
                        if (!(j < InactiveSessions.length)) return [3 /*break*/, 30];
                        _a = InactiveSessions[j].state;
                        switch (_a) {
                            case 3: return [3 /*break*/, 5];
                        }
                        return [3 /*break*/, 28];
                    case 5:
                        logEvent = undefined;
                        event = '';
                        oldSession = JSON.parse(JSON.stringify(InactiveSessions[j]));
                        updateSession = undefined;
                        return [4 /*yield*/, this.getInactiveChat(InactiveSessions[j].conversationID, companies[i]['settings']['chatSettings']['inactivityTimeouts']['transferIn'], false)];
                    case 6:
                        conversation = _f.sent();
                        Conversationreference = conversation;
                        promises = void 0;
                        date = '';
                        if (conversation && conversation.length)
                            date = (conversation[0].hasOwnProperty('lastPickedTime')) ? conversation[0].lastPickedTime : conversation[0].lastMessage.date;
                        transferIn = new Date();
                        date1 = void 0;
                        if (date) {
                            date1 = new Date(date);
                            // if (conversation[0]) console.log(date1);
                            date1.setMinutes(date1.getMinutes() + companies[i]['settings']['chatSettings']['inactivityTimeouts']['transferIn']);
                        }
                        if (!(conversation && conversation.length && conversation[0].entertained && (conversation[0].lastMessage && (conversation[0].lastMessage.type == 'Visitors') && (date1.toISOString() < transferIn.toISOString())))) return [3 /*break*/, 27];
                        return [4 /*yield*/, this.GetAllActiveAgentsChatting(InactiveSessions[j], [InactiveSessions[j].agent.id])];
                    case 7:
                        bestAgent = _f.sent();
                        if (!!bestAgent) return [3 /*break*/, 8];
                        return [3 /*break*/, 29];
                    case 8: return [4 /*yield*/, this.TransferAgentAuto(InactiveSessions[j], bestAgent)];
                    case 9:
                        transferred = _f.sent();
                        if (!transferred) return [3 /*break*/, 27];
                        oldAgent = transferred.oldAgent;
                        newAgent = transferred.newAgent;
                        updatedVisitor = transferred.updatedVisitor;
                        if (!(newAgent && updatedVisitor)) return [3 /*break*/, 27];
                        if (!(Conversationreference && Conversationreference.length && Conversationreference[0].agentEmail)) return [3 /*break*/, 11];
                        return [4 /*yield*/, this.AddPenaltyTime(updatedVisitor.conversationID, Conversationreference[0].agentEmail, (Conversationreference[0].lastMessage) ? Conversationreference[0].lastMessage.date : Conversationreference[0].createdOn)];
                    case 10:
                        _b = _f.sent();
                        return [3 /*break*/, 12];
                    case 11:
                        _b = undefined;
                        _f.label = 12;
                    case 12:
                        _b;
                        if (!(newAgent.email)) return [3 /*break*/, 14];
                        return [4 /*yield*/, this.TransferChat(updatedVisitor.conversationID, newAgent.email, transferIn.toISOString(), false)];
                    case 13:
                        _c = _f.sent();
                        return [3 /*break*/, 15];
                    case 14:
                        _c = undefined;
                        _f.label = 15;
                    case 15:
                        conversation_1 = _c;
                        if (!(conversation_1 && conversation_1.value)) return [3 /*break*/, 27];
                        if (!
                        //let lastTransfered = await Conversations.UpdateLastTransferred((pendingVisitor as VisitorSessionSchema).conversationID, transferIn)
                        (conversation_1.value.messageReadCount)) 
                        //let lastTransfered = await Conversations.UpdateLastTransferred((pendingVisitor as VisitorSessionSchema).conversationID, transferIn)
                        return [3 /*break*/, 17];
                        _e = conversation_1.value;
                        return [4 /*yield*/, this.getMessages1(updatedVisitor.conversationID)];
                    case 16:
                        _d = _e.messages = _f.sent();
                        return [3 /*break*/, 18];
                    case 17:
                        _d = [];
                        _f.label = 18;
                    case 18:
                        //let lastTransfered = await Conversations.UpdateLastTransferred((pendingVisitor as VisitorSessionSchema).conversationID, transferIn)
                        _d;
                        payload = { id: updatedVisitor._id, session: updatedVisitor };
                        queEvent = enums_1.ComposedENUM(enums_1.DynamicEventLogs.VISITOR_TRANSFERED_NO_RESPONSE, {
                            newEmail: newAgent.nickname, oldEmail: InactiveSessions[j].agent.name,
                            mins: companies[i]['settings']['chatSettings']['inactivityTimeouts']['transferIn'],
                            name: updatedVisitor.agent.name
                        });
                        chatEvent = 'Chat auto transferred to ' + (newAgent.name || newAgent.username || newAgent.nickname) + ' from ' + InactiveSessions[j].agent.name + ' due to no reply in ' + companies[i]['settings']['chatSettings']['inactivityTimeouts']['transferIn'] + 'minutes.';
                        return [4 /*yield*/, this.CreateLogMessage({
                                from: InactiveSessions[j].agent.name,
                                to: (updatedVisitor.username) ? updatedVisitor.username : '',
                                body: chatEvent,
                                type: 'Events',
                                cid: (updatedVisitor.conversationID) ? updatedVisitor.conversationID : '',
                                attachment: false,
                                date: new Date().toISOString(),
                                delivered: true,
                                sent: true
                            })];
                    case 19:
                        insertedMessage = _f.sent();
                        if (!insertedMessage) return [3 /*break*/, 21];
                        conversation_1.value.messages.push(insertedMessage);
                        return [4 /*yield*/, __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'privateMessage', nsp: updatedVisitor.nsp, roomName: [this.NotifySingleAgent(updatedVisitor)], data: insertedMessage })];
                    case 20:
                        _f.sent();
                        _f.label = 21;
                    case 21: return [4 /*yield*/, __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: updatedVisitor.nsp, roomName: [this.NotifyAllAgents()], data: payload })];
                    case 22:
                        _f.sent();
                        return [4 /*yield*/, __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'newConversation', nsp: updatedVisitor.nsp, roomName: [this.NotifySingleAgent(updatedVisitor)], data: conversation_1.value })];
                    case 23:
                        _f.sent();
                        return [4 /*yield*/, __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'V', broadcast: false, eventName: 'transferChat', nsp: updatedVisitor.nsp, roomName: [this.NotifyVisitorSingle(updatedVisitor)], data: { agent: updatedVisitor.agent, event: chatEvent } })];
                    case 24:
                        _f.sent();
                        return [4 /*yield*/, __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'removeConversation', nsp: updatedVisitor.nsp, roomName: [this.NotifySingleAgent(oldSession)], data: { conversation: conversation_1.value } })];
                    case 25:
                        _f.sent();
                        return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendEventLog(event, (updatedVisitor._id) ? updatedVisitor._id : updatedVisitor.id)];
                    case 26:
                        _f.sent();
                        _f.label = 27;
                    case 27: return [3 /*break*/, 29];
                    case 28: return [3 /*break*/, 29];
                    case 29:
                        j++;
                        return [3 /*break*/, 4];
                    case 30:
                        i++;
                        return [3 /*break*/, 2];
                    case 31: return [3 /*break*/, 33];
                    case 32:
                        error_68 = _f.sent();
                        console.log(error_68);
                        console.log('Error in INterval AutoAssignement Worker');
                        return [3 /*break*/, 33];
                    case 33: return [2 /*return*/];
                }
            });
        });
    };
    VisitorTimeoutWorker.prototype.CheckBannedVisitor = function () {
        return __awaiter(this, void 0, void 0, function () {
            var companies, i, BannedVisitors, j, updatedVisitor, logEvent, event, currentDate, expired, expiryDate, error_69;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 10, , 11]);
                        return [4 /*yield*/, this.GetCompanies()];
                    case 1:
                        companies = _a.sent();
                        if (!companies) return [3 /*break*/, 9];
                        i = 0;
                        _a.label = 2;
                    case 2:
                        if (!(i < companies.length)) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.getAllVisitors(companies[i].name)];
                    case 3:
                        BannedVisitors = _a.sent();
                        j = 0;
                        _a.label = 4;
                    case 4:
                        if (!(j < BannedVisitors.length)) return [3 /*break*/, 8];
                        updatedVisitor = void 0;
                        if (!BannedVisitors[j].banned || BannedVisitors[j].banSpan < 0)
                            return [3 /*break*/, 7];
                        logEvent = undefined;
                        event = '';
                        currentDate = Date.parse(new Date().toISOString());
                        expired = new Date(BannedVisitors[j].bannedOn);
                        expiryDate = expired.setHours(expired.getHours() + BannedVisitors[j].banSpan);
                        if (!(expiryDate < currentDate)) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.UnbanVisitor(BannedVisitors[j].deviceID, BannedVisitors[j].nsp)];
                    case 5:
                        //innerPromise = await Promise.all([
                        updatedVisitor = _a.sent();
                        // SocketServer.of(visitor.nsp).to(Agents.NotifyAll()).emit('removeBannedVisitor', updatedVisitor.value);
                        return [4 /*yield*/, __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'removeBannedVisitor', nsp: companies[i].name, roomName: [this.NotifyAllAgents()], data: updatedVisitor.value })];
                    case 6:
                        // SocketServer.of(visitor.nsp).to(Agents.NotifyAll()).emit('removeBannedVisitor', updatedVisitor.value);
                        _a.sent();
                        _a.label = 7;
                    case 7:
                        j++;
                        return [3 /*break*/, 4];
                    case 8:
                        i++;
                        return [3 /*break*/, 2];
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        error_69 = _a.sent();
                        console.log(error_69);
                        console.log('error in Checking Banned Visitors');
                        return [3 /*break*/, 11];
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    VisitorTimeoutWorker.prototype.UpdateChatStateHistory = function (session) {
        return __awaiter(this, void 0, void 0, function () {
            var conversation, _a, pullSuperViserAgent, states, visitor, error_70;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 9, , 10]);
                        if (!(this.sessionDB && this.sessionsCollection)) return [3 /*break*/, 7];
                        if (!(session.conversationID)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.GetConversationById(session.conversationID)];
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
                        return [4 /*yield*/, this.sessionsCollection.findOneAndUpdate({
                                _id: new mongodb_1.ObjectId(session._id || session.id)
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
                        error_70 = _b.sent();
                        console.log('Error in Unsetting Agent From Visitor');
                        console.log(error_70);
                        return [3 /*break*/, 10];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    // private async UpdateChatStateHistory(session): Promise<VisitorSessionSchema | undefined> {
    //     try {
    //         if (this.sessionDB && this.sessionsCollection) {
    //             let states = { prevState: session.previousState, nextState: ((((session.inactive) ? '-' : '') + session.state.toString()) + ''), date: new Date().toISOString() }
    //             if (session.stateHistory && session.stateHistory.length && (session.stateHistory[session.stateHistory.length - 1].nextState == states.nextState) && (session.stateHistory[session.stateHistory.length - 1].prevState == states.prevState)) return session;
    //             let visitor = await this.sessionsCollection.findOneAndUpdate(
    //                 {
    //                     _id: new ObjectId(session._id || session.id)
    //                 },
    //                 {
    //                     $push: {
    //                         stateHistory: states
    //                     },
    //                 }, { returnOriginal: false, upsert: false }
    //             )
    //             if (visitor && visitor.value) {
    //                 return visitor.value;
    //             }
    //             else return undefined;
    //         } else return undefined;
    //     } catch (error) {
    //         console.log('Error in setting visitor state history');
    //         console.log(error);
    //     }
    // }
    VisitorTimeoutWorker.prototype.UpdateChatQueHistory = function (session, picketBy) {
        return __awaiter(this, void 0, void 0, function () {
            var obj, visitor, error_71;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!(this.sessionDB && this.sessionsCollection)) return [3 /*break*/, 2];
                        obj = {
                            pickedBy: picketBy,
                            date: new Date().toISOString(),
                            agentID: (session.agent && session.agent.id) ? session.agent.id : '',
                        };
                        return [4 /*yield*/, this.sessionsCollection.findOneAndUpdate({
                                _id: new mongodb_1.ObjectId(session._id || session.id)
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
                        error_71 = _a.sent();
                        console.log('Error in setting visitor que history');
                        console.log(error_71);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    VisitorTimeoutWorker.prototype.EndSuperVisedChat = function (cid, nsp, _id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    return [2 /*return*/, this.chatsCollection.findOneAndUpdate({ _id: new mongodb_1.ObjectID(cid), nsp: nsp }, {
                            $pull: { superviserAgents: _id }
                        }, { returnOriginal: false, upsert: false, })];
                }
                catch (error) {
                    console.log('Error in supervising Chat');
                    console.log(error);
                }
                return [2 /*return*/];
            });
        });
    };
    VisitorTimeoutWorker.prototype.AssignQueuedVisitors = function () {
        return __awaiter(this, void 0, void 0, function () {
            var companies, i, QueuedSessions, j, result, error_72, error_73;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 11, , 12]);
                        return [4 /*yield*/, this.GetCompanies()];
                    case 1:
                        companies = _a.sent();
                        if (!(companies && companies.length)) return [3 /*break*/, 10];
                        i = 0;
                        _a.label = 2;
                    case 2:
                        if (!(i < companies.length)) return [3 /*break*/, 10];
                        if (this.IgnoreNameSpace(companies[i].name))
                            return [3 /*break*/, 9];
                        if (!companies[i]['settings']['chatSettings']['assignments'].aEng)
                            return [3 /*break*/, 9];
                        return [4 /*yield*/, this.GetAllQueuedVisitors(companies[i].name)];
                    case 3:
                        QueuedSessions = _a.sent();
                        j = 0;
                        _a.label = 4;
                    case 4:
                        if (!(j < QueuedSessions.length)) return [3 /*break*/, 9];
                        _a.label = 5;
                    case 5:
                        _a.trys.push([5, 7, , 8]);
                        console.log('Got QUeued Sessions : ');
                        return [4 /*yield*/, this.AutoAssignFromQueueAuto(QueuedSessions[j])];
                    case 6:
                        result = _a.sent();
                        if (!result)
                            return [3 /*break*/, 9];
                        return [3 /*break*/, 8];
                    case 7:
                        error_72 = _a.sent();
                        console.log(error_72);
                        console.log('Error in Checking Inactive Visitors Worker Loop');
                        return [3 /*break*/, 9];
                    case 8:
                        j++;
                        return [3 /*break*/, 4];
                    case 9:
                        i++;
                        return [3 /*break*/, 2];
                    case 10: return [3 /*break*/, 12];
                    case 11:
                        error_73 = _a.sent();
                        console.log(error_73);
                        console.log('error in Checking Visitors Inactive Worker');
                        return [3 /*break*/, 12];
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    VisitorTimeoutWorker.prototype.TokenTimouetManager = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_74;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.DeleteExpiredTokens()];
                    case 1:
                        result = _a.sent();
                        if (result)
                            console.log('Deleted : ' + result.deletedCount + ' Tokens');
                        return [3 /*break*/, 3];
                    case 2:
                        error_74 = _a.sent();
                        console.log('Error in Token Timouts');
                        console.log(error_74);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    VisitorTimeoutWorker.prototype.Sleep = function (ms) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve();
            }, ms);
        });
    };
    VisitorTimeoutWorker.prototype.addHours = function (hours) {
        return new Date().setTime(new Date().getTime() + (hours * 60 * 60 * 1000));
    };
    VisitorTimeoutWorker.prototype.addHoursByDate = function (date, hours) {
        return new Date(date.setTime(date.getTime() + (hours * 60 * 60 * 1000)));
    };
    VisitorTimeoutWorker.prototype.addMinutesByDate = function (date, minutes) {
        return new Date(date.setTime(date.getTime() + (minutes * 60000)));
    };
    VisitorTimeoutWorker.prototype.get2DaysTickets = function (nspList, greaterThan, includedGroups) {
        return __awaiter(this, void 0, void 0, function () {
            var datetime, twelveHr, $lte, $gte, query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        datetime = new Date().toISOString();
                        twelveHr = 'T19:00:00.000Z';
                        $lte = datetime.split('T')[0] + twelveHr;
                        $gte = greaterThan.split('T')[0] + twelveHr;
                        query = [
                            {
                                $match: {
                                    nsp: { $in: nspList },
                                    state: { $in: ["OPEN", "PENDING"] },
                                    'CustomerInfo.customerId': {
                                        $exists: false
                                    },
                                    $or: [
                                        {
                                            CustomerInfo: {
                                                $exists: false
                                            }
                                        },
                                        {
                                            $and: [
                                                { 'CustomerInfo.salesPersonName': 'FREE' },
                                                { 'CustomerInfo.customerId': { '$exists': false } }
                                            ]
                                        }
                                    ],
                                    // $or:[{nsp:'/sbtjapan.com'},{nsp:'/sbtjapaninquiries.com'}],
                                    datetime: { $gte: $gte, $lte: $lte }
                                }
                            },
                            {
                                $match: {
                                    $or: [
                                        { sbtVisitor: { $exists: true } },
                                        { sbtVisitorPhone: { $exists: true } },
                                        { ICONNData: { $exists: true } },
                                        { source: 'livechat' },
                                        { source: 'email' },
                                        { 'visitor.phone': { $exists: true } }
                                    ],
                                    $and: [
                                        { group: { $exists: true } },
                                        { group: { $ne: '' } },
                                        {
                                            $or: [
                                                { entertained: { $exists: false } },
                                                { entertained: false }
                                            ]
                                        }
                                    ]
                                }
                            },
                            {
                                $addFields: {
                                    manipulatedGroup: {
                                        $concat: ["$group", "-", "$nsp"]
                                    }
                                }
                            },
                            {
                                $match: {
                                    nsp: { $exists: true }
                                }
                            },
                            {
                                $limit: 50
                            },
                            {
                                $lookup: {
                                    from: "ticketgroups",
                                    localField: "group",
                                    foreignField: "group_name",
                                    as: "groupDetails"
                                }
                            },
                            {
                                $match: {
                                    'groupDetails.0': {
                                        $exists: true
                                    }
                                }
                            },
                            {
                                $sort: {
                                    _id: -1
                                }
                            }
                        ];
                        if (includedGroups.length) {
                            Object.assign(query[3].$match, { manipulatedGroup: { $in: includedGroups } });
                        }
                        console.log(JSON.stringify(query));
                        return [4 /*yield*/, this.ticketsCollection.aggregate(query, { allowDiskUse: true }).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    VisitorTimeoutWorker.prototype.AutoAssignAgentAccoridngToGroup = function () {
        return __awaiter(this, void 0, void 0, function () {
            var includedGroups, NSPArr, currentDate, groups, weekDay, previousTickets, promises;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        includedGroups = [];
                        NSPArr = [];
                        if (process.env.NODE_ENV == 'production') {
                            NSPArr = ['/sbtjapan.com', '/sbtjapaninquiries.com'];
                        }
                        else if (process.env.NODE_ENV == 'development') {
                            NSPArr = ['/beelinks.solutions'];
                        }
                        else {
                            NSPArr = ['/localhost.com'];
                        }
                        currentDate = new Date();
                        return [4 /*yield*/, this.GetGroupDetailsByNSP(NSPArr)];
                    case 1:
                        groups = _a.sent();
                        weekDay = new Date().toString().split(' ')[0];
                        if (groups && groups.length) {
                            groups.forEach(function (g) {
                                // console.log(g.group_name);
                                if (g.generalSettings && g.generalSettings.enabled) {
                                    var groupDetailList = g.generalSettings.unAvailibilityHours.filter(function (u) { return u.weekDay == weekDay; });
                                    var groupDetail = void 0;
                                    if (groupDetailList && groupDetailList.length) {
                                        groupDetail = groupDetailList[0];
                                    }
                                    // console.log(groupDetail);
                                    if (groupDetail) {
                                        // console.log(new Date().toLocaleDateString() + ' ' + groupDetail.StartTime+'+00');
                                        var shiftStart = new Date(new Date().toLocaleDateString() + ' ' + groupDetail.StartTime + '+00');
                                        var shiftEnd = _this.addHoursByDate(new Date(new Date().toLocaleDateString() + ' ' + groupDetail.StartTime + '+00'), groupDetail.duration);
                                        //check if current datetime is greater than shift and is less than shift end
                                        // console.log('Current DateTime: ' + currentDate);
                                        // console.log('ShiftStart DateTime: ' + shiftStart);
                                        // console.log('ShiftEnd DateTime: ' + shiftEnd);
                                        if (!(currentDate > shiftStart && currentDate < shiftEnd)) {
                                            includedGroups.push(g.group_name + '-' + g.nsp);
                                        }
                                    }
                                    // else {
                                    //   excludedGroups.push(g.group_name + '-' + g.nsp);
                                    // }
                                }
                                // else {
                                //   excludedGroups.push(g.group_name + '-' + g.nsp);
                                // }
                            });
                        }
                        // console.log(excludedGroups);
                        //Get filtered Tickets
                        //Check
                        // if (lockDay != 'Sun') {
                        console.log("Included groups for automation: ");
                        console.log(includedGroups);
                        if (!includedGroups.length) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.get2DaysTickets(NSPArr, this.addHoursByDate(new Date(), -48).toISOString(), includedGroups)];
                    case 2:
                        previousTickets = _a.sent();
                        if (!(previousTickets && previousTickets.length)) return [3 /*break*/, 4];
                        console.log('Ticket Length: ' + previousTickets.length);
                        promises = previousTickets.map(function (ticket) { return __awaiter(_this, void 0, void 0, function () {
                            var generalsettingsdata, check, agentDetails, shiftEnd, onlineAgents, assigned_time, logSchema, logSchema, assigned_time, logSchema, ticketlogViewState, previousAgent, _a, teamsOfPreviousAgent, assign_Agent, recipients_1, EmailRecipients_1, teams, watchers, recipients_2, msg, response;
                            var _this = this;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        generalsettingsdata = ticket.groupDetails[0].generalSettings;
                                        // console.log(generalsettingsdata.unEntertainedTime);
                                        // console.log(this.addMinutesByDate(new Date((ticket.last_assigned_time) ? ticket.last_assigned_time : ticket.first_assigned_time), generalsettingsdata.unEntertainedTime))
                                        //incrementing count and appending checking time
                                        ticket.iterationcount = ((ticket.iterationcount) ? ticket.iterationcount : 0);
                                        check = false;
                                        if (!(ticket.assigned_to && (ticket.first_assigned_time || ticket.last_assigned_time))) return [3 /*break*/, 9];
                                        if (!(new Date() > this.addMinutesByDate(new Date((ticket.last_assigned_time) ? ticket.last_assigned_time : ticket.first_assigned_time), generalsettingsdata.unEntertainedTime))) return [3 /*break*/, 7];
                                        if (!(ticket.iterationcount < generalsettingsdata.assignmentLimit)) return [3 /*break*/, 5];
                                        return [4 /*yield*/, this.getAgentByShiftTime(ticket.assigned_to, ticket.nsp)];
                                    case 1:
                                        agentDetails = _b.sent();
                                        if (!agentDetails) return [3 /*break*/, 3];
                                        shiftEnd = this.addHoursByDate(new Date(new Date().toLocaleDateString() + ' ' + agentDetails.ShiftStart + '+00'), agentDetails.Duration);
                                        return [4 /*yield*/, this.getAllLiveAgentsByEmails(ticket.nsp, [ticket.assigned_to])];
                                    case 2:
                                        onlineAgents = _b.sent();
                                        if (onlineAgents && onlineAgents.length) {
                                            if (new Date() > this.addMinutesByDate(new Date((ticket.last_assigned_time) ? ticket.last_assigned_time : ticket.first_assigned_time), generalsettingsdata.unEntertainedTime)) {
                                                check = true;
                                            }
                                        }
                                        if (this.addMinutesByDate(new Date((ticket.last_assigned_time) ? ticket.last_assigned_time : ticket.first_assigned_time), generalsettingsdata.unEntertainedTime) <= shiftEnd) {
                                            // console.log('Shift still remains, ticket will be re-assigned');
                                            check = true;
                                            // increment = true;
                                        }
                                        return [3 /*break*/, 4];
                                    case 3:
                                        check = true;
                                        _b.label = 4;
                                    case 4: return [3 /*break*/, 6];
                                    case 5:
                                        if (ticket.assigned_to)
                                            ticket.previousAgent = ticket.assigned_to;
                                        ticket.assigned_to = generalsettingsdata.fallbackLimitExceed;
                                        if (!ticket.assignmentList)
                                            ticket.assignmentList = [];
                                        assigned_time = new Date().toISOString();
                                        ticket.assignmentList.push({
                                            assigned_to: ticket.assigned_to,
                                            assigned_time: assigned_time,
                                            read_date: ''
                                        });
                                        if (!ticket.first_assigned_time)
                                            ticket.first_assigned_time = assigned_time;
                                        ticket.last_assigned_time = assigned_time;
                                        logSchema = {
                                            title: 'Ticket Assigned to Fallback Agent (re-assignment limit exceeded), Iteration: ' + ticket.iterationcount,
                                            status: ticket.assigned_to,
                                            updated_by: 'Group Auto Assignment',
                                            user_type: 'Group Auto Assignment',
                                            time_stamp: new Date().toISOString()
                                        };
                                        ticket.ticketlog.push(logSchema);
                                        ticket.entertained = true;
                                        this.sendNotification = true;
                                        _b.label = 6;
                                    case 6: return [3 /*break*/, 8];
                                    case 7:
                                        check = false;
                                        _b.label = 8;
                                    case 8: return [3 /*break*/, 10];
                                    case 9:
                                        check = true;
                                        _b.label = 10;
                                    case 10:
                                        if (!check) return [3 /*break*/, 12];
                                        ticket.iterationcount = ticket.iterationcount + 1;
                                        return [4 /*yield*/, this.getBestFittedAgentInShiftTimes(ticket)];
                                    case 11:
                                        ticket = _b.sent();
                                        //above function returned ticket with asisgned_to if best agent founded
                                        if (ticket && ticket.assigned_to != '') {
                                            logSchema = {
                                                title: 'Ticket Assigned to Shift Time Agent, Iteration: ' + ticket.iterationcount,
                                                status: ticket.assigned_to,
                                                updated_by: 'Group Auto Assignment',
                                                user_type: 'Group Auto Assignment',
                                                time_stamp: new Date().toISOString()
                                            };
                                            ticket.ticketlog.push(logSchema);
                                            this.sendNotification = true;
                                        }
                                        else {
                                            ticket.assigned_to = generalsettingsdata.fallbackNoShift;
                                            if (!ticket.assignmentList)
                                                ticket.assignmentList = [];
                                            assigned_time = new Date().toISOString();
                                            ticket.assignmentList.push({
                                                assigned_to: ticket.assigned_to,
                                                assigned_time: assigned_time,
                                                read_date: ''
                                            });
                                            if (!ticket.first_assigned_time)
                                                ticket.first_assigned_time = assigned_time;
                                            ticket.last_assigned_time = assigned_time;
                                            logSchema = {
                                                title: 'Ticket Assigned to Fallback Agent (no-one in shift), Iteration: ' + ticket.iterationcount,
                                                status: ticket.assigned_to,
                                                updated_by: 'Group Auto Assignment',
                                                user_type: 'Group Auto Assignment',
                                                time_stamp: new Date().toISOString()
                                            };
                                            ticket.ticketlog.push(logSchema);
                                            ticket.entertained = true;
                                            this.sendNotification = true;
                                        }
                                        _b.label = 12;
                                    case 12:
                                        if (!this.sendNotification) return [3 /*break*/, 34];
                                        ticket.lasttouchedTime = new Date().toISOString();
                                        if (!ticket.previousAgent) return [3 /*break*/, 22];
                                        ticketlogViewState = ticketEnums_1.ComposedTicketENUM(ticketEnums_1.TicketLogMessages.UPDATE_VIEW_STATE, { value: "UNREAD", by: 'System' });
                                        // this.UpdateViewState([ticket._id], ticket.nsp, "UNREAD", ticketlogViewState);
                                        ticket.viewState = "UNREAD";
                                        if (!ticket.ticketlog)
                                            ticket.ticketlog = [];
                                        ticket.ticketlog.push(ticketlogViewState);
                                        return [4 /*yield*/, this.getAgentByEmail(ticket.nsp, ticket.previousAgent)];
                                    case 13:
                                        previousAgent = _b.sent();
                                        if (!previousAgent) return [3 /*break*/, 20];
                                        _a = previousAgent.permissions.tickets.canView;
                                        switch (_a) {
                                            case 'assignedOnly': return [3 /*break*/, 14];
                                            case 'group': return [3 /*break*/, 16];
                                        }
                                        return [3 /*break*/, 19];
                                    case 14: return [4 /*yield*/, __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'removeTicket', nsp: ticket.nsp, roomName: [previousAgent._id], data: { tid: ticket._id, ticket: ticket } })];
                                    case 15:
                                        _b.sent();
                                        return [3 /*break*/, 20];
                                    case 16:
                                        if (!((ticket.group && !previousAgent.groups.includes(ticket.group)) || !ticket.group)) return [3 /*break*/, 18];
                                        return [4 /*yield*/, __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'removeTicket', nsp: ticket.nsp, roomName: [previousAgent._id], data: { tid: ticket._id, ticket: ticket } })];
                                    case 17:
                                        _b.sent();
                                        _b.label = 18;
                                    case 18: return [3 /*break*/, 20];
                                    case 19: return [3 /*break*/, 20];
                                    case 20: return [4 /*yield*/, this.getTeamsAgainstAgent(ticket.nsp, ticket.previousAgent)];
                                    case 21:
                                        teamsOfPreviousAgent = _b.sent();
                                        teamsOfPreviousAgent.forEach(function (team) { return __awaiter(_this, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0: return [4 /*yield*/, __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'removeTicket', nsp: ticket.nsp, roomName: [team], data: { tid: ticket._id, ticket: ticket } })];
                                                    case 1:
                                                        _a.sent();
                                                        return [2 /*return*/];
                                                }
                                            });
                                        }); });
                                        _b.label = 22;
                                    case 22: return [4 /*yield*/, __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: ticket.nsp, roomName: ['ticketAdmin'], data: { tid: ticket._id, ticket: ticket } })];
                                    case 23:
                                        _b.sent();
                                        if (!ticket.group) return [3 /*break*/, 25];
                                        return [4 /*yield*/, __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: ticket.nsp, roomName: [ticket.group], data: { tid: ticket._id, ticket: ticket } })];
                                    case 24:
                                        _b.sent();
                                        _b.label = 25;
                                    case 25:
                                        if (!ticket.assigned_to) return [3 /*break*/, 30];
                                        return [4 /*yield*/, this.getAgentByEmail(ticket.nsp, ticket.assigned_to)];
                                    case 26:
                                        assign_Agent = _b.sent();
                                        if (!assign_Agent) return [3 /*break*/, 28];
                                        return [4 /*yield*/, __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'newTicket', nsp: ticket.nsp, roomName: [assign_Agent._id], data: { ticket: ticket, ignoreAdmin: false } })];
                                    case 27:
                                        _b.sent();
                                        _b.label = 28;
                                    case 28:
                                        recipients_1 = Array();
                                        EmailRecipients_1 = Array();
                                        EmailRecipients_1.push(ticket.assigned_to);
                                        recipients_1 = EmailRecipients_1.filter(function (item, pos) {
                                            return EmailRecipients_1.indexOf(item) == pos;
                                        });
                                        return [4 /*yield*/, this.getTeamsAgainstAgent(ticket.nsp, ticket.assigned_to)];
                                    case 29:
                                        teams = _b.sent();
                                        teams.forEach(function (team) { return __awaiter(_this, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0: return [4 /*yield*/, __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'newTicket', nsp: ticket.nsp, roomName: [team], data: { ticket: ticket, ignoreAdmin: false } })];
                                                    case 1:
                                                        _a.sent();
                                                        return [2 /*return*/];
                                                }
                                            });
                                        }); });
                                        _b.label = 30;
                                    case 30:
                                        if (!(ticket.watchers && ticket.watchers.length)) return [3 /*break*/, 32];
                                        return [4 /*yield*/, this.getOnlineWatchers(ticket.nsp, ticket.watchers)];
                                    case 31:
                                        watchers = _b.sent();
                                        if (watchers && watchers.length) {
                                            if (ticket.assigned_to)
                                                watchers = watchers.filter(function (x) { return x != ticket.assigned_to; });
                                            watchers.map(function (watcher) { return __awaiter(_this, void 0, void 0, function () {
                                                return __generator(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0: return [4 /*yield*/, __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: ticket.nsp, roomName: [watcher._id], data: { tid: ticket._id, ticket: ticket } })];
                                                        case 1:
                                                            _a.sent();
                                                            return [2 /*return*/];
                                                    }
                                                });
                                            }); });
                                        }
                                        _b.label = 32;
                                    case 32:
                                        recipients_2 = Array();
                                        recipients_2.push(ticket.assigned_to);
                                        if (ticket.watchers && ticket.watchers.length) {
                                            recipients_2 = recipients_2.concat(ticket.watchers);
                                            recipients_2 = recipients_2.filter(function (item, pos) {
                                                if (recipients_2 && recipients_2.length)
                                                    return recipients_2.indexOf(item) == pos;
                                            });
                                        }
                                        msg = '<span>Hello,</span> <br>'
                                            + '<span>Following ticket is assigned to you </span> <br>'
                                            + '<span><b>by: </b> Group Auto Assignment <br>'
                                            + '<span><b>Ticket ID: </b>' + ticket._id + '<br>'
                                            + '<span><b>Ticket Subject: </b>' + ticket.subject + '<br>'
                                            + '<span><b>Ticket Link: </b> https://app.beelinks.solutions/tickets/ticket-view/' + ticket._id + '<br>';
                                        if (!(recipients_2 && recipients_2.length)) return [3 /*break*/, 34];
                                        return [4 /*yield*/, this.NotifyAgentForTicket({
                                                ticket: ticket,
                                                subject: ticket.subject,
                                                nsp: ticket.nsp.substring(1),
                                                to: recipients_2,
                                                msg: msg
                                            })];
                                    case 33:
                                        response = _b.sent();
                                        if (response && !response.MessageId) {
                                            console.log('Email SEnding TO Agent When Assigning Failed');
                                        }
                                        _b.label = 34;
                                    case 34:
                                        if (ticket.manipulatedGroup)
                                            delete ticket.manipulatedGroup;
                                        if (ticket.groupDetails)
                                            delete ticket.groupDetails;
                                        return [4 /*yield*/, this.UpdateTicketObj(ticket)];
                                    case 35:
                                        _b.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        return [4 /*yield*/, Promise.all(promises)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        console.log('Iteration Completed!');
                        return [2 /*return*/];
                }
            });
        });
    };
    VisitorTimeoutWorker.prototype.GetEmailNotificationSettings = function (nsp, email) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    return [2 /*return*/, this.agentsCollection.find({ nsp: nsp, email: email }, {
                            fields: {
                                _id: 0,
                                'settings.emailNotifications': 1
                            }
                        })
                            .limit(1).toArray()];
                }
                catch (error) {
                    console.log(error);
                    throw new Error("Can't get email notifs");
                }
                return [2 /*return*/];
            });
        });
    };
    VisitorTimeoutWorker.prototype.GetGroupDetailsByNSP = function (nspList) {
        return __awaiter(this, void 0, void 0, function () {
            var groupFromDb, error_75;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.ticketsGroupCollection.find({ nsp: { $in: nspList }, 'generalSettings.enabled': true }).toArray()];
                    case 1:
                        groupFromDb = _a.sent();
                        return [2 /*return*/, groupFromDb];
                    case 2:
                        error_75 = _a.sent();
                        console.log(error_75);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    VisitorTimeoutWorker.prototype.getWatchers = function (id, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.ticketsCollection.find({ _id: new mongodb_1.ObjectID(id), nsp: nsp }).project({ watchers: 1 }).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_1 = _a.sent();
                        console.log('Error in getting watchers');
                        console.log(err_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    VisitorTimeoutWorker.prototype.NotifyAgentForTicket = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    return [2 /*return*/, aws_sqs_1.__biZZC_SQS.SendMessage({ action: 'sendEmailToAgent', data: data })];
                }
                catch (error) {
                    console.log(error);
                    console.log('error in NotifyingAgent For Ticket');
                }
                return [2 /*return*/];
            });
        });
    };
    VisitorTimeoutWorker.prototype.getTeamsAgainstAgent = function (nsp, email) {
        return __awaiter(this, void 0, void 0, function () {
            var teams, teamsFromDb, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        teams = [];
                        return [4 /*yield*/, this.teamCollection.find({
                                nsp: nsp,
                                'agents.email': email
                            }).toArray()];
                    case 1:
                        teamsFromDb = _a.sent();
                        if (teamsFromDb && teamsFromDb.length) {
                            teams = teamsFromDb.map(function (t) { return t.team_name; });
                        }
                        return [2 /*return*/, teams];
                    case 2:
                        err_2 = _a.sent();
                        console.log('Error in getting team against agent');
                        console.log(err_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    VisitorTimeoutWorker.prototype.getOnlineWatchers = function (nsp, data) {
        return __awaiter(this, void 0, void 0, function () {
            var error_76;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.sessionsCollection.find({
                                nsp: nsp,
                                type: 'Agents',
                                email: {
                                    $in: data
                                }
                            }).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_76 = _a.sent();
                        console.log(error_76);
                        console.log('Error in Getting online watchers');
                        return [2 /*return*/, undefined];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    VisitorTimeoutWorker.prototype.UpdateTicketObj = function (ticket) {
        return __awaiter(this, void 0, void 0, function () {
            var err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.ticketsCollection.findOneAndReplace({ _id: new mongodb_1.ObjectID(ticket._id) }, (ticket), { upsert: false, returnOriginal: false })];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        err_3 = _a.sent();
                        console.log('Error in updating ticket Object');
                        console.log(err_3);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    VisitorTimeoutWorker.prototype.getMessagesByTicketId = function (ids) {
        return __awaiter(this, void 0, void 0, function () {
            var objectIdArray, error_77;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        objectIdArray = ids.map(function (s) { return new mongodb_1.ObjectId(s); });
                        return [4 /*yield*/, this.collectionTicketMessages.find({ tid: { $in: objectIdArray }, senderType: "Agent" }).sort({ _id: -1 }).limit(1).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_77 = _a.sent();
                        console.log('Error in getting message by ticket');
                        console.log(error_77);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // public async SyncICONNData() {
    //   try {
    //     console.log("start SyncICONNData");
    //     let timeToStart = new Date(new Date().toLocaleDateString() + ' 5:00').toISOString().split('T')[1].split(":")[0];
    //     let timeToEnd = new Date(new Date().toLocaleDateString() + ' 6:00').toISOString().split('T')[1].split(":")[0];
    //     console.log(timeToStart, timeToEnd);
    //     let checkEntry = await this.CheckICONNSyncReport();
    //     if (checkEntry && checkEntry.length && checkEntry[0].dateTime) {
    //       if (new Date(checkEntry[0].dateTime).toDateString() != new Date().toDateString()) {
    //         await this.InsertICONNDataInBeelinks();
    //       }
    //     }
    //     else {
    //       console.log("in else");
    //       await this.InsertICONNDataInBeelinks();
    //     }
    //   } catch (err) {
    //     console.log('Error in syncing iconn data');
    //     console.log(err);
    //     return undefined;
    //   }
    // }
    // public async InsertICONNDataInBeelinks() {
    //   console.log("in InsertICONNDataInBeelinks");
    //   try {
    //     let receivedData: any;
    //     let insertedObj = {
    //       destination: false,
    //       ports: false,
    //       customerType: false,
    //       phoneType: false,
    //       salesPerson: false
    //     }
    //     receivedData = await this.GetMasterData(1);
    //     console.log("receivedData");
    //     if (receivedData) {
    //       let result: any = await this.InsertICONNMasterData('1', receivedData.MasterData);
    //       if (result.status == "ok") insertedObj.destination = true;
    //     }
    //     else insertedObj.destination = false;
    //     if (insertedObj.destination) {
    //       receivedData = await this.GetMasterData(2);
    //       if (receivedData) {
    //         let result: any = await this.InsertICONNMasterData('2', receivedData.MasterData);
    //         if (result.status == "ok") insertedObj.ports = true;
    //       }
    //     }
    //     if (insertedObj.destination) {
    //       receivedData = await this.GetMasterData(3);
    //       if (receivedData) {
    //         let result: any = await this.InsertICONNMasterData('3', receivedData.MasterData);
    //         if (result.status == "ok") insertedObj.customerType = true;
    //       }
    //     }
    //     if (insertedObj.destination) {
    //       receivedData = await this.GetMasterData(4);
    //       if (receivedData) {
    //         let result: any = await this.InsertICONNMasterData('4', receivedData.MasterData);
    //         if (result.status == "ok") insertedObj.phoneType = true;
    //       }
    //     }
    //     if (insertedObj.destination) {
    //       receivedData = await this.GetMasterData(19);
    //       if (receivedData) {
    //         let result: any = await this.InsertICONNMasterData('19', receivedData.MasterData);
    //         if (result.status == "ok") insertedObj.salesPerson = true;
    //       }
    //     }
    //     // await this.InsertIconnSyncInfo(insertedObj);
    //   } catch (err) {
    //     console.log("Error in Insert ICONN Data In Beelinks");
    //     console.log(err);
    //   }
    // }
    // public async GetMasterData(code) {
    //   let masterDataProductionURL = "https://iconnapifunc00-common.iconn-asestaging01.p.azurewebsites.net/api/GetMasterData?code=Bg5TFyJnSpRJ7s5ecl0Rfv8Y/HK7yIYuKLmdMQOUCum0ygEywNHK1Q==";
    //   let masterData = {
    //     "MasterDataTypeId": code
    //   }
    //   let response = await request.post({
    //     uri: masterDataProductionURL,
    //     body: masterData,
    //     json: true,
    //     timeout: 100000
    //   });
    //   if (response) {
    //     return response;
    //   }
    //   else return undefined;
    // }
    // public async InsertICONNMasterData(code, data) {
    //   try {
    //     console.log("InsertICONNMasterData", code);
    //     let inserted: any;
    //     if (code == '1') inserted = await this.DestinationCollection.findOneAndReplace({}, (data), { upsert: true, returnOriginal: false });
    //     if (code == '2') inserted = await this.PortsCollection.findOneAndReplace({}, (data), { upsert: true, returnOriginal: false });
    //     if (code == '19') inserted = await this.SalesPersonCollection.findOneAndReplace({}, (data), { upsert: true, returnOriginal: false });
    //     if (code == '3') inserted = await this.CustomerTypeCollection.findOneAndReplace({}, (data), { upsert: true, returnOriginal: false });
    //     if (code == '4') inserted = await this.PhoneTypeCollection.findOneAndReplace({}, (data), { upsert: true, returnOriginal: false });
    //     if (inserted && inserted.value) return { status: "ok" };
    //     else return { status: "error" };
    //   } catch (err) {
    //     console.log('Error in Inserting Master data of code :' + code);
    //     console.log(err);
    //     return false;
    //   }
    // }
    // public async InsertIconnSyncInfo(obj) {
    //   try {
    //     obj['dateTime'] = new Date().toISOString()
    //     return await this.IconnSyncInfoCollection.insert(obj);
    //   } catch (err) {
    //     console.log('Error in Inserting iconn sync report');
    //     console.log(err);
    //     return undefined;
    //   }
    // }
    // public async CheckICONNSyncReport() {
    //   return await this.IconnSyncInfoCollection.find({ dateTime: new Date().toISOString() }).project({ dateTime: 1 }).limit(1).toArray();
    // }
    VisitorTimeoutWorker.prototype.getBestFittedAgentInShiftTimes = function (ticket) {
        return __awaiter(this, void 0, void 0, function () {
            var filteredAgents_1, count_1, bestAgent_1, previousAgent_1, groups_1, onlineAgents, assigned_time, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        filteredAgents_1 = [];
                        count_1 = 0;
                        bestAgent_1 = '';
                        previousAgent_1 = '';
                        groups_1 = ticket.groupDetails;
                        if (!(groups_1 && groups_1.length)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getAllLiveAgentsByEmails(groups_1[0].nsp, groups_1[0].agent_list.map(function (a) { return a.email; }))];
                    case 1:
                        onlineAgents = _a.sent();
                        // let onlineAgents = [{ email: 'mufahad9213@sbtjapan.com' }]
                        if (onlineAgents && onlineAgents.length) {
                            onlineAgents.map(function (agent) {
                                if (agent.email != ticket.assigned_to) {
                                    filteredAgents_1.push({
                                        email: agent.email,
                                        count: groups_1[0].agent_list.filter(function (a) { return a.email == agent.email; })[0].count,
                                        isAdmin: groups_1[0].agent_list.filter(function (a) { return a.email == agent.email; })[0].isAdmin,
                                        excluded: groups_1[0].agent_list.filter(function (a) { return a.email == agent.email; })[0].excluded
                                    });
                                }
                                else {
                                    previousAgent_1 = agent.email;
                                }
                            });
                            groups_1[0].agent_list = filteredAgents_1;
                        }
                        else {
                            groups_1[0].agent_list = [];
                        }
                        groups_1[0].agent_list.filter(function (a) { return !a.excluded; }).map(function (agent, index) {
                            if (index == 0) {
                                count_1 = agent.count;
                                bestAgent_1 = agent.email;
                                return;
                            }
                            else {
                                if (agent.count < count_1) {
                                    bestAgent_1 = agent.email;
                                    count_1 = agent.count;
                                }
                            }
                        });
                        _a.label = 2;
                    case 2:
                        if (!bestAgent_1) return [3 /*break*/, 4];
                        assigned_time = new Date().toISOString();
                        if (ticket.assignmentList) {
                            ticket.assignmentList.push({
                                assigned_to: bestAgent_1,
                                assigned_time: assigned_time,
                                read_date: ''
                            });
                        }
                        else {
                            ticket.assignmentList = [{
                                    assigned_to: bestAgent_1,
                                    assigned_time: assigned_time,
                                    read_date: ''
                                }];
                        }
                        ticket.previousAgent = ticket.assigned_to;
                        ticket.assigned_to = bestAgent_1;
                        if (!ticket.first_assigned_time)
                            ticket.first_assigned_time = assigned_time;
                        ticket.last_assigned_time = assigned_time;
                        return [4 /*yield*/, this.IncrementCountOfAgent(ticket.nsp, ticket.group, bestAgent_1)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        ticket.previousAgent = ticket.assigned_to;
                        ticket.assigned_to = '';
                        _a.label = 5;
                    case 5: return [2 /*return*/, ticket];
                    case 6:
                        err_4 = _a.sent();
                        console.log(err_4);
                        console.log('Error in Finding Best AGent Ticket');
                        return [2 /*return*/, undefined];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    VisitorTimeoutWorker.prototype.IncrementCountOfAgent = function (nsp, group, bestAgent) {
        return __awaiter(this, void 0, void 0, function () {
            var err_5;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.ticketsGroupCollection.findOneAndUpdate({ nsp: nsp, group_name: group, "agent_list.email": bestAgent }, { $inc: (_a = {}, _a["agent_list.$.count"] = 1, _a) })];
                    case 1: return [2 /*return*/, _b.sent()];
                    case 2:
                        err_5 = _b.sent();
                        console.log(err_5);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    VisitorTimeoutWorker.prototype.getAgentByShiftTime = function (email, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_78;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.agentsCollection
                                .find({ nsp: nsp, email: email }).project({ ShiftTime: 1 })
                                .limit(1)
                                .toArray()];
                    case 1:
                        result = _a.sent();
                        if (result && result.length)
                            return [2 /*return*/, (result[0].ShiftTime) ? result[0].ShiftTime : undefined];
                        return [3 /*break*/, 3];
                    case 2:
                        error_78 = _a.sent();
                        console.log(error_78);
                        throw new Error("Can't Find Agent In Exists");
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    VisitorTimeoutWorker.prototype.getAllLiveAgentsByEmails = function (nsp, emails) {
        return __awaiter(this, void 0, void 0, function () {
            var error_79;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.sessionsCollection.find({
                                nsp: nsp,
                                type: 'Agents',
                                email: {
                                    $in: emails
                                }
                            }).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_79 = _a.sent();
                        console.log('Error in get All Live Agents By Emails');
                        console.log(error_79);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    VisitorTimeoutWorker.prototype.getGroupByName = function (nsp, name) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    return [2 /*return*/, this.ticketsGroupCollection.find({ nsp: nsp, group_name: name }).limit(1).toArray()];
                }
                catch (error) {
                    console.log(error);
                    console.log('Error in Getting group by name');
                    return [2 /*return*/, []];
                }
                return [2 /*return*/];
            });
        });
    };
    VisitorTimeoutWorker.prototype.getGeneralSettings = function (nsp, group_name) {
        return __awaiter(this, void 0, void 0, function () {
            var result, err_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.ticketsGroupCollection.find({ nsp: nsp, group_name: group_name }).project({ generalSettings: 1 }).limit(1).toArray()];
                    case 1:
                        result = _a.sent();
                        if (result && result.length)
                            return [2 /*return*/, result[0].generalSettings];
                        return [3 /*break*/, 3];
                    case 2:
                        err_6 = _a.sent();
                        console.log(err_6);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    VisitorTimeoutWorker.prototype.Process = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_80;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 16, , 17]);
                        // console.log('Process Started In Worker');
                        return [4 /*yield*/, this.ConnectDBS()];
                    case 1:
                        // console.log('Process Started In Worker');
                        _a.sent();
                        return [4 /*yield*/, this.GetCollections()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.CheckInactiveVisitorsNonChatting()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.CheckInactiveVisitorsChatting()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.Reactivate()];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, this.DeleteInactiveVisitors()];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, this.DeleteInactiveAgents()];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, this.IntervalAutomaticAssignment()];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, this.AutomaticTransfer()];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, this.AssignQueuedVisitors()];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, this.CheckBannedVisitor()];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, this.TokenTimouetManager()];
                    case 12:
                        _a.sent();
                        // await this.SyncICONNData();
                        return [4 /*yield*/, this.AutoAssignAgentAccoridngToGroup()];
                    case 13:
                        // await this.SyncICONNData();
                        _a.sent();
                        if (!process.env.FIXCOUNT) return [3 /*break*/, 15];
                        return [4 /*yield*/, this.FixAgentsCount()];
                    case 14:
                        _a.sent();
                        _a.label = 15;
                    case 15: return [3 /*break*/, 17];
                    case 16:
                        error_80 = _a.sent();
                        console.log(error_80);
                        console.log('Error in Process Worker');
                        this.EndProcess();
                        return [3 /*break*/, 17];
                    case 17: return [2 /*return*/];
                }
            });
        });
    };
    VisitorTimeoutWorker.prototype.EndProcess = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.sessionDB_ref.close();
                this.chatsDB_ref.close();
                this.ticketsDB_ref.close();
                // this.marketingDB_ref.close();
                this.agentsDB_ref.close();
                this.companiesDB_ref.close();
                this.ArchivingDB_ref.close();
                return [2 /*return*/];
            });
        });
    };
    return VisitorTimeoutWorker;
}());
var REDISCLIENT = /** @class */ (function () {
    function REDISCLIENT() {
        var _this = this;
        this.serverIP = constants_1.REDISURL;
        this.connected = false;
        this.redisClient = REDIS.createClient(this.serverIP, { socket_keepalive: true });
        this.redisClient.on('error', function (err) {
            // console.log(this.serverIP);
            console.log('error in Redis', err);
            _this.connected = false;
            //Notify Timeout Manager not working
            //   this.Reconnect();
        });
        this.redisClient.on('connect', function (data) {
            console.log('connected to redis in worker');
            _this.connected = true;
        });
    }
    REDISCLIENT.prototype.Reconnect = function () {
        var _this = this;
        try {
            this.redisClient = REDIS.createClient(this.serverIP, { socket_keepalive: true });
        }
        catch (error) {
            setTimeout(function () {
                _this.Reconnect();
            }, 5000);
        }
    };
    REDISCLIENT.prototype.SetID = function (sid, timeInminutes) {
        if (timeInminutes === void 0) { timeInminutes = 0; }
        var result = false;
        if (!timeInminutes)
            result = this.redisClient.set(sid.toString(), sid.toString());
        else
            result = this.redisClient.SETEX(sid.toString(), Math.round(timeInminutes * 60), sid.toString());
        return result;
    };
    REDISCLIENT.prototype.Exists = function (sid) {
        var _this = this;
        var result = false;
        return new Promise(function (resolve, reject) {
            result = _this.redisClient.get(sid.toString(), function (err, data) {
                // console.log('data : ', data);
                // console.log('err : ', err);
                if (!data || err)
                    resolve(false);
                else
                    return resolve(true);
            });
        });
    };
    REDISCLIENT.prototype.GenerateSID = function (nsp, sid) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var result = _this.redisClient.SET("_" + nsp + "_" + sid.toString(), '1', 'PX', 5000, 'NX', function (err, res) {
                if (!res)
                    resolve(false);
                else
                    resolve(true);
            });
        });
    };
    REDISCLIENT.prototype.GetID = function (key) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.redisClient.GET(key, (function (err, res) {
                if (!res)
                    resolve(false);
                else
                    resolve(res);
            }));
        });
    };
    REDISCLIENT.prototype.DeleteID = function (key) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.redisClient.DEL(key, (function (err, res) {
                if (!res)
                    resolve(false);
                else
                    resolve(res);
            }));
        });
    };
    REDISCLIENT.prototype.Disconnect = function () {
        this.redisClient.quit();
    };
    return REDISCLIENT;
}());
var __BIZZ_REST_REDIS_PUB;
var __BIZZC_REDIS = new REDISCLIENT();
redis_pub_sub_1.REDISPUBSUB.CreateQueue(constants_1.REDISMQURL, constants_1.REDISMQPORT).then((function (data) {
    //console.log('REDIS CONNECTED IN WORKER');
    __BIZZ_REST_REDIS_PUB = data;
    var worker = new VisitorTimeoutWorker();
    worker.Process().then(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    //console.log('Process Ended');
                    __BIZZC_REDIS.Disconnect();
                    __BIZZ_REST_REDIS_PUB.QuitConnection();
                    return [4 /*yield*/, worker.EndProcess()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }).catch(function (e) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            console.log(e);
            return [2 /*return*/];
        });
    }); });
})).catch(function (e) { console.log('Error in Creating Queue At Worker:', e); });
//# sourceMappingURL=Timeoutworker.js.map