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
var visitorModel_1 = require("../../models/visitorModel");
var conversationModel_1 = require("../../models/conversationModel");
var visitorSessionmodel_1 = require("../../models/visitorSessionmodel");
var CRMEvents = /** @class */ (function () {
    function CRMEvents() {
    }
    CRMEvents.BindCRMEvents = function (socket, origin) {
        CRMEvents.GetVisitorsForCRM(socket, origin);
        CRMEvents.GetCustomerConversations(socket, origin);
        CRMEvents.GetMoreCustomerConversations(socket, origin);
        CRMEvents.GetCustomerConversationDetails(socket, origin);
        CRMEvents.GetMoreCustomersByCid(socket, origin);
        CRMEvents.FetchCustomersForSearch(socket, origin);
        CRMEvents.GetCustomerSessionDetails(socket, origin);
    };
    CRMEvents.GetVisitorsForCRM = function (socket, origin) {
        var _this = this;
        socket.on('customerList', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var list, updatedList, error_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, visitorModel_1.Visitor.getAllVisitors(socket.handshake.session.nsp)];
                    case 1:
                        list = _a.sent();
                        if (!(list && list.length)) return [3 /*break*/, 3];
                        updatedList = list.map(function (customer) { return __awaiter(_this, void 0, void 0, function () {
                            var convo;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, conversationModel_1.Conversations.getCustomerConversations(customer.deviceID, socket.handshake.session.nsp)];
                                    case 1:
                                        convo = _a.sent();
                                        if (convo && convo.length)
                                            customer.convoLength = convo.length;
                                        else
                                            customer.convoLength = 0;
                                        return [2 /*return*/, customer];
                                }
                            });
                        }); });
                        return [4 /*yield*/, Promise.all(updatedList)];
                    case 2:
                        _a.sent();
                        callback({ status: 'ok', list: list });
                        return [3 /*break*/, 4];
                    case 3:
                        callback({ status: 'ok', list: [] });
                        _a.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_1 = _a.sent();
                        console.log(error_1);
                        callback({ status: error_1 });
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        }); });
    };
    CRMEvents.GetCustomerConversations = function (socket, origin) {
        var _this = this;
        socket.on('CustomerConversationsList', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var conversations, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        conversations = void 0;
                        if (!(data && data.deviceID)) return [3 /*break*/, 2];
                        return [4 /*yield*/, conversationModel_1.Conversations.getCustomerConversations(data.deviceID, socket.handshake.session.nsp)];
                    case 1:
                        conversations = _a.sent();
                        _a.label = 2;
                    case 2:
                        callback({ status: 'ok', conversations: conversations });
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        console.log(error_2);
                        callback({ status: error_2 });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
    };
    CRMEvents.GetMoreCustomerConversations = function (socket, origin) {
        var _this = this;
        socket.on('MoreCustomerConversationsList', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var conversations, chatsCheck, noMoreChats, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, conversationModel_1.Conversations.getMoreConversationsByDeviceID(data.deviceID, data.id)];
                    case 1:
                        conversations = _a.sent();
                        chatsCheck = void 0;
                        if (!(conversations && conversations.length > 0)) return [3 /*break*/, 3];
                        return [4 /*yield*/, conversationModel_1.Conversations.getMoreConversationsByDeviceID(data.deviceID, conversations[conversations.length - 1]._id)];
                    case 2:
                        chatsCheck = _a.sent();
                        _a.label = 3;
                    case 3:
                        noMoreChats = void 0;
                        if (chatsCheck && chatsCheck.length)
                            noMoreChats = false;
                        else
                            noMoreChats = true;
                        callback({ status: 'ok', conversations: conversations, noMoreChats: noMoreChats });
                        return [3 /*break*/, 5];
                    case 4:
                        error_3 = _a.sent();
                        console.log(error_3);
                        callback({ status: error_3 });
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        }); });
    };
    CRMEvents.GetCustomerConversationDetails = function (socket, origin) {
        var _this = this;
        socket.on('SelectedConversationDetails', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var msgs, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, conversationModel_1.Conversations.getMessagesByCid(data.cid)];
                    case 1:
                        msgs = _a.sent();
                        callback({ status: 'ok', msgList: msgs });
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        console.log(error_4);
                        callback({ status: error_4 });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    CRMEvents.GetMoreCustomersByCid = function (socket, origin) {
        var _this = this;
        socket.on('getMoreCustomers', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var customers, updatedList, error_5;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, visitorModel_1.Visitor.getMoreCustomersByCid(socket.handshake.session, data.id)];
                    case 1:
                        customers = _a.sent();
                        if (!(customers && customers.length)) return [3 /*break*/, 3];
                        updatedList = customers.map(function (customer) { return __awaiter(_this, void 0, void 0, function () {
                            var convo;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, conversationModel_1.Conversations.getCustomerConversations(customer.deviceID, socket.handshake.session.nsp)];
                                    case 1:
                                        convo = _a.sent();
                                        if (convo && convo.length)
                                            customer.convoLength = convo.length;
                                        else
                                            customer.convoLength = 0;
                                        return [2 /*return*/, customer];
                                }
                            });
                        }); });
                        return [4 /*yield*/, Promise.all(updatedList)];
                    case 2:
                        _a.sent();
                        callback({ status: 'ok', customers: customers });
                        return [3 /*break*/, 4];
                    case 3:
                        callback({ status: 'ok', customers: [] });
                        _a.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_5 = _a.sent();
                        console.log(error_5);
                        callback({ status: error_5 });
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        }); });
    };
    CRMEvents.FetchCustomersForSearch = function (socket, origin) {
        var _this = this;
        socket.on('searchCustomers', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var customerList, updatedList, error_6;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, visitorModel_1.Visitor.searchCustomers(socket.handshake.session.nsp, data.keyword, data.chunk)];
                    case 1:
                        customerList = _a.sent();
                        if (!(customerList && customerList.length)) return [3 /*break*/, 3];
                        updatedList = customerList.map(function (customer) { return __awaiter(_this, void 0, void 0, function () {
                            var convo;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, conversationModel_1.Conversations.getCustomerConversations(customer.deviceID, socket.handshake.session.nsp)];
                                    case 1:
                                        convo = _a.sent();
                                        if (convo && convo.length)
                                            customer.convoLength = convo.length;
                                        else
                                            customer.convoLength = 0;
                                        return [2 /*return*/, customer];
                                }
                            });
                        }); });
                        return [4 /*yield*/, Promise.all(updatedList)];
                    case 2:
                        _a.sent();
                        callback({ status: 'ok', customerList: customerList });
                        return [3 /*break*/, 4];
                    case 3:
                        callback({ customerList: [] });
                        _a.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_6 = _a.sent();
                        console.log('Error in Search Contacts');
                        console.log(error_6);
                        callback({ status: error_6 });
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        }); });
    };
    CRMEvents.GetCustomerSessionDetails = function (socket, origin) {
        var _this = this;
        socket.on('getCrmSessionDetails', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var sessionDetails, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, visitorSessionmodel_1.visitorSessions.getVisitorSession(data.session._id)];
                    case 1:
                        sessionDetails = _a.sent();
                        callback({ status: 'ok', sessionDetails: sessionDetails });
                        return [3 /*break*/, 3];
                    case 2:
                        error_7 = _a.sent();
                        console.log(error_7);
                        callback({ status: error_7 });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    return CRMEvents;
}());
exports.CRMEvents = CRMEvents;
//# sourceMappingURL=crmEvents.js.map