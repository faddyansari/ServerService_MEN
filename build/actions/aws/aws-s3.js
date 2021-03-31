"use strict";
//Typescript Version 
// Date : 23-11-2019
// Created By Saad Ismail Shaikh
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
exports.__BizzC_S3 = void 0;
// load aws sdk
var aws = require("aws-sdk");
var constants_1 = require("../../globals/config/constants");
// load aws config
//aws.config.loadFromPath('config.json');
aws.config.setPromisesDependency(null);
var __BizzC_S3 = /** @class */ (function () {
    function __BizzC_S3() {
    }
    __BizzC_S3.PutObject = function (filename, data, bucketname) {
        return __awaiter(this, void 0, void 0, function () {
            var bucketParams, object, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        bucketParams = {
                            Bucket: (bucketname) ? bucketname : this.BucketName,
                            Key: filename,
                            Body: JSON.stringify(data),
                            ContentType: 'application/json; charset=utf-8',
                            ACL: 'public-read',
                        };
                        return [4 /*yield*/, this.s3.putObject(bucketParams).promise()];
                    case 1:
                        object = _a.sent();
                        if (!object.$response.error)
                            return [2 /*return*/, object];
                        else {
                            console.log(object.$response.error);
                            console.log('error in Putting Object AWS ERROR RESPONSE');
                            return [2 /*return*/, undefined];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.log(error_1);
                        console.log('error in  Putting Object');
                        return [2 /*return*/, undefined];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    __BizzC_S3.GetObject = function (filename, bucketname) {
        return __awaiter(this, void 0, void 0, function () {
            var bucketParams, object, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        bucketParams = {
                            Bucket: (bucketname) ? bucketname : this.BucketName,
                            Key: filename
                        };
                        return [4 /*yield*/, this.s3.getObject(bucketParams).promise()];
                    case 1:
                        object = _a.sent();
                        if (!object.$response.error)
                            return [2 /*return*/, object];
                        else {
                            console.log(object.$response.error);
                            console.log('error in getting Object AWS ERROR RESPONSE');
                            return [2 /*return*/, undefined];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        console.log(error_2);
                        console.log('error in getting Object from s3');
                        return [2 /*return*/, undefined];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    __BizzC_S3.DeleteObject = function (filename, bucketname) {
        return __awaiter(this, void 0, void 0, function () {
            var bucketParams, object, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        bucketParams = {
                            Bucket: (bucketname) ? bucketname : this.BucketName,
                            Key: filename
                        };
                        return [4 /*yield*/, this.s3.deleteObject(bucketParams).promise()];
                    case 1:
                        object = _a.sent();
                        if (!object.$response.error)
                            return [2 /*return*/, object];
                        else {
                            console.log(object.$response.error);
                            console.log('error in deleting Object AWS ERROR RESPONSE');
                            return [2 /*return*/, undefined];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        console.log(error_3);
                        console.log('error in deleting Object');
                        return [2 /*return*/, undefined];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    __BizzC_S3.s3 = new aws.S3({ apiVersion: 'latest' });
    __BizzC_S3.BucketName = constants_1.bucketName;
    return __BizzC_S3;
}());
exports.__BizzC_S3 = __BizzC_S3;
//# sourceMappingURL=aws-s3.js.map