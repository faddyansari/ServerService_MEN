"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailTemplateService = void 0;
var core_1 = require("@angular/core");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var Observable_1 = require("rxjs/Observable");
var toast_notifications_component_1 = require("../../app/dialogs/SnackBar-Dialog/toast-notifications.component");
var Subject_1 = require("rxjs/Subject");
var cleaner = require('clean-html');
var EmailTemplateService = /** @class */ (function () {
    function EmailTemplateService(_socket, _authService, _router, _notificationService, snackbar) {
        var _this = this;
        this._router = _router;
        this._notificationService = _notificationService;
        this.snackbar = snackbar;
        this.ShowTemplateBuilder = new BehaviorSubject_1.BehaviorSubject(false);
        this.ShowImportTemplate = new BehaviorSubject_1.BehaviorSubject(false);
        this.ShowHTMLEditor = new BehaviorSubject_1.BehaviorSubject(false);
        this.showHideList = new BehaviorSubject_1.BehaviorSubject(false);
        this.ShowTemplateOptions = new BehaviorSubject_1.BehaviorSubject(false);
        this.selectedTemplate = new BehaviorSubject_1.BehaviorSubject(undefined);
        this.sendLayout = new BehaviorSubject_1.BehaviorSubject([]);
        this.showTemplateList = new BehaviorSubject_1.BehaviorSubject(false);
        this.selectedSettings = new BehaviorSubject_1.BehaviorSubject([]);
        this.EmailLayout = new BehaviorSubject_1.BehaviorSubject(undefined);
        this.passLayout = new BehaviorSubject_1.BehaviorSubject('');
        this.ButtonPressed = new Subject_1.Subject();
        this.validation = new Subject_1.Subject();
        //changing properties
        this.defaultSettings = new BehaviorSubject_1.BehaviorSubject({
            ContainerSettings: {
                containerWidth: 900,
                paddingContainer_top: 20,
                paddingContainer_bottom: 20,
                paddingContainer_left: 20,
                paddingContainer_right: 20,
                marginContainer_top: 20,
                marginContainer_bottom: 20,
                marginContainer_left: 20,
                marginContainer_right: 20,
                backgroundColor_Container: 'transparent',
                backgroundImg_Container: '',
                borderWidthContainer: 1,
                borderStyleContainer: 'solid',
                borderColorContainer: 'black',
                containerimageOpacity: 1,
                backgroundRepeat_Container: 'repeat',
                backgroundSize_Container: 'cover',
                backgroundSizePercent_Container: 50,
                backgroundPositionX_Container: 'left',
                backgroundPositionY_ContainerY: 'center'
            },
            ParentSettings: {
                textAlign: 'left',
                paddingParent_top: 10,
                paddingParent_bottom: 10,
                paddingParent_left: 10,
                paddingParent_right: 10,
                marginParent_top: 20,
                marginParent_bottom: 20,
                marginParent_left: 20,
                marginParent_right: 20,
                backgroundColorParent: 'transparent',
                borderParent_width: 1,
                borderParent_style: 'solid',
                borderParent_color: 'black'
            },
            ChildSettings: {
                color: 'transparent',
                textColor: '#000',
                paddingChild_top: 10,
                paddingChild_bottom: 10,
                paddingChild_left: 10,
                paddingChild_right: 10,
                // placement: 'flex-column',
                borderRadius: 0,
                borderChild_width: 0,
                borderChild_style: 'solid',
                borderChild_color: 'black',
                fontWeight: '',
                fontStyle: '',
                button_FontSize: 12,
                button_Width_Type: '',
                button_Width: 100,
                scaleType: 'px'
            }
        });
        this.defualtProperties = new BehaviorSubject_1.BehaviorSubject({
            mainContainerSettings: {
                paddingContainer_top: 0,
                paddingContainer_right: 0,
                paddingContainer_bottom: 0,
                paddingContainer_left: 0,
                marginContainer_top: 0,
                marginContainer_right: 0,
                marginContainer_bottom: 0,
                marginContainer_left: 0,
                backgroundColor_Container: 'transparent',
                backgroundImg_Container: '',
                backgroundRepeat_Container: 'repeat',
                borderWidthContainer: 1,
                borderStyleContainer: 'solid',
                borderColorContainer: '#c8d1e1',
                containerimageOpacity: 1,
                containerWidth: 900,
                backgroundSize_Container: 'cover',
                backgroundSizePercent_Container: 50,
                backgroundPositionX_Container: 'left',
                backgroundPositionY_Container: 'center'
            },
            ParentSettings: {
                paragraph: {
                    textAlignParent: 'left',
                    paddingParent_top: 10,
                    paddingParent_bottom: 10,
                    paddingParent_left: 10,
                    paddingParent_right: 10,
                    marginParent_top: 20,
                    marginParent_bottom: 20,
                    marginParent_left: 20,
                    marginParent_right: 20,
                    backgroundColorParent: 'transparent',
                    borderParent_width: 1,
                    borderParent_style: 'solid',
                    borderParent_color: 'black'
                },
                button: {
                    textAlignParent: 'left',
                    paddingParent_top: 10,
                    paddingParent_bottom: 10,
                    paddingParent_left: 10,
                    paddingParent_right: 10,
                    marginParent_top: 20,
                    marginParent_bottom: 20,
                    marginParent_left: 20,
                    marginParent_right: 20,
                    backgroundColorParent: 'transparent',
                    borderParent_width: 1,
                    borderParent_style: 'solid',
                    borderParent_color: 'black'
                },
                image: {
                    textAlignParent: 'left',
                    paddingParent_top: 10,
                    paddingParent_bottom: 10,
                    paddingParent_left: 10,
                    paddingParent_right: 10,
                    marginParent_top: 20,
                    marginParent_bottom: 20,
                    marginParent_left: 20,
                    marginParent_right: 20,
                    backgroundColorParent: 'transparent',
                    borderParent_width: 1,
                    borderParent_style: 'solid',
                    borderParent_color: 'black'
                },
                SocialMediaLinks: {
                    textAlignParent: 'left',
                    paddingParent_top: 10,
                    paddingParent_bottom: 10,
                    paddingParent_left: 10,
                    paddingParent_right: 10,
                    marginParent_top: 20,
                    marginParent_bottom: 20,
                    marginParent_left: 20,
                    marginParent_right: 20,
                    backgroundColorParent: 'transparent',
                    borderParent_width: 1,
                    borderParent_style: 'solid',
                    borderParent_color: 'black'
                },
                separator: {
                    textAlignParent: 'left',
                    paddingParent_top: 10,
                    paddingParent_bottom: 10,
                    paddingParent_left: 10,
                    paddingParent_right: 10,
                    marginParent_top: 20,
                    marginParent_bottom: 20,
                    marginParent_left: 20,
                    marginParent_right: 20,
                    backgroundColorParent: 'transparent',
                    borderParent_width: 1,
                    borderParent_style: 'solid',
                    borderParent_color: 'black'
                }
            },
            ChildSettings: {
                paragraph: {
                    textColorChild: 'black',
                    colorChild: 'gray',
                    paddingChild_top: 10,
                    paddingChild_bottom: 10,
                    paddingChild_left: 10,
                    paddingChild_right: 10,
                    // placementChild: 'flex-column',
                    borderRadiusChild: 0,
                    fontWeightChild: '',
                    fontStyleChild: '',
                    button_FontSizeChild: 10,
                    borderChild_width: 1,
                    borderChild_style: 'solid',
                    borderChild_color: 'black',
                    button_WidthChild: 100,
                    scaleTypeChild: 'auto',
                },
                button: {
                    textColorChild: '#ffffff',
                    colorChild: '#56a6ff',
                    paddingChild_top: 10,
                    paddingChild_bottom: 10,
                    paddingChild_left: 10,
                    paddingChild_right: 10,
                    // placementChild: 'flex-column',
                    borderRadiusChild: 4,
                    fontWeightChild: '',
                    fontStyleChild: '',
                    button_FontSizeChild: 10,
                    borderChild_width: 1,
                    borderChild_style: 'solid',
                    borderChild_color: '#1986ff',
                    // button_Width_Type_Child: '',
                    button_WidthChild: 100,
                    scaleTypeChild: 'px'
                },
                image: {
                    textColorChild: 'black',
                    colorChild: 'gray',
                    paddingChild_top: 10,
                    paddingChild_bottom: 10,
                    paddingChild_left: 10,
                    paddingChild_right: 10,
                    // placementChild: 'flex-column',
                    borderRadiusChild: 0,
                    fontWeightChild: '',
                    fontStyleChild: '',
                    button_FontSizeChild: 10,
                    borderChild_width: 1,
                    borderChild_style: 'solid',
                    borderChild_color: 'black',
                    button_WidthChild: 100,
                    scaleTypeChild: 'auto'
                },
                SocialMediaLinks: {
                    textColorChild: 'black',
                    colorChild: 'gray',
                    paddingChild_top: 10,
                    paddingChild_bottom: 10,
                    paddingChild_left: 10,
                    paddingChild_right: 10,
                    // placementChild: 'flex-column',
                    borderRadiusChild: 0,
                    fontWeightChild: '',
                    fontStyleChild: '',
                    button_FontSizeChild: 10,
                    borderChild_width: 1,
                    borderChild_style: 'solid',
                    borderChild_color: 'black',
                    button_WidthChild: 100,
                    scaleTypeChild: 'auto'
                },
                separator: {
                    textColorChild: 'black',
                    colorChild: 'gray',
                    paddingChild_top: 1,
                    paddingChild_bottom: 3,
                    paddingChild_left: 10,
                    paddingChild_right: 13,
                    // placementChild: 'flex-column',
                    borderRadiusChild: 0,
                    fontWeightChild: '',
                    fontStyleChild: '',
                    button_FontSizeChild: 10,
                    borderChild_width: 1,
                    borderChild_style: 'solid',
                    borderChild_color: 'black',
                    button_WidthChild: 100,
                    scaleTypeChild: '%'
                }
            }
        });
        this.Agent = undefined;
        this.subscriptions = [];
        this.AllTemplates = new BehaviorSubject_1.BehaviorSubject([]);
        if (this._notificationService.permission == 'default' || 'denied') {
            this._notificationService.requestPermission();
        }
        this.subscriptions.push(_socket.getSocket().subscribe(function (data) {
            if (data) {
                _this.socket = data;
                _this.getTemplates();
                _this.getLayoutByName();
                // this.getActivatedRoute();
            }
        }));
        this.subscriptions.push(_authService.getAgent().subscribe(function (data) {
            if (data) {
                _this.Agent = data;
            }
        }));
    }
    EmailTemplateService.prototype.getTemplates = function () {
        var _this = this;
        this.socket.emit('getAllTemplates', {}, function (response) {
            if (response.status == 'ok') {
                // console.log(response.templates);
                _this.AllTemplates.next(response.templates);
            }
        });
    };
    EmailTemplateService.prototype.getLayoutByName = function () {
        // console.log(this.passLayout.getValue());
        var _this = this;
        this.socket.emit('getLayoutByName', { templateName: this.passLayout.getValue() }, function (response) {
            if (response.status == 'ok') {
                // console.log(response);
                _this.EmailLayout.next(response.layout);
            }
        });
    };
    // getActivatedRoute() {
    //     this._router.params.subscribe(params => {
    //         console.log(params);
    //     });
    // }
    EmailTemplateService.prototype.SetCodeAndReturn = function (value) {
        // value.replace(/(?=<!--)([\s\S]*?)-->/, '');
        // value.replace(/<(\w+)\s*(?:(?:(?:(?!class=|id=|name=)[^>]))*((?:class|id|name)=['"][^'"]*['"]\s*)?)(?:(?:(?:(?!class=|id=|name=)[^>]))*((?:class|id|name)=['"][^'"]*['"]\s*)?)(?:(?:(?:(?!class=|id=|name=)[^>]))*((?:class|id|name)=['"][^'"]*['"]\s*)?)[^>]*>/, '')
        var options = {
            'indent': '    ',
            'remove-comments': true,
            'remove-tags': [/app-/],
            'remove-attributes': [/ng-/, /id/, /routerlink/],
            'break-around-tags': ['body', 'blockquote', 'br', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'hr', 'link', 'meta', 'p', 'table', 'title', 'td', 'tr', 'i', 'a', 'button', 'ul', 'div', 'form', 'span'],
        };
        cleaner.clean(value, options, function (html) {
            value = html;
        });
        return value;
    };
    EmailTemplateService.prototype.DeleteTemplate = function (id) {
        var _this = this;
        this.socket.emit('deleteTemplate', { id: id }, function (response) {
            if (response.status == 'ok') {
                // console.log(this.WholeForm.getValue());
                var index = _this.AllTemplates.getValue().findIndex(function (obj) { return obj._id == id; });
                _this.AllTemplates.getValue().splice(index, 1);
                //delete this line by fixing live update issue
                _this.getTemplates();
                // console.log(this.WholeForm.getValue());
                _this.AllTemplates.next(_this.AllTemplates.getValue());
                _this.snackbar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: 'Template Deleted Successfully!'
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'success']
                });
            }
            else {
                _this.snackbar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: 'Template Not Deleted!'
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'success']
                });
            }
        });
    };
    EmailTemplateService.prototype.UpdateTemplate = function (fid, obj) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socket.emit('editTemplate', { fid: fid, template: obj }, function (response) {
                if (response.status == 'ok') {
                    _this.snackbar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                        data: {
                            img: 'ok',
                            msg: 'Template Updated Successfully!'
                        },
                        duration: 2000,
                        panelClass: ['user-alert', 'success']
                    });
                    var index = _this.AllTemplates.getValue().findIndex(function (a) { return a._id == fid; });
                    _this.AllTemplates.getValue()[index] = response.templateUpdated;
                    _this.selectedTemplate.next(undefined);
                    observer.next({ status: 'ok', allTemplates: response.templateUpdated });
                    observer.complete();
                }
                else {
                    _this.snackbar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                        data: {
                            img: 'warning',
                            msg: 'Error in updating template, Please Try again!'
                        },
                        duration: 2000,
                        panelClass: ['user-alert', 'error']
                    });
                    observer.next({ status: 'error' });
                    observer.complete();
                }
            });
        });
    };
    EmailTemplateService.prototype.RGBAToHexAString = function (rgba) {
        // console.log(rgba);
        if (new RegExp(/^#[0-9a-fA-F]{8}$|#[0-9a-fA-F]{6}$|#[0-9a-fA-F]{4}$|#[0-9a-fA-F]{3}$/).test(rgba))
            return rgba;
        var sep = rgba.indexOf(",") > -1 ? "," : " ";
        rgba = rgba.substr(5).split(")")[0].split(sep);
        // Strip the slash if using space-separated syntax
        if (rgba.indexOf("/") > -1)
            rgba.splice(3, 1);
        for (var R in rgba) {
            var r = rgba[R];
            if (r.indexOf("%") > -1) {
                var p = r.substr(0, r.length - 1) / 100;
                if (parseInt(R) < 3) {
                    rgba[R] = Math.round(p * 255);
                }
                else {
                    rgba[R] = p;
                }
            }
        }
        // console.log(this.RGBAToHexA(rgba));
        return this.RGBAToHexA(rgba);
    };
    EmailTemplateService.prototype.RGBAToHexA = function (rgba) {
        //console.log(rgba);
        var r = (+rgba[0]).toString(16), g = (+rgba[1]).toString(16), b = (+rgba[2]).toString(16), a = Math.round(+rgba[3] * 255).toString(16);
        if (!a)
            a = 'F';
        if (r.length == 1)
            r = "0" + r;
        if (g.length == 1)
            g = "0" + g;
        if (b.length == 1)
            b = "0" + b;
        if (a.length == 1)
            a = "0" + a;
        //console.log(a);
        return "#" + r + g + b + a;
    };
    EmailTemplateService.prototype.insertEmailTemplate = function (obj) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            // console.log(obj);
            _this.socket.emit('addTemplate', { template: obj }, function (response) {
                if (response.status == 'ok') {
                    _this.AllTemplates.getValue().unshift(response.template);
                    _this.AllTemplates.next(_this.AllTemplates.getValue());
                    _this.snackbar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                        data: {
                            img: 'ok',
                            msg: 'Template Designed Successfully!'
                        },
                        duration: 2000,
                        panelClass: ['user-alert', 'success']
                    });
                    observer.next({ status: 'ok', allTemplates: response.templateInserted });
                    observer.complete();
                }
                else {
                    _this.snackbar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                        data: {
                            img: 'warning',
                            msg: 'Error in designing template, Please Try again!'
                        },
                        duration: 2000,
                        panelClass: ['user-alert', 'error']
                    });
                    observer.next({ status: 'error' });
                    observer.complete();
                }
            });
        });
    };
    EmailTemplateService.prototype.Destroy = function () {
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
    };
    EmailTemplateService = __decorate([
        core_1.Injectable()
    ], EmailTemplateService);
    return EmailTemplateService;
}());
exports.EmailTemplateService = EmailTemplateService;
//# sourceMappingURL=EmailTemplateService.js.map