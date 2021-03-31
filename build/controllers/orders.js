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
exports.ordersRoutes = void 0;
var express = require("express");
var sessionsManager_1 = require("../globals/server/sessionsManager");
var constants_1 = require("../globals/config/constants");
var orders_1 = require("../models/orders");
var companyModel_1 = require("../models/companyModel");
var request = require("request-promise");
var retry = require("async-retry");
var util_1 = require("util");
var packagesModel_1 = require("../models/packagesModel");
var router = express.Router();
router.use('/', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var agent, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                if (!(req.path.indexOf(constants_1.subscriptionSuccessPath) != -1 || req.path.indexOf(constants_1.subscriptionThankYouPath) != -1)) return [3 /*break*/, 1];
                next();
                return [3 /*break*/, 3];
            case 1:
                // console.log(req.query)
                // console.log(req.params)
                if (!req.body.sid) {
                    res.status(401).send({ status: 'err', msg: 'sid not present' });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetAgentByID(decodeURIComponent(req.body.sid))];
            case 2:
                agent = _a.sent();
                // console.log('Agent :', agent.role);
                if (agent && agent.role == 'superadmin') {
                    next();
                }
                else {
                    res.status(401).send({ status: 'err', msg: 'unauthorized' });
                }
                _a.label = 3;
            case 3: return [3 /*break*/, 5];
            case 4:
                error_1 = _a.sent();
                console.log(error_1);
                console.log('error in Orders Middleware');
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
/**
 * @TODO
 * 1. Create Thank you page design
 * 2. Respond with HTML from Following Route
 */
router.get('/thank_you', function (req, res) {
    console.log('Ok Thank YOu');
    res.status(200).send({ status: 'Ok Thank You' });
    return;
});
router.post('/payment_complete', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var company_1, invoice_1, promises, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 8, , 9]);
                if (!(req.body.ResponseObject.Packages && util_1.isArray(req.body.ResponseObject.Packages))) return [3 /*break*/, 6];
                return [4 /*yield*/, companyModel_1.Company.getCompanyByOrderID(req.body.ResponseObject.OrderKey)];
            case 1:
                company_1 = _a.sent();
                if (!(company_1 && company_1.length)) return [3 /*break*/, 4];
                return [4 /*yield*/, Promise.all(req.body.ResponseObject.Packages.map(function (pkg) { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, pack, error_3;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 10, , 11]);
                                    _a = pkg.PackageId;
                                    switch (_a) {
                                        case constants_1.packageCodesDirect.agent: return [3 /*break*/, 1];
                                        case constants_1.packageCodesCard.agent: return [3 /*break*/, 1];
                                        case constants_1.packageCodesDirect['honey-comb']: return [3 /*break*/, 4];
                                        case constants_1.packageCodesCard['honey-comb']: return [3 /*break*/, 4];
                                    }
                                    return [3 /*break*/, 9];
                                case 1:
                                    /**
                                     * @Case Handle Agents Buying
                                     * 1. Increase Limit
                                     * 2. Insert Invoice
                                     */
                                    invoice_1 = {
                                        nsp: company_1[0].name,
                                        date: new Date().toISOString(),
                                        items: (pkg.Quantity > 1) ? [pkg.Quantity + " Agents"] : [pkg.Quantity + " Agent"],
                                        status: 'completed',
                                        amount: req.body.ResponseObject.Amount,
                                        invoiceID: req.body.ResponseObject.ChargeId,
                                        submittedBy: ''
                                    };
                                    return [4 /*yield*/, orders_1.Orders.InsertInvoice(invoice_1)];
                                case 2:
                                    _b.sent();
                                    return [4 /*yield*/, companyModel_1.Company.updateAgentLimit(company_1[0].name, pkg.Quantity)
                                        // await Promise.all([
                                        //     await Orders.InsertInvoice(invoice),
                                        //     await Company.updateAgentLimit(company[0].name, pkg.Quantity)
                                        // ]);
                                    ];
                                case 3:
                                    _b.sent();
                                    // await Promise.all([
                                    //     await Orders.InsertInvoice(invoice),
                                    //     await Company.updateAgentLimit(company[0].name, pkg.Quantity)
                                    // ]);
                                    return [2 /*return*/];
                                case 4: return [4 /*yield*/, packagesModel_1.PackagesModel.GetPackageByName(pkg.PackageCode)];
                                case 5:
                                    pack = _b.sent();
                                    if (!(pack && pack.length)) return [3 /*break*/, 7];
                                    pack[0].details.agents.limit = company_1[0].package.agents.limit;
                                    return [4 /*yield*/, companyModel_1.Company.updateCompanyPackage(company_1[0].name, pack[0].details)];
                                case 6:
                                    _b.sent();
                                    _b.label = 7;
                                case 7:
                                    invoice_1 = {
                                        nsp: company_1[0].name,
                                        date: new Date().toISOString(),
                                        items: ["" + pkg.PackageName],
                                        status: 'completed',
                                        amount: req.body.ResponseObject.Amount,
                                        invoiceID: req.body.ResponseObject.ChargeId,
                                        submittedBy: ''
                                    };
                                    return [4 /*yield*/, orders_1.Orders.InsertInvoice(invoice_1)];
                                case 8:
                                    _b.sent();
                                    // await Company.updateAgentLimit(company[0].name, pkg.Quantity)
                                    return [2 /*return*/];
                                case 9: return [3 /*break*/, 11];
                                case 10:
                                    error_3 = _b.sent();
                                    console.log(error_3);
                                    console.log('error in Processing Packages');
                                    return [3 /*break*/, 11];
                                case 11: return [2 /*return*/];
                            }
                        });
                    }); }))];
            case 2:
                promises = _a.sent();
                return [4 /*yield*/, promises];
            case 3:
                _a.sent();
                res.status(200).send({ status: 'ok', data: req.body });
                return [3 /*break*/, 5];
            case 4:
                console.log({ status: 'err', msg: 'order_id not exist' });
                res.status(401).send({ status: 'err', msg: 'order_id not exist' });
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                console.log({ status: 'err', msg: 'invalid obj' });
                res.status(401).send({ status: 'err', msg: 'invalid obj' });
                _a.label = 7;
            case 7: return [3 /*break*/, 9];
            case 8:
                error_2 = _a.sent();
                console.log(error_2);
                console.log('error in payment complete');
                res.status(500).send({ status: 'err', msg: 'internal server error' });
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); });
router.post('/getPricing', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var pricing, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, orders_1.Orders.GetPricing()];
            case 1:
                pricing = _a.sent();
                if (pricing && pricing.length)
                    res.status(200).send({ status: 'ok', agentPrice: pricing[0].agentPrice });
                else
                    res.status(200).send({ status: 'ok', agentPrice: constants_1.Pricing.agentPrice });
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                console.log(error_4);
                console.log('Error in Getting Pricing');
                res.status(500).send({ status: 'internal server error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * @params
 * 1. sid : string
 * 2. nsp : string
 * 3. email : string
 */
router.post('/getInvoices', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var orders, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, orders_1.Orders.GetOrders(decodeURIComponent(req.body.nsp))];
            case 1:
                orders = _a.sent();
                res.status(200).send({ status: 'ok', invoices: orders, synced: (orders && orders.length < 20) });
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                console.log(error_5);
                console.log('Error in Getting Invoices');
                res.status(500).send({ status: 'internal server error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * @params
 * 1. sid : string
 * 2. nsp : string
 * 3. lastInvDate : string,
 * 4. email : string
 */
router.post('/getMoreInvoices', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var orders, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, orders_1.Orders.GetMoreOrders(decodeURIComponent(req.body.nsp), req.body.lastInvDate)];
            case 1:
                orders = _a.sent();
                res.status(200).send({ status: 'ok', invoices: orders, synced: (orders && orders.length < 20) });
                return [3 /*break*/, 3];
            case 2:
                error_6 = _a.sent();
                console.log(error_6);
                console.log('Error in Getting More Invoices');
                res.status(500).send({ status: 'internal server error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/createInvoice', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var orders, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, orders_1.Orders.GetOrders(req.body.nsp)];
            case 1:
                orders = _a.sent();
                res.status(200).send({ status: 'ok', invoices: orders, synced: (orders && orders.length < 20) });
                return [3 /*break*/, 3];
            case 2:
                error_7 = _a.sent();
                console.log(error_7);
                console.log('Error in Creating Invoices');
                res.status(500).send({ status: 'internal server error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/verifyAgentBuyLimit', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var company, UpdateOrderID_1, orderID_1, result, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 9, , 10]);
                if (!req.body.count || req.body.count < 0) {
                    res.status(401).send({ status: 'err', msg: 'Invalid Request' });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, companyModel_1.Company.getCompany(req.body.nsp)];
            case 1:
                company = _a.sent();
                if (!(company && company.length && company[0].package.agents.limit)) return [3 /*break*/, 7];
                if (!((company[0].package.agents.limit + parseInt(req.body.count)) > company[0].package.agents.quota)) return [3 /*break*/, 2];
                res.status(400).send({ status: 'err', msg: 'Agents Limit Exceeded' });
                return [2 /*return*/];
            case 2:
                if (!((company[0].package.agents.limit + parseInt(req.body.count)) <= company[0].package.agents.quota)) return [3 /*break*/, 6];
                UpdateOrderID_1 = !(company[0].orderID);
                orderID_1 = (company[0].orderID) ? company[0].orderID : constants_1.GenerateOrderID();
                return [4 /*yield*/, retry(function (async) { return __awaiter(void 0, void 0, void 0, function () {
                        var response, response, response_1, error_9;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 8, , 9]);
                                    if (!UpdateOrderID_1) return [3 /*break*/, 2];
                                    return [4 /*yield*/, request.post(constants_1.subscriptionURL + constants_1.packageCodesCard['agent'], {
                                            body: {
                                                OrderKey: orderID_1,
                                                Packages: {
                                                    PackageId: constants_1.packageCodesCard['agent'],
                                                    Quantity: req.body.count
                                                }
                                            },
                                            json: true,
                                            timeout: 30000
                                        })];
                                case 1:
                                    response = _a.sent();
                                    // console.log('response : ', response);
                                    //if resultcode == 401 then retry
                                    if (response && (response.ResultCode == 200))
                                        return [2 /*return*/, response];
                                    else
                                        return [2 /*return*/, undefined];
                                    return [3 /*break*/, 7];
                                case 2: return [4 /*yield*/, request.post(constants_1.subscriptionURLDirect + constants_1.packageCodesDirect['agent'], {
                                        body: {
                                            OrderKey: orderID_1,
                                            Packages: {
                                                PackageId: constants_1.packageCodesDirect['agent'],
                                                Quantity: req.body.count
                                            }
                                        },
                                        json: true,
                                        timeout: 30000
                                    })];
                                case 3:
                                    response = _a.sent();
                                    if (!(response && (response.ResultCode == 200))) return [3 /*break*/, 4];
                                    response.success = true;
                                    return [2 /*return*/, response];
                                case 4:
                                    if (!(response && (response.ResultCode == 401 || response.ResultText.toLowerCase() == 'subscription not found'))) return [3 /*break*/, 6];
                                    orderID_1 = constants_1.GenerateOrderID();
                                    UpdateOrderID_1 = true;
                                    return [4 /*yield*/, request.post(constants_1.subscriptionURL + constants_1.packageCodesCard['agent'], {
                                            body: {
                                                OrderKey: orderID_1,
                                                Packages: {
                                                    PackageId: constants_1.packageCodesCard['agent'],
                                                    Quantity: req.body.count
                                                }
                                            },
                                            json: true,
                                            timeout: 30000
                                        })];
                                case 5:
                                    response_1 = _a.sent();
                                    // console.log('response : ', response);
                                    if (response_1 && (response_1.ResultCode == 200))
                                        return [2 /*return*/, response_1];
                                    else
                                        return [2 /*return*/, undefined];
                                    return [3 /*break*/, 7];
                                case 6: return [2 /*return*/, undefined];
                                case 7: return [3 /*break*/, 9];
                                case 8:
                                    error_9 = _a.sent();
                                    console.log(error_9);
                                    console.log('error in submitting Orderid');
                                    return [3 /*break*/, 9];
                                case 9: return [2 /*return*/];
                            }
                        });
                    }); }, { retries: 5, factor: 3, randomize: true })];
            case 3:
                result = _a.sent();
                if (!(UpdateOrderID_1 && result)) return [3 /*break*/, 5];
                return [4 /*yield*/, companyModel_1.Company.InsertOrderID(req.body.nsp, orderID_1)];
            case 4:
                _a.sent();
                _a.label = 5;
            case 5:
                if (result) {
                    if (result.success)
                        res.status(200).send({ status: 'ok', result: { PaymentURL: '', success: true } });
                    else
                        res.status(200).send({ status: 'ok', result: { PaymentURL: result.ResponseObject.PaymentURL, success: false } });
                }
                else {
                    res.status(500).send({ status: 'err', result: result });
                }
                _a.label = 6;
            case 6: return [3 /*break*/, 8];
            case 7:
                res.status(401).send({ status: 'Limit Not Found' });
                _a.label = 8;
            case 8: return [3 /*break*/, 10];
            case 9:
                error_8 = _a.sent();
                console.log(error_8);
                console.log('Error in Verifying Agents Limit');
                res.status(500).send({ status: 'internal server error' });
                return [3 /*break*/, 10];
            case 10: return [2 /*return*/];
        }
    });
}); });
router.post('/upgradePackage', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var company, UpdateOrderID_2, orderID_2, result, error_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                if (!req.body.nsp || req.body.name < 0) {
                    res.status(401).send({ status: 'err', msg: 'Invalid Request' });
                    return [2 /*return*/];
                }
                if (!constants_1.packageCodesCard[req.body.name]) {
                    res.status(401).send({ status: 'err', msg: 'Package Not Found' });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, companyModel_1.Company.getCompany(req.body.nsp)];
            case 1:
                company = _a.sent();
                UpdateOrderID_2 = !(company[0].orderID);
                orderID_2 = (company[0].orderID) ? company[0].orderID : constants_1.GenerateOrderID();
                return [4 /*yield*/, retry(function (async) { return __awaiter(void 0, void 0, void 0, function () {
                        var response, response, response_2, error_11;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 8, , 9]);
                                    if (!UpdateOrderID_2) return [3 /*break*/, 2];
                                    return [4 /*yield*/, request.post(constants_1.subscriptionURL + constants_1.packageCodesCard[req.body.name], {
                                            body: {
                                                OrderKey: orderID_2,
                                                Packages: {
                                                    PackageId: constants_1.packageCodesCard[req.body.name],
                                                    PackageName: req.body.name
                                                }
                                            },
                                            json: true,
                                            timeout: 30000
                                        })];
                                case 1:
                                    response = _a.sent();
                                    // console.log('response : ', response);
                                    //if resultcode == 401 then retry
                                    if (response && (response.ResultCode == 200))
                                        return [2 /*return*/, response];
                                    else
                                        return [2 /*return*/, undefined];
                                    return [3 /*break*/, 7];
                                case 2:
                                    console.log(constants_1.subscriptionURLDirect + constants_1.packageCodesDirect[req.body.name]);
                                    return [4 /*yield*/, request.post(constants_1.subscriptionURLDirect + constants_1.packageCodesDirect[req.body.name], {
                                            body: {
                                                OrderKey: orderID_2,
                                                Packages: {
                                                    PackageId: constants_1.packageCodesDirect[req.body.name],
                                                    PackageName: req.body.name
                                                }
                                            },
                                            json: true,
                                            timeout: 30000
                                        })];
                                case 3:
                                    response = _a.sent();
                                    console.log('response : ', response);
                                    if (!(response && (response.ResultCode == 200))) return [3 /*break*/, 4];
                                    response.success = true;
                                    return [2 /*return*/, response];
                                case 4:
                                    if (!(response && (response.ResultCode == 401 || response.ResultText.toLowerCase() == 'subscription not found'))) return [3 /*break*/, 6];
                                    orderID_2 = constants_1.GenerateOrderID();
                                    UpdateOrderID_2 = true;
                                    return [4 /*yield*/, request.post(constants_1.subscriptionURL + constants_1.packageCodesCard[req.body.name], {
                                            body: {
                                                OrderKey: orderID_2,
                                                Packages: {
                                                    PackageId: constants_1.packageCodesCard[req.body.name],
                                                    PackageName: req.body.name
                                                }
                                            },
                                            json: true,
                                            timeout: 30000
                                        })];
                                case 5:
                                    response_2 = _a.sent();
                                    // console.log('response : ', response);
                                    if (response_2 && (response_2.ResultCode == 200))
                                        return [2 /*return*/, response_2];
                                    else
                                        return [2 /*return*/, undefined];
                                    return [3 /*break*/, 7];
                                case 6: return [2 /*return*/, undefined];
                                case 7: return [3 /*break*/, 9];
                                case 8:
                                    error_11 = _a.sent();
                                    console.log(error_11);
                                    console.log('error in submitting Orderid');
                                    return [3 /*break*/, 9];
                                case 9: return [2 /*return*/];
                            }
                        });
                    }); }, { retries: 5, factor: 3, randomize: true })];
            case 2:
                result = _a.sent();
                if (!(UpdateOrderID_2 && result)) return [3 /*break*/, 4];
                return [4 /*yield*/, companyModel_1.Company.InsertOrderID(req.body.nsp, orderID_2)];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4:
                if (result) {
                    if (result.success)
                        res.status(200).send({ status: 'ok', result: { PaymentURL: '', success: true } });
                    else
                        res.status(200).send({ status: 'ok', result: { PaymentURL: result.ResponseObject.PaymentURL, success: false } });
                }
                else {
                    res.status(500).send({ status: 'err', result: result });
                }
                return [3 /*break*/, 6];
            case 5:
                error_10 = _a.sent();
                console.log(error_10);
                console.log('Error in Verifying Agents Limit');
                res.status(500).send({ status: 'internal server error' });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
/* #endregion */
exports.ordersRoutes = router;
//# sourceMappingURL=orders.js.map