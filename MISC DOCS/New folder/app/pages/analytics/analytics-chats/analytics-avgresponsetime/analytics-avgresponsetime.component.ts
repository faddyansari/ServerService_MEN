import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from '../../../../../services/AuthenticationService';
import { AnalyticsService } from '../../../../../services/AnalyticsService';
import { Subscription } from 'rxjs/Subscription';
import * as Highcharts from 'highcharts';
import { UtilityService } from '../../../../../services/UtilityServices/UtilityService';
require('highcharts/modules/exporting')(Highcharts);

@Component({
	selector: 'app-analytics-avgresponsetime',
	templateUrl: './analytics-avgresponsetime.component.html',
	styleUrls: ['./analytics-avgresponsetime.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class AnalyticsAvgresponsetimeComponent implements OnInit {

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
			text: 'Avg Response Time'
		},
		tooltip: {
			animation: false,
			useHTML: true,
			shadow: false,
			headerFormat: "<div style='text-align:center;font-weight:bold'>{point.series.name}</div>",
			pointFormatter: function () {
				var num = this.y;
				var days = Math.floor((num / 24) / 60);
				var hours = Math.floor((num / 60) % 24);
				var minutes = Math.round(num % 60);
				var seconds = Math.round(num * 60 % 60);
				let str = (days) ? days + ' day ' : '';
				str += (hours) ? hours + " hr " : '';
				(minutes) ? str += minutes + ' min ' : '';
				(seconds) ? str += seconds + 's' : '';
				return "<div><b>" + str + "</b></div><div>"+this.chats+" chats</div>";
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
			},
			labels: {
				formatter: function () {
					var num = this.value;
					var days = Math.floor((num / 24) / 60);
					var hours = Math.floor((num / 60) % 24);
					var minutes = Math.round(num % 60);
					var seconds = Math.round(num * 60 % 60);
					let str = (days) ? days + ' d ' : '';
					str += (hours) ? hours + " h " : '';
					(minutes) ? str += minutes + ' m ' : '';
					(seconds) ? str += seconds + 's' : '';
					return str;
				}
			}
		},
		series: [{}]
	};
	chart: Highcharts.Chart;
	rendered = false;

	constructor(_authService: AuthService, private _utilityService: UtilityService, public _analyticsService: AnalyticsService) {
		this.subscriptions.push(_analyticsService.loading.subscribe(data => {
			this.loading = data;
		}));
		this.subscriptions.push(_analyticsService.options.subscribe(data => {
			if (this.rendered) {
				if (data.title.text) {
					this.options.title.text = 'Avg Response Time (' + this.time_convert(data.title.text) + ')'
				} else {
					this.options.title.text = 'Avg Response Time';
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
		let groupAgents = [];
				if (event.selectedGroups.length) {
					this._utilityService.getAgentsAgainstGroup(event.selectedGroups).subscribe(agents => {
						// console.log(agents);
						groupAgents = agents;
					})
				}

				this._analyticsService.GetAverageResponseTime(event.csid, event.selectedDateType,event.selectedDate, (groupAgents.length) ? groupAgents : event.selectedAgents).subscribe(data => {
					// console.log(data.json());
					let responseData = data.json();
					// let totalDifference = 0;
					let series = [];
					let distinctDates = [];
					// let categories = [];
					// console.log('avg response get call result : ',responseData);
					distinctDates = responseData.map(item => item.date)
						.filter((value, index, self) => self.indexOf(value) === index)
					// console.log('categories',distinctDates)

					if (event.selectedAgents.length || groupAgents.length) {
						if (event.selectedAgents) {
							event.selectedAgents.map(agent => {
								series.push({ name: agent, data: [], type: 'column' })
							})
						} else if (groupAgents.length) {
							groupAgents.map(agent => {
								series.push({ name: agent, data: [], type: 'column' })
							})
						}

						series.map(singleSeries => {
							distinctDates.map(singleDate => {
								let obj = responseData.filter(data => data.date === singleDate && singleSeries.name === data.email)[0];
								if (obj) {
									singleSeries.data.push({ y: obj.avgResponseTime, chats: data.chatCount.length });
								} else {
									singleSeries.data.push({ y: 0, chats: 0 });
								}
							})
						})
					}
					// if(event.selectedGroups.length){
					// 	// console.log('Group selected!');

					// 	series.push({name : event.selectedGroups[0], data: [], type:'column'});
					// 	distinctDates.map(singleDate=>{
					// 		series[0].data.push({y: 0, chats: 0});
					// 		let obj = responseData.filter(data=> data.date === singleDate);
					// 		if(obj && obj.length){
					// 			obj.map(o => {
					// 				series[0].data[0].y += o.avgResponseTime;
					// 				series[0].data[0].chats += o.chatCount.length;
					// 			})
					// 		}
					// 	})							
					// }
					else {
						series.push({ name: 'Average Response Time', data: [], type: 'column' });
						responseData.map(data => {
							// console.log(data,'data')
							series[0].data.push({ y: data.avgResponseTime, chats: data.chatCount.length });
						})
					}

					// console.log('series : ',series)

					this._analyticsService.updateChartSimple('column', true, distinctDates, series);
				}, err => {
					console.log('Error! Server unreachable.');
				});
	}

	ngAfterViewInit() {
		this.chart = new Highcharts.Chart("highchart", this.options);
		this.rendered = true;
	}


	time_convert(num) {
		// num = Math.round(num); 
		// console.log(num);
		
		var days = Math.floor((num / 24) / 60);
		var hours = Math.floor((num / 60) % 24);
		var minutes = Math.round(num % 60);
		var seconds = Math.round(num * 60 % 60);
		let str = (days) ? days + ' day ' : '';
		str += (hours) ? hours + " hr " : '';
		(minutes) ? str += minutes + ' min ' : '';
		(seconds) ? str += seconds + 's' : '';
		// console.log(str);

		return (str) ? str : '';
	}

	showTotal(indexExists, index?) {
		let count = 0;
		if (indexExists) {
			this.options.series[index].data.forEach(element => {		
				count += element.y;
			});
		} else {
			this.options.series.forEach(element => {
				count += element.data.reduce((a, b) => a.y + b.y, 0);
			});
		}
		return this.time_convert(count);
	}

	Export() {
		console.log('Exporting...');
		// console.log(this.agentTableData);

		this._analyticsService.exportHTMLToExcel('avgResponse', 'AvgResponse-' + new Date().getTime());
	}

	ngOnDestroy() {
		this.subscriptions.forEach(subscription => {
			subscription.unsubscribe();
		})
	}

}
