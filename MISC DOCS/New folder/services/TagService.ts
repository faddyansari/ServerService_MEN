import { Injectable } from "@angular/core";
import { SocketService } from "./SocketService";
import { AuthService } from "./AuthenticationService";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { ToastNotifications } from "../app/dialogs/SnackBar-Dialog/toast-notifications.component";
import { MatSnackBar } from "@angular/material";


@Injectable()

export class TagService {
    socket: SocketIOClient.Socket;
    public Tag: BehaviorSubject<any> = new BehaviorSubject({});
    Agent: BehaviorSubject<any> = new BehaviorSubject({});
    public Tags: BehaviorSubject<any> = new BehaviorSubject([]);

    constructor(_socket: SocketService, _authService: AuthService,private snackbar: MatSnackBar) {
        // console.log('Tag Service');

        // Subscribing Agent Object
        _authService.getAgent().subscribe(data => {
            this.Agent = data;
        });

        _socket.getSocket().subscribe(data => {
            if (data) {
                this.socket = data;
                this.getTags();
            }
        });

    }

    getTags() {
        this.socket.emit('getTagByNSP', {}, (data) => {
            if (data.status == 'ok') {

                this.Tags.next(data.tag_data);

            } else {
                this.Tags.next([]);
            }
        });
    }

    sort(order){
        this.socket.emit('sortTag', {order:order}, (data) => {
            if (data.status == 'ok') {

                this.Tags.next(data.tag_data);

            } else {
                this.Tags.next([]);
            }
        });
    }

    insertTag(tags: any){

        this.socket.emit('updateTagProperty', { tags: tags }, (data) => {
            if (data.status == 'ok') {
                this.Tags.next(tags);
                this.snackbar.openFromComponent(ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: 'Tag(s) added Successfully!'
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'success']
                });
            } else {
                this.Tags.next([]);
            }
        });
    }

    deleteTag(tags: any) {
        console.log(tags);

        this.socket.emit('updateTagProperty', { tags: tags }, (data) => {
            if (data.status == 'ok') {
                this.Tags.next(tags);
                this.snackbar.openFromComponent(ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: 'Tag deleted Successfully!'
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'success']
                });
            } else {
                this.Tag.next([]);
            }
        });
    }

    UpdateTag(tags: any){
        this.socket.emit('updateTagProperty', { tags: tags }, (data) => {
            if (data.status == 'ok') {
                this.Tags.next(tags);
                this.snackbar.openFromComponent(ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: 'Tag updated Successfully!'
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'success']
                });
            } else {
                this.Tag.next([]);
            }
        });
    }
}