"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatBubbleComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var Observable_1 = require("rxjs/Observable");
var toast_notifications_component_1 = require("../../../../dialogs/SnackBar-Dialog/toast-notifications.component");
var ChatBubbleComponent = /** @class */ (function () {
    function ChatBubbleComponent(_chatWindowCustomizations, _appStateService, formbuilder, snackBar, dialog) {
        var _this = this;
        this._chatWindowCustomizations = _chatWindowCustomizations;
        this._appStateService = _appStateService;
        this.formbuilder = formbuilder;
        this.snackBar = snackBar;
        this.dialog = dialog;
        this.subscriptions = [];
        this.displaySettings = undefined;
        this.colorRegex = /^#[0-9a-fA-F]{8}$|#[0-9a-fA-F]{6}$|#[0-9a-fA-F]{4}$|#[0-9a-fA-F]{3}$/;
        this.backupDisplaySettings = {};
        this.val = "Top Left";
        this.loading = false;
        this.positionOption = {
            'top': false,
            'bottom': false,
            'left': false,
            'right': false
        };
        this._appStateService.contentInfo.next('');
        this._appStateService.breadCrumbTitle.next('Chat Window Customizations');
        this.subscriptions.push(this._chatWindowCustomizations.GetDisplaySettings().subscribe(function (displaySettings) {
            if (displaySettings) {
                _this.displaySettings = displaySettings;
                _this.backupDisplaySettings = JSON.parse(JSON.stringify(_this.displaySettings));
                _this.InitChatBubbleForm();
                _this.InitChatBarForm();
                _this.SetOptions(_this.displaySettings.settings[!_this.displaySettings.barEnabled ? 'chatbubble' : 'chatbar'].position);
            }
        }));
    }
    ChatBubbleComponent.prototype.ngOnInit = function () {
    };
    ChatBubbleComponent.prototype.SetBarEnabledForView = function (value, name) {
        this.displaySettings[name] = value;
    };
    ChatBubbleComponent.prototype.SetBarEnabled = function (value) {
        this.displaySettings.barEnabled = value;
        this.SetOptions(this.displaySettings.settings[!this.displaySettings.barEnabled ? 'chatbubble' : 'chatbar'].position);
    };
    ChatBubbleComponent.prototype.Reset = function () {
        this.displaySettings.barEnabledForMobile = this.backupDisplaySettings.barEnabledForMobile;
        this.displaySettings.barEnabledForMobile = this.backupDisplaySettings.barEnabledForDesktop;
        if (this.displaySettings.barEnabled) {
            this.displaySettings.settings.chatbar = JSON.parse(JSON.stringify(this.backupDisplaySettings.settings.chatbar));
            this.SvgChangeColor(this.logo);
        }
        else {
            this.displaySettings.settings.chatbubble = JSON.parse(JSON.stringify(this.backupDisplaySettings.settings.chatbubble));
            this.SvgChangeColor(this.logo);
        }
        this.SetOptions(this.displaySettings.settings[!this.backupDisplaySettings.barEnabled ? 'chatbubble' : 'chatbar'].position);
    };
    ChatBubbleComponent.prototype.SetOptions = function (value) {
        var _this = this;
        if (value) {
            var options_1 = value.split('-');
            Object.keys(this.positionOption).map(function (key) {
                if (options_1.includes(key)) {
                    _this.positionOption[key] = true;
                    var value_1 = _this.displaySettings.settings[!_this.displaySettings.barEnabled ? 'chatbubble' : 'chatbar'].absolutePosition[key];
                    _this.displaySettings.settings[!_this.displaySettings.barEnabled ? 'chatbubble' : 'chatbar'].absolutePosition[key] = (value_1 && (value_1.toLocaleLowerCase() != 'inherit')) ? value_1 : '0';
                }
                else {
                    _this.positionOption[key] = false;
                    _this.displaySettings.settings[!_this.displaySettings.barEnabled ? 'chatbubble' : 'chatbar'].absolutePosition[key] = 'inherit';
                }
            });
        }
    };
    ChatBubbleComponent.prototype.SetPosition = function (event) {
        this.SetOptions(event.target.value);
    };
    ChatBubbleComponent.prototype.SetControl = function (data) {
        this.chatBubbleForm.get(data.controlValue).setValue(data.value);
        this.displaySettings.settings[data.settingType][data.setting][data.controlValue] = data.value;
    };
    ChatBubbleComponent.prototype.ResetToDefaults = function () {
        this.displaySettings.barEnabledForMobile = false;
        this.displaySettings.barEnabledForMobile = false;
        if (this.displaySettings.barEnabled) {
            this.displaySettings.settings.chatbar = {
                bgColor: '#F15C24FF',
                logoColor: '#FFFFFFFF',
                title: 'Chat Now',
                position: 'bottom-right',
                absolutePosition: {
                    left: 'inherit',
                    bottom: '0',
                    right: '0',
                    top: 'inherit',
                },
                radius: {
                    topLeft: '0',
                    topRight: '0',
                    bottomLeft: '0',
                    bottomRight: '0'
                },
            };
            this.SvgChangeColor(this.logo);
        }
        else {
            this.displaySettings.settings.chatbubble = {
                signals: {
                    enabled: false,
                    signalColor: '#F15C24FF',
                    opacity: 1
                },
                radius: {
                    topLeft: '50',
                    topRight: '50',
                    bottomLeft: '50',
                    bottomRight: '50'
                },
                bgColor: '#F15C24FF',
                logoColor: '#FFFFFFFF',
                position: 'bottom-right',
                absolutePosition: {
                    left: 'inherit',
                    bottom: '0',
                    right: '0',
                    top: 'inherit',
                }
            };
            this.SvgChangeColor(this.logo);
        }
    };
    ChatBubbleComponent.prototype.SvgChangeColor = function (svg) {
        // let svgElement = (this.logo.nativeElement as HTMLObjectElement).contentDocument.getElementsByTagName('path').item(0);
        var svgElement = this.logo.nativeElement;
        (svgElement).setAttribute('fill', (this.displaySettings.barEnabled) ? this.displaySettings.settings.chatbar.logoColor : this.displaySettings.settings.chatbubble.logoColor);
    };
    ChatBubbleComponent.prototype.InitChatBubbleForm = function () {
        //FormInitializers
        this.signalColorCopy = this.displaySettings.settings.chatbubble.signals.signalColor;
        this.chatBubbleForm = this.formbuilder.group({
            'signalsEnable': [
                this.displaySettings.settings.chatbubble.signals.enabled
            ],
            'signalColor': [
                this.displaySettings.settings.chatbubble.signals.signalColor,
                [
                    forms_1.Validators.required
                ],
                this.IsValidColor.bind(this)
            ],
            'signalOpacity': [
                this.displaySettings.settings.chatbubble.signals.opacity,
                forms_1.Validators.required
            ],
            'bgColor': [
                this.displaySettings.settings.chatbubble.bgColor,
                [
                    forms_1.Validators.required,
                    forms_1.Validators.pattern(this.colorRegex)
                ]
            ],
            'logoColor': [
                this.displaySettings.settings.chatbubble.logoColor,
                [
                    forms_1.Validators.required,
                    forms_1.Validators.pattern(this.colorRegex)
                ]
            ],
            'position': [
                this.displaySettings.settings.chatbubble.position,
                forms_1.Validators.required
            ],
            'topLeft': [
                this.displaySettings.settings.chatbubble.radius.topLeft,
                forms_1.Validators.required
            ],
            'topRight': [
                this.displaySettings.settings.chatbubble.radius.topRight,
                forms_1.Validators.required
            ],
            'bottomLeft': [
                this.displaySettings.settings.chatbubble.radius.bottomLeft,
                forms_1.Validators.required
            ],
            'bottomRight': [
                this.displaySettings.settings.chatbubble.radius.bottomRight,
                forms_1.Validators.required
            ],
            'left': [
                this.displaySettings.settings.chatbubble.absolutePosition.left,
                forms_1.Validators.required
            ],
            'right': [
                this.displaySettings.settings.chatbubble.absolutePosition.right,
                forms_1.Validators.required
            ],
            'top': [
                this.displaySettings.settings.chatbubble.absolutePosition.top,
                forms_1.Validators.required
            ],
            'bottom': [
                this.displaySettings.settings.chatbubble.absolutePosition.bottom,
                forms_1.Validators.required
            ]
        });
    };
    ChatBubbleComponent.prototype.InitChatBarForm = function () {
        this.chatBarForm = this.formbuilder.group({
            'bgColor': [
                this.displaySettings.settings.chatbar.bgColor,
                [
                    forms_1.Validators.required,
                    forms_1.Validators.pattern(this.colorRegex)
                ]
            ],
            'logoColor': [
                this.displaySettings.settings.chatbar.logoColor,
                [
                    forms_1.Validators.required,
                    forms_1.Validators.pattern(this.colorRegex)
                ]
            ],
            'title': [
                this.displaySettings.settings.chatbar.title,
                forms_1.Validators.required
            ],
            'position': [
                this.displaySettings.settings.chatbar.position,
                forms_1.Validators.required
            ],
            'borderRadius': [
                this.displaySettings.settings.chatbar.radius,
                forms_1.Validators.required
            ],
            'topLeft': [
                this.displaySettings.settings.chatbar.radius.topLeft,
                forms_1.Validators.required
            ],
            'topRight': [
                this.displaySettings.settings.chatbar.radius.topRight,
                forms_1.Validators.required
            ],
            'bottomLeft': [
                this.displaySettings.settings.chatbar.radius.bottomLeft,
                forms_1.Validators.required
            ],
            'bottomRight': [
                this.displaySettings.settings.chatbar.radius.bottomRight,
                forms_1.Validators.required
            ],
            'left': [
                this.displaySettings.settings.chatbar.absolutePosition.left,
                forms_1.Validators.required
            ],
            'right': [
                this.displaySettings.settings.chatbar.absolutePosition.right,
                forms_1.Validators.required
            ],
            'top': [
                this.displaySettings.settings.chatbar.absolutePosition.top,
                forms_1.Validators.required
            ],
            'bottom': [
                this.displaySettings.settings.chatbar.absolutePosition.bottom,
                forms_1.Validators.required
            ]
        });
    };
    ChatBubbleComponent.prototype.IsValidColor = function (control) {
        var color = control.value;
        if (this.colorRegex.test(color)) {
            this.displaySettings.settings.chatbubble.signals.signalColor = color;
            return Observable_1.Observable.of(null);
        }
        return Observable_1.Observable.of({ 'invalid': true });
    };
    ChatBubbleComponent.prototype.SignalEnabled = function (value) {
        this.displaySettings.settings.chatbubble.signals.enabled = value;
        this.chatBubbleForm.get('signalColor').setValue(this.signalColorCopy);
    };
    ChatBubbleComponent.prototype.SaveSettings = function (formType) {
        var _this = this;
        this.loading = true;
        this._chatWindowCustomizations.UpdateChaWindowSettings(formType, this.displaySettings).subscribe(function (response) {
            _this.loading = false;
            //TODO SHOW NOTICIFACTION THAT SETTINGS UPDATED
            if (response.status == 'ok') {
                if (formType == 'chatbubble') {
                    _this.backupDisplaySettings = JSON.parse(JSON.stringify(_this.displaySettings));
                    _this.signalColorCopy = _this.displaySettings.settings.chatbubble.signals.signalColor;
                }
                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: 'Settings saved successfully!'
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'success']
                });
            }
        }, function (err) {
            // console.log(err);
            _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                data: {
                    img: 'ok',
                    msg: 'Error in saving Settings!'
                },
                duration: 2000,
                panelClass: ['user-alert', 'success']
            });
        });
    };
    ChatBubbleComponent.prototype.ColorChange = function (event, data) {
        var _this = this;
        switch (event) {
            case 'signalColor':
                this.chatBubbleForm.get('signalColor').setValue(this._chatWindowCustomizations.RGBAToHexAString(data));
                break;
            case 'bgColor':
                this.chatBubbleForm.get('bgColor').setValue(this._chatWindowCustomizations.RGBAToHexAString(data));
                break;
            case 'logoColor':
                setTimeout(function () {
                    (_this.displaySettings.barEnabled) ? _this.chatBarForm.get('logoColor').setValue(_this._chatWindowCustomizations.RGBAToHexAString(data)) : _this.chatBubbleForm.get('logoColor').setValue(_this._chatWindowCustomizations.RGBAToHexAString(data));
                    _this.SvgChangeColor(_this.logo);
                }, 0);
                break;
            case 'barColor':
                this.chatBarForm.get('bgColor').setValue(this._chatWindowCustomizations.RGBAToHexAString(data));
                break;
            case 'avatarColor':
                this.avatarForm.get('avatarColor').setValue(this._chatWindowCustomizations.RGBAToHexAString(data));
                break;
        }
    };
    ChatBubbleComponent.prototype.DisableInput = function (event) {
        event.preventDefault();
    };
    ChatBubbleComponent.prototype.ngOnDestroy = function () {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.subscriptions.map(function (subscription) {
            subscription.unsubscribe();
        });
    };
    __decorate([
        core_1.ViewChild('logo')
    ], ChatBubbleComponent.prototype, "logo", void 0);
    ChatBubbleComponent = __decorate([
        core_1.Component({
            selector: 'app-chat-bubble',
            templateUrl: './chat-bubble.component.html',
            styleUrls: ['./chat-bubble.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], ChatBubbleComponent);
    return ChatBubbleComponent;
}());
exports.ChatBubbleComponent = ChatBubbleComponent;
//# sourceMappingURL=chat-bubble.component.js.map