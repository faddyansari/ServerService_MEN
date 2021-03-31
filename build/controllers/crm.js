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
exports.crmRoutes = void 0;
var visitorModel_1 = require("../models/visitorModel");
var conversationModel_1 = require("..//models/conversationModel");
var visitorSessionmodel_1 = require("..//models/visitorSessionmodel");
var ticketsModel_1 = require("..//models/ticketsModel");
var sessionsManager_1 = require("../globals/server/sessionsManager");
var express = require("express");
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
router.post('/customerList', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data_1, session_1, list, filter_1, filterToken_1, updatedList, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 9, , 10]);
                data_1 = req.body;
                if (!data_1)
                    res.status(401).send("Invalid Request!");
                if (!data_1.sessionId) return [3 /*break*/, 2];
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetAgentByID(data_1.sessionId)];
            case 1:
                session_1 = _a.sent();
                _a.label = 2;
            case 2:
                ;
                if (!(session_1 && session_1.permissions.crm && session_1.permissions.crm.enabled)) return [3 /*break*/, 7];
                return [4 /*yield*/, visitorModel_1.Visitor.getAllVisitorsByToken(session_1.nsp, data_1.token, data_1.id ? data_1.id : '')];
            case 3:
                list = _a.sent();
                if (!(list && list.length)) return [3 /*break*/, 5];
                filterToken_1 = (data_1.token && (data_1.token == 'email')) ? 'visitorEmail' : 'deviceID';
                updatedList = list.map(function (customer) { return __awaiter(void 0, void 0, void 0, function () {
                    var convo;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                filter_1 = (data_1.token && (data_1.token == 'email') && customer.email) ? (customer.email) : customer.deviceID ? customer.deviceID : '';
                                return [4 /*yield*/, conversationModel_1.Conversations.GetCustomerConversationCount(filter_1, session_1.nsp, filterToken_1)];
                            case 1:
                                convo = _a.sent();
                                // let convo = await Conversations.getCustomerConversations(customer.deviceID, socket.handshake.session.nsp, data.token);
                                // if (convo) ////console.log(convo);
                                if (convo && convo.length)
                                    customer.convoLength = convo[0].count;
                                else
                                    customer.convoLength = 0;
                                return [2 /*return*/, customer];
                        }
                    });
                }); });
                return [4 /*yield*/, Promise.all(updatedList)];
            case 4:
                _a.sent();
                res.send({ status: 'ok', list: list });
                return [3 /*break*/, 6];
            case 5:
                res.send({ status: 'ok', list: [] });
                _a.label = 6;
            case 6: return [3 /*break*/, 8];
            case 7:
                res.status(401).send({ status: 'Unauthorized' });
                _a.label = 8;
            case 8: return [3 /*break*/, 10];
            case 9:
                err_1 = _a.sent();
                console.log(err_1);
                console.log('Error in getting customerList');
                res.status(401).send('Invalid request');
                return [3 /*break*/, 10];
            case 10: return [2 /*return*/];
        }
    });
}); });
router.post('/customerFilteredList', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, session, list, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                data = req.body;
                if (!data)
                    res.status(401).send("Invalid Request!");
                session = void 0;
                if (!data.sessionId) return [3 /*break*/, 2];
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetAgentByID(data.sessionId)];
            case 1:
                session = _a.sent();
                _a.label = 2;
            case 2:
                ;
                if (!(session && session.permissions.crm && session.permissions.crm.enabled)) return [3 /*break*/, 4];
                return [4 /*yield*/, visitorModel_1.Visitor.getAllVisitorsByToken(session.nsp, data.token, data.id ? data.id : '', data.filters)];
            case 3:
                list = _a.sent();
                if (list) ////console.log(list.length);
                    if (list && list.length) {
                        res.send({ status: 'ok', list: list });
                    }
                    else
                        res.send({ status: 'ok', list: [] });
                return [3 /*break*/, 5];
            case 4:
                res.status(401).send({ status: 'Unauthorized' });
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                err_2 = _a.sent();
                console.log(err_2);
                console.log('Error in getting filtered customerList');
                res.status(401).send('Invalid request');
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
router.post('/CustomerConversationsList', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, session, filter, filterToken, conversations, chatsCheck, noMoreChats, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 9, , 10]);
                data = req.body;
                if (!data)
                    res.status(401).send("Invalid Request!");
                session = void 0;
                if (!data.sessionId) return [3 /*break*/, 2];
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetAgentByID(data.sessionId)];
            case 1:
                session = _a.sent();
                _a.label = 2;
            case 2:
                ;
                if (!(session && session.permissions.crm && session.permissions.crm.enabled)) return [3 /*break*/, 7];
                filter = (data.token && (data.token == 'email')) ? data.email : data.deviceID ? data.deviceID : '';
                filterToken = (data.token && (data.token == 'email')) ? 'visitorEmail' : 'deviceID';
                conversations = void 0;
                if (!(data && data.deviceID)) return [3 /*break*/, 4];
                return [4 /*yield*/, conversationModel_1.Conversations.getCustomerConversations(filter, session.nsp, filterToken, (data._id) ? data._id : '')];
            case 3:
                conversations = _a.sent();
                _a.label = 4;
            case 4:
                chatsCheck = void 0;
                if (!(conversations && conversations.length > 0)) return [3 /*break*/, 6];
                return [4 /*yield*/, conversationModel_1.Conversations.GetCustomerConversationCount(filter, session.nsp, filterToken, conversations[conversations.length - 1]._id)];
            case 5:
                chatsCheck = _a.sent();
                _a.label = 6;
            case 6:
                noMoreChats = void 0;
                if (chatsCheck && chatsCheck.length && chatsCheck[0].count)
                    noMoreChats = false;
                else
                    noMoreChats = true;
                res.send({ status: 'ok', conversations: (conversations && conversations.length) ? conversations : [], noMoreChats: noMoreChats });
                return [3 /*break*/, 8];
            case 7:
                res.status(401).send({ status: 'Unauthorized' });
                _a.label = 8;
            case 8: return [3 /*break*/, 10];
            case 9:
                err_3 = _a.sent();
                console.log(err_3);
                console.log('Error in getting Customer Conversations');
                res.status(401).send('Invalid request');
                return [3 /*break*/, 10];
            case 10: return [2 /*return*/];
        }
    });
}); });
router.post('/CustomerTicketsList', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, tickets, session, filter, filterToken, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
                data = req.body;
                if (!data)
                    res.status(401).send("Invalid Request!");
                tickets = void 0;
                session = void 0;
                if (!data.sessionId) return [3 /*break*/, 2];
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetAgentByID(data.sessionId)];
            case 1:
                session = _a.sent();
                _a.label = 2;
            case 2:
                ;
                if (!(session && session.permissions.crm && session.permissions.crm.enabled)) return [3 /*break*/, 5];
                filter = (data.token && (data.token == 'email')) ? data.email : data.deviceID ? data.deviceID : '';
                filterToken = (data.token && (data.token == 'email')) ? 'visitor.email' : 'deviceID';
                if (!(data && data.email)) return [3 /*break*/, 4];
                return [4 /*yield*/, ticketsModel_1.Tickets.getTicketsByVisitorData(filter, session.nsp, filterToken)];
            case 3:
                tickets = _a.sent();
                _a.label = 4;
            case 4:
                res.send({ status: 'ok', tickets: (tickets && tickets.length) ? tickets : [] });
                return [3 /*break*/, 6];
            case 5:
                res.status(401).send({ status: 'Unauthorized' });
                _a.label = 6;
            case 6: return [3 /*break*/, 8];
            case 7:
                err_4 = _a.sent();
                console.log(err_4);
                console.log('Error in CustomerTicketsList');
                res.status(401).send('Invalid request');
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); });
router.post('/MoreCustomerConversationsList', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, session, conversations, chatsCheck, noMoreChats, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 8, , 9]);
                data = req.body;
                if (!data)
                    res.status(401).send("Invalid Request!");
                session = void 0;
                if (!data.sessionId) return [3 /*break*/, 2];
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetAgentByID(data.sessionId)];
            case 1:
                session = _a.sent();
                _a.label = 2;
            case 2:
                ;
                if (!(session && session.permissions.crm && session.permissions.crm.enabled)) return [3 /*break*/, 6];
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
                res.status(401).send({ status: 'Unauthorized' });
                _a.label = 7;
            case 7: return [3 /*break*/, 9];
            case 8:
                err_5 = _a.sent();
                console.log(err_5);
                console.log('Error in MoreCustomerConversationsList');
                res.status(401).send('Invalid request');
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); });
router.post('/SelectedConversationDetails', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, session, msgs, err_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                data = req.body;
                if (!data)
                    res.status(401).send("Invalid Request!");
                session = void 0;
                if (!data.sessionId) return [3 /*break*/, 2];
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetAgentByID(data.sessionId)];
            case 1:
                session = _a.sent();
                _a.label = 2;
            case 2:
                ;
                if (!(session && session.permissions.crm && session.permissions.crm.enabled)) return [3 /*break*/, 4];
                return [4 /*yield*/, conversationModel_1.Conversations.getMessagesByCid(data.cid)];
            case 3:
                msgs = _a.sent();
                res.send({ status: 'ok', msgList: msgs });
                return [3 /*break*/, 5];
            case 4:
                res.status(401).send({ status: 'Unauthorized' });
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                err_6 = _a.sent();
                console.log(err_6);
                console.log('Error in SelectedConversationDetails');
                res.status(401).send('Invalid request');
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
router.post('/searchCustomersTokenBased', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data_2, session_2, customerList, filter_2, filterToken_2, updatedList, err_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 9, , 10]);
                data_2 = req.body;
                if (!data_2)
                    res.status(401).send("Invalid Request!");
                if (!data_2.sessionId) return [3 /*break*/, 2];
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetAgentByID(data_2.sessionId)];
            case 1:
                session_2 = _a.sent();
                _a.label = 2;
            case 2:
                ;
                if (!(session_2 && session_2.permissions.crm && session_2.permissions.crm.enabled)) return [3 /*break*/, 7];
                return [4 /*yield*/, visitorModel_1.Visitor.searchCustomersTokenBased(session_2.nsp, data_2.keyword, data_2.token, data_2.chunk)];
            case 3:
                customerList = _a.sent();
                if (!(customerList && customerList.length)) return [3 /*break*/, 5];
                filterToken_2 = (data_2.token && (data_2.token == 'email')) ? 'visitorEmail' : 'deviceID';
                updatedList = customerList.map(function (customer) { return __awaiter(void 0, void 0, void 0, function () {
                    var convo;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                filter_2 = (data_2.token && (data_2.token == 'email') && customer.email) ? (customer.email) : customer.deviceID ? customer.deviceID : '';
                                return [4 /*yield*/, conversationModel_1.Conversations.GetCustomerConversationCount(filter_2, session_2.nsp, filterToken_2)];
                            case 1:
                                convo = _a.sent();
                                if (convo && convo.length)
                                    customer.convoLength = convo[0].count;
                                else
                                    customer.convoLength = 0;
                                return [2 /*return*/, customer];
                        }
                    });
                }); });
                return [4 /*yield*/, Promise.all(updatedList)];
            case 4:
                _a.sent();
                res.send({ status: 'ok', customerList: customerList });
                return [3 /*break*/, 6];
            case 5:
                res.send({ customerList: [] });
                _a.label = 6;
            case 6: return [3 /*break*/, 8];
            case 7:
                res.status(401).send({ status: 'Unauthorized' });
                _a.label = 8;
            case 8: return [3 /*break*/, 10];
            case 9:
                err_7 = _a.sent();
                console.log(err_7);
                console.log('Error in searchCustomersTokenBased');
                res.status(401).send('Invalid request');
                return [3 /*break*/, 10];
            case 10: return [2 /*return*/];
        }
    });
}); });
// router.post('/searchCustomers', async (req, res) => {
//   try {
//     let data = req.body
//     if (!data) res.status(401).send("Invalid Request!");
//     let session;
//     if (data.sessionId) session = await SessionManager.GetAgentByID(data.sessionId);;
//     if (session && session.permissions.crm && session.permissions.crm.enabled) {
//       let customerList = await Visitor.searchCustomers(session.nsp, data.keyword, data.chunk);
//       // ////console.log(customerList);
//       if (customerList && customerList.length) {
//         let updatedList = customerList.map(async customer => {
//           let convo = await Conversations.getCustomerConversations(customer.deviceID, session.nsp);
//           if (convo && convo.length) customer.convoLength = convo.length;
//           else customer.convoLength = 0
//           return customer
//         });
//         await Promise.all(updatedList);
//         res.send({ status: 'ok', customerList: customerList });
//       }
//       //if (customerList.length) callback({ status: 'ok', customerList: customerList });
//       else res.send({ customerList: [] });
//     }
//     else res.status(401).send({ status: 'Unauthorized' });
//   } catch (err) {
//     console.log(err);
//     console.log('Error in searchCustomers');
//     res.status(401).send('Invalid request');
//   }
// });
router.post('/getCrmSessionDetails', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, session, sessionDetails, err_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                data = req.body;
                if (!data)
                    res.status(401).send("Invalid Request!");
                session = void 0;
                if (!data.sessionId) return [3 /*break*/, 2];
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetAgentByID(data.sessionId)];
            case 1:
                session = _a.sent();
                _a.label = 2;
            case 2:
                ;
                if (!(session && session.permissions.crm && session.permissions.crm.enabled)) return [3 /*break*/, 4];
                return [4 /*yield*/, visitorSessionmodel_1.visitorSessions.getVisitorSession(data.session._id)];
            case 3:
                sessionDetails = _a.sent();
                res.send({ status: 'ok', sessionDetails: (sessionDetails && sessionDetails.length) ? sessionDetails : [] });
                return [3 /*break*/, 5];
            case 4:
                res.status(401).send({ status: 'Unauthorized' });
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                err_8 = _a.sent();
                console.log(err_8);
                console.log('Error in getCrmSessionDetails');
                res.status(401).send('Invalid request');
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
router.post('/customerSessions', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, session, search, sessionDetails, err_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                data = req.body;
                if (!data)
                    res.status(401).send("Invalid Request!");
                session = void 0;
                if (!data.sessionId) return [3 /*break*/, 2];
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetAgentByID(data.sessionId)];
            case 1:
                session = _a.sent();
                _a.label = 2;
            case 2:
                ;
                if (!(session && session.permissions.crm && session.permissions.crm.enabled)) return [3 /*break*/, 4];
                search = (data.token && (data.token == 'email')) ? data.email : data.deviceID ? data.deviceID : '';
                return [4 /*yield*/, visitorSessionmodel_1.visitorSessions.getVisitorSessionByIDs(data.sessions, search, data.token, session.nsp, data.filters)];
            case 3:
                sessionDetails = _a.sent();
                ////console.log(sessionDetails);
                res.send({ status: 'ok', sessionDetails: (sessionDetails && sessionDetails.length) ? sessionDetails : [] });
                return [3 /*break*/, 5];
            case 4:
                res.status(401).send({ status: 'Unauthorized' });
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                err_9 = _a.sent();
                console.log(err_9);
                console.log('Error in customerSessions');
                res.status(401).send('Invalid request');
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
router.post('/CustomerSources', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, session, filter, sources, err_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                data = req.body;
                if (!data)
                    res.status(401).send("Invalid Request!");
                session = void 0;
                if (!data.sessionId) return [3 /*break*/, 2];
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetAgentByID(data.sessionId)];
            case 1:
                session = _a.sent();
                _a.label = 2;
            case 2:
                ;
                if (!(session && session.permissions.crm && session.permissions.crm.enabled)) return [3 /*break*/, 4];
                filter = (data.token && (data.token == 'email')) ? data.email : data.deviceID ? data.deviceID : '';
                return [4 /*yield*/, visitorSessionmodel_1.visitorSessions.GetSourcesForCustomer(filter, data.token, session.nsp)];
            case 3:
                sources = _a.sent();
                res.send({ status: 'ok', sources: (sources && sources.length) ? sources : [] });
                return [3 /*break*/, 5];
            case 4:
                res.status(401).send({ status: 'Unauthorized' });
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                err_10 = _a.sent();
                console.log(err_10);
                console.log('Error in CustomerSources');
                res.status(401).send('Invalid request');
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
router.post('/CustomerAgents', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, session, filter, agents, err_11;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                data = req.body;
                if (!data)
                    res.status(401).send("Invalid Request!");
                session = void 0;
                if (!data.sessionId) return [3 /*break*/, 2];
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetAgentByID(data.sessionId)];
            case 1:
                session = _a.sent();
                _a.label = 2;
            case 2:
                ;
                if (!(session && session.permissions.crm && session.permissions.crm.enabled)) return [3 /*break*/, 4];
                filter = (data.token && (data.token == 'email')) ? data.email : data.deviceID ? data.deviceID : '';
                return [4 /*yield*/, visitorSessionmodel_1.visitorSessions.GetAgentsForCustomer(filter, data.token, session.nsp)];
            case 3:
                agents = _a.sent();
                ////console.log(agents);
                res.send({ status: 'ok', agents: (agents && agents.length) ? agents : [] });
                return [3 /*break*/, 5];
            case 4:
                res.status(401).send({ status: 'Unauthorized' });
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                err_11 = _a.sent();
                console.log(err_11);
                console.log('Error in CustomerAgents');
                res.status(401).send('Invalid request');
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
router.post('/getPeriodicSessionCounts', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, session, filter, visits, err_12;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                data = req.body;
                if (!data)
                    res.status(401).send("Invalid Request!");
                session = void 0;
                if (!data.sessionId) return [3 /*break*/, 2];
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetAgentByID(data.sessionId)];
            case 1:
                session = _a.sent();
                _a.label = 2;
            case 2:
                ;
                if (!(session && session.permissions.crm && session.permissions.crm.enabled)) return [3 /*break*/, 4];
                filter = (data.token && (data.token == 'email')) ? data.email : data.deviceID ? data.deviceID : '';
                return [4 /*yield*/, visitorSessionmodel_1.visitorSessions.GetSessionCountsPeriodically(session.nsp, filter, data.sessionIDs, data.token, data.filters)];
            case 3:
                visits = _a.sent();
                // if (visits) ////console.log(visits);
                res.send({ status: 'ok', visits: (visits && visits.length) ? visits : [] });
                return [3 /*break*/, 5];
            case 4:
                res.status(401).send({ status: 'Unauthorized' });
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                err_12 = _a.sent();
                console.log(err_12);
                console.log('Error in getPeriodicSessionCounts');
                res.status(401).send('Invalid request');
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
router.post('/getReferrerCounts', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, session, filter, referrers, err_13;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                data = req.body;
                if (!data)
                    res.status(401).send("Invalid Request!");
                session = void 0;
                if (!data.sessionId) return [3 /*break*/, 2];
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetAgentByID(data.sessionId)];
            case 1:
                session = _a.sent();
                _a.label = 2;
            case 2:
                ;
                if (!(session && session.permissions.crm && session.permissions.crm.enabled)) return [3 /*break*/, 4];
                filter = (data.token && (data.token == 'email')) ? data.email : data.deviceID ? data.deviceID : '';
                return [4 /*yield*/, visitorSessionmodel_1.visitorSessions.GetReferrerCountsPeriodically(session.nsp, filter, data.sessionIDs, data.token, data.filters)];
            case 3:
                referrers = _a.sent();
                // if (visits) ////console.log(visits);
                res.send({ status: 'ok', referrers: (referrers && referrers.length) ? referrers : [] });
                return [3 /*break*/, 5];
            case 4:
                res.status(401).send({ status: 'Unauthorized' });
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                err_13 = _a.sent();
                console.log(err_13);
                console.log('Error in getReferrerCounts');
                res.status(401).send('Invalid request');
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
exports.crmRoutes = router;
//# sourceMappingURL=crm.js.map