import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from '../../../../../services/AuthenticationService';
import { AnalyticsService } from '../../../../../services/AnalyticsService';
import { Subscription } from 'rxjs/Subscription';
import * as Highcharts from 'highcharts';
require('highcharts/modules/exporting')(Highcharts);
require('highcharts/modules/export-data')(Highcharts);

@Component({
	selector: 'app-analytics-avgwaittime',
	templateUrl: './analytics-avgwaittime.component.html',
	styleUrls: ['./analytics-avgwaittime.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class AnalyticsAvgwaittimeComponent implements OnInit {
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
			text: 'Average Wait Time'
		},
		plotOptions:{
			line:{
				lineWidth: 1,
				marker:{
					symbol: 'circle',
					radius: 2
				}
			}
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
				return  "<div>Time: <b>"+ str  +"</b></div>";
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
					this.options.title.text = 'Average Wait Time (' + this.time_convert(data.title.text) + ')'
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
		this._analyticsService.GetAverageWaitTime(event.csid,event.selectedDateType, event.selectedDate, event.selectedAgents).subscribe(data => {
			// let visitorIDs = [];
			// console.log(data.json());
			let totalAvgWaitTime = 0;
			data.json().forEach(element => {
				totalAvgWaitTime += element['avgWaitTime'];
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
							daysData.filter(t => t.name == (this._analyticsService.dayNames[new Date(day).getDay()] + " " + new Date(day).getDate()))[0].value += element.avgWaitTime;
						}
					});
					if (!data.json().length) {
						this._analyticsService.updateChart('line', daysData, 'flat', 'Wait Time', true);
					} else {
						this._analyticsService.updateChart('line', daysData, 'flat', 'Wait Time', false, totalAvgWaitTime);
					}
				} else if (event.selectedComparison.match(/months/g)) {

					let temp_graph = this._analyticsService.diffMonth(date1, date2);
					data.json().forEach(element => {
						let month = this._analyticsService.monthNames[new Date(element._id).getMonth()];
						if (temp_graph.filter(t => t.name == month).length) {
							temp_graph.filter(t => t.name == month)[0].value += element.avgWaitTime;
						}
					});
					if (!data.json().length) {
						this._analyticsService.updateChart('line', temp_graph, 'flat', 'Wait Time', true);
					} else {
						this._analyticsService.updateChart('line', temp_graph, 'flat', 'Wait Time', false, totalAvgWaitTime);
					}
				} else if (event.selectedComparison.match(/years/g)) {
					// console.log('Matches months and years');
					let yearsData = this._analyticsService.diffYear(date1, date2);
					data.json().forEach(element => {
						let year = new Date(element._id).getFullYear().toString();
						if (yearsData.filter(t => t.name == year).length) {
							yearsData.filter(t => t.name == year)[0].value += element.avgWaitTime;
						}
					});
					if (!data.json().length) {
						this._analyticsService.updateChart('column', yearsData, 'flat', 'Wait Time', true);
					} else {
						this._analyticsService.updateChart('column', yearsData, 'flat', 'Wait Time', false, totalAvgWaitTime);
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
								// let date = this._analyticsService.dateFormatter(new Date()) + 'T' + element._id + ':00:00.000Z';
								// let time = new Date(date).getHours();
								let time = Number(element._id);
								if (time < 12) {
									firstHalf.forEach(s => {
										if (s.name == ((time == 0) ? 12 + ' AM' : time + ' AM')) {
											s.value = element.avgWaitTime;
										}
									});
								} else if (time >= 12) {
									let n = time - 12;
									secondHalf.forEach(s => {
										if (s.name == ((n == 0) ? 12 + ' PM' : n + ' PM')) {
											s.value = element.avgWaitTime;
										}
									});
								}
							});
							// this.graph_avgWaitTime = today_Data;		
							if (!data.json().length) {
								this._analyticsService.updateChart('line', firstHalf.concat(secondHalf), 'flat', 'Wait Time', true);
								// return;
							} else {
								this._analyticsService.updateChart('line', firstHalf.concat(secondHalf), 'flat', 'Wait Time', false, totalAvgWaitTime);
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
								let month = (this._analyticsService.monthNames[new Date(element._id).getMonth()] + "'" + new Date(element._id).getDate());
								if (temp_graph.filter(t => t.name == month).length) {
									temp_graph.filter(t => t.name == month)[0].value += element.avgWaitTime;
								}
							});
							// this.graph_avgWaitTime = graph_week;
							if (!data.json().length) {
								this._analyticsService.updateChart('line', temp_graph, 'flat', 'Wait Time', true);
								// return;
							} else {
								this._analyticsService.updateChart('line', temp_graph, 'flat', 'Wait Time', false, totalAvgWaitTime);
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
									graph_month.filter(t => t.name == month)[0].value += element.avgWaitTime;
								}
							});
							// this.graph_avgWaitTime = graph_month;
							if (!data.json().length) {
								this._analyticsService.updateChart('line', graph_month, 'flat', 'Wait Time', true);
								// return;
							} else {
								this._analyticsService.updateChart('line', graph_month, 'flat', 'Wait Time', false, totalAvgWaitTime);
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
												s.value = element.avgWaitTime;
											}
										});
									} else if (time >= 12) {
										let n = time - 12;
										secondHalf.forEach(s => {
											if (s.name == ((n == 0) ? 12 + ' PM' : n + ' PM')) {
												s.value = element.avgWaitTime;
											}
										});
									}
								});
								if (!data.json().length) {
									this._analyticsService.updateChart('line', firstHalf.concat(secondHalf), 'flat', 'Wait Time', true);
									// return;
								} else {
									this._analyticsService.updateChart('line', firstHalf.concat(secondHalf), 'flat', 'Wait Time', false, totalAvgWaitTime);
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
										graph_week.filter(t => t.name == month)[0].value += element.avgWaitTime;
									}
								});
								// this.graph_avgWaitTime = graph_week;
								if (!data.json().length) {
									this._analyticsService.updateChart('line', graph_week, 'flat', 'Wait Time', true);
									// return;
								} else {
									this._analyticsService.updateChart('line', graph_week, 'flat', 'Wait Time', false, totalAvgWaitTime);
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
										temp_graph.filter(t => t.name == month)[0].value += element.avgWaitTime;
									}
								});
								// this.graph_avgWaitTime = graph_month;
								if (!data.json().length) {
									this._analyticsService.updateChart('line', temp_graph, 'flat', 'Wait Time', true);
									// return;
								} else {
									this._analyticsService.updateChart('line', temp_graph, 'flat', 'Wait Time', false, totalAvgWaitTime);
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
								totalAvgWaitTime += element.avgWaitTime;
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
													s.value = element.avgWaitTime
												}
											});
										} else if (time >= 12) {
											let n = time - 12;
											secondHalf.forEach(s => {
												if (s.name == ((n == 0) ? 12 + ' PM' : n + ' PM')) {
													s.value = element.avgWaitTime
												}
											});
										}
									}
								});
								agent.series = firstHalf.concat(secondHalf);
							})
							if (!data.json().length) {
								this._analyticsService.updateChart('column', graph_agents, 'flat', 'Wait Time', true);
								// return;
							} else {
								this._analyticsService.updateChart('column', graph_agents, 'agents', 'Wait Time', false, totalAvgWaitTime);
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
								totalAvgWaitTime += element.avgWaitTime;
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
												e.value = element.avgWaitTime;
											}
										});
									}
									agent.series = graph_week;
								});
							});
							if (!data.json().length) {
								this._analyticsService.updateChart('column', graph_agents, 'flat', 'Wait Time', true);
								// return;
							} else {
								this._analyticsService.updateChart('column', graph_agents, 'agents', 'Wait Time', false, totalAvgWaitTime);
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
								totalAvgWaitTime += element.avgWaitTime;
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
												e.value = element.avgWaitTime
											}
										});
									}
									agent.series = graph_month;
								});

							});
							if (!data.json().length) {
								this._analyticsService.updateChart('column', graph_agents, 'flat', 'Wait Time', true);
								// return;
							} else {
								this._analyticsService.updateChart('column', graph_agents, 'agents', 'Wait Time', false, totalAvgWaitTime);
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
														s.value = element.avgWaitTime
													}
												});
											} else if (time >= 12) {
												let n = time - 12;
												secondHalf.forEach(s => {
													if (s.name == ((n == 0) ? 12 + ' PM' : n + ' PM')) {
														s.value = element.avgWaitTime
													}
												});
											}
										}
									});
									agent.series = firstHalf.concat(secondHalf);
								});
								if (!data.json().length) {
									this._analyticsService.updateChart('column', graph_agents, 'flat', 'Wait Time', true);
									// return;
								} else {
									this._analyticsService.updateChart('column', graph_agents, 'agents', 'Wait Time', false, totalAvgWaitTime);
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
										totalAvgWaitTime += element.avgWaitTime;
										if (agent.name == element.email) {
											graph_week.forEach(e => {
												let date = Number(element._id.split('-')[2]) + ' ' + this._analyticsService.monthNames[new Date(element._id).getMonth()] + ' ' + new Date(element._id).getFullYear();
												if (e.name == date) {
													e.value = element.avgWaitTime
												}
											});
										}
										agent.series = graph_week;
									});
								})
								if (!data.json().length) {
									this._analyticsService.updateChart('column', graph_agents, 'flat', 'Wait Time', true);
									// return;
								} else {
									this._analyticsService.updateChart('column', graph_agents, 'agents', 'Wait Time', false, totalAvgWaitTime);
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
										totalAvgWaitTime += element.avgWaitTime;
										if (agent.name == element.email) {
											graph_month.forEach(e => {
												let date = Number(element._id.split('-')[2]) + ' ' + this._analyticsService.monthNames[new Date(element._id).getMonth()] + ' ' + new Date(element._id).getFullYear();
												if (e.name == date) {
													e.value = element.avgWaitTime
												}
											});
										}
										agent.series = graph_month;
									});
								})
								if (!data.json().length) {
									this._analyticsService.updateChart('column', graph_agents, 'flat', 'Wait Time', true);
									// return;
								} else {
									this._analyticsService.updateChart('column', graph_agents, 'agents', 'Wait Time', false, totalAvgWaitTime);
								}
							}
							break;
					}
				}
			}
			// this.graph_visitorDetails = visitor_details;
			// this._analyticsService.GetVisitorSessions(visitorIDs);
		}, err => {
			// this._analyticsService.GetVisitorSessions([]);
			console.log('Error! Server unreachable.');
			// console.log(err);
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
	showSeriesCount(index){
		let count = 0;
		this.options.series[index].data.forEach(element => {
			count += element;
		});
		return this.time_convert(count);
	}
	Export(){
		console.log('Exporting...');
		// console.log(this.agentTableData);
		
		this._analyticsService.exportHTMLToExcel('avgWaitTime', 'AvgWaitTime-'+new Date().getTime());
	}
	ngOnDestroy(){
		this.subscriptions.forEach(subscription => {
			subscription.unsubscribe();
		})
	}

}
