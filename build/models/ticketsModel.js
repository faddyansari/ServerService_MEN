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
exports.Tickets = void 0;
// Created By Saad Ismail Shaikh
// Date : 05-03-18
var mongodb_1 = require("mongodb");
var TicketgroupModel_1 = require("./TicketgroupModel");
var request = require("request-promise");
var sessionsManager_1 = require("../globals/server/sessionsManager");
var teamsModel_1 = require("./teamsModel");
var aws_sqs_1 = require("../actions/aws/aws-sqs");
var TicketsDB_1 = require("../globals/config/databses/TicketsDB");
var cheerio = require("cheerio");
var json2xls = require('json2xls');
var fs = require('fs');
var path = require('path');
// import { Schema } from "mongoose";
// const {ObjectId} = require('mongodb');
var solr = require('solr-client');
var Tickets = /** @class */ (function () {
    function Tickets() {
    }
    Tickets.Initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c, error_1;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 4, , 5]);
                        _a = this;
                        return [4 /*yield*/, TicketsDB_1.TicketsDB.connect()];
                    case 1:
                        _a.db = _d.sent();
                        _b = this;
                        return [4 /*yield*/, this.db.createCollection('tickets')];
                    case 2:
                        _b.collection = _d.sent();
                        _c = this;
                        return [4 /*yield*/, this.db.createCollection('emailRecipients')];
                    case 3:
                        _c.collectionEmailRecipients = _d.sent();
                        Tickets.initialized = true;
                        return [2 /*return*/, Tickets.initialized];
                    case 4:
                        error_1 = _d.sent();
                        console.log(error_1);
                        console.log('error in Initializing Tickets Model');
                        throw new Error(error_1);
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.Destroy = function () {
        this.db = undefined;
        this.collection = undefined;
    };
    Tickets.getTicketByID = function (nsp, tid) {
        return __awaiter(this, void 0, void 0, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!tid[0]) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.collection.find({ _id: new mongodb_1.ObjectId(tid[0].toString()), nsp: nsp }).limit(1).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [2 /*return*/, []];
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        error_2 = _a.sent();
                        console.log('Error in getting particular ticket');
                        console.log(error_2);
                        return [2 /*return*/, []];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.getTicketsCountOP = function (nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.aggregate([
                                {
                                    '$match': {
                                        'nsp': nsp,
                                        '$and': [
                                            {
                                                'assigned_to': {
                                                    '$ne': ''
                                                }
                                            }, {
                                                'assigned_to': {
                                                    '$exists': true
                                                }
                                            }
                                        ]
                                    }
                                }, {
                                    '$group': {
                                        '_id': '$assigned_to',
                                        'open': {
                                            '$sum': {
                                                '$cond': {
                                                    'if': {
                                                        '$eq': [
                                                            '$state', 'OPEN'
                                                        ]
                                                    },
                                                    'then': 1,
                                                    'else': 0
                                                }
                                            }
                                        },
                                        'pending': {
                                            '$sum': {
                                                '$cond': {
                                                    'if': {
                                                        '$eq': [
                                                            '$state', 'PENDING'
                                                        ]
                                                    },
                                                    'then': 1,
                                                    'else': 0
                                                }
                                            }
                                        }
                                    }
                                }
                            ]).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_1 = _a.sent();
                        console.log("Error!");
                        console.log(err_1);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.getTicketById = function (tid) {
        return __awaiter(this, void 0, void 0, function () {
            var error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!tid) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.collection.find({ _id: new mongodb_1.ObjectId(tid.toString()) }).limit(1).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [2 /*return*/, []];
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        error_3 = _a.sent();
                        console.log('Error in getting particular ticket');
                        console.log(error_3);
                        return [2 /*return*/, []];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.getTicketHistoryEmail = function (nsp, email) {
        return __awaiter(this, void 0, void 0, function () {
            var error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.find({ nsp: nsp, sbtVisitor: email }, { sort: { _id: -1 } }).limit(20).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_4 = _a.sent();
                        console.log('Error in getting ticket history');
                        console.log(error_4);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.getTicketHistory = function (nsp, email, field) {
        return __awaiter(this, void 0, void 0, function () {
            var error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.find({
                                nsp: nsp, $or: [
                                    { sbtVisitor: { $exists: true, $eq: email } },
                                    { 'visitor.email': email },
                                    { 'dynamicFields.CM ID': { $exists: true, $eq: field } }
                                ]
                            }, { sort: { _id: -1 } }).limit(20).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_5 = _a.sent();
                        console.log('Error in getting ticket history');
                        console.log(error_5);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.Response = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    data.forEach(function (d) {
                        d.email = d.email.trim();
                        request.post({
                            uri: 'http://iconnapifunc01-beelinks-staging.iconn-asestaging01.p.azurewebsites.net/api/GetCustomerDetail?code=FAHyfi7kJqKD84O0MXs75GAoy7qh/ObKHnH6qlkN3qr1aI6OXbVCKg==',
                            body: {
                                "MailAddress": d.email,
                                "PhoneNumber": '',
                                "StockId": '',
                                "CustomerId": '',
                            },
                            json: true,
                            timeout: 50000
                        });
                        return 'done';
                    });
                }
                catch (error) {
                    console.log('Error in getting particular ticket');
                    console.log(error);
                    return [2 /*return*/, []];
                }
                return [2 /*return*/];
            });
        });
    };
    Tickets.getSurveyResults = function (nsp, tid) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.collection.find({ nsp: nsp, _id: new mongodb_1.ObjectID(tid) }).project({ SubmittedSurveyData: 1 }).limit(1).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Tickets.getMessagesByTicketId = function (tids) {
        return __awaiter(this, void 0, void 0, function () {
            var objectIdArray, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        objectIdArray = tids.map(function (s) { return new mongodb_1.ObjectId(s); });
                        return [4 /*yield*/, this.db.collection('ticketMessages').find({ tid: { $in: objectIdArray }, senderType: "Agent" }).sort({ _id: -1 }).limit(1).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_6 = _a.sent();
                        console.log('Error in getting message by ticket');
                        console.log(error_6);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.getTicketBySBTVisitor = function (nsp, datetime, visitorEmail) {
        return __awaiter(this, void 0, void 0, function () {
            var error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.aggregate([
                                {
                                    $match: {
                                        nsp: nsp,
                                        sbtVisitor: visitorEmail,
                                        datetime: { $gt: datetime }
                                    }
                                },
                                {
                                    $sort: {
                                        _id: -1
                                    }
                                }
                            ]).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_7 = _a.sent();
                        console.log('Error in getting particular ticket');
                        console.log(error_7);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.getPreviousTicketsByNSP = function (nsp, datetimeLessThan, datetimeGreaterThan) {
        return __awaiter(this, void 0, void 0, function () {
            var error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.aggregate([
                                {
                                    $match: {
                                        nsp: nsp,
                                        state: "OPEN",
                                        // $or:[{nsp:'/sbtjapan.com'},{nsp:'/sbtjapaninquiries.com'}],
                                        datetime: { $gt: datetimeLessThan, $lt: datetimeGreaterThan }
                                    }
                                },
                                {
                                    $sort: {
                                        _id: -1
                                    }
                                }
                            ]).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_8 = _a.sent();
                        console.log('Error in getting 2 days ticket');
                        console.log(error_8);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.CheckRegAgainstVisitor = function (emails, phones, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var error_9;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.find({
                                nsp: nsp,
                                CustomerInfo: { $exists: true },
                                reg_date: { $exists: true },
                                $or: [
                                    { sbtVisitor: { $in: emails } },
                                    { sbtVisitorPhone: { $in: phones } },
                                    (_a = {}, _a['visitor.email'] = { $in: emails }, _a),
                                    (_b = {}, _b['visitor.phone'] = { $in: phones }, _b),
                                    (_c = {}, _c['ICONNData.contactMailEmailAddress'] = { $elemMatch: { $in: emails } }, _c),
                                    (_d = {}, _d['ICONNData.contactPhoneNumber'] = { $elemMatch: { $in: phones } }, _d)
                                ]
                            }).project({ reg_date: 1 }).limit(1).toArray()];
                    case 1: return [2 /*return*/, _e.sent()];
                    case 2:
                        error_9 = _e.sent();
                        console.log('Error in Check Reg Against Visitor');
                        console.log(error_9);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.getTicketsByGroup = function (group_name, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.find({ nsp: nsp, group: group_name }).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_10 = _a.sent();
                        console.log('Error in getting ticket by group');
                        console.log(error_10);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.getTicketsByVisitorData = function (data, nsp, token) {
        return __awaiter(this, void 0, void 0, function () {
            var search, obj, error_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        search = {};
                        search.nsp = nsp;
                        search[token] = data;
                        obj = {};
                        if (token == 'visitor.email')
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
                        return [4 /*yield*/, this.collection.find(search).toArray()];
                    case 1: 
                    //console.log(search);
                    return [2 /*return*/, _a.sent()];
                    case 2:
                        error_11 = _a.sent();
                        console.log('Error in getting ticket by visitor');
                        console.log(error_11);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.getTicketIds = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var error_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        console.log('Get all ticket IDs');
                        if (!id) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.collection.find({ id: { $gt: new mongodb_1.ObjectId(id) } }, { fields: { id: 1 } }).limit(50).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [4 /*yield*/, this.collection.find({}, { fields: { _id: 1 } }).limit(50).toArray()];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_12 = _a.sent();
                        console.log('Error in getting ticket Id');
                        console.log(error_12);
                        return [2 /*return*/, []];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.DeleteIncomingEmailId = function (tid, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var error_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collectionEmailRecipients.deleteOne({ _id: new mongodb_1.ObjectId(tid), nsp: nsp })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_13 = _a.sent();
                        console.log('Error in getting particular ticket');
                        console.log(error_13);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.UpdateIncomingEmailId = function (tid, domainEmail, incomingEmail, name, group, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var error_14;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collectionEmailRecipients.findOneAndUpdate({ _id: new mongodb_1.ObjectId(tid), nsp: nsp }, { $set: { domainEmail: domainEmail, name: name, group: group, incomingEmail: incomingEmail } }, { returnOriginal: false, upsert: false })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_14 = _a.sent();
                        console.log('Error in getting particular ticket');
                        console.log(error_14);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.setPrimaryEmail = function (nsp, tid, flag) {
        return __awaiter(this, void 0, void 0, function () {
            var emails, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 8, , 9]);
                        if (!flag) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.collectionEmailRecipients.find({ nsp: nsp, primaryEmail: true }).toArray()];
                    case 1:
                        emails = _a.sent();
                        if (!(emails.length < 1)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.collectionEmailRecipients.findOneAndUpdate({ nsp: nsp, _id: new mongodb_1.ObjectId(tid) }, { $set: { primaryEmail: true } }, { returnOriginal: false, upsert: false })];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3: return [2 /*return*/, undefined];
                    case 4: return [3 /*break*/, 7];
                    case 5: return [4 /*yield*/, this.collectionEmailRecipients.findOneAndUpdate({ nsp: nsp, _id: new mongodb_1.ObjectId(tid) }, { $set: { primaryEmail: false } }, { returnOriginal: false, upsert: false })];
                    case 6: return [2 /*return*/, _a.sent()];
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        err_2 = _a.sent();
                        console.log('Error in setting primary email');
                        console.log(err_2);
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.SendActivationEmail = function (tid, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    return [2 /*return*/, this.collectionEmailRecipients.find({ _id: new mongodb_1.ObjectId(tid), nsp: nsp }).toArray()];
                }
                catch (error) {
                    console.log('Error in getting particular ticket');
                    console.log(error);
                }
                return [2 /*return*/];
            });
        });
    };
    Tickets.Snooze = function (time, agentEmail, ticketId, nsp, ticketlog) {
        return __awaiter(this, void 0, void 0, function () {
            var snoozeObj, error_15;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        snoozeObj = { snooze_time: time, email: agentEmail };
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ _id: new mongodb_1.ObjectID(ticketId), nsp: nsp }, { $set: { snoozes: snoozeObj, lasttouchedTime: new Date().toISOString() }, $push: { ticketlog: ticketlog } }, { returnOriginal: false, upsert: false })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_15 = _a.sent();
                        console.log('Error in setting ticket snooze');
                        console.log(error_15);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.InsertStatus = function (id, nsp, status, ticketlog) {
        return __awaiter(this, void 0, void 0, function () {
            var err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        if (!(status == 'REJECT')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ _id: new mongodb_1.ObjectId(id), nsp: nsp }, { $set: { status: status, state: 'CLOSED', closed_time: new Date().toISOString() }, $push: { ticketlog: ticketlog } }, { returnOriginal: false, upsert: false })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [4 /*yield*/, this.collection.findOneAndUpdate({ _id: new mongodb_1.ObjectId(id), nsp: nsp }, { $set: { status: status }, $push: { ticketlog: ticketlog } }, { returnOriginal: false, upsert: false })];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        err_3 = _a.sent();
                        console.log('Error in InsertCustomerInfo');
                        console.log(err_3);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.InsertCustomerInfo = function (id, nsp, cusInfo, reCusInfo, ICONNData, ticketlog, reg_date) {
        return __awaiter(this, void 0, void 0, function () {
            var err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ _id: new mongodb_1.ObjectID(id), nsp: nsp }, { $set: { CustomerInfo: cusInfo, RelatedCustomerInfo: reCusInfo, reg_date: reg_date }, $push: { ticketlog: ticketlog } }, { upsert: false, returnOriginal: false })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_4 = _a.sent();
                        console.log('Error in InsertCustomerInfo');
                        console.log(err_4);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.UnBindIconnCustomer = function (id, nsp, ticketlog) {
        return __awaiter(this, void 0, void 0, function () {
            var err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ _id: new mongodb_1.ObjectID(id), nsp: nsp }, { $set: { CustomerInfo: {} }, $push: { ticketlog: ticketlog } }, { upsert: false, returnOriginal: false })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_5 = _a.sent();
                        console.log('Error in UnBindIconnCustomer');
                        console.log(err_5);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.AddIncomingEmail = function (domainEmail, incomingAgent, group, name, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var error_16;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collectionEmailRecipients.insertOne({ nsp: nsp, group: group, email: incomingAgent, name: name, activated: false, primaryEmail: false, domainEmail: domainEmail, applyExternalRulesets: true, canUseOriginalEmail: false, useOriginalEmail: false, iconnDispatcher: false, acknowledgementEmail: true })];
                    case 1: 
                    // await this.db.collection('ticketgroups').findOneAndUpdate({ nsp: nsp, groups: { $elemMatch: { group_name: group } } }, { $addToSet: { 'groups.$.agent_list': { email: domainEmail, count: 0 } } }, { returnOriginal: false, upsert: false });
                    return [2 /*return*/, _a.sent()];
                    case 2:
                        error_16 = _a.sent();
                        console.log('Error in adding ext. agents');
                        console.log(error_16);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.addWatchers = function (tids, agents, ticketlog, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var objectIdArray, temp_1, tickets, err_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        objectIdArray = tids.map(function (s) { return new mongodb_1.ObjectId(s); });
                        return [4 /*yield*/, this.collection.updateMany({ _id: { $in: objectIdArray }, nsp: nsp }, { $set: { lasttouchedTime: new Date().toISOString() }, $addToSet: { watchers: agents[0], ticketlog: ticketlog } }, { upsert: false })];
                    case 1:
                        temp_1 = _a.sent();
                        if (!(temp_1 && temp_1.modifiedCount == tids.length)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.collection.find({ _id: { $in: objectIdArray } }).limit(tids.length).toArray()];
                    case 2:
                        tickets = _a.sent();
                        if (nsp == '/hrm.sbtjapan.com' || nsp == '/sbtjapan.com') {
                            this.updateTicketSolr(tickets);
                        }
                        return [2 /*return*/, tickets];
                    case 3: return [2 /*return*/, []];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        err_6 = _a.sent();
                        console.log('Error in adding watchers');
                        console.log(err_6);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.getWatchers = function (id, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var err_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.find({ _id: new mongodb_1.ObjectID(id), nsp: nsp }).project({ watchers: 1 }).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_7 = _a.sent();
                        console.log('Error in getting watchers');
                        console.log(err_7);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.ToggleExternalRuleset = function (id, value) {
        return __awaiter(this, void 0, void 0, function () {
            var error_17;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collectionEmailRecipients.findOneAndUpdate({ _id: new mongodb_1.ObjectID(id) }, { $set: { applyExternalRulesets: value } })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_17 = _a.sent();
                        console.log('Error in adding ext. agents');
                        console.log(error_17);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.ToggleIconnDispatcher = function (id, value) {
        return __awaiter(this, void 0, void 0, function () {
            var error_18;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collectionEmailRecipients.findOneAndUpdate({ _id: new mongodb_1.ObjectID(id) }, { $set: { iconnDispatcher: value } })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_18 = _a.sent();
                        console.log('Error in adding ext. agents');
                        console.log(error_18);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.ToggleIconnDispatcherTicketView = function (id, value) {
        return __awaiter(this, void 0, void 0, function () {
            var error_19;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collectionEmailRecipients.findOneAndUpdate({ _id: new mongodb_1.ObjectID(id) }, { $set: { iconnDispatcherTicketView: value } })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_19 = _a.sent();
                        console.log('Error in adding ToggleIconnDispatcherTicketView');
                        console.log(error_19);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.ToggleAckEmail = function (id, value) {
        return __awaiter(this, void 0, void 0, function () {
            var error_20;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collectionEmailRecipients.findOneAndUpdate({ _id: new mongodb_1.ObjectID(id) }, { $set: { acknowledgementEmail: value } })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_20 = _a.sent();
                        console.log('Error in adding ext. agents');
                        console.log(error_20);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.ToggleUseOriginalEmail = function (id, value) {
        return __awaiter(this, void 0, void 0, function () {
            var error_21;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collectionEmailRecipients.findOneAndUpdate({ _id: new mongodb_1.ObjectID(id) }, { $set: { useOriginalEmail: value } })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_21 = _a.sent();
                        console.log('Error in adding ext. agents');
                        console.log(error_21);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.ConfirmActivation = function (Activationemail) {
        return __awaiter(this, void 0, void 0, function () {
            var error_22;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collectionEmailRecipients.findOneAndUpdate({
                                email: Activationemail
                            }, { $set: { activated: true } })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_22 = _a.sent();
                        console.log('Error in adding ext. agents');
                        console.log(error_22);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.GetIncomingEmails = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            var email_data, error_23;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collectionEmailRecipients.find({ domainEmail: email }).limit(1).toArray()];
                    case 1:
                        email_data = _a.sent();
                        return [2 /*return*/, email_data];
                    case 2:
                        error_23 = _a.sent();
                        console.log(error_23);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.GetIncomingEmailsCount = function (nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var error_24;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collectionEmailRecipients.aggregate([
                                { "$match": { "nsp": nsp } },
                                { "$group": { "_id": null, "count": { $sum: 1 } } },
                            ]).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_24 = _a.sent();
                        console.log(error_24);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.GetForwardingEmail = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            var email_data, error_25;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collectionEmailRecipients.find({ email: email }).toArray()];
                    case 1:
                        email_data = _a.sent();
                        return [2 /*return*/, email_data];
                    case 2:
                        error_25 = _a.sent();
                        console.log(error_25);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.GetPrimaryEmail = function (nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var email_data, error_26;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collectionEmailRecipients.find({ primaryEmail: true, nsp: nsp }).toArray()];
                    case 1:
                        email_data = _a.sent();
                        return [2 /*return*/, email_data];
                    case 2:
                        error_26 = _a.sent();
                        console.log(error_26);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.GetIncomingEmail = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            var email_data, error_27;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collectionEmailRecipients.find({
                                $and: [
                                    { activated: true },
                                    {
                                        $or: [
                                            { domainEmail: email },
                                            { email: email }
                                        ]
                                    }
                                ]
                            }).limit(1).toArray()];
                    case 1:
                        email_data = _a.sent();
                        return [2 /*return*/, email_data];
                    case 2:
                        error_27 = _a.sent();
                        console.log(error_27);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.GetIncomingEmailsByNSP = function (nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var email_data, error_28;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collectionEmailRecipients.find({ nsp: nsp }).toArray()];
                    case 1:
                        email_data = _a.sent();
                        return [2 /*return*/, email_data];
                    case 2:
                        error_28 = _a.sent();
                        console.log(error_28);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.getExportData = function (datafrom, datato, nsp, email, canView, filters, clause, query, sortBy, assignType, mergeType) {
        return __awaiter(this, void 0, void 0, function () {
            var filtersObject_1, obj, $or, _id, tickets, objectIdArray, _a, groups, teamMembers, sort, error_29;
            var _b, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _f.trys.push([0, 11, , 12]);
                        // console.log(datafrom);
                        // console.log(datato);
                        // console.log(filters);
                        if (!clause)
                            clause = "$and";
                        filtersObject_1 = (_b = {}, _b[clause] = [], _b);
                        obj = { 'nsp': nsp };
                        $or = [];
                        _id = undefined;
                        if (filters) {
                            Object.keys(filters).map(function (key) {
                                // if (key == 'daterange') {
                                //     filters[key].to = new Date(new Date(filters[key].to).getTime() + (60 * 60 * 24 * 1000) - 1);
                                //     filtersObject[clause].push({ 'datetime': { $gte: new Date(filters[key].from).toISOString(), $lt: new Date(filters[key].to).toISOString() } });
                                //     // console.log('Date From', filters[key].from);
                                //     // console.log('Date To ', filters[key].to)
                                //     // if (new Date(filters[key].from).toISOString() == new Date(filters[key].to).toISOString()) {
                                //     //     filtersObject[clause].push({ 'datetime': { $gte: new Date(filters[key].from).toISOString(), $lt: new Date(filters[key].to).toISOString() } })
                                //     // }
                                //     // filtersObject[clause].push({ 'datetime': { $lte: new Date(filters[key].to).toISOString() } })
                                var _a, _b;
                                //     return;
                                // }
                                if (Array.isArray(filters[key])) {
                                    filtersObject_1[clause].push((_a = {}, _a[key] = { '$in': filters[key] }, _a));
                                }
                                else
                                    filtersObject_1[clause].push((_b = {}, _b[key] = filters[key], _b));
                            });
                        }
                        if (mongodb_1.ObjectID.isValid(query))
                            _id = { _id: new mongodb_1.ObjectID(query) };
                        if (filtersObject_1[clause].length)
                            Object.assign(obj, filtersObject_1);
                        if (!query) return [3 /*break*/, 2];
                        $or = [
                            { subject: new RegExp(query, 'gmi') },
                            { from: new RegExp(query) },
                            (_c = {}, _c['visitor.name'] = new RegExp(query, 'gmi'), _c),
                            (_d = {}, _d['visitor.email'] = new RegExp(query, 'gmi'), _d),
                            { clientID: new RegExp(query, 'gmi') }
                        ];
                        return [4 /*yield*/, this.db.collection('ticketMessages').aggregate([
                                {
                                    '$match': {
                                        nsp: nsp,
                                        $and: [
                                            {
                                                $text: {
                                                    $search: query
                                                }
                                            },
                                            {
                                                message: new RegExp(query)
                                            }
                                        ]
                                    }
                                }, {
                                    '$group': {
                                        '_id': '$nsp',
                                        'tids': {
                                            '$addToSet': {
                                                '$arrayElemAt': [
                                                    '$tid', 0
                                                ]
                                            }
                                        }
                                    }
                                }
                            ]).limit(1).toArray()];
                    case 1:
                        tickets = _f.sent();
                        if (tickets && tickets.length && tickets[0].tids.length) {
                            objectIdArray = tickets[0].tids.map(function (s) { return new mongodb_1.ObjectId(s); });
                            $or.push({ _id: { $in: objectIdArray } });
                            // console.log($or[4]);
                        }
                        _f.label = 2;
                    case 2:
                        if (_id)
                            $or.push(_id);
                        _a = canView;
                        switch (_a) {
                            case 'all': return [3 /*break*/, 3];
                            case 'assignedOnly': return [3 /*break*/, 4];
                            case 'group': return [3 /*break*/, 5];
                            case 'team': return [3 /*break*/, 7];
                        }
                        return [3 /*break*/, 9];
                    case 3: 
                    //Do Nothing
                    return [3 /*break*/, 10];
                    case 4:
                        Object.assign(obj, { "assigned_to": email });
                        return [3 /*break*/, 10];
                    case 5: return [4 /*yield*/, TicketgroupModel_1.TicketGroupsModel.getGroupsbyAdmin(nsp, email)];
                    case 6:
                        groups = _f.sent();
                        Object.assign(obj, {
                            '$or': [
                                { group: { '$in': groups } },
                                { assigned_to: email }
                            ]
                        });
                        return [3 /*break*/, 10];
                    case 7: return [4 /*yield*/, teamsModel_1.TeamsModel.getTeamMembersAgainstAgent(nsp, email)];
                    case 8:
                        teamMembers = _f.sent();
                        // console.log(teamMembers);
                        Object.assign(obj, { "assigned_to": { '$in': teamMembers } });
                        return [3 /*break*/, 10];
                    case 9: return [3 /*break*/, 10];
                    case 10:
                        switch (assignType) {
                            case 'assigned':
                                Object.assign(obj, {
                                    assigned_to: {
                                        $exists: true
                                    }
                                });
                                break;
                            case 'unassigned':
                                Object.assign(obj, {
                                    $or: [
                                        {
                                            assigned_to: {
                                                $exists: false
                                            }
                                        },
                                        {
                                            assigned_to: ''
                                        }
                                    ]
                                });
                                break;
                            default:
                                break;
                        }
                        switch (mergeType) {
                            case 'yes':
                                Object.assign(obj, {
                                    merged: true
                                });
                                break;
                            case 'no':
                                Object.assign(obj, {
                                    $or: [
                                        {
                                            merged: {
                                                $exists: false
                                            }
                                        },
                                        {
                                            merged: false
                                        }
                                    ]
                                });
                                break;
                            default:
                                break;
                        }
                        if (query)
                            Object.assign(obj, { '$or': $or });
                        sort = void 0;
                        if (sortBy && sortBy.name) {
                            sort = (_e = {},
                                _e[sortBy.name] = parseInt(sortBy.type),
                                _e);
                        }
                        return [2 /*return*/, this.collection.aggregate([
                                {
                                    '$match': obj
                                }, {
                                    '$addFields': {
                                        'dateISO': {
                                            '$dateFromString': {
                                                'dateString': '$datetime'
                                            }
                                        }
                                    }
                                }, {
                                    '$match': {
                                        'dateISO': {
                                            '$lte': new Date(datato),
                                            '$gte': new Date(datafrom) //datato.name
                                        }
                                    }
                                },
                                { "$sort": (sort) ? sort : { 'lasttouchedTime': -1 } }
                            ]).toArray()];
                    case 11:
                        error_29 = _f.sent();
                        console.log('Error in getting exportdata');
                        console.log(error_29);
                        return [3 /*break*/, 12];
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.MoveToClosed = function (notPrimaryRef, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var objectIdArray, error_30;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        objectIdArray = notPrimaryRef.map(function (s) { return new mongodb_1.ObjectId(s); });
                        return [4 /*yield*/, this.collection.update({ _id: { $in: objectIdArray }, nsp: nsp }, { $set: { state: "CLOSED", lasttouchedTime: new Date().toISOString() } }, { upsert: false, multi: true })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.collection.find({ _id: { $in: objectIdArray } }).toArray()];
                    case 2:
                        error_30 = _a.sent();
                        console.log('Error in MoveToClosed');
                        console.log(error_30);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.CreateTicket = function (ticket) {
        return __awaiter(this, void 0, void 0, function () {
            var data, clientID, updatedTicket, error_31;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, this.collection.insertOne(JSON.parse(JSON.stringify(ticket)))];
                    case 1:
                        data = _a.sent();
                        if (!(data && data.insertedCount > 0)) return [3 /*break*/, 4];
                        return [4 /*yield*/, Tickets.getTicketClientID(data.ops[0]._id.toHexString(), ticket.nsp)];
                    case 2:
                        clientID = _a.sent();
                        if (!clientID) return [3 /*break*/, 4];
                        return [4 /*yield*/, Tickets.SetClientID(data.ops[0]._id, data.ops[0].nsp, clientID.toString())];
                    case 3:
                        updatedTicket = _a.sent();
                        if (updatedTicket)
                            data.ops[0].clientID = clientID;
                        _a.label = 4;
                    case 4: return [2 /*return*/, data];
                    case 5:
                        error_31 = _a.sent();
                        console.log('Error in Create Conversation');
                        console.log(error_31);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.onerror = function (err) {
        console.error(err);
    };
    Tickets.CommitSolr = function (docs) {
        return new Promise(function (resolve, reject) {
            var client = solr.createClient({
                host: '127.0.0.1',
                port: '8983',
                core: 'sample_new',
            });
            client.add(docs, function (err, obj) {
                if (err) {
                    //console.log(err);
                    reject(err);
                }
                else {
                    // console.log('Added Docs', obj);
                    client.commit(function (err, res) {
                        if (err)
                            reject(err);
                        if (res)
                            resolve(obj);
                    });
                }
            });
        });
    };
    Tickets.CheckMessageEntry = function (ticket) {
        return __awaiter(this, void 0, void 0, function () {
            var error_32;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (!Array.isArray(ticket._id))
                            ticket._id = [ticket._id];
                        return [4 /*yield*/, this.db.collection('ticketMessages').find({
                                senderType: 'Agent', nsp: ticket.nsp, tid: { $in: (ticket._id) }
                            }).sort({ _id: -1 }).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_32 = _a.sent();
                        console.log(error_32);
                        console.log('Error in Getting Snoozing Tickets');
                        //Send Sentry Email
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.UnsetBooleanOrPushLog = function (id, nsp, log) {
        return __awaiter(this, void 0, void 0, function () {
            var error_33;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        if (!log) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ _id: id, nsp: nsp }, { $set: { 'slaPolicy.reminderResolution': true, 'slaPolicy.violationResponse': true, lasttouchedTime: new Date().toISOString() }, $push: { ticketlog: log } }, { returnOriginal: false, upsert: false })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [4 /*yield*/, this.collection.findOneAndUpdate({ _id: id, nsp: nsp }, { $set: { 'slaPolicy.reminderResponse': true, 'slaPolicy.violationResponse': true, lasttouchedTime: new Date().toISOString() } }, { returnOriginal: false, upsert: false })];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_33 = _a.sent();
                        console.log('Error in unsetting policy');
                        console.log(error_33);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.TicketClosed = function (tids, closed_time) {
        return __awaiter(this, void 0, void 0, function () {
            var temp_2, err_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        temp_2 = tids.map(function (tid) { return new mongodb_1.ObjectId(tid); });
                        return [4 /*yield*/, this.collection.update({ _id: { $in: temp_2 } }, { $set: { closed_time: closed_time } }, { multi: true })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.collection.find({ _id: { $in: temp_2 } }).toArray()];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        err_8 = _a.sent();
                        console.log('Error in Ticket Closed');
                        console.log(err_8);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.SetViolationTime = function (id, nsp, log) {
        return __awaiter(this, void 0, void 0, function () {
            var error_34;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        if (!log) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ _id: id, nsp: nsp }, { $set: { 'slaPolicy.violationResolution': true, 'slaPolicy.violationResponse': true, lasttouchedTime: new Date().toISOString() }, $push: { ticketlog: log } }, { returnOriginal: false, upsert: false })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [4 /*yield*/, this.collection.findOneAndUpdate({ _id: id, nsp: nsp }, { $set: { 'slaPolicy.violationResolution': true, lasttouchedTime: new Date().toISOString() } }, { returnOriginal: false, upsert: false })];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_34 = _a.sent();
                        console.log('Error in unsetting policy');
                        console.log(error_34);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.checkQuery = function () {
        return __awaiter(this, void 0, void 0, function () {
            var docs_1, count_1, err_9;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        docs_1 = [];
                        count_1 = 0;
                        return [4 /*yield*/, this.db.collection('ticketMessages').find({ nsp: '/sbtjapan.com' }).forEach(function (message) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            docs_1.push(message);
                                            count_1++;
                                            if (!!(count_1 % 1000)) return [3 /*break*/, 2];
                                            console.log('Adding to SOlr');
                                            return [4 /*yield*/, this.CommitSolr(docs_1)];
                                        case 1:
                                            _a.sent();
                                            docs_1 = [];
                                            count_1 == 0;
                                            _a.label = 2;
                                        case 2: return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 1:
                        _a.sent();
                        if (!count_1) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.CommitSolr(docs_1)];
                    case 2:
                        _a.sent();
                        count_1 = 0;
                        docs_1 = [];
                        _a.label = 3;
                    case 3:
                        console.log('Added ALl to SOlr');
                        return [3 /*break*/, 5];
                    case 4:
                        err_9 = _a.sent();
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.AgentLevel = function (agentsArray, currentAgent, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var error_35;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ agent_email: currentAgent, nsp: nsp }, { $set: { externalAgents: agentsArray } }, { returnOriginal: false, upsert: false })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_35 = _a.sent();
                        console.log('Error in adding ext. agents');
                        console.log(error_35);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.TicketsAccToLevel = function (agentsArray, currentAgent, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var error_36;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ agent_email: currentAgent, nsp: nsp }, { $set: { externalAgents: agentsArray } }, { returnOriginal: false, upsert: false })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_36 = _a.sent();
                        console.log('Error in adding ext. agents');
                        console.log(error_36);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.BulkTagAssign = function (ids, tagToassign, ticketlog) {
        return __awaiter(this, void 0, void 0, function () {
            var objectIdArray, error_37;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        objectIdArray = ids.map(function (s) { return new mongodb_1.ObjectId(s); });
                        // let search =  await this.collection.find({ _id: { $in: objectIdArray } }).toArray();
                        // search.forEach(element => {
                        //     if(element.tags && element.tags.length){
                        return [4 /*yield*/, this.collection.update({ _id: { $in: objectIdArray } }, { "$push": { "tags": tagToassign, ticketlog: ticketlog } }, { "multi": true })];
                    case 1:
                        // let search =  await this.collection.find({ _id: { $in: objectIdArray } }).toArray();
                        // search.forEach(element => {
                        //     if(element.tags && element.tags.length){
                        _a.sent();
                        return [4 /*yield*/, this.collection.find({ _id: { $in: objectIdArray } }).toArray()];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_37 = _a.sent();
                        console.log('Error in bulk tag assignment');
                        console.log(error_37);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.getBulkTickets = function (ids) {
        return __awaiter(this, void 0, void 0, function () {
            var objectIdArray, error_38;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        objectIdArray = ids.map(function (s) { return new mongodb_1.ObjectId(s); });
                        return [4 /*yield*/, this.collection.find({ _id: { $in: objectIdArray } }).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_38 = _a.sent();
                        console.log('Error in bulk assignment');
                        console.log(error_38);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.BulkAgentAssign = function (ids, emailToassign, ticketlog) {
        return __awaiter(this, void 0, void 0, function () {
            var objectIdArray, error_39;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        objectIdArray = ids.map(function (s) { return new mongodb_1.ObjectId(s); });
                        return [4 /*yield*/, this.collection.update({ _id: { $in: objectIdArray } }, { $set: { assigned_to: emailToassign, lasttouchedTime: new Date().toISOString() }, $push: { ticketlog: ticketlog } }, { upsert: false, multi: true })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.collection.find({ _id: { $in: objectIdArray } }).toArray()];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_39 = _a.sent();
                        console.log('Error in bulk assignment');
                        console.log(error_39);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.getcount = function (agents) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    return [2 /*return*/, this.collection.aggregate([
                            {
                                '$match': {
                                    'assigned_to': {
                                        '$in': agents
                                    }
                                }
                            }, {
                                '$group': {
                                    '_id': '$assigned_to',
                                    'count': {
                                        '$sum': 1
                                    }
                                }
                            }
                        ]).toArray()];
                    // this.collection.aggregate([
                    //     {
                    //       $unwind: "$assigned_to"
                    //     },
                    //     {
                    //       $group: {
                    //         _id: "$assigned_to",
                    //         count: {
                    //           $sum: 1
                    //         }
                    //       }
                    //     }
                    //   ])
                    // return this.collection.find({ assigned_to: { $in: agents } }).toArray();
                }
                catch (err) {
                    console.log('Error in search assignment count');
                    console.log(err);
                }
                return [2 /*return*/];
            });
        });
    };
    Tickets.EmailSignature = function (header, footer, agent) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                try {
                    data = {
                        header: header,
                        footer: footer,
                        agent_email: agent,
                        active: false,
                        createdOn: new Date().toISOString()
                    };
                    return [2 /*return*/, this.db.collection('emailSignatures').insertOne(data)];
                }
                catch (error) {
                    console.log(error);
                    console.log('error in email signs in ticketmodel');
                }
                return [2 /*return*/];
            });
        });
    };
    Tickets.UpdateSignature = function (header, footer, id, lastModified, email) {
        return __awaiter(this, void 0, void 0, function () {
            var error_40;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.db.collection('emailSignatures').findOneAndUpdate({ _id: new mongodb_1.ObjectID(id), agent_email: email }, { $set: { header: header, footer: footer, lastModified: lastModified } }, { returnOriginal: false, upsert: false })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_40 = _a.sent();
                        console.log('error in updating signature');
                        console.log(error_40);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.getSign = function (agent_email) {
        return __awaiter(this, void 0, void 0, function () {
            var err_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.db.collection('emailSignatures').find({ agent_email: agent_email }).sort({ createdOn: -1 }).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_10 = _a.sent();
                        console.log('Error in Get Signatures');
                        console.log(err_10);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.updateCheckedOne = function (threadid, todos, ids) {
        return __awaiter(this, void 0, void 0, function () {
            var objectIdArray, error_41;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        objectIdArray = ids.map(function (s) { return new mongodb_1.ObjectId(s); });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ "todo.id": { $in: objectIdArray } }, { $set: { "todo.$[elem].completed": true } }, { arrayFilters: [{ "elem.id": { $in: objectIdArray } }], upsert: false, returnOriginal: false })];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_41 = _a.sent();
                        console.log('error in update CheckedOne');
                        console.log(error_41);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.checkedTask = function (threadid, id, status, ticketlog) {
        return __awaiter(this, void 0, void 0, function () {
            var err_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ _id: new mongodb_1.ObjectId(threadid), "todo.id": new mongodb_1.ObjectId(id) }, { $set: { "todo.$[elem].completed": status }, $push: { ticketlog: ticketlog } }, { arrayFilters: [{ "elem.id": new mongodb_1.ObjectId(id) }], upsert: false, returnOriginal: false })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_11 = _a.sent();
                        console.log(err_11);
                        console.log("error in updating completed tasks");
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.updateTask = function (threadid, id, properties, ticketlog) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    return [2 /*return*/, this.collection.findOneAndUpdate({
                            _id: new mongodb_1.ObjectId(threadid),
                            "todo.id": new mongodb_1.ObjectId(id)
                        }, {
                            $set: { "todo.$.todo": properties },
                            $push: { ticketlog: ticketlog }
                        }, { returnOriginal: false, upsert: false })];
                }
                catch (err) {
                    console.log(err);
                }
                return [2 /*return*/];
            });
        });
    };
    Tickets.bulkTicketsUnread = function (tids, viewState) {
        return __awaiter(this, void 0, void 0, function () {
            var objectIdArray, temp_3, error_42;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        objectIdArray = tids.map(function (s) { return new mongodb_1.ObjectId(s); });
                        return [4 /*yield*/, this.collection.updateMany({ _id: { $in: objectIdArray } }, { $set: { viewState: viewState } }, { upsert: false })];
                    case 1:
                        temp_3 = _a.sent();
                        if (!(temp_3 && temp_3.modifiedCount == tids.length)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.collection.find({ _id: { $in: objectIdArray } }).limit(tids.length).toArray()];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3: return [2 /*return*/, []];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_42 = _a.sent();
                        console.log('Error in bulk mark Unread');
                        console.log(error_42);
                        return [2 /*return*/, []];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.bulkTicketsRead = function (ids, viewState) {
        return __awaiter(this, void 0, void 0, function () {
            var objectIdArray, error_43;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        objectIdArray = ids.map(function (s) { return new mongodb_1.ObjectId(s); });
                        return [4 /*yield*/, this.collection.update({ _id: { $in: objectIdArray } }, { $set: { viewState: viewState, lasttouchedTime: new Date().toISOString() } }, { upsert: false, multi: true })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.collection.find({ _id: { $in: objectIdArray } }).toArray()];
                    case 2:
                        error_43 = _a.sent();
                        console.log('Error in bulk mark Read');
                        console.log(error_43);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.getTask = function (nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var err_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.find({ nsp: nsp }).project({ todo: 1 }).limit(1).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_12 = _a.sent();
                        console.log('Error in Get tasks');
                        console.log(err_12);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.getActiveSignature = function (agent_email) {
        return __awaiter(this, void 0, void 0, function () {
            var err_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.db.collection('emailSignatures').find({ agent_email: agent_email, active: { $eq: true } }).sort({ createdOn: -1 }).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_13 = _a.sent();
                        console.log('Error in Get Signatures');
                        console.log(err_13);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.toggleSign = function (agent, signId, flag, lastModified) {
        return __awaiter(this, void 0, void 0, function () {
            var error_44;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.db.collection('emailSignatures').findOneAndUpdate({ active: true, agent_email: agent }, {
                                $set: { active: false },
                            }, { returnOriginal: false, upsert: false })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.db.collection('emailSignatures').findOneAndUpdate({ _id: new mongodb_1.ObjectID(signId), agent_email: agent }, {
                                $set: { active: flag, lastModified: lastModified },
                            }, { returnOriginal: false, upsert: false })];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_44 = _a.sent();
                        console.log('Error in activating surveys');
                        console.log(error_44);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.deleteSign = function (signId, agent) {
        return __awaiter(this, void 0, void 0, function () {
            var error_45;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.db.collection('emailSignatures').deleteOne({ _id: new mongodb_1.ObjectId(signId) })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_45 = _a.sent();
                        console.log('Error in deleting signature');
                        console.log(error_45);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.UpdateTicketNote = function (tids, note, nsp, ticketlog) {
        return __awaiter(this, void 0, void 0, function () {
            var temp_4, result, error_46;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        temp_4 = tids.map(function (tid) { return new mongodb_1.ObjectId(tid); });
                        return [4 /*yield*/, this.collection.updateMany({ _id: { $in: temp_4 }, nsp: nsp }, {
                                $push: { ticketNotes: note, ticketlog: ticketlog }
                            }, { upsert: false })];
                    case 1:
                        result = _a.sent();
                        if (!(result && result.result.ok && result.modifiedCount == tids.length)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.collection.find({ _id: { $in: temp_4 }, nsp: nsp }).limit(tids.length).toArray()];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3: return [2 /*return*/, []];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_46 = _a.sent();
                        console.log(error_46);
                        console.log('error in Editing ticket note Properties in ticketmodel');
                        return [2 /*return*/, []];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.UpdateViewState = function (tids, nsp, viewState, ticketlog) {
        return __awaiter(this, void 0, void 0, function () {
            var objectIdArray, temp_5, datetime_1, error_47;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 9, , 10]);
                        objectIdArray = tids.map(function (s) { return new mongodb_1.ObjectId(s); });
                        if (!(viewState == 'READ')) return [3 /*break*/, 3];
                        datetime_1 = new Date().toISOString();
                        return [4 /*yield*/, this.collection.updateMany({ _id: { $in: objectIdArray }, nsp: nsp }, { $set: { last_read_date: datetime_1 }, $push: { ticketlog: ticketlog } }, { upsert: false })];
                    case 1:
                        temp_5 = _a.sent();
                        return [4 /*yield*/, this.collection.find({ _id: { $in: objectIdArray } }).forEach(function (x) {
                                if (!x.assigned_to || (x.assigned_to && x.assigned_to == ticketlog.updated_by)) {
                                    x.viewState = viewState;
                                }
                                if (x.assignmentList && x.assignmentList.length) {
                                    if (x.assignmentList.filter(function (a) { return a.assigned_to == ticketlog.updated_by; }).length) {
                                        x.assignmentList.filter(function (a) { return a.assigned_to == ticketlog.updated_by; }).sort(function (a, b) { return (Number(new Date(b.assigned_time)) - Number(new Date(a.assigned_time))); })[0].read_date = datetime_1;
                                    }
                                }
                                _this.collection.save(x);
                            })];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, this.collection.updateMany({ _id: { $in: objectIdArray }, nsp: nsp }, { $set: { viewState: viewState }, $push: { ticketlog: ticketlog } }, { upsert: false })];
                    case 4:
                        temp_5 = _a.sent();
                        _a.label = 5;
                    case 5:
                        if (!(temp_5 && temp_5.modifiedCount)) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.collection.find({ _id: { $in: objectIdArray } }).toArray()];
                    case 6: return [2 /*return*/, _a.sent()];
                    case 7: return [2 /*return*/, []];
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        error_47 = _a.sent();
                        console.log('Error in Update View State');
                        console.log(error_47);
                        return [2 /*return*/, []];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.UpdateFirstReadDate = function (tids, nsp, ticketlog) {
        return __awaiter(this, void 0, void 0, function () {
            var objectIdArray, datetime, error_48;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        objectIdArray = tids.map(function (s) { return new mongodb_1.ObjectId(s); });
                        datetime = new Date().toISOString();
                        return [4 /*yield*/, this.collection.updateMany({ _id: { $in: objectIdArray }, nsp: nsp, first_read_date: { $exists: false } }, { $set: { first_read_date: datetime }, $push: { ticketlog: ticketlog } }, { upsert: false })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_48 = _a.sent();
                        console.log('Error in Update First Read Date');
                        console.log(error_48);
                        return [2 /*return*/, undefined];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.GetMessageByID = function (messageId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    return [2 /*return*/, this.db.collection('ticketMessages').find({ messageId: messageId }).limit(1).toArray()];
                }
                catch (error) {
                    console.log(error);
                    console.log('Error in Get message by messageId');
                }
                return [2 /*return*/];
            });
        });
    };
    Tickets.GetMessageIdByTID = function (tid) {
        return __awaiter(this, void 0, void 0, function () {
            var objectIdArray, lastMessage, error_49;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        objectIdArray = tid.map(function (s) { return new mongodb_1.ObjectId(s); });
                        return [4 /*yield*/, this.db.collection('ticketMessages').find({
                                tid: { $in: tid }
                            }).sort({ _id: -1 }).limit(1).toArray()];
                    case 1:
                        lastMessage = _a.sent();
                        if (lastMessage && lastMessage.length && lastMessage[0].messageId)
                            return [2 /*return*/, [lastMessage[0].messageId]];
                        else
                            return [2 /*return*/, []];
                        return [3 /*break*/, 3];
                    case 2:
                        error_49 = _a.sent();
                        console.log(error_49);
                        console.log('Error in Get message by messageId');
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.UpdateTicketAgent = function (id, nsp, agent, ticketlog) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    if (agent) {
                        if (Object.keys(ticketlog).length) {
                            return [2 /*return*/, this.collection.findOneAndUpdate({ _id: id, nsp: nsp }, {
                                    $set: { assigned_to: agent, lasttouchedTime: new Date().toISOString() },
                                    $push: { ticketlog: ticketlog }
                                }, { returnOriginal: false, upsert: false })];
                        }
                    }
                }
                catch (error) {
                    console.log('In Else Update Ticket agent');
                    console.log(error);
                }
                return [2 /*return*/];
            });
        });
    };
    Tickets.UpdateTicketGroup = function (ids, nsp, group, ticketlog) {
        return __awaiter(this, void 0, void 0, function () {
            var objectIdArray, result, tickets, error_50;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        objectIdArray = ids.map(function (s) { return new mongodb_1.ObjectId(s); });
                        if (!Object.keys(ticketlog).length) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.collection.updateMany({ _id: { $in: objectIdArray }, nsp: nsp }, {
                                $rename: { 'group': "previousGroup" },
                            }, { upsert: false, })];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, this.collection.updateMany({ _id: { $in: objectIdArray }, nsp: nsp }, {
                                $set: { group: group },
                                $push: { ticketlog: ticketlog }
                            }, { upsert: false, })];
                    case 2:
                        result = _a.sent();
                        if (!(result && result.result.ok && result.modifiedCount == ids.length)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.collection.find({ _id: { $in: objectIdArray }, nsp: nsp }).limit(ids.length).toArray()];
                    case 3:
                        tickets = _a.sent();
                        if (nsp == '/hrm.sbtjapan.com' || nsp == '/sbtjapan.com') {
                            this.updateTicketSolr(tickets);
                        }
                        return [2 /*return*/, tickets];
                    case 4: return [2 /*return*/, []];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_50 = _a.sent();
                        console.log('In Else Update Ticket group');
                        console.log(error_50);
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.UpdateTicketPriority = function (tids, nsp, priority, ticketlog) {
        return __awaiter(this, void 0, void 0, function () {
            var temp_6, updated, error_51;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        temp_6 = tids.map(function (tid) { return new mongodb_1.ObjectId(tid); });
                        if (!Object.keys(ticketlog).length) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.collection.updateMany({ _id: { $in: temp_6 }, nsp: nsp }, {
                                $set: { priority: priority },
                                $push: { ticketlog: ticketlog }
                            }, { upsert: false })];
                    case 1:
                        updated = _a.sent();
                        if (updated && updated.result.ok && updated.modifiedCount == tids.length) {
                            return [2 /*return*/, this.collection.find({ _id: { $in: temp_6 }, nsp: nsp }).limit(tids.length).toArray()];
                        }
                        else {
                            return [2 /*return*/, []];
                        }
                        _a.label = 2;
                    case 2: return [3 /*break*/, 4];
                    case 3:
                        error_51 = _a.sent();
                        console.log('In Else Update Ticket priority');
                        console.log(error_51);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.UpdateBulkTicket = function (ids, nsp, ticketlog, state) {
        return __awaiter(this, void 0, void 0, function () {
            var objectIdArray, error_52;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 8, , 9]);
                        objectIdArray = ids.map(function (s) { return new mongodb_1.ObjectId(s); });
                        if (!state) return [3 /*break*/, 5];
                        if (!Object.keys(ticketlog).length) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.collection.update({ _id: { $in: objectIdArray } }, { $set: { state: state, lasttouchedTime: new Date().toISOString() }, $push: { ticketlog: ticketlog } }, { upsert: false, multi: true })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.collection.find({ _id: { $in: objectIdArray } }).toArray()];
                    case 2: return [4 /*yield*/, this.collection.update({ _id: { $in: objectIdArray } }, { $set: { state: state, lasttouchedTime: new Date().toISOString() } }, { upsert: false, multi: true })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, this.collection.find({ _id: { $in: objectIdArray } }).toArray()];
                    case 4: return [3 /*break*/, 7];
                    case 5: 
                    // console.log('In Else Bulk Update Ticket: ' + objectIdArray + ' nsp: ' + nsp);
                    return [4 /*yield*/, this.collection.update({ _id: { $in: objectIdArray } }, { $set: { lasttouchedTime: new Date().toISOString() }, $push: { ticketlog: ticketlog } }, { upsert: false, multi: true })];
                    case 6:
                        // console.log('In Else Bulk Update Ticket: ' + objectIdArray + ' nsp: ' + nsp);
                        _a.sent();
                        return [2 /*return*/, this.collection.find({ _id: { $in: objectIdArray } }).toArray()];
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        error_52 = _a.sent();
                        console.log('Error in Bulk Update Ticket');
                        console.log(error_52);
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.UpdateTicket = function (tids, nsp, ticketlog, state) {
        return __awaiter(this, void 0, void 0, function () {
            var temp_7, updated, updated, updated, error_53;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 8, , 9]);
                        temp_7 = tids.map(function (tid) { return new mongodb_1.ObjectId(tid); });
                        if (!state) return [3 /*break*/, 5];
                        if (!Object.keys(ticketlog).length) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.collection.updateMany({ _id: { $in: temp_7 }, nsp: nsp }, {
                                $set: { state: state },
                                $push: { ticketlog: ticketlog }
                            }, { upsert: false })];
                    case 1:
                        updated = _a.sent();
                        if (updated && updated.result.ok && updated.modifiedCount == tids.length) {
                            return [2 /*return*/, this.collection.find({ _id: { $in: temp_7 }, nsp: nsp }).limit(tids.length).toArray()];
                        }
                        else {
                            return [2 /*return*/, []];
                        }
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.collection.updateMany({ _id: { $in: temp_7 }, nsp: nsp }, {
                            $set: { state: state }
                        }, { upsert: false })];
                    case 3:
                        updated = _a.sent();
                        if (updated && updated.result.ok && updated.modifiedCount == tids.length) {
                            return [2 /*return*/, this.collection.find({ _id: { $in: temp_7 }, nsp: nsp }).limit(tids.length).toArray()];
                        }
                        else {
                            return [2 /*return*/, []];
                        }
                        _a.label = 4;
                    case 4: return [3 /*break*/, 7];
                    case 5: return [4 /*yield*/, this.collection.updateMany({ _id: { $in: temp_7 }, nsp: nsp }, {
                            $set: { lasttouchedTime: new Date().toISOString() }
                        }, { upsert: false })];
                    case 6:
                        updated = _a.sent();
                        if (updated && updated.result.ok && updated.modifiedCount == tids.length) {
                            return [2 /*return*/, this.collection.find({ _id: { $in: temp_7 }, nsp: nsp }).limit(tids.length).toArray()];
                        }
                        else {
                            return [2 /*return*/, []];
                        }
                        _a.label = 7;
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        error_53 = _a.sent();
                        console.log('Error in Update Ticket');
                        console.log(error_53);
                        return [2 /*return*/, []];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.UpdateTicketObj = function (ticket) {
        return __awaiter(this, void 0, void 0, function () {
            var err_14;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.findOneAndReplace({ _id: new mongodb_1.ObjectID(ticket._id) }, (ticket), { upsert: false, returnOriginal: false })];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        err_14 = _a.sent();
                        console.log('Error in updating ticket Object');
                        console.log(err_14);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.UpdateTicketTouchedTime = function (tids, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var temp_8, updated, error_54;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (!Array.isArray(tids))
                            tids = [tids];
                        temp_8 = tids.map(function (tid) { return new mongodb_1.ObjectId(tid); });
                        return [4 /*yield*/, this.collection.updateMany({ _id: { $in: temp_8 }, nsp: nsp }, {
                                $set: { lasttouchedTime: new Date().toISOString() }
                            }, { upsert: false })];
                    case 1:
                        updated = _a.sent();
                        if (updated && updated.result.ok && updated.modifiedCount == tids.length) {
                            return [2 /*return*/, this.collection.find({ _id: { $in: temp_8 }, nsp: nsp }).limit(tids.length).toArray()];
                        }
                        else {
                            [];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_54 = _a.sent();
                        console.log('Error in Update Ticket');
                        console.log(error_54);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.UpdateTicketFromSNS = function (id, nsp, lasttouchedTime, ticketlog, state) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    if (state) {
                        if (Object.keys(ticketlog).length) {
                            return [2 /*return*/, this.collection.findOneAndUpdate({ _id: id, nsp: nsp }, {
                                    $set: { state: state, lasttouchedTime: lasttouchedTime },
                                    $push: { ticketlog: ticketlog }
                                }, { returnOriginal: false, upsert: false })];
                        }
                        else {
                            return [2 /*return*/, this.collection.findOneAndUpdate({ _id: id, nsp: nsp }, [
                                    { $set: { state: state, lasttouchedTime: lasttouchedTime } }
                                ], { returnOriginal: false, upsert: false })];
                        }
                    }
                    else {
                        // console.log('In Else Update Ticket');
                        return [2 /*return*/, this.collection.findOneAndUpdate({ _id: id, nsp: nsp }, { $set: { lasttouchedTime: lasttouchedTime } }, { returnOriginal: false, upsert: false })];
                    }
                }
                catch (error) {
                    console.log('Error in Update Ticket');
                    console.log(error);
                }
                return [2 /*return*/];
            });
        });
    };
    Tickets.TicketSolved = function (tids, solved_date, solved_by) {
        return __awaiter(this, void 0, void 0, function () {
            var temp_9, err_15;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        temp_9 = tids.map(function (tid) { return new mongodb_1.ObjectId(tid); });
                        return [4 /*yield*/, this.collection.update({ _id: { $in: temp_9 } }, { $set: { solved_date: solved_date, solved_by: solved_by } }, { multi: true })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.collection.find({ _id: { $in: temp_9 } }).project({ solved_date: 1, assigned_to: 1, }).toArray()];
                    case 2: 
                    //for sla policy, need to send email if resolved is violated.
                    return [2 /*return*/, _a.sent()];
                    case 3:
                        err_15 = _a.sent();
                        console.log('Error in TicketSolved');
                        console.log(err_15);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.TicketBulkedSolved = function (tid, solved_date, solved_by) {
        return __awaiter(this, void 0, void 0, function () {
            var err_16;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.update({ _id: tid }, { $set: { solved_date: solved_date, solved_by: solved_by } })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_16 = _a.sent();
                        console.log('Error in Bulk TicketSolved');
                        console.log(err_16);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.addTask = function (tids, nsp, properties, ticketlog) {
        return __awaiter(this, void 0, void 0, function () {
            var temp_10, result, error_55;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        temp_10 = tids.map(function (tid) { return new mongodb_1.ObjectId(tid); });
                        return [4 /*yield*/, this.collection.updateMany({ _id: { $in: temp_10 }, nsp: nsp }, {
                                $push: { ticketlog: ticketlog, todo: properties }
                            }, { upsert: false })];
                    case 1:
                        result = _a.sent();
                        if (!(result && result.result.ok && result.modifiedCount == tids.length)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.collection.find({ _id: { $in: temp_10 }, nsp: nsp }).limit(tids.length).toArray()];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3: return [2 /*return*/, []];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_55 = _a.sent();
                        console.log('Error in Adding task');
                        console.log(error_55);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.UpdateDynamicProperty = function (threadid, name, value, ticketlog) {
        return __awaiter(this, void 0, void 0, function () {
            var error_56;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ _id: new mongodb_1.ObjectId(threadid) }, {
                                $set: (_a = {}, _a["dynamicFields." + name] = value, _a),
                                $push: { ticketlog: ticketlog }
                            }, { upsert: false, returnOriginal: false })];
                    case 1: return [2 /*return*/, _b.sent()];
                    case 2:
                        error_56 = _b.sent();
                        console.log('Error in deleting dynamic prop');
                        console.log(error_56);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.deleteNote = function (threadid, noteId, ticketlog) {
        return __awaiter(this, void 0, void 0, function () {
            var error_57;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ _id: new mongodb_1.ObjectId(threadid) }, {
                                $set: { lasttouchedTime: new Date().toString() },
                                $pull: { ticketNotes: { id: new mongodb_1.ObjectID(noteId) } },
                                $push: { ticketlog: ticketlog }
                            }, { upsert: false, returnOriginal: false })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_57 = _a.sent();
                        console.log('Error in deleting note');
                        console.log(error_57);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.deleteTask = function (threadid, taskid, ticketlog) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    return [2 /*return*/, this.collection.findOneAndUpdate({ _id: new mongodb_1.ObjectId(threadid) }, {
                            $pull: { todo: { id: new mongodb_1.ObjectId(taskid) } },
                            $push: { ticketlog: ticketlog }
                        }, { upsert: false, returnOriginal: false })];
                }
                catch (error) {
                    console.log('Error in deleting tasks');
                    console.log(error);
                }
                return [2 /*return*/];
            });
        });
    };
    Tickets.addTag = function (tids, nsp, tag, ticketlog) {
        return __awaiter(this, void 0, void 0, function () {
            var temp_11, result, error_58;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        temp_11 = tids.map(function (tid) { return new mongodb_1.ObjectId(tid); });
                        return [4 /*yield*/, this.collection.updateMany({ _id: { $in: temp_11 }, nsp: nsp }, {
                                $push: { ticketlog: ticketlog, tags: { $each: tag } }
                            }, { upsert: false })];
                    case 1:
                        result = _a.sent();
                        if (!(result && result.result.ok && result.modifiedCount == tids.length)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.collection.find({ _id: { $in: temp_11 }, nsp: nsp }).limit(tids.length).toArray()];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3: return [2 /*return*/, []];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_58 = _a.sent();
                        console.log('Error in Adding tag');
                        console.log(error_58);
                        return [2 /*return*/, []];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.deleteTag = function (threadid, nsp, tag, ticketlog) {
        return __awaiter(this, void 0, void 0, function () {
            var error_59;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ _id: new mongodb_1.ObjectId(threadid), nsp: nsp }, {
                                $pull: { tags: tag },
                                $push: { ticketlog: ticketlog }
                            }, { upsert: false, returnOriginal: false })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_59 = _a.sent();
                        console.log('Error in deleting tag');
                        console.log(error_59);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.AssignAgent = function (tids, nsp, agent_email, ticketlog) {
        return __awaiter(this, void 0, void 0, function () {
            var temp_12, assigned_time, reassignmentListObj, ticketlogarr, result, tickets, error_60;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        temp_12 = tids.map(function (id) { return new mongodb_1.ObjectId(id); });
                        assigned_time = new Date().toISOString();
                        reassignmentListObj = {
                            assigned_to: agent_email,
                            assigned_time: assigned_time,
                            read_date: ''
                        };
                        return [4 /*yield*/, this.collection.updateMany({ _id: { $in: temp_12 }, nsp: nsp }, {
                                $rename: { 'assigned_to': "previousAgent" },
                            }, { upsert: false, })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.collection.updateMany({ _id: { $in: temp_12 }, nsp: nsp, first_assigned_time: { $exists: false } }, { $set: { first_assigned_time: assigned_time } }, { upsert: false })];
                    case 2:
                        _a.sent();
                        ticketlogarr = [];
                        ticketlogarr.push(ticketlog);
                        return [4 /*yield*/, this.collection.updateMany({ _id: { $in: temp_12 }, nsp: nsp }, {
                                $set: { assigned_to: agent_email, viewState: 'UNREAD' },
                                $push: { ticketlog: { $each: ticketlogarr }, assignmentList: reassignmentListObj }
                            }, { upsert: false })];
                    case 3:
                        result = _a.sent();
                        if (!(result && result.result.ok && result.modifiedCount == tids.length)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.collection.find({ _id: { $in: temp_12 }, nsp: nsp }).limit(tids.length).toArray()];
                    case 4:
                        tickets = _a.sent();
                        if (nsp == '/hrm.sbtjapan.com' || nsp == '/sbtjapan.com') {
                            this.updateTicketSolr(tickets);
                        }
                        return [2 /*return*/, tickets];
                    case 5: return [2 /*return*/, []];
                    case 6:
                        ;
                        return [3 /*break*/, 8];
                    case 7:
                        error_60 = _a.sent();
                        console.log('Error in Assigning agent');
                        console.log(error_60);
                        return [2 /*return*/, []];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.getTicketsData = function (ids) {
        return __awaiter(this, void 0, void 0, function () {
            var objectIdArray, error_61;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (!Array.isArray(ids))
                            ids = [ids];
                        objectIdArray = ids.map(function (s) { return new mongodb_1.ObjectId(s); });
                        return [4 /*yield*/, this.collection.find({ _id: { $in: objectIdArray } }).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_61 = _a.sent();
                        console.log('Error in getting data of specified ids');
                        console.log(error_61);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.getTags = function (id, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var error_62;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.find({ _id: new mongodb_1.ObjectID(id), nsp: nsp }).project({ tags: 1 }).limit(1).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_62 = _a.sent();
                        console.log('Error in getting data of tag by ids');
                        console.log(error_62);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.getMergeTickets = function (nsp, email, canView, merge) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (canView) {
                    case 'all':
                        return [2 /*return*/, this.collection.find({ nsp: nsp, merged: merge }).sort({ lasttouchedTime: -1 }).limit(100).toArray()];
                    case 'assignedOnly':
                        return [2 /*return*/, this.collection.find({ nsp: nsp, merged: merge, assigned_to: email }).sort({ lasttouchedTime: -1 }).limit(100).toArray()];
                    default:
                        return [2 /*return*/, this.collection.find({ nsp: nsp, merged: merge }).sort({ lasttouchedTime: -1 }).limit(100).toArray()];
                }
                return [2 /*return*/];
            });
        });
    };
    Tickets.getTicketsForLazyLoading = function (nsp, email, canView, filters, clause, query, chunk, sortBy, assignType, groupAssignType, mergeType, solrSearchEnabled) {
        if (solrSearchEnabled === void 0) { solrSearchEnabled = false; }
        return __awaiter(this, void 0, void 0, function () {
            var filtersObject_2, obj, $or, _id, encodedEmail, encodedNsp, solrQuery, _a, groups, groupQuery_1, teamMembers, assignToQuery_1, tickets, objectIdArray, ticketIDs, objectIdArray, _b, groups, teamMembers, sort, error_63;
            var _c, _d, _e, _f, _g, _h, _j, _k;
            return __generator(this, function (_l) {
                switch (_l.label) {
                    case 0:
                        _l.trys.push([0, 22, , 23]);
                        if (!chunk)
                            return [2 /*return*/, undefined];
                        if (!clause)
                            clause = "$and";
                        filtersObject_2 = (_c = {}, _c[clause] = [], _c);
                        obj = { 'nsp': nsp, '$and': [] };
                        $or = [];
                        _id = undefined;
                        if (filters) {
                            Object.keys(filters).map(function (key) {
                                var _a, _b;
                                if (key == 'daterange') {
                                    filters[key].to = new Date(new Date(filters[key].to).getTime() + (60 * 60 * 24 * 1000) - 1);
                                    filtersObject_2[clause].push({ 'datetime': { $gte: new Date(filters[key].from).toISOString(), $lt: new Date(filters[key].to).toISOString() } });
                                    // console.log('Date From', filters[key].from);
                                    // console.log('Date To ', filters[key].to)
                                    // if (new Date(filters[key].from).toISOString() == new Date(filters[key].to).toISOString()) {
                                    //     filtersObject[clause].push({ 'datetime': { $gte: new Date(filters[key].from).toISOString(), $lt: new Date(filters[key].to).toISOString() } })
                                    // }
                                    // filtersObject[clause].push({ 'datetime': { $lte: new Date(filters[key].to).toISOString() } })
                                    return;
                                }
                                if (Array.isArray(filters[key])) {
                                    var arrayIn_1 = [];
                                    filters[key].forEach(function (field) {
                                        if (typeof field == 'object') {
                                            arrayIn_1.push(field.value);
                                        }
                                        else {
                                            arrayIn_1.push(field);
                                        }
                                    });
                                    filtersObject_2[clause].push((_a = {}, _a[key] = { '$in': arrayIn_1 }, _a));
                                    // filtersObject[clause].push({ [key]: { '$in': filters[key] } });
                                }
                                else
                                    filtersObject_2[clause].push((_b = {}, _b[key] = new RegExp(filters[key], 'gmi'), _b));
                            });
                        }
                        if (mongodb_1.ObjectID.isValid(query))
                            _id = { _id: new mongodb_1.ObjectID(query) };
                        if (chunk) {
                            if (sortBy && sortBy.name) {
                                if (parseInt(sortBy.type) == 1) {
                                    //ASC
                                    Object.assign(obj, (_d = {}, _d[sortBy.name] = { "$gt": chunk }, _d));
                                }
                                else {
                                    //DESC
                                    Object.assign(obj, (_e = {}, _e[sortBy.name] = { "$lt": chunk }, _e));
                                }
                            }
                            else {
                                Object.assign(obj, { 'lasttouchedTime': { "$lt": chunk } });
                            }
                        }
                        if (filtersObject_2[clause].length)
                            Object.assign(obj, filtersObject_2);
                        encodedEmail = encodeURI(email);
                        encodedNsp = encodeURI(nsp);
                        solrQuery = 'select?fl=tid&df=Message&fq=nsp%3A%22' + encodedNsp + '%22&q=Subject%3A' + query + '%20OR%20Message%3A' + query + '%20OR%20tid%3A' + query + '%20OR%20clientID%3A' + query + '&sort=dateTime%20desc%2C%20id%20asc&wt=json&group=true&group.field=tid&group.limit=1';
                        _a = canView;
                        switch (_a) {
                            case 'all': return [3 /*break*/, 1];
                            case 'assignedOnly': return [3 /*break*/, 2];
                            case 'group': return [3 /*break*/, 3];
                            case 'team': return [3 /*break*/, 5];
                        }
                        return [3 /*break*/, 7];
                    case 1:
                        //Do Nothing
                        obj.$and.push({ "_id": { $exists: true } });
                        return [3 /*break*/, 8];
                    case 2:
                        // Object.assign(obj, { $or : [ {"assigned_to": email },{ "watchers" : {$in: [email]}}]});
                        obj.$and.push({ $or: [{ "assigned_to": email }, { "watchers": { $in: [email] } }] });
                        solrQuery = 'select?df=Message&fl=tid&fq=assigned_to%3A%22' + encodedEmail + '%22%20OR%20watchers%3A%22' + encodedEmail + '%22&fq=nsp%3A%22' + encodedNsp + '%22&group.field=tid&group.limit=1&group=true&q=Message%3A' + query + '%20OR%20Subject%3A' + query + '%20OR%20tid%3A' + query + '%20OR%20clientID%3A' + query + '&sort=dateTime%20desc%2C%20id%20asc&wt=json';
                        return [3 /*break*/, 8];
                    case 3: return [4 /*yield*/, TicketgroupModel_1.TicketGroupsModel.getGroupsbyAdmin(nsp, email)];
                    case 4:
                        groups = _l.sent();
                        obj.$and.push({
                            '$or': [
                                { group: { '$in': groups } },
                                { assigned_to: email },
                                { "watchers": { $in: [email] } }
                            ]
                        });
                        groupQuery_1 = '';
                        groups.forEach(function (group) {
                            groupQuery_1 += 'group%3A%22' + encodeURI(group) + '%22%20OR%20';
                        });
                        solrQuery = 'select?df=Message&fl=tid&fq=' + groupQuery_1 + 'assigned_to%3A%22' + encodedEmail + '%22%20OR%20watchers%3A%22' + encodedEmail + '%22&fq=nsp%3A%22' + encodedNsp + '%22&group.field=tid&group.limit=1&group=true&q=Message%3A' + query + '%20OR%20Subject%3A' + query + '%20OR%20tid%3A' + query + '%20OR%20clientID%3A' + query + '&sort=dateTime%20desc%2C%20id%20asc&wt=json';
                        return [3 /*break*/, 8];
                    case 5: return [4 /*yield*/, teamsModel_1.TeamsModel.getTeamMembersAgainstAgent(nsp, email)];
                    case 6:
                        teamMembers = _l.sent();
                        // console.log(teamMembers);
                        // Object.assign(obj, { $or : [ {"assigned_to": {$in: teamMembers} },{ "watchers" : {$in: [email]}}]});
                        obj.$and.push({ $or: [{ "assigned_to": { $in: teamMembers } }, { "watchers": { $in: [email] } }] });
                        assignToQuery_1 = '';
                        teamMembers.forEach(function (agent) {
                            assignToQuery_1 += 'assigned_to%3A%22' + encodeURI(agent) + '%22%20OR%20';
                        });
                        solrQuery = 'select?df=Message&fl=tid&fq=' + assignToQuery_1 + 'watchers%3A%22' + encodedEmail + '%22&fq=nsp%3A%22' + encodedNsp + '%22&group.field=tid&group.limit=1&group=true&q=Message%3A' + query + '%20OR%20Subject%3A' + query + '%20OR%20tid%3A' + query + '%20OR%20clientID%3A' + query + '&sort=dateTime%20desc%2C%20id%20asc&wt=json';
                        return [3 /*break*/, 8];
                    case 7: return [3 /*break*/, 8];
                    case 8:
                        if (!query) return [3 /*break*/, 12];
                        if (!solrSearchEnabled) {
                            $or = [
                                { subject: new RegExp(query, 'gmi') },
                                { from: new RegExp(query) },
                                (_f = {}, _f['visitor.name'] = new RegExp(query, 'gmi'), _f),
                                (_g = {}, _g['visitor.email'] = new RegExp(query, 'gmi'), _g),
                                { clientID: new RegExp(query, 'gmi') }
                            ];
                        }
                        else {
                            $or = [
                                { from: new RegExp(query) },
                                (_h = {}, _h['visitor.name'] = new RegExp(query, 'gmi'), _h),
                                (_j = {}, _j['visitor.email'] = new RegExp(query, 'gmi'), _j),
                                { clientID: new RegExp(query, 'gmi') }
                            ];
                        }
                        if (!!solrSearchEnabled) return [3 /*break*/, 10];
                        return [4 /*yield*/, this.db.collection('ticketMessages').aggregate([
                                {
                                    '$match': {
                                        nsp: nsp,
                                        $and: [
                                            {
                                                $text: {
                                                    $search: query
                                                }
                                            },
                                            {
                                                message: new RegExp(query)
                                            }
                                        ]
                                    }
                                }, {
                                    '$group': {
                                        '_id': '$nsp',
                                        'tids': {
                                            '$addToSet': {
                                                '$arrayElemAt': [
                                                    '$tid', 0
                                                ]
                                            }
                                        }
                                    }
                                }
                            ]).limit(1).toArray()];
                    case 9:
                        tickets = _l.sent();
                        if (tickets && tickets.length && tickets[0].tids.length) {
                            objectIdArray = tickets[0].tids.map(function (s) { return new mongodb_1.ObjectId(s); });
                            $or.push({ _id: { $in: objectIdArray } });
                            // console.log($or[4]);
                        }
                        return [3 /*break*/, 12];
                    case 10:
                        ticketIDs = [];
                        return [4 /*yield*/, this.getTicketIDsFromSolr(solrQuery, 50)];
                    case 11:
                        ticketIDs = _l.sent();
                        // console.log(ticketIDs);
                        if (ticketIDs.length) {
                            objectIdArray = ticketIDs.map(function (s) { return new mongodb_1.ObjectId(s); });
                            $or.push({ _id: { $in: objectIdArray } });
                        }
                        _l.label = 12;
                    case 12:
                        if (_id)
                            $or.push(_id);
                        _b = canView;
                        switch (_b) {
                            case 'all': return [3 /*break*/, 13];
                            case 'assignedOnly': return [3 /*break*/, 14];
                            case 'group': return [3 /*break*/, 15];
                            case 'team': return [3 /*break*/, 17];
                        }
                        return [3 /*break*/, 19];
                    case 13:
                        //Do Nothing
                        obj.$and.push({ "_id": { $exists: true } });
                        return [3 /*break*/, 20];
                    case 14:
                        // Object.assign(obj, { $or : [ {"assigned_to": email },{ "watchers" : {$in: [email]}}]});
                        obj.$and.push({ $or: [{ "assigned_to": email }, { "watchers": { $in: [email] } }] });
                        return [3 /*break*/, 20];
                    case 15: return [4 /*yield*/, TicketgroupModel_1.TicketGroupsModel.getGroupsbyAdmin(nsp, email)];
                    case 16:
                        groups = _l.sent();
                        obj.$and.push({
                            '$or': [
                                { group: { '$in': groups } },
                                { assigned_to: email },
                                { "watchers": { $in: [email] } }
                            ]
                        });
                        return [3 /*break*/, 20];
                    case 17: return [4 /*yield*/, teamsModel_1.TeamsModel.getTeamMembersAgainstAgent(nsp, email)];
                    case 18:
                        teamMembers = _l.sent();
                        // console.log(teamMembers);
                        obj.$and.push({ $or: [{ "assigned_to": { $in: teamMembers } }, { "watchers": { $in: [email] } }] });
                        return [3 /*break*/, 20];
                    case 19: return [3 /*break*/, 20];
                    case 20:
                        switch (assignType) {
                            case 'assigned':
                                if (!obj.$and) {
                                    Object.assign(obj, {
                                        $and: [
                                            {
                                                assigned_to: {
                                                    $exists: true
                                                }
                                            },
                                            {
                                                assigned_to: {
                                                    $ne: ''
                                                }
                                            }
                                        ]
                                    });
                                }
                                else {
                                    obj.$and.push({
                                        assigned_to: {
                                            $exists: true
                                        }
                                    });
                                    obj.$and.push({
                                        assigned_to: {
                                            $ne: ''
                                        }
                                    });
                                }
                                break;
                            case 'unassigned':
                                if (!obj.$or) {
                                    Object.assign(obj, {
                                        $or: [
                                            {
                                                assigned_to: {
                                                    $exists: false
                                                }
                                            },
                                            {
                                                assigned_to: ''
                                            }
                                        ]
                                    });
                                }
                                else {
                                    obj.$or.push({
                                        assigned_to: {
                                            $exists: false
                                        }
                                    });
                                    obj.$or.push({
                                        assigned_to: ''
                                    });
                                }
                                break;
                            default:
                                break;
                        }
                        switch (groupAssignType) {
                            case 'assigned':
                                if (!obj.$and) {
                                    Object.assign(obj, {
                                        $and: [
                                            {
                                                group: {
                                                    $exists: true
                                                }
                                            },
                                            {
                                                group: {
                                                    $ne: ''
                                                }
                                            }
                                        ]
                                    });
                                }
                                else {
                                    obj.$and.push({
                                        group: {
                                            $exists: true
                                        }
                                    });
                                    obj.$and.push({
                                        group: {
                                            $ne: ''
                                        }
                                    });
                                }
                                break;
                            case 'unassigned':
                                if (!obj.$or) {
                                    Object.assign(obj, {
                                        $or: [
                                            {
                                                group: {
                                                    $exists: false
                                                }
                                            },
                                            {
                                                group: ''
                                            }
                                        ]
                                    });
                                }
                                else {
                                    obj.$or.push({
                                        group: {
                                            $exists: false
                                        }
                                    });
                                    obj.$or.push({
                                        group: ''
                                    });
                                }
                                break;
                            default:
                                break;
                        }
                        switch (mergeType) {
                            case 'yes':
                                Object.assign(obj, {
                                    merged: true
                                });
                                break;
                            case 'no':
                                Object.assign(obj, {
                                    $or: [
                                        {
                                            merged: {
                                                $exists: false
                                            }
                                        },
                                        {
                                            merged: false
                                        }
                                    ]
                                });
                                break;
                            default:
                                break;
                        }
                        // console.log('Getting More', obj);
                        // if (query) Object.assign(obj, { '$or': $or });
                        if (query)
                            obj.$and.push({ '$or': $or });
                        sort = void 0;
                        if (sortBy && sortBy.name) {
                            sort = (_k = {},
                                _k[sortBy.name] = parseInt(sortBy.type),
                                _k);
                        }
                        return [4 /*yield*/, this.db.collection('tickets').aggregate([
                                { "$match": obj },
                                { "$sort": (sort) ? sort : { 'lasttouchedTime': -1 } },
                                { "$limit": 50 }
                            ]).toArray()];
                    case 21: return [2 /*return*/, _l.sent()];
                    case 22:
                        error_63 = _l.sent();
                        console.log(error_63);
                        console.log('error in Get Messages');
                        return [3 /*break*/, 23];
                    case 23: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.getUnassignedTickets = function (nsp) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    return [2 /*return*/, this.collection.find({ nsp: nsp, $and: [{ $or: [{ assigned_to: { $exists: false } }, { assigned_to: { $eq: '' } }] }, { $or: [{ processing: false }, { processing: { $exists: false } }] }], state: 'OPEN' }, { fields: { _id: 1 } }).toArray()];
                }
                catch (err) {
                    console.log(err);
                    console.log('Error in getting unassigned tickets');
                }
                return [2 /*return*/];
            });
        });
    };
    Tickets.getTickets = function (nsp, email, canView, filters, clause, query, sortBy, assignType, groupAssignType, mergeType, limit, solrSearchEnabled) {
        if (limit === void 0) { limit = undefined; }
        if (solrSearchEnabled === void 0) { solrSearchEnabled = false; }
        return __awaiter(this, void 0, void 0, function () {
            var filtersObject_3, obj, $or, _id, encodedEmail, encodedNsp, solrQuery, _a, groups, groupQuery_2, teamMembers, assignToQuery_2, tickets, objectIdArray, ticketIDs, objectIdArray, sort, error_64;
            var _b, _c, _d, _e, _f, _g;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0:
                        _h.trys.push([0, 14, , 15]);
                        if (!clause)
                            clause = "$and";
                        filtersObject_3 = (_b = {}, _b[clause] = [], _b);
                        obj = {
                            'nsp': nsp,
                            '$and': []
                        };
                        $or = [];
                        _id = undefined;
                        // let ticketCount = 0;
                        if (filters) {
                            Object.keys(filters).map(function (key) {
                                var _a, _b;
                                if (key == 'daterange') {
                                    filters[key].to = new Date(new Date(filters[key].to).getTime() + (60 * 60 * 24 * 1000) - 1);
                                    filtersObject_3[clause].push({ 'datetime': { $gte: new Date(filters[key].from).toISOString(), $lt: new Date(filters[key].to).toISOString() } });
                                    // console.log('Date From', new Date(filters[key].from).toISOString());
                                    // console.log('Date To ', new Date(filters[key].to).toISOString());
                                    // if (new Date(filters[key].from).toISOString() == new Date(filters[key].to).toISOString()) {
                                    //     filtersObject[clause].push({ 'datetime': { $gte: new Date(filters[key].from).toISOString(), $lt: new Date(filters[key].to).toISOString() } })
                                    // }
                                    // filtersObject[clause].push({ 'datetime': { $lte: new Date(filters[key].to).toISOString() } })
                                    return;
                                }
                                if (Array.isArray(filters[key])) {
                                    var arrayIn_2 = [];
                                    filters[key].forEach(function (field) {
                                        if (typeof field == 'object') {
                                            arrayIn_2.push(field.value);
                                        }
                                        else {
                                            arrayIn_2.push(field);
                                        }
                                    });
                                    filtersObject_3[clause].push((_a = {}, _a[key] = { '$in': arrayIn_2 }, _a));
                                }
                                else
                                    filtersObject_3[clause].push((_b = {}, _b[key] = new RegExp(filters[key], 'gmi'), _b));
                            });
                        }
                        if (mongodb_1.ObjectID.isValid(query))
                            _id = { _id: new mongodb_1.ObjectID(query) };
                        if (filtersObject_3[clause].length)
                            Object.assign(obj, filtersObject_3);
                        encodedEmail = encodeURI(email);
                        encodedNsp = encodeURI(nsp);
                        solrQuery = 'select?fl=tid&df=Message&fq=nsp%3A%22' + encodedNsp + '%22&q=Subject%3A' + query + '%20OR%20Message%3A' + query + '%20OR%20tid%3A' + query + '%20OR%20clientID%3A' + query + '&sort=dateTime%20desc%2C%20id%20asc&wt=json&group=true&group.field=tid&group.limit=1';
                        _a = canView;
                        switch (_a) {
                            case 'all': return [3 /*break*/, 1];
                            case 'assignedOnly': return [3 /*break*/, 2];
                            case 'group': return [3 /*break*/, 3];
                            case 'team': return [3 /*break*/, 5];
                        }
                        return [3 /*break*/, 7];
                    case 1:
                        //Do Nothing
                        obj.$and.push({ "_id": { $exists: true } });
                        return [3 /*break*/, 8];
                    case 2:
                        // Object.assign(obj, { $or : [ {"assigned_to": email },{ "watchers" : {$in: [email]}}]});
                        obj.$and.push({ $or: [{ "assigned_to": email }, { "watchers": { $in: [email] } }] });
                        solrQuery = 'select?df=Message&fl=tid&fq=assigned_to%3A%22' + encodedEmail + '%22%20OR%20watchers%3A%22' + encodedEmail + '%22&fq=nsp%3A%22' + encodedNsp + '%22&group.field=tid&group.limit=1&group=true&q=Message%3A' + query + '%20OR%20Subject%3A' + query + '%20OR%20tid%3A' + query + '%20OR%20clientID%3A' + query + '&sort=dateTime%20desc%2C%20id%20asc&wt=json';
                        return [3 /*break*/, 8];
                    case 3: return [4 /*yield*/, TicketgroupModel_1.TicketGroupsModel.getGroupsbyAdmin(nsp, email)];
                    case 4:
                        groups = _h.sent();
                        obj.$and.push({
                            '$or': [
                                { group: { '$in': groups } },
                                { assigned_to: email },
                                { "watchers": { $in: [email] } }
                            ]
                        });
                        groupQuery_2 = '';
                        groups.forEach(function (group) {
                            groupQuery_2 += 'group%3A%22' + group + '%22%20OR%20';
                        });
                        solrQuery = 'select?df=Message&fl=tid&fq=' + groupQuery_2 + 'assigned_to%3A%22' + encodedEmail + '%22%20OR%20watchers%3A%22' + encodedEmail + '%22&fq=nsp%3A%22' + encodedNsp + '%22&group.field=tid&group.limit=1&group=true&q=Message%3A' + query + '%20OR%20Subject%3A' + query + '%20OR%20tid%3A' + query + '%20OR%20clientID%3A' + query + '&sort=dateTime%20desc%2C%20id%20asc&wt=json';
                        return [3 /*break*/, 8];
                    case 5: return [4 /*yield*/, teamsModel_1.TeamsModel.getTeamMembersAgainstAgent(nsp, email)];
                    case 6:
                        teamMembers = _h.sent();
                        // console.log(teamMembers);
                        // Object.assign(obj, { $or : [ {"assigned_to": {$in: teamMembers} },{ "watchers" : {$in: [email]}}]});
                        obj.$and.push({ $or: [{ "assigned_to": { $in: teamMembers } }, { "watchers": { $in: [email] } }] });
                        assignToQuery_2 = '';
                        teamMembers.forEach(function (agent) {
                            assignToQuery_2 += 'assigned_to%3A%22' + encodeURI(agent) + '%22%20OR%20';
                        });
                        solrQuery = 'select?df=Message&fl=tid&fq=' + assignToQuery_2 + 'watchers%3A%22' + encodedEmail + '%22&fq=nsp%3A%22' + encodedNsp + '%22&group.field=tid&group.limit=1&group=true&q=Message%3A' + query + '%20OR%20Subject%3A' + query + '%20OR%20tid%3A' + query + '%20OR%20clientID%3A' + query + '&sort=dateTime%20desc%2C%20id%20asc&wt=json';
                        return [3 /*break*/, 8];
                    case 7: return [3 /*break*/, 8];
                    case 8:
                        if (!query) return [3 /*break*/, 12];
                        query = query.replace("\\", '');
                        if (!solrSearchEnabled) {
                            $or = [
                                { subject: new RegExp(query, 'gmi') },
                                { from: new RegExp(query) },
                                (_c = {}, _c['visitor.name'] = new RegExp(query, 'gmi'), _c),
                                (_d = {}, _d['visitor.email'] = new RegExp(query, 'gmi'), _d),
                                { clientID: new RegExp(query, 'gmi') }
                            ];
                        }
                        else {
                            $or = [
                                { from: new RegExp(query) },
                                (_e = {}, _e['visitor.name'] = new RegExp(query, 'gmi'), _e),
                                (_f = {}, _f['visitor.email'] = new RegExp(query, 'gmi'), _f),
                                { clientID: new RegExp(query, 'gmi') }
                            ];
                        }
                        if (!!solrSearchEnabled) return [3 /*break*/, 10];
                        return [4 /*yield*/, this.db.collection('ticketMessages').aggregate([
                                {
                                    '$match': {
                                        nsp: nsp,
                                        $and: [
                                            {
                                                $text: {
                                                    $search: query
                                                }
                                            },
                                            {
                                                message: new RegExp(query)
                                            }
                                        ]
                                    }
                                }, {
                                    '$group': {
                                        '_id': '$nsp',
                                        'tids': {
                                            '$addToSet': {
                                                '$arrayElemAt': [
                                                    '$tid', 0
                                                ]
                                            }
                                        }
                                    }
                                }
                            ]).limit(1).toArray()];
                    case 9:
                        tickets = _h.sent();
                        if (tickets && tickets.length && tickets[0].tids.length) {
                            objectIdArray = tickets[0].tids.map(function (s) { return new mongodb_1.ObjectId(s); });
                            $or.push({ _id: { $in: objectIdArray } });
                            // console.log($or[4]);
                        }
                        return [3 /*break*/, 12];
                    case 10:
                        ticketIDs = [];
                        return [4 /*yield*/, this.getTicketIDsFromSolr(solrQuery, limit)];
                    case 11:
                        ticketIDs = _h.sent();
                        // console.log(ticketIDs);
                        if (ticketIDs.length) {
                            objectIdArray = ticketIDs.map(function (s) { return new mongodb_1.ObjectId(s); });
                            $or.push({ _id: { $in: objectIdArray } });
                        }
                        _h.label = 12;
                    case 12:
                        // }
                        if (_id)
                            $or.push(_id);
                        switch (assignType) {
                            case 'assigned':
                                if (!obj.$and) {
                                    Object.assign(obj, {
                                        $and: [
                                            {
                                                assigned_to: {
                                                    $exists: true
                                                }
                                            },
                                            {
                                                assigned_to: {
                                                    $ne: ''
                                                }
                                            }
                                        ]
                                    });
                                }
                                else {
                                    obj.$and.push({
                                        assigned_to: {
                                            $exists: true
                                        }
                                    });
                                    obj.$and.push({
                                        assigned_to: {
                                            $ne: ''
                                        }
                                    });
                                }
                                break;
                            case 'unassigned':
                                if (!obj.$or) {
                                    Object.assign(obj, {
                                        $or: [
                                            {
                                                assigned_to: {
                                                    $exists: false
                                                }
                                            },
                                            {
                                                assigned_to: ''
                                            }
                                        ]
                                    });
                                }
                                else {
                                    obj.$or.push({
                                        assigned_to: {
                                            $exists: false
                                        }
                                    });
                                    obj.$or.push({
                                        assigned_to: ''
                                    });
                                }
                                break;
                            default:
                                break;
                        }
                        switch (groupAssignType) {
                            case 'assigned':
                                if (!obj.$and) {
                                    Object.assign(obj, {
                                        $and: [
                                            {
                                                group: {
                                                    $exists: true
                                                }
                                            },
                                            {
                                                group: {
                                                    $ne: ''
                                                }
                                            }
                                        ]
                                    });
                                }
                                else {
                                    obj.$and.push({
                                        group: {
                                            $exists: true
                                        }
                                    });
                                    obj.$and.push({
                                        group: {
                                            $ne: ''
                                        }
                                    });
                                }
                                break;
                            case 'unassigned':
                                if (!obj.$or) {
                                    Object.assign(obj, {
                                        $or: [
                                            {
                                                group: {
                                                    $exists: false
                                                }
                                            },
                                            {
                                                group: ''
                                            }
                                        ]
                                    });
                                }
                                else {
                                    obj.$or.push({
                                        group: {
                                            $exists: false
                                        }
                                    });
                                    obj.$or.push({
                                        group: ''
                                    });
                                }
                                break;
                            default:
                                break;
                        }
                        switch (mergeType) {
                            case 'yes':
                                Object.assign(obj, {
                                    merged: true
                                });
                                break;
                            case 'no':
                                Object.assign(obj, {
                                    $or: [
                                        {
                                            merged: {
                                                $exists: false
                                            }
                                        },
                                        {
                                            merged: false
                                        }
                                    ]
                                });
                                break;
                            default:
                                break;
                        }
                        // if (query) Object.assign(obj, { '$or': $or })
                        if (query)
                            obj.$and.push({ '$or': $or });
                        sort = void 0;
                        if (sortBy && sortBy.name) {
                            sort = (_g = {},
                                _g[sortBy.name] = parseInt(sortBy.type),
                                _g);
                        }
                        return [4 /*yield*/, Promise.all([
                                this.db.collection('tickets').aggregate([
                                    { "$match": obj },
                                    { "$sort": (sort) ? sort : { 'lasttouchedTime': -1 } },
                                    { "$limit": (limit) ? limit : 50 }
                                ]).toArray(),
                                this.db.collection('tickets').aggregate([
                                    { "$match": obj },
                                    { "$group": { _id: '$state', count: { "$sum": 1 } } },
                                    { "$project": { _id: 0, state: "$_id", count: 1 } }
                                ]).toArray()
                            ])];
                    case 13: 
                    // console.log('Object', JSON.stringify(obj));
                    return [2 /*return*/, _h.sent()];
                    case 14:
                        error_64 = _h.sent();
                        console.log(error_64);
                        console.log('error in Get Tickets');
                        return [3 /*break*/, 15];
                    case 15: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.getTicketIDsFromSolr = function (solrQuery, limit) {
        return __awaiter(this, void 0, void 0, function () {
            var rows, url, ticketIDs_1, resp, err_17;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        rows = 2147483647;
                        if (limit < 6) {
                            rows = limit;
                        }
                        url = 'http://searchdb.beelinks.solutions:8983/solr/collectTicketMsg/' + solrQuery + '&rows=' + rows;
                        ticketIDs_1 = [];
                        return [4 /*yield*/, request.get(url, {})];
                    case 1:
                        resp = _a.sent();
                        resp = JSON.parse(resp);
                        // console.log(resp);
                        if (resp) {
                            resp.grouped.tid.groups.map(function (e) {
                                e.doclist.docs.map(function (element) {
                                    ticketIDs_1.push(element.tid);
                                });
                            });
                        }
                        return [2 /*return*/, ticketIDs_1];
                    case 2:
                        err_17 = _a.sent();
                        // console.log(err);
                        console.log('Error in getting tickets from solr');
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.getTicketsFromSolr = function (tid) {
        return __awaiter(this, void 0, void 0, function () {
            var url, resp, err_18;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        url = 'http://searchdb.beelinks.solutions:8983/solr/collectTicketMsg/select?q=tid%3A' + tid + '&rows=2147483647';
                        return [4 /*yield*/, request.get(url)];
                    case 1:
                        resp = _a.sent();
                        return [2 /*return*/, resp];
                    case 2:
                        err_18 = _a.sent();
                        console.log('Error in gettings tickets from solr');
                        console.log(err_18);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.updateTicketSolr = function (tickets) {
        return __awaiter(this, void 0, void 0, function () {
            var ticketsData;
            var _this = this;
            return __generator(this, function (_a) {
                try {
                    ticketsData = Array.isArray(tickets) ? tickets : [tickets];
                    //    console.log(tickets)
                    ticketsData.forEach(function (ticket) { return __awaiter(_this, void 0, void 0, function () {
                        var response, result;
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.getTicketsFromSolr(ticket._id)];
                                case 1:
                                    response = _a.sent();
                                    result = JSON.parse(response);
                                    if (result.response && result.response.docs.length) {
                                        // console.log(result);
                                        result.response.docs.map(function (solrTicket) { return __awaiter(_this, void 0, void 0, function () {
                                            var body, url;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        body = solrTicket;
                                                        body.assigned_to = ticket.assigned_to;
                                                        body.group = ticket.group;
                                                        body.watchers = ticket.watchers;
                                                        delete body._version_;
                                                        url = 'http://searchdb.beelinks.solutions:8983/solr/collectTicketMsg/update?stream.body=[' + JSON.stringify(body) + ']&commit=true';
                                                        // console.log(url)
                                                        return [4 /*yield*/, request.get(url)];
                                                    case 1:
                                                        // console.log(url)
                                                        _a.sent();
                                                        return [2 /*return*/];
                                                }
                                            });
                                        }); });
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                }
                catch (err) {
                    console.log('Error in updating ticket in solr');
                    console.log(err);
                }
                return [2 /*return*/];
            });
        });
    };
    Tickets.getTicketssByIDs = function (IDs) {
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
    Tickets.getTicketssByIDsAndProcess = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.collection.findOneAndUpdate({ _id: new mongodb_1.ObjectID(id), $or: [{ processing: false }, { processing: { $exists: false } }] }, { $set: { 'processing': true } }, { returnOriginal: false, upsert: false })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Tickets.temp = function (nsp, email, canview, filters, chunk) {
        return __awaiter(this, void 0, void 0, function () {
            var matchObject;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        matchObject = {};
                        Object.keys(filters).map(function (key) {
                            if (Array.isArray(filters[key])) {
                                matchObject[key] = { '$in': filters[key] };
                            }
                            else
                                matchObject[key] = filters[key];
                        });
                        Object.assign(matchObject, { 'nsp': nsp });
                        return [4 /*yield*/, this.db.collection('tickets').aggregate([
                                { "$match": { $or: [matchObject] } },
                                { "$sort": { "lasttouchedTime": -1 } },
                                { "$limit": 50 }
                            ]).toArray()];
                    case 1: 
                    // console.log(JSON.stringify(matchObject));
                    // Object.assign(matchObject, { 'lasttouchedTime': { "$lt": chunk } });
                    return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Tickets.getTicketsCount = function (nsp, email, canView, filters, query, clause, assignType, groupAssignType, mergeType) {
        return __awaiter(this, void 0, void 0, function () {
            var filtersObject_4, obj, $or, _id, tickets, objectIdArray, _a, groups, teamMembers, error_65;
            var _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 11, , 12]);
                        if (!clause)
                            clause = "$and";
                        filtersObject_4 = (_b = {}, _b[clause] = [], _b);
                        obj = { 'nsp': nsp, '$and': [] };
                        $or = [];
                        _id = undefined;
                        if (filters) {
                            Object.keys(filters).map(function (key) {
                                var _a, _b;
                                if (key == 'daterange') {
                                    filters[key].to = new Date(new Date(filters[key].to).getTime() + (60 * 60 * 24 * 1000) - 1);
                                    filtersObject_4[clause].push({ 'datetime': { $gte: new Date(filters[key].from).toISOString(), $lt: new Date(filters[key].to).toISOString() } });
                                    // console.log('Date From', filters[key].from);
                                    // console.log('Date To ', filters[key].to)
                                    // if (new Date(filters[key].from).toISOString() == new Date(filters[key].to).toISOString()) {
                                    //     filtersObject[clause].push({ 'datetime': { $gte: new Date(filters[key].from).toISOString(), $lt: new Date(filters[key].to).toISOString() } })
                                    // }
                                    // filtersObject[clause].push({ 'datetime': { $lte: new Date(filters[key].to).toISOString() } })
                                    return;
                                }
                                if (Array.isArray(filters[key])) {
                                    filtersObject_4[clause].push((_a = {}, _a[key] = { '$in': filters[key] }, _a));
                                }
                                else
                                    filtersObject_4[clause].push((_b = {}, _b[key] = filters[key], _b));
                            });
                        }
                        if (mongodb_1.ObjectID.isValid(query))
                            _id = { _id: new mongodb_1.ObjectID(query) };
                        if (filtersObject_4[clause].length)
                            Object.assign(obj, filtersObject_4);
                        if (!query) return [3 /*break*/, 2];
                        $or = [
                            { subject: new RegExp(query, 'gmi') },
                            { from: new RegExp(query, 'gmi') },
                            (_c = {}, _c['visitor.name'] = new RegExp(query, 'gmi'), _c),
                            (_d = {}, _d['visitor.email'] = new RegExp(query, 'gmi'), _d),
                            { clientID: new RegExp(query, 'gmi') }
                        ];
                        return [4 /*yield*/, this.db.collection('ticketMessages').aggregate([
                                {
                                    '$match': {
                                        nsp: nsp,
                                        $and: [
                                            {
                                                $text: {
                                                    $search: query
                                                }
                                            },
                                            {
                                                message: new RegExp(query)
                                            }
                                        ]
                                    }
                                }, {
                                    '$group': {
                                        '_id': '$nsp',
                                        'tids': {
                                            '$addToSet': {
                                                '$arrayElemAt': [
                                                    '$tid', 0
                                                ]
                                            }
                                        }
                                    }
                                }
                            ]).limit(1).toArray()];
                    case 1:
                        tickets = _e.sent();
                        if (tickets && tickets.length && tickets[0].tids.length) {
                            objectIdArray = tickets[0].tids.map(function (s) { return new mongodb_1.ObjectId(s); });
                            $or.push({ _id: { $in: objectIdArray } });
                            // console.log($or[4]);
                        }
                        _e.label = 2;
                    case 2:
                        if (_id)
                            $or.push(_id);
                        _a = canView;
                        switch (_a) {
                            case 'all': return [3 /*break*/, 3];
                            case 'assignedOnly': return [3 /*break*/, 4];
                            case 'group': return [3 /*break*/, 5];
                            case 'team': return [3 /*break*/, 7];
                        }
                        return [3 /*break*/, 9];
                    case 3:
                        //Do Nothing
                        obj.$and.push({ "_id": { $exists: true } });
                        return [3 /*break*/, 10];
                    case 4:
                        // Object.assign(obj, { $or : [ {"assigned_to": email },{ "watchers" : {$in: [email]}}]});
                        obj.$and.push({ $or: [{ "assigned_to": email }, { "watchers": { $in: [email] } }] });
                        return [3 /*break*/, 10];
                    case 5: return [4 /*yield*/, TicketgroupModel_1.TicketGroupsModel.getGroupsbyAdmin(nsp, email)];
                    case 6:
                        groups = _e.sent();
                        obj.$and.push({
                            '$or': [
                                { group: { '$in': groups } },
                                { assigned_to: email },
                                { "watchers": { $in: [email] } }
                            ]
                        });
                        return [3 /*break*/, 10];
                    case 7: return [4 /*yield*/, teamsModel_1.TeamsModel.getTeamMembersAgainstAgent(nsp, email)];
                    case 8:
                        teamMembers = _e.sent();
                        // console.log(teamMembers);
                        obj.$and.push({ $or: [{ "assigned_to": { $in: teamMembers } }, { "watchers": { $in: [email] } }] });
                        return [3 /*break*/, 10];
                    case 9: return [3 /*break*/, 10];
                    case 10:
                        switch (assignType) {
                            case 'assigned':
                                Object.assign(obj, {
                                    assigned_to: {
                                        $exists: true
                                    }
                                });
                                break;
                            case 'unassigned':
                                Object.assign(obj, {
                                    $or: [
                                        {
                                            assigned_to: {
                                                $exists: false
                                            }
                                        },
                                        {
                                            assigned_to: ''
                                        }
                                    ]
                                });
                                break;
                            default:
                                break;
                        }
                        switch (groupAssignType) {
                            case 'assigned':
                                Object.assign(obj, {
                                    $and: [
                                        {
                                            group: {
                                                $exists: true
                                            }
                                        },
                                        {
                                            group: {
                                                $ne: ''
                                            }
                                        }
                                    ]
                                });
                                break;
                            case 'unassigned':
                                Object.assign(obj, {
                                    $or: [
                                        {
                                            group: {
                                                $exists: false
                                            }
                                        },
                                        {
                                            group: ''
                                        }
                                    ]
                                });
                                break;
                            default:
                                break;
                        }
                        switch (mergeType) {
                            case 'yes':
                                Object.assign(obj, {
                                    merged: true
                                });
                                break;
                            case 'no':
                                Object.assign(obj, {
                                    $or: [
                                        {
                                            merged: {
                                                $exists: false
                                            }
                                        },
                                        {
                                            merged: false
                                        }
                                    ]
                                });
                                break;
                            default:
                                break;
                        }
                        // if (query) Object.assign(obj, { '$or': $or })
                        if (query)
                            obj.$and.push({ '$or': $or });
                        return [2 /*return*/, this.collection.aggregate([
                                { "$match": obj },
                                { $group: { _id: '$state', count: { "$sum": 1 } } },
                                { $project: { _id: 0, state: "$_id", count: 1 } }
                            ]).toArray()
                            //return this.collection.find({ nsp: nsp }).toArray();
                        ];
                    case 11:
                        error_65 = _e.sent();
                        console.log(error_65);
                        console.log('error in Get Tickets Count');
                        return [3 /*break*/, 12];
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.getNSP = function (tid) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    return [2 /*return*/, this.collection.find({ tid: tid }, { fields: { nsp: 1 } }).limit(1).toArray()];
                }
                catch (error) {
                    console.log(error);
                    console.log('Error in Get NSP');
                }
                return [2 /*return*/];
            });
        });
    };
    Tickets.getMessages = function (tid) {
        return __awaiter(this, void 0, void 0, function () {
            var objectIdArray, messageCollection, result;
            return __generator(this, function (_a) {
                objectIdArray = tid.map(function (s) { return new mongodb_1.ObjectId(s); });
                // console.log('Getting Merged Messaged');
                // console.log(tid);
                try {
                    messageCollection = this.db.collection('ticketMessages');
                    result = messageCollection.find({ tid: { $in: objectIdArray } }).toArray();
                    return [2 /*return*/, result];
                }
                catch (error) {
                    console.log(error);
                    console.log('error in Getting Ticket Messages');
                }
                return [2 /*return*/];
            });
        });
    };
    Tickets.getMesages = function (tid) {
        return __awaiter(this, void 0, void 0, function () {
            var objectIdArray, messageCollection;
            return __generator(this, function (_a) {
                try {
                    objectIdArray = tid.map(function (s) { return new mongodb_1.ObjectId(s); });
                    messageCollection = this.db.collection('ticketMessages');
                    return [2 /*return*/, messageCollection.find({ tid: { $in: objectIdArray } }).toArray()];
                }
                catch (error) {
                    console.log(error);
                    console.log('error in Getting Ticket Messages Multi');
                }
                return [2 /*return*/];
            });
        });
    };
    Tickets.InsertMessage = function (message, lastReply) {
        if (lastReply === void 0) { lastReply = undefined; }
        return __awaiter(this, void 0, void 0, function () {
            var messageCollection, data, packet;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        message.tid = message.tid.map(function (tid) { return new mongodb_1.ObjectID(tid); });
                        messageCollection = this.db.collection('ticketMessages');
                        return [4 /*yield*/, messageCollection.insertOne(message)];
                    case 1:
                        data = _a.sent();
                        if (!(this.collection && lastReply)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.collection.updateOne({ _id: message.tid[0] }, { $set: { lastReply: lastReply } })];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        if (!(process.env.NODE_ENV == 'production')) return [3 /*break*/, 5];
                        console.log('Sending Message to SOLR Queue');
                        packet = {
                            action: 'newTicketMessage',
                            body: {
                                "tid": message.tid[0],
                                "msg": message.message,
                                "dateTime": message.datetime,
                                "nsp": message.nsp
                            }
                        };
                        return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendMessageToSOLR(packet, 'ticket')];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [2 /*return*/, data];
                }
            });
        });
    };
    Tickets.InsertMessages = function (messages) {
        return __awaiter(this, void 0, void 0, function () {
            var messageCollection, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        messageCollection = this.db.collection('ticketMessages');
                        return [4 /*yield*/, messageCollection.insertMany(messages)];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data];
                }
            });
        });
    };
    Tickets.DeMergeTickets = function (nsp, primaryReference, SecondaryReference, ticketlog) {
        return __awaiter(this, void 0, void 0, function () {
            var returingObj, updatedPrimary, updatedSecondary, newlog, newlog, error_66;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 19, , 20]);
                        returingObj = { primaryTicket: undefined, secondaryTicket: undefined };
                        primaryReference = new mongodb_1.ObjectId(primaryReference);
                        SecondaryReference = new mongodb_1.ObjectId(SecondaryReference);
                        updatedPrimary = undefined;
                        updatedSecondary = undefined;
                        return [4 /*yield*/, this.collection.findOneAndUpdate({
                                nsp: nsp,
                                _id: { $in: [SecondaryReference] }
                            }, {
                                $pull: { references: { $in: [primaryReference] } },
                            }, { returnOriginal: false, upsert: false })];
                    case 1:
                        /**
                         * @Work
                         * 1. Pull Reference
                         * @Verify_Cases_SecondaryTicket
                         * 1. if Secondary ticket doesn't MergeTicketIDs && doesn't have References)
                         *      a. resume state
                         *      b. set merge and isprimary to false
                         *
                         * 2. if Secondary ticket doesn't have MergeTicketIDs && have References
                         *      a. do nothing
                         * 3. if Secondary ticket have MergeTicketIDs && doesn't have References
                         *      a. resume state
                         * 4. if Secondary ticket have MergeTicketIDs && have References
                         *      a. do nothing
                         *
                         * @Work
                         * 1. Pull MergeTicketIDs
                         * @Verify_Cases_Primary_Ticket
                         * 1. if Primary ticket doesn't have MergeTicketIDs && doesn't have References)
                         *      b. set merge and isprimary to false
                         *
                         * 2. if Primary ticket doesn't have MergeTicketIDs && have References
                         *      a. set isPrimary to false
                         * 3. if Secondary ticket have MergeTicketIDs && doesn't have References
                         *      a. do nothing
                         * 4. if Secondary ticket have MergeTicketIDs && have References
                         *      a. do nothing
                         */
                        updatedSecondary = _a.sent();
                        if (!(updatedSecondary && updatedSecondary.value)) return [3 /*break*/, 9];
                        if (!(!updatedSecondary.value.mergedTicketIds || !updatedSecondary.value.mergedTicketIds.length)) return [3 /*break*/, 4];
                        if (!(!updatedSecondary.value.references || !updatedSecondary.value.references.length)) return [3 /*break*/, 3];
                        if (updatedSecondary.value.preservedState)
                            updatedSecondary.value.state = updatedSecondary.value.preservedState;
                        newlog = JSON.parse(JSON.stringify(ticketlog.secondaryTicketLog));
                        newlog.title = "Resumed State to " + updatedSecondary.value.state + "from " + updatedSecondary.value.preservedState;
                        return [4 /*yield*/, this.collection.findOneAndUpdate({
                                nsp: nsp,
                                _id: { $in: [SecondaryReference] }
                            }, {
                                $set: { state: updatedSecondary.value.state, merged: false, isPrimary: false },
                                $unset: { preservedState: 1 },
                                $push: { ticketlog: { $each: [ticketlog.secondaryTicketLog, newlog] } }
                            }, { returnOriginal: false, upsert: false })];
                    case 2:
                        updatedSecondary = _a.sent();
                        _a.label = 3;
                    case 3: return [3 /*break*/, 9];
                    case 4:
                        if (!(updatedSecondary.value.mergedTicketIds && updatedSecondary.value.mergedTicketIds.length)) return [3 /*break*/, 7];
                        if (!(!updatedSecondary.value.references || !updatedSecondary.value.references.length)) return [3 /*break*/, 6];
                        newlog = JSON.parse(JSON.stringify(ticketlog.secondaryTicketLog));
                        newlog.title = "Resumed State to " + updatedSecondary.value.state + "from " + updatedSecondary.value.preservedState;
                        updatedSecondary.value.state = updatedSecondary.value.preservedState;
                        return [4 /*yield*/, this.collection.findOneAndUpdate({
                                nsp: nsp,
                                _id: { $in: [SecondaryReference] }
                            }, {
                                $set: { state: updatedSecondary.value.state },
                                $unset: { preservedState: 1 },
                                $push: { ticketlog: { $each: [ticketlog.secondaryTicketLog, newlog] } }
                            }, { returnOriginal: false, upsert: false })];
                    case 5:
                        updatedSecondary = _a.sent();
                        _a.label = 6;
                    case 6: return [3 /*break*/, 9];
                    case 7: return [4 /*yield*/, this.collection.findOneAndUpdate({
                            nsp: nsp,
                            _id: { $in: [SecondaryReference] }
                        }, {
                            $set: { state: updatedSecondary.value.state },
                            $unset: { preservedState: 1 },
                            $push: { ticketlog: { $each: [ticketlog.secondaryTicketLog] } }
                        }, { returnOriginal: false, upsert: false })];
                    case 8:
                        updatedSecondary = _a.sent();
                        _a.label = 9;
                    case 9:
                        if (!(updatedSecondary && updatedSecondary.value)) return [3 /*break*/, 18];
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ _id: { $in: [new mongodb_1.ObjectId(primaryReference)] }, nsp: nsp }, {
                                $pull: {
                                    references: { $in: [SecondaryReference] },
                                    mergedTicketIds: { _id: { $in: [SecondaryReference] } }
                                }
                            }, { returnOriginal: false, upsert: false })];
                    case 10:
                        /**
                        * @Verify_Cases_Primary_Ticket
                        * 1. if Primary ticket doesn't have MergeTicketIDs && doesn't have References)
                        *       a. set merged to false
                        *       b. isprimary to false
                        *
                        * 2. if Primary ticket doesn't have MergeTicketIDs && have References
                        *      a. set isPrimary to false
                        * 3. if Secondary ticket have MergeTicketIDs && doesn't have References
                        *      a. do nothing
                        * 4. if Secondary ticket have MergeTicketIDs && have References
                        *      a. do nothing
                        */
                        updatedPrimary = _a.sent();
                        if (!(updatedPrimary && updatedPrimary.value)) return [3 /*break*/, 17];
                        if (!(!updatedPrimary.value.mergedTicketIds || !updatedPrimary.value.mergedTicketIds.length)) return [3 /*break*/, 15];
                        if (!(!updatedPrimary.value.references || !updatedPrimary.value.references.length)) return [3 /*break*/, 12];
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ _id: { $in: [new mongodb_1.ObjectId(primaryReference)] }, nsp: nsp }, {
                                $set: { isPrimary: false, merged: false },
                                $push: { ticketlog: { $each: [ticketlog.primaryTicketLog] } }
                            }, { returnOriginal: false, upsert: false })];
                    case 11:
                        updatedPrimary = _a.sent();
                        return [3 /*break*/, 14];
                    case 12:
                        if (!(updatedPrimary.value.references && updatedPrimary.value.references.length)) return [3 /*break*/, 14];
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ _id: { $in: [new mongodb_1.ObjectId(primaryReference)] }, nsp: nsp }, {
                                $set: { isPrimary: false },
                                $push: { ticketlog: { $each: [ticketlog.primaryTicketLog] } }
                            }, { returnOriginal: false, upsert: false })];
                    case 13:
                        updatedPrimary = _a.sent();
                        _a.label = 14;
                    case 14: return [3 /*break*/, 17];
                    case 15: return [4 /*yield*/, this.collection.findOneAndUpdate({ _id: { $in: [new mongodb_1.ObjectId(primaryReference)] }, nsp: nsp }, {
                            $push: { ticketlog: { $each: [ticketlog.primaryTicketLog] } }
                        }, { returnOriginal: false, upsert: false })];
                    case 16:
                        updatedPrimary = _a.sent();
                        _a.label = 17;
                    case 17:
                        if (updatedPrimary && updatedPrimary.value) {
                            returingObj.primaryTicket = updatedPrimary.value;
                            returingObj.secondaryTicket = updatedSecondary.value;
                        }
                        _a.label = 18;
                    case 18: 
                    //#endregion
                    return [2 /*return*/, returingObj];
                    case 19:
                        error_66 = _a.sent();
                        console.log(error_66);
                        console.log('error in MergeTickets');
                        return [2 /*return*/, { primaryTicket: undefined, secondaryTicket: undefined }];
                    case 20: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.MergeTickets = function (nsp, mergeIds, ticketlog, seondaryTicketDetails, primaryReference, mergedTicketsDetails) {
        return __awaiter(this, void 0, void 0, function () {
            var returingObj, secondaryTicketIds_1, updatedPrimary, updatedSecondaries, objectIdArray, objectIDArrayWithoutPrimaryID, secondaryTickets, error_67;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        returingObj = { primaryTicket: undefined, secondaryTicket: [] };
                        secondaryTicketIds_1 = [];
                        updatedPrimary = undefined;
                        updatedSecondaries = undefined;
                        objectIdArray = mergeIds.map(function (s) { return new mongodb_1.ObjectId(s); });
                        objectIDArrayWithoutPrimaryID = objectIdArray.filter(function (id) { return (id != primaryReference); });
                        seondaryTicketDetails = seondaryTicketDetails.map(function (ticket) { ticket._id = new mongodb_1.ObjectId(ticket._id); return ticket; });
                        seondaryTicketDetails.map(function (ticket) { secondaryTicketIds_1.push(new mongodb_1.ObjectId(ticket._id)); return ticket; });
                        return [4 /*yield*/, this.collection.updateMany({
                                nsp: nsp,
                                $and: [
                                    { _id: { $in: objectIdArray } },
                                    { _id: { $nin: [new mongodb_1.ObjectId(primaryReference)] } },
                                    { state: { $ne: 'CLOSED' } }
                                ]
                            }, {
                                $rename: { "state": "preservedState" },
                            }, { upsert: false })];
                    case 1:
                        /**
                         * @Work
                         * 1. Set Reference and Merged Boolean on All Secondary Tickets and Set Closed To All Except Primary Reference
                         * 2. Set secondary References on Primary Ticket && Merged To True && PrimaryReference && isPrimary True
                         * 3. Find All Updated Secondary Tickets
                         * 4. Compose Object and return returningObj
                         */
                        updatedSecondaries = _a.sent();
                        return [4 /*yield*/, this.collection.updateMany({
                                nsp: nsp,
                                $and: [
                                    { _id: { $in: objectIdArray } },
                                    { _id: { $nin: [new mongodb_1.ObjectId(primaryReference)] } }
                                ]
                            }, {
                                $set: {
                                    merged: true,
                                    state: 'CLOSED',
                                    primaryTicketId: primaryReference
                                },
                                $addToSet: { references: new mongodb_1.ObjectID(primaryReference) },
                                $push: { ticketlog: ticketlog.secondaryTicketLog }
                            }, { upsert: false })];
                    case 2:
                        updatedSecondaries = _a.sent();
                        if (!(updatedSecondaries && updatedSecondaries.modifiedCount == objectIDArrayWithoutPrimaryID.length)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ _id: { $in: [new mongodb_1.ObjectId(primaryReference)] }, nsp: nsp }, {
                                $pull: { "mergedTicketIds": { _id: { $in: secondaryTicketIds_1 } } },
                            }, { returnOriginal: false, upsert: false })];
                    case 3:
                        updatedPrimary = _a.sent();
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ _id: { $in: [new mongodb_1.ObjectId(primaryReference)] }, nsp: nsp }, {
                                $set: {
                                    merged: true,
                                    lasttouchedTime: new Date().toISOString(),
                                    isPrimary: true,
                                    mergedTicketsDetails: mergedTicketsDetails
                                },
                                $addToSet: { references: { $each: secondaryTicketIds_1 } },
                                $push: { ticketlog: ticketlog.primaryTicketLog, mergedTicketIds: { $each: seondaryTicketDetails } }
                            }, { returnOriginal: false, upsert: false })];
                    case 4:
                        updatedPrimary = _a.sent();
                        if (!(updatedPrimary && updatedPrimary.value)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.collection.find({ _id: { $in: objectIDArrayWithoutPrimaryID } }).limit(objectIDArrayWithoutPrimaryID.length).toArray()];
                    case 5:
                        secondaryTickets = _a.sent();
                        returingObj.primaryTicket = updatedPrimary.value;
                        returingObj.secondaryTicket = secondaryTickets;
                        _a.label = 6;
                    case 6: return [2 /*return*/, returingObj];
                    case 7:
                        error_67 = _a.sent();
                        console.log(error_67);
                        console.log('error in MergeTickets');
                        return [2 /*return*/, { primaryTicket: undefined, secondaryTicket: [] }];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.AppendToPrimaryId = function (merged, mergeIds, Primaryid, nsp, ticketlog, primaryReference) {
        return __awaiter(this, void 0, void 0, function () {
            var objectIdArray;
            return __generator(this, function (_a) {
                try {
                    objectIdArray = mergeIds.map(function (s) { return new mongodb_1.ObjectId(s); });
                    // console.log(objectIdArray);
                    // console.log(Primaryid);
                    return [2 /*return*/, this.collection.findOneAndUpdate({ _id: new mongodb_1.ObjectId(Primaryid), nsp: nsp }, {
                            $set: {
                                primaryReference: new mongodb_1.ObjectId(Primaryid),
                                merged: merged,
                                lasttouchedTime: new Date().toISOString(),
                                mergedTicketIds: objectIdArray
                            },
                            $push: { ticketlog: ticketlog }
                        }, { returnOriginal: false, upsert: false })];
                }
                catch (error) {
                    console.log(error);
                    console.log('error in adding merged ticket Ids');
                }
                return [2 /*return*/];
            });
        });
    };
    Tickets.MatchSubject = function (ticket, operator, value) {
        var regexSubject = [];
        regexSubject.push({ operator: operator, keywords: value });
        var countMatchedKeywords = 0;
        var matched_subject = [];
        var regex;
        regexSubject.map(function (element) {
            countMatchedKeywords = 0;
            element.keywords.map(function (keyword) {
                // switch (element.operator) {
                //     case 'CONTAIN':
                //         regex = new RegExp("\\b" + keyword + "\\b", "gmi");
                //         return countMatchedKeywords++;
                //     case 'DOESNOTCONTAIN':
                //         return countMatchedKeywords++;
                //     case 'STARTSWITH':
                //         regex = new RegExp('^' + keyword), "gmi";
                //         return countMatchedKeywords++;
                //     case 'ENDSWITH':
                //         regex = new RegExp(keyword + '$', " gmi");
                //         return countMatchedKeywords++;
                // }
                if (element.operator == "CONTAIN" && ticket.subject && ticket.subject.toLowerCase().includes(keyword)) {
                    return countMatchedKeywords++;
                }
                else if (element.operator == "DOESNOTCONTAIN" && ticket.subject && !ticket.subject.toLowerCase().includes(keyword)) {
                    return countMatchedKeywords++;
                }
                else if (element.operator == "STARTSWITH" && ticket.subject && ticket.subject.toLowerCase().startsWith(keyword)) {
                    return countMatchedKeywords++;
                }
                else if (element.operator == "ENDSWITH" && ticket.subject && ticket.subject.toLowerCase().endsWith(keyword)) {
                    return countMatchedKeywords++;
                }
                else {
                    return countMatchedKeywords;
                }
            });
            return matched_subject.push({
                operator: element.operator,
                count: countMatchedKeywords,
            });
        });
        return ({ matchedSubjectCount: matched_subject, matchedboolean: (countMatchedKeywords > 0) ? true : false });
    };
    Tickets.MatchSource = function (ticket, operator, value) {
        var regexSource = [];
        regexSource.push({
            operator: operator,
            sources: value
        });
        var countMatchedSources = 0;
        var matched_source = [];
        regexSource.map(function (element) {
            countMatchedSources = 0;
            element.sources.map(function (source) {
                if (element.operator == "IS" && ticket.source && ticket.source.toLowerCase() == source.toLowerCase()) {
                    return countMatchedSources++;
                }
                else if (element.operator == "ISNOT" && ticket.source && ticket.source.toLowerCase() != source.toLowerCase()) {
                    return countMatchedSources++;
                }
                else {
                    return countMatchedSources;
                }
            });
            return matched_source.push({
                operator: element.operator,
                count: countMatchedSources
            });
        });
        return ({ matchedSourceCount: matched_source, matchedboolean: (countMatchedSources > 0) ? true : false });
    };
    Tickets.GetRulesets = function (ticket) {
        return __awaiter(this, void 0, void 0, function () {
            var rules, error_68;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.db.collection('ruleSets').find({ nsp: ticket.nsp, isActive: true }).toArray()];
                    case 1:
                        rules = _a.sent();
                        if (rules.length)
                            return [2 /*return*/, rules];
                        else
                            return [2 /*return*/, []];
                        return [3 /*break*/, 3];
                    case 2:
                        error_68 = _a.sent();
                        console.log(error_68);
                        console.log('error in Applying Rulesets');
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.FindBestAgentTicketInGroup = function (groupName, ticket) {
        return __awaiter(this, void 0, void 0, function () {
            var count_2, bestAgent_1, groups, logSchema, error_69;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
                        count_2 = 0;
                        bestAgent_1 = '';
                        return [4 /*yield*/, this.db.collection('ticketgroups').find({ nsp: ticket.nsp, group_name: groupName }).limit(1).toArray()];
                    case 1:
                        groups = _b.sent();
                        groups[0].agent_list.filter(function (a) { return !a.excluded; }).map(function (agent, index) {
                            if (index == 0) {
                                count_2 = agent.count;
                                bestAgent_1 = agent.email;
                                // position = index;
                                return;
                            }
                            else {
                                if (agent.count < count_2) {
                                    bestAgent_1 = agent.email;
                                    count_2 = agent.count;
                                    // position = index;
                                }
                            }
                        });
                        if (!bestAgent_1) return [3 /*break*/, 3];
                        //increment count of agent assigned ticket
                        ticket.assigned_to = bestAgent_1;
                        ticket.first_assigned_time = new Date().toISOString();
                        logSchema = {
                            title: 'assigned to',
                            status: ticket.assigned_to,
                            updated_by: 'Group Automation',
                            user_type: 'Group Automation',
                            time_stamp: new Date().toISOString()
                        };
                        ticket.ticketlog.push(logSchema);
                        return [4 /*yield*/, this.db.collection('ticketgroups').findOneAndUpdate({ nsp: ticket.nsp, group_name: ticket.group, "agent_list.email": bestAgent_1 }, { $inc: (_a = {}, _a["agent_list.$.count"] = 1, _a) })];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3: return [2 /*return*/, ticket];
                    case 4:
                        error_69 = _b.sent();
                        console.log(error_69);
                        console.log('Error in Finding BEst AGent Ticket');
                        return [2 /*return*/, undefined];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.FindBestAvailableAgentTicketInGroup = function (groupName, ticket) {
        return __awaiter(this, void 0, void 0, function () {
            var count_3, bestAgent_2, groups_1, onlineAgents, filteredAgents_1, logSchema, error_70;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 6, , 7]);
                        count_3 = 0;
                        bestAgent_2 = '';
                        return [4 /*yield*/, this.db.collection('ticketgroups').find({ nsp: ticket.nsp, group_name: groupName }).limit(1).toArray()];
                    case 1:
                        groups_1 = _b.sent();
                        if (!(groups_1 && groups_1.length)) return [3 /*break*/, 3];
                        return [4 /*yield*/, sessionsManager_1.SessionManager.getAllLiveAgentsByEmails(ticket.nsp, groups_1[0].agent_list.map(function (a) { return a.email; }))];
                    case 2:
                        onlineAgents = _b.sent();
                        // console.log(onlineAgents);
                        if (onlineAgents && onlineAgents.length) {
                            filteredAgents_1 = [];
                            onlineAgents.map(function (agent) {
                                filteredAgents_1.push({
                                    email: agent.email,
                                    count: groups_1[0].agent_list.filter(function (a) { return a.email == agent.email; })[0].count,
                                    isAdmin: groups_1[0].agent_list.filter(function (a) { return a.email == agent.email; })[0].isAdmin,
                                    excluded: groups_1[0].agent_list.filter(function (a) { return a.email == agent.email; })[0].excluded
                                });
                            });
                            groups_1[0].agent_list = filteredAgents_1;
                            // if(filteredAgents.length){
                            //     groups[0].agent_list = filteredAgents;
                            // }
                        }
                        else {
                            groups_1[0].agent_list = [];
                        }
                        groups_1[0].agent_list.filter(function (a) { return !a.excluded; }).map(function (agent, index) {
                            if (index == 0) {
                                count_3 = agent.count;
                                bestAgent_2 = agent.email;
                                // position = index;
                                return;
                            }
                            else {
                                if (agent.count < count_3) {
                                    bestAgent_2 = agent.email;
                                    count_3 = agent.count;
                                    // position = index;
                                }
                            }
                        });
                        _b.label = 3;
                    case 3:
                        if (!bestAgent_2) return [3 /*break*/, 5];
                        //increment count of agent assigned ticket
                        ticket.assigned_to = bestAgent_2;
                        ticket.first_assigned_time = new Date().toISOString();
                        logSchema = {
                            title: 'assigned to',
                            status: ticket.assigned_to,
                            updated_by: 'Group Automation',
                            user_type: 'Group Automation',
                            time_stamp: new Date().toISOString()
                        };
                        ticket.ticketlog.push(logSchema);
                        return [4 /*yield*/, this.db.collection('ticketgroups').findOneAndUpdate({ nsp: ticket.nsp, group_name: ticket.group, "agent_list.email": bestAgent_2 }, { $inc: (_a = {}, _a["agent_list.$.count"] = 1, _a) })];
                    case 4:
                        _b.sent();
                        _b.label = 5;
                    case 5: return [2 /*return*/, ticket];
                    case 6:
                        error_70 = _b.sent();
                        console.log(error_70);
                        console.log('Error in Finding BEst AGent Ticket');
                        return [2 /*return*/, undefined];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.CheckPrerequisites = function (policy, ticket) {
        try {
            /**
             Check if policy containing applyTo contains in ticket as well, then return policy's data.
            */
            var matchedArr_1 = new Array().fill(false);
            var returningData = Array();
            policy.policyApplyTo.map(function (applyTo, ind) {
                switch (applyTo.name) {
                    case 'group':
                        if (applyTo.value.includes(ticket.group) > -1) {
                            console.log("yes group matched");
                            matchedArr_1[ind] = true;
                        }
                        break;
                    case 'state':
                        if (applyTo.value.includes(ticket.state) > -1) {
                            console.log("yes state matched");
                            matchedArr_1[ind] = true;
                        }
                        break;
                    case 'source':
                        if (applyTo.value.includes(ticket.source) > -1) {
                            console.log("yes source matched");
                            matchedArr_1[ind] = true;
                        }
                        break;
                }
            });
            console.log("matched arr", matchedArr_1);
            if (matchedArr_1.every(function (data) { return data === true; })) {
                console.log("yes all matched!");
                console.log("return value now!");
                var data = void 0;
                data = {
                    policyName: policy.policyName,
                    reminderResolution: policy.reminderResolution,
                    reminderResponse: policy.reminderResponse,
                    violationResolution: policy.violationResolution,
                    violationResponse: policy.violationResponse,
                    slaTarget: policy.policyTarget
                };
                returningData.push(data);
                return returningData;
            }
            else {
                return [];
            }
        }
        catch (err) {
            console.log(err);
            console.log('error in Applying policies');
            return [];
        }
    };
    Tickets.getTicketBySBTVisitorSpecialCase = function (nsp, datetime, visitorEmail, group) {
        return __awaiter(this, void 0, void 0, function () {
            var error_71;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.aggregate([
                                {
                                    $match: {
                                        nsp: nsp,
                                        sbtVisitor: visitorEmail,
                                        group: group,
                                        datetime: { $gt: datetime }
                                    }
                                },
                                {
                                    $sort: {
                                        _id: -1
                                    }
                                }
                            ]).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_71 = _a.sent();
                        console.log('Error in getting particular ticket');
                        console.log(error_71);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.GetAgentInRoundRobin = function (groupName, ticket) {
        return __awaiter(this, void 0, void 0, function () {
            var count_4, bestAgent_3, groups, logSchema, error_72;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, , 6]);
                        if (!this.db) return [3 /*break*/, 4];
                        count_4 = 0;
                        bestAgent_3 = '';
                        return [4 /*yield*/, this.db.collection('ticketgroups').find({ nsp: ticket.nsp, group_name: groupName }).limit(1).toArray()];
                    case 1:
                        groups = _b.sent();
                        groups[0].agent_list.filter(function (a) { return !a.excluded; }).map(function (agent, index) {
                            if (index == 0) {
                                count_4 = agent.turnCount;
                                bestAgent_3 = agent.email;
                                // position = index;
                                return;
                            }
                            else {
                                if (agent.turnCount < count_4) {
                                    bestAgent_3 = agent.email;
                                    count_4 = agent.turnCount;
                                    // position = index;
                                }
                            }
                        });
                        if (!bestAgent_3) return [3 /*break*/, 3];
                        //increment count of agent assigned ticket
                        ticket.assigned_to = bestAgent_3;
                        ticket.first_assigned_time = new Date().toISOString();
                        logSchema = {
                            title: 'assigned to',
                            status: ticket.assigned_to,
                            updated_by: 'Group Automation',
                            user_type: 'Group Automation',
                            time_stamp: new Date().toISOString()
                        };
                        ticket.ticketlog.push(logSchema);
                        return [4 /*yield*/, this.db.collection('ticketgroups').findOneAndUpdate({ nsp: ticket.nsp, group_name: ticket.group, "agent_list.email": bestAgent_3 }, { $inc: (_a = {}, _a["agent_list.$.turnCount"] = 1, _a) })];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3: return [2 /*return*/, ticket];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_72 = _b.sent();
                        console.log(error_72);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.ApplyRuleSets = function (rulesets, obj) {
        try {
            var matched_1 = new Array(rulesets.length).fill(0);
            var votingArray_1 = new Array(rulesets.length).fill(0);
            rulesets.map(function (ruleset, index) {
                switch (ruleset.operator.toLowerCase()) {
                    case 'or':
                        // console.log('Case OR');
                        ruleset.conditions.map(function (condition) {
                            // console.log(condition.key);
                            // console.log(condition.regex);
                            // console.log(obj[condition.key]);
                            if (obj.hasOwnProperty(condition.key)) {
                                // console.log('Condition Matched', (obj[condition.key] as string).match(new RegExp(condition.regex, 'gmi')));
                                var result = obj[condition.key].match(new RegExp(condition.regex, 'gmi'));
                                if (result && result.length) {
                                    // console.log('Regex Matched', result);
                                    votingArray_1[index] += result.length;
                                    matched_1[index] = true;
                                }
                            }
                        });
                        break;
                    case 'and':
                        var canMatch_1 = true;
                        ruleset.conditions.map(function (condition) {
                            if (canMatch_1 && obj.hasOwnProperty(condition.key)) {
                                var result = obj[condition.key].match(new RegExp(condition.regex, 'gmi'));
                                if (result && result.length) {
                                    votingArray_1[index] += result.length;
                                    matched_1[index] = true;
                                }
                                else {
                                    matched_1[index] = false;
                                    canMatch_1 = false;
                                }
                            }
                        });
                        break;
                }
            });
            var RuleIndex_1 = -1;
            var max_1 = -1;
            // console.log('Matched Array', matched);
            // console.log('Voting Array', votingArray);
            matched_1.map(function (match, index) {
                if (match && votingArray_1[index] > max_1) {
                    RuleIndex_1 = index;
                    max_1 = votingArray_1[index];
                }
            });
            if (RuleIndex_1 > -1)
                return rulesets[RuleIndex_1];
            else
                return undefined;
        }
        catch (error) {
            console.log(error);
            console.log('error in Applying RuleSets');
            return undefined;
        }
    };
    Tickets.getTicketsForFilter = function (nsp, chunk, filters) {
        if (chunk === void 0) { chunk = ''; }
        return __awaiter(this, void 0, void 0, function () {
            var filtersObject_5, obj, error_73;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        filtersObject_5 = { '$or': [] };
                        obj = { 'nsp': nsp };
                        if (filters) {
                            Object.keys(filters).map(function (key) {
                                var _a, _b;
                                if (key == 'daterange') {
                                    filters[key].to = new Date(new Date(filters[key].to).getTime() + (60 * 60 * 24 * 1000) - 1);
                                    filtersObject_5['$or'].push({ 'datetime': { $gte: new Date(filters[key].from).toISOString(), $lt: new Date(filters[key].to).toISOString() } });
                                    // console.log('Date From', filters[key].from);
                                    // console.log('Date To ', filters[key].to)
                                    // if (new Date(filters[key].from).toISOString() == new Date(filters[key].to).toISOString()) {
                                    //     filtersObject[clause].push({ 'datetime': { $gte: new Date(filters[key].from).toISOString(), $lt: new Date(filters[key].to).toISOString() } })
                                    // }
                                    // filtersObject[clause].push({ 'datetime': { $lte: new Date(filters[key].to).toISOString() } })
                                    return;
                                }
                                if (Array.isArray(filters[key])) {
                                    filtersObject_5['$or'].push((_a = {}, _a[key] = { '$in': filters[key] }, _a));
                                }
                                else
                                    filtersObject_5['$or'].push((_b = {}, _b[key] = filters[key], _b));
                            });
                        }
                        if (chunk)
                            Object.assign(obj, { 'lasttouchedTime': { "$lt": chunk } });
                        if (filtersObject_5['$or'].length)
                            Object.assign(obj, filtersObject_5);
                        return [4 /*yield*/, this.db.collection('tickets').aggregate([
                                { "$match": obj },
                                { "$sort": { "lasttouchedTime": -1 } },
                                { "$limit": 50 }
                            ]).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_73 = _a.sent();
                        console.log(error_73);
                        console.log('error in Get tickets');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    //Suporting Functions
    Tickets.GenerateSubject = function (subject) {
    };
    //actual hash method
    Tickets.hashFnv32a = function (str, asString, seed) {
        /*jshint bitwise:false */
        var i, l, hval = (seed === undefined) ? 0x811c9dc5 : seed;
        for (i = 0, l = str.length; i < l; i++) {
            hval ^= str.charCodeAt(i);
            hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24);
        }
        if (asString) {
            // Convert to 8 digit hex string
            return ("0000000" + (hval >>> 0).toString(16)).substr(-8);
        }
        return hval >>> 0;
    };
    Tickets.getTicketClientID = function (str, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var exists, duplicate, randomString, charSet, i, randomPoz, exists_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        exists = [];
                        duplicate = false;
                        randomString = '';
                        _a.label = 1;
                    case 1:
                        charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                        for (i = 0; i < 5; i++) {
                            randomPoz = Math.floor(Math.random() * charSet.length);
                            randomString += charSet.substring(randomPoz, randomPoz + 1);
                        }
                        return [4 /*yield*/, this.collection.find({ nsp: nsp, clientID: randomString }).toArray()];
                    case 2:
                        exists_1 = _a.sent();
                        if (exists_1 && exists_1.length)
                            duplicate = true;
                        else
                            duplicate = false;
                        _a.label = 3;
                    case 3:
                        if (duplicate) return [3 /*break*/, 1];
                        _a.label = 4;
                    case 4: return [2 /*return*/, randomString];
                }
            });
        });
    };
    Tickets.SetClientID = function (tid, nsp, clientID) {
        return __awaiter(this, void 0, void 0, function () {
            var error_74;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ _id: new mongodb_1.ObjectId(tid), nsp: nsp }, { $set: { clientID: clientID } }, { returnOriginal: false, upsert: false })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_74 = _a.sent();
                        console.log('Error in getting particular ticket');
                        console.log(error_74);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.UpdateTicketWithSurveyData = function (tid, surveyId, surveyData) {
        return __awaiter(this, void 0, void 0, function () {
            var findQuestion, error_75;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 9, , 10]);
                        return [4 /*yield*/, this.collection.find({ _id: new mongodb_1.ObjectId(tid) }).limit(1).toArray()];
                    case 1:
                        findQuestion = _a.sent();
                        if (!(findQuestion && findQuestion[0].SubmittedSurveyData && findQuestion[0].SubmittedSurveyData.length)) return [3 /*break*/, 6];
                        if (!(findQuestion[0].SubmittedSurveyData.filter(function (data) { return data.question.toLowerCase() == surveyData.question.toLowerCase(); }).length > 0)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.collection.update({ _id: new mongodb_1.ObjectID(tid), 'SubmittedSurveyData.question': surveyData.question }, { $set: { 'SubmittedSurveyData.$.answer': surveyData.answer } }, { upsert: false, multi: false })];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3: return [4 /*yield*/, this.collection.update({ _id: new mongodb_1.ObjectID(tid) }, { $push: { SubmittedSurveyData: surveyData } }, { upsert: false, multi: false })];
                    case 4: return [2 /*return*/, _a.sent()];
                    case 5: return [3 /*break*/, 8];
                    case 6: return [4 /*yield*/, this.collection.findOneAndUpdate({ _id: new mongodb_1.ObjectID(tid) }, { $set: { surveyId: new mongodb_1.ObjectId(surveyId), SubmittedSurveyData: [surveyData] } })];
                    case 7: return [2 /*return*/, _a.sent()];
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        error_75 = _a.sent();
                        console.log('Error in updating ticket with survey data');
                        console.log(error_75);
                        return [3 /*break*/, 10];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.deleteWatcher = function (id, agent) {
        return __awaiter(this, void 0, void 0, function () {
            var ticket, packet, error_76;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ _id: new mongodb_1.ObjectId(id) }, { $pull: { watchers: agent } }, { upsert: false, returnOriginal: false })];
                    case 1:
                        ticket = _a.sent();
                        if (!(process.env.NODE_ENV == 'production' && ticket.ok)) return [3 /*break*/, 3];
                        packet = {
                            action: 'updateTicket',
                            body: {
                                "tids": [ticket.value._id],
                                "watchers": (ticket.value.watchers && ticket.value.watchers.length) ? ticket.value.watchers.join(',') : '',
                            }
                        };
                        return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendMessageToSOLR(packet, 'ticket')];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/, ticket];
                    case 4:
                        error_76 = _a.sent();
                        console.log('Error in deleteWatcher');
                        console.log(error_76);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.ExecuteScenarios = function (tids, nsp, updateObj, renameObj) {
        return __awaiter(this, void 0, void 0, function () {
            var result, objectIdArray, error_77;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        result = void 0;
                        objectIdArray = tids.map(function (s) { return new mongodb_1.ObjectId(s); });
                        if (!Object.keys(renameObj).length) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.collection.updateMany({ _id: { $in: objectIdArray }, nsp: nsp }, { $rename: renameObj }, { upsert: false })];
                    case 1:
                        result = _a.sent();
                        _a.label = 2;
                    case 2: return [4 /*yield*/, this.collection.updateMany({ _id: { $in: objectIdArray }, nsp: nsp }, updateObj, { upsert: false })];
                    case 3:
                        //bulk execution of scenario
                        result = _a.sent();
                        if (!(result && result.result.ok && result.modifiedCount == tids.length)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.collection.find({ _id: { $in: objectIdArray }, nsp: nsp }).limit(tids.length).toArray()];
                    case 4: return [2 /*return*/, _a.sent()];
                    case 5: return [2 /*return*/, []];
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        error_77 = _a.sent();
                        console.log('Error in executing scenario');
                        console.log(error_77);
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.getCustomData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var promise1, promise2, error_78;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        promise1 = this.collection.aggregate([
                            {
                                '$match': {
                                    'datetime': {
                                        '$gte': '2020-01-01',
                                        '$lte': '2020-02-20'
                                    },
                                    "visitor.email": new RegExp('no-reply'),
                                    '_id': {
                                        '$in': [
                                            new mongodb_1.ObjectId('5e3e9dfc0afc1f04e1f00b53'),
                                            new mongodb_1.ObjectId('5e40fb8548e376550b5212d6'),
                                            new mongodb_1.ObjectId('5e410ca448e376550b5214db'),
                                            new mongodb_1.ObjectId('5e4115bb63bdee0d8e955024'),
                                            new mongodb_1.ObjectId('5e411341ca76f25723c05d32'),
                                            new mongodb_1.ObjectId('5e41527a2a1d505792089005'),
                                            new mongodb_1.ObjectId('5e414fb763bdee0d8e9552c9'),
                                            new mongodb_1.ObjectId('5e415ede63bdee0d8e95536d'),
                                            new mongodb_1.ObjectId('5e41691863bdee0d8e9553e8'),
                                            new mongodb_1.ObjectId('5e417ac863bdee0d8e9554bf'),
                                            new mongodb_1.ObjectId('5e417afe63bdee0d8e9554c3'),
                                            new mongodb_1.ObjectId('5e417a8b63bdee0d8e9554b6'),
                                            new mongodb_1.ObjectId('5e417ed263bdee0d8e9554d9'),
                                            new mongodb_1.ObjectId('5e417eb02a1d5057920891ae'),
                                            new mongodb_1.ObjectId('5e40cb7c48e376550b520fe2'),
                                            new mongodb_1.ObjectId('5e41b1732a1d505792089352'),
                                            new mongodb_1.ObjectId('5e41ba4a63bdee0d8e95568b'),
                                            new mongodb_1.ObjectId('5e41de7f2a1d505792089484'),
                                            new mongodb_1.ObjectId('5e41ddfd63bdee0d8e955764'),
                                            new mongodb_1.ObjectId('5e41e61463bdee0d8e95577b'),
                                            new mongodb_1.ObjectId('5e41e28263bdee0d8e955775'),
                                            new mongodb_1.ObjectId('5e4220cb63bdee0d8e955830'),
                                            new mongodb_1.ObjectId('5e42268563bdee0d8e95583f'),
                                            new mongodb_1.ObjectId('5e41974d2a1d50579208925b'),
                                            new mongodb_1.ObjectId('5e4119ec2a1d505792088d39'),
                                            new mongodb_1.ObjectId('5e3ec6030afc1f04e1f00c3e'),
                                            new mongodb_1.ObjectId('5e40f6fc48e376550b52124d'),
                                            new mongodb_1.ObjectId('5e41286f2a1d505792088e0d'),
                                            new mongodb_1.ObjectId('5e4129ca63bdee0d8e9550fc'),
                                            new mongodb_1.ObjectId('5e4134fc63bdee0d8e95518f'),
                                            new mongodb_1.ObjectId('5e413c8263bdee0d8e9551c6'),
                                            new mongodb_1.ObjectId('5e4141e563bdee0d8e955229'),
                                            new mongodb_1.ObjectId('5e41499963bdee0d8e955281'),
                                            new mongodb_1.ObjectId('5e41499263bdee0d8e95527e'),
                                            new mongodb_1.ObjectId('5e414e5a63bdee0d8e9552b4'),
                                            new mongodb_1.ObjectId('5e4150762a1d505792088ffb'),
                                            new mongodb_1.ObjectId('5e4172102a1d505792089156'),
                                            new mongodb_1.ObjectId('5e41778963bdee0d8e9554a1'),
                                            new mongodb_1.ObjectId('5e418ca863bdee0d8e955526'),
                                            new mongodb_1.ObjectId('5e419e9d63bdee0d8e9555a9'),
                                            new mongodb_1.ObjectId('5e4148682a1d505792088fa8'),
                                            new mongodb_1.ObjectId('5e41a1df63bdee0d8e9555c5'),
                                            new mongodb_1.ObjectId('5e41a61163bdee0d8e9555ee'),
                                            new mongodb_1.ObjectId('5e40c83548e376550b520fd0'),
                                            new mongodb_1.ObjectId('5e41c0432a1d5057920893c6'),
                                            new mongodb_1.ObjectId('5e41f6c12a1d5057920894e1'),
                                            new mongodb_1.ObjectId('5e42100063bdee0d8e9557ea'),
                                            new mongodb_1.ObjectId('5e42102f2a1d505792089523'),
                                            new mongodb_1.ObjectId('5e4190cc63bdee0d8e955544'),
                                            new mongodb_1.ObjectId('5e41979163bdee0d8e95556b'),
                                            new mongodb_1.ObjectId('5e394d80a8e15c6568f2f8d5'),
                                            new mongodb_1.ObjectId('5e395929a8e15c6568f2f9f0'),
                                            new mongodb_1.ObjectId('5e39630fa8e15c6568f2faac'),
                                            new mongodb_1.ObjectId('5e396806a8e15c6568f2faf4'),
                                            new mongodb_1.ObjectId('5e39728fa8e15c6568f2fbe4'),
                                            new mongodb_1.ObjectId('5e397b47a8e15c6568f2fc84'),
                                            new mongodb_1.ObjectId('5e3981fea8e15c6568f2fd28'),
                                            new mongodb_1.ObjectId('5e3983ada8e15c6568f2fd4b'),
                                            new mongodb_1.ObjectId('5e39b4f2a8e15c6568f30082'),
                                            new mongodb_1.ObjectId('5e39b294a8e15c6568f3005f'),
                                            new mongodb_1.ObjectId('5e39cfd8a8e15c6568f30248'),
                                            new mongodb_1.ObjectId('5e39ccc1a8e15c6568f3020f'),
                                            new mongodb_1.ObjectId('5e39d1dfa8e15c6568f30268'),
                                            new mongodb_1.ObjectId('5e3a1f82a8e15c6568f30513'),
                                            new mongodb_1.ObjectId('5e3a08a5a8e15c6568f3047e'),
                                            new mongodb_1.ObjectId('5e3a6ad0a8e15c6568f3091b'),
                                            new mongodb_1.ObjectId('5e3a6168a8e15c6568f30869'),
                                            new mongodb_1.ObjectId('5e3a603aa8e15c6568f3084d'),
                                            new mongodb_1.ObjectId('5e3b806d8f6b6e0892140830'),
                                            new mongodb_1.ObjectId('5e3b8717c8a0e264908680a8'),
                                            new mongodb_1.ObjectId('5e3bbb5f8f6b6e08921409ed'),
                                            new mongodb_1.ObjectId('5e3bbf55c8a0e264908682d4'),
                                            new mongodb_1.ObjectId('5e3eedf348e376550b520462'),
                                            new mongodb_1.ObjectId('5e3eefb70afc1f04e1f00d62'),
                                            new mongodb_1.ObjectId('5e3ef2050afc1f04e1f00d74'),
                                            new mongodb_1.ObjectId('5e3ef5930afc1f04e1f00d8f'),
                                            new mongodb_1.ObjectId('5e3ef7c20afc1f04e1f00da5'),
                                            new mongodb_1.ObjectId('5e3ef7c10afc1f04e1f00da4'),
                                            new mongodb_1.ObjectId('5e3efd6e48e376550b5204d6'),
                                            new mongodb_1.ObjectId('5e3f02fc48e376550b5204fa'),
                                            new mongodb_1.ObjectId('5e3f05b348e376550b520500'),
                                            new mongodb_1.ObjectId('5e3effc50afc1f04e1f00dda'),
                                            new mongodb_1.ObjectId('5e3f05090afc1f04e1f00e0a'),
                                            new mongodb_1.ObjectId('5e3f0fe60afc1f04e1f00e37'),
                                            new mongodb_1.ObjectId('5e3f0fea48e376550b52052a'),
                                            new mongodb_1.ObjectId('5e3f126548e376550b520539'),
                                            new mongodb_1.ObjectId('5e3f126448e376550b520536'),
                                            new mongodb_1.ObjectId('5e3f13310afc1f04e1f00e46'),
                                            new mongodb_1.ObjectId('5e3f1c8c48e376550b520566'),
                                            new mongodb_1.ObjectId('5e3f29950afc1f04e1f00ec7'),
                                            new mongodb_1.ObjectId('5e3f2ae848e376550b52059f'),
                                            new mongodb_1.ObjectId('5e3f2bc60afc1f04e1f00ecd'),
                                            new mongodb_1.ObjectId('5e3f2eb948e376550b5205b4'),
                                            new mongodb_1.ObjectId('5e3f33000afc1f04e1f00ef4'),
                                            new mongodb_1.ObjectId('5e3f32fd0afc1f04e1f00ef1'),
                                            new mongodb_1.ObjectId('5e3f36b40afc1f04e1f00f15'),
                                            new mongodb_1.ObjectId('5e3f4a890afc1f04e1f00f54'),
                                            new mongodb_1.ObjectId('5e3f5f490afc1f04e1f00f87'),
                                            new mongodb_1.ObjectId('5e3f61460afc1f04e1f00f90'),
                                            new mongodb_1.ObjectId('5e3f657f0afc1f04e1f00fa2'),
                                            new mongodb_1.ObjectId('5e3f7db148e376550b520662'),
                                            new mongodb_1.ObjectId('5e3f8a5d48e376550b52067a'),
                                            new mongodb_1.ObjectId('5e3f8ad348e376550b520683'),
                                            new mongodb_1.ObjectId('5e3f8ba00afc1f04e1f00fed'),
                                            new mongodb_1.ObjectId('5e3f8f1948e376550b520689'),
                                            new mongodb_1.ObjectId('5e3f930148e376550b5206a1'),
                                            new mongodb_1.ObjectId('5e3f945c0afc1f04e1f01008'),
                                            new mongodb_1.ObjectId('5e3f973c48e376550b5206c4'),
                                            new mongodb_1.ObjectId('5e3fa2360afc1f04e1f01073'),
                                            new mongodb_1.ObjectId('5e3f01ff48e376550b5204f7'),
                                            new mongodb_1.ObjectId('5e3f05890afc1f04e1f00e0d'),
                                            new mongodb_1.ObjectId('5e3fad3d48e376550b520788'),
                                            new mongodb_1.ObjectId('5e3fae7f48e376550b5207aa'),
                                            new mongodb_1.ObjectId('5e3fb08948e376550b5207c2'),
                                            new mongodb_1.ObjectId('5e3fb40748e376550b5207e3'),
                                            new mongodb_1.ObjectId('5e3fba2448e376550b52080d'),
                                            new mongodb_1.ObjectId('5e3fb8bb0afc1f04e1f01149'),
                                            new mongodb_1.ObjectId('5e3fbae548e376550b520811'),
                                            new mongodb_1.ObjectId('5e3fbe8848e376550b520823'),
                                            new mongodb_1.ObjectId('5e3fbe7648e376550b520820'),
                                            new mongodb_1.ObjectId('5e3fc0cf48e376550b52082c'),
                                            new mongodb_1.ObjectId('5e3fcd2b48e376550b520865'),
                                            new mongodb_1.ObjectId('5e3fd0390afc1f04e1f0119e'),
                                            new mongodb_1.ObjectId('5e3fd17a48e376550b520879'),
                                            new mongodb_1.ObjectId('5e3fe16948e376550b5208d8'),
                                            new mongodb_1.ObjectId('5e3fec0048e376550b520921'),
                                            new mongodb_1.ObjectId('5e423e2d2a1d5057920895ed'),
                                            new mongodb_1.ObjectId('5e4240012a1d505792089600'),
                                            new mongodb_1.ObjectId('5e42432b2a1d50579208961d'),
                                            new mongodb_1.ObjectId('5e4245c82a1d505792089635'),
                                            new mongodb_1.ObjectId('5e4245fd2a1d505792089638'),
                                            new mongodb_1.ObjectId('5e42565b2a1d5057920896db'),
                                            new mongodb_1.ObjectId('5e4259372a1d5057920896ed'),
                                            new mongodb_1.ObjectId('5e4256572a1d5057920896d8'),
                                            new mongodb_1.ObjectId('5e4262a02a1d505792089739'),
                                            new mongodb_1.ObjectId('5e4265072a1d505792089751'),
                                            new mongodb_1.ObjectId('5e42645a2a1d50579208974e'),
                                            new mongodb_1.ObjectId('5e4265c02a1d50579208975d'),
                                            new mongodb_1.ObjectId('5e426e1763bdee0d8e955a84'),
                                            new mongodb_1.ObjectId('5e426ffb2a1d5057920897b7'),
                                            new mongodb_1.ObjectId('5e4270d02a1d5057920897c5'),
                                            new mongodb_1.ObjectId('5e426d5f2a1d50579208979c'),
                                            new mongodb_1.ObjectId('5e4280a12a1d50579208984b'),
                                            new mongodb_1.ObjectId('5e428deb63bdee0d8e955b9a'),
                                            new mongodb_1.ObjectId('5e429ab763bdee0d8e955bf7'),
                                            new mongodb_1.ObjectId('5e40791f48e376550b520d25'),
                                            new mongodb_1.ObjectId('5e42a6dc63bdee0d8e955c68'),
                                            new mongodb_1.ObjectId('5e42aa5163bdee0d8e955c80'),
                                            new mongodb_1.ObjectId('5e42adca63bdee0d8e955cb3'),
                                            new mongodb_1.ObjectId('5e42b99063bdee0d8e955d45'),
                                            new mongodb_1.ObjectId('5e42c4d92a1d505792089ab9'),
                                            new mongodb_1.ObjectId('5e4166652a1d5057920890be'),
                                            new mongodb_1.ObjectId('5e42d18963bdee0d8e955e16'),
                                            new mongodb_1.ObjectId('5e42d6f163bdee0d8e955e3f'),
                                            new mongodb_1.ObjectId('5e42bf0563bdee0d8e955d6e'),
                                            new mongodb_1.ObjectId('5e42db682a1d505792089b90'),
                                            new mongodb_1.ObjectId('5e42de4363bdee0d8e955e7f'),
                                            new mongodb_1.ObjectId('5e42de4e63bdee0d8e955e82'),
                                            new mongodb_1.ObjectId('5e42de512a1d505792089ba9'),
                                            new mongodb_1.ObjectId('5e42416763bdee0d8e9558de'),
                                            new mongodb_1.ObjectId('5e425d742a1d50579208970f'),
                                            new mongodb_1.ObjectId('5e425e2a2a1d505792089714'),
                                            new mongodb_1.ObjectId('5e40bc2c48e376550b520f8b'),
                                            new mongodb_1.ObjectId('5e3f423f48e376550b5205e4'),
                                            new mongodb_1.ObjectId('5e42305e63bdee0d8e95585d'),
                                            new mongodb_1.ObjectId('5e41afa563bdee0d8e955621'),
                                            new mongodb_1.ObjectId('5e4233ca2a1d505792089597'),
                                            new mongodb_1.ObjectId('5e41cf7a2a1d505792089429'),
                                            new mongodb_1.ObjectId('5e42455a2a1d50579208962e'),
                                            new mongodb_1.ObjectId('5e42461a63bdee0d8e955909'),
                                            new mongodb_1.ObjectId('5e42593c63bdee0d8e9559b1'),
                                            new mongodb_1.ObjectId('5e42580c2a1d5057920896e9'),
                                            new mongodb_1.ObjectId('5e4270c163bdee0d8e955aa8'),
                                            new mongodb_1.ObjectId('5e4277be63bdee0d8e955ad4'),
                                            new mongodb_1.ObjectId('5e427c9d63bdee0d8e955b11'),
                                            new mongodb_1.ObjectId('5e428fce63bdee0d8e955bae'),
                                            new mongodb_1.ObjectId('5e4290f82a1d5057920898c6'),
                                            new mongodb_1.ObjectId('5e42922a2a1d5057920898cd'),
                                            new mongodb_1.ObjectId('5e429bd663bdee0d8e955c07'),
                                            new mongodb_1.ObjectId('5e42ad1863bdee0d8e955ca7'),
                                            new mongodb_1.ObjectId('5e42acc163bdee0d8e955ca1'),
                                            new mongodb_1.ObjectId('5e42ae7b2a1d5057920899cf'),
                                            new mongodb_1.ObjectId('5e42c2712a1d505792089aaa'),
                                            new mongodb_1.ObjectId('5e42c89063bdee0d8e955dbf'),
                                            new mongodb_1.ObjectId('5e42d1ec2a1d505792089b39'),
                                            new mongodb_1.ObjectId('5e42d6be2a1d505792089b68'),
                                            new mongodb_1.ObjectId('5e42d8d92a1d505792089b77'),
                                            new mongodb_1.ObjectId('5e42b70e2a1d505792089a29'),
                                            new mongodb_1.ObjectId('5e42e29a63bdee0d8e955ea0'),
                                            new mongodb_1.ObjectId('5e42e47d2a1d505792089bc7'),
                                            new mongodb_1.ObjectId('5e42aee82a1d5057920899d5'),
                                            new mongodb_1.ObjectId('5e42ebd663bdee0d8e955f0c'),
                                            new mongodb_1.ObjectId('5e42edef63bdee0d8e955f33'),
                                            new mongodb_1.ObjectId('5e42ebca63bdee0d8e955f09'),
                                            new mongodb_1.ObjectId('5e42c2552a1d505792089aa7'),
                                            new mongodb_1.ObjectId('5e42f5502a1d505792089c82'),
                                            new mongodb_1.ObjectId('5e4299ae63bdee0d8e955bee'),
                                            new mongodb_1.ObjectId('5e41fe242a1d5057920894f0'),
                                            new mongodb_1.ObjectId('5e41ea7b2a1d5057920894b4'),
                                            new mongodb_1.ObjectId('5e42fb3063bdee0d8e955f9b'),
                                            new mongodb_1.ObjectId('5e42fc2063bdee0d8e955fa1'),
                                            new mongodb_1.ObjectId('5e42f84363bdee0d8e955f77'),
                                            new mongodb_1.ObjectId('5e4093f948e376550b520e16'),
                                            new mongodb_1.ObjectId('5e42fe082a1d505792089cca'),
                                            new mongodb_1.ObjectId('5e42fe042a1d505792089cc7'),
                                            new mongodb_1.ObjectId('5e42fe722a1d505792089ccd'),
                                            new mongodb_1.ObjectId('5e42fe6d63bdee0d8e955fc6'),
                                            new mongodb_1.ObjectId('5e428f9b2a1d5057920898bd'),
                                            new mongodb_1.ObjectId('5e426e3f63bdee0d8e955a87'),
                                            new mongodb_1.ObjectId('5e41bdad63bdee0d8e9556a3'),
                                            new mongodb_1.ObjectId('5e43083b2a1d505792089d18'),
                                            new mongodb_1.ObjectId('5e4310b92a1d505792089d4e'),
                                            new mongodb_1.ObjectId('5e4310bb2a1d505792089d51'),
                                            new mongodb_1.ObjectId('5e43108263bdee0d8e95603b'),
                                            new mongodb_1.ObjectId('5e4313da2a1d505792089d6f'),
                                            new mongodb_1.ObjectId('5e431d3f63bdee0d8e956084'),
                                            new mongodb_1.ObjectId('5e431ce62a1d505792089d9b'),
                                            new mongodb_1.ObjectId('5e431ce02a1d505792089d98'),
                                            new mongodb_1.ObjectId('5e431e6f2a1d505792089d9e'),
                                            new mongodb_1.ObjectId('5e4346fd2a1d505792089eab'),
                                            new mongodb_1.ObjectId('5e4349a363bdee0d8e9561a7'),
                                            new mongodb_1.ObjectId('5e434a282a1d505792089eba'),
                                            new mongodb_1.ObjectId('5e434e9563bdee0d8e9561cc'),
                                            new mongodb_1.ObjectId('5e434b8463bdee0d8e9561b3'),
                                            new mongodb_1.ObjectId('5e43475463bdee0d8e956192'),
                                            new mongodb_1.ObjectId('5e4346f02a1d505792089ea8'),
                                            new mongodb_1.ObjectId('5e4346f263bdee0d8e95618f'),
                                            new mongodb_1.ObjectId('5e434cc063bdee0d8e9561b6'),
                                            new mongodb_1.ObjectId('5e4345212a1d505792089e9c'),
                                            new mongodb_1.ObjectId('5e4359ba63bdee0d8e9561ef'),
                                            new mongodb_1.ObjectId('5e4357a12a1d505792089f0e'),
                                            new mongodb_1.ObjectId('5e4347bd63bdee0d8e95619b'),
                                            new mongodb_1.ObjectId('5e434cf72a1d505792089ec9'),
                                            new mongodb_1.ObjectId('5e434d2063bdee0d8e9561b9'),
                                            new mongodb_1.ObjectId('5e435fff63bdee0d8e95620d'),
                                            new mongodb_1.ObjectId('5e436f592a1d505792089f64'),
                                            new mongodb_1.ObjectId('5e4370c52a1d505792089f67'),
                                            new mongodb_1.ObjectId('5e4316b563bdee0d8e956060'),
                                            new mongodb_1.ObjectId('5e432a742a1d505792089df8'),
                                            new mongodb_1.ObjectId('5e432ab02a1d505792089e06'),
                                            new mongodb_1.ObjectId('5e432ae52a1d505792089e12'),
                                            new mongodb_1.ObjectId('5e432e1a63bdee0d8e95610a'),
                                            new mongodb_1.ObjectId('5e437dcf2a1d505792089fa7'),
                                            new mongodb_1.ObjectId('5e4300bb63bdee0d8e955fe5'),
                                            new mongodb_1.ObjectId('5e43807f2a1d505792089fb4'),
                                            new mongodb_1.ObjectId('5e42d8be63bdee0d8e955e53'),
                                            new mongodb_1.ObjectId('5e42d2892a1d505792089b3c'),
                                            new mongodb_1.ObjectId('5e4394902a1d50579208a045'),
                                            new mongodb_1.ObjectId('5e4310802a1d505792089d4b'),
                                            new mongodb_1.ObjectId('5e434a2663bdee0d8e9561aa'),
                                            new mongodb_1.ObjectId('5e437dcd63bdee0d8e9562a6'),
                                            new mongodb_1.ObjectId('5e439cd463bdee0d8e956386'),
                                            new mongodb_1.ObjectId('5e439dae63bdee0d8e95639c'),
                                            new mongodb_1.ObjectId('5e43a08663bdee0d8e9563c4'),
                                            new mongodb_1.ObjectId('5e43a3612a1d50579208a0da'),
                                            new mongodb_1.ObjectId('5e43a8952a1d50579208a120'),
                                            new mongodb_1.ObjectId('5e43e8072a1d50579208a40b'),
                                            new mongodb_1.ObjectId('5e43e96463bdee0d8e9566cc'),
                                            new mongodb_1.ObjectId('5e43eaa72a1d50579208a42d'),
                                            new mongodb_1.ObjectId('5e43edb12a1d50579208a458'),
                                            new mongodb_1.ObjectId('5e43ef8063bdee0d8e95671e'),
                                            new mongodb_1.ObjectId('5e43f6c52a1d50579208a4be'),
                                            new mongodb_1.ObjectId('5e43e21d2a1d50579208a3ae'),
                                            new mongodb_1.ObjectId('5e43ec9e2a1d50579208a448'),
                                            new mongodb_1.ObjectId('5e43c0be2a1d50579208a254'),
                                            new mongodb_1.ObjectId('5e43cad863bdee0d8e9565c2'),
                                            new mongodb_1.ObjectId('5e43ca7c2a1d50579208a2b6'),
                                            new mongodb_1.ObjectId('5e43e2032a1d50579208a374'),
                                            new mongodb_1.ObjectId('5e43e32163bdee0d8e95668c'),
                                            new mongodb_1.ObjectId('5e43d33c2a1d50579208a315'),
                                            new mongodb_1.ObjectId('5e43e5952a1d50579208a3ee'),
                                            new mongodb_1.ObjectId('5e43d9e963bdee0d8e956648'),
                                            new mongodb_1.ObjectId('5e43e68b63bdee0d8e9566b1'),
                                            new mongodb_1.ObjectId('5e4402c563bdee0d8e9567cb'),
                                            new mongodb_1.ObjectId('5e43ffac63bdee0d8e9567b0'),
                                            new mongodb_1.ObjectId('5e43fee62a1d50579208a51d'),
                                            new mongodb_1.ObjectId('5e43a3632a1d50579208a0dd'),
                                            new mongodb_1.ObjectId('5e43bc802a1d50579208a21f'),
                                            new mongodb_1.ObjectId('5e43bbda2a1d50579208a218'),
                                            new mongodb_1.ObjectId('5e43bf312a1d50579208a23f'),
                                            new mongodb_1.ObjectId('5e43bfb22a1d50579208a244'),
                                            new mongodb_1.ObjectId('5e43c49f63bdee0d8e956586'),
                                            new mongodb_1.ObjectId('5e43b1e82a1d50579208a197'),
                                            new mongodb_1.ObjectId('5e42c0472a1d505792089a97'),
                                            new mongodb_1.ObjectId('5e42c0302a1d505792089a94'),
                                            new mongodb_1.ObjectId('5e43b68a63bdee0d8e9564ea'),
                                            new mongodb_1.ObjectId('5e41873b2a1d5057920891e2'),
                                            new mongodb_1.ObjectId('5e43bbc163bdee0d8e956523'),
                                            new mongodb_1.ObjectId('5e442f6d2a1d50579208a6fa'),
                                            new mongodb_1.ObjectId('5e44f15563bdee0d8e956e4d'),
                                            new mongodb_1.ObjectId('5e44f0df63bdee0d8e956e44'),
                                            new mongodb_1.ObjectId('5e4465c72a1d50579208a896'),
                                            new mongodb_1.ObjectId('5e440f0763bdee0d8e956874'),
                                            new mongodb_1.ObjectId('5e43fbbf63bdee0d8e956782'),
                                            new mongodb_1.ObjectId('5e43fe0663bdee0d8e95679b'),
                                            new mongodb_1.ObjectId('5e43fc822a1d50579208a4fe'),
                                            new mongodb_1.ObjectId('5e440b882a1d50579208a5b4'),
                                            new mongodb_1.ObjectId('5e4414342a1d50579208a60f'),
                                            new mongodb_1.ObjectId('5e4412b82a1d50579208a5fd'),
                                            new mongodb_1.ObjectId('5e44107f63bdee0d8e95687f'),
                                            new mongodb_1.ObjectId('5e41523963bdee0d8e9552e5'),
                                            new mongodb_1.ObjectId('5e444ce063bdee0d8e956a98'),
                                            new mongodb_1.ObjectId('5e444e752a1d50579208a7e7'),
                                            new mongodb_1.ObjectId('5e442c5e2a1d50579208a6eb'),
                                            new mongodb_1.ObjectId('5e43e21063bdee0d8e95666d'),
                                            new mongodb_1.ObjectId('5e3356d66ce949443df88132'),
                                            new mongodb_1.ObjectId('5e437b6a2a1d505792089f98'),
                                            new mongodb_1.ObjectId('5e43e21063bdee0d8e95666a'),
                                            new mongodb_1.ObjectId('5e44228a2a1d50579208a690'),
                                            new mongodb_1.ObjectId('5e43ff272a1d50579208a520'),
                                            new mongodb_1.ObjectId('5e442fa863bdee0d8e9569ae'),
                                            new mongodb_1.ObjectId('5e41f6d063bdee0d8e95579c'),
                                            new mongodb_1.ObjectId('5e441a922a1d50579208a651'),
                                            new mongodb_1.ObjectId('5e432c2a63bdee0d8e956101'),
                                            new mongodb_1.ObjectId('5e4432cc2a1d50579208a718'),
                                            new mongodb_1.ObjectId('5e442fb12a1d50579208a700'),
                                            new mongodb_1.ObjectId('5e4410eb63bdee0d8e956889'),
                                            new mongodb_1.ObjectId('5e4403f463bdee0d8e9567dd'),
                                            new mongodb_1.ObjectId('5e4439c22a1d50579208a74b'),
                                            new mongodb_1.ObjectId('5e449f9663bdee0d8e956c7d'),
                                            new mongodb_1.ObjectId('5e44b5bd2a1d50579208aa26'),
                                            new mongodb_1.ObjectId('5e44d8e063bdee0d8e956da4'),
                                            new mongodb_1.ObjectId('5e44da0063bdee0d8e956da7'),
                                            new mongodb_1.ObjectId('5e44de0d2a1d50579208aae6'),
                                            new mongodb_1.ObjectId('5e4492542a1d50579208a995'),
                                            new mongodb_1.ObjectId('5e44e3842a1d50579208ab21'),
                                            new mongodb_1.ObjectId('5e44e4ec2a1d50579208ab39'),
                                            new mongodb_1.ObjectId('5e48204e8b03c9076e3bb9a6'),
                                            new mongodb_1.ObjectId('5e4827a18f9df23ae3788622'),
                                            new mongodb_1.ObjectId('5e482eb08b03c9076e3bba16'),
                                            new mongodb_1.ObjectId('5e482dec8b03c9076e3bba0d'),
                                            new mongodb_1.ObjectId('5e484c598b03c9076e3bbb4f'),
                                            new mongodb_1.ObjectId('5e48a35e8b03c9076e3bbd34'),
                                            new mongodb_1.ObjectId('5e48a3bd8b03c9076e3bbd3a'),
                                            new mongodb_1.ObjectId('5e48b5858b03c9076e3bbd6d'),
                                            new mongodb_1.ObjectId('5e48c69c8b03c9076e3bbd94'),
                                            new mongodb_1.ObjectId('5e4804268b03c9076e3bb904'),
                                            new mongodb_1.ObjectId('5e483d618b03c9076e3bbac9'),
                                            new mongodb_1.ObjectId('5e48e7a08b03c9076e3bbe9a'),
                                            new mongodb_1.ObjectId('5e4903078b03c9076e3bbf75'),
                                            new mongodb_1.ObjectId('5e49047f8b03c9076e3bbf8d'),
                                            new mongodb_1.ObjectId('5e4916f68b03c9076e3bc061'),
                                            new mongodb_1.ObjectId('5e4918c08b03c9076e3bc081'),
                                            new mongodb_1.ObjectId('5e47ebdd8b03c9076e3bb85b'),
                                            new mongodb_1.ObjectId('5e4923fd8b03c9076e3bc0f3'),
                                            new mongodb_1.ObjectId('5e49235b8b03c9076e3bc0ec'),
                                            new mongodb_1.ObjectId('5e4930cd8b03c9076e3bc17e'),
                                            new mongodb_1.ObjectId('5e4943b18b03c9076e3bc20b'),
                                            new mongodb_1.ObjectId('5e4972638b03c9076e3bc3c4'),
                                            new mongodb_1.ObjectId('5e497e238b03c9076e3bc40c'),
                                            new mongodb_1.ObjectId('5e497e618b03c9076e3bc412'),
                                            new mongodb_1.ObjectId('5e497ef38b03c9076e3bc421'),
                                            new mongodb_1.ObjectId('5e464be963bdee0d8e957939'),
                                            new mongodb_1.ObjectId('5e4654b82a1d50579208b6e2'),
                                            new mongodb_1.ObjectId('5e46529d63bdee0d8e957978'),
                                            new mongodb_1.ObjectId('5e4654b463bdee0d8e957991'),
                                            new mongodb_1.ObjectId('5e4654d263bdee0d8e957994'),
                                            new mongodb_1.ObjectId('5e4679382a1d50579208b85a'),
                                            new mongodb_1.ObjectId('5e467c0963bdee0d8e957ad9'),
                                            new mongodb_1.ObjectId('5e46a6988b03c9076e3bb01b'),
                                            new mongodb_1.ObjectId('5e46b3978f9df23ae3787d51'),
                                            new mongodb_1.ObjectId('5e4609ea63bdee0d8e957781'),
                                            new mongodb_1.ObjectId('5e46ba188b03c9076e3bb15a'),
                                            new mongodb_1.ObjectId('5e4776d48b03c9076e3bb591'),
                                            new mongodb_1.ObjectId('5e47a07f8f9df23ae3788272'),
                                            new mongodb_1.ObjectId('5e478fd28f9df23ae378820d'),
                                            new mongodb_1.ObjectId('5e47a8098f9df23ae378829d'),
                                            new mongodb_1.ObjectId('5e47a80b8b03c9076e3bb67f'),
                                            new mongodb_1.ObjectId('5e47acab8b03c9076e3bb6aa'),
                                            new mongodb_1.ObjectId('5e47c18f8f9df23ae378833b'),
                                            new mongodb_1.ObjectId('5e47cf5e8b03c9076e3bb7ad'),
                                            new mongodb_1.ObjectId('5e47e2a38b03c9076e3bb828'),
                                            new mongodb_1.ObjectId('5e476f1b8f9df23ae3788181'),
                                            new mongodb_1.ObjectId('5e4966468b03c9076e3bc34f'),
                                            new mongodb_1.ObjectId('5e497c1c8b03c9076e3bc3fa'),
                                            new mongodb_1.ObjectId('5e497dba8b03c9076e3bc406'),
                                            new mongodb_1.ObjectId('5e49844b8b03c9076e3bc457'),
                                            new mongodb_1.ObjectId('5e4983048b03c9076e3bc448'),
                                            new mongodb_1.ObjectId('5e4982ca8b03c9076e3bc445'),
                                            new mongodb_1.ObjectId('5e45438763bdee0d8e9571a4'),
                                            new mongodb_1.ObjectId('5e45487b2a1d50579208af61'),
                                            new mongodb_1.ObjectId('5e454ba62a1d50579208af7d'),
                                            new mongodb_1.ObjectId('5e454e662a1d50579208af97'),
                                            new mongodb_1.ObjectId('5e45550163bdee0d8e957273'),
                                            new mongodb_1.ObjectId('5e4554e863bdee0d8e95726c'),
                                            new mongodb_1.ObjectId('5e45506163bdee0d8e95722a'),
                                            new mongodb_1.ObjectId('5e45528763bdee0d8e95724a'),
                                            new mongodb_1.ObjectId('5e45511463bdee0d8e957235'),
                                            new mongodb_1.ObjectId('5e455d592a1d50579208b077'),
                                            new mongodb_1.ObjectId('5e455fa02a1d50579208b080'),
                                            new mongodb_1.ObjectId('5e456a7f2a1d50579208b0f8'),
                                            new mongodb_1.ObjectId('5e457ae72a1d50579208b166'),
                                            new mongodb_1.ObjectId('5e44bb622a1d50579208aa34'),
                                            new mongodb_1.ObjectId('5e458d8d63bdee0d8e957479'),
                                            new mongodb_1.ObjectId('5e459afe63bdee0d8e957504'),
                                            new mongodb_1.ObjectId('5e459b712a1d50579208b2a0'),
                                            new mongodb_1.ObjectId('5e45579263bdee0d8e9572a1'),
                                            new mongodb_1.ObjectId('5e45563b63bdee0d8e95728c'),
                                            new mongodb_1.ObjectId('5e45736d63bdee0d8e9573c5'),
                                            new mongodb_1.ObjectId('5e4579402a1d50579208b161'),
                                            new mongodb_1.ObjectId('5e44a1e22a1d50579208a9d6'),
                                            new mongodb_1.ObjectId('5e448baa2a1d50579208a97d'),
                                            new mongodb_1.ObjectId('5e44d73863bdee0d8e956d9b'),
                                            new mongodb_1.ObjectId('5e453f5a63bdee0d8e957179'),
                                            new mongodb_1.ObjectId('5e44beb92a1d50579208aa55'),
                                            new mongodb_1.ObjectId('5e44c0df2a1d50579208aa58'),
                                            new mongodb_1.ObjectId('5e44c5f32a1d50579208aa7f'),
                                            new mongodb_1.ObjectId('5e44c36b2a1d50579208aa6a'),
                                            new mongodb_1.ObjectId('5e44c2292a1d50579208aa64'),
                                            new mongodb_1.ObjectId('5e4597ed63bdee0d8e9574d7'),
                                            new mongodb_1.ObjectId('5e44c5602a1d50579208aa7c'),
                                            new mongodb_1.ObjectId('5e44d1d063bdee0d8e956d79'),
                                            new mongodb_1.ObjectId('5e45a44463bdee0d8e95755b'),
                                            new mongodb_1.ObjectId('5e45a6ca63bdee0d8e957576'),
                                            new mongodb_1.ObjectId('5e45ad2663bdee0d8e95759f'),
                                            new mongodb_1.ObjectId('5e4456952a1d50579208a82f'),
                                            new mongodb_1.ObjectId('5e44018a2a1d50579208a52f'),
                                            new mongodb_1.ObjectId('5e44627763bdee0d8e956b48'),
                                            new mongodb_1.ObjectId('5e43e8bf2a1d50579208a40f'),
                                            new mongodb_1.ObjectId('5e446cac63bdee0d8e956b89'),
                                            new mongodb_1.ObjectId('5e4470312a1d50579208a8ff'),
                                            new mongodb_1.ObjectId('5e44607563bdee0d8e956b3c'),
                                            new mongodb_1.ObjectId('5e446ec72a1d50579208a8e8'),
                                            new mongodb_1.ObjectId('5e446d3e2a1d50579208a8da'),
                                            new mongodb_1.ObjectId('5e446fc22a1d50579208a8f6'),
                                            new mongodb_1.ObjectId('5e44a11263bdee0d8e956c8b'),
                                            new mongodb_1.ObjectId('5e44ad1763bdee0d8e956ccf'),
                                            new mongodb_1.ObjectId('5e44bdbb63bdee0d8e956d1c'),
                                            new mongodb_1.ObjectId('5e44c2ca63bdee0d8e956d37'),
                                            new mongodb_1.ObjectId('5e44c18d63bdee0d8e956d31'),
                                            new mongodb_1.ObjectId('5e44c18a2a1d50579208aa5b'),
                                            new mongodb_1.ObjectId('5e44c87e63bdee0d8e956d43'),
                                            new mongodb_1.ObjectId('5e44c8832a1d50579208aa8b'),
                                            new mongodb_1.ObjectId('5e44a3c663bdee0d8e956c99'),
                                            new mongodb_1.ObjectId('5e44a6042a1d50579208a9f1'),
                                            new mongodb_1.ObjectId('5e44a89063bdee0d8e956cb1'),
                                            new mongodb_1.ObjectId('5e44a8972a1d50579208aa02'),
                                            new mongodb_1.ObjectId('5e44a48b2a1d50579208a9e8'),
                                            new mongodb_1.ObjectId('5e44a89363bdee0d8e956cb4'),
                                            new mongodb_1.ObjectId('5e44ac6b2a1d50579208aa08'),
                                            new mongodb_1.ObjectId('5e44a3732a1d50579208a9e2'),
                                            new mongodb_1.ObjectId('5e44abdd63bdee0d8e956cc6'),
                                            new mongodb_1.ObjectId('5e44abec63bdee0d8e956cc9'),
                                            new mongodb_1.ObjectId('5e44be0363bdee0d8e956d22'),
                                            new mongodb_1.ObjectId('5e44bdbd63bdee0d8e956d1f'),
                                            new mongodb_1.ObjectId('5e44830963bdee0d8e956c0c'),
                                            new mongodb_1.ObjectId('5e4492562a1d50579208a998'),
                                            new mongodb_1.ObjectId('5e44995b63bdee0d8e956c65'),
                                            new mongodb_1.ObjectId('5e449a7d2a1d50579208a9b0'),
                                            new mongodb_1.ObjectId('5e449cda63bdee0d8e956c71'),
                                            new mongodb_1.ObjectId('5e450b0a2a1d50579208ac98'),
                                            new mongodb_1.ObjectId('5e3a776aa8e15c6568f309f4'),
                                            new mongodb_1.ObjectId('5e3edee70afc1f04e1f00ccd'),
                                            new mongodb_1.ObjectId('5e451c6c63bdee0d8e956fee'),
                                            new mongodb_1.ObjectId('5e4506182a1d50579208ac6d'),
                                            new mongodb_1.ObjectId('5e450d942a1d50579208acb4'),
                                            new mongodb_1.ObjectId('5e44ff2c2a1d50579208ac18'),
                                            new mongodb_1.ObjectId('5e44ff282a1d50579208ac15'),
                                            new mongodb_1.ObjectId('5e45316c63bdee0d8e9570ce'),
                                            new mongodb_1.ObjectId('5e4533662a1d50579208ae86'),
                                            new mongodb_1.ObjectId('5e453aae63bdee0d8e95714f'),
                                            new mongodb_1.ObjectId('5e451f9163bdee0d8e957020'),
                                            new mongodb_1.ObjectId('5e45221b2a1d50579208adc1'),
                                            new mongodb_1.ObjectId('5e4520902a1d50579208adb5'),
                                            new mongodb_1.ObjectId('5e451e7e63bdee0d8e957013'),
                                            new mongodb_1.ObjectId('5e451de02a1d50579208ad8f'),
                                            new mongodb_1.ObjectId('5e451e132a1d50579208ad95'),
                                            new mongodb_1.ObjectId('5e451e172a1d50579208ad98'),
                                            new mongodb_1.ObjectId('5e451f012a1d50579208ada3'),
                                            new mongodb_1.ObjectId('5e451e7a63bdee0d8e957010'),
                                            new mongodb_1.ObjectId('5e451f8e2a1d50579208adaa'),
                                            new mongodb_1.ObjectId('5e452cf263bdee0d8e9570a7'),
                                            new mongodb_1.ObjectId('5e452dbf2a1d50579208ae4f'),
                                            new mongodb_1.ObjectId('5e43f4a22a1d50579208a4a8'),
                                            new mongodb_1.ObjectId('5e4533d763bdee0d8e9570f4'),
                                            new mongodb_1.ObjectId('5e4538002a1d50579208aec6'),
                                            new mongodb_1.ObjectId('5e455b592a1d50579208b060'),
                                            new mongodb_1.ObjectId('5e455b4563bdee0d8e9572e6'),
                                            new mongodb_1.ObjectId('5e45673f63bdee0d8e957350'),
                                            new mongodb_1.ObjectId('5e45673e2a1d50579208b0ef'),
                                            new mongodb_1.ObjectId('5e4568fe63bdee0d8e957369'),
                                            new mongodb_1.ObjectId('5e45911c63bdee0d8e9574ac'),
                                            new mongodb_1.ObjectId('5e1656ad38cdec6804663be3'),
                                            new mongodb_1.ObjectId('5e45d30a2a1d50579208b429'),
                                            new mongodb_1.ObjectId('5e45d2042a1d50579208b426'),
                                            new mongodb_1.ObjectId('5e45d40d63bdee0d8e9576c6'),
                                            new mongodb_1.ObjectId('5e45d31d2a1d50579208b42c'),
                                            new mongodb_1.ObjectId('5e45d39d63bdee0d8e9576c3'),
                                            new mongodb_1.ObjectId('5e45d4b22a1d50579208b432'),
                                            new mongodb_1.ObjectId('5e45d4fa2a1d50579208b438'),
                                            new mongodb_1.ObjectId('5e45d59763bdee0d8e9576d2'),
                                            new mongodb_1.ObjectId('5e45da1e2a1d50579208b44d'),
                                            new mongodb_1.ObjectId('5e45e1032a1d50579208b470'),
                                            new mongodb_1.ObjectId('5e45e5ce63bdee0d8e957701'),
                                            new mongodb_1.ObjectId('5e45efd263bdee0d8e957720'),
                                            new mongodb_1.ObjectId('5e45f0322a1d50579208b49a'),
                                            new mongodb_1.ObjectId('5e45ec812a1d50579208b491'),
                                            new mongodb_1.ObjectId('5e45cbcb63bdee0d8e95767c'),
                                            new mongodb_1.ObjectId('5e46363a63bdee0d8e95785c'),
                                            new mongodb_1.ObjectId('5e45b98e63bdee0d8e95761a'),
                                            new mongodb_1.ObjectId('5e454b4763bdee0d8e9571fb'),
                                            new mongodb_1.ObjectId('5e43fd3b2a1d50579208a50b'),
                                            new mongodb_1.ObjectId('5e45ae8363bdee0d8e9575a8'),
                                            new mongodb_1.ObjectId('5e45c48b2a1d50579208b3d4'),
                                            new mongodb_1.ObjectId('5e45c50a2a1d50579208b3d7'),
                                            new mongodb_1.ObjectId('5e45c52963bdee0d8e957653'),
                                            new mongodb_1.ObjectId('5e45fe6c63bdee0d8e957768'),
                                            new mongodb_1.ObjectId('5e44373363bdee0d8e9569e4'),
                                            new mongodb_1.ObjectId('5e44786363bdee0d8e956bba'),
                                            new mongodb_1.ObjectId('5e44390563bdee0d8e9569f7'),
                                            new mongodb_1.ObjectId('5e44380863bdee0d8e9569f0'),
                                            new mongodb_1.ObjectId('5e45cb642a1d50579208b408'),
                                            new mongodb_1.ObjectId('5e45c90763bdee0d8e957665'),
                                            new mongodb_1.ObjectId('5e4438652a1d50579208a742'),
                                            new mongodb_1.ObjectId('5e44365e63bdee0d8e9569da'),
                                            new mongodb_1.ObjectId('5e4437a563bdee0d8e9569ed'),
                                            new mongodb_1.ObjectId('5e45cbcd63bdee0d8e95767f'),
                                            new mongodb_1.ObjectId('5e45cec763bdee0d8e95769f'),
                                            new mongodb_1.ObjectId('5e45cf6063bdee0d8e9576a5'),
                                            new mongodb_1.ObjectId('5e458b3b2a1d50579208b1d9'),
                                            new mongodb_1.ObjectId('5e458b3663bdee0d8e95746a'),
                                            new mongodb_1.ObjectId('5e45c9d763bdee0d8e957670'),
                                            new mongodb_1.ObjectId('5e458e9363bdee0d8e95748e'),
                                            new mongodb_1.ObjectId('5e45c9a82a1d50579208b3fc'),
                                            new mongodb_1.ObjectId('5e45cd762a1d50579208b414'),
                                            new mongodb_1.ObjectId('5e44ae0b2a1d50579208aa11'),
                                            new mongodb_1.ObjectId('5e45cd7863bdee0d8e957694'),
                                            new mongodb_1.ObjectId('5e45cd8a63bdee0d8e957697'),
                                            new mongodb_1.ObjectId('5e45831f2a1d50579208b198'),
                                            new mongodb_1.ObjectId('5e462afe63bdee0d8e9577fd'),
                                            new mongodb_1.ObjectId('5e45fe6a63bdee0d8e957765'),
                                            new mongodb_1.ObjectId('5e4660d72a1d50579208b745'),
                                            new mongodb_1.ObjectId('5e465e7e2a1d50579208b72e'),
                                            new mongodb_1.ObjectId('5e46683063bdee0d8e957a24'),
                                            new mongodb_1.ObjectId('5e466d3e63bdee0d8e957a4d'),
                                            new mongodb_1.ObjectId('5e466ea263bdee0d8e957a55'),
                                            new mongodb_1.ObjectId('5e46754f2a1d50579208b82e'),
                                            new mongodb_1.ObjectId('5e46cc1e8b03c9076e3bb1e8'),
                                            new mongodb_1.ObjectId('5e46d34e8b03c9076e3bb219'),
                                            new mongodb_1.ObjectId('5e468d202a1d50579208b913'),
                                            new mongodb_1.ObjectId('5e4688082a1d50579208b8d5'),
                                            new mongodb_1.ObjectId('5e45ddfb2a1d50579208b455'),
                                            new mongodb_1.ObjectId('5e46b3a88b03c9076e3bb11f'),
                                            new mongodb_1.ObjectId('5e46bbce8b03c9076e3bb160'),
                                            new mongodb_1.ObjectId('5e46f3eb8b03c9076e3bb311'),
                                            new mongodb_1.ObjectId('5e46f3f08f9df23ae3787f42'),
                                            new mongodb_1.ObjectId('5e46f4ec8b03c9076e3bb323'),
                                            new mongodb_1.ObjectId('5e46f2b88f9df23ae3787f14'),
                                            new mongodb_1.ObjectId('5e469688d006683994c58e48'),
                                            new mongodb_1.ObjectId('5e4699f68f9df23ae3787bfa'),
                                            new mongodb_1.ObjectId('5e469a548f9df23ae3787bfd'),
                                            new mongodb_1.ObjectId('5e469b948b03c9076e3bafbb'),
                                            new mongodb_1.ObjectId('5e46a2e78f9df23ae3787c50'),
                                            new mongodb_1.ObjectId('5e46a63b8f9df23ae3787c5e'),
                                            new mongodb_1.ObjectId('5e46bb548f9df23ae3787d8d'),
                                            new mongodb_1.ObjectId('5e46ba1b8b03c9076e3bb15d'),
                                            new mongodb_1.ObjectId('5e46d37c8f9df23ae3787e35'),
                                            new mongodb_1.ObjectId('5e46aff58f9df23ae3787d2d'),
                                            new mongodb_1.ObjectId('5e46df8b8f9df23ae3787e90'),
                                            new mongodb_1.ObjectId('5e45a13763bdee0d8e957533'),
                                            new mongodb_1.ObjectId('5e460d7563bdee0d8e957790'),
                                            new mongodb_1.ObjectId('5e46e6d08b03c9076e3bb2ac'),
                                            new mongodb_1.ObjectId('5e46e9ce8f9df23ae3787eca'),
                                            new mongodb_1.ObjectId('5e46eb028b03c9076e3bb2cd'),
                                            new mongodb_1.ObjectId('5e46db148b03c9076e3bb262'),
                                            new mongodb_1.ObjectId('5e46ee968b03c9076e3bb2d5'),
                                            new mongodb_1.ObjectId('5e46ffa78b03c9076e3bb3ec'),
                                            new mongodb_1.ObjectId('5e4707c78f9df23ae378800f'),
                                            new mongodb_1.ObjectId('5e4623b82a1d50579208b538'),
                                            new mongodb_1.ObjectId('5e4708348f9df23ae3788012'),
                                            new mongodb_1.ObjectId('5e470aec8f9df23ae378802f'),
                                            new mongodb_1.ObjectId('5e47108a8b03c9076e3bb451'),
                                            new mongodb_1.ObjectId('5e3b3a7fc8a0e26490867f05'),
                                            new mongodb_1.ObjectId('5e4717a78f9df23ae3788060'),
                                            new mongodb_1.ObjectId('5e4720c78b03c9076e3bb4a8'),
                                            new mongodb_1.ObjectId('5e4727898f9df23ae37880a8'),
                                            new mongodb_1.ObjectId('5e473e658f9df23ae37880f7'),
                                            new mongodb_1.ObjectId('5e475c7f8f9df23ae378814b'),
                                            new mongodb_1.ObjectId('5e4776d28b03c9076e3bb58e'),
                                            new mongodb_1.ObjectId('5e4708338b03c9076e3bb421'),
                                            new mongodb_1.ObjectId('5e4779918b03c9076e3bb5a0'),
                                            new mongodb_1.ObjectId('5e47865e8f9df23ae37881cf'),
                                            new mongodb_1.ObjectId('5e46df6e8f9df23ae3787e8a'),
                                            new mongodb_1.ObjectId('5e470c4f8b03c9076e3bb43f'),
                                            new mongodb_1.ObjectId('5e4713168b03c9076e3bb460'),
                                            new mongodb_1.ObjectId('5e36342ba8e15c6568f2ce02'),
                                            new mongodb_1.ObjectId('5e47117f8f9df23ae378804d'),
                                            new mongodb_1.ObjectId('5e4723d48b03c9076e3bb4b5'),
                                            new mongodb_1.ObjectId('5e460d0b2a1d50579208b4e9'),
                                            new mongodb_1.ObjectId('5e47568a8b03c9076e3bb546'),
                                            new mongodb_1.ObjectId('5e475a6e8f9df23ae378813c'),
                                            new mongodb_1.ObjectId('5e475a738f9df23ae378813f'),
                                            new mongodb_1.ObjectId('5e4a09228b03c9076e3bc816'),
                                            new mongodb_1.ObjectId('5e4a0ecf8b03c9076e3bc838'),
                                            new mongodb_1.ObjectId('5e4a0ed18b03c9076e3bc83b'),
                                            new mongodb_1.ObjectId('5e495aa88b03c9076e3bc2e9'),
                                            new mongodb_1.ObjectId('5e4a137a8b03c9076e3bc85e'),
                                            new mongodb_1.ObjectId('5e4a13818b03c9076e3bc861'),
                                            new mongodb_1.ObjectId('5e4a15648b03c9076e3bc87e'),
                                            new mongodb_1.ObjectId('5e4a1a3b8b03c9076e3bc8ae'),
                                            new mongodb_1.ObjectId('5e49a7b08b03c9076e3bc5aa'),
                                            new mongodb_1.ObjectId('5e47e2a18f9df23ae378844e'),
                                            new mongodb_1.ObjectId('5e49bb7b8b03c9076e3bc631'),
                                            new mongodb_1.ObjectId('5e4a27e18b03c9076e3bc946'),
                                            new mongodb_1.ObjectId('5e4723d08b03c9076e3bb4b2'),
                                            new mongodb_1.ObjectId('5e4999d98b03c9076e3bc4f5'),
                                            new mongodb_1.ObjectId('5e4a37d58b03c9076e3bca61'),
                                            new mongodb_1.ObjectId('5e4a3ccf8b03c9076e3bcaba'),
                                            new mongodb_1.ObjectId('5e4a47fe8b03c9076e3bcb7d'),
                                            new mongodb_1.ObjectId('5e4a5b008b03c9076e3bccc2'),
                                            new mongodb_1.ObjectId('5e49d9f38b03c9076e3bc6f1'),
                                            new mongodb_1.ObjectId('5e4810bb8f9df23ae378859b'),
                                            new mongodb_1.ObjectId('5e476bb58b03c9076e3bb570'),
                                            new mongodb_1.ObjectId('5e4a12748b03c9076e3bc855'),
                                            new mongodb_1.ObjectId('5e4a126e8b03c9076e3bc852'),
                                            new mongodb_1.ObjectId('5e49816e8b03c9076e3bc43c'),
                                            new mongodb_1.ObjectId('5e4931328b03c9076e3bc18d'),
                                            new mongodb_1.ObjectId('5e4a167c8b03c9076e3bc88a'),
                                            new mongodb_1.ObjectId('5e495b9d8b03c9076e3bc2f2'),
                                            new mongodb_1.ObjectId('5e498e438b03c9076e3bc490'),
                                            new mongodb_1.ObjectId('5e4804248f9df23ae3788537'),
                                            new mongodb_1.ObjectId('5e4a37fa8b03c9076e3bca67'),
                                            new mongodb_1.ObjectId('5e4a457f8b03c9076e3bcb4b'),
                                            new mongodb_1.ObjectId('5e4a45818b03c9076e3bcb4e'),
                                            new mongodb_1.ObjectId('5de20db95b51ba6500d1fedd'),
                                            new mongodb_1.ObjectId('5e4a87fa8b03c9076e3bd09b'),
                                            new mongodb_1.ObjectId('5e4a82db8b03c9076e3bd024'),
                                            new mongodb_1.ObjectId('5e4acee18b03c9076e3bd517'),
                                            new mongodb_1.ObjectId('5e4acee48b03c9076e3bd51a'),
                                            new mongodb_1.ObjectId('5e4a172e8b03c9076e3bc896'),
                                            new mongodb_1.ObjectId('5e4ad2628b03c9076e3bd547'),
                                            new mongodb_1.ObjectId('5e4ad1a38b03c9076e3bd541'),
                                            new mongodb_1.ObjectId('5e4acb458b03c9076e3bd4c8'),
                                            new mongodb_1.ObjectId('5e4acb498b03c9076e3bd4cb'),
                                            new mongodb_1.ObjectId('5e4ad2698b03c9076e3bd54a'),
                                            new mongodb_1.ObjectId('5e4ae0c38b03c9076e3bd622'),
                                            new mongodb_1.ObjectId('5e4ae0fd8b03c9076e3bd625'),
                                            new mongodb_1.ObjectId('5e4aedb88b03c9076e3bd6f4'),
                                            new mongodb_1.ObjectId('5e4aedbd8b03c9076e3bd6f7'),
                                            new mongodb_1.ObjectId('5e4af1118b03c9076e3bd72d'),
                                            new mongodb_1.ObjectId('5e4af1098b03c9076e3bd72a'),
                                            new mongodb_1.ObjectId('5e4af6be8b03c9076e3bd777'),
                                            new mongodb_1.ObjectId('5e4ae1e18b03c9076e3bd63a'),
                                            new mongodb_1.ObjectId('5e4ae2768b03c9076e3bd643'),
                                            new mongodb_1.ObjectId('5e4ae53c8b03c9076e3bd661'),
                                            new mongodb_1.ObjectId('5e4ae9ce8b03c9076e3bd6af'),
                                            new mongodb_1.ObjectId('5e4af36e8b03c9076e3bd753'),
                                            new mongodb_1.ObjectId('5e4ae2a68b03c9076e3bd64c'),
                                            new mongodb_1.ObjectId('5e4af45c8b03c9076e3bd765'),
                                            new mongodb_1.ObjectId('5e4a16df8b03c9076e3bc88e'),
                                            new mongodb_1.ObjectId('5e4a19ad8b03c9076e3bc8aa'),
                                            new mongodb_1.ObjectId('5e4a0e088b03c9076e3bc82f'),
                                            new mongodb_1.ObjectId('5e4ad7d88b03c9076e3bd59d'),
                                            new mongodb_1.ObjectId('5e4ad94b8b03c9076e3bd5b2'),
                                            new mongodb_1.ObjectId('5e4ad9058b03c9076e3bd5ac'),
                                            new mongodb_1.ObjectId('5e4ad9088b03c9076e3bd5af'),
                                            new mongodb_1.ObjectId('5e4b1e748b03c9076e3bd92c'),
                                            new mongodb_1.ObjectId('5e4b24ef8b03c9076e3bd985'),
                                            new mongodb_1.ObjectId('5e4b251d8b03c9076e3bd98b'),
                                            new mongodb_1.ObjectId('5e4b252f8b03c9076e3bd98e'),
                                            new mongodb_1.ObjectId('5e4b25098b03c9076e3bd988'),
                                            new mongodb_1.ObjectId('5e4b25ef8b03c9076e3bd9a6'),
                                            new mongodb_1.ObjectId('5e4b25df8b03c9076e3bd9a3'),
                                            new mongodb_1.ObjectId('5e4b25ca8b03c9076e3bd9a0'),
                                            new mongodb_1.ObjectId('5e4b255e8b03c9076e3bd994'),
                                            new mongodb_1.ObjectId('5e4b25918b03c9076e3bd99d'),
                                            new mongodb_1.ObjectId('5e4b25728b03c9076e3bd99a'),
                                            new mongodb_1.ObjectId('5e4b25fd8b03c9076e3bd9a9'),
                                            new mongodb_1.ObjectId('5e4b254d8b03c9076e3bd991'),
                                            new mongodb_1.ObjectId('5e4b25708b03c9076e3bd997'),
                                            new mongodb_1.ObjectId('5e4b26df8b03c9076e3bd9d6'),
                                            new mongodb_1.ObjectId('5e4b26ca8b03c9076e3bd9d3'),
                                            new mongodb_1.ObjectId('5e4b268f8b03c9076e3bd9c7'),
                                            new mongodb_1.ObjectId('5e4b26998b03c9076e3bd9ca'),
                                            new mongodb_1.ObjectId('5e4b26be8b03c9076e3bd9d0'),
                                            new mongodb_1.ObjectId('5e4b26ad8b03c9076e3bd9cd'),
                                            new mongodb_1.ObjectId('5e4b500c8b03c9076e3bdb1c'),
                                            new mongodb_1.ObjectId('5e4b500e8b03c9076e3bdb1f'),
                                            new mongodb_1.ObjectId('5e4ae9818b03c9076e3bd6a6'),
                                            new mongodb_1.ObjectId('5e4ae8228b03c9076e3bd68b'),
                                            new mongodb_1.ObjectId('5e4ae8e08b03c9076e3bd698'),
                                            new mongodb_1.ObjectId('5e4b0a5c8b03c9076e3bd855'),
                                            new mongodb_1.ObjectId('5e4b104f8b03c9076e3bd899'),
                                            new mongodb_1.ObjectId('5e4b15fc8b03c9076e3bd8c8'),
                                            new mongodb_1.ObjectId('5e4b1cdf8b03c9076e3bd912'),
                                            new mongodb_1.ObjectId('5e4b1ef48b03c9076e3bd935'),
                                            new mongodb_1.ObjectId('5e4b1f0e8b03c9076e3bd93b'),
                                            new mongodb_1.ObjectId('5e4b1eac8b03c9076e3bd932'),
                                            new mongodb_1.ObjectId('5e4b1f0c8b03c9076e3bd938'),
                                            new mongodb_1.ObjectId('5e4b265d8b03c9076e3bd9bb'),
                                            new mongodb_1.ObjectId('5e4b26418b03c9076e3bd9b8'),
                                            new mongodb_1.ObjectId('5e4b262b8b03c9076e3bd9b2'),
                                            new mongodb_1.ObjectId('5e4b26738b03c9076e3bd9be'),
                                            new mongodb_1.ObjectId('5e4b267d8b03c9076e3bd9c1'),
                                            new mongodb_1.ObjectId('5e4b26818b03c9076e3bd9c4'),
                                            new mongodb_1.ObjectId('5e4b260b8b03c9076e3bd9ac'),
                                            new mongodb_1.ObjectId('5e4b26178b03c9076e3bd9af'),
                                            new mongodb_1.ObjectId('5e4a976c8b03c9076e3bd1a6'),
                                            new mongodb_1.ObjectId('5e4b3d148b03c9076e3bda8d'),
                                            new mongodb_1.ObjectId('5e4b55418b03c9076e3bdb43'),
                                            new mongodb_1.ObjectId('5e4b5a4f8b03c9076e3bdb7d'),
                                            new mongodb_1.ObjectId('5e4b5ccb8b03c9076e3bdb8e'),
                                            new mongodb_1.ObjectId('5e4b60048b03c9076e3bdbcb'),
                                            new mongodb_1.ObjectId('5e4b5fd98b03c9076e3bdbc2'),
                                            new mongodb_1.ObjectId('5e4b5fd78b03c9076e3bdbbf'),
                                            new mongodb_1.ObjectId('5e4b5ffe8b03c9076e3bdbc5'),
                                            new mongodb_1.ObjectId('5e46412163bdee0d8e9578c8'),
                                            new mongodb_1.ObjectId('5e4701088b03c9076e3bb3f5'),
                                            new mongodb_1.ObjectId('5e1a252db51f7a4bf28d4632'),
                                            new mongodb_1.ObjectId('5e1a244e3d9a4d2a65c27c7c'),
                                            new mongodb_1.ObjectId('5e1a27823d9a4d2a65c27c9d'),
                                            new mongodb_1.ObjectId('5e477c858f9df23ae37881b2'),
                                            new mongodb_1.ObjectId('5e477d168b03c9076e3bb5a6'),
                                            new mongodb_1.ObjectId('5e479ce28f9df23ae3788262'),
                                            new mongodb_1.ObjectId('5e47a8e48f9df23ae37882ac'),
                                            new mongodb_1.ObjectId('5e47b2198b03c9076e3bb6dd'),
                                            new mongodb_1.ObjectId('5e47b3098b03c9076e3bb6e6'),
                                            new mongodb_1.ObjectId('5e47c3448b03c9076e3bb75a'),
                                            new mongodb_1.ObjectId('5e47cc7a8f9df23ae3788393'),
                                            new mongodb_1.ObjectId('5e47cf638f9df23ae37883b9'),
                                            new mongodb_1.ObjectId('5e47d6258f9df23ae37883f7'),
                                            new mongodb_1.ObjectId('5e47ddea8f9df23ae3788436'),
                                            new mongodb_1.ObjectId('5e47e0118f9df23ae3788442'),
                                            new mongodb_1.ObjectId('5e47e3dc8b03c9076e3bb834'),
                                            new mongodb_1.ObjectId('5e47f57d8b03c9076e3bb8a9'),
                                            new mongodb_1.ObjectId('5e47f61a8b03c9076e3bb8b2'),
                                            new mongodb_1.ObjectId('5e47f9798f9df23ae37884de'),
                                            new mongodb_1.ObjectId('5e4745c88b03c9076e3bb528'),
                                            new mongodb_1.ObjectId('5e47ff648b03c9076e3bb8e0'),
                                            new mongodb_1.ObjectId('5e47ff6a8b03c9076e3bb8e3'),
                                            new mongodb_1.ObjectId('5e4803ec8f9df23ae3788534'),
                                            new mongodb_1.ObjectId('5e4806988b03c9076e3bb910'),
                                            new mongodb_1.ObjectId('5e474c918b03c9076e3bb531'),
                                            new mongodb_1.ObjectId('5e4b6cb88b03c9076e3bdc5b'),
                                            new mongodb_1.ObjectId('5e4b7be58b03c9076e3bdd3b'),
                                            new mongodb_1.ObjectId('5e4a88e48b03c9076e3bd0b1'),
                                            new mongodb_1.ObjectId('5e4b950f8b03c9076e3bdee8'),
                                            new mongodb_1.ObjectId('5e4b944a8b03c9076e3bdecc'),
                                            new mongodb_1.ObjectId('5e4b9fea18529c7a7a88095f'),
                                            new mongodb_1.ObjectId('5e4ba14b29f0360bdd60d0fc'),
                                            new mongodb_1.ObjectId('5e4ba44c18529c7a7a88098c'),
                                            new mongodb_1.ObjectId('5e4ba42918529c7a7a880989'),
                                            new mongodb_1.ObjectId('5e4baab418529c7a7a8809d7'),
                                            new mongodb_1.ObjectId('5e4babef18529c7a7a8809e9'),
                                            new mongodb_1.ObjectId('5e4bac4a18529c7a7a8809ef'),
                                            new mongodb_1.ObjectId('5e4bae2118529c7a7a8809fb'),
                                            new mongodb_1.ObjectId('5e4bae3018529c7a7a8809fe'),
                                            new mongodb_1.ObjectId('5e4bb6a129f0360bdd60d1ac'),
                                            new mongodb_1.ObjectId('5e4bbd2729f0360bdd60d1f8'),
                                            new mongodb_1.ObjectId('5e4bc12729f0360bdd60d227'),
                                            new mongodb_1.ObjectId('5e4bc86a18529c7a7a880b36'),
                                            new mongodb_1.ObjectId('5e4bcf3218529c7a7a880b7f'),
                                            new mongodb_1.ObjectId('5e4bd4ad18529c7a7a880bb5'),
                                            new mongodb_1.ObjectId('5e4bd5d318529c7a7a880bcc'),
                                            new mongodb_1.ObjectId('5e4bd5ce29f0360bdd60d314'),
                                            new mongodb_1.ObjectId('5e4bd7bb29f0360bdd60d32c'),
                                            new mongodb_1.ObjectId('5e4bd7be29f0360bdd60d32f'),
                                            new mongodb_1.ObjectId('5e4bd7b629f0360bdd60d329'),
                                            new mongodb_1.ObjectId('5e4be72b29f0360bdd60d3b6'),
                                            new mongodb_1.ObjectId('5e4bead629f0360bdd60d3d6'),
                                            new mongodb_1.ObjectId('5e4bf19429f0360bdd60d425'),
                                            new mongodb_1.ObjectId('5e4bf1ab18529c7a7a880cd1'),
                                            new mongodb_1.ObjectId('5e4bf40829f0360bdd60d44c'),
                                            new mongodb_1.ObjectId('5e4bf40929f0360bdd60d44f'),
                                            new mongodb_1.ObjectId('5e4bf90f18529c7a7a880d22'),
                                            new mongodb_1.ObjectId('5e4bf95a18529c7a7a880d25'),
                                            new mongodb_1.ObjectId('5e4c01a529f0360bdd60d4d7'),
                                            new mongodb_1.ObjectId('5e4c01a218529c7a7a880d7d'),
                                            new mongodb_1.ObjectId('5e4b5d0a8b03c9076e3bdb95'),
                                            new mongodb_1.ObjectId('5e4b75978b03c9076e3bdce0'),
                                            new mongodb_1.ObjectId('5e4aed3f8b03c9076e3bd6e5'),
                                            new mongodb_1.ObjectId('5e4b76d38b03c9076e3bdcf5'),
                                            new mongodb_1.ObjectId('5e4b765f8b03c9076e3bdceb'),
                                            new mongodb_1.ObjectId('5e4b7b0c8b03c9076e3bdd34'),
                                            new mongodb_1.ObjectId('5e4b7fe88b03c9076e3bdd9a'),
                                            new mongodb_1.ObjectId('5e4b800d8b03c9076e3bdd9d'),
                                            new mongodb_1.ObjectId('5e4b83a08b03c9076e3bdde8'),
                                            new mongodb_1.ObjectId('5e4b91b08b03c9076e3bdea8'),
                                            new mongodb_1.ObjectId('5e4b98428b03c9076e3bdf29'),
                                            new mongodb_1.ObjectId('5e4ba9fd18529c7a7a8809d0'),
                                            new mongodb_1.ObjectId('5e4bab9218529c7a7a8809e0'),
                                            new mongodb_1.ObjectId('5e4baf0718529c7a7a880a0a'),
                                            new mongodb_1.ObjectId('5e4bb6d129f0360bdd60d1b3'),
                                            new mongodb_1.ObjectId('5e4bb6db29f0360bdd60d1b7'),
                                            new mongodb_1.ObjectId('5e4bbdbd29f0360bdd60d201'),
                                            new mongodb_1.ObjectId('5e4bc81929f0360bdd60d282'),
                                            new mongodb_1.ObjectId('5e4bd54529f0360bdd60d310'),
                                            new mongodb_1.ObjectId('5e4bd7b129f0360bdd60d326'),
                                            new mongodb_1.ObjectId('5e4beb4e29f0360bdd60d3e9'),
                                            new mongodb_1.ObjectId('5e4bebda18529c7a7a880c9e'),
                                            new mongodb_1.ObjectId('5e4bec9d29f0360bdd60d3f2'),
                                            new mongodb_1.ObjectId('5e4bfacf29f0360bdd60d49a'),
                                            new mongodb_1.ObjectId('5e4bfd9218529c7a7a880d55'),
                                            new mongodb_1.ObjectId('5e48287f8f9df23ae3788625'),
                                            new mongodb_1.ObjectId('5e481a838b03c9076e3bb98c'),
                                            new mongodb_1.ObjectId('5e481b7d8b03c9076e3bb98f'),
                                            new mongodb_1.ObjectId('5e4831338b03c9076e3bba31'),
                                            new mongodb_1.ObjectId('5e4831078b03c9076e3bba2b'),
                                            new mongodb_1.ObjectId('5e4833438b03c9076e3bba62'),
                                            new mongodb_1.ObjectId('5e483d668b03c9076e3bbace'),
                                            new mongodb_1.ObjectId('5e483d5e8b03c9076e3bbac5'),
                                            new mongodb_1.ObjectId('5e483d618b03c9076e3bbac8'),
                                            new mongodb_1.ObjectId('5e484cb38b03c9076e3bbb58'),
                                            new mongodb_1.ObjectId('5e4866f18b03c9076e3bbc7e'),
                                            new mongodb_1.ObjectId('5e486eb08b03c9076e3bbcb1'),
                                            new mongodb_1.ObjectId('5e487d7d8b03c9076e3bbcd5'),
                                            new mongodb_1.ObjectId('5e4881c18b03c9076e3bbcd8'),
                                            new mongodb_1.ObjectId('5e48a4618b03c9076e3bbd3d'),
                                            new mongodb_1.ObjectId('5e48a75d8b03c9076e3bbd46'),
                                            new mongodb_1.ObjectId('5e48d9168b03c9076e3bbe02'),
                                            new mongodb_1.ObjectId('5e48ee498b03c9076e3bbee9'),
                                            new mongodb_1.ObjectId('5e4917f88b03c9076e3bc06b'),
                                            new mongodb_1.ObjectId('5e492c968b03c9076e3bc134'),
                                            new mongodb_1.ObjectId('5e4965458b03c9076e3bc346'),
                                            new mongodb_1.ObjectId('5e498e458b03c9076e3bc493'),
                                            new mongodb_1.ObjectId('5e499b628b03c9076e3bc504'),
                                            new mongodb_1.ObjectId('5e488b558b03c9076e3bbcec'),
                                            new mongodb_1.ObjectId('5e488b4f8b03c9076e3bbce9'),
                                            new mongodb_1.ObjectId('5e499d178b03c9076e3bc513'),
                                            new mongodb_1.ObjectId('5e499f378b03c9076e3bc525'),
                                            new mongodb_1.ObjectId('5e484f4b8b03c9076e3bbb73'),
                                            new mongodb_1.ObjectId('5e49a6968b03c9076e3bc598'),
                                            new mongodb_1.ObjectId('5e48b0d18b03c9076e3bbd59'),
                                            new mongodb_1.ObjectId('5e48b1e68b03c9076e3bbd5e'),
                                            new mongodb_1.ObjectId('5e492ea58b03c9076e3bc150'),
                                            new mongodb_1.ObjectId('5e4930098b03c9076e3bc175'),
                                            new mongodb_1.ObjectId('5e492f1e8b03c9076e3bc15d'),
                                            new mongodb_1.ObjectId('5e492f628b03c9076e3bc160'),
                                            new mongodb_1.ObjectId('5e492fcf8b03c9076e3bc16f'),
                                            new mongodb_1.ObjectId('5e492e338b03c9076e3bc14d'),
                                            new mongodb_1.ObjectId('5e49c9728b03c9076e3bc685'),
                                            new mongodb_1.ObjectId('5e496c698b03c9076e3bc38b'),
                                            new mongodb_1.ObjectId('5e49a7b28b03c9076e3bc5ad'),
                                            new mongodb_1.ObjectId('5e495bfc8b03c9076e3bc2f5'),
                                            new mongodb_1.ObjectId('5e486ba68b03c9076e3bbc99'),
                                            new mongodb_1.ObjectId('5e485ddb8b03c9076e3bbc1b'),
                                            new mongodb_1.ObjectId('5e49ab028b03c9076e3bc5c8'),
                                            new mongodb_1.ObjectId('5e49b43d8b03c9076e3bc60a'),
                                            new mongodb_1.ObjectId('5e49aab68b03c9076e3bc5c5'),
                                            new mongodb_1.ObjectId('5e497f0f8b03c9076e3bc425'),
                                            new mongodb_1.ObjectId('5e498e8a8b03c9076e3bc49c'),
                                            new mongodb_1.ObjectId('5e488a638b03c9076e3bbce4'),
                                            new mongodb_1.ObjectId('5e49858b8b03c9076e3bc466'),
                                            new mongodb_1.ObjectId('5e49be288b03c9076e3bc64c'),
                                            new mongodb_1.ObjectId('5e49c28e8b03c9076e3bc65e'),
                                            new mongodb_1.ObjectId('5e49c3fd8b03c9076e3bc66d'),
                                            new mongodb_1.ObjectId('5e48a3608b03c9076e3bbd37'),
                                            new mongodb_1.ObjectId('5e4a6a768b03c9076e3bce0c'),
                                            new mongodb_1.ObjectId('5e4a6afb8b03c9076e3bce21'),
                                            new mongodb_1.ObjectId('5e4a6a3e8b03c9076e3bce05'),
                                            new mongodb_1.ObjectId('5e4a7f948b03c9076e3bcfc5'),
                                            new mongodb_1.ObjectId('5e4a6bcc8b03c9076e3bce41'),
                                            new mongodb_1.ObjectId('5e4a80158b03c9076e3bcfcb'),
                                            new mongodb_1.ObjectId('5e4a81858b03c9076e3bd007'),
                                            new mongodb_1.ObjectId('5e4a7a398b03c9076e3bcf4f'),
                                            new mongodb_1.ObjectId('5e4a7b7c8b03c9076e3bcf67'),
                                            new mongodb_1.ObjectId('5e4a867a8b03c9076e3bd061'),
                                            new mongodb_1.ObjectId('5e4a87dc8b03c9076e3bd08d'),
                                            new mongodb_1.ObjectId('5e4a880a8b03c9076e3bd09e'),
                                            new mongodb_1.ObjectId('5e4a983f8b03c9076e3bd1ca'),
                                            new mongodb_1.ObjectId('5e4a9ad48b03c9076e3bd1f1'),
                                            new mongodb_1.ObjectId('5e4a9cc68b03c9076e3bd202'),
                                            new mongodb_1.ObjectId('5e4a9dbe8b03c9076e3bd220'),
                                            new mongodb_1.ObjectId('5e4aa0258b03c9076e3bd251'),
                                            new mongodb_1.ObjectId('5e4aa2988b03c9076e3bd295'),
                                            new mongodb_1.ObjectId('5e4aa4338b03c9076e3bd2b0'),
                                            new mongodb_1.ObjectId('5e4aa4928b03c9076e3bd2bc'),
                                            new mongodb_1.ObjectId('5e4aabe68b03c9076e3bd341'),
                                            new mongodb_1.ObjectId('5e4ab3118b03c9076e3bd3a8'),
                                            new mongodb_1.ObjectId('5e4ac0938b03c9076e3bd474'),
                                            new mongodb_1.ObjectId('5e49644d8b03c9076e3bc337'),
                                            new mongodb_1.ObjectId('5e4a88748b03c9076e3bd0a5'),
                                            new mongodb_1.ObjectId('5e4a89028b03c9076e3bd0ba'),
                                            new mongodb_1.ObjectId('5e4a88e88b03c9076e3bd0b4'),
                                            new mongodb_1.ObjectId('5e4a89c38b03c9076e3bd0c9'),
                                            new mongodb_1.ObjectId('5e4a899d8b03c9076e3bd0c6'),
                                            new mongodb_1.ObjectId('5e4a8bdc8b03c9076e3bd0f7'),
                                            new mongodb_1.ObjectId('5e4a89088b03c9076e3bd0bd'),
                                            new mongodb_1.ObjectId('5e397da8a8e15c6568f2fcb3'),
                                            new mongodb_1.ObjectId('5e4a93968b03c9076e3bd17e'),
                                            new mongodb_1.ObjectId('5e4a95b68b03c9076e3bd197'),
                                            new mongodb_1.ObjectId('5e4775128b03c9076e3bb58b'),
                                            new mongodb_1.ObjectId('5e4a60488b03c9076e3bcd1c'),
                                            new mongodb_1.ObjectId('5e4812f48b03c9076e3bb94a'),
                                            new mongodb_1.ObjectId('5e4a5fe08b03c9076e3bcd17'),
                                            new mongodb_1.ObjectId('5e4ab10e8b03c9076e3bd38e'),
                                            new mongodb_1.ObjectId('5e4a01bf8b03c9076e3bc7f5'),
                                            new mongodb_1.ObjectId('5e4a91518b03c9076e3bd153'),
                                            new mongodb_1.ObjectId('5e4757428b03c9076e3bb549'),
                                            new mongodb_1.ObjectId('5e4a8f218b03c9076e3bd134'),
                                            new mongodb_1.ObjectId('5e49f5298b03c9076e3bc7a7'),
                                            new mongodb_1.ObjectId('5e4806458f9df23ae378854c'),
                                            new mongodb_1.ObjectId('5e4c150318529c7a7a880e49'),
                                            new mongodb_1.ObjectId('5e4c281618529c7a7a880ef1'),
                                            new mongodb_1.ObjectId('5e4c3c8518529c7a7a880f71'),
                                            new mongodb_1.ObjectId('5e4c19e318529c7a7a880e70'),
                                            new mongodb_1.ObjectId('5e4c3ea129f0360bdd60d6d1'),
                                            new mongodb_1.ObjectId('5e4c1ec529f0360bdd60d5c0'),
                                            new mongodb_1.ObjectId('5e4b292e8b03c9076e3bd9f3'),
                                            new mongodb_1.ObjectId('5e4c49ad29f0360bdd60d727'),
                                            new mongodb_1.ObjectId('5e4c4f7718529c7a7a881000'),
                                            new mongodb_1.ObjectId('5e4c560029f0360bdd60d773'),
                                            new mongodb_1.ObjectId('5e4c5c5f29f0360bdd60d792'),
                                            new mongodb_1.ObjectId('5e4c71c629f0360bdd60d7fc'),
                                            new mongodb_1.ObjectId('5e4c8b5218529c7a7a881138'),
                                            new mongodb_1.ObjectId('5e4c975d18529c7a7a88118e'),
                                            new mongodb_1.ObjectId('5e4c375918529c7a7a880f41'),
                                            new mongodb_1.ObjectId('5e4cd93f18529c7a7a8813b6'),
                                            new mongodb_1.ObjectId('5e4cd95718529c7a7a8813bd'),
                                            new mongodb_1.ObjectId('5e4cdaeb18529c7a7a8813e8'),
                                            new mongodb_1.ObjectId('5e4c1f6329f0360bdd60d5cf'),
                                            new mongodb_1.ObjectId('5e4c292418529c7a7a880efd'),
                                            new mongodb_1.ObjectId('5e4c366029f0360bdd60d685'),
                                            new mongodb_1.ObjectId('5e4c3d7029f0360bdd60d6c6'),
                                            new mongodb_1.ObjectId('5e4c3fb318529c7a7a880f91'),
                                            new mongodb_1.ObjectId('5e4c0cb818529c7a7a880dfd'),
                                            new mongodb_1.ObjectId('5e4c08c729f0360bdd60d523'),
                                            new mongodb_1.ObjectId('5e4c455c18529c7a7a880faf'),
                                            new mongodb_1.ObjectId('5e4c4ea918529c7a7a880ffa'),
                                            new mongodb_1.ObjectId('5e4c50ff29f0360bdd60d764'),
                                            new mongodb_1.ObjectId('5e4c58e729f0360bdd60d787'),
                                            new mongodb_1.ObjectId('5e4c596829f0360bdd60d78d'),
                                            new mongodb_1.ObjectId('5e4c7e6c18529c7a7a881106'),
                                            new mongodb_1.ObjectId('5e4ca5c518529c7a7a8811dc'),
                                            new mongodb_1.ObjectId('5e4ca5c918529c7a7a8811df'),
                                            new mongodb_1.ObjectId('5e4cbc8b29f0360bdd60d945'),
                                            new mongodb_1.ObjectId('5e4cbc5718529c7a7a881234'),
                                            new mongodb_1.ObjectId('5e4c36a318529c7a7a880f38'),
                                            new mongodb_1.ObjectId('5e4cc4c018529c7a7a881287'),
                                            new mongodb_1.ObjectId('5e4cdaf018529c7a7a8813eb'),
                                            new mongodb_1.ObjectId('5e4cdaf418529c7a7a8813ee'),
                                            new mongodb_1.ObjectId('5e4cdaf718529c7a7a8813f1'),
                                            new mongodb_1.ObjectId('5e4b57ae8b03c9076e3bdb5d'),
                                            new mongodb_1.ObjectId('5e4bfbdd18529c7a7a880d3c'),
                                            new mongodb_1.ObjectId('5e4c469218529c7a7a880fb5'),
                                            new mongodb_1.ObjectId('5e4c8bd029f0360bdd60d859'),
                                            new mongodb_1.ObjectId('5e4c8c5f18529c7a7a88113b'),
                                            new mongodb_1.ObjectId('5e4c8ccd18529c7a7a881144'),
                                            new mongodb_1.ObjectId('5e4c956629f0360bdd60d87f'),
                                            new mongodb_1.ObjectId('5e4cbc5529f0360bdd60d942'),
                                            new mongodb_1.ObjectId('5e4c2bc729f0360bdd60d642'),
                                            new mongodb_1.ObjectId('5e4cda1218529c7a7a8813d3'),
                                            new mongodb_1.ObjectId('5e4cdaca18529c7a7a8813dc'),
                                            new mongodb_1.ObjectId('5e4cda6f18529c7a7a8813d9'),
                                            new mongodb_1.ObjectId('5e4cdf6318529c7a7a881440'),
                                            new mongodb_1.ObjectId('5e4ce18618529c7a7a88146e'),
                                            new mongodb_1.ObjectId('5e125643bec9b026a839f779'),
                                            new mongodb_1.ObjectId('5e126e82f297d42f6892476e'),
                                            new mongodb_1.ObjectId('5e126161f297d42f68924725'),
                                            new mongodb_1.ObjectId('5e1247dcbec9b026a839f716'),
                                            new mongodb_1.ObjectId('5e124837bec9b026a839f719'),
                                            new mongodb_1.ObjectId('5e1261bfbec9b026a839f7cd'),
                                            new mongodb_1.ObjectId('5e1256d5bec9b026a839f77f'),
                                            new mongodb_1.ObjectId('5e12558df297d42f689246da'),
                                            new mongodb_1.ObjectId('5e0f717df297d42f6892393b'),
                                            new mongodb_1.ObjectId('5e0f81a4bec9b026a839ea1b'),
                                            new mongodb_1.ObjectId('5e0f7b4ef297d42f68923984'),
                                            new mongodb_1.ObjectId('5e0f7f7ebec9b026a839ea0d'),
                                            new mongodb_1.ObjectId('5e0f957ef297d42f68923a49'),
                                            new mongodb_1.ObjectId('5e0fb17cf297d42f68923b06'),
                                            new mongodb_1.ObjectId('5e0fbb92bec9b026a839ebcb'),
                                            new mongodb_1.ObjectId('5e0fbcc0f297d42f68923b3f'),
                                            new mongodb_1.ObjectId('5e0fbd41f297d42f68923b4b'),
                                            new mongodb_1.ObjectId('5e0fbe9bbec9b026a839ebe0'),
                                            new mongodb_1.ObjectId('5e0fc32ff297d42f68923b63'),
                                            new mongodb_1.ObjectId('5e0fbda0f297d42f68923b4e'),
                                            new mongodb_1.ObjectId('5e0fb1d1f297d42f68923b0c'),
                                            new mongodb_1.ObjectId('5e0fc475f297d42f68923b6c'),
                                            new mongodb_1.ObjectId('5e0f6251bec9b026a839e980'),
                                            new mongodb_1.ObjectId('5e0f7029bec9b026a839e9c8'),
                                            new mongodb_1.ObjectId('5e0f6502f297d42f689238cb'),
                                            new mongodb_1.ObjectId('5e0f81f7bec9b026a839ea1e'),
                                            new mongodb_1.ObjectId('5e0f8d84bec9b026a839ea8d'),
                                            new mongodb_1.ObjectId('5e0f8084f297d42f689239a0'),
                                            new mongodb_1.ObjectId('5e0faf09bec9b026a839eb83'),
                                            new mongodb_1.ObjectId('5e10bc1bbec9b026a839f076'),
                                            new mongodb_1.ObjectId('5e135b27b51f7a4bf28d159a'),
                                            new mongodb_1.ObjectId('5e135bc8b51f7a4bf28d15a1'),
                                            new mongodb_1.ObjectId('5e136e4cb51f7a4bf28d162d'),
                                            new mongodb_1.ObjectId('5e13780fb51f7a4bf28d1686'),
                                            new mongodb_1.ObjectId('5e1377c9b51f7a4bf28d1683'),
                                            new mongodb_1.ObjectId('5e137d8ca20d9d37ba81afbb'),
                                            new mongodb_1.ObjectId('5e091889cc5c7f74916f72ce'),
                                            new mongodb_1.ObjectId('5e14bc1da20d9d37ba81ba0d'),
                                            new mongodb_1.ObjectId('5e162b0238cdec6804663ac6'),
                                            new mongodb_1.ObjectId('5e150f51a20d9d37ba81bc59'),
                                            new mongodb_1.ObjectId('5e14caecb51f7a4bf28d21b6'),
                                            new mongodb_1.ObjectId('5e1613de38cdec6804663a1f'),
                                            new mongodb_1.ObjectId('5e160d8e38cdec68046639fc'),
                                            new mongodb_1.ObjectId('5e160e7c38cdec6804663a02'),
                                            new mongodb_1.ObjectId('5e17559638cdec6804664378'),
                                            new mongodb_1.ObjectId('5e17591538cdec680466439d'),
                                            new mongodb_1.ObjectId('5e177ab1b51f7a4bf28d34dd'),
                                            new mongodb_1.ObjectId('5e14e0c9a20d9d37ba81bb67'),
                                            new mongodb_1.ObjectId('5e16339038cdec6804663aff'),
                                            new mongodb_1.ObjectId('5e313c94dcacb677e09e75bf'),
                                            new mongodb_1.ObjectId('5e2f236509b5ec201f89f095'),
                                            new mongodb_1.ObjectId('5e4332f32a1d505792089e4e'),
                                            new mongodb_1.ObjectId('5e1378c3a20d9d37ba81af84'),
                                            new mongodb_1.ObjectId('5e16184b38cdec6804663a46')
                                        ]
                                    },
                                    'nsp': '/sbtjapaninquiries.com'
                                }
                            },
                            {
                                '$project': {
                                    '_id': 1,
                                    'clientID': 1,
                                    'subject': 1,
                                    'assigned_to': 1,
                                    'group': 1,
                                    'datetime': 1
                                }
                            },
                            {
                                '$group': {
                                    _id: '$group',
                                    count: {
                                        $sum: 1
                                    }
                                }
                            },
                            {
                                '$sort': {
                                    '_id': 1
                                }
                            }
                        ]).toArray();
                        promise2 = this.collection.aggregate([
                            {
                                '$match': {
                                    'datetime': {
                                        '$gte': '2020-01-01',
                                        '$lte': '2020-02-20'
                                    },
                                    'visitor.email': new RegExp('no-reply'),
                                    'nsp': '/sbtjapaninquiries.com',
                                    'group': {
                                        '$in': [
                                            'DOMINICAN REPUBLIC.D ( All Counties )', 'Australia Inquires', 'Sri Lanka Inquires', 'Zimbabwe Inquires', 'Tanzania Inquires', 'Bangladesh Inquires', 'Kenya Inquires', 'ENGLAND (EUROPE)', 'CONGO Inquries', 'TRINIDAD (CARIB)', 'UAE Inquires', 'New Zealand Inquires', 'Paraguay Inquires', 'BAHAMAS (CARIB)', 'Uganda Inquires', 'Dominican Republic Inquires', 'Mozambique Inquires', 'Namibia Inquires', 'SURINAME (CARIB)', 'JAMAICA (CARIB)', 'Pakistan Inquires', 'CHILE (LATIN AMERICA)', 'Lesotho Inquires', 'South Africa Inquires', 'TURKS AND CAICOS (CARIB)', 'IRELAND (EUROPE)', 'Malawi Inquires', 'CYPRUS (EUROPE)', 'Zambia Inquires', 'West Africa French', 'GUYANA (CARIB)', 'Swaziland Inquires', 'LHD - CARIB LATIN', 'Oceania Inquires', 'South Sudan', 'China Operations', 'MAURITIUS (EUROPE)', 'Botswana Inquires', 'MALTA (EUROPE)', 'West Africa English', 'RUSSIA Inquires', 'UK Inquires'
                                        ]
                                    }
                                }
                            }, {
                                '$group': {
                                    '_id': '$group',
                                    'count': {
                                        '$sum': 1
                                    }
                                }
                            }, {
                                '$sort': {
                                    '_id': 1
                                }
                            }
                        ]).toArray();
                        return [4 /*yield*/, Promise.all([promise1, promise2])];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_78 = _a.sent();
                        console.log(error_78);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.getCustomData2 = function () {
        return __awaiter(this, void 0, void 0, function () {
            var ticketIDs, tickets, i, j, temparray, chunk, _loop_1, this_1, xls, err_19;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        ticketIDs = [
                            'FKZfK',
                            'OQUzZ',
                            'Mybma',
                            'e6PeP',
                            'QIAtu',
                            'MQWfF',
                            'iXXGs',
                            'jMgrA',
                            't0AS5',
                            'eYHnQ',
                            '9MScR',
                            '9wsO9',
                            'OozDh',
                            'O0hgQ',
                            'mfNOY',
                            'FXOAh',
                            'jrXdZ',
                            '2tGNF',
                            'BwNEi',
                            'lvrln',
                            'cPfgc',
                            'hOBDD',
                            '1MC9x',
                            '67OQh',
                            'gppaQ',
                            'Nv0O0',
                            'K3xMn',
                            'bBSvl',
                            'xSLmO',
                            '88kiQ',
                            'Lj9d5',
                            'LpEr3',
                            'Oi6xX',
                            'ddvuJ',
                            'vhO24',
                            'uVlpz',
                            '4jwmt',
                            '7rb3b',
                            '6t5TA',
                            '4ibOv',
                            'bjTvj',
                            'xK6KA',
                            'me0vs',
                            'Ti1Sr',
                            'v4i0v',
                            'qjLxd',
                            '5JWU8',
                            'QxVoU',
                            'BmXfc',
                            'PnDLD',
                            'p9PQC',
                            'SsoB4',
                            'xZiip',
                            'ThFhT',
                            'fdvqN',
                            'GWjmV',
                            'XeyTW',
                            'bfx6D',
                            'kMAXq',
                            'jJy6g',
                            'V2F1B',
                            'kOl3d',
                            'JHLhK',
                            'Vf2MR',
                            'L8Fja',
                            'wzhxe',
                            'hFyfe',
                            '6h2R1',
                            '104SI',
                            'nL0dB',
                            'QQeQi',
                            '7cemq',
                            'ey7Y6',
                            'CgXXb',
                            'gb4XX',
                            'oxZ0B',
                            'npn6p',
                            'IwQei',
                            'KzpAe',
                            'CLVxe',
                            'y0dXt',
                            'CciSx',
                            'XnLjT',
                            'ikpxi',
                            '2imS5',
                            'LVdH9',
                            '49a4l',
                            'ZES3G',
                            '8NDFU',
                            'J2otK',
                            '2lgib',
                            '75fVH',
                            'lIRBW',
                            'ig0Zp',
                            'TrBrM',
                            'nDCz7',
                            'yRBmE',
                            'CHeE1',
                            'ikTn1',
                            'OAdP6',
                            'hlH23',
                            'dnYUZ',
                            'Q0F67',
                            'gvrpD',
                            'BlcWq',
                            'zvBeE',
                            'SGHrv',
                            'Z3qo5',
                            'oSa1V',
                            'g8sej',
                            'XV6m2',
                            '6klSJ',
                            '67FXr',
                            'yz7Ux',
                            'roXQU',
                            'ywqO7',
                            'Wib0P',
                            '8wQLT',
                            'WFjrs',
                            '4aMmR',
                            'p9da1',
                            'ykSys',
                            'W62Co',
                            'qlrWG',
                            'zYTlp',
                            'lB2Kz',
                            'A1ayd',
                            'nVJj7',
                            '2jxTI',
                            'XOsY8',
                            '0DcZ3',
                            'tDMfK',
                            'WV6wa',
                            '7acqT',
                            'KHOOx',
                            'FMaxs',
                            'iwrco',
                            'rzpOe',
                            'f3ltM',
                            'L5AZr',
                            'z4AP7',
                            'LQ4XO',
                            'iAe07',
                            'g18H8',
                            'XBPua',
                            'Yms1M',
                            'EypMs',
                            'rsc1u',
                            'YBc2b',
                            'YlqwO',
                            'JfWoE',
                            'df7Lq',
                            'LSiHl',
                            'HCBGt',
                            'YiF7r',
                            'Qyqxc',
                            'Jpepg',
                            'j2VSS',
                            'X6BQk',
                            '9CGNh',
                            'NfhLJ',
                            'aa9Bt',
                            'r6L2i',
                            'sHYIc',
                            'gNfhs',
                            'bh237',
                            'pnLTU',
                            'oEWj2',
                            'x5Mlu',
                            '6pspb',
                            '53Pri',
                            'Kyayd',
                            '04FT6',
                            '1k7et',
                            'PKunt',
                            '1yqN2',
                            'gh1E5',
                            '5ClIb',
                            'u8IN9',
                            'bD9hZ',
                            'PqXHp',
                            'PuBmW',
                            'NGKRF',
                            'a4i8U',
                            'FKrUZ',
                            'kmDz8',
                            'NPGvW',
                            'Qkhwa',
                            'JQKmo',
                            'YwVMx',
                            'cQlKl',
                            'jjQFE',
                            'VPjQZ',
                            'yOLLC',
                            'eZsEa',
                            'GRQIz',
                            'UuIsb',
                            'EX4vF',
                            '7aq04',
                            'o0jqb',
                            'uZ8H3',
                            '5geI7',
                            'QsAs7',
                            'ar243',
                            '5JyFJ',
                            'waLvw',
                            'Q5Ug0',
                            'Naaa1',
                            'D40Dw',
                            'bMuVW',
                            'mSlVw',
                            'PjrMi',
                            'RbHux',
                            'aBmCe',
                            'aez2G',
                            'rKIgK',
                            'Ilskd',
                            'ynMLr',
                            'uVrvb',
                            '2Nmmd',
                            'jUJ48',
                            'vmdTH',
                            'hyDHr',
                            '6z6f8',
                            'RHvjy',
                            'os4pZ',
                            '92VqH',
                            'BAJHW',
                            'FWAVo',
                            'VNAVQ',
                            '4pyEA',
                            'jAD0w',
                            'mYAXm',
                            'Tqdzd',
                            'AmGJm',
                            'I6rHO',
                            'QrRp7',
                            '2opSM',
                            'T8OrM',
                            'MWNIo',
                            '1q5cg',
                            'DfoK1',
                            'JmtHt',
                            'xOUMO',
                            'FeiIO',
                            'w0LUv',
                            '86Vzh',
                            'zU5uQ',
                            'gQkYN',
                            'YWnOE',
                            't9GmL',
                            '9KLtc',
                            'STtHa',
                            '8AtTo',
                            'a4INp',
                            'RD9Um',
                            'v4WAg',
                            'hkuSM',
                            'rfv6F',
                            'aFcIk',
                            'M8UqH',
                            'PfzNN',
                            'SEJe7',
                            '9EbOi',
                            'Hz7F3',
                            'A7pmC',
                            'EppPa',
                            'AXH7a',
                            'VFAQE',
                            'A6OBF',
                            'ncirg',
                            'niEUt',
                            'JwFUw',
                            '8O7MN',
                            '5JVRx',
                            'QqTQp',
                            'utdYi',
                            'NFRkw',
                            'quujp',
                            'SrhBy',
                            'OywK0',
                            'SoVbZ',
                            'puQut',
                            'MTeTx',
                            '0pFYU',
                            'iNnEr',
                            'HR9MX',
                            'cscnp',
                            'eEBA3',
                            'b4Diq',
                            'mSRGY',
                            'pqKoM',
                            'OHQpi',
                            '2XgWI',
                            'Rm6dZ',
                            'jEFdn',
                            'WYNWA',
                            '7fYNq',
                            'eASmX',
                            'MUlIk',
                            '7yBpU',
                            'Trhkd',
                            'p5PrF',
                            'tFS7P',
                            'KP1Kc',
                            'NVpGA',
                            '4Xa63',
                            'QgvSR',
                            'Br41Z',
                            'cVQto',
                            'IUVN0',
                            '3NPsO',
                            '5JLf1',
                            'XkSrs',
                            'zRmB7',
                            '1lCkf',
                            'Vx9Zk',
                            'la95n',
                            'kvqYl',
                            'xwJ49',
                            'eGFzE',
                            'lNr1m',
                            'qnzz0',
                            '4pXOW',
                            'u6Uaq',
                            'TAp4o',
                            'rIexI',
                            'LFiCD',
                            'lAwBe',
                            'K6w5A',
                            'at7Tb',
                            'wYcRe',
                            'qRHVH',
                            'IT0nN',
                            'BuFti',
                            '82eSj',
                            '6rGKF',
                            '1xxDm',
                            'MclEh',
                            'Kf2fD',
                            '8WnuX',
                            'enfjV',
                            'S0Rv9',
                            'loidC',
                            '0yz9O',
                            'huhQe',
                            'ro6MJ',
                            'sUXQ7',
                            'sABJA',
                            'HURjg',
                            'kbBz6',
                            'ezthw',
                            'Pu76q',
                            '9bClz',
                            'gZcXx',
                            'zRXr3',
                            'KnLsK',
                            'ng8Bb',
                            'zAzhA',
                            'WjsCH',
                            'XvMRV',
                            'u2Lmc',
                            'y69oA',
                            'Atwai',
                            'g7Oxm',
                            'phA1T',
                            'I9NWS',
                            'Kiiww',
                            'dtrBV',
                            'TEUT2',
                            'GOB9y',
                            'wgg5I',
                            'NvR8z',
                            'GBvsN',
                            'ByInW',
                            'jdNUY',
                            'w7tp6',
                            'riIts',
                            'NFLHi',
                            'pL9J2',
                            'FhxpG',
                            'SWcZv',
                            '7d1Li',
                            'wqgIQ',
                            'm1nMl',
                            'cRsUQ',
                            'rESQV',
                            'hefta',
                            'nhtF5',
                            '7KREU',
                            'XKtdg',
                            'mRtwk',
                            'JfDKv',
                            'InJ5q',
                            '2Ap83',
                            '44NoV',
                            'cY55Y',
                            'Gzh4b',
                            'PgDA5',
                            '0qgaz',
                            'Z1ngs',
                            '7uaTY',
                            '5FT4J',
                            'Xo2Bg',
                            'kE8DO',
                            'tVAC7',
                            'tYdIv',
                            'ASgBn',
                            'iyOxY',
                            'LtH1H',
                            'DmPVE',
                            'I5QIq',
                            '9i938',
                            'G2z4N',
                            'hK2DO',
                            'TGJ8p',
                            '6nEqp',
                            'OnoA7',
                            '9BKTv',
                            'QA4K6',
                            '3LCW4',
                            'fvvvG',
                            'MKCtM',
                            'G5SvR',
                            'y3kDT',
                            'c7Oow',
                            'v8suX',
                            'OOcAw',
                            'S1Axw',
                            'LJRtb',
                            'bzID0',
                            'jS8ar',
                            'QCJl2',
                            'W4WWa',
                            'J2NtD',
                            'DZOpG',
                            'zdVPC',
                            '3ulmJ',
                            '8sDla',
                            'ycWnK',
                            'STFZo',
                            'av0HI',
                            'vmeNY',
                            '7X19m',
                            'C9uM7',
                            'jBSN6',
                            'kYW0w',
                            'udXn9',
                            'tmrac',
                            'c37Rs',
                            'sKcaI',
                            'pIXxt',
                            'Leune',
                            'F5hJC',
                            'CniWP',
                            'skXAw',
                            'ElM9n',
                            'zN2vv',
                            'EKPVV',
                            'r6koq',
                            'R4BPS',
                            'nQDb6',
                            'kfsM4',
                            'Gy6am',
                            'XPGUc',
                            'u6hww',
                            'sEyfW',
                            'aiQR7',
                            '1G5Ng',
                            '9IfmX',
                            'wV7uj',
                            '9iSJj',
                            '0PNCB',
                            'hwYGD',
                            'JTpD5',
                            '6oGXn',
                            'ybWTZ',
                            'iE2sN',
                            'scJgQ',
                            'pYeil',
                            'Jceh0',
                            'x4IDV',
                            'w0FCa',
                            'thDrs',
                            's2qP3',
                            'Xl5x9',
                            'SydfF',
                            's7Xjg',
                            'XOtvF',
                            'OpcTJ',
                            'bd78V',
                            'O9Jo6',
                            'jYsrG',
                            'oA3Du',
                            'bZdtj',
                            'Cl5eh',
                            '05UTM',
                            'ucOXq',
                            'isFc7',
                            '6XDOI',
                            'uARoT',
                            'RLnGZ',
                            'WBfsS',
                            'Kq5Bp',
                            '5kbj7',
                            'xThXH',
                            'uZ59G',
                            '84vRg',
                            'qZlya',
                            'LapgQ',
                            'rwk02',
                            'OZZ1S',
                            'cb3w4',
                            'Rm3fZ',
                            '831XA',
                            'KsyLz',
                            'WVcc5',
                            'tWdaP',
                            'V3tnA',
                            'BcmFt',
                            'Q8uRZ',
                            'hBTkm',
                            'wOkTF',
                            'tDg82',
                            'en0jJ',
                            '51qyS',
                            'Obxrx',
                            'oREzT',
                            'w6TB5',
                            'pf7XZ',
                            'N3QjU',
                            'nLmEY',
                            '26KQW',
                            'YrGV3',
                            '323GX',
                            'cBYpb',
                            'k78ok',
                            'eX0tb',
                            'bWXu5',
                            'A5wyI',
                            'mT1qj',
                            'wIWVv',
                            '9VjWW',
                            'Dug8D',
                            'GoKHn',
                            'OkceN',
                            'pgTP3',
                            'RBKdk',
                            'Blllw',
                            'ZBZC9',
                            'JoKgn',
                            'VbXK2',
                            'xoe8h',
                            'FAIlr',
                            '1yYGv',
                            'YvlKv',
                            'DWEMr',
                            'daoI7',
                            '1Ssp1',
                            '9ZqEh',
                            'ECHDm',
                            '0uHl3',
                            'KCjrf',
                            't6X6j',
                            'QS4j9',
                            'MBm0F',
                            'eI41r',
                            'muQMA',
                            '1OQqJ',
                            'zGtvU',
                            '4VRkt',
                            'cYTC0',
                            '9XbOG',
                            'U8NkG',
                            'FUA9J',
                            '1AvvN',
                            'NL7aK',
                            'qbZgl',
                            '207Qo',
                            'mnSZJ',
                            'FcTtA',
                            'rXX4b',
                            'PSBm8',
                            'KnTxw',
                            'hFQDt',
                            'kp7GR',
                            'Ji31S',
                            'LZD16',
                            'NmD98',
                            'ZgQuV',
                            'CXzBF',
                            'bd5CO',
                            'heLCW',
                            'hsezX',
                            '2Oatu',
                            'ZXbLR',
                            'nInjM',
                            'orOAf',
                            '3LLzr',
                            'fc5PU',
                            '848lL',
                            'eOb4c',
                            '4M7os',
                            'EyDGt',
                            'muhkz',
                            'biuVc',
                            'tstOP',
                            'E04Fp',
                            '22mAm',
                            'wJMXi',
                            'MW65m',
                            '9dpu9',
                            'gsdWi',
                            'dz1CA',
                            'Sbbav',
                            'nkcQr',
                            'BLpHi',
                            'lwO0I',
                            'N2KEO',
                            'AZrM7',
                            'FtkVa',
                            'LRz7n',
                            '2dQ4g',
                            'eqd1h',
                            '2Ph6X',
                            'KGKOs',
                            'HkzzV',
                            'SheQU',
                            'KTyjD',
                            '61nXL',
                            'afXCn',
                            'B9KJG',
                            'ddeLx',
                            'VXI7M',
                            'JSHfP',
                            'nT5fX',
                            'bTJnY',
                            'LV2PV',
                            'tRwof',
                            'xJWDq',
                            'VhUbo',
                            'VfGfj',
                            'KajZl',
                            'PlTfh',
                            'W1yCP',
                            'alVCs',
                            'qhAdB',
                            'aeA4J',
                            'h0P9i',
                            '0fpLZ',
                            'jmHG2',
                            'TtAkZ',
                            '6zxPg',
                            'L0ZMS',
                            'Goijc',
                            'rQ56e',
                            'U9DBg',
                            'AmRG2',
                            '6dJMG',
                            '15Ow2',
                            'J5ssq',
                            '9i3GO',
                            'F7gPy',
                            'kuuYd',
                            'wLL9S',
                            'gQ1Lk',
                            'EF5vg',
                            'qeMDF',
                            'oUQ9K',
                            'yAMz5',
                            'b7Iu0',
                            'XXx69',
                            'STYeM',
                            'cS0LS',
                            'IHn3F',
                            'XqD1w',
                            'IfMTK',
                            'rIuD0',
                            'xm1eB',
                            'kV5OZ',
                            'zqmzb',
                            '2VtEw',
                            'dRBwC',
                            'wa8E6',
                            'NGvop',
                            'lT2td',
                            'tyV6D',
                            'ATyDJ',
                            '01jeW',
                            'vqwPU',
                            'eOe0X',
                            'lU0Wn',
                            'lh3tU',
                            'RDovL',
                            'Ekso5',
                            'oWLPx',
                            'FM1yi',
                            'DgY0p',
                            'X55OY',
                            'zNAlR',
                            'HcsWa',
                            '9StDj',
                            'Kl2dp',
                            'cgGrl',
                            'liS6U',
                            'kk0zi',
                            'Ynepu',
                            'aI8uW',
                            'LCmqJ',
                            'o40tj',
                            'MbrXF',
                            'GBAaN',
                            '0J71b',
                            '5yHJp',
                            'udbgX',
                            '7yWdU',
                            'PLsP4',
                            'jNEO8',
                            'df3UR',
                            'IZF8L',
                            'BR5De',
                            'uq66H',
                            'b73ZT',
                            'prIZC',
                            '9YSoC',
                            'Ay61t',
                            'L5kWP',
                            'ZQvpI',
                            '0S66i',
                        ];
                        return [4 /*yield*/, this.collection.aggregate([
                                {
                                    '$match': {
                                        clientID: { $in: ticketIDs }
                                        // "visitor.email": /no-reply/,
                                        // group: {
                                        //     $eq: ''
                                        // }
                                    }
                                },
                                // {
                                //     '$addFields': {
                                //         "month" : {
                                //             $month: {
                                //                 date: {
                                //                     $dateFromString: {
                                //                         dateString: '$datetime'
                                //                     }
                                //                 },
                                //                 timezone: 'Asia/Karachi'
                                //             }
                                //         }
                                //     }
                                // },
                                // {
                                //     '$match': {
                                //         month: 3
                                //     }
                                // },
                                {
                                    '$project': {
                                        _id: 1,
                                        clientID: 1,
                                        group: 1,
                                        datetime: 1,
                                        assigned_to: 1
                                    }
                                },
                                {
                                    '$sort': {
                                        datetime: 1
                                    }
                                }
                            ]).toArray()];
                    case 1:
                        tickets = _a.sent();
                        console.log('Tickets to Process: ' + tickets.length);
                        chunk = 10000;
                        _loop_1 = function () {
                            var TIDs, tempMessages;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        console.log('Fetching messages for tickets ' + i + ' - ' + (i + chunk));
                                        temparray = tickets.slice(i, i + chunk);
                                        TIDs = temparray.map(function (t) { return new mongodb_1.ObjectId(t._id); });
                                        return [4 /*yield*/, this_1.db.collection('ticketMessages').find({ tid: { $in: TIDs } }).toArray()];
                                    case 1:
                                        tempMessages = _a.sent();
                                        // DBMessages = DBMessages.concat(tempMessages);
                                        console.log('Messages to process: ' + tempMessages.length);
                                        temparray.map(function (ticket, index) {
                                            if (!ticket.assigned_to)
                                                ticket.assigned_to = '';
                                            ticket.customerDetails = [];
                                            var messages = tempMessages.filter(function (m) { return m.tid[0].toString() == ticket._id; });
                                            var cmDetail = '';
                                            var customerPhone = '';
                                            messages.forEach(function (message, mIndex) {
                                                // console.log(message.message);
                                                console.log('processing ticket#' + (index + 1) + ' (' + ticket.clientID + ')' + ' message #' + (mIndex + 1) + ' ' + message._id.toString());
                                                var $ = cheerio.load(message.message);
                                                var blockquote = $('blockquote').find('span h3');
                                                var p = $('body h3');
                                                if (blockquote.length) {
                                                    if ($(blockquote[0]).html() && $(blockquote[0]).html().split(':').length == 2)
                                                        cmDetail += 'Customer ID: ' + $(blockquote[0]).html().replace('<', '').split(':')[1].trim() + '\n';
                                                    if ($(blockquote[1]).html() && $(blockquote[1]).html().split(':').length == 2)
                                                        cmDetail += 'Customer Email: ' + $(blockquote[1]).html().replace('<', '').split(':')[1].trim() + '\n';
                                                    if ($(blockquote[2]).html() && $(blockquote[2]).html().split(':').length == 2)
                                                        cmDetail += 'Customer Phone: ' + $(blockquote[2]).html().replace('<', '').split(':')[1].trim() + '\n';
                                                    if ($(blockquote[2]).html() && $(blockquote[2]).html().split(':').length == 2)
                                                        customerPhone += $(blockquote[2]).html().replace('<', '').split(':')[1].trim() + '\n';
                                                    if ($(blockquote[3]).html() && $(blockquote[3]).html().split(':').length == 2)
                                                        cmDetail += 'Country Name: ' + $(blockquote[3]).html().replace('<', '').split(':')[1].trim() + '\n';
                                                    if ($(blockquote[4]).html() && $(blockquote[4]).html().split(':').length == 2)
                                                        cmDetail += 'City Name: ' + $(blockquote[4]).html().replace('<', '').split(':')[1].trim() + '\n';
                                                    if ($(blockquote[5]).html() && $(blockquote[5]).html().split(':').length == 2)
                                                        cmDetail += 'Sales Person: ' + $(blockquote[5]).html().replace('<', '').split(':')[1].trim() + '\n\n';
                                                }
                                                else if (p.length) {
                                                    if ($(p[0]).html() && $(p[0]).html().split(':').length == 2)
                                                        cmDetail += 'Customer ID: ' + $(p[0]).html().replace('<', '').split(':')[1].trim() + '\n';
                                                    if ($(p[1]).html() && $(p[1]).html().split(':').length == 2)
                                                        cmDetail += 'Customer Email: ' + $(p[1]).html().replace('<', '').split(':')[1].trim() + '\n';
                                                    if ($(p[2]).html() && $(p[2]).html().split(':').length == 2)
                                                        cmDetail += 'Customer Phone: ' + $(p[2]).html().replace('<', '').split(':')[1].trim() + '\n';
                                                    if ($(p[2]).html() && $(p[2]).html().split(':').length == 2)
                                                        customerPhone += $(p[2]).html().replace('<', '').split(':')[1].trim() + '\n';
                                                    if ($(p[3]).html() && $(p[3]).html().split(':').length == 2)
                                                        cmDetail += 'Country Name: ' + $(p[3]).html().replace('<', '').split(':')[1].trim() + '\n';
                                                    if ($(p[4]).html() && $(p[4]).html().split(':').length == 2)
                                                        cmDetail += 'City Name: ' + $(p[4]).html().replace('<', '').split(':')[1].trim() + '\n';
                                                    if ($(p[5]).html() && $(p[5]).html().split(':').length == 2)
                                                        cmDetail += 'Sales Person: ' + $(p[5]).html().replace('<', '').split(':')[1].trim() + '\n\n';
                                                }
                                            });
                                            ticket.customerDetails.push(cmDetail);
                                            ticket.customerPhone = customerPhone;
                                        });
                                        xls = json2xls(temparray);
                                        console.log('Writing File for tickets ' + i + ' - ' + (i + chunk));
                                        fs.writeFileSync('D:\\SBT\\TicketsData\\Tickets_#' + i + '-' + (i + chunk) + '.xlsx', xls, 'binary');
                                        console.log('Done!');
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        i = 0, j = tickets.length;
                        _a.label = 2;
                    case 2:
                        if (!(i < j)) return [3 /*break*/, 5];
                        return [5 /*yield**/, _loop_1()];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        i += chunk;
                        return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        err_19 = _a.sent();
                        console.log(err_19);
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.RevertScenario = function (tids, nsp, ticketlog) {
        return __awaiter(this, void 0, void 0, function () {
            var objectIdArray, ticket;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        objectIdArray = tids.map(function (s) { return new mongodb_1.ObjectId(s); });
                        return [4 /*yield*/, this.collection.find({ _id: objectIdArray[0], nsp: nsp }).project({ previousTicketState: 1 }).limit(1).toArray()];
                    case 1:
                        ticket = _a.sent();
                        ticket[0].previousTicketState.ticketlog.push(ticketlog);
                        return [4 /*yield*/, this.collection.findOneAndReplace({ _id: objectIdArray[0], nsp: nsp }, (ticket[0].previousTicketState), { upsert: false, returnOriginal: false })];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Tickets.getAllTickets = function (nsp, dateFrom, dateTo) {
        return __awaiter(this, void 0, void 0, function () {
            var result, err_20;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.aggregate([
                                {
                                    "$match": {
                                        "nsp": nsp,
                                        "datetime": {
                                            "$gte": dateFrom,
                                            "$lt": dateTo
                                        }
                                    }
                                },
                                {
                                    "$project": {
                                        "data": { $substr: ["$datetime", 0, 10] }
                                    }
                                },
                                {
                                    "$group": {
                                        _id: { data: "$data" },
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
                        err_20 = _a.sent();
                        console.log('Error in getting data');
                        console.log(err_20);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Tickets.initialized = false;
    Tickets.result = false;
    Tickets.orResult = [];
    Tickets.andResult = [];
    return Tickets;
}());
exports.Tickets = Tickets;
// let temp = await this.collection.updateMany({ _id: { $in: objectIdArray } },
//     {
//         $push: { ticketlog: ticketlog }
//     },
//     { $set: { obj : obj } }, { upsert: false });
//# sourceMappingURL=ticketsModel.js.map