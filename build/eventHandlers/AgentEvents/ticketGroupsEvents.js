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
var TicketgroupModel_1 = require("../../models/TicketgroupModel");
var agentModel_1 = require("../../models/agentModel");
var companyModel_1 = require("../../models/companyModel");
var TicketGroupsEvents = /** @class */ (function () {
    function TicketGroupsEvents() {
    }
    TicketGroupsEvents.BindTicketGroupEvents = function (socket, origin) {
        TicketGroupsEvents.insertGroup(socket, origin);
        TicketGroupsEvents.getGroupByNSP(socket, origin);
        TicketGroupsEvents.deleteGroup(socket, origin);
        TicketGroupsEvents.AssignAgent(socket, origin);
        TicketGroupsEvents.UnAssignAgent(socket, origin);
        TicketGroupsEvents.addRuleSet(socket, origin);
        TicketGroupsEvents.deleteRuleset(socket, origin);
        TicketGroupsEvents.updateRuleSet(socket, origin);
        TicketGroupsEvents.deleteRule(socket, origin);
        TicketGroupsEvents.getRuleset(socket, origin);
        TicketGroupsEvents.toggleActivation(socket, origin);
        // TicketGroupsEvents.saveAdmins(socket, origin);
        // TicketGroupsEvents.removeAdmin(socket, origin);
        // TicketGroupsEvents.PushAdmin(socket, origin);
        TicketGroupsEvents.SetAutoAssign(socket, origin);
        TicketGroupsEvents.ToggleAdmin(socket, origin);
        TicketGroupsEvents.ToggleExclude(socket, origin);
        TicketGroupsEvents.getRulesetScheduler(socket, origin);
        TicketGroupsEvents.setRulesetScheduler(socket, origin);
    };
    TicketGroupsEvents.insertGroup = function (socket, origin) {
        var _this = this;
        socket.on('insertGroup', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var groups, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, TicketgroupModel_1.TicketGroupsModel.InsertGroup(data.group, socket.handshake.session.nsp)];
                    case 1:
                        groups = _a.sent();
                        if (groups) {
                            socket.to(agentModel_1.Agents.NotifyAll()).emit('groupChanges', { status: 'ok' });
                            callback({ status: 'ok' });
                        }
                        else {
                            callback({ status: 'error' });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        callback({ status: 'error', msg: error_1 });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    TicketGroupsEvents.getGroupByNSP = function (socket, origin) {
        var _this = this;
        socket.on('getGroupByNSP', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var groupFromDb, ticketPermissions, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, TicketgroupModel_1.TicketGroupsModel.GetGroupDetailsByNSP(socket.handshake.session.nsp)];
                    case 1:
                        groupFromDb = _a.sent();
                        ticketPermissions = socket.handshake.session.permissions.tickets;
                        if (groupFromDb) {
                            if (ticketPermissions.canView == 'group') {
                                groupFromDb = groupFromDb.filter(function (g) { return g.agent_list.filter(function (a) { return a.email == socket.handshake.session.email && a.isAdmin; }).length; });
                            }
                            callback({ status: 'ok', group_data: groupFromDb });
                        }
                        else {
                            callback({ status: 'error', msg: 'No Groups found!' });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        console.log(error_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    TicketGroupsEvents.deleteGroup = function (socket, origin) {
        var _this = this;
        socket.on('deleteGroup', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var group, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, TicketgroupModel_1.TicketGroupsModel.deleteGroup(data.group_name, socket.handshake.session.nsp)];
                    case 1:
                        group = _a.sent();
                        if (group) {
                            socket.to(agentModel_1.Agents.NotifyAll()).emit('groupChanges', { status: 'ok' });
                            callback({ status: 'ok', group_data: group });
                        }
                        else {
                            callback({ status: 'error' });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        callback({ status: 'error', msg: error_3 });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    TicketGroupsEvents.ToggleAdmin = function (socket, origin) {
        var _this = this;
        socket.on('toggleAdmin', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var group, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, TicketgroupModel_1.TicketGroupsModel.toggleAdmin(socket.handshake.session.nsp, data.group_name, data.email, data.value)];
                    case 1:
                        group = _a.sent();
                        if (group) {
                            callback({ status: 'ok', group: group });
                        }
                        else {
                            callback({ status: 'error', msg: 'Toggle admin error', data: data });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _a.sent();
                        console.log('Error in toggle admin');
                        console.log(err_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    TicketGroupsEvents.ToggleExclude = function (socket, origin) {
        var _this = this;
        socket.on('toggleExclude', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var group, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, TicketgroupModel_1.TicketGroupsModel.toggleExclude(socket.handshake.session.nsp, data.group_name, data.email, data.value)];
                    case 1:
                        group = _a.sent();
                        if (group) {
                            callback({ status: 'ok', group: group });
                        }
                        else {
                            callback({ status: 'error', msg: 'Toggle exclude error', data: data });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_2 = _a.sent();
                        console.log('Error in toggle admin');
                        console.log(err_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    TicketGroupsEvents.saveAdmins = function (socket, origin) {
        var _this = this;
        socket.on('saveAdmins', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var group, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, TicketgroupModel_1.TicketGroupsModel.SaveAdmins(socket.handshake.session.nsp, data.group_name, data.adminList)];
                    case 1:
                        group = _a.sent();
                        if (group) {
                            socket.to(agentModel_1.Agents.NotifyAll()).emit('groupChanges', { status: 'ok' });
                            callback({ status: 'ok' });
                        }
                        else {
                            callback({ status: 'error' });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        callback({ status: 'error', msg: error_4 });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    TicketGroupsEvents.PushAdmin = function (socket, origin) {
        var _this = this;
        socket.on('pushAdmin', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var group, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, TicketgroupModel_1.TicketGroupsModel.PushAdmin(socket.handshake.session.nsp, data.group_name, data.email)];
                    case 1:
                        group = _a.sent();
                        if (group) {
                            socket.to(agentModel_1.Agents.NotifyAll()).emit('groupChanges', { status: 'ok' });
                            callback({ status: 'ok' });
                        }
                        else {
                            callback({ status: 'error' });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_5 = _a.sent();
                        callback({ status: 'error', msg: error_5 });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    TicketGroupsEvents.removeAdmin = function (socket, origin) {
        var _this = this;
        socket.on('removeAdmin', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var group, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, TicketgroupModel_1.TicketGroupsModel.RemoveAdmin(socket.handshake.session.nsp, data.group_name, data.email)];
                    case 1:
                        group = _a.sent();
                        if (group) {
                            socket.to(agentModel_1.Agents.NotifyAll()).emit('groupChanges', { status: 'ok' });
                            callback({ status: 'ok' });
                        }
                        else {
                            callback({ status: 'error' });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_6 = _a.sent();
                        callback({ status: 'error', msg: error_6 });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    TicketGroupsEvents.SetAutoAssign = function (socket, origin) {
        var _this = this;
        socket.on('setGroupAutoAssign', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var group, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, TicketgroupModel_1.TicketGroupsModel.SetAutoAssign(socket.handshake.session.nsp, data.group_name, data.auto_assign)];
                    case 1:
                        group = _a.sent();
                        if (group && group.value) {
                            socket.to(agentModel_1.Agents.NotifyAll()).emit('groupChanges', { status: 'ok' });
                            callback({ status: 'ok', group: group.value });
                        }
                        else {
                            callback({ status: 'error' });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_3 = _a.sent();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    TicketGroupsEvents.AssignAgent = function (socket, origin) {
        var _this = this;
        socket.on('assignAgent', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var count, agent_list, group, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, TicketgroupModel_1.TicketGroupsModel.getAgentAssignedCount(data.agent_email, "OPEN")];
                    case 1:
                        count = _a.sent();
                        if (!count) return [3 /*break*/, 3];
                        agent_list = {
                            email: data.agent_email,
                            count: count.length,
                            isAdmin: false,
                            excluded: false
                        };
                        return [4 /*yield*/, TicketgroupModel_1.TicketGroupsModel.AssignAgent(data.agent_email, data.group_name, socket.handshake.session.nsp, agent_list)];
                    case 2:
                        group = _a.sent();
                        if (group) {
                            socket.to(agentModel_1.Agents.NotifyAll()).emit('groupChanges', { status: 'ok' });
                            callback({ status: 'ok' });
                        }
                        else {
                            callback({ status: 'error' });
                        }
                        _a.label = 3;
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        error_7 = _a.sent();
                        callback({ status: 'error', msg: error_7 });
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        }); });
    };
    TicketGroupsEvents.UnAssignAgent = function (socket, origin) {
        var _this = this;
        socket.on('unAssignAgent', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var group, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, TicketgroupModel_1.TicketGroupsModel.UnAssignAgent(data.agent_email, data.group_name, socket.handshake.session.nsp)];
                    case 1:
                        group = _a.sent();
                        if (group) {
                            socket.to(agentModel_1.Agents.NotifyAll()).emit('groupChanges', { status: 'ok' });
                            callback({ status: 'ok', group_data: group.value });
                        }
                        else {
                            callback({ status: 'error' });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_8 = _a.sent();
                        callback({ status: 'error', msg: error_8 });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    /**
     *
     * @param data : { ruleset : RulesetObject }
     */
    TicketGroupsEvents.addRuleSet = function (socket, origin) {
        var _this = this;
        socket.on('addRuleSet', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var ruleSetInDb, ruleSet, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        ruleSetInDb = {
                            nsp: socket.handshake.session.nsp,
                            name: data.ruleset.name,
                            conditions: data.ruleset.conditions,
                            actions: data.ruleset.actions,
                            lastmodified: data.ruleset.lastmodified,
                            operator: data.ruleset.operator,
                            isActive: data.ruleset.isActive
                        };
                        return [4 /*yield*/, TicketgroupModel_1.TicketGroupsModel.addRuleSet(ruleSetInDb)];
                    case 1:
                        ruleSet = _a.sent();
                        if (ruleSet && ruleSet.insertedCount)
                            callback({ status: 'ok', ruleset: ruleSet.ops[0] });
                        else
                            callback({ status: 'error', msg: 'No RuleSet added!' });
                        return [3 /*break*/, 3];
                    case 2:
                        error_9 = _a.sent();
                        console.log(error_9);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    /**
     *
     * @param empty : {}
     */
    TicketGroupsEvents.getRuleset = function (socket, origin) {
        var _this = this;
        socket.on('getRuleset', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var rulesets, error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, TicketgroupModel_1.TicketGroupsModel.GetRulesetByNSP(socket.handshake.session.nsp)];
                    case 1:
                        rulesets = _a.sent();
                        if (rulesets) {
                            callback({ status: 'ok', rulesets: rulesets });
                        }
                        else {
                            callback({ status: 'error', msg: 'No Rulesets found!' });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_10 = _a.sent();
                        console.log(error_10);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    TicketGroupsEvents.getRulesetScheduler = function (socket, origin) {
        var _this = this;
        socket.on('getRulesetScheduler', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var company, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, companyModel_1.Company.getCompany(socket.handshake.session.nsp)];
                    case 1:
                        company = _a.sent();
                        if (company && company.length) {
                            if (company[0].settings.ruleSetScheduler) {
                                callback({ status: 'ok', scheduler: company[0].settings.ruleSetScheduler });
                            }
                            else {
                                callback({ status: 'error' });
                            }
                        }
                        else {
                            callback({ status: 'error' });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_4 = _a.sent();
                        console.log(err_4);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    TicketGroupsEvents.setRulesetScheduler = function (socket, origin) {
        var _this = this;
        socket.on('setRulesetScheduler', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var company, err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, companyModel_1.Company.setRuleSetScheduler(socket.handshake.session.nsp, data.scheduler)];
                    case 1:
                        company = _a.sent();
                        if (company && company.ok) {
                            callback({ status: 'ok' });
                        }
                        else {
                            callback({ status: 'error' });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_5 = _a.sent();
                        console.log(err_5);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    /**
     *
     * @param data : id : string , ruleset : RulesetObject
     */
    TicketGroupsEvents.updateRuleSet = function (socket, origin) {
        var _this = this;
        socket.on('updateRuleSet', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var ruleset, error_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        //console.log(data);
                        data.ruleset.lastmodified = {
                            by: socket.handshake.session.email,
                            date: new Date().toISOString()
                        };
                        return [4 /*yield*/, TicketgroupModel_1.TicketGroupsModel.updateRulset(socket.handshake.session.nsp, data.id, data.ruleset)];
                    case 1:
                        ruleset = _a.sent();
                        if (ruleset && ruleset.value) {
                            //console.log("result", updatedruleSet.value);
                            callback({ status: 'ok', ruleset: ruleset.value });
                        }
                        else {
                            callback({ status: 'error', msg: 'No RuleSet updated!' });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_11 = _a.sent();
                        console.log(error_11);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    /**
     *
     * @param data : { id : string }
     */
    TicketGroupsEvents.deleteRule = function (socket, origin) {
        var _this = this;
        socket.on('deleteRule', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var deletedRuleset, error_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, TicketgroupModel_1.TicketGroupsModel.deleteRule(socket.handshake.session.nsp, data.id)];
                    case 1:
                        deletedRuleset = _a.sent();
                        if (deletedRuleset && deletedRuleset.deletedCount) {
                            callback({ status: 'ok' });
                        }
                        else {
                            callback({ status: 'error', msg: 'cannot delete Rule!' });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_12 = _a.sent();
                        console.log(error_12);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    /**
     *
     * @param data : { id : string , activation : boolean }
     */
    TicketGroupsEvents.toggleActivation = function (socket, origin) {
        var _this = this;
        socket.on('toggleActivation', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var ruleset, error_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, TicketgroupModel_1.TicketGroupsModel.toggleActivation(socket.handshake.session.nsp, data.activation, data.id, socket.handshake.session.email)];
                    case 1:
                        ruleset = _a.sent();
                        if (ruleset && ruleset.value) {
                            socket.to(agentModel_1.Agents.NotifyAll()).emit('groupChanges', { status: 'ok' });
                            callback({ status: 'ok', ruleset: ruleset.value });
                        }
                        else {
                            callback({ status: 'error', msg: 'Not activated!' });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_13 = _a.sent();
                        console.log(error_13);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    //Duplicate Function Fahad
    TicketGroupsEvents.deleteRuleset = function (socket, origin) {
        var _this = this;
        socket.on('deleteRuleset', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var deletedRuleset, error_14;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, TicketgroupModel_1.TicketGroupsModel.deleteRuleset(socket.handshake.session.nsp)];
                    case 1:
                        deletedRuleset = _a.sent();
                        if (deletedRuleset) {
                            //console.log("deleted", deletedRuleset);
                            callback({ status: 'ok' });
                        }
                        else {
                            callback({ status: 'error', msg: 'cannot delete RuleSet!' });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_14 = _a.sent();
                        console.log(error_14);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    return TicketGroupsEvents;
}());
exports.TicketGroupsEvents = TicketGroupsEvents;
//# sourceMappingURL=ticketGroupsEvents.js.map