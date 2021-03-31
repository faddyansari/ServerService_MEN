"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactListSidebarComponent = void 0;
var core_1 = require("@angular/core");
var Observable_1 = require("rxjs/Observable");
//Change to Native Scrolling;
var Subject_1 = require("rxjs/Subject");
require("rxjs/add/operator/switchMap");
var ContactListSidebarComponent = /** @class */ (function () {
    function ContactListSidebarComponent(_contactService, formbuilder, _authService, _settings) {
        var _this = this;
        this._contactService = _contactService;
        this.formbuilder = formbuilder;
        this._authService = _authService;
        this._settings = _settings;
        this.contactList = [];
        this.contactList_original = [];
        this.onSearchInput = new Subject_1.Subject();
        this.subscriptions = [];
        this.sortBy = 'ALL';
        this.fetchMoreEnabled = true;
        this.loading = false;
        this.verified = true;
        //Scrolling
        this.scrollHeight = 0;
        this.scrollTop = 10;
        this.contactSearchForm = formbuilder.group({
            'searchValue': ['', [],]
        });
        this.subscriptions.push(_authService.getAgent().subscribe(function (data) {
            _this.agent = data;
        }));
        this.subscriptions.push(_settings.contactSettings.subscribe(function (data) {
            _this.contactSettings = data;
        }));
        this.subscriptions.push(this._authService.getSettings().subscribe(function (settings) {
            if (settings && Object.keys(settings).length)
                _this.verified = settings.verified;
        }));
        this.subscriptions.push(_contactService.contactsList.subscribe(function (list) {
            _this.contactList = list;
            _this.contactList_original = list;
            // this.lastContactId = (this.contactList.length) ? this.contactList[this.contactList.length - 1]._id : '0';
            _this.contactList.map(function (contact) {
                if (contact.email == _this.agent.email) {
                    return contact.status = true;
                }
            });
        }));
        this.subscriptions.push(_contactService.selectedContact.subscribe(function (contact) {
            _this.selectedContact = contact;
        }));
        this.subscriptions.push(_contactService.sortBy.subscribe(function (data) {
            _this.sortBy = data;
        }));
        this.subscriptions.push(_contactService.loadingContacts.subscribe(function (data) {
            _this.loading = data;
        }));
        //Contact Search
        var onsearchinput = this.onSearchInput
            .map(function (event) { return event; })
            .debounceTime(2000)
            .switchMap(function () {
            //console.log("Searching...");
            return new Observable_1.Observable(function (observer) {
                var searchvalue = _this.contactSearchForm.get("searchValue").value;
                if (searchvalue) {
                    _this.fetchMoreEnabled = false;
                    var contacts_1 = _this.contactList_original.filter(function (a) { return a.email.includes(searchvalue.toLowerCase() || a.name.toLowerCase().includes(searchvalue.toLowerCase())); });
                    _this._contactService.SearchContact(searchvalue).subscribe(function (response) {
                        //console.log(response);
                        if (response && response.contactList.length) {
                            response.contactList.forEach(function (element) {
                                if (!contacts_1.filter(function (a) { return a.email == element.email; }).length) {
                                    contacts_1.push(element);
                                }
                            });
                        }
                        _this.contactList = contacts_1;
                    });
                    _this.contactList = contacts_1;
                }
                else {
                    _this.fetchMoreEnabled = true;
                    _this.contactList = _this.contactList_original;
                    // this.setScrollEvent();
                }
            });
        }).subscribe();
    }
    ContactListSidebarComponent.prototype.ngOnInit = function () {
    };
    ContactListSidebarComponent.prototype.ngAfterViewInit = function () {
        this.setScrollEvent();
    };
    ContactListSidebarComponent.prototype.SortBy = function (contactList) {
        var _this = this;
        if (this.contactList.length > 0) {
            if (this.sortBy == 'ALL') {
                return this.contactList;
            }
            else {
                return this.contactList.filter(function (contact) {
                    if (_this.sortBy == 'ONLINE') {
                        return (contact.status == true);
                    }
                    else if (_this.sortBy == 'OFFLINE') {
                        return (contact.status == false);
                    }
                });
            }
        }
        else {
            return [];
        }
    };
    ContactListSidebarComponent.prototype.setSelectedContact = function (contactid) {
        this._contactService.setSelectedContact(contactid);
        this._contactService.selectedThread.next(undefined);
        // this.contactSearchForm.get('searchValue').setValue("");
    };
    // Toggle all checkboxes on togglling master
    ContactListSidebarComponent.prototype.ngOnDestroy = function () {
        // Called once, before the instance is destroyed.
        // Add 'implements OnDestroy' to the class.
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
        // this._visitorService.Destroy()
    };
    ContactListSidebarComponent.prototype.setScrollEvent = function () {
        // setTimeout(() => {
        // }, 1000);
        // if (this.scrollRef) {
        // 	this.scrollRef.scrollState
        // 		.debounceTime(100)
        // 		.subscribe(data => {
        // 			this.scrollTop = this.scrollRef.view.scrollTop;
        // 			if (this.scrollTop + this.scrollRef.view.offsetHeight > this.scrollRef.view.scrollHeight) {
        // 				//console.log('fetch more contacts');
        // 				if(this.contactSearchForm.get("searchValue").value){
        // 					this._contactService.SearchContact(this.contactSearchForm.get("searchValue").value, this.contactList[this.contactList.length - 1].name).subscribe((response) => {
        // 						// console.log(response);
        // 						if (response && response.contactList.length) {
        // 							response.contactList.forEach(element => {
        // 								if(!this.contactList.filter(a => a.email == element.email).length){
        // 									this.contactList.push(element);
        // 								}
        // 							});
        // 						} 
        // 					});
        // 				}
        // 				if (!(this.contactList as any).ended && this.fetchMoreEnabled) {
        // 					this._contactService.RetrieveContacts(this.contactList[this.contactList.length - 1].name, this.sortBy);
        // 				}
        // 			}
        // 		});
        // }
    };
    ContactListSidebarComponent = __decorate([
        core_1.Component({
            selector: 'app-contact-list-sidebar',
            templateUrl: './contact-list-sidebar.component.html',
            styleUrls: ['./contact-list-sidebar.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], ContactListSidebarComponent);
    return ContactListSidebarComponent;
}());
exports.ContactListSidebarComponent = ContactListSidebarComponent;
//# sourceMappingURL=contact-list-sidebar.component.js.map