import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from '../../../../../services/AuthenticationService';
import { AnalyticsService } from '../../../../../services/AnalyticsService';
import { Subscription } from 'rxjs/Subscription';
import * as Highcharts from 'highcharts';
import { ChatService } from '../../../../../services/ChatService';
import { GlobalStateService } from '../../../../../services/GlobalStateService';
require('highcharts/modules/exporting')(Highcharts);


@Component({
	selector: 'app-analytics-totalchats',
	templateUrl: './analytics-totalchats.component.html',
	styleUrls: ['./analytics-totalchats.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class AnalyticsTotalchatsComponent implements OnInit {

	subscriptions: Subscription[] = [];
	loading = false;
	//HighChart Demo
	highcharts = Highcharts;
	additionalData : any;
	options: any = {
		accessibility:{
			enabled:true,
			description: 'This charts shows the total chats count'
		},
		chart: {
			type: 'column',
			backgroundColor: '#f5f6f8'
		},
		title: {
			text: 'Total Chats'
		},
		tooltip:{
			animation:false,
			useHTML: true,
			shadow: false,
			headerFormat: "<div style='text-align:center;font-weight:bold'>{point.key}</div>",
			pointFormat: "<div>{point.y} Total chats </div>"
		},
		plotOptions: {
			column: {
				events: {
					click: (event) => {
						let data = this.additionalData;
						let from = event.point.category;
						let to = event.point.category;
						let activeTab = "ARCHIVE"; 
						if(data.date == 'today' || data.date == 'yesterday'){
							from = this.customFormatter(new Date()); 
							to =  this.customFormatter(new Date()); 
							activeTab = "ARCHIVE";
						}else if(data.date.split(',').length == 3){
							// activeTab = "ARCHIVE"
							let details = data.date.split(',');
							from = details[1];
							to = details[2];
						}
						// console.log('From: ' + from);
						// console.log('To: ' + to);
						// console.log(this.selectedAgents);
						
						if(this.selectedAgents.length){
							this._chatService.Filters.next({
								filter: {
									daterange: { to: to, from: from },
									agentEmail: this.selectedAgents,
									override: { "agentEmail": { '$in': this.selectedAgents} ,
												"state": {'$exists': true}}
								}
							})
						}else{
							this._chatService.Filters.next({
								filter: {
									daterange: { to: to, from: from },
									override: { "agentEmail": { '$exists': true} ,
												"state": {'$exists': true}}
								}
							})
						}
						this._chatService.setActiveTab(activeTab);
						this._globalStateService.NavigateTo('/chats');
					}
				}
			}
		},
		colors:[
			"#4384ff",
			"#307F00",
			"#262687",
			"#4A3341",
			"#3B3B3B",
			"#009AC0",
			"#EA5F40",
			"#009C8E"
		],
		credits: {
			enabled: false
		},
		loading: {
			labelStyle: {
				fontSize: '16px',
				top: '40%'
			},
			style:{
				backgroundColor: "#f5f6f8"
			}
		},
		exporting:{
			enabled:true,
			buttons:{
				contextButton:{
					theme:{
						fill:'#f5f6f8'
					},
					menuItems:[
						"viewFullscreen", 
						"printChart", 
						"downloadPNG", 
						"downloadJPEG", 
						"downloadPDF", 
						"downloadSVG",
						"downloadCSV",
						"downloadXLS"
					]
				}
			}
		},
		legend: {
			enabled: false
		},
		xAxis: {
		},
		yAxis: {
			title: {
				text: ''
			}
		},
		series: [{}]
	};
	chart: Highcharts.Chart;
	rendered = false;
	selectedAgents = [];

	constructor(_authService: AuthService, public _analyticsService: AnalyticsService,private _globalStateService: GlobalStateService,
		private _chatService: ChatService) {
		this.subscriptions.push(_analyticsService.loading.subscribe(data => {
			this.loading = data;
		}));
		this.subscriptions.push(_analyticsService.selectedAgents.subscribe(data => {
			this.selectedAgents = data;
		}));
		this.subscriptions.push(_analyticsService.options.subscribe(data => {
			if(this.rendered){
				this.additionalData = data.additionalData;
				if(data.title.text) {
					this.options.title.text = 'Total Chats (' + data.title.text + ')'
				}else{
					this.options.title.text = 'Total Chats';
				}
				this.options.chart.type = data.chart.type;
				this.options.legend = data.legend;
				this.additionalData = data.additionalData;
				this.options.xAxis.categories = data.xAxis.categories;
				this.options.series = data.series;
				this.chart = new Highcharts.Chart("highchart", this.options);
			}
		}));
	}

	ngOnInit() {
	}
	onFilterResult(event){
		this._analyticsService.GetTotalChats(event.csid, event.selectedDateType,event.selectedDate, event.selectedAgents).subscribe(data => {
			let c_selectedAgents = JSON.parse(JSON.stringify(this.selectedAgents));
			this._analyticsService.selectedAgents.next(c_selectedAgents);
			let totalChats = 0;
			let assigned = 0;
			let unassigned = 0;
			let convIDs = [];
			data.json().forEach(element => {
				totalChats += element.TotalChats;
				assigned += element.Assigned;
				unassigned += element.Unassigned;
			});
			// console.log("Total: " + totalChats);
			// console.log("Assigned: " + assigned);
			// console.log("Unassigned: " + unassigned);
			
			if (event.comparison) {
				var date1 = new Date();
				var date2 = new Date();
				switch (event.selectedComparison) {
					case 'past_7_days':
						date1 = new Date(this._analyticsService.dateFormatter(this._analyticsService.SubtractDays(new Date(), 6)));
						break;
					case 'past_10_days':
						date1 = new Date(this._analyticsService.dateFormatter(this._analyticsService.SubtractDays(new Date(), 9)));
						break;
					case 'past_30_days':
						date1 = new Date(this._analyticsService.dateFormatter(this._analyticsService.SubtractDays(new Date(), 29)));
						break;
					case 'past_6_months':
						date1 = new Date(this._analyticsService.dateFormatter(this._analyticsService.SubtractMonths(new Date(), 5)));
						break;
					case 'past_years':
						date1 = new Date((event.year_from + "-" + ("0" + (new Date().getMonth() + 1)).slice(-2) + '-' + ("0" + new Date().getDate()).slice(-2)));
						date2 = new Date((event.year_to + "-" + ("0" + (new Date().getMonth() + 1)).slice(-2) + '-' + ("0" + new Date().getDate()).slice(-2)));
						break;
				}
				if (event.selectedComparison.match(/days/g)) {
					// console.log('Matches days');
					let daysData = [];
					for (let i = this._analyticsService.daysBetween(date1, date2) - 1; i >= 0; i--) {
						daysData.push({
							name: this._analyticsService.dayNames[new Date(this._analyticsService.dateFormatter(this._analyticsService.SubtractDays(date2, i))).getDay()] + " " + new Date(this._analyticsService.dateFormatter(this._analyticsService.SubtractDays(date2, i))).getDate(),
							series: []
						});
					}							
					daysData.forEach(d => {
						let firstHalf = [];
						let secondHalf = [];
						for (let i = 0; i < 12; i++) {
							firstHalf.push({
								"name": (i == 0) ? '12 AM' : i + ' AM',
								"value": 0
							});
						}
						for (let i = 0; i < 12; i++) {
							secondHalf.push({
								"name": (i == 0) ? '12 PM' : i + ' PM',
								"value": 0
							});
						}
						data.json().forEach(element => {
							element.convIDs.forEach(id => {
								convIDs = convIDs.concat(id);
							});
							// totalChats += element.TotalChats;
							// console.log(element._id)
							// console.log((this._analyticsService.dayNames[new Date(element._id).getDay()] + " " + new Date(element._id).getDate()));							
							let day = element._id;
							if (d.name == (this._analyticsService.dayNames[new Date(day).getDay()] + " " + new Date(day).getDate())) {
								// console.log('Matched!');
								// let date = this._analyticsService.dateFormatter(new Date()) + 'T' + element._id.split('T')[1].split(':')[0] + ':00:00.000Z';
								// console.log(date);																
								let time = new Date(day).getHours();

								if (time < 12) {
									firstHalf.forEach(s => {
										if (s.name == ((time == 0) ? 12 + ' AM' : time + ' AM')) {
											s.value = element.TotalChats
										}
									});
								} else if (time >= 12) {
									let n = time - 12;
									secondHalf.forEach(s => {
										if (s.name == ((n == 0) ? 12 + ' PM' : n + ' PM')) {
											s.value = element.TotalChats
										}
									});
								}
							}
						})
						d.series = firstHalf.concat(secondHalf);
					})
					if (!data.json().length) {
						this._analyticsService.updateChart('column', daysData, 'dimensional', 'Chats', true);
					} else {
						this._analyticsService.updateChart('column', daysData, 'dimensional', 'Chats', false, totalChats);
					}

				} else if (event.selectedComparison.match(/months/g)) {
					let monthsData = this._analyticsService.diffMonth(date1, date2);
					monthsData.forEach(m => {
						data.json().forEach(element => {
							element.convIDs.forEach(id => {
								convIDs = convIDs.concat(id);
							});
							if (m.name == this._analyticsService.monthNames[new Date(element._id).getMonth()]) {
								m.value += element.TotalChats;
							}
						});
						totalChats += m.value;
					});
					if (!data.json().length) {
						this._analyticsService.updateChart('column', monthsData, 'flat', 'Chats', true);
					} else {
						this._analyticsService.updateChart('column', monthsData, 'flat', 'Chats', false, totalChats);
					}
				} else if (event.selectedComparison.match(/years/g)) {
					// console.log('Matches months and years');
					let yearsData = this._analyticsService.diffYear(date1, date2, 'array');
					yearsData.forEach(y => {
						let monthsData = [];
						for (let i = 0; i <= this._analyticsService.monthNames.length - 1; i++) {
							monthsData.push({
								name: this._analyticsService.monthNames[i],
								value: 0
							})
						}
						data.json().forEach(element => {
							element.convIDs.forEach(id => {
								convIDs = convIDs.concat(id);
							});
							if (y.name == new Date(element._id).getFullYear().toString()) {
								let month = new Date(element._id).getMonth();
								monthsData.forEach(m => {
									if (m.name == this._analyticsService.monthNames[month]) {
										m.value += element.TotalChats;
									}
								});
							}
						})
						y.series = monthsData;
					});
					if (!data.json().length) {
						this._analyticsService.updateChart('column', yearsData, 'dimensional', 'Chats', true);
					} else {
						this._analyticsService.updateChart('column', yearsData, 'dimensional', 'Chats', false, totalChats);
					}
				}
			} else {
				if (!this.selectedAgents.length) {
					switch (event.selectedDateType) {
						case 'today':
						case 'yesterday':
							let firstHalf = [];
							let secondHalf = [];
							for (let i = 0; i < 12; i++) {
								firstHalf.push({
									"name": (i == 0) ? '12 AM' : i + ' AM',
									"value": 0
								});
							}
							for (let i = 0; i < 12; i++) {
								secondHalf.push({
									"name": (i == 0) ? '12 PM' : i + ' PM',
									"value": 0
								});
							}
							data.json().forEach(element => {
								// this.table_visitors.concat(element.convIDs);
								element.convIDs.forEach(id => {
									convIDs = convIDs.concat(id);
								});
								// let date = this._analyticsService.dateFormatter(new Date()) + 'T' + element._id + ':00:00.000Z';
								// let time = new Date(date).getHours();
								let time = Number(element._id);
								if (time < 12) {
									firstHalf.forEach(s => {
										if (s.name == ((time == 0) ? 12 + ' AM' : time + ' AM')) {
											s.value = element.TotalChats
										}
									});
								} else if (time >= 12) {
									let n = time - 12;
									secondHalf.forEach(s => {
										if (s.name == ((n == 0) ? 12 + ' PM' : n + ' PM')) {
											s.value = element.TotalChats
										}
									});
								}
							});
							if (!data.json().length) {
								this._analyticsService.updateChart('column', firstHalf.concat(secondHalf), 'flat', 'Chats', true);
								// return;
							} else {
								let  counts = {
									total: totalChats,
									assigned: assigned,
									unassigned: unassigned
								}
								this._analyticsService.updateChart('column', firstHalf.concat(secondHalf), 'flat', 'Chats', false, totalChats, counts);
							}
							break;
						case 'week':
							let graph_week = [];
							for (let i = 6; i >= 0; i--) {
								let date = this._analyticsService.SubtractDays(new Date(), i);
								graph_week.push({
									name: date.getDate() + ' ' + this._analyticsService.monthNames[date.getMonth()] + ' ' + date.getFullYear(),
									value: 0
								});
							}
							data.json().forEach(element => {
								element.convIDs.forEach(id => {
									convIDs = convIDs.concat(id);
								});
								graph_week.forEach(e => {
									let date = Number(element._id.split('-')[2]) + ' ' + this._analyticsService.monthNames[new Date(element._id).getMonth()] + ' ' + new Date(element._id).getFullYear();
									if (e.name == date) {
										e.value = element.TotalChats
									}
								});
							});
							if (!data.json().length) {
								this._analyticsService.updateChart('column', graph_week, 'flat', 'Chats', true);
								// return;
							} else {
								let  counts = {
									total: totalChats,
									assigned: assigned,
									unassigned: unassigned
								}
								this._analyticsService.updateChart('column', graph_week, 'flat', 'Chats', false, totalChats, counts);
							}
							break;
						case 'month':
							let graph_month = [];
							for (let i = 29; i >= 0; i--) {
								let date = this._analyticsService.SubtractDays(new Date(), i);
								graph_month.push({
									name: date.getDate() + ' ' + this._analyticsService.monthNames[date.getMonth()] + ' ' + date.getFullYear(),
									value: 0
								});
							}
							data.json().forEach(element => {
								element.convIDs.forEach(id => {
									convIDs = convIDs.concat(id);
								});
								graph_month.forEach(e => {
									let date = Number(element._id.split('-')[2]) + ' ' + this._analyticsService.monthNames[new Date(element._id).getMonth()] + ' ' + new Date(element._id).getFullYear();
									if (e.name == date) {
										e.value = element.TotalChats
									}
								});
							});
							// console.log(graph_month);
							if (!data.json().length) {
								this._analyticsService.updateChart('column', graph_week, 'flat', 'Chats', true);
								// return;
							} else {
								let  counts = {
									total: totalChats,
									assigned: assigned,
									unassigned: unassigned
								}
								this._analyticsService.updateChart('column', graph_month, 'flat', 'Chats', false, totalChats, counts);
							}
							break;
						default:
							var date1 = new Date(event.selectedDateType.from);
							var date2 = new Date(event.selectedDateType.to);
							if (this._analyticsService.daysBetween(date1, date2) == 0 || this._analyticsService.daysBetween(date1, date2) == 1) {
								let firstHalf = [];
								let secondHalf = [];
								for (let i = 0; i < 12; i++) {
									firstHalf.push({
										"name": (i == 0) ? '12 AM' : i + ' AM',
										"value": 0
									});
								}
								for (let i = 0; i < 12; i++) {
									secondHalf.push({
										"name": (i == 0) ? '12 PM' : i + ' PM',
										"value": 0
									});
								}
								data.json().forEach(element => {
									// this.table_visitors.concat(element.convIDs);
									element.convIDs.forEach(id => {
										convIDs = convIDs.concat(id);
									});
									// let date = this._analyticsService.dateFormatter(new Date()) + 'T' + element._id + ':00:00.000Z';
									// let time = new Date(date).getHours();
									let time = Number(element._id);
									if (time < 12) {
										firstHalf.forEach(s => {
											if (s.name == ((time == 0) ? 12 + ' AM' : time + ' AM')) {
												s.value = element.TotalChats
											}
										});
									} else if (time >= 12) {
										let n = time - 12;
										secondHalf.forEach(s => {
											if (s.name == ((n == 0) ? 12 + ' PM' : n + ' PM')) {
												s.value = element.TotalChats
											}
										});
									}
								});
								if (!data.json().length) {
									this._analyticsService.updateChart('column', firstHalf.concat(secondHalf), 'flat', 'Chats', true);
									// return;
								} else {
									let  counts = {
										total: totalChats,
										assigned: assigned,
										unassigned: unassigned
									}
									this._analyticsService.updateChart('column', firstHalf.concat(secondHalf), 'flat', 'Chats', false, totalChats, counts);
								}
							} else if (this._analyticsService.daysBetween(date1, date2) < 16) {
								let graph_week = [];
								for (let i = this._analyticsService.daysBetween(date1, date2); i >= 0; i--) {
									let date = this._analyticsService.SubtractDays(new Date(event.selectedDateType.to), i);
									graph_week.push({
										name: date.getDate() + ' ' + this._analyticsService.monthNames[date.getMonth()] + ' ' + date.getFullYear(),
										value: 0
									});
								}
								data.json().forEach(element => {
									element.convIDs.forEach(id => {
										convIDs = convIDs.concat(id);
									});
									graph_week.forEach(e => {
										let date = Number(element._id.split('-')[2]) + ' ' + this._analyticsService.monthNames[new Date(element._id).getMonth()] + ' ' + new Date(element._id).getFullYear();
										if (e.name == date) {
											e.value = element.TotalChats
										}
									});
								});
								if (!data.json().length) {
									this._analyticsService.updateChart('column', graph_week, 'flat', 'Chats', true);
									// return;
								} else {
									let  counts = {
										total: totalChats,
										assigned: assigned,
										unassigned: unassigned
									}
									this._analyticsService.updateChart('column', graph_week, 'flat', 'Chats', false, totalChats, counts);
								}
							} else {
								let graph_month = [];
								for (let i = this._analyticsService.daysBetween(date1, date2); i >= 0; i--) {
									let date = this._analyticsService.SubtractDays(new Date(event.selectedDateType.to), i);
									graph_month.push({
										name: date.getDate() + ' ' + this._analyticsService.monthNames[date.getMonth()] + ' ' + date.getFullYear(),
										value: 0
									});
								}
								data.json().forEach(element => {
									element.convIDs.forEach(id => {
										convIDs = convIDs.concat(id);
									});
									graph_month.forEach(e => {
										let date = Number(element._id.split('-')[2]) + ' ' + this._analyticsService.monthNames[new Date(element._id).getMonth()] + ' ' + new Date(element._id).getFullYear();
										if (e.name == date) {
											e.value = element.TotalChats
										}
									});
								});
								if (!data.json().length) {
									this._analyticsService.updateChart('column', graph_month, 'flat', 'Chats', true);
									// return;
								} else {
									let  counts = {
										total: totalChats,
										assigned: assigned,
										unassigned: unassigned
									}
									this._analyticsService.updateChart('column', graph_month, 'flat', 'Chats', false, totalChats, counts);
								}
							}
							break;
					}
				} else {
					let graph_agents = [];
					switch (event.selectedDateType) {
						case 'today':
						case 'yesterday':
							this.selectedAgents.forEach(agent => {
								graph_agents.push({
									name: agent,
									series: []
								})
							});
							graph_agents.forEach(agent => {
								let firstHalf = [];
								let secondHalf = [];
								for (let i = 0; i < 12; i++) {
									firstHalf.push({
										"name": (i == 0) ? '12 AM' : i + ' AM',
										"value": 0
									});
								}
								for (let i = 0; i < 12; i++) {
									secondHalf.push({
										"name": (i == 0) ? '12 PM' : i + ' PM',
										"value": 0
									});
								}
								data.json().forEach(element => {
									element.convIDs.forEach(id => {
										convIDs = convIDs.concat(id);
									});
									// this.table_visitors.concat(element.convIDs);
									if (element.email == agent.name) {
										// console.log('Matched Agent');

										// let date = this._analyticsService.dateFormatter(new Date()) + 'T' + element._id + ':00:00.000Z';
										// let time = new Date(date).getHours();
										let time = Number(element._id);
										if (time < 12) {
											firstHalf.forEach(s => {
												if (s.name == ((time == 0) ? 12 + ' AM' : time + ' AM')) {
													s.value = element.TotalChats
												}
											});
										} else if (time >= 12) {
											let n = time - 12;
											secondHalf.forEach(s => {
												if (s.name == ((n == 0) ? 12 + ' PM' : n + ' PM')) {
													s.value = element.TotalChats
												}
											});
										}
									}
								});
								agent.series = firstHalf.concat(secondHalf);
							})
							if (!data.json().length) {
								this._analyticsService.updateChart('column', graph_agents, 'flat', 'Chats', true);
								// return;
							} else {
								this._analyticsService.updateChart('column', graph_agents, 'agents', 'Chats', false, totalChats);
							}
							break;
						case 'week':
							this.selectedAgents.forEach(agent => {
								graph_agents.push({
									name: agent,
									value: 0
								})
							});
							data.json().forEach(element => {
								element.convIDs.forEach(id => {
									convIDs = convIDs.concat(id);
								});
							});

							graph_agents.forEach(agent => {
								let graph_week = [];
								for (let i = 6; i >= 0; i--) {
									let date = this._analyticsService.SubtractDays(new Date(), i);
									graph_week.push({
										name: date.getDate() + ' ' + this._analyticsService.monthNames[date.getMonth()] + ' ' + date.getFullYear(),
										value: 0
									});
								};
								data.json().forEach(element => {
									element.convIDs.forEach(id => {
										convIDs = convIDs.concat(id);
									});
									if (element.email == agent.name) {
										graph_week.forEach(e => {
											let date = Number(element._id.split('-')[2]) + ' ' + this._analyticsService.monthNames[new Date(element._id).getMonth()] + ' ' + new Date(element._id).getFullYear();
											if (e.name == date) {
												e.value = element.TotalChats
											}
										});
									}
									agent.series = graph_week;
								});
							});
							if (!data.json().length) {
								this._analyticsService.updateChart('column', graph_agents, 'flat', 'Chats', true);
								// return;
							} else {
								this._analyticsService.updateChart('column', graph_agents, 'agents', 'Chats', false, totalChats);
							}
							break;
						case 'month':
							this.selectedAgents.forEach(agent => {
								graph_agents.push({
									name: agent,
									series: []
								})
							});
							graph_agents.forEach(agent => {
								let graph_month = [];
								for (let i = 29; i >= 0; i--) {
									let date = this._analyticsService.SubtractDays(new Date(), i);
									graph_month.push({
										name: date.getDate() + ' ' + this._analyticsService.monthNames[date.getMonth()] + ' ' + date.getFullYear(),
										value: 0
									});
								}
								data.json().forEach(element => {
									element.convIDs.forEach(id => {
										convIDs = convIDs.concat(id);
									});
									if (element.email == agent.name) {
										graph_month.forEach(e => {
											let date = Number(element._id.split('-')[2]) + ' ' + this._analyticsService.monthNames[new Date(element._id).getMonth()] + ' ' + new Date(element._id).getFullYear();
											if (e.name == date) {
												e.value = element.TotalChats
											}
										});
									}
									agent.series = graph_month;
								});

							});
							if (!data.json().length) {
								this._analyticsService.updateChart('column', graph_agents, 'flat', 'Chats', true);
								// return;
							} else {
								this._analyticsService.updateChart('column', graph_agents, 'agents', 'Chats', false, totalChats);
							}
							// this.graph_totalChats = graph_agents;
							break;
						default:
							var date1 = new Date(event.selectedDateType.from);
							var date2 = new Date(event.selectedDateType.to);
							if (this._analyticsService.daysBetween(date1, date2) == 0 || this._analyticsService.daysBetween(date1, date2) == 1) {
								this.selectedAgents.forEach(agent => {
									graph_agents.push({
										name: agent,
										series: []
									})
								});
								graph_agents.forEach(agent => {
									let firstHalf = [];
									let secondHalf = [];
									for (let i = 0; i < 12; i++) {
										firstHalf.push({
											"name": (i == 0) ? '12 AM' : i + ' AM',
											"value": 0
										});
									}
									for (let i = 0; i < 12; i++) {
										secondHalf.push({
											"name": (i == 0) ? '12 PM' : i + ' PM',
											"value": 0
										});
									}
									data.json().forEach(element => {
										// this.table_visitors.concat(element.convIDs);
										element.convIDs.forEach(id => {
											convIDs = convIDs.concat(id);
										});
										if (agent.name == element.email) {
											// let date = this._analyticsService.dateFormatter(new Date()) + 'T' + element._id + ':00:00.000Z';
											// let time = new Date(date).getHours();
											let time = Number(element._id);
											if (time < 12) {
												firstHalf.forEach(s => {
													if (s.name == ((time == 0) ? 12 + ' AM' : time + ' AM')) {
														s.value = element.TotalChats
													}
												});
											} else if (time >= 12) {
												let n = time - 12;
												secondHalf.forEach(s => {
													if (s.name == ((n == 0) ? 12 + ' PM' : n + ' PM')) {
														s.value = element.TotalChats
													}
												});
											}
										}
									});
									agent.series = firstHalf.concat(secondHalf);
								});
								if (!data.json().length) {
									this._analyticsService.updateChart('column', graph_agents, 'flat', 'Chats', true);
									// return;
								} else {
									this._analyticsService.updateChart('column', graph_agents, 'agents', 'Chats', false, totalChats);
								}
							} else if (this._analyticsService.daysBetween(date1, date2) < 16) {
								this.selectedAgents.forEach(agent => {
									graph_agents.push({
										name: agent,
										value: 0
									})
								});
								graph_agents.forEach(agent => {
									let graph_week = [];
									for (let i = this._analyticsService.daysBetween(date1, date2); i >= 0; i--) {
										let date = this._analyticsService.SubtractDays(new Date(event.selectedDateType.to), i);
										graph_week.push({
											name: date.getDate() + ' ' + this._analyticsService.monthNames[date.getMonth()] + ' ' + date.getFullYear(),
											series: []
										});
									}
									data.json().forEach(element => {
										element.convIDs.forEach(id => {
											convIDs = convIDs.concat(id);
										});
										if (agent.name == element.email) {
											graph_week.forEach(e => {
												let date = Number(element._id.split('-')[2]) + ' ' + this._analyticsService.monthNames[new Date(element._id).getMonth()] + ' ' + new Date(element._id).getFullYear();
												if (e.name == date) {
													e.value = element.TotalChats
												}
											});
										}
										agent.series = graph_week;
									});
								})
								if (!data.json().length) {
									this._analyticsService.updateChart('column', graph_agents, 'flat', 'Chats', true);
									// return;
								} else {
									this._analyticsService.updateChart('column', graph_agents, 'agents', 'Chats', false, totalChats);
								}
							} else {
								this.selectedAgents.forEach(agent => {
									graph_agents.push({
										name: agent,
										series: []
									})
								});
								graph_agents.forEach(agent => {
									let graph_month = [];
									for (let i = this._analyticsService.daysBetween(date1, date2); i >= 0; i--) {
										let date = this._analyticsService.SubtractDays(new Date(event.selectedDateType.to), i);
										graph_month.push({
											name: date.getDate() + ' ' + this._analyticsService.monthNames[date.getMonth()] + ' ' + date.getFullYear(),
											value: 0
										});
									}
									data.json().forEach(element => {
										element.convIDs.forEach(id => {
											convIDs = convIDs.concat(id);
										});
										if (agent.name == element.email) {
											graph_month.forEach(e => {
												let date = Number(element._id.split('-')[2]) + ' ' + this._analyticsService.monthNames[new Date(element._id).getMonth()] + ' ' + new Date(element._id).getFullYear();
												if (e.name == date) {
													e.value = element.TotalChats
												}
											});
										}
										agent.series = graph_month;
									});
								})
								if (!data.json().length) {
									this._analyticsService.updateChart('column', graph_agents, 'flat', 'Chats', true);
									// return;
								} else {
									this._analyticsService.updateChart('column', graph_agents, 'agents', 'Chats', false, totalChats);
								}
							}
							break;
					}
				}
			}
			// let temp = JSON.stringify(data);												
			// this._analyticsService.GetConversations(convIDs);
			// console.log(this.graph_uniqueVisitors);				

		}, err => {
			// this._analyticsService.GetConversations([]);
			console.log('Error! Server unreachable.');
			// this.unreachable = true;
		});
	}
	ngAfterViewInit() {
		this.chart = new Highcharts.Chart("highchart", this.options);
		this.rendered = true;
	}
	
	showTotal(indexExists, index?){
		let count = 0;
		if(indexExists){
			this.options.series[index].data.forEach(element => {
				count += element;
			});
		}else{
			this.options.series.forEach(element => {
				count += element.data.reduce((a,b) => a + b , 0);
			});
		}
		return count;
	}

	Export(){
		console.log('Exporting...');
		// console.log(this.agentTableData);
		
		this._analyticsService.exportHTMLToExcel('totalChats', 'TotalChats-'+new Date().getTime());
	}

	customFormatter(date: Date) {
		return ("0" + (Number(date.getMonth()) + 1)).slice(-2) + '-' + ("0" + date.getDate()).slice(-2) + '-' + date.getFullYear();
	}

	ngOnDestroy(){
		this.subscriptions.forEach(subscription => {
			subscription.unsubscribe();
		})
	}

}









