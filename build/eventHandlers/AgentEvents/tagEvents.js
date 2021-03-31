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
var tagsModel_1 = require("../../models/tagsModel");
var TagEvents = /** @class */ (function () {
    function TagEvents() {
    }
    TagEvents.BindTagEvents = function (socket, origin) {
        TagEvents.insertTag(socket, origin);
        TagEvents.getTagByNSP(socket, origin);
        TagEvents.deleteTag(socket, origin);
        TagEvents.AssignAgent(socket, origin);
        // TagEvents.UnAssignAgent(socket, origin);
        TagEvents.addTagKeyword(socket, origin);
        TagEvents.deleteTagKeyword(socket, origin);
    };
    TagEvents.getTagByNSP = function (socket, origin) {
        var _this = this;
        socket.on('getTagByNSP', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var tag, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, tagsModel_1.TagsModel.GetTagDetailsByNSP(socket.handshake.session.nsp)];
                    case 1:
                        tag = _a.sent();
                        if (tag) {
                            callback({ status: 'ok', tag_data: tag });
                        }
                        else {
                            callback({ status: 'error', msg: 'No tags found!' });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.log(error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    TagEvents.insertTag = function (socket, origin) {
        var _this = this;
        socket.on('insertTag', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var tag, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, tagsModel_1.TagsModel.InsertTag(data.tag, socket.handshake.session.nsp)];
                    case 1:
                        tag = _a.sent();
                        if (tag) {
                            callback({ status: 'ok' });
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
    TagEvents.deleteTag = function (socket, origin) {
        var _this = this;
        socket.on('deleteTag', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var tag, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, tagsModel_1.TagsModel.DeleteTag(data.tag, socket.handshake.session.nsp)];
                    case 1:
                        tag = _a.sent();
                        if (tag) {
                            callback({ status: 'ok', tag_data: tag.value });
                        }
                        else {
                            callback({ status: 'error' });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        callback({ status: 'error', msg: error_3 });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    TagEvents.AssignAgent = function (socket, origin) {
        // socket.on('assignAgent', async (data, callback) => {
        //     //Todo Restriciton After Confirmation
        //     try {
        //         let tag = await TagsModel.AssignAgent(data.agent_email, data.tag_name, socket.handshake.session.nsp);
        //         if (tag) {
        //             callback({ status: 'ok' });
        //         } else {
        //             callback({ status: 'error' });
        //         }
        //     } catch (error) {
        //         callback({ status: 'error', msg: error });
        //     }
        // });
    };
    // private static UnAssignAgent(socket, origin: SocketIO.Namespace) {
    //     socket.on('unAssignAgent', async (data, callback) => {
    //         //Todo Restriciton After Confirmation
    //         try {
    //             // console.log("Unassigning");
    //             let tag = await TagsModel.UnAssignAgent(data.agent_email, data.tag_name, socket.handshake.session.nsp);
    //             if (tag) {
    //                 callback({ status: 'ok', tag_data: tag.value });
    //             } else {
    //                 callback({ status: 'error' });
    //             }
    //         } catch (error) {
    //             callback({ status: 'error', msg: error });
    //         }
    //     });
    // }
    TagEvents.addTagKeyword = function (socket, origin) {
        var _this = this;
        socket.on('addTagKeyword', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var tag, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, tagsModel_1.TagsModel.addTagKeyword(data.keyword, data.tag_name, socket.handshake.session.nsp)];
                    case 1:
                        tag = _a.sent();
                        if (tag) {
                            callback({ status: 'ok' });
                        }
                        else {
                            callback({ status: 'error' });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        callback({ status: 'error', msg: error_4 });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    TagEvents.deleteTagKeyword = function (socket, origin) {
        var _this = this;
        socket.on('deleteTagKeyword', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var tag, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, tagsModel_1.TagsModel.deleteTagKeyword(data.keyword, data.tag_name, socket.handshake.session.nsp)];
                    case 1:
                        tag = _a.sent();
                        if (tag) {
                            callback({ status: 'ok', tag_data: tag.value });
                        }
                        else {
                            callback({ status: 'error' });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_5 = _a.sent();
                        callback({ status: 'error', msg: error_5 });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    return TagEvents;
}());
exports.TagEvents = TagEvents;
//# sourceMappingURL=tagEvents.js.map