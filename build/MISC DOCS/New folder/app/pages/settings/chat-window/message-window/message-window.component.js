"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageWindowComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var MessageWindowComponent = /** @class */ (function () {
    function MessageWindowComponent(_chatWindowCustomizations, _appStateService, _authService, formbuilder, snackBar, dialog) {
        var _this = this;
        this._chatWindowCustomizations = _chatWindowCustomizations;
        this._appStateService = _appStateService;
        this._authService = _authService;
        this.formbuilder = formbuilder;
        this.snackBar = snackBar;
        this.dialog = dialog;
        this.subscriptions = [];
        this.displaySettings = undefined;
        this.displaySettingsBackup = undefined;
        this.themeSettings = undefined;
        this.enableEdit = false;
        this.loading = false;
        this.loadingContent = false;
        this.sbt = false;
        //Only Letters Regex
        this.pattern = /^[a-z][a-z.\s-]{1,255}$/i;
        this.colorRegex = /^#[0-9a-fA-F]{8}$|#[0-9a-fA-F]{6}$|#[0-9a-fA-F]{4}$|#[0-9a-fA-F]{3}$/;
        this._appStateService.contentInfo.next('');
        this._appStateService.breadCrumbTitle.next('Chat Window Customizations');
        this.subscriptions.push(this._chatWindowCustomizations.GetDisplaySettings().subscribe(function (displaySettings) {
            if (displaySettings) {
                _this.displaySettings = displaySettings.settings.chatwindow.messageWindow;
                _this.displaySettingsBackup = JSON.parse(JSON.stringify(displaySettings.settings.chatwindow.messageWindow));
                _this.themeSettings = displaySettings.settings.chatwindow.themeSettings;
                _this.enableEdit = false;
                _this.form = formbuilder.group({
                    'heading': [
                        _this.displaySettings.heading,
                        [
                            forms_1.Validators.required,
                            forms_1.Validators.pattern(_this.pattern)
                        ]
                    ],
                    'sentBGColor': [
                        _this.displaySettings.sentBGColor,
                        [
                            forms_1.Validators.required,
                            forms_1.Validators.pattern(_this.colorRegex)
                        ]
                    ],
                    'sentForeColor': [
                        _this.displaySettings.sentForeColor,
                        [
                            forms_1.Validators.required,
                            forms_1.Validators.pattern(_this.colorRegex)
                        ]
                    ],
                    'recieveBGColor': [
                        _this.displaySettings.recieveBGColor,
                        [
                            forms_1.Validators.required,
                            forms_1.Validators.pattern(_this.colorRegex)
                        ]
                    ],
                    'recieveForeColor': [
                        _this.displaySettings.recieveForeColor,
                        [
                            forms_1.Validators.required,
                            forms_1.Validators.pattern(_this.colorRegex)
                        ]
                    ],
                    'sentBGAvatarColor': [
                        _this.displaySettings.sentBGAvatarColor,
                        [
                            forms_1.Validators.required,
                            forms_1.Validators.pattern(_this.colorRegex)
                        ]
                    ], 'sentForeAvatarColor': [
                        _this.displaySettings.sentForeAvatarColor,
                        [
                            forms_1.Validators.required,
                            forms_1.Validators.pattern(_this.colorRegex)
                        ]
                    ], 'recieveBGAvatarColor': [
                        _this.displaySettings.recieveBGAvatarColor,
                        [
                            forms_1.Validators.required,
                            forms_1.Validators.pattern(_this.colorRegex)
                        ]
                    ], 'recieveForeAvatarColor': [
                        _this.displaySettings.recieveForeAvatarColor,
                        [
                            forms_1.Validators.required,
                            forms_1.Validators.pattern(_this.colorRegex)
                        ]
                    ],
                });
            }
        }));
        this.subscriptions.push(_authService.SBT.subscribe(function (data) {
            _this.sbt = data;
        }));
    }
    MessageWindowComponent.prototype.ngOnInit = function () {
    };
    MessageWindowComponent.prototype.ngOnDestroy = function () {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.subscriptions.map(function (subscription) {
            subscription.unsubscribe();
        });
    };
    MessageWindowComponent.prototype.ColorChange = function (event, data) {
        this.form.get(event).setValue(this._chatWindowCustomizations.RGBAToHexAString(data));
    };
    MessageWindowComponent.prototype.Reset = function () {
        this.displaySettings = JSON.parse(JSON.stringify(this.displaySettingsBackup));
    };
    MessageWindowComponent.prototype.ResetToDefaults = function () {
        this.displaySettings = {
            heading: 'Hello from' + (this.sbt) ? 'SBT' : 'Beelinks',
            sentBGColor: '#D2D6DE66',
            sentForeColor: '#000000FF',
            recieveBGColor: '#FF681F1A',
            recieveForeColor: '#000000FF',
            sentBGAvatarColor: '#1F282EFF',
            sentForeAvatarColor: '#FFFFFFFF',
            recieveBGAvatarColor: '#FF681FFF',
            recieveForeAvatarColor: '#FFFFFFFF'
        };
    };
    MessageWindowComponent.prototype.EnableEdit = function (value) {
        this.enableEdit = value;
        if (!value) {
            this.form.get('heading').setValue(this.displaySettings.heading);
            this.form.get('sentBGColor').value,
                this.form.get('sentForeColor').value,
                this.form.get('recieveBGColor').value,
                this.form.get('recieveForeColor').value,
                this.form.get('sentBGAvatarColor').value,
                this.form.get('sentForeAvatarColor').value,
                this.form.get('recieveBGAvatarColor').value,
                this.form.get('recieveForeAvatarColor').value;
            this.form.updateValueAndValidity();
        }
    };
    MessageWindowComponent.prototype.SubmitForm = function (content) {
        var _this = this;
        (content) ? this.loadingContent = true : this.loading = true;
        this._chatWindowCustomizations.UpdateChatWindowContentSettings('messageWindow', this.displaySettings).subscribe(function (response) {
            (content) ? _this.loadingContent = false : _this.loading = false;
            if (response.status == 'ok') {
                _this.displaySettingsBackup = JSON.parse(JSON.stringify(_this.displaySettings));
                //this.displaySettings = this.form.value
                //Todo Completion Logic Here
            }
        }, function (err) {
            (content) ? _this.loadingContent = false : _this.loading = false;
            //Todo Error View Logic Here
        });
    };
    MessageWindowComponent.prototype.ApplyHeaderColorWithGradient = function (color) {
        return JSON.parse(JSON.parse(JSON.stringify("{\n      \"background\": \"linear-gradient(20deg," + this.themeSettings.headerSecondryColor + " 30%, " + this.themeSettings.headerColor + " 100%)\"\n    }")));
    };
    MessageWindowComponent = __decorate([
        core_1.Component({
            selector: 'app-message-window',
            templateUrl: './message-window.component.html',
            styleUrls: ['./message-window.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], MessageWindowComponent);
    return MessageWindowComponent;
}());
exports.MessageWindowComponent = MessageWindowComponent;
//# sourceMappingURL=message-window.component.js.map