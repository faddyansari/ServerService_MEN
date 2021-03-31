"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FaqsComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var KnowledgeBase_1 = require("../../../../../services/LocalServices/KnowledgeBase");
var confirmation_dialog_component_1 = require("../../../../dialogs/confirmation-dialog/confirmation-dialog.component");
var toast_notifications_component_1 = require("../../../../dialogs/SnackBar-Dialog/toast-notifications.component");
var FaqsComponent = /** @class */ (function () {
    function FaqsComponent(formBuilder, _uploadingService, _knowledgeBaseService, snackBar, dialog, _appStateService, _authService) {
        var _this = this;
        this.formBuilder = formBuilder;
        this._uploadingService = _uploadingService;
        this._knowledgeBaseService = _knowledgeBaseService;
        this.snackBar = snackBar;
        this.dialog = dialog;
        this._appStateService = _appStateService;
        this._authService = _authService;
        this.loading = false;
        this.knowledgeBaseList = [];
        this.fetching = true;
        this.subscription = [];
        this.package = undefined;
        this.subscription.push(this._authService.getPackageInfo().subscribe(function (pkg) {
            // console.log(data);
            if (pkg) {
                _this.package = pkg.knowledgebase;
                if (!_this.package.allowed) {
                    _this._appStateService.NavigateTo('/noaccess');
                }
            }
        }));
        this._appStateService.contentInfo.next('');
        this._appStateService.breadCrumbTitle.next('Knowledge Base');
        _knowledgeBaseService.GetKnowledgeBase('faq');
        _knowledgeBaseService.knowledgeBaseList.subscribe(function (data) {
            if (data) {
                _this.knowledgeBaseList = data;
            }
        });
        _knowledgeBaseService.fetching.subscribe(function (data) {
            _this.fetching = data;
        });
        this.faqForm = formBuilder.group({
            'file': [
                null,
                [
                    forms_1.Validators.required
                ]
            ]
        });
        this.docSearchForm = formBuilder.group({
            'searchValue': ['', [],]
        });
    }
    FaqsComponent.prototype.ngOnInit = function () {
    };
    FaqsComponent.prototype.Change = function (event) {
        if (event.target.files && event.target.files.length) {
            this.file = event.target.files[0];
        }
    };
    FaqsComponent.prototype.Submit = function () {
        var _this = this;
        this.loading = true;
        if (!this.file)
            return;
        this._uploadingService.SignRequest(this.file, 'knowledgebase', { params: { "folderName": 'faqs' } }).subscribe(function (response) {
            var params = JSON.parse(response.text());
            params.file = _this.file;
            _this._uploadingService.uploadAttachment(params).subscribe(function (s3response) {
                // console.log(s3response.status);
                if (s3response.status == '201') {
                    _this._uploadingService.parseXML(s3response.text()).subscribe(function (json) {
                        //console.log(json.response.PostResponse.Location[0])
                        _this._knowledgeBaseService.AddKnowledgeBase({
                            group: '',
                            subGroup: '',
                            url: json.response.PostResponse.Location[0],
                            fileName: _this.file.name,
                            month: new Date().getMonth(),
                            year: new Date().getFullYear(),
                            type: 'faq',
                            description: '',
                            active: true
                        }).subscribe(function (response) {
                            _this.loading = false;
                            if (response.status == 'ok') {
                                _this.faqForm.reset();
                                _this.showSuccess();
                            }
                        }, function (err) {
                            _this.showError(err);
                            _this.loading = false;
                        });
                    }, function (err) {
                        _this.showError(err);
                        _this.loading = false;
                    });
                }
            }, function (err) {
                _this.loading = false;
                _this.showError(err);
            });
        }, function (err) {
            _this.loading = false;
            _this.showError(err);
            Object.keys(err.errorList).map(function (key) {
                switch (key) {
                    case 'typeError':
                        if (err.errorList[key])
                            _this.faqForm.get('file').setErrors({ 'typeError': true });
                        break;
                    case 'nameError':
                        if (err.errorList[key])
                            _this.faqForm.get('file').setErrors({ 'nameError': true });
                        break;
                    case 'requestError':
                        if (err.errorList[key])
                            _this.faqForm.get('file').setErrors({ 'requestError': true });
                        break;
                    case 'folderError':
                        if (err.errorList[key])
                            _this.faqForm.get('file').setErrors({ 'folderError': true });
                        break;
                }
            });
        });
    };
    FaqsComponent.prototype.Remove = function (filename) {
        var _this = this;
        this.dialog.open(confirmation_dialog_component_1.ConfirmationDialogComponent, {
            panelClass: ['confirmation-dialog'],
            data: { headermsg: 'Are you sure you want To delete this file?' }
        }).afterClosed().subscribe(function (data) {
            if (data == 'ok') {
                _this._knowledgeBaseService.RemoveKnowledgeBase('faq', filename);
            }
        });
    };
    FaqsComponent.prototype.ToggleActivate = function (filename, active) {
        console.log(filename);
        this._knowledgeBaseService.ToggleActivate('faq', filename, active);
    };
    FaqsComponent.prototype.showError = function (err) {
        this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
            data: {
                img: 'warning',
                msg: err
            },
            duration: 3000,
            panelClass: ['user-alert', 'error']
        });
    };
    FaqsComponent.prototype.showSuccess = function () {
        this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
            data: {
                img: 'ok',
                msg: 'File uploaded successfully!'
            },
            duration: 3000,
            panelClass: ['user-alert', 'success']
        });
    };
    FaqsComponent.prototype.ngOnDestroy = function () {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this._knowledgeBaseService.Destroy();
    };
    FaqsComponent = __decorate([
        core_1.Component({
            selector: 'app-faqs',
            templateUrl: './faqs.component.html',
            styleUrls: ['./faqs.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None,
            providers: [
                KnowledgeBase_1.KnowledgeBaseService
            ]
        })
    ], FaqsComponent);
    return FaqsComponent;
}());
exports.FaqsComponent = FaqsComponent;
//# sourceMappingURL=faqs.component.js.map