"use strict";
// Created By Saad Ismail Shaikh
// Date : 22-1-18
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
exports.KnowledgeBaseModel = void 0;
var Marketing_DB_1 = require("../globals/config/databses/Marketing-DB");
var KnowledgeBaseModel = /** @class */ (function () {
    function KnowledgeBaseModel() {
    }
    KnowledgeBaseModel.Initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, error_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 3, , 4]);
                        _a = this;
                        return [4 /*yield*/, Marketing_DB_1.MarketingDB.connect()];
                    case 1:
                        _a.db = _c.sent();
                        _b = this;
                        return [4 /*yield*/, this.db.createCollection('knowledgebase')];
                    case 2:
                        _b.collection = _c.sent();
                        console.log(this.collection.collectionName);
                        KnowledgeBaseModel.initialized = true;
                        return [2 /*return*/, KnowledgeBaseModel.initialized];
                    case 3:
                        error_1 = _c.sent();
                        console.log('error in Initializing Tokens Model');
                        throw new Error(error_1);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    KnowledgeBaseModel.addKnowledgeBase = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    // if(data.type == 'faq'){
                    //     await this.collection.updateMany({ nsp: data.nsp, type: data.type }, { $set: { 'active': false} });
                    //     return this.collection.insertOne(data);
                    // }else{
                    //     return this.collection.insertOne(data);
                    // }
                    return [2 /*return*/, this.collection.insertOne(data)];
                }
                catch (error) {
                    console.log(error);
                    console.log('error in Insert Token');
                }
                return [2 /*return*/];
            });
        });
    };
    KnowledgeBaseModel.GetKnowledgeBase = function (type, nsp, limit) {
        if (limit === void 0) { limit = 0; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    if (!limit) {
                        return [2 /*return*/, this.collection.find({ nsp: nsp, type: type }).sort({ _id: -1 }).toArray()];
                    }
                    else {
                        return [2 /*return*/, this.collection.find({ nsp: nsp, type: type }).sort({ _id: -1 }).limit(1).toArray()];
                    }
                }
                catch (error) {
                    console.log(error);
                    console.log('error in Validate Token');
                }
                return [2 /*return*/];
            });
        });
    };
    KnowledgeBaseModel.GetKnowledgeBaseDocuments = function (nsp, limit) {
        if (limit === void 0) { limit = 0; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    if (!limit) {
                        return [2 /*return*/, this.collection.aggregate([
                                {
                                    '$match': {
                                        'nsp': nsp,
                                        '$or': [
                                            {
                                                'type': 'news'
                                            }, {
                                                'type': 'sla'
                                            }, {
                                                'type': 'itp'
                                            }
                                        ]
                                    }
                                }, {
                                    '$sort': {
                                        '_id': -1
                                    }
                                }
                            ]).toArray()];
                    }
                    else {
                        return [2 /*return*/, this.collection.aggregate([
                                {
                                    '$match': {
                                        'nsp': nsp,
                                        '$or': [
                                            {
                                                'type': 'news'
                                            }, {
                                                'type': 'sla'
                                            }, {
                                                'type': 'itp'
                                            }
                                        ]
                                    }
                                }, {
                                    '$sort': {
                                        '_id': -1
                                    }
                                }
                            ]).limit(1).toArray()];
                    }
                }
                catch (error) {
                    console.log(error);
                    console.log('error in Validate Token');
                }
                return [2 /*return*/];
            });
        });
    };
    KnowledgeBaseModel.removeKnowledgeBase = function (type, nsp, filename) {
        return __awaiter(this, void 0, void 0, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.collection.deleteOne({ nsp: nsp, type: type, fileName: filename })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.collection.find({ nsp: nsp, type: type }).toArray()];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_2 = _a.sent();
                        console.log(error_2);
                        console.log('error in Validate Token');
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    KnowledgeBaseModel.ToggleKnowledgeBase = function (type, nsp, filename, active) {
        return __awaiter(this, void 0, void 0, function () {
            var error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        // if(type == 'faq'){
                        //     await this.collection.updateMany({ nsp: nsp, type: type }, { $set: { 'active': false} });
                        //     await this.collection.updateOne({ nsp: nsp, type: type , fileName : filename  }, { $set: { 'active': true} });
                        //     return await this.collection.find({nsp: nsp, type: type}).sort({ _id: -1 }).toArray();   
                        // }else{
                        //     await this.collection.updateOne({ nsp: nsp, type: type , fileName : filename  }, { $set: { 'active': active} });
                        //     return await this.collection.find({nsp: nsp, type: type}).sort({ _id: -1 }).toArray();  
                        // }             
                        return [4 /*yield*/, this.collection.updateOne({ nsp: nsp, type: type, fileName: filename }, { $set: { 'active': active } })];
                    case 1:
                        // if(type == 'faq'){
                        //     await this.collection.updateMany({ nsp: nsp, type: type }, { $set: { 'active': false} });
                        //     await this.collection.updateOne({ nsp: nsp, type: type , fileName : filename  }, { $set: { 'active': true} });
                        //     return await this.collection.find({nsp: nsp, type: type}).sort({ _id: -1 }).toArray();   
                        // }else{
                        //     await this.collection.updateOne({ nsp: nsp, type: type , fileName : filename  }, { $set: { 'active': active} });
                        //     return await this.collection.find({nsp: nsp, type: type}).sort({ _id: -1 }).toArray();  
                        // }             
                        _a.sent();
                        return [4 /*yield*/, this.collection.find({ nsp: nsp, type: type }).sort({ _id: -1 }).toArray()];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_3 = _a.sent();
                        console.log(error_3);
                        console.log('error in Validate Token');
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    KnowledgeBaseModel.GetKnowledgeBaseByFileName = function (type, nsp, filename) {
        return __awaiter(this, void 0, void 0, function () {
            var knowledgebase, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.find({ type: type, nsp: nsp, fileName: filename }).limit(1).toArray()];
                    case 1:
                        knowledgebase = _a.sent();
                        if (knowledgebase.length) {
                            return [2 /*return*/, knowledgebase[0]];
                        }
                        else {
                            return [2 /*return*/, undefined];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        console.log(error_4);
                        console.log('error in Validate Token');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    KnowledgeBaseModel.initialized = false;
    // Current Visitor Array
    KnowledgeBaseModel.AgentsList = {};
    return KnowledgeBaseModel;
}());
exports.KnowledgeBaseModel = KnowledgeBaseModel;
//# sourceMappingURL=knowledgeBaseModel.js.map