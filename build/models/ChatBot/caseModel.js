"use strict";
/// <reference path="../../node_modules/@types/mongodb/index.d.ts" />
// Created By Saad Ismail Shaikh
// Date : 29-10-18
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
exports.CaseModel = void 0;
var mongodb_1 = require("mongodb");
var ChatsDB_1 = require("../../globals/config/databses/ChatsDB");
var CaseModel = /** @class */ (function () {
    function CaseModel() {
    }
    CaseModel.Initialize = function () {
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
                        return [4 /*yield*/, this.db.createCollection('cases')];
                    case 2:
                        _b.collection = _c.sent();
                        console.log(this.collection.collectionName);
                        CaseModel.initialized = true;
                        return [2 /*return*/, CaseModel.initialized];
                    case 3:
                        error_1 = _c.sent();
                        console.log('error in Initializing Cases Model');
                        throw new Error(error_1);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    CaseModel.AddCase = function (value) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    return [2 /*return*/, this.collection.insertOne(value)];
                }
                catch (error) {
                    console.log('error in Adding Case');
                    console.log(error);
                }
                return [2 /*return*/];
            });
        });
    };
    CaseModel.FindOne = function (id, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.find({
                                $and: [
                                    { _id: new mongodb_1.ObjectID(id) },
                                    { nsp: nsp },
                                ]
                            }).limit(1).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_2 = _a.sent();
                        console.log('error in Finding Case');
                        console.log(error_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CaseModel.ReferenceCase = function (caseId, machineId, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var Case, found_1, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, CaseModel.FindOne(caseId, nsp)];
                    case 1:
                        Case = _a.sent();
                        if (!Case) return [3 /*break*/, 3];
                        found_1 = false;
                        Case[0].assignedTo = Case[0].assignedTo.map(function (item) {
                            if (item.mid == machineId) {
                                item.referenceCount += 1;
                                found_1 = true;
                            }
                            return item;
                        });
                        if (!found_1) {
                            Case[0].assignedTo.push({ mid: machineId, referenceCount: 1 });
                        }
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ _id: new mongodb_1.ObjectID(caseId) }, { $set: { assignedTo: Case[0].assignedTo } })];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3: throw new Error('Case Not Found');
                    case 4:
                        error_3 = _a.sent();
                        console.log(error_3);
                        return [2 /*return*/, undefined];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    CaseModel.DeReferenceCase = function (caseId, machineId, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var Case, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, CaseModel.FindOne(caseId, nsp)];
                    case 1:
                        Case = _a.sent();
                        if (!Case) return [3 /*break*/, 3];
                        Case[0].assignedTo = Case[0].assignedTo.filter(function (item) {
                            if (item.mid == machineId && item.referenceCount > 1) {
                                item.referenceCount -= 1;
                                return item.mid == machineId;
                            }
                            else {
                                return item.mid != machineId;
                            }
                        });
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ _id: new mongodb_1.ObjectID(caseId) }, { $set: { assignedTo: Case[0].assignedTo } }, { returnOriginal: false })];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3: throw new Error('Case Not Found');
                    case 4:
                        error_4 = _a.sent();
                        console.log(error_4);
                        return [2 /*return*/, undefined];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    CaseModel.Delete = function (id, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.deleteOne({
                                $and: [
                                    { _id: new mongodb_1.ObjectID(id) },
                                    { nsp: nsp },
                                ]
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_5 = _a.sent();
                        console.log('error in Deleting Case');
                        console.log(error_5);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CaseModel.Edit = function (id, data, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ _id: new mongodb_1.ObjectID(id) }, { $set: { criteria: data.criteria, matchingCriteria: data.matchingCriteria, expression: data.expression } }, { returnOriginal: false })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_6 = _a.sent();
                        console.log('error in Editing Case');
                        console.log(error_6);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CaseModel.GetCases = function (nsp, id) {
        return __awaiter(this, void 0, void 0, function () {
            var error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        if (!id) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.collection.find({
                                nsp: nsp,
                                _id: { $gt: new mongodb_1.ObjectID(id) }
                            }).sort({ _id: -1 }).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [4 /*yield*/, this.collection.find({ nsp: nsp }).sort({ _id: -1 }).toArray()];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_7 = _a.sent();
                        console.log('error in Getting Cases');
                        console.log(error_7);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    CaseModel.GetCaseByTagName = function (nsp, tagName) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.collection.find({ nsp: nsp, tagName: tagName }).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    CaseModel.GetCaseById = function (nsp, id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.collection.find({ nsp: nsp, _id: new mongodb_1.ObjectID(id) }).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    CaseModel.initialized = false;
    return CaseModel;
}());
exports.CaseModel = CaseModel;
//# sourceMappingURL=caseModel.js.map