"use strict";
//Created By Saad Ismail Shaikh 
//Dated : 10-9-2019
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
exports.RuleSetDescriptor = void 0;
var ticketsModel_1 = require("../../models/ticketsModel");
var TicketDispatcher_1 = require("./TicketDispatcher");
var TicketgroupModel_1 = require("../../models/TicketgroupModel");
function RuleSetDescriptor(ticket, applyRulesets) {
    if (applyRulesets === void 0) { applyRulesets = true; }
    return __awaiter(this, void 0, void 0, function () {
        var ruleSets, result, autoAssignSettings, previousTickets, lastHours, datetime, _a, assignedTicket_R, assignedTicket_A, assignedTicket_B, groupDetails, previousTickets, lastHours, datetime, _b, assignedTicket_R, assignedTicket_A, assignedTicket_B, error_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 29, , 30]);
                    return [4 /*yield*/, ticketsModel_1.Tickets.GetRulesets(ticket)];
                case 1:
                    ruleSets = _c.sent();
                    return [4 /*yield*/, ticketsModel_1.Tickets.ApplyRuleSets(ruleSets, ticket)];
                case 2:
                    result = _c.sent();
                    if (result && applyRulesets)
                        ticket = TicketDispatcher_1.TicketDispatcher(result.actions, ticket);
                    if (!(!ticket.assigned_to && ticket.group)) return [3 /*break*/, 15];
                    return [4 /*yield*/, TicketgroupModel_1.TicketGroupsModel.GetAutoAssign(ticket.nsp, ticket.group)];
                case 3:
                    autoAssignSettings = _c.sent();
                    if (!(autoAssignSettings && autoAssignSettings.length && autoAssignSettings[0].auto_assign.enabled)) return [3 /*break*/, 14];
                    previousTickets = [];
                    if (!(ticket.visitor && ticket.visitor.email && ticket.nsp == '/sbtjapaninquiries.com')) return [3 /*break*/, 6];
                    lastHours = 36;
                    datetime = new Date(addHours(lastHours)).toISOString();
                    return [4 /*yield*/, ticketsModel_1.Tickets.getTicketBySBTVisitor(ticket.nsp, datetime, ticket.visitor.email)];
                case 4:
                    // let previousTickets : any = [];
                    // console.log(ticket.group);
                    // console.log(ticket.assigned_to);
                    previousTickets = _c.sent();
                    if (!(ticket.group && (ticket.group.match(/INB/gmi) || ticket.group.match(/UK/gmi)))) return [3 /*break*/, 6];
                    return [4 /*yield*/, ticketsModel_1.Tickets.getTicketBySBTVisitorSpecialCase(ticket.nsp, datetime, ticket.visitor.email, ticket.group)];
                case 5:
                    previousTickets = _c.sent();
                    _c.label = 6;
                case 6:
                    if (!!previousTickets.length) return [3 /*break*/, 14];
                    _a = autoAssignSettings[0].auto_assign.type;
                    switch (_a) {
                        case 'roundrobin_turn': return [3 /*break*/, 7];
                        case 'availableagents': return [3 /*break*/, 9];
                        case 'roundrobin': return [3 /*break*/, 11];
                    }
                    return [3 /*break*/, 13];
                case 7:
                    console.log('Round Robin!');
                    return [4 /*yield*/, ticketsModel_1.Tickets.GetAgentInRoundRobin(ticket.group, ticket)];
                case 8:
                    assignedTicket_R = _c.sent();
                    if (assignedTicket_R)
                        ticket = assignedTicket_R;
                    return [3 /*break*/, 14];
                case 9: return [4 /*yield*/, ticketsModel_1.Tickets.FindBestAvailableAgentTicketInGroup(ticket.group, ticket)];
                case 10:
                    assignedTicket_A = _c.sent();
                    if (assignedTicket_A)
                        ticket = assignedTicket_A;
                    return [3 /*break*/, 14];
                case 11: return [4 /*yield*/, ticketsModel_1.Tickets.FindBestAgentTicketInGroup(ticket.group, ticket)];
                case 12:
                    assignedTicket_B = _c.sent();
                    if (assignedTicket_B)
                        ticket = assignedTicket_B;
                    return [3 /*break*/, 14];
                case 13: return [3 /*break*/, 14];
                case 14: return [3 /*break*/, 28];
                case 15:
                    if (!(ticket.assigned_to && ticket.group)) return [3 /*break*/, 28];
                    return [4 /*yield*/, TicketgroupModel_1.TicketGroupsModel.GetAutoAssign(ticket.nsp, ticket.group)];
                case 16:
                    groupDetails = _c.sent();
                    if (!(groupDetails && groupDetails.length && !groupDetails[0].agent_list.filter(function (a) { return a.email == ticket.assigned_to; }).length)) return [3 /*break*/, 28];
                    //run assignment
                    ticket.assigned_to = '';
                    if (!(groupDetails && groupDetails.length && groupDetails[0].auto_assign.enabled)) return [3 /*break*/, 27];
                    previousTickets = [];
                    if (!(ticket.visitor && ticket.visitor.email && ticket.nsp == '/sbtjapaninquiries.com')) return [3 /*break*/, 19];
                    lastHours = 36;
                    datetime = new Date(addHours(lastHours)).toISOString();
                    return [4 /*yield*/, ticketsModel_1.Tickets.getTicketBySBTVisitor(ticket.nsp, datetime, ticket.visitor.email)];
                case 17:
                    // let previousTickets : any = [];
                    // console.log(ticket.group);
                    // console.log(ticket.assigned_to);
                    previousTickets = _c.sent();
                    if (!(ticket.group && (ticket.group.match(/INB/gmi) || ticket.group.match(/UK/gmi)))) return [3 /*break*/, 19];
                    return [4 /*yield*/, ticketsModel_1.Tickets.getTicketBySBTVisitorSpecialCase(ticket.nsp, datetime, ticket.visitor.email, ticket.group)];
                case 18:
                    previousTickets = _c.sent();
                    _c.label = 19;
                case 19:
                    if (!!previousTickets.length) return [3 /*break*/, 27];
                    _b = groupDetails[0].auto_assign.type;
                    switch (_b) {
                        case 'roundrobin_turn': return [3 /*break*/, 20];
                        case 'availableagents': return [3 /*break*/, 22];
                        case 'roundrobin': return [3 /*break*/, 24];
                    }
                    return [3 /*break*/, 26];
                case 20:
                    console.log('Round Robin!');
                    return [4 /*yield*/, ticketsModel_1.Tickets.GetAgentInRoundRobin(ticket.group, ticket)];
                case 21:
                    assignedTicket_R = _c.sent();
                    if (assignedTicket_R)
                        ticket = assignedTicket_R;
                    return [3 /*break*/, 27];
                case 22: return [4 /*yield*/, ticketsModel_1.Tickets.FindBestAvailableAgentTicketInGroup(ticket.group, ticket)];
                case 23:
                    assignedTicket_A = _c.sent();
                    if (assignedTicket_A)
                        ticket = assignedTicket_A;
                    return [3 /*break*/, 27];
                case 24: return [4 /*yield*/, ticketsModel_1.Tickets.FindBestAgentTicketInGroup(ticket.group, ticket)];
                case 25:
                    assignedTicket_B = _c.sent();
                    if (assignedTicket_B)
                        ticket = assignedTicket_B;
                    return [3 /*break*/, 27];
                case 26: return [3 /*break*/, 27];
                case 27: return [3 /*break*/, 28];
                case 28: return [2 /*return*/, ticket];
                case 29:
                    error_1 = _c.sent();
                    console.log(error_1);
                    console.log('error in Ruleset Descriptor');
                    return [2 /*return*/, ticket];
                case 30: return [2 /*return*/];
            }
        });
    });
}
exports.RuleSetDescriptor = RuleSetDescriptor;
function addHours(hours) {
    return new Date().setTime(new Date().getTime() - (hours * 60 * 60 * 1000));
}
//# sourceMappingURL=RuleSetExecutor.js.map