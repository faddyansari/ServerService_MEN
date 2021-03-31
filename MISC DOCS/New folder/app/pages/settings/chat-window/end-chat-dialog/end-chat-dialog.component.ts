import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ChatWindowCustomizations } from '../../../../../services/LocalServices/ChatWindowCustomizations';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { GlobalStateService } from '../../../../../services/GlobalStateService';

@Component({
	selector: 'app-end-chat-dialog',
	templateUrl: './end-chat-dialog.component.html',
	styleUrls: ['./end-chat-dialog.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class EndChatDialogComponent implements OnInit {


	private subscriptions: Subscription[] = [];
	public displaySettings: any = undefined;
	public form: FormGroup;
	public enableEdit = false;
	public loading = false;
	themeSettings: any;
	@ViewChild('logo') logo: ElementRef;


	//Only Letters Regex
	private pattern = /^[a-z][a-z.\s-]{1,255}\?*$/i;

	constructor(private _chatWindowCustomizations: ChatWindowCustomizations,
		private _appStateService: GlobalStateService,
		private formbuilder: FormBuilder,
		public snackBar: MatSnackBar,
		public dialog: MatDialog
	) {
		this._appStateService.contentInfo.next('');
		this._appStateService.breadCrumbTitle.next('Chat Window Customizations');
		this.form = formbuilder.group({
			'content': [
				'',
				[
					Validators.required,
					Validators.pattern(this.pattern)
				]
			]
		});
		this.subscriptions.push(this._chatWindowCustomizations.GetDisplaySettings().subscribe(displaySettings => {
			if (displaySettings) {
				this.displaySettings = displaySettings.settings.chatwindow.closeScreen;
				this.enableEdit = false;
				this.themeSettings = displaySettings.settings.chatwindow.dialogSettings;
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

	public SvgChangeColor() {
		let svgElement = (this.logo.nativeElement as HTMLObjectElement).contentDocument.getElementsByTagName('path').item(0);
		(svgElement as SVGPathElement).setAttribute('fill', this.themeSettings.dialogLogoColor);
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
		this._chatWindowCustomizations.UpdateChatWindowContentSettings('closeScreen', {
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
	ngOnDestroy() {
		this.subscriptions.forEach(subscription => {
			subscription.unsubscribe();
		});
	}

}
