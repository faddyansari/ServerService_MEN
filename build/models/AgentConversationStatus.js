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
exports.AgentConversationStatus = void 0;
var mongodb_1 = require("mongodb");
var bson_1 = require("bson");
var AgentsDB_1 = require("../globals/config/databses/AgentsDB");
var AgentConversationStatus = /** @class */ (function () {
    function AgentConversationStatus() {
    }
    AgentConversationStatus.Initialize = function () {
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
                        return [4 /*yield*/, this.db.createCollection('agentConversationsStatus')];
                    case 2:
                        _b.collection = _c.sent();
                        AgentConversationStatus.initialized = true;
                        console.log(this.collection.collectionName);
                        return [2 /*return*/, AgentConversationStatus.initialized];
                    case 3:
                        error_1 = _c.sent();
                        console.log('error in Initializing Agent Conversations Status Model');
                        throw new Error(error_1);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    AgentConversationStatus.createConversation = function (cid, email) {
        return __awaiter(this, void 0, void 0, function () {
            var obj;
            return __generator(this, function (_a) {
                try {
                    obj = {
                        cid: new bson_1.ObjectId(cid),
                        email: email,
                        deleted: false,
                        exited: false,
                        removed: false
                    };
                    this.collection.insertOne(obj);
                }
                catch (error) {
                    console.log('Error in Create Agent Conversation');
                    console.log(error);
                }
                return [2 /*return*/];
            });
        });
    };
    AgentConversationStatus.getConversationIDs = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            var conversation;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.collection.find({
                            email: email,
                            deleted: false,
                        }).toArray()];
                    case 1:
                        conversation = _a.sent();
                        // console.log(conversation);
                        return [2 /*return*/, conversation.map(function (m) { return m.cid; })];
                }
            });
        });
    };
    //Group Chat Options
    AgentConversationStatus.getActiveParticipants = function (cid) {
        return __awaiter(this, void 0, void 0, function () {
            var participants, conversation, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        participants = [];
                        return [4 /*yield*/, this.collection.find({ cid: new mongodb_1.ObjectID(cid), deleted: false, removed: false, exited: false }).toArray()];
                    case 1:
                        conversation = _a.sent();
                        if (conversation && conversation.length) {
                            participants = conversation.map(function (c) { return c.email; });
                        }
                        return [2 /*return*/, participants];
                    case 2:
                        err_1 = _a.sent();
                        console.log(err_1);
                        console.log('Error in getting active participants');
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AgentConversationStatus.ExitConversation = function (cid, email) {
        return __awaiter(this, void 0, void 0, function () {
            var err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ cid: new mongodb_1.ObjectID(cid), email: email }, { $set: { exited: true } }, { upsert: false, returnOriginal: false })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_2 = _a.sent();
                        console.log(err_2);
                        console.log('Error in exit conversation');
                        return [2 /*return*/, undefined];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // public static async pushMessageId(cid, email, msgId) {
    //     try {
    //         return await this.collection.findOneAndUpdate({ cid: new ObjectID(cid), email: email }, { $push: { MessageIds: msgId }}, { upsert: false, returnOriginal: false })
    //     } catch (err) {
    //         console.log(err);
    //         console.log('Error in exit conversation');
    //         return undefined;
    //     }
    // }
    AgentConversationStatus.getConversationStatus = function (cid, email) {
        return __awaiter(this, void 0, void 0, function () {
            var err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.find({ cid: new mongodb_1.ObjectID(cid), email: email }).limit(1).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_3 = _a.sent();
                        console.log(err_3);
                        console.log('Error in exit conversation');
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AgentConversationStatus.AddMember = function (cid, email) {
        return __awaiter(this, void 0, void 0, function () {
            var member, status, check, addNew, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        member = {
                            cid: new mongodb_1.ObjectID(cid),
                            email: email,
                            deleted: false,
                            removed: false,
                            exited: false
                        };
                        status = {
                            added: false
                        };
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ cid: new mongodb_1.ObjectID(cid), email: email }, { $set: { removed: false } }, { upsert: false, returnOriginal: false })];
                    case 1:
                        check = _a.sent();
                        if (!(check && check.value)) return [3 /*break*/, 2];
                        status.added = true;
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.collection.insertOne(member)];
                    case 3:
                        addNew = _a.sent();
                        if (addNew && addNew.insertedCount > 0) {
                            status.added = true;
                        }
                        _a.label = 4;
                    case 4: return [2 /*return*/, status];
                    case 5:
                        err_4 = _a.sent();
                        console.log(err_4);
                        console.log('Error in remove member');
                        return [2 /*return*/, undefined];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    AgentConversationStatus.RemoveMember = function (cid, email) {
        return __awaiter(this, void 0, void 0, function () {
            var err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ cid: new mongodb_1.ObjectID(cid), email: email }, { $set: { removed: true } }, { upsert: false, returnOriginal: false })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_5 = _a.sent();
                        console.log(err_5);
                        console.log('Error in remove member');
                        return [2 /*return*/, undefined];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AgentConversationStatus.DeleteConversation = function (cid, email) {
        return __awaiter(this, void 0, void 0, function () {
            var err_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ cid: new mongodb_1.ObjectID(cid), email: email }, { $set: { deleted: true } }, { upsert: false, returnOriginal: false })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_6 = _a.sent();
                        console.log(err_6);
                        console.log('Error in delete conversation');
                        return [2 /*return*/, undefined];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AgentConversationStatus.initialized = true;
    return AgentConversationStatus;
}());
exports.AgentConversationStatus = AgentConversationStatus;
//# sourceMappingURL=AgentConversationStatus.js.map