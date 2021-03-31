import { Injectable, group } from "@angular/core";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { SocketService } from "./SocketService";
import { AuthService } from "./AuthenticationService";
import { PushNotificationsService } from "./NotificationService";
import { Http } from "@angular/http";


@Injectable()

export class IconIntegrationService {
    socket: SocketIOClient.Socket;
    private iconServiceURL = ''
    public Agent: BehaviorSubject<boolean> = new BehaviorSubject(undefined);

    constructor(_socket: SocketService,
        _authService: AuthService,
        private _notificationService: PushNotificationsService,
        private http: Http) {

        if (this._notificationService.permission == 'default' || 'denied') {
            this._notificationService.requestPermission();
        }
        _socket.getSocket().subscribe(data => {
            if (data) {
                this.socket = data;
            }
        });

        _authService.getAgent().subscribe(data => {
            if (data) {
                this.Agent.next(data);
            }
        });
        _authService.RestServiceURL.subscribe(url => {
            this.iconServiceURL = url + '/api/icon';
        })
    }
    public GetSalesAgent(ID): Observable<any> {
        return new Observable((observer) => {
            try {
                this.http.post(this.iconServiceURL + '/SalesAgent', { ID: ID }).subscribe((data) => {

                    if (data.json()) {
                        let response = data.json();
                        //  console.log(response)
                        if (response.status == 'ok') {

                            observer.next(response.response)
                            observer.complete()
                        }
                        else {
                            observer.next([])
                            observer.complete()
                        }
                    }

                }, err => {
                    console.log(err)
                    observer.next(false)
                    observer.complete()
                });
            } catch (error) {
                observer.next(false)
                observer.complete()
            }
        });

    }
    public GetMasterData(ID): Observable<any> {
        return new Observable((observer) => {
            try {
                this.http.post(this.iconServiceURL + '/MasterData', { ID: ID }).subscribe((data) => {

                    if (data.json()) {
                        let response = data.json();
                        //  console.log(response)
                        if (response.status == 'ok') {

                            observer.next(response.response)
                            observer.complete()
                        }
                        else {
                            observer.next([])
                            observer.complete()
                        }
                    }

                }, err => {
                    console.log(err)
                    observer.next(false)
                    observer.complete()
                });
            } catch (error) {
                observer.next(false)
                observer.complete()
            }
        });

    }

}