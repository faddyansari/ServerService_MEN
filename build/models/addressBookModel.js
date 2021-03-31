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
exports.AddressBookModel = void 0;
var mongodb_1 = require("mongodb");
var Marketing_DB_1 = require("../globals/config/databses/Marketing-DB");
var AddressBookModel = /** @class */ (function () {
    function AddressBookModel() {
    }
    AddressBookModel.Initialize = function () {
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
                        return [4 /*yield*/, this.db.createCollection('addressBooks')];
                    case 2:
                        _b.collection = _c.sent();
                        console.log(this.collection.collectionName);
                        AddressBookModel.initialized = true;
                        return [2 /*return*/, AddressBookModel.initialized];
                    case 3:
                        error_1 = _c.sent();
                        console.log('error in Initializing Address Book Model');
                        throw new Error(error_1);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    AddressBookModel.getAddressBooks = function (nsp) {
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
                        console.log('Error in getting Address Books');
                        console.log(err_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AddressBookModel.insertAddressBook = function (addressBooks) {
        return __awaiter(this, void 0, void 0, function () {
            var err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.insertOne(addressBooks)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_2 = _a.sent();
                        console.log('Error in inserting Address Books');
                        console.log(err_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AddressBookModel.deleteAddressBook = function (id, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var deletion, addressBook, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, this.collection.deleteOne({ _id: new mongodb_1.ObjectId(id) })];
                    case 1:
                        deletion = _a.sent();
                        if (!(deletion && deletion.deletedCount != 0)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.collection.find({ nsp: nsp }).toArray()];
                    case 2:
                        addressBook = _a.sent();
                        return [2 /*return*/, (addressBook && addressBook.length) ? addressBook : []];
                    case 3: return [2 /*return*/, []];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        err_3 = _a.sent();
                        console.log('Error in deleting Address Book');
                        console.log(err_3);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    AddressBookModel.updateAddressBook = function (id, addressBook) {
        return __awaiter(this, void 0, void 0, function () {
            var err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ _id: new mongodb_1.ObjectId(id) }, { $set: { name: addressBook.name, desc: addressBook.desc } }, { returnOriginal: false, upsert: false })];
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
    AddressBookModel.addCustomers = function (id, customers) {
        return __awaiter(this, void 0, void 0, function () {
            var Obj_1, addressBook, err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        Obj_1 = [];
                        customers.forEach(function (email) {
                            Obj_1.push({ email: email, excluded: false });
                        });
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ _id: new mongodb_1.ObjectId(id) }, { $addToSet: { customers: { $each: Obj_1 } } }, { returnOriginal: false, upsert: false })];
                    case 1:
                        addressBook = _a.sent();
                        if (addressBook && addressBook.value) {
                            return [2 /*return*/, addressBook];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_5 = _a.sent();
                        console.log('Error in adding customer for Address Book');
                        console.log(err_5);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AddressBookModel.toggleExclude = function (nsp, name, email, value) {
        return __awaiter(this, void 0, void 0, function () {
            var addressBook, err_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.find({ nsp: nsp, name: name }).limit(1).toArray()];
                    case 1:
                        addressBook = _a.sent();
                        if (addressBook && addressBook.length) {
                            addressBook[0].customers.filter(function (a) { return a.email == email; })[0].excluded = value;
                            this.collection.save(addressBook[0]);
                        }
                        return [2 /*return*/, (addressBook && addressBook.length) ? addressBook[0] : undefined];
                    case 2:
                        err_6 = _a.sent();
                        console.log(err_6);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AddressBookModel.removeCustomer = function (id, email) {
        return __awaiter(this, void 0, void 0, function () {
            var addressBook, err_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ _id: new mongodb_1.ObjectId(id) }, { $pull: { customers: { email: email } } }, { returnOriginal: false, upsert: false })];
                    case 1:
                        addressBook = _a.sent();
                        if (addressBook && addressBook.value) {
                            return [2 /*return*/, addressBook];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_7 = _a.sent();
                        console.log('Error in adding customer for address book');
                        console.log(err_7);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AddressBookModel.getAddressBooksAgainstCustomers = function (nsp, email) {
        return __awaiter(this, void 0, void 0, function () {
            var addressBooks, addressBooksFromDb, err_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        addressBooks = [];
                        return [4 /*yield*/, this.collection.find({
                                nsp: nsp,
                                'customers.email': email
                            }).toArray()];
                    case 1:
                        addressBooksFromDb = _a.sent();
                        if (addressBooksFromDb && addressBooksFromDb.length) {
                            addressBooks = addressBooksFromDb.map(function (t) { return t.name; });
                        }
                        return [2 /*return*/, addressBooks];
                    case 2:
                        err_8 = _a.sent();
                        console.log('Error in getting address Books against customers');
                        console.log(err_8);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AddressBookModel.ToggleActivation = function (nsp, flag, id, by) {
        return __awaiter(this, void 0, void 0, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.findOneAndUpdate({ nsp: nsp, _id: new mongodb_1.ObjectId(id) }, { $set: { isActive: flag, lastmodified: { date: new Date().toISOString(), by: by } } }, { returnOriginal: false, upsert: false })];
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
    AddressBookModel.initialized = false;
    return AddressBookModel;
}());
exports.AddressBookModel = AddressBookModel;
//# sourceMappingURL=addressBookModel.js.map