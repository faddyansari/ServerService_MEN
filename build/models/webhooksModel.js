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
exports.Webhooks = void 0;
var uuid_1 = require("uuid");
var customError_1 = require("../helpers/customError");
var Companies_DB_1 = require("../globals/config/databses/Companies-DB");
var Webhooks = /** @class */ (function () {
    function Webhooks() {
    }
    Webhooks.Initialize = function () {
        var _this = this;
        // Database Connection For Visitors Based Operation on Visitor Collections
        Companies_DB_1.CompaniesDB.connect()
            .then(function (db) {
            _this.db = db;
            _this.db.createCollection('appTokens')
                .then(function (collection) {
                console.log(collection.collectionName);
                _this.collection = collection;
            })
                .catch(function (err) {
                //console.log(err);
            });
            Webhooks.initialized = true;
        })
            .catch(function (error) {
            console.log(error);
        });
    };
    Webhooks.setAppToken = function (nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var findResp, uuid, appTokenObj, bulkOpResp;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        uuid = uuid_1.v4();
                        return [4 /*yield*/, this.collection.find({ key: uuid }).toArray()];
                    case 1:
                        findResp = _a.sent();
                        _a.label = 2;
                    case 2:
                        if (findResp.length > 0) return [3 /*break*/, 0];
                        _a.label = 3;
                    case 3:
                        appTokenObj = {
                            key: uuid,
                            nsp: nsp,
                            valid: true,
                            userGetValidated: false
                        };
                        return [4 /*yield*/, this.collection.bulkWrite([
                                { updateMany: { filter: { valid: true }, update: { $set: { valid: false } } } },
                                { insertOne: { document: appTokenObj } }
                            ])];
                    case 4:
                        bulkOpResp = _a.sent();
                        // success
                        if (bulkOpResp && bulkOpResp.result && bulkOpResp.result.ok && bulkOpResp.insertedCount == 1) {
                            // return uuid
                            return [2 /*return*/, {
                                    key: uuid,
                                    userGetValidated: false
                                }];
                        }
                        else {
                            throw new customError_1.CustomError("UnsuccessfulAppTokenGeneration", 9, "Incorrect DB operations for app token generation.");
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Webhooks.getValidAppToken = function (nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var findArray, appToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.collection.find({ nsp: nsp, valid: true }).toArray()];
                    case 1:
                        findArray = _a.sent();
                        // console.log('findArray')
                        // console.log(findArray)
                        if (findArray.length > 1) {
                            throw new customError_1.CustomError("InvalidStateInAppToken", 10, "More than 1 valid app tokens have been returned for one company: invalid operation");
                        }
                        else if (findArray.length == 0) {
                            return [2 /*return*/, {
                                    key: '', userGetValidated: "unknown"
                                }];
                        }
                        else {
                            appToken = findArray[0];
                            return [2 /*return*/, {
                                    key: appToken.key,
                                    userGetValidated: appToken.userGetValidated
                                }];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Webhooks.GETValidateAppToken = function (token, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var findArray;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.collection.find({ nsp: nsp, valid: true, key: token }).toArray()];
                    case 1:
                        findArray = _a.sent();
                        if (!(findArray.length == 1)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.collection.update({ key: token }, { $set: { userGetValidated: true } })];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        if (findArray.length == 0) {
                            throw new customError_1.CustomError("IncorrectVerificationAppTokenValues", 12, "The values passed into for app token verification do not correspond to any valid app token.");
                        }
                        // negative or above 1 returned from db
                        else {
                            throw new customError_1.CustomError("InvalidStateInAppToken", 13, "More than 1 valid app tokens have been returned for one company: invalid operation");
                        }
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Webhooks.isGETValidatedAppToken = function (token, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var findArray;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.collection.find({ nsp: nsp, valid: true, key: token, userGetValidated: true }).toArray()];
                    case 1:
                        findArray = _a.sent();
                        if (findArray.length == 1) {
                            console.log("validated");
                            return [2 /*return*/];
                        }
                        else if (findArray.length == 0) {
                            throw new customError_1.CustomError("IncorrectVerifiedAppTokenValues", 14, "The values passed into checking for app token verified do not correspond to any valid app token.");
                        }
                        // negative or above 1 returned from db
                        else {
                            throw new customError_1.CustomError("InvalidStateInAppToken", 15, "More than 1 valid app tokens have been returned for one company: invalid operation");
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Webhooks.initialized = false;
    return Webhooks;
}());
exports.Webhooks = Webhooks;
//# sourceMappingURL=webhooksModel.js.map