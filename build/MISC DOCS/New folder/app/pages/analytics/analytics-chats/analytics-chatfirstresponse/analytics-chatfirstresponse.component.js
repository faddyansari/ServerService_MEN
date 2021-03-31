"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsChatfirstresponseComponent = void 0;
var core_1 = require("@angular/core");
var Highcharts = require("highcharts");
require('highcharts/modules/exporting')(Highcharts);
var AnalyticsChatfirstresponseComponent = /** @class */ (function () {
    function AnalyticsChatfirstresponseComponent(_authService, _analyticsService) {
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
                text: 'Chat Response'
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
                    return "<div>Chat response: <b>" + str + "</b></div>";
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
                    _this.options.title.text = 'First Response Time (' + _this.time_convert(data.title.text) + ')';
                }
                else {
                    _this.options.title.text = 'First Response Time';
                }
                _this.options.chart.type = data.chart.type;
                _this.options.legend = data.legend;
                _this.options.xAxis.categories = data.xAxis.categories;
                _this.options.series = data.series;
                _this.chart = new Highcharts.Chart("highchart", _this.options);
            }
        }));
    }
    AnalyticsChatfirstresponseComponent.prototype.ngOnInit = function () {
    };
    AnalyticsChatfirstresponseComponent.prototype.onFilterResult = function (event) {
        var _this = this;
        this._analyticsService.GetChatFirstResponseTime(event.csid, event.selectedDateType, event.selectedDate, event.selectedAgents).subscribe(function (data) {
            var totalDifference = 0;
            var arr = [];
            data.json().forEach(function (element) {
                totalDifference += element['responseTime'];
                arr.push({
                    name: element['_id'],
                    value: element['responseTime']
                });
            });
            // console.log(data.json());
            _this._analyticsService.updateChart('column', arr, 'flat', 'First Response Time', false, totalDifference);
        }, function (err) {
            console.log('Error! Server unreachable.');
        });
    };
    AnalyticsChatfirstresponseComponent.prototype.ngAfterViewInit = function () {
        this.chart = new Highcharts.Chart("highchart", this.options);
        this.rendered = true;
    };
    AnalyticsChatfirstresponseComponent.prototype.time_convert = function (num) {
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
    AnalyticsChatfirstresponseComponent.prototype.showTotal = function (indexExists, index) {
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
    AnalyticsChatfirstresponseComponent.prototype.Export = function () {
        console.log('Exporting...');
        // console.log(this.agentTableData);
        this._analyticsService.exportHTMLToExcel('chatResponse', 'AgentResponse-' + new Date().getTime());
    };
    AnalyticsChatfirstresponseComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
    };
    AnalyticsChatfirstresponseComponent = __decorate([
        core_1.Component({
            selector: 'app-analytics-chatfirstresponse',
            templateUrl: './analytics-chatfirstresponse.component.html',
            styleUrls: ['./analytics-chatfirstresponse.component.css'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], AnalyticsChatfirstresponseComponent);
    return AnalyticsChatfirstresponseComponent;
}());
exports.AnalyticsChatfirstresponseComponent = AnalyticsChatfirstresponseComponent;
//# sourceMappingURL=analytics-chatfirstresponse.component.js.map