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
exports.Conversations = void 0;
// Created By Saad Ismail Shaikh
// Date : 05-03-18
var mongodb_1 = require("mongodb");
var bson_1 = require("bson");
var agentModel_1 = require("./agentModel");
var ChatsDB_1 = require("../globals/config/databses/ChatsDB");
var Conversations = /** @class */ (function () {
    function Conversations() {
    }
    //static greetingMessage="Hello QA :D";
    Conversations.Initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, error_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 3, , 4]);
                        _a = this;
                        return [4 /*yield*/, ChatsDB_1.ChatsDB.connect()];
                    case 1:
                        _a.db = _c.sent();
                        _b = this;
                        return [4 /*yield*/, this.db.createCollection('conversations')];
                    case 2:
                        _b.collection = _c.sent();
                        console.log(this.collection.collectionName);
                        Conversations.initialized = true;
                        return [2 /*return*/, Conversations.initialized];
                    case 3:
                        error_1 = _c.sent();
                        console.log('error in Initializing Conversations Model');
                        throw new Error(error_1);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Conversations.Destroy = function () {
        this.db = undefined;
        this.collection = undefined;
    };
    Conversations.getConversationClientID = function (str, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var exists, duplicate, randomString, charSet, i, randomPoz, exists_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        exists = [];
                        duplicate = false;
                        randomString = '';
                        _a.label = 1;
                    case 1:
                        charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                        for (i = 0; i < 10; i++) {
                            randomPoz = Math.floor(Math.random() * charSet.length);
                            randomString += charSet.substring(randomPoz, randomPoz + 1);
                        }
                        return [4 /*yield*/, this.collection.find({ nsp: nsp, clientID: randomString }).toArray()];
                    case 2:
                        exists_1 = _a.sent();
                        if (exists_1 && exists_1.length)
                            duplicate = true;
                        else
                            duplicate = false;
                        _a.label = 3;
                    case 3:
                        if (duplicate) return [3 /*break*/, 1];
                        _a.label = 4;
                    case 4: return [2 /*return*/, randomString];
                }
            });
        });
    };
    Conversations.SetClientID = function (cid, nsp, clientID) {
        return __awaiter(this, void 0, void 0, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ _id: new bson_1.ObjectId(cid), nsp: nsp }, { $set: { clientID: clientID } }, { returnOriginal: false, upsert: false })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_2 = _a.sent();
                        console.log('Error in getting particular ticket');
                        console.log(error_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Conversations.InsertCustomerID = function (customerID, cid, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ _id: new bson_1.ObjectId(cid), nsp: nsp }, { $set: { CMID: customerID } }, { returnOriginal: false, upsert: false })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_3 = _a.sent();
                        console.log('Error in Insert Customer ID');
                        console.log(error_3);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Conversations.InsertCustomerRegistration = function (registered, cid, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ _id: new bson_1.ObjectId(cid), nsp: nsp }, { $set: { Registered: registered } }, { returnOriginal: false, upsert: false })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_4 = _a.sent();
                        console.log('Error in Insert Customer Registration');
                        console.log(error_4);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Conversations.InsertFormDetails = function (stockFormData, cid, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ _id: new bson_1.ObjectId(cid), nsp: nsp }, { $set: { StockForm: stockFormData } }, { returnOriginal: false, upsert: false })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_5 = _a.sent();
                        console.log('Error in Insert Stock List');
                        console.log(error_5);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Conversations.InsertStockList = function (stockList, stockURL, cid, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ _id: new bson_1.ObjectId(cid), nsp: nsp }, { $set: { StockList: stockList, StockURL: stockURL } }, { returnOriginal: false, upsert: false })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_6 = _a.sent();
                        console.log('Error in Insert Stock List');
                        console.log(error_6);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Conversations.RemoveStockList = function (cid, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ _id: new bson_1.ObjectId(cid), nsp: nsp }, { $unset: { StockList: 1, StockURL: 1 } }, { returnOriginal: false, upsert: false })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_7 = _a.sent();
                        console.log('Error in Remove Stock List');
                        console.log(error_7);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Conversations.InsertCustomerInfo = function (customerInfo, cid, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ _id: new bson_1.ObjectId(cid), nsp: nsp }, { $set: { CustomerInfo: customerInfo } }, { returnOriginal: false, upsert: false })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_8 = _a.sent();
                        console.log('Error in Insert Customer Info');
                        console.log(error_8);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Conversations.InsertCountryCode = function (countryCode, cid, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ _id: new bson_1.ObjectId(cid), nsp: nsp }, { $set: { countryCode: countryCode } }, { returnOriginal: false, upsert: false })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_9 = _a.sent();
                        console.log('Error in Insert Customer Info');
                        console.log(error_9);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Conversations.InsertSimilar = function (allCustomer, cid, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ _id: new bson_1.ObjectId(cid), nsp: nsp }, { $set: { RelatedCustomerInfo: allCustomer } }, { returnOriginal: false, upsert: false })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_10 = _a.sent();
                        console.log('Error in Insert Customer Info');
                        console.log(error_10);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Conversations.createConversation = function (conversationID, visitorEmail, sessionid, nsp, visitorColor, agentEmail, visitorName, state, deviceID, greetingMessage) {
        if (state === void 0) { state = 1; }
        return __awaiter(this, void 0, void 0, function () {
            var conversation, clientID, updatedConversation, error_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, this.collection.insertOne({
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
                        return [4 /*yield*/, Conversations.getConversationClientID(conversation.ops[0]._id.toHexString(), nsp)];
                    case 2:
                        clientID = _a.sent();
                        if (!clientID) return [3 /*break*/, 4];
                        return [4 /*yield*/, Conversations.SetClientID(conversation.ops[0]._id, nsp, clientID.toString())];
                    case 3:
                        updatedConversation = _a.sent();
                        if (updatedConversation && updatedConversation.value) {
                            conversation.ops[0].clientID = updatedConversation.value.clientID;
                        }
                        _a.label = 4;
                    case 4: 
                    // __biZZC_SQS.SendMessage({ action: 'startConversation', conversation: conversation.ops[0] }, ARCHIVINGQUEUE);
                    return [2 /*return*/, conversation];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_11 = _a.sent();
                        console.log('Error in Create Conversation');
                        console.log(error_11);
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    Conversations.UpdateLastPickedTime = function (cid, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    console.log('UpdateLastPickedTime');
                    return [2 /*return*/, this.collection.findOneAndUpdate({ _id: new mongodb_1.ObjectID(cid), nsp: nsp }, {
                            $set: {
                                lastPickedTime: new Date().toISOString()
                            }
                        }, { returnOriginal: false, upsert: false })];
                }
                catch (error) {
                    console.log(error);
                    console.log('Error in Update Last Picked Time for Chat');
                }
                return [2 /*return*/];
            });
        });
    };
    Conversations.MakeInactive = function (cid) {
        return __awaiter(this, void 0, void 0, function () {
            var error_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ _id: new mongodb_1.ObjectID(cid) }, { $set: { inactive: true } }, { returnOriginal: false, upsert: false })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_12 = _a.sent();
                        console.log('error in Making Conversation Inactive');
                        console.log(error_12);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Conversations.UpdateConversationState = function (cid, state, makeInactive) {
        return __awaiter(this, void 0, void 0, function () {
            var error_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        if (!!makeInactive) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ _id: new mongodb_1.ObjectID(cid) }, { $set: { state: state, inactive: false } }, { returnOriginal: false, upsert: false })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [4 /*yield*/, this.collection.findOneAndUpdate({ _id: new mongodb_1.ObjectID(cid) }, { $set: { state: state, inactive: true } }, { returnOriginal: false, upsert: false })];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_13 = _a.sent();
                        console.log(error_13);
                        console.log('Error in Updating Conversation');
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
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
    Conversations.UpdateLastMessage = function (cid, message, options) {
        return __awaiter(this, void 0, void 0, function () {
            var inserMessageID, error_14;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 5, , 6]);
                        inserMessageID = (options && options.insertMessageID && options.email && options.MessageId) ? true : false;
                        if (!inserMessageID) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.collection.findOneAndUpdate((_a = {
                                    _id: new mongodb_1.ObjectID(cid)
                                },
                                _a['assigned_to.email'] = options.email,
                                _a), {
                                $set: { lastMessage: message, entertained: true },
                                $addToSet: (_b = {}, _b['assigned_to.$.messageIds'] = { id: new mongodb_1.ObjectID(options.MessageId), date: message.date }, _b)
                            }, { returnOriginal: false, upsert: false })];
                    case 1: return [2 /*return*/, _c.sent()];
                    case 2: return [4 /*yield*/, this.collection.findOneAndUpdate({
                            _id: new mongodb_1.ObjectID(cid),
                        }, {
                            $set: {
                                lastMessage: message, entertained: true
                            },
                        }, { returnOriginal: false, upsert: false })];
                    case 3: return [2 /*return*/, _c.sent()];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_14 = _c.sent();
                        console.log(error_14);
                        console.log('Error in Updating Last Message');
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Conversations.getMessagesByTime = function (cid, date, _id) {
        if (_id === void 0) { _id = ''; }
        return __awaiter(this, void 0, void 0, function () {
            var error_15;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!_id) return [3 /*break*/, 1];
                        return [2 /*return*/, this.db.collection('messages').find({ cid: new mongodb_1.ObjectID(cid), _id: { $gt: new mongodb_1.ObjectID(_id) } }).sort({ _id: 1 }).toArray()];
                    case 1: return [4 /*yield*/, this.db.collection('messages').find({ cid: new mongodb_1.ObjectID(cid) }).toArray()];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        error_15 = _a.sent();
                        console.log('Error in Get Messag By Time');
                        console.log(error_15);
                        return [2 /*return*/, []];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Conversations.getInactiveChat = function (cid, timeInMinutes, checkCreatedOn) {
        return __awaiter(this, void 0, void 0, function () {
            var date, error_16;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 5, , 6]);
                        date = new Date();
                        date.setMinutes(date.getMinutes() - timeInMinutes);
                        console.log('Getting Inactive Chat : ', { cid: cid, timeInMinutes: timeInMinutes });
                        if (!!checkCreatedOn) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.collection.find({
                                _id: new mongodb_1.ObjectID(cid),
                                $and: [
                                    (_a = {
                                            lastMessage: { $exists: true }
                                        },
                                        _a['lastMessage.date'] = { $lte: date.toISOString() },
                                        _a)
                                ]
                            }).limit(1).toArray()];
                    case 1: return [2 /*return*/, _c.sent()];
                    case 2: return [4 /*yield*/, this.collection.find({
                            _id: new mongodb_1.ObjectID(cid),
                            $or: [
                                { $and: [(_b = { lastMessage: { $exists: true } }, _b['lastMessage.date'] = { $lte: date.toISOString() }, _b)] },
                                { createdOn: { $lte: date.toISOString() } }
                            ]
                        }).limit(1).toArray()];
                    case 3: return [2 /*return*/, _c.sent()];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_16 = _c.sent();
                        console.log(error_16);
                        console.log('Error in Updating Conversation');
                        return [2 /*return*/, []];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Conversations.getCustomerConversations = function (filter, nsp, token, chunk) {
        if (token === void 0) { token = 'deviceID'; }
        if (chunk === void 0) { chunk = ''; }
        return __awaiter(this, void 0, void 0, function () {
            var agent_1, search, searchObj, obj, conversations, updatedList, error_17;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        search = {};
                        if (!filter)
                            return [2 /*return*/, []];
                        else {
                            search.nsp = nsp;
                            search[token.toString()] = filter;
                            searchObj = {
                                "lastMessage": { "$ne": "" },
                                "endingDate": { "$exists": true }
                            };
                            search = Object.assign(search, searchObj);
                            // search.$and = [{ "lastMessage": { "$ne": null } }, { "lastMessage": { "$ne": "" } }, { "state": { $in: [1, 3, 4] } }, { "endingDate": { "$exists": true } }]
                            if (chunk)
                                search._id = { $lt: new bson_1.ObjectId(chunk) };
                            obj = {};
                            if (token == 'visitorEmail')
                                obj = {
                                    $not: /unregistered/gi
                                };
                            else
                                obj = {
                                    $exists: true
                                };
                            if (search.hasOwnProperty(token)) {
                                search.$and = [];
                                search.$and[0] = {};
                                search.$and[0][token] = obj;
                            }
                            else
                                search[token] = obj;
                        }
                        return [4 /*yield*/, this.collection.find(search).sort({ _id: -1 }).limit(10).toArray()];
                    case 1:
                        conversations = _a.sent();
                        if (!(conversations && conversations.length)) return [3 /*break*/, 3];
                        updatedList = conversations.map(function (convo) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!convo.agentEmail) return [3 /*break*/, 2];
                                        return [4 /*yield*/, agentModel_1.Agents.getAgentsByEmail(convo.agentEmail)];
                                    case 1:
                                        agent_1 = _a.sent();
                                        if (agent_1 && agent_1.length) {
                                            convo.agentName = agent_1[0].nickname;
                                        }
                                        _a.label = 2;
                                    case 2: return [2 /*return*/, convo];
                                }
                            });
                        }); });
                        return [4 /*yield*/, Promise.all(updatedList)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        error_17 = _a.sent();
                        console.log('Error in Get Messag By Device ID');
                        console.log(error_17);
                        return [2 /*return*/, []];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Conversations.getMoreConversationsByDeviceID = function (deviceID, id, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var agent_2, conversations, updatedList, error_18;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.collection.find({
                                nsp: nsp, deviceID: deviceID,
                                "lastMessage": { "$ne": "" },
                                "endingDate": { "$exists": true },
                                _id: { $lt: new mongodb_1.ObjectID(id) },
                            }).sort({ _id: -1 }).limit(5).toArray()];
                    case 1:
                        conversations = _a.sent();
                        if (!(conversations && conversations.length)) return [3 /*break*/, 3];
                        updatedList = conversations.map(function (convo) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!convo.agentEmail) return [3 /*break*/, 2];
                                        return [4 /*yield*/, agentModel_1.Agents.getAgentsByEmail(convo.agentEmail)];
                                    case 1:
                                        agent_2 = _a.sent();
                                        if (agent_2 && agent_2.length) {
                                            convo.agentName = agent_2[0].nickname;
                                        }
                                        _a.label = 2;
                                    case 2: return [2 /*return*/, convo];
                                }
                            });
                        }); });
                        return [4 /*yield*/, Promise.all(updatedList)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        error_18 = _a.sent();
                        console.log('Error in Get Messag By Device ID');
                        console.log(error_18);
                        return [2 /*return*/, []];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    // public static async getConversationsByDeviceID2(deviceID) {
    //     try {
    //         return await this.collection.find({ deviceID: deviceID, "lastMessage": { "$exists": true, "$ne": "" }}).toArray();
    //     }
    //     catch (error) {
    //         console.log('Error in Get Messag By Device ID');
    //         console.log(error);
    //         return [];
    //     }
    // }
    Conversations.getMessagesByCid = function (cid) {
        return __awaiter(this, void 0, void 0, function () {
            var error_19;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.db.collection('messages').find({ cid: new mongodb_1.ObjectID(cid) }).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_19 = _a.sent();
                        console.log('Error in Get Messag By Cid');
                        console.log(error_19);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     *
     * @param cid : string
     * @param data : { id , subject , createdby , createdDate , clientID }
     */
    Conversations.InsertTicketDetails = function (cid, data) {
        return __awaiter(this, void 0, void 0, function () {
            var error_20;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ _id: new mongodb_1.ObjectID(cid) }, {
                                $push: { tickets: data }
                            }, { returnOriginal: false, upsert: false })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_20 = _a.sent();
                        console.log(error_20);
                        console.log('Error in iserting ticket details into conversation');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Conversations.getArchives = function (email, canView, filters, nsp, chunk, query) {
        if (chunk === void 0) { chunk = '0'; }
        if (query === void 0) { query = []; }
        return __awaiter(this, void 0, void 0, function () {
            var clause_1, filtersObject_1, obj_1, override_1, sort, error_21;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 7, , 8]);
                        clause_1 = "$and";
                        filtersObject_1 = (_a = {}, _a[clause_1] = [], _a);
                        obj_1 = { "agentEmail": email, state: { $in: [1, 4] }, lastMessage: { $exists: 1 }, endingDate: { $exists: 1 }, nsp: nsp };
                        override_1 = undefined;
                        if (filters) {
                            if (filters.filter) {
                                if (filters.filter.override) {
                                    override_1 = JSON.parse(JSON.stringify(filters.filter.override));
                                    delete filters.filter.override;
                                }
                                Object.keys(filters.filter).map(function (key) {
                                    var _a, _b, _c, _d, _e, _f, _g;
                                    if (key == 'daterange') {
                                        // console.log('From: ' + new Date(filters.filter[key].from).toISOString());
                                        // console.log('To: ' + filters.filter[key].to);
                                        filters.filter[key].to = new Date(new Date(filters.filter[key].to).getTime() + (60 * 60 * 24 * 1000) - 1);
                                        // console.log('To: ' + new Date(filters.filter[key].to).toISOString());
                                        filtersObject_1[clause_1].push({ 'createdOn': { $gte: new Date(filters.filter[key].from).toISOString(), $lte: new Date(filters.filter[key].to).toISOString() } });
                                        return;
                                    }
                                    if (key == 'agentEmail') {
                                        if (canView == 'all') {
                                            obj_1.agentEmail = { '$in': filters.filter[key] };
                                            //filtersObject[clause].push({ [key]: { '$in': filters.filter[key] } });
                                        }
                                        return;
                                    }
                                    if (key == 'state') {
                                        delete obj_1.state;
                                        // delete obj.$and[0].state;
                                        filtersObject_1[clause_1].push((_a = {}, _a[key] = { '$in': filters.filter[key] }, _a));
                                        return;
                                    }
                                    if (key == 'tickets') {
                                        if (filters.filter[key] != 'all')
                                            filtersObject_1[clause_1].push((_b = {}, _b[key] = { '$exists': (filters.filter[key] == 'yes') ? true : false }, _b));
                                        return;
                                    }
                                    // console.log(key);
                                    if (key == 'transferred') {
                                        if (filters.filter[key])
                                            filtersObject_1[clause_1].push((_c = {}, _c['assigned_to.1'] = { '$exists': true }, _c));
                                        return;
                                    }
                                    if (key == 'missed') {
                                        // console.log(key);
                                        // console.log(filters.filter);
                                        // console.log(filters.filter[key]);
                                        if (filters.filter[key])
                                            filtersObject_1[clause_1].push((_d = {}, _d['missed'] = true, _d));
                                        else
                                            filtersObject_1[clause_1].push((_e = {}, _e['missed'] = { '$exists': false }, _e));
                                        return;
                                    }
                                    // if(key == 'tags'){
                                    //     let tagList = filters.filter[key].map(t => '#' + t);
                                    //     // console.log(tagList);
                                    //     filtersObject[clause].push({ [key]: { '$in': tagList } });
                                    //     return;
                                    // }
                                    if (Array.isArray(filters.filter[key])) {
                                        filtersObject_1[clause_1].push((_f = {}, _f[key] = { '$in': filters.filter[key] }, _f));
                                    }
                                    else
                                        filtersObject_1[clause_1].push((_g = {}, _g[key] = filters.filter[key], _g));
                                });
                            }
                            if (filters.userType) {
                                switch (filters.userType) {
                                    case 'unregistered':
                                        filtersObject_1[clause_1].push({ visitorEmail: 'Unregistered' });
                                        break;
                                    case 'registered':
                                        filtersObject_1[clause_1].push({ visitorEmail: { '$ne': 'Unregistered' } });
                                        break;
                                    default:
                                        break;
                                }
                            }
                        }
                        // filtersObject[clause].forEach(element => {
                        //     console.log(element.filter);
                        // });
                        if (filtersObject_1[clause_1].length)
                            Object.assign(obj_1, filtersObject_1);
                        if (override_1) {
                            Object.keys(override_1).map(function (key) {
                                if (key == "agentEmail") {
                                    if (canView == 'all') {
                                        if (override_1 && override_1[key] && obj_1[key])
                                            obj_1[key] = override_1[key];
                                    }
                                }
                                else {
                                    if (override_1 && override_1[key] && obj_1[key])
                                        obj_1[key] = override_1[key];
                                }
                            });
                        }
                        sort = void 0;
                        if (filters && filters.sortBy && filters.sortBy.name) {
                            sort = (_b = {},
                                _b[filters.sortBy.name] = parseInt(filters.sortBy.type),
                                _b);
                        }
                        if (!(chunk == "0")) return [3 /*break*/, 4];
                        if (!query.length) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.collection.aggregate(query).toArray()];
                    case 1: return [2 /*return*/, _e.sent()];
                    case 2: return [4 /*yield*/, this.collection.aggregate([
                            { "$addFields": { "lastmodified": { "$ifNull": ["$lastMessage.date", "$createdOn"] }, "synced": false } },
                            { "$match": obj_1 },
                            { "$sort": (sort) ? sort : { 'lastmodified': -1 } },
                            { "$limit": 20 }
                        ]).toArray()];
                    case 3: 
                    // console.log(obj);
                    // console.log((obj as any).$and);
                    return [2 /*return*/, _e.sent()];
                    case 4:
                        if (filters && filters.sortBy && filters.sortBy.name) {
                            if (parseInt(filters.sortBy.type) == 1) {
                                //ASC
                                Object.assign(obj_1, (_c = {}, _c[filters.sortBy.name] = { "$gt": chunk }, _c));
                            }
                            else {
                                //DESC
                                Object.assign(obj_1, (_d = {}, _d[filters.sortBy.name] = { "$lt": chunk }, _d));
                            }
                        }
                        else {
                            Object.assign(obj_1, { 'createdOn': { "$lt": chunk } });
                        }
                        return [4 /*yield*/, this.collection.aggregate([
                                { "$addFields": { "lastmodified": { "$ifNull": ["$lastMessage.date", "$createdOn"] }, "synced": false } },
                                { "$match": obj_1 },
                                { "$sort": (sort) ? sort : { 'lastmodified': -1 } },
                                { "$limit": 20 }
                            ]).toArray()];
                    case 5: 
                    // console.log(obj);
                    // console.log((obj as any).$and)
                    return [2 /*return*/, _e.sent()];
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        error_21 = _e.sent();
                        console.log(error_21);
                        console.log('error in getting Archives from Model');
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    Conversations.getArchiveMessages = function (cid, chunk) {
        if (chunk === void 0) { chunk = "0"; }
        return __awaiter(this, void 0, void 0, function () {
            var error_22;
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
                            { "$limit": 20 },
                            { "$sort": { "date": 1 } }
                        ]).toArray()];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_22 = _a.sent();
                        console.log(error_22);
                        console.log('error in Get Archives');
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Conversations.getConversations = function (email, allChats, nsp, accessBotChats, chunk) {
        if (allChats === void 0) { allChats = 'self'; }
        if (accessBotChats === void 0) { accessBotChats = false; }
        if (chunk === void 0) { chunk = '0'; }
        return __awaiter(this, void 0, void 0, function () {
            var search, conversations;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        search = {};
                        search.nsp = nsp;
                        search.agentEmail = { $in: [email] },
                            search.state = { $in: [2, 3] };
                        // if (chunk != '0') obj._id = { $lt: new ObjectID(chunk) }
                        if (accessBotChats) {
                            search.agentEmail.$in.push('chatBot');
                            search.state.$in.push(5);
                        }
                        // (allChats == 'all') ? search.$or = obj : search.$and = obj
                        if (chunk != '0')
                            search._id = { $lt: new mongodb_1.ObjectID(chunk) };
                        return [4 /*yield*/, this.collection.find(search).sort({ _id: -1 }).limit(20).toArray()];
                    case 1:
                        conversations = _a.sent();
                        return [2 /*return*/, conversations];
                }
            });
        });
    };
    Conversations.getSupervisedConversation = function (email, nsp, id, allChats) {
        if (allChats === void 0) { allChats = 'self'; }
        return __awaiter(this, void 0, void 0, function () {
            var obj, search;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        obj = [
                            { agentEmail: { $ne: { email: email } } },
                            { state: { $in: [1, 2] } },
                            { superviserAgents: { $in: [id.toHexString()] } }
                        ];
                        search = {};
                        (allChats == 'all') ? search.$or = obj : search.$and = obj;
                        search.nsp = nsp;
                        return [4 /*yield*/, this.collection.find(search).sort({ _id: -1 }).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Conversations.getConversationsByIDs = function (IDs, email) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = [];
                        IDs.forEach(function (id) {
                            data.push(new bson_1.ObjectId(id));
                        });
                        if (!email) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.collection.find({ _id: { '$in': data }, agentEmail: email }).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [4 /*yield*/, this.collection.find({ _id: { '$in': data } }).toArray()];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Conversations.GetConversationById = function (cid) {
        return __awaiter(this, void 0, void 0, function () {
            var error_23;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.find({ _id: new bson_1.ObjectId(cid) }).limit(1).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_23 = _a.sent();
                        console.log(error_23);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Conversations.getConversationBySessionID = function (nsp, sid) {
        return __awaiter(this, void 0, void 0, function () {
            var error_24;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.find({
                                nsp: nsp, $or: [
                                    { sessionid: sid },
                                    { sessionid: new bson_1.ObjectId(sid) }
                                ]
                            }).limit(1).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_24 = _a.sent();
                        console.log(error_24);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Conversations.getConversationBySid = function (cid) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.collection.aggregate([
                            { "$match": { "_id": new mongodb_1.ObjectID(cid) } },
                            {
                                "$lookup": {
                                    "from": 'messages',
                                    "let": { "id": "$_id" },
                                    "pipeline": [
                                        { "$match": { "$expr": { "$eq": ["$$id", "$cid"] } } },
                                    ],
                                    "as": 'messages'
                                }
                            }
                        ]).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Conversations.updateMessageReadCount = function (cid, seen) {
        if (seen === void 0) { seen = false; }
        return __awaiter(this, void 0, void 0, function () {
            var error_25;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        if (!!seen) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ _id: new mongodb_1.ObjectID(cid) }, { $inc: { messageReadCount: 1 } }, { returnOriginal: false, upsert: false })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [4 /*yield*/, this.collection.findOneAndUpdate({ _id: new mongodb_1.ObjectID(cid) }, { $set: { messageReadCount: 0 } }, { returnOriginal: false, upsert: false })];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_25 = _a.sent();
                        console.log('Error in Update Message By Count');
                        console.log(error_25);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Conversations.UpdateVisitorInfo = function (cid, username, email) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    return [2 /*return*/, this.collection.findOneAndUpdate({ _id: new mongodb_1.ObjectID(cid) }, {
                            $set: {
                                visitorEmail: email,
                                visitorName: username
                            }
                        }, { returnOriginal: false, upsert: false })];
                }
                catch (error) {
                    console.log(error);
                    console.log('Error in Update Visitor Conversation Info');
                }
                return [2 /*return*/];
            });
        });
    };
    Conversations.TransferChatUnmodified = function (cid, agentEmail, lastPickedTime) {
        return __awaiter(this, void 0, void 0, function () {
            var msgReadCount, promises, result, error_26;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.db.collection('messages').count({ cid: new bson_1.ObjectId(cid.toString()) })];
                    case 1:
                        msgReadCount = _b.sent();
                        return [4 /*yield*/, Promise.all([
                                this.db.collection('messages').count({ cid: new bson_1.ObjectId(cid.toString()) }),
                                this.collection.update((_a = { _id: new mongodb_1.ObjectID(cid) }, _a['assigned_to.email'] = { $ne: agentEmail }, _a), { $push: { assigned_to: { email: agentEmail, assignedDate: new Date(), firstResponseTime: '', avgResponseTime: '' } } }, { upsert: false }),
                                this.collection.findOneAndUpdate({ _id: new mongodb_1.ObjectID(cid) }, {
                                    $set: {
                                        agentEmail: agentEmail,
                                        messageReadCount: msgReadCount,
                                        state: 2,
                                        lastPickedTime: (lastPickedTime) ? lastPickedTime : new Date().toISOString(),
                                    }
                                }, { returnOriginal: false, upsert: false })
                            ])];
                    case 2:
                        promises = _b.sent();
                        result = promises[2];
                        return [2 /*return*/, result];
                    case 3:
                        error_26 = _b.sent();
                        console.log(error_26);
                        console.log('Error in Transfer Chat');
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Conversations.TransferChat = function (cid, agentEmail, makeInactive, lastPickedTime) {
        return __awaiter(this, void 0, void 0, function () {
            var msgReadCount, promises, result, error_27;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.db.collection('messages').count({ cid: new bson_1.ObjectId(cid.toString()) })];
                    case 1:
                        msgReadCount = _b.sent();
                        return [4 /*yield*/, Promise.all([
                                this.db.collection('messages').count({ cid: new bson_1.ObjectId(cid.toString()) }),
                                this.collection.update((_a = { _id: new mongodb_1.ObjectID(cid) }, _a['assigned_to.email'] = { $ne: agentEmail }, _a), { $push: { assigned_to: { email: agentEmail, assignedDate: new Date(), firstResponseTime: '', avgResponseTime: '' } } }, { upsert: false }),
                                this.collection.findOneAndUpdate({ _id: new mongodb_1.ObjectID(cid) }, {
                                    $set: {
                                        agentEmail: agentEmail,
                                        messageReadCount: msgReadCount,
                                        state: 2,
                                        lastPickedTime: (lastPickedTime) ? lastPickedTime : new Date().toISOString(),
                                        inactive: (makeInactive) ? true : false
                                    }
                                }, { returnOriginal: false, upsert: false })
                            ])];
                    case 2:
                        promises = _b.sent();
                        result = promises[2];
                        return [2 /*return*/, result];
                    case 3:
                        error_27 = _b.sent();
                        console.log(error_27);
                        console.log('Error in Transfer Chat');
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    //updating queued List for conversation
    Conversations.UpdateQueuedCount = function (cid, nsp, queuedEvent) {
        try {
            return this.collection.findOneAndUpdate({ _id: new mongodb_1.ObjectID(cid), nsp: nsp }, {
                $push: { queuedEventList: queuedEvent }
            }, { returnOriginal: false, upsert: false, });
        }
        catch (error) {
            console.log('Error in Updating Queud List');
            console.log(error);
        }
    };
    //SuperViseChat
    Conversations.SuperViseChat = function (cid, nsp, _id) {
        try {
            return this.collection.findOneAndUpdate({ _id: new mongodb_1.ObjectID(cid), nsp: nsp }, {
                $addToSet: { superviserAgents: _id }
            }, { returnOriginal: false, upsert: false, });
        }
        catch (error) {
            console.log('Error in supervising Chat');
            console.log(error);
        }
    };
    //End SuperVisedChat
    Conversations.EndSuperVisedChat = function (cid, nsp, _id) {
        try {
            return this.collection.findOneAndUpdate({ _id: new mongodb_1.ObjectID(cid), nsp: nsp }, {
                $pull: { superviserAgents: _id }
            }, { returnOriginal: false, upsert: false, });
        }
        catch (error) {
            console.log('Error in supervising Chat');
            console.log(error);
        }
    };
    Conversations.EndChat = function (cid, updateState, session, survey) {
        return __awaiter(this, void 0, void 0, function () {
            var error_28;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        if (!updateState) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ _id: new mongodb_1.ObjectID(cid) }, {
                                $set: (!survey) ? { state: 3, endingDate: new Date().toISOString(), session: (session) ? session : '' } : { feedback: survey, state: 3, endingDate: new Date().toISOString(), session: (session) ? session : '' }
                            }, { returnOriginal: false, upsert: false })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [4 /*yield*/, this.collection.findOneAndUpdate({ _id: new mongodb_1.ObjectID(cid) }, {
                            $set: (!survey) ? { feedback: survey, endingDate: new Date().toISOString(), session: (session) ? session : '' } : { endingDate: new Date().toISOString(), session: (session) ? session : '' }
                        }, { returnOriginal: false, upsert: false })];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_28 = _a.sent();
                        console.log(error_28);
                        console.log('Error in End Chat');
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Conversations.EndChatMissed = function (cid, session, survey) {
        return __awaiter(this, void 0, void 0, function () {
            var error_29;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ _id: new mongodb_1.ObjectID(cid) }, {
                                $set: (!survey) ? { feedback: survey, endingDate: new Date().toISOString(), missed: true, state: 3, session: (session) ? session : '' } : { endingDate: new Date().toISOString(), missed: true, state: 3, session: (session) ? session : '' }
                            }, { returnOriginal: false, upsert: false })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_29 = _a.sent();
                        console.log(error_29);
                        console.log('Error in End Chat Missed');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Conversations.AddFirstResponseTime = function (message, email) {
        return __awaiter(this, void 0, void 0, function () {
            var error_30;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.findOneAndUpdate((_a = { _id: new mongodb_1.ObjectID(message.cid) }, _a['assigned_to.email'] = email, _a), { $set: (_b = {}, _b['assigned_to.$.firstResponseTime'] = new Date(message.date), _b) }, { returnOriginal: false, upsert: false })];
                    case 1: return [2 /*return*/, _c.sent()];
                    case 2:
                        error_30 = _c.sent();
                        console.log(error_30);
                        console.log('Error in Updating Last Message');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Conversations.AddPenaltyTime = function (cid, email, lastMessageTime) {
        return __awaiter(this, void 0, void 0, function () {
            var lastTime, currentTime, Difference, error_31;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        lastTime = new Date(lastMessageTime);
                        currentTime = new Date();
                        Difference = ((Date.parse(currentTime.toISOString()) - Date.parse(lastTime.toISOString())) / 1000) / 60;
                        return [4 /*yield*/, this.collection.findOneAndUpdate((_a = { _id: new mongodb_1.ObjectID(cid) }, _a['assigned_to.email'] = email, _a), { $inc: (_b = {}, _b['assigned_to.$.penaltyTime'] = Difference, _b) }, { returnOriginal: false, upsert: false })];
                    case 1: return [2 /*return*/, _c.sent()];
                    case 2:
                        error_31 = _c.sent();
                        console.log(error_31);
                        console.log('Error in Updating Last Message');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Conversations.SubmitSurvey = function (cid, survey) {
        return __awaiter(this, void 0, void 0, function () {
            var error_32;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ _id: new mongodb_1.ObjectID(cid) }, {
                                $set: { feedback: survey }
                            }, { returnOriginal: false, upsert: false })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_32 = _a.sent();
                        console.log(error_32);
                        console.log('Error in End Chat');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Conversations.StopChat = function (cid, state) {
        return __awaiter(this, void 0, void 0, function () {
            var error_33;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        if (!state) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ _id: new mongodb_1.ObjectID(cid), missed: true }, {
                                $set: { state: state, stoppingDate: new Date().toISOString() }
                            }, { returnOriginal: false, upsert: false })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [4 /*yield*/, this.collection.findOneAndUpdate({ _id: new mongodb_1.ObjectID(cid) }, {
                            $set: { state: 4, stoppingDate: new Date().toISOString() }
                        }, { returnOriginal: false, upsert: false })];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_33 = _a.sent();
                        console.log(error_33);
                        console.log('Error in End Chat');
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Conversations.getMessages1 = function (cid) {
        return __awaiter(this, void 0, void 0, function () {
            var error_34;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.db.collection('messages').find({ cid: new bson_1.ObjectId(cid.toString()) }).toArray()];
                    case 1: 
                    // console.log('getting messages');
                    // console.log(cid);
                    return [2 /*return*/, _a.sent()];
                    case 2:
                        error_34 = _a.sent();
                        console.log('Error in getting MEssages 1 ');
                        console.log(error_34);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Conversations.getMessages = function (cid) {
        return this.db.collection('messages').find({ cid: new bson_1.ObjectId(cid.toString()) }).toArray();
    };
    Conversations.insertMessage = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var message;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        message = {
                            from: data.from,
                            to: data.to,
                            body: data.body,
                            cid: new bson_1.ObjectId(data.cid),
                            date: data.date,
                            type: data.type,
                            attachment: (data.attachment) ? true : false,
                            filename: (data.attachment) ? data.filename : undefined,
                            form: data.form ? data.form : [],
                            delivered: (data.delivered) ? true : false,
                            sent: (data.sent) ? true : false,
                            chatFormData: data.chatFormData ? data.chatFormData : ''
                        };
                        return [4 /*yield*/, this.db.collection('messages').insertOne(message)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Conversations.UpdateConverSationEmail = function (conversationID, agentEmail, state) {
        if (state === void 0) { state = 2; }
        return __awaiter(this, void 0, void 0, function () {
            var cid, promises, result, error_35;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, Promise.all([
                                this.collection.update((_a = { _id: new mongodb_1.ObjectID(conversationID) }, _a['assigned_to.email'] = { $ne: agentEmail }, _a), { $push: { assigned_to: { email: agentEmail, assignedDate: new Date(), firstResponseTime: '', avgResponseTime: '' } } }, { upsert: false }),
                                this.collection.findOneAndUpdate({ _id: new mongodb_1.ObjectID(conversationID) }, {
                                    $set: {
                                        agentEmail: agentEmail, state: state, lastPickedTime: new Date().toISOString()
                                    }
                                }, { returnOriginal: false, upsert: false })
                            ])];
                    case 1:
                        promises = _b.sent();
                        return [4 /*yield*/, promises[1]];
                    case 2:
                        result = _b.sent();
                        return [2 /*return*/, result];
                    case 3:
                        error_35 = _b.sent();
                        console.log('Error in Create Conversation');
                        console.log(error_35);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Conversations.UpdateConversation = function (cid, makeInactive, data) {
        return __awaiter(this, void 0, void 0, function () {
            var error_36;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        if (!!makeInactive) return [3 /*break*/, 2];
                        data['inactive'] = false;
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ _id: new mongodb_1.ObjectID(cid) }, { $set: JSON.parse(JSON.stringify(data)) }, { returnOriginal: false, upsert: false })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        data['inactive'] = true;
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ _id: new mongodb_1.ObjectID(cid) }, { $set: JSON.parse(JSON.stringify(data)) }, { returnOriginal: false, upsert: false })];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_36 = _a.sent();
                        console.log(error_36);
                        console.log('Error in Updating Conversation Generic in worker');
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Conversations.submitSurvey = function (data) {
        try {
            var cid = data.cid;
            delete data.cid;
            this.collection.findOneAndUpdate({ _id: new mongodb_1.ObjectID(cid) }, { $set: { feedback: data, state: 3 } }, { returnOriginal: false, upsert: false });
        }
        catch (error) {
            console.log(error);
            console.log('Error in submit Survery');
        }
    };
    Conversations.endConversation = function (conversationID) {
        return __awaiter(this, void 0, void 0, function () {
            var error_37;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ _id: new mongodb_1.ObjectID(conversationID) }, { $set: { state: 3 } }, { returnOriginal: false, upsert: false })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_37 = _a.sent();
                        console.log(error_37);
                        console.log('Error in Ending Conversation');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Conversations.updateDeliveryStatus = function (msgID) {
        return __awaiter(this, void 0, void 0, function () {
            var error_38;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.db.collection('messages').findOneAndUpdate({ _id: new mongodb_1.ObjectID(msgID) }, { $set: { delivered: true, sent: false } }, { returnOriginal: false, upsert: false })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_38 = _a.sent();
                        console.log(error_38);
                        console.log('Error in updating sent Status');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Conversations.updateSentStatus = function (msgID) {
        return __awaiter(this, void 0, void 0, function () {
            var error_39;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.db.collection('messages').findOneAndUpdate({ _id: new mongodb_1.ObjectID(msgID) }, { $set: { sent: true } }, { returnOriginal: false, upsert: false })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_39 = _a.sent();
                        console.log(error_39);
                        console.log('Error in updating Delivery Status');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    //#region Visitor Registed Messages Loading
    Conversations.GetMessagesRegisteredVisitor = function (email, mid) {
        if (mid === void 0) { mid = '0'; }
        return __awaiter(this, void 0, void 0, function () {
            var error_40;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.aggregate([
                                { "$match": { "visitorEmail": email, state: 3 } },
                                {
                                    "$lookup": {
                                        "from": 'messages',
                                        "let": { "id": "$_id" },
                                        "pipeline": [
                                            { "$match": { "$expr": { $and: [{ "$eq": ["$$id", "$cid"] }, { "$lt": ["$$" + mid, "$_id"] }] } } },
                                            { "$sort": { "date": -1 } },
                                            { "limit": 20 }
                                        ],
                                        "as": 'messages'
                                    }
                                },
                                { "$sort": { "_id": -1 } },
                                { "$group": { _id: 't_aarshad@engro.com', messages: { $push: "$messages" } } },
                                { "$project": { "messages": { "$slice": ["$messages", 20] } } }
                            ])];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_40 = _a.sent();
                        console.log(error_40);
                        console.log('error in Getting Messages For Regisitered Visitor');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Conversations.UpdateAllLastMessagenByCID = function (cid) {
        return __awaiter(this, void 0, void 0, function () {
            var messagesList, error_41;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.aggregate([
                                { "$match": { "_id": new mongodb_1.ObjectID(cid) } },
                                {
                                    "$lookup": {
                                        "from": 'messages',
                                        "let": { "id": "$_id" },
                                        "pipeline": [
                                            { "$match": { "$expr": { "$eq": ["$$id", "$cid"] } } },
                                            { "$sort": { "date": -1 } },
                                            { "$limit": 20 }
                                        ],
                                        "as": 'messages'
                                    }
                                }
                            ]).toArray()];
                    case 1:
                        messagesList = _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_41 = _a.sent();
                        console.log(error_41);
                        console.log('error in Getting Messages For Regisitered Visitor');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Conversations.addConversationTags = function (_id, nsp, tag, ConversationLog) {
        return __awaiter(this, void 0, void 0, function () {
            var error_42;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ _id: new mongodb_1.ObjectID(_id), nsp: nsp }, {
                                $addToSet: { ConversationLog: ConversationLog, tags: { $each: tag } }
                            }, { returnOriginal: false, upsert: false })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_42 = _a.sent();
                        console.log(error_42);
                        console.log('Error in Tagging Conversation');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Conversations.GetClientIDByConversationID = function (cid, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var error_43;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.find({ _id: new mongodb_1.ObjectID(cid), nsp: nsp }).limit(1).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_43 = _a.sent();
                        console.log('Error in Getting ClientID');
                        return [2 /*return*/, undefined];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Conversations.GetCustomFeedbackByConversationID = function (cid, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var error_44;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.find({ _id: new mongodb_1.ObjectID(cid), nsp: nsp }, {
                                fields: {
                                    visitorCustomFields: 1
                                }
                            }).limit(1).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_44 = _a.sent();
                        console.log('Error in Getting CustomFeedback');
                        return [2 /*return*/, undefined];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Conversations.deleteConversationTag = function (_id, nsp, tag, index) {
        return __awaiter(this, void 0, void 0, function () {
            var error_45;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ _id: new mongodb_1.ObjectID(_id), nsp: nsp }, {
                                $pull: { tags: tag }
                            }, { upsert: false, returnOriginal: false })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_45 = _a.sent();
                        console.log('Error in deleting tag');
                        console.log(error_45);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Conversations.UpdateDynamicProperty = function (cid, name, value, log) {
        return __awaiter(this, void 0, void 0, function () {
            var error_46;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ _id: new bson_1.ObjectId(cid) }, {
                                $set: (_a = {}, _a["dynamicFields." + name] = value, _a),
                                $push: { customFieldLog: log }
                            }, { upsert: false, returnOriginal: false })];
                    case 1: return [2 /*return*/, _b.sent()];
                    case 2:
                        error_46 = _b.sent();
                        console.log('Error in updating dynamic field value');
                        console.log(error_46);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Conversations.UpdateDynamicPropertyByVisitor = function (cid, data, log) {
        return __awaiter(this, void 0, void 0, function () {
            var error_47;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ _id: new bson_1.ObjectId(cid) }, {
                                $set: (_a = {}, _a["visitorCustomFields"] = data, _a),
                                $push: { customFieldLog: log }
                            }, { upsert: false, returnOriginal: false })];
                    case 1: return [2 /*return*/, _b.sent()];
                    case 2:
                        error_47 = _b.sent();
                        console.log('Error in updating dynamic field value');
                        console.log(error_47);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Conversations.GetCustomerConversationCount = function (filter, nsp, token, chunk) {
        if (token === void 0) { token = 'deviceID'; }
        if (chunk === void 0) { chunk = ''; }
        return __awaiter(this, void 0, void 0, function () {
            var search, obj, error_48;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        search = {};
                        if (!filter)
                            return [2 /*return*/, []];
                        else {
                            search.nsp = nsp;
                            search[token] = filter;
                            search.$and = [{ "lastMessage": { "$ne": null } }, { "lastMessage": { "$ne": "" } }, { "state": { $in: [1, 3, 4] } }, { "endingDate": { "$exists": true } }];
                            if (chunk)
                                search._id = { $lt: new bson_1.ObjectId(chunk) };
                            obj = {};
                            if (token == 'visitorEmail')
                                obj = {
                                    $not: /unregistered/gi
                                };
                            else
                                obj = {
                                    $exists: true
                                };
                            if (search.hasOwnProperty(token)) {
                                search.$and = [];
                                search.$and[0] = {};
                                search.$and[0][token] = obj;
                            }
                            else
                                search[token] = obj;
                        }
                        return [4 /*yield*/, this.collection.aggregate([
                                { "$match": search },
                                { "$group": { "_id": null, "count": { $sum: 1 } } }
                            ]).toArray()];
                    case 1: 
                    // console.log(search);
                    return [2 /*return*/, _a.sent()];
                    case 2:
                        error_48 = _a.sent();
                        console.log('Error in Getting Visitors  conversation Count');
                        console.log(error_48);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Conversations.getAllChats = function (nsp, dateFrom, dateTo) {
        return __awaiter(this, void 0, void 0, function () {
            var result, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.aggregate([
                                {
                                    "$match": {
                                        "nsp": nsp,
                                        "createdOn": {
                                            "$gte": dateFrom,
                                            "$lt": dateTo
                                        }
                                    }
                                },
                                {
                                    "$project": {
                                        "data": { $substr: ["$createdOn", 0, 10] }
                                    }
                                },
                                {
                                    "$group": {
                                        _id: { data: "$data" },
                                        count: { $sum: 1 }
                                    }
                                }
                            ]).toArray()];
                    case 1:
                        result = _a.sent();
                        if (result.length)
                            return [2 /*return*/, result];
                        else
                            return [2 /*return*/, []];
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _a.sent();
                        console.log('Error in getting data');
                        console.log(err_1);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Conversations.initialized = false;
    return Conversations;
}());
exports.Conversations = Conversations;
//# sourceMappingURL=conversationModel.js.map