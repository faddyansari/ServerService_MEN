"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsTotalchatsComponent = void 0;
var core_1 = require("@angular/core");
var Highcharts = require("highcharts");
require('highcharts/modules/exporting')(Highcharts);
var AnalyticsTotalchatsComponent = /** @class */ (function () {
    function AnalyticsTotalchatsComponent(_authService, _analyticsService, _globalStateService, _chatService) {
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
                description: 'This charts shows the total chats count'
            },
            chart: {
                type: 'column',
                backgroundColor: '#f5f6f8'
            },
            title: {
                text: 'Total Chats'
            },
            tooltip: {
                animation: false,
                useHTML: true,
                shadow: false,
                headerFormat: "<div style='text-align:center;font-weight:bold'>{point.key}</div>",
                pointFormat: "<div>{point.y} Total chats </div>"
            },
            plotOptions: {
                column: {
                    events: {
                        click: function (event) {
                            var data = _this.additionalData;
                            var from = event.point.category;
                            var to = event.point.category;
                            var activeTab = "ARCHIVE";
                            if (data.date == 'today' || data.date == 'yesterday') {
                                from = _this.customFormatter(new Date());
                                to = _this.customFormatter(new Date());
                                activeTab = "ARCHIVE";
                            }
                            else if (data.date.split(',').length == 3) {
                                // activeTab = "ARCHIVE"
                                var details = data.date.split(',');
                                from = details[1];
                                to = details[2];
                            }
                            // console.log('From: ' + from);
                            // console.log('To: ' + to);
                            // console.log(this.selectedAgents);
                            if (_this.selectedAgents.length) {
                                _this._chatService.Filters.next({
                                    filter: {
                                        daterange: { to: to, from: from },
                                        agentEmail: _this.selectedAgents,
                                        override: { "agentEmail": { '$in': _this.selectedAgents },
                                            "state": { '$exists': true } }
                                    }
                                });
                            }
                            else {
                                _this._chatService.Filters.next({
                                    filter: {
                                        daterange: { to: to, from: from },
                                        override: { "agentEmail": { '$exists': true },
                                            "state": { '$exists': true } }
                                    }
                                });
                            }
                            _this._chatService.setActiveTab(activeTab);
                            _this._globalStateService.NavigateTo('/chats');
                        }
                    }
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
                }
            },
            series: [{}]
        };
        this.rendered = false;
        this.selectedAgents = [];
        this.subscriptions.push(_analyticsService.loading.subscribe(function (data) {
            _this.loading = data;
        }));
        this.subscriptions.push(_analyticsService.selectedAgents.subscribe(function (data) {
            _this.selectedAgents = data;
        }));
        this.subscriptions.push(_analyticsService.options.subscribe(function (data) {
            if (_this.rendered) {
                _this.additionalData = data.additionalData;
                if (data.title.text) {
                    _this.options.title.text = 'Total Chats (' + data.title.text + ')';
                }
                else {
                    _this.options.title.text = 'Total Chats';
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
    AnalyticsTotalchatsComponent.prototype.ngOnInit = function () {
    };
    AnalyticsTotalchatsComponent.prototype.onFilterResult = function (event) {
        var _this = this;
        this._analyticsService.GetTotalChats(event.csid, event.selectedDateType, event.selectedDate, event.selectedAgents).subscribe(function (data) {
            var c_selectedAgents = JSON.parse(JSON.stringify(_this.selectedAgents));
            _this._analyticsService.selectedAgents.next(c_selectedAgents);
            var totalChats = 0;
            var assigned = 0;
            var unassigned = 0;
            var convIDs = [];
            data.json().forEach(function (element) {
                totalChats += element.TotalChats;
                assigned += element.Assigned;
                unassigned += element.Unassigned;
            });
            // console.log("Total: " + totalChats);
            // console.log("Assigned: " + assigned);
            // console.log("Unassigned: " + unassigned);
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
                            element.convIDs.forEach(function (id) {
                                convIDs = convIDs.concat(id);
                            });
                            // totalChats += element.TotalChats;
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
                                            s.value = element.TotalChats;
                                        }
                                    });
                                }
                                else if (time_1 >= 12) {
                                    var n_1 = time_1 - 12;
                                    secondHalf.forEach(function (s) {
                                        if (s.name == ((n_1 == 0) ? 12 + ' PM' : n_1 + ' PM')) {
                                            s.value = element.TotalChats;
                                        }
                                    });
                                }
                            }
                        });
                        d.series = firstHalf.concat(secondHalf);
                    });
                    if (!data.json().length) {
                        _this._analyticsService.updateChart('column', daysData, 'dimensional', 'Chats', true);
                    }
                    else {
                        _this._analyticsService.updateChart('column', daysData, 'dimensional', 'Chats', false, totalChats);
                    }
                }
                else if (event.selectedComparison.match(/months/g)) {
                    var monthsData = _this._analyticsService.diffMonth(date1, date2);
                    monthsData.forEach(function (m) {
                        data.json().forEach(function (element) {
                            element.convIDs.forEach(function (id) {
                                convIDs = convIDs.concat(id);
                            });
                            if (m.name == _this._analyticsService.monthNames[new Date(element._id).getMonth()]) {
                                m.value += element.TotalChats;
                            }
                        });
                        totalChats += m.value;
                    });
                    if (!data.json().length) {
                        _this._analyticsService.updateChart('column', monthsData, 'flat', 'Chats', true);
                    }
                    else {
                        _this._analyticsService.updateChart('column', monthsData, 'flat', 'Chats', false, totalChats);
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
                            element.convIDs.forEach(function (id) {
                                convIDs = convIDs.concat(id);
                            });
                            if (y.name == new Date(element._id).getFullYear().toString()) {
                                var month_1 = new Date(element._id).getMonth();
                                monthsData.forEach(function (m) {
                                    if (m.name == _this._analyticsService.monthNames[month_1]) {
                                        m.value += element.TotalChats;
                                    }
                                });
                            }
                        });
                        y.series = monthsData;
                    });
                    if (!data.json().length) {
                        _this._analyticsService.updateChart('column', yearsData, 'dimensional', 'Chats', true);
                    }
                    else {
                        _this._analyticsService.updateChart('column', yearsData, 'dimensional', 'Chats', false, totalChats);
                    }
                }
            }
            else {
                if (!_this.selectedAgents.length) {
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
                                // this.table_visitors.concat(element.convIDs);
                                element.convIDs.forEach(function (id) {
                                    convIDs = convIDs.concat(id);
                                });
                                // let date = this._analyticsService.dateFormatter(new Date()) + 'T' + element._id + ':00:00.000Z';
                                // let time = new Date(date).getHours();
                                var time = Number(element._id);
                                if (time < 12) {
                                    firstHalf_1.forEach(function (s) {
                                        if (s.name == ((time == 0) ? 12 + ' AM' : time + ' AM')) {
                                            s.value = element.TotalChats;
                                        }
                                    });
                                }
                                else if (time >= 12) {
                                    var n_2 = time - 12;
                                    secondHalf_1.forEach(function (s) {
                                        if (s.name == ((n_2 == 0) ? 12 + ' PM' : n_2 + ' PM')) {
                                            s.value = element.TotalChats;
                                        }
                                    });
                                }
                            });
                            if (!data.json().length) {
                                _this._analyticsService.updateChart('column', firstHalf_1.concat(secondHalf_1), 'flat', 'Chats', true);
                                // return;
                            }
                            else {
                                var counts = {
                                    total: totalChats,
                                    assigned: assigned,
                                    unassigned: unassigned
                                };
                                _this._analyticsService.updateChart('column', firstHalf_1.concat(secondHalf_1), 'flat', 'Chats', false, totalChats, counts);
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
                                element.convIDs.forEach(function (id) {
                                    convIDs = convIDs.concat(id);
                                });
                                graph_week_1.forEach(function (e) {
                                    var date = Number(element._id.split('-')[2]) + ' ' + _this._analyticsService.monthNames[new Date(element._id).getMonth()] + ' ' + new Date(element._id).getFullYear();
                                    if (e.name == date) {
                                        e.value = element.TotalChats;
                                    }
                                });
                            });
                            if (!data.json().length) {
                                _this._analyticsService.updateChart('column', graph_week_1, 'flat', 'Chats', true);
                                // return;
                            }
                            else {
                                var counts = {
                                    total: totalChats,
                                    assigned: assigned,
                                    unassigned: unassigned
                                };
                                _this._analyticsService.updateChart('column', graph_week_1, 'flat', 'Chats', false, totalChats, counts);
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
                                element.convIDs.forEach(function (id) {
                                    convIDs = convIDs.concat(id);
                                });
                                graph_month_1.forEach(function (e) {
                                    var date = Number(element._id.split('-')[2]) + ' ' + _this._analyticsService.monthNames[new Date(element._id).getMonth()] + ' ' + new Date(element._id).getFullYear();
                                    if (e.name == date) {
                                        e.value = element.TotalChats;
                                    }
                                });
                            });
                            // console.log(graph_month);
                            if (!data.json().length) {
                                _this._analyticsService.updateChart('column', graph_week_1, 'flat', 'Chats', true);
                                // return;
                            }
                            else {
                                var counts = {
                                    total: totalChats,
                                    assigned: assigned,
                                    unassigned: unassigned
                                };
                                _this._analyticsService.updateChart('column', graph_month_1, 'flat', 'Chats', false, totalChats, counts);
                            }
                            break;
                        default:
                            var date1 = new Date(event.selectedDateType.from);
                            var date2 = new Date(event.selectedDateType.to);
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
                                    // this.table_visitors.concat(element.convIDs);
                                    element.convIDs.forEach(function (id) {
                                        convIDs = convIDs.concat(id);
                                    });
                                    // let date = this._analyticsService.dateFormatter(new Date()) + 'T' + element._id + ':00:00.000Z';
                                    // let time = new Date(date).getHours();
                                    var time = Number(element._id);
                                    if (time < 12) {
                                        firstHalf_2.forEach(function (s) {
                                            if (s.name == ((time == 0) ? 12 + ' AM' : time + ' AM')) {
                                                s.value = element.TotalChats;
                                            }
                                        });
                                    }
                                    else if (time >= 12) {
                                        var n_3 = time - 12;
                                        secondHalf_2.forEach(function (s) {
                                            if (s.name == ((n_3 == 0) ? 12 + ' PM' : n_3 + ' PM')) {
                                                s.value = element.TotalChats;
                                            }
                                        });
                                    }
                                });
                                if (!data.json().length) {
                                    _this._analyticsService.updateChart('column', firstHalf_2.concat(secondHalf_2), 'flat', 'Chats', true);
                                    // return;
                                }
                                else {
                                    var counts = {
                                        total: totalChats,
                                        assigned: assigned,
                                        unassigned: unassigned
                                    };
                                    _this._analyticsService.updateChart('column', firstHalf_2.concat(secondHalf_2), 'flat', 'Chats', false, totalChats, counts);
                                }
                            }
                            else if (_this._analyticsService.daysBetween(date1, date2) < 16) {
                                var graph_week_2 = [];
                                for (var i = _this._analyticsService.daysBetween(date1, date2); i >= 0; i--) {
                                    var date = _this._analyticsService.SubtractDays(new Date(event.selectedDateType.to), i);
                                    graph_week_2.push({
                                        name: date.getDate() + ' ' + _this._analyticsService.monthNames[date.getMonth()] + ' ' + date.getFullYear(),
                                        value: 0
                                    });
                                }
                                data.json().forEach(function (element) {
                                    element.convIDs.forEach(function (id) {
                                        convIDs = convIDs.concat(id);
                                    });
                                    graph_week_2.forEach(function (e) {
                                        var date = Number(element._id.split('-')[2]) + ' ' + _this._analyticsService.monthNames[new Date(element._id).getMonth()] + ' ' + new Date(element._id).getFullYear();
                                        if (e.name == date) {
                                            e.value = element.TotalChats;
                                        }
                                    });
                                });
                                if (!data.json().length) {
                                    _this._analyticsService.updateChart('column', graph_week_2, 'flat', 'Chats', true);
                                    // return;
                                }
                                else {
                                    var counts = {
                                        total: totalChats,
                                        assigned: assigned,
                                        unassigned: unassigned
                                    };
                                    _this._analyticsService.updateChart('column', graph_week_2, 'flat', 'Chats', false, totalChats, counts);
                                }
                            }
                            else {
                                var graph_month_2 = [];
                                for (var i = _this._analyticsService.daysBetween(date1, date2); i >= 0; i--) {
                                    var date = _this._analyticsService.SubtractDays(new Date(event.selectedDateType.to), i);
                                    graph_month_2.push({
                                        name: date.getDate() + ' ' + _this._analyticsService.monthNames[date.getMonth()] + ' ' + date.getFullYear(),
                                        value: 0
                                    });
                                }
                                data.json().forEach(function (element) {
                                    element.convIDs.forEach(function (id) {
                                        convIDs = convIDs.concat(id);
                                    });
                                    graph_month_2.forEach(function (e) {
                                        var date = Number(element._id.split('-')[2]) + ' ' + _this._analyticsService.monthNames[new Date(element._id).getMonth()] + ' ' + new Date(element._id).getFullYear();
                                        if (e.name == date) {
                                            e.value = element.TotalChats;
                                        }
                                    });
                                });
                                if (!data.json().length) {
                                    _this._analyticsService.updateChart('column', graph_month_2, 'flat', 'Chats', true);
                                    // return;
                                }
                                else {
                                    var counts = {
                                        total: totalChats,
                                        assigned: assigned,
                                        unassigned: unassigned
                                    };
                                    _this._analyticsService.updateChart('column', graph_month_2, 'flat', 'Chats', false, totalChats, counts);
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
                            _this.selectedAgents.forEach(function (agent) {
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
                                    element.convIDs.forEach(function (id) {
                                        convIDs = convIDs.concat(id);
                                    });
                                    // this.table_visitors.concat(element.convIDs);
                                    if (element.email == agent.name) {
                                        // console.log('Matched Agent');
                                        // let date = this._analyticsService.dateFormatter(new Date()) + 'T' + element._id + ':00:00.000Z';
                                        // let time = new Date(date).getHours();
                                        var time_2 = Number(element._id);
                                        if (time_2 < 12) {
                                            firstHalf.forEach(function (s) {
                                                if (s.name == ((time_2 == 0) ? 12 + ' AM' : time_2 + ' AM')) {
                                                    s.value = element.TotalChats;
                                                }
                                            });
                                        }
                                        else if (time_2 >= 12) {
                                            var n_4 = time_2 - 12;
                                            secondHalf.forEach(function (s) {
                                                if (s.name == ((n_4 == 0) ? 12 + ' PM' : n_4 + ' PM')) {
                                                    s.value = element.TotalChats;
                                                }
                                            });
                                        }
                                    }
                                });
                                agent.series = firstHalf.concat(secondHalf);
                            });
                            if (!data.json().length) {
                                _this._analyticsService.updateChart('column', graph_agents_1, 'flat', 'Chats', true);
                                // return;
                            }
                            else {
                                _this._analyticsService.updateChart('column', graph_agents_1, 'agents', 'Chats', false, totalChats);
                            }
                            break;
                        case 'week':
                            _this.selectedAgents.forEach(function (agent) {
                                graph_agents_1.push({
                                    name: agent,
                                    value: 0
                                });
                            });
                            data.json().forEach(function (element) {
                                element.convIDs.forEach(function (id) {
                                    convIDs = convIDs.concat(id);
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
                                    element.convIDs.forEach(function (id) {
                                        convIDs = convIDs.concat(id);
                                    });
                                    if (element.email == agent.name) {
                                        graph_week.forEach(function (e) {
                                            var date = Number(element._id.split('-')[2]) + ' ' + _this._analyticsService.monthNames[new Date(element._id).getMonth()] + ' ' + new Date(element._id).getFullYear();
                                            if (e.name == date) {
                                                e.value = element.TotalChats;
                                            }
                                        });
                                    }
                                    agent.series = graph_week;
                                });
                            });
                            if (!data.json().length) {
                                _this._analyticsService.updateChart('column', graph_agents_1, 'flat', 'Chats', true);
                                // return;
                            }
                            else {
                                _this._analyticsService.updateChart('column', graph_agents_1, 'agents', 'Chats', false, totalChats);
                            }
                            break;
                        case 'month':
                            _this.selectedAgents.forEach(function (agent) {
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
                                    element.convIDs.forEach(function (id) {
                                        convIDs = convIDs.concat(id);
                                    });
                                    if (element.email == agent.name) {
                                        graph_month.forEach(function (e) {
                                            var date = Number(element._id.split('-')[2]) + ' ' + _this._analyticsService.monthNames[new Date(element._id).getMonth()] + ' ' + new Date(element._id).getFullYear();
                                            if (e.name == date) {
                                                e.value = element.TotalChats;
                                            }
                                        });
                                    }
                                    agent.series = graph_month;
                                });
                            });
                            if (!data.json().length) {
                                _this._analyticsService.updateChart('column', graph_agents_1, 'flat', 'Chats', true);
                                // return;
                            }
                            else {
                                _this._analyticsService.updateChart('column', graph_agents_1, 'agents', 'Chats', false, totalChats);
                            }
                            // this.graph_totalChats = graph_agents;
                            break;
                        default:
                            var date1 = new Date(event.selectedDateType.from);
                            var date2 = new Date(event.selectedDateType.to);
                            if (_this._analyticsService.daysBetween(date1, date2) == 0 || _this._analyticsService.daysBetween(date1, date2) == 1) {
                                _this.selectedAgents.forEach(function (agent) {
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
                                        element.convIDs.forEach(function (id) {
                                            convIDs = convIDs.concat(id);
                                        });
                                        if (agent.name == element.email) {
                                            // let date = this._analyticsService.dateFormatter(new Date()) + 'T' + element._id + ':00:00.000Z';
                                            // let time = new Date(date).getHours();
                                            var time_3 = Number(element._id);
                                            if (time_3 < 12) {
                                                firstHalf.forEach(function (s) {
                                                    if (s.name == ((time_3 == 0) ? 12 + ' AM' : time_3 + ' AM')) {
                                                        s.value = element.TotalChats;
                                                    }
                                                });
                                            }
                                            else if (time_3 >= 12) {
                                                var n_5 = time_3 - 12;
                                                secondHalf.forEach(function (s) {
                                                    if (s.name == ((n_5 == 0) ? 12 + ' PM' : n_5 + ' PM')) {
                                                        s.value = element.TotalChats;
                                                    }
                                                });
                                            }
                                        }
                                    });
                                    agent.series = firstHalf.concat(secondHalf);
                                });
                                if (!data.json().length) {
                                    _this._analyticsService.updateChart('column', graph_agents_1, 'flat', 'Chats', true);
                                    // return;
                                }
                                else {
                                    _this._analyticsService.updateChart('column', graph_agents_1, 'agents', 'Chats', false, totalChats);
                                }
                            }
                            else if (_this._analyticsService.daysBetween(date1, date2) < 16) {
                                _this.selectedAgents.forEach(function (agent) {
                                    graph_agents_1.push({
                                        name: agent,
                                        value: 0
                                    });
                                });
                                graph_agents_1.forEach(function (agent) {
                                    var graph_week = [];
                                    for (var i = _this._analyticsService.daysBetween(date1, date2); i >= 0; i--) {
                                        var date = _this._analyticsService.SubtractDays(new Date(event.selectedDateType.to), i);
                                        graph_week.push({
                                            name: date.getDate() + ' ' + _this._analyticsService.monthNames[date.getMonth()] + ' ' + date.getFullYear(),
                                            series: []
                                        });
                                    }
                                    data.json().forEach(function (element) {
                                        element.convIDs.forEach(function (id) {
                                            convIDs = convIDs.concat(id);
                                        });
                                        if (agent.name == element.email) {
                                            graph_week.forEach(function (e) {
                                                var date = Number(element._id.split('-')[2]) + ' ' + _this._analyticsService.monthNames[new Date(element._id).getMonth()] + ' ' + new Date(element._id).getFullYear();
                                                if (e.name == date) {
                                                    e.value = element.TotalChats;
                                                }
                                            });
                                        }
                                        agent.series = graph_week;
                                    });
                                });
                                if (!data.json().length) {
                                    _this._analyticsService.updateChart('column', graph_agents_1, 'flat', 'Chats', true);
                                    // return;
                                }
                                else {
                                    _this._analyticsService.updateChart('column', graph_agents_1, 'agents', 'Chats', false, totalChats);
                                }
                            }
                            else {
                                _this.selectedAgents.forEach(function (agent) {
                                    graph_agents_1.push({
                                        name: agent,
                                        series: []
                                    });
                                });
                                graph_agents_1.forEach(function (agent) {
                                    var graph_month = [];
                                    for (var i = _this._analyticsService.daysBetween(date1, date2); i >= 0; i--) {
                                        var date = _this._analyticsService.SubtractDays(new Date(event.selectedDateType.to), i);
                                        graph_month.push({
                                            name: date.getDate() + ' ' + _this._analyticsService.monthNames[date.getMonth()] + ' ' + date.getFullYear(),
                                            value: 0
                                        });
                                    }
                                    data.json().forEach(function (element) {
                                        element.convIDs.forEach(function (id) {
                                            convIDs = convIDs.concat(id);
                                        });
                                        if (agent.name == element.email) {
                                            graph_month.forEach(function (e) {
                                                var date = Number(element._id.split('-')[2]) + ' ' + _this._analyticsService.monthNames[new Date(element._id).getMonth()] + ' ' + new Date(element._id).getFullYear();
                                                if (e.name == date) {
                                                    e.value = element.TotalChats;
                                                }
                                            });
                                        }
                                        agent.series = graph_month;
                                    });
                                });
                                if (!data.json().length) {
                                    _this._analyticsService.updateChart('column', graph_agents_1, 'flat', 'Chats', true);
                                    // return;
                                }
                                else {
                                    _this._analyticsService.updateChart('column', graph_agents_1, 'agents', 'Chats', false, totalChats);
                                }
                            }
                            break;
                    }
                }
            }
            // let temp = JSON.stringify(data);												
            // this._analyticsService.GetConversations(convIDs);
            // console.log(this.graph_uniqueVisitors);				
        }, function (err) {
            // this._analyticsService.GetConversations([]);
            console.log('Error! Server unreachable.');
            // this.unreachable = true;
        });
    };
    AnalyticsTotalchatsComponent.prototype.ngAfterViewInit = function () {
        this.chart = new Highcharts.Chart("highchart", this.options);
        this.rendered = true;
    };
    AnalyticsTotalchatsComponent.prototype.showTotal = function (indexExists, index) {
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
    AnalyticsTotalchatsComponent.prototype.Export = function () {
        console.log('Exporting...');
        // console.log(this.agentTableData);
        this._analyticsService.exportHTMLToExcel('totalChats', 'TotalChats-' + new Date().getTime());
    };
    AnalyticsTotalchatsComponent.prototype.customFormatter = function (date) {
        return ("0" + (Number(date.getMonth()) + 1)).slice(-2) + '-' + ("0" + date.getDate()).slice(-2) + '-' + date.getFullYear();
    };
    AnalyticsTotalchatsComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
    };
    AnalyticsTotalchatsComponent = __decorate([
        core_1.Component({
            selector: 'app-analytics-totalchats',
            templateUrl: './analytics-totalchats.component.html',
            styleUrls: ['./analytics-totalchats.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], AnalyticsTotalchatsComponent);
    return AnalyticsTotalchatsComponent;
}());
exports.AnalyticsTotalchatsComponent = AnalyticsTotalchatsComponent;
//# sourceMappingURL=analytics-totalchats.component.js.map