import { Injectable } from '@angular/core';

//RxJs Imports
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter'
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
//End RxJs Imports

@Injectable()

export class LocalStorageService {
    tabId: BehaviorSubject<string> = new BehaviorSubject('');
    status: BehaviorSubject<boolean> = new BehaviorSubject(false);
    constructor() {
        this.tabId = new BehaviorSubject((Math.random() + Date.parse(new Date().toString())).toFixed().toString());
        window.addEventListener('storage', (e) => { this.StorageEventListener(e) });
    }


    public getTabId(): Observable<string> {
        return this.tabId.asObservable();
    }
    public getStatus(): Observable<boolean> {
        return this.status.asObservable();
    }

    public setTabId(value: string) {
        this.tabId.next(value);
    }


    public setValue(key: string, crossTabSignal: boolean) {
        localStorage.setItem(key, this.tabId.getValue());
        if (crossTabSignal) {
            Observable.timer(1500).subscribe(() => {
                localStorage.removeItem(key);
            });
        }
    }

    public getValue() {

    }

    private StorageEventListener(e: StorageEvent) {
        switch (e.key) {
            case 'logout':
                if (e.newValue != this.tabId.getValue() && e.newValue) {
                    console.log('Logout');
                    this.status.next(true);
                }
                break;
            case 'login':
                break;
        }
    }
}








