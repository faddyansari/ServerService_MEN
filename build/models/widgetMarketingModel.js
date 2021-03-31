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
exports.WidgetMarketingModel = void 0;
var mongodb_1 = require("mongodb");
var Marketing_DB_1 = require("../globals/config/databses/Marketing-DB");
var WidgetMarketingModel = /** @class */ (function () {
    function WidgetMarketingModel() {
    }
    WidgetMarketingModel.Initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, error_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 8, , 9]);
                        _a = this;
                        return [4 /*yield*/, Marketing_DB_1.MarketingDB.connect()];
                    case 1:
                        _a.db = _c.sent();
                        _b = this;
                        return [4 /*yield*/, this.db.createCollection('widgetMarketing')];
                    case 2:
                        _b.collection = _c.sent();
                        return [4 /*yield*/, this.db.createCollection('news')];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, this.db.createCollection('promotions')];
                    case 4:
                        _c.sent();
                        return [4 /*yield*/, this.db.createCollection('faqs')];
                    case 5:
                        _c.sent();
                        return [4 /*yield*/, this.db.createCollection('ICONNOtherPorts')];
                    case 6:
                        _c.sent();
                        // await this.db.createCollection('addressBook');
                        return [4 /*yield*/, this.db.collection('faqs').createIndex({ question: "text" })];
                    case 7:
                        // await this.db.createCollection('addressBook');
                        _c.sent();
                        console.log(this.collection.collectionName);
                        WidgetMarketingModel.initialized = true;
                        return [2 /*return*/, WidgetMarketingModel.initialized];
                    case 8:
                        error_1 = _c.sent();
                        console.log('error in Initializing widgetMarketing Model');
                        throw new Error(error_1);
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    WidgetMarketingModel.addNews = function (nsp, news) {
        return __awaiter(this, void 0, void 0, function () {
            var newsList, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, this.db.collection('news').find({ nsp: nsp, active: true }).toArray()];
                    case 1:
                        newsList = _a.sent();
                        if (!(!newsList.length || newsList.length < 5)) return [3 /*break*/, 3];
                        this.collection.findOneAndUpdate({ nsp: nsp }, { $push: { news: news._id } }, { returnOriginal: false, upsert: true });
                        return [4 /*yield*/, this.db.collection('news').insertOne(news)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        news.active = false;
                        this.collection.findOneAndUpdate({ nsp: nsp }, { $push: { news: news._id } }, { returnOriginal: false, upsert: true });
                        return [4 /*yield*/, this.db.collection('news').insertOne(news)];
                    case 4: return [2 /*return*/, _a.sent()];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_2 = _a.sent();
                        console.log('Error in adding News');
                        console.log(error_2);
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    WidgetMarketingModel.addPromotion = function (nsp, promotion) {
        return __awaiter(this, void 0, void 0, function () {
            var error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        this.collection.findOneAndUpdate({ nsp: nsp }, { $push: { promotions: promotion._id } }, { returnOriginal: false, upsert: true });
                        return [4 /*yield*/, this.db.collection('promotions').insertOne(promotion)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_3 = _a.sent();
                        console.log('Error in adding Promotions');
                        console.log(error_3);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    WidgetMarketingModel.addFaq = function (nsp, faq) {
        return __awaiter(this, void 0, void 0, function () {
            var error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        this.collection.findOneAndUpdate({ nsp: nsp }, { $push: { faqs: faq._id } }, { returnOriginal: false, upsert: true });
                        return [4 /*yield*/, this.db.collection('faqs').insertOne(faq)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_4 = _a.sent();
                        console.log('Error in adding FAQ');
                        console.log(error_4);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    WidgetMarketingModel.UpdateFaq = function (nsp, faq) {
        return __awaiter(this, void 0, void 0, function () {
            var error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.db.collection('faqs').findOneAndUpdate({ nsp: nsp, question: faq.question }, { $set: { answer: faq.answer } }, { returnOriginal: false, upsert: false })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_5 = _a.sent();
                        console.log('Error in adding FAQ');
                        console.log(error_5);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    WidgetMarketingModel.deleteNews = function (newsId, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        this.collection.findOneAndUpdate({ nsp: nsp }, { $pull: { news: new mongodb_1.ObjectId(newsId) } }, { returnOriginal: false, upsert: false });
                        return [4 /*yield*/, this.db.collection('news').deleteOne({ _id: new mongodb_1.ObjectId(newsId) })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_6 = _a.sent();
                        console.log('Error in adding News');
                        console.log(error_6);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    WidgetMarketingModel.deletePromotion = function (pId, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        this.collection.findOneAndUpdate({ nsp: nsp }, { $pull: { promotions: new mongodb_1.ObjectId(pId) } }, { returnOriginal: false, upsert: false });
                        return [4 /*yield*/, this.db.collection('promotions').deleteOne({ _id: new mongodb_1.ObjectId(pId) })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_7 = _a.sent();
                        console.log('Error in adding News');
                        console.log(error_7);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    WidgetMarketingModel.deleteFaq = function (fId, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        this.collection.findOneAndUpdate({ nsp: nsp }, { $pull: { faqs: new mongodb_1.ObjectId(fId) } }, { returnOriginal: false, upsert: false });
                        return [4 /*yield*/, this.db.collection('faqs').deleteOne({ _id: new mongodb_1.ObjectId(fId) })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_8 = _a.sent();
                        console.log('Error in adding News');
                        console.log(error_8);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    WidgetMarketingModel.getWidgetMarketing = function (nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.aggregate([
                                { $match: { nsp: nsp } },
                                {
                                    $project: {
                                        _id: 1,
                                        nsp: 1,
                                        news: { $ifNull: [{ $slice: ['$news', -20, 20] }, []] },
                                        promotions: { $ifNull: [{ $slice: ['$promotions', -20, 20] }, []] },
                                        faqs: { $ifNull: [{ $slice: ['$faqs', -20, 20] }, []] }
                                    }
                                }
                            ]).limit(1).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_1 = _a.sent();
                        console.log('Error in Get Widget Marketing');
                        console.log(err_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    WidgetMarketingModel.getOtherPorts = function () {
        return __awaiter(this, void 0, void 0, function () {
            var err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.db.collection('ICONNOtherPorts').find({}).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_2 = _a.sent();
                        console.log('Error in Get other ports');
                        console.log(err_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    WidgetMarketingModel.LikeOnPost = function (nsp, _id, likes, alreadyLiked) {
        if (alreadyLiked === void 0) { alreadyLiked = false; }
        return __awaiter(this, void 0, void 0, function () {
            var err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        if (!!alreadyLiked) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.db.collection('promotions').findOneAndUpdate({ nsp: nsp, _id: new mongodb_1.ObjectId(_id), type: 'post' }, { $addToSet: { likes: likes } }, { returnOriginal: false, upsert: false })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [4 /*yield*/, this.db.collection('promotions').findOneAndUpdate({ nsp: nsp, _id: new mongodb_1.ObjectId(_id), type: 'post' }, { $pull: { likes: { visitorEmail: likes.visitorEmail } } }, { returnOriginal: false, upsert: false })];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        err_3 = _a.sent();
                        console.log('error in liking post');
                        console.log(err_3);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    WidgetMarketingModel.ViewOnProduct = function (_id, views) {
        return __awaiter(this, void 0, void 0, function () {
            var err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.db.collection('promotions').findOneAndUpdate({ _id: new mongodb_1.ObjectId(_id), type: 'product' }, { $push: { views: views } }, { returnOriginal: false, upsert: false })];
                    case 1: 
                    // if (session) {
                    return [2 /*return*/, _a.sent()];
                    case 2:
                        err_4 = _a.sent();
                        console.log('Error in Views on Product');
                        console.log(err_4);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    WidgetMarketingModel.ReviewOnPost = function (nsp, _id, reviews) {
        return __awaiter(this, void 0, void 0, function () {
            var err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.db.collection('promotions').findOneAndUpdate({ nsp: nsp, _id: new mongodb_1.ObjectId(_id), type: 'post' }, { $push: { reviews: reviews }, $inc: { count: 1 } }, { returnOriginal: false, upsert: false })];
                    case 1: 
                    // if (session) {
                    return [2 /*return*/, _a.sent()];
                    case 2:
                        err_5 = _a.sent();
                        console.log('Error in Review post');
                        console.log(err_5);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    WidgetMarketingModel.DeleteReviewOnPost = function (reviews, _id) {
        return __awaiter(this, void 0, void 0, function () {
            var err_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.db.collection('promotions').findOneAndUpdate({ _id: new mongodb_1.ObjectId(_id), type: 'post' }, { $pull: { reviews: reviews }, $inc: { count: -1 } }, { returnOriginal: false, upsert: false })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_6 = _a.sent();
                        console.log('Error in Delete Review');
                        console.log(err_6);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    WidgetMarketingModel.getMoreReviews = function (promoid, date) {
        if (date === void 0) { date = ''; }
        return __awaiter(this, void 0, void 0, function () {
            var reviews, reviews, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        if (!date) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.db.collection('promotions').aggregate([
                                {
                                    '$match': {
                                        '_id': new mongodb_1.ObjectId(promoid)
                                    }
                                }, {
                                    '$unwind': {
                                        'path': '$reviews'
                                    }
                                },
                                {
                                    '$project': {
                                        '_id': 0,
                                        'reviews': 1
                                    }
                                }, {
                                    '$sort': {
                                        'reviews.createdOn': -1
                                    }
                                },
                                {
                                    $match: {
                                        'reviews.createdOn': {
                                            $lt: date
                                        }
                                    }
                                }
                            ]).limit(5).toArray()];
                    case 1:
                        reviews = _a.sent();
                        console.log(reviews);
                        return [2 /*return*/, reviews.map(function (r) { return r.reviews; })];
                    case 2: return [4 /*yield*/, this.db.collection('promotions').aggregate([
                            {
                                '$match': {
                                    '_id': new mongodb_1.ObjectId(promoid)
                                }
                            }, {
                                '$unwind': {
                                    'path': '$reviews'
                                }
                            }, {
                                '$project': {
                                    '_id': 0,
                                    'reviews': 1
                                }
                            }, {
                                '$sort': {
                                    'reviews.createdOn': -1
                                }
                            }
                        ]).limit(5).toArray()];
                    case 3:
                        reviews = _a.sent();
                        return [2 /*return*/, reviews.map(function (r) { return r.reviews; })];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_9 = _a.sent();
                        console.log('Error in Get Reviews');
                        console.log(error_9);
                        return [2 /*return*/, []];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    WidgetMarketingModel.ToggleNews = function (nsp, newsId, check) {
        return __awaiter(this, void 0, void 0, function () {
            var news, err_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 8, , 9]);
                        if (!check) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.db.collection('news').find({ nsp: nsp, active: true }).toArray()];
                    case 1:
                        news = _a.sent();
                        if (!(news.length < 5)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.db.collection('news').findOneAndUpdate({ nsp: nsp, _id: new mongodb_1.ObjectId(newsId) }, { $set: { active: true } }, { returnOriginal: false, upsert: false })];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3: return [2 /*return*/, undefined];
                    case 4: return [3 /*break*/, 7];
                    case 5: return [4 /*yield*/, this.db.collection('news').findOneAndUpdate({ nsp: nsp, _id: new mongodb_1.ObjectId(newsId) }, { $set: { active: false } }, { returnOriginal: false, upsert: false })];
                    case 6: return [2 /*return*/, _a.sent()];
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        err_7 = _a.sent();
                        console.log('Error in Toggle News');
                        console.log(err_7);
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    WidgetMarketingModel.getNews = function (objIDList) {
        return __awaiter(this, void 0, void 0, function () {
            var err_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.db.collection('news').find({ _id: { $in: objIDList } }).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_8 = _a.sent();
                        console.log('Error in Get News');
                        console.log(err_8);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    WidgetMarketingModel.getMoreNews = function (nsp, lastObjectID) {
        if (lastObjectID === void 0) { lastObjectID = '0'; }
        return __awaiter(this, void 0, void 0, function () {
            var err_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.db.collection('news').aggregate([
                                { "$sort": { "createdOn": -1 } },
                                { "$match": { nsp: nsp, "_id": { "$lt": new mongodb_1.ObjectID(lastObjectID) } } },
                                { "$limit": 20 }
                            ]).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_9 = _a.sent();
                        console.log('Error in Get More News');
                        console.log(err_9);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    WidgetMarketingModel.getActiveNews = function (nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var err_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.db.collection('news').find({ nsp: nsp, active: true }).sort({ _id: -1 }).limit(8).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_10 = _a.sent();
                        console.log('Error in Get Active News');
                        console.log(err_10);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    WidgetMarketingModel.getMoreActiveNews = function (_id, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var err_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.db.collection('news').find({ nsp: nsp, active: true, _id: { $lt: new mongodb_1.ObjectId(_id) } }).sort({ _id: -1 }).limit(5).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_11 = _a.sent();
                        console.log('Error in Get Active News');
                        console.log(err_11);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    WidgetMarketingModel.getActiveNewsByDate = function (datefrom, dateto, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var obj, $and, err_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        obj = {
                            nsp: nsp,
                            active: true
                        };
                        $and = [];
                        if (datefrom)
                            $and.push({ createdOn: { $gte: datefrom } });
                        if (dateto)
                            $and.push({ createdOn: { $lte: dateto } });
                        obj.$and = $and;
                        return [4 /*yield*/, this.db.collection('news').find(obj).toArray()];
                    case 1: 
                    // console.log(obj);
                    return [2 /*return*/, _a.sent()];
                    case 2:
                        err_12 = _a.sent();
                        console.log('Error in Get Active News');
                        console.log(err_12);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    WidgetMarketingModel.TogglePromotion = function (nsp, pId, check) {
        return __awaiter(this, void 0, void 0, function () {
            var news, err_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 8, , 9]);
                        if (!check) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.db.collection('promotions').find({ nsp: nsp, active: true }).toArray()];
                    case 1:
                        news = _a.sent();
                        if (!(news.length < 5)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.db.collection('promotions').findOneAndUpdate({ nsp: nsp, _id: new mongodb_1.ObjectId(pId) }, { $set: { active: true } }, { returnOriginal: false, upsert: false })];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3: return [2 /*return*/, undefined];
                    case 4: return [3 /*break*/, 7];
                    case 5: return [4 /*yield*/, this.db.collection('promotions').findOneAndUpdate({ nsp: nsp, _id: new mongodb_1.ObjectId(pId) }, { $set: { active: false } }, { returnOriginal: false, upsert: false })];
                    case 6: return [2 /*return*/, _a.sent()];
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        err_13 = _a.sent();
                        console.log('Error in Toggle Promotions');
                        console.log(err_13);
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    WidgetMarketingModel.getPromotions = function (objIDList) {
        return __awaiter(this, void 0, void 0, function () {
            var err_14;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.db.collection('promotions').find({ _id: { $in: objIDList } }).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_14 = _a.sent();
                        console.log('Error in Get Promotions');
                        console.log(err_14);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    WidgetMarketingModel.getMorePromotions = function (nsp, lastObjectID) {
        if (lastObjectID === void 0) { lastObjectID = '0'; }
        return __awaiter(this, void 0, void 0, function () {
            var err_15;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.db.collection('promotions').aggregate([
                                { "$sort": { "createdOn": -1 } },
                                { "$match": { nsp: nsp, "_id": { "$lt": new mongodb_1.ObjectID(lastObjectID) } } },
                                { "$limit": 20 }
                            ]).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_15 = _a.sent();
                        console.log('Error in Get More News');
                        console.log(err_15);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    WidgetMarketingModel.getActivePromotions = function (nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var err_16;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.db.collection('promotions').aggregate([
                                {
                                    '$match': {
                                        'nsp': nsp,
                                        'active': true
                                    }
                                }, {
                                    '$project': {
                                        '_id': 1,
                                        'desc': 1,
                                        'title': 1,
                                        'nsp': 1,
                                        'type': 1,
                                        'active': 1,
                                        'price': 1,
                                        'currency': 1,
                                        'image': 1,
                                        'background': 1,
                                        'link': 1,
                                        'likes': 1,
                                        'views': 1,
                                        'count': 1,
                                        'reviews': {
                                            '$ifNull': [
                                                {
                                                    '$slice': [
                                                        '$reviews', -5, 5
                                                    ]
                                                }, []
                                            ]
                                        },
                                    }
                                }, {
                                    '$unwind': {
                                        'path': '$reviews',
                                        'preserveNullAndEmptyArrays': true
                                    }
                                }, {
                                    '$sort': {
                                        'reviews.createdOn': -1
                                    }
                                }, {
                                    '$group': {
                                        '_id': '$_id',
                                        'desc': {
                                            '$first': '$desc'
                                        },
                                        'title': {
                                            '$first': '$title'
                                        },
                                        'price': {
                                            '$first': '$price'
                                        },
                                        'nsp': {
                                            '$first': '$nsp'
                                        },
                                        'type': {
                                            '$first': '$type'
                                        },
                                        'active': {
                                            '$first': '$active'
                                        },
                                        'image': {
                                            '$first': '$image'
                                        },
                                        'currency': {
                                            '$first': '$currency'
                                        },
                                        'link': {
                                            '$first': '$link'
                                        },
                                        'background': {
                                            '$first': '$background'
                                        },
                                        'createdOn': {
                                            '$first': '$createdOn'
                                        },
                                        'likes': {
                                            '$first': '$likes'
                                        },
                                        'views': {
                                            '$first': '$views'
                                        },
                                        'count': {
                                            '$first': '$count'
                                        },
                                        'reviews': {
                                            '$push': '$reviews'
                                        }
                                    }
                                }
                            ]).sort({ _id: 1 }).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_16 = _a.sent();
                        console.log('Error in Get Active Promotions');
                        console.log(err_16);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    WidgetMarketingModel.ToggleFaq = function (nsp, fId, check) {
        return __awaiter(this, void 0, void 0, function () {
            var news, err_17;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 8, , 9]);
                        if (!check) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.db.collection('faqs').find({ nsp: nsp, active: true }).toArray()];
                    case 1:
                        news = _a.sent();
                        if (!(news.length < 5)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.db.collection('faqs').findOneAndUpdate({ nsp: nsp, _id: new mongodb_1.ObjectId(fId) }, { $set: { active: true } }, { returnOriginal: false, upsert: false })];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3: return [2 /*return*/, undefined];
                    case 4: return [3 /*break*/, 7];
                    case 5: return [4 /*yield*/, this.db.collection('faqs').findOneAndUpdate({ nsp: nsp, _id: new mongodb_1.ObjectId(fId) }, { $set: { active: false } }, { returnOriginal: false, upsert: false })];
                    case 6: return [2 /*return*/, _a.sent()];
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        err_17 = _a.sent();
                        console.log('Error in Toggle Faqs');
                        console.log(err_17);
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    WidgetMarketingModel.getFaqs = function (objIDList) {
        return __awaiter(this, void 0, void 0, function () {
            var err_18;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.db.collection('faqs').find({ _id: { $in: objIDList } }).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_18 = _a.sent();
                        console.log('Error in Get Faqs');
                        console.log(err_18);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    WidgetMarketingModel.getFaqsForVisitor = function (nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var err_19;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.db.collection('faqs').find({ nsp: nsp }).sort({ _id: -1 }).limit(12).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_19 = _a.sent();
                        console.log('Error in Get Faqs');
                        console.log(err_19);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    WidgetMarketingModel.getFaqsByQuestion = function (text, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var err_20;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.db.collection('faqs').find({
                                nsp: nsp,
                                $text: {
                                    $search: text.trim()
                                }
                            }, {
                                fields: {
                                    question: 1,
                                    answer: 1
                                }
                            }).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_20 = _a.sent();
                        console.log('Error in Get Faqs');
                        console.log(err_20);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    WidgetMarketingModel.getMoreFaqs = function (lastObjectID, nsp) {
        if (lastObjectID === void 0) { lastObjectID = '0'; }
        return __awaiter(this, void 0, void 0, function () {
            var err_21;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.db.collection('faqs').aggregate([
                                { "$sort": { "_id": -1 } },
                                { "$match": { nsp: nsp, "_id": { "$lt": new mongodb_1.ObjectID(lastObjectID) } } },
                                { "$limit": 5 }
                            ]).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_21 = _a.sent();
                        console.log('Error in Get More Faqs');
                        console.log(err_21);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    WidgetMarketingModel.initialized = false;
    return WidgetMarketingModel;
}());
exports.WidgetMarketingModel = WidgetMarketingModel;
//# sourceMappingURL=widgetMarketingModel.js.map