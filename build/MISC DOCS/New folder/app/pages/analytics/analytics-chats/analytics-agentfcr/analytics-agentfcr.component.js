"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsAgentfcrComponent = void 0;
var core_1 = require("@angular/core");
var Highcharts = require("highcharts");
require('highcharts/modules/exporting')(Highcharts);
require('highcharts/modules/export-data')(Highcharts);
var AnalyticsAgentfcrComponent = /** @class */ (function () {
    function AnalyticsAgentfcrComponent(_authService, _chatService, _globalStateService, _analyticsService) {
        var _this = this;
        this._chatService = _chatService;
        this._globalStateService = _globalStateService;
        this._analyticsService = _analyticsService;
        this.subscriptions = [];
        this.loading = false;
        this.highcharts = Highcharts;
        this.options = {
            chart: {
                type: 'column',
                backgroundColor: '#f5f6f8'
            },
            title: {
                text: 'Chat Experience'
            },
            plotOptions: {
                line: {
                    lineWidth: 1,
                    marker: {
                        symbol: 'circle',
                        radius: 2
                    },
                    events: {
                        click: function (event) {
                            var data = _this.additionalData;
                            var from = event.point.category;
                            var to = event.point.category;
                            if (data.date == 'today' || data.date == 'yesterday') {
                                from = new Date().toDateString();
                                to = new Date().toDateString();
                            }
                            else if (data.date.split(',').length == 3) {
                                var details = data.date.split(',');
                                from = details[1];
                                to = details[2];
                            }
                            // console.log(event.point.series.name.toLowerCase());
                            // console.log('From: ' + from);
                            // console.log('To: ' + to);
                            switch (event.point.series.name.toLowerCase()) {
                                case 'unfilled':
                                    _this._chatService.Filters.next({
                                        filter: {
                                            daterange: { to: to, from: from },
                                            feedback: {
                                                $exists: false
                                            },
                                            override: { "state": { '$exists': true },
                                                "agentEmail": { '$exists': true } },
                                        }
                                    });
                                    break;
                                case 'yes':
                                    _this._chatService.Filters.next({
                                        filter: {
                                            daterange: { to: to, from: from },
                                            'feedback.Q1': { '$eq': "yes" },
                                            override: { "state": { '$exists': true },
                                                "agentEmail": { '$exists': true } },
                                        }
                                    });
                                    break;
                                case 'no':
                                    _this._chatService.Filters.next({
                                        filter: {
                                            daterange: { to: to, from: from },
                                            'feedback.Q1': { '$eq': "no" },
                                            override: { "state": { '$exists': true },
                                                "agentEmail": { '$exists': true } },
                                        }
                                    });
                                    break;
                            }
                            _this._chatService.setActiveTab('ARCHIVE');
                            _this._globalStateService.NavigateTo('/chats');
                        }
                    }
                },
                column: {
                    events: {
                        click: function (event) {
                            var data = _this.additionalData;
                            var from = event.point.category;
                            var to = event.point.category;
                            if (data.date == 'today' || data.date == 'yesterday') {
                                from = new Date().toDateString();
                                to = new Date().toDateString();
                            }
                            else if (data.date.split(',').length == 3) {
                                var details = data.date.split(',');
                                from = details[1];
                                to = details[2];
                            }
                            // console.log(event.point.series.name.toLowerCase());
                            // console.log('From: ' + from);
                            // console.log('To: ' + to);
                            switch (event.point.series.name.toLowerCase()) {
                                case 'unfilled':
                                    _this._chatService.Filters.next({
                                        filter: {
                                            daterange: { to: to, from: from },
                                            feedback: {
                                                $exists: false
                                            },
                                            override: { "state": { '$exists': true },
                                                "agentEmail": { '$exists': true } },
                                        }
                                    });
                                    break;
                                case 'yes':
                                    _this._chatService.Filters.next({
                                        filter: {
                                            daterange: { to: to, from: from },
                                            'feedback.Q1': { '$eq': "yes" },
                                            override: { "state": { '$exists': true },
                                                "agentEmail": { '$exists': true } },
                                        }
                                    });
                                    break;
                                case 'no':
                                    _this._chatService.Filters.next({
                                        filter: {
                                            daterange: { to: to, from: from },
                                            'feedback.Q1': { '$eq': "no" },
                                            override: { "state": { '$exists': true },
                                                "agentEmail": { '$exists': true } },
                                        }
                                    });
                                    break;
                            }
                            _this._chatService.setActiveTab('ARCHIVE');
                            _this._globalStateService.NavigateTo('/chats');
                        }
                    }
                }
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
            xAxis: {
                categories: []
            },
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
            if (_this.rendered && !_this.selectedAgents.length) {
                _this.additionalData = data.additionalData;
                _this.options.chart.type = data.chart.type;
                _this.options.legend = data.legend;
                _this.options.xAxis.categories = data.xAxis.categories;
                _this.options.series = data.series;
                setTimeout(function () {
                    _this.chart = new Highcharts.Chart("highchart", _this.options);
                }, 0);
            }
            else {
                // console.log(data.series);
                _this.agentTableData = data.series;
                // agentTableData = data.series;
            }
        }));
    }
    AnalyticsAgentfcrComponent.prototype.onFilterResult = function (event) {
        var _this = this;
        this._analyticsService.GetAgentFCR(event.csid, event.selectedDateType, event.selectedDate, event.selectedAgents).subscribe(function (data) {
            var c_selectedAgents = JSON.parse(JSON.stringify(_this.selectedAgents));
            _this._analyticsService.selectedAgents.next(c_selectedAgents);
            // console.log(data.json());
            var convIDs = [];
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
                    var series_group = [
                        {
                            name: "unfilled",
                            series: []
                        },
                        {
                            name: "yes",
                            series: []
                        },
                        {
                            name: "no",
                            series: []
                        }
                    ];
                    series_group.forEach(function (s) {
                        var daysData = [];
                        for (var i = _this._analyticsService.daysBetween(date1, date2) - 1; i >= 0; i--) {
                            daysData.push({
                                name: _this._analyticsService.dayNames[new Date(_this._analyticsService.dateFormatter(_this._analyticsService.SubtractDays(date2, i))).getDay()] + " " + new Date(_this._analyticsService.dateFormatter(_this._analyticsService.SubtractDays(date2, i))).getDate(),
                                value: 0
                            });
                        }
                        daysData.forEach(function (d) {
                            data.json().forEach(function (element) {
                                var day = element._id;
                                if (d.name == (_this._analyticsService.dayNames[new Date(day).getDay()] + " " + new Date(day).getDate())) {
                                    d.value += element[s.name];
                                }
                            });
                        });
                        s.series = daysData;
                    });
                    if (!data.json().length) {
                        _this._analyticsService.updateChart('line', series_group, 'dimensional', 'Experience', true);
                        // return;
                    }
                    else {
                        _this._analyticsService.updateChart('line', series_group, 'dimensional', 'Experience');
                    }
                    // console.log(daysData);
                    // this.graph_agentFCR = daysData;
                }
                else if (event.selectedComparison.match(/months/g)) {
                    var series_group = [
                        {
                            name: "unfilled",
                            series: []
                        },
                        {
                            name: "yes",
                            series: []
                        },
                        {
                            name: "no",
                            series: []
                        }
                    ];
                    series_group.forEach(function (s) {
                        var monthsData = _this._analyticsService.diffMonth(date1, date2);
                        monthsData.forEach(function (m) {
                            data.json().forEach(function (element) {
                                if (m.name == _this._analyticsService.monthNames[new Date(element._id).getMonth()]) {
                                    m.value += element[s.name];
                                }
                            });
                        });
                        s.series = monthsData;
                    });
                    if (!data.json().length) {
                        _this._analyticsService.updateChart('line', series_group, 'dimensional', 'FCRs', true);
                        // return;
                    }
                    else {
                        _this._analyticsService.updateChart('line', series_group, 'dimensional', 'FCRs');
                    }
                    // this.graph_agentFCR = monthsData;
                }
                else if (event.selectedComparison.match(/years/g)) {
                    // console.log('Matches months and years');
                    var series_group = [
                        {
                            name: "unfilled",
                            series: []
                        },
                        {
                            name: "yes",
                            series: []
                        },
                        {
                            name: "no",
                            series: []
                        }
                    ];
                    series_group.forEach(function (s) {
                        var yearsData = _this._analyticsService.diffYear(date1, date2);
                        yearsData.forEach(function (y) {
                            data.json().forEach(function (element) {
                                if (y.name == new Date(element._id).getFullYear().toString()) {
                                    y.value += element[s.name];
                                }
                            });
                        });
                        s.series = yearsData;
                    });
                    // console.log(series_group);
                    if (!data.json().length) {
                        _this._analyticsService.updateChart('line', series_group, 'dimensional', 'FCRs', true);
                        // return;
                    }
                    else {
                        _this._analyticsService.updateChart('line', series_group, 'dimensional', 'FCRs');
                    }
                    // this.graph_agentFCR = yearsData;
                }
            }
            else {
                if (!_this.selectedAgents.length) {
                    switch (event.selectedDateType) {
                        case 'today':
                        case 'yesterday':
                            var graph_temp = [
                                {
                                    name: "unfilled",
                                    series: []
                                },
                                {
                                    name: "yes",
                                    series: []
                                },
                                {
                                    name: "no",
                                    series: []
                                }
                            ];
                            graph_temp.forEach(function (e) {
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
                                    // let date = this.dateFormatter(new Date()) + 'T' + element._id + ':00:00.000Z';
                                    // let time = new Date(date).getHours();
                                    var time = Number(element._id);
                                    if (time < 12) {
                                        firstHalf.forEach(function (s) {
                                            if (s.name == ((time == 0) ? 12 + ' AM' : time + ' AM')) {
                                                s.value = element[e.name];
                                            }
                                        });
                                    }
                                    else if (time >= 12) {
                                        var n_1 = time - 12;
                                        secondHalf.forEach(function (s) {
                                            if (s.name == ((n_1 == 0) ? 12 + ' PM' : n_1 + ' PM')) {
                                                s.value = element[e.name];
                                            }
                                        });
                                    }
                                });
                                e.series = firstHalf.concat(secondHalf);
                            });
                            data.json().forEach(function (element) {
                                // this.table_visitors.concat(element.convIDs);
                                element.convIDs.forEach(function (id) {
                                    convIDs = convIDs.concat(id);
                                });
                            });
                            // this.graph_agentFCR = graph_temp;
                            if (!data.json().length) {
                                _this._analyticsService.updateChart('line', graph_temp, 'dimensional', 'FCRs', true);
                                // return;
                            }
                            else {
                                _this._analyticsService.updateChart('line', graph_temp, 'dimensional', 'FCRs');
                            }
                            break;
                        case 'week':
                            var series_group = [
                                {
                                    name: "unfilled",
                                    series: []
                                },
                                {
                                    name: "yes",
                                    series: []
                                },
                                {
                                    name: "no",
                                    series: []
                                }
                            ];
                            series_group.forEach(function (s) {
                                var graph_week = [];
                                for (var i = 6; i >= 0; i--) {
                                    var date = _this._analyticsService.SubtractDays(new Date(), i);
                                    graph_week.push({
                                        name: date.getDate() + ' ' + _this._analyticsService.monthNames[date.getMonth()] + ' ' + date.getFullYear(),
                                        value: 0
                                    });
                                }
                                graph_week.forEach(function (d) {
                                    data.json().forEach(function (element) {
                                        var date = Number(element._id.split('-')[2]) + ' ' + _this._analyticsService.monthNames[new Date(element._id).getMonth()] + ' ' + new Date(element._id).getFullYear();
                                        if (d.name == date) {
                                            d.value += element[s.name];
                                        }
                                    });
                                });
                                s.series = graph_week;
                            });
                            if (!data.json().length) {
                                _this._analyticsService.updateChart('line', series_group, 'dimensional', 'FCRs', true);
                                // return;
                            }
                            else {
                                _this._analyticsService.updateChart('line', series_group, 'dimensional', 'FCRs');
                            }
                            break;
                        case 'month':
                            var graph_month = [
                                {
                                    name: "unfilled",
                                    series: []
                                },
                                {
                                    name: "yes",
                                    series: []
                                },
                                {
                                    name: "no",
                                    series: []
                                }
                            ];
                            graph_month.forEach(function (e) {
                                var month_days = [];
                                for (var i = 29; i >= 0; i--) {
                                    var date = _this._analyticsService.SubtractDays(new Date(), i);
                                    month_days.push({
                                        name: date.getDate() + ' ' + _this._analyticsService.monthNames[date.getMonth()] + ' ' + date.getFullYear(),
                                        value: 0
                                    });
                                }
                                data.json().forEach(function (element) {
                                    element.convIDs.forEach(function (id) {
                                        convIDs = convIDs.concat(id);
                                    });
                                    month_days.forEach(function (m) {
                                        var date = Number(element._id.split('-')[2]) + ' ' + _this._analyticsService.monthNames[new Date(element._id).getMonth()] + ' ' + new Date(element._id).getFullYear();
                                        if (m.name == date) {
                                            m.value = element[e.name];
                                        }
                                    });
                                });
                                e.series = month_days;
                            });
                            if (!data.json().length) {
                                _this._analyticsService.updateChart('line', graph_month, 'dimensional', 'FCRs', true);
                                // return;
                            }
                            else {
                                _this._analyticsService.updateChart('line', graph_month, 'dimensional', 'FCRs');
                            }
                            break;
                        default:
                            var date1 = new Date(event.selectedDate.from);
                            var date2 = new Date(event.selectedDate.to);
                            if (_this._analyticsService.daysBetween(date1, date2) == 0 || _this._analyticsService.daysBetween(date1, date2) == 1) {
                                var graph_temp_1 = [
                                    {
                                        name: "unfilled",
                                        series: []
                                    },
                                    {
                                        name: "yes",
                                        series: []
                                    },
                                    {
                                        name: "no",
                                        series: []
                                    }
                                ];
                                graph_temp_1.forEach(function (e) {
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
                                        // let date = this.dateFormatter(new Date()) + 'T' + element._id + ':00:00.000Z';
                                        // let time = new Date(date).getHours();
                                        var time = Number(element._id);
                                        if (time < 12) {
                                            firstHalf.forEach(function (s) {
                                                if (s.name == ((time == 0) ? 12 + ' AM' : time + ' AM')) {
                                                    s.value = element[e.name];
                                                }
                                            });
                                        }
                                        else if (time >= 12) {
                                            var n_2 = time - 12;
                                            secondHalf.forEach(function (s) {
                                                if (s.name == ((n_2 == 0) ? 12 + ' PM' : n_2 + ' PM')) {
                                                    s.value = element[e.name];
                                                }
                                            });
                                        }
                                    });
                                    e.series = firstHalf.concat(secondHalf);
                                });
                                if (!data.json().length) {
                                    _this._analyticsService.updateChart('line', graph_temp_1, 'dimensional', 'FCRs', true);
                                    // return;
                                }
                                else {
                                    _this._analyticsService.updateChart('line', graph_temp_1, 'dimensional', 'FCRs');
                                }
                            }
                            else if (_this._analyticsService.daysBetween(date1, date2) < 16) {
                                var series_group_1 = [
                                    {
                                        name: "unfilled",
                                        series: []
                                    },
                                    {
                                        name: "yes",
                                        series: []
                                    },
                                    {
                                        name: "no",
                                        series: []
                                    }
                                ];
                                series_group_1.forEach(function (s) {
                                    var graph_week = [];
                                    for (var i = _this._analyticsService.daysBetween(date1, date2); i >= 0; i--) {
                                        var date = _this._analyticsService.SubtractDays(new Date(event.selectedDate.to), i);
                                        graph_week.push({
                                            name: date.getDate() + ' ' + _this._analyticsService.monthNames[date.getMonth()] + ' ' + date.getFullYear(),
                                            value: 0
                                        });
                                    }
                                    graph_week.forEach(function (d) {
                                        data.json().forEach(function (element) {
                                            var date = Number(element._id.split('-')[2]) + ' ' + _this._analyticsService.monthNames[new Date(element._id).getMonth()] + ' ' + new Date(element._id).getFullYear();
                                            if (d.name == date) {
                                                d.value += element[s.name];
                                            }
                                        });
                                    });
                                    s.series = graph_week;
                                });
                                if (!data.json().length) {
                                    _this._analyticsService.updateChart('line', series_group_1, 'dimensional', 'FCRs', true);
                                    // return;
                                }
                                else {
                                    _this._analyticsService.updateChart('line', series_group_1, 'dimensional', 'FCRs');
                                }
                            }
                            else {
                                var graph_month_1 = [
                                    {
                                        name: "unfilled",
                                        series: []
                                    },
                                    {
                                        name: "yes",
                                        series: []
                                    },
                                    {
                                        name: "no",
                                        series: []
                                    }
                                ];
                                graph_month_1.forEach(function (e) {
                                    var month_days = [];
                                    for (var i = _this._analyticsService.daysBetween(date1, date2); i >= 0; i--) {
                                        var date = _this._analyticsService.SubtractDays(new Date(event.selectedDate.to), i);
                                        month_days.push({
                                            name: date.getDate() + ' ' + _this._analyticsService.monthNames[date.getMonth()] + ' ' + date.getFullYear(),
                                            value: 0
                                        });
                                    }
                                    ;
                                    data.json().forEach(function (element) {
                                        element.convIDs.forEach(function (id) {
                                            convIDs = convIDs.concat(id);
                                        });
                                        month_days.forEach(function (m) {
                                            var date = Number(element._id.split('-')[2]) + ' ' + _this._analyticsService.monthNames[new Date(element._id).getMonth()] + ' ' + new Date(element._id).getFullYear();
                                            if (m.name == date) {
                                                m.value = element[e.name];
                                            }
                                        });
                                    });
                                    e.series = month_days;
                                });
                                if (!data.json().length) {
                                    _this._analyticsService.updateChart('line', graph_month_1, 'dimensional', 'FCRs', true);
                                    // return;
                                }
                                else {
                                    _this._analyticsService.updateChart('line', graph_month_1, 'dimensional', 'FCRs');
                                }
                            }
                            break;
                    }
                }
                else {
                    var dummyJSON = {};
                    // console.log(data.json());
                    data.json().forEach(function (element, index) {
                        var _a;
                        var obj = (_a = {},
                            _a[element.date] = {
                                unfilled: [],
                                yes: [],
                                no: []
                            },
                            _a);
                        _this.selectedAgents.forEach(function (agent) {
                            obj[element.date].unfilled.push({
                                email: agent, count: (element.email == agent) ? element.unfilled : 0
                            });
                            obj[element.date].yes.push({
                                email: agent, count: (element.email == agent) ? element.yes : 0
                            });
                            obj[element.date].no.push({
                                email: agent, count: (element.email == agent) ? element.no : 0
                            });
                        });
                        // Object.assign(dummyJSON, obj);
                    });
                    _this._analyticsService.updateChartSimple('column', true, [], dummyJSON);
                }
            }
        }, function (err) {
            // this._analyticsService.GetConversations([]);
            console.log('Error! Server unreachable.');
        });
    };
    AnalyticsAgentfcrComponent.prototype.ngOnInit = function () {
    };
    AnalyticsAgentfcrComponent.prototype.ngAfterViewInit = function () {
        this.chart = new Highcharts.Chart("highchart", this.options);
        this.rendered = true;
    };
    AnalyticsAgentfcrComponent.prototype.showTotal = function (indexExists, index) {
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
    AnalyticsAgentfcrComponent.prototype.showPercentage = function () {
        var count = 0;
        var unfilled = 0;
        this.options.series.forEach(function (element) {
            count += element.data.reduce(function (a, b) { return a + b; }, 0);
        });
        if (!this.selectedAgents.length) {
            this.options.series[0].data.forEach(function (element) {
                unfilled += element;
            });
        }
        else {
            this.options.series.forEach(function (s) {
                unfilled += s.data[0];
            });
        }
        // console.log(count);
        // console.log(unfilled);
        // console.log(this.options);
        if (count && unfilled) {
            return Math.round(((unfilled / count) * 100)) + '%';
        }
        else {
            return '0%';
        }
        // return '0%'
    };
    AnalyticsAgentfcrComponent.prototype.showSeriesCount = function (index) {
        var count = 0;
        this.options.series[index].data.forEach(function (element) {
            count += element;
        });
        return count;
    };
    AnalyticsAgentfcrComponent.prototype.Export = function () {
        console.log('Exporting...');
        // console.log(this.agentTableData);
        this._analyticsService.exportHTMLToExcel('agentExperience', 'ChatExperience-' + new Date().getTime());
    };
    AnalyticsAgentfcrComponent.prototype.getKeys = function (obj) {
        var keys = [];
        Object.keys(obj).map(function (k) {
            keys.push(k);
        });
        return keys;
    };
    AnalyticsAgentfcrComponent.prototype.getValueAgainstKey = function (obj, date, key, agent) {
        return obj[date][key].filter(function (a) { return a.email == agent; })[0].count;
    };
    AnalyticsAgentfcrComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
    };
    AnalyticsAgentfcrComponent = __decorate([
        core_1.Component({
            selector: 'app-analytics-agentfcr',
            templateUrl: './analytics-agentfcr.component.html',
            styleUrls: ['./analytics-agentfcr.component.css'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], AnalyticsAgentfcrComponent);
    return AnalyticsAgentfcrComponent;
}());
exports.AnalyticsAgentfcrComponent = AnalyticsAgentfcrComponent;
//# sourceMappingURL=analytics-agentfcr.component.js.map