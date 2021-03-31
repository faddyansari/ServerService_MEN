"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var toast_notifications_component_1 = require("../../../../dialogs/SnackBar-Dialog/toast-notifications.component");
var NotificationsComponent = /** @class */ (function () {
    function NotificationsComponent(_appStateService, formbuilder, snackBar, _adminSettingService, _agentService) {
        var _this = this;
        this._appStateService = _appStateService;
        this.formbuilder = formbuilder;
        this.snackBar = snackBar;
        this._adminSettingService = _adminSettingService;
        this._agentService = _agentService;
        this.subscriptions = [];
        this.changes = {
            email: false,
            window: false
        };
        this.loading = false;
        _adminSettingService.GetEmailNotificationSettings();
        // _agentService.GetWindowNotificationSettings();
        this._appStateService.contentInfo.next('');
        this._appStateService.breadCrumbTitle.next('Ticket Management');
        this.emailNotificationForm = formbuilder.group({});
        this.subscriptions.push(_adminSettingService.emailNotificationSettings.subscribe(function (settings) {
            if (settings) {
                _this.emailNotificationSettings = settings.tickets;
                _this.updateEmailSettings(_this.emailNotificationSettings);
            }
        }));
        // this.subscriptions.push(_adminSettingService.windowNotificationSettings.subscribe(settings => {
        // 	if(settings){
        // 		this.windowNotificationSettings = settings;
        // 		this.updateWindowNotifSettings(this.windowNotificationSettings);
        // 	}
        // }));
    }
    NotificationsComponent.prototype.updateEmailSettings = function (settings) {
        var _this = this;
        // console.log(settings);
        this.emailNotificationForm = this.formbuilder.group({});
        Object.keys(settings).map(function (key) {
            _this.emailNotificationForm.addControl(key, new forms_1.FormControl(settings[key], [forms_1.Validators.required]));
        });
    };
    // updateWindowNotifSettings(settings){
    // 	//	console.log(settings);
    // 	this.windowNotificationsForm = this.formbuilder.group({});
    // 	Object.keys(settings).map(key => {
    // 		this.windowNotificationsForm.addControl(key, new FormControl(settings[key], [Validators.required]));
    // 	});
    // }
    NotificationsComponent.prototype.settingsChanged = function (type) {
        this.changes[type] = true;
    };
    NotificationsComponent.prototype.submitEmailSettings = function () {
        var _this = this;
        this.loading = true;
        this._adminSettingService
            .SetEmailNotificationSettings('tickets', this.emailNotificationForm.value)
            .subscribe(function (response) {
            _this.loading = false;
            if (response.status == 'ok') {
                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: 'Settings saved successfully!'
                    },
                    duration: 3000,
                    panelClass: ['user-alert', 'success']
                });
            }
            else if (response.status == 'error') {
                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'warning',
                        msg: 'Error!'
                    },
                    duration: 3000,
                    panelClass: ['user-alert', 'error']
                });
            }
            //Do Some Error Logic If Any
            //Check Server Responses For this Event
        }, function (err) {
            //TO DO ERROR LOGIC
            _this.loading = false;
        });
    };
    // submitWindowSettings(){
    // 	this.loading = true;
    // 	this._agentService.SetWindowNotificationSettings(this.windowNotificationsForm.value).subscribe(response=>{
    // 		this.loading = false;
    // 			if (response.status == 'ok') {
    // 				this.changes['window'] = false;
    // 				this.snackBar.openFromComponent(ToastNotifications, {
    // 					data: {
    // 						img: 'ok',
    // 						msg: 'Settings saved successfully!'
    // 					},
    // 					duration: 5000,
    // 					panelClass: ['user-alert', 'success']
    // 				});
    // 			} else if (response.status == 'error') {
    // 				this.snackBar.openFromComponent(ToastNotifications, {
    // 					data: {
    // 						img: 'warning',
    // 						msg: 'Error!'
    // 					},
    // 					duration: 5000,
    // 					panelClass: ['user-alert', 'error']
    // 				});
    // 			}
    // 			//Do Some Error Logic If Any
    // 			//Check Server Responses For this Event
    // 		}, err => {
    // 			//TO DO ERROR LOGIC
    // 			this.loading = false;
    // 		// });
    // 	});
    // 	// this._adminSettingService
    // 	// 	.SetWindowNotificationSettings(this.windowNotificationsForm.value)
    // 	// 	.subscribe(response => {
    // 	// 		this.loading = false;
    // 	// 		if (response.status == 'ok') {
    // 	// 			this.snackBar.openFromComponent(ToastNotifications, {
    // 	// 				data: {
    // 	// 					img: '/assets/img/icons/svg/ok.svg',
    // 	// 					msg: 'Settings saved successfully!'
    // 	// 				},
    // 	// 				duration: 5000,
    // 	// 				panelClass: ['user-alert', 'success']
    // 	// 			});
    // 	// 		} else if (response.status == 'error') {
    // 	// 			this.snackBar.openFromComponent(ToastNotifications, {
    // 	// 				data: {
    // 	// 					img: '/assets/img/icons/svg/warning.svg',
    // 	// 					msg: 'Error!'
    // 	// 				},
    // 	// 				duration: 5000,
    // 	// 				panelClass: ['user-alert', 'error']
    // 	// 			});
    // 	// 		}
    // 	// 		//Do Some Error Logic If Any
    // 	// 		//Check Server Responses For this Event
    // 	// 	}, err => {
    // 	// 		//TO DO ERROR LOGIC
    // 	// 		this.loading = false;
    // 	// 	});
    // }
    NotificationsComponent.prototype.ngOnInit = function () {
    };
    NotificationsComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
    };
    NotificationsComponent = __decorate([
        core_1.Component({
            selector: 'app-notifications',
            templateUrl: './notifications.component.html',
            styleUrls: ['./notifications.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], NotificationsComponent);
    return NotificationsComponent;
}());
exports.NotificationsComponent = NotificationsComponent;
//# sourceMappingURL=notifications.component.js.map