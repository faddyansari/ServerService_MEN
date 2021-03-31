import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ChatWindowCustomizations } from '../../../../../services/LocalServices/ChatWindowCustomizations';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { GlobalStateService } from '../../../../../services/GlobalStateService';

@Component({
	selector: 'app-ticket-submission-dialog',
	templateUrl: './ticket-submission-dialog.component.html',
	styleUrls: ['./ticket-submission-dialog.component.scss'],
	encapsulation: ViewEncapsulation.None,
})
export class TicketSubmissionDialogComponent {

	private subscriptions: Subscription[] = [];
	public displaySettings: any = undefined;
	public form: FormGroup;
	public enableEdit = false;
	public loading = false;
	public themeSettings: any;


	//Only Letters Regex
	// private pattern = /^[a-z!@#\$%\^\&*\)\(+=._-][a-z.\s-]{1,255}\?*$/i;

	@ViewChild('logo') logo: ElementRef;

	constructor(private _chatWindowCustomizations: ChatWindowCustomizations,
		private _appStateService: GlobalStateService,
		private formbuilder: FormBuilder,
		public snackBar: MatSnackBar,
		public dialog: MatDialog
	) {
		this._appStateService.contentInfo.next('');
		this._appStateService.breadCrumbTitle.next('Chat Window Customizations');
		this.subscriptions.push(this._chatWindowCustomizations.GetDisplaySettings().subscribe(displaySettings => {
			this.displaySettings = displaySettings.settings.chatwindow.ticketSubmitted;
			this.themeSettings = displaySettings.settings.chatwindow.dialogSettings;
			this.enableEdit = false;
			this.form = formbuilder.group({
				'heading': [
					this.displaySettings.heading,
					[
						Validators.required,
						// Validators.pattern(this.pattern)
					]
				],
				'content': [
					this.displaySettings.content,
					[
						Validators.required,
						// Validators.pattern(this.pattern)
					]
				]
			});
		}));


	}

	public SvgChangeColor() {
		let svgElement = (this.logo.nativeElement as HTMLObjectElement).contentDocument.getElementsByTagName('path').item(0);
		(svgElement as SVGPathElement).setAttribute('fill', this.themeSettings.dialogLogoColor);
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
			this.form.get('heading').setValue(this.displaySettings.heading);
			this.form.get('content').setValue(this.displaySettings.content);
			this.form.updateValueAndValidity();
		}
	}

	public SubmitForm() {
		this.loading = true;
		this._chatWindowCustomizations.UpdateChatWindowContentSettings('ticketSubmitted', {
			heading: this.form.get('heading').value,
			content: this.form.get('content').value,
			btn1Text: this.displaySettings.btn1Text,
			btn2Text: this.displaySettings.btn2Text
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
