"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddForwardTicketComponent = void 0;
var core_1 = require("@angular/core");
var dialog_1 = require("@angular/material/dialog");
var toast_notifications_component_1 = require("../SnackBar-Dialog/toast-notifications.component");
var AddForwardTicketComponent = /** @class */ (function () {
    function AddForwardTicketComponent(data, _ticketService, dialogRef, snackBar) {
        this.data = data;
        this._ticketService = _ticketService;
        this.dialogRef = dialogRef;
        this.snackBar = snackBar;
        this.email = '';
        this.loading = false;
        this.invalidEmail = false;
        this.shiftdown = false;
        this.emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        this.config = {
            placeholder: 'Add Note..',
            toolbar: [
                ['style', ['bold', 'italic', 'underline']],
                ['fontsize', ['fontsize']],
                ['color', ['color']],
                ['fontName', ['fontName']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['height', ['400']],
                ['insert', ['linkDialogShow', 'unlink']],
                ['view', ['fullscreen', 'codeview', 'undo', 'redo']]
            ]
        };
        (data.message) ? this.selectedMmessage = data.message.message : '';
        (data.ticket) ? this.ticket = data.ticket : '';
        //console.log(data);
    }
    AddForwardTicketComponent.prototype.ngOnInit = function () {
    };
    AddForwardTicketComponent.prototype.Forward = function () {
        var _this = this;
        if (new RegExp(this.emailPattern).test(this.email)) {
            this.invalidEmail = false;
            this.loading = true;
            this._ticketService.ForwardMessageAsTicket(this.email, this.selectedMmessage, this.ticket).subscribe(function (response) {
                _this.loading = false;
                if (response.status == 'ok') {
                    _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                        data: {
                            img: 'ok',
                            msg: 'Message Forwarded successfully!'
                        },
                        duration: 2000,
                        panelClass: ['user-alert', 'success']
                    });
                }
                else {
                    _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                        data: {
                            img: 'warning',
                            msg: 'Message Sending failed!'
                        },
                        duration: 2000,
                        panelClass: ['user-alert', 'error']
                    });
                }
                _this.dialogRef.close();
            });
        }
        else
            this.invalidEmail = true;
    };
    AddForwardTicketComponent.prototype.keydownX = function (event) {
        switch (event.key.toLowerCase()) {
            case 'shift':
                {
                    this.shiftdown = true;
                    break;
                }
        }
    };
    AddForwardTicketComponent.prototype.keyupX = function (event) {
        var _this = this;
        switch (event.key.toLowerCase()) {
            case 'enter':
                {
                    if (!this.shiftdown) {
                        this.data.message.message = this.data.message.message.trim();
                    }
                    break;
                }
            case 'shift':
                {
                    setTimeout(function () {
                        _this.shiftdown = false;
                    }, 100);
                    break;
                }
        }
    };
    AddForwardTicketComponent = __decorate([
        core_1.Component({
            selector: 'app-add-forward-ticket',
            templateUrl: './add-forward-ticket.component.html',
            styleUrls: ['./add-forward-ticket.component.css'],
            encapsulation: core_1.ViewEncapsulation.None
        }),
        __param(0, core_1.Inject(dialog_1.MAT_DIALOG_DATA))
    ], AddForwardTicketComponent);
    return AddForwardTicketComponent;
}());
exports.AddForwardTicketComponent = AddForwardTicketComponent;
//# sourceMappingURL=add-forward-ticket.component.js.map