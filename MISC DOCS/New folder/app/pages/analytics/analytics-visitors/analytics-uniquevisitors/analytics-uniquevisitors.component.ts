import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from '../../../../../services/AuthenticationService';
import { AnalyticsService } from '../../../../../services/AnalyticsService';
import * as Highcharts from 'highcharts';
require('highcharts/modules/exporting')(Highcharts);
require('highcharts/modules/export-data')(Highcharts);

@Component({
	selector: 'app-analytics-uniquevisitors',
	templateUrl: './analytics-uniquevisitors.component.html',
	styleUrls: ['./analytics-uniquevisitors.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class AnalyticsUniquevisitorsComponent implements OnInit {

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
			text: 'Unique Visitors'
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
			pointFormat: "<div>{point.y} visitors </div>"
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
		}));
		this.subscriptions.push(_analyticsService.options.subscribe(data => {
			if(this.rendered){
				if(data.title.text) {
					this.options.title.text = 'Unique Visitors (' + data.title.text + ')'
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
		this._analyticsService.GetUniqueVisitors(event.csid,event.selectedDateType, event.selectedDate).subscribe(data => {
			// let visitorIDs = [];
			let uniqueVisitors = 0;
			data.json().forEach(element => {
				uniqueVisitors += element['uniqueVisitors'];
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
							daysData.filter(t => t.name == (this._analyticsService.dayNames[new Date(day).getDay()] + " " + new Date(day).getDate()))[0].value += element.uniqueVisitors;
						}
					});
					if (!data.json().length) {
						this._analyticsService.updateChart('line', daysData, 'flat', 'Total Visitors', true);
					} else {
						this._analyticsService.updateChart('line', daysData, 'flat', 'Total Visitors', false, uniqueVisitors);
					}
				} else if (event.selectedComparison.match(/months/g)) {

					let temp_graph = this._analyticsService.diffMonth(date1, date2);
					data.json().forEach(element => {
						let month = this._analyticsService.monthNames[new Date(element._id).getMonth()];
						if (temp_graph.filter(t => t.name == month).length) {
							temp_graph.filter(t => t.name == month)[0].value += element.uniqueVisitors;
						}
					});
					if (!data.json().length) {
						this._analyticsService.updateChart('line', temp_graph, 'flat', 'Total Visitors', true);
					} else {
						this._analyticsService.updateChart('line', temp_graph, 'flat', 'Total Visitors', false, uniqueVisitors);
					}
				} else if (event.selectedComparison.match(/years/g)) {
					// console.log('Matches months and years');
					let yearsData = this._analyticsService.diffYear(date1, date2);
					data.json().forEach(element => {
						let year = new Date(element._id).getFullYear().toString();
						if (yearsData.filter(t => t.name == year).length) {
							yearsData.filter(t => t.name == year)[0].value += element.uniqueVisitors;
						}
					});
					// console.log(yearsData);

					if (!data.json().length) {
						this._analyticsService.updateChart('column', yearsData, 'flat', 'Total Visitors', true);
					} else {
						this._analyticsService.updateChart('column', yearsData, 'flat', 'Total Visitors', false, uniqueVisitors);
					}
				}
			} else {
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
										s.value = element.uniqueVisitors;
									}
								});
							} else if (time >= 12) {
								let n = time - 12;
								secondHalf.forEach(s => {
									if (s.name == ((n == 0) ? 12 + ' PM' : n + ' PM')) {
										s.value = element.uniqueVisitors;
									}
								});
							}
						});
						// this.graph_uniqueVisitors = today_Data;		
						if (!data.json().length) {
							this._analyticsService.updateChart('line', firstHalf.concat(secondHalf), 'flat', 'Total Visitors', true);
							// return;
						} else {
							this._analyticsService.updateChart('line', firstHalf.concat(secondHalf), 'flat', 'Total Visitors', false, uniqueVisitors);
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
								temp_graph.filter(t => t.name == month)[0].value += element.uniqueVisitors;
							}
						});
						// this.graph_uniqueVisitors = graph_week;
						if (!data.json().length) {
							this._analyticsService.updateChart('line', temp_graph, 'flat', 'Total Visitors', true);
							// return;
						} else {
							this._analyticsService.updateChart('line', temp_graph, 'flat', 'Total Visitors', false, uniqueVisitors);
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
								graph_month.filter(t => t.name == month)[0].value += element.uniqueVisitors;
							}
						});
						// this.graph_uniqueVisitors = graph_month;
						if (!data.json().length) {
							this._analyticsService.updateChart('line', graph_month, 'flat', 'Total Visitors', true);
							// return;
						} else {
							this._analyticsService.updateChart('line', graph_month, 'flat', 'Total Visitors', false, uniqueVisitors);
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
											s.value = element.uniqueVisitors;
										}
									});
								} else if (time >= 12) {
									let n = time - 12;
									secondHalf.forEach(s => {
										if (s.name == ((n == 0) ? 12 + ' PM' : n + ' PM')) {
											s.value = element.uniqueVisitors;
										}
									});
								}
							});
							if (!data.json().length) {
								this._analyticsService.updateChart('line', firstHalf.concat(secondHalf), 'flat', 'Total Visitors', true);
								// return;
							} else {
								this._analyticsService.updateChart('line', firstHalf.concat(secondHalf), 'flat', 'Total Visitors', false, uniqueVisitors);
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
									graph_week.filter(t => t.name == month)[0].value += element.uniqueVisitors;
								}
							});
							// this.graph_uniqueVisitors = graph_week;
							if (!data.json().length) {
								this._analyticsService.updateChart('line', graph_week, 'flat', 'Total Visitors', true);
								// return;
							} else {
								this._analyticsService.updateChart('line', graph_week, 'flat', 'Total Visitors', false, uniqueVisitors);
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
									temp_graph.filter(t => t.name == month)[0].value += element.uniqueVisitors;
								}
							});
							// this.graph_uniqueVisitors = graph_month;
							if (!data.json().length) {
								this._analyticsService.updateChart('line', temp_graph, 'flat', 'Total Visitors', true);
								// return;
							} else {
								this._analyticsService.updateChart('line', temp_graph, 'flat', 'Total Visitors', false, uniqueVisitors);
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
		
		this._analyticsService.exportHTMLToExcel('uniqueVisitors', 'UniqueVisitors-'+new Date().getTime());
	}
	ngOnDestroy(){
		this.subscriptions.forEach(subscription => {
			subscription.unsubscribe();
		})
	}

}
