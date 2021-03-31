"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contactservice = void 0;
var core_1 = require("@angular/core");
//RxJs Imsports
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/operator/map");
require("rxjs/add/operator/filter");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var xlsx_1 = require("xlsx");
var confirmation_dialog_component_1 = require("../app/dialogs/confirmation-dialog/confirmation-dialog.component");
var xlsx = { utils: xlsx_1.utils, readFile: xlsx_1.readFile, read: xlsx_1.read };
var Contactservice = /** @class */ (function () {
    function Contactservice(_socket, _authService, http, dialog, _notificationService, snackBar) {
        var _this = this;
        this._socket = _socket;
        this._authService = _authService;
        this.http = http;
        this.dialog = dialog;
        this._notificationService = _notificationService;
        this.snackBar = snackBar;
        this.contactsList = new BehaviorSubject_1.BehaviorSubject([]);
        this.selectedContact = new BehaviorSubject_1.BehaviorSubject({});
        this.contactsCount = new BehaviorSubject_1.BehaviorSubject([]);
        this.onlineCount = new BehaviorSubject_1.BehaviorSubject(0);
        this.offlineCount = new BehaviorSubject_1.BehaviorSubject(0);
        this.showContactAccessInfo = new BehaviorSubject_1.BehaviorSubject(true);
        this.emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        this.numberPattern = /[0-9\-]+/;
        this.isSelfViewingChat = new BehaviorSubject_1.BehaviorSubject({ chatId: '', value: false });
        //Thread revamp
        this.conversationList = new BehaviorSubject_1.BehaviorSubject([]);
        this.selectedThread = new BehaviorSubject_1.BehaviorSubject(undefined);
        this.showContacts = new BehaviorSubject_1.BehaviorSubject(true);
        this.showConversations = new BehaviorSubject_1.BehaviorSubject(false);
        this.showContactInfo = new BehaviorSubject_1.BehaviorSubject(false);
        this.loadingContacts = new BehaviorSubject_1.BehaviorSubject(false);
        this.loadingContactInfo = new BehaviorSubject_1.BehaviorSubject(false);
        this.loadingConversation = new BehaviorSubject_1.BehaviorSubject(false);
        this.sortBy = new BehaviorSubject_1.BehaviorSubject('ALL');
        this._authService.getAgent().subscribe(function (agent) {
            _this.agent = agent;
        });
        this._authService.getServer().subscribe(function (url) {
            _this.url = url;
        });
        // _authService.getGroupsFromBackend();
        this._socket.getSocket().subscribe(function (data) {
            if (data) {
                _this.socket = data;
                _this.RetrieveContacts();
                // this.GetThreadList();
                _this.GetContactsCountWithStatus();
                _this.GetThreadListByEmail();
                _this.socket.on('contactAvailable', function (response) {
                    // console.log('Contact Avalaible');
                    _this.contactsList.next(_this.contactsList.getValue().map(function (contact) {
                        if (contact.email == response.email) {
                            contact.status = true;
                        }
                        return contact;
                    }));
                    // console.log(this.contactsCount.getValue());
                    _this.contactsCount.next(_this.contactsCount.getValue().map(function (contact) {
                        if (contact.email == response.email) {
                            contact.status = true;
                        }
                        return contact;
                    }));
                });
                _this.socket.on('contactDisconnected', function (response) {
                    // console.log('Contact Disconnected');
                    _this.contactsList.next(_this.contactsList.getValue().map(function (contact) {
                        if (contact.email == response.email) {
                            contact.status = false;
                        }
                        return contact;
                    }));
                    _this.contactsCount.next(_this.contactsCount.getValue().map(function (contact) {
                        if (contact.email == response.email) {
                            contact.status = false;
                        }
                        return contact;
                    }));
                });
                _this.socket.on('contactDeleted', function (response) {
                    if (response.status == 'ok') {
                        var index_list = _this.contactsList.getValue().findIndex(function (a) { return a.email == response.deletedContact; });
                        var index_count = _this.contactsCount.getValue().findIndex(function (a) { return a.email == response.deletedContact; });
                        _this.contactsCount.getValue().splice(index_count, 1);
                        _this.contactsCount.next(_this.contactsCount.getValue());
                        if (index_list) {
                            _this.contactsList.getValue().splice(index_list, 1);
                            _this.contactsList.next(_this.contactsList.getValue());
                        }
                        if (_this.contactsList.getValue().length) {
                            _this.selectedContact.next(_this.contactsList.getValue()[0]);
                        }
                        else {
                            _this.selectedContact.next({});
                        }
                    }
                    // console.log(this.contactsCount.getValue().length);
                });
                _this.socket.on('gotNewContact', function (response) {
                    if (_this.contactsList.getValue().filter(function (data) { return data.email == response.createdContact.email; }).length == 0) {
                        _this.contactsList.getValue().push(response.createdContact);
                        _this.contactsList.next(_this.contactsList.getValue());
                    }
                });
                _this.socket.on('gotNewContactConversation', function (data) {
                    if (!_this.conversationList.getValue().filter(function (c) { return c._id == data.conversation._id; }).length) {
                        _this.conversationList.getValue().push(data.conversation);
                        _this.conversationList.next(_this.conversationList.getValue());
                    }
                });
                _this.socket.on('gotNewContactMessage', function (response) {
                    // console.log("Got New Contact Message!");
                    // console.log(response);   
                    if (_this.isSelfViewingChat.getValue().chatId != response.currentConversation._id || (_this.isSelfViewingChat.getValue().chatId == response.currentConversation._id && !_this.isSelfViewingChat.getValue().value)) {
                        if (response.currentConversation.LastSeen.filter(function (data) { return data.id == _this.agent.email; })[0].messageReadCount <= 1) {
                            var notif_data = [];
                            notif_data.push({
                                'title': response.message.from + ' says:',
                                'alertContent': response.message.body,
                                'icon': "../assets/img/favicon.ico",
                                'url': "/contacts"
                            });
                            _this._notificationService.generateNotification(notif_data);
                        }
                    }
                    var index = _this.conversationList.getValue().findIndex(function (obj) { return obj._id == response.currentConversation._id; });
                    _this.conversationList.getValue()[index] = response.currentConversation;
                    _this.conversationList.next(_this.conversationList.getValue());
                    if (_this.selectedThread.getValue()._id == response.currentConversation._id) {
                        _this.selectedThread.getValue().messages.push(response.message);
                        _this.selectedThread.next(_this.selectedThread.getValue());
                        if (_this.isSelfViewingChat.getValue().chatId == response.currentConversation._id && _this.isSelfViewingChat.getValue().value) {
                            _this.seenConversation(response.currentConversation._id);
                        }
                    }
                    // let notif_data: Array<any> = [];
                    // notif_data.push({
                    //   'title': 'New Message!',
                    //   'alertContent': 'You have received a new message!',
                    //   'icon': "../assets/img/favicon.ico",
                    //   'url': "/chats"
                    // });
                    // if (this.showNotification) {
                    //   this._notificationService.generateNotification(notif_data);
                    // }
                });
                _this.socket.on('contactConversationSeen', function (response) {
                    // console.log('Conversation Seen!');                                
                    if (_this.selectedThread.getValue()) {
                        var thread = _this.selectedThread.getValue();
                        thread.LastSeen = response.LastSeen;
                        _this.selectedThread.next(thread);
                    }
                    // this.getAllAgentConversations();
                });
            }
        });
    }
    Contactservice.prototype.ToggleSelfViewingChat = function (chatId) {
        this.isSelfViewingChat.next({
            chatId: chatId,
            value: true
        });
        if (this.isSelfViewingChat.getValue().value) {
            this.seenConversation(chatId);
        }
        this.sortBy.next('');
        this.showContacts.next(false);
        this.showConversations.next(true);
    };
    Contactservice.prototype.GetContactsCountWithStatus = function () {
        var _this = this;
        this.socket.emit("getContactsCount", { nsp: this.agent.nsp }, function (response) {
            if (response.status == 'ok' && response.contactsList.length) {
                _this.contactsCount.next(response.contactsList);
                //   console.log(this.contactsCount.getValue().length);
                //   this.onlineCount.next(this.contactsCount.getValue().filter(a => a.status == true).length);
                //   this.offlineCount.next(this.contactsCount.getValue().filter(a => a.status == false).length);
            }
        });
    };
    Contactservice.prototype.RetrieveContacts = function (lastContactId, type) {
        var _this = this;
        if (lastContactId === void 0) { lastContactId = '0'; }
        if (type === void 0) { type = 'ALL'; }
        this.loadingContacts.next(true);
        this.socket.emit("retrieveContactsAsync", { nsp: this.agent.nsp, chunk: lastContactId, type: type }, function (response) {
            // console.log(response);
            if (response.status == 'ok') {
                if (_this.contactsList.getValue().length && !_this.contactsList.getValue().ended) {
                    if (response.contactsList.length) {
                        response.contactsList.forEach(function (contact) {
                            if (!_this.contactsList.getValue().filter(function (a) { return a._id == contact._id; }).length) {
                                _this.contactsList.getValue().push(contact);
                            }
                            _this.contactsList.getValue().ended = response.ended;
                        });
                        _this.contactsList.next(_this.contactsList.getValue());
                    }
                    else {
                        _this.contactsList.next([]);
                    }
                    // console.log(this.contactsList.getValue().length);                          
                }
                else {
                    _this.contactsList.next(response.contactsList);
                }
            }
            // console.log(this.contactsList.getValue().length);
            _this.loadingContacts.next(false);
        });
    };
    Contactservice.prototype.getOrcreateConversation = function () {
        var _this = this;
        var data = {
            toContact: this.selectedContact.getValue().email,
            toName: this.selectedContact.getValue().name,
            fromContact: this.agent.email,
            fromName: this.agent.first_name + ' ' + this.agent.last_name
        };
        this.socket.emit('createContactConversation', { conBody: data }, function (response) {
            if (response.status == 'ok' && response.conversation) {
                // console.log(response);
                _this.selectedThread.next(response.conversation);
                _this.isSelfViewingChat.next({
                    chatId: response.conversation._id,
                    value: true
                });
                _this.seenConversation(response.conversation._id);
                if (!_this.conversationList.getValue().filter(function (c) { return c._id == response.conversation._id; }).length) {
                    _this.conversationList.getValue().push(response.conversation);
                    _this.conversationList.next(_this.conversationList.getValue());
                }
                _this.showContacts.next(false);
                _this.showConversations.next(true);
                _this.sortBy.next('');
            }
        });
    };
    Contactservice.prototype.setSelectedContact = function (id, cid) {
        var _this = this;
        this.loadingContactInfo.next(true);
        if (id) {
            // console.log(id);
            if (this.contactsList.getValue().filter(function (a) { return a._id == id; }).length) {
                this.contactsList.getValue().map(function (contact) {
                    if (contact._id == id) {
                        _this.selectedContact.next(contact);
                        _this.showContactInfo.next(true);
                        if (cid) {
                            // console.log('CID: ' + cid);                      
                            _this.isSelfViewingChat.next({
                                chatId: cid,
                                value: false
                            });
                        }
                    }
                });
                this.loadingContactInfo.next(false);
            }
            else {
                this.socket.emit('getContactByID', { id: id }, function (response) {
                    if (response && response.contact) {
                        _this.selectedContact.next(response.contact);
                        _this.showContactInfo.next(true);
                        if (cid) {
                            // console.log('CID: ' + cid);                      
                            _this.isSelfViewingChat.next({
                                chatId: cid,
                                value: false
                            });
                        }
                    }
                    _this.loadingContactInfo.next(false);
                });
            }
        }
        else {
            this.selectedContact.next({});
            this.showContacts.next(true);
            this.sortBy.next('ALL');
            this.showConversations.next(false);
            this.loadingContactInfo.next(false);
            this.selectedThread.next(undefined);
            this.isSelfViewingChat.next({
                chatId: '',
                value: false
            });
        }
    };
    Contactservice.prototype.CreateContact = function (contact) {
        var _this = this;
        // console.log(contact);
        if (this.contactsList.getValue().filter(function (c) { return c.email == contact.email; }).length > 0) {
            this.dialog.open(confirmation_dialog_component_1.ConfirmationDialogComponent, {
                panelClass: ['confirmation-dialog'],
                data: { headermsg: 'Contact already exists do you want to update?' }
            }).afterClosed().subscribe(function (data) {
                if (data == 'ok') {
                    _this.socket.emit("createContact", (contact), function (resp) {
                        if (resp.status == "ok") {
                            var index = _this.contactsList.getValue().findIndex(function (c) { return c.email == resp.contact.email; });
                            _this.contactsList.getValue()[index] = resp.contact;
                            _this.contactsList.next(_this.contactsList.getValue());
                        }
                        else {
                            console.log('Error encountered in creating contact');
                        }
                    });
                }
                else {
                }
            });
        }
        else {
            this.socket.emit("createContact", (contact), function (resp) {
                if (resp.status == "ok") {
                    _this.contactsList.getValue().splice(0, 0, resp.contact);
                    _this.contactsList.next(_this.contactsList.getValue());
                    _this.contactsCount.getValue().push({
                        _id: resp.contact._id,
                        email: resp.contact.email,
                        status: resp.contact.status
                    });
                    _this.contactsCount.next(_this.contactsCount.getValue());
                }
                else {
                    console.log('Error encountered in creating contact');
                }
            });
        }
    };
    Contactservice.prototype.SendMessageToContact = function (message) {
        var _this = this;
        this.socket.emit('insertContactMessage', { message: message }, function (response) {
            if (response.status == 'ok') {
                _this.selectedThread.getValue().messages.push(response.message);
                _this.selectedThread.getValue().LastSeen = response.currentConversation.LastSeen;
                _this.selectedThread.next(_this.selectedThread.getValue());
                // let index = this.threadList.getValue().findIndex(obj => obj._id == response.currentConversation._id);
                // this.threadList.getValue()[index] = response.currentConversation;
                // this.threadList.next(this.threadList.getValue());    
                var conversation = _this.conversationList.getValue().findIndex(function (obj) { return obj._id == response.currentConversation._id; });
                _this.conversationList.getValue()[conversation] = response.currentConversation;
                _this.conversationList.next(_this.conversationList.getValue());
            }
        });
    };
    Contactservice.prototype.seenConversation = function (cid) {
        // console.log(this.conversationList.getValue());
        // console.log((this.selectedThread.getValue().to == this.agent.email) ? this.selectedThread.getValue().from : this.selectedThread.getValue().to);
        var _this = this;
        this.socket.emit('seenContactConversation', { cid: cid, userId: this.agent.email, to: (this.selectedThread.getValue().to == this.agent.email) ? this.selectedThread.getValue().from : this.selectedThread.getValue().to }, function (response) {
            if (response.status == 'ok') {
                var index = _this.conversationList.getValue().findIndex(function (obj) { return obj._id == response.currentConversation._id; });
                _this.conversationList.getValue()[index] = response.currentConversation;
                _this.conversationList.next(_this.conversationList.getValue());
            }
        });
    };
    Contactservice.prototype.EditContact = function (contact) {
        var _this = this;
        this.socket.emit("editContact", contact, function (resp) {
            if (resp.status == "ok") {
                _this.contactsList.getValue().filter(function (contact) {
                    if (resp.updatedContact._id.toString() == contact._id.toString()) {
                        contact.name = resp.updatedContact.name;
                        contact.email = resp.updatedContact.email;
                        contact.phone_no = resp.updatedContact.phone_no;
                        _this.selectedContact.next(resp.updatedContact);
                        return true;
                    }
                });
            }
            else {
                console.log('Error encountered in editting contact');
            }
        });
    };
    Contactservice.prototype.DeleteContacts = function (ids) {
        var _this = this;
        // Convert ids into a list
        var idsArray = Object.keys(ids);
        // remove keys which had the value false
        var filteredArray = idsArray.filter(function (e) {
            return ids[e];
        });
        // console.log(filteredArray);
        this.socket.emit("deleteContacts", filteredArray, function (resp) {
            if (resp.status == "ok") {
                var filteredContactList = _this.contactsList.getValue().filter(function (e) {
                    // console.log('e._id.toString()')
                    // console.log(e._id.toString())
                    if (filteredArray.includes(e._id.toString())) {
                        return false;
                    }
                    else {
                        return true;
                    }
                });
                // console.log('filteredContactList')
                // console.log(filteredContactList)
                _this.contactsList.next(filteredContactList);
            }
            else {
                console.log('Error encountered in deleting contacts');
            }
        });
    };
    Contactservice.prototype.DeleteContact = function (id, email) {
        var _this = this;
        this.socket.emit('deleteContact', { id: id, email: email }, function (response) {
            if (response.status == 'ok') {
                var index_list = _this.contactsList.getValue().findIndex(function (a) { return a.email == response.deletedContact; });
                var index_count = _this.contactsCount.getValue().findIndex(function (a) { return a.email == response.deletedContact; });
                _this.contactsCount.getValue().splice(index_count, 1);
                _this.contactsCount.next(_this.contactsCount.getValue());
                _this.contactsList.getValue().splice(index_list, 1);
                _this.contactsList.next(_this.contactsList.getValue());
                if (_this.contactsList.getValue().length) {
                    _this.selectedContact.next(_this.contactsList.getValue()[0]);
                }
                else {
                    _this.selectedContact.next({});
                }
                // console.log(this.contactsCount.getValue().length);
            }
        });
    };
    Contactservice.prototype.UploadContacts = function (fileElement) {
        var _this = this;
        try {
            var localFileReader = new FileReader();
            var contacts_1 = [];
            // Local manipulations to uploaded files
            localFileReader.onload = function (event) {
                // console.log('LocalFileReader On LOAD');
                var workbook = xlsx.read(new Uint8Array(event.target.result), { type: "array" });
                var Sheets = workbook.Sheets;
                var sheetNames = Object.keys(Sheets);
                var ISODate = (new Date()).toISOString();
                sheetNames.forEach(function (sheetName) {
                    var sheet = Sheets[sheetName];
                    // parse each sheet and add to db
                    // return if sheet is empty
                    if (!sheet['!ref'])
                        return;
                    var sheetObj = xlsx.utils.sheet_to_json(sheet, { raw: false });
                    sheetObj.forEach(function (row) {
                        var rowClean = _this.lowercaseObjKeys(row);
                        // console.log(rowClean);
                        // email MUST be included in the row
                        if (rowClean['group'] && (rowClean['group'].toString().toLowerCase() == 'engro' || rowClean['group'].toString().toLowerCase() == 'poc')) {
                            // console.log('Inside IF');
                            var contact = {
                                email: (rowClean['email id'] ? _this.testRegExp(_this.emailPattern, rowClean['email id']) : ''),
                                phone_no: (rowClean['contact number'] ? _this.testRegExp(_this.numberPattern, rowClean['contact number']) : ''),
                                designation: (rowClean['designation'] ? rowClean['designation'] : ''),
                                name: (rowClean['name'] ? rowClean['name'] : ''),
                                image: (rowClean['image'] ? rowClean['image'] : ''),
                                extension: (rowClean['extension'] ? rowClean['extension'] : ''),
                                lineManager: (rowClean['line manager'] ? rowClean['line manager'] : ''),
                                location: (rowClean['location'] ? rowClean['location'] : ''),
                                supportApps: (rowClean['support applications'] ? rowClean['support applications'] : ''),
                                group: (rowClean['group'] ? rowClean['group'] : ''),
                                subGroup: (rowClean['subgroup'] ? rowClean['subgroup'] : ''),
                                created_date: ISODate,
                                nsp: _this.agent.nsp,
                                status: false
                            };
                            contacts_1.push(contact);
                        }
                        else if (rowClean['email'] && _this.emailPattern.test(rowClean['email'])) {
                            var contact = {
                                email: (rowClean['email'] ? _this.testRegExp(_this.emailPattern, rowClean['email']) : ''),
                                phone_no: (rowClean['contact number'] ? _this.testRegExp(_this.numberPattern, rowClean['contact number']) : ''),
                                image: (rowClean['image'] ? rowClean['image'] : ''),
                                name: (rowClean['name'] ? rowClean['name'] : ''),
                                designation: (rowClean['designation'] ? rowClean['designation'] : ''),
                                lineManager: (rowClean['line manager'] ? rowClean['line manager'] : ''),
                                department: (rowClean['department'] ? rowClean['department'] : ''),
                                group: (rowClean['group'] ? rowClean['group'] : ''),
                                level: (rowClean['weightage'] ? Number(rowClean['weightage']) : 0),
                                extension: (rowClean['extension'] ? rowClean['extension'] : ''),
                                created_date: ISODate,
                                nsp: '/hrm.sbtjapan.com',
                                status: false
                            };
                            contacts_1.push(contact);
                        }
                    });
                });
            };
            localFileReader.onloadend = function (event) {
                // console.log('on load Ended!');
                // console.log(contacts);
                if (_this.contactsList.getValue().length && contacts_1.length) {
                    //Check if duplicate contact exist. If yes , then prompt the user for updation.
                    if (_this.contactsList.getValue().some(function (data) { return contacts_1.filter(function (element) { return element.email == data.email; }).length > 0; })) {
                        //     console.log('Duplicate Found!');
                        //     //Prompt User 
                        _this.dialog.open(confirmation_dialog_component_1.ConfirmationDialogComponent, {
                            panelClass: ['confirmation-dialog'],
                            data: { headermsg: 'Duplicate contacts found! Do you want to update them?' }
                        }).afterClosed().subscribe(function (data) {
                            if (data == 'ok') {
                                _this.ImportContactsWithUpdate(contacts_1, _this.agent.nsp);
                            }
                            else {
                                _this.ImportContacts(contacts_1, '/hrm.sbtjapan.com');
                            }
                        });
                    }
                    else {
                        _this.ImportContacts(contacts_1, '/hrm.sbtjapan.com');
                    }
                    //If updation is true, Emit ImportWithUpdate
                    //Else Do a normal Import.
                }
                else {
                    //ImportContacts as it is.
                    _this.ImportContacts(contacts_1, '/hrm.sbtjapan.com');
                }
            };
            localFileReader.readAsArrayBuffer(fileElement);
        }
        catch (err) {
            // console.log("Error encountered in importing contacts");
            // console.log(err);
        }
    };
    // Returns object with all keys cleaned -> lowercase and stripped of whitespace
    Contactservice.prototype.lowercaseObjKeys = function (obj) {
        var keys = Object.keys(obj);
        keys.forEach(function (key) {
            var keyClean = key.toLowerCase().trim();
            // do nothing if the clean key is the same as the original key
            if (keyClean === key)
                return;
            obj[keyClean] = obj[key];
            delete obj[key];
            // console.log("key: " + key);
            // console.log("keyClean: " + keyClean);
        });
        return obj;
    };
    // Returns original string to be tested if pattern tests true for string
    // otherwise returns empty string 
    Contactservice.prototype.testRegExp = function (regexPattern, tested) {
        if (regexPattern.test(tested)) {
            return tested;
        }
        else {
            return '';
        }
    };
    Contactservice.prototype.ImportContacts = function (data, nsp) {
        var _this = this;
        // console.log('Ready to Emit');
        // console.log(data);
        this.socket.emit('importContacts', { contacts: data, nsp: nsp }, function (response) {
            // console.log(response);
            if (response.status == 'ok') {
                _this.contactsList.next(response.contactList);
                _this.GetContactsCountWithStatus();
            }
            else {
                _this.contactsList.next([]);
            }
        });
    };
    Contactservice.prototype.ImportContactsWithUpdate = function (data, nsp) {
        var _this = this;
        this.socket.emit('importContactsWithUpdate', { contacts: data, nsp: nsp }, function (response) {
            if (response.status == 'ok') {
                _this.contactsList.next(response.contactList);
                _this.GetContactsCountWithStatus();
            }
        });
    };
    Contactservice.prototype.toggleContactAccessInformation = function () {
        this.showContactAccessInfo.next(!this.showContactAccessInfo.getValue());
    };
    //Thread Work
    Contactservice.prototype.GetThreadByCid = function (conversation) {
        var _this = this;
        this.loadingConversation.next(true);
        this.selectedThread.next(conversation);
        this.socket.emit('getThreadByCid', { cid: conversation._id.toString() }, function (response) {
            if (response.status == 'ok' && response.conversation) {
                // console.log(response);
                _this.selectedThread.getValue().messages = response.conversation[0].messages;
                _this.selectedThread.next(_this.selectedThread.getValue());
                _this.loadingConversation.next(false);
                _this.isSelfViewingChat.next({
                    chatId: response.conversation[0]._id,
                    value: true
                });
                _this.seenConversation(response.conversation[0]._id);
            }
        });
    };
    Contactservice.prototype.GetContactByEmail = function (email) {
        var _this = this;
        // this.loadingConversation.next(true);
        this.loadingContactInfo.next(true);
        if (this.selectedContact.getValue().email != email) {
            this.socket.emit('getContactByEmail', { email: email }, function (response) {
                if (response.status == 'ok' && response.contact) {
                    // console.log(response);
                    _this.selectedContact.next(response.contact);
                }
            });
            this.loadingContactInfo.next(false);
        }
        else {
            this.loadingContactInfo.next(false);
        }
    };
    // GetThreadList(){
    //     this.socket.emit('getAllContactConversations', {}, (response) => {
    //         // console.log(response);
    //         if(response.status == 'ok' && response.conversations.length){
    //             this.threadList.next(response.conversations);
    //         }else{
    //             this.threadList.next([]);
    //         }
    //     });
    // }
    Contactservice.prototype.GetThreadListByEmail = function () {
        var _this = this;
        this.socket.emit('getThreadList', { email: this.agent.email }, function (response) {
            // console.log(response);
            if (response.status == 'ok' && response.conversations.length) {
                _this.conversationList.next(response.conversations);
            }
            else {
                _this.conversationList.next([]);
            }
        });
    };
    Contactservice.prototype.GetMoreMessages = function (cid, lastMessageId) {
        // console.log(lastMessageId);
        var _this = this;
        if (lastMessageId === void 0) { lastMessageId = '0'; }
        this.socket.emit('getMoreMessages', { cid: cid, chunk: lastMessageId }, function (response) {
            // console.log('Get More Messages');
            if (response.status == 'ok' && response.messages.length) {
                if (!_this.selectedThread.getValue().ended) {
                    response.messages.forEach(function (msg) {
                        _this.selectedThread.getValue().messages.splice(0, 0, msg);
                        _this.selectedThread.getValue().ended = response.ended;
                    });
                    _this.selectedThread.next(_this.selectedThread.getValue());
                }
            }
        });
    };
    Contactservice.prototype.updateStatus = function (email, status) {
        this.socket.emit('updateStatus', { email: email, status: status }, function (response) {
            // console.log('Get More Messages');
        });
    };
    Contactservice.prototype.SearchContact = function (keyword, chunk) {
        var _this = this;
        if (chunk === void 0) { chunk = '0'; }
        this.loadingContacts.next(true);
        console.log('Searching contact on server...');
        return this.http.post(this.url + '/contact/searchContact/', {
            keyword: keyword,
            nsp: this.agent.nsp,
            chunk: chunk
        })
            .map(function (response) {
            _this.loadingContacts.next(false);
            return response.json();
        })
            .catch(function (err) {
            _this.loadingContacts.next(false);
            return Observable_1.Observable.throw(err);
        });
    };
    //Typing State Events
    Contactservice.prototype.StartedTyping = function (cid, to, from) {
        this.socket.emit('typingStarted', { cid: cid, to: to, from: from }, function (response) {
        });
    };
    Contactservice.prototype.PausedTyping = function (cid, to, from) {
        this.socket.emit('typingPaused', { cid: cid, to: to, from: from }, function (response) {
        });
    };
    Contactservice = __decorate([
        core_1.Injectable()
    ], Contactservice);
    return Contactservice;
}());
exports.Contactservice = Contactservice;
//# sourceMappingURL=ContactService.js.map