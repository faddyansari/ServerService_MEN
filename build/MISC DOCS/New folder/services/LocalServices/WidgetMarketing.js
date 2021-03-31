"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WidgetMarketingService = void 0;
var core_1 = require("@angular/core");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var toast_notifications_component_1 = require("../../app/dialogs/SnackBar-Dialog/toast-notifications.component");
var Observable_1 = require("rxjs/Observable");
var WidgetMarketingService = /** @class */ (function () {
    function WidgetMarketingService(_socket, _authService, dialog, _notificationService, _settingsService, snackBar) {
        // console.log('Widget Marketing Service Initialized!');
        var _this = this;
        this._socket = _socket;
        this._authService = _authService;
        this.dialog = dialog;
        this._notificationService = _notificationService;
        this._settingsService = _settingsService;
        this.snackBar = snackBar;
        this.newsList = new BehaviorSubject_1.BehaviorSubject([]);
        this.activeNewsList = new BehaviorSubject_1.BehaviorSubject([]);
        this.promotionsList = new BehaviorSubject_1.BehaviorSubject([]);
        this.activePromList = new BehaviorSubject_1.BehaviorSubject([]);
        this.faqList = new BehaviorSubject_1.BehaviorSubject([]);
        this.loading = new BehaviorSubject_1.BehaviorSubject(false);
        this.cubeLoading = new BehaviorSubject_1.BehaviorSubject(false);
        this.widgetMarketingSettings = new BehaviorSubject_1.BehaviorSubject({});
        this.subscriptions = [];
        this.subscriptions.push(this._socket.getSocket().subscribe(function (data) {
            if (data) {
                _this.socket = data;
            }
        }));
        this.subscriptions.push(this._settingsService.widgetMarketingSettings.subscribe(function (data) {
            _this.widgetMarketingSettings.next(data);
        }));
    }
    // --------- NEWS HELPERS ----------- //
    WidgetMarketingService.prototype.AddNews = function (news, update) {
        var _this = this;
        this.socket.emit('addNews', { news: news, update: update }, function (response) {
            if (response.status == 'ok') {
                _this.newsList.getValue().splice(0, 0, response.news);
                _this.newsList.next(_this.newsList.getValue());
            }
            else if (response.status == 'update') {
                var index = _this.newsList.getValue().findIndex(function (data) { return data.title == response.news.title; });
                _this.newsList.getValue()[index] = response.news;
                _this.newsList.next(_this.newsList.getValue());
            }
            else if (response.status == 'error') {
                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'warning',
                        msg: response.msg
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'error']
                });
            }
            _this.loading.next(false);
        });
    };
    WidgetMarketingService.prototype.Destroy = function () {
        this.subscriptions.map(function (subscription) {
            subscription.unsubscribe();
        });
    };
    WidgetMarketingService.prototype.ToggleNews = function (newsId, check) {
        var _this = this;
        this.socket.emit('toggleNews', { newsId: newsId, check: check }, function (response) {
            if (response.status == 'ok') {
                var index = _this.newsList.getValue().findIndex(function (obj) { return obj._id == response.news._id; });
                //  console.log(index)
                _this.newsList.getValue()[index] = response.news;
                _this.newsList.next(_this.newsList.getValue());
            }
            else if (response.status == 'error') {
                console.log(response.msg);
            }
        });
    };
    WidgetMarketingService.prototype.GetNews = function () {
        var _this = this;
        this.loading.next(true);
        this.socket.emit('getNews', {}, function (response) {
            if (response.status == 'ok') {
                response.widgetMarketing.news = response.widgetMarketing.news.sort(function (a, b) {
                    return (new Date(a.createdOn).getTime() - new Date(b.createdOn).getTime() > 0) ? -1 : 1;
                });
                _this.newsList.next(response.widgetMarketing.news);
            }
            else {
                _this.newsList.next([]);
            }
            _this.loading.next(false);
        });
    };
    WidgetMarketingService.prototype.GetActiveNews = function () {
        var _this = this;
        this.socket.emit('getActiveNews', {}, function (response) {
            if (response.status == 'ok') {
                //console.log(response);
                _this.activeNewsList.next(response.activeNewsList);
            }
            else {
                _this.activeNewsList.next([]);
            }
        });
    };
    WidgetMarketingService.prototype.GetMoreNews = function (LastObjectId) {
        var _this = this;
        this.socket.emit('getMoreNews', { LastObjectId: LastObjectId }, function (response) {
            if (response.status == 'ok' && response.newsList.length) {
                if (!_this.newsList.getValue().ended) {
                    response.newsList.forEach(function (element) {
                        _this.newsList.getValue().push(element);
                        _this.newsList.getValue().ended = response.ended;
                    });
                    _this.newsList.next(_this.newsList.getValue());
                }
            }
            _this.cubeLoading.next(false);
        });
    };
    WidgetMarketingService.prototype.GetNewsBySearch = function (text) {
        var _this = this;
        if (text === void 0) { text = ''; }
        return new Observable_1.Observable(function (observer) {
            try {
                _this.socket.emit('getNewsBySearch', { text: text }, function (response) {
                    //console.log(response);
                    if (response.status == 'ok' && response.newsList.length) {
                        observer.next(response.newsList);
                        observer.complete();
                    }
                    else {
                        observer.next([]);
                        observer.complete();
                    }
                    _this.cubeLoading.next(false);
                });
            }
            catch (error) {
                _this.cubeLoading.next(false);
                observer.error('error in searching news');
            }
        });
    };
    WidgetMarketingService.prototype.DeleteNews = function (newsId) {
        var _this = this;
        this.socket.emit('deleteNews', { newsId: newsId }, function (response) {
            if (response.status == 'ok') {
                // console.log(response);
                var index = _this.newsList.getValue().findIndex(function (obj) { return obj._id == newsId; });
                _this.newsList.getValue().splice(index, 1);
                _this.newsList.next(_this.newsList.getValue());
            }
        });
    };
    // --------- NEWS HELPERS ----------- //
    // --------- PROMOTIONS HELPERS ----------- //
    WidgetMarketingService.prototype.AddPromotion = function (promotion, update) {
        var _this = this;
        this.socket.emit('addPromotion', { promotion: promotion, update: update }, function (response) {
            if (response.status == 'ok') {
                _this.promotionsList.getValue().splice(0, 0, response.promotion);
                _this.promotionsList.next(_this.promotionsList.getValue());
            }
            else if (response.status == 'update') {
                var index = _this.promotionsList.getValue().findIndex(function (data) { return data.title == response.promotion.title; });
                _this.promotionsList.getValue()[index] = response.promotion;
                _this.promotionsList.next(_this.promotionsList.getValue());
            }
            else if (response.status == 'error') {
                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'warning',
                        msg: response.msg
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'error']
                });
            }
            _this.loading.next(false);
        });
    };
    WidgetMarketingService.prototype.TogglePromotion = function (pId, check) {
        var _this = this;
        this.socket.emit('togglePromotion', { pId: pId, check: check }, function (response) {
            if (response.status == 'ok') {
                var index = _this.promotionsList.getValue().findIndex(function (obj) { return obj._id == response.promotion._id; });
                _this.promotionsList.getValue()[index] = response.promotion;
                _this.promotionsList.next(_this.promotionsList.getValue());
            }
        });
    };
    WidgetMarketingService.prototype.GetPromotions = function () {
        var _this = this;
        this.socket.emit('getPromotions', {}, function (response) {
            if (response.status == 'ok') {
                response.widgetMarketing.promotions = response.widgetMarketing.promotions.sort(function (a, b) {
                    return (new Date(a.createdOn).getTime() - new Date(b.createdOn).getTime() > 0) ? -1 : 1;
                });
                // console.log(response.widgetMarketing);
                _this.promotionsList.next(response.widgetMarketing.promotions);
            }
            else {
                _this.promotionsList.next([]);
            }
        });
    };
    WidgetMarketingService.prototype.GetActivePromotions = function () {
        var _this = this;
        this.socket.emit('getActivePromotions', {}, function (response) {
            if (response.status == 'ok') {
                // console.log(response);
                _this.activePromList.next(response.activePromList);
            }
            else {
                _this.activePromList.next([]);
            }
        });
    };
    WidgetMarketingService.prototype.GetMorePromotions = function (LastObjectId) {
        var _this = this;
        this.socket.emit('getMorePromotions', { LastObjectId: LastObjectId }, function (response) {
            if (response.status == 'ok' && response.promList.length) {
                if (!_this.promotionsList.getValue().ended) {
                    // console.log(response.promList)
                    response.promList.forEach(function (element) {
                        _this.promotionsList.getValue().push(element);
                        _this.promotionsList.getValue().ended = response.ended;
                    });
                    _this.promotionsList.next(_this.promotionsList.getValue());
                }
            }
            _this.cubeLoading.next(false);
        });
    };
    WidgetMarketingService.prototype.GetPromotionsBySearch = function (text) {
        var _this = this;
        if (text === void 0) { text = ''; }
        return new Observable_1.Observable(function (observer) {
            try {
                _this.socket.emit('getPromotionsBySearch', { text: text }, function (response) {
                    // console.log(response);
                    if (response.status == 'ok' && response.promList.length) {
                        observer.next(response.promList);
                        observer.complete();
                    }
                    else {
                        observer.next([]);
                        observer.complete();
                    }
                    _this.cubeLoading.next(false);
                });
            }
            catch (error) {
                _this.cubeLoading.next(false);
                observer.error('error in searching promotions');
            }
        });
    };
    WidgetMarketingService.prototype.DeletePromotion = function (pId) {
        var _this = this;
        this.socket.emit('deletePromotion', { pId: pId }, function (response) {
            if (response.status == 'ok') {
                // console.log(response);
                var index = _this.promotionsList.getValue().findIndex(function (obj) { return obj._id == pId; });
                _this.promotionsList.getValue().splice(index, 1);
                _this.promotionsList.next(_this.promotionsList.getValue());
            }
        });
    };
    // --------- PROMOTIONS HELPERS ----------- //
    // --------- FAQS HELPERS ----------- //
    WidgetMarketingService.prototype.AddFaq = function (faq, update) {
        var _this = this;
        this.socket.emit('addFaq', { faq: faq, update: update }, function (response) {
            //  console.log(response);
            if (response.status == 'ok') {
                _this.faqList.getValue().splice(0, 0, response.faq);
                _this.faqList.next(_this.faqList.getValue());
            }
            else if (response.status == 'update') {
                var index = _this.faqList.getValue().findIndex(function (data) { return data.question == response.faq.question; });
                _this.faqList.getValue()[index] = response.faq;
                _this.faqList.next(_this.faqList.getValue());
            }
            else if (response.status == 'error') {
                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'warning',
                        msg: response.msg
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'error']
                });
            }
        });
    };
    WidgetMarketingService.prototype.AddMessageAsFaq = function (faq) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socket.emit('addFaq', { faq: faq }, function (response) {
                if (response.status == 'ok') {
                    _this.faqList.getValue().splice(0, 0, response.faq);
                    _this.faqList.next(_this.faqList.getValue());
                }
                observer.next(response.status);
                observer.complete();
            });
        });
    };
    WidgetMarketingService.prototype.ToggleFaq = function (fId, check) {
        var _this = this;
        this.socket.emit('toggleFaq', { fId: fId, check: check }, function (response) {
            if (response.status == 'ok') {
                var index = _this.faqList.getValue().findIndex(function (obj) { return obj._id == response.faq._id; });
                _this.faqList.getValue()[index] = response.faq;
                _this.faqList.next(_this.faqList.getValue());
            }
        });
    };
    WidgetMarketingService.prototype.GetFaqs = function () {
        var _this = this;
        this.socket.emit('getFaqs', {}, function (response) {
            if (response.status == 'ok') {
                response.widgetMarketing.faqs = response.widgetMarketing.faqs.sort(function (a, b) {
                    return (new Date(a.createdOn).getTime() - new Date(b.createdOn).getTime() > 0) ? -1 : 1;
                });
                _this.faqList.next(response.widgetMarketing.faqs);
            }
            else {
                _this.faqList.next([]);
            }
        });
    };
    WidgetMarketingService.prototype.GetMoreFaqs = function (LastObjectId) {
        var _this = this;
        // console.log(LastObjectId);
        this.socket.emit('getMoreFaqs', { LastObjectId: LastObjectId }, function (response) {
            if (response.status == 'ok' && response.faqList.length) {
                if (!_this.faqList.getValue().ended) {
                    response.faqList.forEach(function (element) {
                        _this.faqList.getValue().push(element);
                        _this.faqList.getValue().ended = response.ended;
                    });
                    _this.faqList.next(_this.faqList.getValue());
                }
            }
            _this.cubeLoading.next(false);
        });
    };
    WidgetMarketingService.prototype.GetFaqsBySearch = function (text) {
        var _this = this;
        if (text === void 0) { text = ''; }
        return new Observable_1.Observable(function (observer) {
            try {
                _this.socket.emit('getFaqBySearch', { text: text }, function (response) {
                    //console.log(response);
                    if (response.status == 'ok' && response.faqList.length) {
                        observer.next(response.faqList);
                        observer.complete();
                    }
                    else {
                        observer.next([]);
                        observer.complete();
                    }
                    _this.cubeLoading.next(false);
                });
            }
            catch (error) {
                _this.cubeLoading.next(false);
                observer.error('error in searching faqs');
            }
        });
    };
    WidgetMarketingService.prototype.DeleteFaq = function (fId) {
        var _this = this;
        this.socket.emit('deleteFaq', { fId: fId }, function (response) {
            if (response.status == 'ok') {
                //  console.log(response);
                var index = _this.faqList.getValue().findIndex(function (obj) { return obj._id == fId; });
                _this.faqList.getValue().splice(index, 1);
                _this.faqList.next(_this.faqList.getValue());
            }
        });
    };
    // --------- FAQS HELPERS ----------- //
    // --------- WIDGET MARKETING SETTINGS ----------- //
    WidgetMarketingService.prototype.saveWMSettings = function (settings) {
        var _this = this;
        this._settingsService
            .setNSPWMSettings(settings)
            .subscribe(function (response) {
            if (response.status == 'ok') {
                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: 'Settings saved successfully!'
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'success']
                });
            }
            else if (response.status == 'error') {
                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
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
        }, function (err) {
            //TO DO ERROR LOGIC
        });
    };
    WidgetMarketingService = __decorate([
        core_1.Injectable()
    ], WidgetMarketingService);
    return WidgetMarketingService;
}());
exports.WidgetMarketingService = WidgetMarketingService;
// -------- INTERFACES --------//
//# sourceMappingURL=WidgetMarketing.js.map