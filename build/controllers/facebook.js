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
exports.FBRoutes = void 0;
var express = require("express");
var ticketsModel_1 = require("../models/ticketsModel");
var __biZZCMiddleWare_1 = require("../globals/__biZZCMiddleWare");
//Load The Model For The First Time
// if (!Visitor.initialized) {
//     Visitor.Initialize();
// }
var router = express.Router();
router.use(function (req, res, next) {
    if (req.headers.origin) {
        res.header("Access-Control-Allow-Origin", req.headers.origin);
        res.header("Access-Control-Allow-Headers", "content-type");
        res.header('Access-Control-Allow-Methods', 'GET');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Connection', 'keep-alive');
        res.header('Content-Length', '0');
        res.header('Vary', 'Origin, Access-Control-Request-Headers');
    }
    next();
});
router.post('/notification', function (req, res) {
    console.log("POST /ticketFB/notification");
    // console.log('req')
    // console.log(req.body)
    var company = req.body.company;
    var events = req.body.changes;
    // create object to sent events to frontend
    events.forEach(function (event) { return __awaiter(void 0, void 0, void 0, function () {
        var randomColor, ticket, createTicketOp, tid, ticketMessage, createMessageOp;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('event');
                    console.log(event);
                    if (!(event.field == "feed")) return [3 /*break*/, 8];
                    randomColor = "#00000070".replace(/0/g, function () { return (~~(Math.random() * 16)).toString(16); });
                    ticket = {
                        "datetime": new Date().toISOString(),
                        "lasttouchedTime": new Date().toISOString(),
                        "nsp": company.name,
                        "mergedTicketIds": [],
                        "agentName": "",
                        "from": event.value.from.id,
                        "state": "OPEN",
                        "source": "facebook",
                        "ticketlog": [],
                        "createdBy": "Visitor",
                        "viewState": "UNREAD",
                        "type": "facebook",
                        "group": "",
                        "assigned_to": "",
                        "viewColor": randomColor,
                        "visitor": { name: event.value.from.name, "email": event.value.from.id },
                        "subject": "Inquiry from facebook",
                        "slaPolicy": {
                            reminderResolution: false,
                            reminderResponse: false,
                            violationResponse: false,
                            violationResolution: false
                        },
                        assignmentList: []
                    };
                    return [4 /*yield*/, ticketsModel_1.Tickets.CreateTicket(ticket)];
                case 1:
                    createTicketOp = _a.sent();
                    console.log('createTicketOp');
                    console.log(createTicketOp);
                    if (!(createTicketOp && createTicketOp.result && createTicketOp.result.n == 1)) return [3 /*break*/, 6];
                    tid = createTicketOp.ops[0]._id;
                    ticketMessage = {
                        "datetime": new Date().toISOString(),
                        "from": event.value.from.id,
                        "message": event.value.message,
                        "messageId": [],
                        "senderType": "Visitor",
                        "tid": tid,
                        "to": "beedesk@sbtjapan.bizzchats.com",
                        "attachment": [],
                        "replytoAddress": "",
                        "viewColor": randomColor,
                        "nsp": company.name
                    };
                    return [4 /*yield*/, ticketsModel_1.Tickets.InsertMessage(ticketMessage)];
                case 2:
                    createMessageOp = _a.sent();
                    if (!(createMessageOp && createMessageOp.result && createMessageOp.result.n == 1)) return [3 /*break*/, 4];
                    // update view
                    return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({
                            action: 'emit', to: 'A',
                            broadcast: false,
                            eventName: 'newFBTicket',
                            nsp: company.name,
                            roomName: [ticket.group],
                            data: { ticket: createTicketOp.ops[0], company: company }
                        })];
                case 3:
                    // update view
                    _a.sent();
                    return [2 /*return*/];
                case 4:
                    console.log("Error in creating ticket message");
                    _a.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    console.log("Error in creating ticket");
                    return [2 /*return*/];
                case 7: return [3 /*break*/, 9];
                case 8:
                    console.log("Unable to recognise event. Abort handling.");
                    _a.label = 9;
                case 9: return [2 /*return*/];
            }
        });
    }); });
});
exports.FBRoutes = router;
//# sourceMappingURL=facebook.js.map