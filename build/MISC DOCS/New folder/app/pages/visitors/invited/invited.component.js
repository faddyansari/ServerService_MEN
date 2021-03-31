"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvitedComponent = void 0;
var core_1 = require("@angular/core");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var InvitedComponent = /** @class */ (function () {
    function InvitedComponent(changeDetectorRef) {
        this.changeDetectorRef = changeDetectorRef;
        //INPUT
        this._visitorList = new BehaviorSubject_1.BehaviorSubject([]);
        this._selectedVisitor = new BehaviorSubject_1.BehaviorSubject(undefined);
        this.loading = true;
        //OUTPUT
        this.SelectedVisitorId = new core_1.EventEmitter();
        this.changeDetectorRef.detach();
    }
    Object.defineProperty(InvitedComponent.prototype, "tick", {
        set: function (value) {
            this._visitorList.next(this._visitorList.getValue().map(function (visitor) {
                var currentDate = Date.parse(new Date().toISOString()) - Date.parse(new Date(visitor.creationDate).toISOString());
                visitor.seconds = Math.floor((currentDate / 1000) % 60);
                visitor.minutes = Math.floor((currentDate / 1000 / 60) % 60);
                visitor.hours = Math.floor((currentDate / 1000) / 60 / 60);
                return visitor;
            }));
            this.changeDetectorRef.detectChanges();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(InvitedComponent.prototype, "selectedVisitor", {
        set: function (value) {
            // console.log('Setting Selecting Visitor');
            this._selectedVisitor.next(value);
            this.changeDetectorRef.detectChanges();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(InvitedComponent.prototype, "visitorList", {
        set: function (value) {
            // console.log(value.length);
            console.log('Got New Visitor List Invited : ', value.length);
            this._visitorList.next(value);
            this.changeDetectorRef.detectChanges();
        },
        enumerable: false,
        configurable: true
    });
    InvitedComponent.prototype.ngOnInit = function () {
    };
    // invitedVisitors(visitorList) {
    //     return visitorList.filter(visitor => {
    //         if (((visitor.state == 4) || (visitor.state == 5)) && !visitor.inactive) return visitor
    //     });
    // }
    InvitedComponent.prototype.SelectVisitor = function (visitorId) {
        this.SelectedVisitorId.emit(visitorId);
    };
    InvitedComponent.prototype.identifyChange = function (index, item) {
        return item._id;
    };
    __decorate([
        core_1.Input('searchValue')
    ], InvitedComponent.prototype, "searchValue", void 0);
    __decorate([
        core_1.Input('loading')
    ], InvitedComponent.prototype, "loading", void 0);
    __decorate([
        core_1.Input('tick')
    ], InvitedComponent.prototype, "tick", null);
    __decorate([
        core_1.Input('selectedVisitor')
    ], InvitedComponent.prototype, "selectedVisitor", null);
    __decorate([
        core_1.Input('visitorList')
    ], InvitedComponent.prototype, "visitorList", null);
    __decorate([
        core_1.Output('SelectedVisitorId')
    ], InvitedComponent.prototype, "SelectedVisitorId", void 0);
    InvitedComponent = __decorate([
        core_1.Component({
            selector: 'app-invited',
            templateUrl: './invited.component.html',
            styleUrls: ['./invited.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None,
            changeDetection: core_1.ChangeDetectionStrategy.OnPush
        })
    ], InvitedComponent);
    return InvitedComponent;
}());
exports.InvitedComponent = InvitedComponent;
//# sourceMappingURL=invited.component.js.map