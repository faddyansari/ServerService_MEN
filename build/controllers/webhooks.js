"use strict";
// Created By Saad Ismail Shaikh
// Date : 22-1-18
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
exports.webhookRoutes = void 0;
var express = require("express");
var webhooksModel_1 = require("../models/webhooksModel");
var contactModel_1 = require("../models/contactModel");
var customError_1 = require("../helpers/customError");
var router = express.Router();
router.get('/verifyAppToken', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                if (!(req.query.token && req.query.nsp)) return [3 /*break*/, 2];
                return [4 /*yield*/, webhooksModel_1.Webhooks.GETValidateAppToken(req.query.token, req.query.nsp)];
            case 1:
                _a.sent();
                res.send({
                    status: "ok",
                    message: "Your webhook has been validated."
                });
                return [3 /*break*/, 3];
            case 2: throw new customError_1.CustomError("IncorrectVerificationAppTokenParams", 11, "The GET parameters passed into /webhook/verifyAppToken are incorrect");
            case 3: return [3 /*break*/, 5];
            case 4:
                err_1 = _a.sent();
                // console.log("In error")
                if (err_1.name == "IncorrectVerificationAppTokenParams" ||
                    err_1.name == "IncorrectVerificationAppTokenValues" ||
                    err_1.name == "InvalidStateInAppToken") {
                    res.send({
                        status: "err",
                        message: err_1.message
                    });
                }
                else {
                    res.send({
                        status: "err",
                    });
                }
                console.log("Error: " + err_1.name + ", Message: " + err_1.message);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// Body must contain fields 'token', 'nsp', 'contacts'
// The field 'token' will cointain the validated UUID
// The 'nsp' field will hold the namespace of the company - used to uniquely identify company
// The 'contacts' will be a list that contains all the fields to be uploaded
// In 'contacts' list items must have at least have the 'email' field
// Additional fields that can be added are:  phone_no, name   
router.post('/uploadContacts', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, contactsArray, nsp_1, err, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                if (!(req.body.token && req.body.contacts && req.body.nsp)) return [3 /*break*/, 3];
                token = req.body.token;
                contactsArray = req.body.contacts;
                nsp_1 = req.body.nsp;
                return [4 /*yield*/, webhooksModel_1.Webhooks.isGETValidatedAppToken(token, nsp_1)];
            case 1:
                _a.sent();
                return [4 /*yield*/, contactModel_1.Contacts.createContacts(contactsArray, nsp_1)];
            case 2:
                err = _a.sent();
                res.send({
                    status: "ok",
                    message: "Contacts have been uploaded."
                });
                return [3 /*break*/, 4];
            case 3: throw new customError_1.CustomError("IncorrectJSONFormatOnUploadContacts", 13, "The format of the JSON body passed into /webhook/uploadContacts is incorrect");
            case 4: return [3 /*break*/, 6];
            case 5:
                err_2 = _a.sent();
                res.send({
                    status: "err", message: err_2.message
                });
                console.log("Error: " + err_2.name + ", Message: " + err_2.message);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
exports.webhookRoutes = router;
//# sourceMappingURL=webhooks.js.map