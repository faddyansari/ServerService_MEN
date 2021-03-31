import { Injectable } from "@angular/core";
import { SocketService } from "../SocketService";
import { AuthService } from "../AuthenticationService";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { PushNotificationsService } from '../NotificationService';
import { ToastNotifications } from "../../app/dialogs/SnackBar-Dialog/toast-notifications.component";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Http } from "@angular/http";


@Injectable()

export class TicketTemplateSevice {
    socket: SocketIOClient.Socket;
    public AddTemplate: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public cloneTemplate: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public Agent: any = undefined;
    selectedTemplate: BehaviorSubject<any> = new BehaviorSubject(undefined);
    AllTemplates: BehaviorSubject<any> = new BehaviorSubject([]);
    ticketServiceURL = '';
    constructor(_socket: SocketService,
        _authService: AuthService,
        private http: Http,
        private _notificationService: PushNotificationsService,
        private snackbar: MatSnackBar) {

        _authService.RestServiceURL.subscribe(url => {
            this.ticketServiceURL = url + '/api/tickets';
        });

        if (this._notificationService.permission == 'default' || 'denied') {
            this._notificationService.requestPermission();
        }
        _socket.getSocket().subscribe(data => {
            if (data) {
                this.socket = data;
                this.getAllTicketTemplates();
            }
        });
        _authService.getAgent().subscribe(data => {
            if (data) {
                this.Agent = data;
            }
        });

    }

    getAutomatedResponseAgainstAgent(): Observable<any> {
        return new Observable((observer) => {
            this.socket.emit('getResponseByAgent', {}, (response) => {
                if (response.status == 'ok') {
                    observer.next({ status: "ok", AutomatedResponses: response.cannedResponses })
                    observer.complete();
                }
                else {
                    observer.next({ status: "error" })
                    observer.complete();
                }
            });
        });
    }


    //CRUD OF TEMPLATE
    AddTicketTemplate(obj): Observable<any> {
        return new Observable((observer) => {
            // console.log(obj);

            // this.socket.emit('addTicketTemplate', { templateObj: obj }, (response) => {
            //     if (response.status == 'ok') {
            //         this.AllTemplates.getValue().unshift(response.templateInserted);
            //         this.AllTemplates.next(this.AllTemplates.getValue());
            //         this.snackbar.openFromComponent(ToastNotifications, {
            //             data: {
            //                 img: 'ok',
            //                 msg: 'Ticket Template added Successfully!'
            //             },
            //             duration: 2000,
            //             panelClass: ['user-alert', 'success']
            //         });

            //         this.AddTemplate.next(false);
            //         this.cloneTemplate.next(false);
            //         this.selectedTemplate.next(undefined);

            //         observer.next({ status: 'ok', template: response.templateInserted })
            //         observer.complete();
            //     }
            //     else {
            //         this.snackbar.openFromComponent(ToastNotifications, {
            //             data: {
            //                 img: 'warning',
            //                 msg: 'Error in adding Ticket Template, Try again!'
            //             },
            //             duration: 2000,
            //             panelClass: ['user-alert', 'error']
            //         });
            //         observer.next({ status: 'error' });
            //         observer.complete();
            //     }
            // });

            this.http.post(this.ticketServiceURL + '/addTicketTemplate', { templateObj: obj , nsp: this.Agent.nsp}).subscribe((response) => {
                if(response.json()){
                    let data = response.json();
                    if (data.status == 'ok') {
                        this.AllTemplates.getValue().unshift(data.templateInserted);
                        this.AllTemplates.next(this.AllTemplates.getValue());
                        this.snackbar.openFromComponent(ToastNotifications, {
                            data: {
                                img: 'ok',
                                msg: 'Ticket Template added Successfully!'
                            },
                            duration: 2000,
                            panelClass: ['user-alert', 'success']
                        });
    
                        this.AddTemplate.next(false);
                        this.cloneTemplate.next(false);
                        this.selectedTemplate.next(undefined);
    
                        observer.next({ status: 'ok', template: data.templateInserted })
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

    getAllTicketTemplates() {
        this.socket.emit('getAllTicketTemplatesByNSP', {}, (response) => {
            if (response.status == 'ok') {

                this.AllTemplates.next(response.templates);
            }
            else {
                this.AllTemplates.next([]);
            }
        });
    }

    DeleteTicketTemplate(id) {
        this.socket.emit('deleteTicketTemplate', { id: id }, (response) => {
            if (response.status == 'ok') {
                let index = this.AllTemplates.getValue().findIndex(obj => obj._id == id);
                this.AllTemplates.getValue().splice(index, 1);
                this.getAllTicketTemplates();
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
                        msg: 'Error in deleting Ticket Template, Try again!'
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'error']
                });
            }
        });
    }

    UpdateTicketTemplate(tid, template): Observable<any> {
        return new Observable(observer => {

            this.socket.emit('updateTicketTemplate', { tid: tid, ticketTemplate: template }, response => {
                if (response.status == 'ok') {
                    this.snackbar.openFromComponent(ToastNotifications, {
                        data: {
                            img: 'ok',
                            msg: 'Ticket Template Updated Successfully!'
                        },
                        duration: 2000,
                        panelClass: ['user-alert', 'success']
                    });
                    let index = this.AllTemplates.getValue().findIndex(a => a._id == tid);
                    this.AllTemplates.getValue()[index] = response.templateEdited;
                    this.AddTemplate.next(false);
                    this.selectedTemplate.next(undefined);

                    observer.next({ status: 'ok', policy: response.templateEdited })
                    observer.complete();
                }
                else {
                    this.snackbar.openFromComponent(ToastNotifications, {
                        data: {
                            img: 'warning',
                            msg: 'Error in updating Ticket Template, Try again!'
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