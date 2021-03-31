"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowsingComponent = void 0;
var core_1 = require("@angular/core");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var BrowsingComponent = /** @class */ (function () {
    function BrowsingComponent(changeDetectorRef) {
        this.changeDetectorRef = changeDetectorRef;
        //INPUT
        this._visitorList = new BehaviorSubject_1.BehaviorSubject([]);
        this._selectedVisitor = new BehaviorSubject_1.BehaviorSubject(undefined);
        this.aEng = false;
        this.loading = true;
        this.action = "initiateChat";
        this.performingAction = {};
        //OUTPUT
        this.SelectedVisitorId = new core_1.EventEmitter();
        this.InitiateChatVisitorId = new core_1.EventEmitter();
        this.changeDetectorRef.detach();
    }
    Object.defineProperty(BrowsingComponent.prototype, "tick", {
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
    Object.defineProperty(BrowsingComponent.prototype, "selectedVisitor", {
        set: function (value) {
            // console.log('Setting Selecting Visitor');
            this._selectedVisitor.next(value);
            this.changeDetectorRef.detectChanges();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BrowsingComponent.prototype, "visitorList", {
        set: function (value) {
            // console.log(value);
            // console.log('Got New Visitor List', Date.parse(new Date().toISOString()));
            this._visitorList.next(value);
            this.changeDetectorRef.detectChanges();
        },
        enumerable: false,
        configurable: true
    });
    BrowsingComponent.prototype.ngOnInit = function () {
        if (this.action && this.action == "initiateChat") {
            this.InitiateChat(this._selectedVisitor.getValue().id);
            this._visitorList.getValue().length;
        }
    };
    BrowsingComponent.prototype.ngAfterViewInit = function () {
        //Called after every check of the component's view. Applies to components only.
        //Add 'implements AfterViewChecked' to the class.
        this.changeDetectorRef.detectChanges();
    };
    BrowsingComponent.prototype.InitiateChat = function (visitorid) {
        this.InitiateChatVisitorId.emit(visitorid);
    };
    // browsingVisitors(visitorList) {
    //     return this._visitorList.getValue().filter(visitor => {
    //         if ((visitor.state == 1 || visitor.state == 8) && !visitor.inactive) return visitor
    //     });
    // }
    BrowsingComponent.prototype.SelectVisitor = function (visitorId) {
        // console.log('Set Selected Visitor Browser Component');
        this.SelectedVisitorId.emit(visitorId);
    };
    __decorate([
        core_1.Input('searchValue')
    ], BrowsingComponent.prototype, "searchValue", void 0);
    __decorate([
        core_1.Input('aEng')
    ], BrowsingComponent.prototype, "aEng", void 0);
    __decorate([
        core_1.Input('loading')
    ], BrowsingComponent.prototype, "loading", void 0);
    __decorate([
        core_1.Input('tick')
    ], BrowsingComponent.prototype, "tick", null);
    __decorate([
        core_1.Input('action')
    ], BrowsingComponent.prototype, "action", void 0);
    __decorate([
        core_1.Input('performingAction')
    ], BrowsingComponent.prototype, "performingAction", void 0);
    __decorate([
        core_1.Input('selectedVisitor')
    ], BrowsingComponent.prototype, "selectedVisitor", null);
    __decorate([
        core_1.Input('visitorList')
    ], BrowsingComponent.prototype, "visitorList", null);
    __decorate([
        core_1.Output('SelectedVisitorId')
    ], BrowsingComponent.prototype, "SelectedVisitorId", void 0);
    __decorate([
        core_1.Output('InitiateChatVisitorId')
    ], BrowsingComponent.prototype, "InitiateChatVisitorId", void 0);
    BrowsingComponent = __decorate([
        core_1.Component({
            selector: 'app-browsing',
            templateUrl: './browsing.component.html',
            styleUrls: ['./browsing.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None,
            changeDetection: core_1.ChangeDetectionStrategy.OnPush
        })
    ], BrowsingComponent);
    return BrowsingComponent;
}());
exports.BrowsingComponent = BrowsingComponent;
//# sourceMappingURL=browsing.component.js.map