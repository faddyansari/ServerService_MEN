// Angular Imports
import { Injectable } from "@angular/core";

//RxJs Imports
import { Observable } from 'rxjs/Observable';

import { AuthService } from "../AuthenticationService";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Subscription } from "rxjs/Subscription";
import { SocketService } from "../SocketService";



@Injectable()
export class KnowledgeBaseService {

    socket: SocketIOClient.Socket;
    subscriptions: Subscription[] = [];
    requestState: BehaviorSubject<boolean> = new BehaviorSubject(false);
    knowledgeBaseList : BehaviorSubject<any> = new BehaviorSubject([]);
    fetching : BehaviorSubject<boolean> = new BehaviorSubject(false);


    constructor(private _socketService: SocketService) {

        this.subscriptions.push(this._socketService.getSocket().subscribe(socket => {
            this.socket = socket;
        }));

    }




    public AddKnowledgeBase(data): Observable<any> {
        return new Observable((observer) => {
            this.requestState.next(true);
            this.socket.emit('addKnowledgeBase', data, (response) => {
                this.requestState.next(false);
                // console.log(response);
                if (response.status == 'ok') {
                    if(data.type == 'news' || data.type == 'sla' || data.type == 'itp'){
                        this.GetKnowledgeBase('documents');
                    }else{
                        this.GetKnowledgeBase(data.type);
                    }
                    observer.next(response);
                    observer.complete();
                } else if (response.status == 'exists') {

                    observer.next(response);
                    observer.complete();
                } else {
                    observer.error("Can't Add Case");
                }
            });
        });
    }

    public GetKnowledgeBase(type) {
        this.fetching.next(true);
        this.socket.emit('getKnowledgeBase', {type: type}, (response) => {
            // console.log(response);
            if(response.status == 'ok' && response.knowledgeBaseList.length){           
                this.knowledgeBaseList.next(response.knowledgeBaseList);
            }else{
                this.knowledgeBaseList.next([]);
            }
            this.fetching.next(false);
        });
    }

    public RemoveKnowledgeBase(type, filename){
        this.socket.emit('removeKnowledgeBase', {type: type, filename: filename}, (response) => {
            if(response.status == 'ok'){
                this.knowledgeBaseList.next(response.knowledgeBaseList);
            }
        });
    }

    public ToggleActivate(type, filename, active?){
        this.socket.emit('toggleKnowledgeBase', {type: type, filename: filename, active: !active}, (response) => {
            if(response.status == 'ok'){
                this.knowledgeBaseList.next(response.knowledgeBaseList);
            }
        });
    }


    public Destroy() {
        this.subscriptions.map(subscription => {
            subscription.unsubscribe();
        });
    }













}