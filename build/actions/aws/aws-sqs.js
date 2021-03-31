"use strict";
//Typescript Version
// Date : 23-11-2019
// Created By Saad Ismail Shaikh
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
exports.__biZZC_SQS = void 0;
/**
 * @SQS AWS Sending/RECIEVING Standards and Tutorial
 * https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/sqs-examples.html
 * https://aws.amazon.com/sqs/faqs/
 */
// load aws sdk
var aws = require("aws-sdk");
var constants_1 = require("../../globals/config/constants");
var mongodb_1 = require("mongodb");
// load aws config
//aws.config.loadFromPath('config.json');
aws.config.update({ region: 'us-west-2' });
aws.config.setPromisesDependency(null);
var __biZZC_SQS = /** @class */ (function () {
    function __biZZC_SQS() {
    }
    //#region For Fetching Use Following Api
    __biZZC_SQS.FetchQueue = function (params) {
        if (params === void 0) { params = this.Receivingparams; }
        return __awaiter(this, void 0, void 0, function () {
            var startTime, response, result, endTime, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        startTime = new Date();
                        response = this.sqs.receiveMessage(params).promise();
                        return [4 /*yield*/, response];
                    case 1:
                        result = _a.sent();
                        endTime = new Date();
                        console.log('Start Time : ', startTime);
                        console.log('End Time : ', endTime);
                        // console.log(result);
                        return [2 /*return*/, result];
                    case 2:
                        error_1 = _a.sent();
                        console.log('error in Starting POlling SQS');
                        console.log(error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    //#endregion
    __biZZC_SQS.DeleteMessage = function (receiptHandle) {
        return __awaiter(this, void 0, void 0, function () {
            var params, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        params = {
                            QueueUrl: this.queueUrl,
                            ReceiptHandle: receiptHandle
                        };
                        return [4 /*yield*/, this.sqs.deleteMessage(params).promise()];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        console.log(error_2);
                        console.log('error in deleting Message');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    __biZZC_SQS.SendMessage = function (body, queueUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var params, result, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        // console.log("SQSPacket",body);
                        if (!body.action)
                            throw new Error('Invalid Publishing Event');
                        params = {
                            QueueUrl: (queueUrl) ? queueUrl : this.queueUrl,
                            MessageBody: JSON.stringify(body),
                        };
                        return [4 /*yield*/, this.sqs.sendMessage(params).promise()
                            // console.log('SQS RESULT : ', result);
                        ];
                    case 1:
                        result = _a.sent();
                        // console.log('SQS RESULT : ', result);
                        return [2 /*return*/, result];
                    case 2:
                        error_3 = _a.sent();
                        console.log(error_3);
                        console.log('error in Sending SQS Message');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    __biZZC_SQS.SendMessageToSOLR = function (packet, url) {
        return __awaiter(this, void 0, void 0, function () {
            var sqsUrl, params, result, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        sqsUrl = '';
                        switch (url) {
                            case 'ticket':
                                sqsUrl = constants_1.SQSSOLRURL;
                                break;
                            case 'chat':
                                sqsUrl = constants_1.SQSChatsSOLRURL;
                                break;
                            case 'agent':
                                sqsUrl = constants_1.AGENTSOLRQUEUE;
                                break;
                            default:
                                break;
                        }
                        if (!packet.action || !sqsUrl)
                            throw new Error('Invalid Publishing Event');
                        params = {
                            QueueUrl: '',
                            MessageGroupId: '',
                            MessageDeduplicationId: '',
                            MessageBody: ''
                        };
                        params = {
                            QueueUrl: sqsUrl,
                            MessageGroupId: new mongodb_1.ObjectId().toHexString(),
                            MessageDeduplicationId: new mongodb_1.ObjectId().toHexString(),
                            MessageBody: JSON.stringify(packet),
                        };
                        return [4 /*yield*/, this.sqs.sendMessage(params).promise()
                            // console.log('SQS RESULT : ', result);
                        ];
                    case 1:
                        result = _a.sent();
                        // console.log('SQS RESULT : ', result);
                        return [2 /*return*/, result];
                    case 2:
                        error_4 = _a.sent();
                        console.log(error_4);
                        console.log('error in Sending SQS Message');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    __biZZC_SQS.SendEventLog = function (data, id, queueUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var log, params, result, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        log = {
                            sessionid: id,
                            event: data,
                            time_stamp: new Date().toISOString()
                        };
                        params = {
                            QueueUrl: (queueUrl) ? queueUrl : this.archiveQueueURL,
                            MessageBody: JSON.stringify({ action: 'eventLog', log: log }),
                        };
                        return [4 /*yield*/, this.sqs.sendMessage(params).promise()];
                    case 1:
                        result = _a.sent();
                        // console.log('SQS RESULT : ', result);
                        //let logged: any;
                        // if (this.db && this.collection) {
                        //     logged = await EventLogs.createLog(log);
                        // }
                        // // console.log("logged in create");
                        // // console.log(logged);
                        if (result && result.MessageId)
                            return [2 /*return*/, log];
                        else
                            return [2 /*return*/, undefined];
                        return [3 /*break*/, 3];
                    case 2:
                        error_5 = _a.sent();
                        console.log(error_5);
                        console.log('error in Logging Event');
                        return [2 /*return*/, undefined];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    __biZZC_SQS.sqs = new aws.SQS({ apiVersion: 'latest' });
    __biZZC_SQS.queueUrl = constants_1.SQSURL;
    __biZZC_SQS.archiveQueueURL = constants_1.ARCHIVINGQUEUE;
    __biZZC_SQS.solrQueueURL = constants_1.AGENTSOLRQUEUE;
    __biZZC_SQS.poll = false;
    __biZZC_SQS.Receivingparams = {
        AttributeNames: [
            "SentTimestamp"
        ],
        MaxNumberOfMessages: 10,
        MessageAttributeNames: [
            "All"
        ],
        QueueUrl: __biZZC_SQS.queueUrl,
        WaitTimeSeconds: 20,
        VisibilityTimeout: 30
    };
    return __biZZC_SQS;
}());
exports.__biZZC_SQS = __biZZC_SQS;
//# sourceMappingURL=aws-sqs.js.map