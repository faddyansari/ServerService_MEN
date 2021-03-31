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
exports.ApplyRuleSets = void 0;
var assignmentRuleModel_1 = require("../../models/assignmentRuleModel");
function ApplyRuleSets(session, obj) {
    return __awaiter(this, void 0, void 0, function () {
        var rulesets, matched_1, votingArray_1, RuleIndex_1, max_1, data_1, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, assignmentRuleModel_1.AssignmentRules.getRuleSets(session.nsp)];
                case 1:
                    rulesets = _a.sent();
                    if (rulesets && rulesets.length) {
                        matched_1 = new Array(rulesets.length).fill(0);
                        votingArray_1 = new Array(rulesets.length).fill(0);
                        // let search: any = {};
                        // search.$or = []
                        // search.$and = []
                        rulesets.map(function (ruleset, index) {
                            switch (ruleset.operator.toLowerCase()) {
                                case 'or':
                                    ruleset.conditions.map(function (condition) {
                                        if (obj.hasOwnProperty(condition.key)) {
                                            // console.log('Condition Matched', obj[condition.key]);
                                            var result = obj[condition.key].match(new RegExp(condition.regex, 'gmi'));
                                            if (result && result.length) {
                                                // console.log(result.length);
                                                // console.log('Regex Matched', result);
                                                votingArray_1[index] += result.length;
                                                matched_1[index] = true;
                                            }
                                        }
                                    });
                                    break;
                                case 'and':
                                    var canMatch_1 = true;
                                    ruleset.conditions.map(function (condition) {
                                        if (canMatch_1 && obj.hasOwnProperty(condition.key)) {
                                            var result = obj[condition.key].match(new RegExp(condition.regex, 'gmi'));
                                            if (result && result.length) {
                                                votingArray_1[index] += result.length;
                                                matched_1[index] = true;
                                            }
                                            else {
                                                matched_1[index] = false;
                                                canMatch_1 = false;
                                            }
                                        }
                                    });
                                    break;
                            }
                        });
                        RuleIndex_1 = -1;
                        max_1 = -1;
                        matched_1.map(function (match, index) {
                            if (match && votingArray_1[index] > max_1) {
                                RuleIndex_1 = index;
                                max_1 = votingArray_1[index];
                            }
                        });
                        data_1 = {};
                        if (RuleIndex_1 > -1) {
                            // console.log(rulesets[RuleIndex].actions);
                            rulesets[RuleIndex_1].actions.map(function (act) {
                                // _id: { $nin: exclude }
                                if (!data_1[act.value]) {
                                    data_1[act.value] = {};
                                    data_1[act.value]['$in'] = [];
                                    data_1[act.value]['$in'] = act.keywords;
                                }
                                else if (data_1[act.value] && data_1[act.value]['$in'])
                                    data_1[act.value]['$in'] = data_1[act.value]['$in'].concat(act.keywords);
                            });
                        }
                        // console.log(data);
                        // if (RuleIndex > -1) return rulesets[RuleIndex];
                        // else return undefined
                        return [2 /*return*/, data_1];
                    }
                    else
                        return [2 /*return*/, undefined];
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.log(error_1);
                    console.log('error in Applying chat assignment RuleSets');
                    return [2 /*return*/, undefined];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.ApplyRuleSets = ApplyRuleSets;
//# sourceMappingURL=AssignmentRuleSetDispatcher.js.map