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
exports.Agents = void 0;
var AgentsDB_1 = require("../globals/config/databses/AgentsDB");
var TicketgroupModel_1 = require("./TicketgroupModel");
var sessionsManager_1 = require("../globals/server/sessionsManager");
var Agents = /** @class */ (function () {
    function Agents() {
    }
    Agents.Initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c, error_1;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 4, , 5]);
                        _a = this;
                        return [4 /*yield*/, AgentsDB_1.AgentsDB.connect()];
                    case 1:
                        _a.db = _d.sent();
                        _b = this;
                        return [4 /*yield*/, this.db.createCollection('agents')];
                    case 2:
                        _b.collection = _d.sent();
                        _c = this;
                        return [4 /*yield*/, this.db.createCollection('agentcodes')];
                    case 3:
                        _c.codesCollection = _d.sent();
                        console.log(this.collection.collectionName);
                        Agents.initialized = true;
                        return [2 /*return*/, Agents.initialized];
                    case 4:
                        error_1 = _d.sent();
                        console.log('error in Initializing Agent Model');
                        throw new Error(error_1);
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    // -------------------------------x---------------------------------------------------x ||
    //                              Functions operatiing on Databases
    //--------------------------------x---------------------------------------------------x ||
    Agents.getAgentsByID = function () {
        return 0;
    };
    Agents.getAgentsByEmail = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection
                                .find({ email: email })
                                .limit(1)
                                .toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_2 = _a.sent();
                        console.log(error_2);
                        throw new Error("Can't Find Agent In Exists");
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Agents.getAgentByShiftTime = function (email, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection
                                .find({ nsp: nsp, email: email }).project({ ShiftTime: 1 })
                                .limit(1)
                                .toArray()];
                    case 1:
                        result = _a.sent();
                        if (result && result.length)
                            return [2 /*return*/, result[0].ShiftTime];
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        console.log(error_3);
                        throw new Error("Can't Find Agent In Exists");
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Agents.getAgentsByUsername = function (nsp, username) {
        return __awaiter(this, void 0, void 0, function () {
            var error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!username) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.collection
                                .find({ nsp: nsp, username: username })
                                .limit(1)
                                .toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [2 /*return*/, []];
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        error_4 = _a.sent();
                        console.log(error_4);
                        throw new Error("Can't Find Agent In Exists");
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Agents.UpdateWindowNotificationSettings = function (nsp, email, settings) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                try {
                    return [2 /*return*/, this.collection.findOneAndUpdate({ nsp: nsp, email: email }, {
                            $set: (_a = {},
                                _a["settings.windowNotifications"] = settings,
                                _a)
                        }, { returnOriginal: false, upsert: false })];
                }
                catch (error) {
                    console.log(error);
                    throw new Error("Can't update window notifs");
                }
                return [2 /*return*/];
            });
        });
    };
    Agents.UpdateEmailNotificationSettings = function (nsp, email, settings) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                return [2 /*return*/, this.collection.findOneAndUpdate({ nsp: nsp, email: email }, {
                        $set: (_a = {},
                            _a["settings.emailNotifications"] = settings,
                            _a)
                    }, { returnOriginal: false, upsert: false })];
            });
        });
    };
    Agents.saveAgentTicketFilters = function (nsp, email, filters, applyInner) {
        if (applyInner === void 0) { applyInner = false; }
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                return [2 /*return*/, this.collection.findOneAndUpdate({ nsp: nsp, email: email }, {
                        $set: (_a = {},
                            _a["settings.ticketFilters"] = filters,
                            _a["settings.applyFilteronInnerView"] = applyInner,
                            _a)
                    }, { returnOriginal: false, upsert: false })];
            });
        });
    };
    Agents.GetWindowNotificationSettings = function (nsp, email) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    return [2 /*return*/, this.collection.find({ nsp: nsp, email: email }, {
                            fields: {
                                _id: 0,
                                'settings.windowNotifications': 1
                            }
                        })
                            .limit(1).toArray()];
                }
                catch (error) {
                    console.log(error);
                    throw new Error("Can't get window notifs");
                }
                return [2 /*return*/];
            });
        });
    };
    Agents.GetEmailNotificationSettings = function (nsp, email) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    return [2 /*return*/, this.collection.find({ nsp: nsp, email: email }, {
                            fields: {
                                _id: 0,
                                'settings.emailNotifications': 1
                            }
                        })
                            .limit(1).toArray()];
                }
                catch (error) {
                    console.log(error);
                    throw new Error("Can't get email notifs");
                }
                return [2 /*return*/];
            });
        });
    };
    Agents.getFilteredAgents = function (nsp, filters, chunk) {
        if (chunk === void 0) { chunk = "0"; }
        return __awaiter(this, void 0, void 0, function () {
            var dataToSend_1, groups_1, agents_1, status_1, groupAgents, _a, AgentSessions, AgentsMap_1, AgentsMap_2, liveAgents, AgentSessions, AgentsMap_3, error_5;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 38, , 39]);
                        dataToSend_1 = [];
                        if (!filters) return [3 /*break*/, 34];
                        groups_1 = [];
                        agents_1 = [];
                        status_1 = 'all';
                        // console.log(filters);
                        Object.keys(filters).map(function (key) {
                            if (key == 'groups')
                                groups_1 = filters[key];
                            if (key == 'agents')
                                agents_1 = filters[key];
                            if (key == 'status')
                                status_1 = filters[key];
                        });
                        if (!groups_1.length) return [3 /*break*/, 2];
                        return [4 /*yield*/, TicketgroupModel_1.TicketGroupsModel.getAgentsAgainstGroup(nsp, groups_1)];
                    case 1:
                        groupAgents = _b.sent();
                        agents_1 = groupAgents.map(function (a) { return a.email; });
                        _b.label = 2;
                    case 2:
                        _a = status_1;
                        switch (_a) {
                            case 'all': return [3 /*break*/, 3];
                            case 'online': return [3 /*break*/, 9];
                            case 'offline': return [3 /*break*/, 14];
                            case 'idle': return [3 /*break*/, 23];
                            case 'active': return [3 /*break*/, 28];
                        }
                        return [3 /*break*/, 33];
                    case 3:
                        if (!agents_1.length) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.getAgentsByEmails(nsp, agents_1)];
                    case 4:
                        dataToSend_1 = _b.sent();
                        return [3 /*break*/, 7];
                    case 5: return [4 /*yield*/, this.getAllAgents(nsp)];
                    case 6:
                        dataToSend_1 = _b.sent();
                        _b.label = 7;
                    case 7: return [4 /*yield*/, sessionsManager_1.SessionManager.GetAllAgentsByNSP(nsp)];
                    case 8:
                        AgentSessions = _b.sent();
                        AgentsMap_1 = {};
                        if (AgentSessions) {
                            AgentSessions.map(function (agent) {
                                AgentsMap_1[agent.email] = agent;
                            });
                            if (dataToSend_1) {
                                dataToSend_1 = dataToSend_1.map(function (agent) {
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
                        return [3 /*break*/, 33];
                    case 9:
                        if (!agents_1.length) return [3 /*break*/, 11];
                        return [4 /*yield*/, sessionsManager_1.SessionManager.getAllLiveAgentsByEmails(nsp, agents_1)];
                    case 10:
                        dataToSend_1 = _b.sent();
                        return [3 /*break*/, 13];
                    case 11: return [4 /*yield*/, sessionsManager_1.SessionManager.GetAllAgentsByNSP(nsp)];
                    case 12:
                        dataToSend_1 = _b.sent();
                        _b.label = 13;
                    case 13: return [3 /*break*/, 33];
                    case 14:
                        if (!agents_1.length) return [3 /*break*/, 17];
                        return [4 /*yield*/, this.getAgentsByEmails(nsp, agents_1)];
                    case 15:
                        dataToSend_1 = _b.sent();
                        return [4 /*yield*/, sessionsManager_1.SessionManager.GetAllAgentsByNSP(nsp)];
                    case 16:
                        AgentSessions = _b.sent();
                        if (AgentSessions && AgentSessions.length) {
                            AgentSessions.forEach(function (agent) {
                                var index = dataToSend_1.findIndex(function (a) { return a.email == agent.email; });
                                if (index != -1) {
                                    dataToSend_1.splice(index, 1);
                                }
                            });
                        }
                        return [3 /*break*/, 22];
                    case 17: return [4 /*yield*/, sessionsManager_1.SessionManager.GetAllAgentsByNSP(nsp)];
                    case 18:
                        AgentSessions = _b.sent();
                        if (!(AgentSessions && AgentSessions.length)) return [3 /*break*/, 20];
                        AgentsMap_2 = {};
                        AgentSessions.map(function (agent) {
                            AgentsMap_2[agent.email] = agent;
                        });
                        return [4 /*yield*/, Agents.getAgentsNotInEmails(AgentSessions.map(function (a) { return a.email; }), nsp)];
                    case 19:
                        dataToSend_1 = _b.sent();
                        return [3 /*break*/, 22];
                    case 20: return [4 /*yield*/, Agents.getAllAgentsAsync(nsp)];
                    case 21:
                        dataToSend_1 = _b.sent();
                        _b.label = 22;
                    case 22: return [3 /*break*/, 33];
                    case 23:
                        liveAgents = [];
                        if (!agents_1.length) return [3 /*break*/, 25];
                        return [4 /*yield*/, sessionsManager_1.SessionManager.getAllLiveAgentsByEmails(nsp, agents_1)];
                    case 24:
                        liveAgents = _b.sent();
                        if (liveAgents && liveAgents.length) {
                            dataToSend_1 = liveAgents.filter(function (a) { return !a.acceptingChats; });
                        }
                        return [3 /*break*/, 27];
                    case 25: return [4 /*yield*/, sessionsManager_1.SessionManager.GetAllAgentsByNSP(nsp)];
                    case 26:
                        liveAgents = _b.sent();
                        // console.log(liveAgents);
                        if (liveAgents && liveAgents.length) {
                            dataToSend_1 = liveAgents.filter(function (a) { return !a.acceptingChats; });
                        }
                        _b.label = 27;
                    case 27: return [3 /*break*/, 33];
                    case 28:
                        if (!agents_1.length) return [3 /*break*/, 30];
                        return [4 /*yield*/, sessionsManager_1.SessionManager.getAllLiveAgentsByEmails(nsp, agents_1)];
                    case 29:
                        liveAgents = _b.sent();
                        if (liveAgents && liveAgents.length) {
                            dataToSend_1 = liveAgents.filter(function (a) { return a.acceptingChats; });
                        }
                        return [3 /*break*/, 32];
                    case 30: return [4 /*yield*/, sessionsManager_1.SessionManager.GetAllAgentsByNSP(nsp)];
                    case 31:
                        liveAgents = _b.sent();
                        if (liveAgents && liveAgents.length) {
                            dataToSend_1 = liveAgents.filter(function (a) { return a.acceptingChats; });
                        }
                        _b.label = 32;
                    case 32: return [3 /*break*/, 33];
                    case 33: return [3 /*break*/, 37];
                    case 34: return [4 /*yield*/, this.getAllAgents(nsp)];
                    case 35:
                        // let agents : any = [];
                        dataToSend_1 = _b.sent();
                        return [4 /*yield*/, sessionsManager_1.SessionManager.GetAllAgentsByNSP(nsp)];
                    case 36:
                        AgentSessions = _b.sent();
                        AgentsMap_3 = {};
                        if (AgentSessions) {
                            AgentSessions.map(function (agent) {
                                AgentsMap_3[agent.email] = agent;
                            });
                            if (dataToSend_1) {
                                dataToSend_1 = dataToSend_1.map(function (agent) {
                                    if (AgentsMap_3[agent.email]) {
                                        agent.liveSession = {};
                                        agent.liveSession.acceptingChats = AgentsMap_3[agent.email].acceptingChats;
                                        agent.liveSession.createdDate = AgentsMap_3[agent.email].createdDate;
                                        agent.liveSession.state = (AgentsMap_3[agent.email].acceptingChats) ? 'ACTIVE' : 'IDLE';
                                        agent.liveSession.idlePeriod = AgentsMap_3[agent.email].idlePeriod;
                                        agent.callingState = AgentsMap_3[agent.email].callingState;
                                    }
                                    agent.details = true;
                                    return agent;
                                });
                            }
                        }
                        _b.label = 37;
                    case 37: return [2 /*return*/, dataToSend_1];
                    case 38:
                        error_5 = _b.sent();
                        console.log(error_5);
                        return [3 /*break*/, 39];
                    case 39: return [2 /*return*/];
                }
            });
        });
    };
    Agents.getAgentsByEmails = function (nsp, emails) {
        return __awaiter(this, void 0, void 0, function () {
            var error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection
                                .find({ email: { $in: emails }, nsp: nsp })
                                .toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_6 = _a.sent();
                        console.log(error_6);
                        throw new Error("Can't Find Agent In Exists");
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Agents.getAgentsNotInEmails = function (emails, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection
                                .find({ email: { $nin: emails }, nsp: nsp })
                                .toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_7 = _a.sent();
                        console.log(error_7);
                        throw new Error("Can't Find Agent In Exists");
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Agents.getAgentByEmail = function (nsp, email) {
        return __awaiter(this, void 0, void 0, function () {
            var error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection
                                .find({ nsp: nsp, email: email })
                                .limit(1)
                                .toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_8 = _a.sent();
                        console.log(error_8);
                        throw new Error("Can't Find Agent In Beelinks");
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Agents.insertAgent = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var agent, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        agent = {
                            "username": params.username,
                            "email": params.email,
                            "date": Date.now(),
                            "time": new Date().getTime(),
                            "location": params.location,
                            "count": 1,
                            "ipAddress": params.ipAddress
                        };
                        return [4 /*yield*/, this.collection.insertOne(JSON.parse(JSON.stringify(agent)))];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_9 = _a.sent();
                        console.log(error_9);
                        throw new Error("Can't Insert Visitor");
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Agents.AgentExists = function (userEmail) {
        return __awaiter(this, void 0, void 0, function () {
            var error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection
                                .find({ email: userEmail })
                                .limit(1)
                                .toArray()];
                    case 1: return [2 /*return*/, !!(_a.sent()).length];
                    case 2:
                        error_10 = _a.sent();
                        console.log(error_10);
                        throw new Error("Can't Find Agent In Exists");
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Agents.InserAutomatedMessage = function (hashTag, responseText, agentEmail) {
        try {
            return this.collection.findOneAndUpdate({ email: agentEmail }, {
                $push: {
                    automatedMessages: { hashTag: hashTag, responseText: responseText }
                }
            }, { returnOriginal: false, upsert: true });
        }
        catch (error) {
            console.log(error);
            console.log('error in Insert Automated Message');
        }
    };
    Agents.updateLastLogin = function (nsp, email, date) {
        try {
            return this.collection.findOneAndUpdate({ email: email, nsp: nsp }, {
                $set: {
                    lastLogin: date
                }
            }, { returnOriginal: false, upsert: true });
        }
        catch (error) {
            console.log(error);
            console.log('error in Insert Automated Message');
        }
    };
    Agents.DeleteAutomatedMessage = function (hashTag, agentEmail) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                //console.log('Deleteing ');
                try {
                    this.collection.findOneAndUpdate({ email: agentEmail }, {
                        $pull: {
                            automatedMessages: {
                                hashTag: hashTag
                            }
                        }
                    });
                }
                catch (error) {
                    console.log(error);
                    console.log('error in Delete Automated Messages');
                }
                return [2 /*return*/];
            });
        });
    };
    Agents.ChangePassword = function (password, email) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // console.log(password);
                // console.log(email);
                try {
                    return [2 /*return*/, this.collection.findOneAndUpdate({ email: email }, {
                            $set: {
                                password: password
                            }
                        }, { returnOriginal: false, upsert: false })];
                }
                catch (error) {
                    console.log(error);
                    console.log('error in Change Password');
                }
                return [2 /*return*/];
            });
        });
    };
    Agents.EditAutomatedMessage = function (hashTag, responseText, agentEmail) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    this.collection.findOneAndUpdate({ email: agentEmail, "automatedMessages.hashTag": hashTag }, {
                        $set: {
                            "automatedMessages.$.responseText": responseText
                        }
                    });
                }
                catch (error) {
                    console.log(error);
                    console.log('error in Delete Automated Messages');
                }
                return [2 /*return*/];
            });
        });
    };
    Agents.AuthenticateUser = function (email, password) {
        return __awaiter(this, void 0, void 0, function () {
            var error_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection
                                .find({
                                $and: [
                                    { email: email.toLowerCase() },
                                    { password: password }
                                ]
                            }, {
                                fields: {
                                    cannedMessages: 0,
                                    automatedMessages: 0,
                                    editsettings: 0,
                                    communicationAccess: 0,
                                    password: 0
                                }
                            })
                                .limit(1)
                                .toArray()];
                    case 1: return [2 /*return*/, (_a.sent())];
                    case 2:
                        error_11 = _a.sent();
                        console.log('Error in Authenticate User');
                        console.log(error_11);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Agents.ValidateCode = function (code) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.codesCollection.find({ code: code }).limit(1).toArray()];
                    case 1:
                        result = _a.sent();
                        if (result && result.length)
                            return [2 /*return*/, result[0]];
                        else
                            return [2 /*return*/, undefined];
                        return [3 /*break*/, 3];
                    case 2:
                        error_12 = _a.sent();
                        console.log(error_12);
                        console.log('error in Validating Code');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Agents.getAccessCode = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.codesCollection.find({ email: email }, { sort: { _id: -1 } }).limit(1).toArray()];
                    case 1:
                        result = _a.sent();
                        if (result && result.length)
                            return [2 /*return*/, result[0].code];
                        else
                            return [2 /*return*/, ''];
                        return [3 /*break*/, 3];
                    case 2:
                        error_13 = _a.sent();
                        console.log(error_13);
                        console.log('error in Validating Code');
                        return [2 /*return*/, ''];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Agents.InsertCode = function (code, email) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_14;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.codesCollection.insertOne({ code: code, email: email, expireAt: new Date() })];
                    case 1:
                        result = _a.sent();
                        if (result && result.insertedCount)
                            return [2 /*return*/, result];
                        else
                            return [2 /*return*/, undefined];
                        return [3 /*break*/, 3];
                    case 2:
                        error_14 = _a.sent();
                        console.log(error_14);
                        console.log('error in Validating Code');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Agents.getAllAgents = function (nsp) {
        try {
            return this.collection.find({ nsp: nsp }, {
                fields: {
                    cannedMessages: 0,
                    automatedMessages: 0,
                    editsettings: 0,
                    password: 0
                }
            }).toArray();
        }
        catch (error) {
            console.log(error);
            console.log('Error in Get All Agents');
        }
    };
    Agents.getAllDBAgents = function () {
        try {
            return this.collection.find({}).toArray();
        }
        catch (error) {
            console.log(error);
            console.log('Error in Get All Agents');
            return [];
        }
    };
    Agents.getAllAgentsAsync = function (nsp, chunk) {
        if (chunk === void 0) { chunk = '0'; }
        return __awaiter(this, void 0, void 0, function () {
            var error_15;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        if (!(chunk == "0")) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.collection.aggregate([
                                { "$match": { "nsp": nsp } },
                                { "$sort": { "first_name": 1 } },
                                { "$limit": 20 }
                            ]).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [4 /*yield*/, this.collection.aggregate([
                            { "$match": { "nsp": nsp } },
                            { "$sort": { "first_name": 1 } },
                            { "$match": { 'first_name': { "$gt": chunk } } },
                            { "$limit": 20 }
                        ]).toArray()];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_15 = _a.sent();
                        console.log(error_15);
                        console.log('error in getting Archives from Model');
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Agents.searchAgents = function (nsp, keyword, chunk) {
        if (chunk === void 0) { chunk = '0'; }
        return __awaiter(this, void 0, void 0, function () {
            var err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        if (!(chunk == '0')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.collection.find({
                                nsp: nsp,
                                '$or': [
                                    { first_name: new RegExp(keyword) },
                                    { email: new RegExp(keyword) }
                                ]
                            }).sort({ first_name: 1 }).limit(20).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [4 /*yield*/, this.collection.aggregate([
                            {
                                "$match": {
                                    "nsp": nsp,
                                    '$or': [
                                        { first_name: new RegExp(keyword) },
                                        { email: new RegExp(keyword) }
                                    ]
                                }
                            },
                            { "$sort": { first_name: 1 } },
                            { "$match": { "first_name": { "$gt": chunk } } },
                            { "$limit": 20 }
                        ]).toArray()];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        err_1 = _a.sent();
                        console.log('Error in Search Agents');
                        console.log(err_1);
                        return [2 /*return*/, []];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Agents.getAgentsInfo = function (agent) {
        try {
            return this.collection.find({ nsp: agent.nsp, email: agent.email }).toArray();
        }
        catch (error) {
            console.log(error);
            console.log('Error in Get All Agents');
        }
    };
    Agents.RegisterAgent = function (agent) {
        return __awaiter(this, void 0, void 0, function () {
            var error_16;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        agent.email = agent.email.toLowerCase();
                        return [4 /*yield*/, this.collection.insertOne(agent)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.collection.find({ email: agent.email }).limit(1).toArray()];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_16 = _a.sent();
                        console.log('Error in Register Agent');
                        console.log(error_16);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Agents.DeActivateAgent = function (email, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var error_17;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ email: email, nsp: nsp }, { $set: { email: email += ' - deactivated', nsp: nsp += ' - deactivated' } })];
                    case 1: 
                    // email += ' - deactivated';
                    // nsp += ' - deactivated';
                    return [2 /*return*/, _a.sent()];
                    case 2:
                        error_17 = _a.sent();
                        console.log('Error in Register Agent');
                        console.log(error_17);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Agents.GetAgentsCount = function (nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var error_18;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.aggregate([
                                { "$match": { "nsp": nsp } },
                                { "$group": { "_id": null, "count": { $sum: 1 } } }
                            ]).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_18 = _a.sent();
                        console.log('Error in Getting Agents Count');
                        console.log(error_18);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Agents.EditAgentProperTies = function (properties, email) {
        try {
            return this.collection.findOneAndUpdate({ email: email }, {
                $set: {
                    first_name: properties.first_name,
                    last_name: properties.last_name,
                    nickname: properties.nickname,
                    phone_no: properties.phone_no,
                    username: properties.username,
                    gender: properties.gender,
                    'settings.simchats': properties.simchats,
                    role: properties.role
                }
            }, { returnOriginal: false, upsert: false });
        }
        catch (error) {
            console.log(error);
            console.log('error in Editing Agent Properties in AgentModel');
        }
    };
    Agents.EditProfilePic = function (email, url) {
        try {
            return this.collection.findOneAndUpdate({ email: email }, {
                $set: {
                    image: url
                }
            }, { returnOriginal: false, upsert: false });
        }
        catch (error) {
            console.log('error in Updating Profile Image in Model');
            console.log(error);
        }
    };
    Agents.getSetting = function (agentEmail) {
        try {
            return this.collection.find({
                email: agentEmail
            }, {
                fields: {
                    _id: 0,
                    applicationSettings: 1,
                    automatedMessages: 1,
                    editsettings: 1,
                    communicationAccess: 1,
                    settings: 1,
                }
            })
                .limit(1)
                .toArray();
        }
        catch (error) {
            console.log('Error in Get Settings');
            console.log(error);
        }
    };
    Agents.AddGroup = function (agentEmail, groupName) {
        try {
            return this.collection.findOneAndUpdate({
                email: agentEmail,
                group: { $nin: [groupName] }
            }, {
                $addToSet: { group: groupName }
            }, { returnOriginal: false, upsert: false, });
        }
        catch (error) {
            console.log('Error in Adding Group To Agent');
            console.log(error);
        }
    };
    Agents.GetAgentByEmail = function (agentEmail) {
        return __awaiter(this, void 0, void 0, function () {
            var error_19;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.find({
                                email: agentEmail
                            }).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_19 = _a.sent();
                        console.log('Error in Getting Agent By Email');
                        console.log(error_19);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Agents.GetAllAgentsForRole = function (nsp, role) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    return [2 /*return*/, this.collection.find({ nsp: nsp, role: role }).toArray()];
                }
                catch (error) {
                    console.log(error);
                    console.log('Error in getting agents according to role.');
                }
                return [2 /*return*/];
            });
        });
    };
    Agents.saveRoleForAgents = function (nsp, users, selectedRole, role) {
        return __awaiter(this, void 0, void 0, function () {
            var error_20;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.updateMany({ nsp: nsp, email: { $in: users } }, { $set: { role: role } })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.collection.find({ nsp: nsp, role: selectedRole }).toArray()];
                    case 2:
                        error_20 = _a.sent();
                        console.log(error_20);
                        console.log('Error in getting agents according to role.');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Agents.updateAgentTimings = function (nsp, email, shiftStart, duration, showTime) {
        return __awaiter(this, void 0, void 0, function () {
            var error_21;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ nsp: nsp, email: email }, { $set: (_a = {}, _a['ShiftTime.ShiftStart'] = shiftStart, _a['ShiftTime.Duration'] = duration, _a['ShiftTime.showShiftStart'] = showTime, _a) }, { returnOriginal: false, upsert: false })];
                    case 1: return [2 /*return*/, _b.sent()];
                    case 2:
                        error_21 = _b.sent();
                        console.log(error_21);
                        console.log('Error in shift update');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Agents.assignNewRolesForAgents = function (nsp, users) {
        return __awaiter(this, void 0, void 0, function () {
            var agents, error_22;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.find({}).toArray()];
                    case 1:
                        agents = _a.sent();
                        agents.forEach(function (agent) {
                            var user = users.filter(function (u) { return u.email == agent.email; });
                            if (user.length) {
                                agent.role = user[0].role;
                            }
                            _this.collection.save(agent);
                        });
                        return [2 /*return*/, this.collection.find({ nsp: nsp }).toArray()];
                    case 2:
                        error_22 = _a.sent();
                        console.log(error_22);
                        console.log('Error in getting agents according to role.');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Agents.RemoveGroup = function (agentEmail, groupName) {
        try {
            return this.collection.findOneAndUpdate({
                email: agentEmail,
                group: { $in: [groupName] }
            }, {
                $pull: { group: groupName }
            }, { returnOriginal: false, upsert: false, });
        }
        catch (error) {
            console.log('Error in Adding Group To Agent');
            console.log(error);
        }
    };
    //-------------------------------x-------------------------------------------------------x ||
    //                  Functions operating on Live Clients. ( Visitor List Arra)              ||
    //--------------------------------x------------------------------------------------------- ||
    // public static NotifyAll(session, location): string {
    //     return 'Agents' + location;
    // }
    Agents.NotifyAll = function () {
        return 'Agents';
    };
    Agents.NotifyAllVisitorLocation = function (session) {
        return 'Agents' + session.location;
    };
    Agents.NotifyAllocations = function (session) {
        var rooms = [];
        session.location.map(function (location) {
            rooms.push('Agents' + location);
        });
        return rooms;
    };
    Agents.UpdateAgentTicketCount = function (agent_email, ticket_tag, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var count, error_23;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        console.log("inside agent count udpate");
                        return [4 /*yield*/, this.collection.findOne({ nsp: nsp, email: agent_email, agent_ticketcount: { $elemMatch: { tag: ticket_tag } } })];
                    case 1:
                        count = _a.sent();
                        //console.log(count);
                        if (!count) {
                            //console.log("Insert Agent Ticket Count");
                            //console.log(agent_email + " - " + ticket_tag + " - " + nsp);
                            return [2 /*return*/, this.collection.findOneAndUpdate({ nsp: nsp, email: agent_email }, { $push: { agent_ticketcount: { tag: ticket_tag, count: 1 } } })];
                        }
                        else {
                            //console.log("Update Agent Ticket Count");
                            return [2 /*return*/, this.collection.findOneAndUpdate({ nsp: nsp, email: agent_email, agent_ticketcount: { $elemMatch: { tag: ticket_tag } } }, { $inc: { "agent_ticketcount.$.count": 1 } })];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_23 = _a.sent();
                        console.log(error_23);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Agents.ResetAgentTicketCount = function (agent_email, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    //console.log("reset count");
                    return [2 /*return*/, this.collection.findOneAndUpdate({ nsp: nsp, email: agent_email }, { $set: { "agent_ticketcount.$.count": 0 } })];
                }
                catch (error) {
                    console.log(error);
                }
                return [2 /*return*/];
            });
        });
    };
    Agents.NotifyOne = function (session, msgType) {
        if (msgType === void 0) { msgType = 'private'; }
        try {
            switch (session.type) {
                case 'Visitors':
                    return session.agent.id;
                case 'Agents':
                    return session.id || session._id;
                default:
                    return '';
            }
        }
        catch (error) {
            console.log('Error in Notifying Single Visitor');
            console.log(error);
            return '';
        }
    };
    Agents.NotifyAllAdmins = function () {
        return 'Admins';
    };
    Agents.validatePassword = function (email, password) {
        var agent = [];
        agent = this.collection.find({ email: email, password: password }).limit(1).toArray();
        return agent;
    };
    Agents.ToogleChatMode = function (AgentSession, chatMode) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, error_24;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 8, , 9]);
                        if (!(this.db && this.collection)) return [3 /*break*/, 6];
                        _a = chatMode;
                        switch (_a) {
                            case 'IDLE': return [3 /*break*/, 1];
                            case 'ACTIVE': return [3 /*break*/, 3];
                        }
                        return [3 /*break*/, 5];
                    case 1: return [4 /*yield*/, this.collection.findOneAndUpdate({
                            nsp: AgentSession.nsp,
                            email: AgentSession.email
                        }, {
                            $set: { 'applicationSettings.acceptingChatMode': false },
                        }, { returnOriginal: false, upsert: false })];
                    case 2: return [2 /*return*/, _b.sent()];
                    case 3: return [4 /*yield*/, this.collection.findOneAndUpdate({
                            nsp: AgentSession.nsp,
                            email: AgentSession.email
                        }, {
                            $set: { 'applicationSettings.acceptingChatMode': true },
                        }, { returnOriginal: false, upsert: false })];
                    case 4: return [2 /*return*/, _b.sent()];
                    case 5: return [3 /*break*/, 7];
                    case 6: return [2 /*return*/, undefined];
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        error_24 = _b.sent();
                        console.log('Error in Toggle Chat Mode');
                        console.log(error_24);
                        return [2 /*return*/, undefined];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    Agents.getAgentAgainstWatchers = function (nsp, watchers) {
        return __awaiter(this, void 0, void 0, function () {
            var error_25;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.find({ email: { $nin: watchers }, nsp: nsp }).project({ email: 1 }).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_25 = _a.sent();
                        console.log(error_25);
                        console.log('Error in getting agents against watchers');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Agents.getResponseByAgent = function (nsp, email) {
        return __awaiter(this, void 0, void 0, function () {
            var error_26;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.find({ nsp: nsp, email: email }).project({ automatedMessages: 1 }).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_26 = _a.sent();
                        console.log('Error in getting responses by agent');
                        console.log(error_26);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Agents.AuthenticateAdmin = function (email, password) {
        return __awaiter(this, void 0, void 0, function () {
            var error_27;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection
                                .find({
                                $and: [
                                    { email: email.toLowerCase() },
                                    { password: password }
                                ]
                            })
                                .limit(1)
                                .toArray()];
                    case 1: 
                    // { nsp: '/admin' },
                    // { isAdmin: { $exists: true }}
                    return [2 /*return*/, (_a.sent())];
                    case 2:
                        error_27 = _a.sent();
                        console.log('Error in Authenticating Admin');
                        console.log(error_27);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Agents.DeleteAgentsByCompany = function (nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.deleteMany({ nsp: nsp })];
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
    Agents.SavePermissionsAgent = function (permissions, email, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ email: email, nsp: nsp }, { $set: { 'settings.permissions': permissions } })];
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
    Agents.initialized = false;
    // Current Visitor Array
    Agents.AgentsList = {};
    return Agents;
}());
exports.Agents = Agents;
//# sourceMappingURL=agentModel.js.map