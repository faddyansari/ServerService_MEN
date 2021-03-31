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
exports.Company = void 0;
// Created By Saad Ismail Shaikh
// Date : 22-1-18
var mongodb_1 = require("mongodb");
var agentModel_1 = require("./agentModel");
var constants_1 = require("../globals/config/constants");
var Companies_DB_1 = require("../globals/config/databses/Companies-DB");
var aws_sqs_1 = require("../actions/aws/aws-sqs");
var __biZZCMiddleWare_1 = require("../globals/__biZZCMiddleWare");
var URL = require('url').URL;
var crypto = require('crypto');
var Company = /** @class */ (function () {
    function Company() {
    }
    Company.Initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, error_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 3, , 4]);
                        _a = this;
                        return [4 /*yield*/, Companies_DB_1.CompaniesDB.connect()];
                    case 1:
                        _a.db = _c.sent();
                        _b = this;
                        return [4 /*yield*/, this.db.createCollection('companies')];
                    case 2:
                        _b.collection = _c.sent();
                        console.log(this.collection.collectionName);
                        Company.initialized = true;
                        return [2 /*return*/, Company.initialized];
                    case 3:
                        error_1 = _c.sent();
                        console.log('error in Initializing Company Model');
                        throw new Error(error_1);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Company.CheckCompany = function (companyurl) {
        try {
            //console.log(companyurl);
            //console.log((new URL(companyurl).hostname));
            return this.collection
                .find({ name: '/' + (new URL(companyurl).hostname) })
                .limit(1)
                .toArray();
        }
        catch (error) {
            console.log(error);
            throw new Error("Error in Check Company In Exists");
        }
    };
    Company.GetTempProfile = function (id) {
        try {
            //console.log(companyurl);
            //console.log((new URL(companyurl).hostname));
            return this.db.collection('tempProfile')
                .find({ _id: new mongodb_1.ObjectID(id) })
                .limit(1)
                .toArray();
        }
        catch (error) {
            console.log(error);
            throw new Error("Error in Check Company In Exists");
        }
    };
    Company.generateScript = function (hash) {
        return "\n<script type=\"text/javascript\" async>\n    if (window.__bizC == undefined) window.__bizC = {};\n    window.__bizC['license'] = '" + hash + "';  var scr = document.createElement('script');\n    scr.type = 'text/javascript';  scr.src = 'https://app.beelinks.solutions/cw/license'; scr.async = true;\n    var s = document.getElementsByTagName('script')[0];  s.parentNode.insertBefore(scr, s);\n</script>";
    };
    Company.setAuthToken = function (email, password, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var hash;
            return __generator(this, function (_a) {
                try {
                    hash = crypto.createHash('sha256').update(new Date().getTime() + email + password + nsp).digest('hex');
                    return [2 /*return*/, this.collection.findOneAndUpdate({ email: email, password: password, name: nsp }, { $set: { companyToken: hash } }, { upsert: false, returnOriginal: false })];
                }
                catch (err) {
                    console.log(err);
                    console.log('Error in setting auth token');
                }
                return [2 /*return*/];
            });
        });
    };
    Company.verifylicense = function (license) {
        var _a;
        return this.collection.find({
            license: license
        }, {
            fields: (_a = {
                    company_info: 1,
                    name: 1,
                    deactivated: 1,
                    package: 1
                },
                _a['settings.callSettings.permissions.v2a'] = 1,
                _a['settings.widgetMarketingSettings.permissions.news'] = 1,
                _a['settings.widgetMarketingSettings.permissions.promotions'] = 1,
                _a['settings.widgetMarketingSettings.permissions.faqs'] = 1,
                _a['settings.displaySettings'] = 1,
                _a['settings.customScript'] = 1,
                _a['settings.chatSettings.permissions'] = 1,
                _a['settings.ticketSettings.allowedAgentAvailable'] = 1,
                _a['settings.schemas'] = 1,
                _a)
        })
            .limit(1).toArray();
    };
    Company.GetLogoTranscript = function (nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.collection.find({
                            name: nsp
                        }, {
                            fields: (_a = {},
                                _a['settings.chatSettings.transcriptLogo'] = 1,
                                _a)
                        })
                            .limit(1).toArray()];
                    case 1: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    Company.GetTags = function (nsp) {
        var _a;
        try {
            return this.collection.find({
                name: nsp
            }, {
                fields: (_a = {},
                    _a['settings.chatSettings.tagList'] = 1,
                    _a)
            })
                .limit(1).toArray();
        }
        catch (error) {
            console.log(error);
            console.log('Error in Getting Tags in Company Model');
            return undefined;
        }
    };
    Company.verifylicenseMobile = function (license) {
        var _a;
        return this.collection.find({
            license: license
        }, {
            fields: (_a = {
                    company_info: 1,
                    name: 1
                },
                _a['settings.chatSettings.permissions'] = 1,
                _a['settings.displaySettings'] = 1,
                _a)
        })
            .limit(1).toArray();
    };
    Company.getScript = function (nsp) {
        //console.log(nsp);
        return this.collection.find({ name: nsp }, { fields: { script: 1 } }).toArray();
    };
    Company.GetCompanyInfo = function (nsp) {
        //console.log(nsp);
        return this.collection.find({ name: nsp }, { fields: { script: 1, company_info: 1 } }).toArray();
    };
    Company.GetCompanies = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.collection.find().toArray()];
            });
        });
    };
    Company.GetCompaniesNsp = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.collection.find({}, {
                        fields: {
                            _id: 0,
                            name: 1,
                        }
                    }).toArray()];
            });
        });
    };
    Company.getPackages = function (nsp) {
        return this.collection.find({ name: nsp }, {
            fields: {
                _id: 0,
                package: 1
            }
        })
            .limit(1).toArray();
    };
    Company.GetSubscription = function (name) {
        return this.db.collection('packages').find({ name: name })
            .limit(1).toArray();
    };
    Company.getSettings = function (nsp) {
        return this.collection.find({ name: nsp }, {
            fields: {
                _id: 0,
                'settings.chatSettings': 1,
                'settings.emailNotifications': 1,
                'settings.iconnSettings': 1
            }
        })
            .limit(1).toArray();
    };
    Company.GetChatSettings = function (nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var companySettings;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.collection.find({ name: nsp }, {
                            fields: {
                                _id: 0,
                                'settings.chatSettings': 1,
                            }
                        })
                            .limit(1).toArray()];
                    case 1:
                        companySettings = _a.sent();
                        if (companySettings && companySettings.length)
                            return [2 /*return*/, companySettings[0]];
                        else
                            return [2 /*return*/, undefined];
                        return [2 /*return*/];
                }
            });
        });
    };
    Company.GetVerificationStatus = function (nsp) {
        return this.collection.find({ name: nsp }, {
            fields: {
                _id: 0,
                'settings.verified': 1,
                'createdAt': 1,
                'expiry': 1,
                'package': 1,
                'settings.permissions': 1,
                'settings.authentication': 1,
                'settings.windowNotifications': 1,
                'settings.schemas': 1
            }
        })
            .limit(1).toArray();
    };
    Company.getWebHooks = function (nsp) {
        return this.collection.find({ name: nsp }, {
            fields: {
                _id: 0,
                'settings.customScript': 1,
            }
        })
            .limit(1).toArray();
    };
    Company.getGroupsAutomationSettings = function (nsp) {
        return this.collection.find({ name: nsp }, {
            fields: {
                _id: 0,
                'settings.groupsAutomation': 1,
            }
        })
            .limit(1).toArray();
    };
    Company.getDisplaySettings = function (nsp) {
        return this.collection.find({ name: nsp }, {
            fields: {
                _id: 0,
                'settings.displaySettings': 1
            }
        })
            .limit(1).toArray();
    };
    Company.getAdminSettings = function (nsp) {
        //console.log(nsp);
        return this.collection.find({ name: nsp }, {
            fields: {
                _id: 0,
                'settings.chatSettings': 1,
                'settings.callSettings': 1,
                'settings.contactSettings': 1,
                'settings.widgetMarketingSettings': 1
            }
        })
            .limit(1).toArray();
    };
    Company.GetTicketSettings = function (nsp) {
        //console.log(nsp);
        return this.collection.find({ name: nsp }, {
            fields: {
                _id: 0,
                'settings.ticketSettings': 1
            }
        })
            .limit(1).toArray();
    };
    Company.GetEmailNotificationSettings = function (nsp) {
        //console.log(nsp);
        return this.collection.find({ name: nsp }, {
            fields: {
                _id: 0,
                'settings.emailNotifications': 1
            }
        })
            .limit(1).toArray();
    };
    Company.GetWindowNotificationSettings = function (nsp) {
        //console.log(nsp);
        return this.collection.find({ name: nsp }, {
            fields: {
                _id: 0,
                'settings.windowNotifications': 1
            }
        })
            .limit(1).toArray();
    };
    //#region Update Settings
    Company.updateNSPChatSettings = function (nsp, data) {
        var _a;
        return this.collection.findOneAndUpdate({ name: nsp }, {
            $set: (_a = {},
                _a["settings.chatSettings." + data.settingsName] = data.settings,
                _a)
        }, { returnOriginal: false, upsert: false });
    };
    Company.updateNSPCallSettings = function (nsp, data) {
        var _a;
        return this.collection.findOneAndUpdate({ name: nsp }, {
            $set: (_a = {},
                _a["settings.callSettings"] = data.settings,
                _a)
        }, { returnOriginal: false, upsert: false });
    };
    Company.updateNSPContactSettings = function (nsp, type, settings) {
        var _a;
        return this.collection.findOneAndUpdate({ name: nsp }, {
            $set: (_a = {},
                _a["settings.contactSettings." + type] = settings,
                _a)
        }, { returnOriginal: false, upsert: false });
    };
    Company.updateNSPPermissions = function (nsp, userRole, permissions, role, push) {
        if (push === void 0) { push = false; }
        return __awaiter(this, void 0, void 0, function () {
            var company, err_1;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 5, , 6]);
                        permissions.updatedOn = new Date().toISOString();
                        if (!push) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.collection.find({ name: nsp }).limit(1).toArray()];
                    case 1:
                        company = _c.sent();
                        if (!(company && company.length)) return [3 /*break*/, 3];
                        company[0].settings.permissions.superadmin.settings.rolesAndPermissions.canView.push(role);
                        company[0].settings.permissions.admin.settings.rolesAndPermissions.canView.push(role);
                        if (userRole != 'admin' && userRole != 'superadmin') {
                            company[0].settings.permissions[userRole].settings.rolesAndPermissions.canView.push(role);
                        }
                        Object.assign(company[0].settings.authentication, (_a = {}, _a[role] = { enableSSO: false }, _a));
                        return [4 /*yield*/, this.collection.save(company[0])];
                    case 2:
                        _c.sent();
                        _c.label = 3;
                    case 3: return [4 /*yield*/, this.collection.findOneAndUpdate({ name: nsp }, { $set: (_b = {}, _b['settings.permissions.' + role] = permissions, _b) }, { upsert: false, returnOriginal: false })];
                    case 4: return [2 /*return*/, _c.sent()];
                    case 5:
                        err_1 = _c.sent();
                        console.log('Error in updating company permissions');
                        console.log(err_1);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Company.GetRoles = function (nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var roles, company, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        roles = [];
                        return [4 /*yield*/, this.collection.find({ name: nsp }).limit(1).toArray()];
                    case 1:
                        company = _a.sent();
                        if (company && company.length) {
                            roles = this.getKeys(company[0].settings.permissions);
                        }
                        return [2 /*return*/, roles];
                    case 2:
                        error_2 = _a.sent();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Company.deleteNSPPermissions = function (nsp, permissions, role) {
        return __awaiter(this, void 0, void 0, function () {
            var company_1, err_2;
            var _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, , 6]);
                        permissions.updatedOn = new Date().toISOString();
                        return [4 /*yield*/, this.collection.find({ name: nsp }).limit(1).toArray()];
                    case 1:
                        company_1 = _b.sent();
                        if (!(company_1 && company_1.length)) return [3 /*break*/, 3];
                        Object.keys(company_1[0].settings.permissions).map(function (key) {
                            company_1[0].settings.permissions[key].settings.rolesAndPermissions.canView = _this.removeRolesFromAllPermissions(company_1[0].settings.permissions[key].settings.rolesAndPermissions.canView, role);
                        });
                        delete company_1[0].settings.authentication[role];
                        // let index = company[0].settings.permissions.admin.settings.rolesAndPermissions.canView.indexOf(role)
                        // company[0].settings.permissions.admin.settings.rolesAndPermissions.canView.splice(index, 1);
                        return [4 /*yield*/, this.collection.save(company_1[0])];
                    case 2:
                        // let index = company[0].settings.permissions.admin.settings.rolesAndPermissions.canView.indexOf(role)
                        // company[0].settings.permissions.admin.settings.rolesAndPermissions.canView.splice(index, 1);
                        _b.sent();
                        _b.label = 3;
                    case 3: return [4 /*yield*/, this.collection.findOneAndUpdate({ name: nsp }, { $unset: (_a = {}, _a['settings.permissions.' + role] = 1, _a) }, { upsert: false, returnOriginal: false })];
                    case 4: return [2 /*return*/, _b.sent()];
                    case 5:
                        err_2 = _b.sent();
                        console.log('Error in deleting company permissions');
                        console.log(err_2);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Company.toggleAuthPermissions = function (nsp, role, value) {
        return __awaiter(this, void 0, void 0, function () {
            var err_3;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ name: nsp }, { $set: (_a = {}, _a['settings.authentication.' + role + '.enableSSO'] = value, _a) }, { upsert: false, returnOriginal: false })];
                    case 1: return [2 /*return*/, _b.sent()];
                    case 2:
                        err_3 = _b.sent();
                        console.log('Error in deleting company permissions');
                        console.log(err_3);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Company.addIP = function (nsp, ip) {
        return __awaiter(this, void 0, void 0, function () {
            var err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ name: nsp }, { $push: { 'settings.authentication.allowedIPs': ip } }, { upsert: false, returnOriginal: false })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_4 = _a.sent();
                        console.log('Error in deleting company permissions');
                        console.log(err_4);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Company.setSuppressionList = function (nsp, emails) {
        return __awaiter(this, void 0, void 0, function () {
            var err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ name: nsp }, { $set: { 'settings.authentication.suppressionList': emails } }, { upsert: false, returnOriginal: false })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_5 = _a.sent();
                        console.log('Error in deleting company permissions');
                        console.log(err_5);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Company.removeIP = function (nsp, ip) {
        return __awaiter(this, void 0, void 0, function () {
            var err_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ name: nsp }, { $pull: { 'settings.authentication.allowedIPs': ip } }, { upsert: false, returnOriginal: false })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_6 = _a.sent();
                        console.log('Error in deleting company permissions');
                        console.log(err_6);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Company.removeAgentFromSuppressionList = function (nsp, email) {
        return __awaiter(this, void 0, void 0, function () {
            var err_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ name: nsp }, { $pull: { 'settings.authentication.suppressionList': email } }, { upsert: false, returnOriginal: false })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_7 = _a.sent();
                        console.log('Error in deleting company permissions');
                        console.log(err_7);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Company.getNSPPermission = function (nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var err_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.find({ name: nsp }, { fields: { 'settings.permissions': 1 } }).limit(1).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_8 = _a.sent();
                        console.log('Error in getting company permissions');
                        console.log(err_8);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Company.getNSPPermissionsByRole = function (nsp, role) {
        return __awaiter(this, void 0, void 0, function () {
            var permissions, company, err_9;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        permissions = {};
                        return [4 /*yield*/, this.collection.find({ name: nsp }, { fields: (_a = {}, _a['settings.permissions.' + role] = 1, _a) }).limit(1).toArray()];
                    case 1:
                        company = _b.sent();
                        if (company && company.length) {
                            permissions = company[0].settings.permissions[role];
                        }
                        return [2 /*return*/, permissions];
                    case 2:
                        err_9 = _b.sent();
                        console.log('Error in getting company permissions');
                        console.log(err_9);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Company.updateNSPWMSettings = function (nsp, data) {
        var _a;
        return this.collection.findOneAndUpdate({ name: nsp }, {
            $set: (_a = {},
                _a["settings.widgetMarketingSettings"] = data.settings,
                _a)
        }, { returnOriginal: false, upsert: false });
    };
    Company.UpdateTicketSettings = function (nsp, data) {
        var _a;
        return this.collection.findOneAndUpdate({ name: nsp }, {
            $set: (_a = {},
                _a["settings.ticketSettings"] = data,
                _a)
        }, { returnOriginal: false, upsert: false });
    };
    Company.UpdateEmailNotificationSettings = function (nsp, settingsName, settings) {
        var _a;
        return this.collection.findOneAndUpdate({ name: nsp }, {
            $set: (_a = {},
                _a["settings.emailNotifications." + settingsName] = settings,
                _a)
        }, { returnOriginal: false, upsert: false });
    };
    Company.UpdateWindowNotificationSettings = function (nsp, settings) {
        var _a;
        return this.collection.findOneAndUpdate({ name: nsp }, {
            $set: (_a = {},
                _a["settings.windowNotifications"] = settings,
                _a)
        }, { returnOriginal: false, upsert: false });
    };
    Company.updateNSPDisplaySettings = function (nsp, data) {
        var _a;
        return this.collection.findOneAndUpdate({ name: nsp }, {
            $set: (_a = {},
                _a["settings.displaySettings.barEnabled"] = data.barEnabled,
                _a["settings.displaySettings.avatarColor"] = data.avatarColor,
                _a["settings.displaySettings.settings." + data.settingsName] = data.settings,
                _a)
        }, { returnOriginal: false, upsert: false });
    };
    Company.UpdateBackGroundImage = function (nsp, data, remove) {
        var _a;
        return this.collection.findOneAndUpdate({ name: nsp }, {
            $set: (_a = {},
                _a["settings.displaySettings.settings.chatwindow.themeSettings.bgImage"] = (remove) ? {} : data,
                _a)
        }, { returnOriginal: false, upsert: false });
    };
    Company.updateChatWindowFormSettings = function (nsp, data) {
        var _a;
        return this.collection.findOneAndUpdate({ name: nsp }, {
            $set: (_a = {},
                _a["settings.displaySettings.settings.chatwindow." + data.settingsName] = data.settings,
                _a)
        }, { returnOriginal: false, upsert: false });
    };
    Company.updateAgentLimit = function (nsp, data) {
        var _a;
        return this.collection.findOneAndUpdate({ name: nsp }, {
            $inc: (_a = {},
                _a["package.agents.limit"] = data,
                _a)
        }, { returnOriginal: false, upsert: false });
    };
    Company.updateCompanyPackage = function (nsp, data) {
        return this.collection.findOneAndUpdate({ name: nsp }, {
            $set: {
                package: data
            }
        }, { returnOriginal: false, upsert: false });
    };
    Company.SetCustomScript = function (nsp, script) {
        var _a;
        return this.collection.findOneAndUpdate({ name: nsp }, {
            $set: (_a = {},
                _a["settings.customScript.userFetching"] = script,
                _a)
        }, { returnOriginal: false, upsert: false });
    };
    //#endregion
    //Deprecated
    //Remove When All references from code are eliminated
    Company.RegisterCompany = function (companiprofile, panel) {
        return __awaiter(this, void 0, void 0, function () {
            var verified, current_date, expiryDate, hash, inserted, agent, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        verified = void 0;
                        //verified = (!companiprofile.verified) ? false : '';
                        if (panel) {
                            delete companiprofile['verified'];
                            delete companiprofile['mailingList'];
                        }
                        current_date = (new Date()).valueOf().toString();
                        expiryDate = new Date();
                        expiryDate.setDate(expiryDate.getDate() + 30);
                        hash = crypto.createHash('sha1').update(current_date + companiprofile.company_info.company_website).digest('hex');
                        companiprofile.name = '/' + (new URL(companiprofile.company_info.company_website).hostname);
                        companiprofile.rooms = {
                            DF: {
                                isActive: true,
                                Agents: [companiprofile.email]
                            }
                        };
                        companiprofile.license = hash;
                        companiprofile.deactivated = false;
                        companiprofile.createdAt = new Date().toISOString();
                        companiprofile.expiry = expiryDate.toISOString();
                        companiprofile.script = Company.generateScript(hash);
                        companiprofile.settings = constants_1.defaultSettings;
                        companiprofile.orderID = '';
                        return [4 /*yield*/, this.collection.insertOne(companiprofile)];
                    case 1:
                        inserted = _a.sent();
                        aws_sqs_1.__biZZC_SQS.SendMessage({ action: 'RegisterNamespace', name: companiprofile.name, rooms: companiprofile.rooms, settings: constants_1.defaultSettings });
                        if (!inserted.insertedCount) return [3 /*break*/, 3];
                        return [4 /*yield*/, agentModel_1.Agents.RegisterAgent({
                                first_name: companiprofile.full_name,
                                last_name: '',
                                phone_no: companiprofile.phone_no,
                                nickname: companiprofile.username,
                                username: companiprofile.username,
                                password: companiprofile.password,
                                email: companiprofile.email,
                                role: 'superadmin',
                                gender: '',
                                nsp: companiprofile.name,
                                created_date: current_date,
                                created_by: 'self',
                                group: ['DF'],
                                location: companiprofile.country,
                                editsettings: {
                                    editprofilepic: true,
                                    editname: true,
                                    editnickname: true,
                                    editpassword: true
                                },
                                communicationAccess: {
                                    chat: true,
                                    voicecall: false,
                                    videocall: false
                                },
                                settings: {
                                    simchats: 20,
                                }
                            })];
                    case 2:
                        agent = _a.sent();
                        //#endregion
                        // console.log('agent');
                        // console.log(agent);
                        return [2 /*return*/, inserted];
                    case 3: return [2 /*return*/, undefined];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_3 = _a.sent();
                        console.log('Error in Registering company');
                        console.log(error_3);
                        return [2 /*return*/, undefined];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Company.RegisterCompanyNew = function (TempProfiles) {
        return __awaiter(this, void 0, void 0, function () {
            var temp_1, expiryDate, inserted, agent, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        temp_1 = JSON.parse(JSON.stringify(TempProfiles.agent));
                        TempProfiles.verified = true;
                        expiryDate = new Date();
                        expiryDate.setDate(expiryDate.getDate() + 30);
                        TempProfiles.expiry = expiryDate.toISOString();
                        delete TempProfiles.agent;
                        TempProfiles.deactivated = false;
                        return [4 /*yield*/, this.collection.insertOne(TempProfiles)];
                    case 1:
                        inserted = _a.sent();
                        __biZZCMiddleWare_1.__BIZZ_REST_REDIS_PUB.SendMessage({ action: 'RegisterNamespace', name: TempProfiles.name, rooms: TempProfiles.rooms, settings: TempProfiles.settings });
                        if (!inserted.insertedCount) return [3 /*break*/, 3];
                        return [4 /*yield*/, agentModel_1.Agents.RegisterAgent(temp_1)];
                    case 2:
                        agent = _a.sent();
                        //#endregion
                        // console.log('agent');
                        // console.log(agent);
                        return [2 /*return*/, inserted];
                    case 3: return [2 /*return*/, undefined];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_4 = _a.sent();
                        console.log('Error in Registering company');
                        console.log(error_4);
                        return [2 /*return*/, undefined];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Company.RegisterCompanyUnverified = function (companiprofile, pkg, panel) {
        return __awaiter(this, void 0, void 0, function () {
            var current_date, expiryDate, hash, inserted, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        current_date = (new Date()).valueOf().toString();
                        expiryDate = new Date();
                        expiryDate.setDate(expiryDate.getDate() + 30);
                        hash = crypto.createHash('sha1').update(current_date + companiprofile.company_info.company_website).digest('hex');
                        companiprofile.name = '/' + (new URL(companiprofile.company_info.company_website).hostname);
                        companiprofile.rooms = {
                            DF: {
                                isActive: true,
                                Agents: [companiprofile.email]
                            }
                        };
                        companiprofile.license = hash;
                        companiprofile.deactivated = true;
                        companiprofile.createdAt = new Date().toISOString();
                        companiprofile.expiry = expiryDate.toISOString();
                        companiprofile.verified = false;
                        companiprofile.script = Company.generateScript(hash);
                        companiprofile.settings = constants_1.defaultSettings;
                        companiprofile.package = pkg;
                        companiprofile.agent = {
                            first_name: companiprofile.full_name,
                            last_name: '',
                            phone_no: companiprofile.phone_no,
                            nickname: companiprofile.username,
                            username: companiprofile.username,
                            password: companiprofile.password,
                            email: companiprofile.email,
                            role: 'superadmin',
                            gender: '',
                            nsp: companiprofile.name,
                            created_date: current_date,
                            created_by: 'self',
                            group: ['DF'],
                            location: companiprofile.country,
                            editsettings: {
                                editprofilepic: true,
                                editname: true,
                                editnickname: true,
                                editpassword: true
                            },
                            communicationAccess: {
                                chat: true,
                                voicecall: false,
                                videocall: false
                            },
                            settings: {
                                simchats: 20,
                            }
                        };
                        return [4 /*yield*/, this.db.collection('tempProfile').insertOne(companiprofile)];
                    case 1:
                        inserted = _a.sent();
                        if (inserted.insertedCount) {
                            return [2 /*return*/, inserted];
                        }
                        else
                            return [2 /*return*/, undefined];
                        return [3 /*break*/, 3];
                    case 2:
                        error_5 = _a.sent();
                        console.log('Error in Registering company');
                        console.log(error_5);
                        return [2 /*return*/, undefined];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Company.getCompanyByOrderID = function (orderID) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.collection.find({ orderID: orderID }).limit(1).toArray()];
            });
        });
    };
    Company.getCompany = function (nsp) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.collection.find({ name: nsp }).limit(1).toArray()];
            });
        });
    };
    Company.getCompanyByNSPandToken = function (nsp, token) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.collection.find({ name: nsp, companyToken: token }).limit(1).toArray()];
            });
        });
    };
    Company.setRuleSetScheduler = function (nsp, scheduler) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.collection.findOneAndUpdate({ name: nsp }, { $set: { 'settings.ruleSetScheduler': scheduler } })];
            });
        });
    };
    Company.updateScheduler = function (nsp, datetime) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.collection.findOneAndUpdate({ name: nsp }, { $set: { 'settings.ruleSetScheduler.scheduled_at': datetime } })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Company.getCompaniesWithScheduler = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.collection.find({ 'settings.ruleSetScheduler.enabled': true }, { fields: { name: 1, 'settings.ruleSetScheduler': 1 } }).toArray()];
            });
        });
    };
    Company.InsertOrderID = function (nsp, orderID) {
        return __awaiter(this, void 0, void 0, function () {
            var error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ name: nsp }, {
                                $set: { orderID: orderID }
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_6 = _a.sent();
                        console.log(error_6);
                        console.log('error in inserting ORder ID');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    //#region Group Functions
    Company.getGroups = function (nsp) {
        return this.collection.find({ name: nsp }, { fields: { _id: 0, rooms: 1 } }).toArray();
    };
    Company.AddGroup = function (nsp, groupName) {
        var _a, _b;
        return this.collection.findOneAndUpdate((_a = { name: nsp }, _a["rooms." + groupName] = { $exists: false }, _a), {
            $set: (_b = {}, _b["rooms." + groupName] = { isActive: false, Agents: [] }, _b)
        }, { returnOriginal: false, upsert: false });
    };
    Company.updateNSPDispatcherSettings = function (nsp, value) {
        return this.collection.findOneAndUpdate({ name: nsp }, {
            $set: { 'settings.customDispatcher': value }
        }, { returnOriginal: false, upsert: false });
    };
    Company.updateNSPSolrSearchSettings = function (nsp, value) {
        return this.collection.findOneAndUpdate({ name: nsp }, {
            $set: { 'settings.solrSearch': value }
        }, { returnOriginal: false, upsert: false });
    };
    Company.updateFacebookAppId = function (nsp, value) {
        return this.collection.findOneAndUpdate({ name: nsp }, {
            $set: { 'settings.webhook.facebook.app_id': value }
        }, { returnOriginal: false, upsert: false });
    };
    Company.AddAgentToGroup = function (nsp, groupName, agentEmail) {
        var _a, _b;
        return this.collection.findOneAndUpdate((_a = {
                name: nsp
            },
            _a["rooms." + groupName] = { $exists: true },
            _a["rooms." + groupName + ".Agents"] = { $nin: [agentEmail] },
            _a), {
            $addToSet: (_b = {}, _b["rooms." + groupName + ".Agents"] = agentEmail, _b)
        }, { returnOriginal: false, upsert: false, });
    };
    Company.GetGroupByName = function (nsp, groupName) {
        var _a;
        return this.collection.find((_a = {
                name: nsp
            },
            _a["rooms." + groupName] = { $exists: true },
            _a)).limit(1).toArray();
    };
    Company.GetActiveGroups = function (nsp, groups) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.collection.aggregate([
                            { "$match": { "name": nsp } },
                            { "$project": { 'locations': { '$objectToArray': '$rooms' } } }
                        ]).limit(1).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Company.RemoveAgentFromGroup = function (nsp, groupName, agentEmail) {
        var _a, _b;
        return this.collection.findOneAndUpdate((_a = {
                name: nsp
            },
            _a["rooms." + groupName] = { $exists: true },
            _a["rooms." + groupName + ".Agents"] = { $in: [agentEmail] },
            _a), {
            $pull: (_b = {}, _b["rooms." + groupName + ".Agents"] = agentEmail, _b)
        }, { returnOriginal: false, upsert: false, });
    };
    Company.UpdateGroup = function (nsp, groupName, isActive) {
        var _a, _b, _c, _d;
        if (!isActive) {
            return this.collection.findOneAndUpdate((_a = {
                    name: nsp
                },
                _a["rooms." + groupName] = { $exists: true },
                _a["rooms." + groupName + ".Agents"] = { $gt: [] },
                _a), {
                $set: (_b = {}, _b["rooms." + groupName + ".isActive"] = isActive, _b)
            }, { returnOriginal: false, upsert: false });
        }
        else {
            return this.collection.findOneAndUpdate((_c = {
                    name: nsp
                },
                _c["rooms." + groupName] = { $exists: true },
                _c["rooms." + groupName + ".Agents"] = { $gt: [] },
                _c), {
                $set: (_d = {}, _d["rooms." + groupName + ".isActive"] = isActive, _d)
            }, { returnOriginal: false, upsert: false });
        }
    };
    Company.isOwner = function (nsp, email) {
        return __awaiter(this, void 0, void 0, function () {
            var isOwner, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.find({ name: nsp, email: email }).limit(1).toArray()];
                    case 1:
                        isOwner = _a.sent();
                        return [2 /*return*/, (isOwner.length > 0)];
                    case 2:
                        error_7 = _a.sent();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Company.UpdateCompany = function (company) {
        return __awaiter(this, void 0, void 0, function () {
            var CompnpanyInfo;
            return __generator(this, function (_a) {
                try {
                    CompnpanyInfo = {
                        company_website: company.company_info.company_website,
                        company_type: company.company_info.company_type,
                        company_size: company.company_info.company_size,
                    };
                    if (company.name) {
                        return [2 /*return*/, this.collection.findOneAndUpdate({ name: company.name }, {
                                $set: {
                                    email: company.email,
                                    username: company.username,
                                    full_name: company.full_name,
                                    password: company.password,
                                    country: company.country,
                                    phone_no: company.phone_no,
                                    company_info: CompnpanyInfo,
                                    settings: company.settings,
                                    expiry: company.expiry,
                                    fullCountryName: company.fullCountryName
                                }
                            }, { returnOriginal: false, upsert: false })];
                    }
                    else
                        return [2 /*return*/, undefined];
                }
                catch (error) {
                    console.log('Error in Registering company');
                    console.log(error);
                    return [2 /*return*/, undefined];
                }
                return [2 /*return*/];
            });
        });
    };
    Company.DeactivateCompany = function (name, value) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    if (name) {
                        return [2 /*return*/, this.collection.findOneAndUpdate({ name: name }, {
                                $set: {
                                    deactivated: value,
                                    "settings.verified": !value
                                }
                            }, { returnOriginal: false, upsert: false })];
                    }
                }
                catch (err) {
                    console.log(err);
                }
                return [2 /*return*/];
            });
        });
    };
    Company.getDefaultPermissions = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.db.collection('defaultPermissions').find({}, { fields: { _id: 0, createdBy: 0 } }).limit(1).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_8 = _a.sent();
                        console.log(error_8);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Company.getAuthPermissions = function (nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var authPermissions, company, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        authPermissions = void 0;
                        console.log(nsp);
                        return [4 /*yield*/, this.collection.find({ name: nsp }).limit(1).toArray()];
                    case 1:
                        company = _a.sent();
                        if (company && company.length) {
                            authPermissions = company[0].settings.authentication;
                        }
                        return [2 /*return*/, authPermissions];
                    case 2:
                        error_9 = _a.sent();
                        console.log(error_9);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Company.getKeys = function (objectRef) {
        var keys = [];
        Object.keys(objectRef).map(function (key) {
            keys.push(key);
        });
        return keys;
    };
    Company.DeleteCompany = function (nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var err_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.deleteOne({ name: nsp })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_10 = _a.sent();
                        console.log(err_10);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Company.removeRolesFromAllPermissions = function (RolePermissions, role) {
        var index = RolePermissions.indexOf(role);
        if (index !== -1)
            RolePermissions.splice(index, 1);
        return RolePermissions;
    };
    Company.initialized = false;
    return Company;
}());
exports.Company = Company;
//# sourceMappingURL=companyModel.js.map