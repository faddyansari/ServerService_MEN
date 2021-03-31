"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactsComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var confirmation_dialog_component_1 = require("../../dialogs/confirmation-dialog/confirmation-dialog.component");
var call_dialog_component_1 = require("../../dialogs/call-dialog/call-dialog.component");
var ContactsComponent = /** @class */ (function () {
    function ContactsComponent(_contactService, _authService, _uploadingService, _callingService, dialog) {
        var _this = this;
        this._contactService = _contactService;
        this._authService = _authService;
        this._uploadingService = _uploadingService;
        this._callingService = _callingService;
        this.dialog = dialog;
        // the data structure used for view
        this.subscriptions = [];
        this.selectedContact = {};
        this.edit = false;
        this.loading = false;
        this.showContactAccessInfo = false;
        this.initiateChat = true;
        this.showChat = false;
        this.numbersArray = Array(15).fill(0).map(function (x, i) { return i; });
        this.verified = true;
        this.showContacts = true;
        this.showConversations = false;
        this.showContactInfo = false;
        this.loadingContactInfo = false;
        this.production = false;
        this.sbt = false;
        this.subscriptions.push(_authService.getAgent().subscribe(function (data) {
            _this.agent = data;
        }));
        this.subscriptions.push(_authService.Production.subscribe(function (data) {
            _this.production = data;
        }));
        this.subscriptions.push(_authService.SBT.subscribe(function (data) {
            _this.sbt = data;
        }));
        this.subscriptions.push(this._authService.getSettings().subscribe(function (settings) {
            if (settings && Object.keys(settings).length)
                _this.verified = settings.verified;
        }));
        this.subscriptions.push(_contactService.selectedContact.subscribe(function (contact) {
            _this.selectedContact = contact;
            if (Object.keys(_this.selectedContact).length) {
                _this.name = _this.selectedContact.name;
                // this.last_name = this.selectedContact.last_name;
                // this.nickname = this.selectedContact.nickname;
                _this.phone_no = _this.selectedContact.phone_no;
                _this.name_control = new forms_1.FormControl(_this.selectedContact.first_name, [forms_1.Validators.required]);
                // this.last_name_control = new FormControl(this.selectedAgent.last_name, [Validators.required]);
                // this.nickname_control = new FormControl(this.selectedAgent.nickname, [Validators.required]);
                _this.phone_no_control = new forms_1.FormControl(_this.selectedContact.phone_no, [forms_1.Validators.pattern(/^[0-9\-]+$/)]);
            }
            if (_this.edit)
                _this.Cancel();
        }));
        this.subscriptions.push(_contactService.isSelfViewingChat.subscribe(function (data) {
            if (data) {
                _this.isSelfViewingChat = data;
            }
        }));
        this.subscriptions.push(_contactService.selectedThread.subscribe(function (data) {
            _this.selectedThread = data;
        }));
        this.subscriptions.push(_contactService.showContactInfo.subscribe(function (data) {
            _this.showContactInfo = data;
        }));
        this.subscriptions.push(_contactService.loadingContactInfo.subscribe(function (data) {
            _this.loadingContactInfo = data;
        }));
        this.subscriptions.push(_contactService.showContactAccessInfo.subscribe(function (data) {
            _this.showContactAccessInfo = data;
        }));
        this.subscriptions.push(_contactService.showContacts.subscribe(function (data) {
            _this.showContacts = data;
        }));
        this.subscriptions.push(_contactService.showConversations.subscribe(function (data) {
            _this.showConversations = data;
        }));
    }
    ContactsComponent.prototype.ngOnInit = function () {
    };
    ContactsComponent.prototype.Edit = function () {
        this.edit = true;
    };
    ContactsComponent.prototype.Save = function () {
        this.loading = true;
        this._contactService.EditContact({
            _id: this.selectedContact._id,
            name: this.name,
            phone_no: this.phone_no,
            email: this.selectedContact.email
        });
    };
    ContactsComponent.prototype.Delete = function (id, email) {
        var _this = this;
        this.dialog.open(confirmation_dialog_component_1.ConfirmationDialogComponent, {
            panelClass: ['confirmation-dialog'],
            data: { headermsg: 'Are You Sure You Want To Delete?' }
        }).afterClosed().subscribe(function (data) {
            if (data == 'ok') {
                _this._contactService.DeleteContact(id, email);
            }
        });
    };
    ContactsComponent.prototype.Cancel = function () {
        this.edit = false;
        this.name = this.selectedContact.name;
        // this.last_name = this.selectedAgent.last_name;
        // this.nickname = this.selectedAgent.nickname;
        this.phone_no = this.selectedContact.phone_no;
        this.name_control = new forms_1.FormControl(this.selectedContact.name, [forms_1.Validators.required]);
        // this.last_name_control = new FormControl(this.selectedAgent.last_name, [Validators.required]);
        // this.nickname_control = new FormControl(this.selectedAgent.nickname, [Validators.required]);
        this.phone_no_control = new forms_1.FormControl(this.selectedContact.phone_no, [forms_1.Validators.pattern(/^[0-9]+$/)]);
    };
    ContactsComponent.prototype.NumbersOnly = function (event) {
        var pattern = /[0-9\-]+/;
        var inputChar = String.fromCharCode(event.charCode);
        if (!pattern.test(inputChar)) {
            // invalid character, prevent input
            event.preventDefault();
        }
    };
    ContactsComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
        this._contactService.setSelectedContact();
    };
    ContactsComponent.prototype.ToggleChat = function () {
        this._contactService.getOrcreateConversation();
        // if(!this.selectedThread){    
        //     this._contactService.getOrcreateConversation();
        // }else{
        //     if(this.selectedThread && this.selectedThread._id){
        //         this._contactService.ToggleSelfViewingChat(this.selectedThread._id);
        //     }
        // }  
    };
    ContactsComponent.prototype.toggleContactAccessInfo = function () {
        this._contactService.toggleContactAccessInformation();
    };
    ContactsComponent.prototype.TryCall = function (selectedContact) {
        var _this = this;
        event.preventDefault();
        // this._callingService.dummyCallNotif();
        this.dialog.open(call_dialog_component_1.CallDialogComponent, {
            panelClass: ['calling-dialog'],
            data: selectedContact,
            disableClose: true,
            autoFocus: true
        }).afterClosed().subscribe(function (response) {
            // console.log(response);
            _this._callingService.EndCall();
        });
    };
    ContactsComponent = __decorate([
        core_1.Component({
            selector: 'app-contacts',
            templateUrl: './contacts.component.html',
            styleUrls: ['./contacts.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], ContactsComponent);
    return ContactsComponent;
}());
exports.ContactsComponent = ContactsComponent;
//# sourceMappingURL=contacts.component.js.map