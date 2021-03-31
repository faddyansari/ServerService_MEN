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
var contactModel_1 = require("../models/contactModel");
var contactConversationEvents_1 = require("./ContactEvents/contactConversationEvents");
var agentModel_1 = require("../models/agentModel");
var visitorModel_1 = require("../models/visitorModel");
var contactConversationModel_1 = require("../models/contactConversationModel");
var contactCallingEvents_1 = require("./ContactEvents/contactCallingEvents");
var ContactHandlers = /** @class */ (function () {
    function ContactHandlers() {
    }
    ContactHandlers.BindContactEvents = function (socket, origin) {
        var _this = this;
        socket.on("retrieveContacts", function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var contactsData, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, contactModel_1.Contacts.retrieveContacts(data.nsp)];
                    case 1:
                        contactsData = _a.sent();
                        callback({ status: "ok", contactsList: contactsData });
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _a.sent();
                        callback({ status: "error", err: err_1 });
                        console.log("Error encountered in retrieving contacts");
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        socket.on("retrieveContactsAsync", function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var contactsData, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, contactModel_1.Contacts.retrieveContactsAsync(data.nsp, data.type, data.chunk)];
                    case 1:
                        contactsData = _a.sent();
                        callback({ status: "ok", contactsList: contactsData, ended: (contactsData && contactsData.length < 20) ? true : false });
                        return [3 /*break*/, 3];
                    case 2:
                        err_2 = _a.sent();
                        callback({ status: "error", err: err_2 });
                        console.log("Error encountered in retrieving contacts");
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        socket.on("getContactsCount", function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var contactsData, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, contactModel_1.Contacts.contactsCountsWithStatus(data.nsp)];
                    case 1:
                        contactsData = _a.sent();
                        callback({ status: "ok", contactsList: contactsData });
                        return [3 /*break*/, 3];
                    case 2:
                        err_3 = _a.sent();
                        callback({ status: "error", err: err_3 });
                        console.log("Error encountered in retrieving contacts");
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        socket.on("retrieveContactsByDept", function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var allContacts, contact, contactsData, contact, contactsData, contactsData, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 10, , 11]);
                        allContacts = false;
                        if (!allContacts) return [3 /*break*/, 4];
                        return [4 /*yield*/, contactModel_1.Contacts.retrieveContactsByEmail(socket.handshake.session.nsp, data.email)];
                    case 1:
                        contact = _a.sent();
                        if (!(contact && contact.length)) return [3 /*break*/, 3];
                        return [4 /*yield*/, contactModel_1.Contacts.retrieveContacts(data.nsp)];
                    case 2:
                        contactsData = _a.sent();
                        callback({ status: 'ok', contactsList: contactsData });
                        _a.label = 3;
                    case 3: return [3 /*break*/, 9];
                    case 4: return [4 /*yield*/, contactModel_1.Contacts.retrieveContactsByEmail(socket.handshake.session.nsp, data.email)];
                    case 5:
                        contact = _a.sent();
                        if (!(contact && contact.length)) return [3 /*break*/, 9];
                        if (!(contact[0].level == 1)) return [3 /*break*/, 7];
                        return [4 /*yield*/, contactModel_1.Contacts.retrieveContacts(data.nsp)];
                    case 6:
                        contactsData = _a.sent();
                        callback({ status: "ok", contactsList: contactsData });
                        return [3 /*break*/, 9];
                    case 7:
                        if (!(contact[0].level > 1)) return [3 /*break*/, 9];
                        return [4 /*yield*/, contactModel_1.Contacts.retrieveContactsByLevel(data.nsp, contact[0].level)];
                    case 8:
                        contactsData = _a.sent();
                        callback({ status: "ok", contactsList: contactsData });
                        _a.label = 9;
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        err_4 = _a.sent();
                        callback({ status: "error", err: err_4 });
                        console.log("Error encountered in retrieving contacts");
                        return [3 /*break*/, 11];
                    case 11: return [2 /*return*/];
                }
            });
        }); });
        socket.on("createContact", function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var namespace, contactCreated, err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        namespace = socket.handshake.session.nsp;
                        return [4 /*yield*/, contactModel_1.Contacts.createContacts(data, namespace)];
                    case 1:
                        contactCreated = _a.sent();
                        // console.log('Created Contact: ');
                        // console.log(contactCreated);
                        callback({ status: "ok", contact: contactCreated });
                        return [3 /*break*/, 3];
                    case 2:
                        err_5 = _a.sent();
                        callback({ status: "error", err: err_5 });
                        console.log("Error encountered in creating contact");
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        socket.on("editContact", function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var updatedContact, err_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, contactModel_1.Contacts.editContact(data)];
                    case 1:
                        updatedContact = _a.sent();
                        callback({ status: "ok", updatedContact: updatedContact });
                        return [3 /*break*/, 3];
                    case 2:
                        err_6 = _a.sent();
                        callback({ status: "error", err: err_6 });
                        console.log(err_6);
                        console.log("Error encountered in updating contact");
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        socket.on("updateStatus", function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var err_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        if (!data.email) return [3 /*break*/, 2];
                        return [4 /*yield*/, contactModel_1.Contacts.updateStatus(data.email, socket.handshake.session.nsp, data.status)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [3 /*break*/, 4];
                    case 3:
                        err_7 = _a.sent();
                        callback({ status: "error", err: err_7 });
                        console.log("Error encountered in updating contact");
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        socket.on("deleteContact", function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var contacts, err_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, contactModel_1.Contacts.DeleteContact(data.id, socket.handshake.session.nsp)];
                    case 1:
                        contacts = _a.sent();
                        if (contacts && contacts.result.ok) {
                            contactConversationModel_1.ContactConversations.removeConversation(data.email, socket.handshake.session.email, socket.handshake.session.nsp);
                            callback({ status: "ok", deletedContact: data.email });
                            socket.to(agentModel_1.Agents.NotifyAll()).emit('contactDeleted', { status: "ok", deletedContact: data.email });
                            origin.to(visitorModel_1.Visitor.NotifyAll(socket.handshake.session)).emit('contactDeleted', { status: "ok", deletedContact: data.email });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_8 = _a.sent();
                        callback({ status: "error", err: err_8 });
                        console.log("Error encountered in deleting contacts");
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        socket.on('importContacts', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var contacts, err_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, contactModel_1.Contacts.ImportContacts(data.contacts, data.nsp)];
                    case 1:
                        contacts = _a.sent();
                        callback({ status: 'ok', contactList: contacts });
                        return [3 /*break*/, 3];
                    case 2:
                        err_9 = _a.sent();
                        console.log(err_9);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        socket.on('importContactsWithUpdate', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var contacts, err_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, contactModel_1.Contacts.ImportContactsWithUpdate(data.contacts, data.nsp)];
                    case 1:
                        contacts = _a.sent();
                        callback({ status: 'ok', contactList: contacts });
                        return [3 /*break*/, 3];
                    case 2:
                        err_10 = _a.sent();
                        console.log(err_10);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        socket.on('getContactByEmail', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var contact, err_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, contactModel_1.Contacts.retrieveContactsByEmail(socket.handshake.session.nsp, data.email)];
                    case 1:
                        contact = _a.sent();
                        if (contact && contact.length) {
                            callback({ status: 'ok', contact: contact[0] });
                        }
                        else {
                            callback({ status: 'error' });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_11 = _a.sent();
                        console.log(err_11);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        socket.on('getContactByID', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var contact, err_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, contactModel_1.Contacts.retrieveContactsByID(socket.handshake.session.nsp, data.id)];
                    case 1:
                        contact = _a.sent();
                        if (contact && contact.length) {
                            callback({ status: 'ok', contact: contact[0] });
                        }
                        else {
                            callback({ status: 'error' });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_12 = _a.sent();
                        console.log(err_12);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        socket.on('pong', function (data) {
            console.log('Recieved Pong: ', data);
        });
        contactConversationEvents_1.ContactConversationsEvents.BindConversationEvents(socket, origin);
        contactCallingEvents_1.ContactCallingEvents.BindCallingEvents(socket, origin);
    };
    return ContactHandlers;
}());
exports.ContactHandlers = ContactHandlers;
//# sourceMappingURL=contactHandlers.js.map