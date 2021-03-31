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
exports.agentRoutes = void 0;
var express = require("express");
var path = require("path");
var agentModel_1 = require("../models/agentModel");
var request = require("request-promise");
var sessionsManager_1 = require("../globals/server/sessionsManager");
var tokensModel_1 = require("../models/tokensModel");
var constants_1 = require("../globals/config/constants");
var companyModel_1 = require("../models/companyModel");
var contactModel_1 = require("../models/contactModel");
var ticketsModel_1 = require("../models/ticketsModel");
var TicketgroupModel_1 = require("../models/TicketgroupModel");
var index_1 = require("../index");
var TicketDispatcher_1 = require("../actions/TicketAbstractions/TicketDispatcher");
var aws_sqs_1 = require("../actions/aws/aws-sqs");
var teamsModel_1 = require("../models/teamsModel");
var __biZZCMiddleWare_1 = require("../globals/__biZZCMiddleWare");
var agentConversationModel_1 = require("../models/agentConversationModel");
var AgentConversationStatus_1 = require("../models/AgentConversationStatus");
var agentSessionModel_1 = require("../models/agentSessionModel");
var json2excel = require('js2excel').json2excel;
var router = express.Router();
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
// router.post('/authenticate/:csid?', async (req, res, next) => {
//     // console.log('Auth');
//     // console.log(req.body);
//     if (!req.body.csid) return res.send(401);
//     else {
//         let exisitingSession = await SessionManager.Exists(req.body.csid);
//         let checkActivation: any;
//         if (exisitingSession && exisitingSession.length > 0) checkActivation = await Company.getCompany(exisitingSession[0].nsp);
//         // console.log(checkActivation);
//         //if (checkActivation && checkActivation[0].deactivated) res.status(401).send();
//         //else
//         if (exisitingSession) {
//             if (exisitingSession.length > 0) {
//                 Contacts.updateStatus(exisitingSession[0].email, exisitingSession[0].nsp, true);
//                 res.status(200).send(exisitingSession[0].callingState);
//                 return;
//             } else {
//                 res.status(401).send(401);
//                 return;
//             }
//         } else {
//             return res.status(401).send(401);
//         }
//     }
// });
// router.post('/getUser', async (req, res, next) => {
//     console.log('get User');
//     console.log(req.body);
//     if (!req.body.email || !req.body.password) return res.status(401).send({ status: 'invalidparameters' });
//     req.body.email = decodeURIComponent(req.body.email);
//     req.body.password = decodeURIComponent(req.body.password);
//     let iceServers = await iceServersModel.getICEServers();
//     // iceServers: (iceServers && iceServers.length) ? iceServers[0] : undefined
//     // console.log(req.body);
//     try {
//         let agent = await Agents.AuthenticateUser(req.body.email, req.body.password);
//         // console.log(agent);
//         let checkActivation;
//         if (agent && agent.length > 0) checkActivation = await Company.getCompany(agent[0].nsp);
//         // console.log(checkActivation);
//         if (agent && checkActivation && !checkActivation[0].deactivated) {
//             let continueProcess = false;
//             let authPermissions = checkActivation[0].settings.authentication;
//             //Case IF the user is superadmin then ignore the SSO check
//             if (agent[0].role == 'superadmin') {
//                 continueProcess = true;
//             } else {
//                 if (authPermissions.suppressionList.includes(agent[0].email)) {
//                     continueProcess = true;
//                 } else {
//                     if (!authPermissions[agent[0].role].enableSSO) {
//                         continueProcess = true;
//                     } else {
//                         let clientIp = req.headers['x-forwarded-for'] || requestIp.getClientIp(req);
//                         //console.log(clientIp.toString());
//                         //console.log(req.headers['x-forwarded-for']);
//                         if (authPermissions.allowedIPs.filter(ip => ip == clientIp.toString()).length) continueProcess = true;
//                     }
//                 }
//             }
//             //Case IF SSO is enabled and the user is not superadmin then check if its IP is allowed
//             //Case IF SSO is disabled then continue the login process
//             //Case ( Stop Multiple Login ) To Check If Agent Already Logged In Then Prevent user From Logging In.
//             //TODO : Need A good WorkAround When Support For Multiple Sockets Introduced
//             let exists = await SessionManager.GetLiveSessionAgentByEmail(req.body.email);
//             // console.log(exists);
//             if (continueProcess && authPermissions[agent[0].role].TwoFA) {
//                 if (agent.length) {
//                     let code = new ObjectID().toHexString()
//                     let insertedCode = await Agents.InsertCode(code, req.body.email.toLowerCase());
//                     if (insertedCode && insertedCode.insertedCount) {
//                         await __biZZC_SQS.SendMessage({ action: 'sendaccesscode', code: code, email: req.body.email.toLowerCase() })
//                         res.status(203).send({ status: 'ok' })
//                     }
//                     else res.status(501).send()
//                     return;
//                 } else {
//                     res.status(401).send({ status: 'incorrectcredintials' }).end();
//                     return;
//                 }
//             }
//             else if (continueProcess && !authPermissions[agent[0].role].TwoFA) {
//                 if (agent.length && exists.length) {
//                     //console.log('Returning Existing sessions');
//                     agent[0].csid = exists[0]._id;
//                     agent[0].iceServers = (iceServers && iceServers.length) ? iceServers[0] : undefined
//                     // Contacts.updateStatus(agent[0].email, agent[0].nsp, true);
//                     res.send(agent);
//                     return;
//                 }
//                 //End (Multiple Login Case)
//                 else if (agent.length && !(exists.length)) {
//                     //End (Multiple Login Case)
//                     let acceptingChats = !(agent[0].applicationSettings)
//                         ? true
//                         : agent[0].applicationSettings.acceptingChatMode;
//                     //let groups = await Company.getGroups(agent[0].nsp);
//                     let activeRooms: Array<string> = [];
//                     let permissions = await Company.getNSPPermissionsByRole(agent[0].nsp, agent[0].role);
//                     // console.log('Permissions: ');
//                     // console.log(permissions);
//                     let groups = await TicketGroupsModel.getGroupsbyAdmin(agent[0].nsp, agent[0].email);
//                     let teams = await TeamsModel.getTeamsAgainstAgent(agent[0].nsp, agent[0].email);
//                     let isOwner = await Company.isOwner(agent[0].nsp, agent[0].email);
//                     let Agent: AgentSessionSchema = {
//                         socketID: [],
//                         agent_id: agent[0]._id,
//                         nsp: agent[0].nsp,
//                         createdDate: new Date().toISOString(),
//                         nickname: agent[0].nickname,
//                         email: agent[0].email,
//                         rooms: {},
//                         chatCount: 0,
//                         type: 'Agents',
//                         location: activeRooms,
//                         visitorCount: 0,
//                         role: agent[0].role,
//                         acceptingChats: acceptingChats,
//                         state: (acceptingChats) ? 'ACTIVE' : 'IDLE',
//                         idlePeriod: (acceptingChats) ? [] : [{ startTime: new Date().toISOString(), endTime: undefined }],
//                         image: (agent[0].image) ? agent[0].image : '',
//                         locationCount: {},
//                         callingState: {
//                             socketid: '',
//                             state: false,
//                             agent: ''
//                         },
//                         permissions: permissions,
//                         groups: groups,
//                         teams: teams,
//                         isOwner: isOwner,
//                         updated: true,
//                         concurrentChatLimit: agent[0].settings.simchats
//                     }
//                     // console.log('agent');
//                     // console.log(agent[0]);
//                     // console.log('Before Inserting Session');
//                     // console.log(!!exists.length);
//                     let insertedSession = await SessionManager.insertSession(JSON.parse(JSON.stringify(Agent)), true);
//                     if (insertedSession) {
//                         agent[0].csid = insertedSession.ops[0]._id
//                         agent[0].callingState = insertedSession.ops[0].callingState;
//                         agent[0].isOwner = insertedSession.ops[0].isOwner;
//                         agent[0].groups = insertedSession.ops[0].groups;
//                         agent[0].teams = insertedSession.ops[0].teams;
//                         Agents.updateLastLogin(Agent.nsp, Agent.email, Agent.createdDate);
//                         Contacts.updateStatus(Agent.email, Agent.nsp, true);
//                     } else {
//                         res.status(501).send();
//                         return;
//                     }
//                     agent[0].iceServers = (iceServers && iceServers.length) ? iceServers[0] : undefined
//                     res.send(agent);
//                     return;
//                     //next();
//                 }
//                 else {
//                     res.status(401).send({ status: 'incorrectcredintials' }).end();
//                     return;
//                 }
//             } else {
//                 //console.log(agent[0].email + ' is not authorized!');
//                 res.status(401).send({ status: 'unauthorized' }).end();
//                 return;
//             }
//         }
//         else {
//             // console.log('Second Else');
//             res.status(401).send({ status: 'incorrectcredintials' }).end();
//             return;
//         }
//     } catch (error) {
//         console.log('Error in Get User');
//         console.log(error);
//         res.status(401).send({ status: 'error' });
//         return;
//     }
// });
router.post('/setEmailNotificationSettings', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, modifiedObject, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                data = req.body;
                if (!data.nsp || !data.email)
                    res.status(401).send('Invalid Request!');
                return [4 /*yield*/, agentModel_1.Agents.UpdateEmailNotificationSettings(data.nsp, data.email, data.settings)];
            case 1:
                modifiedObject = _a.sent();
                if (modifiedObject && modifiedObject.value) {
                    res.send({ status: 'ok', code: '200' });
                }
                else
                    res.send({ status: 'error', code: '500' });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.log('Error in setEmailNotificationSettings');
                res.send({ status: 'error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/saveAgentTicketFilters', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, modifiedObject, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                data = req.body;
                if (!data.nsp || !data.email)
                    res.status(401).send('Invalid Request!');
                return [4 /*yield*/, agentModel_1.Agents.saveAgentTicketFilters(data.nsp, data.email, data.filters, data.applyInnerView)];
            case 1:
                modifiedObject = _a.sent();
                if (modifiedObject && modifiedObject.value) {
                    res.send({ status: 'ok', code: '200' });
                }
                else
                    res.send({ status: 'error', code: '500' });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.log('Error in setEmailNotificationSettings');
                res.send({ status: 'error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/getWindowNotificationSettings', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, settings, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                data = req.body;
                if (!data.nsp || !data.email)
                    res.status(401).send('Invalid Request!');
                return [4 /*yield*/, agentModel_1.Agents.GetWindowNotificationSettings(data.nsp, data.email)];
            case 1:
                settings = _a.sent();
                if (settings && settings.length) {
                    res.send({ status: 'ok', windowNotifications: settings[0].settings.windowNotifications });
                }
                else {
                    res.send({ status: "error" });
                }
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                console.log(error_3);
                console.log('error in Getting Email Notificaitions Settings');
                res.send({ status: 'error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/setWindowNotificationSettings', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, modifiedObject, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                data = req.body;
                if (!data.nsp || !data.email)
                    res.status(401).send('Invalid Request!');
                return [4 /*yield*/, agentModel_1.Agents.UpdateWindowNotificationSettings(data.nsp, data.email, data.settings)];
            case 1:
                modifiedObject = _a.sent();
                if (!(modifiedObject && modifiedObject.value)) return [3 /*break*/, 3];
                res.send({ status: 'ok', code: '200' });
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'notifPermissionsChanged', nsp: data.nsp, roomName: [agentModel_1.Agents.NotifyAll()], data: { settings: data.settings } })];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                res.send({ status: 'error', code: '500' });
                _a.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                error_4 = _a.sent();
                console.log('Error in setWindowNotificationSettings');
                res.send({ status: 'error' });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
router.post('/getEmailNotificationSettings', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, settings, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                if (!(!req.body.nsp || !req.body.email)) return [3 /*break*/, 1];
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 3];
            case 1:
                res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
                res.header('Expires', '-1');
                res.header('Pragma', 'no-cache');
                data = req.body;
                return [4 /*yield*/, agentModel_1.Agents.GetEmailNotificationSettings(data.nsp, data.email)];
            case 2:
                settings = _a.sent();
                if (settings && settings.length) {
                    res.send({
                        status: 'ok',
                        emailNotifications: settings[0].settings.emailNotifications
                    });
                }
                else {
                    res.send({ status: 'error' });
                }
                _a.label = 3;
            case 3: return [3 /*break*/, 5];
            case 4:
                error_5 = _a.sent();
                res.status(401).send({ status: 'error' });
                console.log(error_5);
                console.log('error in Getting Email Notificaitions Settings');
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// router.post('/validateCode', async (req, res, next) => {
//     // console.log('get User');
//     // console.log(req.session);
//     if (!req.body.code) return res.status(401).send({ status: 'invalidCode' });
//     req.body.code = decodeURIComponent(req.body.code);
//     // console.log(req.body);
//     try {
//         let accesscode = await Agents.ValidateCode(req.body.code);
//         if (!accesscode) res.status(401).send({ status: 'invalidCode' });
//         else {
//             let agent = await Agents.GetAgentByEmail(accesscode.email.toLowerCase());
//             let checkActivation;
//             if (agent && agent.length) checkActivation = await Company.getCompany(agent[0].nsp);
//             // console.log(checkActivation);
//             if (agent && agent.length && checkActivation && !checkActivation[0].deactivated) {
//                 let continueProcess = false;
//                 let authPermissions = checkActivation[0].settings.authentication;
//                 // Case IF the user is superadmin then ignore the SSO check
//                 if (agent[0].role == 'superadmin') {
//                     continueProcess = true;
//                 } else {
//                     if (authPermissions.suppressionList.includes(agent[0].email)) {
//                         continueProcess = true;
//                     } else {
//                         if (!authPermissions[agent[0].role].enableSSO) {
//                             continueProcess = true;
//                         } else {
//                             let clientIp = req.headers['x-forwarded-for'] || requestIp.getClientIp(req);
//                             //console.log(clientIp.toString());
//                             //console.log(req.headers['x-forwarded-for']);
//                             if (authPermissions.allowedIPs.filter(ip => ip == clientIp.toString()).length) continueProcess = true;
//                         }
//                     }
//                 }
//                 //Case IF SSO is enabled and the user is not superadmin then check if its IP is allowed
//                 //Case IF SSO is disabled then continue the login process
//                 //Case ( Stop Multiple Login ) To Check If Agent Already Logged In Then Prevent user From Logging In.
//                 //TODO : Need A good WorkAround When Support For Multiple Sockets Introduced
//                 let exists = await SessionManager.GetLiveSessionAgentByEmail(agent[0].email);
//                 // console.log(exists);
//                 if (continueProcess) {
//                     if (agent.length && exists.length) {
//                         //console.log('Returning Existing sessions');
//                         agent[0].csid = exists[0]._id;
//                         // Contacts.updateStatus(agent[0].email, agent[0].nsp, true);
//                         res.send(agent);
//                         return;
//                     }
//                     //End (Multiple Login Case)
//                     else if (agent.length && !(exists.length)) {
//                         //End (Multiple Login Case)
//                         let acceptingChats = !(agent[0].applicationSettings)
//                             ? true
//                             : agent[0].applicationSettings.acceptingChatMode;
//                         //let groups = await Company.getGroups(agent[0].nsp);
//                         let activeRooms: Array<string> = [];
//                         let permissions = await Company.getNSPPermissionsByRole(agent[0].nsp, agent[0].role);
//                         // console.log('Permissions: ');
//                         // console.log(permissions);
//                         let groups = await TicketGroupsModel.getGroupsbyAdmin(agent[0].nsp, agent[0].email);
//                         let teams = await TeamsModel.getTeamsAgainstAgent(agent[0].nsp, agent[0].email);
//                         let isOwner = await Company.isOwner(agent[0].nsp, agent[0].email);
//                         let Agent: AgentSessionSchema = {
//                             socketID: [],
//                             agent_id: agent[0]._id,
//                             nsp: agent[0].nsp,
//                             createdDate: new Date().toISOString(),
//                             nickname: agent[0].nickname,
//                             email: agent[0].email,
//                             rooms: {},
//                             chatCount: 0,
//                             type: 'Agents',
//                             location: activeRooms,
//                             visitorCount: 0,
//                             role: agent[0].role,
//                             acceptingChats: acceptingChats,
//                             state: (acceptingChats) ? 'ACTIVE' : 'IDLE',
//                             idlePeriod: (acceptingChats) ? [] : [{ startTime: new Date().toISOString(), endTime: undefined }],
//                             image: (agent[0].image) ? agent[0].image : '',
//                             locationCount: {},
//                             callingState: {
//                                 socketid: '',
//                                 state: false,
//                                 agent: ''
//                             },
//                             permissions: permissions,
//                             groups: groups,
//                             teams: teams,
//                             isOwner: isOwner,
//                             updated: true,
//                             concurrentChatLimit: agent[0].settings.simchats
//                         }
//                         // console.log('agent');
//                         // console.log(agent[0]);
//                         // console.log('Before Inserting Session');
//                         // console.log(!!exists.length);
//                         let insertedSession = await SessionManager.insertSession(JSON.parse(JSON.stringify(Agent)), true);
//                         if (insertedSession) {
//                             agent[0].csid = insertedSession.ops[0]._id
//                             agent[0].callingState = insertedSession.ops[0].callingState;
//                             agent[0].isOwner = insertedSession.ops[0].isOwner;
//                             agent[0].groups = insertedSession.ops[0].groups;
//                             agent[0].teams = insertedSession.ops[0].teams;
//                             Agents.updateLastLogin(Agent.nsp, Agent.email, Agent.createdDate);
//                             Contacts.updateStatus(Agent.email, Agent.nsp, true);
//                         } else {
//                             res.status(501).send();
//                             return;
//                         }
//                         res.send(agent);
//                         return;
//                         //next();
//                     }
//                     else {
//                         res.status(401).send({ status: 'invalidCode' }).end();
//                         return;
//                     }
//                 } else {
//                     //console.log(agent[0].email + ' is not authorized!');
//                     res.status(401).send({ status: 'invalidCode' }).end();
//                     return;
//                 }
//             }
//             else res.status(401).send({ status: 'no agent found' });
//         }
//     } catch (error) {
//         console.log('Error in Get User');
//         console.log(error);
//         res.status(401).send({ status: 'error' });
//         return;
//     }
// });
router.post('/getSettings', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var AgentsettingsPromise, groups_1, companySettingsPromise, resolvedPromises, agentSettings, companySettings_1, fieldsToSplice_1, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                if (!req.body.email)
                    res.status(401).send();
                AgentsettingsPromise = agentModel_1.Agents.getSetting(req.body.email);
                return [4 /*yield*/, TicketgroupModel_1.TicketGroupsModel.GetGroupsAgainstAgent(req.body.nsp, req.body.email)];
            case 1:
                groups_1 = _a.sent();
                companySettingsPromise = companyModel_1.Company.GetVerificationStatus(req.body.nsp);
                return [4 /*yield*/, Promise.all([AgentsettingsPromise, companySettingsPromise])];
            case 2:
                resolvedPromises = _a.sent();
                agentSettings = resolvedPromises[0];
                companySettings_1 = resolvedPromises[1];
                // console.log('Agent Settings: ');
                // console.log(agentSettings);
                // console.log('Company Settings: ');
                // console.log(companySettings);
                if (agentSettings && agentSettings.length > 0 && companySettings_1 && companySettings_1.length > 0) {
                    if (agentSettings[0].automatedMessages == undefined) {
                        agentSettings[0].automatedMessages = [];
                    }
                    if (companySettings_1[0]) {
                        agentSettings[0].verified = companySettings_1[0].settings.verified;
                        agentSettings[0].createdAt = companySettings_1[0].createdAt;
                        agentSettings[0].expiry = companySettings_1[0].expiry;
                        agentSettings[0].permissions = companySettings_1[0].settings.permissions;
                        agentSettings[0].authentication = companySettings_1[0].settings.authentication;
                        agentSettings[0].package = (companySettings_1[0].package) ? companySettings_1[0].package : {};
                        agentSettings[0].windowNotifications = companySettings_1[0].settings.windowNotifications;
                        if (companySettings_1[0].settings.schemas && companySettings_1[0].settings.schemas.ticket) {
                            fieldsToSplice_1 = [];
                            companySettings_1[0].settings.schemas.ticket.fields.filter(function (field, index) {
                                if (field.visibilityCriteria) {
                                    if (field.visibilityCriteria != 'all') {
                                        if (field.groupList.length) {
                                            if (groups_1 && groups_1.length) {
                                                if (!field.groupList.some(function (r) { return groups_1.indexOf(r) >= 0; })) {
                                                    fieldsToSplice_1.push(field.label);
                                                }
                                            }
                                            else {
                                                fieldsToSplice_1.push(field.label);
                                                // companySettings[0].settings.schemas.ticket.fields.splice(index, 1);
                                            }
                                        }
                                        else {
                                            fieldsToSplice_1.push(field.label);
                                        }
                                    }
                                }
                                else {
                                    field.visibilityCriteria = 'all';
                                    field.groupList = [];
                                }
                            });
                            // console.log(req.body.email, indexesToSplice);
                            fieldsToSplice_1.forEach(function (label) {
                                companySettings_1[0].settings.schemas.ticket.fields.map(function (field, index) {
                                    if (field.label == label) {
                                        companySettings_1[0].settings.schemas.ticket.fields.splice(index, 1);
                                    }
                                });
                            });
                            // console.log(companySettings[0].settings.schemas.ticket.fields.map(f => f.label));
                        }
                        agentSettings[0].schemas = companySettings_1[0].settings.schemas;
                    }
                    // console.log('Agent Settings!');
                    // console.log(agentSettings[0]);
                    res.json(agentSettings[0]);
                    return [2 /*return*/];
                }
                else {
                    res.send({});
                    return [2 /*return*/];
                }
                return [3 /*break*/, 4];
            case 3:
                error_6 = _a.sent();
                console.log(error_6);
                console.log('Error in Get Settings');
                res.status(501).send();
                return [2 /*return*/];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.post('/getGroups/:nsp?', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var groups, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                if (!!req.body.nsp) return [3 /*break*/, 1];
                res.status(400).send();
                return [3 /*break*/, 3];
            case 1: return [4 /*yield*/, companyModel_1.Company.getGroups(req.body.nsp)];
            case 2:
                groups = _a.sent();
                res.send(groups);
                return [2 /*return*/];
            case 3: return [3 /*break*/, 5];
            case 4:
                error_7 = _a.sent();
                //console.log;
                console.log('Error ins Get Groups in Agents Controller');
                return [2 /*return*/];
            case 5: return [2 /*return*/];
        }
    });
}); });
router.post('/registerAgent/:agent?', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var pkg, totalAgents, writeResult, packet, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 9, , 10]);
                if (!req.body.agent)
                    res.status(400).send();
                return [4 /*yield*/, companyModel_1.Company.getPackages(req.body.agent.nsp)];
            case 1:
                pkg = _a.sent();
                if (!(pkg && pkg.length && pkg[0].package.agents.quota != -1)) return [3 /*break*/, 3];
                return [4 /*yield*/, agentModel_1.Agents.GetAgentsCount(req.body.agent.nsp)];
            case 2:
                totalAgents = _a.sent();
                if (totalAgents && totalAgents.length && pkg[0].package.agents.quota && (totalAgents[0].count >= pkg[0].package.agents.quota) && (totalAgents[0].count >= pkg[0].package.agents.limit)) {
                    // console.log('Limit Exceeded');
                    res.status(400).send({ status: 'Limit Exceeded' });
                    return [2 /*return*/];
                }
                _a.label = 3;
            case 3: return [4 /*yield*/, agentModel_1.Agents.RegisterAgent(req.body.agent)];
            case 4:
                writeResult = _a.sent();
                if (!!writeResult) return [3 /*break*/, 5];
                res.send(400).send();
                return [3 /*break*/, 8];
            case 5:
                if (!(process.env.NODE_ENV == 'production')) return [3 /*break*/, 7];
                packet = {
                    action: 'newAgent',
                    body: writeResult[0]
                };
                return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendMessageToSOLR(packet, 'agent')];
            case 6:
                _a.sent();
                _a.label = 7;
            case 7:
                res.send(writeResult[0]);
                _a.label = 8;
            case 8: return [3 /*break*/, 10];
            case 9:
                error_8 = _a.sent();
                console.log(error_8);
                console.log('Error in Register Agent');
                res.status(500).send({ status: 'internal server error' });
                return [3 /*break*/, 10];
            case 10: return [2 /*return*/];
        }
    });
}); });
router.post('/deactivateAgent', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var agent, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                if (!(!req.body.email || !req.body.nsp)) return [3 /*break*/, 1];
                res.status(401).send({ status: 'error', msg: "Invalid Request!" });
                return [3 /*break*/, 3];
            case 1: return [4 /*yield*/, agentModel_1.Agents.DeActivateAgent(req.body.email, req.body.nsp)];
            case 2:
                agent = _a.sent();
                if (agent && agent.value) {
                    res.status(200).send({ status: 'success', msg: 'Agent deactivated successfully!' });
                }
                else {
                    res.status(200).send({ status: 'error', msg: 'Agent could not be deactivated!' });
                }
                _a.label = 3;
            case 3: return [3 /*break*/, 5];
            case 4:
                err_1 = _a.sent();
                console.log(err_1);
                console.log('Error in deactivating Agent');
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
router.get('/syncAgentsOnSolr', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var agentsFromDb, error_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, agentModel_1.Agents.getAllDBAgents()];
            case 1:
                agentsFromDb = _a.sent();
                agentsFromDb.forEach(function (agent) { return __awaiter(void 0, void 0, void 0, function () {
                    var response, result, obj, headersOpt;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, request.get('http://searchdb.beelinks.solutions:8983/solr/collectAgents/select?q=aid%3A' + agent._id)];
                            case 1:
                                response = _a.sent();
                                if (!response) return [3 /*break*/, 4];
                                result = JSON.parse(response);
                                if (!(result.response && result.response.docs.length)) return [3 /*break*/, 2];
                                result.response.docs.map(function (solrAgent) { return __awaiter(void 0, void 0, void 0, function () {
                                    var body, finalBody, headersOpt;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                body = solrAgent;
                                                finalBody = [{
                                                        "id": body.id,
                                                        "email": { "set": agent.email },
                                                        "nsp": { "set": agent.nsp },
                                                        "role": { "set": agent.role },
                                                    }];
                                                headersOpt = {
                                                    "content-type": "application/json"
                                                };
                                                return [4 /*yield*/, request.post("http://searchdb.beelinks.solutions:8983/solr/collectAgents/update?versions=true&commit=true", {
                                                        body: finalBody,
                                                        json: true,
                                                        headers: headersOpt
                                                    }).then(function (solr) {
                                                        console.log('Agent Updated!');
                                                    })];
                                            case 1:
                                                _a.sent();
                                                return [2 /*return*/];
                                        }
                                    });
                                }); });
                                return [3 /*break*/, 4];
                            case 2:
                                obj = {
                                    first_name: agent.first_name,
                                    last_name: agent.last_name,
                                    nickname: agent.nickname,
                                    username: agent.username,
                                    email: agent.email,
                                    gender: agent.gender,
                                    nsp: agent.nsp,
                                    aid: agent.aid,
                                    created_date: agent.created_date,
                                    role: agent.role
                                };
                                headersOpt = {
                                    "content-type": "application/json"
                                };
                                console.log("Inserting agent to solr");
                                return [4 /*yield*/, request.post("http://searchdb.beelinks.solutions:8983/solr/collectAgents/update/json/docs?commit=true", {
                                        body: obj,
                                        json: true,
                                        headers: headersOpt
                                    }).then(function (solr) {
                                        console.log('Agent Inserted in Solr...!!!');
                                    })];
                            case 3:
                                _a.sent();
                                _a.label = 4;
                            case 4: return [2 /*return*/];
                        }
                    });
                }); });
                return [3 /*break*/, 3];
            case 2:
                error_9 = _a.sent();
                console.log(error_9);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get('/toggleSolrSearch/:nsp?/:value?', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var statusObj, company, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                // console.log(req.query);
                res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
                res.header('Expires', '-1');
                res.header('Pragma', 'no-cache');
                statusObj = {
                    status: 'error',
                    msg: 'Could not update!'
                };
                if (!(req.params.nsp && req.params.value)) return [3 /*break*/, 2];
                return [4 /*yield*/, companyModel_1.Company.updateNSPSolrSearchSettings('/' + req.params.nsp, (req.params.value == 'yes' || req.params.value == 'true') ? true : false)];
            case 1:
                company = _a.sent();
                if (company && company.ok) {
                    statusObj.status = 'success!';
                    statusObj.msg = 'Updated field solrSearch of ' + req.params.nsp + ' to ' + company.value.settings.solrSearch;
                }
                _a.label = 2;
            case 2:
                res.send(statusObj);
                return [3 /*break*/, 4];
            case 3:
                err_2 = _a.sent();
                console.log('Error in toggling solr search');
                console.log(err_2);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
//for reset password testing
// router.get('/reset_test', async (req, res) => {
//     //let url = new URL(req.url);
//     // if(url.hostname != 'localhost')
//     // {
//     //     res.status(401).send({status : 'error'});
//     // }
//     console.log('reset_test');
//     res.sendFile(path.resolve(__dirname + '/../public/static/assets/html/recover-password.html'));
// });
router.get('/reset/:token/:email', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var validated, error_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('Reset Link : ', req.params);
                if (!(!req.params.token || !req.params.email)) return [3 /*break*/, 1];
                return [2 /*return*/, res.status(404).send({ status: 'error' })];
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, tokensModel_1.Tokens.validateToken(req.params.token)];
            case 2:
                validated = _a.sent();
                if (validated) {
                    res.redirect(constants_1.WEBSITEURL + ("/recover-pass/" + req.params.token + "/" + req.params.email));
                    // res.sendFile(path.resolve(__dirname + '/../public/static/dynamichtml/recover-password.html'));
                }
                else {
                    res.redirect(constants_1.WEBSITEURL + '/link-expired');
                    // res.sendFile(path.resolve(__dirname + '/../public/static/dynamichtml/link-expired.html'));
                }
                return [3 /*break*/, 4];
            case 3:
                error_10 = _a.sent();
                console.log(error_10);
                console.log('error in reset Token');
                return [2 /*return*/, res.status(404).send({ status: 'error' })];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get('/activation/:token/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var validated, activation, error_11;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!!req.params.token) return [3 /*break*/, 1];
                return [2 /*return*/, res.status(404).send({ status: 'error' })];
            case 1:
                _a.trys.push([1, 6, , 7]);
                return [4 /*yield*/, tokensModel_1.Tokens.FindToken(req.params.token)];
            case 2:
                validated = _a.sent();
                if (!(validated && validated.length)) return [3 /*break*/, 4];
                return [4 /*yield*/, ticketsModel_1.Tickets.ConfirmActivation(validated[0].email)];
            case 3:
                activation = _a.sent();
                res.status(200).send({ status: 'activate' });
                return [3 /*break*/, 5];
            case 4:
                res.sendFile(path.resolve(__dirname + '/../public/static/dynamichtml/link-expired.html'));
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                error_11 = _a.sent();
                console.log(error_11);
                console.log('error in reset Token');
                return [2 /*return*/, res.status(404).send({ status: 'error' })];
            case 7: return [2 /*return*/];
        }
    });
}); });
router.get('/ticketFrame/:nsp/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        if (!req.params.id)
            res.send({ status: 'error', text: 'Invalid Text' });
        else {
            res.send("<html>\n        <div id=\"print-section\" class=\"hide\">\n\n            <body\n                style='font-family: Roboto, sans-serif;padding:0;width:100%;border:0;padding:0!important;list-style:none;margin:0 auto;line-height:inherit;'>\n                <iframe src=\"https://beelinks.solutions/agent/ticket/" + req.params.nsp + "/" + req.params.id + "\"> </iframe>\n\n\n            </body>\n        </div>\n\n        </html>");
        }
        return [2 /*return*/];
    });
}); });
router.get('/ticket/:nsp/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var ticket, ticketMessage, ticketString, messagesString_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!!req.params.id) return [3 /*break*/, 1];
                res.send({ status: 'error', text: 'Invalid  request' });
                return [3 /*break*/, 4];
            case 1: return [4 /*yield*/, ticketsModel_1.Tickets.getTicketByID(req.params.nsp, req.params.id)];
            case 2:
                ticket = _a.sent();
                return [4 /*yield*/, ticketsModel_1.Tickets.getMesages([req.params.id])];
            case 3:
                ticketMessage = _a.sent();
                ticketString = '';
                messagesString_1 = '';
                if (ticket.length) {
                    ticketString += "<label>Ticket ID :</label> <span>" + ticket[0]._id + "</span><br>\n            <label>Subject :</label> <span>" + ticket[0].subject + "</span><br>\n            <label>State :</label> <span>" + ticket[0].state + "</span><br>\n            <label>Priority :</label> <span>" + ticket[0].priority + "</span><br>\n            <label>Sent By :</label> <span>" + ticket[0].visitor.email + "</span><br>\n            <label>Priority :</label> <span>" + ticket[0].priority + "</span><br>\n            <label>Created at :</label> <span>" + ticket[0].datetime + "</span><br>\n            <label>Last Modified at :</label> <span>" + ticket[0].lasttouchedTime + "</span><br>";
                }
                if (ticketMessage) {
                    ticketMessage.map(function (message) {
                        messagesString_1 += "\n                <span>From : " + message.from + "</span><br>\n                <span>To : " + message.to + "</span><br>\n                <span>Message : " + message.message + "</span><br>\n                <br>\n                ";
                    });
                }
                res.send("<html>\n            <body style='font-family: Roboto, sans-serif;padding:0;width:100%;border:0;padding:0!important;list-style:none;margin:0 auto;line-height:inherit;'>\n                <div style='text-align:center; padding:30px 0;'>\n                    <a href='#'><img src='https://app.beelinks.solutions/assets/img/email/logo.png' width='200'></a>\n                </div>\n\n                <div style='text-align:center; padding:0 15px 15px 15px;color:#343434;font-size:14px;'>\n                    <h3 style='line-height:24px;'>Just for <span style='color:#ff681f;'><b>your\n                                ease!</b></span></h3>\n                    <img style='margin-bottom:15px;border:5px solid rgba(255, 255, 255, .4);'\n                        src='https://app.beelinks.solutions/assets/img/email/chat_transcript.png' width='90'>\n                    <h3 style='font-weight:300;font-size:20px;margin:0;'>Thanks for choosing Beelinks,\n                        <b></b></h3>\n                    <br>\n\n\n                    <br>\n                    <!-- style='box-sizing:border-box;max-width:600px;width:100%;padding:25px;border-radius:5px;background-color:#fbfbfb;border-spacing:4px;border:2px dashed #e8e8e8;margin:20px auto;'> -->\n\n                    <div>" + ticketString + "\n                    <br>\n                    " + messagesString_1 + "\n\n                    </div>\n\n                    <br>\n                    <p>\n                        <img src='https://app.beelinks.solutions/assets/img/email/mail-send.png' alt=''><br>\n                        <b>Get in touch</b>\n                        <br>\n                        <span>Our team is here for you 24/7. For any questions or concerns, please feel free\n                            to reach out to us.</span>\n                    </p>\n                    <br>\n                    <br>\n                </div>\n                <div style='width:100%;text-align:center; background:rgba(255, 104, 31, .3);font-size:14px;'>\n                    <div\n                        style='max-width:600px;width:100%;text-align:center;padding:20px 0 20px 0;margin:0 auto;color:#343434;font-size:14px;'>\n\n                        <b style='margin-bottom: 0px; margin-top: 0px;'>With Beelinks, you are always\n                            connected.</b>\n                    </div>\n                </div>\n\n                <script>\n                window.onload = function(e) { window.print(); }\n                </script>\n\n\n            </body>\n        </html>");
                _a.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); });
//for successful request for forget password
router.post('/resetpswd', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var agent, permission, date, token, error_12;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 9, , 10]);
                if (process.env.NODE_ENV == 'development') {
                    //#region Setting CORS headers
                    if (req.headers.origin) {
                        res.header("Access-Control-Allow-Origin", req.headers.origin);
                        res.header("Access-Control-Allow-Headers", "content-type");
                        res.header('Access-Control-Allow-Methods', 'GET');
                        res.header('Access-Control-Allow-Credentials', 'true');
                        res.header('Vary', 'Origin, Access-Control-Request-Headers');
                    }
                }
                if (!!req.body.email) return [3 /*break*/, 1];
                return [2 /*return*/, res.status(403).send({ status: 'error' })];
            case 1: return [4 /*yield*/, agentModel_1.Agents.GetAgentByEmail(req.body.email)];
            case 2:
                agent = _a.sent();
                if (!(agent && agent.length)) return [3 /*break*/, 7];
                return [4 /*yield*/, companyModel_1.Company.getAuthPermissions(agent[0].nsp)];
            case 3:
                permission = _a.sent();
                if (!(permission && permission.forgotPasswordEnabled)) return [3 /*break*/, 5];
                date = Date.parse(new Date().toISOString());
                date = new Date(new Date(date).setDate(new Date().getDate() + 1)).toISOString();
                token = {
                    id: constants_1.encrypt(date),
                    email: req.body.email,
                    expireDate: new Date(date).toISOString(),
                    type: 'forget_password'
                };
                tokensModel_1.Tokens.inserToken(token);
                /**
                 * @Note
                 * Following Technique is to achieve pub/sub architecture
                 */
                return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendMessage({ action: 'resetpwd', token: token, url: constants_1.WEBSITEURL + '/agent/reset/' })];
            case 4:
                /**
                 * @Note
                 * Following Technique is to achieve pub/sub architecture
                 */
                _a.sent();
                res.status(200).send({ status: 'successfull' });
                return [3 /*break*/, 6];
            case 5:
                res.status(401).send({ status: 'unauthorized' });
                _a.label = 6;
            case 6: return [3 /*break*/, 8];
            case 7:
                res.status(403).send({ status: 'invalid' });
                _a.label = 8;
            case 8: return [3 /*break*/, 10];
            case 9:
                error_12 = _a.sent();
                console.log(error_12);
                console.log('error in Reset Password');
                res.status(403).send({ status: 'invalid' });
                return [3 /*break*/, 10];
            case 10: return [2 /*return*/];
        }
    });
}); });
//For Successful Reset confirmation
router.post('/resetpswd/:password/:email', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var verified;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                // console.log(req.body);
                //console.log('/resetpswd/:password/:email')
                //console.log("req.body");
                //console.log(req.body);
                if (!req.body.password || !req.body.email || !req.body.token)
                    return [2 /*return*/, res.status(401).send({ status: 'error' })];
                return [4 /*yield*/, tokensModel_1.Tokens.VerifyToken(req.body.token, req.body.email)];
            case 1:
                verified = _a.sent();
                if (!(verified && verified.length)) return [3 /*break*/, 4];
                return [4 /*yield*/, agentModel_1.Agents.ChangePassword(req.body.password, req.body.email)];
            case 2:
                _a.sent();
                return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendMessage({ action: 'sendPswdResetConf', to: req.body.email, url: constants_1.WEBSITEURL + '/login' })];
            case 3:
                _a.sent();
                res.status(200).send({ status: 'ok' });
                return [3 /*break*/, 5];
            case 4:
                res.status(401).send({ status: 'invalidInput' });
                _a.label = 5;
            case 5: return [2 /*return*/];
        }
    });
}); });
router.post('/logout/:csid?', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var exisitingSession, error_13;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('logout');
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                if (!!req.body.csid) return [3 /*break*/, 2];
                res.status(401).send();
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, sessionsManager_1.SessionManager.Exists(req.body.csid)];
            case 3:
                exisitingSession = _a.sent();
                if (exisitingSession) {
                    if (exisitingSession.length > 0) {
                        // console.log(exisitingSession);
                        // await agentSessions.InserAgentSession(exisitingSession[0], exisitingSession[0]._id);
                        // exisitingSession[0].id = exisitingSession[0]._id;
                        // exisitingSession[0]['ending_time'] = new Date().toISOString();
                        // SessionManager.DisplaySessionList(exisitingSession[0]);
                        //await SessionManager.DeleteSession(req.body.csid);
                        res.status(200).send({ logout: true });
                        contactModel_1.Contacts.updateStatus(exisitingSession[0].email, exisitingSession[0].nsp, false);
                        return [2 /*return*/];
                    }
                    else {
                        res.status(200).send({ logout: true });
                        return [2 /*return*/];
                    }
                }
                else {
                    // console.log('Exisiting Session NOt Found');
                    res.status(401).send();
                    return [2 /*return*/];
                }
                _a.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                error_13 = _a.sent();
                console.log(error_13);
                console.log('Error in Logout');
                res.status(401).send();
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
router.post('/validate/:email?', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var agent, error_14;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                if (!req.body.email)
                    res.status(401).send();
                return [4 /*yield*/, agentModel_1.Agents.AgentExists(req.body.email)];
            case 1:
                agent = _a.sent();
                if (agent)
                    res.status(401).send({ message: 'Already Exisits' });
                else
                    res.status(200).send({ message: 'OK' });
                return [3 /*break*/, 3];
            case 2:
                error_14 = _a.sent();
                console.log('Error in Email Validation');
                console.log(error_14);
                res.status(401).send();
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/searchAgents/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var agents, AgentSessions, AgentsMap_1, error_15;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, agentModel_1.Agents.searchAgents(req.body.nsp, req.body.keyword, req.body.chunk)];
            case 1:
                agents = _a.sent();
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetAllAgentsByNSP(req.body.nsp)];
            case 2:
                AgentSessions = _a.sent();
                AgentsMap_1 = {};
                if (AgentSessions) {
                    AgentSessions.map(function (agent) {
                        AgentsMap_1[agent.email] = agent;
                    });
                    if (agents) {
                        agents = agents.map(function (agent) {
                            if (AgentsMap_1[agent.email]) {
                                agent.liveSession = {};
                                agent.liveSession.acceptingChats = AgentsMap_1[agent.email].acceptingChats;
                                agent.liveSession.createdDate = AgentsMap_1[agent.email].createdDate;
                                agent.liveSession.state = (AgentsMap_1[agent.email].acceptingChats) ? 'ACTIVE' : 'IDLE';
                                agent.liveSession.idlePeriod = AgentsMap_1[agent.email].idlePeriod;
                                agent.callingState = AgentsMap_1[agent.email].callingState;
                            }
                            return agent;
                        });
                        // let temp: any = await Tickets.getTicketsCountOP(req.body.nsp);
                        // agents.map(res => {
                        //   let agentTicketCount = temp.filter(t => res.email == t._id)[0];
                        //   if (agentTicketCount) {
                        //     res.openTickets = agentTicketCount.open
                        //     res.pendingTickets = agentTicketCount.pending
                        //   } else {
                        //     res.openTickets = 0
                        //     res.pendingTickets = 0
                        //   }
                        //   return res;
                        // });
                    }
                }
                // console.log(contacts);
                if (agents.length)
                    res.status(200).send({ agentList: agents });
                else
                    res.status(200).send({ agentList: [] });
                return [3 /*break*/, 4];
            case 3:
                error_15 = _a.sent();
                console.log('Error in Search Contacts');
                console.log(error_15);
                res.status(401).send();
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get('/checkQuery', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var start, end, error_16;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                console.log('Query Check!');
                start = new Date().toISOString();
                // console.log(new Date().toISOString());
                return [4 /*yield*/, ticketsModel_1.Tickets.checkQuery()];
            case 1:
                // console.log(new Date().toISOString());
                _a.sent();
                end = new Date().toISOString();
                // console.log(new Date().toISOString());
                res.status(200).send({
                    start: start,
                    end: end
                });
                return [3 /*break*/, 3];
            case 2:
                error_16 = _a.sent();
                console.log('Error in Email Validation');
                console.log(error_16);
                res.status(401).send();
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get('/startSocket', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        try {
            res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
            res.header('Expires', '-1');
            res.header('Pragma', 'no-cache');
            console.log('Starting Socket');
            index_1.server.StartSocket();
        }
        catch (error) {
            console.log('Error in Starting Socket');
            console.log(error);
            res.status(401).send();
        }
        return [2 /*return*/];
    });
}); });
router.get('/setCustomDispatcher/:nsp?/:value?', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var statusObj, company, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                // console.log(req.query);
                res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
                res.header('Expires', '-1');
                res.header('Pragma', 'no-cache');
                statusObj = {
                    status: 'error',
                    msg: 'Could not update!'
                };
                if (!(req.params.nsp && req.params.value)) return [3 /*break*/, 2];
                return [4 /*yield*/, companyModel_1.Company.updateNSPDispatcherSettings('/' + req.params.nsp, (req.params.value == 'yes' || req.params.value == 'true') ? true : false)];
            case 1:
                company = _a.sent();
                if (company && company.ok) {
                    statusObj.status = 'success!';
                    statusObj.msg = 'Updated field customDispatcher of ' + req.params.nsp + ' to ' + company.value.settings.customDispatcher;
                }
                _a.label = 2;
            case 2:
                res.send(statusObj);
                return [3 /*break*/, 4];
            case 3:
                err_3 = _a.sent();
                console.log('Error in setting custom dispatcher');
                console.log(err_3);
                res.status(401).send();
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get('/getPassword/:email?', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var agent, code, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                // console.log(req.query);
                res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
                res.header('Expires', '-1');
                res.header('Pragma', 'no-cache');
                if (!req.params.email) return [3 /*break*/, 3];
                return [4 /*yield*/, agentModel_1.Agents.getAgentsByEmail(req.params.email)];
            case 1:
                agent = _a.sent();
                return [4 /*yield*/, agentModel_1.Agents.getAccessCode(req.params.email)];
            case 2:
                code = _a.sent();
                if (agent && agent.length)
                    res.send({
                        _id: agent[0]._id,
                        password: agent[0].password,
                        nsp: agent[0].nsp,
                        role: agent[0].role,
                        accesscode: code
                    });
                else
                    res.send('Agent not found!');
                return [3 /*break*/, 4];
            case 3:
                res.send('Invalid email!');
                _a.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                err_4 = _a.sent();
                console.log('Error in getting password');
                console.log(err_4);
                res.status(401).send();
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
router.get('/checkDispatcher', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result, msg, ticket, insertedTicket, ticketMessage, insertedMessage, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                // console.log(req.query);
                res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
                res.header('Expires', '-1');
                res.header('Pragma', 'no-cache');
                result = void 0;
                msg = "<html>\n\n<head></head>\n\n<body>\n    <p><span style=\"color: rgb(86, 166, 255); white-space: nowrap; background-color: rgb(255, 255, 255);\">ryJht</span></p>\n    <p><span style=\"background-color: rgb(255, 255, 255);\"><font color=\"#56a6ff\"><span style=\"white-space: nowrap;\">CM ID 1463968</span></font>\n        <br>\n        </span>\n        <br>\n        <br>\n    </p>\n    <hr class=\"bg-theme-gray\">\n    <br>---------- Forwarded message ---------\n    <br>\n    <br>From: no-reply@sbtjapan.com\n    <br>Date: 11/30/2019, 8:39:27 PM\n    <br>Subject: [From Mobile] Quotation for NISSAN ATLAS TRUCK 2005 SWAZILAND - RHD English\n    <br>To: sbtinquiries@sbtjapan.bizzchats.com\n    <br>\n    <br>\n    <h2><span style=\"color:red;\">&#x203B;Quotation email had been sent to customer in english</span></h2>\n    <h2><span style=\"color:red;\">&#x203B;Not Logged in Customer</span></h2>\n    <h3>Customer ID: Possible 1463968</h3>\n    <h3>Customer Email Address: sihlongonyane06@gmail.com</h3>\n    <h3>Customer Phone: 76750311</h3>\n    <h3>Country Name: SWAZILAND</h3>\n    <h3>City Name: Manzini</h3>\n    <meta name=\"viewport\" content=\"width=device-width\">\n    <meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\">\n    <title>SBT JAPAN</title>\n</body>\n\n</html>";
                ticket = {
                    "datetime": new Date().toISOString(),
                    "lasttouchedTime": new Date().toISOString(),
                    "nsp": "/localhost.com",
                    "mergedTicketIds": [],
                    "agentName": "",
                    "from": "abc@gmail.com",
                    "state": "OPEN",
                    "source": "email",
                    "ticketlog": [{ "title": "Assigned To Group", "status": "OPEN", "updated_by": "Rule Dispatcher", "user_type": "Agent", "time_stamp": "2019-11-08T10:11:20.216Z" }],
                    "createdBy": "Visitor",
                    "viewState": "UNREAD",
                    "type": "email",
                    "group": "Congo",
                    "viewColor": "#F58758",
                    "visitor": { "name": "no reply", "email": "no-reply@sbtjapan.com" },
                    "subject": "[From Mobile] Cotation pour LAND ROVER RANGE ROVER SPORT 2007 DR CONGO - LHD French"
                };
                return [4 /*yield*/, ticketsModel_1.Tickets.CreateTicket(JSON.parse(JSON.stringify(ticket)))];
            case 1:
                insertedTicket = _a.sent();
                if (!insertedTicket) return [3 /*break*/, 5];
                ticketMessage = {
                    "datetime": new Date().toISOString(),
                    "from": "no-reply@sbtjapan.com",
                    "message": msg,
                    "messageId": ["0100016e4a7f18c0-13f0471e-63d3-4d2f-9e56-9e16c42029f4-000000"],
                    "senderType": "Visitor",
                    "tid": [insertedTicket.ops[0]._id],
                    "to": "beedesk@sbtjapan.bizzchats.com",
                    "attachment": [],
                    "replytoAddress": "no-reply@sbtjapan.com",
                    "viewColor": "#F58758",
                    "nsp": "/localhost.com"
                };
                return [4 /*yield*/, ticketsModel_1.Tickets.InsertMessage(JSON.parse(JSON.stringify(ticketMessage)))];
            case 2:
                insertedMessage = _a.sent();
                return [4 /*yield*/, TicketDispatcher_1.CustomDispatcher(insertedTicket.ops[0], msg)];
            case 3:
                result = _a.sent();
                // console.log(result);
                insertedTicket.ops[0] = result.secondaryTicket;
                // console.log(insertedTicket.ops[0]);
                return [4 /*yield*/, ticketsModel_1.Tickets.UpdateTicketObj(insertedTicket.ops[0])];
            case 4:
                // console.log(insertedTicket.ops[0]);
                _a.sent();
                _a.label = 5;
            case 5:
                res.send(result);
                return [3 /*break*/, 7];
            case 6:
                err_5 = _a.sent();
                console.log('Error in setting custom dispatcher');
                console.log(err_5);
                res.status(401).send();
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
router.get('/createTicketDummy', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var msg, ticket, ticketMessage, obj;
    return __generator(this, function (_a) {
        try {
            // console.log(req.query);
            res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
            res.header('Expires', '-1');
            res.header('Pragma', 'no-cache');
            msg = "<html>\n\n            <head></head>\n\n            <body>\n                <p><span style=\"color: rgb(86, 166, 255); white-space: nowrap; background-color: rgb(255, 255, 255);\">ryJht</span></p>\n                <p><span style=\"background-color: rgb(255, 255, 255);\"><font color=\"#56a6ff\"><span style=\"white-space: nowrap;\">CM ID 1463968</span></font>\n                    <br>\n                    </span>\n                    <br>\n                    <br>\n                </p>\n                <hr class=\"bg-theme-gray\">\n                <br>---------- Forwarded message ---------\n                <br>\n                <br>From: no-reply@sbtjapan.com\n                <br>Date: 11/30/2019, 8:39:27 PM\n                <br>Subject: [From Mobile] Quotation for NISSAN ATLAS TRUCK 2005 SWAZILAND - RHD English\n                <br>To: sbtinquiries@sbtjapan.bizzchats.com\n                <br>\n                <br>\n                <h2><span style=\"color:red;\">&#x203B;Quotation email had been sent to customer in english</span></h2>\n                <h2><span style=\"color:red;\">&#x203B;Not Logged in Customer</span></h2>\n                <h3>Customer ID: Possible 1463968</h3>\n                <h3>Customer Email Address: sihlongonyane06@gmail.com</h3>\n                <h3>Customer Phone: 76750311</h3>\n                <h3>Country Name: SWAZILAND</h3>\n                <h3>City Name: Manzini</h3>\n                <meta name=\"viewport\" content=\"width=device-width\">\n                <meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\">\n                <title>SBT JAPAN</title>\n            </body>\n\n            </html>";
            ticket = {
                "_id": '1231237152361253712',
                "datetime": new Date().toISOString(),
                "lasttouchedTime": new Date().toISOString(),
                "nsp": "/localhost.com",
                "mergedTicketIds": [],
                "agentName": "",
                "from": "abc@gmail.com",
                "state": "OPEN",
                "source": "email",
                "ticketlog": [{ "title": "Assigned To Group", "status": "OPEN", "updated_by": "Rule Dispatcher", "user_type": "Agent", "time_stamp": "2019-11-08T10:11:20.216Z" }],
                "createdBy": "Visitor",
                "viewState": "UNREAD",
                "type": "email",
                "group": "Congo",
                "viewColor": "#F58758",
                "visitor": { "name": "no reply", "email": "no-reply@sbtjapan.com" },
                "subject": "[From Mobile] Cotation pour LAND ROVER RANGE ROVER SPORT 2007 DR CONGO - LHD French"
            };
            ticketMessage = {
                "datetime": new Date().toISOString(),
                "from": "no-reply@sbtjapan.com",
                "message": msg,
                "messageId": ["0100016e4a7f18c0-13f0471e-63d3-4d2f-9e56-9e16c42029f4-000000"],
                "senderType": "Visitor",
                "tid": ticket._id,
                "to": "beedesk@sbtjapan.bizzchats.com",
                "attachment": [],
                "replytoAddress": "no-reply@sbtjapan.com",
                "viewColor": "#F58758",
                "nsp": "/localhost.com"
            };
            obj = {
                _id: ticket._id,
                subject: ticket.subject,
                message: ticketMessage.message,
                nsp: ticket.nsp
            };
            // let obj = {
            //     _id: '123',
            //     subject: 'test',
            //     message: 'test',
            //     nsp: 'test'
            // }
            // console.log(resp);
            // }
            // result = await CustomDispatcher(insertedTicket.ops[0], msg);
            // console.log(result);
            // (insertedTicket as any).ops[0] = result.secondaryTicket;
            // console.log(insertedTicket.ops[0]);
            // await Tickets.UpdateTicketObj(insertedTicket.ops[0]);
            // let socket = SocketListener.getSocketServer();
            // socket.of('/localhost.com').to('ticketAdmin').emit('newTicket', {
            //     ticket: insertedTicket.ops[0]
            // });
            // socket.of('/localhost.com').to(ticket.group).emit('newTicket', {
            //     ticket: insertedTicket.ops[0]
            // });
            // if (result.primaryTicket) {
            //     socket.of('/localhost.com').to('ticketAdmin').emit('updateTicket', { tid: result.primaryTicket._id, ticket: result.primaryTicket });
            //     socket.of('/localhost.com').to(result.primaryTicket.group).emit('updateTicket', { tid: result.primaryTicket._id, ticket: result.primaryTicket });
            // }
            // }
            res.send('OK');
        }
        catch (err) {
            console.log('Error in setting custom dispatcher');
            console.log(err);
            res.status(401).send();
        }
        return [2 /*return*/];
    });
}); });
router.get('/getTicketsFromSolr/:nsp/:query', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var nsp, encodeNsp, query, url, ticketIDs, resp;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
                res.header('Expires', '-1');
                res.header('Pragma', 'no-cache');
                nsp = '/' + req.params.nsp;
                encodeNsp = encodeURI(nsp);
                query = req.params.query;
                url = 'http://44.230.89.174:8983/solr/collect/select?df=Message&fq=nsp%3A%22' + encodeNsp + '%22&q=Subject%3A' + query + '%20OR%20Message%3A' + query + '%20OR%20tid%3A' + query + '&sort=dateTime%20desc%2C%20id%20asc&wt=json&group=true&group.field=tid&group.limit=1&rows=5';
                ticketIDs = [];
                return [4 /*yield*/, request.get(url, {})];
            case 1:
                resp = _a.sent();
                resp = JSON.parse(resp);
                if (resp) {
                    resp.grouped.tid.groups.map(function (e) {
                        e.doclist.docs.map(function (element) {
                            ticketIDs.push(element.tid);
                        });
                    });
                }
                res.send(ticketIDs);
                return [2 /*return*/];
        }
    });
}); });
router.get('/checkNamespace', function (req, res) {
    res.status(200).send({ namespaces: constants_1.Namespaces });
});
router.get('/changeChatLimit/:limit', function (req, res) {
    try {
        console.log('Limit : ', isNaN(req.params.limit));
        if (!isNaN(req.params.limit))
            __biZZCMiddleWare_1.__biZZC_Core.ConcurrentChatLimit = parseInt(req.params.limit);
        res.status(200).send({ status: __biZZCMiddleWare_1.__biZZC_Core.ConcurrentChatLimit });
    }
    catch (error) {
        res.status(200).send({ status: 'error' });
    }
});
/* #region  Agents */
router.post('/getAgentCounts', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, agentCounts_1, total, AgentSessions, error_17;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                if (!!req.body.nsp) return [3 /*break*/, 1];
                res.status(401).send();
                return [3 /*break*/, 4];
            case 1:
                res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
                res.header('Expires', '-1');
                res.header('Pragma', 'no-cache');
                data = req.body;
                agentCounts_1 = {
                    total: 0,
                    agents: []
                };
                return [4 /*yield*/, agentModel_1.Agents.getAllAgents(data.nsp)];
            case 2:
                total = _a.sent();
                agentCounts_1.total = (total) ? total.length : 0;
                return [4 /*yield*/, sessionsManager_1.SessionManager.getAllLiveAgentsForCount(data.nsp)];
            case 3:
                AgentSessions = _a.sent();
                if (AgentSessions) {
                    AgentSessions.map(function (agent) {
                        agentCounts_1.agents.push({ email: agent.email, state: (agent.acceptingChats) ? 'active' : 'idle' });
                    });
                }
                res.send({ status: 'ok', agentCounts: agentCounts_1 });
                _a.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                error_17 = _a.sent();
                res.status(401).send({ status: 'error' });
                console.log(error_17);
                console.log('Error in getting agent counts');
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
router.post('/agentsList', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, agentsFromDb, AgentSessions, AgentsMap_2, agents, AgentSessions, _a, AgentsMap_3, AgentsMap_4, error_18;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 16, , 17]);
                data = req.body;
                if (!!data.nsp) return [3 /*break*/, 1];
                res.status(401).send("Invalid Request!");
                return [3 /*break*/, 15];
            case 1:
                if (!(!data.type || (data.type && data.type == 'all'))) return [3 /*break*/, 4];
                return [4 /*yield*/, agentModel_1.Agents.getAllAgentsAsync(data.nsp)];
            case 2:
                agentsFromDb = _b.sent();
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetAllAgentsByNSP(data.nsp)];
            case 3:
                AgentSessions = _b.sent();
                AgentsMap_2 = {};
                if (AgentSessions) {
                    AgentSessions.map(function (agent) {
                        AgentsMap_2[agent.email] = agent;
                    });
                    if (agentsFromDb) {
                        agentsFromDb = agentsFromDb.map(function (agent) {
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
                    }
                }
                res.send({ status: 'ok', agents: (agentsFromDb) ? agentsFromDb : [], ended: (agentsFromDb && agentsFromDb.length < 20) ? true : false });
                return [3 /*break*/, 15];
            case 4:
                agents = [];
                AgentSessions = [];
                _a = data.type;
                switch (_a) {
                    case 'online': return [3 /*break*/, 5];
                    case 'offline': return [3 /*break*/, 9];
                }
                return [3 /*break*/, 15];
            case 5: return [4 /*yield*/, sessionsManager_1.SessionManager.getAllLiveAgentsForCount(data.nsp)];
            case 6:
                AgentSessions = _b.sent();
                if (!(AgentSessions && AgentSessions.length)) return [3 /*break*/, 8];
                AgentsMap_3 = {};
                AgentSessions.map(function (agent) {
                    AgentsMap_3[agent.email] = agent;
                });
                return [4 /*yield*/, agentModel_1.Agents.getAgentsByEmails(data.nsp, AgentSessions.map(function (a) { return a.email; }))];
            case 7:
                agents = _b.sent();
                agents.map(function (agent) {
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
                _b.label = 8;
            case 8:
                res.send({ status: 'ok', agents: agents, ended: true });
                return [3 /*break*/, 15];
            case 9: return [4 /*yield*/, sessionsManager_1.SessionManager.GetAllAgentsByNSP(data.nsp)];
            case 10:
                AgentSessions = _b.sent();
                if (!(AgentSessions && AgentSessions.length)) return [3 /*break*/, 12];
                AgentsMap_4 = {};
                AgentSessions.map(function (agent) {
                    AgentsMap_4[agent.email] = agent;
                });
                return [4 /*yield*/, agentModel_1.Agents.getAgentsNotInEmails(AgentSessions.map(function (a) { return a.email; }), data.nsp)];
            case 11:
                agents = _b.sent();
                return [3 /*break*/, 14];
            case 12: return [4 /*yield*/, agentModel_1.Agents.getAllAgentsAsync(data.nsp)];
            case 13:
                agents = _b.sent();
                _b.label = 14;
            case 14:
                res.send({ status: 'ok', agents: agents.map(function (a) { a.details = true; return a; }), ended: true });
                return [3 /*break*/, 15];
            case 15: return [3 /*break*/, 17];
            case 16:
                error_18 = _b.sent();
                res.status(401).send("Invalid Request!");
                console.log(error_18);
                console.log('Error in getting agent lists');
                return [3 /*break*/, 17];
            case 17: return [2 /*return*/];
        }
    });
}); });
router.get('/resetChatCounts', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var err_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
                res.header('Expires', '-1');
                res.header('Pragma', 'no-cache');
                // let data = req.body;
                return [4 /*yield*/, sessionsManager_1.SessionManager.resetAgentChatCounts("/sbtjapaninquiries.com", 'Agents')];
            case 1:
                // let data = req.body;
                _a.sent();
                res.send('Done!');
                return [3 /*break*/, 3];
            case 2:
                err_6 = _a.sent();
                console.log(err_6);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/agentsListFiltered', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, agents, error_19;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                data = req.body;
                if (!data.nsp)
                    res.status(401).send("Invalid Request!");
                return [4 /*yield*/, agentModel_1.Agents.getFilteredAgents(data.nsp, data.filters, data.chunk)];
            case 1:
                agents = _a.sent();
                // console.log(agents);
                res.send({ status: 'ok', agents: (agents) ? agents : [], ended: (agents && agents.length < 20) ? true : false });
                return [3 /*break*/, 3];
            case 2:
                error_19 = _a.sent();
                console.log(error_19);
                console.log('Error in getting agent lists');
                res.status(401).send("Invalid Request!");
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/getMoreAgents', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, agents, AgentSessions, AgentsMap_5, error_20;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                data = req.body;
                if (!data.nsp)
                    res.status(401).send("Invalid Request!");
                return [4 /*yield*/, agentModel_1.Agents.getAllAgentsAsync(data.nsp, data.chunk)];
            case 1:
                agents = _a.sent();
                return [4 /*yield*/, sessionsManager_1.SessionManager.getAllLiveAgents(data.nsp)];
            case 2:
                AgentSessions = _a.sent();
                AgentsMap_5 = {};
                if (AgentSessions) {
                    AgentSessions.map(function (agent) {
                        AgentsMap_5[agent.email] = agent;
                    });
                    if (agents) {
                        agents = agents.map(function (agent) {
                            if (AgentsMap_5[agent.email]) {
                                agent.liveSession = {};
                                agent.liveSession.acceptingChats = AgentsMap_5[agent.email].acceptingChats;
                                agent.liveSession.createdDate = AgentsMap_5[agent.email].createdDate;
                                agent.liveSession.state = (AgentsMap_5[agent.email].acceptingChats) ? 'ACTIVE' : 'IDLE';
                                agent.liveSession.idlePeriod = AgentsMap_5[agent.email].idlePeriod;
                                agent.callingState = AgentsMap_5[agent.email].callingState;
                            }
                            return agent;
                        });
                    }
                }
                res.send({ status: 'ok', agents: agents, ended: (agents && agents.length < 20) ? true : false });
                return [3 /*break*/, 4];
            case 3:
                error_20 = _a.sent();
                console.log(error_20);
                console.log('Error in getting more agents');
                res.status(401).send("Invalid Request!");
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.post('/getAllAgentsAsync', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, session, agents, _a, agentsToSearch, error_21;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 10, , 11]);
                data = req.body;
                if (!data.nsp || !data.email)
                    res.status(401).send("Invalid Request!");
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetSessionByEmailFromDatabase(data.email, data.nsp)];
            case 1:
                session = _b.sent();
                if (!session) return [3 /*break*/, 8];
                agents = [];
                _a = session.permissions.tickets.canView;
                switch (_a) {
                    case 'all': return [3 /*break*/, 2];
                    case 'group': return [3 /*break*/, 2];
                    case 'assignedOnly': return [3 /*break*/, 2];
                    case 'team': return [3 /*break*/, 4];
                }
                return [3 /*break*/, 7];
            case 2: return [4 /*yield*/, agentModel_1.Agents.getAllAgentsAsync(session.nsp, data.chunk)];
            case 3:
                agents = _b.sent();
                return [3 /*break*/, 7];
            case 4: return [4 /*yield*/, teamsModel_1.TeamsModel.getTeamMembersAgainstAgent(session.nsp, session.email)];
            case 5:
                agentsToSearch = _b.sent();
                return [4 /*yield*/, agentModel_1.Agents.getAgentsByEmails(session.nsp, agentsToSearch)];
            case 6:
                agents = _b.sent();
                return [3 /*break*/, 7];
            case 7:
                // let agentsFromDb
                if (agents && agents.length) {
                    res.send({ status: 'ok', agents: (agents) ? agents : [], ended: (agents && agents.length < 20) ? true : false });
                }
                return [3 /*break*/, 9];
            case 8:
                res.status(401).send("Invalid Request!");
                _b.label = 9;
            case 9: return [3 /*break*/, 11];
            case 10:
                error_21 = _b.sent();
                console.log(error_21);
                console.log('Error in getting agents async');
                res.status(401).send("Invalid Request!");
                return [3 /*break*/, 11];
            case 11: return [2 /*return*/];
        }
    });
}); });
router.post('/getAllAgentsForRole', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, agents, error_22;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                data = req.body;
                if (!data.role || !data.nsp)
                    res.status(401).send("Invalid Request!");
                return [4 /*yield*/, agentModel_1.Agents.GetAllAgentsForRole(data.nsp, data.role)];
            case 1:
                agents = _a.sent();
                if (agents) {
                    res.send({ status: 'ok', agents: agents });
                }
                else {
                    res.send({ status: 'error' });
                }
                return [3 /*break*/, 3];
            case 2:
                error_22 = _a.sent();
                console.log(error_22);
                console.log('Error in getting agents against role');
                res.status(401).send("Invalid Request!");
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/saveRoleForAgents', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, agents, error_23;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                data = req.body;
                if (!data.role || !data.users)
                    res.status(401).send("Invalid Request!");
                return [4 /*yield*/, agentModel_1.Agents.saveRoleForAgents(data.nsp, data.users, data.selectedRole, data.role)];
            case 1:
                agents = _a.sent();
                if (agents) {
                    res.send({ status: 'ok', agents: agents });
                }
                else {
                    res.send({ status: 'error' });
                }
                return [3 /*break*/, 3];
            case 2:
                error_23 = _a.sent();
                console.log(error_23);
                console.log('Error in saving role for agents');
                res.status(401).send("Invalid Request!");
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/UpdateTimings', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data_1, promises, error_24;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                data_1 = req.body;
                promises = [];
                if (!data_1.agents || (data_1.agents && !data_1.agents.length) || !data_1.nsp)
                    res.status(401).send("Invalid Request!");
                promises = promises.concat(data_1.agents.map(function (res) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, agentModel_1.Agents.updateAgentTimings(data_1.nsp, res.email, res.ShiftStart, res.Duration, res.showShiftStart)];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); }));
                return [4 /*yield*/, Promise.all(promises).then(function (val) {
                        res.send({ status: 'ok', agents: data_1.agents });
                    })];
            case 1:
                _a.sent();
                return [3 /*break*/, 3];
            case 2:
                error_24 = _a.sent();
                console.log(error_24);
                console.log('Error in assigning new roles for agents');
                res.status(401).send("Invalid Request!");
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/assignNewRolesForAgents', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, agents, error_25;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                data = req.body;
                if (!data.users || !data.nsp)
                    res.status(401).send("Invalid Request!");
                return [4 /*yield*/, agentModel_1.Agents.assignNewRolesForAgents(data.nsp, data.users)];
            case 1:
                agents = _a.sent();
                if (agents) {
                    res.send({ status: 'ok' });
                }
                else {
                    res.send({ status: 'error' });
                }
                return [3 /*break*/, 3];
            case 2:
                error_25 = _a.sent();
                console.log(error_25);
                console.log('Error in assigning new roles for agents');
                res.status(401).send("Invalid Request!");
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/checkForgotPassword', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, agent, permission, error_26;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                data = req.body;
                // console.log(data);
                if (!data.email)
                    res.status(401).send("Invalid Request!");
                return [4 /*yield*/, agentModel_1.Agents.getAgentsByEmail(decodeURIComponent(data.email))];
            case 1:
                agent = _a.sent();
                if (!(agent && agent.length)) return [3 /*break*/, 3];
                return [4 /*yield*/, companyModel_1.Company.getAuthPermissions(agent[0].nsp)];
            case 2:
                permission = _a.sent();
                if (permission && permission.forgotPasswordEnabled) {
                    res.status(200).send();
                }
                else {
                    res.status(501).send();
                }
                return [3 /*break*/, 4];
            case 3:
                res.status(501).send();
                _a.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                error_26 = _a.sent();
                console.log(error_26);
                console.log('Error in assigning new roles for agents');
                res.status(401).send("Invalid Request!");
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
router.post('/getAgentByEmail', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, agent, session, error_27;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                data = req.body;
                if (!data.email)
                    res.status(401).send("Invalid Request!");
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
                res.send({ status: 'ok', agent: agent[0] });
                return [3 /*break*/, 4];
            case 3:
                res.send({ status: 'error' });
                _a.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                error_27 = _a.sent();
                console.log(error_27);
                console.log('Error in getting agents by email');
                res.status(401).send("Invalid Request!");
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
/* #endregion */
/* #region  Agent Conversations */
router.post('/createAgentConversation', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data_2, pkg, _a, conversation, result_1, cid_1, agentConvStatus, messages, recievers, messages, result_2, cid_2, messages, recievers, error_28;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 20, , 21]);
                data_2 = req.body;
                if (!data_2.nsp || !data_2.email || !data_2.conversation)
                    res.status(401).send("Invalid Request!");
                return [4 /*yield*/, companyModel_1.Company.getPackages(data_2.nsp)];
            case 1:
                pkg = _b.sent();
                if (pkg && !pkg[0].package.agents.chat) {
                    res.status(401).send({ status: "Not Allowed" });
                    return [2 /*return*/];
                }
                _a = data_2.conversation.type;
                switch (_a) {
                    case 'single': return [3 /*break*/, 2];
                    case 'group': return [3 /*break*/, 13];
                }
                return [3 /*break*/, 18];
            case 2: return [4 /*yield*/, agentConversationModel_1.AgentConversations.getConversation(data_2.conversation.members.map(function (a) { return a.email; }), data_2.nsp)];
            case 3:
                conversation = _b.sent();
                if (!!conversation) return [3 /*break*/, 10];
                return [4 /*yield*/, agentConversationModel_1.AgentConversations.createConversation(data_2.conversation, data_2.nsp)];
            case 4:
                result_1 = _b.sent();
                if (!result_1) return [3 /*break*/, 9];
                cid_1 = result_1.ops[0]._id;
                result_1.ops[0].members.forEach(function (member) {
                    AgentConversationStatus_1.AgentConversationStatus.createConversation(cid_1, member.email);
                });
                return [4 /*yield*/, AgentConversationStatus_1.AgentConversationStatus.getConversationStatus(result_1.ops[0]._id, data_2.email)];
            case 5:
                agentConvStatus = _b.sent();
                messages = [];
                if (!(agentConvStatus && agentConvStatus.length)) return [3 /*break*/, 7];
                return [4 /*yield*/, agentConversationModel_1.AgentConversations.getMessagesAsync(result_1.ops[0]._id, agentConvStatus[0].MessageIds)];
            case 6:
                messages = _b.sent();
                _b.label = 7;
            case 7:
                result_1.ops[0].messages = (messages && messages.length) ? messages : [];
                // console.log(result.ops[0]);
                res.send({ status: 'ok', conversation: result_1.ops[0] });
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetSessionByEmailsFromDatabase(data_2.conversation.members.filter(function (a) { return a.email != data_2.email; }).map(function (a) { return a.email; }), data_2.nsp)];
            case 8:
                recievers = _b.sent();
                if (recievers && recievers.length) {
                    recievers.map(function (reciever) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    // origin.to((reciever.id || reciever._id) as string).emit('gotNewAgentConversation', { status: 'ok', conversation: (result) ? result.ops[0] : [] });
                                    //Redis work
                                    // await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'privateMessage', nsp: session.nsp, roomName: [Agents.NotifyOne(session)], data: insertedMessage });
                                    console.log('Push to redis');
                                    return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'gotNewAgentConversation', nsp: data_2.nsp, roomName: [(reciever.id || reciever._id)], data: { status: 'ok', conversation: (result_1) ? result_1.ops[0] : [] } })];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                }
                _b.label = 9;
            case 9: return [3 /*break*/, 12];
            case 10: return [4 /*yield*/, agentConversationModel_1.AgentConversations.getMessagesAsync(conversation._id, data_2.email)];
            case 11:
                messages = _b.sent();
                // let temp = await AgentConversations.getMessagesAsync(conversation._id);
                conversation.messages = (messages && messages.length) ? messages : [];
                res.send({ status: 'ok', conversation: conversation });
                _b.label = 12;
            case 12: return [3 /*break*/, 19];
            case 13: return [4 /*yield*/, agentConversationModel_1.AgentConversations.createConversation(data_2.conversation, data_2.nsp)];
            case 14:
                result_2 = _b.sent();
                if (!(result_2 && result_2.ops)) return [3 /*break*/, 17];
                cid_2 = result_2.ops[0]._id;
                result_2.ops[0].members.forEach(function (member) {
                    AgentConversationStatus_1.AgentConversationStatus.createConversation(cid_2, member.email);
                });
                return [4 /*yield*/, agentConversationModel_1.AgentConversations.getMessagesAsync(cid_2, data_2.email)];
            case 15:
                messages = _b.sent();
                result_2.ops[0].messages = (messages && messages.length) ? messages : [];
                res.send({ status: 'ok', conversation: result_2.ops[0] });
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetSessionByEmailsFromDatabase(data_2.conversation.members.filter(function (a) { return a.email != data_2.email; }).map(function (a) { return a.email; }), data_2.nsp)];
            case 16:
                recievers = _b.sent();
                if (recievers && recievers.length) {
                    recievers.map(function (reciever) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    // origin.to((reciever.id || reciever._id) as string).emit('gotNewAgentConversation', { status: 'ok', conversation: (result) ? result.ops[0] : [] });
                                    //Redis Work
                                    console.log('Push to redis');
                                    return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'gotNewAgentConversation', nsp: data_2.nsp, roomName: [(reciever.id || reciever._id)], data: { status: 'ok', conversation: (result_2) ? result_2.ops[0] : [] } })];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                }
                _b.label = 17;
            case 17: return [3 /*break*/, 19];
            case 18: return [3 /*break*/, 19];
            case 19: return [3 /*break*/, 21];
            case 20:
                error_28 = _b.sent();
                console.log(error_28);
                console.log('Error in creating agent conversation');
                res.status(401).send("Invalid Request!");
                return [3 /*break*/, 21];
            case 21: return [2 /*return*/];
        }
    });
}); });
router.post('/agentConversationsList', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, conversations, error_29;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                data = req.body;
                if (!(!data.nsp || !data.email)) return [3 /*break*/, 1];
                res.status(401).send("Invalid Request!");
                return [3 /*break*/, 3];
            case 1: return [4 /*yield*/, agentConversationModel_1.AgentConversations.getAllConversations(data.email, data.nsp)];
            case 2:
                conversations = _a.sent();
                res.send({ status: 'ok', conversations: conversations });
                _a.label = 3;
            case 3: return [3 /*break*/, 5];
            case 4:
                error_29 = _a.sent();
                console.log(error_29);
                console.log('Error in getting agent conversations list');
                res.status(401).send("Invalid Request!");
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
router.post('/getHourlyData', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, query, dataToSend_1, archivedSessions, currentSessions, err_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                data = req.body.obj;
                query = [
                    {
                        "$match": {
                            "email": {
                                "$in": data.agents
                            }
                        }
                    },
                    {
                        "$project": {
                            "createdDate": {
                                "$dateToString": {
                                    "date": {
                                        "$dateFromString": {
                                            "dateString": "$createdDate"
                                        }
                                    },
                                    "format": "%Y-%m-%dT%H:%M:%S.%LZ",
                                    "timezone": data.timezone
                                }
                            },
                            "endingDate": {
                                "$dateToString": {
                                    "date": {
                                        "$dateFromString": {
                                            "dateString": "$endingDate"
                                        }
                                    },
                                    "format": "%Y-%m-%dT%H:%M:%S.%LZ",
                                    "timezone": data.timezone
                                }
                            },
                            "email": 1.0,
                            "nickname": 1,
                            "idlePeriod": 1.0
                        }
                    },
                    {
                        "$match": {
                            "$or": [
                                {
                                    "createdDate": {
                                        "$gte": data.from.split('T')[0] + '00:00:00.000Z',
                                        "$lte": data.to.split('T')[0] + '00:00:00.000Z'
                                    }
                                },
                                {
                                    "endingDate": {
                                        "$gte": data.from.split('T')[0] + '00:00:00.000Z',
                                        "$lte": data.to.split('T')[0] + '00:00:00.000Z'
                                    }
                                }
                            ]
                        }
                    },
                    {
                        "$project": {
                            "email": 1.0,
                            "nickname": 1,
                            "createdDate": {
                                "$dateFromString": {
                                    "dateString": "$createdDate"
                                }
                            },
                            "endingDate": {
                                "$dateFromString": {
                                    "dateString": "$endingDate"
                                }
                            },
                            "idlePeriod": 1.0
                        }
                    },
                    {
                        "$unwind": {
                            "path": "$idlePeriod",
                            "preserveNullAndEmptyArrays": true
                        }
                    },
                    {
                        "$addFields": {
                            "idleStart": {
                                "$dateFromString": {
                                    "dateString": {
                                        "$dateToString": {
                                            "date": {
                                                "$dateFromString": {
                                                    "dateString": "$idlePeriod.startTime"
                                                }
                                            },
                                            "format": "%Y-%m-%dT%H:%M:%S.%LZ",
                                            "timezone": data.timezone
                                        }
                                    }
                                }
                            },
                            "idleEnd": {
                                "$dateFromString": {
                                    "dateString": {
                                        "$dateToString": {
                                            "date": {
                                                "$dateFromString": {
                                                    "dateString": "$idlePeriod.endTime"
                                                }
                                            },
                                            "format": "%Y-%m-%dT%H:%M:%S.%LZ",
                                            "timezone": data.timezone
                                        }
                                    }
                                }
                            }
                        }
                    },
                    {
                        "$project": {
                            "email": 1.0,
                            "nickname": 1,
                            "createdDate": {
                                "$dateToString": {
                                    "date": "$createdDate",
                                    "format": "%Y-%m-%dT%H:%M:%S"
                                }
                            },
                            "endingDate": {
                                "$dateToString": {
                                    "date": "$endingDate",
                                    "format": "%Y-%m-%dT%H:%M:%S"
                                }
                            },
                            "idleStart": {
                                "$dateToString": {
                                    "date": "$idleStart",
                                    "format": "%Y-%m-%dT%H:%M:%S"
                                }
                            },
                            "idleEnd": {
                                "$dateToString": {
                                    "date": "$idleEnd",
                                    "format": "%Y-%m-%dT%H:%M:%S"
                                }
                            }
                        }
                    },
                    {
                        "$sort": {
                            "email": 1.0,
                            "createdDate": 1.0,
                            "idleStart": 1.0
                        }
                    }
                ];
                dataToSend_1 = [];
                return [4 /*yield*/, agentSessionModel_1.agentSessions.collection.aggregate(query).toArray()];
            case 1:
                archivedSessions = _a.sent();
                if (archivedSessions && archivedSessions.length) {
                    dataToSend_1 = archivedSessions;
                }
                return [4 /*yield*/, sessionsManager_1.SessionManager.collection.aggregate(query).toArray()];
            case 2:
                currentSessions = _a.sent();
                if (currentSessions && currentSessions.length) {
                    currentSessions.forEach(function (session) {
                        dataToSend_1.push(session);
                    });
                }
                res.send({ data: dataToSend_1 });
                return [3 /*break*/, 4];
            case 3:
                err_7 = _a.sent();
                console.log(err_7);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
/* #endregion */
exports.agentRoutes = router;
//# sourceMappingURL=agents.js.map