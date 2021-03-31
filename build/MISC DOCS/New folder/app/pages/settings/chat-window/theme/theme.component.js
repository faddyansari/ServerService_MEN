"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemeComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var ThemeComponent = /** @class */ (function () {
    function ThemeComponent(_chatWindowCustomizations, _appStateService, _uploadingService, formbuilder, snackBar, dialog) {
        this._chatWindowCustomizations = _chatWindowCustomizations;
        this._appStateService = _appStateService;
        this._uploadingService = _uploadingService;
        this.formbuilder = formbuilder;
        this.snackBar = snackBar;
        this.dialog = dialog;
        this.subscriptions = [];
        this.displaySettings = undefined;
        this.backupDisplaySettings = undefined;
        this.loading = false;
        this.colorRegex = /^#[0-9a-fA-F]{8}$|#[0-9a-fA-F]{6}$|#[0-9a-fA-F]{4}$|#[0-9a-fA-F]{3}$/;
        this.file = {};
        this.deleting = false;
        this._appStateService.contentInfo.next('');
        this._appStateService.breadCrumbTitle.next('Chat Window Customizations');
    }
    ThemeComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.subscriptions.push(this._chatWindowCustomizations.GetDisplaySettings().subscribe(function (displaySettings) {
            if (displaySettings) {
                _this.displaySettings = displaySettings.settings.chatwindow.themeSettings;
                _this.file = displaySettings.settings.chatwindow.themeSettings.bgImage;
                _this.backupDisplaySettings = JSON.parse(JSON.stringify(displaySettings.settings.chatwindow.themeSettings));
                _this.form = _this.formbuilder.group({
                    'headerColor': [
                        _this.displaySettings.headerColor,
                        [
                            forms_1.Validators.required,
                            forms_1.Validators.pattern(_this.colorRegex)
                        ]
                    ],
                    'headerSecondryColor': [
                        _this.displaySettings.headerSecondryColor,
                        [
                            forms_1.Validators.required,
                            forms_1.Validators.pattern(_this.colorRegex)
                        ]
                    ],
                    'btnColor': [
                        _this.displaySettings.btnColor,
                        [
                            forms_1.Validators.required,
                            forms_1.Validators.pattern(_this.colorRegex)
                        ]
                    ],
                    'btnTextcolor': [
                        _this.displaySettings.btnTextcolor,
                        [
                            forms_1.Validators.required,
                            forms_1.Validators.pattern(_this.colorRegex)
                        ]
                    ],
                    'secondryBtnTextColor': [
                        _this.displaySettings.secondryBtnTextColor,
                        [
                            forms_1.Validators.required,
                            forms_1.Validators.pattern(_this.colorRegex)
                        ]
                    ],
                    'headerTextColor': [
                        _this.displaySettings.headerTextColor,
                        [
                            forms_1.Validators.required,
                            forms_1.Validators.pattern(_this.colorRegex)
                        ]
                    ],
                    'contentColor': [
                        _this.displaySettings.contentColor,
                        [
                            forms_1.Validators.required,
                            forms_1.Validators.pattern(_this.colorRegex)
                        ]
                    ],
                    'secondryBtnColor': [
                        _this.displaySettings.secondryBtnColor,
                        [
                            forms_1.Validators.required,
                            forms_1.Validators.pattern(_this.colorRegex)
                        ]
                    ],
                    'bgColor': [
                        _this.displaySettings.bgColor,
                        [
                            forms_1.Validators.required,
                            forms_1.Validators.pattern(_this.colorRegex)
                        ]
                    ],
                    'borderColor': [
                        _this.displaySettings.borderColor,
                        [
                            forms_1.Validators.required,
                            forms_1.Validators.pattern(_this.colorRegex)
                        ]
                    ],
                    'windowSizeForMobile': [
                        (_this.displaySettings.windowSizeForMobile) ? _this.displaySettings.windowSizeForMobile : 645,
                        [
                            forms_1.Validators.required,
                        ]
                    ],
                    'windowSizeForDesktop': [
                        (_this.displaySettings.windowSizeForDesktop) ? _this.displaySettings.windowSizeForDesktop : 730,
                        [
                            forms_1.Validators.required,
                        ]
                    ],
                });
            }
        }));
    };
    ThemeComponent.prototype.ngOnDestroy = function () {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.subscriptions.map(function (subscription) {
            subscription.unsubscribe();
        });
    };
    ThemeComponent.prototype.SetControl = function (data) {
        this.form.get(data.controlValue).setValue(data.value);
        this.displaySettings[data.controlValue] = data.value;
    };
    ThemeComponent.prototype.SetStickyWindow = function () {
        this.displaySettings.stickyWindow = !this.displaySettings.stickyWindow;
    };
    ThemeComponent.prototype.ColorChange = function (event, data) {
        this.form.get(event).setValue(this._chatWindowCustomizations.RGBAToHexAString(data));
    };
    ThemeComponent.prototype.Reset = function () {
        this.displaySettings = JSON.parse(JSON.stringify(this.backupDisplaySettings));
    };
    ThemeComponent.prototype.ResetToDefaults = function () {
        this.displaySettings = {
            headerColor: '#F39B64FF',
            headerSecondryColor: '#F15C24FF',
            btnColor: '#F15C24FF',
            btnTextcolor: '#FFFFFFFF',
            secondryBtnTextColor: '#FFFFFFFF',
            headerTextColor: '#FFFFFFFF',
            contentColor: '#1F282EFF',
            secondryBtnColor: '#368763FF',
            bgColor: '#FFFFFFFF',
            borderColor: '#AFB6C4FF',
            bgImage: {},
        };
    };
    ThemeComponent.prototype.FileSelected = function (event) {
        var _this = this;
        this.fileValid = true;
        if (event.target.files[0].type) {
            if (event.target.files.length > 0) {
                this.fileToUpload = event.target.files[0];
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
        this.fileToUpload = undefined;
        return;
    };
    ThemeComponent.prototype.ClearFile = function () {
        var _this = this;
        this.deleting = true;
        this._chatWindowCustomizations.RemoveBackGroundImage().subscribe(function (response) {
            //TODO RESPONSE LOGIC HERE
            _this.deleting = false;
        }, function (err) {
            //TODO ERROR LOGIC HERE
            _this.deleting = false;
        });
    };
    ThemeComponent.prototype.UploadImage = function () {
        var _this = this;
        if (this.fileToUpload && !this.uploading) {
            this.uploading = true;
            this._uploadingService.SignRequest(this.fileToUpload, 'uploadBackgroundImage').subscribe(function (response) {
                var params = JSON.parse(response.text());
                params.file = _this.fileToUpload;
                _this._uploadingService.uploadAttachment(params).subscribe(function (s3response) {
                    // console.log(s3response.status);
                    if (s3response.status == '201') {
                        _this._uploadingService.parseXML(s3response.text()).subscribe(function (json) {
                            //console.log(json.response.PostResponse.Location[0])
                            _this._chatWindowCustomizations.UpdateBackgroundImage(json.response.PostResponse.Location[0], _this.fileToUpload.name).subscribe(function (response) {
                                _this.fileToUpload = undefined;
                                _this.fileInput.nativeElement.value = '';
                                _this.uploading = false;
                            }, function (err) {
                                _this.uploading = false;
                            });
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
    };
    ThemeComponent.prototype.SubmitForm = function () {
        var _this = this;
        this.loading = true;
        this._chatWindowCustomizations.UpdateChatWindowContentSettings('themeSettings', this.displaySettings).subscribe(function (response) {
            _this.loading = false;
            if (response.status == 'ok') {
                _this.backupDisplaySettings = JSON.parse(JSON.stringify(_this.displaySettings));
                //Todo Completion Logic Here
            }
        }, function (err) {
            _this.loading = false;
            //Todo Error View Logic Here
        });
    };
    ThemeComponent.prototype.ApplyHeaderColorWithGradient = function (color) {
        return JSON.parse(JSON.parse(JSON.stringify("{\n          \"background\": \"linear-gradient(20deg," + this.displaySettings.headerSecondryColor + " 30%, " + this.displaySettings.headerColor + " 100%)\"\n        }")));
    };
    __decorate([
        core_1.ViewChild('fileInput')
    ], ThemeComponent.prototype, "fileInput", void 0);
    ThemeComponent = __decorate([
        core_1.Component({
            selector: 'app-theme',
            templateUrl: './theme.component.html',
            styleUrls: ['./theme.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], ThemeComponent);
    return ThemeComponent;
}());
exports.ThemeComponent = ThemeComponent;
//# sourceMappingURL=theme.component.js.map