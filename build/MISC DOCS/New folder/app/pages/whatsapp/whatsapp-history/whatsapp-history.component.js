"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsappHistoryComponent = void 0;
var core_1 = require("@angular/core");
var WhatsappHistoryComponent = /** @class */ (function () {
    function WhatsappHistoryComponent(_utilityService) {
        this._utilityService = _utilityService;
        this.contact = undefined;
        this.GetAttachments = new core_1.EventEmitter();
        this.GetMoreAttachments = new core_1.EventEmitter();
        this.tabs = {
            'whatsapp_media': true,
            'whatsapp_status': false,
            'whatsapp_stories': false
        };
    }
    Object.defineProperty(WhatsappHistoryComponent.prototype, "_contact", {
        set: function (value) {
            this.contact = value;
            if (value) {
                if (!value.attachments) {
                    value.attachments = {};
                    this.contact = value;
                }
                if (this.tabs['whatsapp_media'] && !this.contact.attachments.media) {
                    this.GetAttachments.emit({ _id: value._id, type: '1' });
                }
                if (this.tabs['whatsapp_files'] && !this.contact.attachments.files) {
                    this.GetAttachments.emit({ _id: value._id, type: '4' });
                }
                if (this.tabs['whatsapp_status']) { }
                if (this.tabs['whatsapp_stories']) { }
            }
            // console.log('Contact Attachments : ', value);
        },
        enumerable: false,
        configurable: true
    });
    WhatsappHistoryComponent.prototype.ngOnInit = function () {
    };
    WhatsappHistoryComponent.prototype.GetAttachmentsForView = function () {
        if (this.tabs['whatsapp_media']) {
            // console.log('Media :', this.contact.attachments.media);
            if (this.contact.attachments.media)
                return this.contact.attachments.media;
            else
                return [];
        }
        if (this.tabs['whatsapp_files']) {
            // console.log('Files : ', this.contact.attachments.files);
            if (this.contact.attachments.files)
                return this.contact.attachments.files;
            else
                return [];
        }
    };
    WhatsappHistoryComponent.prototype.vhListTabs = function (tab) {
        var _this = this;
        Object.keys(this.tabs).map(function (key) {
            if (key == tab) {
                _this.tabs[key] = true;
                switch (tab) {
                    case 'whatsapp_media':
                        if (!_this.contact.attachments.media) {
                            // console.log('Get Emitting Media');
                            _this.GetAttachments.emit({ _id: _this.contact._id, type: '1' });
                        }
                        break;
                    default:
                        if (!_this.contact.attachments.files) {
                            // console.log('Get Emitting FIles');
                            _this.GetAttachments.emit({ _id: _this.contact._id, type: '4' });
                        }
                        break;
                }
            }
            else {
                _this.tabs[key] = false;
            }
        });
    };
    __decorate([
        core_1.Output()
    ], WhatsappHistoryComponent.prototype, "GetAttachments", void 0);
    __decorate([
        core_1.Output()
    ], WhatsappHistoryComponent.prototype, "GetMoreAttachments", void 0);
    __decorate([
        core_1.Input('_contact')
    ], WhatsappHistoryComponent.prototype, "_contact", null);
    WhatsappHistoryComponent = __decorate([
        core_1.Component({
            selector: 'app-whatsapp-history',
            templateUrl: './whatsapp-history.component.html',
            styleUrls: ['./whatsapp-history.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], WhatsappHistoryComponent);
    return WhatsappHistoryComponent;
}());
exports.WhatsappHistoryComponent = WhatsappHistoryComponent;
//# sourceMappingURL=whatsapp-history.component.js.map