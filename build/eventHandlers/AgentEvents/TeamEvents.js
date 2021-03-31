"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
var teamsModel_1 = require("../../models/teamsModel");
var TeamEvents = /** @class */ (function () {
    function TeamEvents() {
    }
    TeamEvents.BindTeamEvents = function (socket, origin) {
        TeamEvents.GetTeams(socket, origin);
        TeamEvents.InsertTeam(socket, origin);
        TeamEvents.DeleteTeam(socket, origin);
        TeamEvents.UpdateTeam(socket, origin);
        TeamEvents.AddAgentsForTeam(socket, origin);
        TeamEvents.RemoveAgentForTeam(socket, origin);
        TeamEvents.GetAgentsAgainstTeams(socket, origin);
        TeamEvents.ToggleExcludeForTeam(socket, origin);
    };
    TeamEvents.GetTeams = function (socket, origin) {
        var _this = this;
        socket.on('getTeams', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var teams, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, teamsModel_1.TeamsModel.getTeams(socket.handshake.session.nsp)];
                    case 1:
                        teams = _a.sent();
                        if (teams && teams.length) {
                            callback({ status: 'ok', teams: teams });
                        }
                        else {
                            callback({ status: 'error' });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _a.sent();
                        callback({ status: 'error', msg: err_1 });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    TeamEvents.InsertTeam = function (socket, origin) {
        var _this = this;
        socket.on('insertTeam', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var team, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        console.log("team add", data.team);
                        data.team.nsp = socket.handshake.session.nsp;
                        data.team.agents = [];
                        return [4 /*yield*/, teamsModel_1.TeamsModel.insertTeam(data.team)];
                    case 1:
                        team = _a.sent();
                        if (team && team.insertedCount > 0) {
                            callback({ status: 'ok', team: team.ops[0] });
                        }
                        else {
                            callback({ status: 'error' });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_2 = _a.sent();
                        callback({ status: 'error', msg: err_2 });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    TeamEvents.DeleteTeam = function (socket, origin) {
        var _this = this;
        socket.on('deleteTeam', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var teams, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, teamsModel_1.TeamsModel.deleteTeam(data.id, socket.handshake.session.nsp)];
                    case 1:
                        teams = _a.sent();
                        if (teams) {
                            callback({ status: 'ok', teams: teams });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_3 = _a.sent();
                        callback({ status: 'error', msg: err_3 });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    TeamEvents.UpdateTeam = function (socket, origin) {
        var _this = this;
        socket.on('updateTeam', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var team, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, teamsModel_1.TeamsModel.updateTeam(data.id, data.team_name)];
                    case 1:
                        team = _a.sent();
                        if (team && team.value) {
                            callback({ status: 'ok', team: team.value });
                        }
                        else {
                            callback({ status: 'error' });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_4 = _a.sent();
                        callback({ status: 'error', msg: err_4 });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    TeamEvents.AddAgentsForTeam = function (socket, origin) {
        var _this = this;
        socket.on('addAgentsforTeam', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var team, err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, teamsModel_1.TeamsModel.addAgents(data.id, data.emails)];
                    case 1:
                        team = _a.sent();
                        if (team && team.value) {
                            callback({ status: 'ok', addedAgents: team.value.agents });
                        }
                        else {
                            callback({ status: 'error' });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_5 = _a.sent();
                        console.log(err_5);
                        callback({ status: 'error', msg: err_5 });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    TeamEvents.RemoveAgentForTeam = function (socket, origin) {
        var _this = this;
        socket.on('removeAgentForTeam', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var team, err_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, teamsModel_1.TeamsModel.removeAgent(data.id, data.email)];
                    case 1:
                        team = _a.sent();
                        if (team && team.value) {
                            callback({ status: 'ok', agents: team.value.agents });
                        }
                        else {
                            callback({ status: 'error' });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_6 = _a.sent();
                        callback({ status: 'error', msg: err_6 });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    TeamEvents.ToggleExcludeForTeam = function (socket, origin) {
        var _this = this;
        socket.on('toggleExcludeForTeam', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var team, err_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, teamsModel_1.TeamsModel.toggleExclude(socket.handshake.session.nsp, data.team_name, data.email, data.value)];
                    case 1:
                        team = _a.sent();
                        if (team) {
                            callback({ status: 'ok', team: team });
                        }
                        else {
                            callback({ status: 'error', msg: 'Toggle exclude error', data: data });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_7 = _a.sent();
                        console.log('Error in toggle admin');
                        console.log(err_7);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    TeamEvents.GetAgentsAgainstTeams = function (socket, origin) {
        var _this = this;
        socket.on('getAgentsAgaintTeams', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var agents, err_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        // data.team.nsp = socket.handshake.session.nsp;
                        console.log(data.teams);
                        return [4 /*yield*/, teamsModel_1.TeamsModel.getTeamsMembersAgainstTeams(socket.handshake.session.nsp, data.teams)];
                    case 1:
                        agents = _a.sent();
                        callback({ status: 'ok', agents: agents });
                        return [3 /*break*/, 3];
                    case 2:
                        err_8 = _a.sent();
                        callback({ status: 'error', msg: err_8 });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    return TeamEvents;
}());
exports.TeamEvents = TeamEvents;
//# sourceMappingURL=TeamEvents.js.map