import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ChatWindowCustomizations } from '../../../../../services/LocalServices/ChatWindowCustomizations';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../../../services/AuthenticationService';
import { GlobalStateService } from '../../../../../services/GlobalStateService';

@Component({
	selector: 'app-message-window',
	templateUrl: './message-window.component.html',
	styleUrls: ['./message-window.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class MessageWindowComponent implements OnInit {

	private subscriptions: Subscription[] = [];
	public displaySettings: any = undefined;
	public displaySettingsBackup: any = undefined;
	public themeSettings: any = undefined;
	public form: FormGroup;
	public enableEdit = false;
	public loading = false;
	public loadingContent = false;
	sbt = false;

	//Only Letters Regex
	private pattern = /^[a-z][a-z.\s-]{1,255}$/i;
	public colorRegex = /^#[0-9a-fA-F]{8}$|#[0-9a-fA-F]{6}$|#[0-9a-fA-F]{4}$|#[0-9a-fA-F]{3}$/;

	constructor(private _chatWindowCustomizations: ChatWindowCustomizations,
		private _appStateService: GlobalStateService,
		private _authService: AuthService,
		private formbuilder: FormBuilder,
		public snackBar: MatSnackBar,
		public dialog: MatDialog
	) {
		this._appStateService.contentInfo.next('');
		this._appStateService.breadCrumbTitle.next('Chat Window Customizations');
		this.subscriptions.push(this._chatWindowCustomizations.GetDisplaySettings().subscribe(displaySettings => {
			if (displaySettings) {
				this.displaySettings = displaySettings.settings.chatwindow.messageWindow;
				this.displaySettingsBackup = JSON.parse(JSON.stringify(displaySettings.settings.chatwindow.messageWindow));
				this.themeSettings = displaySettings.settings.chatwindow.themeSettings;
				this.enableEdit = false;
				this.form = formbuilder.group({
					'heading': [
						this.displaySettings.heading,
						[
							Validators.required,
							Validators.pattern(this.pattern)
						]
					],

					'sentBGColor': [
						this.displaySettings.sentBGColor,
						[
							Validators.required,
							Validators.pattern(this.colorRegex)
						]
					],
					'sentForeColor': [
						this.displaySettings.sentForeColor,
						[
							Validators.required,
							Validators.pattern(this.colorRegex)
						]
					],
					'recieveBGColor': [
						this.displaySettings.recieveBGColor,
						[
							Validators.required,
							Validators.pattern(this.colorRegex)
						]
					],
					'recieveForeColor': [
						this.displaySettings.recieveForeColor,
						[
							Validators.required,
							Validators.pattern(this.colorRegex)
						]
					],


					'sentBGAvatarColor': [
						this.displaySettings.sentBGAvatarColor,
						[
							Validators.required,
							Validators.pattern(this.colorRegex)
						]
					], 'sentForeAvatarColor': [
						this.displaySettings.sentForeAvatarColor,
						[
							Validators.required,
							Validators.pattern(this.colorRegex)
						]
					], 'recieveBGAvatarColor': [
						this.displaySettings.recieveBGAvatarColor,
						[
							Validators.required,
							Validators.pattern(this.colorRegex)
						]
					], 'recieveForeAvatarColor': [
						this.displaySettings.recieveForeAvatarColor,
						[
							Validators.required,
							Validators.pattern(this.colorRegex)
						]
					],
				});
			}
		}));

		this.subscriptions.push(_authService.SBT.subscribe(data => {
			this.sbt = data;
		}))


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

	public ColorChange(event: string, data: any) {
		this.form.get(event).setValue(this._chatWindowCustomizations.RGBAToHexAString(data));
	}

	public Reset() {
		this.displaySettings = JSON.parse(JSON.stringify(this.displaySettingsBackup));
	}

	public ResetToDefaults() {
		this.displaySettings = {
			heading: 'Hello from' + (this.sbt) ? 'SBT' : 'Beelinks',
			sentBGColor: '#D2D6DE66',
			sentForeColor: '#000000FF',
			recieveBGColor: '#FF681F1A',
			recieveForeColor: '#000000FF',
			sentBGAvatarColor: '#1F282EFF',
			sentForeAvatarColor: '#FFFFFFFF',
			recieveBGAvatarColor: '#FF681FFF',
			recieveForeAvatarColor: '#FFFFFFFF'
		}
	}


	public EnableEdit(value: boolean) {
		this.enableEdit = value;
		if (!value) {
			this.form.get('heading').setValue(this.displaySettings.heading);
			this.form.get('sentBGColor').value,
				this.form.get('sentForeColor').value,
				this.form.get('recieveBGColor').value,
				this.form.get('recieveForeColor').value,
				this.form.get('sentBGAvatarColor').value,
				this.form.get('sentForeAvatarColor').value,
				this.form.get('recieveBGAvatarColor').value,
				this.form.get('recieveForeAvatarColor').value
			this.form.updateValueAndValidity();
		}
	}

	public SubmitForm(content) {
	
		(content) ? this.loadingContent = true : this.loading = true;
		this._chatWindowCustomizations.UpdateChatWindowContentSettings('messageWindow', this.displaySettings).subscribe(response => {		
			(content) ? this.loadingContent = false : this.loading = false;
			if (response.status == 'ok') {
				this.displaySettingsBackup = JSON.parse(JSON.stringify(this.displaySettings))
				//this.displaySettings = this.form.value
				//Todo Completion Logic Here
			}
		}, err => {
			(content) ? this.loadingContent = false : this.loading = false;
			//Todo Error View Logic Here
		})
	}

	public ApplyHeaderColorWithGradient(color: string) {
		return JSON.parse(JSON.parse(JSON.stringify(`{
      "background": "linear-gradient(20deg,${this.themeSettings.headerSecondryColor} 30%, ${this.themeSettings.headerColor} 100%)"
    }`)));
	}


}
