"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CRMService = void 0;
var core_1 = require("@angular/core");
//RxJS Imports
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/operator/map");
require("rxjs/add/operator/filter");
require("rxjs/add/observable/interval");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var Subject_1 = require("rxjs/Subject");
var CRMService = /** @class */ (function () {
    function CRMService(http, _socket, _authService, _contactService, _notificationService) {
        var _this = this;
        this.http = http;
        this._socket = _socket;
        this._authService = _authService;
        this._contactService = _contactService;
        this._notificationService = _notificationService;
        this.serverAddress = '';
        this.Agent = new BehaviorSubject_1.BehaviorSubject({});
        this.AllCustomers = new BehaviorSubject_1.BehaviorSubject([]);
        this.customer = new BehaviorSubject_1.BehaviorSubject({});
        this.subscriptions = [];
        this.selectedCustomer = new BehaviorSubject_1.BehaviorSubject({});
        this.selectedCustomerConversation = new BehaviorSubject_1.BehaviorSubject({});
        this.selectedSessionInfo = new BehaviorSubject_1.BehaviorSubject([{}]);
        this.selectedSessionDetails = new BehaviorSubject_1.BehaviorSubject(undefined);
        this.customerConversationList = new BehaviorSubject_1.BehaviorSubject([]);
        this.notification = new BehaviorSubject_1.BehaviorSubject('');
        this.updated = new Boolean(false);
        this.timer = Observable_1.Observable.interval(1000 * 60);
        // showCustomerInfo: BehaviorSubject<boolean> = new BehaviorSubject(false);
        this.showCustomerInfo = new Subject_1.Subject();
        //Loading Variable
        this.loadingCustomers = new BehaviorSubject_1.BehaviorSubject(true);
        this.viewingConversation = new BehaviorSubject_1.BehaviorSubject(false);
        this.ifMoreRecentChats = new BehaviorSubject_1.BehaviorSubject(true);
        this.loadingMoreCustomers = new BehaviorSubject_1.BehaviorSubject(false);
        this.noMoreCustomersToFetch = new BehaviorSubject_1.BehaviorSubject(false);
        this.loadingStats = new BehaviorSubject_1.BehaviorSubject(false);
        this.isStatActive = new BehaviorSubject_1.BehaviorSubject(false);
        this.customerStats = new BehaviorSubject_1.BehaviorSubject({});
        this.AllCustomers = new BehaviorSubject_1.BehaviorSubject([]);
        //Subscribing Agent Object
        this.subscriptions.push(_authService.getAgent().subscribe(function (data) {
            _this.Agent.next(data);
        }));
        //Subscribing Server Address
        this.subscriptions.push(_authService.analyticsURL.subscribe(function (url) {
            _this.serverAddress = url;
        }));
        //Subscribing Connected Socket
        this.subscriptions.push(_socket.getSocket().subscribe(function (data) {
            if (data) {
                _this.socket = data;
                _this.getAllCustomers();
            }
        }));
    }
    CRMService.prototype.getLoadingVariable = function () {
        return this.loadingCustomers.asObservable();
    };
    CRMService.prototype.setLaodingVariable = function (value) {
        this.loadingCustomers.next(value);
    };
    CRMService.prototype.getAllCustomersList = function () {
        return this.AllCustomers.asObservable();
    };
    CRMService.prototype.getAllCustomers = function () {
        var _this = this;
        ////console.log('Getting Customers!');
        this.setLaodingVariable(true);
        this.socket.emit('customerList', {}, function (response) {
            // //console.log('Response: ', response);
            if (response.status == 'ok') {
                // //console.log(response)
                _this.AllCustomers.next(response.list);
            }
            _this.setLaodingVariable(false);
        });
    };
    CRMService.prototype.getMoreCustomersFromBackend = function (id) {
        var _this = this;
        try {
            if (this.noMoreCustomersToFetch.getValue())
                return;
            this.loadingMoreCustomers.next(true);
            this.socket.emit('getMoreCustomers', { id: id }, function (response) {
                if (response.status == 'ok' && response.customers && response.customers.length > 0) {
                    //console.log(response);
                    if (response.hasOwnProperty('noMoreCustomers'))
                        _this.noMoreCustomersToFetch.next(response.noMoreCustomers);
                    var customers = _this.AllCustomers.getValue();
                    var data = customers.concat(response.customers);
                    _this.AllCustomers.next(data);
                    _this.loadingMoreCustomers.next(false);
                }
                else {
                    // console.log('error');
                    _this.loadingMoreCustomers.next(false);
                }
            });
        }
        catch (error) {
            // console.log('error');
            this.loadingMoreCustomers.next(false);
        }
    };
    CRMService.prototype.SearchVisitor = function (keyword, chunk) {
        var _this = this;
        if (chunk === void 0) { chunk = ''; }
        return new Observable_1.Observable(function (observer) {
            _this.loadingMoreCustomers.next(true);
            ////console.log('Searching contact on server...');
            _this.socket.emit('searchCustomers', {
                keyword: keyword,
                chunk: chunk
            }, function (response) {
                if (response) {
                    observer.next(response);
                    observer.complete();
                    // let customers: Array<any> = this.AllCustomers.getValue();
                    // let data = customers.concat(response.customers);
                    // this.AllCustomers.next(data);
                    _this.loadingMoreCustomers.next(false);
                }
                else {
                    observer.next(response);
                    _this.loadingMoreCustomers.next(false);
                }
            });
        });
    };
    // public LoadMore() {
    //     this.LoadingMessage = true;
    //     //setTimeout(() => {
    //       this._dataService.GetMoreRecentChats(this.Session.deviceID, this.Conversations[this.Conversations.length - 1]._id).subscribe(data => {
    //         this.ifMoreRecentChats = data;
    //         this.ErrorRecentChats = false;
    //         this.LoadingMessage = true;
    //       }, err => {
    //         this.ErrorRecentChats = true;
    //         this.LoadingMessage = true;
    //       });
    //     //}, 5000);
    //   }
    CRMService.prototype.getConversationsList = function (deviceID) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socket.emit('CustomerConversationsList', { deviceID: deviceID }, function (response) {
                if (response.status == 'ok' && response.conversations && response.conversations.length > 0) {
                    observer.next(response.conversations);
                    observer.complete();
                    //this.customerConversationList.next(response.conversations);
                }
                else {
                    observer.next([]);
                    observer.complete();
                    //this.customerConversationList.next([]);
                    ////console.log("no messages found in conversation")
                }
            });
        });
    };
    // public getSelectedCustomersInfo() {
    //     // this.socket.emit('CustomerConversationsList', {}, (response) => {
    //     //     if (response.status == 'ok' && response.conversations.length) {
    //     //         this.customerConversationList.next(response.conversations);
    //     //     } else {
    //     //         this.customerConversationList.next([]);
    //     //     }
    //     // });
    // }
    CRMService.prototype.getSelectedCustomer = function () {
        return this.selectedCustomer.asObservable();
    };
    CRMService.prototype.getSelectedSessionDetails = function () {
        return this.selectedSessionDetails.asObservable();
    };
    CRMService.prototype.setSelectedSessionDetails = function (session) {
        this.selectedSessionDetails.next(session);
    };
    CRMService.prototype.getCurrentConversation = function () {
        return this.selectedCustomerConversation.asObservable();
    };
    CRMService.prototype.setSelectedCustomer = function (deviceID) {
        var _this = this;
        this.isStatActive.next(false);
        if (deviceID) {
            this.AllCustomers.getValue().map(function (customer) {
                if (customer.deviceID == deviceID) {
                    _this.selectedCustomer.next(customer);
                    _this.GetCustomerStatistics(_this.Agent.getValue().csid, customer.deviceID).subscribe(function (response) {
                        if (response.status == 200) {
                            _this.customerStats.next(response.json());
                            //  //console.log(this.customerStats.getValue());
                        }
                    });
                }
            });
        }
        else {
            this.selectedCustomer.next({});
            this.selectedCustomerConversation.next({});
        }
        this.selectedSessionDetails.next(undefined);
    };
    CRMService.prototype.setNotification = function (notification, type, icon) {
        var item = {
            msg: notification,
            type: type,
            img: icon
        };
        this.notification.next(item);
        this.updated = false; //raheed
    };
    CRMService.prototype.getNotification = function () {
        return this.notification.asObservable();
    };
    CRMService.prototype.Destroy = function () {
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
    };
    // toggleCustomerAccessInformation() {
    //     this.showCustomerInfo.next(!this.showCustomerInfo.getValue());
    // }
    CRMService.prototype.toggleCustomerAccessInformation = function (value) {
        // //console.log(this.showCustomerInfo)
        this.showCustomerInfo.next(value);
    };
    CRMService.prototype.UpdateCustomer = function (selectedCustomer) {
        // this.AllCustomers.next(this.AllCustomers.getValue().map((customer) => {
        //     if (customer.deviceID == selectedCustomer.deviceID) {
        //         customer = selectedCustomer;
        //     }
        //     return customer;
        // }));
        //this.setSelectedCustomer(data.deviceID);
    };
    CRMService.prototype.setSelectedConversation = function (cid) {
        var _this = this;
        this.selectedCustomer.getValue().conversations.map(function (convo) {
            if (convo._id == cid) {
                _this.selectedCustomerConversation.next(convo);
            }
        });
        if (!this.selectedCustomerConversation.getValue().msgFetched)
            this.selectedCustomerConversation.getValue().msgFetched = false;
        if (!this.selectedCustomerConversation.getValue().msgFetched && !this.selectedCustomerConversation.getValue().msgList) {
            this.ShowSelectedChat();
        }
        this.viewingConversation.next(true);
    };
    CRMService.prototype.getMoreConversationsFromBackend = function (deviceID, id) {
        var _this = this;
        this.setLaodingVariable(true);
        this.socket.emit('MoreCustomerConversationsList', { deviceID: deviceID, id: id }, function (response) {
            if (response.status == 'ok' && response.conversations && response.conversations.length > 0) {
                var Convos = [];
                Convos = _this.selectedCustomer.getValue().conversations;
                var data_1 = Convos.concat(response.conversations);
                _this.AllCustomers.next(_this.AllCustomers.getValue().map(function (customer) {
                    if (customer.deviceID == deviceID) {
                        customer.conversations = data_1;
                        _this.setSelectedCustomer(customer.deviceID);
                    }
                    return customer;
                }));
                _this.ifMoreRecentChats.next(true);
                _this.setLaodingVariable(false);
            }
            else {
                _this.ifMoreRecentChats.next(false);
                _this.setLaodingVariable(false);
            }
        });
    };
    CRMService.prototype.ShowSelectedChat = function () {
        var _this = this;
        this.socket.emit('SelectedConversationDetails', { cid: this.selectedCustomerConversation.getValue()._id }, (function (response) {
            if (response.status == "ok") {
                _this.selectedCustomerConversation.getValue().msgFetched = true;
                _this.selectedCustomerConversation.getValue().msgList = response.msgList;
                _this.selectedCustomerConversation.next(_this.selectedCustomerConversation.getValue());
                _this.UpdateConversation(_this.selectedCustomerConversation, response.msgList);
            }
            else {
                ////console.log("no messages found in conversation")
            }
        }));
    };
    CRMService.prototype.UpdateConversation = function (conversation, messages) {
        var _this = this;
        this.AllCustomers.next(this.AllCustomers.getValue().map(function (customer) {
            if (customer.deviceID == _this.selectedCustomer.getValue().deviceID) {
                customer.conversations.msgList = messages;
            }
            return customer;
        }));
    };
    CRMService.prototype.ExtractSessionInfo = function () {
        var _this = this;
        if (!this.selectedCustomer.getValue().sessionInfo)
            this.selectedCustomer.getValue().sessionInfo = [];
        if (this.selectedCustomer.getValue().conversations) {
            this.selectedCustomer.getValue().conversations.map(function (convo) {
                var info = {};
                info._id = convo.sessionid;
                info.deviceID = convo.deviceID;
                info.agentemail = convo.agentEmail;
                info.visitorName = convo.visitorName;
                info.createdOn = convo.createdOn;
                _this.selectedCustomer.getValue().sessionInfo.push(info);
            });
            this.setSelectedCustomer(this.selectedCustomer.getValue().deviceID);
            //this.UpdateCustomer(this.selectedCustomer)
        }
    };
    CRMService.prototype.GetCustomerStatistics = function (sid, deviceID) {
        var _this = this;
        this.loadingStats.next(true);
        return new Observable_1.Observable(function (observer) {
            _this.http.get(_this.serverAddress + 'crm/' + sid + '/customerdetails/' + deviceID).subscribe(function (response) {
                _this.loadingStats.next(false);
                observer.next(response);
                observer.complete();
            }, function (err) {
                _this.loadingStats.next(false);
                observer.error(err);
            });
        });
    };
    CRMService.prototype.ToggleStats = function () {
        this.isStatActive.next(!this.isStatActive.getValue());
    };
    CRMService.prototype.setStatsStatus = function (value) {
        this.isStatActive.next(value);
    };
    //Schema Less
    CRMService.prototype.GetWorkFlowsList = function () {
        return new Observable_1.Observable(function (observer) {
        });
    };
    CRMService.prototype.GetStateMachineList = function () {
    };
    CRMService.prototype.GetSessionDetails = function (session) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socket.emit('getCrmSessionDetails', { session: session }, function (response) {
                if (response.status == 'ok' && response.sessionDetails) {
                    //console.log(response);
                    observer.next(response.sessionDetails);
                    observer.complete();
                    //this.customerConversationList.next(response.conversations);
                }
                else {
                    observer.next([]);
                    observer.complete();
                    //this.customerConversationList.next([]);
                    ////console.log("no messages found in conversation")
                }
            });
        });
    };
    CRMService.prototype.SelectCustomer = function (value) {
        var _this = this;
        var hash = 0;
        this.AllCustomers.getValue().map(function (customer, index) {
            if (customer._id == _this.selectedCustomer.getValue()._id) {
                hash = (value == 'next') ? (index + 1) : (index - 1);
            }
        });
        if (hash >= 0) {
            if (this.AllCustomers.getValue()[hash]) {
                this.setSelectedCustomer(this.AllCustomers.getValue()[hash].deviceID);
            }
        }
    };
    CRMService = __decorate([
        core_1.Injectable()
    ], CRMService);
    return CRMService;
}());
exports.CRMService = CRMService;
//# sourceMappingURL=crmService.js.map