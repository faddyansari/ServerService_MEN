"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RulesetAddNewComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var confirmation_dialog_component_1 = require("../../../../../dialogs/confirmation-dialog/confirmation-dialog.component");
var toast_notifications_component_1 = require("../../../../../dialogs/SnackBar-Dialog/toast-notifications.component");
var RulesetAddNewComponent = /** @class */ (function () {
    function RulesetAddNewComponent(_ruleSetService, _utilityService, dialog, _appStateService, _authService, snackbar, formbuilder) {
        var _this = this;
        this._ruleSetService = _ruleSetService;
        this._utilityService = _utilityService;
        this.dialog = dialog;
        this._appStateService = _appStateService;
        this._authService = _authService;
        this.snackbar = snackbar;
        this.formbuilder = formbuilder;
        this.nsp = '';
        this.email = '';
        this.subscriptions = [];
        this.emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        this.groupsList = [];
        this.priorityList = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
        this.srcList = [{ display: 'Live Chat', value: 'livechat' }, { display: 'Email', value: 'email' }, { display: 'Agent Panel', value: 'panel' }];
        this.agentsList = [];
        this.agentsList_original = [];
        this.config = {
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
        };
        this.locations = {
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
        this.fileterCountryWithCodes = {};
        this.searchItem = '';
        this.ended = false;
        this.loadingMoreAgents = false;
        this.fetchMoreEnabled = false;
        this.subscriptions.push(_authService.getPackageInfo().subscribe(function (pkg) {
            if (pkg) {
                _this.package = pkg.tickets.rulesets;
                if (!_this.package.allowed) {
                    _this._appStateService.NavigateTo('/noaccess');
                }
            }
            // console.log(agent);
        }));
        this.nsp = this._ruleSetService.Agent.nsp;
        this.email = this._ruleSetService.Agent.email;
        this.fileterCountryWithCodes = this.locations;
        this.subscriptions.push(this._ruleSetService.groupsList.subscribe(function (groupsList) {
            _this.groupsList = groupsList;
        }));
        this.subscriptions.push(this._ruleSetService.agentsList.subscribe(function (agentsList) {
            _this.agentsList = agentsList;
            _this.agentsList_original = agentsList;
        }));
        this.subscriptions.push(this._authService.getSettings().subscribe(function (data) {
            if (data && data.permissions) {
                _this.rulesetPermissions = data.permissions.settings.ticketManagement.rulesetSettings;
            }
        }));
        // (this.addRuleSetForm.get('actions') as FormArray).valueChanges.subscribe(values => {
        // });
    }
    //#region Conditions Curs
    RulesetAddNewComponent.prototype.AddCondition = function () {
        var fb = this.formbuilder.group({
            key: ['',
                [
                    forms_1.Validators.required
                ]
            ],
            matchingCriterea: ['',
                [forms_1.Validators.required]
            ],
            regex: [new RegExp(/\s/, 'gmi')],
            keywords: [[],
                [
                    forms_1.Validators.required
                ],
            ]
        });
        var conditions = this.addRuleSetForm.get('conditions');
        conditions.push(fb);
    };
    RulesetAddNewComponent.prototype.DeleteCondition = function (index) {
        var conditions = this.addRuleSetForm.get('conditions');
        conditions.removeAt(index);
    };
    RulesetAddNewComponent.prototype.TransformConditions = function (conditions) {
        var _this = this;
        var fb = [];
        conditions.map(function (condition) {
            fb.push(_this.formbuilder.group({
                key: [condition.key,
                    [
                        forms_1.Validators.required
                    ]
                ],
                matchingCriterea: [condition.matchingCriterea,
                    [forms_1.Validators.required]
                ],
                regex: [condition.regex],
                keywords: [condition.keywords,
                    [
                        forms_1.Validators.required
                    ],
                ]
            }));
        });
        return fb;
    };
    RulesetAddNewComponent.prototype.KeyChanged = function (index) {
        var conditions = this.addRuleSetForm.get('conditions');
        conditions.controls[index].get('matchingCriterea').setValue('');
        conditions.controls[index].get('keywords').setValue([]);
    };
    RulesetAddNewComponent.prototype.KeyPress = function () {
        this.SearchAutoComplete(this.searchItem);
    };
    RulesetAddNewComponent.prototype.OnLocationSelected = function (index, event) {
        var conditions = this.addRuleSetForm.get('conditions');
        var found = false;
        conditions.controls.map(function (control, index) {
            control.get('keywords').value.map(function (keyword) {
                if (keyword == event.option.value) {
                    found = true;
                }
            });
        });
        if (!found) {
            var locations = conditions.controls[index].get('keywords').value;
            locations.push(event.option.value);
            conditions.controls[index].get('keywords').setValue(locations);
        }
        this.searchItem = '';
        this.autoLocation.nativeElement.value = '';
        return false;
    };
    RulesetAddNewComponent.prototype.ModelChange = function (event) {
        this.SearchAutoComplete(this.searchItem);
    };
    //#endregion
    RulesetAddNewComponent.prototype.ActionChanged = function (index) {
        var actions = this.addRuleSetForm.get('actions');
        actions.controls[index].get('value').setValue('');
    };
    RulesetAddNewComponent.prototype.SearchAutoComplete = function (input) {
        var _this = this;
        var fileterCountryWithCodes = {};
        if (!input) {
            Object.keys(this.locations).map(function (key) {
                fileterCountryWithCodes[key] = _this.locations[key];
            });
        }
        else {
            Object.keys(this.locations).map(function (key) {
                if ((key.toLowerCase().indexOf(input.toLowerCase().trim()) != -1
                    || _this.locations[key].toLowerCase().indexOf(input.toLowerCase().trim()) != -1)) {
                    fileterCountryWithCodes[key] = _this.locations[key];
                }
            });
        }
        this.fileterCountryWithCodes = fileterCountryWithCodes;
    };
    RulesetAddNewComponent.prototype.GetAvailableActions = function (i) {
        var actionList = {
            'agent': 'Assign To Agent',
            'group': 'Assign To Group',
            'priority': 'Set Priority',
            'note': 'Add Note'
        };
        var actions = this.addRuleSetForm.get('actions');
        actions.controls.map(function (control, index) {
            if (actionList[actions.controls[index].get('name').value] && index != i)
                delete actionList[actions.controls[index].get('name').value];
        });
        return actionList;
    };
    //#regions Actions
    RulesetAddNewComponent.prototype.TransformActions = function (actions) {
        var _this = this;
        var fb = [];
        actions.map(function (action) {
            fb.push(_this.formbuilder.group({
                name: [action.name, forms_1.Validators.required],
                value: [action.value, forms_1.Validators.required]
            }));
        });
        return fb;
    };
    RulesetAddNewComponent.prototype.AddAction = function () {
        var fb = this.formbuilder.group({
            name: ['', [forms_1.Validators.required]],
            value: ['', [forms_1.Validators.required]]
        });
        var actions = this.addRuleSetForm.get('actions');
        actions.push(fb);
    };
    RulesetAddNewComponent.prototype.DeleteAction = function (index) {
        var actions = this.addRuleSetForm.get('actions');
        actions.removeAt(index);
    };
    //#endregion
    RulesetAddNewComponent.prototype.ngOnInit = function () {
        this.addRuleSetForm = this.formbuilder.group({
            'name': [
                this.RuleObject.name,
                [
                    forms_1.Validators.required,
                    forms_1.Validators.maxLength(50),
                    forms_1.Validators.minLength(2)
                ]
                //Async Validator
            ],
            'operator': [
                this.RuleObject.operator,
                [
                    forms_1.Validators.required
                ],
            ],
            'conditions': this.formbuilder.array(this.TransformConditions(this.RuleObject.conditions), forms_1.Validators.required),
            'actions': this.formbuilder.array(this.TransformActions(this.RuleObject.actions), forms_1.Validators.required)
        });
        this.onValueChanges();
    };
    RulesetAddNewComponent.prototype.ngOnDestroy = function () {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.subscriptions.map(function (subscription) {
            subscription.unsubscribe();
        });
    };
    RulesetAddNewComponent.prototype.onValueChanges = function () {
        var _this = this;
        this.addRuleSetForm.valueChanges.subscribe(function (res) {
            _this.formChanges = res;
        });
    };
    RulesetAddNewComponent.prototype.GetControls = function (name) {
        return this.addRuleSetForm.get(name).controls;
    };
    RulesetAddNewComponent.prototype.ParseConditions = function (formArray) {
        var _this = this;
        var conditions = [];
        formArray.controls.map(function (control) {
            var obj = {
                key: control.get('key').value,
                matchingCriterea: control.get('matchingCriterea').value,
                regex: _this.CreateRegex(control.get('matchingCriterea').value, control.get('keywords').value),
                keywords: control.get('keywords').value
            };
            conditions.push(obj);
        });
        return conditions;
    };
    RulesetAddNewComponent.prototype.ParseActions = function (formArray) {
        var actions = [];
        formArray.controls.map(function (control) {
            var obj = {
                name: control.get('name').value,
                value: control.get('value').value
            };
            actions.push(obj);
        });
        return actions;
    };
    RulesetAddNewComponent.prototype.onItemAdded = function (event) {
    };
    RulesetAddNewComponent.prototype.CreateRegex = function (matchingCriterea, keywords) {
        var keywordString = '';
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
    };
    RulesetAddNewComponent.prototype.CancelAddRule = function () {
        var _this = this;
        if (this.formChanges) {
            this.dialog.open(confirmation_dialog_component_1.ConfirmationDialogComponent, {
                panelClass: ['confirmation-dialog'],
                data: { headermsg: 'Are you sure want to leave?' }
            }).afterClosed().subscribe(function (data) {
                if (data == 'ok') {
                    _this._ruleSetService.Addrule.next(false);
                    _this._ruleSetService.SelectedRule.next(undefined);
                }
                else {
                    return;
                }
            });
        }
        else {
            this._ruleSetService.Addrule.next(false);
            this._ruleSetService.SelectedRule.next(undefined);
        }
    };
    RulesetAddNewComponent.prototype.AddRuleSet = function () {
        var _this = this;
        var ruleset = {
            name: this.addRuleSetForm.get('name').value,
            nsp: this.nsp,
            isActive: false,
            operator: this.addRuleSetForm.get('operator').value,
            conditions: this.ParseConditions(this.addRuleSetForm.get('conditions')),
            actions: this.ParseActions(this.addRuleSetForm.get('actions')),
            lastmodified: { date: new Date().toISOString(), by: this.email },
        };
        // console.log(ruleset);
        this.subscriptions.push(this._ruleSetService.AddRuleSet(ruleset).subscribe(function (response) {
            if (response.status == 'ok') {
                //SHOW SNACKBAR
                _this.snackbar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: 'Ruleset added Successfully!'
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'success']
                });
            }
            else {
                //SHOW ERROR 
                _this.snackbar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'warning',
                        msg: response.msg
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'error']
                });
            }
        }));
    };
    RulesetAddNewComponent.prototype.UpdateRuleSet = function (id) {
        var ruleset = {
            name: this.addRuleSetForm.get('name').value,
            nsp: this.nsp,
            isActive: this.RuleObject.isActive,
            operator: this.addRuleSetForm.get('operator').value,
            conditions: this.ParseConditions(this.addRuleSetForm.get('conditions')),
            actions: this.ParseActions(this.addRuleSetForm.get('actions')),
            lastmodified: { date: new Date().toISOString(), by: this.email },
        };
        this.subscriptions.push(this._ruleSetService.UpdateRulesets(id, ruleset).subscribe(function (response) {
            if (response.status == 'ok') {
                //SHOW SNACKBAR
            }
            else {
                //SHOW ERROR 
            }
        }));
    };
    RulesetAddNewComponent.prototype.loadMore = function (event) {
        var _this = this;
        if (!this.ended && !this.loadingMoreAgents) {
            this.loadingMoreAgents = true;
            this._utilityService.getMoreAgentsObs(this.agentsList[this.agentsList.length - 1].first_name).subscribe(function (response) {
                _this.agentsList = _this.agentsList.concat(response.agents);
                _this.ended = response.ended;
                _this.loadingMoreAgents = false;
            });
        }
    };
    RulesetAddNewComponent.prototype.onSearch = function (value) {
        var _this = this;
        if (value) {
            this.fetchMoreEnabled = false;
            var agents_1 = this.agentsList_original.filter(function (a) { return a.email.includes(value.toLowerCase() || a.first_name.toLowerCase().includes(value.toLowerCase())); });
            this._utilityService.SearchAgent(value).subscribe(function (response) {
                if (response && response.agentList.length) {
                    response.agentList.forEach(function (element) {
                        if (!agents_1.filter(function (a) { return a.email == element.email; }).length) {
                            agents_1.push(element);
                        }
                    });
                }
                _this.agentsList = agents_1;
            });
        }
        else {
            this.fetchMoreEnabled = true;
            this.agentsList = this.agentsList_original;
        }
    };
    __decorate([
        core_1.Input()
    ], RulesetAddNewComponent.prototype, "RuleObject", void 0);
    __decorate([
        core_1.ViewChild('autoLocation')
    ], RulesetAddNewComponent.prototype, "autoLocation", void 0);
    RulesetAddNewComponent = __decorate([
        core_1.Component({
            selector: 'app-ruleset-add-new',
            templateUrl: './ruleset-add-new.component.html',
            styleUrls: ['./ruleset-add-new.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], RulesetAddNewComponent);
    return RulesetAddNewComponent;
}());
exports.RulesetAddNewComponent = RulesetAddNewComponent;
//# sourceMappingURL=ruleset-add-new.component.js.map