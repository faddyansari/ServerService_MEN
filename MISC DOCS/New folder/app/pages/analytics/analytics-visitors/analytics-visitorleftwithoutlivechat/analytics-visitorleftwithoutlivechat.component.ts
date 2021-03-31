import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import * as Highcharts from 'highcharts';
import { AuthService } from '../../../../../services/AuthenticationService';
import { GlobalStateService } from '../../../../../services/GlobalStateService';
import { AnalyticsService } from '../../../../../services/AnalyticsService';

@Component({
  selector: 'app-analytics-visitorleftwithoutlivechat',
  templateUrl: './analytics-visitorleftwithoutlivechat.component.html',
  styleUrls: ['./analytics-visitorleftwithoutlivechat.component.css']
})
export class AnalyticsVisitorleftwithoutlivechatComponent implements OnInit {

  subscriptions: Subscription[] = [];
	loading = false;
	noDataAvailable = false;
	//HighChart Demo
	highcharts = Highcharts;
	visitorsLeftWithoutLiveChatData: any = [];
  country: any;
  agent : any;
	options: any;

  constructor(public _authService: AuthService,
		private _globalStateService: GlobalStateService,
		  public _analyticsService: AnalyticsService) { 
        this.subscriptions.push(_authService.getAgent().subscribe(agent => {
          this.agent = agent;
            }));
          this.subscriptions.push(_analyticsService.loading.subscribe(data => {
          this.loading = data;
            }));
      }

  ngOnInit() {
  }

  onFilterResult(event) {
			this.loading = true;			
			let packet =
			{
				"obj":
				{
					"nsp": this.agent.nsp,
					"country": event.selectedCountry,
					"from": new Date(event.selectedDate.from).toISOString(),
					"to": this._analyticsService.AddDays(new Date(event.selectedDate.to), 1).toISOString(),
					"timezone": this._analyticsService.timeZone,
				}
			};
			this._analyticsService.GetTotalVisitorsLeftWithoutLivechat(packet).subscribe(response => {	
        if(response['Visitors Left without LiveChat'] && response['Visitors Left without LiveChat'].length){
					this.visitorsLeftWithoutLiveChatData = response['Visitors Left without LiveChat'];
					this.noDataAvailable = false;
					if(this._analyticsService.daysBetween(new Date(event.selectedDate.from), this._analyticsService.AddDays(new Date(event.selectedDate.to), 1)) == 1){
            			setTimeout(() => {
              			this.populateGraph24Hour();
            			}, 0);
          			}else{
            			setTimeout(() => {
              			this.populateGraphTotal();
            			}, 0);
          				}
				}else{
					this.noDataAvailable = true
					let options: any = {
						chart: {
							plotBackgroundColor: null,
							plotBorderWidth: null,
							plotShadow: false
						},
						title: {
							text: 'No data available'
						},
						legend: {
							enabled: false
						},
						credits: {
							enabled: false
						},
						series: [{
							type: 'column',
							data: []
						}]
					}
					new Highcharts.Chart("highchart", options)
				}
	  
	  this.loading = false;
	}, err => {
		this.loading = false;
	})
		
  }


	populateGraph24Hour() {
		let options: any = {
			accessibility: {
				enabled: true,
				description: 'This charts shows the count of visitors left without registration to liveChat'
			},
			chart: {
				type: 'column',
				backgroundColor: '#f5f6f8',
			},
			title: {
				text: 'Visitors left without registration to livechat'
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
					text: 'Number of Visitors left'
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
		this.visitorsLeftWithoutLiveChatData.forEach(element => {
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
				description: 'This charts shows the count of visitors left without registration to liveChat'
			},
			chart: {
				type: 'column',
				backgroundColor: '#f5f6f8',
			},
			title: {
				text: 'Visitors left without registration to livechat'
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
				categories: ['Visitors left without come to livechat']
			},
			yAxis: {
				title: {
					text: 'Number of Visitors left'
				}
			},
			series: [{}]
		};
		let series = [];
		this.visitorsLeftWithoutLiveChatData.forEach(element => {
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



  showTotal(array){
		let total = 0;
		array.forEach(element => {
			total += element;
		});
		return total
	}

	Export() {

		this._analyticsService.exportHTMLToExcel('visLeftWithoutLiveChat', 'VisLeftWithoutLiveChat-' + new Date().getTime());
	}

	ngOnDestroy() {
		this.subscriptions.forEach(subscription => {
			subscription.unsubscribe();
		})
	}

}
