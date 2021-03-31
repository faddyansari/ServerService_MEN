"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsTicketcustomdashboardComponent = void 0;
var core_1 = require("@angular/core");
var Highcharts = require("highcharts");
require('highcharts/modules/exporting')(Highcharts);
require('highcharts/highcharts-more')(Highcharts);
var AnalyticsTicketcustomdashboardComponent = /** @class */ (function () {
    function AnalyticsTicketcustomdashboardComponent(_stateService, _analyticsService, _authService) {
        var _this = this;
        this._stateService = _stateService;
        this._analyticsService = _analyticsService;
        this._authService = _authService;
        this.subscriptions = [];
        this.loading = false;
        this.highcharts = Highcharts;
        this.options = {
            chart: {
                // type: 'column',
                backgroundColor: '#f5f6f8'
            },
            title: {
                text: 'Inquiries'
            },
            tooltip: {
                animation: false,
                useHTML: true,
                shadow: false,
                shared: true
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
        this.data = [];
        this.customFields = [];
        this.subscriptions.push(_authService.getAgent().subscribe(function (agent) {
            if (agent)
                _this.agent = agent;
        }));
        this.subscriptions.push(_analyticsService.options.subscribe(function (data) {
            if (_this.rendered) {
                if (data.title.text) {
                    _this.options.title.text = 'Inquiries (' + data.title.text + ')';
                }
                else {
                    _this.options.title.text = 'Inquiries';
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
    AnalyticsTicketcustomdashboardComponent.prototype.ngOnInit = function () {
        if (this.agent && (this.agent.nsp == '/sbtjapaninquiries.com' || this.agent.nsp == '/localhost.com')) {
            // console.log('NSP: ' + this.agent.nsp + ' allowed');
        }
        else {
            // console.log('NSP: ' + this.agent.nsp + ' not allowed');
            this._stateService.NavigateForce('/analytics/analytics-tickets/totaltickets');
        }
    };
    AnalyticsTicketcustomdashboardComponent.prototype.ngAfterViewInit = function () {
        this.chart = new Highcharts.Chart("highchart", this.options);
        this.rendered = true;
    };
    AnalyticsTicketcustomdashboardComponent.prototype.onFilterResult = function (event) {
        var _this = this;
        // console.log(event);
        if (this.agent.nsp == '/sbtjapaninquiries.com' || this.agent.nsp == '/localhost.com') {
            this.loading = true;
            var packet = {
                "obj": {
                    "nsp": this.agent.nsp,
                    "group": event.selectedGroups,
                    "from": new Date(event.selectedDate.from).toISOString(),
                    "to": this._analyticsService.AddDays(new Date(event.selectedDate.to), 1).toISOString(),
                    "timezone": this._analyticsService.timeZone,
                    "fetchAll": event.fetchAllData,
                    "customFields": event.dynamicFields
                }
            };
            this.customFields = event.dynamicFields;
            console.log(packet);
            this._analyticsService.GetTicketDashboardData(packet).subscribe(function (response) {
                // console.log(response['Inquiries:']);		
                if (response['Inquiries'] && !event.dynamicFields.length) {
                    _this.data = response['Inquiries'];
                    var categories = _this.data.map(function (d) { return d._id; });
                    var series = [
                        { name: 'total', type: 'column', data: _this.data.map(function (d) { return d.total; }) }
                    ];
                    var total_1 = 0;
                    _this.data.map(function (d) {
                        total_1 += d.total;
                    });
                    _this._analyticsService.updateChartSimple('column', false, categories, series, total_1);
                    var spider_categories_1 = [];
                    if (_this.data.length) {
                        Object.keys(_this.data[0]).map(function (key) {
                            if (key != '_id' && key != 'total' && key != 'untagged')
                                spider_categories_1.push(key);
                        });
                    }
                    _this.data.forEach(function (d) {
                        var spiderwebOpt = {
                            chart: {
                                polar: true,
                                type: 'line'
                            },
                            accessibility: {
                                description: ''
                            },
                            exporting: {
                                enabled: false
                            },
                            credits: {
                                enabled: false
                            },
                            title: {
                                text: 'Inquiry'
                            },
                            pane: {
                                size: '80%'
                            },
                            xAxis: {
                                categories: [],
                                tickmarkPlacement: 'on',
                                lineWidth: 0
                            },
                            yAxis: {
                                gridLineInterpolation: 'polygon',
                                lineWidth: 0,
                                min: 0
                            },
                            tooltip: {
                                shared: true
                            },
                            legend: {
                                enabled: false
                            },
                            series: [],
                            responsive: {
                                rules: [{
                                        condition: {
                                            maxWidth: 500
                                        },
                                        chartOptions: {
                                            legend: {
                                                align: 'center',
                                                verticalAlign: 'bottom',
                                                layout: 'horizontal'
                                            },
                                            pane: {
                                                size: '70%'
                                            }
                                        }
                                    }]
                            }
                        };
                        spiderwebOpt.xAxis.categories = spider_categories_1;
                        spiderwebOpt.title.text = d._id + '(' + d.total + ')';
                        var series = [{
                                name: 'count',
                                data: [d.weekdays, d.weekends, d.assigned, d.unassigned, d.tagged, d.free, d.complete, d["in-complete"]],
                                pointPlacement: 'on'
                            }];
                        spiderwebOpt.series = series;
                        setTimeout(function () {
                            new Highcharts.Chart("spiderweb-" + d._id, spiderwebOpt);
                        }, 1000);
                    });
                }
                else if (response['Inquiries'] && event.dynamicFields.length) {
                    _this.data = response['Inquiries'];
                    if (_this.data.length) {
                        var categories_1 = _this.data[0].data.map(function (d) { return d.name; });
                        var series_1 = [];
                        _this.data.forEach(function (element) {
                            var obj = {
                                name: element._id,
                                data: []
                            };
                            categories_1.forEach(function (category) {
                                obj.data.push(element.data.filter(function (d) { return d.name == category; })[0].count);
                            });
                            series_1.push(obj);
                        });
                        // let series = [
                        // 	{ name: 'total', type: 'column', data: this.data.map(d => d.total) }
                        // ];
                        // let total = 0;
                        // this.data.map(d => {
                        // 	total += d.total;
                        // });
                        _this._analyticsService.updateChartSimple('line', true, categories_1, series_1);
                    }
                }
                _this.loading = false;
            }, function (err) {
                _this.loading = false;
            });
        }
        // setTimeout(() => {
        // 	console.log(packet);
        // }, 2000);
    };
    AnalyticsTicketcustomdashboardComponent.prototype.Export = function () {
        console.log('Exporting...');
        // console.log(this.agentTableData);
        this._analyticsService.exportHTMLToExcel('ticketDashboard', 'ticketDashboard-' + new Date().getTime());
    };
    AnalyticsTicketcustomdashboardComponent = __decorate([
        core_1.Component({
            selector: 'app-analytics-ticketcustomdashboard',
            templateUrl: './analytics-ticketcustomdashboard.component.html',
            styleUrls: ['./analytics-ticketcustomdashboard.component.scss']
        })
    ], AnalyticsTicketcustomdashboardComponent);
    return AnalyticsTicketcustomdashboardComponent;
}());
exports.AnalyticsTicketcustomdashboardComponent = AnalyticsTicketcustomdashboardComponent;
//# sourceMappingURL=analytics-ticketcustomdashboard.component.js.map