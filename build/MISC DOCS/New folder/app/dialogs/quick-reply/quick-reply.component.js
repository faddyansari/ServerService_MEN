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
exports.QuickReplyComponent = void 0;
var core_1 = require("@angular/core");
var dialog_1 = require("@angular/material/dialog");
var QuickReplyComponent = /** @class */ (function () {
    function QuickReplyComponent(_ticketService, data, dialogRef, _authService) {
        //console.log(data);
        var _this = this;
        this._ticketService = _ticketService;
        this.data = data;
        this.dialogRef = dialogRef;
        this._authService = _authService;
        this.shiftdown = false;
        this.msgBody = '';
        this.agent = {};
        this.subscriptions = [];
        this.idsArray = [];
        // ThreadList:any;
        this.config = {
            placeholder: 'Reply to this ticket..',
            toolbar: [
                ['style', ['bold', 'italic', 'underline']],
                ['fontsize', ['fontsize']],
                ['color', ['color']],
                ['fontName', ['fontName']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['height', ['height']],
                ['insert', ['linkDialogShow', 'unlink']],
                ['view', ['fullscreen', 'codeview', 'undo', 'redo']]
            ]
        };
        this.subscriptions.push(_authService.getAgent().subscribe(function (agent) {
            _this.agent = agent;
        }));
    }
    QuickReplyComponent.prototype.keydownX = function (event) {
        switch (event.key.toLowerCase()) {
            case 'shift':
                {
                    this.shiftdown = true;
                    break;
                }
        }
    };
    QuickReplyComponent.prototype.keyupX = function (event) {
        var _this = this;
        switch (event.key.toLowerCase()) {
            case 'enter':
                {
                    if (!this.shiftdown) {
                        this.SendTicketMessage();
                    }
                    break;
                }
            case 'shift':
                {
                    setTimeout(function () {
                        _this.shiftdown = false;
                    }, 100);
                    break;
                }
        }
    };
    QuickReplyComponent.prototype.SendTicketMessage = function () {
        var _this = this;
        this.data.details.map(function (id) {
            _this.idsArray.push(id._id);
        });
        //console.log(this.idsArray);
        if (this.msgBody.trim()) {
            // for (let i = 0; i < this.idsArray.length; i++) {
            // this._ticketService.ReplyTicketFromList({
            // 	senderType: 'Agent',
            // 	message: this.msgBody,
            // 	from: this.agent.email,
            // 	// to: this.data.details[i].visitor.email,
            // 	to:this.data.details[0].visitor.email,
            // 	// tid: [this.idsArray[i]],
            // 	tid: this.data.details[0]._id,
            // 	// subject: this.data.details[i].subject,
            // 	subject: this.data.details[0].subject,
            // 	attachment:[]
            // });
            this.msgBody = '';
        }
        // }
        this.dialogRef.close({
            status: true
        });
    };
    QuickReplyComponent = __decorate([
        core_1.Component({
            selector: 'app-quick-reply',
            templateUrl: './quick-reply.component.html',
            styleUrls: ['./quick-reply.component.scss']
        }),
        __param(1, core_1.Inject(dialog_1.MAT_DIALOG_DATA))
    ], QuickReplyComponent);
    return QuickReplyComponent;
}());
exports.QuickReplyComponent = QuickReplyComponent;
//# sourceMappingURL=quick-reply.component.js.map