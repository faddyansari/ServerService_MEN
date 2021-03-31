"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsAgentactivityComponent = void 0;
var core_1 = require("@angular/core");
var AnalyticsAgentactivityComponent = /** @class */ (function () {
    function AnalyticsAgentactivityComponent(_authService, _analyticsService, _utilityService, _ticketGroupService) {
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
        this.availabilityHoursData = [];
        this.scorecardData = [];
        this.filterType = 'agent';
        this.graphData = {};
        this.hourlyData = [];
        this.hourlyToggle = false;
        this.agentSelectedSilent = [];
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
    AnalyticsAgentactivityComponent.prototype.ngOnInit = function () {
    };
    AnalyticsAgentactivityComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        setTimeout(function () {
            if (localStorage.getItem('analytics-agentactivity')) {
                var obj = JSON.parse(localStorage.getItem('analytics-agentactivity'));
                _this.selectedDate = obj.selectedDate;
                _this.selectedAgents = obj.selectedAgents;
                _this.selectedGroups = obj.selectedGroups;
                _this.hourlyToggle = obj.hourlyToggle;
                _this.filterType = obj.filterType;
            }
            _this.onFilterResult();
        }, 0);
    };
    AnalyticsAgentactivityComponent.prototype.onFilterResult = function () {
        var _this = this;
        this.loading = true;
        // this.populateHourlyData(data);
        // if(!this.selectedAgents.length){
        // 	this.selectedAgents = [this.agent.email]
        // }
        var packet = {
            selectedDate: this.selectedDate,
            selectedAgents: this.selectedAgents,
            selectedGroups: this.selectedGroups,
            hourlyToggle: this.hourlyToggle,
            filterType: this.filterType
        };
        localStorage.setItem('analytics-agentactivity', JSON.stringify(packet));
        Promise.all([this.GetAgentActivity(), this.GetHourlyActivity()]).then(function (result) {
            if (_this.hourlyToggle) {
                _this.populateHourlyData(result[1]);
                _this.availabilityHoursData = [];
            }
            else {
                _this.availabilityHoursData = result[0];
                _this.populateHourlyData([]);
            }
            _this.loading = false;
        });
    };
    AnalyticsAgentactivityComponent.prototype.populateHourlyData = function (data) {
        var _this = this;
        // console.log(this.selectedAgents);
        // console.log(data);
        if (this.hourlyToggle) {
            var todayDate_1 = new Date(this.selectedDate.from.split('T')[0] + "T00:00");
            this.graphData = {};
            this.agentSelectedSilent.forEach(function (agent) {
                var _a;
                Object.assign(_this.graphData, (_a = {}, _a[agent] = [], _a));
            });
            data.forEach(function (d, index) {
                if (_this.graphData[d.email]) {
                    d.createdDate = new Date(d.createdDate);
                    if (d.createdDate < todayDate_1) {
                        d.createdDate = todayDate_1;
                    }
                    if (data[index + 1] && d.email == data[index + 1].email) {
                        if (!d.endingDate && !data[index + 1].endingDate && data[index + 1].idleStart) {
                            d.endingDate = data[index + 1].idleStart;
                        }
                        if (d.endingDate && data[index + 1].endingDate && d.endingDate == data[index + 1].endingDate && data[index + 1].idleStart) {
                            d.endingDate = data[index + 1].idleStart;
                        }
                    }
                    var maxDate = new Date(_this.selectedDate.from.split('T')[0] + 'T23:59');
                    if (d.endingDate) {
                        d.endingDate = new Date(d.endingDate);
                        if (d.endingDate > maxDate) {
                            d.endingDate = maxDate;
                        }
                    }
                    else {
                        if (maxDate > new Date()) {
                            d.endingDate = new Date();
                        }
                        else {
                            d.endingDate = maxDate;
                        }
                    }
                    ;
                    if (d.idleStart) {
                        d.idleStart = new Date(d.idleStart);
                        if (d.idleStart > maxDate) {
                            d.idleStart = maxDate;
                        }
                        if (d.idleStart < todayDate_1) {
                            d.idleStart = todayDate_1;
                        }
                    }
                    if (d.idleEnd) {
                        d.idleEnd = new Date(d.idleEnd);
                        if (d.idleEnd > maxDate) {
                            d.idleEnd = maxDate;
                        }
                        if (d.idleEnd < todayDate_1) {
                            d.idleEnd = todayDate_1;
                        }
                    }
                    ;
                    if (d.idleStart) {
                        if (d.createdDate.toString() != d.idleStart.toString()) {
                            if (index == 0) {
                                var diff = ((d.idleStart.getTime() - d.createdDate.getTime()) / 1000) / 60;
                                _this.graphData[d.email].push({
                                    type: 'active',
                                    span: (d.createdDate.toLocaleTimeString()) + ' - ' + (d.idleStart.toLocaleTimeString()),
                                    duration: Math.round(diff),
                                    width: (diff / 1440) * 100,
                                    left: ((((d.createdDate.getTime() - todayDate_1.getTime()) / 1000) / 60) / 1440) * 100
                                });
                                if (d.idleEnd) {
                                    diff = ((d.idleEnd.getTime() - d.idleStart.getTime()) / 1000) / 60;
                                    _this.graphData[d.email].push({
                                        type: 'idle',
                                        span: (d.idleStart.toLocaleTimeString()) + ' - ' + (d.idleEnd.toLocaleTimeString()),
                                        duration: Math.round(diff),
                                        width: (diff / 1440) * 100,
                                        left: ((((d.idleStart.getTime() - todayDate_1.getTime()) / 1000) / 60) / 1440) * 100
                                    });
                                    if (d.idleEnd.getTime() < d.endingDate.getTime()) {
                                        diff = ((d.endingDate.getTime() - d.idleEnd.getTime()) / 1000) / 60;
                                        _this.graphData[d.email].push({
                                            type: 'active',
                                            span: d.idleEnd.toLocaleTimeString() + ' - ' + d.endingDate.toLocaleTimeString(),
                                            duration: Math.round(diff),
                                            width: (diff / 1440) * 100,
                                            left: ((((d.idleEnd.getTime() - todayDate_1.getTime()) / 1000) / 60) / 1440) * 100
                                        });
                                    }
                                }
                                else {
                                    var diff_1 = ((d.endingDate.getTime() - d.idleStart.getTime()) / 1000) / 60;
                                    _this.graphData[d.email].push({
                                        type: 'idle',
                                        span: (d.idleStart.toLocaleTimeString()) + ' - ' + (d.endingDate.toLocaleTimeString()),
                                        duration: Math.round(diff_1),
                                        width: (diff_1 / 1440) * 100,
                                        left: ((((d.idleStart.getTime() - todayDate_1.getTime()) / 1000) / 60) / 1440) * 100
                                    });
                                }
                            }
                            else if (d.createdDate.toString() == data[index - 1].createdDate.toString() && d.email == data[index - 1].email) {
                                if (d.idleEnd) {
                                    var diff = ((d.idleEnd.getTime() - d.idleStart.getTime()) / 1000) / 60;
                                    _this.graphData[d.email].push({
                                        type: 'idle',
                                        span: (d.idleStart.toLocaleTimeString()) + ' - ' + (d.idleEnd.toLocaleTimeString()),
                                        duration: Math.round(diff),
                                        width: (diff / 1440) * 100,
                                        left: ((((d.idleStart.getTime() - todayDate_1.getTime()) / 1000) / 60) / 1440) * 100
                                    });
                                    if (d.idleEnd.getTime() < d.endingDate.getTime()) {
                                        diff = ((d.endingDate.getTime() - d.idleEnd.getTime()) / 1000) / 60;
                                        _this.graphData[d.email].push({
                                            type: 'active',
                                            span: d.idleEnd.toLocaleTimeString() + ' - ' + d.endingDate.toLocaleTimeString(),
                                            duration: Math.round(diff),
                                            width: (diff / 1440) * 100,
                                            left: ((((d.idleEnd.getTime() - todayDate_1.getTime()) / 1000) / 60) / 1440) * 100
                                        });
                                    }
                                }
                                else {
                                    var diff = ((d.endingDate.getTime() - d.idleStart.getTime()) / 1000) / 60;
                                    _this.graphData[d.email].push({
                                        type: 'idle',
                                        span: (d.idleStart.toLocaleTimeString()) + ' - ' + (d.endingDate.toLocaleTimeString()),
                                        duration: Math.round(diff),
                                        width: (diff / 1440) * 100,
                                        left: ((((d.idleStart.getTime() - todayDate_1.getTime()) / 1000) / 60) / 1440) * 100
                                    });
                                }
                            }
                            else {
                                var diff = ((d.idleStart.getTime() - d.createdDate.getTime()) / 1000) / 60;
                                _this.graphData[d.email].push({
                                    type: 'active',
                                    span: (d.createdDate.toLocaleTimeString()) + ' - ' + (d.idleStart.toLocaleTimeString()),
                                    duration: Math.round(diff),
                                    width: (diff / 1440) * 100,
                                    left: ((((d.createdDate.getTime() - todayDate_1.getTime()) / 1000) / 60) / 1440) * 100
                                });
                                if (d.idleEnd) {
                                    diff = ((d.idleEnd.getTime() - d.idleStart.getTime()) / 1000) / 60;
                                    _this.graphData[d.email].push({
                                        type: 'idle',
                                        span: (d.idleStart.toLocaleTimeString()) + ' - ' + (d.idleEnd.toLocaleTimeString()),
                                        duration: Math.round(diff),
                                        width: (diff / 1440) * 100,
                                        left: ((((d.idleStart.getTime() - todayDate_1.getTime()) / 1000) / 60) / 1440) * 100
                                    });
                                    if (d.idleEnd.getTime() < d.endingDate.getTime()) {
                                        diff = ((d.endingDate.getTime() - d.idleEnd.getTime()) / 1000) / 60;
                                        _this.graphData[d.email].push({
                                            type: 'active',
                                            span: d.idleEnd.toLocaleTimeString() + ' - ' + d.endingDate.toLocaleTimeString(),
                                            duration: Math.round(diff),
                                            width: (diff / 1440) * 100,
                                            left: ((((d.idleEnd.getTime() - todayDate_1.getTime()) / 1000) / 60) / 1440) * 100
                                        });
                                    }
                                }
                                else {
                                    diff = ((d.endingDate.getTime() - d.idleStart.getTime()) / 1000) / 60;
                                    _this.graphData[d.email].push({
                                        type: 'idle',
                                        span: (d.idleStart.toLocaleTimeString()) + ' - ' + (d.endingDate.toLocaleTimeString()),
                                        duration: Math.round(diff),
                                        width: (diff / 1440) * 100,
                                        left: ((((d.idleStart.getTime() - todayDate_1.getTime()) / 1000) / 60) / 1440) * 100
                                    });
                                }
                            }
                        }
                        else {
                            if (d.idleEnd) {
                                var diff = ((d.idleEnd.getTime() - d.idleStart.getTime()) / 1000) / 60;
                                _this.graphData[d.email].push({
                                    type: 'idle',
                                    span: (d.idleStart.toLocaleTimeString()) + ' - ' + (d.idleEnd.toLocaleTimeString()),
                                    duration: Math.round(diff),
                                    width: (diff / 1440) * 100,
                                    left: ((((d.idleStart.getTime() - todayDate_1.getTime()) / 1000) / 60) / 1440) * 100
                                });
                                if (d.idleEnd.getTime() < d.endingDate.getTime()) {
                                    diff = ((d.endingDate.getTime() - d.idleEnd.getTime()) / 1000) / 60;
                                    _this.graphData[d.email].push({
                                        type: 'active',
                                        span: d.idleEnd.toLocaleTimeString() + ' - ' + d.endingDate.toLocaleTimeString(),
                                        duration: Math.round(diff),
                                        width: (diff / 1440) * 100,
                                        left: ((((d.idleEnd.getTime() - todayDate_1.getTime()) / 1000) / 60) / 1440) * 100
                                    });
                                }
                            }
                            else {
                                var diff = ((d.endingDate.getTime() - d.idleStart.getTime()) / 1000) / 60;
                                _this.graphData[d.email].push({
                                    type: 'idle',
                                    span: (d.idleStart.toLocaleTimeString()) + ' - ' + (d.endingDate.toLocaleTimeString()),
                                    duration: Math.round(diff),
                                    width: (diff / 1440) * 100,
                                    left: ((((d.idleStart.getTime() - todayDate_1.getTime()) / 1000) / 60) / 1440) * 100
                                });
                            }
                        }
                    }
                    else {
                        var diff = ((d.endingDate.getTime() - d.createdDate.getTime()) / 1000) / 60;
                        _this.graphData[d.email].push({
                            type: 'active',
                            span: (d.createdDate.toLocaleTimeString()) + ' - ' + (d.endingDate.toLocaleTimeString()),
                            duration: Math.round(diff),
                            width: (diff / 1440) * 100,
                            left: ((((d.createdDate.getTime() - todayDate_1.getTime()) / 1000) / 60) / 1440) * 100
                        });
                    }
                }
            });
            var transformedArray_1 = [];
            Object.keys(this.graphData).map(function (key) {
                transformedArray_1.push({
                    email: key,
                    data: _this.graphData[key]
                });
            });
            console.log(this.graphData);
            this.hourlyData = transformedArray_1;
        }
        else {
            this.hourlyData = [];
        }
        // console.log(this.hourlyData);
    };
    AnalyticsAgentactivityComponent.prototype.GetAgentActivity = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.filterType == 'agent') {
                var packet = {
                    "obj": {
                        "nsp": _this.agent.nsp,
                        "agents": (!_this.selectedAgents.length) ? [_this.agent.email] : _this.selectedAgents,
                        // "nsp": "/sbtjapaninquiries.com",
                        // "agents": ["jjaved9481@sbtjapan.com"],
                        "from": _this.ISOFormat(new Date(_this.selectedDate.from)),
                        "to": _this.ISOFormat(new Date(_this.selectedDate.to)),
                        "timezone": _this._analyticsService.timeZone
                    }
                };
                // console.log(packet);
                _this._analyticsService.GetAvailabilityHours(packet).subscribe(function (response) {
                    // console.log(response);
                    if (response && response['Availablity Hours'] && response['Availablity Hours'].length) {
                        resolve(response['Availablity Hours']);
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
                            "from": _this.ISOFormat(new Date(_this.selectedDate.from)),
                            "to": _this.ISOFormat(new Date(_this.selectedDate.to)),
                            "timezone": _this._analyticsService.timeZone
                        }
                    };
                    // console.log(packet);
                    _this._analyticsService.GetAvailabilityHours(packet).subscribe(function (response) {
                        // console.log(response);
                        if (response && response['Availablity Hours'] && response['Availablity Hours'].length) {
                            resolve(response['Availablity Hours']);
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
    AnalyticsAgentactivityComponent.prototype.GetHourlyActivity = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.agentSelectedSilent = [];
            if (_this.filterType == 'agent') {
                var packet = {
                    "obj": {
                        "nsp": _this.agent.nsp,
                        "agents": (!_this.selectedAgents.length) ? [_this.agent.email] : _this.selectedAgents,
                        // "nsp": "/sbtjapaninquiries.com",
                        // "agents": ["jjaved9481@sbtjapan.com"],
                        "from": _this.ISOFormat(new Date(_this.selectedDate.from)),
                        "to": _this.ISOFormat(new Date(_this._analyticsService.AddDays(_this.selectedDate.from, 1))),
                        "timezone": _this._analyticsService.timeZone
                    }
                };
                // console.log(packet);
                _this.agentSelectedSilent = packet.obj.agents;
                _this._analyticsService.GetHourlyActivityData(packet).subscribe(function (response) {
                    // console.log(response);
                    if (response && response['data'] && response['data'].length) {
                        resolve(response['data']);
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
                            "from": _this.ISOFormat(new Date(_this.selectedDate.from)),
                            "to": _this.ISOFormat(new Date(_this._analyticsService.AddDays(_this.selectedDate.from, 1))),
                            "timezone": _this._analyticsService.timeZone
                        }
                    };
                    // console.log(packet);
                    _this.agentSelectedSilent = packet.obj.agents;
                    _this._analyticsService.GetHourlyActivityData(packet).subscribe(function (response) {
                        // console.log(response);
                        if (response && response['data'] && response['data'].length) {
                            resolve(response['data']);
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
    AnalyticsAgentactivityComponent.prototype.Export = function (id) {
        console.log('Exporting...');
        // console.log(this.agentTableData);
        this._analyticsService.exportHTMLToExcel(id, id + '-' + new Date().getTime());
    };
    AnalyticsAgentactivityComponent.prototype.onItemSelect = function (event) {
        this.selectedAgents = event;
    };
    AnalyticsAgentactivityComponent.prototype.onItemDeSelect = function (event) {
        this.selectedAgents = event;
    };
    AnalyticsAgentactivityComponent.prototype.onGroupSelect = function (event) {
        this.selectedGroups = (Array.isArray(event)) ? event : [event];
    };
    AnalyticsAgentactivityComponent.prototype.onGroupDeSelect = function (event) {
        // if(Array.isArray(event))
        this.selectedGroups = (Array.isArray(event)) ? event : [event];
    };
    AnalyticsAgentactivityComponent.prototype.loadMore = function ($event) {
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
    AnalyticsAgentactivityComponent.prototype.onSearch = function (value) {
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
    //HELPERS
    AnalyticsAgentactivityComponent.prototype.GetTotalHours = function (email, type) {
        var time = 0;
        this.hourlyData.forEach(function (d) {
            if (d.email == email) {
                d.data.forEach(function (element) {
                    if (element.type == type) {
                        time += element.duration;
                    }
                });
            }
        });
        // console.log(time);
        return this.time_convert(time);
    };
    AnalyticsAgentactivityComponent.prototype.dateFormatter = function (d) {
        return d.getFullYear() + '-' + ("0" + (d.getMonth() + 1)).slice(-2) + '-' + ("0" + d.getDate()).slice(-2) + "T00:00";
    };
    AnalyticsAgentactivityComponent.prototype.ISOFormat = function (d) {
        return d.getFullYear() + '-' + ("0" + (d.getMonth() + 1)).slice(-2) + '-' + ("0" + d.getDate()).slice(-2) + "T" + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) + ":00.000Z";
    };
    AnalyticsAgentactivityComponent.prototype.time_convert = function (num) {
        var str = '';
        if (num) {
            if (Math.floor(num / 60))
                str += Math.floor(num / 60) + "hr ";
            str += ("0" + (Math.round(num % 60))).slice(-2) + "m";
        }
        return (str) ? str : '0hr 0m';
    };
    AnalyticsAgentactivityComponent.prototype.time_convert_sec = function (num) {
        var str = '';
        if (num) {
            str += Math.round(num * 60) + "s";
        }
        return (str) ? str : '0s';
    };
    AnalyticsAgentactivityComponent.prototype.showPercentage = function (number) {
        return Math.round(number * 100);
    };
    AnalyticsAgentactivityComponent.prototype.toggle = function () {
        (this.filterType == 'agent') ? this.filterType = 'group' : this.filterType = 'agent';
    };
    AnalyticsAgentactivityComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.forEach(function (subsription) {
            subsription.unsubscribe();
        });
    };
    AnalyticsAgentactivityComponent = __decorate([
        core_1.Component({
            selector: 'app-analytics-agentactivity',
            templateUrl: './analytics-agentactivity.component.html',
            styleUrls: ['./analytics-agentactivity.component.scss']
        })
    ], AnalyticsAgentactivityComponent);
    return AnalyticsAgentactivityComponent;
}());
exports.AnalyticsAgentactivityComponent = AnalyticsAgentactivityComponent;
//# sourceMappingURL=analytics-agentactivity.component.js.map