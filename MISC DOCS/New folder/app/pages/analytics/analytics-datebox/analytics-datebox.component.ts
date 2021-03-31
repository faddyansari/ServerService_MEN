import { Component, OnInit, Input, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/distinctUntilChanged';
import { AuthService } from '../../../../services/AuthenticationService';
import { AnalyticsService } from '../../../../services/AnalyticsService';
import { TicketAutomationService } from '../../../../services/LocalServices/TicketAutomationService';
import 'rxjs/add/operator/switchMap';
import { UtilityService } from '../../../../services/UtilityServices/UtilityService';

@Component({
	selector: 'app-analytics-datebox',
	templateUrl: './analytics-datebox.component.html',
	styleUrls: ['./analytics-datebox.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class AnalyticsDateboxComponent implements OnInit {

	
	@Input() allEnabled: boolean = false;
	@Input() agentEnabled: boolean = true;
	@Input() countryEnabled: boolean = false;
	@Input() groupEnabled: boolean = false;
	@Input() compareEnabled: boolean = true;
	@Input() customFieldsEnabled: boolean = false;
	@Input() dayFiltersEnabled: boolean = true;
	@Input() multipleAgentSelection: boolean = true;
	@Input() multipleGroupSelection: boolean = true;
	@Input() multipleCountrySelection: boolean = true;
	@Input() customFieldsType : string = '';
	@Output() onResult = new EventEmitter();

	agent: any;
	subscriptions: Subscription[] = [];
	today = this.dateFormatter(new Date());
	selectedDateType = 'today';
	selectedDate = {
		to: this.customFormatter(new Date()),
		from: this.customFormatter(new Date())
	};
	selectedComparison = '';
	customDate = false;
	comparison = false;
	date_from = this.dateFormatter(new Date());
	date_to = this.dateFormatter(new Date());
	agentSelection = false;
	countrySelection = false;
	groupSelection = false;
	agentEmail: any;
	year_from = new Date().getFullYear() - 1;
	year_to = new Date().getFullYear();
	max_year = new Date().getFullYear();
	dateError = false;
	yearError = false;
	loading = false;
	ended = false;
	fetchAllData = false;

	//Month Names Array
	monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
		"Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
	dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"
	];

	//country Names Array
	countryNames = [
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
]

	//MultiselectVariables
	agentList: any;
	agentList_original: any;
	groupList: any;
	selectedAgents = [];
	selectedCountry = [];
	selectedGroups = [];
	searchInput = new Subject();
	permissions: any;
	dynamicFields_tickets = [];
	dynamicFields_chats = [];
	dynamicFieldList_tickets = [];
	dynamicFieldList_chats = [];
	selectedDynamicFields = [];
	customFieldsToggle = false;
	public dynamicDropdownSettings = {
		singleSelection: false,
		enableCheckAll: false,
		itemsShowLimit: 10,
		idField: 'value',
		textField: 'name',
	};

	constructor(_authService: AuthService, public _analyticsService: AnalyticsService, public _utilityService: UtilityService, _ticketGroupService: TicketAutomationService) {
		this.subscriptions.push(_authService.getAgent().subscribe(agent => {
			this.agent = agent;
			if (this.agent) {
				// console.log(this.agent);
			}
		}));
		this.subscriptions.push(_authService.getSettings().subscribe(data => {

			if (data && data.permissions) {
				this.permissions = data.permissions.analytics;
			}

		}));

		this.subscriptions.push(_authService.getSettings().subscribe(settings => {
			if (settings) {	
				// console.log(this.filterList);
				this.dynamicFields_tickets = settings.schemas.ticket.fields.filter(field => {				
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
				this.dynamicFields_chats = settings.schemas.chats.fields.filter(field => {				
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
					
				if(this.dynamicFields_tickets.length){
					this.dynamicFieldList_tickets = this.dynamicFields_tickets.map(d => d.label);
				}
				if(this.dynamicFields_chats.length){
					this.dynamicFieldList_chats = this.dynamicFields_chats.map(d => d.label);
				}
				// console.log(this.dynamicFields);
				
			}
		}));

		this.subscriptions.push(_analyticsService.loading.subscribe(data => {
			this.loading = data;
		}));
		this.subscriptions.push(_utilityService.getAllAgentsListObs().subscribe(data => {
			// console.log(data);

			this.agentList = data;
			this.agentList_original = data;


		}));
		this.subscriptions.push(_ticketGroupService.Groups.subscribe(data => {
			if (data) {
				this.groupList = data.map(g => g.group_name);
			}
			// console.log(this.groupList);
		}));

		this.searchInput.debounceTime(500)
			.distinctUntilChanged()
			.switchMap((term) => {
				return new Observable((observer) => {
					if (term) {
						let agents = this.agentList_original.filter(a => a.email.includes((term as string).toLowerCase() || a.first_name.toLowerCase().includes((term as string).toLowerCase())));
						this._utilityService.SearchAgent(term).subscribe((response) => {
							//console.log(response);
							if (response && response.agentList.length) {
								response.agentList.forEach(element => {
									if (!agents.filter(a => a.email == element.email).length) {
										agents.push(element);
									}
								});
							}
							this.agentList = agents;
						});
						// this.agentList = agents;
					} else {
						this.agentList = this.agentList_original;
						// this.setScrollEvent();
					}
				})
			}).subscribe();
	}

	ngOnInit() {
		this.selectedAgents = [
		];
		this.selectedCountry = [];
		if(this.allEnabled){
			this.fetchAllData = true;
		}
		this.getData();
	}
	ngAfterViewInit() {
		// console.log(this.agentEnabled);	
		// setTimeout(() => {
		// 	this.getData();
		// }, 0);
	}

	//Button Events
	setDateType(value) {
		this.comparison = false;
		this.fetchAllData = false;
		this.selectedDateType = value;
		switch (value) {
			case 'today':
				this.selectedDate.from = this.customFormatter(new Date());
				this.selectedDate.to = this.customFormatter(new Date());
				this.customDate = false;
				break
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
	}
	fetchAll(){
		this.fetchAllData = true;
		this.getData();
	}
	customFormatter(date: Date) {
		return ("0" + (Number(date.getMonth()) + 1)).slice(-2) + '-' + ("0" + date.getDate()).slice(-2) + '-' + date.getFullYear();
	}
	setComparisonType(value) {
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
	}
	toggleCustomDate() {
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
	}
	toggleComparison() {
		// this.selectedDate = '';
		this.selectedComparison = '';
		this.customDate = false;
		this.agentSelection = false;
		this.groupSelection = false;
		this.customFieldsToggle = false;
		// this.selectedAgents = [];
		this.comparison = !this.comparison;
	}
	toggleCustomSelection(){
		this.customDate = false;
		this.agentSelection = false;
		this.comparison = false;
		this.groupSelection = false;
		this.customFieldsToggle = !this.customFieldsToggle;
	}
	comparisonYearSearch() {
		if (this.year_from <= this.year_to) {
			this.yearError = false;
			// this.selectedDate = 'compare_year,' + (this.year_from + "-" + ("0" + (new Date().getMonth() + 1)).slice(-2) + '-' + ("0" + new Date().getDate()).slice(-2)) + ',' + (this.year_to + "-" + ("0" + (new Date().getMonth() + 1)).slice(-2) + '-' + ("0" + new Date().getDate()).slice(-2));
			this.selectedDate.from = (this.year_from + "-" + ("0" + (new Date().getMonth() + 1)).slice(-2) + '-' + ("0" + new Date().getDate()).slice(-2));
			this.selectedDate.to = (this.year_to + "-" + ("0" + (new Date().getMonth() + 1)).slice(-2) + '-' + ("0" + new Date().getDate()).slice(-2));
			this.getData();
		} else {
			this.yearError = true;
		}
	}
	ToggleAgentSelection() {
		this.agentSelection = !this.agentSelection;
		this.selectedGroups = [];
		this.groupSelection = false;
		this.comparison = false;	
		this.customFieldsToggle = false;	
		this.customDate = false;
	}
	ToggleCountrySelection() {
		this.countrySelection = !this.countrySelection;
		this.selectedGroups = [];
		this.groupSelection = false;
		this.comparison = false;	
		this.customFieldsToggle = false;
		this.agentSelection = false;
		this.customDate = false;
	}
	ToggleGroupSelection() {
		this.groupSelection = !this.groupSelection;
		this.selectedAgents = [];
		this.agentSelection = false;
		this.comparison = false;
		this.customFieldsToggle = false;
		this.customDate = false;
	}
	checkDate() {
		if (new Date(this.date_from) <= new Date(this.date_to)) {
			this.dateError = false;
		} else {
			this.dateError = true;
		}
	}
	checkYear() {
		if (this.year_from <= this.year_to) {
			this.yearError = false;
		} else {
			this.yearError = true;
		}
	}
	ExportToExcel(data, filename) {
		filename = filename + '-' + this.dateFormatter(new Date());
		this._analyticsService.ExportToExcel(data, filename);
	}

	//HELPERS
	dateFormatter(d) {
		return d.getFullYear() + '-' + ("0" + (d.getMonth() + 1)).slice(-2) + '-' + ("0" + d.getDate()).slice(-2);
	}
	SubtractDays(date, days) {
		var result = new Date(date);
		result.setDate(result.getDate() - days);
		return result;
	}
	AddDays(date, days) {
		var result = new Date(date);
		result.setDate(result.getDate() + days);
		return result;
	}
	SubtractMonths(date, months) {
		var result = new Date(date);
		result.setMonth(result.getMonth() - months);
		return result;
	}
	SubtractYears(date, years) {
		var result = new Date(date);
		result.setFullYear(result.getFullYear() - years);
		return result;
	}
	daysBetween(date1, date2) {
		//Get 1 day in milliseconds
		var one_day = 1000 * 60 * 60 * 24;

		// Convert both dates to milliseconds
		var date1_ms = date1.getTime();
		var date2_ms = date2.getTime();

		// Calculate the difference in milliseconds
		var difference_ms = date2_ms - date1_ms;

		// Convert back to days and return
		return Math.round(difference_ms / one_day);
	}
	diff(from, to) {
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
	}
	diffYear(from, to, type = 'nonarray') {
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
	}

	diffMonth(from, to, type = 'nonarray') {
		var arr = [];
        var fromYear =  from.getFullYear();
        var toYear =  to.getFullYear();
        var diffYear = (12 * (toYear - fromYear)) + to.getMonth();
        for (var i = from.getMonth(); i <= diffYear; i++) {
            arr.push({ name: this.monthNames[i%12], value: (type == 'nonarray') ? 0 : [] });
        }        	
		// for (var i = 0; i <= diffMonth; i++) {
		// 	arr.push({ name: this.monthNames[fromMonth], value: (type == 'nonarray') ? 0 : [] });
		// 	fromMonth++;
		// }

		return arr;
	}


	//Custom select events
	onItemSelect(event) {
		this.selectedAgents = event;
	}
	onItemDeSelect(event) {
		this.selectedAgents = event;
	}
	onCountrySelect(event) {
		this.selectedCountry = event;
	}
	onCountryDeSelect(event) {
		this.selectedCountry = event;
	}

	onGroupSelect(event) {
		this.selectedGroups = (Array.isArray(event)) ? event : [event];
	}
	onGroupSelectAll(items: any) {
		this.selectedGroups = [];
		items.forEach(element => {
			if (!this.selectedGroups.includes(element)) {
				this.selectedGroups.push(element);
			}
		});
	}
	onGroupDeSelectAll(items: any) {
		this.selectedGroups = [];
	}
	onGroupDeSelect(event) {
		// if(Array.isArray(event))
		this.selectedGroups = (Array.isArray(event)) ? event : [event];
	}

	onDynamicFieldSelect(event){
		// console.log(event);
		
		// console.log(this.dynamicFieldObjList);
		
		// console.log(this.selectedDynamicFields);		
	}

	onDynamicFieldDeSelect(event){
		// console.log(event);
		
		// console.log(this.selectedDynamicFields);
	}


	loadMore($event) {
		// console.log('Scroll');
		if (!this.ended) {
			// console.log('Fetch More');
			this._utilityService.getMoreAgentsObs(this.agentList[this.agentList.length - 1].first_name).subscribe(response => {
				// console.log(response);
				this.agentList = this.agentList.concat(response.agents);
				this.ended = response.ended;
			});
		}
	}
	onSearch(value) {
		// console.log('Search');
		// console.log(value);
		if (value) {
			let agents = this.agentList_original.filter(a => a.email.includes((value as string).toLowerCase()));
			this._utilityService.SearchAgent(value).subscribe((response) => {
				//console.log(response);
				if (response && response.agentList.length) {
					response.agentList.forEach(element => {
						if (!agents.filter(a => a.email == element.email).length) {
							agents.push(element);
						}
					});
				}
				this.agentList = agents;
			});
			// this.agentList = agents;
		} else {
			this.agentList = this.agentList_original;
			this.ended = false;
			// this.setScrollEvent();
		}
	}

	// searchAgent(){
	// 	console.log('Search Agent');

	// }

	//multiselect group functions

	//Get Processed Data
	getData() {
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
			fetchAllData : this.fetchAllData,
			dynamicFields: !Array.isArray(this.selectedDynamicFields) ? [this.selectedDynamicFields] : this.selectedDynamicFields
		});
	}

	ngOnDestroy() {
		// console.log('Datebox destroyed!');
		// this._analyticsService.resetOptions();
		this.subscriptions.forEach(subscription => {
			subscription.unsubscribe();
		});
		this._analyticsService.selectedAgents.next([]);
	}

}
