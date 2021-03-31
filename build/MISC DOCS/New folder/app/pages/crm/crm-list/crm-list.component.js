"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrmListComponent = void 0;
var core_1 = require("@angular/core");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var Observable_1 = require("rxjs/Observable");
var Subject_1 = require("rxjs/Subject");
require("rxjs/add/operator/switchMap");
var CrmListComponent = /** @class */ (function () {
    function CrmListComponent(_authService, _appStateService, _crmService, _router, dialog, snackBar, formbuilder) {
        var _this = this;
        this._authService = _authService;
        this._appStateService = _appStateService;
        this._crmService = _crmService;
        this._router = _router;
        this.dialog = dialog;
        this.snackBar = snackBar;
        this.scrollHeight = 0;
        this.customerList = [];
        this.coustomerList_original = [];
        this.filteredcustomerList = [];
        this.loadingAgents = new BehaviorSubject_1.BehaviorSubject(true);
        this.subscriptions = [];
        this.forceSelected = '';
        this.sortBy = '';
        this.activeCount = 0;
        this.idleCount = 0;
        this.offlineCount = 0;
        this.expandAddAgent = false;
        this.searchText = '';
        this.numbersArray = Array(15).fill(0).map(function (x, i) { return i; });
        this.autoscroll = false;
        this.agentConversations = [];
        this.onSearchInput = new Subject_1.Subject();
        this.verified = true;
        this.fetchMoreEnabled = true;
        this.filterDrawer = false;
        this.loadingMoreCustomers = true;
        this.loadingCustomers = false;
        this.searchForm = formbuilder.group({
            'searchValue': ['', []
            ]
        });
        this.subscriptions.push(this._router.params.subscribe(function (params) {
            if (params.id) {
                _this.forceSelected = params.id;
            }
        }));
        this.subscriptions.push(this._authService.getAgent().subscribe(function (data) {
            _this.Agent = data;
        }));
        this.subscriptions.push(this._authService.getSettings().subscribe(function (settings) {
            //console.log(settings)
            if (settings && Object.keys(settings).length)
                _this.verified = settings.verified;
        }));
        this.subscriptions.push(this._crmService.getAllCustomersList().subscribe(function (data) {
            if (data && data.length > 0) {
                _this.customerList = data;
                _this.coustomerList_original = data;
            }
        }));
        this.subscriptions.push(this._crmService.getSelectedCustomer().subscribe(function (data) {
            if (data)
                _this.selectedCustomer = data;
        }));
        this.subscriptions.push(this._crmService.noMoreCustomersToFetch.subscribe(function (data) {
            _this.noMoreCustomers = data;
        }));
        this.subscriptions.push(_crmService.selectedCustomerConversation.subscribe(function (data) {
            if (data)
                _this.selectedCustomerConversation = data;
        }));
        this.subscriptions.push(_crmService.loadingMoreCustomers.subscribe(function (data) {
            _this.loadingMoreCustomers = data;
            _this.fetchMoreEnabled = !data;
        }));
        this.subscriptions.push(_crmService.getLoadingVariable().subscribe(function (data) {
            _this.loadingCustomers = data;
            _this.fetchMoreEnabled = !data;
        }));
        this.onSearchInput
            .map(function (event) { return event; })
            .debounceTime(2000)
            .switchMap(function () {
            // console.log("Searching...");
            return new Observable_1.Observable(function (observer) {
                var searchvalue = _this.searchForm.get("searchValue").value;
                if (searchvalue) {
                    _this.fetchMoreEnabled = false;
                    var customers_1 = _this.coustomerList_original.filter(function (a) { return a.email.includes(searchvalue.toLowerCase() || a.username.toLowerCase().includes(searchvalue.toLowerCase())); });
                    _this._crmService.SearchVisitor(searchvalue).subscribe(function (response) {
                        if (response && response.customerList.length) {
                            response.customerList.forEach(function (element) {
                                if (!_this.customerList.filter(function (a) { return a.deviceID == element.deviceID; }).length) {
                                    _this.customerList.push(element);
                                }
                            });
                        }
                        _this.customerList = customers_1;
                    });
                    _this.customerList = customers_1;
                }
                else {
                    _this.fetchMoreEnabled = true;
                    _this.customerList = _this.coustomerList_original;
                    // this.setScrollEvent();
                }
            });
        }).subscribe();
    }
    CrmListComponent.prototype.ngOnInit = function () {
    };
    CrmListComponent.prototype.ScrollChanged = function (event) {
        var _this = this;
        if (this.verified) {
            //this.scrollHeight = this.ScrollContainer.nativeElement.scrollHeight;
            if (Math.round(event.target.scrollTop + event.target.clientHeight) >= (this.ScrollContainer.nativeElement.scrollHeight - 10)) {
                // if (Math.round((event.target as HTMLElement).scrollTop + (event.target as HTMLElement).clientHeight) >= (this.ScrollContainer.nativeElement.scrollHeight)) {
                if (this.searchForm.get("searchValue").value) {
                    this._crmService.SearchVisitor(this.searchForm.get("searchValue").value, (this.customerList.length) ? this.customerList[this.customerList.length - 1]._id : '').subscribe(function (response) {
                        if (response && response.customerList.length) {
                            response.customerList.forEach(function (element) {
                                if (!_this.customerList.filter(function (a) { return a.deviceID == element.deviceID; }).length) {
                                    _this.customerList.push(element);
                                }
                            });
                        }
                    });
                }
                if (this.fetchMoreEnabled && !this.loadingMoreCustomers && !this.noMoreCustomers) {
                    this.loadingMoreCustomers = true;
                    this.fetchMoreEnabled = false;
                    this._crmService.getMoreCustomersFromBackend(this.customerList[this.customerList.length - 1]._id);
                }
            }
            setTimeout(function () {
                _this.scrollHeight = _this.ScrollContainer.nativeElement.scrollHeight;
            }, 0);
        }
    };
    CrmListComponent.prototype.updateControlSideBar = function () {
        this._appStateService
            .ToggleControlSideBarState();
    };
    CrmListComponent.prototype.toggleFilterDrawer = function () {
        this.filterDrawer = !this.filterDrawer;
    };
    CrmListComponent.prototype.ngAfterViewInit = function () {
        this.scrollHeight = this.ScrollContainer.nativeElement.scrollHeight;
    };
    CrmListComponent.prototype.setScrollEvent = function () {
    };
    CrmListComponent.prototype.ngAfterViewChecked = function () {
        // 	//Called after every check of the component's view. Applies to components only.
        // 	//Add 'implements AfterViewChecked' to the class.
        // 	if (this.loadingMoreCustomers && !this.fetchMoreEnabled && !this.noMoreCustomers) {
        // 		this.ScrollContainer.nativeElement.scrollTop = this.ScrollContainer.nativeElement.scrollHeight + 20
        // 	}
    };
    CrmListComponent.prototype.SortBy = function (customerList) {
        var _this = this;
        if (this.customerList.length > 0) {
            if (!this.sortBy) {
                return this.customerList;
            }
            else {
                return this.customerList.filter(function (customer) {
                    if (_this.sortBy == 'conv') {
                        return (customer.convoLength);
                    }
                });
            }
        }
        else {
            return [];
        }
    };
    CrmListComponent.prototype.setFilter = function (filter) {
        this.sortBy = filter;
    };
    CrmListComponent.prototype.setSelectedCustomer = function (deviceid) {
        var _this = this;
        //if (deviceid != this.selectedCustomer.deviceID) this._crmService.viewingConversation.next(false);
        if (deviceid) {
            if (deviceid != this.selectedCustomer.deviceID) {
                this._crmService.viewingConversation.next(false);
                this._crmService.setSelectedCustomer(deviceid);
                if (!this.selectedCustomer.conversationsFetched)
                    this.selectedCustomer.conversationsFetched = false;
                if (!this.selectedCustomer.conversationsFetched && !this.selectedCustomer.conversations) {
                    this._crmService.getConversationsList(deviceid).subscribe(function (conversations) {
                        // console.log(conversations);
                        if (conversations) {
                            _this.selectedCustomer.conversations = conversations;
                            _this.selectedCustomer.conversationsFetched = true;
                            _this._crmService.ExtractSessionInfo();
                            _this._crmService.UpdateCustomer(_this.selectedCustomer);
                        }
                    }, function (err) {
                        _this._crmService.setSelectedCustomer(deviceid);
                        _this._crmService.selectedCustomerConversation.next({});
                    });
                }
                else { //console.log("already added list");
                }
            }
        }
    };
    CrmListComponent.prototype.ngOnDestroy = function () {
        // Called once, before the instance is destroyed.
        // Add 'implements OnDestroy' to the class.
        this._appStateService.showAgentModal(false);
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
    };
    __decorate([
        core_1.ViewChild('scrollContainer')
    ], CrmListComponent.prototype, "ScrollContainer", void 0);
    CrmListComponent = __decorate([
        core_1.Component({
            selector: 'app-crm-list',
            templateUrl: './crm-list.component.html',
            styleUrls: ['./crm-list.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], CrmListComponent);
    return CrmListComponent;
}());
exports.CrmListComponent = CrmListComponent;
//# sourceMappingURL=crm-list.component.js.map