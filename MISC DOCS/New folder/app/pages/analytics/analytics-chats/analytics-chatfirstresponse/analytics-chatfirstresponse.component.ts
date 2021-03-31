import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from '../../../../../services/AuthenticationService';
import { AnalyticsService } from '../../../../../services/AnalyticsService';
import { Subscription } from 'rxjs/Subscription';
import * as Highcharts from 'highcharts';
require('highcharts/modules/exporting')(Highcharts);

@Component({
	selector: 'app-analytics-chatfirstresponse',
	templateUrl: './analytics-chatfirstresponse.component.html',
	styleUrls: ['./analytics-chatfirstresponse.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class AnalyticsChatfirstresponseComponent implements OnInit {

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
			text: 'Chat Response'
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
				return  "<div>Chat response: <b>"+ str +"</b></div>";
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
					this.options.title.text = 'First Response Time (' + this.time_convert(data.title.text) + ')'
				}else{
					this.options.title.text = 'First Response Time';
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
		this._analyticsService.GetChatFirstResponseTime(event.csid, event.selectedDateType,event.selectedDate, event.selectedAgents).subscribe(data => {
			let totalDifference = 0;
			let arr = [];
			data.json().forEach(element => {
				totalDifference += element['responseTime'];
				arr.push({
					name: element['_id'],
					value: element['responseTime']
				})
			});
			// console.log(data.json());

			this._analyticsService.updateChart('column', arr, 'flat', 'First Response Time', false, totalDifference);

		}, err => {
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
		
		this._analyticsService.exportHTMLToExcel('chatResponse', 'AgentResponse-'+new Date().getTime());
	}

	ngOnDestroy(){
		this.subscriptions.forEach(subscription => {
			subscription.unsubscribe();
		})
	}
}
