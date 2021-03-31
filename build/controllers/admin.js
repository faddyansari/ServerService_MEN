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
exports.adminRoutes = void 0;
var express = require("express");
var agentModel_1 = require("../models/agentModel");
var companyModel_1 = require("../models/companyModel");
var sessionsManager_1 = require("../globals/server/sessionsManager");
var constants_1 = require("../globals/config/constants");
var mailingListModel_1 = require("../models/mailingListModel");
var TicketgroupModel_1 = require("../models/TicketgroupModel");
var aws_sqs_1 = require("../actions/aws/aws-sqs");
var teamsModel_1 = require("../models/teamsModel");
var __biZZCMiddleWare_1 = require("../globals/__biZZCMiddleWare");
var router = express.Router();
var requestIp = require('request-ip');
var URL = require('url').URL;
router.use(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var type, id, session;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                type = '';
                id = '';
                if (!req.headers.authorization) return [3 /*break*/, 5];
                type = req.headers.authorization.split('-')[0];
                id = req.headers.authorization.split('-')[1];
                session = '';
                if (!(type == 'Agent')) return [3 /*break*/, 2];
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetAgentByID(id)];
            case 1:
                session = _a.sent();
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, sessionsManager_1.SessionManager.GetVisitorByID(id)];
            case 3:
                session = (_a.sent());
                _a.label = 4;
            case 4:
                if (session) {
                    if (req.body.nsp && req.body.nsp != session.nsp)
                        res.status(401).send({ err: 'unauthorized' });
                    next();
                }
                else
                    res.status(401).send({ err: 'unauthorized' });
                return [3 /*break*/, 6];
            case 5:
                res.status(401).send({ err: 'unauthorized' });
                _a.label = 6;
            case 6: return [2 /*return*/];
        }
    });
}); });
router.post('/getAdmin', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var clientIp, ip, agent, exists, acceptingChats, activeRooms, groups, teams, isOwner, Agent, insertedSession, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                clientIp = requestIp.getClientIp(req);
                if (req.headers['x-forwarded-for']) {
                    ip = req.headers['x-forwarded-for'].split(",")[0];
                }
                else if (req.connection && req.connection.remoteAddress) {
                    ip = req.connection.remoteAddress;
                    ip = req.ip;
                }
                if (!req.body.email || !req.body.password)
                    return [2 /*return*/, res.status(401).send({ status: 'invalidparameters' })];
                // console.log(req.body);
                req.body.email = decodeURIComponent(req.body.email);
                req.body.password = decodeURIComponent(req.body.password);
                if (!(req.body.email == 'admin@beelinks.solutions' && req.body.password == '12345678')) return [3 /*break*/, 15];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 13, , 14]);
                return [4 /*yield*/, agentModel_1.Agents.AuthenticateAdmin(req.body.email, req.body.password)];
            case 2:
                agent = _a.sent();
                if (!agent) return [3 /*break*/, 11];
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetLiveAdminSessionFromDatabase(req.body.email)];
            case 3:
                exists = _a.sent();
                if (!(agent.length && exists.length)) return [3 /*break*/, 4];
                //console.log('Returning Existing sessions');
                agent[0].csid = exists[0]._id;
                //Contacts.updateStatus(agent[0].email, agent[0].nsp, true);
                res.send(agent);
                return [3 /*break*/, 10];
            case 4:
                if (!(agent.length && !(exists.length))) return [3 /*break*/, 9];
                acceptingChats = !(agent[0].applicationSettings)
                    ? true
                    : agent[0].applicationSettings.acceptingChatMode;
                activeRooms = [];
                return [4 /*yield*/, TicketgroupModel_1.TicketGroupsModel.getGroupsbyAdmin(agent[0].nsp, agent[0].email)];
            case 5:
                groups = _a.sent();
                return [4 /*yield*/, teamsModel_1.TeamsModel.getTeamsAgainstAgent(agent[0].nsp, agent[0].email)];
            case 6:
                teams = _a.sent();
                return [4 /*yield*/, companyModel_1.Company.isOwner(agent[0].nsp, agent[0].email)];
            case 7:
                isOwner = _a.sent();
                Agent = {
                    socketID: [],
                    nsp: agent[0].nsp,
                    agent_id: agent[0]._id,
                    createdDate: new Date().toISOString(),
                    nickname: agent[0].nickname,
                    email: agent[0].email,
                    rooms: {},
                    chatCount: 0,
                    type: 'Admin',
                    location: activeRooms,
                    visitorCount: 0,
                    role: '',
                    acceptingChats: acceptingChats,
                    state: (acceptingChats) ? 'ACTIVE' : 'IDLE',
                    idlePeriod: (acceptingChats) ? [] : [{ startTime: new Date().toISOString(), endTime: undefined }],
                    image: (agent[0].image) ? agent[0].image : '',
                    locationCount: {},
                    isAdmin: true,
                    callingState: {
                        socketid: '',
                        state: false,
                        agent: ''
                    },
                    permissions: {},
                    groups: groups,
                    teams: teams,
                    isOwner: isOwner,
                    updated: true,
                    concurrentChatLimit: 0
                };
                return [4 /*yield*/, sessionsManager_1.SessionManager.insertSession(JSON.parse(JSON.stringify(Agent)), true)];
            case 8:
                insertedSession = _a.sent();
                if (insertedSession) {
                    agent[0].csid = insertedSession.ops[0]._id;
                    agent[0].callingState = insertedSession.ops[0].callingState;
                    agent[0].isAdmin = true;
                    //Contacts.updateStatus(Agent.email, Agent.nsp, true);
                }
                else {
                    res.status(501).send();
                }
                res.send(agent);
                return [3 /*break*/, 10];
            case 9:
                res.status(401).send({ status: 'incorrectcredintials' }).end();
                _a.label = 10;
            case 10: return [3 /*break*/, 12];
            case 11:
                //console.log('Second Else');
                res.status(401).send({ status: 'incorrectcredintials' }).end();
                _a.label = 12;
            case 12: return [3 /*break*/, 14];
            case 13:
                error_1 = _a.sent();
                console.log('Error in Get User');
                console.log(error_1);
                res.status(401).send({ status: 'error' });
                return [3 /*break*/, 14];
            case 14: return [3 /*break*/, 16];
            case 15: return [2 /*return*/, res.status(401).send({ status: 'incorrectcredintials' })];
            case 16: return [2 /*return*/];
        }
    });
}); });
router.post('/getSettings', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var AgentsettingsPromise, companySettingsPromise, resolvedPromises, agentSettings, companySettings, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                if (!req.body.email)
                    res.status(401).send();
                if (!(req.body.email == 'admin@beelinks.solutions')) return [3 /*break*/, 3];
                if (!req.body.nsp) return [3 /*break*/, 2];
                AgentsettingsPromise = agentModel_1.Agents.getSetting(req.body.email);
                companySettingsPromise = companyModel_1.Company.GetVerificationStatus(req.body.nsp);
                return [4 /*yield*/, Promise.all([AgentsettingsPromise, companySettingsPromise])];
            case 1:
                resolvedPromises = _a.sent();
                agentSettings = resolvedPromises[0];
                companySettings = resolvedPromises[1];
                if (agentSettings && agentSettings.length > 0 && companySettings && companySettings.length > 0) {
                    if (agentSettings[0].automatedMessages == undefined) {
                        agentSettings[0].automatedMessages = [];
                    }
                    if (companySettings[0]) {
                        agentSettings[0].verified = companySettings[0].settings.verified;
                        agentSettings[0].createdAt = companySettings[0].createdAt;
                        agentSettings[0].expiry = companySettings[0].expiry;
                    }
                    res.json(agentSettings[0]);
                }
                else {
                    res.send({});
                }
                _a.label = 2;
            case 2: return [3 /*break*/, 4];
            case 3: return [2 /*return*/, res.status(401).send({ status: 'incorrectcredintials' })];
            case 4: return [3 /*break*/, 6];
            case 5:
                error_2 = _a.sent();
                console.log(error_2);
                console.log('Error in Get Settings');
                res.status(501).send();
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
router.post('/getCompanies', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var agent, companies, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                if (!req.body.email)
                    res.status(401).send();
                agent = decodeURIComponent(req.body.email);
                return [4 /*yield*/, companyModel_1.Company.GetCompanies()];
            case 1:
                companies = _a.sent();
                if (companies && companies.length) {
                    res.send(companies);
                }
                else
                    res.status(501).send();
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                console.log(error_3);
                console.log('Error in Get Settings');
                res.status(501).send();
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/getCompanyInfo', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var companyNsp, agents, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                if (!req.body.nsp)
                    res.status(401).send();
                companyNsp = decodeURIComponent(req.body.nsp);
                return [4 /*yield*/, agentModel_1.Agents.getAllAgents(companyNsp)];
            case 1:
                agents = _a.sent();
                if (agents && agents.length) {
                    res.send(agents);
                }
                else
                    res.status(501).send();
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                console.log(error_4);
                console.log('Error in Get Settings');
                res.status(501).send();
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/getAgentInfo', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var agentInfo, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                //(req.body)
                if (!req.body.agent.email || !req.body.agent.nsp)
                    res.status(401).send();
                return [4 /*yield*/, agentModel_1.Agents.getAgentsInfo(req.body.agent)];
            case 1:
                agentInfo = _a.sent();
                if (agentInfo) {
                    res.send(agentInfo);
                }
                else
                    res.status(501).send();
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                console.log(error_5);
                console.log('Error in Get Settings');
                res.status(501).send();
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/updateCompanyInfo', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var updatedCompany, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
                //let origin: SocketIO.Namespace = (SocketListener.socketIO as SocketIO.Server).of(namespace.name);
                //console.log(req.body.company.nsp)
                if (!req.body.company)
                    res.status(401).send();
                if (!req.body.company.mailingListCheck) return [3 /*break*/, 2];
                return [4 /*yield*/, mailingListModel_1.MailingList.addToMailingList(req.body.company.email)];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2: return [4 /*yield*/, companyModel_1.Company.UpdateCompany(req.body.company)];
            case 3:
                updatedCompany = _a.sent();
                if (!(updatedCompany && updatedCompany.value)) return [3 /*break*/, 5];
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'updateCompanyInfor', to: 'S', data: updatedCompany })];
            case 4:
                _a.sent();
                res.send(updatedCompany);
                return [3 /*break*/, 6];
            case 5:
                res.status(501).send();
                _a.label = 6;
            case 6: return [3 /*break*/, 8];
            case 7:
                error_6 = _a.sent();
                console.log(error_6);
                console.log('Error in Get Settings');
                res.status(501).send();
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); });
router.post('/getDefaultSettings', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var restoreSettings;
    return __generator(this, function (_a) {
        try {
            if (!req.body.settings)
                res.status(401).send();
            restoreSettings = constants_1.defaultSettings[req.body.settings];
            if (restoreSettings) {
                res.send(restoreSettings);
            }
            else
                res.status(501).send();
        }
        catch (error) {
            console.log(error);
            console.log('Error in Get Settings');
            res.status(501).send();
        }
        return [2 /*return*/];
    });
}); });
router.post('/deleteCompanyInfo', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var companyNsp, deletedCompany, deletedAgents, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                if (!req.body.name)
                    res.status(401).send();
                companyNsp = decodeURIComponent(req.body.name);
                return [4 /*yield*/, companyModel_1.Company.DeleteCompany(companyNsp)];
            case 1:
                deletedCompany = _a.sent();
                if (!deletedCompany) return [3 /*break*/, 3];
                return [4 /*yield*/, agentModel_1.Agents.DeleteAgentsByCompany(companyNsp)];
            case 2:
                deletedAgents = _a.sent();
                if (deletedAgents)
                    res.send(deletedCompany);
                else
                    res.status(501).send();
                return [3 /*break*/, 4];
            case 3:
                res.status(501).send();
                _a.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                error_7 = _a.sent();
                console.log(error_7);
                console.log('Error in Get Settings');
                res.status(501).send();
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
// router.post('/deactivateCompanyInfo', async (req, res) => {
//     try {
//         if (!req.body.name) res.status(401).send();
//         let companyNsp = decodeURIComponent(req.body.name);
//         let value = decodeURIComponent(req.body.value);
//         value = JSON.parse(value);
//         let MyNamespace = SocketListener.getSocketServer().of(companyNsp);
//         let deactivatedCompany;
//         deactivatedCompany = await Company.DeactivateCompany(companyNsp, value);
//         if (deactivatedCompany && value) {
//             const connectedNameSpaceSockets = Object.keys(MyNamespace.connected);
//             connectedNameSpaceSockets.forEach(socketId => {
//                 MyNamespace.connected[socketId].disconnect(true);
//             });
//             MyNamespace.removeAllListeners();
//             delete NameSpaces.NameSpaces[companyNsp];
//             if (deactivatedCompany) res.send(deactivatedCompany);
//             else res.status(501).send();
//         }
//         else if (deactivatedCompany && !value) {
//             NameSpaces.RegisterNameSpace({
//                 name: deactivatedCompany.value.name,
//                 rooms: deactivatedCompany.value.rooms,
//                 settings: deactivatedCompany.value.settings
//             })
//             res.send(deactivatedCompany);
//         }
//         else res.status(501).send();
//     } catch (error) {
//         console.log(error);
//         console.log('Error in Get Settings');
//         res.status(501).send();
//     }
// });
router.post('/deactivateCompanyInfo', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var companyNsp, value, deactivatedCompany, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                if (!req.body.name)
                    res.status(401).send();
                companyNsp = decodeURIComponent(req.body.name);
                value = decodeURIComponent(req.body.value);
                value = JSON.parse(value);
                deactivatedCompany = void 0;
                return [4 /*yield*/, companyModel_1.Company.DeactivateCompany(companyNsp, value)];
            case 1:
                deactivatedCompany = _a.sent();
                if (deactivatedCompany) {
                    if (deactivatedCompany)
                        res.send(deactivatedCompany);
                    else
                        res.status(501).send();
                }
                else
                    res.status(501).send();
                return [3 /*break*/, 3];
            case 2:
                error_8 = _a.sent();
                console.log(error_8);
                console.log('Error in Deactivating Company');
                res.status(501).send();
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/authenticateAdmin/:csid?', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var exisitingSession;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                //console.log(req.body)
                if (!req.body.csid)
                    return [2 /*return*/, res.send(401)];
                if (!!req.body.isAdmin) return [3 /*break*/, 1];
                return [2 /*return*/, res.send(401)];
            case 1: return [4 /*yield*/, sessionsManager_1.SessionManager.Exists(req.body.csid)];
            case 2:
                exisitingSession = _a.sent();
                if (exisitingSession) {
                    if (exisitingSession.length > 0) {
                        //Contacts.updateStatus(exisitingSession[0].email, exisitingSession[0].nsp, true);
                        res.status(200).send(exisitingSession[0].callingState);
                    }
                    else {
                        res.status(401).send();
                    }
                }
                else {
                    undefined;
                }
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/logout/:csid?', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var exisitingSession, error_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 8, , 9]);
                if (!!req.body.csid) return [3 /*break*/, 1];
                res.status(401).send();
                return [3 /*break*/, 7];
            case 1: return [4 /*yield*/, sessionsManager_1.SessionManager.Exists(req.body.csid)];
            case 2:
                exisitingSession = _a.sent();
                if (!exisitingSession) return [3 /*break*/, 6];
                if (!(exisitingSession.length > 0)) return [3 /*break*/, 4];
                // await agentSessions.InserAgentSession(exisitingSession[0], exisitingSession[0]._id);
                // exisitingSession[0].id = exisitingSession[0]._id;
                // exisitingSession[0]['ending_time'] = new Date().toISOString();
                // SessionManager.DisplaySessionList(exisitingSession[0]);
                return [4 /*yield*/, sessionsManager_1.SessionManager.DeleteSession(req.body.csid)];
            case 3:
                // await agentSessions.InserAgentSession(exisitingSession[0], exisitingSession[0]._id);
                // exisitingSession[0].id = exisitingSession[0]._id;
                // exisitingSession[0]['ending_time'] = new Date().toISOString();
                // SessionManager.DisplaySessionList(exisitingSession[0]);
                _a.sent();
                //Contacts.updateStatus(exisitingSession[0].email, exisitingSession[0].nsp, false);
                res.status(200).send({ logout: true });
                return [3 /*break*/, 5];
            case 4:
                res.status(200).send({ logout: true });
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                // console.log('Exisiting Session NOt Found');
                res.status(401).send();
                _a.label = 7;
            case 7: return [3 /*break*/, 9];
            case 8:
                error_9 = _a.sent();
                console.log(error_9);
                console.log('Error in Logout');
                res.status(401).send();
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); });
router.post('/register', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var clientIp, a, exists, Agent_exists, registered;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                clientIp = requestIp.getClientIp(req);
                a = (new URL(req.body.company.company_info.company_website));
                if (!!req.body.company) return [3 /*break*/, 1];
                res.status(401).send();
                return [3 /*break*/, 14];
            case 1: return [4 /*yield*/, companyModel_1.Company.CheckCompany(req.body.company.company_info.company_website)];
            case 2:
                exists = _a.sent();
                return [4 /*yield*/, agentModel_1.Agents.AgentExists(req.body.company.email)];
            case 3:
                Agent_exists = _a.sent();
                if (!(exists.length > 0 && Agent_exists)) return [3 /*break*/, 4];
                res.status(406).send({ error: "CompanyAndAgentExists" });
                return [3 /*break*/, 14];
            case 4:
                if (!(exists.length > 0 && !Agent_exists)) return [3 /*break*/, 5];
                res.status(403).send({ error: "CompanyExists" });
                return [3 /*break*/, 14];
            case 5:
                if (!(Agent_exists && !exists.length)) return [3 /*break*/, 6];
                res.status(405).send({ error: "AgentExists" });
                return [3 /*break*/, 14];
            case 6:
                if (!req.body.company.verified) return [3 /*break*/, 13];
                if (!req.body.company.mailingList) return [3 /*break*/, 8];
                return [4 /*yield*/, mailingListModel_1.MailingList.addToMailingList(req.body.email)];
            case 7:
                _a.sent();
                _a.label = 8;
            case 8: return [4 /*yield*/, companyModel_1.Company.RegisterCompany(req.body.company, true)];
            case 9:
                registered = _a.sent();
                if (!(registered && registered.insertedCount)) return [3 /*break*/, 11];
                return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendMessage({
                        action: 'sendAccAppEmail',
                        to: req.body.email,
                        action_url: 'https://beelinks.solutions/login'
                    })];
            case 10:
                _a.sent();
                res.status(200).send({ company: registered.ops[0] });
                return [3 /*break*/, 12];
            case 11:
                res.status(500).send();
                _a.label = 12;
            case 12: return [3 /*break*/, 14];
            case 13:
                res.status(401).send();
                _a.label = 14;
            case 14: return [2 /*return*/];
        }
    });
}); });
exports.adminRoutes = router;
//# sourceMappingURL=admin.js.map