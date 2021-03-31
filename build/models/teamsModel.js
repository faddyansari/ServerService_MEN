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
exports.TeamsModel = void 0;
var mongodb_1 = require("mongodb");
var TicketsDB_1 = require("../globals/config/databses/TicketsDB");
var sessionsManager_1 = require("../globals/server/sessionsManager");
var TeamsModel = /** @class */ (function () {
    function TeamsModel() {
    }
    TeamsModel.Initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, error_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 3, , 4]);
                        _a = this;
                        return [4 /*yield*/, TicketsDB_1.TicketsDB.connect()];
                    case 1:
                        _a.db = _c.sent();
                        _b = this;
                        return [4 /*yield*/, this.db.createCollection('teams')];
                    case 2:
                        _b.collection = _c.sent();
                        console.log(this.collection.collectionName);
                        TeamsModel.initialized = true;
                        return [2 /*return*/, TeamsModel.initialized];
                    case 3:
                        error_1 = _c.sent();
                        console.log('error in Initializing Teams Model');
                        throw new Error(error_1);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    TeamsModel.getTeams = function (nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.find({ nsp: nsp }).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_1 = _a.sent();
                        console.log('Error in getting teams');
                        console.log(err_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TeamsModel.getTeamsCount = function (nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var err_2;
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
                        err_2 = _a.sent();
                        console.log('Error in getting teams');
                        console.log(err_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TeamsModel.insertTeam = function (team) {
        return __awaiter(this, void 0, void 0, function () {
            var err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.insertOne(team)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_3 = _a.sent();
                        console.log('Error in inserting team');
                        console.log(err_3);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TeamsModel.deleteTeam = function (id, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var deletion, teams, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, this.collection.deleteOne({ _id: new mongodb_1.ObjectId(id) })];
                    case 1:
                        deletion = _a.sent();
                        if (!(deletion && deletion.deletedCount != 0)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.collection.find({ nsp: nsp }).toArray()];
                    case 2:
                        teams = _a.sent();
                        return [2 /*return*/, (teams && teams.length) ? teams : []];
                    case 3: return [2 /*return*/, []];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        err_4 = _a.sent();
                        console.log('Error in deleting team');
                        console.log(err_4);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    TeamsModel.updateTeam = function (id, team_name) {
        return __awaiter(this, void 0, void 0, function () {
            var err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ _id: new mongodb_1.ObjectId(id) }, { $set: { team_name: team_name } }, { returnOriginal: false, upsert: false })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_5 = _a.sent();
                        console.log('Error in inserting team');
                        console.log(err_5);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TeamsModel.addAgents = function (id, emails) {
        return __awaiter(this, void 0, void 0, function () {
            var emailsObj_1, teams, err_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        emailsObj_1 = [];
                        emails.forEach(function (email) {
                            emailsObj_1.push({ email: email, excluded: false });
                        });
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ _id: new mongodb_1.ObjectId(id) }, { $addToSet: { agents: { $each: emailsObj_1 } } }, { returnOriginal: false, upsert: false })];
                    case 1:
                        teams = _a.sent();
                        if (!(teams && teams.value)) return [3 /*break*/, 3];
                        return [4 /*yield*/, sessionsManager_1.SessionManager.updateSessions(emails, teams.value.team_name)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, teams];
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        err_6 = _a.sent();
                        console.log('Error in adding agent for team');
                        console.log(err_6);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    TeamsModel.toggleExclude = function (nsp, team_name, email, value) {
        return __awaiter(this, void 0, void 0, function () {
            var team, err_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.find({ nsp: nsp, team_name: team_name }).limit(1).toArray()];
                    case 1:
                        team = _a.sent();
                        if (team && team.length) {
                            team[0].agents.filter(function (a) { return a.email == email; })[0].excluded = value;
                            this.collection.save(team[0]);
                        }
                        return [2 /*return*/, (team && team.length) ? team[0] : undefined];
                    case 2:
                        err_7 = _a.sent();
                        console.log(err_7);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TeamsModel.removeAgent = function (id, email) {
        return __awaiter(this, void 0, void 0, function () {
            var teams, err_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ _id: new mongodb_1.ObjectId(id) }, { $pull: { agents: { email: email } } }, { returnOriginal: false, upsert: false })];
                    case 1:
                        teams = _a.sent();
                        if (!(teams && teams.value)) return [3 /*break*/, 3];
                        return [4 /*yield*/, sessionsManager_1.SessionManager.updateSessions([email], teams.value.team_name, '$pull')];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, teams];
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        err_8 = _a.sent();
                        console.log('Error in adding agent for team');
                        console.log(err_8);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    TeamsModel.getTeamsAgainstAgent = function (nsp, email) {
        return __awaiter(this, void 0, void 0, function () {
            var teams, teamsFromDb, err_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        teams = [];
                        return [4 /*yield*/, this.collection.find({
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
                        err_9 = _a.sent();
                        console.log('Error in getting team against agent');
                        console.log(err_9);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TeamsModel.getTeamMembersAgainstAgent = function (nsp, email) {
        return __awaiter(this, void 0, void 0, function () {
            var agents, dataFromDB, err_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        agents = [];
                        return [4 /*yield*/, this.collection.aggregate([
                                {
                                    '$match': {
                                        'nsp': nsp,
                                        'agents.email': email
                                    }
                                }, {
                                    '$unwind': {
                                        'path': '$agents',
                                        'includeArrayIndex': '0',
                                        'preserveNullAndEmptyArrays': false
                                    }
                                }, {
                                    '$group': {
                                        '_id': '$nsp',
                                        'agents': {
                                            '$addToSet': '$agents.email'
                                        }
                                    }
                                }
                            ]).toArray()];
                    case 1:
                        dataFromDB = _a.sent();
                        if (dataFromDB && dataFromDB.length) {
                            agents = dataFromDB[0].agents;
                        }
                        return [2 /*return*/, agents];
                    case 2:
                        err_10 = _a.sent();
                        console.log('Error in getting agents against team');
                        console.log(err_10);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TeamsModel.getTeamsMembersAgainstTeams = function (nsp, teams) {
        return __awaiter(this, void 0, void 0, function () {
            var agents, dataFromDB, err_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        agents = [];
                        return [4 /*yield*/, this.collection.aggregate([
                                {
                                    '$match': {
                                        'nsp': nsp,
                                        'team_name': { $in: teams }
                                    }
                                }, {
                                    '$unwind': {
                                        'path': '$agents',
                                        'includeArrayIndex': '0',
                                        'preserveNullAndEmptyArrays': false
                                    }
                                }, {
                                    '$group': {
                                        '_id': '$nsp',
                                        'agents': {
                                            '$addToSet': '$agents'
                                        }
                                    }
                                }
                            ]).toArray()];
                    case 1:
                        dataFromDB = _a.sent();
                        if (dataFromDB && dataFromDB.length) {
                            agents = dataFromDB[0].agents;
                        }
                        return [2 /*return*/, agents];
                    case 2:
                        err_11 = _a.sent();
                        console.log('Error in getting agents against team');
                        console.log(err_11);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TeamsModel.initialized = false;
    return TeamsModel;
}());
exports.TeamsModel = TeamsModel;
//# sourceMappingURL=teamsModel.js.map