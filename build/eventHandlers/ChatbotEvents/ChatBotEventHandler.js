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
var intentModel_1 = require("../../models/ChatBot/intentModel");
var tPhraseModel_1 = require("../../models/ChatBot/tPhraseModel");
var entityModel_1 = require("../../models/ChatBot/entityModel");
var synonymModel_1 = require("../../models/ChatBot/synonymModel");
var storyModel_1 = require("../../models/ChatBot/storyModel");
var responseModel_1 = require("../../models/ChatBot/responseModel");
var respFuncModel_1 = require("../../models/ChatBot/respFuncModel");
var actionModel_1 = require("../../models/ChatBot/actionModel");
var regexModel_1 = require("../../models/ChatBot/regexModel");
var ChatBotEvents = /** @class */ (function () {
    function ChatBotEvents() {
    }
    ChatBotEvents.BindChatBotEvents = function (socket, origin) {
        ChatBotEvents.IntentHandler(socket, origin);
        ChatBotEvents.TPhraseHandler(socket, origin);
        ChatBotEvents.EntityHandler(socket, origin);
        ChatBotEvents.SynonymHandler(socket, origin);
        ChatBotEvents.ResponseHandler(socket, origin);
        ChatBotEvents.RespFuncHandler(socket, origin);
        ChatBotEvents.StoryHandler(socket, origin);
        ChatBotEvents.ActionHandler(socket, origin);
        ChatBotEvents.RegexHandler(socket, origin);
    };
    ChatBotEvents.IntentHandler = function (socket, origin) {
        var _this = this;
        // console.log('Intent Handler!');
        socket.on('getIntents', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var intentList, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, intentModel_1.intentModel.GetIntents(socket.handshake.session.nsp)];
                    case 1:
                        intentList = _a.sent();
                        callback({ status: 'ok', intentList: intentList });
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.log('error');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        socket.on('addIntent', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var exist, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, intentModel_1.intentModel.AddIntent(data.intent_name, socket.handshake.session.nsp)];
                    case 1:
                        exist = _a.sent();
                        if (exist && exist.insertedCount) {
                            callback({ status: 'ok', intent: exist.ops[0] });
                        }
                        else {
                            callback({ status: 'error', msg: 'Intent already exists.' });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        console.log('error');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        socket.on('updateIntent', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var exist, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, intentModel_1.intentModel.UpdateIntent(socket.handshake.session.nsp, data._id, data.name)];
                    case 1:
                        exist = _a.sent();
                        if (exist && exist.value) {
                            callback({ status: 'ok', intent: exist.value });
                        }
                        else {
                            callback({ status: 'error', msg: 'Intent already exists... Please use another name' });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        console.log('error');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        socket.on('deleteIntent', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var exist, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, intentModel_1.intentModel.DeleteIntent(socket.handshake.session.nsp, data._id)];
                    case 1:
                        exist = _a.sent();
                        if (exist && exist.value) {
                            callback({ status: 'ok', msg: 'Intent Deleted!' });
                        }
                        else {
                            callback({ status: 'error', msg: 'Can not delete intent' });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        console.log('error');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    ChatBotEvents.TPhraseHandler = function (socket, origin) {
        var _this = this;
        socket.on('addTPhrase', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var exist, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, tPhraseModel_1.tPhraseModel.AddTPhrase(data.intent_id, socket.handshake.session.nsp, data.tPhrase)];
                    case 1:
                        exist = _a.sent();
                        if (exist && exist.insertedCount) {
                            callback({ status: 'ok', tPhrase: exist.ops[0] });
                        }
                        else {
                            callback({ status: 'error', msg: 'Phrase already exists.' });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_5 = _a.sent();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        socket.on('getTPhrase', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var TPhraseList, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, tPhraseModel_1.tPhraseModel.GetTPhrase(socket.handshake.session.nsp)];
                    case 1:
                        TPhraseList = _a.sent();
                        callback({ status: 'ok', tPhraseList: TPhraseList });
                        return [3 /*break*/, 3];
                    case 2:
                        error_6 = _a.sent();
                        console.log('error');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        socket.on('deleteTPhrase', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var exist, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, tPhraseModel_1.tPhraseModel.DeleteTPhrase(socket.handshake.session.nsp, data._id, data.intent_id)];
                    case 1:
                        exist = _a.sent();
                        if (exist && exist.value) {
                            callback({ status: 'ok', msg: 'Phrase Deleted!' });
                        }
                        else {
                            callback({ status: 'error', msg: 'Can not delete Phrase' });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_7 = _a.sent();
                        console.log('error');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        socket.on('markPhrase', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var exist, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, tPhraseModel_1.tPhraseModel.MarkEntities(data._id, data.start, data.end, data.text, socket.handshake.session.nsp)];
                    case 1:
                        exist = _a.sent();
                        if (exist && exist.value) {
                            callback({ status: 'ok', tpEntity: exist.value });
                        }
                        else {
                            callback({ status: 'error', msg: 'Cant mark entity.' });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_8 = _a.sent();
                        console.log('error');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        socket.on('selectEntity', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var exist, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, tPhraseModel_1.tPhraseModel.SelectEntity(data.tPhrase, data.entArray, data.entVal, socket.handshake.session.nsp)];
                    case 1:
                        exist = _a.sent();
                        if (exist && exist.value) {
                            callback({ status: 'ok', tPhrase: exist.value });
                        }
                        else {
                            callback({ status: 'error', msg: 'Cant assign this entity.' });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_9 = _a.sent();
                        console.log('error');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        socket.on('delMarkEnt', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var exist, error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, tPhraseModel_1.tPhraseModel.delEntity(data._id, data.entId, socket.handshake.session.nsp)];
                    case 1:
                        exist = _a.sent();
                        if (exist && exist.value) {
                            callback({ status: 'ok', msg: 'Phrase Deleted!' });
                        }
                        else {
                            callback({ status: 'error', msg: 'Can not delete Phrase' });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_10 = _a.sent();
                        console.log('error');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    ChatBotEvents.EntityHandler = function (socket, origin) {
        var _this = this;
        socket.on('addEntity', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var exist, error_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, entityModel_1.entityModel.AddEntity(data.name, data.slot, data.color, socket.handshake.session.nsp)];
                    case 1:
                        exist = _a.sent();
                        if (exist && exist.insertedCount) {
                            callback({ status: 'ok', entity: exist.ops[0] });
                        }
                        else {
                            callback({ status: 'error', msg: 'Entity already exists.' });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_11 = _a.sent();
                        console.log('error');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        socket.on('getEntity', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var entityList, error_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, entityModel_1.entityModel.GetEntities(socket.handshake.session.nsp)];
                    case 1:
                        entityList = _a.sent();
                        callback({ status: 'ok', entityList: entityList });
                        return [3 /*break*/, 3];
                    case 2:
                        error_12 = _a.sent();
                        console.log('error');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        socket.on('selSlotType', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var exist, error_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, entityModel_1.entityModel.UpdateSlotType(socket.handshake.session.nsp, data.entity._id, data.entity.entity_name, data.slotValue)];
                    case 1:
                        exist = _a.sent();
                        if (exist && exist.value) {
                            callback({ status: 'ok', slotType: exist.value });
                        }
                        else {
                            callback({ status: 'error', msg: 'Cant assign slot.' });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_13 = _a.sent();
                        console.log('error');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        socket.on('updateEnt', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var exist, error_14;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, entityModel_1.entityModel.UpdateEntity(socket.handshake.session.nsp, data.entity._id, data.updatedEnt)];
                    case 1:
                        exist = _a.sent();
                        if (exist && exist.value) {
                            callback({ status: 'ok', updEnt: exist.value });
                        }
                        else {
                            callback({ status: 'error', msg: 'Entity already exists... Please use another name' });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_14 = _a.sent();
                        console.log('error');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        socket.on('deleteEntity', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var exist, error_15;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, entityModel_1.entityModel.DeleteEntity(socket.handshake.session.nsp, data._id)];
                    case 1:
                        exist = _a.sent();
                        if (exist && exist.value) {
                            callback({ status: 'ok', msg: 'Entity Deleted!' });
                        }
                        else {
                            callback({ status: 'error', msg: 'Can not delete entity' });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_15 = _a.sent();
                        console.log('error');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    ChatBotEvents.SynonymHandler = function (socket, origin) {
        var _this = this;
        socket.on('addSynVal', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var exist, error_16;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, synonymModel_1.synonymModel.AddSynEntValue(socket.handshake.session.nsp, data.synValue)];
                    case 1:
                        exist = _a.sent();
                        if (exist && exist.insertedCount) {
                            callback({ status: 'ok', synVal: exist.ops[0] });
                        }
                        else {
                            callback({ status: 'error', msg: 'Synonym already exists.' });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_16 = _a.sent();
                        console.log('error');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        socket.on('getSynonym', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var synList, error_17;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, synonymModel_1.synonymModel.GetSynonyms(socket.handshake.session.nsp)];
                    case 1:
                        synList = _a.sent();
                        callback({ status: 'ok', synList: synList });
                        return [3 /*break*/, 3];
                    case 2:
                        error_17 = _a.sent();
                        console.log('error');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        socket.on('addSyn', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var exist, error_18;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, synonymModel_1.synonymModel.AddSynonym(data.syn_list._id, data.value, socket.handshake.session.nsp)];
                    case 1:
                        exist = _a.sent();
                        if (exist && exist.value) {
                            callback({ status: 'ok', syn: exist.value });
                        }
                        else {
                            callback({ status: 'error', msg: 'Cant enter synonym.' });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_18 = _a.sent();
                        console.log('error');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        socket.on('delSyn', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var exist, error_19;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, synonymModel_1.synonymModel.delSynonym(data.syn_list._id, data.value, socket.handshake.session.nsp)];
                    case 1:
                        exist = _a.sent();
                        if (exist) {
                            callback({ status: 'ok', msg: 'Synonym Deleted!' });
                        }
                        else {
                            callback({ status: 'error', msg: 'Can not delete synonym' });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_19 = _a.sent();
                        console.log('error');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        socket.on('delSynVal', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var exist, error_20;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, synonymModel_1.synonymModel.DeleteSynValue(socket.handshake.session.nsp, data.syn_list._id)];
                    case 1:
                        exist = _a.sent();
                        if (exist && exist.value) {
                            callback({ status: 'ok', msg: 'Synonym Deleted!' });
                        }
                        else {
                            callback({ status: 'error', msg: 'Can not delete synonym' });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_20 = _a.sent();
                        console.log('error');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    ChatBotEvents.ResponseHandler = function (socket, origin) {
        var _this = this;
        socket.on('addResponse', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var exist, error_21;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, responseModel_1.responseModel.AddResponse(data.resp_func_id, socket.handshake.session.nsp, data.resp)];
                    case 1:
                        exist = _a.sent();
                        if (exist && exist.value) {
                            callback({ status: 'ok', resp: exist.value });
                        }
                        else {
                            callback({ status: 'error', msg: 'Response already exists.' });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_21 = _a.sent();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        socket.on('getResponse', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var respFunc, error_22;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, responseModel_1.responseModel.GetResponse(socket.handshake.session.nsp, data.id)];
                    case 1:
                        respFunc = _a.sent();
                        if (respFunc) {
                            callback({ status: 'ok', RespList: respFunc.filter(function (i) { return !i.resp_del; }) });
                        }
                        else {
                            callback({ status: 'response does not exist' });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_22 = _a.sent();
                        console.log(error_22);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        socket.on('updateResp', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var exist, error_23;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, responseModel_1.responseModel.UpdateResponse(socket.handshake.session.nsp, data.response.id, data.updatedResp, data.intent_id)];
                    case 1:
                        exist = _a.sent();
                        if (exist && exist.value) {
                            callback({ status: 'ok', updResp: exist.value });
                        }
                        else {
                            callback({ status: 'error', msg: 'Response already exists... Please use another name' });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_23 = _a.sent();
                        console.log('error');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        socket.on('delResp', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var exist, error_24;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, responseModel_1.responseModel.deleteResponse(socket.handshake.session.nsp, data.resp_id, data.intent_id)];
                    case 1:
                        exist = _a.sent();
                        if (exist && exist.value) {
                            callback({ status: 'ok', msg: 'Entity Deleted!' });
                        }
                        else {
                            callback({ status: 'error', msg: 'Can not delete entity' });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_24 = _a.sent();
                        console.log('error');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    ChatBotEvents.RespFuncHandler = function (socket, origin) {
        var _this = this;
        // console.log('Intent Handler!');
        socket.on('getRespFunc', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var respFuncList, error_25;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, respFuncModel_1.respFuncModel.GetRespFunc(socket.handshake.session.nsp)];
                    case 1:
                        respFuncList = _a.sent();
                        callback({ status: 'ok', respFuncList: respFuncList });
                        return [3 /*break*/, 3];
                    case 2:
                        error_25 = _a.sent();
                        console.log('error');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        socket.on('addRespFunc', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var exist, error_26;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, respFuncModel_1.respFuncModel.AddRespFunc(data.resp_func_name, socket.handshake.session.nsp)];
                    case 1:
                        exist = _a.sent();
                        if (exist && exist.insertedCount) {
                            callback({ status: 'ok', respFunc: exist.ops[0] });
                        }
                        else {
                            callback({ status: 'error', msg: 'Response Function already exists.' });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_26 = _a.sent();
                        console.log('error');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        socket.on('updateRespFunc', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var exist, error_27;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, respFuncModel_1.respFuncModel.updateRespFunc(socket.handshake.session.nsp, data._id, data.func_name)];
                    case 1:
                        exist = _a.sent();
                        if (exist && exist.value) {
                            callback({ status: 'ok', respFunc: exist.value });
                        }
                        else {
                            callback({ status: 'error', msg: 'Function already exists... Please use another name' });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_27 = _a.sent();
                        console.log('error');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        socket.on('deleteRespFunc', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var exist, error_28;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, respFuncModel_1.respFuncModel.deleteRespFunc(socket.handshake.session.nsp, data._id)];
                    case 1:
                        exist = _a.sent();
                        if (exist && exist.value) {
                            callback({ status: 'ok', msg: 'Function Deleted!' });
                        }
                        else {
                            callback({ status: 'error', msg: 'Can not delete function' });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_28 = _a.sent();
                        console.log('error');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    ChatBotEvents.StoryHandler = function (socket, origin) {
        var _this = this;
        socket.on('addStory', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var exist, error_29;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        console.log('story add');
                        return [4 /*yield*/, storyModel_1.storyModel.AddStory(data.story_name, socket.handshake.session.nsp)];
                    case 1:
                        exist = _a.sent();
                        if (exist && exist.insertedCount) {
                            callback({ status: 'ok', storyName: exist.ops[0] });
                        }
                        else {
                            callback({ status: 'error', msg: 'Story already exists.' });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_29 = _a.sent();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        socket.on('getStories', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var stories, error_30;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, storyModel_1.storyModel.GetStories(socket.handshake.session.nsp)];
                    case 1:
                        stories = _a.sent();
                        callback({ status: 'ok', stories: stories });
                        return [3 /*break*/, 3];
                    case 2:
                        error_30 = _a.sent();
                        console.log('error');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        socket.on('addIntentToStory', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var stories, error_31;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, storyModel_1.storyModel.addIntentToStory(socket.handshake.session.nsp, data.intent_id, data.story_id)];
                    case 1:
                        stories = _a.sent();
                        if (stories) {
                            callback({ status: 'ok', stories: stories });
                        }
                        else {
                            callback({ status: 'error' });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_31 = _a.sent();
                        console.log('error');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        socket.on('addRespFuncToIntent', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var stories, error_32;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, storyModel_1.storyModel.addRespFuncToIntent(socket.handshake.session.nsp, data.intent_id, data.story_id, data.respFuncId)];
                    case 1:
                        stories = _a.sent();
                        // console.log(stories);
                        if (stories) {
                            callback({ status: 'ok', stories: stories.value });
                        }
                        else {
                            callback({ status: 'error' });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_32 = _a.sent();
                        console.log('error');
                        console.log(error_32);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        socket.on('addActionToIntent', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var stories, error_33;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, storyModel_1.storyModel.addActionToIntent(socket.handshake.session.nsp, data.intent_id, data.story_id, data.actId)];
                    case 1:
                        stories = _a.sent();
                        // console.log(stories);
                        if (stories) {
                            callback({ status: 'ok', stories: stories.value });
                        }
                        else {
                            callback({ status: 'error' });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_33 = _a.sent();
                        console.log('error');
                        console.log(error_33);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        socket.on('deleteStory', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var exist, error_34;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, storyModel_1.storyModel.deleteStory(socket.handshake.session.nsp, data._id)];
                    case 1:
                        exist = _a.sent();
                        if (exist && exist.value) {
                            callback({ status: 'ok', msg: 'Story Deleted!' });
                        }
                        else {
                            callback({ status: 'error', msg: 'Can not delete story' });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_34 = _a.sent();
                        console.log('error');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    ChatBotEvents.ActionHandler = function (socket, origin) {
        var _this = this;
        socket.on('addAction', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var exist, error_35;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, actionModel_1.actionModel.AddAction(data.action_name, socket.handshake.session.nsp, data.endpoint_url, data.template)];
                    case 1:
                        exist = _a.sent();
                        if (exist && exist.insertedCount) {
                            callback({ status: 'ok', action: exist.ops[0] });
                        }
                        else {
                            callback({ status: 'error', msg: 'Action already exists.' });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_35 = _a.sent();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        socket.on('getActions', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var actions, error_36;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, actionModel_1.actionModel.GetActions(socket.handshake.session.nsp)];
                    case 1:
                        actions = _a.sent();
                        callback({ status: 'ok', actions: actions });
                        return [3 /*break*/, 3];
                    case 2:
                        error_36 = _a.sent();
                        console.log('error');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        socket.on('deleteAction', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var exist, error_37;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, actionModel_1.actionModel.deleteAction(socket.handshake.session.nsp, data._id)];
                    case 1:
                        exist = _a.sent();
                        if (exist && exist.value) {
                            callback({ status: 'ok', msg: 'Action Deleted!' });
                        }
                        else {
                            callback({ status: 'error', msg: 'Can not delete action' });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_37 = _a.sent();
                        console.log('error');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    ChatBotEvents.RegexHandler = function (socket, origin) {
        var _this = this;
        socket.on('addRegexVal', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var exist, error_38;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, regexModel_1.regexModel.AddRegexValue(socket.handshake.session.nsp, data.regValue)];
                    case 1:
                        exist = _a.sent();
                        if (exist && exist.insertedCount) {
                            callback({ status: 'ok', regVal: exist.ops[0] });
                        }
                        else {
                            callback({ status: 'error', msg: 'Regex already exists.' });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_38 = _a.sent();
                        console.log('error');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        socket.on('delRegVal', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var exist, error_39;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, regexModel_1.regexModel.DeleteRegexValue(socket.handshake.session.nsp, data.reg_list._id)];
                    case 1:
                        exist = _a.sent();
                        if (exist && exist.value) {
                            callback({ status: 'ok', msg: 'Regex Value Deleted!' });
                        }
                        else {
                            callback({ status: 'error', msg: 'Can not delete regex value' });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_39 = _a.sent();
                        console.log('error');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        socket.on('getRegex', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var regList, error_40;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, regexModel_1.regexModel.GetRegex(socket.handshake.session.nsp)];
                    case 1:
                        regList = _a.sent();
                        callback({ status: 'ok', regList: regList });
                        return [3 /*break*/, 3];
                    case 2:
                        error_40 = _a.sent();
                        console.log('error');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        socket.on('addReg', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var exist, error_41;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, regexModel_1.regexModel.AddRegex(data.reg_list._id, data.value, socket.handshake.session.nsp)];
                    case 1:
                        exist = _a.sent();
                        if (exist && exist.value) {
                            callback({ status: 'ok', reg: exist.value });
                        }
                        else {
                            callback({ status: 'error', msg: 'Cant enter regex.' });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_41 = _a.sent();
                        console.log('error');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        socket.on('delReg', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var exist, error_42;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, regexModel_1.regexModel.delRegex(data.reg_list._id, data.value, socket.handshake.session.nsp)];
                    case 1:
                        exist = _a.sent();
                        if (exist) {
                            callback({ status: 'ok', msg: 'Regex Deleted!' });
                        }
                        else {
                            callback({ status: 'error', msg: 'Can not delete regex' });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_42 = _a.sent();
                        console.log('error');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    return ChatBotEvents;
}());
exports.ChatBotEvents = ChatBotEvents;
//# sourceMappingURL=ChatBotEventHandler.js.map