"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddAcknowledgeMessageComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var confirmation_dialog_component_1 = require("../../../../../dialogs/confirmation-dialog/confirmation-dialog.component");
var toast_notifications_component_1 = require("../../../../../dialogs/SnackBar-Dialog/toast-notifications.component");
var preview_ack_message_component_1 = require("../../../../../dialogs/preview-ack-message/preview-ack-message.component");
var AddAcknowledgeMessageComponent = /** @class */ (function () {
    function AddAcknowledgeMessageComponent(formbuilder, _ackMessagesvc, dialog, snackBar, _ticketTemplateService, _globalStateService) {
        var _this = this;
        this.formbuilder = formbuilder;
        this._ackMessagesvc = _ackMessagesvc;
        this.dialog = dialog;
        this.snackBar = snackBar;
        this._ticketTemplateService = _ticketTemplateService;
        this._globalStateService = _globalStateService;
        this.subscriptions = [];
        this.emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        this.whiteSpaceRegex = /^[^-\s][a-zA-Z0-9_\s-]+$/;
        this.ackMessagesList = [];
        this.automatedResponses = [];
        this.selectedMessage = undefined;
        this.ticketFields = [{ name: "Ticket ID", value: "{{ticket.id}}" }, { name: "Ticket Priority", value: "{{ticket.priority}}" }, { name: "Ticket State", value: "{{ticket.state}}" }, { name: "Ticket Source", value: "{{ticket.source}}" }, { name: "Ticket Assigned Agent", value: "{{ticket.assignedTo}}" }];
        this.requestorFields = [{ name: "Visitor Name", value: "{{visitor.name}}" }, { name: "Visitor Email", value: "{{visitor.email}}" }];
        this.pills = {
            'tickets': true,
            'requestor': false,
        };
        this.config = {
            placeholder: 'Enter message..',
            toolbar: [
                ['style', ['bold', 'italic', 'underline']],
                ['fontname', ['fontname']],
                ['font', ['strikethrough', 'superscript', 'subscript']],
                ['fontstyle', ['backcolor']],
                ['fontsize', ['fontsize']],
                ['color', ['color']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['height', ['200']],
                ['insert', ['linkDialogShow', 'unlink']],
                ['view', ['fullscreen', 'undo', 'redo']]
            ]
        };
        this.subscriptions.push(this._ackMessagesvc.AllAckMessages.subscribe(function (res) {
            if (res && res.length) {
                _this.ackMessagesList = res;
            }
        }));
        this.subscriptions.push(this._ticketTemplateService.getAutomatedResponseAgainstAgent().subscribe(function (data) {
            if (data.status == "ok") {
                _this.automatedResponses = data.AutomatedResponses;
            }
        }));
        this.subscriptions.push(this._ackMessagesvc.selectedAckMessage.subscribe(function (data) {
            if (data) {
                _this.selectedMessage = data;
            }
        }));
    }
    AddAcknowledgeMessageComponent.prototype.ngOnInit = function () {
        this.ackMessageForm = this.formbuilder.group({
            'name': [
                '',
                [
                    forms_1.Validators.required,
                    forms_1.Validators.minLength(2),
                    forms_1.Validators.pattern(this.whiteSpaceRegex)
                ],
            ],
            'disabledFor': [
                [],
                [
                    forms_1.Validators.required,
                    forms_1.Validators.pattern(this.emailPattern)
                ],
            ],
            'message': [
                '',
                [
                    forms_1.Validators.required,
                    forms_1.Validators.minLength(5),
                    forms_1.Validators.pattern(this.whiteSpaceRegex)
                ],
            ],
        });
        if (this.selectedMessage) {
            this.ackMessageForm.get('name').setValue(this.selectedMessage.name);
            this.ackMessageForm.get('message').setValue(this.selectedMessage.message);
            this.ackMessageForm.get('disabledFor').setValue(this.selectedMessage.disabledFor);
        }
    };
    AddAcknowledgeMessageComponent.prototype.GotoAR = function (ev) {
        if (ev) {
            this._globalStateService.NavigateForce('/settings/general/automated-responses');
        }
    };
    AddAcknowledgeMessageComponent.prototype.ClosePopper = function () {
        this.insertPlaceholder.hide();
    };
    AddAcknowledgeMessageComponent.prototype.InsertCannedMessage = function (hashTag) {
        var result = '';
        this.automatedResponses.map(function (val) {
            if (val.hashTag == hashTag) {
                result = val.responseText;
            }
        });
        this.ackMessageForm.get('message').setValue(this.ackMessageForm.get('message').value + ' ' + result.toString());
        this.cannedResponsePopper.hide();
    };
    AddAcknowledgeMessageComponent.prototype.setPillActive = function (pill) {
        var _this = this;
        Object.keys(this.pills).map(function (key) {
            if (key == pill) {
                _this.pills[key] = true;
            }
            else {
                _this.pills[key] = false;
            }
        });
    };
    AddAcknowledgeMessageComponent.prototype.AddTicketField = function (name) {
        var result = '';
        this.ticketFields.map(function (val) {
            if (val.name == name) {
                result = val.value;
            }
        });
        this.ackMessageForm.get('message').setValue(this.ackMessageForm.get('message').value + ' ' + result.toString());
    };
    AddAcknowledgeMessageComponent.prototype.AddRequestorField = function (name) {
        var result = '';
        this.requestorFields.map(function (val) {
            if (val.name == name) {
                result = val.value;
            }
        });
        this.ackMessageForm.get('message').setValue(this.ackMessageForm.get('message').value + ' ' + result.toString());
    };
    AddAcknowledgeMessageComponent.prototype.CancelAckMessage = function () {
        var _this = this;
        if (this.ackMessageForm.get('name').value || this.ackMessageForm.get('message').value) {
            this.dialog.open(confirmation_dialog_component_1.ConfirmationDialogComponent, {
                panelClass: ['confirmation-dialog'],
                data: { headermsg: 'Are you sure want to leave?' }
            }).afterClosed().subscribe(function (data) {
                if (data == 'ok') {
                    _this._ackMessagesvc.selectedAckMessage.next(undefined);
                    _this._ackMessagesvc.AddAckMessage.next(false);
                }
                else {
                    return;
                }
            });
        }
        else {
            this._ackMessagesvc.selectedAckMessage.next(undefined);
            this._ackMessagesvc.AddAckMessage.next(false);
        }
    };
    AddAcknowledgeMessageComponent.prototype.UpdateAckMessage = function () {
        var _this = this;
        var obj = {
            name: this.ackMessageForm.get('name').value,
            message: this.ackMessageForm.get('message').value,
            disabledFor: this.ackMessageForm.get('disabledFor').value,
            activated: this.selectedMessage.activated
        };
        if (obj.name.toLowerCase().trim() != this.selectedMessage.name.toLowerCase().trim()) {
            if (this.ackMessagesList && this.ackMessagesList.filter(function (data) { return data.name.toLowerCase().trim() == obj.name.toLowerCase().trim(); }).length > 0) {
                this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'warning',
                        msg: 'Ack. message name already exists!'
                    },
                    duration: 3000,
                    panelClass: ['user-alert', 'warning']
                });
                return;
            }
            else {
                console.log("in else");
                var index = this.ackMessagesList.findIndex(function (x) { return x.name == _this.selectedMessage.name; });
                this.ackMessagesList[index] = obj;
                this._ackMessagesvc.updateAckMessage(this.ackMessagesList).subscribe(function (res) {
                    if (res.status == "ok") {
                    }
                });
            }
        }
        else {
            var index = this.ackMessagesList.findIndex(function (x) { return x.name == _this.selectedMessage.name; });
            this.ackMessagesList[index] = obj;
            this._ackMessagesvc.updateAckMessage(this.ackMessagesList).subscribe(function (res) {
                if (res.status == "ok") {
                }
            });
        }
    };
    AddAcknowledgeMessageComponent.prototype.PreviewAckMessage = function () {
        var ackPreviewObj = {
            name: this.ackMessageForm.get('name').value,
            message: this.ackMessageForm.get('message').value,
        };
        this.dialog.open(preview_ack_message_component_1.PreviewAckMessageComponent, {
            panelClass: ['small-dialog'],
            disableClose: true,
            autoFocus: true,
            data: ackPreviewObj
        }).afterClosed().subscribe(function (data) {
        });
    };
    AddAcknowledgeMessageComponent.prototype.AddAckMessage = function () {
        var _this = this;
        if (this.ackMessagesList && this.ackMessagesList.filter(function (data) { return data.name.toLowerCase().trim() == _this.ackMessageForm.get('name').value.toLowerCase().trim(); }).length > 0) {
            this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                data: {
                    img: 'warning',
                    msg: 'Ack. message name already exists!'
                },
                duration: 3000,
                panelClass: ['user-alert', 'warning']
            });
            return;
        }
        else {
            var obj = {
                name: this.ackMessageForm.get('name').value,
                message: this.ackMessageForm.get('message').value,
                disabledFor: this.ackMessageForm.get('disabledFor').value,
                activated: false
            };
            if (this.ackMessagesList && !this.ackMessagesList.length)
                this.ackMessagesList = [];
            var temp_1 = Array.from(this.ackMessagesList);
            temp_1.push(obj);
            this._ackMessagesvc.addAckMessage(temp_1).subscribe(function (res) {
                if (res.status == "ok") {
                }
            });
        }
    };
    AddAcknowledgeMessageComponent.prototype.ngOnDestroy = function () {
        this._ackMessagesvc.AddAckMessage.next(false);
        this.subscriptions.map(function (subscription) {
            subscription.unsubscribe();
        });
    };
    __decorate([
        core_1.ViewChild('cannedResponsePopper')
    ], AddAcknowledgeMessageComponent.prototype, "cannedResponsePopper", void 0);
    __decorate([
        core_1.ViewChild('insertPlaceholder')
    ], AddAcknowledgeMessageComponent.prototype, "insertPlaceholder", void 0);
    AddAcknowledgeMessageComponent = __decorate([
        core_1.Component({
            selector: 'app-add-acknowledge-message',
            templateUrl: './add-acknowledge-message.component.html',
            styleUrls: ['./add-acknowledge-message.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], AddAcknowledgeMessageComponent);
    return AddAcknowledgeMessageComponent;
}());
exports.AddAcknowledgeMessageComponent = AddAcknowledgeMessageComponent;
//# sourceMappingURL=add-acknowledge-message.component.js.map