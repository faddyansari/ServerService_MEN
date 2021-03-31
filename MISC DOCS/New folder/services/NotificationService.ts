import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { GlobalStateService } from './GlobalStateService';
@Injectable()
export class PushNotificationsService {
    public permission: Permission;
    constructor(private _routerService: GlobalStateService) {
        this.permission = this.isSupported() ? 'default' : 'denied';
    }
    public isSupported(): boolean {
        return 'Notification' in window;
    }
    public requestPermission(): void {
        let self = this;
        if ('Notification' in window) {
            Notification.requestPermission(function (status) {
                return self.permission = status;
            });
        }
    }

    public NotificationClick(options: any) {
        let currentlocation: string = String(window.location)
        let notiflocation: string = window.location.origin + options.url
        if (currentlocation == notiflocation) {
            window.focus();
        } else {
            window.focus();
            //this._routerService.NavigateTo(options.url);//Has a bug that needs to be resolved.
            window.open(notiflocation, "_self");  //temporary solution
        }
    }

    public create(title: string, options?: PushNotification): any {
        let self = this;
        return new Observable((obs) => {
            if (!('Notification' in window)) {
                console.log('Notifications are not available in this environment');
                obs.complete();
            }
            if (self.permission !== 'granted') {
                console.log("The user hasn't granted you permission to send push notifications");
                obs.complete();
            }
            let _notify = new Notification(title, options);
            _notify.onshow = function (e) {
                return obs.next({
                    notification: _notify,
                    event: e
                });
            };
            if(options.url){
                _notify.onclick = (e) => { this.NotificationClick(options); }
            }        
            _notify.onerror = function (e) {
                return obs.error({
                    notification: _notify,
                    event: e
                });
            };
            _notify.onclose = function () {
                return obs.complete();
            };
        });
    }
    generateNotification(source: Array<any>): void {
        let self = this;
        source.forEach((item) => {
            let options = {
                body: item.alertContent,
                icon: item.icon,
                url: item.url,
                renotify: false,
                tag: item.tag ? item.tag : ''
            };
            let notify = self.create(item.title, options).subscribe();
        })
    }

}


export declare type Permission = 'denied' | 'granted' | 'default';
export interface PushNotification {
    body?: string;
    icon?: string;
    tag?: string;
    data?: any;
    renotify?: boolean;
    silent?: boolean;
    sound?: string;
    noscreen?: boolean;
    sticky?: boolean;
    dir?: 'auto' | 'ltr' | 'rtl';
    lang?: string;
    vibrate?: number[];
    url?: string
}