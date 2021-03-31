import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { SocketService } from "../SocketService";
import { AuthService } from "../AuthenticationService";
import { PushNotificationsService } from "../NotificationService";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AdminSettingsService } from "../adminSettingsService";
import { ToastNotifications } from "../../app/dialogs/SnackBar-Dialog/toast-notifications.component";
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";


@Injectable()
export class WidgetMarketingService {

    private socket: SocketIOClient.Socket;
    newsList: BehaviorSubject<any> = new BehaviorSubject([]);
    activeNewsList: BehaviorSubject<any> = new BehaviorSubject([]);
    promotionsList: BehaviorSubject<any> = new BehaviorSubject([]);
    activePromList: BehaviorSubject<any> = new BehaviorSubject([]);
    faqList: BehaviorSubject<any> = new BehaviorSubject([]);
    loading: BehaviorSubject<any> = new BehaviorSubject(false);
    cubeLoading: BehaviorSubject<any> = new BehaviorSubject(false);
    widgetMarketingSettings: BehaviorSubject<any> = new BehaviorSubject({});
    private subscriptions: Subscription[] = [];

    constructor(
        private _socket: SocketService,
        private _authService: AuthService,
        private dialog: MatDialog,
        private _notificationService: PushNotificationsService,
        public _settingsService: AdminSettingsService,
        public snackBar: MatSnackBar
    ) {
        // console.log('Widget Marketing Service Initialized!');

        this.subscriptions.push(this._socket.getSocket().subscribe(data => {
            if (data) {
                this.socket = data;
            }
        }));
        this.subscriptions.push(this._settingsService.widgetMarketingSettings.subscribe(data => {
            this.widgetMarketingSettings.next(data);
        }));
    }

    // --------- NEWS HELPERS ----------- //
    AddNews(news: News, update) {
        this.socket.emit('addNews', { news: news, update: update }, (response) => {
            if (response.status == 'ok') {
                this.newsList.getValue().splice(0, 0, response.news);
                this.newsList.next(this.newsList.getValue());
            }
            else if (response.status == 'update') {
                let index = this.newsList.getValue().findIndex(data => data.title == response.news.title);
                this.newsList.getValue()[index] = response.news;
                this.newsList.next(this.newsList.getValue());
            }
            else if(response.status == 'error'){
                this.snackBar.openFromComponent(ToastNotifications, {
                    data: {
                        img: 'warning',
                        msg: response.msg
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'error']
                });
            }
            this.loading.next(false);
        });
    }

    public Destroy() {
        this.subscriptions.map(subscription => {
            subscription.unsubscribe();
        });
    }

    ToggleNews(newsId, check) {
        this.socket.emit('toggleNews', { newsId: newsId, check: check }, (response) => {
            if (response.status == 'ok') {
                let index = this.newsList.getValue().findIndex(obj => obj._id == response.news._id);
              //  console.log(index)
                this.newsList.getValue()[index] = response.news;
                this.newsList.next(this.newsList.getValue());
            } else if (response.status == 'error') {
                console.log(response.msg);
            }
        });
    }
    GetNews() {
        this.loading.next(true);
        this.socket.emit('getNews', {}, (response) => {
            if (response.status == 'ok') {
                response.widgetMarketing.news = response.widgetMarketing.news.sort((a, b) => {
                    return (new Date(a.createdOn).getTime() - new Date(b.createdOn).getTime() > 0) ? -1 : 1
                });
                this.newsList.next(response.widgetMarketing.news);

            } else {
                this.newsList.next([]);
            }
            this.loading.next(false);
        });
    }
    GetActiveNews() {
        this.socket.emit('getActiveNews', {}, (response) => {
            if (response.status == 'ok') {
                //console.log(response);
                this.activeNewsList.next(response.activeNewsList);
            } else {
                this.activeNewsList.next([]);
            }
        });
    }
    GetMoreNews(LastObjectId) {
        this.socket.emit('getMoreNews', { LastObjectId: LastObjectId }, (response) => {
            if (response.status == 'ok' && response.newsList.length) {
                if (!this.newsList.getValue().ended) {
                    response.newsList.forEach(element => {
                        this.newsList.getValue().push(element);
                        this.newsList.getValue().ended = response.ended;
                    });
                    this.newsList.next(this.newsList.getValue());
                }
            }
            this.cubeLoading.next(false);
        });
    }
    GetNewsBySearch(text: string = ''): Observable<any> {
        return new Observable(observer => {
            try {
                this.socket.emit('getNewsBySearch', { text: text }, (response) => {
                    //console.log(response);
                    if (response.status == 'ok' && response.newsList.length) {
                        observer.next(response.newsList)
                        observer.complete()
                    }
                    else {
                        observer.next([])
                        observer.complete()
                    }
                    this.cubeLoading.next(false);
                });
            } catch (error) {
                this.cubeLoading.next(false);
                observer.error('error in searching news')
            }
        })
    }
  
    DeleteNews(newsId) {
        this.socket.emit('deleteNews', { newsId: newsId }, (response) => {
            if (response.status == 'ok') {
               // console.log(response);
                let index = this.newsList.getValue().findIndex(obj => obj._id == newsId);
                this.newsList.getValue().splice(index, 1);
                this.newsList.next(this.newsList.getValue());
            }
        });
    }
    // --------- NEWS HELPERS ----------- //

    // --------- PROMOTIONS HELPERS ----------- //
    AddPromotion(promotion: Promotion,update) {
        this.socket.emit('addPromotion', { promotion: promotion, update: update  }, (response) => {
            if (response.status == 'ok') {
                this.promotionsList.getValue().splice(0, 0, response.promotion)
                this.promotionsList.next(this.promotionsList.getValue());
            }
            else if (response.status == 'update') {
                let index = this.promotionsList.getValue().findIndex(data => data.title == response.promotion.title);
                this.promotionsList.getValue()[index] = response.promotion;
                this.promotionsList.next(this.promotionsList.getValue());
            }
            else if(response.status == 'error'){
                this.snackBar.openFromComponent(ToastNotifications, {
                    data: {
                        img: 'warning',
                        msg: response.msg
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'error']
                });
            }
            this.loading.next(false);
        });
    }
    TogglePromotion(pId, check) {
        this.socket.emit('togglePromotion', { pId: pId, check: check }, (response) => {
            if (response.status == 'ok') {
                let index = this.promotionsList.getValue().findIndex(obj => obj._id == response.promotion._id);
                this.promotionsList.getValue()[index] = response.promotion;
                this.promotionsList.next(this.promotionsList.getValue());
            }
        });
    }
    GetPromotions() {
        this.socket.emit('getPromotions', {}, (response) => {
            if (response.status == 'ok') {
                response.widgetMarketing.promotions = response.widgetMarketing.promotions.sort((a, b) => {
                    return (new Date(a.createdOn).getTime() - new Date(b.createdOn).getTime() > 0) ? -1 : 1
                });
                // console.log(response.widgetMarketing);

                this.promotionsList.next(response.widgetMarketing.promotions);
            } else {
                this.promotionsList.next([]);
            }
        });
    }
    GetActivePromotions() {
        this.socket.emit('getActivePromotions', {}, (response) => {
            if (response.status == 'ok') {
               // console.log(response);
                this.activePromList.next(response.activePromList);
            } else {
                this.activePromList.next([]);
            }
        });
    }
    GetMorePromotions(LastObjectId) {
        this.socket.emit('getMorePromotions', { LastObjectId: LastObjectId }, (response) => {
            if (response.status == 'ok' && response.promList.length) {
                if (!this.promotionsList.getValue().ended) {
                   // console.log(response.promList)
                    response.promList.forEach(element => {
                        this.promotionsList.getValue().push(element);
                        this.promotionsList.getValue().ended = response.ended;
                    });
                    this.promotionsList.next(this.promotionsList.getValue());
                }
            }
            this.cubeLoading.next(false);
        });
    }
    GetPromotionsBySearch(text: string = ''): Observable<any> {
        return new Observable(observer => {
            try {
                this.socket.emit('getPromotionsBySearch', { text: text }, (response) => {
                   // console.log(response);
                    if (response.status == 'ok' && response.promList.length) {
                        observer.next(response.promList)
                        observer.complete()
                    }
                    else {
                        observer.next([])
                        observer.complete()
                    }
                    this.cubeLoading.next(false);
                });
            } catch (error) {
                this.cubeLoading.next(false);
                observer.error('error in searching promotions')
            }
        })
    }
    DeletePromotion(pId) {
        this.socket.emit('deletePromotion', { pId: pId }, (response) => {
            if (response.status == 'ok') {
               // console.log(response);
                let index = this.promotionsList.getValue().findIndex(obj => obj._id == pId);
                this.promotionsList.getValue().splice(index, 1);
                this.promotionsList.next(this.promotionsList.getValue());
            }
        });
    }
    // --------- PROMOTIONS HELPERS ----------- //

    // --------- FAQS HELPERS ----------- //
    AddFaq(faq: Faq, update) {
        this.socket.emit('addFaq', { faq: faq, update: update }, (response) => {
          //  console.log(response);
            if (response.status == 'ok') {
                this.faqList.getValue().splice(0, 0, response.faq)
                this.faqList.next(this.faqList.getValue());
            } else if (response.status == 'update') {
                let index = this.faqList.getValue().findIndex(data => data.question == response.faq.question);
                this.faqList.getValue()[index] = response.faq;
                this.faqList.next(this.faqList.getValue());
            }
            else if(response.status == 'error'){
                this.snackBar.openFromComponent(ToastNotifications, {
                    data: {
                        img: 'warning',
                        msg: response.msg
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'error']
                });
            }
        });
    }
    AddMessageAsFaq(faq: Faq): Observable<any> {
        return new Observable((observer) => {
            this.socket.emit('addFaq', { faq: faq }, (response) => {
                if (response.status == 'ok') {
                    this.faqList.getValue().splice(0, 0, response.faq)
                    this.faqList.next(this.faqList.getValue());
                }
                observer.next(response.status);
                observer.complete();
            });
        })

    }
    ToggleFaq(fId, check) {
        this.socket.emit('toggleFaq', { fId: fId, check: check }, (response) => {
            if (response.status == 'ok') {
                let index = this.faqList.getValue().findIndex(obj => obj._id == response.faq._id);
                this.faqList.getValue()[index] = response.faq;
                this.faqList.next(this.faqList.getValue());
            }
        });
    }
    GetFaqs() {
        this.socket.emit('getFaqs', {}, (response) => {
            if (response.status == 'ok') {
                response.widgetMarketing.faqs = response.widgetMarketing.faqs.sort((a, b) => {
                    return (new Date(a.createdOn).getTime() - new Date(b.createdOn).getTime() > 0) ? -1 : 1
                });
                this.faqList.next(response.widgetMarketing.faqs);
            } else {
                this.faqList.next([]);
            }
        });
    }
    GetMoreFaqs(LastObjectId) {
       // console.log(LastObjectId);
        this.socket.emit('getMoreFaqs', { LastObjectId: LastObjectId }, (response) => {
            if (response.status == 'ok' && response.faqList.length) {
                if (!this.faqList.getValue().ended) {
                    response.faqList.forEach(element => {
                        this.faqList.getValue().push(element);
                        this.faqList.getValue().ended = response.ended;
                    });
                    this.faqList.next(this.faqList.getValue());
                }
            }
            this.cubeLoading.next(false);
        });
    }
    GetFaqsBySearch(text: string = ''): Observable<any> {
        return new Observable(observer => {
            try {
                this.socket.emit('getFaqBySearch', { text: text }, (response) => {
                    //console.log(response);
                    if (response.status == 'ok' && response.faqList.length) {
                        observer.next(response.faqList)
                        observer.complete()
                    }
                    else {
                        observer.next([])
                        observer.complete()
                    }
                    this.cubeLoading.next(false);
                });
            } catch (error) {
                this.cubeLoading.next(false);
                observer.error('error in searching faqs')
            }
        })
    }
    DeleteFaq(fId) {
        this.socket.emit('deleteFaq', { fId: fId }, (response) => {
            if (response.status == 'ok') {
              //  console.log(response);
                let index = this.faqList.getValue().findIndex(obj => obj._id == fId);
                this.faqList.getValue().splice(index, 1);
                this.faqList.next(this.faqList.getValue());
            }
        });
    }
    // --------- FAQS HELPERS ----------- //

    // --------- WIDGET MARKETING SETTINGS ----------- //
    saveWMSettings(settings) {
        this._settingsService
            .setNSPWMSettings(settings)
            .subscribe(response => {
                if (response.status == 'ok') {
                    this.snackBar.openFromComponent(ToastNotifications, {
                        data: {
                            img: 'ok',
                            msg: 'Settings saved successfully!'
                        },
                        duration: 2000,
                        panelClass: ['user-alert', 'success']
                    });
                } else if (response.status == 'error') {
                    this.snackBar.openFromComponent(ToastNotifications, {
                        data: {
                            img: 'warning',
                            msg: 'Error!'
                        },
                        duration: 2000,
                        panelClass: ['user-alert', 'error']
                    });
                }
                //Do Some Error Logic If Any
                //Check Server Responses For this Event
            }, err => {
                //TO DO ERROR LOGIC
            });
    }
    // --------- WIDGET MARKETING SETTINGS ----------- //
}


// -------- INTERFACES --------//

interface News {
    title: string;
    desc: string;
    link?: string;
    image?: any;
    background?: any;
}

interface Promotion {
    title?: string;
    desc?: string;
    link?: string;
    image?: any;
    type: string;
    price?: number;
    background?: any;
    currency?: any;
    count?:number;
}

interface Faq {
    question: string;
    answer: string;
    feedback?: string;
}



// -------- INTERFACES --------//