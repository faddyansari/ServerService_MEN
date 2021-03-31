"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DialogThemeComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var DialogThemeComponent = /** @class */ (function () {
    function DialogThemeComponent(_chatWindowCustomizations, _appStateService, formbuilder, snackBar, dialog) {
        var _this = this;
        this._chatWindowCustomizations = _chatWindowCustomizations;
        this._appStateService = _appStateService;
        this.formbuilder = formbuilder;
        this.snackBar = snackBar;
        this.dialog = dialog;
        this.subscriptions = [];
        this.displaySettings = undefined;
        this.backupDisplaySettings = undefined;
        this.loading = false;
        this.colorRegex = /^#[0-9a-fA-F]{8}$|#[0-9a-fA-F]{6}$|#[0-9a-fA-F]{4}$|#[0-9a-fA-F]{3}$/;
        this._appStateService.contentInfo.next('');
        this._appStateService.breadCrumbTitle.next('Chat Window Customizations');
        this.subscriptions.push(this._chatWindowCustomizations.GetDisplaySettings().subscribe(function (displaySettings) {
            if (displaySettings) {
                _this.displaySettings = displaySettings.settings.chatwindow.dialogSettings;
                _this.backupDisplaySettings = JSON.parse(JSON.stringify(displaySettings.settings.chatwindow.dialogSettings));
                _this.form = formbuilder.group({
                    'dialogBgColor': [
                        _this.displaySettings.dialogBgColor,
                        [
                            forms_1.Validators.required,
                            forms_1.Validators.pattern(_this.colorRegex)
                        ]
                    ],
                    'dialogBtnColor': [
                        _this.displaySettings.dialogBtnColor,
                        [
                            forms_1.Validators.required,
                            forms_1.Validators.pattern(_this.colorRegex)
                        ]
                    ],
                    'dialogSecondaryBtnColor': [
                        _this.displaySettings.dialogSecondaryBtnColor,
                        [
                            forms_1.Validators.required,
                            forms_1.Validators.pattern(_this.colorRegex)
                        ]
                    ],
                    'dialogTextColor': [
                        _this.displaySettings.dialogTextColor,
                        [
                            forms_1.Validators.required,
                            forms_1.Validators.pattern(_this.colorRegex)
                        ]
                    ],
                    'dialogBtnTextColor': [
                        _this.displaySettings.dialogBtnTextColor,
                        [
                            forms_1.Validators.required,
                            forms_1.Validators.pattern(_this.colorRegex)
                        ]
                    ],
                    'dialogSecondaryBtnTextColor': [
                        _this.displaySettings.dialogSecondaryBtnTextColor,
                        [
                            forms_1.Validators.required,
                            forms_1.Validators.pattern(_this.colorRegex)
                        ]
                    ],
                    'dialogLogoColor': [
                        _this.displaySettings.dialogLogoColor,
                        [
                            forms_1.Validators.required,
                            forms_1.Validators.pattern(_this.colorRegex)
                        ]
                    ],
                });
            }
        }));
    }
    DialogThemeComponent.prototype.ngOnInit = function () {
    };
    DialogThemeComponent.prototype.SvgChangeColor = function () {
        var svgElement = this.logo.nativeElement.contentDocument.getElementsByTagName('path').item(0);
        svgElement.setAttribute('fill', this.displaySettings.dialogLogoColor);
    };
    DialogThemeComponent.prototype.ngOnDestroy = function () {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.subscriptions.map(function (subscription) {
            subscription.unsubscribe();
        });
    };
    DialogThemeComponent.prototype.ModelChange = function (event, data) {
        //console.log('Model Change');
        this.displaySettings[event] = this._chatWindowCustomizations.RGBAToHexAString(data).toLowerCase();
    };
    DialogThemeComponent.prototype.ColorChange = function (event, data) {
        var _this = this;
        setTimeout(function () {
            //console.log('Color Change');
            _this.form.get(event).setValue(_this._chatWindowCustomizations.RGBAToHexAString(data));
            if (event == 'dialogLogoColor')
                _this.SvgChangeColor();
        }, 0);
    };
    DialogThemeComponent.prototype.TransformColor = function (value) {
        return this._chatWindowCustomizations.RGBAToHexAString(value);
    };
    DialogThemeComponent.prototype.Reset = function () {
        this.displaySettings = JSON.parse(JSON.stringify(this.backupDisplaySettings));
        this.SvgChangeColor();
    };
    DialogThemeComponent.prototype.ResetToDefaults = function () {
        this.displaySettings = {
            dialogBgColor: '#FFFFFFFF',
            dialogBtnColor: '#368763FF',
            dialogSecondaryBtnColor: '#C9302CFF',
            dialogTextColor: '#231f20FF',
            dialogBtnTextColor: '#ColorChangeFFFFFFFF',
            dialogSecondaryBtnTextColor: '#FFFFFFFF',
            dialogLogoColor: '#F15C24FF'
        };
        this.SvgChangeColor();
    };
    DialogThemeComponent.prototype.SubmitForm = function () {
        var _this = this;
        this.loading = true;
        this._chatWindowCustomizations.UpdateChatWindowContentSettings('dialogSettings', this.displaySettings).subscribe(function (response) {
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
    __decorate([
        core_1.ViewChild('logo')
    ], DialogThemeComponent.prototype, "logo", void 0);
    DialogThemeComponent = __decorate([
        core_1.Component({
            selector: 'app-dialog-theme',
            templateUrl: './dialog-theme.component.html',
            styleUrls: ['./dialog-theme.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], DialogThemeComponent);
    return DialogThemeComponent;
}());
exports.DialogThemeComponent = DialogThemeComponent;
// db.tickets.find().snapshot().forEach(function(x)=>{
// 	printjson(x);
// 	})
//# sourceMappingURL=dialog-theme.component.js.map