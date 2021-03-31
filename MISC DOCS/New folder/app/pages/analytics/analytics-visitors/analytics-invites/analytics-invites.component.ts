import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../../services/AuthenticationService';
import { AnalyticsService } from '../../../../../services/AnalyticsService';
import { Subscription } from 'rxjs/Subscription';
import * as Highcharts from 'highcharts';
import { ChatService } from '../../../../../services/ChatService';
import { GlobalStateService } from '../../../../../services/GlobalStateService';
require('highcharts/modules/exporting')(Highcharts);

@Component({
	selector: 'app-analytics-invites',
	templateUrl: './analytics-invites.component.html',
	styleUrls: ['./analytics-invites.component.css']
})
export class AnalyticsInvitesComponent implements OnInit {

	subscriptions: Subscription[] = [];
	loading = false;
	//HighChart Demo
	highcharts = Highcharts;
	additionalData: any;
	options: any = {
		accessibility: {
			enabled: true,
			description: 'This charts shows the total greeting messages sent/accepted'
		},
		chart: {
			type: 'column',
			backgroundColor: '#f5f6f8'
		},
		title: {
			text: 'Greetings'
		},
		tooltip: {
			animation: false,
			useHTML: true,
			shadow: false,
			headerFormat: "<div style='text-align:center;font-weight:bold'>{point.key}</div>",
			pointFormat: "<div>{point.y} {point.series.name} </div>"
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
			style: {
				backgroundColor: "#f5f6f8"
			}
		},
		exporting: {
			enabled: true,
			buttons: {
				contextButton: {
					theme: {
						fill: '#f5f6f8'
					},
					menuItems: [
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

	constructor(_authService: AuthService, public _analyticsService: AnalyticsService,private _globalStateService: GlobalStateService,
		private _chatService: ChatService) {
		this.subscriptions.push(_analyticsService.loading.subscribe(data => {
			this.loading = data;
		}));
		this.subscriptions.push(_analyticsService.options.subscribe(data => {
			if (this.rendered) {
				if (data.title.text) {
					this.options.title.text = 'Greetings (' + data.title.text + ')'
				} else {
					this.options.title.text = 'Greetings'
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
		this._analyticsService.GetTotalInvites(event.csid, event.selectedDateType,event.selectedDate).subscribe(data => {
			let totalGreetings = 0;
			data.json().forEach(element => {
				totalGreetings += element.greetings;
			});

			switch (event.selectedDateType) {
				case 'today':
				case 'yesterday':
					let series = [
						{
							name: "Greetings",
							data: [],
							value: 'greetings'
						},
						{
							name: "Accepted",
							data: [],
							value: 'accepted'
						}
					]

					let firstHalf = [];
					let secondHalf = [];
					for (let i = 0; i < 12; i++) {
						firstHalf.push((i == 0) ? '12 AM' : i + ' AM');
					}
					for (let i = 0; i < 12; i++) {
						secondHalf.push((i == 0) ? '12 PM' : i + ' PM');
					}
					let categories = firstHalf.concat(secondHalf);

					series.forEach(s => {
						if (data.json().length) {
							categories.forEach((c, index) => {
								s.data.push(0);
								data.json().forEach(element => {
									// let date = this.dateFormatter(new Date()) + 'T' + element._id + ':00:00.000Z';
									// let time = new Date(date).getHours();
									let time = Number(element._id);
									let matchingCriteria = '';
									if (time < 12) {
										matchingCriteria = ((time == 0) ? 12 + ' AM' : time + ' AM');
									} else if (time >= 12) {
										let n = time - 12;
										matchingCriteria = ((n == 0) ? 12 + ' PM' : n + ' PM');
									}

									if (c == matchingCriteria) {
										s.data[index] = element[s.value];
									}
								});
							})
						} else {
							categories.forEach(c => {
								s.data.push(0);
							})
						}
					});

					// console.log(categories);
					// console.log(series);
					this._analyticsService.updateChartSimple('column', true, categories, series, totalGreetings);
					break;
				case 'week':
					series = [
						{
							name: "Greetings",
							data: [],
							value: 'greetings'
						},
						{
							name: "Accepted",
							data: [],
							value: 'accepted'
						}
					]

					let graph_week = [];
					for (let i = 6; i >= 0; i--) {
						let date = this._analyticsService.SubtractDays(new Date(), i);
						graph_week.push(date.getDate() + ' ' + this._analyticsService.monthNames[date.getMonth()] + ' ' + date.getFullYear());
					}
					categories = graph_week;

					series.forEach(s => {
						if (data.json().length) {
							categories.forEach((c, index) => {
								s.data.push(0);
								data.json().forEach(element => {
									let matchingCriteria = Number(element._id.split('-')[2]) + ' ' + this._analyticsService.monthNames[new Date(element._id).getMonth()] + ' ' + new Date(element._id).getFullYear();
									if (c == matchingCriteria) {
										s.data[index] = element[s.value];
									}
								});
							})
						} else {
							categories.forEach(c => {
								s.data.push(0);
							})
						}
					});

					// console.log(categories);
					// console.log(series);
					this._analyticsService.updateChartSimple('column', true, categories, series, totalGreetings);
					break;
				case 'month':
					series = [
						{
							name: "Greetings",
							data: [],
							value: 'greetings'
						},
						{
							name: "Accepted",
							data: [],
							value: 'accepted'
						}
					]

					let graph_month = [];
					for (let i = 29; i >= 0; i--) {
						let date = this._analyticsService.SubtractDays(new Date(), i);
						graph_month.push(date.getDate() + ' ' + this._analyticsService.monthNames[date.getMonth()] + ' ' + date.getFullYear());
					}
					categories = graph_month;

					series.forEach(s => {
						if (data.json().length) {
							categories.forEach((c, index) => {
								s.data.push(0);
								data.json().forEach(element => {
									let matchingCriteria = Number(element._id.split('-')[2]) + ' ' + this._analyticsService.monthNames[new Date(element._id).getMonth()] + ' ' + new Date(element._id).getFullYear();
									if (c == matchingCriteria) {
										s.data[index] = element[s.value];
									}
								});
							})
						} else {
							categories.forEach(c => {
								s.data.push(0);
							})
						}
					});

					// console.log(categories);
					// console.log(series);
					this._analyticsService.updateChartSimple('column', true, categories, series, totalGreetings);
					break;
				default:
					var date1 = new Date(event.selectedDate.from);
					var date2 = new Date(event.selectedDate.to);
					if (this._analyticsService.daysBetween(date1, date2) == 0 || this._analyticsService.daysBetween(date1, date2) == 1) {
						let series = [
							{
								name: "Greetings",
								data: [],
								value: 'greetings'
							},
							{
								name: "Accepted",
								data: [],
								value: 'accepted'
							}
						];
						let firstHalf = [];
						let secondHalf = [];
						for (let i = 0; i < 12; i++) {
							firstHalf.push((i == 0) ? '12 AM' : i + ' AM');
						}
						for (let i = 0; i < 12; i++) {
							secondHalf.push((i == 0) ? '12 PM' : i + ' PM');
						}
						let categories = firstHalf.concat(secondHalf);
						let dummy = {};

						data.json().forEach((element, index) => {
							// let date = this.dateFormatter(new Date()) + 'T' + element._id + ':00:00.000Z';
							// let time = new Date(date).getHours();
							let time = Number(element._id);
							let transformedTime = '';
							if (time < 12) {
								transformedTime = ((time == 0) ? 12 + ' AM' : time + ' AM');
							} else if (time >= 12) {
								let n = time - 12;
								transformedTime = ((n == 0) ? 12 + ' PM' : n + ' PM');
							}
							let obj = {
								[transformedTime]: {
									greetings: element.greetings,
									accepted: element.accepted
								}
							}
							Object.assign(dummy, obj);
						});
						series.forEach(s => {
							categories.forEach((c, index) => {
								s.data.push(
									(dummy[c]) ? dummy[c][s.value] : 0
								);
							})
						});
						// console.log(categories);
						// console.log(series);
						this._analyticsService.updateChartSimple('column', true, categories, series, totalGreetings);
					} else {
						// console.log(date1);
						// console.log(date2);

						series = [
							{
								name: "Greetings",
								data: [],
								value: 'greetings'
							},
							{
								name: "Accepted",
								data: [],
								value: 'accepted'
							}
						];

						let graph_month = [];
						for (let i = this._analyticsService.daysBetween(date1, date2); i >= 0; i--) {
							let date = this._analyticsService.SubtractDays(new Date(event.selectedDate.to), i);
							graph_month.push(date.getDate() + ' ' + this._analyticsService.monthNames[date.getMonth()] + ' ' + date.getFullYear());
						}
						categories = graph_month;

						series.forEach(s => {
							if (data.json().length) {
								categories.forEach((c, index) => {
									s.data.push(0);
									data.json().forEach(element => {
										let matchingCriteria = Number(element._id.split('-')[2]) + ' ' + this._analyticsService.monthNames[new Date(element._id).getMonth()] + ' ' + new Date(element._id).getFullYear();
										if (c == matchingCriteria) {
											s.data[index] = element[s.value];
										}
									});
								})
							} else {
								categories.forEach(c => {
									s.data.push(0);
								})
							}
						});

						// console.log(categories);
						// console.log(series);
						this._analyticsService.updateChartSimple('column', true, categories, series, totalGreetings);
					}
					break;
			}

		}, err => {
			console.log('Error! Server unreachable.');
		});
	}
	ngAfterViewInit() {
		this.chart = new Highcharts.Chart("highchart", this.options);
		this.rendered = true;
	}

	showTotal(indexExists, index?) {
		let count = 0;
		if (indexExists) {
			this.options.series[index].data.forEach(element => {
				count += element;
			});
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
		
		this._analyticsService.exportHTMLToExcel('totalInvites', 'Greetings-'+new Date().getTime());
	}

	ngOnDestroy() {
		this.subscriptions.forEach(subscription => {
			subscription.unsubscribe();
		})
	}


}
