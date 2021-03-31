import { Component, ViewEncapsulation, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ChatWindowCustomizations } from '../../../../../services/LocalServices/ChatWindowCustomizations';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GlobalStateService } from '../../../../../services/GlobalStateService';

@Component({
	selector: 'app-dialog-theme',
	templateUrl: './dialog-theme.component.html',
	styleUrls: ['./dialog-theme.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class DialogThemeComponent implements OnInit {

	private subscriptions: Subscription[] = [];
	public displaySettings: any = undefined;
	private backupDisplaySettings: any = undefined;
	public form: FormGroup;
	public loading = false;

	public colorRegex = /^#[0-9a-fA-F]{8}$|#[0-9a-fA-F]{6}$|#[0-9a-fA-F]{4}$|#[0-9a-fA-F]{3}$/;

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
			if (displaySettings) {
				this.displaySettings = displaySettings.settings.chatwindow.dialogSettings;
				this.backupDisplaySettings = JSON.parse(JSON.stringify(displaySettings.settings.chatwindow.dialogSettings));
				this.form = formbuilder.group({
					'dialogBgColor': [
						this.displaySettings.dialogBgColor,
						[
							Validators.required,
							Validators.pattern(this.colorRegex)
						]
					],
					'dialogBtnColor': [
						this.displaySettings.dialogBtnColor,
						[
							Validators.required,
							Validators.pattern(this.colorRegex)
						]
					],
					'dialogSecondaryBtnColor': [
						this.displaySettings.dialogSecondaryBtnColor,
						[
							Validators.required,
							Validators.pattern(this.colorRegex)
						]
					],
					'dialogTextColor': [
						this.displaySettings.dialogTextColor,
						[
							Validators.required,
							Validators.pattern(this.colorRegex)
						]
					],
					'dialogBtnTextColor': [
						this.displaySettings.dialogBtnTextColor,
						[
							Validators.required,
							Validators.pattern(this.colorRegex)
						]
					],
					'dialogSecondaryBtnTextColor': [
						this.displaySettings.dialogSecondaryBtnTextColor,
						[
							Validators.required,
							Validators.pattern(this.colorRegex)
						]
					],
					'dialogLogoColor': [
						this.displaySettings.dialogLogoColor,
						[
							Validators.required,
							Validators.pattern(this.colorRegex)
						]
					],
				});
			}

		}));

	}

	ngOnInit() {

	}

	public SvgChangeColor() {
		let svgElement = (this.logo.nativeElement as HTMLObjectElement).contentDocument.getElementsByTagName('path').item(0);
		(svgElement as SVGPathElement).setAttribute('fill', this.displaySettings.dialogLogoColor);
	}

	ngOnDestroy(): void {
		//Called once, before the instance is destroyed.
		//Add 'implements OnDestroy' to the class.
		this.subscriptions.map(subscription => {
			subscription.unsubscribe();
		});
	}

	public ModelChange(event: string, data: any) {
		//console.log('Model Change');
		this.displaySettings[event] = this._chatWindowCustomizations.RGBAToHexAString(data).toLowerCase();
	}

	public ColorChange(event: string, data: any) {
		setTimeout(() => {
			//console.log('Color Change');
			this.form.get(event).setValue(this._chatWindowCustomizations.RGBAToHexAString(data));
			if (event == 'dialogLogoColor') this.SvgChangeColor();
		}, 0);


	}

	public TransformColor(value: string) {
		return this._chatWindowCustomizations.RGBAToHexAString(value);
	}


	public Reset() {
		this.displaySettings = JSON.parse(JSON.stringify(this.backupDisplaySettings));
		this.SvgChangeColor()
	}

	public ResetToDefaults() {
		this.displaySettings = {
			dialogBgColor: '#FFFFFFFF',
			dialogBtnColor: '#368763FF',
			dialogSecondaryBtnColor: '#C9302CFF',
			dialogTextColor: '#231f20FF',
			dialogBtnTextColor: '#ColorChangeFFFFFFFF',
			dialogSecondaryBtnTextColor: '#FFFFFFFF',
			dialogLogoColor: '#F15C24FF'
		}
		this.SvgChangeColor();

	}

	public SubmitForm() {
		this.loading = true;
		this._chatWindowCustomizations.UpdateChatWindowContentSettings('dialogSettings', this.displaySettings).subscribe(response => {
			this.loading = false;
			if (response.status == 'ok') {
				this.backupDisplaySettings = JSON.parse(JSON.stringify(this.displaySettings))
				//Todo Completion Logic Here
			}
		}, err => {
			this.loading = false;
			//Todo Error View Logic Here
		})
	}


}

// db.tickets.find().snapshot().forEach(function(x)=>{
// 	printjson(x);
// 	})
