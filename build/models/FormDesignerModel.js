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
exports.FormDesignerModel = void 0;
var mongodb_1 = require("mongodb");
var constants_1 = require("./../globals/config/constants");
var TicketsDB_1 = require("../globals/config/databses/TicketsDB");
var FormDesignerModel = /** @class */ (function () {
    function FormDesignerModel() {
    }
    FormDesignerModel.Initialize = function () {
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
                        return [4 /*yield*/, this.db.createCollection('formDesigner')];
                    case 2:
                        _b.collection = _c.sent();
                        FormDesignerModel.initialized = true;
                        return [2 /*return*/, FormDesignerModel.initialized];
                    case 3:
                        error_1 = _c.sent();
                        console.log('error in Initializing Form Designer Model');
                        throw new Error(error_1);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    FormDesignerModel.Destroy = function () {
        this.db = undefined;
        this.collection = undefined;
    };
    FormDesignerModel.InsertForm = function (cannedForm) {
        return __awaiter(this, void 0, void 0, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.insert(cannedForm)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_2 = _a.sent();
                        console.log('Error in Inserting Form designed');
                        console.log(error_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    FormDesignerModel.GetActionUrl = function (actionType) {
        return __awaiter(this, void 0, void 0, function () {
            var actionUrl;
            return __generator(this, function (_a) {
                if (constants_1.ActionsUrls && constants_1.ActionsUrls.length)
                    if (actionType)
                        constants_1.ActionsUrls.map(function (url) {
                            if (actionType == url.actionType)
                                actionUrl = url.actionUrl;
                        });
                return [2 /*return*/, actionUrl];
            });
        });
    };
    FormDesignerModel.GetActionsUrls = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, constants_1.ActionsUrls];
            });
        });
    };
    FormDesignerModel.updateForm = function (id, updatedForm, email) {
        return __awaiter(this, void 0, void 0, function () {
            var err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.findOneAndUpdate({
                                _id: new mongodb_1.ObjectID(id),
                            }, {
                                $set: { formFields: updatedForm.formFields, formName: updatedForm.formName, formHeader: updatedForm.formHeader, formFooter: updatedForm.formFooter, actionUrl: updatedForm.actionUrl, 'lastModified.date': new Date().toISOString(), 'lastModified.by': email }
                            }, { returnOriginal: false, upsert: false })];
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
    FormDesignerModel.GetForms = function (nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var formsFromDB, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.find({ nsp: nsp }).sort({ 'lastModified.date': -1 }).toArray()];
                    case 1:
                        formsFromDB = _a.sent();
                        return [2 /*return*/, formsFromDB];
                    case 2:
                        error_3 = _a.sent();
                        console.log(error_3);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    FormDesignerModel.GetFormsCount = function (nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.aggregate([
                                { "$match": { "nsp": nsp } },
                                { "$group": { "_id": null, "count": { $sum: 1 } } },
                            ]).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_4 = _a.sent();
                        console.log(error_4);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    FormDesignerModel.GetFormsByID = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var temp_1;
            return __generator(this, function (_a) {
                try {
                    temp_1 = id;
                    return [2 /*return*/, this.collection.find({ _id: new mongodb_1.ObjectID(id) }).limit(1).toArray()];
                }
                catch (error) {
                    console.log(error);
                    console.log('Error in Getting Form by ID ');
                }
                return [2 /*return*/];
            });
        });
    };
    FormDesignerModel.GetFormsByName = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    return [2 /*return*/, this.collection.find({ formName: name }).limit(1).toArray()];
                }
                catch (error) {
                    console.log(error);
                    console.log('Error in Get Form by name');
                }
                return [2 /*return*/];
            });
        });
    };
    FormDesignerModel.deleteForm = function (id, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.deleteOne({ _id: new mongodb_1.ObjectId(id), nsp: nsp })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_5 = _a.sent();
                        console.log('Error in deleting particular form');
                        console.log(error_5);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    FormDesignerModel.initialized = false;
    return FormDesignerModel;
}());
exports.FormDesignerModel = FormDesignerModel;
//# sourceMappingURL=FormDesignerModel.js.map