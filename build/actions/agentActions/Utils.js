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
exports.Utils = void 0;
var agentModel_1 = require("./../../models/agentModel");
var TicketgroupModel_1 = require("./../../models/TicketgroupModel");
var path = require("path");
var ticketsModel_1 = require("../../models/ticketsModel");
var sessionsManager_1 = require("../../globals/server/sessionsManager");
var Utils = /** @class */ (function () {
    function Utils() {
    }
    Utils.GetAgentTicketMessage = function (message, timeZone) {
        try {
            var body_1 = '';
            if (message.attachment) {
                message.body.map(function (item) {
                    switch (Utils.GetMimeType(item.path)) {
                        case 'image':
                            body_1 += "<img src='" + item.path + "' width='100%'><br>";
                            break;
                        case 'audio':
                            body_1 += "<audio controls><source src=\"" + item.path + "\" type=\"audio/mp3\">" + item.filename + "</audio><br>";
                            break;
                        case 'video':
                            body_1 += "<video width=\"320\" height=\"240\" controls><source src=\"" + item.path + "\" type=\"video/mp4\">" + item.filename + "</video><br>";
                            break;
                        // case 'document':
                        //     body += `<a href="${item.path}" target="_blank">${item.filename}</a><br>`;
                        default:
                            body_1 += "<a href=\"" + item.path + "\" target=\"_blank\">" + item.filename + "</a><br>";
                            // body += item.path + '<br>';
                            break;
                    }
                });
            }
            else {
                body_1 += message.body;
            }
            var result = "\n            <tr>\n                <td>\n                    <div style=\"width:100%;color:#000;margin-bottom:10px;display:block;position:relative;\">\n                    <div style=\"float:right;display:grid;width:fit-content;padding:10px 20px;margin-bottom:5px;border-radius:20px;background-color:rgba(210, 214, 222, 0.4);text-align:left;\">\n                        <p style=\"margin:0 !important;white-space:pre-line !important;\">" + body_1 + "</p>\n                    </div>\n                    <div style=\"clear:both;\"></div>\n                    <small style=\"opacity:0.5;text-transform:uppercase;text-align:left;font-size:10px;font-weight:bold;float:right;padding-left: 10px;\">" + new Date(message.date).toLocaleString('en-US', { timeZone: timeZone }) + "</small>\n                    <div style=\"clear:both;\"></div>\n                </div>\n                </td>\n            </tr>";
            return result;
        }
        catch (error) {
            console.log(error);
            console.log('error in GetVisitor Ticket MEssage');
        }
    };
    Utils.GetVisitorTicketMessage = function (message, timeZone, color) {
        var body = '';
        if (message.attachment) {
            message.body.map(function (item) {
                switch (Utils.GetMimeType(item.path)) {
                    case 'image':
                        body += "<img src='" + item.path + "' width='100%'><br>";
                        break;
                    case 'audio':
                        body += "<audio controls><source src=\"" + item.path + "\" type=\"audio/mp3\">" + item.filename + "</audio><br>";
                        break;
                    case 'video':
                        body += "<video width=\"320\" height=\"240\" controls><source src=\"" + item.path + "\" type=\"video/mp4\">" + item.filename + "</video><br>";
                        break;
                    // case 'document':
                    //     // body += `<a href="${item.path}" target="_blank">${item.filename}</a><br>`;
                    //     break;
                    default:
                        body += "<a href=\"" + item.path + "\" target=\"_blank\">" + item.filename + "</a><br>";
                        // body += item.path + '<br>';
                        break;
                }
            });
        }
        else {
            body += message.body;
        }
        return "\n        <tr>\n            <td>\n                <div style=\"width:100%;color:#000;margin-bottom:10px;display:block;position:relative;\">\n                    <div style=\"float:left;display:grid;width:fit-content;padding:10px 20px;margin-bottom:5px;border-radius:20px;background-color:rgba(255, 97, 0, 0.3);text-align:left;\">\n                        <p style=\"margin:0 !important;white-space:pre-line !important;\">" + body + "</p>\n                    </div>\n                    <div style=\"clear:both;\"></div>\n                    <small style=\"opacity:0.5;text-transform:uppercase;text-align:left;font-size:10px;font-weight:bold;float:left;padding-left: 10px;\">" + new Date(message.date).toLocaleString('en-US', { timeZone: timeZone }) + "</small>\n                    <div style=\"clear:both;\"></div>\n                </div>\n            </td>\n      </tr>";
    };
    Utils.GetEventsTicketMessage = function (message, timeZone, color) {
        return "\n        <tr>\n            <td>\n                <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\">\n                    <tbody>\n                        <tr>\n                            <td style=\"width:200px\">\n                                <div style=\"height:1px;background-color:#e8e8e8;width:100%;\"></div>\n                            </td>\n                            <td style=\"max-width:400px;\">\n                                <div style=\"width:100%;color:#000;margin-bottom:10px;display:block;position:relative;\">\n                                    <div style=\"width:max-content;display:flex;align-items:center;flex-direction:column;justify-content:center;padding:10px 20px;margin:0 auto;border-radius:20px;background-color:#fbfbfb;text-align:left;\">\n                                        <p style=\"margin:0 !important;white-space:pre-line;text-align:center;font-size:12px;\">\n                                            <span>" + message.body + "</span>\n                                            <span style=\"color:#56a6ff;white-space:nowrap;line-height:20px;\">" + new Date(message.date).toLocaleString('en-US', { timeZone: timeZone }) + "</span>\n                                        </p>\n                                    </div>\n                                    <div style=\"clear:both;\"></div>\n                                </div>\n                            </td>\n                            <td style=\"width:200px\">\n                                <div style=\"height:1px;background-color:#e8e8e8;width:100%;\"></div>\n                            </td>\n                        </tr>\n                    </tbody>\n                </table>\n            </td>\n      </tr>";
    };
    Utils.GenerateTicketString = function (messages, visitorName, visitorEmail, chatID) {
        return "<!DOCTYPE html>\n            <html lang=\"en\">\n                <head>\n                    <meta charset=\"UTF-8\" />\n                    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n                    <meta http-equiv=\"X-UA-Compatible\" content=\"ie=edge\" />\n                    <title>Document</title>\n                    <link\n                    href=\"https://fonts.googleapis.com/css?family=Montserrat&display=swap\"\n                    rel=\"stylesheet\"\n                    />\n                    <!-- <link\n                    rel=\"stylesheet\"\n                    href=\"https://d24urpuqgp4by2.cloudfront.net/v1.0/css/uikit.bundle.min.css\"\n                    /> -->\n                    <style>\n                    * {\n                        margin: 0;\n                        padding: 0;\n                        border: 0;\n                        border-collapse: collapse;\n                        outline: none;\n                        list-style: none;\n                        background: none;\n                        text-decoration: none;\n                        border-spacing: 0;\n                        box-sizing: border-box;\n                        -webkit-text-size-adjust: 100%;\n                        -ms-text-size-adjust: 100%;\n                    }\n                    </style>\n                </head>\n                <body style=\"background-color: #f2f3f3;padding: 10px\">\n                    <table style=\"width: 600px;margin:auto;background-color: white\">\n                    <tr>\n                        <td>\n                        <table style=\"font-family: 'Montserrat', sans-serif;width: 100%;\">\n                            <tr>\n                                <th>\n                                    <h2 style=\"text-align:center;margin-bottom:0;margin-top:20px;padding-bottom:0;\">Ticket From Chat</h2>\n                                </th>\n                            </tr>\n                            <tr>\n                                <td style=\"text-align:center;margin-bottom:0;margin-top:20px;padding-bottom:0;\">\n                                    <p style=\"display:flex;align-items:center;flex-direction:column;padding: 4px;font-size: 12px;margin-bottom: 10px!important;font-weight: 600\">" + ((visitorName) ? 'Name: ' + visitorName + '<br>' : '') + ('Email: ' + visitorEmail) + "<br>" + ('Chat id: <span style="color:#ff681f;">' + chatID + '</span>') + "</p>\n                                </td>\n                            </tr>\n                        </table>\n\n                        <table style=\"width: 100%;\">\n                            <tr>\n                            <td style=\"padding: 10px;\">\n                                <table class=\"message-box\" style=\"width:100%\">\n                                <tr>\n                                    <td>\n                                        <table style=\"width:100%;margin-bottom: 20px;\">" + messages + "</table>\n                                    </td>\n                                </tr>\n                                </table>\n                            </td>\n                            </tr>\n                        </table>\n                        </td>\n                    </tr>\n                    </table>\n                </body>\n            </html>\n            ";
    };
    Utils.GetStateKey = function (state) {
        switch (state.toString()) {
            case '1': return 'Browsing';
            case '2': return 'Queued';
            case '3': return 'Chatting';
            case '4': return 'Invited';
            default: return '';
        }
    };
    Utils.GetMimeType = function (url) {
        switch (path.extname(url).toLowerCase()) {
            case 'png':
            case 'jpeg':
            case 'jpg':
            case 'bmp':
            case 'svg':
            case 'gif':
                return 'image';
            case 'mp3':
                return 'audio';
            case 'mp4':
            case 'm4a':
            case 'm4v':
            case 'f4v':
            case 'm4b':
            case 'f4b':
            case 'mov':
                return 'video';
            case 'pdf':
            case 'xlsx':
            case 'docx':
            case 'doc':
            case 'txt':
            case 'csv':
                return 'document';
            default:
                return 'data';
        }
    };
    Utils.GroupAutoAssign = function () {
        return __awaiter(this, void 0, void 0, function () {
            var currentTime, lockDay, currentDateTime, datetime, dateStr, lessthanDatetime, previousTickets;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        currentTime = new Date();
                        lockDay = new Date().toString().split(' ')[0];
                        currentDateTime = new Date().toISOString();
                        datetime = new Date(this.addHours(48)).toISOString();
                        console.log('Greater than: ' + datetime);
                        dateStr = new Date().toISOString().split('T');
                        dateStr[1] = '19:00:00:000Z';
                        lessthanDatetime = dateStr[0] + 'T' + dateStr[1];
                        console.log('Less Than: ', lessthanDatetime);
                        if (!(lockDay != 'Sun')) return [3 /*break*/, 2];
                        return [4 /*yield*/, ticketsModel_1.Tickets.getPreviousTicketsByNSP('/localhost.com', datetime, lessthanDatetime)];
                    case 1:
                        previousTickets = _a.sent();
                        if (previousTickets && previousTickets.length) {
                            previousTickets.map(function (ticket) { return __awaiter(_this, void 0, void 0, function () {
                                var generalsettingsdata_1, unEntertainedTickets, logSchema;
                                var _this = this;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            ticket.entertained = false;
                                            ticket.iterationcount = 0;
                                            if (!(!ticket.entertained && (ticket.sbtVisitor || ticket.sbtVisitorPhone || ticket.source == 'livechat' || ticket.source == 'email' || ticket.visitor.phone)
                                                && (!ticket.CustomerInfo || ticket.CustomerInfo && ticket.CustomerInfo.salesPersonName == 'FREE'))) return [3 /*break*/, 3];
                                            if (!ticket.group) return [3 /*break*/, 3];
                                            return [4 /*yield*/, TicketgroupModel_1.TicketGroupsModel.getGeneralSettings('/localhost.com', ticket.group)];
                                        case 1:
                                            generalsettingsdata_1 = _a.sent();
                                            if (!generalsettingsdata_1.enabled) return [3 /*break*/, 3];
                                            return [4 /*yield*/, ticketsModel_1.Tickets.getMessagesByTicketId([ticket._id])];
                                        case 2:
                                            unEntertainedTickets = _a.sent();
                                            if (unEntertainedTickets && unEntertainedTickets.length) {
                                                ticket.entertained = true;
                                            }
                                            else
                                                ticket.entertained = false;
                                            Array(generalsettingsdata_1.assignmentLimit).fill(0).map(function (limit) { return __awaiter(_this, void 0, void 0, function () {
                                                var logSchema, logSchema;
                                                return __generator(this, function (_a) {
                                                    ticket.iterationcount = ticket.iterationcount + 1;
                                                    if (!ticket.entertained && (!ticket.checkingTime || currentDateTime > ticket.checkingTime)) {
                                                        ticket.checkingTime = new Date(currentTime.setMinutes(currentTime.getMinutes() + generalsettingsdata_1.unEntertainedTime)).toISOString();
                                                        ticket = this.getBestFittedAgentInShiftTimes(ticket.group, ticket);
                                                        if (ticket.assigned_to != '') {
                                                            logSchema = {
                                                                title: 'Ticket Assigned to Shift Time Agent',
                                                                status: ticket.assigned_to,
                                                                updated_by: 'Group Auto Assignment',
                                                                user_type: 'Group Auto Assignment',
                                                                time_stamp: new Date().toISOString()
                                                            };
                                                            ticket.ticketlog.push(logSchema);
                                                        }
                                                        else {
                                                            ticket.assigned_to = generalsettingsdata_1.fallbackNoShift;
                                                            logSchema = {
                                                                title: 'Ticket Assigned to Fallback Agent (no-one in shift)',
                                                                status: ticket.assigned_to,
                                                                updated_by: 'Group Auto Assignment',
                                                                user_type: 'Group Auto Assignment',
                                                                time_stamp: new Date().toISOString()
                                                            };
                                                            ticket.ticketlog.push(logSchema);
                                                        }
                                                        ticket.iterationcount = ticket.iterationcount + 1;
                                                        // await Tickets.UpdateTicketObj(ticket);
                                                    }
                                                    return [2 /*return*/];
                                                });
                                            }); });
                                            if (ticket.iterationcount >= generalsettingsdata_1.assignmentLimit + 1) {
                                                ticket.assigned_to = generalsettingsdata_1.fallbackLimitExceed;
                                                logSchema = {
                                                    title: 'Ticket Assigned to Fallback Agent (re-assignment limit exceeded)',
                                                    status: ticket.assigned_to,
                                                    updated_by: 'Group Auto Assignment',
                                                    user_type: 'Group Auto Assignment',
                                                    time_stamp: new Date().toISOString()
                                                };
                                                ticket.ticketlog.push(logSchema);
                                            }
                                            _a.label = 3;
                                        case 3: return [4 /*yield*/, ticketsModel_1.Tickets.UpdateTicketObj(ticket)];
                                        case 4:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); });
                        }
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    Utils.getBestFittedAgentInShiftTimes = function (group, ticket) {
        return __awaiter(this, void 0, void 0, function () {
            var response, checkIfExists, filteredAgents_1, currentDateTime, count_1, bestAgent_1, groups_1, onlineAgents, shiftOut, shiftend, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        response = [];
                        checkIfExists = false;
                        filteredAgents_1 = [];
                        currentDateTime = new Date().toISOString();
                        count_1 = 0;
                        bestAgent_1 = '';
                        return [4 /*yield*/, TicketgroupModel_1.TicketGroupsModel.getGroupByName(ticket.nsp, ticket.group)];
                    case 1:
                        groups_1 = _a.sent();
                        if (!(groups_1 && groups_1.length)) return [3 /*break*/, 3];
                        return [4 /*yield*/, sessionsManager_1.SessionManager.getAllLiveAgentsByEmails(ticket.nsp, groups_1[0].agent_list.map(function (a) { return a.email; }))];
                    case 2:
                        onlineAgents = _a.sent();
                        onlineAgents = [{ email: 'mufahad9213@sbtjapan.com' }];
                        if (onlineAgents && onlineAgents.length) {
                            onlineAgents.map(function (agent) {
                                filteredAgents_1.push({
                                    email: agent.email,
                                    count: groups_1[0].agent_list.filter(function (a) { return a.email == agent.email; })[0].count,
                                    isAdmin: groups_1[0].agent_list.filter(function (a) { return a.email == agent.email; })[0].isAdmin,
                                    excluded: groups_1[0].agent_list.filter(function (a) { return a.email == agent.email; })[0].excluded
                                });
                            });
                            groups_1[0].agent_list = filteredAgents_1;
                        }
                        else {
                            groups_1[0].agent_list = [];
                        }
                        groups_1[0].agent_list.filter(function (a) { return !a.excluded; }).map(function (agent, index) {
                            if (index == 0) {
                                count_1 = agent.count;
                                bestAgent_1 = agent.email;
                                return;
                            }
                            else {
                                if (agent.count < count_1) {
                                    bestAgent_1 = agent.email;
                                    count_1 = agent.count;
                                }
                            }
                        });
                        _a.label = 3;
                    case 3:
                        if (!bestAgent_1) return [3 /*break*/, 5];
                        return [4 /*yield*/, agentModel_1.Agents.getAgentByShiftTime(bestAgent_1, ticket.nsp)];
                    case 4:
                        response = _a.sent();
                        if (response) {
                            shiftOut = new Date(new Date().toLocaleDateString() + ' ' + response.ShiftEnd.split(':')[0] + ':' + ' ' + response.ShiftEnd.split(':')[1]);
                            shiftend = shiftOut.toISOString();
                            checkIfExists = currentDateTime < shiftend;
                        }
                        if (checkIfExists) {
                            ticket.assigned_to = bestAgent_1;
                            TicketgroupModel_1.TicketGroupsModel.IncrementCountOfAgent(ticket.nsp, ticket.group, bestAgent_1);
                        }
                        else {
                            ticket.assigned_to = '';
                        }
                        return [3 /*break*/, 6];
                    case 5:
                        ticket.assigned_to = '';
                        _a.label = 6;
                    case 6: return [2 /*return*/, ticket];
                    case 7:
                        err_1 = _a.sent();
                        console.log(err_1);
                        console.log('Error in Finding Best AGent Ticket');
                        return [2 /*return*/, undefined];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    Utils.addHours = function (hours) {
        return new Date().setTime(new Date().getTime() - (hours * 60 * 60 * 1000));
    };
    Utils.GenerateTicketTemplate = function (messages, visitorName, visitorEmail, chatID, viewcolor, timeZone) {
        var _this = this;
        try {
            var messageString_1 = '';
            if (!timeZone)
                timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            messages.map(function (message) {
                if (message.type == 'Visitors') {
                    messageString_1 += _this.GetVisitorTicketMessage(message, timeZone, viewcolor);
                    // console.log(messageString);
                }
                else if (message.type == 'Agents') {
                    messageString_1 += _this.GetAgentTicketMessage(message, timeZone);
                    // console.log(messageString);
                }
                else if (message.type == 'Events') {
                    messageString_1 += _this.GetEventsTicketMessage(message, timeZone);
                    // console.log(messageString);
                }
            });
            return this.GenerateTicketString(messageString_1, visitorName, visitorEmail, chatID);
        }
        catch (error) {
            console.log(error);
            console.log('error in Generating Ticket Template');
            return '';
        }
    };
    return Utils;
}());
exports.Utils = Utils;
//# sourceMappingURL=Utils.js.map