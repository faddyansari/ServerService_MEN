"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsInvitesComponent = void 0;
var core_1 = require("@angular/core");
var Highcharts = require("highcharts");
require('highcharts/modules/exporting')(Highcharts);
var AnalyticsInvitesComponent = /** @class */ (function () {
    function AnalyticsInvitesComponent(_authService, _analyticsService, _globalStateService, _chatService) {
        var _this = this;
        this._analyticsService = _analyticsService;
        this._globalStateService = _globalStateService;
        this._chatService = _chatService;
        this.subscriptions = [];
        this.loading = false;
        //HighChart Demo
        this.highcharts = Highcharts;
        this.options = {
            accessibility: {
                enabled: true,
                description: 'This charts shows the total greeting messages sent/accepted'
            },
            chart: {
                type: 'column',
                backgroundColor: '#f5f6f8'
            },
            title: {
                text: 'Greetings'
            },
            tooltip: {
                animation: false,
                useHTML: true,
                shadow: false,
                headerFormat: "<div style='text-align:center;font-weight:bold'>{point.key}</div>",
                pointFormat: "<div>{point.y} {point.series.name} </div>"
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
            xAxis: {},
            yAxis: {
                title: {
                    text: ''
                }
            },
            series: [{}]
        };
        this.rendered = false;
        this.subscriptions.push(_analyticsService.loading.subscribe(function (data) {
            _this.loading = data;
        }));
        this.subscriptions.push(_analyticsService.options.subscribe(function (data) {
            if (_this.rendered) {
                if (data.title.text) {
                    _this.options.title.text = 'Greetings (' + data.title.text + ')';
                }
                else {
                    _this.options.title.text = 'Greetings';
                }
                _this.options.chart.type = data.chart.type;
                _this.options.legend = data.legend;
                _this.additionalData = data.additionalData;
                _this.options.xAxis.categories = data.xAxis.categories;
                _this.options.series = data.series;
                _this.chart = new Highcharts.Chart("highchart", _this.options);
            }
        }));
    }
    AnalyticsInvitesComponent.prototype.ngOnInit = function () {
    };
    AnalyticsInvitesComponent.prototype.onFilterResult = function (event) {
        var _this = this;
        this._analyticsService.GetTotalInvites(event.csid, event.selectedDateType, event.selectedDate).subscribe(function (data) {
            var totalGreetings = 0;
            data.json().forEach(function (element) {
                totalGreetings += element.greetings;
            });
            switch (event.selectedDateType) {
                case 'today':
                case 'yesterday':
                    var series = [
                        {
                            name: "Greetings",
                            data: [],
                            value: 'greetings'
                        },
                        {
                            name: "Accepted",
                            data: [],
                            value: 'accepted'
                        }
                    ];
                    var firstHalf = [];
                    var secondHalf = [];
                    for (var i = 0; i < 12; i++) {
                        firstHalf.push((i == 0) ? '12 AM' : i + ' AM');
                    }
                    for (var i = 0; i < 12; i++) {
                        secondHalf.push((i == 0) ? '12 PM' : i + ' PM');
                    }
                    var categories_1 = firstHalf.concat(secondHalf);
                    series.forEach(function (s) {
                        if (data.json().length) {
                            categories_1.forEach(function (c, index) {
                                s.data.push(0);
                                data.json().forEach(function (element) {
                                    // let date = this.dateFormatter(new Date()) + 'T' + element._id + ':00:00.000Z';
                                    // let time = new Date(date).getHours();
                                    var time = Number(element._id);
                                    var matchingCriteria = '';
                                    if (time < 12) {
                                        matchingCriteria = ((time == 0) ? 12 + ' AM' : time + ' AM');
                                    }
                                    else if (time >= 12) {
                                        var n = time - 12;
                                        matchingCriteria = ((n == 0) ? 12 + ' PM' : n + ' PM');
                                    }
                                    if (c == matchingCriteria) {
                                        s.data[index] = element[s.value];
                                    }
                                });
                            });
                        }
                        else {
                            categories_1.forEach(function (c) {
                                s.data.push(0);
                            });
                        }
                    });
                    // console.log(categories);
                    // console.log(series);
                    _this._analyticsService.updateChartSimple('column', true, categories_1, series, totalGreetings);
                    break;
                case 'week':
                    series = [
                        {
                            name: "Greetings",
                            data: [],
                            value: 'greetings'
                        },
                        {
                            name: "Accepted",
                            data: [],
                            value: 'accepted'
                        }
                    ];
                    var graph_week = [];
                    for (var i = 6; i >= 0; i--) {
                        var date = _this._analyticsService.SubtractDays(new Date(), i);
                        graph_week.push(date.getDate() + ' ' + _this._analyticsService.monthNames[date.getMonth()] + ' ' + date.getFullYear());
                    }
                    categories_1 = graph_week;
                    series.forEach(function (s) {
                        if (data.json().length) {
                            categories_1.forEach(function (c, index) {
                                s.data.push(0);
                                data.json().forEach(function (element) {
                                    var matchingCriteria = Number(element._id.split('-')[2]) + ' ' + _this._analyticsService.monthNames[new Date(element._id).getMonth()] + ' ' + new Date(element._id).getFullYear();
                                    if (c == matchingCriteria) {
                                        s.data[index] = element[s.value];
                                    }
                                });
                            });
                        }
                        else {
                            categories_1.forEach(function (c) {
                                s.data.push(0);
                            });
                        }
                    });
                    // console.log(categories);
                    // console.log(series);
                    _this._analyticsService.updateChartSimple('column', true, categories_1, series, totalGreetings);
                    break;
                case 'month':
                    series = [
                        {
                            name: "Greetings",
                            data: [],
                            value: 'greetings'
                        },
                        {
                            name: "Accepted",
                            data: [],
                            value: 'accepted'
                        }
                    ];
                    var graph_month = [];
                    for (var i = 29; i >= 0; i--) {
                        var date = _this._analyticsService.SubtractDays(new Date(), i);
                        graph_month.push(date.getDate() + ' ' + _this._analyticsService.monthNames[date.getMonth()] + ' ' + date.getFullYear());
                    }
                    categories_1 = graph_month;
                    series.forEach(function (s) {
                        if (data.json().length) {
                            categories_1.forEach(function (c, index) {
                                s.data.push(0);
                                data.json().forEach(function (element) {
                                    var matchingCriteria = Number(element._id.split('-')[2]) + ' ' + _this._analyticsService.monthNames[new Date(element._id).getMonth()] + ' ' + new Date(element._id).getFullYear();
                                    if (c == matchingCriteria) {
                                        s.data[index] = element[s.value];
                                    }
                                });
                            });
                        }
                        else {
                            categories_1.forEach(function (c) {
                                s.data.push(0);
                            });
                        }
                    });
                    // console.log(categories);
                    // console.log(series);
                    _this._analyticsService.updateChartSimple('column', true, categories_1, series, totalGreetings);
                    break;
                default:
                    var date1 = new Date(event.selectedDate.from);
                    var date2 = new Date(event.selectedDate.to);
                    if (_this._analyticsService.daysBetween(date1, date2) == 0 || _this._analyticsService.daysBetween(date1, date2) == 1) {
                        var series_1 = [
                            {
                                name: "Greetings",
                                data: [],
                                value: 'greetings'
                            },
                            {
                                name: "Accepted",
                                data: [],
                                value: 'accepted'
                            }
                        ];
                        var firstHalf_1 = [];
                        var secondHalf_1 = [];
                        for (var i = 0; i < 12; i++) {
                            firstHalf_1.push((i == 0) ? '12 AM' : i + ' AM');
                        }
                        for (var i = 0; i < 12; i++) {
                            secondHalf_1.push((i == 0) ? '12 PM' : i + ' PM');
                        }
                        var categories_2 = firstHalf_1.concat(secondHalf_1);
                        var dummy_1 = {};
                        data.json().forEach(function (element, index) {
                            var _a;
                            // let date = this.dateFormatter(new Date()) + 'T' + element._id + ':00:00.000Z';
                            // let time = new Date(date).getHours();
                            var time = Number(element._id);
                            var transformedTime = '';
                            if (time < 12) {
                                transformedTime = ((time == 0) ? 12 + ' AM' : time + ' AM');
                            }
                            else if (time >= 12) {
                                var n = time - 12;
                                transformedTime = ((n == 0) ? 12 + ' PM' : n + ' PM');
                            }
                            var obj = (_a = {},
                                _a[transformedTime] = {
                                    greetings: element.greetings,
                                    accepted: element.accepted
                                },
                                _a);
                            Object.assign(dummy_1, obj);
                        });
                        series_1.forEach(function (s) {
                            categories_2.forEach(function (c, index) {
                                s.data.push((dummy_1[c]) ? dummy_1[c][s.value] : 0);
                            });
                        });
                        // console.log(categories);
                        // console.log(series);
                        _this._analyticsService.updateChartSimple('column', true, categories_2, series_1, totalGreetings);
                    }
                    else {
                        // console.log(date1);
                        // console.log(date2);
                        series = [
                            {
                                name: "Greetings",
                                data: [],
                                value: 'greetings'
                            },
                            {
                                name: "Accepted",
                                data: [],
                                value: 'accepted'
                            }
                        ];
                        var graph_month_1 = [];
                        for (var i = _this._analyticsService.daysBetween(date1, date2); i >= 0; i--) {
                            var date = _this._analyticsService.SubtractDays(new Date(event.selectedDate.to), i);
                            graph_month_1.push(date.getDate() + ' ' + _this._analyticsService.monthNames[date.getMonth()] + ' ' + date.getFullYear());
                        }
                        categories_1 = graph_month_1;
                        series.forEach(function (s) {
                            if (data.json().length) {
                                categories_1.forEach(function (c, index) {
                                    s.data.push(0);
                                    data.json().forEach(function (element) {
                                        var matchingCriteria = Number(element._id.split('-')[2]) + ' ' + _this._analyticsService.monthNames[new Date(element._id).getMonth()] + ' ' + new Date(element._id).getFullYear();
                                        if (c == matchingCriteria) {
                                            s.data[index] = element[s.value];
                                        }
                                    });
                                });
                            }
                            else {
                                categories_1.forEach(function (c) {
                                    s.data.push(0);
                                });
                            }
                        });
                        // console.log(categories);
                        // console.log(series);
                        _this._analyticsService.updateChartSimple('column', true, categories_1, series, totalGreetings);
                    }
                    break;
            }
        }, function (err) {
            console.log('Error! Server unreachable.');
        });
    };
    AnalyticsInvitesComponent.prototype.ngAfterViewInit = function () {
        this.chart = new Highcharts.Chart("highchart", this.options);
        this.rendered = true;
    };
    AnalyticsInvitesComponent.prototype.showTotal = function (indexExists, index) {
        var count = 0;
        if (indexExists) {
            this.options.series[index].data.forEach(function (element) {
                count += element;
            });
        }
        else {
            this.options.series.forEach(function (element) {
                count += element.data.reduce(function (a, b) { return a + b; }, 0);
            });
        }
        return count;
    };
    AnalyticsInvitesComponent.prototype.showSeriesCount = function (index) {
        var count = 0;
        this.options.series[index].data.forEach(function (element) {
            count += element;
        });
        return count;
    };
    AnalyticsInvitesComponent.prototype.Export = function () {
        console.log('Exporting...');
        // console.log(this.agentTableData);
        this._analyticsService.exportHTMLToExcel('totalInvites', 'Greetings-' + new Date().getTime());
    };
    AnalyticsInvitesComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
    };
    AnalyticsInvitesComponent = __decorate([
        core_1.Component({
            selector: 'app-analytics-invites',
            templateUrl: './analytics-invites.component.html',
            styleUrls: ['./analytics-invites.component.css']
        })
    ], AnalyticsInvitesComponent);
    return AnalyticsInvitesComponent;
}());
exports.AnalyticsInvitesComponent = AnalyticsInvitesComponent;
//# sourceMappingURL=analytics-invites.component.js.map