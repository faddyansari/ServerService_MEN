import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from '../../../../../services/AuthenticationService';
import { AnalyticsService } from '../../../../../services/AnalyticsService';
import { Subscription } from 'rxjs/Subscription';

import * as Highcharts from 'highcharts';
require('highcharts/modules/exporting')(Highcharts);
require('highcharts/modules/export-data')(Highcharts);

@Component({
	selector: 'app-analytics-totalvisitors',
	templateUrl: './analytics-totalvisitors.component.html',
	styleUrls: ['./analytics-totalvisitors.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class AnalyticsTotalvisitorsComponent implements OnInit {

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
			text: 'Total Visitors'
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
		tooltip:{
			animation:false,
			useHTML: true,
			shadow: false,
			headerFormat: "<div style='text-align:center;font-weight:bold'>{point.key}</div>",
			pointFormat: "<div>{point.y} {point.series.name}</div>"
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
	constructor(_authService: AuthService, public _analyticsService: AnalyticsService) {
		this.subscriptions.push(_analyticsService.loading.subscribe(data => {
			this.loading = data;
			// console.log('Loading Graph data'+ data);
		}));
		this.subscriptions.push(_analyticsService.options.subscribe(data => {
			if(this.rendered){
				if(data.title.text) {
					this.options.title.text = 'Total Visitors (' + data.title.text + ')'
				}else{
					this.options.title.text = 'Total Visitors';
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
		this._analyticsService.GetTotalVisitors(event.csid, event.selectedDateType,event.selectedDate).subscribe(data => {
			// let visitorIDs = [];
			let total_visitors = 0;
			data.json().forEach(element => {
				total_visitors += element['totalVisitors'];
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
					let today_Data = [
						{
							name: 'browsing',
							series: []
						},
						{
							name: 'chatting',
							series: []
						},
						{
							name: 'invited',
							series: []
						},
						{
							name: 'unattended',
							series: []
						}
					];
					today_Data.forEach(t => {
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
								daysData.filter(t => t.name == (this._analyticsService.dayNames[new Date(day).getDay()] + " " + new Date(day).getDate()))[0].value += element[t.name];
							}
						});
						t.series = daysData;
					})
					if (!data.json().length) {
						this._analyticsService.updateChart('line', today_Data, 'dimensional', 'Total Visitors', true);
					} else {
						this._analyticsService.updateChart('line', today_Data, 'dimensional', 'Total Visitors', false, total_visitors);
					}
				} else if (event.selectedComparison.match(/months/g)) {
					let graph_month = [
						{
							name: 'browsing',
							series: []
						},
						{
							name: 'chatting',
							series: []
						},
						{
							name: 'invited',
							series: []
						},
						{
							name: 'unattended',
							series: []
						}
					];
					graph_month.forEach(g => {
						let temp_graph = this._analyticsService.diffMonth(date1, date2);
						data.json().forEach(element => {
							let month = this._analyticsService.monthNames[new Date(element._id).getMonth()];
							if (temp_graph.filter(t => t.name == month).length) {
								temp_graph.filter(t => t.name == month)[0].value += element[g.name];
							}
						});
						g.series = temp_graph;
					});
					if (!data.json().length) {
						this._analyticsService.updateChart('line', graph_month, 'dimensional', 'Total Visitors', true);
					} else {
						this._analyticsService.updateChart('line', graph_month, 'dimensional', 'Total Visitors', false, total_visitors);
					}
				} else if (event.selectedComparison.match(/years/g)) {
					// console.log('Matches months and years');
					let graph_year = [
						{
							name: 'browsing',
							series: []
						},
						{
							name: 'chatting',
							series: []
						},
						{
							name: 'invited',
							series: []
						},
						{
							name: 'unattended',
							series: []
						}
					];
					graph_year.forEach(g => {
						let yearsData = this._analyticsService.diffYear(date1, date2);
						data.json().forEach(element => {
							let year = new Date(element._id).getFullYear().toString();
							if (yearsData.filter(t => t.name == year).length) {
								yearsData.filter(t => t.name == year)[0].value += element[g.name];
							}
						});
						g.series = yearsData;
					});

					if (!data.json().length) {
						this._analyticsService.updateChart('column', graph_year, 'dimensional', 'Total Visitors', true);
					} else {
						this._analyticsService.updateChart('column', graph_year, 'dimensional', 'Total Visitors', false, total_visitors);
					}
				}
			} else {
				switch (event.selectedDateType) {
					case 'today':
					case 'yesterday':
						let today_Data = [
							{
								name: 'browsing',
								series: []
							},
							{
								name: 'chatting',
								series: []
							},
							{
								name: 'invited',
								series: []
							},
							{
								name: 'unattended',
								series: []
							}
						];
						today_Data.forEach(t => {
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
								Object.keys(element).map(key => {
									if (t.name == key) {
										// let date = this._analyticsService.dateFormatter(new Date()) + 'T' + element._id + ':00:00.000Z';
										// let time = new Date(date).getHours();
										let time = Number(element._id);
										if (time < 12) {
											firstHalf.forEach(s => {
												if (s.name == ((time == 0) ? 12 + ' AM' : time + ' AM')) {
													s.value = element[key]
												}
											});
										} else if (time >= 12) {
											let n = time - 12;
											secondHalf.forEach(s => {
												if (s.name == ((n == 0) ? 12 + ' PM' : n + ' PM')) {
													s.value = element[key]
												}
											});
										}
									}
								})
							});
							t.series = firstHalf.concat(secondHalf);
						})
						// this.graph_totalVisitors = today_Data;		
						if (!data.json().length) {
							this._analyticsService.updateChart('line', today_Data, 'dimensional', 'Total Visitors', true);
							// return;
						} else {
							this._analyticsService.updateChart('line', today_Data, 'dimensional', 'Total Visitors', false, total_visitors);
						}
						break;
					case 'week':
						let graph_week = [
							{
								name: 'browsing',
								series: []
							},
							{
								name: 'chatting',
								series: []
							},
							{
								name: 'invited',
								series: []
							},
							{
								name: 'unattended',
								series: []
							}
						];
						graph_week.forEach(g => {
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
									temp_graph.filter(t => t.name == month)[0].value += element[g.name];
								}
							});
							g.series = temp_graph;
						});
						// this.graph_totalVisitors = graph_week;
						if (!data.json().length) {
							this._analyticsService.updateChart('line', graph_week, 'dimensional', 'Total Visitors', true);
							// return;
						} else {
							this._analyticsService.updateChart('line', graph_week, 'dimensional', 'Total Visitors', false, total_visitors);
						}
						break;
					case 'month':
						let graph_month = [
							{
								name: 'browsing',
								series: []
							},
							{
								name: 'chatting',
								series: []
							},
							{
								name: 'invited',
								series: []
							},
							{
								name: 'unattended',
								series: []
							}
						];
						graph_month.forEach(g => {
							let temp_graph = [];
							for (let i = 29; i >= 0; i--) {
								temp_graph.push({
									name: this._analyticsService.monthNames[new Date(this._analyticsService.dateFormatter(this._analyticsService.SubtractDays(new Date(), i))).getMonth()] + "'" + new Date(this._analyticsService.dateFormatter(this._analyticsService.SubtractDays(new Date(), i))).getDate(),
									value: 0
								});
							}
							data.json().forEach(element => {
								let month = (this._analyticsService.monthNames[new Date(element._id).getMonth()] + "'" + new Date(element._id).getDate());
								if (temp_graph.filter(t => t.name == month).length) {
									temp_graph.filter(t => t.name == month)[0].value += element[g.name];
								}
							});
							g.series = temp_graph;
						});
						// this.graph_totalVisitors = graph_month;
						if (!data.json().length) {
							this._analyticsService.updateChart('line', graph_month, 'dimensional', 'Total Visitors', true);
							// return;
						} else {
							this._analyticsService.updateChart('line', graph_month, 'dimensional', 'Total Visitors', false, total_visitors);
						}
						break;
					default:
						var date1 = new Date(event.selectedDate.from);
						var date2 = new Date(event.selectedDate.to);
						if (this._analyticsService.daysBetween(date1, date2) == 0 || this._analyticsService.daysBetween(date1, date2) == 1) {
							let today_Data = [
								{
									name: 'browsing',
									series: []
								},
								{
									name: 'chatting',
									series: []
								},
								{
									name: 'invited',
									series: []
								},
								{
									name: 'unattended',
									series: []
								}
							];
							today_Data.forEach(t => {
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
									Object.keys(element).map(key => {
										if (t.name == key) {
											// let date = this._analyticsService.dateFormatter(new Date()) + 'T' + element._id + ':00:00.000Z';
											// let time = new Date(date).getHours();
											let time = Number(element._id);
											if (time < 12) {
												firstHalf.forEach(s => {
													if (s.name == ((time == 0) ? 12 + ' AM' : time + ' AM')) {
														s.value = element[key]
													}
												});
											} else if (time >= 12) {
												let n = time - 12;
												secondHalf.forEach(s => {
													if (s.name == ((n == 0) ? 12 + ' PM' : n + ' PM')) {
														s.value = element[key]
													}
												});
											}
										}
									})
								});
								t.series = firstHalf.concat(secondHalf);
							})
							if (!data.json().length) {
								this._analyticsService.updateChart('line', today_Data, 'dimensional', 'Total Visitors', true);
								// return;
							} else {
								this._analyticsService.updateChart('line', today_Data, 'dimensional', 'Total Visitors', false, total_visitors);
							}
						} else if (this._analyticsService.daysBetween(date1, date2) < 16) {
							let graph_week = [
								{
									name: 'browsing',
									series: []
								},
								{
									name: 'chatting',
									series: []
								},
								{
									name: 'invited',
									series: []
								},
								{
									name: 'unattended',
									series: []
								}
							];
							graph_week.forEach(g => {
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
										temp_graph.filter(t => t.name == month)[0].value += element[g.name];
									}
								});
								g.series = temp_graph;
							});
							// this.graph_totalVisitors = graph_week;
							if (!data.json().length) {
								this._analyticsService.updateChart('line', graph_week, 'dimensional', 'Total Visitors', true);
								// return;
							} else {
								this._analyticsService.updateChart('line', graph_week, 'dimensional', 'Total Visitors', false, total_visitors);
							}
						} else {
							let graph_month = [
								{
									name: 'browsing',
									series: []
								},
								{
									name: 'chatting',
									series: []
								},
								{
									name: 'invited',
									series: []
								},
								{
									name: 'unattended',
									series: []
								}
							];
							graph_month.forEach(g => {
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
										temp_graph.filter(t => t.name == month)[0].value += element[g.name];
									}
								});
								g.series = temp_graph;
							});
							// this.graph_totalVisitors = graph_month;
							if (!data.json().length) {
								this._analyticsService.updateChart('line', graph_month, 'dimensional', 'Total Visitors', true);
								// return;
							} else {
								this._analyticsService.updateChart('line', graph_month, 'dimensional', 'Total Visitors', false, total_visitors);
							}
						}
						break;
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
		
		this._analyticsService.exportHTMLToExcel('totalVisitors', 'TotalVisitors-'+new Date().getTime());
	}
	ngOnDestroy(){
		this.subscriptions.forEach(subscription => {
			subscription.unsubscribe();
		})
	}

}
