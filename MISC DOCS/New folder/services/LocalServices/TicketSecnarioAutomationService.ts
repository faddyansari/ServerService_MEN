import { Injectable } from "@angular/core";
import { SocketService } from "../SocketService";
import { AuthService } from "../AuthenticationService";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { PushNotificationsService } from '../NotificationService';
import { ToastNotifications } from "../../app/dialogs/SnackBar-Dialog/toast-notifications.component";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AgentService } from '../AgentService';
import { Subscription } from 'rxjs/Subscription';
import { Http } from "@angular/http";


@Injectable()

export class TicketSecnarioAutomationService {
    socket: SocketIOClient.Socket;
    private subscriptions: Subscription[] = [];
    public AddScenario: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public cloneScenario: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public Agent: any = undefined;
    selectedScenario: BehaviorSubject<any> = new BehaviorSubject(undefined);
    AllScenarios: BehaviorSubject<any> = new BehaviorSubject([]);
    public agentsList: BehaviorSubject<any> = new BehaviorSubject(undefined);
    public groupList: BehaviorSubject<any> = new BehaviorSubject(undefined);
    public teamsList: BehaviorSubject<any> = new BehaviorSubject(undefined);
    ticketServiceURL = '';

    constructor(_socket: SocketService, _authService: AuthService, private http: Http, private _notificationService: PushNotificationsService, private snackbar: MatSnackBar,
        private _agentService: AgentService) {
        _authService.RestServiceURL.subscribe(url => {
            this.ticketServiceURL = url + '/api/tickets';
        });

        if (this._notificationService.permission == 'default' || 'denied') {
            this._notificationService.requestPermission();
        }
        _socket.getSocket().subscribe(data => {
            if (data) {
                this.socket = data;
                this.getAllScenarios();
            }
        });

        _authService.getAgent().subscribe(data => {
            if (data) {
                this.Agent = data;
            }
        });

        //     this.subscriptions.push(this._agentService.getAllAgentsList().subscribe(agentList => {
        //         this.agentsList.next(agentList);
        //     }));


        //     this.subscriptions.push(this._ticketAutomationSvc.Groups.subscribe(groups => {
        //         this.groupList.next(groups);
        //     }));

        //     this.subscriptions.push(this._teamSvc.Teams.subscribe(teams => {
        //         this.teamsList.next(teams);
        //     }));
    }

    // //CRUD OF POLICY
    AddTicketScenario(obj): Observable<any> {
        return new Observable((observer) => {
            this.http.post(this.ticketServiceURL + '/addScenario', { scenarioObj: obj, nsp: this.Agent.nsp }).subscribe((response) => {
                if(response.json()){
                    let data = response.json()
                    if (data.status == 'ok') {
                        // console.log(response);
    
                        this.AllScenarios.getValue().unshift(data.scenarioInserted);
                        this.AllScenarios.next(this.AllScenarios.getValue());
                        this.snackbar.openFromComponent(ToastNotifications, {
                            data: {
                                img: 'ok',
                                msg: 'Ticket Scenario added Successfully!'
                            },
                            duration: 2000,
                            panelClass: ['user-alert', 'success']
                        });
    
                        this.AddScenario.next(false);
                        this.cloneScenario.next(false);
                        this.selectedScenario.next(undefined);
    
                        observer.next({ status: 'ok', scenario: data.scenarioInserted })
                        observer.complete();
                    }
                    else {
                        this.snackbar.openFromComponent(ToastNotifications, {
                            data: {
                                img: 'warning',
                                msg: data.msg
                            },
                            duration: 2000,
                            panelClass: ['user-alert', 'error']
                        });
                        observer.next({ status: 'error' });
                        observer.complete();
                    }
                }
            });
        });
    }

    getAllScenarios() {
        this.socket.emit('getAllScenarios', {}, (response) => {
            if (response.status == 'ok') {
                this.AllScenarios.next(response.scenarios);
            }
            else {
                this.AllScenarios.next([]);
            }
        });
    }

    deleteScenario(id) {
        this.socket.emit('deleteScenario', { id: id }, (response) => {
            if (response.status == 'ok') {
                let index = this.AllScenarios.getValue().findIndex(obj => obj._id == id);
                this.AllScenarios.getValue().splice(index, 1);
                this.getAllScenarios();
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
                        msg: 'Error in deleting scenario,Please Try again!'
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'error']
                });
            }
        });
    }

    updateScenario(sid, obj): Observable<any> {
        return new Observable(observer => {

            this.socket.emit('updateScenario', { sid: sid, scenarioUpd: obj }, response => {
                if (response.status == 'ok') {
                    this.snackbar.openFromComponent(ToastNotifications, {
                        data: {
                            img: 'ok',
                            msg: 'Ticket Scenario Updated Successfully!'
                        },
                        duration: 2000,
                        panelClass: ['user-alert', 'success']
                    });
                    let index = this.AllScenarios.getValue().findIndex(a => a._id == sid);
                    this.AllScenarios.getValue()[index] = response.scenarioUpdated;
                    this.AllScenarios.next(this.AllScenarios.getValue());
                    this.AddScenario.next(false);
                    this.selectedScenario.next(undefined);

                    observer.next({ status: 'ok', policy: response.scenarioUpdated })
                    observer.complete();
                }
                else {
                    this.snackbar.openFromComponent(ToastNotifications, {
                        data: {
                            img: 'warning',
                            msg: 'Error in updating Ticket Scenario, Please Try again!'
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

}