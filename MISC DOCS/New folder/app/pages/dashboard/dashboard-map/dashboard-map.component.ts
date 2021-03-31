import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import * as Highmaps from 'highcharts/highmaps';
require('highcharts/modules/exporting')(Highmaps);

@Component({
	selector: 'app-dashboard-map',
	templateUrl: './dashboard-map.component.html',
	styleUrls: ['./dashboard-map.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class DashboardMapComponent implements OnInit {

	//Highcharts
	chart_country: Highmaps.Chart;

	_visitorList : any = [];
	visitorCount = 0;
	visitors_description = '';
	@Input() set visitorList(value){
		this._visitorList = value;		
	}
	get visitorList() : Array<any>{
		return this._visitorList;
	}
	highmaps = Highmaps;
	//Highcharts variables
	countryData = [];
	countryData_fullname = [];
	interval_country: any;
	options_country: any = {
		chart: {
			map: require('../../../../assets/world.geo.json'),
			events: {
				load: (e) => {
					e.target.showLoading();
					this.interval_country = setInterval(() => {			
						this.updateVisitorByCountryData(this.visitorList);
						if(e.target.series){
							if (this.visitorList.length) {
								this.visitors_description = "Almost " + Math.round((this.countryData_fullname[0].value / this.visitorList.length) * 100) + "% of your total visitors are from " + this.countryData_fullname[0].country + "!";
								e.target.series[0].setData(this.countryData);
								e.target.hideLoading();
							} else {
								this.visitors_description = 'You have currently no visitors.'
								e.target.showLoading('No Visitors!');
							}
						}
					}, 5000);
				}
			}
		},
		title: {
			text: ''
		},
		credits: {
			enabled: false
		},
		mapNavigation: {
			enabled: true,
			enableDoubleClickZoomTo: true,
			buttonOptions: {
				verticalAlign: 'bottom'
			}
		},
		colorAxis: {
			maxColor: '#66CED3',
			minColor: '#66CED3',
			type: 'logarithmic',
			min: 1
		},
		series: [
			{
				data: this.countryData,
				joinBy: ['iso-a2'],
				name: 'Visitors',
				states: {
					hover: {
						color: '#33BDC4'
					}
				},
				dataLabels: {
					enabled: true,
					color: '#717476',
					formatter: function () {
						if (this.point.value) {
							return this.point['iso-a2'];
						}
					}
				}
			}
		]
	}
	//options for longitude and latitude
	// options_country2: any = {
	// 	chart: {
	// 		map: require('../../../assets/world.geo.json'),
	// 		events: {
	// 			load: (e) => {
	// 				e.target.showLoading();
	// 				this.interval_country = setInterval(() => {
	// 					this.chart_country.series[2].setData(this.visitor_LatLong, true, null, true);
	// 					e.target.hideLoading();
	// 				}, 5000);
	// 			}
	// 		}
	// 	},
	// 	credits: {
	// 		enabled: false
	// 	},
	// 	title: {
	// 		text: 'Visitors by Country'
	// 	},
	// 	mapNavigation: {
	// 		enabled: true
	// 	},
	// 	tooltip: {
	// 		followPointer: false,
	// 		headerFormat: '',
	// 		pointFormat: '<b>{point.name}</b><br>Lat: {point.lat}, Lon: {point.lon} <br> IP: {point.ip} <br>'
	// 	},

	// 	series: [{
	// 		// Use the gb-all map with no data as a basemap
	// 		name: 'Basemap',
	// 		borderColor: '#A0A0A0',
	// 		nullColor: 'rgba(200, 200, 200, 0.3)',
	// 		showInLegend: false
	// 	}, {
	// 		name: 'Separators',
	// 		type: 'mapline',
	// 		nullColor: '#707070',
	// 		showInLegend: false,
	// 		enableMouseTracking: false
	// 	}, {
	// 		// Specify points using lat/lon
	// 		type: 'mappoint',
	// 		name: 'Countries',
	// 		color: Highcharts.getOptions().colors[0],
	// 		data: []
	// 	}]
	// }
	constructor() { }

	ngOnInit() {
		this.chart_country = Highmaps.mapChart("highchart", this.options_country);
		
	}

	updateVisitorByCountryData(visitorList) {
		// let LatLong = [];
		let keys = [];
		let legend_data = [];
		this.groupBy(visitorList, visitor => visitor.country).forEach((element, key, index) => {
			keys.push(key);
			keys.forEach(k => {
				if (k == key) {
					legend_data.push({
						"iso-a2": key,
						"value": element.length
					});
				}
			});
			this.countryData = legend_data;
		});
		legend_data = [];
		this.groupBy(visitorList, visitor => visitor.fullCountryName).forEach((element, key, index) => {
			keys.push(key);
			keys.forEach(k => {
				if (k == key) {
					legend_data.push({
						"country": key,
						"value": element.length
					});
				}
			});
			legend_data.sort((a, b) => {
				return (a.value > b.value) ? -1 : 1
			});
			this.countryData_fullname = legend_data;
		});
		// console.log(this.countryData_fullname.slice(0,5));
		this.countryData_fullname.forEach(c => {
			c.shortname = visitorList.filter(v => v.fullCountryName == c.country)[0]['country'];
		});
		// console.log(this.countryData_fullname);
		// visitorList.map(v => {
		// 	if (v.cordinates && v.cordinates.latitude) {
		// 		LatLong.push({
		// 			name: v.country,
		// 			lat: Number(v.cordinates.latitude),
		// 			lon: Number(v.cordinates.longitude),
		// 			ip: v.ip
		// 		});
		// 	}
		// });
		// console.log(LatLong);

		// this.visitor_LatLong = LatLong;
	}

	groupBy(list, keyGetter) {
		const map = new Map();
		list.forEach((item) => {
			const key = keyGetter(item);
			const collection = map.get(key);
			if (!collection) {
				map.set(key, [item]);
			} else {
				collection.push(item);
			}
		});
		return map;
	}

	ngOnDestroy(){
		console.log(this.chart_country);
		
		if(this.chart_country){
			// this.chart_country.destroy();
			clearInterval(this.interval_country);
		}
	}

}
