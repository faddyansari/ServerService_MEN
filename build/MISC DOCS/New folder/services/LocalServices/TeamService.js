"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamService = void 0;
var core_1 = require("@angular/core");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var Observable_1 = require("rxjs/Observable");
var toast_notifications_component_1 = require("../../app/dialogs/SnackBar-Dialog/toast-notifications.component");
var TeamService = /** @class */ (function () {
    function TeamService(_authService, _socket, http, snackBar) {
        var _this = this;
        this.http = http;
        this.snackBar = snackBar;
        this.subscriptions = [];
        this.Teams = new BehaviorSubject_1.BehaviorSubject([]);
        this.selectedTeam = new BehaviorSubject_1.BehaviorSubject(undefined);
        this.ticketServiceURL = '';
        _authService.RestServiceURL.subscribe(function (url) {
            _this.ticketServiceURL = url + '/api/tickets';
        });
        _authService.getAgent().subscribe(function (data) {
            _this.Agent = data;
        });
        this.subscriptions.push(_socket.getSocket().subscribe(function (socket) {
            if (socket) {
                _this.socket = socket;
                _this.getTeams();
            }
        }));
    }
    TeamService.prototype.getTeams = function () {
        var _this = this;
        this.socket.emit('getTeams', {}, function (response) {
            if (response.status == 'ok') {
                _this.Teams.next(response.teams);
            }
        });
    };
    TeamService.prototype.insertTeam = function (team) {
        var _this = this;
        // return new Observable((observer) => {
        //     this.socket.emit('insertTeam', { team: team }, (response) => {
        //         if (response.status == 'ok') {
        //             this.Teams.getValue().push(response.team);
        //             this.Teams.next(this.Teams.getValue());
        //             this.showNotification('Team added successfully!', 'ok', 'success');
        //         } else {
        //             this.showNotification('Error!', 'warning', 'error');
        //         }
        //         observer.next({ status: response.status });
        //         observer.complete();
        //     })
        // })
        return new Observable_1.Observable(function (observer) {
            _this.http.post(_this.ticketServiceURL + '/insertTeam', { team: team, nsp: _this.Agent.nsp }).subscribe(function (response) {
                if (response.json()) {
                    var data = response.json();
                    if (data.status == 'ok') {
                        _this.Teams.getValue().push(data.team);
                        _this.Teams.next(_this.Teams.getValue());
                        _this.showNotification('Team added successfully!', 'ok', 'success');
                    }
                    else {
                        _this.showNotification(data.status, 'warning', 'error');
                    }
                    observer.next({ status: data.status });
                    observer.complete();
                }
                // console.log(response.json())
            });
        });
    };
    TeamService.prototype.deleteTeam = function (id) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socket.emit('deleteTeam', { id: id }, function (response) {
                // console.log(response);
                if (response.status == 'ok') {
                    _this.Teams.next(response.teams);
                    if (_this.Teams.getValue().length)
                        _this.selectedTeam.next(_this.Teams.getValue()[_this.Teams.getValue().length - 1]);
                    else
                        _this.selectedTeam.next(undefined);
                    _this.showNotification('Team deleted successfully!', 'ok', 'success');
                }
                else {
                    _this.showNotification('Error!', 'warning', 'error');
                }
                observer.next({ status: response.status });
                observer.complete();
            });
        });
    };
    TeamService.prototype.setSelectedTeam = function (id) {
        var _this = this;
        // console.log(id);
        if (id) {
            this.Teams.getValue().map(function (team) {
                if (team._id == id) {
                    _this.selectedTeam.next(team);
                    return;
                }
            });
        }
        else {
            this.selectedTeam.next(undefined);
        }
    };
    TeamService.prototype.addAgentsForTeam = function (id, emails) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socket.emit('addAgentsforTeam', { id: id, emails: emails }, function (response) {
                // console.log(response);
                if (response.status == 'ok') {
                    _this.selectedTeam.getValue().agents = response.addedAgents;
                    _this.selectedTeam.next(_this.selectedTeam.getValue());
                }
                observer.next({ status: response.status });
                observer.complete();
            });
        });
    };
    TeamService.prototype.removeAgentsForTeam = function (id, email) {
        var _this = this;
        this.socket.emit('removeAgentForTeam', { id: id, email: email }, function (response) {
            // console.log(response);
            if (response.status == 'ok') {
                _this.selectedTeam.getValue().agents = response.agents;
                _this.selectedTeam.next(_this.selectedTeam.getValue());
            }
        });
    };
    TeamService.prototype.ToggleExclude = function (team_name, email, value) {
        this.socket.emit('toggleExcludeForTeam', { team_name: team_name, email: email, value: value }, function (response) {
            // console.log(response);
        });
    };
    TeamService.prototype.editTeam = function (_id, team) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socket.emit('updateTeam', { _id: _id, team: team }, function (response) {
                if (response.status == 'ok') {
                    _this.Teams.getValue().map(function (t) {
                        if (t._id == _id) {
                            t.team_name = team.team_name;
                            t.desc = team.desc;
                        }
                        return t;
                    });
                    _this.Teams.next(_this.Teams.getValue());
                }
                else {
                    console.log(response);
                }
                observer.next(response.status);
                observer.complete();
            });
        });
    };
    TeamService.prototype.showNotification = function (msg, icon, type) {
        var notification = {
            msg: msg,
            type: type,
            img: icon
        };
        this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
            data: {
                img: notification.img,
                msg: notification.msg
            },
            duration: 2000,
            panelClass: ['user-alert', (notification.type == 'success') ? 'success' : 'error']
        }).dismiss;
    };
    TeamService = __decorate([
        core_1.Injectable()
    ], TeamService);
    return TeamService;
}());
exports.TeamService = TeamService;
//# sourceMappingURL=TeamService.js.map