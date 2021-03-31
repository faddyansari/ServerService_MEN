"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactChatComponent = void 0;
var core_1 = require("@angular/core");
var Subject_1 = require("rxjs/Subject");
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/operator/switchMap");
var RecordRTC = require('recordrtc');
var ContactChatComponent = /** @class */ (function () {
    function ContactChatComponent(_contactService, _authService, _uploadingService) {
        var _this = this;
        this._contactService = _contactService;
        this._authService = _authService;
        this._uploadingService = _uploadingService;
        this.CheckViewChange = new Subject_1.Subject();
        this.autoscroll = false;
        this.subscriptions = [];
        this.fileValid = true;
        this.automatedMessagesList = [];
        this.filteredAutomatedMessages = [];
        this.fileUploadParams = {
            key: '',
            acl: '',
            success_action_status: '',
            policy: '',
            "x-amz-algorithm": '',
            "x-amz-credintials": '',
            "x-amz-date": '',
            "x-amz-signature": ''
        };
        this.shiftdown = false;
        this.hashQuery = '';
        this.hashIndex = -1;
        this.msgBody = '';
        this.file = undefined;
        this.scrollHeight = 0;
        this.scrollTop = 10;
        this.fetchedNewMessages = false;
        this.fileSharePermission = true;
        this.uploading = false;
        this.EmojiWrapper = false;
        this.seconds = 0;
        this.mins = 0;
        this.recordingStarted = false;
        this.isAudioSent = false;
        this.loading = false;
        this.loadingConversation = false;
        this.showContactInfo = false;
        this.onMessageInput = new Subject_1.Subject();
        this.typingState = true;
        this.subscriptions.push(_authService.getAgent().subscribe(function (data) {
            _this.agent = data;
        }));
        this.subscriptions.push(_contactService.selectedThread.subscribe(function (data) {
            if (data) {
                _this.selectedThread = data;
            }
        }));
        this.subscriptions.push(_contactService.selectedContact.subscribe(function (data) {
            if (data) {
                _this.selectedContact = data;
                // console.log(this.selectedContact);
            }
        }));
        this.subscriptions.push(_contactService.loadingConversation.subscribe(function (data) {
            _this.loadingConversation = data;
        }));
        this.subscriptions.push(_contactService.showContactInfo.subscribe(function (data) {
            _this.showContactInfo = data;
        }));
        this.subscriptions.push(_contactService.isSelfViewingChat.subscribe(function (data) {
            _this.isSelfViewingChat = data;
        }));
        this.subscriptions.push(this.CheckViewChange.debounceTime(100).subscribe(function (data) {
            if (_this.ScrollContainer.nativeElement.scrollHeight != _this.scrollHeight) {
                _this.scrollHeight = _this.ScrollContainer.nativeElement.scrollHeight;
                if (_this.autoscroll) {
                    _this.scrollToBottom();
                }
            }
        }));
        this.onMessageInput
            .map(function (event) { return event; })
            .debounceTime(1000)
            .switchMap(function () {
            // console.log("Paused!");
            return new Observable_1.Observable(function (observer) {
                _this._contactService.PausedTyping(_this.selectedThread._id.toString(), (_this.selectedThread.to == _this.agent.email) ? _this.selectedThread.from : _this.selectedThread.to, _this.agent.email);
                _this.typingState = true;
                observer.complete();
            });
        }).subscribe();
    }
    ContactChatComponent.prototype.scrollToBottom = function () {
        if (this.autoscroll != true) {
            return;
        }
        try {
            this.ScrollContainer.nativeElement.scrollTop = this.ScrollContainer.nativeElement.scrollHeight;
        }
        catch (err) { }
    };
    ContactChatComponent.prototype.ScrollChanged = function (event) {
        this.scrollTop = this.ScrollContainer.nativeElement.scrollTop;
        if ((event.target.scrollTop + event.target.clientHeight) >= this.ScrollContainer.nativeElement.scrollHeight) {
            if (this.autoscroll != true) {
                this.autoscroll = true;
            }
        }
        else if (this.scrollTop <= 0 && this.ScrollContainer.nativeElement.scrollHeight > 0) {
            this.fetchedNewMessages = true;
            this._contactService.GetMoreMessages(this.selectedThread._id, this.selectedThread.messages[0]._id);
        }
        else {
            this.autoscroll = false;
        }
        this.scrollHeight = this.ScrollContainer.nativeElement.scrollHeight;
    };
    ContactChatComponent.prototype.ngOnInit = function () {
    };
    ContactChatComponent.prototype.ngAfterViewInit = function () {
        this.scrollToBottom();
    };
    ContactChatComponent.prototype.ngAfterViewChecked = function () {
        this.CheckViewChange.next(true);
        // if (this.scrollRef && this.scrollRef.view.scrollHeight != this.scrollHeight) {
        // 	if (this.fetchedNewMessages) {
        // 		this.scrollRef.scrollYTo(this.scrollRef.view.scrollHeight - this.scrollHeight, 10);
        // 		this.fetchedNewMessages = false;
        // 		this.scrollHeight = this.scrollRef.view.scrollHeight;
        // 	} else {
        // 		this.scrollHeight = this.scrollRef.view.scrollHeight;
        // 		this.scrollRef.scrollYTo(this.scrollHeight);
        // 	}
        // }
    };
    ContactChatComponent.prototype.filterInput = function (autocompleteString) {
        this.filteredAutomatedMessages = this.automatedMessagesList.filter(function (automatedMessage) {
            if (automatedMessage.hashTag.indexOf(autocompleteString) != -1 && autocompleteString) {
                return automatedMessage;
            }
        });
    };
    ContactChatComponent.prototype.clearinputFilter = function () {
        this.hashQuery = '';
        this.hashIndex = -1;
    };
    ContactChatComponent.prototype.setShift = function () {
        this.shiftdown = false;
        this.clearinputFilter();
    };
    ContactChatComponent.prototype.keydown = function (event) {
        switch (event.key.toLowerCase()) {
            case 'enter':
                if (!this.msgBody && !this.shiftdown) {
                    event.preventDefault();
                }
                break;
            case 'shift':
                this.shiftdown = true;
                break;
        }
    };
    ContactChatComponent.prototype.keyup = function (event) {
        var _this = this;
        // console.log('Typing State');
        if (this.typingState && this.msgBody.length && event.key.toLowerCase() != "control" && event.key.toLowerCase() != "backspace" && event.key.toLowerCase() != "shift") {
            // console.log('User is Typing...');
            this._contactService.StartedTyping(this.selectedThread._id.toString(), (this.selectedThread.to == this.agent.email) ? this.selectedThread.from : this.selectedThread.to, this.agent.email);
            this.typingState = false;
        }
        if (this.hashQuery) {
            switch (event.key.toLowerCase()) {
                case 'backspace':
                    {
                        if (this.msgBody.length <= this.hashIndex) {
                            this.clearinputFilter();
                        }
                        else {
                            this.hashQuery = this.hashQuery.substr(0, this.hashQuery.length - 1);
                        }
                        break;
                    }
                case 'arrowleft':
                case 'arrowright':
                case ' ':
                case 'enter':
                    {
                        if (this.shiftdown)
                            this.shiftdown = false;
                        this.clearinputFilter();
                        break;
                    }
            }
        }
        else {
            switch (event.key.toLowerCase()) {
                case 'enter':
                    {
                        if (this.shiftdown) {
                            event.preventDefault();
                        }
                        else {
                            this.SendMessage();
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
        }
        this.filterInput(this.hashQuery);
    };
    ContactChatComponent.prototype.keyPress = function (event) {
        if (event.key == '#') {
            this.hashQuery = '#';
            this.hashIndex = this.msgBody.length;
        }
        else if (this.hashQuery) {
            this.hashQuery += event.key;
        }
    };
    ContactChatComponent.prototype.SendMessage = function () {
        var _this = this;
        if (this.file && !this.uploading) {
            this.uploading = true;
            this._uploadingService.SignRequest(this.file, 'SendAttachMent').subscribe(function (response) {
                var params = JSON.parse(response.text());
                params.file = _this.file;
                _this._uploadingService.uploadAttachment(params).subscribe(function (s3response) {
                    // console.log(s3response.status);
                    if (s3response.status == '201') {
                        _this._uploadingService.parseXML(s3response.text()).subscribe(function (json) {
                            //console.log(json.response.PostResponse.Location[0])
                            var message = {
                                to: (_this.selectedThread.to == _this.agent.email) ? _this.selectedThread.from : _this.selectedThread.to,
                                from: _this.agent.email,
                                body: json.response.PostResponse.Location[0],
                                cid: _this.selectedThread._id,
                                attachment: true,
                                filename: _this.file.name
                            };
                            _this._contactService.SendMessageToContact(message);
                            _this.file = '';
                            _this.fileInput.nativeElement.value = '';
                            _this.msgBody = '';
                            _this.uploading = false;
                        }, function (err) {
                            _this.uploading = false;
                        });
                    }
                }, function (err) {
                    _this.uploading = false;
                });
            }, function (err) {
                _this.uploading = false;
                _this.fileValid = false;
                setTimeout(function () { return [
                    _this.fileValid = true
                ]; }, 3000);
                _this.ClearFile();
            });
        }
        else {
            if (this.msgBody.trim()) {
                var message = {
                    to: (this.selectedThread.to == this.agent.email) ? this.selectedThread.from : this.selectedThread.to,
                    from: this.agent.email,
                    body: this.msgBody.trim(),
                    cid: this.selectedThread._id
                };
                // console.log(message.date);
                this._contactService.SendMessageToContact(message);
                // this._contactService.SendMessageToContact(message, false);
                // this.selectedThread.messages.push(message);
                this.msgBody = '';
            }
            else {
                // this.msgBody = '';
            }
        }
    };
    ContactChatComponent.prototype.ClearFile = function () {
        this.file = undefined;
        this.fileInput.nativeElement.value = '';
    };
    ContactChatComponent.prototype.FileSelected = function (event) {
        var _this = this;
        this.fileValid = true;
        document.getElementsByName("message")[0].focus();
        if (event.target.files[0].type) {
            if (event.target.files.length > 0) {
                this.file = event.target.files[0];
                return;
            }
        }
        else {
            this.fileValid = false;
            this.ClearFile();
            setTimeout(function () { return [
                _this.fileValid = true
            ]; }, 3000);
        }
        this.file = undefined;
        return;
    };
    ContactChatComponent.prototype.startRecording = function () {
        var _this = this;
        this.isAudioSent = false;
        this.recordingStarted = true;
        navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(function (stream) {
            _this.mediaStream = stream;
            _this.recordRTC = RecordRTC(stream, {
                type: 'audio',
            });
            console.log('Start Recording');
            _this.recordRTC.startRecording();
            _this.recordingInterval = setInterval(function () {
                _this.seconds++;
                if (_this.seconds == 60) {
                    _this.mins += 1;
                    _this.stopWithTimeout();
                    clearInterval(_this.recordingInterval);
                }
            }, 1000);
        }).catch(function (err) {
            // console.log(err);
        });
    };
    ContactChatComponent.prototype.cancelRecording = function () {
        var _this = this;
        this.seconds = 0;
        this.mins = 0;
        this.recordingStarted = false;
        this.recordRTC.stopRecording(function () {
            _this.mediaStream.getTracks()[0].stop();
            _this.isAudioSent = false;
            clearInterval(_this.recordingInterval);
        });
    };
    ContactChatComponent.prototype.stopWithTimeout = function () {
        var _this = this;
        if (!this.isAudioSent) {
            this.seconds = 0;
            this.mins = 0;
            this.recordingStarted = false;
            this.loading = true;
            this.recordRTC.stopRecording(function () {
                _this._uploadingService.getSeekableBlob(_this.recordRTC.getBlob(), function (blob) {
                    _this.recordedFile = new File([blob], ('stream' + new Date().getTime() + '.mp3'), { type: 'audio/webm' });
                    clearInterval(_this.recordingInterval);
                });
            });
        }
    };
    ContactChatComponent.prototype.stopRecording = function () {
        var _this = this;
        if (!this.isAudioSent && !this.recordedFile) {
            this.seconds = 0;
            this.mins = 0;
            this.recordingStarted = false;
            this.loading = true;
            this.recordRTC.stopRecording(function () {
                _this._uploadingService.getSeekableBlob(_this.recordRTC.getBlob(), function (blob) {
                    var file = new File([blob], ('stream' + new Date().getTime() + '.mp3'), { type: 'audio/webm' });
                    if (file && !_this.uploading) {
                        _this.uploading = true;
                        _this._uploadingService.SignRequest(file, 'SendAttachMent').subscribe(function (response) {
                            var params = JSON.parse(response.text());
                            params.file = file;
                            _this._uploadingService.uploadAttachment(params).subscribe(function (s3response) {
                                if (s3response.status == '201') {
                                    _this._uploadingService.parseXML(s3response.text()).subscribe(function (json) {
                                        var message = {
                                            to: (_this.selectedThread.to == _this.agent.email) ? _this.selectedThread.from : _this.selectedThread.to,
                                            from: _this.agent.email,
                                            body: json.response.PostResponse.Location[0],
                                            cid: _this.selectedThread._id,
                                            attachment: true,
                                            filename: file.name
                                        };
                                        _this._contactService.SendMessageToContact(message);
                                        _this.fileInput.nativeElement.value = '';
                                        _this.uploading = false;
                                        _this.loading = false;
                                        _this.mediaStream.getTracks()[0].stop();
                                    }, function (err) {
                                        _this.uploading = false;
                                        _this.loading = false;
                                    });
                                }
                            }, function (err) {
                                _this.uploading = false;
                                _this.loading = false;
                            });
                        }, function (err) {
                            _this.uploading = false;
                            _this.loading = false;
                            _this.fileValid = false;
                            setTimeout(function () { return [
                                _this.fileValid = true
                            ]; }, 3000);
                        });
                    }
                    // saveAs(file, 'stream'+ new Date().getTime() + '.mp3');
                    _this.mediaStream.getTracks()[0].stop();
                    _this.isAudioSent = true;
                    clearInterval(_this.recordingInterval);
                });
            });
        }
        else if (this.recordedFile) {
            this.uploading = true;
            this._uploadingService.SignRequest(this.recordedFile, 'SendAttachMent').subscribe(function (response) {
                var params = JSON.parse(response.text());
                params.file = _this.recordedFile;
                _this._uploadingService.uploadAttachment(params).subscribe(function (s3response) {
                    if (s3response.status == '201') {
                        _this._uploadingService.parseXML(s3response.text()).subscribe(function (json) {
                            var message = {
                                to: (_this.selectedThread.to == _this.agent.email) ? _this.selectedThread.from : _this.selectedThread.to,
                                from: _this.agent.email,
                                body: json.response.PostResponse.Location[0],
                                cid: _this.selectedThread._id,
                                attachment: true,
                                filename: _this.recordedFile.name
                            };
                            _this._contactService.SendMessageToContact(message);
                            _this.recordedFile = undefined;
                            _this.fileInput.nativeElement.value = '';
                            _this.uploading = false;
                            _this.loading = false;
                            _this.mediaStream.getTracks()[0].stop();
                            _this.isAudioSent = true;
                            clearInterval(_this.recordingInterval);
                        }, function (err) {
                            _this.uploading = false;
                            _this.loading = false;
                        });
                    }
                }, function (err) {
                    _this.uploading = false;
                    _this.loading = false;
                });
            }, function (err) {
                _this.uploading = false;
                _this.loading = false;
                _this.fileValid = false;
                setTimeout(function () { return [
                    _this.fileValid = true
                ]; }, 3000);
            });
        }
        console.log('Stop Recording');
    };
    ContactChatComponent.prototype.ToggleInfo = function () {
        // this.showAgentInfo = !this.showAgentInfo;
        if (Object.keys(this.selectedThread).length) {
            this._contactService.showContactInfo.next(!this.showContactInfo);
        }
    };
    ContactChatComponent.prototype.Emoji = function ($event) {
        console.log($event);
        this.msgBody += $event;
        this.EmojiWrapper = false;
    };
    ContactChatComponent.prototype.setTypingState = function () {
    };
    __decorate([
        core_1.ViewChild('fileInput')
    ], ContactChatComponent.prototype, "fileInput", void 0);
    __decorate([
        core_1.ViewChild('scrollContainer')
    ], ContactChatComponent.prototype, "ScrollContainer", void 0);
    ContactChatComponent = __decorate([
        core_1.Component({
            selector: 'app-contact-chat',
            templateUrl: './contact-chat.component.html',
            styleUrls: ['./contact-chat.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], ContactChatComponent);
    return ContactChatComponent;
}());
exports.ContactChatComponent = ContactChatComponent;
//# sourceMappingURL=contact-chat.component.js.map