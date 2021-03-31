"use strict";
// Created By Saad Ismail Shaikh
// Date : 22-1-18
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
exports.Tokens = void 0;
var constants_1 = require("../globals/config/constants");
var Companies_DB_1 = require("../globals/config/databses/Companies-DB");
var Tokens = /** @class */ (function () {
    function Tokens() {
    }
    Tokens.Initialize = function () {
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
                        return [4 /*yield*/, this.db.createCollection('tokens')];
                    case 2:
                        _b.collection = _c.sent();
                        console.log(this.collection.collectionName);
                        Tokens.initialized = true;
                        return [2 /*return*/, Tokens.initialized];
                    case 3:
                        error_1 = _c.sent();
                        console.log('error in Initializing Tokens Model');
                        throw new Error(error_1);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Tokens.Destroy = function () {
        this.db = undefined;
        this.collection = undefined;
    };
    Tokens.inserToken = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    return [2 /*return*/, this.collection.insertOne(token)];
                }
                catch (error) {
                    console.log(error);
                    console.log('error in Insert Token');
                }
                return [2 /*return*/];
            });
        });
    };
    Tokens.FindToken = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    return [2 /*return*/, this.collection.find({ id: token, type: 'emailActivation' }).limit(1).toArray()];
                }
                catch (error) {
                    console.log(error);
                    console.log('error in Validate Token');
                    Promise.resolve(undefined);
                }
                return [2 /*return*/];
            });
        });
    };
    Tokens.validateToken = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var expireDate;
            return __generator(this, function (_a) {
                try {
                    expireDate = constants_1.decrypt(token);
                    if (new Date(expireDate) > new Date(new Date().toISOString())) {
                        return [2 /*return*/, this.collection.find({ id: token }).limit(1).toArray()];
                    }
                    else {
                        return [2 /*return*/, Promise.resolve(undefined)];
                    }
                }
                catch (error) {
                    console.log(error);
                    console.log('error in Validate Token');
                    Promise.resolve(undefined);
                }
                return [2 /*return*/];
            });
        });
    };
    Tokens.validateResellerToken = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var expireDate;
            return __generator(this, function (_a) {
                try {
                    expireDate = constants_1.decrypt(token);
                    if (new Date(expireDate) > new Date(new Date().toISOString())) {
                        return [2 /*return*/, this.collection.find({ id: token, isReseller: true }).limit(1).toArray()];
                    }
                    else {
                        return [2 /*return*/, Promise.resolve(undefined)];
                    }
                }
                catch (error) {
                    console.log(error);
                    console.log('error in Validate Token');
                    Promise.resolve(undefined);
                }
                return [2 /*return*/];
            });
        });
    };
    Tokens.VerifyToken = function (token, email) {
        return __awaiter(this, void 0, void 0, function () {
            var expireDate;
            return __generator(this, function (_a) {
                try {
                    expireDate = constants_1.decrypt(token);
                    if (new Date(expireDate) > new Date(new Date().toISOString())) {
                        return [2 /*return*/, this.collection.find({ id: token, email: email }).limit(1).toArray()];
                    }
                    else {
                        return [2 /*return*/, Promise.resolve(undefined)];
                    }
                }
                catch (error) {
                    console.log(error);
                    console.log('error in Validate Token');
                    Promise.resolve(undefined);
                }
                return [2 /*return*/];
            });
        });
    };
    Tokens.VerifyResellerToken = function (token, email) {
        return __awaiter(this, void 0, void 0, function () {
            var expireDate;
            return __generator(this, function (_a) {
                try {
                    expireDate = constants_1.decrypt(token);
                    if (new Date(expireDate) > new Date(new Date().toISOString())) {
                        return [2 /*return*/, this.collection.find({ id: token, email: email, isReseller: true }).limit(1).toArray()];
                    }
                    else {
                        return [2 /*return*/, Promise.resolve(undefined)];
                    }
                }
                catch (error) {
                    console.log(error);
                    console.log('error in Validate Token');
                    Promise.resolve(undefined);
                }
                return [2 /*return*/];
            });
        });
    };
    Tokens.DeleteExpiredTokens = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    return [2 /*return*/, this.collection.deleteMany({ expireDate: { $lte: new Date().toISOString() } })];
                }
                catch (error) {
                    console.log(error);
                    console.log('error in Validate Token');
                    return [2 /*return*/, undefined];
                }
                return [2 /*return*/];
            });
        });
    };
    Tokens.initialized = false;
    // Current Visitor Array
    Tokens.AgentsList = {};
    return Tokens;
}());
exports.Tokens = Tokens;
//# sourceMappingURL=tokensModel.js.map