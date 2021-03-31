import { group } from '@angular/core';
import { Injectable } from '@angular/core';

//RxJs Imsports
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Http } from '@angular/http';
//End RxJs Imports

//Services
import { SocketService } from "../services/SocketService";
import { PushNotificationsService } from '../services/NotificationService';
import { AuthService } from './AuthenticationService';
import { GlobalStateService } from './GlobalStateService';
import { TicketAutomationService } from './LocalServices/TicketAutomationService';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { defaultCipherList } from 'constants';
import { environment } from '../environments/environment';
import { AgentService } from './AgentService';
let { json2excel } = require('js2excel');


@Injectable()

export class TicketsService {


    /**
     * @Data
        OPEN : ARRAY<any>
        PENDING : ARRAY<any>
        SOLVED : ARray<any>
    **/

    private ticketServiceURL = '';
    public ThreadList: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
    // public newTickets: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
    public Filters: BehaviorSubject<any> = new BehaviorSubject({});
    private PaginationCount: BehaviorSubject<number> = new BehaviorSubject(0);
    public TicketCount: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
    public IncomingEmails: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
    public IncomingEmailsByNSP: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
    public groupsList: BehaviorSubject<any> = new BehaviorSubject(undefined);
    public EmailData: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
    public Initialized: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public checkedList: BehaviorSubject<any> = new BehaviorSubject([]);
    public socket: SocketIOClient.Socket;
    private Agent: any;
    public selectedThread: BehaviorSubject<any> = new BehaviorSubject({});

    private notification: BehaviorSubject<any> = new BehaviorSubject('');

    public activeChatStateCount: BehaviorSubject<number> = new BehaviorSubject(undefined);

    arr = [];
    tempArr = [];
    group: any;

    private reducedTicketLog = [];
    // all_agent = [];
    private ticketChunk: number = 0;
    show = false;
    updated: Boolean = new Boolean(false);
    //Loading Variables
    private loadingTickets: BehaviorSubject<boolean> = new BehaviorSubject(true);
    private loadingMoreTickets: BehaviorSubject<boolean> = new BehaviorSubject(false);
    private getloadingCount: BehaviorSubject<boolean> = new BehaviorSubject(true);
    public loading: BehaviorSubject<any> = new BehaviorSubject(false);
    public end: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public isTicketViewLoaded: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public showListUponTypeClick: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public showFilterArea: BehaviorSubject<boolean> = new BehaviorSubject(true);
    public ActualTicketFetchedCount: BehaviorSubject<number> = new BehaviorSubject(0);
    private url: any;

    //for email templates
    signList: BehaviorSubject<any> = new BehaviorSubject([]);
    GroupData: BehaviorSubject<any> = new BehaviorSubject([]);

    private lastResponse: any;
    notifPermissions: any;
    ticketPermissions: any;
    headerSearch: Subject<string> = new Subject();
    activationLoading: BehaviorSubject<boolean> = new BehaviorSubject(false);

    constructor(_socket: SocketService, private _authService: AuthService, private _agentService: AgentService, private _ticketautomationservice: TicketAutomationService, private http: Http, private _globalApplicationStateService: GlobalStateService, private _notificationService: PushNotificationsService, private _router: Router) {
        // console.log('Ticket Service Init');
        //watching if notification is blocked by user, then ask again, but chrome doesn't allow it.
        // console.log(this.getFiltersFromLocalStorage());
        if (this.getFiltersFromLocalStorage()) {
            this.Filters.next(this.getFiltersFromLocalStorage());
        }
        _authService.RestServiceURL.subscribe(url => {
            this.ticketServiceURL = url + '/api/tickets';
        })

        if (this._notificationService.permission == 'default' || 'denied') {
            this._notificationService.requestPermission();
        }
        this._authService.getSettings().subscribe(settings => {
            this.ticketPermissions = settings.permissions.tickets;
        });
        this._agentService.GetWindowNotificationSettings().subscribe(settings => {
            if (settings && settings.windowNotifications) {
                this.notifPermissions = settings.windowNotifications;
            }
        })
        this._authService.getAgent().subscribe(agent => {
            this.Agent = agent;
        });
        this._authService.getServer().subscribe(url => {
            this.url = url;
        })

        this._ticketautomationservice.Groups.subscribe(group => {
            // console.log(group);
            this.group = group;
        })


        _socket.getSocket().subscribe((data) => {
            if (data) {
                this.socket = data;
                if (!this.Initialized.getValue()) {
                    // this.GetGroups();
                    this.GetSignatures();
                    this.getIncomingEmailsByNsp();
                }

                this.Filters.debounceTime(1500).subscribe(filter => {
                    //console.log('Filter in Ticket List', filter);
                    if (!this.Initialized.getValue()) {
                        // if(this.Agent && this.Agent.nsp != '/sbtjapan.com') this.GetTicketCount(filter);
                        this.InitializeTicketList(filter, false);
                    } else {
                        if (JSON.stringify(filter) == this.lastResponse && !filter.reload) {
                            this.loadingTickets.next(false);
                            this.loading.next(false);
                            return;
                        }
                        else {
                            // console.log('Reload');
                            this.lastResponse = JSON.stringify(filter)
                            // if(this.Agent && this.Agent.nsp != '/sbtjapan.com') this.GetTicketCount(filter);
                            this.InitializeTicketList(filter, true);
                        }
                    }
                });
                // this.getSurveyResult(this.selectedThread.getValue()._id);
                this.socket.on('newTicket', (data) => {
                    // console.log('New Ticket', data);
                    /**
                    * @Note To Avoid Double Update ignore this event when agent is Admin and Assigned Person at the same time.
                    *
                    */
                    if (data.ignoreAdmin) return;
                    data.ticket.synced = false;
                    data.ticket.messages = [];

                    data.ticket.ticketlog = (data.ticket.ticketlog && data.ticket.ticketlog.length) ? this.transformTicketLog(data.ticket.ticketlog) : [];
                    if (!this.ThreadList.getValue().some(t => t._id == data.ticket._id)) {
                        this.ThreadList.getValue().unshift(data.ticket);
                        this.ThreadList.next(this.ThreadList.getValue());
                        this.AddTicketCount(data.ticket);
                        // this.newTickets.getValue().push(data.ticket);
                        // this.newTickets.next(this.newTickets.getValue());
                        //Ticket Notification
                        if (this.notifPermissions && this.notifPermissions.newTicket) {
                            let notif_data: Array<any> = [];
                            notif_data.push({
                                'tag': data.ticket._id + 'new',
                                'title': 'You have recieved a new ticket!',
                                'alertContent': data.ticket.subject,
                                'icon': "../assets/img/favicon.ico",
                                'url': "/tickets/ticket-view/" + data.ticket._id
                            });
                            this._notificationService.generateNotification(notif_data);
                        }
                    }
                });
                /**
                 *  @Data : { tid: data.tid, status: result.value.state }
                 */
                this.socket.on('removeTicket', (data) => {
                    //console.log('Remove Ticket');
                    //console.log(data);

                    if ((this.Agent.role == 'admin' || this.Agent.role == 'superadmin') || (this.ticketPermissions.canView == 'all')) return;
                    if (data.email == this.Agent.email) return;
                    // console.log('Removing');

                    this.SubstractTicketCount(data.ticket);
                    this.ThreadList.next(this.ThreadList.getValue().filter(thread => {
                        return (thread._id != data.tid)
                    }));
                    if (this.selectedThread.getValue() && this.selectedThread.getValue()._id == data.tid) {
                        // this.selectedThread.next(undefined);
                        this._globalApplicationStateService.NavigateForce('/tickets/list');
                    }
                });
                /**
                 * @Data { tid: data.tid, ticket: result.value.state, ticketlog: result.value.ticketlog ,ignoreAdmin : boolean}
                 */
                this.socket.on('updateTicket', (data) => {

                    //('Update ticket');
                    /**
                     * @Note To Avoid Double Update ignore this event when agent is Admin and Assigned Person at the same time.
                     *
                     */
                    if ((this.Agent.role == 'admin' || this.Agent.role == 'superadmin') && data.ignoreAdmin) return;

                    /**
                    * @Note This Function Refresh The List and Change The position of the ticket to the top
                    */
                    this.UpdateTicket(data.tid, data.ticket);

                });
                /**
                 * @Note
                 * Exclude Fields That are not the part of <TicketSchema> OR loaded lazily  for eg.
                 * 1. messages <Array<messagesSchema>
                 * 2. synced : Boolean
                 */
                this.socket.on('updateTicketProperty', (data) => {
                    // console.log('Update ticket property');
                    // console.log(data);

                    /**
                    *
                    * @Note This Function Change The properties of thread but doesn't change the position of the ticket to the top
                    *
                    */
                    if (data.ignoreAdmin) return;

                    this.UpdateTicketProperty((!Array.isArray(data.tid)) ? [data.tid] : data.tid, data.ticket);

                });
                this.socket.on('gotNewTicketMessage', (data) => {
                    // console.log("gotNewTicketMessage", data);

                    if (data.ticket.tid && data.ticket.tid.length) {
                        let found = undefined;

                        this.ThreadList.next(this.ThreadList.getValue().filter(thread => {
                            if (thread._id != data.ticket.tid[0]) return true;
                            found = JSON.parse(JSON.stringify(thread));
                        }));

                        if (found) {
                            found.viewState = data.viewState;
                            found.state = data.state;
                            /**
                           * @Work
                           *  1. Check if Updated Thread synced?
                           *  2. If Not Sycned Then Do Nothing Becuse It will fetch messages automatically when Loaded into view.
                           *  3. If Synced Then Push to its Message Array w.r.t Date Key/Value
                           *  4. Update ThreadList
                           */
                            if (found.synced) {
                                let messagefound = false;

                                found.messages = found.messages.map(message => {

                                    if (message.date == new Date(data.ticket.datetime).toDateString()) {
                                        message.groupedMessagesList.push(data.ticket);
                                        // console.log("message.groupedMessagesList", message.groupedMessagesList);
                                        messagefound = true;
                                    }
                                    return message;
                                })
                                if (!messagefound) {
                                    found.messages.push({
                                        date: new Date(data.ticket.datetime).toDateString(),
                                        groupedMessagesList: [data.ticket]
                                    })
                                }
                            }

                            this.ThreadList.getValue().unshift(found);
                            if (this.selectedThread.getValue() && this.selectedThread.getValue()._id == found._id) {
                                this.selectedThread.next(found);
                            }
                        }

                        if (!found) {
                            /**
                             * @Work
                             * 1. Get From Server
                             * 2. Prepend To ThreadList
                             * 3. Update Thread List
                             */
                            // console.log("here");
                            // console.log(data.ticket.tid);
                            this.socket.emit('getTicketByID', { tid: data.ticket.tid }, response => {
                                // console.log(response);

                                this.ThreadList.getValue().unshift(response.thread);
                                this.ThreadList.next(this.ThreadList.getValue());
                            })
                        } else this.ThreadList.next(this.ThreadList.getValue());
                        // console.log("permisssion for messgae", this.notifPermissions.ticketMessage);

                        if (this.notifPermissions && this.notifPermissions.ticketMessage) {
                            let notif_data: Array<any> = [];
                            notif_data.push({
                                'tag': data.ticket.tid + data.ticket._id,
                                'title': 'You have recieved a new message!',
                                'alertContent': 'From: ' + data.ticket.from,
                                'icon': "../assets/img/favicon.ico",
                                'url': "/tickets/ticket-view/" + data.ticket.tid
                            });
                            this._notificationService.generateNotification(notif_data);
                        }
                    }
                });
                this.socket.on('newFBTicket', (data) => {

                    data.ticket.synced = false;
                    this.ThreadList.getValue().push(data.ticket);
                    this.ThreadList.next(this.ThreadList.getValue());

                    // this.updateViewState(data.viewState, data.tid);
                });
            }
        });
    }

    public updateGroup(ids: Array<any>, updatedGroup, previousGroup): Observable<any> {
        return new Observable(observer => {
            //REST CALL
            this.http.post(this.ticketServiceURL + '/changeGroup', { ids: ids, group: updatedGroup, previousGroup: previousGroup, email: this.Agent.email, nsp: this.Agent.nsp }).subscribe(res => {
                if (res.json()) {
                    let response = res.json();
                    if (response.status == 'ok') {
                        let found = false;
                        this.ThreadList.next(this.ThreadList.getValue().map(thread => {
                            ids.map(tid => {
                                if (tid == thread._id) {
                                    let logfound = false;
                                    found = true;
                                    thread.group = updatedGroup;
                                    thread.ticketlog = thread.ticketlog.map(log => {
                                        if (log.date == new Date(response.ticketlog.time_stamp).toDateString()) {

                                            log.groupedticketlogList.unshift(response.ticketlog);
                                            logfound = true;
                                        }
                                        return log;
                                    });
                                    if (!logfound) {
                                        thread.ticketlog.unshift({
                                            date: new Date(response.ticketlog.time_stamp).toDateString(),
                                            groupedticketlogList: [response.ticketlog]
                                        })
                                    }
                                    this.selectedThread.next(thread);
                                }
                            })
                            return thread;
                        }));


                        if (found) {
                            this.notification.next({ msg: 'Group "' + updatedGroup + '" assigned successfully', type: 'success', img: 'ok' });
                            observer.next(response.status);
                            observer.complete();
                        }
                    } else {
                        this.notification.next({ msg: "Can't assign group", type: 'error', img: 'warning' });
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
    }

    public updatePriority(ids, updatedPriority) {

        //REST CALL
        this.http.post(this.ticketServiceURL + '/changeTicketPriority', { ids: ids, priority: updatedPriority, email: this.Agent.email, nsp: this.Agent.nsp }).subscribe(res => {
            if (res.json()) {
                let response = res.json();

                if (response.status == 'ok') {
                    let found = false;
                    this.ThreadList.next(this.ThreadList.getValue().map(thread => {
                        ids.map(tid => {
                            if (thread._id == tid) {
                                let logfound = false;
                                found = true;
                                thread.priority = updatedPriority;
                                thread.ticketlog = thread.ticketlog.map(log => {
                                    if (log.date == new Date(response.ticketlog.time_stamp).toDateString()) {

                                        log.groupedticketlogList.unshift(response.ticketlog);
                                        logfound = true;
                                    }
                                    return log;
                                });
                                if (!logfound) {
                                    thread.ticketlog.unshift({
                                        date: new Date(response.ticketlog.time_stamp).toDateString(),
                                        groupedticketlogList: [response.ticketlog]
                                    })
                                }
                                this.selectedThread.next(thread);
                                this.notification.next({
                                    msg: "Priority of Ticket changed to " + updatedPriority + " successfully!",
                                    type: 'success',
                                    img: 'ok'
                                });
                            }
                        });
                        return thread;
                    }));

                } else {
                    this.notification.next({
                        msg: "Can't change priority",
                        type: 'error',
                        img: 'warning'
                    });
                }
            }
        }, err => {
            this.notification.next({
                msg: "Can't change priority",
                type: 'error',
                img: 'warning'
            });
        })

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

    }

    public InsertNewTicket(details): Observable<any> {
        return new Observable(observer => {
            //REST CALL
            this.http.post(this.ticketServiceURL + '/insertNewTicket', { details: details, email: this.Agent.email, nsp: this.Agent.nsp }).subscribe(res => {
                if (res.json()) {
                    let response = res.json();

                    if (response.status == 'ok') {
                        if (response.ticket && response.ticket.group && response.ticket.assigned_to) {
                            this._ticketautomationservice.UpdateAgentCount(response.ticket.group, response.ticket.assigned_to);
                        }
                        this.ThreadList.getValue().unshift(response.ticket);
                        this.ThreadList.next(this.ThreadList.getValue());
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
    }
    //gets messages for ids of merged tickets.
    public getMessagesForMergedTicket(tids: Array<any>): Observable<any> {
        let temp = [];
        tids.map(tid => {
            temp.push(tid._id);
            //Ticket Linking
            if (tid.references && tid.references.length) {
                tid.references.forEach(reference => {
                    temp.push(reference);
                });
            }
        });
        if (this.selectedThread.getValue() && this.selectedThread.getValue().isPrimary) temp.push(this.selectedThread.getValue()._id);
        return new Observable((observer) => {
            this.http.post(this.ticketServiceURL + '/mergedmessages', { tid: temp }).subscribe(response => {
                if (response.json()) {
                    let data = response.json();
                    observer.next(data);
                    observer.complete();
                }
            })
        })

    }
    public getloadingTickets(type: string): Observable<any> {
        // return this.loadingTickets.asObservable();
        if (type == 'TICKETS') {
            return this.loadingTickets.asObservable();
        } else if (type == 'MORETICKETS') {
            return this.loadingMoreTickets.asObservable();
        }
    }

    //Ticket Watchers
    public AddWatchersToTicket(agents: any, tids: Array<any>): Observable<any> {
        return new Observable((observer) => {
            //REST CALL
            this.http.post(this.ticketServiceURL + '/addWatchers', { agents: agents, tids: tids, email: this.Agent.email, nsp: this.Agent.nsp }).subscribe(res => {
                if (res.json()) {
                    let response = res.json();
                    if (response.status == 'ok') {
                        this.ThreadList.next(this.ThreadList.getValue().map(thread => {
                            tids.map(tid => {
                                if (thread._id == tid) {
                                    let logfound = false;
                                    if (!thread.watchers) thread.watchers = [];
                                    thread.watchers = response.watchers.watchers;
                                    thread.lasttouchedTime = response.watchers.lasttouchedTime;
                                    thread.ticketlog = thread.ticketlog.map(log => {
                                        if (log.date == new Date(response.ticketlog.time_stamp).toDateString()) {
                                            log.groupedticketlogList.unshift(response.ticketlog);
                                            logfound = true;
                                        }
                                        return log;
                                    });
                                    if (!logfound) {
                                        thread.ticketlog.unshift({
                                            date: new Date(response.ticketlog.time_stamp).toDateString(),
                                            groupedticketlogList: [response.ticketlog]
                                        })
                                    }
                                    this.selectedThread.next(thread);

                                }
                            })
                            return thread;
                        }));
                        this.notification.next({
                            msg: "Ticket watchers added Sucessfully!",
                            type: 'success',
                            img: 'ok'
                        });
                        observer.next({ status: "ok" });
                        observer.complete();
                    }
                    else {
                        this.notification.next({
                            msg: "Error in adding watchers!",
                            type: 'error',
                            img: 'warning'
                        });
                    }
                }
            });
        })
    }
    public DeleteWatcherAgent(agent, _id) {
        this.http.post(this.ticketServiceURL + '/deleteWatcher', { agent: agent, id: _id, email: this.Agent.email, nsp: this.Agent.nsp }).subscribe(res => {
            if (res.json()) {
                let response = res.json();
                if (response.status == 'ok') {
                    this.ThreadList.next(this.ThreadList.getValue().map(thread => {
                        if (thread._id == _id) {
                            let ind = thread.watchers.findIndex(data => data == agent);
                            thread.watchers.splice(ind, 1);
                            this.selectedThread.next(thread);
                            this.notification.next({
                                msg: response.msg,
                                type: 'success',
                                img: 'ok'
                            });
                        }
                        return thread;
                    }));
                }
                else {
                    this.notification.next({
                        msg: response.msg,
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
    }
    public getTicketHistoryByEmail(email): Observable<any>{
        return new Observable((observer) => {
            this.http.post(this.ticketServiceURL + '/getTicketHistoryEmail', {nsp: this.Agent.nsp, email: email}).subscribe(resp => {
                if(resp.json()){
                    let response = resp.json();
                    if(response.status == 'ok'){
                        observer.next(response.tickets);
                        observer.complete();
                    }else{
                        this.notification.next({
                            msg: "Error in getting ticket history!",
                            type: 'error',
                            img: 'warning'
                        });
                        observer.next([]);
                        observer.complete();
                    }
                }else{
                    observer.next([]);
                    observer.complete();
                }
            })
        })
    }
    public getTicketHistory(email): Observable<any>{
        return new Observable((observer) => {
            this.http.post(this.ticketServiceURL + '/getTicketHistory', {nsp: this.Agent.nsp, email: email}).subscribe(resp => {
                if(resp.json()){
                    let response = resp.json();
                    if(response.status == 'ok'){
                        observer.next(response.tickets);
                        observer.complete();
                    }else{
                        this.notification.next({
                            msg: "Error in getting ticket history!",
                            type: 'error',
                            img: 'warning'
                        });
                        observer.next([]);
                        observer.complete();
                    }
                }else{
                    observer.next([]);
                    observer.complete();
                }
            })
        })
    }
    
    public getTickets(): Observable<any> {
        // console.log('Get tickets observable');

        return this.ThreadList.asObservable();
    }

    public getPagination(): Observable<number> {
        return this.PaginationCount.asObservable();
    }

    public setPagination(value: number) {
        this.PaginationCount.next(value);
    }


    public getTicketsCount(): Observable<any> {

        return this.TicketCount.asObservable();

    }

    getAgentAgainstWatchers(watcherList: Array<string>): Observable<Array<string>> {
        return new Observable((observer) => {
            // this.socket.emit('getAgentAgainstWatchers', { watcherList: watcherList }, (response) => {
            //     if (response.status == 'ok') {

            //         observer.next(response.agents);
            //         observer.complete();
            //     } else {
            //         observer.next([]);
            //         observer.complete();
            //     };
            // });
            this.http.post(this.ticketServiceURL + '/getAgentAgainstWatchers', { nsp: this.Agent.nsp, watcherList: watcherList }).subscribe(response => {
                if (response.json()) {
                    let data = response.json();
                    if (data.status == 'ok') {
                        observer.next(data.agents);
                        observer.complete();
                    } else {
                        observer.next([]);
                        observer.complete();
                    };
                }
            })
        })
    }

    getAgentsAgainstGroup(groupList: Array<string>): Observable<Array<string>> {
        // this.socket.emit('getAgentsAgainstGroup', {groupList : groupList} , (response) => {
        // console.log(groupList);
        // })
        return new Observable((observer) => {
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
            this.http.post(this.ticketServiceURL + '/getAgentsAgainstGroup', { nsp: this.Agent.nsp, groupList: groupList }).subscribe(response => {
                if (response.json()) {
                    let data = response.json();
                    if (data.status == 'ok') {
                        observer.next(data.agents);
                        observer.complete();
                    } else {
                        observer.next([]);
                        observer.complete();
                    };
                }
            })
        })
    }
    getAgentsAgainstTeams(teams: Array<string>): Observable<Array<string>> {
        // this.socket.emit('getAgentsAgainstGroup', {groupList : groupList} , (response) => {
        // console.log(groupList);
        // })
        return new Observable((observer) => {
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
            this.http.post(this.ticketServiceURL + '/getAgentsAgaintTeams', { nsp: this.Agent.nsp, teams: teams }).subscribe(response => {
                if (response.json()) {
                    let data = response.json();
                    let agents = [];
                    if (data.status == 'ok') {
                        agents = data.agents;
                    } else {
                        agents = [];
                    };
                    observer.next(agents);
                    observer.complete();
                }
            })
        })
    }

    getAllAgentsAgainstAdmin(): Observable<Array<string>> {
        // this.socket.emit('getAgentsAgainstGroup', {groupList : groupList} , (response) => {
        //     console.log(response);
        // })
        return new Observable((observer) => {
            // this.socket.emit('getAllAgentsAgainstAdmin', {}, (response) => {
            //     if (response.status == 'ok') {
            //         observer.next(response.agents);
            //         observer.complete();
            //     } else {
            //         observer.next();
            //         observer.complete();
            //     };
            // });
            this.http.post(this.ticketServiceURL + '/getAllAgentsAgainstAdmin', { nsp: this.Agent.nsp, email: this.Agent.email }).subscribe(response => {
                if (response.json()) {
                    let data = response.json();
                    if (data.status == 'ok') {
                        observer.next(data.agents);
                        observer.complete();
                    } else {
                        observer.next();
                        observer.complete();
                    };
                }
            })
        })
    }

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

    moveTicketsToDefault(group) {
        this.socket.emit('moveTicketsToDefault', { group: group }, (response) => {
            if (response.status == 'ok') {

            }

        });
    }

    public GetLoadingCount(): Observable<any> {
        return this.getloadingCount.asObservable();
    }

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

    public getMessages(tid: any): Observable<any> {
        // console.log(tid);
        return new Observable(observer => {
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
            this.http.post(this.ticketServiceURL + '/ticketmessages', { tid: (!Array.isArray(tid)) ? [tid] : tid }).subscribe(response => {
                if (response.json()) {
                    let data = response.json();

                    // this.selectedThread.next(this.selectedThread.getValue());
                    observer.next(data);
                    observer.complete();
                }
            })
        });

    }



    public setLoadingTickets(value: boolean, type: string) {
        switch (type) {
            case 'TICKETS':
                this.loadingTickets.next(value);
                break;

            case 'MORETICKETS':
                this.loadingMoreTickets.next(value);
                break;
        }
    }

    public GetEmailData(country) {
        this.socket.emit('getContactsForCompaign', { fullCountryName: country }, (response) => {
            // console.log(response);
            if (response.status == 'ok' && response.result && response.result.length) {

                this.EmailData.next(response.result);

            }

            else {
                this.EmailData.next([]);
            }

        });
    }

    public SetTicketFetchingCount(value) {
        this.ActualTicketFetchedCount.next(value);
    }

    public InitializeTicketList(data: any, force = false) {
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
            this.http.post(this.ticketServiceURL + '/getTickets', { email: this.Agent.email, nsp: this.Agent.nsp, filters: (data.filter && Object.keys(data.filter).length) ? data.filter : undefined, clause: data.clause, sortBy: data.sortBy, assignType: data.assignType, groupAssignType: data.groupAssignType, mergeType: data.mergeType, query: data.query }).subscribe(response => {
                if (response.json()) {
                    let data = response.json();
                    if (data.status == 'ok') {
                        this.SetTicketFetchingCount(data.tickets.length);
                        // console.log(response.tickets);
                        this.ThreadList.next(data.tickets.map(ticket => {
                            ticket.synced = false;
                            ticket.messages = [];
                            ticket.ended = ticket.ended;

                            ticket.ticketlog = (ticket.ticketlog && ticket.ticketlog.length) ? this.transformTicketLog(ticket.ticketlog) : [];
                            return ticket;

                        }));
                        this.TicketCount.next(data.count);
                        this.setPagination(0);
                        this.ticketChunk = 0;
                        this.getloadingCount.next(false);
                        this.loadingTickets.next(false);
                        this.loading.next(false);
                        this.Initialized.next(true);
                    } else {
                        this.loadingTickets.next(false);
                        this.loading.next(false);
                        this.getloadingCount.next(false);
                        this.Initialized.next(true);
                    }
                }
            }, err => {
                this.loadingTickets.next(false);
                this.loading.next(false);
                this.getloadingCount.next(false);
                this.Initialized.next(true);
            })
        }
    }

    getTicketsByQuery(query, limit = undefined): Observable<any> {
        return new Observable((observer) => {
            this.http.post(this.ticketServiceURL + '/getTickets', { email: this.Agent.email, nsp: this.Agent.nsp, filters: undefined, clause: '$and', query: query, limit: limit }).subscribe(response => {
                if (response.json()) {
                    let data = response.json();
                    if (data.status == 'ok') {
                        observer.next(data.tickets);
                        observer.complete();
                    } else {
                        observer.next([]);
                        observer.complete();
                    }
                }
            }, err => {
                observer.next([]);
                observer.complete();
            })
        })
    }

    public getMoreTicketFromBackend(): Observable<any> {
        // console.log('Get more tickets');
        // console.log(this.ticketChunk);
        this.loadingMoreTickets.next(true);
        return new Observable(observer => {
            //(this.ticketChunk);

            if (this.ticketChunk != -1 && this.loadingMoreTickets.getValue()) {
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
                this.http.post(this.ticketServiceURL + '/getMoreTickets', {
                    nsp: this.Agent.nsp,
                    email: this.Agent.email,
                    chunk: this.ThreadList.getValue()[this.ThreadList.getValue().length - 1][(this.Filters.getValue().sortBy && this.Filters.getValue().sortBy.name) ? this.Filters.getValue().sortBy.name : 'lasttouchedTime'],
                    filters: this.Filters.getValue().filter,
                    clause: this.Filters.getValue().clause,
                    query: this.Filters.getValue().query,
                    sortBy: this.Filters.getValue().sortBy
                }).subscribe(response => {
                    if (response.json()) {
                        let data = response.json();
                        if (data.status == 'ok') {
                            // console.log(response);
                            this.SetTicketFetchingCount(this.ActualTicketFetchedCount.getValue() + data.tick.length);
                            this.ThreadList.next(this.ThreadList.getValue().concat(data.tick));
                            this.ticketChunk = (data.ended) ? -1 : this.ticketChunk += 1
                            this.loadingMoreTickets.next(false);
                            observer.next(data);
                            observer.complete();
                        } else {
                            this.loadingMoreTickets.next(false);
                            observer.error('error in getMoretickets');
                        }
                    }
                }, err => {
                    observer.next(undefined);
                    observer.complete();
                    this.loadingMoreTickets.next(false);
                })
            } else {
                this.loadingMoreTickets.next(false);

            }
        })


    }

    public getSelectedThread(): Observable<any> {

        return this.selectedThread.asObservable();
    }


    public validateSelectedThread(): boolean {

        return !!Object.keys(this.selectedThread.getValue()).length
    }




    public setSelectedThread(tid?: string) {
        // console.log('Setting selected thread: ' + tid);

        if (!tid) {
            this.selectedThread.next(undefined);
            this._globalApplicationStateService.setTicketViewAccess(false);
            this.isTicketViewLoaded.next(false);
            return;
        }


        this.ThreadList.getValue().map(thread => {
            if (thread._id == tid) {
                this.selectedThread.next(thread);
                //console.log('Ticket found in thread list');
                this._globalApplicationStateService.setTicketViewAccess(true);
            }
            return thread;
        });



        if ((!this.selectedThread.getValue() || !Object.keys(this.selectedThread.getValue()).length) || (this.selectedThread.getValue()._id && this.selectedThread.getValue()._id != tid)) {
            console.log('Ticket not found in thread list or its a new ticket');
            this.getTicketById(tid);
        }

    }

    public getNextThreadId(threadid, value?) {
        let threadList = this.ThreadList.getValue();
        let ticket = threadList.sort((a, b) => {
            let aDate: string = (a.lasttouchedTime) ? a.lasttouchedTime : a.datetime;
            let bDate: string = (b.lasttouchedTime) ? b.lasttouchedTime : b.datetime;

            return (Date.parse(aDate) - Date.parse(bDate) > 0) ? -1 : 1;
        });
        if (ticket.length) {

            if (value) {
                let index = ticket.findIndex(data => data._id == threadid);
                if (value == 'next') {
                    if (ticket[index + 1] && ticket[index + 1]._id) return ticket[index + 1]._id;
                    else return ''

                }

                else {
                    if (ticket[index - 1] && ticket[index - 1]._id) return ticket[index - 1]._id;
                    else return ''

                }
            }
            else {
                let index = ticket.findIndex(data => data._id == ticket[0]._id);
                return ticket[index]._id;
            }

        } else {
            return 'end';
        }
    }


    /**
     * @Move_TO Settings_Ticket-Management_Incoming-Email Local Service
     */

    getIncomingEmailsByNsp() {
        this.http.post(this.ticketServiceURL + '/getIncomingEmailsByNSP', { nsp: this.Agent.nsp }).subscribe(response => {
            if (response.json()) {
                let data = response.json();
                if (data.status == 'ok') {
                    this.IncomingEmailsByNSP.next(data.email_data);
                } else {
                    this.IncomingEmailsByNSP.next([]);
                }
            }
        })
    }

    getIncomingEmails(domainEmail: string): Observable<any> {
        return new Observable(observer => {
            this.http.post(this.ticketServiceURL + '/getIncomingEmails', { email: domainEmail.toLowerCase() }).subscribe(response => {
                if (response.json()) {
                    let data = response.json();
                    if (data.status == 'ok') {
                        observer.next({ status: "ok", emaildata: data.email_data });
                        observer.complete();
                    } else {
                        observer.next({ status: "error", msg: data.msg });
                        observer.complete();
                    }
                }
            })
        });
    }

    getSurveyResult(id): Observable<any> {
        return new Observable(observer => {

            this.socket.emit('getSurveyResult', { id: id }, (response) => {
                if (response.status == 'ok') {
                    observer.next({ status: "ok", result: response.result })
                } else {
                    observer.next({ status: "error", msg: "Error in getting survey results!" })
                }
            });
        });
    }

    getTicketsByGroup(group_name: any): Observable<any> {
        return new Observable(observer => {
            this.socket.emit('getTicketsByGroup', { group_name: group_name }, (response) => {
                if (response.status == 'ok') {
                    this.GroupData.next(response)
                    observer.next({ status: "ok", groups: response })
                } else {
                    this.GroupData.next([]);
                }
            });
        });
    }

    getTicketById(id) {
        this.http.post(this.ticketServiceURL + '/getTicketByID', { nsp: this.Agent.nsp, email: this.Agent.email, tid: id }).subscribe(response => {
            if (response.json()) {
                let data = response.json();
                if (data.status == 'ok') {
                    data.thread.synced = false;
                    data.thread.messages = [];
                    data.thread.ended = false;

                    data.thread.ticketlog = (data.thread.ticketlog && data.thread.ticketlog.length) ? this.transformTicketLog(data.thread.ticketlog) : [];
                    this.selectedThread.next(data.thread);
                    this._globalApplicationStateService.setTicketViewAccess(true);
                } else {
                    this._globalApplicationStateService.NavigateForce('/tickets/list');
                }
            }
        })
    }

    removeTicketAndRedirect(tid) {
        this.InitializeTicketList(this.Filters.getValue(), true);
        this._globalApplicationStateService.NavigateForce('/tickets/list');
    }


    SendMessage(ticket: any): Observable<any> {

        return new Observable(observer => {
            //REST CALL
            this.http.post(this.ticketServiceURL + '/replyTicket', { ticket: ticket, mergedTicketIds: [this.selectedThread.getValue()._id], nsp: this.Agent.nsp, email: this.Agent.email }).subscribe(res => {
                if (res.json()) {
                    let response = res.json();
                    if (response.status == 'ok') {
                        if (this.selectedThread.getValue().merged && this.selectedThread.getValue().mergedTicketIds.length) {
                            this.selectedThread.next(this.selectedThread.getValue());
                        }
                        let dateFound = false;
                        this.selectedThread.getValue().messages.map(groupedMessage => {
                            if (groupedMessage.date == new Date(response.ticket.datetime).toDateString()) {
                                groupedMessage.groupedMessagesList.push(response.ticket);
                                dateFound = true;
                            }
                        });
                        if (!dateFound) {
                            this.selectedThread.getValue().messages.push({
                                date: new Date(response.ticket.datetime).toDateString(),
                                groupedMessagesList: [response.ticket]
                            })
                        }
                        if (this.ThreadList.getValue()[0] != ticket.tid) {
                            this.updateTouchedTime(response.ticket.datetime, ticket.tid)
                        }
                        observer.next({ status: 'ok' });
                        observer.complete();
                    }
                    else {
                        if (response.status == "error") {
                            observer.error();
                            observer.complete();
                        }
                    }
                }
            });

        })
    }

    toggleFilterArea() {
        this.showFilterArea.next(!this.showFilterArea.getValue());
    }

    //Incoming Email:
    AddIncomingEmail(domainEmail, incomingEmail, group, name): Observable<any> {
        //REST CALL
        return new Observable((observer) => {
            this.http.post(this.ticketServiceURL + '/addIncomingEmail', { domainEmail: domainEmail.toLowerCase(), incomingEmail: incomingEmail.toLowerCase(), group: group, name: name, nsp: this.Agent.nsp, email: this.Agent.email }).subscribe(response => {
                if (response.json()) {
                    let data = response.json();
                    if (data.status == 'ok') {
                        this.getIncomingEmailsByNsp();
                        this._ticketautomationservice.getGroups();
                    }
                    observer.next(data);
                    observer.complete();
                }
            })
        })
    }

    SetPrimaryEmail(id, flag) {
        //REST CALL
        this.http.post(this.ticketServiceURL + '/setPrimaryEmail', { id: id, flag: flag, nsp: this.Agent.nsp, email: this.Agent.email }).subscribe(response => {
            if (response.json()) {
                let data = response.json();
                if (data.status == 'ok') {
                    let index = this.IncomingEmailsByNSP.getValue().findIndex(obj => obj._id == data.emailData._id);
                    this.IncomingEmailsByNSP.getValue()[index] = data.emailData;
                    this.IncomingEmailsByNSP.next(this.IncomingEmailsByNSP.getValue());
                }
            }
        });
    }

    UpdateIncomingEmail(emailId, domainEmail, incomingEmail, group, name) {

        //REST CALL
        this.http.post(this.ticketServiceURL + '/updateIncomingId', { emailId: emailId, domainEmail: domainEmail, incomingEmail: incomingEmail, group: group, name: name, nsp: this.Agent.nsp, email: this.Agent.email }).subscribe(response => {
            if (response.json()) {
                let data = response.json();
                if (data.status == 'ok') {
                    this.getIncomingEmailsByNsp();
                }
                else {
                    this.notification.next({
                        msg: "No record updated!",
                        type: 'error',
                        img: 'warning'
                    });
                }
            }
        })
    }

    toggleExternalRuleset(id, value) {
        //REST CALL
        this.http.post(this.ticketServiceURL + '/toggleExternalRuleset', { id: id, value: value, nsp: this.Agent.nsp, email: this.Agent.email }).subscribe(response => {
            if (response.json()) {
                let data = response.json();
                if (data.status == 'ok') {
                    this.notification.next({
                        msg: data.msg,
                        type: 'success',
                        img: 'ok'
                    });
                }
            }
        });
    }
    toggleIconnDispatcher(id, value) {
        //REST CALL
        this.http.post(this.ticketServiceURL + '/toggleIconnDispatcher', { id: id, value: value, nsp: this.Agent.nsp, email: this.Agent.email }).subscribe(response => {
            if (response.json()) {
                let data = response.json();
                if (data.status == 'ok') {
                    this.notification.next({
                        msg: data.msg,
                        type: 'success',
                        img: 'ok'
                    });
                }
            }
        });
    }
    toggleAckEmail(id, value) {
        //REST CALL
        this.http.post(this.ticketServiceURL + '/toggleAckEmail', { id: id, value: value, nsp: this.Agent.nsp, email: this.Agent.email }).subscribe(response => {
            if (response.json()) {
                let data = response.json();
                if (data.status == 'ok') {
                    this.notification.next({
                        msg: data.msg,
                        type: 'success',
                        img: 'ok'
                    });
                }
            }
        });
    }

    toggleUseOriginalEmail(id, value) {

        //REST CALL
        this.http.post(this.ticketServiceURL + '/toggleUseOriginalEmail', { id: id, value: value, nsp: this.Agent.nsp, email: this.Agent.email }).subscribe(response => {
            if (response.json()) {
                let data = response.json();
                if (data.status == 'ok') {
                    this.notification.next({
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
    }

    DeleteIncomingId(email, emailId) {
        //REST CALL
        this.http.post(this.ticketServiceURL + '/deleteIncomingId', { email: email, emailId: emailId, nsp: this.Agent.nsp }).subscribe(response => {
            if (response.json()) {
                let data = response.json();
                if (data.status == 'ok') {
                    let index = this.IncomingEmails.getValue().findIndex(obj => obj._id == emailId);
                    this.IncomingEmails.getValue().splice(index, 1);
                    this.IncomingEmails.next(this.IncomingEmails.getValue());
                    this.getIncomingEmailsByNsp();
                    this.notification.next({
                        msg: data.msg,
                        type: 'success',
                        img: 'ok'
                    });
                }
                else {
                    this.notification.next({
                        msg: "Incoming email not deleted!",
                        type: 'error',
                        img: 'warning'
                    });
                }
            }
        })
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
    }

    SendActivation(emailId) {
        this.activationLoading.next(true);
        //REST CALL
        this.http.post(this.ticketServiceURL + '/sendActivation', { emailId: emailId, nsp: this.Agent.nsp, email: this.Agent.email }).subscribe(response => {
            if (response.json()) {
                let data = response.json();
                if (data.status == 'ok') {
                    this.notification.next({
                        msg: data.msg,
                        type: 'success',
                        img: 'ok'
                    });
                }
                else {
                    this.notification.next({
                        msg: "No activation email sent!",
                        type: 'error',
                        img: 'warning'
                    });
                }
                this.activationLoading.next(false);
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
    }

    SendIdentityVerificationEmail(email) {

        //REST CALL
        this.http.post(this.ticketServiceURL + '/sendIdentityVerificationEmail', { email: email, nsp: this.Agent.nsp }).subscribe(response => {
            if (response.json()) {
                let data = response.json();
                if (data.status == 'ok') {
                    this.notification.next({
                        msg: data.msg,
                        type: 'success',
                        img: 'ok'
                    });
                }
                else {
                    this.notification.next({
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
    }

    public CustomerRegistration(details): Observable<any> {
        return new Observable((observer) => {
            try {
                this.http.post(this.ticketServiceURL + '/RegisterCustomer', { details: details.thread }).subscribe((data) => {

                    if (data.json()) {
                        let response = data.json();
                        if (response.status == 'ok') {

                            observer.next(response)
                            observer.complete()
                        }
                        else {
                            observer.next([])
                            observer.complete()
                        }
                    }

                }, err => {
                    observer.next(false)
                    observer.complete()
                });
            } catch (error) {
                observer.next(false)
                observer.complete()
            }
        });

    }
    public CheckCustomerRegistration(custEmail, custPhone, custId, threadId): Observable<any> {

        return new Observable((observer) => {
            try {
                this.http.post(this.ticketServiceURL + '/CheckRegistration', { customerEmail: custEmail, customerID: custId, customerPhone: custPhone }).subscribe((data) => {

                    if (data.json()) {
                        let res = data.json();
                        if (res.status == 'ok') {
                            res.response._id = threadId;
                            observer.next(res.response)
                            observer.complete();
                        }
                        else {
                            observer.next([])
                            observer.complete()
                        }
                    }

                }, err => {
                    observer.next([])
                    observer.complete()
                });
            } catch (error) {
                observer.next([])
                observer.complete()
            }
        });

    }

    InsertCustomerInfo(_id, cusInfo, relCusInfo, assignment?: string): Observable<any> {
        return new Observable((observer) => {
            try {
                this.http.post(this.ticketServiceURL + '/InsertCustomerInfo', { tid: _id, cusInfo: cusInfo, relCusInfo: relCusInfo, email: this.Agent.email, nsp: this.Agent.nsp, assignment: assignment ? assignment : '' }).subscribe((data) => {

                    if (data.json()) {
                        let res = data.json();
                        if (res.status == 'ok') {
                            // console.log(res);

                            this.ThreadList.next(this.ThreadList.getValue().map(thread => {

                                if (thread._id == _id) {
                                    let logfound = false;
                                    thread.CustomerInfo = res.ticket.CustomerInfo;
                                    thread.RelatedCustomerInfo = res.ticket.RelatedCustomerInfo;

                                    thread.ticketlog = thread.ticketlog.map(log => {
                                        if (log.date == new Date(res.ticketlog.time_stamp).toDateString()) {

                                            log.groupedticketlogList.unshift(res.ticketlog);
                                            logfound = true;
                                        }
                                        return log;
                                    });
                                    if (!logfound) {
                                        thread.ticketlog.unshift({
                                            date: new Date(res.ticketlog.time_stamp).toDateString(),
                                            groupedticketlogList: [res.ticketlog]
                                        })
                                    }
                                    // this.selectedThread.next(thread);

                                }

                                return thread;
                            }));
                            observer.next({ status: "ok", res: res.ticket, ticketlog: res.ticketlog })
                            observer.complete()
                        }
                    }
                });
            } catch (error) {
                observer.next(undefined)
                observer.complete()
            }
        });
    }

    SetState(tids: Array<TemplateStringsArray>, status: string): Observable<any> {
        return new Observable(observer => {
            //REST CALL
            this.http.post(this.ticketServiceURL + '/changeTicketState', { tids: tids, state: status, email: this.Agent.email, nsp: this.Agent.nsp }).subscribe(res => {
                if (res.json()) {
                    let response = res.json();
                    if (response.status == 'ok') {
                        let found = false;
                        this.ThreadList.next(this.ThreadList.getValue().map(thread => {

                            tids.map(tid => {

                                if (thread._id == tid) {
                                    let logfound = false;
                                    let previousState = JSON.parse(JSON.stringify(thread.state))
                                    thread.state = status;
                                    thread.ticketlog = thread.ticketlog.map(log => {
                                        if (log.date == new Date(response.ticketlog.time_stamp).toDateString()) {

                                            log.groupedticketlogList.unshift(response.ticketlog);
                                            logfound = true;
                                        }
                                        return log;
                                    });
                                    if (!logfound) {
                                        thread.ticketlog.unshift({
                                            date: new Date(response.ticketlog.time_stamp).toDateString(),
                                            groupedticketlogList: [response.ticketlog]
                                        })
                                    }
                                    this.UpdateTicketCount(thread, previousState)
                                    // this.pushNewLog(thread.ticketlog, ticketlog);
                                    this.selectedThread.next(thread);
                                    this.notification.next({
                                        msg: 'Ticket(s) state changed to ' + status + ' successfully!',
                                        type: 'success',
                                        img: 'ok'
                                    });
                                }
                            });
                            return thread;
                        }));

                        observer.next(response.status);
                    } else {
                        this.setNotification("Can't Update Thread Status", 'error', 'warning');
                        observer.next(response.status);
                        observer.complete();
                    }
                }
            }, err => {
                this.notification.next({
                    msg: "Can't change priority",
                    type: 'error',
                    img: 'warning'
                });
            })
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
        })

    }


    RefreshList() {
        this.ThreadList.getValue().sort((a, b) => {
            let aDate: string = (a.lasttouchedTime) ? a.lasttouchedTime : a.datetime;
            let bDate: string = (b.lasttouchedTime) ? b.lasttouchedTime : b.datetime;

            return (Date.parse(aDate) - Date.parse(bDate) > 0) ? -1 : 1;
        });
        this.ThreadList.next(this.ThreadList.getValue());
    }

    UpdateTicketProperty(tids: Array<string>, ticket: any) {
        // console.log(tids,ticket);


        this.ThreadList.next(this.ThreadList.getValue().map((thread, index) => {

            tids.map(tid => {

                if (thread._id == tid) {
                    ticket.messages = thread.messages;
                    ticket.synced = thread.synced;
                    if (ticket.state != thread.state) {
                        this.UpdateTicketCount(ticket, thread.state);
                    }
                    ticket.ticketlog = (ticket.ticketlog && ticket.ticketlog.length) ? this.transformTicketLog(ticket.ticketlog) : [];
                    thread = ticket

                    if (this.selectedThread.getValue() && this.selectedThread.getValue()._id == tid) {
                        this.selectedThread.next(thread);
                    }
                }
            });

            return thread;
        }));
    }

    UpdateTicketPropertyArray(ticket: Array<any>) {

        this.ThreadList.next(this.ThreadList.getValue().map((thread, index) => {

            ticket.map(ticket => {

                if (thread._id == ticket._id) {
                    ticket.messages = thread.messages;
                    ticket.synced = thread.synced;
                    if (ticket.state != thread.state) {
                        this.UpdateTicketCount(ticket, thread.state);
                    }
                    ticket.ticketlog = (ticket.ticketlog && ticket.ticketlog.length) ? this.transformTicketLog(ticket.ticketlog) : [];
                    thread = ticket
                    if (this.selectedThread.getValue() && this.selectedThread.getValue()._id == ticket._id) {
                        this.selectedThread.next(thread);
                    }
                }
            });

            return thread;
        }));
    }

    UpdateTicket(tid: string, ticket) {
        this.ThreadList.next(this.ThreadList.getValue().filter((thread, index) => {
            if (thread._id != tid) { return true; };
            if (thread._id == tid) {
                if (ticket.state != thread.state) {
                    this.UpdateTicketCount(ticket, thread.state);
                }
                ticket.ticketlog = (ticket.ticketlog && ticket.ticketlog.length) ? this.transformTicketLog(ticket.ticketlog) : [];
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
    }

    updateTouchedTime(lasttouchedTime: string, tid: string) {
        // console.log('Update Last touch time of : ' + tid + ' as: ' + lasttouchedTime);

        this.ThreadList.next(this.ThreadList.getValue().map(thread => {
            if (thread._id == tid) {
                thread.lasttouchedTime = lasttouchedTime;

            }
            // console.log(thread.lasttouchedTime);

            return thread;
        }));
    }

    updateViewState(viewState: string, tids: Array<string>): Observable<any> {
        return new Observable(observer => {
            //REST CALL
            this.http.post(this.ticketServiceURL + '/updateViewState', { tids: tids, viewState: viewState, email: this.Agent.email, nsp: this.Agent.nsp }).subscribe(res => {
                if (res.json()) {
                    let response = res.json();
                    if (response.status == 'ok') {
                        this.ThreadList.next(this.ThreadList.getValue().map(thread => {
                            tids.map(tid => {
                                if (thread._id == tid) {
                                    thread.viewState = viewState;
                                    if (this.selectedThread.getValue() && this.selectedThread.getValue()._id == tid)
                                        this.selectedThread.next(thread);
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
        })
    }

    getNotification() {
        return this.notification.asObservable();
    }

    clearNotification() {
        this.notification.next(undefined);
    }


    setNotification(notification: string, type: string, icon: string) {
        let item = {
            msg: notification,
            type: type,
            img: icon
        }
        this.notification.next(item);
    }

    public addTicket(data) {
        data.ticket.synced = false;
        data.ticket.messages = [];
        this.ThreadList.getValue().unshift(data.ticket);
        this.ThreadList.next(this.ThreadList.getValue());
    }

    UpdateTicketCount(ticket, previousState: string) {
        if (previousState) {
            this.TicketCount.getValue().map(group => {
                if (previousState == group.state) group.count -= 1;
                if (group.state == ticket.state) group.count += 1
            });
        } else {
            this.TicketCount.getValue().map(group => {
                if (group.state == ticket.state) group.count += 1
            });
        }
        this.TicketCount.next(this.TicketCount.getValue());
    }

    AddTicketCount(ticket) {
        this.TicketCount.getValue().map(group => {
            if (group.state == ticket.state) group.count += 1
        });
        this.TicketCount.next(this.TicketCount.getValue());
    }

    SubstractTicketCount(ticket) {

        this.TicketCount.getValue().map(group => {
            if (group.state == ticket.state) group.count -= 1
        });
        this.TicketCount.next(this.TicketCount.getValue());
    }

    pushNewLog(ticketlog: Array<any>, newLog: any) {
        let logfound = false;
        ticketlog = ticketlog.map(log => {
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
            })
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
    }

    transformTicketLog(ticketlog: Array<any>): Array<any> {

        let ticketlogarr = [];
        let ticketlogsingular: any;
        ticketlogarr = ticketlog;
        if (ticketlogarr.length > 0) {

            ticketlogarr = ticketlogarr.reduce((previous, current) => {

                if (!previous[new Date(current.time_stamp).toDateString()]) {

                    previous[new Date(current.time_stamp).toDateString()] = [current];
                } else {
                    previous[new Date(current.time_stamp).toDateString()].push(current);
                }

                return previous;
            }, {});
        }

        ticketlogsingular = Object.keys(ticketlogarr).map(key => {
            return { date: key, groupedticketlogList: ticketlogarr[key] }
        }).sort((a, b) => {

            if (new Date(a.date) > new Date(b.date)) return -1;
            else if (new Date(a.date) < new Date(b.date)) return 1;
            else 0;

        });

        ticketlogsingular.forEach(element => {
            element.groupedticketlogList.sort((a, b) => {
                if (new Date(a.time_stamp) > new Date(b.time_stamp)) return -1;
                else if (new Date(a.time_stamp) < new Date(b.time_stamp)) return 1;
                else 0;
            })
        });
        return ticketlogsingular;
    }

    //Ticket Task:
    addTask(taskEntered: string, tid: any): Observable<any> {
        return new Observable(observer => {
            let task = {
                todo: taskEntered,
                agent: this.Agent.email,
                completed: false
            }

            //REST CALL
            this.http.post(this.ticketServiceURL + '/addTask', { tid: tid, email: this.Agent.email, nsp: this.Agent.nsp, task: task }).subscribe(res => {
                if (res.json()) {
                    let response = res.json();

                    if (response.status == 'ok') {
                        this.ThreadList.next(this.ThreadList.getValue().map(thread => {
                            tid.map(tid => {
                                if (thread._id == tid) {
                                    let logfound = false;
                                    if (!thread.todo) thread.todo = [];
                                    thread.todo = response.result.todo;
                                    thread.ticketlog = thread.ticketlog.map(log => {
                                        if (log.date == new Date(response.ticketlog.time_stamp).toDateString()) {

                                            log.groupedticketlogList.unshift(response.ticketlog);
                                            logfound = true;
                                        }
                                        return log;
                                    });
                                    if (!logfound) {
                                        thread.ticketlog.unshift({
                                            date: new Date(response.ticketlog.time_stamp).toDateString(),
                                            groupedticketlogList: [response.ticketlog]
                                        })
                                    }
                                    this.selectedThread.next(thread);
                                    this.notification.next({
                                        msg: "Task added successfully!",
                                        type: 'success',
                                        img: 'ok'
                                    });
                                }
                            });
                            return thread;
                        }));
                    } else {
                        observer.complete();
                        this.setNotification("Can't Add Task", 'error', 'warning');
                    }
                }
            }, err => {
                observer.complete();
                this.setNotification("Can't Add Task", 'error', 'warning');
            })

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
    }
    updateTask(properties, id) {
        //REST CALL
        this.http.post(this.ticketServiceURL + '/updateTask', { tid: this.selectedThread.getValue()._id, id: id, properties: properties, email: this.Agent.email, nsp: this.Agent.nsp }).subscribe(res => {
            if (res.json()) {
                let response = res.json();
                if (response.status == 'ok') {
                    this.ThreadList.next(this.ThreadList.getValue().map(thread => {
                        if (thread._id == this.selectedThread.getValue()._id) {
                            let logfound = false;
                            thread.todo = response.tasks.todo;
                            thread.ticketlog = thread.ticketlog.map(log => {
                                if (log.date == new Date(response.ticketlog.time_stamp).toDateString()) {

                                    log.groupedticketlogList.unshift(response.ticketlog);
                                    logfound = true;
                                }
                                return log;
                            });
                            if (!logfound) {
                                thread.ticketlog.unshift({
                                    date: new Date(response.ticketlog.time_stamp).toDateString(),
                                    groupedticketlogList: [response.ticketlog]
                                })
                            }
                            this.selectedThread.next(thread);
                            this.notification.next({
                                msg: "Task updated successfully!",
                                type: 'success',
                                img: 'ok'
                            });
                        }
                        return thread;
                    }));
                } else {
                    this.notification.next({
                        msg: 'Error in updating task',
                        type: 'error',
                        img: 'warning'
                    });
                }

            }
        }, err => {
            this.notification.next({
                msg: 'Error in updating task',
                type: 'error',
                img: 'warning'
            });
        })

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
    }
    checkedTask(id: any, status: boolean, name: any) {
        //REST CALL
        this.http.post(this.ticketServiceURL + '/checkedTask', { tid: this.selectedThread.getValue()._id, id: id, status: status, name: name, email: this.Agent.email, nsp: this.Agent.nsp }).subscribe(res => {
            if (res.json()) {
                let response = res.json();
                if (response.status == 'ok') {
                    if (status) {
                        this.notification.next({
                            msg: 'Task marked as completed successfully',
                            type: 'success',
                            img: 'ok'
                        });
                    }
                    else {
                        this.notification.next({
                            msg: 'Task marked as incomplete successfully',
                            type: 'success',
                            img: 'ok'
                        });
                    }
                    this.ThreadList.next(this.ThreadList.getValue().map(thread => {
                        if (thread._id == this.selectedThread.getValue()._id) {
                            let logfound = false;
                            if (!thread.todo) thread.todo = [];
                            thread.todo = response.tasks.todo;
                            thread.ticketlog = thread.ticketlog.map(log => {
                                if (log.date == new Date(response.ticketlog.time_stamp).toDateString()) {

                                    log.groupedticketlogList.unshift(response.ticketlog);
                                    logfound = true;
                                }
                                return log;
                            });
                            if (!logfound) {
                                thread.ticketlog.unshift({
                                    date: new Date(response.ticketlog.time_stamp).toDateString(),
                                    groupedticketlogList: [response.ticketlog]
                                })
                            }
                            this.selectedThread.next(thread);

                        }
                        return thread;
                    }));
                } else {
                    this.setNotification("Can't check Task", 'error', 'warning');
                }
            }
        }, err => {
            this.setNotification("Can't check Task", 'error', 'warning');
        })

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

    }
    deleteTask(id: string, task: string) {

        //REST CALL
        this.http.post(this.ticketServiceURL + '/deleteTask', { tid: this.selectedThread.getValue()._id, email: this.Agent.email, nsp: this.Agent.nsp, id: id, task: task }).subscribe(res => {
            if (res.json()) {
                let response = res.json();
                if (response.status == 'ok') {
                    this.ThreadList.next(this.ThreadList.getValue().map(thread => {
                        if (thread._id == this.selectedThread.getValue()._id) {
                            let logfound = false;
                            if (!thread.todo) thread.todo = [];
                            thread.todo = response.deletedresult.todo;
                            thread.ticketlog = thread.ticketlog.map(log => {
                                if (log.date == new Date(response.ticketlog.time_stamp).toDateString()) {

                                    log.groupedticketlogList.unshift(response.ticketlog);
                                    logfound = true;
                                }
                                return log;
                            });
                            if (!logfound) {
                                thread.ticketlog.unshift({
                                    date: new Date(response.ticketlog.time_stamp).toDateString(),
                                    groupedticketlogList: [response.ticketlog]
                                })
                            }
                            this.selectedThread.next(thread);
                            this.notification.next({
                                msg: "Task deleted Successfully!",
                                type: 'success',
                                img: 'ok'
                            });
                        }
                        return thread;
                    }));
                } else {
                    this.setNotification("Can't delete Task", 'error', 'warning');
                }
            }
        }, err => {
            this.setNotification("Can't delete Task", 'error', 'warning');
        })


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
    }

    //Ticket Tag:
    addTag(tids: Array<string>, tags: Array<string>): Observable<any> {
        // console.log(tids,tags);

        return new Observable(observer => {
            //REST CALL
            this.http.post(this.ticketServiceURL + '/addTags', { tids: tids, tag: tags, email: this.Agent.email, nsp: this.Agent.nsp }).subscribe(res => {
                if (res.json()) {
                    let response = res.json();

                    if (response.status == 'ok') {
                        let found = false;
                        this.ThreadList.next(this.ThreadList.getValue().map(thread => {
                            tids.map(tid => {
                                if (thread._id == tid) {
                                    let logfound = false;
                                    found = true
                                    if (!thread.tags) thread.tags = [];
                                    thread.tags = (thread.tags as Array<string>).concat(tags);
                                    thread.ticketlog = thread.ticketlog.map(log => {
                                        if (log.date == new Date(response.ticketlog.time_stamp).toDateString()) {

                                            log.groupedticketlogList.unshift(response.ticketlog);
                                            logfound = true;
                                        }
                                        return log;
                                    });
                                    if (!logfound) {
                                        thread.ticketlog.unshift({
                                            date: new Date(response.ticketlog.time_stamp).toDateString(),
                                            groupedticketlogList: [response.ticketlog]
                                        })
                                    }
                                    this.selectedThread.next(thread);
                                    this.notification.next({
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
                    } else {
                        this.notification.next({
                            msg: "Can't Add Tag",
                            type: 'error',
                            img: 'warning'
                        });
                        observer.complete();
                    }
                }
            }, err => {
                this.notification.next({
                    msg: "Can't Add Tag",
                    type: 'error',
                    img: 'warning'
                });
            })


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
    }
    deleteTag(tag) {

        //REST CALL
        this.http.post(this.ticketServiceURL + '/deleteTagTicket', { tid: this.selectedThread.getValue()._id, tag: tag, email: this.Agent.email, nsp: this.Agent.nsp }).subscribe(res => {
            if (res.json()) {
                let response = res.json();
                if (response.status == "ok") {
                    this.ThreadList.next(this.ThreadList.getValue().map(thread => {
                        if (thread._id == this.selectedThread.getValue()._id) {
                            let logfound = false;
                            thread.tags = response.deletedresult.tags;
                            thread.ticketlog = thread.ticketlog.map(log => {
                                if (log.date == new Date(response.ticketlog.time_stamp).toDateString()) {
                                    log.groupedticketlogList.unshift(response.ticketlog);
                                    logfound = true;
                                }
                                return log;
                            });
                            if (!logfound) {
                                thread.ticketlog.unshift({
                                    date: new Date(response.ticketlog.time_stamp).toDateString(),
                                    groupedticketlogList: [response.ticketlog]
                                })
                            }
                            this.selectedThread.next(thread);

                        }
                        return thread;
                    }));

                    this.RefreshList();

                    let msg = 'Tag ' + tag + ' deleted Successfully';
                    this.notification.next({
                        msg: msg,
                        type: 'success',
                        img: 'ok'
                    });
                } else {
                    this.notification.next({
                        msg: "Error! Can't delete Tag",
                        type: 'error',
                        img: 'warning'
                    });
                }
            }
        }, err => {
            this.setNotification("Can't delete Task", 'error', 'warning');
        })
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

    }

    assignAgentForTicket(tids: Array<string>, agent_email: string, previousAgentEmail: string, assignment?: string): Observable<any> {
        return new Observable(observer => {
            console.log(assignment);

            //REST CALL:
            this.http.post(this.ticketServiceURL + '/assignAgentForTicket', { tids: tids, agent_email: agent_email, previousAgent: previousAgentEmail, email: this.Agent.email, nsp: this.Agent.nsp, assignment: assignment ? assignment : '' }).subscribe(res => {
                if (res.json()) {
                    let response = res.json();
                    let found = false;
                    if (response.status == 'ok') {
                        this.ThreadList.next(this.ThreadList.getValue().map(thread => {

                            tids.map(tid => {

                                if (tid == thread._id) {
                                    let logfound = false;
                                    found = true;
                                    thread.assigned_to = agent_email;
                                    thread.ticketlog = thread.ticketlog.map(log => {
                                        if (log.date == new Date(response.ticketlog.time_stamp).toDateString()) {

                                            log.groupedticketlogList.unshift(response.ticketlog);
                                            logfound = true;
                                        }
                                        return log;
                                    });
                                    if (!logfound) {
                                        thread.ticketlog.unshift({
                                            date: new Date(response.ticketlog.time_stamp).toDateString(),
                                            groupedticketlogList: [response.ticketlog]
                                        })
                                    }
                                    if (assignment == undefined) {
                                        this.selectedThread.next(thread);
                                    }
                                }
                            })
                            return thread;
                        }));

                        if (found) {
                            this.notification.next({ msg: 'Agent ' + agent_email + ' assigned successfully', type: 'success', img: 'ok' });
                            observer.next({ status: response.status, ticketlog: response.ticketlog });
                            observer.complete();
                        }
                    } else {
                        this.notification.next({ msg: "Can't assign agent", type: 'error', img: 'warning' });
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
    }

    //Ticket Signature:
    SaveSignature(data: any): Observable<any> {
        return new Observable(observer => {
            //REST CALL:
            this.http.post(this.ticketServiceURL + '/saveSignature', { header: data.header, footer: data.footer, email: this.Agent.email, nsp: this.Agent.nsp }).subscribe(res => {
                if (res.json()) {
                    let response = res.json();
                    if (response.status == 'ok') {
                        this.signList.getValue().splice(0, 0, response.savedSignature);
                        this.signList.next(this.signList.getValue());
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
    }

    UpdateSignature(data: any): Observable<any> {
        return new Observable(observer => {
            //REST CALL:
            this.http.post(this.ticketServiceURL + '/updateSignature', { header: data.header, footer: data.footer, id: data.id, email: this.Agent.email, nsp: this.Agent.nsp }).subscribe(res => {
                if (res.json()) {
                    let response = res.json();
                    if (response.status == 'ok') {
                        let index = this.signList.getValue().findIndex(x => x._id == data.id);
                        this.signList.getValue()[index] = response.updatedSignature;
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
    }

    GetSignatures() {

        this.loading.next(true);
        // this.socket.emit('getSign', {}, (response) => {
        //     if (response.status == 'ok') {

        //         this.signList.next(response.signs);

        //     } else {
        //         this.signList.next([]);
        //     }
        //     this.loading.next(false);
        // });
        this.http.post(this.ticketServiceURL + '/getSignatures', { email: this.Agent.email }).subscribe(response => {
            if (response.json()) {
                let data = response.json();
                if (data.status == 'ok') {
                    this.signList.next(data.signs);
                } else {
                    this.signList.next([]);
                }
                this.loading.next(false);
            }
        })
    }

    ToggleSignatures(signId, flag): Observable<any> {
        return new Observable(observer => {

            //REST CALL
            this.http.post(this.ticketServiceURL + '/toggleSign', { signId: signId, check: flag, email: this.Agent.email, nsp: this.Agent.nsp }).subscribe(res => {
                if (res.json()) {
                    let response = res.json();
                    if (response.status == 'ok') {
                        let index = this.signList.getValue().findIndex(obj => obj._id == signId);
                        this.signList.getValue()[index].active = flag;
                        this.signList.getValue()[index].lastModified = response.signs.lastModified;
                        this.signList.next(this.signList.getValue());
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
    }

    DeleteSignatures(signId): Observable<any> {
        return new Observable(observer => {

            //REST CALL
            this.http.post(this.ticketServiceURL + '/deleteSign', { signId: signId, email: this.Agent.email }).subscribe(res => {
                if (res.json()) {
                    let response = res.json();
                    if (response.status == 'ok') {
                        let index = this.signList.getValue().findIndex(obj => obj._id == signId);
                        this.signList.getValue().splice(index, 1);
                        this.signList.next(this.signList.getValue());
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
    }

    Snooze(time) {
        //REST CALL
        this.http.post(this.ticketServiceURL + '/snooze', { time: time, selectedThread: this.selectedThread.getValue()._id, email: this.Agent.email, nsp: this.Agent.nsp }).subscribe(res => {
            if (res.json()) {
                let response = res.json();

                if (response.status == 'ok') {
                    if (response.ticketlog.title.toLowerCase().includes('snooze')) {
                        response.ticketlog.status = new Date(response.ticketlog.status);
                    }
                    this.ThreadList.next(this.ThreadList.getValue().map(thread => {
                        if (thread._id == this.selectedThread.getValue()._id) {
                            thread.snoozes = response.snooze.snoozes;
                            thread.lasttouchedTime = response.snooze.lasttouchedTime;
                            let logfound = false;
                            thread.ticketlog = thread.ticketlog.map(log => {
                                if (log.date == new Date(response.ticketlog.time_stamp).toDateString()) {

                                    log.groupedticketlogList.unshift(response.ticketlog);
                                    logfound = true;
                                }
                                return log;
                            });
                            if (!logfound) {
                                thread.ticketlog.unshift({
                                    date: new Date(response.ticketlog.time_stamp).toDateString(),
                                    groupedticketlogList: [response.ticketlog]
                                })
                            }
                            this.selectedThread.next(thread);
                        }
                        return thread;
                    }));
                    this.notification.next({
                        msg: 'Snooze Added successfully',
                        type: 'success',
                        img: 'ok'
                    })
                }
                else {
                    this.notification.next({
                        msg: 'Error in adding snooze',
                        type: 'attention',
                        img: 'warning'
                    })
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
    }

    TicketMerge(ticket: any, primaryTicketID: string, secondaryTicketDetails: any, mergedTicketsDetails, notPrimaryRef?: any): Observable<any> {
        return new Observable((observer) => {
            //REST CALL
            this.http.post(this.ticketServiceURL + '/mergeTicket', {
                primaryTicketID: primaryTicketID,
                mergeGroup: ticket.mergedTicketIds,
                secondaryTicketDetails: secondaryTicketDetails,
                mergedTicketsDetails: mergedTicketsDetails,
                secondaryTicketIDs: notPrimaryRef,
                nsp: this.Agent.nsp,
                email: this.Agent.email
            }).subscribe(res => {
                if (res.json()) {
                    let response = res.json();
                    if (response.status == 'ok') {

                        this.UpdateTicket(response.primayTicket._id, response.primayTicket);
                        this.UpdateTicketPropertyArray(response.secondaryTicket);

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
    }

    DemergeTicket(primaryReference, SecondaryReference): Observable<any> {

        return new Observable((observer) => {
            //REST CALL
            this.http.post(this.ticketServiceURL + '/demergeTicket', {
                primaryReference: primaryReference,
                SecondaryReference: SecondaryReference,
                nsp: this.Agent.nsp,
                email: this.Agent.email
            }).subscribe(res => {
                if (res.json()) {
                    let response = res.json();
                    // console.log(response)
                    if (response.status == 'ok') {
                        this.UpdateTicketPropertyArray([response.primayTicket, response.secondaryTicket]);
                        this.notification.next({
                            msg: 'Tickets De-merged successfully',
                            type: 'success',
                            img: 'ok'
                        });
                        observer.next(response);
                        observer.complete();
                    } else {
                        this.notification.next({
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
        })

    }
    sendemailtousers() {
        this.http.post(this.ticketServiceURL + '/abc', {}).subscribe(res => {
            let response = res.json();

            if (response.status == "ok") {
                this.notification.next({
                    msg: 'Email sent to users successfully',
                    type: 'success',
                    img: 'ok'
                });
            }
        });
    }
    sendemailtoagentss() {
        this.http.post(this.ticketServiceURL + '/ghi', {}).subscribe(res => {
            let response = res.json();

            if (response.status == "ok") {
                this.notification.next({
                    msg: 'Email sent to agents successfully',
                    type: 'success',
                    img: 'ok'
                });
            }
        });
    }
    sendemailtoCC() {
        this.http.post(this.ticketServiceURL + '/def', {}).subscribe(res => {
            let response = res.json();

            if (response.status == "ok") {
                this.notification.next({
                    msg: 'Email sent to cc successfully',
                    type: 'success',
                    img: 'ok'
                });
            }
        });
    }

    sendreponse() {
        this.http.post(this.ticketServiceURL + '/res', {}).subscribe(res => {
            let response = res.json();

            if (response.status == "ok") {
                this.notification.next({
                    msg: 'res sent',
                    type: 'success',
                    img: 'ok'
                });
            }
        });
    }


    UpdateDynamicProperty(threadID, fieldName, fieldvalue, assignment?: string): Observable<any> {
        return new Observable((observer) => {

            //REST CALL
            this.http.post(this.ticketServiceURL + '/updateDynamicProperty', { tid: threadID, name: fieldName, value: fieldvalue, email: this.Agent.email, nsp: this.Agent.nsp, assignment: assignment ? assignment : '' }).subscribe(res => {
                if (res.json()) {
                    let response = res.json();
                    if (response.status == 'ok') {
                        this.ThreadList.next(this.ThreadList.getValue().map(thread => {
                            if (thread._id == threadID) {
                                let logfound = false;
                                if (!thread.dynamicFields) thread.dynamicFields = {};
                                thread.dynamicFields[fieldName] = fieldvalue;
                                thread.ticketlog = thread.ticketlog.map(log => {
                                    if (log.date == new Date(response.ticketlog.time_stamp).toDateString()) {

                                        log.groupedticketlogList.unshift(response.ticketlog);
                                        logfound = true;
                                    }
                                    return log;
                                });
                                if (!logfound) {
                                    thread.ticketlog.unshift({
                                        date: new Date(response.ticketlog.time_stamp).toDateString(),
                                        groupedticketlogList: [response.ticketlog]
                                    })
                                }
                                this.selectedThread.next(thread);

                            }
                            this.setNotification('Dynamic field edited!', 'success', 'ok');
                            return thread;
                        }));

                        observer.next({ status: "ok", ticketlog: response.ticketlog });
                        observer.complete();
                    } else {
                        this.setNotification("Error in editing dynamic field", 'error', 'warning');
                        observer.next({ status: "error" });
                        observer.complete();
                    }
                }
            }, err => {
                this.setNotification("Error in editing dynamic field", 'error', 'warning');
                observer.next({ status: "error" });
                observer.complete();
            })

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
        })
    }

    public exportSlaReport(datafrom: any, datato: any, emails, wise, ids): Observable<any> {
        return new Observable((observer) => {
            this.http.post(this.ticketServiceURL + '/exportSlaReport', { datafrom: datafrom ? new Date(datafrom) : '', datato: datafrom ? new Date(datato) : '', emails: emails, wise: wise, ids: ids, nsp: this.Agent.nsp, email: this.Agent.email }).subscribe(res => {


                if (res.json()) {
                    let response = res.json();
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
    }
    public exportDays(datafrom: any, datato: any, keys, emails): Observable<any> {
        return new Observable((observer) => {

            //REST CALL
            this.http.post(this.ticketServiceURL + '/exportdays', { datafrom: new Date(datafrom), datato: new Date(datato), filters: this.Filters.getValue(), keys: keys, emails: emails, email: this.Agent.email, nsp: this.Agent.nsp }).subscribe(res => {

                if (res.json()) {
                    let response = res.json();
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
        })
    }

    public ExportCustomData() {
        this.http.get(this.ticketServiceURL + '/exportCustomTickets').subscribe(response => {
            let data = response.json();
            this.ExportToExcel(data[0], 'Tickets_Total');
            this.ExportToExcel(data[1], 'Tickets_WP');
        })
    }

    public ExportToExcel(data, filename) {
        try {
            filename = filename + new Date().getTime();

            json2excel({
                data,
                name: filename,
                formateDate: 'yyyy/mm/dd'
            });
        } catch (error) {
            console.error('export error');
            console.log(error);

        }
    }

    public getGroupedDetails(data: any): Observable<any> {
        return new Observable((observer) => {
            this.socket.emit('getGroupeddata', { mergedTicketIds: data }, (response) => {
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
        })

    }
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
    editNote(properties: any, tids: Array<string>): Observable<any> {
        return new Observable((observer) => {
            properties.added_at = new Date().toISOString();
            properties.added_by = this.Agent.email;
            //REST CALL
            this.http.post(this.ticketServiceURL + '/editTicketNote', { properties: properties, tids: tids, email: this.Agent.email, nsp: this.Agent.nsp }).subscribe(res => {

                if (res.json()) {
                    let response = res.json();
                    if (response.status == 'ok') {
                        this.ThreadList.next(this.ThreadList.getValue().map(thread => {
                            tids.map(tid => {
                                if (thread._id == tid) {
                                    let logfound = false;
                                    if (!thread.ticketNotes) thread.ticketNotes = [];
                                    thread.ticketNotes = response.note;
                                    thread.ticketlog = thread.ticketlog.map(log => {
                                        if (log.date == new Date(response.ticketlog.time_stamp).toDateString()) {
                                            log.groupedticketlogList.unshift(response.ticketlog);
                                            logfound = true;
                                        }
                                        return log;
                                    });
                                    if (!logfound) {
                                        thread.ticketlog.unshift({
                                            date: new Date(response.ticketlog.time_stamp).toDateString(),
                                            groupedticketlogList: [response.ticketlog]
                                        })
                                    }
                                    this.selectedThread.next(thread);
                                    this.notification.next({
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
    }
    public DeleteNote(noteId, note) {

        //REST CALL
        this.http.post(this.ticketServiceURL + '/deleteNote', { noteId: noteId, id: this.selectedThread.getValue()._id, note: note.ticketNote, email: this.Agent.email, nsp: this.Agent.nsp }).subscribe(res => {
            if (res.json()) {
                let response = res.json();

                if (response.status == 'ok') {
                    this.ThreadList.next(this.ThreadList.getValue().map(thread => {
                        if (thread._id == this.selectedThread.getValue()._id) {
                            let logfound = false;
                            thread.ticketNotes = response.deletedresult;
                            thread.ticketlog = thread.ticketlog.map(log => {
                                if (log.date == new Date(response.ticketlog.time_stamp).toDateString()) {

                                    log.groupedticketlogList.unshift(response.ticketlog);
                                    logfound = true;
                                }
                                return log;
                            });
                            if (!logfound) {
                                thread.ticketlog.unshift({
                                    date: new Date(response.ticketlog.time_stamp).toDateString(),
                                    groupedticketlogList: [response.ticketlog]
                                })
                            }
                            this.selectedThread.next(thread);
                            this.notification.next({
                                msg: "Note deleted Successfully!",
                                type: 'success',
                                img: 'ok'
                            });
                        }
                        return thread;
                    }));
                }
                else {
                    this.notification.next({
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
    }


    TestReply() {
        //console.log('Test Reply');

        this.socket.emit('testTicketMessage', {}, (response) => {
            // console.log('Requested Test Ticket Message');
            // console.log(response);

        });
    }

    ForwardMessageAsTicket(email, message, ticket): Observable<any> {
        return new Observable((observer) => {
            this.socket.emit('forwardMessageAsTicket', { email: email, message: message, ticket: ticket }, (response) => {
                if (response.status == "ok") {
                    observer.next(response);
                    observer.complete();
                }
                else {
                    observer.next(undefined);
                    observer.complete();
                }
            });
        })

    }

    setActiveStateCount(count) {
        this.activeChatStateCount.next(count);
    }

    RouteToTickets() {
        this._router.navigateByUrl('/tickets')
    }

    ExecuteScenario(scenario, ids, tickets): Observable<any> {
        return new Observable((observer) => {
            //REST CALL
            this.http.post(this.ticketServiceURL + '/executeScenario', { scenario: scenario, ids: ids, tickets: tickets, email: this.Agent.email, nsp: this.Agent.nsp }).subscribe(res => {
                if (res.json()) {
                    let response = res.json();
                    if (response.status == 'ok') {
                        this.ThreadList.next(this.ThreadList.getValue().map(thread => {
                            ids.map(tid => {
                                if (thread._id == tid) {
                                    //set assets
                                    if (response.updatedProperties.hasOwnProperty('$set')) {
                                        Object.keys(response.updatedProperties.$set).map(key => {
                                            switch (key) {
                                                case 'state':
                                                    thread.state = response.updatedProperties.$set.state;
                                                    break;
                                                case 'priority':
                                                    thread.priority = response.updatedProperties.$set.priority;
                                                    break;
                                                case 'viewState':
                                                    thread.viewState = response.updatedProperties.$set.viewState;
                                                    break;
                                                case 'assigned_to':
                                                    thread.assigned_to = response.updatedProperties.$set.assigned_to;
                                                    break;
                                                case 'group':
                                                    thread.group = response.updatedProperties.$set.group;
                                                    break;
                                            }
                                        })
                                    }
                                    //push assets
                                    if (response.updatedProperties.hasOwnProperty('$push')) {
                                        Object.keys(response.updatedProperties.$push).map(key => {
                                            switch (key) {
                                                case 'ticketNotes':
                                                    if (!thread.ticketNotes) thread.ticketNotes = [];
                                                    thread.ticketNotes.unshift(response.updatedProperties.$push.ticketNotes);
                                                    break;
                                                case 'tags':
                                                    if (!thread.tags) thread.tags = [];
                                                    thread.tags = (thread.tags as Array<string>).concat(response.updatedProperties.$push.tags);
                                                    break;
                                                case 'watchers':
                                                    if (!thread.watchers) thread.watchers = [];
                                                    thread.watchers = (thread.watchers as Array<string>).concat(response.updatedProperties.$push.watchers);
                                                    break;
                                                case 'todo':
                                                    if (!thread.todo) thread.todo = [];
                                                    thread.todo = (thread.todo as Array<string>).concat(response.updatedProperties.$push.todo);
                                                    break;
                                                case 'ticketlog':
                                                    let copyOfStatus = JSON.parse(JSON.stringify(response.updatedProperties.$push.ticketlog.status));
                                                    copyOfStatus = JSON.stringify(copyOfStatus);
                                                    response.updatedProperties.$push.ticketlog.status = copyOfStatus;
                                                    let logfound = false;
                                                    thread.ticketlog = thread.ticketlog.map(log => {
                                                        if (log.date == new Date(response.updatedProperties.$push.ticketlog.time_stamp).toDateString()) {

                                                            log.groupedticketlogList.unshift(response.updatedProperties.$push.ticketlog);
                                                            logfound = true;
                                                        }
                                                        return log;
                                                    });
                                                    if (!logfound) {
                                                        thread.ticketlog.unshift({
                                                            date: new Date(response.updatedProperties.$push.ticketlog.time_stamp).toDateString(),
                                                            groupedticketlogList: [response.updatedProperties.$push.ticketlog]
                                                        })
                                                    }
                                                    break;
                                            }
                                        })
                                    }
                                    this.selectedThread.next(thread);
                                }
                            })
                            return thread;
                        }));
                        this.notification.next({
                            msg: 'Scenario executed successfully!',
                            type: 'success',
                            img: 'ok'
                        });
                        observer.next(response);
                        observer.complete();
                    }
                    else {
                        this.notification.next({
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
    }

    RevertScenario(ids) {
        //REST CALL
        this.http.post(this.ticketServiceURL + '/revertScenario', { ids: ids, email: this.Agent.email, nsp: this.Agent.nsp }).subscribe(res => {
            if (res.json()) {
                let response = res.json();
                if (response.status == "ok") {
                    this.ThreadList.next(this.ThreadList.getValue().map(thread => {
                        if (thread._id == ids[0]) {
                            let logfound = false;
                            thread = response.revertScenario;
                            thread.ticketlog = thread.ticketlog.map(log => {
                                if (log.date == new Date(response.ticketlog.time_stamp).toDateString()) {
                                    log.groupedticketlogList.unshift(response.ticketlog);
                                    logfound = true;
                                }
                                return log;
                            });
                            if (!logfound) {
                                thread.ticketlog.unshift({
                                    date: new Date(response.ticketlog.time_stamp).toDateString(),
                                    groupedticketlogList: [response.ticketlog]
                                })
                            }
                            this.selectedThread.next(thread);
                            this.notification.next({
                                msg: "Scenario reverted successfully!",
                                type: 'success',
                                img: 'ok'
                            });
                        }
                        return thread;
                    }));
                }
                else {
                    this.notification.next({
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
    }

    saveFiltersOnLocalStorage(filters) {
        localStorage.setItem('ticketFilters', JSON.stringify(filters));
    }
    getFiltersFromLocalStorage() {
        return JSON.parse(localStorage.getItem('ticketFilters'));
    }
}
