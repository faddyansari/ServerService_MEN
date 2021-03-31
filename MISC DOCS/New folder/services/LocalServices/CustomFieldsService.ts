import { Injectable } from "@angular/core";
import { SocketService } from "../SocketService";
import { Subscription } from "rxjs/Subscription";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { AuthService } from "../AuthenticationService";


@Injectable()
export class CustomFieldsService {

    private Socket: SocketIOClient.Socket;
    private subscriptions: Array<Subscription> = [];
    private Agent: any;
    public CustomFields: BehaviorSubject<any> = new BehaviorSubject([]);

    constructor(private _socketService: SocketService, private _authService: AuthService) {

        this.subscriptions.push(this._socketService.getSocket().subscribe(data => {
            if (data) {
                this.Socket = data;
                this.GetFields();
            }
        }));

        this.subscriptions.push(this._authService.getAgent().subscribe(agent => {
            if (agent) {
                this.Agent = agent;
            }
        }));

    }

    public GetFields() {
        this.Socket.emit('getFields', {}, (response) => {
            if (response.status == 'ok') this.CustomFields.next(response.fields);
            else this.CustomFields.next([]);
        })
    }

    public UpdateFields(data): Observable<any> {
        return new Observable(observer => {
            console.log(data.fields);
            
            this.Socket.emit('updateFields', { fields: data.fields }, (response) => {
                console.log(response);
                
                if (response.status == 'ok') {
                    this.CustomFields.next(response.fields);
                    observer.next(response);
                    observer.complete();
                }
                else {
                    observer.error(response);
                    observer.complete();
                }
            });
        })

    }


    public Destroy() {
        this.subscriptions.map(subscription => {
            subscription.unsubscribe();
        })
    }




}