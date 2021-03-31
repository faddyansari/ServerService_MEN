"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupManagementComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var GroupSettings_1 = require("../../../../services/LocalServices/GroupSettings");
var Observable_1 = require("rxjs/Observable");
var GroupManagementComponent = /** @class */ (function () {
    function GroupManagementComponent(_groupService, _utilityService, formbuilder) {
        var _this = this;
        this._groupService = _groupService;
        this._utilityService = _utilityService;
        this.formbuilder = formbuilder;
        this.subscriptions = [];
        this.groupList = undefined;
        this.agentList = undefined;
        this.selectedGroup = undefined;
        this.selectedGroupName = '';
        this.loading = false;
        this.fetching = false;
        this.showAddGroupForm = false;
        this.showAgentForm = false;
        this.fileterCountryWithCodes = {};
        this.filteredAgentList = [];
        this.countryWithCodes = {
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
        };
        Object.assign(this.fileterCountryWithCodes, this.countryWithCodes);
        //#region Form Initializations
        this.addGroupForm = this.formbuilder.group({
            'groupName': [
                null,
                [
                    forms_1.Validators.required,
                    forms_1.Validators.maxLength(2),
                    forms_1.Validators.minLength(2)
                ],
                this.CheckGroup.bind(this)
            ]
        });
        this.subscriptions.push(this.addGroupForm.get('groupName').valueChanges.subscribe(function (input) {
            _this.UpdateCountryCodes(input);
        }));
        this.addAgentForm = this.formbuilder.group({
            'agentEmail': [
                null,
                [
                    forms_1.Validators.required,
                ],
                this.CheckAgent.bind(this)
            ]
        });
        this.subscriptions.push(this.addAgentForm.get('agentEmail').valueChanges.subscribe(function (input) {
            _this.UpdateFilterAgentList(input);
        }));
        //#endregion
        //#region Initial Data Subscription
        this.subscriptions.push(this._groupService.GetGroupsList().subscribe(function (groupList) {
            if (groupList) {
                _this.groupList = Object.assign({}, groupList);
                _this.UpdateCountryCodes();
                if (_this.selectedGroupName) {
                    _this.SelectGroup(_this.selectedGroupName);
                }
            }
            //console.log(this.groupList);
        }));
        this.subscriptions.push(this._utilityService.getAllAgentsListObs().subscribe(function (agentList) {
            _this.agentList = agentList;
        }));
        //#endregion
    }
    //#region Async Validators
    GroupManagementComponent.prototype.CheckGroup = function () {
        var _this = this;
        if (Object.keys(this.groupList).some(function (name) { return (name == _this.addGroupForm.get('groupName').value.trim().toUpperCase()); })) {
            return Observable_1.Observable.of({ 'matched': true });
        }
        else {
            return Observable_1.Observable.of(null);
        }
    };
    GroupManagementComponent.prototype.CheckAgent = function () {
        var _this = this;
        if (this.agentList.some(function (agent) {
            return (agent.email == _this.addAgentForm.get('agentEmail').value.trim().toUpperCase()
                || agent.name == _this.addAgentForm.get('agentEmail').value.trim().toUpperCase());
        })) {
            return Observable_1.Observable.of({ 'matched': true });
        }
        else {
            return Observable_1.Observable.of(null);
        }
    };
    //#endregion
    GroupManagementComponent.prototype.SelectGroup = function (groupName) {
        this.selectedGroup = this.groupList[groupName];
        this.selectedGroupName = groupName;
        this.addAgentForm.reset();
        //console.log(this.selectedGroup);
    };
    //#region Add Functions
    GroupManagementComponent.prototype.AddGroup = function () {
        var _this = this;
        this.loading = true;
        var groupName = this.addGroupForm.get('groupName').value;
        this._groupService.AddGroup(groupName).subscribe(function (response) {
            _this.loading = false;
            if (response.status == 'ok') {
                //TODO Group Added Logic here
                _this.addGroupForm.reset();
            }
        }, function (err) {
            _this.loading = false;
            //Todo Group Error Logic Here
            //console.log('Error');
            //console.log(err);
            switch (err.code) {
                case 501:
                    _this.addGroupForm.get('groupName').setErrors({ dfGroupError: true });
                    break;
                case 502:
                    _this.addGroupForm.get('groupName').setErrors({ alreadyExists: true });
                    break;
            }
        });
    };
    GroupManagementComponent.prototype.AddAgent = function () {
        var _this = this;
        this._groupService.AddAgent({
            groupName: this.selectedGroupName,
            agentEmail: this.addAgentForm.get('agentEmail').value
        }).subscribe(function (response) {
            _this.addAgentForm.reset();
            _this.agentEmailControl.nativeElement.focus();
        }, function (err) {
            //Todo Error Logic Here
            _this.addAgentForm.get('agentEmail').setErrors({ exists: true });
        });
    };
    GroupManagementComponent.prototype.RemoveAgent = function (agentEmail) {
        var _this = this;
        this._groupService.RemoveAgent({
            groupName: this.selectedGroupName,
            agentEmail: agentEmail
        }).subscribe(function (response) {
            _this.UpdateFilterAgentList();
            //console.log(response);
            //Todo : Show Deletion Status/Notification
        }, function (err) {
            // console.log(err);
            //Todo : Show Error Notification 
        });
    };
    GroupManagementComponent.prototype.ToggleGroup = function () {
        this._groupService.ToggleGroup({
            groupName: this.selectedGroupName
        }, this.selectedGroup.isActive).subscribe(function (response) {
            //console.log(response);
        }, function (err) {
            // console.log(err);
        });
        console.log(this.selectedGroup);
    };
    //#endregion
    //#region Getters Filtered lists
    GroupManagementComponent.prototype.GetCountryCodes = function () {
        return this.fileterCountryWithCodes;
    };
    GroupManagementComponent.prototype.GetAgentList = function () {
        return this.filteredAgentList;
    };
    GroupManagementComponent.prototype.GetAgentsFromGroup = function () {
        var _this = this;
        var agentList = [];
        this.agentList.map(function (agent) {
            _this.selectedGroup.Agents.map(function (agentEmail) {
                if (agentEmail == agent.email) {
                    agentList.push(agent);
                }
            });
        });
        return agentList;
    };
    GroupManagementComponent.prototype.GetAgentsFromGroupObject = function () {
        var _this = this;
        var agentList = {};
        this.agentList.map(function (agent) {
            _this.selectedGroup.Agents.map(function (agentEmail) {
                if (agentEmail == agent.email) {
                    agentList[agentEmail] = agent;
                }
            });
        });
        return agentList;
    };
    //#endregion
    //#region Filtering AutoComplete
    GroupManagementComponent.prototype.UpdateFilterAgentList = function (value) {
        var groupAgents = this.GetAgentsFromGroupObject();
        if (!value) {
            this.filteredAgentList = this.agentList.filter(function (agent) {
                return !groupAgents[agent.email];
            });
        }
        else {
            this.filteredAgentList = this.agentList.filter(function (agent) {
                return ((agent.email.toLowerCase().indexOf(value.toLowerCase().trim()) != -1
                    || agent.nickname.toLowerCase().indexOf(value.toLowerCase().trim()) != -1) && !groupAgents[agent.email]);
            });
        }
    };
    GroupManagementComponent.prototype.UpdateCountryCodes = function (input) {
        var _this = this;
        var fileterCountryWithCodes = {};
        if (!input) {
            Object.keys(this.countryWithCodes).map(function (key) {
                if (!_this.groupList[key]) {
                    fileterCountryWithCodes[key] = _this.countryWithCodes[key];
                }
            });
        }
        else {
            Object.keys(this.countryWithCodes).map(function (key) {
                if ((key.toLowerCase().indexOf(input.toLowerCase().trim()) != -1
                    || _this.countryWithCodes[key].toLowerCase().indexOf(input.toLowerCase().trim()) != -1) && !_this.groupList[key]) {
                    fileterCountryWithCodes[key] = _this.countryWithCodes[key];
                }
            });
        }
        this.fileterCountryWithCodes = fileterCountryWithCodes;
    };
    //#endregion
    //#region PageLifeCycle Events
    GroupManagementComponent.prototype.ngOnInit = function () {
    };
    GroupManagementComponent.prototype.ngOnDestroy = function () {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.subscriptions.map(function (subscription) {
            subscription.unsubscribe();
        });
        this._groupService.Destroy();
    };
    __decorate([
        core_1.ViewChild('agentEmail')
    ], GroupManagementComponent.prototype, "agentEmailControl", void 0);
    GroupManagementComponent = __decorate([
        core_1.Component({
            selector: 'app-group-management',
            templateUrl: './group-management.component.html',
            styleUrls: ['./group-management.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None,
            providers: [
                GroupSettings_1.GroupSettingsService
            ]
        })
    ], GroupManagementComponent);
    return GroupManagementComponent;
}());
exports.GroupManagementComponent = GroupManagementComponent;
//# sourceMappingURL=group-management.component.js.map