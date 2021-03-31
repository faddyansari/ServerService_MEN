"use strict";
//Created By Saad Ismail Shaikh
//Date : 19-1-2018
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
exports.DataBaseConfig = void 0;
//Note : Its Main Database Config File Which Later can be used
// to configure production and Development Environment.
//MongoDB Client Object from Node_modules MongoDB.
var mongodb_1 = require("mongodb");
var __biZZCMiddleWare_1 = require("../__biZZCMiddleWare");
// For Development Environment
// Host : localhost or 127.0.0.1
// Port : 27017 which is Default port of MongoDB;
var devURI = 'mongodb://localhost:27017/';
// let dbName = "local";
// let devURI = 'mongodb://192.168.20.92:27017/';
// let dbName =  'local';
var dbName = (process.env.NODE_ENV == 'production') ? 'sessionsDB' : "local";
// Singleton Class
// Global database Class which will be used throughout the api of the application.
var DataBaseConfig = /** @class */ (function () {
    // Contructor is private  means the object can't be initialized directly.
    function DataBaseConfig(prodURI) {
        this.dataBase = undefined;
    }
    // Connect initialize database connection upon application start in index.js
    DataBaseConfig.connect = function (prodURI) {
        return __awaiter(this, void 0, void 0, function () {
            var mongoClient, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!prodURI) {
                            prodURI = devURI;
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        if (!!DataBaseConfig.Instance) return [3 /*break*/, 3];
                        DataBaseConfig.Instance = new DataBaseConfig();
                        return [4 /*yield*/, DataBaseConfig.Instance.connectDatabase(prodURI)];
                    case 2:
                        mongoClient = _a.sent();
                        DataBaseConfig.Instance.dataBase = mongoClient.db(dbName);
                        DataBaseConfig.Instance.onClose(DataBaseConfig.Instance.dataBase, prodURI);
                        console.log("connected to Database ");
                        //console.log("Database Name : " + DataBaseConfig.Instance.dataBase.databaseName);
                        return [2 /*return*/, DataBaseConfig.Instance.dataBase];
                    case 3: return [2 /*return*/, DataBaseConfig.Instance.dataBase];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_1 = _a.sent();
                        console.log(error_1);
                        console.log('error in Connecting To Database');
                        console.log(process.env.NODE_ENV);
                        console.log(process.env.DB_ADDRESS);
                        // DataBaseConfig.Instance = undefined;
                        throw new Error(error_1);
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    DataBaseConfig.prototype.reconnect = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                __biZZCMiddleWare_1.__biZZC_Core.InitCollections(true);
                return [2 /*return*/];
            });
        });
    };
    DataBaseConfig.prototype.onClose = function (db, prodURI) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                db.on('close', function (response) { return __awaiter(_this, void 0, void 0, function () {
                    var mongoClient, err_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                console.log('db closed!');
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                //Send Email Logic
                                this.SendEmail('down');
                                __biZZCMiddleWare_1.__biZZC_Core.destroyCollections();
                                DataBaseConfig.Instance.dataBase.removeAllListeners();
                                return [4 /*yield*/, DataBaseConfig.Instance.connectDatabase(prodURI)];
                            case 2:
                                mongoClient = _a.sent();
                                DataBaseConfig.Instance.dataBase = mongoClient.db(dbName);
                                console.log("connected to Database ");
                                this.SendEmail('up');
                                DataBaseConfig.Instance.reconnect();
                                DataBaseConfig.Instance.onClose(DataBaseConfig.Instance.dataBase, prodURI);
                                return [3 /*break*/, 4];
                            case 3:
                                err_1 = _a.sent();
                                console.log(err_1);
                                console.log('Reconnection Error!');
                                return [3 /*break*/, 4];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        });
    };
    DataBaseConfig.prototype.connectDatabase = function (prodURI) {
        return __awaiter(this, void 0, void 0, function () {
            var client, error_2, client;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 4]);
                        console.log('Connecting to Database');
                        return [4 /*yield*/, mongodb_1.MongoClient.connect(prodURI, { useNewUrlParser: true, useUnifiedTopology: true, reconnectTries: 60, reconnectInterval: 60000, autoReconnect: true })];
                    case 1:
                        client = _a.sent();
                        // client.db(dbName);
                        // let database = client.db(dbName);
                        return [2 /*return*/, client];
                    case 2:
                        error_2 = _a.sent();
                        console.log('error in connecting Database');
                        return [4 /*yield*/, DataBaseConfig.Instance.connectDatabase(prodURI)];
                    case 3:
                        client = _a.sent();
                        return [2 /*return*/, client];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    DataBaseConfig.prototype.SendEmail = function (type) {
        return __awaiter(this, void 0, void 0, function () {
            var obj;
            return __generator(this, function (_a) {
                if (process.env.NODE_ENV == 'production') {
                    obj = {};
                    switch (type) {
                        case 'down':
                            obj = {
                                action: 'sendNoReplyEmail',
                                to: ['mufakhruddin9417@sbtjapan.com', 'saadisheikh9705@sbtjapan.com', 'salim9430@sbtjapan.com'],
                                subject: (process.env.NODE_ENV == 'production') ? 'Beelinks database server is down!' : 'TEST EMAIL: Beelinks database server is down!',
                                message: 'The database server of Beelinks has been closed/crashed at ' + new Date().toLocaleString(),
                                html: 'The database server of Beelinks has been closed/crashed at ' + new Date().toLocaleString(),
                                type: 'none'
                            };
                            break;
                        case 'up':
                            obj = {
                                action: 'sendNoReplyEmail',
                                to: ['mufakhruddin9417@sbtjapan.com', 'saadisheikh9705@sbtjapan.com', 'salim9430@sbtjapan.com'],
                                subject: (process.env.NODE_ENV == 'production') ? 'Beelinks database server is up!' : 'TEST EMAIL: Beelinks database server is up!',
                                message: 'The database server of Beelinks has been successfully started at ' + new Date().toLocaleString(),
                                html: 'The database server of Beelinks has been successfully started at ' + new Date().toLocaleString(),
                                type: 'none'
                            };
                            break;
                        default:
                            break;
                    }
                    // await EmailService.SendNoReplyEmail(obj, false);
                }
                return [2 /*return*/];
            });
        });
    };
    // In Case if you want to connect to another database in between application
    // First call disconnect and then connect to ur URI
    DataBaseConfig.prototype.disconnect = function () {
        if (DataBaseConfig.Instance && DataBaseConfig.Instance.dataBase) {
            DataBaseConfig.Instance.dataBase.close();
        }
        else {
            //console.log('No Database Initialized');
        }
    };
    return DataBaseConfig;
}());
exports.DataBaseConfig = DataBaseConfig;
//# sourceMappingURL=database.js.map