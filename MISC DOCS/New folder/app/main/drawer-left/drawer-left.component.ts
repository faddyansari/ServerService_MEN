import { Component, OnInit, ViewEncapsulation, ElementRef } from '@angular/core';
import { GlobalStateService } from '../../../services/GlobalStateService';
import { Subscription } from 'rxjs/Subscription';
import { AddAgentDialogComponent } from '../../dialogs/add-agent-dialog/add-agent-dialog.component';
import { ToastNotifications } from '../../dialogs/SnackBar-Dialog/toast-notifications.component';
import { AgentService } from '../../../services/AgentService';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AddTicketDialogComponent } from '../../dialogs/add-ticket-dialog/add-ticket-dialog.component';
import { TicketsService } from '../../../services/TicketsService';
import { AddContactDialogComponent } from '../../dialogs/add-contact-dialog/add-contact-dialog.component';
import { Contactservice } from '../../../services/ContactService';
import { ImportExportContactsDialogComponent } from '../../dialogs/import-export-contacts-dialog/import-export-contacts-dialog.component';
import { unparse } from 'papaparse';
import { AuthService } from '../../../services/AuthenticationService';

@Component({
    selector: 'app-drawer-left',
    templateUrl: './drawer-left.component.html',
    styleUrls: ['./drawer-left.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DrawerLeftComponent implements OnInit {

    subscriptions: Subscription[] = [];
    drawerActive: boolean = false;
    drawerActive_exit: boolean = false;
    role = '';
    nsp = '';
    agent: any;
    exit: boolean = false;
    production: boolean = true;
    sbt = false;
    permissions: any;
    package = undefined;


    constructor(private _globalStateService: GlobalStateService,
        private _authService: AuthService,
        private _elementRef: ElementRef,
        private _agentService: AgentService,
        public dialog: MatDialog,
        private _ticketService: TicketsService,
        public snackBar: MatSnackBar,
        private _contactService: Contactservice) {

        this.subscriptions.push(_authService.getPackageInfo().subscribe(pkg => {
            // console.log(data);
            if (pkg) {
                this.package = pkg;
            }
        }));

        this.subscriptions.push(_globalStateService.drawerActive.subscribe(data => {
            this.drawerActive = data;
        }));

        this.subscriptions.push(_authService.SBT.subscribe(data => {
            this.sbt = data;
        }));

        this.subscriptions.push(_globalStateService.drawerActive_exit.subscribe(data => {
            this.drawerActive_exit = data;
        }));

        this.subscriptions.push(_authService.getSettings().subscribe(data => {
            // console.log(data);
            if (data && data.permissions) {
                this.permissions = data.permissions;
                // console.log(this.permissions);
            }

        }));

        this.subscriptions.push(_agentService.agent.subscribe(agent => {

            this.agent = agent;
            this.role = agent.role;
            this.nsp = agent.nsp;

        }));

        this.subscriptions.push(_authService.Production.subscribe(production => {
            this.production = production;
        }))

    }

    ngOnInit() {
    }


    toggleDrawer() {
        this._globalStateService.ToggleDrawer();
        this.exit = true;
    }

    ShowAddAgentDialog() {
        this._globalStateService.drawerActive.next(false);
        this.subscriptions.push(this.dialog.open(AddAgentDialogComponent, {
            panelClass: ['full-page-dialog'],
            disableClose: true,
            autoFocus: true,
        }).afterClosed().subscribe(data => {
            if (data && data.status) {
                //console.log(data.agent);
                this._agentService.addAgentSuccess(data.agent)
                this.snackBar.openFromComponent(ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: 'Agent Registered Successfully'
                    },
                    duration: 3000,
                    panelClass: ['user-alert', 'success']
                })
            }
        }));

    }

    ShowAddTicketDialog() {
        this._globalStateService.drawerActive.next(false);
        this.subscriptions.push(this.dialog.open(AddTicketDialogComponent, {
            panelClass: ['full-page-dialog'],
            disableClose: false,
            autoFocus: true,
        }).afterClosed().subscribe(response => {
            if (response) {
                this._ticketService.InsertNewTicket(response).subscribe(data => {
                    if (data.status == 'ok') {
                        // console.log(data);

                        this.snackBar.openFromComponent(ToastNotifications, {
                            data: {
                                img: 'ok',
                                msg: 'Ticket Created Successfully'
                            },
                            duration: 3000,
                            panelClass: ['user-alert', 'success']
                        });
                    } else if (data.status == 'error') {
                        this.snackBar.openFromComponent(ToastNotifications, {
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
    }

    ShowAddContactDialog() {
        this._globalStateService.drawerActive.next(false);
        this.dialog.open(AddContactDialogComponent, {
            panelClass: ['full-page-dialog'],
            disableClose: true,
            autoFocus: true,
        }).afterClosed().subscribe(data => {
            if (data) {
                this._contactService.CreateContact(data);
            }
        }, err => {
            console.log("Error in observer: " + err)
        });
    }

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

    ShowImportExportDialog() {
        this._globalStateService.drawerActive.next(false);
        this.subscriptions.push(this.dialog.open(ImportExportContactsDialogComponent, {
            panelClass: ['confirmation-dialog'],
            disableClose: true,
            autoFocus: true,
        }).afterClosed().subscribe(actionObj => {
            if (actionObj.fileUploadHandle) {
                this._contactService.UploadContacts(actionObj.fileUploadHandle);
                this._globalStateService.NavigateTo('/contacts');
            }

            // Directly export from frontend
            if (actionObj.exportContacts) {

                let contactList = this._contactService.contactsList.getValue()
                let csv = unparse(contactList);
                let csvBlob = new Blob([csv], { type: 'text/csv', });
                let fileName = 'contacts.csv';

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
    }

}
