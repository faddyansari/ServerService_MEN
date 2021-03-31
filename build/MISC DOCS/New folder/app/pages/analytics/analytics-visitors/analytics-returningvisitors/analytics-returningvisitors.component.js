"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsReturningvisitorsComponent = void 0;
var core_1 = require("@angular/core");
var Highcharts = require("highcharts");
require('highcharts/modules/exporting')(Highcharts);
require('highcharts/modules/export-data')(Highcharts);
var AnalyticsReturningvisitorsComponent = /** @class */ (function () {
    function AnalyticsReturningvisitorsComponent(_authService, _analyticsService) {
        var _this = this;
        this._analyticsService = _analyticsService;
        this.subscriptions = [];
        this.loading = false;
        //HighChart Demo
        this.highcharts = Highcharts;
        this.options = {
            chart: {
                type: 'column',
                backgroundColor: '#f5f6f8'
            },
            title: {
                text: 'Returning Visitors'
            },
            plotOptions: {
                line: {
                    lineWidth: 1,
                    marker: {
                        symbol: 'circle',
                        radius: 2
                    }
                }
            },
            tooltip: {
                animation: false,
                useHTML: true,
                shadow: false,
                headerFormat: "<div style='text-align:center;font-weight:bold'>{point.key}</div>",
                pointFormat: "<div>{point.y} visitors </div>"
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
                    _this.options.title.text = 'Returning Visitors (' + data.title.text + ')';
                }
                else {
                    _this.options.title.text = 'Returning Visitors';
                }
                _this.options.chart.type = data.chart.type;
                _this.options.legend = data.legend;
                _this.options.xAxis.categories = data.xAxis.categories;
                _this.options.series = data.series;
                _this.chart = new Highcharts.Chart("highchart", _this.options);
            }
        }));
    }
    AnalyticsReturningvisitorsComponent.prototype.ngOnInit = function () {
    };
    AnalyticsReturningvisitorsComponent.prototype.onFilterResult = function (event) {
        var _this = this;
        this._analyticsService.GetReturningVisitors(event.csid, event.selectedDateType, event.selectedDate).subscribe(function (data) {
            // let visitorIDs = [];
            var returningVisitors = 0;
            data.json().forEach(function (element) {
                returningVisitors += element['returningVisitors'];
            });
            if (event.comparison) {
                var date1 = new Date();
                var date2 = new Date();
                switch (event.selectedComparison) {
                    case 'past_7_days':
                        date1 = new Date(_this._analyticsService.dateFormatter(_this._analyticsService.SubtractDays(new Date(), 6)));
                        break;
                    case 'past_10_days':
                        date1 = new Date(_this._analyticsService.dateFormatter(_this._analyticsService.SubtractDays(new Date(), 9)));
                        break;
                    case 'past_30_days':
                        date1 = new Date(_this._analyticsService.dateFormatter(_this._analyticsService.SubtractDays(new Date(), 29)));
                        break;
                    case 'past_6_months':
                        date1 = new Date(_this._analyticsService.dateFormatter(_this._analyticsService.SubtractMonths(new Date(), 5)));
                        break;
                    case 'past_years':
                        date1 = new Date((event.year_from + "-" + ("0" + (new Date().getMonth() + 1)).slice(-2) + '-' + ("0" + new Date().getDate()).slice(-2)));
                        date2 = new Date((event.year_to + "-" + ("0" + (new Date().getMonth() + 1)).slice(-2) + '-' + ("0" + new Date().getDate()).slice(-2)));
                        break;
                }
                if (event.selectedComparison.match(/days/g)) {
                    var daysData_1 = [];
                    for (var i = _this._analyticsService.daysBetween(date1, date2) - 1; i >= 0; i--) {
                        daysData_1.push({
                            name: _this._analyticsService.dayNames[new Date(_this._analyticsService.dateFormatter(_this._analyticsService.SubtractDays(date2, i))).getDay()] + " " + new Date(_this._analyticsService.dateFormatter(_this._analyticsService.SubtractDays(date2, i))).getDate(),
                            value: 0
                        });
                    }
                    data.json().forEach(function (element) {
                        var day = element._id;
                        (_this._analyticsService.dayNames[new Date(day).getDay()] + " " + new Date(day).getDate());
                        // let day = (this._analyticsService.monthNames[new Date(element._id).getMonth()] + "'" + new Date(element._id).getDate());
                        if (daysData_1.filter(function (t) { return t.name == (_this._analyticsService.dayNames[new Date(day).getDay()] + " " + new Date(day).getDate()); }).length) {
                            daysData_1.filter(function (t) { return t.name == (_this._analyticsService.dayNames[new Date(day).getDay()] + " " + new Date(day).getDate()); })[0].value += element.returningVisitors;
                        }
                    });
                    if (!data.json().length) {
                        _this._analyticsService.updateChart('line', daysData_1, 'flat', 'Returning Visitors', true);
                    }
                    else {
                        _this._analyticsService.updateChart('line', daysData_1, 'flat', 'Returning Visitors', false, returningVisitors);
                    }
                }
                else if (event.selectedComparison.match(/months/g)) {
                    var temp_graph_1 = _this._analyticsService.diffMonth(date1, date2);
                    data.json().forEach(function (element) {
                        var month = _this._analyticsService.monthNames[new Date(element._id).getMonth()];
                        if (temp_graph_1.filter(function (t) { return t.name == month; }).length) {
                            temp_graph_1.filter(function (t) { return t.name == month; })[0].value += element.returningVisitors;
                        }
                    });
                    if (!data.json().length) {
                        _this._analyticsService.updateChart('line', temp_graph_1, 'flat', 'Returning Visitors', true);
                    }
                    else {
                        _this._analyticsService.updateChart('line', temp_graph_1, 'flat', 'Returning Visitors', false, returningVisitors);
                    }
                }
                else if (event.selectedComparison.match(/years/g)) {
                    // console.log('Matches months and years');
                    var yearsData_1 = _this._analyticsService.diffYear(date1, date2);
                    data.json().forEach(function (element) {
                        var year = new Date(element._id).getFullYear().toString();
                        if (yearsData_1.filter(function (t) { return t.name == year; }).length) {
                            yearsData_1.filter(function (t) { return t.name == year; })[0].value += element.returningVisitors;
                        }
                    });
                    // console.log(yearsData);
                    if (!data.json().length) {
                        _this._analyticsService.updateChart('column', yearsData_1, 'flat', 'Total Visitors', true);
                    }
                    else {
                        _this._analyticsService.updateChart('column', yearsData_1, 'flat', 'Total Visitors', false, returningVisitors);
                    }
                }
            }
            else {
                switch (event.selectedDateType) {
                    case 'today':
                    case 'yesterday':
                        var firstHalf_1 = [];
                        var secondHalf_1 = [];
                        for (var i = 0; i < 12; i++) {
                            firstHalf_1.push({
                                "name": (i == 0) ? '12 AM' : i + ' AM',
                                "value": 0
                            });
                        }
                        for (var i = 0; i < 12; i++) {
                            secondHalf_1.push({
                                "name": (i == 0) ? '12 PM' : i + ' PM',
                                "value": 0
                            });
                        }
                        data.json().forEach(function (element) {
                            // let date = this._analyticsService.dateFormatter(new Date()) + 'T' + element._id + ':00:00.000Z';
                            // let time = new Date(date).getHours();
                            var time = Number(element._id);
                            if (time < 12) {
                                firstHalf_1.forEach(function (s) {
                                    if (s.name == ((time == 0) ? 12 + ' AM' : time + ' AM')) {
                                        s.value = element.returningVisitors;
                                    }
                                });
                            }
                            else if (time >= 12) {
                                var n_1 = time - 12;
                                secondHalf_1.forEach(function (s) {
                                    if (s.name == ((n_1 == 0) ? 12 + ' PM' : n_1 + ' PM')) {
                                        s.value = element.returningVisitors;
                                    }
                                });
                            }
                        });
                        // this.graph_uniqueVisitors = today_Data;		
                        if (!data.json().length) {
                            _this._analyticsService.updateChart('line', firstHalf_1.concat(secondHalf_1), 'flat', 'Returning Visitors', true);
                            // return;
                        }
                        else {
                            _this._analyticsService.updateChart('line', firstHalf_1.concat(secondHalf_1), 'flat', 'Returning Visitors', false, returningVisitors);
                        }
                        break;
                    case 'week':
                        var temp_graph_2 = [];
                        for (var i = 6; i >= 0; i--) {
                            temp_graph_2.push({
                                name: _this._analyticsService.monthNames[new Date(_this._analyticsService.dateFormatter(_this._analyticsService.SubtractDays(new Date(), i))).getMonth()] + "'" + new Date(_this._analyticsService.dateFormatter(_this._analyticsService.SubtractDays(new Date(), i))).getDate(),
                                value: 0
                            });
                        }
                        data.json().forEach(function (element) {
                            var month = (_this._analyticsService.monthNames[new Date(element._id).getMonth()] + "'" + new Date(element._id).getDate());
                            if (temp_graph_2.filter(function (t) { return t.name == month; }).length) {
                                temp_graph_2.filter(function (t) { return t.name == month; })[0].value += element.returningVisitors;
                            }
                        });
                        // this.graph_uniqueVisitors = graph_week;
                        if (!data.json().length) {
                            _this._analyticsService.updateChart('line', temp_graph_2, 'flat', 'Returning Visitors', true);
                            // return;
                        }
                        else {
                            _this._analyticsService.updateChart('line', temp_graph_2, 'flat', 'Returning Visitors', false, returningVisitors);
                        }
                        break;
                    case 'month':
                        var graph_month_1 = [];
                        for (var i = 29; i >= 0; i--) {
                            graph_month_1.push({
                                name: _this._analyticsService.monthNames[new Date(_this._analyticsService.dateFormatter(_this._analyticsService.SubtractDays(new Date(), i))).getMonth()] + "'" + new Date(_this._analyticsService.dateFormatter(_this._analyticsService.SubtractDays(new Date(), i))).getDate(),
                                value: 0
                            });
                        }
                        data.json().forEach(function (element) {
                            var month = (_this._analyticsService.monthNames[new Date(element._id).getMonth()] + "'" + new Date(element._id).getDate());
                            if (graph_month_1.filter(function (t) { return t.name == month; }).length) {
                                graph_month_1.filter(function (t) { return t.name == month; })[0].value += element.returningVisitors;
                            }
                        });
                        // this.graph_uniqueVisitors = graph_month;
                        if (!data.json().length) {
                            _this._analyticsService.updateChart('line', graph_month_1, 'flat', 'Returning Visitors', true);
                            // return;
                        }
                        else {
                            _this._analyticsService.updateChart('line', graph_month_1, 'flat', 'Returning Visitors', false, returningVisitors);
                        }
                        break;
                    default:
                        var date1 = new Date(event.selectedDate.from);
                        var date2 = new Date(event.selectedDate.to);
                        if (_this._analyticsService.daysBetween(date1, date2) == 0 || _this._analyticsService.daysBetween(date1, date2) == 1) {
                            var firstHalf_2 = [];
                            var secondHalf_2 = [];
                            for (var i = 0; i < 12; i++) {
                                firstHalf_2.push({
                                    "name": (i == 0) ? '12 AM' : i + ' AM',
                                    "value": 0
                                });
                            }
                            for (var i = 0; i < 12; i++) {
                                secondHalf_2.push({
                                    "name": (i == 0) ? '12 PM' : i + ' PM',
                                    "value": 0
                                });
                            }
                            data.json().forEach(function (element) {
                                // let date = this._analyticsService.dateFormatter(new Date()) + 'T' + element._id + ':00:00.000Z';
                                // let time = new Date(date).getHours();
                                var time = Number(element._id);
                                if (time < 12) {
                                    firstHalf_2.forEach(function (s) {
                                        if (s.name == ((time == 0) ? 12 + ' AM' : time + ' AM')) {
                                            s.value = element.returningVisitors;
                                        }
                                    });
                                }
                                else if (time >= 12) {
                                    var n_2 = time - 12;
                                    secondHalf_2.forEach(function (s) {
                                        if (s.name == ((n_2 == 0) ? 12 + ' PM' : n_2 + ' PM')) {
                                            s.value = element.returningVisitors;
                                        }
                                    });
                                }
                            });
                            if (!data.json().length) {
                                _this._analyticsService.updateChart('line', firstHalf_2.concat(secondHalf_2), 'flat', 'Returning Visitors', true);
                                // return;
                            }
                            else {
                                _this._analyticsService.updateChart('line', firstHalf_2.concat(secondHalf_2), 'flat', 'Returning Visitors', false, returningVisitors);
                            }
                        }
                        else if (_this._analyticsService.daysBetween(date1, date2) < 16) {
                            var graph_week_1 = [];
                            for (var i = _this._analyticsService.daysBetween(date1, date2); i >= 0; i--) {
                                graph_week_1.push({
                                    name: _this._analyticsService.monthNames[new Date(_this._analyticsService.dateFormatter(_this._analyticsService.SubtractDays(date2, i))).getMonth()] + "'" + new Date(_this._analyticsService.dateFormatter(_this._analyticsService.SubtractDays(date2, i))).getDate(),
                                    value: 0
                                });
                            }
                            data.json().forEach(function (element) {
                                var month = (_this._analyticsService.monthNames[new Date(element._id).getMonth()] + "'" + new Date(element._id).getDate());
                                if (graph_week_1.filter(function (t) { return t.name == month; }).length) {
                                    graph_week_1.filter(function (t) { return t.name == month; })[0].value += element.returningVisitors;
                                }
                            });
                            // this.graph_uniqueVisitors = graph_week;
                            if (!data.json().length) {
                                _this._analyticsService.updateChart('line', graph_week_1, 'flat', 'Returning Visitors', true);
                                // return;
                            }
                            else {
                                _this._analyticsService.updateChart('line', graph_week_1, 'flat', 'Returning Visitors', false, returningVisitors);
                            }
                        }
                        else {
                            var temp_graph_3 = [];
                            for (var i = _this._analyticsService.daysBetween(date1, date2); i >= 0; i--) {
                                temp_graph_3.push({
                                    name: _this._analyticsService.monthNames[new Date(_this._analyticsService.dateFormatter(_this._analyticsService.SubtractDays(date2, i))).getMonth()] + "'" + new Date(_this._analyticsService.dateFormatter(_this._analyticsService.SubtractDays(date2, i))).getDate(),
                                    value: 0
                                });
                            }
                            data.json().forEach(function (element) {
                                var month = (_this._analyticsService.monthNames[new Date(element._id).getMonth()] + "'" + new Date(element._id).getDate());
                                if (temp_graph_3.filter(function (t) { return t.name == month; }).length) {
                                    temp_graph_3.filter(function (t) { return t.name == month; })[0].value += element.returningVisitors;
                                }
                            });
                            // this.graph_uniqueVisitors = graph_month;
                            if (!data.json().length) {
                                _this._analyticsService.updateChart('line', temp_graph_3, 'flat', 'Returning Visitors', true);
                                // return;
                            }
                            else {
                                _this._analyticsService.updateChart('line', temp_graph_3, 'flat', 'Returning Visitors', false, returningVisitors);
                            }
                        }
                        break;
                }
            }
            // this.graph_visitorDetails = visitor_details;
            // this._analyticsService.GetVisitorSessions(visitorIDs);
        }, function (err) {
            // this._analyticsService.GetVisitorSessions([]);
            console.log('Error! Server unreachable.');
            // console.log(err);
        });
    };
    AnalyticsReturningvisitorsComponent.prototype.ngAfterViewInit = function () {
        this.chart = new Highcharts.Chart("highchart", this.options);
        this.rendered = true;
    };
    AnalyticsReturningvisitorsComponent.prototype.showTotal = function (indexExists, index) {
        var count = 0;
        if (indexExists) {
            this.options.series.map(function (s) {
                count += s.data[index];
            });
        }
        else {
            this.options.series.forEach(function (element) {
                count += element.data.reduce(function (a, b) { return a + b; }, 0);
            });
        }
        return count;
    };
    AnalyticsReturningvisitorsComponent.prototype.showSeriesCount = function (index) {
        var count = 0;
        this.options.series[index].data.forEach(function (element) {
            count += element;
        });
        return count;
    };
    AnalyticsReturningvisitorsComponent.prototype.Export = function () {
        console.log('Exporting...');
        // console.log(this.agentTableData);
        this._analyticsService.exportHTMLToExcel('returningVisitors', 'ReturningVisitors-' + new Date().getTime());
    };
    AnalyticsReturningvisitorsComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
    };
    AnalyticsReturningvisitorsComponent = __decorate([
        core_1.Component({
            selector: 'app-analytics-returningvisitors',
            templateUrl: './analytics-returningvisitors.component.html',
            styleUrls: ['./analytics-returningvisitors.component.css'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], AnalyticsReturningvisitorsComponent);
    return AnalyticsReturningvisitorsComponent;
}());
exports.AnalyticsReturningvisitorsComponent = AnalyticsReturningvisitorsComponent;
//# sourceMappingURL=analytics-returningvisitors.component.js.map