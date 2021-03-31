import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
// import { Visitorservice } from '../../../../services/VisitorService';
import { VisitorBanTimeComponent } from '../../../dialogs/visitor-ban-time/visitor-ban-time.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { Visitorservice } from '../../../../services/VisitorService';
import { ChatService } from '../../../../services/ChatService';
import { ToastNotifications } from '../../../dialogs/SnackBar-Dialog/toast-notifications.component';
import { AuthService } from '../../../../services/AuthenticationService';

@Component({
	selector: 'app-visitor-details',
	templateUrl: './visitor-details.component.html',
	styleUrls: ['./visitor-details.component.scss'],
	encapsulation: ViewEncapsulation.None
})

export class VisitorDetailsComponent implements OnInit {

	_visitor: any = undefined;
	permissions: any;
	SuperVisedChatList: string[];

	@Input() set visitor(value) {
		this._visitor = value;
		this._changeDetectionRef.detectChanges();
	}
	@Input() agent: any
	public AdditionalData = false;

	@Input() pageState: any = '';
	// @Input() state: any = '';
	@Input() Logs: any = []
	@Output('BanVisitorEmitter') BanVisitorEmitter = new EventEmitter();
	@Output('actionValue') actionValue = new EventEmitter();
	subscriptions: Subscription[] = [];


	state = {
		"chatting": true,
		"queued": false,
		"browsing": false,
		"inactive": false,
		'invited': false,
		'left': false,
	}

	tabs = {
		"visitorHistory": true,
		"browsingHistory": false,
		"sessionLogs": false,
		"additionalData": false
	}

	constructor(private _visitorService: Visitorservice, private _authService: AuthService,
		private _chatService: ChatService,
		private dialog: MatDialog,
		private snackBar: MatSnackBar,
		private _changeDetectionRef: ChangeDetectorRef) {

		// this.subscriptions.push(_visitorService.getSelectedVisitor().subscribe(visitor => {

		// this.selectedVisitor = visitor;
		// // //console.logthis.selectedVisitor);
		// }));

		this.subscriptions.push(_visitorService.getPageState().subscribe(pageState => {
			this.pageState = pageState;
			this.state[pageState] = true
		}));

		this.subscriptions.push(_authService.getSettings().subscribe(data => {
			if (data && data.permissions) {
				// console.log(data);
				this.permissions = data.permissions.agents;
			}
		}));

		this.subscriptions.push(_chatService.SuperVisedChatList.subscribe(data => {

			this.SuperVisedChatList = data;
		}));

		this._changeDetectionRef.detach();
	}

	ngOnInit() {

	}

	ngAfterViewInit() {
		this._changeDetectionRef.detectChanges();
	}

	vhListTabs(tabName) {
		Object.keys(this.tabs).map(k => {
			if (k == tabName) {
				this.tabs[k] = true
			} else {
				this.tabs[k] = false
			}
		});
		this._changeDetectionRef.detectChanges();
	}

	performAction(action: string) {
		this._visitorService.performChildAction(action);
		this._changeDetectionRef.detectChanges();
	}

	// BanVisitor() {
	// if (confirm('Are you sure you want to Ban the Visitor for Chat')) {

	// //console.log"banning");

	// this._chatService.BanVisitorChat(this.selectedVisitor._id, this.selectedVisitor.deviceID).subscribe(data => {

	// //console.log"banned");

	// });;
	// }

	// }

	// BanVisitor() {
	// this.dialog.open(ConfirmationDialogComponent, {
	// panelClass: ['confirmation-dialog'],
	// data: { headermsg: "Are you sure you want to Ban the Visitor " + this.selectedVisitor.username + " ?" }
	// }).afterClosed().subscribe(data => {
	// if (data == 'ok') {
	// this.subscriptions.push(this.dialog.open(VisitorBanTimeComponent, {
	// panelClass: ['confirmation-dialog'],
	// data: {
	// sessionid: this.selectedVisitor._id,
	// deviceID: this.selectedVisitor.deviceID
	// }
	// }).afterClosed().subscribe(response => {

	// }));
	// }
	// });
	// }


	BanVisitor() {

		this.subscriptions.push(this.dialog.open(VisitorBanTimeComponent, {
			panelClass: ['confirmation-dialog'],
			data: {
				sessionid: this._visitor._id,
				deviceID: this._visitor.deviceID
			}
		}).afterClosed().subscribe(response => {
			if (response && response.hours) {
				this.dialog.open(ConfirmationDialogComponent, {
					panelClass: ['confirmation-dialog'],
					data: { headermsg: "Are you sure you want to Ban the Visitor " + this._visitor.username + " for " + response.hours + " " + ((response.hours < 2) ? "hour" : "hours") + "?" }
				}).afterClosed().subscribe(data => {
					if (data == 'ok') {
						this._chatService.BanVisitorChat(this._visitor._id, this._visitor.deviceID, parseInt(response.hours)).subscribe((response) => {
							if (response) {
								this.snackBar.openFromComponent(ToastNotifications, {
									data: {
										img: 'ok',
										msg: 'Visitor Banned successfully!'
									},
									duration: 2000,
									panelClass: ['user-alert', 'success']
								});
							} else {
								this.snackBar.openFromComponent(ToastNotifications, {
									data: {
										img: 'warning',
										msg: 'Visitor already banned !'
									},
									duration: 2000,
									panelClass: ['user-alert', 'error']
								});
							}

						}, err => {
							this.snackBar.openFromComponent(ToastNotifications, {
								data: {
									img: 'warning',
									msg: 'Visitor banning failed!'
								},
								duration: 2000,
								panelClass: ['user-alert', 'error']
							});
						});
					}
				});
			}
			this._changeDetectionRef.detectChanges();
		}));
	}

	SuperviseChat(visitor) {
		this.dialog.open(ConfirmationDialogComponent, {
			panelClass: ['confirmation-dialog'],
			data: { headermsg: "Are you sure you want to supervise this Conversation?" }
		}).afterClosed().subscribe(data => {
			if (data == 'ok') {
				this._visitorService.SuperViseChat(visitor).subscribe(data => {
					if (data && data.status == 'ok') {
						this.SuperVisedChatList.push(visitor.conversationID)
					}
				})
			}
			this._changeDetectionRef.detectChanges();
		})
	}

	CheckIfChatSuperVised(cid) {

		return this.SuperVisedChatList.includes(cid)

	}

	EndSuperVision() {
		let visitor = this._visitor
		this.dialog.open(ConfirmationDialogComponent, {
			panelClass: ['confirmation-dialog'],
			data: { headermsg: "Are you sure you want to end supervising this Conversation?" }
		}).afterClosed().subscribe(data => {
			if (data == 'ok') {
				this._visitorService.EndSuperVisesChat(visitor.conversationID.toString(), true).subscribe(data => {
					if (data && data.status == 'ok') {
						this._chatService.SuperVisedChatList.next(this._chatService.SuperVisedChatList.getValue().filter((id) => { return id != visitor.conversationID }));
						this.SuperVisedChatList = this.SuperVisedChatList.filter((id) => { return id != visitor.conversationID })
						console.log(this.SuperVisedChatList);

						this.snackBar.openFromComponent(ToastNotifications, {
							data: {
								img: 'ok',
								msg: 'Super Vision Ended successfully!'
							},
							duration: 2000,
							panelClass: ['user-alert', 'success']
						});
					} else {
						this.snackBar.openFromComponent(ToastNotifications, {
							data: {
								img: 'warning',
								msg: 'Error in ending super vision!'
							},
							duration: 2000,
							panelClass: ['user-alert', 'error']
						});
					}

				})
			}
			this._changeDetectionRef.detectChanges();
		})
	}
	// getLogs() {
	// this._visitorService.GetVisitorLogs(this.visitor._id).subscribe(data => {
	// //console.logdata);
	// this.visitorLogs.push(data);
	// })

	// }

}