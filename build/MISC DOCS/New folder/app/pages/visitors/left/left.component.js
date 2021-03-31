"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeftComponent = void 0;
var core_1 = require("@angular/core");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var LeftComponent = /** @class */ (function () {
    function LeftComponent(changeDetectorRef) {
        this.changeDetectorRef = changeDetectorRef;
        //INPUT
        this._visitorList = new BehaviorSubject_1.BehaviorSubject([]);
        this._selectedVisitor = new BehaviorSubject_1.BehaviorSubject(undefined);
        this.loading = true;
        //OUTPUT
        this.SelectedVisitorIdLeft = new core_1.EventEmitter();
        this.changeDetectorRef.detach();
    }
    Object.defineProperty(LeftComponent.prototype, "tick", {
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
    Object.defineProperty(LeftComponent.prototype, "selectedVisitor", {
        set: function (value) {
            // console.log('Setting Selecting Visitor');
            this._selectedVisitor.next(value);
            this.changeDetectorRef.detectChanges();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LeftComponent.prototype, "LeftvisitorList", {
        set: function (value) {
            // console.log(value);
            // console.log('Got New Visitor List', Date.parse(new Date().toISOString()));
            this._visitorList.next(value);
            this.changeDetectorRef.detectChanges();
        },
        enumerable: false,
        configurable: true
    });
    LeftComponent.prototype.ngOnInit = function () {
    };
    // leftVisitors(visitorList) {
    //     return visitorList;
    // }
    LeftComponent.prototype.SelectVisitor = function (visitorId) {
        this.SelectedVisitorIdLeft.emit(visitorId);
    };
    LeftComponent.prototype.identifyChange = function (index, item) {
        return item._id;
    };
    __decorate([
        core_1.Input('searchValue')
    ], LeftComponent.prototype, "searchValue", void 0);
    __decorate([
        core_1.Input('loading')
    ], LeftComponent.prototype, "loading", void 0);
    __decorate([
        core_1.Input('tick')
    ], LeftComponent.prototype, "tick", null);
    __decorate([
        core_1.Input('selectedVisitor')
    ], LeftComponent.prototype, "selectedVisitor", null);
    __decorate([
        core_1.Input('LeftvisitorList')
    ], LeftComponent.prototype, "LeftvisitorList", null);
    __decorate([
        core_1.Output('SelectedVisitorIdLeft')
    ], LeftComponent.prototype, "SelectedVisitorIdLeft", void 0);
    LeftComponent = __decorate([
        core_1.Component({
            selector: 'app-left',
            templateUrl: './left.component.html',
            styleUrls: ['./left.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None,
            changeDetection: core_1.ChangeDetectionStrategy.OnPush
        })
    ], LeftComponent);
    return LeftComponent;
}());
exports.LeftComponent = LeftComponent;
//# sourceMappingURL=left.component.js.map