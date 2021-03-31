import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from '../../../../../services/AuthenticationService';
import { AnalyticsService } from '../../../../../services/AnalyticsService';
import * as Highcharts from 'highcharts';
require('highcharts/modules/exporting')(Highcharts);

@Component({
	selector: 'app-analytics-firstticketresponse',
	templateUrl: './analytics-firstticketresponse.component.html',
	styleUrls: ['./analytics-firstticketresponse.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class AnalyticsFirstticketresponseComponent implements OnInit {

	subscriptions: Subscription[] = [];
	loading = false;
	//HighChart Demo
	highcharts = Highcharts;
	options: any = {
		chart: {
			type: 'column',
			backgroundColor: '#f5f6f8'
		},
		title: {
			text: 'Ticket Response'
		},
		tooltip: {
			animation: false,
			useHTML: true,
			shadow: false,
			headerFormat: "<div style='text-align:center;font-weight:bold'>{point.key}</div>",
			pointFormatter: function(){
				var num = this.y;
				var days = Math.floor((num / 24) / 60);
				var hours = Math.floor((num / 60) % 24);  
				var minutes = Math.round(num % 60);
				var seconds = Math.round(num * 60 % 60);
				let str = (days) ? days + ' day ' : '';
				str += (hours) ? hours + " hr " : '';
				(minutes) ? str += minutes + ' min ' : '';
				(seconds) ? str += seconds + 's' : '';
				return  "<div>Ticket response: <b>"+ str +"</b></div>";
			}
		},
		colors: [
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
			},
			labels:{
				formatter: function(){
					var num = this.value;
					var days = Math.floor((num / 24) / 60);
					var hours = Math.floor((num / 60) % 24);  
					var minutes = Math.round(num % 60);
					var seconds = Math.round(num * 60 % 60);
					let str = (days) ? days + ' d ' : '';
					str += (hours) ? hours + " h " : '';
					(minutes) ? str += minutes + ' m ' : '';
					(seconds) ? str += seconds + 's' : '';
					return  str;
				}
			}
		},
		series: [{}]
	};
	chart: Highcharts.Chart;
	rendered = false;

	constructor(_authService: AuthService, public _analyticsService: AnalyticsService) {	
		this.subscriptions.push(_analyticsService.loading.subscribe(data => {
			this.loading = data;
		}));
		this.subscriptions.push(_analyticsService.options.subscribe(data => {
			if(this.rendered){
				if(data.title.text) {
					this.options.title.text = 'First Ticket Response (' + this.time_convert(data.title.text) + ')'
				}
				this.options.chart.type = data.chart.type;
				this.options.legend = data.legend;
				this.options.xAxis.categories = data.xAxis.categories;
				this.options.series = data.series;
				this.chart = new Highcharts.Chart("highchart", this.options);
			}
		}));
	}

	ngOnInit() {
		
	}

	onFilterResult(event){
		this._analyticsService.GetFirstTicketResponse(event.csid, event.selectedDateType,event.selectedDate, event.selectedAgents).subscribe(data => {
			// console.log(data.json());
			let totalResponse = 0;
			// this.table_visitors = [];
			let ticketIDs = [];
			// let temp = JSON.stringify(data);			
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
					data.json().forEach(element => {
						totalResponse += element.avgResTime;
					});
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
							element.ticketIDs.forEach(id => {
								ticketIDs = ticketIDs.concat(id);
							});
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
											s.value = element.avgResTime
										}
									});
								} else if (time >= 12) {
									let n = time - 12;
									secondHalf.forEach(s => {
										if (s.name == ((n == 0) ? 12 + ' PM' : n + ' PM')) {
											s.value = element.avgResTime
										}
									});
								}
							}
						})
						d.series = firstHalf.concat(secondHalf);
					});
					if (!data.json().length) {
						this._analyticsService.updateChart('column', daysData, 'dimensional', 'Response Time', true);
					} else {
						this._analyticsService.updateChart('column', daysData, 'dimensional', 'Response Time', false, totalResponse);
					}
				} else if (event.selectedComparison.match(/months/g)) {
					let monthsData = this._analyticsService.diffMonth(date1, date2);
					monthsData.forEach(m => {
						data.json().forEach(element => {
							element.ticketIDs.forEach(id => {
								ticketIDs = ticketIDs.concat(id);
							});
							if (m.name == this._analyticsService.monthNames[new Date(element._id).getMonth()]) {
								m.value += element.avgResTime;
							}
						});
						totalResponse += m.value;
					});
					if (!data.json().length) {
						this._analyticsService.updateChart('column', monthsData, 'flat', 'Response Time', true);
					} else {
						this._analyticsService.updateChart('column', monthsData, 'flat', 'Response Time', false, totalResponse);
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
							element.ticketIDs.forEach(id => {
								ticketIDs = ticketIDs.concat(id);
							});
							totalResponse += element.avgResTime;
							if (y.name == new Date(element._id).getFullYear().toString()) {
								let month = new Date(element._id).getMonth();
								monthsData.forEach(m => {
									if (m.name == this._analyticsService.monthNames[month]) {
										m.value += element.avgResTime;
									}
								});
							}
						})
						y.series = monthsData;
					});
					if (!data.json().length) {
						this._analyticsService.updateChart('column', yearsData, 'dimensional', 'Response Time', true);
					} else {
						this._analyticsService.updateChart('column', yearsData, 'dimensional', 'Response Time', false, totalResponse);
					}
				}
			} else {
				if (!event.selectedAgents.length) {
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
								// this.table_visitors.concat(element.ticketIDs);
								element.ticketIDs.forEach(id => {
									ticketIDs = ticketIDs.concat(id);
								});
								totalResponse += element.avgResTime;
								// let date = this._analyticsService.dateFormatter(new Date()) + 'T' + element._id + ':00:00.000Z';
								// let time = new Date(date).getHours();
								let time = Number(element._id);
								if (time < 12) {
									firstHalf.forEach(s => {
										if (s.name == ((time == 0) ? 12 + ' AM' : time + ' AM')) {
											s.value = element.avgResTime
										}
									});
								} else if (time >= 12) {
									let n = time - 12;
									secondHalf.forEach(s => {
										if (s.name == ((n == 0) ? 12 + ' PM' : n + ' PM')) {
											s.value = element.avgResTime
										}
									});
								}
							});
							if (!data.json().length) {
								this._analyticsService.updateChart('column', firstHalf.concat(secondHalf), 'flat', 'Response Time', true);
								// return;
							} else {
								this._analyticsService.updateChart('column', firstHalf.concat(secondHalf), 'flat', 'Response Time', false, totalResponse);
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
								element.ticketIDs.forEach(id => {
									ticketIDs = ticketIDs.concat(id);
								});
								totalResponse += element.avgResTime;
								graph_week.forEach(e => {
									let date = Number(element._id.split('-')[2]) + ' ' + this._analyticsService.monthNames[new Date(element._id).getMonth()] + ' ' + new Date(element._id).getFullYear();
									if (e.name == date) {
										e.value = element.avgResTime
									}
								});
							});
							if (!data.json().length) {
								this._analyticsService.updateChart('column', graph_week, 'flat', 'Response Time', true);
								// return;
							} else {
								this._analyticsService.updateChart('column', graph_week, 'flat', 'Response Time', false, totalResponse);
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
								element.ticketIDs.forEach(id => {
									ticketIDs = ticketIDs.concat(id);
								});
								totalResponse += element.avgResTime;
								graph_month.forEach(e => {
									let date = Number(element._id.split('-')[2]) + ' ' + this._analyticsService.monthNames[new Date(element._id).getMonth()] + ' ' + new Date(element._id).getFullYear();
									if (e.name == date) {
										e.value = element.avgResTime
									}
								});
							});
							if (!data.json().length) {
								this._analyticsService.updateChart('column', graph_month, 'flat', 'Response Time', true);
								// return;
							} else {
								this._analyticsService.updateChart('column', graph_month, 'flat', 'Response Time', false, totalResponse);
							}
							break;
						default:
							var date1 = new Date(event.selectedDate.from);
							var date2 = new Date(event.selectedDate.to);
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
									// this.table_visitors.concat(element.ticketIDs);
									element.ticketIDs.forEach(id => {
										ticketIDs = ticketIDs.concat(id);
									});
									totalResponse += element.avgResTime;
									// let date = this._analyticsService.dateFormatter(new Date()) + 'T' + element._id + ':00:00.000Z';
									// let time = new Date(date).getHours();
									let time = Number(element._id);
									if (time < 12) {
										firstHalf.forEach(s => {
											if (s.name == ((time == 0) ? 12 + ' AM' : time + ' AM')) {
												s.value = element.avgResTime
											}
										});
									} else if (time >= 12) {
										let n = time - 12;
										secondHalf.forEach(s => {
											if (s.name == ((n == 0) ? 12 + ' PM' : n + ' PM')) {
												s.value = element.avgResTime
											}
										});
									}
								});
								if (!data.json().length) {
									this._analyticsService.updateChart('column', firstHalf.concat(secondHalf), 'flat', 'Response Time', true);
									// return;
								} else {
									this._analyticsService.updateChart('column', firstHalf.concat(secondHalf), 'flat', 'Response Time', false, totalResponse);
								}
							} else if (this._analyticsService.daysBetween(date1, date2) < 16) {
								let graph_week = [];
								for (let i = this._analyticsService.daysBetween(date1, date2); i >= 0; i--) {
									let date = this._analyticsService.SubtractDays(new Date(), i);
									graph_week.push({
										name: date.getDate() + ' ' + this._analyticsService.monthNames[date.getMonth()] + ' ' + date.getFullYear(),
										value: 0
									});
								}
								data.json().forEach(element => {
									element.ticketIDs.forEach(id => {
										ticketIDs = ticketIDs.concat(id);
									});
									totalResponse += element.avgResTime;
									graph_week.forEach(e => {
										let date = Number(element._id.split('-')[2]) + ' ' + this._analyticsService.monthNames[new Date(element._id).getMonth()] + ' ' + new Date(element._id).getFullYear();
										if (e.name == date) {
											e.value = element.avgResTime
										}
									});
								});
								if (!data.json().length) {
									this._analyticsService.updateChart('column', graph_week, 'flat', 'Response Time', true);
									// return;
								} else {
									this._analyticsService.updateChart('column', graph_week, 'flat', 'Response Time', false, totalResponse);
								}
							} else {
								let graph_month = [];
								for (let i = this._analyticsService.daysBetween(date1, date2); i >= 0; i--) {
									let date = this._analyticsService.SubtractDays(new Date(), i);
									graph_month.push({
										name: date.getDate() + ' ' + this._analyticsService.monthNames[date.getMonth()] + ' ' + date.getFullYear(),
										value: 0
									});
								}
								data.json().forEach(element => {
									element.ticketIDs.forEach(id => {
										ticketIDs = ticketIDs.concat(id);
									});
									totalResponse += element.avgResTime;
									graph_month.forEach(e => {
										let date = Number(element._id.split('-')[2]) + ' ' + this._analyticsService.monthNames[new Date(element._id).getMonth()] + ' ' + new Date(element._id).getFullYear();
										if (e.name == date) {
											e.value = element.avgResTime
										}
									});
								});
								if (!data.json().length) {
									this._analyticsService.updateChart('column', graph_month, 'flat', 'Response Time', true);
									// return;
								} else {
									this._analyticsService.updateChart('column', graph_month, 'flat', 'Response Time', false, totalResponse);
								}
							}
							break;
					}
				} else {
					let graph_agents = [];

					switch (event.selectedDateType) {
						case 'today':
						case 'yesterday':
							event.selectedAgents.forEach(agent => {
								graph_agents.push({
									name: agent,
									series: []
								})
							});
							data.json().forEach(element => {
								totalResponse += element.avgResTime;
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
									element.ticketIDs.forEach(id => {
										ticketIDs = ticketIDs.concat(id);
									});
									totalResponse += element.avgResTime;
									// this.table_visitors.concat(element.ticketIDs);
									if (element.email == agent.name) {
										// console.log('Matched Agent');

										// let date = this._analyticsService.dateFormatter(new Date()) + 'T' + element._id + ':00:00.000Z';
										// let time = new Date(date).getHours();
										let time = Number(element._id);
										if (time < 12) {
											firstHalf.forEach(s => {
												if (s.name == ((time == 0) ? 12 + ' AM' : time + ' AM')) {
													s.value = element.avgResTime
												}
											});
										} else if (time >= 12) {
											let n = time - 12;
											secondHalf.forEach(s => {
												if (s.name == ((n == 0) ? 12 + ' PM' : n + ' PM')) {
													s.value = element.avgResTime
												}
											});
										}
									}
								});
								agent.series = firstHalf.concat(secondHalf);
							})
							if (!data.json().length) {
								this._analyticsService.updateChart('column', graph_agents, 'flat', 'Response Time', true);
								// return;
							} else {
								this._analyticsService.updateChart('column', graph_agents, 'agents', 'Response Time', false, totalResponse);
							}
							break;
						case 'week':
							event.selectedAgents.forEach(agent => {
								graph_agents.push({
									name: agent,
									value: 0
								})
							});
							data.json().forEach(element => {
								element.ticketIDs.forEach(id => {
									ticketIDs = ticketIDs.concat(id);
								});
								totalResponse += element.avgResTime;
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
									element.ticketIDs.forEach(id => {
										ticketIDs = ticketIDs.concat(id);
									});
									if (element.email == agent.name) {
										graph_week.forEach(e => {
											let date = Number(element._id.split('-')[2]) + ' ' + this._analyticsService.monthNames[new Date(element._id).getMonth()] + ' ' + new Date(element._id).getFullYear();
											if (e.name == date) {
												e.value = element.avgResTime
											}
										});
									}
									agent.series = graph_week;
								});
							});
							if (!data.json().length) {
								this._analyticsService.updateChart('column', graph_agents, 'flat', 'Response Time', true);
								// return;
							} else {
								this._analyticsService.updateChart('column', graph_agents, 'agents', 'Response Time', false, totalResponse);
							}
							break;
						case 'month':
							event.selectedAgents.forEach(agent => {
								graph_agents.push({
									name: agent,
									series: []
								})
							});
							data.json().forEach(element => {
								totalResponse += element.avgResTime;
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
									element.ticketIDs.forEach(id => {
										ticketIDs = ticketIDs.concat(id);
									});
									if (element.email == agent.name) {
										graph_month.forEach(e => {
											let date = Number(element._id.split('-')[2]) + ' ' + this._analyticsService.monthNames[new Date(element._id).getMonth()] + ' ' + new Date(element._id).getFullYear();
											if (e.name == date) {
												e.value = element.avgResTime
											}
										});
									}
									agent.series = graph_month;
								});

							});
							if (!data.json().length) {
								this._analyticsService.updateChart('column', graph_agents, 'flat', 'Response Time', true);
								// return;
							} else {
								this._analyticsService.updateChart('column', graph_agents, 'agents', 'Response Time', false, totalResponse);
							}
							// this.graph_totalChats = graph_agents;
							break;
						default:
							var date1 = new Date(event.selectedDate.from);
							var date2 = new Date(event.selectedDate.to);
							if (this._analyticsService.daysBetween(date1, date2) == 0 || this._analyticsService.daysBetween(date1, date2) == 1) {
								event.selectedAgents.forEach(agent => {
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
										// this.table_visitors.concat(element.ticketIDs);
										element.ticketIDs.forEach(id => {
											ticketIDs = ticketIDs.concat(id);
										});
										totalResponse += element.avgResTime;
										if (agent.name == element.email) {
											// let date = this._analyticsService.dateFormatter(new Date()) + 'T' + element._id + ':00:00.000Z';
											// let time = new Date(date).getHours();
											let time = Number(element._id);
											if (time < 12) {
												firstHalf.forEach(s => {
													if (s.name == ((time == 0) ? 12 + ' AM' : time + ' AM')) {
														s.value = element.avgResTime
													}
												});
											} else if (time >= 12) {
												let n = time - 12;
												secondHalf.forEach(s => {
													if (s.name == ((n == 0) ? 12 + ' PM' : n + ' PM')) {
														s.value = element.avgResTime
													}
												});
											}
										}
									});
									agent.series = firstHalf.concat(secondHalf);
								});
								if (!data.json().length) {
									this._analyticsService.updateChart('column', graph_agents, 'flat', 'Response Time', true);
									// return;
								} else {
									this._analyticsService.updateChart('column', graph_agents, 'agents', 'Response Time', false, totalResponse);
								}
							} else if (this._analyticsService.daysBetween(date1, date2) < 16) {
								event.selectedAgents.forEach(agent => {
									graph_agents.push({
										name: agent,
										value: 0
									})
								});
								graph_agents.forEach(agent => {
									let graph_week = [];
									for (let i = this._analyticsService.daysBetween(date1, date2); i >= 0; i--) {
										let date = this._analyticsService.SubtractDays(new Date(), i);
										graph_week.push({
											name: date.getDate() + ' ' + this._analyticsService.monthNames[date.getMonth()] + ' ' + date.getFullYear(),
											series: []
										});
									}
									data.json().forEach(element => {
										element.ticketIDs.forEach(id => {
											ticketIDs = ticketIDs.concat(id);
										});
										totalResponse += element.avgResTime;
										if (agent.name == element.email) {
											graph_week.forEach(e => {
												let date = Number(element._id.split('-')[2]) + ' ' + this._analyticsService.monthNames[new Date(element._id).getMonth()] + ' ' + new Date(element._id).getFullYear();
												if (e.name == date) {
													e.value = element.avgResTime
												}
											});
										}
										agent.series = graph_week;
									});
								})
								if (!data.json().length) {
									this._analyticsService.updateChart('column', graph_agents, 'flat', 'Response Time', true);
									// return;
								} else {
									this._analyticsService.updateChart('column', graph_agents, 'agents', 'Response Time', false, totalResponse);
								}
							} else {
								event.selectedAgents.forEach(agent => {
									graph_agents.push({
										name: agent,
										series: []
									})
								});
								graph_agents.forEach(agent => {
									let graph_month = [];
									for (let i = this._analyticsService.daysBetween(date1, date2); i >= 0; i--) {
										let date = this._analyticsService.SubtractDays(new Date(), i);
										graph_month.push({
											name: date.getDate() + ' ' + this._analyticsService.monthNames[date.getMonth()] + ' ' + date.getFullYear(),
											value: 0
										});
									}
									data.json().forEach(element => {
										element.ticketIDs.forEach(id => {
											ticketIDs = ticketIDs.concat(id);
										});
										totalResponse += element.avgResTime;
										if (agent.name == element.email) {
											graph_month.forEach(e => {
												let date = Number(element._id.split('-')[2]) + ' ' + this._analyticsService.monthNames[new Date(element._id).getMonth()] + ' ' + new Date(element._id).getFullYear();
												if (e.name == date) {
													e.value = element.avgResTime
												}
											});
										}
										agent.series = graph_month;
									});
								})
								if (!data.json().length) {
									this._analyticsService.updateChart('column', graph_agents, 'flat', 'Response Time', true);
									// return;
								} else {
									this._analyticsService.updateChart('column', graph_agents, 'agents', 'Response Time', false, totalResponse);
								}
							}
							break;
					}
				}
			}
			// this._analyticsService.GetTickets(ticketIDs);
			// console.log(this.graph_uniqueVisitors);				

		}, err => {
			// this._analyticsService.GetTickets([]);
			console.log('Error! Server unreachable.');
		});
	}

	ngAfterViewInit() {
		this.chart = new Highcharts.Chart("highchart", this.options);
		this.rendered = true;	
	}

	
	time_convert(num)
	{
		// num = Math.round(num); 
		var days = Math.floor((num / 24) / 60);
		var hours = Math.floor((num / 60) % 24);  
		var minutes = Math.round(num % 60);
		var seconds = Math.round(num * 60 % 60);
		let str = (days) ? days + ' day ' : '';
		str += (hours) ? hours + " hr " : '';
		(minutes) ? str += minutes + ' min ' : '';
		(seconds) ? str += seconds + ' s' : '';
		// console.log(str);
		
		return (str) ? str : '';    
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
		return this.time_convert(count);
	}

	Export(){
		console.log('Exporting...');
		// console.log(this.agentTableData);
		
		this._analyticsService.exportHTMLToExcel('ticketResponse', 'TicketResponse-'+new Date().getTime());
	}

	ngOnDestroy(){
		this.subscriptions.forEach(subscription => {
			subscription.unsubscribe();
		})
	}
	
}
