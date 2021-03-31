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
exports.Visitor = void 0;
// Created By Saad Ismail Shaikh
// Date : 22-1-18
var mongodb_1 = require("mongodb");
var Analytics_Logs_DB_1 = require("../globals/config/databses/Analytics-Logs-DB");
var Visitor = /** @class */ (function () {
    function Visitor() {
    }
    Visitor.Initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c, error_1;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 4, , 5]);
                        _a = this;
                        return [4 /*yield*/, Analytics_Logs_DB_1.ArchivingDB.connect()];
                    case 1:
                        _a.db = _d.sent();
                        _b = this;
                        return [4 /*yield*/, this.db.createCollection('visitors')];
                    case 2:
                        _b.collection = _d.sent();
                        _c = this;
                        return [4 /*yield*/, this.db.createCollection('leftVisitors')];
                    case 3:
                        _c.leftVisitor = _d.sent();
                        console.log(this.collection.collectionName);
                        console.log(this.leftVisitor.collectionName);
                        Visitor.initialized = true;
                        return [2 /*return*/, Visitor.initialized];
                    case 4:
                        error_1 = _d.sent();
                        console.log('error in Initializing Visitor Model');
                        throw new Error(error_1);
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    // -------------------------------x---------------------------------------------------x ||
    //                              Functions operatiing on Databases
    //--------------------------------x---------------------------------------------------x ||
    Visitor.getVisitorsByID = function () {
        return 0;
    };
    Visitor.getVisitorsByName = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection
                                .find({ username: name })
                                .limit(1)
                                .toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_2 = _a.sent();
                        console.log(error_2);
                        throw new Error("Can't Find Agent In Exists");
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Visitor.getVisitorsByEmail = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            var error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection
                                .find({ userEmail: email })
                                .limit(1)
                                .toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_3 = _a.sent();
                        console.log(error_3);
                        throw new Error("Can't Find Agent In Exists");
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Visitor.visitorExists = function (nsp, userEmail) {
        return __awaiter(this, void 0, void 0, function () {
            var error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection
                                .find({ nsp: nsp, email: userEmail })
                                .limit(1)
                                .toArray()];
                    case 1: return [2 /*return*/, !!(_a.sent()).length];
                    case 2:
                        error_4 = _a.sent();
                        throw new Error("Can't Find Visitor In Exists");
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Visitor.insertVisitor = function (params, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var visitor, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        visitor = {
                            "username": params.username,
                            "email": params.email,
                            "createdDate": new Date().toISOString(),
                            "location": params.location,
                            "count": 1,
                            "ipAddress": params.ipAddress,
                            "deviceID": params.deviceID,
                            "sessions": [],
                            "nsp": nsp,
                            "phone": params.phone
                        };
                        return [4 /*yield*/, this.collection.insertOne(JSON.parse(JSON.stringify(visitor)))];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_5 = _a.sent();
                        throw new Error("Can't Insert Visitor");
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Visitor.visitorDeviceIDExists = function (userDeviceID) {
        return __awaiter(this, void 0, void 0, function () {
            var error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection
                                .find({ deviceID: userDeviceID })
                                .limit(1)
                                .toArray()];
                    case 1: return [2 /*return*/, !!(_a.sent()).length];
                    case 2:
                        error_6 = _a.sent();
                        throw new Error("Can't Find Visitor Device ID In Exists");
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    //Addtoset method doesn't add if exists while push add the value whether it exists or not
    // public static UpdateVisitorSessionByDeviceID(userDeviceID, sessionid) {
    //     try {
    //         return this.collection.findOneAndUpdate({ deviceID: userDeviceID }, {
    //             $push: {
    //                 sessions: sessionid
    //             }
    //         }, { returnOriginal: false, upsert: true });
    //     } catch (error) {
    //         console.log(error);
    //         console.log('error in Insert Automated Message');
    //     }
    // }
    Visitor.UpdateVisitorSessionByDeviceID = function (userDeviceID, sessionid) {
        try {
            return this.collection.findOneAndUpdate({
                deviceID: userDeviceID,
            }, {
                $addToSet: { sessions: sessionid }
            }, { returnOriginal: false, upsert: false, });
        }
        catch (error) {
            console.log('Error in Updating Sessions');
            console.log(error);
        }
    };
    Visitor.getVisitorSessionsByDeviceID = function (userDeviceID) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    return [2 /*return*/, this.collection.find({
                            deviceID: userDeviceID
                        }, {
                            fields: {
                                sessions: 1
                            }
                        })
                            .toArray()];
                }
                catch (error) {
                    console.log('Error in Getting Sessions');
                    console.log(error);
                }
                return [2 /*return*/];
            });
        });
    };
    Visitor.getVisitorByDeviceID = function (userDeviceID) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    return [2 /*return*/, this.collection.find({ deviceID: userDeviceID }).limit(1).toArray()];
                }
                catch (error) {
                    console.log('Error in Getting Sessions');
                    console.log(error);
                }
                return [2 /*return*/];
            });
        });
    };
    Visitor.UpdateVisitor = function (userDeviceID, visitor) {
        return __awaiter(this, void 0, void 0, function () {
            var obj, updatedVisitor;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        obj = {};
                        Object.assign(obj, visitor);
                        // console.log("Update Visitor");
                        // console.log(visitor);
                        delete obj._id;
                        return [4 /*yield*/, this.collection.update({ deviceID: userDeviceID }, { $set: JSON.parse(JSON.stringify(obj)) }, {
                                upsert: false,
                                multi: false
                            })];
                    case 1:
                        updatedVisitor = _a.sent();
                        if (updatedVisitor && updatedVisitor.result)
                            return [2 /*return*/, updatedVisitor.result];
                        else
                            return [2 /*return*/, undefined];
                        return [2 /*return*/];
                }
            });
        });
    };
    Visitor.UpdateVisitorInfoByDeviceID = function (userDeviceID, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    //console.log('updating visitor info');
                    if (data.phone)
                        return [2 /*return*/, this.collection.findOneAndUpdate({ deviceID: userDeviceID }, {
                                $set: {
                                    username: data.username,
                                    phone: data.phone,
                                    email: data.email
                                }
                            }, { returnOriginal: false, upsert: false })];
                    else
                        return [2 /*return*/, this.collection.findOneAndUpdate({ deviceID: userDeviceID }, {
                                $set: {
                                    username: data.username,
                                    email: data.email
                                }
                            }, { returnOriginal: false, upsert: false })];
                }
                catch (error) {
                    console.log(error);
                    console.log('Error in Update Visitor Conversation by Device ID');
                }
                return [2 /*return*/];
            });
        });
    };
    Visitor.UpdateVisitorInfoById = function (id, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    return [2 /*return*/, this.collection.findOneAndUpdate({ _id: new mongodb_1.ObjectId(id) }, {
                            $set: {
                                username: data.username,
                                phone: data.phone,
                                email: data.email,
                                location: data.location
                            }
                        }, { returnOriginal: false, upsert: false })];
                }
                catch (error) {
                    console.log(error);
                    console.log('Error in Update Visitor Conversation by Device ID');
                }
                return [2 /*return*/];
            });
        });
    };
    Visitor.UpdateContactDetailsByDeviceID = function (userDeviceID, username, phone, email) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    return [2 /*return*/, this.collection.findOneAndUpdate({ deviceID: userDeviceID }, {
                            $set: {
                                username: username,
                                phone: phone,
                                email: email
                            }
                        }, { returnOriginal: false, upsert: false })];
                }
                catch (error) {
                    console.log(error);
                    console.log('Error in Update Visitor Conversation by Device ID');
                }
                return [2 /*return*/];
            });
        });
    };
    //-------------------------------x-------------------------------------------------------x ||
    //                  Functions operating on Live Clients. ( Visitor List Arra)              ||
    //--------------------------------x------------------------------------------------------- ||
    Visitor.NotifyAll = function (session) {
        return 'Visitors' + session.location;
    };
    Visitor.DeleteVisitor = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.deleteOne({ _id: new mongodb_1.ObjectId(id) })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_7 = _a.sent();
                        console.log('Error in deleting customer');
                        console.log(error_7);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Visitor.BraodcastToVisitors = function () {
        return 'Visitors';
    };
    Visitor.NotifyOne = function (session) {
        try {
            switch (session.type) {
                case 'Visitors':
                    return session._id || session.id;
                default:
                    return '';
            }
        }
        catch (error) {
            console.log('Error in Notify One Visitors');
            // console.log;
            return '';
        }
    };
    //CRM Events
    Visitor.getAllVisitors = function (nsp, exclude) {
        return __awaiter(this, void 0, void 0, function () {
            var visitorList, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.find({ nsp: nsp }).sort({ _id: -1 }).limit(20).toArray()];
                    case 1:
                        visitorList = _a.sent();
                        if (visitorList.length)
                            return [2 /*return*/, visitorList];
                        else
                            return [2 /*return*/, []];
                        return [3 /*break*/, 3];
                    case 2:
                        error_8 = _a.sent();
                        console.log('Error in Sending Visitors List');
                        console.log(error_8);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Visitor.getMoreCustomersByCid = function (session, id) {
        return __awaiter(this, void 0, void 0, function () {
            var error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.aggregate([
                                { "$match": { "nsp": session.nsp } },
                                { "$sort": { _id: -1 } },
                                { "$match": { "_id": { $lt: new mongodb_1.ObjectID(id) } } },
                                { "$limit": 15 }
                            ]).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_9 = _a.sent();
                        console.log('Error in Getting more customers');
                        console.log(error_9);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Visitor.getFilteredVisitors = function (nsp, dateFrom, dateTo, location, source, group, chunk) {
        if (chunk === void 0) { chunk = ''; }
        return __awaiter(this, void 0, void 0, function () {
            var visitorList, match, groups, project, query, error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        visitorList = [];
                        match = {};
                        groups = {};
                        project = {
                            _id: '$id',
                            username: '$username',
                            email: '$email',
                            createdDate: '$createdDate',
                            location: '$location',
                            count: '$count',
                            deviceID: '$deviceID',
                            sessions: '$sessions',
                            nsp: '$nsp',
                            phone: '$phone'
                        };
                        if (chunk != '') {
                            match._id = {
                                "$lt": new mongodb_1.ObjectId(chunk)
                            };
                        }
                        if (nsp) {
                            match.nsp = nsp;
                        }
                        if (dateFrom && dateTo) {
                            match.createdDate = {
                                "$gte": dateFrom,
                                "$lt": dateTo
                            };
                        }
                        if (location) {
                            match.location = { "$in": location };
                        }
                        if (source == 'Email') {
                            match.deviceID = { $exists: false };
                        }
                        else if (source == 'Device') {
                            match.deviceID = { $exists: true };
                        }
                        if (group == 'Email') {
                            groups._id = '$email';
                            groups.id = { $first: '$_id' },
                                groups.username = { $first: '$username' },
                                groups.email = { $first: '$email' },
                                groups.createdDate = { $first: '$createdDate' },
                                groups.location = { $first: '$location' },
                                groups.count = { $first: '$count' },
                                groups.deviceID = { $first: '$deviceID' },
                                groups.sessions = { $first: '$sessions' },
                                groups.nsp = { $first: '$nsp' },
                                groups.phone = { $first: '$phone' };
                        }
                        else if (group == 'Device') {
                            groups._id = '$deviceID',
                                groups.id = { $first: '$_id' },
                                groups.username = { $first: '$username' },
                                groups.email = { $first: '$email' },
                                groups.createdDate = { $first: '$createdDate' },
                                groups.location = { $first: '$location' },
                                groups.count = { $first: '$count' },
                                groups.deviceID = { $first: '$deviceID' },
                                groups.sessions = { $first: '$sessions' },
                                groups.nsp = { $first: '$nsp' },
                                groups.phone = { $first: '$phone' };
                        }
                        query = [];
                        if (Object.keys(match).length != 0 && Object.keys(groups).length != 0) {
                            query = [
                                { '$match': match },
                                { '$group': groups },
                                { '$project': project }
                            ];
                        }
                        else if (Object.keys(match).length != 0 && Object.keys(groups).length == 0) {
                            query = [
                                { '$match': match }
                            ];
                        }
                        else if (Object.keys(match).length == 0 && Object.keys(groups).length != 0) {
                            query = [
                                { '$group': groups },
                                { '$project': project }
                            ];
                        }
                        return [4 /*yield*/, this.collection.aggregate(query).sort({ _id: -1 }).limit(20).toArray()];
                    case 1:
                        visitorList = _a.sent();
                        visitorList.map(function (visitor) {
                            visitor.id = visitor._id;
                        });
                        if (visitorList.length)
                            return [2 /*return*/, visitorList];
                        else
                            return [2 /*return*/, []];
                        return [3 /*break*/, 3];
                    case 2:
                        error_10 = _a.sent();
                        console.log(error_10);
                        console.log('error in getting filtered visitors');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Visitor.InsertLeftVisitor = function (nsp, session) {
        return __awaiter(this, void 0, void 0, function () {
            var updated, error_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.leftVisitor.findOneAndUpdate({ nsp: nsp }, {
                                $push: { "session": { $each: [session], $slice: -30 } },
                            }, { returnOriginal: false, upsert: true })
                            // let inserted = await this.leftVisitor.insertOne({ nsp: nsp, sessions: [session] });
                        ];
                    case 1:
                        updated = _a.sent();
                        // let inserted = await this.leftVisitor.insertOne({ nsp: nsp, sessions: [session] });
                        return [2 /*return*/, updated];
                    case 2:
                        error_11 = _a.sent();
                        console.log(error_11);
                        console.log('error in inserting LeftVisitor');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Visitor.GetLeftVisitors = function (nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var leftVisitors, error_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.leftVisitor.find({ nsp: nsp }).limit(1).toArray()];
                    case 1:
                        leftVisitors = _a.sent();
                        if (leftVisitors.length)
                            return [2 /*return*/, leftVisitors[0].session];
                        else
                            return [2 /*return*/, []];
                        return [3 /*break*/, 3];
                    case 2:
                        error_12 = _a.sent();
                        console.log(error_12);
                        console.log('error in Getting LeftVisitor');
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Visitor.GetBannedVisitorByDeviceID = function (nsp, userDeviceID) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    return [2 /*return*/, this.collection.find({
                            nsp: nsp,
                            deviceID: userDeviceID, $and: [
                                { banned: { $exists: true } },
                                { banned: true }
                            ]
                        }).limit(1).toArray()];
                }
                catch (error) {
                    console.log('Error in Getting Sessions');
                    console.log(error);
                }
                return [2 /*return*/];
            });
        });
    };
    Visitor.GetBannedVisitors = function (nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var bannedtVisitors, error_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.find({ nsp: nsp, banned: true }).sort({ _id: -1 }).toArray()];
                    case 1:
                        bannedtVisitors = _a.sent();
                        if (bannedtVisitors.length)
                            return [2 /*return*/, bannedtVisitors];
                        else
                            return [2 /*return*/, []];
                        return [3 /*break*/, 3];
                    case 2:
                        error_13 = _a.sent();
                        console.log(error_13);
                        console.log('error in Getting Banned VIsitor');
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Visitor.searchCustomers = function (nsp, keyword, chunk) {
        if (chunk === void 0) { chunk = '0'; }
        return __awaiter(this, void 0, void 0, function () {
            var err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        if (!(chunk == '0')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.collection.find({
                                nsp: nsp,
                                '$or': [
                                    { username: new RegExp(keyword, 'i') },
                                    { email: new RegExp(keyword, 'i') },
                                ]
                            }).sort({ _id: -1 }).limit(20).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [4 /*yield*/, this.collection.aggregate([
                            {
                                "$match": {
                                    "nsp": nsp,
                                    '$or': [
                                        { username: new RegExp(keyword, 'i') },
                                        { email: new RegExp(keyword, 'i') },
                                    ]
                                }
                            },
                            { "$sort": { _id: -1 } },
                            { "$match": { "_id": { $lt: new mongodb_1.ObjectID(chunk) } } },
                            { "$limit": 20 }
                        ]).toArray()];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        err_1 = _a.sent();
                        console.log('Error in Search Contacts');
                        console.log(err_1);
                        return [2 /*return*/, []];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Visitor.BanVisitor = function (visitor, value, hours) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    if (visitor.deviceID) {
                        return [2 /*return*/, this.collection.findOneAndUpdate({ nsp: visitor.nsp, deviceID: visitor.deviceID }, {
                                $set: {
                                    banned: value,
                                    banSpan: hours,
                                    bannedOn: new Date().toISOString()
                                }
                            }, { returnOriginal: false, upsert: false })];
                    }
                }
                catch (err) {
                    console.log(err);
                }
                return [2 /*return*/];
            });
        });
    };
    Visitor.UnbanVisitor = function (deviceID, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    if (deviceID) {
                        return [2 /*return*/, this.collection.findOneAndUpdate({ nsp: nsp, deviceID: deviceID }, {
                                $set: {
                                    banned: false,
                                    banSpan: 0,
                                    bannedOn: ''
                                }
                            }, { returnOriginal: false, upsert: false })];
                    }
                }
                catch (err) {
                    console.log(err);
                }
                return [2 /*return*/];
            });
        });
    };
    Visitor.GetContactsForCompaign = function (nsp, country) {
        return __awaiter(this, void 0, void 0, function () {
            var visitorSessions;
            return __generator(this, function (_a) {
                try {
                    visitorSessions = this.db.collection('visitorSessions');
                    return [2 /*return*/, visitorSessions.find({ nsp: nsp, fullCountryName: { $in: country } }).project({ email: 1 }).toArray()];
                }
                catch (error) {
                    console.log('Error in getting email data');
                    console.log(error);
                }
                return [2 /*return*/];
            });
        });
    };
    Visitor.MatchLocation = function (ticket, operator, value) {
        return __awaiter(this, void 0, void 0, function () {
            var locationFromDB, regexLocation, countMatchedLocation, matched_location;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.collection('visitorSessions').find({ nsp: ticket.nsp }).project({ fullCountryName: 1 })];
                    case 1:
                        locationFromDB = _a.sent();
                        regexLocation = [];
                        regexLocation.push({
                            operator: operator,
                            locations: value
                        });
                        countMatchedLocation = 0;
                        matched_location = [];
                        regexLocation.map(function (element) {
                            countMatchedLocation = 0;
                            element.locations.map(function (location) {
                                if (element.operator == "IS" && locationFromDB && locationFromDB == location) {
                                    return countMatchedLocation++;
                                }
                                else if (element.operator == "ISNOT" && locationFromDB && locationFromDB != location) {
                                    return countMatchedLocation++;
                                }
                                else {
                                    return countMatchedLocation;
                                }
                            });
                            return matched_location.push({
                                operator: element.operator,
                                count: countMatchedLocation
                            });
                        });
                        return [2 /*return*/, ({ matchedLocationCount: matched_location, matchedboolean: (countMatchedLocation > 0) ? true : false })];
                }
            });
        });
    };
    Visitor.getAllVisitorsByToken = function (nsp, token, chunk, filters) {
        if (chunk === void 0) { chunk = undefined; }
        if (filters === void 0) { filters = ''; }
        return __awaiter(this, void 0, void 0, function () {
            var search_1, visitorList, error_14;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        search_1 = {};
                        search_1.nsp = nsp;
                        if (filters) {
                            Object.keys(filters).map(function (key) {
                                // console.log(key);
                                switch (key) {
                                    case 'location':
                                        search_1.location = { $in: filters[key] };
                                    case 'daterange':
                                        search_1.$and = [];
                                        search_1.$and.push({
                                            createdDate: {
                                                $gte: filters[key].from
                                            }
                                        });
                                        search_1.$and.push({
                                            createdDate: {
                                                $lte: filters[key].to
                                            }
                                        });
                                }
                            });
                        }
                        if (chunk)
                            search_1._id = {
                                $lt: new mongodb_1.ObjectId(chunk)
                            };
                        return [4 /*yield*/, this.collection.aggregate([
                                {
                                    $match: search_1
                                },
                                {
                                    $group: {
                                        "_id": "$" + ("" + token.toString()) + "",
                                        "id": { "$first": "$_id" },
                                        "username": { "$first": "$username" },
                                        "email": { "$first": "$email" },
                                        "sessions": { "$first": "$sessions" },
                                        "deviceID": { "$first": "$deviceID" },
                                        "createdDate": { "$first": "$createdDate" },
                                        "nsp": { "$first": "$nsp" },
                                        "phone": { "$first": "$phone" },
                                        "location": { "$first": "$location" },
                                    }
                                },
                                // {
                                //     '$project': {
                                //         _id: 0,
                                //         email: 1
                                //     }
                                // }
                                // { '$replaceRoot': { 'newRoot': '$visitor' } },
                                // { "$sort": { "visitor._id": -1 } },
                                {
                                    $sort: {
                                        id: -1
                                    }
                                },
                                {
                                    $limit: 20
                                },
                            ]).toArray()];
                    case 1:
                        visitorList = _a.sent();
                        if (visitorList && visitorList.length)
                            return [2 /*return*/, visitorList];
                        else
                            return [2 /*return*/, []];
                        return [3 /*break*/, 3];
                    case 2:
                        error_14 = _a.sent();
                        console.log('Error in Sending Visitors List');
                        console.log(error_14);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Visitor.searchCustomersTokenBased = function (nsp, keyword, token, chunk) {
        if (chunk === void 0) { chunk = ''; }
        return __awaiter(this, void 0, void 0, function () {
            var search, obj, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        search = {};
                        search.nsp = nsp;
                        if (chunk)
                            search._id = {
                                $lt: new mongodb_1.ObjectId(chunk)
                            };
                        if (keyword) {
                            search.$or = [
                                { username: new RegExp(keyword, 'i') },
                                { email: new RegExp(keyword, 'i') },
                                { deviceID: new RegExp(keyword, 'i') },
                            ];
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
                        return [4 /*yield*/, this.collection.aggregate([
                                {
                                    "$match": search
                                },
                                {
                                    $group: {
                                        "_id": "$" + ("" + token.toString()) + "",
                                        "id": { "$first": "$_id" },
                                        "username": { "$first": "$username" },
                                        "email": { "$first": "$email" },
                                        "sessions": { "$first": "$sessions" },
                                        "deviceID": { "$first": "$deviceID" },
                                        "createdDate": { "$first": "$createdDate" },
                                        "nsp": { "$first": "$nsp" },
                                    }
                                },
                                { "$sort": { id: -1 } },
                                { "$limit": 20 }
                            ]).toArray()];
                    case 1: 
                    //
                    // console.log(search);
                    return [2 /*return*/, _a.sent()];
                    case 2:
                        err_2 = _a.sent();
                        console.log('Error in Search Contacts');
                        console.log(err_2);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Visitor.getVisitorsCountByNsp = function (nsp, dateFrom, dateTo) {
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
                                        "createdDate": {
                                            "$gte": dateFrom,
                                            "$lt": dateTo
                                        }
                                    }
                                },
                                {
                                    "$project": {
                                        addedDate: { $substr: ["$createdDate", 0, 10] }
                                        //addedDate: { $split: ["$createdDate", "T"] }
                                        //addedDate: "$createdDate".split("T")[0] ,
                                    }
                                },
                                {
                                    "$group": { _id: { data: "$addedDate" }, count: { $sum: 1 } }
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
                        console.log('Error in getting customer count');
                        console.log(err_3);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Visitor.getDeviceIDs = function (nsp, chunk) {
        return __awaiter(this, void 0, void 0, function () {
            var match, result, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        match = {};
                        if (chunk != '') {
                            match._id = {
                                "$lt": new mongodb_1.ObjectId(chunk)
                            };
                        }
                        match.nsp = nsp;
                        match.deviceID = { $exists: true };
                        return [4 /*yield*/, this.collection.aggregate([
                                {
                                    "$match": match
                                },
                                {
                                    "$project": {
                                        "_id": "$_id",
                                        "deviceID": "$deviceID"
                                    }
                                }
                            ]).sort({ _id: -1 }).limit(20).toArray()];
                    case 1:
                        result = _a.sent();
                        if (result.length)
                            return [2 /*return*/, result];
                        else
                            return [2 /*return*/, []];
                        return [3 /*break*/, 3];
                    case 2:
                        err_4 = _a.sent();
                        console.log('Error in getting data');
                        console.log(err_4);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Visitor.trafficFilterByDeviceId = function (nsp, dateFrom, dateTo, deviceID) {
        return __awaiter(this, void 0, void 0, function () {
            var result, err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.aggregate([
                                {
                                    "$match": {
                                        "nsp": nsp,
                                        "createdDate": {
                                            "$gte": dateFrom,
                                            "$lt": dateTo
                                        },
                                        "deviceID": deviceID
                                    }
                                },
                                {
                                    "$project": {
                                        addedDate: { $substr: ["$createdDate", 0, 10] }
                                    }
                                },
                                {
                                    "$group": { _id: { data: "$addedDate" }, count: { $sum: 1 } }
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
                        err_5 = _a.sent();
                        console.log('Error in getting customer count');
                        console.log(err_5);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Visitor.getTraffic = function (nsp, dateFrom, dateTo) {
        return __awaiter(this, void 0, void 0, function () {
            var result, err_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.aggregate([
                                {
                                    "$match": {
                                        "nsp": nsp,
                                        "createdDate": {
                                            "$gte": dateFrom,
                                            "$lt": dateTo
                                        }
                                    }
                                },
                                {
                                    "$project": {
                                        country: "$location"
                                    }
                                },
                                {
                                    "$group": { _id: { data: "$country" }, count: { $sum: 1 } }
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
                        err_6 = _a.sent();
                        console.log('Error in getting traffic');
                        console.log(err_6);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Visitor.initialized = false;
    return Visitor;
}());
exports.Visitor = Visitor;
//# sourceMappingURL=visitorModel.js.map