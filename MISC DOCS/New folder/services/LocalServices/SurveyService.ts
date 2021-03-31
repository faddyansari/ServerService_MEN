import { Injectable, group } from "@angular/core";
import { SocketService } from "../SocketService";
import { AuthService } from "../AuthenticationService";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { PushNotificationsService } from '../NotificationService';
import { ToastNotifications } from "../../app/dialogs/SnackBar-Dialog/toast-notifications.component";
import { MatSnackBar } from "@angular/material/snack-bar";



@Injectable()

export class SurveyService {
    socket: SocketIOClient.Socket;
    public AddSurvey: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public DefaultJSON: BehaviorSubject<any> = new BehaviorSubject([{
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
    public Agent: any = undefined;
    selectedSurvey: BehaviorSubject<any> = new BehaviorSubject(undefined);
    AllSurveys: BehaviorSubject<any> = new BehaviorSubject([]);
    ActivatedSurvey: BehaviorSubject<any> = new BehaviorSubject([]);
    constructor(_socket: SocketService, _authService: AuthService, private _notificationService: PushNotificationsService, private snackbar: MatSnackBar) {

        if (this._notificationService.permission == 'default' || 'denied') {
            this._notificationService.requestPermission();
        }
        _socket.getSocket().subscribe(data => {
            if (data) {
                this.socket = data;
                this.getAllSurveys();
            }
        });

        _authService.getAgent().subscribe(data => {
            if (data) {
                this.Agent = data;
            }
        });
    }

    toggleActivation(id, flag): Observable<any> {
        return new Observable(observer => {
            this.socket.emit('activateSurvey', { fid: id, activated: flag }, response => {
                if (response.status == 'ok') {
                    this.snackbar.openFromComponent(ToastNotifications, {
                        data: {
                            img: 'ok',
                            msg: 'Survey Activated/De-activated Successfully!'
                        },
                        duration: 2000,
                        panelClass: ['user-alert', 'success']
                    });
                    let index = this.AllSurveys.getValue().findIndex(a => a._id == id);
                    this.AllSurveys.getValue()[index].activated = response.surveyUpdated.activated;
                    this.AllSurveys.getValue()[index].lastModified = response.lastModified;

                    this.AllSurveys.next(this.AllSurveys.getValue())
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

    CheckIfSurveyIsInTicket(_id): Observable<any> {
        return new Observable((observer) => {
            this.socket.emit('checkInTicket', { id: _id }, (response) => {
                if (response.status == 'ok') {
                    observer.next({ exists: true })
                    observer.complete();

                }
                else {
                    observer.next({ exists: false })
                    observer.complete();
                }
            });
        });
    }
    // demoEmail(){
    //     this.socket.emit('demo', (response) => {
    //         console.log(response);

    //     });
    // }

    //CRUD OF SURVEY
    addSurvey(obj): Observable<any> {
        return new Observable((observer) => {

            this.socket.emit('addSurvey', { surveyObj: obj }, (response) => {
                if (response.status == 'ok') {
                    // console.log(this.AllSurveys.getValue());

                    this.AllSurveys.getValue().unshift(response.surveyInserted);
                    this.AllSurveys.next(this.AllSurveys.getValue());
                    this.snackbar.openFromComponent(ToastNotifications, {
                        data: {
                            img: 'ok',
                            msg: 'Survey added Successfully!'
                        },
                        duration: 2000,
                        panelClass: ['user-alert', 'success']
                    });

                    this.AddSurvey.next(false);
                    observer.next({ status: 'ok', survey: response.surveyInserted })
                    observer.complete();

                }
                else {
                    this.snackbar.openFromComponent(ToastNotifications, {
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
    }

    getAllSurveys() {
        this.socket.emit('getSurveysByNSP', {}, (response) => {
            if (response.status == 'ok') {
                this.AllSurveys.next(response.surveys);
            }
            else {
                this.AllSurveys.next([]);
            }
        });
    }

    getActivatedSurvey(): Observable<any> {
        return new Observable((observer) => {

            this.socket.emit('getActivatedSurvey', {}, (response) => {
                if (response.status == 'ok') {
                    observer.next({ status: 'ok', survey: response.survey })
                    observer.complete();
                }
                else{
                    observer.next({ status: 'error' })
                    observer.complete();
                }
            });
        });
    }

    deleteSurvey(id) {
        this.socket.emit('deleteSurvey', { id: id }, (response) => {
            if (response.status == 'ok') {
                let index = this.AllSurveys.getValue().findIndex(obj => obj._id == id);
                this.AllSurveys.getValue().splice(index, 1);
                this.getAllSurveys();
                this.snackbar.openFromComponent(ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: 'Survey Deleted Successfully!'
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'success']
                });
            }
            else {
                this.snackbar.openFromComponent(ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: 'Erroe in deleting survey,Please Try again!'
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'success']
                });
            }
        });
    }

    updateSurvey(fid, obj): Observable<any> {
        return new Observable(observer => {

            this.socket.emit('updateSurvey', { fid: fid, updatedSurvey: obj }, response => {
                if (response.status == 'ok') {
                    // console.log(response);

                    this.snackbar.openFromComponent(ToastNotifications, {
                        data: {
                            img: 'ok',
                            msg: 'Survey Updated Successfully!'
                        },
                        duration: 2000,
                        panelClass: ['user-alert', 'success']
                    });
                    let index = this.AllSurveys.getValue().findIndex(a => a._id == fid);
                    this.AllSurveys.getValue()[index] = response.surveyUpdated;
                    this.AddSurvey.next(false);
                    this.selectedSurvey.next(undefined);

                    observer.next({ status: 'ok', survey: response.surveyUpdated })
                    observer.complete();
                }
                else {
                    this.snackbar.openFromComponent(ToastNotifications, {
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
    }


}