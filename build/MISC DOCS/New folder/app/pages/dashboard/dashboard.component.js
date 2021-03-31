"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardComponent = void 0;
var core_1 = require("@angular/core");
var Highcharts = require("highcharts/highcharts");
// import * as Highmaps from 'highcharts/highmaps';
window['Highcharts'] = Highcharts;
// require('highcharts/modules/exporting')(Highmaps);
require('highcharts/modules/exporting')(Highcharts);
// require('highcharts/modules/no-data-to-display')(Highcharts);
require('highcharts/modules/drilldown')(Highcharts);
var AnalyticsService_1 = require("../../../services/AnalyticsService");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
//import { AgentSerivce } from '../../../services/AgentService'
var DashboardComponent = /** @class */ (function () {
    function DashboardComponent(_chatService, _visitorService, _authService, _ticketService, _agentService, _reportingService, _appStateService, _sanitizer) {
        var _this = this;
        this._chatService = _chatService;
        this._visitorService = _visitorService;
        this._authService = _authService;
        this._ticketService = _ticketService;
        this._agentService = _agentService;
        this._reportingService = _reportingService;
        this._appStateService = _appStateService;
        this._sanitizer = _sanitizer;
        //HighMaps
        this.highcharts = Highcharts;
        // highmaps = Highmaps;
        this.subscription = [];
        this.totalVisitors = 0;
        this.totalVisitors_original = 0;
        this.chattingVisitors = 0;
        this.queuedVisitors = 0;
        this.browsingVisitors = 0;
        this.invitedVisitors = 0;
        this.inactiveVisitors = 0;
        this.leftVisitors = 0;
        this.newVisitors = 0;
        this.returningVisitors = 0;
        this.newVisitorsArray = [
            { y: 23, color: '#029D9F' },
            { y: 56, color: '#99D8D8' },
            { y: 44, color: '#029D9F' },
            { y: 46, color: '#99D8D8' },
            { y: 32, color: '#029D9F' },
            { y: 60, color: '#99D8D8' },
            { y: 39, color: '#029D9F' },
            { y: 30, color: '#99D8D8' },
            { y: 48, color: '#029D9F' },
            { y: 52, color: '#99D8D8' },
        ];
        this.returningVisitorsArray = [
            { y: 23, color: '#666666' },
            { y: 56, color: '#afb6c4' },
            { y: 44, color: '#666666' },
            { y: 46, color: '#afb6c4' },
            { y: 32, color: '#666666' },
            { y: 60, color: '#afb6c4' },
            { y: 39, color: '#666666' },
            { y: 30, color: '#afb6c4' },
            { y: 48, color: '#666666' },
            { y: 52, color: '#afb6c4' },
        ];
        this.rendered = false;
        this.role = '';
        this.daysRemaining = 0;
        this.unlimited = false;
        // invitedVisitors = 0;
        // inactiveVisitors = 0;
        // leftVisitors = 0;
        this.solvedTicketsCount = 0;
        this.openTicketsCount = 0;
        this.pendingTicketsCount = 0;
        this.closedTicketsCount = 0;
        this.totalTicketsCount = 0;
        this.totalAgents = 0;
        this.onlineAgents = 0;
        this.offlineAgents = 0;
        this.idleAgents = 0;
        this.activeAgents = 0;
        //Loading Variables
        this.loadingVisitors = true;
        this.loadingTickets = true;
        this.loadingAgents = true;
        this.loadingCount = true;
        this.visitorList = [];
        this.visitorList_original = [];
        //graph data
        this.loader_topLinks = true;
        this.loader_visitorCount = true;
        this.loader_visitorByCountry = true;
        this.graph_totalVisitedLinks = 0;
        this.graph_averageSessionTime = 0;
        this.graph_totalVisitorCount = 0;
        this.visitorByCountry_data = [];
        this.visitorByCountryLegend_data = [];
        this.totalVisitorLinks_data = [];
        this.averageSessionTime_data = [];
        this.deviceInfoGraph_data = [];
        this.deviceInfoFilter = [];
        this.colorScheme = [];
        this.dateDropDown = [];
        this.graph_Referers = [];
        this.graph_totalReferers = 0;
        this.verified = false;
        this.sbt = false;
        this.isDrilledDown = false;
        this.browserDevicesTogle = 'browser';
        this.highchatsLoaded = new BehaviorSubject_1.BehaviorSubject(false);
        //options for os details / drilldown
        this.options_browser = {
            chart: {
                type: 'column',
                events: {
                    load: function (e) {
                        e.target.showLoading();
                    },
                    drilldown: function (e) {
                        _this.isDrilledDown = true;
                        if (!e.seriesOptions) {
                            var chart = e.target;
                            chart.addSeriesAsDrilldown(e.point, _this.os_details_drilldown.filter(function (v) { return v.name == e.point.name; })[0]);
                        }
                    },
                    drillup: function () {
                        _this.isDrilledDown = false;
                    }
                }
            },
            plotOptions: {
                series: {
                    borderWidth: 0,
                    dataLabels: {
                        enabled: true,
                        style: {
                            fontWeight: 'medium'
                        }
                    }
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b> <br/>'
            },
            credits: {
                enabled: false
            },
            xAxis: {
                type: 'category'
            },
            yAxis: {
                title: {
                    text: ''
                }
            },
            legend: {
                enabled: false
            },
            title: {
                text: 'Browser Details'
            },
            subtitle: {
                text: 'Click the columns to view versions.'
            },
            series: [{
                    name: 'Browsers',
                    colorByPoint: true,
                    data: []
                }],
            drilldown: {
                activeAxisLabelStyle: {
                    color: '#003399',
                    cursor: 'pointer',
                    fontWeight: 'medium',
                    textDecoration: 'none'
                },
                activeDataLabelStyle: {
                    color: '#003399',
                    cursor: 'pointer',
                    fontWeight: 'medium',
                    textDecoration: 'none'
                }
            }
        };
        // //options for visitor graph
        this.options_visitor = {
            chart: {
                type: 'pie',
                events: {
                    load: function (e) {
                        e.target.showLoading();
                    }
                }
            },
            colors: [
                "#AD296B",
                "#DB2A6A",
                "#EB4F73",
                "#EF8563",
                "#EF8600",
            ],
            exporting: {
                enabled: false
            },
            title: {
                text: ''
            },
            credits: {
                enabled: false
            },
            legend: {
                enabled: false
            },
            xAxis: {
                categories: ['Browsing', 'Queued', 'Chatting', 'Invited', 'Inactive']
            },
            yAxis: {
                title: {
                    text: ''
                }
            },
            series: [{
                    name: 'Count',
                    data: [['Browsing', 0], ['Queued', 0], ['Chatting', 0], ['Invited', 0], ['Inactive', 0]],
                    dataLabels: {
                        enabled: false
                    },
                    innerSize: '80%'
                }]
        };
        this.options_newvisitors = {
            chart: {
                type: 'column',
            },
            exporting: {
                enabled: false
            },
            plotOptions: {
                column: {
                    pointPadding: -0.25
                }
            },
            title: {
                text: ''
            },
            subtitle: {
                text: ''
            },
            xAxis: {
                categories: [
                    'new'
                ],
                visible: false
            },
            colors: [
                "#029D9F",
                "#99D8D8",
            ],
            yAxis: {
                title: {
                    text: ''
                },
                visible: false
            },
            legend: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            tooltip: {
                enabled: false
            },
            series: [{
                    data: [
                        { y: 23, color: '#029D9F' },
                        { y: 56, color: '#99D8D8' },
                        { y: 44, color: '#029D9F' },
                        { y: 46, color: '#99D8D8' },
                        { y: 32, color: '#029D9F' },
                        { y: 60, color: '#99D8D8' },
                        { y: 39, color: '#029D9F' },
                        { y: 30, color: '#99D8D8' },
                        { y: 48, color: '#029D9F' },
                        { y: 52, color: '#99D8D8' },
                    ]
                }]
        };
        this.options_returningvisitors = {
            chart: {
                type: 'column',
            },
            exporting: {
                enabled: false
            },
            plotOptions: {
                column: {
                    pointPadding: -0.25
                }
            },
            title: {
                text: ''
            },
            subtitle: {
                text: ''
            },
            xAxis: {
                categories: [
                    'returning'
                ],
                visible: false
            },
            colors: [
                "#afb6c4",
                "#666666",
            ],
            yAxis: {
                title: {
                    text: ''
                },
                visible: false
            },
            legend: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            tooltip: {
                enabled: false
            },
            series: [{
                    data: [
                        { y: 23, color: '#666666' },
                        { y: 56, color: '#afb6c4' },
                        { y: 44, color: '#666666' },
                        { y: 46, color: '#afb6c4' },
                        { y: 32, color: '#666666' },
                        { y: 60, color: '#afb6c4' },
                        { y: 39, color: '#666666' },
                        { y: 30, color: '#afb6c4' },
                        { y: 48, color: '#666666' },
                        { y: 52, color: '#afb6c4' },
                    ]
                }]
        };
        //options for ticket graph
        this.options_tickets = {
            chart: {
                type: 'pie',
                events: {
                    load: function (e) {
                        e.target.showLoading();
                    }
                }
            },
            exporting: {
                enabled: false
            },
            colors: [
                "#006EAD",
                "#2491cc",
                "#00bfac",
                "#51d691"
            ],
            title: {
                text: ''
            },
            credits: {
                enabled: false
            },
            legend: {
                enabled: false
            },
            xAxis: {
                categories: ['Open', 'Pending', 'Solved', 'Closed']
            },
            yAxis: {
                title: {
                    text: ''
                }
            },
            series: [{
                    name: 'Count',
                    data: [['Open', 0], ['Pending', 0], ['Solved', 0], ['Closed', 0]],
                    dataLabels: {
                        enabled: false
                    },
                    innerSize: '80%'
                }]
        };
        //options for agents graph
        this.options_agents = {
            chart: {
                type: 'pie',
                events: {
                    load: function (e) {
                        e.target.showLoading();
                    }
                }
            },
            exporting: {
                enabled: false
            },
            colors: [
                "#F38D1C",
                "#F2A920",
                "#ECC71B",
                "#E8DC15"
            ],
            title: {
                text: ''
            },
            credits: {
                enabled: false
            },
            legend: {
                enabled: false
            },
            xAxis: {
                categories: ['Offline', 'Online', 'Idle', 'Active']
            },
            yAxis: {
                title: {
                    text: ''
                }
            },
            series: [{
                    name: 'Count',
                    data: [['Offline', 0], ['Online', 0], ['Idle', 0], ['Active', 0]],
                    dataLabels: {
                        enabled: false
                    },
                    innerSize: '80%'
                }]
        };
        //Highmaps Data
        this.os_details_data = [];
        this.os_details_drilldown = [];
        //browsers
        this.browsers = [
            { name: 'chrome', key: 'chrome-colored' },
            { name: 'uc', key: 'uc-colored' },
            { name: 'firefox', key: 'firefox-colored' },
            { name: 'maxthon', key: 'maxthon-colored' },
            { name: 'explorer', key: 'explorer-colored' },
            { name: 'opera', key: 'opera-colored' },
            { name: 'safari', key: 'safari-colored' },
            { name: 'edge', key: 'edge-colored' },
            { name: 'other', key: 'browser-colored' }
        ];
        this.browser_data = [];
        //Devices
        this.devices = [
            { name: 'windows', key: 'windows-colored' },
            { name: 'apple', key: 'apple-colored' },
            { name: 'android', key: 'android-colored' }
        ];
        this.device_data = [];
        //Inactive states
        this.inactive_states = {
            'browsing': {
                'active': 0,
                'inactive': 0
            },
            'queued': {
                'active': 0,
                'inactive': 0
            },
            'chatting': {
                'active': 0,
                'inactive': 0
            },
            'invited': {
                'active': 0,
                'inactive': 0
            },
            'inactive': {
                'active': 0,
                'inactive': 0
            },
            'left': {
                'active': 0,
                'inactive': 0
            }
        };
        //Filters
        this.filterType = 'all';
        this.package = undefined;
        this.totalVisitorLinks_data = [];
        this.subscription.push(this._authService.getPackageInfo().subscribe(function (pkg) {
            // console.log(data);
            if (pkg) {
                _this.package = pkg.dashboard;
                if (!_this.package.realtime) {
                    _this._appStateService.NavigateTo('/noaccess');
                }
            }
        }));
        this.subscription.push(_authService.getAgent().subscribe(function (data) {
            _this.agent = data;
            _this.role = data.role;
        }));
        this.subscription.push(_authService.SBT.subscribe(function (data) {
            _this.sbt = data;
        }));
        this.subscription.push(this._authService.getSettings().subscribe(function (settings) {
            if (settings && Object.keys(settings).length) {
                _this.verified = settings.verified;
                (settings.expiry && settings.expiry != 'unlimited') ? _this.daysRemaining = Math.floor((Date.parse(new Date(settings.expiry).toISOString()) - Date.parse(new Date().toISOString())) / 1000 / 60 / 60 / 24) : _this.unlimited = true;
            }
            //console.log(data);
        }));
        this.subscription.push(_ticketService.getTicketsCount().subscribe(function (ticketsList) {
            // console.log('Gettings Tickets');
            console.log(ticketsList);
            _this.solvedTicketsCount = 0;
            _this.openTicketsCount = 0;
            _this.pendingTicketsCount = 0;
            _this.closedTicketsCount = 0;
            ticketsList.map(function (ticket) {
                if (ticket.state == "OPEN")
                    _this.openTicketsCount = ticket.count;
                else if (ticket.state == "PENDING")
                    _this.pendingTicketsCount = ticket.count;
                else if (ticket.state == "SOLVED")
                    _this.solvedTicketsCount = ticket.count;
                else if (ticket.state == "CLOSED")
                    _this.closedTicketsCount = ticket.count;
            });
            _this.totalTicketsCount = _this.solvedTicketsCount + _this.openTicketsCount + _this.pendingTicketsCount + _this.closedTicketsCount;
            if (_this.totalTicketsCount && _this.verified && _this.highchatsLoaded.getValue()) {
                _this.updateTicketsGraphData();
            }
        }));
        this.subscription.push(this.highchatsLoaded.subscribe(function (value) {
            if (value)
                _this.InitializeGraphData();
        }));
        this.subscription.push(_visitorService.GetVisitorsList().debounceTime(500).subscribe(function (visitors) {
            // console.log('Getting Visitors');
            _this.visitorList_original = visitors;
            _this.totalVisitors_original = visitors.length;
            // if(this.visitorList_original.length && this.verified){
            // 	this.updateVisitorByCountryData(this.visitorList_original);
            // }
            if (_this.filterType == 'all') {
                _this.visitorList = visitors;
                _this.totalVisitors = visitors.length;
            }
            else {
                _this.visitorList = visitors.filter(function (v) { return v.fullCountryName == _this.filterType; });
                _this.totalVisitors = _this.visitorList.length;
            }
            // console.log(this.totalVisitors);
            _this.browsingVisitors = 0;
            _this.queuedVisitors = 0;
            _this.chattingVisitors = 0;
            _this.invitedVisitors = 0;
            _this.inactiveVisitors = 0;
            _this.newVisitors = 0;
            _this.returningVisitors = 0;
            _this.inactive_states = {
                'browsing': {
                    'active': 0,
                    'inactive': 0
                },
                'queued': {
                    'active': 0,
                    'inactive': 0
                },
                'chatting': {
                    'active': 0,
                    'inactive': 0
                },
                'invited': {
                    'active': 0,
                    'inactive': 0
                },
                'inactive': {
                    'active': 0,
                    'inactive': 0
                },
                'left': {
                    'active': 0,
                    'inactive': 0
                }
            };
            _this.visitorList.map(function (visitor) {
                if (visitor.inactive)
                    _this.inactiveVisitors += 1;
                if (visitor.state == 1 && !visitor.inactive) {
                    _this.browsingVisitors += 1;
                    // if(visitor.inactive) this.inactive_states['browsing'].inactive += 1;
                    // this.inactive_states['browsing'].active = this.browsingVisitors - this.inactive_states['browsing'].inactive;
                }
                else if (visitor.state == 2 && !visitor.inactive) {
                    _this.queuedVisitors += 1;
                    // if(visitor.inactive) this.inactive_states['queued'].inactive += 1;
                    // this.inactive_states['queued'].active = this.queuedVisitors - this.inactive_states['queued'].inactive;
                }
                else if (visitor.state == 3 && !visitor.inactive) {
                    _this.chattingVisitors += 1;
                    // if(visitor.inactive) this.inactive_states['chatting'].inactive += 1;
                    // this.inactive_states['chatting'].active = this.chattingVisitors - this.inactive_states['chatting'].inactive;
                }
                else if ((visitor.state == 4 || visitor.state == 5) && !visitor.inactive) {
                    _this.invitedVisitors += 1;
                    // if(visitor.inactive) this.inactive_states['invited'].inactive += 1;
                    // this.inactive_states['invited'].active = this.invitedVisitors - this.inactive_states['invited'].inactive;
                }
                if (visitor.newUser) {
                    _this.newVisitors += 1;
                }
                else {
                    _this.returningVisitors += 1;
                }
            });
            if (_this.visitorList.length && _this.verified) {
                if (_this.highchatsLoaded.getValue()) {
                    _this.updateNewAndReturningVisitors();
                    _this.updateVisitorsGraphData();
                    // console.log(this.inactive_states);
                }
                _this.updateDeviceInfoGraphByBrowser(_this.visitorList);
                _this.updateDeviceInfoGraphByOS(_this.visitorList);
                _this.updateTopVisitedLinksData(_this.visitorList);
                _this.updateTopReferers(_this.visitorList.filter(function (v) { return v.referrer; }));
            }
        }));
        this.subscription.push(_agentService.agentCounts.subscribe(function (agentCounts) {
            // console.log('Getting Agents');
            if (agentCounts) {
                // console.log(agentCounts);
                _this.totalAgents = agentCounts.total;
                _this.onlineAgents = agentCounts.agents.length;
                _this.offlineAgents = (agentCounts.total - agentCounts.agents.length);
                _this.idleAgents = agentCounts.agents.filter(function (a) { return a.state == 'idle'; }).length;
                _this.activeAgents = agentCounts.agents.filter(function (a) { return a.state == 'active'; }).length;
                if (_this.totalAgents && _this.verified && _this.role != 'agent' && _this.highchatsLoaded.getValue()) {
                    _this.updateAgentsGraphData();
                }
            }
        }));
        //Loading Variables Coresponding to their Services
        //All the Initial Dashboard Content is HOT LOADED
        this.subscription.push(_visitorService.getLoadingVisitors().subscribe(function (data) {
            _this.loadingVisitors = data;
            // console.log('Loading visitors: '+data);
        }));
        this.subscription.push(_ticketService.GetLoadingCount().subscribe(function (data) {
            _this.loadingTickets = data;
        }));
        this.subscription.push(_agentService.getLoadingVariable().subscribe(function (data) {
            _this.loadingAgents = data;
        }));
        // this.subscription.push(_ticketService.getloadingTickets("TICKETS").subscribe(data => {
        //     this.loadingTickets = data;
        // }));
    }
    DashboardComponent.prototype.ngOnInit = function () {
    };
    DashboardComponent.prototype.ngAfterViewInit = function () {
        if (this.verified) {
            // this.chart_browser = new Highcharts.Chart("browser_details", this.options_browser);
            this.chart_visitors = new Highcharts.Chart("visitor_details", this.options_visitor);
            if (this.role != 'agent') {
                this.chart_agents = new Highcharts.Chart("agent_details", this.options_agents);
            }
            this.chart_tickets = new Highcharts.Chart("ticket_details", this.options_tickets);
            this.chart_newvisitors = new Highcharts.Chart("newvisitors", this.options_newvisitors);
            this.chart_returningvisitors = new Highcharts.Chart("returningvisitors", this.options_returningvisitors);
            this.highchatsLoaded.next(true);
        }
    };
    DashboardComponent.prototype.ngOnDestroy = function () {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        clearInterval(this.interval_country);
        this.subscription.forEach(function (subscription) {
            subscription.unsubscribe();
        });
        if (this.verified && this.highchatsLoaded.getValue()) {
            // this.chart_country.destroy();
            // this.chart_browser.destroy();
            this.chart_visitors.destroy();
            (this.role != 'agent' && this.chart_agents.destroy());
            this.chart_tickets.destroy();
            this.chart_newvisitors.destroy();
            this.chart_returningvisitors.destroy();
        }
    };
    DashboardComponent.prototype.InitializeGraphData = function () {
        if (this.visitorList.length) {
            this.updateNewAndReturningVisitors();
            this.updateVisitorsGraphData();
        }
        if (this.totalAgents && this.role != 'agent') {
            this.updateAgentsGraphData();
        }
        if (this.totalTicketsCount) {
            this.updateTicketsGraphData();
        }
    };
    //REALTIME TRANSFORMATION OF DATA
    DashboardComponent.prototype.updateTicketsGraphData = function () {
        var _this = this;
        if (this.totalTicketsCount) {
            if (this.chart_tickets) {
                this.chart_tickets.hideLoading();
                this.chart_tickets.series[0].setData([['Open', this.openTicketsCount], ['Pending', this.pendingTicketsCount], ['Solved', this.solvedTicketsCount], ['Closed', this.closedTicketsCount]]);
            }
            else {
                setTimeout(function () {
                    _this.chart_tickets.hideLoading();
                    _this.chart_tickets.series[0].setData([['Open', _this.openTicketsCount], ['Pending', _this.pendingTicketsCount], ['Solved', _this.solvedTicketsCount], ['Closed', _this.closedTicketsCount]]);
                }, 0);
            }
        }
    };
    DashboardComponent.prototype.updateAgentsGraphData = function () {
        var _this = this;
        if (this.totalAgents) {
            if (this.chart_agents) {
                this.chart_agents.hideLoading();
                this.chart_agents.series[0].setData([['Offline', this.offlineAgents], ['Online', this.onlineAgents], ['Idle', this.idleAgents], ['Active', this.activeAgents]]);
            }
            else {
                setTimeout(function () {
                    _this.chart_agents.hideLoading();
                    _this.chart_agents.series[0].setData([['Offline', _this.offlineAgents], ['Online', _this.onlineAgents], ['Idle', _this.idleAgents], ['Active', _this.activeAgents]]);
                }, 0);
            }
        }
    };
    DashboardComponent.prototype.updateVisitorsGraphData = function () {
        var _this = this;
        if (this.totalVisitors) {
            if (this.chart_visitors) {
                this.chart_visitors.hideLoading();
                this.chart_visitors.series[0].setData([["Browsing", this.browsingVisitors], ["Queued", this.queuedVisitors], ["Chatting", this.chattingVisitors], ["Invited", this.invitedVisitors], ["Inactive", this.inactiveVisitors]]);
            }
            else {
                setTimeout(function () {
                    _this.chart_visitors.hideLoading();
                    _this.chart_visitors.series[0].setData([["Browsing", _this.browsingVisitors], ["Queued", _this.queuedVisitors], ["Chatting", _this.chattingVisitors], ["Invited", _this.invitedVisitors], ["Inactive", _this.inactiveVisitors]]);
                }, 0);
            }
        }
    };
    DashboardComponent.prototype.updateNewAndReturningVisitors = function () {
        var _this = this;
        if (this.newVisitorsArray.length == 10) {
            this.newVisitorsArray.shift();
        }
        this.newVisitorsArray.push({
            y: this.newVisitors,
            color: (this.newVisitorsArray[this.newVisitorsArray.length - 1].color == '#029D9F') ? '#99D8D8' : '#029D9F'
        });
        if (this.returningVisitorsArray.length == 10) {
            this.returningVisitorsArray.shift();
        }
        this.returningVisitorsArray.push({
            y: this.returningVisitors,
            color: (this.returningVisitorsArray[this.returningVisitorsArray.length - 1].color == '#666666') ? '#afb6c4' : '#666666'
        });
        if (this.chart_newvisitors) {
            this.chart_newvisitors.hideLoading();
            this.chart_newvisitors.series[0].setData(this.newVisitorsArray);
        }
        else {
            setTimeout(function () {
                _this.chart_newvisitors.hideLoading();
                _this.chart_newvisitors.series[0].setData(_this.newVisitorsArray);
            }, 0);
        }
        if (this.chart_returningvisitors) {
            this.chart_returningvisitors.hideLoading();
            this.chart_returningvisitors.series[0].setData(this.returningVisitorsArray);
        }
        else {
            setTimeout(function () {
                _this.chart_returningvisitors.hideLoading();
                _this.chart_returningvisitors.series[0].setData(_this.returningVisitorsArray);
            }, 0);
        }
        // console.log(this.newVisitorsArray);
        // console.log(this.returningVisitorsArray);
    };
    DashboardComponent.prototype.BrowserDevicesToggle = function (value) {
        this.browserDevicesTogle = value;
    };
    DashboardComponent.prototype.updateTopVisitedLinksData = function (visitorList) {
        var _this = this;
        var urls = [];
        var topVisitedURLS = [];
        this.graph_totalVisitedLinks = 0;
        visitorList.forEach(function (element) {
            // pageViews += element.url.length;
            urls.push({
                "url": element.url[0]
            });
        });
        // console.log(urls);
        this.groupBy(urls, function (k) { return k.url; }).forEach(function (element, key) {
            // this.graph_totalVisitedLinks += element.length
            topVisitedURLS.push({
                "name": key,
                "value": element.length
            });
        });
        topVisitedURLS = topVisitedURLS.sort(function (a, b) {
            return (a.value > b.value) ? -1 : 1;
        }).slice(0, 10);
        topVisitedURLS.forEach(function (url) {
            // url.countries = [];
            // let filtered = visitorList.filter(v => v.url.includes(url.name));
            // this.groupBy(filtered, v => v.country).forEach((element, key) => {
            // 	url.countries.push(key)
            // });
            _this.graph_totalVisitedLinks += url.value;
        });
        this.totalVisitorLinks_data = topVisitedURLS;
        // console.log(this.graph_totalVisitedLinks);
    };
    DashboardComponent.prototype.updateTopReferers = function (visitorList) {
        var _this = this;
        var urls = [];
        var referers = [];
        this.graph_totalReferers = 0;
        visitorList.forEach(function (element) {
            // pageViews += element.url.length;
            urls.push({
                "url": element.referrer
            });
        });
        // console.log(urls);
        this.groupBy(urls, function (k) { return k.url; }).forEach(function (element, key) {
            // this.graph_totalVisitedLinks += element.length
            referers.push({
                "name": key,
                "value": element.length
            });
        });
        referers = referers.sort(function (a, b) {
            return (a.value > b.value) ? -1 : 1;
        }).slice(0, 10);
        referers.forEach(function (url) {
            // url.countries = [];
            // visitorList.forEach(element => {
            // 	if(element.referrer == url.name){
            // 		if(!url.countries.filter(c => c == element.country).length){
            // 			url.countries.push(element.country)
            // 		}
            // 	}
            // });
            // this.groupBy(filtered, v => v.country).forEach((element, key) => {
            // 	url.countries.push(key)
            // });
            _this.graph_totalReferers += url.value;
        });
        // console.log(referers);
        this.graph_Referers = referers;
    };
    DashboardComponent.prototype.sanitizedURL = function (value) {
        return this._sanitizer.bypassSecurityTrustUrl(value);
    };
    DashboardComponent.prototype.updateDeviceInfoGraphByBrowser = function (visitorList) {
        var _this = this;
        this.browser_data = [];
        // console.log(visitorList);
        var browser_data = [];
        // let byOS = [];
        var fitered = visitorList.filter(function (v) { return v.deviceInfo && v.deviceInfo.os && v.deviceInfo.os != 'undefined' && v.deviceInfo.os != 'null'; });
        var other = visitorList.filter(function (v) { return !v.deviceInfo || !v.deviceInfo.os || v.deviceInfo.os == 'undefined' || v.deviceInfo.os == 'null'; });
        if (other.length) {
            // byOS.push({
            // 	"name": "Other",
            // 	"y": other.length,
            // 	"drilldown": null
            // });
            browser_data.push({
                'key': 'browser-colored',
                'name': 'other',
                'count': other.length
            });
        }
        this.groupBy(fitered, function (v) { return v.deviceInfo.os; }).forEach(function (element, key) {
            if (browser_data.filter(function (b) { return key.toLowerCase().includes(b.key.toLowerCase()) || b.key.toLowerCase().includes(key.toLowerCase()); }).length && browser_data.length) {
                browser_data.filter(function (b) { return key.toLowerCase().includes(b.key.toLowerCase()) || b.key.toLowerCase().includes(key.toLowerCase()); })[0].count += element.length;
            }
            else {
                if (_this.browsers.filter(function (b) { return key.toLowerCase().includes(b.key) || b.key.toLowerCase().includes(key.toLowerCase()); }).length) {
                    browser_data.push({
                        'key': _this.browsers.filter(function (b) { return key.toLowerCase().includes(b.key) || b.key.toLowerCase().includes(key.toLowerCase()); })[0].key,
                        'name': _this.browsers.filter(function (b) { return key.toLowerCase().includes(b.key) || b.key.toLowerCase().includes(key.toLowerCase()); })[0].name,
                        'count': element.length
                    });
                }
                else {
                    if (browser_data.filter(function (b) { return b.name == 'other'; }).length) {
                        browser_data.filter(function (b) { return b.name == 'other'; })[0].count += element.length;
                    }
                    else {
                        browser_data.push({
                            'key': 'browser-colored',
                            'name': 'other',
                            'count': element.length
                        });
                    }
                }
            }
        });
        browser_data.sort(function (a, b) {
            return (a.count < b.count) ? 1 : -1;
        });
        this.browser_data = browser_data;
    };
    DashboardComponent.prototype.updateDeviceInfoGraphByOS = function (visitorList) {
        var _this = this;
        this.device_data = [];
        var device_data = [];
        var fitered = visitorList.filter(function (v) { return v.deviceInfo.name && v.deviceInfo.name != 'undefined'; });
        var other = visitorList.filter(function (v) { return !v.deviceInfo.name || v.deviceInfo.name == 'undefined'; });
        if (other.length) {
            device_data.push({
                'key': 'browser-colored',
                'name': 'other',
                'count': other.length
            });
        }
        this.groupBy(fitered, function (v) { return v.deviceInfo.name; }).forEach(function (element, key) {
            if (device_data.filter(function (b) { return key.toLowerCase().includes(b.key.toLowerCase()) || b.key.toLowerCase().includes(key.toLowerCase()); }).length && device_data.length) {
                device_data.filter(function (b) { return key.toLowerCase().includes(b.key.toLowerCase()) || b.key.toLowerCase().includes(key.toLowerCase()); })[0].count += element.length;
                // browser_data.filter(b => b.key.toLowerCase().includes(key.toLowerCase()))[0].count += element.length;
            }
            else {
                if (_this.devices.filter(function (b) { return key.toLowerCase().includes(b.key) || b.key.toLowerCase().includes(key.toLowerCase()); }).length) {
                    device_data.push({
                        'key': _this.devices.filter(function (b) { return key.toLowerCase().includes(b.key) || b.key.toLowerCase().includes(key.toLowerCase()); })[0].key,
                        'name': _this.devices.filter(function (b) { return key.toLowerCase().includes(b.key) || b.key.toLowerCase().includes(key.toLowerCase()); })[0].name,
                        'count': element.length
                    });
                }
                else {
                    if (device_data.filter(function (b) { return b.name == 'other'; }).length) {
                        device_data.filter(function (b) { return b.name == 'other'; })[0].count += element.length;
                    }
                    else {
                        device_data.push({
                            'key': 'browser-colored',
                            'name': 'other',
                            'count': element.length
                        });
                    }
                }
            }
        });
        device_data.sort(function (a, b) {
            return (a.count < b.count) ? 1 : -1;
        });
        this.device_data = device_data;
        // console.log(this.device_data);
    };
    DashboardComponent.prototype.applyCountryFilter = function (filter_type) {
        var _this = this;
        this.filterType = filter_type;
        switch (filter_type) {
            case 'all':
                this.visitorList = this.visitorList_original;
                break;
            default:
                this.visitorList = this.visitorList.filter(function (v) { return v.fullCountryName == filter_type; });
                break;
        }
        console.log(this.visitorList);
        this.browsingVisitors = 0;
        this.queuedVisitors = 0;
        this.chattingVisitors = 0;
        this.invitedVisitors = 0;
        this.inactiveVisitors = 0;
        this.newVisitors = 0;
        this.returningVisitors = 0;
        this.inactive_states = {
            'browsing': {
                'active': 0,
                'inactive': 0
            },
            'queued': {
                'active': 0,
                'inactive': 0
            },
            'chatting': {
                'active': 0,
                'inactive': 0
            },
            'invited': {
                'active': 0,
                'inactive': 0
            },
            'inactive': {
                'active': 0,
                'inactive': 0
            },
            'left': {
                'active': 0,
                'inactive': 0
            }
        };
        this.visitorList.map(function (visitor) {
            if (visitor.inactive)
                _this.inactiveVisitors += 1;
            if (visitor.state == 1 && !visitor.inactive) {
                _this.browsingVisitors += 1;
                // if(visitor.inactive) this.inactive_states['browsing'].inactive += 1;
                // this.inactive_states['browsing'].active = this.browsingVisitors - this.inactive_states['browsing'].inactive;
            }
            else if (visitor.state == 2 && !visitor.inactive) {
                _this.queuedVisitors += 1;
                // if(visitor.inactive) this.inactive_states['queued'].inactive += 1;
                // this.inactive_states['queued'].active = this.queuedVisitors - this.inactive_states['queued'].inactive;
            }
            else if (visitor.state == 3 && !visitor.inactive) {
                _this.chattingVisitors += 1;
                // if(visitor.inactive) this.inactive_states['chatting'].inactive += 1;
                // this.inactive_states['chatting'].active = this.chattingVisitors - this.inactive_states['chatting'].inactive;
            }
            else if (visitor.state == 4 && !visitor.inactive) {
                _this.invitedVisitors += 1;
                // if(visitor.inactive) this.inactive_states['invited'].inactive += 1;
                // this.inactive_states['invited'].active = this.invitedVisitors - this.inactive_states['invited'].inactive;
            }
            if (visitor.newUser) {
                _this.newVisitors += 1;
            }
            else {
                _this.returningVisitors += 1;
            }
        });
        if (this.highchatsLoaded.getValue()) {
            this.updateNewAndReturningVisitors();
            this.updateVisitorsGraphData();
            // console.log(this.inactive_states);
        }
        this.updateDeviceInfoGraphByBrowser(this.visitorList);
        this.updateDeviceInfoGraphByOS(this.visitorList);
        // this.updateVisitorByCountryData(this.visitorList);
        this.updateTopVisitedLinksData(this.visitorList);
        this.updateTopReferers(this.visitorList.filter(function (v) { return v.referrer; }));
    };
    //GRAPH EVENT HANDLERS
    //HELPERS
    DashboardComponent.prototype.groupBy = function (list, keyGetter) {
        var map = new Map();
        list.forEach(function (item) {
            var key = keyGetter(item);
            var collection = map.get(key);
            if (!collection) {
                map.set(key, [item]);
            }
            else {
                collection.push(item);
            }
        });
        return map;
    };
    DashboardComponent.prototype.extractHostname = function (url) {
        var urlParts = url.toString().replace('http://', '').replace('https://', '').replace('www.', '').split(/[/?#]/);
        var domain = '';
        if (urlParts[0].split('.').length) {
            domain = urlParts[0].split('.')[0];
        }
        else {
            domain = urlParts[0];
        }
        return domain.charAt(0).toUpperCase() + domain.slice(1);
        ;
    };
    //HELPERS
    DashboardComponent.prototype.FormatURL = function (url) {
        try {
            // console.log(url);
            return (new URL(url).protocol + '//' + new URL(url).hostname);
        }
        catch (e) {
            return url;
        }
    };
    DashboardComponent = __decorate([
        core_1.Component({
            selector: 'app-dashboard',
            templateUrl: './dashboard.component.html',
            styleUrls: ['./dashboard.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None,
            providers: [
                AnalyticsService_1.AnalyticsService
            ]
        })
    ], DashboardComponent);
    return DashboardComponent;
}());
exports.DashboardComponent = DashboardComponent;
//# sourceMappingURL=dashboard.component.js.map