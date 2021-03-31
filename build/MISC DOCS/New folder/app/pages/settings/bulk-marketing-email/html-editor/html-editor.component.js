"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HtmlEditorComponent = void 0;
var core_1 = require("@angular/core");
var toast_notifications_component_1 = require("../../../../dialogs/SnackBar-Dialog/toast-notifications.component");
var confirmation_dialog_component_1 = require("../../../../dialogs/confirmation-dialog/confirmation-dialog.component");
var HtmlEditorComponent = /** @class */ (function () {
    function HtmlEditorComponent(_globalStateService, router, snackBar, dialog, _emailTemplateService) {
        var _this = this;
        this._globalStateService = _globalStateService;
        this.router = router;
        this.snackBar = snackBar;
        this.dialog = dialog;
        this._emailTemplateService = _emailTemplateService;
        this.shiftdown = false;
        this.template_name = '';
        this.nsp = '';
        this.email = '';
        this.all_templates = [];
        this.subscriptions = [];
        this.selectedtemplate = undefined;
        this.buttons = undefined;
        this.codeMirrorOptions = {
            theme: 'base16-light',
            mode: { name: 'javascript' },
            lineNumbers: true,
            lineWrapping: true,
            foldGutter: true,
            gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers'],
            autoCloseBrackets: true,
            matchBrackets: true,
            lint: true
        };
        this.previewCode = '';
        this.nsp = this._emailTemplateService.Agent.nsp;
        this.email = this._emailTemplateService.Agent.email;
        this.subscriptions.push(this._emailTemplateService.AllTemplates.subscribe(function (data) {
            if (data && data.length) {
                _this.all_templates = data;
            }
        }));
        this.subscriptions.push(this._emailTemplateService.ButtonPressed.subscribe(function (data) {
            console.log(data);
            _this.buttons = data;
            switch (_this.buttons.buttonType) {
                case 'save':
                    _this.SaveTemplate();
                    break;
                case 'saveAsNew':
                    _this.SaveTemplate();
                    break;
                case 'cancel':
                    _this.Cancel();
                    break;
                case 'update':
                    _this.UpdateTemplate();
                    break;
            }
        }));
        this.subscriptions.push(this._emailTemplateService.selectedTemplate.subscribe(function (data) {
            if (data) {
                console.log(data);
                _this.selectedtemplate = data;
                _this.template_name = _this.selectedtemplate.templateName;
                _this.previewCode = _this.selectedtemplate.code;
            }
            else {
                _this.selectedtemplate = undefined;
            }
        }));
    }
    HtmlEditorComponent.prototype.ngOnInit = function () {
        this.Validation();
        // this.confirm();
    };
    HtmlEditorComponent.prototype.AllValidations = function () {
        return !(this.previewCode.replace(/&nbsp;|<br>|<\/br>/g, ' ').trim() && this.template_name && this.previewCode.replace(/<\/?((?!(b|i|u|br|img|iframe)\b)\w*)\/?>/g, ' ').trim());
    };
    // ChangeRoute() {
    // this.confirm();
    // }
    HtmlEditorComponent.prototype.Validation = function () {
        var _this = this;
        if (!this.template_name) {
            setTimeout(function () {
                _this._emailTemplateService.validation.next({
                    buttonType: 'save',
                    disabled: true
                });
            }, 0);
        }
        else {
            setTimeout(function () {
                _this._emailTemplateService.validation.next({
                    buttonType: 'save',
                    disabled: false
                });
            }, 0);
        }
    };
    HtmlEditorComponent.prototype.SaveTemplate = function () {
        var _this = this;
        var span = document.createElement('span');
        span.innerHTML = this.previewCode;
        if (this.all_templates && this.all_templates.filter(function (data) { return data.templateName == _this.template_name.toLowerCase(); }).length > 0) {
            this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                data: {
                    img: 'warning',
                    msg: 'Same Template Name already exists! Kindly change it'
                },
                duration: 3000,
                panelClass: ['user-alert', 'error']
            });
            return;
        }
        else {
            var obj = {
                sourceType: 'htmlEditor',
                templateName: this.template_name,
                nsp: this.nsp,
                html: span.innerText,
                lastModified: {},
                code: this.previewCode,
                createdDate: new Date().toISOString(),
                createdBy: this.email
            };
            this._emailTemplateService.insertEmailTemplate(obj).subscribe(function (res) {
                if (res.status == "ok") {
                    _this.previewCode = '';
                    _this.template_name = '';
                    _this._globalStateService.NavigateTo('/settings/ticket-management/bulk-marketing-email');
                }
            });
        }
    };
    // confirm() {
    //   return !this.htmlString;
    // }
    HtmlEditorComponent.prototype.UpdateTemplate = function () {
        var _this = this;
        var span = document.createElement('span');
        span.innerHTML = this.previewCode;
        var obj = {
            sourceType: 'htmlEditor',
            templateName: this.template_name,
            nsp: this.nsp,
            html: span.innerText,
            code: this.previewCode,
            lastModified: {},
            createdDate: this.selectedtemplate.createdDate,
            createdBy: this.selectedtemplate.createdBy
        };
        this._emailTemplateService.UpdateTemplate(this.selectedtemplate._id, obj).subscribe(function (response) {
            if (response.status == "ok") {
                _this.template_name = '';
                _this._globalStateService.NavigateTo('/settings/ticket-management/bulk-marketing-email');
            }
        });
    };
    HtmlEditorComponent.prototype.Cancel = function () {
        var _this = this;
        if (this.template_name || this.previewCode) {
            this.dialog.open(confirmation_dialog_component_1.ConfirmationDialogComponent, {
                panelClass: ['confirmation-dialog'],
                data: { headermsg: 'Are you sure want to exit?' }
            }).afterClosed().subscribe(function (data) {
                if (data == 'ok') {
                    _this._emailTemplateService.selectedTemplate.next(undefined);
                    _this._globalStateService.NavigateTo('/settings/ticket-management/bulk-marketing-email');
                }
                else {
                    return;
                }
            });
        }
        else {
            console.log('html eidtor else');
            this._emailTemplateService.selectedTemplate.next(undefined);
            this._globalStateService.NavigateTo('/settings/ticket-management/bulk-marketing-email');
        }
    };
    HtmlEditorComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.forEach(function (x) {
            x.unsubscribe();
        });
        this._emailTemplateService.selectedTemplate.next(undefined);
    };
    HtmlEditorComponent = __decorate([
        core_1.Component({
            selector: 'app-html-editor',
            templateUrl: './html-editor.component.html',
            styleUrls: ['./html-editor.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], HtmlEditorComponent);
    return HtmlEditorComponent;
}());
exports.HtmlEditorComponent = HtmlEditorComponent;
//# sourceMappingURL=html-editor.component.js.map