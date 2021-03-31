"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocunmentsComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var KnowledgeBase_1 = require("../../../../../services/LocalServices/KnowledgeBase");
var confirmation_dialog_component_1 = require("../../../../dialogs/confirmation-dialog/confirmation-dialog.component");
var toast_notifications_component_1 = require("../../../../dialogs/SnackBar-Dialog/toast-notifications.component");
var DocunmentsComponent = /** @class */ (function () {
    function DocunmentsComponent(formBuilder, _uploadingService, _knowledgeBaseService, snackBar, dialog, _appStateService, _authService) {
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
        this.docType = '';
        this.fetching = true;
        this.subscription = [];
        this.package = undefined;
        this.months = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec'
        ];
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
        _knowledgeBaseService.GetKnowledgeBase('documents');
        _knowledgeBaseService.knowledgeBaseList.subscribe(function (data) {
            if (data) {
                _this.knowledgeBaseList = data;
            }
        });
        _knowledgeBaseService.fetching.subscribe(function (data) {
            _this.fetching = data;
        });
        this.documentForm = formBuilder.group({
            'file': [
                null,
                [
                    forms_1.Validators.required,
                ]
            ],
            'type': [
                null,
                [
                    forms_1.Validators.required
                ]
            ],
            'title': [
                null,
                [
                    forms_1.Validators.required,
                    forms_1.Validators.maxLength(50)
                ]
            ],
            'description': [
                null
            ]
        });
        this.docSearchForm = formBuilder.group({
            'searchValue': ['', [],]
        });
    }
    DocunmentsComponent.prototype.Change = function (event) {
        if (event.target.files && event.target.files.length) {
            this.file = event.target.files[0];
        }
    };
    DocunmentsComponent.prototype.ngOnInit = function () { };
    DocunmentsComponent.prototype.Submit = function () {
        var _this = this;
        this.loading = true;
        if (!this.file)
            return;
        this._uploadingService.SignRequest(this.file, 'knowledgebase', {
            params: {
                "folderName": this.documentForm.get('type').value
            }
        }).subscribe(function (response) {
            var params = JSON.parse(response.text());
            params.file = _this.file;
            _this._uploadingService.uploadAttachment(params).subscribe(function (s3response) {
                // console.log(s3response.status);
                if (s3response.status == '201') {
                    console.log(s3response.text());
                    _this._uploadingService.parseXML(s3response.text()).subscribe(function (json) {
                        var url = json.response.PostResponse.Location[0];
                        if (_this.documentForm.get('type').value == 'news') {
                            url = 'https://app.beelinks.solutions/' + params.key;
                        }
                        _this._knowledgeBaseService.AddKnowledgeBase({
                            group: '',
                            subGroup: '',
                            url: url,
                            fileName: _this.documentForm.get('title').value,
                            month: _this.months[new Date().getMonth()],
                            year: new Date().getFullYear(),
                            type: _this.documentForm.get('type').value,
                            description: _this.documentForm.get('description').value,
                            active: true
                        }).subscribe(function (response) {
                            _this.loading = false;
                            if (response.status == 'ok') {
                                _this.documentForm.reset();
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
                            _this.documentForm.get('file').setErrors({
                                'typeError': true
                            });
                        break;
                    case 'nameError':
                        if (err.errorList[key])
                            _this.documentForm.get('file').setErrors({
                                'nameError': true
                            });
                        break;
                    case 'requestError':
                        if (err.errorList[key])
                            _this.documentForm.get('file').setErrors({
                                'requestError': true
                            });
                        break;
                    case 'folderError':
                        if (err.errorList[key])
                            _this.documentForm.get('file').setErrors({
                                'folderError': true
                            });
                        break;
                }
            });
        });
    };
    DocunmentsComponent.prototype.typeChanged = function (value) {
        this.docType = value;
    };
    DocunmentsComponent.prototype.filterBy = function (value) {
        if (value) {
            return this.knowledgeBaseList.filter(function (data) { return data.type == value; });
        }
        else {
            return this.knowledgeBaseList;
        }
    };
    DocunmentsComponent.prototype.Remove = function (type, filename) {
        var _this = this;
        this.dialog.open(confirmation_dialog_component_1.ConfirmationDialogComponent, {
            panelClass: ['confirmation-dialog'],
            data: {
                headermsg: 'Are you sure you want To delete this file?'
            }
        }).afterClosed().subscribe(function (data) {
            if (data == 'ok') {
                _this._knowledgeBaseService.RemoveKnowledgeBase(type, filename);
            }
        });
    };
    DocunmentsComponent.prototype.ToggleActivate = function (type, filename, active) {
        console.log(filename);
        this._knowledgeBaseService.ToggleActivate(type, filename, active);
    };
    DocunmentsComponent.prototype.showError = function (err) {
        this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
            data: {
                img: 'warning',
                msg: err
            },
            duration: 3000,
            panelClass: ['user-alert', 'error']
        });
    };
    DocunmentsComponent.prototype.showSuccess = function () {
        this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
            data: {
                img: 'ok',
                msg: 'File uploaded successfully!'
            },
            duration: 3000,
            panelClass: ['user-alert', 'success']
        });
    };
    DocunmentsComponent.prototype.ngOnDestroy = function () {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this._knowledgeBaseService.Destroy();
    };
    DocunmentsComponent = __decorate([
        core_1.Component({
            selector: 'app-docunments',
            templateUrl: './docunments.component.html',
            styleUrls: ['./docunments.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None,
            providers: [
                KnowledgeBase_1.KnowledgeBaseService
            ]
        })
    ], DocunmentsComponent);
    return DocunmentsComponent;
}());
exports.DocunmentsComponent = DocunmentsComponent;
//# sourceMappingURL=docunments.component.js.map