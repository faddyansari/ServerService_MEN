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
exports.SLAPolicyExecutor = void 0;
var ticketsModel_1 = require("../../models/ticketsModel");
var SLAPolicyModel_1 = require("../../models/SLAPolicyModel");
function SLAPolicyExecutor(ticket, applyPolicy) {
    if (applyPolicy === void 0) { applyPolicy = true; }
    return __awaiter(this, void 0, void 0, function () {
        var result_1, passArr, policies, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    passArr = [];
                    return [4 /*yield*/, SLAPolicyModel_1.SLAPolicyModel.getActivatedPolicies()];
                case 1:
                    policies = _a.sent();
                    if (policies && policies.length) {
                        console.log('policies' + policies.length);
                        policies.map(function (policy) {
                            result_1 = ticketsModel_1.Tickets.CheckPrerequisites(policy, ticket);
                            if (result_1 && result_1.length) {
                                // passArr = passArr.concat(result)
                                //take sla target priority acc to ticket and pass to PolicyDispatcher.
                            }
                            else {
                                //  ticket.slaPolicyEnabled = false;
                            }
                        });
                        // if(passArr && passArr.length && applyPolicy){
                        //     passArr.map(data=>{
                        //         ticket = PolicyDispatcher(data, ticket);
                        //     })
                        // }
                    }
                    return [2 /*return*/, ticket];
                case 2:
                    error_1 = _a.sent();
                    console.log(error_1);
                    console.log('error in SLA Policy Executor');
                    return [2 /*return*/, ticket];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.SLAPolicyExecutor = SLAPolicyExecutor;
//# sourceMappingURL=SLAPolicyExecutor.js.map