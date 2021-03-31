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
var visitorSessionmodel_1 = require("../../models/visitorSessionmodel");
var conversationModel_1 = require("../../models/conversationModel");
var ticketsModel_1 = require("../../models/ticketsModel");
var AnalyticsEvents = /** @class */ (function () {
    function AnalyticsEvents() {
    }
    AnalyticsEvents.BindAnalyticsEvents = function (socket, origin) {
        AnalyticsEvents.GetVisitors(socket, origin);
        AnalyticsEvents.GetConversations(socket, origin);
        AnalyticsEvents.GetTickets(socket, origin);
    };
    AnalyticsEvents.GetVisitors = function (socket, origin) {
        socket.on('analytics_getvisitors', function (data, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var visitors, err_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, visitorSessionmodel_1.visitorSessions.getVisitorSessions(data.visitorIDs)];
                        case 1:
                            visitors = _a.sent();
                            callback({ visitors: visitors });
                            return [3 /*break*/, 3];
                        case 2:
                            err_1 = _a.sent();
                            console.log('Error in analytics_getvisitors');
                            console.log(err_1);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        });
    };
    AnalyticsEvents.GetConversations = function (socket, origin) {
        socket.on('analytics_getconversations', function (data, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var conversations, err_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, conversationModel_1.Conversations.getConversationsByIDs(data.convIDs)];
                        case 1:
                            conversations = _a.sent();
                            callback({ conversations: conversations });
                            return [3 /*break*/, 3];
                        case 2:
                            err_2 = _a.sent();
                            console.log('Error in analytics_getconversations');
                            console.log(err_2);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        });
    };
    AnalyticsEvents.GetTickets = function (socket, origin) {
        socket.on('analytics_gettickets', function (data, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var tickets, err_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, ticketsModel_1.Tickets.getTicketssByIDs(data.ticketIDs)];
                        case 1:
                            tickets = _a.sent();
                            callback({ tickets: tickets });
                            return [3 /*break*/, 3];
                        case 2:
                            err_3 = _a.sent();
                            console.log('Error in analytics_gettickets');
                            console.log(err_3);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        });
    };
    return AnalyticsEvents;
}());
exports.AnalyticsEvents = AnalyticsEvents;
//# sourceMappingURL=analyticsEvents.js.map