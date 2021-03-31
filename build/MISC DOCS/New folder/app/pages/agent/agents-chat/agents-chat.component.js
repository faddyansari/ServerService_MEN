"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentsChatComponent = void 0;
var core_1 = require("@angular/core");
var Subject_1 = require("rxjs/Subject");
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/operator/switchMap");
var RecordRTC = require('recordrtc');
var AgentsChatComponent = /** @class */ (function () {
    function AgentsChatComponent(_appStateService, _agentService, _authService, _uploadingService, dialog, snackBar) {
        var _this = this;
        this._appStateService = _appStateService;
        this._agentService = _agentService;
        this._uploadingService = _uploadingService;
        this.dialog = dialog;
        this.snackBar = snackBar;
        this.CheckViewChange = new Subject_1.Subject();
        this.subscription = [];
        this.attachmentGallery = [];
        this.files = [];
        this.ShowAttachmentAreaDnd = false;
        this.isDragged = false;
        this.autoscroll = true;
        this.msgBody = '';
        this.uploading = false;
        this.scrollHeight = 0;
        this.scrollTop = 10;
        this.fileValid = true;
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
        this.fetchedNewMessages = false;
        this.EmojiWrapper = false;
        this.seconds = 0;
        this.mins = 0;
        this.recordingStarted = false;
        this.isAudioSent = false;
        this.loading = false;
        this.restrictAutoSize = true;
        this.fileSharePermission = true;
        this.subscription.push(_authService.getAgent().subscribe(function (agent) {
            _this.agent = agent;
        }));
        this.subscription.push(_agentService.selectedAgentConversation.subscribe(function (agentConversation) {
            if (Object.keys(agentConversation).length) {
                _this.selectedAgentConversation = agentConversation;
                if (agentConversation && agentConversation.length) {
                    _this.agentLastSeen = _this.selectedAgentConversation.LastSeen.filter(function (obj) { return obj.id == (agentConversation.to == _this.agent.email) ? agentConversation.from : agentConversation.to; })[0].DateTime;
                }
            }
            if (agentConversation && agentConversation.hasOwnProperty('_id')) {
                _this.restrictAutoSize = false;
            }
        }));
        this.subscription.push(_agentService.isSelfViewingChat.subscribe(function (data) {
            _this.isSelfViewingChat = data;
        }));
        this.subscription.push(_agentService.ShowAttachmentAreaDnd.subscribe(function (data) {
            _this.ShowAttachmentAreaDnd = data;
        }));
        this.subscription.push(this.CheckViewChange.debounceTime(100).subscribe(function (data) {
            // console.log('Check View change');
            if (_this.ScrollContainer.nativeElement.scrollHeight != _this.scrollHeight) {
                _this.scrollHeight = _this.ScrollContainer.nativeElement.scrollHeight;
                if (_this.autoscroll) {
                    _this.scrollToBottom();
                }
            }
        }));
        // this.onMessageInput
        //     .map(event => event)
        //     .debounceTime(1000)
        //     .switchMap(() => {
        //         // console.log("Paused!");
        //         if (!this.msgBody.length) {
        //             return new Observable((observer) => {
        //                 observer.complete();
        //             });
        //         }
        //     }).subscribe();
    }
    AgentsChatComponent.prototype.scrollToBottom = function () {
        // console.log(this.autoscroll);
        if (!this.autoscroll) {
            return;
        }
        try {
            // console.log('Scroll to bottom');
            this.ScrollContainer.nativeElement.scrollTop = this.ScrollContainer.nativeElement.scrollHeight;
        }
        catch (err) { }
    };
    AgentsChatComponent.prototype.OpenViewHistory = function () {
        this._agentService.closeDetail.next(true);
    };
    AgentsChatComponent.prototype.ScrollbarChanged = function (event) {
        var _this = this;
        // this.scrollTop = this.ScrollContainer.nativeElement.scrollTop;
        if ((event.target.scrollTop + event.target.clientHeight) >= this.ScrollContainer.nativeElement.scrollHeight) {
            if (this.autoscroll != true) {
                this.autoscroll = true;
            }
        }
        else if (this.ScrollContainer.nativeElement.scrollTop <= 0 && this.ScrollContainer.nativeElement.scrollHeight > 0) {
            this.fetchedNewMessages = true;
            var oldScrollHeight_1 = event.target.scrollHeight;
            this.subscription.push(this._agentService.GetMoreMessages(this.selectedAgentConversation._id, this.selectedAgentConversation.messages[0]._id, (this.agent.email) ? this.agent.email : '').subscribe(function (data) {
                setTimeout(function () {
                    _this.ScrollContainer.nativeElement.scrollTop = _this.ScrollContainer.nativeElement.scrollHeight - oldScrollHeight_1;
                }, 0);
            }));
        }
        else {
            this.autoscroll = false;
        }
        // this.scrollHeight = this.ScrollContainer.nativeElement.scrollHeight;
    };
    AgentsChatComponent.prototype.ngOnInit = function () {
    };
    AgentsChatComponent.prototype.ngAfterViewInit = function () {
        this.scrollToBottom();
    };
    AgentsChatComponent.prototype.ngAfterViewChecked = function () {
        this.CheckViewChange.next(true);
    };
    AgentsChatComponent.prototype.ngOnDestroy = function () {
        // Called once, before the instance is destroyed.
        // Add 'implements OnDestroy' to the class.
        this.subscription.forEach(function (subscription) {
            subscription.unsubscribe();
        });
        this._appStateService.CloseControlSideBar();
    };
    //DRAG AND DROP FUNCTIONS
    AgentsChatComponent.prototype.OnDragOver = function (event) {
        // if (event.dataTransfer.items.length > 1) return false;
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        this.isDragged = true;
    };
    AgentsChatComponent.prototype.onDragLeave = function (event) {
        // if (event.dataTransfer.items.length > 1) return false;
        this.isDragged = false;
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
    };
    AgentsChatComponent.prototype.onDrop = function (event) {
        var _this = this;
        // if (event.dataTransfer.items.length > 1) return false;
        event.preventDefault();
        // event.stopPropagation();
        event.stopImmediatePropagation();
        this.isDragged = false;
        this._agentService.ShowAttachmentAreaDnd.next(false);
        this.fileValid = true;
        if (event.dataTransfer.items) {
            for (var i = 0; i < event.dataTransfer.items.length; i++) {
                if (event.dataTransfer.items[i].kind === "file") {
                    var file = event.dataTransfer.items[i].getAsFile();
                    this.files = this.files.concat(file);
                }
            }
        }
        this.readURL(this.files).subscribe(function (response) {
            if (response.status == 'ok') {
            }
        });
        setTimeout(function () {
            _this._agentService.ShowAttachmentAreaDnd.next(true);
        }, 0);
        // this._agentService.setDraft(this.selectedAgentConversation._id, this.files,this.arrToDialog);
    };
    AgentsChatComponent.prototype.onClear = function (event) {
        if (event.clearAll) {
            this.fileInput.nativeElement.value = '';
            this._agentService.ShowAttachmentAreaDnd.next(false);
            this.uploading = false;
            this.fileValid = false;
            this.files = [];
        }
        else {
            var index = this.files.findIndex(function (w) { return w.name == event.fileToRemove.name; });
            if (index != -1) {
                this.files.splice(index, 1);
            }
        }
    };
    AgentsChatComponent.prototype.keydown = function (event) {
        if (event.key == 'Enter' && event.shiftKey) {
        }
        else if (event.key == 'Enter' && !event.shiftKey) {
            this.SendMessage(event);
            return false;
        }
    };
    AgentsChatComponent.prototype.SendMessageSingleAttach = function (file) {
        var _this = this;
        // console.log('Sending file...' + file.name);
        var galleryIndex = this.attachmentGallery.findIndex(function (w) { return w.name == file.name; });
        if (galleryIndex != -1) {
            this.attachmentGallery[galleryIndex].uploading = true;
        }
        this._uploadingService.GenerateLinksForFiles(file, 'SendAttachMent').subscribe(function (response) {
            if (response) {
                if (!response.error) {
                    var message = {
                        to: (_this.selectedAgentConversation.type == 'single') ? _this.selectedAgentConversation.members.filter(function (m) { return m.email != _this.agent.email; }).map(function (a) { return a.email; }) : [],
                        from: _this.agent.email,
                        replyto: [],
                        type: 'Agents',
                        viewColor: _this.selectedAgentConversation.members.filter(function (m) { return m.email == _this.agent.email; })[0].viewColor,
                        body: [response],
                        cid: _this.selectedAgentConversation._id,
                        attachment: true
                    };
                    _this._agentService.SendMessageToAgent(message);
                    // this.uploading = false;
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
            // console.log("file not sent", err);
            var ind = _this.attachmentGallery.findIndex(function (w) { return w.name == file.name; });
            if (ind != -1) {
                _this.attachmentGallery[ind].uploading = false;
                _this.attachmentGallery[ind].error = 'error in uploading';
            }
        });
    };
    AgentsChatComponent.prototype.SendMessage = function (event) {
        // if (event.which == 1) {
        //     let ev = new KeyboardEvent("keydown", {
        var _this = this;
        //         shiftKey: false,
        //         bubbles: true,
        //         cancelable: false,
        //         code: "Enter",
        //         composed: true,
        //         key: "Enter",
        //         view: window,
        //     });
        //     let result = (this.messageTextArea.nativeElement as HTMLElement).dispatchEvent(ev);
        //     this.keydown((ev as KeyboardEvent));
        //     setTimeout(() => {
        //         result = (this.messageTextArea.nativeElement as HTMLElement).dispatchEvent(ev);
        //         this.messageTextArea.nativeElement.focus();
        //     }, 0);
        // }
        if (this.files && this.files.length && !this.uploading) {
            // this.uploading = true;
            this.files.map(function (file) {
                _this.SendMessageSingleAttach(file);
            });
            this.fileInput.nativeElement.value = '';
            this.msgBody = '';
        }
        else {
            if (this.msgBody.trim()) {
                var message = {
                    to: (this.selectedAgentConversation.type == 'single') ? this.selectedAgentConversation.members.filter(function (m) { return m.email != _this.agent.email; }).map(function (a) { return a.email; }) : [],
                    from: this.agent.email,
                    replyto: [],
                    type: 'Agents',
                    viewColor: this.selectedAgentConversation.members.filter(function (m) { return m.email == _this.agent.email; })[0].viewColor,
                    body: this.msgBody.trim(),
                    cid: this.selectedAgentConversation._id,
                    date: new Date().toISOString()
                };
                this._agentService.SendMessageToAgent(message);
                this.msgBody = '';
            }
            this.autoscroll = true;
            this.scrollToBottom();
        }
    };
    AgentsChatComponent.prototype.ClearFile = function () {
        this.files = [];
        this.fileInput.nativeElement.value = '';
    };
    AgentsChatComponent.prototype.FileSelected = function (event) {
        var _this = this;
        this._agentService.ShowAttachmentAreaDnd.next(false);
        this.files = this.files.filter(function (f) { return !f.error; });
        // this.fileInput.nativeElement.files = this.fileInput.nativeElement.files.filter(f => !f.hasOwnProperty('error'));
        for (var i = 0; i < this.fileInput.nativeElement.files.length; i++) {
            this.files.push(this.fileInput.nativeElement.files[i]);
        }
        this.readURL(this.files).subscribe(function (response) {
            if (response.status == 'ok') {
                _this._agentService.ShowAttachmentAreaDnd.next(true);
            }
        });
    };
    AgentsChatComponent.prototype.readURL = function (files) {
        // console.log(files);
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.attachmentGallery = [];
            if (files && files.length) {
                files.map(function (file) {
                    var picReader = new FileReader();
                    _this.attachmentGallery = [];
                    picReader.addEventListener("load", function (event) {
                        _this.imagetarget = event.target.result;
                        var obj = { url: _this.imagetarget, name: file.name, uploading: false, error: '' };
                        _this.attachmentGallery.push(obj);
                        observer.next({ status: 'ok' });
                        observer.complete();
                    });
                    picReader.readAsDataURL(file);
                });
            }
        });
    };
    //VoiceNotes
    AgentsChatComponent.prototype.startRecording = function () {
        var _this = this;
        this.isAudioSent = false;
        this.recordingStarted = true;
        navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(function (stream) {
            _this.mediaStream = stream;
            _this.recordRTC = RecordRTC(stream, {
                type: 'audio'
            });
            // console.log('Start Recording');
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
    AgentsChatComponent.prototype.cancelRecording = function () {
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
    AgentsChatComponent.prototype.stopWithTimeout = function () {
        var _this = this;
        if (!this.isAudioSent) {
            this.seconds = 0;
            this.mins = 0;
            this.recordingStarted = false;
            this.loading = true;
            this.recordRTC.stopRecording(function () {
                // let recording = this.recordRTC.getBlob();
                _this._uploadingService.getSeekableBlob(_this.recordRTC.getBlob(), function (blob) {
                    _this.recordedFile = new File([blob], ('stream' + new Date().getTime() + '.mp3'), { type: 'audio/webm' });
                    clearInterval(_this.recordingInterval);
                });
            });
        }
    };
    AgentsChatComponent.prototype.stopRecording = function () {
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
                                            to: (_this.selectedAgentConversation.type == 'single') ? _this.selectedAgentConversation.members.filter(function (m) { return m.email != _this.agent.email; }).map(function (a) { return a.email; }) : [],
                                            from: _this.agent.email,
                                            replyto: [],
                                            type: 'Agents',
                                            viewColor: _this.selectedAgentConversation.members.filter(function (m) { return m.email == _this.agent.email; })[0].viewColor,
                                            body: [{ filename: file.name, path: json.response.PostResponse.Location[0] }],
                                            cid: _this.selectedAgentConversation._id,
                                            attachment: true,
                                            filename: file.name
                                        };
                                        _this._agentService.SendMessageToAgent(message);
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
                // let recording  = this.recordRTC.getBlob();             
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
                                to: (_this.selectedAgentConversation.type == 'single') ? _this.selectedAgentConversation.members.filter(function (m) { return m.email != _this.agent.email; }).map(function (a) { return a.email; }) : [],
                                from: _this.agent.email,
                                replyto: [],
                                type: 'Agents',
                                viewColor: _this.selectedAgentConversation.members.filter(function (m) { return m.email == _this.agent.email; })[0].viewColor,
                                body: json.response.PostResponse.Location[0],
                                cid: _this.selectedAgentConversation._id,
                                attachment: true,
                                filename: _this.recordedFile.name
                            };
                            _this._agentService.SendMessageToAgent(message);
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
        // console.log('Stop Recording');
    };
    AgentsChatComponent.prototype.displayMessageArea = function () {
        var _this = this;
        if (this.selectedAgentConversation && this.selectedAgentConversation.members.filter(function (m) { return m.email == _this.agent.email; }).length) {
            return true;
        }
        else {
            return false;
        }
    };
    AgentsChatComponent.prototype.Emoji = function ($event) {
        console.log($event);
        this.msgBody += $event;
        this.EmojiWrapper = false;
    };
    __decorate([
        core_1.ViewChild('fileInput')
    ], AgentsChatComponent.prototype, "fileInput", void 0);
    __decorate([
        core_1.ViewChild('scrollContainer')
    ], AgentsChatComponent.prototype, "ScrollContainer", void 0);
    __decorate([
        core_1.ViewChild('messageTextArea')
    ], AgentsChatComponent.prototype, "messageTextArea", void 0);
    AgentsChatComponent = __decorate([
        core_1.Component({
            selector: 'app-agents-chat',
            templateUrl: './agents-chat.component.html',
            styleUrls: ['./agents-chat.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None,
        })
    ], AgentsChatComponent);
    return AgentsChatComponent;
}());
exports.AgentsChatComponent = AgentsChatComponent;
//# sourceMappingURL=agents-chat.component.js.map