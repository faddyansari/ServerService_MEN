import { Injectable, ɵConsole } from "@angular/core";

//RxJS Imports
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/observable/interval';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
//End RxJs Imports

import * as io from 'socket.io-client';

//Services Imports
import { SocketService } from "./SocketService";
import { AuthService } from "./AuthenticationService";
import { Contactservice } from "./ContactService";
import { PushNotificationsService } from "./NotificationService";
import { Http } from "@angular/http";
import { Subject } from "rxjs/Subject";

@Injectable()
export class CRMService {


    serverAddress = '';
    public Agent: BehaviorSubject<any> = new BehaviorSubject({});
    public AllCustomers: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
    customer: BehaviorSubject<any> = new BehaviorSubject({});
    subscriptions: Subscription[] = [];
    socket: SocketIOClient.Socket;
    selectedCustomer: BehaviorSubject<any> = new BehaviorSubject({});
    selectedCustomerConversation: BehaviorSubject<any> = new BehaviorSubject({});
    selectedSessionInfo: BehaviorSubject<Array<any>> = new BehaviorSubject([{}]);
    selectedSessionDetails: BehaviorSubject<any> = new BehaviorSubject(undefined);

    customerConversationList: BehaviorSubject<any> = new BehaviorSubject([]);
    notification: BehaviorSubject<any> = new BehaviorSubject('');
    updated: Boolean = new Boolean(false);
    public timer = Observable.interval(1000 * 60);
    // showCustomerInfo: BehaviorSubject<boolean> = new BehaviorSubject(false);
    showCustomerInfo: Subject<boolean> = new Subject();
    //Loading Variable

    private loadingCustomers: BehaviorSubject<boolean> = new BehaviorSubject(true);
    public viewingConversation: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public ifMoreRecentChats: BehaviorSubject<boolean> = new BehaviorSubject(true);

    public loadingMoreCustomers: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public noMoreCustomersToFetch: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public loadingStats: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public isStatActive: BehaviorSubject<boolean> = new BehaviorSubject(false);
    customerStats: BehaviorSubject<any> = new BehaviorSubject({});


    constructor(private http: Http, private _socket: SocketService, private _authService: AuthService, private _contactService: Contactservice, private _notificationService: PushNotificationsService) {
        this.AllCustomers = new BehaviorSubject([]);

        //Subscribing Agent Object
        this.subscriptions.push(_authService.getAgent().subscribe(data => {
            this.Agent.next(data);
        }));
        //Subscribing Server Address
        this.subscriptions.push(_authService.analyticsURL.subscribe(url => {
            this.serverAddress = url;
        }));
        //Subscribing Connected Socket
        this.subscriptions.push(_socket.getSocket().subscribe(data => {
            if (data) {
                this.socket = data;
                this.getAllCustomers();
            }

        }));

    }


    public getLoadingVariable(): Observable<any> {
        return this.loadingCustomers.asObservable();
    }

    public setLaodingVariable(value: boolean) {
        this.loadingCustomers.next(value);
    }

    public getAllCustomersList(): Observable<any> {
        return this.AllCustomers.asObservable();
    }

    public getAllCustomers() {
        ////console.log('Getting Customers!');
        this.setLaodingVariable(true);
        this.socket.emit('customerList', {}, (response) => {
            // //console.log('Response: ', response);
            if (response.status == 'ok') {
                // //console.log(response)
                this.AllCustomers.next(response.list);
            }
            this.setLaodingVariable(false);
        });

    }

    public getMoreCustomersFromBackend(id) {

        try {


            if (this.noMoreCustomersToFetch.getValue()) return
            this.loadingMoreCustomers.next(true);
            this.socket.emit('getMoreCustomers', { id: id }, (response) => {
                if (response.status == 'ok' && response.customers && response.customers.length > 0) {
                    //console.log(response);
                    if ((response as Object).hasOwnProperty('noMoreCustomers')) this.noMoreCustomersToFetch.next(response.noMoreCustomers)
                    let customers: Array<any> = this.AllCustomers.getValue();
                    let data = customers.concat(response.customers);
                    this.AllCustomers.next(data);
                    this.loadingMoreCustomers.next(false);
                } else {
                    // console.log('error');
                    this.loadingMoreCustomers.next(false);
                }
            });
        } catch (error) {
            // console.log('error');
            this.loadingMoreCustomers.next(false);
        }
    }
    public SearchVisitor(keyword, chunk = ''): Observable<any> {


        return new Observable(observer => {

            this.loadingMoreCustomers.next(true);
            ////console.log('Searching contact on server...');

            this.socket.emit('searchCustomers', {
                keyword: keyword,
                chunk: chunk
            }, (response) => {
                if (response) {
                    observer.next(response);
                    observer.complete();
                    // let customers: Array<any> = this.AllCustomers.getValue();
                    // let data = customers.concat(response.customers);

                    // this.AllCustomers.next(data);
                    this.loadingMoreCustomers.next(false);
                } else {
                    observer.next(response);
                    this.loadingMoreCustomers.next(false);
                }
            });

        })

    }

    // public LoadMore() {
    //     this.LoadingMessage = true;

    //     //setTimeout(() => {
    //       this._dataService.GetMoreRecentChats(this.Session.deviceID, this.Conversations[this.Conversations.length - 1]._id).subscribe(data => {
    //         this.ifMoreRecentChats = data;
    //         this.ErrorRecentChats = false;
    //         this.LoadingMessage = true;

    //       }, err => {
    //         this.ErrorRecentChats = true;
    //         this.LoadingMessage = true;
    //       });
    //     //}, 5000);

    //   }

    public getConversationsList(deviceID): Observable<any> {

        return new Observable(observer => {
            this.socket.emit('CustomerConversationsList', { deviceID: deviceID }, (response) => {
                if (response.status == 'ok' && response.conversations && response.conversations.length > 0) {

                    observer.next(response.conversations);
                    observer.complete();
                    //this.customerConversationList.next(response.conversations);
                } else {
                    observer.next([]);
                    observer.complete();
                    //this.customerConversationList.next([]);
                    ////console.log("no messages found in conversation")
                }
            });
        })
    }

    // public getSelectedCustomersInfo() {
    //     // this.socket.emit('CustomerConversationsList', {}, (response) => {
    //     //     if (response.status == 'ok' && response.conversations.length) {
    //     //         this.customerConversationList.next(response.conversations);
    //     //     } else {
    //     //         this.customerConversationList.next([]);
    //     //     }
    //     // });
    // }

    public getSelectedCustomer(): Observable<any> {
        return this.selectedCustomer.asObservable();
    }

    public getSelectedSessionDetails(): Observable<any> {
        return this.selectedSessionDetails.asObservable();
    }
    public setSelectedSessionDetails(session) {
        this.selectedSessionDetails.next(session)
    }

    public getCurrentConversation(): Observable<any> {
        return this.selectedCustomerConversation.asObservable();
    }
    public setSelectedCustomer(deviceID?) {
        this.isStatActive.next(false);
        if (deviceID) {
            this.AllCustomers.getValue().map(customer => {
                if (customer.deviceID == deviceID) {
                    this.selectedCustomer.next(customer);
                    this.GetCustomerStatistics(this.Agent.getValue().csid, customer.deviceID).subscribe(response => {
                        if (response.status == 200) {
                            this.customerStats.next(response.json());
                            //  //console.log(this.customerStats.getValue());
                        }
                    });
                }
            });
        } else {
            this.selectedCustomer.next({});
            this.selectedCustomerConversation.next({});

        }
        this.selectedSessionDetails.next(undefined)
    }


    setNotification(notification: string, type: string, icon: string) {

        let item = {
            msg: notification,
            type: type,
            img: icon
        }
        this.notification.next(item);
        this.updated = false; //raheed
    }
    getNotification() {

        return this.notification.asObservable();

    }


    Destroy() {
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
    }

    // toggleCustomerAccessInformation() {
    //     this.showCustomerInfo.next(!this.showCustomerInfo.getValue());
    // }
    toggleCustomerAccessInformation(value) {
        // //console.log(this.showCustomerInfo)
        this.showCustomerInfo.next(value);
    }

    public UpdateCustomer(selectedCustomer: any) {


        // this.AllCustomers.next(this.AllCustomers.getValue().map((customer) => {
        //     if (customer.deviceID == selectedCustomer.deviceID) {
        //         customer = selectedCustomer;
        //     }
        //     return customer;
        // }));
        //this.setSelectedCustomer(data.deviceID);
    }

    public setSelectedConversation(cid) {
        this.selectedCustomer.getValue().conversations.map(convo => {
            if (convo._id == cid) {
                this.selectedCustomerConversation.next(convo);
            }
        });


        if (!this.selectedCustomerConversation.getValue().msgFetched) this.selectedCustomerConversation.getValue().msgFetched = false;
        if (!this.selectedCustomerConversation.getValue().msgFetched && !this.selectedCustomerConversation.getValue().msgList) {
            this.ShowSelectedChat();

        }
        this.viewingConversation.next(true);
    }



    public getMoreConversationsFromBackend(deviceID, id) {
        this.setLaodingVariable(true);
        this.socket.emit('MoreCustomerConversationsList', { deviceID: deviceID, id: id }, (response) => {
            if (response.status == 'ok' && response.conversations && response.conversations.length > 0) {

                let Convos: Array<any> = [];
                Convos = this.selectedCustomer.getValue().conversations;
                let data = Convos.concat(response.conversations);
                this.AllCustomers.next(this.AllCustomers.getValue().map((customer) => {
                    if (customer.deviceID == deviceID) {
                        customer.conversations = data;
                        this.setSelectedCustomer(customer.deviceID);
                    }
                    return customer;

                }));

                this.ifMoreRecentChats.next(true);
                this.setLaodingVariable(false);
            } else {
                this.ifMoreRecentChats.next(false);
                this.setLaodingVariable(false);
            }
        });



    }

    public ShowSelectedChat() {
        this.socket.emit('SelectedConversationDetails', { cid: this.selectedCustomerConversation.getValue()._id }, (response => {
            if (response.status == "ok") {
                this.selectedCustomerConversation.getValue().msgFetched = true;
                this.selectedCustomerConversation.getValue().msgList = response.msgList;
                this.selectedCustomerConversation.next(this.selectedCustomerConversation.getValue());
                this.UpdateConversation(this.selectedCustomerConversation, response.msgList);

            }
            else {
                ////console.log("no messages found in conversation")

            }
        }));

    }

    public UpdateConversation(conversation: any, messages: any) {

        this.AllCustomers.next(this.AllCustomers.getValue().map((customer) => {
            if (customer.deviceID == this.selectedCustomer.getValue().deviceID) {
                customer.conversations.msgList = messages;
            }
            return customer;
        }));


    }

    ExtractSessionInfo() {

        if (!this.selectedCustomer.getValue().sessionInfo) this.selectedCustomer.getValue().sessionInfo = [];
        if (this.selectedCustomer.getValue().conversations) {
            this.selectedCustomer.getValue().conversations.map(convo => {


                let info: any = {};
                info._id = convo.sessionid;
                info.deviceID = convo.deviceID;
                info.agentemail = convo.agentEmail;
                info.visitorName = convo.visitorName;
                info.createdOn = convo.createdOn;

                this.selectedCustomer.getValue().sessionInfo.push(info);
            });

            this.setSelectedCustomer(this.selectedCustomer.getValue().deviceID)
            //this.UpdateCustomer(this.selectedCustomer)

        }
    }

    public GetCustomerStatistics(sid, deviceID): Observable<any> {
        this.loadingStats.next(true);
        return new Observable((observer) => {
            this.http.get(this.serverAddress + 'crm/' + sid + '/customerdetails/' + deviceID).subscribe((response) => {
                this.loadingStats.next(false);
                observer.next(response);
                observer.complete();
            }, err => {
                this.loadingStats.next(false);
                observer.error(err);
            });
        });
    }

    ToggleStats() {
        this.isStatActive.next(!this.isStatActive.getValue());
    }
    setStatsStatus(value) {
        this.isStatActive.next(value);
    }


    //Schema Less

    GetWorkFlowsList(): Observable<any> {
        return new Observable(observer => {

        })
    }

    GetStateMachineList() {

    }

    public GetSessionDetails(session): Observable<any> {

        return new Observable(observer => {
            this.socket.emit('getCrmSessionDetails', { session: session }, (response) => {
                if (response.status == 'ok' && response.sessionDetails) {
                    //console.log(response);

                    observer.next(response.sessionDetails);
                    observer.complete();
                    //this.customerConversationList.next(response.conversations);
                } else {
                    observer.next([]);
                    observer.complete();
                    //this.customerConversationList.next([]);
                    ////console.log("no messages found in conversation")
                }
            });
        })
    }

    SelectCustomer(value) {
        let hash = 0;
        this.AllCustomers.getValue().map((customer, index) => {

            if (customer._id == this.selectedCustomer.getValue()._id) {
                hash = (value == 'next') ? (index + 1) : (index - 1)
            }
        })
        if (hash >= 0) {
            if (this.AllCustomers.getValue()[hash]) {
                this.setSelectedCustomer(this.AllCustomers.getValue()[hash].deviceID)
            }
        }
    }

}