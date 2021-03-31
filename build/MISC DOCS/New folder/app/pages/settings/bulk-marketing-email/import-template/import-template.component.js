"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportTemplateComponent = void 0;
var core_1 = require("@angular/core");
var toast_notifications_component_1 = require("../../../../dialogs/SnackBar-Dialog/toast-notifications.component");
var confirmation_dialog_component_1 = require("../../../../dialogs/confirmation-dialog/confirmation-dialog.component");
// import { CanComponentDeactivate } from '../../../../../services/ConfirmationGuard';
var ImportTemplateComponent = /** @class */ (function () {
    function ImportTemplateComponent(_globalStateService, snackBar, dialog, _emailTemplateService) {
        var _this = this;
        this._globalStateService = _globalStateService;
        this.snackBar = snackBar;
        this.dialog = dialog;
        this._emailTemplateService = _emailTemplateService;
        this.isDragged = false;
        this.ShowAttachmentAreaDnd = false;
        this.files = [];
        this.LinksArray = [];
        this.file = undefined;
        this.fileValid = true;
        this.nsp = '';
        this.template_name = '';
        this.email = '';
        this.subscriptions = [];
        this.all_templates = [];
        this.selectedTemplate = undefined;
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
            _this.buttons = data;
            switch (_this.buttons.buttonType) {
                case 'save':
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
                _this.selectedTemplate = data;
            }
            else {
                _this.selectedTemplate = undefined;
            }
            if (_this.selectedTemplate) {
                _this.template_name = _this.selectedTemplate.templateName;
                _this.file = _this.selectedTemplate.file;
            }
        }));
    }
    ImportTemplateComponent.prototype.ngOnInit = function () {
        this.Validation();
        // this.confirm();
    };
    // confirm() {
    //   return !this.file;
    // }
    ImportTemplateComponent.prototype.onFileSelected = function () {
        this.fileValid = true;
        if (this.fileInput.nativeElement.files.length > 0) {
            this.file = this.fileInput.nativeElement.files;
        }
        this.readURL(this.file);
    };
    ImportTemplateComponent.prototype.readURL = function (file) {
        var _this = this;
        if (file) {
            var picReader = new FileReader();
            picReader.addEventListener("load", function (event) {
                _this.textTarget = event.target.result;
            });
            picReader.readAsText(file[0]);
        }
    };
    ImportTemplateComponent.prototype.RemoveFile = function () {
        this.file = undefined;
        this.fileInput.nativeElement.value = '';
        this.ShowAttachmentAreaDnd = false;
    };
    ImportTemplateComponent.prototype.Validation = function () {
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
    ImportTemplateComponent.prototype.SaveTemplate = function () {
        var _this = this;
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
            // Read file and give html to obj
            var html = this.textTarget;
            var obj = {
                sourceType: 'importTemplate',
                templateName: this.template_name,
                html: html,
                createdDate: new Date().toISOString(),
                createdBy: this.email,
                nsp: this.nsp,
                lastModified: {},
                file: this.file
            };
            this._emailTemplateService.insertEmailTemplate(obj).subscribe(function (res) {
                if (res.status == "ok") {
                    _this.ShowAttachmentAreaDnd = false;
                    _this.fileInput.nativeElement.value = '';
                    _this.file = undefined;
                    _this.template_name = '';
                    _this._globalStateService.NavigateTo('/settings/ticket-management/bulk-marketing-email');
                }
            });
        }
    };
    ImportTemplateComponent.prototype.UpdateTemplate = function () {
        var _this = this;
        // Read file and give html to obj
        var html = this.textTarget;
        var obj = {
            sourceType: 'importTemplate',
            templateName: this.template_name,
            html: html,
            createdDate: '',
            createdBy: '',
            nsp: this.nsp,
            lastModified: {},
            file: this.file
        };
        this._emailTemplateService.UpdateTemplate(this.selectedTemplate._id, obj).subscribe(function (res) {
            if (res.status == "ok") {
                _this.ShowAttachmentAreaDnd = false;
                _this.fileInput.nativeElement.value = '';
                _this.file = undefined;
                _this.template_name = '';
                _this._globalStateService.NavigateTo('/settings/ticket-management/bulk-marketing-email');
            }
        });
    };
    ImportTemplateComponent.prototype.Cancel = function () {
        var _this = this;
        if (this.template_name || this.file) {
            this.dialog.open(confirmation_dialog_component_1.ConfirmationDialogComponent, {
                panelClass: ['confirmation-dialog'],
                data: { headermsg: 'Are you sure want to exit?' }
            }).afterClosed().subscribe(function (data) {
                if (data == 'ok') {
                    _this._emailTemplateService.selectedTemplate.next(undefined);
                    _this._globalStateService.NavigateTo('/settings/ticket-management/bulk-marketing-email');
                }
            });
        }
        else {
            console.log('impor else');
            this._emailTemplateService.selectedTemplate.next(undefined);
            this._globalStateService.NavigateTo('/settings/ticket-management/bulk-marketing-email');
        }
    };
    ImportTemplateComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.forEach(function (x) {
            x.unsubscribe();
        });
        this._emailTemplateService.selectedTemplate.next(undefined);
    };
    __decorate([
        core_1.ViewChild('fileInput')
    ], ImportTemplateComponent.prototype, "fileInput", void 0);
    ImportTemplateComponent = __decorate([
        core_1.Component({
            selector: 'app-import-template',
            templateUrl: './import-template.component.html',
            styleUrls: ['./import-template.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], ImportTemplateComponent);
    return ImportTemplateComponent;
}());
exports.ImportTemplateComponent = ImportTemplateComponent;
//# sourceMappingURL=import-template.component.js.map