"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsMissedchatsComponent = void 0;
var core_1 = require("@angular/core");
var Highcharts = require("highcharts");
require('highcharts/modules/exporting')(Highcharts);
var AnalyticsMissedchatsComponent = /** @class */ (function () {
    function AnalyticsMissedchatsComponent(_authService, _globalStateService, _chatService, _analyticsService) {
        var _this = this;
        this._authService = _authService;
        this._globalStateService = _globalStateService;
        this._chatService = _chatService;
        this._analyticsService = _analyticsService;
        this.subscriptions = [];
        this.loading = false;
        //HighChart Demo
        this.highcharts = Highcharts;
        this.missedChatData = [];
        this.selectedAgents = [];
        this.subscriptions.push(_authService.getAgent().subscribe(function (agent) {
            _this.agent = agent;
            // console.log(this.agent);	
        }));
        this.subscriptions.push(_analyticsService.loading.subscribe(function (data) {
            _this.loading = data;
        }));
    }
    AnalyticsMissedchatsComponent.prototype.ngOnInit = function () {
    };
    AnalyticsMissedchatsComponent.prototype.onFilterResult = function (event) {
        var _this = this;
        // console.log(event);
        this.selectedDate = {
            from: new Date(event.selectedDate.from).toISOString(),
            to: this._analyticsService.AddDays(new Date(event.selectedDate.to), 1).toISOString()
        };
        this.selectedAgents = event.selectedAgents;
        var packet = {
            "obj": {
                "nsp": this.agent.nsp,
                "agents": event.selectedAgents,
                // "nsp": "/sbtjapaninquiries.com",
                // "agents": ["jjaved9481@sbtjapan.com"],
                "from": new Date(event.selectedDate.from).toISOString(),
                "to": this._analyticsService.AddDays(new Date(event.selectedDate.to), 1).toISOString(),
                "timezone": this._analyticsService.timeZone
            }
        };
        this._analyticsService.GetMissedChats(packet).subscribe(function (response) {
            if (response && response["Total assigned chats but not entertained by agent:"] && response["Total assigned chats but not entertained by agent:"].length) {
                _this.missedChatData = response["Total assigned chats but not entertained by agent:"];
                if (_this._analyticsService.daysBetween(new Date(event.selectedDate.from), _this._analyticsService.AddDays(new Date(event.selectedDate.to), 1)) == 1) {
                    setTimeout(function () {
                        _this.populateGraph24Hour();
                    }, 0);
                }
                else {
                    setTimeout(function () {
                        _this.populateGraphTotal();
                    }, 0);
                }
            }
        });
    };
    AnalyticsMissedchatsComponent.prototype.populateGraph24Hour = function () {
        var _this = this;
        var options = {
            accessibility: {
                enabled: true,
                description: 'This charts shows the total missed chats count'
            },
            chart: {
                type: 'column',
                backgroundColor: '#f5f6f8',
            },
            title: {
                text: 'Missed Chats'
            },
            tooltip: {
                animation: false,
                useHTML: true,
                shadow: false,
                headerFormat: "<div style='text-align:center;font-weight:bold'>{point.key}</div>",
                pointFormat: "<div>{point.series.name} : {point.y}</div>"
            },
            plotOptions: {
                column: {
                    events: {
                        click: function (event) {
                            // console.log(event);
                            // console.log(this.selectedDate);
                            var query = [];
                            if (_this.selectedAgents.length) {
                                query = [
                                    {
                                        "$match": {
                                            "nsp": _this.agent.nsp,
                                            "createdOn": {
                                                "$lte": _this.selectedDate.to,
                                                "$gte": _this.selectedDate.from
                                            },
                                            "assigned_to": { "$ne": [] }
                                        }
                                    },
                                    {
                                        "$unwind": {
                                            "path": "$assigned_to"
                                        }
                                    },
                                    {
                                        "$match": {
                                            "$expr": {
                                                "$eq": ['$assigned_to.email', '$agentEmail']
                                            }
                                        }
                                    },
                                    {
                                        "$match": {
                                            "assigned_to.email": { "$in": _this.selectedAgents },
                                            "assigned_to.firstResponseTime": { "$eq": '' }
                                        }
                                    },
                                    {
                                        "$sort": { "_id": -1 }
                                    }
                                ];
                            }
                            else {
                                query = [
                                    {
                                        "$match": {
                                            "nsp": _this.agent.nsp,
                                            "createdOn": {
                                                "$lte": _this.selectedDate.to,
                                                "$gte": _this.selectedDate.from
                                            },
                                            "assigned_to": { "$ne": [] },
                                            "endingDate": {
                                                "$exists": true
                                            }
                                        }
                                    },
                                    {
                                        "$unwind": {
                                            "path": "$assigned_to"
                                        }
                                    },
                                    {
                                        "$match": {
                                            "$expr": {
                                                "$eq": ['$assigned_to.email', '$agentEmail']
                                            }
                                        }
                                    },
                                    {
                                        "$match": {
                                            "assigned_to.firstResponseTime": { "$eq": '' }
                                        }
                                    },
                                    {
                                        "$sort": { "_id": -1 }
                                    }
                                ];
                            }
                            _this._chatService.getArchivesFromBackend({}, query);
                            _this._chatService.setActiveTab('ARCHIVE');
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
        var series = [];
        var firstHalf = [];
        var secondHalf = [];
        for (var i = 0; i < 12; i++) {
            firstHalf.push((i == 0) ? '12 AM' : i + ' AM');
        }
        for (var i = 0; i < 12; i++) {
            secondHalf.push((i == 0) ? '12 PM' : i + ' PM');
        }
        options.xAxis.categories = firstHalf.concat(secondHalf);
        this.missedChatData.forEach(function (element) {
            series.push({
                name: element.name,
                data: element.data
            });
        });
        options.series = series;
        this.options = options;
        new Highcharts.Chart("highchart", options);
    };
    AnalyticsMissedchatsComponent.prototype.populateGraphTotal = function () {
        var _this = this;
        var options = {
            accessibility: {
                enabled: true,
                description: 'This charts shows the total missed chats count'
            },
            chart: {
                type: 'column',
                backgroundColor: '#f5f6f8',
            },
            title: {
                text: 'Missed Chats'
            },
            tooltip: {
                animation: false,
                useHTML: true,
                shadow: false,
                headerFormat: "<div style='text-align:center;font-weight:bold'>{point.key}</div>",
                pointFormat: "<div>{point.series.name} : {point.y}</div>"
            },
            plotOptions: {
                column: {
                    events: {
                        click: function (event) {
                            var query = [];
                            var date = {
                                from: new Date(event.point.series.name).toISOString(),
                                to: _this._analyticsService.AddDays(new Date(event.point.series.name), 1).toISOString()
                            };
                            if (_this.selectedAgents.length) {
                                query = [
                                    {
                                        "$match": {
                                            "nsp": _this.agent.nsp,
                                            "createdOn": {
                                                "$lte": date.to,
                                                "$gte": date.from
                                            },
                                            "assigned_to": { "$ne": [] }
                                        }
                                    },
                                    {
                                        "$unwind": {
                                            "path": "$assigned_to"
                                        }
                                    },
                                    {
                                        "$match": {
                                            "$expr": {
                                                "$eq": ['$assigned_to.email', '$agentEmail']
                                            }
                                        }
                                    },
                                    {
                                        "$match": {
                                            "assigned_to.email": { "$in": _this.selectedAgents },
                                            "assigned_to.firstResponseTime": { "$eq": '' }
                                        }
                                    },
                                    {
                                        "$sort": { "_id": -1 }
                                    }
                                ];
                            }
                            else {
                                query = [
                                    {
                                        "$match": {
                                            "nsp": _this.agent.nsp,
                                            "createdOn": {
                                                "$lte": date.to,
                                                "$gte": date.from
                                            },
                                            "assigned_to": { "$ne": [] }
                                        }
                                    },
                                    {
                                        "$unwind": {
                                            "path": "$assigned_to"
                                        }
                                    },
                                    {
                                        "$match": {
                                            "$expr": {
                                                "$eq": ['$assigned_to.email', '$agentEmail']
                                            }
                                        }
                                    },
                                    {
                                        "$match": {
                                            "assigned_to.firstResponseTime": { "$eq": '' }
                                        }
                                    },
                                    {
                                        "$sort": { "_id": -1 }
                                    }
                                ];
                            }
                            _this._chatService.getArchivesFromBackend({}, query);
                            _this._chatService.setActiveTab('ARCHIVE');
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
            xAxis: {
                categories: ['Missed Chats']
            },
            yAxis: {
                title: {
                    text: ''
                }
            },
            series: [{}]
        };
        var series = [];
        this.missedChatData.forEach(function (element) {
            var seriesObj = {
                name: element.name,
                data: []
            };
            var total = 0;
            element.data.forEach(function (d) {
                total += d;
            });
            seriesObj.data = [total];
            series.push(seriesObj);
        });
        // console.log(series);
        options.series = series;
        this.options = options;
        new Highcharts.Chart("highchart", options);
    };
    AnalyticsMissedchatsComponent.prototype.ngAfterViewInit = function () {
    };
    AnalyticsMissedchatsComponent.prototype.customFormatter = function (date) {
        return ("0" + (Number(date.getMonth()) + 1)).slice(-2) + '-' + ("0" + date.getDate()).slice(-2) + '-' + date.getFullYear();
    };
    AnalyticsMissedchatsComponent.prototype.showTotal = function (array) {
        var total = 0;
        array.forEach(function (element) {
            total += element;
        });
        return total;
    };
    AnalyticsMissedchatsComponent.prototype.Export = function () {
        console.log('Exporting...');
        // console.log(this.agentTableData);
        this._analyticsService.exportHTMLToExcel('missedChats', 'MissedChats-' + new Date().getTime());
    };
    AnalyticsMissedchatsComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
    };
    AnalyticsMissedchatsComponent = __decorate([
        core_1.Component({
            selector: 'app-analytics-missedchats',
            templateUrl: './analytics-missedchats.component.html',
            styleUrls: ['./analytics-missedchats.component.css'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], AnalyticsMissedchatsComponent);
    return AnalyticsMissedchatsComponent;
}());
exports.AnalyticsMissedchatsComponent = AnalyticsMissedchatsComponent;
//# sourceMappingURL=analytics-missedchats.component.js.map