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
exports.EmailOwnerModel = void 0;
var mongodb_1 = require("mongodb");
var Marketing_DB_1 = require("../globals/config/databses/Marketing-DB");
var EmailOwnerModel = /** @class */ (function () {
    function EmailOwnerModel() {
    }
    EmailOwnerModel.Initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, error_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 3, , 4]);
                        _a = this;
                        return [4 /*yield*/, Marketing_DB_1.MarketingDB.connect()];
                    case 1:
                        _a.db = _c.sent();
                        _b = this;
                        return [4 /*yield*/, this.db.createCollection('emailOwners')];
                    case 2:
                        _b.collection = _c.sent();
                        EmailOwnerModel.initialized = true;
                        return [2 /*return*/, EmailOwnerModel.initialized];
                    case 3:
                        error_1 = _c.sent();
                        console.log('error in Initializing Email Owner Model');
                        throw new Error(error_1);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    EmailOwnerModel.getOwnersList = function (nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.find({ nsp: nsp }).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_1 = _a.sent();
                        console.log('Error in getting owners');
                        console.log(err_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    EmailOwnerModel.insertEmailOwner = function (owner) {
        return __awaiter(this, void 0, void 0, function () {
            var err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.insertOne(owner)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_2 = _a.sent();
                        console.log('Error in inserting Owner');
                        console.log(err_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    EmailOwnerModel.deleteEmailOwner = function (id, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var deletion, owners, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, this.collection.deleteOne({ _id: new mongodb_1.ObjectId(id), nsp: nsp })];
                    case 1:
                        deletion = _a.sent();
                        if (!(deletion && deletion.deletedCount != 0)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.collection.find({ nsp: nsp }).toArray()];
                    case 2:
                        owners = _a.sent();
                        return [2 /*return*/, (owners && owners.length) ? owners : []];
                    case 3: return [2 /*return*/, []];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        err_3 = _a.sent();
                        console.log('Error in deleting email owner');
                        console.log(err_3);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    EmailOwnerModel.updateEmailOwner = function (id, nsp, ownerObj) {
        return __awaiter(this, void 0, void 0, function () {
            var err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.findOneAndReplace({ _id: new mongodb_1.ObjectId(id), nsp: nsp }, (ownerObj), { returnOriginal: false, upsert: false })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_4 = _a.sent();
                        console.log('Error in updating Address Book');
                        console.log(err_4);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    EmailOwnerModel.toggleActivation = function (flag, id, nsp, by) {
        return __awaiter(this, void 0, void 0, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ nsp: nsp, _id: new mongodb_1.ObjectId(id) }, { $set: { activated: flag, lastModifiedBy: by, lastModifiedDate: new Date().toISOString() } }, { returnOriginal: false, upsert: false })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_2 = _a.sent();
                        console.log(error_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    EmailOwnerModel.initialized = false;
    return EmailOwnerModel;
}());
exports.EmailOwnerModel = EmailOwnerModel;
//# sourceMappingURL=emailOwnerModel.js.map