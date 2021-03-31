"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WmNewsComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var WidgetMarketing_1 = require("../../../../../services/LocalServices/WidgetMarketing");
var forkJoin_1 = require("rxjs/observable/forkJoin");
var Observable_1 = require("rxjs/Observable");
var confirmation_dialog_component_1 = require("../../../../dialogs/confirmation-dialog/confirmation-dialog.component");
var Subject_1 = require("rxjs/Subject");
var operators_1 = require("rxjs/operators");
var WmNewsComponent = /** @class */ (function () {
    function WmNewsComponent(formBuilder, _WMService, _uploadingService, snackBar, dialog, _appStateService) {
        var _this = this;
        this.formBuilder = formBuilder;
        this._WMService = _WMService;
        this._uploadingService = _uploadingService;
        this.snackBar = snackBar;
        this.dialog = dialog;
        this._appStateService = _appStateService;
        this.scrollChanged = new Subject_1.Subject();
        this.subscriptions = [];
        this.newsList = [];
        this.loading = false;
        this.cubeLoading = false;
        //Scrolling
        this.scrollHeight = 0;
        this.scrollTop = 10;
        this.fetchedMore = false;
        this.currentNews = undefined;
        this.update = false;
        this.search = '';
        this.tempTypingData = '';
        this.newsSearch = new Subject_1.Subject();
        this._appStateService.contentInfo.next('');
        this._appStateService.breadCrumbTitle.next('Widget Marketing');
        _WMService.GetNews();
        this.newsForm = formBuilder.group({
            'title': [
                null,
                [
                    forms_1.Validators.required
                ]
            ],
            'desc': [
                null,
                [
                    forms_1.Validators.required
                ]
            ],
            'link': [
                null,
                []
            ],
            'image': [
                null,
                [
                    forms_1.Validators.required
                ]
            ],
            'background': [
                null,
                []
            ]
        });
        this.newsSearchForm = formBuilder.group({
            'searchValue': ['', [],]
        });
        this.subscriptions.push(_WMService.newsList.subscribe(function (data) {
            _this.newsList = data;
            _this.displayList = data;
        }));
        this.subscriptions.push(_WMService.widgetMarketingSettings.subscribe(function (data) {
            if (data) {
                _this.widgetMarketingSettings = data;
            }
        }));
        this.subscriptions.push(_WMService.loading.subscribe(function (data) {
            _this.loading = data;
        }));
        this.subscriptions.push(_WMService.cubeLoading.subscribe(function (data) {
            _this.cubeLoading = data;
        }));
        this.subscriptions.push(this.scrollChanged.debounceTime(200).subscribe(function (event) {
            if (event) {
                _this.scrollTop = _this.scrollContainer.nativeElement.scrollTop;
                // raw.scrollTop + raw.offsetHeight > raw.scrollHeight
                if (Math.round(event.target.scrollTop + event.target.clientHeight) >= (_this.scrollContainer.nativeElement.scrollHeight - 10)) {
                    _this.fetchedMore = true;
                    if (!_this.newsList.ended) {
                        //console.log('fetch more');
                        _this._WMService.cubeLoading.next(true);
                        _this._WMService.GetMoreNews((_this.newsList && _this.newsList.length) ? _this.newsList[_this.newsList.length - 1]._id : []);
                    }
                }
                _this.scrollHeight = _this.scrollContainer.nativeElement.scrollHeight;
            }
        }));
        this.subscriptions.push(this.newsSearch.pipe(operators_1.debounceTime(750)).subscribe(function (data) {
            if (!_this.search) {
                _this.displayList = _this.newsList;
                _this.tempTypingData = '';
                return;
            }
            if (_this.search) {
                if (_this.tempTypingData != _this.search) {
                    _this.loading = true;
                    _this.tempTypingData = _this.search;
                    _this._WMService.GetNewsBySearch(_this.search).subscribe(function (response) {
                        _this.loading = false;
                        if (response) {
                            response = response.filter(function (item) {
                                return (_this.displayList.find(function (item2) {
                                    return (((item._id == item2._id)));
                                })) == undefined;
                            });
                            // this.Filteredfaqs = response.FAQS;
                            // this.filterApplied = true;
                            if (response && response.length)
                                _this.displayList = _this.displayList.concat(response);
                        }
                    });
                }
            }
        }));
    }
    WmNewsComponent.prototype.Typing = function (event) {
        this.newsSearch.next();
    };
    WmNewsComponent.prototype.ScrollChanged = function (event) {
        this.scrollChanged.next(event);
    };
    WmNewsComponent.prototype.ngOnInit = function () {
        // console.log(this.scrollRef);
    };
    WmNewsComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        setTimeout(function () {
            _this.scrollChanged.next();
        }, 0);
    };
    WmNewsComponent.prototype.ngAfterViewChecked = function () {
        // console.log(this.scrollRef);
    };
    WmNewsComponent.prototype.imgSelected = function (files) {
        //console.log(files);
        if (files && files.length > 0) {
            this.image = files[0];
        }
        else {
            this.image = undefined;
        }
    };
    WmNewsComponent.prototype.bgSelected = function (files) {
        if (files && files.length > 0) {
            this.background = files[0];
        }
        else {
            this.background = undefined;
        }
    };
    WmNewsComponent.prototype.Submit = function (data) {
        var _this = this;
        this._WMService.loading.next(true);
        if (this.newsList.filter(function (obj) { return obj.title.toLowerCase() == data.title.toLowerCase(); }).length < 1 || this.update) {
            var imgObservable = this.uploadImage();
            var bgObservable = this.uploadBackground();
            forkJoin_1.forkJoin([imgObservable, bgObservable]).subscribe(function (results) {
                _this._WMService.loading.next(true);
                // console.log('Results');
                // console.log(results);
                if (_this.update && _this.currentNews) {
                    _this.currentNews.image = results[0];
                    _this.currentNews.background = results[1];
                    _this.currentNews.title = _this.newsForm.get('title').value;
                    _this.currentNews.desc = _this.newsForm.get('desc').value;
                    _this.currentNews.link = _this.newsForm.get('link').value;
                    _this._WMService.AddNews(_this.currentNews, _this.update);
                    _this.newsForm.get('image').setValidators([forms_1.Validators.required]);
                    //this.image = undefined;
                    //this.background = undefined;
                }
                else {
                    // console.log(data);
                    data.image = results[0];
                    data.background = results[1];
                    _this._WMService.AddNews(data, _this.update);
                    _this.image = undefined;
                    _this.background = undefined;
                }
                _this.ResetControls();
            }, function (err) {
                _this._WMService.loading.next(true);
            });
        }
        else {
            //console.log('news already added!');
            this._WMService.loading.next(false);
        }
    };
    WmNewsComponent.prototype.ResetControls = function () {
        this.update = false;
        this.currentNews = undefined;
        this.newsForm.reset();
    };
    WmNewsComponent.prototype.Toggle = function (newsId, check) {
        this._WMService.ToggleNews(newsId, !check);
    };
    WmNewsComponent.prototype.toggleNewsPermission = function (value) {
        this.widgetMarketingSettings.permissions.news = value;
        this._WMService.saveWMSettings(this.widgetMarketingSettings);
    };
    WmNewsComponent.prototype.setCurrentNews = function (data) {
        console.log(data);
        // delete this.currentFaq.selected
        this.currentNews = data;
        this.newsForm.get('title').setValue(data.title);
        this.newsForm.get('desc').setValue(data.desc);
        this.newsForm.get('image').setValidators(null);
        this.newsForm.get('image').updateValueAndValidity();
        this.newsForm.get('link').setValue(data.link);
        this.update = true;
    };
    WmNewsComponent.prototype.cancelUpdate = function () {
        delete this.currentNews.selected;
        this.update = false;
        this.newsForm.reset();
    };
    WmNewsComponent.prototype.Delete = function (newsId) {
        var _this = this;
        this.dialog.open(confirmation_dialog_component_1.ConfirmationDialogComponent, {
            panelClass: ['confirmation-dialog'],
            data: { headermsg: 'Are you sure you want To delete this?' }
        }).afterClosed().subscribe(function (data) {
            if (data == 'ok') {
                _this._WMService.DeleteNews(newsId);
                if (_this.currentNews) {
                    _this.currentNews = {};
                    _this.newsForm.get('title').setValue('');
                    _this.newsForm.get('desc').setValue('');
                    _this.newsForm.get('image').setValue('');
                    _this.newsForm.get('background').setValue('');
                    _this.newsForm.get('link').setValue('');
                    _this.update = false;
                }
            }
        });
    };
    WmNewsComponent.prototype.uploadImage = function () {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            if (_this.image) {
                _this._uploadingService.SignRequest(_this.image, 'knowledgebase', { params: { "folderName": "news" } }).subscribe(function (response) {
                    var params = JSON.parse(response.text());
                    params.file = _this.image;
                    _this._uploadingService.uploadAttachment(params).subscribe(function (s3response) {
                        if (s3response.status == '201') {
                            _this._uploadingService.parseXML(s3response.text()).subscribe(function (json) {
                                observer.next(json.response.PostResponse.Location[0]);
                                observer.complete();
                            }, function (err) {
                                observer.error(err);
                            });
                        }
                    }, function (err) {
                        observer.error(err);
                    });
                }, function (err) {
                    observer.error(err);
                });
            }
            else {
                observer.next(null);
                observer.complete();
            }
        });
    };
    WmNewsComponent.prototype.uploadBackground = function () {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            if (_this.background) {
                //console.log('Background Observable!');
                _this._uploadingService.SignRequest(_this.background, 'knowledgebase', { params: { "folderName": "news" } }).subscribe(function (response) {
                    var params = JSON.parse(response.text());
                    params.file = _this.background;
                    _this._uploadingService.uploadAttachment(params).subscribe(function (s3response) {
                        if (s3response.status == '201') {
                            _this._uploadingService.parseXML(s3response.text()).subscribe(function (json) {
                                observer.next(json.response.PostResponse.Location[0]);
                                observer.complete();
                            }, function (err) {
                                observer.error(err);
                            });
                        }
                    }, function (err) {
                        observer.error(err);
                    });
                }, function (err) {
                    observer.error(err);
                });
            }
            else {
                observer.next(null);
                observer.complete();
            }
        });
    };
    WmNewsComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.forEach(function (res) {
            res.unsubscribe();
        });
    };
    __decorate([
        core_1.ViewChild('scrollContainer')
    ], WmNewsComponent.prototype, "scrollContainer", void 0);
    WmNewsComponent = __decorate([
        core_1.Component({
            selector: 'app-wm-news',
            templateUrl: './wm-news.component.html',
            styleUrls: ['./wm-news.component.css'],
            providers: [
                WidgetMarketing_1.WidgetMarketingService
            ],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], WmNewsComponent);
    return WmNewsComponent;
}());
exports.WmNewsComponent = WmNewsComponent;
//# sourceMappingURL=wm-news.component.js.map