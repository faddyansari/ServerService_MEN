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
exports.ReportsModel = void 0;
var Analytics_Logs_DB_1 = require("../globals/config/databses/Analytics-Logs-DB");
var ReportsModel = /** @class */ (function () {
    function ReportsModel() {
    }
    ReportsModel.Initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c, error_1;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 4, , 5]);
                        _a = this;
                        return [4 /*yield*/, Analytics_Logs_DB_1.ArchivingDB.connect()];
                    case 1:
                        _a.db = _d.sent();
                        _b = this;
                        return [4 /*yield*/, this.db.createCollection('warehouse_referers')];
                    case 2:
                        _b.referers = _d.sent();
                        _c = this;
                        return [4 /*yield*/, this.db.createCollection('get_password_logs')];
                    case 3:
                        _c.get_password_logs = _d.sent();
                        console.log(this.referers.collectionName);
                        ReportsModel.initialized = true;
                        return [2 /*return*/, ReportsModel.initialized];
                    case 4:
                        error_1 = _d.sent();
                        console.log('error in Initializing ReportsModel');
                        throw new Error(error_1);
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    ReportsModel.InsertOrUpdateTopVisitedLink = function (referer) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        referer.date = this.customDate(referer.date);
                        return [4 /*yield*/, this.referers.find({ date: new Date(this.customDate(referer.date)), nsp: referer.nsp }).limit(1).toArray()];
                    case 1:
                        data = _a.sent();
                        if (!(data && data.length)) return [3 /*break*/, 3];
                        data[0].urls.forEach(function (element) {
                            if (element.url == referer.urls[0].url) {
                                element.count += 1;
                            }
                            else {
                                data[0].urls.push(referer.urls[0]);
                            }
                        });
                        return [4 /*yield*/, this.referers.updateOne({ date: new Date(this.customDate(referer.date)), nsp: referer.nsp }, { $set: { urls: data[0].urls } })];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        referer.date = new Date(referer.date);
                        this.referers.insertOne(referer);
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ReportsModel.insertPasswordLog = function (email, detailsfor, responseText, status, public_ip) {
        return __awaiter(this, void 0, void 0, function () {
            var obj;
            return __generator(this, function (_a) {
                try {
                    obj = {
                        requested_by: email,
                        detailsfor: detailsfor,
                        responseText: responseText,
                        datetime: new Date().toISOString(),
                        status: status,
                        ip_public: public_ip
                    };
                    this.get_password_logs.insertOne(obj);
                }
                catch (err) {
                    console.log('Error in inserting password log');
                    console.log(err);
                }
                return [2 /*return*/];
            });
        });
    };
    ReportsModel.customDate = function (d) {
        return d.getFullYear() + '-' + ("0" + (d.getMonth() + 1)).slice(-2) + '-' + ("0" + d.getDate()).slice(-2);
    };
    ReportsModel.initialized = false;
    return ReportsModel;
}());
exports.ReportsModel = ReportsModel;
//# sourceMappingURL=reportsModel.js.map