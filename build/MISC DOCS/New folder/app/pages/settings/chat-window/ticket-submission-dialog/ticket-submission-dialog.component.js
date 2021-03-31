"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketSubmissionDialogComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var TicketSubmissionDialogComponent = /** @class */ (function () {
    function TicketSubmissionDialogComponent(_chatWindowCustomizations, _appStateService, formbuilder, snackBar, dialog) {
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
        this._appStateService.contentInfo.next('');
        this._appStateService.breadCrumbTitle.next('Chat Window Customizations');
        this.subscriptions.push(this._chatWindowCustomizations.GetDisplaySettings().subscribe(function (displaySettings) {
            _this.displaySettings = displaySettings.settings.chatwindow.ticketSubmitted;
            _this.themeSettings = displaySettings.settings.chatwindow.dialogSettings;
            _this.enableEdit = false;
            _this.form = formbuilder.group({
                'heading': [
                    _this.displaySettings.heading,
                    [
                        forms_1.Validators.required,
                    ]
                ],
                'content': [
                    _this.displaySettings.content,
                    [
                        forms_1.Validators.required,
                    ]
                ]
            });
        }));
    }
    TicketSubmissionDialogComponent.prototype.SvgChangeColor = function () {
        var svgElement = this.logo.nativeElement.contentDocument.getElementsByTagName('path').item(0);
        svgElement.setAttribute('fill', this.themeSettings.dialogLogoColor);
    };
    TicketSubmissionDialogComponent.prototype.ngOnInit = function () {
    };
    TicketSubmissionDialogComponent.prototype.ngOnDestroy = function () {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.subscriptions.map(function (subscription) {
            subscription.unsubscribe();
        });
    };
    TicketSubmissionDialogComponent.prototype.EnableEdit = function (value) {
        this.enableEdit = value;
        if (!value) {
            this.form.get('heading').setValue(this.displaySettings.heading);
            this.form.get('content').setValue(this.displaySettings.content);
            this.form.updateValueAndValidity();
        }
    };
    TicketSubmissionDialogComponent.prototype.SubmitForm = function () {
        var _this = this;
        this.loading = true;
        this._chatWindowCustomizations.UpdateChatWindowContentSettings('ticketSubmitted', {
            heading: this.form.get('heading').value,
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
    __decorate([
        core_1.ViewChild('logo')
    ], TicketSubmissionDialogComponent.prototype, "logo", void 0);
    TicketSubmissionDialogComponent = __decorate([
        core_1.Component({
            selector: 'app-ticket-submission-dialog',
            templateUrl: './ticket-submission-dialog.component.html',
            styleUrls: ['./ticket-submission-dialog.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None,
        })
    ], TicketSubmissionDialogComponent);
    return TicketSubmissionDialogComponent;
}());
exports.TicketSubmissionDialogComponent = TicketSubmissionDialogComponent;
//# sourceMappingURL=ticket-submission-dialog.component.js.map