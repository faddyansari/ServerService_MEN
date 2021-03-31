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
exports.IconnDispatcher = exports.CustomDispatcherForPanel = exports.CustomBeechatDispatcher = exports.CustomDispatcher = exports.TicketDispatcher = void 0;
var sessionsManager_1 = require("./../../globals/server/sessionsManager");
var cheerio = require("cheerio");
var ticketsModel_1 = require("../../models/ticketsModel");
var agentModel_1 = require("../../models/agentModel");
var companyModel_1 = require("../../models/companyModel");
var RuleSetExecutor_1 = require("./RuleSetExecutor");
var request = require("request-promise");
function TicketDispatcher(actions, ticket) {
    try {
        actions.map(function (action) {
            switch (action.name) {
                case 'note':
                    // console.log('Adding Note!');
                    if (!ticket.ticketNotes)
                        ticket.ticketNotes = [];
                    ticket.ticketNotes.push({
                        ticketNote: action.value,
                        added_by: 'Rule Dispatcher',
                        added_at: new Date().toISOString()
                    });
                    ticket.ticketlog.push({
                        title: 'Note Added',
                        status: action.value,
                        updated_by: 'Rule Dispatcher',
                        user_type: 'Agent',
                        time_stamp: new Date().toISOString()
                    });
                    break;
                case 'priority':
                    ticket.priority = action.value.toUpperCase();
                    ticket.ticketlog.push({
                        title: 'Set Priority',
                        status: ticket.priority,
                        updated_by: 'Rule Dispatcher',
                        user_type: 'Agent',
                        time_stamp: new Date().toISOString()
                    });
                    break;
                case 'group':
                    ticket.group = action.value.trim();
                    ticket.ticketlog.push({
                        title: 'Assigned To Group',
                        status: ticket.group,
                        updated_by: 'Rule Dispatcher',
                        user_type: 'Agent',
                        time_stamp: new Date().toISOString()
                    });
                    break;
                case 'agent':
                    ticket.assigned_to = action.value.trim();
                    ticket.first_assigned_time = new Date().toISOString();
                    ticket.ticketlog.push({
                        title: 'Assigned To Agent',
                        status: ticket.assigned_to,
                        updated_by: 'Rule Dispatcher',
                        user_type: 'Agent',
                        time_stamp: new Date().toISOString()
                    });
                    break;
            }
        });
        return ticket;
    }
    catch (error) {
        console.log(error);
        console.log('error in Add Note Abstraction');
        return ticket;
    }
}
exports.TicketDispatcher = TicketDispatcher;
function CustomDispatcher(ticket, msg) {
    return __awaiter(this, void 0, void 0, function () {
        var emailPattern_1, company, returnOb, lastHours, $, visitorEmail, salesPerson, blockquote, p, temp_1, temp_2, datetime, previousTickets, primaryTicket, primaryTicketLog, secondaryTicketLog, obj, agent, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 13, , 14]);
                    emailPattern_1 = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    return [4 /*yield*/, companyModel_1.Company.getCompany(ticket.nsp)];
                case 1:
                    company = _a.sent();
                    returnOb = {
                        primaryTicket: undefined,
                        secondaryTicket: ticket
                    };
                    if (!(company && company[0].settings.customDispatcher)) return [3 /*break*/, 11];
                    lastHours = 36;
                    $ = cheerio.load(msg);
                    visitorEmail = '';
                    salesPerson = '';
                    blockquote = $('blockquote').find('span h3');
                    p = $('h3');
                    // console.log(p);
                    if (blockquote.length) {
                        visitorEmail = $(blockquote[1]).html().toLowerCase().split(':')[1].trim();
                        if ($(blockquote[5]) && $(blockquote[5]).html()) {
                            temp_1 = $(blockquote[5]).html().toLowerCase().split(':');
                            if (temp_1.length > 1)
                                salesPerson = temp_1[1].trim();
                            else
                                salesPerson = 'n/a';
                        }
                        // salesPerson = (($(blockquote[5]) as any) && ($(blockquote[5]) as any).html()) ? ($(blockquote[5]) as any).html().toLowerCase().split(':')[1].trim() : 'n/a';
                    }
                    else if (p.length) {
                        visitorEmail = $(p[1]).html().toLowerCase().split(':')[1].trim();
                        if ($(p[5]).html() && $(p[5]).html()) {
                            temp_2 = $(p[5]).html().toLowerCase().split(':');
                            if (temp_2.length > 1)
                                salesPerson = temp_2[1].trim();
                            else
                                salesPerson = 'n/a';
                        }
                        // salesPerson = (($(p[5]).html() as any) && ($(p[5]).html() as any)) ? ($(p[5]).html() as any).toLowerCase().split(':')[1].trim() : 'n/a';
                    }
                    else {
                        console.log('nothing found!');
                        return [2 /*return*/, returnOb];
                    }
                    if (!emailPattern_1.test(visitorEmail))
                        visitorEmail = '';
                    if (!(visitorEmail || salesPerson)) return [3 /*break*/, 9];
                    datetime = new Date(addHours(lastHours)).toISOString();
                    return [4 /*yield*/, ticketsModel_1.Tickets.getTicketBySBTVisitor(ticket.nsp, datetime, visitorEmail)];
                case 2:
                    previousTickets = _a.sent();
                    if (!(salesPerson == 'n/a' || salesPerson == 'possible free')) return [3 /*break*/, 6];
                    if (!(previousTickets && previousTickets.length)) return [3 /*break*/, 4];
                    primaryTicket = previousTickets[previousTickets.length - 1];
                    console.log('Primary Ticket: ');
                    primaryTicketLog = {
                        title: "Merged Tickets",
                        status: ticket._id,
                        updated_by: 'RuleSet Dispatcher',
                        user_type: 'System',
                        time_stamp: new Date().toISOString()
                    };
                    secondaryTicketLog = {
                        title: "Merged into ",
                        status: primaryTicket._id,
                        updated_by: 'RuleSet Dispatcher',
                        user_type: 'System',
                        time_stamp: new Date().toISOString()
                    };
                    console.log('Merging!');
                    return [4 /*yield*/, ticketsModel_1.Tickets.MergeTickets(ticket.nsp, [ticket._id, primaryTicket._id], { primaryTicketLog: primaryTicketLog, secondaryTicketLog: secondaryTicketLog }, [ticket], primaryTicket._id)];
                case 3:
                    obj = _a.sent();
                    if (obj) {
                        returnOb.primaryTicket = obj.primaryTicket;
                        returnOb.secondaryTicket = obj.secondaryTicket[0];
                        // ticket = obj.secondaryTicket[0];
                        returnOb.secondaryTicket.sbtVisitor = visitorEmail;
                        // console.log('Secondary Ticket:');
                        // console.log(ticket);
                        return [2 /*return*/, returnOb];
                    }
                    else
                        return [2 /*return*/, undefined];
                    return [3 /*break*/, 5];
                case 4:
                    ticket.sbtVisitor = visitorEmail;
                    returnOb.secondaryTicket = ticket;
                    return [2 /*return*/, returnOb];
                case 5: return [3 /*break*/, 8];
                case 6: return [4 /*yield*/, agentModel_1.Agents.getAgentsByUsername(ticket.nsp, salesPerson.split('@')[0])];
                case 7:
                    agent = _a.sent();
                    if (agent && agent.length) {
                        // console.log(agent[0].email);
                        ticket.assigned_to = agent[0].email;
                    }
                    ticket.sbtVisitor = visitorEmail;
                    returnOb.secondaryTicket = ticket;
                    return [2 /*return*/, returnOb];
                case 8: return [3 /*break*/, 10];
                case 9: return [2 /*return*/, returnOb];
                case 10: return [3 /*break*/, 12];
                case 11: return [2 /*return*/, returnOb];
                case 12: return [3 /*break*/, 14];
                case 13:
                    err_1 = _a.sent();
                    console.log(err_1);
                    return [3 /*break*/, 14];
                case 14: return [2 /*return*/];
            }
        });
    });
}
exports.CustomDispatcher = CustomDispatcher;
function CustomBeechatDispatcher(ticket) {
    return __awaiter(this, void 0, void 0, function () {
        var subject, data, selectedAgentByDispatcher, agent, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    subject = ticket.subject;
                    data = ticket.subject.split('/').map(function (t) { return t.trim(); });
                    selectedAgentByDispatcher = '';
                    if (!data[1]) return [3 /*break*/, 2];
                    ticket.subject = data[1];
                    return [4 /*yield*/, RuleSetExecutor_1.RuleSetDescriptor(ticket)];
                case 1:
                    ticket = _a.sent();
                    selectedAgentByDispatcher = ticket.assigned_to;
                    ticket.subject = subject;
                    _a.label = 2;
                case 2:
                    if (!data[3]) return [3 /*break*/, 4];
                    return [4 /*yield*/, agentModel_1.Agents.getAgentsByUsername(ticket.nsp, data[3].toLowerCase())];
                case 3:
                    agent = _a.sent();
                    if (agent && agent.length) {
                        // console.log(agent[0].email);
                        ticket.assigned_to = agent[0].email;
                    }
                    else {
                        ticket.assigned_to = selectedAgentByDispatcher;
                    }
                    _a.label = 4;
                case 4: return [2 /*return*/, ticket];
                case 5:
                    err_2 = _a.sent();
                    console.log('Error in Beechat Dispatcher');
                    console.log(err_2);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.CustomBeechatDispatcher = CustomBeechatDispatcher;
function addHours(hours) {
    return new Date().setTime(new Date().getTime() - (hours * 60 * 60 * 1000));
}
function CustomDispatcherForPanel(ticket) {
    return __awaiter(this, void 0, void 0, function () {
        var returnOb, data, selectedAgentByDispatcher, DynamiclogSchema, agent, logSchema, CMIDlogSchema, lastHours, datetime, previousTickets, primaryTicket, primaryTicketLog, secondaryTicketLog, obj, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 9, , 10]);
                    returnOb = {
                        primaryTicket: undefined,
                        secondaryTicket: ticket
                    };
                    data = ticket.subject.split('/').map(function (t) { return t.trim(); });
                    selectedAgentByDispatcher = ticket.assigned_to;
                    // console.log(ticket.visitor);
                    // let lastHours = 36;
                    // let datetime = new Date(addHours(lastHours)).toISOString();
                    // let previousTickets = await Tickets.getTicketBySBTVisitor(ticket.nsp, datetime, ticket.visitor.email);
                    ticket.dynamicFields = {
                        'Inquire Source': 'LIVE CHAT'
                    };
                    DynamiclogSchema = {
                        title: "Dynamic field 'Inquire Source' updated to",
                        status: 'LIVE CHAT',
                        updated_by: 'Custom Dispatcher',
                        user_type: 'Custom Dispatcher',
                        time_stamp: new Date().toISOString()
                    };
                    ticket.ticketlog.push(DynamiclogSchema);
                    if (!data[3]) return [3 /*break*/, 2];
                    return [4 /*yield*/, agentModel_1.Agents.getAgentsByUsername(ticket.nsp, data[3].toLowerCase())];
                case 1:
                    agent = _a.sent();
                    if (agent && agent.length) {
                        // console.log(agent[0].email);
                        ticket.assigned_to = agent[0].email;
                        ticket.first_assigned_time = new Date().toISOString();
                        logSchema = {
                            title: 'assigned to',
                            status: ticket.assigned_to,
                            updated_by: 'Custom Dispatcher',
                            user_type: 'Custom Dispatcher',
                            time_stamp: new Date().toISOString()
                        };
                        ticket.ticketlog.push(logSchema);
                    }
                    else {
                        ticket.assigned_to = selectedAgentByDispatcher;
                    }
                    _a.label = 2;
                case 2:
                    if (ticket.assigned_to) {
                        Object.assign(ticket.dynamicFields, { 'Customer Tagging': 'Tagged' });
                        ticket.ticketlog.push({
                            title: "Dynamic field 'Customer Tagging' updated to",
                            status: 'Tagged',
                            updated_by: 'Custom Dispatcher',
                            user_type: 'Custom Dispatcher',
                            time_stamp: new Date().toISOString()
                        });
                    }
                    else {
                        Object.assign(ticket.dynamicFields, { 'Customer Tagging': 'Free' });
                        ticket.ticketlog.push({
                            title: "Dynamic field 'Customer Tagging' updated to",
                            status: 'Free',
                            updated_by: 'Custom Dispatcher',
                            user_type: 'Custom Dispatcher',
                            time_stamp: new Date().toISOString()
                        });
                    }
                    if (data[2] && /^\d+$/.test(data[2])) {
                        Object.assign(ticket.dynamicFields, { 'CM ID': data[2].toString().trim() });
                        CMIDlogSchema = {
                            title: "Dynamic field 'CM ID' updated to",
                            status: data[2].toString(),
                            updated_by: 'Custom Dispatcher',
                            user_type: 'Custom Dispatcher',
                            time_stamp: new Date().toISOString()
                        };
                        ticket.ticketlog.push(CMIDlogSchema);
                        Object.assign(ticket.dynamicFields, { 'Customer': 'Register' });
                        ticket.ticketlog.push({
                            title: "Dynamic field 'Customer' updated to",
                            status: 'Register',
                            updated_by: 'Custom Dispatcher',
                            user_type: 'Custom Dispatcher',
                            time_stamp: new Date().toISOString()
                        });
                    }
                    else {
                        Object.assign(ticket.dynamicFields, { 'Customer': 'New' });
                        ticket.ticketlog.push({
                            title: "Dynamic field 'Customer' updated to",
                            status: 'New',
                            updated_by: 'Custom Dispatcher',
                            user_type: 'Custom Dispatcher',
                            time_stamp: new Date().toISOString()
                        });
                    }
                    if (ticket.visitor && ticket.visitor.email && ticket.visitor.phone) {
                        Object.assign(ticket.dynamicFields, { 'Customer Details': 'Complete' });
                        ticket.ticketlog.push({
                            title: "Dynamic field 'Customer Details' updated to",
                            status: 'Complete',
                            updated_by: 'Custom Dispatcher',
                            user_type: 'Custom Dispatcher',
                            time_stamp: new Date().toISOString()
                        });
                    }
                    else {
                        Object.assign(ticket.dynamicFields, { 'Customer Details': 'In-Complete' });
                        ticket.ticketlog.push({
                            title: "Dynamic field 'Customer Details' updated to",
                            status: 'In-Complete',
                            updated_by: 'Custom Dispatcher',
                            user_type: 'Custom Dispatcher',
                            time_stamp: new Date().toISOString()
                        });
                    }
                    if (!(ticket.visitor && ticket.visitor.email)) return [3 /*break*/, 8];
                    lastHours = 36;
                    datetime = new Date(addHours(lastHours)).toISOString();
                    previousTickets = [];
                    return [4 /*yield*/, ticketsModel_1.Tickets.getTicketBySBTVisitor(ticket.nsp, datetime, ticket.visitor.email)];
                case 3:
                    // console.log(ticket.group);
                    // console.log(ticket.assigned_to);
                    // if(!ticket.group.match(/INB/gmi)){
                    previousTickets = _a.sent();
                    if (!(ticket.group && (ticket.group.match(/INB/gmi) || ticket.group.match(/UK/gmi)))) return [3 /*break*/, 5];
                    return [4 /*yield*/, ticketsModel_1.Tickets.getTicketBySBTVisitorSpecialCase(ticket.nsp, datetime, ticket.visitor.email, ticket.group)];
                case 4:
                    previousTickets = _a.sent();
                    _a.label = 5;
                case 5:
                    if (!(previousTickets && previousTickets.length)) return [3 /*break*/, 7];
                    primaryTicket = previousTickets[previousTickets.length - 1];
                    primaryTicketLog = {
                        title: "Merged Tickets",
                        status: ticket._id,
                        updated_by: 'RuleSet Dispatcher',
                        user_type: 'System',
                        time_stamp: new Date().toISOString()
                    };
                    secondaryTicketLog = {
                        title: "Merged into ",
                        status: primaryTicket._id,
                        updated_by: 'RuleSet Dispatcher',
                        user_type: 'System',
                        time_stamp: new Date().toISOString()
                    };
                    return [4 /*yield*/, ticketsModel_1.Tickets.MergeTickets(ticket.nsp, [ticket._id, primaryTicket._id], { primaryTicketLog: primaryTicketLog, secondaryTicketLog: secondaryTicketLog }, [ticket], primaryTicket._id)];
                case 6:
                    obj = _a.sent();
                    if (obj) {
                        returnOb.primaryTicket = obj.primaryTicket;
                        if (obj.primaryTicket.assigned_to) {
                            obj.secondaryTicket[0].assigned_to = obj.primaryTicket.assigned_to;
                        }
                        returnOb.secondaryTicket = obj.secondaryTicket[0];
                        // ticket = obj.secondaryTicket[0];
                        returnOb.secondaryTicket.dynamicFields = ticket.dynamicFields;
                        returnOb.secondaryTicket.sbtVisitor = ticket.visitor.email;
                        // console.log('Secondary Ticket:');
                        // console.log(ticket);
                        return [2 /*return*/, returnOb];
                    }
                    else
                        return [2 /*return*/, undefined];
                    return [3 /*break*/, 8];
                case 7:
                    // if (!ticket.dynamicFields) ticket.dynamicFields = {};
                    // Object.assign(ticket.dynamicFields, { 'Customer Tagging': 'Free' });
                    // ticket.ticketlog.push(
                    // 	{
                    // 		title: "Dynamic field 'Customer Tagging' updated to",
                    // 		status: 'Free',
                    // 		updated_by: 'Custom Dispatcher',
                    // 		user_type: 'Custom Dispatcher',
                    // 		time_stamp: new Date().toISOString()
                    // 	}
                    // );
                    ticket.sbtVisitor = ticket.visitor.email;
                    returnOb.secondaryTicket = ticket;
                    return [2 /*return*/, returnOb];
                case 8:
                    returnOb.secondaryTicket = ticket;
                    return [2 /*return*/, returnOb];
                case 9:
                    err_3 = _a.sent();
                    console.log(err_3);
                    return [3 /*break*/, 10];
                case 10: return [2 /*return*/];
            }
        });
    });
}
exports.CustomDispatcherForPanel = CustomDispatcherForPanel;
function IconnDispatcher(ticket) {
    return __awaiter(this, void 0, void 0, function () {
        var assigned_to_1, customerData, splitted, response_1, emailCheck_1, DynamiclogSchema, masterDataProductionURL, masterData, res, SalesEmpList, promises, err_4;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 7, , 8]);
                    console.log("Iconn dispatcher");
                    assigned_to_1 = '';
                    customerData = {};
                    splitted = ticket.subject.split('/');
                    customerData = {
                        "MailAddress": (ticket.sbtVisitor ? ticket.sbtVisitor : ticket.visitor.email).toLowerCase(),
                        "PhoneNumber": ticket.sbtVisitorPhone ? ticket.sbtVisitorPhone : '',
                        "StockId": '',
                        "CustomerId": ticket.dynamicFields && Object.keys(ticket.dynamicFields).length && ticket.dynamicFields['CM ID'] ? ticket.dynamicFields['CM ID'] : splitted && splitted.length && splitted[2] ? splitted[2] : '',
                    };
                    return [4 /*yield*/, request.post({
                            uri: "https://iconnapifunc01-beelinks.iconn-asestaging01.p.azurewebsites.net/api/GetCustomerDetail?code=DTrIaDFTaKSCXoHBXQyA1wVOCKpULKaaOPmxgcxq7lx16XR0GM9G2Q==",
                            body: customerData,
                            json: true,
                            timeout: 50000
                        })];
                case 1:
                    response_1 = _a.sent();
                    console.log("response code", response_1.ResultInformation[0].ResultCode);
                    if (!(response_1 && response_1.ResultInformation && response_1.ResultInformation.length && response_1.ResultInformation[0].ResultCode == "0")) return [3 /*break*/, 5];
                    emailCheck_1 = '';
                    response_1.CustomerData[0].ContactMailAddressList.map(function (res) {
                        if (res.Default == "1") {
                            emailCheck_1 = res.MailAddress;
                        }
                    });
                    if (!ticket.sbtVisitor && (ticket.visitor.email == 'support@bizzchats.com' || ticket.visitor.email == 'no-reply@sbtjapan.com' || ticket.visitor.email == 'noreply@sbtjapan.com' || ticket.visitor.email.includes('@tickets.livechatinc.com'))) {
                        ticket.sbtVisitor = emailCheck_1;
                    }
                    // if ((ticket.sbtVisitor ? ticket.sbtVisitor : ticket.visitor.email).toLowerCase() == emailCheck.toLowerCase()) {
                    if (!ticket.dynamicFields)
                        ticket.dynamicFields = {};
                    ticket.dynamicFields['CM ID'] = response_1.CustomerData[0].BasicData[0].CustomerId;
                    DynamiclogSchema = {
                        title: "Dynamic field 'CM ID' updated to",
                        status: response_1.CustomerData[0].BasicData[0].CustomerId,
                        updated_by: 'Iconn Dispatcher',
                        user_type: 'Iconn Dispatcher',
                        time_stamp: new Date().toISOString()
                    };
                    ticket.ticketlog.push(DynamiclogSchema);
                    if (!(response_1.CustomerData[0].SalesPersonData[0].UserName != 'FREE')) return [3 /*break*/, 4];
                    masterDataProductionURL = "https://iconnapifunc00-common.iconn-asestaging01.p.azurewebsites.net/api/GetMasterData?code=Bg5TFyJnSpRJ7s5ecl0Rfv8Y/HK7yIYuKLmdMQOUCum0ygEywNHK1Q==";
                    masterData = {
                        "MasterDataTypeId": 19
                    };
                    return [4 /*yield*/, request.post({
                            uri: masterDataProductionURL,
                            body: masterData,
                            json: true,
                            timeout: 50000
                        })];
                case 2:
                    res = _a.sent();
                    if (!res) return [3 /*break*/, 4];
                    SalesEmpList = res.MasterData;
                    promises = SalesEmpList.map(function (val) { return __awaiter(_this, void 0, void 0, function () {
                        var agentCheck, logSchema;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!(val.EmployeeName == response_1.CustomerData[0].SalesPersonData[0].UserName)) return [3 /*break*/, 2];
                                    assigned_to_1 = val.EmailAddress;
                                    return [4 /*yield*/, sessionsManager_1.SessionManager.getAgentByEmail(ticket.nsp, assigned_to_1)];
                                case 1:
                                    agentCheck = _a.sent();
                                    if (agentCheck) {
                                        ticket.assigned_to = assigned_to_1;
                                        logSchema = {
                                            title: 'Ticket assigned to',
                                            status: ticket.assigned_to,
                                            updated_by: 'Iconn Dispatcher',
                                            user_type: 'Iconn Dispatcher',
                                            time_stamp: new Date().toISOString()
                                        };
                                        ticket.ticketlog.push(logSchema);
                                    }
                                    _a.label = 2;
                                case 2: return [2 /*return*/];
                            }
                        });
                    }); });
                    return [4 /*yield*/, Promise.all(promises)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: 
                // }
                return [2 /*return*/, ticket];
                case 5: return [2 /*return*/, ticket];
                case 6: return [3 /*break*/, 8];
                case 7:
                    err_4 = _a.sent();
                    console.log("In catch block");
                    console.log(err_4);
                    return [2 /*return*/, ticket];
                case 8: return [2 /*return*/];
            }
        });
    });
}
exports.IconnDispatcher = IconnDispatcher;
//# sourceMappingURL=TicketDispatcher.js.map