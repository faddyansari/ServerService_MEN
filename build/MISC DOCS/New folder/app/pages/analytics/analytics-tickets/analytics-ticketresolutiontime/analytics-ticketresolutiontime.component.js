"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsTicketresolutiontimeComponent = void 0;
var core_1 = require("@angular/core");
var Highcharts = require("highcharts");
require('highcharts/modules/exporting')(Highcharts);
var AnalyticsTicketresolutiontimeComponent = /** @class */ (function () {
    function AnalyticsTicketresolutiontimeComponent(_authService, _analyticsService) {
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
                text: 'Ticket Resolution Time'
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
                    return "<div>Resolution time: <b>" + str + "</b></div>";
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
                    _this.options.title.text = 'Ticket Resolution Time (' + _this.time_convert(data.title.text) + ')';
                }
                _this.options.chart.type = data.chart.type;
                _this.options.legend = data.legend;
                _this.options.xAxis.categories = data.xAxis.categories;
                _this.options.series = data.series;
                _this.chart = new Highcharts.Chart("highchart", _this.options);
            }
        }));
    }
    AnalyticsTicketresolutiontimeComponent.prototype.ngOnInit = function () {
    };
    AnalyticsTicketresolutiontimeComponent.prototype.onFilterResult = function (event) {
        var _this = this;
        this._analyticsService.GetTicketResolutionTime(event.csid, event.selectedDateType, event.selectedDate, event.selectedAgents).subscribe(function (data) {
            var totalResolutionTime = 0;
            // this.table_visitors = [];
            var ticketIDs = [];
            // let temp = JSON.stringify(data);			
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
                    // console.log('Matches days');
                    var daysData = [];
                    for (var i = _this._analyticsService.daysBetween(date1, date2) - 1; i >= 0; i--) {
                        daysData.push({
                            name: _this._analyticsService.dayNames[new Date(_this._analyticsService.dateFormatter(_this._analyticsService.SubtractDays(date2, i))).getDay()] + " " + new Date(_this._analyticsService.dateFormatter(_this._analyticsService.SubtractDays(date2, i))).getDate(),
                            series: []
                        });
                    }
                    data.json().forEach(function (element) {
                        totalResolutionTime += element.avgResTime;
                    });
                    daysData.forEach(function (d) {
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
                            element.ticketIDs.forEach(function (id) {
                                ticketIDs = ticketIDs.concat(id);
                            });
                            // console.log(element._id)
                            // console.log((this._analyticsService.dayNames[new Date(element._id).getDay()] + " " + new Date(element._id).getDate()));							
                            var day = element._id;
                            if (d.name == (_this._analyticsService.dayNames[new Date(day).getDay()] + " " + new Date(day).getDate())) {
                                // console.log('Matched!');
                                // let date = this._analyticsService.dateFormatter(new Date()) + 'T' + element._id.split('T')[1].split(':')[0] + ':00:00.000Z';
                                // console.log(date);																
                                var time_1 = new Date(day).getHours();
                                if (time_1 < 12) {
                                    firstHalf.forEach(function (s) {
                                        if (s.name == ((time_1 == 0) ? 12 + ' AM' : time_1 + ' AM')) {
                                            s.value = element.avgResTime;
                                        }
                                    });
                                }
                                else if (time_1 >= 12) {
                                    var n_1 = time_1 - 12;
                                    secondHalf.forEach(function (s) {
                                        if (s.name == ((n_1 == 0) ? 12 + ' PM' : n_1 + ' PM')) {
                                            s.value = element.avgResTime;
                                        }
                                    });
                                }
                            }
                        });
                        d.series = firstHalf.concat(secondHalf);
                    });
                    if (!data.json().length) {
                        _this._analyticsService.updateChart('column', daysData, 'dimensional', 'Resolution Time', true);
                    }
                    else {
                        _this._analyticsService.updateChart('column', daysData, 'dimensional', 'Resolution Time', false, totalResolutionTime);
                    }
                }
                else if (event.selectedComparison.match(/months/g)) {
                    var monthsData = _this._analyticsService.diffMonth(date1, date2);
                    monthsData.forEach(function (m) {
                        data.json().forEach(function (element) {
                            element.ticketIDs.forEach(function (id) {
                                ticketIDs = ticketIDs.concat(id);
                            });
                            if (m.name == _this._analyticsService.monthNames[new Date(element._id).getMonth()]) {
                                m.value += element.avgResTime;
                            }
                        });
                        totalResolutionTime += m.value;
                    });
                    if (!data.json().length) {
                        _this._analyticsService.updateChart('column', monthsData, 'flat', 'Resolution Time', true);
                    }
                    else {
                        _this._analyticsService.updateChart('column', monthsData, 'flat', 'Resolution Time', false, totalResolutionTime);
                    }
                }
                else if (event.selectedComparison.match(/years/g)) {
                    // console.log('Matches months and years');
                    var yearsData = _this._analyticsService.diffYear(date1, date2, 'array');
                    yearsData.forEach(function (y) {
                        var monthsData = [];
                        for (var i = 0; i <= _this._analyticsService.monthNames.length - 1; i++) {
                            monthsData.push({
                                name: _this._analyticsService.monthNames[i],
                                value: 0
                            });
                        }
                        data.json().forEach(function (element) {
                            element.ticketIDs.forEach(function (id) {
                                ticketIDs = ticketIDs.concat(id);
                            });
                            totalResolutionTime += element.avgResTime;
                            if (y.name == new Date(element._id).getFullYear().toString()) {
                                var month_1 = new Date(element._id).getMonth();
                                monthsData.forEach(function (m) {
                                    if (m.name == _this._analyticsService.monthNames[month_1]) {
                                        m.value += element.avgResTime;
                                    }
                                });
                            }
                        });
                        y.series = monthsData;
                    });
                    if (!data.json().length) {
                        _this._analyticsService.updateChart('column', yearsData, 'dimensional', 'Resolution Time', true);
                    }
                    else {
                        _this._analyticsService.updateChart('column', yearsData, 'dimensional', 'Resolution Time', false, totalResolutionTime);
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
                                // this.table_visitors.concat(element.ticketIDs);
                                element.ticketIDs.forEach(function (id) {
                                    ticketIDs = ticketIDs.concat(id);
                                });
                                totalResolutionTime += element.avgResTime;
                                // let date = this._analyticsService.dateFormatter(new Date()) + 'T' + element._id + ':00:00.000Z';
                                // let time = new Date(date).getHours();
                                var time = Number(element._id);
                                if (time < 12) {
                                    firstHalf_1.forEach(function (s) {
                                        if (s.name == ((time == 0) ? 12 + ' AM' : time + ' AM')) {
                                            s.value = element.avgResTime;
                                        }
                                    });
                                }
                                else if (time >= 12) {
                                    var n_2 = time - 12;
                                    secondHalf_1.forEach(function (s) {
                                        if (s.name == ((n_2 == 0) ? 12 + ' PM' : n_2 + ' PM')) {
                                            s.value = element.avgResTime;
                                        }
                                    });
                                }
                            });
                            if (!data.json().length) {
                                _this._analyticsService.updateChart('column', firstHalf_1.concat(secondHalf_1), 'flat', 'Resolution Time', true);
                                // return;
                            }
                            else {
                                _this._analyticsService.updateChart('column', firstHalf_1.concat(secondHalf_1), 'flat', 'Resolution Time', false, totalResolutionTime);
                            }
                            break;
                        case 'week':
                            var graph_week_1 = [];
                            for (var i = 6; i >= 0; i--) {
                                var date = _this._analyticsService.SubtractDays(new Date(), i);
                                graph_week_1.push({
                                    name: date.getDate() + ' ' + _this._analyticsService.monthNames[date.getMonth()] + ' ' + date.getFullYear(),
                                    value: 0
                                });
                            }
                            data.json().forEach(function (element) {
                                element.ticketIDs.forEach(function (id) {
                                    ticketIDs = ticketIDs.concat(id);
                                });
                                totalResolutionTime += element.avgResTime;
                                graph_week_1.forEach(function (e) {
                                    var date = Number(element._id.split('-')[2]) + ' ' + _this._analyticsService.monthNames[new Date(element._id).getMonth()] + ' ' + new Date(element._id).getFullYear();
                                    if (e.name == date) {
                                        e.value = element.avgResTime;
                                    }
                                });
                            });
                            if (!data.json().length) {
                                _this._analyticsService.updateChart('column', graph_week_1, 'flat', 'Resolution Time', true);
                                // return;
                            }
                            else {
                                _this._analyticsService.updateChart('column', graph_week_1, 'flat', 'Resolution Time', false, totalResolutionTime);
                            }
                            break;
                        case 'month':
                            var graph_month_1 = [];
                            for (var i = 29; i >= 0; i--) {
                                var date = _this._analyticsService.SubtractDays(new Date(), i);
                                graph_month_1.push({
                                    name: date.getDate() + ' ' + _this._analyticsService.monthNames[date.getMonth()] + ' ' + date.getFullYear(),
                                    value: 0
                                });
                            }
                            data.json().forEach(function (element) {
                                element.ticketIDs.forEach(function (id) {
                                    ticketIDs = ticketIDs.concat(id);
                                });
                                totalResolutionTime += element.avgResTime;
                                graph_month_1.forEach(function (e) {
                                    var date = Number(element._id.split('-')[2]) + ' ' + _this._analyticsService.monthNames[new Date(element._id).getMonth()] + ' ' + new Date(element._id).getFullYear();
                                    if (e.name == date) {
                                        e.value = element.avgResTime;
                                    }
                                });
                            });
                            if (!data.json().length) {
                                _this._analyticsService.updateChart('column', graph_month_1, 'flat', 'Resolution Time', true);
                                // return;
                            }
                            else {
                                _this._analyticsService.updateChart('column', graph_month_1, 'flat', 'Resolution Time', false, totalResolutionTime);
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
                                    // this.table_visitors.concat(element.ticketIDs);
                                    element.ticketIDs.forEach(function (id) {
                                        ticketIDs = ticketIDs.concat(id);
                                    });
                                    totalResolutionTime += element.avgResTime;
                                    // let date = this._analyticsService.dateFormatter(new Date()) + 'T' + element._id + ':00:00.000Z';
                                    // let time = new Date(date).getHours();
                                    var time = Number(element._id);
                                    if (time < 12) {
                                        firstHalf_2.forEach(function (s) {
                                            if (s.name == ((time == 0) ? 12 + ' AM' : time + ' AM')) {
                                                s.value = element.avgResTime;
                                            }
                                        });
                                    }
                                    else if (time >= 12) {
                                        var n_3 = time - 12;
                                        secondHalf_2.forEach(function (s) {
                                            if (s.name == ((n_3 == 0) ? 12 + ' PM' : n_3 + ' PM')) {
                                                s.value = element.avgResTime;
                                            }
                                        });
                                    }
                                });
                                if (!data.json().length) {
                                    _this._analyticsService.updateChart('column', firstHalf_2.concat(secondHalf_2), 'flat', 'Resolution Time', true);
                                    // return;
                                }
                                else {
                                    _this._analyticsService.updateChart('column', firstHalf_2.concat(secondHalf_2), 'flat', 'Resolution Time', false, totalResolutionTime);
                                }
                            }
                            else if (_this._analyticsService.daysBetween(date1, date2) < 16) {
                                var graph_week_2 = [];
                                for (var i = _this._analyticsService.daysBetween(date1, date2); i >= 0; i--) {
                                    var date = _this._analyticsService.SubtractDays(new Date(), i);
                                    graph_week_2.push({
                                        name: date.getDate() + ' ' + _this._analyticsService.monthNames[date.getMonth()] + ' ' + date.getFullYear(),
                                        value: 0
                                    });
                                }
                                data.json().forEach(function (element) {
                                    element.ticketIDs.forEach(function (id) {
                                        ticketIDs = ticketIDs.concat(id);
                                    });
                                    totalResolutionTime += element.avgResTime;
                                    graph_week_2.forEach(function (e) {
                                        var date = Number(element._id.split('-')[2]) + ' ' + _this._analyticsService.monthNames[new Date(element._id).getMonth()] + ' ' + new Date(element._id).getFullYear();
                                        if (e.name == date) {
                                            e.value = element.avgResTime;
                                        }
                                    });
                                });
                                if (!data.json().length) {
                                    _this._analyticsService.updateChart('column', graph_week_2, 'flat', 'Resolution Time', true);
                                    // return;
                                }
                                else {
                                    _this._analyticsService.updateChart('column', graph_week_2, 'flat', 'Resolution Time', false, totalResolutionTime);
                                }
                            }
                            else {
                                var graph_month_2 = [];
                                for (var i = _this._analyticsService.daysBetween(date1, date2); i >= 0; i--) {
                                    var date = _this._analyticsService.SubtractDays(new Date(), i);
                                    graph_month_2.push({
                                        name: date.getDate() + ' ' + _this._analyticsService.monthNames[date.getMonth()] + ' ' + date.getFullYear(),
                                        value: 0
                                    });
                                }
                                data.json().forEach(function (element) {
                                    element.ticketIDs.forEach(function (id) {
                                        ticketIDs = ticketIDs.concat(id);
                                    });
                                    totalResolutionTime += element.avgResTime;
                                    graph_month_2.forEach(function (e) {
                                        var date = Number(element._id.split('-')[2]) + ' ' + _this._analyticsService.monthNames[new Date(element._id).getMonth()] + ' ' + new Date(element._id).getFullYear();
                                        if (e.name == date) {
                                            e.value = element.avgResTime;
                                        }
                                    });
                                });
                                if (!data.json().length) {
                                    _this._analyticsService.updateChart('column', graph_month_2, 'flat', 'Resolution Time', true);
                                    // return;
                                }
                                else {
                                    _this._analyticsService.updateChart('column', graph_month_2, 'flat', 'Resolution Time', false, totalResolutionTime);
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
                                totalResolutionTime += element.avgResTime;
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
                                    element.ticketIDs.forEach(function (id) {
                                        ticketIDs = ticketIDs.concat(id);
                                    });
                                    totalResolutionTime += element.avgResTime;
                                    // this.table_visitors.concat(element.ticketIDs);
                                    if (element.email == agent.name) {
                                        // console.log('Matched Agent');
                                        // let date = this._analyticsService.dateFormatter(new Date()) + 'T' + element._id + ':00:00.000Z';
                                        // let time = new Date(date).getHours();
                                        var time_2 = Number(element._id);
                                        if (time_2 < 12) {
                                            firstHalf.forEach(function (s) {
                                                if (s.name == ((time_2 == 0) ? 12 + ' AM' : time_2 + ' AM')) {
                                                    s.value = element.avgResTime;
                                                }
                                            });
                                        }
                                        else if (time_2 >= 12) {
                                            var n_4 = time_2 - 12;
                                            secondHalf.forEach(function (s) {
                                                if (s.name == ((n_4 == 0) ? 12 + ' PM' : n_4 + ' PM')) {
                                                    s.value = element.avgResTime;
                                                }
                                            });
                                        }
                                    }
                                });
                                agent.series = firstHalf.concat(secondHalf);
                            });
                            if (!data.json().length) {
                                _this._analyticsService.updateChart('column', graph_agents_1, 'flat', 'Resolution Time', true);
                                // return;
                            }
                            else {
                                _this._analyticsService.updateChart('column', graph_agents_1, 'agents', 'Resolution Time', false, totalResolutionTime);
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
                                element.ticketIDs.forEach(function (id) {
                                    ticketIDs = ticketIDs.concat(id);
                                });
                                totalResolutionTime += element.avgResTime;
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
                                    element.ticketIDs.forEach(function (id) {
                                        ticketIDs = ticketIDs.concat(id);
                                    });
                                    if (element.email == agent.name) {
                                        graph_week.forEach(function (e) {
                                            var date = Number(element._id.split('-')[2]) + ' ' + _this._analyticsService.monthNames[new Date(element._id).getMonth()] + ' ' + new Date(element._id).getFullYear();
                                            if (e.name == date) {
                                                e.value = element.avgResTime;
                                            }
                                        });
                                    }
                                    agent.series = graph_week;
                                });
                            });
                            if (!data.json().length) {
                                _this._analyticsService.updateChart('column', graph_agents_1, 'flat', 'Resolution Time', true);
                                // return;
                            }
                            else {
                                _this._analyticsService.updateChart('column', graph_agents_1, 'agents', 'Resolution Time', false, totalResolutionTime);
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
                                totalResolutionTime += element.avgResTime;
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
                                    element.ticketIDs.forEach(function (id) {
                                        ticketIDs = ticketIDs.concat(id);
                                    });
                                    if (element.email == agent.name) {
                                        graph_month.forEach(function (e) {
                                            var date = Number(element._id.split('-')[2]) + ' ' + _this._analyticsService.monthNames[new Date(element._id).getMonth()] + ' ' + new Date(element._id).getFullYear();
                                            if (e.name == date) {
                                                e.value = element.avgResTime;
                                            }
                                        });
                                    }
                                    agent.series = graph_month;
                                });
                            });
                            if (!data.json().length) {
                                _this._analyticsService.updateChart('column', graph_agents_1, 'flat', 'Resolution Time', true);
                                // return;
                            }
                            else {
                                _this._analyticsService.updateChart('column', graph_agents_1, 'agents', 'Resolution Time', false, totalResolutionTime);
                            }
                            // this.graph_totalChats = graph_agents;
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
                                        // this.table_visitors.concat(element.ticketIDs);
                                        element.ticketIDs.forEach(function (id) {
                                            ticketIDs = ticketIDs.concat(id);
                                        });
                                        totalResolutionTime += element.avgResTime;
                                        if (agent.name == element.email) {
                                            // let date = this._analyticsService.dateFormatter(new Date()) + 'T' + element._id + ':00:00.000Z';
                                            // let time = new Date(date).getHours();
                                            var time_3 = Number(element._id);
                                            if (time_3 < 12) {
                                                firstHalf.forEach(function (s) {
                                                    if (s.name == ((time_3 == 0) ? 12 + ' AM' : time_3 + ' AM')) {
                                                        s.value = element.avgResTime;
                                                    }
                                                });
                                            }
                                            else if (time_3 >= 12) {
                                                var n_5 = time_3 - 12;
                                                secondHalf.forEach(function (s) {
                                                    if (s.name == ((n_5 == 0) ? 12 + ' PM' : n_5 + ' PM')) {
                                                        s.value = element.avgResTime;
                                                    }
                                                });
                                            }
                                        }
                                    });
                                    agent.series = firstHalf.concat(secondHalf);
                                });
                                if (!data.json().length) {
                                    _this._analyticsService.updateChart('column', graph_agents_1, 'flat', 'Resolution Time', true);
                                    // return;
                                }
                                else {
                                    _this._analyticsService.updateChart('column', graph_agents_1, 'agents', 'Resolution Time', false, totalResolutionTime);
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
                                        element.ticketIDs.forEach(function (id) {
                                            ticketIDs = ticketIDs.concat(id);
                                        });
                                        totalResolutionTime += element.avgResTime;
                                        if (agent.name == element.email) {
                                            graph_week.forEach(function (e) {
                                                var date = Number(element._id.split('-')[2]) + ' ' + _this._analyticsService.monthNames[new Date(element._id).getMonth()] + ' ' + new Date(element._id).getFullYear();
                                                if (e.name == date) {
                                                    e.value = element.avgResTime;
                                                }
                                            });
                                        }
                                        agent.series = graph_week;
                                    });
                                });
                                if (!data.json().length) {
                                    _this._analyticsService.updateChart('column', graph_agents_1, 'flat', 'Resolution Time', true);
                                    // return;
                                }
                                else {
                                    _this._analyticsService.updateChart('column', graph_agents_1, 'agents', 'Resolution Time', false, totalResolutionTime);
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
                                        element.ticketIDs.forEach(function (id) {
                                            ticketIDs = ticketIDs.concat(id);
                                        });
                                        totalResolutionTime += element.avgResTime;
                                        if (agent.name == element.email) {
                                            graph_month.forEach(function (e) {
                                                var date = Number(element._id.split('-')[2]) + ' ' + _this._analyticsService.monthNames[new Date(element._id).getMonth()] + ' ' + new Date(element._id).getFullYear();
                                                if (e.name == date) {
                                                    e.value = element.avgResTime;
                                                }
                                            });
                                        }
                                        agent.series = graph_month;
                                    });
                                });
                                if (!data.json().length) {
                                    _this._analyticsService.updateChart('column', graph_agents_1, 'flat', 'Resolution Time', true);
                                    // return;
                                }
                                else {
                                    _this._analyticsService.updateChart('column', graph_agents_1, 'agents', 'Resolution Time', false, totalResolutionTime);
                                }
                            }
                            break;
                    }
                }
            }
            // this._analyticsService.GetTickets(ticketIDs);
        }, function (err) {
            // this._analyticsService.GetTickets([]);
            console.log('Error! Server unreachable.');
        });
    };
    AnalyticsTicketresolutiontimeComponent.prototype.ngAfterViewInit = function () {
        this.chart = new Highcharts.Chart("highchart", this.options);
        this.rendered = true;
    };
    AnalyticsTicketresolutiontimeComponent.prototype.time_convert = function (num) {
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
    AnalyticsTicketresolutiontimeComponent.prototype.showTotal = function (indexExists, index) {
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
    AnalyticsTicketresolutiontimeComponent.prototype.Export = function () {
        console.log('Exporting...');
        // console.log(this.agentTableData);
        this._analyticsService.exportHTMLToExcel('ticketResolution', 'TicketResolution-' + new Date().getTime());
    };
    AnalyticsTicketresolutiontimeComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
    };
    AnalyticsTicketresolutiontimeComponent = __decorate([
        core_1.Component({
            selector: 'app-analytics-ticketresolutiontime',
            templateUrl: './analytics-ticketresolutiontime.component.html',
            styleUrls: ['./analytics-ticketresolutiontime.component.css'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], AnalyticsTicketresolutiontimeComponent);
    return AnalyticsTicketresolutiontimeComponent;
}());
exports.AnalyticsTicketresolutiontimeComponent = AnalyticsTicketresolutiontimeComponent;
//# sourceMappingURL=analytics-ticketresolutiontime.component.js.map