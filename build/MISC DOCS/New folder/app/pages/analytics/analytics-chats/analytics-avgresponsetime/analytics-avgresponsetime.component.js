"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsAvgresponsetimeComponent = void 0;
var core_1 = require("@angular/core");
var Highcharts = require("highcharts");
require('highcharts/modules/exporting')(Highcharts);
var AnalyticsAvgresponsetimeComponent = /** @class */ (function () {
    function AnalyticsAvgresponsetimeComponent(_authService, _utilityService, _analyticsService) {
        var _this = this;
        this._utilityService = _utilityService;
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
                text: 'Avg Response Time'
            },
            tooltip: {
                animation: false,
                useHTML: true,
                shadow: false,
                headerFormat: "<div style='text-align:center;font-weight:bold'>{point.series.name}</div>",
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
                    return "<div><b>" + str + "</b></div><div>" + this.chats + " chats</div>";
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
                    _this.options.title.text = 'Avg Response Time (' + _this.time_convert(data.title.text) + ')';
                }
                else {
                    _this.options.title.text = 'Avg Response Time';
                }
                _this.options.chart.type = data.chart.type;
                _this.options.legend = data.legend;
                _this.options.xAxis.categories = data.xAxis.categories;
                _this.options.series = data.series;
                _this.chart = new Highcharts.Chart("highchart", _this.options);
            }
        }));
    }
    AnalyticsAvgresponsetimeComponent.prototype.ngOnInit = function () {
    };
    AnalyticsAvgresponsetimeComponent.prototype.onFilterResult = function (event) {
        var _this = this;
        var groupAgents = [];
        if (event.selectedGroups.length) {
            this._utilityService.getAgentsAgainstGroup(event.selectedGroups).subscribe(function (agents) {
                // console.log(agents);
                groupAgents = agents;
            });
        }
        this._analyticsService.GetAverageResponseTime(event.csid, event.selectedDateType, event.selectedDate, (groupAgents.length) ? groupAgents : event.selectedAgents).subscribe(function (data) {
            // console.log(data.json());
            var responseData = data.json();
            // let totalDifference = 0;
            var series = [];
            var distinctDates = [];
            // let categories = [];
            // console.log('avg response get call result : ',responseData);
            distinctDates = responseData.map(function (item) { return item.date; })
                .filter(function (value, index, self) { return self.indexOf(value) === index; });
            // console.log('categories',distinctDates)
            if (event.selectedAgents.length || groupAgents.length) {
                if (event.selectedAgents) {
                    event.selectedAgents.map(function (agent) {
                        series.push({ name: agent, data: [], type: 'column' });
                    });
                }
                else if (groupAgents.length) {
                    groupAgents.map(function (agent) {
                        series.push({ name: agent, data: [], type: 'column' });
                    });
                }
                series.map(function (singleSeries) {
                    distinctDates.map(function (singleDate) {
                        var obj = responseData.filter(function (data) { return data.date === singleDate && singleSeries.name === data.email; })[0];
                        if (obj) {
                            singleSeries.data.push({ y: obj.avgResponseTime, chats: data.chatCount.length });
                        }
                        else {
                            singleSeries.data.push({ y: 0, chats: 0 });
                        }
                    });
                });
            }
            // if(event.selectedGroups.length){
            // 	// console.log('Group selected!');
            // 	series.push({name : event.selectedGroups[0], data: [], type:'column'});
            // 	distinctDates.map(singleDate=>{
            // 		series[0].data.push({y: 0, chats: 0});
            // 		let obj = responseData.filter(data=> data.date === singleDate);
            // 		if(obj && obj.length){
            // 			obj.map(o => {
            // 				series[0].data[0].y += o.avgResponseTime;
            // 				series[0].data[0].chats += o.chatCount.length;
            // 			})
            // 		}
            // 	})							
            // }
            else {
                series.push({ name: 'Average Response Time', data: [], type: 'column' });
                responseData.map(function (data) {
                    // console.log(data,'data')
                    series[0].data.push({ y: data.avgResponseTime, chats: data.chatCount.length });
                });
            }
            // console.log('series : ',series)
            _this._analyticsService.updateChartSimple('column', true, distinctDates, series);
        }, function (err) {
            console.log('Error! Server unreachable.');
        });
    };
    AnalyticsAvgresponsetimeComponent.prototype.ngAfterViewInit = function () {
        this.chart = new Highcharts.Chart("highchart", this.options);
        this.rendered = true;
    };
    AnalyticsAvgresponsetimeComponent.prototype.time_convert = function (num) {
        // num = Math.round(num); 
        // console.log(num);
        var days = Math.floor((num / 24) / 60);
        var hours = Math.floor((num / 60) % 24);
        var minutes = Math.round(num % 60);
        var seconds = Math.round(num * 60 % 60);
        var str = (days) ? days + ' day ' : '';
        str += (hours) ? hours + " hr " : '';
        (minutes) ? str += minutes + ' min ' : '';
        (seconds) ? str += seconds + 's' : '';
        // console.log(str);
        return (str) ? str : '';
    };
    AnalyticsAvgresponsetimeComponent.prototype.showTotal = function (indexExists, index) {
        var count = 0;
        if (indexExists) {
            this.options.series[index].data.forEach(function (element) {
                count += element.y;
            });
        }
        else {
            this.options.series.forEach(function (element) {
                count += element.data.reduce(function (a, b) { return a.y + b.y; }, 0);
            });
        }
        return this.time_convert(count);
    };
    AnalyticsAvgresponsetimeComponent.prototype.Export = function () {
        console.log('Exporting...');
        // console.log(this.agentTableData);
        this._analyticsService.exportHTMLToExcel('avgResponse', 'AvgResponse-' + new Date().getTime());
    };
    AnalyticsAvgresponsetimeComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
    };
    AnalyticsAvgresponsetimeComponent = __decorate([
        core_1.Component({
            selector: 'app-analytics-avgresponsetime',
            templateUrl: './analytics-avgresponsetime.component.html',
            styleUrls: ['./analytics-avgresponsetime.component.css'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], AnalyticsAvgresponsetimeComponent);
    return AnalyticsAvgresponsetimeComponent;
}());
exports.AnalyticsAvgresponsetimeComponent = AnalyticsAvgresponsetimeComponent;
//# sourceMappingURL=analytics-avgresponsetime.component.js.map