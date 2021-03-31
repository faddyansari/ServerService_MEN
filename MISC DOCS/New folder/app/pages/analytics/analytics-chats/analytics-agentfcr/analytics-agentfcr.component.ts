import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from '../../../../../services/AuthenticationService';
import { AnalyticsService } from '../../../../../services/AnalyticsService';
import * as Highcharts from 'highcharts';
import { ChatService } from '../../../../../services/ChatService';
import { GlobalStateService } from '../../../../../services/GlobalStateService';
require('highcharts/modules/exporting')(Highcharts);
require('highcharts/modules/export-data')(Highcharts);

@Component({
	selector: 'app-analytics-agentfcr',
	templateUrl: './analytics-agentfcr.component.html',
	styleUrls: ['./analytics-agentfcr.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class AnalyticsAgentfcrComponent implements OnInit {

	subscriptions: Subscription[] = [];
	loading = false;
	highcharts = Highcharts;
	additionalData : any;
	options: any = {
		chart: {
			type: 'column',
			backgroundColor: '#f5f6f8'
		},
		title: {
			text: 'Chat Experience'
		},
		plotOptions:{
			line:{
				lineWidth: 1,
				marker:{
					symbol: 'circle',
					radius: 2
				},
				events:{
					click: (event) => {
						let data = this.additionalData;
						let from = event.point.category;
						let to = event.point.category;
						if(data.date == 'today' || data.date == 'yesterday'){
							from = new Date().toDateString();
							to = new Date().toDateString();
						}else if(data.date.split(',').length == 3){
							let details = data.date.split(',');
							from = details[1];
							to = details[2];
						}
						// console.log(event.point.series.name.toLowerCase());
						
						// console.log('From: ' + from);
						// console.log('To: ' + to);
						switch(event.point.series.name.toLowerCase()){
							case 'unfilled':
								this._chatService.Filters.next({
									filter: {
										daterange: { to: to, from: from },
										feedback: {
											$exists: false
										},
										override: { "state": { '$exists': true },
													"agentEmail" : {'$exists': true}},
									}
								});
								break;
							case 'yes':
								this._chatService.Filters.next({
									filter: {
										daterange: { to: to, from: from },
										'feedback.Q1': {'$eq': "yes" },
										override: { "state": { '$exists': true },
													"agentEmail" : {'$exists': true}},
									}
								});
								break;
							case 'no':
								this._chatService.Filters.next({
									filter: {
										daterange: { to: to, from: from },
										'feedback.Q1': {'$eq': "no" },
										override: { "state": { '$exists': true },
													"agentEmail" : {'$exists': true}},
									}
								});
								break;
						}
						this._chatService.setActiveTab('ARCHIVE');
						this._globalStateService.NavigateTo('/chats');
					}
				}
			},
			column:{
				events:{
					click: (event) => {
						let data = this.additionalData;
						let from = event.point.category;
						let to = event.point.category;
						if(data.date == 'today' || data.date == 'yesterday'){
							from = new Date().toDateString();
							to = new Date().toDateString();
						}else if(data.date.split(',').length == 3){
							let details = data.date.split(',');
							from = details[1];
							to = details[2];
						}
						// console.log(event.point.series.name.toLowerCase());
						
						// console.log('From: ' + from);
						// console.log('To: ' + to);
						switch(event.point.series.name.toLowerCase()){
							case 'unfilled':
								this._chatService.Filters.next({
									filter: {
										daterange: { to: to, from: from },
										feedback: {
											$exists: false
										},
										override: { "state": { '$exists': true },
													"agentEmail" : {'$exists': true}},
									}
								});
								break;
							case 'yes':
								this._chatService.Filters.next({
									filter: {
										daterange: { to: to, from: from },
										'feedback.Q1': {'$eq': "yes" },
										override: { "state": { '$exists': true },
													"agentEmail" : {'$exists': true}},
									}
								});
								break;
							case 'no':
								this._chatService.Filters.next({
									filter: {
										daterange: { to: to, from: from },
										'feedback.Q1': {'$eq': "no" },
										override: { "state": { '$exists': true },
													"agentEmail" : {'$exists': true}},
									}
								});
								break;
						}
						this._chatService.setActiveTab('ARCHIVE');
						this._globalStateService.NavigateTo('/chats');
					}
				}
			}
		},
		tooltip:{
			animation:false,
			useHTML: true,
			shadow: false,
			headerFormat: "<div style='text-align:center;font-weight:bold'>{point.key}</div>",
			pointFormat: "<div>{point.y} {point.series.name} </div>"
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
			categories:[

			]
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

	agentTableData : any;

	constructor(_authService: AuthService, private _chatService: ChatService,private _globalStateService: GlobalStateService,public _analyticsService: AnalyticsService) {
		this.subscriptions.push(_analyticsService.loading.subscribe(data => {
			this.loading = data;
		}));
		this.subscriptions.push(_analyticsService.selectedAgents.subscribe(data => {
			this.selectedAgents = data;
		}));
		this.subscriptions.push(_analyticsService.options.subscribe(data => {
			if(this.rendered && !this.selectedAgents.length){
				this.additionalData = data.additionalData;
				this.options.chart.type = data.chart.type;
				this.options.legend = data.legend;
				this.options.xAxis.categories = data.xAxis.categories;
				this.options.series = data.series;
				setTimeout(() => {
					this.chart = new Highcharts.Chart("highchart", this.options);
				}, 0);
			}else{
				// console.log(data.series);
				this.agentTableData = data.series;
				// agentTableData = data.series;
			}
		}));
	}

	onFilterResult(event){
		this._analyticsService.GetAgentFCR(event.csid, event.selectedDateType,event.selectedDate, event.selectedAgents).subscribe(data => {
			let c_selectedAgents = JSON.parse(JSON.stringify(this.selectedAgents));
			this._analyticsService.selectedAgents.next(c_selectedAgents);
			// console.log(data.json());
			let convIDs = [];
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
					let series_group = [
						{
							name: "unfilled",
							series: []
						},
						{
							name: "yes",
							series: []
						},
						{
							name: "no",
							series: []
						}
					];
					series_group.forEach(s => {
						let daysData = [];
						for (let i = this._analyticsService.daysBetween(date1, date2) - 1; i >= 0; i--) {
							daysData.push({
								name: this._analyticsService.dayNames[new Date(this._analyticsService.dateFormatter(this._analyticsService.SubtractDays(date2, i))).getDay()] + " " + new Date(this._analyticsService.dateFormatter(this._analyticsService.SubtractDays(date2, i))).getDate(),
								value: 0
							});
						}
						daysData.forEach(d => {
							data.json().forEach(element => {
								let day = element._id;
								if (d.name == (this._analyticsService.dayNames[new Date(day).getDay()] + " " + new Date(day).getDate())) {
									d.value += element[s.name];
								}
							});
						});
						s.series = daysData;
					})

					if (!data.json().length) {
						this._analyticsService.updateChart('line', series_group, 'dimensional', 'Experience', true);
						// return;
					} else {
						this._analyticsService.updateChart('line', series_group, 'dimensional', 'Experience');
					}
					// console.log(daysData);
					// this.graph_agentFCR = daysData;
				} else if (event.selectedComparison.match(/months/g)) {

					let series_group = [
						{
							name: "unfilled",
							series: []
						},
						{
							name: "yes",
							series: []
						},
						{
							name: "no",
							series: []
						}
					];
					series_group.forEach(s => {
						let monthsData = this._analyticsService.diffMonth(date1, date2);
						monthsData.forEach(m => {
							data.json().forEach(element => {
								if (m.name == this._analyticsService.monthNames[new Date(element._id).getMonth()]) {
									m.value += element[s.name];
								}
							});
						});
						s.series = monthsData;
					})
					if (!data.json().length) {
						this._analyticsService.updateChart('line', series_group, 'dimensional', 'FCRs', true);
						// return;
					} else {
						this._analyticsService.updateChart('line', series_group, 'dimensional', 'FCRs');
					}
					// this.graph_agentFCR = monthsData;
				} else if (event.selectedComparison.match(/years/g)) {
					// console.log('Matches months and years');
					let series_group = [
						{
							name: "unfilled",
							series: []
						},
						{
							name: "yes",
							series: []
						},
						{
							name: "no",
							series: []
						}
					];
					series_group.forEach(s => {
						let yearsData = this._analyticsService.diffYear(date1, date2);
						yearsData.forEach(y => {
							data.json().forEach(element => {
								if (y.name == new Date(element._id).getFullYear().toString()) {
									y.value += element[s.name];
								}
							});
						});
						s.series = yearsData;
					})
					// console.log(series_group);

					if (!data.json().length) {
						this._analyticsService.updateChart('line', series_group, 'dimensional', 'FCRs', true);
						// return;
					} else {
						this._analyticsService.updateChart('line', series_group, 'dimensional', 'FCRs');
					}
					// this.graph_agentFCR = yearsData;
				}
			} else {
				if (!this.selectedAgents.length) {
					switch (event.selectedDateType) {
						case 'today':
						case 'yesterday':
							let graph_temp = [
								{
									name: "unfilled",
									series: []
								},
								{
									name: "yes",
									series: []
								},
								{
									name: "no",
									series: []
								}
							]

							graph_temp.forEach(e => {
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
									// let date = this.dateFormatter(new Date()) + 'T' + element._id + ':00:00.000Z';
									// let time = new Date(date).getHours();
									let time = Number(element._id);
									if (time < 12) {
										firstHalf.forEach(s => {
											if (s.name == ((time == 0) ? 12 + ' AM' : time + ' AM')) {
												s.value = element[e.name]
											}
										});
									} else if (time >= 12) {
										let n = time - 12;
										secondHalf.forEach(s => {
											if (s.name == ((n == 0) ? 12 + ' PM' : n + ' PM')) {
												s.value = element[e.name]
											}
										});
									}
								});
								e.series = firstHalf.concat(secondHalf);
							})
							data.json().forEach(element => {
								// this.table_visitors.concat(element.convIDs);
								element.convIDs.forEach(id => {
									convIDs = convIDs.concat(id);
								});
							});
							// this.graph_agentFCR = graph_temp;
							if (!data.json().length) {
								this._analyticsService.updateChart('line', graph_temp, 'dimensional', 'FCRs', true);
								// return;
							} else {
								this._analyticsService.updateChart('line', graph_temp, 'dimensional', 'FCRs');
							}
							break;
						case 'week':
							let series_group = [
								{
									name: "unfilled",
									series: []
								},
								{
									name: "yes",
									series: []
								},
								{
									name: "no",
									series: []
								}
							];
							series_group.forEach(s => {
								let graph_week = [];
								for (let i = 6; i >= 0; i--) {
									let date = this._analyticsService.SubtractDays(new Date(), i);
									graph_week.push({
										name: date.getDate() + ' ' + this._analyticsService.monthNames[date.getMonth()] + ' ' + date.getFullYear(),
										value: 0
									});
								}
								graph_week.forEach(d => {
									data.json().forEach(element => {
										let date = Number(element._id.split('-')[2]) + ' ' + this._analyticsService.monthNames[new Date(element._id).getMonth()] + ' ' + new Date(element._id).getFullYear();
										if (d.name == date) {
											d.value += element[s.name];
										}
									});
								});
								s.series = graph_week;
							});
							if (!data.json().length) {
								this._analyticsService.updateChart('line', series_group, 'dimensional', 'FCRs', true);
								// return;
							} else {
								this._analyticsService.updateChart('line', series_group, 'dimensional', 'FCRs');
							}
							break;
						case 'month':
							let graph_month = [
								{
									name: "unfilled",
									series: []
								},
								{
									name: "yes",
									series: []
								},
								{
									name: "no",
									series: []
								}
							];
							graph_month.forEach(e => {
								let month_days = [];
								for (let i = 29; i >= 0; i--) {
									let date = this._analyticsService.SubtractDays(new Date(), i);
									month_days.push({
										name: date.getDate() + ' ' + this._analyticsService.monthNames[date.getMonth()] + ' ' + date.getFullYear(),
										value: 0
									});
								}
								data.json().forEach(element => {
									element.convIDs.forEach(id => {
										convIDs = convIDs.concat(id);
									});
									month_days.forEach(m => {
										let date = Number(element._id.split('-')[2]) + ' ' + this._analyticsService.monthNames[new Date(element._id).getMonth()] + ' ' + new Date(element._id).getFullYear();
										if (m.name == date) {
											m.value = element[e.name]
										}
									});
								});
								e.series = month_days;
							});
							if (!data.json().length) {
								this._analyticsService.updateChart('line', graph_month, 'dimensional', 'FCRs', true);
								// return;
							} else {
								this._analyticsService.updateChart('line', graph_month, 'dimensional', 'FCRs');
							}
							break;
						default:
							var date1 = new Date(event.selectedDate.from);
							var date2 = new Date(event.selectedDate.to);
							if (this._analyticsService.daysBetween(date1, date2) == 0 || this._analyticsService.daysBetween(date1, date2) == 1) {
								let graph_temp = [
									{
										name: "unfilled",
										series: []
									},
									{
										name: "yes",
										series: []
									},
									{
										name: "no",
										series: []
									}
								]

								graph_temp.forEach(e => {
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
										// let date = this.dateFormatter(new Date()) + 'T' + element._id + ':00:00.000Z';
										// let time = new Date(date).getHours();
										let time = Number(element._id);
										if (time < 12) {
											firstHalf.forEach(s => {
												if (s.name == ((time == 0) ? 12 + ' AM' : time + ' AM')) {
													s.value = element[e.name]
												}
											});
										} else if (time >= 12) {
											let n = time - 12;
											secondHalf.forEach(s => {
												if (s.name == ((n == 0) ? 12 + ' PM' : n + ' PM')) {
													s.value = element[e.name]
												}
											});
										}
									});
									e.series = firstHalf.concat(secondHalf);
								});
								if (!data.json().length) {
									this._analyticsService.updateChart('line', graph_temp, 'dimensional', 'FCRs', true);
									// return;
								} else {
									this._analyticsService.updateChart('line', graph_temp, 'dimensional', 'FCRs');
								}
							} else if (this._analyticsService.daysBetween(date1, date2) < 16) {
								let series_group = [
									{
										name: "unfilled",
										series: []
									},
									{
										name: "yes",
										series: []
									},
									{
										name: "no",
										series: []
									}
								];
								series_group.forEach(s => {
									let graph_week = [];
									for (let i = this._analyticsService.daysBetween(date1, date2); i >= 0; i--) {
										let date = this._analyticsService.SubtractDays(new Date(event.selectedDate.to), i);
										graph_week.push({
											name: date.getDate() + ' ' + this._analyticsService.monthNames[date.getMonth()] + ' ' + date.getFullYear(),
											value: 0
										});
									}
									graph_week.forEach(d => {
										data.json().forEach(element => {
											let date = Number(element._id.split('-')[2]) + ' ' + this._analyticsService.monthNames[new Date(element._id).getMonth()] + ' ' + new Date(element._id).getFullYear();
											if (d.name == date) {
												d.value += element[s.name];
											}
										});
									});
									s.series = graph_week;
								});
								if (!data.json().length) {
									this._analyticsService.updateChart('line', series_group, 'dimensional', 'FCRs', true);
									// return;
								} else {
									this._analyticsService.updateChart('line', series_group, 'dimensional', 'FCRs');
								}
							} else {
								let graph_month = [
									{
										name: "unfilled",
										series: []
									},
									{
										name: "yes",
										series: []
									},
									{
										name: "no",
										series: []
									}
								];
								graph_month.forEach(e => {
									let month_days = [];
									for (let i = this._analyticsService.daysBetween(date1, date2); i >= 0; i--) {
										let date = this._analyticsService.SubtractDays(new Date(event.selectedDate.to), i);
										month_days.push({
											name: date.getDate() + ' ' + this._analyticsService.monthNames[date.getMonth()] + ' ' + date.getFullYear(),
											value: 0
										});
									};
									data.json().forEach(element => {
										element.convIDs.forEach(id => {
											convIDs = convIDs.concat(id);
										});
										month_days.forEach(m => {
											let date = Number(element._id.split('-')[2]) + ' ' + this._analyticsService.monthNames[new Date(element._id).getMonth()] + ' ' + new Date(element._id).getFullYear();
											if (m.name == date) {
												m.value = element[e.name]
											}
										});
									});
									e.series = month_days;
								});
								if (!data.json().length) {
									this._analyticsService.updateChart('line', graph_month, 'dimensional', 'FCRs', true);
									// return;
								} else {
									this._analyticsService.updateChart('line', graph_month, 'dimensional', 'FCRs');
								}
							}
							break;
					}
				} else {
					let dummyJSON = {};
					// console.log(data.json());
					data.json().forEach((element, index) => {
						let obj = {
							[element.date]: {
								unfilled: [],
								yes: [],
								no: []
							}
						}
						this.selectedAgents.forEach(agent => {
							obj[element.date].unfilled.push({
								email: agent, count: (element.email == agent) ? element.unfilled : 0
							})
							obj[element.date].yes.push({
								email: agent, count: (element.email == agent) ? element.yes : 0
							})
							obj[element.date].no.push({
								email: agent, count: (element.email == agent) ? element.no : 0
							})
						});
						// Object.assign(dummyJSON, obj);
					});
					this._analyticsService.updateChartSimple('column', true, [], dummyJSON);
				}
			}
		}, err => {
			// this._analyticsService.GetConversations([]);
			console.log('Error! Server unreachable.');
		});
	}

	ngOnInit() {
	}
	ngAfterViewInit() {
		this.chart = new Highcharts.Chart("highchart", this.options);
		this.rendered = true;
	}

	showTotal(indexExists, index?) {
		let count = 0;
		if (indexExists) {
			this.options.series.map(s => {
				count += s.data[index]
			})
		} else {
			this.options.series.forEach(element => {
				count += element.data.reduce((a, b) => a + b, 0);
			});
		}
		return count;
	}

	showPercentage(){
		let count = 0;
		let unfilled = 0;
		this.options.series.forEach(element => {
			count += element.data.reduce((a, b) => a + b, 0);
		});
		if(!this.selectedAgents.length){
			this.options.series[0].data.forEach(element => {
				unfilled += element;
			});
		}else{
			this.options.series.forEach(s => {
				unfilled += s.data[0];
			});
		}
		// console.log(count);
		// console.log(unfilled);
		// console.log(this.options);
		
		if(count && unfilled){
			return Math.round(((unfilled / count) * 100)) + '%';
		}else{
			return '0%'
		}

		// return '0%'
	}

	showSeriesCount(index){
		let count = 0;
		this.options.series[index].data.forEach(element => {
			count += element;
		});
		return count;
	}

	Export(){
		console.log('Exporting...');
		// console.log(this.agentTableData);
		
		this._analyticsService.exportHTMLToExcel('agentExperience', 'ChatExperience-'+new Date().getTime());
	}

	getKeys(obj){
		let keys = [];
		Object.keys(obj).map(k => {
			keys.push(k);
		});
		return keys;
	}

	getValueAgainstKey(obj,date,key, agent){
		return obj[date][key].filter(a => a.email == agent)[0].count;
	}
	

	ngOnDestroy(){
		this.subscriptions.forEach(subscription => {
			subscription.unsubscribe();
		});
	}
}
