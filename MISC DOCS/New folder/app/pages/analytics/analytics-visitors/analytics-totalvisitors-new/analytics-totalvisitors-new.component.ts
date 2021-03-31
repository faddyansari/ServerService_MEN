import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import * as Highcharts from 'highcharts';
import { AuthService } from '../../../../../services/AuthenticationService';
import { GlobalStateService } from '../../../../../services/GlobalStateService';
import { AnalyticsService } from '../../../../../services/AnalyticsService';

@Component({
  selector: 'app-analytics-totalvisitors-new',
  templateUrl: './analytics-totalvisitors-new.component.html',
  styleUrls: ['./analytics-totalvisitors-new.component.css']
})
export class AnalyticsTotalvisitorsNewComponent implements OnInit {

  subscriptions: Subscription[] = [];
  loading = false;
  noDataAvailable = false;
	//HighChart Demo
	highcharts = Highcharts;
	totalVisitorsData: any = [];
  country: any;
  agent : any;
	options: any;

  constructor(public _authService: AuthService,
		private _globalStateService: GlobalStateService,
      public _analyticsService: AnalyticsService) 
      {
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
		// console.log(event);
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
			this._analyticsService.GetTotalVisitorsNew(packet).subscribe(response => {	
        let options: any = {
          chart: {
            type: 'column',
            backgroundColor: '#f5f6f8',
          },
          title: {
            text: 'Total Visitors'
          },
          subtitle: {
            text: ''
          },
          tooltip: {
            animation: false,
            useHTML: true,
            shadow: false,
            headerFormat: "<div style='text-align:center;font-weight:bold'>{point.key}</div>",
            pointFormat: '{series.name}: <b>{point.y}</b> ({point.percentage:.1f}%)<br/>'
          },
          yAxis: {
            title: {
                text: 'Number of Visitors'
              }
          },
          xAxis: {
            accessibility: {
              rangeDescription: '24 hour time division'
            },
            categories:[]
          },

          series: [{}],
          legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom'
          },
          plotOptions: {
            series: {
              stacking: 'normal'
            }
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
          credits: {
              enabled: false
            },

    responsive: {
        rules: [{
            condition: {
                maxWidth: 500
            },
            chartOptions: {
                legend: {
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom'
                  }
              }
            }]
      }

          // chart: {
          //   type: 'column',
          //   
          // },
          // colors: [
          //   "#4384ff",
          //   "#307F00",
          //   "#262687",
          //   "#4A3341",
          //   "#3B3B3B",
          //   "#009AC0",
          //   "#EA5F40",
          //   "#009C8E"
          // ],
          // 
          // legend: {
          //   enabled: true
          // },
          // xAxis: {
          //   categories: []
          // },
          // yAxis: {
          //   title: {
          //     text: ''
          //   }
          // },
        };	
        if(response['Total Visitor'] && response['Total Visitor'].length){
          this.totalVisitorsData = response['Total Visitor'];
          this.noDataAvailable = false;
					if(this.totalVisitorsData.length){
						let categories = this.totalVisitorsData[0].data.map(d => d.hour);
            
            let series = [];
						this.totalVisitorsData.forEach(element => {
							let obj = {
								name: element._id,
								data : []
							}
							categories.forEach(category => {
								obj.data.push(element.data.filter(d => d.hour == category)[0].count);
							});
							series.push(obj);
            });
            options.xAxis.categories = categories;
            options.series = series;
            this.options = options;
            setTimeout(() => {
              new Highcharts.Chart("highchart", options);
            }, 1500);
						
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
  
  Export() {
		console.log('Exporting...');
		this._analyticsService.exportHTMLToExcel('totalVisitors', 'TotalVisitors-' + new Date().getTime());
	}


  showTotal(array){
		let total = 0;
		array.forEach(element => {
			total += element['count'];
		});
		return total
	}
}
