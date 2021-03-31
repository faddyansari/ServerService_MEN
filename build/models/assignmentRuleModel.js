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
exports.AssignmentRules = void 0;
var bson_1 = require("bson");
var ChatsDB_1 = require("../globals/config/databses/ChatsDB");
var AssignmentRules = /** @class */ (function () {
    function AssignmentRules() {
    }
    AssignmentRules.Initialize = function () {
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
                        return [4 /*yield*/, this.db.createCollection('assignmentRules')];
                    case 2:
                        _b.collection = _c.sent();
                        AssignmentRules.initialized = true;
                        console.log(this.collection.collectionName);
                        return [2 /*return*/, AssignmentRules.initialized];
                    case 3:
                        error_1 = _c.sent();
                        console.log('error in Initializing Assignment Rules Model');
                        throw new Error(error_1);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    AssignmentRules.createRule = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.insertOne(data)];
                    case 1: 
                    // console.log("createLog");
                    // console.log(data);
                    return [2 /*return*/, _a.sent()];
                    case 2:
                        error_2 = _a.sent();
                        console.log('Error in Create Assignment Rule');
                        console.log(error_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AssignmentRules.getRules = function (nsp, id) {
        return __awaiter(this, void 0, void 0, function () {
            var error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        if (!id) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.collection.find({
                                nsp: nsp,
                                _id: { $gt: new bson_1.ObjectID(id) }
                            }).sort({ _id: -1 }).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [4 /*yield*/, this.collection.find({ nsp: nsp }).sort({ _id: -1 }).toArray()];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_3 = _a.sent();
                        console.log(error_3);
                        throw new Error("Can't Find Assignment Rule In Exists");
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    AssignmentRules.getRuleSets = function (nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.db.collection('assignmentRuleSet').find({ nsp: nsp, isActive: true }).sort({ _id: -1 }).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_4 = _a.sent();
                        console.log(error_4);
                        throw new Error("Can't Find Assignment Rule In Exists");
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AssignmentRules.Edit = function (id, data, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ _id: new bson_1.ObjectID(id), nsp: nsp }, { $set: { key: data.key, value: data.value, type: data.type, operator: data.operator } }, { returnOriginal: false })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_5 = _a.sent();
                        console.log('error in Editing Case');
                        console.log(error_5);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AssignmentRules.DeleteRule = function (id, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.deleteOne({
                                $and: [
                                    { _id: new bson_1.ObjectID(id) },
                                    { nsp: nsp },
                                ]
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_6 = _a.sent();
                        console.log('error in Deleting Case');
                        console.log(error_6);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AssignmentRules.getCollectionsFromFilter = function (filter) {
        return __awaiter(this, void 0, void 0, function () {
            var error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.db.listCollections().toArray()
                            // let matched = await (a as any).filter(collection => {
                            //     return collection.name
                            // })
                        ];
                    case 1: return [2 /*return*/, _a.sent()
                        // let matched = await (a as any).filter(collection => {
                        //     return collection.name
                        // })
                    ];
                    case 2:
                        error_7 = _a.sent();
                        console.log('error in Fetching Filtered Results');
                        console.log(error_7);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AssignmentRules.getFilteredResultKeys = function (filterResults, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var mapping;
            return __generator(this, function (_a) {
                try {
                    mapping = {};
                    // let updatedList = filterResults.map(async key => {
                    //     //console.log(key);
                    //     mapping[key] = (await this.db.collection(key).find({
                    //         $or: [
                    //             { nsp: nsp },
                    //             { name: nsp },
                    //         ]
                    //     }).limit(1).toArray())[0];
                    //    // console.log(mapping.key);
                    //     return key
                    // })
                    // await Promise.all(updatedList);
                    return [2 /*return*/, mapping
                        // let matched = await (a as any).filter(collection => {
                        //     return collection.name
                        // })
                    ];
                    // let matched = await (a as any).filter(collection => {
                    //     return collection.name
                    // })
                }
                catch (error) {
                    console.log('error in Fetching Filtered Results Keys');
                    console.log(error);
                }
                return [2 /*return*/];
            });
        });
    };
    AssignmentRules.initialized = true;
    return AssignmentRules;
}());
exports.AssignmentRules = AssignmentRules;
//# sourceMappingURL=assignmentRuleModel.js.map