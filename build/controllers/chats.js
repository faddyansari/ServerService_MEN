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
exports.chatRoutes = void 0;
var express = require("express");
var conversationModel_1 = require("../models/conversationModel");
var sessionsManager_1 = require("../globals/server/sessionsManager");
var companyModel_1 = require("../models/companyModel");
var CheckActive_1 = require("../actions/GlobalActions/CheckActive");
var mongodb_1 = require("mongodb");
var agentModel_1 = require("../models/agentModel");
var aws_sqs_1 = require("../actions/aws/aws-sqs");
var enums_1 = require("../globals/config/enums");
var visitorModel_1 = require("../models/visitorModel");
var Utils_1 = require("../actions/agentActions/Utils");
var CreateMessage_1 = require("../actions/GlobalActions/CreateMessage");
var __biZZCMiddleWare_1 = require("../globals/__biZZCMiddleWare");
var widgetMarketingModel_1 = require("../models/widgetMarketingModel");
var workflowModel_1 = require("../models/ChatBot/workflowModel");
var ticketsModel_1 = require("../models/ticketsModel");
var constants_1 = require("../globals/config/constants");
var RuleSetExecutor_1 = require("../actions/TicketAbstractions/RuleSetExecutor");
var AssignChat_1 = require("../actions/ChatActions/AssignChat");
var FormDesignerModel_1 = require("../models/FormDesignerModel");
var visitorSessionmodel_1 = require("../models/visitorSessionmodel");
var missedChatToTicket_1 = require("../actions/TicketAbstractions/missedChatToTicket");
var AssignmentRuleSetDispatcher_1 = require("../actions/ChatActions/AssignmentRuleSetDispatcher");
var request = require("request-promise");
var stockModel_1 = require("../models/stockModel");
var router = express.Router();
/* #region  Chats */
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
router.post('/getConversations', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, session, conversations, SuperVisedConversations, _a, _i, conversations_1, conversation, temp_1, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 10, , 11]);
                data = req.body;
                if (!data.email || !data.nsp)
                    res.status(401).send("Invalid Request!");
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetSessionByEmailFromDatabase(data.email, data.nsp)];
            case 1:
                session = _b.sent();
                return [4 /*yield*/, conversationModel_1.Conversations.getConversations(data.email, 'self', data.nsp, (session) ? session.permissions.agents.canAccessBotChats : false)];
            case 2:
                conversations = _b.sent();
                SuperVisedConversations = void 0;
                if (!(session && session.permissions.agents.chatSuperVision)) return [3 /*break*/, 4];
                return [4 /*yield*/, conversationModel_1.Conversations.getSupervisedConversation(data.email, data.nsp, session._id)];
            case 3:
                _a = (_b.sent());
                return [3 /*break*/, 5];
            case 4:
                _a = '';
                _b.label = 5;
            case 5:
                SuperVisedConversations = _a;
                if (!(conversations && conversations.length)) return [3 /*break*/, 9];
                if (SuperVisedConversations && SuperVisedConversations.length) {
                    conversations = conversations.concat(SuperVisedConversations);
                }
                _i = 0, conversations_1 = conversations;
                _b.label = 6;
            case 6:
                if (!(_i < conversations_1.length)) return [3 /*break*/, 9];
                conversation = conversations_1[_i];
                return [4 /*yield*/, conversationModel_1.Conversations.getMessages(conversation._id)];
            case 7:
                temp_1 = _b.sent();
                conversation.messages = (temp_1.length) ? temp_1 : [];
                _b.label = 8;
            case 8:
                _i++;
                return [3 /*break*/, 6];
            case 9:
                // if (conversations) console.log('conversations', conversations.length)
                res.send({ conversations: conversations, ended: (conversations && conversations.length < 20) ? true : false });
                return [3 /*break*/, 11];
            case 10:
                err_1 = _b.sent();
                console.log(err_1);
                console.log('Error in get conversations');
                res.status(401).send('Invalid request');
                return [3 /*break*/, 11];
            case 11: return [2 /*return*/];
        }
    });
}); });
router.post('/getArchives', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, session, chatPermissions, archives, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                data = req.body;
                if (!data.email || !data.nsp)
                    res.status(401).send("Invalid Request!");
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetSessionByEmailFromDatabase(data.email, data.nsp)];
            case 1:
                session = _a.sent();
                if (!session) return [3 /*break*/, 3];
                chatPermissions = session.permissions.chats;
                return [4 /*yield*/, conversationModel_1.Conversations.getArchives(session.email, chatPermissions.canView, data.filters, session.nsp, undefined, data.query)];
            case 2:
                archives = _a.sent();
                if (data.query && data.query.length) {
                    res.send({ status: 'ok', archives: archives, ended: true });
                }
                else {
                    res.send({ status: 'ok', archives: archives, ended: (archives && archives.length < 20) ? true : false });
                }
                return [3 /*break*/, 4];
            case 3:
                res.send({ status: 'error' });
                _a.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                err_2 = _a.sent();
                console.log(err_2);
                console.log('Error in get archives');
                res.status(401).send("Invalid Request!");
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
router.post('/getMoreArchives', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, session, chatPermissions, archives, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                data = req.body;
                if (!data.email || !data.nsp)
                    res.status(401).send("Invalid Request!");
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetSessionByEmailFromDatabase(data.email, data.nsp)];
            case 1:
                session = _a.sent();
                if (!session) return [3 /*break*/, 3];
                chatPermissions = session.permissions.chats;
                return [4 /*yield*/, conversationModel_1.Conversations.getArchives(session.email, chatPermissions.canView, data.filters, session.nsp, data.chunk)];
            case 2:
                archives = _a.sent();
                res.send({ status: 'ok', archives: archives, ended: (archives && archives.length < 20) ? true : false });
                return [3 /*break*/, 4];
            case 3:
                res.send({ status: 'error' });
                _a.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                err_3 = _a.sent();
                console.log(err_3);
                console.log('Error in get more archives');
                res.status(401).send("Invalid Request!");
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
router.post('/getMoreinboxChats', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, session, conversations, _i, conversations_2, conversation, temp_2, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
                data = req.body;
                if (!data.email || !data.nsp)
                    res.status(401).send("Invalid Request!");
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetSessionByEmailFromDatabase(data.email, data.nsp)];
            case 1:
                session = _a.sent();
                return [4 /*yield*/, conversationModel_1.Conversations.getConversations(data.email, 'self', data.nsp, (session) ? session.permissions.agents.canAccessBotChats : false, data.chunk)];
            case 2:
                conversations = _a.sent();
                _i = 0, conversations_2 = conversations;
                _a.label = 3;
            case 3:
                if (!(_i < conversations_2.length)) return [3 /*break*/, 6];
                conversation = conversations_2[_i];
                return [4 /*yield*/, conversationModel_1.Conversations.getMessages(conversation._id)];
            case 4:
                temp_2 = _a.sent();
                conversation.messages = (temp_2.length) ? temp_2 : [];
                _a.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 3];
            case 6:
                res.send({ status: 'ok', conversations: conversations, ended: (conversations && conversations.length < 20) ? true : false });
                return [3 /*break*/, 8];
            case 7:
                err_4 = _a.sent();
                console.log(err_4);
                console.log('Error in get more inbox chats');
                res.status(401).send("Invalid Request!");
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); });
router.post('/getArchiveMessages', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, messages, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                data = req.body;
                if (!data.cid)
                    res.status(401).send("Invalid Request!");
                return [4 /*yield*/, conversationModel_1.Conversations.getArchiveMessages(data.cid)];
            case 1:
                messages = _a.sent();
                res.send({ status: 'ok', messages: messages, ended: (messages && messages.length < 20) ? true : false });
                return [3 /*break*/, 3];
            case 2:
                err_5 = _a.sent();
                console.log(err_5);
                console.log('Error in get archive messages');
                res.status(401).send("Invalid Request!");
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/getMoreArchiveMessages', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, messages, err_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                data = req.body;
                if (!data.cid)
                    res.status(401).send("Invalid Request!");
                return [4 /*yield*/, conversationModel_1.Conversations.getArchiveMessages(data.cid, data.lastMessage)];
            case 1:
                messages = _a.sent();
                res.send({ status: 'ok', messages: messages, ended: (messages && messages.length < 20) ? true : false });
                return [3 /*break*/, 3];
            case 2:
                err_6 = _a.sent();
                console.log(err_6);
                console.log('Error in get more archive messages');
                res.status(401).send("Invalid Request!");
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/chatTagsList', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, tags, err_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                data = req.body;
                if (!data.nsp)
                    res.status(401).send("Invalid Request!");
                return [4 /*yield*/, companyModel_1.Company.GetTags(data.nsp)];
            case 1:
                tags = _a.sent();
                if (tags && tags.length)
                    res.send({ status: 'ok', tags: (tags.length && tags[0].settings.chatSettings.tagList && tags[0].settings.chatSettings.tagList.length) ? tags[0].settings.chatSettings.tagList : [] });
                else
                    res.send({ status: 'notag', tags: [] });
                return [3 /*break*/, 3];
            case 2:
                err_7 = _a.sent();
                console.log(err_7);
                console.log('Error in chat tags list');
                res.status(401).send("Invalid Request!");
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/selectedConversationDetails', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, session, msgs, err_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                data = req.body;
                if (!data.cid || !data.sessionId)
                    res.status(401).send("Invalid Request!");
                session = void 0;
                if (!req.body.sessionId) return [3 /*break*/, 2];
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetAgentByID(data.sessionId)];
            case 1:
                session = _a.sent();
                _a.label = 2;
            case 2:
                ;
                if (!session) return [3 /*break*/, 4];
                return [4 /*yield*/, conversationModel_1.Conversations.getMessagesByCid(data.cid)];
            case 3:
                msgs = _a.sent();
                res.send({ status: 'ok', msgList: msgs });
                return [3 /*break*/, 5];
            case 4:
                res.status(401).send("Invalid Request!");
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                err_8 = _a.sent();
                console.log(err_8);
                console.log('Error in selected conversation details');
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
/* #endregion */
/* #region  Agents */
router.post('/getLiveAgents', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, liveAgents, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                data = req.body;
                if (!!data.nsp) return [3 /*break*/, 1];
                res.status(401).send("Invalid Request!");
                return [3 /*break*/, 3];
            case 1: return [4 /*yield*/, sessionsManager_1.SessionManager.getAllLiveAgents(data.nsp, (data.csid && data.csid.length) ? data.csid : [])];
            case 2:
                liveAgents = _a.sent();
                if (liveAgents && liveAgents.length) {
                    res.send((liveAgents && liveAgents.length) ? liveAgents : []);
                }
                else
                    res.send([]);
                _a.label = 3;
            case 3: return [3 /*break*/, 5];
            case 4:
                error_1 = _a.sent();
                console.log(error_1);
                console.log('Error in get live agents');
                res.status(401).send("Invalid Request!");
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
/* #endregion */
/* #region  CRM */
router.post('/customerConversationsList', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, session, conversations, err_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
                data = req.body;
                if (!(!data.deviceID || !data.sessionId)) return [3 /*break*/, 1];
                res.status(401).send("Invalid Request!");
                return [3 /*break*/, 6];
            case 1:
                session = void 0;
                if (!req.body.sessionId) return [3 /*break*/, 3];
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetAgentByID(data.sessionId)];
            case 2:
                session = _a.sent();
                _a.label = 3;
            case 3:
                if (!session) return [3 /*break*/, 5];
                conversations = void 0;
                return [4 /*yield*/, conversationModel_1.Conversations.getCustomerConversations(data.deviceID, data.nsp)];
            case 4:
                conversations = _a.sent();
                res.send({ status: 'ok', conversations: (conversations && conversations.length) ? conversations : [] });
                return [3 /*break*/, 6];
            case 5:
                res.status(401).send("Unauthorized!");
                _a.label = 6;
            case 6: return [3 /*break*/, 8];
            case 7:
                err_9 = _a.sent();
                res.status(401).send("Invalid Request!");
                console.log(err_9);
                console.log('Error in getting customer conversations list');
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); });
//only agent side call
router.post('/moreCustomerConversationsList', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, session, conversations, chatsCheck, noMoreChats, err_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 8, , 9]);
                data = req.body;
                if (!data.deviceID || !data.sessionId)
                    res.status(401).send("Invalid Request!");
                session = void 0;
                if (!req.body.sessionId) return [3 /*break*/, 2];
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetAgentByID(data.sessionId)];
            case 1:
                session = _a.sent();
                _a.label = 2;
            case 2:
                ;
                if (!session) return [3 /*break*/, 6];
                return [4 /*yield*/, conversationModel_1.Conversations.getMoreConversationsByDeviceID(data.deviceID, data.id, session.nsp)];
            case 3:
                conversations = _a.sent();
                chatsCheck = void 0;
                if (!(conversations && conversations.length > 0)) return [3 /*break*/, 5];
                return [4 /*yield*/, conversationModel_1.Conversations.getMoreConversationsByDeviceID(data.deviceID, conversations[conversations.length - 1]._id, session.nsp)];
            case 4:
                chatsCheck = _a.sent();
                _a.label = 5;
            case 5:
                noMoreChats = void 0;
                if (chatsCheck && chatsCheck.length)
                    noMoreChats = false;
                else
                    noMoreChats = true;
                res.send({ status: 'ok', conversations: conversations, noMoreChats: noMoreChats });
                return [3 /*break*/, 7];
            case 6:
                res.status(401).send("Unauthorized!");
                _a.label = 7;
            case 7: return [3 /*break*/, 9];
            case 8:
                err_10 = _a.sent();
                res.status(401).send("Invalid Request!");
                console.log(err_10);
                console.log('Error in getting more customer conversations list');
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); });
router.post('/changeState', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, session, prevState, _a, UpdatedSessions, allocatedAgent, cid, companySettings, greetingMessage, _b, conversation, lastMessage, messageinsertedID, payload, newSession, logEvent, payload, event, _c, _d, _e, error_2;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _f.trys.push([0, 46, , 47]);
                if (!!req.body._id) return [3 /*break*/, 1];
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 45];
            case 1:
                if (req.headers.origin) {
                    res.header("Access-Control-Allow-Origin", req.headers.origin);
                    res.header("Access-Control-Allow-Headers", "content-type");
                    res.header('Access-Control-Allow-Methods', 'GET');
                    res.header('Access-Control-Allow-Credentials', 'true');
                    res.header('Vary', 'Origin, Access-Control-Request-Headers');
                }
                id = req.body._id;
                return [4 /*yield*/, CheckActive_1.MakeActive({ _id: req.body._id, id: id })];
            case 2:
                session = _f.sent();
                if (!session) return [3 /*break*/, 44];
                prevState = session.state;
                if (!(req.body.state == 3 && session)) return [3 /*break*/, 11];
                _a = session.state;
                switch (_a) {
                    case 3: return [3 /*break*/, 3];
                    case 4: return [3 /*break*/, 5];
                    case 5: return [3 /*break*/, 7];
                }
                return [3 /*break*/, 9];
            case 3: return [4 /*yield*/, CheckActive_1.MakeActive({ _id: session._id, id: session._id }, { inviteAccepted: true })];
            case 4:
                session = _f.sent();
                return [3 /*break*/, 11];
            case 5: return [4 /*yield*/, CheckActive_1.MakeActive({ _id: session._id, id: session._id }, { inviteAccepted: true })];
            case 6:
                session = _f.sent();
                return [3 /*break*/, 11];
            case 7: return [4 /*yield*/, CheckActive_1.MakeActive({ _id: session._id, id: session._id }, { inviteAccepted: true, inactive: false })];
            case 8:
                session = _f.sent();
                return [3 /*break*/, 11];
            case 9: return [4 /*yield*/, CheckActive_1.MakeActive({ _id: session._id, id: session._id })];
            case 10:
                session = _f.sent();
                return [3 /*break*/, 11];
            case 11:
                if (!(session && (session.state == 3 || session.state == 4 || session.state == 5))) return [3 /*break*/, 42];
                UpdatedSessions = void 0;
                allocatedAgent = void 0;
                cid = new mongodb_1.ObjectID();
                return [4 /*yield*/, companyModel_1.Company.GetChatSettings(session.nsp)];
            case 12:
                companySettings = _f.sent();
                greetingMessage = companySettings['settings']['chatSettings']['greetingMessage'];
                _b = session.state;
                switch (_b) {
                    case 5: return [3 /*break*/, 13];
                    case 4: return [3 /*break*/, 31];
                    case 3: return [3 /*break*/, 40];
                }
                return [3 /*break*/, 41];
            case 13:
                if (!!session.conversationID) return [3 /*break*/, 30];
                if (!companySettings['settings']['chatSettings']['assignments'].priorityAgent.trim()) return [3 /*break*/, 15];
                return [4 /*yield*/, sessionsManager_1.SessionManager.AllocateAgentPriority(session, companySettings['settings']['chatSettings']['assignments'].priorityAgent.trim(), cid)];
            case 14:
                UpdatedSessions = _f.sent();
                return [3 /*break*/, 17];
            case 15: return [4 /*yield*/, sessionsManager_1.SessionManager.AllocateAgent(session, cid)];
            case 16:
                UpdatedSessions = _f.sent();
                _f.label = 17;
            case 17:
                if (!UpdatedSessions) return [3 /*break*/, 30];
                allocatedAgent = (UpdatedSessions.agent) ? UpdatedSessions.agent : '';
                session = (UpdatedSessions.visitor) ? UpdatedSessions.visitor : session;
                if (!session) return [3 /*break*/, 30];
                return [4 /*yield*/, conversationModel_1.Conversations.createConversation(cid, session.email, session.id, session.nsp, session.viewColor, (allocatedAgent) ? allocatedAgent.email : '', session.username, (allocatedAgent) ? 2 : 1, session.deviceID)];
            case 18:
                conversation = _f.sent();
                if (allocatedAgent && allocatedAgent.greetingMessage)
                    greetingMessage = allocatedAgent.greetingMessage;
                lastMessage = void 0;
                if (!greetingMessage) return [3 /*break*/, 23];
                lastMessage = {
                    from: session.nsp.substr(1),
                    to: session.username,
                    body: greetingMessage,
                    cid: (conversation && conversation.insertedId) ? conversation.insertedId.toHexString() : '',
                    date: (new Date()).toISOString(),
                    type: 'Agents',
                    attachment: false
                };
                if (!(conversation && conversation.insertedCount)) return [3 /*break*/, 23];
                if (!(session.url && session.url.length)) return [3 /*break*/, 20];
                return [4 /*yield*/, sessionsManager_1.SessionManager.UpdateChatInitiatedDetails(session._id || session.id, session.url[session.url.length - 1], 'Visitor', ((session.state == 4) || (session.state == 5)) ? true : false)];
            case 19:
                _f.sent();
                _f.label = 20;
            case 20: return [4 /*yield*/, conversationModel_1.Conversations.insertMessage(lastMessage)];
            case 21:
                messageinsertedID = _f.sent();
                conversation.ops[0].messages.push(messageinsertedID.ops[0]);
                return [4 /*yield*/, conversationModel_1.Conversations.UpdateLastMessage(conversation.insertedId.toHexString(), lastMessage)];
            case 22:
                _f.sent();
                _f.label = 23;
            case 23:
                if (!(allocatedAgent && conversation)) return [3 /*break*/, 25];
                // origin.to((allocatedAgent.id as string)).emit('newConversation', conversation.ops[0]);
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'newConversation', nsp: session.nsp, roomName: [agentModel_1.Agents.NotifyOne(session)], data: conversation.ops[0] })];
            case 24:
                // origin.to((allocatedAgent.id as string)).emit('newConversation', conversation.ops[0]);
                _f.sent();
                _f.label = 25;
            case 25:
                payload = { id: session._id, session: session };
                // origin.in(Agents.NotifyAll()).emit('updateUser', payload);
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: session.nsp, roomName: [agentModel_1.Agents.NotifyAll()], data: payload })];
            case 26:
                // origin.in(Agents.NotifyAll()).emit('updateUser', payload);
                _f.sent();
                newSession = {
                    clientID: (conversation.ops[0].clientID) ? conversation.ops[0].clientID : '',
                    agent: (allocatedAgent) ? session.agent : undefined,
                    cid: session.conversationID,
                    state: session.state,
                    username: session.username,
                    email: session.email,
                    phone: (session.phone ? session.phone : ''),
                    message: (session.message) ? session.message : ''
                };
                res.send({
                    status: 'ok',
                    session: newSession
                });
                delete newSession.greetingMessage;
                if (!conversation) return [3 /*break*/, 28];
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'V', broadcast: true, eventName: 'gotAgent', nsp: session.nsp, roomName: [visitorModel_1.Visitor.NotifyOne(session)], data: newSession })];
            case 27:
                _f.sent();
                _f.label = 28;
            case 28: return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendEventLog(enums_1.EventLogMessages.CHAT_INITIATED, (session._id) ? session._id : session.id)];
            case 29:
                logEvent = _f.sent();
                _f.label = 30;
            case 30: return [2 /*return*/];
            case 31: return [4 /*yield*/, sessionsManager_1.SessionManager.UpdateState(session._id || session.id, parseInt(req.body.state), true)];
            case 32:
                session = _f.sent();
                if (!session) return [3 /*break*/, 38];
                res.send({ status: 'ok', session: session });
                if (!!session.inactive) return [3 /*break*/, 37];
                payload = { id: session._id, session: session };
                event = enums_1.ComposedENUM(enums_1.DynamicEventLogs.VISITOR_STATE_CHANGED, { newEmail: '', oldEmail: '', oldstate: Utils_1.Utils.GetStateKey(prevState), newstate: Utils_1.Utils.GetStateKey(req.body.state) });
                _d = (_c = Promise).all;
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: session.nsp, roomName: [agentModel_1.Agents.NotifyAll()], data: payload })];
            case 33:
                _e = [
                    _f.sent()
                ];
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'V', broadcast: false, eventName: 'userUpdated', nsp: session.nsp, roomName: [visitorModel_1.Visitor.NotifyOne(session)], data: payload })];
            case 34:
                _e = _e.concat([
                    _f.sent()
                ]);
                return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendEventLog(event, (session._id) ? session._id : session.id)];
            case 35: return [4 /*yield*/, _d.apply(_c, [_e.concat([
                        _f.sent()
                    ])])];
            case 36:
                _f.sent();
                _f.label = 37;
            case 37: return [2 /*return*/];
            case 38:
                res.status(200).send({ status: 'ok', session: session, msg: 're-activating when action made' });
                _f.label = 39;
            case 39: return [2 /*return*/];
            case 40:
                res.send({ status: 'ok', session: session });
                return [2 /*return*/];
            case 41: return [3 /*break*/, 43];
            case 42:
                res.status(401).send({ status: 'error' });
                _f.label = 43;
            case 43: return [3 /*break*/, 45];
            case 44:
                res.status(401).send({ status: 'error' });
                _f.label = 45;
            case 45: return [3 /*break*/, 47];
            case 46:
                error_2 = _f.sent();
                console.log(error_2);
                console.log('Error in Change State');
                res.status(401).send({ status: 'error' });
                return [3 /*break*/, 47];
            case 47: return [2 /*return*/];
        }
    });
}); });
router.post('/disconnectEventFromClient', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, visitor_1, insertedMessage_1, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
                if (!!req.body._id) return [3 /*break*/, 1];
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 6];
            case 1:
                if (req.headers.origin) {
                    res.header("Access-Control-Allow-Origin", req.headers.origin);
                    res.header("Access-Control-Allow-Headers", "content-type");
                    res.header('Access-Control-Allow-Methods', 'GET');
                    res.header('Access-Control-Allow-Credentials', 'true');
                    res.header('Vary', 'Origin, Access-Control-Request-Headers');
                }
                id = req.body._id;
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetVisitorByID(id)];
            case 2:
                visitor_1 = (_a.sent());
                if (!visitor_1) return [3 /*break*/, 5];
                if (!(visitor_1 && req.body)) return [3 /*break*/, 4];
                return [4 /*yield*/, CreateMessage_1.CreateLogMessage({
                        from: visitor_1.agent.name,
                        to: (visitor_1.username) ? visitor_1.agent.name || visitor_1.agent.nickname : '',
                        body: req.body.msg,
                        type: 'Events',
                        cid: (visitor_1.conversationID) ? visitor_1.conversationID : '',
                        attachment: false,
                        date: new Date().toISOString(),
                        delivered: true,
                        sent: true
                    })];
            case 3:
                insertedMessage_1 = _a.sent();
                if (insertedMessage_1) {
                    setTimeout(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!visitor_1) return [3 /*break*/, 2];
                                    return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'privateMessage', nsp: visitor_1.nsp, roomName: [agentModel_1.Agents.NotifyOne(visitor_1)], data: insertedMessage_1 })];
                                case 1:
                                    _a.sent();
                                    _a.label = 2;
                                case 2: return [2 /*return*/];
                            }
                        });
                    }); }, 0);
                    res.send({ status: 'ok', msg: insertedMessage_1 });
                }
                else
                    res.status(401).send({ status: 'error' });
                _a.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                res.status(401).send({ status: 'error' });
                _a.label = 6;
            case 6: return [3 /*break*/, 8];
            case 7:
                error_3 = _a.sent();
                res.status(401).send({ status: 'error' });
                console.log('Error in Inserting Disconnecting Message');
                console.log(error_3);
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); });
router.post('/privateMessageRecieved', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data_1, session, conversation, updatedList, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 15, , 16]);
                if (!(!req.body.cid || !req.body.sessionid)) return [3 /*break*/, 1];
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 14];
            case 1:
                if (req.headers.origin) {
                    res.header("Access-Control-Allow-Origin", req.headers.origin);
                    res.header("Access-Control-Allow-Headers", "content-type");
                    res.header('Access-Control-Allow-Methods', 'GET');
                    res.header('Access-Control-Allow-Credentials', 'true');
                    res.header('Vary', 'Origin, Access-Control-Request-Headers');
                }
                data_1 = req.body;
                if (!(data_1 && data_1.cid && data_1.sessionid)) return [3 /*break*/, 13];
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetVisitorByID(data_1.sessionid)];
            case 2:
                session = _a.sent();
                if (!session) return [3 /*break*/, 11];
                // let socketServer = SocketListener.getSocketServer();
                // let origin = socketServer.of(session.nsp);
                return [4 /*yield*/, conversationModel_1.Conversations.updateMessageReadCount(data_1.cid, true)];
            case 3:
                // let socketServer = SocketListener.getSocketServer();
                // let origin = socketServer.of(session.nsp);
                _a.sent();
                return [4 /*yield*/, conversationModel_1.Conversations.getMessagesByCid(data_1.cid)];
            case 4:
                conversation = _a.sent();
                if (!(conversation && conversation.length)) return [3 /*break*/, 6];
                updatedList = conversation.map(function (msg, index) { return __awaiter(void 0, void 0, void 0, function () {
                    var updatedMessage;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!(msg.type == data_1.type && !msg.sent)) return [3 /*break*/, 2];
                                return [4 /*yield*/, conversationModel_1.Conversations.updateSentStatus(msg._id)];
                            case 1:
                                updatedMessage = _a.sent();
                                _a.label = 2;
                            case 2: return [2 /*return*/];
                        }
                    });
                }); });
                return [4 /*yield*/, Promise.all(updatedList)];
            case 5:
                _a.sent();
                _a.label = 6;
            case 6:
                if (!(session && data_1.type == 'Visitors')) return [3 /*break*/, 8];
                // origin.to(Visitor.NotifyOne(session)).emit('privateMessageSent', data);
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'V', broadcast: false, eventName: 'privateMessageSent', nsp: session.nsp, roomName: [visitorModel_1.Visitor.NotifyOne(session)], data: data_1 })];
            case 7:
                // origin.to(Visitor.NotifyOne(session)).emit('privateMessageSent', data);
                _a.sent();
                return [3 /*break*/, 10];
            case 8:
                if (!(session && session.agent)) return [3 /*break*/, 10];
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'privateMessageSent', nsp: session.nsp, roomName: [agentModel_1.Agents.NotifyOne(session)], data: data_1 })];
            case 9:
                _a.sent();
                _a.label = 10;
            case 10:
                res.send({ status: 'ok' });
                return [3 /*break*/, 12];
            case 11:
                res.status(401).send({ error: 'error' });
                _a.label = 12;
            case 12: return [3 /*break*/, 14];
            case 13:
                res.status(401).send({ error: 'error' });
                _a.label = 14;
            case 14: return [3 /*break*/, 16];
            case 15:
                error_4 = _a.sent();
                console.log('Error in Sending Message Sent Status');
                console.log(error_4);
                return [3 /*break*/, 16];
            case 16: return [2 /*return*/];
        }
    });
}); });
router.post('/initiateChatForBot', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, session, message, companySettings, cid, conversation, botMessage, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 22, , 23]);
                if (!(!req.body.state || !req.body._id)) return [3 /*break*/, 1];
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 21];
            case 1:
                if (req.headers.origin) {
                    res.header("Access-Control-Allow-Origin", req.headers.origin);
                    res.header("Access-Control-Allow-Headers", "content-type");
                    res.header('Access-Control-Allow-Methods', 'GET');
                    res.header('Access-Control-Allow-Credentials', 'true');
                    res.header('Vary', 'Origin, Access-Control-Request-Headers');
                }
                id = req.body._id;
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetVisitorByID(id)];
            case 2:
                session = _a.sent();
                if (!session) return [3 /*break*/, 20];
                if (!(req.body && (req.body.state == 1) || (req.body.state == 8))) return [3 /*break*/, 18];
                message = void 0;
                return [4 /*yield*/, companyModel_1.Company.GetChatSettings(session.nsp)];
            case 3:
                companySettings = _a.sent();
                cid = new mongodb_1.ObjectID();
                return [4 /*yield*/, conversationModel_1.Conversations.createConversation(cid, session.email, session.id, session.nsp, session.viewColor, 'chatBot', session.username, 5, session.deviceID)];
            case 4:
                conversation = _a.sent();
                if (!(conversation && conversation.insertedCount)) return [3 /*break*/, 16];
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'newConversation', nsp: session.nsp, roomName: ['Admins'], data: conversation.ops[0] })];
            case 5:
                _a.sent();
                session.conversationID = (conversation && conversation.insertedCount) ? conversation.ops[0]._id : '';
                return [4 /*yield*/, sessionsManager_1.SessionManager.UpdateSession(session.id || session._id, session, 8, session.state)];
            case 6:
                _a.sent();
                if (!companySettings['settings'].chatSettings.botGreetingMessage) return [3 /*break*/, 14];
                return [4 /*yield*/, CreateMessage_1.GetChatBotReplyMessage(companySettings['settings'].chatSettings.botGreetingMessage, session, false)];
            case 7:
                message = _a.sent();
                return [4 /*yield*/, conversationModel_1.Conversations.insertMessage(message)];
            case 8:
                botMessage = _a.sent();
                if (!(botMessage && botMessage.insertedCount)) return [3 /*break*/, 13];
                return [4 /*yield*/, conversationModel_1.Conversations.UpdateLastMessage(session.conversationID, botMessage.ops[0])];
            case 9:
                _a.sent();
                if (!req.body.socketID) return [3 /*break*/, 11];
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'V', broadcast: true, eventName: 'privateMessage', nsp: session.nsp, roomName: [id], data: botMessage.ops[0], excludeSender: (req.body.socketID) ? true : false, sockID: (req.body.socketID) ? req.body.socketID : '' })];
            case 10:
                _a.sent();
                _a.label = 11;
            case 11:
                res.send({ botGreetingMessage: (botMessage && botMessage.insertedCount) ? botMessage.ops[0] : '', session: { clientID: conversation.ops[0].clientID, cid: conversation.ops[0]._id } });
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'privateMessage', nsp: session.nsp, roomName: ['Admins'], data: botMessage.ops[0] })];
            case 12:
                _a.sent();
                _a.label = 13;
            case 13: return [3 /*break*/, 15];
            case 14:
                res.send({ botGreetingMessage: '', session: { clientID: conversation.ops[0].clientID, cid: conversation.ops[0]._id } });
                _a.label = 15;
            case 15: return [3 /*break*/, 17];
            case 16:
                res.status(401).send({ error: 'error' });
                _a.label = 17;
            case 17: return [3 /*break*/, 19];
            case 18:
                res.send({ botGreetingMessage: [], session: session });
                _a.label = 19;
            case 19: return [3 /*break*/, 21];
            case 20:
                res.status(401).send({ error: 'error' });
                _a.label = 21;
            case 21: return [3 /*break*/, 23];
            case 22:
                error_5 = _a.sent();
                console.log(error_5);
                console.log('error is getting bot Greeting Message');
                res.status(401).send({ error: 'error' });
                return [3 /*break*/, 23];
            case 23: return [2 /*return*/];
        }
    });
}); });
router.post('/typing', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, data, session, _a, error_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 11, , 12]);
                if (!!req.body.sessionid) return [3 /*break*/, 1];
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 10];
            case 1:
                if (req.headers.origin) {
                    res.header("Access-Control-Allow-Origin", req.headers.origin);
                    res.header("Access-Control-Allow-Headers", "content-type");
                    res.header('Access-Control-Allow-Methods', 'GET');
                    res.header('Access-Control-Allow-Credentials', 'true');
                    res.header('Vary', 'Origin, Access-Control-Request-Headers');
                }
                id = req.body.sessionid;
                data = req.body;
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetVisitorByID(id)];
            case 2:
                session = _b.sent();
                if (!session) return [3 /*break*/, 9];
                _a = data.type;
                switch (_a) {
                    case 'Visitors': return [3 /*break*/, 3];
                }
                return [3 /*break*/, 6];
            case 3:
                session.typingState = req.body.state;
                return [4 /*yield*/, sessionsManager_1.SessionManager.UpdateSession(id, session)];
            case 4:
                _b.sent();
                // origin.to(Agents.NotifyOne(session)).emit('typingState', { state: req.body.state, sid: session.id })
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'typingState', nsp: session.nsp, roomName: [agentModel_1.Agents.NotifyOne(session)], data: { state: req.body.state, sid: session.id } })];
            case 5:
                // origin.to(Agents.NotifyOne(session)).emit('typingState', { state: req.body.state, sid: session.id })
                _b.sent();
                return [3 /*break*/, 8];
            case 6: 
            // socket.to(Visitor.NotifyOne(visitorSession)).emit('typingState', { state: data.state, sid: visitorSession.id })
            return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'typingState', nsp: session.nsp, roomName: [visitorModel_1.Visitor.NotifyOne(session)], data: { state: data.state, sid: session.id } })];
            case 7:
                // socket.to(Visitor.NotifyOne(visitorSession)).emit('typingState', { state: data.state, sid: visitorSession.id })
                _b.sent();
                return [3 /*break*/, 8];
            case 8:
                res.send({});
                return [3 /*break*/, 10];
            case 9:
                res.status(401).send({ error: 'error' });
                _b.label = 10;
            case 10: return [3 /*break*/, 12];
            case 11:
                error_6 = _b.sent();
                console.log(error_6);
                console.log('error in SneakPeak Typing Event');
                res.status(401).send({ error: 'error' });
                return [3 /*break*/, 12];
            case 12: return [2 /*return*/];
        }
    });
}); });
router.post('/updateAdditionalDataInfo', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, data, session, payload, loggedEvent, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 8, , 9]);
                if (!(!req.body.sessionID || !req.body.data)) return [3 /*break*/, 1];
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 7];
            case 1:
                if (req.headers.origin) {
                    res.header("Access-Control-Allow-Origin", req.headers.origin);
                    res.header("Access-Control-Allow-Headers", "content-type");
                    res.header('Access-Control-Allow-Methods', 'GET');
                    res.header('Access-Control-Allow-Credentials', 'true');
                    res.header('Vary', 'Origin, Access-Control-Request-Headers');
                }
                id = req.body.sessionID;
                data = req.body.data;
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetVisitorByID(id)];
            case 2:
                session = _a.sent();
                if (!data) return [3 /*break*/, 6];
                return [4 /*yield*/, sessionsManager_1.SessionManager.SetAdditionalData(data, session.id || session._id)];
            case 3:
                _a.sent();
                res.send({ status: 'AdditionalDataUpdated', state: session.state });
                payload = { id: session.id, session: session };
                // origin.in(Agents.NotifyAll()).emit('updateUser', payload);
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: session.nsp, roomName: [agentModel_1.Agents.NotifyAll()], data: payload })];
            case 4:
                // origin.in(Agents.NotifyAll()).emit('updateUser', payload);
                _a.sent();
                return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendEventLog(enums_1.EventLogMessages.GOT_ADDITIONAL_DATA, (session._id) ? session._id : session.id)];
            case 5:
                loggedEvent = _a.sent();
                return [3 /*break*/, 7];
            case 6:
                res.status(401).send({ status: 'error' });
                _a.label = 7;
            case 7: return [3 /*break*/, 9];
            case 8:
                error_7 = _a.sent();
                console.log(error_7);
                console.log('error is Updating Additional Data Info');
                res.status(401).send({ error: 'error' });
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); });
router.post('/updateRequestedCarInfo', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, data, session, payload, loggedEvent, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 8, , 9]);
                if (!(!req.body.sessionID || !req.body.data)) return [3 /*break*/, 1];
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 7];
            case 1:
                if (req.headers.origin) {
                    res.header("Access-Control-Allow-Origin", req.headers.origin);
                    res.header("Access-Control-Allow-Headers", "content-type");
                    res.header('Access-Control-Allow-Methods', 'GET');
                    res.header('Access-Control-Allow-Credentials', 'true');
                    res.header('Vary', 'Origin, Access-Control-Request-Headers');
                }
                id = req.body.sessionID;
                data = req.body.data;
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetVisitorByID(id)];
            case 2:
                session = _a.sent();
                if (!data) return [3 /*break*/, 6];
                return [4 /*yield*/, sessionsManager_1.SessionManager.SetRequestedCarData(data, session.id || session._id)];
            case 3:
                _a.sent();
                res.send({ status: 'CarRequestedDataUpdated', state: session.state });
                payload = { id: session.id, session: session };
                // origin.in(Agents.NotifyAll()).emit('updateUser', payload);
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: session.nsp, roomName: [agentModel_1.Agents.NotifyAll()], data: payload })];
            case 4:
                // origin.in(Agents.NotifyAll()).emit('updateUser', payload);
                _a.sent();
                return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendEventLog(enums_1.EventLogMessages.GOT_REQUEST_CAR_DATA, (session._id) ? session._id : session.id)];
            case 5:
                loggedEvent = _a.sent();
                return [3 /*break*/, 7];
            case 6:
                res.status(401).send({ status: 'error' });
                _a.label = 7;
            case 7: return [3 /*break*/, 9];
            case 8:
                error_8 = _a.sent();
                console.log(error_8);
                console.log('error is Updating  Requested Car Data Info');
                res.status(401).send({ error: 'error' });
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); });
router.post('/visitorSneakPeak', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, session, error_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                if (!!req.body._id) return [3 /*break*/, 1];
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 5];
            case 1:
                if (req.headers.origin) {
                    res.header("Access-Control-Allow-Origin", req.headers.origin);
                    res.header("Access-Control-Allow-Headers", "content-type");
                    res.header('Access-Control-Allow-Methods', 'GET');
                    res.header('Access-Control-Allow-Credentials', 'true');
                    res.header('Vary', 'Origin, Access-Control-Request-Headers');
                }
                id = req.body._id;
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetVisitorByID(id)];
            case 2:
                session = _a.sent();
                if (!session) return [3 /*break*/, 4];
                // origin.to(Agents.NotifyOne(session)).emit('visitorSneakPeak', { msg: req.body.msg, sid: session.id })
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'visitorSneakPeak', nsp: session.nsp, roomName: [agentModel_1.Agents.NotifyOne(session)], data: { msg: req.body.msg, sid: session.id } })];
            case 3:
                // origin.to(Agents.NotifyOne(session)).emit('visitorSneakPeak', { msg: req.body.msg, sid: session.id })
                _a.sent();
                _a.label = 4;
            case 4:
                res.send({});
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                error_9 = _a.sent();
                console.log(error_9);
                console.log('error in SneakPeak Typing Event');
                res.status(401).send({ error: 'error' });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
router.post('/getConversationClientID', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, id, session, conversation, error_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                if (!(!req.body.cid || !req.body._id)) return [3 /*break*/, 1];
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 5];
            case 1:
                if (req.headers.origin) {
                    res.header("Access-Control-Allow-Origin", req.headers.origin);
                    res.header("Access-Control-Allow-Headers", "content-type");
                    res.header('Access-Control-Allow-Methods', 'GET');
                    res.header('Access-Control-Allow-Credentials', 'true');
                    res.header('Vary', 'Origin, Access-Control-Request-Headers');
                }
                data = req.body;
                id = req.body._id;
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetVisitorByID(id)];
            case 2:
                session = _a.sent();
                if (!session) return [3 /*break*/, 4];
                return [4 /*yield*/, conversationModel_1.Conversations.GetClientIDByConversationID(data.cid, session.nsp)];
            case 3:
                conversation = _a.sent();
                if (conversation && conversation.length)
                    res.send({ clientID: conversation[0].clientID });
                else
                    res.send({});
                return [3 /*break*/, 5];
            case 4:
                res.status(401).send({ error: 'error' });
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                error_10 = _a.sent();
                console.log(error_10);
                console.log('error is getting client ID of conversation');
                res.status(401).send({ error: 'error' });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
router.post('/getCustomFeedback', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, id, session, conversation, error_11;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                if (!!req.body.cid) return [3 /*break*/, 1];
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 5];
            case 1:
                if (req.headers.origin) {
                    res.header("Access-Control-Allow-Origin", req.headers.origin);
                    res.header("Access-Control-Allow-Headers", "content-type");
                    res.header('Access-Control-Allow-Methods', 'GET');
                    res.header('Access-Control-Allow-Credentials', 'true');
                    res.header('Vary', 'Origin, Access-Control-Request-Headers');
                }
                data = req.body;
                id = req.body._id;
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetVisitorByID(id)];
            case 2:
                session = _a.sent();
                if (!session) return [3 /*break*/, 4];
                return [4 /*yield*/, conversationModel_1.Conversations.GetCustomFeedbackByConversationID(data.cid, session.nsp)];
            case 3:
                conversation = _a.sent();
                if (conversation && conversation.length)
                    res.send({ customfeedback: (conversation[0].visitorCustomFields) ? conversation[0].visitorCustomFields : {} });
                else
                    res.send({});
                return [3 /*break*/, 5];
            case 4:
                res.status(401).send({ error: 'error' });
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                error_11 = _a.sent();
                console.log(error_11);
                console.log('error is getting client ID of conversation');
                res.status(401).send({ error: 'error' });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
router.post('/getMessages', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, sessionID, session, msgs, msgs, error_12;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 9, , 10]);
                if (!!req.body.sessionID) return [3 /*break*/, 1];
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 8];
            case 1:
                if (req.headers.origin) {
                    res.header("Access-Control-Allow-Origin", req.headers.origin);
                    res.header("Access-Control-Allow-Headers", "content-type");
                    res.header('Access-Control-Allow-Methods', 'GET');
                    res.header('Access-Control-Allow-Credentials', 'true');
                    res.header('Vary', 'Origin, Access-Control-Request-Headers');
                }
                data = req.body;
                sessionID = req.body.sessionID;
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetVisitorByID(sessionID)];
            case 2:
                session = _a.sent();
                if (!session) return [3 /*break*/, 7];
                if (!session.isMobile) return [3 /*break*/, 4];
                if (!data.cid) {
                    res.send({});
                    return [2 /*return*/];
                }
                return [4 /*yield*/, conversationModel_1.Conversations.getMessagesByCid(data.cid)];
            case 3:
                msgs = _a.sent();
                res.send(msgs);
                return [3 /*break*/, 6];
            case 4:
                if (!data.lasttouchedTime || !data.cid) {
                    res.send([]);
                    return [2 /*return*/];
                }
                return [4 /*yield*/, conversationModel_1.Conversations.getMessagesByTime(data.cid, data.lasttouchedTime, (data._id) ? data._id : '')];
            case 5:
                msgs = _a.sent();
                if (msgs)
                    res.send((msgs && msgs.length) ? msgs : []);
                _a.label = 6;
            case 6: return [3 /*break*/, 8];
            case 7:
                res.status(401).send({ error: 'error' });
                _a.label = 8;
            case 8: return [3 /*break*/, 10];
            case 9:
                error_12 = _a.sent();
                console.log(error_12);
                console.log('error is getting conversation Messages');
                res.status(401).send({ error: 'error' });
                return [3 /*break*/, 10];
            case 10: return [2 /*return*/];
        }
    });
}); });
//for visitor
router.post('/getMoreRecentChats', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, sessionID, session, chats, _a, chatsCheck, noMoreChats, error_13;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 11, , 12]);
                if (!!req.body.sessionid) return [3 /*break*/, 1];
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 10];
            case 1:
                data = req.body;
                sessionID = req.body.sessionid;
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetVisitorByID(sessionID)];
            case 2:
                session = _b.sent();
                data.deviceID = (session && session.deviceID) ? session.deviceID : '';
                if (!(session && data && data.deviceID)) return [3 /*break*/, 9];
                if (!(data._id)) return [3 /*break*/, 4];
                return [4 /*yield*/, conversationModel_1.Conversations.getMoreConversationsByDeviceID(data.deviceID, (data._id) ? data._id : '', session.nsp)];
            case 3:
                _a = _b.sent();
                return [3 /*break*/, 6];
            case 4: return [4 /*yield*/, conversationModel_1.Conversations.getCustomerConversations(session.deviceID, session.nsp)];
            case 5:
                _a = _b.sent();
                _b.label = 6;
            case 6:
                chats = _a;
                chatsCheck = void 0;
                if (!(chats && chats.length > 0)) return [3 /*break*/, 8];
                return [4 /*yield*/, conversationModel_1.Conversations.getMoreConversationsByDeviceID(data.deviceID, chats[chats.length - 1]._id, session.nsp)];
            case 7:
                chatsCheck = _b.sent();
                _b.label = 8;
            case 8:
                noMoreChats = void 0;
                if (chatsCheck && chatsCheck.length)
                    noMoreChats = false;
                else
                    noMoreChats = true;
                res.send({ status: 'ok', chats: chats, noMoreChats: noMoreChats });
                return [3 /*break*/, 10];
            case 9:
                res.status(401).send({ error: 'error' });
                _b.label = 10;
            case 10: return [3 /*break*/, 12];
            case 11:
                error_13 = _b.sent();
                console.log(error_13);
                console.log('error is getting recent conversation');
                res.status(401).send({ error: 'error' });
                return [3 /*break*/, 12];
            case 12: return [2 /*return*/];
        }
    });
}); });
router.post('/getSelectedChat', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, sessionID, session, msgs, error_14;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 8, , 9]);
                if (!(!req.body.sessionid || !req.body.cid)) return [3 /*break*/, 1];
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 7];
            case 1:
                if (req.headers.origin) {
                    res.header("Access-Control-Allow-Origin", req.headers.origin);
                    res.header("Access-Control-Allow-Headers", "content-type");
                    res.header('Access-Control-Allow-Methods', 'GET');
                    res.header('Access-Control-Allow-Credentials', 'true');
                    res.header('Vary', 'Origin, Access-Control-Request-Headers');
                }
                data = req.body;
                sessionID = req.body.sessionid;
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetVisitorByID(sessionID)];
            case 2:
                session = _a.sent();
                if (!session) return [3 /*break*/, 6];
                if (!data.deviceID) return [3 /*break*/, 4];
                return [4 /*yield*/, conversationModel_1.Conversations.getMessagesByCid(data.cid)];
            case 3:
                msgs = _a.sent();
                res.send({ status: 'ok', msgList: (msgs && msgs.length) ? msgs : [] });
                return [3 /*break*/, 5];
            case 4:
                res.status(401).send({ error: 'error' });
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                res.status(401).send({ error: 'error' });
                _a.label = 7;
            case 7: return [3 /*break*/, 9];
            case 8:
                error_14 = _a.sent();
                console.log(error_14);
                console.log('error is getting getSelectedChat');
                res.status(401).send({ error: 'error' });
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); });
router.post('/getFAQS', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, faqs, faqsCheck, noMoreFaqs, _a, error_15;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 13, , 14]);
                if (!!req.body.sessionid) return [3 /*break*/, 1];
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 12];
            case 1:
                if (req.headers.origin) {
                    res.header("Access-Control-Allow-Origin", req.headers.origin);
                    res.header("Access-Control-Allow-Headers", "content-type");
                    res.header('Access-Control-Allow-Methods', 'GET');
                    res.header('Access-Control-Allow-Credentials', 'true');
                    res.header('Vary', 'Origin, Access-Control-Request-Headers');
                }
                data = req.body;
                faqs = void 0;
                faqsCheck = void 0;
                noMoreFaqs = false;
                if (!data._id) return [3 /*break*/, 6];
                return [4 /*yield*/, widgetMarketingModel_1.WidgetMarketingModel.getMoreFaqs(data._id, data.nsp)];
            case 2:
                faqs = _b.sent();
                if (!(faqs && faqs.length > 0)) return [3 /*break*/, 5];
                if (!(faqs.length < 5)) return [3 /*break*/, 3];
                noMoreFaqs = true;
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, widgetMarketingModel_1.WidgetMarketingModel.getMoreFaqs(faqs[faqs.length - 1]._id, data.nsp)];
            case 4:
                faqsCheck = _b.sent();
                if (faqsCheck && faqsCheck.length)
                    noMoreFaqs = false;
                else
                    noMoreFaqs = true;
                _b.label = 5;
            case 5: return [3 /*break*/, 11];
            case 6:
                if (!(data.text)) return [3 /*break*/, 8];
                return [4 /*yield*/, widgetMarketingModel_1.WidgetMarketingModel.getFaqsByQuestion(data.text, data.nsp)];
            case 7:
                _a = _b.sent();
                return [3 /*break*/, 10];
            case 8: return [4 /*yield*/, widgetMarketingModel_1.WidgetMarketingModel.getFaqsForVisitor(data.nsp)];
            case 9:
                _a = _b.sent();
                _b.label = 10;
            case 10:
                faqs = _a;
                _b.label = 11;
            case 11:
                res.send({ status: 'ok', FAQS: faqs, noMoreFaqs: noMoreFaqs });
                _b.label = 12;
            case 12: return [3 /*break*/, 14];
            case 13:
                error_15 = _b.sent();
                console.log(error_15);
                console.log('error is getFAQS');
                res.status(401).send({ error: 'error' });
                return [3 /*break*/, 14];
            case 14: return [2 /*return*/];
        }
    });
}); });
router.post('/getPromotions', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, sessionID, session, promotions, error_16;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                if (!!req.body.sessionid) return [3 /*break*/, 1];
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 5];
            case 1:
                if (req.headers.origin) {
                    res.header("Access-Control-Allow-Origin", req.headers.origin);
                    res.header("Access-Control-Allow-Headers", "content-type");
                    res.header('Access-Control-Allow-Methods', 'GET');
                    res.header('Access-Control-Allow-Credentials', 'true');
                    res.header('Vary', 'Origin, Access-Control-Request-Headers');
                }
                data = req.body;
                sessionID = req.body.sessionid;
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetVisitorByID(sessionID)];
            case 2:
                session = _a.sent();
                if (!session) return [3 /*break*/, 4];
                return [4 /*yield*/, widgetMarketingModel_1.WidgetMarketingModel.getActivePromotions(session.nsp)];
            case 3:
                promotions = _a.sent();
                res.send({ status: 'ok', promotions: (promotions) ? promotions : [] });
                return [3 /*break*/, 5];
            case 4:
                res.status(401).send({ error: 'error' });
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                error_16 = _a.sent();
                console.log(error_16);
                console.log('error is getting promotions');
                res.status(401).send({ error: 'error' });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
router.post('/likeOnPost', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, promotion, error_17;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                if (!!req.body.sessionid) return [3 /*break*/, 1];
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 3];
            case 1:
                if (req.headers.origin) {
                    res.header("Access-Control-Allow-Origin", req.headers.origin);
                    res.header("Access-Control-Allow-Headers", "content-type");
                    res.header('Access-Control-Allow-Methods', 'GET');
                    res.header('Access-Control-Allow-Credentials', 'true');
                    res.header('Vary', 'Origin, Access-Control-Request-Headers');
                }
                data = req.body;
                // let sessionID = req.body.sessionid
                // let session = await SessionManager.GetVisitorByID(sessionID) as VisitorSessionSchema;
                // let expiredSession: any;
                // //  console.log(data);
                // if (!session) {
                //     expiredSession = await visitorSessions.getVisitorSession(sessionID);
                //     //console.log('expiredSession');
                //     //console.log(expiredSession);
                //     if (expiredSession && expiredSession.length) {
                //         session = expiredSession[0]
                //     }
                // }
                // if (session) {
                data.likes.createdOn = new Date().toISOString();
                return [4 /*yield*/, widgetMarketingModel_1.WidgetMarketingModel.LikeOnPost(data.nsp, data._id, data.likes, data.alreadyLiked)];
            case 2:
                promotion = _a.sent();
                if (promotion && promotion.value) {
                    res.send({ status: 'ok', promotion: promotion.value });
                }
                else {
                    res.status(401).send({ error: 'error' });
                }
                _a.label = 3;
            case 3: return [3 /*break*/, 5];
            case 4:
                error_17 = _a.sent();
                console.log(error_17);
                console.log('error is likeOnPost');
                res.status(401).send({ error: 'error' });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
router.post('/viewsOnProduct', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, promotion, error_18;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                if (!!req.body.sessionid) return [3 /*break*/, 1];
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 3];
            case 1:
                if (req.headers.origin) {
                    res.header("Access-Control-Allow-Origin", req.headers.origin);
                    res.header("Access-Control-Allow-Headers", "content-type");
                    res.header('Access-Control-Allow-Methods', 'GET');
                    res.header('Access-Control-Allow-Credentials', 'true');
                    res.header('Vary', 'Origin, Access-Control-Request-Headers');
                }
                data = req.body;
                return [4 /*yield*/, widgetMarketingModel_1.WidgetMarketingModel.ViewOnProduct(data._id, data.views)];
            case 2:
                promotion = _a.sent();
                if (promotion && promotion.value) {
                    res.send({ status: 'ok', promotion: promotion.value });
                }
                else {
                    res.status(401).send({ error: 'error' });
                }
                _a.label = 3;
            case 3: return [3 /*break*/, 5];
            case 4:
                error_18 = _a.sent();
                console.log(error_18);
                console.log('error is viewsOnProduct');
                res.status(401).send({ error: 'error' });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
router.post('/reviewOnPost', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, promotion, error_19;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                if (!!req.body.sessionid) return [3 /*break*/, 1];
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 3];
            case 1:
                if (req.headers.origin) {
                    res.header("Access-Control-Allow-Origin", req.headers.origin);
                    res.header("Access-Control-Allow-Headers", "content-type");
                    res.header('Access-Control-Allow-Methods', 'GET');
                    res.header('Access-Control-Allow-Credentials', 'true');
                    res.header('Vary', 'Origin, Access-Control-Request-Headers');
                }
                data = req.body;
                // let sessionID = req.body.sessionid
                // let session = await SessionManager.GetVisitorByID(sessionID) as VisitorSessionSchema;
                // let expiredSession: any;
                // if (!session) {
                //     expiredSession = await visitorSessions.getVisitorSession(sessionID);
                //     //console.log('expiredSession');
                //     //console.log(expiredSession);
                //     if (expiredSession && expiredSession.length) {
                //         session = expiredSession[0]
                //     }
                // }
                // if (session) {
                data.reviews.createdOn = new Date().toISOString();
                data.reviews.visitorName = (data.reviews.visitorName) ? data.reviews.visitorName : '';
                data.reviews.vistorEmail = (data.reviews.visitorEmail) ? data.reviews.visitorEmail : '';
                return [4 /*yield*/, widgetMarketingModel_1.WidgetMarketingModel.ReviewOnPost(data.nsp, data._id, data.reviews)];
            case 2:
                promotion = _a.sent();
                if (promotion && promotion.value) {
                    res.send({ status: 'ok', promotion: promotion.value });
                }
                else {
                    res.status(401).send({ error: 'error' });
                }
                _a.label = 3;
            case 3: return [3 /*break*/, 5];
            case 4:
                error_19 = _a.sent();
                console.log(error_19);
                console.log('error is reviewOnPost');
                res.status(401).send({ error: 'error' });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
router.post('/deleteReviewOnPost', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, promotion, error_20;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                if (!!req.body.sessionid) return [3 /*break*/, 1];
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 3];
            case 1:
                if (req.headers.origin) {
                    res.header("Access-Control-Allow-Origin", req.headers.origin);
                    res.header("Access-Control-Allow-Headers", "content-type");
                    res.header('Access-Control-Allow-Methods', 'GET');
                    res.header('Access-Control-Allow-Credentials', 'true');
                    res.header('Vary', 'Origin, Access-Control-Request-Headers');
                }
                data = req.body;
                return [4 /*yield*/, widgetMarketingModel_1.WidgetMarketingModel.DeleteReviewOnPost(data.reviews, data.promotionID)];
            case 2:
                promotion = _a.sent();
                //   console.log(promotion);
                if (promotion && promotion.value) {
                    res.send({ status: 'ok', promotion: promotion.value });
                }
                else
                    res.status(401).send({ error: 'error' });
                _a.label = 3;
            case 3: return [3 /*break*/, 5];
            case 4:
                error_20 = _a.sent();
                console.log(error_20);
                console.log('error is deleteReviewOnPost');
                res.status(401).send({ error: 'error' });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
router.post('/getMoreReviews', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, sessionID, reviewsCheck, noMoreReviews, reviews, error_21;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 8, , 9]);
                if (!!req.body.sessionid) return [3 /*break*/, 1];
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 7];
            case 1:
                if (req.headers.origin) {
                    res.header("Access-Control-Allow-Origin", req.headers.origin);
                    res.header("Access-Control-Allow-Headers", "content-type");
                    res.header('Access-Control-Allow-Methods', 'GET');
                    res.header('Access-Control-Allow-Credentials', 'true');
                    res.header('Vary', 'Origin, Access-Control-Request-Headers');
                }
                data = req.body;
                sessionID = req.body.sessionid;
                if (!data.deviceID) return [3 /*break*/, 6];
                reviewsCheck = void 0;
                noMoreReviews = false;
                return [4 /*yield*/, widgetMarketingModel_1.WidgetMarketingModel.getMoreReviews(data.promoid, data.date)];
            case 2:
                reviews = _a.sent();
                if (!(reviews && reviews.length > 0)) return [3 /*break*/, 5];
                if (!(reviews.length < 5)) return [3 /*break*/, 3];
                noMoreReviews = true;
                res.send({ status: 'ok', reviews: reviews, noMoreReviews: noMoreReviews });
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, widgetMarketingModel_1.WidgetMarketingModel.getMoreReviews(data.promoid, reviews[reviews.length - 1].date)];
            case 4:
                reviewsCheck = _a.sent();
                if (reviewsCheck) {
                    if (reviewsCheck && reviewsCheck.length)
                        noMoreReviews = false;
                    else
                        noMoreReviews = true;
                    res.send({ status: 'ok', reviews: reviews, noMoreReviews: noMoreReviews });
                }
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                res.status(401).send({ error: 'error' });
                _a.label = 7;
            case 7: return [3 /*break*/, 9];
            case 8:
                error_21 = _a.sent();
                console.log(error_21);
                console.log('error is getMoreReviews');
                res.status(401).send({ error: 'error' });
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); });
router.post('/getNews', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, sessionID, session, news, error_22;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                if (!!req.body.sessionid) return [3 /*break*/, 1];
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 5];
            case 1:
                if (req.headers.origin) {
                    res.header("Access-Control-Allow-Origin", req.headers.origin);
                    res.header("Access-Control-Allow-Headers", "content-type");
                    res.header('Access-Control-Allow-Methods', 'GET');
                    res.header('Access-Control-Allow-Credentials', 'true');
                    res.header('Vary', 'Origin, Access-Control-Request-Headers');
                }
                data = req.body;
                sessionID = req.body.sessionid;
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetVisitorByID(sessionID)];
            case 2:
                session = _a.sent();
                if (!session) return [3 /*break*/, 4];
                return [4 /*yield*/, widgetMarketingModel_1.WidgetMarketingModel.getActiveNews(session.nsp)];
            case 3:
                news = _a.sent();
                res.send({ status: 'ok', news: (news && news.length) ? news : [] });
                return [3 /*break*/, 5];
            case 4:
                res.status(401).send({ error: 'error' });
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                error_22 = _a.sent();
                console.log(error_22);
                console.log('error is getNews');
                res.status(401).send({ error: 'error' });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
router.post('/getMoreActiveNews', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, news, newsCheck, noMoreNews, error_23;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 8, , 9]);
                if (!!req.body.sessionid) return [3 /*break*/, 1];
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 7];
            case 1:
                if (req.headers.origin) {
                    res.header("Access-Control-Allow-Origin", req.headers.origin);
                    res.header("Access-Control-Allow-Headers", "content-type");
                    res.header('Access-Control-Allow-Methods', 'GET');
                    res.header('Access-Control-Allow-Credentials', 'true');
                    res.header('Vary', 'Origin, Access-Control-Request-Headers');
                }
                data = req.body;
                return [4 /*yield*/, widgetMarketingModel_1.WidgetMarketingModel.getMoreActiveNews(data._id, data.nsp)];
            case 2:
                news = _a.sent();
                newsCheck = void 0;
                noMoreNews = false;
                if (!(news && news.length > 0)) return [3 /*break*/, 6];
                if (!(news.length < 5)) return [3 /*break*/, 3];
                noMoreNews = true;
                res.send({ status: 'ok', News: news, noMoreNews: noMoreNews });
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, widgetMarketingModel_1.WidgetMarketingModel.getMoreActiveNews(news[news.length - 1]._id, data.nsp)];
            case 4:
                newsCheck = _a.sent();
                if (newsCheck) {
                    if (newsCheck && newsCheck.length)
                        noMoreNews = false;
                    else
                        noMoreNews = true;
                    res.send({ status: 'ok', News: news, noMoreNews: noMoreNews });
                }
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                res.send({ status: 'ok', News: [], noMoreNews: true });
                _a.label = 7;
            case 7: return [3 /*break*/, 9];
            case 8:
                error_23 = _a.sent();
                console.log(error_23);
                console.log('error is getMoreActiveNews');
                res.status(401).send({ error: 'error' });
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); });
router.post('/getActiveNewsByDate', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, news, error_24;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                if (!!req.body.sessionid) return [3 /*break*/, 1];
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 3];
            case 1:
                if (req.headers.origin) {
                    res.header("Access-Control-Allow-Origin", req.headers.origin);
                    res.header("Access-Control-Allow-Headers", "content-type");
                    res.header('Access-Control-Allow-Methods', 'GET');
                    res.header('Access-Control-Allow-Credentials', 'true');
                    res.header('Vary', 'Origin, Access-Control-Request-Headers');
                }
                data = req.body;
                return [4 /*yield*/, widgetMarketingModel_1.WidgetMarketingModel.getActiveNewsByDate(data.filters.from, data.filters.to, data.nsp)];
            case 2:
                news = _a.sent();
                res.send({ status: 'ok', news: (news && news.length) ? news : [] });
                _a.label = 3;
            case 3: return [3 /*break*/, 5];
            case 4:
                error_24 = _a.sent();
                console.log(error_24);
                console.log('error is getActiveNewsByDate');
                res.status(401).send({ error: 'error' });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
router.post('/submitTicket', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data_2, sess, agentSearch, session, allAgents, settings, origin, greetingMessage, primaryEmail, primaryTicket, randomColor, ticket, insertedTicket, ticketId, message, insertedMessage, loggedEvent, allocatedAgent, cid, UpdatedSessions, _a, conversation, payload, temp_3, tempData_1, lastMessage, messageinsertedID, credentials, greeting, messageinserted, logEvent, UpdatedSessions, _b, conversation, payload, temp_4, lastMessage, messageinsertedID, credentials, greeting, messageinserted, logEvent, UpdatedVisitor, error_25;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 76, , 77]);
                if (!!req.body.sessionid) return [3 /*break*/, 1];
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 75];
            case 1:
                if (req.headers.origin) {
                    res.header("Access-Control-Allow-Origin", req.headers.origin);
                    res.header("Access-Control-Allow-Headers", "content-type");
                    res.header('Access-Control-Allow-Methods', 'GET');
                    res.header('Access-Control-Allow-Credentials', 'true');
                    res.header('Vary', 'Origin, Access-Control-Request-Headers');
                }
                data_2 = req.body.ticket;
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetVisitorByID(req.body.sessionid)];
            case 2:
                sess = _c.sent();
                if (!sess) return [3 /*break*/, 74];
                agentSearch = {};
                return [4 /*yield*/, AssignmentRuleSetDispatcher_1.ApplyRuleSets(sess, data_2)];
            case 3:
                agentSearch = _c.sent();
                return [4 /*yield*/, CheckActive_1.MakeActive(sess)];
            case 4:
                session = _c.sent();
                if (!session) return [3 /*break*/, 72];
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetAllActiveAgentsChatting(session)];
            case 5:
                allAgents = _c.sent();
                return [4 /*yield*/, companyModel_1.Company.getSettings(session.nsp)];
            case 6:
                settings = _c.sent();
                origin = void 0;
                if (settings && settings.length)
                    origin = settings[0];
                greetingMessage = '';
                if (origin) {
                    greetingMessage = origin['settings']['chatSettings']['greetingMessage'];
                }
                if (!(!allAgents || session.state != 1)) return [3 /*break*/, 20];
                return [4 /*yield*/, ticketsModel_1.Tickets.GetPrimaryEmail(session.nsp)];
            case 7:
                primaryEmail = _c.sent();
                primaryTicket = undefined;
                if (!primaryEmail) return [3 /*break*/, 18];
                randomColor = constants_1.rand[Math.floor(Math.random() * constants_1.rand.length)];
                ticket = {
                    type: 'email',
                    subject: data_2.subject,
                    nsp: session.nsp,
                    state: 'OPEN',
                    datetime: new Date().toISOString(),
                    priority: data_2.priority,
                    // from: primaryEmail[0].domainEmail,
                    from: constants_1.ticketEmail,
                    visitor: {
                        name: data_2.name,
                        email: data_2.email,
                        phone: data_2.phone,
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
                    source: 'livechat',
                    slaPolicy: {
                        reminderResolution: false,
                        reminderResponse: false,
                        violationResponse: false,
                        violationResolution: false
                    },
                    assignmentList: []
                };
                return [4 /*yield*/, RuleSetExecutor_1.RuleSetDescriptor(ticket)];
            case 8:
                // if (data.phone && data.email) {
                //     let UpdatedVisitor = await Visitor.UpdateVisitorInfoByDeviceID(session.deviceID, { username: (data.username as string), email: (data.email as string), phone: data.phone ? data.phone : '' });
                // }
                ticket = _c.sent();
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
                insertedTicket = _c.sent();
                ticketId = void 0;
                (insertedTicket) ?
                    (insertedTicket.insertedCount) ? ticketId = insertedTicket.insertedId
                        : res.status(401).send({ status: 'error' }) : undefined;
                if (!ticketId) return [3 /*break*/, 16];
                message = {
                    datetime: new Date().toISOString(),
                    nsp: session.nsp,
                    senderType: 'Visitor',
                    message: data_2.message,
                    from: data_2.email,
                    to: constants_1.ticketEmail,
                    replytoAddress: data_2.email,
                    tid: [ticketId],
                    attachment: [],
                    viewColor: (insertedTicket && insertedTicket.insertedCount) ? insertedTicket.ops[0].viewColor : ''
                };
                return [4 /*yield*/, ticketsModel_1.Tickets.InsertMessage(JSON.parse(JSON.stringify(message)))];
            case 10:
                insertedMessage = _c.sent();
                if (!(insertedMessage && insertedMessage.insertedCount &&
                    insertedTicket && insertedTicket.insertedCount)) return [3 /*break*/, 14];
                // origin.to('ticketAdmin').emit('newTicket', { ticket: insertedTicket.ops[0] });
                // origin.to(ticket.group).emit('newTicket', { ticket: insertedTicket.ops[0] });
                //console.log(insertedTicket);
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'newTicket', nsp: session.nsp, roomName: ['ticketAdmin'], data: { ticket: insertedTicket.ops[0] } })];
            case 11:
                // origin.to('ticketAdmin').emit('newTicket', { ticket: insertedTicket.ops[0] });
                // origin.to(ticket.group).emit('newTicket', { ticket: insertedTicket.ops[0] });
                //console.log(insertedTicket);
                _c.sent();
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'newTicket', nsp: session.nsp, roomName: [ticket.group], data: { ticket: insertedTicket.ops[0] } })];
            case 12:
                _c.sent();
                res.send({ status: 'ok' });
                return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendEventLog(enums_1.EventLogMessages.TICKET_SUBMITTED, (session._id) ? session._id : session.id)];
            case 13:
                loggedEvent = _c.sent();
                return [3 /*break*/, 15];
            case 14:
                res.status(401).send({ status: 'error' });
                _c.label = 15;
            case 15: return [3 /*break*/, 17];
            case 16:
                res.status(401).send({ status: 'error' });
                _c.label = 17;
            case 17: return [3 /*break*/, 19];
            case 18:
                res.status(401).send({ status: 'error' });
                _c.label = 19;
            case 19: return [3 /*break*/, 69];
            case 20:
                allocatedAgent = void 0;
                cid = new mongodb_1.ObjectID();
                if (!origin['settings']['chatSettings']['assignments'].priorityAgent.trim()) return [3 /*break*/, 45];
                if (!(session.selectedAgent)) return [3 /*break*/, 22];
                return [4 /*yield*/, sessionsManager_1.SessionManager.AllocateAgentPriority(session, session.selectedAgent, cid)];
            case 21:
                _a = _c.sent();
                return [3 /*break*/, 23];
            case 22:
                _a = undefined;
                _c.label = 23;
            case 23:
                UpdatedSessions = _a;
                if (!!UpdatedSessions) return [3 /*break*/, 25];
                return [4 /*yield*/, sessionsManager_1.SessionManager.AllocateAgentPriority(session, origin['settings']['chatSettings']['assignments'].priorityAgent.trim(), cid)];
            case 24:
                UpdatedSessions = _c.sent();
                _c.label = 25;
            case 25:
                if (!(UpdatedSessions && UpdatedSessions.agent)) return [3 /*break*/, 43];
                session = UpdatedSessions.visitor;
                allocatedAgent = UpdatedSessions.agent;
                if (!(allocatedAgent && session)) return [3 /*break*/, 41];
                return [4 /*yield*/, conversationModel_1.Conversations.createConversation(cid, session.email, session.id, session.nsp, session.viewColor, allocatedAgent.email, session.username, 2, session.deviceID)];
            case 26:
                conversation = _c.sent();
                if (!(conversation && conversation.insertedCount > 0)) return [3 /*break*/, 40];
                if (!(session.url && session.url.length)) return [3 /*break*/, 28];
                return [4 /*yield*/, sessionsManager_1.SessionManager.UpdateChatInitiatedDetails(session._id || session.id, session.url[session.url.length - 1], 'Visitor', ((session.state == 4) || (session.state == 5)) ? true : false)
                    //Visitor State Data to Update
                ];
            case 27:
                _c.sent();
                _c.label = 28;
            case 28:
                payload = { id: session.id, session: session };
                if (!conversation) return [3 /*break*/, 34];
                temp_3 = '<h5 class="clearfix m-b-10"> Credentials Update </h5>';
                tempData_1 = JSON.parse(JSON.stringify(data_2));
                delete tempData_1.ticket;
                Object.keys(tempData_1).map(function (key) {
                    temp_3 += key + ' : ' + tempData_1[key] + '<br>';
                });
                temp_3 += 'country : ' + session.fullCountryName.toString() + '<br>';
                lastMessage = {
                    from: session.nsp,
                    to: session.username,
                    body: temp_3,
                    cid: conversation.insertedId.toHexString(),
                    date: (new Date()).toISOString(),
                    type: 'Visitors',
                    attachment: false,
                    chatFormData: 'Credentials Updated'
                };
                return [4 /*yield*/, conversationModel_1.Conversations.insertMessage(lastMessage)];
            case 29:
                messageinsertedID = _c.sent();
                if (!messageinsertedID) return [3 /*break*/, 34];
                conversation.ops[0].messages.push(messageinsertedID.ops[0]);
                credentials = void 0;
                if (!!allocatedAgent.greetingMessage) return [3 /*break*/, 31];
                return [4 /*yield*/, conversationModel_1.Conversations.UpdateLastMessage(conversation.insertedId.toHexString(), lastMessage)];
            case 30:
                credentials = _c.sent();
                return [3 /*break*/, 34];
            case 31:
                greetingMessage = allocatedAgent.greetingMessage;
                if (!greetingMessage) return [3 /*break*/, 34];
                greeting = {
                    from: session.nsp,
                    to: session.username,
                    body: greetingMessage,
                    cid: conversation.insertedId.toHexString(),
                    date: (new Date()).toISOString(),
                    type: 'Agents',
                    attachment: false
                };
                return [4 /*yield*/, conversationModel_1.Conversations.insertMessage(greeting)];
            case 32:
                messageinserted = _c.sent();
                if (!(messageinserted && messageinserted.insertedCount)) return [3 /*break*/, 34];
                conversation.ops[0].messages.push(messageinserted.ops[0]);
                return [4 /*yield*/, conversationModel_1.Conversations.UpdateLastMessage(conversation.insertedId.toHexString(), greeting)];
            case 33:
                _c.sent();
                _c.label = 34;
            case 34:
                if (!allocatedAgent) return [3 /*break*/, 36];
                // origin.to((allocatedAgent.id as string)).emit('newConversation', conversation.ops[0]);
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'newConversation', nsp: session.nsp, roomName: [allocatedAgent.id], data: conversation.ops[0] })];
            case 35:
                // origin.to((allocatedAgent.id as string)).emit('newConversation', conversation.ops[0]);
                _c.sent();
                _c.label = 36;
            case 36: 
            //Broadcast To All Agents That User Information and State Has Been Updated.
            // origin.in(Agents.NotifyAll()).emit('updateUser', payload);
            return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: session.nsp, roomName: [agentModel_1.Agents.NotifyAll()], data: payload })];
            case 37:
                //Broadcast To All Agents That User Information and State Has Been Updated.
                // origin.in(Agents.NotifyAll()).emit('updateUser', payload);
                _c.sent(),
                    //Update User Status Back to Visitor Window
                    res.send({
                        status: 'chat',
                        session: {
                            clientID: (conversation.ops[0].clientID) ? conversation.ops[0].clientID : '',
                            agent: session.agent,
                            cid: session.conversationID,
                            state: session.state,
                            credentials: (conversation) ? conversation.ops[0].messages[0] : '',
                            greetingMessage: (conversation) ? conversation.ops[0].messages[1] : '',
                            username: session.username,
                            email: session.email,
                            phone: (session.phone ? session.phone : ''),
                            message: (session.message) ? session.message : ''
                        }
                    });
                // socket.to(Visitor.NotifyOne(session)).emit('gotAgent',
                //     {
                //         clientID: (conversation.ops[0].clientID) ? conversation.ops[0].clientID : '',
                //         agent: (allocatedAgent) ? session.agent : undefined,
                //         cid: session.conversationID,
                //         state: session.state,
                //         username: session.username,
                //         email: session.email,
                //         credentials: (conversation) ? conversation.ops[0].messages[0] : '',
                //         greetingMessage: (conversation) ? conversation.ops[0].messages[1] : '',
                //         phone: (session.phone ? session.phone : ''),
                //         message: (session.message) ? session.message : ''
                //     });
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({
                        action: 'emit', to: 'V', broadcast: false, eventName: 'gotAgent', nsp: session.nsp, roomName: [visitorModel_1.Visitor.NotifyOne(session)], data: {
                            clientID: (conversation.ops[0].clientID) ? conversation.ops[0].clientID : '',
                            agent: (allocatedAgent) ? session.agent : undefined,
                            cid: session.conversationID,
                            state: session.state,
                            username: session.username,
                            email: session.email,
                            credentials: (conversation) ? conversation.ops[0].messages[0] : '',
                            greetingMessage: (conversation) ? conversation.ops[0].messages[1] : '',
                            phone: (session.phone ? session.phone : ''),
                            message: (session.message) ? session.message : ''
                        }, excludeSender: true, sockID: req.body.socketID
                    })];
            case 38:
                // socket.to(Visitor.NotifyOne(session)).emit('gotAgent',
                //     {
                //         clientID: (conversation.ops[0].clientID) ? conversation.ops[0].clientID : '',
                //         agent: (allocatedAgent) ? session.agent : undefined,
                //         cid: session.conversationID,
                //         state: session.state,
                //         username: session.username,
                //         email: session.email,
                //         credentials: (conversation) ? conversation.ops[0].messages[0] : '',
                //         greetingMessage: (conversation) ? conversation.ops[0].messages[1] : '',
                //         phone: (session.phone ? session.phone : ''),
                //         message: (session.message) ? session.message : ''
                //     });
                _c.sent();
                return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendEventLog(enums_1.EventLogMessages.CHAT_INITIATED, (session._id) ? session._id : session.id)];
            case 39:
                logEvent = _c.sent();
                _c.label = 40;
            case 40: return [3 /*break*/, 42];
            case 41:
                console.log('No Agent');
                res.send(401).send({ status: 'error' });
                _c.label = 42;
            case 42: return [3 /*break*/, 44];
            case 43:
                //console.log('No Agent')
                res.send(401).send({ status: 'error' });
                _c.label = 44;
            case 44: return [2 /*return*/];
            case 45:
                console.log('not priority');
                if (!(session.selectedAgent)) return [3 /*break*/, 47];
                return [4 /*yield*/, sessionsManager_1.SessionManager.AllocateAgentPriority(session, session.selectedAgent, cid, undefined, (agentSearch) ? agentSearch : '')];
            case 46:
                _b = _c.sent();
                return [3 /*break*/, 48];
            case 47:
                _b = undefined;
                _c.label = 48;
            case 48:
                UpdatedSessions = _b;
                if (!!UpdatedSessions) return [3 /*break*/, 50];
                return [4 /*yield*/, sessionsManager_1.SessionManager.AllocateAgent(session, cid, undefined, (agentSearch) ? agentSearch : '')];
            case 49:
                UpdatedSessions = _c.sent();
                _c.label = 50;
            case 50:
                if (!UpdatedSessions) return [3 /*break*/, 68];
                allocatedAgent = UpdatedSessions.agent;
                session = UpdatedSessions.visitor;
                if (!session) return [3 /*break*/, 66];
                return [4 /*yield*/, conversationModel_1.Conversations.createConversation(cid, session.email, session.id, session.nsp, session.viewColor, (allocatedAgent) ? allocatedAgent.email : '', session.username, (allocatedAgent) ? 2 : 1, session.deviceID)];
            case 51:
                conversation = _c.sent();
                payload = { id: session.id, session: session };
                if (allocatedAgent && allocatedAgent.greetingMessage)
                    greetingMessage = allocatedAgent.greetingMessage;
                if (!conversation) return [3 /*break*/, 59];
                if (!(session.url && session.url.length)) return [3 /*break*/, 53];
                return [4 /*yield*/, sessionsManager_1.SessionManager.UpdateChatInitiatedDetails(session._id || session.id, session.url[session.url.length - 1], 'Visitor', ((session.state == 4) || (session.state == 5)) ? true : false)];
            case 52:
                _c.sent();
                _c.label = 53;
            case 53:
                temp_4 = '<h5 class="clearfix m-b-10">Credentials Updated</h5>';
                Object.keys(data_2).map(function (key) {
                    temp_4 += key + ' : ' + data_2[key] + '<br>';
                });
                temp_4 += 'country : ' + session.fullCountryName.toString() + '<br>';
                lastMessage = {
                    from: session.nsp,
                    to: session.username,
                    body: temp_4,
                    cid: conversation.insertedId.toHexString(),
                    date: (new Date()).toISOString(),
                    type: 'Visitors',
                    attachment: false,
                    chatFormData: 'Credentials Updated'
                };
                return [4 /*yield*/, conversationModel_1.Conversations.insertMessage(lastMessage)];
            case 54:
                messageinsertedID = _c.sent();
                if (!messageinsertedID) return [3 /*break*/, 59];
                conversation.ops[0].messages.push(messageinsertedID.ops[0]);
                credentials = void 0;
                if (!!greetingMessage) return [3 /*break*/, 56];
                return [4 /*yield*/, conversationModel_1.Conversations.UpdateLastMessage(conversation.insertedId.toHexString(), lastMessage)];
            case 55:
                credentials = _c.sent();
                return [3 /*break*/, 59];
            case 56:
                greeting = {
                    from: session.nsp,
                    to: session.username,
                    body: greetingMessage,
                    cid: conversation.insertedId.toHexString(),
                    date: (new Date()).toISOString(),
                    type: 'Agents',
                    attachment: false
                };
                return [4 /*yield*/, conversationModel_1.Conversations.insertMessage(greeting)];
            case 57:
                messageinserted = _c.sent();
                if (!(messageinserted && messageinserted.insertedCount)) return [3 /*break*/, 59];
                conversation.ops[0].messages.push(messageinserted.ops[0]);
                return [4 /*yield*/, conversationModel_1.Conversations.UpdateLastMessage(conversation.insertedId.toHexString(), greeting)];
            case 58:
                _c.sent();
                _c.label = 59;
            case 59:
                if (!(allocatedAgent && conversation)) return [3 /*break*/, 61];
                // origin.to((allocatedAgent.id as string)).emit('newConversation', conversation.ops[0]);
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'newConversation', nsp: session.nsp, roomName: [allocatedAgent.id], data: conversation.ops[0] })];
            case 60:
                // origin.to((allocatedAgent.id as string)).emit('newConversation', conversation.ops[0]);
                _c.sent();
                _c.label = 61;
            case 61: 
            //Broadcast To All Agents That User Information and State Has Been Updated.
            // origin.in(Agents.NotifyAll()).emit('updateUser', payload);
            return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: session.nsp, roomName: [agentModel_1.Agents.NotifyAll()], data: payload })];
            case 62:
                //Broadcast To All Agents That User Information and State Has Been Updated.
                // origin.in(Agents.NotifyAll()).emit('updateUser', payload);
                _c.sent();
                if (allocatedAgent)
                    res.send({
                        status: 'chat',
                        session: {
                            clientID: (conversation.ops[0].clientID) ? conversation.ops[0].clientID : '',
                            agent: session.agent,
                            cid: session.conversationID,
                            state: session.state,
                            credentials: (conversation) ? conversation.ops[0].messages[0] : '',
                            greetingMessage: (conversation) ? conversation.ops[0].messages[1] : '',
                            username: session.username,
                            email: session.email,
                            phone: (session.phone ? session.phone : ''),
                            message: (session.message) ? session.message : ''
                        }
                    });
                else
                    res.send({
                        status: 'chat',
                        session: {
                            clientID: (conversation.ops[0].clientID) ? conversation.ops[0].clientID : '',
                            agent: session.agent,
                            cid: session.conversationID,
                            state: session.state,
                            credentials: (conversation) ? conversation.ops[0].messages[0] : '',
                            greetingMessage: (conversation) ? conversation.ops[0].messages[1] : '',
                            username: session.username,
                            email: session.email,
                            phone: (session.phone ? session.phone : ''),
                            message: (session.message) ? session.message : ''
                        }
                    });
                if (!conversation) return [3 /*break*/, 65];
                // socket.to(Visitor.NotifyOne(session)).emit('gotAgent', {
                //     clientID: (conversation.ops[0].clientID) ? conversation.ops[0].clientID : '',
                //     agent: (allocatedAgent) ? session.agent : undefined,
                //     cid: session.conversationID,
                //     state: session.state,
                //     username: session.username,
                //     email: session.email,
                //     credentials: (conversation) ? conversation.ops[0].messages[0] : '',
                //     greetingMessage: (conversation) ? conversation.ops[0].messages[1] : '',
                //     phone: (session.phone ? session.phone : ''),
                //     message: (session.message) ? session.message : ''
                // });
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({
                        action: 'emit', to: 'V', broadcast: false, eventName: 'gotAgent', nsp: session.nsp, roomName: [visitorModel_1.Visitor.NotifyOne(session)], data: {
                            clientID: (conversation.ops[0].clientID) ? conversation.ops[0].clientID : '',
                            agent: (allocatedAgent) ? session.agent : undefined,
                            cid: session.conversationID,
                            state: session.state,
                            username: session.username,
                            email: session.email,
                            credentials: (conversation) ? conversation.ops[0].messages[0] : '',
                            greetingMessage: (conversation) ? conversation.ops[0].messages[1] : '',
                            phone: (session.phone ? session.phone : ''),
                            message: (session.message) ? session.message : ''
                        }, excludeSender: true, sockID: req.body.socketID
                    })];
            case 63:
                // socket.to(Visitor.NotifyOne(session)).emit('gotAgent', {
                //     clientID: (conversation.ops[0].clientID) ? conversation.ops[0].clientID : '',
                //     agent: (allocatedAgent) ? session.agent : undefined,
                //     cid: session.conversationID,
                //     state: session.state,
                //     username: session.username,
                //     email: session.email,
                //     credentials: (conversation) ? conversation.ops[0].messages[0] : '',
                //     greetingMessage: (conversation) ? conversation.ops[0].messages[1] : '',
                //     phone: (session.phone ? session.phone : ''),
                //     message: (session.message) ? session.message : ''
                // });
                _c.sent();
                return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendEventLog(enums_1.EventLogMessages.CHAT_INITIATED, (session._id) ? session._id : session.id)];
            case 64:
                logEvent = _c.sent();
                _c.label = 65;
            case 65: return [3 /*break*/, 67];
            case 66:
                res.status(401).send({ status: 'error' });
                _c.label = 67;
            case 67: return [3 /*break*/, 69];
            case 68:
                //console.log(UpdatedSessions);
                //console.log("Can't Assign Agent");
                res.status(401).send({ status: 'error' });
                _c.label = 69;
            case 69:
                if (!(data_2.email && (data_2.email.toLowerCase().indexOf('unregistered') === -1))) return [3 /*break*/, 71];
                return [4 /*yield*/, visitorModel_1.Visitor.UpdateVisitorInfoByDeviceID(session.deviceID, { username: data_2.username, email: data_2.email, phone: data_2.phone ? data_2.phone : '' })];
            case 70:
                UpdatedVisitor = _c.sent();
                _c.label = 71;
            case 71: return [3 /*break*/, 73];
            case 72:
                res.status(401).send({ status: 'error', msg: 'No Session Found' });
                _c.label = 73;
            case 73: return [3 /*break*/, 75];
            case 74:
                res.status(401).send({ status: 'error', msg: 'No Session Found' });
                _c.label = 75;
            case 75: return [3 /*break*/, 77];
            case 76:
                error_25 = _c.sent();
                console.log(error_25);
                console.log('error in Submitting Ticket');
                res.status(401).send({ status: 'error' });
                return [3 /*break*/, 77];
            case 77: return [2 /*return*/];
        }
    });
}); });
router.post('/convertChatToTicket', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, session, company, primaryEmail, convos, response, error_26;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 12, , 13]);
                if (!!req.body.sessionid) return [3 /*break*/, 1];
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 11];
            case 1:
                if (req.headers.origin) {
                    res.header("Access-Control-Allow-Origin", req.headers.origin);
                    res.header("Access-Control-Allow-Headers", "content-type");
                    res.header('Access-Control-Allow-Methods', 'GET');
                    res.header('Access-Control-Allow-Credentials', 'true');
                    res.header('Vary', 'Origin, Access-Control-Request-Headers');
                }
                data = req.body;
                if (!data.thread || !data.cid)
                    throw new Error('Invalid Request');
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetAgentByID(data.sessionid)];
            case 2:
                session = _a.sent();
                if (!session) return [3 /*break*/, 10];
                return [4 /*yield*/, companyModel_1.Company.getCompany(session.nsp)];
            case 3:
                company = _a.sent();
                if (!(company && company.length)) return [3 /*break*/, 9];
                return [4 /*yield*/, ticketsModel_1.Tickets.GetPrimaryEmail(session.nsp)];
            case 4:
                primaryEmail = _a.sent();
                return [4 /*yield*/, conversationModel_1.Conversations.getMessagesByCid(data.cid)];
            case 5:
                convos = _a.sent();
                if (!(!convos || !convos.length)) return [3 /*break*/, 6];
                res.status(401).send({ status: 'error', msg: 'Unable To Create Ticket - No Message Found' });
                return [3 /*break*/, 9];
            case 6:
                if (!primaryEmail.length) return [3 /*break*/, 8];
                return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendMessage({ action: 'convertChatToTicket', session: session, data: data })];
            case 7:
                response = _a.sent();
                if (response && response.MessageId) {
                    res.send({ status: 'ok' });
                }
                else {
                    res.status(401).send({ status: 'error', msg: 'Unable To Create Ticket' });
                }
                return [3 /*break*/, 9];
            case 8:
                res.status(401).send({ status: 'error', msg: 'Unable To Create Ticket' });
                _a.label = 9;
            case 9: return [3 /*break*/, 11];
            case 10:
                res.status(401).send({ status: 'error', msg: 'Unable To Create Ticket' });
                _a.label = 11;
            case 11: return [3 /*break*/, 13];
            case 12:
                error_26 = _a.sent();
                console.log(error_26);
                console.log('error in CONVERTING cHAT TO New Ticket');
                return [3 /*break*/, 13];
            case 13: return [2 /*return*/];
        }
    });
}); });
router.post('/getAvailableAgents', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, sessionID, session, liveAgents, error_27;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                if (!!req.body.sessionid) return [3 /*break*/, 1];
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 5];
            case 1:
                if (req.headers.origin) {
                    res.header("Access-Control-Allow-Origin", req.headers.origin);
                    res.header("Access-Control-Allow-Headers", "content-type");
                    res.header('Access-Control-Allow-Methods', 'GET');
                    res.header('Access-Control-Allow-Credentials', 'true');
                    res.header('Vary', 'Origin, Access-Control-Request-Headers');
                }
                data = req.body;
                sessionID = req.body.sessionid;
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetVisitorByID(sessionID)];
            case 2:
                session = _a.sent();
                if (!session) return [3 /*break*/, 4];
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetLiveAvailableAgentForVisitors(session.nsp)];
            case 3:
                liveAgents = _a.sent();
                res.send({ status: 'ok', agentsList: (liveAgents && liveAgents.length) ? liveAgents : [] });
                return [3 /*break*/, 5];
            case 4:
                res.status(401).send({ error: 'error' });
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                error_27 = _a.sent();
                console.log(error_27);
                console.log('error is getAvailableAgents');
                res.status(401).send({ error: 'error' });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
router.post('/getWorkFlows', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, sessionID, session, workflows, error_28;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                if (!!req.body.sessionid) return [3 /*break*/, 1];
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 5];
            case 1:
                if (req.headers.origin) {
                    res.header("Access-Control-Allow-Origin", req.headers.origin);
                    res.header("Access-Control-Allow-Headers", "content-type");
                    res.header('Access-Control-Allow-Methods', 'GET');
                    res.header('Access-Control-Allow-Credentials', 'true');
                    res.header('Vary', 'Origin, Access-Control-Request-Headers');
                }
                data = req.body;
                sessionID = req.body.sessionid;
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetVisitorByID(sessionID)];
            case 2:
                session = _a.sent();
                if (!session) return [3 /*break*/, 4];
                return [4 /*yield*/, workflowModel_1.WorkFlowsModel.GetWorkFlows(session.nsp, (data.id) ? data.id : '')];
            case 3:
                workflows = _a.sent();
                res.send({ status: 'ok', workFlows: workflows });
                return [3 /*break*/, 5];
            case 4:
                res.status(401).send({ error: 'error' });
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                error_28 = _a.sent();
                console.log(error_28);
                console.log('error is getWorkFlows');
                res.status(401).send({ error: 'error' });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
router.post('/workFlowInput', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, sessionID, session_1, companySettings, index, stateMachineStates, error_29;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 11, , 12]);
                if (!(!req.body.sessionid || !req.body.value)) return [3 /*break*/, 1];
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 10];
            case 1:
                if (req.headers.origin) {
                    res.header("Access-Control-Allow-Origin", req.headers.origin);
                    res.header("Access-Control-Allow-Headers", "content-type");
                    res.header('Access-Control-Allow-Methods', 'GET');
                    res.header('Access-Control-Allow-Credentials', 'true');
                    res.header('Vary', 'Origin, Access-Control-Request-Headers');
                }
                data = req.body;
                sessionID = req.body.sessionid;
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetVisitorByID(sessionID)];
            case 2:
                session_1 = _a.sent();
                if (!session_1) return [3 /*break*/, 9];
                return [4 /*yield*/, companyModel_1.Company.GetChatSettings(session_1.nsp)];
            case 3:
                companySettings = _a.sent();
                index = 0;
                _a.label = 4;
            case 4:
                if (!(index < companySettings['workflow'].form.length)) return [3 /*break*/, 7];
                if (!(companySettings['workflow'].form[index].value.toLowerCase() == data.value.toLowerCase())) return [3 /*break*/, 6];
                //console.log('Here');
                //console.log(origin['workflow']);
                session_1.stateMachine = companySettings['workflow'].form[index].stateMachine.stateMachine;
                stateMachineStates = Object.keys(companySettings['workflow'].form[index].stateMachine.stateMachine);
                session_1.currentState = stateMachineStates[0];
                // session.state = 7;
                session_1.newUser = false;
                return [4 /*yield*/, sessionsManager_1.SessionManager.UpdateSession(session_1.id || session_1._id, session_1, 7, session_1.state)];
            case 5:
                _a.sent();
                //console.log(session);
                setTimeout(function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: 
                            // origin.emit("syncsession", session)
                            return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'V', broadcast: true, eventName: 'syncsession', nsp: session_1.nsp, roomName: [visitorModel_1.Visitor.NotifyOne(session_1)], data: session_1 })];
                            case 1:
                                // origin.emit("syncsession", session)
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); }, 0);
                return [3 /*break*/, 7];
            case 6:
                index++;
                return [3 /*break*/, 4];
            case 7: return [4 /*yield*/, sessionsManager_1.SessionManager.UpdateSession(session_1._id, session_1)];
            case 8:
                _a.sent();
                //EMIT TO ALL SESSIONS THAT ABOUT WORKFLOW INPUT
                //FOR CROSS TAB COMMUNICATION
                res.send({ status: 'ok', state: 7 });
                return [3 /*break*/, 10];
            case 9:
                res.status(401).send({ error: 'error' });
                _a.label = 10;
            case 10: return [3 /*break*/, 12];
            case 11:
                error_29 = _a.sent();
                console.log(error_29);
                console.log('error is workFlowInput');
                res.status(401).send({ error: 'error' });
                return [3 /*break*/, 12];
            case 12: return [2 /*return*/];
        }
    });
}); });
router.post('/updateCredentials', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, temp_5, session, payload, promises, _a, _b, _c, error_30;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 12, , 13]);
                if (!(!req.body.sessionid || !req.body.data)) return [3 /*break*/, 1];
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 11];
            case 1:
                if (req.headers.origin) {
                    res.header("Access-Control-Allow-Origin", req.headers.origin);
                    res.header("Access-Control-Allow-Headers", "content-type");
                    res.header('Access-Control-Allow-Methods', 'GET');
                    res.header('Access-Control-Allow-Credentials', 'true');
                    res.header('Vary', 'Origin, Access-Control-Request-Headers');
                }
                data = req.body.data;
                temp_5 = { id: req.body.sessionid };
                session = void 0;
                return [4 /*yield*/, CheckActive_1.MakeActive({ id: req.body.sessionid, _id: req.body.sessionid }, (data && Object.keys(data).length) ? data : undefined)];
            case 2:
                session = _d.sent();
                if (!session) return [3 /*break*/, 10];
                payload = { id: session.id, session: session };
                _b = (_a = Promise).all;
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({
                        action: 'emit', to: 'V', broadcast: false, eventName: 'userUpdated', nsp: session.nsp, roomName: [visitorModel_1.Visitor.NotifyOne(session)], data: {
                            status: 'credentialsUpdated',
                            username: data.username,
                            email: data.email,
                            phone: data.phone,
                            accountType: (data.accountType) ? data.accountType : '',
                            message: data.message
                        }
                    })];
            case 3:
                _c = [
                    _d.sent()
                ];
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: session.nsp, roomName: [agentModel_1.Agents.NotifyAll()], data: payload })];
            case 4:
                _c = _c.concat([
                    _d.sent()
                ]);
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateUserInfo', nsp: session.nsp, roomName: [agentModel_1.Agents.NotifyOne(session)], data: { cid: session.conversationID, username: session.username, email: session.email, phone: session.phone ? session.phone : '', message: session.message ? session.message : '' } })];
            case 5:
                _c = _c.concat([
                    _d.sent()
                ]);
                return [4 /*yield*/, conversationModel_1.Conversations.UpdateVisitorInfo(session.conversationID, data.username, data.email)];
            case 6:
                _c = _c.concat([
                    _d.sent()
                ]);
                return [4 /*yield*/, visitorModel_1.Visitor.UpdateVisitorInfoByDeviceID(session.deviceID, { username: data.username, email: data.email, phone: (data.phone) ? data.phone : '' })];
            case 7:
                _c = _c.concat([
                    _d.sent()
                ]);
                return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendEventLog(enums_1.EventLogMessages.VISITOR_CREDENTIALS_UPDATED, (session._id) ? session._id : session.id)];
            case 8:
                promises = _b.apply(_a, [_c.concat([
                        _d.sent()
                    ])]);
                return [4 /*yield*/, promises];
            case 9:
                _d.sent();
                res.send({
                    status: 'ok',
                    username: data.username,
                    email: data.email,
                    phone: (data.phone) ? data.phone : '',
                    message: (data.message) ? data.message : '',
                    accountType: (data.accountType) ? data.accountType : ''
                });
                return [3 /*break*/, 11];
            case 10:
                res.status(401).send({ status: 'error' });
                _d.label = 11;
            case 11: return [3 /*break*/, 13];
            case 12:
                error_30 = _d.sent();
                console.log(error_30);
                console.log('error is updateCredentials');
                res.status(401).send({ error: 'error' });
                return [3 /*break*/, 13];
            case 13: return [2 /*return*/];
        }
    });
}); });
router.post('/updateUserInfo', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, sessionID, session, _a, _b, _c, payload, _d, _e, _f, error_31;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                _g.trys.push([0, 17, , 18]);
                if (!(!req.body.sessionid || !req.body.data)) return [3 /*break*/, 1];
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 16];
            case 1:
                if (req.headers.origin) {
                    res.header("Access-Control-Allow-Origin", req.headers.origin);
                    res.header("Access-Control-Allow-Headers", "content-type");
                    res.header('Access-Control-Allow-Methods', 'GET');
                    res.header('Access-Control-Allow-Credentials', 'true');
                    res.header('Vary', 'Origin, Access-Control-Request-Headers');
                }
                data = req.body.data;
                sessionID = req.body.sessionid;
                return [4 /*yield*/, CheckActive_1.MakeActive({ id: sessionID, _id: sessionID })];
            case 2:
                session = _g.sent();
                if (!session) return [3 /*break*/, 15];
                if (!(session && (session.state == 4 || session.state == 3 || session.state == 2))) return [3 /*break*/, 13];
                if (!(data.username && data.email)) return [3 /*break*/, 12];
                data.previousState = ((session.inactive) ? '-' : '') + session.state.toString();
                if (session.state == 4)
                    data.state = 3;
                else
                    data.state = session.state;
                return [4 /*yield*/, sessionsManager_1.SessionManager.UpdateUserInformation(session, data)];
            case 3:
                session = (_g.sent());
                _b = (_a = Promise).all;
                return [4 /*yield*/, visitorModel_1.Visitor.UpdateVisitorInfoByDeviceID(session.deviceID, { username: session.username, email: session.email, phone: (data.phone) ? data.phone : '' })];
            case 4:
                _c = [
                    _g.sent()
                ];
                return [4 /*yield*/, conversationModel_1.Conversations.UpdateVisitorInfo(session.conversationID, session.username, session.email)];
            case 5: return [4 /*yield*/, _b.apply(_a, [_c.concat([
                        _g.sent()
                    ])])];
            case 6:
                _g.sent();
                res.send({ status: 'userUpdated', state: data.state, username: session.username, email: session.email, phone: session.phone ? session.phone : '', message: session.message ? session.message : '' });
                payload = { id: session.id, session: session };
                _e = (_d = Promise).all;
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'V', broadcast: false, eventName: 'userUpdated', nsp: session.nsp, roomName: [visitorModel_1.Visitor.NotifyOne(session)], data: { state: 3, username: session.username, email: session.email, phone: session.phone ? session.phone : '', message: session.message ? session.message : '' } })];
            case 7:
                _f = [
                    _g.sent()
                ];
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: session.nsp, roomName: [agentModel_1.Agents.NotifyAll()], data: payload })];
            case 8:
                _f = _f.concat([
                    _g.sent()
                ]);
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateUserInfo', nsp: session.nsp, roomName: [agentModel_1.Agents.NotifyOne(session)], data: { cid: session.conversationID, username: session.username, email: session.email, phone: session.phone ? session.phone : '', message: session.message ? session.message : '' } })];
            case 9:
                _f = _f.concat([
                    _g.sent()
                ]);
                return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendEventLog(enums_1.EventLogMessages.USER_UPDATED_INFORMATION, (session._id) ? session._id : session.id)];
            case 10: return [4 /*yield*/, _e.apply(_d, [_f.concat([
                        _g.sent()
                    ])])];
            case 11:
                _g.sent();
                _g.label = 12;
            case 12: return [3 /*break*/, 14];
            case 13:
                res.status(401).send({ status: 'error' });
                _g.label = 14;
            case 14: return [3 /*break*/, 16];
            case 15:
                res.status(401).send({ error: 'error' });
                _g.label = 16;
            case 16: return [3 /*break*/, 18];
            case 17:
                error_31 = _g.sent();
                console.log(error_31);
                console.log('error is updateUserInfo');
                res.status(401).send({ error: 'error' });
                return [3 /*break*/, 18];
            case 18: return [2 /*return*/];
        }
    });
}); });
router.post('/submitCustomSurvey', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, sessionID, session, log, result, error_32;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 11, , 12]);
                if (!(!req.body.sessionid || !req.body.customFeedback)) return [3 /*break*/, 1];
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 10];
            case 1:
                if (req.headers.origin) {
                    res.header("Access-Control-Allow-Origin", req.headers.origin);
                    res.header("Access-Control-Allow-Headers", "content-type");
                    res.header('Access-Control-Allow-Methods', 'GET');
                    res.header('Access-Control-Allow-Credentials', 'true');
                    res.header('Vary', 'Origin, Access-Control-Request-Headers');
                }
                data = req.body;
                sessionID = req.body.sessionid;
                return [4 /*yield*/, CheckActive_1.MakeActive({ id: sessionID, _id: sessionID })];
            case 2:
                session = _a.sent();
                if (!session) return [3 /*break*/, 9];
                if (!(session && (session.state == 4 || session.state == 3 || session.state == 2))) return [3 /*break*/, 7];
                log = data.log;
                log.createdDate = new Date().toISOString();
                return [4 /*yield*/, conversationModel_1.Conversations.UpdateDynamicPropertyByVisitor(data.cid, data.customFeedback, log)];
            case 3:
                result = _a.sent();
                if (!(result && result.value)) return [3 /*break*/, 5];
                // console.log(session);
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateConversation', nsp: session.nsp, roomName: [session.agent.id], data: { cid: result.value._id, conversation: result.value } })];
            case 4:
                // console.log(session);
                _a.sent();
                res.send({ status: 'ok', result: result.value });
                return [3 /*break*/, 6];
            case 5:
                res.send({ status: 'error' });
                _a.label = 6;
            case 6: return [3 /*break*/, 8];
            case 7:
                res.status(401).send({ status: 'error' });
                _a.label = 8;
            case 8: return [3 /*break*/, 10];
            case 9:
                res.status(401).send({ error: 'error' });
                _a.label = 10;
            case 10: return [3 /*break*/, 12];
            case 11:
                error_32 = _a.sent();
                console.log(error_32);
                console.log('error is submitCustomSurvey');
                res.status(401).send({ error: 'error' });
                return [3 /*break*/, 12];
            case 12: return [2 /*return*/];
        }
    });
}); });
router.post('/userinformation', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, sessionID, tempCopy_1, session, agentSearch, state, settings, companySettings, greetingMessage, allAgents, locked, temp_6, promises, body_1, credentials, _a, updatedsession, conversation, temp_7, credentials, payload, temp_8, promises, _b, _c, _d, conversation, temp_9, credentials, allocatedAgent, cid, UpdatedSessions, _e, conversation, payload, temp_10, credentials, messageinserted, lastMessage, messageinsertedID, logEvent, UpdatedSessions, _f, conversation, payload, temp_11, credentials, messageinserted, lastMessage, messageinsertedID, logEvent, error_33;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                _g.trys.push([0, 81, , 82]);
                if (!(!req.body.sessionid || !req.body.data)) return [3 /*break*/, 1];
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 80];
            case 1:
                // console.log('userinfo');
                // console.log(req.body);
                if (req.headers.origin) {
                    res.header("Access-Control-Allow-Origin", req.headers.origin);
                    res.header("Access-Control-Allow-Headers", "content-type");
                    res.header('Access-Control-Allow-Methods', 'GET');
                    res.header('Access-Control-Allow-Credentials', 'true');
                    res.header('Vary', 'Origin, Access-Control-Request-Headers');
                }
                data = req.body.data || {};
                sessionID = req.body.sessionid;
                tempCopy_1 = JSON.parse(JSON.stringify(data));
                data['inactive'] = false;
                return [4 /*yield*/, CheckActive_1.MakeActive({ _id: sessionID, id: sessionID }, (data && Object.keys(data).length) ? JSON.parse(JSON.stringify(data)) : undefined)];
            case 2:
                session = _g.sent();
                if (!session) return [3 /*break*/, 79];
                agentSearch = void 0;
                return [4 /*yield*/, AssignmentRuleSetDispatcher_1.ApplyRuleSets(session, data)
                    //console.log(agentSearch);
                ];
            case 3:
                agentSearch = _g.sent();
                state = session.state;
                return [4 /*yield*/, companyModel_1.Company.getSettings(session.nsp)];
            case 4:
                settings = _g.sent();
                companySettings = void 0;
                if (settings && settings.length)
                    companySettings = settings[0];
                greetingMessage = '';
                if (companySettings) {
                    greetingMessage = companySettings['settings']['chatSettings']['greetingMessage'];
                }
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetChattingAgents(session)];
            case 5:
                allAgents = _g.sent();
                if (!!allAgents) return [3 /*break*/, 6];
                res.send({ status: 'noAgent' });
                return [2 /*return*/];
            case 6: return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZC_REDIS.GenerateSID(session.nsp, session._id)];
            case 7:
                locked = _g.sent();
                if (!!locked) return [3 /*break*/, 12];
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetVisitorByID(session._id)];
            case 8:
                temp_6 = _g.sent();
                if (!(temp_6 && temp_6.state == 4)) return [3 /*break*/, 10];
                data.state = 3;
                return [4 /*yield*/, Promise.all([
                        sessionsManager_1.SessionManager.UpdateUserInformation(temp_6, data),
                        __biZZCMiddleWare_1.__BIZZC_REDIS.Increment(temp_6.nsp, temp_6._id)
                    ])];
            case 9:
                promises = _g.sent();
                if (promises[0]) {
                    if (data.hasOwnProperty('inactive'))
                        delete data.inactive;
                    body_1 = '';
                    Object.keys(tempCopy_1).map(function (key) {
                        body_1 += key + ' : ' + tempCopy_1[key] + '<br>';
                    });
                    body_1 += 'country : ' + session.fullCountryName.toString() + '<br>';
                    credentials = {
                        from: temp_6.nsp,
                        to: temp_6.username,
                        body: body_1,
                        cid: '',
                        date: (new Date()).toISOString(),
                        type: 'Visitors',
                        attachment: false,
                        chatFormData: 'Credentials Updated',
                        delivered: true
                    };
                    res.send({
                        agent: promises[0].agent,
                        cid: promises[0].conversationID,
                        state: promises[0].state,
                        username: promises[0].username,
                        email: promises[0].email,
                        credentials: credentials,
                        greetingMessage: '',
                        phone: (promises[0].phone ? promises[0].phone : ''),
                        message: (promises[0].message) ? promises[0].message : ''
                    });
                }
                return [3 /*break*/, 11];
            case 10:
                res.send({ status: 'invalidRequest' });
                _g.label = 11;
            case 11: return [2 /*return*/];
            case 12:
                _a = session.state;
                switch (_a) {
                    case 2: return [3 /*break*/, 13];
                    case 3: return [3 /*break*/, 13];
                    case 4: return [3 /*break*/, 17];
                }
                return [3 /*break*/, 28];
            case 13: return [4 /*yield*/, sessionsManager_1.SessionManager.UpdateUserInformation(session, data)];
            case 14:
                updatedsession = _g.sent();
                if (!updatedsession) return [3 /*break*/, 16];
                return [4 /*yield*/, conversationModel_1.Conversations.GetConversationById(session.conversationID.toString())];
            case 15:
                conversation = _g.sent();
                if (conversation && conversation.length) {
                    temp_7 = '<h5 class="clearfix m-b-10"> Credentials Update </h5>';
                    Object.keys(tempCopy_1).map(function (key) {
                        temp_7 += key + ' : ' + tempCopy_1[key] + '<br>';
                    });
                    temp_7 += 'country : ' + session.fullCountryName.toString() + '<br>';
                    credentials = {
                        from: session.nsp,
                        to: session.username,
                        body: temp_7,
                        cid: conversation[0]._id.toHexString(),
                        date: (new Date()).toISOString(),
                        type: 'Visitors',
                        attachment: false,
                        chatFormData: 'Credentials Updated',
                        delivered: true
                    };
                    res.send({
                        clientID: (conversation && conversation[0].clientID) ? conversation[0].clientID : '',
                        agent: updatedsession.agent,
                        cid: updatedsession.conversationID,
                        state: updatedsession.state,
                        username: updatedsession.username,
                        email: updatedsession.email,
                        credentials: credentials,
                        greetingMessage: '',
                        phone: (updatedsession.phone ? updatedsession.phone : ''),
                        message: (updatedsession.message) ? updatedsession.message : ''
                    });
                }
                else
                    res.send({ status: 'invalidRequest' });
                _g.label = 16;
            case 16: return [2 /*return*/];
            case 17:
                session.state = 3;
                payload = { id: session.id, session: session };
                return [4 /*yield*/, sessionsManager_1.SessionManager.UpdateUserInformation(session, data)];
            case 18:
                temp_8 = _g.sent();
                if (!temp_8) return [3 /*break*/, 26];
                _c = (_b = Promise).all;
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({
                        action: 'emit', to: 'V', broadcast: false, eventName: 'userUpdated', nsp: session.nsp, roomName: [visitorModel_1.Visitor.NotifyOne(session)], data: {
                            status: 'credentialsUpdated',
                            username: data.username,
                            email: data.email,
                            phone: data.phone,
                            message: data.message
                        }
                    })];
            case 19:
                _d = [
                    _g.sent()
                ];
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: session.nsp, roomName: [agentModel_1.Agents.NotifyAll()], data: payload })];
            case 20:
                _d = _d.concat([
                    _g.sent()
                ]);
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateUserInfo', nsp: session.nsp, roomName: [agentModel_1.Agents.NotifyOne(session)], data: { cid: session.conversationID, username: session.username, email: session.email, phone: session.phone ? session.phone : '', message: session.message ? session.message : '' } })];
            case 21:
                _d = _d.concat([
                    _g.sent()
                ]);
                return [4 /*yield*/, conversationModel_1.Conversations.UpdateVisitorInfo(session.conversationID, data.username, data.email)];
            case 22:
                _d = _d.concat([
                    _g.sent()
                ]);
                return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendEventLog(enums_1.EventLogMessages.VISITOR_CREDENTIALS_UPDATED, (session._id) ? session._id : session.id)];
            case 23:
                promises = _c.apply(_b, [_d.concat([
                        _g.sent()
                    ])]);
                return [4 /*yield*/, promises
                    // let customer = await Visitor.getVisitorByDeviceID(session.deviceID)
                    // if (customer && customer.length) {
                    //     console.log(customer);
                    //     console.log(tempCopy);
                    //     if (customer[0].email && ((customer[0].email as string).toLowerCase().indexOf('unregistered') === -1) && (customer[0].email as string).toLowerCase() == (tempCopy.email as string).toLowerCase()) console.log('same');
                    //     else console.log('different');
                    //     // if (tempCopy.email && ((tempCopy.email as string).toLowerCase().indexOf('unregistered') === -1)) await Visitor.UpdateVisitorInfoByDeviceID(session.deviceID, { username: (data.username as string), email: (data.email as string), phone: (data.phone) ? data.phone : '' });
                    // }
                ];
            case 24:
                _g.sent();
                return [4 /*yield*/, conversationModel_1.Conversations.GetConversationById(session.conversationID.toString())];
            case 25:
                conversation = _g.sent();
                if (conversation && conversation.length) {
                    temp_9 = '<h5 class="clearfix m-b-10"> Credentials Update </h5>';
                    Object.keys(tempCopy_1).map(function (key) {
                        temp_9 += key + ' : ' + tempCopy_1[key] + '<br>';
                    });
                    temp_9 += 'country : ' + session.fullCountryName.toString() + '<br>';
                    credentials = {
                        from: session.nsp,
                        to: session.username,
                        body: temp_9,
                        cid: conversation[0]._id.toHexString(),
                        date: (new Date()).toISOString(),
                        type: 'Visitors',
                        attachment: false,
                        chatFormData: 'Credentials Updated',
                        delivered: true
                    };
                    res.send({
                        clientID: '',
                        agent: session.agent,
                        cid: session.conversationID,
                        state: session.state,
                        username: session.username,
                        email: session.email,
                        credentials: credentials,
                        greetingMessage: '',
                        phone: (session.phone ? session.phone : ''),
                        message: (session.message) ? session.message : ''
                    });
                }
                return [3 /*break*/, 27];
            case 26:
                res.status(403).send({ error: 'bad request' });
                _g.label = 27;
            case 27: return [2 /*return*/];
            case 28:
                allocatedAgent = void 0;
                cid = new mongodb_1.ObjectID();
                if (!companySettings['settings']['chatSettings']['assignments'].priorityAgent.trim()) return [3 /*break*/, 53];
                if (!(session.selectedAgent)) return [3 /*break*/, 30];
                return [4 /*yield*/, sessionsManager_1.SessionManager.AllocateAgentPriority(session, session.selectedAgent, cid, undefined, (agentSearch) ? agentSearch : '')];
            case 29:
                _e = _g.sent();
                return [3 /*break*/, 31];
            case 30:
                _e = undefined;
                _g.label = 31;
            case 31:
                UpdatedSessions = _e;
                if (!!UpdatedSessions) return [3 /*break*/, 33];
                return [4 /*yield*/, sessionsManager_1.SessionManager.AllocateAgentPriority(session, companySettings['settings']['chatSettings']['assignments'].priorityAgent.trim(), cid, undefined, (agentSearch) ? agentSearch : '')];
            case 32:
                UpdatedSessions = _g.sent();
                _g.label = 33;
            case 33:
                if (!(UpdatedSessions && UpdatedSessions.agent)) return [3 /*break*/, 51];
                session = UpdatedSessions.visitor;
                allocatedAgent = UpdatedSessions.agent;
                if (!allocatedAgent) return [3 /*break*/, 49];
                return [4 /*yield*/, conversationModel_1.Conversations.createConversation(cid, session.email, session.id, session.nsp, session.viewColor, allocatedAgent.email, session.username, 2, session.deviceID)];
            case 34:
                conversation = _g.sent();
                if (!conversation) return [3 /*break*/, 48];
                if (!(session.url && session.url.length)) return [3 /*break*/, 36];
                return [4 /*yield*/, sessionsManager_1.SessionManager.UpdateChatInitiatedDetails(session._id || session.id, session.url[session.url.length - 1], 'Visitor', ((session.state == 4) || (session.state == 5)) ? true : false)
                    //Visitor State Data to Update
                ];
            case 35:
                _g.sent();
                _g.label = 36;
            case 36:
                payload = { id: session.id, session: session };
                temp_10 = '<h5 class="clearfix m-b-10"> Credentials Update </h5>';
                Object.keys(tempCopy_1).map(function (key) {
                    temp_10 += key + ' : ' + tempCopy_1[key] + '<br>';
                });
                temp_10 += 'country : ' + session.fullCountryName.toString() + '<br>';
                credentials = {
                    from: session.nsp,
                    to: session.username,
                    body: temp_10,
                    cid: conversation.insertedId.toHexString(),
                    date: (new Date()).toISOString(),
                    type: 'Visitors',
                    attachment: false,
                    chatFormData: 'Credentials Updated',
                    delivered: true
                };
                return [4 /*yield*/, conversationModel_1.Conversations.insertMessage(credentials)];
            case 37:
                messageinserted = _g.sent();
                if (!messageinserted) return [3 /*break*/, 42];
                conversation.ops[0].messages.push(messageinserted.ops[0]);
                if (!(!allocatedAgent.greetingMessage || (state == 5))) return [3 /*break*/, 39];
                return [4 /*yield*/, conversationModel_1.Conversations.UpdateLastMessage(conversation.insertedId.toHexString(), credentials)];
            case 38:
                _g.sent();
                return [3 /*break*/, 42];
            case 39:
                greetingMessage = allocatedAgent.greetingMessage;
                if (!(conversation && greetingMessage)) return [3 /*break*/, 42];
                if (!greetingMessage) return [3 /*break*/, 42];
                lastMessage = {
                    from: session.nsp,
                    to: session.username,
                    body: greetingMessage,
                    cid: conversation.insertedId.toHexString(),
                    date: (new Date()).toISOString(),
                    type: 'Agents',
                    attachment: false,
                    delivered: true
                };
                return [4 /*yield*/, conversationModel_1.Conversations.insertMessage(lastMessage)];
            case 40:
                messageinsertedID = _g.sent();
                conversation.ops[0].messages.push(messageinsertedID.ops[1]);
                return [4 /*yield*/, conversationModel_1.Conversations.UpdateLastMessage(conversation.insertedId.toHexString(), lastMessage)];
            case 41:
                _g.sent();
                _g.label = 42;
            case 42:
                if (!allocatedAgent) return [3 /*break*/, 44];
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'newConversation', nsp: session.nsp, roomName: [allocatedAgent.id], data: conversation.ops[0] })];
            case 43:
                _g.sent();
                _g.label = 44;
            case 44: 
            //Broadcast To All Agents That User Information and State Has Been Updated.
            return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: session.nsp, roomName: [agentModel_1.Agents.NotifyAll()], data: payload })];
            case 45:
                //Broadcast To All Agents That User Information and State Has Been Updated.
                _g.sent();
                res.send({
                    clientID: (conversation.ops[0].clientID) ? conversation.ops[0].clientID : '',
                    agent: (allocatedAgent) ? session.agent : {},
                    cid: session.conversationID,
                    state: session.state,
                    username: session.username,
                    email: session.email,
                    credentials: (conversation) ? conversation.ops[0].messages[0] : '',
                    greetingMessage: (conversation) ? conversation.ops[0].messages[1] : '',
                    phone: (session.phone ? session.phone : ''),
                    message: (session.message) ? session.message : ''
                });
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({
                        action: 'emit', to: 'V', broadcast: false, eventName: 'gotAgent', nsp: session.nsp, roomName: [visitorModel_1.Visitor.NotifyOne(session)], data: {
                            clientID: (conversation.ops[0].clientID) ? conversation.ops[0].clientID : '',
                            agent: (allocatedAgent) ? session.agent : {},
                            cid: session.conversationID,
                            state: session.state,
                            username: session.username,
                            email: session.email,
                            credentials: (conversation) ? conversation.ops[0].messages[0] : '',
                            greetingMessage: (conversation) ? conversation.ops[0].messages[1] : '',
                            phone: (session.phone ? session.phone : ''),
                            message: (session.message) ? session.message : ''
                        }, excludeSender: true, sockID: req.body.socketID
                    })];
            case 46:
                _g.sent();
                return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendEventLog(enums_1.EventLogMessages.CHAT_INITIATED, (session._id) ? session._id : session.id)];
            case 47:
                logEvent = _g.sent();
                _g.label = 48;
            case 48: return [3 /*break*/, 50];
            case 49:
                console.log('No Agent');
                res.send({ status: 'noAgent' });
                _g.label = 50;
            case 50: return [3 /*break*/, 52];
            case 51:
                //console.log('No Agent')
                res.send({ status: 'noAgent' });
                _g.label = 52;
            case 52: return [2 /*return*/];
            case 53:
                if (!(session.selectedAgent)) return [3 /*break*/, 55];
                return [4 /*yield*/, sessionsManager_1.SessionManager.AllocateAgentPriority(session, session.selectedAgent, cid, undefined, (agentSearch) ? agentSearch : '')];
            case 54:
                _f = _g.sent();
                return [3 /*break*/, 56];
            case 55:
                _f = undefined;
                _g.label = 56;
            case 56:
                UpdatedSessions = _f;
                if (!!UpdatedSessions) return [3 /*break*/, 58];
                return [4 /*yield*/, sessionsManager_1.SessionManager.AllocateAgent(session, cid, [], undefined, (agentSearch) ? agentSearch : '')];
            case 57:
                UpdatedSessions = _g.sent();
                _g.label = 58;
            case 58:
                if (!UpdatedSessions) return [3 /*break*/, 75];
                // console.log('UpdatedSessions');
                allocatedAgent = UpdatedSessions.agent;
                session = UpdatedSessions.visitor;
                return [4 /*yield*/, conversationModel_1.Conversations.createConversation(cid, session.email, session.id, session.nsp, session.viewColor, (allocatedAgent) ? allocatedAgent.email : '', session.username, (allocatedAgent) ? 2 : 1, session.deviceID)];
            case 59:
                conversation = _g.sent();
                payload = { id: session.id, session: session };
                temp_11 = '<h5 class="clearfix m-b-10"> Credentials Update </h5>';
                Object.keys(tempCopy_1).map(function (key) {
                    temp_11 += key + ' : ' + tempCopy_1[key] + '<br>';
                });
                temp_11 += 'country : ' + session.fullCountryName.toString() + '<br>';
                credentials = {
                    from: session.nsp,
                    to: session.username,
                    body: temp_11,
                    cid: conversation.insertedId.toHexString(),
                    date: (new Date()).toISOString(),
                    type: 'Visitors',
                    attachment: false,
                    chatFormData: 'Credentials Updated',
                    delivered: true
                };
                return [4 /*yield*/, conversationModel_1.Conversations.insertMessage(credentials)];
            case 60:
                messageinserted = _g.sent();
                if (!messageinserted) return [3 /*break*/, 66];
                //if(conversation)console.log('messageinserted');
                conversation.ops[0].messages.push(messageinserted.ops[0]);
                if (!(allocatedAgent && !allocatedAgent.greetingMessage)) return [3 /*break*/, 62];
                return [4 /*yield*/, conversationModel_1.Conversations.UpdateLastMessage(conversation.insertedId.toHexString(), credentials)];
            case 61:
                _g.sent();
                return [3 /*break*/, 63];
            case 62:
                if (allocatedAgent && allocatedAgent.greetingMessage)
                    greetingMessage = allocatedAgent.greetingMessage;
                _g.label = 63;
            case 63:
                if (!(conversation && greetingMessage)) return [3 /*break*/, 66];
                if (!greetingMessage) return [3 /*break*/, 66];
                lastMessage = {
                    from: session.nsp,
                    to: session.username,
                    body: greetingMessage,
                    cid: conversation.insertedId.toHexString(),
                    date: (new Date()).toISOString(),
                    type: 'Agents',
                    attachment: false,
                    delivered: true
                };
                return [4 /*yield*/, conversationModel_1.Conversations.insertMessage(lastMessage)];
            case 64:
                messageinsertedID = _g.sent();
                conversation.ops[0].messages.push(messageinsertedID.ops[0]);
                return [4 /*yield*/, conversationModel_1.Conversations.UpdateLastMessage(conversation.insertedId.toHexString(), lastMessage)];
            case 65:
                _g.sent();
                _g.label = 66;
            case 66:
                if (!(allocatedAgent && conversation)) return [3 /*break*/, 68];
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'newConversation', nsp: session.nsp, roomName: [(allocatedAgent.id || allocatedAgent._id)], data: conversation.ops[0] })];
            case 67:
                _g.sent();
                _g.label = 68;
            case 68: 
            //Broadcast To All Agents That User Information and State Has Been Updated.
            // origin.in(Agents.NotifyAll()).emit('updateUser', payload);
            return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: session.nsp, roomName: [agentModel_1.Agents.NotifyAll()], data: payload })];
            case 69:
                //Broadcast To All Agents That User Information and State Has Been Updated.
                // origin.in(Agents.NotifyAll()).emit('updateUser', payload);
                _g.sent();
                // console.log('sending response');
                res.send({
                    clientID: (conversation.ops[0].clientID) ? conversation.ops[0].clientID : '',
                    agent: (allocatedAgent) ? session.agent : {},
                    cid: session.conversationID,
                    state: session.state,
                    username: session.username,
                    email: session.email,
                    credentials: (conversation) ? conversation.ops[0].messages[0] : '',
                    greetingMessage: (greetingMessage && conversation) ? conversation.ops[0].messages[1] : '',
                    phone: (session.phone ? session.phone : ''),
                    message: (session.message) ? session.message : ''
                });
                if (!conversation) return [3 /*break*/, 74];
                if (!(session.url && session.url.length)) return [3 /*break*/, 71];
                return [4 /*yield*/, sessionsManager_1.SessionManager.UpdateChatInitiatedDetails(session._id || session.id, session.url[session.url.length - 1], 'Visitor', ((session.state == 4) || (session.state == 5)) ? true : false)];
            case 70:
                _g.sent();
                _g.label = 71;
            case 71: return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({
                    action: 'emit', to: 'V', broadcast: false, eventName: 'gotAgent', nsp: session.nsp, roomName: [visitorModel_1.Visitor.NotifyOne(session)], data: {
                        clientID: (conversation.ops[0].clientID) ? conversation.ops[0].clientID : '',
                        agent: (allocatedAgent) ? session.agent : {},
                        cid: session.conversationID,
                        state: session.state,
                        username: session.username,
                        email: session.email,
                        credentials: (conversation) ? conversation.ops[0].messages[0] : '',
                        greetingMessage: (greetingMessage && conversation) ? conversation.ops[0].messages[1] : '',
                        phone: (session.phone ? session.phone : ''),
                        message: (session.message) ? session.message : ''
                    }, excludeSender: true, sockID: req.body.socketID
                })];
            case 72:
                _g.sent();
                return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendEventLog(enums_1.EventLogMessages.CHAT_INITIATED, (session._id) ? session._id : session.id)];
            case 73:
                logEvent = _g.sent();
                _g.label = 74;
            case 74: return [3 /*break*/, 76];
            case 75:
                res.status(500).send({ error: 'internal server error' });
                _g.label = 76;
            case 76:
                if (!(tempCopy_1.email && (tempCopy_1.email.toLowerCase().indexOf('unregistered') === -1))) return [3 /*break*/, 78];
                return [4 /*yield*/, visitorModel_1.Visitor.UpdateVisitorInfoByDeviceID(session.deviceID, { username: data.username, email: data.email, phone: (data.phone) ? data.phone : '' })];
            case 77:
                _g.sent();
                _g.label = 78;
            case 78: return [3 /*break*/, 80];
            case 79:
                res.status(401).send({ error: 'error' });
                _g.label = 80;
            case 80: return [3 /*break*/, 82];
            case 81:
                error_33 = _g.sent();
                console.log(error_33);
                console.log('error is user information');
                res.status(401).send({ error: 'error' });
                return [3 /*break*/, 82];
            case 82: return [2 /*return*/];
        }
    });
}); });
// router.post('/checkSID/', async (req, res) => {
//     try {
//         // console.log('Check SID: ' + req.body.sid);
//         res.header("Access-Control-Allow-Origin", (req.headers.origin as string));
//         res.header("Access-Control-Allow-Headers", "content-type");
//         res.header('Access-Control-Allow-Methods', 'POST');
//         res.header('Access-Control-Allow-Credentials', 'true');
//         res.header('Vary', 'Origin, Access-Control-Request-Headers');
//         res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
//         res.header('Expires', '-1');
//         res.header('Pragma', 'no-cache');
//         if (!req.body.sid) { res.status(401).send(); return; }
//         let result = await __BIZZC_REDIS.Exists(req.body.sid);
//         if (result) res.status(200).send({ status: 'ok' });
//         else res.status(401).send();
//     } catch (error) {
//         res.status(401).send();
//         console.log(error);
//         console.log('error in checkingSID')
//     }
// });
router.post('/requestQueue', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, session, UpdatedSessions, _a, QueuedSession, conversation, _b, queuedEvent, _c, logEvent, error_34;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 21, , 22]);
                if (!(!req.body.sid || !req.body.sessionid)) return [3 /*break*/, 1];
                res.status(401).send();
                return [2 /*return*/];
            case 1:
                if (req.headers.origin) {
                    res.header("Access-Control-Allow-Origin", req.headers.origin);
                    res.header("Access-Control-Allow-Headers", "content-type");
                    res.header('Access-Control-Allow-Methods', 'GET');
                    res.header('Access-Control-Allow-Credentials', 'true');
                    res.header('Vary', 'Origin, Access-Control-Request-Headers');
                }
                data = req.body;
                return [4 /*yield*/, sessionsManager_1.SessionManager.getAgentByEmail(data.nsp, data.sessionid)];
            case 2:
                session = _d.sent();
                if (!session) {
                    res.status(401).send({ status: 'error' });
                    return [2 /*return*/];
                }
                UpdatedSessions = void 0;
                if (!session) return [3 /*break*/, 19];
                if (!!session.permissions.chats.canChat) return [3 /*break*/, 3];
                res.status(401).send({ status: 'notAllowed' });
                return [3 /*break*/, 18];
            case 3:
                if (!(session.permissions.chats.canChat)) return [3 /*break*/, 5];
                return [4 /*yield*/, sessionsManager_1.SessionManager.AssignQueuedVisitor(session, data.sid)];
            case 4:
                _a = _d.sent();
                return [3 /*break*/, 6];
            case 5:
                _a = undefined;
                _d.label = 6;
            case 6:
                UpdatedSessions = _a;
                if (!(UpdatedSessions && UpdatedSessions.agent)) return [3 /*break*/, 17];
                session = UpdatedSessions.agent;
                QueuedSession = UpdatedSessions.visitor;
                if (!(session.email)) return [3 /*break*/, 8];
                return [4 /*yield*/, conversationModel_1.Conversations.TransferChatUnmodified(QueuedSession.conversationID, session.email)];
            case 7:
                _b = _d.sent();
                return [3 /*break*/, 9];
            case 8:
                _b = undefined;
                _d.label = 9;
            case 9:
                conversation = _b;
                if (!(conversation && conversation.value)) return [3 /*break*/, 16];
                queuedEvent = {
                    nsp: session.nsp,
                    agentSessionID: session._id,
                    agentEmail: session.email,
                    queuedOn: new Date().toISOString(),
                };
                //let updatedConversation = await Conversations.UpdateLastPickedTime(conversation.value._id, session.nsp)
                //if (updatedConversation) await Conversations.UpdateQueuedCount(conversation.value._id, session.nsp, queuedEvent)
                // }
                //if (logEvent) origin.to(Agents.NotifyAll()).emit('visitorEventLog', logEvent);
                return [4 /*yield*/, sessionsManager_1.SessionManager.UpdateChatQueHistory(QueuedSession, 'Agent')];
            case 10:
                //let updatedConversation = await Conversations.UpdateLastPickedTime(conversation.value._id, session.nsp)
                //if (updatedConversation) await Conversations.UpdateQueuedCount(conversation.value._id, session.nsp, queuedEvent)
                // }
                //if (logEvent) origin.to(Agents.NotifyAll()).emit('visitorEventLog', logEvent);
                _d.sent();
                _c = conversation.value;
                return [4 /*yield*/, conversationModel_1.Conversations.getMessages1(QueuedSession.conversationID)];
            case 11:
                _c.messages = _d.sent();
                //console.log(conversation.value.messages);
                //Sending Notificiation to All Agent.
                // origin.to(Agents.NotifyAll()).emit('updateUser', { id: QueuedSession.id, session: QueuedSession });
                // //UPDATE QUEUED SESSION VIA PUSH MESSAGE
                // origin.to(Visitor.NotifyOne(QueuedSession)).emit('gotAgent', { agent: QueuedSession.agent, state: 3 });
                // //UPDATE ASSIGNED AGENT CONVERSATIIONS
                // origin.to(Agents.NotifyOne(QueuedSession)).emit('newConversation', conversation.value);
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: QueuedSession.nsp, roomName: [agentModel_1.Agents.NotifyAll()], data: { id: QueuedSession.id, session: QueuedSession } })];
            case 12:
                //console.log(conversation.value.messages);
                //Sending Notificiation to All Agent.
                // origin.to(Agents.NotifyAll()).emit('updateUser', { id: QueuedSession.id, session: QueuedSession });
                // //UPDATE QUEUED SESSION VIA PUSH MESSAGE
                // origin.to(Visitor.NotifyOne(QueuedSession)).emit('gotAgent', { agent: QueuedSession.agent, state: 3 });
                // //UPDATE ASSIGNED AGENT CONVERSATIIONS
                // origin.to(Agents.NotifyOne(QueuedSession)).emit('newConversation', conversation.value);
                _d.sent();
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'V', broadcast: true, eventName: 'gotAgent', nsp: QueuedSession.nsp, roomName: [visitorModel_1.Visitor.NotifyOne(QueuedSession)], data: { agent: QueuedSession.agent, state: 3 } })];
            case 13:
                _d.sent();
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'newConversation', nsp: QueuedSession.nsp, roomName: [agentModel_1.Agents.NotifyOne(QueuedSession)], data: conversation.value })];
            case 14:
                _d.sent();
                res.send({ status: 'ok' });
                return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendEventLog(enums_1.EventLogMessages.REQUEST_FROM_QUEUE, (QueuedSession._id) ? QueuedSession._id : QueuedSession.id)];
            case 15:
                logEvent = _d.sent();
                _d.label = 16;
            case 16: return [3 /*break*/, 18];
            case 17:
                res.status(401).send({ status: 'error' });
                _d.label = 18;
            case 18: return [3 /*break*/, 20];
            case 19:
                res.status(401).send({ status: 'error' });
                _d.label = 20;
            case 20: return [3 /*break*/, 22];
            case 21:
                error_34 = _d.sent();
                console.log(error_34);
                console.log('Error in Request Queue');
                res.status(401).send({ status: 'error' });
                return [3 /*break*/, 22];
            case 22: return [2 /*return*/];
        }
    });
}); });
router.post('/transferChat', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, agent, visitor, TransferredAgent, unset, UpdatedSessions, conversation, _a, endSupervisedChat, _b, _c, chatEvent, insertedMessage, loggedEvent, error_35;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 29, , 30]);
                if (!(!req.body.visitor || !req.body.sessionid)) return [3 /*break*/, 1];
                res.status(401).send();
                return [2 /*return*/];
            case 1:
                if (req.headers.origin) {
                    res.header("Access-Control-Allow-Origin", req.headers.origin);
                    res.header("Access-Control-Allow-Headers", "content-type");
                    res.header('Access-Control-Allow-Methods', 'GET');
                    res.header('Access-Control-Allow-Credentials', 'true');
                    res.header('Vary', 'Origin, Access-Control-Request-Headers');
                }
                data = req.body;
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetAgentByID(data.sessionid)];
            case 2:
                agent = _d.sent();
                if (!agent) {
                    res.status(401).send({ status: 'error' });
                    return [2 /*return*/];
                }
                if (!agent) return [3 /*break*/, 27];
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetVisitorByID(data.visitor.toString())];
            case 3:
                visitor = _d.sent();
                if (visitor && visitor.inactive) {
                    res.send({ transfer: 'error-inactive', msg: "Can't Transfer Inactive Visitor" });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetAgentByID(data.to.id)];
            case 4:
                TransferredAgent = _d.sent();
                if (!visitor) return [3 /*break*/, 25];
                console.log('visitor');
                unset = sessionsManager_1.SessionManager.UnsetChatFromAgent(visitor);
                return [4 /*yield*/, sessionsManager_1.SessionManager.AssignAgent(visitor, (TransferredAgent._id || TransferredAgent.id), visitor.conversationID)];
            case 5:
                UpdatedSessions = _d.sent();
                TransferredAgent = UpdatedSessions.agent;
                visitor = UpdatedSessions.visitor;
                return [4 /*yield*/, unset];
            case 6:
                agent = _d.sent();
                if (!(TransferredAgent.email)) return [3 /*break*/, 8];
                return [4 /*yield*/, conversationModel_1.Conversations.TransferChatUnmodified(visitor.conversationID, TransferredAgent.email)];
            case 7:
                _a = _d.sent();
                return [3 /*break*/, 9];
            case 8:
                _a = undefined;
                _d.label = 9;
            case 9:
                conversation = _a;
                if (!(conversation && conversation.value)) return [3 /*break*/, 23];
                endSupervisedChat = void 0;
                if (!(conversation.value.superviserAgents && conversation.value.superviserAgents.length)) return [3 /*break*/, 11];
                return [4 /*yield*/, conversationModel_1.Conversations.EndSuperVisedChat(conversation.value._id, visitor.nsp, visitor.agent.id)];
            case 10:
                endSupervisedChat = _d.sent();
                _d.label = 11;
            case 11:
                if (endSupervisedChat) {
                    conversation.value.superviserAgents = endSupervisedChat.value.superviserAgents;
                }
                if (!(conversation.value.messageReadCount)) return [3 /*break*/, 13];
                _c = conversation.value;
                return [4 /*yield*/, conversationModel_1.Conversations.getMessages1(visitor.conversationID)];
            case 12:
                _b = _c.messages = _d.sent();
                return [3 /*break*/, 14];
            case 13:
                _b = [];
                _d.label = 14;
            case 14:
                _b;
                chatEvent = 'Chat Transferred from ' + agent.value.nickname + ' to ' + TransferredAgent.nickname;
                // origin.to(Agents.NotifyAll()).emit('updateUser', { id: (visitor as VisitorSessionSchema).id, session: visitor });
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: visitor.nsp, roomName: [agentModel_1.Agents.NotifyAll()], data: { id: visitor.id, session: visitor } })];
            case 15:
                // origin.to(Agents.NotifyAll()).emit('updateUser', { id: (visitor as VisitorSessionSchema).id, session: visitor });
                _d.sent();
                insertedMessage = void 0;
                if (!visitor) return [3 /*break*/, 18];
                return [4 /*yield*/, CreateMessage_1.CreateLogMessage({
                        from: visitor.agent.name,
                        to: (visitor.username) ? visitor.agent.name || visitor.agent.nickname : '',
                        body: chatEvent,
                        type: 'Events',
                        cid: (visitor.conversationID) ? visitor.conversationID : '',
                        attachment: false,
                        date: new Date().toISOString(),
                        delivered: true,
                        sent: true
                    })
                    // origin.to(Visitor.NotifyOne(visitor as VisitorSessionSchema)).emit('transferChat', { agent: (visitor as VisitorSessionSchema).agent, event: chatEvent });
                ];
            case 16:
                insertedMessage = _d.sent();
                // origin.to(Visitor.NotifyOne(visitor as VisitorSessionSchema)).emit('transferChat', { agent: (visitor as VisitorSessionSchema).agent, event: chatEvent });
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'V', broadcast: true, eventName: 'transferChat', nsp: visitor.nsp, roomName: [visitorModel_1.Visitor.NotifyOne(visitor)], data: { agent: visitor.agent, event: chatEvent } })];
            case 17:
                // origin.to(Visitor.NotifyOne(visitor as VisitorSessionSchema)).emit('transferChat', { agent: (visitor as VisitorSessionSchema).agent, event: chatEvent });
                _d.sent();
                _d.label = 18;
            case 18:
                if (!TransferredAgent) return [3 /*break*/, 21];
                if (insertedMessage)
                    conversation.value.messages.push(insertedMessage);
                // origin.to(Agents.NotifyOne(visitor)).emit('newConversation', conversation.value);
                // socket.to(Agents.NotifyOne(agent.value)).emit('removeConversation', { conversation: conversation.value })
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'newConversation', nsp: visitor.nsp, roomName: [agentModel_1.Agents.NotifyOne(visitor)], data: conversation.value })];
            case 19:
                // origin.to(Agents.NotifyOne(visitor)).emit('newConversation', conversation.value);
                // socket.to(Agents.NotifyOne(agent.value)).emit('removeConversation', { conversation: conversation.value })
                _d.sent();
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'removeConversation', nsp: visitor.nsp, roomName: [agentModel_1.Agents.NotifyOne(agent.value)], data: { conversation: conversation.value } })];
            case 20:
                _d.sent();
                _d.label = 21;
            case 21:
                res.send({ transfer: 'ok' });
                return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendEventLog(enums_1.EventLogMessages.CHAT_TRANSFERED, (visitor._id) ? visitor._id : visitor.id)];
            case 22:
                loggedEvent = _d.sent();
                return [3 /*break*/, 24];
            case 23:
                res.status(401).send({ transfer: 'error' });
                _d.label = 24;
            case 24: return [3 /*break*/, 26];
            case 25:
                console.log('no visitor');
                res.status(401).send({ transfer: 'error' });
                _d.label = 26;
            case 26: return [3 /*break*/, 28];
            case 27:
                console.log('no agent');
                res.status(401).send({ status: 'error' });
                _d.label = 28;
            case 28: return [3 /*break*/, 30];
            case 29:
                error_35 = _d.sent();
                console.log(error_35);
                console.log('Error in TransferChat');
                res.status(401).send({ transfer: 'error' });
                return [3 /*break*/, 30];
            case 30: return [2 /*return*/];
        }
    });
}); });
router.post('/getFormsByNSP', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, session, UpdatedSessions, formFromDB, error_36;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                if (!!req.body.sessionid) return [3 /*break*/, 1];
                res.status(401).send();
                return [2 /*return*/];
            case 1:
                if (req.headers.origin) {
                    res.header("Access-Control-Allow-Origin", req.headers.origin);
                    res.header("Access-Control-Allow-Headers", "content-type");
                    res.header('Access-Control-Allow-Methods', 'GET');
                    res.header('Access-Control-Allow-Credentials', 'true');
                    res.header('Vary', 'Origin, Access-Control-Request-Headers');
                }
                data = req.body;
                return [4 /*yield*/, sessionsManager_1.SessionManager.getAgentByEmail(data.nsp, data.sessionid)];
            case 2:
                session = _a.sent();
                if (!session) {
                    res.status(401).send({ status: 'error' });
                    return [2 /*return*/];
                }
                UpdatedSessions = void 0;
                if (!session) return [3 /*break*/, 4];
                return [4 /*yield*/, FormDesignerModel_1.FormDesignerModel.GetForms(data.nsp)];
            case 3:
                formFromDB = _a.sent();
                res.send({ status: 'ok', form_data: (formFromDB && formFromDB.length) ? formFromDB : [] });
                return [3 /*break*/, 5];
            case 4:
                res.status(401).send({ status: 'error' });
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                error_36 = _a.sent();
                console.log(error_36);
                console.log('Error in gettings Canned forms');
                res.status(401).send({ status: 'error' });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
router.post('/requestQueAuto', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, session, UpdatedSessions, origin, result, error_37;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 9, , 10]);
                if (!!req.body.sessionid) return [3 /*break*/, 1];
                res.status(401).send();
                return [2 /*return*/];
            case 1:
                if (req.headers.origin) {
                    res.header("Access-Control-Allow-Origin", req.headers.origin);
                    res.header("Access-Control-Allow-Headers", "content-type");
                    res.header('Access-Control-Allow-Methods', 'GET');
                    res.header('Access-Control-Allow-Credentials', 'true');
                    res.header('Vary', 'Origin, Access-Control-Request-Headers');
                }
                data = req.body;
                return [4 /*yield*/, sessionsManager_1.SessionManager.getAgentByEmail(data.nsp, data.sessionid)];
            case 2:
                session = _a.sent();
                if (!session) {
                    res.status(401).send({ status: 'error' });
                    return [2 /*return*/];
                }
                UpdatedSessions = void 0;
                if (!session) return [3 /*break*/, 7];
                return [4 /*yield*/, companyModel_1.Company.GetChatSettings(session.nsp)];
            case 3:
                origin = _a.sent();
                if (!origin['settings']['chatSettings']['assignments'].aEng) return [3 /*break*/, 5];
                return [4 /*yield*/, AssignChat_1.AutoAssignFromQueueAuto(session, true)];
            case 4:
                result = _a.sent();
                if (result)
                    res.send({ status: 'ok', more: true });
                else
                    res.send({ status: 'ok', more: false });
                return [3 /*break*/, 6];
            case 5:
                res.status(401).send({ status: 'not enabled' });
                _a.label = 6;
            case 6: return [3 /*break*/, 8];
            case 7:
                res.status(401).send({ status: 'error' });
                _a.label = 8;
            case 8: return [3 /*break*/, 10];
            case 9:
                error_37 = _a.sent();
                console.log(error_37);
                console.log('Error in Request Queue auto');
                res.status(401).send({ status: 'error' });
                return [3 /*break*/, 10];
            case 10: return [2 /*return*/];
        }
    });
}); });
router.post('/endSupervisedChat', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, session, UpdatedSessions, updatedConversation, endSupervisedChat, error_38;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 13, , 14]);
                if (!!req.body.sessionid) return [3 /*break*/, 1];
                res.status(401).send();
                return [2 /*return*/];
            case 1:
                if (req.headers.origin) {
                    res.header("Access-Control-Allow-Origin", req.headers.origin);
                    res.header("Access-Control-Allow-Headers", "content-type");
                    res.header('Access-Control-Allow-Methods', 'GET');
                    res.header('Access-Control-Allow-Credentials', 'true');
                    res.header('Vary', 'Origin, Access-Control-Request-Headers');
                }
                data = req.body.data;
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetAgentByID(data.sessionid)];
            case 2:
                session = _a.sent();
                if (!session) {
                    res.status(401).send({ status: 'error' });
                    return [2 /*return*/];
                }
                UpdatedSessions = void 0;
                if (!session) return [3 /*break*/, 11];
                return [4 /*yield*/, conversationModel_1.Conversations.GetConversationById(data.cid)];
            case 3:
                updatedConversation = _a.sent();
                if (!(updatedConversation && updatedConversation.length)) return [3 /*break*/, 9];
                if (!(updatedConversation[0].superviserAgents && updatedConversation[0].superviserAgents.length)) return [3 /*break*/, 8];
                return [4 /*yield*/, conversationModel_1.Conversations.EndSuperVisedChat(data.cid, session.nsp, session._id.toHexString())];
            case 4:
                endSupervisedChat = _a.sent();
                if (!endSupervisedChat) return [3 /*break*/, 7];
                if (!data.removeChat) return [3 /*break*/, 6];
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'removeConversation', nsp: session.nsp, roomName: [agentModel_1.Agents.NotifyOne(session)], data: { conversation: updatedConversation[0] } })];
            case 5:
                _a.sent();
                _a.label = 6;
            case 6:
                res.send({ status: 'ok' });
                return [3 /*break*/, 8];
            case 7:
                res.status(401).send({ status: 'error' });
                _a.label = 8;
            case 8: return [3 /*break*/, 10];
            case 9:
                res.status(401).send({ status: 'error' });
                _a.label = 10;
            case 10: return [3 /*break*/, 12];
            case 11:
                res.status(401).send({ status: 'error' });
                _a.label = 12;
            case 12: return [3 /*break*/, 14];
            case 13:
                error_38 = _a.sent();
                console.log(error_38);
                console.log('error in ending supervising Chat');
                res.status(401).send({ status: 'error' });
                return [3 /*break*/, 14];
            case 14: return [2 /*return*/];
        }
    });
}); });
router.post('/stopVisitorChat', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, session, updatedConversation, _a, conversation, error_39;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 17, , 18]);
                if (!!req.body.sessionid) return [3 /*break*/, 1];
                res.status(401).send();
                return [3 /*break*/, 16];
            case 1:
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
                data = req.body;
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetAgentByID(data.sessionid)];
            case 2:
                session = (_b.sent());
                if (!session) return [3 /*break*/, 15];
                if (!data.conversation) return [3 /*break*/, 13];
                if (!(data.conversation.missed)) return [3 /*break*/, 4];
                return [4 /*yield*/, conversationModel_1.Conversations.StopChat(data.conversation._id, 1)];
            case 3:
                _a = _b.sent();
                return [3 /*break*/, 6];
            case 4: return [4 /*yield*/, conversationModel_1.Conversations.StopChat(data.conversation._id)];
            case 5:
                _a = _b.sent();
                _b.label = 6;
            case 6:
                updatedConversation = _a;
                if (!(updatedConversation && updatedConversation.ok)) return [3 /*break*/, 11];
                return [4 /*yield*/, conversationModel_1.Conversations.GetConversationById(data.conversation._id)];
            case 7:
                conversation = _b.sent();
                if (!(conversation && conversation.length)) return [3 /*break*/, 9];
                res.send({ status: 'ok', conversation: conversation[0] });
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'stopChat', nsp: session.nsp, roomName: [agentModel_1.Agents.NotifyAll()], data: conversation[0] })];
            case 8:
                _b.sent();
                return [3 /*break*/, 10];
            case 9:
                res.status(401).send({ status: 'error' });
                _b.label = 10;
            case 10: return [3 /*break*/, 12];
            case 11:
                res.status(401).send({ status: 'error' });
                _b.label = 12;
            case 12: return [3 /*break*/, 14];
            case 13:
                res.status(401).send({ status: 'error' });
                _b.label = 14;
            case 14: return [3 /*break*/, 16];
            case 15:
                res.status(401).send({ status: 'error' });
                _b.label = 16;
            case 16: return [3 /*break*/, 18];
            case 17:
                error_39 = _b.sent();
                res.status(401).send();
                console.log(error_39);
                return [3 /*break*/, 18];
            case 18: return [2 /*return*/];
        }
    });
}); });
router.post('/addConversationTags', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, session, result, error_40;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                if (!!req.body.sessionid) return [3 /*break*/, 1];
                res.status(401).send();
                return [3 /*break*/, 5];
            case 1:
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
                data = req.body;
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetAgentByID(data.sessionid)];
            case 2:
                session = (_a.sent());
                if (!session) return [3 /*break*/, 4];
                return [4 /*yield*/, conversationModel_1.Conversations.addConversationTags(data._id, session.nsp, data.tag, data.conversationLog)];
            case 3:
                result = _a.sent();
                if (result && result.value) {
                    res.send({ status: 'ok' });
                }
                else {
                    res.status(401).send({ status: 'error' });
                }
                return [3 /*break*/, 5];
            case 4:
                res.status(401).send({ status: 'error' });
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                error_40 = _a.sent();
                res.status(401).send({ status: 'error' });
                console.log(error_40);
                console.log('Error in Adding Tags');
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
router.post('/deleteConversationTag', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, session, result, error_41;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                if (!!req.body.sessionid) return [3 /*break*/, 1];
                res.status(401).send();
                return [3 /*break*/, 5];
            case 1:
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
                data = req.body;
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetAgentByID(data.sessionid)];
            case 2:
                session = (_a.sent());
                if (!session) return [3 /*break*/, 4];
                return [4 /*yield*/, conversationModel_1.Conversations.deleteConversationTag(data._id, session.nsp, data.tag, data.index)];
            case 3:
                result = _a.sent();
                if (result && result.value) {
                    res.send({ status: 'ok', deletedresult: result.value.tags });
                }
                else {
                    res.status(401).send({ status: 'error', msg: 'could not delete tag' });
                }
                return [3 /*break*/, 5];
            case 4:
                res.status(401).send({ status: 'error' });
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                error_41 = _a.sent();
                res.status(401).send({ status: 'error' });
                console.log(error_41);
                console.log('Error in deleting Tags');
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
router.post('/botTransferToAgent', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, session, error_42;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                if (!!req.body.sessionid) return [3 /*break*/, 1];
                res.status(401).send();
                return [3 /*break*/, 5];
            case 1:
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
                data = req.body;
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetAgentByID(data.sessionid)];
            case 2:
                session = (_a.sent());
                if (!session) return [3 /*break*/, 4];
                return [4 /*yield*/, AssignChat_1.AssignChatToVisitorAuto(session)];
            case 3:
                _a.sent();
                res.send({ status: 'ok' });
                return [3 /*break*/, 5];
            case 4:
                res.status(401).send({ status: 'error' });
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                error_42 = _a.sent();
                res.status(401).send({ status: 'error' });
                console.log(error_42);
                console.log('Error in transferring chat from bot to agent');
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
router.post('/endChat', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, alreadyEnded, session, origin, sessionData, updatedConversation, _a, agents, packet, endChatMsg, endChatMessage, unAssignedTicket, event, loggedEvent, error_43;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 36, , 37]);
                if (!!req.body.sid) return [3 /*break*/, 1];
                res.status(401).send();
                return [3 /*break*/, 35];
            case 1:
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
                data = req.body;
                alreadyEnded = false;
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetVisitorByID(req.body.sid)];
            case 2:
                session = (_b.sent());
                if (!!session) return [3 /*break*/, 4];
                alreadyEnded = true;
                return [4 /*yield*/, visitorSessionmodel_1.visitorSessions.getVisitorSession(data.sid)];
            case 3:
                session = _b.sent();
                _b.label = 4;
            case 4:
                if (!((session && !alreadyEnded) || (alreadyEnded && session && session.length))) return [3 /*break*/, 34];
                if (session.inactive && data.chatEndedByAgent) {
                    res.send({ status: 'error-inactive', msg: "Can't End Chat of Inactive Visitor" });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, companyModel_1.Company.getSettings(session.nsp)];
            case 5:
                origin = _b.sent();
                if (!session.conversationID) return [3 /*break*/, 33];
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetSessionForChat((session._id || session.id))];
            case 6:
                sessionData = _b.sent();
                if (!(session.state == 2)) return [3 /*break*/, 8];
                return [4 /*yield*/, conversationModel_1.Conversations.EndChatMissed(session.conversationID, (data) ? data : '')];
            case 7:
                _a = _b.sent();
                return [3 /*break*/, 10];
            case 8: return [4 /*yield*/, conversationModel_1.Conversations.EndChat(session.conversationID, true, (data) ? data : '')];
            case 9:
                _a = _b.sent();
                _b.label = 10;
            case 10:
                updatedConversation = _a;
                if (!(updatedConversation && updatedConversation.value)) return [3 /*break*/, 26];
                if (!data.chatEndedByAgent) return [3 /*break*/, 12];
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'V', broadcast: false, eventName: 'endChatByAgent', nsp: session.nsp, roomName: [session.id || session._id], data: {} })];
            case 11:
                _b.sent();
                _b.label = 12;
            case 12: return [4 /*yield*/, sessionsManager_1.SessionManager.RemoveSession(session, (session.state == 8) ? false : true)];
            case 13:
                _b.sent();
                __biZZCMiddleWare_1.__BIZZC_REDIS.SetID(session._id || session.id, 5);
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'disconnect', data: session })
                    // console.log('Chat End')
                ];
            case 14:
                _b.sent();
                // console.log('Chat End')
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'removeUser', nsp: session.nsp, roomName: [agentModel_1.Agents.NotifyAll()], data: session.id || session._id })];
            case 15:
                // console.log('Chat End')
                _b.sent();
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'V', broadcast: false, eventName: 'allPopUpWindowsClose', nsp: session.nsp, roomName: [session.id || session._id], data: {} })];
            case 16:
                _b.sent();
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'V', broadcast: false, eventName: 'allHelpSupportWindowsClose', nsp: session.nsp, roomName: [session.id || session._id], data: {} })];
            case 17:
                _b.sent();
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'stopConversation', nsp: session.nsp, roomName: [agentModel_1.Agents.NotifyOne(session)], data: { conversation: updatedConversation.value }, })];
            case 18:
                _b.sent();
                if (!(session.state == 8)) return [3 /*break*/, 21];
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetIDsOfBotAuthorizedAgents(session.nsp)];
            case 19:
                agents = _b.sent();
                if (!(agents && agents.length)) return [3 /*break*/, 21];
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'stopConversation', nsp: session.nsp, roomName: [agents], data: { conversation: updatedConversation.value }, })];
            case 20:
                _b.sent();
                _b.label = 21;
            case 21:
                res.status(200).send({ status: 'ok', conversation: (updatedConversation && updatedConversation.value) ? updatedConversation.value : '' });
                if (!(updatedConversation && updatedConversation.value && updatedConversation.value.superviserAgents && updatedConversation.value.superviserAgents.length)) return [3 /*break*/, 23];
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'removeConversation', nsp: session.nsp, roomName: updatedConversation.value.superviserAgents, data: { conversation: updatedConversation.value }, })];
            case 22:
                _b.sent();
                _b.label = 23;
            case 23:
                packet = { action: 'endConversation', cid: session.conversationID };
                return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendMessage({ action: 'startConversation', conversation: updatedConversation.value }, constants_1.ARCHIVINGQUEUE)];
            case 24:
                _b.sent();
                return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendMessage(packet, constants_1.ARCHIVINGQUEUE)];
            case 25:
                _b.sent();
                _b.label = 26;
            case 26:
                endChatMsg = void 0;
                //else {
                endChatMsg = {
                    type: "Events",
                    cid: session.conversationID ? session.conversationID : "",
                    attachment: false,
                    date: new Date().toISOString(),
                    chatFormData: ''
                };
                endChatMsg.from = (data.chatEndedByAgent) ? session.agent.name : (session.username) ? session.username : "";
                endChatMsg.to = (data.chatEndedByAgent) ? session.username : session.agent ? session.agent : undefined;
                endChatMsg.body = 'Chat ended by ' + ((data.chatEndedByAgent) ? session.agent.name : session.username);
                return [4 /*yield*/, CreateMessage_1.CreateLogMessage(endChatMsg)];
            case 27:
                endChatMessage = _b.sent();
                if (!endChatMessage) return [3 /*break*/, 29];
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'privateMessage', nsp: session.nsp, roomName: [agentModel_1.Agents.NotifyOne(session)], data: endChatMessage })];
            case 28:
                _b.sent();
                _b.label = 29;
            case 29:
                if (!(updatedConversation && updatedConversation.value)) return [3 /*break*/, 33];
                unAssignedTicket = void 0;
                if (!((!session.agent.id && (session.state == 2)) && (session.email && session.email.toLowerCase() != 'unregistered'))) return [3 /*break*/, 31];
                return [4 /*yield*/, missedChatToTicket_1.ChatToTicket(updatedConversation.value, data.timeZone)];
            case 30:
                unAssignedTicket = _b.sent();
                _b.label = 31;
            case 31:
                event = 'Chat Ended';
                return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendEventLog(enums_1.EventLogMessages.ENDCHAT, (session._id) ? session._id : session.id)];
            case 32:
                loggedEvent = _b.sent();
                _b.label = 33;
            case 33: return [3 /*break*/, 35];
            case 34:
                res.status(401).send();
                _b.label = 35;
            case 35: return [3 /*break*/, 37];
            case 36:
                error_43 = _b.sent();
                console.log('error in ending Chat by ' + ((req.body.chatEndedByAgent) ? 'Agent side' : 'Visitor side'));
                res.status(401).send();
                console.log(error_43);
                return [3 /*break*/, 37];
            case 37: return [2 /*return*/];
        }
    });
}); });
router.post('/InsertSimilarCustomers', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, conversation, error_44;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                //  if (!req.body.sessionid) res.status(401).send('Invalid Request!');
                //else {
                if (req.headers.origin) {
                    res.header("Access-Control-Allow-Origin", req.headers.origin);
                    res.header("Access-Control-Allow-Headers", "content-type");
                    res.header('Access-Control-Allow-Methods', 'GET');
                    res.header('Access-Control-Allow-Credentials', 'true');
                    res.header('Vary', 'Origin, Access-Control-Request-Headers');
                }
                data = req.body;
                return [4 /*yield*/, conversationModel_1.Conversations.InsertSimilar(data.allCustomers, data.cid, data.nsp)];
            case 1:
                conversation = _a.sent();
                if (conversation && conversation.value) {
                    res.send({ status: 'ok', conversation: conversation.value });
                }
                else {
                    res.status(401).send({ error: 'error' });
                }
                return [3 /*break*/, 3];
            case 2:
                error_44 = _a.sent();
                console.log(error_44);
                console.log('error is inserting similar customers');
                res.status(401).send({ error: 'error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/InsertCustomerInfo', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, conversation, error_45;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                //  if (!req.body.sessionid) res.status(401).send('Invalid Request!');
                //else {
                if (req.headers.origin) {
                    res.header("Access-Control-Allow-Origin", req.headers.origin);
                    res.header("Access-Control-Allow-Headers", "content-type");
                    res.header('Access-Control-Allow-Methods', 'GET');
                    res.header('Access-Control-Allow-Credentials', 'true');
                    res.header('Vary', 'Origin, Access-Control-Request-Headers');
                }
                data = req.body;
                return [4 /*yield*/, conversationModel_1.Conversations.InsertCustomerInfo(data.customerInfo, data.cid, data.nsp)];
            case 1:
                conversation = _a.sent();
                if (conversation && conversation.value) {
                    res.send({ status: 'ok', conversation: conversation.value });
                }
                else {
                    res.status(401).send({ error: 'error' });
                }
                return [3 /*break*/, 3];
            case 2:
                error_45 = _a.sent();
                console.log(error_45);
                console.log('error is insert customer info');
                res.status(401).send({ error: 'error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/SaveFormDetails', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, conversation, error_46;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                //  if (!req.body.sessionid) res.status(401).send('Invalid Request!');
                //else {
                if (req.headers.origin) {
                    res.header("Access-Control-Allow-Origin", req.headers.origin);
                    res.header("Access-Control-Allow-Headers", "content-type");
                    res.header('Access-Control-Allow-Methods', 'GET');
                    res.header('Access-Control-Allow-Credentials', 'true');
                    res.header('Vary', 'Origin, Access-Control-Request-Headers');
                }
                data = req.body;
                return [4 /*yield*/, conversationModel_1.Conversations.InsertFormDetails(data.stockFormData, data.cid, data.nsp)];
            case 1:
                conversation = _a.sent();
                if (conversation && conversation.value) {
                    res.send({ status: 'ok', conversation: conversation.value });
                }
                else {
                    res.status(401).send({ error: 'error' });
                }
                return [3 /*break*/, 3];
            case 2:
                error_46 = _a.sent();
                console.log(error_46);
                console.log('error is  save Form Details');
                res.status(401).send({ error: 'error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/InsertStock', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, conversation, error_47;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                //  if (!req.body.sessionid) res.status(401).send('Invalid Request!');
                //else {
                if (req.headers.origin) {
                    res.header("Access-Control-Allow-Origin", req.headers.origin);
                    res.header("Access-Control-Allow-Headers", "content-type");
                    res.header('Access-Control-Allow-Methods', 'GET');
                    res.header('Access-Control-Allow-Credentials', 'true');
                    res.header('Vary', 'Origin, Access-Control-Request-Headers');
                }
                data = req.body;
                return [4 /*yield*/, conversationModel_1.Conversations.InsertStockList(data.stockList, data.stockURL, data.cid, data.nsp)];
            case 1:
                conversation = _a.sent();
                if (conversation && conversation.value) {
                    res.send({ status: 'ok', conversation: conversation.value });
                }
                else {
                    res.status(401).send({ error: 'error' });
                }
                return [3 /*break*/, 3];
            case 2:
                error_47 = _a.sent();
                console.log(error_47);
                console.log('error is insert stock');
                res.status(401).send({ error: 'error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/RemoveStock', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, conversation, error_48;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                //  if (!req.body.sessionid) res.status(401).send('Invalid Request!');
                //else {
                if (req.headers.origin) {
                    res.header("Access-Control-Allow-Origin", req.headers.origin);
                    res.header("Access-Control-Allow-Headers", "content-type");
                    res.header('Access-Control-Allow-Methods', 'GET');
                    res.header('Access-Control-Allow-Credentials', 'true');
                    res.header('Vary', 'Origin, Access-Control-Request-Headers');
                }
                data = req.body;
                return [4 /*yield*/, conversationModel_1.Conversations.RemoveStockList(data.cid, data.nsp)];
            case 1:
                conversation = _a.sent();
                if (conversation && conversation.value) {
                    res.send({ status: 'ok', conversation: conversation.value });
                }
                else {
                    res.status(401).send({ error: 'error' });
                }
                return [3 /*break*/, 3];
            case 2:
                error_48 = _a.sent();
                console.log(error_48);
                console.log('error is remove stock');
                res.status(401).send({ error: 'error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/InsertStockData', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, stock, error_49;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                //  if (!req.body.sessionid) res.status(401).send('Invalid Request!');
                //else {
                if (req.headers.origin) {
                    res.header("Access-Control-Allow-Origin", req.headers.origin);
                    res.header("Access-Control-Allow-Headers", "content-type");
                    res.header('Access-Control-Allow-Methods', 'GET');
                    res.header('Access-Control-Allow-Credentials', 'true');
                    res.header('Vary', 'Origin, Access-Control-Request-Headers');
                }
                data = req.body;
                return [4 /*yield*/, stockModel_1.Stock.InsertStockData(data.cid, data.nsp, data.email, data.make, data.car, data.model, data.type, data.dealerStock, data.country, data.location)];
            case 1:
                stock = _a.sent();
                if (stock) {
                    res.send({ status: 'ok', stock: stock });
                }
                else {
                    res.status(401).send({ error: 'error' });
                }
                return [3 /*break*/, 3];
            case 2:
                error_49 = _a.sent();
                console.log(error_49);
                console.log('error is insert stock data');
                res.status(401).send({ error: 'error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/InsertID', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, conversation, error_50;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                //  if (!req.body.sessionid) res.status(401).send('Invalid Request!');
                //else {
                if (req.headers.origin) {
                    res.header("Access-Control-Allow-Origin", req.headers.origin);
                    res.header("Access-Control-Allow-Headers", "content-type");
                    res.header('Access-Control-Allow-Methods', 'GET');
                    res.header('Access-Control-Allow-Credentials', 'true');
                    res.header('Vary', 'Origin, Access-Control-Request-Headers');
                }
                data = req.body;
                return [4 /*yield*/, conversationModel_1.Conversations.InsertCustomerID(data.customerID, data.cid, data.nsp)];
            case 1:
                conversation = _a.sent();
                if (conversation && conversation.value) {
                    res.send({ status: 'ok', conversation: conversation.value });
                }
                else {
                    res.status(401).send({ error: 'error' });
                }
                return [3 /*break*/, 3];
            case 2:
                error_50 = _a.sent();
                console.log(error_50);
                console.log('error is insertID');
                res.status(401).send({ error: 'error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/IsCustomer', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, conversation, error_51;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                //  if (!req.body.sessionid) res.status(401).send('Invalid Request!');
                //else {
                if (req.headers.origin) {
                    res.header("Access-Control-Allow-Origin", req.headers.origin);
                    res.header("Access-Control-Allow-Headers", "content-type");
                    res.header('Access-Control-Allow-Methods', 'GET');
                    res.header('Access-Control-Allow-Credentials', 'true');
                    res.header('Vary', 'Origin, Access-Control-Request-Headers');
                }
                data = req.body;
                return [4 /*yield*/, conversationModel_1.Conversations.InsertCustomerRegistration(data.registered, data.cid, data.nsp)];
            case 1:
                conversation = _a.sent();
                if (conversation && conversation.value) {
                    res.send({ status: 'ok', conversation: conversation.value });
                }
                else {
                    res.status(401).send({ error: 'error' });
                }
                return [3 /*break*/, 3];
            case 2:
                error_51 = _a.sent();
                console.log(error_51);
                console.log('error in ISCustomer');
                res.status(401).send({ error: 'error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/MasterData', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, masterDataDevelopmentURL, masterDataStagingURL, masterDataProductionURL, masterData, response, error_52;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                // if (!req.body.sessionid) res.status(401).send('Invalid Request!');
                // else {
                if (req.headers.origin) {
                    res.header("Access-Control-Allow-Origin", req.headers.origin);
                    res.header("Access-Control-Allow-Headers", "content-type");
                    res.header('Access-Control-Allow-Methods', 'GET');
                    res.header('Access-Control-Allow-Credentials', 'true');
                    res.header('Vary', 'Origin, Access-Control-Request-Headers');
                }
                data = req.body;
                masterDataDevelopmentURL = "https://iconnapifunc00-common-development.iconn-asestaging01.p.azurewebsites.net/api/GetMasterData?code=2oemNvWziDt2XxZXfL6jSJBFj8NbH8SoycTgyDKYaJ9/iALDs1ap7Q==";
                masterDataStagingURL = "http://iconnapifunc00-common-staging.iconn-asestaging01.p.azurewebsites.net/api/GetMasterData?code=o9mhVZ8tAmTagZHYXFLTx6BzyqtUtCHahZqnp7S7ovZJqQ2kPRjBMQ==";
                masterDataProductionURL = "https://iconnapifunc00-common.iconn-asestaging01.p.azurewebsites.net/api/GetMasterData?code=Bg5TFyJnSpRJ7s5ecl0Rfv8Y/HK7yIYuKLmdMQOUCum0ygEywNHK1Q==";
                masterData = {
                    "MasterDataTypeId": data.ID
                };
                return [4 /*yield*/, request.post({
                        uri: masterDataProductionURL,
                        body: masterData,
                        json: true,
                        timeout: 10000
                    })];
            case 1:
                response = _a.sent();
                //  console.log(JSON.parse(JSON.stringify(response)),masterDataProductionURL)
                if (response) {
                    //console.log(JSON.parse(JSON.stringify(response)))
                    res.send({ status: 'ok', response: response });
                }
                else
                    res.status(401).send({ error: 'error' });
                return [3 /*break*/, 3];
            case 2:
                error_52 = _a.sent();
                // console.log(error);
                console.log('error in Master Data');
                res.status(401).send({ error: 'error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/CarNameMasterData', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, carNameDevelopmentURL, carNameStagingURL, carNameProductionURL, carName, response, error_53;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                // if (!req.body.sessionid) res.status(401).send('Invalid Request!');
                // else {
                if (req.headers.origin) {
                    res.header("Access-Control-Allow-Origin", req.headers.origin);
                    res.header("Access-Control-Allow-Headers", "content-type");
                    res.header('Access-Control-Allow-Methods', 'GET');
                    res.header('Access-Control-Allow-Credentials', 'true');
                    res.header('Vary', 'Origin, Access-Control-Request-Headers');
                }
                data = req.body;
                carNameDevelopmentURL = "http://iconnapifunc00-common-development.iconn-asestaging01.p.azurewebsites.net/api/GetCarNameMasterData?code=l1mciaC5LY2fiTnoiZvOt4JbRxmC5UFqLeziJlKrMuss4NcdBrJFSA==";
                carNameStagingURL = "";
                carNameProductionURL = "https://iconnapifunc00-common.iconn-asestaging01.p.azurewebsites.net//api/GetCarNameMasterData?code=GoXj3gRhXvdaSmy/Uxx2dunpamAUx7somiibev46CGYB51q1/4kCEg==";
                carName = {
                    "CarMakerId": data.ID
                };
                return [4 /*yield*/, request.post({
                        uri: carNameProductionURL,
                        body: carName,
                        json: true,
                        timeout: 10000
                    })];
            case 1:
                response = _a.sent();
                if (response) {
                    //console.log(JSON.parse(JSON.stringify(response)))
                    res.send({ status: 'ok', response: response });
                }
                else
                    res.status(401).send({ error: 'error' });
                return [3 /*break*/, 3];
            case 2:
                error_53 = _a.sent();
                // console.log(error);
                console.log('error in Master Data');
                res.status(401).send({ error: 'error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/CarModelMasterData', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, carModelDevelopmentURL, carModelStagingURL, carModelProductionURL, carModel, response, error_54;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                // if (!req.body.sessionid) res.status(401).send('Invalid Request!');
                // else {
                if (req.headers.origin) {
                    res.header("Access-Control-Allow-Origin", req.headers.origin);
                    res.header("Access-Control-Allow-Headers", "content-type");
                    res.header('Access-Control-Allow-Methods', 'GET');
                    res.header('Access-Control-Allow-Credentials', 'true');
                    res.header('Vary', 'Origin, Access-Control-Request-Headers');
                }
                data = req.body;
                carModelDevelopmentURL = "http://iconnapifunc00-common-development.iconn-asestaging01.p.azurewebsites.net/api/GetModelCodeMasterData?code=WV3zhkC31HFA3ujdfFUuu8lsXILXK6gjoMhdDuHFq3X/Zg1HQDfPXg==";
                carModelStagingURL = "";
                carModelProductionURL = "https://iconnapifunc00-common.iconn-asestaging01.p.azurewebsites.net/api/GetModelCodeMasterData?code=/UT70VoszwZEHV70Fwfco2UTdLXvq/yG4Um9X/kUNS/0QNcEuo7HDA==";
                carModel = {
                    "CarMakerId": data.makerID,
                    "CarName": data.nameID
                };
                return [4 /*yield*/, request.post({
                        uri: carModelProductionURL,
                        body: carModel,
                        json: true,
                        timeout: 10000
                    })];
            case 1:
                response = _a.sent();
                if (response) {
                    //console.log(JSON.parse(JSON.stringify(response)))
                    res.send({ status: 'ok', response: response });
                }
                else
                    res.status(401).send({ error: 'error' });
                return [3 /*break*/, 3];
            case 2:
                error_54 = _a.sent();
                // console.log(error);
                console.log('error in Master Data');
                res.status(401).send({ error: 'error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/SalesAgent', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, SalesAgentDevelopmentURL, SalesAgentStagingURL, SalesAgentProductionURL, agentsList, response, error_55;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                // if (!req.body.sessionid) res.status(401).send('Invalid Request!');
                // else {
                if (req.headers.origin) {
                    res.header("Access-Control-Allow-Origin", req.headers.origin);
                    res.header("Access-Control-Allow-Headers", "content-type");
                    res.header('Access-Control-Allow-Methods', 'GET');
                    res.header('Access-Control-Allow-Credentials', 'true');
                    res.header('Vary', 'Origin, Access-Control-Request-Headers');
                }
                data = req.body;
                SalesAgentDevelopmentURL = "https://iconnapifunc00-common-development.iconn-asestaging01.p.azurewebsites.net/api/GetSalesAgentMasterData?code=XJRNKdOqz0wVZ70OS1PnyKENagzTTBDqPUKraprB/2DAgEJY431lEw==";
                SalesAgentStagingURL = "http://iconnapifunc00-common-staging.iconn-asestaging01.p.azurewebsites.net/api/GetSalesAgentMasterData?code=8y95oYD4MKeY2lNa0N5wzufLfv1ZJKOklBG47x1FHaBemCJTFbooHQ==";
                SalesAgentProductionURL = "https://iconnapifunc00-common.iconn-asestaging01.p.azurewebsites.net/api/GetSalesAgentMasterData?code=jdTaSwW7fA63CXiPdKcKFwS/5x9cPhscWlaW9TsmepX/idjPZpXu6g==";
                agentsList = {
                    "CountryId": data.ID,
                    "IncOrganizerFlg": "1",
                    "IncDivisionManagerFlg": "1",
                    "IncGeneralManagerFlg": "1",
                    "IncLocalManagerFlg": "1",
                    "IncRegularEmplyeeFlg": "1",
                    "IncMarketingFlg": "1"
                };
                return [4 /*yield*/, request.post({
                        uri: SalesAgentProductionURL,
                        body: agentsList,
                        json: true,
                        timeout: 10000
                    })];
            case 1:
                response = _a.sent();
                if (response) {
                    //  console.log(response)
                    res.send({ status: 'ok', response: response });
                }
                else
                    res.status(401).send({ error: 'error' });
                return [3 /*break*/, 3];
            case 2:
                error_55 = _a.sent();
                console.log(error_55);
                console.log('error in Master Data');
                res.status(401).send({ error: 'error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/CheckRegistration', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var checkRegistrationDevelopment, checkRegistrationStaging, checkRegistrationProduction, data, customerData, response, error_56;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                // if (!req.body.sessionid) res.status(401).send('Invalid Request!');
                // else {
                if (req.headers.origin) {
                    res.header("Access-Control-Allow-Origin", req.headers.origin);
                    res.header("Access-Control-Allow-Headers", "content-type");
                    res.header('Access-Control-Allow-Methods', 'GET');
                    res.header('Access-Control-Allow-Credentials', 'true');
                    res.header('Vary', 'Origin, Access-Control-Request-Headers');
                }
                checkRegistrationDevelopment = "https://iconnapifunc01-beelinks-development.iconn-asestaging01.p.azurewebsites.net/api/GetCustomerDetail?code=5LvO9KTTXAkEnka14rDoSKR0T8mSytIEl/fA7zBE5Os4wc3rZArOTw==";
                checkRegistrationStaging = "http://iconnapifunc01-beelinks-staging.iconn-asestaging01.p.azurewebsites.net/api/GetCustomerDetail?code=FAHyfi7kJqKD84O0MXs75GAoy7qh/ObKHnH6qlkN3qr1aI6OXbVCKg==";
                checkRegistrationProduction = "https://iconnapifunc01-beelinks.iconn-asestaging01.p.azurewebsites.net/api/GetCustomerDetail?code=DTrIaDFTaKSCXoHBXQyA1wVOCKpULKaaOPmxgcxq7lx16XR0GM9G2Q==";
                data = req.body;
                customerData = {
                    "MailAddress": (data.custData) ? data.custData.trim().toLowerCase() : '',
                    "PhoneNumber": (data.phone) ? data.phone : '',
                    "StockId": '',
                    "CustomerId": (data.customerID) ? data.customerID : '',
                };
                return [4 /*yield*/, request.post({
                        uri: checkRegistrationProduction,
                        body: customerData,
                        json: true,
                        timeout: 80000
                    })];
            case 1:
                response = _a.sent();
                if (response) {
                    //  console.log(response)
                    res.send({ status: 'ok', response: response });
                }
                else
                    res.status(401).send({ error: 'error' });
                return [3 /*break*/, 3];
            case 2:
                error_56 = _a.sent();
                // console.log(error);
                console.log('error in getting registered customer');
                res.status(401).send({ error: 'error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/RegisterCustomer', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var registerCustomerDevelopment, registerCustomerStaging, registerCustomerProduction, data, customerData, response, error_57;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                // if (!req.body.sessionid) res.status(401).send('Invalid Request!');
                // else {
                if (req.headers.origin) {
                    res.header("Access-Control-Allow-Origin", req.headers.origin);
                    res.header("Access-Control-Allow-Headers", "content-type");
                    res.header('Access-Control-Allow-Methods', 'GET');
                    res.header('Access-Control-Allow-Credentials', 'true');
                    res.header('Vary', 'Origin, Access-Control-Request-Headers');
                }
                registerCustomerDevelopment = "http://iconnapifunc01-beelinks-development.iconn-asestaging01.p.azurewebsites.net/api/RegisterCustomer?code=VG8ShVbAq5QVfb8K0mkanDeoq63qz9aN0KIcppb1CCYGNRNSGO3fTA==";
                registerCustomerStaging = "http://iconnapifunc01-beelinks-staging.iconn-asestaging01.p.azurewebsites.net/api/RegisterCustomer?code=PdSaRLUU48BkwakllFMnYcaHIEZ7qpvJbaOm11i88rGvoEAmLPYOcQ==";
                registerCustomerProduction = "https://iconnapifunc01-beelinks.iconn-asestaging01.p.azurewebsites.net/api/RegisterCustomer?code=EJpXGBballVmi1R9prsk6P5/wpqFMsA3p233Iib41rmBS75wTf6cog==";
                data = req.body;
                customerData = {
                    "CustomerName": data.details.customerName,
                    "FirstName": (data.details.firstName) ? data.details.firstName : '',
                    "LastName": (data.details.lastName) ? data.details.lastName : '',
                    "DestinationCountryCode": data.details.destCountryCode,
                    "ArrivalPortId": data.details.arrivalPortId,
                    "CustomerTypeId": data.details.customerTypeId,
                    "SalePersonUserCode": data.details.salePersonUserCode,
                    "ContactPhoneTypeId": data.details.contactPhoneTypeId,
                    "ContactPhonePerson": data.details.ContactPhonePerson,
                    "ContactPhoneNumber": data.details.contactPhoneNumber,
                    "ContactMailPerson": data.details.ContactMailPerson,
                    "ContactMailEmailAddress": data.details.contactMailEmailAddress,
                    "HomePageOnFlg": data.details.homePageOnFlg,
                    "MyPageOnFlg": data.details.myPageOnFlg,
                    "BulkEmailFlg": data.details.bulkEmailFlg,
                    "WhyNotBuyReasonCode": "1",
                    "BulkEmailStocklistFlg": data.details.bulkEmailStockListFlg,
                    "IntroducerCode": data.details.introducerCode,
                    "CreateUserCode": data.details.createUserCode
                };
                return [4 /*yield*/, request.post({
                        uri: registerCustomerProduction,
                        body: customerData,
                        json: true,
                        timeout: 30000
                    })];
            case 1:
                response = _a.sent();
                if (response) {
                    //  console.log(response)
                    res.send({ status: 'ok', response: response });
                }
                else
                    res.status(401).send({ error: 'error' });
                return [3 /*break*/, 3];
            case 2:
                error_57 = _a.sent();
                // console.log(error);
                console.log('error in registered customer');
                res.status(401).send({ error: 'error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/StockList', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var stockListDevelopment, stockListStaging, stockListProduction, data, stockList, response, error_58;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                // if (!req.body.sessionid) res.status(401).send('Invalid Request!');
                // else {
                if (req.headers.origin) {
                    res.header("Access-Control-Allow-Origin", req.headers.origin);
                    res.header("Access-Control-Allow-Headers", "content-type");
                    res.header('Access-Control-Allow-Methods', 'GET');
                    res.header('Access-Control-Allow-Credentials', 'true');
                    res.header('Vary', 'Origin, Access-Control-Request-Headers');
                }
                stockListDevelopment = "http://iconnapifunc01-beelinks-development.iconn-asestaging01.p.azurewebsites.net/api/GetStockList?code=cz/pawVzhNIbPWMy7k8FKH9zwLp06plOPptpJod94xSNak30QGBL1A==";
                stockListStaging = "http://iconnapifunc01-beelinks-staging.iconn-asestaging01.p.azurewebsites.net/api/GetStockList?code=BjZWOSwbrxaPeGzlt7niyAVXkjIEOQFB/yOmKoASruoTkVKOc5Qy8g==";
                stockListProduction = "https://iconnapifunc01-beelinks.iconn-asestaging01.p.azurewebsites.net/api/GetStockList?code=xRBzDwCHhxUL4asObsBT94bXnR0X5wLwE9TZsIQNmej61nfUllooWw==";
                data = req.body;
                stockList = {
                    "CustomerCountryId": data.details.customerCountryId,
                    "CurrencyId": data.details.currencyId,
                    "DestinationCountryId": data.details.destinationCountryId,
                    "DestinationPortId": data.details.destinationPortId,
                    "ShipmentId": data.details.shipmentId,
                    "FreightPaymentId": data.details.freightPaymentId,
                    "Insurance": data.details.insurance,
                    "SortingTypeId": data.details.sortingTypeId,
                    "MakerId": (data.details.makerId) ? data.details.makerId : '',
                    "CarName": (data.details.carName) ? data.details.carName : '',
                    "ModelCode": (data.details.modelCode) ? data.details.modelCode : '',
                    "SteeringId": (data.details.steeringId) ? data.details.steeringId : '',
                    "BodyTypeId": (data.details.bodyTypeId) ? data.details.bodyTypeId : '',
                    "SubBodyTypeId": (data.details.subBodyTypeId) ? data.details.subBodyTypeId : '',
                    "DriveId": (data.details.driveId) ? data.details.driveId : '',
                    "RegYearFrom": (data.details.regYearFrom) ? data.details.regYearFrom : '',
                    "RegYearTo": (data.details.regYearTo) ? data.details.regYearTo : '',
                    "RegMonthFrom": (data.details.regMonthFrom) ? data.details.regMonthFrom : '',
                    "RegMonthTo": (data.details.regMonthTo) ? data.details.regMonthTo : '',
                    "VehiclePriceFrom": (data.details.vehiclePriceFrom) ? data.details.vehiclePriceFrom : '',
                    "VehiclePriceTo": (data.details.vehiclePriceTo) ? data.details.vehiclePriceTo : '',
                    "CcFrom": (data.details.ccFrom) ? data.details.ccFrom : '',
                    "CcTo": (data.details.ccTo) ? data.details.ccTo : '',
                    "MileageFrom": (data.details.mileageFrom) ? data.details.mileageFrom : '',
                    "MileageTo": (data.details.mileageTo) ? data.details.mileageTo : '',
                    "Transmission": (data.details.transmission) ? data.details.transmission : '',
                    "FuelId": (data.details.fuelId) ? data.details.fuelId : '',
                    "ColorId": (data.details.colorId) ? data.details.colorId : '',
                    "ProdYearFrom": (data.details.prodYearFrom) ? data.details.prodYearFrom : '',
                    "ProdYearTo": (data.details.prodYearTo) ? data.details.prodYearTo : '',
                    "EngineTypeName": (data.details.engineTypeName) ? data.details.engineTypeName : '',
                    "BodyLengthId": (data.details.bodyLengthId) ? data.details.bodyLengthId : '',
                    "LoadingCapacityId": (data.details.loadingCapacityId) ? data.details.loadingCapacityId : '',
                    "TruckSize": (data.details.truckSize) ? data.details.truckSize : '',
                    "EmissionCode3": (data.details.emissionCode3) ? data.details.emissionCode3 : '0',
                    "PurchaseCountryId": (data.details.purchaseCountryId) ? data.details.purchaseCountryId : '',
                    "LocationPortId": (data.details.locationPortId) ? data.details.locationPortId : '',
                    "AccessoryAB": (data.details.accessoryAB) ? data.details.accessoryAB : '0',
                    "AccessoryABS": (data.details.accessoryABS) ? data.details.accessoryABS : '0',
                    "AccessoryAC": (data.details.accessoryAC) ? data.details.accessoryAC : '0',
                    "AccessoryAW": (data.details.accessoryAW) ? data.details.accessoryAW : '0',
                    "AccessoryBT": (data.details.accessoryBT) ? data.details.accessoryBT : '0',
                    "AccessoryFOG": (data.details.accessoryFOG) ? data.details.accessoryFOG : '0',
                    "AccessoryGG": (data.details.accessoryGG) ? data.details.accessoryGG : '0',
                    "AccessoryLS": (data.details.accessoryLS) ? data.details.accessoryLS : '0',
                    "AccessoryNV": (data.details.accessoryNV) ? data.details.accessoryNV : '0',
                    "AccessoryPS": (data.details.accessoryPS) ? data.details.accessoryPS : '0',
                    "AccessoryPW": (data.details.accessoryPW) ? data.details.accessoryPW : '0',
                    "AccessoryRR": (data.details.accessoryRR) ? data.details.accessoryRR : '0',
                    "AccessoryRS": (data.details.accessoryRS) ? data.details.accessoryRS : '0',
                    "AccessorySR": (data.details.accessorySR) ? data.details.accessorySR : '0',
                    "AccessoryTV": (data.details.accessoryTV) ? data.details.accessoryTV : '0',
                    "AccessoryWAB": (data.details.accessoryWAB) ? data.details.accessoryWAB : '0',
                };
                return [4 /*yield*/, request.post({
                        uri: stockListDevelopment,
                        body: stockList,
                        json: true,
                        timeout: 40000
                    })];
            case 1:
                response = _a.sent();
                if (response) {
                    //  console.log(response)
                    res.send({ status: 'ok', response: response });
                }
                else
                    res.status(401).send({ error: 'error' });
                return [3 /*break*/, 3];
            case 2:
                error_58 = _a.sent();
                console.log(error_58);
                console.log('error in Stock  Search');
                res.status(401).send({ error: 'error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/submitSurveyAfterEndChat/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var insertedMessage, updatedConversation, loggedEvent, error_59;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 8, , 9]);
                if (!(!req.body.feedbackForm || !req.body.survey)) return [3 /*break*/, 1];
                res.status(401).send();
                return [3 /*break*/, 7];
            case 1:
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
                if (!(!req.body || !req.body.survey)) return [3 /*break*/, 2];
                res.status(200).send({ status: 'error' });
                return [3 /*break*/, 7];
            case 2:
                insertedMessage = void 0;
                if (!req.body.feedbackForm) return [3 /*break*/, 4];
                return [4 /*yield*/, CreateMessage_1.CreateLogMessage(req.body.feedbackForm)
                    //if (insertedMessage) {
                ];
            case 3:
                insertedMessage = _a.sent();
                _a.label = 4;
            case 4:
                //if (insertedMessage) {
                res.status(200).send({ status: 'ok' });
                return [4 /*yield*/, conversationModel_1.Conversations.SubmitSurvey(req.body.cid, (req.body.survey) ? req.body.survey : {})];
            case 5:
                updatedConversation = _a.sent();
                if (!(updatedConversation && updatedConversation.value)) return [3 /*break*/, 7];
                loggedEvent = void 0;
                if (!req.body.sid) return [3 /*break*/, 7];
                return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendEventLog(enums_1.EventLogMessages.ENDCHAT, (req.body.sid) ? req.body.sid : '')];
            case 6:
                loggedEvent = _a.sent();
                _a.label = 7;
            case 7: return [3 /*break*/, 9];
            case 8:
                error_59 = _a.sent();
                res.status(401).send();
                console.log(error_59);
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); });
router.post('/updateChatDynamicProperty', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, agent, log, result, err_11;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 9, , 10]);
                if (!!req.body.sessionid) return [3 /*break*/, 1];
                res.status(401).send('Unauthorized!');
                return [3 /*break*/, 8];
            case 1:
                data = req.body;
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetAgentByID(data.sessionid)];
            case 2:
                agent = _a.sent();
                if (!agent) return [3 /*break*/, 7];
                log = data.log;
                log.createdDate = new Date().toISOString();
                return [4 /*yield*/, conversationModel_1.Conversations.UpdateDynamicProperty(data.cid, data.name, data.value, log)];
            case 3:
                result = _a.sent();
                if (!(result && result.value)) return [3 /*break*/, 5];
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateConversation', nsp: data.nsp, roomName: [agent._id], data: { cid: result.value._id, conversation: result.value } })];
            case 4:
                _a.sent();
                res.send({ status: 'ok', result: result.value });
                return [3 /*break*/, 6];
            case 5:
                res.send({ status: 'error' });
                _a.label = 6;
            case 6: return [3 /*break*/, 8];
            case 7:
                res.status(401).send('Invalid Request!');
                _a.label = 8;
            case 8: return [3 /*break*/, 10];
            case 9:
                err_11 = _a.sent();
                console.log(err_11);
                console.log('Error in changing dynamic property');
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 10];
            case 10: return [2 /*return*/];
        }
    });
}); });
exports.chatRoutes = router;
//# sourceMappingURL=chats.js.map