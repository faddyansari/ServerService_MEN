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
exports.responseModel = void 0;
var mongodb_1 = require("mongodb");
var ChatsDB_1 = require("../../globals/config/databses/ChatsDB");
var responseModel = /** @class */ (function () {
    function responseModel() {
    }
    responseModel.Initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, error_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 3, , 4]);
                        _a = this;
                        return [4 /*yield*/, ChatsDB_1.ChatsDB.connect()];
                    case 1:
                        _a.db = _c.sent();
                        _b = this;
                        return [4 /*yield*/, this.db.collection('respFunc')];
                    case 2:
                        _b.collection = _c.sent();
                        console.log(this.collection.collectionName);
                        responseModel.initialized = true;
                        return [2 /*return*/, responseModel.initialized];
                    case 3:
                        error_1 = _c.sent();
                        console.log('error in Initializing Response Model');
                        throw new Error(error_1);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    responseModel.GetResponse = function (nsp, id) {
        return __awaiter(this, void 0, void 0, function () {
            var responseFunc;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.collection.find({ del: false, nsp: nsp, _id: new mongodb_1.ObjectID(id) }).limit(1).toArray()];
                    case 1:
                        responseFunc = _a.sent();
                        if (responseFunc.length) {
                            return [2 /*return*/, responseFunc[0].response];
                        }
                        else {
                            return [2 /*return*/, undefined];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    responseModel.AddResponse = function (resp_func_id, nsp, text) {
        return __awaiter(this, void 0, void 0, function () {
            var check, data, resp_func, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, this.collection.find({ nsp: nsp, _id: new mongodb_1.ObjectID(resp_func_id) }).limit(1).toArray()];
                    case 1:
                        check = _a.sent();
                        data = {
                            id: (check.length && check[0].response.length) ? check[0].response.length + 1 : 1,
                            text: text,
                            resp_del: false
                        };
                        return [4 /*yield*/, this.collection.find({ nsp: nsp, _id: new mongodb_1.ObjectID(resp_func_id), 'response': { $elemMatch: { text: text, resp_del: false } } }).limit(1).toArray()];
                    case 2:
                        resp_func = _a.sent();
                        if (!!resp_func.length) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ nsp: nsp, _id: new mongodb_1.ObjectID(resp_func_id) }, { $push: { response: data } }, { returnOriginal: false })];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4:
                        console.log('Response already exist... !!!');
                        _a.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_2 = _a.sent();
                        console.log('error in Adding Responses');
                        console.log(error_2);
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    responseModel.UpdateResponse = function (nsp, id, resp_name, intent_id) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, this.collection.find({ nsp: nsp, intent_id: intent_id, del: false, 'response': { $elemMatch: { id: id, text: resp_name, resp_del: false } } }).limit(1).toArray()];
                    case 1:
                        response = _a.sent();
                        if (!!response.length) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ nsp: nsp, _id: new mongodb_1.ObjectID(intent_id), del: false, 'response': { $elemMatch: { id: id } } }, { $set: { 'response.$.text': resp_name } }, { returnOriginal: false })];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3: return [2 /*return*/, undefined];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_3 = _a.sent();
                        console.log(error_3);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    responseModel.deleteResponse = function (nsp, resp_id, intent_id) {
        return __awaiter(this, void 0, void 0, function () {
            var error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ nsp: nsp, _id: new mongodb_1.ObjectID(intent_id), 'response': { $elemMatch: { id: resp_id } } }, { $set: { 'response.$.resp_del': true } }, { returnOriginal: false })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_4 = _a.sent();
                        console.log('error in Deleting Entity');
                        console.log(error_4);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    responseModel.initialized = false;
    responseModel.id = 0;
    return responseModel;
}());
exports.responseModel = responseModel;
//# sourceMappingURL=responseModel.js.map