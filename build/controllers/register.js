"use strict";
// Created By Saad Ismail Shaikh
// Date : 12-4-18
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
exports.registerRoutes = void 0;
var express = require("express");
var companyModel_1 = require("../models/companyModel");
var agentModel_1 = require("../models/agentModel");
var constants_1 = require("../globals/config/constants");
var mailingListModel_1 = require("../models/mailingListModel");
var resellerModel_1 = require("../models/resellerModel");
var aws_sqs_1 = require("../actions/aws/aws-sqs");
var requestIp = require('request-ip');
//Load The Model For The First Time
// if (!Agents.initialized) {
//     Agents.Initialize();
// }
var router = express.Router();
router.get('/verifyProfile/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var tempProfile, Exists, Agent_exists, registered, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 14, , 15]);
                console.log('Verifying Profile');
                if (!!req.params.id) return [3 /*break*/, 1];
                res.status(401).send();
                return [3 /*break*/, 13];
            case 1: return [4 /*yield*/, companyModel_1.Company.GetTempProfile(req.params.id)];
            case 2:
                tempProfile = _a.sent();
                if (!(tempProfile && tempProfile.length)) return [3 /*break*/, 12];
                return [4 /*yield*/, companyModel_1.Company.CheckCompany(tempProfile[0].company_info.company_website)];
            case 3:
                Exists = _a.sent();
                return [4 /*yield*/, agentModel_1.Agents.AgentExists(tempProfile[0].agent.email)];
            case 4:
                Agent_exists = _a.sent();
                if (!(Exists.length > 0 && Agent_exists)) return [3 /*break*/, 5];
                console.log('Both Exists');
                // res.redirect(((process.env.NODE_ENV == 'production') ? 'https://beelinks.solutions' : 'http://localhost:8006') + '/rerror')
                res.redirect(((constants_1.WEBSITEURL) ? constants_1.WEBSITEURL : 'http://localhost:8006') + '/rerror');
                return [3 /*break*/, 11];
            case 5:
                if (!(Exists.length > 0 && !Agent_exists)) return [3 /*break*/, 6];
                console.log('Company Exists');
                // console.log(Exists);
                // res.status(403).send({ error: "CompanyExists" })
                res.redirect(((constants_1.WEBSITEURL) ? constants_1.WEBSITEURL : 'http://localhost:8006') + '/rerror');
                return [3 /*break*/, 11];
            case 6:
                if (!(Agent_exists && !Exists.length)) return [3 /*break*/, 7];
                // res.status(405).send({ error: "AgentExists" })
                console.log('Agent Exists');
                res.redirect(((constants_1.WEBSITEURL) ? constants_1.WEBSITEURL : 'http://localhost:8006') + '/rerror');
                return [3 /*break*/, 11];
            case 7:
                console.log('Company Registering');
                return [4 /*yield*/, companyModel_1.Company.RegisterCompanyNew(tempProfile[0])];
            case 8:
                registered = _a.sent();
                if (!(registered && registered.insertedCount)) return [3 /*break*/, 10];
                return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendMessage({
                        action: 'sendAccAppEmail',
                        to: tempProfile[0].email,
                        action_url: constants_1.WEBSITEURL + '/login'
                    })];
            case 9:
                _a.sent();
                res.redirect(((constants_1.WEBSITEURL) ? constants_1.WEBSITEURL : 'http://localhost:8006') + '/welcome');
                return [3 /*break*/, 11];
            case 10:
                res.status(500).send();
                _a.label = 11;
            case 11: return [3 /*break*/, 13];
            case 12:
                //TEmp Profile Deleted
                res.redirect(((constants_1.WEBSITEURL) ? constants_1.WEBSITEURL : 'http://localhost:8006') + '/rerror');
                _a.label = 13;
            case 13: return [3 /*break*/, 15];
            case 14:
                error_1 = _a.sent();
                console.log(error_1);
                console.log('error in registering company unverified');
                res.status(500).send();
                return [3 /*break*/, 15];
            case 15: return [2 /*return*/];
        }
    });
}); });
router.post('/companyUV/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var Exists, Agent_exists, pkg, registered, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 16, , 17]);
                console.log('registering');
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
                if (!!req.body.companyprofile) return [3 /*break*/, 1];
                res.status(401).send();
                return [3 /*break*/, 15];
            case 1: return [4 /*yield*/, companyModel_1.Company.CheckCompany(req.body.companyprofile.company_info.company_website)];
            case 2:
                Exists = _a.sent();
                return [4 /*yield*/, agentModel_1.Agents.AgentExists(req.body.companyprofile.email)];
            case 3:
                Agent_exists = _a.sent();
                if (!(Exists.length > 0 && Agent_exists)) return [3 /*break*/, 4];
                res.status(406).send({ error: "CompanyAndAgentExists" });
                return [3 /*break*/, 15];
            case 4:
                if (!(Exists.length > 0 && !Agent_exists)) return [3 /*break*/, 5];
                // console.log('Exists');
                // console.log(Exists);
                res.status(403).send({ error: "CompanyExists" });
                return [3 /*break*/, 15];
            case 5:
                if (!(Agent_exists && !Exists.length)) return [3 /*break*/, 6];
                res.status(405).send({ error: "AgentExists" });
                return [3 /*break*/, 15];
            case 6: return [4 /*yield*/, companyModel_1.Company.GetSubscription(req.body.companyprofile.packageName)];
            case 7:
                pkg = _a.sent();
                if (!(pkg && pkg.length)) return [3 /*break*/, 14];
                return [4 /*yield*/, companyModel_1.Company.RegisterCompanyUnverified(req.body.companyprofile, pkg[0].details)];
            case 8:
                registered = _a.sent();
                if (!(registered && registered.insertedCount)) return [3 /*break*/, 12];
                if (!req.body.addToMailingList) return [3 /*break*/, 10];
                return [4 /*yield*/, mailingListModel_1.MailingList.addToMailingList(req.body.companyprofile.email)];
            case 9:
                _a.sent();
                _a.label = 10;
            case 10: return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendMessage({
                    action: 'sendEmailVerificationLink',
                    email: req.body.companyprofile.email,
                    url: constants_1.WEBSITEURL + '/register/verifyProfile/' + registered.insertedId,
                })];
            case 11:
                _a.sent();
                res.status(200).send('Successfull');
                return [3 /*break*/, 13];
            case 12:
                res.status(500).send();
                _a.label = 13;
            case 13: return [3 /*break*/, 15];
            case 14:
                res.status(405).send({ error: "Invalid Package" });
                _a.label = 15;
            case 15: return [3 /*break*/, 17];
            case 16:
                error_2 = _a.sent();
                console.log(error_2);
                console.log('error in registering company unverified');
                res.status(500).send();
                return [3 /*break*/, 17];
            case 17: return [2 /*return*/];
        }
    });
}); });
router.post('/initialize/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var clientIp, registered;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('initialize');
                clientIp = requestIp.getClientIp(req);
                if (!(clientIp.slice(7) == constants_1.machineIP)) return [3 /*break*/, 8];
                if (!!req.body) return [3 /*break*/, 1];
                res.status(401).send();
                return [3 /*break*/, 7];
            case 1:
                console.log('machine vaidated');
                return [4 /*yield*/, companyModel_1.Company.RegisterCompany(req.body.company)];
            case 2:
                registered = _a.sent();
                if (!req.body.mailingList) return [3 /*break*/, 4];
                return [4 /*yield*/, mailingListModel_1.MailingList.addToMailingList(req.body.email)];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4:
                if (!(registered && registered.insertedCount)) return [3 /*break*/, 6];
                return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendMessage({
                        action: 'sendAccAppEmail',
                        to: req.body.email,
                        action_url: 'https://beelinks.solutions/login'
                    })];
            case 5:
                _a.sent();
                res.status(200).send('Successfull');
                return [3 /*break*/, 7];
            case 6:
                res.status(500).send();
                _a.label = 7;
            case 7: return [3 /*break*/, 9];
            case 8:
                res.status(401).send();
                _a.label = 9;
            case 9: return [2 /*return*/];
        }
    });
}); });
//for account Approval
router.post('/reseller/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var clientIp, Exists;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                clientIp = requestIp.getClientIp(req);
                if (!!req.body.reseller) return [3 /*break*/, 1];
                res.status(401).send();
                return [3 /*break*/, 3];
            case 1: return [4 /*yield*/, resellerModel_1.Reseller.CheckReseller(req.body.reseller.personalInfo.email)];
            case 2:
                Exists = _a.sent();
                if (Exists && Exists.length > 0) {
                    res.status(403).send({ error: "ResellerExists" });
                }
                else {
                    res.status(200).send('Successfull');
                }
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); });
//for Registering
router.post('/resellerInitialize/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var Exists, registered;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!!req.body.reseller) return [3 /*break*/, 1];
                res.status(401).send();
                return [3 /*break*/, 7];
            case 1: return [4 /*yield*/, resellerModel_1.Reseller.CheckReseller(req.body.reseller.personalInfo.email)];
            case 2:
                Exists = _a.sent();
                if (!(Exists && Exists.length > 0)) return [3 /*break*/, 3];
                res.status(403).send({ error: "ResellerExists" });
                return [3 /*break*/, 7];
            case 3: return [4 /*yield*/, resellerModel_1.Reseller.RegisterReseller(req.body.reseller)];
            case 4:
                registered = _a.sent();
                if (!(registered && registered.insertedCount)) return [3 /*break*/, 6];
                // console.log("registerd")
                return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendMessage({
                        action: 'sendAccAppEmail',
                        to: req.body.email,
                        action_url: 'https://beelinks.solutions/login'
                    })];
            case 5:
                // console.log("registerd")
                _a.sent();
                res.status(200).send('Successfull');
                return [3 /*break*/, 7];
            case 6:
                res.status(500).send();
                _a.label = 7;
            case 7: return [2 /*return*/];
        }
    });
}); });
//   /*----------------------------------------------------------------------|
//     |Note : Status Custom Coded To Invalidate Request At Client Side      |
//     | 403 = Forbidden Company Exists                                      |
//     | 401 = Any Error Maybe Databse ReadWrite or Unauthenticated Request  |
//     |---------------------------------------------------------------------|*/
router.post('/resetPassword/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var clientIp, agent;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                clientIp = requestIp.getClientIp(req);
                if (!(clientIp.slice(7) == constants_1.machineIP)) return [3 /*break*/, 4];
                if (!(!req.body.email || !req.body.password)) return [3 /*break*/, 1];
                res.status(401).send();
                return [3 /*break*/, 3];
            case 1: return [4 /*yield*/, agentModel_1.Agents.ChangePassword(req.body.password, req.body.email)];
            case 2:
                agent = _a.sent();
                // console.log('password changed');
                // console.log(agent);
                if (agent) {
                    res.status(200).send('Successfull');
                }
                else {
                    res.status(500).send();
                }
                _a.label = 3;
            case 3: return [3 /*break*/, 5];
            case 4:
                res.status(401).send();
                _a.label = 5;
            case 5: return [2 /*return*/];
        }
    });
}); });
router.post('/validateURL/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var Exists, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                if (!!req.body.url) return [3 /*break*/, 1];
                res.status(401).send({ error: "exists" });
                return [3 /*break*/, 3];
            case 1: return [4 /*yield*/, companyModel_1.Company.CheckCompany(req.body.url)];
            case 2:
                Exists = _a.sent();
                if (Exists.length > 0)
                    res.status(401).send({ error: "exists" });
                else
                    res.status(200).send({ status: "Ok" });
                _a.label = 3;
            case 3: return [3 /*break*/, 5];
            case 4:
                error_3 = _a.sent();
                console.log(error_3);
                console.log('Error in Register Validate');
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
router.post('/updateCompany/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var clientIp, exists, updated;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('updating');
                clientIp = requestIp.getClientIp(req);
                if (!(clientIp.slice(7) == constants_1.machineIP)) return [3 /*break*/, 6];
                if (!!req.body) return [3 /*break*/, 1];
                res.status(401).send();
                return [3 /*break*/, 5];
            case 1: return [4 /*yield*/, companyModel_1.Company.CheckCompany(req.body.company_info.company_website)];
            case 2:
                exists = _a.sent();
                if (!(exists && exists.length)) return [3 /*break*/, 3];
                res.status(200).send('Successfull');
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, companyModel_1.Company.UpdateCompany(req.body)];
            case 4:
                updated = _a.sent();
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                res.status(401).send();
                _a.label = 7;
            case 7: return [2 /*return*/];
        }
    });
}); });
exports.registerRoutes = router;
//# sourceMappingURL=register.js.map