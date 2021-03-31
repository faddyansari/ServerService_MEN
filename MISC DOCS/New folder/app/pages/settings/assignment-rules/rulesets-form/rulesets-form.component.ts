import { Component, OnInit, Input, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../../../services/AuthenticationService';
import { AssignmentAutomationSettingsService } from '../../../../../services/LocalServices/AssignmentRuleService';
import { MatAutocompleteSelectedEvent, MatSnackBar } from '@angular/material';
import { ConfirmationDialogComponent } from '../../../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { UtilityService } from '../../../../../services/UtilityServices/UtilityService';
import { Observable } from 'rxjs/Observable';
import { ToastNotifications } from '../../../../dialogs/SnackBar-Dialog/toast-notifications.component';

@Component({
  selector: 'app-rulesets-form',
  templateUrl: './rulesets-form.component.html',
  styleUrls: ['./rulesets-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RulesetsFormComponent implements OnInit {

  // @Input() RuleObject: any;

  subscriptions: Subscription[] = [];
  public addRuleSetForm: FormGroup


  emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


  public groupsList = [];
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
  Agent: any;
  selectedRule: any = undefined;
  actionsData: any = {};
  actionsDataKey: any = {};

  filterKeys: Array<any> = [];
  teamList: Array<any> = [];
  customFields: Array<any> = [];
  rulesList: any[];
  roles: any;
  constructor(private _ruleSetService: AssignmentAutomationSettingsService,
    private dialog: MatDialog,
    private _authService: AuthService,
    public formbuilder: FormBuilder, public _utilityService: UtilityService, public snackBar: MatSnackBar) {
    this.fileterCountryWithCodes = this.locations;

    this.subscriptions.push(this._authService.getAgent().subscribe(agent => {
      this.Agent = agent;
      this.actionsData['customFilter'] = Object.keys(agent)

    }));

    this.subscriptions.push(this._ruleSetService.groupsList.subscribe(groupsList => {
      this.groupsList = groupsList;
      this.actionsData['group'] = groupsList;
      this.actionsDataKey['group'] = 'group_name';


    }));


    this.subscriptions.push(this._ruleSetService.selectedRule.subscribe(selectedRule => {
      this.selectedRule = selectedRule;
    }));

    this.subscriptions.push(this._utilityService.getAllAgentsListObs().subscribe(agentList => {
      // console.log(agentList);

      // agentList = agentList.filter(data => {
      //   return (data.permissions.chats.canChat)
      // })

      // console.log(agentList);

      this.agentsList = agentList;
      this.agentsList_original = agentList;

      this.actionsData['email'] = this.agentsList_original
      this.actionsDataKey['email'] = 'email';


    }));

    // this.subscriptions.push(this._authService.getSettings().subscribe(data => {
    //   if (data && data.permissions) {
    //     console.log(data.permissions);

    //   }


    // }));

    this.subscriptions.push(this._utilityService.getTeams().subscribe(data => {
      // console.log(data);
      this.teamList = data.map(g => g.team_name);

      this.actionsData['teams'] = this.teamList
      this.actionsDataKey['teams'] = 'teams';
    }));

    this.subscriptions.push(_authService.permissions.subscribe(permissions => {
      if (permissions && Object.keys(permissions).length) {
        if (this.Agent) {
          this.roles = permissions[this.Agent.role].settings.rolesAndPermissions.canView;

          this.actionsData['role'] = this.roles
        }
      }

    }));


    this.subscriptions.push(_ruleSetService.filterKeys.subscribe(keys => {
      this.filterKeys = keys

      // console.log(keys);

    }));

    this.subscriptions.push(_ruleSetService.RuleSetList.subscribe(list => {
      if (list && list.length) {
        this.rulesList = list;
        this.UpdateRulesMap(list)
      }
    }));

    this.subscriptions.push(_ruleSetService.customFields.subscribe(list => {
      // console.log(list);

      this.customFields = list
    }));

  }

  //#region Conditions Curs
  AddCondition() {

    let fb: FormGroup = this.formbuilder.group({
      key: ['',
        [
          Validators.required
        ],
        this.FilterKeys.bind(this)
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

  FilterKeys(control: FormControl): Observable<any> {

    let keys = control.value;

    let pattern = new RegExp(keys, 'gi');
    if (this.filterKeys.indexOf(keys) !== -1) return Observable.of(null)
    let matched = false;
    this.filterKeys.map(key => {

      if ((key as string).match(pattern)) {
        matched = true
      }
      return key
    });
    if (matched) return Observable.of(null)

    else {

      this._ruleSetService.GetFilters(keys).subscribe(data => {

      },
        err => {
          // console.log("error in get filters");

        });
      return Observable.of(null)
    }


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

  ActionChanged(index, event) {
    let actionName = (this.addRuleSetForm.get('actions') as FormArray).controls[0].get('name').value
    this.actionsData[actionName]
    let actions = this.addRuleSetForm.get('actions') as FormArray;
    actions.controls[index].get('value').setValue('');
    actions.controls[index].get('keywords').setValue('');

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
      'email': 'Assign To Agent',
      // 'role': 'Assign To Agents By Role',
      // 'groups': 'Assign To Group',
      // 'teams': 'Assign To Team',
      // 'customFilter': 'Assign To Agent Having'
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
        keywords: [action.keywords],
        value: [action.value, Validators.required],
      }));

    });

    return fb;
  }

  SelectAction(event, action, index) {

    if (action != 'customFilter') {
      (this.addRuleSetForm.get('actions') as FormArray).controls[index].get('value').setValue(action);
      (this.addRuleSetForm.get('actions') as FormArray).controls[index].get('keywords').setValue([event]);
    }
    else {
      (this.addRuleSetForm.get('actions') as FormArray).controls[index].get('value').setValue(event);
    }

  }

  AddAction() {

    let fb: FormGroup = this.formbuilder.group({
      name: ['email', [Validators.required]],
      keywords: [''],
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
        (this.selectedRule && this.selectedRule.name) ? this.selectedRule.name : '',
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.minLength(2)
        ]
        //Async Validator
      ],
      'operator': [
        (this.selectedRule && this.selectedRule.operator) ? this.selectedRule.operator : 'or',
        [
          Validators.required
        ],
        //Async Validator
      ],
      'conditions': this.formbuilder.array((this.selectedRule && this.selectedRule.conditions) ? this.TransformConditions(this.selectedRule.conditions) : this.TransformConditions([{ key: '', matchingCriterea: '', regex: new RegExp(/\s/, 'gmi'), keywords: [] }]), Validators.required),
      'actions': this.formbuilder.array((this.selectedRule && this.selectedRule.actions) ? this.TransformActions(this.selectedRule.actions) : this.TransformActions([{ name: '', value: '' }]), Validators.required)
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
        keywords: control.get('keywords').value,
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
          this._ruleSetService.addingRule.next(false);
          this._ruleSetService.selectedRule.next(undefined);
        } else {
          return;
        }
      });
    }
    else {
      this._ruleSetService.addingRule.next(false);
      this._ruleSetService.selectedRule.next(undefined);
    }

  }

  AddRuleSet() {

    if (this.rulesList[this.addRuleSetForm.get('name').value]) {
      this.snackBar.openFromComponent(ToastNotifications, {
        data: { img: 'warning', msg: 'Rule Set name already present' },
        duration: 3000,
        panelClass: ['user-alert', 'error']
      });
    }
    else {
      let ruleset = {
        name: this.addRuleSetForm.get('name').value,
        nsp: this.Agent.nsp,
        isActive: false,
        operator: this.addRuleSetForm.get('operator').value,
        conditions: this.ParseConditions(this.addRuleSetForm.get('conditions') as FormArray),
        actions: this.ParseActions(this.addRuleSetForm.get('actions') as FormArray),
        lastmodified: { date: new Date().toISOString(), by: this.Agent.email },
      }

      this.subscriptions.push(this._ruleSetService.AddNewRuleSet(ruleset).subscribe(response => {
        if (response.status == 'ok') {
          this._ruleSetService.addingRule.next(false)
          //SHOW SNACKBAR

        } else {
          //SHOW ERROR
          this._ruleSetService.addingRule.next(false)
        }
      }));
    }
  }

  UpdateRulesMap(list: Array<any>) {
    list.map(rule => {
      if (this.rulesList[rule.name] == undefined) {
        this.rulesList[rule.name] = {};
      }
      if (!this.rulesList[rule.name].selected) {
        this.rulesList[rule.name].selected = false;
        this.rulesList[rule.name] = JSON.parse(JSON.stringify(rule));
      }
    })

  }

  public UpdateRuleSet(id: string) {
    let ruleset = {
      name: this.addRuleSetForm.get('name').value,
      nsp: this.selectedRule.nsp,
      isActive: (this.selectedRule && this.selectedRule.isActive) ? this.selectedRule.isActive : false,
      operator: this.addRuleSetForm.get('operator').value,
      conditions: this.ParseConditions(this.addRuleSetForm.get('conditions') as FormArray),
      actions: this.ParseActions(this.addRuleSetForm.get('actions') as FormArray),
      lastmodified: { date: new Date().toISOString(), by: this.Agent.email },
    }

    this.subscriptions.push(this._ruleSetService.UpdateRulesets(id, ruleset).subscribe(response => {
      if (response.status == 'ok') {
        //SHOW SNACKBAR
        this._ruleSetService.addingRule.next(false)
      } else {
        //SHOW ERROR
        this._ruleSetService.addingRule.next(false)
      }
    }));
  }
  loadMore(event) {

    if (!this.ended && !this.loadingMoreAgents) {

      this.loadingMoreAgents = true;
      this._utilityService.getMoreAgentsObs(this.agentsList[this.agentsList.length - 1].first_name).subscribe(response => {

        // response.agents = response.agents.filter(data => {
        //   return (data.permissions.chats.canChat)
        // })

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
