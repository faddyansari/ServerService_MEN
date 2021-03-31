"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConvListSidebarComponent = void 0;
var core_1 = require("@angular/core");
var ConvListSidebarComponent = /** @class */ (function () {
    function ConvListSidebarComponent(_contactService, formbuilder, _authService) {
        var _this = this;
        this._contactService = _contactService;
        this.formbuilder = formbuilder;
        this._authService = _authService;
        this.contactList = [];
        this.contactList_original = [];
        this.subscriptions = [];
        this.loading = false;
        this.verified = true;
        this.conversationList = [];
        this.subscriptions.push(_contactService.conversationList.subscribe(function (data) {
            _this.conversationList = data;
        }));
        this.conversationSearchForm = formbuilder.group({
            'searchValue': ['', [],]
        });
        this.subscriptions.push(_authService.getAgent().subscribe(function (data) {
            _this.agent = data;
        }));
        this.subscriptions.push(_contactService.selectedThread.subscribe(function (data) {
            _this.selectedThread = data;
        }));
        this.subscriptions.push(_contactService.loadingContacts.subscribe(function (data) {
            _this.loading = data;
        }));
        this.subscriptions.push(this._authService.getSettings().subscribe(function (settings) {
            if (settings && Object.keys(settings).length)
                _this.verified = settings.verified;
        }));
    }
    ConvListSidebarComponent.prototype.ngOnInit = function () {
    };
    ConvListSidebarComponent.prototype.setSelectedConversation = function (conversation) {
        // console.log(conversation);
        this._contactService.GetContactByEmail((conversation.to == this.agent.email) ? conversation.from : conversation.to);
        this._contactService.GetThreadByCid(conversation);
    };
    ConvListSidebarComponent = __decorate([
        core_1.Component({
            selector: 'app-conv-list-sidebar',
            templateUrl: './conv-list-sidebar.component.html',
            styleUrls: ['./conv-list-sidebar.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], ConvListSidebarComponent);
    return ConvListSidebarComponent;
}());
exports.ConvListSidebarComponent = ConvListSidebarComponent;
//# sourceMappingURL=conv-list-sidebar.component.js.map