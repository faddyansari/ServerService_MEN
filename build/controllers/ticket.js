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
exports.ticketRoutes = void 0;
var express = require("express");
var ticketsModel_1 = require("../models/ticketsModel");
var TicketgroupModel_1 = require("../models/TicketgroupModel");
var sessionsManager_1 = require("../globals/server/sessionsManager");
var companyModel_1 = require("../models/companyModel");
var teamsModel_1 = require("../models/teamsModel");
var agentModel_1 = require("../models/agentModel");
var mongodb_1 = require("mongodb");
var ticketEnums_1 = require("../globals/config/ticketEnums");
var __biZZCMiddleWare_1 = require("../globals/__biZZCMiddleWare");
var emailService_1 = require("../services/emailService");
var FeedBackSurveyModel_1 = require("../models/FeedBackSurveyModel");
var tokensModel_1 = require("../models/tokensModel");
var emailActivations_1 = require("../models/emailActivations");
var SLAPolicyModel_1 = require("../models/SLAPolicyModel");
var constants_1 = require("../globals/config/constants");
var RuleSetExecutor_1 = require("../actions/TicketAbstractions/RuleSetExecutor");
var request = require("request-promise");
var ticketTemplateModel_1 = require("../models/ticketTemplateModel");
var FormDesignerModel_1 = require("../models/FormDesignerModel");
var ticketScenariosModel_1 = require("../models/ticketScenariosModel");
var Utils_1 = require("../actions/agentActions/Utils");
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
                    res.locals.sessionObj = session;
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
/* #region  Tickets Getter Methods*/
router.post('/getTickets', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, sessionObj, session, ticketPermissions, company, tickets, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 8, , 9]);
                data = req.body;
                sessionObj = res.locals.sessionObj;
                if (!data.email || !data.nsp)
                    res.status(401).send('Invalid Request!');
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetSessionByEmailFromDatabase(sessionObj.email, sessionObj.nsp)];
            case 1:
                session = _a.sent();
                if (!session) return [3 /*break*/, 6];
                ticketPermissions = session.permissions.tickets;
                return [4 /*yield*/, companyModel_1.Company.getCompany(session.nsp)];
            case 2:
                company = _a.sent();
                if (!(company && company.length)) return [3 /*break*/, 4];
                return [4 /*yield*/, ticketsModel_1.Tickets.getTickets(session.nsp, session.email, ticketPermissions.canView, data.filters, data.clause, data.query, data.sortBy, data.assignType, data.groupAssignType, data.mergeType, data.limit, company[0].settings.solrSearch)];
            case 3:
                tickets = _a.sent();
                // var t1 = performance.now();
                // console.log(session.email + " call to Get Tickets took " + (t1 - t0) + " milliseconds.");
                res.send({ status: 'ok', tickets: (tickets && tickets[0].length) ? tickets[0] : [], ended: (tickets && tickets[0].length >= 50) ? false : true, count: (tickets && tickets[1].length) ? tickets[1] : [{ state: 'OPEN', count: 0 }, { state: 'PENDING', count: 0 }, { state: 'CLOSED', count: 0 }] });
                return [3 /*break*/, 5];
            case 4:
                res.send({ status: 'error' });
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                res.send({ status: 'error' });
                _a.label = 7;
            case 7: return [3 /*break*/, 9];
            case 8:
                error_1 = _a.sent();
                console.log(error_1);
                console.log('error in Getting Tickets');
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); });
router.post('/getMoreTickets', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, sessionObj, session, ticketPermissions, company, tick, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                data = req.body;
                sessionObj = res.locals.sessionObj;
                if (!data.email || !data.nsp)
                    res.status(401).send('Invalid Request!');
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetSessionByEmailFromDatabase(sessionObj.email, sessionObj.nsp)];
            case 1:
                session = _a.sent();
                if (!session) return [3 /*break*/, 4];
                ticketPermissions = session.permissions.tickets;
                return [4 /*yield*/, companyModel_1.Company.getCompany(session.nsp)];
            case 2:
                company = _a.sent();
                if (!(company && company.length)) return [3 /*break*/, 4];
                return [4 /*yield*/, ticketsModel_1.Tickets.getTicketsForLazyLoading(session.nsp, session.email, ticketPermissions.canView, data.filters, data.clause, data.query, data.chunk, data.sortBy, data.assignType, data.groupAssignType, data.mergeType, company[0].settings.solrSearch)];
            case 3:
                tick = _a.sent();
                res.send({ status: 'ok', tick: tick, ended: (tick && tick.length < 50) ? true : false });
                _a.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                err_1 = _a.sent();
                console.log(err_1);
                console.log('Error in getting more tickets');
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
router.post('/getTicketHistory', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, tickets, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                data = req.body;
                if (!data.email || !data.nsp)
                    res.status(401).send('Invalid Request!');
                return [4 /*yield*/, ticketsModel_1.Tickets.getTicketHistory(data.nsp, data.email, data.field)];
            case 1:
                tickets = _a.sent();
                if (tickets && tickets.length) {
                    res.send({ status: 'ok', tickets: tickets });
                }
                else {
                    res.send({ status: 'error', tickets: [] });
                }
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.log('Error in getting ticket history');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/getTicketHistoryEmail', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, tickets, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                data = req.body;
                if (!data.email || !data.nsp)
                    res.status(401).send('Invalid Request!');
                return [4 /*yield*/, ticketsModel_1.Tickets.getTicketHistoryEmail(data.nsp, data.email)];
            case 1:
                tickets = _a.sent();
                if (tickets && tickets.length) {
                    res.send({ status: 'ok', tickets: tickets });
                }
                else {
                    res.send({ status: 'error', tickets: [] });
                }
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                console.log('Error in getting ticket history');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/getTicketByID', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, ticket, session, _a, agents, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 13, , 14]);
                data = req.body;
                if (!data.tid || !data.email || !data.nsp)
                    res.status(401).send('Invalid Request!');
                if (!Array.isArray(data.tid))
                    data.tid = [data.tid];
                return [4 /*yield*/, ticketsModel_1.Tickets.getTicketByID(data.nsp, data.tid)];
            case 1:
                ticket = _b.sent();
                if (!(ticket && ticket.length)) return [3 /*break*/, 11];
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetSessionByEmailFromDatabase(data.email, data.nsp)];
            case 2:
                session = _b.sent();
                if (!session) return [3 /*break*/, 9];
                _a = session.permissions.tickets.canView;
                switch (_a) {
                    case 'all': return [3 /*break*/, 3];
                    case 'group': return [3 /*break*/, 4];
                    case 'assignedOnly': return [3 /*break*/, 5];
                    case 'team': return [3 /*break*/, 6];
                }
                return [3 /*break*/, 8];
            case 3:
                res.send({ status: 'ok', thread: ticket[0] });
                return [3 /*break*/, 8];
            case 4:
                if ((ticket[0].group && session.groups.includes(ticket[0].group))) {
                    res.send({ status: 'ok', thread: ticket[0] });
                }
                else {
                    res.send({ status: 'unauthorized', code: 500, msg: 'You are unauthorized to view this ticket!' });
                }
                return [3 /*break*/, 8];
            case 5:
                if (ticket[0].assigned_to && (ticket[0].assigned_to == session.email)) {
                    res.send({ status: 'ok', thread: ticket[0] });
                }
                else {
                    res.send({ status: 'unauthorized', code: 500, msg: 'You are unauthorized to view this ticket!' });
                }
                return [3 /*break*/, 8];
            case 6: return [4 /*yield*/, teamsModel_1.TeamsModel.getTeamMembersAgainstAgent(session.nsp, session.email)];
            case 7:
                agents = _b.sent();
                if (ticket[0].assigned_to && agents.includes(ticket[0].assigned_to)) {
                    res.send({ status: 'ok', thread: ticket[0] });
                }
                else {
                    res.send({ status: 'unauthorized', code: 500, msg: 'You are unauthorized to view this ticket!' });
                }
                return [3 /*break*/, 8];
            case 8: return [3 /*break*/, 10];
            case 9:
                res.send({ status: 'error', code: 500, msg: 'Internal Server Error' });
                _b.label = 10;
            case 10: return [3 /*break*/, 12];
            case 11:
                res.send({ status: 'error', code: 500, msg: 'Internal Server Error' });
                _b.label = 12;
            case 12: return [3 /*break*/, 14];
            case 13:
                err_2 = _b.sent();
                console.log(err_2);
                console.log('Error in getting tickets by ID');
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 14];
            case 14: return [2 /*return*/];
        }
    });
}); });
router.post('/ticketmessages', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, messages, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                data = req.body;
                if (!data.tid)
                    res.status(401).send('Invalid Request!');
                return [4 /*yield*/, ticketsModel_1.Tickets.getMesages(data.tid)];
            case 1:
                messages = _a.sent();
                // console.log(messages);
                res.send(messages);
                return [3 /*break*/, 3];
            case 2:
                err_3 = _a.sent();
                console.log(err_3);
                console.log('Error in getting ticket Messages');
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/mergedmessages', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, MergedMessages, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                data = req.body;
                if (!data.tid)
                    res.status(401).send('Invalid Request!');
                return [4 /*yield*/, ticketsModel_1.Tickets.getMessages(data.tid)];
            case 1:
                MergedMessages = _a.sent();
                // console.log(data);
                //console.log(MergedMessages);
                res.send(MergedMessages);
                return [3 /*break*/, 3];
            case 2:
                err_4 = _a.sent();
                console.log(err_4);
                console.log('Error in getting merged messages');
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/* #endregion */
/* #region  Ticket Task */
router.post('/addTask', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data_1, ticketlog, results, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                data_1 = req.body;
                data_1.task.id = new mongodb_1.ObjectID();
                data_1.task.datetime = new Date();
                if (!data_1.tid)
                    res.status(401).send('Invalid Request!');
                ticketlog = ticketEnums_1.ComposedTicketENUM(ticketEnums_1.TicketLogMessages.TASK_ADDED, { value: data_1.task.todo, by: data_1.email });
                return [4 /*yield*/, ticketsModel_1.Tickets.addTask(data_1.tid, data_1.nsp, data_1.task, ticketlog)];
            case 1:
                results = _a.sent();
                if (results && results.length) {
                    res.send({ status: 'ok', result: results[0], ticketlog: ticketlog });
                    results.map(function (result) { return __awaiter(void 0, void 0, void 0, function () {
                        var assigendTo, watchers;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data_1.nsp, roomName: ['ticketAdmin'], data: { tid: result._id, ticket: result } })];
                                case 1:
                                    _a.sent();
                                    if (!result.group) return [3 /*break*/, 3];
                                    return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data_1.nsp, roomName: [result.group], data: { tid: result._id, ticket: result } })];
                                case 2:
                                    _a.sent();
                                    _a.label = 3;
                                case 3:
                                    if (!result.assigned_to) return [3 /*break*/, 6];
                                    return [4 /*yield*/, sessionsManager_1.SessionManager.getAgentByEmail(data_1.nsp, result.assigned_to)];
                                case 4:
                                    assigendTo = _a.sent();
                                    if (!assigendTo) return [3 /*break*/, 6];
                                    return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data_1.nsp, roomName: [assigendTo._id], data: { tid: result._id, ticket: result } })];
                                case 5:
                                    _a.sent();
                                    _a.label = 6;
                                case 6:
                                    if (!result.watchers) return [3 /*break*/, 8];
                                    return [4 /*yield*/, sessionsManager_1.SessionManager.getOnlineWatchers(data_1.nsp, result.watchers)];
                                case 7:
                                    watchers = _a.sent();
                                    if (watchers && watchers.length) {
                                        if (result.assigned_to)
                                            watchers = watchers.filter(function (data) { return data != result.assigned_to; });
                                        watchers.map(function (watcher) { return __awaiter(void 0, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0: return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data_1.nsp, roomName: [watcher._id], data: { tid: result._id, ticket: result } })];
                                                    case 1:
                                                        _a.sent();
                                                        return [2 /*return*/];
                                                }
                                            });
                                        }); });
                                    }
                                    _a.label = 8;
                                case 8: return [2 /*return*/];
                            }
                        });
                    }); });
                }
                else {
                    res.send({ status: 'error' });
                }
                return [3 /*break*/, 3];
            case 2:
                err_5 = _a.sent();
                console.log(err_5);
                console.log('Error in adding ticket task');
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/deleteTask', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data_2, ticketlog, result, assignedTo, val_1, watchers, err_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 12, , 13]);
                data_2 = req.body;
                if (!data_2.tid)
                    res.status(401).send('Invalid Request!');
                ticketlog = ticketEnums_1.ComposedTicketENUM(ticketEnums_1.TicketLogMessages.DELETE_TASK, { value: data_2.task, by: data_2.email });
                return [4 /*yield*/, ticketsModel_1.Tickets.deleteTask(data_2.tid, data_2.id, ticketlog)];
            case 1:
                result = _a.sent();
                if (!(result && result.value)) return [3 /*break*/, 10];
                res.send({ status: 'ok', deletedresult: result.value, ticketlog: ticketlog });
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data_2.nsp, roomName: ['ticketAdmin'], data: { tid: data_2.tid, ticket: result.value } })];
            case 2:
                _a.sent();
                if (!result.value.group) return [3 /*break*/, 4];
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data_2.nsp, roomName: [result.value.group], data: { tid: data_2.tid, ticket: result.value } })];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4:
                if (!result.value.assigned_to) return [3 /*break*/, 7];
                return [4 /*yield*/, sessionsManager_1.SessionManager.getAgentByEmail(data_2.nsp, result.value.assigned_to)];
            case 5:
                assignedTo = _a.sent();
                if (!assignedTo) return [3 /*break*/, 7];
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data_2.nsp, roomName: [assignedTo._id], data: { tid: data_2.tid, ticket: result.value } })];
            case 6:
                _a.sent();
                _a.label = 7;
            case 7:
                if (!result.value.watchers) return [3 /*break*/, 9];
                val_1 = result.value;
                return [4 /*yield*/, sessionsManager_1.SessionManager.getOnlineWatchers(data_2.nsp, val_1.watchers)];
            case 8:
                watchers = _a.sent();
                if (watchers && watchers.length) {
                    if (result.value.assigned_to)
                        watchers = watchers.filter(function (x) { return x != val_1.assigned_to; });
                    watchers.map(function (watcher) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data_2.nsp, roomName: [watcher._id], data: { tid: data_2.tid, ticket: val_1 } })];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                }
                _a.label = 9;
            case 9: return [3 /*break*/, 11];
            case 10:
                res.send({ status: 'error' });
                _a.label = 11;
            case 11: return [3 /*break*/, 13];
            case 12:
                err_6 = _a.sent();
                console.log(err_6);
                console.log('Error in deleting ticket task');
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 13];
            case 13: return [2 /*return*/];
        }
    });
}); });
router.post('/updateTask', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data_3, ticketlog, result, assigendTo, val_2, watchers, err_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 12, , 13]);
                data_3 = req.body;
                if (!data_3.tid)
                    res.status(401).send('Invalid Request!');
                ticketlog = ticketEnums_1.ComposedTicketENUM(ticketEnums_1.TicketLogMessages.UPDATE_TASK, { value: data_3.properties, by: data_3.email });
                return [4 /*yield*/, ticketsModel_1.Tickets.updateTask(data_3.tid, data_3.id, data_3.properties, ticketlog)];
            case 1:
                result = _a.sent();
                if (!(result && result.value)) return [3 /*break*/, 10];
                res.send({ status: 'ok', tasks: result.value, ticketlog: ticketlog });
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data_3.nsp, roomName: ['ticketAdmin'], data: { tid: data_3.tid, ticket: result.value } })];
            case 2:
                _a.sent();
                if (!result.value.group) return [3 /*break*/, 4];
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data_3.nsp, roomName: [result.value.group], data: { tid: data_3.tid, ticket: result.value } })];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4:
                if (!result.value.assigned_to) return [3 /*break*/, 7];
                return [4 /*yield*/, sessionsManager_1.SessionManager.getAgentByEmail(data_3.nsp, result.value.assigned_to)];
            case 5:
                assigendTo = _a.sent();
                if (!assigendTo) return [3 /*break*/, 7];
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data_3.nsp, roomName: [assigendTo._id], data: { tid: data_3.tid, ticket: result.value } })];
            case 6:
                _a.sent();
                _a.label = 7;
            case 7:
                if (!result.value.watchers) return [3 /*break*/, 9];
                val_2 = result.value;
                return [4 /*yield*/, sessionsManager_1.SessionManager.getOnlineWatchers(data_3.nsp, val_2.watchers)];
            case 8:
                watchers = _a.sent();
                if (watchers && watchers.length) {
                    if (result.value.assigned_to)
                        watchers = watchers.filter(function (x) { return x != val_2.assigned_to; });
                    watchers.map(function (watcher) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data_3.nsp, roomName: [watcher._id], data: { tid: data_3.tid, ticket: val_2 } })];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                }
                _a.label = 9;
            case 9: return [3 /*break*/, 11];
            case 10:
                res.send({ status: 'error' });
                _a.label = 11;
            case 11: return [3 /*break*/, 13];
            case 12:
                err_7 = _a.sent();
                console.log(err_7);
                console.log('Error in updating ticket task');
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 13];
            case 13: return [2 /*return*/];
        }
    });
}); });
router.post('/checkedTask', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data_4, ticketlog, result, assigendTo, val_3, watchers, err_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 12, , 13]);
                data_4 = req.body;
                if (!data_4.tid)
                    res.status(401).send('Invalid Request!');
                ticketlog = ticketEnums_1.ComposedTicketENUM(ticketEnums_1.TicketLogMessages.TASK_STATUS_CHANGED, { value: data_4.status ? 'Marked as Completed' : 'Marked as Incomplete', by: data_4.email, extraPara: data_4.name });
                return [4 /*yield*/, ticketsModel_1.Tickets.checkedTask(data_4.tid, data_4.id, data_4.status, ticketlog)];
            case 1:
                result = _a.sent();
                if (!(result && result.value)) return [3 /*break*/, 10];
                res.send({ status: 'ok', tasks: result.value, ticketlog: ticketlog });
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data_4.nsp, roomName: ['ticketAdmin'], data: { tid: data_4.tid, ticket: result.value } })];
            case 2:
                _a.sent();
                if (!result.value.group) return [3 /*break*/, 4];
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data_4.nsp, roomName: [result.value.group], data: { tid: data_4.tid, ticket: result.value } })];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4:
                if (!result.value.assigned_to) return [3 /*break*/, 7];
                return [4 /*yield*/, sessionsManager_1.SessionManager.getAgentByEmail(data_4.nsp, result.value.assigned_to)];
            case 5:
                assigendTo = _a.sent();
                if (!assigendTo) return [3 /*break*/, 7];
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data_4.nsp, roomName: [assigendTo._id], data: { tid: data_4.tid, ticket: result.value } })];
            case 6:
                _a.sent();
                _a.label = 7;
            case 7:
                if (!result.value.watchers) return [3 /*break*/, 9];
                val_3 = result.value;
                return [4 /*yield*/, sessionsManager_1.SessionManager.getOnlineWatchers(data_4.nsp, val_3.watchers)];
            case 8:
                watchers = _a.sent();
                if (watchers && watchers.length) {
                    if (result.value.assigned_to)
                        watchers = watchers.filter(function (x) { return x != val_3.assigned_to; });
                    watchers.map(function (watcher) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data_4.nsp, roomName: [watcher._id], data: { tid: data_4.tid, ticket: val_3 } })];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                }
                _a.label = 9;
            case 9: return [3 /*break*/, 11];
            case 10:
                res.send({ status: 'error' });
                _a.label = 11;
            case 11: return [3 /*break*/, 13];
            case 12:
                err_8 = _a.sent();
                console.log(err_8);
                console.log('Error in checking ticket task');
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 13];
            case 13: return [2 /*return*/];
        }
    });
}); });
/* #endregion */
router.post('/addTags', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data_5, ticketlog, result, err_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                data_5 = req.body;
                ticketlog = ticketEnums_1.ComposedTicketENUM(ticketEnums_1.TicketLogMessages.TAG_ADDED, { value: data_5.tag, by: data_5.email });
                return [4 /*yield*/, ticketsModel_1.Tickets.addTag(data_5.tids, data_5.nsp, data_5.tag, ticketlog)];
            case 1:
                result = _a.sent();
                if (result && result.length) {
                    res.send({ status: 'ok', ticketlog: ticketlog });
                    result.map(function (ticket) { return __awaiter(void 0, void 0, void 0, function () {
                        var assignedTo, watchers;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data_5.nsp, roomName: ['ticketAdmin'], data: { tid: ticket._id, ticket: ticket } })];
                                case 1:
                                    _a.sent();
                                    if (!ticket.group) return [3 /*break*/, 3];
                                    return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data_5.nsp, roomName: [ticket.group], data: { tid: ticket._id, ticket: ticket } })];
                                case 2:
                                    _a.sent();
                                    _a.label = 3;
                                case 3:
                                    if (!ticket.assigned_to) return [3 /*break*/, 6];
                                    return [4 /*yield*/, sessionsManager_1.SessionManager.getAgentByEmail(data_5.nsp, ticket.assigned_to)];
                                case 4:
                                    assignedTo = _a.sent();
                                    if (!assignedTo) return [3 /*break*/, 6];
                                    return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data_5.nsp, roomName: [assignedTo._id], data: { tid: ticket._id, ticket: ticket } })];
                                case 5:
                                    _a.sent();
                                    _a.label = 6;
                                case 6:
                                    if (!ticket.watchers) return [3 /*break*/, 8];
                                    return [4 /*yield*/, sessionsManager_1.SessionManager.getOnlineWatchers(data_5.nsp, ticket.watchers)];
                                case 7:
                                    watchers = _a.sent();
                                    if (watchers && watchers.length) {
                                        if (ticket.assigned_to)
                                            watchers = watchers.filter(function (x) { return x != ticket.assigned_to; });
                                        watchers.map(function (watcher) { return __awaiter(void 0, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0: return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data_5.nsp, roomName: [watcher._id], data: { tid: ticket._id, ticket: ticket } })];
                                                    case 1:
                                                        _a.sent();
                                                        return [2 /*return*/];
                                                }
                                            });
                                        }); });
                                    }
                                    _a.label = 8;
                                case 8: return [2 /*return*/];
                            }
                        });
                    }); });
                }
                else {
                    res.send({ status: 'error' });
                }
                return [3 /*break*/, 3];
            case 2:
                err_9 = _a.sent();
                console.log(err_9);
                console.log('Error in adding ticket tag');
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/deleteTagTicket', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data_6, ticketlog, result, assigendTo, val_4, watchers, err_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 12, , 13]);
                data_6 = req.body;
                ticketlog = ticketEnums_1.ComposedTicketENUM(ticketEnums_1.TicketLogMessages.DELETE_TAG, { value: data_6.tag, by: data_6.email });
                return [4 /*yield*/, ticketsModel_1.Tickets.deleteTag(data_6.tid, data_6.nsp, data_6.tag, ticketlog)];
            case 1:
                result = _a.sent();
                if (!(result && result.value)) return [3 /*break*/, 10];
                res.send({ status: 'ok', deletedresult: result.value, ticketlog: ticketlog });
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data_6.nsp, roomName: ['ticketAdmin'], data: { tid: data_6.tid, ticket: result.value } })];
            case 2:
                _a.sent();
                if (!result.value.group) return [3 /*break*/, 4];
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data_6.nsp, roomName: [result.value.group], data: { tid: data_6.tid, ticket: result.value } })];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4:
                if (!result.value.assigned_to) return [3 /*break*/, 7];
                return [4 /*yield*/, sessionsManager_1.SessionManager.getAgentByEmail(data_6.nsp, result.value.assigned_to)];
            case 5:
                assigendTo = _a.sent();
                if (!assigendTo) return [3 /*break*/, 7];
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data_6.nsp, roomName: [assigendTo._id], data: { tid: data_6.tid, ticket: result.value } })];
            case 6:
                _a.sent();
                _a.label = 7;
            case 7:
                if (!result.value.watchers) return [3 /*break*/, 9];
                val_4 = result.value;
                return [4 /*yield*/, sessionsManager_1.SessionManager.getOnlineWatchers(data_6.nsp, val_4.watchers)];
            case 8:
                watchers = _a.sent();
                if (watchers && watchers.length) {
                    if (result.value.assigned_to)
                        watchers = watchers.filter(function (x) { return x != val_4.assigned_to; });
                    watchers.map(function (watcher) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data_6.nsp, roomName: [watcher._id], data: { tid: data_6.tid, ticket: val_4 } })];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                }
                _a.label = 9;
            case 9: return [3 /*break*/, 11];
            case 10:
                res.send({ status: 'error' });
                _a.label = 11;
            case 11: return [3 /*break*/, 13];
            case 12:
                err_10 = _a.sent();
                console.log(err_10);
                console.log('Error in deleting ticket tags');
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 13];
            case 13: return [2 /*return*/];
        }
    });
}); });
router.post('/snooze', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data_7, ticketlog, result, assigendTo, val_5, watchers, err_11;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 12, , 13]);
                data_7 = req.body;
                ticketlog = ticketEnums_1.ComposedTicketENUM(ticketEnums_1.TicketLogMessages.SNOOZE_ADDED, { value: data_7.time, by: data_7.email });
                return [4 /*yield*/, ticketsModel_1.Tickets.Snooze(data_7.time, data_7.email, data_7.selectedThread, data_7.nsp, ticketlog)];
            case 1:
                result = _a.sent();
                if (!(result && result.value)) return [3 /*break*/, 10];
                res.send({ status: 'ok', snooze: result.value, ticketlog: ticketlog });
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data_7.nsp, roomName: ['ticketAdmin'], data: { tid: data_7.selectedThread, ticket: result.value } })];
            case 2:
                _a.sent();
                if (!result.value.group) return [3 /*break*/, 4];
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data_7.nsp, roomName: [result.value.group], data: { tid: data_7.selectedThread, ticket: result.value } })];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4:
                if (!result.value.assigned_to) return [3 /*break*/, 7];
                return [4 /*yield*/, sessionsManager_1.SessionManager.getAgentByEmail(data_7.nsp, result.value.assigned_to)];
            case 5:
                assigendTo = _a.sent();
                if (!assigendTo) return [3 /*break*/, 7];
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data_7.nsp, roomName: [assigendTo._id], data: { tid: data_7.selectedThread, ticket: result.value } })];
            case 6:
                _a.sent();
                _a.label = 7;
            case 7:
                if (!result.value.watchers) return [3 /*break*/, 9];
                val_5 = result.value;
                return [4 /*yield*/, sessionsManager_1.SessionManager.getOnlineWatchers(data_7.nsp, val_5.watchers)];
            case 8:
                watchers = _a.sent();
                if (watchers && watchers.length) {
                    if (result.value.assigned_to)
                        watchers = watchers.filter(function (x) { return x != val_5.assigned_to; });
                    watchers.map(function (watcher) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data_7.nsp, roomName: [watcher._id], data: { tid: data_7.selectedThread, ticket: val_5 } })];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                }
                _a.label = 9;
            case 9: return [3 /*break*/, 11];
            case 10:
                res.send({ status: 'error' });
                _a.label = 11;
            case 11: return [3 /*break*/, 13];
            case 12:
                err_11 = _a.sent();
                console.log(err_11);
                console.log('Error in snoozing ticket');
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 13];
            case 13: return [2 /*return*/];
        }
    });
}); });
router.post('/exportdays', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, session, ticketPermissions, dataToSend, err_12;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                data = req.body;
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetSessionByEmailFromDatabase(data.email, data.nsp)];
            case 1:
                session = _a.sent();
                if (session) {
                    ticketPermissions = session.permissions.tickets;
                    dataToSend = {
                        from: data.datafrom,
                        to: data.datato,
                        nsp: data.nsp,
                        email: data.email,
                        receivers: data.emails,
                        canView: ticketPermissions.canView,
                        filters: data.filters,
                        keys: data.keys
                    };
                    //Send to Email Service
                    emailService_1.EmailService.SendEmail({
                        action: 'ExportTickets',
                        data: dataToSend,
                    }, 5, true);
                    res.send({ status: 'ok', details: [] });
                }
                return [3 /*break*/, 3];
            case 2:
                err_12 = _a.sent();
                console.log(err_12);
                console.log('Error in exporting tickets');
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/exportSlaReport', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, session, ticketPermissions, dataToSend, err_13;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                data = req.body;
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetSessionByEmailFromDatabase(data.email, data.nsp)];
            case 1:
                session = _a.sent();
                if (session) {
                    ticketPermissions = session.permissions.tickets;
                    dataToSend = {
                        from: data.datafrom ? data.datafrom : '',
                        to: data.datato ? data.datato : '',
                        nsp: data.nsp,
                        receivers: data.emails,
                        keys: data.wise ? data.wise : undefined,
                        ids: data.ids && data.ids.length ? data.ids : []
                    };
                    // console.log(dataToSend)
                    emailService_1.EmailService.SendEmail({
                        action: 'ExportSLAReport',
                        data: dataToSend,
                    }, 5, true);
                    res.send({ status: 'ok', details: [] });
                }
                return [3 /*break*/, 3];
            case 2:
                err_13 = _a.sent();
                console.log(err_13);
                console.log('Error in exporting sla tickets');
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/mergeTicket', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data_8, ticketlogPrimMerge, ticketlogSecMerge, ticketlog, mergedTickets_1, assignedTo, watchers, err_14;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 9, , 10]);
                data_8 = req.body;
                ticketlogPrimMerge = ticketEnums_1.ComposedTicketENUM(ticketEnums_1.TicketLogMessages.PRIMARY_TICKETLOG_MERGE, { value: data_8.mergeGroup.join('<br>'), by: data_8.email });
                ticketlogSecMerge = ticketEnums_1.ComposedTicketENUM(ticketEnums_1.TicketLogMessages.SECONDARY_TICKETLOG_MERGE, { value: data_8.primaryTicketID, by: data_8.email });
                ticketlog = { primaryTicketLog: ticketlogPrimMerge, secondaryTicketLog: ticketlogSecMerge };
                return [4 /*yield*/, ticketsModel_1.Tickets.MergeTickets(data_8.nsp, data_8.mergeGroup, ticketlog, data_8.secondaryTicketDetails, data_8.primaryTicketID)];
            case 1:
                mergedTickets_1 = _a.sent();
                if (!(mergedTickets_1 && mergedTickets_1.primaryTicket && mergedTickets_1.secondaryTicket && mergedTickets_1.secondaryTicket.length)) return [3 /*break*/, 7];
                res.send({ status: 'ok', primayTicket: mergedTickets_1.primaryTicket, secondaryTicket: mergedTickets_1.secondaryTicket });
                if (!mergedTickets_1.primaryTicket.assigned_to) return [3 /*break*/, 4];
                return [4 /*yield*/, sessionsManager_1.SessionManager.getAgentByEmail(data_8.nsp, mergedTickets_1.primaryTicket.assigned_to)];
            case 2:
                assignedTo = _a.sent();
                if (!assignedTo) return [3 /*break*/, 4];
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicket', nsp: data_8.nsp, roomName: [assignedTo._id], data: { tid: mergedTickets_1.primaryTicket._id, ticket: mergedTickets_1.primaryTicket, ignoreAdmin: true } })];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4:
                if (!mergedTickets_1.primaryTicket.watchers) return [3 /*break*/, 6];
                return [4 /*yield*/, sessionsManager_1.SessionManager.getOnlineWatchers(data_8.nsp, mergedTickets_1.primaryTicket.watchers)];
            case 5:
                watchers = _a.sent();
                if (watchers && watchers.length) {
                    if (mergedTickets_1.primaryTicket.assigned_to)
                        watchers = watchers.filter(function (data) { return data != mergedTickets_1.primaryTicket.assigned_to; });
                    watchers.map(function (watcher) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicket', nsp: data_8.nsp, roomName: [watcher._id], data: { tid: mergedTickets_1.primaryTicket._id, ticket: mergedTickets_1.primaryTicket, ignoreAdmin: true } })];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                }
                _a.label = 6;
            case 6:
                mergedTickets_1.secondaryTicket.map(function (ticket) { return __awaiter(void 0, void 0, void 0, function () {
                    var assignedTo, watchers;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data_8.nsp, roomName: ['ticketAdmin'], data: { tid: ticket._id, ticket: ticket } })];
                            case 1:
                                _a.sent();
                                if (!ticket.group) return [3 /*break*/, 3];
                                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data_8.nsp, roomName: [ticket.group], data: { tid: ticket._id, ticket: ticket } })];
                            case 2:
                                _a.sent();
                                _a.label = 3;
                            case 3:
                                if (!ticket.assigned_to) return [3 /*break*/, 6];
                                return [4 /*yield*/, sessionsManager_1.SessionManager.getAgentByEmail(data_8.nsp, ticket.assigned_to)];
                            case 4:
                                assignedTo = _a.sent();
                                if (!assignedTo) return [3 /*break*/, 6];
                                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data_8.nsp, roomName: [assignedTo._id], data: { tid: ticket._id, ticket: ticket } })];
                            case 5:
                                _a.sent();
                                _a.label = 6;
                            case 6:
                                if (!ticket.watchers) return [3 /*break*/, 8];
                                return [4 /*yield*/, sessionsManager_1.SessionManager.getOnlineWatchers(data_8.nsp, ticket.watchers)];
                            case 7:
                                watchers = _a.sent();
                                if (watchers && watchers.length) {
                                    if (ticket.assigned_to)
                                        watchers = watchers.filter(function (data) { return data != ticket.assigned_to; });
                                    watchers.map(function (watcher) { return __awaiter(void 0, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data_8.nsp, roomName: [watcher._id], data: { tid: ticket._id, ticket: ticket } })];
                                                case 1:
                                                    _a.sent();
                                                    return [2 /*return*/];
                                            }
                                        });
                                    }); });
                                }
                                _a.label = 8;
                            case 8: return [2 /*return*/];
                        }
                    });
                }); });
                return [3 /*break*/, 8];
            case 7:
                res.send({ status: 'error' });
                _a.label = 8;
            case 8: return [3 /*break*/, 10];
            case 9:
                err_14 = _a.sent();
                console.log(err_14);
                console.log('Error in merging ticket ');
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 10];
            case 10: return [2 /*return*/];
        }
    });
}); });
router.post('/demergeTicket', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data_9, ticketlogPrimDeMerge, ticketlogSecDeMerge, ticketlog, demergedTickets_1, assignedTo, assignedTo, watchers, watchers, err_15;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 20, , 21]);
                data_9 = req.body;
                ticketlogPrimDeMerge = ticketEnums_1.ComposedTicketENUM(ticketEnums_1.TicketLogMessages.PRIMARY_TICKETLOG_DEMERGE, { value: data_9.SecondaryReference + '<br>', by: data_9.email });
                ticketlogSecDeMerge = ticketEnums_1.ComposedTicketENUM(ticketEnums_1.TicketLogMessages.SECONDARY_TICKETLOG_DEMERGE, { value: data_9.primaryReference, by: data_9.email });
                ticketlog = { primaryTicketLog: ticketlogPrimDeMerge, secondaryTicketLog: ticketlogSecDeMerge };
                return [4 /*yield*/, ticketsModel_1.Tickets.DeMergeTickets(data_9.nsp, data_9.primaryReference, data_9.SecondaryReference, ticketlog)];
            case 1:
                demergedTickets_1 = _a.sent();
                if (!(demergedTickets_1 && demergedTickets_1.primaryTicket && demergedTickets_1.secondaryTicket)) return [3 /*break*/, 18];
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data_9.nsp, roomName: ['ticketAdmin'], data: { tid: demergedTickets_1.primaryTicket._id, ticket: demergedTickets_1.primaryTicket } })];
            case 2:
                _a.sent();
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data_9.nsp, roomName: ['ticketAdmin'], data: { tid: demergedTickets_1.secondaryTicket._id, ticket: demergedTickets_1.secondaryTicket } })];
            case 3:
                _a.sent();
                if (!demergedTickets_1.primaryTicket.group) return [3 /*break*/, 5];
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data_9.nsp, roomName: [demergedTickets_1.primaryTicket.group], data: { tid: demergedTickets_1.primaryTicket._id, ticket: demergedTickets_1.primaryTicket } })];
            case 4:
                _a.sent();
                _a.label = 5;
            case 5:
                if (!demergedTickets_1.secondaryTicket.group) return [3 /*break*/, 7];
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data_9.nsp, roomName: [demergedTickets_1.secondaryTicket.group], data: { tid: demergedTickets_1.secondaryTicket._id, ticket: demergedTickets_1.secondaryTicket } })];
            case 6:
                _a.sent();
                _a.label = 7;
            case 7:
                if (!demergedTickets_1.primaryTicket.assigned_to) return [3 /*break*/, 10];
                return [4 /*yield*/, sessionsManager_1.SessionManager.getAgentByEmail(data_9.nsp, demergedTickets_1.primaryTicket.assigned_to)];
            case 8:
                assignedTo = _a.sent();
                if (!assignedTo) return [3 /*break*/, 10];
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data_9.nsp, roomName: [assignedTo._id], data: { tid: demergedTickets_1.primaryTicket._id, ticket: demergedTickets_1.primaryTicket } })];
            case 9:
                _a.sent();
                _a.label = 10;
            case 10:
                if (!demergedTickets_1.secondaryTicket.assigned_to) return [3 /*break*/, 13];
                return [4 /*yield*/, sessionsManager_1.SessionManager.getAgentByEmail(data_9.nsp, demergedTickets_1.secondaryTicket.assigned_to)];
            case 11:
                assignedTo = _a.sent();
                if (!assignedTo) return [3 /*break*/, 13];
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data_9.nsp, roomName: [assignedTo._id], data: { tid: demergedTickets_1.secondaryTicket._id, ticket: demergedTickets_1.secondaryTicket } })];
            case 12:
                _a.sent();
                _a.label = 13;
            case 13:
                if (!demergedTickets_1.secondaryTicket.watchers) return [3 /*break*/, 15];
                return [4 /*yield*/, sessionsManager_1.SessionManager.getOnlineWatchers(data_9.nsp, demergedTickets_1.secondaryTicket.watchers)];
            case 14:
                watchers = _a.sent();
                if (watchers && watchers.length) {
                    if (demergedTickets_1.secondaryTicket.assigned_to)
                        watchers = watchers.filter(function (data) { return data != demergedTickets_1.secondaryTicket.assigned_to; });
                    watchers.map(function (watcher) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data_9.nsp, roomName: [watcher._id], data: { tid: demergedTickets_1.secondaryTicket._id, ticket: demergedTickets_1.secondaryTicket } })];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                }
                _a.label = 15;
            case 15:
                if (!demergedTickets_1.primaryTicket.watchers) return [3 /*break*/, 17];
                return [4 /*yield*/, sessionsManager_1.SessionManager.getOnlineWatchers(data_9.nsp, demergedTickets_1.primaryTicket.watchers)];
            case 16:
                watchers = _a.sent();
                if (watchers && watchers.length) {
                    if (demergedTickets_1.primaryTicket.assigned_to)
                        watchers = watchers.filter(function (data) { return data != demergedTickets_1.primaryTicket.assigned_to; });
                    watchers.map(function (watcher) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data_9.nsp, roomName: [watcher._id], data: { tid: demergedTickets_1.primaryTicket._id, ticket: demergedTickets_1.primaryTicket } })];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                }
                _a.label = 17;
            case 17:
                res.send({ status: 'ok', primayTicket: demergedTickets_1.primaryTicket, secondaryTicket: demergedTickets_1.secondaryTicket });
                return [3 /*break*/, 19];
            case 18:
                res.send({ status: 'error' });
                _a.label = 19;
            case 19: return [3 /*break*/, 21];
            case 20:
                err_15 = _a.sent();
                console.log(err_15);
                console.log('Error in demerging ticket ');
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 21];
            case 21: return [2 /*return*/];
        }
    });
}); });
router.post('/editTicketNote', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data_10, ticketlog, results, err_16;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                data_10 = req.body;
                data_10.properties.id = new mongodb_1.ObjectID();
                if (data_10.properties && (!data_10.properties.id || !data_10.properties.added_by || !data_10.properties.added_at || !data_10.properties.ticketNote))
                    res.send({ status: 'error' });
                ticketlog = ticketEnums_1.ComposedTicketENUM(ticketEnums_1.TicketLogMessages.NOTE_ADDED, { value: data_10.properties.ticketNote, by: data_10.email });
                return [4 /*yield*/, ticketsModel_1.Tickets.UpdateTicketNote(data_10.tids, data_10.properties, data_10.nsp, ticketlog)];
            case 1:
                results = _a.sent();
                if (results && results.length) {
                    res.send({ status: 'ok', note: results[0].ticketNotes, ticketlog: ticketlog });
                    results.map(function (result) { return __awaiter(void 0, void 0, void 0, function () {
                        var origin, recipients_1, msg, obj, response, assigendTo, watchers;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, agentModel_1.Agents.GetEmailNotificationSettings(data_10.nsp, data_10.email)];
                                case 1:
                                    origin = _a.sent();
                                    if (!(origin && origin.length && origin[0].settings && origin[0].settings.emailNotifications && origin[0].settings.emailNotifications.noteAddTick)) return [3 /*break*/, 3];
                                    recipients_1 = [];
                                    if (result.assigned_to)
                                        recipients_1.push(result.assigned_to);
                                    if (result.watchers && result.watchers.length) {
                                        recipients_1 = recipients_1.concat(result.watchers);
                                        recipients_1 = recipients_1.filter(function (item, pos) {
                                            if (recipients_1 && recipients_1.length)
                                                return recipients_1.indexOf(item) == pos;
                                        });
                                    }
                                    msg = '<span><b>ID: </b>' + result._id + '<br>'
                                        + '<span><b>Note: </b> ' + data_10.properties.ticketNote + '<br>'
                                        + '<span><b>Added by: </b> ' + data_10.email + '<br>'
                                        + '<span><b>Link: </b> https://app.beelinks.solutions/tickets/ticket-view/' + result._id + '<br>';
                                    obj = {
                                        action: 'sendNoReplyEmail',
                                        to: recipients_1,
                                        subject: 'New Note added to Ticket #' + result._id,
                                        message: msg,
                                        html: msg,
                                        type: 'newNote'
                                    };
                                    response = void 0;
                                    if (!(recipients_1 && recipients_1.length)) return [3 /*break*/, 3];
                                    return [4 /*yield*/, emailService_1.EmailService.SendNoReplyEmail(obj, false)];
                                case 2:
                                    response = _a.sent();
                                    _a.label = 3;
                                case 3: return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data_10.nsp, roomName: ['ticketAdmin'], data: { tid: result._id, ticket: result } })];
                                case 4:
                                    _a.sent();
                                    if (!result.group) return [3 /*break*/, 6];
                                    return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data_10.nsp, roomName: [result.group], data: { tid: result._id, ticket: result } })];
                                case 5:
                                    _a.sent();
                                    _a.label = 6;
                                case 6:
                                    if (!result.assigned_to) return [3 /*break*/, 9];
                                    return [4 /*yield*/, sessionsManager_1.SessionManager.getAgentByEmail(data_10.nsp, result.assigned_to)];
                                case 7:
                                    assigendTo = _a.sent();
                                    if (!assigendTo) return [3 /*break*/, 9];
                                    return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data_10.nsp, roomName: [assigendTo._id], data: { tid: result._id, ticket: result } })];
                                case 8:
                                    _a.sent();
                                    _a.label = 9;
                                case 9:
                                    if (!result.watchers) return [3 /*break*/, 11];
                                    return [4 /*yield*/, sessionsManager_1.SessionManager.getOnlineWatchers(data_10.nsp, result.watchers)];
                                case 10:
                                    watchers = _a.sent();
                                    if (watchers && watchers.length) {
                                        if (result.assigned_to)
                                            watchers = watchers.filter(function (x) { return x != result.assigned_to; });
                                        watchers.map(function (watcher) { return __awaiter(void 0, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0: return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data_10.nsp, roomName: [watcher._id], data: { tid: result._id, ticket: result } })];
                                                    case 1:
                                                        _a.sent();
                                                        return [2 /*return*/];
                                                }
                                            });
                                        }); });
                                    }
                                    _a.label = 11;
                                case 11: return [2 /*return*/];
                            }
                        });
                    }); });
                }
                else {
                    res.send({ status: 'error' });
                }
                return [3 /*break*/, 3];
            case 2:
                err_16 = _a.sent();
                console.log(err_16);
                console.log('Error in adding ticket note');
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/deleteNote', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data_11, ticketlog, result, assigendTo, val_6, watchers, err_17;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 12, , 13]);
                data_11 = req.body;
                ticketlog = ticketEnums_1.ComposedTicketENUM(ticketEnums_1.TicketLogMessages.DELETE_NOTE, { value: data_11.note, by: data_11.email });
                return [4 /*yield*/, ticketsModel_1.Tickets.deleteNote(data_11.id, data_11.noteId, ticketlog)];
            case 1:
                result = _a.sent();
                if (!(result && result.value)) return [3 /*break*/, 10];
                res.send({ status: 'ok', deletedresult: result.value.ticketNotes, ticketlog: ticketlog });
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data_11.nsp, roomName: ['ticketAdmin'], data: { tid: data_11.id, ticket: result.value } })];
            case 2:
                _a.sent();
                if (!result.value.group) return [3 /*break*/, 4];
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data_11.nsp, roomName: [result.value.group], data: { tid: data_11.id, ticket: result.value } })];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4:
                if (!result.value.assigned_to) return [3 /*break*/, 7];
                return [4 /*yield*/, sessionsManager_1.SessionManager.getAgentByEmail(data_11.nsp, result.value.assigned_to)];
            case 5:
                assigendTo = _a.sent();
                if (!assigendTo) return [3 /*break*/, 7];
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data_11.nsp, roomName: [assigendTo._id], data: { tid: data_11.id, ticket: result.value } })];
            case 6:
                _a.sent();
                _a.label = 7;
            case 7:
                if (!result.value.watchers) return [3 /*break*/, 9];
                val_6 = result.value;
                return [4 /*yield*/, sessionsManager_1.SessionManager.getOnlineWatchers(data_11.nsp, val_6.watchers)];
            case 8:
                watchers = _a.sent();
                if (watchers && watchers.length) {
                    if (result.value.assigned_to)
                        watchers = watchers.filter(function (x) { return x != val_6.assigned_to; });
                    watchers.map(function (watcher) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data_11.nsp, roomName: [watcher._id], data: { tid: data_11.id, ticket: val_6 } })];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                }
                _a.label = 9;
            case 9: return [3 /*break*/, 11];
            case 10:
                res.send({ status: 'error' });
                _a.label = 11;
            case 11: return [3 /*break*/, 13];
            case 12:
                err_17 = _a.sent();
                console.log(err_17);
                console.log('Error in deleting ticket note');
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 13];
            case 13: return [2 /*return*/];
        }
    });
}); });
/* #region  Ticket Priority */
router.post('/changeTicketPriority', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data_12, ticketlog, results, err_18;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                data_12 = req.body;
                ticketlog = ticketEnums_1.ComposedTicketENUM(ticketEnums_1.TicketLogMessages.PRIORITY_CHANGED, { value: data_12.priority, by: data_12.email });
                return [4 /*yield*/, ticketsModel_1.Tickets.UpdateTicketPriority(data_12.ids, data_12.nsp, data_12.priority, ticketlog)];
            case 1:
                results = _a.sent();
                if (results && results.length) {
                    results.map(function (result) { return __awaiter(void 0, void 0, void 0, function () {
                        var assigendTo, watchers;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data_12.nsp, roomName: ['ticketAdmin'], data: { tid: result._id, ticket: result } })];
                                case 1:
                                    _a.sent();
                                    if (!result.group) return [3 /*break*/, 3];
                                    return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data_12.nsp, roomName: [result.group], data: { tid: result._id, ticket: result } })];
                                case 2:
                                    _a.sent();
                                    _a.label = 3;
                                case 3:
                                    if (!result.assigned_to) return [3 /*break*/, 6];
                                    return [4 /*yield*/, sessionsManager_1.SessionManager.getAgentByEmail(data_12.nsp, result.assigned_to)];
                                case 4:
                                    assigendTo = _a.sent();
                                    if (!assigendTo) return [3 /*break*/, 6];
                                    return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data_12.nsp, roomName: [assigendTo._id], data: { tid: result._id, ticket: result } })];
                                case 5:
                                    _a.sent();
                                    _a.label = 6;
                                case 6:
                                    if (!result.watchers) return [3 /*break*/, 8];
                                    return [4 /*yield*/, sessionsManager_1.SessionManager.getOnlineWatchers(data_12.nsp, result.watchers)];
                                case 7:
                                    watchers = _a.sent();
                                    if (watchers && watchers.length) {
                                        if (result.assigned_to)
                                            watchers = watchers.filter(function (x) { return x != result.assigned_to; });
                                        watchers.map(function (watcher) { return __awaiter(void 0, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0: return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data_12.nsp, roomName: [watcher._id], data: { tid: result._id, ticket: result } })];
                                                    case 1:
                                                        _a.sent();
                                                        return [2 /*return*/];
                                                }
                                            });
                                        }); });
                                    }
                                    _a.label = 8;
                                case 8: return [2 /*return*/];
                            }
                        });
                    }); });
                    res.send({ status: 'ok', ticketlog: ticketlog });
                }
                else {
                    res.send({ status: 'error' });
                }
                return [3 /*break*/, 3];
            case 2:
                err_18 = _a.sent();
                console.log(err_18);
                console.log('Error in changing priority');
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/* #endregion */
/* #region  Ticket State */
router.post('/changeTicketState', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data_13, ticketlog, results_1, lasttouchedTime, survey_1, getMessageById, message_1, message_2, ticketClosed, ticketSolved, err_19;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 10, , 11]);
                data_13 = req.body;
                ticketlog = ticketEnums_1.ComposedTicketENUM(ticketEnums_1.TicketLogMessages.STATE_CHANGED, { value: data_13.state, by: data_13.email });
                return [4 /*yield*/, ticketsModel_1.Tickets.UpdateTicket(data_13.tids, data_13.nsp, ticketlog, data_13.state)];
            case 1:
                results_1 = _a.sent();
                lasttouchedTime = new Date().toISOString();
                if (!(results_1 && results_1.length)) return [3 /*break*/, 8];
                return [4 /*yield*/, FeedBackSurveyModel_1.FeedBackSurveyModel.getActivatedSurvey()];
            case 2:
                survey_1 = _a.sent();
                return [4 /*yield*/, ticketsModel_1.Tickets.getMessagesByTicketId(data_13.tids)];
            case 3:
                getMessageById = _a.sent();
                if (data_13.state == 'SOLVED' && survey_1 && survey_1.length && survey_1[0].sendWhen == 'solved' && getMessageById && getMessageById.length) {
                    message_1 = 'This is to inform you that Ticket is SOLVED sucessfully, if you find some ambiguity in SOLVED ticket, reply back to this thread. Kindly took out some moment to fill survey form following';
                    getMessageById.map(function (data) {
                        emailService_1.EmailService.SendEmail({
                            action: 'StateChangedFeedbackSurvey',
                            survey: survey_1 && survey_1.length ? survey_1[0] : [],
                            ticket: results_1,
                            reply: data.to[0],
                            message: message_1
                        }, 5, true);
                    });
                }
                if (data_13.state == 'CLOSED' && survey_1 && survey_1.length && survey_1[0].sendWhen == 'closed' && getMessageById && getMessageById.length) {
                    message_2 = 'This is to inform you that Ticket is CLOSED sucessfully, if you find some ambiguity in CLOSED ticket, reply back to this thread. Kindly took out some moment to fill survey form following';
                    getMessageById.map(function (data) {
                        emailService_1.EmailService.SendEmail({
                            action: 'StateChangedFeedbackSurvey',
                            survey: survey_1 && survey_1.length ? survey_1[0] : [],
                            ticket: results_1,
                            reply: data.to[0],
                            message: message_2
                        }, 5, true);
                    });
                }
                if (!(data_13.state == 'CLOSED')) return [3 /*break*/, 5];
                return [4 /*yield*/, ticketsModel_1.Tickets.TicketClosed(data_13.tids, lasttouchedTime)];
            case 4:
                ticketClosed = _a.sent();
                _a.label = 5;
            case 5:
                if (!(data_13.state == 'SOLVED')) return [3 /*break*/, 7];
                return [4 /*yield*/, ticketsModel_1.Tickets.TicketSolved(data_13.tids, lasttouchedTime, data_13.email)];
            case 6:
                ticketSolved = _a.sent();
                _a.label = 7;
            case 7:
                results_1.map(function (result) { return __awaiter(void 0, void 0, void 0, function () {
                    var assignedTo, watchers;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data_13.nsp, roomName: ['ticketAdmin'], data: { tid: result._id, ticket: result } })];
                            case 1:
                                _a.sent();
                                if (!result.group) return [3 /*break*/, 3];
                                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data_13.nsp, roomName: [result.group], data: { tid: result._id, ticket: result } })];
                            case 2:
                                _a.sent();
                                _a.label = 3;
                            case 3:
                                if (!result.assigned_to) return [3 /*break*/, 6];
                                return [4 /*yield*/, sessionsManager_1.SessionManager.getAgentByEmail(data_13.nsp, result.assigned_to)];
                            case 4:
                                assignedTo = _a.sent();
                                if (!(assignedTo && assignedTo.type == 'Agents' && assignedTo.permissions.tickets.canView == 'assignedOnly')) return [3 /*break*/, 6];
                                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data_13.nsp, roomName: [assignedTo._id], data: { tid: result._id, ticket: result } })];
                            case 5:
                                _a.sent();
                                _a.label = 6;
                            case 6:
                                if (!result.watchers) return [3 /*break*/, 8];
                                return [4 /*yield*/, sessionsManager_1.SessionManager.getOnlineWatchers(data_13.nsp, result.watchers)];
                            case 7:
                                watchers = _a.sent();
                                if (watchers && watchers.length) {
                                    if (result.assigned_to)
                                        watchers = watchers.filter(function (x) { return x != result.assigned_to; });
                                    watchers.map(function (watcher) { return __awaiter(void 0, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data_13.nsp, roomName: [watcher._id], data: { tid: result._id, ticket: result } })];
                                                case 1:
                                                    _a.sent();
                                                    return [2 /*return*/];
                                            }
                                        });
                                    }); });
                                }
                                _a.label = 8;
                            case 8: return [2 /*return*/];
                        }
                    });
                }); });
                res.send({ status: 'ok', ticketlog: ticketlog });
                return [3 /*break*/, 9];
            case 8:
                res.send({ status: 'error' });
                _a.label = 9;
            case 9: return [3 /*break*/, 11];
            case 10:
                err_19 = _a.sent();
                console.log(err_19);
                console.log('Error in changing state');
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 11];
            case 11: return [2 /*return*/];
        }
    });
}); });
/* #endregion */
/* #region  Ticket Group */
router.post('/changeGroup', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data_14, ticketlog, results, err_20;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                data_14 = req.body;
                ticketlog = ticketEnums_1.ComposedTicketENUM(ticketEnums_1.TicketLogMessages.GROUP_ASSIGNED, { value: data_14.group, by: data_14.email });
                return [4 /*yield*/, ticketsModel_1.Tickets.UpdateTicketGroup(data_14.ids, data_14.nsp, data_14.group, ticketlog)];
            case 1:
                results = _a.sent();
                if (results && results.length) {
                    res.send({ status: 'ok', ticketlog: ticketlog });
                    results.map(function (ticket) { return __awaiter(void 0, void 0, void 0, function () {
                        var origin, groupAdmins_1, msg, obj, agent, watchers;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, companyModel_1.Company.GetEmailNotificationSettings(data_14.nsp)];
                                case 1:
                                    origin = _a.sent();
                                    if (!(origin && origin.length && origin[0].settings.emailNotifications.tickets.assignToGroup)) return [3 /*break*/, 3];
                                    return [4 /*yield*/, TicketgroupModel_1.TicketGroupsModel.GetGroupAdmins(data_14.nsp, ticket.group)];
                                case 2:
                                    groupAdmins_1 = _a.sent();
                                    if (ticket.watchers && ticket.watchers.length) {
                                        if (groupAdmins_1 && groupAdmins_1.length)
                                            groupAdmins_1 = groupAdmins_1.concat(ticket.watchers);
                                        else
                                            groupAdmins_1 = ticket.watchers;
                                        if (groupAdmins_1 && groupAdmins_1.length) {
                                            groupAdmins_1 = groupAdmins_1.filter(function (item, pos) {
                                                if (groupAdmins_1 && groupAdmins_1.length)
                                                    return groupAdmins_1.indexOf(item) == pos;
                                            });
                                        }
                                    }
                                    if (groupAdmins_1 && groupAdmins_1.length) {
                                        msg = '<span><b>ID: </b>' + ticket._id + '<br>'
                                            + '<span><b>Group: </b> ' + ticket.group + '<br>'
                                            + '<span><b>Assigned by: </b> ' + data_14.email + '<br>'
                                            + '<span><b>Link: </b> https://app.beelinks.solutions/tickets/ticket-view/' + ticket._id + '<br>';
                                        obj = {
                                            action: 'sendNoReplyEmail',
                                            to: groupAdmins_1,
                                            subject: 'Group assigned to Ticket #' + ticket._id,
                                            message: msg,
                                            html: msg,
                                            type: 'newTicket'
                                        };
                                        // let response = EmailService.SendNoReplyEmail(obj, false);
                                    }
                                    _a.label = 3;
                                case 3: return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicket', nsp: data_14.nsp, roomName: ['ticketAdmin'], data: { tid: ticket._id, ticket: ticket, email: ticket.assigned_to } })];
                                case 4:
                                    _a.sent();
                                    if (!ticket.assigned_to) return [3 /*break*/, 7];
                                    return [4 /*yield*/, sessionsManager_1.SessionManager.getAgentByEmail(data_14.nsp, ticket.assigned_to)];
                                case 5:
                                    agent = _a.sent();
                                    if (!(agent && agent.permissions.ticket.canView != 'all')) return [3 /*break*/, 7];
                                    return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicket', nsp: data_14.nsp, roomName: [agent._id], data: { tid: ticket._id, ticket: ticket, email: ticket.assigned_to } })];
                                case 6:
                                    _a.sent();
                                    _a.label = 7;
                                case 7:
                                    if (!ticket.watchers) return [3 /*break*/, 9];
                                    return [4 /*yield*/, sessionsManager_1.SessionManager.getOnlineWatchers(data_14.nsp, ticket.watchers)];
                                case 8:
                                    watchers = _a.sent();
                                    if (watchers && watchers.length) {
                                        watchers = watchers.filter(function (data) { return data != ticket.assigned_to; });
                                        watchers.map(function (watcher) { return __awaiter(void 0, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0: return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicket', nsp: data_14.nsp, roomName: [watcher._id], data: { tid: ticket._id, ticket: ticket, email: ticket.assigned_to } })];
                                                    case 1:
                                                        _a.sent();
                                                        return [2 /*return*/];
                                                }
                                            });
                                        }); });
                                    }
                                    _a.label = 9;
                                case 9: return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'removeTicket', nsp: data_14.nsp, roomName: [data_14.previousGroup], data: { tid: ticket._id, ticket: ticket, email: ticket.assigned_to } })];
                                case 10:
                                    _a.sent();
                                    return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'newTicket', nsp: data_14.nsp, roomName: [ticket.group], data: { ticket: ticket, ignoreAdmin: false } })];
                                case 11:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                }
                return [3 /*break*/, 3];
            case 2:
                err_20 = _a.sent();
                res.status(401).send('Invalid Request!');
                console.log(err_20);
                console.log('Error in changing group');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/* #endregion */
/* #region  Ticket Watchers */
router.post('/addWatchers', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data_15, ticketlog, watchers, err_21;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                data_15 = req.body;
                ticketlog = ticketEnums_1.ComposedTicketENUM(ticketEnums_1.TicketLogMessages.WATCHERS_ADDED, { value: data_15.agents.toString(), by: data_15.email });
                return [4 /*yield*/, ticketsModel_1.Tickets.addWatchers(data_15.tids, data_15.agents, ticketlog, data_15.nsp)];
            case 1:
                watchers = _a.sent();
                if (watchers && watchers.length) {
                    res.send({ status: 'ok', watchers: watchers[0], ticketlog: ticketlog });
                    watchers.map(function (watcher) { return __awaiter(void 0, void 0, void 0, function () {
                        var assignedTo, watchers_1, msg, obj, response;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data_15.nsp, roomName: ['ticketAdmin'], data: { tid: watcher._id, ticket: watcher } })];
                                case 1:
                                    _a.sent();
                                    if (!watcher.group) return [3 /*break*/, 3];
                                    return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data_15.nsp, roomName: [watcher.group], data: { tid: watcher._id, ticket: watcher } })];
                                case 2:
                                    _a.sent();
                                    _a.label = 3;
                                case 3:
                                    if (!watcher.assigned_to) return [3 /*break*/, 6];
                                    return [4 /*yield*/, sessionsManager_1.SessionManager.getAgentByEmail(data_15.nsp, watcher.assigned_to)];
                                case 4:
                                    assignedTo = _a.sent();
                                    if (!(assignedTo && assignedTo.permissions.tickets.canView == 'assignedOnly')) return [3 /*break*/, 6];
                                    return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data_15.nsp, roomName: [assignedTo._id], data: { tid: watcher._id, ticket: watcher } })];
                                case 5:
                                    _a.sent();
                                    _a.label = 6;
                                case 6:
                                    if (!watcher.watchers) return [3 /*break*/, 8];
                                    return [4 /*yield*/, sessionsManager_1.SessionManager.getOnlineWatchers(data_15.nsp, watcher.watchers)];
                                case 7:
                                    watchers_1 = _a.sent();
                                    if (watcher.assigned_to)
                                        watchers_1 = watchers_1.filter(function (x) { return x != watcher.assigned_to; });
                                    watchers_1.map(function (result) { return __awaiter(void 0, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data_15.nsp, roomName: [result._id], data: { tid: watcher._id, ticket: watcher } })];
                                                case 1:
                                                    _a.sent();
                                                    return [2 /*return*/];
                                            }
                                        });
                                    }); });
                                    _a.label = 8;
                                case 8:
                                    //new added agents
                                    if (data_15.agents) {
                                        msg = 'Hello, Agent '
                                            + '<span>You have been added as a watcher by:  ' + data_15.email + '<br>'
                                            + '<span><b>Ticket Link: </b> https://app.beelinks.solutions/tickets/ticket-view/' + watcher._id + '<br>';
                                        obj = {
                                            action: 'sendNoReplyEmail',
                                            to: data_15.agents,
                                            subject: 'Added as watcher to Ticket #' + watcher._id,
                                            message: msg,
                                            html: msg,
                                            type: 'newTicket'
                                        };
                                        response = emailService_1.EmailService.SendNoReplyEmail(obj, false);
                                        data_15.agents.map(function (result) { return __awaiter(void 0, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0: return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'newTicket', nsp: data_15.nsp, roomName: [result._id], data: { ticket: watcher, ignoreAdmin: false } })];
                                                    case 1:
                                                        _a.sent();
                                                        return [2 /*return*/];
                                                }
                                            });
                                        }); });
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                }
                return [3 /*break*/, 3];
            case 2:
                err_21 = _a.sent();
                console.log(err_21);
                console.log('Error in adding watcher');
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/deleteWatcher', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data_16, result, assignedTo, val_7, watchers, err_22;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 12, , 13]);
                data_16 = req.body;
                return [4 /*yield*/, ticketsModel_1.Tickets.deleteWatcher(data_16.id, data_16.agent)];
            case 1:
                result = _a.sent();
                if (!(result && result.value)) return [3 /*break*/, 10];
                res.send({ status: 'ok', msg: "Watcher deleted successfully!" });
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data_16.nsp, roomName: ['ticketAdmin'], data: { tid: result.value._id, ticket: result.value } })];
            case 2:
                _a.sent();
                if (!result.value.group) return [3 /*break*/, 4];
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data_16.nsp, roomName: [result.value.group], data: { tid: result.value._id, ticket: result.value } })];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4:
                if (!result.value.assigned_to) return [3 /*break*/, 7];
                return [4 /*yield*/, sessionsManager_1.SessionManager.getAgentByEmail(data_16.nsp, result.value.assigned_to)];
            case 5:
                assignedTo = _a.sent();
                if (!(assignedTo && assignedTo.permissions.ticket.canView != 'all')) return [3 /*break*/, 7];
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data_16.nsp, roomName: [assignedTo._id], data: { tid: result.value._id, ticket: result.value } })];
            case 6:
                _a.sent();
                _a.label = 7;
            case 7:
                if (!result.value.watchers) return [3 /*break*/, 9];
                val_7 = result.value;
                return [4 /*yield*/, sessionsManager_1.SessionManager.getOnlineWatchers(data_16.nsp, val_7.watchers)];
            case 8:
                watchers = _a.sent();
                if (watchers && watchers.length) {
                    if (result.value.assigned_to)
                        watchers = watchers.filter(function (x) { return x != val_7.assigned_to; });
                    watchers.map(function (watcher) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data_16.nsp, roomName: [watcher._id], data: { tid: data_16.id, ticket: val_7 } })];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                }
                _a.label = 9;
            case 9: return [3 /*break*/, 11];
            case 10:
                res.send({ status: 'error' });
                _a.label = 11;
            case 11: return [3 /*break*/, 13];
            case 12:
                err_22 = _a.sent();
                console.log(err_22);
                console.log('Error in deleting ticket watcher');
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 13];
            case 13: return [2 /*return*/];
        }
    });
}); });
/* #endregion */
/* #region  Ticket Assign Agent */
router.post('/assignAgentForTicket', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data_17, promises, ticketlog, assign_Agent_1, result, err_23;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                if (!(!req.body.nsp || !req.body.agent_email)) return [3 /*break*/, 1];
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 3];
            case 1:
                res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
                res.header('Expires', '-1');
                res.header('Pragma', 'no-cache');
                data_17 = req.body;
                promises = void 0;
                ticketlog = void 0;
                if (data_17.assignment != '') {
                    ticketlog = {
                        time_stamp: new Date().toISOString(),
                        status: data_17.agent_email,
                        title: 'Ticket Assigned to',
                        updated_by: 'ICONN Platform',
                        user_type: 'ICONN Platform'
                    };
                }
                else {
                    ticketlog = ticketEnums_1.ComposedTicketENUM(ticketEnums_1.TicketLogMessages.AGENT_ASSIGNED, { value: data_17.agent_email, by: data_17.email });
                }
                return [4 /*yield*/, Promise.all([
                        sessionsManager_1.SessionManager.getAgentByEmail(data_17.nsp, data_17.agent_email),
                        ticketsModel_1.Tickets.AssignAgent(data_17.tids, data_17.nsp, data_17.agent_email, ticketlog)
                    ])];
            case 2:
                promises = _a.sent();
                assign_Agent_1 = promises[0];
                result = promises[1];
                if (result && !result.length) {
                    res.status(401).send({ status: 'error' });
                }
                else {
                    /**
                     * @Callback_Data
                     * 1. Array<TicketsSchema>
                     * 2. dateTime : ISOSTRING
                     */
                    result.map(function (ticket) { return __awaiter(void 0, void 0, void 0, function () {
                        var previousAgent, _a, teamsOfPreviousAgent, watchers, recipients, EmailRecipients_1, res_1, teams, origin, recipients_2, msg, response;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    if (!ticket.previousAgent) return [3 /*break*/, 10];
                                    return [4 /*yield*/, sessionsManager_1.SessionManager.getAgentByEmail(data_17.nsp, ticket.previousAgent)];
                                case 1:
                                    previousAgent = _b.sent();
                                    if (!previousAgent) return [3 /*break*/, 8];
                                    _a = previousAgent.permissions.tickets.canView;
                                    switch (_a) {
                                        case 'assignedOnly': return [3 /*break*/, 2];
                                        case 'group': return [3 /*break*/, 4];
                                    }
                                    return [3 /*break*/, 7];
                                case 2: return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'removeTicket', nsp: data_17.nsp, roomName: [previousAgent._id], data: { tid: ticket._id, ticket: ticket } })];
                                case 3:
                                    _b.sent();
                                    return [3 /*break*/, 8];
                                case 4:
                                    if (!((ticket.group && !previousAgent.groups.includes(ticket.group)) || !ticket.group)) return [3 /*break*/, 6];
                                    return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'removeTicket', nsp: data_17.nsp, roomName: [previousAgent._id], data: { tid: ticket._id, ticket: ticket } })];
                                case 5:
                                    _b.sent();
                                    _b.label = 6;
                                case 6: return [3 /*break*/, 8];
                                case 7: return [3 /*break*/, 8];
                                case 8: return [4 /*yield*/, teamsModel_1.TeamsModel.getTeamsAgainstAgent(ticket.nsp, ticket.previousAgent)];
                                case 9:
                                    teamsOfPreviousAgent = _b.sent();
                                    teamsOfPreviousAgent.forEach(function (team) { return __awaiter(void 0, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'removeTicket', nsp: data_17.nsp, roomName: [team], data: { tid: ticket._id, ticket: ticket } })];
                                                case 1:
                                                    _a.sent();
                                                    return [2 /*return*/];
                                            }
                                        });
                                    }); });
                                    _b.label = 10;
                                case 10: return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data_17.nsp, roomName: ['ticketAdmin'], data: { tid: ticket._id, ticket: ticket } })];
                                case 11:
                                    _b.sent();
                                    if (!ticket.group) return [3 /*break*/, 13];
                                    return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data_17.nsp, roomName: [ticket.group], data: { tid: ticket._id, ticket: ticket } })];
                                case 12:
                                    _b.sent();
                                    _b.label = 13;
                                case 13:
                                    if (!(assign_Agent_1 && assign_Agent_1.permissions.tickets.canView != 'all')) return [3 /*break*/, 15];
                                    // console.log('Assigned Agent: ' + assign_Agent.email);
                                    // if (assign_Agent.permissions.tickets.canView == 'assignedOnly') {
                                    return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'newTicket', nsp: data_17.nsp, roomName: [assign_Agent_1._id], data: { ticket: ticket, ignoreAdmin: false } })
                                        // }
                                    ];
                                case 14:
                                    // console.log('Assigned Agent: ' + assign_Agent.email);
                                    // if (assign_Agent.permissions.tickets.canView == 'assignedOnly') {
                                    _b.sent();
                                    _b.label = 15;
                                case 15:
                                    if (!ticket.watchers) return [3 /*break*/, 17];
                                    return [4 /*yield*/, sessionsManager_1.SessionManager.getOnlineWatchers(data_17.nsp, ticket.watchers)];
                                case 16:
                                    watchers = _b.sent();
                                    if (watchers && watchers.length) {
                                        if (ticket.assigned_to)
                                            watchers = watchers.filter(function (x) { return x != ticket.assigned_to; });
                                        watchers.map(function (watcher) { return __awaiter(void 0, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0: return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data_17.nsp, roomName: [watcher._id], data: { tid: ticket._id, ticket: ticket } })];
                                                    case 1:
                                                        _a.sent();
                                                        return [2 /*return*/];
                                                }
                                            });
                                        }); });
                                    }
                                    _b.label = 17;
                                case 17:
                                    recipients = Array();
                                    if (!ticket.assigned_to) return [3 /*break*/, 20];
                                    EmailRecipients_1 = Array();
                                    return [4 /*yield*/, ticketsModel_1.Tickets.getWatchers(ticket._id, data_17.nsp)];
                                case 18:
                                    res_1 = _b.sent();
                                    if (res_1 && res_1.length) {
                                        EmailRecipients_1 = EmailRecipients_1.concat(res_1[0].watchers);
                                    }
                                    EmailRecipients_1.push(ticket.assigned_to);
                                    recipients = EmailRecipients_1.filter(function (item, pos) {
                                        return EmailRecipients_1.indexOf(item) == pos;
                                    });
                                    return [4 /*yield*/, teamsModel_1.TeamsModel.getTeamsAgainstAgent(ticket.nsp, ticket.assigned_to)];
                                case 19:
                                    teams = _b.sent();
                                    teams.forEach(function (team) { return __awaiter(void 0, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'newTicket', nsp: data_17.nsp, roomName: [team], data: { ticket: ticket, ignoreAdmin: false } })];
                                                case 1:
                                                    _a.sent();
                                                    return [2 /*return*/];
                                            }
                                        });
                                    }); });
                                    _b.label = 20;
                                case 20: return [4 /*yield*/, agentModel_1.Agents.GetEmailNotificationSettings(data_17.nsp, data_17.email)];
                                case 21:
                                    origin = _b.sent();
                                    if (!(origin && origin.length && origin[0].settings.emailNotifications.assignToAgent)) return [3 /*break*/, 23];
                                    recipients_2 = Array();
                                    recipients_2.push(ticket.assigned_to);
                                    if (ticket.watchers && ticket.watchers.length) {
                                        recipients_2 = recipients_2.concat(ticket.watchers);
                                        recipients_2 = recipients_2.filter(function (item, pos) {
                                            if (recipients_2 && recipients_2.length)
                                                return recipients_2.indexOf(item) == pos;
                                        });
                                    }
                                    msg = '<span><b>ID: </b>' + ticket._id + '<br>'
                                        + '<span><b>Assigned by: </b>' + data_17.email + '<br>'
                                        + '<span><b>Link: </b> https://app.beelinks.solutions/tickets/ticket-view/' + ticket._id + '<br>';
                                    if (!(recipients_2 && recipients_2.length)) return [3 /*break*/, 23];
                                    return [4 /*yield*/, emailService_1.EmailService.NotifyAgentForTicket({
                                            ticket: ticket,
                                            subject: ticket.subject,
                                            nsp: data_17.nsp.substring(1),
                                            to: recipients_2,
                                            msg: msg
                                        })];
                                case 22:
                                    response = _b.sent();
                                    if (response && !response.MessageId) {
                                        console.log('Email SEnding TO Agent When Assigning Failed');
                                    }
                                    _b.label = 23;
                                case 23: return [2 /*return*/];
                            }
                        });
                    }); });
                    res.send({ status: 'ok', ticket_data: result[0], ticketlog: ticketlog });
                }
                _a.label = 3;
            case 3: return [3 /*break*/, 5];
            case 4:
                err_23 = _a.sent();
                res.status(401).send('Invalid Request!');
                console.log(err_23);
                console.log('Error in adding ticket tag');
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
router.post('/assignAvailableAgent', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, fetchedTicket, updatedTicket, liveAgent, err_24;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 15, , 16]);
                if (!(!req.body.ticketID || !req.body.group)) return [3 /*break*/, 1];
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 14];
            case 1:
                res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
                res.header('Expires', '-1');
                res.header('Pragma', 'no-cache');
                data = req.body;
                return [4 /*yield*/, ticketsModel_1.Tickets.getTicketById(data.ticketID)];
            case 2:
                fetchedTicket = _a.sent();
                if (!(fetchedTicket && fetchedTicket.length)) return [3 /*break*/, 13];
                return [4 /*yield*/, ticketsModel_1.Tickets.FindBestAvailableAgentTicketInGroup(fetchedTicket[0].group, fetchedTicket[0])];
            case 3:
                updatedTicket = _a.sent();
                if (!updatedTicket) return [3 /*break*/, 11];
                return [4 /*yield*/, ticketsModel_1.Tickets.UpdateTicketObj(updatedTicket)];
            case 4:
                _a.sent();
                res.send({ status: 'ok', ticket: updatedTicket });
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: updatedTicket.nsp, roomName: ['ticketAdmin'], data: { tid: updatedTicket._id, ticket: updatedTicket } })];
            case 5:
                _a.sent();
                if (!updatedTicket.group) return [3 /*break*/, 7];
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: updatedTicket.nsp, roomName: [updatedTicket.group], data: { tid: updatedTicket._id, ticket: updatedTicket } })];
            case 6:
                _a.sent();
                _a.label = 7;
            case 7:
                if (!updatedTicket.assigned_to) return [3 /*break*/, 10];
                return [4 /*yield*/, sessionsManager_1.SessionManager.getAgentByEmail(updatedTicket.nsp, updatedTicket.assigned_to)];
            case 8:
                liveAgent = _a.sent();
                if (!(liveAgent && liveAgent.permissions.tickets.canView == 'assignedOnly')) return [3 /*break*/, 10];
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'newTicket', nsp: updatedTicket.nsp, roomName: [liveAgent._id], data: { ticket: updatedTicket, ignoreAdmin: false } })];
            case 9:
                _a.sent();
                _a.label = 10;
            case 10: return [3 /*break*/, 12];
            case 11:
                res.send({ status: 'error' });
                _a.label = 12;
            case 12: return [3 /*break*/, 14];
            case 13:
                res.send({ status: 'error' });
                _a.label = 14;
            case 14: return [3 /*break*/, 16];
            case 15:
                err_24 = _a.sent();
                res.status(401).send('Invalid Request!');
                console.log(err_24);
                console.log('Error in adding ticket tag');
                return [3 /*break*/, 16];
            case 16: return [2 /*return*/];
        }
    });
}); });
router.post('/applyRulesets', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, ticket, previousGroup, previousAgent, updatedTicket, liveAgent, err_25;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 15, , 16]);
                if (!!req.body.ticketID) return [3 /*break*/, 1];
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 14];
            case 1:
                res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
                res.header('Expires', '-1');
                res.header('Pragma', 'no-cache');
                data = req.body;
                return [4 /*yield*/, ticketsModel_1.Tickets.getTicketById(data.ticketID)];
            case 2:
                ticket = _a.sent();
                if (!(ticket && ticket.length)) return [3 /*break*/, 13];
                previousGroup = (ticket[0].group) ? ticket[0].group : '';
                previousAgent = (ticket[0].assigned_to) ? ticket[0].assigned_to : '';
                return [4 /*yield*/, RuleSetExecutor_1.RuleSetDescriptor(ticket[0])];
            case 3:
                updatedTicket = _a.sent();
                if (updatedTicket.assigned_to) {
                    ticket.assignmentList = [
                        {
                            assigned_to: ticket.assigned_to,
                            assigned_time: ticket.first_assigned_time,
                            read_date: ''
                        }
                    ];
                }
                return [4 /*yield*/, ticketsModel_1.Tickets.UpdateTicketObj(updatedTicket)];
            case 4:
                _a.sent();
                res.send({ status: 'ok' });
                if (!previousGroup) return [3 /*break*/, 9];
                console.log('Remove ticket from previous group: ' + previousGroup);
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'removeTicket', nsp: updatedTicket.nsp, roomName: [previousGroup], data: { tid: updatedTicket._id, ticket: updatedTicket, email: updatedTicket.assigned_to } })];
            case 5:
                _a.sent();
                console.log('Emit ticket to new group: ' + updatedTicket.group);
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicket', nsp: updatedTicket.nsp, roomName: ['ticketAdmin'], data: { tid: updatedTicket._id, ticket: updatedTicket, email: updatedTicket.assigned_to } })];
            case 6:
                _a.sent();
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'newTicket', nsp: updatedTicket.nsp, roomName: [updatedTicket.group], data: { ticket: updatedTicket, ignoreAdmin: false } })];
            case 7:
                _a.sent();
                console.log('Update Ticket: ' + updatedTicket.nsp + ' ' + updatedTicket.group);
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicket', nsp: updatedTicket.nsp, roomName: [updatedTicket.group], data: { tid: updatedTicket._id, ticket: updatedTicket } })];
            case 8:
                _a.sent();
                _a.label = 9;
            case 9:
                if (!updatedTicket.assigned_to) return [3 /*break*/, 12];
                return [4 /*yield*/, sessionsManager_1.SessionManager.getAgentByEmail(updatedTicket.nsp, updatedTicket.assigned_to)];
            case 10:
                liveAgent = _a.sent();
                if (!(liveAgent && liveAgent.permissions.tickets.canView == 'assignedOnly')) return [3 /*break*/, 12];
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'newTicket', nsp: updatedTicket.nsp, roomName: [liveAgent._id], data: { ticket: updatedTicket, ignoreAdmin: false } })];
            case 11:
                _a.sent();
                _a.label = 12;
            case 12: return [3 /*break*/, 14];
            case 13:
                res.send({ status: 'error' });
                _a.label = 14;
            case 14: return [3 /*break*/, 16];
            case 15:
                err_25 = _a.sent();
                res.status(401).send('Invalid Request!');
                console.log(err_25);
                console.log('Error in adding ticket tag');
                return [3 /*break*/, 16];
            case 16: return [2 /*return*/];
        }
    });
}); });
/* #endregion */
/* #region  Ticket Dynamic Property */
router.post('/updateDynamicProperty', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var ticketlog, data_18, result, assigendTo, watchers, val_8, err_26;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 12, , 13]);
                ticketlog = void 0;
                data_18 = req.body;
                if (data_18.assignment != '') {
                    ticketlog = ticketEnums_1.ComposedTicketENUM(ticketEnums_1.TicketLogMessages.UPDATE_DYNAMIC_FIELD_ICONN, { value: data_18.value, by: data_18.email, extraPara: data_18.name, ByextraOptions: data_18.assignment });
                }
                else {
                    ticketlog = ticketEnums_1.ComposedTicketENUM(ticketEnums_1.TicketLogMessages.UPDATE_DYNAMIC_FIELD, { value: data_18.value, by: data_18.email, extraPara: data_18.name });
                }
                return [4 /*yield*/, ticketsModel_1.Tickets.UpdateDynamicProperty(data_18.tid, data_18.name, data_18.value, ticketlog)];
            case 1:
                result = _a.sent();
                if (!(result && result.value)) return [3 /*break*/, 10];
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data_18.nsp, roomName: ['ticketAdmin'], data: { tid: result.value._id, ticket: result.value } })];
            case 2:
                _a.sent();
                if (!result.value.group) return [3 /*break*/, 4];
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data_18.nsp, roomName: [result.value.group], data: { tid: result.value._id, ticket: result.value } })];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4:
                if (!result.value.assigned_to) return [3 /*break*/, 7];
                return [4 /*yield*/, sessionsManager_1.SessionManager.getAgentByEmail(data_18.nsp, result.value.assigned_to)];
            case 5:
                assigendTo = _a.sent();
                if (!(assigendTo && assigendTo.permissions.tickets.canView != 'all')) return [3 /*break*/, 7];
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data_18.nsp, roomName: [assigendTo._id], data: { tid: result.value._id, ticket: result.value } })];
            case 6:
                _a.sent();
                _a.label = 7;
            case 7:
                if (!result.value.watchers) return [3 /*break*/, 9];
                return [4 /*yield*/, sessionsManager_1.SessionManager.getOnlineWatchers(data_18.nsp, result.value.watchers)];
            case 8:
                watchers = _a.sent();
                if (watchers && watchers.length) {
                    val_8 = result.value;
                    if (val_8.assigned_to)
                        watchers = watchers.filter(function (x) { return x != val_8.assigned_to; });
                    watchers.map(function (watcher) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data_18.nsp, roomName: [watcher._id], data: { tid: val_8._id, ticket: val_8 } })];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                }
                _a.label = 9;
            case 9:
                res.send({ status: 'ok', result: result.value, ticketlog: ticketlog });
                return [3 /*break*/, 11];
            case 10:
                res.send({ status: 'error' });
                _a.label = 11;
            case 11: return [3 /*break*/, 13];
            case 12:
                err_26 = _a.sent();
                console.log(err_26);
                console.log('Error in changing dynamic property');
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 13];
            case 13: return [2 /*return*/];
        }
    });
}); });
/* #endregion */
/* #region  Ticket Update viewState */
router.post('/updateViewState', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data_19, ticketlog, results, err_27;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                data_19 = req.body;
                ticketlog = ticketEnums_1.ComposedTicketENUM(ticketEnums_1.TicketLogMessages.UPDATE_VIEW_STATE, { value: data_19.viewState, by: data_19.email });
                return [4 /*yield*/, ticketsModel_1.Tickets.UpdateViewState(data_19.tids, data_19.nsp, data_19.viewState, ticketlog)];
            case 1:
                results = _a.sent();
                if (results && results.length) {
                    res.send({ status: 'ok' });
                    results.map(function (result) { return __awaiter(void 0, void 0, void 0, function () {
                        var assignedTo, watchers;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data_19.nsp, roomName: ['ticketAdmin'], data: { tid: result._id, ticket: result } })];
                                case 1:
                                    _a.sent();
                                    if (!result.group) return [3 /*break*/, 3];
                                    return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data_19.nsp, roomName: [result.group], data: { tid: result._id, ticket: result } })];
                                case 2:
                                    _a.sent();
                                    _a.label = 3;
                                case 3:
                                    if (!result.assigned_to) return [3 /*break*/, 6];
                                    return [4 /*yield*/, sessionsManager_1.SessionManager.getAgentByEmail(data_19.nsp, result.assigned_to)];
                                case 4:
                                    assignedTo = _a.sent();
                                    if (!(assignedTo && assignedTo.permissions.tickets.canView == 'assignedOnly')) return [3 /*break*/, 6];
                                    return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data_19.nsp, roomName: [assignedTo._id], data: { tid: result._id, ticket: result } })];
                                case 5:
                                    _a.sent();
                                    _a.label = 6;
                                case 6:
                                    if (!result.watchers) return [3 /*break*/, 8];
                                    return [4 /*yield*/, sessionsManager_1.SessionManager.getOnlineWatchers(data_19.nsp, result.watchers)];
                                case 7:
                                    watchers = _a.sent();
                                    if (watchers && watchers.length) {
                                        if (result.assigned_to)
                                            watchers = watchers.filter(function (x) { return x != result.assigned_to; });
                                        watchers.map(function (watcher) { return __awaiter(void 0, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0: return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data_19.nsp, roomName: [watcher._id], data: { tid: result._id, ticket: result } })];
                                                    case 1:
                                                        _a.sent();
                                                        return [2 /*return*/];
                                                }
                                            });
                                        }); });
                                    }
                                    _a.label = 8;
                                case 8: return [2 /*return*/];
                            }
                        });
                    }); });
                }
                else {
                    res.send({ status: 'error' });
                }
                return [3 /*break*/, 3];
            case 2:
                err_27 = _a.sent();
                console.log(err_27);
                console.log('Error in update ViewState');
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/updateFirstReadDate', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, ticketlog, results, err_28;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                data = req.body;
                ticketlog = ticketEnums_1.ComposedTicketENUM("Ticket First Read By", { value: data.email, by: "System" });
                return [4 /*yield*/, ticketsModel_1.Tickets.UpdateFirstReadDate(data.tids, data.nsp, ticketlog)];
            case 1:
                results = _a.sent();
                if (results && results.result.ok) {
                    res.send({ status: 'ok' });
                }
                else {
                    res.send({ status: 'error' });
                }
                return [3 /*break*/, 3];
            case 2:
                err_28 = _a.sent();
                console.log(err_28);
                console.log('Error in update ViewState');
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/* #endregion */
/* #region  Ticket Scenario */
router.post('/executeScenario', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data_20, $update_1, $renUpdate, $setObj_1, newAgent_1, $pushObj_1, $renameObj_1, session_1, origin_1, results, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                data_20 = req.body;
                $update_1 = {};
                $renUpdate = {};
                $setObj_1 = {};
                $pushObj_1 = {
                    ticketlog: ticketEnums_1.ComposedTicketENUM(ticketEnums_1.TicketLogMessages.EXECUTE_SCENARIO, { value: '', by: data_20.email, extraPara: data_20.scenario.scenarioTitle })
                };
                $renameObj_1 = {};
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetSessionByEmailFromDatabase(data_20.email, data_20.nsp)];
            case 1:
                session_1 = _a.sent();
                return [4 /*yield*/, agentModel_1.Agents.GetEmailNotificationSettings(data_20.nsp, data_20.email)];
            case 2:
                origin_1 = _a.sent();
                data_20.scenario.actions.map(function (action) { return __awaiter(void 0, void 0, void 0, function () {
                    var snoozeObj;
                    return __generator(this, function (_a) {
                        switch (action.scenarioName) {
                            case 'agentAssign':
                                $pushObj_1['ticketlog'].status += 'Scenario: ' + action.scenarioName.toUpperCase() + ' with value: <b> ' + action.scenarioValue + '</b> <br>,';
                                if (session_1 && !session_1.permissions.tickets.canAssignAgent) {
                                    $pushObj_1['ticketlog'].status += 'Failed to perform operation : Agent assignment <br> State is closed, Cannot assign agent to closed ticket <br>';
                                }
                                else if ($setObj_1 && $setObj_1['state'] == 'CLOSED') {
                                    $pushObj_1['ticketlog'].status += 'Failed to perform operation : Agent assignment <br> State is closed, Cannot assign agent to closed ticket <br>';
                                }
                                else {
                                    $setObj_1['assigned_to'] = action.scenarioValue;
                                    Object.assign($renameObj_1, { 'assigned_to': "previousAgent" });
                                }
                                break;
                            case 'groupAssign':
                                $pushObj_1['ticketlog'].status += 'Scenario: ' + action.scenarioName.toUpperCase() + ' with value: <b>' + action.scenarioValue + '</b> <br>';
                                if (session_1 && !session_1.permissions.tickets.canAssignGroup) {
                                    $pushObj_1['ticketlog'].status += 'Failed to perform operation : Group assignment <br> Not have permission to assign group <br>';
                                }
                                else {
                                    $setObj_1['group'] = action.scenarioValue;
                                    Object.assign($renameObj_1, { 'group': "previousGroup" });
                                }
                                break;
                            case 'viewStateAssign':
                                $pushObj_1['ticketlog'].status += 'Scenario: ' + action.scenarioName.toUpperCase() + ' with value: <b> ' + action.scenarioValue + '</b> <br>';
                                $setObj_1['viewState'] = action.scenarioValue;
                                break;
                            case 'priorityAssign':
                                $pushObj_1['ticketlog'].status += 'Scenario: ' + action.scenarioName.toUpperCase() + ' with value: <b> ' + action.scenarioValue + '</b> <br>,';
                                if (session_1 && !session_1.permissions.tickets.canSetPriority) {
                                    $pushObj_1['ticketlog'].status += 'Failed to perform operation : Priority assignment <br> Not have permission to change priority <br>';
                                }
                                else {
                                    $setObj_1['priority'] = action.scenarioValue;
                                }
                                break;
                            case 'stateAssign':
                                $pushObj_1['ticketlog'].status += 'Scenario: ' + action.scenarioName.toUpperCase() + ' with value: <b> ' + action.scenarioValue + '</b> <br>,';
                                if (session_1 && !session_1.permissions.tickets.canChangeState) {
                                    $pushObj_1['ticketlog'].status += 'Failed to perform operation : State assignment <br> Not have permission to change state <br>';
                                }
                                else {
                                    $setObj_1['state'] = action.scenarioValue;
                                }
                                break;
                            case 'snoozeAssign':
                                $pushObj_1['ticketlog'].status += 'Scenario: ' + action.scenarioName.toUpperCase() + ' with value: <b> ' + action.scenarioValue + '</b> <br>,';
                                if (session_1 && !session_1.permissions.tickets.canSnooze) {
                                    $pushObj_1['ticketlog'].status += 'Failed to perform operation : Snooze assignment <br> Not have permission to snooze ticket <br>';
                                }
                                else {
                                    if (action.scenarioValue && !isNaN(Date.parse(action.scenarioValue))) {
                                        snoozeObj = { snooze_time: new Date(action.scenarioValue).toISOString(), email: data_20.email };
                                        $setObj_1['snoozes'] = snoozeObj;
                                    }
                                }
                                break;
                            case 'noteAssign':
                                $pushObj_1['ticketlog'].status += 'Scenario: ' + action.scenarioName.toUpperCase() + ' with value: <b> ' + action.scenarioValue + '</b> <br>,';
                                if (session_1 && !session_1.permissions.tickets.canAddNote) {
                                    $pushObj_1['ticketlog'].status += 'Failed to perform operation : Note addition <br> Not have permission to add Note <br>';
                                }
                                else {
                                    $pushObj_1['ticketNotes'] = { ticketNote: action.scenarioValue, added_by: data_20.email, added_at: new Date().toISOString(), id: new mongodb_1.ObjectID() };
                                }
                                break;
                            case 'tagAssign':
                                $pushObj_1['ticketlog'].status += 'Scenario: ' + action.scenarioName.toUpperCase() + ' with value: <b> ' + action.scenarioValue + '</b> <br>,';
                                if (session_1 && !session_1.permissions.tickets.canAddTag) {
                                    $pushObj_1['ticketlog'].status += 'Failed to perform operation : Tag addition <br> Not have permission to add tag <br>';
                                }
                                data_20.tickets.map(function (ticket) {
                                    if (ticket.tags && ticket.tags.length) {
                                        ticket.tags.map(function (tag) {
                                            if (tag.includes(action.scenarioValue)) {
                                                action.scenarioValue = action.scenarioValue.filter(function (data) { return data != tag; });
                                                $pushObj_1['tags'] = action.scenarioValue;
                                            }
                                            else {
                                                $pushObj_1['tags'] = action.scenarioValue;
                                            }
                                        });
                                    }
                                    else {
                                        $pushObj_1['tags'] = action.scenarioValue;
                                    }
                                });
                                break;
                            case 'taskAssign':
                                $pushObj_1['ticketlog'].status += 'Scenario: ' + action.scenarioName.toUpperCase() + ' with value: <b> ' + action.scenarioValue + '</b> <br>,';
                                if (session_1 && !session_1.permissions.tickets.canAddTask) {
                                    $pushObj_1['ticketlog'].status += 'Failed to perform operation : Task addition <br> Not have permission to add task <br>';
                                }
                                else {
                                    $pushObj_1['todo'] = { todo: action.scenarioValue, agent: data_20.email, completed: false, datetime: new Date().toISOString(), id: new mongodb_1.ObjectID() };
                                }
                                break;
                            case 'watcherAssign':
                                $pushObj_1['ticketlog'].status += 'Scenario: ' + action.scenarioName.toUpperCase() + ' with value: <b> ' + action.scenarioValue + '</b> <br>';
                                data_20.tickets.map(function (ticket) {
                                    if (ticket.watchers && ticket.watchers.length) {
                                        ticket.watchers.map(function (watcher) {
                                            action.scenarioValue = action.scenarioValue.filter(function (data) { return data != watcher; });
                                            action.scenarioValue = action.scenarioValue.filter(function (data) { return data != ticket.assigned_to; });
                                        });
                                        $pushObj_1['watchers'] = action.scenarioValue;
                                    }
                                    if (action.scenarioValue && action.scenarioValue.length) {
                                        var msg = 'Hello, Agent '
                                            + '<span>You have been added as a watcher by:  ' + data_20.email + '<br>'
                                            + '<span><b>Ticket Link: </b> https://app.beelinks.solutions/tickets/ticket-view/' + ticket._id + '<br>';
                                        var obj = {
                                            action: 'sendNoReplyEmail',
                                            to: action.scenarioValue,
                                            subject: 'Added as watcher to Ticket #' + ticket._id,
                                            message: msg,
                                            html: msg,
                                            type: 'newTicket'
                                        };
                                        var response = emailService_1.EmailService.SendNoReplyEmail(obj, false);
                                        data_20.agents.map(function (result) { return __awaiter(void 0, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0: return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'newTicket', nsp: data_20.nsp, roomName: [result._id], data: { ticket: ticket, ignoreAdmin: false } })];
                                                    case 1:
                                                        _a.sent();
                                                        return [2 /*return*/];
                                                }
                                            });
                                        }); });
                                        $pushObj_1['watchers'] = action.scenarioValue;
                                    }
                                });
                                break;
                        }
                        return [2 /*return*/];
                    });
                }); });
                $setObj_1['lasttouchedTime'] = new Date().toISOString();
                $setObj_1['lastScenarioExecuted'] = data_20.scenario.scenarioTitle;
                if (Object.keys($setObj_1).length)
                    Object.assign($update_1, { $set: $setObj_1 });
                if (Object.keys($pushObj_1).length)
                    Object.assign($update_1, { $push: $pushObj_1 });
                if (Object.keys($renameObj_1).length)
                    Object.assign($renUpdate, { $rename: $renameObj_1 });
                return [4 /*yield*/, ticketsModel_1.Tickets.ExecuteScenarios(data_20.ids, data_20.nsp, $update_1, $renameObj_1)];
            case 3:
                results = _a.sent();
                //NOTIFICATIONS && EMITS:
                if (results && results.length) {
                    res.send({ status: 'ok', updatedProperties: $update_1 });
                    results.map(function (result) { return __awaiter(void 0, void 0, void 0, function () {
                        var previousAgent, _a, teamsOfPreviousAgent, message_3, survey_2, getMessageById, solvedDatetime_1, ticketDatetime, diffForSolved_1, currentDatetime_1, policies, message_4, survey_3, getMessageById, watchers, EmailRecipients, res_2, teams, msg, response, recipients_3, msg, obj, response;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    if (!(result.previousAgent && $update_1['$set'] && $update_1['$set'].assigned_to)) return [3 /*break*/, 10];
                                    return [4 /*yield*/, sessionsManager_1.SessionManager.getAgentByEmail(data_20.nsp, result.previousAgent)];
                                case 1:
                                    previousAgent = _b.sent();
                                    if (!previousAgent) return [3 /*break*/, 8];
                                    _a = previousAgent.permissions.tickets.canView;
                                    switch (_a) {
                                        case 'assignedOnly': return [3 /*break*/, 2];
                                        case 'group': return [3 /*break*/, 4];
                                    }
                                    return [3 /*break*/, 7];
                                case 2: return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'removeTicket', nsp: data_20.nsp, roomName: [previousAgent._id], data: { tid: result._id, ticket: result } })];
                                case 3:
                                    _b.sent();
                                    return [3 /*break*/, 8];
                                case 4:
                                    if (!((result.group && !previousAgent.groups.includes(result.group)) || !result.group)) return [3 /*break*/, 6];
                                    return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'removeTicket', nsp: data_20.nsp, roomName: [previousAgent._id], data: { tid: result._id, ticket: result } })];
                                case 5:
                                    _b.sent();
                                    _b.label = 6;
                                case 6: return [3 /*break*/, 8];
                                case 7: return [3 /*break*/, 8];
                                case 8: return [4 /*yield*/, teamsModel_1.TeamsModel.getTeamsAgainstAgent(result.nsp, result.previousAgent)];
                                case 9:
                                    teamsOfPreviousAgent = _b.sent();
                                    teamsOfPreviousAgent.forEach(function (team) { return __awaiter(void 0, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'removeTicket', nsp: data_20.nsp, roomName: [team], data: { tid: result._id, ticket: result } })];
                                                case 1:
                                                    _a.sent();
                                                    return [2 /*return*/];
                                            }
                                        });
                                    }); });
                                    _b.label = 10;
                                case 10:
                                    if (!(result.previousGroup && $update_1['$set'] && $update_1['$set'].group)) return [3 /*break*/, 14];
                                    return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'removeTicket', nsp: data_20.nsp, roomName: [result.previousGroup], data: { tid: result._id, ticket: result, email: result.assigned_to } })];
                                case 11:
                                    _b.sent();
                                    return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'newTicket', nsp: data_20.nsp, roomName: [result.group], data: { ticket: result, ignoreAdmin: false } })];
                                case 12:
                                    _b.sent();
                                    return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicket', nsp: data_20.nsp, roomName: [result.group], data: { tid: result._id, ticket: result } })];
                                case 13:
                                    _b.sent();
                                    _b.label = 14;
                                case 14:
                                    if (!(result.state == 'SOLVED' && $update_1['$set'] && $update_1['$set'].state)) return [3 /*break*/, 19];
                                    message_3 = 'This is to inform you that Ticket is SOLVED sucessfully, if you find some ambiguity in SOLVED ticket, reply back to this thread. Kindly took out some moment to fill survey form following';
                                    return [4 /*yield*/, FeedBackSurveyModel_1.FeedBackSurveyModel.getActivatedSurvey()];
                                case 15:
                                    survey_2 = _b.sent();
                                    if (!(survey_2 && survey_2.length && survey_2[0].sendWhen == 'solved')) return [3 /*break*/, 17];
                                    return [4 /*yield*/, ticketsModel_1.Tickets.getMessagesByTicketId(data_20.tids)];
                                case 16:
                                    getMessageById = _b.sent();
                                    if (getMessageById && getMessageById.length) {
                                        getMessageById.map(function (data) {
                                            emailService_1.EmailService.SendEmail({
                                                action: 'StateChangedFeedbackSurvey',
                                                survey: survey_2 && survey_2.length ? survey_2[0] : undefined,
                                                ticket: result,
                                                reply: data.to[0],
                                                message: message_3
                                            }, 5, true);
                                        });
                                    }
                                    _b.label = 17;
                                case 17:
                                    solvedDatetime_1 = ((new Date(result.solved_date).getTime()) * 60000);
                                    ticketDatetime = ((new Date(result.datetime).getTime()) * 60000);
                                    diffForSolved_1 = solvedDatetime_1 - ticketDatetime;
                                    currentDatetime_1 = ((new Date().getTime()) * 60000);
                                    return [4 /*yield*/, SLAPolicyModel_1.SLAPolicyModel.getActivatedPolicies()];
                                case 18:
                                    policies = _b.sent();
                                    if (policies && policies.length) {
                                        //can be multiple policies:
                                        policies.map(function (active) { return __awaiter(void 0, void 0, void 0, function () {
                                            var requiredPriorityObj;
                                            return __generator(this, function (_a) {
                                                requiredPriorityObj = active.policyTarget.filter(function (obj) { return obj.priority == result.priority; });
                                                //VIOLATION OF RESOLUTION
                                                if (!result.slaPolicy.violationResolution && active.violationResolution && active.violationResolution.length && active.violationResponse[0].time && diffForSolved_1 && (diffForSolved_1 > requiredPriorityObj[0].timeResolved)) { //base case..
                                                    if ((solvedDatetime_1 + active.violationResolution[0].time) > currentDatetime_1) {
                                                        active.violationResolution.map(function (violate, ind) { return __awaiter(void 0, void 0, void 0, function () {
                                                            var ticketLog, res_3, arr_1, obj, response;
                                                            return __generator(this, function (_a) {
                                                                switch (_a.label) {
                                                                    case 0:
                                                                        if (!(currentDatetime_1 - (solvedDatetime_1 + violate.time) > 0)) return [3 /*break*/, 2];
                                                                        ticketLog = {
                                                                            time_stamp: new Date().toISOString(),
                                                                            status: "violation of resolution step #" + ind + 1,
                                                                            title: "Escalation email for resolution sent as per policy",
                                                                            updated_by: 'Beelinks',
                                                                            user_type: 'Beelinks Scheduler'
                                                                        };
                                                                        result.slaPolicy.violationResolution = true;
                                                                        return [4 /*yield*/, ticketsModel_1.Tickets.SetViolationTime(result._id, result.nsp, ticketLog)];
                                                                    case 1:
                                                                        res_3 = _a.sent();
                                                                        if (res_3 && (!res_3.ok || !res_3.value)) {
                                                                            // console.log('unsetting and pushing log failed of ' + solve._id);
                                                                        }
                                                                        if (requiredPriorityObj[0].emailActivationEscalation) {
                                                                            arr_1 = [];
                                                                            violate.notifyTo.map(function (email) {
                                                                                if (email == 'Assigned Agent') {
                                                                                    arr_1.push(result.assigned_to);
                                                                                }
                                                                                else {
                                                                                    arr_1.push(email);
                                                                                }
                                                                            });
                                                                            obj = {
                                                                                action: 'sendNoReplyEmail',
                                                                                to: arr_1,
                                                                                subject: 'Escalation Email for Resolution of Ticket :  ' + result._id + ' having priority ' + result.priority,
                                                                                message: "Hello Agent,\n                                                                    <br>\n                                                                    Just wanted to let you know that your time to resolve the ticket " + result._id + " is escalated.\n                                                                    <br>\n                                                                    Ticket Subject : " + result.subject + "\n                                                                    <br>\n                                                                    You can check the activity on https://app.beelinks.solutions/tickets\n                                                                    <br>\n                                                                    Regards,\n                                                                    Beelinks Team",
                                                                                html: "Hello Agent,\n                                                                    <br>\n                                                                    Just wanted to let you know that your time to resolve the ticket " + result._id + " is escalated.\n                                                                    <br>\n                                                                    Ticket Subject : " + result.subject + "\n                                                                    <br>\n                                                                    You can check the activity on <a href=\"https://app.beelinks.solutions/tickets/ticket-view/" + result._id + "\">Beelinks Ticket</a>\n                                                                    <br>\n                                                                    Regards,\n                                                                    <br>\n                                                                    Beelinks Team\n                                                                    "
                                                                            };
                                                                            response = emailService_1.EmailService.SendNoReplyEmail(obj, false);
                                                                            if (response) {
                                                                                console.log("violation resolution email sent");
                                                                            }
                                                                            else {
                                                                                console.log('Email Delivery Failed For escalation');
                                                                            }
                                                                        }
                                                                        _a.label = 2;
                                                                    case 2: return [2 /*return*/];
                                                                }
                                                            });
                                                        }); });
                                                    }
                                                }
                                                else {
                                                    console.log("not send email, resolution not violated.");
                                                    return [2 /*return*/];
                                                }
                                                return [2 /*return*/];
                                            });
                                        }); });
                                    }
                                    else {
                                        console.log("no activated policies!");
                                        return [2 /*return*/];
                                    }
                                    _b.label = 19;
                                case 19:
                                    if (!(result.state == 'CLOSED' && $update_1['$set'] && $update_1['$set'].state)) return [3 /*break*/, 22];
                                    message_4 = 'This is to inform you that Ticket is CLOSED sucessfully, if you find some ambiguity in CLOSED ticket, reply back to this thread. Kindly took out some moment to fill survey form following';
                                    return [4 /*yield*/, FeedBackSurveyModel_1.FeedBackSurveyModel.getActivatedSurvey()];
                                case 20:
                                    survey_3 = _b.sent();
                                    if (!(survey_3 && survey_3.length && survey_3[0].sendWhen == 'closed')) return [3 /*break*/, 22];
                                    return [4 /*yield*/, ticketsModel_1.Tickets.getMessagesByTicketId(data_20.tids)];
                                case 21:
                                    getMessageById = _b.sent();
                                    if (getMessageById && getMessageById.length) {
                                        getMessageById.map(function (data) {
                                            emailService_1.EmailService.SendEmail({
                                                action: 'StateChangedFeedbackSurvey',
                                                survey: survey_3 && survey_3.length ? survey_3[0] : undefined,
                                                ticket: result,
                                                reply: data.to[0],
                                                message: message_4
                                            }, 5, true);
                                        });
                                    }
                                    _b.label = 22;
                                case 22: 
                                //if ticket is updated else leave it..
                                //emit to ticket admin
                                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicket', nsp: data_20.nsp, roomName: ['ticketAdmin'], data: { tid: result._id, ticket: result } })
                                    //emit to watchers
                                ];
                                case 23:
                                    //if ticket is updated else leave it..
                                    //emit to ticket admin
                                    _b.sent();
                                    if (!(result.watchers && result.watchers.length)) return [3 /*break*/, 25];
                                    return [4 /*yield*/, sessionsManager_1.SessionManager.getOnlineWatchers(data_20.nsp, result.watchers)];
                                case 24:
                                    watchers = _b.sent();
                                    if (watchers && watchers.length) {
                                        if (result.assigned_to)
                                            watchers = watchers.filter(function (data) { return data != result.assigned_to; });
                                        watchers.map(function (single) { return __awaiter(void 0, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0: return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicket', nsp: data_20.nsp, roomName: [single._id], data: { tid: result._id, ticket: result } })];
                                                    case 1:
                                                        _a.sent();
                                                        return [2 /*return*/];
                                                }
                                            });
                                        }); });
                                    }
                                    _b.label = 25;
                                case 25:
                                    if (!result.assigned_to) return [3 /*break*/, 28];
                                    return [4 /*yield*/, sessionsManager_1.SessionManager.getAgentByEmail(data_20.nsp, result.assigned_to)];
                                case 26:
                                    newAgent_1 = _b.sent();
                                    if (!newAgent_1) return [3 /*break*/, 28];
                                    if (!(newAgent_1.permissions.tickets.canView == 'assignedOnly')) return [3 /*break*/, 28];
                                    return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'newTicket', nsp: data_20.nsp, roomName: [newAgent_1._id], data: { ticket: result, ignoreAdmin: false } })];
                                case 27:
                                    _b.sent();
                                    _b.label = 28;
                                case 28:
                                    EmailRecipients = Array();
                                    if (!(result && result.assigned_to)) return [3 /*break*/, 32];
                                    return [4 /*yield*/, ticketsModel_1.Tickets.getWatchers(result._id, data_20.nsp)];
                                case 29:
                                    res_2 = _b.sent();
                                    if (res_2 && res_2.length) {
                                        EmailRecipients = EmailRecipients.concat(res_2[0].watchers);
                                    }
                                    if (result.assigned_to)
                                        EmailRecipients.push(result.assigned_to);
                                    EmailRecipients = EmailRecipients.filter(function (item, pos) {
                                        return EmailRecipients.indexOf(item) == pos;
                                    });
                                    return [4 /*yield*/, teamsModel_1.TeamsModel.getTeamsAgainstAgent(result.nsp, result.assigned_to)];
                                case 30:
                                    teams = _b.sent();
                                    teams.forEach(function (team) { return __awaiter(void 0, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'newTicket', nsp: data_20.nsp, roomName: [team], data: { ticket: result, ignoreAdmin: false } })];
                                                case 1:
                                                    _a.sent();
                                                    return [2 /*return*/];
                                            }
                                        });
                                    }); });
                                    if (!(origin_1 && origin_1.length && origin_1[0].settings.emailNotifications.assignToAgent && $update_1['$set'] && $update_1['$set'].assigned_to)) return [3 /*break*/, 32];
                                    msg = '<span><b>ID: </b>' + result._id + '<br>'
                                        + '<span><b>Assigned by: </b>' + data_20.email + '<br>'
                                        + '<span><b>Link: </b> https://app.beelinks.solutions/tickets/ticket-view/' + result._id + '<br>';
                                    return [4 /*yield*/, emailService_1.EmailService.NotifyAgentForTicket({
                                            ticket: result,
                                            subject: result.subject,
                                            nsp: data_20.nsp.substring(1),
                                            to: EmailRecipients,
                                            msg: msg
                                        })];
                                case 31:
                                    response = _b.sent();
                                    if (response && response.MessageId) {
                                        console.log('Email Sending TO Agent When Assigning Failed');
                                    }
                                    _b.label = 32;
                                case 32:
                                    if (!(origin_1 && origin_1.length && origin_1[0].settings.emailNotifications.noteAddTick && $update_1['$push'] && $update_1['$push'].ticketNotes)) return [3 /*break*/, 34];
                                    recipients_3 = [];
                                    if (result.assigned_to)
                                        recipients_3.push(result.assigned_to);
                                    if (result.watchers && result.watchers.length) {
                                        recipients_3 = recipients_3.concat(result.watchers);
                                        recipients_3 = recipients_3.filter(function (item, pos) {
                                            if (recipients_3 && recipients_3.length)
                                                return recipients_3.indexOf(item) == pos;
                                        });
                                    }
                                    msg = '<span><b>ID: </b>' + result._id + '<br>'
                                        + '<span><b>Note: </b> ' + result.ticketNote + '<br>'
                                        + '<span><b>Added by: </b> ' + data_20.email + '<br>'
                                        + '<span><b>Link: </b> https://app.beelinks.solutions/tickets/ticket-view/' + result._id + '<br>';
                                    obj = {
                                        action: 'sendNoReplyEmail',
                                        to: recipients_3,
                                        subject: 'New Note added to Ticket #' + result._id,
                                        message: msg,
                                        html: msg,
                                        type: 'newNote'
                                    };
                                    response = void 0;
                                    if (!(recipients_3 && recipients_3.length)) return [3 /*break*/, 34];
                                    return [4 /*yield*/, emailService_1.EmailService.SendNoReplyEmail(obj, false)];
                                case 33:
                                    response = _b.sent();
                                    _b.label = 34;
                                case 34: return [2 /*return*/];
                            }
                        });
                    }); });
                }
                else {
                    res.send({ status: 'error' });
                }
                return [3 /*break*/, 5];
            case 4:
                error_4 = _a.sent();
                console.log(error_4);
                console.log('Error in get executing scenario');
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// router.post('/revertScenario', async (req, res) => {
//     try {
//         let data = req.body;
//         let ticketlog = ComposedTicketENUM(TicketLogMessages.REVERT_SCENARIO, { value: '', by: data.email })
//         let reverted = await Tickets.RevertScenario(data.ids, data.nsp, ticketlog);
//         if (reverted && reverted.value) {
//             res.send({ status: 'ok', revertScenario: reverted.value, ticketlog: ticketlog });
//         } else {
//             res.send({ status: 'error', revertScenario: undefined });
//         }
//     }
//     catch (error) {
//         console.log(error);
//         console.log('error in revert scenario');
//     }
// });
/* #endregion */
/* #region  Ticket Reply */
router.post('/replyTicket', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data_21, sign, subjectForMerged, ticketsData, messageId, response, insertMessageForMerge_1, updatedTicket, assignedTo, res_4, watchers, activatedSurvey, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 28, , 29]);
                console.log('replyTicket');
                data_21 = req.body;
                return [4 /*yield*/, ticketsModel_1.Tickets.getActiveSignature(data_21.email)];
            case 1:
                sign = _a.sent();
                if (sign && sign.length) {
                    data_21.ticket.message = sign[0].header + '<br>' + data_21.ticket.message + '<br>' + sign[0].footer;
                }
                if (!(data_21.mergedTicketIds && data_21.mergedTicketIds.length)) return [3 /*break*/, 26];
                data_21.ticket.datetime = new Date().toISOString();
                subjectForMerged = data_21.ticket.subject.toString();
                delete data_21.ticket.subject;
                data_21.ticket._id = new mongodb_1.ObjectID();
                return [4 /*yield*/, ticketsModel_1.Tickets.getTicketsData(data_21.mergedTicketIds)];
            case 2:
                ticketsData = _a.sent();
                if (!(ticketsData && ticketsData.length)) return [3 /*break*/, 24];
                return [4 /*yield*/, ticketsModel_1.Tickets.GetMessageIdByTID(data_21.mergedTicketIds)];
            case 3:
                messageId = _a.sent();
                response = void 0;
                data_21.ticket.nsp = data_21.nsp;
                return [4 /*yield*/, ticketsModel_1.Tickets.InsertMessage(data_21.ticket, 'Agent')];
            case 4:
                insertMessageForMerge_1 = _a.sent();
                return [4 /*yield*/, ticketsModel_1.Tickets.UpdateTicketTouchedTime(data_21.mergedTicketIds[0], data_21.nsp)];
            case 5:
                updatedTicket = _a.sent();
                if (!(insertMessageForMerge_1.insertedCount && updatedTicket && updatedTicket.length)) return [3 /*break*/, 23];
                //Status SEnding
                res.send({ status: 'ok', ticket: data_21.ticket });
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'gotNewTicketMessage', nsp: data_21.nsp, roomName: ['ticketAdmin'], data: { ticket: insertMessageForMerge_1.ops[0], viewState: 'READ' } })];
            case 6:
                _a.sent();
                updatedTicket.map(function (ticket) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!ticket.group) return [3 /*break*/, 2];
                                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'gotNewTicketMessage', nsp: data_21.nsp, roomName: [ticket.group], data: { ticket: insertMessageForMerge_1.ops[0], viewState: 'READ' } })];
                            case 1:
                                _a.sent();
                                _a.label = 2;
                            case 2: return [2 /*return*/];
                        }
                    });
                }); });
                if (!(updatedTicket && updatedTicket.length && updatedTicket[0].assigned_to)) return [3 /*break*/, 9];
                return [4 /*yield*/, sessionsManager_1.SessionManager.getAgentByEmail(data_21.nsp, updatedTicket[0].assigned_to)];
            case 7:
                assignedTo = _a.sent();
                if (!(assignedTo && assignedTo.permissions.tickets.canView == 'assignedOnly')) return [3 /*break*/, 9];
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'gotNewTicketMessage', nsp: data_21.nsp, roomName: [assignedTo._id], data: { ticket: insertMessageForMerge_1.ops[0], viewState: 'READ' } })];
            case 8:
                _a.sent();
                _a.label = 9;
            case 9:
                if (!(updatedTicket && updatedTicket.length && updatedTicket[0].watchers)) return [3 /*break*/, 11];
                res_4 = updatedTicket[0];
                return [4 /*yield*/, sessionsManager_1.SessionManager.getOnlineWatchers(data_21.nsp, updatedTicket[0].watchers)];
            case 10:
                watchers = _a.sent();
                if (watchers && watchers.length) {
                    if (res_4.assigned_to)
                        watchers = watchers.filter(function (data) { return data != res_4.assigned_to; });
                    watchers.map(function (watcher) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'gotNewTicketMessage', nsp: data_21.nsp, roomName: [watcher._id], data: { ticket: insertMessageForMerge_1.ops[0], viewState: 'READ' } })];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                }
                _a.label = 11;
            case 11:
                if (!(insertMessageForMerge_1 && insertMessageForMerge_1.insertedCount)) return [3 /*break*/, 22];
                data_21.ticket.subject = subjectForMerged;
                if (!(data_21.ticket.from != constants_1.ticketEmail)) return [3 /*break*/, 19];
                return [4 /*yield*/, FeedBackSurveyModel_1.FeedBackSurveyModel.getActivatedSurvey()];
            case 12:
                activatedSurvey = _a.sent();
                if (!(activatedSurvey && activatedSurvey.length && activatedSurvey[0].sendWhen == "replies")) return [3 /*break*/, 14];
                return [4 /*yield*/, emailService_1.EmailService.SendEmail({
                        action: 'SendFeedbackSurveyEmail',
                        reply: data_21.ticket,
                        survey: activatedSurvey[0],
                        ticketsData: ticketsData,
                        nsp: data_21.nsp.substring(1),
                        inReplyTo: (messageId && messageId.length) ? messageId : undefined
                    }, 5, true)];
            case 13:
                // response = await EmailService.SendEmail({
                //     action: 'sendEmail',
                //     reply: data.ticket,
                //     ticketsData: ticketsData,
                //     nsp: data.nsp.substring(1),
                //     inReplyTo: (messageId && messageId.length) ? messageId : undefined
                // }, 5, true);
                response = _a.sent();
                return [3 /*break*/, 18];
            case 14:
                if (!(activatedSurvey && activatedSurvey.length && activatedSurvey[0].sendWhen == "manually_attached" && data_21.ticket.survey)) return [3 /*break*/, 16];
                return [4 /*yield*/, emailService_1.EmailService.SendEmail({
                        action: 'SendFeedbackSurveyEmail',
                        reply: data_21.ticket,
                        survey: activatedSurvey[0],
                        ticketsData: ticketsData,
                        nsp: data_21.nsp.substring(1),
                        inReplyTo: (messageId && messageId.length) ? messageId : undefined
                    }, 5, true)];
            case 15:
                response = _a.sent();
                return [3 /*break*/, 18];
            case 16: return [4 /*yield*/, emailService_1.EmailService.SendEmail({
                    action: 'sendEmail',
                    reply: data_21.ticket,
                    username: (data_21.username) ? data_21.username : '',
                    ticketsData: ticketsData,
                    nsp: data_21.nsp.substring(1),
                    inReplyTo: (messageId && messageId.length) ? messageId : undefined
                }, 5, true)];
            case 17:
                response = _a.sent();
                _a.label = 18;
            case 18: return [3 /*break*/, 21];
            case 19: return [4 /*yield*/, emailService_1.EmailService.SendSupportEmail({
                    action: 'sendSupportEmail',
                    reply: data_21.ticket,
                    ticketsData: ticketsData,
                    nsp: data_21.nsp.substring(1),
                    inReplyTo: (messageId && messageId.length) ? messageId : undefined
                }, 5, true)];
            case 20:
                //Status SENT
                response = _a.sent();
                _a.label = 21;
            case 21: return [3 /*break*/, 23];
            case 22:
                //Status Failed
                res.send({ status: 'error', ticket: data_21.ticket });
                _a.label = 23;
            case 23: return [3 /*break*/, 25];
            case 24:
                //Status failed
                res.send({ status: 'error', ticket: data_21.ticket });
                _a.label = 25;
            case 25: return [3 /*break*/, 27];
            case 26:
                //Status failed
                res.send({ status: 'error', ticket: data_21.ticket });
                _a.label = 27;
            case 27: return [3 /*break*/, 29];
            case 28:
                error_5 = _a.sent();
                console.log(error_5);
                console.log('error in Reply Ticket');
                res.send({ status: 'error' });
                return [3 /*break*/, 29];
            case 29: return [2 /*return*/];
        }
    });
}); });
/* #endregion */
/* #region  New Ticket Insertion */
router.post('/insertNewTicket', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data_22, sessionObj, origin, originNSP, randomColor, primaryEmail, ticket_1, insertedTicket_1, ticketId_1, arr, message, insertedMessage, watchers, EmailRecipients_2, res_5, recipients, msg, obj, response, groupAdmins_2, res_6, recipients, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 23, , 24]);
                data_22 = req.body;
                sessionObj = res.locals.sessionObj;
                return [4 /*yield*/, agentModel_1.Agents.GetEmailNotificationSettings(sessionObj.nsp, sessionObj.email)];
            case 1:
                origin = _a.sent();
                return [4 /*yield*/, companyModel_1.Company.GetEmailNotificationSettings(sessionObj.nsp)];
            case 2:
                originNSP = _a.sent();
                randomColor = constants_1.rand[Math.floor(Math.random() * constants_1.rand.length)];
                return [4 /*yield*/, ticketsModel_1.Tickets.GetPrimaryEmail(sessionObj.nsp)];
            case 3:
                primaryEmail = _a.sent();
                if (data_22.details.thread.cannedForm) {
                    data_22.details.thread.cannedForm.id = new mongodb_1.ObjectID(data_22.details.thread.cannedForm.id);
                }
                if (!(primaryEmail && primaryEmail.length)) return [3 /*break*/, 21];
                ticket_1 = {
                    type: 'email',
                    subject: data_22.details.thread.subject,
                    nsp: data_22.nsp,
                    priority: data_22.details.thread.priority,
                    state: data_22.details.thread.state,
                    datetime: new Date().toISOString(),
                    from: data_22.details.thread.visitor.email,
                    visitor: {
                        name: data_22.details.thread.visitor.name,
                        email: data_22.details.thread.visitor.email
                    },
                    lasttouchedTime: new Date().toISOString(),
                    viewState: 'UNREAD',
                    createdBy: 'Agent',
                    agentName: data_22.email,
                    ticketlog: [],
                    mergedTicketIds: [],
                    viewColor: randomColor,
                    group: data_22.details.thread.group ? data_22.details.thread.group : '',
                    assigned_to: data_22.details.thread.assigned_to ? data_22.details.thread.assigned_to : '',
                    tags: data_22.details.thread.tags ? data_22.details.thread.tags : [],
                    watchers: data_22.details.thread.watchers ? data_22.details.thread.watchers : [],
                    cannedForm: data_22.details.thread.cannedForm ? data_22.details.thread.cannedForm : undefined,
                    source: 'panel',
                    slaPolicy: {
                        reminderResolution: false,
                        reminderResponse: false,
                        violationResponse: false,
                        violationResolution: false
                    },
                    InternalSlaPolicy: {
                        reminder: false,
                        escalation: false
                    },
                    assignmentList: []
                };
                return [4 /*yield*/, RuleSetExecutor_1.RuleSetDescriptor(ticket_1)];
            case 4:
                //Ticket Automation Work
                ticket_1 = _a.sent();
                if (ticket_1.assigned_to) {
                    ticket_1.assignmentList = [
                        {
                            assigned_to: ticket_1.assigned_to,
                            assigned_time: ticket_1.first_assigned_time,
                            read_date: ''
                        }
                    ];
                }
                return [4 /*yield*/, ticketsModel_1.Tickets.CreateTicket(ticket_1)];
            case 5:
                insertedTicket_1 = _a.sent();
                if (insertedTicket_1 && insertedTicket_1.insertedCount) {
                    ticketId_1 = insertedTicket_1.insertedId;
                }
                if (!ticketId_1) return [3 /*break*/, 19];
                arr = [];
                arr.push(ticketId_1);
                message = {
                    datetime: new Date().toISOString(),
                    nsp: data_22.nsp,
                    senderType: 'Visitor',
                    message: data_22.details.message.body,
                    from: data_22.details.thread.visitor.email,
                    to: constants_1.ticketEmail,
                    replytoAddress: data_22.details.thread.visitor.email,
                    tid: [ticketId_1],
                    attachment: [],
                    viewColor: '',
                    form: (data_22.form) ? data_22.form : '',
                    submittedForm: (data_22.submittedForm) ? data_22.submittedForm : ''
                };
                return [4 /*yield*/, ticketsModel_1.Tickets.InsertMessage(JSON.parse(JSON.stringify(message)))];
            case 6:
                insertedMessage = _a.sent();
                if (!(insertedMessage && insertedMessage.insertedCount && insertedTicket_1 && insertedTicket_1.insertedCount)) return [3 /*break*/, 17];
                res.send({ status: 'ok', ticket: insertedTicket_1.ops[0] });
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'newTicket', nsp: data_22.nsp, roomName: ['ticketAdmin'], data: { ticket: insertedTicket_1.ops[0] } })];
            case 7:
                _a.sent();
                if (!ticket_1.group) return [3 /*break*/, 9];
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'newTicket', nsp: data_22.nsp, roomName: [ticket_1.group], data: { ticket: insertedTicket_1.ops[0] } })];
            case 8:
                _a.sent();
                _a.label = 9;
            case 9:
                if (!insertedTicket_1.ops[0].watchers) return [3 /*break*/, 11];
                return [4 /*yield*/, sessionsManager_1.SessionManager.getOnlineWatchers(data_22.nsp, insertedTicket_1.ops[0].watchers)];
            case 10:
                watchers = _a.sent();
                if (watchers && watchers.length) {
                    watchers.map(function (single) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'newTicket', nsp: data_22.nsp, roomName: [single._id], data: { ticket: insertedTicket_1 ? insertedTicket_1.ops[0] : undefined } })];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                }
                _a.label = 11;
            case 11:
                if (!insertedTicket_1.ops[0].assigned_to) return [3 /*break*/, 13];
                EmailRecipients_2 = Array();
                return [4 /*yield*/, ticketsModel_1.Tickets.getWatchers(insertedTicket_1.ops[0]._id, data_22.nsp)];
            case 12:
                res_5 = _a.sent();
                if (res_5 && res_5.length) {
                    EmailRecipients_2 = EmailRecipients_2.concat(res_5[0].watchers);
                }
                EmailRecipients_2.push(insertedTicket_1.ops[0].assigned_to);
                recipients = EmailRecipients_2.filter(function (item, pos) {
                    return EmailRecipients_2.indexOf(item) == pos;
                });
                // let onlineAgent = await SessionManager.getAgentByEmail(data.nsp, insertedTicket.ops[0].assigned_to);
                // if (onlineAgent && !onlineAgent.groups.includes(ticket.group)) {
                //     await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'newTicket', nsp: data.nsp, roomName: [onlineAgent._id], data: { ticket: insertedTicket.ops[0] } })
                // }
                if (origin && origin.length && origin[0].settings.emailNotifications.assignToAgent) {
                    msg = '<span><b>ID: </b>' + ticketId_1 + '<br>'
                        + '<span><b>Assigned by: </b> Automatic Assignment <br>'
                        + '<span><b>Link: </b> https://app.beelinks.solutions/tickets/ticket-view/' + ticketId_1 + '<br>';
                    obj = {
                        action: 'sendNoReplyEmail',
                        to: recipients,
                        subject: 'You have been assigned a new ticket #' + ticketId_1,
                        message: msg,
                        html: msg,
                        type: 'agentAssigned'
                    };
                    response = emailService_1.EmailService.SendNoReplyEmail(obj, false);
                }
                _a.label = 13;
            case 13:
                if (!insertedTicket_1.ops[0].group) return [3 /*break*/, 16];
                if (!(originNSP && originNSP.length && originNSP[0].settings.emailNotifications.tickets.assignToGroup)) return [3 /*break*/, 16];
                return [4 /*yield*/, TicketgroupModel_1.TicketGroupsModel.GetGroupAdmins(data_22.nsp, ticket_1.group)];
            case 14:
                groupAdmins_2 = _a.sent();
                if (!groupAdmins_2) return [3 /*break*/, 16];
                return [4 /*yield*/, ticketsModel_1.Tickets.getWatchers(insertedTicket_1.ops[0]._id, data_22.nsp)];
            case 15:
                res_6 = _a.sent();
                if (res_6 && res_6.length) {
                    groupAdmins_2 = groupAdmins_2.concat(res_6[0].watchers);
                }
                recipients = groupAdmins_2.filter(function (item, pos) {
                    if (groupAdmins_2 && groupAdmins_2.length)
                        return groupAdmins_2.indexOf(item) == pos;
                });
                recipients.forEach(function (admin) { return __awaiter(void 0, void 0, void 0, function () {
                    var msg, obj, response;
                    return __generator(this, function (_a) {
                        msg = '<span><b>ID: </b>' + ticketId_1 + '<br>'
                            + '<span><b>Group: </b> ' + ticket_1.group + '<br>'
                            + '<span><b>Assigned by: </b> Automatic Assignment <br>'
                            + '<span><b>Link: </b> https://app.beelinks.solutions/tickets/ticket-view/' + ticketId_1 + '<br>';
                        obj = {
                            action: 'sendNoReplyEmail',
                            to: admin,
                            subject: 'Group assigned to Ticket #' + ticketId_1,
                            message: msg,
                            html: msg,
                            type: 'newTicket'
                        };
                        response = emailService_1.EmailService.SendNoReplyEmail(obj, false);
                        return [2 /*return*/];
                    });
                }); });
                _a.label = 16;
            case 16: return [3 /*break*/, 18];
            case 17:
                res.send({ status: 'error', msg: 'Unable To Create Ticket' });
                _a.label = 18;
            case 18: return [3 /*break*/, 20];
            case 19:
                res.send({ status: 'error', msg: 'Unable To Create Ticket' });
                _a.label = 20;
            case 20: return [2 /*return*/];
            case 21:
                res.send({ status: 'error', msg: 'Unable To Create Ticket' });
                _a.label = 22;
            case 22: return [3 /*break*/, 24];
            case 23:
                error_6 = _a.sent();
                console.log(error_6);
                console.log('error in Creating New Ticket');
                res.send({ status: 'error', msg: error_6 });
                return [3 /*break*/, 24];
            case 24: return [2 /*return*/];
        }
    });
}); });
/* #endregion */
/* #region Customer Icon Registration */
router.post('/RegisterCustomer', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, customerData, registerCustomerDevelopment, registerCustomerStaging, registerCustomerProduction, response, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                if (req.headers.origin) {
                    res.header("Access-Control-Allow-Origin", req.headers.origin);
                    res.header("Access-Control-Allow-Headers", "content-type");
                    res.header('Access-Control-Allow-Methods', 'GET');
                    res.header('Access-Control-Allow-Credentials', 'true');
                    res.header('Vary', 'Origin, Access-Control-Request-Headers');
                }
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
                registerCustomerDevelopment = "http://iconnapifunc01-beelinks-development.iconn-asestaging01.p.azurewebsites.net/api/RegisterCustomer?code=VG8ShVbAq5QVfb8K0mkanDeoq63qz9aN0KIcppb1CCYGNRNSGO3fTA==";
                registerCustomerStaging = "http://iconnapifunc01-beelinks-staging.iconn-asestaging01.p.azurewebsites.net/api/RegisterCustomer?code=PdSaRLUU48BkwakllFMnYcaHIEZ7qpvJbaOm11i88rGvoEAmLPYOcQ==";
                registerCustomerProduction = "https://iconnapifunc01-beelinks.iconn-asestaging01.p.azurewebsites.net/api/RegisterCustomer?code=EJpXGBballVmi1R9prsk6P5/wpqFMsA3p233Iib41rmBS75wTf6cog==";
                return [4 /*yield*/, request.post({
                        url: registerCustomerProduction,
                        body: customerData,
                        json: true,
                        timeout: 60000
                    })];
            case 1:
                response = _a.sent();
                if (response) {
                    res.send({ status: 'ok', response: response });
                }
                else
                    res.status(401).send({ status: 'error' });
                return [3 /*break*/, 3];
            case 2:
                error_7 = _a.sent();
                // console.log(error);
                console.log('error in registered customer');
                res.status(401).send({ status: 'error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/* #endregion */
/* #region Check Customer Registration in Icon */
router.post('/CheckRegistration', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var results_2, promises_1, data_23, groups_1, customerData, response, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                results_2 = Array();
                promises_1 = [];
                if (req.headers.origin) {
                    res.header("Access-Control-Allow-Origin", req.headers.origin);
                    res.header("Access-Control-Allow-Headers", "content-type");
                    res.header('Access-Control-Allow-Methods', 'GET');
                    res.header('Access-Control-Allow-Credentials', 'true');
                    res.header('Vary', 'Origin, Access-Control-Request-Headers');
                }
                data_23 = req.body;
                return [4 /*yield*/, TicketgroupModel_1.TicketGroupsModel.getExcludeGroups(data_23.nsp)];
            case 1:
                groups_1 = _a.sent();
                if (!(Array.isArray(data_23.customerEmail) || Array.isArray(data_23.customerPhone))) return [3 /*break*/, 3];
                data_23.customerEmail.map(function (mail) {
                    promises_1 = promises_1.concat(data_23.customerPhone.map(function (val) { return __awaiter(void 0, void 0, void 0, function () {
                        var customerData, response;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    customerData = {
                                        "MailAddress": (mail) ? mail.toLowerCase() : '',
                                        "PhoneNumber": (val) ? val : '',
                                        "StockId": '',
                                        "CustomerId": (data_23.customerID) ? data_23.customerID : '',
                                    };
                                    return [4 /*yield*/, request.post({
                                            uri: "https://iconnapifunc01-beelinks.iconn-asestaging01.p.azurewebsites.net/api/GetCustomerDetail?code=DTrIaDFTaKSCXoHBXQyA1wVOCKpULKaaOPmxgcxq7lx16XR0GM9G2Q==",
                                            body: customerData,
                                            json: true,
                                            timeout: 60000
                                        })];
                                case 1:
                                    response = _a.sent();
                                    if (response) {
                                        results_2.push(response);
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    }); }));
                });
                return [4 /*yield*/, Promise.all(promises_1).then(function (val) {
                        res.send({ status: 'ok', response: results_2, groups: groups_1 });
                    })];
            case 2:
                _a.sent();
                return [3 /*break*/, 5];
            case 3:
                customerData = {
                    "MailAddress": (data_23.customerEmail) ? data_23.customerEmail : '',
                    "PhoneNumber": (data_23.customerPhone) ? data_23.customerPhone : '',
                    "StockId": '',
                    "CustomerId": (data_23.customerID) ? data_23.customerID : '',
                };
                return [4 /*yield*/, request.post({
                        uri: "https://iconnapifunc01-beelinks.iconn-asestaging01.p.azurewebsites.net/api/GetCustomerDetail?code=DTrIaDFTaKSCXoHBXQyA1wVOCKpULKaaOPmxgcxq7lx16XR0GM9G2Q==",
                        body: customerData,
                        json: true,
                        timeout: 50000
                    })];
            case 4:
                response = _a.sent();
                if (response) {
                    res.send({ status: 'ok', response: [response], groups: groups_1 });
                }
                else
                    res.status(401).send({ error: 'error' });
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                error_8 = _a.sent();
                // console.log(error);
                console.log('error in getting registered customer');
                res.status(401).send({ error: 'error' });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
router.post('/InsertCustomerInfo', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, result, check, ticketlog, msg, obj, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                data = req.body;
                if (data.assignment != '') {
                    ticketlog = ticketEnums_1.ComposedTicketENUM(ticketEnums_1.TicketLogMessages.CUSTOMER_REGISTERED, { value: data.cusInfo.customerId, by: data.email, ByextraOptions: data.assignment });
                }
                else {
                    ticketlog = ticketEnums_1.ComposedTicketENUM(ticketEnums_1.TicketLogMessages.CUSTOMER_REGISTERED, { value: data.cusInfo.customerId, by: data.email });
                }
                if (!((data.visitorEmail && data.visitorEmail.length) || (data.visitorPhone && data.visitorPhone.length))) return [3 /*break*/, 6];
                return [4 /*yield*/, ticketsModel_1.Tickets.CheckRegAgainstVisitor(data.visitorEmail, data.visitorPhone, data.nsp)];
            case 1:
                check = _a.sent();
                if (!(check && check.length)) return [3 /*break*/, 3];
                return [4 /*yield*/, ticketsModel_1.Tickets.InsertCustomerInfo(data.tid, data.nsp, data.cusInfo, data.relCusInfo, data.ICONNData, ticketlog, check[0].reg_date)];
            case 2:
                result = _a.sent();
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, ticketsModel_1.Tickets.InsertCustomerInfo(data.tid, data.nsp, data.cusInfo, data.relCusInfo, data.ICONNData, ticketlog, new Date().toISOString())];
            case 4:
                result = _a.sent();
                _a.label = 5;
            case 5: return [3 /*break*/, 8];
            case 6: return [4 /*yield*/, ticketsModel_1.Tickets.InsertCustomerInfo(data.tid, data.nsp, data.cusInfo, data.relCusInfo, data.ICONNData, ticketlog, new Date().toISOString())];
            case 7:
                result = _a.sent();
                _a.label = 8;
            case 8:
                if (result && result.value) {
                    if (data.iconIntroducerEmail != '') {
                        msg = "\n            <p>Respectfully,<br />This is to inform you that your sent registration data to register customer in ICONN is registered successfully.</p>\n            <p>The customer ID of registered customer is:<b> " + data.cusInfo.customerId + "</b><br></p>\n\n            <p>Regards,</p>\n            <p>Beelinks Team.</p>\n            ";
                        obj = {
                            action: 'sendNoReplyEmail',
                            to: data.iconIntroducerEmail,
                            subject: 'Customer Registered by provided ICONN Registration Data',
                            message: msg,
                            html: msg,
                            type: 'agentAssigned'
                        };
                        response = emailService_1.EmailService.SendNoReplyEmail(obj, false);
                    }
                    res.send({ status: 'ok', ticket: result.value, ticketlog: ticketlog });
                }
                else {
                    res.status(401).send({ error: 'error' });
                }
                return [2 /*return*/];
        }
    });
}); });
router.post('/UnbindCustomer', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, ticketlog, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                data = req.body;
                ticketlog = ticketEnums_1.ComposedTicketENUM(ticketEnums_1.TicketLogMessages.UNBIND_ICON_CUSTOMER, { value: data.custId, by: data.email });
                return [4 /*yield*/, ticketsModel_1.Tickets.UnBindIconnCustomer(data.id, data.nsp, ticketlog)];
            case 1:
                result = _a.sent();
                if (result && result.value) {
                    res.send({ status: 'ok', ticketlog: ticketlog });
                }
                else {
                    res.status(401).send({ error: 'error' });
                }
                return [2 /*return*/];
        }
    });
}); });
/* #endregion */
/**Icon Registration through dialog */
router.post('/sendRegistrationData', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data_24, msg_1, settings, configurableEmail, randomColor, incomingEmail, ticket_2, insertedTicket_2, ticketId_2, arr, message, insertedMessage, watchers, message_5, obj, response, origin, EmailRecipients_3, res_7, recipients, onlineAgent, message_6, obj, response, originNSP, groupAdmins_3, res_8, recipients, error_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 22, , 23]);
                data_24 = req.body;
                msg_1 = '';
                return [4 /*yield*/, companyModel_1.Company.getSettings(data_24.nsp)];
            case 1:
                settings = _a.sent();
                configurableEmail = '';
                if (settings && settings.length) {
                    configurableEmail = settings[0].settings.iconnSettings.configurableEmail;
                }
                msg_1 += "<p>Respectfully,</p>\n        <p><strong>Registration request details are as follows:</strong></p>\n        <table style=\"height: 245; width: 400; float: left;\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">\n        <tbody>\n        <tr>\n        <td style=\"width: 250px;\">Customer Name</td>\n        <td style=\"width: 300px;\">" + data_24.details.customerName + " </td>\n        <td>&nbsp;</td>\n        </tr>\n        <tr>\n        <td style=\"width: 250px;\">Company Name</td>\n        <td style=\"width: 300px;\">" + data_24.details.customerName + "</td>\n        <td>&nbsp;</td>\n        </tr>\n        <tr>\n        <td style=\"width: 250px;\">Default Email</td>\n        <td style=\"width: 300px;\">" + data_24.details.contactMailEmailAddress[0] + "</td>\n        <td>&nbsp;</td>\n\n        </tr>\n        ";
                if (data_24.details.contactMailEmailAddress.length > 1) {
                    data_24.details.contactMailEmailAddress.map(function (val, ind) {
                        if (ind != 0) {
                            msg_1 += "<tr>\n                    <td style=\"width: 250px;\">Email (Alternate) # " + ind + "</td>\n                    <td style=\"width: 300px;\"> " + val + " </td>\n                    <td>&nbsp;</td>\n                    ";
                        }
                    });
                    msg_1 += "</tr>";
                }
                msg_1 += "<tr>\n        <td style=\"width: 250px;\">Country</td>\n        <td style=\"width: 300px;\"> " + data_24.details.destCountry + "</td>\n        <td>&nbsp;</td>\n\n        </tr>\n        <tr>\n        <td style=\"width: 250px;\">Port</td>\n        <td style=\"width: 300px;\">" + data_24.details.port + "</td>\n        <td>&nbsp;</td>\n\n        </tr>\n        <tr>\n        <td style=\"width: 250px;\">Default Phone</td>\n        <td style=\"width: 300px;\">" + data_24.details.contactPhoneNumber[0] + "</td>\n        <td>&nbsp;</td>\n\n        </tr>";
                if (data_24.details.contactPhoneNumber.length > 1) {
                    data_24.details.contactPhoneNumber.map(function (val, ind) {
                        if (ind != 0) {
                            msg_1 += "<tr>\n                    <td style=\"width: 250px;\">Phone (Alternate) # " + ind + "</td>\n                    <td style=\"width: 300px;\"> " + val + " </td>\n                    <td>&nbsp;</td>\n                    ";
                        }
                    });
                }
                msg_1 += " </tbody>\n        </table>\n        <p>&nbsp;</p>\n        <p>&nbsp;</p>\n        <p>&nbsp;</p>\n        <p>&nbsp;</p>\n\n        <br>";
                if (data_24.details.introducerCode && data_24.details.introducer) {
                    msg_1 += "\n            <p><strong>Introducer details are as follows:</strong></p>\n        <table style=\"height: 56px; float: left;\" width=\"306\">\n        <tbody>\n        <tr>\n        <td style=\"width: 145px;\">Employee Id</td>\n        <td style=\"width: 145px;\">" + data_24.details.introducerCode + "</td>\n        </tr>\n        <tr>\n        <td style=\"width: 145px;\">Employee Name</td>\n        <td style=\"width: 145px;\">" + data_24.details.introducer + "</td>\n        </tr>\n        </tbody>\n        </table>\n            ";
                }
                if (data_24.details.salePersonUserCode && data_24.details.salesPerson) {
                    msg_1 += "<p style=\"text-align: left;\">&nbsp;</p>\n        <p style=\"text-align: left;\">&nbsp;</p>\n        <br>\n        <p style=\"text-align: left;\"><strong>Sales-Person details are as follows:</strong></p>\n        <table style=\"height: 61px; float: left;\" width=\"297\">\n        <tbody>\n        <tr>\n        <td style=\"width: 139px;\">Employee id</td>\n        <td style=\"width: 142px;\">" + data_24.details.salePersonUserCode + "</td>\n        </tr>\n        <tr>\n        <td style=\"width: 139px;\">Employee Name</td>\n        <td style=\"width: 142px;\">" + data_24.details.salesPerson + "</td>\n        </tr>\n        </tbody>\n        </table>";
                }
                "<p>&nbsp;</p>\n        <p>&nbsp;</p>\n        <p>&nbsp;</p>\n        <p>Regards,</p>\n        <p>Beelinks Team.</p>\n";
                randomColor = constants_1.rand[Math.floor(Math.random() * constants_1.rand.length)];
                return [4 /*yield*/, ticketsModel_1.Tickets.GetIncomingEmails(configurableEmail)];
            case 2:
                incomingEmail = _a.sent();
                if (!(incomingEmail && incomingEmail.length && configurableEmail)) return [3 /*break*/, 20];
                ticket_2 = {
                    type: 'email',
                    subject: 'ICONN Data',
                    nsp: data_24.nsp,
                    priority: '',
                    state: 'OPEN',
                    datetime: new Date().toISOString(),
                    from: configurableEmail,
                    visitor: {
                        name: 'ICONN Registration Data Ticket',
                        email: data_24.agentEmail
                    },
                    IconnIntroducerEmail: data_24.agentEmail,
                    ICONNData: data_24.details,
                    lasttouchedTime: new Date().toISOString(),
                    viewState: 'UNREAD',
                    createdBy: 'Agent',
                    ticketlog: [],
                    mergedTicketIds: [],
                    viewColor: randomColor,
                    group: incomingEmail[0].group ? incomingEmail[0].group : '',
                    assigned_to: '',
                    tags: ['#ICONN_REGISTRATION_DATA'],
                    watchers: [],
                    source: 'panel',
                    assignmentList: []
                };
                return [4 /*yield*/, RuleSetExecutor_1.RuleSetDescriptor(ticket_2, incomingEmail[0].applyExternalRulesets)];
            case 3:
                ticket_2 = _a.sent();
                if (ticket_2.assigned_to) {
                    ticket_2.assignmentList = [
                        {
                            assigned_to: ticket_2.assigned_to,
                            assigned_time: ticket_2.first_assigned_time,
                            read_date: ''
                        }
                    ];
                }
                return [4 /*yield*/, ticketsModel_1.Tickets.CreateTicket(ticket_2)];
            case 4:
                insertedTicket_2 = _a.sent();
                if (insertedTicket_2 && insertedTicket_2.insertedCount) {
                    ticketId_2 = insertedTicket_2.insertedId;
                }
                if (!ticketId_2) return [3 /*break*/, 19];
                arr = [];
                arr.push(ticketId_2);
                message = {
                    datetime: new Date().toISOString(),
                    nsp: data_24.nsp,
                    senderType: 'Visitor',
                    message: msg_1,
                    from: data_24.agentEmail,
                    to: configurableEmail,
                    replytoAddress: data_24.agentEmail,
                    tid: [ticketId_2],
                    attachment: [],
                    viewColor: '',
                    form: (data_24.form) ? data_24.form : '',
                    submittedForm: (data_24.submittedForm) ? data_24.submittedForm : ''
                };
                return [4 /*yield*/, ticketsModel_1.Tickets.InsertMessage(JSON.parse(JSON.stringify(message)))];
            case 5:
                insertedMessage = _a.sent();
                if (!(insertedMessage && insertedMessage.insertedCount && insertedTicket_2 && insertedTicket_2.insertedCount)) return [3 /*break*/, 19];
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'newTicket', nsp: data_24.nsp, roomName: ['ticketAdmin'], data: { ticket: insertedTicket_2.ops[0] } })];
            case 6:
                _a.sent();
                if (!(insertedTicket_2.ops[0].watchers && insertedTicket_2.ops[0].watchers.length)) return [3 /*break*/, 8];
                return [4 /*yield*/, sessionsManager_1.SessionManager.getOnlineWatchers(data_24.nsp, insertedTicket_2.ops[0].watchers)];
            case 7:
                watchers = _a.sent();
                if (watchers && watchers.length) {
                    watchers.map(function (single) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'newTicket', nsp: data_24.nsp, roomName: [single._id], data: { ticket: insertedTicket_2 ? insertedTicket_2.ops[0] : undefined } })];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                }
                _a.label = 8;
            case 8:
                if (insertedTicket_2.ops[0].IconnIntroducerEmail) {
                    message_5 = '';
                    message_5 += 'Dear Agent,<br>'
                        + '<span>Your request for sending registration data is sent to respective person successfully and ticket is created against your request.<br>'
                        + 'You will get response after your data is accessed and registered</span><br><br>'
                        + 'Regards, <br> Beelinks Team.'
                        + '<br> The copy of message can be seen below.<br>'
                        + '----------------------------------------------------------------------------------------------------<br>'
                        + '----------------------------------------------------------------------------------------------------';
                    message_5 += msg_1;
                    obj = {
                        action: 'sendNoReplyEmail',
                        to: insertedTicket_2.ops[0].IconnIntroducerEmail,
                        subject: 'Request Sent for Registration data',
                        message: message_5,
                        html: message_5,
                        type: 'newTicket'
                    };
                    response = emailService_1.EmailService.SendNoReplyEmail(obj, false);
                }
                if (!insertedTicket_2.ops[0].assigned_to) return [3 /*break*/, 14];
                return [4 /*yield*/, agentModel_1.Agents.GetEmailNotificationSettings(data_24.nsp, data_24.agentEmail)];
            case 9:
                origin = _a.sent();
                if (!(origin && origin.length && origin[0].settings.emailNotifications.assignToAgent)) return [3 /*break*/, 14];
                EmailRecipients_3 = Array();
                return [4 /*yield*/, ticketsModel_1.Tickets.getWatchers(insertedTicket_2.ops[0]._id, data_24.nsp)];
            case 10:
                res_7 = _a.sent();
                if (res_7 && res_7.length) {
                    EmailRecipients_3 = EmailRecipients_3.concat(res_7[0].watchers);
                }
                EmailRecipients_3.push(insertedTicket_2.ops[0].assigned_to);
                if (insertedTicket_2.ops[0].nsp == '/sbtjapan.com' || insertedTicket_2.ops[0].nsp == '/sbtjapaninquiries.com') {
                    EmailRecipients_3.push('globalqc@sbtjapan.com');
                }
                recipients = EmailRecipients_3.filter(function (item, pos) {
                    return EmailRecipients_3.indexOf(item) == pos;
                });
                return [4 /*yield*/, sessionsManager_1.SessionManager.getAgentByEmail(data_24.nsp, insertedTicket_2.ops[0].assigned_to)];
            case 11:
                onlineAgent = _a.sent();
                if (!onlineAgent) return [3 /*break*/, 13];
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'newTicket', nsp: data_24.nsp, roomName: [onlineAgent._id], data: { ticket: insertedTicket_2.ops[0] } })];
            case 12:
                _a.sent();
                _a.label = 13;
            case 13:
                message_6 = '';
                message_6 += msg_1;
                message_6 += '<br><br><span><b>ID: </b>' + ticketId_2 + '<br>'
                    + '<span><b>Assigned by: </b> Automatic Assignment <br>'
                    + '<span><b>Link: </b> https://app.beelinks.solutions/tickets/ticket-view/' + ticketId_2 + '<br>';
                obj = {
                    action: 'sendNoReplyEmail',
                    to: recipients,
                    subject: 'ICONN Registration Data Ticket assigned # ' + ticketId_2,
                    message: message_6,
                    html: message_6,
                    type: 'agentAssigned'
                };
                response = emailService_1.EmailService.SendNoReplyEmail(obj, false);
                _a.label = 14;
            case 14:
                if (!insertedTicket_2.ops[0].group) return [3 /*break*/, 18];
                return [4 /*yield*/, companyModel_1.Company.GetEmailNotificationSettings(data_24.nsp)];
            case 15:
                originNSP = _a.sent();
                if (!(originNSP && originNSP.length && originNSP[0].settings.emailNotifications.tickets.assignToGroup)) return [3 /*break*/, 18];
                return [4 /*yield*/, TicketgroupModel_1.TicketGroupsModel.GetGroupAdmins(data_24.nsp, ticket_2.group)];
            case 16:
                groupAdmins_3 = _a.sent();
                if (!groupAdmins_3) return [3 /*break*/, 18];
                return [4 /*yield*/, ticketsModel_1.Tickets.getWatchers(insertedTicket_2.ops[0]._id, data_24.nsp)];
            case 17:
                res_8 = _a.sent();
                if (res_8 && res_8.length) {
                    groupAdmins_3 = groupAdmins_3.concat(res_8[0].watchers);
                }
                recipients = groupAdmins_3.filter(function (item, pos) {
                    if (groupAdmins_3 && groupAdmins_3.length)
                        return groupAdmins_3.indexOf(item) == pos;
                });
                recipients.forEach(function (admin) { return __awaiter(void 0, void 0, void 0, function () {
                    var msg, obj, response;
                    return __generator(this, function (_a) {
                        msg = '<span><b>ID: </b>' + ticketId_2 + '<br>'
                            + '<span><b>Group: </b> ' + ticket_2.group + '<br>'
                            + '<span><b>Assigned by: </b> Automatic Assignment <br>'
                            + '<span><b>Link: </b> https://app.beelinks.solutions/tickets/ticket-view/' + ticketId_2 + '<br>';
                        obj = {
                            action: 'sendNoReplyEmail',
                            to: admin,
                            subject: 'Group assigned to Ticket #' + ticketId_2,
                            message: msg,
                            html: msg,
                            type: 'newTicket'
                        };
                        response = emailService_1.EmailService.SendNoReplyEmail(obj, false);
                        return [2 /*return*/];
                    });
                }); });
                _a.label = 18;
            case 18:
                res.send({ status: 'ok', ticket: insertedTicket_2.ops[0] });
                _a.label = 19;
            case 19: return [3 /*break*/, 21];
            case 20:
                res.send({ status: 'error' });
                _a.label = 21;
            case 21: return [3 /*break*/, 23];
            case 22:
                error_9 = _a.sent();
                console.log(error_9);
                console.log('error in sending data of customer');
                res.status(401).send({ error: 'error' });
                return [3 /*break*/, 23];
            case 23: return [2 /*return*/];
        }
    });
}); });
/* #region  Agents */
router.post('/getAgentAgainstWatchers', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, agents, err_29;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                data = req.body;
                if (!data.nsp || !data.watcherList)
                    res.status(401).send('Invalid Request!');
                return [4 /*yield*/, agentModel_1.Agents.getAgentAgainstWatchers(data.nsp, data.watcherList)];
            case 1:
                agents = _a.sent();
                if (agents && agents.length) {
                    res.send({ status: 'ok', agents: agents });
                }
                else {
                    res.send({ status: 'error', msg: 'Agent list not found!' });
                }
                return [3 /*break*/, 3];
            case 2:
                err_29 = _a.sent();
                console.log(err_29);
                console.log('Error in getting agents against watchers');
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/getAgentsAgainstGroup', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, agents, err_30;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                data = req.body;
                if (!data.nsp || !data.groupList)
                    res.status(401).send('Invalid Request!');
                if (!data.groupList) return [3 /*break*/, 2];
                return [4 /*yield*/, TicketgroupModel_1.TicketGroupsModel.getAgentsAgainstGroup(data.nsp, data.groupList)];
            case 1:
                agents = _a.sent();
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
                res.send({ status: 'ok', agents: agents });
                return [3 /*break*/, 3];
            case 2:
                res.send({ status: 'error', msg: 'Group list not defined!' });
                _a.label = 3;
            case 3: return [3 /*break*/, 5];
            case 4:
                err_30 = _a.sent();
                console.log(err_30);
                console.log('Error in get agents against group');
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
router.post('/getAgentsAgaintTeams', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, agents, err_31;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                data = req.body;
                if (!data.nsp || !data.teams)
                    res.status(401).send('Invalid Request!');
                if (!data.teams) return [3 /*break*/, 2];
                return [4 /*yield*/, teamsModel_1.TeamsModel.getTeamsMembersAgainstTeams(data.nsp, data.teams)];
            case 1:
                agents = _a.sent();
                res.send({ status: 'ok', agents: agents });
                return [3 /*break*/, 3];
            case 2:
                res.send({ status: 'error', msg: 'Group list not defined!' });
                _a.label = 3;
            case 3: return [3 /*break*/, 5];
            case 4:
                err_31 = _a.sent();
                console.log(err_31);
                console.log('Error in get agents against teams');
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
router.post('/getAllAgentsAgainstAdmin', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, agents, err_32;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                data = req.body;
                if (!data.nsp || !data.email)
                    res.status(401).send('Invalid Request!');
                return [4 /*yield*/, TicketgroupModel_1.TicketGroupsModel.getAllAgentsAgainstAdmin(data.nsp, data.email)];
            case 1:
                agents = _a.sent();
                res.send({ status: 'ok', agents: agents });
                return [3 /*break*/, 3];
            case 2:
                err_32 = _a.sent();
                console.log(err_32);
                console.log('Error in get agents against admin');
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/getAgentByEmail', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, agent, err_33;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                data = req.body;
                if (!data.nsp || !data.email)
                    res.status(401).send('Invalid Request!');
                return [4 /*yield*/, agentModel_1.Agents.getAgentByEmail(data.nsp, data.email)];
            case 1:
                agent = _a.sent();
                if (agent) {
                    res.send({ status: 'ok', agentInfo: agent });
                }
                else {
                    res.send({ status: 'error' });
                }
                return [3 /*break*/, 3];
            case 2:
                err_33 = _a.sent();
                console.log(err_33);
                console.log('Error in get agents by email');
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/* #endregion */
/* #region  Incoming Email */
router.post('/getIncomingEmailsByNSP', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, email_data, err_34;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                data = req.body;
                if (!data.nsp)
                    res.status(401).send('Invalid Request!');
                return [4 /*yield*/, ticketsModel_1.Tickets.GetIncomingEmailsByNSP(data.nsp)];
            case 1:
                email_data = _a.sent();
                if (email_data) {
                    // console.log(email_data);
                    res.send({ status: 'ok', email_data: email_data });
                }
                else {
                    res.send({ status: 'error', msg: 'No incoming emails by nsp found!' });
                }
                return [3 /*break*/, 3];
            case 2:
                err_34 = _a.sent();
                console.log(err_34);
                console.log('Error in getting incoming emails by nsp');
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/getIncomingEmails', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, email_data, err_35;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                data = req.body;
                if (!data.email)
                    res.status(401).send('Invalid Request!');
                return [4 /*yield*/, ticketsModel_1.Tickets.GetIncomingEmails(data.email)];
            case 1:
                email_data = _a.sent();
                if (email_data && email_data.length) {
                    // console.log(email_data);
                    res.send({ status: 'ok', email_data: email_data });
                }
                else {
                    res.send({ status: 'error', msg: 'No incoming emails found!' });
                }
                return [3 /*break*/, 3];
            case 2:
                err_35 = _a.sent();
                console.log(err_35);
                console.log('Error in getting incoming emails');
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/addIncomingEmail', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, pkg, groupsCount, result, error_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                data = req.body;
                if (!data.email)
                    res.status(401).send('Invalid Request!');
                return [4 /*yield*/, companyModel_1.Company.getPackages(data.nsp)];
            case 1:
                pkg = _a.sent();
                if (!(pkg && pkg.length && pkg[0].package.tickets.incomingEmail.maxIncomingEmails != -1)) return [3 /*break*/, 3];
                return [4 /*yield*/, ticketsModel_1.Tickets.GetIncomingEmailsCount(data.nsp)];
            case 2:
                groupsCount = _a.sent();
                if (groupsCount && groupsCount.length && pkg[0].package.tickets.incomingEmail.maxIncomingEmails && groupsCount[0].count >= pkg[0].package.tickets.incomingEmail.maxIncomingEmails) {
                    // console.log('Limit Exceeded');
                    res.send({ status: 'error', msg: 'Limit Exceeded!' });
                    return [2 /*return*/];
                }
                _a.label = 3;
            case 3: return [4 /*yield*/, ticketsModel_1.Tickets.AddIncomingEmail(data.domainEmail, data.incomingEmail, data.group, data.name, data.nsp)];
            case 4:
                result = _a.sent();
                if (result && result.insertedCount) {
                    res.send({ status: 'ok', msg: 'Incoming Email of Agent Added!' });
                }
                else {
                    res.send({ status: 'error', msg: 'Unable To add incoming email of agent' });
                }
                return [3 /*break*/, 6];
            case 5:
                error_10 = _a.sent();
                console.log(error_10);
                console.log('Error in adding incoming email');
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
router.post('/addRuleSet', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, pkg, groupsCount, ruleSetInDb, ruleSet, error_11;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                data = req.body;
                console.log(data);
                return [4 /*yield*/, companyModel_1.Company.getPackages(data.nsp)];
            case 1:
                pkg = _a.sent();
                console.log(pkg);
                if (!(pkg && pkg.length && pkg[0].package.tickets.rulesets.quota != -1)) return [3 /*break*/, 3];
                return [4 /*yield*/, TicketgroupModel_1.TicketGroupsModel.getRulesetsCount(data.nsp)];
            case 2:
                groupsCount = _a.sent();
                if (groupsCount && groupsCount.length && pkg[0].package.tickets.rulesets.quota && groupsCount[0].count >= pkg[0].package.tickets.rulesets.quota) {
                    // console.log('Limit Exceeded');
                    res.send({ status: 'error', msg: 'Limit Exceeded!' });
                    return [2 /*return*/];
                }
                _a.label = 3;
            case 3:
                ruleSetInDb = {
                    nsp: data.nsp,
                    name: data.ruleset.name,
                    conditions: data.ruleset.conditions,
                    actions: data.ruleset.actions,
                    lastmodified: data.ruleset.lastmodified,
                    operator: data.ruleset.operator,
                    isActive: data.ruleset.isActive
                };
                return [4 /*yield*/, TicketgroupModel_1.TicketGroupsModel.addRuleSet(ruleSetInDb)];
            case 4:
                ruleSet = _a.sent();
                if (ruleSet && ruleSet.insertedCount)
                    res.send({ status: 'ok', ruleset: ruleSet.ops[0] });
                else
                    res.send({ status: 'error', msg: 'No RuleSet added!' });
                return [3 /*break*/, 6];
            case 5:
                error_11 = _a.sent();
                console.log(error_11);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
router.post('/updateIncomingId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, updatedemail_data, error_12;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                data = req.body;
                if (!data.email)
                    res.status(401).send('Invalid Request!');
                return [4 /*yield*/, ticketsModel_1.Tickets.UpdateIncomingEmailId(data.emailId, data.domainEmail, data.incomingEmail, data.name, data.group, data.nsp)];
            case 1:
                updatedemail_data = _a.sent();
                if (updatedemail_data && updatedemail_data.value) {
                    res.send({ status: 'ok', Updateddata: updatedemail_data.value });
                }
                else {
                    res.send({ status: 'error', msg: 'No incoming emails deleted!' });
                }
                return [3 /*break*/, 3];
            case 2:
                error_12 = _a.sent();
                console.log(error_12);
                console.log('Error in adding incoming email');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/deleteIncomingId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, deletedemail_data, packet, error_13;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                data = req.body;
                return [4 /*yield*/, ticketsModel_1.Tickets.DeleteIncomingEmailId(data.emailId, data.nsp)];
            case 1:
                deletedemail_data = _a.sent();
                if (deletedemail_data) {
                    packet = {
                        action: 'RemoveIdentity',
                        email: data.email
                    };
                    emailService_1.EmailService.SendNoReplyEmail(packet, true);
                    res.send({ status: 'ok', msg: "Incoming Email Deleted" });
                }
                else {
                    res.send({ status: 'error', msg: 'No incoming emails deleted!' });
                }
                return [3 /*break*/, 3];
            case 2:
                error_13 = _a.sent();
                console.log(error_13);
                console.log('Error in deleting incoming email');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/sendActivation', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, id, token, origin, error_14;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                data = req.body;
                if (!data.email)
                    res.status(401).send('Invalid Request!');
                id = new mongodb_1.ObjectID();
                id.toString();
                token = {
                    email: data.emailId,
                    expiryDate: new Date(new Date().getTime() + 60 * 60 * 24 * 1000).toISOString(),
                    id: id.toHexString(),
                    type: 'emailActivation'
                };
                tokensModel_1.Tokens.inserToken(token);
                return [4 /*yield*/, companyModel_1.Company.GetEmailNotificationSettings(data.nsp)];
            case 1:
                origin = _a.sent();
                if (!(origin && origin.length && origin[0].settings.emailNotifications.tickets.userActEmail)) return [3 /*break*/, 3];
                return [4 /*yield*/, emailService_1.EmailService.SendActivationEmail({ to: data.emailId, subject: 'Activation Email', message: 'https://app.beelinks.solutions/agent/activation/' + token.id })];
            case 2:
                _a.sent();
                res.send({ status: 'ok', msg: "Activation Email Sent" });
                _a.label = 3;
            case 3:
                res.send({ status: 'ok', msg: "Activation Email Notification Disabled" });
                return [3 /*break*/, 5];
            case 4:
                error_14 = _a.sent();
                console.log(error_14);
                console.log('Error in sending act. email');
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
router.post('/sendIdentityVerificationEmail', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, exists, packet, error_15;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                data = req.body;
                if (!data.email) return [3 /*break*/, 4];
                return [4 /*yield*/, emailActivations_1.EmailActivations.checkEmailIfAlreadySent(data.email)];
            case 1:
                exists = _a.sent();
                if (!(exists && exists.length)) return [3 /*break*/, 2];
                res.send({ status: 'error', msg: "Identitity Verification has been sent already please verify!" });
                return [3 /*break*/, 4];
            case 2:
                packet = {
                    action: 'IdentityVerification',
                    email: data.email
                };
                return [4 /*yield*/, emailService_1.EmailService.SendNoReplyEmail(packet, true)];
            case 3:
                _a.sent();
                res.send({ status: 'ok', msg: "Identitity Verification Email Sent!" });
                _a.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                error_15 = _a.sent();
                console.log(error_15);
                console.log('Error in sendIdentityVerificationEmail');
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
router.post('/toggleUseOriginalEmail', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, result, error_16;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                data = req.body;
                return [4 /*yield*/, ticketsModel_1.Tickets.ToggleUseOriginalEmail(data.id, data.value)];
            case 1:
                result = _a.sent();
                if (result && result.value) {
                    res.send({ status: 'ok', msg: ((data.value) ? 'Enabled' : 'Disabled') + ' sending from original email!' });
                }
                else {
                    res.send({ status: 'error', msg: 'Unable to toggle the use of original email!' });
                }
                return [3 /*break*/, 3];
            case 2:
                error_16 = _a.sent();
                console.log(error_16);
                console.log('Error in toggleUseOriginalEmail');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/toggleExternalRuleset', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, result, error_17;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                data = req.body;
                return [4 /*yield*/, ticketsModel_1.Tickets.ToggleExternalRuleset(data.id, data.value)];
            case 1:
                result = _a.sent();
                if (result && result.value) {
                    res.send({ status: 'ok', msg: 'External ruleset toggled ' + ((data.value) ? 'on' : 'off') + ' for ' + result.value.domainEmail + '!' });
                }
                else {
                    res.send({ status: 'error', msg: 'Unable To toggle' });
                }
                return [3 /*break*/, 3];
            case 2:
                error_17 = _a.sent();
                console.log(error_17);
                console.log('Error in toggleUseOriginalEmail');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/toggleIconnDispatcher', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, result, error_18;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                data = req.body;
                return [4 /*yield*/, ticketsModel_1.Tickets.ToggleIconnDispatcher(data.id, data.value)];
            case 1:
                result = _a.sent();
                if (result && result.value) {
                    res.send({ status: 'ok', msg: 'Iconn Dispatcher ruleset toggled ' + ((data.value) ? 'on' : 'off') + ' for ' + result.value.domainEmail + '!' });
                }
                else {
                    res.send({ status: 'error', msg: 'Unable To toggle' });
                }
                return [3 /*break*/, 3];
            case 2:
                error_18 = _a.sent();
                console.log(error_18);
                console.log('Error in toggleUseOriginalEmail');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/toggleIconnDispatcherTicketView', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, result, error_19;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                data = req.body;
                return [4 /*yield*/, ticketsModel_1.Tickets.ToggleIconnDispatcherTicketView(data.id, data.value)];
            case 1:
                result = _a.sent();
                if (result && result.value) {
                    res.send({ status: 'ok', msg: 'Iconn Dispatcher while opening ticket ruleset toggled ' + ((data.value) ? 'on' : 'off') + ' for ' + result.value.domainEmail + '!' });
                }
                else {
                    res.send({ status: 'error', msg: 'Unable To toggle' });
                }
                return [3 /*break*/, 3];
            case 2:
                error_19 = _a.sent();
                console.log(error_19);
                console.log('Error in toggleUseOriginalEmail');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/toggleAckEmail', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, result, error_20;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                data = req.body;
                return [4 /*yield*/, ticketsModel_1.Tickets.ToggleAckEmail(data.id, data.value)];
            case 1:
                result = _a.sent();
                if (result && result.value) {
                    res.send({ status: 'ok', msg: 'Acknowledgement Email toggled ' + ((data.value) ? 'on' : 'off') + ' for ' + result.value.domainEmail + '!' });
                }
                else {
                    res.send({ status: 'error', msg: 'Unable To toggle' });
                }
                return [3 /*break*/, 3];
            case 2:
                error_20 = _a.sent();
                console.log(error_20);
                console.log('Error in toggleUseOriginalEmail');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/setPrimaryEmail', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, emailData, error_21;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                data = req.body;
                return [4 /*yield*/, ticketsModel_1.Tickets.setPrimaryEmail(data.nsp, data.id, data.flag)];
            case 1:
                emailData = _a.sent();
                if (emailData && emailData.value) {
                    res.send({ status: 'ok', emailData: emailData.value });
                }
                else {
                    res.send({ status: 'error', msg: 'Cannot set email primary' });
                }
                return [3 /*break*/, 3];
            case 2:
                error_21 = _a.sent();
                console.log(error_21);
                console.log("error in setting primary email");
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/* #endregion */
/* #region  Groups */
router.post('/getGroupByNSP', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data_25, groupFromDb, session, ticketPermissions, error_22;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                data_25 = req.body;
                if (!data_25.nsp || !data_25.email)
                    res.status(401).send('Invalid Request!');
                return [4 /*yield*/, TicketgroupModel_1.TicketGroupsModel.GetGroupDetailsByNSP(data_25.nsp)];
            case 1:
                groupFromDb = _a.sent();
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetSessionByEmailFromDatabase(data_25.email, data_25.nsp)];
            case 2:
                session = _a.sent();
                if (session) {
                    ticketPermissions = session.permissions.tickets;
                    if (groupFromDb) {
                        if (ticketPermissions.canView == 'group') {
                            groupFromDb = groupFromDb.filter(function (g) { return g.agent_list.filter(function (a) { return a.email == data_25.email; }).length; });
                        }
                        res.send({ status: 'ok', group_data: groupFromDb });
                    }
                    else {
                        res.send({ status: 'error', msg: 'No Groups found!' });
                    }
                }
                else {
                    res.status(401).send('Invalid Request!');
                }
                return [3 /*break*/, 4];
            case 3:
                error_22 = _a.sent();
                console.log(error_22);
                console.log('Error in get groups by nsp');
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.post('/insertGroup', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, pkg, groupsCount, groups, error_23;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 8, , 9]);
                data = req.body;
                return [4 /*yield*/, companyModel_1.Company.getPackages(data.nsp)];
            case 1:
                pkg = _a.sent();
                if (!(pkg && pkg.length && pkg[0].package.tickets.groups.quota != -1)) return [3 /*break*/, 3];
                return [4 /*yield*/, TicketgroupModel_1.TicketGroupsModel.GetGroupsCount(data.nsp)];
            case 2:
                groupsCount = _a.sent();
                if (groupsCount && groupsCount.length && pkg[0].package.tickets.groups.quota && groupsCount[0].count >= pkg[0].package.tickets.groups.quota) {
                    // console.log('Limit Exceeded');
                    res.send({ status: 'Limit Exceeded' });
                    return [2 /*return*/];
                }
                _a.label = 3;
            case 3: return [4 /*yield*/, TicketgroupModel_1.TicketGroupsModel.InsertGroup(data.group, data.nsp)];
            case 4:
                groups = _a.sent();
                if (!groups) return [3 /*break*/, 6];
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'groupChanges', nsp: data.nsp, roomName: [agentModel_1.Agents.NotifyAll()], data: { status: 'ok' } })];
            case 5:
                _a.sent();
                res.send({ status: 'ok' });
                return [3 /*break*/, 7];
            case 6:
                res.send({ status: 'error' });
                _a.label = 7;
            case 7: return [3 /*break*/, 9];
            case 8:
                error_23 = _a.sent();
                console.log(error_23);
                res.send({ status: 'error', msg: error_23 });
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); });
router.post('/insertTeam', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, pkg, groupsCount, team, err_36;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                data = req.body;
                return [4 /*yield*/, companyModel_1.Company.getPackages(data.nsp)];
            case 1:
                pkg = _a.sent();
                if (!(pkg && pkg.length && pkg[0].package.tickets.team.quota != -1)) return [3 /*break*/, 3];
                return [4 /*yield*/, teamsModel_1.TeamsModel.getTeamsCount(data.nsp)];
            case 2:
                groupsCount = _a.sent();
                if (groupsCount && groupsCount.length && pkg[0].package.tickets.team.quota && groupsCount[0].count >= pkg[0].package.tickets.team.quota) {
                    // console.log('Limit Exceeded');
                    res.send({ status: 'Limit Exceeded' });
                    return [2 /*return*/];
                }
                _a.label = 3;
            case 3:
                data.team.nsp = data.nsp;
                data.team.agents = [];
                return [4 /*yield*/, teamsModel_1.TeamsModel.insertTeam(data.team)];
            case 4:
                team = _a.sent();
                if (team && team.insertedCount > 0) {
                    res.send({ status: 'ok', team: team.ops[0] });
                }
                else {
                    res.send({ status: 'error' });
                }
                return [3 /*break*/, 6];
            case 5:
                err_36 = _a.sent();
                res.send({ status: 'error', msg: err_36 });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
router.post('/addTicketTemplate', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, pkg, checkCount, template, error_24;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                data = req.body;
                return [4 /*yield*/, companyModel_1.Company.getPackages(data.nsp)];
            case 1:
                pkg = _a.sent();
                if (!(pkg && pkg.length && pkg[0].package.tickets.ticketTemplate.quota != -1)) return [3 /*break*/, 3];
                return [4 /*yield*/, ticketTemplateModel_1.TicketTemplateModel.TemplatesCount(data.nsp)];
            case 2:
                checkCount = _a.sent();
                if (checkCount && checkCount.length && pkg[0].package.tickets.ticketTemplate.quota && checkCount[0].count >= pkg[0].package.tickets.ticketTemplate.quota) {
                    // console.log('Limit Exceeded');
                    res.send({ status: 'error', msg: 'Limit Exceeded!' });
                    return [2 /*return*/];
                }
                _a.label = 3;
            case 3:
                data.templateObj.cannedForm = data.templateObj.cannedForm ? new mongodb_1.ObjectID(data.templateObj.cannedForm) : undefined;
                return [4 /*yield*/, ticketTemplateModel_1.TicketTemplateModel.AddTicketTemplate(data.templateObj)];
            case 4:
                template = _a.sent();
                if (template) {
                    res.send({ status: 'ok', templateInserted: template.ops[0] });
                }
                else {
                    res.send({ status: 'error', code: 500, msg: 'Internal Server Error' });
                }
                return [3 /*break*/, 6];
            case 5:
                error_24 = _a.sent();
                console.log(error_24);
                console.log('error in creating ticket Template');
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
router.post('/insertForm', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, pkg, checkCount, result, error_25;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                data = req.body;
                return [4 /*yield*/, companyModel_1.Company.getPackages(data.nsp)];
            case 1:
                pkg = _a.sent();
                if (!(pkg && pkg.length && pkg[0].package.tickets.formDesigner.quota != -1)) return [3 /*break*/, 3];
                return [4 /*yield*/, FormDesignerModel_1.FormDesignerModel.GetFormsCount(data.nsp)];
            case 2:
                checkCount = _a.sent();
                if (checkCount && checkCount.length && pkg[0].package.tickets.formDesigner.quota && checkCount[0].count >= pkg[0].package.tickets.formDesigner.quota) {
                    // console.log('Limit Exceeded');
                    res.send({ status: 'error', msg: 'Limit Exceeded!' });
                    return [2 /*return*/];
                }
                _a.label = 3;
            case 3:
                data.obj.lastModified.by = data.email;
                data.obj.lastModified.date = new Date().toISOString();
                return [4 /*yield*/, FormDesignerModel_1.FormDesignerModel.InsertForm(data.obj)];
            case 4:
                result = _a.sent();
                if (result && result.insertedCount) {
                    res.send({ status: 'ok', forminserted: result.ops[0] });
                }
                else {
                    res.send({ status: 'error', msg: "Error in designing Form!" });
                }
                return [3 /*break*/, 6];
            case 5:
                error_25 = _a.sent();
                res.send({ status: 'error', msg: error_25 });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
router.post('/AddPolicy', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, pkg, checkCount, policy, error_26;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                data = req.body;
                return [4 /*yield*/, companyModel_1.Company.getPackages(data.nsp)];
            case 1:
                pkg = _a.sent();
                if (!(pkg && pkg.length && pkg[0].package.tickets.SLA.quota != -1)) return [3 /*break*/, 3];
                return [4 /*yield*/, SLAPolicyModel_1.SLAPolicyModel.getPoliciesCount(data.nsp)];
            case 2:
                checkCount = _a.sent();
                if (checkCount && checkCount.length && pkg[0].package.tickets.SLA.quota && checkCount[0].count >= pkg[0].package.tickets.SLA.quota) {
                    // console.log('Limit Exceeded');
                    res.send({ status: 'error', msg: 'Limit Exceeded!' });
                    return [2 /*return*/];
                }
                _a.label = 3;
            case 3: return [4 /*yield*/, SLAPolicyModel_1.SLAPolicyModel.AddPolicy(data.policyObj)];
            case 4:
                policy = _a.sent();
                if (policy) {
                    // console.log("added", policy.ops[0]);
                    res.send({ status: 'ok', policyInserted: policy.ops[0] });
                }
                else {
                    res.send({ status: 'error', code: 500, msg: 'Internal Server Error' });
                }
                return [3 /*break*/, 6];
            case 5:
                error_26 = _a.sent();
                console.log(error_26);
                console.log('error in creating policy');
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
router.post('/addScenario', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, pkg, checkCount, scenario, error_27;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                data = req.body;
                return [4 /*yield*/, companyModel_1.Company.getPackages(data.nsp)];
            case 1:
                pkg = _a.sent();
                if (!(pkg && pkg.length && pkg[0].package.tickets.scenarioAutomation.quota != -1)) return [3 /*break*/, 3];
                return [4 /*yield*/, ticketScenariosModel_1.TicketScenariosModel.getScenariosCount(data.nsp)];
            case 2:
                checkCount = _a.sent();
                if (checkCount && checkCount.length && pkg[0].package.tickets.scenarioAutomation.quota && checkCount[0].count >= pkg[0].package.tickets.scenarioAutomation.quota) {
                    // console.log('Limit Exceeded');
                    res.send({ status: 'error', msg: 'Limit Exceeded!' });
                    return [2 /*return*/];
                }
                _a.label = 3;
            case 3: return [4 /*yield*/, ticketScenariosModel_1.TicketScenariosModel.AddScenario(data.scenarioObj)];
            case 4:
                scenario = _a.sent();
                if (scenario) {
                    res.send({ status: 'ok', scenarioInserted: scenario.ops[0] });
                }
                else {
                    res.send({ status: 'error', code: 500, msg: 'Internal Server Error' });
                }
                return [3 /*break*/, 6];
            case 5:
                error_27 = _a.sent();
                console.log(error_27);
                console.log('error in creating scenario');
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
router.post('/deleteGroup', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, group, error_28;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                data = req.body;
                return [4 /*yield*/, TicketgroupModel_1.TicketGroupsModel.deleteGroup(data.group_name, data.nsp)];
            case 1:
                group = _a.sent();
                if (!group) return [3 /*break*/, 3];
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'groupChanges', nsp: data.nsp, roomName: [agentModel_1.Agents.NotifyAll()], data: { status: 'ok' } })];
            case 2:
                _a.sent();
                res.send({ status: 'ok', group_data: group });
                return [3 /*break*/, 4];
            case 3:
                res.send({ status: 'error' });
                _a.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                error_28 = _a.sent();
                res.send({ status: 'error', msg: error_28 });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
router.post('/assignAgent', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, count, agent_list, group, error_29;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                data = req.body;
                return [4 /*yield*/, TicketgroupModel_1.TicketGroupsModel.getAgentAssignedCount(data.agent_email, "OPEN")];
            case 1:
                count = _a.sent();
                if (!count) return [3 /*break*/, 5];
                agent_list = {
                    email: data.agent_email,
                    count: count.length,
                    isAdmin: false,
                    excluded: false
                };
                return [4 /*yield*/, TicketgroupModel_1.TicketGroupsModel.AssignAgent(data.agent_email, data.group_name, data.nsp, agent_list)];
            case 2:
                group = _a.sent();
                if (!group) return [3 /*break*/, 4];
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'groupChanges', nsp: data.nsp, roomName: [agentModel_1.Agents.NotifyAll()], data: { status: 'ok' } })];
            case 3:
                _a.sent();
                res.send({ status: 'ok' });
                return [3 /*break*/, 5];
            case 4:
                res.send({ status: 'error' });
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                error_29 = _a.sent();
                res.send({ status: 'error', msg: error_29 });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
router.post('/unAssignAgent', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, group, error_30;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                data = req.body;
                return [4 /*yield*/, TicketgroupModel_1.TicketGroupsModel.UnAssignAgent(data.agent_email, data.group_name, data.nsp)];
            case 1:
                group = _a.sent();
                if (!group) return [3 /*break*/, 3];
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'groupChanges', nsp: data.nsp, roomName: [agentModel_1.Agents.NotifyAll()], data: { status: 'ok' } })];
            case 2:
                _a.sent();
                res.send({ status: 'ok' });
                return [3 /*break*/, 4];
            case 3:
                res.send({ status: 'error' });
                _a.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                error_30 = _a.sent();
                res.send({ status: 'error', msg: error_30 });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
router.get('/exportCustomTickets', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        try {
            res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
            res.header('Expires', '-1');
            res.header('Pragma', 'no-cache');
            console.log('Export Tickets');
            ticketsModel_1.Tickets.getCustomData2();
            res.send('Done!');
        }
        catch (error) {
            console.log(error);
            res.send(error);
        }
        return [2 /*return*/];
    });
}); });
router.post('/toggleExclude', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, group, err_37;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                data = req.body;
                return [4 /*yield*/, TicketgroupModel_1.TicketGroupsModel.toggleExclude(data.nsp, data.group_name, data.email, data.value)];
            case 1:
                group = _a.sent();
                if (group) {
                    res.send({ status: 'ok', group: group });
                }
                else {
                    res.send({ status: 'error', msg: 'Toggle exclude error', data: data });
                }
                return [3 /*break*/, 3];
            case 2:
                err_37 = _a.sent();
                console.log('Error in toggle admin');
                console.log(err_37);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/toggleAdmin', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, group, err_38;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                data = req.body;
                return [4 /*yield*/, TicketgroupModel_1.TicketGroupsModel.toggleAdmin(data.nsp, data.group_name, data.email, data.value)];
            case 1:
                group = _a.sent();
                if (group) {
                    res.send({ status: 'ok', group: group });
                }
                else {
                    res.send({ status: 'error', msg: 'Toggle admin error', data: data });
                }
                return [3 /*break*/, 3];
            case 2:
                err_38 = _a.sent();
                console.log('Error in toggle admin');
                console.log(err_38);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/setGroupAutoAssign', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, group, err_39;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                data = req.body;
                return [4 /*yield*/, TicketgroupModel_1.TicketGroupsModel.SetAutoAssign(data.nsp, data.group_name, data.auto_assign)];
            case 1:
                group = _a.sent();
                if (!(group && group.value)) return [3 /*break*/, 3];
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'groupChanges', nsp: data.nsp, roomName: [agentModel_1.Agents.NotifyAll()], data: { status: 'ok' } })];
            case 2:
                _a.sent();
                res.send({ status: 'ok', group: group.value });
                return [3 /*break*/, 4];
            case 3:
                res.send({ status: 'error' });
                _a.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                err_39 = _a.sent();
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
// router.post('/setICONNGroupAuto', async (req, res) => {
//     try {
//         let data = req.body;
//         let group = await TicketGroupsModel.setICONNGroupAuto(data.nsp, data.group_name, data.ICONNAuto);
//         if (group && group.value) {
//             await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'groupChanges', nsp: data.nsp, roomName: [Agents.NotifyAll()], data: { status: 'ok' } })
//             res.send({ status: 'ok', group: group.value })
//         } else {
//             res.send({ status: 'error' })
//         }
//     } catch (err) {
//     }
// });
router.post('/importSaveSettings', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data_26, promises, err_40;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                data_26 = req.body;
                promises = [];
                promises = promises.concat(data_26.dataArray.map(function (res) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, TicketgroupModel_1.TicketGroupsModel.importSaveSettings(data_26.nsp, res.group_name, res.unEntertainedTime, res.assignmentLimit, res.fallbackLimitExceed, res.fallbackNoShift, res.unAvailibilityHours, res.enabled)];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); }));
                return [4 /*yield*/, Promise.all(promises).then(function (val) {
                        __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'groupChanges', nsp: data_26.nsp, roomName: [agentModel_1.Agents.NotifyAll()], data: { status: 'ok' } });
                        res.send({ status: 'ok', response: data_26.myData });
                    })];
            case 1:
                _a.sent();
                return [3 /*break*/, 3];
            case 2:
                err_40 = _a.sent();
                console.log(err_40);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/saveGeneralSettings', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, group, err_41;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                data = req.body;
                return [4 /*yield*/, TicketgroupModel_1.TicketGroupsModel.saveGeneralSettings(data.nsp, data.group_name, data.settings)];
            case 1:
                group = _a.sent();
                if (!(group && group.value)) return [3 /*break*/, 3];
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'groupChanges', nsp: data.nsp, roomName: [agentModel_1.Agents.NotifyAll()], data: { status: 'ok' } })];
            case 2:
                _a.sent();
                res.send({ status: 'ok' });
                return [3 /*break*/, 4];
            case 3:
                res.send({ status: 'error' });
                _a.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                err_41 = _a.sent();
                console.log(err_41);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
/* #endregion */
/* #region  Signature */
router.post('/saveSignature', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, savedSignature, err_42;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                data = req.body;
                return [4 /*yield*/, ticketsModel_1.Tickets.EmailSignature(data.header, data.footer, data.email)];
            case 1:
                savedSignature = _a.sent();
                if (savedSignature) {
                    res.send({ status: 'ok', savedSignature: savedSignature.ops[0] });
                }
                else {
                    res.send({ status: 'error' });
                }
                return [3 /*break*/, 3];
            case 2:
                err_42 = _a.sent();
                console.log(err_42);
                console.log('Error in adding ticket sign');
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/updateSignature', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, updatedSignature, err_43;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                data = req.body;
                data.lastModified = new Date().toISOString();
                return [4 /*yield*/, ticketsModel_1.Tickets.UpdateSignature(data.header, data.footer, data.id, data.lastModified, data.email)];
            case 1:
                updatedSignature = _a.sent();
                if (updatedSignature && updatedSignature.value) {
                    res.send({ status: 'ok', updatedSignature: updatedSignature.value });
                }
                else {
                    res.send({ status: 'error' });
                }
                return [3 /*break*/, 3];
            case 2:
                err_43 = _a.sent();
                console.log(err_43);
                console.log('Error in updating ticket sign');
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/deleteSign', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, signs, err_44;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                data = req.body;
                return [4 /*yield*/, ticketsModel_1.Tickets.deleteSign(data.signId, data.email)];
            case 1:
                signs = _a.sent();
                if (signs) {
                    res.send({ status: 'ok' });
                }
                else {
                    res.send({ status: 'error' });
                }
                return [3 /*break*/, 3];
            case 2:
                err_44 = _a.sent();
                console.log(err_44);
                console.log('Error in deleting ticket sign');
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/setStatus', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data_27, ticketlog, fetchedTicket, result_1, assignedTo, watchers, err_45;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 13, , 14]);
                if (!!req.body.id) return [3 /*break*/, 1];
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 12];
            case 1:
                res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
                res.header('Expires', '-1');
                res.header('Pragma', 'no-cache');
                data_27 = req.body;
                ticketlog = ticketEnums_1.ComposedTicketENUM(ticketEnums_1.TicketLogMessages.UPDATE_STATUS, { value: data_27.status, by: data_27.email });
                return [4 /*yield*/, ticketsModel_1.Tickets.InsertStatus(data_27.id, data_27.nsp, data_27.status, ticketlog)];
            case 2:
                fetchedTicket = _a.sent();
                if (!(fetchedTicket && fetchedTicket.value)) return [3 /*break*/, 11];
                res.send({ status: 'ok', ticket: fetchedTicket, ticketlog: ticketlog });
                result_1 = fetchedTicket.value;
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data_27.nsp, roomName: ['ticketAdmin'], data: { tid: result_1._id, ticket: result_1 } })];
            case 3:
                _a.sent();
                if (!result_1.group) return [3 /*break*/, 5];
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data_27.nsp, roomName: [result_1.group], data: { tid: result_1._id, ticket: result_1 } })];
            case 4:
                _a.sent();
                _a.label = 5;
            case 5:
                if (!result_1.assigned_to) return [3 /*break*/, 8];
                return [4 /*yield*/, sessionsManager_1.SessionManager.getAgentByEmail(data_27.nsp, result_1.assigned_to)];
            case 6:
                assignedTo = _a.sent();
                if (!assignedTo) return [3 /*break*/, 8];
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data_27.nsp, roomName: [assignedTo._id], data: { tid: result_1._id, ticket: result_1 } })];
            case 7:
                _a.sent();
                _a.label = 8;
            case 8:
                if (!result_1.watchers) return [3 /*break*/, 10];
                return [4 /*yield*/, sessionsManager_1.SessionManager.getOnlineWatchers(data_27.nsp, result_1.watchers)];
            case 9:
                watchers = _a.sent();
                if (watchers && watchers.length) {
                    if (result_1.assigned_to)
                        watchers = watchers.filter(function (x) { return x != result_1.assigned_to; });
                    watchers.map(function (watcher) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'updateTicketProperty', nsp: data_27.nsp, roomName: [watcher._id], data: { tid: result_1._id, ticket: result_1 } })];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                }
                _a.label = 10;
            case 10: return [3 /*break*/, 12];
            case 11:
                res.send({ status: 'error' });
                _a.label = 12;
            case 12: return [3 /*break*/, 14];
            case 13:
                err_45 = _a.sent();
                res.status(401).send('Invalid Request!');
                console.log(err_45);
                console.log('Error in adding ticket tag');
                return [3 /*break*/, 14];
            case 14: return [2 /*return*/];
        }
    });
}); });
router.post('/toggleSign', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, lastModified, signs, err_46;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                data = req.body;
                lastModified = '';
                lastModified = new Date().toISOString();
                return [4 /*yield*/, ticketsModel_1.Tickets.toggleSign(data.email, data.signId, data.check, lastModified)];
            case 1:
                signs = _a.sent();
                if (signs && signs.value) {
                    res.send({ status: 'ok', signs: signs.value });
                }
                return [3 /*break*/, 3];
            case 2:
                err_46 = _a.sent();
                console.log(err_46);
                console.log('Error in toggling ticket sign');
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/getSignatures', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, signs, err_47;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                data = req.body;
                if (!data.email)
                    res.status(401).send('Invalid Request!');
                return [4 /*yield*/, ticketsModel_1.Tickets.getSign(data.email)];
            case 1:
                signs = _a.sent();
                if (signs && signs.length) {
                    res.send({ status: 'ok', signs: signs });
                }
                else {
                    res.send({ status: 'error', msg: 'Cannot get signs' });
                }
                return [3 /*break*/, 3];
            case 2:
                err_47 = _a.sent();
                console.log(err_47);
                console.log('Error in getting signatures');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/* #endregion */
router.post('/getTeamsByNSP', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, teams, error_31;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                data = req.body;
                if (!data.nsp || !data.email)
                    res.status(401).send('Invalid Request!');
                return [4 /*yield*/, teamsModel_1.TeamsModel.getTeams(data.nsp)];
            case 1:
                teams = _a.sent();
                if (teams) {
                    res.send({ status: 'ok', teams: teams });
                }
                else {
                    res.send({ status: 'error' });
                }
                return [3 /*break*/, 3];
            case 2:
                error_31 = _a.sent();
                console.log(error_31);
                console.log('Error in get teams by nsp');
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/getSanGroupNames', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var groups;
    return __generator(this, function (_a) {
        try {
            groups = ['UK Inquires', 'INB MACHINERY', 'INB OTHER MKT (NIGHT)', 'INB TRUCK DAY (GROUP A)', 'INB TRUCK DAY (GROUP B)', 'INB TRUCK DAY (GROUP C)', 'INB TRUCK DAY (TAGGED) LMs', 'INB TRUCK NIGHT (GROUP E)', 'INB TRUCK NIGHT (TAGGED) LMS', 'INB TRUCK NIGHT(GROUP D)', 'SBT UAE INFORMATION - IN HOUSE', 'JAPAN IT HELPDESK', 'Korea Operations', 'China Operations', 'USA Operations', 'Germany Operations', 'Singapore Operations', 'Australia Operations', 'South Africa Operations', 'Collection Team', 'Collection Night Team', 'Collection Myanmar', 'PK Inbound Sales'];
            if (groups) {
                res.send({ status: 'ok', groups: groups });
            }
            else {
                res.send({ status: 'error', groups: [] });
            }
        }
        catch (error) {
            console.log(error);
            console.log('Error in getSanGroupNames');
            res.status(401).send('Invalid Request!');
        }
        return [2 /*return*/];
    });
}); });
router.post('/getAgentsAgainstUser', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, groups, agents, err_48;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                data = req.body;
                if (!data.nsp || !data.email)
                    res.status(401).send('Invalid Request!');
                return [4 /*yield*/, TicketgroupModel_1.TicketGroupsModel.GetGroupsAgainstAgent(data.nsp, data.email)];
            case 1:
                groups = _a.sent();
                if (!groups) return [3 /*break*/, 3];
                return [4 /*yield*/, TicketgroupModel_1.TicketGroupsModel.getAgentsAgainstGroupNotExcluded(data.nsp, groups)];
            case 2:
                agents = _a.sent();
                res.send({ status: 'ok', agents: agents });
                return [3 /*break*/, 4];
            case 3:
                res.send({ status: 'error', msg: 'Group list not defined!' });
                _a.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                err_48 = _a.sent();
                console.log(err_48);
                console.log('Error in get agents against group');
                res.status(401).send('Invalid Request!');
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
router.post('/getAgentsByUsername', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, agents, error_32;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                data = req.body;
                return [4 /*yield*/, agentModel_1.Agents.getAgentsByUsername(data.nsp, data.username)];
            case 1:
                agents = _a.sent();
                if (agents && agents.length) {
                    res.send({ status: 'ok', agents: agents });
                }
                else {
                    res.send({ status: 'error' });
                }
                return [3 /*break*/, 3];
            case 2:
                error_32 = _a.sent();
                console.log(error_32);
                console.log('Error in getting agents against role');
                res.status(401).send("Invalid Request!");
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/abc', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var ticket, data;
    return __generator(this, function (_a) {
        console.log("api abc hit");
        ticket = {
            _id: '5ef1dec21eed543918676626',
            visitor: {
                name: "fahad"
            },
            subject: "hello123",
            clientID: "7YYNU"
        };
        data = [
            {
                email: 'mufahad9213@sbtjapan.com', assigned: '3', role: 'agent', lastLogin: '03/16/2020 11:03 AM'
            }
            // {email:'fahad.ansari88@yahoo.com',                assigned:'30'  ,     role:'agent'},
            // { email: 'rabi.fatima17@yahoo.com' },
            // {email:'fahad.ansari88@yahoo.com',                assigned:'30'  ,     role:'agent',                      lastLogin:'03/15/2020 11:03 AM'}
        ];
        // let ticketassigneddate = "05/14/2020";
        // // let data = [
        // //     { email: 'abdyvaliev2040@sbtjapan.com', assigned: '3', lastLogin: '0' },
        // //     { email: 'abidhassan9134@sbtjapan.com', assigned: '1', lastLogin: '05/12/2020 12:01 PM' },
        // //     { email: 'abiya9912@sbtjapan.com', assigned: '2', lastLogin: '05/13/2020 00:45 AM' },
        // //     { email: 'zainmed95617@sbtjapan.com', assigned: '2', lastLogin: '05/04/2020 12:15 PM' },
        // //     { email: 'zeekhan9604@sbtjapan.com', assigned: '7', lastLogin: '05/13/2020 02:05 AM' },
        // //     { email: 'zhumabekov2078@sbtjapan.com', assigned: '1', lastLogin: '04/30/2020 09:54 AM' },
        // //     { email: 'zia9892@sbtjapan.com', assigned: '3', lastLogin: '04/28/2020 13:41 PM' },
        // //     { email: 'zktushar4524@sbtjapan.com', assigned: '3', lastLogin: '05/10/2020 18:10 PM' },
        // //     { email: 'zohaib9267@sbtjapan.com', assigned: '1', lastLogin: '05/13/2020 16:19 PM' },
        // //     { email: 'zuuddin9908@sbtjapan.com', assigned: '9', lastLogin: '05/13/2020 16:24 PM' },
        // //     { email: 'zyambo@sbtjapan.com', assigned: '2', lastLogin: '04/09/2020 13:16 PM' }
        // // ];
        // let e = {};
        // let f: any = [];
        data.forEach(function (d, index) { return __awaiter(void 0, void 0, void 0, function () {
            var message;
            return __generator(this, function (_a) {
                message = '<p>Dear ' + ticket.visitor.name + ',</p>'
                    + '<p>We would like to acknowledge that we have received your request and a ticket has been created with ID - <b>' + ticket.clientID + '</b>.</p>'
                    + '<p>A support representative will be viewing your request and will send you a personal response. (usually within 2 hours).</p>'
                    + '<p>Ticket Subject : <b>' + ticket.subject + '</b></p>'
                    + '<p>Ticket Link: https://app.beelinks.solutions/tickets/ticket-view/' + ticket._id + '</p>'
                    + '<p>Thankyou for your patience.</p>';
                emailService_1.EmailService.SendEmail({
                    action: 'SendSanEmails',
                    msg: message,
                    to: d.email,
                    from: 'support@beelinks.solutions'
                }, 5, true);
                return [2 /*return*/];
            });
        }); });
        // console.log(e);
        // console.log(f);
        res.send({ status: "ok" });
        return [2 /*return*/];
    });
}); });
router.post('/res', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    function asyncFunction(email) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log("Hit");
                return [2 /*return*/, request.post('http://iconnapifunc01-beelinks-staging.iconn-asestaging01.p.azurewebsites.net/api/GetCustomerDetail?code=FAHyfi7kJqKD84O0MXs75GAoy7qh/ObKHnH6qlkN3qr1aI6OXbVCKg==', {
                        json: {
                            "MailAddress": email,
                            "PhoneNumber": '',
                            "StockId": '',
                            "CustomerId": '',
                        }
                    }, function (error, res, body) {
                        if (error) {
                            console.error(error);
                            return;
                        }
                        else {
                            console.log("success");
                            console.log("statusCode: " + res.statusCode);
                        }
                        // console.log(body)
                    })];
            });
        });
    }
    var data, updatedList;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                data = [
                    { email: 'star.pekachu@gmail.com' },
                    { email: 'rejon.2013@gmail.com' },
                    { email: 'nrrumi2000@gmail.com' },
                    { email: 'deasinmotors@gmail.com' },
                    { email: 'monjur_2k3@yahoo.com' },
                    { email: 'tapiwajmkandawire@gmail.com' },
                    { email: 'mitunshil747@gmail.com' },
                    { email: 'majakirhossen24@gmail.com' },
                    { email: 'tschwehr1@gmail.com' },
                    { email: 'touhid.jcm@gmail.com' },
                    { email: 'palmainjapan@gmail.com' },
                    { email: 'sagorhowlader5208@gmail.com' },
                    { email: 'sean@alive-web.co.jp' },
                    { email: 'mongolzitr@gmail.com' },
                    { email: 'rozanmd20@gmail.com' },
                    { email: 'imrant146@gmail.com' },
                    { email: 'eriko.kaneoka@zigexn.co.jp' },
                    { email: 'victorawili@yandex.com' },
                    { email: 'dosjan@yahoo.com' },
                    { email: 'tmazzalwayzz@yahoo.com' },
                    { email: 'ariful8422@gmail.com' },
                    { email: 'ajith.liyanagejpn@gmail.com' },
                    { email: 'imrul69@gmail.com' },
                    { email: 'haralds.degis@gmail.com' },
                    { email: 'khaingkhaingkw@gmail.com' },
                    { email: 'sgodsonamamoo@gmail.com' },
                    { email: 'zobo361@gmail.com' },
                    { email: 'snyamuranga@unicef.org' },
                    { email: 'nyamkhuu1130@gmail.com' },
                    { email: 'hasnainsiddiqui.siddiqui@gmail.com' },
                    { email: 'sahil_78600@yahoo.com' },
                    { email: 'sani4161@yahoo.com' },
                    { email: 'syedahsanshah99@gmail.com' },
                    { email: 'mujtabaabdulkhaliq@hotmail.com' },
                    { email: 'ahsanullahkhan.mkt@gmail.com' },
                    { email: 'maqsoodqurtaba@gmail.com' },
                    { email: 'ahadkhan321@gmail.com' },
                    { email: 'aleem605@yahoo.com' },
                    { email: 'jam.yasin_j@rocketmail.com' },
                    { email: 'zeeshan.oai@gmail.com' },
                    { email: 'noman.jahangir@hotmail.com' },
                    { email: 'moss786@live.com' },
                    { email: 'asad.shakil@meezanbank.com' },
                    { email: 'babarali_87@ymail.com' },
                    { email: 'f.ullah99@gmail.com' },
                    { email: 'iasiddiqui130310@gmail.com' },
                    { email: 'altaf.iqbal@yahoo.com' },
                    { email: 'fexan@live.com' },
                    { email: 'fakharejaz25@yahoo.com' },
                    { email: 'muhammadwaqqaas@gmail.com' },
                    { email: 'qmr67kar@gmail.com' },
                    { email: 'touseef.ahsan@yahoo.com' },
                    { email: 'bajwak7@hotmail.com' },
                    { email: 'frozen_fire@hotmail.com' },
                    { email: 'shoaibmemon21@gmail.com' },
                    { email: 'aamir.siddiqui95@gmail.com' },
                    { email: 'royalworks@hotmail.com' },
                    { email: 'm_jamshaid121@yahoo.com' },
                    { email: 'humayun44@yahoo.com' },
                    { email: 'mr_rashid_hussain@yahoo.com' },
                    { email: 'chuvoh@hotmail.com' },
                    { email: 'haris.sadiq@gmail.com' },
                    { email: 'muhammad.baig@mail.com' },
                    { email: 'fahad.cma@gmail.com' },
                    { email: 'bilalubit5@gmail.com' },
                    { email: 'jahanzaib.chandio@lcbizltd.com' },
                    { email: 'junaid.shb@gmail.com' },
                    { email: 'usama.sukhera_343@hotmail.com' },
                    { email: 'zabih_niazi91@hotmail.com' },
                    { email: 'shaikhzeeshan1989@gmail.com' },
                    { email: 'srizshaikh@gmail.com' },
                    { email: 'atif_jamil_s@hotmail.com' },
                    { email: 'waheedroyal87@yahoo.com' },
                    { email: 'rooshan87@yahoo.com' },
                    { email: 'risk-taker92@hotmail.com' },
                    { email: 'rehan.usman19@gmail.com' },
                    { email: 'riazshah7867@yahoo.com' },
                    { email: 'farhansarkar@gmail.com' },
                    { email: 'junejo@mail.com' },
                    { email: 'juju649556@yahoo.com' },
                    { email: 'muhamad.hassan13@gmail.com' },
                    { email: 'raselansari@gmail.com' },
                    { email: 'shedding_tearz@hotmail.com' },
                    { email: 'hami_virgo@hotmail.com' },
                    { email: 'laiglet@yahoo.fr' },
                    { email: 'alifaisal32@hotmail.com' },
                    { email: 'jaq_cs@hotmail.com' },
                    { email: 'jerjab@aol.com' },
                    { email: 'seerat123@gmail.com' },
                    { email: 'saif-ul-islam@hotmail.com' },
                    { email: 'armaghan_saad@hotmail.com' },
                    { email: 'ghani64@ymail.com' },
                    { email: 'ahtesham.arshad1@gmail.com' },
                    { email: 'najafhaider55@hotmail.com' },
                    { email: 'hussain_aquil@hotmail.com' },
                    { email: 'engr.mazhar03@gmail.com' },
                    { email: 'najafali_rizvi@yahoo.com' },
                    { email: 'soulkatcher@hotmail.com' },
                    { email: 'tariqawan77@gmail.com' },
                    { email: 'drasif_mansoori@hotmail.com' },
                    { email: 'fam697@gmail.com' },
                    { email: 'umairhanif@hotmail.com' },
                    { email: 'nfarooq01@gmail.com' },
                    { email: 'asaamirshaikh1@gmail.com' },
                    { email: 'guitarixt@live.com' },
                    { email: 'saad9265@sbtjapan.com' },
                    { email: 'hamzaj1988@gmail.com' },
                    { email: 'noumanaslam@outlook.com' },
                    { email: 'danish2002607@hotmail.com' },
                    { email: 'lookingaone@gmail.com' },
                    { email: 'shaharyar_88@hotmail.com' },
                    { email: 'dxb3579@gmail.com' },
                    { email: 'muhammadadilj@yahoo.com' }
                ];
                updatedList = data.map(function (msg, index) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, asyncFunction(msg.email)];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [4 /*yield*/, Promise.all(updatedList).then(function (val) { res.send({ status: "ok" }); })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
router.post('/def', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var emails, htmlTemplate;
    return __generator(this, function (_a) {
        console.log("api def hit");
        emails = ['mufahad9213@sbtjapan.com'];
        htmlTemplate = "<p>Respectfully,</p>\n                                <p>This is to inform you for the weekly report of agents from <b> 26th April to 2nd May 2020 </b> that are logging into the Beelinks, Following is the stats:</p>\n                                <p>*If 0 in (last login) means they haven't logged in from <b> 1st April to 4th May 2020.</b></p>\n                                <p>*If 0 in (login frequency) means they haven't logged in from <b> 26th April to 2nd May 2020.</b></p>\n                                <table border=\"1\" style=\"border-collapse: collapse; width: 100%;\">\n                                <tbody></tbody>\n                                </table>\n                                <table border=\"1\" style=\"border-collapse: collapse; width: 100%;\">\n                                <tbody>\n                                <tr>\n                                <th style=\"width: 108px;\">Agent Email</th>\n                                <th style=\"width: 80px;\">Role</th>\n                                <th style=\"width: 100px;\">Frequency of Logins (Weekly)</th>\n                                <th style=\"width: 80px;\">Tickets Assigned (Weekly)</th>\n                                <th style=\"width: 108px;\">Last Login during this week</th>\n                                </tr>\n                                ";
        // data.forEach(d => {
        //     d.email = d.email.trim();
        //     d.assigned = d.assigned.trim();
        //     d.role = d.role.trim();
        //     d.lastLogin = d.lastLogin.trim();
        //     htmlTemplate += `
        //      <tr><td style="width: 108px;">${d.email} </td>
        //      <td style="width: 80px; text-align: center;">${d.role} </td>
        //      <td style="width: 100px; text-align: center;">${d.freq} </td>
        //      <td style="width: 80px; text-align: center;">${d.assigned} </td>
        //      <td style="width: 108px;">${d.lastLogin}</td>
        //      </tr>`;
        // });
        htmlTemplate += "\n                    </tbody>\n                    </table>\n                    <br>\n                    <p>Best regards,</p>\n                    <p>Support Team.</p>";
        emailService_1.EmailService.SendEmail({
            action: 'SendCCEmails',
            msg: htmlTemplate,
            from: 'support@beelinks.solutions',
            to: emails,
        }, 5, true);
        res.send({ status: "ok" });
        return [2 /*return*/];
    });
}); });
// ,'mufakhruddin9417@sbtjapan.com'
router.post('/ghi', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("api ghi hit");
                return [4 /*yield*/, Utils_1.Utils.GroupAutoAssign()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
// router.get('/assignTicketCustom', async (req, res) => {
//     let ticketDetails = [
//         {clientID: '4G5CB', salesPerson: 'HAMNASLAM',               group: 'Pakistan Inquires'                 },
//         {clientID: 'kYFCp', salesPerson: 'SHAGUFTA',                group: 'Lesotho Inquires'                },
//         {clientID: 'jD8mU', salesPerson: 'ALEEMUDDIN',              group: 'Pakistan Inquires'                  },
//         {clientID: 'XmzeH', salesPerson: 'MARQAMAR',                group: 'Swaziland Inquires'                },
//         {clientID: 'R81Fr', salesPerson: 'FARHID',                  group: 'South Africa Inquires'              },
//         {clientID: 'xVCT6', salesPerson: 'MENDOZA',                 group: 'Paraguay Inquires'               },
//         {clientID: 'yRiSl', salesPerson: 'REMSHA',                  group: 'Malawi Inquires'              },
//         {clientID: 'Y6qSD', salesPerson: 'NAYIM',                   group: 'Botswana Inquires'             },
//         {clientID: 'RJTyl', salesPerson: 'MTSHOAIB',                group: 'TURKS AND CAICOS (CARIB)'                },
//         {clientID: 'fAaxI', salesPerson: 'ABIDHASSAN',              group: 'Pakistan Inquires'                  },
//         {clientID: '4QRW2', salesPerson: 'PARIJAT',                 group: 'Botswana Inquires'               },
//         {clientID: 'Y7giH', salesPerson: 'RAZMANSOOR',              group: 'TURKS AND CAICOS (CARIB)'                  },
//         {clientID: 'gpv6I', salesPerson: 'ABIHA',                   group: 'CONGO Inquries'             },
//         {clientID: 'vy9z8', salesPerson: 'SMTALHA',                 group: 'ENGLAND (EUROPE)'               },
//         {clientID: 'vt77e', salesPerson: 'KIYINGI',                 group: 'Uganda Inquires'               },
//         {clientID: 'XWf1A', salesPerson: 'NAFLAN',                  group: 'BAHAMAS (CARIB)'              },
//         {clientID: 'l7UbS', salesPerson: 'MBILAL',                  group: 'SURINAME (CARIB)'              },
//         {clientID: 'TbcIm', salesPerson: 'USAMALI',                 group: 'Zambia Inquires'               },
//         {clientID: '9Y9cN', salesPerson: 'RAMEESA',                 group: 'CYPRUS (EUROPE)'               },
//         {clientID: 'VGWSu', salesPerson: 'MHAMRIAZ',                group: 'Malawi Inquires'                },
//         {clientID: 'PvCNB', salesPerson: 'DILOSHAN',                group: 'Malawi Inquires'                },
//         {clientID: '52kbn', salesPerson: 'MIHSAN',                  group: 'Tanzania Inquires'              },
//         {clientID: 'ynEtT', salesPerson: 'NMISAL',                  group: 'BAHAMAS (CARIB)'              },
//         {clientID: '9Wyd9', salesPerson: 'SAADMANI',                group: 'Tanzania Inquires'                },
//         {clientID: 'G2vRA', salesPerson: 'KHARLYN',                 group: 'Kenya Inquires'               },
//         {clientID: 'qDC9C', salesPerson: 'ASIMKHAN',                group: 'Uganda Inquires'                },
//         {clientID: 'zr2Qz', salesPerson: 'SHAPERVAIZ',              group: 'Uganda Inquires'                  },
//         {clientID: 'PSOfO', salesPerson: 'MMOHKHAN',                group: 'JAMAICA (CARIB)'                },
//         {clientID: 'Hs79K', salesPerson: 'MUHAMFAIZAN',             group: 'Pakistan Inquires'                   },
//         {clientID: 's0S05', salesPerson: 'HASVOHRA',                group: 'TURKS AND CAICOS (CARIB)'                },
//         {clientID: 'CaOxF', salesPerson: 'JOSEPHM',                 group: 'Uganda Inquires'               },
//         {clientID: '0Shu6', salesPerson: 'MOEEZKHAN',               group: 'Botswana Inquires'                 },
//         {clientID: 'sqCIc', salesPerson: 'YAKTA',                   group: 'West Africa English'             },
//         {clientID: 'VMIZ0', salesPerson: 'SKHALIRAZA',              group: 'BAHAMAS (CARIB)'                  },
//         {clientID: 'tR7HX', salesPerson: 'MAHALAM',                 group: 'UAE Inquires'               },
//         {clientID: 'Ti3H7', salesPerson: 'ALIASSHAH',               group: 'TURKS AND CAICOS (CARIB)'                 },
//         {clientID: 'h1wHk', salesPerson: 'SADALTAF',                group: 'CYPRUS (EUROPE)'                },
//         {clientID: '3LP17', salesPerson: 'ARMUGHAL',                group: 'Tanzania Inquires'                },
//         {clientID: 'HUBUX', salesPerson: 'ABWAHAB',                 group: 'West Africa English'               },
//         {clientID: 'S07LA', salesPerson: 'MMOHAIMIN',               group: 'Mozambique Inquires'                 },
//         {clientID: 'mRoCW', salesPerson: 'OKERO',                   group: 'Kenya Inquires'             },
//         {clientID: 'Y7Kb8', salesPerson: 'MSHEHERYASIF',            group: 'South Sudan'                    },
//         {clientID: 'YyFjc', salesPerson: 'BAZAI',                   group: 'Tanzania Inquires'             },
//         {clientID: 'loDXu', salesPerson: 'FAIZANALI',               group: 'CONGO Inquries'                 },
//         {clientID: 'CxxfT', salesPerson: 'MDSOURAV',                group: 'Malawi Inquires'                },
//         {clientID: 'aLHgk', salesPerson: 'IHSANA',                  group: 'Tanzania Inquires'              },
//         {clientID: 'SqjEH', salesPerson: 'ROBIN',                   group: 'Mozambique Inquires'             },
//         {clientID: '2thc9', salesPerson: 'FOYSAL',                  group: 'Zambia Inquires'              },
//         {clientID: 'dhKyW', salesPerson: 'RIFKA',                   group: 'Malawi Inquires'             },
//         {clientID: 'HLNU8', salesPerson: 'DARYL',                   group: 'Malawi Inquires'             },
//         {clientID: 'FukTL', salesPerson: 'NIYOMI',                  group: 'Malawi Inquires'              },
//         {clientID: '5A0OU', salesPerson: 'AHAMED',                  group: 'Tanzania Inquires'              },
//         {clientID: 'U6Eny', salesPerson: 'ALZAKY',                  group: 'Mozambique Inquires'              },
//         {clientID: 'MJogU', salesPerson: 'JUEL',                    group: 'Kenya Inquires'            },
//         {clientID: 'deFTm', salesPerson: 'AEKUALA',                 group: 'Mozambique Inquires'               },
//         {clientID: '6N79P', salesPerson: 'AMINAL',                  group: 'Tanzania Inquires'              },
//         {clientID: 'IEbHZ', salesPerson: 'ZAKARIAH',                group: 'Botswana Inquires'                },
//         {clientID: 'p6Pb5', salesPerson: 'MUFEES',                  group: 'Zambia Inquires'              },
//         {clientID: 'Gku8S', salesPerson: 'RAHAL',                   group: 'Kenya Inquires'             },
//         {clientID: '3X0OJ', salesPerson: 'HAKEEM',                  group: 'Mozambique Inquires'              },
//         {clientID: '0Gj7B', salesPerson: 'KONOKUULU',               group: 'CYPRUS (EUROPE)'                 },
//         {clientID: 'w4vGz', salesPerson: 'AMJALI',                  group: 'UAE Inquires'              },
//         {clientID: 'bXjmY', salesPerson: 'NAFEEL',                  group: 'Mozambique Inquires'              },
//         {clientID: '9p1AQ', salesPerson: 'ASIFR',                   group: 'Malawi Inquires'             },
//         {clientID: 'L3s3J', salesPerson: 'SHINDE',                  group: 'Zambia Inquires'              },
//         {clientID: '9obuY', salesPerson: 'TANZEEL',                 group: 'BAHAMAS (CARIB)'               },
//         {clientID: 'JGLyH', salesPerson: 'NIDHARSHAN',              group: 'Kenya Inquires'                  },
//         {clientID: 'YyMC4', salesPerson: 'DILUKSHAN',               group: 'BAHAMAS (CARIB)'                 },
//         {clientID: 'q9F5i', salesPerson: 'MDASHIQ',                 group: 'Tanzania Inquires'               },
//         {clientID: 'vYfAg', salesPerson: 'MOLOI',                   group: 'Botswana Inquires'             },
//         {clientID: 'IPB8w', salesPerson: 'MOLOI',                   group: 'Botswana Inquires'             },
//         {clientID: 'Jo7js', salesPerson: 'KISHANTHAN',              group: 'Lesotho Inquires'                  },
//         {clientID: 'u88Oi', salesPerson: 'SANJAY',                  group: 'Malawi Inquires'              },
//         {clientID: 'rxAKR', salesPerson: 'LEOMAMBRU',               group: 'Dominican Republic Inquires'                 },
//         {clientID: 'jC0mZ', salesPerson: 'RANANOMAN',               group: 'Mozambique Inquires'                 },
//         {clientID: 'VlCqE', salesPerson: 'SHAEYMA',                 group: 'IRELAND (EUROPE)'               },
//         {clientID: 'cAEQK', salesPerson: 'KIKOMEKO',                group: 'Uganda Inquires'                },
//         {clientID: 'QFwKq', salesPerson: 'SHABHUSSAIN',             group: 'CONGO Inquries'                   },
//         {clientID: '8iQ9d', salesPerson: 'ASRAZA',                  group: 'Malawi Inquires'              },
//         {clientID: 'zOw9K', salesPerson: 'MISHAEL',                 group: 'Kenya Inquires'               },
//         {clientID: 'nLdqe', salesPerson: 'TALAHMED',                group: 'UAE Inquires'                },
//         {clientID: 'BOXNJ', salesPerson: 'ALLOCEN',                 group: 'Uganda Inquires'               },
//         {clientID: 'hz4FE', salesPerson: 'MMSALEEM',                group: 'Malawi Inquires'                },
//         {clientID: 'xbImy', salesPerson: 'SHAHRIAZ',                group: 'Mozambique Inquires'                },
//         {clientID: 'k5W7E', salesPerson: 'SAMSON',                  group: 'Kenya Inquires'              },
//         {clientID: 'XyLd7', salesPerson: 'JCHARLES',                group: 'Malawi Inquires'                },
//         {clientID: 'UtaYw', salesPerson: 'RALP',                    group: 'Kenya Inquires'            },
//         {clientID: 'd2V05', salesPerson: 'MBHOSSAIN',               group: 'BAHAMAS (CARIB)'                 },
//         {clientID: 'hye6X', salesPerson: 'MGISLAM',                 group: 'Kenya Inquires'               },
//         {clientID: 'mGerU', salesPerson: 'MGISLAM',                 group: 'Kenya Inquires'               },
//         {clientID: 'nwLWt', salesPerson: 'SAYEDSAKIB',              group: 'Zambia Inquires'                  },
//         {clientID: 'eJLnW', salesPerson: 'TOUHIDUZZAM',             group: 'Tanzania Inquires'                   },
//         {clientID: 'moWFb', salesPerson: 'SYMAZEHRA',               group: 'BAHAMAS (CARIB)'                 },
//         {clientID: 'bmnL4', salesPerson: 'AJOY',                    group: 'Tanzania Inquires'            },
//         {clientID: 'BfmwF', salesPerson: 'KANYMETOVA',              group: 'CYPRUS (EUROPE)'                  },
//         {clientID: 'w7oF8', salesPerson: 'MHBHUIYA',                group: 'Kenya Inquires'                },
//         {clientID: 'Ot25K', salesPerson: 'TANZIR',                  group: 'Kenya Inquires'              },
//         {clientID: 'gyjXz', salesPerson: 'FSHABEENA',               group: 'Zambia Inquires'                 },
//         {clientID: 'h1ann', salesPerson: 'TANZIR',                  group: 'Kenya Inquires'              },
//         {clientID: 'G0glR', salesPerson: 'FSHABEENA',               group: 'Zambia Inquires'                 },
//         {clientID: 'aeyUb', salesPerson: 'USPERVEZ',                group: 'Malawi Inquires'                },
//         {clientID: 'wCDxu', salesPerson: 'QMOHTASHIM',              group: 'Malawi Inquires'                  },
//         {clientID: 'GQHPn', salesPerson: 'ZAIMUSTAFA',              group: 'Tanzania Inquires'                  },
//         {clientID: 'HWPJJ', salesPerson: 'BAIKURMAN',               group: 'CYPRUS (EUROPE)'                 },
//         {clientID: 'mAgDW', salesPerson: 'ARBERENALIEV',            group: 'CONGO Inquries'                    },
//         {clientID: 'FyJo2', salesPerson: 'MELV',                    group: 'Kenya Inquires'            },
//         {clientID: 'GfP2h', salesPerson: 'MISKATH',                 group: 'Uganda Inquires'               },
//         {clientID: '7LvTQ', salesPerson: 'RAHMANDUL',               group: 'Swaziland Inquires'                 },
//         {clientID: 'xWh03', salesPerson: 'SHEHMIRZA',               group: 'BAHAMAS (CARIB)'                 },
//         {clientID: '6CtH8', salesPerson: 'UMRIAZ',                  group: 'TRINIDAD (CARIB)'              },
//         {clientID: '5b45G', salesPerson: 'NARMKHAN',                group: 'Tanzania Inquires'                },
//         {clientID: 'rb5Fs', salesPerson: 'MUANASSID',               group: 'Malawi Inquires'                 },
//         {clientID: 'uKMOO', salesPerson: 'MMURIUKI',                group: 'Kenya Inquires'                },
//         {clientID: '6goBL', salesPerson: 'CHRIS',                   group: 'Kenya Inquires'             },
//         {clientID: 'YpVda', salesPerson: 'RILWANM',                 group: 'BAHAMAS (CARIB)'               },
//         {clientID: 'XpGaj', salesPerson: 'ASFANDYARM',              group: 'Malawi Inquires'                  },
//         {clientID: 'Zu7KD', salesPerson: 'NAVROZL',                 group: 'Zambia Inquires'               },
//         {clientID: '9DWRW', salesPerson: 'JESOOK',                  group: 'Lesotho Inquires'              },
//         {clientID: 'xwzKG', salesPerson: 'HAMYONUS',                group: 'Zambia Inquires'                },
//         {clientID: 'V1ZXS', salesPerson: 'AMMASROOR',               group: 'Zimbabwe Inquires'                 },
//         {clientID: 'Uk2Q2', salesPerson: 'MUHJAHANZAIB',            group: 'MAURITIUS (EUROPE)'                    },
//         {clientID: 'hQdAc', salesPerson: 'FAISHAFIQUE',             group: 'Uganda Inquires'                   },
//         {clientID: 'hracw', salesPerson: 'MEHNLAIQAT',              group: 'Malawi Inquires'                  },
//         {clientID: 'IAk0V', salesPerson: 'KAIZHAINAKOV',            group: 'TRINIDAD (CARIB)'                    },
//         {clientID: 'dWJgG', salesPerson: 'SUMALIKHAN',              group: 'Zambia Inquires'                  },
//         {clientID: 'NMXaj', salesPerson: 'AZAKHTAR',                group: 'Kenya Inquires'                },
//         {clientID: 'bufJ1', salesPerson: 'KALILANI',                group: 'CONGO Inquries'                },
//         {clientID: 'rFXkq', salesPerson: 'SASHEHPAR',               group: 'Tanzania Inquires'                 },
//         {clientID: 'Baw4o', salesPerson: 'TAHMIDKARIM',             group: 'Malawi Inquires'                   },
//         {clientID: 'sAcqI', salesPerson: 'RATRI',                   group: 'Tanzania Inquires'             },
//         {clientID: 'SKW2X', salesPerson: 'QAIMALI',                 group: 'MAURITIUS (EUROPE)'               },
//         {clientID: 'HA9E6', salesPerson: 'ZARAKKHAN',               group: 'GUYANA (CARIB)'                 },
//         {clientID: '8SVep', salesPerson: 'MUZASLAM',                group: 'Malawi Inquires'                },
//         {clientID: 'Itj1y', salesPerson: 'CNYEMBA',                 group: 'Zimbabwe Inquires'               },
//         {clientID: 'TsY0j', salesPerson: 'SALVE',                   group: 'Zimbabwe Inquires'             },
//         {clientID: 'y6Zjw', salesPerson: 'SYAKMAL',                 group: 'Malawi Inquires'               },
//         {clientID: 'UFZFz', salesPerson: 'MUBILSAEED',              group: 'BAHAMAS (CARIB)'                  },
//         {clientID: 'hcDI5', salesPerson: 'MOSHIURR',                group: 'SURINAME (CARIB)'                },
//         {clientID: 'aUs5s', salesPerson: 'MUNSIDDIQUI',             group: 'BAHAMAS (CARIB)'                   },
//         {clientID: 'f8c3H', salesPerson: 'MSLASKAR',                group: 'IRELAND (EUROPE)'                },
//         {clientID: 'pFdgp', salesPerson: 'SYMUAHSAN',               group: 'Kenya Inquires'                 },
//         {clientID: 'wv2vB', salesPerson: 'SAIQARIF',                group: 'Kenya Inquires'                },
//         {clientID: 'obJR6', salesPerson: 'MNHUDA',                  group: 'Oceania Inquires'              },
//         {clientID: 'IzIFv', salesPerson: 'MUFAKHKHAN',              group: 'UAE Inquires'                  },
//         {clientID: 'bb05K', salesPerson: 'PARTHA',                  group: 'ENGLAND (EUROPE)'              },
//         {clientID: 'VPvhb', salesPerson: 'SSRABIDI',                group: 'CONGO Inquries'                },
//         {clientID: 'YlXgL', salesPerson: 'IBRAPARKAR',              group: 'Botswana Inquires'                  },
//         {clientID: 'U1OWP', salesPerson: 'SALIFTIKHAR',             group: 'Zimbabwe Inquires'                   },
//         {clientID: '5589E', salesPerson: 'WAQRAEES',                group: 'Malawi Inquires'                },
//         {clientID: 'IqgQI', salesPerson: 'AMINISLAM',               group: 'West Africa English'                 },
//         {clientID: 'EATUi', salesPerson: 'TALSHAFIQ',               group: 'BAHAMAS (CARIB)'                 },
//         {clientID: 'q6yVc', salesPerson: 'MZUBAIR',                 group: 'TURKS AND CAICOS (CARIB)'               },
//         {clientID: 'lg6A1', salesPerson: 'KOUSHIK',                 group: 'Tanzania Inquires'               },
//         {clientID: 'nqr6X', salesPerson: 'ASSADRAS',                group: 'BAHAMAS (CARIB)'                },
//         {clientID: 'olwWt', salesPerson: 'SGITAU',                  group: 'Kenya Inquires'              },
//         {clientID: 'bHTe9', salesPerson: 'NADHAMEED',               group: 'Zambia Inquires'                 },
//         {clientID: 'HEjwP', salesPerson: 'LPAPIONA',                group: 'TRINIDAD (CARIB)'                },
//         {clientID: 'rcxLf', salesPerson: 'JKIRUKI',                 group: 'Kenya Inquires'               },
//         {clientID: '7Aghd', salesPerson: 'SYSANSHAHID',             group: 'CYPRUS (EUROPE)'                   },
//         {clientID: 'VavL2', salesPerson: 'KURMANOVZHAN',            group: 'MAURITIUS (EUROPE)'                    },
//         {clientID: '9dowl', salesPerson: 'XANDER',                  group: 'Zimbabwe Inquires'              },
//         {clientID: 'UKgTa', salesPerson: 'AWAZIZ',                  group: 'CONGO Inquries'              },
//         {clientID: 's2xPt', salesPerson: 'RRAZZAQ',                 group: 'Malawi Inquires'               },
//         {clientID: 'R3NNY', salesPerson: 'DANJUNEJO',               group: 'Malawi Inquires'                 },
//         {clientID: '0x4UH', salesPerson: 'IMMANGA',                 group: 'Tanzania Inquires'               },
//         {clientID: 'x0xzQ', salesPerson: 'SIVAKUMARAN',             group: 'Uganda Inquires'                   },
//         {clientID: 'RyiFs', salesPerson: 'JULIETH',                 group: 'Tanzania Inquires'               },
//         {clientID: 'e75Cv', salesPerson: 'RIYAZ',                   group: 'Zambia Inquires'             },
//         {clientID: 'Ii0Ei', salesPerson: 'JCHISUWO',                group: 'Malawi Inquires'                },
//         {clientID: 'ghsin', salesPerson: 'KAKHAN',                  group: 'Mozambique Inquires'              },
//         {clientID: '6a86d', salesPerson: 'AFSANA',                  group: 'Kenya Inquires'              },
//         {clientID: 'ymaJu', salesPerson: 'MAMUNBILLAH',             group: 'BAHAMAS (CARIB)'                   },
//         {clientID: 'lnCo5', salesPerson: 'ALIMALIK',                group: 'CONGO Inquries'                },
//         {clientID: 'smjdV', salesPerson: 'AYZAI',                   group: 'CONGO Inquries'             },
//         {clientID: 'tOKtE', salesPerson: 'SHUVO',                   group: 'UAE Inquires'             },
//         {clientID: 'Jz495', salesPerson: 'BABTARIQ',                group: 'BAHAMAS (CARIB)'                },
//         {clientID: 'srOpt', salesPerson: 'JEYSINTHUJAN',            group: 'BAHAMAS (CARIB)'                    },
//         {clientID: 'yCLeN', salesPerson: 'SOHZAFAR',                group: 'Zambia Inquires'                },
//         {clientID: 'WwwzR', salesPerson: 'ABMMAHFUZUR',             group: 'Kenya Inquires'                   },
//         {clientID: '8bZLT', salesPerson: 'AMMSIDDIQUI',             group: 'UAE Inquires'                   },
//         {clientID: '1X7CJ', salesPerson: 'TABINDA',                 group: 'South Sudan'               },
//         {clientID: 'kEh7j', salesPerson: 'FAIHASSAN',               group: 'Kenya Inquires'                 },
//         {clientID: '5kZSl', salesPerson: 'NOUSARWAR',               group: 'UAE Inquires'                 },
//         {clientID: 'fWjdj', salesPerson: 'MOHHASSAAN',              group: 'CONGO Inquries'                  },
//         {clientID: 'DNz0Y', salesPerson: 'SYEDAHSAN',               group: 'Zimbabwe Inquires'                 },
//         {clientID: 'IOBK3', salesPerson: 'RAFAYAKHTER',             group: 'Malawi Inquires'                   },
//         {clientID: 'dUvlT', salesPerson: 'DANMEMON',                group: 'Zimbabwe Inquires'                },
//         {clientID: 'Vb92A', salesPerson: 'VINCENT',                 group: 'BAHAMAS (CARIB)'               },
//         {clientID: 'ty0Fi', salesPerson: 'ISHUAH',                  group: 'Kenya Inquires'              },
//         {clientID: 'l7Aow', salesPerson: 'HASOOMRO',                group: 'Kenya Inquires'                },
//         {clientID: 'ncEm1', salesPerson: 'RASEDUZZAMAN',            group: 'Tanzania Inquires'                    },
//         {clientID: 'RViSI', salesPerson: 'MSSHAHID',                group: 'BAHAMAS (CARIB)'                },
//         {clientID: 'yne8G', salesPerson: 'KJISLAM',                 group: 'ENGLAND (EUROPE)'               },
//         {clientID: 'P6oNZ', salesPerson: 'SHARMINKHAN',             group: 'Kenya Inquires'                   },
//         {clientID: 'Rw1k2', salesPerson: 'KHAWNASEEM',              group: 'West Africa English'                  },
//         {clientID: 'yfmyP', salesPerson: 'MAYENG',                  group: 'Oceania Inquires'              },
//         {clientID: 'Sb3lC', salesPerson: 'SSALIKHAN',               group: 'CONGO Inquries'                 },
//         {clientID: '8Nv3E', salesPerson: 'ARNOLD',                  group: 'Zimbabwe Inquires'              },
//         {clientID: 'EBiOs', salesPerson: 'FGOMONDA',                group: 'Malawi Inquires'                },
//         {clientID: 'swfTJ', salesPerson: 'MINHAJHOS',               group: 'Zambia Inquires'                 },
//         {clientID: 'WslhR', salesPerson: 'JAVAN',                   group: 'BAHAMAS (CARIB)'             },
//         {clientID: 'JdUUI', salesPerson: 'DENNIS',                  group: 'Tanzania Inquires'              },
//         {clientID: 'sXGlW', salesPerson: 'USFAROOQ',                group: 'Malawi Inquires'                },
//         {clientID: 'dMLfp', salesPerson: 'OSAMAKHAN',               group: 'BAHAMAS (CARIB)'                 },
//         {clientID: '7OQWD', salesPerson: 'HADIQA',                  group: 'Zambia Inquires'              },
//         {clientID: 'x1WbR', salesPerson: 'KQURESHI',                group: 'Zambia Inquires'                },
//         {clientID: 'cpxDU', salesPerson: 'RIAZKHAN',                group: 'Kenya Inquires'                },
//         {clientID: '4yYkU', salesPerson: 'IMSALEEM',                group: 'Tanzania Inquires'                },
//         {clientID: 'SylBV', salesPerson: 'FASZAID',                 group: 'Botswana Inquires'               },
//         {clientID: 'AUcSh', salesPerson: 'MANUELG',                 group: 'Mozambique Inquires'               },
//         {clientID: 'aFEb2', salesPerson: 'SARTAJM',                 group: 'West Africa English'               },
//         {clientID: 'nrPmM', salesPerson: 'MSHEIKH',                 group: 'UAE Inquires'               },
//         {clientID: 'Pb9sj', salesPerson: 'UMBAIG',                  group: 'Uganda Inquires'              },
//         {clientID: 't4HES', salesPerson: 'HARISMED',                group: 'TURKS AND CAICOS (CARIB)'                },
//         {clientID: 'jvjqG', salesPerson: 'ZZUMRUD',                 group: 'Botswana Inquires'               },
//         {clientID: '9nEIX', salesPerson: 'ABIYA',                   group: 'Kenya Inquires'             },
//         {clientID: 'LVDuP', salesPerson: 'FARSIDDIQUI',             group: 'TURKS AND CAICOS (CARIB)'                   },
//         {clientID: 'BZHRW', salesPerson: 'JMSIS',                   group: 'Tanzania Inquires'             },
//         {clientID: 'moOOY', salesPerson: 'JHANAZEB',                group: 'Uganda Inquires'                },
//         {clientID: '7LkFa', salesPerson: 'VICKY',                   group: 'Uganda Inquires'             },
//         {clientID: 'KUxZx', salesPerson: 'ABDBASIT',                group: 'Tanzania Inquires'                },
//         {clientID: '4xZbo', salesPerson: 'IBTESAM',                 group: 'GUYANA (CARIB)'               },
//         {clientID: 'eLwhI', salesPerson: 'MUHSAAD',                 group: 'BAHAMAS (CARIB)'               },
//         {clientID: 'fiNye', salesPerson: 'MUHANOMAN',               group: 'Mozambique Inquires'                 },
//         {clientID: 'oGRdu', salesPerson: 'AZESIDDIQUI',             group: 'TRINIDAD (CARIB)'                   },
//         {clientID: '2VKF5', salesPerson: 'SAHIFATIMA',              group: 'CONGO Inquries'                  },
//         {clientID: 'FJnn7', salesPerson: 'ATHAROON',                group: 'GUYANA (CARIB)'                },
//         {clientID: 'PdVAk', salesPerson: 'USNASEER',                group: 'Pakistan Inquires'                },
//         {clientID: 'p5qWe', salesPerson: 'OMJAMEEL',                group: 'Tanzania Inquires'                },
//         {clientID: 'bm558', salesPerson: 'SUAD',                    group: 'UAE Inquires'            },
//         {clientID: 'hmojc', salesPerson: 'PHILLIP',                 group: 'Zimbabwe Inquires'               },
//         {clientID: 'EAL4G', salesPerson: 'ISHTIAK',                 group: 'Kenya Inquires'               },
//         {clientID: 'GISrI', salesPerson: 'JERUSA',                  group: 'Kenya Inquires'              },
//         {clientID: 'PrVIX', salesPerson: 'HASNAINALI',              group: 'TRINIDAD (CARIB)'                  },
//         {clientID: 'BxLya', salesPerson: 'AMANI',                   group: 'Tanzania Inquires'             },
//         {clientID: 'rfhXx', salesPerson: 'ZBUTT',                   group: 'Zimbabwe Inquires'             },
//         {clientID: 'ZrUYB', salesPerson: 'ZAIQBAL',                 group: 'Malawi Inquires'               },
//         {clientID: 'NZWIF', salesPerson: 'THAVER',                  group: 'Uganda Inquires'              },
//         {clientID: '28Cqp', salesPerson: 'LEKULE',                  group: 'Tanzania Inquires'              },
//         {clientID: 'hO2hm', salesPerson: 'UZZAL',                   group: 'Kenya Inquires'             },
//         {clientID: 'vbUgD', salesPerson: 'BINAYUB',                 group: 'BAHAMAS (CARIB)'               },
//         {clientID: '7B9wz', salesPerson: 'FHAQUE',                  group: 'Tanzania Inquires'              },
//         {clientID: 'F8elV', salesPerson: 'SYSHABBAS',               group: 'Malawi Inquires'                 },
//         {clientID: 'RHaOV', salesPerson: 'REDWAN',                  group: 'Tanzania Inquires'              },
//         {clientID: 'XB8Ib', salesPerson: 'DANAYAZ',                 group: 'CONGO Inquries'               },
//         {clientID: 'SoewI', salesPerson: 'MUHHASSAN',               group: 'Malawi Inquires'                 },
//         {clientID: 'xtnML', salesPerson: 'AMSALK',                  group: 'Zambia Inquires'              },
//         {clientID: 'yzweY', salesPerson: 'MDNASIR',                 group: 'Malawi Inquires'               },
//         {clientID: 'oZmBx', salesPerson: 'IQRA',                    group: 'Tanzania Inquires'            },
//         {clientID: 'nTrxp', salesPerson: 'WISHAQ',                  group: 'GUYANA (CARIB)'              },
//         {clientID: 'bUleX', salesPerson: 'HAMZAHEER',               group: 'BAHAMAS (CARIB)'                 },
//         {clientID: '5SxMW', salesPerson: 'ANBALAGAN',               group: 'BAHAMAS (CARIB)'                 },
//         {clientID: 'cju7U', salesPerson: 'MIMSHAFRAN',              group: 'Botswana Inquires'                  },
//         {clientID: 'SQWuL', salesPerson: 'HIBAAFAQ',                group: 'Malawi Inquires'                },
//         {clientID: '0OnNR', salesPerson: 'FAAKASH',                 group: 'Zambia Inquires'               },
//         {clientID: 'XDH8q', salesPerson: 'MARIAMALAM',              group: 'Tanzania Inquires'                  },
//         {clientID: 'E2BN6', salesPerson: 'SHEREEN',                 group: 'Tanzania Inquires'               },
//         {clientID: 'NauBW', salesPerson: 'MAITHA',                  group: 'Kenya Inquires'              },
//         {clientID: 'JFShZ', salesPerson: 'AZAD',                    group: 'TRINIDAD (CARIB)'            },
//         {clientID: '50yxu', salesPerson: 'SHEILA',                  group: 'Zambia Inquires'              },
//         {clientID: 'xauxu', salesPerson: 'ARBABR',                  group: 'Malawi Inquires'              },
//         {clientID: 'zTujR', salesPerson: 'SHOSHUJA',                group: 'Kenya Inquires'                },
//         {clientID: 'r5g3M', salesPerson: 'AHMGHANI',                group: 'Uganda Inquires'                },
//         {clientID: '5FKT4', salesPerson: 'LAKSHIKA',                group: 'Malawi Inquires'                },
//         {clientID: 'qja9a', salesPerson: 'SMUMTAZ',                 group: 'Zambia Inquires'               },
//         {clientID: 'EQEXG', salesPerson: 'FEONIA',                  group: 'GUYANA (CARIB)'              },
//         {clientID: '9qtho', salesPerson: 'ANIK',                    group: 'BAHAMAS (CARIB)'            },
//         {clientID: 'QXQxe', salesPerson: 'WAJKHAN',                 group: 'Kenya Inquires'               },
//         {clientID: '6w9IQ', salesPerson: 'HISAMUDDIN',              group: 'CONGO Inquries'                  },
//         {clientID: 'gIjvc', salesPerson: 'SHERBAH',                 group: 'Georgia Inquires'               },
//         {clientID: 'lHSMo', salesPerson: 'BARAKA',                  group: 'Tanzania Inquires'              },
//         {clientID: 'yLZXp', salesPerson: 'TANZEEL',                 group: 'BAHAMAS (CARIB)'               },
//         {clientID: 'DA2im', salesPerson: 'NUJHATUN',                group: 'Zambia Inquires'                },
//         {clientID: 'xDZeK', salesPerson: 'MOSHARRAF',               group: 'Zimbabwe Inquires'                 },
//         {clientID: 'CEOyI', salesPerson: 'MAIDHA',                  group: 'BAHAMAS (CARIB)'              },
//         {clientID: 'qg8TJ', salesPerson: 'ALIFAR',                  group: 'Zimbabwe Inquires'              },
//         {clientID: 'RQ2Hq', salesPerson: 'ZEEKHAN',                 group: 'BAHAMAS (CARIB)'               },
//         {clientID: 'OOIj7', salesPerson: 'SHAREHMAN',               group: 'TRINIDAD (CARIB)'                 },
//         {clientID: 'wp7RL', salesPerson: 'AFRIDI',                  group: 'Zimbabwe Inquires'              },
//         {clientID: 'idCne', salesPerson: 'MOHAMEDADIL',             group: 'JAMAICA (CARIB)'                   },
//         {clientID: 'HYNWv', salesPerson: 'KARYDES',                 group: 'CYPRUS (EUROPE)'               },
//         {clientID: 'wulrm', salesPerson: 'KHADIJA',                 group: 'Malawi Inquires'               },
//         {clientID: 'GGdJI', salesPerson: 'KATHY',                   group: 'Kenya Inquires'             },
//         {clientID: 'VhqJo', salesPerson: 'SUREHARID',               group: 'BAHAMAS (CARIB)'                 },
//         {clientID: 'XzDD4', salesPerson: 'HABDULLAH',               group: 'GUYANA (CARIB)'                 },
//         {clientID: 'rJCQ3', salesPerson: 'NABALI',                  group: 'CONGO Inquries'              },
//         {clientID: 'UDSLP', salesPerson: 'ARLENE',                  group: 'Malawi Inquires'              },
//         {clientID: '0ETtP', salesPerson: 'SAJAMSHED',               group: 'Kenya Inquires'                 },
//         {clientID: 'Vi4Il', salesPerson: 'JANE',                    group: 'TURKS AND CAICOS (CARIB)'            },
//         {clientID: 'jUoTt', salesPerson: 'BOLOTBEKCHIN',            group: 'Georgia Inquires'                    },
//         {clientID: 'VLLXe', salesPerson: 'SINELA',                  group: 'Mozambique Inquires'              },
//         {clientID: 'Gd59I', salesPerson: 'MTPARACHA',               group: 'IRELAND (EUROPE)'                 },
//         {clientID: 'XjqX2', salesPerson: 'JUNSHAMSHAD',             group: 'Malawi Inquires'                   },
//         {clientID: 'qrrWB', salesPerson: 'WAQRASUL',                group: 'UAE Inquires'                },
//         {clientID: '30EXS', salesPerson: 'MUTISYA',                 group: 'Kenya Inquires'               },
//         {clientID: '2nzUc', salesPerson: 'JACKLINE',                group: 'Tanzania Inquires'                },
//         {clientID: 'u2pkE', salesPerson: 'JOHNCRIS',                group: 'BAHAMAS (CARIB)'                },
//         {clientID: '6PUqR', salesPerson: 'KRISTINE',                group: 'BAHAMAS (CARIB)'                },
//         {clientID: 'pnBFz', salesPerson: 'MASOAHMED',               group: 'Kenya Inquires'                 },
//         {clientID: '6UG6z', salesPerson: 'TASIDDIQUI',              group: 'Kenya Inquires'                  },
//         {clientID: 'SA6bc', salesPerson: 'OGECHI',                  group: 'Kenya Inquires'              },
//         {clientID: 'pxFIg', salesPerson: 'RABAB',                   group: 'Malawi Inquires'             },
//         {clientID: 'G9uDT', salesPerson: 'ZAINMED',                 group: 'Kenya Inquires'               },
//         {clientID: 'SLf86', salesPerson: 'AGNESS',                  group: 'Zambia Inquires'              },
//         {clientID: 'ZNyUe', salesPerson: 'MAINA',                   group: 'Kenya Inquires'             },
//         {clientID: 'KkPGK', salesPerson: 'IMTIYAZALAM',             group: 'Zambia Inquires'                   },
//         {clientID: '8e5Rj', salesPerson: 'MUHEHSAN',                group: 'MAURITIUS (EUROPE)'                },
//         {clientID: 'wEay7', salesPerson: 'SALHUSSAIN',              group: 'Kenya Inquires'                  },
//         {clientID: 'FCWji', salesPerson: 'HASSAHMED',               group: 'Swaziland Inquires'                 },
//         {clientID: 'BkqeX', salesPerson: 'ZAINASIR',                group: 'ENGLAND (EUROPE)'                },
//         {clientID: '1MAxV', salesPerson: 'SOHELMRIDHA',             group: 'West Africa English'                   },
//         {clientID: 'dDKIb', salesPerson: 'MUKRY',                   group: 'Uganda Inquires'             },
//         {clientID: 'LkwQg', salesPerson: 'MUSHFIQUR',               group: 'Malawi Inquires'                 },
//         {clientID: '5PqmH', salesPerson: 'REQEEB',                  group: 'Kenya Inquires'              },
//         {clientID: 'EDUOH', salesPerson: 'JANDY',                   group: 'CONGO Inquries'             },
//         {clientID: 'QjgRV', salesPerson: 'MUWAQAS',                 group: 'CONGO Inquries'               },
//         {clientID: 'aW02X', salesPerson: 'SADIQNEK',                group: 'MALTA (EUROPE)'                },
//         {clientID: 'dR2G8', salesPerson: 'KHUQAZI',                 group: 'BAHAMAS (CARIB)'               },
//         {clientID: 'KQOvf', salesPerson: 'SEMPERTEGUI',             group: 'Paraguay Inquires'                   },
//         {clientID: '7w0uO', salesPerson: 'ANRAFIQUE',               group: 'Uganda Inquires'                 },
//         {clientID: 'i8JiS', salesPerson: 'ALIBHAI',                 group: 'Kenya Inquires'               },
//         {clientID: 'jjlT2', salesPerson: 'DALMAS',                  group: 'Kenya Inquires'              },
//         {clientID: 'RziaI', salesPerson: 'ZYAMBO',                  group: 'Zambia Inquires'              },
//         {clientID: 'l1np2', salesPerson: 'SARAH',                   group: 'Uganda Inquires'             },
//         {clientID: 'f1dKD', salesPerson: 'SYNABEEL',                group: 'Pakistan Inquires'                },
//         {clientID: 'o9ljs', salesPerson: 'LYDIAH',                  group: 'Kenya Inquires'              },
//         {clientID: 'cWQul', salesPerson: 'SHEJUNAID',               group: 'SURINAME (CARIB)'                 },
//         {clientID: 'PuYMC', salesPerson: 'HIRAFAIZ',                group: 'Malawi Inquires'                },
//         {clientID: 'QPbNv', salesPerson: 'JAHUSSAIN',               group: 'TURKS AND CAICOS (CARIB)'                 },
//         {clientID: '2DsuC', salesPerson: 'FAHHMED',                 group: 'UAE Inquires'               },
//         {clientID: 'Y6VOj', salesPerson: 'FRANCE',                  group: 'Kenya Inquires'              },
//         {clientID: 'mFn2y', salesPerson: 'KHUBAB',                  group: 'MAURITIUS (EUROPE)'              },
//         {clientID: 'ut7YK', salesPerson: 'SWAHASSAN',               group: 'GUYANA (CARIB)'                 },
//         {clientID: 'HDwzY', salesPerson: 'TAHSEEN',                 group: 'Malawi Inquires'               },
//         {clientID: 'C1HKm', salesPerson: 'MUHADEEL',                group: 'Swaziland Inquires'                },
//         {clientID: 'vYDIC', salesPerson: 'ZOAHKHAN',                group: 'Zambia Inquires'                },
//         {clientID: 'mSPqk', salesPerson: 'SUALI',                   group: 'Zimbabwe Inquires'             },
//         {clientID: 'dzqTj', salesPerson: 'MUHDANIYAL',              group: 'JAMAICA (CARIB)'                  },
//         {clientID: 'sjPkO', salesPerson: 'SHAKFAROOQUI',            group: 'BAHAMAS (CARIB)'                    },
//         {clientID: 'iDSjl', salesPerson: 'ALLAUDIN',                group: 'Malawi Inquires'                },
//         {clientID: 'QFAUF', salesPerson: 'SHENAZIR',                group: 'IRELAND (EUROPE)'                },
//         {clientID: 'UcTf3', salesPerson: 'DUISHENOV',               group: 'Georgia Inquires'                 },
//         {clientID: 'dAUqs', salesPerson: 'ASFANDIYAR',              group: 'South Sudan'                  },
//         {clientID: 'lBlKS', salesPerson: 'NOUMAN',                  group: 'BAHAMAS (CARIB)'              },
//         {clientID: 'tvY5d', salesPerson: 'HASHUSSAIN',              group: 'Zambia Inquires'                  },
//         {clientID: 'QMQWN', salesPerson: 'NAZAHMED',                group: 'Tanzania Inquires'                },
//         {clientID: 'fRvBm', salesPerson: 'ZUUDDIN',                 group: 'Malawi Inquires'               },
//         {clientID: 'aSlEq', salesPerson: 'MUMUZAMMIL',              group: 'Malawi Inquires'                  },
//         {clientID: 'vm4EV', salesPerson: 'ZIA',                     group: 'Uganda Inquires'           },
//         {clientID: 'RtvzH', salesPerson: 'ANMEER',                  group: 'Kenya Inquires'              },
//         {clientID: 'Jjv8h', salesPerson: 'MASOOMRO',                group: 'Malawi Inquires'                },
//         {clientID: 'WSq4Z', salesPerson: 'JAFFRI',                  group: 'BAHAMAS (CARIB)'              },
//         {clientID: 'KpgNg', salesPerson: 'IJAZ',                    group: 'Kenya Inquires'            },
//         {clientID: 'UxEql', salesPerson: 'FARIHA',                  group: 'Kenya Inquires'              },
//         {clientID: 'IWUFq', salesPerson: 'SHAALKHAN',               group: 'Zimbabwe Inquires'                 },
//         {clientID: 'n3R8m', salesPerson: 'AZIZI',                   group: 'Kenya Inquires'             },
//         {clientID: 'bnf8K', salesPerson: 'ARSLAN',                  group: 'Malawi Inquires'              },
//         {clientID: 'CNwmA', salesPerson: 'RAFEEQ',                  group: 'Zambia Inquires'              },
//         {clientID: 'mTNdT', salesPerson: 'MARSIDDIQUI',             group: 'BAHAMAS (CARIB)'                   },
//         {clientID: 'HfLWL', salesPerson: 'SAMUSTAFA',               group: 'Kenya Inquires'                 },
//         {clientID: 'QGsEg', salesPerson: 'MKJAVED',                 group: 'Kenya Inquires'               },
//         {clientID: '0tnQz', salesPerson: 'UZMA',                    group: 'Malawi Inquires'            },
//         {clientID: '6o5kC', salesPerson: 'WAHAB',                   group: 'Tanzania Inquires'             },
//         {clientID: 'bdsIL', salesPerson: 'MUHARSA',                 group: 'Kenya Inquires'               },
//         {clientID: 'oHG8w', salesPerson: 'ARSAFDAR',                group: 'GUYANA (CARIB)'                },
//         {clientID: 'TLufW', salesPerson: 'IMRANA',                  group: 'Zambia Inquires'              },
//         {clientID: 'xVapn', salesPerson: 'AFAQUE',                  group: 'Zambia Inquires'              },
//         {clientID: '7X0Sh', salesPerson: 'MIBRKHAN',                group: 'Zimbabwe Inquires'                },
//         {clientID: 'q6QqL', salesPerson: 'JUANKA',                  group: 'Paraguay Inquires'              },
//         {clientID: 'BIDnu', salesPerson: 'YOUALI',                  group: 'Kenya Inquires'              },
//         {clientID: 'cHyz9', salesPerson: 'QUADRI',                  group: 'Malawi Inquires'              },
//         {clientID: 'N3qvN', salesPerson: 'TALKHALID',               group: 'IRELAND (EUROPE)'                 },
//         {clientID: 'jsJGk', salesPerson: 'MUREHAN',                 group: 'Kenya Inquires'               },
//         {clientID: 'Eqnpg', salesPerson: 'RAZAFAR',                 group: 'CONGO Inquries'               },
//         {clientID: 'HTDkL', salesPerson: 'SUMMIYA',                 group: 'Uganda Inquires'               },
//         {clientID: 'LnAoV', salesPerson: 'ADNANABDU',               group: 'CONGO Inquries'                 },
//         {clientID: 'NI4bo', salesPerson: 'SAMIRA',                  group: 'MAURITIUS (EUROPE)'              },
//         {clientID: 'cn4aQ', salesPerson: 'MORIZVI',                 group: 'Kenya Inquires'               },
//         {clientID: '9Yd7C', salesPerson: 'OMJAMEEL',                group: 'Tanzania Inquires'                },
//         {clientID: '6QzA7', salesPerson: 'NOUREEN',                 group: 'Malawi Inquires'               },
//         {clientID: 'aUgWS', salesPerson: 'ZAINALI',                 group: 'Zambia Inquires'               },
//         {clientID: '0jrrV', salesPerson: 'FMOIZ',                   group: 'Zambia Inquires'             },
//         {clientID: 'SOlRM', salesPerson: 'BURHAN',                  group: 'Malawi Inquires'              },
//         {clientID: 'Wcezu', salesPerson: 'JALEEL',                  group: 'TRINIDAD (CARIB)'              },
//         {clientID: 'qNZnr', salesPerson: 'IRSHAD',                  group: 'Zambia Inquires'              },
//         {clientID: '01oU7', salesPerson: 'MUHOWAIS',                group: 'CONGO Inquries'                },
//         {clientID: 'rquXI', salesPerson: 'LAURAPA',                 group: 'Paraguay Inquires'               },
//         {clientID: 'YEHjv', salesPerson: 'NAWAZ',                   group: 'Tanzania Inquires'             },
//         {clientID: 'KAZRF', salesPerson: 'WSALEEM',                 group: 'UAE Inquires'               },
//         {clientID: 'F7Tgb', salesPerson: 'ROCRIFE',                 group: 'Paraguay Inquires'               },
//         {clientID: 'EXRUD', salesPerson: 'SANAULLAH',               group: 'Tanzania Inquires'                 },
//         {clientID: 'b5R83', salesPerson: 'SIFTULLAH',               group: 'Malawi Inquires'                 },
//         {clientID: 'etZa5', salesPerson: 'GHORI',                   group: 'Kenya Inquires'             },
//         {clientID: 'cOs5z', salesPerson: 'SHIRAZ',                  group: 'Zambia Inquires'              },
//         {clientID: 'CkFWS', salesPerson: 'HASNAIN',                 group: 'Kenya Inquires'               },
//         {clientID: '74cqB', salesPerson: 'MAALI',                   group: 'Zambia Inquires'             },
//         {clientID: 'cC5U4', salesPerson: 'AHMEDALI',                group: 'Malawi Inquires'                },
//         {clientID: 'q8hSK', salesPerson: 'DARWIN',                  group: 'GUYANA (CARIB)'              },
//         {clientID: 'YfNSh', salesPerson: 'IVANN',                   group: 'Mozambique Inquires'             },
//         {clientID: 'SzZZf', salesPerson: 'SHERWANI',                group: 'Zambia Inquires'                },
//         {clientID: 'MGWhr', salesPerson: 'JAKHAN',                  group: 'Malawi Inquires'              },
//         {clientID: 'uQ6jY', salesPerson: 'MARIA',                   group: 'Tanzania Inquires'             },
//         {clientID: 'eWnRi', salesPerson: 'SAKTHAR',                 group: 'Zambia Inquires'               },
//         {clientID: 'Y0Fmx', salesPerson: 'NAKHAN',                  group: 'Kenya Inquires'              },
//         {clientID: 'sUHRs', salesPerson: 'ADEELKHAN',               group: 'West Africa English'                 },
//         {clientID: 'yKd4A', salesPerson: 'ZULFIQAR',                group: 'Zambia Inquires'                },
//         {clientID: 'dfc1t', salesPerson: 'MUSTAFA',                 group: 'Tanzania Inquires'               },
//         {clientID: 'g2KbT', salesPerson: 'DANIYAL',                 group: 'Mozambique Inquires'               },
//         {clientID: 'fpBIW', salesPerson: 'LUIS',                    group: 'Paraguay Inquires'            },
//         {clientID: '7YXPH', salesPerson: 'JILL',                    group: 'Kenya Inquires'            },
//         {clientID: 'n4mNC', salesPerson: 'HKHALID',                 group: 'South Sudan'               },
//         {clientID: 'taWDo', salesPerson: 'AKARIM',                  group: 'TRINIDAD (CARIB)'              },
//         {clientID: 'lqO9b', salesPerson: 'FAROOK',                  group: 'GUYANA (CARIB)'              },
//         {clientID: 'OtYxK', salesPerson: 'HASHIMOTOKEI',            group: 'South Sudan'                    },
//         {clientID: 'aPwvY', salesPerson: 'MARIANBO',                group: 'Paraguay Inquires'                },
//         {clientID: 'XvyC2', salesPerson: 'ALIBAIG',                 group: 'RUSSIA Inquires'               },
//         {clientID: 'x3xIC', salesPerson: 'MATHAR',                  group: 'Zambia Inquires'              },
//         {clientID: 'BT9qb', salesPerson: 'TSUTSUMI',                group: 'Kenya Inquires'                },
//         {clientID: 'PZuzy', salesPerson: 'AREEB',                   group: 'Kenya Inquires'             },
//         {clientID: 'IqZR8', salesPerson: 'TAIMUR',                  group: 'Zambia Inquires'              },
//         {clientID: '9gAKG', salesPerson: 'AHKHAN',                  group: 'South Sudan'              },
//         {clientID: 'EhmYi', salesPerson: 'HAQ',                     group: 'Zambia Inquires'           },
//         {clientID: 'TEN4t', salesPerson: 'NGUL',                    group: 'Kenya Inquires'            },
//         {clientID: 'TAUsf', salesPerson: 'MJUNAID',                 group: 'Mozambique Inquires'               },
//         {clientID: 'XAOgP', salesPerson: 'AKHAN',                   group: 'Pakistan Inquires'             },
//         {clientID: 'USAPf', salesPerson: 'SMREZA',                  group: 'RUSSIA Inquires'              },
//         {clientID: 'Bz0GB', salesPerson: 'MSAKRAM',                 group: 'Zambia Inquires'               },
//         {clientID: 'uB7Fj', salesPerson: 'ZEESHANALI',              group: 'Australia Inquires'                  },
//         {clientID: 'ydrMI', salesPerson: 'DON',                     group: 'TURKS AND CAICOS (CARIB)'           },
//         {clientID: 'DqvQR', salesPerson: 'RUSSELL',                 group: 'UAE Inquires'               },
//         {clientID: 'Rupoy', salesPerson: 'ROCKWEL',                 group: 'Tanzania Inquires'               },
//         {clientID: 'ql2xw', salesPerson: 'WAQASHUSSAIN',            group: 'Kenya Inquires'                    },
//         {clientID: 'kJTSc', salesPerson: 'KEN',                     group: 'GUYANA (CARIB)'           },
//         {clientID: 'Sru5M', salesPerson: 'ADNANAHMED',              group: 'Malawi Inquires'                  },
//         {clientID: 'AoEVm', salesPerson: 'SALAHUDDIN',              group: 'Kenya Inquires'                  },
//         {clientID: 'eSu4g', salesPerson: 'SHAMID',                  group: 'Kenya Inquires'              },
//         {clientID: 'Dwn0c', salesPerson: 'CHEL',                    group: 'Malawi Inquires'            },
//         {clientID: 'LGJWy', salesPerson: 'WASIF',                   group: 'Mozambique Inquires'             },
//         {clientID: 'SgiL5', salesPerson: 'FIDA',                    group: 'JAMAICA (CARIB)'            },
//         {clientID: 'XCNYy', salesPerson: 'JAHANGIR',                group: 'Botswana Inquires'                },
//         {clientID: 'kqPPT', salesPerson: 'YOUSUF',                  group: 'UAE Inquires'              },
//         {clientID: 'aTedp', salesPerson: 'SALLY',                   group: 'Oceania Inquires'             },
//         {clientID: 'r343p', salesPerson: 'YASIR',                   group: 'Mozambique Inquires'             },
//         {clientID: 'CrsVk', salesPerson: 'SHEHZAD',                 group: 'RUSSIA Inquires'               },
//         {clientID: '4kZqN', salesPerson: 'HASNAIN',                 group: 'Kenya Inquires'               },
//         {clientID: 'nRC1F', salesPerson: 'PAULA',                   group: 'New Zealand Inquires'             },
//         {clientID: 'dMw8y', salesPerson: 'NASIR',                   group: 'Pakistan Inquires'             },
//         {clientID: 'lp8yX', salesPerson: 'RASHID',                  group: 'Kenya Inquires'              },
//         {clientID: 'cxOWk', salesPerson: 'PATRICK',                 group: 'Kenya Inquires'               },
//         {clientID: 'UnZuL', salesPerson: 'MJUNAID',                 group: 'Malawi Inquires'               },
//         {clientID: 'i4MBt', salesPerson: 'EDWIN',                   group: 'Kenya Inquires'             },
//         {clientID: '4oqIH', salesPerson: 'WALLY',                   group: 'Kenya Inquires'             },
//         {clientID: 'SRsbA', salesPerson: 'SEGUN',                   group: 'TURKEY (EUROPE)'             },
//     ];
//     // let promises : any = [];
//     let noAgentFound  : any = [];
//     let details = ticketDetails.map(async element => {
//         let agent = await Agents.getAgentsByUsername('/sbtjapaninquiries.com', element.salesPerson.toLowerCase());
//         if(agent && agent.length){
//             Object.assign(element, {assigned_to : agent[0].email});
//             // promises.push(
//             await Tickets.collection.findOneAndUpdate({clientID: element.clientID}, {$set: {group: element.group, assigned_to: agent[0].email}})
//             // );
//         }else{
//             noAgentFound.push(element);
//             Object.assign(element, {assigned_to : ''});
//             // promises.push(
//             await Tickets.collection.findOneAndUpdate({clientID: element.clientID}, {$set: {group: element.group}})
//             // );
//         }
//         return agent;
//     });
//     await Promise.all(details);
//     res.send({ status: "ok" , unassiged: noAgentFound});
// });
exports.ticketRoutes = router;
//# sourceMappingURL=ticket.js.map