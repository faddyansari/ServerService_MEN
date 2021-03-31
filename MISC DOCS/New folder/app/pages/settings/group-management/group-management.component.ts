import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription } from 'rxjs/Subscription';
import { GroupSettingsService } from '../../../../services/LocalServices/GroupSettings';
import { Observable } from 'rxjs/Observable';
import { UtilityService } from '../../../../services/UtilityServices/UtilityService';

@Component({
  selector: 'app-group-management',
  templateUrl: './group-management.component.html',
  styleUrls: ['./group-management.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    GroupSettingsService
  ]
})
export class GroupManagementComponent implements OnInit {

  @ViewChild('agentEmail') agentEmailControl: ElementRef;

  subscriptions: Subscription[] = [];
  public groupList: any = undefined;
  public agentList: any = undefined;
  public selectedGroup: any = undefined;
  public selectedGroupName: string = '';

  public addGroupForm: FormGroup;
  public addAgentForm: FormGroup;
  public loading = false;
  public fetching = false;
  public showAddGroupForm = false;
  public showAgentForm = false;

  public fileterCountryWithCodes = {

  }

  public filteredAgentList = [];

  public countryWithCodes = {
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







  constructor(private _groupService: GroupSettingsService,
    public _utilityService: UtilityService,
    public formbuilder: FormBuilder) {

    Object.assign(this.fileterCountryWithCodes, this.countryWithCodes);

    //#region Form Initializations
    this.addGroupForm = this.formbuilder.group({
      'groupName': [
        null,
        [
          Validators.required,
          Validators.maxLength(2),
          Validators.minLength(2)
        ],
        this.CheckGroup.bind(this)
      ]
    });
    this.subscriptions.push(this.addGroupForm.get('groupName').valueChanges.subscribe(input => {
      this.UpdateCountryCodes(input);
    }));

    this.addAgentForm = this.formbuilder.group({
      'agentEmail': [
        null,
        [
          Validators.required,
        ],
        this.CheckAgent.bind(this)
      ]
    });
    this.subscriptions.push(this.addAgentForm.get('agentEmail').valueChanges.subscribe(input => {
      this.UpdateFilterAgentList(input);
    }));

    //#endregion



    //#region Initial Data Subscription
    this.subscriptions.push(this._groupService.GetGroupsList().subscribe(groupList => {
      if (groupList) {
        this.groupList = Object.assign({}, groupList);
        this.UpdateCountryCodes();

        if(this.selectedGroupName){
          this.SelectGroup(this.selectedGroupName);
        }
      }
      //console.log(this.groupList);
    }));

    this.subscriptions.push(this._utilityService.getAllAgentsListObs().subscribe(agentList => {
      this.agentList = agentList;
    }));

    //#endregion

  }




  //#region Async Validators
  private CheckGroup() {
    if (Object.keys(this.groupList).some(name => { return (name == this.addGroupForm.get('groupName').value.trim().toUpperCase()); })) {
      return Observable.of({ 'matched': true });
    } else {
      return Observable.of(null);
    }
  }

  private CheckAgent() {
    if (this.agentList.some(agent => {
      return (agent.email == this.addAgentForm.get('agentEmail').value.trim().toUpperCase()
        || agent.name == this.addAgentForm.get('agentEmail').value.trim().toUpperCase());
    })) {
      return Observable.of({ 'matched': true });
    } else {
      return Observable.of(null);
    }
  }

  //#endregion



  public SelectGroup(groupName: string) {
    this.selectedGroup = this.groupList[groupName];
    this.selectedGroupName = groupName;


    this.addAgentForm.reset();
    //console.log(this.selectedGroup);
  }

  //#region Add Functions
  public AddGroup() {
    this.loading = true;
    let groupName = this.addGroupForm.get('groupName').value;
    this._groupService.AddGroup(groupName).subscribe(response => {
      this.loading = false;
      if (response.status == 'ok') {
        //TODO Group Added Logic here
        this.addGroupForm.reset();
      }
    }, err => {
      this.loading = false;
      //Todo Group Error Logic Here
      //console.log('Error');
      //console.log(err);
      switch (err.code) {
        case 501:
          this.addGroupForm.get('groupName').setErrors({ dfGroupError: true });
          break;
        case 502:
          this.addGroupForm.get('groupName').setErrors({ alreadyExists: true });
          break;
      }

    });
  }


  public AddAgent() {

    this._groupService.AddAgent({
      groupName: this.selectedGroupName,
      agentEmail: this.addAgentForm.get('agentEmail').value
    }).subscribe(response => {
      this.addAgentForm.reset();
      this.agentEmailControl.nativeElement.focus();
    }, err => {
      //Todo Error Logic Here
      this.addAgentForm.get('agentEmail').setErrors({ exists: true });
    });
  }

  public RemoveAgent(agentEmail: string) {
    this._groupService.RemoveAgent({
      groupName: this.selectedGroupName,
      agentEmail: agentEmail
    }).subscribe(response => {
      this.UpdateFilterAgentList();
      //console.log(response);
      //Todo : Show Deletion Status/Notification
    }, err => {
      // console.log(err);
      //Todo : Show Error Notification 
    })
  }

  public ToggleGroup() {
    this._groupService.ToggleGroup(
      {
        groupName: this.selectedGroupName
      }, this.selectedGroup.isActive).subscribe(response => {
        //console.log(response);
      }, err => {
        // console.log(err);
      })
    console.log(this.selectedGroup);
  }

  //#endregion

  //#region Getters Filtered lists

  public GetCountryCodes() {
    return this.fileterCountryWithCodes;
  }


  public GetAgentList() {
    return this.filteredAgentList;
  }

  public GetAgentsFromGroup(): Array<any> {
    let agentList = [];
    this.agentList.map(agent => {
      this.selectedGroup.Agents.map(agentEmail => {
        if (agentEmail == agent.email) {
          agentList.push(agent);
        }
      });
    });
    return agentList;
  }

  public GetAgentsFromGroupObject(): any {
    let agentList = {};
    this.agentList.map(agent => {
      this.selectedGroup.Agents.map(agentEmail => {
        if (agentEmail == agent.email) {
          agentList[agentEmail] = agent;
        }
      });
    });
    return agentList;
  }

  //#endregion


  //#region Filtering AutoComplete

  private UpdateFilterAgentList(value?: string) {
    let groupAgents = this.GetAgentsFromGroupObject();
    if (!value) {
      this.filteredAgentList = this.agentList.filter(agent => {
        return !groupAgents[agent.email]
      });
    } else {
      this.filteredAgentList = this.agentList.filter(agent => {
        return ((agent.email.toLowerCase().indexOf(value.toLowerCase().trim()) != -1
          || agent.nickname.toLowerCase().indexOf(value.toLowerCase().trim()) != -1) && !groupAgents[agent.email])
      });
    }
  }

  public UpdateCountryCodes(input?: string) {
    let fileterCountryWithCodes = {};
    if (!input) {
      Object.keys(this.countryWithCodes).map(key => {
        if (!this.groupList[key]) {
          fileterCountryWithCodes[key] = this.countryWithCodes[key]
        }
      });
    } else {
      Object.keys(this.countryWithCodes).map(key => {
        if ((key.toLowerCase().indexOf(input.toLowerCase().trim()) != -1
          || this.countryWithCodes[key].toLowerCase().indexOf(input.toLowerCase().trim()) != -1) && !this.groupList[key]) {
          fileterCountryWithCodes[key] = this.countryWithCodes[key]
        }
      });
    }
    this.fileterCountryWithCodes = fileterCountryWithCodes;

  }

  //#endregion



  //#region PageLifeCycle Events


  ngOnInit() {

  }


  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.subscriptions.map(subscription => {
      subscription.unsubscribe();
    });
    this._groupService.Destroy();
  }
  //#endregion

}
