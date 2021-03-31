"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsAgentscorecardComponent = void 0;
var core_1 = require("@angular/core");
var AnalyticsAgentscorecardComponent = /** @class */ (function () {
    function AnalyticsAgentscorecardComponent(_authService, _analyticsService, _utilityService, _ticketGroupService) {
        var _this = this;
        this._analyticsService = _analyticsService;
        this._utilityService = _utilityService;
        this.subscriptions = [];
        this.today = this.dateFormatter(new Date());
        //options for agent activity
        this.agentsList = [];
        this.groupList = [];
        this.agentsList_original = [];
        this.ended = false;
        //chart variables
        this.dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        this.loading = false;
        this.selectedAgents = [];
        this.selectedGroups = [];
        this.selectedDate = {
            from: this.dateFormatter(new Date()),
            to: this.dateFormatter(new Date())
        };
        this.scorecardData = [];
        this.filterType = 'agent';
        this.subscriptions.push(_authService.getAgent().subscribe(function (agent) {
            _this.agent = agent;
            // console.log(this.agent);	
        }));
        this.subscriptions.push(_authService.getSettings().subscribe(function (settings) {
            // console.log(settings);	
            if (settings) {
                _this.permissions = settings.permissions.analytics;
            }
        }));
        this.subscriptions.push(this._utilityService.getAllAgentsListObs().subscribe(function (agentsList) {
            _this.agentsList = agentsList;
            _this.agentsList_original = agentsList;
        }));
        this.subscriptions.push(_ticketGroupService.Groups.subscribe(function (data) {
            if (data) {
                _this.groupList = data.map(function (g) { return g.group_name; });
            }
            // console.log(this.groupList);
        }));
    }
    AnalyticsAgentscorecardComponent.prototype.ngOnInit = function () {
    };
    AnalyticsAgentscorecardComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        setTimeout(function () {
            if (localStorage.getItem('analytics-agentscorecard')) {
                var obj = JSON.parse(localStorage.getItem('analytics-agentscorecard'));
                _this.selectedDate = obj.selectedDate;
                _this.selectedAgents = obj.selectedAgents;
                _this.selectedGroups = obj.selectedGroups;
                _this.filterType = obj.filterType;
            }
            _this.onFilterResult();
        }, 0);
    };
    AnalyticsAgentscorecardComponent.prototype.onFilterResult = function () {
        var _this = this;
        this.loading = true;
        // this.populateHourlyData(data);
        var packet = {
            selectedDate: this.selectedDate,
            selectedAgents: this.selectedAgents,
            selectedGroups: this.selectedGroups,
            filterType: this.filterType
        };
        localStorage.setItem('analytics-agentscorecard', JSON.stringify(packet));
        this.GetScorecard().then(function (result) {
            _this.scorecardData = result;
            _this.loading = false;
        });
    };
    AnalyticsAgentscorecardComponent.prototype.GetScorecard = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.filterType == 'agent') {
                var packet = {
                    "obj": {
                        "nsp": _this.agent.nsp,
                        "agents": (!_this.selectedAgents.length) ? [_this.agent.email] : _this.selectedAgents,
                        // "nsp": "/sbtjapaninquiries.com",
                        // "agents": ["jjaved9481@sbtjapan.com"],
                        "from": new Date(_this.selectedDate.from).toISOString(),
                        "to": new Date(_this.selectedDate.to).toISOString(),
                        "timezone": _this._analyticsService.timeZone
                    }
                };
                // console.log(packet);
                _this._analyticsService.GetScorecardData(packet).subscribe(function (response) {
                    // console.log(response);
                    if (response && response['Response Time'] && response['Response Time'].length) {
                        resolve(response['Response Time']);
                    }
                    else {
                        resolve([]);
                    }
                }, function (err) {
                    reject([]);
                });
            }
            else {
                _this._utilityService.getAgentsAgainstGroup(_this.selectedGroups).subscribe(function (result) {
                    var packet = {
                        "obj": {
                            "nsp": _this.agent.nsp,
                            "agents": result.map(function (a) { return a.email; }),
                            // "nsp": "/sbtjapaninquiries.com",
                            // "agents": ["jjaved9481@sbtjapan.com"],
                            "from": new Date(_this.selectedDate.from).toISOString(),
                            "to": new Date(_this.selectedDate.to).toISOString(),
                            "timezone": _this._analyticsService.timeZone
                        }
                    };
                    // console.log(packet);
                    _this._analyticsService.GetScorecardData(packet).subscribe(function (response) {
                        // console.log(response);
                        if (response && response['Response Time'] && response['Response Time'].length) {
                            resolve(response['Response Time']);
                        }
                        else {
                            resolve([]);
                        }
                    }, function (err) {
                        reject([]);
                    });
                });
            }
        });
    };
    AnalyticsAgentscorecardComponent.prototype.Export = function (id) {
        console.log('Exporting...');
        // console.log(this.agentTableData);
        this._analyticsService.exportHTMLToExcel(id, id + '-' + new Date().getTime());
    };
    AnalyticsAgentscorecardComponent.prototype.onItemSelect = function (event) {
        this.selectedAgents = event;
    };
    AnalyticsAgentscorecardComponent.prototype.onItemDeSelect = function (event) {
        this.selectedAgents = event;
    };
    AnalyticsAgentscorecardComponent.prototype.onGroupSelect = function (event) {
        this.selectedGroups = (Array.isArray(event)) ? event : [event];
    };
    AnalyticsAgentscorecardComponent.prototype.onGroupDeSelect = function (event) {
        // if(Array.isArray(event))
        this.selectedGroups = (Array.isArray(event)) ? event : [event];
    };
    AnalyticsAgentscorecardComponent.prototype.loadMore = function ($event) {
        var _this = this;
        // console.log('Scroll');
        if (!this.ended) {
            // console.log('Fetch More');
            this._utilityService.getMoreAgentsObs(this.agentsList[this.agentsList.length - 1].first_name).subscribe(function (response) {
                // console.log(response);
                _this.agentsList = _this.agentsList.concat(response.agents);
                _this.ended = response.ended;
            });
        }
    };
    AnalyticsAgentscorecardComponent.prototype.onSearch = function (value) {
        var _this = this;
        // console.log('Search');
        // console.log(value);
        if (value) {
            var agents_1 = this.agentsList_original.filter(function (a) { return a.email.includes(value.toLowerCase()); });
            this._utilityService.SearchAgent(value).subscribe(function (response) {
                //console.log(response);
                if (response && response.agentList.length) {
                    response.agentList.forEach(function (element) {
                        if (!agents_1.filter(function (a) { return a.email == element.email; }).length) {
                            agents_1.push(element);
                        }
                    });
                }
                _this.agentsList = agents_1;
            });
            // this.agentsList = agents;
        }
        else {
            this.agentsList = this.agentsList_original;
            this.ended = false;
            // this.setScrollEvent();
        }
    };
    AnalyticsAgentscorecardComponent.prototype.dateFormatter = function (d) {
        return d.getFullYear() + '-' + ("0" + (d.getMonth() + 1)).slice(-2) + '-' + ("0" + d.getDate()).slice(-2) + "T00:00";
    };
    AnalyticsAgentscorecardComponent.prototype.ISOFormat = function (d) {
        return d.getFullYear() + '-' + ("0" + (d.getMonth() + 1)).slice(-2) + '-' + ("0" + d.getDate()).slice(-2) + "T" + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) + ":00.000Z";
    };
    AnalyticsAgentscorecardComponent.prototype.time_convert = function (num) {
        var str = '';
        if (num) {
            if (Math.floor(num / 60))
                str += Math.floor(num / 60) + "hr ";
            str += ("0" + (Math.round(num % 60))).slice(-2) + "m";
        }
        return (str) ? str : '0hr 0m';
    };
    AnalyticsAgentscorecardComponent.prototype.time_convert_sec = function (num) {
        var str = '';
        if (num) {
            str += Math.round(num * 60) + "s";
        }
        return (str) ? str : '0s';
    };
    AnalyticsAgentscorecardComponent.prototype.showPercentage = function (number) {
        return Math.round(number * 100);
    };
    AnalyticsAgentscorecardComponent.prototype.toggle = function () {
        (this.filterType == 'agent') ? this.filterType = 'group' : this.filterType = 'agent';
    };
    AnalyticsAgentscorecardComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.forEach(function (subsription) {
            subsription.unsubscribe();
        });
    };
    AnalyticsAgentscorecardComponent = __decorate([
        core_1.Component({
            selector: 'app-analytics-agentscorecard',
            templateUrl: './analytics-agentscorecard.component.html',
            styleUrls: ['./analytics-agentscorecard.component.css']
        })
    ], AnalyticsAgentscorecardComponent);
    return AnalyticsAgentscorecardComponent;
}());
exports.AnalyticsAgentscorecardComponent = AnalyticsAgentscorecardComponent;
//# sourceMappingURL=analytics-agentscorecard.component.js.map