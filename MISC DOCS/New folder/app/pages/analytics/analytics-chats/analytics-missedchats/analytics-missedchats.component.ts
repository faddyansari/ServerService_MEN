import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from '../../../../../services/AuthenticationService';
import { AnalyticsService } from '../../../../../services/AnalyticsService';
import { Subscription } from 'rxjs/Subscription';
import * as Highcharts from 'highcharts';
import { GlobalStateService } from '../../../../../services/GlobalStateService';
import { ChatService } from '../../../../../services/ChatService';
require('highcharts/modules/exporting')(Highcharts);

@Component({
	selector: 'app-analytics-missedchats',
	templateUrl: './analytics-missedchats.component.html',
	styleUrls: ['./analytics-missedchats.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class AnalyticsMissedchatsComponent implements OnInit {

	subscriptions: Subscription[] = [];
	loading = false;
	//HighChart Demo
	highcharts = Highcharts;
	missedChatData: any = [];
	agent: any;
	options: any;
	selectedDate: any;
	selectedAgents = [];

	constructor(public _authService: AuthService,
		private _globalStateService: GlobalStateService,
		private _chatService: ChatService,
		public _analyticsService: AnalyticsService) {
		this.subscriptions.push(_authService.getAgent().subscribe(agent => {
			this.agent = agent;
			// console.log(this.agent);	
		}));
		this.subscriptions.push(_analyticsService.loading.subscribe(data => {
			this.loading = data;
		}));

	}

	ngOnInit() {
	}
	onFilterResult(event) {
		// console.log(event);
		this.selectedDate = {
			from: new Date(event.selectedDate.from).toISOString(),
			to: this._analyticsService.AddDays(new Date(event.selectedDate.to), 1).toISOString()
		}
		this.selectedAgents = event.selectedAgents;
		let packet =
		{
			"obj":
			{
				"nsp": this.agent.nsp,
				"agents": event.selectedAgents,
				// "nsp": "/sbtjapaninquiries.com",
				// "agents": ["jjaved9481@sbtjapan.com"],
				"from": new Date(event.selectedDate.from).toISOString(),
				"to": this._analyticsService.AddDays(new Date(event.selectedDate.to), 1).toISOString(),
				"timezone": this._analyticsService.timeZone
			}
		};
		this._analyticsService.GetMissedChats(packet).subscribe(response => {
			if (response && response["Total assigned chats but not entertained by agent:"] && response["Total assigned chats but not entertained by agent:"].length) {
				this.missedChatData = response["Total assigned chats but not entertained by agent:"];
				if (this._analyticsService.daysBetween(new Date(event.selectedDate.from), this._analyticsService.AddDays(new Date(event.selectedDate.to), 1)) == 1) {
					setTimeout(() => {
						this.populateGraph24Hour();
					}, 0);
				} else {
					setTimeout(() => {
						this.populateGraphTotal();
					}, 0);
				}
			}
		})
	}


	populateGraph24Hour() {
		let options: any = {
			accessibility: {
				enabled: true,
				description: 'This charts shows the total missed chats count'
			},
			chart: {
				type: 'column',
				backgroundColor: '#f5f6f8',
			},
			title: {
				text: 'Missed Chats'
			},
			tooltip: {
				animation: false,
				useHTML: true,
				shadow: false,
				headerFormat: "<div style='text-align:center;font-weight:bold'>{point.key}</div>",
				pointFormat: "<div>{point.series.name} : {point.y}</div>"
			},
			plotOptions: {
				column: {
					events: {
						click: (event) => {
							// console.log(event);
							// console.log(this.selectedDate);
							let query = [];

							if (this.selectedAgents.length) {
								query = [
									{
										"$match": {
											"nsp": this.agent.nsp,
											"createdOn": {
												"$lte": this.selectedDate.to,
												"$gte": this.selectedDate.from
											},
											"assigned_to": { "$ne": [] }
										}
									},
									{
										"$unwind": {
											"path": "$assigned_to"
										}
									},
									{
										"$match": {
											"$expr": {
												"$eq": ['$assigned_to.email', '$agentEmail']
											}
										}
									},
									{
										"$match": {
											"assigned_to.email": { "$in": this.selectedAgents },
											"assigned_to.firstResponseTime": { "$eq": '' }
										}
									},
									{
										"$sort": { "_id": -1 }
									}
								]
							} else {
								query = [
									{
										"$match": {
											"nsp": this.agent.nsp,
											"createdOn": {
												"$lte": this.selectedDate.to,
												"$gte": this.selectedDate.from
											},
											"assigned_to": { "$ne": [] },
											"endingDate": {
												"$exists": true
											}
										}
									},
									{
										"$unwind": {
											"path": "$assigned_to"
										}
									},
									{
										"$match": {
											"$expr": {
												"$eq": ['$assigned_to.email', '$agentEmail']
											}
										}
									},
									{
										"$match": {
											"assigned_to.firstResponseTime": { "$eq": '' }
										}
									},
									{
										"$sort": { "_id": -1 }
									}
								]
							}
							this._chatService.getArchivesFromBackend({}, query);
							this._chatService.setActiveTab('ARCHIVE');
							this._globalStateService.NavigateTo('/chats');

						}
					}
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
				categories: []
			},
			yAxis: {
				title: {
					text: ''
				}
			},
			series: [{}]
		};
		let series = [];
		let firstHalf = [];
		let secondHalf = [];
		for (let i = 0; i < 12; i++) {
			firstHalf.push((i == 0) ? '12 AM' : i + ' AM');
		}
		for (let i = 0; i < 12; i++) {
			secondHalf.push((i == 0) ? '12 PM' : i + ' PM');
		}
		options.xAxis.categories = firstHalf.concat(secondHalf);
		this.missedChatData.forEach(element => {
			series.push({
				name: element.name,
				data: element.data
			})
		});
		options.series = series;
		this.options = options;
		new Highcharts.Chart("highchart", options);
	}
	populateGraphTotal() {
		let options: any = {
			accessibility: {
				enabled: true,
				description: 'This charts shows the total missed chats count'
			},
			chart: {
				type: 'column',
				backgroundColor: '#f5f6f8',
			},
			title: {
				text: 'Missed Chats'
			},
			tooltip: {
				animation: false,
				useHTML: true,
				shadow: false,
				headerFormat: "<div style='text-align:center;font-weight:bold'>{point.key}</div>",
				pointFormat: "<div>{point.series.name} : {point.y}</div>"
			},
			plotOptions: {
				column: {
					events: {
						click: (event) => {
							let query = [];
							let date = {
								from: new Date(event.point.series.name).toISOString(),
								to: this._analyticsService.AddDays(new Date(event.point.series.name), 1).toISOString()
							}
							if (this.selectedAgents.length) {
								query = [
									{
										"$match": {
											"nsp": this.agent.nsp,
											"createdOn": {
												"$lte": date.to,
												"$gte": date.from
											},
											"assigned_to": { "$ne": [] }
										}
									},
									{
										"$unwind": {
											"path": "$assigned_to"
										}
									},
									{
										"$match": {
											"$expr": {
												"$eq": ['$assigned_to.email', '$agentEmail']
											}
										}
									},
									{
										"$match": {
											"assigned_to.email": { "$in": this.selectedAgents },
											"assigned_to.firstResponseTime": { "$eq": '' }
										}
									},
									{
										"$sort": { "_id": -1 }
									}
								]
							} else {
								query = [
									{
										"$match": {
											"nsp": this.agent.nsp,
											"createdOn": {
												"$lte": date.to,
												"$gte": date.from
											},
											"assigned_to": { "$ne": [] }
										}
									},
									{
										"$unwind": {
											"path": "$assigned_to"
										}
									},
									{
										"$match": {
											"$expr": {
												"$eq": ['$assigned_to.email', '$agentEmail']
											}
										}
									},
									{
										"$match": {
											"assigned_to.firstResponseTime": { "$eq": '' }
										}
									},
									{
										"$sort": { "_id": -1 }
									}
								]
							}
							this._chatService.getArchivesFromBackend({}, query);
							this._chatService.setActiveTab('ARCHIVE');
							this._globalStateService.NavigateTo('/chats');
						}
					}
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
				categories: ['Missed Chats']
			},
			yAxis: {
				title: {
					text: ''
				}
			},
			series: [{}]
		};
		let series = [];
		this.missedChatData.forEach(element => {
			let seriesObj = {
				name: element.name,
				data: []
			}
			let total = 0;
			element.data.forEach(d => {
				total += d;
			});
			seriesObj.data = [total];
			series.push(seriesObj);
		});
		// console.log(series);

		options.series = series;
		this.options = options;
		new Highcharts.Chart("highchart", options);
	}

	ngAfterViewInit() {
	}

	customFormatter(date: Date) {
		return ("0" + (Number(date.getMonth()) + 1)).slice(-2) + '-' + ("0" + date.getDate()).slice(-2) + '-' + date.getFullYear();
	}

	showTotal(array) {
		let total = 0;
		array.forEach(element => {
			total += element;
		});
		return total
	}

	Export() {
		console.log('Exporting...');
		// console.log(this.agentTableData);

		this._analyticsService.exportHTMLToExcel('missedChats', 'MissedChats-' + new Date().getTime());
	}

	ngOnDestroy() {
		this.subscriptions.forEach(subscription => {
			subscription.unsubscribe();
		})
	}



}
