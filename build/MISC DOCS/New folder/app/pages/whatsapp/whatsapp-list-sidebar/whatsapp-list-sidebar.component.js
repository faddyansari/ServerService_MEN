"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsappListSidebarComponent = void 0;
var core_1 = require("@angular/core");
var Subject_1 = require("rxjs/Subject");
var whatsapp_dialog_component_1 = require("../../../dialogs/whatsapp-dialog/whatsapp-dialog.component");
var WhatsappListSidebarComponent = /** @class */ (function () {
    function WhatsappListSidebarComponent(formbuilder, dialog, _changeDetector) {
        var _this = this;
        this.dialog = dialog;
        this._changeDetector = _changeDetector;
        this.selectedContact = undefined;
        this.selectContact = new core_1.EventEmitter();
        this.GetMoreContacts = new core_1.EventEmitter();
        this.SearchValue = new core_1.EventEmitter();
        this.Edit = new core_1.EventEmitter();
        this.Loading = true;
        this.Initialized = false;
        this.Searching = false;
        this.contactsList = [];
        this.subscriptions = [];
        this.scrollHeight = 0;
        this.scrollTop = 0;
        this.scrollDbounce = new Subject_1.Subject();
        this.editing = '';
        this.tempContact = undefined;
        // searching = false;
        this.editingStatus = {};
        this.searchForm = formbuilder.group({
            'searchValue': ['', []
            ]
        });
        this.subscriptions.push(this.searchForm.get('searchValue').valueChanges.distinctUntilChanged().subscribe(function (value) {
            _this.SearchValue.emit(value);
            // if (value && !this.Searching) this.Searching = true;
        }));
        this.subscriptions.push(this.scrollDbounce.debounceTime(1000).subscribe(function (data) {
            _this.GetMoreContacts.emit(data);
        }));
        this.searchForm.get('searchValue').value;
    }
    Object.defineProperty(WhatsappListSidebarComponent.prototype, "_contactsList", {
        set: function (value) {
            this.contactsList = value;
            this._changeDetector.detectChanges();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WhatsappListSidebarComponent.prototype, "UpdatedContact", {
        set: function (value) {
            var _this = this;
            if (!value)
                return;
            // console.log('Updating IN List BAR', value)
            this.contactsList = this.contactsList.map(function (contact) {
                if (contact._id == value._id) {
                    if (value.failed) {
                        contact.customerName = _this.editingStatus[value._id].contactCopy.customerName;
                        contact.customerNo = _this.editingStatus[value._id].contactCopy.customerNo;
                    }
                    else {
                        contact.customerName = value.customerName;
                        contact.customerNo = value.customerNo;
                    }
                }
                return contact;
            });
            delete this.editingStatus[value._id];
            // console.log(this.editingStatus[value._id]);
            this._changeDetector.detectChanges();
        },
        enumerable: false,
        configurable: true
    });
    WhatsappListSidebarComponent.prototype.SetSelectedContact = function (contactID, event) {
        if ((!this.selectedContact) || (this.selectedContact && this.selectedContact._id != contactID)) {
            this.selectContact.emit({ contactID: contactID });
        }
    };
    WhatsappListSidebarComponent.prototype.ScrollChanged = function (event) {
        if (Math.round(event.target.scrollTop + event.target.clientHeight) >= (this.scrollContainer.nativeElement.scrollHeight - 10)) {
            /**
             * @Note Following condition is used to detect motion from top
             * (this.scrollTop < (event.target as HTMLElement).scrollTop)
             */
            if (this.contactsList.length && (this.scrollTop < event.target.scrollTop)) {
                this.scrollDbounce.next({ lastTouchedTime: this.contactsList[this.contactsList.length - 1].lastTouchedTime });
            }
        }
        this.scrollTop = event.target.scrollTop;
        this.scrollHeight = this.scrollContainer.nativeElement.scrollHeight;
    };
    WhatsappListSidebarComponent.prototype.AddContact = function () {
        this.dialog.open(whatsapp_dialog_component_1.WhatsappDialogComponent, {
            panelClass: ['confirmation-dialog'],
            disableClose: true,
            data: {}
        }).afterClosed().subscribe(function (data) {
            if (data == 'ok') {
            }
        });
    };
    WhatsappListSidebarComponent.prototype.EditContact = function (contactID, editContact, event) {
        // console.log(editContact);
        event.stopImmediatePropagation();
        event.stopPropagation();
        this.editingStatus[contactID] = {
            status: 'editing',
            contactCopy: JSON.parse(JSON.stringify(this.tempContact))
        };
        this.editing = '';
        this.tempContact = undefined;
        this.Edit.emit(JSON.parse(JSON.stringify(editContact)));
    };
    WhatsappListSidebarComponent.prototype.EnableEdit = function (contactID, contact, event) {
        event.stopImmediatePropagation();
        event.stopPropagation();
        this.ClearEdit();
        this.tempContact = JSON.parse(JSON.stringify(contact));
        this.editing = contactID;
    };
    WhatsappListSidebarComponent.prototype.PreventBubbling = function (event) {
        event.stopImmediatePropagation();
        event.stopPropagation();
    };
    WhatsappListSidebarComponent.prototype.ClearEdit = function (event) {
        var _this = this;
        // console.log('Clear Edit',this.tempContact);
        if (event) {
            event.stopImmediatePropagation();
            event.stopPropagation();
        }
        if (this.tempContact) {
            this.contactsList = this.contactsList.map(function (contact) {
                if (contact._id == _this.tempContact._id) {
                    contact.customerName = _this.tempContact.customerName;
                    contact.customerNo = _this.tempContact.customerNo;
                }
                return contact;
            });
            this.editing = '';
            this.tempContact = undefined;
        }
    };
    WhatsappListSidebarComponent.prototype.ngOnInit = function () {
    };
    WhatsappListSidebarComponent.prototype.ngOnDestroy = function () {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.subscriptions.map(function (subscription) { subscription.unsubscribe(); });
    };
    __decorate([
        core_1.Input('_contactsList')
    ], WhatsappListSidebarComponent.prototype, "_contactsList", null);
    __decorate([
        core_1.Input()
    ], WhatsappListSidebarComponent.prototype, "selectedContact", void 0);
    __decorate([
        core_1.Output()
    ], WhatsappListSidebarComponent.prototype, "selectContact", void 0);
    __decorate([
        core_1.Output()
    ], WhatsappListSidebarComponent.prototype, "GetMoreContacts", void 0);
    __decorate([
        core_1.Output()
    ], WhatsappListSidebarComponent.prototype, "SearchValue", void 0);
    __decorate([
        core_1.Output()
    ], WhatsappListSidebarComponent.prototype, "Edit", void 0);
    __decorate([
        core_1.Input()
    ], WhatsappListSidebarComponent.prototype, "Loading", void 0);
    __decorate([
        core_1.Input()
    ], WhatsappListSidebarComponent.prototype, "Initialized", void 0);
    __decorate([
        core_1.Input()
    ], WhatsappListSidebarComponent.prototype, "Searching", void 0);
    __decorate([
        core_1.Input('updatedContact')
    ], WhatsappListSidebarComponent.prototype, "UpdatedContact", null);
    __decorate([
        core_1.ViewChild('scrollContainer')
    ], WhatsappListSidebarComponent.prototype, "scrollContainer", void 0);
    WhatsappListSidebarComponent = __decorate([
        core_1.Component({
            selector: 'app-whatsapp-list-sidebar',
            templateUrl: './whatsapp-list-sidebar.component.html',
            styleUrls: ['./whatsapp-list-sidebar.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None,
            changeDetection: core_1.ChangeDetectionStrategy.OnPush
        })
    ], WhatsappListSidebarComponent);
    return WhatsappListSidebarComponent;
}());
exports.WhatsappListSidebarComponent = WhatsappListSidebarComponent;
//# sourceMappingURL=whatsapp-list-sidebar.component.js.map