"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketMsgFormComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var Observable_1 = require("rxjs/Observable");
var TicketMsgFormComponent = /** @class */ (function () {
    function TicketMsgFormComponent(formbuilder, _uploadingService) {
        this.formbuilder = formbuilder;
        this._uploadingService = _uploadingService;
        this.to = '';
        this.cc = [];
        this.from = '';
        this.subject = '';
        this.tid = [];
        this.type = 'reply';
        this.sending = false;
        this.CannedFormsList = [];
        this.automatedResponses = [];
        this.survey = [];
        this.delete = new core_1.EventEmitter();
        this.message = new core_1.EventEmitter();
        this.redirectToAR = new core_1.EventEmitter();
        this.emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        this.showCC = false;
        this.showBCC = false;
        this.selectedForm = undefined;
        this.selectedFeedbackSurvey = false;
        this.formRef = undefined;
        this.SurveyList = [];
        this.config = {
            placeholder: 'Enter your message here ...',
            height: 250,
            // uploadImagePath: '',
            toolbar: [
                ['style', ['bold', 'italic', 'underline']],
                ['fontname', ['fontname']],
                ['fontsize', ['fontsize']],
                ['color', ['color']],
                ['fontName', ['fontName']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['height', ['height']],
                ['insert', ['linkDialogShow', 'unlink', 'hr']],
                ['view', ['codeview', 'undo', 'redo']]
            ]
        };
        this.displayMessage = '';
    }
    TicketMsgFormComponent.prototype.ngOnInit = function () {
        // console.log(this.cc);
        var temp = [];
        this.msgForm = this.formbuilder.group({
            'to': [
                { value: ((this.type == 'reply') || (this.type == 'reply-all')) ? [this.to] : [], disabled: ((this.type == 'reply') || (this.type == 'reply-all')) ? true : false },
                [
                    forms_1.Validators.required,
                ],
                this.CheckEmail.bind(this)
            ],
            'from': [
                this.from,
                [
                    forms_1.Validators.required,
                ],
                this.CheckEmail.bind(this)
            ],
            'subject': [
                { value: this.subject, disabled: (this.type == 'fwd') ? false : true },
                [
                    forms_1.Validators.required
                ],
            ],
            'msg': [
                '',
                [],
            ],
            'cc': [
                this.cc,
                [],
                this.CheckEmail.bind(this)
            ],
            'bcc': [
                [],
                [],
                this.CheckEmail.bind(this)
            ],
            'attachments': this.formbuilder.array(temp)
        });
        if (this.type == 'reply-all') {
            // console.log(this.cc);
            // console.log([this.to]);
            // setTimeout(() => {
            //   this.msgForm.get('cc').setValue(this.cc);
            // }, 0);
            this.showCC = true;
        }
        if (this.threadMessage) {
            var thread = this.threadMessage;
            if (thread.type == 'forward')
                this.displayMessage += "<br><br><hr class='bg-theme-gray'><br>---------- Forwarded message ---------";
            else
                this.displayMessage += '<br><br><hr><br>---------- In reply to ---------';
            this.displayMessage += '<br><br>From: ' + thread.data.from;
            this.displayMessage += '<br>Date: ' + new Date(thread.data.date).toLocaleString();
            this.displayMessage += '<br>Subject: ' + thread.data.subject;
            this.displayMessage += '<br>To: ' + thread.data.to;
            this.displayMessage += '<br><br>' + thread.data.body;
            if (this.displayMessage) {
                this.msgForm.get('msg').setValue(this.displayMessage);
            }
        }
        // this.msgForm.get('cc').valueChanges.subscribe(val => {
        //   console.log(val);
        // })
    };
    TicketMsgFormComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        // (this.msgBox.nativeElement as HTMLTextAreaElement).setSelectionRange(0,0);
        setTimeout(function () {
            _this.msgBox.nativeElement.focus();
            _this.msgBox.nativeElement.setSelectionRange(0, 0);
        }, 100);
        // $('#msgBox').summernote({
        // 	callbacks: {
        // 		onPaste: (e) => {
        // 			console.log(e);
        // 		}
        // 	}
        // });
        // $('#msgBox').summernote({
        // 	callbacks: {
        // 		onImageUpload: function (data) {
        // 			data.pop();
        // 			// upload image to server and create imgNode...
        // 		}
        // 	}
        // });
        // $('#msgBox').on('summernote.paste', (e) => {
        // 	// e.preventDefault();
        // 	// console.log(e);
        // 	// console.log('Called event paste');
        // });
        // $('#msgBox').on('summernote.image.upload', function (e, files) {
        // 	// upload image to server and create imgNode...
        // 	// e.preventDefault();
        // 	// console.log(e);
        // 	console.log((this as ElementRef).nativeElement);
        // 	console.log(files);
        // 	// files.pop();
        // 	// $summernote.summernote('insertNode', imgNode);
        // });
    };
    // uploadImageContent(file: File, editor) {
    // 	// (image[0] as HTMLImageElement).setAttribute('id', '')
    // 	// $(editor).summernote('insertNode', image[0]);
    // 	this._uploadingService.GenerateLinks([file], 'SendAttachMent').subscribe(response => {
    // 		// console.log(response);
    // 		if (response && response.length) {
    // 			let image = $('<img>').attr('src', response[0].path);
    // 			$(editor).summernote('insertNode', image[0]);
    // 		}
    // 	}, err => {
    // 		console.log("file not sent", err);
    // 	});
    // }
    TicketMsgFormComponent.prototype.CheckEmail = function (control) {
        var _this = this;
        var valid = true;
        var value = (Array.isArray(control.value) ? control.value : [control.value]);
        // console.log(value);
        value.map(function (email) {
            // console.log(email);
            if (!_this.emailPattern.test(email))
                valid = false;
        });
        // console.log(value + ' - ' + valid);
        if (!valid)
            return Observable_1.Observable.of({ 'invalid': true });
        else
            return Observable_1.Observable.of(null);
    };
    TicketMsgFormComponent.prototype.Delete = function () {
        this.delete.emit(true);
    };
    TicketMsgFormComponent.prototype.FileSelected = function (event) {
        var _this = this;
        var _loop_1 = function (i) {
            if (this_1.fileInput.nativeElement.files.length > 0) {
                this_1.readURL(this_1.fileInput.nativeElement.files[i]).then(function (url) {
                    var fb = _this.formbuilder.group({
                        file: [
                            _this.fileInput.nativeElement.files[i],
                            [
                                forms_1.Validators.required
                            ]
                        ],
                        name: [
                            _this.fileInput.nativeElement.files[i].name
                        ],
                        url: url
                    });
                    var attachments = _this.msgForm.get('attachments');
                    attachments.push(fb);
                });
                // this.files.push(this.fileInput.nativeElement.files[i]);
                // this.filenames.push(this.fileInput.nativeElement.files[i]);
            }
        };
        var this_1 = this;
        for (var i = 0; i < this.fileInput.nativeElement.files.length; i++) {
            _loop_1(i);
        }
    };
    TicketMsgFormComponent.prototype.GetControls = function (name) {
        return this.msgForm.get(name).controls;
    };
    TicketMsgFormComponent.prototype.RemoveAttachment = function (i) {
        var attachments = this.msgForm.get('attachments');
        attachments.removeAt(i);
    };
    TicketMsgFormComponent.prototype.ClearFile = function () {
        this.msgForm.get('attachments').setValue(new forms_1.FormArray([]));
        this.fileInput.nativeElement.value = '';
    };
    TicketMsgFormComponent.prototype.readURL = function (Attachment) {
        return new Promise(function (resolve, reject) {
            var picReader = new FileReader();
            picReader.addEventListener("load", function (event) {
                resolve(event.target.result);
            });
            picReader.readAsDataURL(Attachment);
        });
    };
    TicketMsgFormComponent.prototype.ToggleBCC = function (event) {
        //console.log('Toggling BCC');
        // event.stopImmediatePropagation();
        // event.stopPropagation();
        this.showBCC = !this.showBCC;
        this.msgForm.get('bcc').setValue([]);
        // let temp = (this.msgForm.get('bcc') as FormArray);
        // while (temp.length) { temp.removeAt(0); }
    };
    TicketMsgFormComponent.prototype.ToggleCC = function (event) {
        //console.log('Toggling CC');
        // event.stopImmediatePropagation();
        // event.stopPropagation();
        // console.log(this.cc);
        this.showCC = !this.showCC;
        this.msgForm.get('cc').setValue(this.cc);
        // console.log(this.msgForm.get('cc').value);
        // let temp = (this.msgForm.get('cc') as FormArray);
        // while (temp.length) { temp.removeAt(0); }
    };
    TicketMsgFormComponent.prototype.Send = function (event) {
        event.preventDefault();
        this.message.emit({
            to: this.msgForm.get('to').value,
            from: this.msgForm.get('from').value,
            body: this.msgForm.get('msg').value,
            cc: this.msgForm.get('cc').value,
            bcc: this.msgForm.get('bcc').value,
            attachments: this.msgForm.get('attachments').value,
            subject: this.msgForm.get('subject').value,
            form: (this.formRef) ? this.formRef : '',
            submittedForm: (this.selectedForm && this.selectedForm.length) ? this.selectedForm : [],
            surveyAttached: (this.selectedFeedbackSurvey) ? true : false,
            threadMessage: this.threadMessage
        });
    };
    TicketMsgFormComponent.prototype.RemoveForm = function () {
        this.selectedForm = undefined;
    };
    TicketMsgFormComponent.prototype.SelectActivatedPolicy = function () {
        this.selectedFeedbackSurvey = true;
    };
    TicketMsgFormComponent.prototype.RemoveSurveyForm = function () {
        this.selectedFeedbackSurvey = false;
    };
    //cannedMessages popper region
    TicketMsgFormComponent.prototype.UpdateCannedMessages = function (form) {
        this.cannedMessagePopper.hide();
        if (form) {
            this.formRef = {
                id: form._id,
                type: "cannedForm"
            };
            this.selectedForm = [form];
        }
    };
    TicketMsgFormComponent.prototype.InsertCannedMessage = function (hashTag) {
        var result = '';
        this.automatedResponses.map(function (val) {
            if (val.hashTag == hashTag) {
                result = val.responseText;
            }
        });
        this.msgForm.get('msg').setValue(this.msgForm.get('msg').value + ' ' + result.toString());
        this.cannedResponsePopper.hide();
    };
    TicketMsgFormComponent.prototype.GotoAR = function () {
        this.redirectToAR.emit(true);
    };
    TicketMsgFormComponent.prototype.SetCannedMessages = function (event, form) {
    };
    TicketMsgFormComponent.prototype.popperOnUpdateCannedMessage = function (event) {
    };
    TicketMsgFormComponent.prototype.popperOnHidden = function (event) {
    };
    __decorate([
        core_1.ViewChild('msgBox')
    ], TicketMsgFormComponent.prototype, "msgBox", void 0);
    __decorate([
        core_1.Input('to')
    ], TicketMsgFormComponent.prototype, "to", void 0);
    __decorate([
        core_1.Input('cc')
    ], TicketMsgFormComponent.prototype, "cc", void 0);
    __decorate([
        core_1.Input('from')
    ], TicketMsgFormComponent.prototype, "from", void 0);
    __decorate([
        core_1.Input('subject')
    ], TicketMsgFormComponent.prototype, "subject", void 0);
    __decorate([
        core_1.Input('threadMessage')
    ], TicketMsgFormComponent.prototype, "threadMessage", void 0);
    __decorate([
        core_1.Input('tid')
    ], TicketMsgFormComponent.prototype, "tid", void 0);
    __decorate([
        core_1.Input("type")
    ], TicketMsgFormComponent.prototype, "type", void 0);
    __decorate([
        core_1.Input('sending')
    ], TicketMsgFormComponent.prototype, "sending", void 0);
    __decorate([
        core_1.Input('form')
    ], TicketMsgFormComponent.prototype, "CannedFormsList", void 0);
    __decorate([
        core_1.Input('automatedResponses')
    ], TicketMsgFormComponent.prototype, "automatedResponses", void 0);
    __decorate([
        core_1.Input('survey')
    ], TicketMsgFormComponent.prototype, "survey", void 0);
    __decorate([
        core_1.Output('delete')
    ], TicketMsgFormComponent.prototype, "delete", void 0);
    __decorate([
        core_1.Output('message')
    ], TicketMsgFormComponent.prototype, "message", void 0);
    __decorate([
        core_1.Output('redirectToAR')
    ], TicketMsgFormComponent.prototype, "redirectToAR", void 0);
    __decorate([
        core_1.ViewChild('fileInput')
    ], TicketMsgFormComponent.prototype, "fileInput", void 0);
    __decorate([
        core_1.ViewChild('cannedMessages')
    ], TicketMsgFormComponent.prototype, "cannedMessagePopper", void 0);
    __decorate([
        core_1.ViewChild('cannedResponsePopper')
    ], TicketMsgFormComponent.prototype, "cannedResponsePopper", void 0);
    TicketMsgFormComponent = __decorate([
        core_1.Component({
            selector: 'app-ticket-msg-form',
            templateUrl: './ticket-msg-form.component.html',
            styleUrls: ['./ticket-msg-form.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None,
        })
    ], TicketMsgFormComponent);
    return TicketMsgFormComponent;
}());
exports.TicketMsgFormComponent = TicketMsgFormComponent;
//# sourceMappingURL=ticket-msg-form.component.js.map