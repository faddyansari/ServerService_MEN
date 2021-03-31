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
exports.visitorSessions = void 0;
// Created By Saad Ismail Shaikh
// Date : 05-03-18
var Analytics_Logs_DB_1 = require("../globals/config/databses/Analytics-Logs-DB");
var mongodb_1 = require("mongodb");
var visitorModel_1 = require("./visitorModel");
var aws_sqs_1 = require("../actions/aws/aws-sqs");
var constants_1 = require("../globals/config/constants");
var visitorSessions = /** @class */ (function () {
    function visitorSessions() {
    }
    visitorSessions.Initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, error_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 3, , 4]);
                        _a = this;
                        return [4 /*yield*/, Analytics_Logs_DB_1.ArchivingDB.connect()];
                    case 1:
                        _a.db = _c.sent();
                        _b = this;
                        return [4 /*yield*/, this.db.createCollection('visitorSessions')];
                    case 2:
                        _b.collection = _c.sent();
                        console.log(this.collection.collectionName);
                        visitorSessions.initialized = true;
                        return [2 /*return*/, visitorSessions.initialized];
                    case 3:
                        error_1 = _c.sent();
                        console.log('error in Initializing Visitor Session Model');
                        throw new Error(error_1);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    visitorSessions.Destroy = function () {
        this.db = undefined;
        this.collection = undefined;
    };
    visitorSessions.InsertVisitorSession = function (session, id) {
        return __awaiter(this, void 0, void 0, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        if (id && !session._id) {
                            session._id = id;
                        }
                        session.endingDate = new Date();
                        return [4 /*yield*/, visitorModel_1.Visitor.InsertLeftVisitor(session.nsp, session)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendMessage({ action: 'visitorSessionEnded', session: session }, constants_1.AnalytcisNewQueue)];
                    case 2: 
                    //return await this.collection.insertOne(session);
                    return [2 /*return*/, _a.sent()];
                    case 3:
                        error_2 = _a.sent();
                        console.log('error in Inserting Visitor Session');
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    visitorSessions.getVisitorSession = function (sessionid) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.collection.find({ _id: new mongodb_1.ObjectId(sessionid) }).limit(1).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    visitorSessions.getVisitorSessions = function (IDs) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = [];
                        IDs.forEach(function (id) {
                            data.push(new mongodb_1.ObjectId(id));
                        });
                        return [4 /*yield*/, this.collection.find({ _id: { '$in': data } }).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    visitorSessions.getVisitorSessionsBySessionIds = function (IDs) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.collection.find({ id: { '$in': IDs } }).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    visitorSessions.getVisitorSessionByIDs = function (sessionids, data, token, nsp, filters, chunk) {
        if (chunk === void 0) { chunk = undefined; }
        return __awaiter(this, void 0, void 0, function () {
            var search, obj;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        search = {};
                        search.nsp = nsp;
                        search[token] = data;
                        if (filters) {
                            if (filters.daterange) {
                                search.$and = [{ creationDate: { $gte: filters.daterange.from } }, { creationDate: { $lte: filters.daterange.from } }];
                            }
                        }
                        else {
                            sessionids = sessionids.map(function (id) {
                                id = new mongodb_1.ObjectId(id);
                                return id;
                            });
                            search._id = {
                                $in: sessionids
                            };
                        }
                        if (chunk)
                            search.$lt = { _id: new mongodb_1.ObjectId(chunk) };
                        obj = {};
                        if (token == 'email')
                            obj = {
                                $not: /unregistered/gi
                            };
                        else
                            obj = {
                                $exists: true
                            };
                        if (search.hasOwnProperty(token)) {
                            if (!search.$and) {
                                search.$and = [];
                                search.$and[0] = {};
                                search.$and[0][token] = obj;
                            }
                            else {
                                search.$and.push({ token: obj });
                            }
                        }
                        else
                            search[token] = obj;
                        return [4 /*yield*/, this.collection.find(search).sort({ _id: -1 }).toArray()];
                    case 1: 
                    //console.log(search);
                    return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    visitorSessions.GetSourcesForCustomer = function (filters, token, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var search, obj;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        search = {};
                        search.nsp = nsp;
                        search[token] = filters;
                        search.referrer = { $exists: true };
                        obj = {};
                        if (token == 'email')
                            obj = {
                                $not: /unregistered/gi
                            };
                        else
                            obj = {
                                $exists: true
                            };
                        if (search.hasOwnProperty(token)) {
                            search.$and = [];
                            search.$and[0] = {};
                            search.$and[0][token] = obj;
                        }
                        else
                            search[token] = obj;
                        return [4 /*yield*/, this.collection.aggregate([
                                {
                                    $match: search
                                },
                                {
                                    "$group": {
                                        "_id": "$referrer",
                                        "count": { "$sum": 1 }
                                    }
                                },
                                {
                                    $sort: {
                                        count: -1
                                    }
                                },
                            ]).toArray()];
                    case 1: 
                    //console.log(search);
                    return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    visitorSessions.GetAgentsForCustomer = function (filters, token, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var search, obj;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        search = {};
                        search.nsp = nsp;
                        search[token] = filters;
                        search["agent.id"] = { $ne: '' };
                        obj = {};
                        if (token == 'email')
                            obj = {
                                $not: /unregistered/gi
                            };
                        else
                            obj = {
                                $exists: true
                            };
                        if (search.hasOwnProperty(token)) {
                            search.$and = [];
                            search.$and[0] = {};
                            search.$and[0][token] = obj;
                        }
                        else
                            search[token] = obj;
                        return [4 /*yield*/, this.collection.aggregate([
                                {
                                    $match: search
                                },
                                {
                                    $group: {
                                        // `$` + `${token.toString()}` + ``
                                        '_id': "$agent.name",
                                        sessions: {
                                            $addToSet: {
                                                agent: "$agent",
                                                sessionid: "$id"
                                            }
                                        },
                                        // "agents": { "$first": { "agent": { "$addToSet": "$agent" }, "sessionid": { "$first": '$id' } } },
                                        "count": { "$sum": 1 }
                                    }
                                },
                                {
                                    $sort: {
                                        count: -1
                                    }
                                },
                            ]).toArray()];
                    case 1: 
                    //console.log(search);
                    return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    visitorSessions.GetSessionCountsPeriodically = function (nsp, data, sessionids, token, filters) {
        if (filters === void 0) { filters = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var search, obj, query1, query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        search = {};
                        search.nsp = nsp;
                        search[token] = data;
                        // search['sessions.0'] = { $exists: true };
                        // sessionids = (sessionids as Array<any>).map(id => {
                        //     id = new ObjectId(id)
                        //     return id;
                        // })
                        // if sessionid is needed(docs already contain device ID so no ned to include session ids)
                        // search.id = {
                        //     $in: sessionids
                        // }
                        if (filters) {
                            if (filters.daterange) {
                                search.$and = [{ creationDate: { $gte: filters.daterange.from } }, { creationDate: { $lte: filters.daterange.from } }];
                            }
                            if (filters.country && filters.country.length)
                                search.country = { $in: filters.country };
                        }
                        obj = {};
                        if (token == 'email')
                            obj = {
                                $not: /unregistered/gi
                            };
                        else
                            obj = {
                                $exists: true
                            };
                        if (search.hasOwnProperty(token)) {
                            search.$and = [];
                            search.$and[0] = {};
                            search.$and[0][token] = obj;
                        }
                        else
                            search[token] = obj;
                        query1 = [
                            {
                                "$match": search
                            },
                            {
                                "$project": {
                                    "creationDate": {
                                        "$dateToString": {
                                            "date": {
                                                "$dateFromString": {
                                                    "dateString": "$creationDate"
                                                }
                                            },
                                            "format": "%Y-%m-%dT%H:%M:%S.%LZ",
                                            "timezone": filters.timezone
                                        }
                                    },
                                }
                            },
                            {
                                "$match": {
                                    "$or": [
                                        {
                                            "creationDate": {
                                                "$gte": filters.date.from.split('T')[0] + '00:00:00.000Z',
                                                "$lte": filters.date.to.split('T')[0] + '00:00:00.000Z'
                                            }
                                        },
                                    ]
                                }
                            },
                            {
                                "$project": {
                                    "y": { $substr: ["$creationDate", 0, 4] },
                                    "m": { $substr: ["$creationDate", 5, 2] },
                                    "d": { $substr: ["$creationDate", 8, 2] },
                                    "h": { $substr: ["$creationDate", 11, 2] },
                                }
                            },
                            {
                                "$group": {
                                    "_id": { "year": "$y", "month": "$m", "day": "$d", "hour": "$h" },
                                    "count": { $sum: 1 }
                                }
                            }
                        ];
                        query = [
                            {
                                "$match": search
                            },
                            {
                                "$project": {
                                    "creationDate": {
                                        "$dateToString": {
                                            "date": {
                                                "$dateFromString": {
                                                    "dateString": "$creationDate"
                                                }
                                            },
                                            "format": "%Y-%m-%dT%H:%M:%S.%LZ",
                                            "timezone": filters.timezone
                                        }
                                    },
                                    "endingDate": {
                                        "$dateToString": {
                                            "date": {
                                                "$dateFromString": {
                                                    "dateString": "$endingDate"
                                                }
                                            },
                                            "format": "%Y-%m-%dT%H:%M:%S.%LZ",
                                            "timezone": filters.timezone
                                        }
                                    },
                                }
                            },
                            {
                                "$match": {
                                    "$or": [
                                        {
                                            "createdDate": {
                                                "$gte": filters.date.from.split('T')[0] + '00:00:00.000Z',
                                                "$lte": filters.date.to.split('T')[0] + '00:00:00.000Z'
                                            }
                                        },
                                        {
                                            "endingDate": {
                                                "$gte": filters.date.from.split('T')[0] + '00:00:00.000Z',
                                                "$lte": filters.date.to.split('T')[0] + '00:00:00.000Z'
                                            }
                                        }
                                    ]
                                }
                            },
                            {
                                "$project": {
                                    "email": 1.0,
                                    "createdDate": {
                                        "$dateFromString": {
                                            "dateString": "$createdDate"
                                        }
                                    },
                                    "endingDate": {
                                        "$dateFromString": {
                                            "dateString": "$endingDate"
                                        }
                                    },
                                }
                            },
                            // {
                            //     "$unwind": {
                            //         "path": "$idlePeriod",
                            //         "preserveNullAndEmptyArrays": true
                            //     }
                            // },
                            // {
                            //     "$addFields": {
                            // "idleStart": {
                            //     "$dateFromString": {
                            //         "dateString": {
                            //             "$dateToString": {
                            //                 "date": {
                            //                     "$dateFromString": {
                            //                         "dateString": "$idlePeriod.startTime"
                            //                     }
                            //                 },
                            //                 "format": "%Y-%m-%dT%H:%M:%S.%LZ",
                            //                 "timezone": filters.timezone
                            //             }
                            //         }
                            //     }
                            // },
                            // "idleEnd": {
                            //     "$dateFromString": {
                            //         "dateString": {
                            //             "$dateToString": {
                            //                 "date": {
                            //                     "$dateFromString": {
                            //                         "dateString": "$idlePeriod.endTime"
                            //                     }
                            //                 },
                            //                 "format": "%Y-%m-%dT%H:%M:%S.%LZ",
                            //                 "timezone": filters.timezone
                            //             }
                            //         }
                            //     }
                            // }
                            // }
                            // },
                            {
                                "$project": {
                                    "email": 1.0,
                                    "createdDate": {
                                        "$dateToString": {
                                            "date": "$createdDate",
                                            "format": "%Y-%m-%dT%H:%M:%S"
                                        }
                                    },
                                    "endingDate": {
                                        "$dateToString": {
                                            "date": "$endingDate",
                                            "format": "%Y-%m-%dT%H:%M:%S"
                                        }
                                    },
                                }
                            },
                            {
                                "$sort": {
                                    "email": 1.0,
                                    "createdDate": 1.0,
                                }
                            }
                        ];
                        return [4 /*yield*/, this.collection.aggregate(query1).toArray()];
                    case 1: 
                    // return await this.collection.aggregate([
                    //     {
                    //         $match: search
                    //     },
                    //     { $group: { _id: `$` + `${token.toString()}` + ``, count: { $sum: { $size: "$sessions" } } } },
                    //     // {
                    //     //     $project: {
                    //     //         count: {
                    //     //             "$size": { "$ifNull": ["$sessions", []] }
                    //     //         }
                    //     //     }
                    //     // },
                    //     {
                    //         $sort: {
                    //             count: -1
                    //         }
                    //     },
                    //     // {
                    //     //     $limit: 10
                    //     // }
                    // ]).toArray();
                    return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    visitorSessions.GetReferrerCountsPeriodically = function (nsp, data, sessionids, token, filters) {
        if (filters === void 0) { filters = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var search, obj, query1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        search = {};
                        search.nsp = nsp;
                        search[token] = data;
                        // if sessionid is needed(docs already contain device ID so no ned to include session ids)
                        // search.id = {
                        //     $in: sessionids
                        // }
                        if (filters) {
                            if (filters.daterange) {
                                search.$and = [{ creationDate: { $gte: filters.daterange.from } }, { creationDate: { $lte: filters.daterange.from } }];
                            }
                            if (filters.country && filters.country.length)
                                search.country = { $in: filters.country };
                        }
                        obj = {};
                        if (token == 'email')
                            obj = {
                                $not: /unregistered/gi
                            };
                        else
                            obj = {
                                $exists: true
                            };
                        if (search.hasOwnProperty(token)) {
                            search.$and = [];
                            search.$and[0] = {};
                            search.$and[0][token] = obj;
                        }
                        else
                            search[token] = obj;
                        query1 = [
                            {
                                "$match": search
                            },
                            {
                                "$project": {
                                    "creationDate": {
                                        "$dateToString": {
                                            "date": {
                                                "$dateFromString": {
                                                    "dateString": "$creationDate"
                                                }
                                            },
                                            "format": "%Y-%m-%dT%H:%M:%S.%LZ",
                                            "timezone": filters.timezone
                                        }
                                    },
                                    'referrer': "$referrer"
                                }
                            },
                            {
                                "$match": {
                                    "$or": [
                                        {
                                            "creationDate": {
                                                "$gte": filters.date.from.split('T')[0] + '00:00:00.000Z',
                                                "$lte": filters.date.to.split('T')[0] + '00:00:00.000Z'
                                            }
                                        },
                                    ]
                                }
                            },
                            {
                                "$project": {
                                    "y": { $substr: ["$creationDate", 0, 4] },
                                    "m": { $substr: ["$creationDate", 5, 2] },
                                    "d": { $substr: ["$creationDate", 8, 2] },
                                    "h": { $substr: ["$creationDate", 11, 2] },
                                    "source": '$referrer'
                                }
                            },
                            {
                                "$group": {
                                    "_id": { "year": "$y", "month": "$m", "day": "$d", "hour": "$h", "source": '$source' },
                                    // "types": { "$addToSet": "$source" },
                                    'types': { $first: '$source' },
                                    "count": { $sum: 1 }
                                }
                            }
                        ];
                        return [4 /*yield*/, this.collection.aggregate(query1).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    visitorSessions.getMaxUrlsByDate = function (nsp, dateFrom, dateTo) {
        return __awaiter(this, void 0, void 0, function () {
            var result, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.aggregate([
                                {
                                    "$match": {
                                        "nsp": nsp,
                                        "creationDate": {
                                            "$gte": dateFrom,
                                            "$lt": dateTo
                                        }
                                    }
                                },
                                {
                                    "$project": {
                                        url: "$url",
                                        date: { $substr: ["$creationDate", 0, 10] }
                                    }
                                },
                                {
                                    "$group": { _id: { data: "$date" }, count: { $sum: 1 } }
                                }
                            ]).toArray()];
                    case 1:
                        result = _a.sent();
                        if (result.length)
                            return [2 /*return*/, result];
                        else
                            return [2 /*return*/, []];
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _a.sent();
                        console.log('Error in getting data');
                        console.log(err_1);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    visitorSessions.getAvgTimeSpent = function (nsp, dateFrom, dateTo) {
        return __awaiter(this, void 0, void 0, function () {
            var result, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.aggregate([
                                {
                                    "$match": {
                                        "nsp": nsp,
                                        "creationDate": {
                                            "$gte": dateFrom,
                                            "$lt": dateTo
                                        }
                                    }
                                },
                                {
                                    "$project": {
                                        "date": { $substr: ["$creationDate", 0, 10] },
                                        "startingDate": {
                                            $dateFromString: {
                                                dateString: "$creationDate"
                                            }
                                        },
                                        "endingDate": {
                                            $dateFromString: {
                                                dateString: "$endingDate"
                                            }
                                        }
                                    }
                                },
                                {
                                    "$group": {
                                        _id: { data: "$date" },
                                        time: { $sum: { $subtract: ["$endingDate", "$startingDate"] } }
                                    }
                                }
                            ]).toArray()];
                    case 1:
                        result = _a.sent();
                        if (result.length)
                            return [2 /*return*/, result];
                        else
                            return [2 /*return*/, []];
                        return [3 /*break*/, 3];
                    case 2:
                        err_2 = _a.sent();
                        console.log('Error in getting data');
                        console.log(err_2);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    visitorSessions.getRefferers = function (nsp, dateFrom, dateTo) {
        return __awaiter(this, void 0, void 0, function () {
            var result, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.aggregate([
                                {
                                    "$match": {
                                        "nsp": nsp,
                                        "creationDate": {
                                            "$gte": dateFrom,
                                            "$lt": dateTo
                                        }
                                    }
                                },
                                {
                                    "$project": {
                                        "data": { $substr: ["$creationDate", 0, 10] },
                                        "referrer": "$referrer"
                                    }
                                },
                                {
                                    "$group": {
                                        _id: { data: "$referrer" },
                                        count: { $sum: 1 }
                                    }
                                }
                            ]).toArray()];
                    case 1:
                        result = _a.sent();
                        if (result.length)
                            return [2 /*return*/, result];
                        else
                            return [2 /*return*/, []];
                        return [3 /*break*/, 3];
                    case 2:
                        err_3 = _a.sent();
                        console.log('Error in getting data');
                        console.log(err_3);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    visitorSessions.initialized = false;
    return visitorSessions;
}());
exports.visitorSessions = visitorSessions;
//# sourceMappingURL=visitorSessionmodel.js.map