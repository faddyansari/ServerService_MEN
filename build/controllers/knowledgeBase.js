"use strict";
// Created By Saad Ismail Shaikh
// Date : 30-4-18
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
exports.KnowledgeBase = void 0;
var express = require("express");
var knowledgeBaseModel_1 = require("../models/knowledgeBaseModel");
var sessionsManager_1 = require("../globals/server/sessionsManager");
var router = express.Router();
router.use(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var type, id, session;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                type = '';
                id = '';
                if (!req.headers.authorization) return [3 /*break*/, 5];
                type = req.headers.authorization.split('-')[0];
                id = req.headers.authorization.split('-')[1];
                session = '';
                if (!(type == 'Agent')) return [3 /*break*/, 2];
                return [4 /*yield*/, sessionsManager_1.SessionManager.GetAgentByID(id)];
            case 1:
                session = _a.sent();
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, sessionsManager_1.SessionManager.GetVisitorByID(id)];
            case 3:
                session = (_a.sent());
                _a.label = 4;
            case 4:
                if (session) {
                    if (req.body.nsp && req.body.nsp != session.nsp)
                        res.status(401).send({ err: 'unauthorized' });
                    next();
                }
                else
                    res.status(401).send({ err: 'unauthorized' });
                return [3 /*break*/, 6];
            case 5:
                res.status(401).send({ err: 'unauthorized' });
                _a.label = 6;
            case 6: return [2 /*return*/];
        }
    });
}); });
//let visitor = new Visitor();
// router.get('/', (req, res) => {
//     console.log('email recieved');
//     res.send({email : 'recieved'});
//     // var visitor = new Visitor();
//     // visitor.insertVisitors();
//     // res.send("Record Inserted");
// });
router.use(function (req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
});
router.get('/:type?/:nsp?', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, kpi, faq, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 7, , 8]);
                if (!req.params.type || !req.params.nsp)
                    res.status(400).send();
                _a = req.params.type.toString().toLowerCase();
                switch (_a) {
                    case 'kpi': return [3 /*break*/, 1];
                    case 'sla': return [3 /*break*/, 1];
                    case 'news': return [3 /*break*/, 1];
                    case 'itp': return [3 /*break*/, 1];
                    case 'faq': return [3 /*break*/, 3];
                }
                return [3 /*break*/, 5];
            case 1: return [4 /*yield*/, knowledgeBaseModel_1.KnowledgeBaseModel.GetKnowledgeBase(req.params.type, '/' + req.params.nsp)];
            case 2:
                kpi = _b.sent();
                res.status(200).send(kpi);
                return [3 /*break*/, 6];
            case 3: return [4 /*yield*/, knowledgeBaseModel_1.KnowledgeBaseModel.GetKnowledgeBase(req.params.type, '/' + req.params.nsp)];
            case 4:
                faq = _b.sent();
                res.status(200).send(faq);
                return [3 /*break*/, 6];
            case 5:
                res.status(400).send();
                return [3 /*break*/, 6];
            case 6: return [3 /*break*/, 8];
            case 7:
                error_1 = _b.sent();
                console.log(error_1);
                console.log('Error in getting KnowledgeBase');
                res.status(400).send();
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); });
exports.KnowledgeBase = router;
//# sourceMappingURL=knowledgeBase.js.map