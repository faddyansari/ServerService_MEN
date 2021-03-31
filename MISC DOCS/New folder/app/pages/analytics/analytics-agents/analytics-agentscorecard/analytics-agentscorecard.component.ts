import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../../services/AuthenticationService';
import { AnalyticsService } from '../../../../../services/AnalyticsService';
import { UtilityService } from '../../../../../services/UtilityServices/UtilityService';
import { TicketAutomationService } from '../../../../../services/LocalServices/TicketAutomationService';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-analytics-agentscorecard',
	templateUrl: './analytics-agentscorecard.component.html',
	styleUrls: ['./analytics-agentscorecard.component.css']
})
export class AnalyticsAgentscorecardComponent implements OnInit {
	
	agent: any;
	subscriptions: Subscription[] = [];
	today = this.dateFormatter(new Date());

	//options for agent activity
	public agentsList = [];
	public groupList = [];
	public agentsList_original = [];
	ended = false;

	//chart variables
	dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	
	loading = false;
	selectedAgents = [];
	selectedGroups = [];
	selectedDate = {
		from: this.dateFormatter(new Date()),
		to: this.dateFormatter(new Date())
	}
	scorecardData: any = [];
	filterType = 'agent';
	permissions: any;

	constructor(_authService: AuthService, public _analyticsService: AnalyticsService, public _utilityService: UtilityService, _ticketGroupService: TicketAutomationService) {
		this.subscriptions.push(_authService.getAgent().subscribe(agent => {
			this.agent = agent;
			// console.log(this.agent);	
		}));
		this.subscriptions.push(_authService.getSettings().subscribe(settings => {
			// console.log(settings);	
			if (settings) {
				this.permissions = settings.permissions.analytics;
			}
		}));

		this.subscriptions.push(this._utilityService.getAllAgentsListObs().subscribe(agentsList => {
			this.agentsList = agentsList;
			this.agentsList_original = agentsList;
		}));
		this.subscriptions.push(_ticketGroupService.Groups.subscribe(data => {
			if (data) {
				this.groupList = data.map(g => g.group_name);
			}
			// console.log(this.groupList);
		}));
	}

	ngOnInit() {
	}

	ngAfterViewInit(){
		setTimeout(() => {
			if (localStorage.getItem('analytics-agentscorecard')) {
				let obj = JSON.parse(localStorage.getItem('analytics-agentscorecard'));
				this.selectedDate = obj.selectedDate;
				this.selectedAgents = obj.selectedAgents;
				this.selectedGroups = obj.selectedGroups;
				this.filterType = obj.filterType;
			}
			this.onFilterResult();
		}, 0);
	}

	onFilterResult() {
		this.loading = true;		
		// this.populateHourlyData(data);
		let packet =
		{
			selectedDate: this.selectedDate,
			selectedAgents: this.selectedAgents,
			selectedGroups: this.selectedGroups,
			filterType : this.filterType
		};
		localStorage.setItem('analytics-agentscorecard', JSON.stringify(packet));
		this.GetScorecard().then(result => {
			this.scorecardData = result;
			this.loading = false;
		});
	}

	GetScorecard(): Promise<any> {
		return new Promise((resolve, reject) => {
			if (this.filterType == 'agent') {
				let packet =
				{
					"obj":
					{
						"nsp": this.agent.nsp,
						"agents": (!this.selectedAgents.length) ? [this.agent.email] : this.selectedAgents,
						// "nsp": "/sbtjapaninquiries.com",
						// "agents": ["jjaved9481@sbtjapan.com"],
						"from": new Date(this.selectedDate.from).toISOString(),
						"to": new Date(this.selectedDate.to).toISOString(),
						"timezone": this._analyticsService.timeZone
					}
				};
				// console.log(packet);
				this._analyticsService.GetScorecardData(packet).subscribe(response => {
					// console.log(response);
					if (response && response['Response Time'] && response['Response Time'].length) {
						resolve(response['Response Time']);
					} else {
						resolve([]);
					}
				}, err => {
					reject([]);
				});
			} else {
				this._utilityService.getAgentsAgainstGroup(this.selectedGroups).subscribe(result => {
					let packet =
					{
						"obj":
						{
							"nsp": this.agent.nsp,
							"agents": result.map(a => a.email),
							// "nsp": "/sbtjapaninquiries.com",
							// "agents": ["jjaved9481@sbtjapan.com"],
							"from": new Date(this.selectedDate.from).toISOString(),
							"to": new Date(this.selectedDate.to).toISOString(),
							"timezone": this._analyticsService.timeZone
						}
					};
					// console.log(packet);
					this._analyticsService.GetScorecardData(packet).subscribe(response => {
						// console.log(response);
						if (response && response['Response Time'] && response['Response Time'].length) {
							resolve(response['Response Time']);
						} else {
							resolve([]);
						}
					}, err => {
						reject([]);
					});
				});
			}
		})
	}

	Export(id) {
		console.log('Exporting...');
		// console.log(this.agentTableData);

		this._analyticsService.exportHTMLToExcel(id, id + '-' + new Date().getTime());
	}

	onItemSelect(event) {
		this.selectedAgents = event;
	}
	onItemDeSelect(event) {
		this.selectedAgents = event;
	}
	onGroupSelect(event) {
		this.selectedGroups = (Array.isArray(event)) ? event : [event];
	}
	onGroupDeSelect(event) {
		// if(Array.isArray(event))
		this.selectedGroups = (Array.isArray(event)) ? event : [event];
	}

	loadMore($event) {
		// console.log('Scroll');
		if (!this.ended) {
			// console.log('Fetch More');
			this._utilityService.getMoreAgentsObs(this.agentsList[this.agentsList.length - 1].first_name).subscribe(response => {
				// console.log(response);
				this.agentsList = this.agentsList.concat(response.agents);
				this.ended = response.ended;
			});
		}
	}
	onSearch(value) {
		// console.log('Search');
		// console.log(value);
		if (value) {
			let agents = this.agentsList_original.filter(a => a.email.includes((value as string).toLowerCase()));
			this._utilityService.SearchAgent(value).subscribe((response) => {
				//console.log(response);
				if (response && response.agentList.length) {
					response.agentList.forEach(element => {
						if (!agents.filter(a => a.email == element.email).length) {
							agents.push(element);
						}
					});
				}
				this.agentsList = agents;
			});
			// this.agentsList = agents;
		} else {
			this.agentsList = this.agentsList_original;
			this.ended = false;
			// this.setScrollEvent();
		}
	}

	dateFormatter(d) {
		return d.getFullYear() + '-' + ("0" + (d.getMonth() + 1)).slice(-2) + '-' + ("0" + d.getDate()).slice(-2) + "T00:00";
	}
	ISOFormat(d: Date) {
		return d.getFullYear() + '-' + ("0" + (d.getMonth() + 1)).slice(-2) + '-' + ("0" + d.getDate()).slice(-2) + "T" + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) + ":00.000Z";
	}
	time_convert(num) {
		let str = '';
		if (num) {
			if(Math.floor(num / 60)) str += Math.floor(num / 60) + "hr ";

			str += ("0" + (Math.round(num % 60))).slice(-2) + "m";
		}
		return (str) ? str : '0hr 0m';
	}
	time_convert_sec(num) {
		let str = '';
		if (num) {
			str += Math.round(num * 60) + "s";
		}
		return (str) ? str : '0s';
	}
	showPercentage(number) {
		return Math.round(number * 100)
	}

	toggle() {
		(this.filterType == 'agent') ? this.filterType = 'group' : this.filterType = 'agent';
	}
	ngOnDestroy() {
		this.subscriptions.forEach(subsription => {
			subsription.unsubscribe();
		});
	}

}
