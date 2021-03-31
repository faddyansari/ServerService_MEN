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
exports.Contacts = void 0;
var mongodb_1 = require("mongodb");
var customError_1 = require("../helpers/customError");
var AgentsDB_1 = require("../globals/config/databses/AgentsDB");
var Contacts = /** @class */ (function () {
    function Contacts() {
    }
    // Changed to ASYNC AWAIT
    Contacts.Initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, error_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 4, , 5]);
                        _a = this;
                        return [4 /*yield*/, AgentsDB_1.AgentsDB.connect()];
                    case 1:
                        _a.db = _c.sent();
                        _b = this;
                        return [4 /*yield*/, this.db.createCollection('contacts')
                            // await this.db.collection('contacts').createIndex({ name: "text" });
                        ];
                    case 2:
                        _b.collection = _c.sent();
                        // await this.db.collection('contacts').createIndex({ name: "text" });
                        return [4 /*yield*/, this.db.collection('contacts').createIndex({ email: "text" })];
                    case 3:
                        // await this.db.collection('contacts').createIndex({ name: "text" });
                        _c.sent();
                        console.log(this.collection.collectionName);
                        Contacts.initialized = true;
                        return [2 /*return*/, Contacts.initialized];
                    case 4:
                        error_1 = _c.sent();
                        console.log('error in Initializing Contacts Model');
                        console.log(error_1);
                        throw new Error(error_1);
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    // -------------------------------x---------------------------------------------------x ||
    //                              Functions operatiing on Databases 
    //--------------------------------x---------------------------------------------------x ||
    // returns the created contact
    Contacts.createContacts = function (contact, namespace) {
        return __awaiter(this, void 0, void 0, function () {
            var contactToCreate, writeResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        contact['nsp'] = namespace;
                        contact['created_date'] = (new Date()).toISOString();
                        contact['status'] = false;
                        contactToCreate = this.cleanContactInputFields(contact);
                        return [4 /*yield*/, this.collection.find({ email: contact.email, nsp: namespace }).limit(1).toArray()];
                    case 1:
                        writeResult = _a.sent();
                        if (!writeResult.length) {
                            this.collection.insertOne(contactToCreate);
                        }
                        else {
                            this.collection.updateOne({ email: contact.email, nsp: namespace }, { $set: contactToCreate }, { upsert: false });
                        }
                        // console.log('writeResult: ');
                        // console.log(writeResult);
                        if (writeResult.length) {
                            // console.log('contactToCreate: ');
                            // console.log(contactToCreate);
                            return [2 /*return*/, writeResult[0]];
                        }
                        else {
                            return [2 /*return*/, contactToCreate];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Contacts.searchContacts = function (nsp, keyword, chunk) {
        if (chunk === void 0) { chunk = '0'; }
        return __awaiter(this, void 0, void 0, function () {
            var err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        if (!(chunk == '0')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.collection.find({
                                nsp: nsp,
                                '$or': [
                                    { name: new RegExp(keyword) },
                                    { email: new RegExp(keyword) }
                                ]
                            }).sort({ name: 1 }).limit(20).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [4 /*yield*/, this.collection.aggregate([
                            { "$match": { "nsp": nsp,
                                    '$or': [
                                        { name: new RegExp(keyword) },
                                        { email: new RegExp(keyword) }
                                    ]
                                } },
                            { "$sort": { name: 1 } },
                            { "$match": { "name": { "$gt": chunk } } },
                            { "$limit": 20 }
                        ]).toArray()];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        err_1 = _a.sent();
                        console.log('Error in Search Contacts');
                        console.log(err_1);
                        return [2 /*return*/, []];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Contacts.retrieveContacts = function (nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.find({ nsp: nsp }).sort({ name: 1 }).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_2 = _a.sent();
                        console.log('Error in Retriveing Contacts');
                        console.log(err_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Contacts.retrieveContactsByGroups = function (nsp, group) {
        return __awaiter(this, void 0, void 0, function () {
            var err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.find({ nsp: nsp, group: group }).sort({ name: 1 }).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_3 = _a.sent();
                        console.log('Error in Retriveing Contacts');
                        console.log(err_3);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Contacts.contactsCountsWithStatus = function (nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.find({ nsp: nsp }).project({ _id: 1, email: 1, status: 1 }).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_4 = _a.sent();
                        console.log('Error in Retriveing Contacts');
                        console.log(err_4);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Contacts.retrieveContactsAsync = function (nsp, type, chunk) {
        if (chunk === void 0) { chunk = '0'; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, err_5;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 14, , 15]);
                        _a = type;
                        switch (_a) {
                            case 'ONLINE': return [3 /*break*/, 1];
                            case 'OFFLINE': return [3 /*break*/, 5];
                        }
                        return [3 /*break*/, 9];
                    case 1:
                        if (!(chunk == '0')) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.collection.find({ nsp: nsp, status: true }).sort({ name: 1 }).limit(20).toArray()];
                    case 2: return [2 /*return*/, _b.sent()];
                    case 3: return [4 /*yield*/, this.collection.aggregate([
                            { "$match": { "nsp": nsp, status: true } },
                            { "$sort": { name: 1 } },
                            { "$match": { "name": { "$gt": chunk } } },
                            { "$limit": 20 }
                        ]).toArray()];
                    case 4: return [2 /*return*/, _b.sent()];
                    case 5:
                        if (!(chunk == '0')) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.collection.find({ nsp: nsp, status: false }).sort({ name: 1 }).limit(20).toArray()];
                    case 6: return [2 /*return*/, _b.sent()];
                    case 7: return [4 /*yield*/, this.collection.aggregate([
                            { "$match": { "nsp": nsp, status: false } },
                            { "$sort": { name: 1 } },
                            { "$match": { "name": { "$gt": chunk } } },
                            { "$limit": 20 }
                        ]).toArray()];
                    case 8: return [2 /*return*/, _b.sent()];
                    case 9:
                        if (!(chunk == '0')) return [3 /*break*/, 11];
                        return [4 /*yield*/, this.collection.find({ nsp: nsp }).sort({ name: 1 }).limit(20).toArray()];
                    case 10: return [2 /*return*/, _b.sent()];
                    case 11: return [4 /*yield*/, this.collection.aggregate([
                            { "$match": { "nsp": nsp } },
                            { "$sort": { name: 1 } },
                            { "$match": { "name": { "$gt": chunk } } },
                            { "$limit": 20 }
                        ]).toArray()];
                    case 12: return [2 /*return*/, _b.sent()];
                    case 13: return [3 /*break*/, 15];
                    case 14:
                        err_5 = _b.sent();
                        console.log('Error in Retriveing Contacts');
                        console.log(err_5);
                        return [3 /*break*/, 15];
                    case 15: return [2 /*return*/];
                }
            });
        });
    };
    Contacts.retrieveContactsByDept = function (nsp, group, department) {
        return __awaiter(this, void 0, void 0, function () {
            var err_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.find({ nsp: nsp, group: group, department: department }).sort({ name: 1 }).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_6 = _a.sent();
                        console.log('Error in Retriveing Contacts');
                        console.log(err_6);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Contacts.retrieveContactsByLevel = function (nsp, level) {
        if (level === void 0) { level = 0; }
        return __awaiter(this, void 0, void 0, function () {
            var err_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.find({ nsp: nsp, level: { '$gte': level } }).sort({ name: 1 }).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_7 = _a.sent();
                        console.log('Error in Retriveing Contacts');
                        console.log(err_7);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Contacts.retrieveContactsByEmail = function (nsp, email) {
        return __awaiter(this, void 0, void 0, function () {
            var err_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.find({ nsp: nsp, email: email }).limit(1).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_8 = _a.sent();
                        console.log('Error in Retriveing Contacts');
                        console.log(err_8);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Contacts.retrieveContactsByID = function (nsp, id) {
        return __awaiter(this, void 0, void 0, function () {
            var err_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.find({ nsp: nsp, _id: new mongodb_1.ObjectId(id) }).limit(1).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_9 = _a.sent();
                        console.log('Error in Retriveing Contacts');
                        console.log(err_9);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Contacts.updateStatus = function (email, nsp, status) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.collection.findOneAndUpdate({ email: email, nsp: nsp }, { $set: { status: status } })];
                    case 1: 
                    // console.log(email,nsp,status);
                    return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Contacts.editContact = function (contact) {
        return __awaiter(this, void 0, void 0, function () {
            var id, contactToUpdate, updateRes;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = new mongodb_1.ObjectID(contact._id);
                        contactToUpdate = this.cleanContactInputFields(contact);
                        if (!this.numberPattern.test(contactToUpdate['phone_no'])) {
                            throw new customError_1.CustomError("InvalidPhoneNumberOnContactCreation", 1, "Contact phone number is invalid on contact creation");
                        }
                        else if (!this.emailPattern.test(contactToUpdate['email'])) {
                            throw new customError_1.CustomError("InvalidEmailOnContactCreation", 2, "Email is invalid on contact creation");
                        }
                        //console.log(contactToUpdate);
                        // deep clone contact 
                        contact = JSON.parse(JSON.stringify(contactToUpdate));
                        delete contactToUpdate._id;
                        return [4 /*yield*/, this.collection.updateOne({ _id: id }, { $set: contactToUpdate })];
                    case 1:
                        updateRes = _a.sent();
                        if (updateRes && updateRes.result && updateRes.result.nModified === 1) {
                            return [2 /*return*/, contact];
                        }
                        else {
                            throw new customError_1.CustomError("UnsuccessfulContactEdit", 5, "Update of edited contact operation is unsuccessful.");
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Contacts.DeleteContact = function (id, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var err_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.collection.deleteOne({ _id: new mongodb_1.ObjectID(id) })];
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
    Contacts.ImportContacts = function (contactList, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var i, records;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < contactList.length)) return [3 /*break*/, 5];
                        if (!(contactList[i].name && contactList[i].email)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.collection.find({ email: contactList[i].email, nsp: nsp }).toArray()];
                    case 2:
                        records = _a.sent();
                        if (!(records && !records.length)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.collection.insertOne(contactList[i])];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 1];
                    case 5: return [2 /*return*/, this.collection.find({ nsp: nsp }).sort({ name: 1 }).limit(20).toArray()];
                }
            });
        });
    };
    Contacts.ImportContactsWithUpdate = function (contactList, nsp) {
        return __awaiter(this, void 0, void 0, function () {
            var i, record, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < contactList.length)) return [3 /*break*/, 7];
                        if (!(contactList[i].name && contactList[i].email)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.collection.findOne({ email: contactList[i].email, nsp: nsp })];
                    case 2:
                        record = _a.sent();
                        if (!record) return [3 /*break*/, 4];
                        data = contactList[i];
                        return [4 /*yield*/, this.collection.update({ _id: record._id }, { $set: data })];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, this.collection.insertOne(contactList[i])];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6:
                        i++;
                        return [3 /*break*/, 1];
                    case 7: return [2 /*return*/, this.collection.find({ nsp: nsp }).sort({ name: 1 }).limit(20).toArray()];
                }
            });
        });
    };
    // -------------------------------x---------------------------------------------------x ||
    //                              Helper Functions 
    //--------------------------------x---------------------------------------------------x ||
    Contacts.isEmailUnique = function (email, namespace) {
        return __awaiter(this, void 0, void 0, function () {
            var records;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.collection.find({ email: email, nsp: namespace }).toArray()];
                    case 1:
                        records = (_a.sent());
                        // console.log('records')
                        // console.log(records)
                        // console.log('records && records.length > 0')
                        // console.log(records && records.length > 0)
                        if (records && records.length > 0) {
                            throw new customError_1.CustomError("EmailNotUnique", 3, "Email has been previously registered in the namespace db");
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Contacts.cleanContactInputFields = function (contact) {
        contact['email'] = contact['email'].toLowerCase().trim();
        contact['name'] = contact['name'].trim();
        contact['phone_no'] = contact['phone_no'].trim();
        return contact;
    };
    Contacts.NotifyAll = function () {
        return 'Contact';
    };
    Contacts.initialized = false;
    Contacts.emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    Contacts.numberPattern = /[0-9\-]+/;
    return Contacts;
}());
exports.Contacts = Contacts;
//# sourceMappingURL=contactModel.js.map