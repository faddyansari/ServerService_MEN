import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs/Observable';
import { ChatWindowCustomizations } from '../../../../../services/LocalServices/ChatWindowCustomizations';
import { GlobalStateService } from '../../../../../services/GlobalStateService';

@Component({
	selector: 'app-ticket-form-dialog',
	templateUrl: './ticket-form-dialog.component.html',
	styleUrls: ['./ticket-form-dialog.component.scss'],
	encapsulation: ViewEncapsulation.None
})

export class TicketFormDialogComponent {

	private subscriptions: Subscription[] = [];
	public displaySettings: any = undefined;
	public form: FormGroup;
	public enableEdit = false;
	public loading = false;

	//Only Letters Regex
	private pattern = /^[a-z][a-z.\s-]{1,255}$/i;
	themeSettings: any;


	constructor(private _chatWindowCustomizations: ChatWindowCustomizations,
		private _appStateService: GlobalStateService,
		private formbuilder: FormBuilder,
		public snackBar: MatSnackBar,
		public dialog: MatDialog
	) {
		this._appStateService.contentInfo.next('');
		this._appStateService.breadCrumbTitle.next('Chat Window Customizations');
		this.subscriptions.push(this._chatWindowCustomizations.GetDisplaySettings().subscribe(displaySettings => {
			if (displaySettings) {
				this.displaySettings = displaySettings.settings.chatwindow.ticketForm;
				this.themeSettings = displaySettings.settings.chatwindow.dialogSettings;
				this.enableEdit = false;
				this.form = formbuilder.group({
					'content': [
						this.displaySettings.content,
						[
							Validators.required,
							Validators.pattern(this.pattern)
						]
					]
				});
			}
		}));


	}

	ngOnInit() {
	}

	ngOnDestroy(): void {
		//Called once, before the instance is destroyed.
		//Add 'implements OnDestroy' to the class.
		this.subscriptions.map(subscription => {
			subscription.unsubscribe();
		});
	}

	public EnableEdit(value: boolean) {
		this.enableEdit = value;
		if (!value) {
			this.form.get('content').setValue(this.displaySettings.content);
			this.form.updateValueAndValidity();
		}
	}

	public SubmitForm() {
		this.loading = true;
		this._chatWindowCustomizations.UpdateChatWindowContentSettings('ticketForm', {
			btnText: this.displaySettings.btnText,
			content: this.form.get('content').value
		}).subscribe(response => {
			this.loading = false;
			if (response.status == 'ok') {
				//Todo Completion Logic Here
			}
		}, err => {
			this.loading = false;
			//Todo Error View Logic Here
		})
	}


}
