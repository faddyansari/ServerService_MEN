"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrawerLeftComponent = void 0;
var core_1 = require("@angular/core");
var add_agent_dialog_component_1 = require("../../dialogs/add-agent-dialog/add-agent-dialog.component");
var toast_notifications_component_1 = require("../../dialogs/SnackBar-Dialog/toast-notifications.component");
var add_ticket_dialog_component_1 = require("../../dialogs/add-ticket-dialog/add-ticket-dialog.component");
var add_contact_dialog_component_1 = require("../../dialogs/add-contact-dialog/add-contact-dialog.component");
var import_export_contacts_dialog_component_1 = require("../../dialogs/import-export-contacts-dialog/import-export-contacts-dialog.component");
var papaparse_1 = require("papaparse");
var DrawerLeftComponent = /** @class */ (function () {
    function DrawerLeftComponent(_globalStateService, _authService, _elementRef, _agentService, dialog, _ticketService, snackBar, _contactService) {
        var _this = this;
        this._globalStateService = _globalStateService;
        this._authService = _authService;
        this._elementRef = _elementRef;
        this._agentService = _agentService;
        this.dialog = dialog;
        this._ticketService = _ticketService;
        this.snackBar = snackBar;
        this._contactService = _contactService;
        this.subscriptions = [];
        this.drawerActive = false;
        this.drawerActive_exit = false;
        this.role = '';
        this.nsp = '';
        this.exit = false;
        this.production = true;
        this.sbt = false;
        this.package = undefined;
        this.subscriptions.push(_authService.getPackageInfo().subscribe(function (pkg) {
            // console.log(data);
            if (pkg) {
                _this.package = pkg;
            }
        }));
        this.subscriptions.push(_globalStateService.drawerActive.subscribe(function (data) {
            _this.drawerActive = data;
        }));
        this.subscriptions.push(_authService.SBT.subscribe(function (data) {
            _this.sbt = data;
        }));
        this.subscriptions.push(_globalStateService.drawerActive_exit.subscribe(function (data) {
            _this.drawerActive_exit = data;
        }));
        this.subscriptions.push(_authService.getSettings().subscribe(function (data) {
            // console.log(data);
            if (data && data.permissions) {
                _this.permissions = data.permissions;
                // console.log(this.permissions);
            }
        }));
        this.subscriptions.push(_agentService.agent.subscribe(function (agent) {
            _this.agent = agent;
            _this.role = agent.role;
            _this.nsp = agent.nsp;
        }));
        this.subscriptions.push(_authService.Production.subscribe(function (production) {
            _this.production = production;
        }));
    }
    DrawerLeftComponent.prototype.ngOnInit = function () {
    };
    DrawerLeftComponent.prototype.toggleDrawer = function () {
        this._globalStateService.ToggleDrawer();
        this.exit = true;
    };
    DrawerLeftComponent.prototype.ShowAddAgentDialog = function () {
        var _this = this;
        this._globalStateService.drawerActive.next(false);
        this.subscriptions.push(this.dialog.open(add_agent_dialog_component_1.AddAgentDialogComponent, {
            panelClass: ['full-page-dialog'],
            disableClose: true,
            autoFocus: true,
        }).afterClosed().subscribe(function (data) {
            if (data && data.status) {
                //console.log(data.agent);
                _this._agentService.addAgentSuccess(data.agent);
                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: 'Agent Registered Successfully'
                    },
                    duration: 3000,
                    panelClass: ['user-alert', 'success']
                });
            }
        }));
    };
    DrawerLeftComponent.prototype.ShowAddTicketDialog = function () {
        var _this = this;
        this._globalStateService.drawerActive.next(false);
        this.subscriptions.push(this.dialog.open(add_ticket_dialog_component_1.AddTicketDialogComponent, {
            panelClass: ['full-page-dialog'],
            disableClose: false,
            autoFocus: true,
        }).afterClosed().subscribe(function (response) {
            if (response) {
                _this._ticketService.InsertNewTicket(response).subscribe(function (data) {
                    if (data.status == 'ok') {
                        // console.log(data);
                        _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                            data: {
                                img: 'ok',
                                msg: 'Ticket Created Successfully'
                            },
                            duration: 3000,
                            panelClass: ['user-alert', 'success']
                        });
                    }
                    else if (data.status == 'error') {
                        _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                            data: {
                                img: 'warning',
                                msg: 'Error in creating ticket!'
                            },
                            duration: 3000,
                            panelClass: ['user-alert', 'warning']
                        });
                    }
                });
            }
        }));
    };
    DrawerLeftComponent.prototype.ShowAddContactDialog = function () {
        var _this = this;
        this._globalStateService.drawerActive.next(false);
        this.dialog.open(add_contact_dialog_component_1.AddContactDialogComponent, {
            panelClass: ['full-page-dialog'],
            disableClose: true,
            autoFocus: true,
        }).afterClosed().subscribe(function (data) {
            if (data) {
                _this._contactService.CreateContact(data);
            }
        }, function (err) {
            console.log("Error in observer: " + err);
        });
    };
    // SHOW WHATSAPP DIALOG
    // ShowAddWhatsappContactDialog() {
    //     this._globalStateService.drawerActive.next(false);
    //     this.dialog.open(WhatsappDialogComponent, {
    //         panelClass: ['full-page-dialog'],
    //         disableClose: true,
    //         autoFocus: true,
    //     }).afterClosed().subscribe(data => {
    //         if (data) {
    //             this._contactService.CreateContact(data);
    //         }
    //     }, err => {
    //         console.log("Error in observer: " + err)
    //     });
    // }
    DrawerLeftComponent.prototype.ShowImportExportDialog = function () {
        var _this = this;
        this._globalStateService.drawerActive.next(false);
        this.subscriptions.push(this.dialog.open(import_export_contacts_dialog_component_1.ImportExportContactsDialogComponent, {
            panelClass: ['confirmation-dialog'],
            disableClose: true,
            autoFocus: true,
        }).afterClosed().subscribe(function (actionObj) {
            if (actionObj.fileUploadHandle) {
                _this._contactService.UploadContacts(actionObj.fileUploadHandle);
                _this._globalStateService.NavigateTo('/contacts');
            }
            // Directly export from frontend
            if (actionObj.exportContacts) {
                var contactList = _this._contactService.contactsList.getValue();
                var csv = papaparse_1.unparse(contactList);
                var csvBlob = new Blob([csv], { type: 'text/csv', });
                var fileName = 'contacts.csv';
                if (navigator.msSaveBlob) {
                    navigator.msSaveBlob(csvBlob, fileName);
                }
                else {
                    var link = document.createElement("a");
                    if (link.download !== undefined) { // feature detection
                        // Browsers that support HTML5 download attribute
                        var url = URL.createObjectURL(csvBlob);
                        link.setAttribute("href", url);
                        link.setAttribute("download", fileName);
                        // link.style = "visibility:hidden";
                        link.style.visibility = 'hidden';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    }
                }
            }
        }));
    };
    DrawerLeftComponent = __decorate([
        core_1.Component({
            selector: 'app-drawer-left',
            templateUrl: './drawer-left.component.html',
            styleUrls: ['./drawer-left.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], DrawerLeftComponent);
    return DrawerLeftComponent;
}());
exports.DrawerLeftComponent = DrawerLeftComponent;
//# sourceMappingURL=drawer-left.component.js.map