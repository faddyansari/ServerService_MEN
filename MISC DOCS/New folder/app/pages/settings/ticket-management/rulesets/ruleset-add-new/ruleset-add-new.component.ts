import { Component, ViewChild, ElementRef, Input, ViewEncapsulation } from '@angular/core';
import { RulesetSettingsService } from '../../../../../../services/LocalServices/RulesetsService';
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";

import { Subscription } from 'rxjs/Subscription';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { UtilityService } from '../../../../../../services/UtilityServices/UtilityService';
import { ConfirmationDialogComponent } from '../../../../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { MatDialog, MatSnackBar } from '@angular/material';
import { AuthService } from '../../../../../../services/AuthenticationService';
import { GlobalStateService } from '../../../../../../services/GlobalStateService';
import { ToastNotifications } from '../../../../../dialogs/SnackBar-Dialog/toast-notifications.component';

@Component({
	selector: 'app-ruleset-add-new',
	templateUrl: './ruleset-add-new.component.html',
	styleUrls: ['./ruleset-add-new.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class RulesetAddNewComponent {
	@Input() RuleObject: any;


	nsp: string = '';
	email: string = '';
	subscriptions: Subscription[] = [];
	public addRuleSetForm: FormGroup


	emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


	public groupsList = [];
	public priorityList = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
	public srcList = [{ display: 'Live Chat', value: 'livechat' }, { display: 'Email', value: 'email' }, { display: 'Agent Panel', value: 'panel' }];
	public agentsList = [];
	public agentsList_original = [];
	formChanges: any;
	@ViewChild('autoLocation') autoLocation: ElementRef;

	public config: any = {
		placeholder: 'Add Note..',
		toolbar: [
			['style', ['bold', 'italic', 'underline', 'clear']],
			['fontname', ['fontname']],
			['table', ['table']],
			['font', ['strikethrough', 'superscript', 'subscript']],
			['fontstyle', ['backcolor']],
			['fontsize', ['fontsize']],
			['color', ['color']],
			['para', ['ul', 'ol', 'paragraph']],
			['height', ['height']],
			['insert', ['linkDialogShow', 'unlink']],
			['view', ['fullscreen', 'codeview', 'help', 'undo', 'redo']]
		]
	}

	public locations = {
		"AD": "Andorra",
		"AE": "United Arab Emirates",
		"AF": "Afghanistan",
		"AG": "Antigua and Barbuda",
		"AI": "Anguilla",
		"AL": "Albania",
		"AM": "Armenia",
		"AO": "Angola",
		"AQ": "Antarctica",
		"AR": "Argentina",
		"AS": "American Samoa",
		"AT": "Austria",
		"AU": "Australia",
		"AW": "Aruba",
		"AX": "Aland Islands",
		"AZ": "Azerbaijan",
		"BA": "Bosnia and Herzegovina",
		"BB": "Barbados",
		"BD": "Bangladesh",
		"BE": "Belgium",
		"BF": "Burkina Faso",
		"BG": "Bulgaria",
		"BH": "Bahrain",
		"BI": "Burundi",
		"BJ": "Benin",
		"BL": "Saint Barthelemy",
		"BM": "Bermuda",
		"BN": "Brunei",
		"BO": "Bolivia",
		"BQ": "Bonaire, Saint Eustatius and Saba ",
		"BR": "Brazil",
		"BS": "Bahamas",
		"BT": "Bhutan",
		"BV": "Bouvet Island",
		"BW": "Botswana",
		"BY": "Belarus",
		"BZ": "Belize",
		"CA": "Canada",
		"CC": "Cocos Islands",
		"CD": "Democratic Republic of the Congo",
		"CF": "Central African Republic",
		"CG": "Republic of the Congo",
		"CH": "Switzerland",
		"CI": "Ivory Coast",
		"CK": "Cook Islands",
		"CL": "Chile",
		"CM": "Cameroon",
		"CN": "China",
		"CO": "Colombia",
		"CR": "Costa Rica",
		"CU": "Cuba",
		"CV": "Cape Verde",
		"CW": "Curacao",
		"CX": "Christmas Island",
		"CY": "Cyprus",
		"CZ": "Czech Republic",
		"DE": "Germany",
		"DF": "Default",
		"DJ": "Djibouti",
		"DK": "Denmark",
		"DM": "Dominica",
		"DO": "Dominican Republic",
		"DZ": "Algeria",
		"EC": "Ecuador",
		"EE": "Estonia",
		"EG": "Egypt",
		"EH": "Western Sahara",
		"ER": "Eritrea",
		"ES": "Spain",
		"ET": "Ethiopia",
		"FI": "Finland",
		"FJ": "Fiji",
		"FK": "Falkland Islands",
		"FM": "Micronesia",
		"FO": "Faroe Islands",
		"FR": "France",
		"GA": "Gabon",
		"GB": "United Kingdom",
		"GD": "Grenada",
		"GE": "Georgia",
		"GF": "French Guiana",
		"GG": "Guernsey",
		"GH": "Ghana",
		"GI": "Gibraltar",
		"GL": "Greenland",
		"GM": "Gambia",
		"GN": "Guinea",
		"GP": "Guadeloupe",
		"GQ": "Equatorial Guinea",
		"GR": "Greece",
		"GS": "South Georgia and the South Sandwich Islands",
		"GT": "Guatemala",
		"GU": "Guam",
		"GW": "Guinea-Bissau",
		"GY": "Guyana",
		"HK": "Hong Kong",
		"HM": "Heard Island and McDonald Islands",
		"HN": "Honduras",
		"HR": "Croatia",
		"HT": "Haiti",
		"HU": "Hungary",
		"ID": "Indonesia",
		"IE": "Ireland",
		"IL": "Israel",
		"IM": "Isle of Man",
		"IN": "India",
		"IO": "British Indian Ocean Territory",
		"IQ": "Iraq",
		"IR": "Iran",
		"IS": "Iceland",
		"IT": "Italy",
		"JE": "Jersey",
		"JM": "Jamaica",
		"JO": "Jordan",
		"JP": "Japan",
		"KE": "Kenya",
		"KG": "Kyrgyzstan",
		"KH": "Cambodia",
		"KI": "Kiribati",
		"KM": "Comoros",
		"KN": "Saint Kitts and Nevis",
		"KP": "North Korea",
		"KR": "South Korea",
		"KW": "Kuwait",
		"KY": "Cayman Islands",
		"KZ": "Kazakhstan",
		"LA": "Laos",
		"LB": "Lebanon",
		"LC": "Saint Lucia",
		"LI": "Liechtenstein",
		"LK": "Sri Lanka",
		"LR": "Liberia",
		"LS": "Lesotho",
		"LT": "Lithuania",
		"LU": "Luxembourg",
		"LV": "Latvia",
		"LY": "Libya",
		"MA": "Morocco",
		"MC": "Monaco",
		"MD": "Moldova",
		"ME": "Montenegro",
		"MF": "Saint Martin",
		"MG": "Madagascar",
		"MH": "Marshall Islands",
		"MK": "Macedonia",
		"ML": "Mali",
		"MM": "Myanmar",
		"MN": "Mongolia",
		"MO": "Macao",
		"MP": "Northern Mariana Islands",
		"MQ": "Martinique",
		"MR": "Mauritania",
		"MS": "Montserrat",
		"MT": "Malta",
		"MU": "Mauritius",
		"MV": "Maldives",
		"MW": "Malawi",
		"MX": "Mexico",
		"MY": "Malaysia",
		"MZ": "Mozambique",
		"NA": "Namibia",
		"NC": "New Caledonia",
		"NE": "Niger",
		"NF": "Norfolk Island",
		"NG": "Nigeria",
		"NI": "Nicaragua",
		"NL": "Netherlands",
		"NO": "Norway",
		"NP": "Nepal",
		"NR": "Nauru",
		"NU": "Niue",
		"NZ": "New Zealand",
		"OM": "Oman",
		"PA": "Panama",
		"PE": "Peru",
		"PF": "French Polynesia",
		"PG": "Papua New Guinea",
		"PH": "Philippines",
		"PK": "Pakistan",
		"PL": "Poland",
		"PM": "Saint Pierre and Miquelon",
		"PN": "Pitcairn",
		"PR": "Puerto Rico",
		"PS": "Palestinian Territory",
		"PT": "Portugal",
		"PW": "Palau",
		"PY": "Paraguay",
		"QA": "Qatar",
		"RE": "Reunion",
		"RS": "Serbia",
		"RU": "Russia",
		"RW": "Rwanda",
		"SA": "Saudi Arabia",
		"SB": "Solomon Islands",
		"SC": "Seychelles",
		"SD": "Sudan",
		"SE": "Sweden",
		"SG": "Singapore",
		"SH": "Saint Helena",
		"SI": "Slovenia",
		"SJ": "Svalbard and Jan Mayen",
		"SK": "Slovakia",
		"SL": "Sierra Leone",
		"SM": "San Marino",
		"SN": "Senegal",
		"SO": "Somalia",
		"SR": "Suriname",
		"SS": "South Sudan",
		"ST": "Sao Tome and Principe",
		"SV": "El Salvador",
		"SX": "Sint Maarten",
		"SY": "Syria",
		"SZ": "Swaziland",
		"TC": "Turks and Caicos Islands",
		"TD": "Chad",
		"TF": "French Southern Territories",
		"TG": "Togo",
		"TH": "Thailand",
		"TJ": "Tajikistan",
		"TK": "Tokelau",
		"TL": "East Timor",
		"TM": "Turkmenistan",
		"TN": "Tunisia",
		"TO": "Tonga",
		"TR": "Turkey",
		"TT": "Trinidad and Tobago",
		"TV": "Tuvalu",
		"TW": "Taiwan",
		"TZ": "Tanzania",
		"RO": "Romania",
		"UA": "Ukraine",
		"UG": "Uganda",
		"UM": "United States Minor Outlying Islands",
		"US": "United States",
		"UY": "Uruguay",
		"UZ": "Uzbekistan",
		"VA": "Vatican",
		"VC": "Saint Vincent and the Grenadines",
		"VE": "Venezuela",
		"VG": "British Virgin Islands",
		"VI": "U.S. Virgin Islands",
		"VN": "Vietnam",
		"VU": "Vanuatu",
		"WF": "Wallis and Futuna",
		"WS": "Samoa",
		"XK": "Kosovo",
		"YE": "Yemen",
		"YT": "Mayotte",
		"ZA": "South Africa",
		"ZM": "Zambia",
		"ZW": "Zimbabwe"
	}

	public fileterCountryWithCodes = {

	}

	public searchItem = '';
	ended = false;
	loadingMoreAgents = false;
	fetchMoreEnabled = false;
	rulesetPermissions: any;
	package: any;
	constructor(private _ruleSetService: RulesetSettingsService,
		public _utilityService: UtilityService,
		private dialog: MatDialog,
		private _appStateService : GlobalStateService,
		private _authService: AuthService,
		private snackbar: MatSnackBar,
		public formbuilder: FormBuilder) {

		this.subscriptions.push(_authService.getPackageInfo().subscribe(pkg => {
			if (pkg) {
				this.package = pkg.tickets.rulesets;
				if (!this.package.allowed) {
					this._appStateService.NavigateTo('/noaccess');
				}
			}
			// console.log(agent);
		}));
		this.nsp = this._ruleSetService.Agent.nsp;
		this.email = this._ruleSetService.Agent.email;
		this.fileterCountryWithCodes = this.locations;


		this.subscriptions.push(this._ruleSetService.groupsList.subscribe(groupsList => {
			this.groupsList = groupsList;


		}));

		this.subscriptions.push(this._ruleSetService.agentsList.subscribe(agentsList => {
			this.agentsList = agentsList;
			this.agentsList_original = agentsList;
		}));

		this.subscriptions.push(this._authService.getSettings().subscribe(data => {
			if (data && data.permissions) {
				this.rulesetPermissions = data.permissions.settings.ticketManagement.rulesetSettings;
			}

		}));





		// (this.addRuleSetForm.get('actions') as FormArray).valueChanges.subscribe(values => {

		// });

	}

	//#region Conditions Curs
	AddCondition() {

		let fb: FormGroup = this.formbuilder.group({
			key: ['',
				[
					Validators.required
				]
			],
			matchingCriterea: ['',
				[Validators.required]

			],
			regex: [new RegExp(/\s/, 'gmi')],
			keywords: [[],
			[
				Validators.required
			],
			]
		})
		let conditions = this.addRuleSetForm.get('conditions') as FormArray;
		conditions.push(fb);
	}

	DeleteCondition(index) {
		let conditions = this.addRuleSetForm.get('conditions') as FormArray;
		conditions.removeAt(index);
	}

	TransformConditions(conditions?: Array<any>): FormGroup[] {
		let fb: FormGroup[] = [];
		conditions.map(condition => {
			fb.push(this.formbuilder.group({
				key: [condition.key,
				[
					Validators.required
				]
				],
				matchingCriterea: [condition.matchingCriterea,
				[Validators.required]

				],
				regex: [condition.regex],
				keywords: [condition.keywords,
				[
					Validators.required
				],
				]
			}));

		})

		return fb;
	}


	KeyChanged(index) {
		let conditions = this.addRuleSetForm.get('conditions') as FormArray;
		conditions.controls[index].get('matchingCriterea').setValue('');
		conditions.controls[index].get('keywords').setValue([]);
	}
	KeyPress() {
		this.SearchAutoComplete(this.searchItem);
	}

	OnLocationSelected(index, event: MatAutocompleteSelectedEvent) {
		let conditions = this.addRuleSetForm.get('conditions') as FormArray;
		let found = false;
		conditions.controls.map((control, index) => {
			control.get('keywords').value.map(keyword => {
				if (keyword == event.option.value) {
					found = true;
				}
			})
		})
		if (!found) {
			let locations = conditions.controls[index].get('keywords').value;
			locations.push(event.option.value);
			conditions.controls[index].get('keywords').setValue(locations);
		}
		this.searchItem = '';
		(this.autoLocation.nativeElement as HTMLInputElement).value = '';
		return false;
	}

	ModelChange(event: Event) {
		this.SearchAutoComplete(this.searchItem)
	}



	//#endregion

	ActionChanged(index) {
		let actions = this.addRuleSetForm.get('actions') as FormArray;
		actions.controls[index].get('value').setValue('');

	}

	public SearchAutoComplete(input?: string) {
		let fileterCountryWithCodes = {};
		if (!input) {
			Object.keys(this.locations).map(key => {
				fileterCountryWithCodes[key] = this.locations[key]
			});
		} else {
			Object.keys(this.locations).map(key => {
				if ((key.toLowerCase().indexOf(input.toLowerCase().trim()) != -1
					|| this.locations[key].toLowerCase().indexOf(input.toLowerCase().trim()) != -1)) {
					fileterCountryWithCodes[key] = this.locations[key]
				}
			});
		}
		this.fileterCountryWithCodes = fileterCountryWithCodes;

	}


	GetAvailableActions(i) {
		let actionList = {
			'agent': 'Assign To Agent',
			'group': 'Assign To Group',
			'priority': 'Set Priority',
			'note': 'Add Note'
		}
		let actions = this.addRuleSetForm.get('actions') as FormArray;
		actions.controls.map((control, index) => {
			if (actionList[actions.controls[index].get('name').value] && index != i) delete actionList[actions.controls[index].get('name').value]
		});
		return actionList;
	}

	//#regions Actions
	TransformActions(actions?: Array<any>): FormGroup[] {
		let fb: FormGroup[] = [];
		actions.map(action => {
			fb.push(this.formbuilder.group({
				name: [action.name, Validators.required],
				value: [action.value, Validators.required]
			}));

		});

		return fb;
	}

	AddAction() {

		let fb: FormGroup = this.formbuilder.group({
			name: ['', [Validators.required]],
			value: ['', [Validators.required]]

		})
		let actions = this.addRuleSetForm.get('actions') as FormArray;
		actions.push(fb);
	}

	DeleteAction(index) {
		let actions = this.addRuleSetForm.get('actions') as FormArray;
		actions.removeAt(index);
	}

	//#endregion



	ngOnInit() {

		this.addRuleSetForm = this.formbuilder.group({
			'name': [
				this.RuleObject.name,
				[
					Validators.required,
					Validators.maxLength(50),
					Validators.minLength(2)
				]
				//Async Validator
			],
			'operator': [
				this.RuleObject.operator,
				[
					Validators.required
				],
				//Async Validator
			],
			'conditions': this.formbuilder.array(this.TransformConditions(this.RuleObject.conditions), Validators.required),
			'actions': this.formbuilder.array(this.TransformActions(this.RuleObject.actions), Validators.required)
		});
		this.onValueChanges();
	}

	ngOnDestroy(): void {
		//Called once, before the instance is destroyed.
		//Add 'implements OnDestroy' to the class.
		this.subscriptions.map(subscription => {
			subscription.unsubscribe();
		});
	}

	onValueChanges() {
		this.addRuleSetForm.valueChanges.subscribe(res => {
			this.formChanges = res;
		})
	}

	GetControls(name: string) {
		return (this.addRuleSetForm.get(name) as FormArray).controls;
	}




	ParseConditions(formArray: FormArray) {

		let conditions = [];
		formArray.controls.map(control => {
			let obj = {
				key: control.get('key').value,
				matchingCriterea: control.get('matchingCriterea').value,
				regex: this.CreateRegex(control.get('matchingCriterea').value, control.get('keywords').value),
				keywords: control.get('keywords').value
			}
			conditions.push(obj);
		});
		return conditions;

	}

	ParseActions(formArray: FormArray) {


		let actions = [];
		formArray.controls.map(control => {
			let obj = {
				name: control.get('name').value,
				value: control.get('value').value
			}
			actions.push(obj);
		})
		return actions;
	}

	onItemAdded(event) {


	}

	CreateRegex(matchingCriterea: string, keywords: string[]) {
		let keywordString = '';
		switch (matchingCriterea) {
			case 'contains':
				keywordString = '(' + keywords.join('|') + ')';
				break;
			case 'startswith':
				keywordString = '^(' + keywords.join('|') + ')';
				break;
			case 'endswith':
				keywordString = '(' + keywords.join('|') + ')$';
				break;
			case 'matchexact':
				keywordString = '\\b(' + keywords.join('|') + ')\\b';
				break;
			case 'is':
				keywordString = '\\b(' + keywords.join('|') + ')\\b';
				break;
		}

		return keywordString;
	}

	public CancelAddRule() {
		if (this.formChanges) {
			this.dialog.open(ConfirmationDialogComponent, {
				panelClass: ['confirmation-dialog'],
				data: { headermsg: 'Are you sure want to leave?' }
			}).afterClosed().subscribe(data => {
				if (data == 'ok') {
					this._ruleSetService.Addrule.next(false);
					this._ruleSetService.SelectedRule.next(undefined);
				} else {
					return;
				}
			});
		}
		else {
			this._ruleSetService.Addrule.next(false);
			this._ruleSetService.SelectedRule.next(undefined);
		}

	}

	AddRuleSet() {

		let ruleset = {
			name: this.addRuleSetForm.get('name').value,
			nsp: this.nsp,
			isActive: false,
			operator: this.addRuleSetForm.get('operator').value,
			conditions: this.ParseConditions(this.addRuleSetForm.get('conditions') as FormArray),
			actions: this.ParseActions(this.addRuleSetForm.get('actions') as FormArray),
			lastmodified: { date: new Date().toISOString(), by: this.email },
		}
		// console.log(ruleset);

		this.subscriptions.push(this._ruleSetService.AddRuleSet(ruleset).subscribe(response => {
			if (response.status == 'ok') {
				//SHOW SNACKBAR
				this.snackbar.openFromComponent(ToastNotifications, {
					data: {
						img: 'ok',
						msg: 'Ruleset added Successfully!'
					},
					duration: 2000,
					panelClass: ['user-alert', 'success']
				});
			} else {
				//SHOW ERROR 
				this.snackbar.openFromComponent(ToastNotifications, {
					data: {
						img: 'warning',
						msg: response.msg
					},
					duration: 2000,
					panelClass: ['user-alert', 'error']
				});
			}
		}));
	}

	public UpdateRuleSet(id: string) {
		let ruleset = {
			name: this.addRuleSetForm.get('name').value,
			nsp: this.nsp,
			isActive: this.RuleObject.isActive,
			operator: this.addRuleSetForm.get('operator').value,
			conditions: this.ParseConditions(this.addRuleSetForm.get('conditions') as FormArray),
			actions: this.ParseActions(this.addRuleSetForm.get('actions') as FormArray),
			lastmodified: { date: new Date().toISOString(), by: this.email },
		}

		this.subscriptions.push(this._ruleSetService.UpdateRulesets(id, ruleset).subscribe(response => {
			if (response.status == 'ok') {
				//SHOW SNACKBAR
			} else {
				//SHOW ERROR 
			}
		}));
	}
	loadMore(event) {

		if (!this.ended && !this.loadingMoreAgents) {

			this.loadingMoreAgents = true;
			this._utilityService.getMoreAgentsObs(this.agentsList[this.agentsList.length - 1].first_name).subscribe(response => {

				this.agentsList = this.agentsList.concat(response.agents);
				this.ended = response.ended;
				this.loadingMoreAgents = false;
			});
		}
	}
	onSearch(value) {

		if (value) {
			this.fetchMoreEnabled = false;
			let agents = this.agentsList_original.filter(a => a.email.includes(value.toLowerCase() || a.first_name.toLowerCase().includes(value.toLowerCase())));
			this._utilityService.SearchAgent(value).subscribe((response) => {
				if (response && response.agentList.length) {
					response.agentList.forEach(element => {
						if (!agents.filter(a => a.email == element.email).length) {
							agents.push(element);
						}
					});
				}
				this.agentsList = agents;
			});
		} else {
			this.fetchMoreEnabled = true;
			this.agentsList = this.agentsList_original;
		}
	}
}


