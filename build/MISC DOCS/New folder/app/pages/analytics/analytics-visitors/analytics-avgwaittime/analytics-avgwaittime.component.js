"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsAvgwaittimeComponent = void 0;
var core_1 = require("@angular/core");
var Highcharts = require("highcharts");
require('highcharts/modules/exporting')(Highcharts);
require('highcharts/modules/export-data')(Highcharts);
var AnalyticsAvgwaittimeComponent = /** @class */ (function () {
    function AnalyticsAvgwaittimeComponent(_authService, _analyticsService) {
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
                text: 'Average Wait Time'
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
                pointFormatter: function () {
                    var num = this.y;
                    var days = Math.floor((num / 24) / 60);
                    var hours = Math.floor((num / 60) % 24);
                    var minutes = Math.round(num % 60);
                    var seconds = Math.round(num * 60 % 60);
                    var str = (days) ? days + ' day ' : '';
                    str += (hours) ? hours + " hr " : '';
                    (minutes) ? str += minutes + ' min ' : '';
                    (seconds) ? str += seconds + 's' : '';
                    return "<div>Time: <b>" + str + "</b></div>";
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
            xAxis: {},
            yAxis: {
                title: {
                    text: ''
                },
                labels: {
                    formatter: function () {
                        var num = this.value;
                        var days = Math.floor((num / 24) / 60);
                        var hours = Math.floor((num / 60) % 24);
                        var minutes = Math.round(num % 60);
                        var seconds = Math.round(num * 60 % 60);
                        var str = (days) ? days + ' d ' : '';
                        str += (hours) ? hours + " h " : '';
                        (minutes) ? str += minutes + ' m ' : '';
                        (seconds) ? str += seconds + 's' : '';
                        return str;
                    }
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
                    _this.options.title.text = 'Average Wait Time (' + _this.time_convert(data.title.text) + ')';
                }
                _this.options.chart.type = data.chart.type;
                _this.options.legend = data.legend;
                _this.options.xAxis.categories = data.xAxis.categories;
                _this.options.series = data.series;
                _this.chart = new Highcharts.Chart("highchart", _this.options);
            }
        }));
    }
    AnalyticsAvgwaittimeComponent.prototype.ngOnInit = function () {
    };
    AnalyticsAvgwaittimeComponent.prototype.onFilterResult = function (event) {
        var _this = this;
        this._analyticsService.GetAverageWaitTime(event.csid, event.selectedDateType, event.selectedDate, event.selectedAgents).subscribe(function (data) {
            // let visitorIDs = [];
            // console.log(data.json());
            var totalAvgWaitTime = 0;
            data.json().forEach(function (element) {
                totalAvgWaitTime += element['avgWaitTime'];
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
                            daysData_1.filter(function (t) { return t.name == (_this._analyticsService.dayNames[new Date(day).getDay()] + " " + new Date(day).getDate()); })[0].value += element.avgWaitTime;
                        }
                    });
                    if (!data.json().length) {
                        _this._analyticsService.updateChart('line', daysData_1, 'flat', 'Wait Time', true);
                    }
                    else {
                        _this._analyticsService.updateChart('line', daysData_1, 'flat', 'Wait Time', false, totalAvgWaitTime);
                    }
                }
                else if (event.selectedComparison.match(/months/g)) {
                    var temp_graph_1 = _this._analyticsService.diffMonth(date1, date2);
                    data.json().forEach(function (element) {
                        var month = _this._analyticsService.monthNames[new Date(element._id).getMonth()];
                        if (temp_graph_1.filter(function (t) { return t.name == month; }).length) {
                            temp_graph_1.filter(function (t) { return t.name == month; })[0].value += element.avgWaitTime;
                        }
                    });
                    if (!data.json().length) {
                        _this._analyticsService.updateChart('line', temp_graph_1, 'flat', 'Wait Time', true);
                    }
                    else {
                        _this._analyticsService.updateChart('line', temp_graph_1, 'flat', 'Wait Time', false, totalAvgWaitTime);
                    }
                }
                else if (event.selectedComparison.match(/years/g)) {
                    // console.log('Matches months and years');
                    var yearsData_1 = _this._analyticsService.diffYear(date1, date2);
                    data.json().forEach(function (element) {
                        var year = new Date(element._id).getFullYear().toString();
                        if (yearsData_1.filter(function (t) { return t.name == year; }).length) {
                            yearsData_1.filter(function (t) { return t.name == year; })[0].value += element.avgWaitTime;
                        }
                    });
                    if (!data.json().length) {
                        _this._analyticsService.updateChart('column', yearsData_1, 'flat', 'Wait Time', true);
                    }
                    else {
                        _this._analyticsService.updateChart('column', yearsData_1, 'flat', 'Wait Time', false, totalAvgWaitTime);
                    }
                }
            }
            else {
                if (!event.selectedAgents.length) {
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
                                            s.value = element.avgWaitTime;
                                        }
                                    });
                                }
                                else if (time >= 12) {
                                    var n_1 = time - 12;
                                    secondHalf_1.forEach(function (s) {
                                        if (s.name == ((n_1 == 0) ? 12 + ' PM' : n_1 + ' PM')) {
                                            s.value = element.avgWaitTime;
                                        }
                                    });
                                }
                            });
                            // this.graph_avgWaitTime = today_Data;		
                            if (!data.json().length) {
                                _this._analyticsService.updateChart('line', firstHalf_1.concat(secondHalf_1), 'flat', 'Wait Time', true);
                                // return;
                            }
                            else {
                                _this._analyticsService.updateChart('line', firstHalf_1.concat(secondHalf_1), 'flat', 'Wait Time', false, totalAvgWaitTime);
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
                                    temp_graph_2.filter(function (t) { return t.name == month; })[0].value += element.avgWaitTime;
                                }
                            });
                            // this.graph_avgWaitTime = graph_week;
                            if (!data.json().length) {
                                _this._analyticsService.updateChart('line', temp_graph_2, 'flat', 'Wait Time', true);
                                // return;
                            }
                            else {
                                _this._analyticsService.updateChart('line', temp_graph_2, 'flat', 'Wait Time', false, totalAvgWaitTime);
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
                                    graph_month_1.filter(function (t) { return t.name == month; })[0].value += element.avgWaitTime;
                                }
                            });
                            // this.graph_avgWaitTime = graph_month;
                            if (!data.json().length) {
                                _this._analyticsService.updateChart('line', graph_month_1, 'flat', 'Wait Time', true);
                                // return;
                            }
                            else {
                                _this._analyticsService.updateChart('line', graph_month_1, 'flat', 'Wait Time', false, totalAvgWaitTime);
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
                                                s.value = element.avgWaitTime;
                                            }
                                        });
                                    }
                                    else if (time >= 12) {
                                        var n_2 = time - 12;
                                        secondHalf_2.forEach(function (s) {
                                            if (s.name == ((n_2 == 0) ? 12 + ' PM' : n_2 + ' PM')) {
                                                s.value = element.avgWaitTime;
                                            }
                                        });
                                    }
                                });
                                if (!data.json().length) {
                                    _this._analyticsService.updateChart('line', firstHalf_2.concat(secondHalf_2), 'flat', 'Wait Time', true);
                                    // return;
                                }
                                else {
                                    _this._analyticsService.updateChart('line', firstHalf_2.concat(secondHalf_2), 'flat', 'Wait Time', false, totalAvgWaitTime);
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
                                        graph_week_1.filter(function (t) { return t.name == month; })[0].value += element.avgWaitTime;
                                    }
                                });
                                // this.graph_avgWaitTime = graph_week;
                                if (!data.json().length) {
                                    _this._analyticsService.updateChart('line', graph_week_1, 'flat', 'Wait Time', true);
                                    // return;
                                }
                                else {
                                    _this._analyticsService.updateChart('line', graph_week_1, 'flat', 'Wait Time', false, totalAvgWaitTime);
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
                                        temp_graph_3.filter(function (t) { return t.name == month; })[0].value += element.avgWaitTime;
                                    }
                                });
                                // this.graph_avgWaitTime = graph_month;
                                if (!data.json().length) {
                                    _this._analyticsService.updateChart('line', temp_graph_3, 'flat', 'Wait Time', true);
                                    // return;
                                }
                                else {
                                    _this._analyticsService.updateChart('line', temp_graph_3, 'flat', 'Wait Time', false, totalAvgWaitTime);
                                }
                            }
                            break;
                    }
                }
                else {
                    var graph_agents_1 = [];
                    switch (event.selectedDateType) {
                        case 'today':
                        case 'yesterday':
                            event.selectedAgents.forEach(function (agent) {
                                graph_agents_1.push({
                                    name: agent,
                                    series: []
                                });
                            });
                            data.json().forEach(function (element) {
                                totalAvgWaitTime += element.avgWaitTime;
                            });
                            graph_agents_1.forEach(function (agent) {
                                var firstHalf = [];
                                var secondHalf = [];
                                for (var i = 0; i < 12; i++) {
                                    firstHalf.push({
                                        "name": (i == 0) ? '12 AM' : i + ' AM',
                                        "value": 0
                                    });
                                }
                                for (var i = 0; i < 12; i++) {
                                    secondHalf.push({
                                        "name": (i == 0) ? '12 PM' : i + ' PM',
                                        "value": 0
                                    });
                                }
                                data.json().forEach(function (element) {
                                    // this.table_visitors.concat(element.convIDs);
                                    if (element.email == agent.name) {
                                        // console.log('Matched Agent');
                                        // let date = this._analyticsService.dateFormatter(new Date()) + 'T' + element._id + ':00:00.000Z';
                                        // let time = new Date(date).getHours();
                                        var time_1 = Number(element._id);
                                        if (time_1 < 12) {
                                            firstHalf.forEach(function (s) {
                                                if (s.name == ((time_1 == 0) ? 12 + ' AM' : time_1 + ' AM')) {
                                                    s.value = element.avgWaitTime;
                                                }
                                            });
                                        }
                                        else if (time_1 >= 12) {
                                            var n_3 = time_1 - 12;
                                            secondHalf.forEach(function (s) {
                                                if (s.name == ((n_3 == 0) ? 12 + ' PM' : n_3 + ' PM')) {
                                                    s.value = element.avgWaitTime;
                                                }
                                            });
                                        }
                                    }
                                });
                                agent.series = firstHalf.concat(secondHalf);
                            });
                            if (!data.json().length) {
                                _this._analyticsService.updateChart('column', graph_agents_1, 'flat', 'Wait Time', true);
                                // return;
                            }
                            else {
                                _this._analyticsService.updateChart('column', graph_agents_1, 'agents', 'Wait Time', false, totalAvgWaitTime);
                            }
                            break;
                        case 'week':
                            event.selectedAgents.forEach(function (agent) {
                                graph_agents_1.push({
                                    name: agent,
                                    value: 0
                                });
                            });
                            data.json().forEach(function (element) {
                                totalAvgWaitTime += element.avgWaitTime;
                            });
                            graph_agents_1.forEach(function (agent) {
                                var graph_week = [];
                                for (var i = 6; i >= 0; i--) {
                                    var date = _this._analyticsService.SubtractDays(new Date(), i);
                                    graph_week.push({
                                        name: date.getDate() + ' ' + _this._analyticsService.monthNames[date.getMonth()] + ' ' + date.getFullYear(),
                                        value: 0
                                    });
                                }
                                ;
                                data.json().forEach(function (element) {
                                    if (element.email == agent.name) {
                                        graph_week.forEach(function (e) {
                                            var date = Number(element._id.split('-')[2]) + ' ' + _this._analyticsService.monthNames[new Date(element._id).getMonth()] + ' ' + new Date(element._id).getFullYear();
                                            if (e.name == date) {
                                                e.value = element.avgWaitTime;
                                            }
                                        });
                                    }
                                    agent.series = graph_week;
                                });
                            });
                            if (!data.json().length) {
                                _this._analyticsService.updateChart('column', graph_agents_1, 'flat', 'Wait Time', true);
                                // return;
                            }
                            else {
                                _this._analyticsService.updateChart('column', graph_agents_1, 'agents', 'Wait Time', false, totalAvgWaitTime);
                            }
                            break;
                        case 'month':
                            event.selectedAgents.forEach(function (agent) {
                                graph_agents_1.push({
                                    name: agent,
                                    series: []
                                });
                            });
                            data.json().forEach(function (element) {
                                totalAvgWaitTime += element.avgWaitTime;
                            });
                            graph_agents_1.forEach(function (agent) {
                                var graph_month = [];
                                for (var i = 29; i >= 0; i--) {
                                    var date = _this._analyticsService.SubtractDays(new Date(), i);
                                    graph_month.push({
                                        name: date.getDate() + ' ' + _this._analyticsService.monthNames[date.getMonth()] + ' ' + date.getFullYear(),
                                        value: 0
                                    });
                                }
                                data.json().forEach(function (element) {
                                    if (element.email == agent.name) {
                                        graph_month.forEach(function (e) {
                                            var date = Number(element._id.split('-')[2]) + ' ' + _this._analyticsService.monthNames[new Date(element._id).getMonth()] + ' ' + new Date(element._id).getFullYear();
                                            if (e.name == date) {
                                                e.value = element.avgWaitTime;
                                            }
                                        });
                                    }
                                    agent.series = graph_month;
                                });
                            });
                            if (!data.json().length) {
                                _this._analyticsService.updateChart('column', graph_agents_1, 'flat', 'Wait Time', true);
                                // return;
                            }
                            else {
                                _this._analyticsService.updateChart('column', graph_agents_1, 'agents', 'Wait Time', false, totalAvgWaitTime);
                            }
                            break;
                        default:
                            var date1 = new Date(event.selectedDate.from);
                            var date2 = new Date(event.selectedDate.to);
                            if (_this._analyticsService.daysBetween(date1, date2) == 0 || _this._analyticsService.daysBetween(date1, date2) == 1) {
                                event.selectedAgents.forEach(function (agent) {
                                    graph_agents_1.push({
                                        name: agent,
                                        series: []
                                    });
                                });
                                graph_agents_1.forEach(function (agent) {
                                    var firstHalf = [];
                                    var secondHalf = [];
                                    for (var i = 0; i < 12; i++) {
                                        firstHalf.push({
                                            "name": (i == 0) ? '12 AM' : i + ' AM',
                                            "value": 0
                                        });
                                    }
                                    for (var i = 0; i < 12; i++) {
                                        secondHalf.push({
                                            "name": (i == 0) ? '12 PM' : i + ' PM',
                                            "value": 0
                                        });
                                    }
                                    data.json().forEach(function (element) {
                                        if (agent.name == element.email) {
                                            // let date = this._analyticsService.dateFormatter(new Date()) + 'T' + element._id + ':00:00.000Z';
                                            // let time = new Date(date).getHours();
                                            var time_2 = Number(element._id);
                                            if (time_2 < 12) {
                                                firstHalf.forEach(function (s) {
                                                    if (s.name == ((time_2 == 0) ? 12 + ' AM' : time_2 + ' AM')) {
                                                        s.value = element.avgWaitTime;
                                                    }
                                                });
                                            }
                                            else if (time_2 >= 12) {
                                                var n_4 = time_2 - 12;
                                                secondHalf.forEach(function (s) {
                                                    if (s.name == ((n_4 == 0) ? 12 + ' PM' : n_4 + ' PM')) {
                                                        s.value = element.avgWaitTime;
                                                    }
                                                });
                                            }
                                        }
                                    });
                                    agent.series = firstHalf.concat(secondHalf);
                                });
                                if (!data.json().length) {
                                    _this._analyticsService.updateChart('column', graph_agents_1, 'flat', 'Wait Time', true);
                                    // return;
                                }
                                else {
                                    _this._analyticsService.updateChart('column', graph_agents_1, 'agents', 'Wait Time', false, totalAvgWaitTime);
                                }
                            }
                            else if (_this._analyticsService.daysBetween(date1, date2) < 16) {
                                event.selectedAgents.forEach(function (agent) {
                                    graph_agents_1.push({
                                        name: agent,
                                        value: 0
                                    });
                                });
                                graph_agents_1.forEach(function (agent) {
                                    var graph_week = [];
                                    for (var i = _this._analyticsService.daysBetween(date1, date2); i >= 0; i--) {
                                        var date = _this._analyticsService.SubtractDays(new Date(), i);
                                        graph_week.push({
                                            name: date.getDate() + ' ' + _this._analyticsService.monthNames[date.getMonth()] + ' ' + date.getFullYear(),
                                            series: []
                                        });
                                    }
                                    data.json().forEach(function (element) {
                                        totalAvgWaitTime += element.avgWaitTime;
                                        if (agent.name == element.email) {
                                            graph_week.forEach(function (e) {
                                                var date = Number(element._id.split('-')[2]) + ' ' + _this._analyticsService.monthNames[new Date(element._id).getMonth()] + ' ' + new Date(element._id).getFullYear();
                                                if (e.name == date) {
                                                    e.value = element.avgWaitTime;
                                                }
                                            });
                                        }
                                        agent.series = graph_week;
                                    });
                                });
                                if (!data.json().length) {
                                    _this._analyticsService.updateChart('column', graph_agents_1, 'flat', 'Wait Time', true);
                                    // return;
                                }
                                else {
                                    _this._analyticsService.updateChart('column', graph_agents_1, 'agents', 'Wait Time', false, totalAvgWaitTime);
                                }
                            }
                            else {
                                event.selectedAgents.forEach(function (agent) {
                                    graph_agents_1.push({
                                        name: agent,
                                        series: []
                                    });
                                });
                                graph_agents_1.forEach(function (agent) {
                                    var graph_month = [];
                                    for (var i = _this._analyticsService.daysBetween(date1, date2); i >= 0; i--) {
                                        var date = _this._analyticsService.SubtractDays(new Date(), i);
                                        graph_month.push({
                                            name: date.getDate() + ' ' + _this._analyticsService.monthNames[date.getMonth()] + ' ' + date.getFullYear(),
                                            value: 0
                                        });
                                    }
                                    data.json().forEach(function (element) {
                                        totalAvgWaitTime += element.avgWaitTime;
                                        if (agent.name == element.email) {
                                            graph_month.forEach(function (e) {
                                                var date = Number(element._id.split('-')[2]) + ' ' + _this._analyticsService.monthNames[new Date(element._id).getMonth()] + ' ' + new Date(element._id).getFullYear();
                                                if (e.name == date) {
                                                    e.value = element.avgWaitTime;
                                                }
                                            });
                                        }
                                        agent.series = graph_month;
                                    });
                                });
                                if (!data.json().length) {
                                    _this._analyticsService.updateChart('column', graph_agents_1, 'flat', 'Wait Time', true);
                                    // return;
                                }
                                else {
                                    _this._analyticsService.updateChart('column', graph_agents_1, 'agents', 'Wait Time', false, totalAvgWaitTime);
                                }
                            }
                            break;
                    }
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
    AnalyticsAvgwaittimeComponent.prototype.ngAfterViewInit = function () {
        this.chart = new Highcharts.Chart("highchart", this.options);
        this.rendered = true;
    };
    AnalyticsAvgwaittimeComponent.prototype.time_convert = function (num) {
        // num = Math.round(num); 
        var days = Math.floor((num / 24) / 60);
        var hours = Math.floor((num / 60) % 24);
        var minutes = Math.round(num % 60);
        var seconds = Math.round(num * 60 % 60);
        var str = (days) ? days + ' day ' : '';
        str += (hours) ? hours + " hr " : '';
        (minutes) ? str += minutes + ' min ' : '';
        (seconds) ? str += seconds + ' s' : '';
        // console.log(str);
        return (str) ? str : '';
    };
    AnalyticsAvgwaittimeComponent.prototype.showTotal = function (indexExists, index) {
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
        return this.time_convert(count);
    };
    AnalyticsAvgwaittimeComponent.prototype.showSeriesCount = function (index) {
        var count = 0;
        this.options.series[index].data.forEach(function (element) {
            count += element;
        });
        return this.time_convert(count);
    };
    AnalyticsAvgwaittimeComponent.prototype.Export = function () {
        console.log('Exporting...');
        // console.log(this.agentTableData);
        this._analyticsService.exportHTMLToExcel('avgWaitTime', 'AvgWaitTime-' + new Date().getTime());
    };
    AnalyticsAvgwaittimeComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
    };
    AnalyticsAvgwaittimeComponent = __decorate([
        core_1.Component({
            selector: 'app-analytics-avgwaittime',
            templateUrl: './analytics-avgwaittime.component.html',
            styleUrls: ['./analytics-avgwaittime.component.css'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], AnalyticsAvgwaittimeComponent);
    return AnalyticsAvgwaittimeComponent;
}());
exports.AnalyticsAvgwaittimeComponent = AnalyticsAvgwaittimeComponent;
//# sourceMappingURL=analytics-avgwaittime.component.js.map