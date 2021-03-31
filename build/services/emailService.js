"use strict";
// Created By Saad Ismail Shaikh
// Date : 03-05-18
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
exports.EmailService = void 0;
/**
 * @Note The Following Module is used to Implement Retrtying Logic.
 * Retrying Logic is Inspired by Following Microsoft Retrying Design Pattern.
 * https://docs.microsoft.com/en-us/previous-versions/msp-n-p/dn589788(v=pandp.10)
 */
var retry = require("async-retry");
var aws_s3_1 = require("../actions/aws/aws-s3");
var uuid = require("uuid");
var aws_sqs_1 = require("../actions/aws/aws-sqs");
var EmailService = /** @class */ (function () {
    function EmailService() {
    }
    EmailService.getEmailServiceAddress = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, EmailService.emailServiceAddress];
            });
        });
    };
    EmailService.SendActivationEmail = function (data, retryAttempt) {
        if (retryAttempt === void 0) { retryAttempt = 0; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log('Sending Activation Email');
                return [2 /*return*/, aws_sqs_1.__biZZC_SQS.SendMessage({ action: 'sendActivationEmail', data: data })];
            });
        });
    };
    EmailService.SendNoReplyEmail = function (data, s3) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                // console.log('Sending No Reply Email');
                return [2 /*return*/, retry(function (async) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!s3) return [3 /*break*/, 2];
                                    return [4 /*yield*/, aws_s3_1.__BizzC_S3.PutObject(uuid.v4().toString(), data)];
                                case 1: return [2 /*return*/, _a.sent()];
                                case 2: return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendMessage(data)];
                                case 3: return [2 /*return*/, _a.sent()];
                            }
                        });
                    }); }, { retries: 5 })];
            });
        });
    };
    EmailService.SendSupportEmail = function (data, retryAttempt, s3) {
        if (retryAttempt === void 0) { retryAttempt = 0; }
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                console.log('Sending Support Email');
                return [2 /*return*/, retry(function (async) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!s3) return [3 /*break*/, 2];
                                    return [4 /*yield*/, aws_s3_1.__BizzC_S3.PutObject(uuid.v4().toString(), data)];
                                case 1: return [2 /*return*/, _a.sent()];
                                case 2: return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendMessage(data)];
                                case 3: return [2 /*return*/, _a.sent()];
                            }
                        });
                    }); }, { retries: 5 })];
            });
        });
    };
    EmailService.SendEmail = function (data, retryAttempt, s3) {
        if (retryAttempt === void 0) { retryAttempt = 0; }
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, retry(function (async) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!s3) return [3 /*break*/, 2];
                                    return [4 /*yield*/, aws_s3_1.__BizzC_S3.PutObject(uuid.v4().toString(), data)];
                                case 1: return [2 /*return*/, _a.sent()];
                                case 2: return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendMessage(data)];
                                case 3: return [2 /*return*/, _a.sent()];
                            }
                        });
                    }); }, { retries: 5, factor: 3, randomize: true })];
            });
        });
    };
    /**
   *
   * @param data { message : string , to : string , subject }
   */
    EmailService.NotifyAgentForTicket = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    // console.log(data);
                    return [2 /*return*/, aws_sqs_1.__biZZC_SQS.SendMessage({ action: 'sendEmailToAgent', data: data })];
                }
                catch (error) {
                    console.log(error);
                    console.log('error in NotifyingAgent For Ticket');
                }
                return [2 /*return*/];
            });
        });
    };
    EmailService.emailServiceAddress = (process.env.NODE_ENV != 'production') ? 'http://localhost:5000' : 'http://ec2-52-10-106-243.us-west-2.compute.amazonaws.com:8000';
    return EmailService;
}());
exports.EmailService = EmailService;
//# sourceMappingURL=emailService.js.map