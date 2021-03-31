"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutomatedResponsesComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var toast_notifications_component_1 = require("../../../dialogs/SnackBar-Dialog/toast-notifications.component");
var confirmation_dialog_component_1 = require("../../../dialogs/confirmation-dialog/confirmation-dialog.component");
var AutomatedResponsesComponent = /** @class */ (function () {
    function AutomatedResponsesComponent(formbuilder, _socketService, _authService, _validationService, snackBar, dialog, _appStateService) {
        var _this = this;
        this.formbuilder = formbuilder;
        this._socketService = _socketService;
        this._authService = _authService;
        this._validationService = _validationService;
        this.snackBar = snackBar;
        this.dialog = dialog;
        this._appStateService = _appStateService;
        this.responseTag = '';
        this.responseText = '';
        this.automatedMessagesList = [];
        this.subscriptions = [];
        this.editingMessagesMap = {};
        this.loading = false;
        this.emptyResponse = false;
        this.showResponseForm = false;
        this.editedHash = '';
        this.working = false;
        this.package = {};
        this._appStateService.contentInfo.next('');
        this._appStateService.breadCrumbTitle.next('General Settings');
        this.subscriptions.push(_socketService.getSocket().subscribe(function (socket) {
            _this.socket = socket;
        }));
        this.subscriptions.push(_authService.getSettings().subscribe(function (data) {
            if (data.automatedMessages && data.automatedMessages.length) {
                _this.automatedMessagesList = data.automatedMessages;
                data.automatedMessages.map(function (automatedMessage) {
                    if (_this.editingMessagesMap[automatedMessage.hashTag] == undefined) {
                        _this.editingMessagesMap[automatedMessage.hashTag] = {};
                    }
                    if (!_this.editingMessagesMap[automatedMessage.hashTag].selected) {
                        _this.editingMessagesMap[automatedMessage.hashTag].selected = false;
                        _this.editingMessagesMap[automatedMessage.hashTag].responseText = automatedMessage.responseText;
                        _this.editedHash = automatedMessage.hashTag;
                    }
                });
            }
            else {
                _this.automatedMessagesList = [];
            }
        }));
        this.subscriptions.push(_authService.getRequestState().subscribe(function (requestState) {
            _this.loading = requestState;
        }));
        this.automatedResForm = formbuilder.group({
            'responseText': [''],
            'hashTag': [
                null,
                [
                    forms_1.Validators.required,
                    forms_1.Validators.pattern(/^[ \t]*#(\w*[0-9a-zA-Z ]+)[ \t]*$/)
                ],
                this._validationService.CheckTag.bind(this)
            ]
        });
        this.subscriptions.push(_authService.getPackageInfo().subscribe(function (pkg) {
            // console.log(data);
            if (pkg) {
                _this.package = pkg;
                if (!_this.package.chats.cannedMessage.allowed) {
                    _this._appStateService.NavigateTo('/noaccess');
                }
            }
        }));
    }
    AutomatedResponsesComponent.prototype.ngOnInit = function () {
    };
    AutomatedResponsesComponent.prototype.ngOnDestroy = function () {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
        this._appStateService.breadCrumbTitle.next('');
    };
    AutomatedResponsesComponent.prototype.TypingEvent = function ($event) {
        this.emptyResponse = false;
        this.duplicateHash = false;
    };
    AutomatedResponsesComponent.prototype.AddAutomatedResponse = function () {
        var _this = this;
        if (this.package && this.package.chats.cannedMessage.quota <= this.automatedMessagesList.length) {
            this.limitReached = true;
            return;
        }
        if (!this.automatedResForm.get('responseText').value) {
            this.emptyResponse = true;
            return;
        }
        if (this.editingMessagesMap[this.automatedResForm.get('hashTag').value]) {
            this.duplicateHash = true;
            return;
        }
        else
            this.duplicateHash = false;
        if (this.automatedResForm.valid) {
            this._authService.setRequestState(true);
            this.socket.emit('addAutomatedResponse', {
                hashTag: this.automatedResForm.get('hashTag').value,
                responseText: this.automatedResForm.get('responseText').value
            }, function (response) {
                if (response.status == 'ok') {
                    _this._authService.setRequestState(false);
                    _this._authService.updateAutomatedMessages(_this.automatedResForm.get('hashTag').value, _this.automatedResForm.get('responseText').value);
                    _this.automatedResForm.reset();
                    _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                        data: { img: 'ok', msg: 'Automated Message Added Successfully' },
                        duration: 3000,
                        panelClass: ['user-alert', 'success']
                    });
                }
            });
        }
        this.showResponseForm = false;
    };
    //Befor Edit ButtonEvents
    AutomatedResponsesComponent.prototype.OpenEdit = function (event, hashTag) {
        event.preventDefault();
        this.editedHash = hashTag;
        this.editingMessagesMap[hashTag].selected = true;
    };
    AutomatedResponsesComponent.prototype.DeleteAutomatedMessage = function (event, hashTag) {
        var _this = this;
        event.preventDefault();
        this.editingMessagesMap[hashTag].selected = false;
        this.editedHash = '';
        this.dialog.open(confirmation_dialog_component_1.ConfirmationDialogComponent, {
            panelClass: ['confirmation-dialog'],
            data: { headermsg: 'Are You Sure You Want To Delete Automated Message' }
        }).afterClosed().subscribe(function (data) {
            if (data == 'ok') {
                _this._authService.setRequestState(true);
                _this.socket.emit('deleteAutomatedResponse', {
                    hashTag: hashTag
                }, function (response) {
                    if (response.status == 'ok') {
                        _this._authService.DeleteAutomatedMessage(response.hashTag);
                        _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                            data: { img: 'ok', msg: 'Automated Message Deleted Successfully' },
                            duration: 3000,
                            panelClass: ['user-alert', 'success']
                        });
                    }
                    _this._authService.setRequestState(false);
                });
            }
        });
    };
    AutomatedResponsesComponent.prototype.toggleResponseForm = function () {
        this.showResponseForm = !this.showResponseForm;
    };
    //After Edit Button Events
    AutomatedResponsesComponent.prototype.Edit = function (event, hashTag) {
        var _this = this;
        event.preventDefault();
        this.editingMessagesMap[hashTag].error = false;
        if (!this.editingMessagesMap[hashTag].responseText) {
            this.editingMessagesMap[hashTag].error = true;
            return;
        }
        ;
        this.socket.emit('editAutomatedResponse', {
            hashTag: (this.editedHash) ? this.editedHash : (hashTag) ? hashTag : '',
            responseText: this.editingMessagesMap[hashTag].responseText
        }, function (response) {
            if (response.status == 'ok') {
                if (_this.editedHash != hashTag) {
                    _this.editingMessagesMap[hashTag] = _this.editingMessagesMap[_this.editedHash];
                    delete _this.editingMessagesMap[hashTag];
                }
                _this._authService.EditupdateAutomatedMessages(response.hashTag, _this.editingMessagesMap[response.hashTag].responseText);
                _this.editingMessagesMap[hashTag].selected = false;
                _this.editedHash = '';
                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: { img: 'ok', msg: 'Automated Message Edited Successfully' },
                    duration: 3000,
                    panelClass: ['user-alert', 'success']
                });
            }
        });
    };
    AutomatedResponsesComponent.prototype.CancelEdit = function (event, hashTag, previousResponseText) {
        event.preventDefault();
        this.editingMessagesMap[hashTag].selected = false;
        this.editingMessagesMap[hashTag].responseText = previousResponseText;
        this.editedHash = '';
    };
    AutomatedResponsesComponent = __decorate([
        core_1.Component({
            selector: 'app-automated-responses',
            templateUrl: './automated-responses.component.html',
            styleUrls: ['./automated-responses.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], AutomatedResponsesComponent);
    return AutomatedResponsesComponent;
}());
exports.AutomatedResponsesComponent = AutomatedResponsesComponent;
//# sourceMappingURL=automated-responses.component.js.map