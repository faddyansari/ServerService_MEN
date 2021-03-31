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
exports.Reseller = void 0;
var Companies_DB_1 = require("../globals/config/databses/Companies-DB");
var Reseller = /** @class */ (function () {
    function Reseller() {
    }
    Reseller.Initialize = function () {
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
                        return [4 /*yield*/, this.db.createCollection('resellers')];
                    case 2:
                        _b.collection = _c.sent();
                        console.log(this.collection.collectionName);
                        Reseller.initialized = true;
                        return [2 /*return*/, Reseller.initialized];
                    case 3:
                        error_1 = _c.sent();
                        console.log('error in Initializing Reseller Model');
                        throw new Error(error_1);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Reseller.CheckReseller = function (email) {
        try {
            console.log(email);
            return this.collection
                .find({ "personalInfo.email": email })
                .limit(1)
                .toArray();
        }
        catch (error) {
            console.log(error);
            throw new Error("Error in Check Company In Exists");
        }
    };
    Reseller.AuthenticateReseller = function (email, password) {
        return __awaiter(this, void 0, void 0, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection
                                .find({
                                $and: [
                                    { "personalInfo.email": email },
                                    { "personalInfo.password": password },
                                    { verified: true }
                                ]
                            })
                                .limit(1)
                                .toArray()];
                    case 1: 
                    // { nsp: '/admin' },
                    // { isAdmin: { $exists: true }}
                    return [2 /*return*/, (_a.sent())];
                    case 2:
                        error_2 = _a.sent();
                        console.log('Error in Authenticating Admin');
                        console.log(error_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Reseller.VerifyReseller = function (email, value, admin) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    if (email) {
                        return [2 /*return*/, this.collection.findOneAndUpdate(
                            // { personalInfo: { email: email } },
                            { "personalInfo.email": email }, {
                                $set: {
                                    verified: value,
                                    DisprovedOrApprovedBy: {
                                        date: new Date().toISOString(),
                                        by: admin,
                                    }
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
    Reseller.ResellerResetPassword = function (email, password) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    if (email) {
                        return [2 /*return*/, this.collection.findOneAndUpdate(
                            // { personalInfo: { email: email } },
                            { "personalInfo.email": email }, {
                                $set: {
                                    "personalInfo.password": password
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
    Reseller.ChangePassword = function (password, email) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log(password);
                console.log(email);
                try {
                    return [2 /*return*/, this.collection.findOneAndUpdate({ "personalInfo.email": email }, {
                            $set: {
                                "personalInfo.password": password
                            }
                        }, { returnOriginal: false, upsert: false })];
                }
                catch (error) {
                    console.log(error);
                    console.log('error in Change Password');
                }
                return [2 /*return*/];
            });
        });
    };
    Reseller.ResellerExists = function (userEmail) {
        return __awaiter(this, void 0, void 0, function () {
            var error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection
                                .find({ "personalInfo.email": userEmail })
                                .limit(1)
                                .toArray()];
                    case 1: return [2 /*return*/, !!(_a.sent()).length];
                    case 2:
                        error_3 = _a.sent();
                        console.log(error_3);
                        throw new Error("Can't Find Agent In Exists");
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Reseller.RegisterReseller = function (reseller) {
        return __awaiter(this, void 0, void 0, function () {
            var createdDate, inserted, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        createdDate = (new Date()).valueOf().toString();
                        reseller.createdDate = createdDate;
                        reseller.verified = false;
                        return [4 /*yield*/, this.collection.insertOne(reseller)];
                    case 1:
                        inserted = _a.sent();
                        console.log('inserted');
                        console.log(inserted);
                        if (inserted.insertedCount)
                            return [2 /*return*/, inserted];
                        else
                            return [2 /*return*/, undefined];
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        console.log('Error in Registering company');
                        console.log(error_4);
                        return [2 /*return*/, undefined];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Reseller.GetResellerByEmail = function (emaiil) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.collection.find({ "personalInfo.email": emaiil }).limit(1).toArray()];
            });
        });
    };
    Reseller.verifylicenseMobile = function (license) {
        return this.collection.find({
            license: license
        }, {
            fields: {
                company_info: 1,
                name: 1,
            }
        })
            .limit(1).toArray();
    };
    Reseller.getScript = function (nsp) {
        //console.log(nsp);
        return this.collection.find({ name: nsp }, { fields: { script: 1 } }).toArray();
    };
    Reseller.GetCompanyInfo = function (nsp) {
        //console.log(nsp);
        return this.collection.find({ name: nsp }, { fields: { script: 1, company_info: 1 } }).toArray();
    };
    Reseller.GetResellers = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.collection.find().toArray()];
            });
        });
    };
    Reseller.getSettings = function (nsp) {
        return this.collection.find({ name: nsp }, {
            fields: {
                _id: 0,
                'settings.chatSettings': 1,
            }
        })
            .limit(1).toArray();
    };
    // public static GetVerificationStatus(nsp: string) {
    //     return this.collection.find(
    //         { name: nsp },
    //         {
    //             fields: {
    //                 _id: 0,
    //                 'settings.verified': 1,
    //                 'createdAt': 1,
    //                 'expiry': 1
    //             }
    //         })
    //         .limit(1).toArray();
    // }
    Reseller.getWebHooks = function (nsp) {
        return this.collection.find({ name: nsp }, {
            fields: {
                _id: 0,
                'settings.customScript': 1,
            }
        })
            .limit(1).toArray();
    };
    Reseller.getTagsAutomationSettings = function (nsp) {
        return this.collection.find({ name: nsp }, {
            fields: {
                _id: 0,
                'settings.tagsAutomation': 1,
            }
        })
            .limit(1).toArray();
    };
    Reseller.getDisplaySettings = function (nsp) {
        return this.collection.find({ name: nsp }, {
            fields: {
                _id: 0,
                'settings.displaySettings': 1
            }
        })
            .limit(1).toArray();
    };
    Reseller.getAdminSettings = function (nsp) {
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
    Reseller.GetTicketSettings = function (nsp) {
        //console.log(nsp);
        return this.collection.find({ name: nsp }, {
            fields: {
                _id: 0,
                'settings.ticketSettings': 1
            }
        })
            .limit(1).toArray();
    };
    //#region Update Settings
    Reseller.updateNSPChatSettings = function (nsp, data) {
        var _a;
        return this.collection.findOneAndUpdate({ name: nsp }, {
            $set: (_a = {},
                _a["settings.chatSettings." + data.settingsName] = data.settings,
                _a)
        }, { returnOriginal: false, upsert: false });
    };
    Reseller.updateNSPCallSettings = function (nsp, data) {
        var _a;
        return this.collection.findOneAndUpdate({ name: nsp }, {
            $set: (_a = {},
                _a["settings.callSettings"] = data.settings,
                _a)
        }, { returnOriginal: false, upsert: false });
    };
    Reseller.updateNSPContactSettings = function (nsp, type, settings) {
        var _a;
        return this.collection.findOneAndUpdate({ name: nsp }, {
            $set: (_a = {},
                _a["settings.contactSettings." + type] = settings,
                _a)
        }, { returnOriginal: false, upsert: false });
    };
    Reseller.updateNSPWMSettings = function (nsp, data) {
        var _a;
        return this.collection.findOneAndUpdate({ name: nsp }, {
            $set: (_a = {},
                _a["settings.widgetMarketingSettings"] = data.settings,
                _a)
        }, { returnOriginal: false, upsert: false });
    };
    Reseller.UpdateTicketSettings = function (nsp, data) {
        var _a;
        return this.collection.findOneAndUpdate({ name: nsp }, {
            $set: (_a = {},
                _a["settings.ticketSettings"] = data,
                _a)
        }, { returnOriginal: false, upsert: false });
    };
    Reseller.updateNSPDisplaySettings = function (nsp, data) {
        var _a;
        return this.collection.findOneAndUpdate({ name: nsp }, {
            $set: (_a = {},
                _a["settings.displaySettings.barEnabled"] = data.barEnabled,
                _a["settings.displaySettings.avatarColor"] = data.avatarColor,
                _a["settings.displaySettings.settings." + data.settingsName] = data.settings,
                _a)
        }, { returnOriginal: false, upsert: false });
    };
    Reseller.UpdateBackGroundImage = function (nsp, data, remove) {
        var _a;
        return this.collection.findOneAndUpdate({ name: nsp }, {
            $set: (_a = {},
                _a["settings.displaySettings.settings.chatwindow.themeSettings.bgImage"] = (remove) ? {} : data,
                _a)
        }, { returnOriginal: false, upsert: false });
    };
    Reseller.updateChatWindowFormSettings = function (nsp, data) {
        var _a;
        return this.collection.findOneAndUpdate({ name: nsp }, {
            $set: (_a = {},
                _a["settings.displaySettings.settings.chatwindow." + data.settingsName] = data.settings,
                _a)
        }, { returnOriginal: false, upsert: false });
    };
    Reseller.SetCustomScript = function (nsp, script) {
        var _a;
        return this.collection.findOneAndUpdate({ name: nsp }, {
            $set: (_a = {},
                _a["settings.customScript.userFetching"] = script,
                _a)
        }, { returnOriginal: false, upsert: false });
    };
    //#endregion
    // public static async RegisterCompany(companiprofile) {
    //     try {
    //         let current_date = (new Date()).valueOf().toString();
    //         let hash = crypto.createHash('sha1').update(current_date + companiprofile.company_info.company_website).digest('hex');
    //         companiprofile.name = '/' + (new URL(companiprofile.company_info.company_website).hostname);
    //         companiprofile.rooms = {
    //             DF: {
    //                 isActive: true,
    //                 Agents: []
    //             }
    //         };
    //         companiprofile.license = hash;
    //         companiprofile.script = Company.generateScript(hash);
    //         companiprofile.settings = defaultSettings;
    //         let inserted = await this.collection.insertOne(companiprofile);
    //         (inserted.insertedCount) ? NameSpaces.RegisterNameSpace({
    //             name: companiprofile.name,
    //             rooms: companiprofile.rooms,
    //             settings: defaultSettings
    //         }) : undefined;
    //         if (inserted.insertedCount) {
    //             //#region Inserting Agent
    //             let agent = await Agents.RegisterAgent({
    //                 first_name: companiprofile.full_name,
    //                 last_name: '',
    //                 phone_no: companiprofile.phone_no,
    //                 nickname: companiprofile.username,
    //                 username: companiprofile.username,
    //                 password: companiprofile.password,
    //                 email: companiprofile.email,
    //                 role: 'admin',
    //                 gender: '',
    //                 nsp: companiprofile.name,
    //                 created_date: current_date,
    //                 created_by: 'self',
    //                 group: 'DF',
    //                 location: companiprofile.country,
    //                 editsettings: {
    //                     editprofilepic: true,
    //                     editname: true,
    //                     editnickname: true,
    //                     editpassword: true
    //                 },
    //                 communicationAccess: {
    //                     chat: true,
    //                     voicecall: false,
    //                     videocall: false
    //                 },
    //                 settings: {
    //                     simchats: 20
    //                 }
    //             });
    //             //#endregion
    //             return inserted;
    //         }
    //         else return undefined
    //     } catch (error) {
    //         console.log('Error in Registering company');
    //         console.log(error);
    //         return undefined;
    //     }
    // }
    Reseller.getCompany = function (nsp) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.collection.find({ name: nsp }).limit(1).toArray()];
            });
        });
    };
    //#region Group Functions  
    Reseller.getGroups = function (nsp) {
        return this.db.collection('companies').find({ name: nsp }, { fields: { _id: 0, rooms: 1 } }).toArray();
    };
    Reseller.AddGroup = function (nsp, groupName) {
        var _a, _b;
        return this.db.collection('companies').findOneAndUpdate((_a = { name: nsp }, _a["rooms." + groupName] = { $exists: false }, _a), {
            $set: (_b = {}, _b["rooms." + groupName] = { isActive: false, Agents: [] }, _b)
        }, { returnOriginal: false, upsert: false });
    };
    Reseller.AddAgentToGroup = function (nsp, groupName, agentEmail) {
        var _a, _b;
        return this.db.collection('companies').findOneAndUpdate((_a = {
                name: nsp
            },
            _a["rooms." + groupName] = { $exists: true },
            _a["rooms." + groupName + ".Agents"] = { $nin: [agentEmail] },
            _a), {
            $addToSet: (_b = {}, _b["rooms." + groupName + ".Agents"] = agentEmail, _b)
        }, { returnOriginal: false, upsert: false, });
    };
    Reseller.GetGroupByName = function (nsp, groupName) {
        var _a;
        return this.db.collection('companies').find((_a = {
                name: nsp
            },
            _a["rooms." + groupName] = { $exists: true },
            _a)).limit(1).toArray();
    };
    Reseller.GetActiveGroups = function (nsp, groups) {
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
    Reseller.RemoveAgentFromGroup = function (nsp, groupName, agentEmail) {
        var _a, _b;
        return this.db.collection('companies').findOneAndUpdate((_a = {
                name: nsp
            },
            _a["rooms." + groupName] = { $exists: true },
            _a["rooms." + groupName + ".Agents"] = { $in: [agentEmail] },
            _a), {
            $pull: (_b = {}, _b["rooms." + groupName + ".Agents"] = agentEmail, _b)
        }, { returnOriginal: false, upsert: false, });
    };
    Reseller.UpdateGroup = function (nsp, groupName, isActive) {
        var _a, _b, _c, _d;
        if (!isActive) {
            return this.db.collection('companies').findOneAndUpdate((_a = {
                    name: nsp
                },
                _a["rooms." + groupName] = { $exists: true },
                _a["rooms." + groupName + ".Agents"] = { $gt: [] },
                _a), {
                $set: (_b = {}, _b["rooms." + groupName + ".isActive"] = isActive, _b)
            }, { returnOriginal: false, upsert: false });
        }
        else {
            return this.db.collection('companies').findOneAndUpdate((_c = {
                    name: nsp
                },
                _c["rooms." + groupName] = { $exists: true },
                _c["rooms." + groupName + ".Agents"] = { $gt: [] },
                _c), {
                $set: (_d = {}, _d["rooms." + groupName + ".isActive"] = isActive, _d)
            }, { returnOriginal: false, upsert: false });
        }
    };
    Reseller.UpdateCompany = function (company) {
        return __awaiter(this, void 0, void 0, function () {
            var CompnpanyInfo;
            return __generator(this, function (_a) {
                try {
                    console.log(company);
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
    Reseller.DeleteCompany = function (nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.deleteOne({ name: nsp })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_1 = _a.sent();
                        console.log(err_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    //#endregion
    // -------------------------------x---------------------------------------------------x ||
    //                              Functions operatiing on Databases 
    //--------------------------------x---------------------------------------------------x ||
    //-------------------------------x-------------------------------------------------------x ||
    //                  Functions operating on Live Clients. ( Visitor List Arra)              ||
    //--------------------------------x------------------------------------------------------- ||
    //Admin PAnel
    Reseller.GetCompaniesByResellerEmail = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.db.collection('companies').find({ name: { '$in': user.companiesRegistered } }).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_2 = _a.sent();
                        console.log(err_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Reseller.UpdateResellerCompanies = function (name, email) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log(name);
                console.log(email);
                try {
                    return [2 /*return*/, this.collection.findOneAndUpdate({
                            "personalInfo.email": email,
                        }, {
                            $addToSet: { companiesRegistered: name }
                        }, { returnOriginal: false, upsert: false, })];
                }
                catch (err) {
                    console.log(err);
                }
                return [2 /*return*/];
            });
        });
    };
    Reseller.initialized = false;
    return Reseller;
}());
exports.Reseller = Reseller;
//# sourceMappingURL=resellerModel.js.map