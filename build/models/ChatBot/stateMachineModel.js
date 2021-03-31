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
exports.StateMachineModel = void 0;
var mongodb_1 = require("mongodb");
var caseModel_1 = require("./caseModel");
var ChatsDB_1 = require("../../globals/config/databses/ChatsDB");
var StateMachineModel = /** @class */ (function () {
    function StateMachineModel() {
    }
    StateMachineModel.Initialize = function () {
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
                        return [4 /*yield*/, this.db.createCollection('stateMachines')];
                    case 2:
                        _b.collection = _c.sent();
                        StateMachineModel.initialized = true;
                        console.log(this.collection.collectionName);
                        return [2 /*return*/, StateMachineModel.initialized];
                    case 3:
                        error_1 = _c.sent();
                        console.log('error in Initializing StateMachines Model');
                        throw new Error(error_1);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    StateMachineModel.AddMachine = function (value) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    return [2 /*return*/, this.collection.insertOne(value)];
                }
                catch (error) {
                    console.log('error in Adding Statemachin');
                    console.log(error);
                }
                return [2 /*return*/];
            });
        });
    };
    StateMachineModel.FindByName = function (nsp, name) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.collection.find({ nsp: nsp, name: name }).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    StateMachineModel.FindOneById = function (id, nsp) {
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
    StateMachineModel.FindOne = function (name, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.find({
                                $and: [
                                    { name: name },
                                    { nsp: nsp },
                                ]
                            }).limit(1).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_3 = _a.sent();
                        console.log('error in Finding Case');
                        console.log(error_3);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    StateMachineModel.Delete = function (id, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var error_4;
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
                        error_4 = _a.sent();
                        console.log('error in Deleting Case');
                        console.log(error_4);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    StateMachineModel.GetMachines = function (nsp, id) {
        return __awaiter(this, void 0, void 0, function () {
            var error_5;
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
                        error_5 = _a.sent();
                        console.log('error in Getting Machines');
                        console.log(error_5);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    StateMachineModel.MatchState = function (machineId, stateName) {
        return __awaiter(this, void 0, void 0, function () {
            var error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.find({
                                $and: [
                                    { _id: new mongodb_1.ObjectID(machineId) },
                                    { states: { $elemMatch: { name: stateName } } }
                                ]
                            }).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_6 = _a.sent();
                        console.log(error_6);
                        console.log('error in Match State');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    StateMachineModel.AddState = function (machineId, state) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.collection.updateOne({ _id: new mongodb_1.ObjectID(machineId) }, { $push: { states: state } })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    StateMachineModel.AddHandler = function (machineId, stateName, handler) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.collection.findOneAndUpdate({ _id: new mongodb_1.ObjectID(machineId) }, { $push: { "states.$[t].handlers": handler } }, { arrayFilters: [{ "t.name": stateName }] })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    StateMachineModel.UpdateMachine = function (machineId, nsp, key, stateMachine) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.collection.findOneAndUpdate({ _id: new mongodb_1.ObjectID(machineId) }, { $set: (_a = {}, _a[key] = stateMachine[key], _a) }, { returnOriginal: false })];
                    case 1: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    StateMachineModel.DeleteHandler = function (machineId, caseId, handlerIndex, stateName, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var stateMachine, index;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.FindOneById(machineId, nsp)];
                    case 1:
                        stateMachine = _a.sent();
                        if (!(stateMachine && stateMachine.length)) return [3 /*break*/, 3];
                        for (index = 0; index < stateMachine[0].states.length; index++) {
                            if (stateMachine[0].states[index].name == stateName) {
                                stateMachine[0].states[index].handlers.splice(parseInt(handlerIndex), 1);
                                break;
                            }
                        }
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ _id: new mongodb_1.ObjectID(machineId) }, { $set: { states: stateMachine[0].states } }, { returnOriginal: false })];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3: return [2 /*return*/, undefined];
                }
            });
        });
    };
    //#region Engine Functions
    StateMachineModel.CreateMachine = function (machineId, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var stateMachine, temp_1, i, item, index, Case, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 10, , 11]);
                        return [4 /*yield*/, this.FindOneById(machineId, nsp)];
                    case 1:
                        stateMachine = _a.sent();
                        temp_1 = {};
                        if (!(stateMachine && stateMachine.length)) return [3 /*break*/, 8];
                        i = 0;
                        _a.label = 2;
                    case 2:
                        if (!(i < stateMachine[0].states.length)) return [3 /*break*/, 7];
                        item = stateMachine[0].states[i];
                        if (!temp_1[item.name]) {
                            temp_1[item.name] = {};
                            temp_1[item.name].handlers = [];
                        }
                        index = 0;
                        _a.label = 3;
                    case 3:
                        if (!(index < item.handlers.length)) return [3 /*break*/, 6];
                        return [4 /*yield*/, caseModel_1.CaseModel.GetCaseById(nsp, item.handlers[index].caseId)];
                    case 4:
                        Case = _a.sent();
                        if (Case) {
                            temp_1[item.name].handlers.push({
                                action: item.handlers[index].action,
                                expression: new RegExp(Case[0].expression),
                                responseText: Case[0].responseText,
                                transition: item.handlers[index].transition
                            });
                        }
                        _a.label = 5;
                    case 5:
                        index++;
                        return [3 /*break*/, 3];
                    case 6:
                        i++;
                        return [3 /*break*/, 2];
                    case 7: return [2 /*return*/, { name: stateMachine[0].name, stateMachine: temp_1 }];
                    case 8: throw new Error('StateMachine Not Found');
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        error_7 = _a.sent();
                        console.log(error_7);
                        console.log('error in Creating Machine');
                        return [3 /*break*/, 11];
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    StateMachineModel.initialized = false;
    return StateMachineModel;
}());
exports.StateMachineModel = StateMachineModel;
//# sourceMappingURL=stateMachineModel.js.map