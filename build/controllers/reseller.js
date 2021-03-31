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
exports.resellerRoutes = void 0;
var express = require("express");
var path = require("path");
var agentModel_1 = require("../models/agentModel");
var resellerModel_1 = require("../models/resellerModel");
var sessionsManager_1 = require("../globals/server/sessionsManager");
var tokensModel_1 = require("../models/tokensModel");
var constants_1 = require("../globals/config/constants");
var requestIp = require('request-ip');
var URL = require('url').URL;
var constants_2 = require("../globals/config/constants");
var mailingListModel_1 = require("../models/mailingListModel");
var companyModel_1 = require("../models/companyModel");
var aws_sqs_1 = require("../actions/aws/aws-sqs");
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
router.use(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        if (req.headers.referer && req.headers.referer.indexOf(((process.env.NODE_ENV == 'production') || (process.env.NODE_ENV == 'development')) ? 'beelinks.solutions' : 'localhost') != -1) {
            // console.log('refferer', req.headers.referer);
            // console.log('req URL', req.url);
            next();
        }
        else {
            console.log('refferer', req.headers.referer);
            console.log('req URL', req.url);
            res.status(401).send({ err: 'unauthorized' });
        }
        return [2 /*return*/];
    });
}); });
router.post('/getResellerAdmin', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var ip, reseller, exists, Reseller_1, insertedSession, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
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
                _a.label = 1;
            case 1:
                _a.trys.push([1, 10, , 11]);
                return [4 /*yield*/, resellerModel_1.Reseller.AuthenticateReseller(req.body.email, req.body.password)];
            case 2:
                reseller = _a.sent();
                if (!reseller) return [3 /*break*/, 8];
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetLiveResellerSessionFromDatabase(req.body.email)];
            case 3:
                exists = _a.sent();
                if (!(reseller.length && exists.length)) return [3 /*break*/, 4];
                //console.log('Returning Existing sessions');
                reseller[0].csid = exists[0]._id;
                //Contacts.updateStatus(agent[0].email, agent[0].nsp, true);
                res.send(reseller);
                return [3 /*break*/, 7];
            case 4:
                if (!(reseller.length && !(exists.length))) return [3 /*break*/, 6];
                Reseller_1 = {
                    socketID: [],
                    createdDate: new Date().toISOString(),
                    personalInfo: reseller[0].personalInfo,
                    type: 'Reseller',
                    isReseller: true,
                    date: new Date().toISOString(),
                    bank: reseller[0].bank
                };
                return [4 /*yield*/, sessionsManager_1.SessionManager.insertSession(JSON.parse(JSON.stringify(Reseller_1)), true)];
            case 5:
                insertedSession = _a.sent();
                // console.log(insertedSession)
                if (insertedSession) {
                    reseller[0].csid = insertedSession.ops[0]._id;
                    reseller[0].isReseller = true;
                    //Contacts.updateStatus(Agent.email, Agent.nsp, true);
                }
                else {
                    res.status(501).send();
                }
                res.send(reseller);
                return [3 /*break*/, 7];
            case 6:
                res.status(401).send({ status: 'incorrectcredintials' }).end();
                _a.label = 7;
            case 7: return [3 /*break*/, 9];
            case 8:
                //console.log('Second Else');
                res.status(401).send({ status: 'incorrectcredintials' }).end();
                _a.label = 9;
            case 9: return [3 /*break*/, 11];
            case 10:
                error_1 = _a.sent();
                console.log('Error in Get User');
                console.log(error_1);
                res.status(401).send({ status: 'error' });
                return [3 /*break*/, 11];
            case 11: return [2 /*return*/];
        }
    });
}); });
// router.post('/getSettings', async (req, res) => {
//     try {
//         if (!req.body.email) res.status(401).send();
//         if (req.body.email == 'admin@beelinks.solutions') {
//             if (req.body.nsp) {
//                 let AgentsettingsPromise = Agents.getSetting(req.body.email) as any;
//                 let companySettingsPromise = Company.GetVerificationStatus(req.body.nsp) as any;
//                 let resolvedPromises = await Promise.all([AgentsettingsPromise, companySettingsPromise]);
//                 let agentSettings = resolvedPromises[0];
//                 let companySettings = resolvedPromises[1];
//                 if (agentSettings && agentSettings.length > 0 && companySettings && companySettings.length > 0) {
//                     if (agentSettings[0].automatedMessages == undefined) {
//                         agentSettings[0].automatedMessages = [];
//                     }
//                     if (companySettings[0]) {
//                         agentSettings[0].verified = companySettings[0].settings.verified;
//                         agentSettings[0].createdAt = companySettings[0].createdAt;
//                         agentSettings[0].expiry = companySettings[0].expiry;
//                     }
//                     res.json(agentSettings[0]);
//                 } else {
//                     res.send({});
//                 }
//             }
//         }
//         else return res.status(401).send({ status: 'incorrectcredintials' });
//     } catch (error) {
//         console.log(error);
//         console.log('Error in Get Settings');
//         res.status(501).send();
//     }
//     });
router.post('/getResellers', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var resellerAdmin, Resellers, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                if (!req.body.email)
                    res.status(401).send();
                resellerAdmin = decodeURIComponent(req.body.email);
                return [4 /*yield*/, resellerModel_1.Reseller.GetResellers()];
            case 1:
                Resellers = _a.sent();
                if (Resellers && Resellers.length) {
                    res.send(Resellers);
                }
                else
                    res.status(501).send();
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.log(error_2);
                console.log('Error in Get Resellers');
                res.status(501).send();
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/verifyReseller', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var email, value, admin, Resellers, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                if (!req.body.email)
                    res.status(401).send();
                email = decodeURIComponent(req.body.email);
                value = decodeURIComponent(req.body.value);
                admin = decodeURIComponent(req.body.admin);
                value = JSON.parse(value);
                return [4 /*yield*/, resellerModel_1.Reseller.VerifyReseller(email, value, admin)];
            case 1:
                Resellers = _a.sent();
                if (Resellers) {
                    //res.status(200).send();
                    res.send(Resellers);
                }
                else
                    res.status(501).send();
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                console.log(error_3);
                console.log('Error in Get Resellers');
                res.status(501).send();
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/getResellerInfo', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var email, agents, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                if (!req.body.email)
                    res.status(401).send();
                email = decodeURIComponent(req.body.email);
                return [4 /*yield*/, agentModel_1.Agents.getAllAgents(email)];
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
                // console.log(req.body)
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
    var origin, updatedCompany, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                return [4 /*yield*/, companyModel_1.Company.getSettings(req.body.company.nsp)];
            case 1:
                origin = _a.sent();
                if (!req.body.company)
                    res.status(401).send();
                if (!req.body.company.mailingListCheck) return [3 /*break*/, 3];
                return [4 /*yield*/, mailingListModel_1.MailingList.addToMailingList(req.body.company.email)];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3: return [4 /*yield*/, companyModel_1.Company.UpdateCompany(req.body.company)];
            case 4:
                updatedCompany = _a.sent();
                if (updatedCompany) {
                    origin[0]['settings'] = updatedCompany.value.settings;
                    // console.log(origin['settings']);
                    res.send(updatedCompany);
                }
                else
                    res.status(501).send();
                return [3 /*break*/, 6];
            case 5:
                error_6 = _a.sent();
                console.log(error_6);
                console.log('Error in Get Settings');
                res.status(501).send();
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
router.post('/getDefaultSettings', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var restoreSettings;
    return __generator(this, function (_a) {
        try {
            if (!req.body.settings)
                res.status(401).send();
            restoreSettings = constants_2.defaultSettings[req.body.settings];
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
router.post('/authenticateReseller/:csid?', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var exisitingSession;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.body.csid)
                    return [2 /*return*/, res.send(401)];
                if (!!req.body.isReseller) return [3 /*break*/, 1];
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
    var exisitingSession, error_8;
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
                error_8 = _a.sent();
                console.log(error_8);
                console.log('Error in Logout');
                res.status(401).send();
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); });
router.post('/registerCompany', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var clientIp, a, exists, Agent_exists, registered, UpdatedReseller;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('registering');
                clientIp = requestIp.getClientIp(req);
                a = (new URL(req.body.company.company_info.company_website));
                if (!!req.body.company) return [3 /*break*/, 1];
                res.status(401).send();
                return [3 /*break*/, 13];
            case 1: return [4 /*yield*/, companyModel_1.Company.CheckCompany(req.body.company.company_info.company_website)];
            case 2:
                exists = _a.sent();
                return [4 /*yield*/, agentModel_1.Agents.AgentExists(req.body.company.email)];
            case 3:
                Agent_exists = _a.sent();
                if (!(exists.length > 0 && Agent_exists)) return [3 /*break*/, 4];
                res.status(406).send({ error: "CompanyAndAgentExists" });
                return [3 /*break*/, 13];
            case 4:
                if (!(exists.length > 0 && !Agent_exists)) return [3 /*break*/, 5];
                res.status(403).send({ error: "CompanyExists" });
                return [3 /*break*/, 13];
            case 5:
                if (!(Agent_exists && !exists.length)) return [3 /*break*/, 6];
                res.status(405).send({ error: "AgentExists" });
                return [3 /*break*/, 13];
            case 6: return [4 /*yield*/, companyModel_1.Company.RegisterCompany(req.body.company, true)];
            case 7:
                registered = _a.sent();
                if (!req.body.company.mailingListCheck) return [3 /*break*/, 9];
                return [4 /*yield*/, mailingListModel_1.MailingList.addToMailingList(req.body.email)];
            case 8:
                _a.sent();
                _a.label = 9;
            case 9:
                if (!(registered && registered.insertedCount)) return [3 /*break*/, 12];
                return [4 /*yield*/, resellerModel_1.Reseller.UpdateResellerCompanies(registered.ops[0].name, registered.ops[0].createdBy.email)];
            case 10:
                UpdatedReseller = _a.sent();
                return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendMessage({
                        action: 'sendAccAppEmail',
                        to: req.body.email,
                        action_url: 'https://beelinks.solutions/login'
                    })];
            case 11:
                _a.sent();
                res.status(200).send({ company: registered.ops[0] });
                return [3 /*break*/, 13];
            case 12:
                res.status(500).send();
                _a.label = 13;
            case 13: return [2 /*return*/];
        }
    });
}); });
router.post('/deactivateCompanyInfo', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var companyNsp, value, deactivatedCompany, error_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                // console.log(req.body);
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
                error_9 = _a.sent();
                console.log(error_9);
                console.log('Error in Deactivating Company');
                res.status(501).send();
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
//forgot password request
router.post('/resetpswd', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var date, token, error_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                if (!!req.body.email) return [3 /*break*/, 1];
                return [2 /*return*/, res.status(403).send({ status: 'error' })];
            case 1: return [4 /*yield*/, resellerModel_1.Reseller.ResellerExists(req.body.email)];
            case 2:
                if (_a.sent()) {
                    date = Date.parse(new Date().toISOString());
                    date = new Date(new Date(date).setDate(new Date().getDate() + 1)).toISOString();
                    token = {
                        id: constants_1.encrypt(date),
                        email: req.body.email,
                        expireDate: new Date(date).toISOString(),
                        type: 'forget_password',
                        isReseller: true
                    };
                    tokensModel_1.Tokens.inserToken(token);
                    // console.log(token);
                    res.status(200).send({ status: 'successfull' });
                }
                else {
                    res.status(403).send({ status: 'invalid' });
                }
                _a.label = 3;
            case 3: return [3 /*break*/, 5];
            case 4:
                error_10 = _a.sent();
                console.log(error_10);
                console.log('error in Reset Password');
                res.status(403).send({ status: 'invalid' });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
//recover password page request
router.get('/reset/:token/:email', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var validated, error_11;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(!req.params.token || !req.params.email)) return [3 /*break*/, 1];
                return [2 /*return*/, res.status(404).send({ status: 'error' })];
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, tokensModel_1.Tokens.validateResellerToken(req.params.token)];
            case 2:
                validated = _a.sent();
                if (validated) {
                    res.sendFile(path.resolve(__dirname + '/../public/static/dynamichtml/recover-resellerPassword.html'));
                }
                else {
                    res.sendFile(path.resolve(__dirname + '/../public/static/dynamichtml/link-expired.html'));
                }
                return [3 /*break*/, 4];
            case 3:
                error_11 = _a.sent();
                console.log(error_11);
                console.log('error in reset Token');
                return [2 /*return*/, res.status(404).send({ status: 'error' })];
            case 4: return [2 /*return*/];
        }
    });
}); });
//For Successful Reset confirmation
router.post('/resetpswd/:password/:email', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var verified, changed;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                // console.log(req.body);
                // console.log('/resetpswd/:password/:email')
                // console.log("req.body");
                // console.log(req.body);
                if (!req.body.password || !req.body.email || !req.body.token)
                    return [2 /*return*/, res.status(401).send({ status: 'error' })];
                return [4 /*yield*/, tokensModel_1.Tokens.VerifyResellerToken(req.body.token, req.body.email)];
            case 1:
                verified = _a.sent();
                console.log('verified');
                console.log(verified);
                if (!(verified && verified.length)) return [3 /*break*/, 3];
                return [4 /*yield*/, resellerModel_1.Reseller.ChangePassword(req.body.password, req.body.email)];
            case 2:
                changed = _a.sent();
                console.log(changed);
                res.status(200).send({ status: 'ok' });
                return [3 /*break*/, 4];
            case 3:
                res.status(401).send({ status: 'invalidInput' });
                _a.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); });
router.post('/getCompanies', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var email, user, companies, error_12;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                console.log('getCompanies');
                res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
                res.header('Expires', '-1');
                res.header('Pragma', 'no-cache');
                if (!req.body.email)
                    res.status(401).send();
                email = decodeURIComponent(req.body.email);
                console.log('email');
                return [4 /*yield*/, resellerModel_1.Reseller.GetResellerByEmail(email)];
            case 1:
                user = _a.sent();
                console.log(user);
                if (!(user && user.length)) return [3 /*break*/, 3];
                return [4 /*yield*/, resellerModel_1.Reseller.GetCompaniesByResellerEmail(user[0])];
            case 2:
                companies = _a.sent();
                console.log(companies);
                if (companies && companies.length) {
                    res.send(companies);
                }
                else
                    res.status(501).send();
                return [3 /*break*/, 4];
            case 3:
                res.status(501).send();
                _a.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                error_12 = _a.sent();
                console.log(error_12);
                console.log('Error in Get Settings');
                res.status(501).send();
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
router.post('/updateResellerCompanyInfo', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var origin, updatedCompany, error_13;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                //let origin: SocketIO.Namespace = (SocketListener.socketIO as SocketIO.Server).of(namespace.name);
                console.log("req.body.company");
                console.log(req.body.company);
                origin = companyModel_1.Company.getSettings(req.body.company.nsp);
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
                console.log(updatedCompany);
                if (updatedCompany) {
                    origin[0]['settings'] = updatedCompany.value.settings;
                    //console.log(origin['settings']);
                    res.send(updatedCompany);
                }
                else
                    res.status(501).send();
                return [3 /*break*/, 5];
            case 4:
                error_13 = _a.sent();
                console.log(error_13);
                console.log('Error in Get Settings');
                res.status(501).send();
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
exports.resellerRoutes = router;
//# sourceMappingURL=reseller.js.map