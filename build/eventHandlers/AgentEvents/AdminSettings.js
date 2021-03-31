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
var webhooksModel_1 = require("../../models/webhooksModel");
var agentModel_1 = require("../../models/agentModel");
var visitorModel_1 = require("../../models/visitorModel");
var aws_sqs_1 = require("../../actions/aws/aws-sqs");
var AdminSettingsEvents = /** @class */ (function () {
    function AdminSettingsEvents() {
    }
    AdminSettingsEvents.BindAdminSettingsEvents = function (socket, origin) {
        AdminSettingsEvents.GetChatSettings(socket, origin);
        AdminSettingsEvents.UpdateNSPSettings(socket, origin);
        AdminSettingsEvents.GetAdminSettings(socket, origin);
        AdminSettingsEvents.SetCustomscript(socket, origin);
        AdminSettingsEvents.GetWebHooks(socket, origin);
        AdminSettingsEvents.GenerateAppToken(socket, origin);
        AdminSettingsEvents.GetCurrentAppToken(socket, origin);
        AdminSettingsEvents.GetGroupsAutomationSettings(socket, origin);
        AdminSettingsEvents.GetTicketSettings(socket, origin);
        AdminSettingsEvents.SetTicketSettings(socket, origin);
        AdminSettingsEvents.SendInstallationCode(socket, origin);
        AdminSettingsEvents.GetCompanies(socket, origin);
        AdminSettingsEvents.GetCompaniesInfo(socket, origin);
        AdminSettingsEvents.GetEmailNotificationSettings(socket, origin);
        AdminSettingsEvents.SetEmailNotificationSettings(socket, origin);
        AdminSettingsEvents.GetWindowNotificationSettings(socket, origin);
        AdminSettingsEvents.SetWindowNotificationSettings(socket, origin);
    };
    AdminSettingsEvents.GetChatSettings = function (socket, origin) {
        var _this = this;
        socket.on('getChatSettings', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var settings, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        if (!(socket.handshake.session.type == 'Agents')) return [3 /*break*/, 2];
                        return [4 /*yield*/, companyModel_1.Company.getSettings(socket.handshake.session.nsp)];
                    case 1:
                        settings = _a.sent();
                        console.log('getChatSettings');
                        console.log(settings);
                        callback({ status: 'ok', data: settings[0].settings.chatSettings });
                        _a.label = 2;
                    case 2: return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        callback({ status: 'error' });
                        console.log(error_1);
                        console.log('error in getAdmin settings');
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
    };
    AdminSettingsEvents.GetWebHooks = function (socket, origin) {
        var _this = this;
        socket.on('getWebhooks', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var settings, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        if (!(socket.handshake.session.type == 'Agents')) return [3 /*break*/, 2];
                        return [4 /*yield*/, companyModel_1.Company.getWebHooks(socket.handshake.session.nsp)];
                    case 1:
                        settings = _a.sent();
                        // console.log(settings);
                        callback({ status: 'ok', customScript: settings[0].settings.customScript.userFetching });
                        _a.label = 2;
                    case 2: return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        callback({ status: 'error' });
                        console.log(error_2);
                        console.log('error in getAdmin settings');
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
    };
    AdminSettingsEvents.GetGroupsAutomationSettings = function (socket, origin) {
        var _this = this;
        socket.on('getGroupsAutomationSettings', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var settings, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        if (!(socket.handshake.session.type == 'Agents')) return [3 /*break*/, 2];
                        return [4 /*yield*/, companyModel_1.Company.getGroupsAutomationSettings(socket.handshake.session.nsp)];
                    case 1:
                        settings = _a.sent();
                        callback({ status: 'ok', groupsAutomationSettings: settings[0].settings.groupsAutomation });
                        _a.label = 2;
                    case 2: return [3 /*break*/, 4];
                    case 3:
                        error_3 = _a.sent();
                        callback({ status: 'error' });
                        console.log(error_3);
                        console.log('error in getAdmin settings');
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
    };
    AdminSettingsEvents.SetCustomscript = function (socket, origin) {
        var _this = this;
        socket.on('setCustomScript', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var settings, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        if (!!data.hasOwnProperty('script')) return [3 /*break*/, 1];
                        throw new Error('Invalid Request');
                    case 1:
                        if (!(data && data.script && (data.script.toLowerCase().indexOf('localstorage') != -1 || data.script.toLowerCase().indexOf('cookie') != -1))) return [3 /*break*/, 2];
                        callback({ status: 'error', code: '502' });
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, companyModel_1.Company.SetCustomScript(socket.handshake.session.nsp, data.script.toString())];
                    case 3:
                        settings = _a.sent();
                        if (settings && settings.value) {
                            callback({ status: 'ok', code: '200' });
                            return [2 /*return*/];
                        }
                        else {
                            callback({ status: 'error', code: '501' });
                            return [2 /*return*/];
                        }
                        _a.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_4 = _a.sent();
                        console.log(error_4);
                        console.log('Error in Setting Custom Script');
                        callback({ status: 'error', code: '500' });
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        }); });
    };
    AdminSettingsEvents.UpdateNSPSettings = function (socket, origin) {
        var _this = this;
        socket.on('updateNSPChatSettings', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var reason, error, emailPattern, modifiedObject, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        console.log('updateNSPChatSettings');
                        console.log(data);
                        reason = [];
                        error = false;
                        emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                        if (data.settingsName == 'inactivityTimeouts' && (data.settings.transferIn < 1 || data.settings.inactiveTimeout < 1 || data.settings.endchatTimeout < 1)) {
                            error = true;
                            if (data.settings.transferIn < 1 && data.settings.transferIn != -1)
                                reason.push('invalidTransferInTime');
                            if (data.settings.inactiveTimeout < 1 && data.settings.inactiveTimeout != -1)
                                reason.push('invalidInactiveTimeoutTime');
                            if (data.settings.endchatTimeout < 1 && data.settings.endchatTimeout != -1)
                                reason.push('invalidEndSessionTimeout');
                        }
                        // else if (data.settingsName == 'transcriptForwarding' && !(new RegExp(emailPattern).test(data.settings.emails[0]))) {
                        //     error = true;
                        //     reason.push('invalidEmail');
                        // } 
                        // else if (data.settingsName == 'assignments') {
                        //     if (data.settings.aEng == data.settings.mEng) {
                        //         error = true;
                        //         reason.push('invalidAssignmentSettings');
                        //     }
                        // if (data.settings.botEnabled && (!origin['workflow'] || (origin['workflow'] && !Object.keys(origin['workflow']).length))) {
                        //     error = true;
                        //     reason.push('workflowNotDefined');
                        // }
                        //     if (data.settings.aEng && !data.settings.ruleSets.length) {
                        //         error = true;
                        //         reason.push('ruleSetsEmpty');
                        //     }
                        // }
                        console.log(error);
                        if (!!error) return [3 /*break*/, 2];
                        return [4 /*yield*/, companyModel_1.Company.updateNSPChatSettings(socket.handshake.session.nsp, data)];
                    case 1:
                        modifiedObject = _a.sent();
                        if (modifiedObject && modifiedObject.value) {
                            callback({ status: 'ok', code: '200' });
                            origin['settings']['chatSettings'][data.settingsName] = data.settings;
                            socket.to('Admins').emit('settingsChanged', { settingsName: data.settingsName, settings: data.settings });
                            switch (data.settingsName) {
                                case 'assignments':
                                    //For Live Update Effect
                                    origin.to(agentModel_1.Agents.NotifyAll()).emit('updateChatSettings', { settingsName: 'assignments', aEng: data.settings.aEng, priorityAgent: data.priorityAgent });
                                    if (data.settings.botEnabled)
                                        origin.to(visitorModel_1.Visitor.BraodcastToVisitors()).emit('engageBot', { status: "ok", botEnabled: data.settings.botEnabled });
                                    break;
                                case 'permissions':
                                    origin.to(agentModel_1.Agents.NotifyAll()).emit('updateChatSettings', { settingsName: 'permissions', fileSharing: data.settings.forAgents });
                                    break;
                                case 'tagList':
                                    console.log('broadcast to alla agents');
                                    //origin.to(Agents.NotifyAll()).emit('updateChatSettings', { settingsName: 'tagList', tagList: data.settings.tagList });
                                    break;
                            }
                        }
                        else
                            callback({ status: 'error', code: '500' });
                        return [3 /*break*/, 3];
                    case 2:
                        callback({ status: 'error', code: '401', reason: reason });
                        _a.label = 3;
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        error_5 = _a.sent();
                        console.log('error in UpdateNSPSettings');
                        console.log(error_5);
                        callback({ response: 'error', code: '500' });
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        }); });
        socket.on('updateNSPCallSettings', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var modifiedObject, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!data.settings) return [3 /*break*/, 2];
                        return [4 /*yield*/, companyModel_1.Company.updateNSPCallSettings(socket.handshake.session.nsp, data)];
                    case 1:
                        modifiedObject = _a.sent();
                        if (modifiedObject && modifiedObject.value) {
                            callback({ status: 'ok', code: '200' });
                            origin['settings']['callSettings'] = data.settings;
                            socket.to('Admins').emit('settingsChanged', { settingsName: 'callSettings', settings: data.settings });
                            origin.to(agentModel_1.Agents.NotifyAll()).emit('updateCallSettings', { settings: data.settings });
                            origin.to(visitorModel_1.Visitor.BraodcastToVisitors()).emit('updateCallSettings', { settings: data.settings.permissions.v2a });
                        }
                        else
                            callback({ status: 'error', code: '500' });
                        return [3 /*break*/, 3];
                    case 2:
                        callback({ response: 'error', code: '500' });
                        _a.label = 3;
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        error_6 = _a.sent();
                        console.log('error in UpdateNSPSettings');
                        console.log(error_6);
                        callback({ response: 'error', code: '500' });
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        }); });
        socket.on('updateNSPContactSettings', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var modifiedObject, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!data.settings) return [3 /*break*/, 2];
                        return [4 /*yield*/, companyModel_1.Company.updateNSPContactSettings(socket.handshake.session.nsp, data.type, data.settings)];
                    case 1:
                        modifiedObject = _a.sent();
                        //console.log(modifiedObject.value.settings.contactSettings);
                        if (modifiedObject && modifiedObject.value) {
                            callback({ status: 'ok', code: '200', settings: modifiedObject.value.settings.contactSettings });
                            origin['settings']['contactSettings'] = modifiedObject.value.settings.contactSettings;
                            socket.to('Admins').emit('settingsChanged', { settingsName: 'contactSettings', settings: modifiedObject.value.settings.contactSettings });
                            origin.to(agentModel_1.Agents.NotifyAll()).emit('updateContactSettings', { settings: modifiedObject.value.settings.contactSettings });
                            origin.to(visitorModel_1.Visitor.BraodcastToVisitors()).emit('updateContactSettings', { settings: modifiedObject.value.settings.contactSettings });
                        }
                        else
                            callback({ status: 'error', code: '500' });
                        return [3 /*break*/, 3];
                    case 2:
                        callback({ response: 'error', code: '500' });
                        _a.label = 3;
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        error_7 = _a.sent();
                        console.log('error in UpdateNSPSettings');
                        console.log(error_7);
                        callback({ response: 'error', code: '500' });
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        }); });
        socket.on('updateNSPWMSettings', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var modifiedObject, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!data.settings) return [3 /*break*/, 2];
                        return [4 /*yield*/, companyModel_1.Company.updateNSPWMSettings(socket.handshake.session.nsp, data)];
                    case 1:
                        modifiedObject = _a.sent();
                        if (modifiedObject && modifiedObject.value) {
                            callback({ status: 'ok', code: '200' });
                            origin['settings']['widgetMarketingSettings'] = data.settings;
                            socket.to('Admins').emit('settingsChanged', { settingsName: 'widgetMarketingSettings', settings: data.settings });
                            origin.to(agentModel_1.Agents.NotifyAll()).emit('updateWidgetMarketingSettings', { settings: data.settings });
                            // origin.to(Visitor.BraodcastToVisitors()).emit('updateWidgetMarketingSettings', { settings: data.settings.permissions });
                        }
                        else
                            callback({ status: 'error', code: '500' });
                        return [3 /*break*/, 3];
                    case 2:
                        callback({ response: 'error', code: '500' });
                        _a.label = 3;
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        error_8 = _a.sent();
                        console.log('error in UpdateNSPSettings');
                        console.log(error_8);
                        callback({ response: 'error', code: '500' });
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        }); });
    };
    AdminSettingsEvents.GetAdminSettings = function (socket, origin) {
        var _this = this;
        socket.on('getAdminSettings', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var settings, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, companyModel_1.Company.getAdminSettings(socket.handshake.session.nsp)];
                    case 1:
                        settings = _a.sent();
                        callback({
                            status: 'ok',
                            aEng: settings[0].settings.chatSettings.assignments.aEng,
                            fileSharing: settings[0].settings.chatSettings.permissions.forAgents,
                            transcriptForwarding: settings[0].settings.chatSettings.transcriptForwarding,
                            callSettings: settings[0].settings.callSettings,
                            contactSettings: settings[0].settings.contactSettings,
                            widgetMarketingSettings: settings[0].settings.widgetMarketingSettings,
                            emailNotifications: settings[0].settings.emailNotifications,
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_9 = _a.sent();
                        console.log(error_9);
                        console.log('error in get AssignmentSettings');
                        callback({ status: 'error', code: '500' });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    AdminSettingsEvents.GenerateAppToken = function (socket, origin) {
        var _this = this;
        socket.on('generateAppToken', function (callback) { return __awaiter(_this, void 0, void 0, function () {
            var uuid, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, webhooksModel_1.Webhooks.setAppToken(socket.handshake.session.nsp)];
                    case 1:
                        uuid = _a.sent();
                        callback({
                            status: "ok",
                            uuid: uuid
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _a.sent();
                        callback({ status: 'err', err: err_1 });
                        console.log("Error occurred in generating app token");
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    AdminSettingsEvents.GetCurrentAppToken = function (socket, origin) {
        var _this = this;
        socket.on('getCurrentAppToken', function (callback) { return __awaiter(_this, void 0, void 0, function () {
            var uuid, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, webhooksModel_1.Webhooks.getValidAppToken(socket.handshake.session.nsp)];
                    case 1:
                        uuid = _a.sent();
                        callback({
                            status: "ok",
                            uuid: uuid
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        err_2 = _a.sent();
                        callback({ status: 'err', err: err_2 });
                        console.log("Error occurred in getting current app token");
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    AdminSettingsEvents.ToggleBot = function (socket, origin) {
        var _this = this;
        socket.on('toggleBot', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                }
                catch (error) {
                    console.log(error);
                    console.log('error in Toggling Bot');
                    callback({ status: 'error' });
                }
                return [2 /*return*/];
            });
        }); });
    };
    AdminSettingsEvents.GetTicketSettings = function (socket, origin) {
        var _this = this;
        socket.on('getTicketSettings', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var settings, error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, companyModel_1.Company.GetTicketSettings(socket.handshake.session.nsp)];
                    case 1:
                        settings = _a.sent();
                        callback({
                            status: 'ok',
                            ticketSettings: settings[0].settings.ticketSettings
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_10 = _a.sent();
                        console.log(error_10);
                        console.log('error in Getting Ticket Settings Bot');
                        callback({ status: 'error' });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    AdminSettingsEvents.GetEmailNotificationSettings = function (socket, origin) {
        var _this = this;
        socket.on('getEmailNotificationSettings', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var settings, error_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, companyModel_1.Company.GetEmailNotificationSettings(socket.handshake.session.nsp)];
                    case 1:
                        settings = _a.sent();
                        callback({
                            status: 'ok',
                            emailNotifications: settings[0].settings.emailNotifications
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_11 = _a.sent();
                        console.log(error_11);
                        console.log('error in Getting Email Notificaitions Settings');
                        callback({ status: 'error' });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    AdminSettingsEvents.GetWindowNotificationSettings = function (socket, origin) {
        var _this = this;
        socket.on('getWindowNotificationSettings', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var settings, error_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, companyModel_1.Company.GetWindowNotificationSettings(socket.handshake.session.nsp)];
                    case 1:
                        settings = _a.sent();
                        callback({
                            status: 'ok',
                            windowNotifications: settings[0].settings.windowNotifications
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_12 = _a.sent();
                        console.log(error_12);
                        console.log('error in Getting Email Notificaitions Settings');
                        callback({ status: 'error' });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    AdminSettingsEvents.SetTicketSettings = function (socket, origin) {
        var _this = this;
        socket.on('setTicketSettings', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var modifiedObject, error_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!data) return [3 /*break*/, 2];
                        return [4 /*yield*/, companyModel_1.Company.UpdateTicketSettings(socket.handshake.session.nsp, data)];
                    case 1:
                        modifiedObject = _a.sent();
                        if (modifiedObject && modifiedObject.value) {
                            callback({ status: 'ok', code: '200' });
                            origin['settings']['ticketSettings'] = data;
                        }
                        else
                            callback({ status: 'error', code: '500' });
                        return [3 /*break*/, 3];
                    case 2:
                        callback({ response: 'error', code: '500' });
                        _a.label = 3;
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        error_13 = _a.sent();
                        console.log('error in UpdateNSPSettings');
                        console.log(error_13);
                        callback({ response: 'error', code: '500' });
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        }); });
    };
    AdminSettingsEvents.SetEmailNotificationSettings = function (socket, origin) {
        var _this = this;
        socket.on('setEmailNotificationSettings', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var modifiedObject, error_14;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!data) return [3 /*break*/, 2];
                        return [4 /*yield*/, companyModel_1.Company.UpdateEmailNotificationSettings(socket.handshake.session.nsp, data.settingsName, data.settings)];
                    case 1:
                        modifiedObject = _a.sent();
                        if (modifiedObject && modifiedObject.value) {
                            callback({ status: 'ok', code: '200' });
                            origin['settings']['emailNotifications'][data.settingsName] = data.settings;
                            // console.log(origin['settings']['emailNotifications'][data.settingsName]);
                        }
                        else
                            callback({ status: 'error', code: '500' });
                        return [3 /*break*/, 3];
                    case 2:
                        callback({ response: 'error', code: '500' });
                        _a.label = 3;
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        error_14 = _a.sent();
                        console.log('error in UpdateNSPSettings');
                        console.log(error_14);
                        callback({ response: 'error', code: '500' });
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        }); });
    };
    AdminSettingsEvents.SetWindowNotificationSettings = function (socket, origin) {
        var _this = this;
        socket.on('setWindowNotificationSettings', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var modifiedObject, error_15;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!data) return [3 /*break*/, 2];
                        return [4 /*yield*/, companyModel_1.Company.UpdateWindowNotificationSettings(socket.handshake.session.nsp, data.settings)];
                    case 1:
                        modifiedObject = _a.sent();
                        if (modifiedObject && modifiedObject.value) {
                            callback({ status: 'ok', code: '200' });
                            origin.to(agentModel_1.Agents.NotifyAll()).emit('notifPermissionsChanged', { settings: data.settings });
                            origin['settings']['windowNotifications'] = data.settings;
                            // console.log(origin['settings']['emailNotifications'][data.settingsName]);
                        }
                        else
                            callback({ status: 'error', code: '500' });
                        return [3 /*break*/, 3];
                    case 2:
                        callback({ response: 'error', code: '500' });
                        _a.label = 3;
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        error_15 = _a.sent();
                        console.log('error in UpdateNSPSettings');
                        console.log(error_15);
                        callback({ response: 'error', code: '500' });
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        }); });
    };
    /**
        * @Data
        *  @sender : The One Who Requested the email
        *  @code : Licence Code The One Wants To Install
        *  @To : The One requester asked to send email code
        *  @Website : Website Name for which the code have asked for.
    */
    AdminSettingsEvents.SendInstallationCode = function (socket, origin) {
        var _this = this;
        socket.on('sendCode', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var companyInfo, error_16;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        if (!(data && data.email && data.sender)) return [3 /*break*/, 5];
                        return [4 /*yield*/, companyModel_1.Company.GetCompanyInfo(socket.handshake.session.nsp)];
                    case 1:
                        companyInfo = _a.sent();
                        if (!(companyInfo && companyInfo.length)) return [3 /*break*/, 3];
                        return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendMessage({
                                action: 'sendCode',
                                sender: data.sender,
                                email: data.email,
                                code: companyInfo[0].script,
                                website: companyInfo[0].company_info.company_website
                            })];
                    case 2:
                        _a.sent();
                        callback({ status: 'ok', code: '200' });
                        return [3 /*break*/, 4];
                    case 3:
                        callback({ status: 'error', code: '500' });
                        _a.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        callback({ response: 'error', code: '500' });
                        _a.label = 6;
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        error_16 = _a.sent();
                        console.log('error in Sending Installation Code');
                        console.log(error_16);
                        callback({ response: 'error', code: '500' });
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        }); });
    };
    AdminSettingsEvents.GetCompanies = function (socket, origin) {
        var _this = this;
        socket.on('getCompanies', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var companies, error_17;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!data) return [3 /*break*/, 2];
                        return [4 /*yield*/, companyModel_1.Company.GetCompanies()];
                    case 1:
                        companies = _a.sent();
                        if (companies && companies.length) {
                            callback({ status: 'ok', companies: companies });
                        }
                        else
                            callback({ status: 'error', code: '500' });
                        return [3 /*break*/, 3];
                    case 2:
                        callback({ response: 'error', code: '500' });
                        _a.label = 3;
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        error_17 = _a.sent();
                        console.log('error in getting companies');
                        console.log(error_17);
                        callback({ response: 'error', code: '500' });
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        }); });
    };
    AdminSettingsEvents.GetCompaniesInfo = function (socket, origin) {
        var _this = this;
        socket.on('getCompanyInfo', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var agents, error_18;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!data) return [3 /*break*/, 2];
                        return [4 /*yield*/, agentModel_1.Agents.getAllAgents(data.name)];
                    case 1:
                        agents = _a.sent();
                        if (agents && agents.length) {
                            // console.log(agents)
                            callback({ status: 'ok', agents: agents });
                        }
                        else
                            callback({ status: 'error', code: '500' });
                        return [3 /*break*/, 3];
                    case 2:
                        callback({ response: 'error', code: '500' });
                        _a.label = 3;
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        error_18 = _a.sent();
                        console.log('error in getting agents');
                        console.log(error_18);
                        callback({ response: 'error', code: '500' });
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        }); });
    };
    return AdminSettingsEvents;
}());
exports.AdminSettingsEvents = AdminSettingsEvents;
//# sourceMappingURL=AdminSettings.js.map