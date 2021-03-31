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
exports.bulkManagementRoutes = void 0;
var campaignMgtModel_1 = require("./../models/campaignMgtModel");
var addressBookModel_1 = require("./../models/addressBookModel");
var express = require("express");
var emailOwnerModel_1 = require("../models/emailOwnerModel");
var sessionsManager_1 = require("../globals/server/sessionsManager");
var aws_sqs_1 = require("../actions/aws/aws-sqs");
var router = express.Router();
router.use(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var type, id, session;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(req.headers.referer && req.headers.referer.indexOf(((process.env.NODE_ENV == 'production') || (process.env.NODE_ENV == 'development')) ? 'beelinks.solutions' : 'localhost') != -1)) return [3 /*break*/, 7];
                type = '';
                id = '';
                if (!req.headers.authorization) return [3 /*break*/, 5];
                type = req.headers.authorization.split('-')[0];
                id = req.headers.authorization.split('-')[1];
                session = '';
                if (!(type == 'Agent')) return [3 /*break*/, 2];
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetAgentByID(id)];
            case 1:
                session = _a.sent();
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, sessionsManager_1.SessionManager.GetVisitorByID(id)];
            case 3:
                session = (_a.sent());
                _a.label = 4;
            case 4:
                if (session) {
                    if (req.body.nsp && req.body.nsp != session.nsp)
                        res.status(401).send({ err: 'unauthorized' });
                    next();
                }
                else
                    res.status(401).send({ err: 'unauthorized' });
                return [3 /*break*/, 6];
            case 5:
                res.status(401).send({ err: 'unauthorized' });
                _a.label = 6;
            case 6: return [3 /*break*/, 8];
            case 7:
                res.status(401).send({ err: 'unauthorized' });
                _a.label = 8;
            case 8: return [2 /*return*/];
        }
    });
}); });
router.post('/getAddressBooks', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, session, addBooks, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                data = req.body;
                session = void 0;
                if (!data.sessionId) return [3 /*break*/, 2];
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetAgentByID(data.sessionId)];
            case 1:
                session = _a.sent();
                _a.label = 2;
            case 2:
                ;
                if (!session) return [3 /*break*/, 4];
                return [4 /*yield*/, addressBookModel_1.AddressBookModel.getAddressBooks(session.nsp)];
            case 3:
                addBooks = _a.sent();
                if (addBooks && addBooks.length) {
                    res.send({ status: 'ok', addressBooks: addBooks });
                }
                else {
                    res.send({ status: 'ok', addressBooks: [] });
                }
                return [3 /*break*/, 5];
            case 4:
                res.status(401).send({ status: 'Unauthorized' });
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                error_1 = _a.sent();
                console.log(error_1);
                console.log('Error in getAddressBooks');
                res.status(401).send("Invalid Request!");
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
router.post('/toggleAddressBookActivation', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, session, addressBook, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                data = req.body;
                session = void 0;
                if (!data.sessionId) return [3 /*break*/, 2];
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetAgentByID(data.sessionId)];
            case 1:
                session = _a.sent();
                _a.label = 2;
            case 2:
                ;
                if (!session) return [3 /*break*/, 4];
                return [4 /*yield*/, addressBookModel_1.AddressBookModel.ToggleActivation(session.nsp, data.activation, data.id, session.email)];
            case 3:
                addressBook = _a.sent();
                if (addressBook && addressBook.value) {
                    // socket.to(Agents.NotifyAll()).emit('groupChanges', {status: 'ok'});
                    res.send({ status: 'ok', addressBook: addressBook.value });
                }
                else {
                    res.send({ status: 'error', msg: 'Not activated!' });
                }
                return [3 /*break*/, 5];
            case 4:
                res.status(401).send({ status: 'Unauthorized' });
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                error_2 = _a.sent();
                console.log(error_2);
                console.log('Error in toggleAddressBookActivation');
                res.status(401).send("Invalid Request!");
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
router.post('/insertAddressBook', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, session, addressBook, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                data = req.body;
                session = void 0;
                if (!data.sessionId) return [3 /*break*/, 2];
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetAgentByID(data.sessionId)];
            case 1:
                session = _a.sent();
                _a.label = 2;
            case 2:
                ;
                if (!session) return [3 /*break*/, 4];
                data.addressBook.nsp = session.nsp;
                data.addressBook.customers = [];
                return [4 /*yield*/, addressBookModel_1.AddressBookModel.insertAddressBook(data.addressBook)];
            case 3:
                addressBook = _a.sent();
                if (addressBook && addressBook.insertedCount > 0) {
                    res.send({ status: 'ok', addressBook: addressBook.ops[0] });
                }
                else {
                    res.status(401).send({ status: 'error' });
                }
                return [3 /*break*/, 5];
            case 4:
                res.status(401).send({ status: 'Unauthorized' });
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                error_3 = _a.sent();
                console.log(error_3);
                console.log('Error in insertAddressBook');
                res.status(401).send("Invalid Request!");
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
router.post('/deleteAddressBook', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, session, addressBook, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                data = req.body;
                session = void 0;
                if (!data.sessionId) return [3 /*break*/, 2];
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetAgentByID(data.sessionId)];
            case 1:
                session = _a.sent();
                _a.label = 2;
            case 2:
                ;
                if (!session) return [3 /*break*/, 4];
                return [4 /*yield*/, addressBookModel_1.AddressBookModel.deleteAddressBook(data.id, session.nsp)];
            case 3:
                addressBook = _a.sent();
                if (addressBook) {
                    res.send({ status: 'ok', addressBook: addressBook });
                }
                return [3 /*break*/, 5];
            case 4:
                res.status(401).send({ status: 'Unauthorized' });
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                error_4 = _a.sent();
                console.log(error_4);
                console.log('Error in deleteAddressBook');
                res.status(401).send("Invalid Request!");
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
router.post('/updateAddressBook', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, session, addressBook, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                data = req.body;
                session = void 0;
                if (!data.sessionId) return [3 /*break*/, 2];
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetAgentByID(data.sessionId)];
            case 1:
                session = _a.sent();
                _a.label = 2;
            case 2:
                ;
                if (!session) return [3 /*break*/, 4];
                return [4 /*yield*/, addressBookModel_1.AddressBookModel.updateAddressBook(data._id, data.addressBook)];
            case 3:
                addressBook = _a.sent();
                if (addressBook && addressBook.value) {
                    res.send({ status: 'ok', addressBook: addressBook.value });
                }
                else {
                    res.status(401).send({ status: 'error' });
                }
                return [3 /*break*/, 5];
            case 4:
                res.status(401).send({ status: 'Unauthorized' });
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                error_5 = _a.sent();
                console.log(error_5);
                console.log('Error in updateAddressBook');
                res.status(401).send("Invalid Request!");
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
router.post('/addCustomersforAddressBook', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, session, addressBook, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                data = req.body;
                session = void 0;
                if (!data.sessionId) return [3 /*break*/, 2];
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetAgentByID(data.sessionId)];
            case 1:
                session = _a.sent();
                _a.label = 2;
            case 2:
                ;
                if (!session) return [3 /*break*/, 4];
                return [4 /*yield*/, addressBookModel_1.AddressBookModel.addCustomers(data.id, data.customers)];
            case 3:
                addressBook = _a.sent();
                if (addressBook && addressBook.value) {
                    res.send({ status: 'ok', customers: addressBook.value.customers });
                }
                else {
                    res.status(401).send({ status: 'error' });
                }
                return [3 /*break*/, 5];
            case 4:
                res.status(401).send({ status: 'Unauthorized' });
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                error_6 = _a.sent();
                console.log(error_6);
                console.log('Error in addCustomersforAddressBook');
                res.status(401).send("Invalid Request!");
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
router.post('/removeCustomersFromAddressBook', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, session, addBooks, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                data = req.body;
                session = void 0;
                if (!data.sessionId) return [3 /*break*/, 2];
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetAgentByID(data.sessionId)];
            case 1:
                session = _a.sent();
                _a.label = 2;
            case 2:
                ;
                if (!session) return [3 /*break*/, 4];
                return [4 /*yield*/, addressBookModel_1.AddressBookModel.removeCustomer(data.id, data.customers)];
            case 3:
                addBooks = _a.sent();
                if (addBooks && addBooks.value) {
                    res.send({ status: 'ok', customers: addBooks.value.customers });
                }
                else {
                    res.status(401).send({ status: 'error' });
                }
                return [3 /*break*/, 5];
            case 4:
                res.status(401).send({ status: 'Unauthorized' });
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                error_7 = _a.sent();
                console.log(error_7);
                console.log('Error in removeCustomersFromAddressBook');
                res.status(401).send("Invalid Request!");
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
router.post('/toggleExcludeForAddressBook', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, session, addressBook, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                data = req.body;
                session = void 0;
                if (!data.sessionId) return [3 /*break*/, 2];
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetAgentByID(data.sessionId)];
            case 1:
                session = _a.sent();
                _a.label = 2;
            case 2:
                ;
                if (!session) return [3 /*break*/, 4];
                return [4 /*yield*/, addressBookModel_1.AddressBookModel.toggleExclude(session.nsp, data.addressBook_name, data.customer, data.value)];
            case 3:
                addressBook = _a.sent();
                if (addressBook) {
                    res.send({ status: 'ok', addressBook: addressBook });
                }
                else {
                    res.status(401).send({ status: 'error', msg: 'Toggle exclude error', data: data });
                }
                return [3 /*break*/, 5];
            case 4:
                res.status(401).send({ status: 'Unauthorized' });
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                error_8 = _a.sent();
                console.log(error_8);
                console.log('Error in toggleExcludeForAddressBook');
                res.status(401).send("Invalid Request!");
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
//previous Fahad Routes
// router.post('/addAddressList', async (req, res) => {
//     try {
//         let data = req.body;
//         let result = await AddressBookModel.addAddressList(data.formValues);
//         if (result) {
//             res.send({ status: "ok", list: result.ops[0] })
//         } else {
//             res.send({ status: 'error' });
//         }
//     } catch (error) {
//         console.log(error);
//         console.log('Error in getting agents against role');
//         res.status(401).send("Invalid Request!");
//     }
// });
// router.post('/updateAddressList', async (req, res) => {
//     try {
//         let data = req.body;
//         let result = await AddressBookModel.updateAddressList(data.formValues, data.id, data.nsp);
//         if (result && result.value) {
//             res.send({ status: "ok", list: result.value })
//         } else {
//             res.send({ status: 'error' });
//         }
//     } catch (error) {
//         console.log(error);
//         console.log('Error in getting agents against role');
//         res.status(401).send("Invalid Request!");
//     }
// });
// router.post('/toggleActivation', async (req, res) => {
//     try {
//         let data = req.body;
//         let result = await AddressBookModel.toggleActivation(data.flag, data.id, data.nsp);
//         if (result && result.value) {
//             res.send({ status: "ok", list: result.value })
//         } else {
//             res.send({ status: 'error' });
//         }
//     } catch (error) {
//         console.log(error);
//         console.log('Error in getting agents against role');
//         res.status(401).send("Invalid Request!");
//     }
// });
// router.post('/getAddressList', async (req, res) => {
//     try {
//         let data = req.body;
//         let result = await AddressBookModel.getAddressList(data.nsp);
//         if (result && result.length) {
//             res.send({ status: "ok", allAdresses: result })
//         } else {
//             res.send({ status: 'error' });
//         }
//     } catch (error) {
//         console.log(error);
//         console.log('Error in getting agents against role');
//         res.status(401).send("Invalid Request!");
//     }
// });
/** EMAIL OWNER CRUD AND ACTIVATION */
router.post('/addEmailOwner', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, result, error_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                data = req.body;
                data.formValues['createdDate'] = new Date().toISOString();
                return [4 /*yield*/, emailOwnerModel_1.EmailOwnerModel.insertEmailOwner(data.formValues)];
            case 1:
                result = _a.sent();
                if (result) {
                    res.send({ status: "ok", result: result.ops[0] });
                }
                else {
                    res.send({ status: 'error' });
                }
                return [3 /*break*/, 3];
            case 2:
                error_9 = _a.sent();
                console.log(error_9);
                console.log('Error in adding email owner');
                res.status(401).send("Invalid Request!");
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/UpdateEmailOwner', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, result, error_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                data = req.body;
                data.formValues['lastModifiedDate'] = new Date().toISOString();
                return [4 /*yield*/, emailOwnerModel_1.EmailOwnerModel.updateEmailOwner(data.id, data.nsp, data.formValues)];
            case 1:
                result = _a.sent();
                if (result) {
                    res.send({ status: "ok", result: result.value });
                }
                else {
                    res.send({ status: 'error' });
                }
                return [3 /*break*/, 3];
            case 2:
                error_10 = _a.sent();
                console.log(error_10);
                console.log('Error in adding email owner');
                res.status(401).send("Invalid Request!");
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/getOwnersList', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, result, error_11;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                data = req.body;
                return [4 /*yield*/, emailOwnerModel_1.EmailOwnerModel.getOwnersList(data.nsp)];
            case 1:
                result = _a.sent();
                if (result && result.length) {
                    res.send({ status: "ok", allOwners: result });
                }
                else {
                    res.send({ status: 'error' });
                }
                return [3 /*break*/, 3];
            case 2:
                error_11 = _a.sent();
                console.log(error_11);
                console.log('Error in getting owner list');
                res.status(401).send("Invalid Request!");
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/deleteEmailOwner', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, result, error_12;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                data = req.body;
                return [4 /*yield*/, emailOwnerModel_1.EmailOwnerModel.deleteEmailOwner(data.id, data.nsp)];
            case 1:
                result = _a.sent();
                if (result) {
                    res.send({ status: "ok" });
                }
                else {
                    res.send({ status: 'error' });
                }
                return [3 /*break*/, 3];
            case 2:
                error_12 = _a.sent();
                console.log(error_12);
                console.log('Error in deleting email owner');
                res.status(401).send("Invalid Request!");
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/toggleActivation', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, result, error_13;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                data = req.body;
                return [4 /*yield*/, emailOwnerModel_1.EmailOwnerModel.toggleActivation(data.flag, data.id, data.nsp, data.email)];
            case 1:
                result = _a.sent();
                if (result && result.value) {
                    res.send({ status: "ok", result: result.value });
                }
                else {
                    res.send({ status: 'error' });
                }
                return [3 /*break*/, 3];
            case 2:
                error_13 = _a.sent();
                console.log(error_13);
                console.log('Error in getting agents against role');
                res.status(401).send("Invalid Request!");
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**CAMPAIGN MANAGEMENT */
router.post('/insertCampaign', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, result, error_14;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                data = req.body;
                data.formValues.created.at = new Date().toISOString();
                return [4 /*yield*/, campaignMgtModel_1.CampaignManagementModel.insertCampaign(data.formValues)];
            case 1:
                result = _a.sent();
                if (result) {
                    res.send({ status: "ok", result: result.ops[0] });
                }
                else {
                    res.send({ status: 'error' });
                }
                return [3 /*break*/, 3];
            case 2:
                error_14 = _a.sent();
                console.log(error_14);
                console.log('Error in inserting campaign');
                res.status(401).send("Invalid Request!");
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/getCampaigns', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, result, error_15;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                data = req.body;
                return [4 /*yield*/, campaignMgtModel_1.CampaignManagementModel.getCampaigns(data.nsp)];
            case 1:
                result = _a.sent();
                if (result && result.length) {
                    res.send({ status: "ok", allCampaigns: result });
                }
                else {
                    res.send({ status: 'error' });
                }
                return [3 /*break*/, 3];
            case 2:
                error_15 = _a.sent();
                console.log(error_15);
                console.log('Error in getting campaigns');
                res.status(401).send("Invalid Request!");
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/deleteCampaign', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, result, error_16;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                data = req.body;
                return [4 /*yield*/, campaignMgtModel_1.CampaignManagementModel.deleteCampaign(data.id, data.nsp)];
            case 1:
                result = _a.sent();
                if (result) {
                    res.send({ status: "ok" });
                }
                else {
                    res.send({ status: 'error' });
                }
                return [3 /*break*/, 3];
            case 2:
                error_16 = _a.sent();
                console.log(error_16);
                console.log('Error in deleting campaign');
                res.status(401).send("Invalid Request!");
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/UpdateCampaign', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, result, error_17;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                data = req.body;
                data.obj.lastModified.at = new Date().toISOString();
                return [4 /*yield*/, campaignMgtModel_1.CampaignManagementModel.updateCampaign(data.id, data.nsp, data.formValues)];
            case 1:
                result = _a.sent();
                if (result) {
                    res.send({ status: "ok", result: result.value });
                }
                else {
                    res.send({ status: 'error' });
                }
                return [3 /*break*/, 3];
            case 2:
                error_17 = _a.sent();
                console.log(error_17);
                console.log('Error in adding email owner');
                res.status(401).send("Invalid Request!");
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/toggleCampaign', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, result, error_18;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                data = req.body;
                return [4 /*yield*/, campaignMgtModel_1.CampaignManagementModel.toggleCampaign(data.flag, data.id, data.nsp, data.email, data.type)];
            case 1:
                result = _a.sent();
                if (result && result.value) {
                    res.send({ status: "ok", result: result.value });
                }
                else {
                    res.send({ status: 'error' });
                }
                return [3 /*break*/, 3];
            case 2:
                error_18 = _a.sent();
                console.log(error_18);
                console.log('Error in getting agents against role');
                res.status(401).send("Invalid Request!");
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/sendPreviewEmail', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, response, error_19;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                data = req.body;
                return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendMessage({ action: 'sendPreviewEmail', data: data })];
            case 1:
                response = _a.sent();
                if (response) {
                    res.send({ status: "ok" });
                }
                else {
                    res.send({ status: 'error' });
                }
                return [3 /*break*/, 3];
            case 2:
                error_19 = _a.sent();
                console.log(error_19);
                console.log('Error in sending preview campaign');
                res.status(401).send("Invalid Request!");
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.bulkManagementRoutes = router;
//# sourceMappingURL=bulkManagement.js.map