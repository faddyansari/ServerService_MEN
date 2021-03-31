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
var assignmentRuleModel_1 = require("../../models/assignmentRuleModel");
var bson_1 = require("bson");
var AssignAutomationEvents = /** @class */ (function () {
    function AssignAutomationEvents() {
    }
    AssignAutomationEvents.BindAssignmentAutomationEvents = function (socket, origin) {
        AssignAutomationEvents.AddRule(socket, origin);
        AssignAutomationEvents.GetAllRules(socket, origin);
        AssignAutomationEvents.EditRule(socket, origin);
        AssignAutomationEvents.DeleteRule(socket, origin);
        AssignAutomationEvents.GetFilters(socket, origin);
        // AssignAutomationEvents.GetMoreCustomerConversations(socket, origin);
        // AssignAutomationEvents.GetCustomerConversationDetails(socket, origin);
    };
    AssignAutomationEvents.AddRule = function (socket, origin) {
        var _this = this;
        socket.on('addAssignmentRule', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var rule, ruleInserted, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        rule = {
                            _id: new bson_1.ObjectID,
                            nsp: socket.handshake.session.nsp,
                            ruleName: data.ruleName,
                            key: data.key,
                            value: data.value,
                            type: data.type,
                            operator: data.operator,
                            createdBy: socket.handshake.session.email,
                            createdOn: new Date().toISOString(),
                        };
                        return [4 /*yield*/, assignmentRuleModel_1.AssignmentRules.createRule(rule)];
                    case 1:
                        ruleInserted = _a.sent();
                        if (ruleInserted) {
                            callback({ status: 'ok', rule: rule });
                        }
                        else
                            callback({ status: 'error' });
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.log(error_1);
                        callback({ status: error_1 });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    AssignAutomationEvents.DeleteRule = function (socket, origin) {
        var _this = this;
        socket.on('deleteAssignmentRule', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var deleted, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, assignmentRuleModel_1.AssignmentRules.DeleteRule(data.id, socket.handshake.session.nsp)];
                    case 1:
                        deleted = _a.sent();
                        if (deleted && deleted.deletedCount) {
                            callback({ status: 'ok' });
                        }
                        else {
                            throw new Error("Can't Delete Rule");
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        console.log('error in Delete Rule');
                        console.log(error_2);
                        callback({ status: 'error', msg: error_2 });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    AssignAutomationEvents.GetAllRules = function (socket, origin) {
        var _this = this;
        socket.on('getRules', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var rulesList, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, assignmentRuleModel_1.AssignmentRules.getRules(socket.handshake.session.nsp, (data.id) ? data.id : undefined)];
                    case 1:
                        rulesList = _a.sent();
                        callback({ status: 'ok', rulesList: rulesList });
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        console.log('error in Get Cases');
                        console.log(error_3);
                        callback({ status: 'error', message: "Can't Get Cases" });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    AssignAutomationEvents.EditRule = function (socket, origin) {
        var _this = this;
        socket.on('editRule', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var editedRule, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, assignmentRuleModel_1.AssignmentRules.Edit(data._id, data, socket.handshake.session.nsp)];
                    case 1:
                        editedRule = _a.sent();
                        //console.log(editedCase)
                        if (editedRule && editedRule.value) {
                            callback({ status: 'ok', rule: editedRule });
                        }
                        else {
                            throw new Error("Can't Edit Rule");
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        console.log('error in Edit Rule');
                        console.log(error_4);
                        callback({ status: 'error', message: "Can't Edit Rule" });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    AssignAutomationEvents.GetFilters = function (socket, origin) {
        var _this = this;
        socket.on('getFiltersForAssignment', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    /**
                     * @Note
                     * Wrong Code. @Review_Thoroughly
                     */
                    // let pattern = new RegExp(data.filterKey, 'gi');
                    // let collections = await AssignmentRules.getCollectionsFromFilter((pattern as any));
                    // let matched: Array<string> = [];
                    // if (collections && collections.length) await collections.filter(async collection => {
                    //     if (new RegExp(pattern).test(collection.name)) matched.push(collection.name)
                    // })
                    // let filters = [];await AssignmentRules.getFilteredResultKeys(matched, (socket.handshake.session as AgentSessionSchema).nsp);
                    callback({ status: 'ok', filterKeys: [] });
                }
                catch (error) {
                    console.log('error in Get filters');
                    console.log(error);
                    callback({ status: 'error', message: "Can't Get filters" });
                }
                return [2 /*return*/];
            });
        }); });
    };
    return AssignAutomationEvents;
}());
exports.AssignAutomationEvents = AssignAutomationEvents;
// db.visitors.find().snapshot().forEach(function (x) {
//     x.sessions.forEach(function (part, index) {
//         this[index] = new ObjectId(part);
//     }, x.sessions);
//     let nsp = db.visitorSessions.find({ _id: { $in: x.sessions } }).sort({ id: -1 }).forEach(function (z) {
//         if (z && z.nsp) {
//             db.visitors.find({ deviceID: z.deviceID }).forEach(function (y) {
//                 y.nsp = z.nsp
//                 db.visitors.save(y);
//             });
//         }
//     });
// });
//# sourceMappingURL=AssignmentAutomationEvents.js.map