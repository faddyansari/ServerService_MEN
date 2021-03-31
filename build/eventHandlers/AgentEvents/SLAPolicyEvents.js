"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
//Native Modules
var SLAPolicyModel_1 = require("../../models/SLAPolicyModel");
var SLAPolicyEvents = /** @class */ (function () {
    function SLAPolicyEvents() {
    }
    SLAPolicyEvents.BindSLAPolicyEvents = function (socket, origin) {
        SLAPolicyEvents.GetAllPoliciesByNSP(socket, origin);
        SLAPolicyEvents.AddPolicy(socket, origin);
        SLAPolicyEvents.UpdatePolicy(socket, origin);
        SLAPolicyEvents.DeletePolicy(socket, origin);
        SLAPolicyEvents.PolicyActivation(socket, origin);
        SLAPolicyEvents.reOrder(socket, origin);
    };
    SLAPolicyEvents.AddPolicy = function (socket, origin) {
        var _this = this;
        socket.on('AddPolicy', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var policy, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        console.log("before add");
                        return [4 /*yield*/, SLAPolicyModel_1.SLAPolicyModel.AddPolicy(data.policyObj)];
                    case 1:
                        policy = _a.sent();
                        if (policy) {
                            console.log("added", policy.ops[0]);
                            callback({ status: 'ok', policyInserted: policy.ops[0] });
                        }
                        else {
                            callback({ status: 'error', code: 500, msg: 'Internal Server Error' });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.log(error_1);
                        console.log('error in creating Email Template');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    SLAPolicyEvents.DeletePolicy = function (socket, origin) {
        var _this = this;
        socket.on('deleteSLAPolicy', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var result, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, SLAPolicyModel_1.SLAPolicyModel.DeletePolicy(data.id, socket.handshake.session.nsp)];
                    case 1:
                        result = _a.sent();
                        if (result) {
                            callback({ status: 'ok', msg: "SLA Policy Deleted Successfully!" });
                        }
                        else {
                            callback({ status: 'error' });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        callback({ status: 'error', msg: error_2 });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    SLAPolicyEvents.UpdatePolicy = function (socket, origin) {
        var _this = this;
        socket.on('updateSLAPolicy', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var policyedited, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        data.updatedPolicy.lastModified = {};
                        data.updatedPolicy.lastModified.date = new Date().toISOString();
                        data.updatedPolicy.lastModified.by = socket.handshake.session.email;
                        return [4 /*yield*/, SLAPolicyModel_1.SLAPolicyModel.UpdatePolicy(data.sid, data.updatedPolicy, socket.handshake.session.nsp)];
                    case 1:
                        policyedited = _a.sent();
                        if (policyedited && policyedited.value) {
                            callback({ status: 'ok', policyedited: policyedited.value });
                        }
                        else {
                            callback({ status: 'error', code: 500, msg: 'Internal Server Error' });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        console.log(error_3);
                        console.log('error in editing Email Template');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    SLAPolicyEvents.PolicyActivation = function (socket, origin) {
        var _this = this;
        socket.on('activateSLAPolicy', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var lastModified, policyActivated, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        lastModified = {
                            date: new Date().toISOString(),
                            by: socket.handshake.session.email
                        };
                        return [4 /*yield*/, SLAPolicyModel_1.SLAPolicyModel.activatePolicy(data.pid, data.activated, socket.handshake.session.nsp, lastModified)];
                    case 1:
                        policyActivated = _a.sent();
                        console.log(policyActivated);
                        if (policyActivated) {
                            callback({ status: 'ok', policyUpdated: policyActivated, lastModified: lastModified });
                        }
                        else {
                            callback({ status: 'error', code: 500, msg: 'Internal Server Error' });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        console.log(error_4);
                        console.log('error in activating survey');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    SLAPolicyEvents.GetAllPoliciesByNSP = function (socket, origin) {
        var _this = this;
        socket.on('getAllPoliciesByNSP', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var policies, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, SLAPolicyModel_1.SLAPolicyModel.getPoliciesByNSP(socket.handshake.session.nsp)];
                    case 1:
                        policies = _a.sent();
                        if (policies && policies.length) {
                            callback({ status: 'ok', policies: policies });
                        }
                        else {
                            callback({ status: 'error', code: 500, msg: 'Internal Server Error' });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_5 = _a.sent();
                        console.log(error_5);
                        console.log('error in Getting Email Templates');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    SLAPolicyEvents.reOrder = function (socket, origin) {
        var _this = this;
        socket.on('reOrder', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var policies, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, SLAPolicyModel_1.SLAPolicyModel.reOrder(data.callerid, data.calleeorder, data.calleeid, data.callerorder, socket.handshake.session.nsp)];
                    case 1:
                        policies = _a.sent();
                        if (policies && policies.value) {
                            callback({ status: 'ok', msg: "ReOrder Done" });
                        }
                        else {
                            callback({ status: 'error', code: 500, msg: 'Internal Server Error' });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_6 = _a.sent();
                        console.log(error_6);
                        console.log('error in reordering');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    return SLAPolicyEvents;
}());
exports.SLAPolicyEvents = SLAPolicyEvents;
//# sourceMappingURL=SLAPolicyEvents.js.map