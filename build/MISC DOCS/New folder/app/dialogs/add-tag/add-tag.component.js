"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddTagComponent = void 0;
var core_1 = require("@angular/core");
var dialog_1 = require("@angular/material/dialog");
var AddTagComponent = /** @class */ (function () {
    function AddTagComponent(_ticketService, data, dialogRef) {
        //console.log(data);
        this._ticketService = _ticketService;
        this.data = data;
        this.dialogRef = dialogRef;
        this.tagEdit = false;
        this.tags = [];
        this.ids = [];
        this.subscriptions = [];
        // this.subscriptions.push(this._ticketService.ThreadList.subscribe(serverAddress => {
        // 	this.Threadlist = serverAddress;
        // }));
    }
    AddTagComponent.prototype.ngOnInit = function () {
    };
    AddTagComponent.prototype.BulkTagAssign = function (tags) {
        //console.log(tags);
        this.ids = this.data[0].map(function (e) { return e._id; });
        //console.log(this.ids);
        // this._ticketService.BulkTagAssignment(this.ids, tags).subscribe(res=>{
        //   if(res.status =="ok"){
        //    // console.log(res);
        //     this._ticketService.RefreshList();
        //     this.dialogRef.close({
        //       status: true,
        //     });
        //   }
        // });
    };
    AddTagComponent.prototype.ngOnDestroy = function () {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
    };
    AddTagComponent.prototype.transform = function () {
    };
    AddTagComponent = __decorate([
        core_1.Component({
            selector: 'app-add-tag',
            templateUrl: './add-tag.component.html',
            styleUrls: ['./add-tag.component.scss']
        }),
        __param(1, core_1.Inject(dialog_1.MAT_DIALOG_DATA))
    ], AddTagComponent);
    return AddTagComponent;
}());
exports.AddTagComponent = AddTagComponent;
//# sourceMappingURL=add-tag.component.js.map