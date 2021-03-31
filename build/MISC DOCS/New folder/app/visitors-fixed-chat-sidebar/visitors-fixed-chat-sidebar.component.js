"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisitorsFixedChatSidebarComponent = void 0;
var core_1 = require("@angular/core");
var call_dialog_component_1 = require("../dialogs/call-dialog/call-dialog.component");
var Subject_1 = require("rxjs/Subject");
var Observable_1 = require("rxjs/Observable");
var RecordRTC = require('recordrtc');
var VisitorsFixedChatSidebarComponent = /** @class */ (function () {
    function VisitorsFixedChatSidebarComponent(_chatService, _applicationStateService, _authService, _adminSettingsService, dialog, snackBar, _uploadingService, _callingService) {
        var _this = this;
        this._chatService = _chatService;
        this._applicationStateService = _applicationStateService;
        this._authService = _authService;
        this._adminSettingsService = _adminSettingsService;
        this.dialog = dialog;
        this.snackBar = snackBar;
        this._uploadingService = _uploadingService;
        this._callingService = _callingService;
        this.subscriptions = [];
        this.currentConversation = {};
        this.chatList = [];
        this.links = [];
        this.nsp = '';
        this.automatedMessagesList = [];
        this.fileSharePermission = true;
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
        this.seconds = 0;
        this.mins = 0;
        this.recordingStarted = false;
        this.isAudioSent = false;
        this.filteredAutomatedMessages = [];
        this.ShowAttachmentAreaDnd = false;
        this.files = [];
        this.file = undefined;
        this.hashQuery = '';
        this.hashIndex = -1;
        this.shiftdown = false;
        this.ready = false;
        this.msgBody = '';
        this.uploading = false;
        this.arrToDialog = [];
        this.fileValid = true;
        this.count = 0;
        this.isDragged = false;
        this.loading = false;
        this.EmojiWrapper = false;
        this.drafts = [];
        this.CheckTypingState = new Subject_1.Subject();
        this.tempTypingState = false;
        this.actionForm = '';
        //textArea AutoComplete
        this.formHashQuery = false;
        this.tempMsgBody = '';
        this.hashQuerySelected = false;
        this.autoGrowSyncMsgBody = '';
        this.attachmentGallery = [];
        this.uploadingCount = 0;
        //for Canned Forms
        this.autoComplete = true;
        this.caretPosition = -1;
        this.subscriptions.push(this._chatService.AllConversations.subscribe(function (data) {
            _this.chatList = data;
        }));
        this.subscriptions.push(this._chatService.messageDrafts.subscribe(function (data) {
            _this.drafts = data;
        }));
        this.subscriptions.push(_chatService.ShowAttachmentAreaDnd.subscribe(function (data) {
            _this.ShowAttachmentAreaDnd = data;
        }));
        this.subscriptions.push(this._chatService.getCurrentConversation().subscribe(function (data) {
            if (Object.keys(data).length) {
                if (data && _this.currentConversation && (_this.currentConversation._id != data._id)) {
                    var draft = {
                        id: _this.currentConversation._id,
                        message: (_this.msgBody) ? _this.msgBody : ''
                    };
                    _this._chatService.SetDraft(draft);
                    _this._chatService.ShowAttachmentAreaDnd.next(false);
                    _this.files = [];
                    _this.arrToDialog = [];
                    _this.attachmentGallery = [];
                    _this.shiftdown = false;
                    if (_this.drafts.length) {
                        var draft_1 = _this.drafts.filter(function (d) { return d.id == data._id; });
                        if (draft_1 && draft_1.length) {
                            _this.msgBody = draft_1[0].message;
                        }
                        else
                            _this.msgBody = '';
                    }
                }
                _this.currentConversation = data;
                //}
                if (_this.currentConversation.state == 4) {
                    if (_this.currentConversation.feedback && _this.currentConversation.feedback.Q2 && !isNaN(_this.currentConversation.feedback.Q2)) {
                        _this.feedback = Array(parseInt(_this.currentConversation.feedback.Q2)).fill(1);
                    }
                }
                if (data && data.hasOwnProperty('_id')) {
                    //setTimeout(() => {
                    _this.restrictAutoSize = false;
                    // 	this._appStateService.selectingThread.next(false)
                    //}, 0);
                }
            }
            else
                _this.currentConversation = {};
        }));
        this.subscriptions.push(this._authService.getSettings().subscribe(function (data) {
            _this.automatedMessagesList = data.automatedMessages;
        }));
        this.subscriptions.push(this._authService.Agent.subscribe(function (data) {
            _this.agent = data;
            _this.nsp = data.nsp;
        }));
        this.subscriptions.push(this._chatService.GetSelectedVisitor().subscribe(function (selectedVisitor) {
            _this.selectedVisitor = selectedVisitor;
        }));
        this.subscriptions.push(this._adminSettingsService.getFileSharingSettings().subscribe(function (fileSharingSettings) {
            _this.fileSharePermission = fileSharingSettings;
        }));
        this.subscriptions.push(this._adminSettingsService.callSettings.subscribe(function (data) {
            _this.callSettings = data;
        }));
        this.subscriptions.push(this._authService.getSettings().subscribe(function (data) {
            if (data && data.permissions) {
                _this.chatPermissions = data.permissions.chats;
                _this.agentPermissions = data.permissions.agents;
            }
        }));
        this.subscriptions.push(this._chatService.tempTypingState.subscribe(function (data) {
            _this.tempTypingState = data;
        }));
        this.subscriptions.push(this.CheckTypingState.debounceTime(500).subscribe(function (data) {
            if (!_this.msgBody.trim()) {
                _this._chatService.SendTypingEventRest({ state: false, conversation: _this.currentConversation }).subscribe(function (data) {
                    _this._chatService.tempTypingState.next(false);
                });
            }
            else if (_this.msgBody.trim().length > 1 && !_this.tempTypingState) {
                _this._chatService.SendTypingEventRest({ state: true, conversation: _this.currentConversation }).subscribe(function (data) {
                    _this._chatService.tempTypingState.next(true);
                });
            }
            else {
                if (_this.msgBody.trim().length < 2 && !_this.tempTypingState) {
                    _this._chatService.SendTypingEventRest({ state: true, conversation: _this.currentConversation }).subscribe(function (data) {
                        _this._chatService.tempTypingState.next(true);
                    });
                }
            }
        }));
        this.subscriptions.push(this._chatService.CannedForms.subscribe(function (forms) {
            if (forms && forms.length) {
                _this.CannedForms = forms;
                _this.CannedForms.map(function (forms) {
                    if (forms.formName.indexOf('##') == -1)
                        forms.formName = '##' + forms.formName;
                    return forms;
                });
            }
        }));
    }
    VisitorsFixedChatSidebarComponent.prototype.ngOnInit = function () {
    };
    VisitorsFixedChatSidebarComponent.prototype.toggleChatBar = function () {
        this._applicationStateService.toggleChatBar();
    };
    VisitorsFixedChatSidebarComponent.prototype.setChatBar = function () {
        this._applicationStateService.setChatBar(true);
    };
    // filterInput(autocompleteString: string) {
    // 	this.filteredAutomatedMessages = this.automatedMessagesList.filter(automatedMessage => {
    // 		if (automatedMessage.hashTag.indexOf(autocompleteString) != -1 && autocompleteString) {
    // 			return automatedMessage;
    // 		}
    // 	})
    // }
    VisitorsFixedChatSidebarComponent.prototype.filterInput = function (autocompleteString) {
        this.filteredAutomatedMessages = this.automatedMessagesList.filter(function (automatedMessage) {
            if (automatedMessage.hashTag.toLowerCase().indexOf(autocompleteString) != -1 && autocompleteString) {
                return automatedMessage;
            }
        });
    };
    VisitorsFixedChatSidebarComponent.prototype.filterInput1 = function (autocompleteString) {
        if (this.formHashQuery) {
            // this.filteredAutomatedMessages = []
            this.filteredAutomatedMessages = this.CannedForms.filter(function (forms) {
                if (forms.formName.toLowerCase().indexOf(autocompleteString.toLowerCase()) != -1 && autocompleteString) {
                    return forms;
                }
            });
        }
        else {
            this.filteredAutomatedMessages = this.automatedMessagesList.filter(function (automatedMessage) {
                if (automatedMessage.hashTag.toLowerCase().indexOf(autocompleteString.toLowerCase()) != -1 && autocompleteString) {
                    return automatedMessage;
                }
            });
        }
    };
    VisitorsFixedChatSidebarComponent.prototype.clearinputFilter = function () {
        this.hashQuery = '';
        this.hashIndex = -1;
        this.caretPosition = -1;
    };
    //typingEvent
    VisitorsFixedChatSidebarComponent.prototype.TypingEvent = function (e) {
        this.CheckTypingState.next();
        this.tempMsgBody = this.msgBody;
    };
    VisitorsFixedChatSidebarComponent.prototype.setShift = function () {
        if (this.hashQuerySelected) {
            this.hashQuery = '';
            this.hashQuerySelected = false;
        }
    };
    VisitorsFixedChatSidebarComponent.prototype.keydown = function (event) {
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
    VisitorsFixedChatSidebarComponent.prototype.keydown1 = function (event) {
        switch (event.key.toLowerCase()) {
            case 'shift':
                this.shiftdown = true;
                break;
            case 'enter':
                if (this.actionForm && this.actionForm.length)
                    this.shiftdown = false;
                if (!this.msgBody && !this.shiftdown) {
                    event.preventDefault();
                }
                else if (this.msgBody && !this.shiftdown && !this.hashQuery && !this.hashQuerySelected) {
                    //console.log('Emptying Message');
                    this.autoGrowSyncMsgBody = this.msgBody;
                    this.msgBody = '';
                }
                break;
        }
    };
    VisitorsFixedChatSidebarComponent.prototype.keyup = function (event) {
        var _this = this;
        if (this.hashQuery) {
            switch (event.key.toLowerCase()) {
                case 'backspace':
                    {
                        if (this.autoComplete) {
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
                        event.target.selectionStart = this.caretPosition;
                        event.target.selectionEnd = this.caretPosition;
                        this.clearinputFilter();
                        break;
                    }
                default:
                    //////console.log('default 1');
                    event.target.focus();
                    break;
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
                            var id = this.currentConversation._id;
                            this._chatService.DeleteDraft(id);
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
    //for Canned Forms
    //for Canned Forms
    VisitorsFixedChatSidebarComponent.prototype.keyup1 = function (event) {
        var _this = this;
        if (this.hashQuery && !this.formHashQuery) {
            switch (event.key.toLowerCase()) {
                case 'backspace':
                    {
                        if (this.autoComplete) {
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
                        event.target.selectionStart = this.caretPosition;
                        event.target.selectionEnd = this.caretPosition;
                        this.clearinputFilter();
                        break;
                    }
                default:
                    //console.log('default 1');
                    event.target.focus();
                    break;
            }
        }
        else if (this.hashQuery && this.formHashQuery) {
            switch (event.key.toLowerCase()) {
                case 'backspace':
                    this.formHashQuery = false;
                    //this.shiftdown = false;
                    // if (this.autoComplete) {
                    // 	this.clearinputFilter();
                    // } else {
                    // this.hashQuery = this.hashQuery.substr(0, this.hashQuery.length - 1);
                    if (this.hashQuery == '##') {
                        this.hashQuery = this.hashQuery.substr(0, this.hashQuery.length - 1);
                        this.hashIndex = event.target.selectionStart - 1;
                    }
                    // }
                    break;
                case 'arrowleft':
                case 'arrowright':
                case ' ':
                case 'enter':
                    {
                        if (this.shiftdown)
                            this.shiftdown = false;
                        // (event.target as HTMLTextAreaElement).selectionStart = this.caretPosition;
                        // (event.target as HTMLTextAreaElement).selectionEnd = this.caretPosition;
                        this.clearinputFilter();
                        break;
                    }
                // case '#':
                // 	this.hashQuery = this.hashQuery.substr(0, this.hashQuery.length - 1);
                // 	//this.filterInput(this.hashQuery);
                // 	break;
            }
        }
        else {
            switch (event.key.toLowerCase()) {
                case 'enter':
                    {
                        if ((this.shiftdown || !this.autoGrowSyncMsgBody.trim()) && (this.actionForm && !this.actionForm.length)) {
                            event.preventDefault();
                        }
                        else {
                            this.SendMessage();
                            this._chatService.DeleteDraft(this.currentConversation._id);
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
                default:
                    break;
            }
        }
        if (this.hashQuerySelected) {
            this.hashQuery = '';
            this.hashQuerySelected = false;
        }
        this.filterInput(this.hashQuery);
    };
    // this.actionForm = this.CannedForms.filter(form => { return form.formName == event.source.value })
    // this.caretPosition = this.hashIndex;
    // if (this.actionForm && this.actionForm.length > 0) {
    // 	setTimeout(() => {
    // 		this.ShowAttachmentAreaDnd = true
    // 	}, 0);
    // }
    VisitorsFixedChatSidebarComponent.prototype.ItemSelected = function (event) {
        this.caretPosition = this.hashIndex + event.option.value.length;
        var hashQueryFilter = this.hashQuery.split('#')[1];
        this.msgBody = (event.option.value) ? this.tempMsgBody.slice(0, this.hashIndex) + event.option.value + this.tempMsgBody.slice(this.hashIndex + 1 + hashQueryFilter.length) : this.tempMsgBody.slice(0, this.hashIndex) + this.tempMsgBody.slice(this.hashIndex + 1 + hashQueryFilter.length);
        this.hashQuerySelected = true;
        if (this.shiftdown)
            this.shiftdown = false;
        this.filteredAutomatedMessages = [];
        this.formHashQuery = false;
    };
    VisitorsFixedChatSidebarComponent.prototype.ItemSelected1 = function (event) {
        if (this.formHashQuery && event.option.value) {
            var hashQueryFilter = this.hashQuery.split('##')[1];
            this.caretPosition = this.hashIndex - 1;
            this.msgBody = ((this.tempMsgBody) ? this.tempMsgBody.slice(0, this.hashIndex - 1) : '') + this.tempMsgBody.slice(this.hashIndex + 1 + hashQueryFilter.length);
            this.actionForm = this.CannedForms.filter(function (form) { return form.formName == event.option.value; });
            if (this.actionForm && this.actionForm.length > 0) {
                //this.ShowAttachmentAreaDnd = true
                this.hashQuerySelected = true;
                if (this.shiftdown)
                    this.shiftdown = false;
                this._chatService.ShowAttachmentAreaDnd.next(true);
                // setTimeout(() => {
                // 	this.hashQuery = ''
                // }, 500);
            }
        }
        else if (!this.formHashQuery) {
            this.caretPosition = this.hashIndex + event.option.value.length;
            var hashQueryFilter = this.hashQuery.split('#')[1];
            this.msgBody = (event.option.value) ? this.tempMsgBody.slice(0, this.hashIndex) + event.option.value + this.tempMsgBody.slice(this.hashIndex + 1 + hashQueryFilter.length) : this.tempMsgBody.slice(0, this.hashIndex) + this.tempMsgBody.slice(this.hashIndex + 1 + hashQueryFilter.length);
            //this.msgBody = this.tempMsgBody.slice(0, this.hashIndex) + event.option.value + this.tempMsgBody.slice(this.hashIndex + 1 + hashQueryFilter.length)
            this.hashQuerySelected = true;
            if (this.shiftdown)
                this.shiftdown = false;
            // setTimeout(() => {
            // 	this.hashQuery = ''
            // }, 500);
        }
        this.filteredAutomatedMessages = [];
        this.formHashQuery = false;
    };
    VisitorsFixedChatSidebarComponent.prototype.keyPress = function (event) {
        if (event.key == '#') {
            this.hashQuery = '#';
            this.hashIndex = event.target.selectionStart;
        }
        else if (this.hashQuery) {
            this.hashQuery += event.key;
        }
    };
    //for Canned Forms
    // autoComplete = true;
    // caretPosition = -1;
    VisitorsFixedChatSidebarComponent.prototype.keyPress1 = function (event) {
        if (event.key == '#') {
            if (this.hashQuery == '#') {
                this.formHashQuery = true;
                this.hashQuery = '##';
                this.hashIndex = event.target.selectionStart;
            }
            else if (this.hashQuery == '') {
                this.hashQuery = '#';
                this.hashIndex = event.target.selectionStart;
            }
            else {
                this.hashQuery += event.key;
            }
        }
        else if (this.hashQuery) {
            this.hashQuery += event.key;
        }
    };
    VisitorsFixedChatSidebarComponent.prototype.stopRecording = function () {
        var _this = this;
        if (!this.isAudioSent && !this.recordedFile) {
            this.seconds = 0;
            this.mins = 0;
            this.recordingStarted = false;
            this.loading = true;
            this.recordRTC.stopRecording(function () {
                // let recording = this.recordRTC.getBlob();
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
                                        _this._chatService.SendAttachment(_this.currentConversation.sessionid, {
                                            from: _this.agent.nickname,
                                            to: _this.currentConversation.sessionid,
                                            body: [{ filename: file.name, path: json.response.PostResponse.Location[0] }],
                                            cid: _this.currentConversation._id,
                                            attachment: true,
                                            filename: file.name
                                        }, file.name).subscribe(function (res) { }, function (err) { });
                                        _this.file = '';
                                        _this.fileInput.nativeElement.value = '';
                                        _this.uploading = false;
                                        _this.loading = false;
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
                            _this._chatService.SendAttachment(_this.currentConversation.sessionid, {
                                from: _this.agent.nickname,
                                to: _this.currentConversation.sessionid,
                                body: [{ filename: _this.recordedFile.name, path: json.response.PostResponse.Location[0] }],
                                cid: _this.currentConversation._id,
                                attachment: true,
                                filename: _this.recordedFile.name
                            }, _this.recordedFile.name).subscribe(function (res) { }, function (err) { });
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
    };
    //with draft
    // public SendMessage() {
    // 	if (this.files && this.files.length && !this.uploading) {
    // 		this.uploading = true;
    // 		let abc = this.files
    // 		this._uploadingService.GenerateLinks(abc, 'SendAttachMent').subscribe(response => {
    // 			//console.log(response);
    // 			let filesReadyToUpload = response.filter(file => {
    // 				return (!(file as Object).hasOwnProperty('error'))
    // 			});
    // 			this.file = [];
    // 			this.errorFile = response.filter(file => {
    // 				return ((file as Object).hasOwnProperty('error'))
    // 			});
    // 			if ((this.errorFile && this.errorFile.length)) {
    // 				this.errorFile.map(file => {
    // 					//console.log(file.error);
    // 					this._uploadingService.ShowAttachmentError(file.error).subscribe(fileerror => {
    // 						//console.log(fileerror);
    // 						file.error = fileerror
    // 						if (file.error) {
    // 							this.fileValid = false;
    // 							this.uploading = false;
    // 							this.fileInput.nativeElement.value = '';
    // 							this.ClearFile();
    // 						}
    // 					}, err => {
    // 						this.fileValid = false;
    // 						file.error = "Error in uploading..Please try again!"
    // 						this.uploading = false;
    // 					});
    // 					return file
    // 				});
    // 				//this.fileerror = true
    // 			}
    // 			//console.log(this.errorFile)
    // 			if (filesReadyToUpload && filesReadyToUpload.length) {
    // 				let attachment = filesReadyToUpload;
    // 				this._chatService.SendAttachment(this.currentConversation.sessionid, {
    // 					from: this.agent.nickname,
    // 					to: this.currentConversation.sessionid,
    // 					body: attachment,
    // 					cid: this.currentConversation._id,
    // 					attachment: true,
    // 					form: this.actionForm
    // 				}).subscribe(res => {
    // 					if (res.status == "ok") {
    // 						this.uploading = false;
    // 						this.currentConversation.arrToDialog = []
    // 						this.currentConversation.arrToDialog = []
    // 						this._chatService.setDraftFiles(this.currentConversation._id, [], [])
    // 						// filesReadyToUpload.forEach(x => {
    // 						// 	this.currentConversation.arrToDialog.splice(this.currentConversation.arrToDialog.findIndex(w => w.name == x.filename), 1);
    // 						// });
    // 					}
    // 				});
    // 				//console.log(this.currentConversation.arrToDialog);
    // 				this.actionForm = '';
    // 				if (this.currentConversation.arrToDialog && !this.currentConversation.arrToDialog.length) {
    // 					this.currentConversation.arrToDialog = [];
    // 					this.files = [];
    // 					if (this.errorFile && !this.errorFile.length) this._chatService.ShowAttachmentAreaDnd.next(false);
    // 				}
    // 			}
    // 		}, err => {
    // 		});
    // 	}
    // 	if (this.autoGrowSyncMsgBody.trim() || (this.actionForm && this.actionForm.length)) {
    // 		this._chatService.SendMessage(this.currentConversation.sessionid, {
    // 			from: this.agent.nickname,
    // 			to: this.currentConversation.sessionid,
    // 			body: this.autoGrowSyncMsgBody.trim(),
    // 			cid: this.currentConversation._id,
    // 			form: this.actionForm
    // 		});
    // 		//setTimeout(() => {
    // 		this.msgBody = '';
    // 		this.autoGrowSyncMsgBody = '';
    // 		//}, 0);
    // 	}
    // 	this._chatService.SendTypingEventRest({ state: false, conversation: this.currentConversation }).subscribe(data => {
    // 		this._chatService.tempTypingState.next(false)
    // 	})
    // 	this._chatService.setAutoScroll(true);
    // 	this._chatService.conversationSeen();
    // }
    VisitorsFixedChatSidebarComponent.prototype.keyDownFunction = function (event) {
        //
        if (event.which == 1) {
            var result = void 0;
            var ev = new KeyboardEvent("keydown", {
                shiftKey: false,
                bubbles: true,
                cancelable: false,
                key: "Enter",
            });
            result = this.messageTextArea.nativeElement.dispatchEvent(ev);
            var ev1 = new KeyboardEvent("keypress", {
                shiftKey: false,
                bubbles: true,
                cancelable: false,
                key: "Enter",
            });
            result = this.messageTextArea.nativeElement.dispatchEvent(ev1);
            var ev3 = new KeyboardEvent("keyup", {
                shiftKey: false,
                bubbles: true,
                cancelable: false,
                key: "Enter",
            });
            this.keyup(ev3);
        }
    };
    VisitorsFixedChatSidebarComponent.prototype.SendMessageSingleAttach = function (file, conversation) {
        var _this = this;
        this.uploading = true;
        var galleryIndex = this.attachmentGallery.findIndex(function (w) { return w.name == file.name; });
        if (galleryIndex != -1) {
            this.attachmentGallery[galleryIndex].uploading = true;
        }
        this._uploadingService.GenerateLinksForFiles(file, 'SendAttachMent').subscribe(function (response) {
            if (response) {
                _this.uploadingCount = _this.uploadingCount - 1;
                if (_this.uploadingCount == 0) {
                    _this.uploading = false;
                }
                if (!response.error) {
                    _this._chatService.SendAttachment(conversation.sessionid, {
                        from: _this.agent.nickname,
                        to: conversation.sessionid,
                        body: [response],
                        cid: conversation._id,
                        attachment: true,
                        form: _this.actionForm
                    }, file.name).subscribe(function (res) { }, function (err) { });
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
    VisitorsFixedChatSidebarComponent.prototype.SendMessage = function () {
        var _this = this;
        var conversation = JSON.parse(JSON.stringify(this.currentConversation));
        if (this.files && this.files.length && !this.uploading) {
            //for sending attachment 1 by 1
            this.uploadingCount = this.files.length;
            this.files.map(function (file) {
                _this.SendMessageSingleAttach(file, conversation);
            });
            this.fileInput.nativeElement.value = '';
            //for sending attachment all at once
            // this.uploading = true;
            // this._uploadingService.GenerateLinks(this.files, 'SendAttachMent').subscribe(response => {
            // 	let filesReadyToUpload = response.filter(file => {
            // 		return (!(file as Object).hasOwnProperty('error'))
            // 	});
            // 	this.file = response.filter(file => {
            // 		return ((file as Object).hasOwnProperty('error'))
            // 	});
            // 	if (filesReadyToUpload && filesReadyToUpload.length) {
            // 		let attachment = filesReadyToUpload;
            // 		this._chatService.SendAttachment(this.currentConversation.sessionid, {
            // 			from: this.agent.nickname,
            // 			to: this.currentConversation.sessionid,
            // 			body: attachment,
            // 			cid: this.currentConversation._id,
            // 			attachment: true,
            // 			form: this.actionForm
            // 		}, this.files[0].name);
            // 		this.uploading = false;
            // 		filesReadyToUpload.forEach(x => {
            // 			this.arrToDialog.splice(x, 1);
            // 		});
            // 		if (!this.arrToDialog.length) {
            // 			this._chatService.ShowAttachmentAreaDnd.next(false);
            // 			this.arrToDialog = [];
            // 			this.files = [];
            // 			this.fileerror = '';
            // 		}
            // 	}
            // 	//when there is no media service or all wrong files..
            // 	else if ((this.file && this.file.length) || (filesReadyToUpload && filesReadyToUpload.length)) {
            // 		this.file.map(errors => {
            // 			this._uploadingService.ShowAttachmentError(errors.error).subscribe(fileerror => {
            // 				this.fileerror = fileerror;
            // 				if (errors.error) {
            // 					this.fileValid = false;
            // 					this.uploading = false;
            // 					this.fileInput.nativeElement.value = '';
            // 					this.ClearFile();
            // 				}
            // 			}, err => {
            // 				this.fileValid = false;
            // 				this.fileerror = "Error in uploading..Please try again!"
            // 				this.uploading = false;
            // 				console.log("error in showAttachment", err);
            // 			});
            // 		});
            // 	}
            // }, err => {
            // 	console.log("file not sent", err);
            // });
        }
        // if (this.autoGrowSyncMsgBody.trim() || (this.actionForm && this.actionForm.length)) {
        if (this.msgBody.trim()) {
            this._chatService.SendMessage(conversation, {
                from: this.agent.nickname,
                to: conversation.sessionid,
                body: this.msgBody.trim(),
                cid: conversation._id,
                form: this.actionForm
            });
            this.msgBody = '';
            // this.autoGrowSyncMsgBody = '';
        }
        this._chatService.SendTypingEventRest({ state: false, conversation: conversation }).subscribe(function (data) {
            _this._chatService.tempTypingState.next(false);
        });
        // this.files = [];
        this._chatService.setAutoScroll(true);
        this._chatService.conversationSeen();
        if (this.files && !this.files.length && this.actionForm) {
            // this.ShowAttachmentAreaDnd = false;
            this._chatService.ShowAttachmentAreaDnd.next(false);
            this.actionForm = '';
        }
        setTimeout(function () {
            var event = new KeyboardEvent("keydown", {
                shiftKey: false,
                bubbles: true,
                cancelable: false,
                key: "Enter",
            });
            if (_this.messageTextArea && _this.messageTextArea.nativeElement) {
                _this.messageTextArea.nativeElement.dispatchEvent(event);
                _this.messageTextArea.nativeElement.focus();
            }
        }, 0);
        //for Action Forms
        // if (this.files && !this.files.length && this.actionForm) {
        // 	// this.ShowAttachmentAreaDnd = false;
        // 	this._chatService.ShowAttachmentAreaDnd.next(false);
        // 	this.actionForm = ''
        // }
    };
    // public SendMessage() {
    // 	if (this.files && this.files.length && !this.uploading) {
    // 		this.uploading = true;
    // 		this._uploadingService.GenerateLinksForTickets(this.files, 0, this.links).subscribe(response => {
    // 			let attachment = response;
    // 			////console.log(attachment);
    // 			this._chatService.SendAttachment(this.currentConversation.sessionid, {
    // 				from: this.agent.nickname,
    // 				to: this.currentConversation.sessionid,
    // 				body: attachment,
    // 				cid: this.currentConversation._id,
    // 				attachment: true,
    // 			}, this.files[0].name)
    // 			this.msgBody = '';
    // 			this.ShowAttachmentAreaDnd = false;
    // 			this.files = [];
    // 			this.arrToDialog = [];
    // 			this.links = [];
    // 			this.fileInput.nativeElement.value = '';
    // 			this.uploading = false;
    // 		}, err => {
    // 			this._uploadingService.ShowAttachmentError(JSON.parse(err)).subscribe(fileerror => {
    //                 //console.log(fileerror);
    //                 this.fileerror = fileerror;
    //                 if (err) {
    //                     this.uploading = false;
    //                     this.fileValid = false;
    //                     setTimeout(() => [
    //                         this.ShowAttachmentAreaDnd = false,
    //                         this.fileValid = true
    //                     ], 4500);
    //                     this.ClearFile();
    //                 }
    //             }, err => {
    //             });
    // 		});
    // 	}
    // 		if (this.msgBody.trim()) {
    // 			this._chatService.SendMessage(this.currentConversation.sessionid, {
    // 				from: this.agent.nickname,
    // 				to: this.currentConversation.sessionid,
    // 				body: this.msgBody.trim(),
    // 				cid: this.currentConversation._id
    // 			});
    // 			this.msgBody = '';
    // 			////console.log("typing event");
    // 			this._chatService.SendTypingEventRest({ state: false, conversation: this.currentConversation }).subscribe(data => {
    // 				this._chatService.tempTypingState.next(false)
    // 			})
    // 			// this.files = [];
    // 			this._chatService.setAutoScroll(true);
    // 			this._chatService.conversationSeen();
    // 		}
    // }
    // public SendMessage() {
    // 	if (this.files && this.files.length && !this.uploading) {
    // 		this.uploading = true;
    // 		this._uploadingService.GenerateLinksForTickets(this.files, 0, this.links).subscribe(response => {
    // 			let attachment = response;
    // 			this._chatService.SendAttachment(this.currentConversation.sessionid, {
    // 				from: this.agent.nickname,
    // 				to: this.currentConversation.sessionid,
    // 				body: attachment,
    // 				cid: this.currentConversation._id,
    // 				attachment: true,
    // 				form: this.actionForm
    // 			}, this.files[0].name)
    // 			this.msgBody = '';
    // 			this.ShowAttachmentAreaDnd = false;
    // 			this.files = [];
    // 			this.arrToDialog = [];
    // 			this.links = [];
    // 			this.fileInput.nativeElement.value = '';
    // 			this.uploading = false;
    // 		}, err => {
    // 			this._uploadingService.ShowAttachmentError(JSON.parse(err)).subscribe(fileerror => {
    // 				//console.log(fileerror);
    // 				this.fileerror = fileerror;
    // 				if (err) {
    // 					this.uploading = false;
    // 					this.fileValid = false;
    // 					setTimeout(() => [
    // 						this.ShowAttachmentAreaDnd = false,
    // 						this.fileValid = true
    // 					], 4500);
    // 					this.ClearFile();
    // 				}
    // 			}, err => {
    // 			});
    // 		});
    // 	}
    // 	if (this.msgBody.trim()) {
    // 		this._chatService.SendMessage(this.currentConversation.sessionid, {
    // 			from: this.agent.nickname,
    // 			to: this.currentConversation.sessionid,
    // 			body: this.msgBody.trim(),
    // 			cid: this.currentConversation._id,
    // 			form: this.actionForm
    // 		});
    // 		this.msgBody = '';
    // 		////console.log("typing event");
    // 		this._chatService.SendTypingEventRest({ state: false, conversation: this.currentConversation }).subscribe(data => {
    // 			this._chatService.tempTypingState.next(false)
    // 		})
    // 		// this.files = [];
    // 		this._chatService.setAutoScroll(true);
    // 		this._chatService.conversationSeen();
    // 		//for Action Forms
    // 		if (this.files && !this.files.length && this.actionForm) {
    // 			this.ShowAttachmentAreaDnd = false;
    // 			this.actionForm = ''
    // 		}
    // 	}
    // }
    // public FileSelected(event: Event) {
    // 	this._chatService.ShowAttachmentAreaDnd.next(false);
    // 	// this.fileValid = true;
    // 	for (let i = 0; i < this.fileInput.nativeElement.files.length; i++) {
    // 		if (this.fileInput.nativeElement.files.length > 0) {
    // 			this.files = this.files.concat(this.fileInput.nativeElement.files[i]);
    // 		}
    // 	}
    // 	this.readURL(this.files).subscribe(response => {
    // 		if (response.status == 'ok') {
    // 			this._chatService.ShowAttachmentAreaDnd.next(true);
    // 		}
    // 	});
    // 	setTimeout(() => {
    // 		// this._chatService.setDraftFiles(this.currentConversation._id, this.files, this.arrToDialog);
    // 	}, 0);
    // }
    VisitorsFixedChatSidebarComponent.prototype.FileSelected = function (event) {
        var _this = this;
        this._chatService.ShowAttachmentAreaDnd.next(false);
        for (var i = 0; i < this.fileInput.nativeElement.files.length; i++) {
            if (this.fileInput.nativeElement.files.length > 0) {
                this.files.push(this.fileInput.nativeElement.files[i]);
            }
        }
        this.readURL(this.files).subscribe(function (response) {
            if (response.status == 'ok') {
                _this._chatService.ShowAttachmentAreaDnd.next(true);
                //	if (!this.uploading) this._chatService.setDraftFiles(this.currentConversation._id, this.files, this.currentConversation.arrToDialog);
            }
        });
        // setTimeout(() => {
        // 	this._chatService.setDraftFiles(this.currentConversation._id, this.files, this.arrToDialog);
        // }, 0);
        console.log(this.arrToDialog, this.files);
    };
    VisitorsFixedChatSidebarComponent.prototype.ClearFile = function () {
        this.file = undefined;
        this.files = [];
        this.fileInput.nativeElement.value = '';
    };
    VisitorsFixedChatSidebarComponent.prototype.RemoveFile = function (data) {
        var _this = this;
        this.arrToDialog.forEach(function (e, i) {
            if (e.file.name == data.file.name) {
                _this.arrToDialog.splice(i, 1);
            }
        });
        this.files.forEach(function (e, i) {
            if (e.name == data.file.name) {
                _this.files.splice(i, 1);
            }
        });
        this.fileInput.nativeElement.value = '';
        if (!this.arrToDialog.length) {
            this.ShowAttachmentAreaDnd = false;
        }
    };
    VisitorsFixedChatSidebarComponent.prototype.onClear = function (event) {
        if (event.clearActionForm) {
            this.actionForm = '';
            if (this.files && !this.files.length)
                this._chatService.ShowAttachmentAreaDnd.next(false);
        }
        else if (event.clearAll) {
            this.fileInput.nativeElement.value = '';
            this._chatService.ShowAttachmentAreaDnd.next(false);
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
        // if (event.clear) {
        // 	if (this.fileInput) this.fileInput.nativeElement.value = '';
        // 	//this.files = [];
        // 	this.fileerror = '';
        // 	//this._chatService.ShowAttachmentAreaDnd.next(false);
        // 	this.uploading = false;
        // 	this.fileValid = false;
        // 	// if (this.currentConversation.attachments) {
        // 	// 	this.currentConversation.attachments = []
        // 	// 	this.currentConversation.arrToDialog = []
        // 	// }
        // }
        // else if (event.clearActionForm) {
        // 	this.actionForm = ''
        // 	// this.ShowAttachmentAreaDnd = false
        // 	this._chatService.ShowAttachmentAreaDnd.next(false);
        // }
    };
    //DRAG AND DROP FUNCTIONS
    VisitorsFixedChatSidebarComponent.prototype.OnDragOver = function (event) {
        if (Object.keys(this.currentConversation).length && this.currentConversation.state != 2)
            return false;
        this.isDragged = true;
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
    };
    VisitorsFixedChatSidebarComponent.prototype.onDragLeave = function (event) {
        if (Object.keys(this.currentConversation).length && this.currentConversation.state != 2)
            return false;
        this.isDragged = false;
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
    };
    VisitorsFixedChatSidebarComponent.prototype.onDrop = function (event) {
        var _this = this;
        if (Object.keys(this.currentConversation).length && this.currentConversation.state != 2)
            return false;
        this.isDragged = false;
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        this._chatService.ShowAttachmentAreaDnd.next(false);
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
                _this._chatService.ShowAttachmentAreaDnd.next(true);
                // this._chatService.setDraftFiles(this.currentConversation._id, this.files, this.arrToDialog);
            }
        });
        setTimeout(function () {
            // this._chatService.setDraftFiles(this.currentConversation._id, this.files, this.arrToDialog);
            // this._chatService.ShowAttachmentAreaDnd.next(true);
        }, 0);
    };
    // readURL(files) {
    // 	this.arrToDialog = [];
    // 	// ////console.log(files);
    // 	if (files && files.length) {
    // 		for (let i = 0; i < files.length; i++) {
    // 			this.arrToDialog = [];
    // 			let file = files[i];
    // 			// if (!file.type.match('image')) continue;
    // 			let picReader = new FileReader();
    // 			this.arrToDialog = [];
    // 			picReader.addEventListener("load", (event: any) => {
    // 				this.imagetarget = event.target.result;
    // 				// ////console.log(this.imagetarget);
    // 				let obj = { url: this.imagetarget, file: files[i] };
    // 				this.arrToDialog.push(obj);
    // 				//console.log(this.arrToDialog);
    // 			});
    // 			picReader.readAsDataURL(file);
    // 		}
    // 	}
    // }
    //VoiceNotes
    VisitorsFixedChatSidebarComponent.prototype.readURL = function (files) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.attachmentGallery = [];
            _this._uploadingService.readURL(files).subscribe(function (data) {
                if (data) {
                    _this.attachmentGallery = data;
                    observer.next({ status: 'ok' });
                    observer.complete();
                }
            });
        });
    };
    VisitorsFixedChatSidebarComponent.prototype.startRecording = function () {
        var _this = this;
        this.isAudioSent = false;
        this.recordingStarted = true;
        navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(function (stream) {
            _this.mediaStream = stream;
            _this.recordRTC = RecordRTC(stream, {
                type: 'audio'
            });
            _this.recordRTC.startRecording();
            _this.recordingInterval = setInterval(function () {
                _this.seconds++;
                if (_this.seconds == 60) {
                    _this.mins += 1;
                    _this.stopRecording();
                    clearInterval(_this.recordingInterval);
                }
            }, 1000);
        }).catch(function (err) {
            console.log("Error", err);
        });
    };
    VisitorsFixedChatSidebarComponent.prototype.cancelRecording = function () {
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
    VisitorsFixedChatSidebarComponent.prototype.stopWithTimeout = function () {
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
    VisitorsFixedChatSidebarComponent.prototype.TryCall = function (selectedVisitor) {
        var _this = this;
        event.preventDefault();
        this.dialog.open(call_dialog_component_1.CallDialogComponent, {
            panelClass: ['calling-dialog'],
            data: selectedVisitor,
            disableClose: true,
            autoFocus: true
        }).afterClosed().subscribe(function (response) {
            // ////console.log(response);
            _this._callingService.EndCall();
        });
    };
    VisitorsFixedChatSidebarComponent.prototype.isArray = function (obj) {
        return Array.isArray(obj);
    };
    VisitorsFixedChatSidebarComponent.prototype.Emoji = function ($event) {
        //////console.log($event);
        this.msgBody += $event;
        this.EmojiWrapper = false;
    };
    VisitorsFixedChatSidebarComponent.prototype.ngOnDestroy = function () {
        //  ////console.log('Destroyed');
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
    };
    __decorate([
        core_1.ViewChild('fileInput')
    ], VisitorsFixedChatSidebarComponent.prototype, "fileInput", void 0);
    __decorate([
        core_1.ViewChild('chatMessage')
    ], VisitorsFixedChatSidebarComponent.prototype, "messageTextArea", void 0);
    VisitorsFixedChatSidebarComponent = __decorate([
        core_1.Component({
            selector: 'app-visitors-fixed-chat-sidebar',
            templateUrl: './visitors-fixed-chat-sidebar.component.html',
            styleUrls: ['./visitors-fixed-chat-sidebar.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None,
        })
    ], VisitorsFixedChatSidebarComponent);
    return VisitorsFixedChatSidebarComponent;
}());
exports.VisitorsFixedChatSidebarComponent = VisitorsFixedChatSidebarComponent;
//# sourceMappingURL=visitors-fixed-chat-sidebar.component.js.map