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
exports.WhatsappComponent = void 0;
var core_1 = require("@angular/core");
var Observable_1 = require("rxjs/Observable");
var RecordRTC = require('recordrtc');
var WhatsappComponent = /** @class */ (function () {
    function WhatsappComponent(_whatsAppService, _uploadingService, _utilityService) {
        // this.subscriptions.push(this._whatsAppService.canAccessWhatsApp.subscribe(data => {
        //   // console.log('Wshats app component', data);
        //   if (this._whatsAppService.authChecked.getValue()) {
        //     // console.log('Auth Checked', this._whatsAppService.authChecked.getValue());
        //     if (data) this.displayReady = true;
        //     else this._whatsAppService.Noaccess();
        //   }
        var _this = this;
        this._whatsAppService = _whatsAppService;
        this._uploadingService = _uploadingService;
        this._utilityService = _utilityService;
        this.subscriptions = [];
        this.displayReady = false;
        this.contactList = [];
        this.searchList = [];
        this.tempSearchValue = '';
        this.selectedContact = undefined;
        this.customEmail = '';
        this.fetching = false;
        this.fetchingMessages = false;
        this.autoScroll = true;
        this.shiftdown = false;
        this.msgBody = '';
        this.uploading = false;
        this.attachmentGallery = [];
        this.uploadingCount = 0;
        this.files = [];
        this.fileValid = true;
        this.ShowAttachmentAreaDnd = false;
        this.loadingContacts = false;
        this._Searching = false;
        this.initialized = false;
        this.audioStarted = false;
        this.mins = 0;
        this.seconds = 0;
        this.updatedContact = undefined;
        // }));
        this.subscriptions.push(this._whatsAppService.customEmail.subscribe(function (email) { _this.customEmail = email; }));
        this.subscriptions.push(this._whatsAppService.SearchList.subscribe(function (searchList) {
            // console.log('List Updated :', contactsList.length);
            _this.searchList = searchList.sort(function (a, b) {
                return (new Date(a.lastTouchedTime).getTime() - new Date(b.lastTouchedTime).getTime() > 0) ? -1 : 1;
            });
        }));
        this.subscriptions.push(this._whatsAppService.SelectedContact.subscribe(function (selectedContact) {
            _this.selectedContact = selectedContact;
            if (_this.selectedContact && selectedContact._id != _this.selectedContact && _this.audioStarted) {
                _this.CancelRecording();
            }
        }));
        this.subscriptions.push(this._whatsAppService.FetchingContacts.subscribe(function (data) {
            _this.loadingContacts = data;
        }));
        this.subscriptions.push(this._whatsAppService.__Searching.subscribe(function (value) {
            _this._Searching = value;
        }));
    }
    WhatsappComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.subscriptions.push(this._whatsAppService.canAccessWhatsApp.subscribe(function (data) {
            // console.log('Wshats app component', data);
            if (_this._whatsAppService.authChecked.getValue()) {
                // console.log('Auth Checked', this._whatsAppService.authChecked.getValue());
                if (data)
                    _this.displayReady = true;
                else
                    _this._whatsAppService.Noaccess();
            }
        }));
        this.subscriptions.push(this._whatsAppService.ContactList.auditTime(1000).subscribe(function (contactsList) {
            if (_this._whatsAppService.Initialized.getValue()) {
                _this.contactList = contactsList.sort(function (a, b) {
                    return ((Date.parse(new Date(a.lastTouchedTime).toISOString()) - Date.parse(new Date(b.lastTouchedTime).toISOString())) > 0) ? -1 : 1;
                });
                // console.log('ContacList Sorted : ', this._whatsAppService.Initialized.getValue());
                _this.initialized = true;
            }
        }));
        // this.subscriptions.push(this._whatsAppService.Initialized.subscribe(data => {
        //   console.log('Initiazlied : ', data);
        //   this.initialized = data;
        // }))
    };
    WhatsappComponent.prototype.ngOnDestroy = function () {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.subscriptions.map(function (subscription) { subscription.unsubscribe(); });
    };
    WhatsappComponent.prototype.SearchContact = function (event) {
        // console.log(event)
        this._whatsAppService.SearchValue.next(event);
        this.tempSearchValue = event.toString();
        if (event.toString())
            this._whatsAppService.__Searching.next(true);
        else
            this._whatsAppService.__Searching.next(false);
    };
    WhatsappComponent.prototype.Focused = function (event) {
        if (this.selectedContact && this.selectedContact.unreadCount) {
            this._whatsAppService.UnsetReadCount(this.selectedContact._id);
        }
    };
    WhatsappComponent.prototype.SetSelectedContact = function (event) {
        if (this.searchList && this.tempSearchValue)
            this._whatsAppService.SetSelectedContact(event.contactID, true);
        else
            this._whatsAppService.SetSelectedContact(event.contactID);
    };
    WhatsappComponent.prototype.GetMoreContacts = function (event) {
        var _this = this;
        if (!this.fetching && event.lastTouchedTime) {
            this.fetching = true;
            this._whatsAppService.FetchMoreContacts(event.lastTouchedTime).subscribe(function (res) {
                _this.fetching = false;
            }, function (err) {
                _this.fetching = false;
            });
        }
    };
    WhatsappComponent.prototype.GetMoreMessages = function (event) {
        var _this = this;
        // console.log('Getting MOre Messages : ', event);
        if (this.fetchingMessages || this.selectedContact.synced)
            return;
        this.fetchingMessages = true;
        this._whatsAppService.GetMoreMessages(event.lastMessageID, this.selectedContact.customerNo, this.selectedContact._id).subscribe(function (res) {
            setTimeout(function () {
                _this.fetchingMessages = false;
            }, 500);
        }, function (err) {
            _this.fetchingMessages = false;
        });
    };
    WhatsappComponent.prototype.keyup = function (event) {
        var _this = this;
        switch (event.key.toLowerCase()) {
            case 'enter':
                {
                    if (this.shiftdown) {
                        event.preventDefault();
                    }
                    else {
                        this.SendMessage(this.msgBody);
                    }
                    break;
                }
            case 'shift':
                {
                    setTimeout(function () {
                        _this.shiftdown = false;
                    }, 100);
                    break;
                }
        }
    };
    WhatsappComponent.prototype.keydown = function (event) {
        switch (event.key.toLowerCase()) {
            case 'shift':
                this.shiftdown = true;
                break;
            case 'enter':
                if (!this.msgBody && !this.shiftdown) {
                    event.preventDefault();
                }
                else if (!this.shiftdown)
                    return false;
                break;
        }
    };
    WhatsappComponent.prototype.EditContact = function (event) {
        var _this = this;
        // console.log(event);
        this._whatsAppService.EditContact(event).subscribe(function (res) {
            _this.updatedContact = event;
        }, function (err) {
            event.failed = true;
            _this.updatedContact = event;
        });
    };
    WhatsappComponent.prototype.SendMessage = function (textMessage) {
        var _this = this;
        if (this.files && this.files.length && !this.uploading) {
            this.uploadingCount = this.files.length;
            this.files.map(function (file) {
                _this.SendAttachmentWithProgress(file);
            });
            this.fileInput.nativeElement.value = '';
        }
        if (textMessage) {
            var msg = {
                userId: this.customEmail,
                conversationid: "",
                customerNo: this.selectedContact.customerNo,
                keyremotejid: "",
                textMessage: textMessage,
                timestamp: Date.parse(new Date().toISOString()),
                mediaURL: 0,
                mediamimetype: 0,
                mediawatype: 0,
                mediasize: 0,
                medianame: "",
                mediahash: 0,
                mediaduration: 0,
                latitude: "",
                sendcount: 1,
                longitude: "",
                receivedtimestamp: "",
                sendtimestamp: -1,
                receiptservertimestamp: "",
                receiptdevicetimestamp: -1,
                quotedrowid: 0,
                editversion: "",
                mediaenchash: 0,
                forwarded: 0,
                key_from_me: '1',
                agentName: this._whatsAppService.Agent.nickname,
                status: 'sending',
                sentTime: Date.parse(new Date().toISOString()),
                contactID: this.selectedContact._id
            };
            this._whatsAppService.SendMessage(JSON.parse(JSON.stringify(msg)), this.selectedContact._id).subscribe(function (res) {
            }, function (err) {
                //Do Something
            });
            this.msgBody = '';
            msg.autoScroll = true;
            if (this.selectedContact.tempMessages && this.selectedContact.tempMessages.length)
                this.selectedContact.tempMessages = __spreadArrays(this.selectedContact.tempMessages, [msg]);
            else
                this.selectedContact.tempMessages = [msg];
        }
    };
    WhatsappComponent.prototype.ReSendMessage = function (msg) {
        if (msg.textMessage) {
            this._whatsAppService.ReSendMessage(msg, this.selectedContact._id).subscribe(function (res) {
            }, function (err) {
                //Do Something
            });
        }
    };
    WhatsappComponent.prototype.readURL = function (files) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.attachmentGallery = [];
            _this._uploadingService.readURL(files).subscribe(function (data) {
                ////console.log('readURL')
                if (data) {
                    _this.attachmentGallery = data;
                    observer.next({ status: 'ok' });
                    observer.complete();
                }
            });
        });
    };
    WhatsappComponent.prototype.FileSelected = function (event) {
        var _this = this;
        this.ShowAttachmentAreaDnd = false;
        // this.fileValid = true;
        for (var i = 0; i < this.fileInput.nativeElement.files.length; i++) {
            if (this.fileInput.nativeElement.files.length > 0) {
                this.files.push(this.fileInput.nativeElement.files[i]);
                // this.files = this.files.concat(this.fileInput.nativeElement.files[i]);
            }
        }
        this.readURL(this.files).subscribe(function (response) {
            if (response.status == 'ok') {
                _this.ShowAttachmentAreaDnd = true;
                //	if (!this.uploading) this._chatService.setDraftFiles(this.currentConversation._id, this.files, this.currentConversation.arrToDialog);
            }
        });
    };
    WhatsappComponent.prototype.ReloadMessages = function () {
        var _this = this;
        this.fetchingMessages = true;
        this._whatsAppService.GetOldMessages(this.selectedContact.customerNo, this.selectedContact._id).subscribe(function (res) {
            setTimeout(function () {
                _this.fetchingMessages = false;
            }, 500);
        }, function (err) {
            _this.fetchingMessages = false;
        });
    };
    WhatsappComponent.prototype.onClear = function (event) {
        if (event.clearAll) {
            if (this.fileInput)
                this.fileInput.nativeElement.value = '';
            this.ShowAttachmentAreaDnd = false;
            this.uploading = false;
            this.fileValid = false;
            this.files = [];
        }
        else if (event.fileToRemove) {
            var index = this.files.findIndex(function (w) { return w.name == event.fileToRemove.name; });
            if (index != -1) {
                this.files.splice(index, 1);
            }
        }
    };
    WhatsappComponent.prototype.__CancelUpload = function (sentTime) {
        //cancel from service
        /**
         * sentTime : number
         */
        // console.log('Cancel WhatsApp Componene');
        this._whatsAppService.CancelUpload(sentTime);
    };
    WhatsappComponent.prototype.__ResendAttachment = function (event) {
        // console.log('__Resend :', event)
        switch (event.errorType) {
            case 'server-error':
                event.msg.errored = false;
                event.msg.errorType = '';
                this._whatsAppService.SendAttachment(event.msg, this.selectedContact._id, this.selectedContact).subscribe(function (res) {
                }, function (err) {
                });
                break;
            default:
                event.msg.errored = false;
                event.msg.uploading = true;
                event.msg.errorType = '';
                event.msg.progress = 0;
                this._whatsAppService.UploadAttachmnt(event.msg, this.selectedContact._id, this.selectedContact);
                break;
            // case 'xml-parse-error':
            // case 'wrong-response-error':
            // case 'upload-error':
            //   break;
        }
    };
    WhatsappComponent.prototype.SendAttachmentWithProgress = function (file) {
        var _this = this;
        // console.log('Sending Attachment : ', file);
        var galleryIndex = this.attachmentGallery.findIndex(function (w) { return w.name == file.name; });
        if (galleryIndex != -1) {
            if (this.attachmentGallery[galleryIndex] && this.attachmentGallery[galleryIndex].uploading)
                return;
            else
                this.attachmentGallery[galleryIndex].uploading = true;
        }
        this._uploadingService.GenerateLinksForFilesNew(file, 'SendAttachMent').subscribe(function (response) {
            // console.log('Attachment Response :', response.params.file.name);
            if (response) {
                _this.uploadingCount = _this.uploadingCount - 1;
                if (_this.uploadingCount == 0) {
                    _this.uploading = false;
                }
                if (!response.error) {
                    var msg = {
                        userId: _this.customEmail,
                        conversationid: "",
                        customerNo: _this.selectedContact.customerNo,
                        keyremotejid: "",
                        textMessage: "",
                        timestamp: Date.parse(new Date().toISOString()),
                        mediaURL: response.path,
                        mediamimetype: _this._utilityService.GetMediaType(response.params.file.name),
                        mediawatype: 0,
                        mediasize: 0,
                        medianame: "",
                        mediahash: 0,
                        mediaduration: 0,
                        latitude: "",
                        sendcount: 1,
                        longitude: "",
                        receivedtimestamp: "",
                        sendtimestamp: -1,
                        receiptservertimestamp: "",
                        receiptdevicetimestamp: -1,
                        quotedrowid: 0,
                        editversion: "",
                        mediaenchash: 0,
                        forwarded: 0,
                        key_from_me: '1',
                        agentName: _this._whatsAppService.Agent.nickname,
                        attachment: true,
                        filename: response.params.file.name,
                        errored: false,
                        errorType: '',
                        uploading: false,
                        progress: 0,
                        sentTime: Date.parse(new Date().toISOString()),
                        params: response.params,
                    };
                    // console.log((this.selectedContact.tempMessages && this.selectedContact.tempMessages.length));
                    msg.autoScroll = true;
                    if (_this.selectedContact.tempMessages && _this.selectedContact.tempMessages.length)
                        _this.selectedContact.tempMessages = __spreadArrays(_this.selectedContact.tempMessages, [msg]);
                    else
                        _this.selectedContact.tempMessages = [msg];
                    _this._whatsAppService.UploadAttachmnt(msg, _this.selectedContact._id, _this.selectedContact);
                    // console.log(this.selectedContact.tempMessages);
                    var galleryIndex_1 = _this.attachmentGallery.findIndex(function (w) { return w.name == file.name; });
                    if (galleryIndex_1 != -1) {
                        _this.attachmentGallery[galleryIndex_1].uploading = false;
                        _this.attachmentGallery.splice(galleryIndex_1, 1);
                    }
                    var fileIndex = _this.files.findIndex(function (w) { return w.name == file.name; });
                    if (fileIndex != -1)
                        _this.files.splice(fileIndex, 1);
                }
                else {
                    file.error = true;
                    var ind_1 = _this.attachmentGallery.findIndex(function (w) { return w.name == file.name; });
                    if (ind_1 != -1) {
                        _this.attachmentGallery[ind_1].uploading = false;
                        _this._uploadingService.ShowAttachmentError(response.error).subscribe(function (value) {
                            _this.attachmentGallery[ind_1].error = value;
                        });
                    }
                }
            }
        }, function (err) {
            var ind = _this.attachmentGallery.findIndex(function (w) { return w.name == file.name; });
            if (ind != -1) {
                _this.attachmentGallery[ind].uploading = false;
                _this.attachmentGallery[ind].error = 'error in uploading';
            }
        });
    };
    WhatsappComponent.prototype.GetAttachments = function (event) {
        // console.log('Getting Attachments sEmit', event);
        this._whatsAppService.GetAttchments(event);
    };
    /**
     * @Voice_Note_Work
     */
    WhatsappComponent.prototype.StartRecording = function () {
        var _this = this;
        navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(function (stream) {
            _this.mediaStream = stream;
            _this.recordRTC = RecordRTC(stream, {
                type: 'audio'
            });
            _this.recordRTC.startRecording();
            _this.audioStarted = true;
            _this.recordingInterval = setInterval(function () {
                _this.seconds++;
                if (_this.seconds == 60) {
                    _this.mins += 1;
                    _this.SendRecording();
                    clearInterval(_this.recordingInterval);
                }
            }, 1000);
        }).catch(function (err) { });
    };
    WhatsappComponent.prototype.CancelRecording = function () {
        var _this = this;
        this.seconds = 0;
        this.mins = 0;
        this.recordRTC.stopRecording(function () {
            _this.audioStarted = false;
            _this.mediaStream.getTracks()[0].stop();
            clearInterval(_this.recordingInterval);
        });
    };
    WhatsappComponent.prototype.SendRecording = function () {
        var _this = this;
        this.seconds = 0;
        this.mins = 0;
        this.recordRTC.stopRecording(function () {
            clearInterval(_this.recordingInterval);
            _this.audioStarted = false;
            _this._uploadingService.getSeekableBlob(_this.recordRTC.getBlob(), function (blob) {
                // console.log('Blob : ', blob);
                var file = new File([blob], ('stream' + Date.parse(new Date().toISOString()) + '.webm'), { type: 'audio/webm' });
                // console.log('file : ', file);
                // console.log('Stingified file : ', JSON.parse(JSON.stringify(file)));
                // console.log(URL.createObjectURL(blob));
                _this.SendAttachmentWithProgress(new File([file], file.name));
                _this.mediaStream.getTracks()[0].stop();
            });
        });
    };
    __decorate([
        core_1.ViewChild('fileInput')
    ], WhatsappComponent.prototype, "fileInput", void 0);
    WhatsappComponent = __decorate([
        core_1.Component({
            selector: 'app-whatsapp',
            templateUrl: './whatsapp.component.html',
            styleUrls: ['./whatsapp.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], WhatsappComponent);
    return WhatsappComponent;
}());
exports.WhatsappComponent = WhatsappComponent;
//# sourceMappingURL=whatsapp.component.js.map