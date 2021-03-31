import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { SocketService } from '../../../../services/SocketService';
import { Subscription } from 'rxjs/Subscription';
import { ToastNotifications } from '../../../dialogs/SnackBar-Dialog/toast-notifications.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../../services/AuthenticationService';
import { Observable } from 'rxjs/Observable';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { ValidationService } from '../../../../services/UtilityServices/ValidationService';
import { GlobalStateService } from '../../../../services/GlobalStateService';


@Component({
	selector: 'app-automated-responses',
	templateUrl: './automated-responses.component.html',
	styleUrls: ['./automated-responses.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class AutomatedResponsesComponent implements OnInit {

	responseTag = '';
	responseText = '';
	automatedMessagesList = [];
	subscriptions: Subscription[] = [];
	editingMessagesMap = {};

	loading = false;
	socket;
	emptyResponse = false;
	showResponseForm = false;
	editedHash: string = ''

	public automatedResForm: FormGroup;
	public working = false;
	duplicateHash: boolean;
	package: any = {};
	limitReached: boolean;
	constructor(private formbuilder: FormBuilder,
		private _socketService: SocketService,
		public _authService: AuthService,
		public _validationService: ValidationService,
		public snackBar: MatSnackBar,
		public dialog: MatDialog,
		public _appStateService: GlobalStateService) {
		this._appStateService.contentInfo.next('');
		this._appStateService.breadCrumbTitle.next('General Settings');
		this.subscriptions.push(_socketService.getSocket().subscribe(socket => {
			this.socket = socket;
		}));

		this.subscriptions.push(_authService.getSettings().subscribe(data => {
			if (data.automatedMessages && data.automatedMessages.length) {
				this.automatedMessagesList = data.automatedMessages;
				data.automatedMessages.map(automatedMessage => {
					if (this.editingMessagesMap[automatedMessage.hashTag] == undefined) {
						this.editingMessagesMap[automatedMessage.hashTag] = {}
					}
					if (!this.editingMessagesMap[automatedMessage.hashTag].selected) {
						this.editingMessagesMap[automatedMessage.hashTag].selected = false;
						this.editingMessagesMap[automatedMessage.hashTag].responseText = automatedMessage.responseText
						this.editedHash = automatedMessage.hashTag
					}
				});
			}
			else {
				this.automatedMessagesList = [];
			}
		}));

		this.subscriptions.push(_authService.getRequestState().subscribe(requestState => {
			this.loading = requestState;
		}));

		this.automatedResForm = formbuilder.group({
			'responseText': [''],
			'hashTag':
				[
					null,
					[
						Validators.required,
						Validators.pattern(/^[ \t]*#(\w*[0-9a-zA-Z ]+)[ \t]*$/)
					],
					this._validationService.CheckTag.bind(this)
				]
		});

		this.subscriptions.push(_authService.getPackageInfo().subscribe(pkg => {
			// console.log(data);
			if (pkg) {
				this.package = pkg;
				if (!this.package.chats.cannedMessage.allowed) {
					this._appStateService.NavigateTo('/noaccess');
				}
			}
		}));

	}

	ngOnInit() {
	}

	ngOnDestroy(): void {
		//Called once, before the instance is destroyed.
		//Add 'implements OnDestroy' to the class.
		this.subscriptions.forEach(subscription => {
			subscription.unsubscribe();
		});
		this._appStateService.breadCrumbTitle.next('');
	}


	TypingEvent($event) {
		this.emptyResponse = false
		this.duplicateHash = false
	}

	AddAutomatedResponse() {


		if (this.package && this.package.chats.cannedMessage.quota <= this.automatedMessagesList.length) {
			this.limitReached = true
			return;
		}

		if (!this.automatedResForm.get('responseText').value) {
			this.emptyResponse = true
			return;
		}
		if (this.editingMessagesMap[this.automatedResForm.get('hashTag').value]) {
			this.duplicateHash = true
			return;
		}
		else this.duplicateHash = false
		if (this.automatedResForm.valid) {
			this._authService.setRequestState(true);
			this.socket.emit('addAutomatedResponse', {
				hashTag: this.automatedResForm.get('hashTag').value,
				responseText: this.automatedResForm.get('responseText').value
			}, (response) => {
				if (response.status == 'ok') {
					this._authService.setRequestState(false);
					this._authService.updateAutomatedMessages(this.automatedResForm.get('hashTag').value, this.automatedResForm.get('responseText').value);
					this.automatedResForm.reset();
					this.snackBar.openFromComponent(ToastNotifications, {
						data: { img: 'ok', msg: 'Automated Message Added Successfully' },
						duration: 3000,
						panelClass: ['user-alert', 'success']
					});
				}
			});

		}
		this.showResponseForm = false;
	}


	//Befor Edit ButtonEvents
	OpenEdit(event: Event, hashTag: string) {
		event.preventDefault();
		this.editedHash = hashTag;
		this.editingMessagesMap[hashTag].selected = true;
	}

	DeleteAutomatedMessage(event: Event, hashTag: string) {

		event.preventDefault();
		this.editingMessagesMap[hashTag].selected = false;
		this.editedHash = ''
		this.dialog.open(ConfirmationDialogComponent, {
			panelClass: ['confirmation-dialog'],
			data: { headermsg: 'Are You Sure You Want To Delete Automated Message' }
		}).afterClosed().subscribe(data => {
			if (data == 'ok') {
				this._authService.setRequestState(true);
				this.socket.emit('deleteAutomatedResponse', {
					hashTag: hashTag
				}, (response) => {

					if (response.status == 'ok') {

						this._authService.DeleteAutomatedMessage(response.hashTag);

						this.snackBar.openFromComponent(ToastNotifications, {
							data: { img: 'ok', msg: 'Automated Message Deleted Successfully' },
							duration: 3000,
							panelClass: ['user-alert', 'success']
						});
					}
					this._authService.setRequestState(false);

				});
			}
		})
	}

	toggleResponseForm() {
		this.showResponseForm = !this.showResponseForm;
	}

	//After Edit Button Events
	Edit(event: Event, hashTag: string) {
		event.preventDefault();
		this.editingMessagesMap[hashTag].error = false;
		if (!this.editingMessagesMap[hashTag].responseText) {
			this.editingMessagesMap[hashTag].error = true;
			return
		};

		this.socket.emit('editAutomatedResponse', {
			hashTag: (this.editedHash) ? this.editedHash : (hashTag) ? hashTag : '',
			responseText: this.editingMessagesMap[hashTag].responseText
		}, (response) => {
			if (response.status == 'ok') {
				if (this.editedHash != hashTag) {
					this.editingMessagesMap[hashTag] = this.editingMessagesMap[this.editedHash]
					delete this.editingMessagesMap[hashTag]
				}
				this._authService.EditupdateAutomatedMessages(
					response.hashTag,
					this.editingMessagesMap[response.hashTag].responseText
				);
				this.editingMessagesMap[hashTag].selected = false;
				this.editedHash = ''
				this.snackBar.openFromComponent(ToastNotifications, {
					data: { img: 'ok', msg: 'Automated Message Edited Successfully' },
					duration: 3000,
					panelClass: ['user-alert', 'success']
				})
			}

		});

	}

	CancelEdit(event: Event, hashTag: string, previousResponseText) {
		event.preventDefault();
		this.editingMessagesMap[hashTag].selected = false;
		this.editingMessagesMap[hashTag].responseText = previousResponseText;
		this.editedHash = ''

	}
}
