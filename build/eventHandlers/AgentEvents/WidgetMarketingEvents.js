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
var widgetMarketingModel_1 = require("../../models/widgetMarketingModel");
var bson_1 = require("bson");
var WidgetMarketingEvents = /** @class */ (function () {
    function WidgetMarketingEvents() {
    }
    WidgetMarketingEvents.BindWidgetMarketingEvents = function (socket, origin) {
        WidgetMarketingEvents.AddNews(socket, origin);
        WidgetMarketingEvents.ToggleNews(socket, origin);
        WidgetMarketingEvents.GetNews(socket, origin);
        WidgetMarketingEvents.GetActiveNews(socket, origin);
        WidgetMarketingEvents.GetMoreNews(socket, origin);
        WidgetMarketingEvents.DeleteNews(socket, origin);
        WidgetMarketingEvents.AddPromotions(socket, origin);
        WidgetMarketingEvents.TogglePromotion(socket, origin);
        WidgetMarketingEvents.GetPromotions(socket, origin);
        WidgetMarketingEvents.GetActivePromotions(socket, origin);
        WidgetMarketingEvents.GetMorePromotions(socket, origin);
        WidgetMarketingEvents.DeletePromotion(socket, origin);
        WidgetMarketingEvents.AddFaq(socket, origin);
        WidgetMarketingEvents.ToggleFaq(socket, origin);
        WidgetMarketingEvents.GetFaqs(socket, origin);
        WidgetMarketingEvents.GetMoreFaqs(socket, origin);
        WidgetMarketingEvents.DeleteFaq(socket, origin);
    };
    // ----------- NEWS EVENTS ------------- //
    //Add News
    WidgetMarketingEvents.AddNews = function (socket, origin) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                socket.on('addNews', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
                    var obj, news;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                obj = {
                                    _id: new bson_1.ObjectID(),
                                    desc: data.news.desc,
                                    title: data.news.title,
                                    nsp: socket.handshake.session.nsp,
                                    active: true,
                                    image: data.news.image,
                                    link: data.news.link,
                                    background: data.news.background,
                                    createdOn: new Date().toISOString()
                                };
                                return [4 /*yield*/, widgetMarketingModel_1.WidgetMarketingModel.addNews(socket.handshake.session.nsp, obj)];
                            case 1:
                                news = _a.sent();
                                if (news && news.ops[0]) {
                                    callback({ status: 'ok', news: news.ops[0] });
                                }
                                else {
                                    callback({ status: 'error', msg: 'Cannot add news' });
                                }
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        });
    };
    //Toggle News
    WidgetMarketingEvents.ToggleNews = function (socket, origin) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                socket.on('toggleNews', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
                    var news;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, widgetMarketingModel_1.WidgetMarketingModel.ToggleNews(socket.handshake.session.nsp, data.newsId, data.check)];
                            case 1:
                                news = _a.sent();
                                if (news && news.value) {
                                    callback({ status: 'ok', news: news.value });
                                }
                                else {
                                    callback({ status: 'error', msg: 'Cannot toggle news' });
                                }
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        });
    };
    //Get News
    WidgetMarketingEvents.GetNews = function (socket, origin) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                socket.on('getNews', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
                    var wM, newsList;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                console.log('getNews');
                                return [4 /*yield*/, widgetMarketingModel_1.WidgetMarketingModel.getWidgetMarketing(socket.handshake.session.nsp)];
                            case 1:
                                wM = _a.sent();
                                if (!(wM && wM.length)) return [3 /*break*/, 3];
                                return [4 /*yield*/, widgetMarketingModel_1.WidgetMarketingModel.getNews(wM[0].news)];
                            case 2:
                                newsList = _a.sent();
                                console.log("news from db", newsList);
                                if (newsList && newsList.length) {
                                    wM[0].news = newsList;
                                    console.log("news", wM[0].news);
                                }
                                callback({ status: 'ok', widgetMarketing: wM[0] });
                                return [3 /*break*/, 4];
                            case 3:
                                callback({ status: 'error', msg: 'Cannot get news' });
                                _a.label = 4;
                            case 4: return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        });
    };
    //Get Acive News
    WidgetMarketingEvents.GetActiveNews = function (socket, origin) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                socket.on('getActiveNews', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
                    var activeNewsList;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, widgetMarketingModel_1.WidgetMarketingModel.getActiveNews(socket.handshake.session.nsp)];
                            case 1:
                                activeNewsList = _a.sent();
                                if (activeNewsList && activeNewsList.length) {
                                    callback({ status: 'ok', activeNewsList: activeNewsList });
                                }
                                else {
                                    callback({ status: 'error', msg: 'Cannot get active news' });
                                }
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        });
    };
    //Get More News
    WidgetMarketingEvents.GetMoreNews = function (socket, origin) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                socket.on('getMoreNews', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
                    var newsList;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!data.LastObjectId) return [3 /*break*/, 2];
                                return [4 /*yield*/, widgetMarketingModel_1.WidgetMarketingModel.getMoreNews(socket.handshake.session.nsp, data.LastObjectId)];
                            case 1:
                                newsList = _a.sent();
                                callback({ status: 'ok', newsList: newsList, ended: (newsList && newsList.length < 20) ? true : false });
                                return [3 /*break*/, 3];
                            case 2:
                                callback({ status: 'error', msg: 'Invalid Parameter - LastObjectId' });
                                _a.label = 3;
                            case 3: return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        });
    };
    //Delete News
    WidgetMarketingEvents.DeleteNews = function (socket, origin) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                socket.on('deleteNews', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
                    var news;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, widgetMarketingModel_1.WidgetMarketingModel.deleteNews(data.newsId, socket.handshake.session.nsp)];
                            case 1:
                                news = _a.sent();
                                if (news && news.deletedCount) {
                                    callback({ status: 'ok' });
                                }
                                else {
                                    callback({ status: 'error', msg: 'could not delete news' });
                                }
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        });
    };
    // ----------- NEWS EVENTS -------------- //
    // ----------- PROMOTION EVENTS --------- //
    //Add Promotion
    WidgetMarketingEvents.AddPromotions = function (socket, origin) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                socket.on('addPromotion', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
                    var obj, promotion;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                obj = {
                                    _id: new bson_1.ObjectID(),
                                    desc: data.promotion.desc,
                                    title: data.promotion.title,
                                    price: data.promotion.price,
                                    nsp: socket.handshake.session.nsp,
                                    type: data.promotion.type,
                                    active: true,
                                    image: data.promotion.image,
                                    currency: data.promotion.currency,
                                    link: data.promotion.link,
                                    background: data.promotion.background,
                                    createdOn: new Date().toISOString()
                                };
                                return [4 /*yield*/, widgetMarketingModel_1.WidgetMarketingModel.addPromotion(socket.handshake.session.nsp, obj)];
                            case 1:
                                promotion = _a.sent();
                                if (promotion && promotion.ops[0]) {
                                    callback({ status: 'ok', promotion: promotion.ops[0] });
                                }
                                else {
                                    callback({ status: 'error', msg: 'Cannot add Promotion' });
                                }
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        });
    };
    //Toggle Promotion
    WidgetMarketingEvents.TogglePromotion = function (socket, origin) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                socket.on('togglePromotion', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
                    var promotions;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, widgetMarketingModel_1.WidgetMarketingModel.TogglePromotion(socket.handshake.session.nsp, data.pId, data.check)];
                            case 1:
                                promotions = _a.sent();
                                if (promotions && promotions.value) {
                                    callback({ status: 'ok', promotion: promotions.value });
                                }
                                else {
                                    callback({ status: 'error', msg: 'Cannot toggle promotion' });
                                }
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        });
    };
    //Get Promotion
    WidgetMarketingEvents.GetPromotions = function (socket, origin) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                socket.on('getPromotions', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
                    var wM, promList;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, widgetMarketingModel_1.WidgetMarketingModel.getWidgetMarketing(socket.handshake.session.nsp)];
                            case 1:
                                wM = _a.sent();
                                if (!(wM && wM.length)) return [3 /*break*/, 3];
                                return [4 /*yield*/, widgetMarketingModel_1.WidgetMarketingModel.getPromotions(wM[0].promotions)];
                            case 2:
                                promList = _a.sent();
                                if (promList && promList.length) {
                                    wM[0].promotions = promList;
                                }
                                else {
                                    wM[0].promotions = [];
                                }
                                callback({ status: 'ok', widgetMarketing: wM[0] });
                                return [3 /*break*/, 4];
                            case 3:
                                callback({ status: 'error', msg: 'Cannot get promotions' });
                                _a.label = 4;
                            case 4: return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        });
    };
    //Get Acive Promotions
    WidgetMarketingEvents.GetActivePromotions = function (socket, origin) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                socket.on('getActivePromotions', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
                    var activePromList;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, widgetMarketingModel_1.WidgetMarketingModel.getActivePromotions(socket.handshake.session.nsp)];
                            case 1:
                                activePromList = _a.sent();
                                if (activePromList && activePromList.length) {
                                    callback({ status: 'ok', activePromList: activePromList });
                                }
                                else {
                                    callback({ status: 'error', msg: 'Cannot get active promotions' });
                                }
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        });
    };
    //Get More Promotions
    WidgetMarketingEvents.GetMorePromotions = function (socket, origin) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                socket.on('getMorePromotions', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
                    var promList;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!data.LastObjectId) return [3 /*break*/, 2];
                                return [4 /*yield*/, widgetMarketingModel_1.WidgetMarketingModel.getMoreNews(socket.handshake.session.nsp, data.LastObjectId)];
                            case 1:
                                promList = _a.sent();
                                callback({ status: 'ok', promList: promList, ended: (promList && promList.length < 20) ? true : false });
                                return [3 /*break*/, 3];
                            case 2:
                                callback({ status: 'error', msg: 'Invalid Parameter - LastObjectId' });
                                _a.label = 3;
                            case 3: return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        });
    };
    //Delete Promotion
    WidgetMarketingEvents.DeletePromotion = function (socket, origin) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                socket.on('deletePromotion', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
                    var promotion;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, widgetMarketingModel_1.WidgetMarketingModel.deletePromotion(data.pId, socket.handshake.session.nsp)];
                            case 1:
                                promotion = _a.sent();
                                if (promotion && promotion.deletedCount) {
                                    callback({ status: 'ok' });
                                }
                                else {
                                    callback({ status: 'error', msg: 'could not delete promotion' });
                                }
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        });
    };
    // ----------- PROMOTION EVENTS --------- //
    // ----------- FAQ EVENTS --------------- //
    //Add Faq
    WidgetMarketingEvents.AddFaq = function (socket, origin) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                socket.on('addFaq', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
                    var obj, faq, exists, faq;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                obj = {
                                    _id: new bson_1.ObjectID(),
                                    question: data.faq.question,
                                    answer: data.faq.answer,
                                    nsp: socket.handshake.session.nsp,
                                    createdBy: socket.handshake.session.email,
                                    createdOn: new Date().toISOString(),
                                    feedback: data.faq.feedback
                                };
                                if (!data.update) return [3 /*break*/, 2];
                                return [4 /*yield*/, widgetMarketingModel_1.WidgetMarketingModel.UpdateFaq(socket.handshake.session.nsp, obj)];
                            case 1:
                                faq = _a.sent();
                                if (faq && faq.value) {
                                    callback({ status: 'update', faq: faq.value });
                                }
                                else {
                                    callback({ status: 'error', msg: 'Cannot update faq' });
                                }
                                return [3 /*break*/, 6];
                            case 2: return [4 /*yield*/, widgetMarketingModel_1.WidgetMarketingModel.getFaqsByQuestion(socket.handshake.session.nsp, obj.question)];
                            case 3:
                                exists = _a.sent();
                                if (!!exists.length) return [3 /*break*/, 5];
                                return [4 /*yield*/, widgetMarketingModel_1.WidgetMarketingModel.addFaq(socket.handshake.session.nsp, obj)];
                            case 4:
                                faq = _a.sent();
                                if (faq && faq.ops[0]) {
                                    callback({ status: 'ok', faq: faq.ops[0] });
                                }
                                else {
                                    callback({ status: 'error', msg: 'Cannot add faq' });
                                }
                                return [3 /*break*/, 6];
                            case 5:
                                callback({ status: 'already-exists', msg: 'faq already exists' });
                                _a.label = 6;
                            case 6: return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        });
    };
    //Toggle Faq
    WidgetMarketingEvents.ToggleFaq = function (socket, origin) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                socket.on('toggleFaq', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
                    var faqs;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, widgetMarketingModel_1.WidgetMarketingModel.ToggleFaq(socket.handshake.session.nsp, data.fId, data.check)];
                            case 1:
                                faqs = _a.sent();
                                if (faqs && faqs.value) {
                                    callback({ status: 'ok', faq: faqs.value });
                                }
                                else {
                                    callback({ status: 'error', msg: 'Cannot toggle faq' });
                                }
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        });
    };
    //Get Faqs
    WidgetMarketingEvents.GetFaqs = function (socket, origin) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                socket.on('getFaqs', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
                    var wM, faqList;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, widgetMarketingModel_1.WidgetMarketingModel.getWidgetMarketing(socket.handshake.session.nsp)];
                            case 1:
                                wM = _a.sent();
                                if (!(wM && wM.length)) return [3 /*break*/, 3];
                                return [4 /*yield*/, widgetMarketingModel_1.WidgetMarketingModel.getFaqs(wM[0].faqs)];
                            case 2:
                                faqList = _a.sent();
                                if (faqList && faqList.length) {
                                    wM[0].faqs = faqList;
                                }
                                callback({ status: 'ok', widgetMarketing: wM[0] });
                                return [3 /*break*/, 4];
                            case 3:
                                callback({ status: 'error', msg: 'Cannot get faqs' });
                                _a.label = 4;
                            case 4: return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        });
    };
    //Get More Faqs
    WidgetMarketingEvents.GetMoreFaqs = function (socket, origin) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                socket.on('getMoreFaqs', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
                    var faqList;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!data.LastObjectId) return [3 /*break*/, 2];
                                return [4 /*yield*/, widgetMarketingModel_1.WidgetMarketingModel.getMoreFaqs(socket.handshake.session.nsp, data.LastObjectId)];
                            case 1:
                                faqList = _a.sent();
                                callback({ status: 'ok', faqList: faqList, ended: (faqList && faqList.length < 20) ? true : false });
                                return [3 /*break*/, 3];
                            case 2:
                                callback({ status: 'error', msg: 'Invalid Parameter - LastObjectId' });
                                _a.label = 3;
                            case 3: return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        });
    };
    //Delete Faq
    WidgetMarketingEvents.DeleteFaq = function (socket, origin) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                socket.on('deleteFaq', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
                    var faq;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, widgetMarketingModel_1.WidgetMarketingModel.deleteFaq(data.fId, socket.handshake.session.nsp)];
                            case 1:
                                faq = _a.sent();
                                if (faq && faq.deletedCount) {
                                    callback({ status: 'ok' });
                                }
                                else {
                                    callback({ status: 'error', msg: 'could not delete faq' });
                                }
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        });
    };
    return WidgetMarketingEvents;
}());
exports.WidgetMarketingEvents = WidgetMarketingEvents;
//# sourceMappingURL=WidgetMarketingEvents.js.map