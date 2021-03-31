"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsDateboxComponent = void 0;
var core_1 = require("@angular/core");
var Subject_1 = require("rxjs/Subject");
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/operator/distinctUntilChanged");
require("rxjs/add/operator/switchMap");
var AnalyticsDateboxComponent = /** @class */ (function () {
    function AnalyticsDateboxComponent(_authService, _analyticsService, _utilityService, _ticketGroupService) {
        var _this = this;
        this._analyticsService = _analyticsService;
        this._utilityService = _utilityService;
        this.allEnabled = false;
        this.agentEnabled = true;
        this.countryEnabled = false;
        this.groupEnabled = false;
        this.compareEnabled = true;
        this.customFieldsEnabled = false;
        this.dayFiltersEnabled = true;
        this.multipleAgentSelection = true;
        this.multipleGroupSelection = true;
        this.multipleCountrySelection = true;
        this.customFieldsType = '';
        this.onResult = new core_1.EventEmitter();
        this.subscriptions = [];
        this.today = this.dateFormatter(new Date());
        this.selectedDateType = 'today';
        this.selectedDate = {
            to: this.customFormatter(new Date()),
            from: this.customFormatter(new Date())
        };
        this.selectedComparison = '';
        this.customDate = false;
        this.comparison = false;
        this.date_from = this.dateFormatter(new Date());
        this.date_to = this.dateFormatter(new Date());
        this.agentSelection = false;
        this.countrySelection = false;
        this.groupSelection = false;
        this.year_from = new Date().getFullYear() - 1;
        this.year_to = new Date().getFullYear();
        this.max_year = new Date().getFullYear();
        this.dateError = false;
        this.yearError = false;
        this.loading = false;
        this.ended = false;
        this.fetchAllData = false;
        //Month Names Array
        this.monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
        this.dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"
        ];
        //country Names Array
        this.countryNames = [
            "Andorra",
            "United Arab Emirates",
            "Afghanistan",
            "Antigua and Barbuda",
            "Anguilla",
            "Albania",
            "Armenia",
            "Angola",
            "Antarctica",
            "Argentina",
            "American Samoa",
            "Austria",
            "Australia",
            "Aruba",
            "Aland Islands",
            "Azerbaijan",
            "Bosnia and Herzegovina",
            "Barbados",
            "Bangladesh",
            "Belgium",
            "Burkina Faso",
            "Bulgaria",
            "Bahrain",
            "Burundi",
            "Benin",
            "Saint Barthelemy",
            "Bermuda",
            "Brunei",
            "Bolivia",
            "Bonaire, Saint Eustatius and Saba ",
            "Brazil",
            "Bahamas",
            "Bhutan",
            "Bouvet Island",
            "Botswana",
            "Belarus",
            "Belize",
            "Canada",
            "Cocos Islands",
            "Democratic Republic of the Congo",
            "Central African Republic",
            "Republic of the Congo",
            "Switzerland",
            "Ivory Coast",
            "Cook Islands",
            "Chile",
            "Cameroon",
            "China",
            "Colombia",
            "Costa Rica",
            "Cuba",
            "Cape Verde",
            "Curacao",
            "Christmas Island",
            "Cyprus",
            "Czech Republic",
            "Germany",
            "Default",
            "Djibouti",
            "Denmark",
            "Dominica",
            "Dominican Republic",
            "Algeria",
            "Ecuador",
            "Estonia",
            "Egypt",
            "Western Sahara",
            "Eritrea",
            "Spain",
            "Ethiopia",
            "Finland",
            "Fiji",
            "Falkland Islands",
            "Micronesia",
            "Faroe Islands",
            "France",
            "Gabon",
            "United Kingdom",
            "Grenada",
            "Georgia",
            "French Guiana",
            "Guernsey",
            "Ghana",
            "Gibraltar",
            "Greenland",
            "Gambia",
            "Guinea",
            "Guadeloupe",
            "Equatorial Guinea",
            "Greece",
            "South Georgia and the South Sandwich Islands",
            "Guatemala",
            "Guam",
            "Guinea-Bissau",
            "Guyana",
            "Hong Kong",
            "Heard Island and McDonald Islands",
            "Honduras",
            "Croatia",
            "Haiti",
            "Hungary",
            "Indonesia",
            "Ireland",
            "Israel",
            "Isle of Man",
            "India",
            "British Indian Ocean Territory",
            "Iraq",
            "Iran",
            "Iceland",
            "Italy",
            "Jersey",
            "Jamaica",
            "Jordan",
            "Japan",
            "Kenya",
            "Kyrgyzstan",
            "Cambodia",
            "Kiribati",
            "Comoros",
            "Saint Kitts and Nevis",
            "North Korea",
            "South Korea",
            "Kuwait",
            "Cayman Islands",
            "Kazakhstan",
            "Laos",
            "Lebanon",
            "Saint Lucia",
            "Liechtenstein",
            "Sri Lanka",
            "Liberia",
            "Lesotho",
            "Lithuania",
            "Luxembourg",
            "Latvia",
            "Libya",
            "Morocco",
            "Monaco",
            "Moldova",
            "Montenegro",
            "Saint Martin",
            "Madagascar",
            "Marshall Islands",
            "Macedonia",
            "Mali",
            "Myanmar",
            "Mongolia",
            "Macao",
            "Northern Mariana Islands",
            "Martinique",
            "Mauritania",
            "Montserrat",
            "Malta",
            "Mauritius",
            "Maldives",
            "Malawi",
            "Mexico",
            "Malaysia",
            "Mozambique",
            "Namibia",
            "New Caledonia",
            "Niger",
            "Norfolk Island",
            "Nigeria",
            "Nicaragua",
            "Netherlands",
            "Norway",
            "Nepal",
            "Nauru",
            "Niue",
            "New Zealand",
            "Oman",
            "Panama",
            "Peru",
            "French Polynesia",
            "Papua New Guinea",
            "Philippines",
            "Pakistan",
            "Poland",
            "Saint Pierre and Miquelon",
            "Pitcairn",
            "Puerto Rico",
            "Palestinian Territory",
            "Portugal",
            "Palau",
            "Paraguay",
            "Qatar",
            "Reunion",
            "Serbia",
            "Russia",
            "Rwanda",
            "Saudi Arabia",
            "Solomon Islands",
            "Seychelles",
            "Sudan",
            "Sweden",
            "Singapore",
            "Saint Helena",
            "Slovenia",
            "Svalbard and Jan Mayen",
            "Slovakia",
            "Sierra Leone",
            "San Marino",
            "Senegal",
            "Somalia",
            "Suriname",
            "South Sudan",
            "Sao Tome and Principe",
            "El Salvador",
            "Sint Maarten",
            "Syria",
            "Swaziland",
            "Turks and Caicos Islands",
            "Chad",
            "French Southern Territories",
            "Togo",
            "Thailand",
            "Tajikistan",
            "Tokelau",
            "East Timor",
            "Turkmenistan",
            "Tunisia",
            "Tonga",
            "Turkey",
            "Trinidad and Tobago",
            "Tuvalu",
            "Taiwan",
            "Tanzania",
            "Romania",
            "Ukraine",
            "Uganda",
            "United States Minor Outlying Islands",
            "United States",
            "Uruguay",
            "Uzbekistan",
            "Vatican",
            "Saint Vincent and the Grenadines",
            "Venezuela",
            "British Virgin Islands",
            "U.S. Virgin Islands",
            "Vietnam",
            "Vanuatu",
            "Wallis and Futuna",
            "Samoa",
            "Kosovo",
            "Yemen",
            "Mayotte",
            "South Africa",
            "Zambia",
            "Zimbabwe"
        ];
        this.selectedAgents = [];
        this.selectedCountry = [];
        this.selectedGroups = [];
        this.searchInput = new Subject_1.Subject();
        this.dynamicFields_tickets = [];
        this.dynamicFields_chats = [];
        this.dynamicFieldList_tickets = [];
        this.dynamicFieldList_chats = [];
        this.selectedDynamicFields = [];
        this.customFieldsToggle = false;
        this.dynamicDropdownSettings = {
            singleSelection: false,
            enableCheckAll: false,
            itemsShowLimit: 10,
            idField: 'value',
            textField: 'name',
        };
        this.subscriptions.push(_authService.getAgent().subscribe(function (agent) {
            _this.agent = agent;
            if (_this.agent) {
                // console.log(this.agent);
            }
        }));
        this.subscriptions.push(_authService.getSettings().subscribe(function (data) {
            if (data && data.permissions) {
                _this.permissions = data.permissions.analytics;
            }
        }));
        this.subscriptions.push(_authService.getSettings().subscribe(function (settings) {
            if (settings) {
                // console.log(this.filterList);
                _this.dynamicFields_tickets = settings.schemas.ticket.fields.filter(function (field) {
                    switch (field.elementType) {
                        case 'dropdown':
                            field.value = [];
                            break;
                        case 'textbox':
                            field.value = '';
                            break;
                        case 'checkbox':
                            field.value = '';
                            break;
                    }
                    return !field.default;
                });
                _this.dynamicFields_chats = settings.schemas.chats.fields.filter(function (field) {
                    switch (field.elementType) {
                        case 'dropdown':
                            field.value = [];
                            break;
                        case 'textbox':
                            field.value = '';
                            break;
                        case 'checkbox':
                            field.value = '';
                            break;
                    }
                    return !field.default;
                });
                if (_this.dynamicFields_tickets.length) {
                    _this.dynamicFieldList_tickets = _this.dynamicFields_tickets.map(function (d) { return d.label; });
                }
                if (_this.dynamicFields_chats.length) {
                    _this.dynamicFieldList_chats = _this.dynamicFields_chats.map(function (d) { return d.label; });
                }
                // console.log(this.dynamicFields);
            }
        }));
        this.subscriptions.push(_analyticsService.loading.subscribe(function (data) {
            _this.loading = data;
        }));
        this.subscriptions.push(_utilityService.getAllAgentsListObs().subscribe(function (data) {
            // console.log(data);
            _this.agentList = data;
            _this.agentList_original = data;
        }));
        this.subscriptions.push(_ticketGroupService.Groups.subscribe(function (data) {
            if (data) {
                _this.groupList = data.map(function (g) { return g.group_name; });
            }
            // console.log(this.groupList);
        }));
        this.searchInput.debounceTime(500)
            .distinctUntilChanged()
            .switchMap(function (term) {
            return new Observable_1.Observable(function (observer) {
                if (term) {
                    var agents_1 = _this.agentList_original.filter(function (a) { return a.email.includes(term.toLowerCase() || a.first_name.toLowerCase().includes(term.toLowerCase())); });
                    _this._utilityService.SearchAgent(term).subscribe(function (response) {
                        //console.log(response);
                        if (response && response.agentList.length) {
                            response.agentList.forEach(function (element) {
                                if (!agents_1.filter(function (a) { return a.email == element.email; }).length) {
                                    agents_1.push(element);
                                }
                            });
                        }
                        _this.agentList = agents_1;
                    });
                    // this.agentList = agents;
                }
                else {
                    _this.agentList = _this.agentList_original;
                    // this.setScrollEvent();
                }
            });
        }).subscribe();
    }
    AnalyticsDateboxComponent.prototype.ngOnInit = function () {
        this.selectedAgents = [];
        this.selectedCountry = [];
        if (this.allEnabled) {
            this.fetchAllData = true;
        }
        this.getData();
    };
    AnalyticsDateboxComponent.prototype.ngAfterViewInit = function () {
        // console.log(this.agentEnabled);	
        // setTimeout(() => {
        // 	this.getData();
        // }, 0);
    };
    //Button Events
    AnalyticsDateboxComponent.prototype.setDateType = function (value) {
        this.comparison = false;
        this.fetchAllData = false;
        this.selectedDateType = value;
        switch (value) {
            case 'today':
                this.selectedDate.from = this.customFormatter(new Date());
                this.selectedDate.to = this.customFormatter(new Date());
                this.customDate = false;
                break;
            case 'yesterday':
                this.selectedDate.from = this.customFormatter(this.SubtractDays(new Date(), 1));
                this.selectedDate.to = this.customFormatter(this.SubtractDays(new Date(), 1));
                this.customDate = false;
                break;
            case 'week':
                this.selectedDate.from = this.customFormatter(this.SubtractDays(new Date(), 6));
                this.selectedDate.to = this.customFormatter(new Date());
                this.customDate = false;
                break;
            case 'month':
                this.selectedDate.from = this.customFormatter(this.SubtractDays(new Date(), 29));
                this.selectedDate.to = this.customFormatter(new Date());
                this.customDate = false;
                break;
            case 'custom':
                this.selectedDate.from = this.customFormatter(new Date(this.date_from));
                this.selectedDate.to = this.customFormatter(new Date(this.date_to));
                this.customDate = true;
                break;
            default:
                break;
        }
        this.getData();
    };
    AnalyticsDateboxComponent.prototype.fetchAll = function () {
        this.fetchAllData = true;
        this.getData();
    };
    AnalyticsDateboxComponent.prototype.customFormatter = function (date) {
        return ("0" + (Number(date.getMonth()) + 1)).slice(-2) + '-' + ("0" + date.getDate()).slice(-2) + '-' + date.getFullYear();
    };
    AnalyticsDateboxComponent.prototype.setComparisonType = function (value) {
        this.selectedAgents = [];
        this.selectedComparison = value;
        this.fetchAllData = false;
        switch (this.selectedComparison) {
            case 'past_7_days':
                // this.selectedDate = 'compare_day,' + this.dateFormatter(this.SubtractDays(new Date(), 6)) + ',' + this.dateFormatter(new Date());
                this.selectedDate.from = this.dateFormatter(this.SubtractDays(new Date(), 6));
                this.selectedDate.to = this.dateFormatter(new Date());
                break;
            case 'past_10_days':
                // this.selectedDate = 'compare_day,' + this.dateFormatter(this.SubtractDays(new Date(), 9)) + ',' + this.dateFormatter(new Date());
                this.selectedDate.from = this.dateFormatter(this.SubtractDays(new Date(), 9));
                this.selectedDate.to = this.dateFormatter(new Date());
                break;
            case 'past_30_days':
                // this.selectedDate = 'compare_day,' + this.dateFormatter(this.SubtractDays(new Date(), 29)) + ',' + this.dateFormatter(new Date());
                this.selectedDate.from = this.dateFormatter(this.SubtractDays(new Date(), 29));
                this.selectedDate.to = this.dateFormatter(new Date());
                break;
            case 'past_6_months':
                // this.selectedDate = 'compare_year,' + this.dateFormatter(this.SubtractMonths(new Date(), 5)) + ',' + this.dateFormatter(new Date());
                this.selectedDate.from = this.dateFormatter(this.SubtractMonths(new Date(), 5));
                this.selectedDate.to = this.dateFormatter(new Date());
                break;
            case 'past_years':
                break;
        }
        if (this.selectedComparison != 'past_years') {
            this.getData();
        }
    };
    AnalyticsDateboxComponent.prototype.toggleCustomDate = function () {
        // this.date_from = this.dateFormatter(new Date());
        // this.date_to = this.dateFormatter(new Date());
        this.selectedDate = {
            to: this.customFormatter(new Date()),
            from: this.customFormatter(new Date())
        };
        this.comparison = false;
        this.agentSelection = false;
        this.comparison = false;
        this.customFieldsToggle = false;
        this.groupSelection = false;
        this.customDate = !this.customDate;
    };
    AnalyticsDateboxComponent.prototype.toggleComparison = function () {
        // this.selectedDate = '';
        this.selectedComparison = '';
        this.customDate = false;
        this.agentSelection = false;
        this.groupSelection = false;
        this.customFieldsToggle = false;
        // this.selectedAgents = [];
        this.comparison = !this.comparison;
    };
    AnalyticsDateboxComponent.prototype.toggleCustomSelection = function () {
        this.customDate = false;
        this.agentSelection = false;
        this.comparison = false;
        this.groupSelection = false;
        this.customFieldsToggle = !this.customFieldsToggle;
    };
    AnalyticsDateboxComponent.prototype.comparisonYearSearch = function () {
        if (this.year_from <= this.year_to) {
            this.yearError = false;
            // this.selectedDate = 'compare_year,' + (this.year_from + "-" + ("0" + (new Date().getMonth() + 1)).slice(-2) + '-' + ("0" + new Date().getDate()).slice(-2)) + ',' + (this.year_to + "-" + ("0" + (new Date().getMonth() + 1)).slice(-2) + '-' + ("0" + new Date().getDate()).slice(-2));
            this.selectedDate.from = (this.year_from + "-" + ("0" + (new Date().getMonth() + 1)).slice(-2) + '-' + ("0" + new Date().getDate()).slice(-2));
            this.selectedDate.to = (this.year_to + "-" + ("0" + (new Date().getMonth() + 1)).slice(-2) + '-' + ("0" + new Date().getDate()).slice(-2));
            this.getData();
        }
        else {
            this.yearError = true;
        }
    };
    AnalyticsDateboxComponent.prototype.ToggleAgentSelection = function () {
        this.agentSelection = !this.agentSelection;
        this.selectedGroups = [];
        this.groupSelection = false;
        this.comparison = false;
        this.customFieldsToggle = false;
        this.customDate = false;
    };
    AnalyticsDateboxComponent.prototype.ToggleCountrySelection = function () {
        this.countrySelection = !this.countrySelection;
        this.selectedGroups = [];
        this.groupSelection = false;
        this.comparison = false;
        this.customFieldsToggle = false;
        this.agentSelection = false;
        this.customDate = false;
    };
    AnalyticsDateboxComponent.prototype.ToggleGroupSelection = function () {
        this.groupSelection = !this.groupSelection;
        this.selectedAgents = [];
        this.agentSelection = false;
        this.comparison = false;
        this.customFieldsToggle = false;
        this.customDate = false;
    };
    AnalyticsDateboxComponent.prototype.checkDate = function () {
        if (new Date(this.date_from) <= new Date(this.date_to)) {
            this.dateError = false;
        }
        else {
            this.dateError = true;
        }
    };
    AnalyticsDateboxComponent.prototype.checkYear = function () {
        if (this.year_from <= this.year_to) {
            this.yearError = false;
        }
        else {
            this.yearError = true;
        }
    };
    AnalyticsDateboxComponent.prototype.ExportToExcel = function (data, filename) {
        filename = filename + '-' + this.dateFormatter(new Date());
        this._analyticsService.ExportToExcel(data, filename);
    };
    //HELPERS
    AnalyticsDateboxComponent.prototype.dateFormatter = function (d) {
        return d.getFullYear() + '-' + ("0" + (d.getMonth() + 1)).slice(-2) + '-' + ("0" + d.getDate()).slice(-2);
    };
    AnalyticsDateboxComponent.prototype.SubtractDays = function (date, days) {
        var result = new Date(date);
        result.setDate(result.getDate() - days);
        return result;
    };
    AnalyticsDateboxComponent.prototype.AddDays = function (date, days) {
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    };
    AnalyticsDateboxComponent.prototype.SubtractMonths = function (date, months) {
        var result = new Date(date);
        result.setMonth(result.getMonth() - months);
        return result;
    };
    AnalyticsDateboxComponent.prototype.SubtractYears = function (date, years) {
        var result = new Date(date);
        result.setFullYear(result.getFullYear() - years);
        return result;
    };
    AnalyticsDateboxComponent.prototype.daysBetween = function (date1, date2) {
        //Get 1 day in milliseconds
        var one_day = 1000 * 60 * 60 * 24;
        // Convert both dates to milliseconds
        var date1_ms = date1.getTime();
        var date2_ms = date2.getTime();
        // Calculate the difference in milliseconds
        var difference_ms = date2_ms - date1_ms;
        // Convert back to days and return
        return Math.round(difference_ms / one_day);
    };
    AnalyticsDateboxComponent.prototype.diff = function (from, to) {
        var arr = [];
        var datFrom = new Date(from);
        var datTo = new Date(to);
        var fromYear = datFrom.getFullYear();
        var toYear = datTo.getFullYear();
        var diffYear = (12 * (toYear - fromYear)) + datTo.getMonth();
        for (var i = datFrom.getMonth(); i <= diffYear; i++) {
            arr.push({ name: this.monthNames[i % 12] + " " + Math.floor(fromYear + (i / 12)), value: 0 });
        }
        return arr;
    };
    AnalyticsDateboxComponent.prototype.diffYear = function (from, to, type) {
        if (type === void 0) { type = 'nonarray'; }
        var arr = [];
        var datFrom = from;
        var datTo = to;
        var fromYear = datFrom.getFullYear();
        var toYear = datTo.getFullYear();
        var diffYear = toYear - fromYear;
        for (var i = 0; i <= diffYear; i++) {
            arr.push({ name: fromYear.toString(), value: (type == 'nonarray') ? 0 : [] });
            fromYear++;
        }
        return arr;
    };
    AnalyticsDateboxComponent.prototype.diffMonth = function (from, to, type) {
        if (type === void 0) { type = 'nonarray'; }
        var arr = [];
        var fromYear = from.getFullYear();
        var toYear = to.getFullYear();
        var diffYear = (12 * (toYear - fromYear)) + to.getMonth();
        for (var i = from.getMonth(); i <= diffYear; i++) {
            arr.push({ name: this.monthNames[i % 12], value: (type == 'nonarray') ? 0 : [] });
        }
        // for (var i = 0; i <= diffMonth; i++) {
        // 	arr.push({ name: this.monthNames[fromMonth], value: (type == 'nonarray') ? 0 : [] });
        // 	fromMonth++;
        // }
        return arr;
    };
    //Custom select events
    AnalyticsDateboxComponent.prototype.onItemSelect = function (event) {
        this.selectedAgents = event;
    };
    AnalyticsDateboxComponent.prototype.onItemDeSelect = function (event) {
        this.selectedAgents = event;
    };
    AnalyticsDateboxComponent.prototype.onCountrySelect = function (event) {
        this.selectedCountry = event;
    };
    AnalyticsDateboxComponent.prototype.onCountryDeSelect = function (event) {
        this.selectedCountry = event;
    };
    AnalyticsDateboxComponent.prototype.onGroupSelect = function (event) {
        this.selectedGroups = (Array.isArray(event)) ? event : [event];
    };
    AnalyticsDateboxComponent.prototype.onGroupSelectAll = function (items) {
        var _this = this;
        this.selectedGroups = [];
        items.forEach(function (element) {
            if (!_this.selectedGroups.includes(element)) {
                _this.selectedGroups.push(element);
            }
        });
    };
    AnalyticsDateboxComponent.prototype.onGroupDeSelectAll = function (items) {
        this.selectedGroups = [];
    };
    AnalyticsDateboxComponent.prototype.onGroupDeSelect = function (event) {
        // if(Array.isArray(event))
        this.selectedGroups = (Array.isArray(event)) ? event : [event];
    };
    AnalyticsDateboxComponent.prototype.onDynamicFieldSelect = function (event) {
        // console.log(event);
        // console.log(this.dynamicFieldObjList);
        // console.log(this.selectedDynamicFields);		
    };
    AnalyticsDateboxComponent.prototype.onDynamicFieldDeSelect = function (event) {
        // console.log(event);
        // console.log(this.selectedDynamicFields);
    };
    AnalyticsDateboxComponent.prototype.loadMore = function ($event) {
        var _this = this;
        // console.log('Scroll');
        if (!this.ended) {
            // console.log('Fetch More');
            this._utilityService.getMoreAgentsObs(this.agentList[this.agentList.length - 1].first_name).subscribe(function (response) {
                // console.log(response);
                _this.agentList = _this.agentList.concat(response.agents);
                _this.ended = response.ended;
            });
        }
    };
    AnalyticsDateboxComponent.prototype.onSearch = function (value) {
        var _this = this;
        // console.log('Search');
        // console.log(value);
        if (value) {
            var agents_2 = this.agentList_original.filter(function (a) { return a.email.includes(value.toLowerCase()); });
            this._utilityService.SearchAgent(value).subscribe(function (response) {
                //console.log(response);
                if (response && response.agentList.length) {
                    response.agentList.forEach(function (element) {
                        if (!agents_2.filter(function (a) { return a.email == element.email; }).length) {
                            agents_2.push(element);
                        }
                    });
                }
                _this.agentList = agents_2;
            });
            // this.agentList = agents;
        }
        else {
            this.agentList = this.agentList_original;
            this.ended = false;
            // this.setScrollEvent();
        }
    };
    // searchAgent(){
    // 	console.log('Search Agent');
    // }
    //multiselect group functions
    //Get Processed Data
    AnalyticsDateboxComponent.prototype.getData = function () {
        if (this.permissions && this.permissions.canView == "self") {
            this.agentEnabled = false;
            this.selectedAgents = [this.agent.email];
        }
        this._analyticsService.selectedDate.next(this.selectedDate);
        this.onResult.emit({
            csid: this.agent.csid,
            selectedDateType: this.selectedDateType,
            selectedDate: this.selectedDate,
            selectedAgents: this.selectedAgents,
            selectedCountry: this.selectedCountry,
            selectedGroups: this.selectedGroups,
            comaprison: this.comparison,
            selectedComparison: this.selectedComparison,
            year_from: this.year_from,
            year_to: this.year_to,
            permissions: this.permissions,
            email: this.agent.email,
            fetchAllData: this.fetchAllData,
            dynamicFields: !Array.isArray(this.selectedDynamicFields) ? [this.selectedDynamicFields] : this.selectedDynamicFields
        });
    };
    AnalyticsDateboxComponent.prototype.ngOnDestroy = function () {
        // console.log('Datebox destroyed!');
        // this._analyticsService.resetOptions();
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
        this._analyticsService.selectedAgents.next([]);
    };
    __decorate([
        core_1.Input()
    ], AnalyticsDateboxComponent.prototype, "allEnabled", void 0);
    __decorate([
        core_1.Input()
    ], AnalyticsDateboxComponent.prototype, "agentEnabled", void 0);
    __decorate([
        core_1.Input()
    ], AnalyticsDateboxComponent.prototype, "countryEnabled", void 0);
    __decorate([
        core_1.Input()
    ], AnalyticsDateboxComponent.prototype, "groupEnabled", void 0);
    __decorate([
        core_1.Input()
    ], AnalyticsDateboxComponent.prototype, "compareEnabled", void 0);
    __decorate([
        core_1.Input()
    ], AnalyticsDateboxComponent.prototype, "customFieldsEnabled", void 0);
    __decorate([
        core_1.Input()
    ], AnalyticsDateboxComponent.prototype, "dayFiltersEnabled", void 0);
    __decorate([
        core_1.Input()
    ], AnalyticsDateboxComponent.prototype, "multipleAgentSelection", void 0);
    __decorate([
        core_1.Input()
    ], AnalyticsDateboxComponent.prototype, "multipleGroupSelection", void 0);
    __decorate([
        core_1.Input()
    ], AnalyticsDateboxComponent.prototype, "multipleCountrySelection", void 0);
    __decorate([
        core_1.Input()
    ], AnalyticsDateboxComponent.prototype, "customFieldsType", void 0);
    __decorate([
        core_1.Output()
    ], AnalyticsDateboxComponent.prototype, "onResult", void 0);
    AnalyticsDateboxComponent = __decorate([
        core_1.Component({
            selector: 'app-analytics-datebox',
            templateUrl: './analytics-datebox.component.html',
            styleUrls: ['./analytics-datebox.component.css'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], AnalyticsDateboxComponent);
    return AnalyticsDateboxComponent;
}());
exports.AnalyticsDateboxComponent = AnalyticsDateboxComponent;
//# sourceMappingURL=analytics-datebox.component.js.map