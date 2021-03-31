import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { AfterViewInit, AfterViewChecked } from '@angular/core/src/metadata/lifecycle_hooks';
import { TicketsService } from '../../../services/TicketsService';
import { Subscription } from 'rxjs/Subscription';
import { ToastNotifications } from '../../dialogs/SnackBar-Dialog/toast-notifications.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../services/AuthenticationService';

@Component({
    selector: 'app-tickets',
    templateUrl: './tickets.component.html',
    styleUrls: ['./tickets.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TicketsComponent implements OnInit, AfterViewInit, AfterViewChecked {
    selectedThread: any;
    subscriptions: Subscription[] = [];
    public viewState = 'OPEN'
    public schema = undefined;
    @Input() verified: boolean;

    constructor(private _ticketService: TicketsService,
        private _authService: AuthService,
        private snackBar: MatSnackBar,
        public dialog: MatDialog) {

        this.subscriptions.push(_ticketService.getSelectedThread().subscribe(selectedThread => {
            if (selectedThread && Object.keys(selectedThread).length) {
                if (!selectedThread.dynamicFields) selectedThread.dynamicFields = {};
                this.selectedThread = selectedThread;

                // console.log(this.selectedThread);
            }

        }));



        this.subscriptions.push(this._authService.getSettings().subscribe(settings => {
            if (settings) this.verified = settings.verified;
            if (settings) this.schema = settings.schemas.ticket.fields;
        }));
        this.subscriptions.push(_ticketService.getNotification().subscribe(notification => {
            if (notification) {

                this.snackBar.openFromComponent(ToastNotifications, {
                    data: {
                        img: notification.img,
                        msg: notification.msg
                    },
                    duration: 3000,
                    panelClass: ['user-alert', (notification.type == 'success') ? 'success' : 'error']
                }).afterDismissed().subscribe(() => {
                    _ticketService.clearNotification();
                });
            }
        }));

    }



    ngOnInit() {
    }

    ngAfterViewInit() {

    }

    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
        // this._appStateSerive.displayChatBar(true);
    }

    ngAfterViewChecked(): void {
    }


}