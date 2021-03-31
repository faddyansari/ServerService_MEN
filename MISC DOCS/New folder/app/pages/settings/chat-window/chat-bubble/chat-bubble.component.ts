import { Component, OnInit, ViewEncapsulation, ElementRef, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs/Observable';

//Services Import
import { ChatWindowCustomizations } from '../../../../../services/LocalServices/ChatWindowCustomizations';
import { GlobalStateService } from '../../../../../services/GlobalStateService';
import { ToastNotifications } from '../../../../dialogs/SnackBar-Dialog/toast-notifications.component';
import { parseBooleans } from 'xml2js/lib/processors';

@Component({
	selector: 'app-chat-bubble',
	templateUrl: './chat-bubble.component.html',
	styleUrls: ['./chat-bubble.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class ChatBubbleComponent implements OnInit {

	@ViewChild('logo') logo: ElementRef;

	private subscriptions: Subscription[] = [];
	public displaySettings: any = undefined;
	public chatBubbleForm: FormGroup;
	public chatBarForm: FormGroup;
	public avatarForm: FormGroup;
	public colorRegex = /^#[0-9a-fA-F]{8}$|#[0-9a-fA-F]{6}$|#[0-9a-fA-F]{4}$|#[0-9a-fA-F]{3}$/;
	private signalColorCopy;
	private backupDisplaySettings: any = {};
	val = "Top Left"
	public loading = false;
	positionOption = {
		'top': false,
		'bottom': false,
		'left': false,
		'right': false
	}


	constructor(
		private _chatWindowCustomizations: ChatWindowCustomizations,
		private _appStateService: GlobalStateService,
		private formbuilder: FormBuilder,
		public snackBar: MatSnackBar,
		public dialog: MatDialog
	) {
		this._appStateService.contentInfo.next('');
		this._appStateService.breadCrumbTitle.next('Chat Window Customizations');
		this.subscriptions.push(this._chatWindowCustomizations.GetDisplaySettings().subscribe(displaySettings => {

			if (displaySettings) {
				this.displaySettings = displaySettings;
				this.backupDisplaySettings = JSON.parse(JSON.stringify(this.displaySettings));
				this.InitChatBubbleForm();
				this.InitChatBarForm();
				this.SetOptions(this.displaySettings.settings[!this.displaySettings.barEnabled ? 'chatbubble' : 'chatbar'].position);
			}
		}
		));

	}


	ngOnInit() {

	}

	SetBarEnabledForView(value, name) {
	
		this.displaySettings[name] = value;

	}
	
	SetBarEnabled(value) {
		this.displaySettings.barEnabled = value
		this.SetOptions(this.displaySettings.settings[!this.displaySettings.barEnabled ? 'chatbubble' : 'chatbar'].position)
	}

	public Reset() {
		this.displaySettings.barEnabledForMobile = this.backupDisplaySettings.barEnabledForMobile;
		this.displaySettings.barEnabledForMobile = this.backupDisplaySettings.barEnabledForDesktop;
		if (this.displaySettings.barEnabled) {
			this.displaySettings.settings.chatbar = JSON.parse(JSON.stringify(this.backupDisplaySettings.settings.chatbar));
			this.SvgChangeColor(this.logo as any)
		} else {
			this.displaySettings.settings.chatbubble = JSON.parse(JSON.stringify(this.backupDisplaySettings.settings.chatbubble));
			this.SvgChangeColor(this.logo as any)
		}
		this.SetOptions(this.displaySettings.settings[!this.backupDisplaySettings.barEnabled ? 'chatbubble' : 'chatbar'].position)
	}

	SetOptions(value) {
		if (value) {

			let options = value.split('-');
			Object.keys(this.positionOption).map(key => {
				if ((options as Array<any>).includes(key)) {
					this.positionOption[key] = true
					let value = this.displaySettings.settings[!this.displaySettings.barEnabled ? 'chatbubble' : 'chatbar'].absolutePosition[key];
					this.displaySettings.settings[!this.displaySettings.barEnabled ? 'chatbubble' : 'chatbar'].absolutePosition[key] = (value && ((value as string).toLocaleLowerCase() != 'inherit')) ? value : '0'
				}
				else {
					this.positionOption[key] = false
					this.displaySettings.settings[!this.displaySettings.barEnabled ? 'chatbubble' : 'chatbar'].absolutePosition[key] = 'inherit'
				}
			})

		}
	}

	SetPosition(event) {
		this.SetOptions(event.target.value)
	}

	SetControl(data) {
		this.chatBubbleForm.get(data.controlValue).setValue(data.value);
		this.displaySettings.settings[data.settingType][data.setting][data.controlValue] = data.value;
	}

	public ResetToDefaults() {
		this.displaySettings.barEnabledForMobile = false;
		this.displaySettings.barEnabledForMobile = false;
		if (this.displaySettings.barEnabled) {
			this.displaySettings.settings.chatbar = {
				bgColor: '#F15C24FF',
				logoColor: '#FFFFFFFF',
				title: 'Chat Now',
				position: 'bottom-right',
				absolutePosition: {
					left: 'inherit',
					bottom: '0',
					right: '0',
					top: 'inherit',
				},
				radius: {
					topLeft: '0',
					topRight: '0',
					bottomLeft: '0',
					bottomRight: '0'
				},
			}
			this.SvgChangeColor(this.logo as any)
		} else {
			this.displaySettings.settings.chatbubble = {
				signals: {
					enabled: false,
					signalColor: '#F15C24FF',
					opacity: 1
				},
				radius: {
					topLeft: '50',
					topRight: '50',
					bottomLeft: '50',
					bottomRight: '50'
				},
				bgColor: '#F15C24FF',
				logoColor: '#FFFFFFFF',
				position: 'bottom-right',
				absolutePosition: {
					left: 'inherit',
					bottom: '0',
					right: '0',
					top: 'inherit',
				}
			}
			this.SvgChangeColor(this.logo as any)

		}

	}

	public SvgChangeColor(svg: SVGElement) {
		// let svgElement = (this.logo.nativeElement as HTMLObjectElement).contentDocument.getElementsByTagName('path').item(0);
		let svgElement = (this.logo.nativeElement as HTMLObjectElement);
		(svgElement).setAttribute('fill', (this.displaySettings.barEnabled) ? this.displaySettings.settings.chatbar.logoColor : this.displaySettings.settings.chatbubble.logoColor);
	}


	private InitChatBubbleForm() {
		//FormInitializers
		this.signalColorCopy = this.displaySettings.settings.chatbubble.signals.signalColor;
		this.chatBubbleForm = this.formbuilder.group({
			'signalsEnable': [
				this.displaySettings.settings.chatbubble.signals.enabled
			],
			'signalColor':
				[
					this.displaySettings.settings.chatbubble.signals.signalColor,
					[
						Validators.required
					],
					this.IsValidColor.bind(this)
				],
			'signalOpacity':
				[
					this.displaySettings.settings.chatbubble.signals.opacity,
					Validators.required
				],
			'bgColor': [
				this.displaySettings.settings.chatbubble.bgColor,
				[
					Validators.required,
					Validators.pattern(this.colorRegex)
				]
			],
			'logoColor': [
				this.displaySettings.settings.chatbubble.logoColor,
				[
					Validators.required,
					Validators.pattern(this.colorRegex)
				]
			],
			'position': [
				this.displaySettings.settings.chatbubble.position,
				Validators.required
			],
			'topLeft': [
				this.displaySettings.settings.chatbubble.radius.topLeft,
				Validators.required
			],
			'topRight': [
				this.displaySettings.settings.chatbubble.radius.topRight,
				Validators.required
			],
			'bottomLeft': [
				this.displaySettings.settings.chatbubble.radius.bottomLeft,
				Validators.required
			],
			'bottomRight': [
				this.displaySettings.settings.chatbubble.radius.bottomRight,
				Validators.required
			],
			'left': [
				this.displaySettings.settings.chatbubble.absolutePosition.left,
				Validators.required
			],
			'right': [
				this.displaySettings.settings.chatbubble.absolutePosition.right,
				Validators.required
			],
			'top': [
				this.displaySettings.settings.chatbubble.absolutePosition.top,
				Validators.required
			],
			'bottom': [
				this.displaySettings.settings.chatbubble.absolutePosition.bottom,
				Validators.required
			]

		});
	}


	private InitChatBarForm() {
		this.chatBarForm = this.formbuilder.group({
			'bgColor': [
				this.displaySettings.settings.chatbar.bgColor,
				[
					Validators.required,
					Validators.pattern(this.colorRegex)
				]
			],
			'logoColor': [
				this.displaySettings.settings.chatbar.logoColor,
				[
					Validators.required,
					Validators.pattern(this.colorRegex)
				]
			],
			'title':
				[
					this.displaySettings.settings.chatbar.title,
					Validators.required
				],
			'position':
				[
					this.displaySettings.settings.chatbar.position,
					Validators.required
				],
			'borderRadius': [
				this.displaySettings.settings.chatbar.radius,
				Validators.required
			],
			'topLeft': [
				this.displaySettings.settings.chatbar.radius.topLeft,
				Validators.required
			],
			'topRight': [
				this.displaySettings.settings.chatbar.radius.topRight,
				Validators.required
			],
			'bottomLeft': [
				this.displaySettings.settings.chatbar.radius.bottomLeft,
				Validators.required
			],
			'bottomRight': [
				this.displaySettings.settings.chatbar.radius.bottomRight,
				Validators.required
			],
			'left': [
				this.displaySettings.settings.chatbar.absolutePosition.left,
				Validators.required
			],
			'right': [
				this.displaySettings.settings.chatbar.absolutePosition.right,
				Validators.required
			],
			'top': [
				this.displaySettings.settings.chatbar.absolutePosition.top,
				Validators.required
			],
			'bottom': [
				this.displaySettings.settings.chatbar.absolutePosition.bottom,
				Validators.required
			]
		});
	}

	private IsValidColor(control: FormControl): Observable<any> {
		let color = control.value;
		if (this.colorRegex.test(color)) {
			this.displaySettings.settings.chatbubble.signals.signalColor = color;
			return Observable.of(null);
		}
		return Observable.of({ 'invalid': true });
	}

	public SignalEnabled(value: boolean) {
		this.displaySettings.settings.chatbubble.signals.enabled = value;
		this.chatBubbleForm.get('signalColor').setValue(this.signalColorCopy);
	}


	SaveSettings(formType: string) {
		this.loading = true;
		this._chatWindowCustomizations.UpdateChaWindowSettings(formType, this.displaySettings).subscribe(response => {
			this.loading = false;
			//TODO SHOW NOTICIFACTION THAT SETTINGS UPDATED
			if (response.status == 'ok') {
				if (formType == 'chatbubble') {
					this.backupDisplaySettings = JSON.parse(JSON.stringify(this.displaySettings));
					this.signalColorCopy = this.displaySettings.settings.chatbubble.signals.signalColor;
				}
				this.snackBar.openFromComponent(ToastNotifications, {
					data: {
						img: 'ok',
						msg: 'Settings saved successfully!'
					},
					duration: 2000,
					panelClass: ['user-alert', 'success']
				});

			}
		}, err => {
			// console.log(err);
			this.snackBar.openFromComponent(ToastNotifications, {
				data: {
					img: 'ok',
					msg: 'Error in saving Settings!'
				},
				duration: 2000,
				panelClass: ['user-alert', 'success']
			});
		});
	}


	ColorChange(event: string, data: any) {

		switch (event) {
			case 'signalColor':
				this.chatBubbleForm.get('signalColor').setValue(this._chatWindowCustomizations.RGBAToHexAString(data));
				break;
			case 'bgColor':
				this.chatBubbleForm.get('bgColor').setValue(this._chatWindowCustomizations.RGBAToHexAString(data));
				break;
			case 'logoColor':
				setTimeout(() => {
					(this.displaySettings.barEnabled) ? this.chatBarForm.get('logoColor').setValue(this._chatWindowCustomizations.RGBAToHexAString(data)) : this.chatBubbleForm.get('logoColor').setValue(this._chatWindowCustomizations.RGBAToHexAString(data));
					this.SvgChangeColor(this.logo as any)
				}, 0);

				break;
			case 'barColor':
				this.chatBarForm.get('bgColor').setValue(this._chatWindowCustomizations.RGBAToHexAString(data));
				break;
			case 'avatarColor':
				this.avatarForm.get('avatarColor').setValue(this._chatWindowCustomizations.RGBAToHexAString(data));
				break;
		}

	}


	DisableInput(event: KeyboardEvent) {
		event.preventDefault();
	}


	ngOnDestroy(): void {
		//Called once, before the instance is destroyed.
		//Add 'implements OnDestroy' to the class.
		this.subscriptions.map(subscription => {
			subscription.unsubscribe();
		});
	}


}
