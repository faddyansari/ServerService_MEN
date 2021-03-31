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
exports.ConvertChatToTicketComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var dialog_1 = require("@angular/material/dialog");
var ConvertChatToTicketComponent = /** @class */ (function () {
    function ConvertChatToTicketComponent(data, _authService, _socketService, formbuilder, _chatService, dialogRef) {
        var _this = this;
        this.data = data;
        this._authService = _authService;
        this.formbuilder = formbuilder;
        this._chatService = _chatService;
        this.dialogRef = dialogRef;
        this.subscriptions = [];
        this.groupsList = [];
        this.emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        this.whiteSpace = /^\S*$/;
        this.numberRegex = /^([^0-9]*)$/;
        // CharacterLimit = /^[0-9A-Za-z!@.,;:'"?-]{1,100}\z/;
        this.SpecialChar = /^[_A-z0-9]*((-|\s)*[_A-z0-9])*$/;
        this.loading = false;
        this.submitted = false;
        this.imageError = false;
        this.conversation = [];
        this.filteredConversation = [];
        if (data.currentConversation) {
            this.currentConversation = data.currentConversation;
            this.conversation = data.currentConversation.messages;
            this.filteredConversation = data.currentConversation.messages;
        }
        this.addTicketForm = formbuilder.group({
            'subject': [null, [forms_1.Validators.required]],
            'state': ['OPEN', forms_1.Validators.required],
            'priority': ['LOW', forms_1.Validators.required],
            'visitor': formbuilder.group({
                'name': [null, [forms_1.Validators.required, forms_1.Validators.pattern(this.numberRegex), forms_1.Validators.pattern(this.SpecialChar)]],
                'email': [(this.currentConversation && this.currentConversation.visitorEmail && this.currentConversation.visitorEmail != 'Unregistered') ? this.currentConversation.visitorEmail : null,
                    [
                        forms_1.Validators.pattern(this.emailPattern),
                        forms_1.Validators.required
                    ]
                ],
            })
        });
        this.subscriptions.push(_socketService.getSocket().subscribe(function (data) { return _this.socket = data; }));
        this.subscriptions.push(_authService.getAgent().subscribe(function (agent) {
            //console.log(agent);
            _this.agent = agent;
        }));
        // this.subscriptions.push(_chatService.getCurrentConversation().subscribe(currentConversation => {
        //   //if (conversation.length > 0) {
        //   // console.log(currentConversation);
        //   this.currentConversation = currentConversation;
        //   this.conversation = currentConversation.messages;
        //   this.filteredConversation = currentConversation.messages;
        //   // }
        // }));
    }
    ConvertChatToTicketComponent.prototype.ngOnInit = function () { };
    ConvertChatToTicketComponent.prototype.ngAfterViewInit = function () { };
    ConvertChatToTicketComponent.prototype.ngOnDestroy = function () {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
    };
    ConvertChatToTicketComponent.prototype.noWhitespaceValidator = function (control) {
        var isWhitespace = (control.value || '').trim().length === 0;
        var isValid = !isWhitespace;
        return isValid ? null : { 'whitespace': true };
    };
    ConvertChatToTicketComponent.prototype.submitForm = function (form) {
        var convo = this.filteredConversation.filter(function (msg) { return !msg.unselected; });
        //console.log('Value Submitted');
        //this.agentRegForm.valid
        if (this.addTicketForm.valid) {
            var details = {
                conversation: JSON.stringify(convo),
                // message: {
                //   from: this.agent.email,
                //   to: this.addTicketForm.get('visitor').get('email').value,
                //   body: this.addTicketForm.get('visitor').get('message').value
                // },
                thread: {
                    subject: this.addTicketForm.get('subject').value,
                    state: this.addTicketForm.get('state').value,
                    priority: this.addTicketForm.get('priority').value,
                    visitor: {
                        name: this.addTicketForm.get('visitor').get('name').value,
                        email: this.addTicketForm.get('visitor').get('email').value,
                    }
                }
            };
            this.dialogRef.close(details);
        }
    };
    ConvertChatToTicketComponent.prototype.ImageBroken = function () {
        this.imageError = true;
    };
    ConvertChatToTicketComponent.prototype.CheckAttachmentType = function (data) {
        return (typeof data === 'string');
    };
    ConvertChatToTicketComponent.prototype.EditMessage = function (Message, Delete) {
        this.filteredConversation = this.filteredConversation.map(function (msg) {
            if (msg._id == Message._id)
                msg.unselected = Delete;
            return msg;
        });
    };
    ConvertChatToTicketComponent = __decorate([
        core_1.Component({
            selector: 'app-convert-chat-to-ticket',
            templateUrl: './convert-chat-to-ticket.component.html',
            styleUrls: ['./convert-chat-to-ticket.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        }),
        __param(0, core_1.Inject(dialog_1.MAT_DIALOG_DATA))
    ], ConvertChatToTicketComponent);
    return ConvertChatToTicketComponent;
}());
exports.ConvertChatToTicketComponent = ConvertChatToTicketComponent;
//# sourceMappingURL=convert-chat-to-ticket.component.js.map