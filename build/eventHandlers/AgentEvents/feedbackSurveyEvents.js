"use strict";
//Created By Saad Ismail Shaikh 
// 01-08-2018
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
//Native Modules
var FeedBackSurveyModel_1 = require("../../models/FeedBackSurveyModel");
var FeedbackSurveyEvents = /** @class */ (function () {
    function FeedbackSurveyEvents() {
    }
    FeedbackSurveyEvents.BindFeedbackSurveyEvents = function (socket, origin) {
        FeedbackSurveyEvents.GetAllSurveys(socket, origin);
        FeedbackSurveyEvents.AddSurvey(socket, origin);
        FeedbackSurveyEvents.UpdateSurvey(socket, origin);
        FeedbackSurveyEvents.DeleteSurvey(socket, origin);
        FeedbackSurveyEvents.ToggleActivation(socket, origin);
        FeedbackSurveyEvents.checkInTicket(socket, origin);
        // FeedbackSurveyEvents.demo(socket, origin);
    };
    FeedbackSurveyEvents.AddSurvey = function (socket, origin) {
        var _this = this;
        socket.on('addSurvey', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var survey, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, FeedBackSurveyModel_1.FeedBackSurveyModel.AddSurvey(data.surveyObj)];
                    case 1:
                        survey = _a.sent();
                        if (survey) {
                            callback({ status: 'ok', surveyInserted: survey.ops[0] });
                        }
                        else {
                            callback({ status: 'error', code: 500, msg: 'Internal Server Error' });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.log(error_1);
                        console.log('error in creating Email Template');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    // private static demo(socket, origin: SocketIO.Namespace) {
    //     socket.on('demo', async (data, callback) => {
    //         try {
    //             let survey = await FeedBackSurveyModel.getActivatedSurvey();
    //             if (survey) {
    //                 let response: S3.DeleteObjectOutput | SQS.SendMessageResult | AWSError | undefined;
    //                 console.log("survey", survey);
    //                 response = await EmailService.SendEmail({
    //                     action: 'sendDemoEmail',
    //                     surveyData: survey,
    //                     nsp: socket.handshake.session.nsp.substring(1),
    //                 }, 5, true);
    //                 callback({ status: 'ok' });
    //             }
    //         } catch (error) {
    //             console.log(error);
    //             console.log('error in creating Email Template')
    //         }
    //     });
    // }
    FeedbackSurveyEvents.checkInTicket = function (socket, origin) {
        var _this = this;
        socket.on('checkInTicket', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var result, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, FeedBackSurveyModel_1.FeedBackSurveyModel.checkInTicket(data.id, socket.handshake.session.nsp)];
                    case 1:
                        result = _a.sent();
                        if (result && result.length) {
                            callback({ status: 'ok', exists: true });
                        }
                        else {
                            callback({ status: 'error', exists: false });
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
    FeedbackSurveyEvents.DeleteSurvey = function (socket, origin) {
        var _this = this;
        socket.on('deleteSurvey', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var result, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, FeedBackSurveyModel_1.FeedBackSurveyModel.DeleteSurvey(data.id, socket.handshake.session.nsp)];
                    case 1:
                        result = _a.sent();
                        if (result) {
                            callback({ status: 'ok', msg: "Template Deleted Successfully!" });
                        }
                        else {
                            callback({ status: 'error' });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        callback({ status: 'error', msg: error_3 });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    FeedbackSurveyEvents.UpdateSurvey = function (socket, origin) {
        var _this = this;
        socket.on('updateSurvey', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var surveyUpdated, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        data.updatedSurvey.lastModified = {};
                        data.updatedSurvey.lastModified.date = new Date().toISOString();
                        data.updatedSurvey.lastModified.by = socket.handshake.session.email;
                        console.log("updatedSurvey", data.updatedSurvey);
                        return [4 /*yield*/, FeedBackSurveyModel_1.FeedBackSurveyModel.UpdateSurvey(data.fid, data.updatedSurvey, socket.handshake.session.nsp)];
                    case 1:
                        surveyUpdated = _a.sent();
                        if (surveyUpdated && surveyUpdated.value) {
                            callback({ status: 'ok', surveyUpdated: surveyUpdated.value });
                        }
                        else {
                            callback({ status: 'error', code: 500, msg: 'Internal Server Error' });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        console.log(error_4);
                        console.log('error in editing Email Template');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    FeedbackSurveyEvents.ToggleActivation = function (socket, origin) {
        var _this = this;
        socket.on('activateSurvey', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var lastModified, surveyActivated, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        lastModified = {
                            date: new Date().toISOString(),
                            by: socket.handshake.session.email
                        };
                        return [4 /*yield*/, FeedBackSurveyModel_1.FeedBackSurveyModel.toggleActivation(data.fid, data.activated, socket.handshake.session.nsp, lastModified)];
                    case 1:
                        surveyActivated = _a.sent();
                        if (surveyActivated && surveyActivated.value) {
                            callback({ status: 'ok', surveyUpdated: surveyActivated.value, lastModified: lastModified });
                        }
                        else {
                            callback({ status: 'error', code: 500, msg: 'Internal Server Error' });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_5 = _a.sent();
                        console.log(error_5);
                        console.log('error in activating survey');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    FeedbackSurveyEvents.GetAllSurveys = function (socket, origin) {
        var _this = this;
        socket.on('getSurveysByNSP', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var surveys, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, FeedBackSurveyModel_1.FeedBackSurveyModel.getSurveysByNSP(socket.handshake.session.nsp)];
                    case 1:
                        surveys = _a.sent();
                        if (surveys && surveys.length) {
                            callback({ status: 'ok', surveys: surveys });
                        }
                        else {
                            callback({ status: 'error', code: 500, msg: 'Internal Server Error' });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_6 = _a.sent();
                        console.log(error_6);
                        console.log('error in Getting Email Templates');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    return FeedbackSurveyEvents;
}());
exports.FeedbackSurveyEvents = FeedbackSurveyEvents;
//# sourceMappingURL=feedbackSurveyEvents.js.map