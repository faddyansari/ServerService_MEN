"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Visitorservice = void 0;
var core_1 = require("@angular/core");
//RxJs Imsports
var Observable_1 = require("rxjs/Observable");
var Subject_1 = require("rxjs/Subject");
require("rxjs/add/operator/map");
require("rxjs/add/operator/filter");
require("rxjs/add/operator/auditTime");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var http_1 = require("@angular/http");
var Visitorservice = /** @class */ (function () {
    function Visitorservice(_socket, _notificationService, _authService, http) {
        var _this = this;
        this._socket = _socket;
        this._notificationService = _notificationService;
        this._authService = _authService;
        this.http = http;
        this.visitorServiceURL = '';
        this.workerSupported = false;
        this.visitorList = new BehaviorSubject_1.BehaviorSubject([]);
        this.LeftVisitorsList = new BehaviorSubject_1.BehaviorSubject([]);
        this.visitorsMap = new BehaviorSubject_1.BehaviorSubject({});
        this.selectedVisitor = new BehaviorSubject_1.BehaviorSubject(undefined);
        this.bannedVisitors = new BehaviorSubject_1.BehaviorSubject([]);
        this.archiveURI = new BehaviorSubject_1.BehaviorSubject('');
        this.timer = Observable_1.Observable.interval(4500);
        this.updateEvent = new BehaviorSubject_1.BehaviorSubject({});
        // Visitor Counts
        this.browsingVisitorsCount = new BehaviorSubject_1.BehaviorSubject(0);
        this.chattingVisitorsCount = new BehaviorSubject_1.BehaviorSubject(0);
        this.queuedVisitorsCount = new BehaviorSubject_1.BehaviorSubject(0);
        this.invitedVisitorsCount = new BehaviorSubject_1.BehaviorSubject(0);
        this.inactiveVisitorsCount = new BehaviorSubject_1.BehaviorSubject(0);
        this.leftVisitorsCount = new BehaviorSubject_1.BehaviorSubject(0);
        this.totalVisitors = new BehaviorSubject_1.BehaviorSubject(0);
        this.pageState = new BehaviorSubject_1.BehaviorSubject('browsing');
        this.notification = new BehaviorSubject_1.BehaviorSubject('');
        this.action = new Subject_1.Subject();
        this.engagementSettings = new BehaviorSubject_1.BehaviorSubject({});
        this.performingAction = new BehaviorSubject_1.BehaviorSubject({});
        this.GetVisitorsLogUpdated = new BehaviorSubject_1.BehaviorSubject({});
        //Loader Variables
        this.loading = new BehaviorSubject_1.BehaviorSubject(true);
        this.VisitorLogs = new BehaviorSubject_1.BehaviorSubject([]);
        this.visitorsFetched = false;
        this.chatServiceURL = '';
        // this.InitializeWorker();
        this.updateEvent.auditTime(4000).subscribe(function (data) {
            // console.log('Updating Event : ', data);
            // let temp = JSON.parse(JSON.stringify(data));
            if (!Object.keys(data).length)
                return;
            if (_this.visitorsFetched) {
                Object.keys(data).map(function (value) {
                    switch (data[value].action) {
                        case 'updateUser':
                            var temp_1 = [];
                            var found_1 = false;
                            // console.log('Session : ', data);
                            _this.visitorList.next(_this.visitorList.getValue().filter(function (item) {
                                if (item.id == data[value].id) {
                                    found_1 = true;
                                    _this.unsetState(item);
                                    _this.setState(data[value].session);
                                }
                                return item.id != data[value].id;
                            }));
                            if (found_1)
                                _this.visitorList.next(__spreadArrays([data[value].session], _this.visitorList.getValue()));
                            delete _this.updateEvent.getValue()[value];
                            break;
                        case 'removeUser':
                            _this.visitorList.next(_this.visitorList.getValue().filter(function (item) {
                                if (item.id == data[value].sid) {
                                    _this.unsetState(item);
                                    delete _this.visitorsMap.getValue()[data[value].sid];
                                    _this.visitorsMap.next(_this.visitorsMap.getValue());
                                    _this.MoveToLeftVisitors(item);
                                }
                                ;
                                return item.id != data[value].sid;
                            }));
                            if (_this.selectedVisitor.getValue() && _this.selectedVisitor.getValue()._id == data[value].sid)
                                _this.selectedVisitor.next(undefined);
                            delete _this.updateEvent.getValue()[value];
                            break;
                        case 'newUser':
                            //Setting Count Based on State
                            // console.log('New User');
                            _this.setState(data[value].visitor.session);
                            var temp_2 = _this.visitorList.getValue().map(function (value) { return value; });
                            // console.log('equivalency Service : ', this.visitorList.getValue() === temp)
                            _this.visitorList.next(__spreadArrays([data[value].visitor.session], _this.visitorList.getValue()));
                            delete _this.updateEvent.getValue()[value];
                            break;
                    }
                });
                //         this.unsetState(item);
                // console.log('Temp :', temp_1);
                // if (this.worker) this.worker.postMessage({ action: 'updateUser', visitorList: this.visitorList.getValue(), data: temp });
            }
        });
        _authService.getSettings().subscribe(function (data) { if (data && data.permissions) {
            _this.permissions = data.permissions;
        } });
        this._authService.RestServiceURL.subscribe(function (url) { _this.visitorServiceURL = url + '/api/visitor'; });
        this._authService.archiveURL.subscribe(function (url) { _this.archiveURI.next(url); });
        this._authService.getAgent().subscribe(function (agent) { _this.Agent = agent; });
        _authService.RestServiceURL.subscribe(function (url) {
            _this.chatServiceURL = url + '/api/chats';
        });
        // console.log('Visitor Service Initialized');
        _socket.getSocket().subscribe(function (data) {
            if (data) {
                _this.socket = data;
                if (_this.permissions && (_this.permissions.visitors.enabled || _this.permissions.chats.enabled)) {
                    if (!_this.visitorsFetched) {
                        _this.GetVisitorList();
                        _this.GetLeftVisitors();
                        _this.GetBannedVisitors();
                    }
                    _this.socket.on('newUser', function (visitor) {
                        //Adding to Visitor Array
                        visitor.session.id = visitor.id;
                        var currentDate = Date.parse(new Date().toISOString()) - Date.parse(new Date(visitor.session.creationDate).toISOString());
                        visitor.session.seconds = Math.floor((currentDate / 1000) % 60);
                        visitor.session.minutes = Math.floor((currentDate / 1000 / 60) % 60);
                        visitor.session.hours = Math.floor((currentDate / 1000) / 60 / 60);
                        _this.visitorsMap.getValue()[visitor.id] = visitor.session;
                        _this.visitorsMap.next(_this.visitorsMap.getValue());
                        var eventID = visitor.id + Date.parse(new Date().toISOString());
                        _this.updateEvent.getValue()[eventID] = { action: 'newUser', id: data.id, visitor: visitor };
                        _this.updateEvent.next(_this.updateEvent.getValue());
                    });
                    _this.socket.on('removeBannedVisitor', function (data) {
                        _this.RemoveBannedVisitorFormList(data.deviceID);
                    });
                    _this.socket.on('removeUser', function (sessionId) {
                        // console.log('removeUser  ');
                        var eventID = sessionId + Date.parse(new Date().toISOString());
                        _this.updateEvent.getValue()[eventID] = { action: 'removeUser', id: data.id, sid: sessionId };
                        _this.updateEvent.next(_this.updateEvent.getValue());
                        //console.log(this.visitorList);
                    });
                    _this.socket.on('updateUser', function (data) {
                        // console.log('UpdateUser');
                        setTimeout(function () {
                            var temp = [];
                            if (data && data.id && data.session) {
                                var currentDate = Date.parse(new Date().toISOString()) - Date.parse(new Date(data.session.creationDate).toISOString());
                                data.session.seconds = Math.floor((currentDate / 1000) % 60);
                                data.session.minutes = Math.floor((currentDate / 1000 / 60) % 60);
                                data.session.hours = Math.floor(currentDate / 1000 / 60 / 60);
                                data.session.id = data.id;
                                var logs = void 0;
                                if (_this.visitorsMap.getValue()[data.id] && _this.visitorsMap.getValue()[data.id].logsFetched && _this.visitorsMap.getValue()[data.id].logs) {
                                    logs = _this.visitorsMap.getValue()[data.id].logs;
                                    data.session.logsFetched = true;
                                    data.session.logs = logs;
                                }
                                /**
                                * @Work : Update Visitor HASHMAP
                                */
                                _this.visitorsMap.getValue()[data.session.id] = data.session;
                                _this.visitorsMap.next(_this.visitorsMap.getValue());
                            }
                            /**
                            * @Work : Generate Window Notification
                            */
                            if (data.session.state && data.session.state == 2 && !data.session.inactive) {
                                var notif = [];
                                notif.push({
                                    "tag": data.session._id + data.session.state,
                                    'title': 'Visitor Unassigned',
                                    'alertContent': data.session.username + " is now Unassigned",
                                    'icon': "../assets/img/favicon.ico",
                                    'url': "/visitors/"
                                });
                                _this._notificationService.generateNotification(notif);
                            }
                            /**
                            * @WORK_IF_NOT_WORKER_SUPPORTED : Update Visitor_ARRAY_List Same Thread
                            * @WORK_IF_WORKER_SUPPORTED : Update Visitor_ARRAY_List On Worker
                            */
                            // this.worker.postMessage({ action: 'updateUser', visitorList: this.visitorList.getValue(), data: data })
                            /**
                            * @Key = data.id + DatetimeStamp
                            */
                            var eventID = (data.id || data._id || data.session._id || data.session.id) + Date.parse(new Date().toISOString());
                            //this.updateEvent.next({ eventID: { visitorList: this.visitorList.getValue(), data: data } });
                            _this.updateEvent.getValue()[eventID] = { action: 'updateUser', id: data.id, session: data.session };
                            _this.updateEvent.next(_this.updateEvent.getValue());
                            //console.log(this.updateEvent.getValue());
                            //#region OLD_TECHNIQUE
                            // temp = this.visitorList.getValue().filter((item) => {
                            //     if (item.id == data.id) {
                            //         this.unsetState(item);
                            //         this.setState(data.session);
                            //     };
                            //     return item.id != data.id;
                            // });
                            // temp.unshift(data.session);
                            //#endregion
                            /**
                             * @Work : UPDATE_SELECTED_VISITOR
                             */
                            if (_this.selectedVisitor.getValue() && _this.selectedVisitor.getValue().id == data.session.id) {
                                if (_this.selectedVisitor.getValue().state != data.session.state)
                                    _this.selectedVisitor.next(undefined);
                                else
                                    _this.selectedVisitor.next(_this.visitorsMap.getValue()[data.session.id]);
                            }
                        });
                    });
                    _this.socket.on('updateAdditionalData', function (data) {
                        // console.log('updateAdditionalData');
                        // console.log(data);
                    });
                }
                // this.socket.emit('VisitorList');
                // this.socket.on('visitorEventLog', (data) => {
                //#region OLD_Code
                //     var session = this.visitorsMap.getValue()[data.sessionid];
                //     if (session && session.logsFetched && session.logs.length > 0) {
                //         // session.logs.push(data);
                //         this.visitorList.next(this.visitorList.getValue().map(visitor => {
                //             if (data.sessionid == visitor._id) {
                //                 visitor.logs.push(data);
                //                 this.visitorsMap.getValue()[data.sessionid] = visitor;
                //                 if (this.selectedVisitor.getValue() && (this.selectedVisitor.getValue()._id == data.sessionid)) this.selectedVisitor.next(visitor);
                //             }
                //             return visitor;
                //         }));
                //         this.visitorsMap.next(this.visitorsMap.getValue());
                //     }
                // });
                //#region Updating on Rooms Changed
                // this.socket.on('updateVisitorList', (visitors) => {
                //     let newVisitors = Object.keys(visitors).map((key) => {
                //         //Visitor Type Count
                //         this.setState(visitors[key]);
                //         //Assigning Session Id to Visitor Object
                //         visitors[key].id = key;
                //         //Time Difference Logic
                //         //Calculate Time Offest To Synchronize Server Time With GMT accordingly
                //         //Following Code Will Convert The Server Time to Local Zone
                //         //(Date.parse(new Date(visitors[key].creationDate).toUTCString()) - new Date().getTimezoneOffset() * 60 * 1000)
                //         // let currentDate = Date.parse(new Date().toUTCString()) - (Date.parse(new Date(visitors[key].creationDate).toUTCString()) - new Date().getTimezoneOffset() * 60 * 1000);
                //         // console.log(new Date(visitors[key].creationDate));
                //         // console.log(visitors[key])
                //         if (!visitors[key].creationDate) {
                //             visitors[key].creationDate = new Date().toISOString();
                //         }
                //         let currentDate = Date.parse(new Date().toISOString()) - Date.parse(new Date(visitors[key].creationDate).toISOString());
                //         visitors[key].seconds = Math.floor((currentDate / 1000) % 60);
                //         visitors[key].minutes = Math.floor((currentDate / 1000) / 60 % 60);
                //         visitors[key].hours = Math.floor((currentDate / 1000) / 60 / 60);
                //         // console.log(visitors[key].seconds);
                //         // console.log(visitors[key].minutes);
                //         // console.log(visitors[key].hours);
                //         return visitors[key];
                //     });
                //     this.visitorList.next(this.visitorList.getValue().concat(newVisitors));
                //     this.visitorsMap.next(Object.assign(this.visitorsMap.getValue(), visitors));
                //     //Total Value for DashBoard Component
                //     this.totalVisitors.next(this.visitorList.getValue().length);
                // });
                //#endregion
                // this.socket.on('VisitorList', (visitors) => {
                //     // console.log('Getting Visitor List : ', visitors);
                //     let visitorsMap = {};
                //     this.visitorList.next(visitors.map(visitor => {
                //         //Visitor Type Count
                //         this.setState(visitor);
                //         //Assigning Session Id to Visitor Object
                //         visitor.id = visitor._id;
                //         //Time Difference Logic
                //         //Calculate Time Offest To Synchronize Server Time With GMT accordingly
                //         //Following Code Will Convert The Server Time to Local Zone
                //         //(Date.parse(new Date(visitors[key].creationDate).toUTCString()) - new Date().getTimezoneOffset() * 60 * 1000)
                //         // let currentDate = Date.parse(new Date().toUTCString()) - (Date.parse(new Date(visitors[key].creationDate).toUTCString()) - new Date().getTimezoneOffset() * 60 * 1000);
                //         // console.log(new Date(visitors[key].creationDate));
                //         // console.log(visitors[key])
                //         if (!visitor.creationDate) {
                //             visitor.creationDate = new Date().toISOString();
                //         }
                //         let currentDate = Date.parse(new Date().toISOString()) - Date.parse(new Date(visitor.creationDate).toISOString());
                //         visitor.seconds = Math.floor((currentDate / 1000) % 60);
                //         visitor.minutes = Math.floor((currentDate / 1000) / 60 % 60);
                //         visitor.hours = Math.floor((currentDate / 1000) / 60 / 60);
                //         // console.log(visitors[key].seconds);
                //         // console.log(visitors[key].minutes);
                //         // console.log(visitors[key].hours);
                //         visitorsMap[visitor._id] = visitor;
                //         return visitor;
                //     }));
                //     //console.log('All Visitors');
                //     //console.log(visitors);
                //     this.visitorsMap.next(visitorsMap);
                //     //Total Value for DashBoard Component
                //     this.totalVisitors.next(this.visitorList.getValue().length);
                //     this.loading.next(false);
                // });
                // this.socket.on('FilterVisitorList', (data) => {
                //     //console.log('Filter Visitor List');
                //     this.visitorList.next(this.visitorList.getValue().filter((item) => {
                //         if (item.location == data.location) {
                //             this.unsetState(item);
                //             delete this.visitorsMap.getValue()[item.id];
                //             this.visitorsMap.next(this.visitorsMap.getValue());
                //         };
                //         return item.location != data.location;
                //     }));
                //     this.visitorsMap.next(this.visitorsMap.getValue());
                //     //Total Value for DashBoard Component
                //     this.totalVisitors.next(this.visitorList.getValue().length);
                // });
                // this.socket.on('RefreshVisitorList', (visitors) => {
                //     //console.log('Refresh Visitor List');
                //     this.visitorList.next(Object.keys(visitors).map((key) => {
                //         //Visitor Type Count
                //         this.setState(visitors[key]);
                //         //Assigning Session Id to Visitor Object
                //         visitors[key].id = key;
                //         //Time Difference Logic
                //         //Calculate Time Offest To Synchronize Server Time With GMT accordingly
                //         //Following Code Will Convert The Server Time to Local Zone
                //         //(Date.parse(new Date(visitors[key].creationDate).toUTCString()) - new Date().getTimezoneOffset() * 60 * 1000)
                //         // let currentDate = Date.parse(new Date().toUTCString()) - (Date.parse(new Date(visitors[key].creationDate).toUTCString()) - new Date().getTimezoneOffset() * 60 * 1000);
                //         // console.log(new Date(visitors[key].creationDate));
                //         // console.log(visitors[key])
                //         if (!visitors[key].creationDate) {
                //             visitors[key].creationDate = new Date().toISOString();
                //         }
                //         let currentDate = Date.parse(new Date().toISOString()) - Date.parse(new Date(visitors[key].creationDate).toISOString());
                //         visitors[key].seconds = Math.floor((currentDate / 1000) % 60);
                //         visitors[key].minutes = Math.floor((currentDate / 1000) / 60 % 60);
                //         visitors[key].hours = Math.floor((currentDate / 1000) / 60 / 60);
                //         // console.log(visitors[key].seconds);
                //         // console.log(visitors[key].minutes);
                //         // console.log(visitors[key].hours);
                //         return visitors[key];
                //     }));
                //     //console.log('All Visitors');
                //     //console.log(visitors);
                //     this.visitorsMap.next(visitors);
                //     //Total Value for DashBoard Component
                //     this.totalVisitors.next(this.visitorList.getValue().length);
                //     this.loading.next(false);
                // });
                //#endregion
            }
        });
    }
    //#region WebworkerRegion
    // private InitializeWorker() {
    //     try {
    //         if (typeof Worker !== 'undefined') {
    //             // Create a new
    //             console.log('Initializing Worker')
    //             this.worker = new Worker('../workers/worker_visitor.js');
    //             this.workerSupported = true;
    //             this.worker.onmessage = ({ data }) => {
    //                 switch (data.action) {
    //                     case 'updateUser':
    //                         this.visitorList.next(data.visitorList);
    //                         data.unsetItems.map((item, index) => { this.unsetState(item); this.setState(data.newItems[index]); })
    //                         break;
    //                 }
    //             };
    //             // this.worker.postMessage('hello');
    //         }
    //     } catch (error) {
    //         console.log(error);
    //         this.workerSupported = false;
    //     }
    // }
    //#endregion
    Visitorservice.prototype.getLoadingVisitors = function () {
        return this.loading.asObservable();
    };
    Visitorservice.prototype.setLoadingVisitors = function (value) {
        this.loading.next(value);
    };
    Visitorservice.prototype.getSelectedVisitor = function () {
        return this.selectedVisitor.asObservable();
    };
    Visitorservice.prototype.setSelectedVisitor = function (id, left) {
        var _this = this;
        if (left) {
            var visitor = this.LeftVisitorsList.getValue().filter(function (a) {
                if (a._id == id)
                    _this.selectedVisitor.next(a);
            });
        }
        else
            this.selectedVisitor.next(this.visitorsMap.getValue()[id]);
    };
    Visitorservice.prototype.GetVisitorsList = function () {
        return this.visitorList.asObservable();
    };
    Visitorservice.prototype.getLeftVisitors = function () {
        return this.LeftVisitorsList.asObservable();
    };
    Visitorservice.prototype.getBannedVisitors = function () {
        return this.bannedVisitors.asObservable();
    };
    Visitorservice.prototype.getVisitorsMap = function () {
        return this.visitorsMap.asObservable();
    };
    Visitorservice.prototype.BrowsingVisitorsCount = function () {
        return this.browsingVisitorsCount.asObservable();
    };
    Visitorservice.prototype.ChattingVisitorsCount = function () {
        return this.chattingVisitorsCount.asObservable();
    };
    Visitorservice.prototype.QueuedVisitorsCount = function () {
        return this.queuedVisitorsCount.asObservable();
    };
    Visitorservice.prototype.InvitedVisitorsCount = function () {
        return this.invitedVisitorsCount.asObservable();
    };
    Visitorservice.prototype.InactiveVisitorsCount = function () {
        return this.inactiveVisitorsCount.asObservable();
    };
    Visitorservice.prototype.LeftVisitorsCount = function () {
        return this.leftVisitorsCount.asObservable();
    };
    Visitorservice.prototype.TotalVisitorsCount = function () {
        return this.totalVisitors.asObservable();
    };
    Visitorservice.prototype.getPageState = function () {
        return this.pageState.asObservable();
    };
    Visitorservice.prototype.changeState = function (state) {
        this.pageState.next(state);
        this.selectedVisitor.next(undefined);
    };
    Visitorservice.prototype.MoveToLeftVisitors = function (visitor) {
        this.LeftVisitorsList.getValue().unshift(visitor);
        if (this.LeftVisitorsList.getValue().length > 30)
            this.LeftVisitorsList.next(this.LeftVisitorsList.getValue().slice(0, 30));
        else
            this.LeftVisitorsList.next(this.LeftVisitorsList.getValue());
        this.leftVisitorsCount.next(this.LeftVisitorsList.getValue().length);
    };
    Visitorservice.prototype.setState = function (visitor) {
        if ((visitor.state == 1 || visitor.state == 8) && !visitor.inactive) {
            this.browsingVisitorsCount.next(this.browsingVisitorsCount.getValue() + 1);
        }
        else if (visitor.state == 2 && !visitor.inactive) {
            this.queuedVisitorsCount.next(this.queuedVisitorsCount.getValue() + 1);
        }
        else if (visitor.state == 3 && !visitor.inactive) {
            this.chattingVisitorsCount.next(this.chattingVisitorsCount.getValue() + 1);
        }
        else if (((visitor.state == 4) || (visitor.state == 5)) && !visitor.inactive) { // Invitied Visitors In Progress
            this.invitedVisitorsCount.next(this.invitedVisitorsCount.getValue() + 1);
        }
        else if (visitor.inactive) {
            this.inactiveVisitorsCount.next(this.inactiveVisitorsCount.getValue() + 1);
        } /**else if (visitor.inactive) {
             this.leftVisitorsCount.next(this.leftVisitorsCount.getValue() + 1);
         }
         */
        //Total Count For DashBoard Component
        this.totalVisitors.next(this.chattingVisitorsCount.getValue() + this.browsingVisitorsCount.getValue() + this.queuedVisitorsCount.getValue());
    };
    Visitorservice.prototype.unsetState = function (visitor) {
        if ((visitor.state == 1 || visitor.state == 8) && !visitor.inactive) {
            this.browsingVisitorsCount.next(this.browsingVisitorsCount.getValue() - 1);
        }
        else if (visitor.state == 2 && !visitor.inactive) {
            this.queuedVisitorsCount.next(this.queuedVisitorsCount.getValue() - 1);
        }
        else if (visitor.state == 3 && !visitor.inactive) {
            this.chattingVisitorsCount.next(this.chattingVisitorsCount.getValue() - 1);
        }
        else if (((visitor.state == 4) || (visitor.state == 5)) && !visitor.inactive) { // Invitied Visitors In Progress
            this.invitedVisitorsCount.next(this.invitedVisitorsCount.getValue() - 1);
        }
        else if (visitor.inactive) { // State Need to Be Added Proper Funcionality (iNACTIVE sTATE)
            this.inactiveVisitorsCount.next(this.inactiveVisitorsCount.getValue() - 1);
        } /**else if (visitor.state == 7) { // Stated Need To Be Added With Proper Funcionality (lEFT vISITORS)
             this.leftVisitorsCount.next(this.leftVisitorsCount.getValue() - 1);
         } */
        //Total Count For DashBoardComponent
        this.totalVisitors.next(this.chattingVisitorsCount.getValue() + this.browsingVisitorsCount.getValue() + this.queuedVisitorsCount.getValue());
    };
    Visitorservice.prototype.RequestQueue = function (visitorid) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.performingAction.getValue()[visitorid] = true;
            _this.performingAction.next(_this.performingAction.getValue());
            try {
                _this.socket.emit('requestQueue', { sid: visitorid }, function (data) {
                    if (data.status == 'notAllowed') {
                        _this.notification.next({
                            msg: 'You are not allowed to request Unassigned Visitors',
                            type: 'warning',
                            img: 'warning'
                        });
                        _this.performingAction.getValue()[visitorid] = false;
                        _this.performingAction.next(_this.performingAction.getValue());
                        observer.next(true);
                        observer.complete();
                    }
                    else {
                        _this.performingAction.getValue()[visitorid] = false;
                        _this.performingAction.next(_this.performingAction.getValue());
                        observer.next(false);
                        observer.complete();
                    }
                    //console.log(data);
                });
            }
            catch (error) {
                console.log(error);
                observer.next(false);
                observer.complete();
            }
        });
    };
    Visitorservice.prototype.RequestQueueRest = function (visitorid) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.performingAction.getValue()[visitorid] = true;
            _this.performingAction.next(_this.performingAction.getValue());
            try {
                _this.http.post(_this.chatServiceURL + '/requestQueue', { sessionid: _this.Agent.csid, sid: visitorid, nsp: _this.Agent.nsp }).subscribe(function (response) {
                    if (response.json()) {
                        var data = response.json();
                        if (data.status == 'notAllowed') {
                            _this.notification.next({
                                msg: 'You are not allowed to request Unassigned Visitors',
                                type: 'warning',
                                img: 'warning'
                            });
                            _this.performingAction.getValue()[visitorid] = false;
                            _this.performingAction.next(_this.performingAction.getValue());
                            observer.next(true);
                            observer.complete();
                        }
                        else {
                            _this.performingAction.getValue()[visitorid] = false;
                            _this.performingAction.next(_this.performingAction.getValue());
                            observer.next(false);
                            observer.complete();
                        }
                        //console.log(data);
                    }
                });
            }
            catch (error) {
                console.log(error);
                observer.next(false);
                observer.complete();
            }
        });
    };
    Visitorservice.prototype.InitiateChat = function (visitorid) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.performingAction.getValue()[visitorid] = true;
            _this.performingAction.next(_this.performingAction.getValue());
            _this.socket.emit('initiateChat', { sid: visitorid }, function (data) {
                //console.log(data);
                _this.performingAction.getValue()[visitorid] = false;
                _this.performingAction.next(_this.performingAction.getValue());
                observer.next(data);
                observer.complete();
                if (data.status == 'engaged') {
                    _this.notification.next({
                        msg: 'Visitor is Already Engaged by Another Agent',
                        type: 'warning',
                        img: 'warning'
                    });
                }
                else if (data.status == 'slotsFull') {
                    _this.notification.next({
                        msg: 'Max Chat Limit Reached. Can Not Initiate Chat Right Now!',
                        type: 'error',
                        img: 'warning'
                    });
                }
                else if (data.status == 'notAllowed') {
                    _this.notification.next({
                        msg: 'Manaul Engagement is Not Allowed. Please Contact Your Admin',
                        type: 'error',
                        img: 'warning'
                    });
                }
                else if (data.status == 'inactive') {
                    _this.notification.next({
                        msg: 'Visitor Went Inactive.',
                        type: 'error',
                        img: 'warning'
                    });
                }
                else if (data.status == 'error') {
                    _this.notification.next({
                        msg: "Can't Initiate Chat . Something went Wrong",
                        type: 'error',
                        img: 'warning'
                    });
                }
            });
        });
    };
    Visitorservice.prototype.SuperViseChat = function (visitor) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.performingAction.getValue()[visitor._id] = true;
            _this.performingAction.next(_this.performingAction.getValue());
            _this.socket.emit('superviseChat', { cid: visitor.conversationID, sid: visitor._id }, function (data) {
                if (data && data.status == 'ok') {
                    _this.performingAction.getValue()[visitor._id] = false;
                    _this.performingAction.next(_this.performingAction.getValue());
                    observer.next(data);
                    observer.complete();
                }
                else {
                    _this.performingAction.getValue()[visitor._id] = false;
                    _this.performingAction.next(_this.performingAction.getValue());
                    observer.next(false);
                    observer.complete();
                }
            });
        });
    };
    Visitorservice.prototype.EndSuperVisesChat = function (cid, removeChat) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socket.emit('endSupervisedChat', { cid: cid, removeChat: removeChat }, function (data) {
                if (data && data.status == 'ok') {
                    observer.next(data);
                    observer.complete();
                }
                else {
                    observer.next(false);
                    observer.complete();
                }
            });
        });
    };
    Visitorservice.prototype.EndSuperVisesChatRest = function (cid, removeChat) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.http.post(_this.chatServiceURL + '/endSupervisedChat', { cid: cid, removeChat: removeChat }).subscribe(function (response) {
                if (response.json()) {
                    var data = response.json();
                    if (data && data.status == 'ok') {
                        observer.next(data);
                        observer.complete();
                    }
                    else {
                        observer.next(false);
                        observer.complete();
                    }
                }
            });
        });
    };
    Visitorservice.prototype.getNotification = function () {
        return this.notification.asObservable();
    };
    Visitorservice.prototype.setNotification = function (msg, type, icon) {
        var item = {
            msg: msg,
            type: type,
            img: icon
        };
        this.notification.next(icon);
    };
    Visitorservice.prototype.performChildAction = function (action) {
        this.action.next(action);
    };
    Visitorservice.prototype.getAction = function () {
        return this.action.asObservable();
    };
    Visitorservice.prototype.Destroy = function () {
        //console.log(this.visitorList);
    };
    Visitorservice.prototype.GetVisitorLogs = function (visitorid, _id) {
        if (_id === void 0) { _id = ''; }
        var urlSearchParams = new http_1.URLSearchParams('', new http_1.QueryEncoder());
        urlSearchParams.append('sid', visitorid);
        if (_id)
            urlSearchParams.append('_id', _id);
        return this.http.post(this.archiveURI.getValue() + ((_id) ? "moreeventlogs" : "eventlogs"), urlSearchParams)
            .map(function (response) {
            // console.log(response);
            // let data = JSON.parse((response as any)._body);
            // console.log(data);
            // console.log(response.json());
            // console.log((response as any)._body)
            return response.json();
        })
            .catch(function (err) { console.log(err); return Observable_1.Observable.throw(err); });
        //return Observable.of([])
        //#region Socket Code
        // return new Observable((observer) => {
        //     this.socket.emit('getLogs', { sid: visitorid }, (data) => {
        //         if (data) {
        //             // var logs = this.transformVisitorsLog(data.logs);
        //             //console.log(data);
        //             observer.next(data.logs)
        //         }
        //         else observer.error(true);
        //     });
        // });
        //#endregion
    };
    Visitorservice.prototype.GetVisitorsLogsUpdated = function () {
        return this.VisitorLogs.asObservable();
    };
    Visitorservice.prototype.UpdateVisitor = function (data) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.visitorsMap.getValue()[data.id] = data;
            _this.visitorList.getValue().map(function (visitor) {
                if (visitor._id == data.sessionid) {
                    visitor = data;
                }
            });
            _this.visitorList.next(_this.visitorList.getValue());
            _this.visitorsMap.next(_this.visitorsMap.getValue());
            _this.setSelectedVisitor(data.id);
            observer.next(true);
        });
        //this.setSelectedVisitor(data.id);
        // this.visitorsMap.getValue().map((visitor) => {
        //     if (visitor._id == data._id) {
        //         console.log(visitor)
        //         visitor = data;
        //         console.log(visitor)
        //     }
        // });
        // this.visitorsMap.next(this.visitorsMap.getValue())
        // console.log(this.visitorsMap)
    };
    Visitorservice.prototype.transformVisitorsLog = function (log) {
        var Visitorlogarr = [];
        var Visitorlogsingular;
        Visitorlogarr = log;
        if (Visitorlogarr.length > 0) {
            Visitorlogarr = Visitorlogarr.reduce(function (previous, current) {
                if (!previous[new Date(current.time_stamp).toDateString()]) {
                    previous[new Date(current.time_stamp).toDateString()] = [current];
                }
                else {
                    previous[new Date(current.time_stamp).toDateString()].push(current);
                }
                return previous;
            }, {});
        }
        Visitorlogsingular = Object.keys(Visitorlogarr).map(function (key) {
            return { date: key, groupedvisitorlogList: Visitorlogarr[key] };
        }).sort(function (a, b) {
            if (new Date(a.date) > new Date(b.date))
                return -1;
            else if (new Date(a.date) < new Date(b.date))
                return 1;
            else
                0;
        });
        Visitorlogsingular.forEach(function (element) {
            element.groupedvisitorlogList.sort(function (a, b) {
                if (new Date(a.time_stamp) > new Date(b.time_stamp))
                    return -1;
                else if (new Date(a.time_stamp) < new Date(b.time_stamp))
                    return 1;
                else
                    0;
            });
        });
        return Visitorlogsingular;
    };
    // public setVisitorsLogsUpdated(): Observable<any> {
    //     return this.VisitorLogs.asObservable();
    // }
    Visitorservice.prototype.GetLeftVisitors = function () {
        // this.socket.emit('getLeftVisitors', {}, (response) => {
        //     if (response.status == 'ok') {
        //         // console.log(response.leftVisitors);
        //         // console.log(response.leftVisitors.length)
        //         this.LeftVisitorsList.next(response.leftVisitors);
        //         this.leftVisitorsCount.next(response.leftVisitors.length)
        //     }
        // });
        var _this = this;
        this.http.post(this.visitorServiceURL + '/getLeftVisitors', { nsp: this.Agent.nsp }).subscribe(function (response) {
            if (response.json()) {
                var data = response.json();
                if (data.status == 'ok') {
                    // console.log(response.leftVisitors);
                    // console.log(response.leftVisitors.length)
                    _this.LeftVisitorsList.next(data.leftVisitors);
                    _this.leftVisitorsCount.next(data.leftVisitors.length);
                }
            }
        });
    };
    Visitorservice.prototype.GetVisitorList = function () {
        var _this = this;
        this.http.post(this.visitorServiceURL + '/visitorList', { nsp: this.Agent.nsp, email: this.Agent.email }).subscribe(function (response) {
            if (response.json()) {
                var visitors = response.json();
                var visitorsMap_1 = {};
                _this.visitorList.next(visitors.map(function (visitor) {
                    //Visitor Type Count
                    _this.setState(visitor);
                    //Assigning Session Id to Visitor Object
                    visitor.id = visitor._id;
                    //Time Difference Logic
                    //Calculate Time Offest To Synchronize Server Time With GMT accordingly
                    //Following Code Will Convert The Server Time to Local Zone
                    //(Date.parse(new Date(visitors[key].creationDate).toUTCString()) - new Date().getTimezoneOffset() * 60 * 1000)
                    // let currentDate = Date.parse(new Date().toUTCString()) - (Date.parse(new Date(visitors[key].creationDate).toUTCString()) - new Date().getTimezoneOffset() * 60 * 1000);
                    // console.log(new Date(visitors[key].creationDate));
                    // console.log(visitors[key])
                    if (!visitor.creationDate) {
                        visitor.creationDate = new Date().toISOString();
                    }
                    var currentDate = Date.parse(new Date().toISOString()) - Date.parse(new Date(visitor.creationDate).toISOString());
                    visitor.seconds = Math.floor((currentDate / 1000) % 60);
                    visitor.minutes = Math.floor((currentDate / 1000) / 60 % 60);
                    visitor.hours = Math.floor((currentDate / 1000) / 60 / 60);
                    // console.log(visitors[key].seconds);
                    // console.log(visitors[key].minutes);
                    // console.log(visitors[key].hours);
                    visitorsMap_1[visitor._id] = visitor;
                    return visitor;
                }));
                //console.log('All Visitors');
                //console.log(visitors);
                _this.visitorsMap.next(visitorsMap_1);
                //Total Value for DashBoard Component
                _this.totalVisitors.next(_this.visitorList.getValue().length);
                _this.loading.next(false);
                _this.visitorsFetched = true;
            }
        }, function (err) {
            _this.loading.next(false);
            _this.visitorsFetched = true;
        });
    };
    Visitorservice.prototype.GetBannedVisitors = function () {
        // this.socket.emit('getBannedVisitors', {}, (response) => {
        var _this = this;
        //     // console.log(response);
        //     if (response.status == 'ok') {
        //         this.bannedVisitors.next(response.bannedVisitorList);
        //     }
        // });
        this.http.post(this.visitorServiceURL + '/getBannedVisitors', { nsp: this.Agent.nsp }).subscribe(function (response) {
            if (response.json()) {
                var data = response.json();
                if (data.status == 'ok') {
                    _this.bannedVisitors.next(data.bannedVisitorList);
                }
            }
        });
    };
    Visitorservice.prototype.RemoveBannedVisitorFormList = function (deviceID) {
        this.bannedVisitors.next(this.bannedVisitors.getValue().filter(function (visitor) { return visitor.deviceID != deviceID; }));
    };
    Visitorservice.prototype.SelectVisitor = function (value) {
        var _this = this;
        console.log('Set Selected Visitor Service');
        var hash = 0;
        this.visitorList.getValue().map(function (visitor, index) {
            if (visitor._id == _this.selectedVisitor.getValue()._id) {
                hash = (value == 'next') ? (index + 1) : (index - 1);
            }
        });
        if (hash >= 0) {
            if (this.visitorList.getValue()[hash]) {
                this.setSelectedVisitor(this.visitorList.getValue()[hash].id);
            }
        }
    };
    Visitorservice.prototype.ComputeHeavyOperation = function (data) {
        console.log('Data', data);
        console.log('Worker Thread');
    };
    Visitorservice.prototype.UpdateBannedVisitor = function (visitor) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            if (visitor) {
                if (_this.selectedVisitor.getValue()) {
                    if (_this.selectedVisitor.getValue().deviceID == visitor.deviceID) {
                        _this.selectedVisitor.next({});
                    }
                }
                _this.bannedVisitors.getValue().filter(function (data) {
                    return (visitor._id != data._id && visitor.deviceID != data.deviceID);
                });
                _this.bannedVisitors.next(_this.bannedVisitors.getValue().concat(visitor));
            }
            observer.next(true);
            observer.complete();
        });
    };
    Visitorservice = __decorate([
        core_1.Injectable()
    ], Visitorservice);
    return Visitorservice;
}());
exports.Visitorservice = Visitorservice;
//# sourceMappingURL=VisitorService.js.map