"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketFormDialogComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var TicketFormDialogComponent = /** @class */ (function () {
    function TicketFormDialogComponent(_chatWindowCustomizations, _appStateService, formbuilder, snackBar, dialog) {
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
        this.pattern = /^[a-z][a-z.\s-]{1,255}$/i;
        this._appStateService.contentInfo.next('');
        this._appStateService.breadCrumbTitle.next('Chat Window Customizations');
        this.subscriptions.push(this._chatWindowCustomizations.GetDisplaySettings().subscribe(function (displaySettings) {
            if (displaySettings) {
                _this.displaySettings = displaySettings.settings.chatwindow.ticketForm;
                _this.themeSettings = displaySettings.settings.chatwindow.dialogSettings;
                _this.enableEdit = false;
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
    TicketFormDialogComponent.prototype.ngOnInit = function () {
    };
    TicketFormDialogComponent.prototype.ngOnDestroy = function () {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.subscriptions.map(function (subscription) {
            subscription.unsubscribe();
        });
    };
    TicketFormDialogComponent.prototype.EnableEdit = function (value) {
        this.enableEdit = value;
        if (!value) {
            this.form.get('content').setValue(this.displaySettings.content);
            this.form.updateValueAndValidity();
        }
    };
    TicketFormDialogComponent.prototype.SubmitForm = function () {
        var _this = this;
        this.loading = true;
        this._chatWindowCustomizations.UpdateChatWindowContentSettings('ticketForm', {
            btnText: this.displaySettings.btnText,
            content: this.form.get('content').value
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
    TicketFormDialogComponent = __decorate([
        core_1.Component({
            selector: 'app-ticket-form-dialog',
            templateUrl: './ticket-form-dialog.component.html',
            styleUrls: ['./ticket-form-dialog.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], TicketFormDialogComponent);
    return TicketFormDialogComponent;
}());
exports.TicketFormDialogComponent = TicketFormDialogComponent;
//# sourceMappingURL=ticket-form-dialog.component.js.map