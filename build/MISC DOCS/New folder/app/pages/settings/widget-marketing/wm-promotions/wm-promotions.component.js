"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WmPromotionsComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var WidgetMarketing_1 = require("../../../../../services/LocalServices/WidgetMarketing");
var Observable_1 = require("rxjs/Observable");
var forkJoin_1 = require("rxjs/observable/forkJoin");
var confirmation_dialog_component_1 = require("../../../../dialogs/confirmation-dialog/confirmation-dialog.component");
var Subject_1 = require("rxjs/Subject");
var debounceTime_1 = require("rxjs/operators/debounceTime");
var WmPromotionsComponent = /** @class */ (function () {
    function WmPromotionsComponent(formBuilder, _WMService, _uploadingService, snackBar, dialog, _appStateService) {
        var _this = this;
        this.formBuilder = formBuilder;
        this._WMService = _WMService;
        this._uploadingService = _uploadingService;
        this.snackBar = snackBar;
        this.dialog = dialog;
        this._appStateService = _appStateService;
        this.scrollChanged = new Subject_1.Subject();
        this.currentPromtion = undefined;
        this.update = false;
        this.subscriptions = [];
        this.promList = [];
        this.loading = false;
        this.cubeLoading = false;
        this.imgAttachment = false;
        this.bgAttachment = false;
        this.currencyList = [];
        this.search = '';
        this.tempTypingData = '';
        //Scrolling
        this.scrollHeight = 0;
        this.scrollTop = 10;
        this.fetchedMore = false;
        //private apiUrl = 'https://openexchangerates.org/api/currencies.json';
        this.promotionsSearch = new Subject_1.Subject();
        this._appStateService.contentInfo.next('');
        this._appStateService.breadCrumbTitle.next('Widget Marketing');
        _WMService.GetPromotions();
        this.currencyList = [
            "AED",
            "AFN",
            "ALL",
            "AMD",
            "ANG",
            "AOA",
            "ARS",
            "AUD",
            "AWG",
            "AZN",
            "BAM",
            "BBD",
            "BDT",
            "BGN",
            "BHD",
            "BIF",
            "BMD",
            "BND",
            "BOB",
            "BRL",
            "BSD",
            "BTC",
            "BTN",
            "BWP",
            "BYN",
            "BZD",
            "CAD",
            "CDF",
            "CHF",
            "CLF",
            "CLP",
            "CNH",
            "CNY",
            "COP",
            "CRC",
            "CUC",
            "CUP",
            "CVE",
            "CZK",
            "DJF",
            "DKK",
            "DOP",
            "DZD",
            "EGP",
            "ERN",
            "ETB",
            "EUR",
            "FJD",
            "FKP",
            "GBP",
            "GEL",
            "GGP",
            "GHS",
            "GIP",
            "GMD",
            "GNF",
            "GTQ",
            "GYD",
            "HKD",
            "HNL",
            "HRK",
            "HTG",
            "HUF",
            "IDR",
            "ILS",
            "IMP",
            "INR",
            "IQD",
            "IRR",
            "ISK",
            "JEP",
            "JMD",
            "JOD",
            "JPY",
            "KES",
            "KGS",
            "KHR",
            "KMF",
            "KPW",
            "KRW",
            "KWD",
            "KYD",
            "KZT",
            "LAK",
            "LBP",
            "LKR",
            "LRD",
            "LSL",
            "LYD",
            "MAD",
            "MDL",
            "MGA",
            "MKD",
            "MMK",
            "MNT",
            "MOP",
            "MRO",
            "MRU",
            "MUR",
            "MVR",
            "MWK",
            "MXN",
            "MYR",
            "MZN",
            "NAD",
            "NGN",
            "NIO",
            "NOK",
            "NPR",
            "NZD",
            "OMR",
            "PAB",
            "PEN",
            "PGK",
            "PHP",
            "PKR",
            "PLN",
            "PYG",
            "QAR",
            "RON",
            "RSD",
            "RUB",
            "RWF",
            "SAR",
            "SBD",
            "SCR",
            "SDG",
            "SEK",
            "SGD",
            "SHP",
            "SLL",
            "SOS",
            "SRD",
            "SSP",
            "STD",
            "STN",
            "SVC",
            "SYP",
            "SZL",
            "THB",
            "TJS",
            "TMT",
            "TND",
            "TOP",
            "TRY",
            "TTD",
            "TWD",
            "TZS",
            "UAH",
            "UGX",
            "USD",
            "UYU",
            "UZS",
            "VEF",
            "VES",
            "VND",
            "VUV",
            "WST",
            "XAF",
            "XAG",
            "XAU",
            "XCD",
            "XDR",
            "XOF",
            "XPD",
            "XPF",
            "XPT",
            "YER",
            "ZAR",
            "ZMW",
            "ZWL",
        ];
        this.promotionForm = formBuilder.group({
            'title': [
                null,
                []
            ],
            'desc': [
                null,
                []
            ],
            'link': [
                null,
                []
            ],
            'type': [
                'banner',
                [forms_1.Validators.required]
            ],
            'image': [
                null,
                [forms_1.Validators.required]
            ],
            'price': [
                null,
                []
            ],
            'currency': [
                'USD',
                []
            ],
            'background': [
                null,
                []
            ]
        });
        this.promSearchForm = formBuilder.group({
            'searchValue': ['', []]
        });
        this.subscriptions.push(_WMService.promotionsList.subscribe(function (data) {
            //console.log(data);
            _this.promList = data;
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
                    if (!_this.promList.ended) {
                        if (_this.promList.length) {
                            _this._WMService.cubeLoading.next(true);
                            _this._WMService.GetMorePromotions((_this.promList && _this.promList.length) ? _this.promList[_this.promList.length - 1]._id : []);
                        }
                    }
                }
                _this.scrollHeight = _this.scrollContainer.nativeElement.scrollHeight;
            }
        }));
        this.subscriptions.push(this.promotionsSearch.pipe(debounceTime_1.debounceTime(750)).subscribe(function (data) {
            if (!_this.search) {
                _this.displayList = _this.promList;
                _this.tempTypingData = '';
                return;
            }
            if (_this.search) {
                if (_this.tempTypingData != _this.search) {
                    _this.loading = true;
                    _this.tempTypingData = _this.search;
                    _this._WMService.GetPromotionsBySearch(_this.search).subscribe(function (response) {
                        //console.log(response)
                        _this.loading = false;
                        if (response) {
                            response = response.filter(function (item) {
                                return (_this.displayList.find(function (item2) {
                                    return (((item._id == item2._id)));
                                })) == undefined;
                            });
                            if (response && response.length)
                                _this.displayList = _this.displayList.concat(response);
                        }
                    });
                }
            }
        }));
    }
    WmPromotionsComponent.prototype.ScrollChanged = function (event) {
        this.scrollChanged.next(event);
    };
    WmPromotionsComponent.prototype.ngOnInit = function () {
    };
    WmPromotionsComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        setTimeout(function () {
            _this.scrollChanged.next();
        }, 0);
    };
    WmPromotionsComponent.prototype.Typing = function (event) {
        this.promotionsSearch.next();
    };
    WmPromotionsComponent.prototype.imgSelected = function (files) {
        if (files && files.length > 0) {
            this.image = files[0];
            this.imgAttachment = true;
        }
        else {
            this.image = undefined;
            this.imgAttachment = false;
        }
    };
    WmPromotionsComponent.prototype.bgSelected = function (files) {
        if (files && files.length > 0) {
            this.background = files[0];
            this.bgAttachment = true;
        }
        else {
            this.background = undefined;
            this.bgAttachment = false;
        }
    };
    WmPromotionsComponent.prototype.TypeChange = function (type) {
        switch (type) {
            case 'banner':
                this.promotionForm = this.formBuilder.group({
                    'title': [
                        null,
                        []
                    ],
                    'desc': [
                        null,
                        []
                    ],
                    'link': [
                        null,
                        []
                    ],
                    'type': [
                        'banner',
                        [forms_1.Validators.required]
                    ],
                    'image': [
                        null,
                        [forms_1.Validators.required]
                    ],
                    'price': [
                        null,
                        []
                    ],
                    'currency': [
                        'USD',
                        []
                    ],
                    'background': [
                        null,
                        []
                    ]
                });
                break;
            case 'post':
                this.promotionForm = this.formBuilder.group({
                    'title': [
                        null,
                        [forms_1.Validators.required]
                    ],
                    'desc': [
                        null,
                        [forms_1.Validators.required]
                    ],
                    'link': [
                        null,
                        []
                    ],
                    'type': [
                        'post',
                        [forms_1.Validators.required]
                    ],
                    'image': [
                        null,
                        [forms_1.Validators.required]
                    ],
                    'price': [
                        null,
                        []
                    ],
                    'currency': [
                        'USD',
                        []
                    ],
                    'background': [
                        null,
                        []
                    ]
                });
                break;
            case 'product':
                this.promotionForm = this.formBuilder.group({
                    'title': [
                        null,
                        [forms_1.Validators.required]
                    ],
                    'desc': [
                        null,
                        []
                    ],
                    'link': [
                        null,
                        [forms_1.Validators.required]
                    ],
                    'type': [
                        'product',
                        [forms_1.Validators.required]
                    ],
                    'image': [
                        null,
                        [forms_1.Validators.required]
                    ],
                    'price': [
                        null,
                        [forms_1.Validators.required]
                    ],
                    'currency': [
                        'USD',
                        [forms_1.Validators.required]
                    ],
                    'background': [
                        null,
                        []
                    ]
                });
                break;
        }
    };
    WmPromotionsComponent.prototype.Submit = function (data) {
        var _this = this;
        this.loading = true;
        //	console.log(data);
        //	console.log(this.promList);
        if (this.promList.filter(function (obj) { return (obj.title.toLowerCase() == data.title.toLowerCase()); }).length < 1 || this.update) {
            var imgObservable = this.uploadImage();
            var bgObservable = this.uploadBackground();
            forkJoin_1.forkJoin([imgObservable, bgObservable]).subscribe(function (results) {
                if (_this.update && _this.currentPromtion) {
                    //this.currentPromtion.image = results[0];
                    //this.currentPromtion.background = results[1];
                    _this.currentPromtion.title = _this.promotionForm.get('title').value;
                    _this.currentPromtion.desc = _this.promotionForm.get('desc').value;
                    _this.currentPromtion.price = _this.promotionForm.get('price').value;
                    _this.currentPromtion.currency = _this.promotionForm.get('currency').value;
                    _this.currentPromtion.link = _this.promotionForm.get('link').value;
                    //  this.currentPromtion.count=0 
                    _this._WMService.AddPromotion(_this.currentPromtion, _this.update);
                    _this.promotionForm.get('image').setValidators([forms_1.Validators.required]);
                    //	this.promotionForm.get('type').setValue(this.currentPromtion.type);
                    //this.image = undefined;
                    //this.background = undefined;
                }
                else {
                    //	console.log('Results');
                    //console.log(results);
                    data.image = results[0];
                    data.background = results[1];
                    data.count = 0;
                    _this._WMService.AddPromotion(data, _this.update);
                    _this.image = undefined;
                    _this.background = undefined;
                    _this.promotionForm.get('type').setValue(data.type);
                }
                _this.update = false;
                _this.currentPromtion = undefined;
                _this.promotionForm.reset();
                _this.promotionForm.get('type').setValue('banner');
            }, function (err) {
                _this._WMService.loading.next(true);
            });
        }
        else {
            console.log('promotions already added!');
            this._WMService.loading.next(false);
        }
    };
    WmPromotionsComponent.prototype.Toggle = function (pId, check) {
        this._WMService.TogglePromotion(pId, !check);
    };
    WmPromotionsComponent.prototype.togglePromotionPermission = function (value) {
        this.widgetMarketingSettings.permissions.promotions = value;
        this._WMService.saveWMSettings(this.widgetMarketingSettings);
        // this._WMService.widgetMarketingSettings.next(this.widgetMarketingSettings)
    };
    WmPromotionsComponent.prototype.Delete = function (pId) {
        var _this = this;
        this.dialog.open(confirmation_dialog_component_1.ConfirmationDialogComponent, {
            panelClass: ['confirmation-dialog'],
            data: { headermsg: 'Are you sure you want To delete this?' }
        }).afterClosed().subscribe(function (data) {
            if (data == 'ok') {
                _this._WMService.DeletePromotion(pId);
                if (_this.currentPromtion) {
                    _this.currentPromtion = {};
                    _this.currentPromtion.get('title').setValue('');
                    _this.currentPromtion.get('desc').setValue('');
                    _this.currentPromtion.get('currency').setValue('');
                    _this.currentPromtion.get('price').setValue('');
                    _this.currentPromtion.get('image').setValue('');
                    _this.currentPromtion.get('background').setValue('');
                    _this.currentPromtion.get('link').setValue('');
                    _this.update = false;
                }
            }
        });
    };
    WmPromotionsComponent.prototype.setCurrentPromtions = function (data) {
        //	console.log(data)
        // delete this.currentFaq.selected
        this.currentPromtion = data;
        data.count = 0;
        //if(this.promList.filter(obj=>data.type=='promotion'))
        this.promotionForm.get('title').setValue(data.title);
        this.promotionForm.get('desc').setValue(data.desc);
        this.promotionForm.get('currency').setValue(data.currency);
        this.promotionForm.get('price').setValue(data.price);
        this.promotionForm.get('image').setValidators(null);
        this.promotionForm.get('image').updateValueAndValidity();
        this.promotionForm.get('link').setValue(data.link);
        this.update = true;
    };
    WmPromotionsComponent.prototype.cancelUpdate = function () {
        delete this.currentPromtion.selected;
        this.update = false;
        this.promotionForm.reset();
    };
    WmPromotionsComponent.prototype.uploadImage = function () {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            if (_this.image) {
                _this._uploadingService.SignRequest(_this.image, 'knowledgebase', { params: { "folderName": _this.promotionForm.get('type').value } }).subscribe(function (response) {
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
    WmPromotionsComponent.prototype.uploadBackground = function () {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            if (_this.background) {
                //console.log('Background Observable!');
                _this._uploadingService.SignRequest(_this.background, 'knowledgebase', { params: { "folderName": _this.promotionForm.get('type').value } }).subscribe(function (response) {
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
    WmPromotionsComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.forEach(function (res) {
            res.unsubscribe();
        });
    };
    __decorate([
        core_1.ViewChild('scrollContainer')
    ], WmPromotionsComponent.prototype, "scrollContainer", void 0);
    WmPromotionsComponent = __decorate([
        core_1.Component({
            selector: 'app-wm-promotions',
            templateUrl: './wm-promotions.component.html',
            styleUrls: ['./wm-promotions.component.css'],
            providers: [
                WidgetMarketing_1.WidgetMarketingService
            ],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], WmPromotionsComponent);
    return WmPromotionsComponent;
}());
exports.WmPromotionsComponent = WmPromotionsComponent;
//# sourceMappingURL=wm-promotions.component.js.map