"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsReturnvisitorratioComponent = void 0;
var core_1 = require("@angular/core");
var Highcharts = require("highcharts");
var AnalyticsReturnvisitorratioComponent = /** @class */ (function () {
    function AnalyticsReturnvisitorratioComponent(_authService, _globalStateService, _analyticsService) {
        var _this = this;
        this._authService = _authService;
        this._globalStateService = _globalStateService;
        this._analyticsService = _analyticsService;
        this.subscriptions = [];
        this.loading = false;
        //HighChart Demo
        this.highcharts = Highcharts;
        this.selectedDateType = '';
        this.noDataAvailable = false;
        this.returnVisitorRatioData = [];
        this.subscriptions.push(_authService.getAgent().subscribe(function (agent) {
            _this.agent = agent;
        }));
        this.subscriptions.push(_analyticsService.loading.subscribe(function (data) {
            _this.loading = data;
        }));
    }
    AnalyticsReturnvisitorratioComponent.prototype.ngOnInit = function () {
    };
    AnalyticsReturnvisitorratioComponent.prototype.onFilterResult = function (event) {
        var _this = this;
        this.selectedDateType = event.selectedDateType;
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
        this._analyticsService.GetRatioOfReturnVisitor(packet).subscribe(function (response) {
            if (response['Ratio of return visitors'] && response['Ratio of return visitors'].length) {
                _this.returnVisitorRatioData = response['Ratio of return visitors'];
                _this.noDataAvailable = false;
                if (_this._analyticsService.daysBetween(new Date(event.selectedDate.from), _this._analyticsService.AddDays(new Date(event.selectedDate.to), 1)) == 1) {
                    setTimeout(function () {
                        _this.populateGraph24Hour();
                    }, 0);
                }
                else {
                    setTimeout(function () {
                        _this.populateGraphTotal();
                    }, 0);
                }
            }
            else {
                _this.noDataAvailable = true;
                var options = {
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
                new Highcharts.Chart("highchart", options);
            }
            _this.loading = false;
        }, function (err) {
            _this.loading = false;
        });
    };
    AnalyticsReturnvisitorratioComponent.prototype.populateGraph24Hour = function () {
        var options = {
            accessibility: {
                enabled: true,
                description: 'This charts shows the ratio of return visitors'
            },
            chart: {
                type: 'column',
                backgroundColor: '#f5f6f8',
            },
            title: {
                text: 'Ratio of return visitors'
            },
            tooltip: {
                animation: false,
                useHTML: true,
                shadow: false,
                headerFormat: "<div style='text-align:center;font-weight:bold'>{point.key}</div>",
                pointFormat: "<div>{point.series.name} : {point.y}%</div>"
            },
            plotOptions: {
                column: {
                    events: {}
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
                    text: 'Percentage of return visitors'
                }
            },
            series: [{}]
        };
        var series = [];
        var firstHalf = [];
        var secondHalf = [];
        for (var i = 0; i < 12; i++) {
            firstHalf.push((i == 0) ? '12 AM' : i + ' AM');
        }
        for (var i = 0; i < 12; i++) {
            secondHalf.push((i == 0) ? '12 PM' : i + ' PM');
        }
        options.xAxis.categories = firstHalf.concat(secondHalf);
        this.returnVisitorRatioData.forEach(function (element) {
            series.push({
                name: element.name,
                data: element.data
            });
        });
        options.series = series;
        this.options = options;
        new Highcharts.Chart("highchart", options);
    };
    AnalyticsReturnvisitorratioComponent.prototype.populateGraphTotal = function () {
        var options = {
            accessibility: {
                enabled: true,
                description: 'This chart shows the ratio of return visitors'
            },
            chart: {
                type: 'column',
                backgroundColor: '#f5f6f8',
            },
            title: {
                text: 'Ratio of return visitors'
            },
            tooltip: {
                animation: false,
                useHTML: true,
                shadow: false,
                headerFormat: "<div style='text-align:center;font-weight:bold'>{point.key}</div>",
                pointFormat: "<div>{point.series.name} : {point.y}%</div>"
            },
            plotOptions: {
                column: {
                    events: {}
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
                categories: ['Reutrn Visitors']
            },
            yAxis: {
                title: {
                    text: 'Percentage of return visitors'
                }
            },
            series: [{}]
        };
        var series = [];
        this.returnVisitorRatioData.forEach(function (element) {
            var seriesObj = {
                name: element.name,
                data: []
            };
            var total = 0;
            element.data.forEach(function (d) {
                total += d;
            });
            total = total / element.data.length;
            var rounded = Math.round(total);
            seriesObj.data = [rounded];
            series.push(seriesObj);
        });
        // console.log(series);
        options.series = series;
        this.options = options;
        new Highcharts.Chart("highchart", options);
    };
    AnalyticsReturnvisitorratioComponent.prototype.showTotal = function (array) {
        var total = 0;
        array.forEach(function (element) {
            total += element;
        });
        total = total / array.length;
        var rounded = Math.round(total);
        // rounded = rounded.toFixed(1)
        return rounded;
    };
    AnalyticsReturnvisitorratioComponent.prototype.Export = function () {
        this._analyticsService.exportHTMLToExcel('returnVisitorRatio', 'ReturnVisitorRatio-' + new Date().getTime());
    };
    AnalyticsReturnvisitorratioComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
    };
    AnalyticsReturnvisitorratioComponent = __decorate([
        core_1.Component({
            selector: 'app-analytics-returnvisitorratio',
            templateUrl: './analytics-returnvisitorratio.component.html',
            styleUrls: ['./analytics-returnvisitorratio.component.css']
        })
    ], AnalyticsReturnvisitorratioComponent);
    return AnalyticsReturnvisitorratioComponent;
}());
exports.AnalyticsReturnvisitorratioComponent = AnalyticsReturnvisitorratioComponent;
//# sourceMappingURL=analytics-returnvisitorratio.component.js.map