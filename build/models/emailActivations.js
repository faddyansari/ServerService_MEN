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
exports.EmailActivations = void 0;
var TicketsDB_1 = require("../globals/config/databses/TicketsDB");
var EmailActivations = /** @class */ (function () {
    function EmailActivations() {
    }
    EmailActivations.Initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, error_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 3, , 4]);
                        _a = this;
                        return [4 /*yield*/, TicketsDB_1.TicketsDB.connect()];
                    case 1:
                        _a.db = _c.sent();
                        _b = this;
                        return [4 /*yield*/, this.db.createCollection('emailActivations')];
                    case 2:
                        _b.collection = _c.sent();
                        console.log(this.collection.collectionName);
                        EmailActivations.initialized = true;
                        return [2 /*return*/, EmailActivations.initialized];
                    case 3:
                        error_1 = _c.sent();
                        console.log('error in Initializing emailActivations');
                        throw new Error(error_1);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    EmailActivations.Destroy = function () {
        // Database Connection For Session Storage.
        this.db = undefined;
        this.collection = undefined;
    };
    EmailActivations.insertEmail = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            var check, insertion, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        if (!this.collection) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.checkEmail(email)];
                    case 1:
                        check = _a.sent();
                        if (!(check && !check.length)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.collection.insertOne({
                                createdAt: new Date(),
                                email: email,
                                sent: true,
                                verified: false
                            })];
                    case 2:
                        insertion = _a.sent();
                        if (insertion.insertedCount > 0)
                            return [2 /*return*/, { inserted: true, alreadyExists: false }];
                        return [3 /*break*/, 4];
                    case 3: return [2 /*return*/, { inserted: false, alreadyExists: true }];
                    case 4: return [3 /*break*/, 6];
                    case 5: return [2 /*return*/, undefined];
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        err_1 = _a.sent();
                        console.log(err_1);
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    EmailActivations.updateSentStatus = function (email, status) {
        return __awaiter(this, void 0, void 0, function () {
            var err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!this.collection) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.collection.updateOne({ email: email }, { $set: { sent: status } })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [2 /*return*/, undefined];
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        err_2 = _a.sent();
                        console.log(err_2);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    EmailActivations.updateVerifiedStatus = function (email, status) {
        return __awaiter(this, void 0, void 0, function () {
            var err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!this.collection) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.collection.updateOne({ email: email }, { $set: { verified: status } })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [2 /*return*/, undefined];
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        err_3 = _a.sent();
                        console.log(err_3);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    EmailActivations.removeEmail = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            var err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        if (!this.collection) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.collection.deleteOne({
                                email: email
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [3 /*break*/, 4];
                    case 3:
                        err_4 = _a.sent();
                        console.log(err_4);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    EmailActivations.getUnverifiedEmails = function () {
        return __awaiter(this, void 0, void 0, function () {
            var emails, err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!this.collection) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.collection.find({
                                sent: true,
                                verified: false
                            }).toArray()];
                    case 1:
                        emails = _a.sent();
                        if (emails && emails.length) {
                            return [2 /*return*/, emails.map(function (e) { return e.email; })];
                        }
                        else {
                            return [2 /*return*/, []];
                        }
                        return [3 /*break*/, 3];
                    case 2: return [2 /*return*/, []];
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        err_5 = _a.sent();
                        console.log(err_5);
                        return [2 /*return*/, []];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    EmailActivations.checkEmail = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            var err_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!this.collection) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.collection.find({
                                email: email
                            }).limit(1).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [2 /*return*/, []];
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        err_6 = _a.sent();
                        console.log(err_6);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    EmailActivations.checkEmailIfAlreadySent = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            var err_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!this.collection) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.collection.find({
                                email: email,
                                sent: true
                            }).limit(1).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [2 /*return*/, []];
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        err_7 = _a.sent();
                        console.log(err_7);
                        return [2 /*return*/, []];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    EmailActivations.checkEmails = function (emails) {
        return __awaiter(this, void 0, void 0, function () {
            var activeEmails_1, emailsFromDb_1, err_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        // console.log('Emails given: ');
                        // console.log(emails);
                        if (!Array.isArray(emails))
                            emails = [emails];
                        console.log('Checking blacklisted emails!');
                        if (!this.collection) return [3 /*break*/, 2];
                        activeEmails_1 = [];
                        return [4 /*yield*/, this.collection.find({
                                email: { $in: emails }
                            }).toArray()];
                    case 1:
                        emailsFromDb_1 = _a.sent();
                        if (emailsFromDb_1 && emailsFromDb_1.length) {
                            emails.forEach(function (email) {
                                if (!emailsFromDb_1.filter(function (e) { return e.email == email; }).length) {
                                    activeEmails_1.push(email);
                                }
                            });
                        }
                        else {
                            activeEmails_1 = emails;
                            // return activeEmails;
                        }
                        // console.log('Active emails:');
                        // console.log(activeEmails);
                        return [2 /*return*/, activeEmails_1];
                    case 2: return [2 /*return*/, emails];
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        err_8 = _a.sent();
                        console.log(err_8);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    EmailActivations.initialized = false;
    return EmailActivations;
}());
exports.EmailActivations = EmailActivations;
//# sourceMappingURL=emailActivations.js.map