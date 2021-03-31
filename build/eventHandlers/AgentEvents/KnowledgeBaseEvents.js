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
var knowledgeBaseModel_1 = require("../../models/knowledgeBaseModel");
var PushNotificationFirebase_1 = require("../../actions/agentActions/PushNotificationFirebase");
var KnowledgeBaseEvents = /** @class */ (function () {
    function KnowledgeBaseEvents() {
    }
    KnowledgeBaseEvents.BindKnowledgeBaseEvents = function (socket, origin) {
        KnowledgeBaseEvents.AddKnowledgeBase(socket, origin);
        KnowledgeBaseEvents.RemoveKnowledgeBase(socket, origin);
        KnowledgeBaseEvents.UpdateKnowledgeBase(socket, origin);
        KnowledgeBaseEvents.GetKnowledgeBase(socket, origin);
        KnowledgeBaseEvents.ToggleKnowledgeBase(socket, origin);
    };
    KnowledgeBaseEvents.AddKnowledgeBase = function (socket, origin) {
        var _this = this;
        socket.on('addKnowledgeBase', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var _a, knowledgebase, knowledgebase, knowledgebase, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 11, , 12]);
                        _a = data.type;
                        switch (_a) {
                            case 'kpi': return [3 /*break*/, 1];
                            case 'sla': return [3 /*break*/, 4];
                            case 'itp': return [3 /*break*/, 4];
                            case 'news': return [3 /*break*/, 4];
                            case 'faq': return [3 /*break*/, 7];
                        }
                        return [3 /*break*/, 10];
                    case 1:
                        if (!(!data.group
                            || !data.subGroup
                            || !data.url
                            || !data.fileName
                            || !data.year
                            || !data.month
                            || !data.type)) return [3 /*break*/, 2];
                        callback({ status: 'error', message: 'invalidRequest' });
                        return [2 /*return*/];
                    case 2:
                        data.uploadedBy = socket.handshake.session.email;
                        data.uploadedDate = new Date().toISOString();
                        data.nsp = socket.handshake.session.nsp;
                        return [4 /*yield*/, knowledgeBaseModel_1.KnowledgeBaseModel.addKnowledgeBase(data)];
                    case 3:
                        knowledgebase = _b.sent();
                        if (knowledgebase && knowledgebase.insertedCount) {
                            callback({ status: 'ok' });
                            if (origin['settings']['api']['firebase']['key']) {
                                PushNotificationFirebase_1.SendNotification(origin['settings']['api']['firebase']['key'], 'default', 'KPI', 'New Document Added', {
                                    tag: data.type,
                                }, true);
                            }
                            return [2 /*return*/];
                        }
                        else {
                            callback({ status: 'error', code: 500 });
                            return [2 /*return*/];
                        }
                        _b.label = 4;
                    case 4:
                        if (!(!data.url
                            || !data.fileName
                            || !data.type)) return [3 /*break*/, 5];
                        //console.log('Invalid Request');
                        callback({ status: 'error', message: 'invalidRequest' });
                        return [2 /*return*/];
                    case 5:
                        //console.log('Inserting KnowledgeBase');
                        data.uploadedBy = socket.handshake.session.email;
                        data.uploadedDate = new Date().toISOString();
                        data.nsp = socket.handshake.session.nsp;
                        return [4 /*yield*/, knowledgeBaseModel_1.KnowledgeBaseModel.addKnowledgeBase(data)];
                    case 6:
                        knowledgebase = _b.sent();
                        if (knowledgebase && knowledgebase.insertedCount) {
                            callback({ status: 'ok' });
                            if (origin['settings']['api']['firebase']['key']) {
                                PushNotificationFirebase_1.SendNotification(origin['settings']['api']['firebase']['key'], 
                                // 'Hmehboob9054@sbtjapan.com',
                                (data.nsp == '/sps-uat') ? 'default' : data.nsp, data.fileName, data.description, {
                                    tag: data.type,
                                }, true);
                            }
                            return [2 /*return*/];
                        }
                        else {
                            callback({ status: 'error', code: 500 });
                            return [2 /*return*/];
                        }
                        _b.label = 7;
                    case 7:
                        if (!(!data.url || !data.fileName)) return [3 /*break*/, 8];
                        callback({ status: 'error', message: 'invalidRequest' });
                        return [2 /*return*/];
                    case 8:
                        //let usersList = await SessionManager.GetAllMobileVisitors(socket.handshake.session.nsp);
                        data.uploadedBy = socket.handshake.session.email;
                        data.uploadedDate = new Date().toISOString();
                        data.nsp = socket.handshake.session.nsp;
                        return [4 /*yield*/, knowledgeBaseModel_1.KnowledgeBaseModel.addKnowledgeBase(data)];
                    case 9:
                        knowledgebase = _b.sent();
                        if (knowledgebase && knowledgebase.insertedCount) {
                            callback({ status: 'ok' });
                            if (origin['settings']['api']['firebase']['key']) {
                                PushNotificationFirebase_1.SendNotification(origin['settings']['api']['firebase']['key'], 'default', 'FAQ', 'New Document Added', { tag: data.type }, true);
                            }
                            return [2 /*return*/];
                        }
                        else {
                            callback({ status: 'error', code: 500 });
                            return [2 /*return*/];
                        }
                        _b.label = 10;
                    case 10: return [3 /*break*/, 12];
                    case 11:
                        error_1 = _b.sent();
                        console.log(error_1);
                        console.log('error In KnowledgeBase');
                        return [3 /*break*/, 12];
                    case 12: return [2 /*return*/];
                }
            });
        }); });
    };
    KnowledgeBaseEvents.RemoveKnowledgeBase = function (socket, origin) {
        var _this = this;
        socket.on('removeKnowledgeBase', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var knowledgeBase, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, knowledgeBaseModel_1.KnowledgeBaseModel.removeKnowledgeBase(data.type, socket.handshake.session.nsp, data.filename)];
                    case 1:
                        knowledgeBase = _a.sent();
                        callback({ status: 'ok', knowledgeBaseList: knowledgeBase });
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        console.log(error_2);
                        console.log('error In KnowledgeBase');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    KnowledgeBaseEvents.UpdateKnowledgeBase = function (socket, origin) {
        socket.on('updateKnowledgeBase', function (data, callback) {
            try {
            }
            catch (error) {
                console.log(error);
                console.log('error In KnowledgeBase');
            }
        });
    };
    KnowledgeBaseEvents.GetKnowledgeBase = function (socket, origin) {
        var _this = this;
        socket.on('getKnowledgeBase', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var knowledgeBase, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        knowledgeBase = void 0;
                        if (!(data.type == 'documents')) return [3 /*break*/, 2];
                        return [4 /*yield*/, knowledgeBaseModel_1.KnowledgeBaseModel.GetKnowledgeBaseDocuments(socket.handshake.session.nsp)];
                    case 1:
                        knowledgeBase = _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, knowledgeBaseModel_1.KnowledgeBaseModel.GetKnowledgeBase(data.type, socket.handshake.session.nsp)];
                    case 3:
                        knowledgeBase = _a.sent();
                        _a.label = 4;
                    case 4:
                        callback({ status: 'ok', knowledgeBaseList: knowledgeBase });
                        return [3 /*break*/, 6];
                    case 5:
                        error_3 = _a.sent();
                        console.log(error_3);
                        console.log('error In KnowledgeBase');
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        }); });
    };
    KnowledgeBaseEvents.ToggleKnowledgeBase = function (socket, origin) {
        var _this = this;
        socket.on('toggleKnowledgeBase', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var knowledgeBaseList, knowledgeBase, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, knowledgeBaseModel_1.KnowledgeBaseModel.ToggleKnowledgeBase(data.type, socket.handshake.session.nsp, data.filename, data.active)];
                    case 1:
                        knowledgeBaseList = _a.sent();
                        return [4 /*yield*/, knowledgeBaseModel_1.KnowledgeBaseModel.GetKnowledgeBaseByFileName(data.type, socket.handshake.session.nsp, data.filename)];
                    case 2:
                        knowledgeBase = _a.sent();
                        if (knowledgeBase && knowledgeBase.active) {
                            PushNotificationFirebase_1.SendNotification(origin['settings']['api']['firebase']['key'], (knowledgeBase.nsp == '/sps-uat') ? 'default' : knowledgeBase.nsp, 
                            //'Hmehboob9054@sbtjapan.com',
                            knowledgeBase.fileName, knowledgeBase.description, {
                                tag: data.type,
                            }, true);
                        }
                        callback({ status: 'ok', knowledgeBaseList: knowledgeBaseList });
                        return [3 /*break*/, 4];
                    case 3:
                        error_4 = _a.sent();
                        console.log(error_4);
                        console.log('error In KnowledgeBase');
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
    };
    return KnowledgeBaseEvents;
}());
exports.KnowledgeBaseEvents = KnowledgeBaseEvents;
//# sourceMappingURL=KnowledgeBaseEvents.js.map