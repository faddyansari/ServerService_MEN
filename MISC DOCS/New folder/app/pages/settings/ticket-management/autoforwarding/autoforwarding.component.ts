import { Component, ViewEncapsulation } from '@angular/core';
import { AuthService } from '../../../../../services/AuthenticationService';
import { Subscription } from 'rxjs/Subscription';
import { TicketsService } from '../../../../../services/TicketsService';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ToastNotifications } from '../../../../dialogs/SnackBar-Dialog/toast-notifications.component';
import { ConfirmationDialogComponent } from '../../../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { TicketAutomationService } from '../../../../../services/LocalServices/TicketAutomationService';
import { GlobalStateService } from '../../../../../services/GlobalStateService';

@Component({
	selector: 'app-autoforwarding',
	templateUrl: './autoforwarding.component.html',
	styleUrls: ['./autoforwarding.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class AutoforwardingComponent {
	public subscriptions: Subscription[] = [];
	agent: any;
	currentAgent = '';
	email = '';
	loading = false;
	group = '';
	toggle = false;
	incomingEmail = '';
	domainEmail = '';
	groupName = '';
	name = '';
	enableEdit = false;

	agentsArray = [];
	arr = [];
	nsp = '';
	agentEmails = [];
	agentEmailsValidation = [];
	Group: any;
	id = '';
	showEmailForm = false;
	emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	activationLoading = false;
	activationID = '';
	package : any;

	constructor(private dialog: MatDialog, private _ticketAutomationService: TicketAutomationService, private _authService: AuthService, private _ticketService: TicketsService, private snackBar: MatSnackBar, private _appStateService: GlobalStateService) {

		this._appStateService.contentInfo.next('');
		this._appStateService.breadCrumbTitle.next('Ticket Management');

		this.subscriptions.push(_authService.getPackageInfo().subscribe(pkg => {
			if (pkg) {
				this.package = pkg.tickets.incomingEmail;
				if(!this.package.allowed){
					this._appStateService.NavigateTo('/noaccess');
				}
			}
			// console.log(agent);
		}));
		this.subscriptions.push(_authService.getAgent().subscribe(agent => {
			if (agent && Object.keys(agent).length) {
				this.agent = agent;
				this.nsp = this.agent.nsp;
				this.currentAgent = this.agent.email;
				this.domainEmail = '@' + this.nsp.slice(1).split('.')[0] + '.bizzchats.com'
			}
			// console.log(agent);
		}));

		this.subscriptions.push(this._ticketService.getNotification().subscribe(notification => {
			if (notification) {
				// console.log(notification);

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

		this.subscriptions.push(_ticketService.IncomingEmailsByNSP.subscribe(data => {

			this.agentEmails = data;
			// console.log(this.agentEmails);

		}));



		this.subscriptions.push(_ticketService.IncomingEmails.subscribe(data => {
			this.agentEmailsValidation = data;
			// console.log(this.agentEmailsValidation);
		}));
		this.subscriptions.push(_ticketService.activationLoading.subscribe(data => {
			this.activationLoading = data;
			if (!this.activationLoading) {
				this.activationID = '';
			}
			// console.log(this.agentEmailsValidation);
		}));

		this.subscriptions.push(this._ticketAutomationService.Groups.subscribe(data => {
			this.Group = data;
			// console.log(this.Group.groups);

		}));
	}

	TransformIncomingEmail(value) {
		if (value) return value.split('@')[0];
		else return '';
	}

	GetDomainEmail(incomingEmail, domainEmail) {
		if (incomingEmail && domainEmail) return incomingEmail.split('@')[0] + domainEmail.split('@')[1];
		else return '';
	}

	isNullOrWhiteSpace() {
		return !this.name.replace(/&nbsp;|<br>|<\/br>/g, ' ').trim();
	}

	insertEmail(domainEmail, incomingEmail, group, name) {
		if(this.package && this.package.allowed){
			if (this.emailRegex.test(incomingEmail)) {
				this.loading = true;
				let first = this.nsp.split('.')[0].split('/');
				domainEmail = incomingEmail.split('@')[0] + "@" + first[1] + ".bizzchats.com";
				this._ticketService.getIncomingEmails(domainEmail).subscribe(res => {
					if (res.status == "ok") {
						if (res.emaildata && res.emaildata.filter(data => data.domainEmail == domainEmail).length > 0) {
							this.snackBar.openFromComponent(ToastNotifications, {
								data: {
									img: 'warning',
									msg: 'Same Email already exists! Kindly change it'
								},
								duration: 3000,
								panelClass: ['user-alert', 'error']
							});
						}
						this.loading = false;
						return;
	
					}
					else {
						this._ticketService.AddIncomingEmail(domainEmail, incomingEmail, group, name).subscribe(response => {
							if(response.status == 'ok'){
								this.snackBar.openFromComponent(ToastNotifications, {
									data: {
										img: 'ok',
										msg: 'Incoming Email added Successfully!'
									},
									duration: 3000,
									panelClass: ['user-alert', 'success']
								});
								this.showEmailForm = false;
							}else{
								this.snackBar.openFromComponent(ToastNotifications, {
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
					this.incomingEmail = '';
					this.groupName = '';
					this.loading = false;
					this.name = '';
				});
			}
			else {
				this.snackBar.openFromComponent(ToastNotifications, {
					data: {
						img: 'warning',
						msg: 'Incorrect Incoming Email!'
					},
					duration: 3000,
					panelClass: ['user-alert', 'warning']
				});
				return;
			}
		}else{
			alert('You dont have this feature in your package!');
		}
	}


	PrimaryEmail(id, flag) {
		this._ticketService.SetPrimaryEmail(id, !flag);
	}

	Edit(domainEmail, incomingEmail, group, name) {
		let first = this.nsp.split('.')[0].split('/');

		domainEmail = incomingEmail.split('@')[0] + "@" + first[1] + ".bizzchats.com";
		// domainEmail = incomingEmail.split('@')[0] + "@" + 'test.beelinks.solutions';
		if (group) this._ticketService.UpdateIncomingEmail(this.id, domainEmail, incomingEmail, group, name);
		else this._ticketService.UpdateIncomingEmail(this.id, domainEmail, incomingEmail, '', name);
		this.snackBar.openFromComponent(ToastNotifications, {
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
	}
	Cancel() {
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
	}
	editdata(id) {
		// console.log(this.agentEmails);

		// console.log(id);
		this.id = id;
		this.enableEdit = true;
		let index = this.agentEmails.findIndex(a => a._id == id);

		this.name = this.agentEmails[index].name;
		this.incomingEmail = this.agentEmails[index].email;
		this.domainEmail = this.agentEmails[index].domainEmail;
		// console.log(this.domainEmail);

		this.groupName = this.agentEmails[index].group;
		this.showEmailForm = true;
		// this.Edit(this.domainEmail, this.incomingEmail, )
	}

	Delete(email, id) {
		// console.log(this.dialog);
		// if(this.agentEmails.primaryEmaail)
		let index = this.agentEmails.findIndex(a => a._id == id)
		if (this.agentEmails[index].primaryEmail) {
			this.snackBar.openFromComponent(ToastNotifications, {
				data: {
					img: 'warning',
					msg: 'Primary Email cannot be deleted'
				},
				duration: 3000,
				panelClass: ['user-alert', 'error']
			});
		}
		else {
			this.dialog.open(ConfirmationDialogComponent, {
				panelClass: ['confirmation-dialog'],
				data: { headermsg: 'Are you sure you want To delete this email?' }
			}).afterClosed().subscribe(data => {
				if (data == 'ok') {
					this._ticketService.DeleteIncomingId(email, id);
				}
			});
		}
	}

	toggleEmailForm() {
		if (this.enableEdit && this.showEmailForm) {
			this.name = '';
			this.incomingEmail = '';
			this.domainEmail = '@' + this.nsp.slice(1).split('.')[0] + '.bizzchats.com';
			this.groupName = '';
			this.enableEdit = false;
		}
		this.showEmailForm = !this.showEmailForm;
	}

	toggleExternalRuleset(id, value) {
		// console.log(id, value);
		this._ticketService.toggleExternalRuleset(id, value);
	}
	toggleIconnDispatcher(id, value) {
		// console.log(id, value);
		this._ticketService.toggleIconnDispatcher(id, value);
	}
	toggleAckEmail(id, value) {
		// console.log(id, value);
		this._ticketService.toggleAckEmail(id, value);
	}
	toggleUseOriginalEmail(id, value) {
		// console.log(id, value);
		this._ticketService.toggleUseOriginalEmail(id, value);
	}

	sendActivation(id) {
		this.activationID = id;
		this._ticketService.SendActivation(id);
	}

	sendIdentityVerificationEmail(email) {
		this._ticketService.SendIdentityVerificationEmail(email);
	}

	ngOnDestroy() {
		console.log('Incoming Email Destroyed');

		//Called once, before the instance is destroyed.
		//Add 'implements OnDestroy' to the class.
		this.subscriptions.forEach(subscription => {
			subscription.unsubscribe();
		});
	}

}
