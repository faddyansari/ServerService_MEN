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
exports.WorkerManager = void 0;
var __biZZCMiddleWare_1 = require("../__biZZCMiddleWare");
var constants_1 = require("../config/constants");
var CP = require("child_process");
var path = require("path");
var WorkerManager = /** @class */ (function () {
    function WorkerManager() {
        this.startedOnce = false;
    }
    WorkerManager.prototype.StartVisitorsWorker = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                    var env, cp, error_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 6, , 7]);
                                if (!WorkerManager.stop) return [3 /*break*/, 1];
                                console.log('Timeout Stopped');
                                return [2 /*return*/];
                            case 1: return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZC_REDIS.Exists(constants_1.TIMEOUTKEYNAME)];
                            case 2:
                                if (!_a.sent()) return [3 /*break*/, 3];
                                // console.log('Timeout In Progress');
                                return [2 /*return*/];
                            case 3: return [4 /*yield*/, __biZZCMiddleWare_1.__BIZZC_REDIS.SetID(constants_1.TIMEOUTKEYNAME, 0.17)
                                // console.log('PATH : ', path.dirname(__dirname + '../') + '/Timeoutworker.js');
                            ];
                            case 4:
                                _a.sent();
                                env = {
                                    NODE_ENV: process.env.NODE_ENV,
                                    FIXCOUNT: WorkerManager.FixCount,
                                    PATH: process.env.PATH
                                };
                                if (process.env.NODE_ENV == 'development')
                                    env.QUEUENAME = 'socket_event_bus_dev';
                                cp = CP.spawn('node', [path.dirname(__dirname + '../') + '/Timeoutworker.js'], { detached: true, env: env });
                                cp.stdout.on('close', function (signal) {
                                    // console.log('Worker Closed : !!!');
                                });
                                cp.stdout.on('data', function (data) {
                                    //console.log('Data : ', data.toString())
                                });
                                cp.stdout.on('error', function (data) {
                                    //console.log('Error : ', data.toString())
                                });
                                cp.unref();
                                _a.label = 5;
                            case 5: return [3 /*break*/, 7];
                            case 6:
                                error_1 = _a.sent();
                                console.log('error in Starting Visitors Interval');
                                console.log(error_1);
                                return [3 /*break*/, 7];
                            case 7: return [2 /*return*/];
                        }
                    });
                }); }, 5000);
                return [2 /*return*/];
            });
        });
    };
    Object.defineProperty(WorkerManager, "StopTimeoutWorker", {
        get: function () {
            return WorkerManager.stop;
        },
        set: function (value) {
            WorkerManager.stop = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WorkerManager, "StartTimeoutWorker", {
        get: function () {
            return WorkerManager.stop;
        },
        set: function (value) {
            WorkerManager.stop = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WorkerManager, "SetFixCount", {
        set: function (value) {
            WorkerManager.FixCount = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WorkerManager, "GetFixCount", {
        get: function () {
            return WorkerManager.FixCount;
        },
        enumerable: false,
        configurable: true
    });
    WorkerManager.stop = true;
    WorkerManager.FixCount = false;
    return WorkerManager;
}());
exports.WorkerManager = WorkerManager;
//# sourceMappingURL=WorkersManager.js.map