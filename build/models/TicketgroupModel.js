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
exports.TicketGroupsModel = void 0;
var mongodb_1 = require("mongodb");
var TicketsDB_1 = require("../globals/config/databses/TicketsDB");
var TicketGroupsModel = /** @class */ (function () {
    function TicketGroupsModel() {
    }
    TicketGroupsModel.Initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c, error_1;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 4, , 5]);
                        _a = this;
                        return [4 /*yield*/, TicketsDB_1.TicketsDB.connect()];
                    case 1:
                        _a.db = _d.sent();
                        _b = this;
                        return [4 /*yield*/, this.db.createCollection('ticketgroups')];
                    case 2:
                        _b.collection = _d.sent();
                        _c = this;
                        return [4 /*yield*/, this.db.createCollection('ruleSets')];
                    case 3:
                        _c.collectionRuleSet = _d.sent();
                        TicketGroupsModel.initialized = true;
                        return [2 /*return*/, TicketGroupsModel.initialized];
                    case 4:
                        error_1 = _d.sent();
                        console.log('error in Initializing Groups Model');
                        throw new Error(error_1);
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    TicketGroupsModel.InsertGroup = function (group, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var groupDatabase, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        group.nsp = nsp;
                        return [4 /*yield*/, this.collection.findOne({ nsp: nsp, group_name: group.group_name })];
                    case 1:
                        groupDatabase = _a.sent();
                        if (!!groupDatabase) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.collection.insertOne(group)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3: return [2 /*return*/, undefined];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_2 = _a.sent();
                        console.log('Error in Inserting Tag');
                        console.log(error_2);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    TicketGroupsModel.getRulesetsCount = function (nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collectionRuleSet.aggregate([
                                { "$match": { "nsp": nsp } },
                                { "$group": { "_id": null, "count": { $sum: 1 } } },
                            ]).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_1 = _a.sent();
                        console.log(err_1);
                        console.log('Error in get groups by name');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TicketGroupsModel.toggleActivation = function (nsp, flag, id, by) {
        return __awaiter(this, void 0, void 0, function () {
            var temp_1, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        temp_1 = new mongodb_1.ObjectId(id);
                        return [4 /*yield*/, this.collectionRuleSet.findOneAndUpdate({ nsp: nsp, _id: temp_1 }, { $set: { isActive: flag, lastmodified: { date: new Date().toISOString(), by: by } } }, { returnOriginal: false, upsert: false })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_3 = _a.sent();
                        console.log(error_3);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TicketGroupsModel.addRuleSet = function (rule) {
        return __awaiter(this, void 0, void 0, function () {
            var error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collectionRuleSet.insertOne(JSON.parse(JSON.stringify(rule)))];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_4 = _a.sent();
                        console.log(error_4);
                        console.log('error in Adding Ruleset');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TicketGroupsModel.updateRulset = function (nsp, id, ruleset) {
        return __awaiter(this, void 0, void 0, function () {
            var temp_2, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        delete ruleset._id;
                        temp_2 = new mongodb_1.ObjectId(id);
                        return [4 /*yield*/, this.collectionRuleSet.findOneAndUpdate({ nsp: nsp, _id: temp_2 }, { $set: ruleset }, { returnOriginal: false, upsert: false })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_5 = _a.sent();
                        console.log(error_5);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    //
    TicketGroupsModel.SaveAdmins = function (nsp, group_name, adminList) {
        return __awaiter(this, void 0, void 0, function () {
            var err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ nsp: nsp, group_name: group_name }, { $set: { 'group_admins': adminList } }, { returnOriginal: false, upsert: false })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_2 = _a.sent();
                        console.log(err_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TicketGroupsModel.PushAdmin = function (nsp, group_name, email) {
        return __awaiter(this, void 0, void 0, function () {
            var err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ nsp: nsp, group_name: group_name }, { $push: { 'group_admins': email } }, { returnOriginal: false, upsert: false })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_3 = _a.sent();
                        console.log(err_3);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TicketGroupsModel.IncrementCountOfAgent = function (nsp, group, bestAgent) {
        return __awaiter(this, void 0, void 0, function () {
            var err_4;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.db.collection('ticketgroups').findOneAndUpdate({ nsp: nsp, group_name: group, "agent_list.email": bestAgent }, { $inc: (_a = {}, _a["agent_list.$.count"] = 1, _a) })];
                    case 1: return [2 /*return*/, _b.sent()];
                    case 2:
                        err_4 = _b.sent();
                        console.log(err_4);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TicketGroupsModel.RemoveAdmin = function (nsp, group_name, email) {
        return __awaiter(this, void 0, void 0, function () {
            var err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ nsp: nsp, group_name: group_name }, { $pull: { 'group_admins': email } }, { returnOriginal: false, upsert: false })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_5 = _a.sent();
                        console.log(err_5);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TicketGroupsModel.toggleAdmin = function (nsp, group_name, email, value) {
        return __awaiter(this, void 0, void 0, function () {
            var group, err_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.find({ nsp: nsp, group_name: group_name }).limit(1).toArray()];
                    case 1:
                        group = _a.sent();
                        if (group && group.length) {
                            group[0].agent_list.filter(function (a) { return a.email == email; })[0].isAdmin = value;
                            this.collection.save(group[0]);
                        }
                        return [2 /*return*/, (group && group.length) ? group[0] : undefined];
                    case 2:
                        err_6 = _a.sent();
                        console.log(err_6);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TicketGroupsModel.toggleExclude = function (nsp, group_name, email, value) {
        return __awaiter(this, void 0, void 0, function () {
            var group, err_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.find({ nsp: nsp, group_name: group_name }).limit(1).toArray()];
                    case 1:
                        group = _a.sent();
                        if (group && group.length) {
                            group[0].agent_list.filter(function (a) { return a.email == email; })[0].excluded = value;
                            this.collection.save(group[0]);
                        }
                        return [2 /*return*/, (group && group.length) ? group[0] : undefined];
                    case 2:
                        err_7 = _a.sent();
                        console.log(err_7);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // rule
    TicketGroupsModel.deleteRuleset = function (nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collectionRuleSet.deleteOne({ nsp: nsp })];
                    case 1: 
                    // console.log("id",rule._id);
                    // console.log("name",rule.rulename);
                    // return await this.collectionRuleSet.findOneAndUpdate({ nsp:nsp, rulename:rule.rulename, _id: new ObjectId(rule._id) }, { $pull: { _id: new ObjectId(rule._id) } }, { returnOriginal: false, upsert: false });
                    // , 'ruleset.conditions':rule
                    // console.log("nsp", nsp);
                    return [2 /*return*/, _a.sent()];
                    case 2:
                        error_6 = _a.sent();
                        console.log(error_6);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TicketGroupsModel.getGroupsbyAdmin = function (nsp, email) {
        return __awaiter(this, void 0, void 0, function () {
            var groupNames_1, groupsFromDb, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        groupNames_1 = [];
                        return [4 /*yield*/, this.collection.find({ nsp: nsp }).toArray()];
                    case 1:
                        groupsFromDb = _a.sent();
                        groupsFromDb.forEach(function (g) {
                            if (g.agent_list.filter(function (a) { return a.email == email && a.isAdmin; }).length) {
                                groupNames_1.push(g.group_name);
                            }
                        });
                        return [2 /*return*/, groupNames_1];
                    case 2:
                        error_7 = _a.sent();
                        console.log(error_7);
                        console.log('Error in Getting Group admins');
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TicketGroupsModel.getExcludeGroups = function (nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var groupNames_2, groupsFromDb, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        groupNames_2 = [];
                        return [4 /*yield*/, this.collection.find({ nsp: nsp }).toArray()];
                    case 1:
                        groupsFromDb = _a.sent();
                        groupsFromDb.forEach(function (g) {
                            if (g.generalSettings && g.generalSettings.excludeGroup) {
                                groupNames_2.push(g.group_name);
                            }
                        });
                        return [2 /*return*/, groupNames_2];
                    case 2:
                        error_8 = _a.sent();
                        console.log(error_8);
                        console.log('Error in Getting Group admins');
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TicketGroupsModel.getAgentsAgainstGroup = function (nsp, groupNames) {
        return __awaiter(this, void 0, void 0, function () {
            var agents_1, groupFromDb, groups, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        agents_1 = [];
                        groupNames = Array.isArray(groupNames) ? groupNames : [groupNames];
                        return [4 /*yield*/, this.collection.find({ nsp: nsp, group_name: { $in: groupNames } }).toArray()];
                    case 1:
                        groupFromDb = _a.sent();
                        if (groupFromDb) {
                            groups = groupFromDb.filter(function (g) { return groupNames.includes(g.group_name); }).map(function (g) { return g.agent_list; });
                            // console.log(groups);
                            groups.map(function (g) {
                                g.map(function (agent) {
                                    if (!agents_1.filter(function (a) { return a == agent.email; }).length) {
                                        agents_1.push({ email: agent.email });
                                    }
                                });
                            });
                        }
                        // console.log(agents);
                        return [2 /*return*/, agents_1];
                    case 2:
                        error_9 = _a.sent();
                        console.log(error_9);
                        console.log('Error in getting agents against groups');
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TicketGroupsModel.getAgentsAgainstGroupNotExcluded = function (nsp, groupNames) {
        return __awaiter(this, void 0, void 0, function () {
            var agents_2, groupFromDb, groups, error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        agents_2 = [];
                        groupNames = Array.isArray(groupNames) ? groupNames : [groupNames];
                        return [4 /*yield*/, this.collection.find({ nsp: nsp, group_name: { $in: groupNames } }).toArray()];
                    case 1:
                        groupFromDb = _a.sent();
                        if (groupFromDb) {
                            groups = groupFromDb.filter(function (g) { return groupNames.includes(g.group_name); }).map(function (g) { return g.agent_list; });
                            // console.log(groups);
                            groups.map(function (g) {
                                g.map(function (agent) {
                                    if (!agent.excluded) {
                                        if (!agents_2.filter(function (a) { return a == agent.email; }).length) {
                                            agents_2.push({ email: agent.email });
                                        }
                                    }
                                });
                            });
                        }
                        // console.log(agents);
                        return [2 /*return*/, agents_2];
                    case 2:
                        error_10 = _a.sent();
                        console.log(error_10);
                        console.log('Error in getting agents against groups');
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TicketGroupsModel.getAgentsAgainstGroupObj = function (nsp, groupNames) {
        return __awaiter(this, void 0, void 0, function () {
            var agents_3, groupFromDb, groups, error_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        agents_3 = [];
                        return [4 /*yield*/, this.collection.find({ nsp: nsp, group_name: { $in: groupNames } }).toArray()];
                    case 1:
                        groupFromDb = _a.sent();
                        if (groupFromDb) {
                            groups = groupFromDb.filter(function (g) { return groupNames.includes(g.group_name); }).map(function (g) { return g.agent_list; });
                            // console.log(groups);
                            groups.map(function (g) {
                                g.map(function (agent) {
                                    if (!agents_3.filter(function (a) { return a == agent.email; }).length) {
                                        agents_3.push({ email: agent.email });
                                    }
                                });
                            });
                        }
                        // console.log(agents);
                        return [2 /*return*/, agents_3];
                    case 2:
                        error_11 = _a.sent();
                        console.log(error_11);
                        console.log('Error in getting agents against groups');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TicketGroupsModel.getAllAgentsAgainstAdmin = function (nsp, email) {
        return __awaiter(this, void 0, void 0, function () {
            var agents, groups;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        agents = [];
                        return [4 /*yield*/, TicketGroupsModel.getGroupsbyAdmin(nsp, email)];
                    case 1:
                        groups = _a.sent();
                        return [4 /*yield*/, TicketGroupsModel.getAgentsAgainstGroup(nsp, groups)];
                    case 2:
                        agents = _a.sent();
                        return [2 /*return*/, agents];
                }
            });
        });
    };
    TicketGroupsModel.GetRulesetByNSP = function (nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var ruleFromDb, error_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collectionRuleSet.find({ nsp: nsp }).toArray()];
                    case 1:
                        ruleFromDb = _a.sent();
                        return [2 /*return*/, ruleFromDb];
                    case 2:
                        error_12 = _a.sent();
                        console.log(error_12);
                        console.log('Error in Getting RuleSets');
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TicketGroupsModel.getGroupByName = function (nsp, name) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    return [2 /*return*/, this.collection.find({ nsp: nsp, group_name: name }).limit(1).toArray()];
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
    TicketGroupsModel.deleteRule = function (nsp, id) {
        return __awaiter(this, void 0, void 0, function () {
            var temp_3, error_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        temp_3 = new mongodb_1.ObjectId(id);
                        return [4 /*yield*/, this.collectionRuleSet.deleteOne({ nsp: nsp, _id: temp_3 })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_13 = _a.sent();
                        console.log(error_13);
                        console.log('error in deleting Rule');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TicketGroupsModel.GetGroupDetailsByNSP = function (nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var groupFromDb, error_14;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.find({ nsp: nsp }).toArray()];
                    case 1:
                        groupFromDb = _a.sent();
                        return [2 /*return*/, groupFromDb];
                    case 2:
                        error_14 = _a.sent();
                        console.log(error_14);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TicketGroupsModel.GetGroupsCount = function (nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var error_15;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.aggregate([
                                { "$match": { "nsp": nsp } },
                                { "$group": { "_id": null, "count": { $sum: 1 } } },
                            ]).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_15 = _a.sent();
                        console.log(error_15);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TicketGroupsModel.GetGroupAdmins = function (nsp, group_name) {
        return __awaiter(this, void 0, void 0, function () {
            var admins, groupFromDb, error_16;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        admins = [];
                        return [4 /*yield*/, this.collection.find({ nsp: nsp, group_name: group_name }).limit(1).toArray()];
                    case 1:
                        groupFromDb = _a.sent();
                        if (groupFromDb && groupFromDb.length && groupFromDb[0].agent_list) {
                            admins = groupFromDb[0].agent_list.filter(function (a) { return a.isAdmin; }).map(function (a) { return a.email; });
                        }
                        return [2 /*return*/, admins];
                    case 2:
                        error_16 = _a.sent();
                        console.log(error_16);
                        return [2 /*return*/, undefined];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TicketGroupsModel.getAgentAssignedCount = function (email, state) {
        return __awaiter(this, void 0, void 0, function () {
            var count, error_17;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.db.collection('tickets').find({ assigned_to: email, state: state }).toArray()];
                    case 1:
                        count = _a.sent();
                        return [2 /*return*/, count];
                    case 2:
                        error_17 = _a.sent();
                        console.log(error_17);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TicketGroupsModel.deleteGroup = function (group_name, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var error_18;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.collection.deleteOne({ nsp: nsp, group_name: group_name })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.collection.find({ nsp: nsp }).toArray()];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_18 = _a.sent();
                        console.log('Error in Deleting groups');
                        console.log(error_18);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    TicketGroupsModel.SetAutoAssign = function (nsp, group_name, auto_assign) {
        return __awaiter(this, void 0, void 0, function () {
            var err_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ nsp: nsp, group_name: group_name }, { $set: { auto_assign: auto_assign } }, { returnOriginal: false, upsert: false })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_8 = _a.sent();
                        console.log(err_8);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // public static async setICONNGroupAuto(nsp, group_name, ICONNAuto) {
    //     try {
    //         return await this.collection.findOneAndUpdate({ nsp: nsp, group_name: group_name }, { $set: { ['generalSettings.enabled']: ICONNAuto } }, { returnOriginal: false, upsert: false });
    //     } catch (err) {
    //         console.log(err);
    //     }
    // }
    TicketGroupsModel.importSaveSettings = function (nsp, group_name, time, limit, fallbackLimitExceed, fallbackNoShift, unavailHrs, flag) {
        return __awaiter(this, void 0, void 0, function () {
            var err_9;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ nsp: nsp, group_name: group_name }, { $set: (_a = {}, _a['generalSettings.unEntertainedTime'] = time, _a['generalSettings.enabled'] = flag, _a['generalSettings.assignmentLimit'] = limit, _a['generalSettings.fallbackNoShift'] = fallbackNoShift && fallbackNoShift.length ? fallbackNoShift : '', _a['generalSettings.fallbackLimitExceed'] = fallbackLimitExceed && fallbackLimitExceed.length ? fallbackLimitExceed : '', _a['generalSettings.unAvailibilityHours'] = unavailHrs, _a) }, { returnOriginal: false, upsert: false })];
                    case 1: return [2 /*return*/, _b.sent()];
                    case 2:
                        err_9 = _b.sent();
                        console.log(err_9);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TicketGroupsModel.saveGeneralSettings = function (nsp, group_name, settings) {
        return __awaiter(this, void 0, void 0, function () {
            var err_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ nsp: nsp, group_name: group_name }, { $set: { generalSettings: settings } }, { returnOriginal: false, upsert: false })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_10 = _a.sent();
                        console.log(err_10);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TicketGroupsModel.getGeneralSettings = function (nsp, group_name) {
        return __awaiter(this, void 0, void 0, function () {
            var result, err_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.find({ nsp: nsp, group_name: group_name }).project({ generalSettings: 1 }).limit(1).toArray()];
                    case 1:
                        result = _a.sent();
                        if (result && result.length)
                            return [2 /*return*/, result[0].generalSettings];
                        return [3 /*break*/, 3];
                    case 2:
                        err_11 = _a.sent();
                        console.log(err_11);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TicketGroupsModel.GetAutoAssign = function (nsp, group_name) {
        return __awaiter(this, void 0, void 0, function () {
            var err_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.find({ nsp: nsp, group_name: group_name }).limit(1).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_12 = _a.sent();
                        console.log(err_12);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TicketGroupsModel.AssignAgent = function (agent_email, group_name, nsp, agent_list) {
        return __awaiter(this, void 0, void 0, function () {
            var error_19;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ nsp: nsp, group_name: group_name }, { $push: { 'agent_list': agent_list } }, { returnOriginal: false, upsert: false })];
                    case 1: 
                    // let agent_list: AgentListInfo = {
                    //     email: agent_email,
                    //     count: 0
                    // }
                    return [2 /*return*/, _a.sent()];
                    case 2:
                        error_19 = _a.sent();
                        console.log('Error in Assign Agent');
                        console.log(error_19);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TicketGroupsModel.UnAssignAgent = function (agent_email, group_name, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var error_20;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ nsp: nsp, group_name: group_name }, { $pull: { 'agent_list': { email: agent_email } } }, { returnOriginal: false, upsert: false })];
                    case 1: 
                    // let agent_list: AgentListInfo = {
                    //     email: agent_email,
                    //     count: 0
                    // }
                    return [2 /*return*/, _a.sent()];
                    case 2:
                        error_20 = _a.sent();
                        console.log('Error in UnAssign Agent');
                        console.log(error_20);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TicketGroupsModel.GetGroupsAgainstAgent = function (nsp, agent_email) {
        return __awaiter(this, void 0, void 0, function () {
            var groups, groupsFromArr, err_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        groups = [];
                        return [4 /*yield*/, this.collection.find({ nsp: nsp, 'agent_list.email': agent_email }).toArray()];
                    case 1:
                        groupsFromArr = _a.sent();
                        groups = groupsFromArr.map(function (a) { return a.group_name; });
                        return [2 /*return*/, groups];
                    case 2:
                        err_13 = _a.sent();
                        console.log('Error in getting groups agianst agent');
                        console.log(err_13);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TicketGroupsModel.initialized = false;
    return TicketGroupsModel;
}());
exports.TicketGroupsModel = TicketGroupsModel;
//# sourceMappingURL=TicketgroupModel.js.map