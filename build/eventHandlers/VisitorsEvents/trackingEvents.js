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
var sessionsManager_1 = require("../../globals/server/sessionsManager");
var widgetMarketingModel_1 = require("../../models/widgetMarketingModel");
var Trackingevents = /** @class */ (function () {
    function Trackingevents() {
    }
    Trackingevents.BindTrackingEvents = function (socket, origin) {
        //Updated To Multiple Agents
        Trackingevents.GetLiveAgents(socket, origin);
        Trackingevents.GetFAQS(socket, origin);
        Trackingevents.GetNews(socket, origin);
        Trackingevents.GetPromotions(socket, origin);
    };
    Trackingevents.GetLiveAgents = function (socket, origin) {
        var _this = this;
        socket.on('getAvailableAgents', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var liveAgents, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, sessionsManager_1.SessionManager.GetLiveAvailableAgentForVisitors(socket.handshake.session.nsp)];
                    case 1:
                        liveAgents = _a.sent();
                        callback({ status: 'ok', agentsList: (liveAgents && liveAgents.length) ? liveAgents : [] });
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.log(error_1);
                        console.log('Error in Getting Live Agents Visitor Event');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    Trackingevents.GetFAQS = function (socket, origin) {
        var _this = this;
        socket.on('getFAQS', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var faqs, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        //TODO BASED ON TEXT SEARCH
                        if (!data.text) {
                            callback({ error: 'invalidRequest' });
                            return [2 /*return*/, []];
                        }
                        return [4 /*yield*/, widgetMarketingModel_1.WidgetMarketingModel.getFaqsByQuestion(socket.handshake.session.nsp, data.text)];
                    case 1:
                        faqs = _a.sent();
                        callback({ status: 'ok', FAQS: faqs });
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        console.log('error in getting Promotions');
                        callback({ status: 'error' });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    Trackingevents.GetNews = function (socket, origin) {
        var _this = this;
        socket.on('getNews', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var news, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, widgetMarketingModel_1.WidgetMarketingModel.getActiveNews(socket.handshake.session.nsp)];
                    case 1:
                        news = _a.sent();
                        callback({ status: 'ok', news: (news && news.length) ? news : [] });
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        console.log('error in getting News');
                        callback({ status: 'error' });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    Trackingevents.GetPromotions = function (socket, origin) {
        var _this = this;
        socket.on('getPromotions', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var promotions, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, widgetMarketingModel_1.WidgetMarketingModel.getActivePromotions(socket.handshake.session.nsp)];
                    case 1:
                        promotions = _a.sent();
                        callback({ status: 'ok', promotions: promotions });
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        console.log('error in getting Promotions');
                        callback({ status: 'error' });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    return Trackingevents;
}());
exports.Trackingevents = Trackingevents;
//# sourceMappingURL=trackingEvents.js.map