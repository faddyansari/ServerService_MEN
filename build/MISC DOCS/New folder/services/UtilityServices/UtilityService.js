"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UtilityService = void 0;
// Angular Imports
var core_1 = require("@angular/core");
//RxJs Imports
var Observable_1 = require("rxjs/Observable");
var UtilityService = /** @class */ (function () {
    function UtilityService(_socketService, http, _authService) {
        var _this = this;
        this._socketService = _socketService;
        this.http = http;
        this._authService = _authService;
        this.subscriptions = [];
        console.log('Utility Service!');
        this.subscriptions.push(this._socketService.getSocket().subscribe(function (socket) {
            _this.socket = socket;
        }));
        // this.subscriptions.push(this._authService.getAgentServer().subscribe(url => {
        //     this.url = url;
        // }));
        this.subscriptions.push(this._authService.getServer().subscribe(function (url) {
            _this.url = url;
        }));
        this.subscriptions.push(this._authService.RestServiceURL.subscribe(function (url) {
            _this.ticketServiceURL = url + '/api/tickets';
        }));
        this.subscriptions.push(this._authService.getAgent().subscribe(function (agent) {
            _this.agent = agent;
        }));
    }
    UtilityService.prototype.getAllAgentsListObs = function () {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socket.emit('getAllAgentsAsync', {}, function (response) {
                // console.log(response);
                if (response.status == 'ok') {
                    observer.next(response.agents);
                    observer.complete();
                }
                else {
                    observer.next([]);
                    observer.complete();
                }
            });
        });
    };
    UtilityService.prototype.getAgentsByUsername = function (nsp, username) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.http.post(_this.ticketServiceURL + '/getAgentsByUsername', { nsp: nsp, username: username }).subscribe(function (response) {
                if (response.json()) {
                    var data = response.json();
                    if (data.status == 'ok') {
                        observer.next(data.agents);
                        observer.complete();
                    }
                    else {
                        observer.next([]);
                        observer.complete();
                    }
                }
            });
        });
    };
    UtilityService.prototype.getMoreAgentsObs = function (chunk) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socket.emit('getAllAgentsAsync', { chunk: chunk }, function (response) {
                // console.log(response);
                if (response.status == 'ok') {
                    observer.next({ agents: response.agents, ended: response.ended });
                    observer.complete();
                    // this.AvailableAgents.next(this.AvailableAgents.getValue().concat(response.agents));
                    // this.agentsChunk = (response.ended) ? -1 : this.agentsChunk += 1
                    // this.loadingMoreAgents.next(false);
                }
                else {
                    observer.next({ agents: [], ended: true });
                    observer.complete();
                }
            });
        });
    };
    UtilityService.prototype.GetGroups = function () {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.http.post(_this.ticketServiceURL + '/getGroupByNSP', { email: _this.agent.email, nsp: _this.agent.nsp }).subscribe(function (response) {
                if (response.json()) {
                    var data = response.json();
                    if (data.status == 'ok') {
                        observer.next(data.group_data);
                        observer.complete();
                        // this.groupsList.next(data.group_data);
                    }
                    else {
                        observer.next([]);
                        observer.complete();
                    }
                }
            });
        });
    };
    UtilityService.prototype.getTeams = function () {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.http.post(_this.ticketServiceURL + '/getTeamsByNSP', { email: _this.agent.email, nsp: _this.agent.nsp }).subscribe(function (response) {
                // console.log(response.json());
                if (response.json()) {
                    var data = response.json();
                    if (data.status == 'ok') {
                        observer.next(data.teams);
                        observer.complete();
                        // this.groupsList.next(data.group_data);
                    }
                    else {
                        observer.next([]);
                        observer.complete();
                    }
                }
            });
        });
    };
    UtilityService.prototype.getGroupsAgainstAgent = function (email) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socket.emit('getGroupsAgainstAgent', { email: email }, function (response) {
                if (response.status == 'ok') {
                    observer.next(response.groups);
                    observer.complete();
                }
                else {
                    observer.next([]);
                    observer.complete();
                }
            });
        });
    };
    UtilityService.prototype.getAgentsAgainstGroup = function (groups) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            if (!Array.isArray(groups))
                groups = [groups];
            if (groups.length) {
                _this.http.post(_this.ticketServiceURL + '/getAgentsAgainstGroup', { nsp: _this.agent.nsp, groupList: groups }).subscribe(function (response) {
                    if (response.json()) {
                        var data = response.json();
                        if (data.status == 'ok') {
                            var agents_1 = [];
                            data.agents.forEach(function (agent) {
                                if (!agents_1.filter(function (a) { return a.email == agent.email; }).length) {
                                    agents_1.push(agent);
                                }
                            });
                            // console.log(agents);
                            observer.next(agents_1);
                            observer.complete();
                        }
                        else {
                            observer.next([]);
                            observer.complete();
                        }
                        ;
                    }
                });
            }
            else {
                _this.http.post(_this.ticketServiceURL + '/getAgentsAgainstUser', { nsp: _this.agent.nsp, email: _this.agent.email }).subscribe(function (response) {
                    if (response.json()) {
                        var data = response.json();
                        if (data.status == 'ok') {
                            var agents_2 = [];
                            data.agents.forEach(function (agent) {
                                if (!agents_2.filter(function (a) { return a.email == agent.email; }).length) {
                                    agents_2.push(agent);
                                }
                            });
                            // console.log(agents);
                            observer.next(agents_2);
                            observer.complete();
                        }
                        else {
                            observer.next([]);
                            observer.complete();
                        }
                        ;
                    }
                });
                // observer.next([]);
                // observer.complete();
            }
        });
    };
    UtilityService.prototype.SearchAgent = function (keyword, chunk) {
        if (chunk === void 0) { chunk = '0'; }
        console.log('Searching agent on server...');
        return this.http.post(this.url + '/agent/searchAgents/', {
            keyword: keyword,
            nsp: this.agent.nsp,
            chunk: chunk
        })
            .map(function (response) {
            return response.json();
        })
            .catch(function (err) {
            return Observable_1.Observable.throw(err);
        });
    };
    UtilityService.prototype.GetMediaType = function (filename) {
        // console.log(value);
        // console.log(value.filename);
        // console.group(value.path)
        if (filename) {
            var extension = filename.split('.')[1];
            switch (extension.toLowerCase()) {
                case 'png':
                case 'jpeg':
                case 'jpg':
                case 'bmp':
                case 'svg':
                case 'gif':
                    return '1';
                case 'mp3':
                case 'webm':
                    return '2';
                case 'mp4':
                case 'm4a':
                case 'm4v':
                case 'f4v':
                case 'm4b':
                case 'f4b':
                case 'mov':
                    return '3';
                case 'pdf':
                case 'xlsx':
                case 'docx':
                case 'doc':
                case 'txt':
                case 'csv':
                    return '4';
                default:
                    return '4';
            }
        }
        else
            return '4';
    };
    UtilityService.prototype.Destroy = function () {
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
    };
    UtilityService = __decorate([
        core_1.Injectable()
    ], UtilityService);
    return UtilityService;
}());
exports.UtilityService = UtilityService;
//# sourceMappingURL=UtilityService.js.map