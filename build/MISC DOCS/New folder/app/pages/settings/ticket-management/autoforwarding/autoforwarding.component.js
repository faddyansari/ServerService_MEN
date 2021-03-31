"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoforwardingComponent = void 0;
var core_1 = require("@angular/core");
var toast_notifications_component_1 = require("../../../../dialogs/SnackBar-Dialog/toast-notifications.component");
var confirmation_dialog_component_1 = require("../../../../dialogs/confirmation-dialog/confirmation-dialog.component");
var AutoforwardingComponent = /** @class */ (function () {
    function AutoforwardingComponent(dialog, _ticketAutomationService, _authService, _ticketService, snackBar, _appStateService) {
        var _this = this;
        this.dialog = dialog;
        this._ticketAutomationService = _ticketAutomationService;
        this._authService = _authService;
        this._ticketService = _ticketService;
        this.snackBar = snackBar;
        this._appStateService = _appStateService;
        this.subscriptions = [];
        this.currentAgent = '';
        this.email = '';
        this.loading = false;
        this.group = '';
        this.toggle = false;
        this.incomingEmail = '';
        this.domainEmail = '';
        this.groupName = '';
        this.name = '';
        this.enableEdit = false;
        this.agentsArray = [];
        this.arr = [];
        this.nsp = '';
        this.agentEmails = [];
        this.agentEmailsValidation = [];
        this.id = '';
        this.showEmailForm = false;
        this.emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        this.activationLoading = false;
        this.activationID = '';
        this._appStateService.contentInfo.next('');
        this._appStateService.breadCrumbTitle.next('Ticket Management');
        this.subscriptions.push(_authService.getPackageInfo().subscribe(function (pkg) {
            if (pkg) {
                _this.package = pkg.tickets.incomingEmail;
                if (!_this.package.allowed) {
                    _this._appStateService.NavigateTo('/noaccess');
                }
            }
            // console.log(agent);
        }));
        this.subscriptions.push(_authService.getAgent().subscribe(function (agent) {
            if (agent && Object.keys(agent).length) {
                _this.agent = agent;
                _this.nsp = _this.agent.nsp;
                _this.currentAgent = _this.agent.email;
                _this.domainEmail = '@' + _this.nsp.slice(1).split('.')[0] + '.bizzchats.com';
            }
            // console.log(agent);
        }));
        this.subscriptions.push(this._ticketService.getNotification().subscribe(function (notification) {
            if (notification) {
                // console.log(notification);
                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: notification.img,
                        msg: notification.msg
                    },
                    duration: 3000,
                    panelClass: ['user-alert', (notification.type == 'success') ? 'success' : 'error']
                }).afterDismissed().subscribe(function () {
                    _ticketService.clearNotification();
                });
            }
        }));
        this.subscriptions.push(_ticketService.IncomingEmailsByNSP.subscribe(function (data) {
            _this.agentEmails = data;
            // console.log(this.agentEmails);
        }));
        this.subscriptions.push(_ticketService.IncomingEmails.subscribe(function (data) {
            _this.agentEmailsValidation = data;
            // console.log(this.agentEmailsValidation);
        }));
        this.subscriptions.push(_ticketService.activationLoading.subscribe(function (data) {
            _this.activationLoading = data;
            if (!_this.activationLoading) {
                _this.activationID = '';
            }
            // console.log(this.agentEmailsValidation);
        }));
        this.subscriptions.push(this._ticketAutomationService.Groups.subscribe(function (data) {
            _this.Group = data;
            // console.log(this.Group.groups);
        }));
    }
    AutoforwardingComponent.prototype.TransformIncomingEmail = function (value) {
        if (value)
            return value.split('@')[0];
        else
            return '';
    };
    AutoforwardingComponent.prototype.GetDomainEmail = function (incomingEmail, domainEmail) {
        if (incomingEmail && domainEmail)
            return incomingEmail.split('@')[0] + domainEmail.split('@')[1];
        else
            return '';
    };
    AutoforwardingComponent.prototype.isNullOrWhiteSpace = function () {
        return !this.name.replace(/&nbsp;|<br>|<\/br>/g, ' ').trim();
    };
    AutoforwardingComponent.prototype.insertEmail = function (domainEmail, incomingEmail, group, name) {
        var _this = this;
        if (this.package && this.package.allowed) {
            if (this.emailRegex.test(incomingEmail)) {
                this.loading = true;
                var first = this.nsp.split('.')[0].split('/');
                domainEmail = incomingEmail.split('@')[0] + "@" + first[1] + ".bizzchats.com";
                this._ticketService.getIncomingEmails(domainEmail).subscribe(function (res) {
                    if (res.status == "ok") {
                        if (res.emaildata && res.emaildata.filter(function (data) { return data.domainEmail == domainEmail; }).length > 0) {
                            _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                                data: {
                                    img: 'warning',
                                    msg: 'Same Email already exists! Kindly change it'
                                },
                                duration: 3000,
                                panelClass: ['user-alert', 'error']
                            });
                        }
                        _this.loading = false;
                        return;
                    }
                    else {
                        _this._ticketService.AddIncomingEmail(domainEmail, incomingEmail, group, name).subscribe(function (response) {
                            if (response.status == 'ok') {
                                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                                    data: {
                                        img: 'ok',
                                        msg: 'Incoming Email added Successfully!'
                                    },
                                    duration: 3000,
                                    panelClass: ['user-alert', 'success']
                                });
                                _this.showEmailForm = false;
                            }
                            else {
                                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                                    data: {
                                        img: 'warning',
                                        msg: response.msg
                                    },
                                    duration: 3000,
                                    panelClass: ['user-alert', 'error']
                                });
                            }
                        });
                    }
                    _this.incomingEmail = '';
                    _this.groupName = '';
                    _this.loading = false;
                    _this.name = '';
                });
            }
            else {
                this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'warning',
                        msg: 'Incorrect Incoming Email!'
                    },
                    duration: 3000,
                    panelClass: ['user-alert', 'warning']
                });
                return;
            }
        }
        else {
            alert('You dont have this feature in your package!');
        }
    };
    AutoforwardingComponent.prototype.PrimaryEmail = function (id, flag) {
        this._ticketService.SetPrimaryEmail(id, !flag);
    };
    AutoforwardingComponent.prototype.Edit = function (domainEmail, incomingEmail, group, name) {
        var first = this.nsp.split('.')[0].split('/');
        domainEmail = incomingEmail.split('@')[0] + "@" + first[1] + ".bizzchats.com";
        // domainEmail = incomingEmail.split('@')[0] + "@" + 'test.beelinks.solutions';
        if (group)
            this._ticketService.UpdateIncomingEmail(this.id, domainEmail, incomingEmail, group, name);
        else
            this._ticketService.UpdateIncomingEmail(this.id, domainEmail, incomingEmail, '', name);
        this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
            data: {
                img: 'ok',
                msg: 'Incoming Email updated Successfully!'
            },
            duration: 3000,
            panelClass: ['user-alert', 'success']
        });
        this.name = '';
        this.incomingEmail = '';
        this.domainEmail = '@' + this.nsp.slice(1).split('.')[0] + '.bizzchats.com';
        this.groupName = '';
        this.showEmailForm = false;
        this.enableEdit = false;
    };
    AutoforwardingComponent.prototype.Cancel = function () {
        this.name = '';
        this.incomingEmail = '';
        this.domainEmail = '@' + this.nsp.slice(1).split('.')[0] + '.bizzchats.com';
        this.groupName = '';
        this.enableEdit = false;
        this.showEmailForm = false;
        // if(cancel){
        // 	this.showEmailForm = false;
        // }
        // this.showEmailForm = false;
    };
    AutoforwardingComponent.prototype.editdata = function (id) {
        // console.log(this.agentEmails);
        // console.log(id);
        this.id = id;
        this.enableEdit = true;
        var index = this.agentEmails.findIndex(function (a) { return a._id == id; });
        this.name = this.agentEmails[index].name;
        this.incomingEmail = this.agentEmails[index].email;
        this.domainEmail = this.agentEmails[index].domainEmail;
        // console.log(this.domainEmail);
        this.groupName = this.agentEmails[index].group;
        this.showEmailForm = true;
        // this.Edit(this.domainEmail, this.incomingEmail, )
    };
    AutoforwardingComponent.prototype.Delete = function (email, id) {
        var _this = this;
        // console.log(this.dialog);
        // if(this.agentEmails.primaryEmaail)
        var index = this.agentEmails.findIndex(function (a) { return a._id == id; });
        if (this.agentEmails[index].primaryEmail) {
            this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                data: {
                    img: 'warning',
                    msg: 'Primary Email cannot be deleted'
                },
                duration: 3000,
                panelClass: ['user-alert', 'error']
            });
        }
        else {
            this.dialog.open(confirmation_dialog_component_1.ConfirmationDialogComponent, {
                panelClass: ['confirmation-dialog'],
                data: { headermsg: 'Are you sure you want To delete this email?' }
            }).afterClosed().subscribe(function (data) {
                if (data == 'ok') {
                    _this._ticketService.DeleteIncomingId(email, id);
                }
            });
        }
    };
    AutoforwardingComponent.prototype.toggleEmailForm = function () {
        if (this.enableEdit && this.showEmailForm) {
            this.name = '';
            this.incomingEmail = '';
            this.domainEmail = '@' + this.nsp.slice(1).split('.')[0] + '.bizzchats.com';
            this.groupName = '';
            this.enableEdit = false;
        }
        this.showEmailForm = !this.showEmailForm;
    };
    AutoforwardingComponent.prototype.toggleExternalRuleset = function (id, value) {
        // console.log(id, value);
        this._ticketService.toggleExternalRuleset(id, value);
    };
    AutoforwardingComponent.prototype.toggleIconnDispatcher = function (id, value) {
        // console.log(id, value);
        this._ticketService.toggleIconnDispatcher(id, value);
    };
    AutoforwardingComponent.prototype.toggleAckEmail = function (id, value) {
        // console.log(id, value);
        this._ticketService.toggleAckEmail(id, value);
    };
    AutoforwardingComponent.prototype.toggleUseOriginalEmail = function (id, value) {
        // console.log(id, value);
        this._ticketService.toggleUseOriginalEmail(id, value);
    };
    AutoforwardingComponent.prototype.sendActivation = function (id) {
        this.activationID = id;
        this._ticketService.SendActivation(id);
    };
    AutoforwardingComponent.prototype.sendIdentityVerificationEmail = function (email) {
        this._ticketService.SendIdentityVerificationEmail(email);
    };
    AutoforwardingComponent.prototype.ngOnDestroy = function () {
        console.log('Incoming Email Destroyed');
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
    };
    AutoforwardingComponent = __decorate([
        core_1.Component({
            selector: 'app-autoforwarding',
            templateUrl: './autoforwarding.component.html',
            styleUrls: ['./autoforwarding.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], AutoforwardingComponent);
    return AutoforwardingComponent;
}());
exports.AutoforwardingComponent = AutoforwardingComponent;
//# sourceMappingURL=autoforwarding.component.js.map