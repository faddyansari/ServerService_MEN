import { Injectable, group } from "@angular/core";
import { SocketService } from "../SocketService";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { PushNotificationsService } from '../NotificationService';
import { ToastNotifications } from "../../app/dialogs/SnackBar-Dialog/toast-notifications.component";
import { MatSnackBar } from "@angular/material/snack-bar";


@Injectable()

export class AcknowledgeMessageService {
    socket: SocketIOClient.Socket;
    public AddAckMessage: BehaviorSubject<boolean> = new BehaviorSubject(false);
    selectedAckMessage: BehaviorSubject<any> = new BehaviorSubject(undefined);
    AllAckMessages: BehaviorSubject<any> = new BehaviorSubject([]);
    constructor(_socket: SocketService, private _notificationService: PushNotificationsService, private snackbar: MatSnackBar) {

        if (this._notificationService.permission == 'default' || 'denied') {
            this._notificationService.requestPermission();
        }
        _socket.getSocket().subscribe(data => {
            if (data) {
                this.socket = data;
                this.getAllAckMessages();
            }
        });

    }

    toggleActivation(obj,flag): Observable<any> {
        return new Observable(observer => {
            this.socket.emit('updatePropertyAckMsg', { obj: obj}, response => {
                if (response.status == 'ok') {
                    if(flag){
                        this.snackbar.openFromComponent(ToastNotifications, {
                            data: {
                                img: 'ok',
                                msg: 'Acknowledge Message Activated Successfully!'
                            },
                            duration: 2000,
                            panelClass: ['user-alert', 'success']
                        });
                    }
                    else{
                        this.snackbar.openFromComponent(ToastNotifications, {
                            data: {
                                img: 'ok',
                                msg: 'Acknowledge Message de-activated Successfully!'
                            },
                            duration: 2000,
                            panelClass: ['user-alert', 'success']
                        });
                    }
                  
                    this.AllAckMessages.next(response.message);
                    observer.next({ status: 'ok' })
                    observer.complete();
                }
                else {
                    this.snackbar.openFromComponent(ToastNotifications, {
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
    }


    //CRUD OF SURVEY
    addAckMessage(obj): Observable<any> {
        return new Observable((observer) => {
            this.socket.emit('updatePropertyAckMsg', { obj: obj }, (response) => {
                if (response.status == 'ok') {
                    console.log(response);
                    
                    this.AllAckMessages.next(response.message);
                    this.snackbar.openFromComponent(ToastNotifications, {
                        data: {
                            img: 'ok',
                            msg: 'Acknowledge Message added Successfully!'
                        },
                        duration: 2000,
                        panelClass: ['user-alert', 'success']
                    });

                    this.AddAckMessage.next(false);
                    observer.next({ status: 'ok', message: response.message })
                    observer.complete();

                }
                else {
                    this.snackbar.openFromComponent(ToastNotifications, {
                        data: {
                            img: 'warning',
                            msg: 'Error in adding Ack. message, Please Try again!'
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

    getAllAckMessages() {
        this.socket.emit('getAckMsgbyNSP', {}, (response) => {
            if (response.status == 'ok') {
                this.AllAckMessages.next(response.ackMsg_data);
            }
            else {
                this.AllAckMessages.next([]);
            }
        });
    }

    deleteAckMessage(obj) {

        this.socket.emit('updatePropertyAckMsg', { obj: obj }, (response) => {
            if (response.status == 'ok') {
                this.AllAckMessages.next(response.message);

                this.snackbar.openFromComponent(ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: 'Acknowledge Message deleted Successfully!'
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'success']
                });
            }
            else {
                this.snackbar.openFromComponent(ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: 'Erroe in deleting Ack. message,Please Try again!'
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'success']
                });
            }
        });
    }

    updateAckMessage(obj): Observable<any> {
        return new Observable(observer => {

            this.socket.emit('updatePropertyAckMsg', {obj: obj }, response => {
                if (response.status == 'ok') {

                    this.snackbar.openFromComponent(ToastNotifications, {
                        data: {
                            img: 'ok',
                            msg: 'Acknowledge Message Updated Successfully!'
                        },
                        duration: 2000,
                        panelClass: ['user-alert', 'success']
                    });
                    this.AllAckMessages.next(response.message);
                    this.AddAckMessage.next(false);
                    this.selectedAckMessage.next(undefined);

                    observer.next({ status: 'ok', survey: response.surveyUpdated })
                    observer.complete();
                }
                else {
                    this.snackbar.openFromComponent(ToastNotifications, {
                        data: {
                            img: 'warning',
                            msg: 'Error in updating Ack. message, Please Try again!'
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