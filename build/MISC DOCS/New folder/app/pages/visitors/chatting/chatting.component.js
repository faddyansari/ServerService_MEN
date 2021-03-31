"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChattingComponent = void 0;
var core_1 = require("@angular/core");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var ChattingComponent = /** @class */ (function () {
    function ChattingComponent(changeDetectorRef) {
        this.changeDetectorRef = changeDetectorRef;
        //INPUT
        this._visitorList = new BehaviorSubject_1.BehaviorSubject([]);
        this._selectedVisitor = new BehaviorSubject_1.BehaviorSubject(undefined);
        this.loading = true;
        this.action = "transferChat";
        this.SuperVisedChatList = [];
        this.performingAction = {};
        //OUTPUT
        this.SelectedVisitorId = new core_1.EventEmitter();
        this.TransferChatDetails = new core_1.EventEmitter();
        this.endSuperVision = new core_1.EventEmitter();
        this.SuperviseChat = new core_1.EventEmitter();
        this.changeDetectorRef.detach();
    }
    Object.defineProperty(ChattingComponent.prototype, "tick", {
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
    Object.defineProperty(ChattingComponent.prototype, "selectedVisitor", {
        set: function (value) {
            // console.log('Setting Selecting Visitor');
            this._selectedVisitor.next(value);
            this.changeDetectorRef.detectChanges();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChattingComponent.prototype, "visitorList", {
        set: function (value) {
            // console.log(value);
            // console.log('Got New Visitor List', Date.parse(new Date().toISOString()));
            this._visitorList.next(value);
            this.changeDetectorRef.detectChanges();
        },
        enumerable: false,
        configurable: true
    });
    ChattingComponent.prototype.ngOnInit = function () {
        //console.log(this.performingAction);
        if (this.action && this.action == "initiateChat") {
            this.TransferChat(this._selectedVisitor.getValue().id, this._selectedVisitor.getValue().location);
        }
    };
    ChattingComponent.prototype.EndSuperVision = function (visitor) {
        if (confirm('Are you sure you want to end the Supervision?')) {
            this.endSuperVision.emit({
                cid: visitor.conversationID
            });
        }
    };
    ChattingComponent.prototype.TransferChat = function (sid, location) {
        //console.log(this.performingAction);
        this.TransferChatDetails.emit({
            sid: sid,
            location: location
        });
    };
    // chattingVisitors(visitorList) {
    //     return this._visitorList.getValue().filter(visitor => {
    //         if (visitor.state == 3 && !visitor.inactive) return visitor
    //     });
    // }
    ChattingComponent.prototype.SelectVisitor = function (visitorId) {
        this.SelectedVisitorId.emit(visitorId);
    };
    // identifyChange(index, item) {
    //     return item._id;
    // }
    ChattingComponent.prototype.SuperViseChat = function (event, visitor) {
        //this.performingAction
        if (confirm('Are you sure you want to Supervise the Chat')) {
            this.SuperviseChat.emit(visitor);
        }
        // this.SuperviseChat.emit('/chats/' + visitor.conversationID);
    };
    ChattingComponent.prototype.CheckIfChatSuperVised = function (cid) {
        return this.SuperVisedChatList.includes(cid);
    };
    __decorate([
        core_1.Input('searchValue')
    ], ChattingComponent.prototype, "searchValue", void 0);
    __decorate([
        core_1.Input('loading')
    ], ChattingComponent.prototype, "loading", void 0);
    __decorate([
        core_1.Input('permissions')
    ], ChattingComponent.prototype, "permissions", void 0);
    __decorate([
        core_1.Input('agent')
    ], ChattingComponent.prototype, "agent", void 0);
    __decorate([
        core_1.Input('action')
    ], ChattingComponent.prototype, "action", void 0);
    __decorate([
        core_1.Input('SuperVisedChatList')
    ], ChattingComponent.prototype, "SuperVisedChatList", void 0);
    __decorate([
        core_1.Input('performingAction')
    ], ChattingComponent.prototype, "performingAction", void 0);
    __decorate([
        core_1.Input('tick')
    ], ChattingComponent.prototype, "tick", null);
    __decorate([
        core_1.Input('selectedVisitor')
    ], ChattingComponent.prototype, "selectedVisitor", null);
    __decorate([
        core_1.Input('visitorList')
    ], ChattingComponent.prototype, "visitorList", null);
    __decorate([
        core_1.Output('SelectedVisitorId')
    ], ChattingComponent.prototype, "SelectedVisitorId", void 0);
    __decorate([
        core_1.Output('TransferChatDetails')
    ], ChattingComponent.prototype, "TransferChatDetails", void 0);
    __decorate([
        core_1.Output('endSuperVision')
    ], ChattingComponent.prototype, "endSuperVision", void 0);
    __decorate([
        core_1.Output('SuperviseChat')
    ], ChattingComponent.prototype, "SuperviseChat", void 0);
    ChattingComponent = __decorate([
        core_1.Component({
            selector: 'app-chatting',
            templateUrl: './chatting.component.html',
            styleUrls: ['./chatting.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None,
            changeDetection: core_1.ChangeDetectionStrategy.OnPush
        })
    ], ChattingComponent);
    return ChattingComponent;
}());
exports.ChattingComponent = ChattingComponent;
//# sourceMappingURL=chatting.component.js.map