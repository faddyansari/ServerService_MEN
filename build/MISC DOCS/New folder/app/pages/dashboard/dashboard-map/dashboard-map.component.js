"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardMapComponent = void 0;
var core_1 = require("@angular/core");
var Highmaps = require("highcharts/highmaps");
require('highcharts/modules/exporting')(Highmaps);
var DashboardMapComponent = /** @class */ (function () {
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
    function DashboardMapComponent() {
        var _this = this;
        this._visitorList = [];
        this.visitorCount = 0;
        this.visitors_description = '';
        this.highmaps = Highmaps;
        //Highcharts variables
        this.countryData = [];
        this.countryData_fullname = [];
        this.options_country = {
            chart: {
                map: require('../../../../assets/world.geo.json'),
                events: {
                    load: function (e) {
                        e.target.showLoading();
                        _this.interval_country = setInterval(function () {
                            _this.updateVisitorByCountryData(_this.visitorList);
                            if (e.target.series) {
                                if (_this.visitorList.length) {
                                    _this.visitors_description = "Almost " + Math.round((_this.countryData_fullname[0].value / _this.visitorList.length) * 100) + "% of your total visitors are from " + _this.countryData_fullname[0].country + "!";
                                    e.target.series[0].setData(_this.countryData);
                                    e.target.hideLoading();
                                }
                                else {
                                    _this.visitors_description = 'You have currently no visitors.';
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
        };
    }
    Object.defineProperty(DashboardMapComponent.prototype, "visitorList", {
        get: function () {
            return this._visitorList;
        },
        set: function (value) {
            this._visitorList = value;
        },
        enumerable: false,
        configurable: true
    });
    DashboardMapComponent.prototype.ngOnInit = function () {
        this.chart_country = Highmaps.mapChart("highchart", this.options_country);
    };
    DashboardMapComponent.prototype.updateVisitorByCountryData = function (visitorList) {
        var _this = this;
        // let LatLong = [];
        var keys = [];
        var legend_data = [];
        this.groupBy(visitorList, function (visitor) { return visitor.country; }).forEach(function (element, key, index) {
            keys.push(key);
            keys.forEach(function (k) {
                if (k == key) {
                    legend_data.push({
                        "iso-a2": key,
                        "value": element.length
                    });
                }
            });
            _this.countryData = legend_data;
        });
        legend_data = [];
        this.groupBy(visitorList, function (visitor) { return visitor.fullCountryName; }).forEach(function (element, key, index) {
            keys.push(key);
            keys.forEach(function (k) {
                if (k == key) {
                    legend_data.push({
                        "country": key,
                        "value": element.length
                    });
                }
            });
            legend_data.sort(function (a, b) {
                return (a.value > b.value) ? -1 : 1;
            });
            _this.countryData_fullname = legend_data;
        });
        // console.log(this.countryData_fullname.slice(0,5));
        this.countryData_fullname.forEach(function (c) {
            c.shortname = visitorList.filter(function (v) { return v.fullCountryName == c.country; })[0]['country'];
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
    };
    DashboardMapComponent.prototype.groupBy = function (list, keyGetter) {
        var map = new Map();
        list.forEach(function (item) {
            var key = keyGetter(item);
            var collection = map.get(key);
            if (!collection) {
                map.set(key, [item]);
            }
            else {
                collection.push(item);
            }
        });
        return map;
    };
    DashboardMapComponent.prototype.ngOnDestroy = function () {
        console.log(this.chart_country);
        if (this.chart_country) {
            // this.chart_country.destroy();
            clearInterval(this.interval_country);
        }
    };
    __decorate([
        core_1.Input()
    ], DashboardMapComponent.prototype, "visitorList", null);
    DashboardMapComponent = __decorate([
        core_1.Component({
            selector: 'app-dashboard-map',
            templateUrl: './dashboard-map.component.html',
            styleUrls: ['./dashboard-map.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], DashboardMapComponent);
    return DashboardMapComponent;
}());
exports.DashboardMapComponent = DashboardMapComponent;
//# sourceMappingURL=dashboard-map.component.js.map