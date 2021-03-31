"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REDISCLIENT = void 0;
var constants_1 = require("../globals/config/constants");
var REDIS = require("redis");
var WorkersManager_1 = require("../globals/server/WorkersManager");
//Created By Saad Ismail Shaikh
//08-01-2020
var REDISCLIENT = /** @class */ (function () {
    function REDISCLIENT() {
        var _this = this;
        this.serverIP = constants_1.REDISURL;
        this.connected = false;
        this.redisClient = REDIS.createClient(this.serverIP, { socket_keepalive: true });
        this.redisClient.on('error', function (err) {
            console.log(_this.serverIP);
            console.log('error in Redis', err);
            _this.connected = false;
            WorkersManager_1.WorkerManager.StopTimeoutWorker = true;
            //Notify Timeout Manager not working
            //   this.Reconnect();
        });
        this.redisClient.on('connect', function (data) {
            console.log('connected to redis');
            console.log(data);
            _this.connected = true;
            WorkersManager_1.WorkerManager.StopTimeoutWorker = false;
        });
    }
    REDISCLIENT.prototype.Reconnect = function () {
        var _this = this;
        try {
            this.redisClient = REDIS.createClient(this.serverIP, { socket_keepalive: true });
        }
        catch (error) {
            setTimeout(function () {
                _this.Reconnect();
            }, 5000);
        }
    };
    REDISCLIENT.prototype.SetID = function (sid, timeInminutes) {
        if (timeInminutes === void 0) { timeInminutes = 0; }
        var result = false;
        if (!timeInminutes)
            result = this.redisClient.set(sid.toString(), sid.toString());
        else
            result = this.redisClient.SETEX(sid.toString(), Math.round(timeInminutes * 60), sid.toString());
        return result;
    };
    REDISCLIENT.prototype.GetID = function (key) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.redisClient.GET(key, (function (err, res) {
                if (!res)
                    resolve(false);
                else
                    resolve(res);
            }));
        });
    };
    REDISCLIENT.prototype.DeleteID = function (key) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.redisClient.DEL(key, (function (err, res) {
                if (!res)
                    resolve(false);
                else
                    resolve(res);
            }));
        });
    };
    REDISCLIENT.prototype.Exists = function (sid) {
        var _this = this;
        var result = false;
        return new Promise(function (resolve, reject) {
            result = _this.redisClient.get(sid.toString(), function (err, data) {
                // console.log('data : ', data);
                // console.log('err : ', err);
                if (!data || err)
                    resolve(false);
                else
                    return resolve(true);
            });
        });
    };
    REDISCLIENT.prototype.GenerateSID = function (nsp, sid) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var result = _this.redisClient.SET("_" + nsp + "_" + sid.toString(), '1', 'PX', 5000, 'NX', function (err, res) {
                if (!res)
                    resolve(false);
                else
                    resolve(true);
            });
        });
    };
    REDISCLIENT.prototype.Increment = function (nsp, sid) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            console.log('INCREMENTING');
            var result = _this.redisClient.INCR("_" + nsp + "_" + sid.toString(), function (err, res) {
                if (!res)
                    resolve(false);
                else
                    resolve(true);
            });
        });
    };
    return REDISCLIENT;
}());
exports.REDISCLIENT = REDISCLIENT;
//# sourceMappingURL=redis.js.map