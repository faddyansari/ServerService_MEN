import { Component, OnInit, ViewEncapsulation, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TicketsService } from '../../../../services/TicketsService';
import 'rxjs/add/operator/mapTo';
import 'rxjs/add/operator/distinctUntilChanged';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { TagService } from '../../../../services/TagService';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/switchMap';
import { AuthService } from '../../../../services/AuthenticationService';
import { TicketAutomationService } from '../../../../services/LocalServices/TicketAutomationService';
import { DateRangePickerComponent } from '../../../custom-components/date-range-picker/date-range-picker.component';
import { PopperContent } from 'ngx-popper';
import { UtilityService } from '../../../../services/UtilityServices/UtilityService';


@Component({
	selector: 'app-ticket-filters',
	templateUrl: './ticket-filters.component.html',
	styleUrls: ['./ticket-filters.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class TicketFiltersComponent implements OnInit {

	private subscriptions: Subscription[] = [];
	@ViewChild('scrollContainer') scrollContainer: ElementRef;
	@ViewChild('datePicker') datePicker: DateRangePickerComponent;
	@ViewChild('dateRangePopper') dateRangePopper: PopperContent
	public searchValue: any;
	loadingMoreAgents = false;
	public filterform: FormGroup;
	public $observable: BehaviorSubject<any> = new BehaviorSubject(undefined);
	public filterList: any = undefined;
	public dynamicFields: any = undefined;
	//Filters
	public priorityList = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
	public statusList = ['OPEN', 'PENDING', 'SOLVED', 'CLOSED'];
	public dateFilters = ['PAST 7 Days', 'PAST 30 Days', 'PAST 6 Months', 'CUSTOM DATE'];
	public agentList = [];
	public agentList_original = [];
	public groupList = [];
	scrollHeight = 0;
	showNoAgents = false;
	// public tagList = [];

	public selectedItems = []
	public selectedStatus = []
	public selectedAgents = [];
	public selectedGroups = [];
	public daterange: any = undefined;
	// public selectedTags = [];

	public contactNames = [];
	public source = [];
	public createdDate = [];
	//Filter Settings
	public dropdownSettings = {
		singleSelection: false,
		enableCheckAll: false,
		itemsShowLimit: 10,
	};
	public dropdownSettings_withSearch = {
		singleSelection: false,
		enableCheckAll: false,
		allowSearchFilter: true,
		itemsShowLimit: 10,
	};

	public dynamicDropdownSettings = {
		singleSelection: false,
		enableCheckAll: false,
		itemsShowLimit: 10,
		idField: 'value',
		textField: 'name',
	};

	public dropdownSettingsSingle = {
		singleSelection: true,
		enableCheckAll: false,
		itemsShowLimit: 10,
		closeDropDownOnSelection: true,
	};


	clause = '$and';
	clearing = false;
	loading = true;
	showrangepicker = false;
	searchInput = new Subject();
	ended = false;
	filterArea = false;
	sortBy = {
		name: 'lasttouchedTime',
		type: '-1'
	};
	mergeType = 'all';
	agentAssignType = 'all';
	groupAssignType = 'all';

	//ClientIds Search
	selectedIDs = '';
	settings: any;

	constructor(formbuilder: FormBuilder,
		private _ticketService: TicketsService,
		private _ticketAutomationService: TicketAutomationService,
		private _utilityService: UtilityService,
		private _authService: AuthService,
		private _tagService: TagService) {

		this.subscriptions.push(this._ticketService.loading.subscribe(loading => {
			//console.log('Loading', loading);

			this.loading = loading;
		}))
		this.subscriptions.push(this._ticketService.showFilterArea.subscribe(value => {
			//console.log('Loading', loading);

			this.filterArea = value;
		}))

		this.subscriptions.push(this._authService.getSettings().subscribe(settings => {
			if (settings) {	
				// console.log(this.filterList);
				this.settings = settings;
				this.dynamicFields = settings.schemas.ticket.fields.filter(field => {
					
					switch (field.elementType) {
						case 'dropdown':
							field.value = [];					
							break;
						case 'textbox':
							field.value = '';
							field.subscriber = new Subject<string>();
							this.subscriptions.push(field.subscriber.debounceTime(500).distinctUntilChanged().subscribe(data => {
								//console.log('Field Changed', data);
								this._ticketService.Filters.next(this.ApplyFilter());
							}));
							break;
	
						case 'checkbox':
							field.value = '';
							field.subscriber = new Subject<string>();
							this.subscriptions.push(field.subscriber.debounceTime(500).distinctUntilChanged().subscribe(data => {
								//console.log('Field Changed', data);
								this._ticketService.Filters.next(this.ApplyFilter());
							}));
							break;
					}
					if(this.filterList && this.filterList.filter && this.filterList.filter['dynamicFields.' + field.name]){
						field.value = this.filterList.filter['dynamicFields.' + field.name];
					}
					return !field.default;
				});
			}
		}));

		this.subscriptions.push(this._ticketService.Filters.subscribe(filters => {
			this.filterList = filters;
			// console.log(filters);
			if (filters.filter) {
				// console.log(filters);
				this.clause = filters.clause;
				this.sortBy = filters.sortBy;
				this.searchValue = filters.query;
				this.agentAssignType = filters.assignType;
				this.groupAssignType = filters.groupAssignType;
				this.mergeType = filters.mergeType;
				if (Object.keys(filters.filter).length) {
					Object.keys(filters.filter).map(key => {
						if (key == 'priority') this.selectedItems = filters.filter[key];
						if (key == 'state') this.selectedStatus = filters.filter[key];
						if (key == 'assigned_to') this.selectedAgents = filters.filter[key];
						if (key == 'group') this.selectedGroups = filters.filter[key];
						if (key == 'daterange') this.daterange = filters.filter[key];

					});
				} else {
					this.selectedItems = [];
					this.selectedStatus = [];
					this.selectedAgents = [];
					this.selectedGroups = [];
				}

				if(this.settings){
					this.dynamicFields = this.settings.schemas.ticket.fields.filter(field => {
					
						switch (field.elementType) {
							case 'dropdown':
								field.value = [];					
								break;
							case 'textbox':
								field.value = '';
								field.subscriber = new Subject<string>();
								this.subscriptions.push(field.subscriber.debounceTime(500).distinctUntilChanged().subscribe(data => {
									//console.log('Field Changed', data);
									this._ticketService.Filters.next(this.ApplyFilter());
								}));
								break;
		
							case 'checkbox':
								field.value = '';
								field.subscriber = new Subject<string>();
								this.subscriptions.push(field.subscriber.debounceTime(500).distinctUntilChanged().subscribe(data => {
									//console.log('Field Changed', data);
									this._ticketService.Filters.next(this.ApplyFilter());
								}));
								break;
						}
						if(this.filterList && this.filterList.filter && this.filterList.filter['dynamicFields.' + field.name]){
							field.value = this.filterList.filter['dynamicFields.' + field.name];
						}
						return !field.default;
					});
				}

				if (this.clearing) {
					this.clearing = false;
				}

			}


		}));

		this.subscriptions.push(this._ticketService.headerSearch.distinctUntilChanged().debounceTime(300).subscribe(data => {
			this.searchValue = data;
			// console.log(data);

			this._ticketService.Filters.next(this.ApplyFilter());
		}))
		// this.subscriptions.push(this.$observable.subscribe(response => {
		// 	console.log(response);
		// 	if (response && Object.keys(response).length) {
		// 		this._ticketService.Filters.next(response)
		// 	}
		// }));

		this.subscriptions.push(this._utilityService.getAllAgentsListObs().subscribe(agents => {
			if (agents) {
				this.agentList = agents;
				this.agentList_original = agents;
			}
			// console.log(this.agentList);

		}));

		this.subscriptions.push(this._ticketAutomationService.Groups.subscribe(groups => {
			// if (groups && Object.keys(groups).length) {
			// 	let temp = [];
			// 	groups.map(group => {
			// 		temp.push(group.group_name);
			// 	});
			// 	this.groupList = temp;
			// }
			if (groups) {
				this.groupList = groups.map(g => g.group_name);
				// console.log(this.groupList);

			}
		}));

		// this.subscriptions.push(this._tagService.Tag.subscribe(tags => {

		// 	if (tags && Object.keys(tags).length) {
		// 		let temp = [];
		// 		tags.tags.map(tag => {
		// 			temp.push(tag.tag);
		// 		})
		// 		this.tagList = temp;
		// 	}

		// }))



		this.filterform = formbuilder.group({
			'assigned_to': [null],
			'priority': [null],
			'tags': [null]
		});

		this.searchInput
			.map(event => event)
			.debounceTime(500)
			.switchMap(() => {
				return new Observable((observer) => {
					console.log('search');


				})
			}).subscribe();


	}

	ngOnInit() {


		// this.subscriptions.push(this.searchForm.get('searchValue').valueChanges.debounceTime(1000).distinctUntilChanged().subscribe(response => {
		// 	if (this.clearing) this.clearing = false;
		// 	else this._ticketService.Filters.next(this.ApplyFilter());
		// }))
	}

	ngAfterViewInit() {
		// Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
		// Add 'implements AfterViewInit' to the class.
		this.scrollHeight = this.scrollContainer.nativeElement.scrollHeight;
	}

	ngAfterViewChecked() {
		//Called after every check of the component's view. Applies to components only.
		//Add 'implements AfterViewChecked' to the class.
		// if(this.loadingMoreAgents){
		//   this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight + 20;
		//   // this.scrollRef.scrollYTo(this.scrollRef.view.scrollHeight + 20);
		// }
	}

	ngOnDestroy(): void {
		//Called once, before the instance is destroyed.
		//Add 'implements OnDestroy' to the class.
		this.subscriptions.map(subscription => subscription.unsubscribe());
		// this._ticketService.saveFiltersOnLocalStorage();
	}

	clearText() {
		// this.searchForm.reset();
	}

	Reload() {
		if (this.loading) return;
		// this.loading = true;
		this._ticketService.loading.next(true);
		this._ticketService.Filters.next(this.ApplyFilter(true));
	}

	CheckFiltersEmpty() {
		let filtersEmpty = true;

		if (this.searchValue) {
			filtersEmpty = false;
		}

		if (this.filterList && Object.keys(this.filterList).length) {
			Object.keys(this.filterList.filter).map(key => {
				if (this.filterList.filter[key] || this.filterList.filter[key].length) filtersEmpty = false;
			});
		}

		return filtersEmpty;

	}



	ClearFields() {
		// console.log(this.sortBy);

		if (this.clearing) return;
		if (!this.CheckFiltersEmpty()) {
			this.clearing = true;
			this._ticketService.Filters.next({ filter: {}, clause: '$and', query: undefined, sortBy: { name: 'lasttouchedTime', type: '-1' }, assignType: 'all', groupAssignType: 'all', mergeType : 'all' });
			this._ticketService.saveFiltersOnLocalStorage({ filter: {}, clause: '$and', query: undefined, sortBy: { name: 'lasttouchedTime', type: '-1' }, assignType: 'all', groupAssignType: 'all', mergeType : 'all' });
			this.dynamicFields.forEach(field => {
				switch (field.elementType) {
					case 'dropdown':
						field.value = [];
						break;
					case 'textbox':
						field.value = '';
						field.subscriber = new Subject<string>();
						this.subscriptions.push(field.subscriber.debounceTime(500).distinctUntilChanged().subscribe(data => {
							//console.log('Field Changed', data);
							this._ticketService.Filters.next(this.ApplyFilter());
						}));
						break;

					case 'checkbox':
						field.value = '';
						field.subscriber = new Subject<string>();
						this.subscriptions.push(field.subscriber.debounceTime(500).distinctUntilChanged().subscribe(data => {
							//console.log('Field Changed', data);
							this._ticketService.Filters.next(this.ApplyFilter());
						}));
						break;
				}
				return !field.default;
			});
		}

	}

	toggleFilters() {
		this._ticketService.toggleFilterArea();
		// this.filterArea = !this.filterArea;
	}

	clearDate(event: Event) {
		event.stopImmediatePropagation();
		event.stopPropagation();
		this.daterange = undefined;
		this._ticketService.Filters.next(this.ApplyFilter());
	}

	onDateSelect(event: any) {
		//console.log(event);
		this.dateRangePopper.hide();
		let temp = JSON.stringify({
			to: new Date(event.dates.to),
			from: new Date(event.dates.from)
		})

		if (JSON.stringify(this.daterange) != temp) {
			this.daterange = {
				to: new Date(event.dates.to),
				from: new Date(event.dates.from)
			}
			this._ticketService.Filters.next(this.ApplyFilter());
		}

	}

	onItemSelect(event: any) {
		this._ticketService.Filters.next(this.ApplyFilter());
		//See if selectedGroups has some value
		if (this.selectedGroups.length) {
			//Then get the agents of that group
			//If more than one group selected then merge the two agentlists
			this._ticketService.getAgentsAgainstGroup(this.selectedGroups).subscribe(agents => {
				if (agents) {
					this.agentList = agents;
				} else {
					this.agentList = [];
				}
			});
		} else {
			this.agentList = this.agentList_original;
		}
		//If group has no value then show the original agent list
	}


	onDynamicItemSelect(event: any, value) {
		//console.log('OnSelect ', value);
		this._ticketService.Filters.next(this.ApplyFilter());


	}

	onDynamicItemDeSelect(event: any) {
		//console.log('Deselect ', event);
		this._ticketService.Filters.next(this.ApplyFilter());


	}



	DynamicFieldTextBoxChange(i, value) {
		this.dynamicFields[i].subscriber.next(value);

	}


	clearAgent(event, email) {
		event.stopPropagation();
		event.stopImmediatePropagation();
		this.agentList.map(a => {
			if (a.email == email) {
				a.selected = false;
				return a;
			}
		});
		this.selectedAgents.map((agent, index) => {
			if (agent == email) {
				this.selectedAgents.splice(index, 1);
			}
		});
		if (this.agentList.filter(a => a.selected).length == this.agentList.length) {
			// console.log('no agents');
			this.showNoAgents = true
		} else {
			this.showNoAgents = false;
		}
		this._ticketService.Filters.next(this.ApplyFilter());
	}
	clearAllAgents(event) {
		event.stopPropagation();
		event.stopImmediatePropagation();
		this.selectedAgents = [];
		this.agentList.map(a => {
			a.selected = false;
			return a;
		});
		if (this.agentList.filter(a => a.selected).length == this.agentList.length) {
			//console.log('no agents');
			this.showNoAgents = true
		} else {
			this.showNoAgents = false;
		}
		this._ticketService.Filters.next(this.ApplyFilter());
	}
	onItemSelect_dropdown(email) {
		if (!this.selectedAgents.includes(email)) this.selectedAgents.push(email);
		this.agentList.map(a => {
			if (a.email == email) {
				a.selected = true;
				return a;
			}
		});
		if (this.agentList.filter(a => a.selected).length == this.agentList.length) {
			//console.log('no agents');
			this.showNoAgents = true
		} else {
			this.showNoAgents = false;
		}
		this._ticketService.Filters.next(this.ApplyFilter());
	}
	onDeSelect(event: any) {
		this._ticketService.Filters.next(this.ApplyFilter());
		//See if selectedGroups has some value
		if (this.selectedGroups.length) {
			//Then get the agents of that group
			//If more than one group selected then merge the two agentlists
			this._ticketService.getAgentsAgainstGroup(this.selectedGroups).subscribe(agents => {
				if (agents) {
					this.agentList = agents;
				} else {
					this.agentList = this.agentList_original;
				}
			});
		} else {
			this.agentList = this.agentList_original;
		}
		//If group has no value then show the original agent list
	}
	onDeSelectAll(items: any) {
		this.selectedAgents = [];
		this._ticketService.Filters.next(this.ApplyFilter());
	}
	onSelectAll(event: any) {
		//console.log('Onselect', this.selectedItems);
		// this.filterList
	}


	onFilterChange($event) {
		//console.log('onFilterChange', event);
		//console.log(this.selectedItems);
	}
	updateSort() {
		// console.log(this.sortBy);
		this._ticketService.Filters.next(this.ApplyFilter());
	}
	assignTypeChanged() {
		this._ticketService.Filters.next(this.ApplyFilter());
	}
	mergeTypeChanged() {
		this._ticketService.Filters.next(this.ApplyFilter());
	}

	UpdateClause() {
		this._ticketService.Filters.next(this.ApplyFilter());
	}

	StopPropogation(event: Event) {
		event.stopImmediatePropagation();
		event.stopPropagation();
	}

	ShowDateRange(event: Event) {
		//console.log(event);

		// event.stopImmediatePropagation();
		// event.stopPropagation();
		this.datePicker.Show();
	}

	loadMore(event) {
		console.log('Load More!');
		if (!this.ended && !this.loadingMoreAgents && !this.selectedGroups.length) {
			//console.log('Fetch More');
			this.loadingMoreAgents = true;
			this._utilityService.getMoreAgentsObs(this.agentList[this.agentList.length - 1].first_name).subscribe(response => {
				//console.log(response);
				this.agentList = this.agentList.concat(response.agents);
				this.ended = response.ended;
				this.loadingMoreAgents = false;
			});
		}
	}
	onSearch(value) {
		console.log('Search');
		// console.log(value);
		if (value) {
			if (!this.selectedGroups.length) {
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
			} else {
				let agents = this.agentList.filter(a => a.email.includes((value as string).toLowerCase()));
				this.agentList = agents;
			}
			// this.agentList = agents;
		} else {
			this.agentList = this.agentList_original;
			this.ended = false;
			// this.setScrollEvent();
		}
	}

	ApplyFilter(reload = false) {
		// console.log(this.clause);
		
		let filters = {
			priority: this.selectedItems,
			state: this.selectedStatus,
			assigned_to: this.selectedAgents,
			// tags: this.selectedTags,
			contactNames: [],
			source: [],
			createdDate: [],
			group: this.selectedGroups,
			daterange: this.daterange
		}
		let matchObject: any = {};
		Object.keys(filters).map(key => {
			//console.log(key + ' ' + JSON.stringify(filters[key]));
			if (filters[key]) {
				if (Array.isArray(filters[key]) && filters[key].length) {
					Object.assign(matchObject, { [key]: filters[key] });
				} else if (!Array.isArray(filters[key]) && Object.keys(filters[key]).length) {
					Object.assign(matchObject, { [key]: filters[key] });
				}
			}
		});
		this.dynamicFields.map((field, index) => {
			if ((!Array.isArray(field.value) && field.value)) {
				//if (!matchObject.dynamicFields) matchObject.dynamicFields = {};
				matchObject[`dynamicFields.${field.name}`] = field.value;
			}
			else if (field.value && field.value.length) {
				//if (!matchObject.dynamicFields) matchObject.dynamicFields = {};
				// console.log(field);
				matchObject[`dynamicFields.${field.name}`] = field.value.map(val => { return val });
			}
		})
		let query = this.searchValue;
		//console.log(JSON.parse(JSON.stringify(matchObject)));
		let obj = {}
		if(this.clause =='$and' ){
			obj = { filter: matchObject, clause: this.clause, query: query, sortBy: this.sortBy, assignType: (!this.selectedAgents.length) ? this.agentAssignType : 'all', groupAssignType: (!this.selectedGroups.length) ? this.groupAssignType : 'all' ,mergeType : this.mergeType,reload: reload };
		}else{
			obj = { filter: matchObject, clause: this.clause, query: query, sortBy: this.sortBy, assignType: this.agentAssignType , groupAssignType:  this.groupAssignType,mergeType : this.mergeType,reload: reload };
		}
		// console.log(obj);
		
		this._ticketService.saveFiltersOnLocalStorage(obj);
		return obj;
		
	}


	// GetCommaSeparatedIDs(ids) {
	// 	// console.log(ids);
		
	// 	// let id = (ids as string).split(' ').join();
	// 	this.IDs = ids.split(',');
	// 	this.IDs = this.IDs.filter(id => { return ((id)) })
	// 	this._ticketService.Filters.next(this.ApplyFilter());
	// }

}
