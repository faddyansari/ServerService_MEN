"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SurveyService = void 0;
var core_1 = require("@angular/core");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var Observable_1 = require("rxjs/Observable");
var toast_notifications_component_1 = require("../../app/dialogs/SnackBar-Dialog/toast-notifications.component");
var SurveyService = /** @class */ (function () {
    function SurveyService(_socket, _authService, _notificationService, snackbar) {
        var _this = this;
        this._notificationService = _notificationService;
        this.snackbar = snackbar;
        this.AddSurvey = new BehaviorSubject_1.BehaviorSubject(false);
        this.DefaultJSON = new BehaviorSubject_1.BehaviorSubject([{
                name: 'Extremely satisfied',
                ForRadio: ['2', '3', '5', '7'],
                color: "#3c763d"
            },
            {
                name: 'Mostly satisfied',
                ForRadio: ['5', '7'],
                color: "#368763"
            },
            {
                name: 'Slightly satisfied',
                ForRadio: ['7'],
                color: "#52ba5b"
            },
            {
                name: 'Neither satisfied nor dissatisfied',
                ForRadio: ['3', '5', '7'],
                color: "#f7b555"
            },
            {
                name: 'Slightly dissatisfied',
                ForRadio: ['7'],
                color: "#ff681f"
            },
            {
                name: 'Mostly dissatisfied',
                ForRadio: ['5', '7'],
                color: "#e55353"
            },
            {
                name: 'Extremely dissatisfied',
                ForRadio: ['2', '3', '5', '7'],
                color: "#d64646"
            }]);
        this.Agent = undefined;
        this.selectedSurvey = new BehaviorSubject_1.BehaviorSubject(undefined);
        this.AllSurveys = new BehaviorSubject_1.BehaviorSubject([]);
        this.ActivatedSurvey = new BehaviorSubject_1.BehaviorSubject([]);
        if (this._notificationService.permission == 'default' || 'denied') {
            this._notificationService.requestPermission();
        }
        _socket.getSocket().subscribe(function (data) {
            if (data) {
                _this.socket = data;
                _this.getAllSurveys();
            }
        });
        _authService.getAgent().subscribe(function (data) {
            if (data) {
                _this.Agent = data;
            }
        });
    }
    SurveyService.prototype.toggleActivation = function (id, flag) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socket.emit('activateSurvey', { fid: id, activated: flag }, function (response) {
                if (response.status == 'ok') {
                    _this.snackbar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                        data: {
                            img: 'ok',
                            msg: 'Survey Activated/De-activated Successfully!'
                        },
                        duration: 2000,
                        panelClass: ['user-alert', 'success']
                    });
                    var index = _this.AllSurveys.getValue().findIndex(function (a) { return a._id == id; });
                    _this.AllSurveys.getValue()[index].activated = response.surveyUpdated.activated;
                    _this.AllSurveys.getValue()[index].lastModified = response.lastModified;
                    _this.AllSurveys.next(_this.AllSurveys.getValue());
                    observer.next({ status: 'ok' });
                    observer.complete();
                }
                else {
                    _this.snackbar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                        data: {
                            img: 'warning',
                            msg: 'Error in activating/de-activating survey, Please Try again!'
                        },
                        duration: 2000,
                        panelClass: ['user-alert', 'error']
                    });
                    observer.next({ status: 'error' });
                    observer.complete();
                }
            });
        });
    };
    SurveyService.prototype.CheckIfSurveyIsInTicket = function (_id) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socket.emit('checkInTicket', { id: _id }, function (response) {
                if (response.status == 'ok') {
                    observer.next({ exists: true });
                    observer.complete();
                }
                else {
                    observer.next({ exists: false });
                    observer.complete();
                }
            });
        });
    };
    // demoEmail(){
    //     this.socket.emit('demo', (response) => {
    //         console.log(response);
    //     });
    // }
    //CRUD OF SURVEY
    SurveyService.prototype.addSurvey = function (obj) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socket.emit('addSurvey', { surveyObj: obj }, function (response) {
                if (response.status == 'ok') {
                    // console.log(this.AllSurveys.getValue());
                    _this.AllSurveys.getValue().unshift(response.surveyInserted);
                    _this.AllSurveys.next(_this.AllSurveys.getValue());
                    _this.snackbar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                        data: {
                            img: 'ok',
                            msg: 'Survey added Successfully!'
                        },
                        duration: 2000,
                        panelClass: ['user-alert', 'success']
                    });
                    _this.AddSurvey.next(false);
                    observer.next({ status: 'ok', survey: response.surveyInserted });
                    observer.complete();
                }
                else {
                    _this.snackbar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                        data: {
                            img: 'warning',
                            msg: 'Error in adding survey, Please Try again!'
                        },
                        duration: 2000,
                        panelClass: ['user-alert', 'error']
                    });
                    observer.next({ status: 'error' });
                    observer.complete();
                }
            });
        });
    };
    SurveyService.prototype.getAllSurveys = function () {
        var _this = this;
        this.socket.emit('getSurveysByNSP', {}, function (response) {
            if (response.status == 'ok') {
                _this.AllSurveys.next(response.surveys);
            }
            else {
                _this.AllSurveys.next([]);
            }
        });
    };
    SurveyService.prototype.getActivatedSurvey = function () {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socket.emit('getActivatedSurvey', {}, function (response) {
                if (response.status == 'ok') {
                    observer.next({ status: 'ok', survey: response.survey });
                    observer.complete();
                }
                else {
                    observer.next({ status: 'error' });
                    observer.complete();
                }
            });
        });
    };
    SurveyService.prototype.deleteSurvey = function (id) {
        var _this = this;
        this.socket.emit('deleteSurvey', { id: id }, function (response) {
            if (response.status == 'ok') {
                var index = _this.AllSurveys.getValue().findIndex(function (obj) { return obj._id == id; });
                _this.AllSurveys.getValue().splice(index, 1);
                _this.getAllSurveys();
                _this.snackbar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: 'Survey Deleted Successfully!'
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'success']
                });
            }
            else {
                _this.snackbar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: 'Erroe in deleting survey,Please Try again!'
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'success']
                });
            }
        });
    };
    SurveyService.prototype.updateSurvey = function (fid, obj) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socket.emit('updateSurvey', { fid: fid, updatedSurvey: obj }, function (response) {
                if (response.status == 'ok') {
                    // console.log(response);
                    _this.snackbar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                        data: {
                            img: 'ok',
                            msg: 'Survey Updated Successfully!'
                        },
                        duration: 2000,
                        panelClass: ['user-alert', 'success']
                    });
                    var index = _this.AllSurveys.getValue().findIndex(function (a) { return a._id == fid; });
                    _this.AllSurveys.getValue()[index] = response.surveyUpdated;
                    _this.AddSurvey.next(false);
                    _this.selectedSurvey.next(undefined);
                    observer.next({ status: 'ok', survey: response.surveyUpdated });
                    observer.complete();
                }
                else {
                    _this.snackbar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                        data: {
                            img: 'warning',
                            msg: 'Error in updating survey, Please Try again!'
                        },
                        duration: 2000,
                        panelClass: ['user-alert', 'error']
                    });
                    observer.next({ status: 'error' });
                    observer.complete();
                }
            });
        });
    };
    SurveyService = __decorate([
        core_1.Injectable()
    ], SurveyService);
    return SurveyService;
}());
exports.SurveyService = SurveyService;
//# sourceMappingURL=SurveyService.js.map