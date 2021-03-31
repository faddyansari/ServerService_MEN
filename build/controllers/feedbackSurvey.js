"use strict";
//Created By Saad Ismail Shaikh
//Date : 19-1-2018
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
exports.cannedFormRoutes = void 0;
//Express Module Reference
var express = require("express");
// Path Object to Define "Default/Static/Generic" Routes
var path = require("path");
var Utils_1 = require("./../helpers/Utils");
var ticketsModel_1 = require("../models/ticketsModel");
var emailService_1 = require("./../services/emailService");
var FeedBackSurveyModel_1 = require("../models/FeedBackSurveyModel");
var __biZZCMiddleWare_1 = require("../globals/__biZZCMiddleWare");
// Main Entry Point of our app or Home Route for our app that will be delivered on default routes (Our Single Page Application)
// Angular DIST output folder
// ../        (ROOT)
//  |---->../build/dist/index.html (Output of Angular app/src)
// Since this will contain our static assest hence this path will remain static.
//Router Object Which Will be used to validate requests in Request Handler.
var router = express.Router();
var publicPath = path.resolve(__dirname + '/../../');
router.post('/getFeedbackSurveyData', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c, encryptionClass, ticketInfo, ticket, survey, submittedSurvey, message, insertedMessage, error_1;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 10, , 11]);
                console.log("request data", req.body);
                if (!req.headers.origin) return [3 /*break*/, 8];
                _b = (_a = res).header;
                _c = ["Access-Control-Allow-Origin"];
                return [4 /*yield*/, emailService_1.EmailService.getEmailServiceAddress()];
            case 1:
                _b.apply(_a, _c.concat([_d.sent()]));
                res.header("Access-Control-Allow-Headers", "content-type");
                res.header('Access-Control-Allow-Methods', 'GET');
                res.header('Access-Control-Allow-Credentials', 'true');
                res.header('Connection', 'keep-alive');
                res.header('Content-Length', '0');
                res.header('Vary', 'Origin, Access-Control-Request-Headers');
                encryptionClass = new Utils_1.Encryption();
                return [4 /*yield*/, encryptionClass.decrypt(req.body.ticketInfo)];
            case 2:
                ticketInfo = _d.sent();
                ticketInfo = ticketInfo.split('-');
                ticket = {
                    from: ticketInfo[0],
                    to: ticketInfo[1],
                    ticketID: ticketInfo[2]
                };
                survey = void 0;
                return [4 /*yield*/, FeedBackSurveyModel_1.FeedBackSurveyModel.getActivatedSurvey()];
            case 3:
                submittedSurvey = _d.sent();
                if (submittedSurvey && submittedSurvey.length) {
                    submittedSurvey[0].formFields.forEach(function (inputs) {
                        inputs.submittedData = req.body[inputs.id];
                    });
                    survey = {
                        id: submittedSurvey[0]._id,
                        type: submittedSurvey[0].type,
                    };
                }
                message = {
                    datetime: new Date().toISOString(),
                    senderType: 'Visitor',
                    message: '',
                    from: ticket.from,
                    to: ticket.to,
                    replytoAddress: ticket.from,
                    tid: [ticket.ticketID],
                    attachment: [],
                    viewColor: '',
                    survey: survey,
                    submittedSurvey: submittedSurvey,
                    nsp: (submittedSurvey && submittedSurvey.length) ? submittedSurvey[0].nsp : '',
                };
                return [4 /*yield*/, ticketsModel_1.Tickets.InsertMessage(JSON.parse(JSON.stringify(message)), message.senderType)];
            case 4:
                insertedMessage = _d.sent();
                if (!insertedMessage) return [3 /*break*/, 6];
                res.status(200).send({ ticket: insertedMessage, status: 'success' });
                return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'gotNewTicketMessage', nsp: req.body.nsp, roomName: ['Admins'], data: insertedMessage.ops[0] })];
            case 5:
                _d.sent();
                return [3 /*break*/, 7];
            case 6:
                res.status(401).send({ status: 'failed' });
                _d.label = 7;
            case 7: return [3 /*break*/, 9];
            case 8:
                res.status(401).send();
                _d.label = 9;
            case 9: return [3 /*break*/, 11];
            case 10:
                error_1 = _d.sent();
                res.status(401).send();
                console.log(error_1);
                return [3 /*break*/, 11];
            case 11: return [2 /*return*/];
        }
    });
}); });
exports.cannedFormRoutes = router;
//# sourceMappingURL=feedbackSurvey.js.map