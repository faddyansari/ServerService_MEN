"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsTotalticketsComponent = void 0;
var core_1 = require("@angular/core");
var Highcharts = require("highcharts");
require('highcharts/modules/exporting')(Highcharts);
var AnalyticsTotalticketsComponent = /** @class */ (function () {
    function AnalyticsTotalticketsComponent(_authService, _analyticsService) {
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
                text: 'Total Tickets'
            },
            tooltip: {
                animation: false,
                useHTML: true,
                shadow: false,
                headerFormat: "<div style='text-align:center;font-weight:bold'>{point.key}</div>",
                pointFormat: "<div>Tickets: {point.y}</div>"
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
                    _this.options.title.text = 'Total Tickets (' + data.title.text + ')';
                }
                else {
                    _this.options.title.text = 'Total Tickets';
                }
                _this.options.chart.type = data.chart.type;
                _this.options.legend = data.legend;
                _this.options.xAxis.categories = data.xAxis.categories;
                _this.options.series = data.series;
                _this.chart = new Highcharts.Chart("highchart", _this.options);
                // console.log(this.options.series);
            }
        }));
    }
    AnalyticsTotalticketsComponent.prototype.ngOnInit = function () {
    };
    AnalyticsTotalticketsComponent.prototype.onFilterResult = function (event) {
        var _this = this;
        var totalTickets = 0;
        this._analyticsService.GetTotalTickets(event.csid, (event.comparison) ? event.selectedComparison : event.selectedDateType, event.selectedDate, event.selectedAgents, event.selectedGroups).subscribe(function (data) {
            // console.log(data.json());
            data.json().forEach(function (element) {
                totalTickets += element['totalTickets'];
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
                            daysData_1.filter(function (t) { return t.name == (_this._analyticsService.dayNames[new Date(day).getDay()] + " " + new Date(day).getDate()); })[0].value += element.totalTickets;
                        }
                    });
                    if (!data.json().length) {
                        _this._analyticsService.updateChart('column', daysData_1, 'flat', 'Total Tickets', true);
                    }
                    else {
                        _this._analyticsService.updateChart('column', daysData_1, 'flat', 'Total Tickets', false, totalTickets);
                    }
                }
                else if (event.selectedComparison.match(/months/g)) {
                    var temp_graph_1 = _this._analyticsService.diffMonth(date1, date2);
                    data.json().forEach(function (element) {
                        var month = _this._analyticsService.monthNames[new Date(element._id).getMonth()];
                        // console.log(month);
                        if (temp_graph_1.filter(function (t) { return t.name == month; }).length) {
                            temp_graph_1.filter(function (t) { return t.name == month; })[0].value += element.totalTickets;
                        }
                    });
                    if (!data.json().length) {
                        _this._analyticsService.updateChart('column', temp_graph_1, 'flat', 'Total Tickets', true);
                    }
                    else {
                        _this._analyticsService.updateChart('column', temp_graph_1, 'flat', 'Total Tickets', false, totalTickets);
                    }
                }
                else if (event.selectedComparison.match(/years/g)) {
                    // console.log('Matches months and years');
                    var yearsData_1 = _this._analyticsService.diffYear(date1, date2);
                    data.json().forEach(function (element) {
                        var year = new Date(element._id).getFullYear().toString();
                        if (yearsData_1.filter(function (t) { return t.name == year; }).length) {
                            yearsData_1.filter(function (t) { return t.name == year; })[0].value += element.totalTickets;
                        }
                    });
                    if (!data.json().length) {
                        _this._analyticsService.updateChart('column', yearsData_1, 'flat', 'Total Tickets', true);
                    }
                    else {
                        _this._analyticsService.updateChart('column', yearsData_1, 'flat', 'Total Tickets', false, totalTickets);
                    }
                }
            }
            else {
                if (!event.selectedAgents.length && !event.selectedGroups.length) {
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
                                var time = Number(element._id);
                                if (time < 12) {
                                    firstHalf_1.forEach(function (s) {
                                        if (s.name == ((time == 0) ? 12 + ' AM' : time + ' AM')) {
                                            s.value = element.totalTickets;
                                        }
                                    });
                                }
                                else if (time >= 12) {
                                    var n_1 = time - 12;
                                    secondHalf_1.forEach(function (s) {
                                        if (s.name == ((n_1 == 0) ? 12 + ' PM' : n_1 + ' PM')) {
                                            s.value = element.totalTickets;
                                        }
                                    });
                                }
                            });
                            // this.graph_avgWaitTime = today_Data;		
                            if (!data.json().length) {
                                _this._analyticsService.updateChart('column', firstHalf_1.concat(secondHalf_1), 'flat', 'Total Tickets', true);
                                // return;
                            }
                            else {
                                // console.log(totalTickets);
                                _this._analyticsService.updateChart('column', firstHalf_1.concat(secondHalf_1), 'flat', 'Total Tickets', false, totalTickets);
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
                                var date = new Date(element._id);
                                var month = (_this._analyticsService.monthNames[date.getMonth()] + "'" + date.getDate());
                                if (temp_graph_2.filter(function (t) { return t.name == month; }).length) {
                                    temp_graph_2.filter(function (t) { return t.name == month; })[0].value += element.totalTickets;
                                }
                            });
                            // this.graph_avgWaitTime = graph_week;
                            if (!data.json().length) {
                                _this._analyticsService.updateChart('column', temp_graph_2, 'flat', 'Total Tickets', true);
                                // return;
                            }
                            else {
                                _this._analyticsService.updateChart('column', temp_graph_2, 'flat', 'Total Tickets', false, totalTickets);
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
                                    graph_month_1.filter(function (t) { return t.name == month; })[0].value += element.totalTickets;
                                }
                            });
                            // this.graph_avgWaitTime = graph_month;
                            if (!data.json().length) {
                                _this._analyticsService.updateChart('column', graph_month_1, 'flat', 'Total Tickets', true);
                                // return;
                            }
                            else {
                                _this._analyticsService.updateChart('column', graph_month_1, 'flat', 'Total Tickets', false, totalTickets);
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
                                                s.value = element.totalTickets;
                                            }
                                        });
                                    }
                                    else if (time >= 12) {
                                        var n_2 = time - 12;
                                        secondHalf_2.forEach(function (s) {
                                            if (s.name == ((n_2 == 0) ? 12 + ' PM' : n_2 + ' PM')) {
                                                s.value = element.totalTickets;
                                            }
                                        });
                                    }
                                });
                                if (!data.json().length) {
                                    _this._analyticsService.updateChart('column', firstHalf_2.concat(secondHalf_2), 'flat', 'Total Tickets', true);
                                    // return;
                                }
                                else {
                                    _this._analyticsService.updateChart('column', firstHalf_2.concat(secondHalf_2), 'flat', 'Total Tickets', false, totalTickets);
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
                                        graph_week_1.filter(function (t) { return t.name == month; })[0].value += element.totalTickets;
                                    }
                                });
                                // this.graph_avgWaitTime = graph_week;
                                if (!data.json().length) {
                                    _this._analyticsService.updateChart('column', graph_week_1, 'flat', 'Total Tickets', true);
                                    // return;
                                }
                                else {
                                    _this._analyticsService.updateChart('column', graph_week_1, 'flat', 'Total Tickets', false, totalTickets);
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
                                        temp_graph_3.filter(function (t) { return t.name == month; })[0].value += element.totalTickets;
                                    }
                                });
                                // this.graph_avgWaitTime = graph_month;
                                if (!data.json().length) {
                                    _this._analyticsService.updateChart('column', temp_graph_3, 'flat', 'Total Tickets', true);
                                    // return;
                                }
                                else {
                                    _this._analyticsService.updateChart('column', temp_graph_3, 'flat', 'Total Tickets', false, totalTickets);
                                }
                            }
                            break;
                    }
                }
                else if (event.selectedAgents.length && !event.selectedGroups.length) {
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
                                                    s.value = element.totalTickets;
                                                }
                                            });
                                        }
                                        else if (time_1 >= 12) {
                                            var n_3 = time_1 - 12;
                                            secondHalf.forEach(function (s) {
                                                if (s.name == ((n_3 == 0) ? 12 + ' PM' : n_3 + ' PM')) {
                                                    s.value = element.totalTickets;
                                                }
                                            });
                                        }
                                    }
                                });
                                agent.series = firstHalf.concat(secondHalf);
                            });
                            if (!data.json().length) {
                                _this._analyticsService.updateChart('column', graph_agents_1, 'flat', 'Total Tickets', true);
                                // return;
                            }
                            else {
                                _this._analyticsService.updateChart('column', graph_agents_1, 'agents', 'Total Tickets', false, totalTickets);
                            }
                            break;
                        case 'week':
                            event.selectedAgents.forEach(function (agent) {
                                graph_agents_1.push({
                                    name: agent,
                                    value: 0
                                });
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
                                                e.value = element.totalTickets;
                                            }
                                        });
                                    }
                                    agent.series = graph_week;
                                });
                            });
                            if (!data.json().length) {
                                _this._analyticsService.updateChart('column', graph_agents_1, 'flat', 'Total Tickets', true);
                                // return;
                            }
                            else {
                                _this._analyticsService.updateChart('column', graph_agents_1, 'agents', 'Total Tickets', false, totalTickets);
                            }
                            break;
                        case 'month':
                            event.selectedAgents.forEach(function (agent) {
                                graph_agents_1.push({
                                    name: agent,
                                    series: []
                                });
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
                                                e.value = element.totalTickets;
                                            }
                                        });
                                    }
                                    agent.series = graph_month;
                                });
                            });
                            if (!data.json().length) {
                                _this._analyticsService.updateChart('column', graph_agents_1, 'flat', 'Total Tickets', true);
                                // return;
                            }
                            else {
                                _this._analyticsService.updateChart('column', graph_agents_1, 'agents', 'Total Tickets', false, totalTickets);
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
                                                        s.value = element.totalTickets;
                                                    }
                                                });
                                            }
                                            else if (time_2 >= 12) {
                                                var n_4 = time_2 - 12;
                                                secondHalf.forEach(function (s) {
                                                    if (s.name == ((n_4 == 0) ? 12 + ' PM' : n_4 + ' PM')) {
                                                        s.value = element.totalTickets;
                                                    }
                                                });
                                            }
                                        }
                                    });
                                    agent.series = firstHalf.concat(secondHalf);
                                });
                                if (!data.json().length) {
                                    _this._analyticsService.updateChart('column', graph_agents_1, 'flat', 'Total Tickets', true);
                                    // return;
                                }
                                else {
                                    _this._analyticsService.updateChart('column', graph_agents_1, 'agents', 'Total Tickets', false, totalTickets);
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
                                        if (agent.name == element.email) {
                                            graph_week.forEach(function (e) {
                                                var date = Number(element._id.split('-')[2]) + ' ' + _this._analyticsService.monthNames[new Date(element._id).getMonth()] + ' ' + new Date(element._id).getFullYear();
                                                if (e.name == date) {
                                                    e.value = element.totalTickets;
                                                }
                                            });
                                        }
                                        agent.series = graph_week;
                                    });
                                });
                                if (!data.json().length) {
                                    _this._analyticsService.updateChart('column', graph_agents_1, 'flat', 'Total Tickets', true);
                                    // return;
                                }
                                else {
                                    _this._analyticsService.updateChart('column', graph_agents_1, 'agents', 'Total Tickets', false, totalTickets);
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
                                        if (agent.name == element.email) {
                                            graph_month.forEach(function (e) {
                                                var date = Number(element._id.split('-')[2]) + ' ' + _this._analyticsService.monthNames[new Date(element._id).getMonth()] + ' ' + new Date(element._id).getFullYear();
                                                if (e.name == date) {
                                                    e.value = element.totalTickets;
                                                }
                                            });
                                        }
                                        agent.series = graph_month;
                                    });
                                });
                                if (!data.json().length) {
                                    _this._analyticsService.updateChart('column', graph_agents_1, 'flat', 'Total Tickets', true);
                                    // return;
                                }
                                else {
                                    _this._analyticsService.updateChart('column', graph_agents_1, 'agents', 'Total Tickets', false, totalTickets);
                                }
                            }
                            break;
                    }
                }
                else if (event.selectedGroups.length && !event.selectedAgents.length) {
                    var graph_groups_1 = [];
                    switch (event.selectedDateType) {
                        case 'today':
                        case 'yesterday':
                            event.selectedGroups.forEach(function (group) {
                                graph_groups_1.push({
                                    name: group,
                                    series: []
                                });
                            });
                            graph_groups_1.forEach(function (group) {
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
                                    if (element.group == group.name) {
                                        // console.log('Matched Agent');
                                        // let date = this._analyticsService.dateFormatter(new Date()) + 'T' + element._id + ':00:00.000Z';
                                        // let time = new Date(date).getHours();
                                        var time_3 = Number(element._id);
                                        if (time_3 < 12) {
                                            firstHalf.forEach(function (s) {
                                                if (s.name == ((time_3 == 0) ? 12 + ' AM' : time_3 + ' AM')) {
                                                    s.value = element.totalTickets;
                                                }
                                            });
                                        }
                                        else if (time_3 >= 12) {
                                            var n_5 = time_3 - 12;
                                            secondHalf.forEach(function (s) {
                                                if (s.name == ((n_5 == 0) ? 12 + ' PM' : n_5 + ' PM')) {
                                                    s.value = element.totalTickets;
                                                }
                                            });
                                        }
                                    }
                                });
                                group.series = firstHalf.concat(secondHalf);
                            });
                            if (!data.json().length) {
                                _this._analyticsService.updateChart('column', graph_groups_1, 'flat', 'Total Tickets', true);
                                // return;
                            }
                            else {
                                _this._analyticsService.updateChart('column', graph_groups_1, 'agents', 'Total Tickets', false, totalTickets);
                            }
                            break;
                        case 'week':
                            event.selectedGroups.forEach(function (group) {
                                graph_groups_1.push({
                                    name: group,
                                    value: 0
                                });
                            });
                            graph_groups_1.forEach(function (group) {
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
                                    if (element.group == group.name) {
                                        graph_week.forEach(function (e) {
                                            var date = Number(element._id.split('-')[2]) + ' ' + _this._analyticsService.monthNames[new Date(element._id).getMonth()] + ' ' + new Date(element._id).getFullYear();
                                            if (e.name == date) {
                                                e.value = element.totalTickets;
                                            }
                                        });
                                    }
                                    group.series = graph_week;
                                });
                            });
                            if (!data.json().length) {
                                _this._analyticsService.updateChart('column', graph_groups_1, 'flat', 'Total Tickets', true);
                                // return;
                            }
                            else {
                                _this._analyticsService.updateChart('column', graph_groups_1, 'agents', 'Total Tickets', false, totalTickets);
                            }
                            break;
                        case 'month':
                            event.selectedGroups.forEach(function (group) {
                                graph_groups_1.push({
                                    name: group,
                                    series: []
                                });
                            });
                            graph_groups_1.forEach(function (group) {
                                var graph_month = [];
                                for (var i = 29; i >= 0; i--) {
                                    var date = _this._analyticsService.SubtractDays(new Date(), i);
                                    graph_month.push({
                                        name: date.getDate() + ' ' + _this._analyticsService.monthNames[date.getMonth()] + ' ' + date.getFullYear(),
                                        value: 0
                                    });
                                }
                                data.json().forEach(function (element) {
                                    if (element.group == group.name) {
                                        graph_month.forEach(function (e) {
                                            var date = Number(element._id.split('-')[2]) + ' ' + _this._analyticsService.monthNames[new Date(element._id).getMonth()] + ' ' + new Date(element._id).getFullYear();
                                            if (e.name == date) {
                                                e.value = element.totalTickets;
                                            }
                                        });
                                    }
                                    group.series = graph_month;
                                });
                            });
                            if (!data.json().length) {
                                _this._analyticsService.updateChart('column', graph_groups_1, 'flat', 'Total Tickets', true);
                                // return;
                            }
                            else {
                                _this._analyticsService.updateChart('column', graph_groups_1, 'agents', 'Total Tickets', false, totalTickets);
                            }
                            break;
                        default:
                            var date1 = new Date(event.selectedDate.from);
                            var date2 = new Date(event.selectedDate.to);
                            if (_this._analyticsService.daysBetween(date1, date2) == 0 || _this._analyticsService.daysBetween(date1, date2) == 1) {
                                event.selectedGroups.forEach(function (group) {
                                    graph_groups_1.push({
                                        name: group,
                                        series: []
                                    });
                                });
                                graph_groups_1.forEach(function (group) {
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
                                        if (group.name == element.group) {
                                            // let date = this._analyticsService.dateFormatter(new Date()) + 'T' + element._id + ':00:00.000Z';
                                            // let time = new Date(date).getHours();
                                            var time_4 = Number(element._id);
                                            if (time_4 < 12) {
                                                firstHalf.forEach(function (s) {
                                                    if (s.name == ((time_4 == 0) ? 12 + ' AM' : time_4 + ' AM')) {
                                                        s.value = element.totalTickets;
                                                    }
                                                });
                                            }
                                            else if (time_4 >= 12) {
                                                var n_6 = time_4 - 12;
                                                secondHalf.forEach(function (s) {
                                                    if (s.name == ((n_6 == 0) ? 12 + ' PM' : n_6 + ' PM')) {
                                                        s.value = element.totalTickets;
                                                    }
                                                });
                                            }
                                        }
                                    });
                                    group.series = firstHalf.concat(secondHalf);
                                });
                                if (!data.json().length) {
                                    _this._analyticsService.updateChart('column', graph_groups_1, 'flat', 'Total Tickets', true);
                                    // return;
                                }
                                else {
                                    _this._analyticsService.updateChart('column', graph_groups_1, 'agents', 'Total Tickets', false, totalTickets);
                                }
                            }
                            else if (_this._analyticsService.daysBetween(date1, date2) < 16) {
                                event.selectedGroups.forEach(function (group) {
                                    graph_groups_1.push({
                                        name: group,
                                        value: 0
                                    });
                                });
                                graph_groups_1.forEach(function (group) {
                                    var graph_week = [];
                                    for (var i = _this._analyticsService.daysBetween(date1, date2); i >= 0; i--) {
                                        var date = _this._analyticsService.SubtractDays(new Date(), i);
                                        graph_week.push({
                                            name: date.getDate() + ' ' + _this._analyticsService.monthNames[date.getMonth()] + ' ' + date.getFullYear(),
                                            series: []
                                        });
                                    }
                                    data.json().forEach(function (element) {
                                        if (group.name == element.group) {
                                            graph_week.forEach(function (e) {
                                                var date = Number(element._id.split('-')[2]) + ' ' + _this._analyticsService.monthNames[new Date(element._id).getMonth()] + ' ' + new Date(element._id).getFullYear();
                                                if (e.name == date) {
                                                    e.value = element.totalTickets;
                                                }
                                            });
                                        }
                                        group.series = graph_week;
                                    });
                                });
                                if (!data.json().length) {
                                    _this._analyticsService.updateChart('column', graph_groups_1, 'flat', 'Total Tickets', true);
                                    // return;
                                }
                                else {
                                    _this._analyticsService.updateChart('column', graph_groups_1, 'agents', 'Total Tickets', false, totalTickets);
                                }
                            }
                            else {
                                event.selectedGroups.forEach(function (group) {
                                    graph_groups_1.push({
                                        name: group,
                                        series: []
                                    });
                                });
                                graph_groups_1.forEach(function (group) {
                                    var graph_month = [];
                                    for (var i = _this._analyticsService.daysBetween(date1, date2); i >= 0; i--) {
                                        var date = _this._analyticsService.SubtractDays(new Date(), i);
                                        graph_month.push({
                                            name: date.getDate() + ' ' + _this._analyticsService.monthNames[date.getMonth()] + ' ' + date.getFullYear(),
                                            value: 0
                                        });
                                    }
                                    data.json().forEach(function (element) {
                                        if (group.name == element.group) {
                                            graph_month.forEach(function (e) {
                                                var date = Number(element._id.split('-')[2]) + ' ' + _this._analyticsService.monthNames[new Date(element._id).getMonth()] + ' ' + new Date(element._id).getFullYear();
                                                if (e.name == date) {
                                                    e.value = element.totalTickets;
                                                }
                                            });
                                        }
                                        group.series = graph_month;
                                    });
                                });
                                if (!data.json().length) {
                                    _this._analyticsService.updateChart('column', graph_groups_1, 'flat', 'Total Tickets', true);
                                    // return;
                                }
                                else {
                                    _this._analyticsService.updateChart('column', graph_groups_1, 'agents', 'Total Tickets', false, totalTickets);
                                }
                            }
                            break;
                    }
                }
            }
        }, function (err) {
            console.log('Error! Server unreachable.');
        });
    };
    AnalyticsTotalticketsComponent.prototype.ngAfterViewInit = function () {
        this.chart = new Highcharts.Chart("highchart", this.options);
        this.rendered = true;
    };
    AnalyticsTotalticketsComponent.prototype.showTotal = function (indexExists, index) {
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
    AnalyticsTotalticketsComponent.prototype.Export = function () {
        console.log('Exporting...');
        // console.log(this.agentTableData);
        this._analyticsService.exportHTMLToExcel('totalTickets', 'TotalTickets-' + new Date().getTime());
    };
    AnalyticsTotalticketsComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
    };
    AnalyticsTotalticketsComponent = __decorate([
        core_1.Component({
            selector: 'app-analytics-totaltickets',
            templateUrl: './analytics-totaltickets.component.html',
            styleUrls: ['./analytics-totaltickets.component.css'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], AnalyticsTotalticketsComponent);
    return AnalyticsTotalticketsComponent;
}());
exports.AnalyticsTotalticketsComponent = AnalyticsTotalticketsComponent;
//# sourceMappingURL=analytics-totaltickets.component.js.map