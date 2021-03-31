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
exports.TagsModel = void 0;
var ChatsDB_1 = require("../globals/config/databses/ChatsDB");
var TagsModel = /** @class */ (function () {
    function TagsModel() {
    }
    TagsModel.Initialize = function () {
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
                        return [4 /*yield*/, this.db.createCollection('tags')];
                    case 2:
                        _b.collection = _c.sent();
                        console.log(this.collection.collectionName);
                        TagsModel.initialized = true;
                        return [2 /*return*/, TagsModel.initialized];
                    case 3:
                        error_1 = _c.sent();
                        console.log('error in Initializing Tags Model');
                        throw new Error(error_1);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    TagsModel.InsertTag = function (tag_name, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var tagInfo, tags, tag, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        tagInfo = {
                            tag: tag_name,
                            agent_list: []
                        };
                        tags = {
                            nsp: nsp,
                            tags: [tagInfo]
                        };
                        return [4 /*yield*/, this.collection.findOne({ nsp: nsp })];
                    case 1:
                        tag = _a.sent();
                        if (!!tag) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.collection.insertOne(JSON.parse(JSON.stringify(tags)))];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3: return [4 /*yield*/, this.collection.findOneAndUpdate({ nsp: nsp }, { $push: { tags: tagInfo } }, { returnOriginal: false, upsert: false })];
                    case 4: return [2 /*return*/, _a.sent()];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_2 = _a.sent();
                        console.log('Error in Inserting Tag');
                        console.log(error_2);
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    TagsModel.DeleteTag = function (tag_name, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ nsp: nsp }, { $pull: { tags: { tag: tag_name } } }, { returnOriginal: false, upsert: false })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_3 = _a.sent();
                        console.log('Error in Deleting Tag');
                        console.log(error_3);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TagsModel.AssignAgent = function (agent_email, tag_name, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var agent_list, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        agent_list = {
                            email: agent_email,
                            count: 0,
                            isAdmin: false,
                            excluded: false
                        };
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ nsp: nsp, tags: { $elemMatch: { tag: tag_name } } }, { $push: { 'tags.$.agent_list': agent_list } }, { returnOriginal: false, upsert: false })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_4 = _a.sent();
                        console.log('Error in AssignAgent');
                        console.log(error_4);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TagsModel.addTagKeyword = function (keyword, tag_name, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ nsp: nsp, tags: { $elemMatch: { tag: tag_name } } }, { $push: { 'tags.$.tag_keywords': keyword } }, { returnOriginal: false, upsert: false })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_5 = _a.sent();
                        console.log('Error in AssignAgent');
                        console.log(error_5);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TagsModel.deleteTagKeyword = function (keyword, tag_name, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ nsp: nsp, tags: { $elemMatch: { tag: tag_name } } }, { $pull: { 'tags.$.tag_keywords': keyword } }, { returnOriginal: false, upsert: false })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_6 = _a.sent();
                        console.log('Error in AssignAgent');
                        console.log(error_6);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TagsModel.UnAssignAgent = function (agent_email, tag_name, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var agent_list, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        agent_list = {
                            email: agent_email,
                            count: 0,
                            isAdmin: false,
                            excluded: false
                        };
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ nsp: nsp, tags: { $elemMatch: { tag: tag_name } } }, { $pull: { 'tags.$.agent_list': { email: agent_email } } }, { returnOriginal: false, upsert: false })];
                    case 1: 
                    // console.log(agent_email);
                    return [2 /*return*/, _a.sent()];
                    case 2:
                        error_7 = _a.sent();
                        console.log('Error in UnAssignAgent');
                        console.log(error_7);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TagsModel.UpdateAgentTicketCount = function (agent_email, tag_name, nsp, increment) {
        if (increment === void 0) { increment = true; }
        return __awaiter(this, void 0, void 0, function () {
            var tags, _i, _a, t, _b, _c, agent, error_8;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.findOne({ nsp: nsp })];
                    case 1:
                        tags = _d.sent();
                        // console.log(tags.tags);
                        for (_i = 0, _a = tags.tags; _i < _a.length; _i++) {
                            t = _a[_i];
                            if (t.tag == tag_name) {
                                for (_b = 0, _c = t.agent_list; _b < _c.length; _b++) {
                                    agent = _c[_b];
                                    if (agent.email == agent_email) {
                                        // console.log("agent found!");
                                        if (increment) {
                                            agent.count += 1;
                                        }
                                        else {
                                            if (agent.count != 0) {
                                                agent.count -= 1;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        this.collection.updateOne({ nsp: nsp }, { $set: { tags: tags.tags } }, { upsert: false });
                        return [3 /*break*/, 3];
                    case 2:
                        error_8 = _d.sent();
                        console.log(error_8);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TagsModel.GetTagDetailsByNSP = function (nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var tag, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.findOne({ nsp: nsp })];
                    case 1:
                        tag = _a.sent();
                        return [2 /*return*/, tag];
                    case 2:
                        error_9 = _a.sent();
                        console.log(error_9);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TagsModel.initialized = false;
    return TagsModel;
}());
exports.TagsModel = TagsModel;
//# sourceMappingURL=tagsModel.js.map