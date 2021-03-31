import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { UtilityService } from '../../../../services/UtilityServices/UtilityService';
import { TicketAutomationService } from '../../../../services/LocalServices/TicketAutomationService';
import { AgentService } from '../../../../services/AgentService';

@Component({
	selector: 'app-agent-filters',
	templateUrl: './agent-filters.component.html',
	styleUrls: ['./agent-filters.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class AgentFiltersComponent implements OnInit {

	private subscriptions: Subscription[] = [];
	//Inputs
	public selectedAgents = [];
	public selectedGroups = [];
	sortBy = {
		name: 'first_name',
		type: '1'
	};
	agentStatus = 'all';
	public agentList = [];
	public agentList_original = [];
	public groupList = [];
	ended = false;
	loadingMoreAgents = false;
	clearing = false;
	agent: any;
	filterList : any;

	constructor(private _utilityService: UtilityService,private _agentService: AgentService,private _ticketAutomationService: TicketAutomationService) { 
		this.subscriptions.push(this._utilityService.getAllAgentsListObs().subscribe(agents => {
			if (agents) {
				this.agentList = agents;
				this.agentList_original = agents;
			}
		}));
		this.subscriptions.push(this._ticketAutomationService.Groups.subscribe(groups => {
			if (groups) {
				this.groupList = groups.map(g => g.group_name);
			}
		}));
		this.subscriptions.push(this._agentService.Filters.subscribe(filters => {
			this.filterList = filters;
			// console.log('Subscription: ');
			// console.log(filters);
			if (filters.filter) {
				// console.log(filters);
				this.sortBy = filters.sortBy;
				if (Object.keys(filters.filter).length) {
					Object.keys(filters.filter).map(key => {
						if (key == 'agents') this.selectedAgents = filters.filter[key];
						if (key == 'groups') this.selectedGroups = filters.filter[key];
						if (key == 'status') this.agentStatus = filters.filter[key];
					});
				} else {
					this.selectedAgents = [];
					this.selectedGroups = [];
				}

				if (this.clearing) {
					this.clearing = false;
				}

			}

		}));
	}

	ngOnInit() {
	}

	updateSort() {
		this._agentService.Filters.next(this.ApplyFilter());
	}
	changeStatus(){
		this._agentService.Filters.next(this.ApplyFilter());
	}
	Reload() {
		this._agentService.Filters.next(this.ApplyFilter(true));
	}
	CloseFilter(){
		this._agentService.filterDrawer.next(false);
	}
	ClearFields() {
		// console.log(this.sortBy);

		if (this.clearing) return;
		if (!this.CheckFiltersEmpty()) {
			this.clearing = true;
			this._agentService.Filters.next({ filter: {}, sortBy: { name: 'first_name', type: '1' } });
			this.sortBy = {
				name: 'first_name',
				type: '1'
			},
			this.agentStatus = 'all';
		}

	}
	CheckFiltersEmpty() {
		let filtersEmpty = true;

		if(this.selectedAgents.length) return;
		if(this.selectedGroups.length) return;

		if (this.filterList && Object.keys(this.filterList).length) {
			Object.keys(this.filterList.filter).map(key => {
				if (this.filterList.filter[key] && this.filterList.filter[key].length) filtersEmpty = false;
			});
		}

		return filtersEmpty;

	}
	onItemSelect(event: any) {
		this._agentService.Filters.next(this.ApplyFilter());
		//See if selectedGroups has some value
		if (this.selectedGroups.length) {
			//Then get the agents of that group
			//If more than one group selected then merge the two agentlists
			this._utilityService.getAgentsAgainstGroup(this.selectedGroups).subscribe(agents => {
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
	onDeSelect(event: any) {
		this._agentService.Filters.next(this.ApplyFilter());
		//See if selectedGroups has some value
		if (this.selectedGroups.length) {
			//Then get the agents of that group
			//If more than one group selected then merge the two agentlists
			this._utilityService.getAgentsAgainstGroup(this.selectedGroups).subscribe(agents => {
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

	ApplyFilter(reload = false) {
		let filters = {
			agents: this.selectedAgents,
			groups: this.selectedGroups,
			status: this.agentStatus
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
		// console.log('Save: ');
		// console.log(matchObject);
		//console.log(JSON.parse(JSON.stringify(matchObject)));
		return { filter: matchObject, sortBy: this.sortBy, reload: reload }
	}

}
