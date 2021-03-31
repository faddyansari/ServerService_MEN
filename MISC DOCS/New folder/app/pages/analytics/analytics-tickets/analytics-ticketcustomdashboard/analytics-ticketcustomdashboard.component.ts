import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../../services/AuthenticationService';
import { Subscription } from 'rxjs';
import * as Highcharts from 'highcharts';
import { GlobalStateService } from '../../../../../services/GlobalStateService';
import { AnalyticsService } from '../../../../../services/AnalyticsService';
require('highcharts/modules/exporting')(Highcharts);
require('highcharts/highcharts-more')(Highcharts);

@Component({
	selector: 'app-analytics-ticketcustomdashboard',
	templateUrl: './analytics-ticketcustomdashboard.component.html',
	styleUrls: ['./analytics-ticketcustomdashboard.component.scss']
})
export class AnalyticsTicketcustomdashboardComponent implements OnInit {

	subscriptions: Subscription[] = [];
	loading = false;
	agent: any;
	highcharts = Highcharts;
	options: any = {
		chart: {
			// type: 'column',
			backgroundColor: '#f5f6f8'
		},
		title: {
			text: 'Inquiries'
		},
		tooltip: {
			animation: false,
			useHTML: true,
			shadow: false,
			shared: true
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
	data : any = [];
	customFields = [];
	constructor(private _stateService: GlobalStateService, private _analyticsService: AnalyticsService, private _authService: AuthService) {
		this.subscriptions.push(_authService.getAgent().subscribe(agent => {
			if (agent) this.agent = agent;
		}));
		this.subscriptions.push(_analyticsService.options.subscribe(data => {
			if (this.rendered) {
				if (data.title.text) {
					this.options.title.text = 'Inquiries (' + data.title.text + ')'
				} else {
					this.options.title.text = 'Inquiries';
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
		if (this.agent && (this.agent.nsp == '/sbtjapaninquiries.com' || this.agent.nsp == '/localhost.com')) {
			// console.log('NSP: ' + this.agent.nsp + ' allowed');
		} else {
			// console.log('NSP: ' + this.agent.nsp + ' not allowed');
			this._stateService.NavigateForce('/analytics/analytics-tickets/totaltickets');
		}
	}

	ngAfterViewInit() {
		this.chart = new Highcharts.Chart("highchart", this.options);
		this.rendered = true;
		
	}

	onFilterResult(event) {
		// console.log(event);
		if(this.agent.nsp == '/sbtjapaninquiries.com' || this.agent.nsp == '/localhost.com'){
			this.loading = true;			
			let packet =
			{
				"obj":
				{
					"nsp": this.agent.nsp,
					"group": event.selectedGroups,
					"from": new Date(event.selectedDate.from).toISOString(),
					"to": this._analyticsService.AddDays(new Date(event.selectedDate.to), 1).toISOString(),
					"timezone": this._analyticsService.timeZone,
					"fetchAll": event.fetchAllData,
					"customFields": event.dynamicFields
				}
			};
			this.customFields = event.dynamicFields;
			console.log(packet);
			this._analyticsService.GetTicketDashboardData(packet).subscribe(response => {
				// console.log(response['Inquiries:']);		
				if(response['Inquiries'] && !event.dynamicFields.length){
					this.data = response['Inquiries'];
					let categories = this.data.map(d => d._id);
					let series = [
						{ name: 'total', type: 'column', data: this.data.map(d => d.total) }
					];
					let total = 0;
					this.data.map(d => {
						total += d.total;
					});
					this._analyticsService.updateChartSimple('column', false, categories, series, total);
					
					let spider_categories = [];
					if(this.data.length){
						Object.keys(this.data[0]).map(key => {
							if (key != '_id' && key != 'total' && key != 'untagged') spider_categories.push(key);
						});
					}
					this.data.forEach(d => {
						let spiderwebOpt: any = {
		
							chart: {
								polar: true,
								type: 'line'
							},
			
							accessibility: {
								description: ''
							},
							exporting: {
								enabled: false
							},
							credits: {
								enabled: false
							},
							title: {
								text: 'Inquiry'
							},
			
							pane: {
								size: '80%'
							},
			
							xAxis: {
								categories: [],
								tickmarkPlacement: 'on',
								lineWidth: 0
							},
			
							yAxis: {
								gridLineInterpolation: 'polygon',
								lineWidth: 0,
								min: 0
							},
			
							tooltip: {
								shared: true
							},
			
							legend: {
								enabled: false
							},
			
							series: [],
			
							responsive: {
								rules: [{
									condition: {
										maxWidth: 500
									},
									chartOptions: {
										legend: {
											align: 'center',
											verticalAlign: 'bottom',
											layout: 'horizontal'
										},
										pane: {
											size: '70%'
										}
									}
								}]
							}
			
						};
						spiderwebOpt.xAxis.categories = spider_categories;
						spiderwebOpt.title.text = d._id + '(' + d.total + ')';
						let series = [{
							name: 'count',
							data: [d.weekdays, d.weekends, d.assigned, d.unassigned, d.tagged, d.free, d.complete, d["in-complete"]],
							pointPlacement: 'on'
						}];
						spiderwebOpt.series = series;
						setTimeout(() => {
							new Highcharts.Chart("spiderweb-" + d._id, spiderwebOpt);
						}, 1000);
					})
				}else if(response['Inquiries'] && event.dynamicFields.length){
					this.data = response['Inquiries'];
					if(this.data.length){
						let categories = this.data[0].data.map(d => d.name);
						let series = [];
						this.data.forEach(element => {
							let obj = {
								name: element._id,
								data : []
							}
							categories.forEach(category => {
								obj.data.push(element.data.filter(d => d.name == category)[0].count);
							});
							series.push(obj);
						});
						// let series = [
						// 	{ name: 'total', type: 'column', data: this.data.map(d => d.total) }
						// ];
						// let total = 0;
						// this.data.map(d => {
						// 	total += d.total;
						// });
						this._analyticsService.updateChartSimple('line', true, categories, series);
					}
				}
				this.loading = false;
			}, err => {
				this.loading = false;
			})
		}

		// setTimeout(() => {
		// 	console.log(packet);
			
		// }, 2000);
	}

	Export() {
		console.log('Exporting...');
		// console.log(this.agentTableData);

		this._analyticsService.exportHTMLToExcel('ticketDashboard', 'ticketDashboard-' + new Date().getTime());
	}

}
