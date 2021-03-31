"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactsNavComponent = void 0;
var core_1 = require("@angular/core");
var ContactsNavComponent = /** @class */ (function () {
    function ContactsNavComponent(_contactService, _authService) {
        var _this = this;
        this._contactService = _contactService;
        this._authService = _authService;
        this.sortBy = 'ALL';
        this.showContacts = true;
        this.showConversations = false;
        this.contactList = [];
        this.conversationList = [];
        this.subscriptions = [];
        this.subscriptions.push(_authService.getAgent().subscribe(function (data) {
            _this.agent = data;
        }));
        this.subscriptions.push(_contactService.contactsCount.subscribe(function (list) {
            _this.contactList = list;
            _this.onlineCount = _this.contactList.filter(function (data) { return data.status == true; }).length;
            _this.offlineCount = _this.contactList.filter(function (data) { return data.status == false; }).length;
        }));
        this.subscriptions.push(_contactService.conversationList.subscribe(function (data) {
            _this.conversationList = data.filter(function (a) { return a.messages.length; });
        }));
        this.subscriptions.push(_contactService.sortBy.subscribe(function (data) {
            _this.sortBy = data;
        }));
        this.subscriptions.push(_contactService.showContacts.subscribe(function (data) {
            _this.showContacts = data;
        }));
        this.subscriptions.push(_contactService.showConversations.subscribe(function (data) {
            _this.showConversations = data;
        }));
    }
    ContactsNavComponent.prototype.ngOnInit = function () {
    };
    ContactsNavComponent.prototype.setFilter = function (filter) {
        this._contactService.showContacts.next(true);
        this._contactService.showConversations.next(false);
        this._contactService.selectedThread.next(undefined);
        this._contactService.sortBy.next(filter);
        this._contactService.RetrieveContacts('0', filter);
    };
    ContactsNavComponent.prototype.displayConversations = function () {
        this._contactService.showContacts.next(false);
        this._contactService.showConversations.next(true);
        // this._contactService.selectedThread.next({});
        this._contactService.sortBy.next('');
    };
    ContactsNavComponent = __decorate([
        core_1.Component({
            selector: 'app-contacts-nav',
            templateUrl: './contacts-nav.component.html',
            styleUrls: ['./contacts-nav.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], ContactsNavComponent);
    return ContactsNavComponent;
}());
exports.ContactsNavComponent = ContactsNavComponent;
//# sourceMappingURL=contacts-nav.component.js.map