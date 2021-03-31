"use strict";
//Created By Saad Ismail Shaikh 
// 01-08-2018
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
//Updated By Saad Ismail shaikh
//Date :  11-12-2018 After Multple Agent Locations
var sessionsManager_1 = require("../../globals/server/sessionsManager");
var agentModel_1 = require("../../models/agentModel");
var visitorModel_1 = require("../../models/visitorModel");
var teamsModel_1 = require("../../models/teamsModel");
var Trackingevents = /** @class */ (function () {
    function Trackingevents() {
    }
    Trackingevents.BindTrackingEvents = function (socket, origin) {
        //Updated To Multiple Agents
        Trackingevents.GetOnlineVisitors(socket, origin);
        //Updated To Multiple Agents
        Trackingevents.GetOnlineAgents(socket, origin);
        Trackingevents.GetMoreAgents(socket, origin);
        //Updated To Multiple Agents
        Trackingevents.GetLiveAgents(socket, origin);
        Trackingevents.GetLeftVisitors(socket, origin);
        Trackingevents.GetAgentsForRole(socket, origin);
        Trackingevents.SaveRoleForAgents(socket, origin);
        Trackingevents.AssignNewRolesForAgents(socket, origin);
        Trackingevents.GetAgentCounts(socket, origin);
        Trackingevents.GetBannedVisitors(socket, origin);
        Trackingevents.GetAgentByEmail(socket, origin);
        Trackingevents.GetAgents(socket, origin);
    };
    Trackingevents.GetOnlineVisitors = function (socket, origin) {
        var _this = this;
        socket.on('VisitorList', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        //console.log('Visitor List');
                        // console.log(SessionManager.sendVisitorList(socket.handshake.session));
                        _b = (_a = socket).emit;
                        _c = ['VisitorList'];
                        return [4 /*yield*/, sessionsManager_1.SessionManager.sendVisitorList(socket.handshake.session)];
                    case 1:
                        //console.log('Visitor List');
                        // console.log(SessionManager.sendVisitorList(socket.handshake.session));
                        _b.apply(_a, _c.concat([_d.sent()]));
                        return [2 /*return*/];
                }
            });
        }); });
    };
    Trackingevents.GetLeftVisitors = function (socket, origin) {
        var _this = this;
        socket.on('getLeftVisitors', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var visitorList, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, visitorModel_1.Visitor.GetLeftVisitors(socket.handshake.session.nsp)];
                    case 1:
                        visitorList = _a.sent();
                        if (visitorList.length)
                            callback({ status: 'ok', leftVisitors: visitorList });
                        else
                            callback({ status: 'ok', leftVisitors: [] });
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.log(error_1);
                        console.log('Error In Getting Left Visitors');
                        callback({ status: 'error' });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    Trackingevents.GetOnlineAgents = function (socket, origin) {
        var _this = this;
        socket.on('agentsList', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var agentsFromDb, AgentSessions, AgentsMap_1, agents, AgentSessions, _a, AgentsMap_2, AgentsMap_3, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 15, , 16]);
                        if (!(!data.type || (data.type && data.type == 'all'))) return [3 /*break*/, 3];
                        return [4 /*yield*/, agentModel_1.Agents.getAllAgentsAsync(socket.handshake.session.nsp)];
                    case 1:
                        agentsFromDb = _b.sent();
                        return [4 /*yield*/, sessionsManager_1.SessionManager.getAllLiveAgents(socket.handshake.session.nsp)];
                    case 2:
                        AgentSessions = _b.sent();
                        AgentsMap_1 = {};
                        if (AgentSessions) {
                            AgentSessions.map(function (agent) {
                                AgentsMap_1[agent.email] = agent;
                            });
                            if (agentsFromDb) {
                                agentsFromDb = agentsFromDb.map(function (agent) {
                                    if (AgentsMap_1[agent.email]) {
                                        agent.liveSession = {};
                                        agent.liveSession.acceptingChats = AgentsMap_1[agent.email].acceptingChats;
                                        agent.liveSession.createdDate = AgentsMap_1[agent.email].createdDate;
                                        agent.liveSession.state = (AgentsMap_1[agent.email].acceptingChats) ? 'ACTIVE' : 'IDLE';
                                        agent.liveSession.idlePeriod = AgentsMap_1[agent.email].idlePeriod;
                                        agent.callingState = AgentsMap_1[agent.email].callingState;
                                    }
                                    agent.details = true;
                                    return agent;
                                });
                            }
                        }
                        callback({ status: 'ok', agents: (agentsFromDb) ? agentsFromDb : [], ended: (agentsFromDb && agentsFromDb.length < 20) ? true : false });
                        return [3 /*break*/, 14];
                    case 3:
                        agents = [];
                        AgentSessions = [];
                        _a = data.type;
                        switch (_a) {
                            case 'online': return [3 /*break*/, 4];
                            case 'offline': return [3 /*break*/, 8];
                        }
                        return [3 /*break*/, 14];
                    case 4: return [4 /*yield*/, sessionsManager_1.SessionManager.getAllLiveAgentsForCount(socket.handshake.session.nsp)];
                    case 5:
                        AgentSessions = _b.sent();
                        if (!(AgentSessions && AgentSessions.length)) return [3 /*break*/, 7];
                        AgentsMap_2 = {};
                        AgentSessions.map(function (agent) {
                            AgentsMap_2[agent.email] = agent;
                        });
                        return [4 /*yield*/, agentModel_1.Agents.getAgentsByEmails(socket.handshake.session.nsp, AgentSessions.map(function (a) { return a.email; }))];
                    case 6:
                        agents = _b.sent();
                        agents.map(function (agent) {
                            if (AgentsMap_2[agent.email]) {
                                agent.liveSession = {};
                                agent.liveSession.acceptingChats = AgentsMap_2[agent.email].acceptingChats;
                                agent.liveSession.createdDate = AgentsMap_2[agent.email].createdDate;
                                agent.liveSession.state = (AgentsMap_2[agent.email].acceptingChats) ? 'ACTIVE' : 'IDLE';
                                agent.liveSession.idlePeriod = AgentsMap_2[agent.email].idlePeriod;
                                agent.callingState = AgentsMap_2[agent.email].callingState;
                            }
                            agent.details = true;
                            return agent;
                        });
                        _b.label = 7;
                    case 7:
                        callback({ status: 'ok', agents: agents, ended: true });
                        return [3 /*break*/, 14];
                    case 8: return [4 /*yield*/, sessionsManager_1.SessionManager.getAllLiveAgents(socket.handshake.session.nsp)];
                    case 9:
                        AgentSessions = _b.sent();
                        if (!(AgentSessions && AgentSessions.length)) return [3 /*break*/, 11];
                        AgentsMap_3 = {};
                        AgentSessions.map(function (agent) {
                            AgentsMap_3[agent.email] = agent;
                        });
                        return [4 /*yield*/, agentModel_1.Agents.getAgentsNotInEmails(AgentSessions.map(function (a) { return a.email; }), socket.handshake.session.nsp)];
                    case 10:
                        agents = _b.sent();
                        return [3 /*break*/, 13];
                    case 11: return [4 /*yield*/, agentModel_1.Agents.getAllAgentsAsync(socket.handshake.session.nsp)];
                    case 12:
                        agents = _b.sent();
                        _b.label = 13;
                    case 13:
                        callback({ status: 'ok', agents: agents.map(function (a) { a.details = true; return a; }), ended: true });
                        return [3 /*break*/, 14];
                    case 14: return [3 /*break*/, 16];
                    case 15:
                        error_2 = _b.sent();
                        console.log(error_2);
                        console.log('Error in Getting AgentsList');
                        callback({ status: 'error' });
                        return [3 /*break*/, 16];
                    case 16: return [2 /*return*/];
                }
            });
        }); });
    };
    Trackingevents.GetAgents = function (socket, origin) {
        var _this = this;
        socket.on('getAllAgentsAsync', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var agents, _a, agentsToSearch, error_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 7, , 8]);
                        agents = [];
                        _a = socket.handshake.session.permissions.tickets.canView;
                        switch (_a) {
                            case 'all': return [3 /*break*/, 1];
                            case 'group': return [3 /*break*/, 1];
                            case 'assignedOnly': return [3 /*break*/, 1];
                            case 'team': return [3 /*break*/, 3];
                        }
                        return [3 /*break*/, 6];
                    case 1: return [4 /*yield*/, agentModel_1.Agents.getAllAgentsAsync(socket.handshake.session.nsp, data.chunk)];
                    case 2:
                        agents = _b.sent();
                        return [3 /*break*/, 6];
                    case 3: return [4 /*yield*/, teamsModel_1.TeamsModel.getTeamMembersAgainstAgent(socket.handshake.session.nsp, socket.handshake.session.email)];
                    case 4:
                        agentsToSearch = _b.sent();
                        return [4 /*yield*/, agentModel_1.Agents.getAgentsByEmails(socket.handshake.session.nsp, agentsToSearch)];
                    case 5:
                        agents = _b.sent();
                        return [3 /*break*/, 6];
                    case 6:
                        // let agentsFromDb 
                        if (agents && agents.length) {
                            callback({ status: 'ok', agents: (agents) ? agents : [], ended: (agents && agents.length < 20) ? true : false });
                        }
                        return [3 /*break*/, 8];
                    case 7:
                        error_3 = _b.sent();
                        console.log('Error in getting agents async');
                        console.log(error_3);
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        }); });
    };
    Trackingevents.GetAgentByEmail = function (socket, origin) {
        var _this = this;
        socket.on('getAgentByEmail', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var agent, session, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, agentModel_1.Agents.getAgentsByEmail(data.email)];
                    case 1:
                        agent = _a.sent();
                        if (!(agent && agent.length)) return [3 /*break*/, 3];
                        return [4 /*yield*/, sessionsManager_1.SessionManager.getAgentByEmail(agent[0].nsp, agent[0].email)];
                    case 2:
                        session = _a.sent();
                        if (session) {
                            agent[0].liveSession = {};
                            agent[0].liveSession.acceptingChats = session.acceptingChats;
                            agent[0].liveSession.createdDate = session.createdDate;
                            agent[0].liveSession.state = (session.acceptingChats) ? 'ACTIVE' : 'IDLE';
                            agent[0].liveSession.idlePeriod = session.idlePeriod;
                            agent[0].callingState = session.callingState;
                        }
                        callback({ status: 'ok', agent: agent[0] });
                        return [3 /*break*/, 4];
                    case 3:
                        callback({ status: 'error' });
                        _a.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        err_1 = _a.sent();
                        console.log(err_1);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        }); });
    };
    //This Event Works When Agent Scrolls Down the Archive Chat List from Sidebar.
    Trackingevents.GetMoreAgents = function (socket, origin) {
        var _this = this;
        socket.on('getMoreAgents', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var agents, AgentSessions, AgentsMap_4, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, agentModel_1.Agents.getAllAgentsAsync(socket.handshake.session.nsp, data.chunk)];
                    case 1:
                        agents = _a.sent();
                        return [4 /*yield*/, sessionsManager_1.SessionManager.getAllLiveAgents(socket.handshake.session.nsp)];
                    case 2:
                        AgentSessions = _a.sent();
                        AgentsMap_4 = {};
                        if (AgentSessions) {
                            AgentSessions.map(function (agent) {
                                AgentsMap_4[agent.email] = agent;
                            });
                            if (agents) {
                                agents = agents.map(function (agent) {
                                    if (AgentsMap_4[agent.email]) {
                                        agent.liveSession = {};
                                        agent.liveSession.acceptingChats = AgentsMap_4[agent.email].acceptingChats;
                                        agent.liveSession.createdDate = AgentsMap_4[agent.email].createdDate;
                                        agent.liveSession.state = (AgentsMap_4[agent.email].acceptingChats) ? 'ACTIVE' : 'IDLE';
                                        agent.liveSession.idlePeriod = AgentsMap_4[agent.email].idlePeriod;
                                        agent.callingState = AgentsMap_4[agent.email].callingState;
                                    }
                                    return agent;
                                });
                            }
                        }
                        callback({ status: 'ok', agents: agents, ended: (agents && agents.length < 20) ? true : false });
                        return [3 /*break*/, 4];
                    case 3:
                        error_4 = _a.sent();
                        console.log(error_4);
                        console.log('error in Get More Agents');
                        callback({ status: 'error' });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
    };
    Trackingevents.GetAgentCounts = function (socket, origin) {
        var _this = this;
        try {
            socket.on('getAgentCounts', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
                var agentCounts, total, AgentSessions;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            agentCounts = {
                                total: 0,
                                agents: []
                            };
                            return [4 /*yield*/, agentModel_1.Agents.getAllAgents(socket.handshake.session.nsp)];
                        case 1:
                            total = _a.sent();
                            agentCounts.total = (total) ? total.length : 0;
                            return [4 /*yield*/, sessionsManager_1.SessionManager.getAllLiveAgentsForCount(socket.handshake.session.nsp)];
                        case 2:
                            AgentSessions = _a.sent();
                            if (AgentSessions) {
                                AgentSessions.map(function (agent) {
                                    agentCounts.agents.push({ email: agent.email, state: (agent.acceptingChats) ? 'active' : 'idle' });
                                });
                            }
                            callback({ status: 'ok', agentCounts: agentCounts });
                            return [2 /*return*/];
                    }
                });
            }); });
        }
        catch (err) {
            console.log(err);
        }
    };
    Trackingevents.GetAgentsForRole = function (socket, origin) {
        var _this = this;
        socket.on('getAllAgentsForRole', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var agents;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!data.role)
                            return [2 /*return*/, new Error('Invalid Request')];
                        return [4 /*yield*/, agentModel_1.Agents.GetAllAgentsForRole(socket.handshake.session.nsp, data.role)];
                    case 1:
                        agents = _a.sent();
                        if (agents) {
                            callback({ status: 'ok', agents: agents });
                        }
                        else {
                            callback({ status: 'error' });
                        }
                        return [2 /*return*/];
                }
            });
        }); });
    };
    Trackingevents.SaveRoleForAgents = function (socket, origin) {
        var _this = this;
        socket.on('saveRoleForAgents', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var agents;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!data.role || !data.users)
                            return [2 /*return*/, new Error('Invalid Request')];
                        return [4 /*yield*/, agentModel_1.Agents.saveRoleForAgents(socket.handshake.session.nsp, data.users, data.selectedRole, data.role)];
                    case 1:
                        agents = _a.sent();
                        if (agents) {
                            callback({ status: 'ok', agents: agents });
                        }
                        else {
                            callback({ status: 'error' });
                        }
                        return [2 /*return*/];
                }
            });
        }); });
    };
    Trackingevents.AssignNewRolesForAgents = function (socket, origin) {
        var _this = this;
        socket.on('assignNewRolesForAgents', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var agents;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!data.users)
                            return [2 /*return*/, new Error('Invalid Request')];
                        return [4 /*yield*/, agentModel_1.Agents.assignNewRolesForAgents(socket.handshake.session.nsp, data.users)];
                    case 1:
                        agents = _a.sent();
                        if (agents) {
                            callback({ status: 'ok' });
                        }
                        else {
                            callback({ status: 'error' });
                        }
                        return [2 /*return*/];
                }
            });
        }); });
    };
    //This is When Transfering Agent Only
    Trackingevents.GetLiveAgents = function (socket, origin) {
        var _this = this;
        socket.on('getLiveAgents', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var liveAgents, updatedLiveAgent, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('Live Agents Called');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, sessionsManager_1.SessionManager.getAllLiveAgents(socket.handshake.session.nsp, [socket.handshake.session.id || socket.handshake.session._id])];
                    case 2:
                        liveAgents = _a.sent();
                        updatedLiveAgent = void 0;
                        if (liveAgents && liveAgents.length) {
                            //console.log(liveAgents);
                            // updatedLiveAgent = liveAgents.map(async (agent) => {
                            //     let convos = await SessionManager.getConversationByAgentID(agent.nsp, (agent._id as ObjectID).toHexString());
                            //     if (convos && convos.length) {
                            //         agent.chatCount = convos.length
                            //     }
                            //     else agent.chatCount = 0
                            //     let updatedCOunt = await SessionManager.SetAgentChatCount(agent, agent.chatCount)
                            //     return agent
                            // })
                            // await Promise.all(updatedLiveAgent)
                            //console.log((liveAgents && liveAgents.length) ? liveAgents : []);
                            callback((liveAgents && liveAgents.length) ? liveAgents : []);
                        }
                        else
                            callback([]);
                        return [3 /*break*/, 4];
                    case 3:
                        error_5 = _a.sent();
                        console.log(error_5);
                        console.log('Error in Getting Live Agents');
                        callback({ status: 'error' });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
    };
    Trackingevents.GetBannedVisitors = function (socket, origin) {
        var _this = this;
        socket.on('getBannedVisitors', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var bannedVisitorList, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, visitorModel_1.Visitor.GetBannedVisitors(socket.handshake.session.nsp)];
                    case 1:
                        bannedVisitorList = _a.sent();
                        if (bannedVisitorList && bannedVisitorList.length)
                            callback({ status: 'ok', bannedVisitorList: bannedVisitorList });
                        else
                            callback({ status: 'ok', bannedVisitorList: [] });
                        return [3 /*break*/, 3];
                    case 2:
                        error_6 = _a.sent();
                        console.log(error_6);
                        console.log('Error In Getting Banned Visitors');
                        callback({ status: 'error' });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    return Trackingevents;
}());
exports.Trackingevents = Trackingevents;
//# sourceMappingURL=trackingEvents.js.map