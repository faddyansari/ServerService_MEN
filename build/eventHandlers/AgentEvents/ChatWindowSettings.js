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
var companyModel_1 = require("../../models/companyModel");
var ChatWindowSettings = /** @class */ (function () {
    function ChatWindowSettings() {
    }
    ChatWindowSettings.BindChatWindowSettingsEvents = function (socket, origin) {
        ChatWindowSettings.GetChatWindowSettings(socket, origin);
        ChatWindowSettings.UpdateChatWindowSettings(socket, origin);
        ChatWindowSettings.UpdateChatWindowContentSettings(socket, origin);
        ChatWindowSettings.UpdateBackgroundImage(socket, origin);
        ChatWindowSettings.RemoveBackGroundImage(socket, origin);
    };
    ChatWindowSettings.GetChatWindowSettings = function (socket, origin) {
        var _this = this;
        socket.on('getDisplaySettings', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var nsp, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!(socket.handshake.session.type == 'Agents')) return [3 /*break*/, 2];
                        return [4 /*yield*/, companyModel_1.Company.getDisplaySettings(socket.handshake.session.nsp)];
                    case 1:
                        nsp = _a.sent();
                        callback({ status: 'ok', settings: nsp[0].settings.displaySettings });
                        return [3 /*break*/, 3];
                    case 2: throw new Error('Unauthorized Access');
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        error_1 = _a.sent();
                        callback({ status: 'error' });
                        console.log(error_1);
                        console.log('error in getAdmin settings');
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        }); });
    };
    ChatWindowSettings.UpdateBackgroundImage = function (socket, origin) {
        var _this = this;
        socket.on('updateBackgroundImage', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!(socket.handshake.session.type != 'Agents')) return [3 /*break*/, 1];
                        throw new Error('Unauthorized Access');
                    case 1: return [4 /*yield*/, companyModel_1.Company.UpdateBackGroundImage(socket.handshake.session.nsp, data, false)];
                    case 2:
                        _a.sent();
                        callback({ status: 'ok' });
                        _a.label = 3;
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        error_2 = _a.sent();
                        console.log(error_2);
                        console.log('error in updateBackgroundImage');
                        callback({ status: 'error', msg: 'unknown error' });
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        }); });
    };
    ChatWindowSettings.RemoveBackGroundImage = function (socket, origin) {
        var _this = this;
        socket.on('removeBackgroundImage', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!(socket.handshake.session.type != 'Agents')) return [3 /*break*/, 1];
                        throw new Error('Unauthorized Access');
                    case 1: return [4 /*yield*/, companyModel_1.Company.UpdateBackGroundImage(socket.handshake.session.nsp, data, true)];
                    case 2:
                        _a.sent();
                        callback({ status: 'ok' });
                        _a.label = 3;
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        error_3 = _a.sent();
                        console.log(error_3);
                        console.log('error in removeBackgroundImage');
                        callback({ status: 'error', msg: 'unknown error' });
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        }); });
    };
    //@Data 
    // Settings Name
    //Settings Data
    ChatWindowSettings.UpdateChatWindowSettings = function (socket, origin) {
        var _this = this;
        socket.on('updateDisplaySettings', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!(socket.handshake.session.type != 'Agents')) return [3 /*break*/, 1];
                        throw new Error('Unauthorized Access');
                    case 1: return [4 /*yield*/, companyModel_1.Company.updateNSPDisplaySettings(socket.handshake.session.nsp, data)];
                    case 2:
                        _a.sent();
                        callback({ status: 'ok' });
                        _a.label = 3;
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        error_4 = _a.sent();
                        callback({ status: 'error' });
                        console.log(error_4);
                        console.log('error in getAdmin settings');
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        }); });
    };
    ChatWindowSettings.UpdateChatWindowContentSettings = function (socket, origin) {
        var _this = this;
        socket.on('updateChatWindowForm', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        console.log('updateChatWindowForm');
                        console.log(data);
                        if (socket.handshake.session.type != 'Agents')
                            throw new Error('Unauthorized Access');
                        if (!(!data.settingsName || !data.settings)) return [3 /*break*/, 1];
                        throw new Error('Invalid Request');
                    case 1: return [4 /*yield*/, companyModel_1.Company.updateChatWindowFormSettings(socket.handshake.session.nsp, data)];
                    case 2:
                        _a.sent();
                        callback({ status: 'ok' });
                        _a.label = 3;
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        error_5 = _a.sent();
                        callback({ status: 'error' });
                        console.log(error_5);
                        console.log('error in getAdmin settings');
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        }); });
    };
    return ChatWindowSettings;
}());
exports.ChatWindowSettings = ChatWindowSettings;
//# sourceMappingURL=ChatWindowSettings.js.map