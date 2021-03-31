"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketResponseComponent = void 0;
var core_1 = require("@angular/core");
var confirmation_dialog_component_1 = require("../../../../dialogs/confirmation-dialog/confirmation-dialog.component");
var toast_notifications_component_1 = require("../../../../dialogs/SnackBar-Dialog/toast-notifications.component");
var TicketResponseComponent = /** @class */ (function () {
    function TicketResponseComponent(_ticketService, _authService, dialog, _globalApplicationStateService, sanitized, snackBar) {
        var _this = this;
        this._ticketService = _ticketService;
        this._authService = _authService;
        this.dialog = dialog;
        this._globalApplicationStateService = _globalApplicationStateService;
        this.sanitized = sanitized;
        this.snackBar = snackBar;
        this.shiftdown = false;
        this.loading = false;
        this.signatureHeader = '';
        this.signatureFooter = '';
        this.id = '';
        this.signList = [];
        this.update = false;
        this.subscriptions = [];
        this.showSignatureForm = false;
        this.configHeader = {
            placeholder: 'Enter signature header..',
            toolbar: [
                ['style', ['bold', 'italic', 'underline', 'clear']],
                ['fontname', ['fontname']],
                ['table', ['table']],
                ['font', ['strikethrough', 'superscript', 'subscript']],
                ['fontstyle', ['backcolor']],
                ['fontsize', ['fontsize']],
                ['color', ['color']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['height', ['height']],
                ['insert', ['linkDialogShow', 'unlink']],
                ['view', ['fullscreen', 'codeview', 'help', 'undo', 'redo']]
            ]
        };
        this.configFooter = {
            placeholder: 'Enter signature footer..',
            toolbar: [
                ['style', ['bold', 'italic', 'underline', 'clear']],
                ['fontname', ['fontname']],
                ['table', ['table']],
                ['font', ['strikethrough', 'superscript', 'subscript']],
                ['fontstyle', ['backcolor']],
                ['fontsize', ['fontsize']],
                ['color', ['color']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['height', ['height']],
                // ['insert', ['unlink', 'link', 'picture']],
                ['insert', ['linkDialogShow', 'unlink']],
                ['view', ['fullscreen', 'codeview', 'help', 'undo', 'redo']]
            ]
        };
        this._globalApplicationStateService.contentInfo.next('');
        this._globalApplicationStateService.breadCrumbTitle.next('Ticket Management');
        this.subscriptions.push(_authService.getPackageInfo().subscribe(function (pkg) {
            if (pkg) {
                _this.package = pkg.tickets.signatures;
                if (!_this.package.allowed) {
                    _this._globalApplicationStateService.NavigateTo('/noaccess');
                }
            }
            // console.log(agent);
        }));
        this.subscriptions.push(this._ticketService.signList.subscribe(function (data) {
            _this.signList = data;
        }));
    }
    TicketResponseComponent.prototype.ngOnInit = function () {
    };
    TicketResponseComponent.prototype.SaveSignature = function () {
        var _this = this;
        this.loading = true;
        this._ticketService.SaveSignature({
            header: this.signatureHeader,
            footer: this.signatureFooter
        }).subscribe(function (data) {
            if (data) {
                _this.signatureHeader = '';
                _this.signatureFooter = '';
                _this.loading = false;
                _this.showSignatureForm = false;
                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: 'Signature added successfully!'
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'success']
                });
            }
        });
    };
    TicketResponseComponent.prototype.UpdateSignature = function () {
        var _this = this;
        this.loading = true;
        this._ticketService.UpdateSignature({
            header: this.signatureHeader,
            footer: this.signatureFooter,
            id: this.id,
            lastModified: ''
        }).subscribe(function (res) {
            if (res) {
                _this.signatureHeader = '';
                _this.signatureFooter = '';
                _this.id = '';
                _this.loading = false;
                _this.update = false;
                _this.showSignatureForm = false;
                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: 'Signature updated successfully!'
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'success']
                });
            }
        });
    };
    TicketResponseComponent.prototype.Toggle = function (signId, flag) {
        var _this = this;
        this.signList.map(function (val) {
            if (val.active) {
                val.active = false;
                return;
            }
        });
        this._ticketService.ToggleSignatures(signId, flag).subscribe(function (res) {
            if (res.status == "ok") {
                if (flag) {
                    _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                        data: {
                            img: 'ok',
                            msg: 'Signature activated successfully!'
                        },
                        duration: 2000,
                        panelClass: ['user-alert', 'success']
                    });
                }
                else {
                    _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                        data: {
                            img: 'ok',
                            msg: 'Signature deactivated successfully!'
                        },
                        duration: 2000,
                        panelClass: ['user-alert', 'success']
                    });
                }
            }
        });
    };
    TicketResponseComponent.prototype.toggleSignatureForm = function () {
        var _this = this;
        if (this.signatureFooter || this.signatureHeader) {
            this.dialog.open(confirmation_dialog_component_1.ConfirmationDialogComponent, {
                panelClass: ['confirmation-dialog'],
                data: { headermsg: 'Are you sure want to leave?' }
            }).afterClosed().subscribe(function (data) {
                if (data == 'ok') {
                    _this.showSignatureForm = !_this.showSignatureForm;
                    _this.signatureFooter = '';
                    _this.signatureHeader = '';
                }
                else {
                    return;
                }
            });
        }
        else {
            this.showSignatureForm = !this.showSignatureForm;
            this.signatureFooter = '';
            this.signatureHeader = '';
        }
    };
    TicketResponseComponent.prototype.Delete = function (signId) {
        var _this = this;
        this.dialog.open(confirmation_dialog_component_1.ConfirmationDialogComponent, {
            panelClass: ['confirmation-dialog'],
            data: { headermsg: 'Are you sure you want To delete this signature?' }
        }).afterClosed().subscribe(function (data) {
            if (data == 'ok') {
                _this._ticketService.DeleteSignatures(signId).subscribe(function (res) {
                    if (res.status == "ok") {
                        _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                            data: {
                                img: 'ok',
                                msg: 'Signature deleted successfully!'
                            },
                            duration: 2000,
                            panelClass: ['user-alert', 'success']
                        });
                    }
                });
            }
        });
    };
    TicketResponseComponent.prototype.Edit = function (signId) {
        this.update = true;
        this.showSignatureForm = true;
        var index = this.signList.findIndex(function (x) { return x._id == signId; });
        this.signatureHeader = this.signList[index].header;
        this.signatureFooter = this.signList[index].footer;
        this.id = this.signList[index]._id;
    };
    TicketResponseComponent.prototype.popperOnClick = function (data) {
        var _this = this;
        setTimeout(function () {
            _this.signList.forEach(function (element) {
                if (element._id == data._id) {
                    if (element.header) {
                        var headerCode = data.header;
                        _this.previewTemplateHeader = _this.sanitized.bypassSecurityTrustHtml(headerCode);
                    }
                    if (element.footer) {
                        var footerCode = data.footer;
                        _this.previewTemplateFooter = _this.sanitized.bypassSecurityTrustHtml(footerCode);
                    }
                }
            });
        }, 0);
    };
    TicketResponseComponent.prototype.ClosePopper = function () {
        this.previewPopper.hide();
    };
    TicketResponseComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.map(function (subscription) {
            subscription.unsubscribe();
        });
    };
    __decorate([
        core_1.ViewChild('previewPopper')
    ], TicketResponseComponent.prototype, "previewPopper", void 0);
    TicketResponseComponent = __decorate([
        core_1.Component({
            selector: 'app-ticket-response',
            templateUrl: './ticket-response.component.html',
            styleUrls: ['./ticket-response.component.css'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], TicketResponseComponent);
    return TicketResponseComponent;
}());
exports.TicketResponseComponent = TicketResponseComponent;
//# sourceMappingURL=ticket-response.component.js.map