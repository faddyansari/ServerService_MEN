"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RulesetsFormComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var confirmation_dialog_component_1 = require("../../../../dialogs/confirmation-dialog/confirmation-dialog.component");
var Observable_1 = require("rxjs/Observable");
var toast_notifications_component_1 = require("../../../../dialogs/SnackBar-Dialog/toast-notifications.component");
var RulesetsFormComponent = /** @class */ (function () {
    function RulesetsFormComponent(_ruleSetService, dialog, _authService, formbuilder, _utilityService, snackBar) {
        var _this = this;
        this._ruleSetService = _ruleSetService;
        this.dialog = dialog;
        this._authService = _authService;
        this.formbuilder = formbuilder;
        this._utilityService = _utilityService;
        this.snackBar = snackBar;
        // @Input() RuleObject: any;
        this.subscriptions = [];
        this.emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        this.groupsList = [];
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
        this.selectedRule = undefined;
        this.actionsData = {};
        this.actionsDataKey = {};
        this.filterKeys = [];
        this.teamList = [];
        this.customFields = [];
        this.fileterCountryWithCodes = this.locations;
        this.subscriptions.push(this._authService.getAgent().subscribe(function (agent) {
            _this.Agent = agent;
            _this.actionsData['customFilter'] = Object.keys(agent);
        }));
        this.subscriptions.push(this._ruleSetService.groupsList.subscribe(function (groupsList) {
            _this.groupsList = groupsList;
            _this.actionsData['group'] = groupsList;
            _this.actionsDataKey['group'] = 'group_name';
        }));
        this.subscriptions.push(this._ruleSetService.selectedRule.subscribe(function (selectedRule) {
            _this.selectedRule = selectedRule;
        }));
        this.subscriptions.push(this._utilityService.getAllAgentsListObs().subscribe(function (agentList) {
            // console.log(agentList);
            // agentList = agentList.filter(data => {
            //   return (data.permissions.chats.canChat)
            // })
            // console.log(agentList);
            _this.agentsList = agentList;
            _this.agentsList_original = agentList;
            _this.actionsData['email'] = _this.agentsList_original;
            _this.actionsDataKey['email'] = 'email';
        }));
        // this.subscriptions.push(this._authService.getSettings().subscribe(data => {
        //   if (data && data.permissions) {
        //     console.log(data.permissions);
        //   }
        // }));
        this.subscriptions.push(this._utilityService.getTeams().subscribe(function (data) {
            // console.log(data);
            _this.teamList = data.map(function (g) { return g.team_name; });
            _this.actionsData['teams'] = _this.teamList;
            _this.actionsDataKey['teams'] = 'teams';
        }));
        this.subscriptions.push(_authService.permissions.subscribe(function (permissions) {
            if (permissions && Object.keys(permissions).length) {
                if (_this.Agent) {
                    _this.roles = permissions[_this.Agent.role].settings.rolesAndPermissions.canView;
                    _this.actionsData['role'] = _this.roles;
                }
            }
        }));
        this.subscriptions.push(_ruleSetService.filterKeys.subscribe(function (keys) {
            _this.filterKeys = keys;
            // console.log(keys);
        }));
        this.subscriptions.push(_ruleSetService.RuleSetList.subscribe(function (list) {
            if (list && list.length) {
                _this.rulesList = list;
                _this.UpdateRulesMap(list);
            }
        }));
        this.subscriptions.push(_ruleSetService.customFields.subscribe(function (list) {
            // console.log(list);
            _this.customFields = list;
        }));
    }
    //#region Conditions Curs
    RulesetsFormComponent.prototype.AddCondition = function () {
        var fb = this.formbuilder.group({
            key: ['',
                [
                    forms_1.Validators.required
                ],
                this.FilterKeys.bind(this)
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
    RulesetsFormComponent.prototype.FilterKeys = function (control) {
        var keys = control.value;
        var pattern = new RegExp(keys, 'gi');
        if (this.filterKeys.indexOf(keys) !== -1)
            return Observable_1.Observable.of(null);
        var matched = false;
        this.filterKeys.map(function (key) {
            if (key.match(pattern)) {
                matched = true;
            }
            return key;
        });
        if (matched)
            return Observable_1.Observable.of(null);
        else {
            this._ruleSetService.GetFilters(keys).subscribe(function (data) {
            }, function (err) {
                // console.log("error in get filters");
            });
            return Observable_1.Observable.of(null);
        }
    };
    RulesetsFormComponent.prototype.DeleteCondition = function (index) {
        var conditions = this.addRuleSetForm.get('conditions');
        conditions.removeAt(index);
    };
    RulesetsFormComponent.prototype.TransformConditions = function (conditions) {
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
    RulesetsFormComponent.prototype.KeyChanged = function (index) {
        var conditions = this.addRuleSetForm.get('conditions');
        conditions.controls[index].get('matchingCriterea').setValue('');
        conditions.controls[index].get('keywords').setValue([]);
    };
    RulesetsFormComponent.prototype.KeyPress = function () {
        this.SearchAutoComplete(this.searchItem);
    };
    RulesetsFormComponent.prototype.OnLocationSelected = function (index, event) {
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
    RulesetsFormComponent.prototype.ModelChange = function (event) {
        this.SearchAutoComplete(this.searchItem);
    };
    //#endregion
    RulesetsFormComponent.prototype.ActionChanged = function (index, event) {
        var actionName = this.addRuleSetForm.get('actions').controls[0].get('name').value;
        this.actionsData[actionName];
        var actions = this.addRuleSetForm.get('actions');
        actions.controls[index].get('value').setValue('');
        actions.controls[index].get('keywords').setValue('');
    };
    RulesetsFormComponent.prototype.SearchAutoComplete = function (input) {
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
    RulesetsFormComponent.prototype.GetAvailableActions = function (i) {
        var actionList = {
            'email': 'Assign To Agent',
        };
        var actions = this.addRuleSetForm.get('actions');
        actions.controls.map(function (control, index) {
            if (actionList[actions.controls[index].get('name').value] && index != i)
                delete actionList[actions.controls[index].get('name').value];
        });
        return actionList;
    };
    //#regions Actions
    RulesetsFormComponent.prototype.TransformActions = function (actions) {
        var _this = this;
        var fb = [];
        actions.map(function (action) {
            fb.push(_this.formbuilder.group({
                name: [action.name, forms_1.Validators.required],
                keywords: [action.keywords],
                value: [action.value, forms_1.Validators.required],
            }));
        });
        return fb;
    };
    RulesetsFormComponent.prototype.SelectAction = function (event, action, index) {
        if (action != 'customFilter') {
            this.addRuleSetForm.get('actions').controls[index].get('value').setValue(action);
            this.addRuleSetForm.get('actions').controls[index].get('keywords').setValue([event]);
        }
        else {
            this.addRuleSetForm.get('actions').controls[index].get('value').setValue(event);
        }
    };
    RulesetsFormComponent.prototype.AddAction = function () {
        var fb = this.formbuilder.group({
            name: ['email', [forms_1.Validators.required]],
            keywords: [''],
            value: ['', [forms_1.Validators.required]]
        });
        var actions = this.addRuleSetForm.get('actions');
        actions.push(fb);
    };
    RulesetsFormComponent.prototype.DeleteAction = function (index) {
        var actions = this.addRuleSetForm.get('actions');
        actions.removeAt(index);
    };
    //#endregion
    RulesetsFormComponent.prototype.ngOnInit = function () {
        this.addRuleSetForm = this.formbuilder.group({
            'name': [
                (this.selectedRule && this.selectedRule.name) ? this.selectedRule.name : '',
                [
                    forms_1.Validators.required,
                    forms_1.Validators.maxLength(50),
                    forms_1.Validators.minLength(2)
                ]
                //Async Validator
            ],
            'operator': [
                (this.selectedRule && this.selectedRule.operator) ? this.selectedRule.operator : 'or',
                [
                    forms_1.Validators.required
                ],
            ],
            'conditions': this.formbuilder.array((this.selectedRule && this.selectedRule.conditions) ? this.TransformConditions(this.selectedRule.conditions) : this.TransformConditions([{ key: '', matchingCriterea: '', regex: new RegExp(/\s/, 'gmi'), keywords: [] }]), forms_1.Validators.required),
            'actions': this.formbuilder.array((this.selectedRule && this.selectedRule.actions) ? this.TransformActions(this.selectedRule.actions) : this.TransformActions([{ name: '', value: '' }]), forms_1.Validators.required)
        });
        this.onValueChanges();
    };
    RulesetsFormComponent.prototype.ngOnDestroy = function () {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.subscriptions.map(function (subscription) {
            subscription.unsubscribe();
        });
    };
    RulesetsFormComponent.prototype.onValueChanges = function () {
        var _this = this;
        this.addRuleSetForm.valueChanges.subscribe(function (res) {
            _this.formChanges = res;
        });
    };
    RulesetsFormComponent.prototype.GetControls = function (name) {
        return this.addRuleSetForm.get(name).controls;
    };
    RulesetsFormComponent.prototype.ParseConditions = function (formArray) {
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
    RulesetsFormComponent.prototype.ParseActions = function (formArray) {
        var actions = [];
        formArray.controls.map(function (control) {
            var obj = {
                name: control.get('name').value,
                keywords: control.get('keywords').value,
                value: control.get('value').value
            };
            actions.push(obj);
        });
        return actions;
    };
    RulesetsFormComponent.prototype.onItemAdded = function (event) {
    };
    RulesetsFormComponent.prototype.CreateRegex = function (matchingCriterea, keywords) {
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
    RulesetsFormComponent.prototype.CancelAddRule = function () {
        var _this = this;
        if (this.formChanges) {
            this.dialog.open(confirmation_dialog_component_1.ConfirmationDialogComponent, {
                panelClass: ['confirmation-dialog'],
                data: { headermsg: 'Are you sure want to leave?' }
            }).afterClosed().subscribe(function (data) {
                if (data == 'ok') {
                    _this._ruleSetService.addingRule.next(false);
                    _this._ruleSetService.selectedRule.next(undefined);
                }
                else {
                    return;
                }
            });
        }
        else {
            this._ruleSetService.addingRule.next(false);
            this._ruleSetService.selectedRule.next(undefined);
        }
    };
    RulesetsFormComponent.prototype.AddRuleSet = function () {
        var _this = this;
        if (this.rulesList[this.addRuleSetForm.get('name').value]) {
            this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                data: { img: 'warning', msg: 'Rule Set name already present' },
                duration: 3000,
                panelClass: ['user-alert', 'error']
            });
        }
        else {
            var ruleset = {
                name: this.addRuleSetForm.get('name').value,
                nsp: this.Agent.nsp,
                isActive: false,
                operator: this.addRuleSetForm.get('operator').value,
                conditions: this.ParseConditions(this.addRuleSetForm.get('conditions')),
                actions: this.ParseActions(this.addRuleSetForm.get('actions')),
                lastmodified: { date: new Date().toISOString(), by: this.Agent.email },
            };
            this.subscriptions.push(this._ruleSetService.AddNewRuleSet(ruleset).subscribe(function (response) {
                if (response.status == 'ok') {
                    _this._ruleSetService.addingRule.next(false);
                    //SHOW SNACKBAR
                }
                else {
                    //SHOW ERROR
                    _this._ruleSetService.addingRule.next(false);
                }
            }));
        }
    };
    RulesetsFormComponent.prototype.UpdateRulesMap = function (list) {
        var _this = this;
        list.map(function (rule) {
            if (_this.rulesList[rule.name] == undefined) {
                _this.rulesList[rule.name] = {};
            }
            if (!_this.rulesList[rule.name].selected) {
                _this.rulesList[rule.name].selected = false;
                _this.rulesList[rule.name] = JSON.parse(JSON.stringify(rule));
            }
        });
    };
    RulesetsFormComponent.prototype.UpdateRuleSet = function (id) {
        var _this = this;
        var ruleset = {
            name: this.addRuleSetForm.get('name').value,
            nsp: this.selectedRule.nsp,
            isActive: (this.selectedRule && this.selectedRule.isActive) ? this.selectedRule.isActive : false,
            operator: this.addRuleSetForm.get('operator').value,
            conditions: this.ParseConditions(this.addRuleSetForm.get('conditions')),
            actions: this.ParseActions(this.addRuleSetForm.get('actions')),
            lastmodified: { date: new Date().toISOString(), by: this.Agent.email },
        };
        this.subscriptions.push(this._ruleSetService.UpdateRulesets(id, ruleset).subscribe(function (response) {
            if (response.status == 'ok') {
                //SHOW SNACKBAR
                _this._ruleSetService.addingRule.next(false);
            }
            else {
                //SHOW ERROR
                _this._ruleSetService.addingRule.next(false);
            }
        }));
    };
    RulesetsFormComponent.prototype.loadMore = function (event) {
        var _this = this;
        if (!this.ended && !this.loadingMoreAgents) {
            this.loadingMoreAgents = true;
            this._utilityService.getMoreAgentsObs(this.agentsList[this.agentsList.length - 1].first_name).subscribe(function (response) {
                // response.agents = response.agents.filter(data => {
                //   return (data.permissions.chats.canChat)
                // })
                _this.agentsList = _this.agentsList.concat(response.agents);
                _this.ended = response.ended;
                _this.loadingMoreAgents = false;
            });
        }
    };
    RulesetsFormComponent.prototype.onSearch = function (value) {
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
        core_1.ViewChild('autoLocation')
    ], RulesetsFormComponent.prototype, "autoLocation", void 0);
    RulesetsFormComponent = __decorate([
        core_1.Component({
            selector: 'app-rulesets-form',
            templateUrl: './rulesets-form.component.html',
            styleUrls: ['./rulesets-form.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None,
        })
    ], RulesetsFormComponent);
    return RulesetsFormComponent;
}());
exports.RulesetsFormComponent = RulesetsFormComponent;
//# sourceMappingURL=rulesets-form.component.js.map