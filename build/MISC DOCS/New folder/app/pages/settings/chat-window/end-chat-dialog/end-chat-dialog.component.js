"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EndChatDialogComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var EndChatDialogComponent = /** @class */ (function () {
    function EndChatDialogComponent(_chatWindowCustomizations, _appStateService, formbuilder, snackBar, dialog) {
        var _this = this;
        this._chatWindowCustomizations = _chatWindowCustomizations;
        this._appStateService = _appStateService;
        this.formbuilder = formbuilder;
        this.snackBar = snackBar;
        this.dialog = dialog;
        this.subscriptions = [];
        this.displaySettings = undefined;
        this.enableEdit = false;
        this.loading = false;
        //Only Letters Regex
        this.pattern = /^[a-z][a-z.\s-]{1,255}\?*$/i;
        this._appStateService.contentInfo.next('');
        this._appStateService.breadCrumbTitle.next('Chat Window Customizations');
        this.form = formbuilder.group({
            'content': [
                '',
                [
                    forms_1.Validators.required,
                    forms_1.Validators.pattern(this.pattern)
                ]
            ]
        });
        this.subscriptions.push(this._chatWindowCustomizations.GetDisplaySettings().subscribe(function (displaySettings) {
            if (displaySettings) {
                _this.displaySettings = displaySettings.settings.chatwindow.closeScreen;
                _this.enableEdit = false;
                _this.themeSettings = displaySettings.settings.chatwindow.dialogSettings;
                _this.form = formbuilder.group({
                    'content': [
                        _this.displaySettings.content,
                        [
                            forms_1.Validators.required,
                            forms_1.Validators.pattern(_this.pattern)
                        ]
                    ]
                });
            }
        }));
    }
    EndChatDialogComponent.prototype.ngOnInit = function () {
    };
    EndChatDialogComponent.prototype.SvgChangeColor = function () {
        var svgElement = this.logo.nativeElement.contentDocument.getElementsByTagName('path').item(0);
        svgElement.setAttribute('fill', this.themeSettings.dialogLogoColor);
    };
    EndChatDialogComponent.prototype.EnableEdit = function (value) {
        this.enableEdit = value;
        if (!value) {
            this.form.get('content').setValue(this.displaySettings.content);
            this.form.updateValueAndValidity();
        }
    };
    EndChatDialogComponent.prototype.SubmitForm = function () {
        var _this = this;
        this.loading = true;
        this._chatWindowCustomizations.UpdateChatWindowContentSettings('closeScreen', {
            content: this.form.get('content').value,
            btn1Text: this.displaySettings.btn1Text,
            btn2Text: this.displaySettings.btn2Text
        }).subscribe(function (response) {
            _this.loading = false;
            if (response.status == 'ok') {
                //Todo Completion Logic Here
            }
        }, function (err) {
            _this.loading = false;
            //Todo Error View Logic Here
        });
    };
    EndChatDialogComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
    };
    __decorate([
        core_1.ViewChild('logo')
    ], EndChatDialogComponent.prototype, "logo", void 0);
    EndChatDialogComponent = __decorate([
        core_1.Component({
            selector: 'app-end-chat-dialog',
            templateUrl: './end-chat-dialog.component.html',
            styleUrls: ['./end-chat-dialog.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], EndChatDialogComponent);
    return EndChatDialogComponent;
}());
exports.EndChatDialogComponent = EndChatDialogComponent;
//# sourceMappingURL=end-chat-dialog.component.js.map