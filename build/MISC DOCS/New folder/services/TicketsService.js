"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketsService = void 0;
var core_1 = require("@angular/core");
//RxJs Imsports
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/operator/map");
require("rxjs/add/operator/filter");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var Subject_1 = require("rxjs/Subject");
var json2excel = require('js2excel').json2excel;
var TicketsService = /** @class */ (function () {
    function TicketsService(_socket, _authService, _agentService, _ticketautomationservice, http, _globalApplicationStateService, _notificationService, _router) {
        var _this = this;
        this._authService = _authService;
        this._agentService = _agentService;
        this._ticketautomationservice = _ticketautomationservice;
        this.http = http;
        this._globalApplicationStateService = _globalApplicationStateService;
        this._notificationService = _notificationService;
        this._router = _router;
        /**
         * @Data
            OPEN : ARRAY<any>
            PENDING : ARRAY<any>
            SOLVED : ARray<any>
        **/
        this.ticketServiceURL = '';
        this.ThreadList = new BehaviorSubject_1.BehaviorSubject([]);
        // public newTickets: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
        this.Filters = new BehaviorSubject_1.BehaviorSubject({});
        this.PaginationCount = new BehaviorSubject_1.BehaviorSubject(0);
        this.TicketCount = new BehaviorSubject_1.BehaviorSubject([]);
        this.IncomingEmails = new BehaviorSubject_1.BehaviorSubject([]);
        this.IncomingEmailsByNSP = new BehaviorSubject_1.BehaviorSubject([]);
        this.groupsList = new BehaviorSubject_1.BehaviorSubject(undefined);
        this.EmailData = new BehaviorSubject_1.BehaviorSubject([]);
        this.Initialized = new BehaviorSubject_1.BehaviorSubject(false);
        this.checkedList = new BehaviorSubject_1.BehaviorSubject([]);
        this.selectedThread = new BehaviorSubject_1.BehaviorSubject({});
        this.notification = new BehaviorSubject_1.BehaviorSubject('');
        this.activeChatStateCount = new BehaviorSubject_1.BehaviorSubject(undefined);
        this.arr = [];
        this.tempArr = [];
        this.reducedTicketLog = [];
        // all_agent = [];
        this.ticketChunk = 0;
        this.show = false;
        this.updated = new Boolean(false);
        //Loading Variables
        this.loadingTickets = new BehaviorSubject_1.BehaviorSubject(true);
        this.loadingMoreTickets = new BehaviorSubject_1.BehaviorSubject(false);
        this.getloadingCount = new BehaviorSubject_1.BehaviorSubject(true);
        this.loading = new BehaviorSubject_1.BehaviorSubject(false);
        this.end = new BehaviorSubject_1.BehaviorSubject(false);
        this.isTicketViewLoaded = new BehaviorSubject_1.BehaviorSubject(false);
        this.showListUponTypeClick = new BehaviorSubject_1.BehaviorSubject(false);
        this.showFilterArea = new BehaviorSubject_1.BehaviorSubject(true);
        this.ActualTicketFetchedCount = new BehaviorSubject_1.BehaviorSubject(0);
        //for email templates
        this.signList = new BehaviorSubject_1.BehaviorSubject([]);
        this.GroupData = new BehaviorSubject_1.BehaviorSubject([]);
        this.headerSearch = new Subject_1.Subject();
        this.activationLoading = new BehaviorSubject_1.BehaviorSubject(false);
        // console.log('Ticket Service Init');
        //watching if notification is blocked by user, then ask again, but chrome doesn't allow it.
        // console.log(this.getFiltersFromLocalStorage());
        if (this.getFiltersFromLocalStorage()) {
            this.Filters.next(this.getFiltersFromLocalStorage());
        }
        _authService.RestServiceURL.subscribe(function (url) {
            _this.ticketServiceURL = url + '/api/tickets';
        });
        if (this._notificationService.permission == 'default' || 'denied') {
            this._notificationService.requestPermission();
        }
        this._authService.getSettings().subscribe(function (settings) {
            _this.ticketPermissions = settings.permissions.tickets;
        });
        this._agentService.GetWindowNotificationSettings().subscribe(function (settings) {
            if (settings && settings.windowNotifications) {
                _this.notifPermissions = settings.windowNotifications;
            }
        });
        this._authService.getAgent().subscribe(function (agent) {
            _this.Agent = agent;
        });
        this._authService.getServer().subscribe(function (url) {
            _this.url = url;
        });
        this._ticketautomationservice.Groups.subscribe(function (group) {
            // console.log(group);
            _this.group = group;
        });
        _socket.getSocket().subscribe(function (data) {
            if (data) {
                _this.socket = data;
                if (!_this.Initialized.getValue()) {
                    // this.GetGroups();
                    _this.GetSignatures();
                    _this.getIncomingEmailsByNsp();
                }
                _this.Filters.debounceTime(1500).subscribe(function (filter) {
                    //console.log('Filter in Ticket List', filter);
                    if (!_this.Initialized.getValue()) {
                        // if(this.Agent && this.Agent.nsp != '/sbtjapan.com') this.GetTicketCount(filter);
                        _this.InitializeTicketList(filter, false);
                    }
                    else {
                        if (JSON.stringify(filter) == _this.lastResponse && !filter.reload) {
                            _this.loadingTickets.next(false);
                            _this.loading.next(false);
                            return;
                        }
                        else {
                            // console.log('Reload');
                            _this.lastResponse = JSON.stringify(filter);
                            // if(this.Agent && this.Agent.nsp != '/sbtjapan.com') this.GetTicketCount(filter);
                            _this.InitializeTicketList(filter, true);
                        }
                    }
                });
                // this.getSurveyResult(this.selectedThread.getValue()._id);
                _this.socket.on('newTicket', function (data) {
                    // console.log('New Ticket', data);
                    /**
                    * @Note To Avoid Double Update ignore this event when agent is Admin and Assigned Person at the same time.
                    *
                    */
                    if (data.ignoreAdmin)
                        return;
                    data.ticket.synced = false;
                    data.ticket.messages = [];
                    data.ticket.ticketlog = (data.ticket.ticketlog && data.ticket.ticketlog.length) ? _this.transformTicketLog(data.ticket.ticketlog) : [];
                    if (!_this.ThreadList.getValue().some(function (t) { return t._id == data.ticket._id; })) {
                        _this.ThreadList.getValue().unshift(data.ticket);
                        _this.ThreadList.next(_this.ThreadList.getValue());
                        _this.AddTicketCount(data.ticket);
                        // this.newTickets.getValue().push(data.ticket);
                        // this.newTickets.next(this.newTickets.getValue());
                        //Ticket Notification
                        if (_this.notifPermissions && _this.notifPermissions.newTicket) {
                            var notif_data = [];
                            notif_data.push({
                                'tag': data.ticket._id + 'new',
                                'title': 'You have recieved a new ticket!',
                                'alertContent': data.ticket.subject,
                                'icon': "../assets/img/favicon.ico",
                                'url': "/tickets/ticket-view/" + data.ticket._id
                            });
                            _this._notificationService.generateNotification(notif_data);
                        }
                    }
                });
                /**
                 *  @Data : { tid: data.tid, status: result.value.state }
                 */
                _this.socket.on('removeTicket', function (data) {
                    //console.log('Remove Ticket');
                    //console.log(data);
                    if ((_this.Agent.role == 'admin' || _this.Agent.role == 'superadmin') || (_this.ticketPermissions.canView == 'all'))
                        return;
                    if (data.email == _this.Agent.email)
                        return;
                    // console.log('Removing');
                    _this.SubstractTicketCount(data.ticket);
                    _this.ThreadList.next(_this.ThreadList.getValue().filter(function (thread) {
                        return (thread._id != data.tid);
                    }));
                    if (_this.selectedThread.getValue() && _this.selectedThread.getValue()._id == data.tid) {
                        // this.selectedThread.next(undefined);
                        _this._globalApplicationStateService.NavigateForce('/tickets/list');
                    }
                });
                /**
                 * @Data { tid: data.tid, ticket: result.value.state, ticketlog: result.value.ticketlog ,ignoreAdmin : boolean}
                 */
                _this.socket.on('updateTicket', function (data) {
                    //('Update ticket');
                    /**
                     * @Note To Avoid Double Update ignore this event when agent is Admin and Assigned Person at the same time.
                     *
                     */
                    if ((_this.Agent.role == 'admin' || _this.Agent.role == 'superadmin') && data.ignoreAdmin)
                        return;
                    /**
                    * @Note This Function Refresh The List and Change The position of the ticket to the top
                    */
                    _this.UpdateTicket(data.tid, data.ticket);
                });
                /**
                 * @Note
                 * Exclude Fields That are not the part of <TicketSchema> OR loaded lazily  for eg.
                 * 1. messages <Array<messagesSchema>
                 * 2. synced : Boolean
                 */
                _this.socket.on('updateTicketProperty', function (data) {
                    // console.log('Update ticket property');
                    // console.log(data);
                    /**
                    *
                    * @Note This Function Change The properties of thread but doesn't change the position of the ticket to the top
                    *
                    */
                    if (data.ignoreAdmin)
                        return;
                    _this.UpdateTicketProperty((!Array.isArray(data.tid)) ? [data.tid] : data.tid, data.ticket);
                });
                _this.socket.on('gotNewTicketMessage', function (data) {
                    // console.log("gotNewTicketMessage", data);
                    if (data.ticket.tid && data.ticket.tid.length) {
                        var found_1 = undefined;
                        _this.ThreadList.next(_this.ThreadList.getValue().filter(function (thread) {
                            if (thread._id != data.ticket.tid[0])
                                return true;
                            found_1 = JSON.parse(JSON.stringify(thread));
                        }));
                        if (found_1) {
                            found_1.viewState = data.viewState;
                            found_1.state = data.state;
                            /**
                           * @Work
                           *  1. Check if Updated Thread synced?
                           *  2. If Not Sycned Then Do Nothing Becuse It will fetch messages automatically when Loaded into view.
                           *  3. If Synced Then Push to its Message Array w.r.t Date Key/Value
                           *  4. Update ThreadList
                           */
                            if (found_1.synced) {
                                var messagefound_1 = false;
                                found_1.messages = found_1.messages.map(function (message) {
                                    if (message.date == new Date(data.ticket.datetime).toDateString()) {
                                        message.groupedMessagesList.push(data.ticket);
                                        // console.log("message.groupedMessagesList", message.groupedMessagesList);
                                        messagefound_1 = true;
                                    }
                                    return message;
                                });
                                if (!messagefound_1) {
                                    found_1.messages.push({
                                        date: new Date(data.ticket.datetime).toDateString(),
                                        groupedMessagesList: [data.ticket]
                                    });
                                }
                            }
                            _this.ThreadList.getValue().unshift(found_1);
                            if (_this.selectedThread.getValue() && _this.selectedThread.getValue()._id == found_1._id) {
                                _this.selectedThread.next(found_1);
                            }
                        }
                        if (!found_1) {
                            /**
                             * @Work
                             * 1. Get From Server
                             * 2. Prepend To ThreadList
                             * 3. Update Thread List
                             */
                            // console.log("here");
                            // console.log(data.ticket.tid);
                            _this.socket.emit('getTicketByID', { tid: data.ticket.tid }, function (response) {
                                // console.log(response);
                                _this.ThreadList.getValue().unshift(response.thread);
                                _this.ThreadList.next(_this.ThreadList.getValue());
                            });
                        }
                        else
                            _this.ThreadList.next(_this.ThreadList.getValue());
                        // console.log("permisssion for messgae", this.notifPermissions.ticketMessage);
                        if (_this.notifPermissions && _this.notifPermissions.ticketMessage) {
                            var notif_data = [];
                            notif_data.push({
                                'tag': data.ticket.tid + data.ticket._id,
                                'title': 'You have recieved a new message!',
                                'alertContent': 'From: ' + data.ticket.from,
                                'icon': "../assets/img/favicon.ico",
                                'url': "/tickets/ticket-view/" + data.ticket.tid
                            });
                            _this._notificationService.generateNotification(notif_data);
                        }
                    }
                });
                _this.socket.on('newFBTicket', function (data) {
                    data.ticket.synced = false;
                    _this.ThreadList.getValue().push(data.ticket);
                    _this.ThreadList.next(_this.ThreadList.getValue());
                    // this.updateViewState(data.viewState, data.tid);
                });
            }
        });
    }
    TicketsService.prototype.updateGroup = function (ids, updatedGroup, previousGroup) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            //REST CALL
            _this.http.post(_this.ticketServiceURL + '/changeGroup', { ids: ids, group: updatedGroup, previousGroup: previousGroup, email: _this.Agent.email, nsp: _this.Agent.nsp }).subscribe(function (res) {
                if (res.json()) {
                    var response_1 = res.json();
                    if (response_1.status == 'ok') {
                        var found_2 = false;
                        _this.ThreadList.next(_this.ThreadList.getValue().map(function (thread) {
                            ids.map(function (tid) {
                                if (tid == thread._id) {
                                    var logfound_1 = false;
                                    found_2 = true;
                                    thread.group = updatedGroup;
                                    thread.ticketlog = thread.ticketlog.map(function (log) {
                                        if (log.date == new Date(response_1.ticketlog.time_stamp).toDateString()) {
                                            log.groupedticketlogList.unshift(response_1.ticketlog);
                                            logfound_1 = true;
                                        }
                                        return log;
                                    });
                                    if (!logfound_1) {
                                        thread.ticketlog.unshift({
                                            date: new Date(response_1.ticketlog.time_stamp).toDateString(),
                                            groupedticketlogList: [response_1.ticketlog]
                                        });
                                    }
                                    _this.selectedThread.next(thread);
                                }
                            });
                            return thread;
                        }));
                        if (found_2) {
                            _this.notification.next({ msg: 'Group "' + updatedGroup + '" assigned successfully', type: 'success', img: 'ok' });
                            observer.next(response_1.status);
                            observer.complete();
                        }
                    }
                    else {
                        _this.notification.next({ msg: "Can't assign group", type: 'error', img: 'warning' });
                        observer.complete();
                    }
                }
            });
            //SOCKET
            // this.socket.emit('changeGroup', { ids: ids, group: updatedGroup, previousGroup: previousGroup }, (response) => {
            //     if (response.status == 'ok') {
            //         let msg = '';
            //         let found = false;
            //         this.ThreadList.next(this.ThreadList.getValue().map(thread => {
            //             ids.map(tid => {
            //                 if (tid == thread._id) {
            //                     let logfound = false;
            //                     found = true;
            //                     thread.group = updatedGroup;
            //                     thread.ticketlog = thread.ticketlog.map(log => {
            //                         if (log.date == new Date(response.ticketlog.time_stamp).toDateString()) {
            //                             log.groupedticketlogList.unshift(response.ticketlog);
            //                             logfound = true;
            //                         }
            //                         return log;
            //                     });
            //                     if (!logfound) {
            //                         thread.ticketlog.unshift({
            //                             date: new Date(response.ticketlog.time_stamp).toDateString(),
            //                             groupedticketlogList: [response.ticketlog]
            //                         })
            //                     }
            //                     msg += 'Ticket #' + thread.clientID + ' Assigned To ' + updatedGroup + ' Successfully<br>';
            //                     this.selectedThread.next(thread);
            //                 }
            //             })
            //             return thread;
            //         }));
            //         if (found) {
            //             this.notification.next({ msg: 'Group "' + updatedGroup + '" assigned successfully', type: 'success', img: 'ok' });
            //             observer.next(response.status);
            //             observer.complete();
            //         }
            //     } else {
            //         this.notification.next({ msg: "Can't assign group", type: 'error', img: 'warning' });
            //         observer.complete();
            //     }
            // });
        });
    };
    TicketsService.prototype.updatePriority = function (ids, updatedPriority) {
        var _this = this;
        //REST CALL
        this.http.post(this.ticketServiceURL + '/changeTicketPriority', { ids: ids, priority: updatedPriority, email: this.Agent.email, nsp: this.Agent.nsp }).subscribe(function (res) {
            if (res.json()) {
                var response_2 = res.json();
                if (response_2.status == 'ok') {
                    var found_3 = false;
                    _this.ThreadList.next(_this.ThreadList.getValue().map(function (thread) {
                        ids.map(function (tid) {
                            if (thread._id == tid) {
                                var logfound_2 = false;
                                found_3 = true;
                                thread.priority = updatedPriority;
                                thread.ticketlog = thread.ticketlog.map(function (log) {
                                    if (log.date == new Date(response_2.ticketlog.time_stamp).toDateString()) {
                                        log.groupedticketlogList.unshift(response_2.ticketlog);
                                        logfound_2 = true;
                                    }
                                    return log;
                                });
                                if (!logfound_2) {
                                    thread.ticketlog.unshift({
                                        date: new Date(response_2.ticketlog.time_stamp).toDateString(),
                                        groupedticketlogList: [response_2.ticketlog]
                                    });
                                }
                                _this.selectedThread.next(thread);
                                _this.notification.next({
                                    msg: "Priority of Ticket changed to " + updatedPriority + " successfully!",
                                    type: 'success',
                                    img: 'ok'
                                });
                            }
                        });
                        return thread;
                    }));
                }
                else {
                    _this.notification.next({
                        msg: "Can't change priority",
                        type: 'error',
                        img: 'warning'
                    });
                }
            }
        }, function (err) {
            _this.notification.next({
                msg: "Can't change priority",
                type: 'error',
                img: 'warning'
            });
        });
        //SOCKET
        // this.socket.emit('changeTicketPriority', { ids: ids, priority: updatedPriority }, (response) => {
        //     if (response.status == 'ok') {
        //         let found = false;
        //         this.ThreadList.next(this.ThreadList.getValue().map(thread => {
        //             ids.map(tid => {
        //                 if (thread._id == tid) {
        //                     let logfound = false;
        //                     found = true;
        //                     thread.priority = updatedPriority;
        //                     thread.ticketlog = thread.ticketlog.map(log => {
        //                         if (log.date == new Date(response.ticketlog.time_stamp).toDateString()) {
        //                             log.groupedticketlogList.unshift(response.ticketlog);
        //                             logfound = true;
        //                         }
        //                         return log;
        //                     });
        //                     if (!logfound) {
        //                         thread.ticketlog.unshift({
        //                             date: new Date(response.ticketlog.time_stamp).toDateString(),
        //                             groupedticketlogList: [response.ticketlog]
        //                         })
        //                     }
        //                     this.selectedThread.next(thread);
        //                 }
        //             });
        //             return thread;
        //         }));
        //         if (found) {
        //             this.notification.next({
        //                 msg: "Priority of Ticket changed to " + updatedPriority + " successfully!",
        //                 type: 'success',
        //                 img: 'ok'
        //             });
        //         }
        //         else {
        //             this.notification.next({
        //                 msg: "Can't change priority",
        //                 type: 'error',
        //                 img: 'warning'
        //             });
        //         }
        //     }
        // });
    };
    TicketsService.prototype.InsertNewTicket = function (details) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            //REST CALL
            _this.http.post(_this.ticketServiceURL + '/insertNewTicket', { details: details, email: _this.Agent.email, nsp: _this.Agent.nsp }).subscribe(function (res) {
                if (res.json()) {
                    var response = res.json();
                    if (response.status == 'ok') {
                        if (response.ticket && response.ticket.group && response.ticket.assigned_to) {
                            _this._ticketautomationservice.UpdateAgentCount(response.ticket.group, response.ticket.assigned_to);
                        }
                        _this.ThreadList.getValue().unshift(response.ticket);
                        _this.ThreadList.next(_this.ThreadList.getValue());
                        observer.next(response);
                        observer.complete();
                    }
                    else {
                        observer.next({ status: "error" });
                        observer.complete();
                    }
                }
            });
            //SOCKET
            //     this.socket.emit('insertNewTicket', details, (response) => {
            //         if (response.status == 'ok') {
            //             if (response.ticket && response.ticket.group && response.ticket.assigned_to) {
            //                 this._ticketautomationservice.UpdateAgentCount(response.ticket.group, response.ticket.assigned_to);
            //             }
            //             this.ThreadList.getValue().unshift(response.ticket);
            //             this.ThreadList.next(this.ThreadList.getValue());
            //             observer.next(response);
            //             observer.complete();
            //         } else {
            //             observer.next({ status: "error" });
            //             observer.complete();
            //         }
            //     });
        });
    };
    //gets messages for ids of merged tickets.
    TicketsService.prototype.getMessagesForMergedTicket = function (tids) {
        var _this = this;
        var temp = [];
        tids.map(function (tid) {
            temp.push(tid._id);
            //Ticket Linking
            if (tid.references && tid.references.length) {
                tid.references.forEach(function (reference) {
                    temp.push(reference);
                });
            }
        });
        if (this.selectedThread.getValue() && this.selectedThread.getValue().isPrimary)
            temp.push(this.selectedThread.getValue()._id);
        return new Observable_1.Observable(function (observer) {
            _this.http.post(_this.ticketServiceURL + '/mergedmessages', { tid: temp }).subscribe(function (response) {
                if (response.json()) {
                    var data = response.json();
                    observer.next(data);
                    observer.complete();
                }
            });
        });
    };
    TicketsService.prototype.getloadingTickets = function (type) {
        // return this.loadingTickets.asObservable();
        if (type == 'TICKETS') {
            return this.loadingTickets.asObservable();
        }
        else if (type == 'MORETICKETS') {
            return this.loadingMoreTickets.asObservable();
        }
    };
    //Ticket Watchers
    TicketsService.prototype.AddWatchersToTicket = function (agents, tids) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            //REST CALL
            _this.http.post(_this.ticketServiceURL + '/addWatchers', { agents: agents, tids: tids, email: _this.Agent.email, nsp: _this.Agent.nsp }).subscribe(function (res) {
                if (res.json()) {
                    var response_3 = res.json();
                    if (response_3.status == 'ok') {
                        _this.ThreadList.next(_this.ThreadList.getValue().map(function (thread) {
                            tids.map(function (tid) {
                                if (thread._id == tid) {
                                    var logfound_3 = false;
                                    if (!thread.watchers)
                                        thread.watchers = [];
                                    thread.watchers = response_3.watchers.watchers;
                                    thread.lasttouchedTime = response_3.watchers.lasttouchedTime;
                                    thread.ticketlog = thread.ticketlog.map(function (log) {
                                        if (log.date == new Date(response_3.ticketlog.time_stamp).toDateString()) {
                                            log.groupedticketlogList.unshift(response_3.ticketlog);
                                            logfound_3 = true;
                                        }
                                        return log;
                                    });
                                    if (!logfound_3) {
                                        thread.ticketlog.unshift({
                                            date: new Date(response_3.ticketlog.time_stamp).toDateString(),
                                            groupedticketlogList: [response_3.ticketlog]
                                        });
                                    }
                                    _this.selectedThread.next(thread);
                                }
                            });
                            return thread;
                        }));
                        _this.notification.next({
                            msg: "Ticket watchers added Sucessfully!",
                            type: 'success',
                            img: 'ok'
                        });
                        observer.next({ status: "ok" });
                        observer.complete();
                    }
                    else {
                        _this.notification.next({
                            msg: "Error in adding watchers!",
                            type: 'error',
                            img: 'warning'
                        });
                    }
                }
            });
        });
    };
    TicketsService.prototype.DeleteWatcherAgent = function (agent, _id) {
        var _this = this;
        this.http.post(this.ticketServiceURL + '/deleteWatcher', { agent: agent, id: _id, email: this.Agent.email, nsp: this.Agent.nsp }).subscribe(function (res) {
            if (res.json()) {
                var response_4 = res.json();
                if (response_4.status == 'ok') {
                    _this.ThreadList.next(_this.ThreadList.getValue().map(function (thread) {
                        if (thread._id == _id) {
                            var ind = thread.watchers.findIndex(function (data) { return data == agent; });
                            thread.watchers.splice(ind, 1);
                            _this.selectedThread.next(thread);
                            _this.notification.next({
                                msg: response_4.msg,
                                type: 'success',
                                img: 'ok'
                            });
                        }
                        return thread;
                    }));
                }
                else {
                    _this.notification.next({
                        msg: response_4.msg,
                        type: 'error',
                        img: 'warning'
                    });
                }
            }
            // this.socket.emit('deleteWatcher', { agent: agent, id: _id }, (response) => {
            //     if (response.status == 'ok') {
            //         this.ThreadList.next(this.ThreadList.getValue().map(thread => {
            //             if (thread._id == _id) {
            //                 let ind = thread.watchers.findIndex(data => data == agent);
            //                 thread.watchers.splice(ind, 1);
            //                 this.selectedThread.next(thread);
            //                 this.notification.next({
            //                     msg: response.msg,
            //                     type: 'success',
            //                     img: 'ok'
            //                 });
            //             }
            //             return thread;
            //         }));
            //     }
            //     else {
            //         this.notification.next({
            //             msg: response.msg,
            //             type: 'error',
            //             img: 'warning'
            //         });
            //     }
            // });
        });
    };
    TicketsService.prototype.getTicketHistoryByEmail = function (email) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.http.post(_this.ticketServiceURL + '/getTicketHistoryEmail', { nsp: _this.Agent.nsp, email: email }).subscribe(function (resp) {
                if (resp.json()) {
                    var response = resp.json();
                    if (response.status == 'ok') {
                        observer.next(response.tickets);
                        observer.complete();
                    }
                    else {
                        _this.notification.next({
                            msg: "Error in getting ticket history!",
                            type: 'error',
                            img: 'warning'
                        });
                        observer.next([]);
                        observer.complete();
                    }
                }
                else {
                    observer.next([]);
                    observer.complete();
                }
            });
        });
    };
    TicketsService.prototype.getTicketHistory = function (email) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.http.post(_this.ticketServiceURL + '/getTicketHistory', { nsp: _this.Agent.nsp, email: email }).subscribe(function (resp) {
                if (resp.json()) {
                    var response = resp.json();
                    if (response.status == 'ok') {
                        observer.next(response.tickets);
                        observer.complete();
                    }
                    else {
                        _this.notification.next({
                            msg: "Error in getting ticket history!",
                            type: 'error',
                            img: 'warning'
                        });
                        observer.next([]);
                        observer.complete();
                    }
                }
                else {
                    observer.next([]);
                    observer.complete();
                }
            });
        });
    };
    TicketsService.prototype.getTickets = function () {
        // console.log('Get tickets observable');
        return this.ThreadList.asObservable();
    };
    TicketsService.prototype.getPagination = function () {
        return this.PaginationCount.asObservable();
    };
    TicketsService.prototype.setPagination = function (value) {
        this.PaginationCount.next(value);
    };
    TicketsService.prototype.getTicketsCount = function () {
        return this.TicketCount.asObservable();
    };
    TicketsService.prototype.getAgentAgainstWatchers = function (watcherList) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            // this.socket.emit('getAgentAgainstWatchers', { watcherList: watcherList }, (response) => {
            //     if (response.status == 'ok') {
            //         observer.next(response.agents);
            //         observer.complete();
            //     } else {
            //         observer.next([]);
            //         observer.complete();
            //     };
            // });
            _this.http.post(_this.ticketServiceURL + '/getAgentAgainstWatchers', { nsp: _this.Agent.nsp, watcherList: watcherList }).subscribe(function (response) {
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
                    ;
                }
            });
        });
    };
    TicketsService.prototype.getAgentsAgainstGroup = function (groupList) {
        var _this = this;
        // this.socket.emit('getAgentsAgainstGroup', {groupList : groupList} , (response) => {
        // console.log(groupList);
        // })
        return new Observable_1.Observable(function (observer) {
            // console.log(groupList);
            // this.socket.emit('getAgentsAgainstGroup', { groupList: groupList }, (response) => {
            //     if (response.status == 'ok') {
            //         observer.next(response.agents);
            //         observer.complete();
            //     } else {
            //         observer.next([]);
            //         observer.complete();
            //     };
            // });
            _this.http.post(_this.ticketServiceURL + '/getAgentsAgainstGroup', { nsp: _this.Agent.nsp, groupList: groupList }).subscribe(function (response) {
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
                    ;
                }
            });
        });
    };
    TicketsService.prototype.getAgentsAgainstTeams = function (teams) {
        var _this = this;
        // this.socket.emit('getAgentsAgainstGroup', {groupList : groupList} , (response) => {
        // console.log(groupList);
        // })
        return new Observable_1.Observable(function (observer) {
            // console.log(groupList);
            // this.socket.emit('getAgentsAgaintTeams', { teams: teams }, (response) => {
            //     // console.log(response);
            //     let agents = [];
            //     if (response.status == 'ok') {
            //         agents = response.agents;
            //     } else {
            //         agents = [];
            //     };
            //     observer.next(agents);
            //     observer.complete();
            // });
            _this.http.post(_this.ticketServiceURL + '/getAgentsAgaintTeams', { nsp: _this.Agent.nsp, teams: teams }).subscribe(function (response) {
                if (response.json()) {
                    var data = response.json();
                    var agents = [];
                    if (data.status == 'ok') {
                        agents = data.agents;
                    }
                    else {
                        agents = [];
                    }
                    ;
                    observer.next(agents);
                    observer.complete();
                }
            });
        });
    };
    TicketsService.prototype.getAllAgentsAgainstAdmin = function () {
        var _this = this;
        // this.socket.emit('getAgentsAgainstGroup', {groupList : groupList} , (response) => {
        //     console.log(response);
        // })
        return new Observable_1.Observable(function (observer) {
            // this.socket.emit('getAllAgentsAgainstAdmin', {}, (response) => {
            //     if (response.status == 'ok') {
            //         observer.next(response.agents);
            //         observer.complete();
            //     } else {
            //         observer.next();
            //         observer.complete();
            //     };
            // });
            _this.http.post(_this.ticketServiceURL + '/getAllAgentsAgainstAdmin', { nsp: _this.Agent.nsp, email: _this.Agent.email }).subscribe(function (response) {
                if (response.json()) {
                    var data = response.json();
                    if (data.status == 'ok') {
                        observer.next(data.agents);
                        observer.complete();
                    }
                    else {
                        observer.next();
                        observer.complete();
                    }
                    ;
                }
            });
        });
    };
    /**
     * @Response_Data :
     * Array : [ { state : string , count : number } ]
     */
    // public GetTicketCount(data: any) {
    //     this.getloadingCount.next(true);
    //     this.socket.emit('getTicketsCount', { filters: (data.filter && Object.keys(data.filter).length) ? data.filter : undefined, clause: data.clause, sortBy: data.sortBy, assignType: data.assignType, groupAssignType: data.groupAssignType, mergeType: data.mergeType, query: data.query }, (response) => {
    //         // console.log(response);
    //         if (response.status == 'ok' && response.count) {
    //             this.TicketCount.next(response.count);
    //             // console.log(response);
    //             this.getloadingCount.next(false);
    //         }
    //         else {
    //             this.TicketCount.next([]);
    //             this.getloadingCount.next(false);
    //         }
    //     });
    // }
    TicketsService.prototype.moveTicketsToDefault = function (group) {
        this.socket.emit('moveTicketsToDefault', { group: group }, function (response) {
            if (response.status == 'ok') {
            }
        });
    };
    TicketsService.prototype.GetLoadingCount = function () {
        return this.getloadingCount.asObservable();
    };
    //insert group into db.
    // public insertGroup(group) {
    //     //REST CALL
    //     this.http.post(this.ticketServiceURL + '/insertGroup', { group: group, email: this.Agent.email, nsp: this.Agent.nsp }).subscribe(res => {
    //         if (res.json()) {
    //             let response = res.json();
    //             if (response.status == 'ok') {
    //                 this.TicketCount.next(response.ticketList);
    //             }
    //             else {
    //                 this.TicketCount.next([]);
    //             }
    //         }
    //     });
    //     //SOCKET
    //     // this.socket.emit('insertGroup', { group: group }, (response) => {
    //     //     if (response.status == 'ok') {
    //     //         this.TicketCount.next(response.ticketList);
    //     //     }
    //     //     else {
    //     //         this.TicketCount.next([]);
    //     //     }
    //     // });
    // }
    TicketsService.prototype.getMessages = function (tid) {
        var _this = this;
        // console.log(tid);
        return new Observable_1.Observable(function (observer) {
            // this.socket.emit('ticketmessages', { tid: (!Array.isArray(tid)) ? [tid] : tid }, (data: Array<any>) => {
            //     // console.log(data);
            //     if (data) {
            //         if (data.length > 0) {
            //             data = data.reduce((previous, current) => {
            //                 if (!previous[new Date(current.datetime).toDateString()]) {
            //                     previous[new Date(current.datetime).toDateString()] = [current];
            //                 } else {
            //                     previous[new Date(current.datetime).toDateString()].push(current);
            //                 }
            //                 return previous;
            //             }, {});
            //         }
            //         this.selectedThread.getValue().messages = Object.keys(data).map(key => {
            //             return { date: key, groupedMessagesList: data[key] }
            //         }).sort((a, b) => {
            //             //sorts in most recent chat.
            //             if (new Date(a.date) < new Date(b.date)) return -1;
            //             else if (new Date(a.date) > new Date(b.date)) return 1;
            //             else 0;
            //         });
            //         this.selectedThread.getValue().synced = true;
            //     } else {
            //         this.selectedThread.getValue().messages = [];
            //         this.selectedThread.getValue().synced = true;
            //     }
            //     this.selectedThread.next(this.selectedThread.getValue());
            //     observer.next(data);
            //     observer.complete();
            // });
            _this.http.post(_this.ticketServiceURL + '/ticketmessages', { tid: (!Array.isArray(tid)) ? [tid] : tid }).subscribe(function (response) {
                if (response.json()) {
                    var data = response.json();
                    // this.selectedThread.next(this.selectedThread.getValue());
                    observer.next(data);
                    observer.complete();
                }
            });
        });
    };
    TicketsService.prototype.setLoadingTickets = function (value, type) {
        switch (type) {
            case 'TICKETS':
                this.loadingTickets.next(value);
                break;
            case 'MORETICKETS':
                this.loadingMoreTickets.next(value);
                break;
        }
    };
    TicketsService.prototype.GetEmailData = function (country) {
        var _this = this;
        this.socket.emit('getContactsForCompaign', { fullCountryName: country }, function (response) {
            // console.log(response);
            if (response.status == 'ok' && response.result && response.result.length) {
                _this.EmailData.next(response.result);
            }
            else {
                _this.EmailData.next([]);
            }
        });
    };
    TicketsService.prototype.SetTicketFetchingCount = function (value) {
        this.ActualTicketFetchedCount.next(value);
    };
    TicketsService.prototype.InitializeTicketList = function (data, force) {
        var _this = this;
        if (force === void 0) { force = false; }
        // this.newTickets.next([]);
        this.loadingTickets.next(true);
        this.getloadingCount.next(true);
        if (!this.Initialized.getValue() || force) {
            /**
             * @Data
             * 1. Filters : Object<{ key : [values] }>
             * 2. chunk : <string>
             */
            // this.socket.emit('getTickets', { filters: (data.filter && Object.keys(data.filter).length) ? data.filter : undefined, clause: data.clause, sortBy: data.sortBy, assignType: data.assignType, groupAssignType: data.groupAssignType, mergeType: data.mergeType, query: data.query }, (response) => {
            //     // console.log(response);
            //     if (response.status == 'ok') {
            //         this.SetTicketFetchingCount(response.tickets.length);
            //         // console.log(response.tickets);
            //         this.ThreadList.next(response.tickets.map(ticket => {
            //             ticket.synced = false;
            //             ticket.messages = [];
            //             ticket.ended = ticket.ended;
            //             ticket.ticketlog = (ticket.ticketlog && ticket.ticketlog.length) ? this.transformTicketLog(ticket.ticketlog) : [];
            //             return ticket;
            //         }));
            //         this.TicketCount.next(response.count);
            //         this.setPagination(0);
            //         this.ticketChunk = 0;
            //         this.getloadingCount.next(false);
            //         this.loadingTickets.next(false);
            //         this.loading.next(false);
            //         this.Initialized.next(true);
            //     } else {
            //         this.loadingTickets.next(false);
            //         this.loading.next(false);
            //         this.getloadingCount.next(false);
            //         this.Initialized.next(true);
            //     }
            // });
            this.http.post(this.ticketServiceURL + '/getTickets', { email: this.Agent.email, nsp: this.Agent.nsp, filters: (data.filter && Object.keys(data.filter).length) ? data.filter : undefined, clause: data.clause, sortBy: data.sortBy, assignType: data.assignType, groupAssignType: data.groupAssignType, mergeType: data.mergeType, query: data.query }).subscribe(function (response) {
                if (response.json()) {
                    var data_1 = response.json();
                    if (data_1.status == 'ok') {
                        _this.SetTicketFetchingCount(data_1.tickets.length);
                        // console.log(response.tickets);
                        _this.ThreadList.next(data_1.tickets.map(function (ticket) {
                            ticket.synced = false;
                            ticket.messages = [];
                            ticket.ended = ticket.ended;
                            ticket.ticketlog = (ticket.ticketlog && ticket.ticketlog.length) ? _this.transformTicketLog(ticket.ticketlog) : [];
                            return ticket;
                        }));
                        _this.TicketCount.next(data_1.count);
                        _this.setPagination(0);
                        _this.ticketChunk = 0;
                        _this.getloadingCount.next(false);
                        _this.loadingTickets.next(false);
                        _this.loading.next(false);
                        _this.Initialized.next(true);
                    }
                    else {
                        _this.loadingTickets.next(false);
                        _this.loading.next(false);
                        _this.getloadingCount.next(false);
                        _this.Initialized.next(true);
                    }
                }
            }, function (err) {
                _this.loadingTickets.next(false);
                _this.loading.next(false);
                _this.getloadingCount.next(false);
                _this.Initialized.next(true);
            });
        }
    };
    TicketsService.prototype.getTicketsByQuery = function (query, limit) {
        var _this = this;
        if (limit === void 0) { limit = undefined; }
        return new Observable_1.Observable(function (observer) {
            _this.http.post(_this.ticketServiceURL + '/getTickets', { email: _this.Agent.email, nsp: _this.Agent.nsp, filters: undefined, clause: '$and', query: query, limit: limit }).subscribe(function (response) {
                if (response.json()) {
                    var data = response.json();
                    if (data.status == 'ok') {
                        observer.next(data.tickets);
                        observer.complete();
                    }
                    else {
                        observer.next([]);
                        observer.complete();
                    }
                }
            }, function (err) {
                observer.next([]);
                observer.complete();
            });
        });
    };
    TicketsService.prototype.getMoreTicketFromBackend = function () {
        var _this = this;
        // console.log('Get more tickets');
        // console.log(this.ticketChunk);
        this.loadingMoreTickets.next(true);
        return new Observable_1.Observable(function (observer) {
            //(this.ticketChunk);
            if (_this.ticketChunk != -1 && _this.loadingMoreTickets.getValue()) {
                // this.socket.emit('getMoreTickets', {
                //     chunk: this.ThreadList.getValue()[this.ThreadList.getValue().length - 1][(this.Filters.getValue().sortBy && this.Filters.getValue().sortBy.name) ? this.Filters.getValue().sortBy.name : 'lasttouchedTime'],
                //     filters: this.Filters.getValue().filter,
                //     clause: this.Filters.getValue().clause,
                //     query: this.Filters.getValue().query,
                //     sortBy: this.Filters.getValue().sortBy
                // }, (response) => {
                //     if (response.status == 'ok') {
                //         // console.log(response);
                //         this.SetTicketFetchingCount(this.ActualTicketFetchedCount.getValue() + response.tick.length);
                //         this.ThreadList.next(this.ThreadList.getValue().concat(response.tick));
                //         this.ticketChunk = (response.ended) ? -1 : this.ticketChunk += 1
                //         this.loadingMoreTickets.next(false);
                //         observer.next(response);
                //         observer.complete();
                //     } else {
                //         this.loadingMoreTickets.next(false);
                //         observer.error('error in getMoretickets');
                //     }
                // });
                _this.http.post(_this.ticketServiceURL + '/getMoreTickets', {
                    nsp: _this.Agent.nsp,
                    email: _this.Agent.email,
                    chunk: _this.ThreadList.getValue()[_this.ThreadList.getValue().length - 1][(_this.Filters.getValue().sortBy && _this.Filters.getValue().sortBy.name) ? _this.Filters.getValue().sortBy.name : 'lasttouchedTime'],
                    filters: _this.Filters.getValue().filter,
                    clause: _this.Filters.getValue().clause,
                    query: _this.Filters.getValue().query,
                    sortBy: _this.Filters.getValue().sortBy
                }).subscribe(function (response) {
                    if (response.json()) {
                        var data = response.json();
                        if (data.status == 'ok') {
                            // console.log(response);
                            _this.SetTicketFetchingCount(_this.ActualTicketFetchedCount.getValue() + data.tick.length);
                            _this.ThreadList.next(_this.ThreadList.getValue().concat(data.tick));
                            _this.ticketChunk = (data.ended) ? -1 : _this.ticketChunk += 1;
                            _this.loadingMoreTickets.next(false);
                            observer.next(data);
                            observer.complete();
                        }
                        else {
                            _this.loadingMoreTickets.next(false);
                            observer.error('error in getMoretickets');
                        }
                    }
                }, function (err) {
                    observer.next(undefined);
                    observer.complete();
                    _this.loadingMoreTickets.next(false);
                });
            }
            else {
                _this.loadingMoreTickets.next(false);
            }
        });
    };
    TicketsService.prototype.getSelectedThread = function () {
        return this.selectedThread.asObservable();
    };
    TicketsService.prototype.validateSelectedThread = function () {
        return !!Object.keys(this.selectedThread.getValue()).length;
    };
    TicketsService.prototype.setSelectedThread = function (tid) {
        // console.log('Setting selected thread: ' + tid);
        var _this = this;
        if (!tid) {
            this.selectedThread.next(undefined);
            this._globalApplicationStateService.setTicketViewAccess(false);
            this.isTicketViewLoaded.next(false);
            return;
        }
        this.ThreadList.getValue().map(function (thread) {
            if (thread._id == tid) {
                _this.selectedThread.next(thread);
                //console.log('Ticket found in thread list');
                _this._globalApplicationStateService.setTicketViewAccess(true);
            }
            return thread;
        });
        if ((!this.selectedThread.getValue() || !Object.keys(this.selectedThread.getValue()).length) || (this.selectedThread.getValue()._id && this.selectedThread.getValue()._id != tid)) {
            console.log('Ticket not found in thread list or its a new ticket');
            this.getTicketById(tid);
        }
    };
    TicketsService.prototype.getNextThreadId = function (threadid, value) {
        var threadList = this.ThreadList.getValue();
        var ticket = threadList.sort(function (a, b) {
            var aDate = (a.lasttouchedTime) ? a.lasttouchedTime : a.datetime;
            var bDate = (b.lasttouchedTime) ? b.lasttouchedTime : b.datetime;
            return (Date.parse(aDate) - Date.parse(bDate) > 0) ? -1 : 1;
        });
        if (ticket.length) {
            if (value) {
                var index = ticket.findIndex(function (data) { return data._id == threadid; });
                if (value == 'next') {
                    if (ticket[index + 1] && ticket[index + 1]._id)
                        return ticket[index + 1]._id;
                    else
                        return '';
                }
                else {
                    if (ticket[index - 1] && ticket[index - 1]._id)
                        return ticket[index - 1]._id;
                    else
                        return '';
                }
            }
            else {
                var index = ticket.findIndex(function (data) { return data._id == ticket[0]._id; });
                return ticket[index]._id;
            }
        }
        else {
            return 'end';
        }
    };
    /**
     * @Move_TO Settings_Ticket-Management_Incoming-Email Local Service
     */
    TicketsService.prototype.getIncomingEmailsByNsp = function () {
        var _this = this;
        this.http.post(this.ticketServiceURL + '/getIncomingEmailsByNSP', { nsp: this.Agent.nsp }).subscribe(function (response) {
            if (response.json()) {
                var data = response.json();
                if (data.status == 'ok') {
                    _this.IncomingEmailsByNSP.next(data.email_data);
                }
                else {
                    _this.IncomingEmailsByNSP.next([]);
                }
            }
        });
    };
    TicketsService.prototype.getIncomingEmails = function (domainEmail) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.http.post(_this.ticketServiceURL + '/getIncomingEmails', { email: domainEmail.toLowerCase() }).subscribe(function (response) {
                if (response.json()) {
                    var data = response.json();
                    if (data.status == 'ok') {
                        observer.next({ status: "ok", emaildata: data.email_data });
                        observer.complete();
                    }
                    else {
                        observer.next({ status: "error", msg: data.msg });
                        observer.complete();
                    }
                }
            });
        });
    };
    TicketsService.prototype.getSurveyResult = function (id) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socket.emit('getSurveyResult', { id: id }, function (response) {
                if (response.status == 'ok') {
                    observer.next({ status: "ok", result: response.result });
                }
                else {
                    observer.next({ status: "error", msg: "Error in getting survey results!" });
                }
            });
        });
    };
    TicketsService.prototype.getTicketsByGroup = function (group_name) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socket.emit('getTicketsByGroup', { group_name: group_name }, function (response) {
                if (response.status == 'ok') {
                    _this.GroupData.next(response);
                    observer.next({ status: "ok", groups: response });
                }
                else {
                    _this.GroupData.next([]);
                }
            });
        });
    };
    TicketsService.prototype.getTicketById = function (id) {
        var _this = this;
        this.http.post(this.ticketServiceURL + '/getTicketByID', { nsp: this.Agent.nsp, email: this.Agent.email, tid: id }).subscribe(function (response) {
            if (response.json()) {
                var data = response.json();
                if (data.status == 'ok') {
                    data.thread.synced = false;
                    data.thread.messages = [];
                    data.thread.ended = false;
                    data.thread.ticketlog = (data.thread.ticketlog && data.thread.ticketlog.length) ? _this.transformTicketLog(data.thread.ticketlog) : [];
                    _this.selectedThread.next(data.thread);
                    _this._globalApplicationStateService.setTicketViewAccess(true);
                }
                else {
                    _this._globalApplicationStateService.NavigateForce('/tickets/list');
                }
            }
        });
    };
    TicketsService.prototype.removeTicketAndRedirect = function (tid) {
        this.InitializeTicketList(this.Filters.getValue(), true);
        this._globalApplicationStateService.NavigateForce('/tickets/list');
    };
    TicketsService.prototype.SendMessage = function (ticket) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            //REST CALL
            _this.http.post(_this.ticketServiceURL + '/replyTicket', { ticket: ticket, mergedTicketIds: [_this.selectedThread.getValue()._id], nsp: _this.Agent.nsp, email: _this.Agent.email }).subscribe(function (res) {
                if (res.json()) {
                    var response_5 = res.json();
                    if (response_5.status == 'ok') {
                        if (_this.selectedThread.getValue().merged && _this.selectedThread.getValue().mergedTicketIds.length) {
                            _this.selectedThread.next(_this.selectedThread.getValue());
                        }
                        var dateFound_1 = false;
                        _this.selectedThread.getValue().messages.map(function (groupedMessage) {
                            if (groupedMessage.date == new Date(response_5.ticket.datetime).toDateString()) {
                                groupedMessage.groupedMessagesList.push(response_5.ticket);
                                dateFound_1 = true;
                            }
                        });
                        if (!dateFound_1) {
                            _this.selectedThread.getValue().messages.push({
                                date: new Date(response_5.ticket.datetime).toDateString(),
                                groupedMessagesList: [response_5.ticket]
                            });
                        }
                        if (_this.ThreadList.getValue()[0] != ticket.tid) {
                            _this.updateTouchedTime(response_5.ticket.datetime, ticket.tid);
                        }
                        observer.next({ status: 'ok' });
                        observer.complete();
                    }
                    else {
                        if (response_5.status == "error") {
                            observer.error();
                            observer.complete();
                        }
                    }
                }
            });
        });
    };
    TicketsService.prototype.toggleFilterArea = function () {
        this.showFilterArea.next(!this.showFilterArea.getValue());
    };
    //Incoming Email:
    TicketsService.prototype.AddIncomingEmail = function (domainEmail, incomingEmail, group, name) {
        var _this = this;
        //REST CALL
        return new Observable_1.Observable(function (observer) {
            _this.http.post(_this.ticketServiceURL + '/addIncomingEmail', { domainEmail: domainEmail.toLowerCase(), incomingEmail: incomingEmail.toLowerCase(), group: group, name: name, nsp: _this.Agent.nsp, email: _this.Agent.email }).subscribe(function (response) {
                if (response.json()) {
                    var data = response.json();
                    if (data.status == 'ok') {
                        _this.getIncomingEmailsByNsp();
                        _this._ticketautomationservice.getGroups();
                    }
                    observer.next(data);
                    observer.complete();
                }
            });
        });
    };
    TicketsService.prototype.SetPrimaryEmail = function (id, flag) {
        var _this = this;
        //REST CALL
        this.http.post(this.ticketServiceURL + '/setPrimaryEmail', { id: id, flag: flag, nsp: this.Agent.nsp, email: this.Agent.email }).subscribe(function (response) {
            if (response.json()) {
                var data_2 = response.json();
                if (data_2.status == 'ok') {
                    var index = _this.IncomingEmailsByNSP.getValue().findIndex(function (obj) { return obj._id == data_2.emailData._id; });
                    _this.IncomingEmailsByNSP.getValue()[index] = data_2.emailData;
                    _this.IncomingEmailsByNSP.next(_this.IncomingEmailsByNSP.getValue());
                }
            }
        });
    };
    TicketsService.prototype.UpdateIncomingEmail = function (emailId, domainEmail, incomingEmail, group, name) {
        var _this = this;
        //REST CALL
        this.http.post(this.ticketServiceURL + '/updateIncomingId', { emailId: emailId, domainEmail: domainEmail, incomingEmail: incomingEmail, group: group, name: name, nsp: this.Agent.nsp, email: this.Agent.email }).subscribe(function (response) {
            if (response.json()) {
                var data = response.json();
                if (data.status == 'ok') {
                    _this.getIncomingEmailsByNsp();
                }
                else {
                    _this.notification.next({
                        msg: "No record updated!",
                        type: 'error',
                        img: 'warning'
                    });
                }
            }
        });
    };
    TicketsService.prototype.toggleExternalRuleset = function (id, value) {
        var _this = this;
        //REST CALL
        this.http.post(this.ticketServiceURL + '/toggleExternalRuleset', { id: id, value: value, nsp: this.Agent.nsp, email: this.Agent.email }).subscribe(function (response) {
            if (response.json()) {
                var data = response.json();
                if (data.status == 'ok') {
                    _this.notification.next({
                        msg: data.msg,
                        type: 'success',
                        img: 'ok'
                    });
                }
            }
        });
    };
    TicketsService.prototype.toggleIconnDispatcher = function (id, value) {
        var _this = this;
        //REST CALL
        this.http.post(this.ticketServiceURL + '/toggleIconnDispatcher', { id: id, value: value, nsp: this.Agent.nsp, email: this.Agent.email }).subscribe(function (response) {
            if (response.json()) {
                var data = response.json();
                if (data.status == 'ok') {
                    _this.notification.next({
                        msg: data.msg,
                        type: 'success',
                        img: 'ok'
                    });
                }
            }
        });
    };
    TicketsService.prototype.toggleAckEmail = function (id, value) {
        var _this = this;
        //REST CALL
        this.http.post(this.ticketServiceURL + '/toggleAckEmail', { id: id, value: value, nsp: this.Agent.nsp, email: this.Agent.email }).subscribe(function (response) {
            if (response.json()) {
                var data = response.json();
                if (data.status == 'ok') {
                    _this.notification.next({
                        msg: data.msg,
                        type: 'success',
                        img: 'ok'
                    });
                }
            }
        });
    };
    TicketsService.prototype.toggleUseOriginalEmail = function (id, value) {
        var _this = this;
        //REST CALL
        this.http.post(this.ticketServiceURL + '/toggleUseOriginalEmail', { id: id, value: value, nsp: this.Agent.nsp, email: this.Agent.email }).subscribe(function (response) {
            if (response.json()) {
                var data = response.json();
                if (data.status == 'ok') {
                    _this.notification.next({
                        msg: data.msg,
                        type: 'success',
                        img: 'ok'
                    });
                }
            }
        });
        //SOCKET
        // this.socket.emit('toggleUseOriginalEmail', { id: id, value: value }, (response) => {
        //     if (response.status == 'ok') {
        //         this.notification.next({
        //             msg: response.msg,
        //             type: 'success',
        //             img: 'ok'
        //         });
        //     }
        // });
    };
    TicketsService.prototype.DeleteIncomingId = function (email, emailId) {
        var _this = this;
        //REST CALL
        this.http.post(this.ticketServiceURL + '/deleteIncomingId', { email: email, emailId: emailId, nsp: this.Agent.nsp }).subscribe(function (response) {
            if (response.json()) {
                var data = response.json();
                if (data.status == 'ok') {
                    var index = _this.IncomingEmails.getValue().findIndex(function (obj) { return obj._id == emailId; });
                    _this.IncomingEmails.getValue().splice(index, 1);
                    _this.IncomingEmails.next(_this.IncomingEmails.getValue());
                    _this.getIncomingEmailsByNsp();
                    _this.notification.next({
                        msg: data.msg,
                        type: 'success',
                        img: 'ok'
                    });
                }
                else {
                    _this.notification.next({
                        msg: "Incoming email not deleted!",
                        type: 'error',
                        img: 'warning'
                    });
                }
            }
        });
        //SOCKET
        // this.socket.emit('deleteIncomingId', { email: email, emailId: emailId }, (response) => {
        //     if (response.status == 'ok') {
        //         let index = this.IncomingEmails.getValue().findIndex(obj => obj._id == emailId);
        //         this.IncomingEmails.getValue().splice(index, 1);
        //         this.IncomingEmails.next(this.IncomingEmails.getValue());
        //         this.getIncomingEmailsByNsp();
        //         this.notification.next({
        //             msg: response.msg,
        //             type: 'success',
        //             img: 'ok'
        //         });
        //     }
        //     else {
        //         this.notification.next({
        //             msg: "No incoming email deleted!",
        //             type: 'error',
        //             img: 'warning'
        //         });
        //     }
        // });
    };
    TicketsService.prototype.SendActivation = function (emailId) {
        var _this = this;
        this.activationLoading.next(true);
        //REST CALL
        this.http.post(this.ticketServiceURL + '/sendActivation', { emailId: emailId, nsp: this.Agent.nsp, email: this.Agent.email }).subscribe(function (response) {
            if (response.json()) {
                var data = response.json();
                if (data.status == 'ok') {
                    _this.notification.next({
                        msg: data.msg,
                        type: 'success',
                        img: 'ok'
                    });
                }
                else {
                    _this.notification.next({
                        msg: "No activation email sent!",
                        type: 'error',
                        img: 'warning'
                    });
                }
                _this.activationLoading.next(false);
            }
        });
        //SOCKET
        // this.socket.emit('sendActivation', { emailId: emailId }, (response) => {
        //     if (response.status == 'ok') {
        //         this.notification.next({
        //             msg: response.msg,
        //             type: 'success',
        //             img: 'ok'
        //         });
        //     }
        //     else {
        //         this.notification.next({
        //             msg: "No activation email sent!",
        //             type: 'error',
        //             img: 'warning'
        //         });
        //     }
        //     this.activationLoading.next(false);
        // });
    };
    TicketsService.prototype.SendIdentityVerificationEmail = function (email) {
        var _this = this;
        //REST CALL
        this.http.post(this.ticketServiceURL + '/sendIdentityVerificationEmail', { email: email, nsp: this.Agent.nsp }).subscribe(function (response) {
            if (response.json()) {
                var data = response.json();
                if (data.status == 'ok') {
                    _this.notification.next({
                        msg: data.msg,
                        type: 'success',
                        img: 'ok'
                    });
                }
                else {
                    _this.notification.next({
                        msg: data.msg,
                        type: 'error',
                        img: 'warning'
                    });
                }
            }
        });
        //SOCKET
        // this.socket.emit('sendIdentityVerificationEmail', { email: email }, (response) => {
        //     if (response.status == 'ok') {
        //         this.notification.next({
        //             msg: response.msg,
        //             type: 'success',
        //             img: 'ok'
        //         });
        //     }
        //     else {
        //         this.notification.next({
        //             msg: response.msg,
        //             type: 'error',
        //             img: 'warning'
        //         });
        //     }
        // });
    };
    TicketsService.prototype.CustomerRegistration = function (details) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            try {
                _this.http.post(_this.ticketServiceURL + '/RegisterCustomer', { details: details.thread }).subscribe(function (data) {
                    if (data.json()) {
                        var response = data.json();
                        if (response.status == 'ok') {
                            observer.next(response);
                            observer.complete();
                        }
                        else {
                            observer.next([]);
                            observer.complete();
                        }
                    }
                }, function (err) {
                    observer.next(false);
                    observer.complete();
                });
            }
            catch (error) {
                observer.next(false);
                observer.complete();
            }
        });
    };
    TicketsService.prototype.CheckCustomerRegistration = function (custEmail, custPhone, custId, threadId) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            try {
                _this.http.post(_this.ticketServiceURL + '/CheckRegistration', { customerEmail: custEmail, customerID: custId, customerPhone: custPhone }).subscribe(function (data) {
                    if (data.json()) {
                        var res = data.json();
                        if (res.status == 'ok') {
                            res.response._id = threadId;
                            observer.next(res.response);
                            observer.complete();
                        }
                        else {
                            observer.next([]);
                            observer.complete();
                        }
                    }
                }, function (err) {
                    observer.next([]);
                    observer.complete();
                });
            }
            catch (error) {
                observer.next([]);
                observer.complete();
            }
        });
    };
    TicketsService.prototype.InsertCustomerInfo = function (_id, cusInfo, relCusInfo, assignment) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            try {
                _this.http.post(_this.ticketServiceURL + '/InsertCustomerInfo', { tid: _id, cusInfo: cusInfo, relCusInfo: relCusInfo, email: _this.Agent.email, nsp: _this.Agent.nsp, assignment: assignment ? assignment : '' }).subscribe(function (data) {
                    if (data.json()) {
                        var res_1 = data.json();
                        if (res_1.status == 'ok') {
                            // console.log(res);
                            _this.ThreadList.next(_this.ThreadList.getValue().map(function (thread) {
                                if (thread._id == _id) {
                                    var logfound_4 = false;
                                    thread.CustomerInfo = res_1.ticket.CustomerInfo;
                                    thread.RelatedCustomerInfo = res_1.ticket.RelatedCustomerInfo;
                                    thread.ticketlog = thread.ticketlog.map(function (log) {
                                        if (log.date == new Date(res_1.ticketlog.time_stamp).toDateString()) {
                                            log.groupedticketlogList.unshift(res_1.ticketlog);
                                            logfound_4 = true;
                                        }
                                        return log;
                                    });
                                    if (!logfound_4) {
                                        thread.ticketlog.unshift({
                                            date: new Date(res_1.ticketlog.time_stamp).toDateString(),
                                            groupedticketlogList: [res_1.ticketlog]
                                        });
                                    }
                                    // this.selectedThread.next(thread);
                                }
                                return thread;
                            }));
                            observer.next({ status: "ok", res: res_1.ticket, ticketlog: res_1.ticketlog });
                            observer.complete();
                        }
                    }
                });
            }
            catch (error) {
                observer.next(undefined);
                observer.complete();
            }
        });
    };
    TicketsService.prototype.SetState = function (tids, status) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            //REST CALL
            _this.http.post(_this.ticketServiceURL + '/changeTicketState', { tids: tids, state: status, email: _this.Agent.email, nsp: _this.Agent.nsp }).subscribe(function (res) {
                if (res.json()) {
                    var response_6 = res.json();
                    if (response_6.status == 'ok') {
                        var found = false;
                        _this.ThreadList.next(_this.ThreadList.getValue().map(function (thread) {
                            tids.map(function (tid) {
                                if (thread._id == tid) {
                                    var logfound_5 = false;
                                    var previousState = JSON.parse(JSON.stringify(thread.state));
                                    thread.state = status;
                                    thread.ticketlog = thread.ticketlog.map(function (log) {
                                        if (log.date == new Date(response_6.ticketlog.time_stamp).toDateString()) {
                                            log.groupedticketlogList.unshift(response_6.ticketlog);
                                            logfound_5 = true;
                                        }
                                        return log;
                                    });
                                    if (!logfound_5) {
                                        thread.ticketlog.unshift({
                                            date: new Date(response_6.ticketlog.time_stamp).toDateString(),
                                            groupedticketlogList: [response_6.ticketlog]
                                        });
                                    }
                                    _this.UpdateTicketCount(thread, previousState);
                                    // this.pushNewLog(thread.ticketlog, ticketlog);
                                    _this.selectedThread.next(thread);
                                    _this.notification.next({
                                        msg: 'Ticket(s) state changed to ' + status + ' successfully!',
                                        type: 'success',
                                        img: 'ok'
                                    });
                                }
                            });
                            return thread;
                        }));
                        observer.next(response_6.status);
                    }
                    else {
                        _this.setNotification("Can't Update Thread Status", 'error', 'warning');
                        observer.next(response_6.status);
                        observer.complete();
                    }
                }
            }, function (err) {
                _this.notification.next({
                    msg: "Can't change priority",
                    type: 'error',
                    img: 'warning'
                });
            });
            //SOCKET
            // this.socket.emit('changeTicketState', { tids: tids, state: status }, (response) => {
            //     if (response.status == 'ok') {
            //         let msg = '';
            //         this.ThreadList.next(this.ThreadList.getValue().map(thread => {
            //             tids.map(tid => {
            //                 if (thread._id == tid) {
            //                     let logfound = false;
            //                     let previousState = JSON.parse(JSON.stringify(thread.state))
            //                     thread.state = status;
            //                     thread.ticketlog = thread.ticketlog.map(log => {
            //                         if (log.date == new Date(response.ticketlog.time_stamp).toDateString()) {
            //                             log.groupedticketlogList.unshift(response.ticketlog);
            //                             logfound = true;
            //                         }
            //                         return log;
            //                     });
            //                     if (!logfound) {
            //                         thread.ticketlog.unshift({
            //                             date: new Date(response.ticketlog.time_stamp).toDateString(),
            //                             groupedticketlogList: [response.ticketlog]
            //                         })
            //                     }
            //                     this.UpdateTicketCount(thread, previousState)
            //                     // this.pushNewLog(thread.ticketlog, ticketlog);
            //                     this.selectedThread.next(thread);
            //                     msg += 'Ticket #' + thread.clientID + ' Status Marked As ' + status + ' Successfully<br>';
            //                     this.notification.next({
            //                         msg: 'Ticket(s) state changed to ' + status + ' successfully!',
            //                         type: 'success',
            //                         img: 'ok'
            //                     });
            //                     // found = JSON.parse(JSON.stringify(thread));
            //                 }
            //             });
            //             return thread;
            //         }));
            //         observer.next(response.status);
            //     } else {
            //         this.setNotification("Can't Update Thread Status", 'error', 'warning');
            //         observer.next(response.status);
            //         observer.complete();
            //     }
            // })
        });
    };
    TicketsService.prototype.RefreshList = function () {
        this.ThreadList.getValue().sort(function (a, b) {
            var aDate = (a.lasttouchedTime) ? a.lasttouchedTime : a.datetime;
            var bDate = (b.lasttouchedTime) ? b.lasttouchedTime : b.datetime;
            return (Date.parse(aDate) - Date.parse(bDate) > 0) ? -1 : 1;
        });
        this.ThreadList.next(this.ThreadList.getValue());
    };
    TicketsService.prototype.UpdateTicketProperty = function (tids, ticket) {
        // console.log(tids,ticket);
        var _this = this;
        this.ThreadList.next(this.ThreadList.getValue().map(function (thread, index) {
            tids.map(function (tid) {
                if (thread._id == tid) {
                    ticket.messages = thread.messages;
                    ticket.synced = thread.synced;
                    if (ticket.state != thread.state) {
                        _this.UpdateTicketCount(ticket, thread.state);
                    }
                    ticket.ticketlog = (ticket.ticketlog && ticket.ticketlog.length) ? _this.transformTicketLog(ticket.ticketlog) : [];
                    thread = ticket;
                    if (_this.selectedThread.getValue() && _this.selectedThread.getValue()._id == tid) {
                        _this.selectedThread.next(thread);
                    }
                }
            });
            return thread;
        }));
    };
    TicketsService.prototype.UpdateTicketPropertyArray = function (ticket) {
        var _this = this;
        this.ThreadList.next(this.ThreadList.getValue().map(function (thread, index) {
            ticket.map(function (ticket) {
                if (thread._id == ticket._id) {
                    ticket.messages = thread.messages;
                    ticket.synced = thread.synced;
                    if (ticket.state != thread.state) {
                        _this.UpdateTicketCount(ticket, thread.state);
                    }
                    ticket.ticketlog = (ticket.ticketlog && ticket.ticketlog.length) ? _this.transformTicketLog(ticket.ticketlog) : [];
                    thread = ticket;
                    if (_this.selectedThread.getValue() && _this.selectedThread.getValue()._id == ticket._id) {
                        _this.selectedThread.next(thread);
                    }
                }
            });
            return thread;
        }));
    };
    TicketsService.prototype.UpdateTicket = function (tid, ticket) {
        var _this = this;
        this.ThreadList.next(this.ThreadList.getValue().filter(function (thread, index) {
            if (thread._id != tid) {
                return true;
            }
            ;
            if (thread._id == tid) {
                if (ticket.state != thread.state) {
                    _this.UpdateTicketCount(ticket, thread.state);
                }
                ticket.ticketlog = (ticket.ticketlog && ticket.ticketlog.length) ? _this.transformTicketLog(ticket.ticketlog) : [];
                return;
                /**
                 * @FIX
                 * 1. Change list hiding logic from selectedThread Undefined
                 * 2. Upon Undefined Fix View to Stay Still with not actions permissible.
                 */
            }
        }));
        if (this.selectedThread.getValue() && this.selectedThread.getValue()._id == ticket._id) {
            this.selectedThread.next(ticket);
        }
        this.ThreadList.getValue().unshift(ticket);
        this.ThreadList.next(this.ThreadList.getValue());
    };
    TicketsService.prototype.updateTouchedTime = function (lasttouchedTime, tid) {
        // console.log('Update Last touch time of : ' + tid + ' as: ' + lasttouchedTime);
        this.ThreadList.next(this.ThreadList.getValue().map(function (thread) {
            if (thread._id == tid) {
                thread.lasttouchedTime = lasttouchedTime;
            }
            // console.log(thread.lasttouchedTime);
            return thread;
        }));
    };
    TicketsService.prototype.updateViewState = function (viewState, tids) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            //REST CALL
            _this.http.post(_this.ticketServiceURL + '/updateViewState', { tids: tids, viewState: viewState, email: _this.Agent.email, nsp: _this.Agent.nsp }).subscribe(function (res) {
                if (res.json()) {
                    var response = res.json();
                    if (response.status == 'ok') {
                        _this.ThreadList.next(_this.ThreadList.getValue().map(function (thread) {
                            tids.map(function (tid) {
                                if (thread._id == tid) {
                                    thread.viewState = viewState;
                                    if (_this.selectedThread.getValue() && _this.selectedThread.getValue()._id == tid)
                                        _this.selectedThread.next(thread);
                                }
                            });
                            return thread;
                        }));
                        observer.next(response);
                        observer.complete();
                    }
                }
            });
            //SOCKET
            // this.socket.emit('updateViewState', { tids: tids, viewState: viewState }, response => {
            //     if (response.status == 'ok') {
            //         let msg = '';
            //         this.ThreadList.next(this.ThreadList.getValue().map(thread => {
            //             tids.map(tid => {
            //                 if (thread._id == tid) {
            //                     thread.viewState = viewState;
            //                     if (this.selectedThread.getValue() && this.selectedThread.getValue()._id == tid)
            //                         this.selectedThread.next(thread);
            //                 }
            //             });
            //             return thread;
            //         }));
            //         observer.next(response);
            //         observer.complete();
            //     }
            //     else {
            //         observer.complete();
            //     }
            // });
        });
    };
    TicketsService.prototype.getNotification = function () {
        return this.notification.asObservable();
    };
    TicketsService.prototype.clearNotification = function () {
        this.notification.next(undefined);
    };
    TicketsService.prototype.setNotification = function (notification, type, icon) {
        var item = {
            msg: notification,
            type: type,
            img: icon
        };
        this.notification.next(item);
    };
    TicketsService.prototype.addTicket = function (data) {
        data.ticket.synced = false;
        data.ticket.messages = [];
        this.ThreadList.getValue().unshift(data.ticket);
        this.ThreadList.next(this.ThreadList.getValue());
    };
    TicketsService.prototype.UpdateTicketCount = function (ticket, previousState) {
        if (previousState) {
            this.TicketCount.getValue().map(function (group) {
                if (previousState == group.state)
                    group.count -= 1;
                if (group.state == ticket.state)
                    group.count += 1;
            });
        }
        else {
            this.TicketCount.getValue().map(function (group) {
                if (group.state == ticket.state)
                    group.count += 1;
            });
        }
        this.TicketCount.next(this.TicketCount.getValue());
    };
    TicketsService.prototype.AddTicketCount = function (ticket) {
        this.TicketCount.getValue().map(function (group) {
            if (group.state == ticket.state)
                group.count += 1;
        });
        this.TicketCount.next(this.TicketCount.getValue());
    };
    TicketsService.prototype.SubstractTicketCount = function (ticket) {
        this.TicketCount.getValue().map(function (group) {
            if (group.state == ticket.state)
                group.count -= 1;
        });
        this.TicketCount.next(this.TicketCount.getValue());
    };
    TicketsService.prototype.pushNewLog = function (ticketlog, newLog) {
        var logfound = false;
        ticketlog = ticketlog.map(function (log) {
            if (log.date == new Date(newLog.time_stamp).toDateString()) {
                log.groupedticketlogList.unshift(newLog);
                logfound = true;
            }
            return log;
        });
        if (!logfound) {
            ticketlog.unshift({
                date: new Date(newLog.time_stamp).toDateString(),
                groupedticketlogList: [newLog]
            });
        }
        // ticketlog = ticketlog.map(log => {
        //     if (log.date == new Date(newLog.time_stamp).toDateString()) {
        //         log.groupedticketlogList.unshift(newLog);
        //         logfound = true;
        //     }
        //     return log;
        // })
        // if (!logfound) {
        //     ticketlog.unshift({
        //         date: new Date(newLog.time_stamp).toDateString(),
        //         groupedticketlogList: [ticketlog]
        //     })
        // }
        return ticketlog;
    };
    TicketsService.prototype.transformTicketLog = function (ticketlog) {
        var ticketlogarr = [];
        var ticketlogsingular;
        ticketlogarr = ticketlog;
        if (ticketlogarr.length > 0) {
            ticketlogarr = ticketlogarr.reduce(function (previous, current) {
                if (!previous[new Date(current.time_stamp).toDateString()]) {
                    previous[new Date(current.time_stamp).toDateString()] = [current];
                }
                else {
                    previous[new Date(current.time_stamp).toDateString()].push(current);
                }
                return previous;
            }, {});
        }
        ticketlogsingular = Object.keys(ticketlogarr).map(function (key) {
            return { date: key, groupedticketlogList: ticketlogarr[key] };
        }).sort(function (a, b) {
            if (new Date(a.date) > new Date(b.date))
                return -1;
            else if (new Date(a.date) < new Date(b.date))
                return 1;
            else
                0;
        });
        ticketlogsingular.forEach(function (element) {
            element.groupedticketlogList.sort(function (a, b) {
                if (new Date(a.time_stamp) > new Date(b.time_stamp))
                    return -1;
                else if (new Date(a.time_stamp) < new Date(b.time_stamp))
                    return 1;
                else
                    0;
            });
        });
        return ticketlogsingular;
    };
    //Ticket Task:
    TicketsService.prototype.addTask = function (taskEntered, tid) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            var task = {
                todo: taskEntered,
                agent: _this.Agent.email,
                completed: false
            };
            //REST CALL
            _this.http.post(_this.ticketServiceURL + '/addTask', { tid: tid, email: _this.Agent.email, nsp: _this.Agent.nsp, task: task }).subscribe(function (res) {
                if (res.json()) {
                    var response_7 = res.json();
                    if (response_7.status == 'ok') {
                        _this.ThreadList.next(_this.ThreadList.getValue().map(function (thread) {
                            tid.map(function (tid) {
                                if (thread._id == tid) {
                                    var logfound_6 = false;
                                    if (!thread.todo)
                                        thread.todo = [];
                                    thread.todo = response_7.result.todo;
                                    thread.ticketlog = thread.ticketlog.map(function (log) {
                                        if (log.date == new Date(response_7.ticketlog.time_stamp).toDateString()) {
                                            log.groupedticketlogList.unshift(response_7.ticketlog);
                                            logfound_6 = true;
                                        }
                                        return log;
                                    });
                                    if (!logfound_6) {
                                        thread.ticketlog.unshift({
                                            date: new Date(response_7.ticketlog.time_stamp).toDateString(),
                                            groupedticketlogList: [response_7.ticketlog]
                                        });
                                    }
                                    _this.selectedThread.next(thread);
                                    _this.notification.next({
                                        msg: "Task added successfully!",
                                        type: 'success',
                                        img: 'ok'
                                    });
                                }
                            });
                            return thread;
                        }));
                    }
                    else {
                        observer.complete();
                        _this.setNotification("Can't Add Task", 'error', 'warning');
                    }
                }
            }, function (err) {
                observer.complete();
                _this.setNotification("Can't Add Task", 'error', 'warning');
            });
            //SOCKETS
            // this.socket.emit('addTask', { tid: tid, task: task }, (response) => {
            //     if (response.status == 'ok') {
            //         this.ThreadList.next(this.ThreadList.getValue().map(thread => {
            //             tid.map(tid => {
            //                 if (thread._id == tid) {
            //                     let logfound = false;
            //                     if (!thread.todo) thread.todo = [];
            //                     thread.todo = response.result.todo;
            //                     thread.ticketlog = thread.ticketlog.map(log => {
            //                         if (log.date == new Date(response.ticketlog.time_stamp).toDateString()) {
            //                             log.groupedticketlogList.unshift(response.ticketlog);
            //                             logfound = true;
            //                         }
            //                         return log;
            //                     });
            //                     if (!logfound) {
            //                         thread.ticketlog.unshift({
            //                             date: new Date(response.ticketlog.time_stamp).toDateString(),
            //                             groupedticketlogList: [response.ticketlog]
            //                         })
            //                     }
            //                     this.selectedThread.next(thread);
            //                     this.notification.next({
            //                         msg: "Task added successfully!",
            //                         type: 'success',
            //                         img: 'ok'
            //                     });
            //                 }
            //             });
            //             return thread;
            //         }));
            //         observer.next({ status: response.status });
            //         observer.complete();
            //     } else {
            //         observer.complete();
            //         this.setNotification("Can't Add Task", 'error', 'warning');
            //     }
            // });
        });
    };
    TicketsService.prototype.updateTask = function (properties, id) {
        var _this = this;
        //REST CALL
        this.http.post(this.ticketServiceURL + '/updateTask', { tid: this.selectedThread.getValue()._id, id: id, properties: properties, email: this.Agent.email, nsp: this.Agent.nsp }).subscribe(function (res) {
            if (res.json()) {
                var response_8 = res.json();
                if (response_8.status == 'ok') {
                    _this.ThreadList.next(_this.ThreadList.getValue().map(function (thread) {
                        if (thread._id == _this.selectedThread.getValue()._id) {
                            var logfound_7 = false;
                            thread.todo = response_8.tasks.todo;
                            thread.ticketlog = thread.ticketlog.map(function (log) {
                                if (log.date == new Date(response_8.ticketlog.time_stamp).toDateString()) {
                                    log.groupedticketlogList.unshift(response_8.ticketlog);
                                    logfound_7 = true;
                                }
                                return log;
                            });
                            if (!logfound_7) {
                                thread.ticketlog.unshift({
                                    date: new Date(response_8.ticketlog.time_stamp).toDateString(),
                                    groupedticketlogList: [response_8.ticketlog]
                                });
                            }
                            _this.selectedThread.next(thread);
                            _this.notification.next({
                                msg: "Task updated successfully!",
                                type: 'success',
                                img: 'ok'
                            });
                        }
                        return thread;
                    }));
                }
                else {
                    _this.notification.next({
                        msg: 'Error in updating task',
                        type: 'error',
                        img: 'warning'
                    });
                }
            }
        }, function (err) {
            _this.notification.next({
                msg: 'Error in updating task',
                type: 'error',
                img: 'warning'
            });
        });
        //SOCKET
        // this.socket.emit('updateTask', { tid: this.selectedThread.getValue()._id, id: id, properties: properties }, (response) => {
        //     if (response.status == "ok") {
        //         this.ThreadList.next(this.ThreadList.getValue().map(thread => {
        //             if (thread._id == this.selectedThread.getValue()._id) {
        //                 let logfound = false;
        //                 thread.todo = response.tasks.todo;
        //                 thread.ticketlog = thread.ticketlog.map(log => {
        //                     if (log.date == new Date(response.ticketlog.time_stamp).toDateString()) {
        //                         log.groupedticketlogList.unshift(response.ticketlog);
        //                         logfound = true;
        //                     }
        //                     return log;
        //                 });
        //                 if (!logfound) {
        //                     thread.ticketlog.unshift({
        //                         date: new Date(response.ticketlog.time_stamp).toDateString(),
        //                         groupedticketlogList: [response.ticketlog]
        //                     })
        //                 }
        //                 this.selectedThread.next(thread);
        //                 this.notification.next({
        //                     msg: "Task updated successfully!",
        //                     type: 'success',
        //                     img: 'ok'
        //                 });
        //             }
        //             return thread;
        //         }));
        //     }
        //     else {
        //         this.notification.next({
        //             msg: 'Error in updating task',
        //             type: 'error',
        //             img: 'warning'
        //         });
        //     }
        // })
    };
    TicketsService.prototype.checkedTask = function (id, status, name) {
        var _this = this;
        //REST CALL
        this.http.post(this.ticketServiceURL + '/checkedTask', { tid: this.selectedThread.getValue()._id, id: id, status: status, name: name, email: this.Agent.email, nsp: this.Agent.nsp }).subscribe(function (res) {
            if (res.json()) {
                var response_9 = res.json();
                if (response_9.status == 'ok') {
                    if (status) {
                        _this.notification.next({
                            msg: 'Task marked as completed successfully',
                            type: 'success',
                            img: 'ok'
                        });
                    }
                    else {
                        _this.notification.next({
                            msg: 'Task marked as incomplete successfully',
                            type: 'success',
                            img: 'ok'
                        });
                    }
                    _this.ThreadList.next(_this.ThreadList.getValue().map(function (thread) {
                        if (thread._id == _this.selectedThread.getValue()._id) {
                            var logfound_8 = false;
                            if (!thread.todo)
                                thread.todo = [];
                            thread.todo = response_9.tasks.todo;
                            thread.ticketlog = thread.ticketlog.map(function (log) {
                                if (log.date == new Date(response_9.ticketlog.time_stamp).toDateString()) {
                                    log.groupedticketlogList.unshift(response_9.ticketlog);
                                    logfound_8 = true;
                                }
                                return log;
                            });
                            if (!logfound_8) {
                                thread.ticketlog.unshift({
                                    date: new Date(response_9.ticketlog.time_stamp).toDateString(),
                                    groupedticketlogList: [response_9.ticketlog]
                                });
                            }
                            _this.selectedThread.next(thread);
                        }
                        return thread;
                    }));
                }
                else {
                    _this.setNotification("Can't check Task", 'error', 'warning');
                }
            }
        }, function (err) {
            _this.setNotification("Can't check Task", 'error', 'warning');
        });
        //SOCKET
        // this.socket.emit('checkedTask', { tid: this.selectedThread.getValue()._id, id: id, status: status, name: name }, (response) => {
        //     if (response.status == "ok") {
        //         if (status) {
        //             this.notification.next({
        //                 msg: 'Task marked as completed successfully',
        //                 type: 'success',
        //                 img: 'ok'
        //             });
        //         }
        //         else {
        //             this.notification.next({
        //                 msg: 'Task marked as incomplete successfully',
        //                 type: 'success',
        //                 img: 'ok'
        //             });
        //         }
        //         if (this.selectedThread.getValue()) {
        //             let logfound = false;
        //             this.selectedThread.getValue().todo = response.tasks.todo;
        //             this.selectedThread.getValue().ticketlog = this.selectedThread.getValue().ticketlog.map(log => {
        //                 if (log.date == new Date(response.ticketlog.time_stamp).toDateString()) {
        //                     log.groupedticketlogList.unshift(response.ticketlog);
        //                     logfound = true;
        //                 }
        //                 return log;
        //             });
        //             if (!logfound) {
        //                 this.selectedThread.getValue().ticketlog.unshift({
        //                     date: new Date(response.ticketlog.time_stamp).toDateString(),
        //                     groupedticketlogList: [response.ticketlog]
        //                 })
        //             }
        //             this.selectedThread.next(this.selectedThread.getValue());
        //         }
        //     }
        // });
    };
    TicketsService.prototype.deleteTask = function (id, task) {
        var _this = this;
        //REST CALL
        this.http.post(this.ticketServiceURL + '/deleteTask', { tid: this.selectedThread.getValue()._id, email: this.Agent.email, nsp: this.Agent.nsp, id: id, task: task }).subscribe(function (res) {
            if (res.json()) {
                var response_10 = res.json();
                if (response_10.status == 'ok') {
                    _this.ThreadList.next(_this.ThreadList.getValue().map(function (thread) {
                        if (thread._id == _this.selectedThread.getValue()._id) {
                            var logfound_9 = false;
                            if (!thread.todo)
                                thread.todo = [];
                            thread.todo = response_10.deletedresult.todo;
                            thread.ticketlog = thread.ticketlog.map(function (log) {
                                if (log.date == new Date(response_10.ticketlog.time_stamp).toDateString()) {
                                    log.groupedticketlogList.unshift(response_10.ticketlog);
                                    logfound_9 = true;
                                }
                                return log;
                            });
                            if (!logfound_9) {
                                thread.ticketlog.unshift({
                                    date: new Date(response_10.ticketlog.time_stamp).toDateString(),
                                    groupedticketlogList: [response_10.ticketlog]
                                });
                            }
                            _this.selectedThread.next(thread);
                            _this.notification.next({
                                msg: "Task deleted Successfully!",
                                type: 'success',
                                img: 'ok'
                            });
                        }
                        return thread;
                    }));
                }
                else {
                    _this.setNotification("Can't delete Task", 'error', 'warning');
                }
            }
        }, function (err) {
            _this.setNotification("Can't delete Task", 'error', 'warning');
        });
        //SOCKET
        // this.socket.emit('deleteTask', { tid: this.selectedThread.getValue()._id, id: id, task: task }, (response) => {
        //     if (response.status == "ok") {
        //         let logfound = false;
        //         this.ThreadList.next(this.ThreadList.getValue().map(thread => {
        //             if (thread._id == this.selectedThread.getValue()._id) {
        //                 thread.todo = response.deletedresult.todo;
        //                 thread.ticketlog = thread.ticketlog.map(log => {
        //                     if (log.date == new Date(response.ticketlog.time_stamp).toDateString()) {
        //                         log.groupedticketlogList.unshift(response.ticketlog);
        //                         logfound = true;
        //                     }
        //                     return log;
        //                 });
        //                 if (!logfound) {
        //                     thread.ticketlog.unshift({
        //                         date: new Date(response.ticketlog.time_stamp).toDateString(),
        //                         groupedticketlogList: [response.ticketlog]
        //                     })
        //                 }
        //                 this.selectedThread.next(thread);
        //                 this.notification.next({
        //                     msg: "Task deleted Successfully!",
        //                     type: 'success',
        //                     img: 'ok'
        //                 });
        //             }
        //             return thread;
        //         }));
        //     }
        // })
    };
    //Ticket Tag:
    TicketsService.prototype.addTag = function (tids, tags) {
        // console.log(tids,tags);
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            //REST CALL
            _this.http.post(_this.ticketServiceURL + '/addTags', { tids: tids, tag: tags, email: _this.Agent.email, nsp: _this.Agent.nsp }).subscribe(function (res) {
                if (res.json()) {
                    var response_11 = res.json();
                    if (response_11.status == 'ok') {
                        var found_4 = false;
                        _this.ThreadList.next(_this.ThreadList.getValue().map(function (thread) {
                            tids.map(function (tid) {
                                if (thread._id == tid) {
                                    var logfound_10 = false;
                                    found_4 = true;
                                    if (!thread.tags)
                                        thread.tags = [];
                                    thread.tags = thread.tags.concat(tags);
                                    thread.ticketlog = thread.ticketlog.map(function (log) {
                                        if (log.date == new Date(response_11.ticketlog.time_stamp).toDateString()) {
                                            log.groupedticketlogList.unshift(response_11.ticketlog);
                                            logfound_10 = true;
                                        }
                                        return log;
                                    });
                                    if (!logfound_10) {
                                        thread.ticketlog.unshift({
                                            date: new Date(response_11.ticketlog.time_stamp).toDateString(),
                                            groupedticketlogList: [response_11.ticketlog]
                                        });
                                    }
                                    _this.selectedThread.next(thread);
                                    _this.notification.next({
                                        msg: "Tags " + tags + " added successfully!",
                                        type: 'success',
                                        img: 'ok'
                                    });
                                }
                            });
                            return thread;
                        }));
                        observer.next({ status: "ok" });
                        observer.complete();
                    }
                    else {
                        _this.notification.next({
                            msg: "Can't Add Tag",
                            type: 'error',
                            img: 'warning'
                        });
                        observer.complete();
                    }
                }
            }, function (err) {
                _this.notification.next({
                    msg: "Can't Add Tag",
                    type: 'error',
                    img: 'warning'
                });
            });
            //SOCKET
            // this.socket.emit('addTags', { tids: tids, tag: tags }, (response) => {
            //     if (response.status == 'ok') {
            //         let msg = '';
            //         let found = false;
            //         this.ThreadList.next(this.ThreadList.getValue().map(thread => {
            //             tids.map(tid => {
            //                 if (thread._id == tid) {
            //                     let logfound = false;
            //                     found = true
            //                     if (!thread.tags) thread.tags = [];
            //                     thread.tags = (thread.tags as Array<string>).concat(tags);
            //                     thread.ticketlog = thread.ticketlog.map(log => {
            //                         if (log.date == new Date(response.ticketlog.time_stamp).toDateString()) {
            //                             log.groupedticketlogList.unshift(response.ticketlog);
            //                             logfound = true;
            //                         }
            //                         return log;
            //                     });
            //                     if (!logfound) {
            //                         thread.ticketlog.unshift({
            //                             date: new Date(response.ticketlog.time_stamp).toDateString(),
            //                             groupedticketlogList: [response.ticketlog]
            //                         })
            //                     }
            //                     this.selectedThread.next(thread);
            //                     this.notification.next({
            //                         msg: "Tags " + tags + " added successfully!",
            //                         type: 'success',
            //                         img: 'ok'
            //                     });
            //                 }
            //             });
            //             return thread;
            //         }));
            //         if (found) {
            //             this.notification.next({
            //                 msg: 'Tags ' + tags + ' added successfully!',
            //                 type: 'success',
            //                 img: 'ok'
            //             });
            //             observer.next({ status: response.status });
            //             observer.complete();
            //         }
            //         else {
            //             this.notification.next({
            //                 msg: "Can't Add Tag",
            //                 type: 'error',
            //                 img: 'warning'
            //             });
            //             observer.complete();
            //         }
            //     } else {
            //         this.notification.next({
            //             msg: "Can't Add Tag",
            //             type: 'error',
            //             img: 'warning'
            //         });
            //         observer.complete();
            //     }
            // });
        });
    };
    TicketsService.prototype.deleteTag = function (tag) {
        var _this = this;
        //REST CALL
        this.http.post(this.ticketServiceURL + '/deleteTagTicket', { tid: this.selectedThread.getValue()._id, tag: tag, email: this.Agent.email, nsp: this.Agent.nsp }).subscribe(function (res) {
            if (res.json()) {
                var response_12 = res.json();
                if (response_12.status == "ok") {
                    _this.ThreadList.next(_this.ThreadList.getValue().map(function (thread) {
                        if (thread._id == _this.selectedThread.getValue()._id) {
                            var logfound_11 = false;
                            thread.tags = response_12.deletedresult.tags;
                            thread.ticketlog = thread.ticketlog.map(function (log) {
                                if (log.date == new Date(response_12.ticketlog.time_stamp).toDateString()) {
                                    log.groupedticketlogList.unshift(response_12.ticketlog);
                                    logfound_11 = true;
                                }
                                return log;
                            });
                            if (!logfound_11) {
                                thread.ticketlog.unshift({
                                    date: new Date(response_12.ticketlog.time_stamp).toDateString(),
                                    groupedticketlogList: [response_12.ticketlog]
                                });
                            }
                            _this.selectedThread.next(thread);
                        }
                        return thread;
                    }));
                    _this.RefreshList();
                    var msg = 'Tag ' + tag + ' deleted Successfully';
                    _this.notification.next({
                        msg: msg,
                        type: 'success',
                        img: 'ok'
                    });
                }
                else {
                    _this.notification.next({
                        msg: "Error! Can't delete Tag",
                        type: 'error',
                        img: 'warning'
                    });
                }
            }
        }, function (err) {
            _this.setNotification("Can't delete Task", 'error', 'warning');
        });
        //SOCKET
        // this.socket.emit('deleteTagTicket', { tid: this.selectedThread.getValue()._id, tag: tag }, (response) => {
        //     if (response.status == "ok") {
        //         this.ThreadList.next(this.ThreadList.getValue().map(thread => {
        //             if (thread._id == this.selectedThread.getValue()._id) {
        //                 let logfound = false;
        //                 thread.tags = response.deletedresult.tags;
        //                 thread.ticketlog = thread.ticketlog.map(log => {
        //                     if (log.date == new Date(response.ticketlog.time_stamp).toDateString()) {
        //                         log.groupedticketlogList.unshift(response.ticketlog);
        //                         logfound = true;
        //                     }
        //                     return log;
        //                 });
        //                 if (!logfound) {
        //                     thread.ticketlog.unshift({
        //                         date: new Date(response.ticketlog.time_stamp).toDateString(),
        //                         groupedticketlogList: [response.ticketlog]
        //                     })
        //                 }
        //                 this.selectedThread.next(thread);
        //             }
        //             return thread;
        //         }));
        //         this.RefreshList();
        //         let msg = 'Tag ' + tag + ' deleted Successfully';
        //         this.notification.next({
        //             msg: msg,
        //             type: 'success',
        //             img: 'ok'
        //         });
        //     } else {
        //         this.notification.next({
        //             msg: "Error! Can't delete Tag",
        //             type: 'error',
        //             img: 'warning'
        //         });
        //     }
        // });
    };
    TicketsService.prototype.assignAgentForTicket = function (tids, agent_email, previousAgentEmail, assignment) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            console.log(assignment);
            //REST CALL:
            _this.http.post(_this.ticketServiceURL + '/assignAgentForTicket', { tids: tids, agent_email: agent_email, previousAgent: previousAgentEmail, email: _this.Agent.email, nsp: _this.Agent.nsp, assignment: assignment ? assignment : '' }).subscribe(function (res) {
                if (res.json()) {
                    var response_13 = res.json();
                    var found_5 = false;
                    if (response_13.status == 'ok') {
                        _this.ThreadList.next(_this.ThreadList.getValue().map(function (thread) {
                            tids.map(function (tid) {
                                if (tid == thread._id) {
                                    var logfound_12 = false;
                                    found_5 = true;
                                    thread.assigned_to = agent_email;
                                    thread.ticketlog = thread.ticketlog.map(function (log) {
                                        if (log.date == new Date(response_13.ticketlog.time_stamp).toDateString()) {
                                            log.groupedticketlogList.unshift(response_13.ticketlog);
                                            logfound_12 = true;
                                        }
                                        return log;
                                    });
                                    if (!logfound_12) {
                                        thread.ticketlog.unshift({
                                            date: new Date(response_13.ticketlog.time_stamp).toDateString(),
                                            groupedticketlogList: [response_13.ticketlog]
                                        });
                                    }
                                    if (assignment == undefined) {
                                        _this.selectedThread.next(thread);
                                    }
                                }
                            });
                            return thread;
                        }));
                        if (found_5) {
                            _this.notification.next({ msg: 'Agent ' + agent_email + ' assigned successfully', type: 'success', img: 'ok' });
                            observer.next({ status: response_13.status, ticketlog: response_13.ticketlog });
                            observer.complete();
                        }
                    }
                    else {
                        _this.notification.next({ msg: "Can't assign agent", type: 'error', img: 'warning' });
                        observer.complete();
                    }
                }
            });
            //SOCKET:
            // this.socket.emit('assignAgentForTicket', { tids: tids, agent_email: agent_email, previousAgent: previousAgentEmail }, (response) => {
            //     if (response.status == 'ok') {
            //         let msg = '';
            //         let found = false;
            //         this.ThreadList.next(this.ThreadList.getValue().map(thread => {
            //             tids.map(tid => {
            //                 if (tid == thread._id) {
            //                     let logfound = false;
            //                     found = true;
            //                     thread.assigned_to = agent_email;
            //                     thread.ticketlog = thread.ticketlog.map(log => {
            //                         if (log.date == new Date(response.ticketlog.time_stamp).toDateString()) {
            //                             log.groupedticketlogList.unshift(response.ticketlog);
            //                             logfound = true;
            //                         }
            //                         return log;
            //                     });
            //                     if (!logfound) {
            //                         thread.ticketlog.unshift({
            //                             date: new Date(response.ticketlog.time_stamp).toDateString(),
            //                             groupedticketlogList: [response.ticketlog]
            //                         })
            //                     }
            //                     // this.pushNewLog(thread.ticketlog, ticketlog);
            //                     msg += 'Ticket #' + thread.clientID + ' Status Assigned To ' + agent_email + ' Successfully<br>';
            //                     this.selectedThread.next(thread);
            //                 }
            //             })
            //             return thread;
            //         }));
            //         if (found) {
            //             this.notification.next({ msg: 'Agent ' + agent_email + ' assigned successfully', type: 'success', img: 'ok' });
            //         }
            //         observer.next(response.status);
            //         observer.complete();
            //     } else {
            //         this.notification.next({ msg: "Can't assign agent", type: 'error', img: 'warning' });
            //         observer.complete();
            //     }
            // });
        });
    };
    //Ticket Signature:
    TicketsService.prototype.SaveSignature = function (data) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            //REST CALL:
            _this.http.post(_this.ticketServiceURL + '/saveSignature', { header: data.header, footer: data.footer, email: _this.Agent.email, nsp: _this.Agent.nsp }).subscribe(function (res) {
                if (res.json()) {
                    var response = res.json();
                    if (response.status == 'ok') {
                        _this.signList.getValue().splice(0, 0, response.savedSignature);
                        _this.signList.next(_this.signList.getValue());
                        observer.next(true);
                        observer.complete();
                    }
                }
            });
            //SOCKET:
            // this.socket.emit('saveSignature', { header: data.header, footer: data.footer }, (response) => {
            //     if (response.status == 'ok') {
            //         this.signList.getValue().splice(0, 0, response.savedSignature);
            //         this.signList.next(this.signList.getValue());
            //         observer.next(true);
            //         observer.complete();
            //     }
            // });
        });
    };
    TicketsService.prototype.UpdateSignature = function (data) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            //REST CALL:
            _this.http.post(_this.ticketServiceURL + '/updateSignature', { header: data.header, footer: data.footer, id: data.id, email: _this.Agent.email, nsp: _this.Agent.nsp }).subscribe(function (res) {
                if (res.json()) {
                    var response = res.json();
                    if (response.status == 'ok') {
                        var index = _this.signList.getValue().findIndex(function (x) { return x._id == data.id; });
                        _this.signList.getValue()[index] = response.updatedSignature;
                        observer.next(true);
                        observer.complete();
                    }
                }
            });
            //SOCKET
            // this.socket.emit('updateSignature', { header: data.header, footer: data.footer, id: data.id }, (response) => {
            //     if (response.status == 'ok') {
            //         let index = this.signList.getValue().findIndex(x => x._id == response._id);
            //         this.signList.getValue()[index] = response.updatedSignature;
            //         observer.next({ status: "ok", updatedSignature: response.updatedSignature });
            //         observer.complete();
            //     }
            // });
        });
    };
    TicketsService.prototype.GetSignatures = function () {
        var _this = this;
        this.loading.next(true);
        // this.socket.emit('getSign', {}, (response) => {
        //     if (response.status == 'ok') {
        //         this.signList.next(response.signs);
        //     } else {
        //         this.signList.next([]);
        //     }
        //     this.loading.next(false);
        // });
        this.http.post(this.ticketServiceURL + '/getSignatures', { email: this.Agent.email }).subscribe(function (response) {
            if (response.json()) {
                var data = response.json();
                if (data.status == 'ok') {
                    _this.signList.next(data.signs);
                }
                else {
                    _this.signList.next([]);
                }
                _this.loading.next(false);
            }
        });
    };
    TicketsService.prototype.ToggleSignatures = function (signId, flag) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            //REST CALL
            _this.http.post(_this.ticketServiceURL + '/toggleSign', { signId: signId, check: flag, email: _this.Agent.email, nsp: _this.Agent.nsp }).subscribe(function (res) {
                if (res.json()) {
                    var response = res.json();
                    if (response.status == 'ok') {
                        var index = _this.signList.getValue().findIndex(function (obj) { return obj._id == signId; });
                        _this.signList.getValue()[index].active = flag;
                        _this.signList.getValue()[index].lastModified = response.signs.lastModified;
                        _this.signList.next(_this.signList.getValue());
                        observer.next({ status: "ok", updatedSignature: response.signs });
                        observer.complete();
                    }
                    else {
                        observer.next({ status: "error" });
                        observer.complete();
                    }
                }
            });
            //SOCKET
            // this.socket.emit('toggleSign', { signId: signId, check: flag }, (response) => {
            //     if (response.status == 'ok') {
            //         let index = this.signList.getValue().findIndex(obj => obj._id == signId);
            //         this.signList.getValue()[index].active = flag;
            //         this.signList.getValue()[index].lastModified = response.signs.lastModified;
            //         this.signList.next(this.signList.getValue());
            //         observer.next({ status: "ok", updatedSignature: response.signs });
            //         observer.complete();
            //     }
            //     else {
            //         observer.next({ status: "error" });
            //         observer.complete();
            //     }
            // });
        });
    };
    TicketsService.prototype.DeleteSignatures = function (signId) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            //REST CALL
            _this.http.post(_this.ticketServiceURL + '/deleteSign', { signId: signId, email: _this.Agent.email }).subscribe(function (res) {
                if (res.json()) {
                    var response = res.json();
                    if (response.status == 'ok') {
                        var index = _this.signList.getValue().findIndex(function (obj) { return obj._id == signId; });
                        _this.signList.getValue().splice(index, 1);
                        _this.signList.next(_this.signList.getValue());
                        observer.next({ status: "ok", deleted: response });
                        observer.complete();
                    }
                    else {
                        observer.next({ status: "error" });
                        observer.complete();
                    }
                }
            });
            //SOCKET
            // this.socket.emit('deleteSign', { signId: signId }, (response) => {
            //     if (response.status == 'ok') {
            //         let index = this.signList.getValue().findIndex(obj => obj._id == signId);
            //         this.signList.getValue().splice(index, 1);
            //         this.signList.next(this.signList.getValue());
            //         observer.next({ status: "ok", deleted: response });
            //         observer.complete();
            //     }
            //     else {
            //         observer.next({ status: "error" });
            //         observer.complete();
            //     }
            // });
        });
    };
    TicketsService.prototype.Snooze = function (time) {
        var _this = this;
        //REST CALL
        this.http.post(this.ticketServiceURL + '/snooze', { time: time, selectedThread: this.selectedThread.getValue()._id, email: this.Agent.email, nsp: this.Agent.nsp }).subscribe(function (res) {
            if (res.json()) {
                var response_14 = res.json();
                if (response_14.status == 'ok') {
                    if (response_14.ticketlog.title.toLowerCase().includes('snooze')) {
                        response_14.ticketlog.status = new Date(response_14.ticketlog.status);
                    }
                    _this.ThreadList.next(_this.ThreadList.getValue().map(function (thread) {
                        if (thread._id == _this.selectedThread.getValue()._id) {
                            thread.snoozes = response_14.snooze.snoozes;
                            thread.lasttouchedTime = response_14.snooze.lasttouchedTime;
                            var logfound_13 = false;
                            thread.ticketlog = thread.ticketlog.map(function (log) {
                                if (log.date == new Date(response_14.ticketlog.time_stamp).toDateString()) {
                                    log.groupedticketlogList.unshift(response_14.ticketlog);
                                    logfound_13 = true;
                                }
                                return log;
                            });
                            if (!logfound_13) {
                                thread.ticketlog.unshift({
                                    date: new Date(response_14.ticketlog.time_stamp).toDateString(),
                                    groupedticketlogList: [response_14.ticketlog]
                                });
                            }
                            _this.selectedThread.next(thread);
                        }
                        return thread;
                    }));
                    _this.notification.next({
                        msg: 'Snooze Added successfully',
                        type: 'success',
                        img: 'ok'
                    });
                }
                else {
                    _this.notification.next({
                        msg: 'Error in adding snooze',
                        type: 'attention',
                        img: 'warning'
                    });
                }
            }
        });
        //SOCKET
        // this.socket.emit('snooze', { time: time, selectedThread: this.selectedThread.getValue()._id }, (response) => {
        //     if (response.status == 'ok') {
        //         if (response.ticketlog.title.toLowerCase().includes('snooze')) {
        //             response.ticketlog.status = new Date(response.ticketlog.status);
        //         }
        //         this.ThreadList.next(this.ThreadList.getValue().map(thread => {
        //             if (thread._id == this.selectedThread.getValue()._id) {
        //                 thread.snoozes = response.snooze.snoozes;
        //                 thread.lasttouchedTime = response.snooze.lasttouchedTime;
        //                 let logfound = false;
        //                 thread.ticketlog = thread.ticketlog.map(log => {
        //                     if (log.date == new Date(response.ticketlog.time_stamp).toDateString()) {
        //                         log.groupedticketlogList.unshift(response.ticketlog);
        //                         logfound = true;
        //                     }
        //                     return log;
        //                 });
        //                 if (!logfound) {
        //                     thread.ticketlog.unshift({
        //                         date: new Date(response.ticketlog.time_stamp).toDateString(),
        //                         groupedticketlogList: [response.ticketlog]
        //                     })
        //                 }
        //                 this.selectedThread.next(thread);
        //             }
        //             return thread;
        //         }));
        //         this.notification.next({
        //             msg: 'Snooze Added successfully',
        //             type: 'success',
        //             img: 'ok'
        //         })
        //     }
        //     else {
        //         this.notification.next({
        //             msg: 'Error in adding snooze',
        //             type: 'attention',
        //             img: 'warning'
        //         })
        //     }
        // });
    };
    TicketsService.prototype.TicketMerge = function (ticket, primaryTicketID, secondaryTicketDetails, mergedTicketsDetails, notPrimaryRef) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            //REST CALL
            _this.http.post(_this.ticketServiceURL + '/mergeTicket', {
                primaryTicketID: primaryTicketID,
                mergeGroup: ticket.mergedTicketIds,
                secondaryTicketDetails: secondaryTicketDetails,
                mergedTicketsDetails: mergedTicketsDetails,
                secondaryTicketIDs: notPrimaryRef,
                nsp: _this.Agent.nsp,
                email: _this.Agent.email
            }).subscribe(function (res) {
                if (res.json()) {
                    var response = res.json();
                    if (response.status == 'ok') {
                        _this.UpdateTicket(response.primayTicket._id, response.primayTicket);
                        _this.UpdateTicketPropertyArray(response.secondaryTicket);
                        observer.next({ status: 'ok', primayTicket: response.primayTicket, secondaryTicket: response.secondaryTicket });
                        observer.complete();
                    }
                    else {
                        observer.next({ status: 'error' });
                        observer.complete();
                    }
                }
            });
            //SOCKET
            // this.socket.emit('mergeTicket', {
            //     primaryTicketID: primaryTicketID,
            //     mergeGroup: ticket.mergedTicketIds,
            //     secondaryTicketDetails: secondaryTicketDetails,
            //     mergedTicketsDetails: mergedTicketsDetails,
            //     secondaryTicketIDs: notPrimaryRef
            // }, (response) => {
            //     /**
            //      * @Response
            //      *  1.status <string>
            //      *  2.primayTicket: Object<Ticket>
            //      *  3.secondaryTicket : Array<Object<secondaryTicket>> }
            //      */
            //     if (response.status == 'ok') {
            //         // console.log('response', response);
            //         this.UpdateTicket(response.primayTicket._id, response.primayTicket);
            //         this.UpdateTicketPropertyArray(response.secondaryTicket);
            //         observer.next({ status: 'ok', primayTicket: response.primayTicket, secondaryTicket: response.secondaryTicket });
            //         observer.complete();
            //     }
            //     else {
            //         observer.next({ status: 'error' });
            //         observer.complete();
            //     }
            // });
        });
    };
    TicketsService.prototype.DemergeTicket = function (primaryReference, SecondaryReference) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            //REST CALL
            _this.http.post(_this.ticketServiceURL + '/demergeTicket', {
                primaryReference: primaryReference,
                SecondaryReference: SecondaryReference,
                nsp: _this.Agent.nsp,
                email: _this.Agent.email
            }).subscribe(function (res) {
                if (res.json()) {
                    var response = res.json();
                    // console.log(response)
                    if (response.status == 'ok') {
                        _this.UpdateTicketPropertyArray([response.primayTicket, response.secondaryTicket]);
                        _this.notification.next({
                            msg: 'Tickets De-merged successfully',
                            type: 'success',
                            img: 'ok'
                        });
                        observer.next(response);
                        observer.complete();
                    }
                    else {
                        _this.notification.next({
                            msg: 'Error in de-merging tickets!',
                            type: 'error',
                            img: 'warning'
                        });
                        observer.error(response);
                    }
                }
            });
            //SOCKET
            // this.socket.emit('demergeTicket', {
            //     primaryReference: primaryReference,
            //     SecondaryReference: SecondaryReference
            // }, response => {
            //     if (response.status == 'ok') {
            //         // this.UpdateTicket(response.primayTicket._id, response.primayTicket);
            //         this.UpdateTicketPropertyArray([response.primayTicket, response.secondaryTicket]);
            //         this.notification.next({
            //             msg: 'Tickets De-merged successfully',
            //             type: 'success',
            //             img: 'ok'
            //         });
            //         observer.next(response);
            //         observer.complete();
            //     } else {
            //         this.notification.next({
            //             msg: 'Error in de-merging tickets!',
            //             type: 'error',
            //             img: 'warning'
            //         });
            //         observer.error(response);
            //     }
            // })
        });
    };
    TicketsService.prototype.sendemailtousers = function () {
        var _this = this;
        this.http.post(this.ticketServiceURL + '/abc', {}).subscribe(function (res) {
            var response = res.json();
            if (response.status == "ok") {
                _this.notification.next({
                    msg: 'Email sent to users successfully',
                    type: 'success',
                    img: 'ok'
                });
            }
        });
    };
    TicketsService.prototype.sendemailtoagentss = function () {
        var _this = this;
        this.http.post(this.ticketServiceURL + '/ghi', {}).subscribe(function (res) {
            var response = res.json();
            if (response.status == "ok") {
                _this.notification.next({
                    msg: 'Email sent to agents successfully',
                    type: 'success',
                    img: 'ok'
                });
            }
        });
    };
    TicketsService.prototype.sendemailtoCC = function () {
        var _this = this;
        this.http.post(this.ticketServiceURL + '/def', {}).subscribe(function (res) {
            var response = res.json();
            if (response.status == "ok") {
                _this.notification.next({
                    msg: 'Email sent to cc successfully',
                    type: 'success',
                    img: 'ok'
                });
            }
        });
    };
    TicketsService.prototype.sendreponse = function () {
        var _this = this;
        this.http.post(this.ticketServiceURL + '/res', {}).subscribe(function (res) {
            var response = res.json();
            if (response.status == "ok") {
                _this.notification.next({
                    msg: 'res sent',
                    type: 'success',
                    img: 'ok'
                });
            }
        });
    };
    TicketsService.prototype.UpdateDynamicProperty = function (threadID, fieldName, fieldvalue, assignment) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            //REST CALL
            _this.http.post(_this.ticketServiceURL + '/updateDynamicProperty', { tid: threadID, name: fieldName, value: fieldvalue, email: _this.Agent.email, nsp: _this.Agent.nsp, assignment: assignment ? assignment : '' }).subscribe(function (res) {
                if (res.json()) {
                    var response_15 = res.json();
                    if (response_15.status == 'ok') {
                        _this.ThreadList.next(_this.ThreadList.getValue().map(function (thread) {
                            if (thread._id == threadID) {
                                var logfound_14 = false;
                                if (!thread.dynamicFields)
                                    thread.dynamicFields = {};
                                thread.dynamicFields[fieldName] = fieldvalue;
                                thread.ticketlog = thread.ticketlog.map(function (log) {
                                    if (log.date == new Date(response_15.ticketlog.time_stamp).toDateString()) {
                                        log.groupedticketlogList.unshift(response_15.ticketlog);
                                        logfound_14 = true;
                                    }
                                    return log;
                                });
                                if (!logfound_14) {
                                    thread.ticketlog.unshift({
                                        date: new Date(response_15.ticketlog.time_stamp).toDateString(),
                                        groupedticketlogList: [response_15.ticketlog]
                                    });
                                }
                                _this.selectedThread.next(thread);
                            }
                            _this.setNotification('Dynamic field edited!', 'success', 'ok');
                            return thread;
                        }));
                        observer.next({ status: "ok", ticketlog: response_15.ticketlog });
                        observer.complete();
                    }
                    else {
                        _this.setNotification("Error in editing dynamic field", 'error', 'warning');
                        observer.next({ status: "error" });
                        observer.complete();
                    }
                }
            }, function (err) {
                _this.setNotification("Error in editing dynamic field", 'error', 'warning');
                observer.next({ status: "error" });
                observer.complete();
            });
            //SOCKET
            // this.socket.emit('updateDynamicProperty', { tid: threadID, name: fieldName, value: fieldvalue }, (response) => {
            //     console.log(response);
            //     if (response.status == 'ok') {
            //         this.ThreadList.next(this.ThreadList.getValue().map(thread => {
            //             if (thread._id == threadID) {
            //                 let logfound = false;
            //                 thread.dynamicFields[fieldName] = fieldvalue;
            //                 thread.ticketlog = thread.ticketlog.map(log => {
            //                     if (log.date == new Date(response.ticketlog.time_stamp).toDateString()) {
            //                         log.groupedticketlogList.unshift(response.ticketlog);
            //                         logfound = true;
            //                     }
            //                     return log;
            //                 });
            //                 if (!logfound) {
            //                     thread.ticketlog.unshift({
            //                         date: new Date(response.ticketlog.time_stamp).toDateString(),
            //                         groupedticketlogList: [response.ticketlog]
            //                     })
            //                 }
            //                 this.selectedThread.next(thread);
            //             }
            //             return thread;
            //         }));
            //         this.setNotification('Dynamic field edited!', 'success', 'ok');
            //         observer.next({ status: "ok" });
            //         observer.complete();
            //     } else {
            //         this.setNotification("Error!", 'error', 'warning');
            //         observer.next({ status: "error" });
            //         observer.complete();
            //     }
            //     //Ticket Log update
            // })
        });
    };
    TicketsService.prototype.exportSlaReport = function (datafrom, datato, emails, wise, ids) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.http.post(_this.ticketServiceURL + '/exportSlaReport', { datafrom: datafrom ? new Date(datafrom) : '', datato: datafrom ? new Date(datato) : '', emails: emails, wise: wise, ids: ids, nsp: _this.Agent.nsp, email: _this.Agent.email }).subscribe(function (res) {
                if (res.json()) {
                    var response = res.json();
                    if (response.status == 'ok') {
                        observer.next({ status: "ok" });
                        observer.complete();
                    }
                    else {
                        observer.next(undefined);
                        observer.complete();
                    }
                }
            });
        });
    };
    TicketsService.prototype.exportDays = function (datafrom, datato, keys, emails) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            //REST CALL
            _this.http.post(_this.ticketServiceURL + '/exportdays', { datafrom: new Date(datafrom), datato: new Date(datato), filters: _this.Filters.getValue(), keys: keys, emails: emails, email: _this.Agent.email, nsp: _this.Agent.nsp }).subscribe(function (res) {
                if (res.json()) {
                    var response = res.json();
                    if (response.status == 'ok') {
                        observer.next({ status: "ok", det: response.details });
                        observer.complete();
                    }
                    else {
                        observer.next(undefined);
                        observer.complete();
                    }
                }
            });
            //SOCKET
            // this.socket.emit('exportdays', { datafrom: new Date(datafrom), datato: new Date(datato), filters: this.Filters.getValue(), keys: keys, emails: emails }, (response) => {
            //     if (response.status == "ok") {
            //         observer.next({ status: "ok", det: response.details });
            //         observer.complete();
            //     }
            //     else {
            //         observer.next(undefined);
            //         observer.complete();
            //     }
            // });
        });
    };
    TicketsService.prototype.ExportCustomData = function () {
        var _this = this;
        this.http.get(this.ticketServiceURL + '/exportCustomTickets').subscribe(function (response) {
            var data = response.json();
            _this.ExportToExcel(data[0], 'Tickets_Total');
            _this.ExportToExcel(data[1], 'Tickets_WP');
        });
    };
    TicketsService.prototype.ExportToExcel = function (data, filename) {
        try {
            filename = filename + new Date().getTime();
            json2excel({
                data: data,
                name: filename,
                formateDate: 'yyyy/mm/dd'
            });
        }
        catch (error) {
            console.error('export error');
            console.log(error);
        }
    };
    TicketsService.prototype.getGroupedDetails = function (data) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socket.emit('getGroupeddata', { mergedTicketIds: data }, function (response) {
                // console.log(response);
                if (response.status == "ok") {
                    observer.next(response.details);
                    observer.complete();
                }
                else {
                    observer.next(undefined);
                    observer.complete();
                }
            });
        });
    };
    // public Test() {
    //     this.socket.emit('testautomation', {}, (response) => {
    //         // console.log('Requested Test Ticket Message');
    //     });
    // }
    // private GetGroups() {
    //     // this.socket.emit('getGroupByNSP', {}, (response) => {
    //     //     //console.log(response.rooms);
    //     //     if (response.status == 'ok') {
    //     //         this.groupsList.next(response.group_data);
    //     //     }
    //     // });
    //     this.http.post(this.ticketServiceURL + '/getGroupByNSP', { email: this.Agent.email, nsp: this.Agent.nsp }).subscribe(response => {
    //         if (response.json()) {
    //             let data = response.json();
    //             if (data.status == 'ok') {
    //                 this.groupsList.next(data.group_data);
    //             }
    //         }
    //     })
    // }
    //Ticket notes
    TicketsService.prototype.editNote = function (properties, tids) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            properties.added_at = new Date().toISOString();
            properties.added_by = _this.Agent.email;
            //REST CALL
            _this.http.post(_this.ticketServiceURL + '/editTicketNote', { properties: properties, tids: tids, email: _this.Agent.email, nsp: _this.Agent.nsp }).subscribe(function (res) {
                if (res.json()) {
                    var response_16 = res.json();
                    if (response_16.status == 'ok') {
                        _this.ThreadList.next(_this.ThreadList.getValue().map(function (thread) {
                            tids.map(function (tid) {
                                if (thread._id == tid) {
                                    var logfound_15 = false;
                                    if (!thread.ticketNotes)
                                        thread.ticketNotes = [];
                                    thread.ticketNotes = response_16.note;
                                    thread.ticketlog = thread.ticketlog.map(function (log) {
                                        if (log.date == new Date(response_16.ticketlog.time_stamp).toDateString()) {
                                            log.groupedticketlogList.unshift(response_16.ticketlog);
                                            logfound_15 = true;
                                        }
                                        return log;
                                    });
                                    if (!logfound_15) {
                                        thread.ticketlog.unshift({
                                            date: new Date(response_16.ticketlog.time_stamp).toDateString(),
                                            groupedticketlogList: [response_16.ticketlog]
                                        });
                                    }
                                    _this.selectedThread.next(thread);
                                    _this.notification.next({
                                        msg: "Note added successfully!",
                                        type: 'success',
                                        img: 'ok'
                                    });
                                }
                            });
                            return thread;
                        }));
                        observer.next({ status: 'ok' });
                        observer.complete();
                    }
                    else {
                        observer.next({ status: 'error' });
                        observer.complete();
                    }
                }
            });
            //SOCKET
            // this.socket.emit('editTicketNote', { properties: properties, tids: tids }, (response) => {
            //     if (response.status == 'ok') {
            //         let msg = '';
            //         this.ThreadList.next(this.ThreadList.getValue().map(thread => {
            //             tids.map(tid => {
            //                 if (thread._id == tid) {
            //                     let logfound = false;
            //                     if (!thread.ticketNotes) thread.ticketNotes = [];
            //                     thread.ticketNotes = response.note;
            //                     thread.ticketlog = thread.ticketlog.map(log => {
            //                         if (log.date == new Date(response.ticketlog.time_stamp).toDateString()) {
            //                             log.groupedticketlogList.unshift(response.ticketlog);
            //                             logfound = true;
            //                         }
            //                         return log;
            //                     });
            //                     if (!logfound) {
            //                         thread.ticketlog.unshift({
            //                             date: new Date(response.ticketlog.time_stamp).toDateString(),
            //                             groupedticketlogList: [response.ticketlog]
            //                         })
            //                     }
            //                     this.selectedThread.next(thread);
            //                     this.notification.next({
            //                         msg: "Note added successfully!",
            //                         type: 'success',
            //                         img: 'ok'
            //                     });
            //                 }
            //             });
            //             return thread;
            //         }));
            //         observer.next({ status: 'ok' });
            //         observer.complete();
            //     }
            //     else {
            //         observer.next({ status: 'error' });
            //         observer.complete();
            //     }
            // });
        });
    };
    TicketsService.prototype.DeleteNote = function (noteId, note) {
        var _this = this;
        //REST CALL
        this.http.post(this.ticketServiceURL + '/deleteNote', { noteId: noteId, id: this.selectedThread.getValue()._id, note: note.ticketNote, email: this.Agent.email, nsp: this.Agent.nsp }).subscribe(function (res) {
            if (res.json()) {
                var response_17 = res.json();
                if (response_17.status == 'ok') {
                    _this.ThreadList.next(_this.ThreadList.getValue().map(function (thread) {
                        if (thread._id == _this.selectedThread.getValue()._id) {
                            var logfound_16 = false;
                            thread.ticketNotes = response_17.deletedresult;
                            thread.ticketlog = thread.ticketlog.map(function (log) {
                                if (log.date == new Date(response_17.ticketlog.time_stamp).toDateString()) {
                                    log.groupedticketlogList.unshift(response_17.ticketlog);
                                    logfound_16 = true;
                                }
                                return log;
                            });
                            if (!logfound_16) {
                                thread.ticketlog.unshift({
                                    date: new Date(response_17.ticketlog.time_stamp).toDateString(),
                                    groupedticketlogList: [response_17.ticketlog]
                                });
                            }
                            _this.selectedThread.next(thread);
                            _this.notification.next({
                                msg: "Note deleted Successfully!",
                                type: 'success',
                                img: 'ok'
                            });
                        }
                        return thread;
                    }));
                }
                else {
                    _this.notification.next({
                        msg: 'ERROR! Note not deleted.',
                        type: 'attention',
                        img: 'warning'
                    });
                }
            }
        });
        //SOCKET
        // this.socket.emit('deleteNote', { noteId: noteId, id: this.selectedThread.getValue()._id, note: note.ticketNote }, (response) => {
        //     if (response.status == 'ok') {
        //         this.ThreadList.next(this.ThreadList.getValue().map(thread => {
        //             if (thread._id == this.selectedThread.getValue()._id) {
        //                 let logfound = false;
        //                 thread.ticketNotes = response.deletedresult;
        //                 thread.ticketlog = thread.ticketlog.map(log => {
        //                     if (log.date == new Date(response.ticketlog.time_stamp).toDateString()) {
        //                         log.groupedticketlogList.unshift(response.ticketlog);
        //                         logfound = true;
        //                     }
        //                     return log;
        //                 });
        //                 if (!logfound) {
        //                     thread.ticketlog.unshift({
        //                         date: new Date(response.ticketlog.time_stamp).toDateString(),
        //                         groupedticketlogList: [response.ticketlog]
        //                     })
        //                 }
        //                 this.selectedThread.next(thread);
        //                 this.notification.next({
        //                     msg: "Note deleted Successfully!",
        //                     type: 'success',
        //                     img: 'ok'
        //                 });
        //             }
        //             return thread;
        //         }));
        //     }
        //     else {
        //         this.notification.next({
        //             msg: 'Note not deleted successfully!',
        //             type: 'attention',
        //             img: 'warning'
        //         });
        //     }
        // });
    };
    TicketsService.prototype.TestReply = function () {
        //console.log('Test Reply');
        this.socket.emit('testTicketMessage', {}, function (response) {
            // console.log('Requested Test Ticket Message');
            // console.log(response);
        });
    };
    TicketsService.prototype.ForwardMessageAsTicket = function (email, message, ticket) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socket.emit('forwardMessageAsTicket', { email: email, message: message, ticket: ticket }, function (response) {
                if (response.status == "ok") {
                    observer.next(response);
                    observer.complete();
                }
                else {
                    observer.next(undefined);
                    observer.complete();
                }
            });
        });
    };
    TicketsService.prototype.setActiveStateCount = function (count) {
        this.activeChatStateCount.next(count);
    };
    TicketsService.prototype.RouteToTickets = function () {
        this._router.navigateByUrl('/tickets');
    };
    TicketsService.prototype.ExecuteScenario = function (scenario, ids, tickets) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            //REST CALL
            _this.http.post(_this.ticketServiceURL + '/executeScenario', { scenario: scenario, ids: ids, tickets: tickets, email: _this.Agent.email, nsp: _this.Agent.nsp }).subscribe(function (res) {
                if (res.json()) {
                    var response_18 = res.json();
                    if (response_18.status == 'ok') {
                        _this.ThreadList.next(_this.ThreadList.getValue().map(function (thread) {
                            ids.map(function (tid) {
                                if (thread._id == tid) {
                                    //set assets
                                    if (response_18.updatedProperties.hasOwnProperty('$set')) {
                                        Object.keys(response_18.updatedProperties.$set).map(function (key) {
                                            switch (key) {
                                                case 'state':
                                                    thread.state = response_18.updatedProperties.$set.state;
                                                    break;
                                                case 'priority':
                                                    thread.priority = response_18.updatedProperties.$set.priority;
                                                    break;
                                                case 'viewState':
                                                    thread.viewState = response_18.updatedProperties.$set.viewState;
                                                    break;
                                                case 'assigned_to':
                                                    thread.assigned_to = response_18.updatedProperties.$set.assigned_to;
                                                    break;
                                                case 'group':
                                                    thread.group = response_18.updatedProperties.$set.group;
                                                    break;
                                            }
                                        });
                                    }
                                    //push assets
                                    if (response_18.updatedProperties.hasOwnProperty('$push')) {
                                        Object.keys(response_18.updatedProperties.$push).map(function (key) {
                                            switch (key) {
                                                case 'ticketNotes':
                                                    if (!thread.ticketNotes)
                                                        thread.ticketNotes = [];
                                                    thread.ticketNotes.unshift(response_18.updatedProperties.$push.ticketNotes);
                                                    break;
                                                case 'tags':
                                                    if (!thread.tags)
                                                        thread.tags = [];
                                                    thread.tags = thread.tags.concat(response_18.updatedProperties.$push.tags);
                                                    break;
                                                case 'watchers':
                                                    if (!thread.watchers)
                                                        thread.watchers = [];
                                                    thread.watchers = thread.watchers.concat(response_18.updatedProperties.$push.watchers);
                                                    break;
                                                case 'todo':
                                                    if (!thread.todo)
                                                        thread.todo = [];
                                                    thread.todo = thread.todo.concat(response_18.updatedProperties.$push.todo);
                                                    break;
                                                case 'ticketlog':
                                                    var copyOfStatus = JSON.parse(JSON.stringify(response_18.updatedProperties.$push.ticketlog.status));
                                                    copyOfStatus = JSON.stringify(copyOfStatus);
                                                    response_18.updatedProperties.$push.ticketlog.status = copyOfStatus;
                                                    var logfound_17 = false;
                                                    thread.ticketlog = thread.ticketlog.map(function (log) {
                                                        if (log.date == new Date(response_18.updatedProperties.$push.ticketlog.time_stamp).toDateString()) {
                                                            log.groupedticketlogList.unshift(response_18.updatedProperties.$push.ticketlog);
                                                            logfound_17 = true;
                                                        }
                                                        return log;
                                                    });
                                                    if (!logfound_17) {
                                                        thread.ticketlog.unshift({
                                                            date: new Date(response_18.updatedProperties.$push.ticketlog.time_stamp).toDateString(),
                                                            groupedticketlogList: [response_18.updatedProperties.$push.ticketlog]
                                                        });
                                                    }
                                                    break;
                                            }
                                        });
                                    }
                                    _this.selectedThread.next(thread);
                                }
                            });
                            return thread;
                        }));
                        _this.notification.next({
                            msg: 'Scenario executed successfully!',
                            type: 'success',
                            img: 'ok'
                        });
                        observer.next(response_18);
                        observer.complete();
                    }
                    else {
                        _this.notification.next({
                            msg: "Error in executing scenario!",
                            type: 'warning',
                            img: 'warning'
                        });
                        observer.next(undefined);
                        observer.complete();
                    }
                }
            });
            //SOCKET
            // this.socket.emit('executeScenario', { scenario: scenario, ids: ids, tickets: tickets }, (response) => {
            //     if (response.status == "ok") {
            //         /**
            //         in response:updateObject is coming:
            //         map in ids..
            //         1.setobject --> = in string i.e.assigned_to,group,state,priority etc.
            //         2.pushobj -->push in array i.e. tags,tasks,ticketnotes
            //         3.renameobj --> no need
            //          */
            //         this.ThreadList.next(this.ThreadList.getValue().map(thread => {
            //             ids.map(tid => {
            //                 if (thread._id == tid) {
            //                     //set assets
            //                     if (response.updatedProperties.hasOwnProperty('$set')) {
            //                         Object.keys(response.updatedProperties.$set).map(key => {
            //                             switch (key) {
            //                                 case 'state':
            //                                     thread.state = response.updatedProperties.$set.state;
            //                                     break;
            //                                 case 'priority':
            //                                     thread.priority = response.updatedProperties.$set.priority;
            //                                     break;
            //                                 case 'viewState':
            //                                     thread.viewState = response.updatedProperties.$set.viewState;
            //                                     break;
            //                                 case 'assigned_to':
            //                                     thread.assigned_to = response.updatedProperties.$set.assigned_to;
            //                                     break;
            //                                 case 'group':
            //                                     thread.group = response.updatedProperties.$set.group;
            //                                     break;
            //                             }
            //                         })
            //                     }
            //                     //push assets
            //                     if (response.updatedProperties.hasOwnProperty('$push')) {
            //                         Object.keys(response.updatedProperties.$push).map(key => {
            //                             switch (key) {
            //                                 case 'ticketNotes':
            //                                     if (!thread.ticketNotes) thread.ticketNotes = [];
            //                                     thread.ticketNotes.unshift(response.updatedProperties.$push.ticketNotes);
            //                                     break;
            //                                 case 'tags':
            //                                     if (!thread.tags) thread.tags = [];
            //                                     thread.tags = (thread.tags as Array<string>).concat(response.updatedProperties.$push.tags);
            //                                     break;
            //                                 case 'watchers':
            //                                     if (!thread.watchers) thread.watchers = [];
            //                                     thread.watchers = (thread.watchers as Array<string>).concat(response.updatedProperties.$push.watchers);
            //                                     break;
            //                                 case 'todo':
            //                                     if (!thread.todo) thread.todo = [];
            //                                     thread.todo = (thread.todo as Array<string>).concat(response.updatedProperties.$push.todo);
            //                                     break;
            //                                 case 'ticketlog':
            //                                     console.log(response.updatedProperties.$push.ticketlog);
            //                                     // response.updatedProperties.$push.ticketlog.status.map(res => {
            //                                     //     switch (res.name) {
            //                                     //         case 'STATEASSIGN': res.name = "Ticket marked as"; break;
            //                                     //         case 'PRIORITYASSIGN': res.name = "Priority Assigned as"; break;
            //                                     //         case 'AGENTASSIGN': res.name = "Agent Assigned as"; break;
            //                                     //         case 'GROUPASSIGN': res.name = "Group Assigned as"; break;
            //                                     //         case 'VIEWSTATEASSIGN': res.name = "Ticket marked as"; break;
            //                                     //         case 'NOTEASSIGN': res.name = " Note Added"; break;
            //                                     //         case 'TAGASSIGN': res.name = "Tag Added"; break;
            //                                     //         case 'TASKASSIGN': res.name = "Task Added"; break;
            //                                     //         case 'WATCHERASSIGN': res.name = "Watcher Assigned"; break;
            //                                     //     }
            //                                     //     return response.updatedProperties.$push.ticketlog.status;
            //                                     // })
            //                                     let copyOfStatus = JSON.parse(JSON.stringify(response.updatedProperties.$push.ticketlog.status));
            //                                     copyOfStatus = JSON.stringify(copyOfStatus);
            //                                     response.updatedProperties.$push.ticketlog.status = copyOfStatus;
            //                                     let logfound = false;
            //                                     thread.ticketlog = thread.ticketlog.map(log => {
            //                                         if (log.date == new Date(response.updatedProperties.$push.ticketlog.time_stamp).toDateString()) {
            //                                             log.groupedticketlogList.unshift(response.updatedProperties.$push.ticketlog);
            //                                             logfound = true;
            //                                         }
            //                                         return log;
            //                                     });
            //                                     if (!logfound) {
            //                                         thread.ticketlog.unshift({
            //                                             date: new Date(response.updatedProperties.$push.ticketlog.time_stamp).toDateString(),
            //                                             groupedticketlogList: [response.updatedProperties.$push.ticketlog]
            //                                         })
            //                                     }
            //                                     break;
            //                             }
            //                         })
            //                     }
            //                     this.selectedThread.next(thread);
            //                 }
            //             })
            //             return thread;
            //         }));
            //         this.notification.next({
            //             msg: 'Scenario executed successfully!',
            //             type: 'success',
            //             img: 'ok'
            //         });
            //         observer.next(response);
            //         observer.complete();
            //     }
            //     else {
            //         this.notification.next({
            //             msg: "Error in executing scenario!",
            //             type: 'warning',
            //             img: 'warning'
            //         });
            //         observer.next(undefined);
            //         observer.complete();
            //     }
            // });
        });
    };
    TicketsService.prototype.RevertScenario = function (ids) {
        var _this = this;
        //REST CALL
        this.http.post(this.ticketServiceURL + '/revertScenario', { ids: ids, email: this.Agent.email, nsp: this.Agent.nsp }).subscribe(function (res) {
            if (res.json()) {
                var response_19 = res.json();
                if (response_19.status == "ok") {
                    _this.ThreadList.next(_this.ThreadList.getValue().map(function (thread) {
                        if (thread._id == ids[0]) {
                            var logfound_18 = false;
                            thread = response_19.revertScenario;
                            thread.ticketlog = thread.ticketlog.map(function (log) {
                                if (log.date == new Date(response_19.ticketlog.time_stamp).toDateString()) {
                                    log.groupedticketlogList.unshift(response_19.ticketlog);
                                    logfound_18 = true;
                                }
                                return log;
                            });
                            if (!logfound_18) {
                                thread.ticketlog.unshift({
                                    date: new Date(response_19.ticketlog.time_stamp).toDateString(),
                                    groupedticketlogList: [response_19.ticketlog]
                                });
                            }
                            _this.selectedThread.next(thread);
                            _this.notification.next({
                                msg: "Scenario reverted successfully!",
                                type: 'success',
                                img: 'ok'
                            });
                        }
                        return thread;
                    }));
                }
                else {
                    _this.notification.next({
                        msg: "Error in reverting successfully!",
                        type: 'error',
                        img: 'warning'
                    });
                }
            }
        });
        //SOCKET
        // this.socket.emit('revertScenario', { ids: ids }, (response) => {
        //     if (response.status == "ok") {
        //         this.ThreadList.next(this.ThreadList.getValue().map(thread => {
        //             if (thread._id == ids[0]) {
        //                 let logfound = false;
        //                 thread = response.revertScenario;
        //                 thread.ticketlog = thread.ticketlog.map(log => {
        //                     if (log.date == new Date(response.ticketlog.time_stamp).toDateString()) {
        //                         log.groupedticketlogList.unshift(response.ticketlog);
        //                         logfound = true;
        //                     }
        //                     return log;
        //                 });
        //                 if (!logfound) {
        //                     thread.ticketlog.unshift({
        //                         date: new Date(response.ticketlog.time_stamp).toDateString(),
        //                         groupedticketlogList: [response.ticketlog]
        //                     })
        //                 }
        //                 this.selectedThread.next(thread);
        //                 this.notification.next({
        //                     msg: "Scenario reverted successfully!",
        //                     type: 'success',
        //                     img: 'ok'
        //                 });
        //             }
        //             return thread;
        //         }));
        //     }
        //     else {
        //         this.notification.next({
        //             msg: "Error in reverting successfully!",
        //             type: 'error',
        //             img: 'warning'
        //         });
        //     }
        // });
    };
    TicketsService.prototype.saveFiltersOnLocalStorage = function (filters) {
        localStorage.setItem('ticketFilters', JSON.stringify(filters));
    };
    TicketsService.prototype.getFiltersFromLocalStorage = function () {
        return JSON.parse(localStorage.getItem('ticketFilters'));
    };
    TicketsService = __decorate([
        core_1.Injectable()
    ], TicketsService);
    return TicketsService;
}());
exports.TicketsService = TicketsService;
//# sourceMappingURL=TicketsService.js.map