"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
var bson_1 = require("bson");
//Native Modules
var ticketTemplateModel_1 = require("../../models/ticketTemplateModel");
var agentModel_1 = require("../../models/agentModel");
var TicketTemplateEvents = /** @class */ (function () {
    function TicketTemplateEvents() {
    }
    TicketTemplateEvents.BindTicketTemplateEvents = function (socket, origin) {
        TicketTemplateEvents.GetAllTicketTemplatesByNSP(socket, origin);
        TicketTemplateEvents.AddTicketTemplate(socket, origin);
        TicketTemplateEvents.UpdateTicketTemplate(socket, origin);
        TicketTemplateEvents.DeleteTicketTemplate(socket, origin);
        TicketTemplateEvents.GetResponseByAgent(socket, origin);
        // TicketTemplateEvents.getTemplates(socket, origin);
    };
    //CRUD
    TicketTemplateEvents.AddTicketTemplate = function (socket, origin) {
        var _this = this;
        socket.on('addTicketTemplate', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var template, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        data.templateObj.cannedForm = new bson_1.ObjectID(data.templateObj.cannedForm);
                        return [4 /*yield*/, ticketTemplateModel_1.TicketTemplateModel.AddTicketTemplate(data.templateObj)];
                    case 1:
                        template = _a.sent();
                        if (template) {
                            callback({ status: 'ok', templateInserted: template.ops[0] });
                        }
                        else {
                            callback({ status: 'error', code: 500, msg: 'Internal Server Error' });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.log(error_1);
                        console.log('error in creating ticket Template');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    TicketTemplateEvents.DeleteTicketTemplate = function (socket, origin) {
        var _this = this;
        socket.on('deleteTicketTemplate', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var result, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, ticketTemplateModel_1.TicketTemplateModel.DeleteTicketTemplate(data.id, socket.handshake.session.nsp)];
                    case 1:
                        result = _a.sent();
                        if (result) {
                            callback({ status: 'ok', msg: "Ticket Template Deleted Successfully!" });
                        }
                        else {
                            callback({ status: 'error' });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        callback({ status: 'error', msg: error_2 });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    TicketTemplateEvents.UpdateTicketTemplate = function (socket, origin) {
        var _this = this;
        socket.on('updateTicketTemplate', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var templateEdited, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        data.ticketTemplate.lastModified = {};
                        data.ticketTemplate.lastModified.date = new Date().toISOString();
                        data.ticketTemplate.lastModified.by = socket.handshake.session.email;
                        return [4 /*yield*/, ticketTemplateModel_1.TicketTemplateModel.UpdateTicketTemplate(data.tid, data.ticketTemplate, socket.handshake.session.nsp)];
                    case 1:
                        templateEdited = _a.sent();
                        if (templateEdited && templateEdited.value) {
                            callback({ status: 'ok', templateEdited: templateEdited.value });
                        }
                        else {
                            callback({ status: 'error', code: 500, msg: 'Internal Server Error' });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        console.log(error_3);
                        console.log('error in editing ticket Template');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    TicketTemplateEvents.GetAllTicketTemplatesByNSP = function (socket, origin) {
        var _this = this;
        socket.on('getAllTicketTemplatesByNSP', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var templates, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, ticketTemplateModel_1.TicketTemplateModel.getTicketTemplatesByNSP(socket.handshake.session.nsp)];
                    case 1:
                        templates = _a.sent();
                        if (templates && templates.length) {
                            callback({ status: 'ok', templates: templates });
                        }
                        else {
                            callback({ status: 'error', code: 500, msg: 'Internal Server Error' });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        console.log(error_4);
                        console.log('error in Getting ticket Templates');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    // private static getTemplates(socket, origin: SocketIO.Namespace){
    //     socket.on('getTemplates', async (data, callback) => {
    //         try {
    //             await Agents.getAgentsAgainstGroup(socket.handshake.session.nsp,)
    //             let template = await TicketTemplateModel.getTemplates(data.agent,socket.handshake.session.nsp);
    //             // if (template && template.length) {
    //             //     callback({ status: 'ok', template: template });
    //             // } else {
    //             //     callback({ status: 'error', code: 500, msg: 'Internal Server Error' });
    //             // }
    //         } catch (error) {
    //             console.log(error);
    //             console.log('error in Getting ticket Templates')
    //         }
    //     });
    // }
    TicketTemplateEvents.GetResponseByAgent = function (socket, origin) {
        var _this = this;
        socket.on('getResponseByAgent', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var responses, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, agentModel_1.Agents.getResponseByAgent(socket.handshake.session.nsp, socket.handshake.session.email)];
                    case 1:
                        responses = _a.sent();
                        if (responses && responses.length) {
                            console.log("responses", responses);
                            callback({ status: 'ok', cannedResponses: responses[0].automatedMessages });
                        }
                        else {
                            callback({ status: 'error', code: 500, msg: 'Internal Server Error' });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_5 = _a.sent();
                        console.log(error_5);
                        console.log('error in Getting ticket Templates');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    return TicketTemplateEvents;
}());
exports.TicketTemplateEvents = TicketTemplateEvents;
//# sourceMappingURL=ticketTemplateEvents.js.map