"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsAppService = void 0;
var core_1 = require("@angular/core");
//RxJs Imports
var Observable_1 = require("rxjs/Observable");
var Subject_1 = require("rxjs/Subject");
require("rxjs/add/operator/map");
require("rxjs/add/operator/filter");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
require("rxjs/add/operator/distinctUntilChanged");
var http_1 = require("@angular/common/http");
var WhatsAppService = /** @class */ (function () {
    function WhatsAppService(_socket, http, _authService, _appStateService, _uploadingService, _notificationService) {
        //////console.log('Chat Service Initialized');
        var _this = this;
        this._socket = _socket;
        this.http = http;
        this._authService = _authService;
        this._appStateService = _appStateService;
        this._uploadingService = _uploadingService;
        this._notificationService = _notificationService;
        this.showNotification = false;
        this.canAccessWhatsApp = new BehaviorSubject_1.BehaviorSubject(false);
        this.authChecked = new BehaviorSubject_1.BehaviorSubject(false);
        this.subscriptions = [];
        this.notification = new Subject_1.Subject();
        this.ServiceURL = '';
        this.ContactList = new BehaviorSubject_1.BehaviorSubject([]);
        this.SearchList = new BehaviorSubject_1.BehaviorSubject([]);
        this.SelectedContact = new BehaviorSubject_1.BehaviorSubject(undefined);
        this.synced = new BehaviorSubject_1.BehaviorSubject(false);
        this.customEmail = new BehaviorSubject_1.BehaviorSubject('');
        this.FetchingContacts = new BehaviorSubject_1.BehaviorSubject(false);
        this.Initialized = new BehaviorSubject_1.BehaviorSubject(false);
        this.urlRegex = /((http(s)?:\/\/)?([\w-]+\.)+[\w-]+[.com]+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?)/gmi;
        this.conversationsFetched = false;
        this.archivesFetched = false;
        //Change to Behaviour Subject if Any Error Occured
        //private Agent : BehaviorSubject<any> = new BehaviorSubject({});
        this.ContactUpdates = new BehaviorSubject_1.BehaviorSubject({});
        this.ContactOldMessagesReadCount = new BehaviorSubject_1.BehaviorSubject({});
        this.MessageUpdates = new BehaviorSubject_1.BehaviorSubject({});
        this.MessageStatusUpdates = new BehaviorSubject_1.BehaviorSubject({});
        this.Attachmentupdates = new BehaviorSubject_1.BehaviorSubject({});
        this.__Searching = new BehaviorSubject_1.BehaviorSubject(false);
        this.MessageUnreadCount = new BehaviorSubject_1.BehaviorSubject(0);
        this.SearchValue = new Subject_1.Subject();
        this.fetchingRequest = {};
        this.settingUnreadCount = {};
        this.currentUploads = {};
        this.attachmentsRequest = {};
        _authService.getSettings().subscribe(function (data) {
            if (data && data.permissions) { }
        });
        _authService.WhatsAppAserviceURL.subscribe(function (url) {
            _this.ServiceURL = url + '/wapp';
        });
        this.subscriptions.push(this.SearchValue.debounceTime(1000).distinctUntilChanged().subscribe(function (value) {
            if (!value)
                _this.SearchList.next([]);
            else
                _this.FetchWithSearch(value);
        }));
        this.subscriptions.push(_authService.getAgent().subscribe(function (agent) {
            _this.Agent = agent;
            if (_this.Agent)
                _this.CheckAuth(_this.Agent.email);
        }));
        this.subscriptions.push(this.ContactUpdates.auditTime(1000).subscribe(function (data) {
            Object.keys(data).map(function (key) {
                // console.log(this.ContactList.getValue().length);
                var temp = _this.ContactList.getValue().filter(function (oldContact) {
                    if (oldContact._id == _this.ContactUpdates.getValue()[key]._id) {
                        if (oldContact.messages)
                            _this.ContactUpdates.getValue()[key].messages = oldContact.messages;
                        if (oldContact.tempMessages)
                            _this.ContactUpdates.getValue()[key].tempMessages = oldContact.tempMessages;
                        _this.ContactUpdates.getValue()[key].synced = oldContact.synced;
                        if (_this.SelectedContact.getValue() && _this.SelectedContact.getValue()._id == oldContact._id)
                            _this.SelectedContact.next(_this.ContactUpdates.getValue()[key]);
                        return false;
                    }
                    else {
                        return true;
                    }
                });
                _this.ContactList.next(__spreadArrays([_this.ContactUpdates.getValue()[key]], temp));
                delete _this.ContactUpdates.getValue()[key];
            });
            _this.ContactUpdates.next(_this.ContactUpdates.getValue());
        }));
        /**
        * @Cases
        * 1. Agar Contact nhi hai tou Fetch karna hai
        * 2. Agar hai tou  List main top par laana hai (Done)
        * 3. Agar Selected Contact hai tou messages bhi update karne hain. (Done)
        */
        this.subscriptions.push(this.MessageUpdates.debounceTime(3000).subscribe(function (data) {
            // console.log('processing Updates Message : ', JSON.parse(JSON.stringify(data)));
            Object.keys(data).map(function (key) {
                var found = false;
                var oldConact = undefined;
                var newContactList = _this.ContactList.getValue().filter(function (contact) {
                    if (contact.customerNo == key) {
                        found = true;
                        oldConact = JSON.parse(JSON.stringify(contact));
                        return false;
                    }
                    else
                        return true;
                });
                if (found) {
                    // console.log('Found ', oldConact.messages);
                    oldConact.lastTouchedTime = new Date().toISOString();
                    (!isNaN(oldConact.unreadCount) && oldConact.unreadCount) ? oldConact.unreadCount += _this.MessageUpdates.getValue()[key].messages.length : oldConact.unreadCount = _this.MessageUpdates.getValue()[key].messages.length;
                    if (!oldConact.messages)
                        oldConact.messages = _this.MessageUpdates.getValue()[key].messages;
                    else
                        oldConact.messages = __spreadArrays(oldConact.messages, _this.MessageUpdates.getValue()[key].messages);
                    if (_this.SelectedContact.getValue() && _this.SelectedContact.getValue()._id == oldConact._id)
                        _this.SelectedContact.next(oldConact);
                    newContactList = __spreadArrays([oldConact], newContactList);
                    _this.ContactList.next(newContactList);
                    // console.log('New Messages : ', this.SelectedContact.getValue().messages)
                    delete _this.MessageUpdates.getValue()[key];
                }
                else {
                    if (!_this.fetchingRequest[key]) {
                        _this.FetchContactByPhoneNumber(key, _this.customEmail.getValue());
                    }
                    delete _this.MessageUpdates.getValue()[key];
                }
            });
            // this.MessageUpdates.next(this.MessageUpdates.getValue());
        }));
        this.subscriptions.push(this.MessageStatusUpdates.debounceTime(2000).subscribe(function (data) {
            // console.log('Message AQueue : ', JSON.parse(JSON.stringify(data)));
            Object.keys(data).map(function (customerNo) {
                _this.ContactList.getValue().map(function (contact) {
                    if (customerNo == contact.customerNo && contact.messages) {
                        // console.log('Custmer FOund :', customerNo);
                        contact.messages = contact.messages.map(function (msg) {
                            // console.log('msg found : ', msg._id == this.MessageStatusUpdates.getValue()[customerNo][msg._id]);
                            if (data[customerNo][msg._id]) {
                                msg.status = 'delivered';
                            }
                            return msg;
                        });
                        // console.group('Messages : ', contact.messages);
                    }
                });
                delete _this.MessageStatusUpdates.getValue()[customerNo];
            });
            _this.ContactList.next(_this.ContactList.getValue());
        }));
        this.subscriptions.push(this.ContactOldMessagesReadCount.debounceTime(500).subscribe(function (data) {
            // console.log('Message AQueue : ', JSON.parse(JSON.stringify(data)));
            Object.keys(data).map(function (customerNo) {
                _this.ContactList.getValue().map(function (contact) {
                    if (customerNo == contact.customerNo && contact.messages) {
                        if (!contact.OldMessagesCount)
                            contact.OldMessagesCount = _this.ContactOldMessagesReadCount.getValue()[customerNo].OldMessagesCount;
                        else
                            contact.OldMessagesCount += _this.ContactOldMessagesReadCount.getValue()[customerNo].OldMessagesCount;
                        contact.synced = false;
                        if (_this.ContactOldMessagesReadCount.getValue()[customerNo].ended)
                            contact.ended = true;
                    }
                });
                delete _this.ContactOldMessagesReadCount.getValue()[customerNo];
            });
            _this.ContactList.next(_this.ContactList.getValue());
        }));
        this.subscriptions.push(this.Attachmentupdates.debounceTime(2000).subscribe(function (data) {
            // console.log('Message AQueue : ', JSON.parse(JSON.stringify(data)));
            Object.keys(data).map(function (customerNo) {
                _this.ContactList.getValue().map(function (contact) {
                    // console.log('Attachment Upate : ', contact.attachments);
                    if (customerNo == contact.customerNo && contact.attachments) {
                        _this.Attachmentupdates.getValue()[customerNo].attachments.map(function (attachment) {
                            switch (attachment.mediamimetype) {
                                case '1':
                                case '2':
                                case '3':
                                    if (!contact.attachments.media)
                                        contact.attachments.media = [];
                                    contact.attachments.media.unshift({
                                        mimeType: attachment.mediamimetype,
                                        customEmail: attachment.userId,
                                        customerNo: attachment.customerNo,
                                        mediaURL: attachment.mediaURL,
                                        messageID: '',
                                        filename: attachment.filename,
                                        contactID: contact._id
                                    });
                                    break;
                                default:
                                    if (!contact.attachments.files)
                                        contact.attachments.files = [];
                                    contact.attachments.files.unshift({
                                        mimeType: attachment.mediamimetype,
                                        customEmail: attachment.userId,
                                        customerNo: attachment.customerNo,
                                        mediaURL: attachment.mediaURL,
                                        messageID: '',
                                        filename: attachment.filename,
                                        contactID: contact._id
                                    });
                                    break;
                            }
                        });
                        // console.log('Attachments : ', contact.attachments)
                        if (contact.attachments.media)
                            contact.attachments.media = contact.attachments.media.slice(0, 10);
                        if (contact.attachments.files)
                            contact.attachments.files = contact.attachments.files.slice(0, 10);
                    }
                });
                delete _this.ContactOldMessagesReadCount.getValue()[customerNo];
            });
            _this.ContactList.next(_this.ContactList.getValue());
        }));
        _socket.getSocket().subscribe(function (data) {
            if (data) {
                _this.socket = data;
                _this.socket.on('wappNewContacts', function (data) {
                    // console.log('wappNewContacts', data._id);
                    var eventkey = data.customerNo + Date.parse(new Date().toString()).toString();
                    _this.ContactUpdates.getValue()[eventkey] = data;
                    _this.ContactUpdates.next(_this.ContactUpdates.getValue());
                });
                _this.socket.on('wappNewMessages', function (data) {
                    var eventkey = data.customerNo;
                    if (_this.MessageUpdates.getValue()[eventkey] && _this.MessageUpdates.getValue()[eventkey].messages) {
                        _this.MessageUpdates.getValue()[eventkey].messages.push(data);
                        _this.MessageUpdates.next(_this.MessageUpdates.getValue());
                    }
                    else {
                        _this.MessageUpdates.getValue()[eventkey] = {};
                        _this.MessageUpdates.getValue()[eventkey].messages = [];
                        _this.MessageUpdates.getValue()[eventkey].messages.push(data);
                        _this.MessageUpdates.next(_this.MessageUpdates.getValue());
                    }
                    // console.log('wappNewMessages', this.MessageUpdates.getValue());
                    _this.MessageUnreadCount.next(_this.MessageUnreadCount.getValue() + 1);
                    if (data && data.attachment) {
                        console.log('NExting Attachments : ', data);
                        if (_this.Attachmentupdates.getValue()[eventkey] && _this.Attachmentupdates.getValue()[eventkey].attachments) {
                            _this.Attachmentupdates.getValue()[eventkey].attachments.push(data);
                            _this.Attachmentupdates.next(_this.Attachmentupdates.getValue());
                        }
                        else {
                            _this.Attachmentupdates.getValue()[eventkey] = {};
                            _this.Attachmentupdates.getValue()[eventkey].attachments = [];
                            _this.Attachmentupdates.getValue()[eventkey].attachments.push(data);
                            _this.Attachmentupdates.next(_this.Attachmentupdates.getValue());
                        }
                    }
                });
                /**
                 * @data
                 * 1.custumerNo
                 * 2.messageID
                 * 3.status
                 */
                _this.socket.on('wappUpdateMsgStatus', function (data) {
                    // console.log(data);
                    var eventkey = data.customerNo;
                    if (_this.MessageStatusUpdates.getValue()[eventkey]) {
                        _this.MessageStatusUpdates.getValue()[eventkey][data.messageID] = data.status;
                    }
                    else {
                        _this.MessageStatusUpdates.getValue()[eventkey] = {};
                        _this.MessageStatusUpdates.getValue()[eventkey][data.messageID] = data.status;
                    }
                    _this.MessageStatusUpdates.next(_this.MessageStatusUpdates.getValue());
                });
                /**
                 * @data
                 * 1.messagesRecieved
                 * 2.ended
                 * 3.customerNo
                 */
                _this.socket.on('wappOldMessaages', function (data) {
                    console.log('wappOldMessaages :', data);
                    var eventkey = data.customerNo;
                    if (_this.ContactOldMessagesReadCount.getValue()[eventkey]) {
                        _this.ContactOldMessagesReadCount.getValue()[eventkey].OldMessagesCount += data.OldMessagesCount;
                        _this.ContactOldMessagesReadCount.getValue()[eventkey].ended += data.ended;
                    }
                    else {
                        _this.ContactOldMessagesReadCount.getValue()[eventkey] = {};
                        _this.ContactOldMessagesReadCount.getValue()[eventkey] = data;
                    }
                    _this.ContactOldMessagesReadCount.next(_this.ContactOldMessagesReadCount.getValue());
                });
            }
        });
    }
    WhatsAppService.prototype.Noaccess = function () {
        this._appStateService.canAccessPageNotFound.next(true);
        this._appStateService.NavigateTo('/noaccess');
    };
    WhatsAppService.prototype.AddContact = function (contact) {
        var _this = this;
        contact.email = this.customEmail.getValue();
        return new Observable_1.Observable(function (observer) {
            _this.http.post(_this.ServiceURL + '/add_contact', { contact: contact }, { withCredentials: true }).subscribe(function (res) {
                if (res.status == 200) {
                    _this.ContactList.next(__spreadArrays([res.json().contact], _this.ContactList.getValue()));
                    observer.next(res.json().status);
                    observer.complete();
                }
                else if (res.status == 203) {
                    observer.next(res.json().status);
                    observer.complete();
                }
                else {
                    observer.error(res.json().status);
                    observer.complete();
                }
            }, function (err) {
                observer.error(err);
                observer.complete();
            });
        });
    };
    WhatsAppService.prototype.EditContact = function (contact) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.http.post(_this.ServiceURL + '/edit_contact', { contact: contact }, { withCredentials: true }).subscribe(function (res) {
                if (res.status == 200) {
                    _this.ContactList.next(_this.ContactList.getValue().map(function (oldContact) {
                        if (oldContact._id == contact._id) {
                            // console.log('Updating Contact : ', contact);
                            oldContact = JSON.parse(JSON.stringify(contact));
                        }
                        return oldContact;
                    }));
                    observer.next(res.json().status);
                    observer.complete();
                }
                else {
                    observer.error(res.json().status);
                    observer.complete();
                }
            }, function (err) {
                observer.error(err);
                observer.complete();
            });
        });
    };
    WhatsAppService.prototype.FetchContactByPhoneNumber = function (customerNo, email) {
        var _this = this;
        this.fetchingRequest[customerNo] = true;
        this.http.post(this.ServiceURL + '/get_contact_single', { email: email, customerNo: customerNo }, { withCredentials: true }).subscribe(function (res) {
            if (res.status == 200) {
                if (res.json().contact.length)
                    _this.ContactList.next(__spreadArrays(res.json().contact, _this.ContactList.getValue()));
            }
            delete _this.fetchingRequest[customerNo];
        }, function (err) {
            delete _this.fetchingRequest[customerNo];
        });
    };
    WhatsAppService.prototype.FetchWithSearch = function (value) {
        var _this = this;
        // console.log('Searching');
        this.http.post(this.ServiceURL + '/search_contacts', { value: value, email: this.customEmail.getValue() }, { withCredentials: true }).subscribe(function (res) {
            if (res.status == 200) {
                _this.SearchList.next(res.json().contacts);
            }
            _this.__Searching.next(false);
        }, function (err) {
            // Do Something
            _this.SearchList.next([]);
            _this.__Searching.next(false);
        });
    };
    WhatsAppService.prototype.FetchContacts = function () {
        var _this = this;
        this.FetchingContacts.next(true);
        this.http.post(this.ServiceURL + '/get_contacts', { email: this.customEmail.getValue() }, { withCredentials: true }).subscribe(function (res) {
            _this.FetchingContacts.next(false);
            if (res.status == 200) {
                _this.ContactList.next(res.json().contacts);
                if (res.json().contacts.length < 20) {
                    _this.synced.next(true);
                }
            }
            if (!_this.Initialized.getValue())
                _this.Initialized.next(true);
        }, function (err) {
            _this.ContactList.next([]);
            if (!_this.Initialized.getValue())
                _this.Initialized.next(true);
        });
    };
    WhatsAppService.prototype.FetchMoreContacts = function (lastTouchedTime) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            if (!_this.synced.getValue()) {
                _this.http.post(_this.ServiceURL + '/get_more_contacts', { email: _this.customEmail.getValue(), lastTouchedTime: lastTouchedTime }, { withCredentials: true }).subscribe(function (res) {
                    observer.next({ satus: 'ok' });
                    observer.complete();
                    if (res.status == 200) {
                        _this.ContactList.next(__spreadArrays(_this.ContactList.getValue(), res.json().contacts));
                        if (res.json().contacts.length < 20) {
                            _this.synced.next(true);
                        }
                    }
                }, function (err) {
                    observer.error(err);
                    observer.complete();
                });
            }
            else {
                observer.next({ satus: 'ok' });
                observer.complete();
            }
        });
    };
    WhatsAppService.prototype.CheckAuth = function (email) {
        var _this = this;
        this.http.post(this.ServiceURL + '/validate', { email: email }, { withCredentials: true }).subscribe(function (res) {
            if (res.status == 200) {
                _this.customEmail.next(res.json().email);
                _this.FetchContacts();
                _this.authChecked.next(true);
                _this._appStateService.canAccessWhatsApp.next(true);
                _this.canAccessWhatsApp.next(true);
                _this.GetCount();
            }
            else {
                _this.authChecked.next(true);
                _this._appStateService.canAccessWhatsApp.next(false);
                _this.canAccessWhatsApp.next(false);
            }
        }, function (err) {
            _this.authChecked.next(true);
            _this._appStateService.canAccessWhatsApp.next(false);
            _this.canAccessWhatsApp.next(false);
        });
    };
    WhatsAppService.prototype.ReSendMessage = function (msg, contactID) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            var sentTime = msg.sentTime;
            _this.http.post(_this.ServiceURL + '/resend_message', { message: msg }, { withCredentials: true }).subscribe(function (res) {
                if (res.status == 200) {
                    _this.ContactList.next(_this.ContactList.getValue().map(function (contact) {
                        if (contact._id == contactID) {
                            msg.status = 'sent';
                            msg.sentTime = sentTime;
                            msg._id = res.json().id;
                            contact.lastTouchedTime = new Date().toISOString();
                            contact.messages = __spreadArrays(contact.messages, [msg]);
                            contact.tempMessages = contact.tempMessages.filter(function (tempMsg) { return tempMsg.sentTime != sentTime; });
                            // console.log('msgID', msg._id);
                            // console.log(contact.tempMessages);
                            // console.log(contact.messages);
                            if (_this.SelectedContact.getValue()._id == contactID)
                                _this.SelectedContact.next(contact);
                        }
                        return contact;
                    }));
                    // console.log(this.SelectedContact.getValue());
                    // console.log(res.json());
                    observer.next({ status: 'ok' });
                    observer.complete();
                }
            }, function (err) {
                _this.ContactList.next(_this.ContactList.getValue().map(function (contact) {
                    if (contact._id == contactID) {
                        msg.status = 'failed';
                        if (_this.SelectedContact.getValue()._id == contactID)
                            _this.SelectedContact.next(contact);
                    }
                    return contact;
                }));
                observer.error({ status: 'error', error: err });
                observer.complete();
            });
        });
    };
    WhatsAppService.prototype.SendMessage = function (msg, contactID) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            var sentTime = msg.sentTime;
            var currentContact = JSON.parse(JSON.stringify(_this.SelectedContact.getValue()));
            var found = false;
            _this.http.post(_this.ServiceURL + '/send_message', { message: msg }, { withCredentials: true }).subscribe(function (res) {
                if (res.status == 200) {
                    var result = _this.ContactList.getValue().map(function (contact) {
                        if (contact._id == contactID) {
                            found = true;
                            msg.autoScroll = true;
                            msg.status = 'sent';
                            msg.sentTime = sentTime;
                            msg._id = res.json().id;
                            contact.lastTouchedTime = new Date().toISOString();
                            contact.messages = __spreadArrays(contact.messages, [msg]);
                            contact.tempMessages = contact.tempMessages.filter(function (tempMsg) { return tempMsg.sentTime != sentTime; });
                            // console.log('msgID', msg._id);
                            // console.log(contact.tempMessages);
                            // console.log(contact.messages);
                            if (_this.SelectedContact.getValue()._id == contactID)
                                _this.SelectedContact.next(contact);
                        }
                        return contact;
                    });
                    if (found) {
                        _this.ContactList.next(result);
                    }
                    if (!found) {
                        // console.log('not found');
                        msg.autoScroll = true;
                        msg.status = 'sent';
                        msg.sentTime = sentTime;
                        msg._id = res.json().id;
                        currentContact.lastTouchedTime = new Date().toISOString();
                        currentContact.messages = __spreadArrays(currentContact.messages, [msg]);
                        currentContact.tempMessages = currentContact.tempMessages.filter(function (tempMsg) { return tempMsg.sentTime != sentTime; });
                        _this.ContactList.getValue().unshift(currentContact);
                        _this.ContactList.next(_this.ContactList.getValue());
                        if (_this.SelectedContact.getValue()._id == contactID)
                            _this.SelectedContact.next(currentContact);
                    }
                    observer.next({ status: 'ok' });
                    observer.complete();
                }
            }, function (err) {
                var result = _this.ContactList.getValue().map(function (contact) {
                    if (contact._id == contactID) {
                        found = true;
                        contact.lastTouchedTime = new Date().toISOString();
                        contact.tempMessages = contact.tempMessages.map(function (tempMsg) { if (tempMsg.sentTime == sentTime)
                            tempMsg.status = 'failed'; return tempMsg; });
                        // contact.messages = [...contact.messages, ...[msg]];
                        // contact.tempMessages = contact.tempMessages.filter(tempMsg => { return tempMsg.sentTime != sentTime });
                        // console.log(contact.messages);
                        if (_this.SelectedContact.getValue()._id == contactID)
                            _this.SelectedContact.next(contact);
                    }
                    return contact;
                });
                if (found)
                    _this.ContactList.next(result);
                if (!found) {
                    currentContact.lastTouchedTime = new Date().toISOString();
                    currentContact.tempMessages = currentContact.tempMessages.map(function (tempMsg) { if (tempMsg.sentTime == sentTime)
                        tempMsg.status = 'failed'; return tempMsg; });
                    // contact.messages = [...contact.messages, ...[msg]];
                    // contact.tempMessages = contact.tempMessages.filter(tempMsg => { return tempMsg.sentTime != sentTime });
                    // console.log(contact.messages);
                    _this.ContactList.getValue().unshift(currentContact);
                    _this.ContactList.next(__spreadArrays([[currentContact]], _this.ContactList.getValue()));
                    if (_this.SelectedContact.getValue()._id == contactID)
                        _this.SelectedContact.next(currentContact);
                }
                observer.error({ status: 'error', error: err });
                observer.complete();
            });
        });
    };
    WhatsAppService.prototype.GetAttchments = function (event) {
        var _this = this;
        if (this.attachmentsRequest[event._id + event.type])
            return;
        else {
            this.attachmentsRequest[event._id] = true;
            this.http.post(this.ServiceURL + '/get_attachments', { contactID: event._id, mimetype: event.type }, { withCredentials: true }).subscribe(function (res) {
                // console.log(res.json().msgs);
                if (res.status == 200) {
                    var foundInContactList_1 = false;
                    _this.ContactList.next(_this.ContactList.getValue().map(function (contact) {
                        if (contact._id == event._id) {
                            foundInContactList_1 = true;
                            if (!contact.attachments)
                                contact.attachments = [];
                            switch (event.type) {
                                case '1':
                                case '2':
                                case '3':
                                    contact.attachments.media = res.json().attachments;
                                    break;
                                default:
                                    contact.attachments.files = res.json().attachments;
                                    break;
                            }
                            if (_this.SelectedContact.getValue()._id == event._id)
                                _this.SelectedContact.next(contact);
                        }
                        return contact;
                    }));
                    _this.SearchList.next(_this.SearchList.getValue().map(function (contact) {
                        if (contact._id == event._id) {
                            if (!contact.attachments)
                                contact.attachments = [];
                            switch (event.type) {
                                case '1':
                                case '2':
                                case '3':
                                    contact.attachments.media = res.json().attachments;
                                    break;
                                default:
                                    contact.attachments.files = res.json().attachments;
                                    break;
                            }
                            if (!foundInContactList_1)
                                if (_this.SelectedContact.getValue()._id == event._id)
                                    _this.SelectedContact.next(contact);
                        }
                        return contact;
                    }));
                }
                delete _this.attachmentsRequest[event._id + event.type];
            }, function (err) {
                //Do Something
                delete _this.attachmentsRequest[event._id + event.type];
            });
        }
    };
    WhatsAppService.prototype.CancelUpload = function (sentTime) {
        var _this = this;
        if (this.currentUploads[sentTime] && !this.currentUploads[sentTime].closed) {
            this.currentUploads[sentTime].unsubscribe();
        }
        if (this.SelectedContact.getValue()) {
            this.ContactList.next(this.ContactList.getValue().map(function (contact) {
                if (contact._id == _this.SelectedContact.getValue()._id) {
                    contact.tempMessages = contact.tempMessages.filter(function (tempMsg) { return tempMsg.sentTime != sentTime; });
                    _this.SelectedContact.next(contact);
                }
                return contact;
            }));
        }
    };
    WhatsAppService.prototype.UploadAttachmnt = function (msg, contactID, selectedContact) {
        var _this = this;
        /**
         * @Note
         * 1. keeping Current Contact copy to avoid Reference issue in selected Contact when contact was selected from search and uploaded the file
         */
        var currentContact = JSON.parse(JSON.stringify(selectedContact));
        // console.log('Current Contact Upload Attachm,ent', currentContact)
        this.currentUploads[msg.sentTime] = this._uploadingService.UploadAttachmentWithProgress(msg.params).subscribe(function (event) {
            if (event.type == http_1.HttpEventType.UploadProgress) {
                // console.log("upload progress", Math.round((event.loaded / event.total) * 100));
                /**
                 * @Note
                 * Updating By Reference
                 */
                msg.progress = Math.round((event.loaded / event.total) * 100);
            }
            if (event.type == http_1.HttpEventType.Response) {
                if ((event.status == 201) && (event.statusText == 'Created')) {
                    _this._uploadingService.parseXML(event.body.toString()).subscribe(function (json) {
                        msg.textMessage = json.response.PostResponse.Location[0];
                        msg.mediaURL = json.response.PostResponse.Location[0];
                        msg.progress = 100;
                        _this.currentUploads[msg.sentTime].unsubscribe();
                        delete _this.currentUploads[msg.sentTime];
                        delete msg.params;
                        delete msg.autoScroll;
                        delete msg.hold;
                        _this.SendAttachment(msg, contactID, currentContact).subscribe(function (res) {
                        }, function (err) {
                            msg.errored = true;
                            msg.uploading = false;
                            msg.errorType = 'server-error';
                            console.log('Server Error : ', err);
                        });
                    }, function (err) {
                        msg.errored = true;
                        msg.uploading = false;
                        msg.errorType = 'xml-parse-error';
                        console.log('XML Parse Error : ', err);
                    });
                }
                else {
                    msg.errored = true;
                    msg.uploading = false;
                    msg.errorType = 'wrong-response-error';
                    console.log('Wrong Response Error : ', event.body);
                }
            }
        }, function (err) {
            msg.errored = true;
            msg.uploading = false;
            msg.errorType = 'upload-error';
            console.log('Upload Error : ', err);
        });
        // let multi = this.currentUploads[msg.sentTime].subscribe(res => { console.log('2nd Upload'); })
    };
    WhatsAppService.prototype.SendAttachment = function (msg, contactID, selectedContact) {
        var _this = this;
        // console.log('Sending attachment')
        return new Observable_1.Observable(function (observer) {
            msg.status = 'sending';
            /**
            * @Note
            * 1. keeping Current Contact copy to avoid Reference issue in selected Contact when contact was selected from search and uploaded the file
            */
            var currentContact = JSON.parse(JSON.stringify(selectedContact));
            var found = false;
            _this.http.post(_this.ServiceURL + '/send_message_attachment', { message: msg }, { withCredentials: true }).subscribe(function (res) {
                if (res.status == 200) {
                    var result = _this.ContactList.getValue().map(function (contact) {
                        if (contact._id == contactID) {
                            found = true;
                            msg.autoScroll = false;
                            msg.errored = false;
                            msg.uploading = false;
                            msg._id = res.json().id;
                            msg.status = 'sent';
                            contact.lastTouchedTime = new Date().toISOString();
                            contact.messages = __spreadArrays(contact.messages, [msg]);
                            contact.tempMessages = contact.tempMessages.filter(function (tempMsg) { return tempMsg.sentTime != msg.sentTime; });
                            if (!contact.attachments)
                                contact.attachments = [];
                            var obj = {
                                mimeType: msg.mediamimetype,
                                customEmail: msg.userId,
                                customerNo: msg.customerNo,
                                mediaURL: msg.mediaURL,
                                messageID: msg._id,
                                filename: msg.filename,
                                contactID: contactID,
                            };
                            switch (msg.mediamimetype) {
                                case '1':
                                case '2':
                                case '3':
                                    if (contact.attachments.media)
                                        contact.attachments.media.unshift(obj);
                                    contact.attachments.media = contact.attachments.media.splice(0, 10);
                                    break;
                                default:
                                    if (contact.attachments.files)
                                        contact.attachments.files.unshift(obj);
                                    break;
                            }
                            // console.log(contact.messages);
                            if (_this.SelectedContact.getValue()._id == contactID)
                                _this.SelectedContact.next(contact);
                        }
                        return contact;
                    });
                    if (found) {
                        _this.ContactList.next(result);
                    }
                    if (!found) {
                        msg.autoScroll = false;
                        msg.errored = false;
                        msg.uploading = false;
                        msg._id = res.json().id;
                        msg.status = 'sent';
                        currentContact.lastTouchedTime = new Date().toISOString();
                        currentContact.messages = __spreadArrays(currentContact.messages, [msg]);
                        currentContact.tempMessages = currentContact.tempMessages.filter(function (tempMsg) { return tempMsg.sentTime != msg.sentTime; });
                        if (!currentContact.attachments)
                            currentContact.attachments = [];
                        var obj = {
                            mimeType: msg.mediamimetype,
                            customEmail: msg.userId,
                            customerNo: msg.customerNo,
                            mediaURL: msg.mediaURL,
                            messageID: msg._id,
                            filename: msg.filename,
                            contactID: contactID,
                        };
                        switch (msg.mediamimetype) {
                            case '1':
                                if (currentContact.attachments.media)
                                    currentContact.attachments.media.push(obj);
                                break;
                            default:
                                if (currentContact.attachments.files)
                                    currentContact.attachments.files.push(obj);
                                break;
                        }
                        // console.log(contact.messages);
                        _this.ContactList.getValue().unshift(currentContact);
                        _this.ContactList.next(_this.ContactList.getValue());
                        if (_this.SelectedContact.getValue()._id == contactID)
                            _this.SelectedContact.next(currentContact);
                    }
                    // console.log(this.SelectedContact.getValue());
                    // console.log(res.json());
                    observer.next({ status: 'ok' });
                    observer.complete();
                }
            }, function (err) {
                // console.log('error in sending Atatchment');
                msg.errored = true;
                msg.status = 'failed';
                msg.errorType = 'server-error';
                _this.ContactList.getValue().map(function (contact) {
                    if (contact._id == currentContact._id) {
                        // console.log('found')
                        // console.log('Contact List : ', contact);
                        // console.log('Current Contact : ', currentContact);
                        found = true;
                    }
                    return contact;
                });
                if (!found) {
                    // console.log('Not Found ! : in sending Attachment');
                    // console.log('Before :',JSON.parse(JSON.stringify(this.ContactList.getValue())))
                    currentContact.lastTouchedTime = new Date().toISOString();
                    _this.ContactList.next(__spreadArrays([currentContact], _this.ContactList.getValue()));
                    if (_this.SelectedContact.getValue() && _this.SelectedContact.getValue()._id == currentContact._id)
                        _this.SelectedContact.next(currentContact);
                    // console.log('After :',JSON.parse(JSON.stringify(this.ContactList.getValue())))
                }
                // console.log('Errored :', msg.errored);
                observer.error({ status: 'error', error: err });
                observer.complete();
            });
        });
    };
    WhatsAppService.prototype.GetMoreMessages = function (lastMessageID, contactNnumber, contactID) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.http.post(_this.ServiceURL + '/get_more_messages', { customerNo: contactNnumber, email: _this.customEmail.getValue(), id: lastMessageID }, { withCredentials: true }).subscribe(function (res) {
                // console.log(res.json().msgs);
                observer.next({ status: 'ok' });
                observer.complete();
                var foundInContactList = false;
                if (res.status == 200) {
                    _this.ContactList.next(_this.ContactList.getValue().map(function (contact) {
                        if (contact._id == contactID) {
                            foundInContactList = true;
                            if (res.json().msgs && res.json().msgs.length < 20)
                                contact.synced = true;
                            contact.messages = __spreadArrays(res.json().msgs.reverse(), contact.messages);
                            if (_this.SelectedContact.getValue()._id == contactID)
                                _this.SelectedContact.next(contact);
                        }
                        return contact;
                    }));
                    _this.SearchList.next(_this.SearchList.getValue().map(function (contact) {
                        if (contact._id == contactID) {
                            if (res.json().msgs && res.json().msgs.length < 20)
                                contact.synced = true;
                            contact.messages = __spreadArrays(res.json().msgs.reverse(), contact.messages);
                            if (!foundInContactList)
                                if (_this.SelectedContact.getValue()._id == contactID)
                                    _this.SelectedContact.next(contact);
                        }
                        return contact;
                    }));
                    // console.log(this.SelectedContact.getValue());
                    // console.log(res.json());
                }
            }, function (err) {
                //Do Something
                observer.error(err);
                observer.complete();
            });
        });
    };
    WhatsAppService.prototype.GetOldMessages = function (contactNnumber, contactID, lastMessageID) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.http.post(_this.ServiceURL + '/get_old_messages', { customerNo: contactNnumber, email: _this.customEmail.getValue(), id: lastMessageID }, { withCredentials: true }).subscribe(function (res) {
                // console.log(res.json().msgs);
                observer.next({ status: 'ok' });
                observer.complete();
                if (res.status == 200) {
                    _this.ContactList.next(_this.ContactList.getValue().map(function (contact) {
                        if (contact._id == contactID) {
                            if (res.json().msgs && res.json().msgs.length < 20)
                                contact.synced = true;
                            contact.messages = __spreadArrays(res.json().msgs.reverse(), contact.messages);
                            contact.OldMessagesCount = 0;
                            if (_this.SelectedContact.getValue()._id == contactID)
                                _this.SelectedContact.next(contact);
                        }
                        return contact;
                    }));
                    // console.log(this.SelectedContact.getValue());
                    // console.log(res.json());
                }
            }, function (err) {
                //Do Something
                observer.error(err);
                observer.complete();
            });
        });
    };
    // ReloadMessages(customerNo, selectedContact) {
    //     let temp = JSON.parse(JSON.stringify(selectedContact));
    //     this.http.post(this.ServiceURL + '/get_messages', { customerNo: customerNo, email: this.customEmail.getValue() }, { withCredentials: true }).subscribe(res => {
    //         // console.log(res.json().msgs);
    //         if (res.status == 200) {
    //             this.ContactList.next(this.ContactList.getValue().map(contact => {
    //                 if (contact._id == temp._id) {
    //                     contact.fetchedOnce = true;
    //                     if (res.json().msgs && res.json().msgs.length < 20) contact.synced = true;
    //                     contact.messages = [...res.json().msgs.reverse()];
    //                     if (this.SelectedContact.getValue()._id == temp._id) this.SelectedContact.next(contact);
    //                 }
    //                 return contact;
    //             }));
    //             // console.log(this.SelectedContact.getValue());
    //             // console.log(res.json());
    //         }
    //     }, err => {
    //         //Do Something
    //     });
    // }
    WhatsAppService.prototype.SetSelectedContact = function (contactID, searchList) {
        var _this = this;
        if (searchList === void 0) { searchList = false; }
        var temp = undefined;
        if (this.SelectedContact.getValue() && this.SelectedContact.getValue()._id == contactID)
            return;
        if (!searchList) {
            this.ContactList.getValue().map(function (contact) {
                if (contact._id == contactID) {
                    if (!contact.messages)
                        contact.messages = [];
                    if (!contact.tempMessages)
                        contact.tempMessages = [];
                    if (!contact.synced)
                        contact.synced = false;
                    _this.SelectedContact.next(contact);
                    temp = JSON.parse(JSON.stringify(contact));
                }
            });
            if (temp && this.SelectedContact.getValue() && temp._id == this.SelectedContact.getValue()._id && !this.SelectedContact.getValue().fetchedOnce && !this.SelectedContact.getValue().synced) {
                this.http.post(this.ServiceURL + '/get_messages', { customerNo: temp.customerNo, email: this.customEmail.getValue(), ended: this.SelectedContact.getValue().ended }, { withCredentials: true }).subscribe(function (res) {
                    // console.log(res.json().msgs);
                    if (res.status == 200) {
                        _this.ContactList.next(_this.ContactList.getValue().map(function (contact) {
                            if (contact._id == temp._id) {
                                contact.fetchedOnce = true;
                                if (res.json().msgs && res.json().msgs.length < 20)
                                    contact.synced = true;
                                contact.messages = __spreadArrays(res.json().msgs.reverse());
                                if (_this.SelectedContact.getValue()._id == temp._id)
                                    _this.SelectedContact.next(contact);
                            }
                            return contact;
                        }));
                        // console.log(this.SelectedContact.getValue());
                        // console.log(res.json());
                    }
                }, function (err) {
                    //Do Something
                });
            }
        }
        else {
            // console.log('From Search List');
            var found_1 = false;
            this.ContactList.getValue().map(function (contact) {
                if (contact._id == contactID) {
                    found_1 = true;
                    if (!contact.messages)
                        contact.messages = [];
                    if (!contact.tempMessages)
                        contact.tempMessages = [];
                    if (!contact.synced)
                        contact.synced = false;
                }
            });
            this.SearchList.getValue().map(function (contact) {
                if (contact._id == contactID) {
                    if (!contact.messages)
                        contact.messages = [];
                    if (!contact.tempMessages)
                        contact.tempMessages = [];
                    if (!contact.synced)
                        contact.synced = false;
                    _this.SelectedContact.next(contact);
                    temp = JSON.parse(JSON.stringify(contact));
                }
            });
            if (temp && this.SelectedContact.getValue() && temp._id == this.SelectedContact.getValue()._id && !this.SelectedContact.getValue().fetchedOnce && !this.SelectedContact.getValue().synced) {
                this.http.post(this.ServiceURL + '/get_messages', { customerNo: temp.customerNo, email: this.customEmail.getValue() }, { withCredentials: true }).subscribe(function (res) {
                    // console.log(res.json().msgs);
                    if (res.status == 200) {
                        _this.SearchList.next(_this.SearchList.getValue().map(function (contact) {
                            if (contact._id == temp._id) {
                                contact.fetchedOnce = true;
                                if (res.json().msgs && res.json().msgs.length < 20)
                                    contact.synced = true;
                                contact.messages = __spreadArrays(res.json().msgs.reverse());
                                if (!found_1)
                                    if (_this.SelectedContact.getValue()._id == temp._id)
                                        _this.SelectedContact.next(contact);
                            }
                            return contact;
                        }));
                        if (found_1) {
                            _this.ContactList.next(_this.ContactList.getValue().map(function (contact) {
                                if (contact._id == temp._id) {
                                    contact.fetchedOnce = true;
                                    if (res.json().msgs && res.json().msgs.length < 20)
                                        contact.synced = true;
                                    contact.messages = __spreadArrays(res.json().msgs.reverse());
                                    if (_this.SelectedContact.getValue()._id == temp._id)
                                        _this.SelectedContact.next(contact);
                                }
                                return contact;
                            }));
                        }
                        // console.log(this.SelectedContact.getValue());
                        // console.log(res.json());
                    }
                }, function (err) {
                    //Do Something
                });
            }
        }
    };
    WhatsAppService.prototype.UnsetReadCount = function (contactID) {
        var _this = this;
        if (!this.settingUnreadCount[contactID]) {
            this.http.post(this.ServiceURL + '/msg_unread_count', { contactID: contactID }, { withCredentials: true }).subscribe(function (res) {
                // console.log(res.json().msgs);
                if (res.status == 200) {
                    _this.ContactList.next(_this.ContactList.getValue().map(function (contact) {
                        if (contact._id == contactID) {
                            contact.unreadCount = contact.unreadCount - res.json().count;
                            _this.MessageUnreadCount.next((_this.MessageUnreadCount.getValue() - res.json().count));
                            if (_this.SelectedContact.getValue()._id == contactID)
                                _this.SelectedContact.next(contact);
                        }
                        return contact;
                    }));
                    // console.log(this.SelectedContact.getValue());
                    // console.log(res.json());
                    delete _this.settingUnreadCount[contactID];
                }
            }, function (err) {
                //Do Something
                delete _this.settingUnreadCount[contactID];
            });
        }
    };
    WhatsAppService.prototype.GetCount = function () {
        var _this = this;
        this.http.post(this.ServiceURL + '/get_unread_count', { email: this.customEmail.getValue() }, { withCredentials: true }).subscribe(function (res) {
            if (res.status == 200) {
                _this.MessageUnreadCount.next(res.json().count);
            }
        }, function (err) {
            // this.MessageUnreadCount.next(0)
        });
    };
    WhatsAppService.prototype.Destroy = function () {
        this.subscriptions.map(function (subscription) { subscription.unsubscribe(); });
    };
    WhatsAppService = __decorate([
        core_1.Injectable()
    ], WhatsAppService);
    return WhatsAppService;
}());
exports.WhatsAppService = WhatsAppService;
//# sourceMappingURL=WhatsAppService.js.map