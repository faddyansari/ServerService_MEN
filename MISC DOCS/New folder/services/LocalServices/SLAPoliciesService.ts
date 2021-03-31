import { UtilityService } from './../UtilityServices/UtilityService';
import { TicketAutomationService } from './TicketAutomationService';
import { Injectable } from "@angular/core";
import { SocketService } from "../SocketService";
import { AuthService } from "../AuthenticationService";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { PushNotificationsService } from '../NotificationService';
import { ToastNotifications } from "../../app/dialogs/SnackBar-Dialog/toast-notifications.component";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Subscription } from 'rxjs/Subscription';


@Injectable()

export class SLAPoliciesService {
    socket: SocketIOClient.Socket;
    private subscriptions: Subscription[] = [];
    public Agent: any = undefined;

    //SLA POLICY BS
    public reOrderPolicy: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public AddSLAPolicy: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public selectedSLAPolicy: BehaviorSubject<any> = new BehaviorSubject(undefined);
    public AllSLAPolicies: BehaviorSubject<any> = new BehaviorSubject([]);
    public changeInReorder: BehaviorSubject<boolean> = new BehaviorSubject(false);

    //INTERNAL POLICY BS
    public reOrderInternalPolicy: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public AddInternalSLAPolicy: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public selectedInternalSLAPolicy: BehaviorSubject<any> = new BehaviorSubject(undefined);
    public AllInternalSLAPolicies: BehaviorSubject<any> = new BehaviorSubject([]);
    public reOrderIntPolicy: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public changeInReorderInt: BehaviorSubject<boolean> = new BehaviorSubject(false);

    public agentsList: BehaviorSubject<any> = new BehaviorSubject(undefined);
    public groupList: BehaviorSubject<any> = new BehaviorSubject(undefined);
    public teamsList: BehaviorSubject<any> = new BehaviorSubject(undefined);


    constructor(_socket: SocketService, _authService: AuthService, private _notificationService: PushNotificationsService, private snackbar: MatSnackBar,
        private _utilityService: UtilityService,
        private _ticketAutomationSvc: TicketAutomationService) {

        if (this._notificationService.permission == 'default' || 'denied') {
            this._notificationService.requestPermission();
        }
        _socket.getSocket().subscribe(data => {
            if (data) {
                this.socket = data;
                _authService.getAgent().subscribe(data => {
                    if (data) {
                        this.Agent = data;
                        this.getAllSLAPolicies();
                        if(this.Agent.nsp == '/sbtjapaninquiries.com'){
                            this.getAllInternalSLAPolicies();
                        }
                    }
                });

            }

        });

       

        this.subscriptions.push(this._utilityService.getAllAgentsListObs().subscribe(agentList => {
            this.agentsList.next(agentList);
        }));


        this.subscriptions.push(this._ticketAutomationSvc.Groups.subscribe(groups => {
            this.groupList.next(groups);
        }));

    }

 
    toggleSLAPolicyActivation(id, flag): Observable<any> {
        return new Observable(observer => {
            this.socket.emit('activateSLAPolicy', { pid: id, activated: flag }, response => {
                if (response.status == 'ok') {

                    this.snackbar.openFromComponent(ToastNotifications, {
                        data: {
                            img: 'ok',
                            msg: 'SLA Policy Activated/De-activated Successfully!'
                        },
                        duration: 2000,
                        panelClass: ['user-alert', 'success']
                    });
                    let index = this.AllSLAPolicies.getValue().findIndex(a => a._id == id);
                    this.AllSLAPolicies.getValue()[index].activated = flag;
                    this.AllSLAPolicies.getValue()[index].lastModified = response.lastModified;

                    this.AllSLAPolicies.next(this.AllSLAPolicies.getValue());
                    observer.next({ status: 'ok' })
                    observer.complete();
                }
                else {
                    this.snackbar.openFromComponent(ToastNotifications, {
                        data: {
                            img: 'warning',
                            msg: 'Error in activating/de-activating SLA Policy, Please Try again!'
                        },
                        duration: 2000,
                        panelClass: ['user-alert', 'error']
                    });
                    observer.next({ status: 'error' });
                    observer.complete();
                }
            });
        });
    }

    AddPolicy(obj): Observable<any> {
        return new Observable((observer) => {

                this.socket.emit('AddPolicy', { policyObj: obj,}, response => {
                        if (response.status == 'ok') {
                        this.AllSLAPolicies.getValue().unshift(response.policyInserted);
                        this.AllSLAPolicies.next(this.AllSLAPolicies.getValue());
                        this.snackbar.openFromComponent(ToastNotifications, {
                            data: {
                                img: 'ok',
                                msg: 'SLA Policy added Successfully!'
                            },
                            duration: 2000,
                            panelClass: ['user-alert', 'success']
                        });
    
                        this.AddSLAPolicy.next(false);
                        observer.next({ status: 'ok', policy: response.policyInserted })
                        observer.complete();
                    }
                    else {
                        this.snackbar.openFromComponent(ToastNotifications, {
                            data: {
                                img: 'warning',
                                msg: 'Error in craeting SLA Policy'
                            },
                            duration: 2000,
                            panelClass: ['user-alert', 'error']
                        });
                        observer.next({ status: 'error' });
                        observer.complete();
                    }
            });
        });
    }

    reOrder(callerid, calleeorder, calleeid, callerorder) {
        this.socket.emit('reOrder', { callerid: callerid, calleeorder: calleeorder, calleeid, callerorder }, (response) => {
            if (response.status == 'ok') {
                this.getAllSLAPolicies();
            }
            else {
                this.AllSLAPolicies.next([]);
            }
        });
    }

    getAllSLAPolicies() {
        this.socket.emit('getAllPoliciesByNSP', {}, (response) => {
            if (response.status == 'ok') {
                this.AllSLAPolicies.next(response.policies);
            }
            else {
                this.AllSLAPolicies.next([]);
            }
        });
    }

    deleteSLAPolicy(id) {
       
        this.socket.emit('deleteSLAPolicy', { id: id }, (response) => {
            if (response.status == 'ok') {
                
                let index = this.AllSLAPolicies.getValue().findIndex(obj => obj._id == id);
                
                this.AllSLAPolicies.getValue().splice(index, 1);
                this.AllSLAPolicies.next(this.AllSLAPolicies.getValue())
                this.snackbar.openFromComponent(ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: 'SLA Policy deleted successfully'
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'success']
                });
            }
            else {
                this.snackbar.openFromComponent(ToastNotifications, {
                    data: {
                        img: 'warning',
                        msg: 'Error in deleting SLA Policy,Please Try again!'
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'error']
                });
            }
        });
    }

    updateSLAPolicy(sid, obj): Observable<any> {
        return new Observable(observer => {

            this.socket.emit('updateSLAPolicy', { sid: sid, updatedPolicy: obj }, response => {
                if (response.status == 'ok') {
                    this.snackbar.openFromComponent(ToastNotifications, {
                        data: {
                            img: 'ok',
                            msg: 'SLA Policy Updated Successfully!'
                        },
                        duration: 2000,
                        panelClass: ['user-alert', 'success']
                    });
                    let index = this.AllSLAPolicies.getValue().findIndex(a => a._id == sid);
                    this.AllSLAPolicies.getValue()[index] = response.policyedited;
                    this.AddSLAPolicy.next(false);
                    this.selectedSLAPolicy.next(undefined);

                    observer.next({ status: 'ok', policy: response.policyedited })
                    observer.complete();
                }
                else {
                    this.snackbar.openFromComponent(ToastNotifications, {
                        data: {
                            img: 'warning',
                            msg: 'Error in updating SLA Policy, Please Try again!'
                        },
                        duration: 2000,
                        panelClass: ['user-alert', 'error']
                    });
                    observer.next({ status: 'error' });
                    observer.complete();
                }
            });
        });
    }


    /* #region INTERNAL SLA POLICY */
    getAllInternalSLAPolicies() {
        this.socket.emit('getAllInternalSLAPoliciesByNSP', {}, (response) => {
            if (response.status == 'ok') {
                this.AllInternalSLAPolicies.next(response.policies);
            }
            else {
                this.AllInternalSLAPolicies.next([]);
            }
        });
    }

    AddInternalPolicy(obj): Observable<any> {
        return new Observable((observer) => {
            this.socket.emit('AddInternalPolicy', { policyObj: obj }, (response) => {
                if (response.status == 'ok') {
                    this.AllInternalSLAPolicies.getValue().unshift(response.policyInserted);
                    this.AllInternalSLAPolicies.next(this.AllInternalSLAPolicies.getValue());
                    this.snackbar.openFromComponent(ToastNotifications, {
                        data: {
                            img: 'ok',
                            msg: 'SLA Policy added Successfully!'
                        },
                        duration: 2000,
                        panelClass: ['user-alert', 'success']
                    });

                    this.AddInternalSLAPolicy.next(false);
                    observer.next({ status: 'ok', policy: response.policyInserted })
                    observer.complete();
                }
                else {
                    this.snackbar.openFromComponent(ToastNotifications, {
                        data: {
                            img: 'warning',
                            msg: 'Error in adding SLA Policy, Please Try again!'
                        },
                        duration: 2000,
                        panelClass: ['user-alert', 'error']
                    });
                    observer.next({ status: 'error' });
                    observer.complete();
                }
            });
        });
    }

    deleteInternalSLAPolicy(id) {
        this.socket.emit('deleteInternalSLAPolicy', { id: id }, (response) => {
            if (response.status == 'ok') {
                let index = this.AllInternalSLAPolicies.getValue().findIndex(obj => obj._id == id);
                this.AllInternalSLAPolicies.getValue().splice(index, 1);
                this.AllInternalSLAPolicies.next(this.AllSLAPolicies.getValue())
                this.snackbar.openFromComponent(ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: response.msg
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'success']
                });
            }
            else {
                this.snackbar.openFromComponent(ToastNotifications, {
                    data: {
                        img: 'warning',
                        msg: 'Error in deleting SLA Policy,Please Try again!'
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'error']
                });
            }
        });
    }

    updateInternalSLAPolicy(sid, obj): Observable<any> {
        return new Observable(observer => {

            this.socket.emit('updateInternalSLAPolicy', { sid: sid, updatedPolicy: obj }, response => {
                if (response.status == 'ok') {
                    this.snackbar.openFromComponent(ToastNotifications, {
                        data: {
                            img: 'ok',
                            msg: 'SLA Policy Updated Successfully!'
                        },
                        duration: 2000,
                        panelClass: ['user-alert', 'success']
                    });
                    let index = this.AllInternalSLAPolicies.getValue().findIndex(a => a._id == sid);
                    this.AllInternalSLAPolicies.getValue()[index] = response.policyedited;
                    this.AllInternalSLAPolicies.next(this.AllInternalSLAPolicies.getValue());
                    this.AddSLAPolicy.next(false);
                    this.selectedInternalSLAPolicy.next(undefined);

                    observer.next({ status: 'ok', policy: response.policyedited })
                    observer.complete();
                }
                else {
                    this.snackbar.openFromComponent(ToastNotifications, {
                        data: {
                            img: 'warning',
                            msg: 'Error in updating SLA Policy, Please Try again!'
                        },
                        duration: 2000,
                        panelClass: ['user-alert', 'error']
                    });
                    observer.next({ status: 'error' });
                    observer.complete();
                }
            });
        });
    }

    reOrderInternalSLA(callerid, calleeorder, calleeid, callerorder) {
        this.socket.emit('reOrderInternalSLA', { callerid: callerid, calleeorder: calleeorder, calleeid, callerorder }, (response) => {
            if (response.status == 'ok') {
                this.getAllInternalSLAPolicies();
            }
            else {
                this.AllInternalSLAPolicies.next([]);
            }
        });
    }

    toggleInternalSLAPolicyActivation(id, flag): Observable<any> {
        return new Observable(observer => {
            this.socket.emit('activateInternalPolicy', { pid: id, activated: flag }, response => {
                if (response.status == 'ok') {

                    this.snackbar.openFromComponent(ToastNotifications, {
                        data: {
                            img: 'ok',
                            msg: 'SLA Policy Activated/De-activated Successfully!'
                        },
                        duration: 2000,
                        panelClass: ['user-alert', 'success']
                    });
                    let index = this.AllInternalSLAPolicies.getValue().findIndex(a => a._id == id);
                    this.AllInternalSLAPolicies.getValue()[index].activated = flag;
                    this.AllInternalSLAPolicies.getValue()[index].lastModified = response.lastModified;
                    this.AllInternalSLAPolicies.next(this.AllInternalSLAPolicies.getValue());
                    observer.next({ status: 'ok' })
                    observer.complete();
                }
                else {
                    this.snackbar.openFromComponent(ToastNotifications, {
                        data: {
                            img: 'warning',
                            msg: 'Error in activating/de-activating SLA Policy, Please Try again!'
                        },
                        duration: 2000,
                        panelClass: ['user-alert', 'error']
                    });
                    observer.next({ status: 'error' });
                    observer.complete();
                }
            });
        });
    }

    getActivatedPolicies
    /* #endregion */
}