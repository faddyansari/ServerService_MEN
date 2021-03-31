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
exports.MergeConfirmationComponent = void 0;
var core_1 = require("@angular/core");
var dialog_1 = require("@angular/material/dialog");
var MergeConfirmationComponent = /** @class */ (function () {
    function MergeConfirmationComponent(_authService, data, dialogRef, _ticketService) {
        this._authService = _authService;
        this.data = data;
        this.dialogRef = dialogRef;
        this._ticketService = _ticketService;
        this.arr = [];
        this.checkedList_original = [];
        this.mergeTicketIds = [];
        this.checkedList = [];
        this.loading = false;
        this.submitError = true;
        this.checkedList_original = data;
        this.mergeTicketIds = this.checkedList_original.map(function (e) { return e._id; });
        // console.log(this.mergeTicketIds);
        this.checkedList = data.map(function (d) {
            return {
                details: d,
                _id: d._id,
                subject: d.subject,
                checked: false
            };
        });
    }
    MergeConfirmationComponent.prototype.setPrimaryTicket = function (id, event) {
        this.checkedList.map(function (element) {
            if (element._id == id) {
                return element.checked = event.target.checked;
            }
            else {
                return element.checked = false;
            }
        });
        if (!this.checkedList.filter(function (d) { return d.checked; }).length) {
            this.submitError = true;
        }
        else {
            this.submitError = false;
        }
        // console.log(this.submitError);
    };
    // console.log(id);
    // console.log(event);
    // if (event.target.checked) {
    // 	this.checkedList.push(id);
    // 	console.log(this.checkedList);
    // }
    // else if(!event.target.checked){
    // 	this.checkedList.splice(index1, 1);
    // 	console.log(this.checkedList);
    // }
    MergeConfirmationComponent.prototype.submitForm = function () {
        var _this = this;
        var secondaryTicketDetails = [];
        var secondaryTicketReference = [];
        var mergedTicketsDetails = [];
        var primaryReference = '';
        this.checkedList.map(function (d) {
            // mergedTicketsDetails = mergedTicketsDetails.concat(d.details);
            // console.log(mergedTicketsDetails);
            if (!d.checked) {
                secondaryTicketReference.push(d._id);
                secondaryTicketDetails.push({
                    _id: d.details._id,
                    viewColor: d.details.viewColor,
                    subject: d.details.subject,
                    assigned_to: (d.details.assigned) ? d.details.assigned : '',
                    visitor: d.details.visitor
                });
            }
            else {
                primaryReference = d._id;
            }
            mergedTicketsDetails = mergedTicketsDetails.concat(d.details);
        });
        //console.log(this.checkedList);
        // let primaryReference = this.checkedList.filter(d => { return (d.checked) })[0]._id;;
        this.loading = false;
        this._ticketService.TicketMerge({ merged: true, mergedTicketIds: this.mergeTicketIds }, primaryReference, secondaryTicketDetails, mergedTicketsDetails, secondaryTicketReference).subscribe(function (res) {
            _this.loading = false;
            if (res.status == 'ok') {
                _this.dialogRef.close({
                    status: 'ok',
                    primayTicket: res.primayTicket,
                    secondaryTicket: res.secondaryTicket
                });
            }
            else if (res.status == 'error') {
                _this.dialogRef.close({
                    status: 'error',
                    ticket: '',
                });
            }
        });
    };
    MergeConfirmationComponent = __decorate([
        core_1.Component({
            selector: 'app-merge-confirmation',
            templateUrl: './merge-confirmation.component.html',
            styleUrls: ['./merge-confirmation.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        }),
        __param(1, core_1.Inject(dialog_1.MAT_DIALOG_DATA))
    ], MergeConfirmationComponent);
    return MergeConfirmationComponent;
}());
exports.MergeConfirmationComponent = MergeConfirmationComponent;
//# sourceMappingURL=merge-confirmation.component.js.map