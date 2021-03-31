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
exports.REDISPUBSUB = void 0;
var constants_1 = require("../globals/config/constants");
var RSMQ = require("rsmq");
//Created By Saad Ismail Shaikh
//03-02-2020
/**
 * @Note
 * 1. Initialize
 * 2. Reconnection Logic
 * 3. PublishMessage
 */
var REDISPUBSUB = /** @class */ (function () {
    function REDISPUBSUB(host, port) {
        this.serverIP = constants_1.REDISURL;
        this.QUEUENAME = constants_1.REDISQUEUENAME;
        this.connected = false;
        console.log(host, port);
        console.log(this.QUEUENAME);
        console.log(process.env.NODE_ENV);
        this.host = host;
        this.port = port;
    }
    REDISPUBSUB.prototype.ConnectQueue = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var found = false;
            _this.redis_queue = new RSMQ({ host: _this.host, port: _this.port, ns: '__BIZZC_REST' });
            _this.redis_queue.setQueueAttributes({ qname: _this.QUEUENAME, maxsize: -1 }, function (err, resp) {
                if (err) {
                    console.error(err);
                    return;
                }
            });
            _this.redis_queue.listQueues(function (err, data) {
                if (err) {
                    reject(err);
                    return;
                }
                data.map(function (queuename) { (queuename == _this.QUEUENAME) ? found = true : undefined; });
                if (found) {
                    resolve({});
                    return;
                }
                else {
                    _this.redis_queue.createQueue({ qname: _this.QUEUENAME }, function (err, data) {
                        if (err) {
                            reject(err);
                            console.log('Error in Creating Queue : ', err);
                        }
                        else {
                            resolve({});
                            console.log('Data : ', data);
                        }
                    });
                }
            });
        });
    };
    REDISPUBSUB.CreateQueue = function (host, port) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('Creating QUeue');
                        if (!!REDISPUBSUB.instance) return [3 /*break*/, 2];
                        console.log('Returning New Instance');
                        REDISPUBSUB.instance = new REDISPUBSUB(host, port);
                        return [4 /*yield*/, REDISPUBSUB.instance.ConnectQueue()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, REDISPUBSUB.instance];
                    case 2:
                        console.log('Returning Old INstance');
                        return [2 /*return*/, REDISPUBSUB.instance];
                }
            });
        });
    };
    REDISPUBSUB.CreateQueuePromise = function (host, port) {
        return new Promise(function (resolve, reject) {
        });
    };
    REDISPUBSUB.prototype.SendMessage = function (data) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.redis_queue.sendMessage({ qname: _this.QUEUENAME, message: JSON.stringify(data) }, function (err, data) {
                if (err) {
                    console.log('error in sending Message to Redis', err);
                    reject(err);
                }
                else {
                    resolve(data);
                }
            });
        });
    };
    REDISPUBSUB.prototype.DeleteMessage = function (Messageid) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.redis_queue.deleteMessage({ qname: _this.QUEUENAME, id: Messageid }, function (err, data) {
                if (err) {
                    console.log('error in Deleting Message to Redis');
                    return false;
                }
                else {
                    return data;
                }
            });
        });
    };
    REDISPUBSUB.prototype.QuitConnection = function () {
        try {
            this.redis_queue.quit();
            // resolve(true)
        }
        catch (error) {
            console.log('error in Quitting Connection RSMQ');
            // resolve(false);
        }
    };
    return REDISPUBSUB;
}());
exports.REDISPUBSUB = REDISPUBSUB;
//# sourceMappingURL=redis-pub-sub.js.map