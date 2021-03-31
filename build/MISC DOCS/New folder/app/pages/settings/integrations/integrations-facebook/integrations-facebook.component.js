"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationsFacebookComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var environment_1 = require("../../../../../environments/environment");
var confirmation_dialog_component_1 = require("../../../../dialogs/confirmation-dialog/confirmation-dialog.component");
var toast_notifications_component_1 = require("../../../../dialogs/SnackBar-Dialog/toast-notifications.component");
var IntegrationsFacebookComponent = /** @class */ (function () {
    // private FBMicroserviceURI = "http://beelinks.solutions";
    function IntegrationsFacebookComponent(_integrationsService, fb, http, _authService, _appStateService, _ticketAutomationService, dialog, snackBar, formbuilder) {
        var _this = this;
        this._integrationsService = _integrationsService;
        this.fb = fb;
        this.http = http;
        this._authService = _authService;
        this._appStateService = _appStateService;
        this._ticketAutomationService = _ticketAutomationService;
        this.dialog = dialog;
        this.snackBar = snackBar;
        this.formbuilder = formbuilder;
        this.subscriptions = [];
        this.editCase = false;
        this.extendedToken = '';
        this.views = {
            loading: true,
            AppIdView: false,
            FBLoginView: false,
            FBChoosePagesView: false,
            FBChosenPageView: false,
        };
        this.loading = false;
        this.sendingInfo = {};
        this.sbt = false;
        this.fb_appid = '';
        this.fb_secretId = '';
        this.pageURI = environment_1.environment.FBMicroserviceURI + "/FB/getPageData";
        this.editAppId = false;
        this.all_groups = [];
        this.userid = '';
        this.package = undefined;
        this._appStateService.contentInfo.next('');
        this._appStateService.breadCrumbTitle.next('Integerations');
        this.subscriptions.push(this._authService.getPackageInfo().subscribe(function (pkg) {
            console.log(pkg);
            if (pkg) {
                _this.package = pkg.integratons;
                if (!_this.package.allowed) {
                    _this._appStateService.NavigateTo('/noaccess');
                }
            }
        }));
        this.appIdForm = this.formbuilder.group({
            'fb_appid': [this.fb_appid, forms_1.Validators.required]
        });
        //Getting App Id and loading SDK.
        this.subscriptions.push(this._integrationsService.getFacebookAppId().subscribe(function (res) {
            if (res) {
                _this.fb_appid = res.app_id;
                console.log(_this.fb_appid);
                _this.fb_secretId = res.app_secret;
                _this.appIdForm.get('fb_appid').setValue(_this.fb_appid);
                _this.http.post(_this.pageURI, { nsp: _this.agent.nsp }).subscribe(function (resp) {
                    if (resp && resp["name"]) {
                        _this.connectedPage = resp;
                        _this.loadFBSDK();
                        _this.showView('FBChosenPageView');
                    }
                    else {
                        _this.loadFBSDK();
                        _this.showView('FBLoginView');
                    }
                }, function (err) {
                    console.log(err);
                    _this.loadFBSDK();
                    _this.showView('FBLoginView');
                });
            }
            else {
                _this.showView('AppIdView');
            }
        }));
        this.subscriptions.push(this._authService.getAgent().subscribe(function (agent) {
            _this.agent = agent;
        }));
        this.subscriptions.push(_authService.SBT.subscribe(function (data) {
            _this.sbt = data;
        }));
    }
    IntegrationsFacebookComponent.prototype.connectFB = function () {
        var _this = this;
        this.loading = true;
        this.loginFB().then(function (loginResp) {
            _this.sendingInfo['accessToken'] = loginResp.authResponse.accessToken;
            _this.getFBPages(loginResp.authResponse.userID)
                .then(function (pagesResp) {
                _this.getPagePicture(pagesResp.data[0].id).then(function (res) {
                    console.log("getpicture", res);
                    pagesResp.data[0].url = (res["picture"]["data"]["url"]);
                    pagesResp.data[0].link = (res["link"]);
                    console.log('pagesResp');
                    console.log(pagesResp);
                    _this.sendingInfo['userPageData'] = pagesResp.data;
                    _this.FBPagesView = { array: [], selected: -1 };
                    pagesResp.data.forEach(function (element) {
                        // show only pages where the user has the "MODERATE" property:
                        // user must be a administrator, moderator or editor on a page to have this permission
                        if (element.tasks.includes("MODERATE"))
                            _this.FBPagesView.array.push({ name: element.name, url: element.url, link: element.link });
                    });
                    console.log(_this.FBPagesView.array);
                }).catch(function (err) {
                    console.log(err);
                    _this.loading = false;
                });
                _this.fb.logout()
                    .then(function () {
                    _this.showView('FBChoosePagesView');
                    _this.loading = false;
                })
                    .catch(function (err) {
                    console.log('Logout cancelled');
                    _this.loading = false;
                });
            });
        })
            .catch(function (err) {
            console.log(err);
            _this.loading = false;
        });
    };
    // communicate with server to add user facebook page
    IntegrationsFacebookComponent.prototype.subscribeFBPage = function () {
        var _this = this;
        if (this.FBPagesView.selected > -1) {
            this.loading = true;
            var subscribeURI = environment_1.environment.FBMicroserviceURI + "/FB/connectPage";
            this.sendingInfo['selectedPage'] = this.FBPagesView['selected'];
            this.sendingInfo['companyNSP'] = this.agent.nsp;
            this.sendingInfo['overwrite'] = false;
            console.log('this.sendingInfo');
            console.log(this.sendingInfo);
            console.log("Sending POST request on '/FB/connectPage'");
            this.http.post(subscribeURI, this.sendingInfo)
                .subscribe(function (resp) {
                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: 'Facebook page associated successfully!'
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'success']
                });
                console.log('/FB/connectPage');
                console.log('resp');
                console.log(resp);
                _this.connectedPage = _this.sendingInfo['userPageData'][_this.sendingInfo['selectedPage']];
                console.log('this.connectedPage');
                console.log(_this.connectedPage);
                _this.loading = false;
                if (resp) {
                    _this.showView('FBChosenPageView');
                }
                else {
                }
            }, function (err) {
                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'warning',
                        msg: 'Error in association, Please try again!'
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'warning']
                });
                _this.loading = false;
            });
        }
    };
    IntegrationsFacebookComponent.prototype.setFBAppId = function () {
        var _this = this;
        this._integrationsService.setFacebookAppId(this.appIdForm.get('fb_appid').value).subscribe(function (app_id) {
            if (app_id) {
                _this.editAppId = false;
                _this.showView('loading');
                _this.fb_appid = app_id;
                _this.http.post(_this.pageURI, { nsp: _this.agent.nsp })
                    .subscribe(function (resp) {
                    // check if complete object is sent by checking the presence of one of the fields 
                    if (resp['name']) {
                        _this.connectedPage = resp;
                        _this.loadFBSDK();
                        _this.showView('FBChosenPageView');
                    }
                    else {
                        _this.loadFBSDK();
                        _this.showView('FBLoginView');
                    }
                }, function (err) {
                    _this.loadFBSDK();
                    _this.showView('FBLoginView');
                });
            }
            else {
                console.log('error');
            }
        });
    };
    IntegrationsFacebookComponent.prototype.cancel = function () {
        var _this = this;
        this.editAppId = false;
        this.showView('loading');
        this.http.post(this.pageURI, { nsp: this.agent.nsp }).subscribe(function (resp) {
            if (resp['name']) {
                _this.connectedPage = resp;
                _this.loadFBSDK();
                _this.showView('FBChosenPageView');
            }
            else {
                _this.loadFBSDK();
                _this.showView('FBLoginView');
            }
        }, function (err) {
            _this.loadFBSDK();
            _this.showView('FBLoginView');
        });
    };
    IntegrationsFacebookComponent.prototype.editPage = function () {
        this.editCase = true;
    };
    IntegrationsFacebookComponent.prototype.changeAppId = function () {
        this.editAppId = true;
        this.showView('AppIdView');
    };
    IntegrationsFacebookComponent.prototype.changeState = function (event) {
        this.editCase = event;
    };
    IntegrationsFacebookComponent.prototype.getPagePicture = function (id) {
        var _this = this;
        var url = "/" + id + "/?fields=link,picture{url}";
        return new Promise(function (resolve, reject) {
            _this.fb.api(url)
                .then(function (resp) {
                resolve(resp);
            })
                .catch(function (error) {
                console.error("getpicture error");
                reject(error);
            });
        });
    };
    // GOTO: create an expected error has occured or server can not be reached error \
    // to tell the user the application was not supposed to work this way
    // catch all the http subscribes
    // run when user wishes to disconnect his/her page from the platform
    IntegrationsFacebookComponent.prototype.disconnectFB = function () {
        var _this = this;
        var uri = environment_1.environment.FBMicroserviceURI + "/FB/disconnectPage";
        var para = { nsp: this.agent.nsp, page: this.connectedPage };
        this.dialog.open(confirmation_dialog_component_1.ConfirmationDialogComponent, {
            panelClass: ['confirmation-dialog'],
            data: { headermsg: 'Are you sure wan to deassociate this page?' }
        }).afterClosed().subscribe(function (data) {
            if (data == 'ok') {
                _this.loading = true;
                _this.http.post(uri, para)
                    .subscribe(function (response) {
                    _this.loading = false;
                    if (response) {
                        _this.connectedPage = undefined;
                        _this.showView('FBLoginView');
                        _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                            data: {
                                img: 'ok',
                                msg: 'Facebook page deassociated successfully!'
                            },
                            duration: 2000,
                            panelClass: ['user-alert', 'success']
                        });
                    }
                    else {
                        console.log("Error occured in disconnecting page");
                    }
                });
                // 			this.fb.logout()
                //   .then(() => {
                // this.FBPagesView = null;
                // this.sendingInfo = {};
                // this.http.post(uri, para)
                //   .subscribe(resp => {
                // 	this.fb.logout()
                //     this.loading = false;
                //     if (resp) {
                //       this.connectedPage = undefined;
                //       this.showView('FBLoginView');
                //     }
                //     else {
                //       console.log("Error occured in disconnecting page from platform");
                //     }
                //   });
                //   })
                //   .catch(err => {
                //     console.log('Logout cancelled');
                //     this.loading = false;
                //   });
            }
            else {
                return;
            }
        });
    };
    IntegrationsFacebookComponent.prototype.loginFB = function () {
        var _this = this;
        var loginOptions = { scope: 'manage_pages,read_page_mailboxes' };
        return new Promise(function (resolve, reject) {
            _this.fb.login(loginOptions)
                .then(function (resp) {
                resolve(resp);
            })
                .catch(function (error) {
                _this.loading = false;
                console.error("Login cancelled");
                reject(error);
            });
        });
    };
    IntegrationsFacebookComponent.prototype.backToLoginView = function () {
        var _this = this;
        this.FBPagesView = null;
        this.sendingInfo = {};
        this.showView('FBLoginView');
        this.fb.logout()
            .then(function () {
            _this.FBPagesView = null;
            _this.sendingInfo = {};
            _this.showView('FBLoginView');
            _this.loading = false;
        })
            .catch(function (err) {
            console.log('Logout cancelled');
            _this.loading = false;
        });
    };
    IntegrationsFacebookComponent.prototype.getFBPages = function (userID) {
        var _this = this;
        var url = "/" + userID + "/accounts";
        console.log(url);
        return new Promise(function (resolve, reject) {
            _this.fb.api(url)
                .then(function (resp) {
                resolve(resp);
            })
                .catch(function (error) {
                console.error("getpage error");
                reject(error);
            });
        });
    };
    IntegrationsFacebookComponent.prototype.loadFBSDK = function () {
        var _this = this;
        if (this.fb_appid) {
            this.FBSDKScriptElement = document.createElement('script');
            this.FBSDKScriptElement.type = 'text/javascript';
            this.FBSDKScriptElement.async = true;
            this.FBSDKScriptElement.src = 'https://connect.facebook.net/en_US/sdk.js';
            var scriptsList = document.getElementsByTagName('script');
            var lastScript = scriptsList[scriptsList.length - 1];
            lastScript.parentNode.insertBefore(this.FBSDKScriptElement, lastScript.nextSibling);
            this.FBSDKScriptElement.onload = function () {
                var initParams = {
                    appId: _this.fb_appid,
                    xfbml: true,
                    version: 'v6.0',
                };
                _this.fb.init(initParams);
            };
        }
        else {
            console.log('no app id found!');
        }
    };
    IntegrationsFacebookComponent.prototype.showView = function (viewNameSelect) {
        var _this = this;
        var viewNames = Object.keys(this.views);
        viewNames.forEach(function (viewName) {
            if (viewNameSelect == viewName)
                _this.views[viewName] = true;
            else
                _this.views[viewName] = false;
        });
        this.loading = false;
    };
    IntegrationsFacebookComponent.prototype.ngOnInit = function () { };
    IntegrationsFacebookComponent.prototype.ngOnDestroy = function () {
        if (this.FBSDKScriptElement)
            this.FBSDKScriptElement.remove();
        //		this.FBSDKScriptElement.remove();
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
    };
    IntegrationsFacebookComponent.prototype.Sendreq = function () {
        var _this = this;
        var uri = "/" + this.userid + "?fields=posts{created_time,message,full_picture,attachments{url,description,media,media_type}}";
        return new Promise(function (resolve, reject) {
            _this.fb.api(uri)
                .then(function (resp) {
                console.log("data post", resp);
                resolve(resp);
            })
                .catch(function (error) {
                console.error("getpicture error");
                reject(error);
            });
        });
    };
    IntegrationsFacebookComponent = __decorate([
        core_1.Component({
            selector: 'app-integrations-facebook',
            templateUrl: './integrations-facebook.component.html',
            styleUrls: ['./integrations-facebook.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None,
        })
    ], IntegrationsFacebookComponent);
    return IntegrationsFacebookComponent;
}());
exports.IntegrationsFacebookComponent = IntegrationsFacebookComponent;
//# sourceMappingURL=integrations-facebook.component.js.map