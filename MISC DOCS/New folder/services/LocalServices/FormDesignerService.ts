import { Injectable, group } from "@angular/core";
import { SocketService } from "../SocketService";
import { AuthService } from "../AuthenticationService";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { PushNotificationsService } from '../NotificationService';
import { ToastNotifications } from "../../app/dialogs/SnackBar-Dialog/toast-notifications.component";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Subscription } from "rxjs/Subscription";
import { Http } from "@angular/http";



@Injectable()

export class FormDesignerService {
    socket: SocketIOClient.Socket;
    public AddForm: BehaviorSubject<boolean> = new BehaviorSubject(false);
    private subscriptions: Subscription[] = [];
    public Agent: any = undefined;
    selectedForm: BehaviorSubject<any> = new BehaviorSubject(undefined);
    Field: BehaviorSubject<any> = new BehaviorSubject([]);
    Forms: BehaviorSubject<any> = new BehaviorSubject([]);
    WholeForm: BehaviorSubject<any> = new BehaviorSubject([]);
    Actions: BehaviorSubject<any> = new BehaviorSubject(undefined);
    ticketServiceURL = '';

    constructor(_socket: SocketService, _authService: AuthService,private http: Http, private _notificationService: PushNotificationsService, private snackbar: MatSnackBar) {

        if (this._notificationService.permission == 'default' || 'denied') {
            this._notificationService.requestPermission();
        }
        _authService.RestServiceURL.subscribe(url => {
            this.ticketServiceURL = url + '/api/tickets';
        });

        _socket.getSocket().subscribe(data => {
            if (data) {
                this.socket = data;
                this.getForms();
                this.GetFormActions()

            }
        });

        _authService.getAgent().subscribe(data => {
            if (data) {
                this.Agent = data;
                // this.getForms();
            }
        });
    }

    getForms() {
        this.socket.emit('getFormsByNSP', {}, (response) => {
            if (response.status == 'ok') {
                this.WholeForm.next(response.form_data);
                // console.log(this.WholeForm);
                //     if (this.selectedForm.getValue()) {
                //         response.form_data.form.map(foo => {

                //             if (foo.formName == this.selectedForm.getValue().formName) {
                //                 this.selectedForm.next(foo);
                //                 return;
                //             }
                //         });
                //     }
                //  else {
                //     this.selectedForm.next({});
                // }
            }
        });
    }

    GetFormActions(){
        this.socket.emit('getActionsUrls', {}, (response) => {

            if (response.status == 'ok') {
                this.Actions.next(response.actions);
            }
        });

    }

    DeleteForm(id) {
        this.socket.emit('deleteForm', { id: id }, (response) => {
            if (response.status == 'ok') {
                // console.log(this.WholeForm.getValue());
                let index = this.WholeForm.getValue().findIndex(obj => obj._id == id);


                this.WholeForm.getValue().splice(index, 1);
                //delete this line by fixing live update issue
                this.getForms();
                // console.log(this.WholeForm.getValue());

                this.WholeForm.next(this.Forms.getValue());
                this.snackbar.openFromComponent(ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: 'Form Deleted Successfully!'
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'success']
                });
            }
            else {
                this.snackbar.openFromComponent(ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: 'Form Not Deleted!'
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'success']
                });
            }
        });
    }

    public UpdateForm(fid, obj): Observable<any> {
        return new Observable(observer => {
            this.socket.emit('updateForm', { fid: fid, UpdatedForm: obj }, response => {
                if (response.status == 'ok') {
                    this.snackbar.openFromComponent(ToastNotifications, {
                        data: {
                            img: 'ok',
                            msg: 'Form Updated Successfully!'
                        },
                        duration: 2000,
                        panelClass: ['user-alert', 'success']
                    });
                    let index = this.WholeForm.getValue().findIndex(a => a._id == fid);
                    this.WholeForm.getValue()[index] = response.formUpdated;
                    this.AddForm.next(false);
                    this.selectedForm.next(undefined);

                    observer.next({ status: 'ok', wholeForm: response.formUpdated })
                    observer.complete();
                }
                else {
                    this.snackbar.openFromComponent(ToastNotifications, {
                        data: {
                            img: 'warning',
                            msg: 'Error in updating form, Please Try again!'
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

    insertForm(obj): Observable<any> {
        return new Observable((observer) => {

            this.http.post(this.ticketServiceURL + '/insertForm', { obj: obj, email: this.Agent.email, nsp: this.Agent.nsp }).subscribe((response) => {
                if(response.json()){
                    let data = response.json();
                    if (data.status == 'ok') {
                        // this.selectedForm.next(response.forminserted.formFields);
                        this.WholeForm.getValue().unshift(data.forminserted);
                        this.WholeForm.next(this.WholeForm.getValue());
                        this.snackbar.openFromComponent(ToastNotifications, {
                            data: {
                                img: 'ok',
                                msg: 'Form Designed Successfully!'
                            },
                            duration: 2000,
                            panelClass: ['user-alert', 'success']
                        });
    
                        this.AddForm.next(false);
                        // this.selectedForm.next(undefined);
                        observer.next({ status: 'ok', wholeForm: data.forminserted })
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
    public Destroy() {
        this.subscriptions.map(subscription => {
            subscription.unsubscribe();
        });
    }
}