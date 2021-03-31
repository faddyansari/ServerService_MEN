import { Injectable } from '@angular/core';

//RxJs Imsports
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter'
import 'rxjs/add/operator/auditTime';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
//End RxJs Imports
//Services
import { SocketService } from "../services/SocketService";
import { PushNotificationsService } from './NotificationService';
import { AuthService } from './AuthenticationService';
import { Http, URLSearchParams, QueryEncoder } from '@angular/http';
import { HttpHeaders, } from '@angular/common/http';
import { Headers } from '@angular/http';


@Injectable()

export class Visitorservice {
    private visitorServiceURL = '';
    private Agent: any;
    private workerSupported = false;
    public visitorList: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
    private LeftVisitorsList: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
    private visitorsMap: BehaviorSubject<any> = new BehaviorSubject({});
    private selectedVisitor: BehaviorSubject<any> = new BehaviorSubject(undefined);
    private bannedVisitors: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
    private archiveURI: BehaviorSubject<string> = new BehaviorSubject('');

    public socket: SocketIOClient.Socket;
    public timer = Observable.interval(4500);
    public updateEvent: BehaviorSubject<any> = new BehaviorSubject({});

    // Visitor Counts
    private browsingVisitorsCount: BehaviorSubject<number> = new BehaviorSubject(0);
    private chattingVisitorsCount: BehaviorSubject<number> = new BehaviorSubject(0);
    private queuedVisitorsCount: BehaviorSubject<number> = new BehaviorSubject(0);
    private invitedVisitorsCount: BehaviorSubject<number> = new BehaviorSubject(0);
    private inactiveVisitorsCount: BehaviorSubject<number> = new BehaviorSubject(0);
    private leftVisitorsCount: BehaviorSubject<number> = new BehaviorSubject(0);
    private totalVisitors: BehaviorSubject<number> = new BehaviorSubject(0);
    private pageState: BehaviorSubject<string> = new BehaviorSubject('browsing');
    private notification: BehaviorSubject<any> = new BehaviorSubject('');
    private action: Subject<string> = new Subject();
    private worker: Worker;

    private engagementSettings: BehaviorSubject<any> = new BehaviorSubject({});
    public performingAction: BehaviorSubject<any> = new BehaviorSubject({});

    GetVisitorsLogUpdated: BehaviorSubject<any> = new BehaviorSubject({});

    //Loader Variables
    private loading: BehaviorSubject<boolean> = new BehaviorSubject(true);

    public VisitorLogs: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
    permissions: any;
    visitorsFetched = false;
    private chatServiceURL = '';


    constructor(
        private _socket: SocketService,
        private _notificationService: PushNotificationsService,
        private _authService: AuthService,
        private http: Http
    ) {

        // this.InitializeWorker();
        this.updateEvent.auditTime(4000).subscribe(data => {
            // console.log('Updating Event : ', data);
            // let temp = JSON.parse(JSON.stringify(data));
            if (!Object.keys(data).length) return;
            if (this.visitorsFetched) {
                Object.keys(data).map(value => {
                    switch (data[value].action) {
                        case 'updateUser':
                            let temp_1 = [];
                            let found = false;
                            // console.log('Session : ', data);
                            this.visitorList.next(this.visitorList.getValue().filter((item) => {
                                if (item.id == data[value].id) {
                                    found = true;
                                    this.unsetState(item);

                                    this.setState(data[value].session);
                                }
                                return item.id != data[value].id;
                            }));
                            if (found) this.visitorList.next([...[data[value].session], ...this.visitorList.getValue()]);
                            delete this.updateEvent.getValue()[value]

                            break;
                        case 'removeUser':
                            this.visitorList.next(this.visitorList.getValue().filter((item) => {
                                if (item.id == data[value].sid) {
                                    this.unsetState(item);
                                    delete this.visitorsMap.getValue()[data[value].sid];
                                    this.visitorsMap.next(this.visitorsMap.getValue());
                                    this.MoveToLeftVisitors(item);
                                };
                                return item.id != data[value].sid;
                            }));
                            if (this.selectedVisitor.getValue() && this.selectedVisitor.getValue()._id == data[value].sid) this.selectedVisitor.next(undefined)
                            delete this.updateEvent.getValue()[value]
                            break;
                        case 'newUser':

                            //Setting Count Based on State
                            // console.log('New User');

                            this.setState(data[value].visitor.session);
                            let temp = this.visitorList.getValue().map(value => { return value });
                            // console.log('equivalency Service : ', this.visitorList.getValue() === temp)

                            this.visitorList.next([...[data[value].visitor.session], ...this.visitorList.getValue()]);
                            delete this.updateEvent.getValue()[value]

                            break;
                    }
                })

                        //         this.unsetState(item);


                // console.log('Temp :', temp_1);
                // if (this.worker) this.worker.postMessage({ action: 'updateUser', visitorList: this.visitorList.getValue(), data: temp });
            }
        })


        _authService.getSettings().subscribe(data => { if (data && data.permissions) { this.permissions = data.permissions; } });
        this._authService.RestServiceURL.subscribe(url => { this.visitorServiceURL = url + '/api/visitor'; });
        this._authService.archiveURL.subscribe(url => { this.archiveURI.next(url); });
        this._authService.getAgent().subscribe(agent => { this.Agent = agent; });
        _authService.RestServiceURL.subscribe(url => {
            this.chatServiceURL = url + '/api/chats';
        })

        // console.log('Visitor Service Initialized');
        _socket.getSocket().subscribe((data) => {
            if (data) {
                this.socket = data;
                if (this.permissions && (this.permissions.visitors.enabled || this.permissions.chats.enabled)) {
                    if (!this.visitorsFetched) {
                        this.GetVisitorList();
                        this.GetLeftVisitors();
                        this.GetBannedVisitors();
                    }
                    this.socket.on('newUser', (visitor) => {

                        //Adding to Visitor Array
                        visitor.session.id = visitor.id;
                        let currentDate = Date.parse(new Date().toISOString()) - Date.parse(new Date(visitor.session.creationDate).toISOString());
                        visitor.session.seconds = Math.floor((currentDate / 1000) % 60);
                        visitor.session.minutes = Math.floor((currentDate / 1000 / 60) % 60);
                        visitor.session.hours = Math.floor((currentDate / 1000) / 60 / 60);
                        this.visitorsMap.getValue()[visitor.id] = visitor.session;
                        this.visitorsMap.next(this.visitorsMap.getValue());

                        let eventID = visitor.id + Date.parse(new Date().toISOString())

                        this.updateEvent.getValue()[eventID] = { action: 'newUser', id: data.id, visitor: visitor };
                        this.updateEvent.next(this.updateEvent.getValue());

                    });
                    this.socket.on('removeBannedVisitor', (data) => {

                        this.RemoveBannedVisitorFormList(data.deviceID);


                    });
                    this.socket.on('removeUser', (sessionId) => {
                        // console.log('removeUser  ');
                        let eventID = sessionId + Date.parse(new Date().toISOString())

                        this.updateEvent.getValue()[eventID] = { action: 'removeUser', id: data.id, sid: sessionId };
                        this.updateEvent.next(this.updateEvent.getValue());
                        //console.log(this.visitorList);
                    });
                    this.socket.on('updateUser', (data) => {
                        // console.log('UpdateUser');
                        setTimeout(() => {

                            let temp = [];
                            if (data && data.id && data.session) {

                                let currentDate = Date.parse(new Date().toISOString()) - Date.parse(new Date(data.session.creationDate).toISOString());
                                data.session.seconds = Math.floor((currentDate / 1000) % 60);
                                data.session.minutes = Math.floor((currentDate / 1000 / 60) % 60);
                                data.session.hours = Math.floor(currentDate / 1000 / 60 / 60);
                                data.session.id = data.id;

                                let logs: any
                                if (this.visitorsMap.getValue()[data.id] && this.visitorsMap.getValue()[data.id].logsFetched && this.visitorsMap.getValue()[data.id].logs) {
                                    logs = this.visitorsMap.getValue()[data.id].logs
                                    data.session.logsFetched = true;
                                    data.session.logs = logs
                                }
                                /**
                                * @Work : Update Visitor HASHMAP
                                */
                                this.visitorsMap.getValue()[data.session.id] = data.session;
                                this.visitorsMap.next(this.visitorsMap.getValue());


                            }
                            /**
                            * @Work : Generate Window Notification
                            */
                            if (data.session.state && data.session.state == 2 && !data.session.inactive) {

                                let notif: any = [];
                                notif.push({
                                    "tag": data.session._id + data.session.state,
                                    'title': 'Visitor Unassigned',
                                    'alertContent': data.session.username + " is now Unassigned",
                                    'icon': "../assets/img/favicon.ico",
                                    'url': "/visitors/"
                                });

                                this._notificationService.generateNotification(notif);
                            }


                            /**
                            * @WORK_IF_NOT_WORKER_SUPPORTED : Update Visitor_ARRAY_List Same Thread
                            * @WORK_IF_WORKER_SUPPORTED : Update Visitor_ARRAY_List On Worker
                            */


                            // this.worker.postMessage({ action: 'updateUser', visitorList: this.visitorList.getValue(), data: data })
                            /**
                            * @Key = data.id + DatetimeStamp
                            */
                            let eventID = (data.id || data._id || data.session._id || data.session.id) + Date.parse(new Date().toISOString())
                            //this.updateEvent.next({ eventID: { visitorList: this.visitorList.getValue(), data: data } });
                            this.updateEvent.getValue()[eventID] = { action: 'updateUser', id: data.id, session: data.session };
                            this.updateEvent.next(this.updateEvent.getValue());
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
                            if (this.selectedVisitor.getValue() && this.selectedVisitor.getValue().id == data.session.id) {

                                if (this.selectedVisitor.getValue().state != data.session.state) this.selectedVisitor.next(undefined)
                                else this.selectedVisitor.next(this.visitorsMap.getValue()[data.session.id]);
                            }

                        });


                    });
                    this.socket.on('updateAdditionalData', (data) => {
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

    public getLoadingVisitors(): Observable<any> {
        return this.loading.asObservable();
    }

    public setLoadingVisitors(value: boolean) {
        this.loading.next(value);
    }


    public getSelectedVisitor(): Observable<any> {
        return this.selectedVisitor.asObservable();
    }

    public setSelectedVisitor(id: string, left?: boolean) {
        if (left) {
            let visitor = this.LeftVisitorsList.getValue().filter(a => {
                if (a._id == id) this.selectedVisitor.next(a);
            });
        }
        else this.selectedVisitor.next(this.visitorsMap.getValue()[id]);
    }

    public GetVisitorsList(): Observable<any> {
        return this.visitorList.asObservable();
    }

    public getLeftVisitors(): Observable<any> {
        return this.LeftVisitorsList.asObservable();
    }

    public getBannedVisitors(): Observable<any> {
        return this.bannedVisitors.asObservable();
    }

    public getVisitorsMap(): Observable<any> {
        return this.visitorsMap.asObservable();
    }



    public BrowsingVisitorsCount(): Observable<number> {
        return this.browsingVisitorsCount.asObservable();
    }
    public ChattingVisitorsCount(): Observable<number> {
        return this.chattingVisitorsCount.asObservable();
    }

    public QueuedVisitorsCount(): Observable<number> {
        return this.queuedVisitorsCount.asObservable();
    }
    public InvitedVisitorsCount(): Observable<number> {
        return this.invitedVisitorsCount.asObservable();
    }
    public InactiveVisitorsCount(): Observable<number> {
        return this.inactiveVisitorsCount.asObservable();
    }

    public LeftVisitorsCount(): Observable<number> {
        return this.leftVisitorsCount.asObservable();
    }

    public TotalVisitorsCount(): Observable<number> {
        return this.totalVisitors.asObservable();
    }

    public getPageState(): Observable<string> {
        return this.pageState.asObservable();
    }

    public changeState(state) {
        this.pageState.next(state);
        this.selectedVisitor.next(undefined);
    }

    public MoveToLeftVisitors(visitor) {
        this.LeftVisitorsList.getValue().unshift(visitor);
        if (this.LeftVisitorsList.getValue().length > 30) this.LeftVisitorsList.next(this.LeftVisitorsList.getValue().slice(0, 30));
        else this.LeftVisitorsList.next(this.LeftVisitorsList.getValue());
        this.leftVisitorsCount.next(this.LeftVisitorsList.getValue().length);
    }

    private setState(visitor) {
        if ((visitor.state == 1 || visitor.state == 8) && !visitor.inactive) {
            this.browsingVisitorsCount.next(this.browsingVisitorsCount.getValue() + 1);
        } else if (visitor.state == 2 && !visitor.inactive) {
            this.queuedVisitorsCount.next(this.queuedVisitorsCount.getValue() + 1);
        } else if (visitor.state == 3 && !visitor.inactive) {
            this.chattingVisitorsCount.next(this.chattingVisitorsCount.getValue() + 1);
        } else if (((visitor.state == 4) || (visitor.state == 5)) && !visitor.inactive) { // Invitied Visitors In Progress
            this.invitedVisitorsCount.next(this.invitedVisitorsCount.getValue() + 1);
        } else if (visitor.inactive) {
            this.inactiveVisitorsCount.next(this.inactiveVisitorsCount.getValue() + 1);
        } /**else if (visitor.inactive) {
             this.leftVisitorsCount.next(this.leftVisitorsCount.getValue() + 1);
         }
         */

        //Total Count For DashBoard Component
        this.totalVisitors.next(this.chattingVisitorsCount.getValue() + this.browsingVisitorsCount.getValue() + this.queuedVisitorsCount.getValue());
    }

    private unsetState(visitor) {
        if ((visitor.state == 1 || visitor.state == 8) && !visitor.inactive) {
            this.browsingVisitorsCount.next(this.browsingVisitorsCount.getValue() - 1);
        } else if (visitor.state == 2 && !visitor.inactive) {
            this.queuedVisitorsCount.next(this.queuedVisitorsCount.getValue() - 1);
        } else if (visitor.state == 3 && !visitor.inactive) {
            this.chattingVisitorsCount.next(this.chattingVisitorsCount.getValue() - 1);
        } else if (((visitor.state == 4) || (visitor.state == 5)) && !visitor.inactive) { // Invitied Visitors In Progress
            this.invitedVisitorsCount.next(this.invitedVisitorsCount.getValue() - 1);
        } else if (visitor.inactive) { // State Need to Be Added Proper Funcionality (iNACTIVE sTATE)
            this.inactiveVisitorsCount.next(this.inactiveVisitorsCount.getValue() - 1);
        } /**else if (visitor.state == 7) { // Stated Need To Be Added With Proper Funcionality (lEFT vISITORS)
             this.leftVisitorsCount.next(this.leftVisitorsCount.getValue() - 1);
         } */

        //Total Count For DashBoardComponent
        this.totalVisitors.next(this.chattingVisitorsCount.getValue() + this.browsingVisitorsCount.getValue() + this.queuedVisitorsCount.getValue());
    }

    public RequestQueue(visitorid): Observable<any> {
        return new Observable((observer) => {

            this.performingAction.getValue()[visitorid] = true
            this.performingAction.next(this.performingAction.getValue());
            try {
                this.socket.emit('requestQueue', { sid: visitorid }, (data) => {
                    if (data.status == 'notAllowed') {
                        this.notification.next({
                            msg: 'You are not allowed to request Unassigned Visitors',
                            type: 'warning',
                            img: 'warning'
                        });
                        this.performingAction.getValue()[visitorid] = false
                        this.performingAction.next(this.performingAction.getValue());
                        observer.next(true)
                        observer.complete();
                    }
                    else {
                        this.performingAction.getValue()[visitorid] = false
                        this.performingAction.next(this.performingAction.getValue());
                        observer.next(false)
                        observer.complete();
                    }
                    //console.log(data);
                });
            }
            catch (error) {
                console.log(error);
                observer.next(false)
                observer.complete();
            }
        });
    }

    public RequestQueueRest(visitorid): Observable<any> {
        return new Observable((observer) => {

            this.performingAction.getValue()[visitorid] = true
            this.performingAction.next(this.performingAction.getValue());
            try {
                this.http.post(this.chatServiceURL + '/requestQueue', { sessionid: this.Agent.csid, sid: visitorid ,nsp : this.Agent.nsp}).subscribe((response) => {

                    if (response.json()) {
                        let data = response.json();
                        if (data.status == 'notAllowed') {
                            this.notification.next({
                                msg: 'You are not allowed to request Unassigned Visitors',
                                type: 'warning',
                                img: 'warning'
                            });
                            this.performingAction.getValue()[visitorid] = false
                            this.performingAction.next(this.performingAction.getValue());
                            observer.next(true)
                            observer.complete();
                        }
                        else {
                            this.performingAction.getValue()[visitorid] = false
                            this.performingAction.next(this.performingAction.getValue());
                            observer.next(false)
                            observer.complete();
                        }
                        //console.log(data);
                    }
                });
            }
            catch (error) {
                console.log(error);
                observer.next(false)
                observer.complete();
            }
        });
    }

    public InitiateChat(visitorid): Observable<any> {
        return new Observable((observer) => {
            this.performingAction.getValue()[visitorid] = true
            this.performingAction.next(this.performingAction.getValue());
            this.socket.emit('initiateChat', { sid: visitorid }, (data) => {
                //console.log(data);
                this.performingAction.getValue()[visitorid] = false
                this.performingAction.next(this.performingAction.getValue());
                observer.next(data);
                observer.complete();
                if (data.status == 'engaged') {
                    this.notification.next({
                        msg: 'Visitor is Already Engaged by Another Agent',
                        type: 'warning',
                        img: 'warning'
                    });
                } else if (data.status == 'slotsFull') {
                    this.notification.next({
                        msg: 'Max Chat Limit Reached. Can Not Initiate Chat Right Now!',
                        type: 'error',
                        img: 'warning'
                    });
                } else if (data.status == 'notAllowed') {
                    this.notification.next({
                        msg: 'Manaul Engagement is Not Allowed. Please Contact Your Admin',
                        type: 'error',
                        img: 'warning'
                    });
                } else if (data.status == 'inactive') {
                    this.notification.next({
                        msg: 'Visitor Went Inactive.',
                        type: 'error',
                        img: 'warning'
                    });
                } else if (data.status == 'error') {
                    this.notification.next({
                        msg: "Can't Initiate Chat . Something went Wrong",
                        type: 'error',
                        img: 'warning'
                    });
                }

            });
        });
    }

    SuperViseChat(visitor): Observable<any> {
        return new Observable((observer) => {
            this.performingAction.getValue()[visitor._id] = true
            this.performingAction.next(this.performingAction.getValue());
            this.socket.emit('superviseChat', { cid: visitor.conversationID, sid: visitor._id }, (data) => {
                if (data && data.status == 'ok') {
                    this.performingAction.getValue()[visitor._id] = false
                    this.performingAction.next(this.performingAction.getValue());
                    observer.next(data)
                    observer.complete()
                }
                else {
                    this.performingAction.getValue()[visitor._id] = false
                    this.performingAction.next(this.performingAction.getValue());
                    observer.next(false)
                    observer.complete()
                }
            });
        })
    }

    EndSuperVisesChat(cid, removeChat): Observable<any> {
        return new Observable((observer) => {
            this.socket.emit('endSupervisedChat', { cid: cid, removeChat: removeChat }, (data) => {
                if (data && data.status == 'ok') {
                    observer.next(data)
                    observer.complete()
                }
                else {
                    observer.next(false)
                    observer.complete()
                }
            });
        })

    }

    EndSuperVisesChatRest(cid, removeChat): Observable<any> {
        return new Observable((observer) => {
            this.http.post(this.chatServiceURL + '/endSupervisedChat', { cid: cid, removeChat: removeChat }).subscribe((response) => {
                if (response.json()) {
                    let data = response.json()
                    if (data && data.status == 'ok') {
                        observer.next(data)
                        observer.complete()
                    }
                    else {
                        observer.next(false)
                        observer.complete()
                    }
                }
            });
        })

    }

    public getNotification() {
        return this.notification.asObservable();
    }

    public setNotification(msg: string, type: string, icon: string) {
        let item = {
            msg: msg,
            type: type,
            img: icon
        }
        this.notification.next(icon);
    }

    public performChildAction(action: string) {
        this.action.next(action);
    }

    public getAction() {
        return this.action.asObservable();
    }

    public Destroy() {
        //console.log(this.visitorList);
    }
    public GetVisitorLogs(visitorid, _id = ''): Observable<any> {

        let urlSearchParams = new URLSearchParams('', new QueryEncoder());
        urlSearchParams.append('sid', visitorid);
        if (_id) urlSearchParams.append('_id', _id);
         return this.http.post(this.archiveURI.getValue() + ((_id) ? `moreeventlogs` : `eventlogs`), urlSearchParams)
             .map((response) => {
                 // console.log(response);
                 // let data = JSON.parse((response as any)._body);
                 // console.log(data);
                 // console.log(response.json());
                 // console.log((response as any)._body)
                 return response.json();
             })
             .catch(err => { console.log(err); return Observable.throw(err); });
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
    }

    public GetVisitorsLogsUpdated(): Observable<any> {
        return this.VisitorLogs.asObservable();
    }


    public UpdateVisitor(data: any): Observable<any> {
        return new Observable((observer) => {
            this.visitorsMap.getValue()[data.id] = data;
            this.visitorList.getValue().map((visitor) => {
                if (visitor._id == data.sessionid) {
                    visitor = data
                }
            });
            this.visitorList.next(this.visitorList.getValue());
            this.visitorsMap.next(this.visitorsMap.getValue());
            this.setSelectedVisitor(data.id);
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
    }

    public transformVisitorsLog(log: Array<any>): Array<any> {
        let Visitorlogarr = [];
        let Visitorlogsingular: any;
        Visitorlogarr = log;
        if (Visitorlogarr.length > 0) {
            Visitorlogarr = Visitorlogarr.reduce((previous, current) => {
                if (!previous[new Date(current.time_stamp).toDateString()]) {
                    previous[new Date(current.time_stamp).toDateString()] = [current];
                } else {
                    previous[new Date(current.time_stamp).toDateString()].push(current);
                }

                return previous;
            }, {});
        }

        Visitorlogsingular = Object.keys(Visitorlogarr).map(key => {
            return { date: key, groupedvisitorlogList: Visitorlogarr[key] }
        }).sort((a, b) => {

            if (new Date(a.date) > new Date(b.date)) return -1;
            else if (new Date(a.date) < new Date(b.date)) return 1;
            else 0;

        });
        Visitorlogsingular.forEach(element => {
            element.groupedvisitorlogList.sort((a, b) => {
                if (new Date(a.time_stamp) > new Date(b.time_stamp)) return -1;
                else if (new Date(a.time_stamp) < new Date(b.time_stamp)) return 1;
                else 0;
            })
        });
        return Visitorlogsingular;
    }
    // public setVisitorsLogsUpdated(): Observable<any> {
    //     return this.VisitorLogs.asObservable();
    // }

    public GetLeftVisitors() {

        // this.socket.emit('getLeftVisitors', {}, (response) => {
        //     if (response.status == 'ok') {
        //         // console.log(response.leftVisitors);
        //         // console.log(response.leftVisitors.length)
        //         this.LeftVisitorsList.next(response.leftVisitors);
        //         this.leftVisitorsCount.next(response.leftVisitors.length)
        //     }
        // });

        this.http.post(this.visitorServiceURL + '/getLeftVisitors', { nsp: this.Agent.nsp }).subscribe(response => {
            if (response.json()) {
                let data = response.json();
                if (data.status == 'ok') {
                    // console.log(response.leftVisitors);
                    // console.log(response.leftVisitors.length)
                    this.LeftVisitorsList.next(data.leftVisitors);
                    this.leftVisitorsCount.next(data.leftVisitors.length)
                }
            }
        })
    }

    public GetVisitorList() {
        this.http.post(this.visitorServiceURL + '/visitorList', { nsp: this.Agent.nsp, email: this.Agent.email }).subscribe(response => {
            if (response.json()) {
                let visitors = response.json();
                let visitorsMap = {};
                this.visitorList.next(visitors.map(visitor => {

                    //Visitor Type Count
                    this.setState(visitor);
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
                    let currentDate = Date.parse(new Date().toISOString()) - Date.parse(new Date(visitor.creationDate).toISOString());
                    visitor.seconds = Math.floor((currentDate / 1000) % 60);
                    visitor.minutes = Math.floor((currentDate / 1000) / 60 % 60);
                    visitor.hours = Math.floor((currentDate / 1000) / 60 / 60);
                    // console.log(visitors[key].seconds);
                    // console.log(visitors[key].minutes);
                    // console.log(visitors[key].hours);
                    visitorsMap[visitor._id] = visitor;
                    return visitor;
                }));
                //console.log('All Visitors');
                //console.log(visitors);
                this.visitorsMap.next(visitorsMap);
                //Total Value for DashBoard Component
                this.totalVisitors.next(this.visitorList.getValue().length);
                this.loading.next(false);
                this.visitorsFetched = true;
            }
        }, err => {
            this.loading.next(false);
            this.visitorsFetched = true;
        })
    }

    public GetBannedVisitors() {

        // this.socket.emit('getBannedVisitors', {}, (response) => {

        //     // console.log(response);

        //     if (response.status == 'ok') {
        //         this.bannedVisitors.next(response.bannedVisitorList);
        //     }
        // });
        this.http.post(this.visitorServiceURL + '/getBannedVisitors', { nsp: this.Agent.nsp }).subscribe(response => {
            if (response.json()) {
                let data = response.json();
                if (data.status == 'ok') {
                    this.bannedVisitors.next(data.bannedVisitorList);
                }
            }
        })
    }

    public RemoveBannedVisitorFormList(deviceID) {
        this.bannedVisitors.next(this.bannedVisitors.getValue().filter(visitor => visitor.deviceID != deviceID));
    }


    SelectVisitor(value) {
        console.log('Set Selected Visitor Service');
        let hash = 0;
        this.visitorList.getValue().map((visitor, index) => {

            if (visitor._id == this.selectedVisitor.getValue()._id) {
                hash = (value == 'next') ? (index + 1) : (index - 1)
            }
        })
        if (hash >= 0) {
            if (this.visitorList.getValue()[hash]) {
                this.setSelectedVisitor(this.visitorList.getValue()[hash].id)

            }
        }
    }

    private ComputeHeavyOperation(data: any) {
        console.log('Data', data);
        console.log('Worker Thread');
    }

    UpdateBannedVisitor(visitor): Observable<any> {
        return new Observable(observer => {

            if (visitor) {
                if (this.selectedVisitor.getValue()) {
                    if (this.selectedVisitor.getValue().deviceID == visitor.deviceID) {
                        this.selectedVisitor.next({})
                    }
                }
                this.bannedVisitors.getValue().filter(data => {
                    return (visitor._id != data._id && visitor.deviceID != data.deviceID)
                })
                this.bannedVisitors.next(this.bannedVisitors.getValue().concat(visitor));
            }
            observer.next(true)
            observer.complete()
        })
    }
}
