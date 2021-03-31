import { Component, OnInit, ViewEncapsulation, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { DateRangePickerComponent } from '../../custom-components/date-range-picker/date-range-picker.component';
import { PopperContent } from 'ngx-popper';
import { AuthService } from '../../../services/AuthenticationService';
import { ChatService } from '../../../services/ChatService';
import { ChatSettingService } from '../../../services/LocalServices/ChatSettingService';
import { UtilityService } from '../../../services/UtilityServices/UtilityService';

@Component({
	selector: 'app-drawer-filters',
	templateUrl: './drawer-filters.component.html',
	styleUrls: ['./drawer-filters.component.scss'],
	providers: [
		ChatSettingService
	],
	encapsulation: ViewEncapsulation.None
})
export class DrawerFiltersComponent implements OnInit {

	@ViewChild('datePicker') datePicker: DateRangePickerComponent;
	@ViewChild('dateRangePopper') dateRangePopper: PopperContent
	private subscriptions: Subscription[] = [];
	//Inputs
	@Input('filters') filters: any = {};
	public selectedAgents = [];
	public selectedTags = [];
	public daterange: any = undefined;
	public userType = 'all';
	public chatType = 'all'
	public chatStatus = 'all'
	sortBy = {
		name: 'lastmodified',
		type: '-1'
	};

	public tagList: Array<any> = [];
	public agentList = [];
	public agentList_original = [];

	ended = false;
	loadingMoreAgents = false;
	clearing = false;
	permissions: any;
	agent: any;
	chatTagList: any

	textInputFilter: any = {
		clientID: '' as any,
		visitorEmail: '' as any,
		tickets: 'all' as any,
	}

	//Outputs
	@Output() onFetch = new EventEmitter();
	@Output() onClose = new EventEmitter();
	state: any;

	constructor(private _utilityService: UtilityService, private _chatSettingsService: ChatSettingService, private _authService: AuthService, private _chatService: ChatService) {
		// console.log(this.filters);

		_chatSettingsService.getChattSettingsFromBackend();

		this.subscriptions.push(_authService.getSettings().subscribe(data => {

			if (data && data.permissions) {
				this.permissions = data.permissions.chats;
			}

		}));

		this.subscriptions.push(this._utilityService.getAllAgentsListObs().subscribe(agents => {
			if (agents) {
				this.agentList = agents;
				this.agentList_original = agents;
			}
			// console.log(this.agentList);

		}));
		this.subscriptions.push(this._chatService.GetTagList().subscribe(tags => {
			this.tagList = tags.map(t => t.split('#')[1]);
			// console.log(this.tagList);
		}));
		this.subscriptions.push(this._authService.getAgent().subscribe(agent => {
			this.agent = agent;
			// console.log(this.agentList);
		}));

		this.subscriptions.push(_chatService.tagList.subscribe(data => {

			//this.chatTagList = data;
		}));
	}


	clearDate(event: Event) {
		event.stopImmediatePropagation();
		event.stopPropagation();
		this.daterange = undefined;
		this.ApplyFilter();
		// this._ticketService.Filters.next(this.ApplyFilter());
	}

	ShowDateRange(event: Event) {
		//console.log(event);

		// event.stopImmediatePropagation();
		// event.stopPropagation();
		this.datePicker.Show();
	}

	RemoveDuplicateTags(array) {
		let arr = {};
		array.map(value => { if (value.trim()) arr[value] = value.trim() });
		return Object.keys(arr);
	}

	updateFilter(event, key) {
		event.preventDefault();
		this.textInputFilter[key] = event.target.value;
		let commaseparatedTags = this.RemoveDuplicateTags((this.textInputFilter[key] as string).split(','));
		//console.log(commaseparatedTags);
		(commaseparatedTags && commaseparatedTags.length) ? this.textInputFilter[key] = commaseparatedTags : this.textInputFilter[key] = []
		this.ApplyFilter()

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
			this.ApplyFilter();
			// this._ticketService.Filters.next(this.ApplyFilter());
		}

	}

	userTypeChanged() {
		this.ApplyFilter();
	}
	chatTypeChanged() {
		this.ApplyFilter();
	}

	onItemSelect() {
		// console.log(this.selectedAgents);
		this.ApplyFilter();
	}
	onDeSelect() {
		// console.log(this.selectedAgents);
		this.ApplyFilter();
	}

	Reload() {
		this.ApplyFilter();
	}
	ClearFields() {
		if (this.clearing) return;
		if (!this.CheckFiltersEmpty()) {
			this.clearing = true;
			this.selectedAgents = [];
			this.selectedTags = [];
			this.daterange = undefined;
			this.userType = 'all';
			this.chatType = 'all';
			this.onFetch.emit({ filters: {} });
		}
	}
	updateSort() {
		this.ApplyFilter();
	}
	CheckFiltersEmpty() {
		let filtersEmpty = true;

		if (this.selectedAgents.length) return;
		if (this.selectedTags.length) return;
		if (this.daterange) return;

		if (this.filters && Object.keys(this.filters).length) {
			Object.keys(this.filters.filter).map(key => {
				if (this.filters.filter[key] && this.filters.filter[key].length) filtersEmpty = false;
			});
		}

		return filtersEmpty;

	}

	onEnter(event) {
		

		if (event.target && event.target.value) {
			if (this.chatTagList.indexOf(event.target.value) !== -1) {
				let hashTag = event.target.value.split('#')[1]
				if (this.selectedTags.indexOf(hashTag) === -1) {
					this.selectedTags.push(hashTag)
					this.ApplyFilter();
				}
			}
		}



	}

	onRemoveTag(i) {
	
		(this.selectedTags.indexOf(this.selectedTags[i]) !== -1) ? this.selectedTags.splice(this.selectedTags.indexOf(this.selectedTags[i])) : undefined
		this.ApplyFilter();
	}

	loadMore(event) {
		// console.log('Load More!');
		if (!this.ended && !this.loadingMoreAgents) {
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

	ApplyFilter() {

		// let state = [];
		switch (this.chatType) {
			case 'attended':
				this.state = [4];
				break;
			case 'unattended':
				this.state = [1];
				break;
			case 'ended':
				this.state = [3];
				break;
			default:
				this.state = [1, 4];
				break;
		}
		// console.log(state);
		// switch (this.chatStatus) {
		// 	case 'ended':
		// 		state = (state as Array<any>).filter(data => { return data != 4 })
		// 		if (!(state as Array<any>).includes(3)) state.push(3)
		// 		break;
		// 	case 'archived':
		// 		state = (state as Array<any>).filter(data => { return data != 3 })
		// 		break;
		// 	default:
		// 		if (!(state as Array<any>).includes(3)) state.push(3)
		// 		break;
		// }

		// console.log(state);

		let filters = {
			agentEmail: this.selectedAgents,
			tags: this.selectedTags,
			daterange: this.daterange,
			state: this.state,
		}
		Object.keys(this.textInputFilter).map(key => {
			filters[key] = this.textInputFilter[key];
		})
		//console.log(filters);

		this.onFetch.emit({ filters: filters, userType: this.userType, sortBy: this.sortBy });
	}



	ngOnInit() {
		
		if (this.filters.userType) {
			

			this.userType = this.filters.userType
		}
		if (this.filters.sortBy) {
			this.sortBy = this.filters.sortBy
		}

		if (this.filters.filter) {

			// this.userType = this.filters.userType;
			if (Object.keys(this.filters.filter).length) {
				Object.keys(this.filters.filter).map(key => {
					if ((key == 'tickets') || (key == 'clientID') || (key == 'visitorEmail')) this.textInputFilter[key] = this.filters.filter[key];
					if (key == 'agentEmail') this.selectedAgents = this.filters.filter[key];
					if (key == 'tags') this.selectedTags = this.filters.filter[key];
					if (key == 'chatType') this.chatType = this.filters.filter[key];
					if (key == 'daterange') this.daterange = {
						to: new Date(this.filters.filter[key].to),
						from: new Date(this.filters.filter[key].from)
					}
					if (key == 'state' && Array.isArray(this.filters.filter[key]) && this.filters.filter[key].length) {
						this.state = this.filters.filter[key];
						if (this.filters.filter.override) {
							if (this.filters.filter.state[0] == 1) {
								if (this.filters.filter.override.agentEmail && (this.filters.filter.override.agentEmail as Object).hasOwnProperty('$eq')) this.chatType = 'unattended';
								else if (this.filters.filter.override.agentEmail && (this.filters.filter.override.agentEmail as Object).hasOwnProperty('$ne')) this.chatType = 'attended';
								else if (this.filters.filter.override.agentEmail && (this.filters.filter.override.agentEmail as Object).hasOwnProperty('$exists')) this.chatType = 'all';
							}
						}
						else {
							if (this.ArrayEquals(this.state,[1])) this.chatType = 'unattended';
							else if (this.ArrayEquals(this.state,[4])) this.chatType = 'attended';
							else if (this.ArrayEquals(this.state,[3])) this.chatType = 'ended';
							else this.chatType = 'all'

						}
					}

					// if (key == 'userType') this.userType = this.filters.filter[key];
				});
			} else {
				this.selectedAgents = [];
				this.selectedTags = [];
				// this.userType = 'all';
			}
		}

		// this.selectedAgents = [this.agent.email];
	}

	ArrayEquals(arr1, arr2) {
		let equals = true
		if (Object.keys(arr1).length != Object.keys(arr2).length) return false
		Object.keys(arr1 as Array<any>).map((el, i) => {
			if (arr1[i] != arr2[i]) equals = false
		})
		return equals
	}

	ngOnDestroy() {
		this.subscriptions.forEach(subscription => {
			subscription.unsubscribe();
		});
		this._chatSettingsService.Destroy();
	}

	CloseFilter() {
		this.onClose.emit();
	}


}
