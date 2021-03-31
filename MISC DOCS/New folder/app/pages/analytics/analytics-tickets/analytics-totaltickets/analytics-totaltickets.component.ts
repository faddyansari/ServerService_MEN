import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import * as Highcharts from 'highcharts';
import { AuthService } from '../../../../../services/AuthenticationService';
import { AnalyticsService } from '../../../../../services/AnalyticsService';
require('highcharts/modules/exporting')(Highcharts);

@Component({
	selector: 'app-analytics-totaltickets',
	templateUrl: './analytics-totaltickets.component.html',
	styleUrls: ['./analytics-totaltickets.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class AnalyticsTotalticketsComponent implements OnInit {

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
			text: 'Total Tickets'
		},
		tooltip: {
			animation: false,
			useHTML: true,
			shadow: false,
			headerFormat: "<div style='text-align:center;font-weight:bold'>{point.key}</div>",
			pointFormat: "<div>Tickets: {point.y}</div>"
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
					this.options.title.text = 'Total Tickets (' + data.title.text + ')'
				}else{
					this.options.title.text = 'Total Tickets';
				}
				this.options.chart.type = data.chart.type;
				this.options.legend = data.legend;
				this.options.xAxis.categories = data.xAxis.categories;
				this.options.series = data.series;
				this.chart = new Highcharts.Chart("highchart", this.options);
				// console.log(this.options.series);
				
			}
		}));
	}

	ngOnInit() {
	}
	onFilterResult(event){
		let totalTickets = 0;
		this._analyticsService.GetTotalTickets(event.csid,(event.comparison) ? event.selectedComparison :  event.selectedDateType, event.selectedDate, event.selectedAgents, event.selectedGroups).subscribe(data => {
			// console.log(data.json());
			
			data.json().forEach(element => {
				totalTickets += element['totalTickets'];
			});
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
					let daysData = [];
					for (let i = this._analyticsService.daysBetween(date1, date2) - 1; i >= 0; i--) {
						daysData.push({
							name: this._analyticsService.dayNames[new Date(this._analyticsService.dateFormatter(this._analyticsService.SubtractDays(date2, i))).getDay()] + " " + new Date(this._analyticsService.dateFormatter(this._analyticsService.SubtractDays(date2, i))).getDate(),
							value: 0
						});
					}
					data.json().forEach(element => {
						let day = element._id;
						(this._analyticsService.dayNames[new Date(day).getDay()] + " " + new Date(day).getDate())
						// let day = (this._analyticsService.monthNames[new Date(element._id).getMonth()] + "'" + new Date(element._id).getDate());
						if (daysData.filter(t => t.name == (this._analyticsService.dayNames[new Date(day).getDay()] + " " + new Date(day).getDate())).length) {
							daysData.filter(t => t.name == (this._analyticsService.dayNames[new Date(day).getDay()] + " " + new Date(day).getDate()))[0].value += element.totalTickets;
						}
					});
					if (!data.json().length) {
						this._analyticsService.updateChart('column', daysData, 'flat', 'Total Tickets', true);
					} else {
						this._analyticsService.updateChart('column', daysData, 'flat', 'Total Tickets', false, totalTickets);
					}
				} else if (event.selectedComparison.match(/months/g)) {

					let temp_graph = this._analyticsService.diffMonth(date1, date2);
					
					data.json().forEach(element => {
						let month = this._analyticsService.monthNames[new Date(element._id).getMonth()];
						// console.log(month);
						if (temp_graph.filter(t => t.name == month).length) {
							temp_graph.filter(t => t.name == month)[0].value += element.totalTickets;
						}
					});
					if (!data.json().length) {
						this._analyticsService.updateChart('column', temp_graph, 'flat', 'Total Tickets', true);
					} else {
						this._analyticsService.updateChart('column', temp_graph, 'flat', 'Total Tickets', false, totalTickets);
					}
				} else if (event.selectedComparison.match(/years/g)) {
					// console.log('Matches months and years');
					let yearsData = this._analyticsService.diffYear(date1, date2);
					data.json().forEach(element => {
						let year = new Date(element._id).getFullYear().toString();
						if (yearsData.filter(t => t.name == year).length) {
							yearsData.filter(t => t.name == year)[0].value += element.totalTickets;
						}
					});
					if (!data.json().length) {
						this._analyticsService.updateChart('column', yearsData, 'flat', 'Total Tickets', true);
					} else {
						this._analyticsService.updateChart('column', yearsData, 'flat', 'Total Tickets', false, totalTickets);
					}
				}
			} else {
				if (!event.selectedAgents.length && !event.selectedGroups.length) {
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
								let time = Number(element._id);
								if (time < 12) {
									firstHalf.forEach(s => {
										if (s.name == ((time == 0) ? 12 + ' AM' : time + ' AM')) {
											s.value = element.totalTickets;
										}
									});
								} else if (time >= 12) {
									let n = time - 12;
									secondHalf.forEach(s => {
										if (s.name == ((n == 0) ? 12 + ' PM' : n + ' PM')) {
											s.value = element.totalTickets;
										}
									});
								}
							});
							// this.graph_avgWaitTime = today_Data;		
							if (!data.json().length) {
								this._analyticsService.updateChart('column', firstHalf.concat(secondHalf), 'flat', 'Total Tickets', true);
								// return;
							} else {
								// console.log(totalTickets);
								this._analyticsService.updateChart('column', firstHalf.concat(secondHalf), 'flat', 'Total Tickets', false, totalTickets);
							}
							break;
						case 'week':
							let temp_graph = [];
							for (let i = 6; i >= 0; i--) {
								temp_graph.push({
									name: this._analyticsService.monthNames[new Date(this._analyticsService.dateFormatter(this._analyticsService.SubtractDays(new Date(), i))).getMonth()] + "'" + new Date(this._analyticsService.dateFormatter(this._analyticsService.SubtractDays(new Date(), i))).getDate(),
									value: 0
								});
							}
							data.json().forEach(element => {
								let date = new Date(element._id);
								let month = (this._analyticsService.monthNames[date.getMonth()] + "'" + date.getDate());
								if (temp_graph.filter(t => t.name == month).length) {
									temp_graph.filter(t => t.name == month)[0].value += element.totalTickets;
								}
							});
							// this.graph_avgWaitTime = graph_week;
							if (!data.json().length) {
								this._analyticsService.updateChart('column', temp_graph, 'flat', 'Total Tickets', true);
								// return;
							} else {
								this._analyticsService.updateChart('column', temp_graph, 'flat', 'Total Tickets', false, totalTickets);
							}
							break;
						case 'month':
							let graph_month = [];
							for (let i = 29; i >= 0; i--) {
								graph_month.push({
									name: this._analyticsService.monthNames[new Date(this._analyticsService.dateFormatter(this._analyticsService.SubtractDays(new Date(), i))).getMonth()] + "'" + new Date(this._analyticsService.dateFormatter(this._analyticsService.SubtractDays(new Date(), i))).getDate(),
									value: 0
								});
							}
							data.json().forEach(element => {
								let month = (this._analyticsService.monthNames[new Date(element._id).getMonth()] + "'" + new Date(element._id).getDate());
								if (graph_month.filter(t => t.name == month).length) {
									graph_month.filter(t => t.name == month)[0].value += element.totalTickets;
								}
							});
							// this.graph_avgWaitTime = graph_month;
							if (!data.json().length) {
								this._analyticsService.updateChart('column', graph_month, 'flat', 'Total Tickets', true);
								// return;
							} else {
								this._analyticsService.updateChart('column', graph_month, 'flat', 'Total Tickets', false, totalTickets);
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
									// let date = this._analyticsService.dateFormatter(new Date()) + 'T' + element._id + ':00:00.000Z';
									// let time = new Date(date).getHours();
									let time = Number(element._id);
									if (time < 12) {
										firstHalf.forEach(s => {
											if (s.name == ((time == 0) ? 12 + ' AM' : time + ' AM')) {
												s.value = element.totalTickets;
											}
										});
									} else if (time >= 12) {
										let n = time - 12;
										secondHalf.forEach(s => {
											if (s.name == ((n == 0) ? 12 + ' PM' : n + ' PM')) {
												s.value = element.totalTickets;
											}
										});
									}
								});
								if (!data.json().length) {
									this._analyticsService.updateChart('column', firstHalf.concat(secondHalf), 'flat', 'Total Tickets', true);
									// return;
								} else {
									this._analyticsService.updateChart('column', firstHalf.concat(secondHalf), 'flat', 'Total Tickets', false, totalTickets);
								}
							} else if (this._analyticsService.daysBetween(date1, date2) < 16) {
								let graph_week = [];
								for (let i = this._analyticsService.daysBetween(date1, date2); i >= 0; i--) {
									graph_week.push({
										name: this._analyticsService.monthNames[new Date(this._analyticsService.dateFormatter(this._analyticsService.SubtractDays(date2, i))).getMonth()] + "'" + new Date(this._analyticsService.dateFormatter(this._analyticsService.SubtractDays(date2, i))).getDate(),
										value: 0
									});
								}
								data.json().forEach(element => {
									let month = (this._analyticsService.monthNames[new Date(element._id).getMonth()] + "'" + new Date(element._id).getDate());
									if (graph_week.filter(t => t.name == month).length) {
										graph_week.filter(t => t.name == month)[0].value += element.totalTickets;
									}
								});
								// this.graph_avgWaitTime = graph_week;
								if (!data.json().length) {
									this._analyticsService.updateChart('column', graph_week, 'flat', 'Total Tickets', true);
									// return;
								} else {
									this._analyticsService.updateChart('column', graph_week, 'flat', 'Total Tickets', false, totalTickets);
								}
							} else {
								let temp_graph = [];
								for (let i = this._analyticsService.daysBetween(date1, date2); i >= 0; i--) {
									temp_graph.push({
										name: this._analyticsService.monthNames[new Date(this._analyticsService.dateFormatter(this._analyticsService.SubtractDays(date2, i))).getMonth()] + "'" + new Date(this._analyticsService.dateFormatter(this._analyticsService.SubtractDays(date2, i))).getDate(),
										value: 0
									});
								}
								data.json().forEach(element => {
									let month = (this._analyticsService.monthNames[new Date(element._id).getMonth()] + "'" + new Date(element._id).getDate());
									if (temp_graph.filter(t => t.name == month).length) {
										temp_graph.filter(t => t.name == month)[0].value += element.totalTickets;
									}
								});
								// this.graph_avgWaitTime = graph_month;
								if (!data.json().length) {
									this._analyticsService.updateChart('column', temp_graph, 'flat', 'Total Tickets', true);
									// return;
								} else {
									this._analyticsService.updateChart('column', temp_graph, 'flat', 'Total Tickets', false, totalTickets);
								}
							}
							break;
					}
				} else if (event.selectedAgents.length && !event.selectedGroups.length) {
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
									if (element.email == agent.name) {
										// console.log('Matched Agent');

										// let date = this._analyticsService.dateFormatter(new Date()) + 'T' + element._id + ':00:00.000Z';
										// let time = new Date(date).getHours();
										let time = Number(element._id);
										if (time < 12) {
											firstHalf.forEach(s => {
												if (s.name == ((time == 0) ? 12 + ' AM' : time + ' AM')) {
													s.value = element.totalTickets
												}
											});
										} else if (time >= 12) {
											let n = time - 12;
											secondHalf.forEach(s => {
												if (s.name == ((n == 0) ? 12 + ' PM' : n + ' PM')) {
													s.value = element.totalTickets
												}
											});
										}
									}
								});
								agent.series = firstHalf.concat(secondHalf);
							})
							if (!data.json().length) {
								this._analyticsService.updateChart('column', graph_agents, 'flat', 'Total Tickets', true);
								// return;
							} else {
								this._analyticsService.updateChart('column', graph_agents, 'agents', 'Total Tickets', false, totalTickets);
							}
							break;
						case 'week':
							event.selectedAgents.forEach(agent => {
								graph_agents.push({
									name: agent,
									value: 0
								})
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
									if (element.email == agent.name) {
										graph_week.forEach(e => {
											let date = Number(element._id.split('-')[2]) + ' ' + this._analyticsService.monthNames[new Date(element._id).getMonth()] + ' ' + new Date(element._id).getFullYear();
											if (e.name == date) {
												e.value = element.totalTickets;
											}
										});
									}
									agent.series = graph_week;
								});
							});
							if (!data.json().length) {
								this._analyticsService.updateChart('column', graph_agents, 'flat', 'Total Tickets', true);
								// return;
							} else {
								this._analyticsService.updateChart('column', graph_agents, 'agents', 'Total Tickets', false, totalTickets);
							}
							break;
						case 'month':
							event.selectedAgents.forEach(agent => {
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
									if (element.email == agent.name) {
										graph_month.forEach(e => {
											let date = Number(element._id.split('-')[2]) + ' ' + this._analyticsService.monthNames[new Date(element._id).getMonth()] + ' ' + new Date(element._id).getFullYear();
											if (e.name == date) {
												e.value = element.totalTickets
											}
										});
									}
									agent.series = graph_month;
								});

							});
							if (!data.json().length) {
								this._analyticsService.updateChart('column', graph_agents, 'flat', 'Total Tickets', true);
								// return;
							} else {
								this._analyticsService.updateChart('column', graph_agents, 'agents', 'Total Tickets', false, totalTickets);
							}
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
										if (agent.name == element.email) {
											// let date = this._analyticsService.dateFormatter(new Date()) + 'T' + element._id + ':00:00.000Z';
											// let time = new Date(date).getHours();
											let time = Number(element._id);
											if (time < 12) {
												firstHalf.forEach(s => {
													if (s.name == ((time == 0) ? 12 + ' AM' : time + ' AM')) {
														s.value = element.totalTickets
													}
												});
											} else if (time >= 12) {
												let n = time - 12;
												secondHalf.forEach(s => {
													if (s.name == ((n == 0) ? 12 + ' PM' : n + ' PM')) {
														s.value = element.totalTickets
													}
												});
											}
										}
									});
									agent.series = firstHalf.concat(secondHalf);
								});
								if (!data.json().length) {
									this._analyticsService.updateChart('column', graph_agents, 'flat', 'Total Tickets', true);
									// return;
								} else {
									this._analyticsService.updateChart('column', graph_agents, 'agents', 'Total Tickets', false, totalTickets);
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
										if (agent.name == element.email) {
											graph_week.forEach(e => {
												let date = Number(element._id.split('-')[2]) + ' ' + this._analyticsService.monthNames[new Date(element._id).getMonth()] + ' ' + new Date(element._id).getFullYear();
												if (e.name == date) {
													e.value = element.totalTickets
												}
											});
										}
										agent.series = graph_week;
									});
								})
								if (!data.json().length) {
									this._analyticsService.updateChart('column', graph_agents, 'flat', 'Total Tickets', true);
									// return;
								} else {
									this._analyticsService.updateChart('column', graph_agents, 'agents', 'Total Tickets', false, totalTickets);
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
										if (agent.name == element.email) {
											graph_month.forEach(e => {
												let date = Number(element._id.split('-')[2]) + ' ' + this._analyticsService.monthNames[new Date(element._id).getMonth()] + ' ' + new Date(element._id).getFullYear();
												if (e.name == date) {
													e.value = element.totalTickets
												}
											});
										}
										agent.series = graph_month;
									});
								})
								if (!data.json().length) {
									this._analyticsService.updateChart('column', graph_agents, 'flat', 'Total Tickets', true);
									// return;
								} else {
									this._analyticsService.updateChart('column', graph_agents, 'agents', 'Total Tickets', false, totalTickets);
								}
							}
							break;
					}
				} else if (event.selectedGroups.length && !event.selectedAgents.length) {
					let graph_groups = [];
					switch (event.selectedDateType) {
						case 'today':
						case 'yesterday':
							event.selectedGroups.forEach(group => {
								graph_groups.push({
									name: group,
									series: []
								})
							});
							graph_groups.forEach(group => {
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
									if (element.group == group.name) {
										// console.log('Matched Agent');

										// let date = this._analyticsService.dateFormatter(new Date()) + 'T' + element._id + ':00:00.000Z';
										// let time = new Date(date).getHours();
										let time = Number(element._id);
										if (time < 12) {
											firstHalf.forEach(s => {
												if (s.name == ((time == 0) ? 12 + ' AM' : time + ' AM')) {
													s.value = element.totalTickets
												}
											});
										} else if (time >= 12) {
											let n = time - 12;
											secondHalf.forEach(s => {
												if (s.name == ((n == 0) ? 12 + ' PM' : n + ' PM')) {
													s.value = element.totalTickets
												}
											});
										}
									}
								});
								group.series = firstHalf.concat(secondHalf);
							})
							if (!data.json().length) {
								this._analyticsService.updateChart('column', graph_groups, 'flat', 'Total Tickets', true);
								// return;
							} else {
								this._analyticsService.updateChart('column', graph_groups, 'agents', 'Total Tickets', false, totalTickets);
							}
							break;
						case 'week':
							event.selectedGroups.forEach(group => {
								graph_groups.push({
									name: group,
									value: 0
								})
							});
							graph_groups.forEach(group => {
								let graph_week = [];
								for (let i = 6; i >= 0; i--) {
									let date = this._analyticsService.SubtractDays(new Date(), i);
									graph_week.push({
										name: date.getDate() + ' ' + this._analyticsService.monthNames[date.getMonth()] + ' ' + date.getFullYear(),
										value: 0
									});
								};
								data.json().forEach(element => {
									if (element.group == group.name) {
										graph_week.forEach(e => {
											let date = Number(element._id.split('-')[2]) + ' ' + this._analyticsService.monthNames[new Date(element._id).getMonth()] + ' ' + new Date(element._id).getFullYear();
											if (e.name == date) {
												e.value = element.totalTickets;
											}
										});
									}
									group.series = graph_week;
								});
							});
							if (!data.json().length) {
								this._analyticsService.updateChart('column', graph_groups, 'flat', 'Total Tickets', true);
								// return;
							} else {
								this._analyticsService.updateChart('column', graph_groups, 'agents', 'Total Tickets', false, totalTickets);
							}
							break;
						case 'month':
							event.selectedGroups.forEach(group => {
								graph_groups.push({
									name: group,
									series: []
								})
							});
							graph_groups.forEach(group => {
								let graph_month = [];
								for (let i = 29; i >= 0; i--) {
									let date = this._analyticsService.SubtractDays(new Date(), i);
									graph_month.push({
										name: date.getDate() + ' ' + this._analyticsService.monthNames[date.getMonth()] + ' ' + date.getFullYear(),
										value: 0
									});
								}
								data.json().forEach(element => {
									if (element.group == group.name) {
										graph_month.forEach(e => {
											let date = Number(element._id.split('-')[2]) + ' ' + this._analyticsService.monthNames[new Date(element._id).getMonth()] + ' ' + new Date(element._id).getFullYear();
											if (e.name == date) {
												e.value = element.totalTickets
											}
										});
									}
									group.series = graph_month;
								});

							});
							if (!data.json().length) {
								this._analyticsService.updateChart('column', graph_groups, 'flat', 'Total Tickets', true);
								// return;
							} else {
								this._analyticsService.updateChart('column', graph_groups, 'agents', 'Total Tickets', false, totalTickets);
							}
							break;
						default:
							var date1 = new Date(event.selectedDate.from);
							var date2 = new Date(event.selectedDate.to);
							if (this._analyticsService.daysBetween(date1, date2) == 0 || this._analyticsService.daysBetween(date1, date2) == 1) {
								event.selectedGroups.forEach(group => {
									graph_groups.push({
										name: group,
										series: []
									})
								});
								graph_groups.forEach(group => {
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
										if (group.name == element.group) {
											// let date = this._analyticsService.dateFormatter(new Date()) + 'T' + element._id + ':00:00.000Z';
											// let time = new Date(date).getHours();
											let time = Number(element._id);
											if (time < 12) {
												firstHalf.forEach(s => {
													if (s.name == ((time == 0) ? 12 + ' AM' : time + ' AM')) {
														s.value = element.totalTickets
													}
												});
											} else if (time >= 12) {
												let n = time - 12;
												secondHalf.forEach(s => {
													if (s.name == ((n == 0) ? 12 + ' PM' : n + ' PM')) {
														s.value = element.totalTickets
													}
												});
											}
										}
									});
									group.series = firstHalf.concat(secondHalf);
								});
								if (!data.json().length) {
									this._analyticsService.updateChart('column', graph_groups, 'flat', 'Total Tickets', true);
									// return;
								} else {
									this._analyticsService.updateChart('column', graph_groups, 'agents', 'Total Tickets', false, totalTickets);
								}
							} else if (this._analyticsService.daysBetween(date1, date2) < 16) {
								event.selectedGroups.forEach(group => {
									graph_groups.push({
										name: group,
										value: 0
									})
								});
								graph_groups.forEach(group => {
									let graph_week = [];
									for (let i = this._analyticsService.daysBetween(date1, date2); i >= 0; i--) {
										let date = this._analyticsService.SubtractDays(new Date(), i);
										graph_week.push({
											name: date.getDate() + ' ' + this._analyticsService.monthNames[date.getMonth()] + ' ' + date.getFullYear(),
											series: []
										});
									}
									data.json().forEach(element => {
										if (group.name == element.group) {
											graph_week.forEach(e => {
												let date = Number(element._id.split('-')[2]) + ' ' + this._analyticsService.monthNames[new Date(element._id).getMonth()] + ' ' + new Date(element._id).getFullYear();
												if (e.name == date) {
													e.value = element.totalTickets
												}
											});
										}
										group.series = graph_week;
									});
								})
								if (!data.json().length) {
									this._analyticsService.updateChart('column', graph_groups, 'flat', 'Total Tickets', true);
									// return;
								} else {
									this._analyticsService.updateChart('column', graph_groups, 'agents', 'Total Tickets', false, totalTickets);
								}
							} else {
								event.selectedGroups.forEach(group => {
									graph_groups.push({
										name: group,
										series: []
									})
								});
								graph_groups.forEach(group => {
									let graph_month = [];
									for (let i = this._analyticsService.daysBetween(date1, date2); i >= 0; i--) {
										let date = this._analyticsService.SubtractDays(new Date(), i);
										graph_month.push({
											name: date.getDate() + ' ' + this._analyticsService.monthNames[date.getMonth()] + ' ' + date.getFullYear(),
											value: 0
										});
									}
									data.json().forEach(element => {
										if (group.name == element.group) {
											graph_month.forEach(e => {
												let date = Number(element._id.split('-')[2]) + ' ' + this._analyticsService.monthNames[new Date(element._id).getMonth()] + ' ' + new Date(element._id).getFullYear();
												if (e.name == date) {
													e.value = element.totalTickets
												}
											});
										}
										group.series = graph_month;
									});
								})
								if (!data.json().length) {
									this._analyticsService.updateChart('column', graph_groups, 'flat', 'Total Tickets', true);
									// return;
								} else {
									this._analyticsService.updateChart('column', graph_groups, 'agents', 'Total Tickets', false, totalTickets);
								}
							}
							break;
					}
				}
			}
		}, err => {
			console.log('Error! Server unreachable.');
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
		
		this._analyticsService.exportHTMLToExcel('totalTickets', 'TotalTickets-'+new Date().getTime());
	}
	ngOnDestroy(){
		this.subscriptions.forEach(subscription => {
			subscription.unsubscribe();
		})
	}

}
