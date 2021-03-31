"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsRegvialivechatComponent = void 0;
var core_1 = require("@angular/core");
var Highcharts = require("highcharts");
var AnalyticsRegvialivechatComponent = /** @class */ (function () {
    function AnalyticsRegvialivechatComponent(_authService, _globalStateService, _analyticsService) {
        var _this = this;
        this._authService = _authService;
        this._globalStateService = _globalStateService;
        this._analyticsService = _analyticsService;
        this.subscriptions = [];
        this.loading = false;
        this.noDataAvailable = false;
        //HighChart Demo
        this.highcharts = Highcharts;
        this.regViaLiveChatData = [];
        this.subscriptions.push(_authService.getAgent().subscribe(function (agent) {
            _this.agent = agent;
        }));
        this.subscriptions.push(_analyticsService.loading.subscribe(function (data) {
            _this.loading = data;
        }));
    }
    AnalyticsRegvialivechatComponent.prototype.ngOnInit = function () {
    };
    AnalyticsRegvialivechatComponent.prototype.onFilterResult = function (event) {
        var _this = this;
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
        this._analyticsService.GetTotalRegViaLivechat(packet).subscribe(function (response) {
            if (response['Total Reg via LiveChat'] && response['Total Reg via LiveChat'].length) {
                _this.regViaLiveChatData = response['Total Reg via LiveChat'];
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
    AnalyticsRegvialivechatComponent.prototype.populateGraph24Hour = function () {
        var options = {
            accessibility: {
                enabled: true,
                description: 'This charts shows the total registrations via liveChat count'
            },
            chart: {
                type: 'column',
                backgroundColor: '#f5f6f8',
            },
            title: {
                text: 'Registrations via livechat'
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
                    text: 'Number of registrations'
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
        this.regViaLiveChatData.forEach(function (element) {
            series.push({
                name: element.name,
                data: element.data
            });
        });
        options.series = series;
        this.options = options;
        new Highcharts.Chart("highchart", options);
    };
    AnalyticsRegvialivechatComponent.prototype.populateGraphTotal = function () {
        var options = {
            accessibility: {
                enabled: true,
                description: 'This charts shows the total registrations via liveChat count'
            },
            chart: {
                type: 'column',
                backgroundColor: '#f5f6f8',
            },
            title: {
                text: 'Registrations via livechat'
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
                categories: ['Registrations Via LiveChat']
            },
            yAxis: {
                title: {
                    text: 'Number of registrations'
                }
            },
            series: [{}]
        };
        var series = [];
        this.regViaLiveChatData.forEach(function (element) {
            var seriesObj = {
                name: element.name,
                data: []
            };
            var total = 0;
            element.data.forEach(function (d) {
                total += d;
            });
            seriesObj.data = [total];
            series.push(seriesObj);
        });
        // console.log(series);
        options.series = series;
        this.options = options;
        new Highcharts.Chart("highchart", options);
    };
    AnalyticsRegvialivechatComponent.prototype.showTotal = function (array) {
        var total = 0;
        array.forEach(function (element) {
            total += element;
        });
        return total;
    };
    AnalyticsRegvialivechatComponent.prototype.Export = function () {
        this._analyticsService.exportHTMLToExcel('regViaLiveChat', 'RegViaLiveChat-' + new Date().getTime());
    };
    AnalyticsRegvialivechatComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
    };
    AnalyticsRegvialivechatComponent = __decorate([
        core_1.Component({
            selector: 'app-analytics-regvialivechat',
            templateUrl: './analytics-regvialivechat.component.html',
            styleUrls: ['./analytics-regvialivechat.component.css']
        })
    ], AnalyticsRegvialivechatComponent);
    return AnalyticsRegvialivechatComponent;
}());
exports.AnalyticsRegvialivechatComponent = AnalyticsRegvialivechatComponent;
//# sourceMappingURL=analytics-regvialivechat.component.js.map