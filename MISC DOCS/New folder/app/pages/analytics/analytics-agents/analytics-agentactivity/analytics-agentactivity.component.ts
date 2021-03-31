import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../../services/AuthenticationService';
import { AnalyticsService } from '../../../../../services/AnalyticsService';
import { UtilityService } from '../../../../../services/UtilityServices/UtilityService';
import { TicketAutomationService } from '../../../../../services/LocalServices/TicketAutomationService';

@Component({
	selector: 'app-analytics-agentactivity',
	templateUrl: './analytics-agentactivity.component.html',
	styleUrls: ['./analytics-agentactivity.component.scss']
})
export class AnalyticsAgentactivityComponent implements OnInit {

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

	availabilityHoursData: any = [];
	scorecardData: any = [];

	filterType = 'agent';
	permissions: any;
	graphData: any = {

	};
	hourlyData: any = [];
	hourlyToggle = false;
	agentSelectedSilent = [];

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

	ngAfterViewInit() {
		setTimeout(() => {
			if (localStorage.getItem('analytics-agentactivity')) {
				let obj = JSON.parse(localStorage.getItem('analytics-agentactivity'));
				this.selectedDate = obj.selectedDate;
				this.selectedAgents = obj.selectedAgents;
				this.selectedGroups = obj.selectedGroups;
				this.hourlyToggle = obj.hourlyToggle;
				this.filterType = obj.filterType
			}
			this.onFilterResult();
		}, 0);
	}

	onFilterResult() {
		this.loading = true;
		// this.populateHourlyData(data);
		// if(!this.selectedAgents.length){
		// 	this.selectedAgents = [this.agent.email]
		// }
		let packet =
		{
			selectedDate: this.selectedDate,
			selectedAgents: this.selectedAgents,
			selectedGroups: this.selectedGroups,
			hourlyToggle: this.hourlyToggle,
			filterType : this.filterType
		};
		localStorage.setItem('analytics-agentactivity', JSON.stringify(packet));
		Promise.all([this.GetAgentActivity(), this.GetHourlyActivity()]).then(result => {
			if (this.hourlyToggle) {
				this.populateHourlyData(result[1]);
				this.availabilityHoursData = [];
			} else {
				this.availabilityHoursData = result[0];
				this.populateHourlyData([]);
			}
			this.loading = false;
		})
	}

	populateHourlyData(data) {
		// console.log(this.selectedAgents);
		// console.log(data);
		if (this.hourlyToggle) {
			let todayDate = new Date(this.selectedDate.from.split('T')[0] + "T00:00");
			this.graphData = {

			};
			this.agentSelectedSilent.forEach(agent => {
				Object.assign(this.graphData, { [agent]: [] });
			})
			data.forEach((d, index) => {
				if (this.graphData[d.email]) {

					d.createdDate = new Date(d.createdDate);

					if(d.createdDate < todayDate){
						d.createdDate = todayDate
					}

					if (data[index + 1] && d.email == data[index + 1].email) {
						if (!d.endingDate && !data[index + 1].endingDate && data[index + 1].idleStart) {
							d.endingDate = data[index + 1].idleStart;
						}

						if(d.endingDate && data[index + 1].endingDate && d.endingDate == data[index + 1].endingDate && data[index + 1].idleStart){
							d.endingDate = data[index + 1].idleStart;
						}
					}
					let maxDate =  new Date(this.selectedDate.from.split('T')[0] + 'T23:59');
					if (d.endingDate) {						
						d.endingDate = new Date(d.endingDate);
						if(d.endingDate > maxDate){
							d.endingDate = maxDate;
						}
					} else {
						if(maxDate > new Date()){
							d.endingDate = new Date()
						}else{
							d.endingDate = maxDate;
						}
					};
					if (d.idleStart) {
						d.idleStart = new Date(d.idleStart);
						if(d.idleStart > maxDate){
							d.idleStart = maxDate;
						}
						if(d.idleStart < todayDate){
							d.idleStart = todayDate;
						}

					}
					if (d.idleEnd) {
						d.idleEnd = new Date(d.idleEnd);
						if(d.idleEnd > maxDate){
							d.idleEnd = maxDate;
						}
						if(d.idleEnd < todayDate){
							d.idleEnd = todayDate
						}
					};

					if (d.idleStart) {
						if (d.createdDate.toString() != d.idleStart.toString()) {
							if (index == 0) {
								let diff = ((d.idleStart.getTime() - d.createdDate.getTime()) / 1000) / 60;
								this.graphData[d.email].push({
									type: 'active',
									span: (d.createdDate.toLocaleTimeString()) + ' - ' + (d.idleStart.toLocaleTimeString()),
									duration: Math.round(diff),
									width: (diff / 1440) * 100,
									left : ((((d.createdDate.getTime() - todayDate.getTime()) / 1000) / 60) / 1440) * 100
								})
								if (d.idleEnd) {
									diff = ((d.idleEnd.getTime() - d.idleStart.getTime()) / 1000) / 60;
									this.graphData[d.email].push({
										type: 'idle',
										span: (d.idleStart.toLocaleTimeString()) + ' - ' + (d.idleEnd.toLocaleTimeString()),
										duration: Math.round(diff),
										width: (diff / 1440) * 100,
										left : ((((d.idleStart.getTime() - todayDate.getTime()) / 1000) / 60) / 1440) * 100
									});
									if (d.idleEnd.getTime() < d.endingDate.getTime()) {
										diff = ((d.endingDate.getTime() - d.idleEnd.getTime()) / 1000) / 60;
										this.graphData[d.email].push({
											type: 'active',
											span: d.idleEnd.toLocaleTimeString() + ' - ' + d.endingDate.toLocaleTimeString(),
											duration: Math.round(diff),
											width: (diff / 1440) * 100,
											left : ((((d.idleEnd.getTime() - todayDate.getTime()) / 1000) / 60) / 1440) * 100
										});
									}
								} else {
									let diff = ((d.endingDate.getTime() - d.idleStart.getTime()) / 1000) / 60;
									this.graphData[d.email].push({
										type: 'idle',
										span: (d.idleStart.toLocaleTimeString()) + ' - ' + (d.endingDate.toLocaleTimeString()),
										duration: Math.round(diff),
										width: (diff / 1440) * 100,
										left : ((((d.idleStart.getTime() - todayDate.getTime()) / 1000) / 60) / 1440) * 100
									});
								}
							} else if (d.createdDate.toString() == data[index - 1].createdDate.toString() && d.email == data[index - 1].email) {
								if (d.idleEnd) {
									let diff = ((d.idleEnd.getTime() - d.idleStart.getTime()) / 1000) / 60;
									this.graphData[d.email].push({
										type: 'idle',
										span: (d.idleStart.toLocaleTimeString()) + ' - ' + (d.idleEnd.toLocaleTimeString()),
										duration: Math.round(diff),
										width: (diff / 1440) * 100,
										left : ((((d.idleStart.getTime() - todayDate.getTime()) / 1000) / 60) / 1440) * 100
									});
									if (d.idleEnd.getTime() < d.endingDate.getTime()) {
										diff = ((d.endingDate.getTime() - d.idleEnd.getTime()) / 1000) / 60;
										this.graphData[d.email].push({
											type: 'active',
											span: d.idleEnd.toLocaleTimeString() + ' - ' + d.endingDate.toLocaleTimeString(),
											duration: Math.round(diff),
											width: (diff / 1440) * 100,
											left : ((((d.idleEnd.getTime() - todayDate.getTime()) / 1000) / 60) / 1440) * 100
										});
									}
								} else {
									let diff = ((d.endingDate.getTime() - d.idleStart.getTime()) / 1000) / 60;
									this.graphData[d.email].push({
										type: 'idle',
										span: (d.idleStart.toLocaleTimeString()) + ' - ' + (d.endingDate.toLocaleTimeString()),
										duration: Math.round(diff),
										width: (diff / 1440) * 100,
										left : ((((d.idleStart.getTime() - todayDate.getTime()) / 1000) / 60) / 1440) * 100
									});
								}
							} else {
								let diff = ((d.idleStart.getTime() - d.createdDate.getTime()) / 1000) / 60;
								this.graphData[d.email].push({
									type: 'active',
									span: (d.createdDate.toLocaleTimeString()) + ' - ' + (d.idleStart.toLocaleTimeString()),
									duration: Math.round(diff),
									width: (diff / 1440) * 100,
									left : ((((d.createdDate.getTime() - todayDate.getTime()) / 1000) / 60) / 1440) * 100
								});
								if (d.idleEnd) {
									diff = ((d.idleEnd.getTime() - d.idleStart.getTime()) / 1000) / 60;
									this.graphData[d.email].push({
										type: 'idle',
										span: (d.idleStart.toLocaleTimeString()) + ' - ' + (d.idleEnd.toLocaleTimeString()),
										duration: Math.round(diff),
										width: (diff / 1440) * 100,
										left : ((((d.idleStart.getTime() - todayDate.getTime()) / 1000) / 60) / 1440) * 100
									});
									if (d.idleEnd.getTime() < d.endingDate.getTime()) {
										diff = ((d.endingDate.getTime() - d.idleEnd.getTime()) / 1000) / 60;
										this.graphData[d.email].push({
											type: 'active',
											span: d.idleEnd.toLocaleTimeString() + ' - ' + d.endingDate.toLocaleTimeString(),
											duration: Math.round(diff),
											width: (diff / 1440) * 100,
											left : ((((d.idleEnd.getTime() - todayDate.getTime()) / 1000) / 60) / 1440) * 100
										});
									}
								} else {
									diff = ((d.endingDate.getTime() - d.idleStart.getTime()) / 1000) / 60;
									this.graphData[d.email].push({
										type: 'idle',
										span: (d.idleStart.toLocaleTimeString()) + ' - ' + (d.endingDate.toLocaleTimeString()),
										duration: Math.round(diff),
										width: (diff / 1440) * 100,
										left : ((((d.idleStart.getTime() - todayDate.getTime()) / 1000) / 60) / 1440) * 100
									});
								}
							}
						} else {
							if(d.idleEnd){
								let diff = ((d.idleEnd.getTime() - d.idleStart.getTime()) / 1000) / 60;
								this.graphData[d.email].push({
									type: 'idle',
									span: (d.idleStart.toLocaleTimeString()) + ' - ' + (d.idleEnd.toLocaleTimeString()),
									duration: Math.round(diff),
									width: (diff / 1440) * 100,
									left : ((((d.idleStart.getTime() - todayDate.getTime()) / 1000) / 60) / 1440) * 100
								});
								if (d.idleEnd.getTime() < d.endingDate.getTime()) {
									diff = ((d.endingDate.getTime() - d.idleEnd.getTime()) / 1000) / 60;
									this.graphData[d.email].push({
										type: 'active',
										span: d.idleEnd.toLocaleTimeString() + ' - ' + d.endingDate.toLocaleTimeString(),
										duration: Math.round(diff),
										width: (diff / 1440) * 100,
										left : ((((d.idleEnd.getTime() - todayDate.getTime()) / 1000) / 60) / 1440) * 100
									});
								}
							}else{
								let diff = ((d.endingDate.getTime() - d.idleStart.getTime()) / 1000) / 60;
								this.graphData[d.email].push({
									type: 'idle',
									span: (d.idleStart.toLocaleTimeString()) + ' - ' + (d.endingDate.toLocaleTimeString()),
									duration: Math.round(diff),
									width: (diff / 1440) * 100,
									left : ((((d.idleStart.getTime() - todayDate.getTime()) / 1000) / 60) / 1440) * 100
								});
							}
						}
					} else {
						let diff = ((d.endingDate.getTime() - d.createdDate.getTime()) / 1000) / 60;
						this.graphData[d.email].push({
							type: 'active',
							span: (d.createdDate.toLocaleTimeString()) + ' - ' + (d.endingDate.toLocaleTimeString()),
							duration: Math.round(diff),
							width: (diff / 1440) * 100,
							left : ((((d.createdDate.getTime() - todayDate.getTime()) / 1000) / 60) / 1440) * 100
						});
					}
				}
			});

			let transformedArray = [];

			Object.keys(this.graphData).map(key => {
				transformedArray.push({
					email: key,
					data: this.graphData[key]
				})
			});
			console.log(this.graphData)

			this.hourlyData = transformedArray;
		} else {
			this.hourlyData = [];
		}
		// console.log(this.hourlyData);
	}

	GetAgentActivity(): Promise<any> {
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
						"from": this.ISOFormat(new Date(this.selectedDate.from)),
						"to": this.ISOFormat(new Date(this.selectedDate.to)),
						"timezone": this._analyticsService.timeZone
					}
				};
				// console.log(packet);
				this._analyticsService.GetAvailabilityHours(packet).subscribe(response => {
					// console.log(response);
					if (response && response['Availablity Hours'] && response['Availablity Hours'].length) {
						resolve(response['Availablity Hours']);
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
							"from": this.ISOFormat(new Date(this.selectedDate.from)),
							"to": this.ISOFormat(new Date(this.selectedDate.to)),
							"timezone": this._analyticsService.timeZone
						}
					};
					// console.log(packet);
					this._analyticsService.GetAvailabilityHours(packet).subscribe(response => {
						// console.log(response);
						if (response && response['Availablity Hours'] && response['Availablity Hours'].length) {
							resolve(response['Availablity Hours']);
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
	GetHourlyActivity(): Promise<any> {
		return new Promise((resolve, reject) => {
			this.agentSelectedSilent = [];
			if (this.filterType == 'agent') {
				let packet =
				{
					"obj":
					{
						"nsp": this.agent.nsp,
						"agents": (!this.selectedAgents.length) ? [this.agent.email] : this.selectedAgents,
						// "nsp": "/sbtjapaninquiries.com",
						// "agents": ["jjaved9481@sbtjapan.com"],
						"from": this.ISOFormat(new Date(this.selectedDate.from)),
						"to": this.ISOFormat(new Date(this._analyticsService.AddDays(this.selectedDate.from, 1))),
						"timezone": this._analyticsService.timeZone
					}
				};
				// console.log(packet);
				this.agentSelectedSilent = packet.obj.agents;
				this._analyticsService.GetHourlyActivityData(packet).subscribe(response => {
					// console.log(response);
					if (response && response['data'] && response['data'].length) {
						resolve(response['data']);
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
							"from": this.ISOFormat(new Date(this.selectedDate.from)),
							"to": this.ISOFormat(new Date(this._analyticsService.AddDays(this.selectedDate.from, 1))),
							"timezone": this._analyticsService.timeZone
						}
					};
					// console.log(packet);
					this.agentSelectedSilent = packet.obj.agents;
					this._analyticsService.GetHourlyActivityData(packet).subscribe(response => {
						// console.log(response);
						if (response && response['data'] && response['data'].length) {
							resolve(response['data']);
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
	//HELPERS
	GetTotalHours(email, type) {
		let time = 0;
		this.hourlyData.forEach(d => {
			if (d.email == email) {
				d.data.forEach(element => {
					if (element.type == type) {
						time += element.duration
					}
				});
			}
		});
		// console.log(time);
		return this.time_convert(time);
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
			if (Math.floor(num / 60)) str += Math.floor(num / 60) + "hr ";

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
