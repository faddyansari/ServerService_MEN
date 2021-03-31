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
var TemplateDesignModel_1 = require("../../models/TemplateDesignModel");
var TemplateDesignEvents = /** @class */ (function () {
    function TemplateDesignEvents() {
    }
    TemplateDesignEvents.BindTemplateEvents = function (socket, origin) {
        TemplateDesignEvents.GetAllTemplates(socket, origin);
        TemplateDesignEvents.GetTemplateByID(socket, origin);
        TemplateDesignEvents.AddTemplate(socket, origin);
        TemplateDesignEvents.EditTemplate(socket, origin);
        TemplateDesignEvents.DeleteTemplate(socket, origin);
        TemplateDesignEvents.getLayoutByName(socket, origin);
    };
    TemplateDesignEvents.AddTemplate = function (socket, origin) {
        var _this = this;
        socket.on('addTemplate', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var template, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, TemplateDesignModel_1.EmailDesignTemplates.AddTemplate(data.template)];
                    case 1:
                        template = _a.sent();
                        if (template) {
                            callback({ status: 'ok', template: template.ops[0] });
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
    TemplateDesignEvents.DeleteTemplate = function (socket, origin) {
        var _this = this;
        socket.on('deleteTemplate', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var result, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, TemplateDesignModel_1.EmailDesignTemplates.DeleteTemplate(data.id, socket.handshake.session.nsp)];
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
                        error_2 = _a.sent();
                        callback({ status: 'error', msg: error_2 });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    TemplateDesignEvents.EditTemplate = function (socket, origin) {
        var _this = this;
        socket.on('editTemplate', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var templateUpdated, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, TemplateDesignModel_1.EmailDesignTemplates.EditTemplate(data.fid, data.template, socket.handshake.session.nsp, socket.handshake.session.email)];
                    case 1:
                        templateUpdated = _a.sent();
                        //console.log("after model",templateUpdated);
                        if (templateUpdated && templateUpdated.value) {
                            callback({ status: 'ok', templateUpdated: templateUpdated.value });
                        }
                        else {
                            callback({ status: 'error', code: 500, msg: 'Internal Server Error' });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        console.log(error_3);
                        console.log('error in editing Email Template');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    TemplateDesignEvents.GetAllTemplates = function (socket, origin) {
        var _this = this;
        socket.on('getAllTemplates', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var templates, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, TemplateDesignModel_1.EmailDesignTemplates.getAllTemplatesByNsp(socket.handshake.session.nsp)];
                    case 1:
                        templates = _a.sent();
                        if (templates && templates.length) {
                            callback({ status: 'ok', templates: templates });
                        }
                        else {
                            callback({ status: 'error', code: 500, msg: 'Internal Server Error' });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        console.log(error_4);
                        console.log('error in Getting Email Templates');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    TemplateDesignEvents.getLayoutByName = function (socket, origin) {
        var _this = this;
        socket.on('getLayoutByName', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var layout, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, TemplateDesignModel_1.EmailDesignTemplates.getLayoutByName(socket.handshake.session.nsp, data.templateName)];
                    case 1:
                        layout = _a.sent();
                        if (layout && layout.length) {
                            callback({ status: 'ok', layout: layout[0] });
                        }
                        else {
                            callback({ status: 'error', code: 500, msg: 'Internal Server Error' });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_5 = _a.sent();
                        console.log(error_5);
                        console.log('error in Getting Email Templates');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    TemplateDesignEvents.GetTemplateByID = function (socket, origin) {
        var _this = this;
        socket.on('getTemplateByID', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var template, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, TemplateDesignModel_1.EmailDesignTemplates.getTemplateByID(socket.handshake.session.nsp, data.id)];
                    case 1:
                        template = _a.sent();
                        if (template && template.length) {
                            callback({ status: 'ok', template: template[0] });
                        }
                        else {
                            callback({ status: 'error', code: 500, msg: 'Internal Server Error' });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_6 = _a.sent();
                        console.log(error_6);
                        console.log('error in Getting particular template');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    return TemplateDesignEvents;
}());
exports.TemplateDesignEvents = TemplateDesignEvents;
//# sourceMappingURL=TemplateDesignEvents.js.map