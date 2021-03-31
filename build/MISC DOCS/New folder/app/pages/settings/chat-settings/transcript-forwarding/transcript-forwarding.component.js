"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranscriptForwardingComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var toast_notifications_component_1 = require("../../../../dialogs/SnackBar-Dialog/toast-notifications.component");
var Observable_1 = require("rxjs/Observable");
var TranscriptForwardingComponent = /** @class */ (function () {
    function TranscriptForwardingComponent(_chatSettings, formBuilder, _authService, _appStateService, snackBar, _uploadingService) {
        var _this = this;
        this._chatSettings = _chatSettings;
        this.formBuilder = formBuilder;
        this._authService = _authService;
        this._appStateService = _appStateService;
        this.snackBar = snackBar;
        this._uploadingService = _uploadingService;
        this.subscriptions = [];
        this.emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        this.package = {};
        this._appStateService.contentInfo.next('');
        this._appStateService.breadCrumbTitle.next('Chat & Timeout Settings');
        this.subscriptions.push(_chatSettings.getChattSettings().subscribe(function (settings) {
            //console.log('chat settings', settings);
            if (settings) {
                _this.transcriptForwarindSettings = settings.transcriptForwarding;
                _this.transcriptForwarindSettingsForm = formBuilder.group({
                    'emails': [
                        _this.GetEmails(_this.transcriptForwarindSettings.emails),
                        [
                            forms_1.Validators.pattern(_this.emailPattern),
                            forms_1.Validators.required
                        ],
                    ],
                });
                _this.transcriptLogoSettings = (settings.transcriptLogo) ? settings.transcriptLogo : '';
                _this.transcriptLogoSettingsForm = formBuilder.group({
                    'logo': [
                        null
                    ]
                });
            }
        }));
        this.subscriptions.push(_chatSettings.getSavingStatus('transcriptForwarding').subscribe(function (status) {
            _this.loading = status;
        }));
        this.subscriptions.push(_chatSettings.getSavingStatus('transcriptLogo').subscribe(function (status) {
            _this.loadingLogo = status;
        }));
        this.subscriptions.push(_authService.getPackageInfo().subscribe(function (pkg) {
            // console.log(data);
            if (pkg) {
                _this.package = pkg;
                if (!_this.package.chats.transcriptForwarding.allowed) {
                    _this._appStateService.NavigateTo('/noaccess');
                }
            }
        }));
    }
    TranscriptForwardingComponent.prototype.ngOnInit = function () {
    };
    TranscriptForwardingComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
    };
    TranscriptForwardingComponent.prototype.GetEmails = function (emails) {
        if (!emails.length)
            return '';
        var temp = '';
        emails.map(function (email, index) {
            if (index == 0)
                temp += email;
            else
                temp += (',' + email);
        });
        return temp;
    };
    TranscriptForwardingComponent.prototype.Submit = function (value) {
        var _this = this;
        this._chatSettings.setNSPChatSettings({
            emails: [value.emails]
        }, 'transcriptForwarding')
            .subscribe(function (response) {
            console.log('error');
            if (response.status == 'error') {
                if (response.code == '403') {
                    response.reason.map(function (reason) {
                        if (reason == 'invalidEmail')
                            _this.transcriptForwarindSettingsForm.get('emails').setErrors({ pattern: true });
                    });
                    _this.transcriptForwarindSettingsForm.setErrors({ invalid: true });
                }
            }
            else {
                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: 'Forward Chat Transcripts settings updated Successfully!'
                    },
                    duration: 3000,
                    panelClass: ['user-alert', 'success']
                });
            }
        });
    };
    TranscriptForwardingComponent.prototype.SubmitLogo = function () {
        var _this = this;
        this.UploadImage().subscribe(function (link) {
            _this._chatSettings.setNSPChatSettings((link) ? link : '', 'transcriptLogo')
                .subscribe(function (response) {
                if (response.status == 'error') {
                    if (response.code == '403') {
                        response.reason.map(function (reason) {
                            if (reason == 'invalidFile')
                                _this.transcriptLogoSettingsForm.setErrors({ invalid: true });
                        });
                        _this.transcriptLogoSettingsForm.setErrors({ invalid: true });
                    }
                }
                else {
                    _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                        data: {
                            img: 'ok',
                            msg: 'Transcript logo settings updated Successfully!'
                        },
                        duration: 3000,
                        panelClass: ['user-alert', 'success']
                    });
                    _this.transcriptLogoSettings = link;
                }
            });
        });
    };
    TranscriptForwardingComponent.prototype.UploadImage = function () {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            if (_this.image) {
                _this._uploadingService.SignRequest(_this.image, 'SendAttachMent').subscribe(function (response) {
                    var params = JSON.parse(response.text());
                    params.file = _this.image;
                    _this._uploadingService.uploadAttachment(params).subscribe(function (s3response) {
                        if (s3response.status == '201') {
                            _this._uploadingService.parseXML(s3response.text()).subscribe(function (json) {
                                observer.next(json.response.PostResponse.Location[0]);
                                observer.complete();
                            }, function (err) {
                                observer.error(err);
                            });
                        }
                    }, function (err) {
                        observer.error(err);
                    });
                }, function (err) {
                    observer.error(err);
                });
            }
            else {
                observer.next('');
                observer.complete();
            }
        });
    };
    TranscriptForwardingComponent.prototype.imgSelected = function (files) {
        var _this = this;
        if (files && files.length > 0) {
            this.readURL(files).subscribe(function (response) {
                if (response)
                    _this.image = files[0];
                else {
                    _this.image = undefined;
                    _this.fileInput.nativeElement.value = '';
                }
            });
        }
        else {
            this.image = undefined;
            this.fileInput.nativeElement.value = '';
        }
    };
    TranscriptForwardingComponent.prototype.readURL = function (files) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this._uploadingService.readURL(files).subscribe(function (data) {
                if (_this.CheckImage(files[0].name.split('.')[1])) {
                    _this.transcriptLogoSettings = data[0].url;
                    observer.next(true);
                    observer.complete();
                }
                else {
                    _this.fileInvalid = true;
                    observer.next(false);
                    observer.complete();
                    setTimeout(function () {
                        _this.fileInvalid = false;
                    }, 3000);
                }
            });
        });
    };
    TranscriptForwardingComponent.prototype.CheckImage = function (type) {
        switch (type.toLowerCase()) {
            case 'png':
            case 'jpeg':
            case 'jpg':
            case 'bmp':
            case 'svg':
                return true;
            default:
                return false;
        }
    };
    TranscriptForwardingComponent.prototype.Clear = function () {
        this.image = undefined;
        this.fileInput.nativeElement.value = '';
        this.transcriptLogoSettings = '';
        this.transcriptLogoSettingsForm.get('logo').setValue(null);
    };
    __decorate([
        core_1.ViewChild('fileInput')
    ], TranscriptForwardingComponent.prototype, "fileInput", void 0);
    TranscriptForwardingComponent = __decorate([
        core_1.Component({
            selector: 'app-transcript-forwarding',
            templateUrl: './transcript-forwarding.component.html',
            styleUrls: ['./transcript-forwarding.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], TranscriptForwardingComponent);
    return TranscriptForwardingComponent;
}());
exports.TranscriptForwardingComponent = TranscriptForwardingComponent;
//# sourceMappingURL=transcript-forwarding.component.js.map