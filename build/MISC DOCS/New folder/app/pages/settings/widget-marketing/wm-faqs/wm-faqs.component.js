"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WmFaqsComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var WidgetMarketing_1 = require("../../../../../services/LocalServices/WidgetMarketing");
var confirmation_dialog_component_1 = require("../../../../dialogs/confirmation-dialog/confirmation-dialog.component");
var Subject_1 = require("rxjs/Subject");
var debounceTime_1 = require("rxjs/operators/debounceTime");
var WmFaqsComponent = /** @class */ (function () {
    function WmFaqsComponent(formBuilder, _WMService, snackBar, dialog, _appStateService) {
        var _this = this;
        this.formBuilder = formBuilder;
        this._WMService = _WMService;
        this.snackBar = snackBar;
        this.dialog = dialog;
        this._appStateService = _appStateService;
        this.scrollChanged = new Subject_1.Subject();
        this.subscriptions = [];
        this.faqList = [];
        this.cubeLoading = false;
        this.loading = false;
        this.faqsSearch = new Subject_1.Subject();
        this.currentFaq = undefined;
        this.update = false;
        //Scrolling
        this.scrollHeight = 0;
        this.scrollTop = 10;
        this.fetchedMore = false;
        this.search = '';
        this.tempTypingData = '';
        this.config = {
            placeholder: 'Answer..',
            toolbar: [
                ['style', ['italic', 'underline']],
                ['fontsize', ['fontsize']],
                ['color', ['color']],
                ['fontName', ['fontName']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['height', ['400']],
                ['view', ['codeview', 'undo', 'redo']]
                // ['style', ['bold', 'italic', 'underline', 'strikethrough', 'clear']],
                // ['fontsize', ['fontsize']],
                // ['color', ['color']],
                // ['para', ['ul', 'ol', 'paragraph', 'height']],
            ]
        };
        this._appStateService.contentInfo.next('');
        this._appStateService.breadCrumbTitle.next('Widget Marketing');
        _WMService.GetFaqs();
        this.faqForm = formBuilder.group({
            'question': [
                null,
                [
                    forms_1.Validators.required
                ]
            ],
            'answer': [
                null,
                [
                    forms_1.Validators.required
                ]
            ]
        });
        this.faqSearchForm = formBuilder.group({
            'searchValue': ['', [],]
        });
        this.subscriptions.push(_WMService.faqList.subscribe(function (data) {
            _this.faqList = data;
            _this.displayList = data;
        }));
        this.subscriptions.push(_WMService.cubeLoading.subscribe(function (data) {
            _this.cubeLoading = data;
        }));
        this.subscriptions.push(_WMService.widgetMarketingSettings.subscribe(function (data) {
            if (data) {
                _this.widgetMarketingSettings = data;
            }
        }));
        this.subscriptions.push(this.scrollChanged.debounceTime(200).subscribe(function (event) {
            if (event) {
                _this.scrollTop = _this.scrollContainer.nativeElement.scrollTop;
                // raw.scrollTop + raw.offsetHeight > raw.scrollHeight
                if (Math.round(event.target.scrollTop + event.target.clientHeight) >= (_this.scrollContainer.nativeElement.scrollHeight - 10)) {
                    _this.fetchedMore = true;
                    if (!_this.faqList.ended) {
                        console.log('fetch more');
                        _this._WMService.cubeLoading.next(true);
                        _this._WMService.GetMoreFaqs(_this.faqList[_this.faqList.length - 1]._id);
                    }
                }
                _this.scrollHeight = _this.scrollContainer.nativeElement.scrollHeight;
            }
        }));
        this.subscriptions.push(this.faqsSearch.pipe(debounceTime_1.debounceTime(750)).subscribe(function (data) {
            if (!_this.search) {
                _this.displayList = _this.faqList;
                _this.tempTypingData = '';
                return;
            }
            if (_this.search) {
                if (_this.tempTypingData != _this.search) {
                    _this.loading = true;
                    _this.tempTypingData = _this.search;
                    _this._WMService.GetFaqsBySearch(_this.search).subscribe(function (response) {
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
    WmFaqsComponent.prototype.Typing = function (event) {
        this.faqsSearch.next();
    };
    WmFaqsComponent.prototype.ngOnInit = function () {
    };
    WmFaqsComponent.prototype.ScrollChanged = function (event) {
        this.scrollChanged.next(event);
    };
    WmFaqsComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        setTimeout(function () {
            _this.scrollChanged.next();
        }, 0);
    };
    WmFaqsComponent.prototype.Submit = function (data) {
        if (this.update && this.currentFaq) {
            this.currentFaq.question = this.faqForm.get('question').value;
            this.currentFaq.answer = this.faqForm.get('answer').value;
            this._WMService.AddFaq(this.currentFaq, this.update);
        }
        else {
            this._WMService.AddFaq(data, this.update);
        }
        this.update = false;
        this.currentFaq = undefined;
        this.faqForm.reset();
    };
    WmFaqsComponent.prototype.toggleFaqPermission = function (value) {
        this.widgetMarketingSettings.permissions.faqs = value;
        this._WMService.saveWMSettings(this.widgetMarketingSettings);
    };
    WmFaqsComponent.prototype.cancelUpdate = function () {
        delete this.currentFaq.selected;
        this.update = false;
        this.faqForm.reset();
    };
    WmFaqsComponent.prototype.Delete = function (fId) {
        var _this = this;
        this.dialog.open(confirmation_dialog_component_1.ConfirmationDialogComponent, {
            panelClass: ['confirmation-dialog'],
            data: { headermsg: 'Are you sure you want To delete this?' }
        }).afterClosed().subscribe(function (data) {
            if (data == 'ok') {
                _this._WMService.DeleteFaq(fId);
                if (_this.currentFaq) {
                    _this.currentFaq = {};
                    _this.faqForm.get('question').setValue('');
                    _this.faqForm.get('answer').setValue('');
                    _this.update = false;
                }
            }
        });
    };
    WmFaqsComponent.prototype.setCurrentFaq = function (data) {
        // delete this.currentFaq.selected
        this.currentFaq = data;
        this.faqForm.get('question').setValue(data.question);
        this.faqForm.get('answer').setValue(data.answer);
        this.update = true;
    };
    WmFaqsComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.forEach(function (res) {
            res.unsubscribe();
        });
    };
    __decorate([
        core_1.ViewChild('scrollContainer')
    ], WmFaqsComponent.prototype, "scrollContainer", void 0);
    WmFaqsComponent = __decorate([
        core_1.Component({
            selector: 'app-wm-faqs',
            templateUrl: './wm-faqs.component.html',
            styleUrls: ['./wm-faqs.component.scss'],
            providers: [
                WidgetMarketing_1.WidgetMarketingService
            ],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], WmFaqsComponent);
    return WmFaqsComponent;
}());
exports.WmFaqsComponent = WmFaqsComponent;
//# sourceMappingURL=wm-faqs.component.js.map