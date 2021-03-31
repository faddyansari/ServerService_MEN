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
var ticketScenariosModel_1 = require("../../models/ticketScenariosModel");
var TicketScenarioEvents = /** @class */ (function () {
    function TicketScenarioEvents() {
    }
    TicketScenarioEvents.BindTicketScenarioEvents = function (socket, origin) {
        TicketScenarioEvents.GetAllScenariosbyNSP(socket, origin);
        TicketScenarioEvents.AddScenario(socket, origin);
        TicketScenarioEvents.UpdateScenario(socket, origin);
        TicketScenarioEvents.DeleteScenario(socket, origin);
    };
    //CRUD
    TicketScenarioEvents.AddScenario = function (socket, origin) {
        var _this = this;
        socket.on('addScenario', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var scenario, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, ticketScenariosModel_1.TicketScenariosModel.AddScenario(data.scenarioObj)];
                    case 1:
                        scenario = _a.sent();
                        if (scenario) {
                            callback({ status: 'ok', scenarioInserted: scenario.ops[0] });
                        }
                        else {
                            callback({ status: 'error', code: 500, msg: 'Internal Server Error' });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.log(error_1);
                        console.log('error in creating scenario');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    TicketScenarioEvents.DeleteScenario = function (socket, origin) {
        var _this = this;
        socket.on('deleteScenario', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var result, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, ticketScenariosModel_1.TicketScenariosModel.DeleteScenario(data.id, socket.handshake.session.nsp)];
                    case 1:
                        result = _a.sent();
                        if (result) {
                            callback({ status: 'ok', msg: "Ticket Scenario Deleted Successfully!" });
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
    TicketScenarioEvents.UpdateScenario = function (socket, origin) {
        var _this = this;
        socket.on('updateScenario', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var scenarioUpdated, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        data.scenarioUpd.lastModified = {};
                        data.scenarioUpd.lastModified.date = new Date().toISOString();
                        data.scenarioUpd.lastModified.by = socket.handshake.session.email;
                        return [4 /*yield*/, ticketScenariosModel_1.TicketScenariosModel.UpdateScenario(data.sid, data.scenarioUpd, socket.handshake.session.nsp)];
                    case 1:
                        scenarioUpdated = _a.sent();
                        if (scenarioUpdated && scenarioUpdated.value) {
                            callback({ status: 'ok', scenarioUpdated: scenarioUpdated.value });
                        }
                        else {
                            callback({ status: 'error', code: 500, msg: 'Internal Server Error' });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        console.log(error_3);
                        console.log('error in editing ticket Scenario');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    TicketScenarioEvents.GetAllScenariosbyNSP = function (socket, origin) {
        var _this = this;
        socket.on('getAllScenarios', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var scenarios, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, ticketScenariosModel_1.TicketScenariosModel.getScenariosByNSP(socket.handshake.session.nsp)];
                    case 1:
                        scenarios = _a.sent();
                        if (scenarios && scenarios.length) {
                            callback({ status: 'ok', scenarios: scenarios });
                        }
                        else {
                            callback({ status: 'error', code: 500, msg: 'Internal Server Error' });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        console.log(error_4);
                        console.log('error in Getting scenarios');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    return TicketScenarioEvents;
}());
exports.TicketScenarioEvents = TicketScenarioEvents;
//# sourceMappingURL=ticketScenarioEvenets.js.map