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
exports.visitorRoutes = void 0;
var express = require("express");
var visitorModel_1 = require("../models/visitorModel");
var conversationModel_1 = require("../models/conversationModel");
var constants_1 = require("../globals/config/constants");
var aws_sqs_1 = require("../actions/aws/aws-sqs");
var aws_s3_1 = require("../actions/aws/aws-s3");
var uuid = require("uuid");
var sessionsManager_1 = require("../globals/server/sessionsManager");
var agentModel_1 = require("../models/agentModel");
var CreateMessage_1 = require("../actions/GlobalActions/CreateMessage");
var visitorSessionmodel_1 = require("../models/visitorSessionmodel");
var companyModel_1 = require("../models/companyModel");
var enums_1 = require("../globals/config/enums");
var __biZZCMiddleWare_1 = require("../globals/__biZZCMiddleWare");
var ticketsModel_1 = require("../models/ticketsModel");
//Load The Model For The First Time
// if (!Visitor.initialized) {
//     Visitor.Initialize();
// }
var router = express.Router();
// router.use(async (req, res, next) => {
//     if (req.headers.referer && req.headers.referer.indexOf(((process.env.NODE_ENV == 'production') || (process.env.NODE_ENV == 'development')) ? 'beelinks.solutions' : 'localhost') != -1) {
//         // console.log('refferer', req.headers.referer);
//         // console.log('req URL', req.url);
//         if (req.headers.origin) {
//             res.header("Access-Control-Allow-Origin", (req.headers.origin as string));
//             res.header("Access-Control-Allow-Headers", "content-type");
//             res.header('Access-Control-Allow-Methods', 'GET');
//             res.header('Access-Control-Allow-Credentials', 'true');
//             res.header('Connection', 'keep-alive');
//             res.header('Content-Length', '0');
//             res.header('Vary', 'Origin, Access-Control-Request-Headers');
//         }
//         next();
//     } else {
//         console.log('refferer', req.headers.referer);
//         console.log('req URL', req.url);
//         res.status(401).send({ err: 'unauthorized' });
//     }
// })
router.use(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var type, id, session;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                // if (req.headers.referer && req.headers.referer.indexOf(((process.env.NODE_ENV == 'production') || (process.env.NODE_ENV == 'development')) ? 'beelinks.solutions' : 'localhost') != -1) {
                // console.log('refferer', req.headers.referer);
                // console.log('req URL', req.url);
                if (req.headers.origin) {
                    res.header("Access-Control-Allow-Origin", req.headers.origin);
                    res.header("Access-Control-Allow-Headers", "content-type");
                    res.header('Access-Control-Allow-Methods', 'GET');
                    res.header('Access-Control-Allow-Credentials', 'true');
                    res.header('Connection', 'keep-alive');
                    res.header('Content-Length', '0');
                    res.header('Vary', 'Origin, Access-Control-Request-Headers');
                }
                type = '';
                id = '';
                if (!req.headers.authorization) return [3 /*break*/, 4];
                type = req.headers.authorization.split('-')[0];
                id = req.headers.authorization.split('-')[1];
                session = '';
                if (!(type == 'Agent')) return [3 /*break*/, 2];
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetAgentByID(id)];
            case 1:
                session = _a.sent();
                return [3 /*break*/, 3];
            case 2:
                if (type == 'Visitor')
                    session = true;
                _a.label = 3;
            case 3:
                if (session) {
                    if (req.body.nsp && req.body.nsp != session.nsp)
                        res.status(401).send({ err: 'unauthorized' });
                    next();
                }
                else
                    res.status(401).send({ err: 'unauthorized' });
                return [3 /*break*/, 5];
            case 4:
                res.status(401).send({ err: 'unauthorized' });
                _a.label = 5;
            case 5: return [2 /*return*/];
        }
    });
}); });
//let visitor = new Visitor();
router.get('/', function (req, res) {
    // var visitor = new Visitor();
    // visitor.insertVisitors();
    // res.send("Record Inserted");
});
//visitor routes irrespective of session
router.post('/checkSID/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                // console.log('Check SID: ' + req.body.sid);
                res.header("Access-Control-Allow-Origin", req.headers.origin);
                res.header("Access-Control-Allow-Headers", "content-type");
                res.header('Access-Control-Allow-Methods', 'POST');
                res.header('Access-Control-Allow-Credentials', 'true');
                res.header('Vary', 'Origin, Access-Control-Request-Headers');
                res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
                res.header('Expires', '-1');
                res.header('Pragma', 'no-cache');
                if (!req.body.sid) {
                    res.status(401).send();
                    return [2 /*return*/];
                }
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZC_REDIS.Exists(req.body.sid)];
            case 1:
                result = _a.sent();
                if (result)
                    res.status(200).send({ status: 'ok' });
                else
                    res.status(401).send();
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                res.status(401).send();
                console.log(error_1);
                console.log('error in checkingSID');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/emailtranscript/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var conversation, company, conversation, company, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 12, , 13]);
                if (!(req.headers.origin && req.headers.origin.indexOf('localhost') != -1)) return [3 /*break*/, 5];
                res.header("Access-Control-Allow-Origin", req.headers.origin);
                res.header("Access-Control-Allow-Headers", "content-type");
                res.header('Access-Control-Allow-Methods', 'GET');
                res.header('Access-Control-Allow-Credentials', 'true');
                res.header('Vary', 'Origin, Access-Control-Request-Headers');
                if (!constants_1.EmailTest) return [3 /*break*/, 4];
                return [4 /*yield*/, conversationModel_1.Conversations.getConversationBySid(req.body.cid)];
            case 1:
                conversation = _a.sent();
                if (!(conversation && conversation.length)) return [3 /*break*/, 4];
                return [4 /*yield*/, companyModel_1.Company.GetLogoTranscript(conversation[0].nsp)
                    // console.log(company[0].chatSettings)
                ];
            case 2:
                company = _a.sent();
                // console.log(company[0].chatSettings)
                return [4 /*yield*/, aws_s3_1.__BizzC_S3.PutObject(uuid.v4().toString(), {
                        action: 'sendTranscript',
                        messages: conversation[0].messages,
                        subject: 'Transcript ' + conversation[0].clientID || conversation[0]._id,
                        email: req.body.email,
                        id: conversation[0].clientID || conversation[0]._id,
                        logo: (company && company.length) ? company[0].settings.chatSettings.transcriptLogo : ''
                    })];
            case 3:
                // console.log(company[0].chatSettings)
                _a.sent();
                _a.label = 4;
            case 4:
                res.send({ status: 'ok' });
                return [2 /*return*/];
            case 5:
                if (!(!req.body.email || !req.body.cid)) return [3 /*break*/, 6];
                res.status(401).send({ status: 'error' });
                return [3 /*break*/, 11];
            case 6: return [4 /*yield*/, conversationModel_1.Conversations.getConversationBySid(req.body.cid)];
            case 7:
                conversation = _a.sent();
                company = undefined;
                if (!(conversation && conversation.length)) return [3 /*break*/, 9];
                return [4 /*yield*/, companyModel_1.Company.GetLogoTranscript(conversation[0].nsp)
                    // console.log(company[0].chatSettings)
                ];
            case 8:
                company = _a.sent();
                _a.label = 9;
            case 9: return [4 /*yield*/, aws_s3_1.__BizzC_S3.PutObject(uuid.v4().toString(), {
                    action: 'sendTranscript',
                    messages: conversation[0].messages,
                    subject: 'Transcript ' + conversation[0].clientID || conversation[0]._id,
                    email: req.body.email,
                    id: conversation[0].clientID || conversation[0]._id,
                    logo: (company && company.length) ? company[0].settings.chatSettings.transcriptLogo : ''
                })];
            case 10:
                _a.sent();
                res.status(200).send({ status: 'ok' });
                _a.label = 11;
            case 11: return [3 /*break*/, 13];
            case 12:
                error_2 = _a.sent();
                console.log(error_2);
                console.log('Error in Sending Emial Transcript');
                return [3 /*break*/, 13];
            case 13: return [2 /*return*/];
        }
    });
}); });
router.post('/submitSurvey/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var session_1, origin, data, promises, _a, _b, _c, updatedConversation, packet, endChatMsg, endChatMessage, event, loggedEvent, session_2, insertedMessage, updatedConversation, loggedEvent, error_3;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                console.log('submitSurvey');
                _d.label = 1;
            case 1:
                _d.trys.push([1, 36, , 37]);
                if (!(!req.body.feedbackForm || !req.body.survey)) return [3 /*break*/, 2];
                res.status(401).send();
                return [3 /*break*/, 35];
            case 2:
                // && req.headers.origin.indexOf('localhost') != -1
                if (req.headers.origin) {
                    res.header("Access-Control-Allow-Origin", req.headers.origin);
                    res.header("Access-Control-Allow-Headers", "content-type");
                    res.header('Access-Control-Allow-Methods', 'GET');
                    res.header('Access-Control-Allow-Credentials', 'true');
                    res.header('Vary', 'Origin, Access-Control-Request-Headers');
                }
                res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
                res.header('Expires', '-1');
                res.header('Pragma', 'no-cache');
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetVisitorByID(req.body.sid)];
            case 3:
                session_1 = (_d.sent());
                if (!session_1) return [3 /*break*/, 24];
                return [4 /*yield*/, companyModel_1.Company.getSettings(session_1.nsp)];
            case 4:
                origin = _d.sent();
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetSessionForChat((session_1._id || session_1.id))];
            case 5:
                data = _d.sent();
                res.status(200).send({ status: 'ok' });
                _b = (_a = Promise).all;
                return [4 /*yield*/, sessionsManager_1.SessionManager.RemoveSession(session_1, true)];
            case 6:
                _c = [
                    _d.sent()
                ];
                return [4 /*yield*/, conversationModel_1.Conversations.EndChat(session_1.conversationID, true, (data) ? data : '', req.body.survey)];
            case 7:
                _c = _c.concat([
                    _d.sent()
                ]);
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'removeUser', nsp: session_1.nsp, roomName: [agentModel_1.Agents.NotifyAll()], data: session_1.id || session_1._id, })];
            case 8:
                _c = _c.concat([
                    _d.sent()
                ]);
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'V', broadcast: false, eventName: 'allPopUpWindowsClose', nsp: session_1.nsp, roomName: [session_1.id || session_1._id], data: {} })];
            case 9:
                _c = _c.concat([
                    _d.sent()
                ]);
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'V', broadcast: false, eventName: 'allHelpSupportWindowsClose', nsp: session_1.nsp, roomName: [session_1.id || session_1._id], data: {} })];
            case 10: return [4 /*yield*/, _b.apply(_a, [_c.concat([
                        _d.sent()
                    ])])];
            case 11:
                promises = _d.sent();
                updatedConversation = promises[1];
                if (!(updatedConversation && updatedConversation.value)) return [3 /*break*/, 17];
                // if (origin && origin[0]['settings']['chatSettings']['assignments'].aEng && session.agent && session.agent.id) {
                //     let result = await AutoAssignFromQueueAuto(session);
                //     // await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'autoQueueAssign', data: session })
                // }
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'stopConversation', nsp: session_1.nsp, roomName: [agentModel_1.Agents.NotifyOne(session_1)], data: { conversation: updatedConversation.value }, })];
            case 12:
                // if (origin && origin[0]['settings']['chatSettings']['assignments'].aEng && session.agent && session.agent.id) {
                //     let result = await AutoAssignFromQueueAuto(session);
                //     // await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'autoQueueAssign', data: session })
                // }
                _d.sent();
                if (!(updatedConversation && updatedConversation.value && updatedConversation.value.superviserAgents && updatedConversation.value.superviserAgents.length)) return [3 /*break*/, 14];
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'removeConversation', nsp: session_1.nsp, roomName: updatedConversation.value.superviserAgents, data: { conversation: updatedConversation.value }, })];
            case 13:
                _d.sent();
                _d.label = 14;
            case 14:
                packet = { action: 'endConversation', cid: session_1.conversationID };
                return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendMessage({ action: 'startConversation', conversation: updatedConversation.value }, constants_1.ARCHIVINGQUEUE)];
            case 15:
                _d.sent();
                return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendMessage(packet, constants_1.ARCHIVINGQUEUE)];
            case 16:
                _d.sent();
                _d.label = 17;
            case 17:
                endChatMsg = void 0;
                //else {
                endChatMsg = {
                    from: session_1.username ? session_1.username : "",
                    to: session_1.agent ? session_1.agent : undefined,
                    body: '',
                    type: "Events",
                    cid: session_1.conversationID ? session_1.conversationID : "",
                    attachment: false,
                    date: new Date().toISOString(),
                    chatFormData: ''
                };
                if (!req.body.forceEnded)
                    endChatMsg.body = 'Chat ended by ' + session_1.username;
                return [4 /*yield*/, CreateMessage_1.CreateLogMessage(endChatMsg)];
            case 18:
                endChatMessage = _d.sent();
                if (!endChatMessage) return [3 /*break*/, 20];
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'privateMessage', nsp: session_1.nsp, roomName: [agentModel_1.Agents.NotifyOne(session_1)], data: endChatMessage })];
            case 19:
                _d.sent();
                if (req.body.feedbackForm && Object.keys(req.body.feedbackForm).length) {
                    setTimeout(function () { return __awaiter(void 0, void 0, void 0, function () {
                        var insertedMessage;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, CreateMessage_1.CreateLogMessage(req.body.feedbackForm)];
                                case 1:
                                    insertedMessage = _a.sent();
                                    if (!(session_1 && insertedMessage)) return [3 /*break*/, 3];
                                    return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'privateMessage', nsp: session_1.nsp, roomName: [agentModel_1.Agents.NotifyOne(session_1)], data: insertedMessage })];
                                case 2:
                                    _a.sent();
                                    _a.label = 3;
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); }, 0);
                }
                _d.label = 20;
            case 20:
                if (!(updatedConversation && updatedConversation.value)) return [3 /*break*/, 22];
                event = 'Chat Ended';
                return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendEventLog(enums_1.EventLogMessages.ENDCHAT, (session_1._id) ? session_1._id : session_1.id)];
            case 21:
                loggedEvent = _d.sent();
                _d.label = 22;
            case 22: return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'disconnect', data: session_1 })];
            case 23:
                _d.sent();
                return [3 /*break*/, 35];
            case 24: return [4 /*yield*/, visitorSessionmodel_1.visitorSessions.getVisitorSession(req.body.sid)];
            case 25:
                session_2 = _d.sent();
                if (!(session_2 && session_2.length)) return [3 /*break*/, 34];
                if (!(!req.body || !req.body.survey)) return [3 /*break*/, 27];
                res.status(200).send({ status: 'ok' });
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'disconnect', data: session_2 })];
            case 26:
                _d.sent();
                return [3 /*break*/, 33];
            case 27:
                if (!req.body.feedbackForm) return [3 /*break*/, 29];
                return [4 /*yield*/, CreateMessage_1.CreateLogMessage(req.body.feedbackForm)];
            case 28:
                insertedMessage = _d.sent();
                _d.label = 29;
            case 29:
                res.status(200).send({ status: 'ok' });
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'disconnect', data: session_2 })];
            case 30:
                _d.sent();
                return [4 /*yield*/, conversationModel_1.Conversations.SubmitSurvey(session_2[0].conversationID, req.body.survey)];
            case 31:
                updatedConversation = _d.sent();
                if (!(updatedConversation && updatedConversation.value)) return [3 /*break*/, 33];
                return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendEventLog(enums_1.EventLogMessages.ENDCHAT, (session_2[0]._id) ? session_2[0]._id : session_2[0].id)];
            case 32:
                loggedEvent = _d.sent();
                _d.label = 33;
            case 33: return [3 /*break*/, 35];
            case 34:
                res.status(200).send({ status: 'ok' });
                _d.label = 35;
            case 35: return [3 /*break*/, 37];
            case 36:
                error_3 = _d.sent();
                res.status(401).send();
                console.log(error_3);
                return [3 /*break*/, 37];
            case 37: return [2 /*return*/];
        }
    });
}); });
router.post('/submitSurveyAfterEndChat/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var insertedMessage, updatedConversation, loggedEvent, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('submitSurvey');
                _a.label = 1;
            case 1:
                _a.trys.push([1, 9, , 10]);
                if (!(!req.body.feedbackForm || !req.body.survey)) return [3 /*break*/, 2];
                res.status(401).send();
                return [3 /*break*/, 8];
            case 2:
                // && req.headers.origin.indexOf('localhost') != -1
                if (req.headers.origin) {
                    res.header("Access-Control-Allow-Origin", req.headers.origin);
                    res.header("Access-Control-Allow-Headers", "content-type");
                    res.header('Access-Control-Allow-Methods', 'GET');
                    res.header('Access-Control-Allow-Credentials', 'true');
                    res.header('Vary', 'Origin, Access-Control-Request-Headers');
                }
                res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
                res.header('Expires', '-1');
                res.header('Pragma', 'no-cache');
                if (!(!req.body || !req.body.survey)) return [3 /*break*/, 3];
                res.status(200).send({ status: 'error' });
                return [3 /*break*/, 8];
            case 3:
                insertedMessage = void 0;
                if (!req.body.feedbackForm) return [3 /*break*/, 5];
                return [4 /*yield*/, CreateMessage_1.CreateLogMessage(req.body.feedbackForm)
                    //if (insertedMessage) {
                ];
            case 4:
                insertedMessage = _a.sent();
                _a.label = 5;
            case 5:
                //if (insertedMessage) {
                res.status(200).send({ status: 'ok' });
                return [4 /*yield*/, conversationModel_1.Conversations.SubmitSurvey(req.body.cid, (req.body.survey) ? req.body.survey : {})];
            case 6:
                updatedConversation = _a.sent();
                if (!(updatedConversation && updatedConversation.value)) return [3 /*break*/, 8];
                loggedEvent = void 0;
                if (!req.body.sid) return [3 /*break*/, 8];
                return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendEventLog(enums_1.EventLogMessages.ENDCHAT, (req.body.sid) ? req.body.sid : '')];
            case 7:
                loggedEvent = _a.sent();
                _a.label = 8;
            case 8: return [3 /*break*/, 10];
            case 9:
                error_4 = _a.sent();
                res.status(401).send();
                console.log(error_4);
                return [3 /*break*/, 10];
            case 10: return [2 /*return*/];
        }
    });
}); });
// visitor routes end
router.post('/registerUser/:username?/:email?/:location?/:ipAddress?', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var exists, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(!req.body.username || !req.body.email)) return [3 /*break*/, 1];
                res.send(new Error('505'));
                return [3 /*break*/, 4];
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, visitorModel_1.Visitor.visitorExists(req.body.nsp, req.body.email)
                    //console.log('Visitor Exists : ' + exists);
                ];
            case 2:
                exists = _a.sent();
                //console.log('Visitor Exists : ' + exists);
                if (!exists) {
                    visitorModel_1.Visitor.insertVisitor(req.body);
                    res.send({ message: "Inserted" });
                }
                else {
                    res.send({ message: "Welcome Back " + req.body.username });
                }
                return [3 /*break*/, 4];
            case 3:
                error_5 = _a.sent();
                res.send(error_5);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.post('/visitorList', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, session, visitors, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                data = req.body;
                if (!data.nsp || !data.email)
                    res.status(401).send('Invalid Request!');
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetSessionByEmailFromDatabase(data.email, data.nsp)];
            case 1:
                session = _a.sent();
                if (!session) return [3 /*break*/, 3];
                return [4 /*yield*/, sessionsManager_1.SessionManager.sendVisitorList(session)];
            case 2:
                visitors = _a.sent();
                res.send(visitors);
                return [3 /*break*/, 4];
            case 3:
                res.send([]);
                _a.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                err_1 = _a.sent();
                console.log(err_1);
                console.log('Error in getting visitor list');
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
router.post('/getLeftVisitors', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, visitorList, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                data = req.body;
                if (!data.nsp)
                    res.status(401).send('Invalid Request!');
                return [4 /*yield*/, visitorModel_1.Visitor.GetLeftVisitors(data.nsp)];
            case 1:
                visitorList = _a.sent();
                if (visitorList.length)
                    res.send({ status: 'ok', leftVisitors: visitorList });
                else
                    res.send({ status: 'ok', leftVisitors: [] });
                return [3 /*break*/, 3];
            case 2:
                err_2 = _a.sent();
                console.log(err_2);
                console.log('Error in getting left visitors');
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/getBannedVisitors', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, bannedVisitorList, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                data = req.body;
                if (!data.nsp)
                    res.status(401).send('Invalid Request!');
                return [4 /*yield*/, visitorModel_1.Visitor.GetBannedVisitors(data.nsp)];
            case 1:
                bannedVisitorList = _a.sent();
                if (bannedVisitorList && bannedVisitorList.length)
                    res.send({ status: 'ok', bannedVisitorList: bannedVisitorList });
                else
                    res.send({ status: 'ok', bannedVisitorList: [] });
                return [3 /*break*/, 3];
            case 2:
                err_3 = _a.sent();
                console.log(err_3);
                console.log('Error in getting Banned visitors');
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/addCustomer', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var exists, visitor, error_6, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 8, , 9]);
                if (!(!req.body.username || !req.body.email)) return [3 /*break*/, 1];
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 7];
            case 1:
                _a.trys.push([1, 6, , 7]);
                return [4 /*yield*/, visitorModel_1.Visitor.visitorExists(req.body.nsp, req.body.email)];
            case 2:
                exists = _a.sent();
                if (!!exists) return [3 /*break*/, 4];
                return [4 /*yield*/, visitorModel_1.Visitor.insertVisitor(req.body, req.body.nsp)];
            case 3:
                visitor = _a.sent();
                res.send({ message: "Inserted", insertedVisitor: visitor.ops[0] });
                return [3 /*break*/, 5];
            case 4:
                res.send({ message: "Exists" });
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                error_6 = _a.sent();
                res.send(error_6);
                return [3 /*break*/, 7];
            case 7: return [3 /*break*/, 9];
            case 8:
                err_4 = _a.sent();
                console.log(err_4);
                console.log('Error');
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); });
router.post('/updateCustomer', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var exists, update, error_7, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 8, , 9]);
                if (!!req.body.email) return [3 /*break*/, 1];
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 7];
            case 1:
                _a.trys.push([1, 6, , 7]);
                return [4 /*yield*/, visitorModel_1.Visitor.visitorExists(req.body.nsp, req.body.email)
                    //console.log('Visitor Exists : ' + exists);
                ];
            case 2:
                exists = _a.sent();
                if (!exists) return [3 /*break*/, 4];
                return [4 /*yield*/, visitorModel_1.Visitor.UpdateVisitorInfoById(req.body.id, req.body)];
            case 3:
                update = _a.sent();
                //console.log(update);
                res.send({ message: "Updated", data: update });
                return [3 /*break*/, 5];
            case 4:
                res.send({ message: "Customer doesnot exists" });
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                error_7 = _a.sent();
                res.send(error_7);
                return [3 /*break*/, 7];
            case 7: return [3 /*break*/, 9];
            case 8:
                err_5 = _a.sent();
                console.log(err_5);
                console.log('Error');
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); });
router.post('/deleteCustomer', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var d, error_8, err_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                if (!!req.body.id) return [3 /*break*/, 1];
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 4];
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, visitorModel_1.Visitor.DeleteVisitor(req.body.id)];
            case 2:
                d = _a.sent();
                //console.log(d);
                res.send({ message: "Deleted", data: d });
                return [3 /*break*/, 4];
            case 3:
                error_8 = _a.sent();
                res.send(error_8);
                return [3 /*break*/, 4];
            case 4: return [3 /*break*/, 6];
            case 5:
                err_6 = _a.sent();
                console.log(err_6);
                console.log('Error');
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
router.post('/getVisitorsByFilters', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var visitors, error_9, err_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                if (!!req.body.nsp) return [3 /*break*/, 1];
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 4];
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, visitorModel_1.Visitor.getFilteredVisitors(req.body.nsp, req.body.dateFrom, req.body.dateTo, req.body.location, req.body.source, req.body.group, req.body.chunk)];
            case 2:
                visitors = _a.sent();
                res.send({ visitorsList: visitors });
                return [3 /*break*/, 4];
            case 3:
                error_9 = _a.sent();
                res.send(error_9);
                return [3 /*break*/, 4];
            case 4: return [3 /*break*/, 6];
            case 5:
                err_7 = _a.sent();
                console.log(err_7);
                console.log('Error');
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
router.post('/getUrlsVisitedCount', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var sessions, count_1, arr_1, err_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, visitorSessionmodel_1.visitorSessions.getVisitorSessions(req.body.sessions)];
            case 1:
                sessions = _a.sent();
                count_1 = 0;
                arr_1 = [];
                sessions.map(function (session) {
                    count_1 = count_1 + session.url.length;
                    arr_1.push({ 'date': session.creationDate.split("T")[0], 'urlCount': session.url.length, 'conversationID': session.conversationID });
                });
                res.send({ count: count_1, periodicCount: arr_1 });
                return [3 /*break*/, 3];
            case 2:
                err_8 = _a.sent();
                console.log(err_8);
                console.log('Error');
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/searchCustomers', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var session, customers, error_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                if (!req.body.sessionId)
                    res.status(401).send({ error: 'Unauthorized' });
                session = void 0;
                if (!req.body.sessionId) return [3 /*break*/, 2];
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetAgentByID(req.body.sessionId)];
            case 1:
                session = _a.sent();
                _a.label = 2;
            case 2:
                ;
                if (!session) return [3 /*break*/, 4];
                return [4 /*yield*/, visitorModel_1.Visitor.searchCustomers(req.body.nsp, req.body.keyword, req.body.chunk)];
            case 3:
                customers = _a.sent();
                if (customers && customers.length)
                    res.status(200).send({ customerList: customers });
                else
                    res.status(200).send({ customerList: [] });
                return [3 /*break*/, 5];
            case 4:
                res.status(401).send({ error: 'Unauthorized' });
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                error_10 = _a.sent();
                console.log('Error in Search Customers');
                console.log(error_10);
                res.status(401).send();
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
router.post('/getTotalVisitorsByNsp', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var visitors, error_11, err_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                if (!!req.body.nsp) return [3 /*break*/, 1];
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 4];
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, visitorModel_1.Visitor.getVisitorsCountByNsp(req.body.nsp, req.body.dateFrom, req.body.dateTo)];
            case 2:
                visitors = _a.sent();
                res.send({ visitorsList: visitors });
                return [3 /*break*/, 4];
            case 3:
                error_11 = _a.sent();
                res.send(error_11);
                return [3 /*break*/, 4];
            case 4: return [3 /*break*/, 6];
            case 5:
                err_9 = _a.sent();
                console.log(err_9);
                console.log('Error');
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
router.post('/getTrafficByCountry', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var list, error_12, err_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                if (!!req.body.nsp) return [3 /*break*/, 1];
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 4];
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, visitorModel_1.Visitor.getTraffic(req.body.nsp, req.body.dateFrom, req.body.dateTo)];
            case 2:
                list = _a.sent();
                res.send({ List: list });
                return [3 /*break*/, 4];
            case 3:
                error_12 = _a.sent();
                res.send(error_12);
                return [3 /*break*/, 4];
            case 4: return [3 /*break*/, 6];
            case 5:
                err_10 = _a.sent();
                console.log(err_10);
                console.log('Error');
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
router.post('/getMaxUrls', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var list, error_13, err_11;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                if (!!req.body.nsp) return [3 /*break*/, 1];
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 4];
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, visitorSessionmodel_1.visitorSessions.getMaxUrlsByDate(req.body.nsp, req.body.dateFrom, req.body.dateTo)];
            case 2:
                list = _a.sent();
                res.send({ List: list });
                return [3 /*break*/, 4];
            case 3:
                error_13 = _a.sent();
                res.send(error_13);
                return [3 /*break*/, 4];
            case 4: return [3 /*break*/, 6];
            case 5:
                err_11 = _a.sent();
                console.log(err_11);
                console.log('Error');
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
router.post('/getAvgTimeSpent', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var list, error_14, err_12;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                if (!!req.body.nsp) return [3 /*break*/, 1];
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 4];
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, visitorSessionmodel_1.visitorSessions.getAvgTimeSpent(req.body.nsp, req.body.dateFrom, req.body.dateTo)];
            case 2:
                list = _a.sent();
                res.send({ List: list });
                return [3 /*break*/, 4];
            case 3:
                error_14 = _a.sent();
                res.send(error_14);
                return [3 /*break*/, 4];
            case 4: return [3 /*break*/, 6];
            case 5:
                err_12 = _a.sent();
                console.log(err_12);
                console.log('Error');
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
router.post('/getTopRefferers', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var list, error_15, err_13;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                if (!!req.body.nsp) return [3 /*break*/, 1];
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 4];
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, visitorSessionmodel_1.visitorSessions.getRefferers(req.body.nsp, req.body.dateFrom, req.body.dateTo)];
            case 2:
                list = _a.sent();
                res.send({ List: list });
                return [3 /*break*/, 4];
            case 3:
                error_15 = _a.sent();
                res.send(error_15);
                return [3 /*break*/, 4];
            case 4: return [3 /*break*/, 6];
            case 5:
                err_13 = _a.sent();
                console.log(err_13);
                console.log('Error');
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
router.post('/getTicketsVsChatsRatio', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var ticketsList, chatsList, error_16, err_14;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                if (!!req.body.nsp) return [3 /*break*/, 1];
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 5];
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, ticketsModel_1.Tickets.getAllTickets(req.body.nsp, req.body.dateFrom, req.body.dateTo)];
            case 2:
                ticketsList = _a.sent();
                return [4 /*yield*/, conversationModel_1.Conversations.getAllChats(req.body.nsp, req.body.dateFrom, req.body.dateTo)];
            case 3:
                chatsList = _a.sent();
                res.send({ ticketsList: ticketsList, chatsList: chatsList });
                return [3 /*break*/, 5];
            case 4:
                error_16 = _a.sent();
                res.send(error_16);
                return [3 /*break*/, 5];
            case 5: return [3 /*break*/, 7];
            case 6:
                err_14 = _a.sent();
                console.log(err_14);
                console.log('Error');
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
router.post('/getDeviceIdsByNsp', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, error_17, err_15;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                if (!!req.body.nsp) return [3 /*break*/, 1];
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 4];
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, visitorModel_1.Visitor.getDeviceIDs(req.body.nsp, req.body.chunk)];
            case 2:
                data = _a.sent();
                res.send({ List: data });
                return [3 /*break*/, 4];
            case 3:
                error_17 = _a.sent();
                res.send(error_17);
                return [3 /*break*/, 4];
            case 4: return [3 /*break*/, 6];
            case 5:
                err_15 = _a.sent();
                console.log(err_15);
                console.log('Error');
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
router.post('/getTrafficByDevice', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var traffic, error_18, err_16;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                if (!!req.body.nsp) return [3 /*break*/, 1];
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 4];
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, visitorModel_1.Visitor.trafficFilterByDeviceId(req.body.nsp, req.body.dateFrom, req.body.dateTo, req.body.deviceID)];
            case 2:
                traffic = _a.sent();
                res.send({ List: traffic });
                return [3 /*break*/, 4];
            case 3:
                error_18 = _a.sent();
                res.send(error_18);
                return [3 /*break*/, 4];
            case 4: return [3 /*break*/, 6];
            case 5:
                err_16 = _a.sent();
                console.log(err_16);
                console.log('Error');
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
exports.visitorRoutes = router;
//# sourceMappingURL=visitor.js.map