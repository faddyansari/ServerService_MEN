"use strict";
//Created By Saad Ismail Shaikh
//Date : 19-1-2018
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
exports.formActionRoutes = void 0;
//Express Module Reference
var express = require("express");
// Path Object to Define "Default/Static/Generic" Routes
var path = require("path");
var sessionsManager_1 = require("../globals/server/sessionsManager");
var Utils_1 = require("../helpers/Utils");
var agentModel_1 = require("../models/agentModel");
var visitorModel_1 = require("../models/visitorModel");
var conversationModel_1 = require("../models/conversationModel");
var CheckActive_1 = require("../actions/GlobalActions/CheckActive");
var constants_1 = require("../globals/config/constants");
var ticketsModel_1 = require("../models/ticketsModel");
var FormDesignerModel_1 = require("../models/FormDesignerModel");
var requestIp = require('request-ip');
var RuleSetExecutor_1 = require("../actions/TicketAbstractions/RuleSetExecutor");
var constants_2 = require("../globals/config/constants");
var aws_sqs_1 = require("../actions/aws/aws-sqs");
var enums_1 = require("../globals/config/enums");
var __biZZCMiddleWare_1 = require("../globals/__biZZCMiddleWare");
// Main Entry Point of our app or Home Route for our app that will be delivered on default routes (Our Single Page Application)
// Angular DIST output folder
// ../        (ROOT)
//  |---->../build/dist/index.html (Output of Angular app/src)
// Since this will contain our static assest hence this path will remain static.
//Router Object Which Will be used to validate requests in Request Handler.
var router = express.Router();
var publicPath = path.resolve(__dirname + '/../../');
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
router.post('/convertCannedFormToTicket', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var encryptionClass, ticketInfo, ticket, form, submittedForm, message, insertedMessage, _a, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 11, , 12]);
                console.log("convertCannedFormToTicket");
                if (!req.headers.origin) return [3 /*break*/, 9];
                // res.header("Access-Control-Allow-Origin", await EmailService.getEmailServiceAddress());
                res.header("Access-Control-Allow-Origin", req.headers.origin);
                res.header("Access-Control-Allow-Headers", "content-type");
                res.header('Access-Control-Allow-Methods', 'GET');
                res.header('Access-Control-Allow-Credentials', 'true');
                res.header('Connection', 'keep-alive');
                res.header('Content-Length', '0');
                res.header('Vary', 'Origin, Access-Control-Request-Headers');
                encryptionClass = new Utils_1.Encryption();
                return [4 /*yield*/, encryptionClass.decrypt(req.body.ticketInfo)];
            case 1:
                ticketInfo = _b.sent();
                ticketInfo = ticketInfo.split('-');
                ticket = {
                    from: ticketInfo[0],
                    to: ticketInfo[1],
                    ticketID: ticketInfo[2]
                };
                form = void 0;
                return [4 /*yield*/, FormDesignerModel_1.FormDesignerModel.GetFormsByID(req.body.formID)];
            case 2:
                submittedForm = _b.sent();
                if (submittedForm && submittedForm.length) {
                    submittedForm[0].formFields.forEach(function (inputs) {
                        inputs.submittedData = req.body[inputs.id];
                    });
                    form = {
                        id: submittedForm[0]._id,
                        type: submittedForm[0].type,
                    };
                }
                message = {
                    datetime: new Date().toISOString(),
                    senderType: 'Visitor',
                    message: '',
                    from: ticket.from,
                    to: ticket.to,
                    tid: [ticket.ticketID],
                    attachment: [],
                    viewColor: '',
                    form: form,
                    submittedForm: submittedForm,
                    nsp: (submittedForm && submittedForm.length) ? submittedForm[0].nsp : '',
                    replytoAddress: ''
                };
                return [4 /*yield*/, ticketsModel_1.Tickets.InsertMessage(JSON.parse(JSON.stringify(message)), message.senderType)];
            case 3:
                insertedMessage = _b.sent();
                if (!insertedMessage) return [3 /*break*/, 7];
                res.status(200).send({ ticket: insertedMessage, status: 'success' });
                if (!(submittedForm && submittedForm.length)) return [3 /*break*/, 5];
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'gotNewTicketMessage', nsp: submittedForm[0].nsp, roomName: ['Admins'], data: insertedMessage.ops[0], })];
            case 4:
                _a = _b.sent();
                return [3 /*break*/, 6];
            case 5:
                _a = undefined;
                _b.label = 6;
            case 6:
                _a;
                return [3 /*break*/, 8];
            case 7:
                res.status(401).send({ status: 'failed' });
                _b.label = 8;
            case 8: return [3 /*break*/, 10];
            case 9:
                res.status(401).send();
                _b.label = 10;
            case 10: return [3 /*break*/, 12];
            case 11:
                error_1 = _b.sent();
                res.status(401).send();
                console.log(error_1);
                return [3 /*break*/, 12];
            case 12: return [2 /*return*/];
        }
    });
}); });
//for external forms (other than chat bot)
router.get('/chatForms/:formName?/:csid?', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var clientIp, session, socket, submittedForm, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('chatForms');
                _a.label = 1;
            case 1:
                _a.trys.push([1, 6, , 7]);
                clientIp = requestIp.getClientIp(req);
                if (!(!req.params.formName || !req.params.csid)) return [3 /*break*/, 2];
                // res.status(401).send();
                console.log("UNauthorized");
                return [3 /*break*/, 5];
            case 2:
                res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
                res.header('Expires', '-1');
                res.header('Pragma', 'no-cache');
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetVisitorByID((req.params.csid) ? req.params.csid : '')];
            case 3:
                session = _a.sent();
                socket = void 0;
                return [4 /*yield*/, FormDesignerModel_1.FormDesignerModel.GetFormsByName(req.params.formName)];
            case 4:
                submittedForm = _a.sent();
                if (submittedForm && submittedForm.length) {
                    submittedForm[0].formFields.map(function (inputs) {
                        inputs.submittedData = req.body[inputs.id];
                    });
                }
                res.status(200).send({ status: 'success' });
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                error_2 = _a.sent();
                console.log(error_2);
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
router.post('/registrationForm', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var clientIp, session, submittedForm, data_1, loggedEvent, payload, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('registrationForm');
                _a.label = 1;
            case 1:
                _a.trys.push([1, 14, , 15]);
                clientIp = requestIp.getClientIp(req);
                if (!(!req.body.form || !req.body.csid)) return [3 /*break*/, 2];
                res.status(401).send();
                return [3 /*break*/, 13];
            case 2:
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
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetVisitorByID((req.body.csid) ? req.body.csid : '')];
            case 3:
                session = _a.sent();
                return [4 /*yield*/, FormDesignerModel_1.FormDesignerModel.GetFormsByName(req.body.form.formName)
                    // if (submittedForm && submittedForm.length) console.log(submittedForm[0].formFields);
                ];
            case 4:
                submittedForm = _a.sent();
                data_1 = {};
                if (submittedForm && submittedForm.length) {
                    submittedForm[0].formFields.map(function (inputs) {
                        inputs.submittedData = req.body[inputs.id];
                        data_1[inputs.fieldName.toLowerCase()] = req.body[inputs.id];
                    });
                }
                if (!(data_1.username && data_1.email)) return [3 /*break*/, 12];
                return [4 /*yield*/, sessionsManager_1.SessionManager.UpdateUserInformation(session, data_1)];
            case 5:
                session = (_a.sent());
                return [4 /*yield*/, conversationModel_1.Conversations.UpdateVisitorInfo(session.conversationID, data_1.username, data_1.email)];
            case 6:
                _a.sent();
                return [4 /*yield*/, visitorModel_1.Visitor.UpdateVisitorInfoByDeviceID(session.deviceID, { username: data_1.username, email: data_1.email })];
            case 7:
                _a.sent();
                //evet for closing form in all windows if submitted from one
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'V', broadcast: false, eventName: 'closeActionForm', nsp: session.nsp, roomName: [visitorModel_1.Visitor.NotifyOne(session)], data: { status: 'ok' } })];
            case 8:
                //evet for closing form in all windows if submitted from one
                _a.sent();
                return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendEventLog(enums_1.EventLogMessages.VISITOR_CREDENTIALS_UPDATED, (session._id) ? session._id : session.id)];
            case 9:
                loggedEvent = _a.sent();
                payload = { id: session.id, session: session };
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'V', broadcast: true, eventName: 'updateUser', nsp: session.nsp, roomName: [visitorModel_1.Visitor.NotifyOne(session)], data: payload })];
            case 10:
                _a.sent();
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateUserInfo', nsp: session.nsp, roomName: [agentModel_1.Agents.NotifyOne(session)], data: { cid: session.conversationID, username: session.username, email: session.email } })];
            case 11:
                _a.sent();
                res.status(200).send({ status: 'success', message: 'Credentials Updated' });
                return [3 /*break*/, 13];
            case 12:
                res.status(200).send({ status: 'failed' });
                _a.label = 13;
            case 13: return [3 /*break*/, 15];
            case 14:
                error_3 = _a.sent();
                console.log(error_3);
                res.status(401).send();
                return [3 /*break*/, 15];
            case 15: return [2 /*return*/];
        }
    });
}); });
router.post('/passwordReset', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var clientIp, session, submittedForm, data_2, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('passwordReset');
                _a.label = 1;
            case 1:
                _a.trys.push([1, 6, , 7]);
                clientIp = requestIp.getClientIp(req);
                if (!(!req.body.form || !req.body.csid)) return [3 /*break*/, 2];
                res.status(401).send();
                console.log("UNauthorized");
                return [3 /*break*/, 5];
            case 2:
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
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetVisitorByID((req.body.csid) ? req.body.csid : '')];
            case 3:
                session = _a.sent();
                return [4 /*yield*/, FormDesignerModel_1.FormDesignerModel.GetFormsByName(req.body.form.formName)];
            case 4:
                submittedForm = _a.sent();
                data_2 = {};
                // if (submittedForm) console.log(submittedForm[0].formFields);
                if (submittedForm && submittedForm.length) {
                    submittedForm[0].formFields.map(function (inputs) {
                        inputs.submittedData = req.body[inputs.id];
                        data_2[inputs.fieldName.toLowerCase()] = req.body[inputs.id];
                    });
                }
                if (data_2)
                    res.status(200).send({ status: 'success', message: 'Credentials Updated' });
                else
                    res.status(200).send({ status: 'failed' });
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                error_4 = _a.sent();
                console.log(error_4);
                res.status(401).send({ status: 'failed' });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
router.post('/feedBackForm', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var clientIp, session, submittedForm, data_3, email, sessionData, feedBack, packet, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('feedBack');
                _a.label = 1;
            case 1:
                _a.trys.push([1, 12, , 13]);
                clientIp = requestIp.getClientIp(req);
                if (!(!req.body.form || !req.body.csid)) return [3 /*break*/, 2];
                res.status(401).send();
                return [3 /*break*/, 11];
            case 2:
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
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetVisitorByID((req.body.csid) ? req.body.csid : '')];
            case 3:
                session = _a.sent();
                return [4 /*yield*/, FormDesignerModel_1.FormDesignerModel.GetFormsByName(req.body.form.formName)];
            case 4:
                submittedForm = _a.sent();
                data_3 = {};
                // if (submittedForm && submittedForm.length) console.log(submittedForm[0].formFields);
                if (submittedForm && submittedForm.length) {
                    submittedForm[0].formFields.map(function (inputs) {
                        inputs.submittedData = req.body[inputs.id];
                        data_3[inputs.fieldName.toLowerCase()] = req.body[inputs.id];
                    });
                }
                email = data_3.email;
                delete data_3.email;
                if (!session.conversationID) return [3 /*break*/, 10];
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetSessionForChat((session._id || session.id))];
            case 5:
                sessionData = _a.sent();
                return [4 /*yield*/, conversationModel_1.Conversations.EndChat(session.conversationID, true, (sessionData) ? sessionData : '', data_3)];
            case 6:
                feedBack = _a.sent();
                if (!(feedBack && feedBack.value)) return [3 /*break*/, 9];
                return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendMessage({ action: 'startConversation', conversation: feedBack.value }, constants_1.ARCHIVINGQUEUE)];
            case 7:
                _a.sent();
                packet = {
                    action: 'endConversation',
                    cid: session.conversationID
                };
                return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendMessage(packet, constants_1.ARCHIVINGQUEUE)];
            case 8:
                _a.sent();
                res.status(200).send({ status: 'success' });
                _a.label = 9;
            case 9: return [3 /*break*/, 11];
            case 10:
                res.status(200).send({ status: 'failed' });
                _a.label = 11;
            case 11: return [3 /*break*/, 13];
            case 12:
                error_5 = _a.sent();
                res.status(401).send();
                console.log(error_5);
                return [3 /*break*/, 13];
            case 13: return [2 /*return*/];
        }
    });
}); });
router.post('/ticket', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var clientIp, session, submittedForm, data_4, primaryEmail, randomColor, ticket, UpdatedVisitor, insertedTicket, ticketId, message, insertedMessage, loggedEvent, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('ticketForm');
                _a.label = 1;
            case 1:
                _a.trys.push([1, 22, , 23]);
                clientIp = requestIp.getClientIp(req);
                if (!(!req.body.form || !req.body.csid)) return [3 /*break*/, 2];
                res.status(401).send();
                return [3 /*break*/, 21];
            case 2:
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
                return [4 /*yield*/, CheckActive_1.MakeActive({ id: req.body.csid, _id: req.body.csid })];
            case 3:
                session = _a.sent();
                if (!session) return [3 /*break*/, 20];
                return [4 /*yield*/, FormDesignerModel_1.FormDesignerModel.GetFormsByName(req.body.form.formName)
                    // if (submittedForm) console.log(submittedForm[0].formFields);
                ];
            case 4:
                submittedForm = _a.sent();
                data_4 = {};
                if (submittedForm && submittedForm.length) {
                    submittedForm[0].formFields.map(function (inputs) {
                        inputs.submittedData = req.body[inputs.id];
                        data_4[inputs.fieldName.toLowerCase()] = req.body[inputs.id];
                    });
                }
                return [4 /*yield*/, ticketsModel_1.Tickets.GetPrimaryEmail(session.nsp)];
            case 5:
                primaryEmail = _a.sent();
                if (!primaryEmail) return [3 /*break*/, 18];
                randomColor = constants_1.rand[Math.floor(Math.random() * constants_1.rand.length)];
                ticket = {
                    type: 'email',
                    subject: data_4.subject,
                    nsp: session.nsp,
                    state: 'OPEN',
                    datetime: new Date().toISOString(),
                    priority: data_4.priority,
                    from: constants_2.ticketEmail,
                    visitor: {
                        name: data_4.name,
                        email: data_4.email,
                        phone: data_4.phone,
                        location: session.country,
                        ip: session.ip,
                        fullCountryName: session.fullCountryName.toString(),
                        url: session.url,
                        country: session.country
                    },
                    lasttouchedTime: new Date().toISOString(),
                    viewState: 'UNREAD',
                    ticketlog: [],
                    mergedTicketIds: [],
                    viewColor: randomColor,
                    group: "",
                    assigned_to: "",
                    slaPolicy: {
                        reminderResolution: false,
                        reminderResponse: false,
                        violationResponse: false,
                        violationResolution: false
                    },
                    assignmentList: []
                    // slaPolicyEnabled: true
                };
                if (!(data_4.phone && data_4.email)) return [3 /*break*/, 7];
                return [4 /*yield*/, visitorModel_1.Visitor.UpdateVisitorInfoByDeviceID(session.deviceID, { username: data_4.username, email: data_4.email, phone: data_4.phone ? data_4.phone : '' })];
            case 6:
                UpdatedVisitor = _a.sent();
                _a.label = 7;
            case 7: return [4 /*yield*/, RuleSetExecutor_1.RuleSetDescriptor(ticket)];
            case 8:
                ticket = _a.sent();
                if (ticket.assigned_to) {
                    ticket.assignmentList = [
                        {
                            assigned_to: ticket.assigned_to,
                            assigned_time: ticket.first_assigned_time,
                            read_date: ''
                        }
                    ];
                }
                return [4 /*yield*/, ticketsModel_1.Tickets.CreateTicket(JSON.parse(JSON.stringify(ticket)))];
            case 9:
                insertedTicket = _a.sent();
                ticketId = void 0;
                (insertedTicket && insertedTicket.insertedCount) ? ticketId = insertedTicket.insertedId : undefined;
                if (!ticketId) return [3 /*break*/, 16];
                message = {
                    datetime: new Date().toISOString(),
                    nsp: session.nsp,
                    senderType: 'Visitor',
                    message: data_4.message,
                    from: data_4.email,
                    to: session.nsp,
                    tid: [ticketId],
                    attachment: [],
                    viewColor: (insertedTicket && insertedTicket.insertedCount) ? insertedTicket.ops[0].viewColor : '',
                    replytoAddress: data_4.email
                };
                return [4 /*yield*/, ticketsModel_1.Tickets.InsertMessage(JSON.parse(JSON.stringify(message)))];
            case 10:
                insertedMessage = _a.sent();
                if (!(insertedMessage && insertedMessage.insertedCount &&
                    insertedTicket && insertedTicket.insertedCount)) return [3 /*break*/, 14];
                return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendEventLog(enums_1.EventLogMessages.TICKET_SUBMITTED, (session._id) ? session._id : session.id)];
            case 11:
                loggedEvent = _a.sent();
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'newTicket', nsp: session.nsp, roomName: ['ticketAdmin'], data: insertedTicket.ops[0] })];
            case 12:
                _a.sent();
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'newTicket', nsp: session.nsp, roomName: [ticket.group], data: insertedTicket.ops[0] })];
            case 13:
                _a.sent();
                res.status(200).send({ status: 'success' });
                return [3 /*break*/, 15];
            case 14:
                res.status(200).send({ status: 'failed' });
                _a.label = 15;
            case 15: return [3 /*break*/, 17];
            case 16:
                res.status(200).send({ status: 'failed' });
                _a.label = 17;
            case 17: return [3 /*break*/, 19];
            case 18:
                res.status(200).send({ status: 'failed' });
                _a.label = 19;
            case 19: return [3 /*break*/, 21];
            case 20:
                res.status(401).send({ status: 'failed' });
                _a.label = 21;
            case 21: return [3 /*break*/, 23];
            case 22:
                error_6 = _a.sent();
                res.status(401).send();
                console.log(error_6);
                return [3 /*break*/, 23];
            case 23: return [2 /*return*/];
        }
    });
}); });
exports.formActionRoutes = router;
//# sourceMappingURL=formActions.js.map