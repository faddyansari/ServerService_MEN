"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsTotalvisitorsNewComponent = void 0;
var core_1 = require("@angular/core");
var Highcharts = require("highcharts");
var AnalyticsTotalvisitorsNewComponent = /** @class */ (function () {
    function AnalyticsTotalvisitorsNewComponent(_authService, _globalStateService, _analyticsService) {
        var _this = this;
        this._authService = _authService;
        this._globalStateService = _globalStateService;
        this._analyticsService = _analyticsService;
        this.subscriptions = [];
        this.loading = false;
        this.noDataAvailable = false;
        //HighChart Demo
        this.highcharts = Highcharts;
        this.totalVisitorsData = [];
        this.subscriptions.push(_authService.getAgent().subscribe(function (agent) {
            _this.agent = agent;
        }));
        this.subscriptions.push(_analyticsService.loading.subscribe(function (data) {
            _this.loading = data;
        }));
    }
    AnalyticsTotalvisitorsNewComponent.prototype.ngOnInit = function () {
    };
    AnalyticsTotalvisitorsNewComponent.prototype.onFilterResult = function (event) {
        var _this = this;
        // console.log(event);
        this.loading = true;
        var packet = {
            "obj": {
                "nsp": this.agent.nsp,
                "country": event.selectedCountry,
                "from": new Date(event.selectedDate.from).toISOString(),
                "to": this._analyticsService.AddDays(new Date(event.selectedDate.to), 1).toISOString(),
                "timezone": this._analyticsService.timeZone,
            }
        };
        this._analyticsService.GetTotalVisitorsNew(packet).subscribe(function (response) {
            var options = {
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
                    categories: []
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
            if (response['Total Visitor'] && response['Total Visitor'].length) {
                _this.totalVisitorsData = response['Total Visitor'];
                _this.noDataAvailable = false;
                if (_this.totalVisitorsData.length) {
                    var categories_1 = _this.totalVisitorsData[0].data.map(function (d) { return d.hour; });
                    var series_1 = [];
                    _this.totalVisitorsData.forEach(function (element) {
                        var obj = {
                            name: element._id,
                            data: []
                        };
                        categories_1.forEach(function (category) {
                            obj.data.push(element.data.filter(function (d) { return d.hour == category; })[0].count);
                        });
                        series_1.push(obj);
                    });
                    options.xAxis.categories = categories_1;
                    options.series = series_1;
                    _this.options = options;
                    setTimeout(function () {
                        new Highcharts.Chart("highchart", options);
                    }, 1500);
                }
            }
            else {
                _this.noDataAvailable = true;
                var options_1 = {
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
                };
                new Highcharts.Chart("highchart", options_1);
            }
            _this.loading = false;
        }, function (err) {
            _this.loading = false;
        });
    };
    AnalyticsTotalvisitorsNewComponent.prototype.Export = function () {
        console.log('Exporting...');
        this._analyticsService.exportHTMLToExcel('totalVisitors', 'TotalVisitors-' + new Date().getTime());
    };
    AnalyticsTotalvisitorsNewComponent.prototype.showTotal = function (array) {
        var total = 0;
        array.forEach(function (element) {
            total += element['count'];
        });
        return total;
    };
    AnalyticsTotalvisitorsNewComponent = __decorate([
        core_1.Component({
            selector: 'app-analytics-totalvisitors-new',
            templateUrl: './analytics-totalvisitors-new.component.html',
            styleUrls: ['./analytics-totalvisitors-new.component.css']
        })
    ], AnalyticsTotalvisitorsNewComponent);
    return AnalyticsTotalvisitorsNewComponent;
}());
exports.AnalyticsTotalvisitorsNewComponent = AnalyticsTotalvisitorsNewComponent;
//# sourceMappingURL=analytics-totalvisitors-new.component.js.map