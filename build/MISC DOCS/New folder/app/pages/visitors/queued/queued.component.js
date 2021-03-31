"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueuedComponent = void 0;
var core_1 = require("@angular/core");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var QueuedComponent = /** @class */ (function () {
    function QueuedComponent(changeDetectorRef) {
        this.changeDetectorRef = changeDetectorRef;
        //INPUT
        this._visitorList = new BehaviorSubject_1.BehaviorSubject([]);
        this._selectedVisitor = new BehaviorSubject_1.BehaviorSubject(undefined);
        this.loading = true;
        this.action = "inviteChat";
        //OUTPUT
        this.SelectedVisitorId = new core_1.EventEmitter();
        this.ManualAssignmentVisitorId = new core_1.EventEmitter();
        this.performingAction = {};
        this.changeDetectorRef.detach();
    }
    Object.defineProperty(QueuedComponent.prototype, "tick", {
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
    Object.defineProperty(QueuedComponent.prototype, "selectedVisitor", {
        set: function (value) {
            // console.log('Setting Selecting Visitor');
            this._selectedVisitor.next(value);
            this.changeDetectorRef.detectChanges();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(QueuedComponent.prototype, "visitorList", {
        set: function (value) {
            // console.log(value);
            // console.log('Got New Visitor List', Date.parse(new Date().toISOString()));
            this._visitorList.next(value);
            this.changeDetectorRef.detectChanges();
        },
        enumerable: false,
        configurable: true
    });
    QueuedComponent.prototype.ngOnInit = function () {
        if (this.action && this.action == "inviteChat") {
            this.ManualQueueAssignment(this._selectedVisitor.getValue().id);
        }
        if (this.ManualAssign) {
            this.ManualQueueAssignment(this.visitorList[this.visitorList.findIndex(function (visitor) {
                return (visitor.state == 2);
            })].id);
        }
    };
    QueuedComponent.prototype.ManualQueueAssignment = function (visitorid) {
        this.ManualAssignmentVisitorId.emit(visitorid);
    };
    // queuedVisitors(visitorList) {
    //     return visitorList.filter(visitor => {
    //         if (visitor.state == 2 && !visitor.inactive) return visitor
    //     });
    // }
    QueuedComponent.prototype.SelectVisitor = function (visitorId) {
        this.SelectedVisitorId.emit(visitorId);
    };
    __decorate([
        core_1.Input('searchValue')
    ], QueuedComponent.prototype, "searchValue", void 0);
    __decorate([
        core_1.Input('loading')
    ], QueuedComponent.prototype, "loading", void 0);
    __decorate([
        core_1.Input('action')
    ], QueuedComponent.prototype, "action", void 0);
    __decorate([
        core_1.Input('ManualAssign')
    ], QueuedComponent.prototype, "ManualAssign", void 0);
    __decorate([
        core_1.Input('tick')
    ], QueuedComponent.prototype, "tick", null);
    __decorate([
        core_1.Input('selectedVisitor')
    ], QueuedComponent.prototype, "selectedVisitor", null);
    __decorate([
        core_1.Input('visitorList')
    ], QueuedComponent.prototype, "visitorList", null);
    __decorate([
        core_1.Output('SelectedVisitorId')
    ], QueuedComponent.prototype, "SelectedVisitorId", void 0);
    __decorate([
        core_1.Output('ManualAssignmentVisitorId')
    ], QueuedComponent.prototype, "ManualAssignmentVisitorId", void 0);
    __decorate([
        core_1.Input('performingAction')
    ], QueuedComponent.prototype, "performingAction", void 0);
    QueuedComponent = __decorate([
        core_1.Component({
            selector: 'app-queued',
            templateUrl: './queued.component.html',
            styleUrls: ['./queued.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None,
            changeDetection: core_1.ChangeDetectionStrategy.OnPush
        })
    ], QueuedComponent);
    return QueuedComponent;
}());
exports.QueuedComponent = QueuedComponent;
//# sourceMappingURL=queued.component.js.map